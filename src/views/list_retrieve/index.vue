<template>
  <div class="app-container">
    <div class="filter-container">
      <el-collapse v-model="formContainerOpen" class="form-container" @change="handleChangeAcitve">
        <el-collapse-item title="筛选条件" name="1">
          <el-form :inline="true" class="demo-form-inline" size="small">
            <el-form-item label="活动名称:">
              <el-select v-model="formInline.campaignId" @change="selectActive">
                <el-option value="" label="请选择活动"></el-option>
                <el-option v-for="item in activeNameList" :key="item.campaignId" :label="item.campaignName" :value="item.campaignId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="loading" @click="confirm(formInline)">确认回收</el-button>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
      <el-row class="table-container margin-bottom-15">
        <el-row class="margin-bottom-20">
          <div class="font14 bold">名单表</div>
        </el-row>
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
            prop="listId"
            :show-overflow-tooltip="true"
            label="名单编号">
          </el-table-column>
          <el-table-column
            align="center"
            prop="listName"
            label="名单名称"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.listName }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="useNum"
            label="名单分配数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="totalNum"
            label="名单总数量">
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
            label="操作时间"
            width="155">
          </el-table-column>
        </el-table>
        <el-row style="margin-top:20px;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="pagination.pageNo"
            :page-size="pagination.pageSize"
            :page-sizes="[10, 20, 30, 40, 50]"
            layout="total, sizes, prev, pager, next, jumper "
            :total="pagination.totalCount" style="text-align: right">
          </el-pagination>
        </el-row>      
      </el-row>
      <el-row 
        class="table-container" 
        v-show="type===0">
        <el-row class="margin-bottom-20">
          <div class="font14 bold">下属表</div>
        </el-row>
        <el-table
          :header-row-style="headerRow"
          :data="tableData2"
          ref="multipleTable"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange2">
          <el-table-column
            align="center"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            align="center"
            prop="departName"
            label="回收对象"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.departName }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="noUseNum"
            label="可回收数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="noUseNum"
            label="未分配数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="totalNum"
            label="总数量">
          </el-table-column>
          <el-table-column
            align="center"
            label="本次回收数量">
            <template slot-scope="scope">
              <el-input size="small" v-model="tableData2[scope.$index].num" @change="handleChange1(scope.row)"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row 
        class="table-container"
        v-show="type===1">
        <el-row class="margin-bottom-20">
          <div class="font14 bold">下属表</div>
        </el-row>
        <el-table
          :header-row-style="headerRow"
          :data="tableData2"
          ref="multipleTable"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange2">
          <el-table-column
            align="center"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            align="center"
            prop="departName"
            label="回收对象"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.departName }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="recycleNum"
            label="可回收数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="noContactNum"
            label="首拨数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="appointNum"
            label="预约数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="totalNum"
            label="总数量">
          </el-table-column>
          <el-table-column
            align="center"
            label="本次回收数量">
            <template slot-scope="scope">
              <el-input size="small" v-model="tableData2[scope.$index].num" @change="handleChange1(scope.row)"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </div>
  </div>
</template>

<script>
  import { findCampaignNameListAssignInfo } from '@/api/captain_list_newdistribute_group'
  import { findAssignDownNamelistInfoByCampaignAndDepart, recycleTaskInfo } from '@/api/captain_list_recycle_group'
  import { Message } from 'element-ui'
  import { findCampaignByUser, getDownInfoByCurrentUser } from '@/api/monitor_list_single'
  import { formatDateTime } from '@/utils/tools'

  export default {
    name: 'captain_list_recycle_group',
    data() {
      return {
        formContainerOpen: '1',
        formContainer: this.$store.state.app.formContainer,
        loading: false,
        type: '',
        totalNum: 0,
        multipleSelection2: [],
        multipleSelection: [],
        campaignIdList: [],
        tableData: [],
        tableData2: [],
        activeNameList: [],
        formInline: {
          campaignId: ''
          // useNum: 0
        },
        pagination: {
          pageNo: null,
          pageSize: null,
          totalCount: 0,
          totalPage: null
        },
        pageing: {
          campaignId: null,
          departId: localStorage.getItem('departId'),
          pageNo: 1,
          pageSize: 10
        }
      }
    },
    mounted() {
      this.formContainer()
      this.handleChangeAcitve()
    },
    methods: {
      handleChangeAcitve(active = ['1']) {
        if (active.length) {
          $('.form-more').text('收起')
        } else {
          $('.form-more').text('更多')
        }
      },
      selectActive(val) {
        this.tableData = []
        this.tableData2 = []
        this.pageing.campaignId = val
        if (!val) {
          Message({
            message: '请选择活动',
            type: 'error',
            duration: 3 * 1000
          })
          return
        }
        this.pageing.pageNo = 1
        this.pageing.pageSize = 10
        findCampaignNameListAssignInfo(this.pageing).then(response => {
          if (response.data.code === 0) {
            this.tableData = response.data.data
            this.pagination = response.data.pageInfo
            // 清除数据
            // this.handleChange()
            for (let i = 0; i <= this.tableData.length - 1; i++) {
              if (this.tableData[i]) {
                this.tableData[i].modifierTime = formatDateTime(this.tableData[i].modifierTime)
              }
            }
          } else {
            this.tableData = []
            this.tableData2 = []
            if (val) {
              Message({
                message: response.data.message,
                type: 'error',
                duration: 3 * 1000
              })
            }
          }
        })
      },
      handleSizeChange(val) {
        this.pageing.campaignId = this.formInline.campaignId
        this.pageing.pageSize = val
        this.pageing.pageNo = 1
        this.pagination.pageNo = 1
        findCampaignNameListAssignInfo(this.pageing).then(response => {
          if (response.data.code === 0) {
            this.tableData = response.data.data
            this.pagination = response.data.pageInfo
            for (let i = 0; i <= this.tableData.length; i++) {
              if (this.tableData[i]) {
                this.tableData[i].modifierTime = formatDateTime(this.tableData[i].modifierTime)
              }
            }
          } else {
            this.tableData = []
            this.tableData2 = []
            Message({
              message: response.data.message,
              type: 'error',
              duration: 3 * 1000
            })
          }
        })
      },
      handleCurrentChange(val) {
        this.pageing.campaignId = this.formInline.campaignId
        this.pageing.pageNo = val
        findCampaignNameListAssignInfo(this.pageing).then(response => {
          if (response.data.code === 0) {
            this.tableData = response.data.data
            this.pagination = response.data.pageInfo
            for (let i = 0; i <= this.tableData.length; i++) {
              if (this.tableData[i]) {
                this.tableData[i].modifierTime = formatDateTime(this.tableData[i].modifierTime)
              }
            }
          } else {
            this.tableData = []
            this.tableData2 = []
            Message({
              message: response.data.message,
              type: 'error',
              duration: 3 * 1000
            })
          }
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
        // this.formInline.useNum = 0
        // for (let i = 0; i <= val.length; i++) {
        //   if (val[i]) {
        //     this.formInline.useNum += Number(val[i].useNum)
        //   }
        // }
        if (val.length !== 0) {
          const listIds = val.map(function(item, index) {
            return item.listId
          })
          findAssignDownNamelistInfoByCampaignAndDepart({
            campaignId: this.formInline.campaignId,
            listIds: listIds.join(',')
          }).then(res => {
            if (res.data.code === 0) {
              this.tableData2 = res.data.data
              this.type = parseInt(res.data.type)
              for (let i = 0; i <= this.tableData2.length - 1; i++) {
                if (this.tableData2[i]) {
                  this.tableData2[i].num = ''
                  this.tableData2[i].recycleNum = parseInt(this.tableData2[i].noContactNum) + parseInt(this.tableData2[i].appointNum)
                  if (this.tableData2[i].staffName) {
                    this.tableData2[i].departName = this.tableData2[i].staffName
                  }
                }
              }
            } else {
              Message({
                message: res.data.message,
                type: 'error',
                duration: 3 * 1000
              })
            }
          })
        } else {
          this.tableData2 = []
        }
      },
      handleSelectionChange2(val) {
        this.multipleSelection2 = val
        console.log(val)
        this.handleChange1()
      },
      headerRow({ row, rowIndex }) {
        if (rowIndex === 0) {
          return 'color:black'
        } else {
          return ''
        }
      },
      handleChange1(value) {
        this.totalNum = 0
        for (let i = 0; i <= this.multipleSelection2.length - 1; i++) {
          if (this.multipleSelection2[i]) {
            this.totalNum += Number(this.multipleSelection2[i].num)
          }
        }
      },
      valiNum() {
        const data = []
        const listIds = this.multipleSelection.map(function(item, index) {
          return item.listId
        })
        for (let i = 0; i <= this.multipleSelection2.length - 1; i++) {
          const obj = {}
          if (this.multipleSelection2[i]) {
            if (this.multipleSelection2[i].departId) {
              obj[String(this.multipleSelection2[i].departId)] = this.multipleSelection2[i].num
            } else {
              obj[String(this.multipleSelection2[i].staffId)] = this.multipleSelection2[i].num
            }
            data.push(obj)
          }
        }
        recycleTaskInfo({
          listIds: listIds,
          campaignId: this.formInline.campaignId,
          data: data,
          type: String(this.type)
        }).then(response => {
          this.loading = false
          if (response.data.code === 0) {
            this.selectActive(this.formInline.campaignId)
          } else {
            Message({
              message: response.data.message,
              type: 'error',
              duration: 3 * 1000
            })
          }
        })
      },
      confirm() {
        if (this.multipleSelection.length === 0) {
          Message({
            message: '请选择名单',
            type: 'error',
            duration: 3 * 1000
          })
        } else if (this.multipleSelection2.length === 0) {
          Message({
            message: '请选择回收对象',
            type: 'error',
            duration: 3 * 1000
          })
        } else if (this.totalNum) {
          const self = this
          const boolArr = this.multipleSelection2.map(function(item, index) {
            if (self.type === 1) {
              return Number(item.recycleNum) >= Number(item.num)
            } else {
              return Number(item.noUseNum) >= Number(item.num)
            }
          })
          if (boolArr.indexOf(false) === -1) {
            this.loading = true
            this.valiNum()
          } else {
            Message({
              message: '回收量不能超过可回收量',
              type: 'error',
              duration: 3 * 1000
            })
          }
        } else {
          Message({
            message: '请输入合理的回收量',
            type: 'error',
            duration: 3 * 1000
          })
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
          if (response.data.code === 1) {
            this.type = response.data.type
          }
        })
      })
    }
  }
</script>
<style lang="scss" scoped>
/deep/ .el-table__row td:last-child .cell{
  padding-right:0;
}
</style>