<template>
  <div class="container">
    <el-collapse v-model="formContainerOpen" class="form-container" @change="handleChangeAcitve">
      <el-collapse-item title="筛选条件" name="1">
        <el-form :inline="true" size="small" :model="req" ref="searchForm">
          <el-form-item prop="name" label="工单名称:">
            <el-input v-model="req.name" placeholder="工单名称（限长50字符）" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item prop="customerName" label="客户名称:">
            <el-input v-model="req.customerName" placeholder="客户名称" maxlength="50"></el-input>
          </el-form-item>
           <!-- <el-form-item label="状态:">
            <el-select v-model="req.status" placeholder="选择状态">
              <el-option label="全部" value=""></el-option>
              <el-option label="初始化" value="0"></el-option>
              <el-option label="执行中" value="1"></el-option>
              <el-option label="失败" value="2"></el-option>
              <el-option label="成功" value="3"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item  prop="modifierName" label="操作人:">
            <el-input v-model="req.modifierName" placeholder="操作人（限长45字符）" maxlength="45"></el-input>
          </el-form-item>
          <el-form-item label="操作时间：">
            <el-date-picker
              v-model.trim="timeValue"
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="req.pageNo=1;queryList(req);">查询</el-button>
            <el-button @click="resetReq();">重置</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <!-- 表格 -->
    <el-row class="table-container">
      <el-row class="margin-bottom-20">
        <div class="font14 bold">工单记录表</div>
      </el-row>
      <el-row>
        <el-table
          :data="tableData">
          <el-table-column
            align="center"
            label="名称"
            prop="name"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            align="center"
            label="工单号"
            prop="code"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            align="center"
            label="客户名称"
            prop="customerName"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            align="center"
            label="服务目录"
            prop="serviceMenu"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{scope.row.serviceMenu?scope.row.serviceMenu.namePath:"未找到关联的服务目录"}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="参照模板"
            prop="workform"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{scope.row.workform.name}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作人" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{(scope.row.modifierName == null) ? '无':scope.row.modifierName}}
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
              <div :class="scope.row.status==0?'create':scope.row.status==3?'visible':'invisible'">
                <span>{{showStatus(scope.row.status)}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="200">
            <template slot-scope="scope">
              <el-button @click="editVisible=true;saveEditInfo(scope.row);queryWorkformRecordInfo(scope.row);" type="text" size="small">办理</el-button>
              <el-button @click="detailVisible=true;getWorkformRecordDetailById(scope.row.id);" type="text" size="small">详情</el-button>
              <el-button @click="reSendMsg(scope.row.id);" type="text" size="small">重发短信</el-button>
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
    <!-- 修改工单记录状态 -->
    <el-dialog
      align:left
      :width="showConfirmInfo?'60%':'40%'"
      title="办理工单"
      :visible.sync="editVisible"
      append-to-body
      @close="resetEditReq">
      <el-form size="small"  :model="editWorkformRecord" ref="editWorkformRecord" label-width="100px">
        <div style="margin-bottom:5px;font-weight:bold;font-size:16px;">表单信息</div>
        <div style="border-bottom:1px solid #e8e8e8;margin-bottom:3px;"></div>
        <el-row >
          <el-col :span=12>
            <el-form-item label-width="120px" label="名称：" prop="name">
              <span>{{editWorkformRecord.name}}</span>
            </el-form-item>
          </el-col>
          <el-col
            :span="item.dataType=='textarea'?24:12"
            v-for="(item,index) in editWorkformRecord.workformRecordRuleResults">
            <el-form
              label-position="right"
              :model="editWorkformRecord.workformRecordRuleResults[index]"
              size="small"
              ref="workform">
              <el-input v-model="editWorkformRecord.workformRecordRuleResults[index].id" :value="item.id" style="display:none;"></el-input>
              <el-form-item label-width="120px" prop="recordValue" v-if="item.workformProperty.propertyUsage===1"  :rules="workFormRules(item.workformProperty)" :label="item.workformProperty.name+'：'" :key="index">
                <!-- input 和 textarea -->
                <el-input
                  v-if="item.workformProperty.dataType=='input'||item.workformProperty.dataType=='textarea'||item.workformProperty.dataType=='inputnumber'"
                  :type="item.workformProperty.dataType=='textarea'?'textarea':item.workformProperty.dataType=='inputnumber'?'number':''"
                  :placeholder="item.workformProperty.placeholder"
                  v-model="editWorkformRecord.workformRecordRuleResults[index].recordValue"
                  :value="item.recordValue"
                ></el-input>
                <!-- radio -->
                <el-radio-group
                  v-if="item.workformProperty.dataType=='radio'"
                  :placeholder="item.workformProperty.placeholder"
                  v-model="editWorkformRecord.workformRecordRuleResults[index].recordValue"
                  :value="item.recordValue">
                  <el-radio
                    v-for="(item2,index2) in JSON.parse(item.workformProperty.dataValues)"
                    :label="index2"
                    :key="index2">
                    </el-radio>
                </el-radio-group>
                <!-- select -->
                <el-select
                  v-if="item.workformProperty.dataType=='select'||item.workformProperty.dataType=='multipleSelect'"
                  :multiple="item.workformProperty.dataType=='multipleSelect'?true:false"
                  :placeholder="item.workformProperty.placeholder"
                  v-model="editWorkformRecord.workformRecordRuleResults[index].recordValue">
                  <el-option
                    v-for="(item2,index2) in JSON.parse(item.workformProperty.dataValues)"
                    :label="item2"
                    :key="index2"
                    :value="index2">
                  </el-option>
                </el-select>
                <!-- checkbox -->
                <el-checkbox-group
                  v-if="item.workformProperty.dataType=='checkbox'"
                  :placeholder="item.workformProperty.placeholder"
                  v-model="editWorkformRecord.workformRecordRuleResults[index].recordValue">
                  <el-checkbox
                    v-for="(item2,index2) in JSON.parse(item.workformProperty.dataValues)"
                    :label="index2"
                    :key="index2">
                  </el-checkbox>
                </el-checkbox-group>
                <!-- date 和 datetime -->
                <el-date-picker
                  v-if="item.workformProperty.dataType=='date'||item.workformProperty.dataType=='datetime'"
                  :type="item.workformProperty.dataType"
                  :placeholder="item.workformProperty.placeholder"
                  :value-format="item.workformProperty.formatValue"
                  v-model="editWorkformRecord.workformRecordRuleResults[index].recordValue">{{item.recordValue}}
                </el-date-picker>
                <!-- time -->
                <el-time-picker
                  v-if="item.workformProperty.dataType=='time'"
                  :placeholder="item.workformProperty.placeholder"
                  :value-format="item.workformProperty.formatValue"
                  v-model="editWorkformRecord.workformRecordRuleResults[index].recordValue">{{item.recordValue}}
                </el-time-picker>
                <!-- span -->
                <span v-if="item.workformProperty.dataType=='span'" style="color:#666666;">{{item.defaultValue}}</span>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <div style="margin-bottom:5px;font-weight:bold;font-size:16px;">办理</div>
        <div style="border-bottom:1px solid #e8e8e8;margin-bottom:3px;"></div>
        <el-row>
          <el-col>
            <el-form >
              <el-form-item label="状态：" label-width="120px" prop="status" >
                <el-switch
                v-model="editWorkformRecord.status"
                active-text="成功"
                inactive-text="失败"
                active-color="#67C23A"
                :active-value=3
                :inactive-value=2
                ></el-switch>
              </el-form-item>
              <el-form-item label="意见：" label-width="120px" prop="reasonForStatus" >
                <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" style="resize:vertical;" maxlength="512"  v-model="editWorkformRecord.reasonForStatus">{{editWorkformRecord.reasonForStatus}}</el-input>
              </el-form-item>
              <el-form-item label-width="120px" >
                <el-checkbox v-model="sendMessage" checked="checked" @change="checkMsg">发送短信</el-checkbox>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" style="text-align: right;">
        <el-button type="primary" @click="submitEditWorkformRecord(editWorkformRecord)">确定</el-button>
        <el-button @click="getWorkformRecordById(delReq.id);">重置</el-button>
        <el-button type="primary" plain @click="editVisible = false;resetEditReq()">取消</el-button>
      </div>
    </el-dialog>
    <!-- 工单记录详情 -->
    <el-dialog 
      align:left
      width="50%"
      title="工单详情"
      :visible.sync="detailVisible"
      append-to-body>
      <el-form size="small" :model="workformRecordDetail" ref="workformRecordDetail" label-width="100px">
        <el-row style="margin-bottom:5px;">
          <el-col :span="24">
            <div class="font14 bold">基本信息</div>
          </el-col>
        </el-row>
        <el-row style="margin-bottom:10px;">
          <div style="border-bottom:solid #e8e8e8 1px;"></div>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称：" prop="name" >
              <div style="with:95%;overflow:auto;">{{workformRecordDetail.name}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工单号：" prop="code" >
              <div style="with:95%;overflow:auto;">{{workformRecordDetail.code}}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="客户名称：" prop="customerName">
              <span>{{workformRecordDetail.customerName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户手机：" prop="customerPhone">
              <span>{{workformRecordDetail.customerPhone}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="服务目录：" prop="serviceMenu">
              <div style="display:inline-block;text-align:center;" >{{workformRecordDetail.serviceMenu?workformRecordDetail.serviceMenu.namePath:""}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="执行状态：" prop="status">
              <div style="display:inline-block;text-align:center;" :class="workformRecordDetail.status==0?'create':workformRecordDetail.status==3?'visible':'invisible'">{{showStatus(workformRecordDetail.status)}}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作人：" prop="modifierName">
              <span>{{workformRecordDetail.modifierName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作时间：" prop="modifyTime">
              <span>{{workformRecordDetail.modifyTime}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="意见：" prop="reasonForStatus">
              <span>{{workformRecordDetail.reasonForStatus}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom:5px;">
          <el-col :span="24">
            <div class="font14 bold">详细信息</div>
          </el-col>
        </el-row>
        <el-row style="margin-bottom:10px;">
          <div style="border-bottom:solid #e8e8e8 1px;"></div>
        </el-row>
        <div v-for="(item, index) in workformRecordDetail.workformRecordRuleResults" v-if="item.workformProperty">
          <el-col :span="12">
            <el-form-item :label="item.workformProperty.name+'：'" label-width="180px;">
              <span>{{showValues(item)}}</span>
            </el-form-item>
          </el-col>
        </div>
      </el-form>
      <div slot="footer" style="text-align: right;">
        <el-button type="primary" plain @click="detailVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { queryList, queryOne, updateWorkformRecord, reSendMsg } from '@/api/workform_record'
export default {
  name: 'workflow_todo',
  data() {
    return {
      showConfirmInfo: false, // 展示待确认信息
      sendMessage: true, // 默认修改工单发送短信
      workformInfo: {}, // 工单模板信息
      WORKFLOW_AUTH_STAFFNO: false, // 默认没有权限查询
      delReq: {// 修改详情暂存id
        id: null,
        workformId: null
      },
      workformRecordDetail: {
        workform: {},
        workformRecordRuleResults: [

        ]
      }, // 工单记录详情
      editWorkformRecord: {
        status: 3
      },
      // 修改工单记录
      editVisible: false, // 修改对话框显示隐藏

      pageShow: false, // 分页显示隐藏
      timeValue: null,
      // 查询 发送请求参数
      req: {
        name: '',
        modifierName: '',
        timeStart: null,
        timeEnd: null,
        isDeleted: '',
        pageNo: 1,
        pageSize: 10
      },
      formContainerOpen: '1',
      formContainer: this.$store.state.app.formContainer,
      detailVisible: false, // 是否显示详情页
      pageInfo: {}, // 分页数据
      tableData: [] // 表格数据
    }
  },
  mounted() {
    this.WORKFLOW_AUTH_STAFFNO = (process.env.WORKFLOW_AUTH_STAFFNO === parseInt(localStorage.getItem('accountNo')))
    this.formContainer()
    this.handleChangeAcitve()
    this.queryList(this.req)
  },
  methods: {
    reSendMsg(id) {
      if (window.confirm('确认为这条工单重新发送短信？')) {
        reSendMsg(id).then(res => {
          if (res.data && res.data.code === 0) {
            this.$message({
              message: res.data.message,
              type: 'success',
              duration: 1000
            })
          } else {
            this.$message({
              message: res.data.message,
              type: 'error',
              duration: 1000
            })
          }
        })
      }
    },
    resetEditReq() {
      const fields = this.$refs['workform']
      if (fields.length > 0) {
        for (let i = 0; i < fields.length; i++) {
          fields[i].resetFields()
        }
      }
      this.editWorkformRecord = {
        status: 3
      }
    },
    checkMsg(val) {
      this.sendMessage = val
      if (!val) {
        if (window.confirm('确定不需要发送短信？')) {
          return
        } else {
          this.sendMessage = !val
        }
      }
    },
    queryWorkformRecordInfo(info) {
      const id = info.id ? info.id : null
      if (id == null) {
        this.$message({
          message: '该条记录id为空！',
          type: 'error',
          duration: 1000
        })
      }
      this.getWorkformRecordById(id)
    },
    saveEditInfo(info) {
      this.delReq.id = info.id ? info.id : null
      this.delReq.workformId = info.workform ? info.workform.id : null
      this.delReq.workServiceMenuId = info.serviceMenu ? info.serviceMenu.id : null
    },
    // 展示多选类表单对应值的label
    showSelectValue(type, options, val) {
      const obj = JSON.parse(options)
      const arr = []
      let val2
      if (type === 'multipleSelect' || type === 'checkbox') val2 = JSON.parse(val)
      let result
      if (val2 !== undefined && val2.length) {
        for (var key in obj) {
          val2.forEach(item => {
            if (key === item) arr.push(obj[key])
          })
        }
        return arr.join(',')
      } else {
        for (var key2 in obj) {
          if (key2 === val) result = obj[key2]
        }
        return result
      }
    },
    workFormRules(formInfo) {
      const regex = new RegExp(formInfo.regex)
      if (formInfo.isRequired && formInfo.regex) {
        return [
          { required: true, message: '请输入内容', trigger: 'blur' },
          { pattern: regex, message: '请输入正确的内容', trigger: 'blur' }
        ]
      } else if (formInfo.isRequired && !formInfo.regex) {
        return [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      } else if (!formInfo.isRequired && formInfo.regex) {
        return [
          { pattern: regex, message: '请输入正确的内容', trigger: 'blur' }
        ]
      } else {
        return []
      }
    },
    showValues(workformRecordRuleResult) {
      let result = ''
      const dataType = workformRecordRuleResult.workformProperty.dataType
      const arr = workformRecordRuleResult.recordValue
      switch (dataType) {
        case 'input':
        case 'datetime':
        case 'date':
        case 'time':
        case 'span':
        case 'inputnumber':
        case 'textarea':
          result = arr || workformRecordRuleResult.workformProperty.defaultValue
          break
        case 'radio':
        case 'select':
          result = arr ? JSON.parse(workformRecordRuleResult.workformProperty.dataValues)[arr] : ''
          break
        case 'checkbox':
        case 'multipleSelect':
          if (arr) {
            const temp_arr = arr.split(',')
            const temp_result = []
            const dataValues = JSON.parse(workformRecordRuleResult.workformProperty.dataValues)
            for (let i = 0; i < temp_arr.length; i++) {
              if (dataValues[temp_arr[i]]) {
                temp_result.push(dataValues[temp_arr[i]])
              }
            }

            result = temp_result.join('，')
          } else {
            result = ''
          }
          break
        default:
          result = arr
          break
      }
      return result == null ? '' : result
    },
    validateForm(formName) {
      const forms = this.$refs[formName]
      const workformVali = []
      if (forms) {
        for (let i = 0; i < forms.length; i++) {
          forms[i].validate((valid) => {
            if (valid) {
              workformVali.push(true)
            } else {
              workformVali.push(false)
            }
          })
        }
      }
      return workformVali.includes(false)
    },
    submitEditWorkformRecord(obj) {
      if (!this.WORKFLOW_AUTH_STAFFNO) {
        this.$message({
          message: '您没有修改权限',
          type: 'error',
          duration: 1000
        })
        return
      }
      if (this.validateForm('workform')) {
        this.$message({
          message: '请将工单填写完整',
          type: 'error',
          duration: 1000
        })
        return
      }
      const req = {}
      req.id = this.delReq.id
      req.name = obj.name
      req.workformId = obj.workform.id
      req.customerId = obj.customerId
      req.customerName = obj.customerName
      req.customerPhone = obj.customerPhone
      req.status = obj.status
      req.reasonForStatus = obj.reasonForStatus
      req.isDeleted = obj.isDeleted
      req.description = obj.description
      req.workServiceMenuId = obj.serviceMenu.id
      req.modifierName = localStorage.getItem('agentName')
      req.modifierId = localStorage.getItem('agentId')
      req.sendMessage = this.sendMessage
      const workformRecordRuleUpdateInfos = []
      const workformRecordRuleResults = obj.workformRecordRuleResults
      if (workformRecordRuleResults && workformRecordRuleResults.length > 0) {
        for (let i = 0; i < workformRecordRuleResults.length; i++) {
          const workformRecordRuleUpdateInfo = {}
          workformRecordRuleUpdateInfo.id = workformRecordRuleResults[i].id
          workformRecordRuleUpdateInfo.recordValue = workformRecordRuleResults[i].recordValue
          workformRecordRuleUpdateInfo.workformProperty = workformRecordRuleResults[i].workformProperty.id
          workformRecordRuleUpdateInfos.push(workformRecordRuleUpdateInfo)
        }
        req.workformRecordRuleUpdateInfos = workformRecordRuleUpdateInfos
      }
      updateWorkformRecord(req).then(res => {
        if (res.data.code === 0) {
          this.editVisible = false
          this.resetEditReq()
          this.queryList(this.req)
        } else {
          this.$message({
            message: res.data.message || '修改失败',
            type: 'error',
            duration: 1000
          })
        }
      })
    },
    getWorkformRecordDetailById(id) {
      queryOne(id).then(res => {
        if (res.data.code === 0) {
          this.workformRecordDetail = res.data.data
        } else {
          this.$message({
            message: res.data.message,
            type: 'error',
            duration: 1000
          })
        }
      })
    },
    getWorkformRecordById(id) {
      queryOne(id).then(res => {
        if (res.data.code === 0) {
          this.editWorkformRecord = res.data.data
          this.editWorkformRecord.status = this.editWorkformRecord.status === 2 ? 2 : 3// 如果是失败，则为失败，其他都算默认成功
          // 多选，下拉框多选赋值
          const workformRecordRuleResults = this.editWorkformRecord.workformRecordRuleResults
          this.showConfirmInfo = false
          if (workformRecordRuleResults && workformRecordRuleResults.length > 0) {
            for (let i = 0; i < workformRecordRuleResults.length; i++) {
              if (workformRecordRuleResults[i].workformProperty && (workformRecordRuleResults[i].workformProperty.dataType === 'checkbox' || workformRecordRuleResults[i].workformProperty.dataType === 'multipleSelect')) {
                this.editWorkformRecord.workformRecordRuleResults[i].recordValue = this.editWorkformRecord.workformRecordRuleResults[i].recordValue.split(',')
              }
              if (workformRecordRuleResults[i].workformProperty && workformRecordRuleResults[i].workformProperty.propertyUsage === 1) {
                this.showConfirmInfo = true
              }
            }
          }
        } else {
          this.$message({
            message: res.data.message,
            type: 'error',
            duration: 1000
          })
        }
      })
    },
    queryList(req) {
      if (!this.WORKFLOW_AUTH_STAFFNO) {
        this.tableData = []
        this.pageInfo = {}
        this.pageShow = false
        return
      }
      const requestParam = {}
      requestParam.pageNo = req.pageNo
      requestParam.pageSize = req.pageSize
      requestParam.timeStart = this.timeValue ? this.timeValue[0] : null
      requestParam.timeEnd = this.timeValue ? this.timeValue[1] : null
      requestParam.status = 0
      requestParam.name = req.name ? req.name : null
      requestParam.customerId = req.customerId ? req.customerId : null
      requestParam.customerName = req.customerName ? req.customerName : null
      requestParam.customerPhone = req.customerPhone ? req.customerPhone : null
      requestParam.modifierName = req.modifierName ? req.modifierName : null
      queryList(requestParam).then(res => {
        if (res.data.code === 0) {
          this.tableData = res.data.data
          this.pageShow = true
          this.pageInfo = res.data.pageInfo
        } else {
          this.tableData = []
          this.pageInfo = {}
          this.pageShow = false
        }
      })
    },
    showStatus(status) {
      let str = ''
      switch (status) {
        case 0:
          str = '初始化'
          break
        case 1:
          str = '执行中'
          break
        case 2:
          str = '失败'
          break
        case 3:
          str = '成功'
          break
        default:
          str = '初始化'
          break
      }
      return str
    },
    handleChangeAcitve(active = ['1']) {
      if (active.length) {
        $('.form-more').text('收起')
      } else {
        $('.form-more').text('更多')
      }
    },
    resetReq() {
      this.req = {
        name: '',
        modifierName: '',
        timeStart: null,
        timeEnd: null,
        isDeleted: '',
        status: '',
        pageNo: this.pageInfo.pageNo,
        pageSize: this.pageInfo.pageSize
      }
      this.timeValue = null
    },
    // 页面显示条数
    handleSizeChange(val) {
      this.req.pageSize = val
      this.req.pageNo = 1
      this.pageInfo.pageNo = 1
      this.queryList(this.req)
    },
    // 分页翻页功能
    handleCurrentChange(val) {
      this.req.pageNo = val
      this.queryList(this.req)
    }
  }
}
</script>
