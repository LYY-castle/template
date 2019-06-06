<template>
    <div>
        <div class="filter-container"> 
          <el-collapse v-model="formContainerOpen1" class="form-container" @change="handleChangeAcitve1" style="position:relative;">
            <span class="form-more1 bold" style="line-height: 24px;font-size: 14px;float:right;margin-right:6px;color:#57AFFF;position:absolute;top:12px;right:40px;">收起</span>
            <el-collapse-item title="筛选条件" name="1">
              <el-form :inline="true" :rules="rule"  class="demo-form-inline" size="small">
                <el-form-item label="技能组：">
                  <el-select v-model="req1.queueNumbers" placeholder="请选择技能组">
                    <el-option v-for="item in skillList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="时间维度：">
                  <el-select v-model="req1.timeDimension" @change="resetDateChar">
                    <el-option v-for="item in timeRanges" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-show="req1.timeDimension === 'day'" label="时间段：" prop="day">
                  <el-date-picker
                    :clearable="false"
                    v-model="dateChar"
                    value-format="yyyy-MM-dd"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    format="yyyy-MM-dd">
                  </el-date-picker>
                </el-form-item>
                <el-form-item v-show="req1.timeDimension === 'hour'" label="时间段：" prop="hour">
                  <el-date-picker
                    :clearable="false"
                    value-format="yyyy-MM-dd HH:00:00"
                    v-model="dateChar"
                    type="datetimerange"
                    range-separator="-"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    format="yyyy-MM-dd HH:00:00">
                  </el-date-picker>
                </el-form-item>
                <el-form-item v-show="req1.timeDimension === 'halfhour'" label="时间段：" prop="halfhour">
                  <el-date-picker v-model="halfhour_date_from" type="date" placeholder="开始日期" style="width:150px" value-format="yyyy-MM-dd"></el-date-picker>
                  <el-time-select v-model="halfhour_time_from" :picker-options="{start: '00:00',step:'00:30',end:'23:30'}" placeholder="开始时间" style="width:150px" value-format="HH:mm:00"></el-time-select>
                  <span> - </span>
                  <el-date-picker v-model="halfhour_date_to" type="date" placeholder="结束日期" style="width:150px" value-format="yyyy-MM-dd"></el-date-picker>
                  <el-time-select v-model="halfhour_time_to" :picker-options="{start: '00:00',step:'00:30',end:'23:30'}" placeholder="结束时间" style="width:150px" value-format="HH:mm:00"></el-time-select>
                  <!-- <el-date-picker
                    value-format="yyyy-MM-dd HH:00:00"
                    v-model="dateChar"
                    type="datetimerange"
                    range-separator="-"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    format="yyyy-MM-dd HH:mm">
                  </el-date-picker> -->
                </el-form-item>
                <el-form-item v-show="req1.timeDimension === 'week'" label="时间段：" prop="week">
                  <el-date-picker
                    :clearable="false"
                    v-model="dateCharWeekFrom"
                    type="week"
                    format="yyyy 第 WW 周"
                    placeholder="开始周">
                  </el-date-picker>
                  <span>-</span>
                  <el-date-picker
                    :clearable="false"
                    v-model="dateCharWeekTo"
                    type="week"
                    format="yyyy 第 WW 周"
                    placeholder="结束周">
                  </el-date-picker>
                </el-form-item>
                <el-form-item v-show="req1.timeDimension === 'month'" label="时间段：" prop="month">
                  <el-date-picker
                    :clearable="false"
                    value-format="yyyy-MM"
                    v-model="dateChar[0]"
                    type="month"
                    placeholder="开始月"
                    format="yyyy-MM">
                  </el-date-picker>
                  <span>-</span>
                  <el-date-picker
                    :clearable="false"
                    value-format="yyyy-MM"
                    v-model="dateChar[1]"
                    type="month"
                    placeholder="结束月"
                    format="yyyy-MM">
                  </el-date-picker>
                </el-form-item>
                <el-form-item v-show="req1.timeDimension === 'year'" label="时间段：" prop="year">
                  <el-date-picker
                    :clearable="false"
                    v-model="dateChar[0]"
                    value-format="yyyy"
                    type="year"
                    placeholder="开始年"
                    format="yyyy">
                  </el-date-picker>
                  <span>-</span>
                  <el-date-picker
                    :clearable="false"
                    v-model="dateChar[1]"
                    value-format="yyyy"
                    type="year"
                    placeholder="结束年"
                    format="yyyy">
                  </el-date-picker>
                </el-form-item>
                <!--
                <el-form-item label="呼损次数：">
                  <el-input v-model="req1.lost_count_from" type="number" :min="0"></el-input>
                </el-form-item>
                <el-form-item>
                  <span>至</span>
                </el-form-item>
                <el-form-item>
                  <el-input v-model="req1.lost_count_to" type="number" :min="0"></el-input>
                </el-form-item> -->
                <el-form-item>
                  <el-button type="primary" @click="req1.pageNo=1;queryByKeyWords(req1)">查询</el-button>
                  <el-button @click="resetQueryCondition()">重置</el-button>
                </el-form-item>
              </el-form>
            </el-collapse-item>
          </el-collapse>

          <!-- <el-row class="table-container margin-bottom-15"> -->
            <el-collapse v-model="formContainerOpen2" class="form-container" @change="handleChangeAcitve2" style="position:relative;">
              <span class="form-more2 bold" style="line-height: 24px;font-size: 14px;float:right;margin-right:6px;color:#57AFFF;position:absolute;top:12px;right:40px;">收起</span>
              <el-collapse-item title="统计图" name="2">
                <el-row>
                  <div id="countEchart" v-show="hasQueryed" class="countEchart" ref="echartWidth">
                  </div>
                </el-row>
              </el-collapse-item>
            </el-collapse>
          <!-- </el-row> -->

          <el-row class="table-container margin-bottom-15">
            <el-row class="margin-bottom-20">
              <div class="font14 bold">合计表</div>
            </el-row>
            <el-row>
              <el-table tooltip-effect="dark" :data="allCounts">
                <el-table-column align="center" prop="name" label="" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column align="center" prop="lostCount" label="呼损量" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column align="center" prop="inboundCount" label="呼入量" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column align="center" prop="rate" label="呼损率" :show-overflow-tooltip="true"></el-table-column>
              </el-table>
            </el-row>
          </el-row>

          <el-row class="table-container margin-bottom-15">
            <el-row class="margin-bottom-20">
              <el-tabs v-model="activeTab" type="card" >
              <el-tab-pane label="时间合计表" name="timeCount">
                <el-table tooltip-effect="dark" :data="TimeCountsData">
                  <el-table-column align="center" prop="dateChar" label="时间段" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column align="center" prop="lostCount" label="呼损量" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column align="center" prop="inboundCount" label="呼入量" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column align="center" prop="lostRateString" label="呼损率" :show-overflow-tooltip="true"></el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="员工合计表" name="staffCount">
                <el-table tooltip-effect="dark">
                  <el-table-column align="center" prop="" label="时间段" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column align="center" prop="" label="呼损量" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column align="center" prop="" label="呼入量" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column align="center" prop="" label="呼损率" :show-overflow-tooltip="true"></el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
            </el-row>
          </el-row>
        </div>
    </div>
</template>

<style lang='scss' scoped>
  .countEchart {
    margin-left: 30px;
    width: calc(100% - 60px);
    height: 320px;
  }
</style>

<script>
import echarts from 'echarts'
import {
  countCallLossTimes,
  querySkillListByAgentId
} from '@/api/call_loss_report'
import { formatDateTime, formatDate } from '@/utils/tools'

export default {
  name: 'callLossReport',
  data() {
    var checkDays = (eule, value, callback) => {
      const v = new Date(this.dateChar[1].replace(/-/g, '/')) - new Date(this.dateChar[0].replace(/-/g, '/'))
      console.log('天数差为：' + parseInt(v / (1000 * 60 * 60 * 24)))
      if (parseInt(v / (1000 * 60 * 60 * 24)) > 14) {
        this.validate = false
        return callback(new Error('时间段选择范围请不要超过2周'))
      } else {
        this.validate = true
        callback()
      }
    }
    var checkHour = (eule, value, callback) => {
      const v = new Date(this.dateChar[1].replace(/-/g, '/')) - new Date(this.dateChar[0].replace(/-/g, '/'))
      const h = this.timeStamp(v / 1000)[0] * 24 + this.timeStamp(v / 1000)[1]
      console.log('小时差为：' + h)
      if (h > 24) {
        this.validate = false
        return callback(new Error('时间段选择范围请不要超过1天'))
      } else {
        this.validate = true
        callback()
      }
    }
    var checkHalfHour = (eule, value, callback) => {
      const v = new Date(this.halfhour_date_to.replace(/-/g, '/') + ' ' + this.halfhour_time_to + ':00') - new Date(this.halfhour_date_from.replace(/-/g, '/') + ' ' + this.halfhour_time_from + ':00')
      if (v < 0) {
        this.validate = false
        return callback(new Error('结束时间必须大于开始时间！'))
      } else {
        const d = parseInt(this.timeStamp(v / 1000)[0])
        const h = parseInt(this.timeStamp(v / 1000)[1])
        const m = parseInt(this.timeStamp(v / 1000)[2])
        const hour = d * 24 + h + (m / 60)
        console.log('小时差为：' + hour)
        if (hour > 12) {
          this.validate = false
          return callback(new Error('时间段选择范围请不要超过12小时'))
        } else {
          this.validate = true
          callback()
        }
      }
    }
    var checkWeek = (eule, value, callback) => {
      const v = this.dateCharWeekTo - this.dateCharWeekFrom
      if (v < 0) {
        this.validate = false
        return callback(new Error('结束周必须大于或等于开始周！'))
      } else {
        const w = this.timeStamp(v / 1000)[0] / 7
        console.log('周差为：' + w)
        if (w > 12) {
          this.validate = false
          return callback(new Error('时间段选择范围请不要超过1季度！'))
        } else {
          this.validate = true
          callback()
        }
      }
    }
    var checkMonth = (eule, value, callback) => {
      const v = new Date(this.dateChar[1].replace(/-/g, '/')) - new Date(this.dateChar[0].replace(/-/g, '/'))
      if (v < 0) {
        this.validate = false
        return callback(new Error('结束月必须大于或等于开始月！'))
      } else {
        const m = (this.timeStamp(v / 1000)[0]) / 30
        console.log('月差为：' + m)
        if (m > 12) {
          this.validate = false
          return callback(new Error('时间段选择范围请不要超过1年！'))
        } else {
          this.validate = true
          callback()
        }
      }
    }
    var checkYear = (eule, value, callback) => {
      const v = new Date(this.dateChar[1]) - new Date(this.dateChar[0])
      if (v < 0) {
        this.validate = false
        return callback(new Error('结束年必须大于或等于开始年！'))
      } else {
        const y = (this.timeStamp(v / 1000)[0]) / 365
        console.log('年差为：' + y)
        if (y > 10) {
          this.validate = false
          return callback(new Error('时间段选择范围请不要超过10年！'))
        } else {
          this.validate = true
          callback()
        }
      }
    }
    return {
      rule: {
        day: [
          {
            required: true, validator: checkDays, trigger: 'change'
          }
        ],
        hour: [
          {
            required: true, validator: checkHour, trigger: 'change'
          }
        ],
        halfhour: [
          {
            required: true, validator: checkHalfHour, trigger: 'change'
          }
        ],
        week: [
          {
            required: true, validator: checkWeek, trigger: 'change'
          }
        ],
        month: [
          {
            required: true, validator: checkMonth, trigger: 'change'
          }
        ],
        year: [
          {
            required: true, validator: checkYear, trigger: 'change'
          }
        ]
      },
      validate: true,
      chart: null,
      hasQueryed: false,
      activeTab: 'timeCount',
      formContainerOpen1: '1',
      formContainerOpen2: '2',
      dateCharWeekFrom: null,
      dateCharWeekTo: null,
      halfhour_date_from: '',
      halfhour_date_to: '',
      halfhour_time_from: '',
      halfhour_time_to: '',
      skillList: [],
      dateChar: [formatDate(new Date(new Date().toLocaleDateString()).getTime() - 7 * 24 * 3600 * 1000), formatDate(new Date())], // 时间段
      week: {
        firstDayOfWeek: 1
      },
      timeRanges: [
        {
          value: 'day',
          label: '天'
        },

        {
          value: 'hour',
          label: '小时'
        },
        {
          value: 'halfhour',
          label: '半小时'
        },
        {
          value: 'week',
          label: '周'
        },
        {
          value: 'month',
          label: '月'
        },
        {
          value: 'year',
          label: '年'
        }
      ],
      echartWidth: null,
      req1: {
        dateCharFrom: null,
        dateCharTo: null,
        timeDimension: 'day',
        queueNumbers: null,
        pageNo: 1,
        pageSize: 25
      },
      dateChars: [], // 用以显示X轴的数组
      inboundCounts: [], // 呼入量数组 用以显示y轴内容
      lostCounts: [], // 呼损量数组 用以显示y轴内容
      lostRates: [], // 呼损率数组 用以显示y轴内容
      TimeCountsData: [], // 时间合计表数据
      allCounts: [], // 合计表的数据
      allCount: { // 合计表实际的数据  就这一个
        name: '合计',
        inboundCount: 0,
        lostCount: 0,
        rate: 0
      }
    }
  },
  methods: {
    // 初始化图表
    initChart() {
      this.chart = echarts.init(document.getElementById('countEchart'))
      const getCycle = ({ width = '10px', color }) => {
        const cycleStyle = `width: ${width}; height: ${width}; background-color: ${color}; float: left; margin-top: 5px; margin-right: 3px; border-radius: 50%; -moz-border-radius: 50%; -webkit-border-radius: 50%;`
        return `<div style="${cycleStyle}"></div>`
      }
      var option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          formatter: (options) => {
            let res = ''
            options.forEach((v, i) => {
              if (i === 0) {
                res = res + v.axisValue + '</br>'
              }
              res += getCycle({ color: v.color })
              res += v.seriesName !== '呼损率'
                ? (v.seriesName + ': ' + v.value + '</br>')
                : (v.seriesName + ': ' + v.value + '%</br>')
            })
            return res
          }
        },
        height: 200,
        toolbox: {
          top: 'top',
          right: '20%',
          feature: {
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: ['呼损量', '呼入量', '呼损率']
        },
        xAxis: [
          {
            type: 'category',
            data: this.dateChars,
            // data: [
            //   '2019-05-01', '2019-05-02', '2019-05-03', '2019-05-04', '2019-05-05', '2019-05-06', '2019-05-07'
            // ],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '话务量'
          },
          {
            type: 'value',
            name: '呼损率',
            max: 100,
            min: 0,
            axisLabel: {
              formatter: '{value} %'
            }
          }
        ],
        series: [
          {
            name: '呼损量',
            type: 'bar',
            data: this.lostCounts
            // data: [2, 4, 3, 2, 6, 8, 10]
          },
          {
            name: '呼入量',
            type: 'bar',
            data: this.inboundCounts
            // data: [10, 20, 30, 25, 60, 100, 150]
          },
          {
            name: '呼损率',
            type: 'line',
            yAxisIndex: 1,
            data: this.lostRates
          }
        ]
      }
      this.chart.clear()
      this.chart.setOption(option)
      this.$nextTick(function() {
        this.echartWidth = this.$refs.echartWidth.offsetWidth + 'px'
        this.chart.resize({ width: this.echartWidth })
      })
      window.onresize = () => {
        this.echartWidth = this.$refs.echartWidth.offsetWidth + 'px'
        this.chart.resize({ width: this.echartWidth })
      }
    },
    // 获取一个数组为 [天，时，分，秒]
    timeStamp(second_time) {
      var time = [0, 0, 0, parseInt(second_time)]
      if (parseInt(second_time) > 60) {
        var second = parseInt(second_time) % 60
        var min = parseInt(second_time / 60)
        time = [0, 0, min, second]

        if (min > 60) {
          min = parseInt(second_time / 60) % 60
          var hour = parseInt(parseInt(second_time / 60) / 60)
          time = [0, hour, min, second]

          if (hour > 24) {
            hour = parseInt(parseInt(second_time / 60) / 60) % 24
            var day = parseInt(parseInt(parseInt(second_time / 60) / 60) / 24)
            time = [day, hour, min, second]
          }
        }
      }

      return time
    },
    // 重置查询条件
    resetQueryCondition() {
      this.req1.pageNo = 1
      this.req1.pageSize = 25
      this.req1.timeDimension = 'day'
      this.dateChar = []
      this.dateChar = [formatDate(new Date(new Date().toLocaleDateString()).getTime() - 7 * 24 * 3600 * 1000), formatDate(new Date())]
      this.req1.queueNumbers = this.skillList[0] ? this.skillList[0].value : ''
    },
    // 获取周数
    getWeekNumber(src) {
      const date = new Date(src.getTime())
      date.setHours(0, 0, 0, 0)
      // Thursday in current week decides the year.
      date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7)
      // January 4 is always in week 1.
      const week1 = new Date(date.getFullYear(), 0, 4)
      // Adjust to Thursday in week 1 and count number of weeks from date to week 1.
      // Rounding should be fine for Daylight Saving Time. Its shift should never be more than 12 hours.
      return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7)
    },
    // 每次选时间维度重置查询条件
    resetDateChar() {
      this.dateChar = []
      this.dateCharWeekFrom = ''
      this.dateCharWeekTo = ''
      this.halfhour_date_from = ''
      this.halfhour_date_to = ''
      this.halfhour_time_from = ''
      this.halfhour_time_to = ''
    },
    handleChangeAcitve1(active1 = ['1']) {
      if (active1.length) {
        $('.form-more1').text('收起')
      } else {
        $('.form-more1').text('更多')
      }
    },
    handleChangeAcitve2(active2 = ['2']) {
      if (active2.length) {
        $('.form-more2').text('收起')
      } else {
        $('.form-more2').text('更多')
      }
    },
    toPercent(point) {
      if (point === 0) {
        return 0
      }
      var str = Number(point * 100).toFixed()
      str += '%'
      return str
    },
    // 查询
    queryByKeyWords(req) {
      // 这个查询条件就是这么复杂 希望以后修改的人看到时不要惊讶 不要为难  稳住 我们能赢
      if (!this.validate) {
        this.$message.error('请检查是否填写正确！')
        return
      }
      if (req.timeDimension === 'week') {
        // 周处理
        if (this.dateCharWeekFrom) {
          req.dateCharFrom = formatDate(this.dateCharWeekFrom).split('-')[0] + '(' + this.getWeekNumber(this.dateCharWeekFrom) + ')'
        }
        if (this.dateCharWeekTo) {
          req.dateCharTo = formatDate(this.dateCharWeekTo).split('-')[0] + '(' + this.getWeekNumber(this.dateCharWeekTo) + ')'
        }
      } else if (req.timeDimension === 'halfhour') {
        // 半小时处理
        if (this.halfhour_date_from) {
          if (this.halfhour_time_from) {
            req.dateCharFrom = this.halfhour_date_from + ' ' + this.halfhour_time_from + ':00'
          } else {
            this.$message.error('请选择开始时间！')
            return
          }
        } else {
          req.dateCharFrom = ''
        }
        if (this.halfhour_date_to) {
          if (this.halfhour_time_to) {
            req.dateCharTo = this.halfhour_date_to + ' ' + this.halfhour_time_to + ':00'
          } else {
            this.$message.error('请选择结束时间！')
            return
          }
        } else {
          req.dateCharTo = ''
        }
      } else {
        // 其他情况 天、小时、月、年
        if (this.dateChar.length > 0) {
          if (this.dateChar[0]) {
            req.dateCharFrom = this.dateChar[0]
          }
          if (this.dateChar[1]) {
            req.dateCharTo = this.dateChar[1]
          }
        }
      }
      console.log('查询条件：', req)
      this.dateChars = []
      this.inboundCounts = []
      this.lostCounts = []
      this.lostRates = []
      this.allCounts = []
      countCallLossTimes(req).then(res => {
        if (res.data.result) {
          if (res.data.result.length > 0) {
            this.TimeCountsData = res.data.result
            this.hasQueryed = true
            this.allCount.inboundCount = 0
            this.allCount.lostCount = 0
            this.allCount.rate = 0
            for (let i = 0; i < res.data.result.length; i++) {
              this.dateChars.unshift(res.data.result[i].dateChar)
              this.inboundCounts.unshift(res.data.result[i].inboundCount)
              this.lostCounts.unshift(res.data.result[i].lostCount)
              this.lostRates.unshift((res.data.result[i].lostRate * 100).toFixed(2))
              this.allCount.inboundCount += res.data.result[i].inboundCount
              this.allCount.lostCount += res.data.result[i].lostCount
            }
            this.allCount.rate = this.toPercent((this.allCount.lostCount / this.allCount.inboundCount))
            this.allCounts.push(this.allCount)
            this.initChart()
          } else {
            this.hasQueryed = false
          }
        }
      }).catch(error => {
        this.hasQueryed = false
        throw error
      })
    }
  },
  mounted() {
    // 查询技能组
    querySkillListByAgentId(localStorage.getItem('agentId')).then(res => {
      if (res.data.code === 1) {
        if (res.data.data.length > 0) {
          const data = res.data.data
          for (let i = 0; i < data.length; i++) {
            const option = {}
            option.label = data[i].skillSet.name
            option.value = data[i].skillSet.code
            option.priority = data[i].priority
            this.skillList.push(option)
            this.req1.queueNumbers = this.skillList[0] ? this.skillList[0].value : ''
          }
        }
      }
      this.queryByKeyWords(this.req1)
    })
    this.handleChangeAcitve1()
    this.handleChangeAcitve2()
  }

}
</script>

