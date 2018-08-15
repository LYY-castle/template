<template>
  <div style="width: 100%;height: 90%">
    <el-row>
      <el-form :inline="true" class="demo-form-inline" size="small">
        <el-form-item>
          <el-select v-model="formInline.time">
            <el-option label="天" value="day"></el-option>
            <el-option label="小时" value="hour"></el-option>
            <el-option label="周" value="week"></el-option>
            <el-option label="月" value="month"></el-option>
            <el-option label="年" value="year"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作时间：">
          <el-date-picker
            v-model="timeValue"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="yyyy-MM-dd HH:mm">
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
          @current-change="handleCurrentChange"
          :current-page.sync="pagination.pageNo"
          :page-size="pagination.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="pagination.totalCount" style="text-align: right">
        </el-pagination>
      </el-row>
    </div>
    <el-form :inline="true" class="demo-form-inline" size="small" style="margin-top: 10px">
      <el-form-item label="时间选项:" style="margin-bottom: 0">
        <el-select v-model="formInline.time_dimension" @change="timeChange">
          <el-option v-for="item in timeOptions" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div :class="className" id="staff" style="height: 100%;width: 100%;"></div>
    <el-form :inline="true" class="demo-form-inline" size="small" style="margin-top: 10px">
      <el-form-item label="员工选项:" style="margin-bottom: 0">
        <el-select v-model="formInline.staff" @change="agentChange">
          <el-option v-for="item in staffOptions" :key="item.angentId" :label="item.angentId" :value="item.angentId"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div :class="className" id="time" style="height: 100%;width: 100%;"></div>
    <div style="margin-top: 1%">
      <el-row>
        <el-pagination
          @current-change="handleCurrentChangeStaff"
          :current-page.sync="paginationStaffPage.pageNo"
          :page-size="paginationStaffPage.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="paginationStaffPage.totalCount" style="text-align: right">
        </el-pagination>
      </el-row>
    </div>
    <div style="margin-top: 1%">
      <el-table
        :header-row-style="headerRow"
        :data="tableData1"
        ref="multipleTable"
        tooltip-effect="dark"
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
          prop="online_time_duration"
          label="在线时长(秒)">
        </el-table-column>
        <el-table-column
          align="center"
          prop="free_time_duration"
          label="空闲时长(秒)">
        </el-table-column>
        <el-table-column
          align="center"
          prop="busy_time_duration"
          label="示忙时长(秒)">
        </el-table-column>
        <el-table-column
          align="center"
          prop="call_time_duration"
          label="通话时长(秒)">
        </el-table-column>
        <el-table-column
          align="center"
          prop="calls_number"
          label="通话次数">
        </el-table-column>
      </el-table>
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
            label="日期">
          </el-table-column>
          <el-table-column
            align="center"
            prop="online_time_duration"
            label="在线时长(秒)">
          </el-table-column>
          <el-table-column
            align="center"
            prop="free_time_duration"
            label="空闲时长(秒)">
          </el-table-column>
          <el-table-column
            align="center"
            prop="busy_time_duration"
            label="示忙时长(秒)">
          </el-table-column>
          <el-table-column
            align="center"
            prop="call_time_duration"
            label="通话时长(秒)">
          </el-table-column>
          <el-table-column
            align="center"
            prop="calls_number"
            label="通话次数">
          </el-table-column>
        </el-table>
        <el-row style="margin-top:1%;">
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
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import resize from './mixins/resize'
  import { statistics, getAllStaffByDepartId, getDepartId, totalAgent, reportAgent } from '@/api/ctiReport'

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
        timeValue: [new Date(new Date() - 7 * 24 * 3600 * 1000), new Date()],
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
        paginationStaff: [],
        pageNo: [],
        pageSize: [],
        totalCount: [],
        formInline: {
          agent_dn: [],
          from: 1,
          time: 'day',
          staff: '',
          time_dimension: ''
        },
        tableData: [],
        tableData1: [],
        online_time_duration: [],
        free_time_duration: [],
        busy_time_duration: [],
        call_time_duration: [],
        calls_number: [],
        online_time_durationTime: [],
        free_time_durationTime: [],
        busy_time_durationTime: [],
        call_time_durationTime: [],
        calls_numberTime: [],
        online_time_durationAgent: [],
        free_time_durationAgent: [],
        busy_time_durationAgent: [],
        call_time_durationAgent: [],
        calls_numberAgent: [],
        agentTime: []
      }
    },
    mounted() {
      getDepartId().then(res => {
        getAllStaffByDepartId(res.data.departId).then(response => {
          this.staffOptions = response.data.data
          this.formInline.agent_dn = response.data.data.map(function(item, index) {
            return item.angentId
          })
          this.formInline.staff = response.data.data[0].angentId
          this.search(0)
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
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
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
      page(val, index) {
        this.currentIndex = index
      },
      handleCurrentChange1(val) {
        reportAgent({
          time_dimension: this.formInline.time,
          agent_id: this.formInline.agent_dn[this.currentIndex],
          start_time: Date.parse(this.timeValueClone[0]),
          end_time: Date.parse(this.timeValueClone[1]),
          pageNo: val,
          pageSize: 5
        }).then(response => {
          this.pageNo.splice(this.currentIndex, 1, response.data.pageNo)
          this.pageSize.splice(this.currentIndex, 1, response.data.pageSize)
          this.totalCount.splice(this.currentIndex, 1, response.data.total_count)
          this.tableData.splice(this.currentIndex, 1, response.data.result)
        })
      },
      searchStaff() {
        if (this.contentIndex >= this.formInline.agent_dn.length) {
          return this.tableData
        }
        reportAgent({
          time_dimension: this.formInline.time,
          agent_id: this.formInline.agent_dn[this.contentIndex],
          start_time: Date.parse(this.timeValueClone[0]),
          end_time: Date.parse(this.timeValueClone[1]),
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
            text: 'CTI报表',
            x: '20',
            top: '20',
            textStyle: {
              color: '#fff',
              fontSize: '22'
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
            data: ['在线时长(秒)', '空闲时长(秒)', '示忙时长(秒)', '通话时长(秒)', '通话次数']
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
            name: '时长(秒)',
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
            name: '通话次数',
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
            name: '在线时长(秒)',
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
            data: this.online_time_duration
          }, {
            name: '空闲时长(秒)',
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
            data: this.free_time_duration
          }, {
            name: '示忙时长(秒)',
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
            data: this.busy_time_duration
          }, {
            name: '通话时长(秒)',
            type: 'bar',
            stack: 'total',
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
            data: this.call_time_duration }, {
            name: '通话次数',
            type: 'line',
            // stack: 'total',
            yAxisIndex: 1,
            symbolSize: 10,
            symbol: 'circle',
            itemStyle: {
              normal: {
                color: 'rgba(152,230,48,1)',
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: 'top',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            data: this.calls_number }
          ]
        })
      },
      initChart1() {
        this.chartStaff = echarts.init(document.getElementById('staff'))
        this.chartStaff.clear()
        this.chartStaff.setOption({
          backgroundColor: '#344b58',
          title: {
            text: '单个时间CTI报表',
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
            data: ['在线时长(秒)', '空闲时长(秒)', '示忙时长(秒)', '通话时长(秒)', '通话次数']
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
            name: '时长(秒)',
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
            name: '通话次数',
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
            name: '在线时长(秒)',
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
            data: this.online_time_durationTime
          }, {
            name: '空闲时长(秒)',
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
            data: this.free_time_durationTime
          }, {
            name: '示忙时长(秒)',
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
            data: this.busy_time_durationTime
          }, {
            name: '通话时长(秒)',
            type: 'bar',
            stack: 'total',
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
            data: this.call_time_durationTime }, {
            name: '通话次数',
            type: 'line',
            // stack: 'total',
            yAxisIndex: 1,
            symbolSize: 10,
            symbol: 'circle',
            itemStyle: {
              normal: {
                color: 'rgba(152,230,48,1)',
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: 'top',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            data: this.calls_numberTime }
          ]
        })
      },
      initChart2() {
        this.chartTime = echarts.init(document.getElementById('time'))
        this.chartTime.clear()
        this.chartTime.setOption({
          backgroundColor: '#344b58',
          title: {
            text: '单个员工CTI报表',
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
            data: ['在线时长(秒)', '空闲时长(秒)', '示忙时长(秒)', '通话时长(秒)', '通话次数']
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
            name: '时长(秒)',
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
            name: '通话次数',
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
            name: '在线时长(秒)',
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
            data: this.online_time_durationAgent
          }, {
            name: '空闲时长(秒)',
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
            data: this.free_time_durationAgent
          }, {
            name: '示忙时长(秒)',
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
            data: this.busy_time_durationAgent
          }, {
            name: '通话时长(秒)',
            type: 'bar',
            stack: 'total',
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
            data: this.call_time_durationAgent }, {
            name: '通话次数',
            type: 'line',
            // stack: 'total',
            yAxisIndex: 1,
            symbolSize: 10,
            symbol: 'circle',
            itemStyle: {
              normal: {
                color: 'rgba(152,230,48,1)',
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: 'top',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            data: this.calls_numberAgent }
          ]
        })
      },
      timeChange(val) {
        reportAgent({
          time_dimension: this.formInline.time,
          agent_id: this.formInline.agent_dn.join(','),
          time: val,
          start_time: Date.parse(this.timeValueClone[0]),
          end_time: Date.parse(this.timeValueClone[1])
        }).then(response => {
          if (response.data.result.length) {
            this.calls_numberTime = response.data.result.map(function(item, index) {
              return item.calls_number
            })
            this.online_time_durationTime = response.data.result.map(function(item, index) {
              return item.online_time_duration
            })
            this.free_time_durationTime = response.data.result.map(function(item, index) {
              return item.free_time_duration
            })
            this.busy_time_durationTime = response.data.result.map(function(item, index) {
              return item.busy_time_duration
            })
            this.call_time_durationTime = response.data.result.map(function(item, index) {
              return item.call_time_duration
            })
            this.initChart1()
          }
        })
      },
      agentChange(val, page) {
        reportAgent({
          time_dimension: this.formInline.time,
          agent_id: val,
          start_time: Date.parse(this.timeValueClone[0]),
          end_time: Date.parse(this.timeValueClone[1]),
          pageNo: page || 1,
          pageSize: 5
        }).then(response => {
          if (response.data.result.length) {
            this.calls_numberAgent = response.data.result.map(function(item, index) {
              return item.calls_number
            })
            this.online_time_durationAgent = response.data.result.map(function(item, index) {
              return item.online_time_duration
            })
            this.free_time_durationAgent = response.data.result.map(function(item, index) {
              return item.free_time_duration
            })
            this.busy_time_durationAgent = response.data.result.map(function(item, index) {
              return item.busy_time_duration
            })
            this.call_time_durationAgent = response.data.result.map(function(item, index) {
              return item.call_time_duration
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
        statistics({
          time_dimension: this.formInline.time,
          agent_id: this.formInline.agent_dn.join(','),
          start_time: Date.parse(this.timeValue[0]),
          end_time: Date.parse(this.timeValue[1]), // val || val === 'search' ? this.timeValue[1] :
          pageNo: val && val !== 'search' ? this.formInline.from : 1,
          pageSize: 10
        }).then(response => {
          this.obj = response.data
          if (this.obj.result.length) {
            this.calls_number = this.obj.result.map(function(item, index) {
              return item.calls_number
            })
            this.online_time_duration = this.obj.result.map(function(item, index) {
              return item.online_time_duration
            })
            this.free_time_duration = this.obj.result.map(function(item, index) {
              return item.free_time_duration
            })
            this.busy_time_duration = this.obj.result.map(function(item, index) {
              return item.busy_time_duration
            })
            this.call_time_duration = this.obj.result.map(function(item, index) {
              return item.call_time_duration
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
        this.pageNo = []
        this.pageSize = []
        this.totalCount = []
        totalAgent({
          time_dimension: this.formInline.time,
          agent_id: this.formInline.agent_dn.join(','),
          start_time: Date.parse(this.timeValue[0]),
          end_time: Date.parse(this.timeValue[1])
        }).then(response => {
          this.tableData1 = response.data.result
        })
        this.timeValueClone = this.timeValue
        this.teamData(val)
      },
      reset() {
        this.formInline = {
          agent_dn: '',
          from: 1,
          time: 'day'
        }
        this.timeValue = [new Date(new Date() - 7 * 24 * 3600 * 1000), new Date()]
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
