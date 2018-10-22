<template>
  <div class="app-container">
    <div >
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card shadow="hover" style="background-color:#339999;">
            <div class="circle" style="border:solid #339999 1px;background-color:#fff;">
              <a @click="changeToDailTask('0')"><font class="line-center" style="color:#339999;">{{rowData.firstCallTotal}}</font></a>
            </div>
            <div class="p-item">
              条
            </div>
            <div style="float:left;margin:auto 5%">
               <div><font style="font-size:large;color:#fff;margin-top:1%">总首拨名单</font></div>
               <div style="position:absolute;bottom:1%">
                 <a @click="changeToDailPage('0')">
                  <img src="../../../static/images/ord_workingset/tel.png" alt="拨打" style="width:20%;height:20%"></img>
                  <font style="font-size:small;color:#fff;">点击开始拨打</font>
                 </a>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6" >
          <el-card shadow="hover" style="background-color:#f66"> 
            <div class="circle" style="border:solid #f66 1px;background-color:#fff;">
              <a @click="changeToDailTask('1')"><font class="line-center" style="color:#f66;">{{rowData.appointCallTotal}}</font></a>
            </div>
            <div class="p-item">
              条
            </div>
            <div style="float:left;margin:auto 5%">
               <div><font style="font-size:large;color:#fff;margin-top:1%">总预约名单</font></div>
               <div style="position:absolute;bottom:1%">
                 <a @click="changeToDailPage('1')">
                  <img src="../../../static/images/ord_workingset/tel.png" alt="拨打" style="width:20%;height:20%"></img>
                  <font style="font-size:small;color:#fff;">点击开始拨打</font>
                 </a>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" style="background-color:#36a9ce">
            <div class="circle" style="border:solid #36a9ce 1px;background-color:#fff;">
              <a @click="changeToDailTask('2')"><font class="line-center" style="color:#36a9ce;">{{rowData.successCallTotal}}</font></a>
            </div>
            <div class="p-item">
              人次
            </div>
            <div style="float:left;margin:auto 5%">
               <font class="text-align-center">今日成功量</font>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" style="background-color:#eb7f36">
            <div class="circle"  style="border:solid #eb7f36 1px;background-color:#fff;">
              <a @click="changeToDailTask('3')"><font class="line-center" style="color:#eb7f36;">{{rowData.failedCallTotal}}</font></a>
            </div>
            <div class="p-item">
              人次
            </div>
            <div style="float:left;margin:auto 5%">
               <font class="text-align-center">今日失败量</font>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <br>
      <br>
      <br>
      <el-row>
        <div style="border:solid #36a9ce 1px;position:relative">
          <div style="position:absolute;top:10px;left:10px;" class="squash-item">
            话务总结
          </div>
          <div style="text-align:center">
            <el-button type="primary" plain @click="findCallInfo('yesterday')">昨天</el-button>
            <el-button type="primary" plain :autofocus="ischecked" @click="findCallInfo('today')">今天</el-button>
            <el-button type="primary" plain @click="findCallInfo('month')">整月</el-button>
          </div>
          <br>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-card shadow="hover" style="background-color:#339999;">
                <div class="circle" style="border:solid #339999 1px;background-color:#fff;">
                  <!-- <a @click="changeToDailInfo()"> -->
                    <font class="line-center" style="color:#339999;">{{rowInfo.totalCallOut}}</font>
                    <!-- </a> -->
                </div>
                <div class="p-item">
                  次
                </div>
                <div style="float:left;margin:auto 5%">
                  <div><font class="text-align-center">总拨打量</font></div>
                </div>
              </el-card>
            </el-col>

            <el-col :span="6">
              <el-card shadow="hover" style="background-color:#339999;">
                <div class="circle" style="border:solid #339999 1px;background-color:#fff;">
                  <!-- <a @click="changeToDailInfo()"> -->
                    <font class="line-center" style="font-size:16px;color:#339999;">{{rowInfo.totalCallTime}}</font>
                    <!-- </a> -->
                </div>
                <div class="p-item" style="visibility:hidden">
                  时长
                </div>
                <div style="float:left;margin:auto 5%">
                  <div><font class="text-align-center">通话时长</font></div>
                </div>
              </el-card>
            </el-col>

            <el-col :span="6">
              <el-card shadow="hover" style="background-color:#339999;">
                <div class="circle" style="border:solid #339999 1px;background-color:#fff;">
                  <a @click="changeToDailInfo('1')"><font class="line-center" style="color:#339999;">{{rowInfo.answerTotal}}</font></a>
                </div>
                <div class="p-item">
                  次
                </div>
                <div style="float:left;margin:auto 5%">
                  <div><font class="text-align-center">接通量</font></div>
                </div>
              </el-card>
            </el-col>

            <el-col :span="6">
              <el-card shadow="hover" style="background-color:#eb7f36">
                  <div class="circle"  style="border:solid #eb7f36 1px;background-color:#fff;">
                    <a @click="changeToDailInfo('0')"><font class="line-center" style="color:#eb7f36;">{{rowInfo.failedCallTotal}}</font></a>
                  </div>
                  <div class="p-item">
                    次
                  </div>
                  <div style="float:left;margin:auto 5%">
                    <font class="text-align-center">未接通量</font>
                  </div>
                </el-card>
            </el-col>
          </el-row>
        </div>
      </el-row>
      
    </div>



  </div>
</template>

<script>
// import { Message, MessageBox } from 'element-ui'
import { formatDateTime } from '@/utils/tools'
import { findContactHistory, findTotalContactByTime } from '@/api/ord_workingset'

export default {
  name: 'ord_workingset',
  data() {
    return {
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
      }
    }
  },
  mounted() {
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
    }
  }
}
</script>
<style>
.el-card__body{
  padding: 2%
}
.circle{
  width:80px;
  height:80px;
  border-radius:40px;
  float:left;
  text-align:center;
}
.line-center{
  line-height:80px;
  font-size:24px;
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
  line-height:80px;
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
