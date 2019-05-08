import jQuery from 'jquery'
import that from '@/views/layout/components/Navbar'
export default (new (function() {
  var uuid_list = new Array()
  var uuid_dn_list = new Array()
//var line_appearance_list = new Array();
  var ori_ani = ''
  var ani = ''
  var isHangupbyself = false
  var islogin = false
  var EventObject = jQuery({})
  var Send2_wsCTI_terval_id = ''
  var t
  var UUID = ''
  var DN = ''
  var AgentID=''
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
  EventObject.bind('on_loginsucess', function(event, agentid, DN) {
    that.methods.on_loginsucess(event, agentid, DN)
  })
  EventObject.bind('on_reasonchange', function(event, agentid, DN, reasoncode) {
    that.methods.on_reasonchange(event, agentid, DN, reasoncode)
  })
//Ringing_Event|AgentID|DN|UUID|callerid|calleeid|ori_ani|other-leg-UUID|queueName
  EventObject.bind('on_ringing_event', function(event, agentid, DN, UUID, callerid, calleeid, ori_ani, other_leg_uuid, queueName, activeLine,choice,DialData) {
    that.methods.on_ringing_event(event, agentid, DN, UUID, callerid, calleeid, ori_ani, other_leg_uuid, queueName, activeLine,choice,DialData)
  })
//RingBack_Event|AgentID|DN|UUID|callerid|calleeid|ori_ani
  EventObject.bind('on_ringback_event', function(event, agentid, DN, UUID, callerid, calleeid, ori_ani, activeLine, RB_campaignId,DialData) {
    that.methods.on_ringback_event(event, agentid, DN, UUID, callerid, calleeid, ori_ani, activeLine, RB_campaignId,DialData)
  })
//Answer_Event|AgentID|DN|UUID|caller|callee|io|other-leg-UUID
  EventObject.bind('on_answer_event', function(event, agentid, DN, UUID, callerid, calleeid, io, other_leg_uuid) {
    that.methods.on_answer_event(event, agentid, DN, UUID, callerid, calleeid, io, other_leg_uuid)
    //console.log(event+"|"+agentid+"|"+DN+"|"+UUID+"|"+callerid+"|"+calleeid+"|"io+"|"+other_leg_uuid);
  })
//Hangup_Event|AgentID|DN|UUID
  EventObject.bind('on_hangup_event', function(event, agentid, DN, UUID, hangupLine, activeLineCount) {
    that.methods.on_hangup_event(event, agentid, DN, UUID, hangupLine, activeLineCount)
  })
//Hold_Event|AgentID|DN|UUID|Callee|OtherLegUUID
  EventObject.bind('on_hold_event', function(event, agentid, DN, UUID, calleeid, other_leg_uuid) {
    that.methods.on_hold_event(event, agentid, DN, UUID, calleeid, other_leg_uuid)
  })
//获取挂电原因
  /*EventObject.bind('on_hp_hangupcause',function(event,HP_HangupCause){
    on_hp_hangupcause(event,HP_HangupCause);
  });*/

  EventObject.bind('on_SIP_unregister', function(event, DN) {
    that.methods.on_SIP_unregister(event, DN)
  })
//UnHold_Event|AgentID|DN|UUID|Callee|OtherLegUUID
  EventObject.bind('on_unhold_event', function(event, agentid, DN, UUID, calleeid, other_leg_uuid) {
    that.methods.on_unhold_event(event, agentid, DN, UUID, calleeid, other_leg_uuid)
  })

  EventObject.bind('on_queuecount', function(event, queuename, queuecount) {
    that.methods.on_queuecount(event, queuename, queuecount)
  })	//增加计算队列排队数

  EventObject.bind('onUpdateCallInfo', function(event, beforeOtherLegDN, afterOterLegDN, updateLine) {
    that.methods.onUpdateCallInfo(event, beforeOtherLegDN, afterOterLegDN, updateLine)
  })
//var wsUri ="ws://192.168.1.5:9050/";
  var output

  var bolConnected = false

  var wscti = null

//var wscti = new WebSocket(wsUri);

  // function init() {
  //   output = document.getElementById('output')
  //   bolConnected = false
  //   //connectCTI();
  // }

  this.connectCTI=function (strIP_Port) {
    console.log('connecting cti ws client addr =', strIP_Port)

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
    console.log('opening cti ws client successful')
  }

  function onClose(evt) {
    //writeToScreen("DISCONNECTED");
    bolConnected = false
    islogin = false

    wscti = null
    console.log('closing cti ws client')
    EventObject.trigger('onclose')
  }

  function onError(evt) {
    //writeToScreen("DISCONNECTED");
    bolConnected = false
    islogin = false
    console.log(evt.data)
    EventObject.trigger('onerror')
  }

  function onMessage(evt) {
    //writeToScreen('<span style="color: blue;">RESPONSE: '+ evt.data+'</span>');
    EventObject.trigger('onmessage', [evt])
    var obj = JSON.parse(evt.data)
    console.log(obj)
    var event_name = obj.EventName
    switch (event_name) {
      case 'UpdateCallInfo':
        var beforeDN = GetEventValue('BeforeDN', obj.BodyData)
        var afterDN = GetEventValue('AfterDN', obj.BodyData)
        result = update_uuid_dn(BeforeDN, BeforeDN)
        if (result != -1) {
          EventObject.trigger('onUpdateCallInfo', [beforeDN, afterDN, result])
        }
        break
      case 'Error_Event':
        //'on_error', function(event,errtype,errdescription)
        var errtype = GetEventValue('errtype', obj.BodyData)
        var errdescription = GetEventValue('errdescription', obj.BodyData)
        EventObject.trigger('on_error', [errtype, errdescription])
        break
      case 'SIP_unregister':

        var AgentDN = GetEventValue('AgentDN', obj.BodyData)
        EventObject.trigger('on_SIP_unregister', [AgentDN])
        break

      case 'reasoncode-change':
        var agentid = GetEventValue('AgentID', obj.BodyData)
        var DN = GetEventValue('DN', obj.BodyData)
        var reasoncode = GetEventValue('reasoncode', obj.BodyData)
        //var Send2_wsCTI_terval_id=GetEventValue("Send2_wsCTI_terval_id",obj.BodyData);

        if (reasoncode == '-1') {

          //window.clearInterval(Send2_wsCTI_terval_id);
          //Send2_wsCTI_terval_id=window.setInterval(Send2wsCTIterval,10000);
          //if (t!=null)
          //{
          //cleartimeout(t);
          //}
          Send2wsCTIterval()
          islogin = true
          EventObject.trigger('on_loginsucess', [agentid, DN])
        }
        else {
          EventObject.trigger('on_reasonchange', [agentid, DN, reasoncode])
        }
        break
      case 'Ringing_Event':
        //Ringing_Event|AgentID|DN|UUID|CallerID|CalleeID|oriAni|otherLegUUID|QueueName|Choice
        var activeLine = 0
        var RI_AgentID = GetEventValue('AgentID', obj.BodyData)
        var RI_DN = GetEventValue('DN', obj.BodyData)
        var RI_UUID = GetEventValue('UUID', obj.BodyData)
        var RI_callerid = GetEventValue('CallerID', obj.BodyData)
        var RI_calleeid = GetEventValue('CalleeID', obj.BodyData)
        var RI_oriAni = GetEventValue('oriAni', obj.BodyData)
        var RI_otherLegUUID = GetEventValue('otherLegUUID', obj.BodyData)
        var RI_QueueName = GetEventValue('QueueName', obj.BodyData)
        var RI_choice=GetAttachedValue("choice",obj.AttachedData);
        var RI_DialData=GetAttachedValue("DialData",obj.AttachedData);
        if(size(uuid_list)<1)
        {
          ori_ani=RI_callerid;
        }
        if (RI_AgentID != '') {
          add(uuid_list, RI_UUID)
          add(uuid_dn_list, RI_callerid)
          //add(line_appearance_list,msg[4] + "|" + msg[5]);
          //ani=GetEventValue("oriAni",obj.BodyData);
          activeLine = size(uuid_list)
          //EventObject.trigger('on_ringing_event',[msg[1],msg[2],msg[3],msg[4],msg[5],msg[6],msg[7],msg[8],activeLine,msg[9]]);
          EventObject.trigger('on_ringing_event', [RI_AgentID, RI_DN, RI_UUID, RI_callerid, RI_calleeid, RI_oriAni, RI_otherLegUUID, RI_QueueName, activeLine,RI_choice,RI_DialData])
          if(RI_DialData){
              sleep(1500)
              answerCall()
          }
        }
        break
      case 'RingBack_Event':
        //RingBack_Event|AgentID|DN|UUID|callerid|calleeid|ori_ani
        var activeLine = 0
        var RB_AgentID = GetEventValue('AgentID', obj.BodyData)
        var RB_DN = GetEventValue('DN', obj.BodyData)
        var RB_UUID = GetEventValue('UUID', obj.BodyData)
        var RB_callerid = GetEventValue('CallerID', obj.BodyData)
        var RB_calleeid = GetEventValue('CalleeID', obj.BodyData)
        var RB_oriAni = GetEventValue('oriAni', obj.BodyData)
        var RB_campaignId=GetAttachedValue("campaignId",obj.AttachedData);
        var RB_DialData=GetAttachedValue("DialData",obj.AttachedData);
        add(uuid_list, RB_UUID)
        add(uuid_dn_list, RB_calleeid)
        //add(line_appearance_list,msg[4] + "|" + msg[5]);
        //ani=msg[6];
        activeLine = size(uuid_list)
        //on_ringback_event(event,agentid,DN,UUID,callerid,calleeid,ori_ani,activeLine);
        EventObject.trigger('on_ringback_event', [RB_AgentID, RB_DN, RB_UUID, RB_callerid, RB_calleeid, RB_oriAni, activeLine, RB_campaignId,RB_DialData])
        if (uuidcount() < 2) {
          sleep(1500)
          answerCall()
        }

        break
      case 'Answer_Event':
        //Answer_Event|AgentID|DN|UUID|caller|callee|io|other-leg-UUID
        var Ans_AgentID = GetEventValue('AgentID', obj.BodyData)
        var Ans_DN = GetEventValue('DN', obj.BodyData)
        var Ans_UUID = GetEventValue('UUID', obj.BodyData)
        var Ans_callerid = GetEventValue('CallerID', obj.BodyData)
        var Ans_calleeid = GetEventValue('CalleeID', obj.BodyData)
        var Ans_IO = GetEventValue('IO', obj.BodyData)
        var Ans_otherLegUUID = GetEventValue('otherLegUUID', obj.BodyData)
        var result = find(uuid_list, Ans_UUID)
        //on_answer_event(event,agentid,DN,UUID,callerid,calleeid,io,other_leg_uuid);
        if (result != null) {
          if (size(uuid_list) < 2) {
            EventObject.trigger('on_answer_event', [Ans_AgentID, Ans_DN, Ans_UUID, Ans_callerid, Ans_calleeid, Ans_IO, Ans_otherLegUUID])
          }
        }
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
        //EventObject.trigger('on_hangup_event',[msg[1],msg[2],"",1,0]);

//			EventObject.trigger('on_hangup_event',[ClearUUID_AgentID,ClearUUID_AgentDN,"",1,0]);
        EventObject.trigger('on_hangup_event', [ClearUUID_AgentID, ClearUUID_AgentDN, '', 1, 0])
        break
      case 'Hangup_Event':
        //Hangup_Event|AgentID|DN|UUID|otherLeg_callerid|HangupCause
        //console.log("Hangup_Event|"+msg[1]+"|"+msg[2]+"|"+msg[3]+"|"+msg[4]);
        var HP_AgentID = GetEventValue('AgentID', obj.BodyData)
        var HP_DN = GetEventValue('DN', obj.BodyData)
        var HP_UUID = GetEventValue('UUID', obj.BodyData)
        var result = find(uuid_list, HP_UUID)
        var HP_HangupCause = GetEventValue('HangupCause', obj.BodyData)
        var HP_otherLeg_callerid = GetEventValue('other_leg_callerid', obj.BodyData)
        var HP_other_leg_uuid = GetEventValue('other_leg_uuid', obj.BodyData)
        var hangupLine = getIndex(uuid_list, HP_UUID) + 1
        //	EventObject.trigger('on_hp_hangupcause',[HP_HangupCause]);  获取挂断电话的原因
        if (HP_HangupCause == 'transfer_a_wrong_number') {
          remove(uuid_list, HP_UUID)
          remove(uuid_dn_list, HP_otherLeg_callerid)
          EventObject.trigger('on_hangup_event', [HP_AgentID, HP_DN, HP_UUID, 2, 1])
          this.setAgentStatus(HP_AgentID, '-100')
          break
        }

        if (result != null) {

          remove(uuid_list, HP_UUID)
          remove(uuid_dn_list, HP_otherLeg_callerid)
          EventObject.trigger('on_hangup_event', [HP_AgentID, HP_DN, HP_UUID, hangupLine, uuidcount()])
        }
        /*else
        {
          if(HP_other_leg_uuid == "" )
          {
            remove(uuid_list,HP_UUID);
            remove(uuid_dn_list,HP_otherLeg_callerid);
            EventObject.trigger('on_hangup_event',[HP_AgentID,HP_DN,HP_UUID,2,1]);

              if(uuidcount()>0)
            this.setAgentStatus(HP_AgentID,"-100");

          }
        }*/
        break
      case 'Hold_Event':
        //Hold_Event|AgentID|DN|UUID|Callee|OtherLegUUID
        //on_unhold_event(event,agentid,DN,UUID,calleeid,other_leg_uuid);
        var Hold_AgentID = GetEventValue('AgentID', obj.BodyData)
        var Hold_DN = GetEventValue('DN', obj.BodyData)
        var Hold_UUID = GetEventValue('UUID', obj.BodyData)
        var Hold_Callee = GetEventValue('Callee', obj.BodyData)
        var Hold_OtherLegUUID = GetEventValue('OtherLegUUID', obj.BodyData)
        var result = find(uuid_list, Hold_UUID)
        if (result != null) {
          EventObject.trigger('on_hold_event', [Hold_AgentID, Hold_DN, Hold_UUID, Hold_Callee, Hold_OtherLegUUID])
        }
        break
      case 'UnHold_Event':
        //UnHold_Event|AgentID|DN|UUID|Callee|OtherLegUUID;
        var UnHold_AgentID = GetEventValue('AgentID', obj.BodyData)
        var UnHold_DN = GetEventValue('DN', obj.BodyData)
        var UnHold_UUID = GetEventValue('UUID', obj.BodyData)
        var UnHold_Callee = GetEventValue('Callee', obj.BodyData)
        var UnHold_OtherLegUUID = GetEventValue('OtherLegUUID', obj.BodyData)
        var result = find(uuid_list, UnHold_UUID)
        if (result != null) {
          EventObject.trigger('on_unhold_event', [UnHold_AgentID, UnHold_DN, UnHold_UUID, UnHold_Callee, UnHold_OtherLegUUID])
        }
        break
      case 'queuecount':
        //on_queuecount(event,queuename,queuecount);
        var queuename = GetEventValue('QueueName', obj.BodyData)
        var queuecount = GetEventValue('QueueCount', obj.BodyData)
        EventObject.trigger('on_queuecount', [queuename, queuecount])
        break
      case 'CompleteTransfer'://2018315完成转接待测试
        var HP_AgentID = GetEventValue('AgentID', obj.BodyData)
        var HP_DN = GetEventValue('DN', obj.BodyData)
        var HP_UUID = GetEventValue('UUID', obj.BodyData)
        completeTransfer(HP_AgentID, HP_DN, HP_UUID)
        break
    }

  }

  function onError(evt) {
    this.writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data)
    bolConnected = false
    islogin = false
  }

  function doSend(message) {
    waitForSocketConnection(wscti, function() {
      wscti.send(message)
    })

  }

  function waitForSocketConnection(socket, callback) {
    setTimeout(
      function() {
        if (socket.readyState === 1) {
          if (callback !== undefined) {
            callback()
          }
          return
        } else {
          waitForSocketConnection(socket, callback)
        }
      }, 5)
  }

  function sleep(milliSeconds) {
    var startTime = new Date().getTime() // get the current time
    while (new Date().getTime() < startTime + milliSeconds); // hog cpu
  }

  this.login=function (agentId, dn, Queue, Position, type) {
    DN = dn
    AgentID = agentId
    //Login|000044|6051|12345|1
    //doSend("Login|"+ AgentID + "|" + DN );

    var login_cmd = '{ "BodyData" : [' +
      '{ "BodyHeader":"AgentID" , "BodyValue":"' + AgentID + '" },' +
      '{ "BodyHeader":"DN" , "BodyValue":"' + DN + '" },' +
      '{ "BodyHeader":"QueueName" , "BodyValue":"' + Queue + '"},' +
      '{ "BodyHeader":"Position" , "BodyValue":"' + Position + '"},' +
      '{ "BodyHeader":"Type" , "BodyValue":"' + type + '"}],' +
      '"CommandName":"Login"}'

    doSend(login_cmd)
    //doSend("Login|"+ AgentID + "|" + DN + "|" + Queue + "|" + Position + "|" + type);
  }

  this.logoff=function (AgentID, DN, Queue) {
    //Logoff|AgentID|DN|Queue
    islogin = false
    var logoff_cmd = '{ "BodyData" : [' +
      '{ "BodyHeader":"AgentID" , "BodyValue":"' + AgentID + '" },' +
      '{ "BodyHeader":"DN" , "BodyValue":"' + DN + '" },' +
      '{ "BodyHeader":"QueueName" , "BodyValue":"' + Queue + '"}],' +
      '"CommandName":"Logoff"}'
    doSend(logoff_cmd)
    //doSend("Logoff|"+ AgentID + "|" + DN + "|" + Queue);

  }

  this.setAgentStatus=function (AgentID, reasoncode) {
    //SetStatus|AgentID|reasoncode
    var SetStatus_cmd = '{ "BodyData" : [' +
      '{ "BodyHeader":"AgentID" , "BodyValue":"' + AgentID + '" },' +
      '{ "BodyHeader":"reasoncode" , "BodyValue":"' + reasoncode + '"}],' +
      '"CommandName":"SetStatus"}'
    if (islogin) {
      doSend(SetStatus_cmd)

    }
    //doSend("SetStatus|"+ AgentID + "|" + reasoncode);
  }

 this.answercall = function () {
    //Answer|uuid|DN
    UUID = get(uuid_list, size(uuid_list) - 1)
    var answercall_cmd = '{ "BodyData" : [' +
      '{ "BodyHeader":"UUID" , "BodyValue":"' + UUID + '" },' +
      '{ "BodyHeader":"DN" , "BodyValue":"' + DN + '"}],' +
      '"CommandName":"Answer"}'
    doSend(answercall_cmd)

    //doSend("Answer|"+ UUID + "|" + DN);
  }
  function answerCall(){
    UUID = get(uuid_list, size(uuid_list) - 1)
    var answercall_cmd = '{ "BodyData" : [' +
      '{ "BodyHeader":"UUID" , "BodyValue":"' + UUID + '" },' +
      '{ "BodyHeader":"DN" , "BodyValue":"' + DN + '"}],' +
      '"CommandName":"Answer"}'
    doSend(answercall_cmd)
  }

  this.makecall=function (srcDN, destDN, campaignId = '') {
    //OutCall|srcDN|destDN
    var makecall_cmd = '{ "BodyData" : [' +
      '{ "BodyHeader":"srcDN" , "BodyValue":"' + srcDN + '" },' +
      '{ "BodyHeader":"destDN" , "BodyValue":"' + destDN + '"},' +
      '{ "BodyHeader":"campaignId" , "BodyValue":"' + campaignId + '"}],' +
      '"CommandName":"OutCall"}'

    doSend(makecall_cmd)

    //doSend("OutCall|"+ srcDN + "|" + destDN);
  }

  function Send2wsCTIterval()//5秒刷新一下
  {
    var keepalive_cmd = '{ "BodyData" : [],' +
      '"CommandName":"keepalivetimer"}'
    doSend(keepalive_cmd)
    //doSend("keepalivetimer\r\n");
    clearTimeout(t)
    t = setTimeout(Send2wsCTIterval, 20000)
  }

  this.AgentReady=function () {
    this.setAgentStatus(AgentID, '0')
//doSend("SetStatus|" + AgentID + "|" + "0");
  }

  this.AgentnotReady=function () {
    this.setAgentStatus(AgentID, '13')
//doSend("SetStatus|" + AgentID + "|" + "13");
  }

  this.setAgentACW=function () {
    this.setAgentStatus(AgentID, '14')
//doSend("SetStatus|" + AgentID + "|" + "14");
  }
  this.setAgentDialInFree=function () {
    this.setAgentStatus(AgentID, '-5')
//doSend("SetStatus|" + AgentID + "|" + "14");
  }

  this.senddtmf=function (muuid, digits) {
    var senddtmf_cmd = '{ "BodyData" : [' +
      '{ "BodyHeader":"UUID" , "BodyValue":"' + muuid + '" },' +
      '{ "BodyHeader":"digits" , "BodyValue":"' + digits + '"}],' +
      '"CommandName":"SendDTMF"}'

    doSend(makecall_cmd)
    //doSend("SendDTMF|" + muuid + "|" + digits);
  }

  this.starttransfer=function (transferDigits, ori_ani) {
    ////StartTransfer|AgentID|UUID|transferDigits|ori_ani
    UUID = get(uuid_list, 0)
    var starttransfer_cmd = '{ "BodyData" : [' +
      '{ "BodyHeader":"AgentID" , "BodyValue":"' + AgentID + '" },' +
      '{ "BodyHeader":"UUID" , "BodyValue":"' + UUID + '" },' +
      '{ "BodyHeader":"transferDigits" , "BodyValue":"' + transferDigits + '"},' +
      '{ "BodyHeader":"ani" , "BodyValue":"' + ani + '"}],' +
      '"CommandName":"StartTransfer"}'

    doSend(starttransfer_cmd)

    //doSend("StartTransfer|"+ AgentID + "|" + UUID + "|" + transferDigits + "|" + ani);
  }

  this.retrievecall=function () {
    //Retrieve|AgentID|UUID
    //取回是取回uuid_list最后一笔记录
    if (size(uuid_list) > 1) {

      UUID = get(uuid_list, 1)

      var hangup_cmd = '{ "BodyData" : [' +
        '{ "BodyHeader":"UUID" , "BodyValue":"' + UUID + '" },' +
        '{ "BodyHeader":"DN" , "BodyValue":"' + DN + '"}],' +
        '"CommandName":"Hangup"}'

      doSend(hangup_cmd)

      //doSend("Hangup|"+ UUID+"|"+DN);
      //removeIndex(uuid_list,size(uuid_list)-1);
    }
  }

  this.completetransfer=function () {
    //CompleteTransfer|AgentID|UUID
    if (size(uuid_list) > 1) {
      //	isHangupbyself=true;
      UUID = get(uuid_list, 0)

      var completetransfer_cmd = '{ "BodyData" : [' +
        '{ "BodyHeader":"AgentID" , "BodyValue":"' + AgentID + '" },' +
        '{ "BodyHeader":"DN" , "BodyValue":"' + DN + '" },' +
        '{ "BodyHeader":"UUID" , "BodyValue":"' + UUID + '"}],' +
        '"CommandName":"CompleteTransfer"}'

      doSend(completetransfer_cmd)
      //UpdateCallInfo|Transfer_DN|A_DN|A_UUID|C_DN|C_UUID
      var UpdateCallInfo_cmd = '{ "BodyData" : [' +
        '{ "BodyHeader":"Transfer_DN" , "BodyValue":"' + DN + '" },' +
        '{ "BodyHeader":"A_DN" , "BodyValue":"' + get(uuid_dn_list, 0) + '" },' +
        '{ "BodyHeader":"A_UUID" , "BodyValue":"' + get(uuid_list, 0) + '" },' +
        '{ "BodyHeader":"C_DN" , "BodyValue":"' + get(uuid_dn_list, 1) + '" },' +
        '{ "BodyHeader":"C_UUID" , "BodyValue":"' + get(uuid_list, 1) + '"}],' +
        '"CommandName":"UpdateCallInfo"}'
      doSend(UpdateCallInfo_cmd)

      //doSend("CompleteTransfer|"+ AgentID + "|" + DN + "|" + UUID);
      //doSend("UpdateCallInfo|" + DN + "|" + get(uuid_dn_list,0)+"|" +get(uuid_list,0)+"|" + get(uuid_dn_list,1)+"|" +get(uuid_list,1));

      removeAll(uuid_list)
      removeAll(uuid_dn_list)
      var Hangup_obj = '{ "BodyData" : [' +
        '{ "BodyHeader":"AgentID" , "BodyValue":"' + AgentID + '" },' +
        '{ "BodyHeader":"DN" , "BodyValue":"' + DN + '" },' +
        '{ "BodyHeader":"UUID" , "BodyValue":"' + UUID + '" },' +
        '{ "BodyHeader":"other_leg_callerid" , "BodyValue":"' + '' + '" },' +
        '{ "BodyHeader":"other_leg_uuid" , "BodyValue":"' + '' + '" },' +
        '{ "BodyHeader":"HangupCause" , "BodyValue":"' + 'CompleteTransfer-Hangup' + '"}],' +
        '"EventName":"Hangup_Event"}'
      EventObject.trigger('on_hangup_event', [AgentID, DN, UUID, 1, 0])
    }
  }

  this.completeconference=function () {
    //CompleteConference|AgentID|UUID
    if (size(uuid_list) > 1) {
      //isHangupbyself=true;
      UUID = get(uuid_list, 0)

      var completeconference_cmd = '{ "BodyData" : [' +
        '{ "BodyHeader":"AgentID" , "BodyValue":"' + AgentID + '" },' +
        '{ "BodyHeader":"DN" , "BodyValue":"' + DN + '" },' +
        '{ "BodyHeader":"UUID" , "BodyValue":"' + UUID + '"}],' +
        '"CommandName":"CompleteConference"}'
      doSend(completeconference_cmd)

      //doSend("CompleteConference|"+ AgentID + "|" + DN + "|" + UUID);

    }
  }

  //<!--盲转-->
  this.BlindTransfer=function (transfee) {

//BlindTransfer|AgentID|DN|UUID|transfee

    UUID = get(uuid_list, 0)
    var BlindTransfer_cmd = '{ "BodyData" : [' +
      '{ "BodyHeader":"AgentID" , "BodyValue":"' + AgentID + '" },' +
      '{ "BodyHeader":"DN" , "BodyValue":"' + DN + '" },' +
      '{ "BodyHeader":"UUID" , "BodyValue":"' + UUID + '" },' +
      '{ "BodyHeader":"transfee" , "BodyValue":"' + transfee + '"}],' +
      '"CommandName":"BlindTransfer"}'
    doSend(completeconference_cmd)

    //doSend("BlindTransfer|" + AgentID + "|" + DN + "|" + UUID + "|" + transfee);
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

    //EventObject.trigger('on_hangup_event',[AgentID,DN,UUID,1,0]);

  }

  //<!--监听-->
  this.ListenCall=function (activeDN) {
    //ListenCall|activeCallId|activeDN|joinedDN
    //activeDN：被监听的分机
    //joinedDN：发起监听方的分机号
    var ListenCall_cmd = '{ "BodyData" : [' +
      '{ "BodyHeader":"activeDN" , "BodyValue":"' + activeDN + '" },' +
      '{ "BodyHeader":"joinedDN" , "BodyValue":"' + DN + '"}],' +
      '"CommandName":"ListenCall"}'
    doSend(ListenCall_cmd)
    //doSend("ListenCall||" + activeDN + "|" + DN);
  }

  //<!--强插-->
  this.IntrudeCall=function (activeDN) {
    var IntrudeCall_cmd = '{ "BodyData" : [' +
      '{ "BodyHeader":"activeDN" , "BodyValue":"' + activeDN + '" },' +
      '{ "BodyHeader":"joinedDN" , "BodyValue":"' + DN + '"}],' +
      '"CommandName":"ListenCall"}'
    doSend(IntrudeCall_cmd)
    //doSend("IntrudeCall||" + activeDN + "|" + DN );
  }

  this.forceLogoff=function (magentid) {
    doSend('Logoff|' + magentid + '||')

  }

  this.forceAvaiable=function (magentid) {
    this.setAgentStatus(magentid, '0')
    //doSend("SetStatus|" + magentid + "|" + "0" );
  }

  this.forceBusy=function (magentid) {

    this.setAgentStatus(magentid, '14')
    //doSend("SetStatus|" + magentid + "|" + "13");
  }

  this.hold=function (line) {
    //Hold|UUID
    UUID = get(uuid_list, line - 1)
    var hold_cmd = '{ "BodyData" : [' +
      '{ "BodyHeader":"UUID" , "BodyValue":"' + UUID + '"}],' +
      '"CommandName":"Hold"}'
    doSend(hold_cmd)
    //doSend("Hold|"+  UUID);
  }

  this.unhold=function (line) {
    //UnHold|UUID
    UUID = get(uuid_list, line - 1)
    var unhold_cmd = '{ "BodyData" : [' +
      '{ "BodyHeader":"UUID" , "BodyValue":"' + UUID + '"}],' +
      '"CommandName":"UnHold"}'
    doSend(unhold_cmd)
    //doSend("UnHold|"+  UUID);
  }

  this.hangup=function () {
    //Hangup|UUID
    //UUID=get(0);
    //UUID=get(size()-1);
    if (size(uuid_list) > 1) {
      //uuid_list大于1，表示正在磋商或三方中主动挂断
      isHangupbyself = true
      var UpdateCallInfo_cmd = '{ "BodyData" : [' +
        '{ "BodyHeader":"Transfer_DN" , "BodyValue":"' + DN + '" },' +
        '{ "BodyHeader":"A_DN" , "BodyValue":"' + get(uuid_dn_list, 0) + '" },' +
        '{ "BodyHeader":"A_UUID" , "BodyValue":"' + get(uuid_list, 0) + '" },' +
        '{ "BodyHeader":"C_DN" , "BodyValue":"' + get(uuid_dn_list, 1) + '" },' +
        '{ "BodyHeader":"C_UUID" , "BodyValue":"' + get(uuid_list, 1) + '"}],' +
        '"CommandName":"UpdateCallInfo"}'
      doSend(UpdateCallInfo_cmd)

      //doSend("UpdateCallInfo|" + DN + "|" + get(uuid_dn_list,0)+"|" +get(uuid_list,0)+ get(uuid_dn_list,1)+"|" +get(uuid_list,1));
      UUID = get(uuid_list, 0)
    }
    else {
      UUID = get(uuid_list, size(uuid_list) - 1)
    }
    removeAll(uuid_list)
    removeAll(uuid_dn_list)
    var hangup_cmd = '{ "BodyData" : [' +
      '{ "BodyHeader":"UUID" , "BodyValue":"' + UUID + '" },' +
      '{ "BodyHeader":"DN" , "BodyValue":"' + DN + '"}],' +
      '"CommandName":"Hangup"}'
    doSend(hangup_cmd)
    doSend('Hangup|' + UUID + '|' + DN)
    var Hangup_obj = '{ "BodyData" : [' +
      '{ "BodyHeader":"AgentID" , "BodyValue":"' + AgentID + '" },' +
      '{ "BodyHeader":"DN" , "BodyValue":"' + DN + '" },' +
      '{ "BodyHeader":"UUID" , "BodyValue":"' + UUID + '" },' +
      '{ "BodyHeader":"other_leg_callerid" , "BodyValue":"' + '' + '" },' +
      '{ "BodyHeader":"other_leg_uuid" , "BodyValue":"' + '' + '" },' +
      '{ "BodyHeader":"HangupCause" , "BodyValue":"' + 'HangupBySelf' + '"}],' +
      '"EventName":"Hangup_Event"}'
    EventObject.trigger('on_hangup_event', [AgentID, DN, UUID, 1, 0])
    //EventObject.trigger('on_hangup_event',[AgentID,DN,UUID,1,0]);
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
      if (strfind == get(object, i)) {

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
    return object.length == 0
  }

  function GetEventValue(strHeader, p) {

    for (var i = 0; i < p.length; i++) {
      if (p[i].BodyHeader == strHeader) {

        return p[i].BodyValue

      }
    }
    return ''
  }

  function GetAttachedValue(strHeader, p) {

    for (var i = 0; i < p.length; i++) {
      if (p[i].AttachedName == strHeader) {

        return p[i].AttachedValue

      }
    }
    return ''
  }

  // window.addEventListener('load', init, false)
})())
