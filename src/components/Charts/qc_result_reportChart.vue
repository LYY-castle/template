<template>
  <div style="width: 100%;height: 90%" v-if="departPermission">
    <el-row>
      <el-form :inline="true" class="demo-form-inline" size="small">
        <el-form-item label="活动名称:" v-show="showActive">
          <el-select v-model="formInline.campaignIdClone" placeholder="活动名称" @change="campaignChange"> <!--@change="campaignChange" -->
            <el-option value="" label="所有活动"></el-option>
            <el-option v-for="item in activeNameList" :key="item.activityId" :label="item.activityName" :value="item.activityId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="质检评分表:" v-show="showActive">
          <el-select v-model="formInline.productClone" placeholder="质检评分表">
            <el-option value="" label="所有评分表"></el-option>
            <el-option v-for="item in productList" :key="item.id" :label="item.gradeName" :value="item.gradeId"></el-option>
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
            v-model="timeValue1[0]"
            type="week"
            format="yyyy 第 WW 周"
            placeholder="开始周"
            :picker-options="week">
          </el-date-picker>
          <span>-</span>
          <el-date-picker
            v-model="timeValue1[1]"
            type="week"
            format="yyyy 第 WW 周"
            placeholder="结束周"
            :picker-options="week">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-show="formInline.time === 'month'" label="操作时间：">
          <el-date-picker
            v-model="timeValue1[0]"
            type="month"
            placeholder="开始月"
            format="yyyy-MM">
          </el-date-picker>
          <span>-</span>
          <el-date-picker
            v-model="timeValue1[1]"
            type="month"
            placeholder="结束月"
            format="yyyy-MM">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-show="formInline.time === 'year'" label="操作时间：">
          <el-date-picker
            v-model="timeValue1[0]"
            type="year"
            placeholder="开始年"
            format="yyyy">
          </el-date-picker>
          <span>-</span>
          <el-date-picker
            v-model="timeValue1[1]"
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
    <el-form :inline="true" class="demo-form-inline" size="small" style="margin-top: 10px;margin-bottom: 5px;">
      <el-form-item label="时间选项:" style="margin-bottom: 0">
        <el-select v-model="formInline.time_dimension" @change="timeChange">
          <el-option v-for="item in timeOptions" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div :class="className" id="staff" style="height: 100%;width: 100%;"></div>
    <el-form :inline="true" class="demo-form-inline" size="small" style="margin-top: 10px;margin-bottom: 5px;">
      <el-form-item label="部门选项:" style="margin-bottom: 0" v-if="statistics_type === 'depart'">
        <el-select v-model="formInline.staff" @change="agentChange">
          <el-option v-for="item in staffOptions" :key="item.depart_id" :label="item.depart_name" :value="item.depart_id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="员工选项:" style="margin-bottom: 0" v-else>
        <el-select v-model="formInline.staff" @change="agentChange">
          <el-option v-for="item in staffOptions" :key="item.agent_id" :label="item.real_name ? item.real_name + ' (' + item.agent_id + ')' : item.agent_id" :value="item.agent_id"></el-option>
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
        :data="tableDataAgent2"
        ref="multipleTable"
        tooltip-effect="dark"
        border
        style="width: 100%;">
        <el-table-column
          align="center"
          prop="agent_id"
          :label="statistics_type === 'depart'?'部门合计':'员工合计'">
        </el-table-column>
        <el-table-column
          align="center"
          prop="count"
          label="质检表单数量">
        </el-table-column>
        <el-table-column
          align="center"
          prop="median"
          label="计分中位数">
        </el-table-column>
        <el-table-column
          align="center"
          prop="avg_score"
          label="计分平均数">
        </el-table-column>
      </el-table>
      <h3>时间合计表</h3>
      <el-table
        :header-row-style="headerRow"
        :data="tableDataTime1"
        ref="multipleTable"
        tooltip-effect="dark"
        border
        style="width: 100%;margin-top: 1%;">
        <el-table-column
          align="center"
          prop="time_dimension"
          label="时间段">
        </el-table-column>
        <el-table-column
          align="center"
          prop="count"
          label="质检表单数量">
        </el-table-column>
        <el-table-column
          align="center"
          prop="median"
          label="计分中位数">
        </el-table-column>
        <el-table-column
          align="center"
          prop="avg_score"
          label="计分平均数">
        </el-table-column>
      </el-table>
      <div style="margin-top: 1%">
        <el-row>
          <el-pagination
            background
            @current-change="handleCurrentChangeStatics"
            :current-page.sync="paginationStatics.pageNo"
            :page-size="paginationStatics.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="paginationStatics.totalCount" style="text-align: right">
          </el-pagination>
        </el-row>
      </div>
      <h3>{{statistics_type === 'depart'?'部门':'员工'}}合计表</h3>
      <el-table
        :header-row-style="headerRow"
        :data="tableDataAgent1"
        ref="multipleTable"
        tooltip-effect="dark"
        border
        style="width: 100%;margin-top: 1%;">
        <el-table-column
          align="center"
          :label="statistics_type === 'depart'?'下属部门':'下属员工'">
          <template slot-scope="scope">
            {{statistics_type === 'depart' ? scope.row.depart_name :  `${formInline.agentMap[scope.row.agent_id]} (${scope.row.agent_id})`}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="count"
          label="质检表单数量">
        </el-table-column>
        <el-table-column
          align="center"
          prop="median"
          label="计分中位数">
        </el-table-column>
        <el-table-column
          align="center"
          prop="avg_score"
          label="计分平均数">
        </el-table-column>
      </el-table>
      <h3>{{statistics_type === 'depart'?'下属部门详情':'下属员工详情'}}</h3>
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
            :label="statistics_type === 'depart'?'下属部门':'下属员工'">
            <template slot-scope="scope">
              {{statistics_type === 'depart' ? scope.row.depart_name :  `${formInline.agentMap[scope.row.agent_id]} (${scope.row.agent_id})`}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="time_dimension"
            label="时间段">
          </el-table-column>
          <el-table-column
            align="center"
            prop="count"
            label="质检表单数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="median"
            label="计分中位数">
          </el-table-column>
          <el-table-column
            align="center"
            prop="avg_score"
            label="计分平均数">
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
        <el-form-item label="活动名称:" v-show="showActive">
          <el-select v-model="formInline.campaignIdClone" placeholder="活动名称" @change="campaignChange">
            <el-option value="" label="所有活动"></el-option>
            <el-option v-for="item in activeNameList" :key="item.activityId" :label="item.activityName" :value="item.activityId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="质检评分表:" v-show="showActive">
          <el-select v-model="formInline.productClone" placeholder="质检评分表">
            <el-option value="" label="所有评分表"></el-option>
            <el-option v-for="item in productList" :key="item.id" :label="item.gradeName" :value="item.gradeId"></el-option>
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
            v-model="timeValue1[0]"
            type="week"
            format="yyyy 第 WW 周"
            placeholder="开始周"
            :picker-options="week">
          </el-date-picker>
          <span>-</span>
          <el-date-picker
            v-model="timeValue1[1]"
            type="week"
            format="yyyy 第 WW 周"
            placeholder="结束周"
            :picker-options="week">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-show="formInline.time === 'month'" label="操作时间：">
          <el-date-picker
            v-model="timeValue1[0]"
            type="month"
            placeholder="开始月"
            format="yyyy-MM">
          </el-date-picker>
          <span>-</span>
          <el-date-picker
            v-model="timeValue1[1]"
            type="month"
            placeholder="结束月"
            format="yyyy-MM">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-show="formInline.time === 'year'" label="操作时间：">
          <el-date-picker
            v-model="timeValue1[0]"
            type="year"
            placeholder="开始年"
            format="yyyy">
          </el-date-picker>
          <span>-</span>
          <el-date-picker
            v-model="timeValue1[1]"
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
          label="质检表单数量">
        </el-table-column>
        <el-table-column
          align="center"
          prop="median"
          label="计分中位数">
        </el-table-column>
        <el-table-column
          align="center"
          prop="avg_score"
          label="计分平均数">
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
  import _ from 'lodash'
  import echarts from 'echarts'
  import resize from './mixins/resize'
  import { departAgents, getDepartId, grades, qualityResultReportstatistics, qualityResultReporttotalAgent, qualityResultReportreportAgent, findCampaignByUserQuality, getGradesByCampaignId } from '@/api/ctiReport'
  import { Message } from 'element-ui'
  import { permsresultreportstaff, permsresultreportdepart } from '@/api/reportPermission'
  // import { hasOrderInfos } from '@/api/dialTask'
  // import { findAllProduct } from '@/api/campaign'
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
        statistics_type: '',
        departId: '',
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
        timeValue1: [],
        timeValue: [new Date(new Date(new Date().toLocaleDateString()).getTime() - 7 * 24 * 3600 * 1000), new Date(new Date(new Date().toLocaleDateString()).getTime())],
        pagination: {
          pageNo: null,
          pageSize: null,
          totalCount: null,
          totalPage: null
        },
        paginationStatics: {
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
          agent_id: [],
          from: 1,
          time: 'day',
          timeClone: 'day',
          staff: '',
          time_dimension: '',
          productClone: '',
          product: '',
          sub_depart_id: [],
          sub_depart_name: [],
          agentMap: {}
        },
        tableData: [],
        tableDataAgent1: [],
        tableDataAgent2: [],
        tableDataTime1: [],
        tableDataTime2: [],
        tableDataAgent: [],
        count: [],
        avg_score: [],
        median_score: [],
        countTime: [],
        avg_scoreTime: [],
        median_scoreTime: [],
        countAgent: [],
        avg_scoreAgent: [],
        median_scoreAgent: [],
        agentTime: [],
        staffAgentid: null,
        websock: null,
        showActive: true
      }
    },
    mounted() {
      findCampaignByUserQuality().then(response => {
        if (response.data.data.length === 0) {
          this.showActive = false
        } else {
          this.showActive = true
        }
        this.activeNameList = response.data.data
      })
      // findAllProduct().then(res => {
      //   this.allProductList = res.data.data
      // })
      grades().then(res => {
        this.allProductList = res.data.data
      })
      getDepartId().then(res => {
        this.staffAgentid = res.data.agentid
        this.departId = res.data.departId
        permsresultreportdepart(res.data.agentid).then(r => {
          this.departPermission = true
          this.staffPermission = false
          departAgents(res.data.departId).then(response => {
            this.statistics_type = response.data.result.statistics_type
            if (response.data.result.statistics_type === 'depart') {
              this.staffOptions = response.data.result.sub_departs
              this.formInline.staff = response.data.result.sub_departs[0].depart_id
              this.formInline.sub_depart_id = response.data.result.sub_departs.map(function(item, index) {
                return item.depart_id
              })
              this.formInline.sub_depart_name = response.data.result.sub_departs.map(function(item, index) {
                return item.depart_name
              })
            } else {
              this.staffOptions = response.data.result.agents
              this.formInline.staff = response.data.result.agents[0].agent_id
              this.formInline.agent_id = response.data.result.agents.map(function(item, index) {
                return item.agent_id
              })
              this.formInline.agent_real_name = response.data.result.agents.map(function(item, index) {
                return item.real_name
              })
              this.formInline.agentMap = _.zipObject(this.formInline.agent_id, this.formInline.agent_real_name)
            }
            this.search(0)
          })
        }).catch((error) => {
          console.log(error)
          departAgents(res.data.departId).then(response => {
            this.statistics_type = response.data.result.statistics_type
            if (response.data.result.statistics_type === 'depart') {
              this.staffOptions = response.data.result.sub_departs
              this.formInline.staff = response.data.result.sub_departs[0].depart_id
              this.formInline.sub_depart_id = response.data.result.sub_departs.map(function(item, index) {
                return item.depart_id
              })
              this.formInline.sub_depart_name = response.data.result.sub_departs.map(function(item, index) {
                return item.depart_name
              })
            } else {
              this.staffOptions = response.data.result.agents
              this.formInline.staff = response.data.result.agents[0].agent_id
              this.formInline.agent_id = response.data.result.agents.map(function(item, index) {
                return item.agent_id
              })
              this.formInline.agent_real_name = response.data.result.agents.map(function(item, index) {
                return item.real_name
              })
              this.formInline.agentMap = _.zipObject(this.formInline.agent_id, this.formInline.agent_real_name)
            }

            permsresultreportstaff(res.data.agentid).then(re => {
              this.departPermission = false
              this.staffPermission = true
              this.search1(res.data.agentid)
            }).catch((err) => {
              console.log(err)
            })
          })
        })
      })
    },
    created() {
      this.initWebSocket()
    },
    destroyed() {
      this.websock.close()
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
      initWebSocket() { // 初始化weosocket
        const wsuri = process.env.TUI_WS_SERVERURL + '/realtime_report_quality_result'// ws地址
        this.websock = new WebSocket(wsuri)
        this.websock.onopen = this.websocketonopen
        this.websock.onerror = this.websocketonerror
        this.websock.onmessage = this.websocketonmessage
        this.websock.onclose = this.websocketclose
      },
      websocketonopen() {
        console.log('WebSocket连接成功')
      },
      websocketonerror(e) { // 错误
        console.log('WebSocket连接发生错误')
      },
      websocketonmessage(e) { // 数据接收
        if (e) {
          if (this.getStartTimestamp(Date.parse(this.timeValueClone[0]), this.formInline.timeClone) < Date.parse(new Date()) < this.getEndTimestamp(Date.parse(this.timeValueClone[1]), this.formInline.timeClone)) {
            if (this.departPermission) {
              this.searchEvery('searchEvery')
            }
            if (this.staffPermission) {
              this.searchEvery1(this.staffAgentid)
            }
          }
        }
      },
      // websocketsend(agentData) { // 数据发送
      //   this.websock.send(agentData)
      // },
      websocketclose(e) { // 关闭
        console.log(e)
      },
      getSummaryMethod({ columns, data }) {
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计'
            return
          }
          const values = data.map(item => Number(item[column.property]))
          const totalSum = data.map(item => Number(Number(item.avg_score) * Number(item.count)))
          const median = (data.map(item => Number(Number(item.median).toFixed(2)))).sort(function(a, b) {
            return a - b
          })
          if (index < columns.length - 1) {
            if (index === 2) {
              if (median.length % 2 === 1) {
                sums[index] = median[parseInt(median.length / 2)].toFixed(2)
              } else {
                sums[index] = ((median[median.length / 2] + median[median.length / 2 - 1]) / 2).toFixed(2)
              }
            } else {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                  return prev + curr
                } else {
                  return prev
                }
              }, 0)
            }
          } else {
            sums[index] = totalSum.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            sums[index] = sums[index] / sums[index - 2] ? sums[index] / sums[index - 2] : 0
            sums[index] = sums[index].toFixed(2)
          }
        })
        return sums
      },
      getStartTimestamp(timeStr, type) {
        let startTime
        if (type === 'hour') {
          startTime = moment(timeStr, 'x').minute(0).second(0).millisecond(0)
        } else {
          startTime = moment(timeStr, 'x')
        }
        return startTime.valueOf()
      },
      getEndTimestamp(timeStr, type) {
        let endTime
        if (type) {
          switch (type) {
            case 'hour':
              endTime = moment(timeStr, 'x').minute(0).second(0).millisecond(0).add(1, 'hours').subtract(1, 'ms')
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
      handleCurrentChangeStatics(val) {
        const params = {
          statistics_type: this.statistics_type,
          depart_id: this.departId,
          grade_id: this.formInline.product,
          campaign_id: this.formInline.campaignId,
          time_dimension: this.formInline.timeClone,
          // start_time: this.getStartTimestamp(Date.parse(this.timeValueClone[0]), this.formInline.timeClone),
          // end_time: this.getEndTimestamp(Date.parse(this.timeValueClone[1]), this.formInline.timeClone), // val || val === 'search' ? this.timeValue[1] :
          pageNo: val,
          pageSize: 10
        }

        if (!this.timeValueClone[0] || !this.timeValueClone[1]) {
          Message({
            message: '请选择操作时间',
            type: 'error',
            duration: 3 * 1000
          })
          return
        }

        if (this.timeValueClone[0] && this.timeValueClone[0].getDate()) {
          params.start_time = this.getStartTimestamp(Date.parse(this.timeValueClone[0]), this.formInline.timeClone)
        }
        if (this.timeValueClone[1] && this.timeValueClone[1].getDate()) {
          params.end_time = this.getEndTimestamp(Date.parse(this.timeValueClone[1]), this.formInline.timeClone)
        }
        if (this.statistics_type === 'depart') {
          params.sub_depart_id = this.formInline.sub_depart_id.join(',')
        } else {
          params.agent_id = this.formInline.agent_id.join(',')
        }

        qualityResultReportstatistics(params).then(response => {
          this.tableDataTime1 = this.obj.result
          this.paginationStatics = {
            pageNo: Number(response.data.pageNo),
            pageSize: Number(response.data.pageSize),
            totalCount: response.data.total_count,
            totalPage: null
          }
        })
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
        const params = {
          statistics_type: this.statistics_type,
          depart_id: this.departId,
          campaign_id: this.formInline.campaignId,
          time_dimension: this.formInline.timeClone,
          // start_time: this.getStartTimestamp(Date.parse(this.timeValueClone[0]), this.formInline.timeClone),
          // end_time: this.getEndTimestamp(Date.parse(this.timeValueClone[1]), this.formInline.timeClone),
          pageNo: val,
          pageSize: this.pageSize[this.currentIndex]
        }
        if (this.timeValueClone[0] && this.timeValueClone[0].getDate()) {
          params.start_time = this.getStartTimestamp(Date.parse(this.timeValueClone[0]), this.formInline.timeClone)
        }
        if (this.timeValueClone[1] && this.timeValueClone[1].getDate()) {
          params.end_time = this.getEndTimestamp(Date.parse(this.timeValueClone[1]), this.formInline.timeClone)
        }
        if (this.statistics_type === 'depart') {
          params.sub_depart_id = this.formInline.sub_depart_id[this.currentIndex]
        } else {
          params.agent_id = this.formInline.agent_id[this.currentIndex]
        }

        qualityResultReportreportAgent(params).then(response => {
          this.pageNo.splice(this.currentIndex, 1, Number(response.data.pageNo))
          this.pageSize.splice(this.currentIndex, 1, Number(response.data.pageSize))
          this.totalCount.splice(this.currentIndex, 1, response.data.total_count)
          this.tableData.splice(this.currentIndex, 1, response.data.result)
        })
      },
      handleCurrentChangeAgent(val) {
        const params = {
          statistics_type: this.statistics_type,
          depart_id: this.departId,
          grade_id: this.formInline.product,
          campaign_id: this.formInline.campaignId,
          time_dimension: this.formInline.timeClone,
          agent_id: this.staffAgentid,
          // start_time: this.getStartTimestamp(Date.parse(this.timeValueClone[0]), this.formInline.timeClone),
          // end_time: this.getEndTimestamp(Date.parse(this.timeValueClone[1]), this.formInline.timeClone),
          pageNo: val,
          pageSize: this.paginationAgent.pageSize
        }
        if (this.timeValueClone[0] && this.timeValueClone[0].getDate()) {
          params.start_time = this.getStartTimestamp(Date.parse(this.timeValueClone[0]), this.formInline.timeClone)
        }
        if (this.timeValueClone[1] && this.timeValueClone[1].getDate()) {
          params.end_time = this.getEndTimestamp(Date.parse(this.timeValueClone[1]), this.formInline.timeClone)
        }
        qualityResultReportreportAgent(params).then(response => {
          this.tableDataAgent = response.data.result
          this.paginationAgent.pageNo = Number(response.data.pageNo)
          this.paginationAgent.pageSize = Number(response.data.pageSize)
          this.paginationAgent.totalCount = response.data.total_count
        })
      },
      searchStaff() {
        if (this.statistics_type === 'depart' && this.contentIndex >= this.formInline.sub_depart_id.length) {
          return this.tableData
        } else if (this.statistics_type === 'agent' && this.contentIndex >= this.formInline.agent_id.length) {
          return this.tableData
        }

        const params = {
          statistics_type: this.statistics_type,
          depart_id: this.departId,
          grade_id: this.formInline.product,
          campaign_id: this.formInline.campaignId,
          time_dimension: this.formInline.timeClone,
          // start_time: this.getStartTimestamp(Date.parse(this.timeValueClone[0]), this.formInline.timeClone),
          // end_time: this.getEndTimestamp(Date.parse(this.timeValueClone[1]), this.formInline.timeClone),
          pageNo: 1,
          pageSize: 5
        }
        if (this.timeValueClone[0] && this.timeValueClone[0].getDate()) {
          params.start_time = this.getStartTimestamp(Date.parse(this.timeValueClone[0]), this.formInline.timeClone)
        }
        if (this.timeValueClone[1] && this.timeValueClone[1].getDate()) {
          params.end_time = this.getEndTimestamp(Date.parse(this.timeValueClone[1]), this.formInline.timeClone)
        }
        if (this.statistics_type === 'depart') {
          params.sub_depart_id = this.formInline.sub_depart_id[this.contentIndex]
        } else {
          params.agent_id = this.formInline.agent_id[this.contentIndex]
        }

        qualityResultReportreportAgent(params).then(response => {
          this.pageNo.push(Number(response.data.pageNo))
          this.pageSize.push(Number(response.data.pageSize))
          this.totalCount.push(response.data.total_count)
          this.tableData.push(response.data.result)
          this.contentIndex++
          this.searchStaff()
        })
      },
      searchAgentStaff(val) {
        const params = {
          statistics_type: this.statistics_type,
          depart_id: this.departId,
          grade_id: this.formInline.product,
          campaign_id: this.formInline.campaignId,
          time_dimension: this.formInline.timeClone,
          // start_time: this.getStartTimestamp(Date.parse(this.timeValueClone[0]), this.formInline.timeClone),
          // end_time: this.getEndTimestamp(Date.parse(this.timeValueClone[1]), this.formInline.timeClone),
          pageNo: 1,
          pageSize: 10
        }
        if (this.timeValueClone[0] && this.timeValueClone[0].getDate()) {
          params.start_time = this.getStartTimestamp(Date.parse(this.timeValueClone[0]), this.formInline.timeClone)
        }
        if (this.timeValueClone[1] && this.timeValueClone[1].getDate()) {
          params.end_time = this.getEndTimestamp(Date.parse(this.timeValueClone[1]), this.formInline.timeClone)
        }
        if (this.statistics_type === 'depart') {
          params.sub_depart_id = val
        } else {
          params.agent_id = val
        }

        qualityResultReportreportAgent(params).then(response => {
          this.tableDataAgent = response.data.result
          this.paginationAgent.pageNo = Number(response.data.pageNo)
          this.paginationAgent.pageSize = Number(response.data.pageSize)
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
            text: '质检结果报表',
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
            data: ['质检表单数量', '计分中位数', '计分平均数']
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
            name: '数量/个',
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
            name: '分',
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
            start: 0,
            end: 100,
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
            name: '质检表单数量',
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
            name: '计分中位数',
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
            data: this.median_score
          }, {
            name: '计分平均数',
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
            data: this.avg_score
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
            text: this.statistics_type === 'depart' ? '单个时间各部门质检结果报表' : '单个时间各员工质检结果报表',
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
            data: ['质检表单数量', '计分中位数', '计分平均数']
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
            data: this.statistics_type === 'depart' ? this.formInline.sub_depart_name : this.formInline.agent_id
          }],
          yAxis: [{
            type: 'value',
            name: '数量/个',
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
            name: '分',
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
            start: 0,
            end: 100,
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
            name: '质检表单数量',
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
            name: '计分中位数',
            // type: 'bar',
            // stack: 'total',
            // barMaxWidth: 35,
            type: 'line',
            symbol: 'circle',
            // stack: 'total',
            yAxisIndex: 1,
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
            data: this.median_scoreTime
          }, {
            name: '计分平均数',
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
            data: this.avg_scoreTime
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
            text: this.statistics_type === 'depart' ? '单个部门各时间段质检结果报表' : '单个员工各时间段质检结果报表',
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
            data: ['质检表单数量', '计分中位数', '计分平均数']
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
            name: '数量/个',
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
            name: '分',
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
            start: 0,
            end: 100,
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
            name: '质检表单数量',
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
            name: '计分中位数',
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
            data: this.median_scoreAgent
          }, {
            name: '计分平均数',
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
            data: this.avg_scoreAgent
          }
          ]
        })
      },
      campaignChange(val) {
        this.productList = []
        getGradesByCampaignId(val).then(res => {
          if (res.data.data) {
            // for (let i = 0; i < this.allProductList.length; i++) {
            //   if (res.data.data.indexOf(this.allProductList[i].productId) !== -1) {
            //     this.productList.push(this.allProductList[i])
            //   }
            // }
            this.productList = res.data.data
          }
        })
      },
      time_dimensionChange(val) {
        this.timeValue = []
      },
      timeChange(val) {
        const params = {
          statistics_type: this.statistics_type,
          depart_id: this.departId,
          grade_id: this.formInline.product,
          campaign_id: this.formInline.campaignId,
          time_dimension: this.formInline.timeClone,
          time: val
          // start_time: this.getStartTimestamp(Date.parse(this.timeValueClone[0]), this.formInline.timeClone),
          // end_time: this.getEndTimestamp(Date.parse(this.timeValueClone[1]), this.formInline.timeClone)
        }
        if (this.timeValueClone[0] && this.timeValueClone[0].getDate()) {
          params.start_time = this.getStartTimestamp(Date.parse(this.timeValueClone[0]), this.formInline.timeClone)
        }
        if (this.timeValueClone[1] && this.timeValueClone[1].getDate()) {
          params.end_time = this.getEndTimestamp(Date.parse(this.timeValueClone[1]), this.formInline.timeClone)
        }
        if (this.statistics_type === 'depart') {
          params.sub_depart_id = this.formInline.sub_depart_id.join(',')
        } else {
          params.agent_id = this.formInline.agent_id.join(',')
        }

        qualityResultReportreportAgent(params).then(response => {
          if (response.data.result && response.data.result.length) {
            this.countTime = response.data.result.map(function(item, index) {
              return item.count
            })
            this.median_scoreTime = response.data.result.map(function(item, index) {
              return item.median
            })
            this.avg_scoreTime = response.data.result.map(function(item, index) {
              return item.avg_score
            })
            this.initChart1()
          }
        })
      },
      agentChange(val, page) {
        const params = {
          statistics_type: this.statistics_type,
          depart_id: this.departId,
          grade_id: this.formInline.product,
          campaign_id: this.formInline.campaignId,
          time_dimension: this.formInline.timeClone,
          // start_time: this.getStartTimestamp(Date.parse(this.timeValueClone[0]), this.formInline.timeClone),
          // end_time: this.getEndTimestamp(Date.parse(this.timeValueClone[1]), this.formInline.timeClone),
          pageNo: page || 1,
          pageSize: 8
        }
        if (this.timeValueClone[0] && this.timeValueClone[0].getDate()) {
          params.start_time = this.getStartTimestamp(Date.parse(this.timeValueClone[0]), this.formInline.timeClone)
        }
        if (this.timeValueClone[1] && this.timeValueClone[1].getDate()) {
          params.end_time = this.getEndTimestamp(Date.parse(this.timeValueClone[1]), this.formInline.timeClone)
        }
        if (this.statistics_type === 'depart') {
          params.sub_depart_id = val
        } else {
          params.agent_id = val
        }

        qualityResultReportreportAgent(params).then(response => {
          if (response.data.result && response.data.result.length) {
            this.countAgent = response.data.result.map(function(item, index) {
              return item.count
            })
            this.avg_scoreAgent = response.data.result.map(function(item, index) {
              return item.avg_score
            })
            this.median_scoreAgent = response.data.result.map(function(item, index) {
              return item.median
            })
            this.agentTime = response.data.result.map(function(item, index) {
              return item.time_dimension
            })
            this.initChart2()
          }
          this.paginationStaffPage = {
            pageNo: Number(response.data.pageNo),
            pageSize: Number(response.data.pageSize),
            totalCount: response.data.total_count,
            totalPage: null
          }
        })
      },
      teamData(val) {
        const params = {
          statistics_type: this.statistics_type,
          depart_id: this.departId,
          grade_id: this.formInline.product,
          campaign_id: this.formInline.campaignId,
          time_dimension: this.formInline.timeClone,
          // start_time: this.getStartTimestamp(Date.parse(this.timeValueClone[0]), this.formInline.timeClone),
          // end_time: this.getEndTimestamp(Date.parse(this.timeValueClone[1]), this.formInline.timeClone), // val || val === 'search' ? this.timeValue[1] :
          pageNo: val && val !== 'search' ? this.formInline.from : 1,
          pageSize: 10
        }

        if (!this.timeValueClone[0] || !this.timeValueClone[1]) {
          Message({
            message: '请选择操作时间',
            type: 'error',
            duration: 3 * 1000
          })
          return
        }

        if (this.timeValueClone[0] && this.timeValueClone[0].getDate()) {
          params.start_time = this.getStartTimestamp(Date.parse(this.timeValueClone[0]), this.formInline.timeClone)
        }
        if (this.timeValueClone[1] && this.timeValueClone[1].getDate()) {
          params.end_time = this.getEndTimestamp(Date.parse(this.timeValueClone[1]), this.formInline.timeClone)
        }
        if (this.statistics_type === 'depart') {
          params.sub_depart_id = this.formInline.sub_depart_id.join(',')
        } else {
          params.agent_id = this.formInline.agent_id.join(',')
        }

        qualityResultReportstatistics(params).then(response => {
          this.obj = response.data
          this.tableDataTime1 = this.obj.result
          if (response.data.result && this.obj.result.length) {
            this.count = this.obj.result.map(function(item, index) {
              return item.count
            })
            this.avg_score = this.obj.result.map(function(item, index) {
              return item.avg_score
            })
            this.median_score = this.obj.result.map(function(item, index) {
              return item.median
            })
            this.initChart()
          }
          this.timeOptions = response.data.result.map(function(item, index) {
            return item.time_dimension
          })
          this.formInline.time_dimension = this.timeOptions[0]
          this.pagination = {
            pageNo: Number(response.data.pageNo),
            pageSize: Number(response.data.pageSize),
            totalCount: response.data.total_count,
            totalPage: null
          }
          if (val !== 'searchEvery') {
            this.paginationStatics = {
              pageNo: Number(response.data.pageNo),
              pageSize: Number(response.data.pageSize),
              totalCount: response.data.total_count,
              totalPage: null
            }
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
          // this.timeValue[0] = Date.parse(this.timeValue[0]) - 24 * 3600 * 1000
          // this.timeValue[0] = new Date(this.timeValue[0])
          // this.timeValue[1] = Date.parse(this.timeValue[1]) - 24 * 3600 * 1000
          // this.timeValue[1] = new Date(this.timeValue[1])
          this.timeValue[0] = this.timeValue1 ? new Date(Date.parse(this.timeValue1[0]) - 24 * 3600 * 1000) : null
          this.timeValue[1] = this.timeValue1 ? new Date(Date.parse(this.timeValue1[1]) - 24 * 3600 * 1000) : null
        }
        if (this.formInline.time === 'month' || this.formInline.time === 'year') {
          this.timeValue[0] = this.timeValue1 ? this.timeValue1[0] : null
          this.timeValue[1] = this.timeValue1 ? this.timeValue1[1] : null
        }
        if (this.timeValue && this.timeValue[0] && this.timeValue[0].getDate() && this.timeValue[1] && this.timeValue[1].getDate() && (this.timeValue[0] > this.timeValue[1])) {
          Message({
            message: '开始时间不能大于结束时间',
            type: 'error',
            duration: 3 * 1000
          })
        } else {
          this.timeValueClone[0] = this.timeValue ? this.timeValue[0] : null
          this.timeValueClone[1] = this.timeValue ? this.timeValue[1] : null
          this.formInline.timeClone = this.formInline.time
          this.pageNo = []
          this.pageSize = []
          this.totalCount = []
          this.formInline.product = this.formInline.productClone
          this.formInline.campaignId = this.formInline.campaignIdClone

          const params = {
            statistics_type: this.statistics_type,
            depart_id: this.departId,
            grade_id: this.formInline.product,
            campaign_id: this.formInline.campaignId,
            time_dimension: this.formInline.timeClone,
            sub_depart_id: this.formInline.sub_depart_id.join(',')
            // start_time: this.getStartTimestamp(Date.parse(this.timeValueClone[0]), this.formInline.timeClone),
            // end_time: this.getEndTimestamp(Date.parse(this.timeValueClone[1]), this.formInline.timeClone)
          }
          if (this.timeValueClone[0] && this.timeValueClone[0].getDate()) {
            params.start_time = this.getStartTimestamp(Date.parse(this.timeValueClone[0]), this.formInline.timeClone)
          }
          if (this.timeValueClone[1] && this.timeValueClone[1].getDate()) {
            params.end_time = this.getEndTimestamp(Date.parse(this.timeValueClone[1]), this.formInline.timeClone)
          }
          if (this.statistics_type === 'depart') {
            params.sub_depart_id = this.formInline.sub_depart_id.join(',')
          } else {
            params.agent_id = this.formInline.agent_id.join(',')
          }
          qualityResultReporttotalAgent(params).then(response => {
            this.tableDataAgent1 = response.data.result
            this.tableDataAgent2 = response.data.total_result
          })
          this.teamData(val)
        }
      },
      searchEvery(val) {
        if (this.timeValue && this.timeValue[0] && this.timeValue[0].getDate() && this.timeValue[1] && this.timeValue[1].getDate() && (this.timeValue[0] > this.timeValue[1])) {
          Message({
            message: '开始时间不能大于结束时间',
            type: 'error',
            duration: 3 * 1000
          })
        } else {
          this.pageNo = []
          this.pageSize = []
          this.totalCount = []

          const params = {
            statistics_type: this.statistics_type,
            depart_id: this.departId,
            grade_id: this.formInline.product,
            campaign_id: this.formInline.campaignId,
            time_dimension: this.formInline.timeClone,
            sub_depart_id: this.formInline.sub_depart_id.join(',')
            // start_time: this.getStartTimestamp(Date.parse(this.timeValueClone[0]), this.formInline.timeClone),
            // end_time: this.getEndTimestamp(Date.parse(this.timeValueClone[1]), this.formInline.timeClone)
          }
          if (this.timeValueClone[0] && this.timeValueClone[0].getDate()) {
            params.start_time = this.getStartTimestamp(Date.parse(this.timeValueClone[0]), this.formInline.timeClone)
          }
          if (this.timeValueClone[1] && this.timeValueClone[1].getDate()) {
            params.end_time = this.getEndTimestamp(Date.parse(this.timeValueClone[1]), this.formInline.timeClone)
          }
          if (this.statistics_type === 'depart') {
            params.sub_depart_id = this.formInline.sub_depart_id.join(',')
          } else {
            params.agent_id = this.formInline.agent_id.join(',')
          }

          qualityResultReporttotalAgent(params).then(response => {
            this.tableDataAgent1 = response.data.result
            this.tableDataAgent2 = response.data.total_result
          })
          this.teamData(val)
        }
      },
      search1(val) {
        if (this.formInline.time === 'week') {
          // this.timeValue[0] = Date.parse(this.timeValue[0]) - 24 * 3600 * 1000
          // this.timeValue[0] = new Date(this.timeValue[0])
          // this.timeValue[1] = Date.parse(this.timeValue[1]) - 24 * 3600 * 1000
          // this.timeValue[1] = new Date(this.timeValue[1])
          this.timeValue[0] = this.timeValue1 ? new Date(Date.parse(this.timeValue1[0]) - 24 * 3600 * 1000) : null
          this.timeValue[1] = this.timeValue1 ? new Date(Date.parse(this.timeValue1[1]) - 24 * 3600 * 1000) : null
        }
        if (this.formInline.time === 'month' || this.formInline.time === 'year') {
          this.timeValue[0] = this.timeValue1 ? this.timeValue1[0] : null
          this.timeValue[1] = this.timeValue1 ? this.timeValue1[1] : null
        }
        if (this.timeValue && this.timeValue[0] && this.timeValue[0].getDate() && this.timeValue[1] && this.timeValue[1].getDate() && (this.timeValue[0] > this.timeValue[1])) {
          Message({
            message: '开始时间不能大于结束时间',
            type: 'error',
            duration: 3 * 1000
          })
        } else {
          this.formInline.product = this.formInline.productClone
          this.formInline.campaignId = this.formInline.campaignIdClone
          this.timeValueClone[0] = this.timeValue ? this.timeValue[0] : null
          this.timeValueClone[1] = this.timeValue ? this.timeValue[1] : null
          this.formInline.timeClone = this.formInline.time
          this.agentChange(val)
          this.searchAgentStaff(val)
        }
      },
      searchEvery1(val) {
        this.agentChange(val)
        this.searchAgentStaff(val)
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
