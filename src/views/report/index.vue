<template>
  <!-- 现场主管 -->
  <div class="app-container reports">
    <div v-if="buttonVisible">
      <div class="table-container" style="margin-top:0;" v-if="manager||depart||staff">
        <el-row style="margin-bottom:10px;">
          <div class="font14 bold">业务绩效</div>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="4" style="text-align:center;" v-if="manager||depart||staff">
            <el-card>
              <div class="card-content" @click="orderReport=true;buttonVisible=false;reportTitle='业绩报表'">
                <div class="img-container">
                  我是图
                </div>
                <span class="font14">业绩报表</span>
              </div>
            </el-card>
          </el-col>

          <el-col :span="4" style="text-align:center;" v-if="manager||depart||staff">
            <el-card>
              <div class="card-content" @click="OB=true;buttonVisible=false;reportTitle='外呼任务报表'">
                <div class="img-container">
                  我是图
                </div>
                <span class="font14">外呼任务报表</span>
              </div>
            </el-card>
          </el-col>

          <el-col :span="4" style="text-align:center;" v-if="manager||depart">
            <el-card>
              <div class="card-content" @click="listReport=true;buttonVisible=false;reportTitle='名单报表'">
                <div class="img-container">
                  我是图
                </div>
                <span class="font14">名单报表</span>
              </div>
            </el-card>
          </el-col>

        </el-row>
      </div>

      <div class="table-container" v-if="manager||depart||staff">
        <el-row style="margin-bottom:10px;">
          <div class="font14 bold">员工绩效</div>
        </el-row>
        <el-row :gutter="10">
          <el-col style="text-align:center;" :span="4" v-if="manager||depart||staff">
            <el-card>
              <div class="card-content" @click="cti=true;buttonVisible=false;reportTitle='通时报表'">
                <div class="img-container">
                  我是图
                </div>
                <span class="font14">通时报表</span>
              </div>
            </el-card>
          </el-col>
          
        </el-row>
      </div>

      <div class="table-container" v-if="manager||depart||staff||qcdepart||qcstaff">
        <el-row style="margin-bottom:10px;">
          <div class="font14 bold">质检</div>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="4" style="text-align:center;" v-if="qcdepart||qcstaff">
            <el-card>
              <div class="card-content" @click="qualityTaskReport=true;buttonVisible=false;reportTitle='质检任务报表'">
                <div class="img-container">
                  我是图
                </div>
                <span class="font14">质检任务报表</span>
              </div>
            </el-card>
          </el-col>

          <el-col :span="4" style="text-align:center;" v-if="manager||depart||staff">
            <el-card>
              <div class="card-content" @click="qualityMarkReport=true;buttonVisible=false;reportTitle='质检计分报表'">
                <div class="img-container">
                  我是图
                </div>
                <span class="font14">质检计分报表</span>
              </div>
            </el-card>
          </el-col>

          <el-col :span="4" style="text-align:center;" v-if="manager||depart||staff">
            <el-card>
              <div class="card-content" @click="qcResultReport=true;buttonVisible=false;reportTitle='质检结果报表'">
                <div class="img-container">
                  我是图
                </div>
                <span class="font14">质检结果报表</span>
              </div>
            </el-card>
          </el-col>
          
        </el-row>
      </div>
      <div class="table-container" v-if="personnel">
        <el-row style="margin-bottom:10px;">
          <div class="font14 bold">人事</div>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="4" style="text-align:center;">
            <el-card>
              <div class="card-content" @click="staffStructure=true;buttonVisible=false;reportTitle='人员结构报表'">
                <div class="img-container">
                  我是图
                </div>
                <span class="font14">人员结构报表</span>
              </div>
            </el-card>
          </el-col>
          
        </el-row>
      </div>
    </div>
    <div v-if="!buttonVisible">
      <div class="table-container margin-bottom-15" style="margin-top:0;padding:10px;text-align:center;position:relative;">
        <el-button title="返回" style="width:auto;position:absolute;left:6px;top:6px;padding:1px 9px;" type="primary" size="small" @click="handleBack()"><i class="el-icon-back" style="font-size:20px;font-weight:bold;"></i></el-button>
        <h3 class="font14">{{reportTitle}}</h3>
      </div>
      <order-report v-if="orderReport"></order-report>
      <OB v-if="OB"></OB>
      <cti v-if="cti"></cti>
      <quality-task-report v-if="qualityTaskReport"></quality-task-report>
      <quality-mark-report v-if="qualityMarkReport"></quality-mark-report>
      <qc-result-report v-if="qcResultReport"></qc-result-report>
      <staff-structure v-if="staffStructure"></staff-structure>
      <list-report v-if="listReport"></list-report>
    </div>
  </div>
</template>

<script>
import orderReport from './order_report/index'
import OB from './OB/index'
import cti from './cti/index'
import qualityTaskReport from './quality_task_report/index'
import qualityMarkReport from './quality_mark_report/index'
import qcResultReport from './qc_result_report/index'
import staffStructure from './staff_structure/index'
import listReport from './list_report/index'
import axios from 'axios'
import {
  permsManager, // 现场主管
  permsDepart, // 班组长
  permsStaff, // 坐席
  permsQCDepart, // 质检主管
  permsQCStaff, // 质检员
  permsPersonnel // 人事
} from '@/api/permission'

export default {
  name: 'report',
  data() {
    return {
      show_wechat: `${process.env.SHOW_WECHAT}`,
      agentId: localStorage.getItem('agentId'),
      depart: false, // 班组长
      staff: false, // 坐席
      qcdepart: false, // 质检主管
      qcstaff: false, // 质检
      manager: false, // 现场主管
      personnel: false, // 人事
      adm: false, // 管理员
      path: '',
      role: null,
      // 报表
      orderReport: false,
      OB: false,
      cti: false,
      qualityTaskReport: false,
      qualityMarkReport: false,
      qcResultReport: false,
      staffStructure: false,
      listReport: false,
      buttonVisible: true,
      reportTitle: ''
    }
  },
  components: {
    orderReport,
    OB,
    cti,
    qualityTaskReport,
    qualityMarkReport,
    qcResultReport,
    staffStructure,
    listReport
  },
  methods: {
    handleBack() {
      this.orderReport = false
      this.OB = false
      this.cti = false
      this.qualityTaskReport = false
      this.qualityMarkReport = false
      this.qcResultReport = false
      this.staffStructure = false
      this.listReport = false
      this.buttonVisible = true
    }
  },
  mounted() {
    const vm = this
    axios.all([ // 现场主管 0 班组长 1 坐席 2 质检主管 3 质检 4 人事 5
      permsManager(this.agentId).then(response => {
        const code = parseInt(response.data.code)
        if (code === 200) vm.manager = true
        else if (code === 403) vm.manager = false
      }),
      permsDepart(this.agentId).then(response => {
        const code = parseInt(response.data.code)
        if (code === 200) vm.depart = true
        else if (code === 403) vm.depart = false
      }),
      permsStaff(this.agentId).then(response => {
        const code = parseInt(response.data.code)
        if (code === 200) vm.staff = true
        else if (code === 403) vm.staff = false
      }),
      permsQCDepart(this.agentId).then(response => {
        const code = parseInt(response.data.code)
        if (code === 200) vm.qcdepart = true
        else if (code === 403) vm.qcdepart = false
      }),
      permsQCStaff(this.agentId).then(response => {
        const code = parseInt(response.data.code)
        if (code === 200) vm.qcstaff = true
        else if (code === 403) vm.qcstaff = false
      }),
      permsPersonnel(this.agentId).then(response => {
        const code = parseInt(response.data.code)
        if (code === 200) vm.personnel = true
        else if (code === 403) vm.personnel = false
      })
    ]).then(axios.spread(function(acct, perms) {
      if (vm.manager && vm.depart && vm.staff && vm.qcdepart && vm.qcstaff && vm.personnel) {
        vm.adm = true
      } else {
        vm.adm = false
      }
    }))
    // 判断现场主管权限
  //   permsManager().then(() => {
  //     this.manager = true
  //   }).catch(error => {
  //     if (error.response.status === 403) {
  //       this.manager = true

  //       // 判断班组长权限
  //       permsDepart(this.agentId).then(() => {
  //         this.depart = true
  //       }).catch(error => {
  //         if (error.response.status === 403) {
  //           this.depart = false
  //           // 判断坐席权限
  //           permsStaff(this.agentId).then(() => {
  //             this.staff = true
  //           }).catch(error => {
  //             if (error.response.status === 403) {
  //               this.staff = false
  //               // this.$message.error('您无权访问此页面')
  //             } else {
  //               throw new Error(error)
  //             }
  //           })
  //         } else {
  //           throw new Error(error)
  //         }
  //       })

  //       // 判断质检主管权限
  //       permsqualityMonitorWorkingSet(this.agentId).then(() => {
  //         this.qcdepart = true
  //       }).catch(error => {
  //         if (error.response.status === 403) {
  //           this.qcdepart = false
  //           // 判断质检员权限
  //           permsqualityOrdWorkingSet(this.agentId).then(() => {
  //             this.qcstaff = true
  //           }).catch(error => {
  //             if (error.response.status === 403) {
  //               this.qcstaff = false
  //               // this.$message.error('您无权访问此页面')
  //             } else {
  //               throw new Error(error)
  //             }
  //           })
  //         } else {
  //           throw new Error(error)
  //         }
  //       })
  //     } else {
  //       throw new Error(error)
  //     }
  //   })
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.reports{
  .card-content{
    text-align:center;
    padding:10px 0;
    display:inline-block;
    cursor: pointer;
    .img-container{
      background:rgb(85, 87, 85);
      height:100px;
      width:100px;
      margin:0 auto;
      margin-bottom:10px;
    }
  }
}
</style>
