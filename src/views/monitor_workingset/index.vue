<template>
  <div class="app-container">
    <div >
      <el-row :gutter="20">

        <el-col :span="8">
          <el-card shadow="hover" style="background-color:#339999;">
            <div slot="header" class="clearfix">
              <div style="display: inline-block;line-height: 50px;width:50%">
                <font style="font-size:large;color:#fff;padding-right: 5px">首拨总数量: </font>
                <font style="font-size:large;color:rgb(255,255,0);">{{obTaskData.firstCallTotal}}</font>
              </div>
              <div style="display: inline-block;line-height: 50px;width:10%;float:right;"><i class="el-icon-phone-outline" style="color:white;cursor:pointer;font-size:25px;font-weight:bold"  @click="changeToDailTask('0')"></i></div>
            </div>
            <div class="text item">
              <el-row>
                <el-col :span="8" >
                  <el-card shadow="hover" style="background-color:#f66">
                    <el-row>
                      <el-col :span="16" :offset="4">
                        <div class="circle" style="border:solid #f66 1px;background-color:#fff;">
                          <font class="line-center" style="color:#f66;">{{obTaskData.appointCallTotal}}</font>
                        </div>
                      </el-col>
                    </el-row>
                    <div style="text-align: center">
                      <font class="text-align-center" style="font-size: small">今日总预约量</font>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card shadow="hover" style="background-color:#36a9ce">
                    <el-row>
                      <el-col :span="16" :offset="4">
                        <div class="circle" style="border:solid #36a9ce 1px;background-color:#fff;">
                          <font class="line-center" style="color:#36a9ce;">{{obTaskData.successCallTotal}}</font>
                        </div>
                      </el-col>
                    </el-row>
                    <div style="text-align: center">
                      <font class="text-align-center" style="font-size: small">今日总成功量</font>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card shadow="hover" style="background-color:#eb7f36">
                    <el-row>
                      <el-col :span="16" :offset="4">
                        <div class="circle"  style="border:solid #eb7f36 1px;background-color:#fff;">
                          <font class="line-center" style="color:#eb7f36;">{{obTaskData.failedCallTotal}}</font>
                        </div>
                      </el-col>
                    </el-row>
                    <div style="text-align: center">
                      <font class="text-align-center" style="font-size: small">今日总失败量</font>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card shadow="hover" style="background-color:#339999;">
            <div slot="header" class="clearfix">
              <div style="display: inline-block;line-height: 50px;cursor: pointer" @click="changeToOrderManagement()">
                <font style="font-size:large;color:#fff;padding-right: 5px">订单数量: </font>
                <font style="font-size:large;color:rgb(255,255,0);">{{orderData.count}}</font>
              </div>
            </div>
            <div class="text item">
              <el-row>
                <el-col :span="8" :offset="3">
                  <el-card shadow="hover" style="background-color:#36a9ce">
                    <el-row>
                      <el-col :span="16" :offset="4">
                        <div class="circle" style="border:solid #36a9ce 1px;background-color:#fff;">
                          <a @click="changeToOrderManagement()"><font class="line-center" style="color:#36a9ce;">{{orderData.total_amount}}</font></a>
                        </div>
                      </el-col>
                    </el-row>
                    <div style="text-align: center">
                      <font class="text-align-center" style="font-size: small">订单总金额</font>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8" :offset="2">
                  <el-card shadow="hover" style="background-color:#eb7f36">
                    <el-row>
                      <el-col :span="16" :offset="4">
                        <div class="circle"  style="border:solid #eb7f36 1px;background-color:#fff;">
                          <a @click="changeToOrderManagement()"><font class="line-center" style="color:#eb7f36;">{{orderData.avg_amount}}</font></a>
                        </div>
                      </el-col>
                    </el-row>
                    <div style="text-align: center">
                      <font class="text-align-center" style="font-size: small">订单平均金额</font>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card shadow="hover" style="background-color:#339999;">
            <div slot="header" class="clearfix">
              <el-row>
                <el-col :span="8" >
              <div style="display: inline-block;line-height: 25px;" >
                <font style="font-size:large;color:#fff;padding-right: 5px">通话时间: </font>
                <font style="font-size:large;color:rgb(255,255,0);cursor: pointer" @click="changeToMonitorPhone()">{{formatSeconds(ctiData.call_time_duration)}}</font>
              </div>
              <div style="display: inline-block;line-height: 25px;">
                <font style="font-size:large;color:#fff;padding-right: 5px">通话次数: </font>
                <font style="font-size:large;color:rgb(255,255,0);cursor: pointer"  @click="changeToMonitorPhone()">{{ctiData.calls_number}}</font>
              </div>
              </el-col>
              <el-col :span="8" :offset="8">
              <div style="line-height: 25px">
                <font style="font-size:large;color:#fff;padding-right: 5px">在线人数: </font>
                <font style="font-size:large;color:rgb(255,255,0);cursor: pointer"  @click="changeToMonitorPhone()">{{onlineNum}}</font>
              </div>
               <div style="line-height: 25px">
                <font style="font-size:large;color:#fff;padding-right: 5px">部门人数: </font>
                <font style="font-size:large;color:rgb(255,255,0);cursor: pointer"  @click="changeToMonitorPhone()">{{totalNum}}</font>
              </div>
              </el-col>
              </el-row>
            </div>
            <div class="text item">
              <el-row>
                <el-col :span="8" >
                  <el-card shadow="hover" style="background-color:#f66">
                    <el-row>
                      <el-col :span="16" :offset="4">
                        <div class="circle" style="border:solid #f66 1px;background-color:#fff;">
                          <a @click="changeToMonitorPhone()"><font class="line-center" style="color:#f66;">{{formatSeconds(ctiData.online_time_duration)}}</font></a>
                        </div>
                      </el-col>
                    </el-row>
                   <div style="text-align: center">
                      <font class="text-align-center" style="font-size: small">在线时长</font>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card shadow="hover" style="background-color:#36a9ce">
                    <el-row>
                      <el-col :span="16" :offset="4">
                        <div class="circle" style="border:solid #36a9ce 1px;background-color:#fff;">
                          <a @click="changeToMonitorPhone()"><font class="line-center" style="color:#36a9ce;">{{formatSeconds(ctiData.free_time_duration)}}</font></a>
                        </div>
                      </el-col>
                    </el-row>
                    <div style="text-align: center">
                      <font class="text-align-center" style="font-size: small">空闲时长</font>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card shadow="hover" style="background-color:#eb7f36">
                    <el-row>
                      <el-col :span="16" :offset="4">
                        <div class="circle"  style="border:solid #eb7f36 1px;background-color:#fff;">
                          <a @click="changeToMonitorPhone()"><font class="line-center" style="color:#eb7f36;">{{formatSeconds(ctiData.busy_time_duration)}}</font></a>
                        </div>
                      </el-col>
                    </el-row>
                    <div style="text-align: center">
                      <font class="text-align-center" style="font-size: small">示忙时长</font>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>

      </el-row>

    </div>
  <div class="work-table-style">
    <el-row>
      <div class="work-title-style">拨打任务情况</div>
    </el-row>
    <el-row>
        <el-col>
          <el-table :data="obTaskTable" border>
            <el-table-column align="center" label="序号" width="55">
              <template slot-scope="scope">
                  <div>{{scope.$index+1}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="部门人员" width="135">
              <template slot-scope="scope">
                  <div>{{agentMap[scope.row.staffId]+" ("+scope.row.staffId+")"}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="首拨数量">
              <template slot-scope="scope">
                  <div>{{scope.row.noContactNum}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="今日预约量" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <div>{{scope.row.appiontNum}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="今日成功量">
              <template slot-scope="scope">
                <div>{{scope.row.successNum}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="今日失败量" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <div>{{scope.row.failNum}}</div>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
    </el-row>
  </div>
  <div class="work-table-style">
    <el-row>
      <div class="work-title-style">业务表单情况</div>
    </el-row>
    <el-row>
        <el-col>
          <el-table :data="orderTable" border>
            <el-table-column align="center" label="序号" width="55">
              <template slot-scope="scope">
                <div>{{scope.$index+1}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="部门人员" width="135">
              <template slot-scope="scope">
                  <div>{{agentMap[scope.row.agent_id] +" ("+scope.row.agent_id+")"}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="订单数量">
              <template slot-scope="scope">
                  <div>{{scope.row.count}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="订单总金额" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <div>{{scope.row.total_amount}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="订单平均金额">
              <template slot-scope="scope">
                <div>{{scope.row.avg_amount}}</div>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
    </el-row>
  </div>
  <div class="work-table-style">
    <el-row>
      <div class="work-title-style">话机使用情况</div>
    </el-row>
    <el-row>
        <el-col>
          <el-table :data="ctiTable" border>
            <el-table-column align="center" label="序号" width="55">
              <template slot-scope="scope">
                  <div>{{scope.$index+1}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="部门人员" width="135">
              <template slot-scope="scope">
                  <div>{{agentMap[scope.row.agent_id] +" ("+scope.row.agent_id+")"}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="通话时间">
              <template slot-scope="scope">
                  <div>{{formatSeconds(scope.row.call_time_duration)}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="通话次数" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <div>{{scope.row.calls_number}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="在线时长">
              <template slot-scope="scope">
                <div>{{formatSeconds(scope.row.online_time_duration)}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="空闲时长">
              <template slot-scope="scope">
                <div>{{formatSeconds(scope.row.free_time_duration)}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="示忙时长">
              <template slot-scope="scope">
                <div>{{formatSeconds(scope.row.busy_time_duration)}}</div>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
    </el-row>
  </div> 
  </div>
</template>

<script>

import moment from 'moment'
import { formatDateTime, getStartTimestamp, getEndTimestamp, formatSeconds } from '@/utils/tools'
import { taskAssignInfo, agentOnlineStatus, findCampaignByUser, departAgents, orderReportStatistics, agentOrderStatistics, ctiRecordStatistics, ctiReportByAgent } from '@/api/monitor_workingset'
export default {
  name: 'ord_workingset',
  data() {
    return {
      wscti: '',
      selectStatus: 'today',
      ischecked: true,
      obTaskData: {
        firstCallTotal: 0, // 首拨
        appointCallTotal: 0, // 预约
        successCallTotal: 0, // 成功
        failedCallTotal: 0// 失败
      },
      orderData: {
        count: 0, // 数量
        total_amount: 0, // 总金额
        avg_amount: 0// 平均金额
      },
      ctiData: {
        online_time_duration: 0, // 在线时长
        free_time_duration: 0, // 空闲时长
        busy_time_duration: 0, // 示忙时长
        call_time_duration: 0, // 通话时长
        calls_number: 0// 通话次数
      },
      obTaskTable: [],
      orderTable: [],
      ctiTable: [],
      agentMap: {},
      totalNum: 0,
      onlineNum: 0,
      agentArray: [],
      campaignIdArray: [],
      timerOnline: null,
      timerOrder: null,
      timerObTask: null
    }
  },
  beforeDestroy() {
    if (this.timerOnline) {
      clearInterval(this.timerOnline)
    }
    if (this.timerOrder) {
      clearInterval(this.timerNumber)
    }
    if (this.timerObTask) {
      clearInterval(this.timerObTask)
    }
  },

  mounted() {
    this.online()
    this.order()
    this.obTask()
    this.timerOnline = setInterval(this.online, 300000)
    this.timerOrder = setInterval(this.order, 600000)
    this.timerObTask = setInterval(this.obTask, 600000)
  },
  methods: {
    online() {
      const obj = { depart_id: localStorage.getItem('departId') }
      departAgents(obj).then(res => {
        this.agentMap = {}
        if (!res.data.error) {
          this.totalNum = res.data.result.agents.length
          this.agentArray = []
          res.data.result.agents.forEach(element => {
            const agent_id = (element.agent_id).toString()
            const real_name = element.real_name
            this.agentMap[agent_id] = real_name
            this.agentArray.push(element.agent_id)
          })
          agentOnlineStatus({ agent_id: this.agentArray.join(',') }).then(res => {
            if (!res.data.errorCode) {
              this.onlineNum = res.data.online_count
            }
          })
          this.obTaskTable = []
          this.agentArray.forEach(element => {
            this.obTaskTable.push({ staffId: element, appiontNum: 0, successNum: 0, failNum: 0, noContactNum: 0 })
          })
          findCampaignByUser().then(res => {
            if (res.data.code === 0) {
              if (res.data.data) {
                res.data.data.forEach(element => {
                  this.campaignIdArray.push(element.campaignId)
                })
                console.log('startTime', formatDateTime(new Date().setHours(0, 0, 0, 0)))
                console.log('endTime', formatDateTime(new Date().setHours(23, 59, 59, 59)))
                console.log('campagin:', this.campaignIdArray.join(','))
                taskAssignInfo({ startTime: formatDateTime(new Date().setHours(0, 0, 0, 0)), endTime: formatDateTime(new Date().setHours(23, 59, 59, 59)), campaignIds: this.campaignIdArray.join(','), type: '0', currentDepartId: localStorage.getItem('departId'), pageSize: 10000 }).then(res => {
                  if (res.data.code === 0 && res.data.data) {
                    for (var i = 0; i < res.data.data.length; i++) {
                      for (var j = 0; j < this.obTaskTable.length; j++) {
                        if (this.obTaskTable[j].staffId === res.data.data[i].staffId) {
                          this.obTaskTable[j].appiontNum = parseInt(res.data.data[i].appiontNum) + parseInt(this.obTaskTable[j].appiontNum)
                          this.obTaskTable[j].successNum = parseInt(res.data.data[i].successNum) + parseInt(this.obTaskTable[j].successNum)
                          this.obTaskTable[j].failNum = parseInt(res.data.data[i].failNum) + parseInt(this.obTaskTable[j].failNum)
                          this.obTaskTable[j].noContactNum = parseInt(res.data.data[i].noContactNum) + parseInt(this.obTaskTable[j].noContactNum)
                        }
                      }
                    }
                    this.obTaskData = { firstCallTotal: 0, // 首拨
                      appointCallTotal: 0, // 预约
                      successCallTotal: 0, // 成功
                      failedCallTotal: 0// 失败
                    }
                    console.log('total:', this.obTaskTable)
                    this.obTaskTable.forEach(element => {
                      this.obTaskData.firstCallTotal = parseInt(element.noContactNum) + parseInt(this.obTaskData.firstCallTotal)
                      this.obTaskData.appointCallTotal = parseInt(element.appiontNum) + parseInt(this.obTaskData.appointCallTotal)
                      this.obTaskData.successCallTotal = parseInt(element.successNum) + parseInt(this.obTaskData.successCallTotal)
                      this.obTaskData.failedCallTotal = parseInt(element.failNum) + parseInt(this.obTaskData.failedCallTotal)
                    })
                  }
                })
              }
              console.log('####', res.data)
            }
          })
        }
        console.log(process.env.BASE_API)
      })
    },
    order() {
      const param = { statistics_type: 'agent', depart_id: localStorage.getItem('departId'), time_dimension: 'day', start_time: getStartTimestamp(moment().format(formatDateTime(new Date()).split(' ')[0]), 'day'), end_time: getEndTimestamp(moment().format(formatDateTime(new Date()).split(' ')[0]), 'day') }
      orderReportStatistics(param).then(res => {
        if (!res.data.error) {
          this.orderData.count = res.data.result[0].count
          this.orderData.total_amount = res.data.result[0].total_amount
          this.orderData.avg_amount = res.data.result[0].avg_amount
        }
      })
      agentOrderStatistics(param).then(res => {
        if (!res.data.error) {
          this.orderTable = res.data.result
        }
      })
    },
    obTask() {
      const param = { statistics_type: 'agent', depart_id: localStorage.getItem('departId'), time_dimension: 'day', start_time: getStartTimestamp(moment().format(formatDateTime(new Date()).split(' ')[0]), 'day'), end_time: getEndTimestamp(moment().format(formatDateTime(new Date()).split(' ')[0]), 'day') }
      ctiRecordStatistics(param).then(res => {
        if (!res.data.error) {
          this.ctiData.online_time_duration = res.data.result[0].online_time_duration
          this.ctiData.free_time_duration = res.data.result[0].free_time_duration
          this.ctiData.busy_time_duration = res.data.result[0].busy_time_duration
          this.ctiData.call_time_duration = res.data.result[0].call_time_duration
          this.ctiData.calls_number = res.data.result[0].calls_number
        }
      })
      ctiReportByAgent(param).then(res => {
        if (!res.data.error) {
          this.ctiTable = res.data.result
        }
      })
    },
    formatSeconds: formatSeconds,
    formatDateTime: formatDateTime,
    connectCTI() {
      var strIP_Port = 'ws://119.27.179.175:9052/'
      var self = this
      this.wscti = new WebSocket(strIP_Port)
      console.log('wscti999', this.wscti)
      this.wscti.onopen = function(evt) {
        console.log('wscti888', evt)
      }
      this.wscti.onmessage = function(evt) {
        console.log(evt)
        // console.log(1)
      }
    },
    onMessage(evt) {
      console.log(evt)
      var obj = JSON.parse(evt.data)
      var event_name = obj.EventName
      if (event_name === 'AgentStatusList') {
        console.log('asdfas6g1adf4#####')
        var agentid = this.GetEventValue('AgentID', obj.BodyData)
        var reasoncode = this.GetEventValue('reasoncode', obj.BodyData)
        this.agentArray.forEach(element => {
          if (element === agentid) {
            if (reasoncode === '-2' || reasoncode === '-1') {
              this.onlineNum = this.onlineNum - 1
            } else {
              this.onlineNum = this.onlineNum + 1
            }
          }
        })
      }
    },
    GetEventValue(strHeader, p) {
      for (var i = 0; i < p.length; i++) {
        if (p[i].BodyHeader === strHeader) {
          return p[i].BodyValue
        }
      }
      return ''
    },
    // findCallInfo(obj) {
    //   findTotalContactByTime(obj).then(res => {
    //     if (res.data.code === 0) {
    //       this.rowInfo.totalCallOut = res.data.data.callTotalCount
    //       this.rowInfo.totalCallTime = res.data.data.callTotalTime
    //       this.rowInfo.failedCallTotal = res.data.data.callFailCount
    //       this.rowInfo.answerTotal = res.data.data.callSuccessCount
    //       this.selectStatus = obj
    //     }
    //   })
    // },
    changeToDailPage(status) {
      this.$router.push({
        name: 'dial_task.html',
        query: { 'dialstatus': status, 'isDialTask': false }
      })
      sessionStorage.removeItem('isDialTask')
    },
    // changeToDailInfo(str) {
    //   const startTime = new Date(new Date().setHours(0, 0, 0, 0))
    //   const endTime = new Date(new Date().setHours(23, 59, 59, 0))
    //   let sTime = ''
    //   let eTime = ''
    //   let monthNum = 0
    //   let callStatu = 0 // 未接通状态
    //   switch (str) {
    //     case '0':
    //       callStatu = 0
    //       break
    //     case '1':
    //       callStatu = 1
    //       break
    //   }

    //   switch (this.selectStatus) {
    //     case 'yesterday':
    //       startTime.setDate(startTime.getDate() - 1)
    //       endTime.setDate(endTime.getDate() - 1)
    //       sTime = formatDateTime(startTime)
    //       eTime = formatDateTime(endTime)
    //       break
    //     case 'today':
    //       sTime = formatDateTime(startTime)
    //       eTime = formatDateTime(endTime)
    //       break
    //     case 'month':
    //       startTime.setDate(1)
    //       sTime = formatDateTime(startTime)
    //       monthNum = endTime.getMonth()
    //       eTime = formatDateTime(new Date(new Date(endTime.getFullYear(), ++monthNum, 1) - 1))
    //       break
    //   }
    //   this.$router.push({
    //     name: 'contact_record_dail.html',
    //     query: { 'sTime': sTime, 'eTime': eTime, 'callStatu': callStatu }
    //   })
    // },
    changeToDailTask(status) {
      this.$router.push({
        name: 'dial_task.html',
        query: { 'dialstatus': status }
      })
      sessionStorage.removeItem('isDialTask')
      sessionStorage.removeItem('quickDialto')
    },
    changeToOrderManagement() {
      this.$router.push({
        name: 'order_management.html',
        query: { 'startTime': formatDateTime(new Date().setHours(0, 0, 0, 0)),
          'endTime': formatDateTime(new Date().setHours(23, 59, 59, 59)) }
      })
    },
    changeToMonitorPhone() {
      this.$router.push({
        name: 'monitor_phone.html'
      })
    }
  }
}
</script>
<style>
.el-card__body{
  padding: 2%
}
.circle{
  width:110px;
  height:40px;
  border-radius:40px;
  float:left;
  text-align:center;
}
.line-center{
  line-height:40px;
  font-size:14px;
  font-weight:bold;
}
.p-item{
  margin-top:23%;
  margin-left:-4%;
  float:left
}
.text-align-center{
  font-size:large;
  color:#fff;
  margin-top:1%;
  line-height:50px;
}
.squash-item{
  width: 80px;
  height: 25px;
  border-bottom-right-radius:10px;
  border-top-right-radius:10px;
  border:solid #36a9ce 1px;
  line-height: 25px;
  font-weight:500;
  background-color:#36a9ce;
}
.work-table-style{
  margin-top:1%;
}
.work-title-style{
  margin-bottom:5px;
}
</style>
