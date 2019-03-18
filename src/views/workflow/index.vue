<template>
  <div class="app-container">
    <div class="filter-container">
      <el-collapse v-model="formContainerOpen" class="form-container" @change="handleChangeAcitve">
        <el-collapse-item title="筛选条件" name="1">
          <el-form :inline="true" class="demo-form-inline" size="small">
            <el-form-item label="流程状态：">
              <el-select v-model="formInline.processType">
                <!-- <el-option label="所有情况" value=""></el-option> -->
                <!-- <el-option label="未开始" value="0"></el-option> -->
                <el-option label="进行中" value="0"></el-option>
                <el-option label="已结束" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="流程类型：">
              <el-select v-model="formInline.processStyle">
                <el-option
                  v-for="item in processNames"
                  :key="item.processName"
                  :label="item.processName"
                  :value="item.processName">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="formInline.pageNo = 1;findList(formInline)">查询</el-button>
              <el-button @click="reset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
      <el-row class="table-container">
        <el-row class="margin-bottom-20">
          <div class="font14 bold">工作流程表</div>
        </el-row>
        <el-row>
          <el-table
            :header-row-style="headerRow"
            :data="tableData"
            ref="multipleTable"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange">
            <el-table-column
              align="center"
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              align="center"
              prop="processName"
              label="流程名称"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <a :href="('/api/v1/workflow/queryOne?processId='+scope.row.processInstanceId)" target="_blank">{{ scope.row.startUserId + "的" + scope.row.processDefinitionName + "流程" }}</a>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="processDefinitionName"
              label="流程类别"
              :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
              align="center"
              prop="startTime"
              label="流程发起时间"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{ formatDateTime(scope.row.startTime) }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="startUserId"
              label="流程发起人"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{ scope.row.startUserId }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="laterTaskName"
              label="流程状态"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{ scope.row.laterTaskName }}
              </template>
            </el-table-column>
            
          </el-table>
        </el-row>
        <el-row style="margin-top:20px;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page='pagination.pageNo'
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size='pagination.pageSize'
            layout="total, sizes, prev, pager, next, jumper "
            :total='pagination.totalCount' style="text-align: right;float:right;">
          </el-pagination>
        </el-row>
      </el-row>
     
     </div>
   </div>
</template>

<script>
import {
  findList,
  listDetail,
  queryStyle,
  queryOne

} from '@/api/workflow'
// import { getStaffNameByAgentId } from '@/api/employee_list'
// import { Message, MessageBox } from 'element-ui'
import { formatDateTime } from '@/utils/tools'

export default {
  name: 'account_list',
  data() {
    return {
      formContainerOpen: '1',
      formContainer: this.$store.state.app.formContainer,
      pagination: {
        pageSize: null,
        pageNo: null,
        totalCount: null,
        totalPage: null
      },
      tableData: [],
      multipleSelection: [],
      formInline: {
        userId: '',
        pageNo: 1,
        processType: '',
        pageSize: 10,
        processStyle: ''
      },
      processNames: []// 流程类型名称

    }
  },
  mounted() {
    this.formContainer()
    this.handleChangeAcitve()
    this.findList(this.formInline)
    queryStyle().then(res => {
      if (res.data) {
        const list = res.data
        const arr = []
        for (let i = 0; i < list.length; i++) {
          const temp = {}
          temp.processName = list[i]
          arr.push(temp)
        }
        this.processNames = arr
      }
    })
  },
  methods: {
    handleChangeAcitve(active = ['1']) {
      if (active.length) {
        $('.form-more').text('收起')
      } else {
        $('.form-more').text('更多')
      }
    },
    // showName(id) {
    //   getStaffNameByAgentId({ 'agentId': id }).then(res => {
    //     console.log(res)
    //   })
    // },
    listDetail(req) {
      listDetail(req).then(res => {

      })
    },
    formatDateTime(time) {
      return formatDateTime(time)
    },
    findList(req) {
      this.tableData = []
      const requestParam = {}
      requestParam.pageNo = req.pageNo ? req.pageNo : 1
      requestParam.pageSize = req.pageSize ? req.pageSize : 10
      requestParam.userId = localStorage.getItem('agentId') ? localStorage.getItem('agentId') : ''
      // requestParam.userId = localStorage.getItem('agentId') ? 10001 : ''
      requestParam.processType = req.processType ? req.processType : 0
      requestParam.processStyle = req.processStyle ? req.processStyle : ''
      findList(requestParam).then(res => {
        if (res.status === 200 && res.data) {
          this.tableData = res.data.processInfo
          this.pagination = res.data.pageInfo
        }
      })
    },
    reset() {
      this.formInline = {
        processType: '',
        processStyle: '',
        pageNo: this.pagination.pageNo,
        pageSize: this.pagination.pageSize
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSizeChange(val) {
      this.pagination.pageNo = 1
      this.formInline.pageSize = val
      this.findList(this.formInline)
    },
    handleCurrentChange(val) {
      this.formInline.pageNo = val
      this.findList(this.formInline)
    },
    headerRow({ row, rowIndex }) {
      if (rowIndex === 0) {
        return 'color:black'
      } else {
        return ''
      }
    }
  },
  created() {

  }
}
</script>
<style>
.el-checkbox + .el-checkbox {
  margin-left: 0px;
}
.el-checkbox__label {
  padding-left: 0px;
}
.reverse {
  width: 70%;
}
</style>
