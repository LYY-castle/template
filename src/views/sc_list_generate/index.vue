<template>
  <div class="container">
    <el-collapse v-model="formContainerOpen" class="form-container" @change="handleChangeAcitve">
      <el-collapse-item title="筛选条件" name="1">
        <el-form :inline="true" size="small" >
          <el-form-item label="名单编号:">
            <el-input v-model="req.listId" placeholder="名单编号（限长20字符）" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="名单名称:">
            <el-input v-model="req.listName" placeholder="名单名称（限长50字符）" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="操作人:">
            <el-input v-model="req.modifierName" placeholder="操作人（限长50字符）" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="操作时间:">
            <el-date-picker
                v-model="req.startCreateTime"
                type="datetime"
                placeholder="开始时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                default-time="00:00:00">
            </el-date-picker>
            到
            <el-date-picker
                v-model="req.endCreateTime"
                type="datetime"
                placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                default-time="00:00:00">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="req2=clone(req);req.pageNo=1;searchNamelist(req)">查询</el-button>
            <el-button size="small" @click="clearForm(req);req2=clone(req);">重置</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <el-row class="table-container">
      <el-row class="margin-bottom-20">
        <div class="font14 bold">名单管理表</div>
      </el-row>
      <el-row class="margin-bottom-20">
        <!-- <el-button type="success" size="small" @click="addVisible=true;addNameList.listName='';namelistPageInfo.pageSize=10;searchCustomer.pageSize=10;searchCustomer.pageNo=1;getCustomers(searchCustomer);clearForm(searchCustomer);">新建</el-button> -->
        <el-button type="danger" size="small" @click="batchDelVisible=true">批量删除</el-button>
      </el-row>
      <el-row>
        <el-table
          :data="tableData"
          @selection-change="handleSelectionChange">
          <el-table-column
            align="center"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            align="center"
            prop="listId"
            label="名单编号"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.listId }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="listName"
            label="名单名称"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
                  {{ scope.row.listName }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="listnameNumber"
            :show-overflow-tooltip="true"
            label="名单数量">
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
            prop="modifierTime"
            label="操作时间"
            width="155">
          </el-table-column>
          <el-table-column
            align="center"
            label="当前状态"
            width="155">
            <template slot-scope="scope">
              <div :class="scope.row.validityStatus===0?'visible':'invisible'">
                <span>{{scope.row.validityStatus===0?'可见':'可见'}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="100">
          <template slot-scope="scope">
            <el-button @click="editVisible=true;delReq.listId=scope.row.listId;searchByListId(delReq);" type="text" size="small">修改</el-button>
            <el-button @click="delVisible=true;delReq.listId=scope.row.listId" type="text" size="small">删除</el-button>
          </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row style="margin-top:20px;">
        <el-pagination
          v-if="pageShow"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page='pageInfo.pageNo'
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size='pageInfo.pageSize'
          layout="total, sizes, prev, pager, next, jumper "
          :total='pageInfo.totalCount' style="text-align: right;float:right;">
        </el-pagination>
      </el-row>
    </el-row>
    <el-dialog
      align:left
      width="30%"
      title="修改名单"
      :visible.sync="editVisible"
      append-to-body>
      <el-form label-width="100px" :model="namelistDetail" ref="editNamelist">
        <el-form-item label="名单编号">
          <span>{{namelistDetail.listId}}</span>
        </el-form-item>
        <el-form-item label="名单名称" prop="listName">
          <el-input v-model="namelistDetail.listName" size="small" placeholder="名单名称（限长50字符）" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="当前状态" prop="visible">
          <el-switch
          v-model="namelistDetail.validityStatus"
          active-text="可见"
          inactive-text="不可见"
          :active-value=0
          :inactive-value=1
          active-color="#67C23A"
          ></el-switch>
        </el-form-item>
        <el-form-item label="名单数量" prop="listnameNumber">
          <span>{{namelistDetail.listnameNumber}}</span>
        </el-form-item>
        <el-form-item label="操作人" prop="modifierName">
          <span>{{namelistDetail.modifierName}}</span>
        </el-form-item>
        <el-form-item label="操作时间" prop="modifierTime">
          <span>{{formatDateTime(namelistDetail.modifierTime)}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: right;">
        <el-button size="small" @click="searchByListId(delReq);">重置</el-button>
        <el-button size="small" type="primary" plain @click="editVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="editNamelist()">确定</el-button>
      </div>
    </el-dialog>
    <!-- <el-dialog
      top="5vh"
      width="90%"
      :visible.sync="addVisible"
      append-to-body>
      <div slot="title" style="text-align: center;">
        <el-button size="small" @click="addVisible = false;" style="float:left;" icon="el-icon-arrow-left">返 回</el-button>
        <h3 style="display:inline;text-align:center;">新建名单</h3>
      </div>
      <el-row>
        <el-form :inline="true" size="small">
          <el-form-item>
            <el-input v-model="searchCustomer.customerId" placeholder="客户编号（限长20字符）" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="searchCustomer.customerName" placeholder="客户姓名（限长50字符）" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="searchCustomer.mobile" placeholder="客户电话（限长50字符）" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="操作时间：">
          <el-date-picker
              v-model="timeValue"
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" @click="searchCustomer.pageNo=1;getCustomers(searchCustomer)">查询</el-button>
            <el-button size="small" type="danger" @click="clearForm3()">重置</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <el-table
          :data="customerTableData"
          border
          @selection-change="namelistSelectionChange">
          <el-table-column
            align="center"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            align="center"
            prop="customerId"
            label="客户编号"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            align="center"
            prop="customerName"
            label="客户姓名"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            align="center"
            label="性别"
            width="55">
            <template
              slot-scope="scope">
              <div>{{showSex(scope.row.sex)}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="客户电话"
            :show-overflow-tooltip="true">
            <template
              slot-scope="scope">
              {{hideMobile(scope.row.mobile)}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="身份证"
            :show-overflow-tooltip="true">
            <template
              slot-scope="scope">
              {{hideIdNumber(scope.row.idNumber)}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="source"
            label="客户来源">
          </el-table-column>
          <el-table-column
            align="center"
            prop="modifierName"
            label="操作人"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.modifierName }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="modifierTime"
            width="155"
            label="操作时间">
          </el-table-column>
        </el-table>
      </el-row>
      <div slot="footer" style="text-align: right;">
        <el-pagination
          v-if="pageShow2"
          background
          @size-change="namelistSizeChange"
          @current-change="namelistPageChange"
          :current-page='namelistPageInfo.pageNo'
          :page-sizes="[10, 50, 100, 200, 500]"
          :page-size='namelistPageInfo.pageSize'
          layout="total, sizes, prev, pager, next, jumper "
          :total='namelistPageInfo.totalCount' style="text-align:right;float:left;">
        </el-pagination>
        <el-form :inline="true" size="small" :model="addNameList" ref="addNameList" :rules="rule">
          <el-form-item prop="listName" label="名单名称：">
            <el-input v-model="addNameList.listName" placeholder="名单名称（限长50字符）" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item prop="visible" label="名单状态：">
            <el-switch
            v-model="addNameList.visible"
            active-text="可见"
            inactive-text="不可见"
            :active-value=1
            :inactive-value=0
            active-color="#67C23A"
            ></el-switch>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="success" @click="submitForm('addNameList');newNameList(addNameList)">确 定</el-button>
            <el-button size="small" @click="addVisible = false;">取 消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog> -->
    <el-dialog
      width="30%"
      title="批量删除"
      :visible.sync="batchDelVisible"
      append-to-body>
    <span style="font-size:20px;">确定删除选定内容？</span>
    <div slot="footer" class="dialog-footer" style="text-align: right;">
      <el-button type="primary" plain size="small" @click="batchDelVisible = false">取消</el-button>
      <el-button size="small" type="primary" @click="batchDelVisible = false;batchDelNamelist(batchDelReq);">确定</el-button>
    </div>
    </el-dialog>
    <el-dialog
      width="30%"
      title="删除"
      :visible.sync="delVisible"
      append-to-body>
    <span style="font-size:20px;">确定删除此内容？</span>
    <div slot="footer" class="dialog-footer" style="text-align: right;">
      <el-button type="primary" plain size="small" @click="delVisible = false">取消</el-button>
      <el-button size="small" type="primary" @click="delVisible = false;delNamelist(delReq);">确定</el-button>
    </div>
    </el-dialog>
    <el-dialog
      width="30%"
      title="操作提示"
      :visible.sync="visibleCheck"
      append-to-body>
    <span style="font-size:20px;">即将设置名单为不可见状态，确认？</span>
    <div slot="footer" class="dialog-footer" style="text-align: right;">
      <el-button type="primary" plain size="small" @click="visibleCheck = false;namelistDetail.visible=1">取消</el-button>
      <el-button size="small" type="primary" @click="visibleCheck = false;checkEditNamelist(editReq)">确定</el-button>
    </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  queryNamelist,
  addNamelist,
  addNameList,
  queryByListId,
  editNamelist,
  delList,
  batchDelList
} from '@/api/sc_list_generate'
import { queryBatch } from '@/api/batch_management'
import { queryByCustomer } from '@/api/customerManagement'
import { rule } from '@/utils/validate'
import { clone, formatDateTime } from '@/utils/tools'

export default {
  name: 'sc_list_generate',
  data() {
    return {
      formContainerOpen: '1',
      formContainer: this.$store.state.app.formContainer,
      timeValue: '',
      rule: rule,
      detailVisible: false,
      delVisible: false, // 删除对话框显示隐藏
      editVisible: false, // 修改对话框显示隐藏
      visibleCheck: false, // 设置为不可见提示
      addVisible: false, // 新建对话框显示隐藏
      batchDelVisible: false, // 批量删除对话框显示隐藏
      tableData: [], // 表格数据
      batchTableData: [], // 批次表格
      customerTableData: [], // 客户信息表格
      validate: true, // 验证不通过阻止发请求
      pageShow: false, // 分页显示隐藏
      pageShow2: false, // 分页显示隐藏
      namelistDetail: {},
      delReq: {
        listId: ''
      },
      batchDelReq: {
        idlist: []
      },
      // 查询 发送请求参数
      req: {
        listId: '',
        listName: '',
        modifierName: '',
        startCreateTime: '',
        endCreateTime: '',
        pageNo: 1,
        pageSize: 10
      },
      req2: {
        listId: '',
        listName: '',
        modifierName: '',
        startCreateTime: '',
        endCreateTime: '',
        pageNo: 1,
        pageSize: 10
      },
      searchCustomer: {
        isInternalAdmin: parseInt(localStorage.getItem('is_internal_admin')),
        customerId: '',
        customerName: '',
        mobile: '',
        modifierName: '',
        startModifierTime: '',
        endModifierTime: '',
        pageNo: 1,
        pageSize: 10
      },
      searchBatch: {
        batchId: '',
        batchName: '',
        validityStatus: 0,
        createAuthor: '',
        startCreateTime: '',
        endCreateTime: '',
        pageSize: 10,
        pageNo: 1
      },
      searchBatch2: {
        batchId: '',
        batchName: '',
        validityStatus: 0,
        createAuthor: '',
        startCreateTime: '',
        endCreateTime: '',
        pageSize: 10,
        pageNo: 1
      },
      addNamelist: {
        listName: '',
        batchIds: [],
        assignStatus: 1,
        visible: 1
      },
      addNameList: {
        listName: '',
        customerIds: [],
        assignStatus: 1,
        visible: 1
      },
      editReq: {
        listId: '',
        listName: '',
        modifierName: '',
        modifierTime: '',
        visible: null
      },
      editCheck: false,
      // editNamelist: {},
      // 分页数据
      pageInfo: {},
      // 新建名单分页
      namelistPageInfo: {}
    }
  },
  mounted() {
    this.formContainer()
    this.handleChangeAcitve()
    this.searchNamelist(this.req)
  },
  methods: {
    handleChangeAcitve(active = ['1']) {
      if (active.length) {
        $('.form-more').text('收起')
      } else {
        $('.form-more').text('更多')
      }
    },
    formatDateTime: formatDateTime,
    // 深度克隆
    clone: clone,
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
          this.validate = false
        }
      })
    },
    // 身份证号码加密
    hideIdNumber(idNumber) {
      if (idNumber) {
        return idNumber.substring(0, 10) + '****' + idNumber.substring(14, 18)
      }
    },
    // 手机号码加密
    hideMobile(mobileNo) {
      if (mobileNo) {
        return mobileNo.substring(0, 3) + '****' + mobileNo.substring(7, 11)
      }
    },
    // 性别显示判断
    showSex(code) {
      return code === 1 ? '女' : '男'
    },
    // 清空重置
    clearForm(obj, formName) {
      this.req = {
        listId: '',
        listName: '',
        modifierName: '',
        startCreateTime: '',
        endCreateTime: '',
        pageNo: this.pageInfo.pageNo,
        pageSize: this.pageInfo.pageSize
      }
      this.req2 = {
        listId: '',
        listName: '',
        modifierName: '',
        startCreateTime: '',
        endCreateTime: '',
        pageNo: this.pageInfo.pageNo,
        pageSize: this.pageInfo.pageSize
      }
    },
    clearForm2() {
      this.searchBatch = {
        batchId: '',
        batchName: '',
        validityStatus: 0,
        createAuthor: '',
        startCreateTime: '',
        endCreateTime: '',
        pageSize: this.namelistPageInfo.pageSize,
        pageNo: this.namelistPageInfo.pageNo
      }
      this.searchBatch2 = {
        batchId: '',
        batchName: '',
        validityStatus: 0,
        createAuthor: '',
        startCreateTime: '',
        endCreateTime: '',
        pageSize: this.namelistPageInfo.pageSize,
        pageNo: this.namelistPageInfo.pageNo
      }
    },
    clearForm3() {
      this.timeValue = ''
      this.searchCustomer = {
        isInternalAdmin: parseInt(localStorage.getItem('is_internal_admin')),
        customerId: '',
        customerName: '',
        mobile: '',
        modifierName: '',
        startModifierTime: '',
        endModifierTime: '',
        pageSize: this.namelistPageInfo.pageSize,
        pageNo: this.namelistPageInfo.pageNo
      }
    },
    // 查询名单信息
    searchNamelist(req) {
      queryNamelist(req)
        .then(response => {
          if (response.data.code === 0) {
            this.tableData = response.data.data
            // this.$set(this.tableData, response.data.data)
            if (response.data.pageInfo) {
              this.pageInfo = response.data.pageInfo
              this.pageShow = true
            } else {
              this.pageShow = false
            }
          } else {
            this.$message(response.data.message)
            this.tableData = response.data.data
            this.pageShow = false
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    getBatch(req) {
      queryBatch(req)
        .then(response => {
          if (response.data.code === 0) {
            if (response.data.data) {
              this.batchTableData = response.data.data
              this.namelistPageInfo = response.data.pageInfo
              this.pageShow2 = true
            } else {
              this.batchTableData = response.data.data
              this.pageShow2 = false
            }
          } else {
            this.$message(response.data.message)
            this.pageShow2 = false
          }
        })
        .catch(error => {
          console.log(error)
          this.$message('操作失败')
        })
    },
    // 查询客户信息
    getCustomers(req) {
      req.startModifierTime = this.timeValue ? this.timeValue[0] : null
      req.endModifierTime = this.timeValue ? this.timeValue[1] : null
      queryByCustomer(req)
        .then(response => {
          if (response.data.code === 0) {
            this.customerTableData = response.data.data
            if (response.data.pageInfo) {
              this.namelistPageInfo = response.data.pageInfo
              this.pageShow2 = true
            } else {
              this.pageShow2 = false
            }
          } else {
            this.$message(response.data.messages)
            this.customerTableData = response.data.data
            this.pageShow2 = false
          }
        })
        .catch(error => {
          console.log(error)
          this.$message('操作失败')
        })
    },
    // 删除名单信息
    delNamelist(listId) {
      delList(listId)
        .then(response => {
          if (response.data.code === 0) {
            this.$message.success(response.data.message)
            this.req2.pageNo = 1
            this.pageInfo.pageNo = 1
            this.searchNamelist(this.req2)
          } else {
            this.$message(response.data.message)
          }
        })
        .catch(error => {
          console.log(error)
          this.$message('删除失败')
        })
    },
    // 查询名单详情
    searchByListId(listId) {
      queryByListId(listId)
        .then(response => {
          if (response.data.code === 0) {
            this.namelistDetail = response.data.data
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    checkEditNamelist(obj) {
      editNamelist(obj).then(response => {
        if (response.data.code === 0) {
          this.editVisible = false
          this.$message.success(response.data.message)
          this.searchNamelist(this.req2)
        } else {
          this.$message(response.data.message)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 修改名单信息
    editNamelist() {
      this.editReq.listId = this.namelistDetail.listId
      this.editReq.listName = this.namelistDetail.listName
      this.editReq.modifierName = this.namelistDetail.modifierName
      this.editReq.modifierTime = this.namelistDetail.modifierTime
      this.editReq.validityStatus = this.namelistDetail.validityStatus

      if (this.editReq.validityStatus === 1) {
        this.visibleCheck = true
      } else {
        this.editVisible = false
        editNamelist(this.editReq).then(response => {
          if (response.data.code === 0) {
            this.$message.success(response.data.message)
            this.searchNamelist(this.req2)
          } else {
            this.$message(response.data.message)
          }
        }).catch(error => {
          console.log(error)
        })
      }
    },
    // 新建名单(通过批次)
    newNamelist(addReq) {
      if (!this.validate) {
        this.$message.error('请输入名单名称')
        return false
      }
      if (this.addNamelist.batchIds.length === 0) {
        this.$message.error('请选择需要生成名单的批次')
        return false
      }
      this.addVisible = false
      addNamelist(addReq).then(response => {
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
          setTimeout(() => {
            this.searchNamelist(this.req2)
          }, 500)
        } else {
          this.$message('新建失败')
        }
      }).catch(error => {
        this.$message('新建失败')
        console.log(error)
      })
    },
    // 新建名单(通过客户信息)
    newNameList(addReq) {
      if (!this.validate) {
        this.$message.error('请输入名单名称')
        return false
      }
      if (this.addNameList.customerIds.length === 0) {
        this.$message.error('请选择需要生成名单的客户')
        return false
      }
      this.addVisible = false
      addNameList(addReq).then(response => {
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
          setTimeout(() => {
            this.searchNamelist(this.req2)
          }, 500)
        } else {
          this.$message('新建失败')
        }
        this.addNameList.listName = ''
        this.clearForm3()
      }).catch(error => {
        this.$message('新建失败')
        console.log(error)
      })
    },
    // 批量删除
    batchDelNamelist(batchDelReq) {
      if (batchDelReq.idlist.length === 0) {
        this.$message.error('请选择需要删除的内容')
      } else {
        batchDelList(batchDelReq.idlist).then(response => {
          if (response.data.code === 0) {
            this.$message.success(response.data.message)
            this.req2.pageNo = 1
            this.pageInfo.pageNo = 1
            this.searchNamelist(this.req2)
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
      this.batchDelReq.idlist.length = 0
      for (var i = 0; i < val.length; i++) {
        this.batchDelReq.idlist.push(val[i].listId)
      }
    },
    namelistSelectionChange(val) {
      this.addNameList.customerIds.length = 0
      for (var i = 0; i < val.length; i++) {
        this.addNameList.customerIds.push(val[i].customerId)
      }
    },
    // 页面显示条数
    handleSizeChange(val) {
      this.req.pageSize = val
      this.req2.pageSize = val
      this.req2.pageNo = 1
      this.pageInfo.pageNo = 1
      this.searchNamelist(this.req2)
    },
    namelistSizeChange(val) {
      this.searchCustomer.pageSize = val
      this.getCustomers(this.searchCustomer)
      // this.searchBatch.pageSize = val
      // this.searchBatch2.pageSize = val
      // this.searchBatch2.pageNo = 1
      // this.namelistPageInfo.pageNo = 1
      // this.getBatch(this.searchBatch2)
    },
    // 分页翻页功能
    handleCurrentChange(val) {
      this.req2.pageNo = val
      this.searchNamelist(this.req2)
    },
    namelistPageChange(val) {
      this.searchCustomer.pageSize = this.namelistPageInfo.pageSize
      this.searchCustomer.pageNo = val
      this.getCustomers(this.searchCustomer)
      // this.searchBatch2.pageSize = this.namelistPageInfo.pageSize
      // this.searchBatch2.pageNo = val
      // this.getBatch(this.searchBatch2)
    }
  }
}
</script>
