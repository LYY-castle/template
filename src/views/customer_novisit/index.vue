<template>
  <div class="container">
    <el-collapse v-model="formContainerOpen" class="form-container" @change="handleChangeAcitve">
      <el-collapse-item title="筛选条件" name="1">
        <el-form :inline="true" size="small" :model="req" ref="searchForm">
          <el-form-item prop="phone" label="电话号码:">
            <el-input v-model="req.phone" placeholder="电话号码（限长50字符）" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item  prop="modifierName" label="操作人:">
            <el-input v-model="req.modifierName" placeholder="操作人（限长45字符）" maxlength="45"></el-input>
          </el-form-item>
          <el-form-item label="操作时间：">
            <el-date-picker
              v-model="req.modifyTimeStart"
              type="datetime"
              placeholder="开始时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="00:00:00">
            </el-date-picker>
            到
            <el-date-picker
              v-model="req.modifyTimeEnd"
              type="datetime"
              placeholder="结束时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="00:00:00">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="活动名称:">
            <el-select v-model="req.campaignId" placeholder="选择活动">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="item in campaignOptions" :key="item.campaignId" :label="item.campaignName" :value="item.campaignId"></el-option>
            </el-select>
          </el-form-item>
           <el-form-item label="状态:">
            <el-select v-model="req.status" placeholder="选择状态">
              <el-option label="全部" value=""></el-option>
              <el-option label="生效" value="0"></el-option>
              <el-option label="不生效" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="req.pageNo=1;paginationReq=cloneData(req);findNoVisitCustomers(req);">查询</el-button>
            <el-button @click="resetReq();">重置</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <!-- 表格 -->
    <el-row class="table-container">
      <el-row class="margin-bottom-20">
        <div class="font14 bold">免访客户表</div>
      </el-row>
      <el-row class="margin-bottom-20">
        <el-button type="success" size="small" @click="addVisible=true;clearForm(noVisitCustomerDetail,'addCustomerForm');noVisitCustomerDetail.forbiddenTime=12">新建</el-button>
        <el-button type="danger" size="small" @click="batchDelVisible=true">批量删除</el-button>
        <!-- <el-button type="primary" size="small" @click="op_hints1=true">批量可见</el-button>
        <el-button type="primary" size="small" @click="op_hints2=true" style="width:100px">批量不可见</el-button> -->
        <el-dropdown size="small" trigger="click" @command="moreOperating" style="margin-left:10px">
          <el-button type="info" style="width:auto">
            更多操作<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown" class="info">
            <el-dropdown-item command='1'>批量生效</el-dropdown-item>
            <el-dropdown-item command='2'>批量不生效</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
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
            label="电话号码"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <a @click="detailVisible=true;delReq.id=scope.row.id;getBlackListInfoById(scope.row.id);">{{scope.row.phone}}</a>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="effectiveDate"
            label="生效时间" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            align="center"
            prop="expiryDate"
            label="失效时间" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            align="center"
            label="操作人" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{(scope.row.modifierName == 0) ? '无':scope.row.modifierName}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="modifyTime"
            label="操作时间"
            width="155">
          </el-table-column>
          <el-table-column align="center" label="状态" >
            <template slot-scope="scope">
              <div :class="scope.row.status===0?'visible':'invisible'">
                <span>{{scope.row.status===0?'生效':'不生效'}}</span>
              </div>
            </template>
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
    
    <!-- 新建免访客户 -->
    <el-dialog
      align:left
      width="30%"
      title="新建免访客户"
      :visible.sync="addVisible"
      append-to-body>
      <el-form size="small" :rules="rule" :model="noVisitCustomerDetail" ref="addCustomerForm" label-width="100px">
        <el-form-item label="免访范围" prop="forbiddenFlag">
          <el-select size="small" v-model="noVisitCustomerDetail.forbiddenFlag" style="width: 100%;">
              <el-option label="全局免访" :value=0></el-option>
              <el-option label="指定活动免访" :value=1></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择活动" prop="campaignIds" v-if="noVisitCustomerDetail.forbiddenFlag===1">
          <el-select size="small" v-model="noVisitCustomerDetail.campaignIds" multiple placeholder="选择活动" style="width: 100%;">
            <el-option v-for="item in campaignOptions" :key="item.campaignId" :label="item.campaignName" :value="item.campaignId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话号码:" prop="phone">
          <el-input v-model="noVisitCustomerDetail.phone" size="small" placeholder="电话号码（限长50字符）" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="禁止周期" prop="forbiddenTime">
          <el-select size="small" v-model="noVisitCustomerDetail.forbiddenTime" style="width: 100%;">
              <el-option label="永久" :value=0></el-option>
              <el-option label="12个月" :value=12></el-option>
              <el-option label="3个月" :value=3></el-option>
              <el-option label="6个月" :value=6></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-switch
          v-model="noVisitCustomerDetail.status"
          active-text="不生效"
          inactive-text="生效"
          active-color="#67C23A"
          :active-value=1
          :inactive-value=0
          ></el-switch>
        </el-form-item>
        <el-form-item label="生效时间:" prop="effectiveDate">
          <el-date-picker
            style="width:100%;"
            v-model="noVisitCustomerDetail.effectiveDate"
            type="datetime"
            placeholder="生效时间"
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="失效时间:" prop="expiryDate">
          <el-date-picker
            style="width:100%;"
            v-model="noVisitCustomerDetail.expiryDate"
            type="date"
            placeholder="失效时间"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item> -->
      </el-form>
      <div slot="footer" style="text-align: right;">
        <el-button type="primary" @click="submitForm('addCustomerForm',noVisitCustomerDetail);addNoVisitCustomers(noVisitCustomerDetail);">确定</el-button>
        <el-button @click="resetForm('addCustomerForm')">重置</el-button>
        <el-button type="primary" plain @click="addVisible = false">取消</el-button>
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
        <el-button type="primary" @click="batchDelVisible = false;batchDelete(batchDelReq);">确定</el-button>
        <el-button type="primary" plain @click="batchDelVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 批量可见 -->
    <el-dialog
      width="30%"
      title="操作提示"
      :visible.sync="op_hints1"
      append-to-body>
      <span style="font-size:20px;">是否确认批量设置客户为生效？</span>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button type="primary" plain @click="op_hints1 = false">取消</el-button>
        <el-button type="primary" @click="op_hints1 = false;batchSetVisibleStatus(batchDelReq,0)">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 批量不可见 -->
    <el-dialog
      width="30%"
      title="操作提示"
      :visible.sync="op_hints2"
      append-to-body>
      <span style="font-size:20px;">是否确认批量设置客户为不生效？</span>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button type="primary" @click="op_hints2 = false;batchSetVisibleStatus(batchDelReq,1)">确定</el-button>
        <el-button type="primary" plain @click="op_hints2 = false">取消</el-button>
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
        <el-button type="primary" @click="delVisible = false;delBlackListInfo(delReq.id);">确定</el-button>
        <el-button type="primary" plain @click="delVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 修改免访客户 -->
    <el-dialog
      align:left
      width="30%"
      title="修改免访客户"
      :visible.sync="editVisible"
      append-to-body>
      <el-form size="small" :rules="rule" :model="editNoVisitCustomerDetail" ref="editCustomerForm" label-width="100px">
        <el-form-item label="免访范围" prop="forbiddenFlag">
          <el-select size="small" v-model="editNoVisitCustomerDetail.forbiddenFlag" style="width: 100%;">
              <el-option label="全局免访" :value=0></el-option>
              <el-option label="指定活动免访" :value=1></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择活动" prop="campaignIds" v-if="editNoVisitCustomerDetail.forbiddenFlag===1">
          <el-select v-model="editNoVisitCustomerDetail.campaignIds" multiple placeholder="选择活动" style="width: 100%;">
            <el-option v-for="item in campaignOptions" :key="item.campaignId" :label="item.campaignName" :value="item.campaignId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话号码:" prop="phone">
          <el-input v-model="editNoVisitCustomerDetail.phone" size="small" placeholder="电话号码（限长50字符）" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="禁止周期" prop="forbiddenTime">
          <el-select size="small" v-model="editNoVisitCustomerDetail.forbiddenTime" style="width: 100%;">
              <el-option label="永久" :value=0></el-option>
              <el-option label="12个月" :value=12></el-option>
              <el-option label="3个月" :value=3></el-option>
              <el-option label="6个月" :value=6></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-switch
          v-model="editNoVisitCustomerDetail.status"
          active-text="不生效"
          inactive-text="生效"
          active-color="#67C23A"
          :active-value=1
          :inactive-value=0
          ></el-switch>
        </el-form-item>
        <el-form-item label="生效时间:" prop="effectiveDate">
          <el-date-picker
            style="width:100%;"
            v-model="editNoVisitCustomerDetail.effectiveDate"
            type="datetime"
            placeholder="生效时间"
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="失效时间:" prop="expiryDate">
          <el-date-picker
            style="width:100%;"
            v-model="editNoVisitCustomerDetail.expiryDate"
            type="date"
            placeholder="失效时间"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item> -->
        <el-form-item label="操作人:" prop="modifierName">
          <span>{{editNoVisitCustomerDetail.modifierName}}</span>
        </el-form-item>
        <el-form-item label="操作时间:" prop="modifyTime">
          <span>{{editNoVisitCustomerDetail.modifyTime}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: right;">
        <el-button type="primary" @click="submitForm('editCustomerForm',editNoVisitCustomerDetail);editBlackListInfo(editNoVisitCustomerDetail);">确定</el-button>
        <el-button @click="getBlackListInfoById(delReq.id)">重置</el-button>
        <el-button type="primary" plain @click="editVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 免访客户详情 -->
    <el-dialog
      align:left
      width="30%"
      title="免访客户详情"
      :visible.sync="detailVisible"
      append-to-body>
      <el-form size="small" :model="editNoVisitCustomerDetail" ref="noVisitCustomerDetailForm" label-width="100px">
        <el-form-item label="活动编号" prop="campaignIds">
          <div style="with:95%;overflow:auto;">{{formateData(editNoVisitCustomerDetail.campaignIds)}}</div>
        </el-form-item>
        <el-form-item label="电话号码:" prop="phone">
          <span>{{editNoVisitCustomerDetail.phone}}</span>
        </el-form-item>
        <el-form-item label="生效时间:" prop="effectiveDate">
          <span>{{editNoVisitCustomerDetail.effectiveDate}}</span>
        </el-form-item>
        <el-form-item label="失效时间:" prop="expiryDate">
          <span>{{editNoVisitCustomerDetail.expiryDate}}</span>
        </el-form-item>
        <el-form-item label="操作人:" prop="modifierName">
          <span>{{editNoVisitCustomerDetail.modifierName}}</span>
        </el-form-item>
        <el-form-item label="操作时间:" prop="modifyTime">
          <span>{{editNoVisitCustomerDetail.modifyTime}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: right;">
        <el-button type="primary" plain @click="detailVisible = false">返回</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { batchSetVisible, findAllCampaigns, queryNoVisitCustomers, addNoVisitCustomers, batchDelete, getBlackListInfoById, editBlackListInfo, delBlackListInfo } from '@/api/customer_novisit'
  import { hideMobile } from '@/utils/tools'
  export default {
    name: 'customer_novisit',
    data() {
      return {
        formContainerOpen: '1',
        formContainer: this.$store.state.app.formContainer,
        detailVisible: false, // 免访客户详情
        delVisible: false, // 删除对话框显示隐藏
        editVisible: false, // 修改对话框显示隐藏
        batchDelVisible: false, // 批量删除对话框显示隐藏
        validate: true, // 验证不通过阻止发请求
        addVisible: false, // 新建对话框显示隐藏
        pageShow: false, // 分页显示隐藏
        op_hints1: false,
        op_hints2: false,
        rule: {
          campaignIds: [{ required: true, message: '请选择活动', trigger: 'blur' }],
          phone: [
            { required: true, message: '请输入手机号码', trigger: 'blur' },
            { pattern: /^\d{0,20}$/, message: '请输入正确的电话号码' }
          ],
          forbiddenFlag: [{ required: true, message: '请选择免访范围', trigger: 'blur' }],
          forbiddenTime: [{ required: true, message: '请选择禁止周期', trigger: 'blur' }],
          effectiveDate: [{ required: true, message: '请选择生效时间', trigger: 'blur' }],
          status: [{ required: true, message: '请选择号段状态', trigger: 'blur' }]
        },
        // 查询 发送请求参数
        req: {
          phone: '',
          modifierName: '',
          modifyTimeStart: '',
          modifyTimeEnd: '',
          campaignId: '',
          status: '',
          pageNo: 1,
          pageSize: 10
        },
        paginationReq: {
          phone: '',
          modifierName: '',
          modifyTimeStart: '',
          modifyTimeEnd: '',
          campaignId: '',
          status: '',
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
          forbiddenFlag: '',
          forbiddenTime: '12',
          phone: '',
          effectiveDate: '',
          visible: 0

        }
      }
    },
    mounted() {
      this.formContainer()
      this.handleChangeAcitve()
      this.findCampaigns()
      this.findNoVisitCustomers(this.req)
    },
    methods: {
      moreOperating(val) {
        if (val === '1') this.op_hints1 = true
        else this.op_hints2 = true
      },
      handleChangeAcitve(active = ['1']) {
        if (active.length) {
          $('.form-more').text('收起')
        } else {
          $('.form-more').text('更多')
        }
      },
      batchSetVisibleStatus(batchDelReq, status) {
        if (batchDelReq.ids.length === 0) {
          this.$message.error('请先选择需要设置的免访客户！')
        } else {
          var blacklistList = {
            ids: batchDelReq.ids,
            status: status
          }
          batchSetVisible(blacklistList)
            .then(response => {
              if (response.data.code === 0) {
                this.$message.success(response.data.message)
                this.findNoVisitCustomers(this.req)
              } else {
                this.$message.error(response.data.message)
              }
            })
        }
      },
      resetReq() {
        this.req = {
          phone: '',
          modifierName: '',
          modifyTimeStart: '',
          modifyTimeEnd: '',
          campaignId: '',
          status: '',
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
        req.modifyTimeStart = req.modifyTimeStart ? req.modifyTimeStart : ''
        req.modifyTimeEnd = req.modifyTimeEnd ? req.modifyTimeEnd : ''
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
            this.$message.error(response.data.messages)
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
        if (noVisitCustomerDetail.forbiddenFlag === 0) {
          noVisitCustomerDetail.campaignIds = []
          for (const k in this.campaignOptions) {
            noVisitCustomerDetail.campaignIds.push(this.campaignOptions[k].campaignId)
          }
        }
        addNoVisitCustomers(noVisitCustomerDetail).then(response => {
          if (response.data.code === 0) {
            this.$message.success(response.data.message)
            this.findNoVisitCustomers(this.paginationReq)
            this.addVisible = false
          } else {
            this.$message.error(response.data.message)
          }
        }).catch(error => {
          this.$message.error('新建失败')
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
              this.$message.error('删除失败')
            }
          }).catch(error => {
            console.log(error)
            this.$message.error('删除失败')
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
        if (editNoVisitCustomerDetail.forbiddenFlag === 0) {
          editNoVisitCustomerDetail.campaignIds = []
          for (const k in this.campaignOptions) {
            editNoVisitCustomerDetail.campaignIds.push(this.campaignOptions[k].campaignId)
          }
        }
        editBlackListInfo(editNoVisitCustomerDetail).then(response => {
          if (response.data.code === 0) {
            this.$message.success(response.data.message)
            this.findNoVisitCustomers(this.paginationReq)
            this.editVisible = false
          } else {
            this.$message.error(response.data.message)
          }
        }).catch(error => {
          console.log(error)
          this.$message.error('修改失败')
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
            this.$message.error('删除失败')
          }
        }).catch(error => {
          console.log(error)
          this.$message.error('删除失败')
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
