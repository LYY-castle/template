<template>
  <div class="container" >
    <el-row margin-top:>
      <el-form :inline="true" size="small" :model="req" ref="searchForm">
        <el-form-item prop="templateid" label="模板编号:">
          <el-input v-model="req.templateid" placeholder="模板编号（上限45字符）" maxlength="45"></el-input>
        </el-form-item>
        <el-form-item prop="templateName" label="模板名称:">
          <el-input v-model="req.templateName" placeholder="模板名称（上限45字符）" maxlength="45"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="电话号码:">
          <el-input v-model="req.mobile" placeholder="电话号码（上限20字符）" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item prop="code" label="短信状态:">
           <el-select v-model="req.code">
            <el-option label="全部" value="" selected></el-option>
            <el-option label="成功" value="000000"></el-option>
            <el-option label="失败" value="100001"></el-option>
           </el-select>
        </el-form-item>
        <el-form-item prop="creator" label="操作人:">
          <el-input v-model="req.creator" placeholder="操作人（上限45字符）" maxlength="45"></el-input>
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
          <el-button type="primary" @click="req.pageNo=1;messageSendRecords(req);">查询</el-button>
          <el-button type="danger" @click="reset();">重置</el-button>
        </el-form-item>
      </el-form>
    </el-row>
     <!-- 表格 -->
    <el-row>
      <el-col>
        <el-table
          :data="tableData"
          border>
          <el-table-column
            align="center"
            label="序号"
            width="55">
            <template
              slot-scope="scope">
              <div>{{scope.$index+(req.pageNo-1)*req.pageSize+1}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="模板编号"
            prop="templateid">
          </el-table-column>
          <el-table-column
            align="center"
            label="模板名称"
            prop="templateName">
          </el-table-column>
          <el-table-column
            align="left"
            label="模板内容"
            prop="text"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            align="center"
            label="电话号码"
            prop="mobile">
          </el-table-column>
          <el-table-column
            align="center"
            label="短信状态">
             <template slot-scope="scope">
                {{showStatus(scope.row.code)}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作人"
            prop="creator"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            align="center"
            label="操作时间"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
                {{formatDateTime(scope.row.createTime)}}
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row style="margin-top:5px;">
        <el-button type="success" size="small" @click="sendVisible=true;dynamicValidateForm.name='';resetForm('dynamicValidateForm')">发送短信</el-button>
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
     <!-- 发送短信 -->
    <el-dialog
      align:left
      width="40%"
      title="发送短信"
      :visible.sync="sendVisible"
      append-to-body>
      <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px">
        <el-form-item
          prop="name"
          label="短信模板"
          :rules="{ required: true, message: '请选择短信模板', trigger: 'change' }">
          <el-input size="small" v-model="dynamicValidateForm.name" readonly="true" placeholder="请选择短信模板">
             <el-button slot="append" icon="el-icon-search"  @click.prevent="messageVisible=true;radio='';resetMessageReq();findTemplateList()"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item
          prop="text"
          label="短信内容"
          :rules="{ required: true, message: '短信内容不能为空', trigger: 'blur' }">
          <el-input type="textarea" v-model="dynamicValidateForm.text"></el-input>
          <span><span style="color:red">*</span>短信内容只允许更改{}里面的内容，修改其他地方无效!</span>
        </el-form-item>
        <el-form-item
          v-for="(domain, index) in dynamicValidateForm.domains"
          :label="'电话号码' + (index+1)"
          :key="domain.key"
          :prop="'domains.' + index + '.value'"
          :rules="[
          {required: true, message: '电话号码不能为空', trigger: 'blur'},
          { pattern: /^\d{1,11}$/, message: '请输入不超过11位数字',trigger:'blur'}
          ]">
          <el-input v-model="domain.value" size="small" style="width:82%" placeholder="电话号码（上限20字符）"></el-input>
          <el-button type="error" size="small" @click.prevent="removeDomain(domain)">删除</el-button>
        </el-form-item>
        <el-form-item style="text-align: right;">
          <el-button type="success" @click="addDomain">新增号码</el-button>
          <el-button type="primary" @click="validate('dynamicValidateForm')">发送</el-button>
          <el-button type="danger" @click="resetForm('dynamicValidateForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 短信模板展示 -->
     <el-dialog
      align:left
      width="60%"
      title="选择短信模板"
      :visible.sync="messageVisible"
      append-to-body>
       <el-form :inline="true" size="small" :model="messageReq" ref="searchForm">
        <el-form-item prop="name" label="模板名称:">
          <el-input v-model="messageReq.name" placeholder="模板名称（上限45字符）" maxlength="45"></el-input>
        </el-form-item>
        <el-form-item label="归属模板组:">
          <el-select v-model="messageReq.groupId" placeholder="归属模板组">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in messageOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item  prop="modifier" label="操作人:">
          <el-input v-model="messageReq.modifier" placeholder="操作人（上限45字符）" maxlength="45"></el-input>
        </el-form-item>
        <el-form-item label="操作时间：">
             <el-date-picker
              v-model="timeMessage"
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="messageReq.pageNo=1;findTemplateList(messageReq);">查询</el-button>
          <el-button type="danger" @click="resetMessageReq();">重置</el-button>
        </el-form-item>
      </el-form>
       <!-- 表格 -->
    <el-row>
      <el-col>
        <el-table
          :data="messageTableData"
          border>
          <el-table-column
            align="center"
             label="选择">
             <template
              slot-scope="scope">
              <el-radio v-model="radio" :label="scope.row.templateid">&nbsp;</el-radio>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="序号"
            width="55">
            <template
              slot-scope="scope">
              <div>{{scope.$index+(messageReq.pageNo-1)*messageReq.pageSize+1}}</div>
            </template>
          </el-table-column>
          <!-- <el-table-column
            align="center"
            label="模板编号"
            prop="id">
          </el-table-column> -->
          <el-table-column
            align="center"
            label="模板名称"
            prop="name"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            align="center"
            label="归属模板组"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
                {{formatData(scope.row.groupId)}}
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            label="模板内容"
            prop="content"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            align="center"
            label="操作人"
            prop="modifier"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            align="center"
            label="操作时间"
            prop="id"
            width="155"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
                {{formatDateTime(scope.row.modifyTime)}}
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row style="margin-top:5px;">
        <el-pagination
          v-if="messagePageShow"
          background
          @size-change="messageHandleSizeChange"
          @current-change="messageHandleCurrentChange"
          :current-page='messagePageInfo.pageNo'
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size='messagePageInfo.pageSize'
          layout="total, sizes, prev, pager, next, jumper "
          :total='messagePageInfo.totalCount' style="text-align: right;float:right;">
        </el-pagination>
    </el-row>
    <el-row style="text-align: right; margin-top:10px">
      <el-button type="danger" @click="radio='';messageVisible=false">取消</el-button>
      <el-button type="primary" @click="selectedMessage()">确定</el-button>
    </el-row>
    </el-dialog>
     <!-- 发送 -->
      <el-dialog
      width="30%"
      title="发送"
      :visible.sync="send"
      append-to-body>
      <span style="font-size:20px;">确定发送短信吗？</span>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button @click="send = false">取 消</el-button>
        <el-button type="primary" @click="sendMessage();">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { messageSendRecords, findTemplateList, getAllTemplateGroup, sendMessage } from '@/api/message_send_list'
import { Message } from 'element-ui'
import { formatDateTime } from '@/utils/tools'
export default {
  name: 'messageSendList',
  data() {
    return {
      send: false,
      rules: {
        name: [
          { required: true, message: '请选择短信模板', trigger: 'change' }
        ],
        content: [
          { required: true, message: '短信内容不能为空', trigger: 'blur' }
        ]
      },
      radio: '',
      messageOptions: {},
      messagePageShow: true,
      messageVisible: false,
      messagePageInfo: {},
      messageTableData: [],
      messageMap: {},
      sendVisible: false,
      pageShow: true,
      timeMessage: [],
      pageInfo: {},
      // 查询 发送请求参数
      messageReq: {
        examine: '2',
        name: '', // 模板名称
        groupId: '', // 上级模板Id
        modifier: '', // 操作人
        afterTime: '', // 操作时间
        beginTime: '', // 操作时间
        pageNo: 1,
        pageSize: 10
      },
      req: {
        templateid: '',
        templateName: '',
        code: '',
        mobile: '',
        creator: '',
        beginTime: '',
        afterTime: '',
        pageNo: 1,
        pageSize: 10
      },
      timeValue: [],
      tableData: [],
      dynamicValidateForm: {
        domains: [{
          value: ''
        }],
        name: '',
        text: ''
      }
    }
  },
  mounted() {
    this.messageSendRecords()
    this.getAllTemplateGroup()
  },
  methods: {
    validate(item) {
      this.$refs[item].validate((valid) => {
        if (this.dynamicValidateForm.domains && this.dynamicValidateForm.domains.length > 0 && this.dynamicValidateForm.domains[0].value) {
          if (valid) {
            this.send = true
          } else {
            Message({
              message: '请检查是否填写正确',
              type: 'error',
              duration: 3 * 1000
            })
          }
        } else {
          Message({
            message: '请填写电话号码',
            type: 'error',
            duration: 3 * 1000
          })
        }
      })
    },
    sendMessage() {
      var param = {}
      var phone = []
      param.text = this.dynamicValidateForm.text
      this.dynamicValidateForm.domains.forEach(element => {
        phone.push(element.value)
      })
      param.phone = phone.join(',')
      param.templateid = this.radio
      sendMessage(param).then(response => {
        if (response.data.code === 0) {
          Message({
            message: response.data.message,
            type: 'success',
            duration: 3 * 1000
          })
          this.send = false
          this.sendVisible = false
          this.messageSendRecords()
        } else {
          Message({
            message: response.data.message,
            type: 'error',
            duration: 3 * 1000
          })
          this.send = false
        }
      })
    },
    messageSendRecords() {
      this.req.beginTime = ''
      this.req.afterTime = ''
      if (this.timeValue) {
        this.req.beginTime = this.timeValue[0]
        this.req.afterTime = this.timeValue[1]
      }
      messageSendRecords(this.req).then(response => {
        if (response.data.code === 0) {
          this.tableData = response.data.data
          if (response.data.pageInfo) {
            this.pageInfo = response.data.pageInfo
            this.pageShow = true
          } else {
            this.pageShow = false
          }
        } else {
          this.tableData = response.data.data
          this.pageShow = false
          Message({
            message: response.data.message,
            type: 'error',
            duration: 3 * 1000
          })
        }
      }).catch(error => {
        console.error(error)
      })
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
    findTemplateList() {
      this.messageReq.beginTime = ''
      this.messageReq.afterTime = ''
      if (this.timeMessage) {
        this.messageReq.beginTime = this.timeMessage[0]
        this.messageReq.afterTime = this.timeMessage[1]
      }
      findTemplateList(this.messageReq).then(response => {
        if (response.data.code === 0) {
          this.messageTableData = response.data.data
          if (response.data.pageInfo) {
            this.messagePageInfo = response.data.pageInfo
            this.messagePageShow = true
          } else {
            this.messagePageShow = false
          }
        } else {
          this.messageTableData = response.data.data
          this.messagePageShow = false
          Message({
            message: response.data.message,
            type: 'error',
            duration: 3 * 1000
          })
        }
      })
    },
    formatDateTime: formatDateTime,
    reset() {
      this.req = {
        templateid: '',
        templateName: '',
        code: '',
        mobile: '',
        creator: '',
        beginTime: '',
        afterTime: '',
        pageNo: 1,
        pageSize: 10
      }
      this.timeValue = []
    },
    resetMessageReq() {
      this.messageReq = {
        examine: '2',
        name: '', // 模板名称
        groupId: '', // 上级模板Id
        modifier: '', // 操作人
        afterTime: '', // 操作时间
        beginTime: '', // 操作时间
        pageNo: 1,
        pageSize: 10
      }
      this.timeMessage = []
    },
    formatData(id) {
      console.log('id:', id)
      console.log('this.messageMap:', this.messageMap)
      if (id == null) {
        return ''
      } else {
        return this.messageMap[id.toString()] == null ? '' : this.messageMap[id.toString()]
      }
    },
    showStatus(status) {
      if (status === '000000') {
        return '成功'
      } else if (status === '100001') {
        return '失败'
      } else {
        return ''
      }
    },
    // 分页翻页功能
    handleCurrentChange(val) {
      this.req.pageNo = val
      this.messageSendRecords(this.req)
    },
    // 页面显示条数
    handleSizeChange(val) {
      this.req.pageNo = 1
      this.req.pageSize = val
      this.messageSendRecords(this.req)
    },
    // 分页翻页功能
    messageHandleCurrentChange(val) {
      this.messageReq.pageNo = val
      this.findTemplateList(this.req)
    },
    // 页面显示条数
    messageHandleSizeChange(val) {
      this.req.pageNo = 1
      this.req.pageSize = val
      this.findTemplateList(this.req)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1)
      }
    },
    addDomain() {
      this.dynamicValidateForm.domains.push({
        value: '',
        key: Date.now()
      })
    },
    selectedMessage() {
      if (this.radio) {
        this.messageTableData.forEach(element => {
          if (element.templateid === this.radio) {
            this.dynamicValidateForm.name = element.name
            this.dynamicValidateForm.text = element.content
          }
        })
        this.messageVisible = false
      } else {
        Message({
          message: '请选择短信模板',
          type: 'error',
          duration: 3 * 1000
        })
      }
    }

  }

}
</script>
