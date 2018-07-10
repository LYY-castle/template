<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-form :inline="true" class="demo-form-inline" size="small">
          <el-form-item>
            <el-select v-model="formInline.campaignId" placeholder="活动名称">
              <el-option value="" label="所有活动"></el-option>
              <el-option v-for="item in activeNameList" :key="item.campaignId" :label="item.campaignName" :value="item.campaignId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收到名单日期：">
            <el-date-picker
              v-model="receiveTimeValue"
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-select v-model="formInline.listId" placeholder="名单">
              <el-option value="" label="所有名单"></el-option>
              <el-option v-for="item in nameList" :key="item.listName" :label="item.listName" :value="item.listId"></el-option>
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
          border
          style="width: 94%;">
          <el-table-column
            width="55"
            align="center"
            type="index"
            label="序号">
          </el-table-column>
          <el-table-column
            align="center"
            prop="listId"
            label="名单编号">
          </el-table-column>
          <el-table-column
            align="center"
            prop="listName"
            label="名单名称">
          </el-table-column>
          <el-table-column
            align="center"
            prop="campaignName"
            label="活动名称">
          </el-table-column>
          <el-table-column
            align="center"
            prop="totalNum"
            label="名单总量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="assignedNum"
            label="已分配量">
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
  import { findAllNameList, contactFindAllNameList, getListUsingByListId } from '@/api/monitor_list'
  import { Message } from 'element-ui'
  import { findCampaignByUser } from '@/api/monitor_list_single'

  export default {
    name: 'monitor_list',
    data() {
      return {
        nameListName: [],
        contactList: [],
        nameListId: [],
        campaignIdList: [],
        departs: '',
        receiveTimeValue: '',
        tableData: [],
        nameList: [],
        activeNameList: [],
        formInline: {
          starttime: '',
          endtime: '',
          campaignId: '',
          listId: ''
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
            if (this.tableData[i] && (this.nameListId.indexOf(this.tableData[i].listId) !== -1)) {
              this.tableData[i].listName = this.nameListName[this.nameListId.indexOf(this.tableData[i].listId)].listName
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
        getListUsingByListId({
          starttime: this.receiveTimeValue ? this.receiveTimeValue[0] : '',
          endtime: this.receiveTimeValue ? this.receiveTimeValue[1] : '',
          campaignId: req.campaignId ? req.campaignId : this.campaignIdList.join(','),
          listId: req.listId ? req.listId : this.contactList.join(',')
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
          listId: ''
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
        findAllNameList().then(response => {
          this.nameListName = response.data.data
          this.nameListId = response.data.data.map(function(item, index) {
            return item.listId
          })
          contactFindAllNameList().then(res => {
            this.contactList = res.data.data
            if (this.contactList) {
              for (let i = 0; i <= this.contactList.length; i++) {
                if (this.contactList[i] && (this.nameListId.indexOf(this.contactList[i]) !== -1)) {
                  this.nameList.push(response.data.data[i])
                }
              }
              this.search({
                starttime: '',
                endtime: '',
                campaignId: this.campaignIdList.join(','),
                listId: this.contactList.join(',')
              })
            }
          })
        })
      })
    }
  }
</script>
