<template>
  <div class="container">
    <el-row margin-top:>
      <el-form :inline="true" size="small" :model="req" ref="searchForm">
        <el-form-item label="活动名称:">
          <el-select v-model="req.campaignId" :placeholder="campData.length==0?'无活动':'请选择活动'" @change="submitAssign.data = ''.split('');resetForm('assignForm');req.pageNo=1;queryMainQualityList(req);countTaskAssignInfo(req)">
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
              <div>{{scope.$index+(req.pageNo-1)*10+1}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="qualityId"
            label="质检任务编号">
          </el-table-column>
          <el-table-column
            align="center"
            prop="qualityName"
            label="质检任务名称">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="right">
                <p>{{ scope.row.qualityName }}</p>
                <div slot="reference">
                  {{ scope.row.qualityName }}
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="noAssignNum"
            label="未分配总数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="totalNum"
            label="质检总数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="modifierName"
            label="操作人">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="right">
                <p>{{ scope.row.modifierName }}</p>
                <div slot="reference">
                  {{ scope.row.modifierName }}
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="modifyTime"
            label="操作时间"
            width="155">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row style="margin-top:1%">
      <el-pagination
        v-if="pageShow"
        background
        @current-change="handleCurrentChange"
        :current-page=pageInfo.pageNo
        :page-sizes="[10, 20, 30, 50]"
        :page-size=pageInfo.pageSize
        layout="total, prev, pager, next, jumper"
        :total=pageInfo.totalCount style="text-align: right;float:right;">
      </el-pagination>
      <el-form :inline="true" :rules="rule" :model="submitAssign" ref="assignForm">
        <el-form-item label="分配数量" prop="assignNum">
          <el-input-number v-model="submitAssign.assignNum" size="small" placeholder="分配数量" style="width:50%"></el-input-number>
          <b>条</b>
        </el-form-item>
        <el-form-item label="未分配量" style="margin-left:-4.5%">
          <span>{{remainSum}}</span>
        </el-form-item>
        <el-form-item label="数量总计">
          <span>{{totalSum}}</span>
        </el-form-item>
        <el-form-item label="分配方式" style="margin-left:1%" prop="assignType">
          <el-radio-group v-model="submitAssign.assignType" size="small">
            <el-radio label='0'>顺序分配</el-radio>
            <el-radio label='1'>平均分配</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
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
            label="分配对象">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="right">
                <p>{{ scope.row.departName }}</p>
                <div slot="reference">
                  {{ scope.row.departName }}
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="noUseNum"
            label="未分配数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="useNum"
            label="已分配数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="totalNum"
            label="质检总数量">
          </el-table-column>
          <el-table-column
            align="center"
            label="本次分配数量">
            <template slot-scope="scope">
              <el-input-number v-model="disTable[scope.$index].assignNum" size="small" placeholder="分配数量" style="width:50%"></el-input-number>
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
            label="分配对象">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="right">
                <p>{{ scope.row.staffName }}</p>
                <div slot="reference">
                  {{ scope.row.staffName }}
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="noUseNum"
            label="未质检数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="temporaryNum"
            label="质检中数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="useNum"
            label="已质检数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="totalNum"
            label="质检总数量">
          </el-table-column>
          <el-table-column
            align="center"
            label="本次分配数量">
            <template slot-scope="scope">
              <el-input-number v-model="disTable[scope.$index].assignNum" size="small" placeholder="分配数量" style="width:50%"></el-input-number>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row>
      <el-button type="success" @click="submitForm('assignForm');">确 定</el-button>
    </el-row>
    <el-dialog
      width="30%"
      :visible.sync="submitVisible"
      append-to-body>
    <span style="font-size:20px;">确定分配吗？</span>
    <div slot="footer" class="dialog-footer" style="text-align: right;">
      <el-button @click="submitVisible = false">取 消</el-button>
      <el-button type="primary" @click="getAssignData();assignQualityTaskInfo(submitAssign);">确 定</el-button>
    </div>
  </el-dialog>
  </div>
</template>
<script>
import {
  // getDownInfoByCurrentUser,
  findQmCampaignByUser,
  queryMainQualityList,
  countTaskAssignInfo,
  assignQualityTaskInfo
} from '@/api/qm_charge_appointtask'
export default {
  name: 'qmChargeAppointtask',
  data() {
    const checkAssignSum = (eule, value, callback) => {
      value = Number(value)
      if (value > this.remainSum) {
        return callback(new Error('分配数量不能超过未分配数量'))
      }
      if (!/^\d+$/.test(value)) {
        return callback(new Error('分配数量不能小于0'))
      } else if (!(Number.isInteger(value))) {
        return callback(new Error('请输入整数'))
      } else if (value < 0) {
        return callback(new Error('请输入数字'))
      } else if (value === 0) {
        return callback(new Error('请输入分配数量'))
      } else {
        callback()
      }
    }
    return {
      rule: {
        assignNum: [
          { validator: checkAssignSum, trigger: 'change' }
        ],
        assignType: [
          { required: true, message: '请选择分配方式', trigger: 'blur' }
        ]
      },
      submitVisible: false,
      tableData: [], // 表格数据
      disTable: [], // 分配表
      disTableType: [], // 分配表
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
      submitAssign: {
        assignNum: '',
        assignType: '',
        qualityIds: [],
        campaignId: '',
        data: [],
        type: ''
      },
      campaignDetail: []
    }
  },
  mounted() {
    // this.getDownInfoByCurrentUser()
    this.findQmCampaignByUser()
  },
  methods: {
    // 重置表单
    resetForm(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
    },
    // 提交前验证
    submitForm(formName) {
      var sum = 0
      if (this.submitAssign.qualityIds.length === 0) {
        this.$message('请选择分配名单')
        return false
      }
      if (this.multipleSelection.length === 0) {
        this.$message('请选择分配对象')
        return false
      }
      for (var i = 0; i < this.multipleSelection.length; i++) {
        if (this.multipleSelection[i].assignNum) {
          sum = sum + this.multipleSelection[i].assignNum
        }
      }
      if (sum !== Number(this.submitAssign.assignNum)) {
        this.$message.error('本次分配数量总数与分配数量不一致')
        return false
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          for (var i = 0; i < this.multipleSelection.length; i++) {
            this.multipleSelection[i].assignNum = Number(this.multipleSelection[i].assignNum)
            if (!(Number.isInteger(this.multipleSelection[i].assignNum))) {
              this.$message.error('请输入整数')
              return false
            } else {
              this.validate = true
              this.submitVisible = true
            }
          }
        } else {
          this.$message.error('请检查是否填写正确')
          this.validate = false
          this.submitVisible = false
        }
      })
    },
    // 表格多选框
    handleSelectionChange(val) {
      this.remainSum = 0
      this.totalSum = 0
      this.submitAssign.qualityIds.length = 0
      for (var i = 0; i < val.length; i++) {
        this.remainSum += parseInt(val[i].noAssignNum)
        this.totalSum += parseInt(val[i].totalNum)
        this.submitAssign.qualityIds.push(val[i].qualityId)
      }
    },
    // 分配对象表格多选
    handleSelectionChange2(val) {
      this.multipleSelection = val
      this.submitAssign.data.length = 0
      this.assignNum()
    },
    // 将分配数量平均分配
    assignNum() {
      for (var i = 0; i <= this.disTable.length - 1; i++) {
        if (this.disTable[i].assignNum) {
          this.disTable[i].assignNum = 0
        }
      }
      if (this.multipleSelection.length !== 0) {
        for (var j = 0; j <= this.multipleSelection.length - 1; j++) {
          this.$set(this.multipleSelection[j], 'assignNum', parseInt(this.submitAssign.assignNum / this.multipleSelection.length))
        }
        for (var n = 0; n < parseInt(Number(this.submitAssign.assignNum) % this.multipleSelection.length); n++) {
          this.$set(this.multipleSelection[n], 'assignNum', this.multipleSelection[n].assignNum + 1)
        }
      }
    },
    // 转data数组为字符串
    getAssignData() {
      this.submitAssign.data = ''.split('')
      if (this.disTableType === '0') {
        for (var i = 0; i < this.disTable.length; i++) {
          var list = `{"${(this.disTable[i].departId).toString()}": ${this.disTable[i].assignNum}}`
          this.submitAssign.data.push(list)
        }
      } else if (this.disTableType === '1') {
        for (var j = 0; j < this.disTable.length; j++) {
          var list2 = `{"${(this.disTable[j].staffId).toString()}": ${this.disTable[j].assignNum}}`
          this.submitAssign.data.push(list2)
        }
      }
      this.submitAssign.data = ('[' + this.submitAssign.data + ']').toString()
    },
    // 初始化分配对象
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
    // 查询活动下名单的分配情况
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
    // 通过活动和部门查询改部门（下属人员或部门）名单分配情况
    countTaskAssignInfo(req) {
      countTaskAssignInfo(req).then(response => {
        if (parseInt(response.data.code) === 0) {
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
    // 确定分配名单
    assignQualityTaskInfo(submitAssign) {
      submitAssign.campaignId = this.req.campaignId
      submitAssign.type = sessionStorage.getItem('type')
      submitAssign.assignNum = submitAssign.assignNum.toString()
      assignQualityTaskInfo(submitAssign).then(response => {
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
          this.submitAssign.data = ''.split('')
          this.resetForm('assignForm')
          this.submitVisible = false
          this.queryMainQualityList(this.req)
          this.countTaskAssignInfo(this.req)
          // this.$refs.table1.clearSelection()
          // this.$refs.table2.clearSelection()
          // this.$refs.table3.clearSelection()
        } else {
          this.$message(response.data.message)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 分页翻页功能
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.req.pageNo = val
      this.queryMainQualityList(this.req)
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
