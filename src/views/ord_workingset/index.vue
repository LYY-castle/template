<template>
  <div class="app-container">
    <div>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-card shadow="hover" style="background-color:#339999;">
            <div slot="header" class="clearfix">
              <div style="display: inline-block;line-height: 50px;cursor: pointer" @click="changeToDailTask('0')">
                <font style="font-size:large;color:#fff;padding-right: 5px">首拨数量: </font>
                <font style="font-size:large;color:rgb(255,255,0);">{{rowData.firstCallTotal}}</font>
              </div>
            </div>
            <div class="text item">
              <el-row>
                <el-col :span="8" >
                  <el-card shadow="hover" style="background-color:#f66">
                      <div class="circle" style="border:solid #f66 1px;background-color:#fff;">
                        <a @click="changeToDailTask('1')"><font class="line-center" style="color:#f66;">{{new_appoint_contact_task_count}}</font></a>
                      </div>
                    <div style="text-align: center">
                      <font class="text-align-center" style="font-size: small">预约名单</font>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card shadow="hover" style="background-color:#36a9ce">
                    <div class="circle" style="border:solid #36a9ce 1px;background-color:#fff;">
                      <a @click="changeToDailTask('2')"><font class="line-center" style="color:#36a9ce;">{{new_success_contact_task_count}}</font></a>
                    </div>
                    <div style="text-align: center">
                      <font class="text-align-center" style="font-size: small">今日成功量</font>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card shadow="hover" style="background-color:#eb7f36">
                    <div class="circle"  style="border:solid #eb7f36 1px;background-color:#fff;">
                      <a @click="changeToDailTask('3')"><font class="line-center" style="color:#eb7f36;">{{new_fail_contact_task_count}}</font></a>
                    </div>
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
              <div style="display: inline-block;line-height: 50px;cursor: pointer" @click="changeToOrderManagement('0')">
                <font style="font-size:large;color:#fff;padding-right: 5px">订单数量: </font>
                <font style="font-size:large;color:rgb(255,255,0);">{{count}}</font>
              </div>
            </div>
            <div class="text item">
              <el-row>
                <el-col :span="8" :offset="3">
                  <el-card shadow="hover" style="background-color:#36a9ce">
                    <div class="circle" style="border:solid #36a9ce 1px;background-color:#fff;">
                      <font class="line-center" style="color:#36a9ce;">{{total_amount}}</font>
                    </div>
                    <div style="text-align: center">
                      <font class="text-align-center" style="font-size: small">订单总金额</font>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8" :offset="3">
                  <el-card shadow="hover" style="background-color:#eb7f36">
                    <div class="circle"  style="border:solid #eb7f36 1px;background-color:#fff;">
                      <font class="line-center" style="color:#eb7f36;">{{avg_amount}}</font>
                    </div>
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
              <div style="display: inline-block;line-height: 50px;">
                <font style="font-size:medium;color:#fff;padding-right: 5px">通话时间: </font>
                <font style="font-size:medium;color:rgb(255,255,0);">{{call_time_duration}}</font>
              </div>
              <div style="float: right;line-height: 50px">
                <font style="font-size:medium;color:#fff;padding-right: 5px">通话次数: </font>
                <font style="font-size:medium;color:rgb(255,255,0);">{{calls_number}}</font>
              </div>
            </div>
            <div class="text item">
              <el-row>
                <el-col :span="8">
                  <el-card shadow="hover" style="background-color:#eb7f36">
                    <div class="circle"  style="border:solid #eb7f36 1px;background-color:#fff;">
                      <font class="line-center" style="color:#eb7f36;">{{online_time_duration}}</font>
                    </div>
                    <div style="text-align: center">
                      <font class="text-align-center" style="font-size: small">在线时长</font>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card shadow="hover" style="background-color:#36a9ce">
                    <div class="circle" style="border:solid #36a9ce 1px;background-color:#fff;">
                      <font class="line-center" style="color:#36a9ce;">{{free_time_duration}}</font>
                    </div>
                    <div style="text-align: center">
                      <font class="text-align-center" style="font-size: small">空闲时长</font>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card shadow="hover" style="background-color:#eb7f36">
                    <div class="circle"  style="border:solid #eb7f36 1px;background-color:#fff;">
                      <font class="line-center" style="color:#eb7f36;">{{busy_time_duration}}</font>
                    </div>
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



  </div>
</template>

<script>
import { Message, MessageBox } from 'element-ui'
import { formatDateTime, sec_to_time } from '@/utils/tools'
import { getDepartId, obreportAgent, orderreportAgent, reportAgent } from '@/api/ctiReport'
import { findContactHistory, findTotalContactByTime } from '@/api/ord_workingset'
import moment from 'moment'

export default {
  name: 'ord_workingset',
  data() {
    return {
      busy_time_duration: '',
      call_time_duration: '',
      calls_number: '',
      free_time_duration: '',
      online_time_duration: '',
      count: '',
      total_amount: '',
      avg_amount: '',
      new_appoint_contact_task_count: '',
      new_fail_contact_task_count: '',
      new_first_dial_task_count: '',
      new_success_contact_task_count: '',
      selectStatus: 'today',
      ischecked: true,
      rowData: {
        firstCallTotal: 0,
        appointCallTotal: 0,
        successCallTotal: 0,
        failedCallTotal: 0
      },
      rowInfo: {
        totalCallOut: 0,
        totalCallTime: '',
        answerTotal: 0,
        failedCallTotal: 0
      },
      departId: ''
    }
  },
  mounted() {
    getDepartId().then(res => {
      this.departId = res.data.departId
      obreportAgent({
        statistics_type: 'agent',
        depart_id: this.departId,
        time_dimension: 'day',
        agent_id: localStorage.getItem('agentId'),
        start_time: this.getStartTimestamp(Date.parse(new Date((new Date()).toLocaleDateString()))),
        end_time: this.getEndTimestamp(Date.parse(new Date((new Date()).toLocaleDateString())))
      }).then(response => {
        this.new_appoint_contact_task_count = response.data.result[0].new_appoint_contact_task_count
        this.new_fail_contact_task_count = response.data.result[0].new_fail_contact_task_count
        this.new_first_dial_task_count = response.data.result[0].new_first_dial_task_count
        this.new_success_contact_task_count = response.data.result[0].new_success_contact_task_count
      })
      orderreportAgent({
        statistics_type: 'agent',
        depart_id: this.departId,
        time_dimension: 'day',
        agent_id: localStorage.getItem('agentId'),
        start_time: this.getStartTimestamp(Date.parse(new Date((new Date()).toLocaleDateString()))),
        end_time: this.getEndTimestamp(Date.parse(new Date((new Date()).toLocaleDateString())))
      }).then(response => {
        this.avg_amount = response.data.result[0].avg_amount
        this.total_amount = response.data.result[0].total_amount
        this.count = response.data.result[0].count
      })
      reportAgent({
        statistics_type: 'agent',
        depart_id: this.departId,
        time_dimension: 'day',
        agent_id: localStorage.getItem('agentId'),
        start_time: this.getStartTimestamp(Date.parse(new Date((new Date()).toLocaleDateString()))),
        end_time: this.getEndTimestamp(Date.parse(new Date((new Date()).toLocaleDateString())))
      }).then(response => {
        this.busy_time_duration = sec_to_time(response.data.result[0].busy_time_duration)
        this.call_time_duration = sec_to_time(response.data.result[0].call_time_duration)
        this.calls_number = response.data.result[0].calls_number
        this.free_time_duration = sec_to_time(response.data.result[0].free_time_duration)
        this.online_time_duration = sec_to_time(response.data.result[0].online_time_duration)
      })
    })
    findContactHistory().then(res => {
      if (res.data.code === 0) {
        this.rowData.firstCallTotal = res.data.data.noContactCount
        this.rowData.appointCallTotal = res.data.data.appointCount
        this.rowData.successCallTotal = res.data.data.successCount
        this.rowData.failedCallTotal = res.data.data.failCount
      }
    })
    findTotalContactByTime('today').then(res => {
      if (res.data.code === 0) {
        this.rowInfo.totalCallOut = res.data.data.callTotalCount
        this.rowInfo.totalCallTime = res.data.data.callTotalTime
        this.rowInfo.failedCallTotal = res.data.data.callFailCount
        this.rowInfo.answerTotal = res.data.data.callSuccessCount
        this.selectStatus = 'today'
      }
    })
  },
  methods: {
    getStartTimestamp(timeStr) {
      return moment(timeStr, 'x').valueOf()
    },
    getEndTimestamp(timeStr) {
      return moment(timeStr, 'x').add(1, 'days').subtract(1, 'ms').valueOf()
    },
    findCallInfo(obj) {
      findTotalContactByTime(obj).then(res => {
        if (res.data.code === 0) {
          this.rowInfo.totalCallOut = res.data.data.callTotalCount
          this.rowInfo.totalCallTime = res.data.data.callTotalTime
          this.rowInfo.failedCallTotal = res.data.data.callFailCount
          this.rowInfo.answerTotal = res.data.data.callSuccessCount
          this.selectStatus = obj
        }
      })
    },
    changeToDailPage(status) {
      this.$router.push({
        name: 'dial_task.html',
        query: { 'dialstatus': status, 'isDialTask': false }
      })
      sessionStorage.removeItem('isDialTask')
    },
    changeToDailInfo(str) {
      const startTime = new Date(new Date().setHours(0, 0, 0, 0))
      const endTime = new Date(new Date().setHours(23, 59, 59, 0))
      let sTime = ''
      let eTime = ''
      let monthNum = 0
      let callStatu = 0 // 未接通状态
      switch (str) {
        case '0':
          callStatu = 0
          break
        case '1':
          callStatu = 1
          break
      }

      switch (this.selectStatus) {
        case 'yesterday':
          startTime.setDate(startTime.getDate() - 1)
          endTime.setDate(endTime.getDate() - 1)
          sTime = formatDateTime(startTime)
          eTime = formatDateTime(endTime)
          break
        case 'today':
          sTime = formatDateTime(startTime)
          eTime = formatDateTime(endTime)
          break
        case 'month':
          startTime.setDate(1)
          sTime = formatDateTime(startTime)
          monthNum = endTime.getMonth()
          eTime = formatDateTime(new Date(new Date(endTime.getFullYear(), ++monthNum, 1) - 1))
          break
      }
      this.$router.push({
        name: 'contact_record_dail.html',
        query: { 'sTime': sTime, 'eTime': eTime, 'callStatu': callStatu }
      })
    },
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
        query: { 'startTime': formatDateTime(this.getStartTimestamp(Date.parse(new Date((new Date()).toLocaleDateString())))),
          'endTime': formatDateTime(this.getEndTimestamp(Date.parse(new Date((new Date()).toLocaleDateString())))) }
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
  width:6em;
  height:40px;
  border-radius:40px;
  /*float:left;*/
  margin: 0 auto;
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
</style>
