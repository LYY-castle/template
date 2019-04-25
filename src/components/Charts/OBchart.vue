<template>
  <div style="width: 100%;height: 90%" v-if="departPermission">
    <el-collapse v-model="formContainerOpen" class="form-container" @change="handleChangeAcitve" style="position:relative;">
      <span class="form-more bold" style="line-height: 24px;font-size: 14px;float:right;margin-right:6px;color:#57AFFF;position:absolute;top:12px;right:40px;">收起</span>
      <el-collapse-item title="筛选条件" name="1">
        <el-form :inline="true" class="demo-form-inline" size="small">
          <el-form-item label="活动名称:" v-show="activeNameList && activeNameList.length > 0">
            <el-select v-model="formInline.campaignIdClone" placeholder="活动名称">
              <el-option value="" label="所有活动"></el-option>
              <el-option v-for="item in activeNameList" :key="item.campaignId" :label="item.campaignName" :value="item.campaignId"></el-option>
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
            <el-button @click="reset">重置</el-button>
            <!--<el-button type="success"><a href="http://node21:9800/crm/report/export/CTI%E6%8A%A5%E8%A1%A8%E6%95%B0%E6%8D%AE_20181128155302.xlsx" download>下载</a></el-button>-->
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>

    <el-row class="table-container">
      <el-row class="margin-bottom-20">
        <div class="font14 bold">合计表</div>
      </el-row>
      <el-row>
        <el-table
          :header-row-style="headerRow"
          :data="tableDataAgent2"
          ref="multipleTable"
          tooltip-effect="dark"
          style="width: 100%;">
          <el-table-column
            align="center"
            prop="agent_id"
            :label="statistics_type === 'depart'?'部门合计':'员工合计'">
          </el-table-column>
          <el-table-column
            align="center"
            prop="new_first_dial_task_count"
            label="新增首拨数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="new_success_contact_task_count"
            label="新增成功数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="new_fail_contact_task_count"
            label="新增失败数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="new_appoint_contact_task_count"
            label="新增预约数量">
          </el-table-column>
        </el-table>
      </el-row>
    </el-row>

    <el-row class="table-container">
      <el-row class="margin-bottom-20">
        <div class="font14 bold">时间合计表</div>
      </el-row>
      <el-row>
        <el-table
          :header-row-style="headerRow"
          :data="tableDataTime1"
          ref="multipleTable"
          tooltip-effect="dark"
          style="width: 100%;margin-top: 1%;">
          <el-table-column
            align="center"
            prop="time_dimension"
            label="时间段">
          </el-table-column>
          <el-table-column
            align="center"
            prop="new_first_dial_task_count"
            label="新增首拨数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="new_success_contact_task_count"
            label="新增成功数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="new_fail_contact_task_count"
            label="新增失败数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="new_appoint_contact_task_count"
            label="新增预约数量">
          </el-table-column>
        </el-table>
      </el-row>
      <el-row style="margin-top:20px;">
        <el-pagination
          @current-change="handleCurrentChangeStatics"
          :current-page.sync="paginationStatics.pageNo"
          :page-size="paginationStatics.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="paginationStatics.totalCount" style="text-align: right">
        </el-pagination>
      </el-row>
    </el-row>

    <el-row class="table-container">
      <el-row class="margin-bottom-20">
        <div class="font14 bold">{{statistics_type === 'depart'?'部门':'员工'}}合计表</div>
      </el-row>
      <el-row>
        <el-table
          :header-row-style="headerRow"
          :data="tableDataAgent1"
          ref="multipleTable"
          tooltip-effect="dark"
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
            prop="new_first_dial_task_count"
            label="新增首拨数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="new_success_contact_task_count"
            label="新增成功数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="new_fail_contact_task_count"
            label="新增失败数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="new_appoint_contact_task_count"
            label="新增预约数量">
          </el-table-column>
        </el-table>
      </el-row>
    </el-row>

    <el-row class="table-container">
      <el-row class="margin-bottom-20">
        <div class="font14 bold">{{statistics_type === 'depart'?'下属部门详情':'下属员工详情'}}</div>
      </el-row>
      <div style="margin-top:20px;" v-for="(item, index) in staffOptions">
        <el-row>
          <el-table
            class="report-table"
            :header-row-style="headerRow"
            :data="tableData[index]"
            ref="multipleTable"
            tooltip-effect="dark"
            :span-method="objectSpanMethod"
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
              prop="new_first_dial_task_count"
              label="新增首拨数量">
            </el-table-column>
            <el-table-column
              align="center"
              prop="new_success_contact_task_count"
              label="新增成功数量">
            </el-table-column>
            <el-table-column
              align="center"
              prop="new_fail_contact_task_count"
              label="新增失败数量">
            </el-table-column>
            <el-table-column
              align="center"
              prop="new_appoint_contact_task_count"
              label="新增预约数量">
            </el-table-column>
          </el-table>
        </el-row>
        <el-row style="margin-top:15px;">
          <div @click="page(item,index)">
            <el-pagination
              @current-change="handleCurrentChange1"
              :current-page.sync="pageNo[index]"
              :page-size="pageSize[index]"
              layout="total, prev, pager, next, jumper"
              :total="totalCount[index]" style="text-align: right">
            </el-pagination>
          </div>
        </el-row>
      </div>
    </el-row>

    <div :class="className" :id="id" style="height: 100%;width: 100%;display:none;"></div>
    <!-- <div style="margin-top: 1%">
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
    </div> -->

    <!-- <el-form :inline="true" class="demo-form-inline" size="small" style="margin-top: 10px;margin-bottom: 5px;">
      <el-form-item label="时间选项:" style="margin-bottom: 0">
        <el-select v-model="formInline.time_dimension" @change="timeChange">
          <el-option v-for="item in timeOptions" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
    </el-form> -->
    <div :class="className" id="staff" style="height: 100%;width: 100%;display:none;"></div>

    <!-- <el-form :inline="true" class="demo-form-inline" size="small" style="margin-top: 10px;margin-bottom: 5px;">
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
    </el-form> -->
    <div :class="className" :id="time" style="height: 100%;width: 100%;display:none;"></div>
    <!-- <div style="margin-top: 1%">
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
    </div> -->

  </div>

  <div style="width: 100%;height: 90%" v-else-if="staffPermission">
    <el-collapse v-model="formContainerOpen" class="form-container" @change="handleChangeAcitve" style="position:relative;">
      <span class="form-more bold" style="line-height: 24px;font-size: 14px;float:right;margin-right:6px;color:#57AFFF;position:absolute;top:12px;right:40px;">收起</span>
      <el-collapse-item title="筛选条件" name="1">
        <el-form :inline="true" class="demo-form-inline" size="small">
          <el-form-item label="活动名称:" v-show="activeNameList && activeNameList.length > 0">
            <el-select v-model="formInline.campaignIdClone" placeholder="活动名称">
              <el-option value="" label="所有活动"></el-option>
              <el-option v-for="item in activeNameList" :key="item.campaignId" :label="item.campaignName" :value="item.campaignId"></el-option>
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
            <el-button @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <el-row class="table-container">
      <el-row class="margin-bottom-20">
        <div class="font14 bold">详情表</div>
      </el-row>
      <el-row>
        <el-table
          :header-row-style="headerRow"
          :data="tableDataAgent"
          ref="multipleTable"
          tooltip-effect="dark"
          style="width: 100%;">
          <el-table-column
            align="center"
            prop="time_dimension"
            label="时间段">
          </el-table-column>
          <el-table-column
            align="center"
            prop="new_first_dial_task_count"
            label="新增首拨数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="new_success_contact_task_count"
            label="新增成功数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="new_fail_contact_task_count"
            label="新增失败数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="new_appoint_contact_task_count"
            label="新增预约数量">
          </el-table-column>
        </el-table>
      </el-row>
      <el-row style="margin-top:20px;">
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
    </el-row>

    <div :class="className" :id="time" style="height: 100%;width: 100%;display:none;"></div>
    <!-- <div style="margin-top: 1%">
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
    </div> -->
  </div>
</template>

<script>
  import _ from 'lodash'
  import echarts from 'echarts'
  import resize from './mixins/resize'
  import { obstatistics, departAgents, getDepartId, obtotalAgent, obreportAgent } from '@/api/ctiReport'
  import { Message } from 'element-ui'
  import { permsobdepart, permsobstaff } from '@/api/reportPermission'
  import { permsManager } from '@/api/permission'
  import { findCampaignAllByUser } from '@/api/monitor_list_single'
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
    computed: {
      // getNav() {
      //   return this.$store.state.app.sidebar.opened
      // }
    },
    data() {
      return {
        formContainerOpen: '1',
        statistics_type: '',
        departId: '',
        week: {
          firstDayOfWeek: 1
        },
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
          sub_depart_id: [],
          sub_depart_name: []
        },
        tableData: [],
        tableDataAgent1: [],
        tableDataAgent2: [],
        tableDataTime1: [],
        tableDataTime2: [],
        tableDataAgent: [],
        new_first_dial_task_count: [],
        new_success_contact_task_count: [],
        new_fail_contact_task_count: [],
        new_appoint_contact_task_count: [],
        new_first_dial_task_countTime: [],
        new_success_contact_task_countTime: [],
        new_fail_contact_task_countTime: [],
        new_appoint_contact_task_countTime: [],
        new_first_dial_task_countAgent: [],
        new_success_contact_task_countAgent: [],
        new_fail_contact_task_countAgent: [],
        new_appoint_contact_task_countAgent: [],
        agentTime: [],
        staffAgentid: null,
        websock: null
      }
    },
    mounted() {
      this.handleChangeAcitve()
      findCampaignAllByUser().then(response => {
        this.activeNameList = response.data.data
      })
      getDepartId().then(res => {
        this.staffAgentid = res.data.agentid
        this.departId = res.data.departId
        permsManager(this.agentId).then(response => {
          const code = parseInt(response.data.code)
          if (code === 200) {
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
          } else if (code === 403) {
            permsobdepart(res.data.agentid).then(r => {
              const code = parseInt(r.data.code)
              if (code === 200) {
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
              } else if (code === 403) {
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

                  permsobstaff(res.data.agentid).then(re => {
                    const code = parseInt(re.data.code)
                    if (code === 200) {
                      this.departPermission = false
                      this.staffPermission = true
                      this.search1(res.data.agentid)
                    }
                  }).catch((err) => {
                    throw err
                  })
                })
              }
            }).catch((error) => {
              throw error
            })
          }
        }).catch(error => {
          throw error
        })
      })
    },
    created() {
      this.initWebSocket()
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
    destroyed() {
      this.websock.close()
    },
    methods: {
      handleChangeAcitve(active = ['1']) {
        if (active.length) {
          $('.form-more').text('收起')
        } else {
          $('.form-more').text('更多')
        }
      },
      initWebSocket() { // 初始化weosocket
        const wsuri = process.env.TUI_WS_SERVERURL + '/realtime_report_ob'// ws地址
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
      handleCurrentChangeStatics(val) {
        const params = {
          statistics_type: this.statistics_type,
          depart_id: this.departId,
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

        if (this.timeValueClone[0]) {
          params.start_time = this.getStartTimestamp(Date.parse(this.timeValueClone[0]), this.formInline.timeClone)
        }
        if (this.timeValueClone[1]) {
          params.end_time = this.getEndTimestamp(Date.parse(this.timeValueClone[1]), this.formInline.timeClone)
        }

        if (this.statistics_type === 'depart') {
          params.sub_depart_id = this.formInline.sub_depart_id.join(',')
        } else {
          params.agent_id = this.formInline.agent_id.join(',')
        }

        obstatistics(params).then(response => {
          this.tableDataTime1 = response.data.result
          this.paginationStatics = {
            pageNo: response.data.pageNo,
            pageSize: response.data.pageSize,
            totalCount: response.data.total_count,
            totalPage: null
          }
        })
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
        const params = {
          statistics_type: this.statistics_type,
          depart_id: this.departId,
          campaign_id: this.formInline.campaignId,
          time_dimension: this.formInline.time,
          // start_time: this.getStartTimestamp(Date.parse(this.timeValueClone[0]), this.formInline.time),
          // end_time: this.getEndTimestamp(Date.parse(this.timeValueClone[1]), this.formInline.time),
          pageNo: val,
          pageSize: this.pageSize[this.currentIndex]
        }
        if (this.timeValueClone[0] && this.timeValueClone[0].getDate()) {
          params.start_time = this.getStartTimestamp(Date.parse(this.timeValueClone[0]), this.formInline.time)
        }
        if (this.timeValueClone[1] && this.timeValueClone[1].getDate()) {
          params.end_time = this.getEndTimestamp(Date.parse(this.timeValueClone[1]), this.formInline.time)
        }

        if (this.statistics_type === 'depart') {
          params.sub_depart_id = this.formInline.sub_depart_id[this.currentIndex]
        } else {
          params.agent_id = this.formInline.agent_id[this.currentIndex]
        }

        obreportAgent(params).then(response => {
          this.pageNo.splice(this.currentIndex, 1, response.data.pageNo)
          this.pageSize.splice(this.currentIndex, 1, response.data.pageSize)
          this.totalCount.splice(this.currentIndex, 1, response.data.total_count)
          this.tableData.splice(this.currentIndex, 1, response.data.result)
        })
      },
      handleCurrentChangeAgent(val) {
        const params = {
          statistics_type: this.statistics_type,
          depart_id: this.departId,
          campaign_id: this.formInline.campaignId,
          time_dimension: this.formInline.time,
          agent_id: this.staffAgentid,
          // start_time: this.getStartTimestamp(Date.parse(this.timeValueClone[0]), this.formInline.time),
          // end_time: this.getEndTimestamp(Date.parse(this.timeValueClone[1]), this.formInline.time),
          pageNo: val,
          pageSize: this.paginationAgent.pageSize
        }
        if (this.timeValueClone[0] && this.timeValueClone[0].getDate()) {
          params.start_time = this.getStartTimestamp(Date.parse(this.timeValueClone[0]), this.formInline.time)
        }
        if (this.timeValueClone[1] && this.timeValueClone[1].getDate()) {
          params.end_time = this.getEndTimestamp(Date.parse(this.timeValueClone[1]), this.formInline.time)
        }
        obreportAgent(params).then(response => {
          this.tableDataAgent = response.data.result
          this.paginationAgent.pageNo = response.data.pageNo
          this.paginationAgent.pageSize = response.data.pageSize
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
          campaign_id: this.formInline.campaignId,
          time_dimension: this.formInline.time,
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

        obreportAgent(params).then(response => {
          this.pageNo.push(response.data.pageNo)
          this.pageSize.push(response.data.pageSize)
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

        obreportAgent(params).then(response => {
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
            text: 'OB报表',
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
            data: ['新增首拨数量', '新增成功数量', '新增失败数量', '新增预约数量']
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
            name: '次数',
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
            name: '新增首拨数量',
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
            data: this.new_first_dial_task_count
          }, {
            name: '新增成功数量',
            type: 'bar',
            stack: 'total',
            barMaxWidth: 35,
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
            data: this.new_success_contact_task_count
          }, {
            name: '新增失败数量',
            type: 'bar',
            stack: 'total',
            symbolSize: 10,
            barMaxWidth: 35,
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
            data: this.new_fail_contact_task_count
          }, {
            name: '新增预约数量',
            type: 'bar',
            stack: 'total',
            barMaxWidth: 35,
            symbolSize: 10,
            symbol: 'circle',
            itemStyle: {
              normal: {
                color: 'rgba(252,0,0,1)',
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
            data: this.new_appoint_contact_task_count }
          ]
        })
      },
      initChart1() {
        this.chartStaff = echarts.init(document.getElementById('staff'))
        this.chartStaff.clear()
        this.chartStaff.setOption({
          backgroundColor: '#344b58',
          title: {
            text: this.statistics_type === 'depart' ? '单个时间各部门OB任务报表' : '单个时间各员工OB任务报表',
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
            data: ['新增首拨数量', '新增成功数量', '新增失败数量', '新增预约数量']
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
            name: '次数',
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
            name: '新增首拨数量',
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
            data: this.new_first_dial_task_countTime
          }, {
            name: '新增成功数量',
            type: 'bar',
            stack: 'total',
            barMaxWidth: 35,
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
            data: this.new_success_contact_task_countTime
          }, {
            name: '新增失败数量',
            type: 'bar',
            stack: 'total',
            symbolSize: 10,
            barMaxWidth: 35,
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
            data: this.new_fail_contact_task_countTime
          }, {
            name: '新增预约数量',
            type: 'bar',
            stack: 'total',
            barMaxWidth: 35,
            symbolSize: 10,
            symbol: 'circle',
            itemStyle: {
              normal: {
                color: 'rgba(252,0,0,1)',
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
            data: this.new_appoint_contact_task_countTime }
          ]
        })
      },
      initChart2() {
        this.chartTime = echarts.init(document.getElementById('time'))
        this.chartTime.clear()
        this.chartTime.setOption({
          backgroundColor: '#344b58',
          title: {
            text: this.statistics_type === 'depart' ? '单个部门各时间段OB任务报表' : '单个员工各时间段OB任务报表',
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
            data: ['新增首拨数量', '新增成功数量', '新增失败数量', '新增预约数量']
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
            name: '次数',
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
            name: '新增首拨数量',
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
            data: this.new_first_dial_task_countAgent
          }, {
            name: '新增成功数量',
            type: 'bar',
            stack: 'total',
            barMaxWidth: 35,
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
            data: this.new_success_contact_task_countAgent
          }, {
            name: '新增失败数量',
            type: 'bar',
            stack: 'total',
            symbolSize: 10,
            barMaxWidth: 35,
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
            data: this.new_fail_contact_task_countAgent
          }, {
            name: '新增预约数量',
            type: 'bar',
            stack: 'total',
            barMaxWidth: 35,
            symbolSize: 10,
            symbol: 'circle',
            itemStyle: {
              normal: {
                color: 'rgba(252,0,0,1)',
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
            data: this.new_appoint_contact_task_countAgent }
          ]
        })
      },
      timeChange(val) {
        const params = {
          statistics_type: this.statistics_type,
          depart_id: this.departId,
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

        obreportAgent(params).then(response => {
          if (response.data.result && response.data.result.length) {
            this.new_first_dial_task_countTime = response.data.result.map(function(item, index) {
              return item.new_first_dial_task_count
            })
            this.new_success_contact_task_countTime = response.data.result.map(function(item, index) {
              return item.new_success_contact_task_count
            })
            this.new_fail_contact_task_countTime = response.data.result.map(function(item, index) {
              return item.new_fail_contact_task_count
            })
            this.new_appoint_contact_task_countTime = response.data.result.map(function(item, index) {
              return item.new_appoint_contact_task_count
            })
            this.initChart1()
          }
        })
      },
      agentChange(val, page) {
        const params = {
          statistics_type: this.statistics_type,
          depart_id: this.departId,
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

        obreportAgent(params).then(response => {
          if (response.data.result && response.data.result.length) {
            this.new_first_dial_task_countAgent = response.data.result.map(function(item, index) {
              return item.new_first_dial_task_count
            })
            this.new_success_contact_task_countAgent = response.data.result.map(function(item, index) {
              return item.new_success_contact_task_count
            })
            this.new_fail_contact_task_countAgent = response.data.result.map(function(item, index) {
              return item.new_fail_contact_task_count
            })
            this.new_appoint_contact_task_countAgent = response.data.result.map(function(item, index) {
              return item.new_appoint_contact_task_count
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
        const params = {
          statistics_type: this.statistics_type,
          depart_id: this.departId,
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

        if (this.timeValueClone[0]) {
          params.start_time = this.getStartTimestamp(Date.parse(this.timeValueClone[0]), this.formInline.timeClone)
        }
        if (this.timeValueClone[1]) {
          params.end_time = this.getEndTimestamp(Date.parse(this.timeValueClone[1]), this.formInline.timeClone)
        }

        if (this.statistics_type === 'depart') {
          params.sub_depart_id = this.formInline.sub_depart_id.join(',')
        } else {
          params.agent_id = this.formInline.agent_id.join(',')
        }

        obstatistics(params).then(response => {
          this.obj = response.data
          this.tableDataTime1 = this.obj.result

          if (this.obj.result && this.obj.result.length) {
            this.new_first_dial_task_count = this.obj.result.map(function(item, index) {
              return item.new_first_dial_task_count
            })
            this.new_success_contact_task_count = this.obj.result.map(function(item, index) {
              return item.new_success_contact_task_count
            })
            this.new_fail_contact_task_count = this.obj.result.map(function(item, index) {
              return item.new_fail_contact_task_count
            })
            this.new_appoint_contact_task_count = this.obj.result.map(function(item, index) {
              return item.new_appoint_contact_task_count
            })
            this.initChart()
          }
          if (this.obj.time_dimension_data) {
            this.timeOptions = response.data.time_dimension_data
            this.formInline.time_dimension = this.timeOptions[0]
          }
          this.pagination = {
            pageNo: response.data.pageNo,
            pageSize: response.data.pageSize,
            totalCount: response.data.total_count,
            totalPage: null
          }
          if (val !== 'searchEvery') {
            this.paginationStatics = {
              pageNo: response.data.pageNo,
              pageSize: response.data.pageSize,
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
          this.formInline.campaignId = this.formInline.campaignIdClone
          this.formInline.timeClone = this.formInline.time
          this.timeValueClone[0] = this.timeValue ? this.timeValue[0] : null
          this.timeValueClone[1] = this.timeValue ? this.timeValue[1] : null
          this.pageNo = []
          this.pageSize = []
          this.totalCount = []

          const params = {
            statistics_type: this.statistics_type,
            depart_id: this.departId,
            campaign_id: this.formInline.campaignId,
            time_dimension: this.formInline.timeClone
            // start_time: this.getStartTimestamp(Date.parse(this.timeValueClone[0]), this.formInline.timeClone),
            // end_time: this.getEndTimestamp(Date.parse(this.timeValueClone[1]), this.formInline.timeClone)
          }
          if (this.timeValueClone[0]) {
            params.start_time = this.getStartTimestamp(Date.parse(this.timeValueClone[0]), this.formInline.timeClone)
          }
          if (this.timeValueClone[1]) {
            params.end_time = this.getEndTimestamp(Date.parse(this.timeValueClone[1]), this.formInline.timeClone)
          }
          if (this.statistics_type === 'depart') {
            params.sub_depart_id = this.formInline.sub_depart_id.join(',')
          } else {
            params.agent_id = this.formInline.agent_id.join(',')
          }

          obtotalAgent(params).then(response => {
            this.tableDataAgent1 = response.data.result
            this.tableDataAgent2 = response.data.total_result
          })
          this.teamData(val)
        }
      },
      searchEvery(val) {
        if (this.timeValueClone && this.timeValueClone[0].getDate() && this.timeValueClone[1].getDate() && (this.timeValueClone[0] > this.timeValueClone[1])) {
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
            campaign_id: this.formInline.campaignId,
            time_dimension: this.formInline.timeClone
            // start_time: this.getStartTimestamp(Date.parse(this.timeValueClone[0]), this.formInline.timeClone),
            // end_time: this.getEndTimestamp(Date.parse(this.timeValueClone[1]), this.formInline.timeClone)
          }
          if (this.timeValueClone) {
            params.start_time = this.getStartTimestamp(Date.parse(this.timeValueClone[0]), this.formInline.timeClone)
            params.end_time = this.getEndTimestamp(Date.parse(this.timeValueClone[1]), this.formInline.timeClone)
          }

          if (this.statistics_type === 'depart') {
            params.sub_depart_id = this.formInline.sub_depart_id.join(',')
          } else {
            params.agent_id = this.formInline.agent_id.join(',')
          }

          obtotalAgent(params).then(response => {
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
      time_dimensionChange(val) {
        this.timeValue = []
      },
      reset() {
        this.formInline.campaignIdClone = ''
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
