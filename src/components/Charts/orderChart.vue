<template>
  <div style="width: 100%;height: 90%" v-if="departPermission">
    <el-row>
      <el-form :inline="true" class="demo-form-inline" size="small">
        <el-form-item label="活动名称:">
          <el-select v-model="formInline.campaignIdClone" placeholder="活动名称" @change="campaignChange">
            <el-option value="" label="所有活动"></el-option>
            <el-option v-for="item in activeNameList" :key="item.campaignId" :label="item.campaignName" :value="item.campaignId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称:">
          <el-select v-model="formInline.productClone" placeholder="产品名称">
            <el-option value="" label="所有产品"></el-option>
            <el-option v-for="item in productList" :key="item.productId" :label="item.productName" :value="item.productId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间维度:">
          <el-select v-model="formInline.time" @change="time_dimensionChange">
            <el-option label="天" value="day"></el-option>
            <el-option label="小时" value="hour"></el-option>
            <el-option label="周" value="week"></el-option>
            <el-option label="月" value="month"></el-option>
            <el-option label="年" value="year"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="formInline.time === 'hour'" label="操作时间：">
          <el-date-picker
            v-model="timeValue"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="yyyy-MM-dd HH">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-show="formInline.time === 'day'" label="操作时间：">
          <el-date-picker
            v-model="timeValue"
            type="daterange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-show="formInline.time === 'week'" label="操作时间：">
          <el-date-picker
            v-model="timeValue[0]"
            type="week"
            format="yyyy 第 WW 周"
            placeholder="开始周"
            :picker-options="week">
          </el-date-picker>
          <span>-</span>
          <el-date-picker
            v-model="timeValue[1]"
            type="week"
            format="yyyy 第 WW 周"
            placeholder="结束周"
            :picker-options="week">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-show="formInline.time === 'month'" label="操作时间：">
          <el-date-picker
            v-model="timeValue[0]"
            type="month"
            placeholder="开始月"
            format="yyyy-MM">
          </el-date-picker>
          <span>-</span>
          <el-date-picker
            v-model="timeValue[1]"
            type="month"
            placeholder="结束月"
            format="yyyy-MM">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-show="formInline.time === 'year'" label="操作时间：">
          <el-date-picker
            v-model="timeValue[0]"
            type="year"
            placeholder="开始年"
            format="yyyy">
          </el-date-picker>
          <span>-</span>
          <el-date-picker
            v-model="timeValue[1]"
            type="year"
            placeholder="结束年"
            format="yyyy">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search('search')">查询</el-button>
          <el-button type="danger" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <div :class="className" :id="id" style="height: 100%;width: 100%;"></div>
    <div style="margin-top: 1%">
      <el-row>
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page.sync="pagination.pageNo"
          :page-size="pagination.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="pagination.totalCount" style="text-align: right">
        </el-pagination>
      </el-row>
    </div>
    <el-form :inline="true" class="demo-form-inline" size="small" style="margin: 10px 0">
      <el-form-item label="时间选项:" style="margin-bottom: 0">
        <el-select v-model="formInline.time_dimension" @change="timeChange">
          <el-option v-for="item in timeOptions" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div :class="className" id="staff" style="height: 100%;width: 100%;"></div>
    <el-form :inline="true" class="demo-form-inline" size="small" style="margin: 10px 0">
      <el-form-item label="员工选项:" style="margin-bottom: 0">
        <el-select v-model="formInline.staff" @change="agentChange">
          <el-option v-for="item in staffOptions" :key="item.angentId" :label="item.angentId" :value="item.angentId"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div :class="className" :id="time" style="height: 100%;width: 100%;"></div>
    <div style="margin-top: 1%">
      <el-row>
        <el-pagination
          background
          @current-change="handleCurrentChangeStaff"
          :current-page.sync="paginationStaffPage.pageNo"
          :page-size="paginationStaffPage.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="paginationStaffPage.totalCount" style="text-align: right">
        </el-pagination>
      </el-row>
    </div>
    <div style="margin-top: 1%">
      <h3>合计表</h3>
      <el-table
        :header-row-style="headerRow"
        :data="tableData1"
        ref="multipleTable"
        tooltip-effect="dark"
        :summary-method="getSummaryMethod"
        show-summary
        border
        style="width: 100%;">
        <el-table-column
          align="center"
          prop="agent_id"
          label="下属员工">
        </el-table-column>
        <el-table-column
          align="center"
          prop="count"
          label="订单数量">
        </el-table-column>
        <el-table-column
          align="center"
          prop="total_amount"
          label="订单总金额">
        </el-table-column>
        <el-table-column
          align="center"
          prop="avg_amount"
          label="订单平均金额">
        </el-table-column>
      </el-table>
      <h3>员工表详情</h3>
      <div style="margin-top:1%;" v-for="(item, index) in staffOptions">
        <el-table
          :header-row-style="headerRow"
          :data="tableData[index]"
          ref="multipleTable"
          tooltip-effect="dark"
          :span-method="objectSpanMethod"
          border
          style="width: 100%;">
          <el-table-column
            align="center"
            prop="agent_id"
            label="下属员工">
          </el-table-column>
          <el-table-column
            align="center"
            prop="time_dimension"
            label="时间段">
          </el-table-column>
          <el-table-column
            align="center"
            prop="count"
            label="订单数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="total_amount"
            label="订单总金额">
          </el-table-column>
          <el-table-column
            align="center"
            prop="avg_amount"
            label="订单平均金额">
          </el-table-column>
        </el-table>
        <el-row style="margin-top:1%;">
          <div @click="page(item,index)">
            <el-pagination
              background
              @current-change="handleCurrentChange1"
              :current-page.sync="pageNo[index]"
              :page-size="pageSize[index]"
              layout="total, prev, pager, next, jumper"
              :total="totalCount[index]" style="text-align: right">
            </el-pagination>
          </div>
        </el-row>
      </div>
    </div>
  </div>
  <div style="width: 100%;height: 90%" v-else-if="staffPermission">
    <el-row>
      <el-form :inline="true" class="demo-form-inline" size="small">
        <el-form-item label="活动名称:">
          <el-select v-model="formInline.campaignIdClone" placeholder="活动名称" @change="campaignChange">
            <el-option value="" label="所有活动"></el-option>
            <el-option v-for="item in activeNameList" :key="item.campaignId" :label="item.campaignName" :value="item.campaignId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称:">
          <el-select v-model="formInline.productClone" placeholder="产品名称">
            <el-option value="" label="所有产品"></el-option>
            <el-option v-for="item in productList" :key="item.productId" :label="item.productName" :value="item.productId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间维度:">
          <el-select v-model="formInline.time" @change="time_dimensionChange">
            <el-option label="天" value="day"></el-option>
            <el-option label="小时" value="hour"></el-option>
            <el-option label="周" value="week"></el-option>
            <el-option label="月" value="month"></el-option>
            <el-option label="年" value="year"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="formInline.time === 'hour'" label="操作时间：">
          <el-date-picker
            v-model="timeValue"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="yyyy-MM-dd HH">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-show="formInline.time === 'day'" label="操作时间：">
          <el-date-picker
            v-model="timeValue"
            type="daterange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-show="formInline.time === 'week'" label="操作时间：">
          <el-date-picker
            v-model="timeValue[0]"
            type="week"
            format="yyyy 第 WW 周"
            placeholder="开始周"
            :picker-options="week">
          </el-date-picker>
          <span>-</span>
          <el-date-picker
            v-model="timeValue[1]"
            type="week"
            format="yyyy 第 WW 周"
            placeholder="结束周"
            :picker-options="week">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-show="formInline.time === 'month'" label="操作时间：">
          <el-date-picker
            v-model="timeValue[0]"
            type="month"
            placeholder="开始月"
            format="yyyy-MM">
          </el-date-picker>
          <span>-</span>
          <el-date-picker
            v-model="timeValue[1]"
            type="month"
            placeholder="结束月"
            format="yyyy-MM">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-show="formInline.time === 'year'" label="操作时间：">
          <el-date-picker
            v-model="timeValue[0]"
            type="year"
            placeholder="开始年"
            format="yyyy">
          </el-date-picker>
          <span>-</span>
          <el-date-picker
            v-model="timeValue[1]"
            type="year"
            placeholder="结束年"
            format="yyyy">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search1(staffAgentid)">查询</el-button>
          <el-button type="danger" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <div :class="className" :id="time" style="height: 100%;width: 100%;"></div>
    <div style="margin-top: 1%">
      <el-row>
        <el-pagination
          background
          @current-change="handleCurrentChangeStaff1"
          :current-page.sync="paginationStaffPage.pageNo"
          :page-size="paginationStaffPage.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="paginationStaffPage.totalCount" style="text-align: right">
        </el-pagination>
      </el-row>
    </div>
    <div style="margin-top: 1%">
      <h3>详情表</h3>
      <el-table
        :header-row-style="headerRow"
        :data="tableDataAgent"
        ref="multipleTable"
        tooltip-effect="dark"
        border
        style="width: 100%;">
        <el-table-column
          align="center"
          prop="time_dimension"
          label="时间段">
        </el-table-column>
        <el-table-column
          align="center"
          prop="count"
          label="订单数量">
        </el-table-column>
        <el-table-column
          align="center"
          prop="total_amount"
          label="订单总金额">
        </el-table-column>
        <el-table-column
          align="center"
          prop="avg_amount"
          label="订单平均金额">
        </el-table-column>
      </el-table>
      <el-row style="margin-top:1%;">
        <div @click="page(item,index)">
          <el-pagination
            background
            @current-change="handleCurrentChangeAgent"
            :current-page.sync="paginationAgent.pageNo"
            :page-size="paginationAgent.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="paginationAgent.totalCount" style="text-align: right">
          </el-pagination>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import resize from './mixins/resize'
  import { orderstatistics, getAllStaffByDepartId, getDepartId, ordertotalAgent, orderreportAgent } from '@/api/ctiReport'
  import { Message } from 'element-ui'
  import { permsorderdepart, permsorderstaff } from '@/api/reportPermission'
  import { findCampaignByUser } from '@/api/monitor_list_single'
  import { hasOrderInfos } from '@/api/dialTask'
  import { findAllProduct } from '@/api/campaign'
  import moment from 'moment'

  export default {
    mixins: [resize],
    props: {
      className: {
        type: String,
        default: 'chart'
      },
      id: {
        type: String,
        default: 'chart'
      },
      time: {
        type: String,
        default: 'time'
      },
      width: {
        type: String,
        default: '200px'
      },
      height: {
        type: String,
        default: '200px'
      }
    },
    // computed: {
    //   getNav() {
    //     return this.$store.state.app.sidebar.opened
    //   }
    // },
    data() {
      return {
        week: {
          firstDayOfWeek: 1
        },
        allProductList: [],
        productList: [],
        activeNameList: [],
        departPermission: false,
        staffPermission: false,
        contentIndex: 0,
        currentIndex: null,
        timeOptions: [],
        staffOptions: [],
        bool: false,
        chart: null,
        chartStaff: null,
        chartTime: null,
        obj: {},
        timeValueClone: [],
        timeValue: [new Date(new Date(new Date().toLocaleDateString()).getTime() - 7 * 24 * 3600 * 1000), new Date(new Date(new Date().toLocaleDateString()).getTime())],
        pagination: {
          pageNo: null,
          pageSize: null,
          totalCount: null,
          totalPage: null
        },
        paginationStaffPage: {
          pageNo: null,
          pageSize: null,
          totalCount: null,
          totalPage: null
        },
        paginationAgent: {
          pageNo: null,
          pageSize: null,
          totalCount: null,
          totalPage: null
        },
        paginationStaff: [],
        pageNo: [],
        pageSize: [],
        totalCount: [],
        formInline: {
          campaignId: '',
          campaignIdClone: '',
          agent_dn: [],
          from: 1,
          time: 'day',
          staff: '',
          time_dimension: '',
          productClone: '',
          product: ''
        },
        tableData: [],
        tableData1: [],
        tableDataAgent: [],
        count: [],
        total_amount: [],
        avg_amount: [],
        countTime: [],
        total_amountTime: [],
        avg_amountTime: [],
        countAgent: [],
        total_amountAgent: [],
        avg_amountAgent: [],
        agentTime: [],
        staffAgentid: null
      }
    },
    mounted() {
      findCampaignByUser().then(response => {
        this.activeNameList = response.data.data
      })
      findAllProduct().then(res => {
        this.allProductList = res.data.data
      })
      getDepartId().then(res => {
        this.staffAgentid = res.data.agentid
        permsorderdepart(res.data.agentid).then(r => {
          this.departPermission = true
          this.staffPermission = false
          getAllStaffByDepartId(res.data.departId).then(response => {
            this.staffOptions = response.data.data
            this.formInline.agent_dn = response.data.data.map(function(item, index) {
              return item.angentId
            })
            this.formInline.staff = response.data.data[0].angentId
            this.search(0)
          })
        }).catch((error) => {
          console.log(error)
          permsorderstaff(res.data.agentid).then(re => {
            this.departPermission = false
            this.staffPermission = true
            this.search1(res.data.agentid)
          }).catch((err) => {
            console.log(err)
          })
        })
      })
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
      if (!this.chartStaff) {
        return
      }
      this.chartStaff.dispose()
      this.chartStaff = null
      if (!this.chartTime) {
        return
      }
      this.chartTime.dispose()
      this.chartTime = null
    },
    methods: {
      getSummaryMethod({ columns, data }) {
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计'
            return
          }
          const values = data.map(item => Number(item[column.property]))
          if (index < columns.length - 1) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
          } else {
            sums[index] = sums[index - 1] / sums[index - 2] ? sums[index - 1] / sums[index - 2] : 0
            sums[index] = sums[index].toFixed(2)
          }
        })
        return sums
      },
      getStartTimestamp(timeStr, type) {
        let startTime
        if (type) {
          switch (type) {
            case 'hour':
              startTime = moment(timeStr, 'x')
              break
            case 'day':
              startTime = moment(timeStr, 'x')
              break
            case 'week':
              startTime = moment(timeStr, 'x')
              break
            case 'month':
              startTime = moment(timeStr, 'x')
              break
            case 'year':
              startTime = moment(timeStr, 'x')
              break
          }
        } else {
          return
        }
        return startTime.valueOf()
      },
      getEndTimestamp(timeStr, type) {
        let endTime
        if (type) {
          switch (type) {
            case 'hour':
              endTime = moment(timeStr, 'x').add(1, 'hours').subtract(1, 'ms')
              break
            case 'day':
              endTime = moment(timeStr, 'x').add(1, 'days').subtract(1, 'ms')
              break
            case 'week':
              endTime = moment(timeStr, 'x').add(1, 'weeks').subtract(1, 'ms')
              break
            case 'month':
              endTime = moment(timeStr, 'x').add(1, 'months').subtract(1, 'ms')
              break
            case 'year':
              endTime = moment(timeStr, 'x').add(1, 'years').subtract(1, 'ms')
              break
          }
        } else {
          return
        }
        return endTime.valueOf()
      },
      arraySpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) { //  表示第一列合并行
          if (rowIndex % 10 === 0) {
            return {
              rowspan: 10,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      },
      objectSpanMethod({ row, column, rowIndex, columnIndex }, val) {
        if (columnIndex === 0) { //  表示第一列合并行
          if (rowIndex % 5 === 0) {
            return {
              rowspan: 5,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      },
      headerRow({ row, rowIndex }) {
        if (rowIndex === 0) {
          return 'color:black'
        } else {
          return ''
        }
      },
      handleCurrentChange(val) {
        this.formInline.from = val
        this.teamData(val)
      },
      handleCurrentChangeStaff(val) {
        this.agentChange(this.formInline.staff, val)
      },
      handleCurrentChangeStaff1(val) {
        this.agentChange(this.staffAgentid, val)
      },
      page(val, index) {
        this.currentIndex = index
      },
      handleCurrentChange1(val) {
        orderreportAgent({
          campaign_id: this.formInline.campaignId,
          time_dimension: this.formInline.time,
          agent_id: this.formInline.agent_dn[this.currentIndex],
          start_time: this.getStartTimestamp(Date.parse(this.timeValueClone[0]), this.formInline.time),
          end_time: this.getEndTimestamp(Date.parse(this.timeValueClone[1]), this.formInline.time),
          pageNo: val,
          pageSize: this.pageSize[this.currentIndex]
        }).then(response => {
          this.pageNo.splice(this.currentIndex, 1, response.data.pageNo)
          this.pageSize.splice(this.currentIndex, 1, response.data.pageSize)
          this.totalCount.splice(this.currentIndex, 1, response.data.total_count)
          this.tableData.splice(this.currentIndex, 1, response.data.result)
        })
      },
      handleCurrentChangeAgent(val) {
        orderreportAgent({
          product_id: this.formInline.product,
          campaign_id: this.formInline.campaignId,
          time_dimension: this.formInline.time,
          agent_id: this.staffAgentid,
          start_time: this.getStartTimestamp(Date.parse(this.timeValueClone[0]), this.formInline.time),
          end_time: this.getEndTimestamp(Date.parse(this.timeValueClone[1]), this.formInline.time),
          pageNo: val,
          pageSize: this.paginationAgent.pageSize
        }).then(response => {
          this.tableDataAgent = response.data.result
          this.paginationAgent.pageNo = response.data.pageNo
          this.paginationAgent.pageSize = response.data.pageSize
          this.paginationAgent.totalCount = response.data.total_count
        })
      },
      searchStaff() {
        if (this.contentIndex >= this.formInline.agent_dn.length) {
          return this.tableData
        }
        orderreportAgent({
          product_id: this.formInline.product,
          campaign_id: this.formInline.campaignId,
          time_dimension: this.formInline.time,
          agent_id: this.formInline.agent_dn[this.contentIndex],
          start_time: this.getStartTimestamp(Date.parse(this.timeValueClone[0]), this.formInline.time),
          end_time: this.getEndTimestamp(Date.parse(this.timeValueClone[1]), this.formInline.time),
          pageNo: 1,
          pageSize: 5
        }).then(response => {
          this.pageNo.push(response.data.pageNo)
          this.pageSize.push(response.data.pageSize)
          this.totalCount.push(response.data.total_count)
          this.tableData.push(response.data.result)
          this.contentIndex++
          this.searchStaff()
        })
      },
      searchAgentStaff(val) {
        orderreportAgent({
          product_id: this.formInline.product,
          campaign_id: this.formInline.campaignId,
          time_dimension: this.formInline.time,
          agent_id: val,
          start_time: this.getStartTimestamp(Date.parse(this.timeValueClone[0]), this.formInline.time),
          end_time: this.getEndTimestamp(Date.parse(this.timeValueClone[1]), this.formInline.time),
          pageNo: 1,
          pageSize: 10
        }).then(response => {
          this.tableDataAgent = response.data.result
          this.paginationAgent.pageNo = response.data.pageNo
          this.paginationAgent.pageSize = response.data.pageSize
          this.paginationAgent.totalCount = response.data.total_count
        })
      },
      initChart() {
        const self = this
        this.chart = echarts.init(document.getElementById(this.id))
        const xData = (function() {
          const data = []
          for (let i = 0; i < self.obj.result.length; i++) {
            data.push(self.obj.result[i].time_dimension)
          }
          return data
        }())
        this.chart.clear()
        this.chart.setOption({
          backgroundColor: '#344b58',
          title: {
            text: '订单报表',
            x: '20',
            top: '20',
            textStyle: {
              color: '#fff',
              fontSize: '14'
            },
            subtextStyle: {
              color: '#90979c',
              fontSize: '16'
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              textStyle: {
                color: '#fff'
              }
            }
          },
          grid: {
            borderWidth: 0,
            top: 110,
            bottom: 95,
            textStyle: {
              color: '#fff'
            }
          },
          legend: {
            x: '30%',
            top: '10%',
            textStyle: {
              color: '#90979c'
            },
            data: ['订单数量', '订单总金额', '订单平均金额']
          },
          calculable: true,
          xAxis: [{
            type: 'category',
            axisLine: {
              lineStyle: {
                color: '#90979c'
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitArea: {
              show: false
            },
            axisLabel: {
              interval: 0

            },
            data: xData
          }],
          yAxis: [{
            type: 'value',
            name: '数量/笔',
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#90979c'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              interval: 0
            },
            splitArea: {
              show: false
            }
          }, {
            type: 'value',
            name: '金额/元',
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#90979c'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              interval: 0
            },
            splitArea: {
              show: false
            }
          }],
          dataZoom: [{
            show: true,
            height: 30,
            xAxisIndex: [
              0
            ],
            bottom: 30,
            start: 10,
            end: 80,
            handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
            handleSize: '110%',
            handleStyle: {
              color: '#d3dee5'

            },
            textStyle: {
              color: '#fff' },
            borderColor: '#90979c'

          }, {
            type: 'inside',
            show: true,
            height: 15,
            start: 1,
            end: 35
          }],
          series: [{
            name: '订单数量',
            type: 'bar',
            stack: 'total',
            barMaxWidth: 35,
            barGap: '10%',
            itemStyle: {
              normal: {
                color: 'rgba(255,165,0,1)',
                label: {
                  show: true,
                  textStyle: {
                    color: '#fff'
                  },
                  position: 'insideTop',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            data: this.count
          }, {
            name: '订单总金额',
            // type: 'bar',
            // stack: 'total',
            // barMaxWidth: 35,
            type: 'line',
            // stack: 'total',
            yAxisIndex: 1,
            symbolSize: 10,
            symbol: 'circle',
            itemStyle: {
              normal: {
                color: 'rgba(148,204,209,1)',
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: 'insideTop',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            data: this.total_amount
          }, {
            name: '订单平均金额',
            // type: 'bar',
            // stack: 'total',
            // symbolSize: 10,
            // barMaxWidth: 35,
            type: 'line',
            // stack: 'total',
            yAxisIndex: 1,
            symbolSize: 10,
            symbol: 'circle',
            itemStyle: {
              normal: {
                color: 'rgba(255,144,128,1)',
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: 'insideTop',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            data: this.avg_amount
          }
          ]
        })
      },
      initChart1() {
        this.chartStaff = echarts.init(document.getElementById('staff'))
        this.chartStaff.clear()
        this.chartStaff.setOption({
          backgroundColor: '#344b58',
          title: {
            text: '单个时间各员工订单报表',
            x: '20',
            top: '20',
            textStyle: {
              color: '#fff',
              fontSize: '14'
            },
            subtextStyle: {
              color: '#90979c',
              fontSize: '14'
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              textStyle: {
                color: '#fff'
              }
            }
          },
          grid: {
            borderWidth: 0,
            top: 110,
            bottom: 95,
            textStyle: {
              color: '#fff'
            }
          },
          legend: {
            x: '30%',
            top: '10%',
            textStyle: {
              color: '#90979c'
            },
            data: ['订单数量', '订单总金额', '订单平均金额']
          },
          calculable: true,
          xAxis: [{
            type: 'category',
            axisLine: {
              lineStyle: {
                color: '#90979c'
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitArea: {
              show: false
            },
            axisLabel: {
              interval: 'auto'
            },
            data: this.formInline.agent_dn
          }],
          yAxis: [{
            type: 'value',
            name: '数量/笔',
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#90979c'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              interval: 0
            },
            splitArea: {
              show: false
            }
          }, {
            type: 'value',
            name: '金额/元',
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#90979c'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              interval: 0
            },
            splitArea: {
              show: false
            }
          }],
          dataZoom: [{
            show: true,
            height: 30,
            xAxisIndex: [
              0
            ],
            bottom: 30,
            start: 10,
            end: 80,
            handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
            handleSize: '110%',
            handleStyle: {
              color: '#d3dee5'

            },
            textStyle: {
              color: '#fff' },
            borderColor: '#90979c'

          }, {
            type: 'inside',
            show: true,
            height: 15,
            start: 1,
            end: 35
          }],
          series: [{
            name: '订单数量',
            type: 'bar',
            stack: 'total',
            barMaxWidth: 35,
            barGap: '10%',
            itemStyle: {
              normal: {
                color: 'rgba(255,165,0,1)',
                label: {
                  show: true,
                  textStyle: {
                    color: '#fff'
                  },
                  position: 'insideTop',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            data: this.countTime
          }, {
            name: '订单总金额',
            // type: 'bar',
            // stack: 'total',
            // barMaxWidth: 35,
            type: 'line',
            symbol: 'circle',
            // stack: 'total',
            yAxisIndex: 1,
            itemStyle: {
              normal: {
                color: 'rgba(148,204,209,1)',
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: 'insideTop',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            data: this.total_amountTime
          }, {
            name: '订单平均金额',
            // type: 'bar',
            // stack: 'total',
            symbolSize: 10,
            // barMaxWidth: 35,
            type: 'line',
            // stack: 'total',
            yAxisIndex: 1,
            symbol: 'circle',
            itemStyle: {
              normal: {
                color: 'rgba(255,144,128,1)',
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: 'insideTop',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            data: this.avg_amountTime
          }
          ]
        })
      },
      initChart2() {
        this.chartTime = echarts.init(document.getElementById('time'))
        this.chartTime.clear()
        this.chartTime.setOption({
          backgroundColor: '#344b58',
          title: {
            text: '单个员工各时间段订单报表',
            x: '20',
            top: '20',
            textStyle: {
              color: '#fff',
              fontSize: '14'
            },
            subtextStyle: {
              color: '#90979c',
              fontSize: '14'
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              textStyle: {
                color: '#fff'
              }
            }
          },
          grid: {
            borderWidth: 0,
            top: 110,
            bottom: 95,
            textStyle: {
              color: '#fff'
            }
          },
          legend: {
            x: '30%',
            top: '10%',
            textStyle: {
              color: '#90979c'
            },
            data: ['订单数量', '订单总金额', '订单平均金额']
          },
          calculable: true,
          xAxis: [{
            type: 'category',
            axisLine: {
              lineStyle: {
                color: '#90979c'
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitArea: {
              show: false
            },
            axisLabel: {
              interval: 0
            },
            data: this.agentTime
          }],
          yAxis: [{
            type: 'value',
            name: '数量/笔',
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#90979c'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              interval: 0
            },
            splitArea: {
              show: false
            }
          }, {
            type: 'value',
            name: '金额/元',
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#90979c'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              interval: 0
            },
            splitArea: {
              show: false
            }
          }],
          dataZoom: [{
            show: true,
            height: 30,
            xAxisIndex: [
              0
            ],
            bottom: 30,
            start: 10,
            end: 80,
            handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
            handleSize: '110%',
            handleStyle: {
              color: '#d3dee5'

            },
            textStyle: {
              color: '#fff' },
            borderColor: '#90979c'

          }, {
            type: 'inside',
            show: true,
            height: 15,
            start: 1,
            end: 35
          }],
          series: [{
            name: '订单数量',
            type: 'bar',
            stack: 'total',
            barMaxWidth: 35,
            barGap: '10%',
            itemStyle: {
              normal: {
                color: 'rgba(255,165,0,1)',
                label: {
                  show: true,
                  textStyle: {
                    color: '#fff'
                  },
                  position: 'insideTop',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            data: this.countAgent
          }, {
            name: '订单总金额',
            // type: 'bar',
            // stack: 'total',
            // barMaxWidth: 35,
            type: 'line',
            symbol: 'circle',
            // stack: 'total',
            yAxisIndex: 1,
            symbolSize: 10,
            itemStyle: {
              normal: {
                color: 'rgba(148,204,209,1)',
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: 'insideTop',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            data: this.total_amountAgent
          }, {
            name: '订单平均金额',
            // type: 'bar',
            // stack: 'total',
            symbolSize: 10,
            // barMaxWidth: 35,
            type: 'line',
            // stack: 'total',
            yAxisIndex: 1,
            symbol: 'circle',
            itemStyle: {
              normal: {
                color: 'rgba(255,144,128,1)',
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: 'insideTop',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            data: this.avg_amountAgent
          }
          ]
        })
      },
      campaignChange(val) {
        this.productList = []
        hasOrderInfos(val).then(res => {
          if (res.data.data) {
            for (let i = 0; i < this.allProductList.length; i++) {
              if (res.data.data.indexOf(this.allProductList[i].productId) !== -1) {
                this.productList.push(this.allProductList[i])
              }
            }
          }
        })
      },
      time_dimensionChange(val) {
        this.timeValue = []
      },
      timeChange(val) {
        orderreportAgent({
          product_id: this.formInline.product,
          campaign_id: this.formInline.campaignId,
          time_dimension: this.formInline.time,
          agent_id: this.formInline.agent_dn.join(','),
          time: val,
          start_time: this.getStartTimestamp(Date.parse(this.timeValueClone[0]), this.formInline.time),
          end_time: this.getEndTimestamp(Date.parse(this.timeValueClone[1]), this.formInline.time)
        }).then(response => {
          if (response.data.result.length) {
            this.countTime = response.data.result.map(function(item, index) {
              return item.count
            })
            this.total_amountTime = response.data.result.map(function(item, index) {
              return item.total_amount
            })
            this.avg_amountTime = response.data.result.map(function(item, index) {
              return item.avg_amount
            })
            this.initChart1()
          }
        })
      },
      agentChange(val, page) {
        orderreportAgent({
          product_id: this.formInline.product,
          campaign_id: this.formInline.campaignId,
          time_dimension: this.formInline.time,
          agent_id: val,
          start_time: this.getStartTimestamp(Date.parse(this.timeValueClone[0]), this.formInline.time),
          end_time: this.getEndTimestamp(Date.parse(this.timeValueClone[1]), this.formInline.time),
          pageNo: page || 1,
          pageSize: 8
        }).then(response => {
          if (response.data.result.length) {
            this.countAgent = response.data.result.map(function(item, index) {
              return item.count
            })
            this.total_amountAgent = response.data.result.map(function(item, index) {
              return item.total_amount
            })
            this.avg_amountAgent = response.data.result.map(function(item, index) {
              return item.avg_amount
            })
            this.agentTime = response.data.result.map(function(item, index) {
              return item.time_dimension
            })
            this.initChart2()
          }
          this.paginationStaffPage = {
            pageNo: response.data.pageNo,
            pageSize: response.data.pageSize,
            totalCount: response.data.total_count,
            totalPage: null
          }
        })
      },
      teamData(val) {
        orderstatistics({
          product_id: this.formInline.product,
          campaign_id: this.formInline.campaignId,
          time_dimension: this.formInline.time,
          agent_id: this.formInline.agent_dn.join(','),
          start_time: this.getStartTimestamp(Date.parse(this.timeValueClone[0]), this.formInline.time),
          end_time: this.getEndTimestamp(Date.parse(this.timeValueClone[1]), this.formInline.time), // val || val === 'search' ? this.timeValue[1] :
          pageNo: val && val !== 'search' ? this.formInline.from : 1,
          pageSize: 10
        }).then(response => {
          this.obj = response.data
          if (this.obj.result.length) {
            this.count = this.obj.result.map(function(item, index) {
              return item.count
            })
            this.total_amount = this.obj.result.map(function(item, index) {
              return item.total_amount
            })
            this.avg_amount = this.obj.result.map(function(item, index) {
              return item.avg_amount
            })
            this.initChart()
          }
          this.timeOptions = response.data.time_dimension_data
          this.formInline.time_dimension = this.timeOptions[0]
          this.pagination = {
            pageNo: response.data.pageNo,
            pageSize: response.data.pageSize,
            totalCount: response.data.total_count,
            totalPage: null
          }
          this.contentIndex = 0
          this.tableData = []
          this.searchStaff()
          this.timeChange(this.formInline.time_dimension)
          this.agentChange(this.formInline.staff)
        })
      },
      search(val) {
        if (this.formInline.time === 'week') {
          this.timeValue[0] = Date.parse(this.timeValue[0]) - 24 * 3600 * 1000
          this.timeValue[0] = new Date(this.timeValue[0])
          this.timeValue[1] = Date.parse(this.timeValue[1]) - 24 * 3600 * 1000
          this.timeValue[1] = new Date(this.timeValue[1])
        }
        if (this.formInline.time === 'week') {
          this.timeValue[0] = Date.parse(this.timeValue[0]) - 7 * 24 * 3600 * 1000
          this.timeValue[0] = new Date(this.timeValue[0])
          this.timeValue[1] = Date.parse(this.timeValue[1]) - 7 * 24 * 3600 * 1000
          this.timeValue[1] = new Date(this.timeValue[1])
        }
        if (this.timeValue[0] > this.timeValue[1]) {
          Message({
            message: '开始时间不能大于结束时间',
            type: 'error',
            duration: 3 * 1000
          })
        } else {
          this.timeValueClone = this.timeValue
          this.pageNo = []
          this.pageSize = []
          this.totalCount = []
          this.formInline.product = this.formInline.productClone
          this.formInline.campaignId = this.formInline.campaignIdClone
          ordertotalAgent({
            product_id: this.formInline.product,
            campaign_id: this.formInline.campaignId,
            time_dimension: this.formInline.time,
            agent_id: this.formInline.agent_dn.join(','),
            start_time: this.getStartTimestamp(Date.parse(this.timeValueClone[0]), this.formInline.time),
            end_time: this.getEndTimestamp(Date.parse(this.timeValueClone[1]), this.formInline.time)
          }).then(response => {
            this.tableData1 = response.data.result
          })
          this.teamData(val)
        }
      },
      search1(val) {
        if (this.formInline.time === 'week') {
          this.timeValue[0] = Date.parse(this.timeValue[0]) - 24 * 3600 * 1000
          this.timeValue[0] = new Date(this.timeValue[0])
          this.timeValue[1] = Date.parse(this.timeValue[1]) - 24 * 3600 * 1000
          this.timeValue[1] = new Date(this.timeValue[1])
        }
        if (this.formInline.time === 'week') {
          this.timeValue[0] = Date.parse(this.timeValue[0]) - 7 * 24 * 3600 * 1000
          this.timeValue[0] = new Date(this.timeValue[0])
          this.timeValue[1] = Date.parse(this.timeValue[1]) - 7 * 24 * 3600 * 1000
          this.timeValue[1] = new Date(this.timeValue[1])
        }
        if (this.timeValue[0] > this.timeValue[1]) {
          Message({
            message: '开始时间不能大于结束时间',
            type: 'error',
            duration: 3 * 1000
          })
        } else {
          this.formInline.product = this.formInline.productClone
          this.formInline.campaignId = this.formInline.campaignIdClone
          this.timeValueClone = this.timeValue
          this.agentChange(val)
          this.searchAgentStaff(val)
        }
      },
      reset() {
        this.formInline.campaignIdClone = ''
        this.formInline.productClone = ''
        this.formInline.from = 1
        this.formInline.time = 'day'
        this.timeValue = [new Date(new Date(new Date().toLocaleDateString()).getTime() - 7 * 24 * 3600 * 1000), new Date(new Date(new Date().toLocaleDateString()).getTime())]
      }
    }
    // watch: {
    //   getNav(old, newv) {
    //     console.log(document.getElementById(this.id).style.width)
    //     console.log(newv)
    //     if (newv) {
    //       document.getElementsByTagName('canvas')[0].width = document.getElementById(this.id).style.width
    //     }
    //   }
    // }
  }
</script>
