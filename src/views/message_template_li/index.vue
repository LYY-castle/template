<template>
  <div class="container" style="padding:10px 20px;">
      <el-row margin-top:>
      <el-form :inline="true" size="small" :model="req" ref="searchForm">
        <el-form-item prop="name">
          <el-input v-model="req.name" placeholder="模板名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="req.groupId" placeholder="模板组">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in messageOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item  prop="modifier">
          <el-input v-model="req.modifier" placeholder="操作人"></el-input>
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
          <el-button type="primary" @click="req.pageNo=1;paginationReq=cloneData(req);findTemplateList(req);" icon="el-icon-search">查询</el-button>
          <el-button type="danger" @click="reset();">重置</el-button>
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
              <div>{{scope.$index+(req.pageNo-1)*10+1}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="模板编号"
            prop="id">
          </el-table-column>
          <el-table-column
            align="center"
            label="模板名称"
            prop="name">
          </el-table-column>
          <el-table-column
            align="center"
            label="归属模板组">
            <template slot-scope="scope">
                <div>{{formatData(scope.row.groupId)}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="模板内容"
            prop="content">
          </el-table-column>
          <el-table-column
            align="center"
            label="模板类型"
            prop="type">
          </el-table-column>
          <el-table-column
            align="center"
            label="操作人"
            prop="modifier">
          </el-table-column>
          <el-table-column
            align="center"
            label="操作时间"
            prop="id">
            <template slot-scope="scope">
                <div>{{formatDateTime(scope.row.modifyTime)}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="200">1
          <template slot-scope="scope">
            <el-button @click="editVisible=true;delReq.id=scope.row.id;getTemplateById(scope.row.id);" type="text" size="small">修改</el-button>
            <el-button @click="delVisible=true;delReq.id=scope.row.templateid" type="text" size="small">删除</el-button>
          </template>
          </el-table-column>
        </el-table>
      </el-col> 
    </el-row>
    <el-row style="margin-top:5px;">
        <el-button type="success" size="small" @click="addVisible=true;clearForm(addMessageTemplateDetail,'addMessageForm');">新建模板组</el-button>
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
    <!-- 新建短信模板 -->
     <el-dialog
      align:left
      width="30%"
      title="新建短信模板"
      :visible.sync="addVisible"
      append-to-body>
      <el-form :rules="rule" :model="addMessageTemplateDetail" ref="addMessageForm" label-width="120px">
        <el-form-item label="模板标题：" prop="name">
           <el-input v-model="addMessageTemplateDetail.name" size="small" placeholder="填标题，上限45字符"></el-input>
        </el-form-item>
        <el-form-item label="模板签名：" prop="autograph">
           <el-input v-model="addMessageTemplateDetail.autograph" size="small" placeholder="例如：金点数据   3至10字"></el-input>
        </el-form-item>
        <el-form-item label="归属模板组：" prop="groupId">
          <el-select v-model="addMessageTemplateDetail.groupId" placeholder="上级模板组">
            <el-option label="请选择模板组" value=""></el-option>
            <el-option v-for="item in messageOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="短信模板内容：" prop="content">
          <el-input type="textarea" v-model="addMessageTemplateDetail.content" placeholder="例如：您的验证码是{1},{2}分钟内有效。若非本人操作请忽略此消息...上限500字符"></el-input>
        </el-form-item>
         <el-form-item label="Tips：" >
          <span>短信模板内容中至少要有一个动态参数并用{}括起来，否则会直接失败。例如：您的验证码是{1}，{2}...第一个花括号为1代表第一个参数，第二个花括号为2代表第二个参数，以此类推。</span>
        </el-form-item>
      </el-form>
        <div slot="footer" style="text-align: right;">
          <el-button type="danger" @click="resetForm('addMessageForm')">重 置</el-button>
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('addMessageForm',addMessageTemplateDetail);addTemplate(addMessageTemplateDetail);">确 定</el-button>
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
          <el-button type="primary" @click="batchDelVisible = false;delTemplateList(batchDelReq);">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 删除 -->
      <el-dialog
      width="30%"
      title="删除"
      :visible.sync="delVisible"
      append-to-body>
      <span style="font-size:20px;">确定删吗？</span>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="delVisible = false;delTemplate(delReq.id);">确 定</el-button>
      </div>
    </el-dialog>
      <!-- 修改免访客户 -->
      <el-dialog
      align:left
      width="30%"
      title="修改免访号段"
      :visible.sync="editVisible"
      append-to-body>
      <el-form :rules="rule" :model="editTemplateDetail" ref="editTemplateForm" label-width="120px">
        <el-form-item label="模板标题：" prop="name">
           <el-input v-model="editTemplateDetail.name" size="small" placeholder="填标题，上限45字符"></el-input>
        </el-form-item>
        <el-form-item label="模板签名：" prop="autograph">
           <el-input v-model="editTemplateDetail.autograph" size="small" placeholder="例如：金点数据   3至10字"></el-input>
        </el-form-item>
        <el-form-item label="归属模板组：" prop="groupId">
          <el-select v-model="editTemplateDetail.groupId" placeholder="上级模板组">
            <el-option label="请选择模板组" value=""></el-option>
            <el-option v-for="item in messageOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="短信模板内容：" prop="content">
          <el-input type="textarea" v-model="editTemplateDetail.content" placeholder="例如：您的验证码是{1},{2}分钟内有效。若非本人操作请忽略此消息...上限500字符"></el-input>
        </el-form-item>
         <el-form-item label="Tips：" >
          <span>短信模板内容中至少要有一个动态参数并用{}括起来，否则会直接失败。例如：您的验证码是{1}，{2}...第一个花括号为1代表第一个参数，第二个花括号为2代表第二个参数，以此类推。</span>
        </el-form-item>
      </el-form>
        <div slot="footer" style="text-align: right;">
          <el-button type="danger" @click="getTemplateById(delReq.id)">重 置</el-button>
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('editTemplateForm',editTemplateDetail);editTemplate(editTemplateDetail);">确 定</el-button>
        </div>
      </el-dialog>
  </div>
</template>
<script>
import { findTemplateList, getAllTemplateGroup, addTemplate, getTemplateById, editTemplate, delTemplate, delTemplateList } from '@/api/message_template_li'
import { formatDateTime } from '@/utils/tools'
export default {
  name: 'customerNoVisit',
  data() {
    var validateLength = (eule, value, callback) => {
      if (eule.field === 'name' && value.length > 45) {
        return callback(new Error('模板标题太长！'))
      } else if (eule.field === 'autograph' && value.length > 10) {
        return callback(new Error('模板签名太长！'))
      } else if (eule.field === 'autograph' && value.length < 3) {
        return callback(new Error('模板签名太短！'))
      } else {
        callback()
      }
    }
    return {
      delVisible: false, // 删除对话框显示隐藏
      editVisible: false, // 修改对话框显示隐藏
      batchDelVisible: false, // 批量删除对话框显示隐藏
      validate: true, // 验证不通过阻止发请求
      addVisible: false, // 添加对话框显示隐藏
      pageShow: false, // 分页显示隐藏
      timeValue: '', // 操作时间
      messageMap: {}, // 存所有的模板
      rule: {
        name: [
          { required: true, message: '模板标题不能为空', trigger: 'blur' },
          { validator: validateLength, trigger: 'blur' }
        ],
        autograph: [
          { required: true, message: '模板签名不能为空', trigger: 'blur' },
          { validator: validateLength, trigger: 'blur' }],
        content: [{ required: true, message: '模板内容不能为空', trigger: 'blur' }],
        groupId: [{ required: true, message: '请选择模板组', trigger: 'blur' }]

      },
      // 查询 发送请求参数
      req: {
        name: '', // 模板名称
        groupId: '', // 上级模板Id
        modifier: '', // 操作人
        afterTime: '', // 操作时间
        beginTime: '', // 操作时间
        pageNo: 1
      },
      paginationReq: {
        name: '', // 模板名称
        groupId: '', // 上级模板Id
        modifier: '', // 操作人
        afterTime: '', // 操作时间
        beginTime: '', // 操作时间
        pageNo: 1
      }, // 记录上次查询条件
      addMessageTemplateDetail: {
        name: '', // 名字
        autograph: '', // 签名
        content: '', // 内容
        groupId: '', // 上级id
        type: '4' // 短信类型
      },
      delReq: {
        id: ''
      },
      // 删除ids
      batchDelReq: {
        ids: []
      },
      pageInfo: {}, // 分页数据
      messageOptions: [], // 选择活动数据
      tableData: [], // 表格数据
      editTemplateDetail: {}, // 修改
      noVisitCustomerDetail: {
        campaignIds: [],
        customerPhone: '',
        effectiveDate: '',
        expiryDate: ''

      }
    }
  },
  created() {
    this.getAllTemplateGroup(this.req)
  },
  // mounted() {
  //   this.getTemplateList(this.req)
  // },
  methods: {
    // 重置查询框内容
    reset() {
      this.req = {
        startNumber: '', // 号段
        endNumber: '', // 号段
        modifier: '', // 操作人
        afterTime: '', // 操作时间
        beginTime: '', // 操作时间
        pageNo: 1
      }
      this.timeValue = ''
    },
    resetAdd() {
      this.addMessageTemplateDetail = {
        name: '', // 开始号段
        upId: '' // 结束号段
      }
    },
    getAllTemplateGroup() {
      getAllTemplateGroup().then(response => {
        this.messageOptions = response.data.data
        this.findTemplateList(this.req)
        this.messageOptions.forEach(element => {
          this.messageMap[(element.id).toString()] = (element.name)
        })
        console.log(this.messageMap)
      })
    },
    // 查询表格数据
    findTemplateList(req) {
      this.req.beginTime = this.timeValue[0]
      this.req.afterTime = this.timeValue[1]
      findTemplateList(req).then(response => {
        if (response.data.code === 0) {
          this.tableData = response.data.data
          console.log(this.tableData)
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
    // 通过Id查询
    getTemplateById(id) {
      getTemplateById(id).then(response => {
        if (response.data.code === 0) {
          this.editTemplateDetail = response.data.data
        } else {
          this.$message.success(response.data.message)
        }
      }).catch(error => {
        console.error(error)
      })
    },
    // 新增
    addTemplate(obj) {
      if (!this.validate) {
        return
      }
      addTemplate(obj).then(response => {
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
          this.addVisible = false
          this.reset()
          this.resetAdd()
          this.getAllTemplateGroup()
          this.findTemplateList(this.req)
        } else {
          this.$message(response.data.message)
        }
      }).catch(error => {
        console.error(error)
      })
    },
    // 批量删除
    delTemplateList(batchDelReq) {
      if (batchDelReq.ids.length === 0) {
        this.$message.error('请选择需要删除的内容')
      } else {
        delTemplateList(batchDelReq.ids).then(response => {
          if (response.data.code === 0) {
            this.$message.success(response.data.message)
            this.findTemplateList(this.paginationReq)
          } else {
            this.$message('删除失败')
          }
        }).catch(error => {
          console.log(error)
        })
      }
    },
    // 修改
    editTemplate(params) {
      if (!this.validate) {
        return
      }
      editTemplate(params).then(response => {
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
          this.editVisible = false
          this.findTemplateList(this.paginationReq)
        } else {
          this.$message('修改失败')
        }
      }).catch(error => {
        console.error(error)
      })
    },
    // 删除
    delTemplate(id) {
      delTemplate(id).then(response => {
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
          this.delVisible = false
          this.findTemplateList(this.paginationReq)
        } else {
          this.$message('删除失败')
        }
      }).catch(error => {
        console.error(error)
      })
    },
    formatDateTime: formatDateTime, // 时间格式化
    // 表格多选框
    handleSelectionChange(val) {
      this.batchDelReq.ids.length = 0
      for (var i = 0; i < val.length; i++) {
        this.batchDelReq.ids.push(val[i].id)
      }
    },
    // 分页翻页功能
    handleCurrentChange(val) {
      this.paginationReq.pageNo = val
      this.req.pageNo = val
      this.findTemplateList(this.paginationReq)
    },
    // 清空重置
    clearForm(obj, formName) {
      for (const key in obj) {
        if (key !== 'type') {
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
      console.log(value)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.validate = true
        } else {
          this.$message.error('请检查是否填写正确')
          this.validate = false
        }
      })
    },
    formatData(id) {
      if (id == null) {
        return ''
      } else {
        return this.messageMap[id.toString()] == null ? '' : this.messageMap[id.toString()]
      }
    },
    // 克隆数据
    cloneData(obj) {
      var data = {}
      data = JSON.parse(JSON.stringify(obj))
      return data
    }
  }
}
</script>
