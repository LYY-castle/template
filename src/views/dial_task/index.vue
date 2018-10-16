<template>
<div class='container'>
  <!-- 拨打任务列表div层 -->
  <div  v-if="isDialTask===true">
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
            <el-form-item label="操作时间：">
                <el-date-picker
                    v-model="req.modifyTimeStart"
                    type="datetime"
                    placeholder="开始时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    default-time="00:00:00">
                </el-date-picker>
                到
                <el-date-picker
                    v-model="req.modifyTimeEnd"
                    type="datetime"
                    placeholder="结束时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    default-time="00:00:00">
                </el-date-picker>
            </el-form-item>
             <el-form-item label="任务状态：">
                <el-select v-model="req.status" placeholder="请选择">
                  <el-option
                    v-for="item in taskStatusOptions"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label">

                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="拨打次数：">
                <el-input v-model="req.contactedNum" maxlength="4" min="0" type="number"></el-input>
            </el-form-item>
            <br/>

            <el-form-item label="客户姓名：">
                <el-input v-model="req.customerName" placeholder="客户姓名（限长50字符）" maxlength="50"></el-input>
            </el-form-item>&nbsp;&nbsp;&nbsp;&nbsp;
            <el-form-item label="客户电话：">
                <el-input v-model="req.customerPhone" placeholder="客户电话（限长50字符）" maxlength="50"></el-input>
            </el-form-item>

            <el-form-item label="话后小结：">
                <el-select v-model="req.summaryId">
                  <el-option
                    v-for="item in summariesInfo"
                    :key="item.id"
                    :value="item.id"
                    :label="item.name">

                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="活动：">
                <el-select v-model="req.campaignId">
                  <el-option
                    v-for="item in campaignsInfo"
                    :key="item.campaignId"
                    :value="item.campaignId"
                    :label="item.campaignName">

                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="req.pageNo=1;searchByKeyWords(req)">查询</el-button>
                <el-button type="danger" @click="clearForm(req)">重置</el-button>
            </el-form-item>
          </el-form>
      </el-row>

      <!-- <template>
      <el-row>
          <el-tabs @tab-click="handleClick" v-model="activeName" type="card">
            <el-tab-pane name='firstDial' label='首拨名单'></el-tab-pane>
            <el-tab-pane name='orderDial' label='预约名单'></el-tab-pane>
          </el-tabs>
      </el-row>
      </template> -->

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
              <div>{{scope.$index+(req.pageNo-1)*req.pageSize+1}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="客户姓名"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{scope.row.customerName}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="客户电话"
            :show-overflow-tooltip="true">
            <template
              slot-scope="scope">
              {{hideMobile(scope.row.customerPhone)}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="地区"
            prop="customerAddress"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            align="center"
            label="所属活动"
            :show-overflow-tooltip="true">
            <template
              slot-scope="scope">
              {{showCampaign(scope.row.campaignId)}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="任务状态">
            <template
              slot-scope="scope">
              <div>{{getTaskStatus(scope.row.status)}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="拨打次数"
            prop="contactedNum">
          </el-table-column>
          <el-table-column
            align="center"
            label="话后小结">
            <template
              slot-scope="scope">
              <div>{{getSummariesDetail(scope.row.summaries)}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="distributeTime"
            label="分配时间"
            width="155">
          </el-table-column>
          <el-table-column
            align="center"
            label="预约时间"
            width="155">
            <template
              slot-scope="scope">
              <div>{{hasAppointTime(scope.row.appointTime)}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="最后联系时间"
            width="155">
            <template slot-scope="scope">
              <div>{{hasLastContactTime(scope.row.lastContactTime)}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作时间"
            width="155">
            <template slot-scope="scope">
              <div>{{hasLastContactTime(scope.row.modifyTime)}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="description"
            label="描述">
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            :show-overflow-tooltip="true"
            width="100">
          <template slot-scope="scope">
            <a href="#" v-if="showStatus(scope.row.status) && checkBlacklist(scope.row.isBlacklist) && checkNodisturb(scope.row.isNodisturb)" @click="changeToCustomerDetail(scope.row.taskId,scope.row.campaignId,scope.row.customerId,scope.row.isBlacklist,scope.row.customerPhone);" size="small" type="text">
              <img src="../../../static/images/my_imgs/img_dial.png" alt="拨打"/>拨打</a>
            <el-tooltip v-else-if="!showStatus(scope.row.status)" class="item" effect="dark"  content="该状态不能拨打" placement="left-start">
              <div><img src="../../../static/images/my_imgs/img_dial_disabled.png" alt="拨打" style="cursor:default"/><span style="cursor:default">拨打</span></div>
            </el-tooltip>
            <el-tooltip v-else-if="!checkBlacklist(scope.row.isBlacklist)" class="item" effect="dark"  content="该号码为免访客户" placement="left-start">
              <div><img src="../../../static/images/my_imgs/img_dial_disabled.png" alt="拨打" style="cursor:default"/><span style="cursor:default">拨打</span></div>
            </el-tooltip>
            <el-tooltip v-else-if="!checkNodisturb(scope.row.isNodisturb)" class="item" effect="dark"  content="该号码处于免访号段中" placement="left-start">
              <div><img src="../../../static/images/my_imgs/img_dial_disabled.png" alt="拨打" style="cursor:default"/><span style="cursor:default">拨打</span></div>
            </el-tooltip>
          </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row style="margin-top:5px;">
      <el-form :inline="true" size="small">
        <el-form-item>
          <el-button type="primary" @click="quickDialto();">快速拨打</el-button>
        </el-form-item>
      </el-form>
        <el-pagination
          v-if="pageShow"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page='pageInfo.pageNo'
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size='pageInfo.pageSize'
          layout="total, sizes, prev, pager, next, jumper "
          :total='pageInfo.totalCount' style="text-align: right;float:right;">
        </el-pagination>
    </el-row>
  </div>

  <!-- 客户详情 div层 -->
  <div v-else>
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
          <img v-if="!hideDialTo" src="../../../static/images/dial_normal.png" alt="拨打" width="28px" height="28px" @click="dialTo(taskId,campaignId,isBlacklist,customerPhone)" style="cursor:pointer">
          <img v-if="hideDialTo" src="../../../static/images/dial_disable.png" alt="拨打" width="28px" height="28px"  style="cursor:default">
        </div>
      </el-col>
      <el-col :span="3"></el-col>
      <el-col :span="8" v-if="!isRecruit">
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
      <el-col :span="8" v-if="isRecruit">
        <br/>
       <div>
         <label>性别：</label><span v-text="showSex(customerInfo.sex)"></span>
       </div><br/>
       <div>
         <label>来源：</label><span v-text="customerInfo.source"></span>
       </div><br/>
       <div>
         <label>备注：</label><span v-text="customerInfo.comment"></span>
       </div>
      </el-col>
      <el-col :span="8" v-if="!isRecruit">
        <br/>
        <div>
         <label>身份证：</label><span v-text="customerInfo.idNumber"></span>
       </div><br/>
       <div>
         <label>持卡类型：</label><span v-text="customerInfo.bankCardType"></span>
       </div>
      </el-col>
      <el-col :span="8" v-if="isRecruit">
        <br/>
        <div>
         <label>身份证：</label><span v-text="customerInfo.idNumber"></span>
       </div><br/>
       <div>
         <label>地址：</label><span v-text="customerInfo.resideAddress"></span>
       </div>
      </el-col>
    </el-row>
    <br/><br/>
    <el-row>
      <el-collapse v-model="activeNames">
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
        <el-collapse-item name="2" v-if="hasProductInfo===true && !isRecruit">
          <template slot="title">
            <b>产品信息<i class="el-icon-d-caret"></i></b>
          </template>
          <div>
            <el-tabs v-model="activeTab" type="border-card" @tab-click="">
              <!--
                v-if="this.productInfo.some(i => i=== this.car_insurance)"
                v-if="this.productInfo.some(i => i === this.child_insurance)"
                v-if="this.productInfo.some(i => i=== this.disease_insurance)"
                -->
              <el-tab-pane 
               v-for="(item,index) in products" 
               :key="item.templateId"
               :label="item.productName">
                <div class="text item" hidden>模板类型id：<font style="color:blue;size:14px;font-weight:bold">{{item.productTypeInfo===null?'':item.productTypeInfo.productTypeId}}</font></div>
                <div class="text item">模板类型：<font style="color:blue;size:14px;font-weight:bold">{{item.productTypeInfo===null?'':item.productTypeInfo.productTypeName}}</font></div>
                <div class="text item">模板编号：<font style="color:blue;size:14px;font-weight:bold">{{item.templateId}}</font></div>
                <div class="text item">模板名称：<font style="color:blue;size:14px;font-weight:bold">{{item.productName}}</font></div>
                <div class="text item">产品单价：<font style="color:red;font-weight:bold">￥&nbsp;</font><font style="color:blue;font-weight:bold">{{item.price===null?0:item.price}}</font></div>
                <div class="text item">产品概述：{{item.description}}</div>
                <div v-if="item.showMessage"><font style="color:blue">Tips:以下带</font><font style="color:red">*</font><font style="color:blue">的为必填项</font></div>
                <el-form  class="text item" >
                  <!-- <div v-for="(i,index1) in item.propertyInfos"> -->
                    <el-form-item  v-for="(i,index1) in item.propertyInfos" 
                      :label="i.propertyName + '：'" style="display:inline"   
                      :rules="{required:i.showOrInput === '1' && i.isRequired === '1', message: '此项为必填项', trigger: 'change' }">
                      <span v-if="i.showOrInput === '0' && i.templateType !== 'textarea'">{{i.propertyValue}}</span>
                      <textarea v-if="i.showOrInput === '0' && i.templateType === 'textarea'" readonly>{{i.propertyValue}}</textarea>
                      <textarea v-if="i.showOrInput === '1' && i.templateType === 'textarea'" 
                        v-model="i.propertyValue" :placeholder="'限长' + i.propertyLength + '字符'">{{i.propertyValue}}</textarea>
                      <input v-if="i.templateType === 'text' && i.showOrInput === '1'" 
                        v-model="i.propertyValue" :placeholder="'限长' + i.propertyLength + '字符'" :maxlength="i.propertyLength"  ></input>
                      <el-radio-group size="mini" v-if="i.templateType === 'radio' && i.showOrInput === '1' && i.showInLine" 
                        v-model="i.propertyValueRadio">
                        <el-radio-button v-for="a in JSON.parse(i.propertyValue)" :label="a">{{a}}</el-radio-button>
                      </el-radio-group>
                      <el-radio-group size="mini" v-if="i.templateType === 'radio' && i.showOrInput === '1' && !i.showInLine" 
                        v-model="i.propertyValueRadio">
                        <el-radio v-for="a in JSON.parse(i.propertyValue)" :label="a">{{a}}</el-radio>
                      </el-radio-group>
                      <el-checkbox-group  size="mini"  v-if="i.templateType === 'checkbox' && i.showOrInput === '1'  && i.showInLine" 
                        v-model="checks[index1]" @change="getCheckes(checks[index1],i)">
                        <el-checkbox-button   v-for="b in JSON.parse(i.propertyValue)"  :label="b" :key="b">{{b}}</el-checkbox-button>
                      </el-checkbox-group>
                      <el-checkbox-group  size="mini"  v-if="i.templateType === 'checkbox' && i.showOrInput === '1' && !i.showInLine" 
                        v-model="checks[index1]" @change="getCheckes(checks[index1],i)">
                        <el-checkbox v-for="b in JSON.parse(i.propertyValue)"  :label="b" :key="b">{{b}}</el-checkbox>
                      </el-checkbox-group>
                      <el-select   size="mini" v-model="i.propertyValueSelect" placeholder="请选择" 
                        v-if="i.templateType === 'select' && i.showOrInput === '1'">
                        <el-option
                          v-for="s in JSON.parse(i.propertyValue)"
                          :key="s"
                          :label="s"
                          :value="s">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  <!-- </div> -->
                </el-form>
                    
                <div style="width:25%;float:right">
                  <span>认购数量：</span>
                  <el-input-number v-model="item.number" @change="handleChange(item.templateId,item.price,item.number)" :min="0" :max="1000" label="认购数量" size="mini">
                      {{item.number}}
                  </el-input-number>
                </div>
              </el-tab-pane>
            </el-tabs>
            <div style="width:50%;float:left">
              <label>客户留言:</label><el-input placeholder="有特别要求请注明，限100字符" maxlength="100" style="width:80%" v-model="customerNote"></el-input>
            </div>
            <div style="width:50%;float:right">
              <label>选购清单：</label>
              <el-card shadow="hover" v-for="(item,index) in products">
                  <div style="margin-left:5%;color:blue;font-weight:700;font-size:14px">{{item.productName}}</div>
                  <div style="color:blue;font-weight:bold;text-align:right">
                    {{(typeof item.price==='undefined'||item.price===null)?0:item.price}}
                    <span style="color:red;font-weight:bold;margin:0 3%">*</span>
                    <el-input-number v-model="item.number" @change="handleChange(item.templateId,item.price,item.number)" :min="0" :max="1000" label="预购数量" size="mini">
                      {{item.number}}
                    </el-input-number>
                    <span style="color:black;margin:0 2%">=</span>
                    <span v-model="item.sum">{{item.price * item.number ? (item.price * item.number).toFixed(2) : 0 }}</span>
                  </div>
              </el-card>
              <div style="color:blue;font-weight:bold;text-align:left;width:20%;float:right">
                <label>总价：</label><font style="color:red;font-weight:bold">￥ {{sumTotal}}&nbsp;</font>
              </div>
            </div>
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
                <el-radio v-model="radio" label="2" name="2" border @change="setSendMessage(radio)"><span style="color:#67C23A">成功</span></el-radio>
                <el-radio v-model="radio" label="3" name="3" border @change="setSendMessage(radio)"><span style="color:#F56C6C">失败</span></el-radio>
                <el-radio v-model="radio" label="1" name="1" border @change="setSendMessage(radio)" v-show="isLastContactTime===false"><span style="color:#409EFF">预约</span></el-radio>
              </el-col>
              <el-col :span="8" v-show="this.radio === '1'">
                <span style="color:#F56C6C">*</span>请选择预约时间：
                <span><b>T + </b></span>
                <el-input style="width:100px" type="text" v-model="addDays"
                onkeyup="if(! /^d+$/.test(this.addDays)){this.addDays='';}"></el-input>
                <el-date-picker
                  v-model="appointTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  default-time="00:00:00"
                  type="datetime" style="width:55%">
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
        <el-checkbox v-if="showSendMessage === true && campaignType !== 'RECRUIT'" v-model="sendMessage" checked="checked">发送支付短信</el-checkbox>
        <a href="#" @click="generateRecord()"><el-button type="success" size="small" >完成</el-button></a>
        <el-button type="primary" size="small" @click="returnList()" >返回列表</el-button>
      </div>
    </el-row>
  </div>
</div>
</template>

<style lang='scss' scoped>
</style>

<script>
import cti from '@/utils/ctijs' //
import { getPhoneOwn } from '@/api/navbar'
import { formatDateTime } from '@/utils/tools' // 格式化时间
import {
  queryByKeywords,
  isInNodisturbPhones,
  // showDetailInfosByTaskId,
  queryCustomerInfo,
  queryContactRecord,
  hasOrderInfos,
  getSummaries,
  getCampaignType,
  getStaffNameById,
  sendMessageToCustomer,
  checkDialTimes,
  queryOneTask,
  updateTaskStatus,
  updateRecordInfo,
  getSummariesByAgentId,
  findCampaignByUser,
  getProducts,
  batchCreatProduct,
  addMoreOrder
} from '@/api/dialTask' // 接口
var vm = null

export default {
  name: 'dialTask',

  data() {
    return {
      customerNote: '', // 客户留言
      sumTotal: 0, // 总价格
      sumInfo: new Map(), // 所选中的产品
      checks: {},
      products: [], // 活动下的产品
      isRecruit: false,
      addDays: '',
      summariesInfo: [], // 小结下拉选择
      campaignsInfo: [], // 活动下拉选择
      taskStatusOptions: [
        {
          // 任务状态选项框
          value: '',
          label: '所有情况'
        },
        {
          value: '0',
          label: '首拨'
        },
        {
          value: '1',
          label: '预约'
        },
        {
          value: '2',
          label: '成功'
        },
        {
          value: '3',
          label: '失败'
        },
        {
          value: '4',
          label: '过期'
        }
      ],
      interval: null,
      canContact: 1,
      hideDialTo: false, // 判断超出拨打次数限制时是否将图标置灰
      isLastContactTime: false, // 判断是否是最后一次拨打次数
      isDialTask: true, // 判断是进入哪个界面  true为拨打任务  false为 拨打任务详情
      campaignType: '', // 活动类型
      taskId: '', // 任务id
      campaignId: '', // 活动id
      isBlacklist: '', // 判断是否是黑名单
      customerId: '', // 客户id
      customerPhone: '', // 客户手机号
      taskDone: null, // 判断拨打任务是否已经完成
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
      selectedProduct: {}, // 选中的需要生成的产品信息
      productDetailId: '', // 新建/生成产品详细id
      insurancePay_car: '3500', // 车险费用
      insurancePay_child: '80', // 儿童险费用
      insurancePay_ill: '2800', // 重疾险费用
      order_Params: {}, // 即将生成订单的参数
      car_insurance: 'P20180101000002', // 车险id
      child_insurance: 'P20180101000003', // 儿童险id
      disease_insurance: 'P20180101000004', // 重疾险id
      activeTab: '', // 产品展示项
      showAutoDial: false, // 是否展示自动拨打下一个
      autoDialNext: true, // 完成后自动拨打下一个
      showSendMessage: false, // 是否展示发送支付短信
      sendMessage: true, //  发送支付短信checkbox
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
        modifyTimeStart: '',
        modifyTimeEnd: '',
        customerName: '',
        customerPhone: '',
        contactStatus: '0',
        contactedNum: '',
        summaryId: '',
        campaignId: '',
        status: '0',
        pageNo: 1,
        pageSize: 10
      },
      customerInfo: {
        customerName: '',
        mobile: '',
        sex: '',
        bankCard: '',
        idNumber: '',
        resideAddress: '',
        bankCardType: '',
        comment: '',
        source: ''
      },
      idNumber: ''
    }
  },
  methods: {
    showCampaign(info) {
      for (let i = 0; i < vm.campaignsInfo.length; i++) {
        if (vm.campaignsInfo[i].campaignId === info) {
          return vm.campaignsInfo[i].campaignName
        }
      }
      return ''
    },
    getCheckes(val, i) {
      i.propertyValueCheckbox = val
    },
    showStatus(status) {
      return status === '1' || status === '0'
    },
    checkBlacklist(isBlacklist) {
      return isBlacklist === '0'
    },
    checkNodisturb(isNodisturb) {
      return isNodisturb === '0'
    },
    getSummariesDetail(obj) {
      let summaries = ''
      if (obj !== null) {
        for (let i = 0; i < obj.length; i++) {
          summaries += obj[i].name + ','
        }
        if (summaries.length > 0) {
          summaries = summaries.substring(0, summaries.length - 1)
        }
      }
      return summaries
    },
    getTaskStatus(str) {
      let status = '首拨'
      switch (str) {
        case '0':
          status = '首拨'
          break
        case '1':
          status = '预约'
          break
        case '2':
          status = '成功'
          break
        case '3':
          status = '失败'
          break
        case '4':
          status = '过期'
          break
      }
      return status
    },
    // 点击拨打图标触发事件
    dialTo(taskId, campaignId, isBlacklist, customerPhone) {
      this.hideDialTo = true
      // console.log(taskId + ',' + campaignId + ',' + isBlacklist + ',' + customerPhone)
      if (
        localStorage.getItem('reasonCode') === null ||
        localStorage.getItem('reasonCode') === '-1' ||
        localStorage.getItem('reasonCode') === '-2'
      ) {
        this.$message.error('请先登录话机！')
        return
      } else {
        this.inNodisturbPhones(customerPhone)
        if (this.flag === false && isBlacklist === '0') {
          // 非黑名单  非免访号段内的号码
          // 判断剩余拨打次数
          checkDialTimes(taskId).then(response => {
            if (response.data.code === 0) {
              if (response.data.data.canContact === '1') {
                // 说明未超过次数限制还能拨打
                if (response.data.data.lastContactTime === '1') {
                  // 说明是最后一次 将预约栏隐藏
                  this.radio = ''
                  this.isLastContactTime = true
                  queryOneTask(taskId).then(response1 => {
                    if (response1.data.code === 0) {
                      if (
                        response1.data.data.status === 2 ||
                        response1.data.data.status === 3
                      ) {
                        this.$message.error('该拨打任务已结束！')
                        return
                      } else {
                        localStorage.setItem('global_taskId', taskId)
                        this.normalDial(taskId, campaignId, customerPhone)
                      }
                    }
                  })
                } else {
                  queryOneTask(taskId).then(response1 => {
                    if (response1.data.code === 0) {
                      if (
                        response1.data.data.status === 2 ||
                        response1.data.data.status === 3
                      ) {
                        this.$message.error('该拨打任务已结束！')
                        return
                      } else {
                        localStorage.setItem('global_taskId', taskId)
                        this.normalDial(taskId, campaignId, customerPhone)
                      }
                    }
                  })
                }
              } else {
                this.hideDialTo = true
                this.canContact = 0
                // clearInterval(this.interval)
                this.$message.error('超过拨打限制次数！')
                return
              }
            }
          })
        } else {
          this.$message.error('该号码在免访号段或黑名单中！')
          return
        }
      }
    },
    // 定时监控设置能否继续拨打的状态
    editDialToStatus() {
      const reasonCode = localStorage.getItem('reasonCode')
      if (
        reasonCode === '-1' ||
        reasonCode === '-2' ||
        reasonCode === '-3' ||
        reasonCode === '-4' ||
        reasonCode === ''
      ) {
        this.hideDialTo = true
      } else if (
        (reasonCode === '0' || reasonCode === '14') &&
        this.canContact === 0
      ) {
        this.hideDialTo = true
        // clearInterval(this.interval)
      } else if (reasonCode === '-101' || reasonCode === '-100') {
        this.hideDialTo = true
      } else {
        this.hideDialTo = false
      }
    },
    // 调用cti拨打功能
    normalDial(taskId, campaignId, customerPhone) {
      this.hideDialTo = true
      // console.log('1,' + localStorage.getItem('DN'))
      // console.log('2,' + localStorage.getItem('callerDN'))
      const regex = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[01356789]|18[0-9]|19[89])\d{8}$/
      if (regex.test(customerPhone)) {
        getPhoneOwn(customerPhone).then(res => {
          if (
            localStorage.getItem('DN') !== null &&
            localStorage.getItem('DN') !== ''
          ) {
            cti.makecall(localStorage.getItem('DN'), res.data)
            setTimeout(() => {
              this.getRecordId(taskId, campaignId)
            }, 3000)
          } else {
            this.$message.error('请重新登录话机！')
            return
          }
        })
      } else {
        // console.log('dialTo:' + customerPhone)
        if (
          localStorage.getItem('DN') !== null &&
          localStorage.getItem('DN') !== ''
        ) {
          cti.makecall(localStorage.getItem('DN'), customerPhone)
          setTimeout(() => {
            this.getRecordId(taskId, campaignId)
          }, 3000)
        } else {
          this.$message.error('请重新登录话机！')
          return
        }
      }
    },
    // 获取新生成的接触记录信息
    getRecordId(taskId, campaignId) {
      queryContactRecord(taskId, campaignId).then(response => {
        if (response.data.code === 0) {
          if (response.data.data && response.data.pageInfo.totalCount !== 0) {
            this.recordId = response.data.data[0].recordId
            sessionStorage.setItem('recordId', this.recordId)
            this.contactRecord = response.data.data
          }
        }
      })
    },
    // 判断是否需要显示发送支付短信的checkbox
    setSendMessage(radio) {
      if (radio === '2') {
        this.showSendMessage = true
      } else {
        this.showSendMessage = false
        this.sendMessage = false
      }
    },
    // 改变小结数组选中状态
    sendSummaryId(data, checked, ischildSelected) {
      if (checked && data.summaryDetailInfos === null) {
        this.selectedSummarys.push(data.id)
      } else {
        if (this.selectedSummarys.some(i => i === data.id)) {
          // 移除数组中此项id
          this.selectedSummarys.splice(
            this.selectedSummarys.indexOf(data.id),
            1
          )
        }
      }
    },
    // 综合查询
    searchByKeyWords(req) {
      queryByKeywords(req)
        .then(response => {
          if (response.data.code === 0) {
            if (response.data.data) {
              this.tableData = response.data.data
              this.pageInfo = response.data.pageInfo
              this.pageShow = true
              if (!this.isDialTask) {
                // console.log(response.data.data)
                const data = response.data.data[0]
                this.changeToCustomerDetail(
                  data.taskId,
                  data.campaignId,
                  data.customerId,
                  data.isBlacklist,
                  data.customerPhone
                )
              }
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
        summaryNames = summaryNames.substr(0, summaryNames.length - 1)
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
    // 页面显示条数
    handleSizeChange(val) {
      this.req.pageSize = val
      this.req.pageNo = 1
      this.pageInfo.pageNo = 1
      this.searchByKeyWords(this.req)
    },
    // 分页翻页功能
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.req.pageNo = val
      this.searchByKeyWords(this.req)
    },

    // 清空重置
    clearForm(obj, formName) {
      this.req.distributeTimeStart = ''
      this.req.distributeTimeEnd = ''
      this.req.appointTimeStart = ''
      this.req.appointTimeEnd = ''
      this.req.modifyTimeStart = ''
      this.req.modifyTimeEnd = ''
      this.req.customerName = ''
      this.req.customerPhone = ''
      this.req.pageNo = this.pageInfo.pageNo
      this.req.pageSize = this.pageInfo.pageSize
      this.req.status = ''
      this.req.contactedNum = ''
      this.req.summaryId = ''
      this.req.campaignId = ''
      // if (this.activeName === 'firstDial') {
      //   this.req.contactStatus = '0'
      //   this.req.status = '0'
      // } else {
      //   this.req.contactStatus = ''
      //   this.req.status = '1'
      // }
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
        if (
          (val[i].status === '0' || val[i].status === '1') &&
          val[i].isBlacklist !== '1' &&
          val[i].isNodisturb !== '1'
        ) {
          this.taskIds.push(val[i].taskId)
          this.campaignIds.push(val[i].campaignId)
          this.isBlacklists.push(val[i].isBlacklist)
          this.customerIds.push(val[i].customerId)
        }
      }
    },
    // 跳转拨打页面
    changeToCustomerDetail(taskId, campaignId, customerId, isBlacklist, customerPhone) {
      this.$store.dispatch('setDetail', [taskId, campaignId, customerId, isBlacklist, customerPhone])
      this.customerPhone = customerPhone
      // 调用方法判断是否在免访号段内
      this.inNodisturbPhones(customerPhone)
      if (this.flag === false && isBlacklist === '0') {
        // window.localStorage.removeItem('taskIds')
        // localStorage.setItem('taskId', taskId)
        // localStorage.setItem('campaignId', campaignId)
        this.taskId = taskId
        this.campaignId = campaignId
        this.isBlacklist = isBlacklist
        this.customerId = customerId
        this.showAutoDial = false
        this.activeNames = ['1', '2', '3', '4']
        this.autoDialNext = false
        this.showSendMessage = false
        this.hideDialTo = false
        this.isLastContactTime = false
        this.radio = ''
        // this.recordId = ''
        this.activeTab = ''
        this.canContact = 1
        this.addDays = ''
        this.summary_description = ''
        this.appointTime = ''
        this.selectedSummarys = []
        this.showDetailInfos(taskId, campaignId, customerId, isBlacklist, customerPhone)
        this.isDialTask = false
        sessionStorage.setItem('isDialTask', this.isDialTask)
      } else {
        this.$message.error('该客户在黑名单或免访号段中,无法拨打!')
        this.returnList()
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
        this.$message.error('您还未选中任务，或选中的任务未包含可拨打客户')
      } else {
        sessionStorage.setItem('quickDialto', true)
        // this.$message('跳转到拨打详情页')
        // console.log('linn:' + this.taskIds[0])
        // console.log('linn:' + this.campaignIds[0])
        // console.log('linn:' + this.isBlacklists[0])
        // console.log('linn:' + this.customerIds[0])
        this.taskId = this.taskIds[0]
        this.campaignId = this.campaignIds[0]
        this.isBlacklist = this.isBlacklists[0]
        this.customerId = this.customerIds[0]
        this.$store.dispatch('setDetails', [this.taskIds, this.campaignIds, this.isBlacklists, this.customerIds])
        this.canContact = 1
        this.addDays = ''
        this.showDetailInfos(
          this.taskIds[0],
          this.campaignIds[0],
          this.customerIds[0],
          this.isBlacklists[0],
          null
        )
        if (this.taskIds.length > 1) {
          this.showAutoDial = true
        }
        this.activeTab = ''
        this.activeNames = ['1', '2', '3', '4']
        this.autoDialNext = false
        this.showSendMessage = false
        this.isLastContactTime = false
        this.radio = ''
        this.recordId = ''
        this.summary_description = ''
        this.appointTime = ''
        this.selectedSummarys = []
        this.hideDialTo = false
        this.isDialTask = false
        sessionStorage.setItem('isDialTask', this.isDialTask)
      }
    },
    // 展示拨打页面详情
    showDetailInfos(
      taskId,
      campaignId,
      customerId,
      isBlacklist,
      customerPhone
    ) {
      // 判断活动类型
      getCampaignType(campaignId).then(res1 => {
        if (res1.data.code === 0) {
          this.campaignType = res1.data.data.campaignTypeInfo.code
          if (this.campaignType === 'RECRUIT') {
            this.isRecruit = true
          } else {
            this.isRecruit = false
          }
        }
      })
      // 获取客户基本信息
      queryCustomerInfo(customerId).then(res => {
        if (res.data.code === 0) {
          this.customerInfo = res.data.data
          this.idNumber = res.data.data.idNumber
          this.customerPhone = res.data.data.mobile
        }
      })
      // 判断是否有接触记录信息
      queryContactRecord(taskId, campaignId).then(res2 => {
        if (res2.data.code === 0) {
          this.contactRecord = res2.data.data
        }
      })
      // 判断是否有产品信息
      hasOrderInfos(campaignId).then(res3 => {
        if (res3.data.code === 0 && res3.data.data.length > 0) {
          this.hasProductInfo = true
          this.productInfo = res3.data.data
          getProducts(res3.data.data).then(res => {
            if (res.data.code === 0 && res.data.data.length > 0) {
              this.products = res.data.data
              for (let i = 0; i < this.products.length; i++) {
                const tempValue = this.products[i].propertyInfos
                this.products[i].showMessage = false
                if (
                  typeof tempValue !== 'undefined' &&
                  tempValue !== null &&
                  tempValue.length > 0
                ) {
                  for (let j = 0; j < tempValue.length; j++) {
                    if (
                      tempValue[j].templateType === 'checkbox' &&
                      tempValue[j].showOrInput === '1'
                    ) {
                      this.$set(this.checks, j, [])
                    }
                    if (tempValue[j].templateType === 'checkbox' || tempValue[j].templateType === 'radio') {
                      const arr = JSON.parse(tempValue[j].propertyValue)
                      this.products[i].propertyInfos[j].showInLine = true
                      for (let k = 0; k < arr.length; k++) {
                        if (arr[k].length > 4) {
                          this.products[i].propertyInfos[j].showInLine = false
                          break
                        }
                      }
                    }
                    if (tempValue[j].showOrInput === '1' && tempValue[j].isRequired === '1') {
                      this.products[i].showMessage = true
                    }
                  }
                }
              }
            }
          })
        }
      })
      // 根任务id获取小结
      getSummaries(taskId).then(res4 => {
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
    handleChange(templateId, price, number) {
      this.sumInfo.set(templateId, { price: price, number: number })
      this.sumTotal = 0
      this.sumInfo.forEach((val, key) => {
        if (val !== null && typeof val.price !== 'undefined') {
          this.sumTotal += parseFloat(val.price === null ? 0 : val.price) * parseInt(val.number === null ? 0 : val.number)
        }
      })
      this.sumTotal = this.sumTotal.toFixed(2)
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
      // console.log(this.selectedSummarys)
      // console.log(this.recordId + ',' + this.taskId + ',' + this.radio + ',' + this.appointTime + ',' + this.selectedSummarys)
      // 判断 1、是否打电话 2、是否选择任务状态  3、是否勾选小结
      if (this.recordId === '') {
        this.$message.error('您还未拨打电话！')
        return false
      } else if (this.radio === '') {
        this.$message.error('未选择任务状态！')
        return false
      } else if (this.radio === '1' && this.appointTime === '') {
        this.$message.error('未选择预约时间！')
        return false
      } else if (
        this.radio === '1' &&
        this.appointTime < formatDateTime(new Date())
      ) {
        this.$message.error('预约时间不能小于当前时间！')
        return false
      } else if (this.selectedSummarys.length === 0) {
        this.$message.error('未选择小结！')
        return false
      } else {
        // 生成完整接触记录及小结
        // 判断任务状态radio  2：成功 3：失败  1：预约
        if (this.radio === '2' && this.campaignType !== 'RECRUIT') {
          if (this.sumTotal <= 0) {
            this.$message.error('未选择预购产品！')
            return false
          }
          const createInfo = {}
          createInfo.campaignId = this.campaignId // 活动id
          createInfo.taskId = this.taskId // 任务id
          createInfo.description = this.customerNote // 客户留言

          createInfo.customerId = this.customerId // 客户id
          createInfo.customerName = this.customerInfo.customerName // 客户姓名
          createInfo.customerPhone = this.customerPhone // 客户手机

          createInfo.totalAmount = this.sumTotal
          // 创建产品逻辑
          const productTempInfo = []

          let flag = true // 默认校验正确

          for (let j = 0; j < this.products.length; j++) {
            if (this.products[j].number > 0 && this.products[j].propertyInfos !== null) {
              const propertyInfos = this.products[j].propertyInfos

              for (let k = 0; k < propertyInfos.length; k++) {
                if (propertyInfos[k].isRequired === '1' && propertyInfos[k].showOrInput === '1') {
                  switch (propertyInfos[k].templateType) {
                    case 'text':
                      if (propertyInfos[k].propertyValue === '') {
                        flag = false
                        this.$message.error('预购订单还有必填项：' + propertyInfos[k].propertyName + '没有完成')
                        return
                      }
                      break
                    case 'input':
                      if (propertyInfos[k].propertyValue === '') {
                        flag = false
                        this.$message.error('预购订单还有必填项：' + propertyInfos[k].propertyName + '没有完成')
                        return
                      }
                      break
                    case 'radio':
                      if (typeof propertyInfos[k].propertyValueRadio === 'undefined' || propertyInfos[k].propertyValueRadio === '') {
                        flag = false
                        this.$message.error('预购订单还有必填项：' + propertyInfos[k].propertyName + '没有完成')
                        return
                      }
                      break
                    case 'select':
                      if (typeof propertyInfos[k].propertyValueSelect === 'undefined' || propertyInfos[k].propertyValueSelect === '') {
                        flag = false
                        this.$message.error('预购订单还有必填项：' + propertyInfos[k].propertyName + '没有完成')
                        return
                      }
                      break
                    case 'checkbox':
                      if (typeof propertyInfos[k].propertyValueCheckbox === 'undefined' || propertyInfos[k].propertyValueCheckbox === '') {
                        flag = false
                        this.$message.error('预购订单还有必填项：' + propertyInfos[k].propertyName + '没有完成')
                        return
                      }
                      break
                    case 'textarea':
                      if (propertyInfos[k].propertyValue === '') {
                        flag = false
                        this.$message.error('预购订单还有必填项：' + propertyInfos[k].propertyName + '没有完成')
                        return
                      }
                      break
                    default:
                      if (propertyInfos[k].propertyValue === '') {
                        flag = false
                        this.$message.error('预购订单还有必填项：' + propertyInfos[k].propertyName + '  没有完成')
                        return
                      }
                      break
                  }
                }
              }
            }
          }
          if (flag) {
            for (let i = 0; i < this.products.length; i++) {
              if (this.products[i].number > 0) {
                const productInfo = this.products[i]
                const result = {}
                result.description = productInfo.description
                result.price = productInfo.price
                result.number = productInfo.number
                result.productName = productInfo.productName
                result.productTypeId = productInfo.productTypeInfo.productTypeId
                result.productTypeName = productInfo.productTypeInfo.productTypeName
                result.status = productInfo.status
                // 回复选择情况
                const propertyInfos = []
                if (productInfo.propertyInfos !== null && productInfo.propertyInfos.length > 0) {
                  for (let j = 0; j < productInfo.propertyInfos.length; j++) {
                    const obj = productInfo.propertyInfos[j]
                    const propertyInfo = {}
                    propertyInfo.isRequired = obj.isRequired
                    propertyInfo.mark = obj.mark
                    propertyInfo.propertyKey = obj.propertyKey
                    propertyInfo.propertyLength = obj.propertyLength
                    propertyInfo.propertyName = obj.propertyName
                    propertyInfo.propertyType = obj.propertyType
                    switch (obj.templateType) {
                      case 'radio':
                        propertyInfo.propertyValue = obj.propertyValueRadio
                        break
                      case 'checkbox':
                        if (typeof obj.propertyValueCheckbox !== 'undefined' && obj.propertyValueCheckbox !== '') {
                          propertyInfo.propertyValue = '[' + obj.propertyValueCheckbox.join(',') + ']'
                        } else {
                          propertyInfo.propertyValue = '[]'
                        }
                        break
                      case 'select':
                        propertyInfo.propertyValue = obj.propertyValueSelect
                        break
                      default:
                        propertyInfo.propertyValue = obj.propertyValue
                        break
                    }
                    propertyInfo.showOrInput = obj.showOrInput
                    propertyInfo.sort = obj.sort
                    propertyInfo.templateType = obj.templateType
                    propertyInfos.push(propertyInfo)
                  }
                }
                result.propertyInfos = propertyInfos
                productTempInfo.push(result)
              }
            }
            // 请求后台处理创建订单
            batchCreatProduct(productTempInfo).then(res => {
              if (res.data.code === 0) {
                for (let a = 0; a < productTempInfo.length; a++) {
                  productTempInfo[a].productId = res.data.data[a]
                }
                // 拼接订单信息
                const productInfos = []
                for (let b = 0; b < productTempInfo.length; b++) {
                  const productInfo = {}
                  productInfo.productId = productTempInfo[b].productId
                  productInfo.productName = productTempInfo[b].productName
                  productInfo.productNum = productTempInfo[b].number
                  productInfo.productTypeId = productTempInfo[b].productTypeId
                  productInfo.productTypeName = productTempInfo[b].productTypeName
                  productInfos.push(productInfo)
                }
                createInfo.productInfos = productInfos
                // 生成订单逻辑
                addMoreOrder(createInfo).then(response => {
                  if (response.data.code === 0) {
                    vm.customerNote = ''
                    vm.products = []
                    vm.sumTotal = 0
                    vm.sumInfo = new Map()
                    // 成功生成订单 判断是否发送短信
                    if (this.sendMessage === true) {
                      sendMessageToCustomer(
                        response.data.data,
                        this.customerInfo.mobile
                      )
                    }
                    this.$message({
                      message: response.data.message,
                      type: 'success'
                    })
                    sessionStorage.removeItem('isDialTask')
                    sessionStorage.removeItem('recordId')
                  } else {
                    this.$message({
                      message: response.data.message,
                      type: 'error'
                    })
                    return
                  }
                })
              } else {
                this.$message.error(res.data.message)
                return
              }
            })
          } else {
            this.$message.error('订单还有未填的必填项')
            return
          }
        }
        // 选择失败、预约 或 成功但没有产品(如招聘)的情况
        // 修改任务状态
        updateTaskStatus(this.taskId, this.radio, this.appointTime).then(
          res => {
            if (res.data.code === 0) {
              // 修改小结备注
              updateRecordInfo(this.recordId, this.radio, this.selectedSummarys, this.summary_description)
                .then(res1 => {
                  if (res1.data.code === 0) {
                  // 后处理
                    if (this.autoDialNext === true) {
                      //  勾选了自动拨打下一个
                      console.log('before shift:' + this.taskIds[0] + ',' + this.campaignIds[0] + ',' + this.customerIds[0] + ',' + this.isBlacklists[0])
                      this.taskIds.shift()
                      this.campaignIds.shift()
                      this.customerIds.shift()
                      this.isBlacklists.shift()
                      console.log('after shift:' + this.taskIds[0] + ',' + this.campaignIds[0] + ',' + this.customerIds[0] + ',' + this.isBlacklists[0])
                      this.taskId = this.taskIds[0]
                      this.campaignId = this.campaignIds[0]
                      this.customerId = this.customerIds[0]
                      this.isBlacklist = this.isBlacklists[0]
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
                      this.canContact = 1
                      this.addDays = ''
                      this.appointTime = ''
                      this.selectedSummarys = []
                      this.hideDialTo = false
                      this.isLastContactTime = false
                      this.showDetailInfos(this.taskIds[0], this.campaignIds[0], this.customerIds[0], this.isBlacklists[0], null)
                    } else {
                      // 没勾选自动拨打下一个 返回列表
                      this.radio = ''
                      this.recordId = ''
                      this.summary_description = ''
                      this.appointTime = ''
                      this.selectedSummarys = []
                      this.canContact = 1
                      this.addDays = ''
                      this.hideDialTo = false
                      this.isLastContactTime = false
                      this.taskIds = []
                      this.campaignIds = []
                      this.customerIds = []
                      this.isBlacklists = []
                      this.showAutoDial = false
                      this.searchByKeyWords(this.req)
                      this.isDialTask = true
                      sessionStorage.removeItem('isDialTask')
                      sessionStorage.removeItem('recordId')
                    }
                  } else {
                    this.$message.error(res1.data.message)
                    this.searchByKeyWords(this.req)
                    this.isDialTask = true
                  }
                })
            } else {
              this.$message.error(res.data.message)
              return
            }
          }
        )
      }
    },
    // 返回列表
    returnList() {
      this.isDialTask = true
      sessionStorage.removeItem('isDialTask')
      sessionStorage.removeItem('quickDialto')
      this.searchByKeyWords(this.req)
    },
    getParametersFromContactRecordDail() {
      const taskId = this.$route.query.taskId
      const campaignId = this.$route.query.campaignId
      const isBlacklist = this.$route.query.isBlacklist
      const customerPhone = this.$route.query.customerPhone
      const customerId = this.$route.query.customerId
      if (taskId && campaignId && customerId && isBlacklist && customerPhone) {
        this.isDialTask = false
        // 点击拨打图标触发事件
        this.changeToCustomerDetail(taskId, campaignId, customerId, isBlacklist, customerPhone)
      } else if (sessionStorage.getItem('isDialTask')) { // 判断是否显示拨打界面
        this.taskId = this.$store.state.dialTask.taskId
        this.campaignId = this.$store.state.dialTask.campaignId
        this.customerId = this.$store.state.dialTask.customerId
        this.isBlacklist = this.$store.state.dialTask.isBlacklist
        this.customerPhone = this.$store.state.dialTask.customerPhone
        // console.log(this.$store.state.dialTask)
        this.changeToCustomerDetail(this.taskId, this.campaignId, this.customerId, this.isBlacklist, this.customerPhone)
      } else {
        this.searchByKeyWords(this.req)
        // this.returnList()
      }
    },
    handle(obj) {
      for (let i = 0; i < obj.length; i++) {
        if (obj[i].summaryDetailInfos === null) {
          var nodeObj = {}
          nodeObj.id = obj[i].id
          nodeObj.name = obj[i].name
          vm.summariesInfo.push(nodeObj)
        } else {
          vm.handle(obj[i].summaryDetailInfos)
        }
      }
    }
  },
  watch: {
    // 预约时间显示T+
    addDays: function(val, oldval) {
      if (parseInt(val)) {
        var days = parseInt(val)
        var ms = days * 86400000
        var appointTimeMs = new Date().getTime() + ms
        this.appointTime = formatDateTime(appointTimeMs)
      } else {
        this.appointTime = ''
      }
    }
  },
  created() {
    if (this.$route.query.dialstatus) { // 说明是页面跳转过来的
      if (typeof this.$route.query.isDialTask === 'undefined') { // 说明是跳查询页面
        this.req.status = this.$route.query.dialstatus
      } else { // 说明是跳拨打页面
        this.isDialTask = this.$route.query.isDialTask
        // sessionStorage.setItem('isDialTask', this.isDialTask)
        this.req.status = this.$route.query.dialstatus
      }
    }
  },
  // 模板编译/挂载之后
  mounted() {
    vm = this
    // 通话记录变量
    if (sessionStorage.getItem('recordId')) {
      this.recordId = sessionStorage.getItem('recordId')
    } else {
      this.recordId = ''
    }
    // 判断是 快速拨打 还是 拨打
    if (sessionStorage.getItem('quickDialto') && sessionStorage.getItem('isDialTask')) {
      this.taskIds = this.$store.state.dialTask.taskIds
      this.campaignIds = this.$store.state.dialTask.campaignIds
      this.customerIds = this.$store.state.dialTask.customerIds
      this.isBlacklists = this.$store.state.dialTask.isBlacklists
      this.quickDialto()
    } else {
      this.getParametersFromContactRecordDail()
    }
    getStaffNameById(localStorage.getItem('agentId'))
      .then(res => {
        if (res.data.code === 1) {
          localStorage.setItem('staffName', res.data.data[0].staffName)
        }
      })
    this.interval = setInterval(() => {
      this.editDialToStatus()
    }, 2000)
    getSummariesByAgentId(localStorage.getItem('agentId')).then(response => {
      vm.summariesInfo = [] // 清空小结节点
      if (response.data.code === 0) {
        if (response.data.data.length > 0) {
          vm.summariesInfo.push({ 'id': '', 'name': '所有小结' })
          this.handle(response.data.data)
        } else {
          vm.summariesInfo.push({ 'id': '', 'name': '所有小结' })
        }
      }
    }).catch(error => {
      console.log(error)
      vm.summariesInfo.push({ 'id': '', 'name': '所有小结' })
    })
    findCampaignByUser().then(res => {
      if (res.data.code === 0) {
        vm.campaignsInfo.push({ campaignId: '', campaignName: '所有活动' })
        if (res.data.data.length > 0) {
          for (let i = 0; i < res.data.data.length; i++) {
            vm.campaignsInfo.push({ campaignId: res.data.data[i].campaignId, campaignName: res.data.data[i].campaignName })
          }
        }
      } else {
        vm.campaignsInfo.push({ campaignId: '', campaignName: '所有活动' })
      }
    })
    // this.req = this.$store.state.dialTask.req
  },
  // 离开时清除定时器
  destroyed: function() {
    this.customerNote = ''
    this.products = []
    this.sumTotal = 0
    this.sumInfo = new Map()
    clearInterval(this.interval)
    localStorage.removeItem('global_taskId')
    // this.$store.dispatch('setReq', this.req)
  }
}
</script>

