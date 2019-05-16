<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-form :inline="true" class="demo-form-inline" size="small">
          <el-form-item label="活动名称:">
            <el-select v-model="formInline.campaignId" placeholder="活动名称">
              <el-option value="" label="所有活动"></el-option>
              <el-option v-for="item in activeNameList" :key="item.campaignId" :label="item.campaignName" :value="item.campaignId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收到名单时间：">
            <el-date-picker
              v-model="receiveTimeValue"
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="小组名称:">
            <el-select v-model="formInline.organId" placeholder="小组">
              <el-option value="" label="所有小组"></el-option>
              <el-option v-for="item in organList" :key="item.departName" :label="item.departName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search(formInline)">查询</el-button>
            <el-button type="danger" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :header-row-style="headerRow"
          :data="tableData"
          tooltip-effect="dark"
          border>
          <el-table-column
            align="center"
            prop="departName"
            label="部门名"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.departName }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="campaignName"
            label="活动名称"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.campaignName }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="totalNum"
            label="总量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="assignedNum"
            label="分配量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="noAssignedNum"
            label="待分配量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="noContactNum"
            label="首拨量">
          </el-table-column>
          <el-table-column
            prop="appiontNum"
            align="center"
            label="预约量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="successNum"
            label="成功量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="failNum"
            label="失败量">
          </el-table-column>
        </el-table>
      </el-row>
    </div>
  </div>
</template>

<script>
  import { getListUsingByOrganId } from '@/api/monitor_list_group'
  import { Message } from 'element-ui'
  import { findCampaignByUser, getDownInfoByCurrentUser } from '@/api/monitor_list_single'

  export default {
    name: 'monitor_list_group',
    data() {
      return {
        organListId: [],
        campaignIdList: [],
        departs: '',
        receiveTimeValue: '',
        tableData: [],
        organList: [],
        activeNameList: [],
        formInline: {
          starttime: '',
          endtime: '',
          campaignId: '',
          organId: ''
        }
      }
    },
    methods: {
      headerRow({ row, rowIndex }) {
        if (rowIndex === 0) {
          return 'color:black'
        } else {
          return ''
        }
      },
      queryStaff(res) {
        const campaignIds = this.activeNameList.map(function(item, index) {
          return item.campaignId
        })
        this.tableData = res.data.data
        if (this.tableData && this.tableData.length !== 0) {
          for (let i = 0; i <= this.tableData.length; i++) {
            if (this.tableData[i] && (campaignIds.indexOf(this.tableData[i].campaignId) !== -1)) {
              this.tableData[i].campaignName = this.activeNameList[campaignIds.indexOf(this.tableData[i].campaignId)].campaignName
            }
            if (this.tableData[i] && (this.organListId.indexOf(Number(this.tableData[i].departId)) !== -1)) {
              this.tableData[i].departName = this.organList[this.organListId.indexOf(Number(this.tableData[i].departId))].departName
            }
          }
        }
      },
      search(req) {
        getListUsingByOrganId({
          starttime: this.receiveTimeValue ? this.receiveTimeValue[0] : '',
          endtime: this.receiveTimeValue ? this.receiveTimeValue[1] : '',
          campaignId: req.campaignId ? req.campaignId : this.campaignIdList.join(','),
          organId: req.organId ? req.organId : this.organListId.join(',')
        }).then(res => {
          this.queryStaff(res)
        })
      },
      reset() {
        this.receiveTimeValue = ''
        this.formInline = {
          starttime: '',
          endtime: '',
          campaignId: '',
          organId: ''
        }
      }
    },
    created() {
      new Promise((resolve, reject) => {
        findCampaignByUser().then(response => {
          this.activeNameList = response.data.data
          resolve(response.data.data)
        })
      }).then(activeNameList => {
        this.campaignIdList = activeNameList.map(function(item, index) {
          return item.campaignId
        })
        getDownInfoByCurrentUser().then(response => {
          this.organList = response.data.data
          this.organListId = response.data.data.map(function(item, index) {
            return item.id
          })
          this.search({
            starttime: '',
            endtime: '',
            campaignId: this.campaignIdList.join(','),
            organId: this.organListId.join(',')
          })
        })
      })
    }
  }
</script>
