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
          <el-form-item label="查询日期区间：">
            <el-date-picker
              v-model="searchTimeValue"
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="员工姓名:">
            <el-select v-model="formInline.agentId" placeholder="员工姓名">
              <el-option value="" label="所有员工"></el-option>
              <el-option v-for="item in staffNameList" :key="item.angentId" :label="item.realName" :value="item.angentId"></el-option>
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
            prop="staffName"
            label="员工姓名"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.staffName }}
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
            prop="departName"
            label="组织名"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.departName }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="totalNum"
            label="分配总量">
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
  import { findCampaignByUser, getListUsingByAgentid, getDownInfoByCurrentUser } from '@/api/monitor_list_single'
  import { Message } from 'element-ui'
  import { findAllOrganTo } from '@/api/organization_list'

  export default {
    name: 'monitor_list_single',
    data() {
      return {
        agentIdList: [],
        campaignIdList: [],
        departs: '',
        receiveTimeValue: '',
        searchTimeValue: '',
        tableData: [],
        staffNameList: [],
        activeNameList: [],
        formInline: {
          starttime: '',
          endtime: '',
          campaignId: '',
          agentId: '',
          modifyTimeEnd: '',
          modifyTimeStart: ''
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
        const departs = this.departs.map(function(item, index) {
          return item.id
        })
        this.tableData = res.data.data
        if (this.tableData && this.tableData.length !== 0) {
          for (let i = 0; i <= this.tableData.length; i++) {
            if (this.tableData[i] && (campaignIds.indexOf(this.tableData[i].campaignId) !== -1)) {
              this.tableData[i].campaignName = this.activeNameList[campaignIds.indexOf(this.tableData[i].campaignId)].campaignName
            }
            if (this.tableData[i] && (departs.indexOf(Number(this.tableData[i].departId)) !== -1)) {
              this.tableData[i].departName = this.departs[departs.indexOf(Number(this.tableData[i].departId))].departName
            }
          }
        } else {
          Message({
            message: '无查询结果，请核对查询条件',
            type: 'error',
            duration: 3 * 1000
          })
        }
      },
      search(req) {
        getListUsingByAgentid({
          starttime: this.receiveTimeValue ? this.receiveTimeValue[0] : '',
          endtime: this.receiveTimeValue ? this.receiveTimeValue[1] : '',
          campaignId: req.campaignId ? req.campaignId : this.campaignIdList.join(','),
          agentId: req.agentId ? req.agentId : this.agentIdList.join(','),
          modifyTimeEnd: this.searchTimeValue ? this.searchTimeValue[1] : '',
          modifyTimeStart: this.searchTimeValue ? this.searchTimeValue[0] : ''
        }).then(res => {
          this.queryStaff(res)
        })
      },
      reset() {
        this.receiveTimeValue = ''
        this.searchTimeValue = ''
        this.formInline = {
          starttime: '',
          endtime: '',
          campaignId: '',
          agentId: '',
          modifyTimeEnd: '',
          modifyTimeStart: ''
        }
      }
    },
    created() {
      findAllOrganTo().then(response => {
        if (response.data.code === 1) {
          this.departs = response.data.data
        }
      })
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
          this.staffNameList = response.data.data
          this.agentIdList = response.data.data.map(function(item, index) {
            return item.angentId
          })
          this.search({
            starttime: '',
            endtime: '',
            campaignId: this.campaignIdList.join(','),
            agentId: this.agentIdList.join(','),
            modifyTimeEnd: '',
            modifyTimeStart: ''
          })
        })
      })
    }
  }
</script>
