<template>
  <div class="container">
    <div>
      <el-row>
        <el-form :inline="true" size="small">
          <el-form-item label="消息状态：">
              <el-select v-model.trim="req.is_read" placeholder="请选择" clearable size="small" >
                  <el-option
                    v-for="item in options"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="级别：">
              <el-select v-model.trim="req.emergency_degree" placeholder="请选择" clearable size="small" >
                  <el-option
                    v-for="item in options1"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
          </el-form-item><br/>
          <el-form-item label="关键字：">
            <el-input type="text" v-model.trim="req.key_text" size="small" placeholder="关键字(上限20字符)" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="标题：">
            <el-input type="text" v-model.trim="req.title" size="small" placeholder="消息通知标题(上限20字符)" maxlength="20" style="width:250px"></el-input>
          </el-form-item>
          <el-form-item label="发布时间：">
            <el-date-picker
                v-model.trim="timeValue"
                type="datetimerange"
                range-separator="-"
                start-placeholder="发布开始时间"
                end-placeholder="发布结束时间"
                value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"  @click="req.pageNo=1;searchByKeyWords(req)">查询</el-button>
            <el-button type="danger"  @click="resetQueryCondition()" >重置</el-button>
          </el-form-item>
        </el-form>
      </el-row>

      <el-row>
        <el-col>
          <el-table :data="tableData" border>
            <el-table-column align="center" label="序号" width="55">
              <template slot-scope="scope">
                <div>{{scope.$index+(req.pageNo-1)*req.pageSize+1}}</div>
              </template>
            </el-table-column>

            <el-table-column align="center" label="消息通知标题">
              <template slot-scope="scope">
                <span>{{scope.row.title}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="级别">
                <template slot-scope="scope">
                  <div v-html="showEmergencyDegree(scope.row.emergency_degree)"></div>
                </template>
            </el-table-column>

            <el-table-column align="center" label="消息状态">
                <template slot-scope="scope">
                  <div v-html="showStatus(scope.row.is_read)"></div>
                </template>
            </el-table-column>

            <el-table-column align="center" label="发布人">
                <template slot-scope="scope">
                  <div v-html="showReleaser(scope.row.updated_by_realname)"></div>
                </template>
            </el-table-column>

            <el-table-column align="center" label="发布时间">
                <template slot-scope="scope">
                  <div v-html="showReleaseTime(scope.row.release_time)"></div>
                </template>
            </el-table-column>

            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button type="text" icon="el-icon-document" size="medium" @click="queryOne(scope.row.notification_id,scope.row.is_read);showDetailVisiable=true">查看</el-button>
                <el-button type="text" icon="el-icon-edit" size="medium" @click="markAsRead(scope.row.notification_id)" v-show="scope.row.is_read===0">标为已读</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <el-row style="margin-top:5px;">
        <el-pagination
            v-if="pageShow"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page=currentPage
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size=pageSize
            layout="total, sizes, prev, pager, next, jumper"
            :total=totalCount style="text-align: right;float:right;">
        </el-pagination>
      </el-row>

      <!-- 消息详情dialog -->
    <el-dialog
      align:left
      width="40%"
      top="1vh"
      title="消息通知详情"
      :visible.sync="showDetailVisiable"
      append-to-body>
        <el-form label-width="100px">
          <el-form-item label="标题：">
            <span>{{notificationDetail.title}}</span>
          </el-form-item>
          <el-form-item label="内容：" class="testMy">
            <span>{{notificationDetail.body}}</span>
          </el-form-item>
          <el-form-item label="接收部门：">
            <div v-html="showReceivers(null,notificationDetail.receiver_dept_names)"></div>
          </el-form-item>
          <el-form-item label="紧急程度：">
            <el-rate
             style="margin-top:10px"
             disabled
             v-model="notificationDetail.emergency_degree"
             show-text
             :max=4
             :texts="['普通','加急','特急','特提']"
             :colors="['#67C23A','#E6A23C','#F56C6C']"
             ></el-rate>
          </el-form-item>
          <el-form-item label="发布人：">
            <div v-html="showReleaser(notificationDetail.updated_by_realname)"></div>
          </el-form-item>
          <el-form-item label="发布时间：">
            <div v-html="showReleaseTime(notificationDetail.release_time)"></div>
          </el-form-item>
        </el-form>
        <br/>
        <div slot="footer" style="text-align: center;">
          <el-button @click="showDetailVisiable=false;">返回</el-button>
        </div>
    </el-dialog>
    </div>

  </div>
</template>

<style lang='scss' scoped>
.testMy{
  // text-overflow: ellipsis; 
  // overflow: hidden;
  // white-space:normal;
  word-wrap:break-word; 
  word-break:break-all;
}
</style>

<script>
import { formatDateTime } from '@/utils/tools' // 格式化时间
import {
  queryByKeyWords,
  queryOneNotification,
  updateReadStatus
} from '@/api/notification_my'
export default {
  name: 'notification_my',

  data() {
    return {
      showDetailVisiable: false, // 查看详情dialog
      timeValue: '',
      req: {
        start_release_time: '',
        end_release_time: '',
        is_read: '',
        emergency_degree: '',
        key_text: '',
        title: '',
        pageNo: 1,
        pageSize: 10 // 每页数量

      },
      tableData: [], // 表格数据
      pageShow: false, // 分页显示与否
      pageInfo: {}, // 分页数据
      currentPage: '', // 当前页数
      totalCount: '', // 总条数
      pageSize: '', // 每页条数
      // 消息状态
      options: [
        {
          label: '',
          value: ''
        },
        {
          label: '未读',
          value: '0'
        },
        {
          label: '已读',
          value: '1'
        }
      ],
      // 级别
      options1: [
        {
          label: '',
          value: ''
        },
        {
          label: '普通',
          value: '1'
        },
        {
          label: '加急',
          value: '2'
        },
        {
          label: '特急',
          value: '3'
        },
        {
          label: '特提',
          value: '4'
        }
      ],
      notificationDetail: { // 详情
        title: '',
        body: '',
        emergency_degree: null,
        receiver_dept_names: '',
        release_time: '',
        status: '',
        updated_by_realname: ''
      }
    }
  },

  methods: {
    formatDateTime: formatDateTime, // 格式化时间
    // 页面显示条数
    handleSizeChange(val) {
      this.pageSize = val
      this.req.pageSize = val
      this.req.pageNo = 1
      this.currentPage = 1
      this.searchByKeyWords(this.req)
    },
    // 翻页查询
    handleCurrentChange(val) {
      this.req.pageNo = val
      this.searchByKeyWords(this.req)
    },
    // 综合查询
    searchByKeyWords(req) {
      if (this.timeValue !== '' && this.timeValue !== null) {
        req.start_release_time = Date.parse(new Date(this.timeValue[0]))
        req.end_release_time = Date.parse(new Date(this.timeValue[1]))
      } else {
        req.start_release_time = ''
        req.end_release_time = ''
      }
      queryByKeyWords(req)
        .then(response => {
          if (response.data.error === null) {
            this.pageShow = true
            this.tableData = response.data.result
            this.currentPage = response.data.pageNo
            this.totalCount = response.data.total_count
            this.pageSize = response.data.pageSize
            // 同时更新右上角的状态
            this.$root.eventHub.$emit('SET_FIRSTSTATUS')
          }
        })
    },
    // 单个查询消息通知
    queryOne(id, status) {
      if (status === 0) {
        // 说明是未读信息 更新消息阅读状态
        updateReadStatus(id)
          .then(res1 => {
            if (res1.data.result === true) {
              // 说明阅读更新状态成功
              // 更新列表里的阅读状态
              this.searchByKeyWords(this.req)
              // 更新右上角的状态
              this.$root.eventHub.$emit('SET_FIRSTSTATUS')
            }
          })
      }
      queryOneNotification(id)
        .then(res2 => {
          if (res2.data.error === null) {
            this.notificationDetail = res2.data.result
            this.notificationDetail.emergency_degree = parseInt(res2.data.result.emergency_degree)
          } else {
            this.$message.error(res2.data.error)
            this.showDetailVisiable = false
          }
        })
    },
    // 标记为已读
    markAsRead(id) {
      updateReadStatus(id)
        .then(res1 => {
          if (res1.data.result === true) {
            // 说明阅读更新状态成功
            // 更新列表里的阅读状态
            this.searchByKeyWords(this.req)
            //  更新右上角的状态
            this.$root.eventHub.$emit('SET_FIRSTSTATUS')
          }
        })
    },
    // 重置查询条件
    resetQueryCondition() {
      this.timeValue = ''
      this.req = {
        start_release_time: '',
        end_release_time: '',
        is_read: '', // 发布状态
        emergency_degree: '', // 类别
        key_text: '', // 关键字
        title: '', // 标题
        pageNo: 1, // 当前页数
        pageSize: this.pageSize // 每页数量
      }
    },
    // 展示消息通知类别
    showEmergencyDegree(degree) {
      if (degree === '4') {
        return "<i class='el-icon-info' style='color:#909399'><span style='color:#909399'>&nbsp;特提</span>"
      } else if (degree === '3') {
        return "<i class='el-icon-warning' style='color:#F56C6C'></i><span style='color:#F56C6C'>&nbsp;特急</span>"
      } else if (degree === '2') {
        return "<i class='el-icon-star-on' style='color:#E6A23C'></i><span style='color:#E6A23C'>&nbsp;加急</span>"
      } else if (degree === '1') {
        return "<i class='el-icon-message' style='color:#67C23A'></i><span style='color:#67C23A'>&nbsp;普通</span>"
      }
    },
    // 展示接收人或者部门
    showReceivers(names, deptNames) {
      if (names) {
        names = names.split(',')
        var str1 = ''
        for (var k = 0; k < names.length; k++) {
          if (names[k] === '') {
            names.splice(k, 1)
          }
        }
        if (names.length > 2) {
          str1 = str1 + names[0] + '、' + names[1] + '等' + names.length + '个人员'
          return str1
        } else {
          for (var z = 0; z < names.length; z++) {
            str1 += names[z] + '、'
          }
          str1 = str1.substr(0, (str1.length - 1))
          return str1
        }
      } else if (deptNames) {
        deptNames = deptNames.split(',')
        var str = ''
        for (var i = 0; i < deptNames.length; i++) {
          if (deptNames[i] === '') {
            deptNames.splice(i, 1)
          }
        }
        if (deptNames.length > 2) {
          str = str + deptNames[0] + '、' + deptNames[1] + '等' + deptNames.length + '个部门'
          return str
        } else {
          for (var j = 0; j < deptNames.length; j++) {
            str += deptNames[j] + '、'
          }
          str = str.substr(0, (str.length - 1))
          return str
        }
      } else {
        return '无'
      }
    },
    // 展示消息状态
    showStatus(status) {
      if (status === 0) {
        return "<i class='el-icon-warning' style='color:#409EFF'><span style='color:#409EFF'>&nbsp;未读</span>"
      } else {
        return "<i class='el-icon-circle-check' style='color:#67C23A'><span style='color:#67C23A'>&nbsp;已读</span>"
      }
    },
    // 展示发布时间
    showReleaseTime(time) {
      if (time) {
        return formatDateTime(time)
      } else {
        return '无'
      }
    },
    // 展示发布人
    showReleaser(releaser) {
      if (!releaser) {
        return '无'
      } else {
        return releaser
      }
    }

  },

  mounted() {
    // 默认综合查询
    this.searchByKeyWords(this.req)
  }
}

</script>
