<template>

  <div class='container' v-if="isMainPage===true">
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
        <!-- 下属是部门 -->
        <el-form-item label="员工姓名：" prop="angentId" v-if="isManager">
          <el-select placeholder=""  v-model="req.agentid">
            <el-option label="隶属人员" value=""></el-option>
            <el-option
            v-for="item in staffs"
            :label="item.staffName"
            :value="item.angentId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户姓名：">
          <el-input placeholder="客户姓名（上限50字符）" v-model="req.customerName" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="主叫：">
          <el-input placeholder="主叫号码（上限20字符）" maxlength="20" v-model="req.caller"></el-input>
        </el-form-item>
        <el-form-item label="被叫：">
          <el-input placeholder="被叫号码(上限20字符)" maxlength="20" v-model="req.callee"></el-input>
        </el-form-item><br/>
        <el-form-item label="联系时间：">
          <el-date-picker
              v-model="req.startTime"
              type="datetime"
              placeholder="开始时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="00:00:00">
          </el-date-picker>
          到
          <el-date-picker
              v-model="req.endTime"
              type="datetime"
              placeholder="结束时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="00:00:00">
          </el-date-picker>
          <el-form-item label="通话时长：">
            <el-input v-model="req.stime" style="width:80px" @change="checkNo(req.stime)" onkeypress="return event.keyCode>=48&&event.keyCode<=57" :maxlength="3"></el-input>
            至
            <el-input v-model="req.etime" style="width:80px" @change="checkNo(req.stime)" onkeypress="return event.keyCode>=48&&event.keyCode<=57" :maxlength="3"></el-input>分钟
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
              <el-button type="text" @click="transferParameters(scope.row.taskId, scope.row.campaignId,scope.row.customerId,scope.row.customerPhone)" size="medium">{{scope.row.customerName}}</el-button>
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
          <el-table-column align="center" label="员工姓名">
            <template slot-scope="scope">
                <div>{{scope.row.staffName}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="最近联系时间">
            <template slot-scope="scope">
                <div>{{scope.row.hangUpTime}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="预约时间">
            <template slot-scope="scope">
              <div>{{showAppointTime(scope.row.appointTime)}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="主叫">
            <template slot-scope="scope">
                <div>{{scope.row.callerNumber}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="被叫">
              <template slot-scope="scope">
                <div>{{hideMobile(scope.row.calleeNumber)}}</div>
              </template>
          </el-table-column>
          <el-table-column align="center" label="通话时长">
             <template slot-scope="scope">
                <div>{{scope.row.talkTime}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="isMainPage=false;detailInfo.recordInfo=[],detailInfo.orderInfo=[];ids.campaignId=scope.row.campaignId;ids.recordId=scope.row.recordId;ids.taskId=scope.row.taskId;ids.agentId=scope.row.staffId;ids.customerId=scope.row.customerId;contactDetail()" size="medium">详情</el-button>
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
  <!-- 详情 -->
  <div class='container' v-else>
    <div class="el-icon-info">接触记录详情</div>
    <el-row :gutter="0">
        <el-form  :model="detailInfo" ref="contactDetailForm" label-width="100px">
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <el-form-item label="接触编号：" prop="contactInfo.recordId">
                <span>{{detailInfo.contactInfo.recordId}}</span>
              </el-form-item>
              <el-form-item  label="通话时长：" prop="contactInfo.talkTime">
                <span>{{formatSeconds(detailInfo.contactInfo.talkTime)}}</span>
              </el-form-item>
              <el-form-item  label="小结备注：" prop="contactInfo.description" size="small">
                <el-input type="textarea" v-model="detailInfo.contactInfo.description"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <el-form-item  label="员工姓名：">
                <span>{{detailInfo.staffInfo.staffName}}</span>
              </el-form-item>
               <el-form-item  label="员工工号：" prop="contactInfo.staffId">
                <span>{{detailInfo.contactInfo.staffId}}</span>
              </el-form-item>
              
                <el-form-item  label="话后小结：">
                  <el-tree
                    ref = "tree"
                    :data="detailInfo.summariesInfo"
                    show-checkbox
                    node-key="id"
                    default-expand-all
                    :props="defaultProps">
                  </el-tree>
               </el-form-item>
            </div>
          </el-col>
          <!-- <el-col :span="3">
            <div class="grid-content bg-purple">
              <el-form-item  label="员工工号：" prop="contactInfo.staffId">
                <span>{{detailInfo.contactInfo.staffId}}</span>
              </el-form-item>
              <el-form-item  label="身份证：" prop="customerInfo.idNumber">
                <span>{{hideIdNumber(detailInfo.customerInfo.idNumber)}}</span>
              </el-form-item>
            </div>
          </el-col> -->
          <el-col :span="4">
             <el-form-item  label="主叫：" prop="contactInfo.callerNumber">
                <span>{{detailInfo.contactInfo.callerNumber}}</span>
              </el-form-item>
              <el-form-item   label="被叫：" prop="contactInfo.calleeNumber">
                  <span>{{hideMobile(detailInfo.contactInfo.calleeNumber)}}</span>
              </el-form-item>
              <el-form-item  label="客户姓名：" prop="contactInfo.customerName" size="small">
                <span>{{detailInfo.contactInfo.customerName}}</span>
              </el-form-item>
          </el-col>
          <el-col :span="5">
            <div class="grid-content bg-purple">
              <el-form-item label="拨打时间：" prop="contactInfo.callTime">
                <span>{{detailInfo.contactInfo.callTime}}</span>
              </el-form-item>
              <el-form-item  label="接听时间：" prop="contactInfo.answerTime">
                <span>{{(detailInfo.contactInfo.answerTime)== null?'无':(detailInfo.contactInfo.answerTime)}}</span>
              </el-form-item>
               <el-form-item  label="身份证：" prop="customerInfo.idNumber">
                <span>{{hideIdNumber(detailInfo.customerInfo.idNumber)}}</span>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item  label="电话录音：" prop="contactInfo.soundRecordUrl">
                <audio v-bind:src="detailInfo.contactInfo.soundRecordUrl" controls="controls"></audio>
              </el-form-item>
               <el-form-item  label="任务状态：" prop="dialTaskInfo.status" size="small">
                <el-radio-group v-model="detailInfo.dialTaskInfo.status">
                  <el-radio  label="2">成功</el-radio>
                  <el-radio  label="3">失败</el-radio>
                  <el-radio  label="1">预约</el-radio>
               </el-radio-group>
              </el-form-item>
              <el-form-item  label="预约时间：" prop="dialTaskInfo.appointTime"  v-if="detailInfo.dialTaskInfo.status=='1'"  size="small">
                <el-date-picker
                  v-model="detailInfo.dialTaskInfo.appointTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  default-time="00:00:00"
                  placeholder="选择日期时间"  size="small">
                 </el-date-picker>
              </el-form-item>
            </div>
          </el-col>
      </el-form> 
    </el-row>
    <div slot="footer" style="text-align: right;">
          <el-button type="danger" @click="resetDetai();contactDetail()">重 置</el-button>
          <el-button @click="isMainPage = true">取 消</el-button>
          <el-button type="primary" @click="checkEdit()">修改</el-button>
    </div>
  <div class="el-icon-info">相关接触记录列表</div>
  <el-row>
      <el-col>
        <el-table :data="detailInfo.recordInfo" border>
          <el-table-column align="center" label="序号" width="55">
            <template slot-scope="item">
                <div>{{item.$index+1}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="记录编号">
            <template slot-scope="item">
              <el-button type="text" @click="ids.recordId=item.row.recordId;resetDetai();contactDetail()" size="medium">{{item.row.recordId}}</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="拨打时间" prop="callTime">
            <template slot-scope="item">
              <div>{{item.row.callTime}}</div>
            </template>
          </el-table-column> 
          <el-table-column align="center" label="接听时间">
             <template slot-scope="item">
                <div>{{item.row.answerTime==null?'无':item.row.answerTime}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="通话时长" prop="talkTime">
            <template slot-scope="item">
                <div>{{item.row.talkTime}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="呼叫方向">
            <template slot-scope="item">
                <div>{{item.row.callDirection=='1' ? '呼入':'呼出'}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="主叫号码">
            <template slot-scope="item">
                <div>{{item.row.callDirection=='1'?hideMobile(item.row.callerNumber):item.row.callerNumber}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="被叫号码">
            <template slot-scope="item">
                <div>{{item.row.callDirection==1?item.row.calleeNumber:hideMobile(item.row.calleeNumber)}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="话后小结" >
            <template slot-scope="item">
              <div>{{showSummaryInfo(item.row.summaryDetailInfos)}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="小结备注">
            <template slot-scope="item">
              <div>{{item.row.description==null||item.row.description==''?'无':item.row.description}}</div>
            </template>
          </el-table-column> 
        </el-table>
      </el-col>
    </el-row>
  <div class="el-icon-info">订单信息</div>
    <el-row>
      <el-col>
        <el-table :data="detailInfo.orderInfo" border>
          <el-table-column align="center" label="序号" width="55">
            <template slot-scope="scope">
                <div>{{scope.$index+1}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="订单编号">
            <template slot-scope="scope">
              <el-button type="text" @click="detailVisible=true;orderId=scope.row.orderId;quertOrderDetail()" size="medium">{{scope.row.orderId}}</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="产品名称" prop="productName">
          </el-table-column>
          <el-table-column align="center" label="创建时间" prop="createTime">
          </el-table-column>
          <el-table-column align="center" label="订单状态" >
            <template slot-scope="scope">
              <div>{{scope.row.status == 0 ? "未完成": "已完成"}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="订单金额" prop="totalAmount">
          </el-table-column>
          <el-table-column align="center" label="订单描述" prop="description">
            <template slot-scope="scope">
              <div>{{scope.row.description==null||scope.row.description==''?'无':scope.row.description}}</div>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!-- 订单详情 -->
      <el-dialog
      align:left
      width="40%"
      title="订单详情"
      :visible.sync="detailVisible"
      append-to-body>
      <el-form  :model="orderDetailInfo" ref="orderDetailForm" label-width="120px">
        <el-form-item label="客户姓名：" prop="customerName">
          <div>{{orderDetailInfo.customerName}}</div>
        </el-form-item>
        <el-form-item label="联系电话：" prop="customerPhone">
          <span>{{hideMobile(orderDetailInfo.customerPhone)}}</span>
        </el-form-item>
        <el-form-item label="订单编号：" prop="orderId">
          <span>{{orderDetailInfo.orderId}}</span>
        </el-form-item>
        <el-form-item label="创建时间：" prop="createTime">
          <span>{{orderDetailInfo.createTime}}</span>
        </el-form-item>
        <el-form-item label="订单状态：">
          <span>{{orderDetailInfo.status===0?"未完成":"已完成"}}</span>
        </el-form-item>
        <el-form-item label="支付方式：" prop="modifyTime">
          <span>{{orderDetailInfo.productId==="P20180101000001"?'赠险无需支付':(orderDetailInfo.payTypeName==null?'无':orderDetailInfo.payTypeName)}}</span>
        </el-form-item>
        <el-form-item label="选购产品：" prop="productName">
          <span>{{orderDetailInfo.productName}}</span>
        </el-form-item>
        <el-form-item label="订单总价(元)：" prop="totalAmount">
          <span>{{orderDetailInfo.totalAmount}}</span>
        </el-form-item>
        <el-form-item label="订单备注：" prop="description">
          <span>{{orderDetailInfo.description}}</span>
        </el-form-item>
      </el-form>
        <div slot="footer" style="text-align: right;">
          <el-button @click="detailVisible = false">返回</el-button>
        </div>
      </el-dialog>
</div>
</template>

<style lang='scss' scoped>
</style>

<script>
  import { formatDateTime, checkNo, hideIdNumber, hideMobile, formatSeconds } from '@/utils/tools' // 格式化时间
  import {
    getDepartId,
    getAllCamps,
    queryByKeyWords,
    isHaveManager,
    isHaveStaff,
    getAllStaffByDepartId,
    getSummariesByTaskId,
    getContactByGradeId,
    queryrecordbytaskid,
    getStaffNameByAgentId,
    queryTaskByTaskId,
    queryOrderByTaskId,
    querycustomerbyid,
    updateTaskStatus,
    generateRecord,
    quertOrderDetail
  } from '@/api/contact_record_dail' // api接口引用

  export default {
    name: 'contact_record_dail',

    data() {
      return {
        detailVisible: false, // 订单详情展示开关
        isMainPage: true, // 显示或隐藏详情页面
        requestFail: false, // 请求失败
        orderId: '', // 订单Id
        orderDetailInfo: {}, // 订单详情
        originalStatus: '',
        defaultProps: {
          children: 'summaryDetailInfos',
          label: 'name'
        },
        detailInfo: {
          summariesInfo: [],
          contactInfo: {},
          recordInfo: [],
          staffInfo: {},
          customerInfo: {},
          orderInfo: [],
          dialTaskInfo: {}
        },
        ids: {
          campaignId: '',
          recordId: '',
          taskId: '',
          agentId: '',
          customerId: ''
        },
        isForbidden: {
          forbiddenManager: false, // 没有主管权限
          forbiddenStaff: false// 没有员工权限
        }, // 判断是否能操作页面
        isManager: false, // 是主管
        isStaff: false, // 普通员工
        staffInfo: {
          agentid: '',
          departId: ''
        },
        tableData: [], // 表格数据
        pageShow: false, // 分页显示与否
        pageInfo: {}, // 分页信息
        campaigns: [], // 所有活动 (名称+id)
        staffs: [], // 所有员工
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
          departId: '',
          agentid: '',
          pageSize: 10,
          pageNo: 1

        }
      }
    },

    mounted() {
      // this.getDepartIdByStaff()
      // 获得部门id
      getDepartId()
        .then(response => {
          this.staffInfo.agentid = response.data.agentid
          this.staffInfo.departId = response.data.departId
          new Promise((resolve, reject) => {
            getAllStaffByDepartId(this.staffInfo.departId).then(response => {
              this.staffs = response.data.data
              resolve()
            })
          })
          localStorage.setItem('departId', response.data.departId)
          this.$forceUpdate()
        })
        .catch(error => {
          console.log(error)
        })
  
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
        .catch(error => {
          console.log(error)
        })
    },

    methods: {
      // 跳转到别的组件
      transferParameters(taskId, campaignId, customerId, customerPhone) {
        queryTaskByTaskId(taskId).then(response => {
          if (response.data.code === 0) {
            const isBlacklist = response.data.data.isBlacklist
            this.$router.push({
              name: 'dial_task.html',
              query: {// 通过query 传递参数
                taskId: taskId, campaignId: campaignId, customerId: customerId, isBlacklist: isBlacklist, customerPhone: customerPhone
              }
            })
          }
        }).catch(error => {
          console.log(error)
        })
      },
      async isHavePermissions() {
        // 判断主管
        await isHaveManager(this.staffInfo.agentid).then(response => {
          this.isManager = true
        }).catch(error => {
          if (error.response.status === 403) {
            this.isForbidden.forbiddenManager = true
          } else {
            this.requestFail = true
          }
        })
        // 判断员工
        await isHaveStaff(this.staffInfo.agentid).then(response => {
          this.isStaff = true
        }).catch(error => {
          if (error.response.status === 403) {
            this.isForbidden.forbiddenStaff = true
          } else {
            this.requestFail = true
          }
        })
      },
      // 详情页面加载
      contactDetail() {
        getSummariesByTaskId(this.ids.taskId).then(response => {
          if (response.data.code === 0) {
            this.detailInfo.summariesInfo = response.data.data
          }
        })
        getContactByGradeId(this.ids.recordId).then(response => {
          if (response.data.code === 0) {
            this.detailInfo.contactInfo = response.data.data
            console.log(response.data.data)
            // this.checkedSummaryKeys(response.data.data.summaryDetailInfos)
            const a = response.data.data.summaryDetailInfos.map(function(item, index) {
              if (item) {
                return item.id
              } else {
                return
              }
            })
            this.$refs.tree.setCheckedKeys(a)
          }
        })
        queryrecordbytaskid(this.ids.taskId, this.ids.campaignId).then(response => {
          var obj = response.data.data
          if (response.data.code === 0) {
            for (var i in obj) {
              if (obj[i].recordId !== this.ids.recordId) {
                this.detailInfo.recordInfo.push(obj[i])
              }
            }
          }
        })
        getStaffNameByAgentId(this.ids.agentId).then(response => {
          if (response.data.code === 1) {
            this.detailInfo.staffInfo = response.data.data[0]
          }
        })
        queryTaskByTaskId(this.ids.taskId).then(response => {
          if (response.data.code === 0) {
            this.detailInfo.dialTaskInfo = response.data.data
            this.originalStatus = response.data.data.status
          }
        })
        queryOrderByTaskId(this.ids.taskId).then(response => {
          if (response.data.code === 0) {
            this.detailInfo.orderInfo = response.data.data
          }
        })
        querycustomerbyid(this.ids.customerId).then(response => {
          if (response.data.code === 0) {
            this.detailInfo.customerInfo = response.data.data
          }
        })
      },
      checkEdit() {
        var taskId = this.ids.taskId
        var taskStatus = this.detailInfo.dialTaskInfo.status
        var appointTime = this.detailInfo.dialTaskInfo.appointTime
        var recordId = this.ids.recordId
        var nodules = this.$refs.tree.getCheckedKeys(true)
        var description = this.detailInfo.contactInfo.description
        if (Date.parse(appointTime) - Date.parse(new Date()) < 0) {
          this.$message('预约时间不能比现在早！')
          return
        }
        if (this.originalStatus == null || this.originalStatus === '') {
          this.updateStatusOrNodule(taskId, taskStatus, appointTime, recordId, nodules, description)
        } else {
          if (this.originalStatus !== taskStatus) {
            if (this.originalStatus === '2' && (taskStatus === '1' || taskStatus === '3') && this.detailInfo.orderInfo.length > 0) {
              this.$message('请您先删除订单再修改任务状态!')
              return
            }
            if (this.originalStatus === '3' && (taskStatus === '2')) {
              this.$message('非法操作!')
              return
            }
            if (this.originalStatus === '1' && (taskStatus === '2')) {
              this.$message('非法操作!')
              return
            }
            this.updateStatusOrNodule(taskId, taskStatus, appointTime, recordId, nodules, description)
          } else {
          // 修改小结 与 备注
            if (taskStatus === '1') {
              this.updateStatusOrNodule(taskId, taskStatus, appointTime, recordId, nodules, description)
            } else {
              generateRecord(recordId, nodules, description).then(response => {
                if (response.data.code === 0) {
                  this.searchByKeyWords(this.req)
                  this.isMainPage = true
                  this.$message('修改成功')
                } else {
                  this.$message(response.data.message)
                }
              })
            }
          }
        }
      },
      updateStatusOrNodule(taskId, taskStatus, appointTime, recordId, nodules, description) {
        updateTaskStatus(taskId, taskStatus, appointTime).then(response => {
          if (response.data.code === 0) {
            generateRecord(recordId, nodules, description).then(response => {
              if (response.data.code === 0) {
                this.searchByKeyWords(this.req)
                this.isMainPage = true
                this.$message('修改成功')
              } else {
                this.$message(response.data.message)
              }
            })
          } else {
            this.$message(response.data.message)
          }
        })
      },
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

      // 分页翻页功能
      handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
        this.req.pageNo = val
        this.searchByKeyWords(this.req)
      },
      // 时间戳转年月日时分秒
      formatDateTime: formatDateTime,
      checkNo: checkNo,
      formatSeconds: formatSeconds,
      hideIdNumber: hideIdNumber,
      hideMobile: hideMobile,
      // 将选择的campaignId放入数组
      selectOneCampaign(campaignId) {
        // 清空数组
        this.req.campaign = []
        this.req.campaign.push(campaignId)
      },

      // 综合查询
      async searchByKeyWords(req) {
        await this.isHavePermissions()
        if (this.isStaff || this.isManager) {
          this.req.departId = localStorage.getItem('departId')
          if (this.isStaff && this.isManager === false) {
            this.req.agentid = this.staffInfo.agentid
          }
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
        } else if (this.isForbidden.forbiddenManager && this.isForbidden.forbiddenStaff) {
          this.$message('没权限操作该页面！')
        } else {
          this.$message('系统繁忙！')
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
      // 详情小结树展示
      checkedSummaryKeys(summary) {
        if (summary.length !== 0) {
          for (var j in summary) {
            this.$set(this.checkedKeys, j, summary[j].id)
          }
        }
      },
      // 详情小结展示
      showSummaryInfo(summary) {
        var html = ''
        if (summary.length === 0) {
          html = '无'
        } else {
          for (var j in summary) {
            html += summary[j].name + ', '
          }
          if (html.indexOf(', ') > -1) {
            html = html.substring(0, html.length - 1)
          }
        }
        return html
      },
      quertOrderDetail() {
        quertOrderDetail(this.orderId).then(response => {
          if (response.data.code === 0) {
            this.orderDetailInfo = response.data.data
          }
        })
      },
      // 预约时间补无
      showAppointTime(appointTime) {
        if (appointTime) {
          return appointTime
        } else {
          return '无'
        }
      },
      resetDetai() {
        this.detailInfo.summariesInfo = []
        this.detailInfo.contactInfo = {}
        this.detailInfo.recordInfo = []
        this.detailInfo.staffInfo = {}
        this.detailInfo.customerInfo = {}
        this.detailInfo.orderInfo = []
        this.detailInfo.dialTaskInfo = {}
      },
      // 清空重置
      clearForm(obj, formName) {
        for (const key in obj) {
          if (key !== 'pageNo' && key !== 'pageSize') {
            obj[key] = ''
          }
        }
        if (formName) {
          this.$refs[formName].resetFields()
        }
      },
      // 克隆数据
      cloneData(obj) {
        var data = {}
        data = JSON.parse(JSON.stringify(obj))
        return data
      },
      putAllcamps() {
        this.req.campaign = []
        for (var i = 0; i < this.campaigns.length; i++) {
          this.req.campaign.push(this.campaigns[i].campaignId)
        }
      }
  
    },
    watch: {}
  
  }

</script>


