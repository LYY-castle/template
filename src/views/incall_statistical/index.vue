<template>
  <div class="app-container work-bench" style="padding-bottom:0;">
    <div>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-card shadow="never" class="card-container" style="margin-bottom:20px;">
            <div slot="header" class="clearfix">
              <div style="margin-bottom:50px;">
                <b>呼入统计</b>
              </div>
            </div>
            <div class="text item">
              <el-row>
                <el-col :span="8">
                  <el-card shadow="never" class="no-border">
                    <div class="item-content" style="cursor:point;">
                      <span class="line-center font30" @click="changeToDialTaskList('-1')" >{{incallStatistical.ringCount?incallStatistical.ringCount:0}}</span>
                    </div>
                    <div style="text-align: center;">
                      <span class="font12" style="height:40px;" >振铃次数</span>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card shadow="never" class="no-border">
                    <div class="item-content" style="cursor:point;">
                      <span class="line-center font30" @click="changeToDialTaskList('1')">{{incallStatistical.answerCount?incallStatistical.answerCount:0}}</span>
                    </div>
                    <div style="text-align: center">
                      <span class="font12" style="height:40px;" >接听次数</span>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="never" class="card-container">
            <div slot="header" class="clearfix">
              <div style="margin-bottom:50px;">
                <b>呼入话务量统计</b>
              </div>
            </div>
            <div class="text item">
              <el-row>
                <el-col :span="8">
                  <el-card shadow="never" class="no-border">
                    <div style="height: 65px;line-height: 65px;text-align: center;">
                      <font class="line-center font30">{{sec_to_time(incallStatistical.talkingTime)}}</font>
                    </div>
                    <div style="text-align: center">
                      <font class="font12" style="height:40px;">总通话时长</font>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card shadow="never" class="no-border">
                    <div style="height: 65px;line-height: 65px;text-align: center;">
                      <font class="line-center font30">{{sec_to_time(incallStatistical.avarageTalkingTime)}}</font>
                    </div>
                    <div style="text-align: center">
                      <font class="font12" style="height:40px">平均通话时长</font>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card shadow="never" class="no-border">
                    <div style="height: 65px;line-height: 65px;text-align: center;">
                      <font class="line-center font30">{{sec_to_time(incallStatistical.ringDuration)}}</font>
                    </div>
                    <div style="text-align: center">
                      <font class="font12" style="height:40px;">响铃时长</font>
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
import { getSubordinate, getIncallStatistical } from '@/api/dashboard'
import { sec_to_time, formatDateTime } from '@/utils/tools'
export default {
  name: 'incall_statistical',
  props: ['role'],
  data() {
    return {
      agentId: localStorage.getItem('agentId'),
      agentIds: [],
      departId: localStorage.getItem('departId'),
      accountNo: localStorage.getItem('accountNo'),
      incallStatistical: {}
    }
  },
  beforeDestroy() {

  },
  destroyed() {

  },
  created() {

  },
  mounted() {
    if (this.role === 'depart') {
      getSubordinate(this.departId).then(response => {
        if (response.data.code === 1) {
          this.agentIds = []
          response.data.data.forEach(item => {
            this.agentIds.push(item.accountNo)
          })
          getIncallStatistical(this.agentIds.join(',')).then(response => {
            if (response.data.result) {
              this.incallStatistical = response.data.result
            } else {
              throw new Error('查询呼入统计失败')
            }
          }).catch(error => {
            throw error
          })
        }
      }).catch(error => {
        throw error
      })
    } else {
      getIncallStatistical(this.agentId).then(response => {
        if (response.data.result) {
          this.incallStatistical = response.data.result
        } else {
          throw new Error('查询呼入统计失败')
        }
      }).catch(error => {
        throw error
      })
    }
  },
  methods: {
    sec_to_time(second = 0) {
      return sec_to_time(second)
    },
    changeToDialTaskList(status) {
      this.$router.push({
        path: process.env.BUILT_IN_ROUTERS.contactRecordQuery,
        query: { 'callStatu': status, 'sTime': formatDateTime(new Date().setHours(0, 0, 0, 0)), 'eTime': formatDateTime(new Date().setHours(23, 59, 59, 0)), 'agentid': '', 'contactType': '1', 'callDirection': '1' }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
@media screen and (min-width: 1281px) and (max-width:1367px){
  .work-bench .font30 {
    font-size: 27px !important;
  }
}
@media all and (min-width:1024px) and (max-width:1280px)  {
  .work-bench .font30 {
    font-size: 25px !important;
  }
}
</style>
