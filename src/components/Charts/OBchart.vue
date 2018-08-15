<template>
  <div style="width: 100%;height: 90%">
    <el-row>
      <el-form :inline="true" class="demo-form-inline" size="small">
        <el-form-item>
          <el-select v-model="formInline.campaignId">
            <el-option value="" label="请选择活动"></el-option>
            <el-option v-for="item in activeNameList" :key="item.campaignId" :label="item.campaignName" :value="item.campaignId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="员工工号" v-model="formInline.agent_dn"></el-input>
        </el-form-item>
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
            format="yyyy-MM-dd HH:mm:ss"
            value-format="timestamp">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search(0)">查询</el-button>
          <el-button type="danger" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <div :class="className" :id="id" :style="{height:height,width:width}"></div>
    <el-table
      :header-row-style="headerRow"
      :data="tableData"
      ref="multipleTable"
      tooltip-effect="dark"
      border
      style="width: 100%;">
      <el-table-column
        width="55"
        align="center"
        type="index"
        label="序号">
        <template
          slot-scope="scope">
          <div>{{scope.$index+(pagination.pageNo-1)*10+1}}</div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="time_dimension"
        label="日期">
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
    <el-row style="margin-top:1%;">
      <el-col :span="4">
      </el-col>
      <el-col :span="18">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="pagination.pageNo"
          :page-size="pagination.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="pagination.totalCount" style="text-align: right">
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import resize from './mixins/resize'
  import { oBTaskReportStatistics } from '@/api/ctiReport'
  import { findCampaignByUser } from '@/api/monitor_list_single'

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
    data() {
      return {
        bool: false,
        chart: null,
        obj: {},
        timeValue: '',
        pagination: {
          pageNo: null,
          pageSize: null,
          totalCount: null,
          totalPage: null
        },
        formInline: {
          agent_dn: '',
          from: 1,
          time: 'day',
          campaignId: ''
        },
        activeNameList: [],
        tableData: [],
        new_first_dial_task_count: [],
        new_success_contact_task_count: [],
        new_fail_contact_task_count: [],
        new_appoint_contact_task_count: []
      }
    },
    mounted() {
      findCampaignByUser().then(response => {
        this.activeNameList = response.data.data
      })
      this.search(0)
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    methods: {
      headerRow({ row, rowIndex }) {
        if (rowIndex === 0) {
          return 'color:black'
        } else {
          return ''
        }
      },
      handleCurrentChange(val) {
        this.formInline.from = val
        this.search(val)
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
        this.chart.setOption({
          backgroundColor: '#344b58',
          title: {
            text: 'OB报表',
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
          // dataZoom: [{
          //   show: true,
          //   height: 30,
          //   xAxisIndex: [
          //     0
          //   ],
          //   bottom: 30,
          //   start: 10,
          //   end: 80,
          //   handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
          //   handleSize: '110%',
          //   handleStyle: {
          //     color: '#d3dee5'
          //
          //   },
          //   textStyle: {
          //     color: '#fff' },
          //   borderColor: '#90979c'
          //
          // }, {
          //   type: 'inside',
          //   show: true,
          //   height: 15,
          //   start: 1,
          //   end: 35
          // }],
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
                  position: 'top',
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
                  position: 'top',
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
            symbolSize: 10,
            symbol: 'circle',
            itemStyle: {
              normal: {
                color: 'rgba(252,0,0,1)',
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
            data: this.new_appoint_contact_task_count }
          ]
        }, true)
      },
      search(val) {
        oBTaskReportStatistics({
          campaign_id: this.formInline.campaignId,
          time_dimension: this.formInline.time,
          agent_id: this.formInline.agent_dn,
          start_time: this.timeValue[0],
          end_time: this.timeValue[1],
          pageNo: val ? this.formInline.from : 1,
          pageSize: 8
        }).then(response => {
          this.obj = response.data
          if (this.obj.result.length) {
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
          } else {
            this.new_first_dial_task_count = []
            this.new_success_contact_task_count = []
            this.new_fail_contact_task_count = []
            this.new_appoint_contact_task_count = []
          }
          this.initChart()
          this.tableData = response.data.result
          this.pagination = {
            pageNo: response.data.pageNo,
            pageSize: response.data.pageSize,
            totalCount: response.data.total_count,
            totalPage: null
          }
        })
      },
      reset() {
        this.formInline = {
          agent_dn: '',
          from: 1,
          time: 'day',
          campaignId: ''
        }
        this.timeValue = ''
      }
    }
  }
</script>
