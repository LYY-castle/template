<template>
  <div class="container">
    <el-collapse v-model="formContainerOpen" class="form-container" @change="handleChangeAcitve">
      <el-collapse-item title="筛选条件" name="1">
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
              <el-option label="发送中" value="1"></el-option>
              <el-option label="成功" value="3"></el-option>
              <el-option label="失败" value="2"></el-option>
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
            <el-button @click="reset();">重置</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <el-row class="table-container">
      <el-row class="margin-bottom-20">
        <div class="font14 bold">短信表</div>
      </el-row>
      <el-row class="margin-bottom-20">
        <el-button type="info" size="small" @click="sendVisible=true;dynamicValidateForm.name='';dynamicValidateForm.text='';msg_transfer='';resetForm('dynamicValidateForm')">发送短信</el-button>
        <el-button type="success" size="small" @click="req.pageNo=1;messageSendRecords(req);">刷新</el-button>
      </el-row>
      <el-row>
        <el-table
          :data="tableData">
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
            label="短信内容"
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
                <div :class="scope.row.code==='3'?'visible':'invisible'">
                  <span>{{scope.row.code==='3'?'成功':scope.row.code==='1'?'发送中' : '失败'}}</span>
                </div>
              </template>
          </el-table-column>
          <el-table-column align="center" label="发送失败原因" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div>
                {{showSendFailReason(scope.row.code,scope.row.msg)}}
              </div>
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
    
     <!-- 发送短信 -->
    <el-dialog
      align:left
      width="40%"
      title="发送短信"
      :visible.sync="sendVisible"
      append-to-body>
      <div style="margin-left:20px;margin-bottom:5px;font-weight:bold;font-size:16px;">基本信息</div>
      <div style="border-bottom:1px solid #e8e8e8;margin-bottom:3px;margin-left:15px;margin-right:45px;"></div>
      <el-form size="small" :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="125px">
        <el-form-item
          prop="name"
          label="短信模板"
          :rules="{ required: true, message: '请选择短信模板', trigger: 'change' }">
          <el-input size="small" v-model="dynamicValidateForm.name" readonly="true" placeholder="请选择短信模板">
             <el-button slot="append" icon="el-icon-search"  @click.prevent="messageVisible=true;radio='';resetMessageReq();findTemplateList()"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="phoneNumbers" label="接收人号码" :rules="[{required: true, message: '接收人号码不能为空', trigger: 'blur'}]">
          <el-input v-model="dynamicValidateForm.phoneNumbers" type="textarea" :rows="3"></el-input>
        </el-form-item>
        <el-form-item>
          <span>说明：多个号码请用逗号隔开</span>
        </el-form-item>
        <el-form-item label="短信内容预览">
          <el-input type="textarea" :rows="4" v-model="msg_transfer" readonly></el-input>
        </el-form-item>
        <!-- <el-form-item v-show="showInputAndPreview && paramsArr.length > 0" v-for="item in paramsArr" :label="item" prop="text" :rules="{ required: true, message: '请填写变量值', trigger: 'change' }">
          <el-col :span="8">
            <el-input v-model="paramsValue[item]" @change="setPreview(item)"></el-input>
          </el-col>
        </el-form-item> -->
        <!-- <el-form-item
          prop="text"
          label="短信内容"
          :rules="{ required: true, message: '短信内容不能为空', trigger: 'blur' }">
          <el-input type="textarea" v-model="dynamicValidateForm.text" :rows="4" readonly></el-input>
        </el-form-item> -->
        <!-- <el-form-item v-show="showInputAndPreview && paramsArr.length > 0" v-for="item in paramsArr" :label="item" prop="text" :rules="{ required: true, message: '请填写变量值', trigger: 'change' }" >
          <el-input v-model="paramsValue[item]" @change="setPreview(item)"></el-input>
        </el-form-item> -->
      </el-form>
      <div v-show="showInputAndPreview && paramsArr.length > 0">
        <div style="margin-left:20px;margin-bottom:5px;font-weight:bold;font-size:16px;">填写变量</div>
        <div style="border-bottom:1px solid #e8e8e8;margin-bottom:3px;margin-left:15px;margin-right:45px;"></div>
        <el-row :gutter="20" style="margin-left:60px;">
          <el-col :span="10" :offset="1" v-for="item in paramsArr" :label="item" prop="text" :rules="{ required: true, message: '请填写变量值', trigger: 'change' }">
            <span style="color:#f56c6c;">* </span>{{item}}<br/>
            <el-input v-model="paramsValue[item]" @change="setPreview(item)" size="small" style="width:90%"></el-input>
          </el-col>
        </el-row>
      </div>
      <div style="text-align: right;margin-top: 5%;">
        <el-button type="primary" @click="validate('dynamicValidateForm')">发送</el-button>
        <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
      </div>
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
          <el-button @click="resetMessageReq();">重置</el-button>
        </el-form-item>
      </el-form>
       <!-- 表格 -->
      <el-row>
        <el-col>
          <el-table
            :data="messageTableData">
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
        <el-button type="primary" @click="selectedMessage()">确定</el-button>
        <el-button type="primary" plain @click="radio='';messageVisible=false">取消</el-button>
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
        <el-button type="primary" @click="sendMessage();">确定</el-button>
        <el-button type="primary" plain @click="send = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { messageSendRecords, findTemplateList, getAllTemplateGroup, sendMessage } from '@/api/message_send_list'
import { Message } from 'element-ui'
import { formatDateTime } from '@/utils/tools'
export default {
  name: 'message_template_manage',
  data() {
    return {
      formContainerOpen: '1',
      formContainer: this.$store.state.app.formContainer,
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
        // domains: [{
        //   value: ''
        // }],
        phoneNumbers: '',
        name: '',
        text: ''
      },
      paramsData: ['1'], // 这个tableData没用 只是为了控制input只显示一行
      paramsArr: [], // 变量数组
      paramsValue: [],
      paramsValue_beforeTransfer: [],
      msg_transfer: '',
      signName: '', // 签名
      showInputAndPreview: false // 途约-展示变量输入框和预览框
    }
  },
  mounted() {
    this.formContainer()
    this.handleChangeAcitve()
    this.messageSendRecords()
    this.getAllTemplateGroup()
  },
  methods: {
    render(tpl, data) {
      var re = /\${([^}]+)?}/
      var match = ''
      while (match = re.exec(tpl)) {
        tpl = tpl.replace(match[0], data[match[1]])
      }
      return tpl
    },
    // 展示发送失败原因
    showSendFailReason(code, msg) {
      if (code === '3') {
        // 发送成功
        return '无'
      } else if (code === '1') {
        return '发送中'
      } else {
        return msg
      }
    },
    setPreview(v) {
      const data = this.setData(v)
      this.msg_transfer = this.render(this.dynamicValidateForm.text, data)
    },
    setData(item) {
      var data = {}
      for (var i = 0; i < this.paramsArr.length; i++) {
        if (typeof (this.paramsValue[this.paramsArr[i]]) !== 'undefined') {
          data[this.paramsArr[i]] = this.paramsValue[this.paramsArr[i]]
        } else {
          data[this.paramsArr[i]] = ''
        }
      }
      return data
    },
    handleChangeAcitve(active = ['1']) {
      if (active.length) {
        $('.form-more').text('收起')
      } else {
        $('.form-more').text('更多')
      }
    },
    validate(item) {
      this.$refs[item].validate((valid) => {
        if (valid) {
          this.send = true
        } else {
          Message({
            message: '请检查是否填写正确',
            type: 'error',
            duration: 3 * 1000
          })
        }
        // if (this.dynamicValidateForm.domains && this.dynamicValidateForm.domains.length > 0 && this.dynamicValidateForm.domains[0].value) {
        //   if (valid) {
        //     this.send = true
        //   } else {
        //     Message({
        //       message: '请检查是否填写正确',
        //       type: 'error',
        //       duration: 3 * 1000
        //     })
        //   }
        // } else {
        //   Message({
        //     message: '请填写电话号码',
        //     type: 'error',
        //     duration: 3 * 1000
        //   })
        // }
      })
    },
    unique(arr) {
      var hash = []
      for (var i = 0; i < arr.length; i++) {
        for (var j = i + 1; j < arr.length; j++) {
          if (arr[i] === arr[j]) {
            ++i
          }
        }
        hash.push(arr[i])
      }
      return hash
    },
    sendMessage() {
      var sms = {}
      var phoneNumbers = []
      var param = {}
      // this.dynamicValidateForm.domains.forEach(element => {
      //   PhoneNumbers.push(element.value)
      // })
      // 将所有中文逗号转为英文逗号
      this.dynamicValidateForm.phoneNumbers = this.dynamicValidateForm.phoneNumbers.replace(/，/ig, ',')
      if (this.dynamicValidateForm.phoneNumbers.split(',').length > 0) {
        const reg_phone = /^[1][3,4,5,6,7,8][0-9]{9}$/
        phoneNumbers = this.dynamicValidateForm.phoneNumbers.split(',')
        for (var i = 0; i < phoneNumbers.length; i++) {
          if (phoneNumbers[i] === '') {
            phoneNumbers.splice(i, 1)
            continue
          }
          if (!reg_phone.test(phoneNumbers[i])) {
            this.$message.error('电话号码' + phoneNumbers[i] + '格式不正确！')
            this.send = false
            this.dynamicValidateForm.phoneNumbers = ''
            return
          }
        }
        // 去重
        phoneNumbers = this.unique(phoneNumbers)
      }
      if (this.paramsArr.length > 0) {
        for (var j = 0; j < this.paramsArr.length; j++) {
          if (typeof (this.paramsValue[this.paramsArr[j]]) === 'undefined' || this.paramsValue[this.paramsArr[j]] === '' || this.paramsValue[this.paramsArr[j]] === null) {
            this.$message.error('变量 ' + this.paramsArr[j] + '为必填项！')
            this.send = false
            return
          }
          param[this.paramsArr[j]] = this.paramsValue[this.paramsArr[j]]
        }
        sms.param = param
      }
      sms.sign_name = this.signName
      sms.phone_numbers = phoneNumbers
      sms.template_code = this.radio
      sms.template_name = this.dynamicValidateForm.name
      sms.content = this.msg_transfer
      console.log('发送短信参数为：', sms)
      sendMessage(sms).then(response => {
        if (response.data.code === 0) {
          Message({
            message: '发送成功！',
            type: 'success',
            duration: 3 * 1000
          })
          this.send = false
          this.sendVisible = false
          setTimeout(() => {
            this.messageSendRecords()
          }, 3000)
        } else {
          Message({
            message: response.data.message,
            type: 'error',
            duration: 3 * 1000
          })
          setTimeout(() => {
            this.messageSendRecords()
          }, 3000)
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
      // console.log('id:', id)
      // console.log('this.messageMap:', this.messageMap)
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
      this.showInputAndPreview = false
      this.paramsArr = []
      this.paramsValue = []
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
            const pattern = /(?<={).*?(?=})/g
            this.signName = element.autograph
            this.dynamicValidateForm.name = element.name
            this.dynamicValidateForm.text = element.content
            this.msg_transfer = this.dynamicValidateForm.text
            this.paramsArr = []
            this.paramsValue = []
            this.paramsValue_beforeTransfer = []
            this.dynamicValidateForm.phoneNumbers = ''
            // this.dynamicValidateForm.domains = []
            // this.addDomain()
            if (element.groupId === 1 && element.content.indexOf('${') !== -1) {
              // 判断是途约且包含变量
              this.showInputAndPreview = true
              // 第一种方法 正则截取变量
              this.paramsArr = element.content.match(pattern)
              // 第二种方法 stupid截取
              // const arr1 = element.content.split('${')
              // for (var i = 0; i < arr1.length; i++) {
              //   if (arr1[i].indexOf('}') !== -1) {
              //    this.paramsArr.push(arr1[i].split('}')[0])
              //   }
              // }
            } else {
              this.showInputAndPreview = false
            }
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
