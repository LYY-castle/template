<template>
  <div class="container" style="padding:0 20px;">
    <el-row margin-top:>
      <el-form :inline="true" size="small">
        <el-form-item>
          <el-input v-model="req.customerName" placeholder="客户姓名（限长50字符）" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="req.customerPhone" placeholder="客户电话(限长50字符)" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="req.modifierName" placeholder="操作人员（限长50）字符" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="操作时间：">
          <el-date-picker
              v-model="timeValue"
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="req.pageNo=1;searchCustomer(req);req2=clone(req);" icon="el-icon-search">查询</el-button>
          <el-button type="danger" @click="reset();req2=clone(req)">重置</el-button>
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
      <el-form label-width="100px" :model="customerReverseDetail" ref="editCustomer" :rules="rule">
        <el-form-item label="客户编号">
          <span>{{customerReverseDetail.customerId}}</span>
        </el-form-item>
        <el-form-item label="客户姓名" prop="customerName">
          <el-input v-model="customerReverseDetail.customerName" size="small" placeholder="上限50字符" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="身份证" prop="idNumber">
          <el-input v-model="customerReverseDetail.idNumber" size="small" placeholder="上限50字符" maxlength="50" @change="autoFillReverse()"></el-input>
        </el-form-item>
        <el-form-item label="客户性别" prop="sex">
          <el-radio-group v-model="customerReverseDetail.sex" size="small">
            <el-radio-button label='0' border>男</el-radio-button>
            <el-radio-button label='1' border>女</el-radio-button>
          </el-radio-group>
          <!-- <el-select v-model="customerDetail.sex">
            <el-option label="女" value=1></el-option>
            <el-option label="男" value=0></el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item label="客户电话" prop="mobile">
          <el-input v-model="customerReverseDetail.mobile" size="small" placeholder="上限50字符" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="客户地址" prop="resideAddress">
          <el-input v-model="customerReverseDetail.resideAddress" size="small" placeholder="上限200字符" maxlength="200"></el-input>
        </el-form-item>
        <el-form-item label="操作人员">
          <span>{{customerReverseDetail.modifierName}}</span>
        </el-form-item>
        <el-form-item label="操作时间"> 
          <span>{{formatDateTime(customerReverseDetail.modifierTime)}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: right;">
        <el-button type="danger" @click="searchByCustomerId(delReq)">重 置</el-button>
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('editCustomer');editCustomer(customerReverseDetail)">确 定</el-button>
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
          <span>{{customerReverseDetail.customerId}}</span>
        </el-form-item>
        <el-form-item label="客户姓名">
          <span>{{customerReverseDetail.customerName}}</span>
        </el-form-item>
        <el-form-item label="客户性别">
          <span>{{showSex(customerReverseDetail.sex)}}</span>
        </el-form-item>
        <el-form-item label="客户电话">
          <span>{{hideMobile(customerReverseDetail.mobile)}}</span>
        </el-form-item>
        <el-form-item label="身份证">
          <span>{{hideIdNumber(customerReverseDetail.idNumber)}}</span>
        </el-form-item>
        <el-form-item label="客户地址">
          <span>{{showAddress(customerReverseDetail.resideAddress)}}</span>
        </el-form-item>
        <el-form-item label="操作人员">
          <span>{{customerReverseDetail.modifierName}}</span>
        </el-form-item>
        <el-form-item label="操作时间">
          <span>{{formatDateTime(customerReverseDetail.modifierTime)}}</span>
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
        <el-form-item label="客户姓名" prop="customerName">
          <el-input v-model="customerDetail.customerName" size="small" placeholder="上限50字符" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="身份证" prop="idNumber">
          <el-input v-model="customerDetail.idNumber" size="small" placeholder="上限50字符" maxlength="50" @change="autoFill()"></el-input>
        </el-form-item>
        <el-form-item label="客户性别" prop="sex">
          <el-radio-group v-model="customerDetail.sex" size="small">
            <el-radio-button label='0' border>男</el-radio-button>
            <el-radio-button label='1' border>女</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="客户电话" prop="mobile">
          <el-input v-model="customerDetail.mobile" size="small" placeholder="上限50字符" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="客户地址" prop="resideAddress">
          <el-input v-model="customerDetail.resideAddress" size="small" placeholder="上限200字符" maxlength="200"></el-input>
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
import { formatDateTime, clone } from '@/utils/tools'

export default {
  name: 'customerManagement',
  data() {
    var checkSex = (rule, value, callback) => {
      if (value) {
        var idNo1 = this.customerDetail.idNumber
        var idNo2 = this.customerReverseDetail.idNumber
        var reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
        var sexStr = '1'
        if (reg.test(idNo1)) {
          sexStr = Number(idNo1.substring(idNo1.length - 2, idNo1.length - 1)) % 2 === 1 ? '0' : '1'
          if (sexStr !== value) {
            callback(new Error('所选性别和身份证信息不匹配'))
          } else {
            callback()
          }
        } else if (reg.test(idNo2)) {
          sexStr = Number(idNo2.substring(idNo2.length - 2, idNo2.length - 1)) % 2 === 1 ? '0' : '1'
          if (sexStr !== value) {
            callback(new Error('所选性别和身份证信息不匹配'))
          } else {
            callback()
          }
        } else {
          callback(new Error('身份证号不符合规则'))
        }
      } else {
        callback(new Error('性别不能为空'))
      }
    }
    return {
      detailVisible: false,
      delVisible: false, // 删除对话框显示隐藏
      editVisible: false, // 修改对话框显示隐藏
      addVisible: false, // 添加对话框显示隐藏
      batchDelVisible: false, // 批量删除对话框显示隐藏
      tableData: [], // 表格数据
      validate: true, // 验证不通过阻止发请求
      pageShow: false, // 分页显示隐藏
      timeValue: '',
      rule: {
        customerName: [
          { required: true, message: '请输入客户名称', trigger: 'blur' }
        ],
        idNumber: [
          { required: true, message: '请输入身份证号码', trigger: 'blur' },
          { pattern: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/, message: '请输入正确的身份证号码' }
        ],
        sex: [
          { required: true, message: '请选择客户性别', trigger: 'blur' },
          { validator: checkSex, trigger: 'change' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^([1][3,4,5,7,8][0-9]{9}|0\d{2,3}-\d{7,8}|\d{1,20})$/, message: '请输入正确的电话号码' }
        ]
      },
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
      req2: {
        customerName: '',
        customerPhone: '',
        modifierName: '',
        startModifierTime: '',
        endModifierTime: '',
        pageNo: 1
      },
      customerDetail: {
        customerName: '',
        sex: '1',
        mobile: '',
        idNumber: '',
        resideAddress: ''
      }, // 客户详情
      customerReverseDetail: {
        customerId: '',
        customerName: '',
        sex: '1',
        mobile: '',
        idNumber: '',
        resideAddress: '',
        modifierName: '',
        modifierTime: ''
      },
      // 分页数据
      pageInfo: {}
    }
  },
  mounted() {
    this.searchCustomer(this.req)
  },
  methods: {
    // 深度克隆
    clone: clone,
    // 重置查询框内容
    reset() {
      this.timeValue = ''
      this.req = {
        customerName: '',
        customerPhone: '',
        modifierName: '',
        startModifierTime: '',
        endModifierTime: '',
        pageNo: 1
      }
    },
    autoFill() {
      var reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
      const idNo = this.customerDetail.idNumber
      if (reg.test(idNo)) {
        this.customerDetail.sex = ''
        this.customerDetail.sex = Number(idNo.substring(idNo.length - 2, idNo.length - 1)) % 2 === 1 ? '0' : '1'
      }
    },
    autoFillReverse() {
      var reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
      const idNo = this.customerReverseDetail.idNumber
      if (reg.test(idNo)) {
        this.customerReverseDetail.sex = ''
        this.customerReverseDetail.sex = Number(idNo.substring(idNo.length - 2, idNo.length - 1)) % 2 === 1 ? '0' : '1'
      }
    },
    resetForm(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
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
      if (this.$refs[formName] !== undefined) {
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
      req.startModifierTime = this.timeValue[0]
      req.endModifierTime = this.timeValue[1]
      queryByCustomer(req)
        .then(response => {
          if (response.data.code === 0) {
            this.tableData = response.data.data
            if (response.data.pageInfo) {
              this.pageInfo = response.data.pageInfo
              this.pageShow = true
            } else {
              this.pageShow = false
            }
          } else {
            this.$message(response.data.messages)
            this.tableData = response.data.data
            this.pageShow = false
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
            this.searchCustomer(this.req2)
          } else {
            this.$message(response.data.messages)
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
            var data = response.data.data
            this.customerReverseDetail = {
              customerName: data.customerName,
              mobile: data.mobile,
              idNumber: data.idNumber,
              resideAddress: data.resideAddress,
              sex: data.sex.toString(),
              customerId: data.customerId,
              modifierName: data.modifierName,
              modifierTime: data.modifierTime
            }
          } else {
            console.log(response.data.message)
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 修改客户信息
    editCustomer(customerReverseDetail) {
      if (!this.validate) {
        return false
      }
      this.editVisible = false
      parseInt(customerReverseDetail.sex)
      for (const i in customerReverseDetail) {
        if (i === 'modifierName') {
          customerReverseDetail[i] = ''
        } else if (i === 'modifierTime') {
          customerReverseDetail[i] = ''
        } else {
          continue
        }
      }
      editCustomer(customerReverseDetail).then(response => {
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
          this.searchCustomer(this.req2)
        } else {
          this.$message(response.data.messages)
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
          this.searchCustomer(this.req2)
        } else {
          this.$message(response.data.message)
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
            this.searchCustomer(this.req2)
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
    //   this.searchCustomer(this.req2)
    // },
    // 分页翻页功能
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.req2.pageNo = val
      this.searchCustomer(this.req2)
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
