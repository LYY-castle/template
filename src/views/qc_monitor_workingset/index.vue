<template>
  <div class="app-container">
    <div>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-card shadow="hover" style="background-color:#339999;">
            <div slot="header" class="clearfix">
              <div style="display: inline-block;line-height: 50px;cursor: pointer" @click="">
                <font style="font-size:large;color:#fff;padding-right: 5px">质检任务情况 </font>
                <font style="font-size:large;color:rgb(255,255,0);"></font>
              </div>
              <div style="float: right;line-height: 50px;cursor: pointer" @click="checkNum('0')">
                <font style="font-size:medium;color:#fff;padding-right: 5px">未开始: </font>
                <font style="font-size:medium;color:rgb(255,255,0);">{{noCompleteNum}}</font>
              </div>
            </div>
            <div class="text item">
              <el-row>
                <el-col :span="8">
                  <el-card shadow="hover" style="background-color:#36a9ce">
                    <div class="circle" style="border:solid #36a9ce 1px;background-color:#fff;">
                      <a @click="checkNum('2')"><font class="line-center" style="color:#36a9ce;">{{temporaryNum}}</font></a>
                    </div>
                    <div style="text-align: center">
                      <font class="text-align-center" style="font-size: small">未完成</font>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card shadow="hover" style="background-color:#eb7f36">
                    <div class="circle"  style="border:solid #eb7f36 1px;background-color:#fff;">
                      <a @click="checkNum('1')"><font class="line-center" style="color:#eb7f36;">{{completeNum}}</font></a>
                    </div>
                    <div style="text-align: center">
                      <font class="text-align-center" style="font-size: small">已完成</font>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card shadow="hover" style="background-color:#36a9ce">
                    <div class="circle"  style="border:solid #36a9ce 1px;background-color:#fff;">
                      <a @click="checkNum('4')"><font class="line-center" style="color:#36a9ce;">{{todayCompleteNum}}</font></a>
                    </div>
                    <div style="text-align: center">
                      <font class="text-align-center" style="font-size: small">当日完成</font>
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
              <div style="display: inline-block;line-height: 50px;cursor: pointer">
                <font style="font-size:large;color:#fff;padding-right: 5px">质检任务数</font>
                <font style="font-size:large;color:rgb(255,255,0);"></font>
              </div>
            </div>
            <div class="text item">
                <el-row>
                  <el-col :span="10" :offset="3">
                    <el-card shadow="hover" style="background-color:#36a9ce">
                      <div class="circle" style="border:solid #36a9ce 1px;background-color:#fff;">
                        <a @click="checkNum('3')"><font class="line-center" style="color:#36a9ce;">{{totalNum}}</font></a>
                      </div>
                      <div style="text-align: center">
                        <font class="text-align-center" style="font-size: small">总任务</font>
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
import { findGradeByDepartIds, findQualityTaskByInfo, getStaffByDepartId } from '@/api/ord_qc_workingset'
import { formatDateTime } from '@/utils/tools'
export default {
  name: 'qc_monitior_workingset',
  data() {
    return {
      departId: '', // 部门id
      staffId: '', // 员工工号
      noCompleteNum: 0, // 未开始
      completeNum: 0, // 已完成
      temporaryNum: 0, // 未完成
      todayCompleteNum: 0, // 当日完成
      totalNum: 0// 总任务
    }
  },
  mounted() {
    this.departId = localStorage.getItem('departId')
    this.staffId = localStorage.getItem('agentId')
    if (this.departId) {
      findGradeByDepartIds({ 'departId': this.departId }).then(res => {
        if (res.data.code === 0) {
          this.noCompleteNum = res.data.data.noCompleteNum
          this.completeNum = res.data.data.completeNum
          this.temporaryNum = res.data.data.temporaryNum
          this.totalNum = parseInt(this.noCompleteNum) + parseInt(this.completeNum) + parseInt(this.temporaryNum)
        } else {
          this.$message('查询失败，请稍后重试！')
        }
      }).catch(error => {
        console.log(error, '无法连接到服务器')
      })
      getStaffByDepartId(this.departId).then(response => {
        const lists = response.data.dataAll
        const staffs = []
        lists.forEach(element => {
          staffs.push(element[1])
        })
        const obj = {}
        obj.status = '1'

        obj.staffId = staffs.join(',')
        obj.doneStart = formatDateTime(new Date().setHours(0, 0, 0, 0))
        obj.doneStop = formatDateTime(new Date().setHours(23, 59, 59, 0))
        // obj.pageSize = 1000
        findQualityTaskByInfo(obj).then(res => {
          if (res.data.code === 0) {
            this.todayCompleteNum = res.data.pageInfo.totalCount
          } else {
            this.$message('查询失败，请稍后重试！')
          }
        }).catch(error => {
          console.log(error, '无法连接服务器')
        })
      })
    }
  },
  methods: {
    checkNum(value) {
      this.$router.push({
        name: 'qm_quailitymark',
        query: { 'status': value }
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
