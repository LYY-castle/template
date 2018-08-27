<template>
  <div class="container">
    <el-row margin-top:>
      <el-form :inline="true" size="small" :model="req" ref="searchForm">
        <el-form-item prop="contactTaskId" v-if="n==2||n==3" label="坐席编号:">
          <el-input v-model="req.contactTaskId" placeholder="坐席任务编号" maxlength="50" v-if="n==2||n==3"></el-input>
        </el-form-item>
        <el-form-item prop="qualityTaskId" v-if="n==1||n==4" label="质检编号:">
          <el-input v-model="req.qualityTaskId" placeholder="质检任务编号" maxlength="50" v-if="n==1||n==4"></el-input>
        </el-form-item>
        <el-form-item v-if="n==1||n==4" prop="activityId" label="质检活动:">
          <el-select v-model="req.activityId" placeholder="质检活动">
            <el-option
                v-for="item in campData"
                :key="item.activityId"
                :label="item.activityName"
                :value="item.activityId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="gradeId" label="质检评分:">
          <el-select v-model="req.gradeId" placeholder="质检评分表">
            <el-option
                v-for="item in gradeForm"
                :key="item.gradeId"
                :label="item.gradeName"
                :value="item.gradeId">
            </el-option>
          </el-select>
        </el-form-item>
<<<<<<< src/views/query_quality_mark/index.vue
        <el-form-item prop="agentid" label="坐席工号:">
          <el-input v-model="req.agentid" placeholder="坐席工号" maxlength="50" v-if="n==1||n==4"></el-input>
        </el-form-item>
        <el-form-item prop="qcAgentid" label="质检员工:">
          <el-input v-model="req.qcAgentid" placeholder="质检员工号" maxlength="50" v-if="n==2||n==3"></el-input>
=======
        <el-form-item prop="agentid" v-if="n==1||n==4">
          <el-input v-model="req.agentid" placeholder="坐席工号" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item prop="qcAgentid" v-if="n==2||n==3">
          <el-input v-model="req.qcAgentid" placeholder="质检员工号" maxlength="50"></el-input>
>>>>>>> src/views/query_quality_mark/index.vue
        </el-form-item>
        <el-form-item label="质检结束时间:" prop="timeValue">
          <el-date-picker
              v-model="timeValue"
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <!-- <br> -->
        <el-form-item label="质检评分分数" prop="min" class="min">
          <!-- <el-col :span="1"> -->
            <el-input v-model="req.min" size="small" v-on:blur="checkMin()"></el-input>
          <!-- </el-col>  -->
        </el-form-item>
        <b style="display:inline-block;padding-top:8px;font-size:14px;color: #606266;">到</b>
        <el-form-item prop="max" class="max">
          <!-- <el-col :span="1"> -->
            <el-input v-model="req.max" size="small" v-on:blur="checkMax()"></el-input>
          <!-- </el-col> -->
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="req.pageNo=1;findQualityResultByInfo(req);req2=clone(req);" icon="el-icon-search">查询</el-button>
          <el-button type="danger" @click="resetForm('searchForm');">重置</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row v-if="n==1||n==4">
      <el-col>
        <el-table
          :data="tableData"
          border>
          <el-table-column
            align="center"
            label="序号"
            width="55">
            <template
              slot-scope="scope">
              <div>{{scope.$index+(req2.pageNo-1)*req2.pageSize+1}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="质检评分编号">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleClickDetail(scope.row);">{{scope.row.gradeId}}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="qualityTaskId"
            width="120"
            label="质检任务编号">
          </el-table-column>
          <el-table-column
            align="center"
            label="质检活动">
            <template slot-scope="scope">
              <div>{{scope.row.campaignId == null ? '' : map_activity.get(scope.row.campaignId)}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="gradeName"
            label="质检评分表">
          </el-table-column>
          <el-table-column
            align="center"
            width="55"
            label="分数">
            <template slot-scope="scope">
              <div>{{scope.row.branch==null?0:scope.row.branch}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="55"
            prop="contactRecordUrl"
            label="录音">
            <template slot-scope="scope">
              <a v-if="scope.row.contactRecordUrl" style="color:#63B0FF" :title="scope.row.contactRecordUrl">查看</a>
              <div v-if="!scope.row.contactRecordUrl">无</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="155"
            prop="modifyTime"
            label="质检编辑时间">
          </el-table-column>
          <el-table-column
            align="center"
            prop="customerName"
            label="客户姓名">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="right">
                <p>{{ scope.row.customerName }}</p>
                <div slot="reference">
                  {{ scope.row.customerName }}
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="qualityStaffName"
            label="质检员姓名">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="right">
                <p>{{ scope.row.qualityStaffName }}</p>
                <div slot="reference">
                  {{ scope.row.qualityStaffName }}
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="contactStaffId"
            label="坐席工号">
          </el-table-column>
          <el-table-column
            align="center"
            prop="contactStaffName"
            label="员工姓名">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="right">
                <p>{{ scope.row.contactStaffName }}</p>
                <div slot="reference">
                  {{ scope.row.contactStaffName }}
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="modifierTime"
            label="备注">
            <template slot-scope="scope">
              <div>{{scope.row.complete==0?'草稿':(scope.row.complete==1?'已完成':'')}}</div>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row v-if="n==2||n==3">
      <el-col>
        <el-table
          :data="tableData"
          border>
          <el-table-column
            align="center"
            label="序号"
            width="55">
            <template
              slot-scope="scope">
              <div>{{scope.$index+(req2.pageNo-1)*req2.pageSize+1}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="质检评分编号">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleClickDetail(scope.row)">{{scope.row.gradeId}}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="contactTaskId"
            width="170"
            label="坐席任务编号">
          </el-table-column>
          <el-table-column
            align="center"
            prop="gradeName"
            label="质检评分表">
          </el-table-column>
          <el-table-column
            align="center"
            width="55"
            label="分数">
            <template slot-scope="scope">
              <div>{{scope.row.branch==null?0:scope.row.branch}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="55"
            prop="contactRecordUrl"
            label="录音">
            <template slot-scope="scope">
              <a v-if="scope.row.contactRecordUrl" style="color:#63B0FF" :title="scope.row.contactRecordUrl">查看</a>
              <div v-if="!scope.row.contactRecordUrl">无</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="155"
            prop="modifyTime"
            label="质检编辑时间">
          </el-table-column>
          <el-table-column
            align="center"
            prop="customerName"
            label="客户姓名">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="right">
                <p>{{ scope.row.customerName }}</p>
                <div slot="reference">
                  {{ scope.row.customerName }}
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="qualityStaffId"
            label="质检员工号">
          </el-table-column>
          <el-table-column
            align="center"
            prop="qualityStaffName"
            label="质检员姓名">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="right">
                <p>{{ scope.row.qualityStaffName }}</p>
                <div slot="reference">
                  {{ scope.row.qualityStaffName }}
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="contactStaffName"
            label="坐席姓名">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="right">
                <p>{{ scope.row.contactStaffName }}</p>
                <div slot="reference">
                  {{ scope.row.contactStaffName }}
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="备注">
            <template slot-scope="scope">
              <div>{{scope.row.complete==0?'草稿':(scope.row.complete==1?'已完成':'')}}</div>
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
        :current-page=pageInfo.pageNo
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size=pageInfo.pageSize
        layout="total, sizes, prev, pager, next, jumper "
        :total=pageInfo.totalCount style="text-align: right;float:right;">
      </el-pagination>
    </el-row>
     <el-dialog :visible.sync="detailVisible" top="5vh" width="90%" @close="cleanInfo()" append-to-body>
      <div slot="title" style="text-align: center;">
        <el-button @click="detailVisible = false;" style="float:left;" icon="el-icon-arrow-left">返 回</el-button>
        <h3 style="display:inline;">质检评分详情</h3>
      </div>
      <div>
        <audio
          autoplay="autoplay"
          controls="controls"
          preload="auto"
          src="addScopeUrl">
        </audio>
      </div>
      <el-row>
        <el-table
          :header-row-style="headerRow"
          :data="contactRecordData"
          ref="multipleTable"
          tooltip-effect="dark"
          border
          style="width: 100%;">
          <el-table-column
            width="55"
            align="center"
            type="index"
            label="序号">
          </el-table-column>
          <el-table-column
            width="80"
            align="center"
            prop="staffId"
            label="坐席工号">
          </el-table-column>
          <el-table-column
            align="center"
            prop="DN"
            label="分机号码">
          </el-table-column>
          <el-table-column
            width="160"
            align="center"
            prop="recordId"
            label="记录编号">
          </el-table-column>
          <el-table-column
            width="160"
            align="center"
            prop="callTime"
            label="拨打时间">
          </el-table-column>
          <el-table-column
            align="center"
            prop="answerTime"
            label="接听时间">
          </el-table-column>
          <el-table-column
            align="center"
            prop="talkTime"
            label="通话时长">
          </el-table-column>
          <el-table-column
            align="center"
            prop="callDirection"
            label="呼叫方向">
          </el-table-column>
          <el-table-column
            align="center"
            prop="originNumber"
            label="原始主叫">
          </el-table-column>
          <el-table-column
            align="center"
            prop="callerNumber"
            label="主叫号码">
          </el-table-column>
          <el-table-column
            align="center"
            prop="calleeNumber"
            label="被叫号码">
          </el-table-column>
          <el-table-column
            align="center"
            prop="taskStatus"
            label="任务状态">
          </el-table-column>
          <el-table-column
            align="center"
            prop="summaryDetailInfos"
            label="话后小结">
          </el-table-column>
          <el-table-column
            align="center"
            prop="description"
            label="小结备注">
          </el-table-column>
        </el-table>
      </el-row>
      <el-row style="margin-down:2%;margin-top:2%">
        <el-col style="width:25%">
          <el-card
            class="box-card"
            :data="customerData">
            <div slot="header" class="clearfix">
              <span>客户信息</span>
            </div>
            <div class="text item">
              {{'客户姓名： ' + customerData.customerName }}
            </div>
            <div class="text item">
              {{'电话号码： ' + customerData.mobile }}
            </div>
            <div class="text item">
              {{'客户来源： ' + customerData.source }}
            </div>
            <div class="text item">
              {{'银行卡号： ' + customerData.bankCard }}
            </div>
            <div class="text item">
              {{'身份证号： ' + customerData.idNumber }}
            </div>
              </el-card>
        </el-col>
        <el-col  style="margin-left:2%;width:73%;">
          <el-tabs
            :data="orderData"
            type="border-card"
            v-if="orderHide" style="min-height:223px">
            <el-tab-pane
              v-for="(item,index) in orderData"
              :key="item.name"
              :label="item.productName"
              :name="item.name">
              <span><font>订单号：</font>{{item.orderId}}</span><br/>
              <span><font>产品或服务：</font>{{item.productName}}</span><br/>
              <span><font>商品总额：</font>{{item.totalAmount}}<font>元</font></span><br/>
              <span><font>保险年限：</font>{{item.year}}</span><br/>
            </el-tab-pane>
          </el-tabs>
          <el-card class="box-card"  v-if="!orderHide" style="min-height:223px">
            <div slot="header" class="clearfix">
              <span>订单信息</span>
            </div>
            <div class="text item" style="text-align:center">
              无订单
            </div>
          </el-card>
        </el-col>
      </el-row>
        <el-tabs  type="border-card"
                  style="width:100%;margin-top:2%;"
                  v-model="activeName">
          <el-tab-pane
            v-for="(item,index) in gradeInfo"
            :label="item.gradeName"
            :name="item.gradeId">
            <el-row>
              <el-col :span="2">
                <label>评分表名：</label>
              </el-col>
              <el-col :span="10">
                <span>{{item.gradeName}}</span>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="2">
                <label>描  述：</label>
              </el-col>
              <el-col :span="10">
                <span>{{item.description}}</span>
              </el-col>
            </el-row>

            <el-row v-for="(item1,index1) in gradeInfo[index].gradeTitles"
                    :name="item1.gradeId"
                    style="margin:1% auto">
                    <span>{{(Number(index1)+1)+"、"+item1.titleName}}</span>
              <el-col >
                      <el-radio-group v-model="item1[index1]" style="width:100%">
                      <el-radio style="width:18%;margin-left:2%" v-for="(item2,index2) in item1.gradeOptions" :label="String.fromCharCode(65 +parseInt(index2))+' '+item2.optionName+' 分值：'+item2.score" @change="changeTotalAmount(item.id,item1.titleId,item2.score);changeCheckMenu(item.id,item1.titleId,item2.id)" ></el-radio>
                    </el-radio-group>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="2">
                <label>质检评价：</label>
              </el-col>
              <el-col :span="10">
                <div>{{comment[item.id]?comment[item.id]:'无'}}</div>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="2">
                <label>质检得分：</label>
              </el-col>
              <el-col :span="10">
                <span>{{totalAmount.get(item.id)}}分</span>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
    </el-dialog>
  </div>
</template>
<script>

import {
  findQmCampaignByUser,
  findAllGradeForm,
  findQualityResultByInfo,
  getStaffNameByAgentId,
  checkPromission_qc, // 质检员
  checkPromission_charge, // 现场主管
  checkPromission_sit, // 坐席
  checkPromission_qs, // 质检主管
  getDepartIdByAgentId// 查找部门id
} from '@/api/qm_searchquailitymark'
import {
  queryrecordbytaskid,
  getMarksByTaskId,
  getGradeByGradeId,
  getGradeListByGradeId,
  querycustomerbyid,
  repalceString,
  queryOrder
} from '@/api/qm_quailitymark'
import {
  formatDateTime,
  clone
} from '@/utils/tools'

export default {
  name: 'qmSearchquailitymark',
  data() {
    return {
      n: 0,
      a: false,
      b: false,
      c: false,
      d: false,
      map_activity: new Map(),
      detailVisible: false,
      agentId: localStorage.getItem('agentId'),
      campData: [], // 质检活动
      roleIds: [], // 角色ID
      roleInfo: JSON.parse(localStorage.getItem('userRole')), // 角色信息
      gradeForm: [], // 质检评分表
      tableData: [], // 表格数据
      releaseRecord: [], // 接触记录
      validate: true, // 验证不通过阻止发请求
      pageShow: false, // 分页显示隐藏
      timeValue: [],
      // searchType: '1',
      campaignmap: this.findQmCampaign(),
      // rule: {
      //   customerName: [
      //     { required: true, message: '请输入客户名称', trigger: 'blur' }
      //   ],
      //   idNumber: [
      //     { required: true, message: '请输入身份证号码', trigger: 'blur' },
      //     { pattern: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/, message: '请输入正确的身份证号码' }
      //   ],
      //   sex: [
      //     { required: true, message: '请选择客户性别', trigger: 'blur' },
      //     { validator: checkSex, trigger: 'change' }
      //   ],
      //   mobile: [
      //     { required: true, message: '请输入手机号码', trigger: 'blur' },
      //     { pattern: /^([1][3,4,5,7,8][0-9]{9}|0\d{2,3}-\d{7,8}|\d{1,20})$/, message: '请输入正确的电话号码' }
      //   ]
      // },
      delReq: {
        customerId: ''
      },
      batchDelReq: {
        customerIds: []
      },
      // 查询 发送请求参数
      req: {
        pageNo: 1,
        pageSize: 10,
        start_time: '',
        end_time: '',
        max: null,
        min: null
      },
      req2: {
        pageNo: 1,
        pageSize: 10,
        start_time: '',
        end_time: '',
        max: null,
        min: null
      },
      // 分页数据
      pageInfo: {},
      // ---------------------质检评分详情--------------------
      comment: [],
      contactRecordData: [],
      customerData: {},
      orderHide: false,
      activeName: '',
      gradeInfo: []
    }
  },
  mounted() {
    this.findQmCampaignByUser()
    this.findAllGradeForm()
    this.findQmCampaign()
    // 获取登陆工号的角色 1、质检员  2、团队长  3、坐席  4、质检组长
    // 质检员
    checkPromission_qc(this.agentId).then(response => {
      this.n = 1
      this.a = true
      this.$set(this.req, 'contactTaskId', '')
      this.$set(this.req, 'qcAgentid', localStorage.getItem('agentId'))
      this.$set(this.req, 'qualityTaskId', '')
      this.$set(this.req, 'agentid', '')
      this.$set(this.req, 'gradeId', '')
    }).catch(error => {
      if (error.response.status !== 403) {
        console.log(error)
      }
    })
    // 团队长
    checkPromission_charge(this.agentId).then(response => {
      this.n = 2
      this.b = true
      this.$set(this.req, 'contactTaskId', '')
      this.$set(this.req, 'qcAgentid', '')
      this.$set(this.req, 'activityId', '')
      this.$set(this.req, 'departId', localStorage.getItem('departId'))
      this.$set(this.req, 'gradeId', '')
    }).catch(error => {
      if (error.response.status !== 403) {
        console.log(error)
      }
    })
    // 坐席
    checkPromission_sit(this.agentId).then(response => {
      this.n = 3
      this.c = true
      this.$set(this.req, 'contactTaskId', '')
      this.$set(this.req, 'qcAgentid', '')
      this.$set(this.req, 'contactTaskId', '')
      this.$set(this.req, 'agentid', localStorage.getItem('agentId'))
      this.$set(this.req, 'gradeId', '')
    }).catch(error => {
      if (error.response.status !== 403) {
        console.log(error)
      }
    })
    // 质检组长
    checkPromission_qs(this.agentId).then(response => {
      this.n = 4
      this.d = true
      // if (this.searchType === '1') {
      this.$set(this.req, 'contactTaskId', '')
      this.$set(this.req, 'qualityTaskId', '')
      this.$set(this.req, 'qcAgentid', '')
      this.$set(this.req, 'agentid', '')
      this.$set(this.req, 'activityId', '')
      this.$set(this.req, 'gradeId', '')
      // } else if (this.searchType === '0') {
      //   this.$set(this.req, 'contactTaskId', '')
      //   this.$set(this.req, 'qcAgentid', localStorage.getItem('agentId'))
      //   this.$set(this.req, 'qualityTaskId', '')
      //   this.$set(this.req, 'agentid', '')
      //   this.$set(this.req, 'gradeId', '')
      // }
    }).catch(error => {
      if (error.response.status !== 403) {
        console.log(error)
      }
    })
    this.getDepartIdByAgentId(localStorage.getItem('agentId'))
    if (this.n === 2) {
      this.getStaffNameByAgentId(localStorage.getItem('agentId'))
    }
  },
  methods: {
    // 验证最小值
    checkMin() {
      var reg = /^(0|(\-?)[1-9][0-9]{0,2})$/
      if (this.req.min) {
        var min = parseInt(this.req.min)
      } else if (this.req.min === null) {
        min = 0
      }
      if (this.req.max) {
        var max = parseInt(this.req.max)
      } else if (this.req.max === null) {
        max = 0
      }
      if (reg.test(min)) {
        if (min > max && this.req.max) {
          this.$message.error('分数取值前者不能大于后者！')
        }
      } else {
        this.$message.error('评分只能是-999到999的数字！')
        this.req.min = -999
        if (min > max) {
          this.$message.error('分数取值前者不能大于后者！')
        }
      }
    },
    // 验证最大值
    checkMax() {
      var reg = /^(0|(\-?)[1-9][0-9]{0,2})$/
      if (this.req.min) {
        var min = parseInt(this.req.min)
      } else if (this.req.min === null) {
        min = 0
      }
      if (this.req.max) {
        var max = parseInt(this.req.max)
      } else if (this.req.max === null) {
        max = 0
      }
      if (reg.test(max)) {
        if (max < min && this.req.min) {
          this.$message.error('分数取值前者不能大于后者！')
        }
      } else {
        this.$message.error('评分只能是-999到999的数字！')
        this.req.max = 999
        if (max < min) {
          this.$message.error('分数取值前者不能大于后者！')
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
    // 深度克隆
    clone: clone,
    resetForm(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
      this.timeValue = []
      this.$set(this.req, 'start_time', '')
      this.$set(this.req, 'end_time', '')
      if (this.n === 1) {
        this.$set(this.req, 'contactTaskId', '')
        this.$set(this.req, 'qcAgentid', localStorage.getItem('agentId'))
        this.$set(this.req, 'qualityTaskId', '')
        this.$set(this.req, 'agentid', '')
        this.$set(this.req, 'gradeId', '')
      } else if (this.n === 2) {
        // if (this.searchType === '1') {
        this.$set(this.req, 'contactTaskId', '')
        this.$set(this.req, 'qcAgentid', '')
        this.$set(this.req, 'activityId', '')
        this.$set(this.req, 'departId', localStorage.getItem('departId'))
        this.$set(this.req, 'gradeId', '')
        // } else if (this.searchType === '0') {
        //   this.$set(this.req, 'contactTaskId', '')
        //   this.$set(this.req, 'qcAgentid', localStorage.getItem('agentId'))
        //   this.$set(this.req, 'contactTaskId', '')
        //   this.$set(this.req, 'agentid', '')
        //   this.$set(this.req, 'gradeId', '')
        // }
      } else if (this.n === 3) {
        this.$set(this.req, 'contactTaskId', '')
        this.$set(this.req, 'qcAgentid', '')
        this.$set(this.req, 'contactTaskId', '')
        this.$set(this.req, 'agentid', localStorage.getItem('agentId'))
        this.$set(this.req, 'gradeId', '')
      } else if (this.n === 4) {
        // if (this.searchType === '1') {
        this.$set(this.req, 'contactTaskId', '')
        this.$set(this.req, 'qualityTaskId', '')
        this.$set(this.req, 'qcdepartId', '')
        this.$set(this.req, 'agentid', '')
        this.$set(this.req, 'activityId', '')
        this.$set(this.req, 'gradeId', '')
        // } else if (this.searchType === '0') {
        //   this.$set(this.req, 'contactTaskId', '')
        //   this.$set(this.req, 'qcAgentid', localStorage.getItem('agentId'))
        //   this.$set(this.req, 'qualityTaskId', '')
        //   this.$set(this.req, 'agentid', '')
        //   this.$set(this.req, 'gradeId', '')
        // }
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.validate = true
        } else {
          this.$message.error('请检查是否填写正确')
          this.validate = false
        }
      })
    },
    // 清空重置
    clearForm(obj, formName) {
      for (const key in obj) {
        if (key !== 'pageNo') {
          obj[key] = ''
        }
      }
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
    },
    // 时间戳转年月日时分秒
    formatDateTime: formatDateTime,
    getStaffNameByAgentId(agentId) {
      getStaffNameByAgentId(agentId).then(response => {
        localStorage.setItem('departId', response.data.data[0].departId)
      })
    },
    // 查询部门id
    getDepartIdByAgentId(agentid) {
      getDepartIdByAgentId(agentid).then(response => {
        if (this.n === 2) {
          this.req.departId = response.data.data[0].departId
        } else if (this.n === 4) {
          this.req.qcdepartId = response.data.data[0].departId
        }
      })
    },
    // 查询质检评分
    findQmCampaignByUser() {
      findQmCampaignByUser().then(response => {
        if (response.data.code === 0) {
          this.campData = response.data.data
        } else {
          this.$message(response.data.message)
        }
      })
    },
    // 查询下属所有活动
    findQmCampaign() {
      findQmCampaignByUser().then(response => {
        if (response.data.code === 0) {
          for (var i in this.campData) {
            this.map_activity.set(this.campData[i].activityId, this.campData[i].activityName)
          }
        }
      })
    },
    // 查询评分表
    findAllGradeForm() {
      findAllGradeForm().then(response => {
        var pageSize = response.data.pageInfo.totalCount
        findAllGradeForm({ 'pageSize': pageSize }).then(response => {
          this.gradeForm = response.data.data
        })
      })
    },
    // 查询质检评分
    findQualityResultByInfo(req) {
      // if (this.n) {
      //   switch (this.n) {
      //     case 1:
      //       console.log('质检员')
      //       this.req = clone(req)
      //       break
      //     case 2:
      //       console.log('团队长')
      //       break
      //     case 3:
      //       console.log('坐席')
      //       this.req = clone(req)
      //       break
      //     case 4:
      //       console.log(4)
      //       console.log('质检组长')
      //       break
      //     case 5:
      //       break
      //     default:
      //       this.$message('你没有权限操作此页面')
      //   }
      // }
      if (this.a === false && this.b === false && this.c === false && this.d === false) {
        this.$message.error('没有权限操作此页面')
      }
      if (this.timeValue && this.timeValue.length !== 0) {
        req.start_time = this.timeValue[0]
        req.end_time = this.timeValue[1]
      } else if (this.timeValue === null || this.timeValue.length === []) {
        req.start_time = null
        req.end_time = null
      }
      if (req.max || req.max === 0) {
        req.max = parseInt(req.max)
      } else {
        req.max = null
      }
      if (req.min || req.min === 0) {
        req.min = parseInt(req.min)
      } else {
        req.min = null
      }
      findQualityResultByInfo(req)
        .then(response => {
          if (response.data.code === 0) {
            this.tableData = response.data.data
            if (response.data.pageInfo) {
              this.pageInfo = response.data.pageInfo
              this.pageShow = true
            } else {
              this.pageShow = false
            }
          } else {
            this.$message(response.data.messages)
            this.tableData = response.data.data
            this.pageShow = false
          }
        })
        .catch(error => {
          console.log(error.response)
        })
    },
    // --------------------质检评分详情---------------------
    reLoad(obj) {
      this.comment = []
      switch (obj) {
        case 'detailVisible':this.detailVisible = false
          this.handleClickDetail(this.row)
          break
        default:break
      }
    },
    getGradeRecord(value, type) {
      var gradeRecord = {}
      gradeRecord.gradeRecordId = this.gradeRecordId
      gradeRecord.complete = value
      if (type === 0) {
        gradeRecord.qualityTaskId = this.addUrlData.id
      } else {
        gradeRecord.qualityTaskId = this.editUrlData.id
      }
      var markParameters = []
      for (var i = 0; i < this.gradeInfo.length; i++) {
        var obj = {}
        obj.branch = this.totalAmount.get(this.gradeInfo[i].id)
        obj.evalute = this.comment[this.gradeInfo[i].id]
        obj.gradeId = this.gradeInfo[i].gradeId
        obj.gradeName = this.gradeInfo[i].gradeName
        var markTitleParameters = []
        var gradeCheck = typeof this.totalCheckMap.get(this.gradeInfo[i].id) === 'undefined' ? new Map() : this.totalCheckMap.get(this.gradeInfo[i].id)
        for (var j = 0; j < this.gradeInfo[i].gradeTitles.length; j++) {
          var childObj = {}
          childObj.titleId = this.gradeInfo[i].gradeTitles[j].titleId
          var checks = typeof gradeCheck.get(childObj.titleId) === 'undefined' ? [] : gradeCheck.get(childObj.titleId)
          var markOptionParameters = []
          for (var k = 0; k < checks.length; k++) {
            var mark = {}
            mark.optionId = checks[k].toString()
            markOptionParameters.push(mark)
          }
          childObj.markOptionParameters = markOptionParameters
          markTitleParameters.push(childObj)
        }
        obj.markTitleParameters = markTitleParameters
        markParameters.push(obj)
      }
      gradeRecord.markParameters = markParameters
      return gradeRecord
    },
    /** 回显质检评分结果 */
    getQuailtyRecord(row) {
      this.totalCheckMap = new Map()
      getGradeListByGradeId({ 'qualityTaskId': row.qualityTaskId }).then(response => {
        this.totalAmountMap = new Map()
        this.totalAmount = new Map()
        this.totalCheckMap = new Map()
        this.totalCheck = new Map()
        if (response.data.code === 0) {
          this.gradeRecordId = response.data.data.gradeRecordId
          var obj = response.data.data.markResults
          for (var i = 0; i < obj.length; i++) {
            for (var j = 0; j < this.gradeInfo.length; j++) {
              if (obj[i].gradeId === this.gradeInfo[j].gradeId) {
                this.comment[this.gradeInfo[j].id] = obj[i].evalute
                var markTitleResults = obj[i].markTitleResults
                var gradeTitles = this.gradeInfo[j].gradeTitles
                for (var o = 0; o < markTitleResults.length; o++) {
                  for (var p = 0; p < gradeTitles.length; p++) {
                    if (markTitleResults[o].titleId === gradeTitles[p].titleId) {
                      for (var k = 0; k < markTitleResults[o].markOptionResults.length; k++) {
                        if (markTitleResults[o].markOptionResults[k].optionId !== null) {
                          var arr = gradeTitles[p].gradeOptions
                          for (var l = 0; l < arr.length; l++) {
                            if (markTitleResults[o].markOptionResults[k].optionId === arr[l].id) {
                              this.gradeInfo[j].gradeTitles[p][p] = String.fromCharCode(65 + parseInt(l)) + ' ' + arr[l].optionName + ' 分值：' + arr[l].score
                              this.changeTotalAmount(this.gradeInfo[j].id, this.gradeInfo[j].gradeTitles[p].titleId, arr[l].score)
                              this.changeCheckMenu(this.gradeInfo[j].id, this.gradeInfo[j].gradeTitles[p].titleId, arr[l].id)
                            }
                          }
                        }
                      }
                      break
                    }
                  }
                }
                break
              }
            }
          }
        } else {
          this.$message(response.data.message)
        }
        this.$forceUpdate()
      }).catch(error => {
        console.log(error)
      })
    },
    changeTotalAmount(item, titleId, score) {
      var tempMap = new Map()
      tempMap = typeof this.totalAmountMap.get(item) === 'undefined' ? tempMap : this.totalAmountMap.get(item)
      tempMap.set(titleId, score)
      this.totalAmountMap.set(item, tempMap)
      this.totalAmountMap.forEach((value, key) => {
        var amount = 0
        value.forEach((val, keyNode) => {
          amount += parseInt(val)
        })
        this.totalAmount.set(key, amount)
      })
      this.$forceUpdate()
    },
    changeCheckMenu(item, titleId, id) {
      var tempCheckMap = new Map()
      tempCheckMap = typeof this.totalCheckMap.get(item) === 'undefined' ? tempCheckMap : this.totalCheckMap.get(item)
      var ids = []
      ids = typeof this.totalCheck.get(titleId) === 'undefined' ? ids : this.totalCheck.get(titleId)
      for (var i = 0; i < ids.length; i++) {
        if (ids[i] === id) {
          ids.splice(i, 1)
        }
      }
      ids.push(id)
      tempCheckMap.set(titleId, ids)
      this.totalCheckMap.set(item, tempCheckMap)
      this.totalCheck.set(titleId, ids)
    },
    /** 获取通话记录 */
    getContactRecord(row) {
      console.log(11)
      console.log(row)
      queryrecordbytaskid({ 'taskId': row.contactTaskId, 'campaignId': row.campaignId }).then(response => {
        if (response.data.code === 0) {
          this.contactRecordData = response.data.data
          for (var i in this.contactRecordData) {
            if (row.recordId === this.contactRecordData[i].recordId) { // 截取当前通话记录
              this.addScopeUrl = this.contactRecordData[i].soundRecordUrl === null ? '' : this.contactRecordData[i].soundRecordUrl
              this.taskId = row.recordId
            }
            this.contactRecordData[i].staffId = this.contactRecordData[i].staffId === null ? '' : this.contactRecordData[i].staffId
            if (this.contactRecordData[i].callDirection === '0') {
              this.contactRecordData[i].DN = this.contactRecordData[i].callerNumber === null ? '' : this.contactRecordData[i].callerNumber
              this.contactRecordData[i].callDirection = '呼出'
              this.contactRecordData[i].originNumber = this.contactRecordData[i].originNumber === null ? '' : repalceString(this.contactRecordData[i].originNumber, 4, 4, '*')
              this.contactRecordData[i].callerNumber = this.contactRecordData[i].callerNumber === null ? '' : this.contactRecordData[i].callerNumber
              this.contactRecordData[i].calleeNumber = this.contactRecordData[i].calleeNumber === null ? '' : repalceString(this.contactRecordData[i].calleeNumber, 4, 4, '*')
            } else {
              this.contactRecordData[i].DN = this.contactRecordData[i].calleeNumber === null ? '' : this.contactRecordData[i].calleeNumber
              this.contactRecordData[i].callDirection = '呼入'
              this.contactRecordData[i].originNumber = this.contactRecordData[i].originNumber === null ? '' : repalceString(this.contactRecordData[i].originNumber, 4, 4, '*')
              this.contactRecordData[i].callerNumber = this.contactRecordData[i].callerNumber === null ? '' : repalceString(this.contactRecordData[i].callerNumber, 4, 4, '*')
              this.contactRecordData[i].calleeNumber = this.contactRecordData[i].calleeNumber === null ? '' : this.contactRecordData[i].calleeNumber
            }
            switch (this.contactRecordData[i].taskStatus) {
              case '0': this.contactRecordData[i].taskStatus = '首拨'
                break
              case '1': this.contactRecordData[i].taskStatus = '预约'
                break
              case '2': this.contactRecordData[i].taskStatus = '成功'
                break
              case '3': this.contactRecordData[i].taskStatus = '失败'
                break
              case '4': this.contactRecordData[i].taskStatus = '过期'
                break
            }
            this.contactRecordData[i].recordId = this.contactRecordData[i].recordId === null ? '' : this.contactRecordData[i].recordId
            this.contactRecordData[i].callTime = this.contactRecordData[i].callTime === null ? '无' : this.contactRecordData[i].callTime
            this.contactRecordData[i].answerTime = this.contactRecordData[i].answerTime === null ? '无' : this.contactRecordData[i].answerTime
            this.contactRecordData[i].talkTime = this.contactRecordData[i].talkTime === null ? '' : this.contactRecordData[i].talkTime
            this.contactRecordData[i].summaryDetailInfos = this.contactRecordData[i].summaryDetailInfos.length === 0 ? '无' : this.contactRecordData[i].summaryDetailInfos[0].name
            this.contactRecordData[i].description = this.contactRecordData[i].description === null ? '无' : this.contactRecordData[i].description
          }
        } else {
          this.$message(response.data.message)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    /** 获取客户信息 */
    getCustomerInfo(row) {
      querycustomerbyid({ 'customerId': row.customerId }).then(response => {
        if (response.data.code === 0) {
          var data = response.data.data
          this.customerData.bankCard = data.bankCard === null ? '' : data.bankCard
          this.customerData.customerName = data.customerName === null ? '' : data.customerName
          this.customerData.source = data.source === null ? '' : data.source
          this.customerData.idNumber = data.idNumber === null ? '' : repalceString(data.idNumber, 11, 4, '*')
          this.customerData.mobile = data.mobile === null ? '' : repalceString(data.mobile, 4, 4, '*')
          this.detailVisible = true
        } else {
          this.$message(response.data.message)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    /** 获取订单信息 */
    getOrderInfo(row) {
      queryOrder({ 'taskId': row.contactTaskId, 'staffId': '', 'customerId': row.customerId }).then(response => {
        if (response.data.code === 0) {
          var data = response.data.data
          if (data.length <= 0) {
            this.orderHide = false
          } else {
            this.orderData = data
            this.orderHide = true
          }
        } else {
          this.$message(response.data.message)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    /** 获取评分表信息 */
    getMarks(row, type) {
      this.gradeInfo = []
      console.log(row)
      getMarksByTaskId({ 'taskId': row.qualityTaskId }).then(response => {
        if (response.data.code === 0) {
          var data = response.data.data
          if (data.length <= 0) {
            this.gradeHide = false
          } else {
            this.gradeHide = true
            for (var i = 0; i < data.length; i++) {
              getGradeByGradeId({ 'gradeId': data[i].gradeId }).then(res => {
                if (res.data.code === 0) {
                  var data = res.data.data
                  this.gradeInfo.push(data)
                  this.activeName = this.gradeInfo[0].gradeId
                  if (type === 1) { // 说明是修改，要回显内容
                    this.getQuailtyRecord(row)
                  }
                } else {
                  this.$message(response.data.message)
                }
              }).catch(error => {
                console.log(error)
              })
            }
          }
        } else {
          this.$message(response.data.message)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    handleClickDetail(row) {
      this.row = row
      // this.detailVisible = true
      this.editUrlData = {
        id: row.id
      }
      this.totalAmountMap = new Map()
      this.totalAmount = new Map()
      this.getContactRecord(row)
      this.getCustomerInfo(row)
      this.getOrderInfo(row)
      this.getMarks(row, 1)
    },
    cleanInfo() {
      this.gradeInfo = []
      this.totalAmountMap = new Map()
      this.totalAmount = new Map()
      this.totalCheckMap = new Map()
      this.totalCheck = new Map()
    },
    // 表格多选框
    // handleSelectionChange(val) {
    //   this.batchDelReq.customerIds.length = 0
    //   for (var i = 0; i < val.length; i++) {
    //     this.batchDelReq.customerIds.push(val[i].customerId)
    //   }
    // },
    // 页面显示条数
    handleSizeChange(val) {
      this.req2.pageSize = val
      this.req.pageSize = val
      this.req2.pageNo = 1
      this.req.pageNo = 1
      this.pageInfo.pageNo = 1
      this.findQualityResultByInfo(this.req2)
    },
    // 分页翻页功能
    handleCurrentChange(val) {
      this.req2.pageNo = val
      this.findQualityResultByInfo(this.req2)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.el-table thead {
  color: #000 !important;
}
.min .el-form-item__content{
  width:70px;
}
.max .el-form-item__content{
  width:70px;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>

.el-table {
  border: 1px solid #ecebe9;
  thead th .cell {
    color: #000;
  }
}
.el-form-item {
  margin-bottom: 20px;
}
// el-dialog .el-form-item{
//   margin-bottom:50px;
// }
</style>
