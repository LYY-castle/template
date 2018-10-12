<template>
  <div class="app-container">
    <div >
      <el-row :gutter="20">

        <el-col :span="8">
          <el-card shadow="hover" style="background-color:#339999;">
            <div slot="header" class="clearfix">
              <div style="display: inline-block;line-height: 50px;cursor: pointer" @click="changeToDailTask('0')">
                <font style="font-size:large;color:#fff;padding-right: 5px">首拨数量: </font>
                <font style="font-size:large;color:rgb(255,255,0);">{{obTaskData.firstCallTotal}}</font>
              </div>
            </div>
            <div class="text item">
              <el-row>
                <el-col :span="8" >
                  <el-card shadow="hover" style="background-color:#f66">
                    <el-row>
                      <el-col :span="16" :offset="4">
                        <div class="circle" style="border:solid #f66 1px;background-color:#fff;">
                          <a @click="changeToDailTask('1')"><font class="line-center" style="color:#f66;">{{obTaskData.appointCallTotal}}</font></a>
                        </div>
                      </el-col>
                    </el-row>
                    <div style="text-align: center">
                      <font class="text-align-center" style="font-size: small">今日预约量</font>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card shadow="hover" style="background-color:#36a9ce">
                    <el-row>
                      <el-col :span="16" :offset="4">
                        <div class="circle" style="border:solid #36a9ce 1px;background-color:#fff;">
                          <a @click="changeToDailTask('2')"><font class="line-center" style="color:#36a9ce;">{{obTaskData.successCallTotal}}</font></a>
                        </div>
                      </el-col>
                    </el-row>
                    <div style="text-align: center">
                      <font class="text-align-center" style="font-size: small">今日成功量</font>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card shadow="hover" style="background-color:#eb7f36">
                    <el-row>
                      <el-col :span="16" :offset="4">
                        <div class="circle"  style="border:solid #eb7f36 1px;background-color:#fff;">
                          <a @click="changeToDailTask('3')"><font class="line-center" style="color:#eb7f36;">{{obTaskData.failedCallTotal}}</font></a>
                        </div>
                      </el-col>
                    </el-row>
                    <div style="text-align: center">
                      <font class="text-align-center" style="font-size: small">今日失败量</font>
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
              <div style="display: inline-block;line-height: 50px;cursor: pointer" @click="changeToDailTask('0')">
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
                          <a @click="changeToDailTask('2')"><font class="line-center" style="color:#36a9ce;">{{orderData.total_amount}}</font></a>
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
                          <a @click="changeToDailTask('3')"><font class="line-center" style="color:#eb7f36;">{{orderData.avg_amount}}</font></a>
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
              <div style="display: inline-block;line-height: 25px;cursor: pointer" @click="changeToDailTask('0')">
                <font style="font-size:large;color:#fff;padding-right: 5px">通话时间: </font>
                <font style="font-size:large;color:rgb(255,255,0);">{{ctiData.call_time_duration}}</font>
              </div>
              <div style="display: inline-block;line-height: 25px;cursor: pointer" @click="changeToDailTask('0')">
                <font style="font-size:large;color:#fff;padding-right: 5px">通话次数: </font>
                <font style="font-size:large;color:rgb(255,255,0);">{{ctiData.calls_number}}</font>
              </div>
              </el-col>
              <el-col :span="8" :offset="8">
              <div style="line-height: 25px">
                <font style="font-size:large;color:#fff;padding-right: 5px">在线人数: </font>
                <font style="font-size:large;color:rgb(255,255,0);">{{obTaskData.firstCallTotal}}</font>
              </div>
               <div style="line-height: 25px">
                <font style="font-size:large;color:#fff;padding-right: 5px">部门人数: </font>
                <font style="font-size:large;color:rgb(255,255,0);">{{totalNum}}</font>
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
                          <a @click="changeToDailTask('1')"><font class="line-center" style="color:#f66;">{{ctiData.online_time_duration}}</font></a>
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
                          <a @click="changeToDailTask('2')"><font class="line-center" style="color:#36a9ce;">{{ctiData.free_time_duration}}</font></a>
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
                          <a @click="changeToDailTask('3')"><font class="line-center" style="color:#eb7f36;">{{ctiData.busy_time_duration}}</font></a>
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
                  <div>{{agentMap[scope.row.agent_id]}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="首拨数量">
              <template slot-scope="scope">
                  <div>{{scope.row.new_first_dial_task_count}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="今日预约量" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <div>{{scope.row.new_appoint_contact_task_count}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="今日成功量">
              <template slot-scope="scope">
                <div>{{scope.row.new_success_contact_task_count}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="今日失败量" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <div>{{scope.row.new_fail_contact_task_count}}</div>
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
                  <div>{{agentMap[scope.row.agent_id]}}</div>
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
                  <div>{{agentMap[scope.row.agent_id]}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="通话时间">
              <template slot-scope="scope">
                  <div>{{scope.row.call_time_duration}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="通话次数" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <div>{{scope.row.calls_number}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="在线时长">
              <template slot-scope="scope">
                <div>{{scope.row.online_time_duration}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="空闲时长">
              <template slot-scope="scope">
                <div>{{scope.row.free_time_duration}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="示忙时长">
              <template slot-scope="scope">
                <div>{{scope.row.busy_time_duration}}</div>
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
import { formatDateTime, getStartTimestamp, getEndTimestamp } from '@/utils/tools'
import { getListUseDetailBillByOrganid, departAgents, orderReportStatistics, agentOrderStatistics, ctiRecordStatistics, ctiReportByAgent } from '@/api/monitor_workingset'
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
      agentArray: []
    }
  },
  mounted() {
    const param = { statistics_type: 'agent', depart_id: localStorage.getItem('departId'), time_dimension: 'day', start_time: getStartTimestamp(moment().format(formatDateTime(new Date()).split(' ')[0]), 'day'), end_time: getEndTimestamp(moment().format(formatDateTime(new Date()).split(' ')[0]), 'day') }
    // getListUsingByOrganId(param).then(res => {
    //   if (!res.data.error) {
    //     this.obTaskData.firstCallTotal = res.data.result[0].new_first_dial_task_count
    //     this.obTaskData.appointCallTotal = res.data.result[0].new_appoint_contact_task_count
    //     this.obTaskData.successCallTotal = res.data.result[0].new_success_contact_task_count
    //     this.obTaskData.failedCallTotal = res.data.result[0].new_fail_contact_task_count
    //   }
    // })
    getListUseDetailBillByOrganid({ organid: localStorage.getItem('departId') }).then(res => {
      if (!res.data.error) {
        this.obTaskTable = res.data.result
      }
    })
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
    const obj = { depart_id: localStorage.getItem('departId') }
    departAgents(obj).then(res => {
      this.agentMap = {}
      if (!res.data.error) {
        this.totalNum = res.data.result.agents.length
        res.data.result.agents.forEach(element => {
          const agent_id = (element.agent_id).toString()
          const real_name = element.real_name
          this.agentMap[agent_id] = real_name
          this.agentArray.push(element.agent_id)
        })
        this.connectCTI()
      }
      console.log(process.env.BASE_API)
    })
    // findTotalContactByTime('today').then(res => {
    //   if (res.data.code === 0) {
    //     this.rowInfo.totalCallOut = res.data.data.callTotalCount
    //     this.rowInfo.totalCallTime = res.data.data.callTotalTime
    //     this.rowInfo.failedCallTotal = res.data.data.callFailCount
    //     this.rowInfo.answerTotal = res.data.data.callSuccessCount
    //     this.selectStatus = 'today'
    //   }
    // })
  },
  methods: {
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
