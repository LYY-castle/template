<template>
  <div class="container" style="padding:0 20px;">
    <!-- <el-row>
      <h3>当前位置:客户管理</h3>
    </el-row>
    <el-row>
      <div style="font-size:16px;">查询条件</div>
      <div style="border-bottom:2px solid #439AE6;margin:10px 0;"></div>
    </el-row> -->
    <el-row margin-top:>
      <el-form :inline="true" size="small">
        <el-form-item>
          <el-input v-model="req.customerName" placeholder="客户姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="req.customerPhone" placeholder="客户电话"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="req.modifierName" placeholder="操作人员"></el-input>
        </el-form-item>
        <el-form-item label="操作时间：">
          <el-date-picker
              v-model="req.startModifierTime"
              type="datetime"
              placeholder="开始日期"
              value-format="yyyy-MM-dd hh:mm:ss"
              default-time="00:00:00">
          </el-date-picker>
          到
          <el-date-picker
              v-model="req.endModifierTime"
              type="datetime"
              placeholder="结束日期"
              value-format="yyyy-MM-dd hh:mm:ss"
              default-time="00:00:00">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchCustomer(req)" icon="el-icon-search">查询</el-button>
          <el-button type="danger" @click="clearForm(req)">重置</el-button>
        </el-form-item>
        <!-- <el-form-item>
      
      </el-form-item> -->
      </el-form>
    </el-row>
    <!-- <el-row>
      <div style="font-size:16px;">客户列表</div>
      <div style="border-bottom:2px solid #439AE6;margin:10px 0;"></div>
    </el-row> -->
    <el-row>
      <el-col>
        <el-table
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
            label="客户姓名">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="detailVisible=true;delReq.customerId=scope.row.customerId;searchByCustomerId(delReq);">{{scope.row.customerName}}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="性别">
            <template
              slot-scope="scope">
              <div>{{showSex(scope.row.sex)}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="客户电话">
            <template
              slot-scope="scope">
              <div>{{hideMobile(scope.row.mobile)}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="身份证">
            <template
              slot-scope="scope">
              <div>{{hideIdNumber(scope.row.idNumber)}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="modifierName"
            label="操作人">
          </el-table-column>
          <el-table-column
            align="center"
            prop="modifierTime"
            label="操作时间">
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="100">1
          <template slot-scope="scope">
            <el-button @click="editVisible=true;delReq.customerId=scope.row.customerId;searchByCustomerId(delReq);" type="text" size="small">修改</el-button>
            <el-button @click="delVisible=true;delReq.customerId=scope.row.customerId" type="text" size="small">删除</el-button>
          </template>
          </el-table-column>
        </el-table>
      </el-col> 
    </el-row>
    <el-row style="margin-top:5px;">
        <el-button type="success" size="small" @click="addVisible=true;clearForm(customerDetail,'customerDetail');">添加</el-button>
        <el-button type="danger" size="small" @click="batchDelVisible=true">批量删除</el-button>
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
    </el-row>
    <el-dialog
      align:left
      width="30%"
      title="客户信息修改"
      :visible.sync="editVisible"
      append-to-body>
      <el-form label-width="100px" :model="customerDetail" ref="editCustomer" :rules="rule">
        <el-form-item label="客户编号">
          <span>{{customerDetail.customerId}}</span>
        </el-form-item>
        <el-form-item label="客户姓名" prop="customerName">
          <el-input v-model="customerDetail.customerName" size="small"></el-input>
        </el-form-item>
        <el-form-item label="客户性别">
          <el-radio-group v-model="customerDetail.sex" size="small">
            <el-radio label='0' border>男</el-radio>
            <el-radio label='1' border>女</el-radio>
          </el-radio-group>
          <!-- <el-select v-model="customerDetail.sex">
            <el-option label="女" value=1></el-option>
            <el-option label="男" value=0></el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item label="客户电话" prop="mobile">
          <el-input v-model="customerDetail.mobile" size="small"></el-input>
        </el-form-item>
        <el-form-item label="身份证" prop="idNumber">
          <el-input v-model="customerDetail.idNumber" size="small"></el-input>
        </el-form-item>
        <el-form-item label="客户地址" prop="resideAddress">
          <el-input v-model="customerDetail.resideAddress" size="small"></el-input>
        </el-form-item>
        <el-form-item label="操作人员">
          <span>{{customerDetail.modifierName}}</span>
        </el-form-item>
        <el-form-item label="操作时间"> 
          <span>{{formatDateTime(customerDetail.modifierTime)}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: right;">
        <el-button type="danger" @click="searchByCustomerId(delReq)">重 置</el-button>
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('editCustomer');editCustomer(customerDetail)">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      align:left
      width="30%"
      title="客户信息详情"
      :visible.sync="detailVisible"
      append-to-body>
      <el-form label-width="100px">
        <el-form-item label="客户编号">
          <span>{{customerDetail.customerId}}</span>
        </el-form-item>
        <el-form-item label="客户姓名">
          <span>{{customerDetail.customerName}}</span>
        </el-form-item>
        <el-form-item label="客户姓名">
          <span>{{showSex(customerDetail.sex)}}</span>
        </el-form-item>
        <el-form-item label="客户电话">
          <span>{{hideMobile(customerDetail.mobile)}}</span>
        </el-form-item>
        <el-form-item label="身份证">
          <span>{{hideIdNumber(customerDetail.idNumber)}}</span>
        </el-form-item>
        <el-form-item label="客户地址">
          <span>{{showAddress(customerDetail.resideAddress)}}</span>
        </el-form-item>
        <el-form-item label="操作人员">
          <span>{{customerDetail.modifierName}}</span>
        </el-form-item>
        <el-form-item label="操作时间">
          <span>{{formatDateTime(customerDetail.modifierTime)}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: right;">
        <el-button @click="detailVisible = false">返 回</el-button>
      </div>
    </el-dialog>
    <el-dialog
      align:left
      width="30%"
      title="新增客户"
      :visible.sync="addVisible"
      append-to-body>
      <el-form :rules="rule" :model="customerDetail" ref="customerDetail" label-width="100px">
        <el-form-item label="客户姓名:" prop="customerName">
          <el-input v-model="customerDetail.customerName" size="small"></el-input>
        </el-form-item>
        <el-form-item label="客户性别:" prop="sex">
          <el-radio-group v-model="customerDetail.sex" size="small">
            <el-radio label='0' border>男</el-radio>
            <el-radio label='1' border>女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="客户电话:" prop="mobile">
          <el-input v-model="customerDetail.mobile" size="small"></el-input>
        </el-form-item>
        <el-form-item label="身份证:" prop="idNumber">
          <el-input v-model="customerDetail.idNumber" size="small"></el-input>
        </el-form-item>
        <el-form-item label="客户地址:" prop="resideAddress">
          <el-input v-model="customerDetail.resideAddress" size="small"></el-input>
        </el-form-item>
      </el-form>
        <div slot="footer" style="text-align: right;">
          <el-button type="danger" @click="resetForm('customerDetail')">重 置</el-button>
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('customerDetail');addCustomer(customerDetail);">确 定</el-button>
        </div>
      </el-dialog>
    <el-dialog
      width="30%"
      title="删除"
      :visible.sync="delVisible"
      append-to-body>
    <span style="font-size:20px;">确定删除此内容？</span>
    <div slot="footer" class="dialog-footer" style="text-align: right;">
      <el-button @click="delVisible = false">取 消</el-button>
      <el-button type="primary" @click="delVisible = false;delCustomer(delReq);">确 定</el-button>
    </div>
  </el-dialog>
  <el-dialog
    width="30%"
    title="批量删除"
    :visible.sync="batchDelVisible"
    append-to-body>
  <span style="font-size:20px;">确定删除选定内容？</span>
  <div slot="footer" class="dialog-footer" style="text-align: right;">
    <el-button @click="batchDelVisible = false">取 消</el-button>
    <el-button type="primary" @click="batchDelVisible = false;batchDelCustomer(batchDelReq);">确 定</el-button>
  </div>
  </el-dialog>
  </div>
</template>
<script>
// import { mapGetters } from 'vuex'
import { getMenu } from '@/api/dashboard'// 侧边栏菜单
import {
  queryByCustomer,
  delCustomer,
  queryByCustomerId,
  editCustomer,
  addCustomer,
  batchDelCustomer
} from '@/api/customerManagement'
import { rule } from '@/utils/validate'
import { formatDateTime } from '@/utils/tools'

export default {
  name: 'customerManagement',
  // computed: {
  //   ...mapGetters([
  //     'name',
  //     'roles'
  //   ])
  // },
  data() {
    return {
      detailVisible: false,
      delVisible: false, // 删除对话框显示隐藏
      editVisible: false, // 修改对话框显示隐藏
      addVisible: false, // 添加对话框显示隐藏
      batchDelVisible: false, // 批量删除对话框显示隐藏
      tableData: [], // 表格数据
      validate: true, // 验证不通过阻止发请求
      pageShow: true, // 分页显示隐藏
      rule: rule,
      delReq: {
        customerId: ''
      },
      batchDelReq: {
        customerIds: []
      },
      // 查询 发送请求参数
      req: {
        customerName: '',
        customerPhone: '',
        modifierName: '',
        startModifierTime: '',
        endModifierTime: '',
        pageNo: 1
      },
      customerDetail: {
        customerName: '',
        sex: '',
        mobile: '',
        idNumber: '',
        resideAddress: ''
      }, // 客户详情
      // 分页数据
      pageInfo: {}
    }
  },
  mounted() {
    this.searchCustomer(this.req)
  },
  beforeCreate() {
    getMenu()
      .then(response => {
        const data = response.data
        sessionStorage.setItem('getMenu', JSON.stringify(data))
      })
      .catch(error => {
        console.log(error)
      })
  },
  methods: {
    // show(a) {
    //   console.log(a)
    // },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.validate = true
        } else {
          this.$message.error('请检查是否填写正确')
          this.validate = false
        }
      })
    },
    // 清空重置
    clearForm(obj, formName) {
      for (const key in obj) {
        if (key !== 'pageNo') {
          obj[key] = ''
        }
      }
      if (formName) {
        this.$refs[formName].resetFields()
      }
    },
    // 时间戳转年月日时分秒
    formatDateTime: formatDateTime,
    // 手机号码加密
    hideMobile(mobileNo) {
      if (mobileNo) {
        return mobileNo.substring(0, 3) + '****' + mobileNo.substring(7, 11)
      }
    },
    // 身份证号码加密
    hideIdNumber(idNumber) {
      if (idNumber) {
        return idNumber.substring(0, 10) + '****' + idNumber.substring(14, 18)
      }
    },
    // 性别显示判断
    showSex(code) {
      return code === 1 ? '女' : '男'
    },
    // 地址补无
    showAddress(address) {
      if (address) {
        return address
      } else {
        return '无'
      }
    },
    // 查询客户信息
    searchCustomer(req) {
      queryByCustomer(req)
        .then(response => {
          if (response.data.code === 0) {
            if (response.data.data) {
              this.tableData = response.data.data
              this.pageInfo = response.data.pageInfo
              this.pageShow = true
            } else {
              this.$message('无查询结果，请核对查询条件')
              this.tableData = response.data.data
              this.pageShow = false
            }
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 删除客户信息
    delCustomer(customerId) {
      delCustomer(customerId)
        .then(response => {
          if (response.data.code === 0) {
            this.$message.success(response.data.message)
            this.searchCustomer(this.req)
          } else {
            this.$message('删除失败')
          }
        })
        .catch(error => {
          console.log(error)
          this.$message('删除失败')
        })
    },
    // 修改前查询客户详情
    searchByCustomerId(customerId) {
      queryByCustomerId(customerId)
        .then(response => {
          if (response.data.code === 0) {
            this.customerDetail = response.data.data
            this.$set(this.customerDetail, 'sex', response.data.data.sex.toString())
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 修改客户信息
    editCustomer(customerDetail) {
      if (!this.validate) {
        return false
      }
      this.editVisible = false
      parseInt(customerDetail.sex)
      editCustomer(customerDetail).then(response => {
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
          this.searchCustomer(this.req)
        } else {
          this.$message('修改失败')
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 添加客户
    addCustomer(customerDetail) {
      if (!this.validate) {
        return false
      }
      this.addVisible = false
      addCustomer(customerDetail).then(response => {
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
          this.searchCustomer(this.req)
        } else {
          this.$message('添加失败')
        }
      }).catch(error => {
        this.$message('添加失败')
        console.log(error)
      })
    },
    // 批量删除
    batchDelCustomer(batchDelReq) {
      console.log(batchDelReq.customerIds)
      if (batchDelReq.customerIds.length === 0) {
        this.$message.error('请选择需要删除的内容')
      } else {
        batchDelCustomer(batchDelReq.customerIds).then(response => {
          if (response.data.code === 0) {
            this.$message.success(response.data.message)
            this.searchCustomer(this.req)
          } else {
            this.$message('删除失败')
          }
        }).catch(error => {
          console.log(error)
          this.$message('删除失败')
        })
      }
    },
    // 表格多选框
    handleSelectionChange(val) {
      this.batchDelReq.customerIds.length = 0
      for (var i = 0; i < val.length; i++) {
        this.batchDelReq.customerIds.push(val[i].customerId)
      }
    },
    // 页面显示条数
    // handleSizeChange(val) {
    //   // console.log(`每页 ${val} 条`);
    //   this.searchReq.pageSize = val
    //   this.searchCustomer(this.req)
    // },
    // 分页翻页功能
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.req.pageNo = val
      this.searchCustomer(this.req)
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
// el-dialog .el-form-item{
//   margin-bottom:50px;
// }
</style>
