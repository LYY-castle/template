<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <div>
          <label v-if="showTeam">小组成员在线情况</label>
          <label v-if="!showTeam">各小组在线情况</label>
        </div>
        <br/>
        <el-col :span="3" style="margin-right:2%">
          <el-card>
            <div style="display:inline-block;text-align:center">
              <div><img src="../../../static/images/monitoring_index/line-up.png" alt="总人数"></img></div>
              <span style="float:right">总人数</span>
            </div>
            <span style="display:inline-block;margin-right:5%;font-size:45px;font-family:Arial;">{{formInline.totalCount}}</span>
          </el-card>
        </el-col>
        <el-col :span="3" style="margin-right:2%">
          <el-card>
            <div style="display:inline-block;text-align:center">
              <div><img src="../../../static/images/monitoring_index/online.png" alt="在线人数"></img></div>
              <span style="float:right">在线人数</span>
            </div>
            <span style="display:inline-block;margin-right:5%;font-size:45px;font-family:Arial;">{{formInline.onlineCount}}</span>
          </el-card>
        </el-col>
        <el-col :span="3" style="margin-right:2%">
          <el-card>
            <div style="display:inline-block;text-align:center">
              <div><img src="../../../static/images/monitoring_index/working.png" alt="通话人数"></img></div>
              <span style="float:right">通话人数</span>
            </div>
            <span style="display:inline-block;margin-right:5%;font-size:45px;font-family:Arial;">{{formInline.workingCount}}</span>
          </el-card>
        </el-col>
        <el-col :span="3" style="margin-right:2%">
          <el-card>
            <div style="display:inline-block;text-align:center">
              <div><img src="../../../static/images/monitoring_index/busy.png" alt="示忙人数"></img></div>
              <span style="float:right">示忙人数</span>
            </div>
            <span style="display:inline-block;margin-right:5%;font-size:45px;font-family:Arial;">{{formInline.busyCount}}</span>
          </el-card>
        </el-col>
        <el-col :span="3" style="margin-right:2%">
          <el-card>
            <div style="display:inline-block;text-align:center">
              <div><img src="../../../static/images/monitoring_index/voice.png" alt="响铃人数"></img></div>
              <span style="float:right">响铃人数</span>
            </div>
            <span style="display:inline-block;margin-right:5%;font-size:45px;font-family:Arial;">{{formInline.ringingCount}}</span>
          </el-card>
        </el-col>
        <el-col :span="3" style="margin-right:2%">
          <el-card>
            <div style="display:inline-block;text-align:center">
              <div><img src="../../../static/images/monitoring_index/free.png" alt="空闲人数"></img></div>
              <span style="float:right">空闲人数</span>
            </div>
            <span style="display:inline-block;margin-right:5%;font-size:45px;font-family:Arial;">{{formInline.freeCount}}</span>
          </el-card>
        </el-col>
        <el-col :span="1" style="float:right">
          <div style="display:inline-block;text-align:center">
             <div><a><img src="../../../static/images/monitoring_index/refresh.png" alt="刷新" @click="refresh()"></img></a></div>
              <span style="float:right;cursor:pointer" @click="refresh()">刷新</span> 
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-top:3%">
        <div>
          <label v-if="watchTeam">监控小组成员</label>
          <label v-if="!watchTeam">监控各个小组</label>
        </div>
        <div style="margin-top:1%">
          <el-button :disabled="btnunIntrudeIn" @click="monitorIntrudeCall()">强插</el-button>
          <el-button :disabled="btnunListen" @click="monitorListenCall()">监听</el-button>
          <el-button :disabled="btnunWhisper" @click="monitorWisperCall()">耳语</el-button>
          <el-button :disabled="btnunIntrudeOut" @click="monitorForcerelease()">强拆</el-button>
          <el-button :disabled="btnunForceFree" @click="monitorAvaiable()">强制示闲</el-button>
          <el-button :disabled="btnunForceBusy" @click="monitorBusy()">强制示忙</el-button>
          <el-button :disabled="btnunForceLogoff" @click="monitorforceLogoff()">强制登出</el-button>
        </div>
        <hr/>
         <div style="margin-top:1%">
              <el-col :span="5"  v-for="(item,index) in agentData" style="margin:1% 1%">
                <el-card >
                  <div>
                    <div style="display:inline-block">
                      <div>
                        <img src="../../../static/images/ringback.jpg" alt="去电回铃" style="width:48px;height:48px" v-show="item.ringbackshow"></img>
                        <img src="../../../static/images/callout_talking.jpg" alt="去电通话" style="width:48px;height:48px" v-show="item.callout_talkingshow"></img>
                        <img src="../../../static/images/after_working.jpg" alt="后处理" style="width:48px;height:48px" v-show="item.after_workingshow"></img>
                        <img src="../../../static/images/relax.jpg" alt="小休" style="width:48px;height:48px" v-show="item.relaxshow"></img>
                        <img src="../../../static/images/ready.jpg" alt="就绪" style="width:48px;height:48px" v-show="item.readyshow"></img>
                        <img src="../../../static/images/lunch.jpg" alt="就餐" style="width:48px;height:48px" v-show="item.lunchshow"></img>
                        <img src="../../../static/images/ringing.jpg" alt="来电振铃" style="width:48px;height:48px" v-show="item.ringingshow"></img>
                        <img src="../../../static/images/comein_talking.jpg" alt="来电通话" style="width:48px;height:48px" v-show="item.comein_talkingshow"></img>
                        <img src="../../../static/images/loginoff.jpg" alt="登出" style="width:48px;height:48px" v-show="item.loginoffshow"></img>
                        <img src="../../../static/images/busy.jpg" alt="示忙" style="width:48px;height:48px" v-show="item.busyshow"></img>
                      </div>
                      <div>
                        <el-checkbox @change="change(item.agentId,item.checked)" v-model="item.checked"></el-checkbox>
                      </div>
                    </div>
                    <div style="display:inline-block">
                      <span><font>工号：</font>{{item.agentId}}</span><br/><br/>
                      <span><font>分机号：</font>{{item.DN}}</span><br/>
                    </div>
                  </div>
                  <span><font>姓名：</font>{{item.staffName}}</span><br/>
                  <span><font>状态：</font>{{item.status}}</span><br/>
                  <span><font>队列：</font>{{item.queue}}</span><br/>
                  <span><font>排队数：</font>{{item.queueCount}}</span><br/>
                  <span><font>状态更新时间：</font></span><br/>
                  <span style="margin-left:8%;margin-right:8%">{{item.updateTime}}</span><br/>
                  <span><font>状态持续时长：</font>{{item.statusCount}}</span><br/>
                  <span><font>今日呼出通话时长：</font>{{item.talkOutCount}}</span><br/>
                  <span><font>今日呼出通话次数：</font>{{item.talkOutTimes}}次</span><br/>
                  <span><font>今日呼入通话时长：</font>{{item.comeinCount}}</span><br/>
                  <span><font>今日呼入通话次数：</font>{{item.comeinTimes}}次</span><br/>
                </el-card>
            </el-col>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
  import { Message } from 'element-ui'
  import { findNextAgentByNow, findStatusByAgentId } from '@/api/monitor_phone'
  import cti from '@/utils/monitorcti'
var baseinfo = null
  export default {
    name: 'monitor_phone',
    data() {
      return {
        analysisAgentId: [],
        analysisArr: [],
        attentionList: [], // 选中操作对象checkbox
        interval: new Map(), // 定时器数组
        reasoncodeMap: new Map(),
        btnunIntrudeIn: true,
        btnunListen: true,
        btnunWhisper: true,
        btnunIntrudeOut: true,
        btnunForceFree: true,
        btnunForceBusy: true,
        btnunForceLogoff: true,
        monitorID: '',
        monitorDN: '',
        showTeam: true,
        formInline: {
          totalCount: 0,
          onlineCount: 0,
          workingCount: 0,
          busyCount: 0,
          ringingCount: 0,
          freeCount: 0,

          agentNext_map: new Map(), // 下属员工
          agentId: '' // 班长id
        },
        watchTeam: true,
        agentData: []
      }
    },
    methods: {
      refresh() {
        location.reload()
        this.$router.go(0)
      },
      analysis(str) {
        this.analysisArr = []
        this.analysisAgentId = []
        let doStr = ''
        switch (str) {
          case 'free':
            doStr = '示闲'
            break
          case 'busy':
            doStr = '示忙'
            break
          case 'logoff':
            doStr = '登出'
            break
          default:
            break
        }
        if (this.attentionList.length < 1) {
          Message({
            message: '您还未选中需要' + doStr + '的话机',
            type: 'error',
            duration: 1500
          })
        } else {
          for (let i = 0; i < this.attentionList.length; i++) {
            for (let j = 0; j < this.agentData.length; j++) {
              if (this.attentionList[i] === this.agentData[j].agentId) {
                if (this.reasoncodeMap.get(this.attentionList[i])) {
                  this.analysisArr.push(this.reasoncodeMap.get(this.attentionList[i]))
                } else {
                  this.analysisArr.push('-2')
                }
                this.analysisAgentId.push(this.agentData[j].agentId)
                break
              }
            }
          }
          if (this.analysisArr.length < 1 || this.analysisArr.indexOf('-2') > -1) {
            Message({
              message: '不能' + doStr + '未登录的话机',
              type: 'error',
              duration: 1500
            })
          } else {
            for (let i = 0; i < this.analysisAgentId.length; i++) {
              if (str === 'free') {
                cti.forceAvaiable(this.analysisAgentId[i])
              } else if (str === 'busy') {
                cti.forceBusy(this.analysisAgentId[i])
              } else if (str === 'logoff') {
                cti.forceLogoff(this.analysisAgentId[i])
              } else {
                Message({
                  message: '系统出错，请联系管理员！',
                  type: 'error',
                  duration: 1500
                })
              }
            }
          }
        }
      },
      monitorforceLogoff() {
        this.analysis('logoff')
      },
      monitorBusy() {
        this.analysis('busy')
      },
      monitorAvaiable() {
        this.analysis('free')
      },
      monitor(str) {
        let doStr = ''
        switch (str) {
          case 'intrude':
            doStr = '强插'
            break
          case 'listen':
            doStr = '监听'
            break
          case 'wisper':
            doStr = '耳语'
            break
          case 'forcerelease':
            doStr = '强拆'
            break
        }
        if (this.attentionList.length > 1) {
          Message({
            message: '一次最多' + doStr + '一个话机！',
            type: 'error',
            duration: 1500
          })
        } else if (this.attentionList.length === 1) {
          const reasoncode = this.reasoncodeMap.get(this.attentionList[0])
          let Intrudetnum = ''
          for (let i = 0; i < this.agentData.length; i++) {
            if (this.agentData[i].agentId === this.attentionList[0]) {
              Intrudetnum = this.agentData[i].DN
            }
          }
          switch (reasoncode) {
            case '-100':
            case '-101':
              if (str === 'intrude') {
                cti.IntrudeCall(Intrudetnum, this.monitorDN)
              } else if (str === 'listen') {
                cti.ListenCall(Intrudetnum, this.monitorDN)
              } else if (str === 'wisper') {
                cti.WisperCall(Intrudetnum, this.monitorDN)
              } else if (str === 'forcerelease') {
                cti.Forcerelease(Intrudetnum, this.monitorDN)
              } else {
                Message({
                  message: '系统出错，请联系管理员！',
                  type: 'error',
                  duration: 1500
                })
              }
              break
            default:
              Message({
                message: '您选中的话机不在通话状态！',
                type: 'error',
                duration: 1500
              })
              break
          }
        } else {
          Message({
            message: '您还未选中需要' + doStr + '的话机！',
            type: 'error',
            duration: 1500
          })
        }
      },
      monitorWisperCall() {
        this.monitor('wisper')
      },
      monitorForcerelease() {
        this.monitor('forcerelease')
      },
      monitorListenCall() {
        this.monitor('listen')
      },
      monitorIntrudeCall() {
        this.monitor('intrude')
      },
      change(agentId, type) {
        if (type) { // 如果选中了坐席
          if (baseinfo.attentionList.indexOf(agentId) === -1) { // 如果之前没有添加这个坐席，则需要增加这个坐席的工号
            baseinfo.attentionList.push(agentId)
          }
        } else { // 如果取消选中坐席
          if (baseinfo.attentionList.indexOf(agentId) > -1) { // 如果之前没添加过这个坐席，则需要删除这个坐席的工号
            baseinfo.attentionList.splice(baseinfo.attentionList.indexOf(agentId), 1)
          }
        }
      },
      timesInterval(i, agentId) {
        const time = new Date()
        const agentinterval = setInterval(function() {
          if (time) {
            const starttime = new Date(time)
            const endtime = new Date()
            const diff = (endtime.getTime() - starttime.getTime()) / 1000
            const days = Math.floor(diff / 1440 / 60)
            const hours = Math.floor((diff - days * 1440 * 60) / 3600)
            const minutes = Math.floor((diff - days * 1440 * 60 - hours * 3600) / 60)
            const seconds = (diff - days * 1440 * 60 - hours * 3600 - minutes * 60).toFixed(0)

            baseinfo.agentData[i].statusCount = hours + ':' + minutes + ':' + seconds
            baseinfo.$forceUpdate()
          }
        }, 1000)
        baseinfo.interval.set(agentId, agentinterval)
      },
      on_tier_add(event, agentid, queue) {
        this.Changequeue(queue, agentid)
      },
      changeCountLine() { // 更新统计在线情况的展示
        this.formInline.onlineCount = 0
        this.formInline.workingCount = 0
        this.formInline.busyCount = 0
        this.formInline.ringingCount = 0
        this.formInline.freeCount = 0
        this.reasoncodeMap.forEach((value, key) => {
          switch (value) {
            case '-100': // 来电通话，在线加1，通话人数加1
              this.formInline.onlineCount++
              this.formInline.workingCount++
              break
            case '-101': // 去电通话，在线加1，通话人数加1
              this.formInline.onlineCount++
              this.formInline.workingCount++
              break
            case '13': // 示忙，在线加1，示忙人数加1
              this.formInline.onlineCount++
              this.formInline.busyCount++
              break
            case '-3': // 来电响铃,在线加1，响铃人数加1
              this.formInline.onlineCount++
              this.formInline.ringingCount++
              break
            case '0': // 就绪，在线加1，空闲人数加1
              this.formInline.onlineCount++
              this.formInline.freeCount++
              break
            case '-4': // 去电回铃，在线加1，响铃人数加1
              this.formInline.onlineCount++
              this.formInline.ringingCount++
              break
            case '14': // 后处理，在线加1，示忙人数加1
              this.formInline.onlineCount++
              this.formInline.busyCount++
              break
            case '-1':
            case '-2':
            default:
              break
          }
        })
      },
      ChangeSeat(agentid, DN, reasoncode) {
        for (let i = 0; i < baseinfo.agentData.length; i++) {
          if (baseinfo.agentData[i].agentId === agentid) {
            baseinfo.reasoncodeMap.set(agentid, reasoncode)
            baseinfo.setImg(agentid, reasoncode)
            baseinfo.agentData[i].DN = DN
            baseinfo.agentData[i].status = this.getStatus(reasoncode)
            const dayTime = new Date()
            const updateTime = (dayTime.getMonth() + 1 > 9 ? dayTime.getMonth() + 1 : '0' + (dayTime.getMonth() + 1)) + '/' + (dayTime.getDate() > 9 ? dayTime.getDate() : '0' + dayTime.getDate()) + '/' + (dayTime.getFullYear()) + ' ' + (dayTime.getHours() > 9 ? dayTime.getHours() : '0' + dayTime.getHours()) + ':' + (dayTime.getMinutes() > 9 ? dayTime.getMinutes() : '0' + dayTime.getMinutes()) + ':' + (dayTime.getSeconds() > 9 ? dayTime.getSeconds() : '0' + dayTime.getSeconds())
            baseinfo.agentData[i].updateTime = updateTime

            findStatusByAgentId(agentid).then(res => {
              if (res.data.code === 0) {
                baseinfo.agentData[i].talkOutCount = res.data.data.outCallTotalTime
                baseinfo.agentData[i].talkOutTimes = parseInt(res.data.data.outCallTimes)
                baseinfo.agentData[i].comeinCount = res.data.data.inCallTotalTime
                baseinfo.agentData[i].comeinTimes = parseInt(res.data.data.inCallTimes)
                baseinfo.$forceUpdate()
              }
            })
            if (baseinfo.interval.get(agentid)) { // 如果已经有了定时器，则先清除
              clearInterval(baseinfo.interval.get(agentid))
            }
            baseinfo.timesInterval(i, agentid)
          }
        }
        baseinfo.changeCountLine()
      },
      removeSeat(DN, agentId) {
        console.log(DN + ',' + agentId)
        for (let i = 0; i < baseinfo.agentData.length; i++) {
          if (baseinfo.agentData[i].agentId === agentId) {
            baseinfo.agentData[i].status = this.getStatus('-2')
            baseinfo.agentData[i].updateTime = '未得到更新数据'
            baseinfo.agentData[i].queue = ''
            baseinfo.agentData[i].DN = ''
            baseinfo.setImg(agentId, '-2')
            baseinfo.reasoncodeMap.forEach((value, key) => {
              if (key === agentId) {
                baseinfo.reasoncodeMap.set(key, '-2')
              }
            })
            if (baseinfo.interval.get(agentId)) { // 如果已经有了定时器，则先清除
              clearInterval(baseinfo.interval.get(agentId))
            }
            baseinfo.agentData[i].statusCount = ''
          }
        }
        baseinfo.changeCountLine()
      },
      on_reasonchange(event, agentid, DN, reasoncode) {
        if (reasoncode === '-2') {
          this.removeSeat(DN, agentid)
        } else {
          this.ChangeSeat(agentid, DN, reasoncode)
        }
      },
      Changequeue(queue, AgentID) {
        for (let i = 0; i < baseinfo.agentData.length; i++) {
          if (baseinfo.agentData[i].agentId === AgentID) {
            baseinfo.agentData[i].queue = queue
          }
        }
      },
      on_tierlist(event, queue, AgentID) {
        this.Changequeue(queue, AgentID)
      },
      getStatus(reasoncode) {
        var status = '登出'
        switch (reasoncode) {
          case '-1':
          case '-2':
            status = '登出'
            break
          case '-100':
            status = '来电通话' // 离线，来电通话
            break
          case '-101':
            status = '去电通话' // 离线，去电通话
            break
          case '13':
          //		    status = "小休"; //离线
            status = '示忙'
            break
          case '-3':
            status = '来电振铃' // 离线，来电振铃
            break
          case '0':
            status = '就绪' // 离线
            break
          case '-4':
            status = '去电回铃' // 离线去电回铃
            break
          case '14':
            status = '后处理' // 离线
            break
          default:
            status = '登出' // 离线
            break
        }
        return status
      },
      setImg(agentId, reasoncode) {
        for (let i = 0; i < baseinfo.agentData.length; i++) {
          if (baseinfo.agentData[i].agentId === agentId) {
            switch (reasoncode) {
              case '-100': // 来电通话，在线加1，通话人数加1
                baseinfo.agentData[i].ringbackshow = false
                baseinfo.agentData[i].callout_talkingshow = false
                baseinfo.agentData[i].after_workingshow = false
                baseinfo.agentData[i].relaxshow = false
                baseinfo.agentData[i].readyshow = false
                baseinfo.agentData[i].lunchshow = false
                baseinfo.agentData[i].ringingshow = false
                baseinfo.agentData[i].comein_talkingshow = true
                baseinfo.agentData[i].loginoffshow = false
                baseinfo.agentData[i].busyshow = false
                break
              case '-101': // 去电通话，在线加1，通话人数加1
                baseinfo.agentData[i].ringbackshow = false
                baseinfo.agentData[i].callout_talkingshow = true
                baseinfo.agentData[i].after_workingshow = false
                baseinfo.agentData[i].relaxshow = false
                baseinfo.agentData[i].readyshow = false
                baseinfo.agentData[i].lunchshow = false
                baseinfo.agentData[i].ringingshow = false
                baseinfo.agentData[i].comein_talkingshow = false
                baseinfo.agentData[i].loginoffshow = false
                baseinfo.agentData[i].busyshow = false
                break
              case '13': // 示忙，在线加1，示忙人数加1
                baseinfo.agentData[i].ringbackshow = false
                baseinfo.agentData[i].callout_talkingshow = false
                baseinfo.agentData[i].after_workingshow = false
                baseinfo.agentData[i].relaxshow = false
                baseinfo.agentData[i].readyshow = false
                baseinfo.agentData[i].lunchshow = false
                baseinfo.agentData[i].ringingshow = false
                baseinfo.agentData[i].comein_talkingshow = false
                baseinfo.agentData[i].loginoffshow = false
                baseinfo.agentData[i].busyshow = true
                break
              case '-3': // 来电响铃,在线加1，响铃人数加1
                baseinfo.agentData[i].ringbackshow = false
                baseinfo.agentData[i].callout_talkingshow = false
                baseinfo.agentData[i].after_workingshow = false
                baseinfo.agentData[i].relaxshow = false
                baseinfo.agentData[i].readyshow = false
                baseinfo.agentData[i].lunchshow = false
                baseinfo.agentData[i].ringingshow = true
                baseinfo.agentData[i].comein_talkingshow = false
                baseinfo.agentData[i].loginoffshow = false
                baseinfo.agentData[i].busyshow = false
                break
              case '0': // 就绪，在线加1，空闲人数加1
                baseinfo.agentData[i].ringbackshow = false
                baseinfo.agentData[i].callout_talkingshow = false
                baseinfo.agentData[i].after_workingshow = false
                baseinfo.agentData[i].relaxshow = false
                baseinfo.agentData[i].readyshow = true
                baseinfo.agentData[i].lunchshow = false
                baseinfo.agentData[i].ringingshow = false
                baseinfo.agentData[i].comein_talkingshow = false
                baseinfo.agentData[i].loginoffshow = false
                baseinfo.agentData[i].busyshow = false
                break
              case '-4': // 去电回铃，在线加1，响铃人数加1
                baseinfo.agentData[i].ringbackshow = true
                baseinfo.agentData[i].callout_talkingshow = false
                baseinfo.agentData[i].after_workingshow = false
                baseinfo.agentData[i].relaxshow = false
                baseinfo.agentData[i].readyshow = false
                baseinfo.agentData[i].lunchshow = false
                baseinfo.agentData[i].ringingshow = false
                baseinfo.agentData[i].comein_talkingshow = false
                baseinfo.agentData[i].loginoffshow = false
                baseinfo.agentData[i].busyshow = false
                break
              case '14': // 后处理，在线加1，示忙人数加1
                baseinfo.agentData[i].ringbackshow = false
                baseinfo.agentData[i].callout_talkingshow = false
                baseinfo.agentData[i].after_workingshow = true
                baseinfo.agentData[i].relaxshow = false
                baseinfo.agentData[i].readyshow = false
                baseinfo.agentData[i].lunchshow = false
                baseinfo.agentData[i].ringingshow = false
                baseinfo.agentData[i].comein_talkingshow = false
                baseinfo.agentData[i].loginoffshow = false
                baseinfo.agentData[i].busyshow = false
                break
              case '-1':
              case '-2':
              default:
                baseinfo.agentData[i].ringbackshow = false
                baseinfo.agentData[i].callout_talkingshow = false
                baseinfo.agentData[i].after_workingshow = false
                baseinfo.agentData[i].relaxshow = false
                baseinfo.agentData[i].readyshow = false
                baseinfo.agentData[i].lunchshow = false
                baseinfo.agentData[i].ringingshow = false
                baseinfo.agentData[i].comein_talkingshow = false
                baseinfo.agentData[i].loginoffshow = true
                baseinfo.agentData[i].busyshow = false
                break
            }
          }
        }
      },
      addSeat(agentid, DN, reasoncode, UpdateTime) {
        for (let i = 0; i < baseinfo.agentData.length; i++) {
          if (baseinfo.agentData[i].agentId === agentid) {
            baseinfo.agentData[i].DN = DN
            baseinfo.agentData[i].status = this.getStatus(reasoncode)
            baseinfo.agentData[i].updateTime = UpdateTime
            if (baseinfo.interval.get(agentid)) { // 如果已经有了定时器，则先清除
              clearInterval(baseinfo.interval.get(agentid))
            }
            baseinfo.setImg(agentid, reasoncode)
            baseinfo.timesInterval(i, agentid)
            baseinfo.reasoncodeMap.set(agentid, reasoncode)
          }
        }
        baseinfo.changeCountLine()
      },
      on_AgentStatusList(event, agentid, DN, reasoncode, UpdateTime) {
        if (agentid !== '') {
          this.addSeat(agentid, DN, reasoncode, UpdateTime)
        }
      },
      monitorlogin() {
        if (typeof baseinfo.monitorDN === 'undefined' || baseinfo.monitorDN === '' || baseinfo.monitorDN.trim() === '') {
          baseinfo.monitorDN = '12345'
        }
        baseinfo.monitorID = localStorage.getItem('agentId')
        cti.login(baseinfo.monitorID, baseinfo.monitorDN)
        // cti.Send2wsCTIterval(this.monitorID)
        baseinfo.setbtnStatus('login')
      },
      setbtnStatus(str) { // 设置按钮功能
        switch (str) {
          case 'sessionclosed':
            this.btnunIntrudeIn = true
            this.btnunListen = true
            this.btnunWhisper = true
            this.btnunIntrudeOut = true
            this.btnunForceFree = true
            this.btnunForceBusy = true
            this.btnunForceLogoff = true
            break
          case 'login':
            this.btnunIntrudeIn = false
            this.btnunListen = false
            this.btnunWhisper = false
            this.btnunIntrudeOut = false
            this.btnunForceFree = false
            this.btnunForceBusy = false
            this.btnunForceLogoff = false
            break
          case 'logoff':
            this.btnunIntrudeIn = true
            this.btnunListen = true
            this.btnunWhisper = true
            this.btnunIntrudeOut = true
            this.btnunForceFree = true
            this.btnunForceBusy = true
            this.btnunForceLogoff = true
            break
          default :
            this.btnunIntrudeIn = true
            this.btnunListen = true
            this.btnunWhisper = true
            this.btnunIntrudeOut = true
            this.btnunForceFree = true
            this.btnunForceBusy = true
            this.btnunForceLogoff = true
            break
        }
      },
      on_queuecount(event, queuename, queuecount) {
        console.log('on_queuecount:queuename=' + queuename + ',queuecount=' + queuecount)
      },
      on_hangup_event(event, agentId, DN, UUID, hangupLine, activeLineCount) {
        console.log('on_hangup_event:agentId=' + agentId + ',DN=' + DN + ',UUID=' + UUID + ',hangupLine=' + hangupLine + ',activeLineCount=' + activeLineCount)
      },
      on_queuelist(event, queue, queue_count) {
        console.log('on_queuelist:queue=' + queue + ',queuecount=' + queue_count)
      },
      on_monistorStatus(event, data) {
        console.log('on_monistorStatus:data=' + data)
      },
      on_SessionClose(event) {
        this.setbtnStatus('sessionclosed')
      },
      NewSessionConnected(event) {
        this.setbtnStatus('logoff')
        this.monitorlogin()
      }
    },
    mounted() {
      baseinfo = this
      findNextAgentByNow().then(res => {
        if (res.data.code === 1) {
          if (res.data.data.length > 0) {
            var map = new Map()
            for (var i = 0; i < res.data.data.length; i++) {
              map.set(res.data.data[i][1], res.data.data[i][2])
            }
            baseinfo.monitorID = localStorage.getItem('agentId')
            if (localStorage.getItem('DN')) {
              baseinfo.monitorDN = localStorage.getItem('DN')
            }
            map.delete(baseinfo.monitorID)
            baseinfo.agentNext_map = map
            baseinfo.formInline.totalCount = baseinfo.agentNext_map.size
            if (baseinfo.agentNext_map.size > 0) {
              baseinfo.agentNext_map.forEach((value, key) => {
                var obj = {}
                obj.staffName = value
                obj.agentId = key
                obj.status = '登出'
                obj.updateTime = '未得到更新数据'
                baseinfo.agentData.push(obj)
                obj.ringbackshow = false
                obj.callout_talkingshow = false
                obj.after_workingshow = false
                obj.relaxshow = false
                obj.readyshow = false
                obj.lunchshow = false
                obj.ringingshow = false
                obj.comein_talkingshow = false
                obj.loginoffshow = true
                obj.busyshow = false
              })
              var ctiIP_Port = 'ws://119.27.179.175:9052/'
              cti.connectCTI(ctiIP_Port)
              for (let j = 0; j < baseinfo.agentData.length; j++) {
                findStatusByAgentId(baseinfo.agentData[j].agentId).then((response) => {
                  if (response.data.code === 0) {
                    var data = response.data.data
                    if (data) {
                      baseinfo.agentData[j].talkOutCount = data.outCallTotalTime
                      baseinfo.agentData[j].talkOutTimes = data.outCallTimes
                      baseinfo.agentData[j].comeinCount = data.inCallTotalTime
                      baseinfo.agentData[j].comeinTimes = data.inCallTimes
                      this.$forceUpdate()
                    }
                  }
                })
              }
            }
          }
        }
      })
    }
  }
</script>
