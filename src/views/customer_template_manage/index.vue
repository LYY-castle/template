<template>
  <div class="container">
    <el-collapse v-model="formContainerOpen" class="form-container" @change="handleChangeAcitve">
      <el-collapse-item title="筛选条件" name="1">
        <el-form :inline="true" size="small">
          <el-form-item label="模板属性代码:">
            <el-input v-model="req.propertyCode" placeholder="模板属性代码（限长50字符）" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="模板属性名:">
            <el-input v-model="req.propertyName" placeholder="客户模板名（限长50字符）" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="是否必填：" prop="isRequired">
            <el-radio-group v-model="req.isRequired" size="small">
              <el-radio label="">所有</el-radio>
              <el-radio :label=0>否</el-radio>
              <el-radio :label=1>是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否选中：" prop="isSelected">
            <el-radio-group v-model="req.isSelected" size="small" v-if="req.isRequired===0">
              <el-radio label="">所有</el-radio>
              <el-radio :label=0>否</el-radio>
              <el-radio :label=1>是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="操作人:">
            <el-input v-model="req.modifierName" placeholder="操作人（限长50）字符" maxlength="50"></el-input>
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
            <el-button type="primary" @click="req.pageNo=1;findMessageRecordList(req);req2=clone(req);">查询</el-button>
            <el-button @click="reset();req2=clone(req)">重置</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <el-row class="table-container">
      <el-row class="margin-bottom-20">
        <div class="font14 bold">客户模板表</div>
      </el-row>
      <el-row class="margin-bottom-20">
        <el-button type="success" size="small" @click="addVisible=true;clearForm(templateDetail,'templateDetail');">新建</el-button>
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
            prop="propertyCode"
            label="模板属性代码">
          </el-table-column>
          <el-table-column
            align="center"
            label="模板属性名"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <a @click="detailVisible=true;delReq.id=scope.row.id;findTemplateMetaById(delReq);">{{scope.row.propertyName}}</a>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="是否必填">
            <template
              slot-scope="scope">
              <div>{{showIsRequired(scope.row.isRequired)}}</div>
            </template>
          </el-table-column>
           <el-table-column
            align="center"
            label="是否选中">
            <template
              slot-scope="scope">
              <div>{{showIsSelected(scope.row.isRequired,scope.row.isSelected)}}</div>
            </template>
          </el-table-column>
           <el-table-column
            align="center"
            label="校验规则">
            <template
              slot-scope="scope">
              <div>{{scope.row.regex ? scope.row.regex : ''}}</div>
            </template>
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
          <el-table-column
            align="center"
            label="操作"
            width="100">
          <template slot-scope="scope">
            <el-button @click="editVisible=true;delReq.id=scope.row.id;findTemplateMetaById(delReq);" type="text" size="small">修改</el-button>
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
    
    <el-dialog
      align:left
      width="30%"
      title="修改客户模板字段信息"
      :visible.sync="editVisible"
      append-to-body>
      <el-form size="small" label-width="110px" :model="templateDetail" ref="editTemplate" :rules="rule">
        <el-form-item label="模板属性代码" prop="propertyCode">
           <el-input v-model="templateDetail.propertyCode" size="small" placeholder="上限50字符" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="模板属性名" prop="propertyName">
          <el-input v-model="templateDetail.propertyName" size="small" placeholder="上限50字符" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="是否必填" prop="isRequired">
          <el-radio-group v-model="templateDetail.isRequired" size="small">
            <el-radio-button :label=0 border>否</el-radio-button>
            <el-radio-button :label=1 border>是</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否选中" prop="isSelected" v-if="templateDetail.isRequired===0">
          <el-radio-group v-model="templateDetail.isSelected" size="small">
            <el-radio-button :label=0 border>否</el-radio-button>
            <el-radio-button :label=1 border>是</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="校验规则" prop="regex">
          <el-input v-model="templateDetail.regex" size="small" placeholder="上限200字符" maxlength="200"></el-input>
        </el-form-item>
      </el-form>
        <div slot="footer" style="text-align: right;">
          <el-button type="primary" @click="submitForm('editTemplate');editTemplate(templateDetail)">确定</el-button>
          <el-button @click="findTemplateMetaById(delReq)">重置</el-button>
          <el-button type="primary" plain @click="editVisible = false">取消</el-button>
        </div>
    </el-dialog>
    <el-dialog
      align:left
      width="30%"
      title="客户模板字段详情"
      :visible.sync="detailVisible"
      append-to-body>
      <el-form size="small" label-width="110px">
        <el-form-item label="模板属性代码">
          <span>{{templateDetail.propertyCode}}</span>
        </el-form-item>
        <el-form-item label="模板属性名">
          <span>{{templateDetail.propertyName}}</span>
        </el-form-item>
        <el-form-item label="是否必填">
          <span>{{showIsRequired(templateDetail.isRequired)}}</span>
        </el-form-item>
        <el-form-item label="是否选中">
          <span>{{showIsSelected(templateDetail.isRequired,templateDetail.isSelected)}}</span>
        </el-form-item>
        <el-form-item label="校验规则">
          <span>{{templateDetail.regex?templateDetail.regex:""}}</span>
        </el-form-item>
        <el-form-item label="操作人">
          <span>{{templateDetail.modifierName}}</span>
        </el-form-item>
        <el-form-item label="操作时间">
          <span>{{templateDetail.modifierTime}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: right;">
        <el-button type="primary" plain @click="detailVisible = false">返回</el-button>
      </div>
    </el-dialog>
    <el-dialog
      align:left
      width="30%"
      title="新建客户模板字段信息"
      :visible.sync="addVisible"
      append-to-body>
      <el-form size="small" :rules="rule" :model="templateDetail" ref="templateDetail" label-width="110px">
         <el-form-item label="模板属性代码" prop="propertyCode">
           <el-input v-model="templateDetail.propertyCode" size="small" placeholder="上限50字符" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="模板属性名" prop="propertyName">
          <el-input v-model="templateDetail.propertyName" size="small" placeholder="上限50字符" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="是否必填" prop="isRequired">
          <el-radio-group v-model="templateDetail.isRequired" size="small">
            <el-radio-button :label=0 border>否</el-radio-button>
            <el-radio-button :label=1 border>是</el-radio-button>
          </el-radio-group>
        </el-form-item>
         <el-form-item label="是否选中" prop="isSelected"  v-if="templateDetail.isRequired===0">
          <el-radio-group v-model="templateDetail.isSelected" size="small">
            <el-radio-button :label=0 border>否</el-radio-button>
            <el-radio-button :label=1 border>是</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="校验规则" prop="regex">
          <el-input v-model="templateDetail.regex" size="small" placeholder="上限200字符" maxlength="200"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: right;">
        <el-button type="primary" @click="submitForm('templateDetail');addTemplate(templateDetail);">确定</el-button>
        <el-button @click="resetForm('templateDetail')">重置</el-button>
        <el-button type="primary" plain @click="addVisible = false">取消</el-button>
      </div>
      
      </el-dialog>
    <el-dialog
      width="30%"
      title="删除"
      :visible.sync="delVisible"
      append-to-body>
      <span style="font-size:20px;">确定删除此内容？</span>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button type="primary" @click="delVisible = false;delTemplate(delReq);">确定</el-button>
        <el-button type="primary" plain @click="delVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="30%"
      title="批量删除"
      :visible.sync="batchDelVisible"
      append-to-body>
      <span style="font-size:20px;">确定删除选定内容？</span>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button type="primary" @click="batchDelVisible = false;batchDelCustomer(batchDelReq);">确定</el-button>
        <el-button type="primary" plain @click="batchDelVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import {
  findTemplateMetaById,
  addTemplateMeta,
  modifyTemplateMeta,
  delTemplateMetas,
  delTemplateMeta,
  findMessageRecordList
} from '@/api/customer_template_management'
import { formatDateTime, clone } from '@/utils/tools'

export default {
  name: 'customer_management',
  data() {
    return {
      visibleClass: '',
      formContainerOpen: '1',
      formContainer: this.$store.state.app.formContainer,
      detailVisible: false,
      delVisible: false, // 删除对话框显示隐藏
      editVisible: false, // 修改对话框显示隐藏
      addVisible: false, // 新建对话框显示隐藏
      batchDelVisible: false, // 批量删除对话框显示隐藏
      tableData: [], // 表格数据
      validate: true, // 验证不通过阻止发请求
      pageShow: false, // 分页显示隐藏
      timeValue: [],
      rule: {
        propertyCode: [
          { required: true, message: '请输入模板属性代码', trigger: 'blur' }
        ],
        propertyName: [
          { required: true, message: '请输入模板属性名字', trigger: 'blur' }
        ],
        isRequired: [
          { required: true, message: '请选择是否必填', trigger: 'blur' }
        ],
        isSelected: [
          { required: true, message: '请选择是否选中', trigger: 'blur' }
        ]
      },
      delReq: {
        id: ''
      },
      batchDelReq: {
        ids: []
      },
      // 查询 发送请求参数
      req: {
        propertyCode: '',
        propertyName: '',
        isRequired: '',
        isSelected: '',
        modifierName: '',
        modifyTimeStart: '',
        modifyTimeEnd: '',
        pageNo: 1,
        pageSize: 10
      },
      req2: {
        customerName: '',
        customerPhone: '',
        modifierName: '',
        startModifierTime: '',
        endModifierTime: '',
        pageNo: 1,
        pageSize: 10
      },
      // 模板详情
      templateDetail: {},
      // 分页数据
      pageInfo: {}
    }
  },
  mounted() {
    this.formContainer()
    this.handleChangeAcitve()
    this.findMessageRecordList(this.req)
  },
  methods: {
    handleChangeAcitve(active = ['1']) {
      if (active.length) {
        $('.form-more').text('收起')
      } else {
        $('.form-more').text('更多')
      }
    },
    // 深度克隆
    clone: clone,
    // 重置查询框内容
    reset() {
      this.timeValue = []
      this.req = {
        propertyCode: '',
        propertyName: '',
        mobile: '',
        isRequired: '',
        isSelected: '',
        modifierName: '',
        modifyTimeStart: '',
        modifyTimeEnd: '',
        pageNo: this.pageInfo.pageNo,
        pageSize: this.pageInfo.pageSize
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
    showIsRequired(code) {
      return code === 1 ? '是' : '否'
    },
    showIsSelected(required, select) {
      if (required === 1) {
        return '/'
      } else {
        return select === 1 ? '是' : '否'
      }
    },
    // 查询客户信息
    findMessageRecordList(req) {
      req.modifyTimeStart = this.timeValue ? this.timeValue[0] : null
      req.modifyTimeEnd = this.timeValue ? this.timeValue[1] : null
      findMessageRecordList(req)
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
    delTemplate(customerId) {
      delTemplateMeta(customerId.id)
        .then(response => {
          if (response.data.code === 0) {
            this.$message.success(response.data.message)
            this.req2.pageNo = 1
            this.pageInfo.pageNo = 1
            this.findMessageRecordList(this.req2)
          } else {
            this.$message.error(response.data.message)
          }
        })
        .catch(error => {
          console.log(error)
          this.$message('删除失败')
        })
    },
    // 修改前查询模板详情
    findTemplateMetaById(id) {
      findTemplateMetaById(id)
        .then(response => {
          if (response.data.code === 0) {
            this.templateDetail = response.data.data
          } else {
            console.log(response.data.message)
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 修改客户信息
    editTemplate(templateDetail) {
      if (templateDetail.isRequired === 1) {
        templateDetail['isSelected'] = 1
      }
      if (!this.validate) {
        return false
      }
      this.editVisible = false
      modifyTemplateMeta(templateDetail).then(response => {
        console.log('modify:', this.templateDetail)
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
          this.findMessageRecordList(this.req2)
        } else {
          this.$message(response.data.messages)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 新建客户
    addTemplate(templateDetail) {
      if (templateDetail.isRequired === 1) {
        templateDetail['isSelected'] = 1
      }
      if (!this.validate) {
        return false
      }
      this.addVisible = false
      addTemplateMeta(templateDetail).then(response => {
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
          this.findMessageRecordList(this.req2)
        } else {
          this.$message(response.data.message)
        }
      }).catch(error => {
        this.$message('新建失败')
        console.log(error)
      })
    },
    // 批量删除
    batchDelCustomer(batchDelReq) {
      console.log(batchDelReq.ids)
      if (batchDelReq.ids.length === 0) {
        this.$message.error('请选择需要删除的内容')
      } else {
        delTemplateMetas(batchDelReq.ids).then(response => {
          if (response.data.code === 0) {
            this.$message.success(response.data.message)
            this.req2.pageNo = 1
            this.pageInfo.pageNo = 1
            this.findMessageRecordList(this.req2)
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
      this.batchDelReq.ids.length = 0
      for (var i = 0; i < val.length; i++) {
        this.batchDelReq.ids.push(val[i].id)
      }
    },
    // 页面显示条数
    handleSizeChange(val) {
      this.req2.pageSize = val
      this.req.pageSize = val
      this.pageInfo.pageNo = 1
      this.req.pageNo = 1
      this.req2.pageNo = 1
      this.findMessageRecordList(this.req2)
    },
    // 分页翻页功能
    handleCurrentChange(val) {
      this.req2.pageNo = val
      this.findMessageRecordList(this.req2)
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
