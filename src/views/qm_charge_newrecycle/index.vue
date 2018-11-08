<template>
  <div class="container">
    <el-row margin-top:>
      <el-form :inline="true" size="small" :model="req" ref="searchForm">
        <el-form-item label="活动名称:">
          <el-select v-model="req.campaignId" :placeholder="campData.length==0?'无活动':'请选择活动'" @change="req.pageNo=1;req.pageSize=10;req2=clone(req);resetForm('assignForm');queryMainQualityList(req)">
            <el-option
                v-for="item in campData"
                :key="item.activityId"
                :label="item.activityName"
                :value="item.activityId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-col>
        <el-table
          ref="table1"
          :data="tableData"
          border
          @selection-change="handleSelectionChange">
          <el-table-column
            align="center"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            align="center"
            label="序号"
            width="55">
            <template
              slot-scope="scope">
              <div>{{scope.$index+(req2.pageNo-1)*req2.pageSize+1}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="qualityId"
            :show-overflow-tooltip="true"
            label="质检任务编号">
          </el-table-column>
          <el-table-column
            align="center"
            prop="qualityName"
            :show-overflow-tooltip="true"
            label="质检任务名称">
            <template slot-scope="scope">
              {{ scope.row.qualityName }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="noAssignNum"
            :show-overflow-tooltip="true"
            label="未分配总数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="totalNum"
            :show-overflow-tooltip="true"
            label="质检总数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="modifierName"
            :show-overflow-tooltip="true"
            label="操作人">
            <template slot-scope="scope">
              {{ scope.row.modifierName }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="modifyTime"
            label="操作时间"
            width="155"
            :show-overflow-tooltip="true">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row style="margin-top:1%">
      <el-pagination
        v-if="pageShow"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page='pageInfo.pageNo'
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size='pageInfo.pageSize'
        layout="total, sizes, prev, pager, next, jumper "
        :total='pageInfo.totalCount' style="text-align: right;float:right;">
      </el-pagination>
    </el-row>
    <el-row>
      <el-col>
        <el-table
          ref="table2"
          v-if="disTableType==='0'"
          :data="disTable"
          border
          @selection-change="handleSelectionChange2">
          <el-table-column
            align="center"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            align="center"
            prop="departName"
            :show-overflow-tooltip="true"
            label="回收对象">
            <template slot-scope="scope">
              {{ scope.row.departName }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="noUseNum"
            :show-overflow-tooltip="true"
            label="可回收数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="useNum"
            :show-overflow-tooltip="true"
            label="已使用数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="totalNum"
            :show-overflow-tooltip="true"
            label="总数量">
          </el-table-column>
          <el-table-column
            align="center"
            :show-overflow-tooltip="true"
            label="回收数量">
            <template slot-scope="scope">
              <el-input-number v-model="disTable[scope.$index].assignNum" size="small" placeholder="回收数量" style="width:130px;"></el-input-number>
            </template>
          </el-table-column>
        </el-table>
        <el-table
          ref="table3"
          v-if="disTableType==='1'"
          :data="disTable"
          border
          @selection-change="handleSelectionChange2">
          <el-table-column
            align="center"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            align="center"
            prop="staffName"
            :show-overflow-tooltip="true"
            label="回收对象">
            <template slot-scope="scope">
              {{ scope.row.staffName }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="noCompleteNum"
            :show-overflow-tooltip="true"
            label="可回收数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="temporaryNum"
            :show-overflow-tooltip="true"
            label="暂存数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="completeNum"
            :show-overflow-tooltip="true"
            label="已使用数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="totalNum"
            :show-overflow-tooltip="true"
            label="总数量">
          </el-table-column>
          <el-table-column
            align="center"
            label="回收数量">
            <template slot-scope="scope">
              <el-input-number v-model="disTable[scope.$index].assignNum" size="small" placeholder="回收数量" style="width:130px;"></el-input-number>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row>
      <el-button type="success" @click="submitForm('assignForm');">确认回收</el-button>
    </el-row>
    <el-dialog
      width="30%"
      :visible.sync="submitVisible"
      append-to-body>
    <span style="font-size:20px;">确定回收吗？</span>
    <div slot="footer" class="dialog-footer" style="text-align: right;">
      <el-button @click="submitVisible = false">取 消</el-button>
      <el-button type="primary" @click="getAssignData();recycleQualityTaskInfo(submitAssign);">确 定</el-button>
    </div>
  </el-dialog>
  </div>
</template>
<script>
import {
  // getDownInfoByCurrentUser,
  showTaskAssignInfo,
  findQmCampaignByUser,
  queryMainQualityList,
  recycleQualityTaskInfo
} from '@/api/qm_charge_newrecycle'
import { clone } from '@/utils/tools'
export default {
  name: 'qm_charge_newrecycle',
  data() {
    return {
      submitVisible: false,
      tableData: [], // 表格数据
      disTable: [], // 回收表
      disTableType: '0', // 回收表
      campData: [], // 所有活动
      campMsg: '', // 活动下拉框placeholder
      multipleSelection: [],
      remainSum: 0,
      totalSum: 0,
      key: '',
      value: '',
      pageInfo: {},
      pageShow: false,
      req: {
        campaignId: '',
        pageSize: 10,
        pageNo: 1
      },
      req2: {
        campaignId: '',
        pageSize: 10,
        pageNo: 1
      },
      submitAssign: {
        qualityIds: [],
        campaignId: '',
        data: []
      },
      campaignDetail: []
    }
  },
  mounted() {
    // this.getDownInfoByCurrentUser()
    this.findQmCampaignByUser()
  },
  methods: {
    // 深度克隆
    clone: clone,
    // 重置表单
    resetForm(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
    },
    // 提交前验证
    submitForm(formName) {
      if (this.submitAssign.qualityIds.length === 0) {
        this.$message.error('请选择回收名单')
        return false
      }
      if (this.multipleSelection.length === 0) {
        this.$message.error('请选择回收对象')
        return false
      } else {
        for (var i = 0; i < this.multipleSelection.length; i++) {
          this.multipleSelection[i].assignNum = Number(this.multipleSelection[i].assignNum)
          if (!(Number.isInteger(this.multipleSelection[i].assignNum))) {
            if (!(this.multipleSelection[i].assignNum)) {
              this.$message.error('请输入回收数量')
              return false
            } else {
              this.$message.error('请输入整数')
              return false
            }
          }
          if (!(this.multipleSelection[i].assignNum)) {
            this.$message.error('请填写回收数量')
            return false
          }
          if (this.multipleSelection[i].assignNum < 0) {
            this.$message.error('回收数量必须大于0')
            return false
          }
          if (this.disTableType === '0' && this.multipleSelection[i].noUseNum < this.multipleSelection[i].assignNum) {
            this.$message.error('回收数量不能超过可回收数量')
            return false
          }
          if (this.disTableType === '1' && this.multipleSelection[i].noCompleteNum < this.multipleSelection[i].assignNum) {
            this.$message.error('回收数量不能超过可回收数量')
            return false
          } else {
            this.submitVisible = true
          }
        }
      }
    },
    // 表格多选框
    handleSelectionChange(val) {
      this.submitAssign.campaignId = this.req.campaignId
      this.submitAssign.qualityIds.length = 0
      for (var i = 0; i < val.length; i++) {
        this.submitAssign.qualityIds.push(val[i].qualityId)
      }
      if (this.submitAssign.qualityIds.length !== 0) {
        this.showTaskAssignInfo(this.submitAssign)
      } else {
        this.disTable = []
        return false
      }
    },
    // 回收对象表格多选
    handleSelectionChange2(val) {
      // console.log(val)
      this.multipleSelection = val
      // this.submitAssign.data.length = 0
      // this.assignNum()
    },
    getAssignData() {
      this.submitAssign.data = ''.split('')
      if (this.disTableType === '0') {
        for (var i = 0; i < this.multipleSelection.length; i++) {
          console.log(this.multipleSelection[i])
          var list = `{"${(this.multipleSelection[i].departId).toString()}": ${this.multipleSelection[i].assignNum}}`
          this.submitAssign.data.push(list)
          console.log(this.submitAssign.data)
        }
      } else if (this.disTableType === '1') {
        for (var j = 0; j < this.multipleSelection.length; j++) {
          var list2 = `{"${(this.multipleSelection[j].staffId).toString()}": ${this.multipleSelection[j].assignNum}}`
          this.submitAssign.data.push(list2)
        }
      }
      this.submitAssign.data = ('[' + this.submitAssign.data + ']').toString()
    },
    // 初始化回收对象
    // getDownInfoByCurrentUser() {
    //   getDownInfoByCurrentUser().then(response => {
    //   })
    // },
    // 查询所有的活动
    findQmCampaignByUser() {
      findQmCampaignByUser().then(response => {
        if (response.data.code === 0) {
          this.campData = response.data.data
        } else {
          this.$message(response.data.messages)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 查询活动下名单的回收情况
    queryMainQualityList(req) {
      queryMainQualityList(req).then(response => {
        if (response.data.code === 0) {
          this.tableData = response.data.data
          this.pageShow = true
          if (response.data.pageInfo) {
            this.pageInfo = response.data.pageInfo
          }
        } else {
          this.pageShow = false
        }
      })
    },
    //  查询所选名单的回收情况
    showTaskAssignInfo(req) {
      showTaskAssignInfo(req).then(response => {
        if (response.data.code === 0) {
          this.disTable = response.data.data
          this.disTableType = response.data.type
          sessionStorage.setItem('type', response.data.type)
        } else {
          this.$message(response.data.message)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 确定回收名单
    recycleQualityTaskInfo(submitAssign) {
      submitAssign.campaignId = this.req.campaignId
      submitAssign.type = sessionStorage.getItem('type')
      // console.log(submitAssign)
      recycleQualityTaskInfo(submitAssign).then(response => {
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
          this.submitAssign.data = ''.split('')
          this.resetForm('assignForm')
          this.submitVisible = false
          this.queryMainQualityList(this.req2)
        } else {
          this.$message(response.data.message)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    handleSizeChange(val) {
      this.req2.pageSize = val
      this.queryMainQualityList(this.req2)
    },
    // 分页翻页功能
    handleCurrentChange(val) {
      this.req2.pageNo = val
      this.queryMainQualityList(this.req2)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
  .el-table thead {
    color: #000 !important;
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  .el-table {
    border: 1px solid #ecebe9;
    thead th .cell {
      color: #000;
    }
  }
  .el-form-item {
    margin-bottom: 20px;
  }
</style>
