<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-form :inline="true" class="demo-form-inline" size="small">
          <el-form-item>
            <el-select v-model="formInline.campaignId" @change="selectActive">
              <el-option value="" label="请选择活动"></el-option>
              <el-option v-for="item in activeNameList" :key="item.campaignId" :label="item.campaignName" :value="item.campaignId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分配数量:">
            <el-input-number v-model="formInline.num" :step="10" @change="handleChange"></el-input-number>
            <span>未分配量：{{formInline.noUseNum}}</span>
            <span>数量总计：{{formInline.totalNum}}</span>
          </el-form-item>
          <el-form-item label="分配方式:">
            <el-radio v-model="formInline.radio" label="0">顺序分配</el-radio>
            <el-radio v-model="formInline.radio" label="1">平均分配</el-radio>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="confirm(formInline)">确认分配</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :header-row-style="headerRow"
          :data="tableData"
          ref="multipleTable"
          tooltip-effect="dark"
          border
          style="width: 94%;"
          @selection-change="handleSelectionChange">
          <el-table-column
            align="center"
            type="selection"
            width="55">
          </el-table-column>
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
            prop="noUseNum"
            label="名单未分配数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="totalNum"
            label="名单总数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="modifierName"
            label="操作人">
          </el-table-column>
          <el-table-column
            align="center"
            prop="modifierTime"
            label="操作时间">
          </el-table-column>
        </el-table>
        <el-row style="margin-top:1%;">
          <el-col :span="22">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page.sync="pagination.pageNo"
              :page-size="pagination.pageSize"
              layout="total, prev, pager, next, jumper"
              :total="pagination.totalCount" style="text-align: right">
            </el-pagination>
          </el-col>
        </el-row>
        <el-table
          :header-row-style="headerRow"
          :data="tableData2"
          ref="multipleTable"
          tooltip-effect="dark"
          border
          style="width: 94%;margin-top:2%;"
          @selection-change="handleSelectionChange2">
          <el-table-column
            align="center"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            align="center"
            prop="departName"
            label="分配对象">
          </el-table-column>
          <el-table-column
            align="center"
            prop="noUseNum"
            :label="noUseNumLabel">
          </el-table-column>
          <el-table-column
            align="center"
            prop="useNum"
            :label="useNumLabel">
          </el-table-column>
          <el-table-column
            align="center"
            prop="totalNum"
            label="总数量">
          </el-table-column>
          <el-table-column
            align="center"
            label="本次分配数量">
            <template slot-scope="scope">
              <el-input v-model="tableData2[scope.$index].num" @change="handleChange1(scope.row)"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </div>
  </div>
</template>

<script>
  import { findCampaignNameListAssignInfo, findDownNamelistInfoByCampaignAndDepart, assignTaskInfo } from '@/api/captain_list_newdistribute_group'
  import { Message } from 'element-ui'
  import { findCampaignByUser, getDownInfoByCurrentUser } from '@/api/monitor_list_single'
  import { formatDateTime } from '@/utils/tools'

  export default {
    name: 'captain_list_newdistribute_group',
    data() {
      return {
        type: '',
        totalNum: 0,
        noUseNumLabel: '',
        useNumLabel: '',
        multipleSelection2: [],
        multipleSelection: [],
        campaignIdList: [],
        tableData: [],
        tableData2: [],
        activeNameList: [],
        formInline: {
          radio: '0',
          campaignId: '',
          num: '',
          totalNum: 0,
          noUseNum: 0
        },
        pagination: {
          pageNo: null,
          pageSize: null,
          totalCount: 0,
          totalPage: null
        }
      }
    },
    methods: {
      selectActive(val) {
        findCampaignNameListAssignInfo({
          campaignId: val,
          pageNo: 1,
          pageSize: 10
        }).then(response => {
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
            findDownNamelistInfoByCampaignAndDepart({
              campaignId: val
            }).then(res => {
              if (res.data.code === 0) {
                this.tableData2 = res.data.data
                this.type = res.data.type
                for (let i = 0; i <= this.tableData2.length - 1; i++) {
                  if (this.tableData2[i]) {
                    this.tableData2[i].num = ''
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
        findCampaignNameListAssignInfo({
          campaignId: this.formInline.campaignId,
          pageNo: val,
          pageSize: 10
        }).then(response => {
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
        this.formInline.noUseNum = 0
        this.formInline.totalNum = 0
        for (let i = 0; i <= val.length; i++) {
          if (val[i]) {
            this.formInline.noUseNum += Number(val[i].noUseNum)
            this.formInline.totalNum += Number(val[i].totalNum)
          }
        }
        this.handleChange()
      },
      assignNum() {
        for (let i = 0; i <= this.tableData2.length - 1; i++) {
          if (this.tableData2[i]) {
            this.tableData2[i].num = ''
            this.$set(this.tableData2, i, this.tableData2[i])
          }
        }
        if (this.multipleSelection2.length !== 0) {
          for (let i = 0; i <= this.multipleSelection2.length - 1; i++) {
            this.multipleSelection2[i].num = parseInt(Number(this.formInline.num) / this.multipleSelection2.length)
          }
          this.multipleSelection2[0].num += parseInt(Number(this.formInline.num) % this.multipleSelection2.length)
        }
      },
      handleSelectionChange2(val) {
        this.multipleSelection2 = val
        this.assignNum()
      },
      headerRow({ row, rowIndex }) {
        if (rowIndex === 0) {
          return 'color:black'
        } else {
          return ''
        }
      },
      handleChange(value) {
        if (Number(this.formInline.num) > Number(this.formInline.noUseNum)) {
          Message({
            message: '分配量不能大于未分配量',
            type: 'error',
            duration: 3 * 1000
          })
        } else {
          this.assignNum()
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
      confirm() {
        this.handleChange1()
        if (this.multipleSelection.length === 0) {
          Message({
            message: '请选择名单',
            type: 'error',
            duration: 3 * 1000
          })
        } else if (this.multipleSelection2.length === 0) {
          Message({
            message: '请选择分配对象',
            type: 'error',
            duration: 3 * 1000
          })
        } else if (Number(this.formInline.num) > Number(this.formInline.noUseNum)) {
          Message({
            message: '分配量不能大于未分配量',
            type: 'error',
            duration: 3 * 1000
          })
        } else if (this.totalNum !== Number(this.formInline.num)) {
          Message({
            message: '分配数量总和不等于分配量',
            type: 'error',
            duration: 3 * 1000
          })
        } else if (this.formInline.num) {
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
          assignTaskInfo({
            assignNum: String(this.formInline.num),
            assignType: this.formInline.radio,
            listIds: listIds,
            campaignId: this.formInline.campaignId,
            data: data,
            type: this.type
          }).then(response => {
            if (response.data.code === 0) {
              this.selectActive(this.formInline.campaignId)
              this.formInline.num = ''
              this.formInline.radio = '0'
            } else {
              Message({
                message: response.data.message,
                type: 'error',
                duration: 3 * 1000
              })
            }
          })
        } else {
          Message({
            message: '请填写分配量',
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
            this.noUseNumLabel = response.data.type ? '未使用数量' : '未分配数量'
            this.useNumLabel = response.data.type ? '已使用数量' : '已分配数量'
          }
        })
      })
    }
  }
</script>
