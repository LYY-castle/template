import jQuery from 'jquery'
import that from '@/views/monitor_workingset'
export default (new function() {
  var uuid_list = new Array()
  var uuid_dn_list = new Array()
  var EventObject = jQuery({})
  var Send2_wsCTI_terval_id = ''
  var Send2wsCTIterval = ''
  var islogin = false
  var UUID = ''
  var AgentID = ''
  var DN = ''
  EventObject.bind('onopen', function(event) {
    that.methods.NewSessionConnected(event)
  })
  EventObject.bind('onclose', function(event) {
    that.methods.on_SessionClose(event)
  })
  EventObject.bind('onerror', function(event) {
    that.methods.on_SessionError(event)
  })
  EventObject.bind('on_error', function(event, errtype, errdescription) {
    that.methods.on_error(event, errtype, errdescription)
  })
  EventObject.bind('on_monistorStatus', function(event, data) {
    that.methods.on_monistorStatus(event, data)
  })

  EventObject.bind('on_AgentStatusList', function(event, agentid, DN, reasoncode, UpdateTime) {
    that.methods.on_AgentStatusList(event, agentid, DN, reasoncode, UpdateTime)
  })
  EventObject.bind('on_tierlist', function(event, queue, AgentID) {
    that.methods.on_tierlist(event, queue, AgentID)
  })
  EventObject.bind('on_queuelist', function(event, queue, queue_count) {
    that.methods.on_queuelist(event, queue, queue_count)
  })
  EventObject.bind('on_tier_add', function(event, agentid, queue) {
    that.methods.on_tier_add(event, agentid, queue)
  })

  EventObject.bind('on_reasonchange', function(event, agentid, DN, reasoncode) {
    that.methods.on_reasonchange(event, agentid, DN, reasoncode)
  })

  EventObject.bind('on_queuecount', function(event, queuename, queuecount) {
    that.methods.on_queuecount(event, queuename, queuecount)
  })	// 增加计算队列排队数

  EventObject.bind('onUpdateCallInfo', function(event, beforeOtherLegDN, afterOterLegDN, updateLine) {
    that.methods.onUpdateCallInfo(event, beforeOtherLegDN, afterOterLegDN, updateLine)
  })

  var output

  var bolConnected = false

  var wscti = null
  // var wscti = new WebSocket(wsUri);

  function init() {
    output = document.getElementById('output')
    bolConnected = false
    // connectCTI();
  }

  this.connectCTI = function(strIP_Port) {
    wscti = new WebSocket(strIP_Port)
    wscti.onopen = function(evt) {
      onOpen(evt)
    }
    wscti.onclose = function(evt) {
      onClose(evt)
    }
    wscti.onmessage = function(evt) {
      onMessage(evt)
    }
    wscti.onerror = function(evt) {
      onError(evt)
    }
  }

  function onOpen(evt) {
    bolConnected = true
    EventObject.trigger('onopen')
  }
  this.onClose = function(evt) {
    // writeToScreen("DISCONNECTED");
    bolConnected = false
    islogin = false

    EventObject.trigger('onclose')
    wscti = null
  }
  function onClose(evt) {
    // writeToScreen("DISCONNECTED");
    bolConnected = false
    islogin = false

    wscti = null
    EventObject.trigger('onclose')
  }
  function onError(evt) {
    // writeToScreen("DISCONNECTED");
    bolConnected = false
    islogin = false
    console.log(evt.data)
    EventObject.trigger('onerror')
  }

  function onMessage(evt) {
    EventObject.trigger('onmessage', [evt])

    var obj = JSON.parse(evt.data)
    // var obj=evt.data;
    // console.log(obj)
    var event_name = obj.EventName
    // console.log('into cti onMessage function with event_name =', event_name)
    switch (event_name) {
      case 'monistorStatus':
        var data = GetEventValue('data', obj.BodyData)
        EventObject.trigger('on_monistorStatus', [data])
        break
      case 'AgentStatusList':

        var agentid = GetEventValue('AgentID', obj.BodyData)
        var DN = GetEventValue('DN', obj.BodyData)
        var reasoncode = GetEventValue('reasoncode', obj.BodyData)
        var UpdateTime = GetEventValue('UpdateTime', obj.BodyData)
        EventObject.trigger('on_AgentStatusList', [agentid, DN, reasoncode, UpdateTime])
        break

      case 'QueueList':
        var queue = GetEventValue('queue', obj.BodyData)
        var queue_count = GetEventValue('queuecount', obj.BodyData)
        EventObject.trigger('on_queuelist', [queue, queue_count])
        break
      case 'Answer_Event':
        // Answer_Event|AgentID|DN|UUID|caller|callee|io|other-leg-UUID
        var Ans_AgentID = GetEventValue('AgentID', obj.BodyData)
        var Ans_DN = GetEventValue('DN', obj.BodyData)
        var Ans_UUID = GetEventValue('UUID', obj.BodyData)
        var Ans_callerid = GetEventValue('CallerID', obj.BodyData)
        var Ans_calleeid = GetEventValue('CalleeID', obj.BodyData)
        var Ans_IO = GetEventValue('IO', obj.BodyData)
        var Ans_otherLegUUID = GetEventValue('otherLegUUID', obj.BodyData)
        // var result=find(uuid_list,Ans_UUID);
        // log.info(pageName,"Answer_Event:Agent="+Ans_AgentID+" DN=" + Ans_DN + " UUID=" + Ans_UUID + " callerid=" +Ans_callerid + " calleeid=" + Ans_calleeid + " io=" +Ans_IO);

        // on_answer_event(event,agentid,DN,UUID,callerid,calleeid,io,other_leg_uuid);
        /* if (result !=null)
			{
				if (size(uuid_list)<2)
				{
					EventObject.trigger('on_answer_event',[Ans_AgentID,Ans_DN,Ans_UUID,Ans_callerid,Ans_calleeid,Ans_IO,Ans_otherLegUUID]);
				}
			}*/
        	break
      case 'tierlist':
        queue = GetEventValue('queue', obj.BodyData)
        agentid = GetEventValue('AgentID', obj.BodyData)
        EventObject.trigger('on_tierlist', [queue, agentid])
        break
      case 'tier-add':
        agentid = GetEventValue('AgentID', obj.BodyData)
        queue = GetEventValue('Queue', obj.BodyData)

        // EventObject.trigger('on_tier_add', [agentid, queue]) 查看自身状态不需要这个方法
        break
      case 'Error_Event':

        // var errtype=GetEventValue("errtype",obj.BodyData);
        // var errdescription=GetEventValue("errdescription",obj.BodyData);
        // EventObject.trigger('on_error',[errtype,errdescription]);
        break
      case 'reasoncode-change':
        agentid = GetEventValue('AgentID', obj.BodyData)
        DN = GetEventValue('DN', obj.BodyData)
        reasoncode = GetEventValue('reasoncode', obj.BodyData)
        EventObject.trigger('on_reasonchange', [agentid, DN, reasoncode])
        break

      case 'ClearUUIDList_Event':
        var ClearUUID_AgentID = GetEventValue('AgentID', obj.BodyData)
        var ClearUUID_AgentDN = GetEventValue('DN', obj.BodyData)
        removeAll(uuid_list)
        removeAll(uuid_dn_list)
        var Hangup_obj = '{ "BodyData" : [' +
								'{ "BodyHeader":"AgentID" , "BodyValue":"' + AgentID + '" },' +
								'{ "BodyHeader":"DN" , "BodyValue":"' + DN + '" },' +
								'{ "BodyHeader":"UUID" , "BodyValue":"" },' +
								'{ "BodyHeader":"other_leg_callerid" , "BodyValue":"" },' +
								'{ "BodyHeader":"other_leg_uuid" , "BodyValue":"" },' +
								'{ "BodyHeader":"HangupCause" , "BodyValue":"' + 'ClearUUIDList' + '"}],' +
								'"EventName":"Hangup_Event"}'
        // EventObject.trigger('on_hangup_event',[msg[1],msg[2],"",1,0]);

        EventObject.trigger('on_hangup_event', [ClearUUID_AgentID, ClearUUID_AgentDN, '', 1, 0])
        break

      case 'queuecount':
        var queuename = GetEventValue('QueueName', obj.BodyData)
        var queuecount = GetEventValue('QueueCount', obj.BodyData)

        EventObject.trigger('on_queuecount', [queuename, queuecount])
        break
    }
  }

  // function onError(evt) {
  //   // writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data)
  //   bolConnected = false
  //   islogin = false
  // }

  function doSend(message) {
    waitForSocketConnection(wscti, function() {
      if (wscti) {
        wscti.send(message)
      }
    })
  }
  function waitForSocketConnection(socket, callback) {
    setTimeout(
      function() {
        if (socket) {
          if (socket.readyState === 1) {
            if (callback !== undefined) {
              callback()
            }
            return
          } else {
            waitForSocketConnection(socket, callback)
          }
        }
      }, 5)
  }

  function sleep(milliSeconds) {
    var startTime = new Date().getTime() // get the current time
    while (new Date().getTime() < startTime + milliSeconds); // hog cpu
  }

  this.login = function(agentid, dn) {
    AgentID = agentid
    DN = dn
    var login_cmd = '{ "BodyData" : [' +
    '{ "BodyHeader":"AgentID" , "BodyValue":' + AgentID + ' },' +
	'{ "BodyHeader":"DN" , "BodyValue":' + DN + '}],' +
	'"CommandName":"Login"}'
    doSend(login_cmd)
  }
  this.logoff = function(AgentID, DN) {
    islogin = false
    var logoff_cmd = '{ "BodyData" : [' +
    '{ "BodyHeader":"AgentID" , "BodyValue":"' + AgentID + '" },' +
	'{ "BodyHeader":"DN" , "BodyValue":"' + DN + '"}],' +
	'"CommandName":"Logoff"}'
    doSend(logoff_cmd)
  }
  this.answercall = function(DN) {
    // Answer|uuid|DN
    UUID = get(uuid_list, size(uuid_list) - 1)
    var answercall_cmd = '{ "BodyData" : [' +
              '{ "BodyHeader":"UUID" , "BodyValue":"' + UUID + '" },' +
            '{ "BodyHeader":"DN" , "BodyValue":"' + DN + '"}],' +
            '"CommandName":"Answer"}'
    doSend(answercall_cmd)

    // doSend("Answer|"+ UUID + "|" + DN);
  }
  this.setAgentStatus = function(AgentID, reasoncode) {
    var SetStatus_cmd = '{ "BodyData" : [' +
    '{ "BodyHeader":"AgentID" , "BodyValue":"' + AgentID + '" },' +
	'{ "BodyHeader":"reasoncode" , "BodyValue":"' + reasoncode + '"}],' +
	'"CommandName":"SetStatus"}'

    doSend(SetStatus_cmd)
  }

  this.QueueMonitor = function(AgentID) {
    var Queue_cmd = '{ "BodyData" : [' +
    '{ "BodyHeader":"AgentID" , "BodyValue":' + AgentID + ' }],' +
	'"CommandName":"Queuedata"}'
    doSend(Queue_cmd)
  }

  this.MAStatus = function(AgentID) {
    var MAS_cmd = '{ "BodyData" : [' +
    '{ "BodyHeader":"AgentID" , "BodyValue":' + AgentID + ' }],' +
	'"CommandName":"MAgentdata"}'
    doSend(MAS_cmd)
  }
  this.agentMonitor = function(AgentID) {
    var AM_cmd = '{ "BodyData" : [' +
    '{ "BodyHeader":"AgentID" , "BodyValue":' + AgentID + ' }],' +
	'"CommandName":"Statusdata"}'
    doSend(AM_cmd)
  }

  // this.Send2wsCTIterval = function(AgentID) { // 5秒刷新一下
  //   // var keepalive_cmd = '{ "BodyData" : [],' +
  //   // '"CommandName":"keepalivetimer"}';
  //   // doSend(keepalive_cmd);
  //   // var pre = document.getElementById('console')
  //   // // pre.empty();
  //   // $('#' + pre.id).empty()
  //   // agentMonitor("7001");
  //   // MAStatus("7001");
  //   // QueueMonitor("7001");
  //   setTimeout(Send2wsCTIterval, 100000)
  // }
  this.Send2wsCTIterval = function(agentId) {
    setTimeout(Send2wsCTIterval, 10000)
  }
  this.AgentReady = function() {
    this.setAgentStatus(AgentID, '0')
  }

  this.AgentnotReady = function() {
    this.setAgentStatus(AgentID, '13')
  }

  this.setAgentACW = function() {
    this.setAgentStatus(AgentID, '14')
  }

  this.senddtmf = function(muuid, digits) {
    var senddtmf_cmd = '{ "BodyData" : [' +
    '{ "BodyHeader":"UUID" , "BodyValue":"' + muuid + '" },' +
	'{ "BodyHeader":"digits" , "BodyValue":"' + digits + '"}],' +
	'"CommandName":"SendDTMF"}'

    doSend(makecall_cmd)
    // doSend("SendDTMF|" + muuid + "|" + digits);
  }

  // 盲转-->
  this.BlindTransfer = function(transfee) {
    // BlindTransfer|AgentID|DN|UUID|transfee

    UUID = get(uuid_list, 0)
    var BlindTransfer_cmd = '{ "BodyData" : [' +
	'{ "BodyHeader":"AgentID" , "BodyValue":"' + AgentID + '" },' +
	'{ "BodyHeader":"DN" , "BodyValue":"' + DN + '" },' +
	'{ "BodyHeader":"UUID" , "BodyValue":"' + UUID + '" },' +
	'{ "BodyHeader":"transfee" , "BodyValue":"' + transfee + '"}],' +
	'"CommandName":"BlindTransfer"}'
    doSend(completeconference_cmd)

    removeAll(uuid_list)

    var Hangup_obj = '{ "BodyData" : [' +
	'{ "BodyHeader":"AgentID" , "BodyValue":"' + AgentID + '" },' +
	'{ "BodyHeader":"DN" , "BodyValue":"' + DN + '" },' +
	'{ "BodyHeader":"UUID" , "BodyValue":"' + UUID + '" },' +
	'{ "BodyHeader":"other_leg_callerid" , "BodyValue":"' + '' + '" },' +
	'{ "BodyHeader":"other_leg_uuid" , "BodyValue":"' + '' + '" },' +
	'{ "BodyHeader":"HangupCause" , "BodyValue":"' + 'BlindTransfer-Hangup' + '"}],' +
	'"EventName":"Hangup_Event"}'
    EventObject.trigger('on_hangup_event', [AgentID, DN, UUID, 1, 0])
  }
  this.WisperCall = function(activeDN, DN) {
    var WisperCall_cmd = '{ "BodyData" : [' +
	'{ "BodyHeader":"activeDN" , "BodyValue":"' + activeDN + '" },' +
	'{ "BodyHeader":"joinedDN" , "BodyValue":' + DN + '}],' +
	'"CommandName":"WisperCall"}'
    doSend(WisperCall_cmd)
  }

  this.Forcerelease = function(activeDN, DN) {
    var Forcerelease_cmd = '{ "BodyData" : [' +
	'{ "BodyHeader":"activeDN" , "BodyValue":"' + activeDN + '" },' +
	'{ "BodyHeader":"joinedDN" , "BodyValue":' + DN + '}],' +
	'"CommandName":"Forcerelease"}'
    doSend(Forcerelease_cmd)
  }

  // <!--监听-->
  this.ListenCall = function(activeDN, DN) {
    var ListenCall_cmd = '{ "BodyData" : [' +
	'{ "BodyHeader":"activeDN" , "BodyValue":"' + activeDN + '" },' +
	'{ "BodyHeader":"joinedDN" , "BodyValue":' + DN + '}],' +
	'"CommandName":"ListenCall"}'
    doSend(ListenCall_cmd)
  }
  // <!--强插-->
  this.IntrudeCall = function(activeDN, DN) {
    var IntrudeCall_cmd = '{ "BodyData" : [' +
	'{ "BodyHeader":"activeDN" , "BodyValue":"' + activeDN + '" },' +
	'{ "BodyHeader":"joinedDN" , "BodyValue":' + DN + '}],' +
	'"CommandName":"IntrudeCall"}'
    doSend(IntrudeCall_cmd)
  }

  this.forceLogoff = function(magentid) {
    // doSend("Logoff|" + magentid + "||");
    var logoff_cmd = '{ "BodyData" : [' +
    '{ "BodyHeader":"AgentID" , "BodyValue":"' + magentid + '" }],' +

	'"CommandName":"forceLogoff"}'
    doSend(logoff_cmd)
  }

  this.forceAvaiable = function(magentid) {
    this.setAgentStatus(magentid, '0')
  }

  this.forceBusy = function(magentid) {
    this.setAgentStatus(magentid, '13')
  }

  function uuidcount() {
    return size(uuid_list)
  }

  function update_uuid_dn(before_mdn, after_mdn) {
    for (var i = 0; i <= size(uuid_dn_list) - 1; i++) {
      if (before_mdn == get(uuid_dn_list, i)) {
        uuid_dn_list[i] = after_mdn
        return i
      }
    }

    return -1
  }

  function find(object, strfind) {
    for (var i = 0; i <= size(object) - 1; i++) {
      if (strfind === get(object, i)) {
        return get(object, i)
      }
    }

    return null
  }

  function getIndex(object, strfind) {
    for (var i = 0; i <= size(object) - 1; i++) {
      if (strfind == get(object, i)) {
        return i
      }
    }

    return -1
  }
  /**
 * 添加
 * @param {Object} object
 */
  function add(object, stradd) {
    object[object.length] = stradd
  }

  /**
 * 移除此列表中指定位置上的元素。
 * @param index 指定位置
 * @return 此位置的元素
 */
  function removeIndex(object, index) {
    var objectitem = object[index]
    object.splice(index, 1)
    return objectitem
  }

  /**
 * 移除此列表中指定元素。
 * @param object 指定元素
 * @return 此位置的元素
 */
  function remove(object, item) {
    var i = 0
    for (; i < object.length; i++) {
      if (object[i] === item) {
        break
      }
    }
    if (i >= object.length) {
      return null
    } else {
      return removeIndex(object, i)
    }
  }

  /**
 * 获得列表中指定元素。
 * @param object 指定元素
 * @return 此位置的元素
 */
  function get(object, index) {
    return object[index]
  }
  /**
 * 移除此列表中的所有元素。
 */
  function removeAll(object) {
    object.splice(0, object.length)
  }

  /**
 * 返回此列表中的元素数。
 * @return 元素数量
 */
  function size(object) {
    return object.length
  }

  /**
 *  如果列表不包含元素，则返回 true。
 * @return true or false
 */
  function isEmpty(object) {
    return object.length === 0
  }

  function GetEventValue(strHeader, p) {
    for (var i = 0; i < p.length; i++) {
      if (p[i].BodyHeader === strHeader) {
        return p[i].BodyValue
      }
    }
    return ''
  }
  function GetAttachedValue(strHeader, p) {
    for (var i = 0; i < p.length; i++) {
      if (p[i].AttachedName === strHeader) {
        return p[i].AttachedValue
      }
    }
    return ''
  }

  window.addEventListener('load', init, false)
}())
