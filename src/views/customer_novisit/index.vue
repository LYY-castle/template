<template>
  <div class="container">
      <el-row margin-top:>
      <el-form :inline="true" size="small" :model="req" ref="searchForm">
        <el-form-item prop="customerPhone">
          <el-input v-model="req.customerPhone" placeholder="客户电话"></el-input>
        </el-form-item>
        <el-form-item  prop="modifierName">
          <el-input v-model="req.modifierName" placeholder="操作人员"></el-input>
        </el-form-item>
        <el-form-item label="操作时间：">
            <el-date-picker
                v-model="req.modifyTimeStart"
                type="datetime"
                placeholder="开始日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                default-time="00:00:00">
            </el-date-picker>
            到
            <el-date-picker
                v-model="req.modifyTimeEnd"
                type="datetime"
                placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                default-time="00:00:00">
            </el-date-picker>
          </el-form-item>
            <el-form-item>
            <el-select v-model="req.campaignId" placeholder="选择活动">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="item in campaignOptions" :key="item.campaignId" :label="item.campaignName" :value="item.campaignId"></el-option>
            </el-select>
          </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="req.pageNo=1;paginationReq=cloneData(req);findNoVisitCustomers(req);" icon="el-icon-search">查询</el-button>
          <el-button type="danger" @click="resetReq();">重置</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <!-- 表格 -->
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
              <div>{{scope.$index+(paginationReq.pageNo-1)*paginationReq.pageSize+1}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="客户电话">
             <template slot-scope="scope">
              <el-button type="text" size="small" @click="detailVisible=true;delReq.id=scope.row.id;getBlackListInfoById(scope.row.id);">{{hideMobile(scope.row.customerPhone)}}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="effectiveDate"
            label="生效时间">
          </el-table-column>
          <el-table-column
            align="center"
            prop="expiryDate"
            label="失效时间">
          </el-table-column>
          <el-table-column
            align="center"
            label="操作人">
             <template slot-scope="scope">
              <div>{{(scope.row.modifierName == 0) ? '无':scope.row.modifierName}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="modifyTime"
            label="操作时间">
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="200">
          <template slot-scope="scope">
            <el-button @click="editVisible=true;delReq.id=scope.row.id;getBlackListInfoById(scope.row.id);" type="text" size="small">修改</el-button>
            <el-button @click="delVisible=true;delReq.id=scope.row.id" type="text" size="small">删除</el-button>
          </template>
          </el-table-column>
        </el-table>
      </el-col> 
    </el-row>
    <el-row style="margin-top:5px;">
        <el-button type="success" size="small" @click="addVisible=true;clearForm(noVisitCustomerDetail,'addCustomerForm');">创建免访客户</el-button>
        <el-button type="danger" size="small" @click="batchDelVisible=true">批量删除</el-button>
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
    <!-- 新增免访客户 -->
     <el-dialog
      align:left
      width="30%"
      title="新增免访客户"
      :visible.sync="addVisible"
      append-to-body>
      <el-form :rules="rule" :model="noVisitCustomerDetail" ref="addCustomerForm" label-width="100px">
        <el-form-item label="选择活动" prop="campaignIds">
          <el-select v-model="noVisitCustomerDetail.campaignIds" multiple placeholder="选择活动" style="width: 100%;">
            <el-option v-for="item in campaignOptions" :key="item.campaignId" :label="item.campaignName" :value="item.campaignId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户电话:" prop="customerPhone">
             <el-input v-model="noVisitCustomerDetail.customerPhone" size="small"></el-input>
        </el-form-item>
        <el-form-item label="生效时间:" prop="effectiveDate">
         <el-date-picker
                v-model="noVisitCustomerDetail.effectiveDate"
                type="date"
                placeholder="生效时间"
                value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="失效时间:" prop="expiryDate">
          <el-date-picker
                v-model="noVisitCustomerDetail.expiryDate"
                type="date"
                placeholder="失效时间"
                value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
      </el-form>
        <div slot="footer" style="text-align: right;">
          <el-button type="danger" @click="resetForm('addCustomerForm')">重 置</el-button>
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('addCustomerForm',noVisitCustomerDetail);addNoVisitCustomers(noVisitCustomerDetail);">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 批量删除 -->
      <el-dialog
        width="30%"
        title="批量删除"
        :visible.sync="batchDelVisible"
        append-to-body>
        <span style="font-size:20px;">确定删除选定内容？</span>
        <div slot="footer" class="dialog-footer" style="text-align: right;">
          <el-button @click="batchDelVisible = false">取 消</el-button>
          <el-button type="primary" @click="batchDelVisible = false;batchDelete(batchDelReq);">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 删除 -->
      <el-dialog
      width="30%"
      title="删除"
      :visible.sync="delVisible"
      append-to-body>
      <span style="font-size:20px;">确定删除此内容？</span>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="delVisible = false;delBlackListInfo(delReq.id);">确 定</el-button>
      </div>
    </el-dialog>
      <!-- 修改免访客户 -->
      <el-dialog
      align:left
      width="30%"
      title="修改免访客户"
      :visible.sync="editVisible"
      append-to-body>
      <el-form :rules="rule" :model="editNoVisitCustomerDetail" ref="editCustomerForm" label-width="100px">
        <el-form-item label="选择活动" prop="campaignIds">
          <el-select v-model="editNoVisitCustomerDetail.campaignIds" multiple placeholder="选择活动" style="width: 100%;">
            <el-option v-for="item in campaignOptions" :key="item.campaignId" :label="item.campaignName" :value="item.campaignId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户电话:" prop="customerPhone">
             <el-input v-model="editNoVisitCustomerDetail.customerPhone" size="small"></el-input>
        </el-form-item>
        <el-form-item label="生效时间:" prop="effectiveDate">
         <el-date-picker
                v-model="editNoVisitCustomerDetail.effectiveDate"
                type="date"
                placeholder="生效时间"
                value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="失效时间:" prop="expiryDate">
          <el-date-picker
                v-model="editNoVisitCustomerDetail.expiryDate"
                type="date"
                placeholder="失效时间"
                value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
         <el-form-item label="操作人员:" prop="modifierName">
          <span>{{editNoVisitCustomerDetail.modifierName}}</span>
        </el-form-item>
        </el-form-item>
         <el-form-item label="操作时间:" prop="modifyTime">
          <span>{{editNoVisitCustomerDetail.modifyTime}}</span>
        </el-form-item>
      </el-form>
        <div slot="footer" style="text-align: right;">
          <el-button type="danger" @click="getBlackListInfoById(delReq.id)">重 置</el-button>
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('editCustomerForm',editNoVisitCustomerDetail);editBlackListInfo(editNoVisitCustomerDetail);">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 免访客户详情 -->
      <el-dialog
      align:left
      width="30%"
      title="免访客户详情"
      :visible.sync="detailVisible"
      append-to-body>
      <el-form  :model="editNoVisitCustomerDetail" ref="noVisitCustomerDetailForm" label-width="100px">
        <el-form-item label="活动编号" prop="campaignIds">
          <div style="with:95%;overflow:auto;">{{formateData(editNoVisitCustomerDetail.campaignIds)}}</div>
        </el-form-item>
        <el-form-item label="客户电话:" prop="customerPhone">
          <span>{{hideMobile(editNoVisitCustomerDetail.customerPhone)}}</span>
        </el-form-item>
        <el-form-item label="生效时间:" prop="effectiveDate">
          <span>{{editNoVisitCustomerDetail.effectiveDate}}</span>
        </el-form-item>
        <el-form-item label="失效时间:" prop="expiryDate">
          <span>{{editNoVisitCustomerDetail.expiryDate}}</span>
        </el-form-item>
         <el-form-item label="操作人员:" prop="modifierName">
          <span>{{editNoVisitCustomerDetail.modifierName}}</span>
        </el-form-item>
        </el-form-item>
         <el-form-item label="操作时间:" prop="modifyTime">
          <span>{{editNoVisitCustomerDetail.modifyTime}}</span>
        </el-form-item>
      </el-form>
        <div slot="footer" style="text-align: right;">
          <el-button @click="detailVisible = false">返回</el-button>
        </div>
      </el-dialog>
  </div>
</template>
<script>
import { findAllCampaigns, queryNoVisitCustomers, addNoVisitCustomers, batchDelete, getBlackListInfoById, editBlackListInfo, delBlackListInfo } from '@/api/customer_novisit'
import { hideMobile } from '@/utils/tools'
export default {
  name: 'customerNoVisit',
  data() {
    return {
      detailVisible: false, // 免访客户详情
      delVisible: false, // 删除对话框显示隐藏
      editVisible: false, // 修改对话框显示隐藏
      batchDelVisible: false, // 批量删除对话框显示隐藏
      validate: true, // 验证不通过阻止发请求
      addVisible: false, // 添加对话框显示隐藏
      pageShow: false, // 分页显示隐藏
      rule: {
        campaignIds: [{ required: true, message: '请选择活动', trigger: 'blur' }],
        customerPhone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^\d{0,20}$/, message: '请输入正确的电话号码' }
        ],
        effectiveDate: [{ required: true, message: '请选择生效时间', trigger: 'blur' }],
        expiryDate: [{ required: true, message: '请选择生效时间', trigger: 'blur' }]
      },
      // 查询 发送请求参数
      req: {
        customerPhone: '',
        modifierName: '',
        modifyTimeStart: '',
        modifyTimeEnd: '',
        campaignId: '',
        pageNo: 1,
        pageSize: 10
      },
      paginationReq: {
        customerPhone: '',
        modifierName: '',
        modifyTimeStart: '',
        modifyTimeEnd: '',
        campaignId: '',
        pageNo: 1,
        pageSize: 10
      },
      delReq: {
        id: ''
      },
      // 删除ids
      batchDelReq: {
        ids: []
      },
      pageInfo: {}, // 分页数据
      campaignOptions: [], // 选择活动数据
      tableData: [], // 表格数据
      editNoVisitCustomerDetail: {}, // 修改免访客户
      noVisitCustomerDetail: {
        campaignIds: [],
        customerPhone: '',
        effectiveDate: '',
        expiryDate: ''

      }
    }
  },
  mounted() {
    this.findCampaigns()
    this.findNoVisitCustomers(this.req)
  },
  methods: {
    resetReq() {
      this.req = {
        customerPhone: '',
        modifierName: '',
        modifyTimeStart: '',
        modifyTimeEnd: '',
        campaignId: '',
        pageNo: this.pageInfo.pageNo,
        pageSize: this.pageInfo.pageSize
      }
    },
    findCampaigns() {
      findAllCampaigns().then(response => {
        this.campaignOptions = response.data.data
      })
    },
    findNoVisitCustomers(req) {
      queryNoVisitCustomers(req).then(response => {
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
      }).catch(error => {
        console.log(error)
      })
    },
    hideMobile: hideMobile,
    // 表格多选框
    handleSelectionChange(val) {
      this.batchDelReq.ids.length = 0
      for (var i = 0; i < val.length; i++) {
        this.batchDelReq.ids.push(val[i].id)
      }
    },
    // 页面显示条数
    handleSizeChange(val) {
      this.req.pageSize = val
      this.req.pageNo = 1
      this.paginationReq.pageSize = val
      this.paginationReq.pageNo = 1
      this.pageInfo.pageNo = 1
      this.findNoVisitCustomers(this.paginationReq)
    },
    // 分页翻页功能
    handleCurrentChange(val) {
      this.req.pageNo = val
      this.paginationReq.pageNo = val
      this.findNoVisitCustomers(this.paginationReq)
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
    resetForm(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
    },
    // 校验检测
    submitForm(formName, value) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.validate = true
        } else {
          this.$message.error('请检查是否填写正确')
          this.validate = false
        }
        if (this.validate) {
          if (new Date(value.effectiveDate) > new Date(value.expiryDate)) {
            this.$message.error('失效时间不能早于生效时间')
            this.validate = false
          }
        }
      })
    },
    // 增加免费客户
    addNoVisitCustomers(noVisitCustomerDetail) {
      if (!this.validate) {
        return false
      }
      addNoVisitCustomers(noVisitCustomerDetail).then(response => {
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
          this.findNoVisitCustomers(this.paginationReq)
          this.addVisible = false
        } else {
          this.$message('添加失败')
        }
      }).catch(error => {
        this.$message('添加失败')
        console.log(error)
      })
    },
    // 批量删除
    batchDelete(batchDelReq) {
      if (batchDelReq.ids.length === 0) {
        this.$message.error('请选择需要删除的内容')
      } else {
        batchDelete(batchDelReq.ids).then(response => {
          if (response.data.code === 0) {
            this.$message.success(response.data.message)
            this.paginationReq.pageNo = 1
            this.req.pageNo = 1
            this.findNoVisitCustomers(this.paginationReq)
          } else {
            this.$message('删除失败')
          }
        }).catch(error => {
          console.log(error)
          this.$message('删除失败')
        })
      }
    },
    getBlackListInfoById(id) {
      getBlackListInfoById(id).then(response => {
        if (response.data.code === 0) {
          this.editNoVisitCustomerDetail = response.data.data
        }
      })
    },
    editBlackListInfo(editNoVisitCustomerDetail) {
      if (!this.validate) {
        return false
      }
      editBlackListInfo(editNoVisitCustomerDetail).then(response => {
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
          this.findNoVisitCustomers(this.paginationReq)
          this.editVisible = false
        } else {
          this.$message('修改失败')
        }
      }).catch(error => {
        console.log(error)
        this.$message('修改失败')
      })
    },
    delBlackListInfo(id) {
      delBlackListInfo(id).then(response => {
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
          this.paginationReq.pageNo = 1
          this.req.pageNo = 1
          this.findNoVisitCustomers(this.paginationReq)
          this.delVisible = false
        } else {
          this.$message('删除失败')
        }
      }).catch(error => {
        console.log(error)
        this.$message('删除失败')
      })
    },
    // 克隆数据
    cloneData(obj) {
      var data = {}
      data = JSON.parse(JSON.stringify(obj))
      return data
    },
    formateData(arry) {
      var str = ''
      if (arry instanceof Array) {
        str = arry.join(',')
      }
      return str
    }

  }
}
</script>

