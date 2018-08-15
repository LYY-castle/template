<template>
  <div class='container'>
    <el-row>
      <el-form :inline="true" size="small">
        <el-form-item label="活动名称：" prop="campaignId">
          <el-select placeholder="请选择活动"  @change="selectOneCampaign(campaignId)" v-model="campaignId">
            <el-option
            v-for="item in campaigns"
            :label="item.campaignName"
            :value="item.campaignId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户姓名：">
          <el-input placeholder="客户姓名（上限50字符）" v-model="req.customerName" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="主叫：">
          <el-input placeholder="主叫号码（上限20字符）" v-model="req.caller" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="被叫：">
          <el-input placeholder="被叫号码（上限20字符）" v-model="req.callee" maxlength="20"></el-input>
        </el-form-item><br/>
        <el-form-item label="联系时间：">
          <el-date-picker
              v-model="req.startTime"
              type="datetime"
              placeholder="开始日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="00:00:00">
          </el-date-picker>
          到
          <el-date-picker
              v-model="req.endTime"
              type="datetime"
              placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="00:00:00">
          </el-date-picker>
          <el-form-item label="通话时间：">
            <el-input v-model="req.stime" style="width:80px" @change="checkNo(req.stime)" onkeypress="return event.keyCode>=48&&event.keyCode<=57" :maxlength="3"></el-input>
            至
            <el-input v-model="req.etime" style="width:80px" @change="checkNo(req.etime)" onkeypress="return event.keyCode>=48&&event.keyCode<=57" :maxlength="3"></el-input>分钟
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="req.pageNo=1;searchByKeyWords(req);">筛选</el-button>
          <el-button type="danger" @click="campaignId='';clearForm(req);putAllcamps();">重置</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <el-row>
      <el-col>
        <el-table :data="tableData" border>
          <el-table-column align="center" label="序号" width="55">
            <template slot-scope="scope">
                <div>{{scope.$index+(req.pageNo-1)*10+1}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="客户姓名">
            <template slot-scope="scope">
              <el-button type="text" @click="" size="medium">{{scope.row.customerName}}</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="联系电话">
            <template slot-scope="scope">
              <div>{{hideMobile(scope.row.customerPhone)}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="归属活动">
            <template slot-scope="scope">
              <div>{{showCampaignName(scope.row.campaignId)}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="员工姓名" prop="staffName">
          </el-table-column>
          <el-table-column align="center" label="最近联系时间" prop="callTime">
          </el-table-column>
          <el-table-column align="center" label="预约时间">
            <template slot-scope="scope">
              <div>{{showAppointTime(scope.row.appointTime)}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="主叫" prop="callerNumber">
          </el-table-column>
          <el-table-column align="center" label="被叫">
              <template slot-scope="scope">
                <div>{{hideMobile(scope.row.calleeNumber)}}</div>
              </template>
          </el-table-column>
          <el-table-column align="center" label="通话时长" prop="talkTime">
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="contactDetail();" size="medium">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-row style="margin-top:5px;">
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
  import { getMenu } from '@/api/dashboard' // 菜单栏
  import { formatDateTime, checkNo } from '@/utils/tools' // 格式化时间
  import {
    getAllCamps,
    queryByKeyWords
  } from '@/api/find_dail_staff' // api接口引用

  export default {
    name: 'find_dail_staff',

    data() {
      return {
        tableData: [], // 表格数据
        pageShow: false, // 分页显示与否
        pageInfo: {}, // 分页信息
        campaigns: [], // 所有活动 (名称+id)
        campaignId: '', // select框选中的活动id
        // 查询条件
        req: {
          customerName: '',
          campaign: [],
          caller: '',
          callee: '',
          startTime: '',
          endTime: '',
          stime: '',
          etime: '',
          pageNo: 1

        }
      }
    },

    methods: {
      // 根据当前登录人显示活动
      getAllCampsByStaff() {
        getAllCamps()
          .then(response => {
            if (response.data.code === 0) {
              this.campaigns = response.data.data
            }
          })
          .catch(error => {
            console.log(error)
          })
      },
      // 时间戳转年月日时分秒
      formatDateTime: formatDateTime,
      checkNo: checkNo,
  
      // 将选择的campaignId放入数组
      selectOneCampaign(campaignId) {
        // 清空数组
        this.req.campaign = []
        this.req.campaign.push(campaignId)
      },
      // 分页翻页功能
      handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
        this.req.pageNo = val
        this.searchByKeyWords(this.req)
      },
      // 综合查询
      searchByKeyWords(req) {
        queryByKeyWords(req)
          .then(response => {
            if (response.data.code === 0) {
              this.tableData = response.data.data
              this.pageShow = true
              this.pageInfo = response.data.pageInfo
            } else {
              this.tableData = response.data.data
              this.pageShow = false
              this.$message.error = '无查询结果，请核对查询条件'
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
      // 显示活动名称
      showCampaignName(campaignId) {
        for (var i = 0; i < this.campaigns.length; i++) {
          if (campaignId === this.campaigns[i].campaignId) {
            return this.campaigns[i].campaignName
          }
        }
      },

      // 预约时间补无
      showAppointTime(appointTime) {
        if (appointTime) {
          return appointTime
        } else {
          return '无'
        }
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
        // this.req.customerName = ''
        // this.req.caller = ''
        // this.req.callee = ''
        // this.req.startTime = ''
        // this.req.endTime = ''
        // this.req.stime = ''
        // this.req.etime = ''
      },

      putAllcamps() {
        this.req.campaign = []
        for (var i = 0; i < this.campaigns.length; i++) {
          this.req.campaign.push(this.campaigns[i].campaignId)
        }
      },
      // 接触记录详情
      contactDetail() {
  
      }
  
    },

    watch: {},

    mounted() {
      // this.getAllCampsByStaff()
      // this.searchByKeyWords(this.req)
      getAllCamps()
        .then(response => {
          if (response.data.code === 0) {
            this.campaigns = response.data.data
            for (var i = 0; i < this.campaigns.length; i++) {
              this.req.campaign.push(this.campaigns[i].campaignId)
            }
            this.searchByKeyWords(this.req)
          }
        })
    }

  }

</script>


