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
           <el-form-item label="状态:">
            <el-select v-model="req.status" placeholder="选择状态">
              <el-option label="全部" value=""></el-option>
              <el-option label="失败" value="2"></el-option>
              <el-option label="成功" value="3"></el-option>
            </el-select>
          </el-form-item>
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
          <el-table-column align="center" label="工单状态" >
            <template slot-scope="scope">
              <div :class="scope.row.status==0?'create':scope.row.status==3?'visible':'invisible'">
                <span>{{showStatus(scope.row.status)}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
                prop="urgeCounts"
                label="催办状态"
                :render-header="showQuestion"
                align="center">
            <template slot-scope="scope">
              <el-badge   v-if="scope.row.urgeCounts==null||scope.row.urgeCounts==0" :hidden="scope.row.urgeCounts==null||scope.row.urgeCounts==0">
                <el-tag size="small" type="info">未催办</el-tag>
              </el-badge>
              <el-badge :value="scope.row.urgeCounts" class="badge_item" type="primary" v-else-if="scope.row.urgeCounts>0">
                <el-popover trigger="click">
                  <el-table :data="urgeList" >
                    <el-table-column
                      label="催办内容"
                      width="180"
                      prop="urgeContent"
                      :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column
                      label="催办人"
                      prop="creatorName"
                      :show-overflow-tooltip="true">
                      </el-table-column>
                    <el-table-column
                      label="催办时间"
                      width="180"
                      prop="createTime"
                      :show-overflow-tooltip="true">
                      </el-table-column>
                  </el-table>
                  <a slot="reference" @click="showUrgeList(scope.row.id)"><el-tag size="small" type="success" >已催办</el-tag></a>
                </el-popover>
              </el-badge>
              <el-badge v-else>
                <el-tag size="small">未知情况</el-tag>
              </el-badge>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="200">
            <template slot-scope="scope">
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
        <div v-for="(item, index) in workformRecordDetail.workformRecordRuleResults">
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
import { queryList, queryOne, reSendMsg, queryUrgeList } from '@/api/workform_record'
export default {
  name: 'workflow_done',
  data() {
    return {
      urgeList: [],
      WORKFLOW_AUTH: false,
      workformRecordDetail: {
        workform: {},
        workformRecordRuleResults: [
          {
            workformProperty: {}
          }
        ]
      }, // 工单记录详情
      editWorkformRecord: {
        status: 3
      }, // 修改工单记录
      editVisible: false, // 修改对话框显示隐藏
      pageShow: false, // 分页显示隐藏
      timeValue: null,
      // 查询 发送请求参数
      req: {
        name: '',
        modifierName: '',
        customerId: '',
        customerName: '',
        customerPhone: '',
        timeStart: null,
        timeEnd: null,
        isDeleted: '',
        status: '',
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
    this.WORKFLOW_AUTH = process.env.WORKFLOW_AUTH_STAFFNO.includes(localStorage.getItem('accountNo'))
    this.formContainer()
    this.handleChangeAcitve()
    this.queryList(this.req)
  },
  methods: {
    showQuestion(h, { column, $index }) {
      return (<span>催办状态&nbsp;<el-tooltip content='点击查看详情' placement='top'><i class='el-icon-question' /></el-tooltip></span>)
    },
    showUrgeList(workformRecordId) {
      const req = {}
      req.workformRecordId = workformRecordId
      queryUrgeList(req).then(res => {
        if (res.data.code === 0 && res.data.data) {
          this.urgeList = res.data.data
        } else {
          this.$message({
            message: res.data.message || '催办记录不完善',
            type: 'error',
            duration: 1000
          })
        }
      })
    },
    reSendMsg(id) {
      this.$confirm('确认重发短信？', '请确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        reSendMsg(id).then(res => {
          if (res.data && res.data.code === 0) {
            this.$message({
              message: res.data.message,
              type: 'success',
              duration: 1000
            })
          } else {
            this.$message({
              message: res.data.message || '未知错误',
              type: 'error',
              duration: 1000
            })
          }
        })
      })
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
    getWorkformRecordDetailById(id) {
      queryOne(id).then(res => {
        if (res.data.code === 0) {
          this.workformRecordDetail = res.data.data
        } else {
          console.log('未查到工单记录')
        }
      })
    },
    queryList(req) {
      if (!this.WORKFLOW_AUTH) {
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
      const arr_status = []
      if (req.status === '') {
        arr_status.push(2)
        arr_status.push(3)
      } else {
        arr_status.push(req.status)
      }
      requestParam.status = arr_status.join(',')
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
<style>
.badge_item {
  margin-top: 10px;
  margin-right: 5px;
}
</style>
