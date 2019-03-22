<template>
<div class='container'>
  <!-- 隐藏的getSummariesDetail -->
  <!-- 拨打任务列表div层 -->
  <div v-if="isDialTask===true">
    <el-collapse v-model="formContainerOpen" class="form-container" @change="handleChangeAcitve">
      <el-collapse-item title="筛选条件" name="1">
        <el-form :inline="true" size="small">
          <el-form-item label="分配时间：">
              <el-date-picker
                  v-model="req.distributeTimeStart"
                  type="datetime"
                  placeholder="开始时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  default-time="00:00:00">
              </el-date-picker>
              -
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
              -
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
              -
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
          <el-form-item label="所属员工：" v-if="departPermission">
            <el-select v-model="req.staffId">
              <el-option label="所有员工" :value="agentsId"></el-option>
              <el-option
                v-for="item in agentsOptions"
                :key="item.agent_id"
                :value="item.agent_id"
                :label="item.real_name">
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
            <el-button @click="clearForm(req)">重置</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>

    <!-- <template>
    <el-row>
        <el-tabs @tab-click="handleClick" v-model="activeName" type="card">
          <el-tab-pane name='firstDial' label='首拨名单'></el-tab-pane>
          <el-tab-pane name='orderDial' label='预约名单'></el-tab-pane>
        </el-tabs>
    </el-row>
    </template> -->

    <el-row class="table-container">
      <el-row class="margin-bottom-20">
        <div class="font14 bold">拨打任务表</div>
      </el-row>
      <el-row class="margin-bottom-20">
        <el-button type="info" @click="quickDialto();">快速拨打</el-button>
      </el-row>
      <el-row>
        <el-table
          :data="tableData"
          @selection-change="handleSelectionChange">
          <el-table-column
            align="center"
            type="selection"
            width="50">
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
            label="所属员工"
            prop="staffId"
            :show-overflow-tooltip="true">
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
            width="130">
          <template slot-scope="scope">
            <!-- <a v-if="scope.row.status && scope.row.isBlacklist === '0' && scope.row.isNodisturb === '0' && scope.row.staffId === aId" @click="changeToCustomerDetail(scope.row.taskId,scope.row.campaignId,scope.row.customerId,scope.row.isBlacklist,scope.row.customerPhone);" size="small" type="text">
              <img src="../../../static/images/my_imgs/img_dial.png" alt="拨打"/>拨打</a>
            <div v-if="scope.row.staffId !== aId" size="small" type="text">
              不可拨打</div>
            <el-tooltip v-if="scope.row.status === '2' || scope.row.status === '3' || scope.row.status === '4'" class="item" effect="dark"  content="该状态不能拨打" placement="left-start">
              <div><img src="../../../static/images/my_imgs/img_dial_disabled.png" alt="拨打" style="cursor:default"/><span style="cursor:default">拨打</span></div>
            </el-tooltip>
            <el-tooltip v-if="scope.row.isBlacklist === '1'" class="item" effect="dark"  content="该号码为免访客户" placement="left-start">
              <div><img src="../../../static/images/my_imgs/img_dial_disabled.png" alt="拨打" style="cursor:default"/><span style="cursor:default">拨打</span></div>
            </el-tooltip>
            <el-tooltip v-if="scope.row.isNodisturb === '1'" class="item" effect="dark"  content="该号码处于免访号段中" placement="left-start">
              <div><img src="../../../static/images/my_imgs/img_dial_disabled.png" alt="拨打" style="cursor:default"/><span style="cursor:default">拨打</span></div>
            </el-tooltip> -->
            <a v-if="showStatus(scope.row.status) && checkBlacklist(scope.row.isBlacklist) && checkNodisturb(scope.row.isNodisturb) && scope.row.staffId === aId" @click="sumTotal=0;products=[];customerNote='';changeToCustomerDetail(scope.row.taskId,scope.row.campaignId,scope.row.customerId,scope.row.isBlacklist,scope.row.customerPhone);" size="small" type="text">
              <img src="../../../static/images/my_imgs/img_dial.png" alt="拨打"/>拨打</a>
            <div v-if="showStatus(scope.row.status) && checkBlacklist(scope.row.isBlacklist) && checkNodisturb(scope.row.isNodisturb)" v-show="scope.row.staffId !== aId" size="small" type="text">
              不可拨打</div>
            <el-tooltip v-else-if="!showStatus(scope.row.status)" class="item" effect="dark"  content="该状态不能拨打" placement="left-start">
              <div><img src="../../../static/images/my_imgs/img_dial_disabled.png" alt="拨打" style="cursor:default"/><span style="cursor:default">拨打</span></div>
            </el-tooltip>
            <el-tooltip v-else-if="!checkBlacklist(scope.row.isBlacklist)" class="item" effect="dark"  content="该号码为免访客户" placement="left-start">
              <div><img src="../../../static/images/my_imgs/img_dial_disabled.png" alt="拨打" style="cursor:default"/><span style="cursor:default">拨打</span></div>
            </el-tooltip>
            <el-tooltip v-else-if="!checkNodisturb(scope.row.isNodisturb)" class="item" effect="dark"  content="该号码处于免访号段中" placement="left-start">
              <div><img src="../../../static/images/my_imgs/img_dial_disabled.png" alt="拨打" style="cursor:default"/><span style="cursor:default">拨打</span></div>
            </el-tooltip>
            <el-button type="text" v-if="show_wechat==='true'"  class="el-icon-message" :disabled="!showStatus(scope.row.status) || checkBindWechat(scope.row.customerId)" @click="toChatPage(scope.row.taskId, scope.row.campaignId, scope.row.customerId, scope.row.customerName, scope.row.customerPhone)">微信聊天</el-button>
          </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row style="margin-top:20px;">
        <el-pagination
          v-if="pageShow"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page='pageInfo.pageNo'
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size='pageInfo.pageSize'
          layout="total, sizes, prev, pager, next, jumper "
          :total='pageInfo.totalCount' style="text-align: right;float:right;">
        </el-pagination>
      </el-row>
    </el-row>
    
  </div>

  <!-- 客户详情 div层 -->
  <div class="dial-task" v-else>
    <div class="table-container" style="margin-top:0;">
      <b class="font14">客户信息</b>
      <div style="display:inline-block;position:relative;top:3px;margin-left:10px;">
        <img v-if="!hideDialTo" style="height:16px;cursor:pointer;" src="../../../static/images/dial_normal.png" alt="拨打" @click="dialTo(taskId,campaignId,isBlacklist,customerPhone)">
        <img v-if="hideDialTo" style="height:16px;cursor:disable;" src="../../../static/images/dial_disable.png" alt="拨打">
        <el-button :disabled="checkBindWechat(telCustomerInfos.customerId)" @click="toWeChat" class="wechat-btn" type="text" v-if="show_wechat==='true'"><svg-icon icon-class="wechat" class="icon-size" style="width:20px;height:16px;"/></el-button>
      </div>
      <el-row class="customerinfo-container">
        <el-col :span="6" class="font12">
          <span>客户姓名：</span>
          <b style="color:#020202;">{{customerInfo.customerName}}</b>
        </el-col>
        <el-col :span="6" class="font12">
          <span>手机号码：</span>
          <b style="color:#020202;">{{customerInfo.mobile}}</b>
        </el-col>
        <el-col :span="6" class="font12" v-if="!(item === 'customerName' || item === 'mobile')" v-for="(item,index) in customerColumnInfos">
          <span>{{item === 'email' ? 'email:' : item === 'idNumber' ? '身份证:': item === 'resideAddress' ? '地址:' : item === 'sex' ? '性别:': item === 'source' ? '客户来源:' : item === 'customerId' ? '客户编号:': item === 'wechatPhone' ? '微信手机号:' : item === 'bankCardType' ? '持卡类型:' : ''}}</span>
          <b style="color:#020202;" :class="item" v-if="!isInput">{{item === 'email' ? customerInfo.email : item === 'idNumber' ? customerInfo.idNumber: item === 'resideAddress' ? customerInfo.resideAddress : item === 'sex' ? showSex(customerInfo.sex): item === 'source' ? customerInfo.source : item === 'customerId' ? customerInfo.customerId: item === 'wechatPhone' ? customerInfo.wechatPhone : item === 'bankCardType' ? customerInfo.bankCardType : ''}}</b>
          <el-input size="mini" style="width:45%;display:none;" :class="item" :id="item+'input'"></el-input>&nbsp;&nbsp;
          <i class="el-icon-circle-check-outline" @click="modifyCustomerInfo(customerInfo.customerId,item)" style="cursor:pointer;display:none;" :id="item+'btn1'"></i>
          <i class="el-icon-circle-close-outline" @click="changeToInput(item)" style="cursor:pointer;display:none;" :id="item+'btn2'"></i>
          <i :id="item+'edit'" @click="changeToInput(item)" style="cursor:pointer;">
            <img src="../../../static/images/edit_btn.png">
          </i>
        </el-col>
      </el-row>
      <el-row style="width:100%;border-top:1px solid #ccc;margin:20px 0;"></el-row>
      <el-row>
        <b class="font14">接触记录</b>
        <el-table
          style="margin-top:20px;"
          :data="contactRecord">
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
      </el-row>
    </div>
    <el-row type="flex">
      <el-col class="table-container" style="width:60.1%;">
        <b class="font14">产品信息</b>
        <!-- <el-row style="margin-top:20px;"> -->
          <!-- <el-form :inline="true" size="mini">
            <el-form-item>
              <el-input placeholder="请输入搜索内容" maxlength="50">
                 <i slot="prefix" class="el-input__icon el-icon-search" style="cursor:pointer;"></i>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-select placeholder="请选择类型"> -->

                <!-- <el-option
                  v-for="item in taskStatusOptions"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label">

                </el-option> -->

              <!-- </el-select>
            </el-form-item>
          </el-form>
        </el-row> -->
        <el-row style="margin-top:20px;">
          <el-table
            :data="products">
            <el-table-column
              align="center"
              prop="productName"
              label="名称">
            </el-table-column>
            <el-table-column
              align="center"
              label="产品类型"
              :show-overflow-tooltip="true">
              <template 
                slot-scope="scope">
                {{scope.row.productType===null?'':scope.row.productType === '0' ? '实体产品' : '虚拟产品'}}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="产品编号"
              prop="productId"
              :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
              align="center"
              label="产品单价" 
              :show-overflow-tooltip="true">
              <template
                slot-scope="scope">
                {{scope.row.price===null?'￥ '+ 0:'￥ '+scope.row.price}}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="产品库存"
              prop="productNum"
              :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
              align="center"
              prop="description"
              label="产品描述">
            </el-table-column>
            <el-table-column
              align="center"
              label="操作"
              width="100">
            <template slot-scope="scope">
              <el-button type="primary" :disabled="scope.row.productNum===0||scope.row.number!==0" @click.native="handleChange(scope.row.productId,scope.row.price,1,scope.$index)" size="mini" style="width:30px;height:20px;text-align:center;vertical-align:middle;padding:0;">+</el-button>
            </template>
            </el-table-column>
          </el-table>
        </el-row>
        <!-- <el-row style="margin-top:5px;">
          <el-pagination
            v-if="pageShow"
            @size-change="handleSizeChange123"
            @current-change="handleCurrentChange123"
            :current-page='pageInfo.pageNo'
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size='pageInfo.pageSize'
            layout="total, prev, pager, next, jumper "
            :total='pageInfo.totalCount' 
            style="text-align: right;float:right;">
          </el-pagination>
        </el-row> -->
      </el-col>
      <el-col class="table-container" style="padding:20px 0;width:38.4%;margin-left:1.9%;float:right">
        <b class="font14" style="margin-left:20px;">选购清单</b>
        <ul class="shopping-list">
          <li v-if="!sumTotal">
            <span class="empty-text">暂无清单</span>
          </li>
          <li class="font12" v-for="(item,index) in products" v-if="item.number" style="padding:0 20px;white-space: nowrap;overflow: hidden;text-overflow:ellipsis;">
            <el-popover trigger="hover" placement="bottom" :content="item.productName" class="product-name">
              <span slot="reference" style="width:100%;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{item.productName}}</span>
            </el-popover>
            <el-popover trigger="hover" placement="bottom" :content="'￥ '+item.price">
              <span slot="reference" style="width:100%">{{(typeof item.price==='undefined'||item.price===null)?0:'￥ '+item.price}}</span>
            </el-popover>
            <span style="width:3%">X</span>
            <el-input-number style="width:25%;" v-model="item.number" @change="handleChange(item.productId,item.price,item.number,index)" :min="1" :max="item.productNum" size="mini">0</el-input-number>
            <span style="width:3%">=</span>
            <el-popover trigger="hover" placement="bottom" :content="'￥ '+(item.price * item.number ? (item.price * item.number).toFixed(2) : 0 )">
              <span slot="reference" v-model="item.sum" style="width:100%">{{'￥ '+(item.price * item.number ? (item.price * item.number).toFixed(2) : 0 )}}</span>
            </el-popover>
            <el-button type="text" @click="delList(index,(item.price * item.number ? (item.price * item.number).toFixed(2) : 0))">删除</el-button>
          </li>
        </ul>
        <div style="float:right;margin:20px 44px 27px 0;" v-if="sumTotal">
          <b>总计：</b>
          <b style="color:#ED2135;">￥ {{sumTotal}}</b>
        </div>
        <div style="padding:0 20px;">
          <b class="font14" style="display:inline-block;margin:20px 0;">客户留言</b>
          <el-input
            type="textarea"
            :maxlength="100"
            :autosize="{ minRows: 4, maxRows: 6}"
            placeholder="有特别的要求请注明，限100字。"
            v-model="customerNote">
          </el-input>
        </div>
      </el-col>
    </el-row>
    <el-row class="table-container task-status" style="margin-bottom:20px;">
      <el-row>
        <el-form :inline="true" size="mini">
          <el-col :span="8" style="height:48px;">
            <el-form-item label="任务状态：">
              <el-radio v-model="radio" label="2" name="2" @change="setSendMessage(radio)" class="radio-success"><span>成功</span></el-radio>
              <el-radio v-model="radio" label="3" name="3" @change="setSendMessage(radio)" class="radio-fail"><span>失败</span></el-radio>
              <el-radio v-model="radio" label="1" name="1" @change="setSendMessage(radio)" v-show="isLastContactTime===false" class="radio-order"><span>预约</span></el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="16" v-show="this.radio === '1'">
            <span style="color:red;line-height:34px;">*</span>
            <el-form-item label="预约日期：" class="working-date-form">
              <b style="font-size: 16px;color: #333333;letter-spacing: 0;text-align: left;">T + </b>
              <el-input style="width:70px" type="text" v-model="addDays" onkeyup="if(! /^d+$/.test(this.addDays)){this.addDays='';}"></el-input>
            </el-form-item>
            <el-form-item class="time-picker-form">
              <el-date-picker
                v-model="appointTime"
                placeholder="请选择日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                default-time="00:00:00"
                type="datetime" style="width:200px">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="height:48px;line-height:34px;" v-if="showSendMessage === true && campaignType !== 'RECRUIT'">
            <el-checkbox v-model="sendMessage" checked="checked">发送支付短信</el-checkbox>
          </el-col>
          <el-col :span="8" style="height:48px;line-height:34px;" v-if="showAutoDial===true">
            <el-checkbox checked="checked" v-model="autoDialNext">完成后显示下一个客户</el-checkbox>
          </el-col>
          <el-col :span="8" style="height:48px;line-height:34px;" v-if="autoCallDial">
            <el-checkbox checked="checked" v-model="autoCalllNext">完成后继续自动外呼</el-checkbox>
          </el-col>
        </el-form>
      </el-row>
      <el-row>
        <el-form>
          <el-form-item label="话后小结：" style="margin-bottom:12px;">
            <el-cascader
              size="mini"
              placeholder="请选择小结"
              v-model='selectedSummarys'
              :options="nodulesTree"
              filterable
              :props="summaryTreeProps"
              :show-all-levels="false">
            </el-cascader>
          </el-form-item>
          <el-form-item>
            <el-col :span="16">
              <b class="font12" style="color:#020202;">小结备注：</b>
              <el-input
                type="textarea"
                :maxlength="100"
                :autosize="{ minRows: 4, maxRows: 6}"
                v-model="summary_description">
              </el-input>
            </el-col>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <div style="text-align:center">
          <el-button plain type="primary" size="small" @click="returnList();customerNote='';sumTotal=0;products=[];" style="margin-right:40px;">返回</el-button>
          <a href="javascript:void(0);" @click="generateRecord()"><el-button type="primary" size="small">完成</el-button></a>
        </div>
      </el-row>
    </el-row>
   
    <!-- 添加微信手机号dialog -->
    <el-dialog width="30%" title="添加微信手机号" :visible.sync="addWechatPhone" append-to-body>
      微信手机号：<el-input v-model="editCustomerInfo.wechatPhone" placeholder="请输入客户微信手机号" maxlength="11" clearable></el-input>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button type="primary" @click="addWechatPhone = false;editCustomerInfos(editCustomerInfo);">确定</el-button>
        <el-button @click="addWechatPhone = false">取消</el-button>
      </div>
    </el-dialog>

    <!-- 修改微信手机号dialog -->
    <el-dialog width="30%" title="添加微信手机号" :visible.sync="editWechatPhone" append-to-body>
      微信手机号：<el-input v-model="editCustomerInfo.wechatPhone" placeholder="请输入客户微信手机号" maxlength="11" clearable></el-input>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button type="primary" @click="editWechatPhone = false;editCustomerInfos(editCustomerInfo);">确定</el-button>
        <el-button @click="editWechatPhone = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</div>
</template>
<style lang='scss'>
  .dial-task .el-form-item__label{
    font-size: 12px !important;
    color: #020202 !important;
    letter-spacing: 0.25px !important;
  }
</style>

<style lang='scss' scoped>
.dial-task{
  .wechat-btn.is-disabled{
    background:none !important;
    color:#ccc !important;
    border:none;
  }
  .customerinfo-container{
    .font12{
      margin-top:2px;
      height:30px;
      line-height:30px;
    }
  }
  .shopping-list{
    border-top:1px solid #CED4E2;
    border-bottom:1px solid #CED4E2;
    max-height:270px;
    margin-top:20px;
    overflow-y:auto;
    li {
      .empty-text{
        font-size:14px;
        width:100%;
        color: #909399;
      }
      height:45px;
      line-height:44px;
      color:#020202;
      border-bottom:1px solid #eee;
      box-sizing:border-box;
      span{
        display:inline-block;
        text-align:center;
        vertical-align: middle;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
      .product-name{
        width:37%;
      }
    }
  }
  .task-status{
    .el-form-item__label{
      font-size: 12px !important;
      color: #020202 !important;
      letter-spacing: 0.25px !important;
    }
    .working-date-form{
      .el-form-item__label{
        font-size: 12px !important;
        color: #020202 !important;
        letter-spacing: 0.25px !important;
      }
    }
    .time-picker-form{
      .el-form-item__label{
        font-size: 12px !important;
        color: #020202 !important;
        letter-spacing: 0.25px !important;
      }
    }
  }
  .wechat-btn{
    padding:0;
    color:#57AFFF;
    position:relative;
    bottom:4px;
    &.is-disabled{
      color:#ccc;
    }
    &.is-disabled:hover{
      opacity:1 !important;
    }
    &:hover{
      opacity:0.7;
    }
  }
}
@media screen and (min-width: 1281px) and (max-width:1367px){
  .dial-task {
    .shopping-list{
      li{
        .product-name{
          width:22%;
        }
      }
    }
  }
}
@media all and (min-width:1024px) and (max-width:1280px)  {
  .dial-task {
    .shopping-list{
      li{
        .product-name{
          width:19%;
        }
      }
    }
  }
}
</style>

<script>
// import cti from '@/utils/ctijs' //
import { Message, MessageBox } from 'element-ui'
import { getPhoneOwn } from '@/api/navbar'
import { formatDateTime } from '@/utils/tools' // 格式化时间
import getDynamicRouter from '@/router/dynamic-router'
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
  addMoreOrder,
  modifyProduct
} from '@/api/dialTask' // 接口
import { departAgents, getDepartId } from '@/api/ctiReport'
import { permsDepart, permsStaff } from '@/api/reportPermission'
import { editCustomer } from '@/api/customerManagement'// 接口
import { getWechatCustomer } from '@/api/wechat_list'
var vm = null

export default {
  name: 'dial_task',

  data() {
    return {
      autoCallDial: false, // 自动外呼
      formContainerOpen: '1',
      formContainer: this.$store.state.app.formContainer,
      show_wechat: `${process.env.SHOW_WECHAT}`,
      isInput: false,
      aId: '',
      departPermission: false,
      departId: '',
      agents: [],
      agentsOptions: [],
      agentsId: '',
      customerNote: '', // 客户留言
      sumTotal: 0, // 总价格
      sumInfo: new Map(), // 所选中的产品
      checks: {},
      products: [], // 活动下的产品,
      productNums: [], // 活动下的产品库存
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
      addWechatPhone: false, // 添加微信手机号dialog
      editWechatPhone: false, // 修改微信手机号dialog
      editCustomerInfo: {
        customerId: '',
        wechatPhone: ''
      },
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
      order_Params: {}, // 即将生成订单的参数
      activeTab: '', // 产品展示项
      showAutoDial: false, // 是否展示自动拨打下一个
      autoDialNext: true, // 完成后自动拨打下一个
      autoCalllNext: true, // 是否继续自动外呼
      showSendMessage: false, // 是否展示发送支付短信
      sendMessage: true, //  发送支付短信checkbox
      nodulesTree: [], // 需要展示的小结树 数据
      summaryTreeProps: {
        children: 'summaryDetailInfos',
        label: 'name',
        value: 'id'
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
        pageSize: 10,
        staffId: ''
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
      idNumber: '',
      customerInfos: [],
      telCustomerInfos: JSON.parse(sessionStorage.getItem('setDetail')),
      customerColumnInfos: [] // 用来展示的客户字段
    }
  },
  methods: {
    handleChangeAcitve(active = ['1']) {
      if (active.length) {
        $('.form-more').text('收起')
      } else {
        $('.form-more').text('更多')
      }
    },
    // 添加或修改客户微信手机号
    editCustomerInfos(editCustomerInfo) {
      var reg = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(17[0,5-9])|(18[0,5-9]))\d{8}$/
      if (editCustomerInfo.wechatPhone === '' || editCustomerInfo.wechatPhone === null) {
        this.$message.error('请输入客户微信手机号！')
        return
      }
      if (!reg.test(editCustomerInfo.wechatPhone)) {
        this.$message.error('请输入正确的微信手机号！')
        return
      }
      editCustomer(editCustomerInfo)
        .then(response => {
          if (response.data.code === 0) {
            this.$message.success(response.data.message)
            this.customerInfo.wechatPhone = editCustomerInfo.wechatPhone
          } else {
            this.$message.error(response.data.messages)
          }
        })
    },
    // 判断客户是否绑定微信公众号
    checkBindWechat(customerId) {
      // console.log(customerId)
      const customerInfos = JSON.stringify(this.customerInfos)
      // console.log(customerInfos.indexOf(customerId))
      if (customerInfos.indexOf(customerId) === -1) {
        return true
      }
    },
    sendMessageToNavbar(flag) {
      // 发送指令给navbar告知当前情况
      const obj = {}
      obj.agentId = localStorage.getItem('agentId')
      obj.isDialTask = flag
      this.$root.eventHub.$emit('DIAL_TASK', obj)
    },
    // 跳转至聊天页
    toChatPage(taskId, campaignId, customerId, customerName, customerPhone) {
      let messagePath = ''
      const messageRouter = getDynamicRouter(JSON.parse(sessionStorage.getItem('getMenu')))
      for (let i = 0; i < messageRouter.length; i++) {
        for (let j = 0; j < messageRouter[i].children.length; j++) {
          if (messageRouter[i].children[j].name === 'wechat_list') {
            messagePath = messageRouter[i].path + '/' + messageRouter[i].children[j].name
          }
        }
      }
      this.$router.push({
        path: messagePath,
        query: {
          fromDialTask: '0',
          taskId: taskId,
          campaignId: campaignId,
          customerId: customerId,
          customerPhone: customerPhone
        }
      })
    },
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
      this.$root.eventHub.$emit('DISABLED_DIAL', '1')
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
        // this.inNodisturbPhones(customerPhone)
        new Promise(function(resolve, reject) {
          isInNodisturbPhones(customerPhone).then(res => {
            if (res.data.code === 0) {
              vm.flag = false
            } else {
              vm.flag = true
            }
          }).then(() => {
            if (vm.flag === false && isBlacklist === '0') {
            // 非黑名单  非免访号段内的号码
            // 判断剩余拨打次数
              checkDialTimes(taskId).then(response => {
                if (response.data.code === 0) {
                  if (response.data.data.canContact === '1') {
                  // 说明未超过次数限制还能拨打
                    if (response.data.data.lastContactTime === '1') {
                    // 说明是最后一次 将预约栏隐藏
                      vm.radio = ''
                      vm.isLastContactTime = true
                      queryOneTask(taskId).then(response1 => {
                        if (response1.data.code === 0) {
                          if (
                            response1.data.data.status === '2' ||
                        response1.data.data.status === '3'
                          ) {
                            vm.$message.error('该拨打任务已结束！')
                            return
                          } else {
                            localStorage.setItem('global_taskId', taskId)
                            vm.normalDial(taskId, campaignId, customerPhone)
                          }
                        }
                      })
                    } else {
                      queryOneTask(taskId).then(response1 => {
                        if (response1.data.code === 0) {
                          if (
                            response1.data.data.status === '2' ||
                        response1.data.data.status === '3'
                          ) {
                            vm.$message.error('该拨打任务已结束！')
                            return
                          } else {
                            localStorage.setItem('global_taskId', taskId)
                            vm.normalDial(taskId, campaignId, customerPhone)
                          }
                        }
                      })
                    }
                  } else {
                    vm.hideDialTo = true
                    vm.canContact = 0
                    // clearInterval(this.interval)
                    vm.$message.error('超过拨打限制次数！')
                    return
                  }
                }
              })
            } else {
              vm.$message.error('该号码在免访号段或黑名单中！')
              return
            }
          })
        })
      }
    },
    // 定时监控设置能否继续拨打的状态
    // editDialToStatus() {
    //   const reasonCode = localStorage.getItem('reasonCode')
    //   if (
    //     reasonCode === '-1' ||
    //     reasonCode === '-2' ||
    //     reasonCode === '-3' ||
    //     reasonCode === '-4' ||
    //     reasonCode === ''
    //   ) {
    //     this.hideDialTo = true
    //   } else if (
    //     (reasonCode === '0' || reasonCode === '14' || reasonCode === '13') &&
    //     this.canContact === 0
    //   ) {
    //     this.hideDialTo = true
    //     // clearInterval(this.interval)
    //   } else if (reasonCode === '-101' || reasonCode === '-100') {
    //     this.hideDialTo = true
    //   } else {
    //     this.hideDialTo = false
    //   }
    // },
    // 调用cti拨打功能
    normalDial(taskId, campaignId, customerPhone) {
      this.hideDialTo = true
      if (localStorage.getItem('agentId')) {
        const reasoncode = JSON.parse(localStorage.getItem(localStorage.getItem('agentId'))).reasoncode
        if (reasoncode === '-2' || reasoncode === '-3' || reasoncode === '-4' || reasoncode === '0' || reasoncode === '-100' || reasoncode === '-101' || reasoncode === '-5' || reasoncode === '-6') {
          this.$message.error('请在示忙或后处理状态下拨打号码！')
          return
        }
      }
      // console.log('1,' + localStorage.getItem('DN'))
      // console.log('2,' + localStorage.getItem('callerDN'))
      const regex = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[01356789]|18[0-9]|19[89])\d{8}$/
      if (regex.test(customerPhone)) {
        getPhoneOwn(customerPhone).then(res => {
          if (
            localStorage.getItem('DN') !== null &&
            localStorage.getItem('DN') !== ''
          ) {
            // cti.makecall(localStorage.getItem('DN'), res.data)
            this.$root.eventHub.$emit('DIAL_TASK_DIALNM', { 'caller': localStorage.getItem('DN'), 'callee': res.data, campaignId })
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
          // cti.makecall(localStorage.getItem('DN'), customerPhone)
          this.$root.eventHub.$emit('DIAL_TASK_DIALNM', { 'caller': localStorage.getItem('DN'), 'callee': customerPhone, campaignId })
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
    // sendSummaryId(data, checked, ischildSelected) {
    //   if (checked && data.summaryDetailInfos === null) {
    //     this.selectedSummarys.push(data.id)
    //   } else {
    //     if (this.selectedSummarys.some(i => i === data.id)) {
    //       // 移除数组中此项id
    //       this.selectedSummarys.splice(
    //         this.selectedSummarys.indexOf(data.id),
    //         1
    //       )
    //     }
    //   }
    // },
    // 综合查询
    searchByKeyWords(req) {
      const queryInfo = {}
      queryInfo.appointTimeEnd = req.appointTimeEnd
      queryInfo.appointTimeStart = req.appointTimeStart
      queryInfo.contactStatus = req.contactStatus
      queryInfo.contactedNum = req.contactedNum
      queryInfo.customerName = req.customerName
      queryInfo.customerPhone = req.customerPhone
      queryInfo.distributeTimeEnd = req.distributeTimeEnd
      queryInfo.distributeTimeStart = req.distributeTimeStart
      queryInfo.modifyTimeEnd = req.modifyTimeEnd
      queryInfo.modifyTimeStart = req.modifyTimeStart
      queryInfo.pageNo = req.pageNo
      queryInfo.pageSize = req.pageSize
      queryInfo.staffId = req.staffId
      queryInfo.status = req.status
      queryInfo.summaryId = req.summaryId
      if (req.campaignId === '' && this.campaignsInfo.length > 0) {
        const arr = []
        for (let i = 0; i < this.campaignsInfo.length; i++) {
          const campaignId = this.campaignsInfo[i].campaignId
          if (campaignId !== '' && arr.indexOf(campaignId) === -1) {
            arr.push(campaignId)
          }
        }
        queryInfo.campaignId = arr.join(',')
      } else {
        queryInfo.campaignId = req.campaignId
      }
      queryByKeywords(queryInfo)
        .then(response => {
          if (response.data.code === 0) {
            if (response.data.data) {
              this.tableData = response.data.data
              this.pageInfo = response.data.pageInfo
              this.pageShow = true
              this.sendMessageToNavbar(this.isDialTask)
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
      this.sumInfo = new Map()
      sessionStorage.setItem('setDetail', JSON.stringify({ 'taskId': taskId, 'campaignId': campaignId, 'customerId': customerId, 'isBlacklist': isBlacklist, 'customerPhone': customerPhone }))
      this.telCustomerInfos = JSON.parse(sessionStorage.getItem('setDetail'))
      // this.$store.dispatch('setDetail', [taskId, campaignId, customerId, isBlacklist, customerPhone])
      this.customerPhone = customerPhone
      // 调用方法判断是否在免访号段内
      // this.inNodisturbPhones(customerPhone)
      new Promise(function(resolve, reject) {
        isInNodisturbPhones(customerPhone).then(res => {
          if (res.data.code === 0) {
            vm.flag = false
          } else {
            vm.flag = true
          }
        }).then(() => {
          if (vm.flag === false && isBlacklist === '0') {
            // window.localStorage.removeItem('taskIds')
            // localStorage.setItem('taskId', taskId)
            // localStorage.setItem('campaignId', campaignId)
            vm.taskId = taskId
            vm.campaignId = campaignId
            vm.isBlacklist = isBlacklist
            vm.customerId = customerId
            vm.showAutoDial = false
            vm.activeNames = ['1', '2', '3', '4']
            vm.autoDialNext = false
            vm.showSendMessage = false
            vm.hideDialTo = false
            vm.isLastContactTime = false
            vm.radio = ''
            // this.recordId = ''
            vm.activeTab = ''
            vm.canContact = 1
            vm.addDays = ''
            vm.summary_description = ''
            vm.appointTime = ''
            vm.selectedSummarys = []
            vm.showDetailInfos(taskId, campaignId, customerId, isBlacklist, customerPhone)
            vm.isDialTask = false
            vm.sendMessageToNavbar(vm.isDialTask)
            sessionStorage.setItem('isDialTask', vm.isDialTask)
          } else {
            if (vm.isDialTask && customerPhone === '') { // 说明是刷新页面的问题

            } else {
              vm.$message.error('该客户在黑名单或免访号段中,无法拨打!')
            }
            vm.returnList()
          }
        })
      })
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
        sessionStorage.setItem('setDetails', JSON.stringify({ 'taskIds': this.taskIds, 'campaignIds': this.campaignIds, 'isBlacklists': this.isBlacklists, 'customerIds': this.customerIds }))
        // this.$store.dispatch('setDetails', [this.taskIds, this.campaignIds, this.isBlacklists, this.customerIds])
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
        this.sendMessageToNavbar(this.isDialTask)
        sessionStorage.setItem('isDialTask', this.isDialTask)
      }
    },
    changeToInput(item) {
      switch (item) {
        case 'idNumber': $('div.idNumber').toggle(); $('b.idNumber').toggle(); $('#idNumberedit').toggle(); $('#idNumberbtn1').toggle(); $('#idNumberbtn2').toggle(); break
        case 'wechatPhone': $('div.wechatPhone').toggle(); $('b.wechatPhone').toggle(); $('#wechatPhoneedit').toggle(); $('#wechatPhonebtn1').toggle(); $('#wechatPhonebtn2').toggle(); break
        case 'sex': $('div.sex').toggle(); $('b.sex').toggle(); $('#sexedit').toggle(); $('#sexbtn1').toggle(); $('#sexbtn2').toggle(); break
        case 'customerId': $('div.customerId').toggle(); $('b.customerId').toggle(); $('#customerIdedit').toggle(); $('#customerIdbtn1').toggle(); $('#customerIdbtn2').toggle(); break
        case 'resideAddress': $('div.resideAddress').toggle(); $('b.resideAddress').toggle(); $('#resideAddressedit').toggle(); $('#resideAddressbtn1').toggle(); $('#resideAddressbtn2').toggle(); break
        case 'email': $('div.email').toggle(); $('b.email').toggle(); $('#emailedit').toggle(); $('#emailbtn1').toggle(); $('#emailbtn2').toggle(); break
        case 'bankCardType': $('div.bankCardType').toggle(); $('b.bankCardType').toggle(); $('#bankCardTypeedit').toggle(); $('#bankCardTypebtn1').toggle(); $('#bankCardTypebtn2').toggle(); break
        case 'source': $('div.source').toggle(); $('b.source').toggle(); $('#sourceedit').toggle(); $('#sourcebtn1').toggle(); $('#sourcebtn2').toggle(); break
      }
    },
    modifyCustomerInfo(customerId, item) {
      const reg_ID = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      const reg_email = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
      this.editCustomerInfo.customerId = customerId
      switch (item) {
        case 'wechatPhone':
          this.editCustomerInfo.wechatPhone = $('#wechatPhoneinput').val()
          var reg = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(17[0,5-9])|(18[0,5-9]))\d{8}$/
          if ($('#wechatPhoneinput').val() === '' || $('#wechatPhoneinput').val() === null) {
            this.$message.error('请输入客户微信手机号！')
            $('#wechatPhoneinput').val('')
            this.changeToInput(item)
            return
          }
          if (!reg.test($('#wechatPhoneinput').val())) {
            this.$message.error('请输入正确的微信手机号！')
            this.changeToInput(item)
            return
          }
          editCustomer(this.editCustomerInfo)
            .then(response => {
              if (response.data.code === 0) {
                this.$message.success(response.data.message)
                this.customerInfo.wechatPhone = $('#wechatPhoneinput').val()
              } else {
                this.$message.error(response.data.messages)
              }
            }).catch(error => {
              console.log(error)
            })
          break
        case 'idNumber':
          this.editCustomerInfo.idNumber = $('#idNumberinput').val()
          if (!reg_ID.test($('#idNumberinput').val())) {
            this.$message.error('请输入正确的身份证！')
            $('#idNumberinput').val('')
            this.changeToInput(item)
            return
          }
          editCustomer(this.editCustomerInfo).then(response => {
            if (response.data.code === 0) {
              this.$message.success('修改成功！')
              this.customerInfo.idNumber = $('#idNumberinput').val()
              this.changeToInput(item)
            } else {
              this.$message.error('修改失败！')
              this.changeToInput(item)
              console.log(response.data.message)
            }
          }).catch(error => {
            console.log(error)
          })
          break
        case 'sex':
          this.editCustomerInfo.sex = $('#sexinput').val() === '男' ? 0 : $('#sexinput').val() === '女' ? 1 : null
          if (this.editCustomerInfo.sex === null) {
            this.$message.error('修改失败！')
            $('#sexinput').val('')
            this.changeToInput(item)
          } else {
            editCustomer(this.editCustomerInfo).then(response => {
              if (response.data.code === 0) {
                this.$message.success('修改成功！')
                this.customerInfo.sex = $('#sexinput').val()
                this.changeToInput(item)
              } else {
                this.$message.error('修改失败！')
                this.changeToInput(item)
                console.log(response.data.message)
              }
            }).catch(error => {
              console.log(error)
            })
          }
          break
        case 'customerId':
          this.$message.error('客户编号无法修改！')
          $('#customerIdinput').val('')
          this.changeToInput(item)
          break
        case 'resideAddress':
          this.editCustomerInfo.resideAddress = $('#resideAddressinput').val()
          if ($('#resideAddressinput').val() === '' || !$('#resideAddressinput').val()) {
            this.$message.error('地址不能为空！')
            $('#resideAddressinput').val('')
            this.changeToInput(item)
            return
          }
          editCustomer(this.editCustomerInfo).then(response => {
            if (response.data.code === 0) {
              this.$message.success('修改成功！')
              this.customerInfo.resideAddress = $('#resideAddressinput').val()
              this.changeToInput(item)
            } else {
              this.$message.error('修改失败！')
              this.changeToInput(item)
              console.log(response.data.message)
            }
          }).catch(error => {
            console.log(error)
          })
          break
        case 'email':
          this.editCustomerInfo.email = $('#emailinput').val()
          if (!reg_email.test($('#emailinput').val())) {
            this.$message.error('请输入正确的邮箱！')
            $('#emailinput').val('')
            this.changeToInput(item)
            return
          }
          editCustomer(this.editCustomerInfo).then(response => {
            if (response.data.code === 0) {
              this.$message.success('修改成功！')
              this.customerInfo.email = $('#emailinput').val()
              this.changeToInput(item)
            } else {
              this.$message.error('修改失败！')
              this.changeToInput(item)
              console.log(response.data.message)
            }
          }).catch(error => {
            console.log(error)
          })
          break
        case 'bankCardType':
          this.editCustomerInfo.bankCardType = $('#bankCardTypeinput').val()
          if ($('#bankCardTypeinput').val() === '' || !$('#bankCardTypeinput').val()) {
            this.$message.error('持卡类型不能为空！')
            $('#bankCardTypeinput').val('')
            this.changeToInput(item)
            return
          }
          editCustomer(this.editCustomerInfo).then(response => {
            if (response.data.code === 0) {
              this.$message.success('修改成功！')
              this.customerInfo.bankCardType = $('#bankCardTypeinput').val()
              this.changeToInput(item)
            } else {
              this.$message.error('修改失败！')
              this.changeToInput(item)
              console.log(response.data.message)
            }
          }).catch(error => {
            console.log(error)
          })
          break
        case 'source':
          this.editCustomerInfo.source = $('#sourceinput').val()
          if ($('#sourceinput').val() === '' || !$('#sourceinput').val()) {
            this.$message.error('客户来源不能为空！')
            $('#sourceinput').val('')
            this.changeToInput(item)
            return
          }
          editCustomer(this.editCustomerInfo).then(response => {
            if (response.data.code === 0) {
              this.$message.success('修改成功！')
              this.customerInfo.source = $('#sourceinput').val()
              this.changeToInput(item)
            } else {
              this.$message.error('修改失败！')
              this.changeToInput(item)
              console.log(response.data.message)
            }
          }).catch(error => {
            console.log(error)
          })
          break
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
      if (this.$route.query.dialType === 'autocall') {
        setTimeout(() => {
          this.getRecordId(this.$route.query.taskId, this.$route.query.campaignId)
        }, 3000)
      }
      // 判断活动类型
      getCampaignType(campaignId).then(res1 => {
        this.customerColumnInfos = []
        if (res1.data.code === 0 && res1.data.data.customerColumnInfos) {
          for (let i = 0; i < res1.data.data.customerColumnInfos.length; i++) {
            this.customerColumnInfos.push(res1.data.data.customerColumnInfos[i].customerColumn)
          }
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
              this.productNums = []
              for (let i = 0; i < this.products.length; i++) {
                this.productNums.push(this.products[i].productNum)
                this.$set(this.products[i], 'number', 0)
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
    handleChange(productId, price, number, index) {
      if (!this.products[index].number) {
        this.products[index].number = 1
      }
      // console.log(index)
      // console.log(this.products[index])
      if (number % 1 !== 0) {
        this.products[index].productNum = this.productNums[index]
        this.products[index].number = 0
        this.sumTotal = 0
        this.$message.error('购买数量只能为整数！')
        return false
      }
      if (number >= 0) {
        if (number > this.productNums[index]) {
          this.products[index].productNum = this.productNums[index]
          this.$message.error('购买的数量不能超过产品库存！')
          return false
        }
        // else {
        //   this.products[index].productNum = this.productNums[index] - number
        // }
      }
      // this.products[index].addList = true
      this.sumInfo.set(productId, { price: price, number: number })
      this.sumTotal = 0
      this.sumInfo.forEach((val, key) => {
        if (val !== null && typeof val.price !== 'undefined') {
          this.sumTotal += parseFloat(val.price === null ? 0 : val.price) * parseInt(val.number === null ? 0 : val.number)
        }
      })
      this.sumTotal = this.sumTotal.toFixed(2)
    },
    delList(index, price) {
      MessageBox.confirm('是否删除此商品？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.products[index].number = 0
        this.sumTotal = this.sumTotal - price
      })
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
      var selectedSummarys2 = []
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
        selectedSummarys2.push(this.selectedSummarys[this.selectedSummarys.length - 1])
        this.selectedSummarys = selectedSummarys2
        // 生成完整接触记录及小结
        // 判断任务状态radio  2：成功 3：失败  1：预约
        if (this.radio === '2' && this.campaignType !== 'RECRUIT') {
          if (this.sumTotal <= 0) {
            this.$message.error('未选择产品或产品库存不足！')
            return false
          }
          // 生成订单逻辑
          const createInfo = {}
          createInfo.campaignId = this.campaignId // 活动id
          createInfo.taskId = this.taskId // 任务id
          createInfo.description = this.customerNote // 客户留言
          createInfo.customerId = this.customerId // 客户id
          createInfo.customerName = this.customerInfo.customerName // 客户姓名
          createInfo.customerPhone = this.customerPhone // 客户手机
          createInfo.totalAmount = this.sumTotal

          const productInfos = []
          for (let i = 0; i < this.products.length; i++) {
            const productInfo = this.products[i]
            if (productInfo.number > 0) {
              const result = {}
              result.productId = productInfo.productId
              result.productName = productInfo.productName
              result.productNum = typeof (productInfo.number) === 'undefined' ? 0 : productInfo.number
              productInfos.push(result)
            }
          }
          createInfo.productInfos = productInfos
          addMoreOrder(createInfo).then(response => {
            if (response.data.code === 0) {
              vm.customerNote = ''
              vm.products = []
              vm.sumTotal = 0
              vm.sumInfo = new Map()

              // 成功生成订单
              // 将产品库存减掉  调用修改产品接口
              var map = {}
              var arr = []
              for (var n = 0; n < createInfo.productInfos.length; n++) {
                var params = {}
                params.productId = createInfo.productInfos[n].productId
                params.productNum = createInfo.productInfos[n].productNum
                arr.push(params)
              }
              map.productUpdateNumInfoList = arr
              // 修改产品库存
              modifyProduct(map)

              // 判断是否发送短信
              if (this.sendMessage === true) {
                sendMessageToCustomer(
                  response.data.data,
                  this.customerInfo.mobile
                )
              }
              this.$message({
                message: response.data.message,
                type: 'success',
                duration: 1000
              })
              sessionStorage.removeItem('isDialTask')
              sessionStorage.removeItem('recordId')
              this.$root.eventHub.$emit('DISABLED_DIAL', '')// 发给电话条，看是否需要更改图标
            } else {
              this.$message({
                message: response.data.message,
                type: 'error'
              })
              return
            }
          })
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
                      if (this.autoCalllNext === true) {
                        if (localStorage.getItem('autocall') === 'true') {
                          this.$root.eventHub.$emit('autocallReady', 'auto')
                        }
                      } else {
                        if (localStorage.getItem('autocall') === 'true') {
                          this.$root.eventHub.$emit('autocallReady', 'manual')
                        }
                      }
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
                      this.sendMessageToNavbar(this.isDialTask)
                      sessionStorage.removeItem('isDialTask')
                      sessionStorage.removeItem('recordId')
                    }
                  } else {
                    this.$message.error(res1.data.message)
                    this.searchByKeyWords(this.req)
                    this.isDialTask = true
                    this.sendMessageToNavbar(this.isDialTask)
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
      this.sumInfo = new Map()
      this.$root.eventHub.$emit('DISABLED_DIAL', '')
      const url = window.location.href
      // window.location.href = url.split('?')[0]
      window.location.href = url// 按照原路径返回
      this.isDialTask = true
      this.sendMessageToNavbar(this.isDialTask)
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
        this.sendMessageToNavbar(this.isDialTask)
        // 点击拨打图标触发事件
        this.changeToCustomerDetail(taskId, campaignId, customerId, isBlacklist, customerPhone)
      } else if (sessionStorage.getItem('isDialTask')) { // 判断是否显示拨打界面
        const obj = JSON.parse(sessionStorage.getItem('setDetail'))
        this.taskId = obj.taskId
        this.campaignId = obj.campaignId
        this.customerId = obj.customerId
        this.isBlacklist = obj.isBlacklist
        this.customerPhone = obj.customerPhone
        // this.taskId = this.$store.state.dialTask.taskId
        // this.campaignId = this.$store.state.dialTask.campaignId
        // this.customerId = this.$store.state.dialTask.customerId
        // this.isBlacklist = this.$store.state.dialTask.isBlacklist
        // this.customerPhone = this.$store.state.dialTask.customerPhone
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
    },
    // 跳转到微信页面
    toWeChat() {
      const customerInfo = JSON.parse(sessionStorage.getItem('setDetail'))
      var obj = localStorage.getItem('customerInfos') === null ? null : localStorage.getItem('customerInfos').length > 0 ? JSON.parse(localStorage.getItem('customerInfos')) : null
      queryOneTask(customerInfo.taskId).then(response1 => {
        if (response1.data.code === 0) {
          if (response1.data.data.status === '2' || response1.data.data.status === '3') {
            this.$message.error('该微信任务已结束！')
            return
          } else {
            if (!localStorage.getItem('customerInfos')) {
              obj = []
              obj.push({
                customerName: this.customerInfo.customerName,
                taskId: customerInfo.taskId,
                campaignId: customerInfo.campaignId,
                customerId: customerInfo.customerId,
                customerPhone: customerInfo.customerPhone,
                unreadNum: 0,
                isTalking: false
              })
            } else {
              for (var i = 0; i < obj.length; i++) {
                if (obj[i].taskId === customerInfo.taskId) {
                  obj.splice(i, 1)
                }
              }
              obj.push({
                customerName: this.customerInfo.customerName,
                taskId: customerInfo.taskId,
                campaignId: customerInfo.campaignId,
                customerId: customerInfo.customerId,
                customerPhone: customerInfo.customerPhone,
                unreadNum: 0,
                isTalking: false
              })
            }
            obj = obj.reverse()
            localStorage.setItem('customerInfos', JSON.stringify(obj))

            let messagePath = ''
            const messageRouter = getDynamicRouter(JSON.parse(sessionStorage.getItem('getMenu')))
            for (let i = 0; i < messageRouter.length; i++) {
              for (let j = 0; j < messageRouter[i].children.length; j++) {
                if (messageRouter[i].children[j].name === 'wechat_list') {
                  messagePath = messageRouter[i].path + '/' + messageRouter[i].children[j].name
                }
              }
            }
            this.$router.push({
              path: messagePath,
              query: {
                fromDialTask: '0',
                taskId: customerInfo.taskId,
                campaignId: customerInfo.campaignId,
                customerId: customerInfo.customerId,
                customerPhone: customerInfo.customerPhone
              }
            })
          }
        }
      })
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
    vm = this
    if (this.$route.query.dialstatus) { // 说明是页面跳转过来的
      if (typeof this.$route.query.isDialTask === 'undefined') { // 说明是跳查询页面
        this.req.status = this.$route.query.dialstatus
        if (this.$route.query.dialstatus === '2' || this.$route.query.dialstatus === '3') {
          const dayStart = formatDateTime(new Date().setHours(0, 0, 0, 0))
          const dayEnd = formatDateTime(new Date().setHours(23, 59, 59, 0))
          this.req.modifyTimeStart = dayStart
          this.req.modifyTimeEnd = dayEnd
        }
      } else { // 说明是跳拨打页面
        this.isDialTask = this.$route.query.isDialTask
        if (this.$route.query.data && this.$route.query.dialstatus === 'autocall') { // 自动外呼参数
          const taskId = this.$route.query.taskId
          const campaignId = this.$route.query.campaignId
          const isBlacklist = this.$route.query.isBlacklist
          const customerPhone = this.$route.query.customerPhone
          const customerId = this.$route.query.customerId
          this.showDetailInfos(taskId, campaignId, customerId, isBlacklist, customerPhone)
        } else {
          // sessionStorage.setItem('isDialTask', this.isDialTask)
          this.req.status = this.$route.query.dialstatus
          this.sendMessageToNavbar(this.isDialTask)
        }
      }
    }
  },
  // 模板编译/挂载之后
  mounted() {
    if (localStorage.getItem('autocall') === 'true') {
      this.autoCallDial = true
    }
    this.formContainer()
    this.handleChangeAcitve()
    // 获取微信客户列表
    getWechatCustomer(localStorage.getItem('agentId')).then(response => {
      this.customerInfos = response.data.data
      history.pushState(null, null, document.URL)
      window.addEventListener('popstate', function() {
        history.pushState(null, null, document.URL)
      })
      vm = this
      // 通话记录变量
      if (sessionStorage.getItem('recordId')) {
        this.recordId = sessionStorage.getItem('recordId')
      } else {
        this.recordId = ''
      }
      getDepartId().then(res => {
        this.departId = res.data.departId
        this.aId = res.data.agentid
        permsDepart(res.data.agentid).then(r => {
          this.departPermission = true
          departAgents(res.data.departId).then(response => {
            this.agentsOptions = response.data.result.agents
            this.agents = response.data.result.agents.map(function(item) {
              return item.agent_id
            })
            if (this.$route.query.agent === undefined) {
              this.req.staffId = this.agents.join(',')
            } else {
              this.req.staffId = res.data.agentid
            }
            this.agentsId = this.agents.join(',')
            // 判断是 快速拨打 还是 拨打
            if (sessionStorage.getItem('quickDialto') && sessionStorage.getItem('isDialTask')) {
              const obj = JSON.parse(sessionStorage.getItem('setDetails'))
              this.taskIds = obj.taskIds
              this.campaignIds = obj.campaignIds
              this.customerIds = obj.customerIds
              this.isBlacklists = obj.isBlacklists
              // this.taskIds = this.$store.state.dialTask.taskIds
              // this.campaignIds = this.$store.state.dialTask.campaignIds
              // this.customerIds = this.$store.state.dialTask.customerIds
              // this.isBlacklists = this.$store.state.dialTask.isBlacklists
              this.quickDialto()
            } else {
              this.getParametersFromContactRecordDail()
            }
          })
        }).catch((error) => {
          console.error(error)
          permsStaff(res.data.agentid).then(re => {
            this.departPermission = false
            this.req.staffId = res.data.agentid
            // 判断是 快速拨打 还是 拨打
            if (sessionStorage.getItem('quickDialto') && sessionStorage.getItem('isDialTask')) {
              const obj = JSON.parse(sessionStorage.getItem('setDetails'))
              this.taskIds = obj.taskIds
              this.campaignIds = obj.campaignIds
              this.customerIds = obj.customerIds
              this.isBlacklists = obj.isBlacklists
              // console.log(obj)
              // this.taskIds = this.$store.state.dialTask.taskIds
              // this.campaignIds = this.$store.state.dialTask.campaignIds
              // this.customerIds = this.$store.state.dialTask.customerIds
              // this.isBlacklists = this.$store.state.dialTask.isBlacklists
              this.quickDialto()
            } else {
              this.getParametersFromContactRecordDail()
            }
          })
        })
      })
      history.pushState(null, null, document.URL)
      window.addEventListener('popstate', function() {
        history.pushState(null, null, document.URL)
      })
      vm = this
      // 通话记录变量
      if (sessionStorage.getItem('recordId')) {
        this.recordId = sessionStorage.getItem('recordId')
      } else {
        this.recordId = ''
      }
      getStaffNameById(localStorage.getItem('agentId'))
        .then(res => {
          if (res.data.code === 1) {
            localStorage.setItem('staffName', res.data.data[0].staffName)
          }
        })
      // this.interval = setInterval(() => {
      //   this.editDialToStatus()
      // }, 2000)
      getSummariesByAgentId(localStorage.getItem('agentId')).then(response => {
        vm.summariesInfo = [] // 清空小结节点
        if (response.data.code === 0) {
          if (response.data && response.data.data && response.data.data.length > 0) {
            vm.summariesInfo.push({ 'id': '', 'name': '所有小结' })
            this.handle(response.data.data)
          } else {
            vm.summariesInfo.push({ 'id': '', 'name': '所有小结' })
          }
        }
      }).catch(error => {
        console.error(error)
        vm.summariesInfo.push({ 'id': '', 'name': '所有小结' })
      })
      findCampaignByUser().then(res => {
        vm.campaignsInfo = []
        if (res.data.code === 0) {
          vm.campaignsInfo.push({ campaignId: '', campaignName: '所有活动' })
          if (res.data.data.length > 0) {
            for (let i = 0; i < res.data.data.length; i++) { // 返回值活动数组
              let flag = false// 初始化变量值为否
              for (let j = 0; j < vm.campaignsInfo.length; j++) { // 活动列表数组
                if (res.data.data[i].campaignId === vm.campaignsInfo[j].campaignId) { // 如果活动列表已经存在了返回值的数组id
                  flag = true
                  break
                }
              }
              if (!flag) { // 如果活动不存在，那么增加活动
                vm.campaignsInfo.push({
                  campaignId: res.data.data[i].campaignId,
                  campaignName: res.data.data[i].campaignName
                })
              }
            }
          }
        } else {
          vm.campaignsInfo.push({ campaignId: '', campaignName: '所有活动' })
        }
      })
      // this.req = this.$store.state.dialTask.req
      this.$root.eventHub.$on('NAVBAR', (str) => {
        if (str === 'transfer') {
          if (vm.customerPhone === '' || vm.isBlacklist === '') {
            Message({
              message: '页面还未加载完全，请稍后...',
              type: 'error',
              duration: 2 * 1000
            })
            this.$root.eventHub.$emit('DISABLED_DIAL', '')
          } else {
            if (vm.customerPhone === localStorage.getItem('agentId')) {
              Message({
                message: '坐席号码和客户号码一样，请核对...',
                type: 'error',
                duration: 2 * 1000
              })
              return
            }
            vm.dialTo(vm.taskId, vm.campaignId, vm.isBlacklist, vm.customerPhone)
          }
        }
      })
      vm.$root.eventHub.$on('dialTrue', (str) => {
        if (str === '1') {
          vm.hideDialTo = false
        } else {
          vm.hideDialTo = true
        }
      })
    })
  },
  activated() {
    // 获取微信客户列表
    getWechatCustomer(localStorage.getItem('agentId')).then(response => {
      this.customerInfos = response.data.data
      history.pushState(null, null, document.URL)
      window.addEventListener('popstate', function() {
        history.pushState(null, null, document.URL)
      })
      vm = this
      // 通话记录变量
      if (sessionStorage.getItem('recordId')) {
        this.recordId = sessionStorage.getItem('recordId')
      } else {
        this.recordId = ''
      }
      getDepartId().then(res => {
        this.departId = res.data.departId
        this.aId = res.data.agentid
        permsDepart(res.data.agentid).then(r => {
          this.departPermission = true
          departAgents(res.data.departId).then(response => {
            this.agentsOptions = response.data.result.agents
            this.agents = response.data.result.agents.map(function(item) {
              return item.agent_id
            })
            if (this.$route.query.agent === undefined) {
              this.req.staffId = this.agents.join(',')
            } else {
              this.req.staffId = res.data.agentid
            }
            this.agentsId = this.agents.join(',')
            // 判断是 快速拨打 还是 拨打
            if (sessionStorage.getItem('quickDialto') && sessionStorage.getItem('isDialTask')) {
              const obj = JSON.parse(sessionStorage.getItem('setDetails'))
              this.taskIds = obj.taskIds
              this.campaignIds = obj.campaignIds
              this.customerIds = obj.customerIds
              this.isBlacklists = obj.isBlacklists
              // this.taskIds = this.$store.state.dialTask.taskIds
              // this.campaignIds = this.$store.state.dialTask.campaignIds
              // this.customerIds = this.$store.state.dialTask.customerIds
              // this.isBlacklists = this.$store.state.dialTask.isBlacklists
              this.quickDialto()
            } else {
              this.getParametersFromContactRecordDail()
            }
          })
        }).catch((error) => {
          console.error(error)
          permsStaff(res.data.agentid).then(re => {
            this.departPermission = false
            this.req.staffId = res.data.agentid
            // 判断是 快速拨打 还是 拨打
            if (sessionStorage.getItem('quickDialto') && sessionStorage.getItem('isDialTask')) {
              const obj = JSON.parse(sessionStorage.getItem('setDetails'))
              this.taskIds = obj.taskIds
              this.campaignIds = obj.campaignIds
              this.customerIds = obj.customerIds
              this.isBlacklists = obj.isBlacklists
              // this.taskIds = this.$store.state.dialTask.taskIds
              // this.campaignIds = this.$store.state.dialTask.campaignIds
              // this.customerIds = this.$store.state.dialTask.customerIds
              // this.isBlacklists = this.$store.state.dialTask.isBlacklists
              this.quickDialto()
            } else {
              this.getParametersFromContactRecordDail()
            }
          })
        })
      })
      history.pushState(null, null, document.URL)
      window.addEventListener('popstate', function() {
        history.pushState(null, null, document.URL)
      })
      vm = this
      // 通话记录变量
      if (sessionStorage.getItem('recordId')) {
        this.recordId = sessionStorage.getItem('recordId')
      } else {
        this.recordId = ''
      }
      getStaffNameById(localStorage.getItem('agentId'))
        .then(res => {
          if (res.data.code === 1) {
            localStorage.setItem('staffName', res.data.data[0].staffName)
          }
        })
      // this.interval = setInterval(() => {
      //   this.editDialToStatus()
      // }, 2000)
      getSummariesByAgentId(localStorage.getItem('agentId')).then(response => {
        vm.summariesInfo = [] // 清空小结节点
        if (response.data.code === 0) {
          if (response.data && response.data.data && response.data.data.length > 0) {
            vm.summariesInfo.push({ 'id': '', 'name': '所有小结' })
            this.handle(response.data.data)
          } else {
            vm.summariesInfo.push({ 'id': '', 'name': '所有小结' })
          }
        }
      }).catch(error => {
        console.error(error)
        vm.summariesInfo.push({ 'id': '', 'name': '所有小结' })
      })
      findCampaignByUser().then(res => {
        vm.campaignsInfo = []
        if (res.data.code === 0) {
          vm.campaignsInfo.push({ campaignId: '', campaignName: '所有活动' })
          if (res.data.data.length > 0) {
            for (let i = 0; i < res.data.data.length; i++) { // 返回值活动数组
              let flag = false// 初始化变量值为否
              for (let j = 0; j < vm.campaignsInfo.length; j++) { // 活动列表数组
                if (res.data.data[i].campaignId === vm.campaignsInfo[j].campaignId) { // 如果活动列表已经存在了返回值的数组id
                  flag = true
                  break
                }
              }
              if (!flag) { // 如果活动不存在，那么增加活动
                vm.campaignsInfo.push({
                  campaignId: res.data.data[i].campaignId,
                  campaignName: res.data.data[i].campaignName
                })
              }
            }
          }
        } else {
          vm.campaignsInfo.push({ campaignId: '', campaignName: '所有活动' })
        }
      })
      // this.req = this.$store.state.dialTask.req
      this.$root.eventHub.$on('NAVBAR', (str) => {
        if (str === 'transfer') {
          if (vm.customerPhone === '' || vm.isBlacklist === '') {
            Message({
              message: '页面还未加载完全，请稍后...',
              type: 'error',
              duration: 2 * 1000
            })
            this.$root.eventHub.$emit('DISABLED_DIAL', '')
          } else {
            if (vm.customerPhone === localStorage.getItem('agentId')) {
              Message({
                message: '坐席号码和客户号码一样，请核对...',
                type: 'error',
                duration: 2 * 1000
              })
              return
            }
            vm.dialTo(vm.taskId, vm.campaignId, vm.isBlacklist, vm.customerPhone)
          }
        }
      })
      vm.$root.eventHub.$on('dialTrue', (str) => {
        if (str === '1') {
          vm.hideDialTo = false
        } else {
          vm.hideDialTo = true
        }
      })
    })
  },
  // 离开时清除定时器
  destroyed: function() {
    this.customerNote = ''
    this.products = []
    this.sumTotal = 0
    this.sumInfo = new Map()
    clearInterval(this.interval)
    localStorage.removeItem('global_taskId')
    this.sendMessageToNavbar(true)
    this.$root.eventHub.$emit('DISABLED_DIAL', '')
    // this.$store.dispatch('setReq', this.req)
    this.$root.eventHub.$off('NAVBAR')
  }
}
</script>

