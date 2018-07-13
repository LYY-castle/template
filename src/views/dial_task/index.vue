<template>
  <div class='container' style="padding:0 20px;">
      <el-row>
          <el-form :inline="true" size="small">
            <el-form-item label="分配时间：">
                <el-date-picker
                    v-model="req.distributeTimeStart"
                    type="datetime"
                    placeholder="开始时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    default-time="00:00:00">
                </el-date-picker>
                到
                <el-date-picker
                    v-model="req.distributeTimeEnd"
                    type="datetime"
                    placeholder="结束时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    default-time="00:00:00">
                </el-date-picker>
            </el-form-item>&nbsp;&nbsp;
            <el-form-item label="预约时间：">
                <el-date-picker
                    v-model="req.appointTimeStart"
                    type="datetime"
                    placeholder="开始时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    default-time="00:00:00">
                </el-date-picker>
                到
                <el-date-picker
                    v-model="req.appointTimeEnd"
                    type="datetime"
                    placeholder="结束时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    default-time="00:00:00">
                </el-date-picker>
            </el-form-item><br/>

            <el-form-item label="客户姓名：">
                <el-input v-model="req.customerName" placeholder="客户姓名（限长50字符）" maxlength="50"></el-input>
            </el-form-item>&nbsp;&nbsp;&nbsp;&nbsp;
            <el-form-item label="客户电话：">
                <el-input v-model="req.customerPhone" placeholder="客户电话（限长50字符）" maxlength="50"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="req.pageNo=1;searchByKeyWords(req)" icon="el-icon-search">筛选</el-button>
                <el-button type="danger" @click="clearForm(req)">重置</el-button>
            </el-form-item>
          </el-form>
      </el-row>
      
      <template>
      <el-row>
          <el-tabs @tab-click="handleClick" v-model="activeName" type="card">
            <el-tab-pane name='firstDial' label='首拨名单'></el-tab-pane>
            <el-tab-pane name='orderDial' label='预约名单'></el-tab-pane>
          </el-tabs>
      </el-row>
      </template>

      <el-row>
      <el-col>
        <el-table
          :data="tableData"
          border
          @selection-change="handleSelectionChange">
          <el-table-column
            align="center"
            type="selection"
            width="55">  
          </el-table-column>
          <el-table-column
            align="center"
            label="序号"
            width="55">
            <template
              slot-scope="scope">
              <div>{{scope.$index+(req.pageNo-1)*10+1}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="客户姓名">
            <template slot-scope="scope">
              <div>{{scope.row.customerName}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="客户电话">
            <template
              slot-scope="scope">
              <div>{{hideMobile(scope.row.customerPhone)}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="地区"
            prop="customerAddress">
          </el-table-column>
          <el-table-column
            align="center"
            prop="distributeTime"
            label="分配时间">
          </el-table-column>
          <el-table-column
            align="center"
            label="预约时间">
            <template
              slot-scope="scope">
              <div>{{hasAppointTime(scope.row.appointTime)}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="最后联系时间">
            <template slot-scope="scope">
              <div>{{hasLastContactTime(scope.row.lastContactTime)}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="100">
          <template slot-scope="scope">
            <el-button @click="dialTo(scope.row.taskId,scope.row.campaignId,scope.row.isBlacklist,scope.row.customerPhone)" size="small" type="text"><img src="../../../static/images/my_imgs/img_dial.png" alt="拨打"/>拨打</el-button>
          </template>
          </el-table-column>
        </el-table>
      </el-col> 
    </el-row>
    <el-row style="margin-top:5px;">
        <el-button type="primary" @click="quickDialto();">快速拨打勾选</el-button>
        <el-pagination
          v-if="pageShow"
          background
          @current-change="handleCurrentChange"
          :current-page=pageInfo.pageNo
          :page-sizes="[10, 20, 30, 50]"
          :page-size=pageInfo.pageSize
          layout="total, prev, pager, next, jumper"
          :total=pageInfo.totalCount style="text-align: right;float:right;">
        </el-pagination>
    </el-row>
  </div>
</template>

<style lang='scss' scoped>
</style>

<script>
import { getMenu } from '@/api/dashboard' // 侧边菜单栏
// import { rule } from '@/utils/validate' // 校验工具
import { formatDateTime } from '@/utils/tools' // 格式化时间
import {
  queryByKeywords,
  isInNodisturbPhones
} from '@/api/dialTask' // api接口

export default {
  name: 'dialTask',

  data() {
    return {
      activeName: 'firstDial',
      tableData: [], // 表格数据
      pageShow: true, // 是否显示分页
      pageInfo: {}, // 分页信息
      flag: false, // 免访号段的标志
      taskIds: [], // 快速拨打勾选传入id的数组
      // 查询条件
      req: {
        distributeTimeStart: '',
        distributeTimeEnd: '',
        appointTimeStart: '',
        appointTimeEnd: '',
        customerName: '',
        customerPhone: '',
        contactStatus: '0',
        status: '0',
        pageNo: 1
      }
    }
  },

  // 组件刚被创建时 属性还未计算时   methods方法还未调用时
  beforeCreate() {
    getMenu()
      .then(response => {
        const data = response.data
        sessionStorage.setItem('getMenu', JSON.stringify(data))
      })
      .catch(error => {
        console.log(error)
      })
  },

  // 模板编译/挂载之后
  mounted() {
    this.searchByKeyWords(this.req)
  },

  methods: {
    // 综合查询
    searchByKeyWords(req) {
      queryByKeywords(req)
        .then(response => {
          if (response.data.code === 0) {
            if (response.data.data) {
              this.tableData = response.data.data
              this.pageInfo = response.data.pageInfo
              this.pageShow = true
            } else {
              this.$message = '无查询结果，请核对查询条件'
              this.tableData = response.data.data
              this.pageShow = false
            }
          }
        })
        .catch(error => {
          console.log(error)
        })
    },

    // 隐藏手机号
    hideMobile(mobile) {
      if (mobile) {
        return mobile.substring(0, 3) + '****' + mobile.substring(7, 11)
      }
    },

    // 预约时间补无
    hasAppointTime(appointTime) {
      if (appointTime) {
        return appointTime
      } else {
        return '无'
      }
    },

    // 最后联系时间补无
    hasLastContactTime(lastContactTime) {
      if (lastContactTime) {
        return lastContactTime
      } else {
        return '无'
      }
    },

    // 分页翻页功能
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.req.pageNo = val
      this.searchByKeyWords(this.req)
    },

    // 清空重置
    clearForm(obj, formName) {
      for (const key in obj) {
        if (key !== 'pageNo') {
          obj[key] = ''
        }
      }
      if (formName) {
        this.$refs[formName].resetFields()
      }
    },
    // 时间戳转年月日时分秒
    formatDateTime: formatDateTime,

    // 表格多选框
    handleSelectionChange(val) {
      this.taskIds.length = 0
      for (var i = 0; i < val.length; i++) {
        this.taskIds.push(val[i].taskId)
      }
    },
    // tab点击时触发的事件
    handleClick(tab, event) {
      if (tab.name === 'firstDial') {
        // 点击了首拨名单
        this.req.contactStatus = 0
        this.req.status = 0
        this.searchByKeyWords(this.req)
      } else {
        // 点击了预约名单
        this.req.contactStatus = ''
        this.req.status = 1
        this.searchByKeyWords(this.req)
      }
    },
    // 跳转拨打页面
    dialTo(taskId, campaignId, isBlacklist, customerPhone) {
      // 调用方法判断是否在免访号段内
      this.inNodisturbPhones(customerPhone)
      if (this.flag === false && isBlacklist === '0') {
        window.localStorage.removeItem('taskIds')
        window.localStorage.setItem('taskId', taskId)
        window.localStorage.setItem('campaignId', campaignId)
        this.$message('跳转页面')
        // this.$router.push({
        //   path: '/dial_custominfo/index'
        // })
      } else {
        this.$message('该客户在黑名单或免访号段中,无法拨打!')
      }
    },

    // 验证是否在免访号段内
    inNodisturbPhones(customerPhone) {
      isInNodisturbPhones(customerPhone)
        .then(response => {
          if (response.data.code === 0) {
            this.flag = false
          } else {
            this.flag = true
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 快速拨打勾选
    quickDialto() {
      if (this.taskIds.length === 0) {
        this.$message.error('您还未选中任务，请先选择任务.')
      } else {
        // this.taskIds = JSON.stringify(this.taskIds)
        window.localStorage.removeItem('taskIds')
        window.localStorage.setItem('taskIds', this.taskIds)
        this.$message('跳转到拨打详情页')
        // this.$router.push({
        //   path: '/dial_custominfo/index'
        // })
      }
    }
  }
}
</script>
