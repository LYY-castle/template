<template>
  <!-- 拨打任务列表div层 -->
  <div class='container' style="padding:0 20px;" v-if="isDialTask===true">
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
            <el-button @click="changeToCustomerDetail(scope.row.taskId,scope.row.campaignId,scope.row.customerId,scope.row.isBlacklist,scope.row.customerPhone)" size="small" type="text"><img src="../../../static/images/my_imgs/img_dial.png" alt="拨打"/>拨打</el-button>
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

  <!-- 客户详情 div层 -->
  <div class='container' style="padding:0 20px;" v-else>
    <el-row :gutter="20">
      <el-col :span="5" style="text-align:center">
        <br/>
        <div>
          <b v-text="customerInfo.customerName"></b>
        </div>
        <div>
          <span v-text="customerInfo.mobile"></span>
        </div>
        <div>
          <img src="../../../static/images/my_imgs/img_xiegang.png"  alt="横杆"/>
        </div>
        <div>
          <a><img src="../../../static/images/my_imgs/img_dial.png" alt="拨打" width="28px" height="28px"></a>
        </div>  
      </el-col>
      <el-col :span="3"></el-col>
      <el-col :span="8">
        <br/>
       <div>
         <label>性别：</label><span v-text="showSex(customerInfo.sex)"></span>
       </div><br/>
       <div>
         <label>卡号：</label><span v-text="customerInfo.bankCard"></span>
       </div><br/>
       <div>
         <label>地址：</label><span v-text="customerInfo.resideAddress"></span>
       </div>
      </el-col>
      <el-col :span="8">
        <br/>
        <div>
         <label>身份证：</label><span v-text="customerInfo.idNumber"></span>
       </div><br/>
       <div>
         <label>持卡类型：</label><span v-text="customerInfo.bankCardType"></span>
       </div>
      </el-col>
    </el-row>
    <br/><br/>
    <el-row>
      <el-collapse v-model="activeNames" @change="handleChange">
        <!-- 接触记录 -->
        <el-collapse-item name="1" >
          <template slot="title">
            <b>接触记录<i class="el-icon-d-caret"></i></b>
          </template>
          <el-table
          :data="contactRecord" 
          border>
          <el-table-column align="center" label="序号" width="55">
            <template slot-scope="scope">
              <div>{{scope.$index + 1}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="记录编号" width="170" prop="recordId">
          </el-table-column>
          <el-table-column align="center" label="拨打时间" width="170" prop="callTime">
          </el-table-column>
          <el-table-column align="center" label="接听时间" width="">
            <template slot-scope="scope">
              <div v-html="showAnswerTime(scope.row.answerTime)"></div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="通话时长" width="" prop="talkTime">
          </el-table-column>
          <el-table-column align="center" label="呼叫方向" width="">
            <template slot-scope="scope">
              <div v-html="showCallDirection(scope.row.callDirection)"></div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="主叫" width="" prop="callerNumber">
          </el-table-column>
          <el-table-column align="center" label="被叫" width="" prop="calleeNumber">
          </el-table-column>
          <el-table-column align="center" label="话后小结" width=""> 
            <template slot-scope="scope">
              <div v-html="showSummarys(scope.row.summaryDetailInfos)"></div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="小结备注" width="" >
            <template slot-scope="scope">
              <div v-html="showDescription(scope.row.description)"></div>
            </template>
          </el-table-column>
          </el-table>
        </el-collapse-item>

        <!-- 产品信息 -->
        <el-collapse-item name="2" v-if="hasProductInfo===true">
          <template slot="title">
            <b>产品信息<i class="el-icon-d-caret"></i></b>
          </template>
          <div>
            <el-tabs v-model="activeTab" type="card" @tab-click="">
              <!-- 
                v-if="this.productInfo.some(i => i=== this.car_insurance)"
                v-if="this.productInfo.some(i => i === this.child_insurance)"
                v-if="this.productInfo.some(i => i=== this.disease_insurance)"
                -->
              <el-tab-pane name="1" label="车险" v-model="car_insurance" v-if="this.productInfo.some(i => i=== this.car_insurance)">
                <div>
                  <span>投保年龄：</span>
                    <el-input placeholder="25岁" size="medium" type="text" value="25岁" style="width:80px"></el-input>&nbsp;&nbsp;
                  <span>车辆座位：</span>
                    <el-select v-model="car_insurance_seats"> 
                      <el-option value="2" label="2座">2座</el-option>
                      <el-option value="3" label="3座">3座</el-option>
                      <el-option value="4" label="4座">4座</el-option>
                    </el-select>&nbsp;&nbsp;
                  <span>保障期间：</span>
                    <el-input placeholder="1年" size="medium" type="text" value="1年" style="width:80px"></el-input>&nbsp;&nbsp;
                  <span>保费合计：</span>
                    <el-input placeholder="3500" size="medium" type="text" value="3500" style="width:80px"></el-input>元&nbsp;&nbsp;
                </div>
              </el-tab-pane>
              <el-tab-pane name="2" label="儿童险"  v-model="child_insurance" v-if="this.productInfo.some(i => i === this.child_insurance)">
                <div>
                  <span>投保年龄：</span>
                    <el-input placeholder="3岁" size="medium" type="text" value="3岁" style="width:80px"></el-input>&nbsp;&nbsp;
                  <span>方案选择：</span>
                    <el-select v-model="car_insurance_seats"> 
                      <el-option value="1" label="方案1">方案1</el-option>
                      <el-option value="2" label="方案2">方案2</el-option>
                      <el-option value="3" label="方案3">方案3</el-option>
                    </el-select>&nbsp;&nbsp;
                  <span>保障期间：</span>
                    <el-input placeholder="1年" size="medium" type="text" value="1年" style="width:80px"></el-input>&nbsp;&nbsp;
                  <span>保费合计：</span>
                    <el-input placeholder="80" size="medium" type="text" value="80" style="width:80px"></el-input>元&nbsp;&nbsp;
                </div>
              </el-tab-pane>
              <el-tab-pane name="3" label="重疾险" v-model="disease_insurance" v-if="this.productInfo.some(i => i=== this.disease_insurance)">
                <div>
                  <span>投保年龄：</span>
                    <el-input placeholder="36岁" size="medium" type="text" value="36岁" style="width:80px"></el-input>&nbsp;&nbsp;
                  <span>方案选择：</span>
                    <el-select v-model="car_insurance_seats"> 
                      <el-option value="1" label="方案1">方案1</el-option>
                      <el-option value="2" label="方案2">方案2</el-option>
                      <el-option value="3" label="方案3">方案3</el-option>
                    </el-select>&nbsp;&nbsp;
                  <span>保障期间：</span>
                    <el-input placeholder="1年" size="medium" type="text" value="1年" style="width:80px"></el-input>&nbsp;&nbsp;
                  <span>保费合计：</span>
                    <el-input placeholder="2800" size="medium" type="text" value="2800" style="width:80px"></el-input>元&nbsp;&nbsp;
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-collapse-item>

        <!-- 任务状态 -->
        <el-collapse-item name="3">
          <template slot="title">
            <b>任务状态<i class="el-icon-d-caret"></i></b>
          </template>
          <div>
            <el-row :gutter="20">
              <el-col :span="8">
                &nbsp;&nbsp;&nbsp;&nbsp;
                <el-radio v-model="radio" label="2" name="2"><span style="color:#67C23A">成功</span></el-radio>
                <el-radio v-model="radio" label="3" name="3"><span style="color:#F56C6C">失败</span></el-radio>
                <el-radio v-model="radio" label="1" name="1"><span style="color:#409EFF">预约</span></el-radio>
              </el-col>
              <el-col :span="8" v-show="this.radio === '1'">
                <span style="color:#F56C6C">*</span>请选择预约时间：
                <el-date-picker 
                  v-model="appointTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  default-time="00:00:00"
                  type="datetime">
                </el-date-picker>
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>

        <!-- 话后小结 -->
        <el-collapse-item name="4">
          <template slot="title">
            <b>小结与备注<i class="el-icon-d-caret"></i></b>
          </template>
          <div>
            <b>话后小结：</b>
            <!-- @check-change="sendSummaryId" @node-click="checkOrNot" <el-tree :data="nodulesTree" show-checkbox lazy :props="summaryTreeProps" empty-text="该拨打任务暂无小结" :load="loadNodes"></el-tree> -->
            <el-tree :data="nodulesTree" @check-change="sendSummaryId" show-checkbox default-expand-all node-key="id" ref="tree" highlight-current :props="summaryTreeProps" empty-text="该拨打任务暂无小结"></el-tree>
          </div>
          <div>
            <b>小结备注：</b>
            <el-input type="textarea" v-model="summary_description" rows="3">/</el-input>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-row><br/>

    <!-- footer 按钮 -->
    <el-row>
      <div style="text-align:center">
        <el-checkbox v-if="showAutoDial===true" checked="checked" v-model="autoDialNext">完成后显示下一个客户</el-checkbox>
        <el-button type="success" size="medium" @click="generateRecord()">完成</el-button>
        <el-button type="primary" size="medium" @click="returnList()">返回列表</el-button>
      </div>
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
  isInNodisturbPhones,
  // showDetailInfosByTaskId,
  queryCustomerInfo,
  queryContactRecord,
  hasOrderInfos,
  getSummaries
} from '@/api/dialTask' // 接口

export default {
  name: 'dialTask',

  data() {
    return {
      isDialTask: true, // 判断是进入哪个界面  true为拨打任务  false为 拨打任务详情
      activeName: 'firstDial',
      tableData: [], // 表格数据
      pageShow: true, // 是否显示分页
      pageInfo: {}, // 分页信息
      flag: false, // 免访号段的标志
      taskIds: [], // 快速拨打勾选传入taskId的数组
      campaignIds: [], // 快速拨打勾选传入campaignId的数组
      isBlacklists: [], // 快速拨打勾选传入isBlacklist的数组
      customerIds: [], // 快速拨打勾选传入customerId的数组
      activeNames: ['1', '2', '3', '4'], // 折叠板默认打开项
      contactRecord: [], // 接触记录信息
      recordId: '', // 判断是否拨打电话的接触记录id
      radio: '', // 任务状态
      appointTime: '', // 预约时间
      hasProductInfo: false, // 是否有产品的标志
      productInfo: [], // 需要展示的产品的id
      car_insurance: 'P20180101000002', // 车险id
      child_insurance: 'P20180101000003', // 儿童险id
      disease_insurance: 'P20180101000004', // 车险id
      activeTab: '', // 产品展示项
      showAutoDial: false, // 是否展示自动拨打下一个
      autoDialNext: true, // 完成后自动拨打下一个
      car_insurance_seats: '2', //
      nodulesTree: [], // 需要展示的小结树 数据
      summaryTreeProps: {
        children: 'summaryDetailInfos',
        label: 'name',
        id: 'id'
      },
      selectedSummarys: [], // 选中的小结id
      summary_description: '', // 小结备注
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
      },
      customerInfo: {
        customerName: '',
        mobile: '',
        sex: '',
        bankCard: '',
        idNumber: '',
        resideAddress: '',
        bankCardType: ''
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
    // 改变小结数组选中状态
    sendSummaryId(data, checked, ischildSelected) {
      if (checked && data.summaryDetailInfos === null) {
        this.selectedSummarys.push(data.id)
      } else {
        if (this.selectedSummarys.some(i => i === data.id)) {
          // 移除数组中此项id
          this.selectedSummarys.splice(this.selectedSummarys.indexOf(data.id), 1)
        }
      }
    },
    // checkOrNot(data, node) {
    //   if (node.checked) {
    //     node.checked = false
    //     if (this.selectedSummarys.some(i => i === data.id)) {
    //       // 移除数组中此项id
    //       this.selectedSummarys.splice(this.selectedSummarys.indexOf(data.id), 1)
    //     }
    //   } else {
    //     node.checked = true
    //     if (data.summaryDetailInfos === null) {
    //       this.selectedSummarys.push(data.id)
    //     }
    //   }
    // },
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
    // 接听时间补无
    showAnswerTime(answerTime) {
      if (answerTime) {
        return answerTime
      } else {
        return '无'
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
    // 显示小结
    showSummarys(summarys) {
      if (summarys.length === 0) {
        return '无'
      } else {
        let summaryNames = ''
        for (var i = 0; i < summarys.length; i++) {
          summaryNames += summarys[i].name + '/'
        }
        summaryNames = summaryNames.substr(0, (summaryNames.length - 1))
        return summaryNames
      }
    },
    // 小结备注补无
    showDescription(description) {
      if (description) {
        return description
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
      // for (const key in obj) {
      //   if (key !== 'pageNo') {
      //     obj[key] = ''
      //   }
      // }
      // if (formName) {
      //   this.$refs[formName].resetFields()
      // }
      this.req.distributeTimeStart = ''
      this.req.distributeTimeEnd = ''
      this.req.appointTimeStart = ''
      this.req.appointTimeEnd = ''
      this.req.customerName = ''
      this.req.customerPhone = ''
      this.req.pageNo = 1
      if (this.activeName === 'firstDial') {
        this.req.contactStatus = '0'
        this.req.status = '0'
      } else {
        this.req.contactStatus = ''
        this.req.status = '1'
      }
    },
    // 时间戳转年月日时分秒
    formatDateTime: formatDateTime,

    // 表格多选框
    handleSelectionChange(val) {
      this.taskIds.length = 0
      this.campaignIds.length = 0
      this.isBlacklists.length = 0
      this.customerIds.length = 0
      for (var i = 0; i < val.length; i++) {
        this.taskIds.push(val[i].taskId)
        this.campaignIds.push(val[i].campaignId)
        this.isBlacklists.push(val[i].isBlacklist)
        this.customerIds.push(val[i].customerId)
      }
    },
    // tab点击时触发的事件
    handleClick(tab, event) {
      if (tab.name === 'firstDial') {
        // 点击了首拨名单
        this.req.contactStatus = 0
        this.req.status = 0
        this.req.pageNo = 1
        this.searchByKeyWords(this.req)
      } else {
        // 点击了预约名单
        this.req.contactStatus = ''
        this.req.status = 1
        this.req.pageNo = 1
        this.searchByKeyWords(this.req)
      }
    },
    // 跳转拨打页面
    changeToCustomerDetail(taskId, campaignId, customerId, isBlacklist, customerPhone) {
      // 调用方法判断是否在免访号段内
      this.inNodisturbPhones(customerPhone)
      if (this.flag === false && isBlacklist === '0') {
        // window.localStorage.removeItem('taskIds')
        // window.localStorage.setItem('taskId', taskId)
        // window.localStorage.setItem('campaignId', campaignId)
        this.activeNames = ['1', '2', '3', '4']
        this.autoDialNext = false
        this.radio = ''
        this.recordId = ''
        this.summary_description = ''
        this.appointTime = ''
        this.selectedSummarys = []
        this.showDetailInfos(taskId, campaignId, customerId, isBlacklist, customerPhone)
        this.isDialTask = false
      } else {
        this.$message.error('该客户在黑名单或免访号段中,无法拨打!')
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
        this.$message('跳转到拨打详情页')
        // console.log('linn:' + this.taskIds[0])
        // console.log('linn:' + this.campaignIds[0])
        // console.log('linn:' + this.isBlacklists[0])
        // console.log('linn:' + this.customerIds[0])
        this.showDetailInfos(this.taskIds[0], this.campaignIds[0], this.customerIds[0], this.isBlacklists[0], null)
        if (this.taskIds.length > 1) {
          this.showAutoDial = true
        }
        this.activeNames = ['1', '2', '3', '4']
        this.autoDialNext = false
        this.radio = ''
        this.recordId = ''
        this.summary_description = ''
        this.appointTime = ''
        this.selectedSummarys = []
        this.isDialTask = false
      }
    },
    // 展示拨打页面详情
    showDetailInfos(taskId, campaignId, customerId, isBlacklist, customerPhone) {
      // 获取客户基本信息
      queryCustomerInfo(customerId)
        .then(res => {
          if (res.data.code === 0) {
            this.customerInfo = res.data.data
          }
        })
        // 判断是否有接触记录信息
      queryContactRecord(taskId, campaignId)
        .then(res2 => {
          if (res2.data.code === 0) {
            this.contactRecord = res2.data.data
          }
        })
        // 判断是否有订单信息
      hasOrderInfos(campaignId)
        .then(res3 => {
          if (res3.data.code === 0 && res3.data.data.length > 0) {
            this.hasProductInfo = true
            this.productInfo = res3.data.data
          }
        })
        // 根据活动id获取小结
      getSummaries(campaignId)
        .then(res4 => {
          if (res4.data.code === 0 && res4.data.data.length > 0) {
            this.nodulesTree = res4.data.data
          }
        })
    },
    showSex(sex) {
      if (sex === 0) {
        return '男'
      } else {
        return '女'
      }
    },
    handleChange(val) {
      console.log(val)
    },
    //
    showCallDirection(callDirection) {
      if (callDirection === '0') {
        return '呼出'
      } else {
        return '呼入'
      }
    },
    // 生成订单/接触记录/修改任务状态
    generateRecord() {
      // 判断 1、是否打电话 2、是否选择任务状态  3、是否勾选小结
      // To Do
      if (this.recordId === '') {
        this.$message.error('您还未拨打电话！')
        return false
      } else if (this.radio === '') {
        this.$message.error('未选择任务状态！')
        return false
      } else if (this.radio === '1' && this.appointTime === '') {
        this.$message.error('未选择预约时间！')
        return false
      } else if (this.radio === '1' && this.appointTime < formatDateTime(new Date())) {
        this.$message.error('预约时间不能小于当前时间！')
        return false
      } else if (this.selectedSummarys.length === 0) {
        this.$message.error('未选择小结！')
        return false
      } else {
        this.$message.success('成功！')
        // 发送请求修改任务状态与添加小结

        if (this.autoDialNext === true) {
          //  勾选了自动拨打下一个
          this.taskIds.shift()
          this.campaignIds.shift()
          this.customerIds.shift()
          this.isBlacklists.shift()
          // 判断展示 checkbox与否
          if (this.taskIds.length > 1) {
            this.showAutoDial = true
          } else {
            this.showAutoDial = false
            this.autoDialNext = false
          }
          this.activeNames = ['1', '2', '3', '4']
          this.radio = ''
          this.recordId = ''
          this.summary_description = ''
          this.appointTime = ''
          this.selectedSummarys = []
          this.showDetailInfos(this.taskIds[0], this.campaignIds[0], this.customerIds[0], this.isBlacklists[0], null)
        } else {
          // 没勾选自动拨打下一个 返回列表
          this.radio = ''
          this.recordId = ''
          this.summary_description = ''
          this.appointTime = ''
          this.selectedSummarys = []
          this.taskIds = []
          this.campaignIds = []
          this.customerIds = []
          this.isBlacklists = []
          this.showAutoDial = false
          this.searchByKeyWords(this.req)
          this.isDialTask = true
        }
      }
    },
    // 返回列表
    returnList() {
      this.isDialTask = true
      this.searchByKeyWords(this.req)
    }
  }
}
</script>
