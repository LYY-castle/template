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
                  v-model.trim="distributeTimeValue"
                  type="datetimerange"
                  range-separator="-"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
          </el-form-item>&nbsp;&nbsp;
          <el-form-item label="预约时间：">
              <el-date-picker
                  v-model.trim="appointTimeValue"
                  type="datetimerange"
                  range-separator="-"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
          </el-form-item>
          <el-form-item label="操作时间：">
            <el-date-picker
                  v-model.trim="modifyTimeValue"
                  type="datetimerange"
                  range-separator="-"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
          </el-form-item>
            <el-form-item label="任务状态：">
              <el-select v-model="req.status" placeholder="请选择"  style="width:6em">
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
            <el-select v-model="req.staffId"  style="width:10em">
              <el-option label="全部" :value="agentsId"></el-option>
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
            fixed
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
            fixed="right"
            width="180">
          <template slot-scope="scope">
            <a class="icofont-phone" style="font-size:22px;color:grey;" v-if="!phoneCanDial" title="请先登录话机并置为示忙"></a>
            <a class="icofont-phone" style="font-size:22px;color:grey;" title="只有首拨或预约状态能拨打" v-else-if="!showStatus(scope.row.status)" href="javascript:void(0)" size="small" type="text"></a>
            <a class="icofont-phone" style="font-size:22px;color:grey;" title="只能拨打属于自己的客户" v-else-if="scope.row.staffId !== aId"  href="javascript:void(0)" size="small" type="text"></a>
            <a class="icofont-phone" style="font-size:22px;color:grey;" title="该号码为免访客户" v-else-if="!checkBlacklist(scope.row.isBlacklist)"  href="javascript:void(0)" size="small" type="text"></a>
            <a class="icofont-phone" style="font-size:22px;color:grey;" title="该号码处于免访号段中" v-else-if="!checkNodisturb(scope.row.isNodisturb)"  href="javascript:void(0)" size="small" type="text"></a>
            <a class="icofont-phone" style="font-size:22px;" title="拨打"  v-else @click="autoCallDial=false;sumTotal=0;products=[];customerNote='';changeToCustomerDetail(scope.row.taskId,scope.row.campaignId,scope.row.customerId,scope.row.isBlacklist,scope.row.customerPhone);keepReady=true;dialTo(scope.row.taskId,scope.row.campaignId,scope.row.isBlacklist,scope.row.customerPhone);" size="small" type="text"></a>
            <a class="icofont-wechat" style="font-size:22px;color:grey;" title="系统不支持微信功能" v-if="show_wechat==='false'" href="javascript:void(0)" size="small" type="text"></a>
            <a class="icofont-wechat" style="font-size:22px;color:grey;" title="该客户未绑定微信" v-else-if="checkBindWechat(scope.row.customerId)" href="javascript:void(0)" size="small" type="text"></a>
            <a class="icofont-wechat" style="font-size:22px;color:grey;" title="只有首拨或预约才能联系" v-else-if="!showStatus(scope.row.status)" href="javascript:void(0)" size="small" type="text"></a>
            <a class="icofont-wechat" style="font-size:22px;" title="微信聊天" v-else @click="toChatPage(scope.row.taskId, scope.row.campaignId, scope.row.customerId, scope.row.customerName, scope.row.customerPhone)" size="small" type="text"></a>
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
  <div class="dial-task" v-else :style="autoStyle" ref="dialtask">
    <div class="table-container" style="margin-top:0;">
      <b class="font14">客户信息</b>
      <div style="display:inline-block;position:relative;top:3px;margin-left:10px;">
        <!-- <img ref="dialButton" v-if="!hideDialTo" style="height:16px;cursor:pointer;" src="../../../static/images/dial_normal.png" alt="拨打" @click="dialTo(taskId,campaignId,isBlacklist,customerPhone)"> -->
        <!-- <img v-if="hideDialTo" style="height:16px;cursor:disable;" src="../../../static/images/dial_disable.png" alt="拨打"> -->
        <el-button :disabled="checkBindWechat(telCustomerInfos.customerId)" @click="toWeChat" class="wechat-btn" type="text" v-if="show_wechat==='true'"><svg-icon icon-class="wechat" class="icon-size" style="width:20px;height:16px;"/></el-button>
      </div>
      <el-row class="customerinfo-container">
        <el-col :span="8" class="font12 description-hide" v-for="(item,index) in customerColumnInfos" v-if="!(item === 'city' || item === 'district')">
          <span>
            {{showCustomerColumnName(item)}}
          </span>
          <el-popover trigger="hover" placement="bottom" :content="showCustomerColumnValue(item)">
            <b style="color:#020202;" :class="item" slot="reference">{{showCustomerColumnValue(item)}}</b>
          </el-popover>
          <el-input size="mini" style="width:45%;display:none;" :class="item" :id="item+'input'" v-if="showInputInfo(item)" v-model="customerVmodels[item]"></el-input>&nbsp;&nbsp;
          <el-radio-group v-model="customerVmodels[item]" style="display:none;" :class="item" v-if="item === 'customerSex'">
            <el-radio :label="0">
              <span style="font-size:12px;">男</span>
            </el-radio>
            <el-radio :label="1">
              <span style="font-size:12px;">女</span>
            </el-radio>
          </el-radio-group>
          <el-radio-group v-model="customerVmodels[item]" style="display:none;" :class="item" v-if="item === 'isMarried'">
            <el-radio :label="1">
              <span style="font-size:12px;">是</span>
            </el-radio>
            <el-radio :label="0">
              <span style="font-size:12px;">否</span>
            </el-radio>
          </el-radio-group>
          <el-date-picker
            size="mini"
            style="display:none;"
            v-if="item === 'birthday'"
            :class="item"
            v-model="customerVmodels[item]"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
          <el-select v-model="customerVmodels.provinceCode" placeholder="省" @change="getCities(customerVmodels.provinceCode)" v-if="item === 'province'" style="display:none;width:85px;" :class="item" size="mini">
            <el-option
              v-for="(province,index) in provinces"
              :key="province.id"
              :value="province.regionCode"
              :label="province.regionName"
            ></el-option>
          </el-select>
          <el-select v-model="customerVmodels.cityCode" placeholder="市" @change="getDistricts(customerVmodels.cityCode)" v-if="item === 'province'" style="display:none;width:85px;" :class="item" size="mini">
            <el-option
              v-for="(city,index) in cities"
              :key="city.id"
              :value="city.regionCode"
              :label="city.regionName"
            ></el-option>
          </el-select>
          <el-select v-model="customerVmodels.districtCode" placeholder="县" v-if="item === 'province'" style="display:none;width:85px;" :class="item" size="mini">
            <el-option
              v-for="(district,index) in districts"
              :key="district.id"
              :value="district.regionCode"
              :label="district.regionName"
            ></el-option>
          </el-select>
          <i class="el-icon-circle-check-outline" @click="modifyCustomerInfo(customerInfo.customerId,customerInfo.linkId,customerInfo.addressId,customerInfo.carinfoId,item,index)" style="cursor:pointer;display:none;" :id="item+'btn1'"></i>
          <i class="el-icon-circle-close-outline" @click="cancelEdit(item)" style="cursor:pointer;display:none;" :id="item+'btn2'"></i>
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
    <el-row type="flex" v-if="hasProductInfo && campaignType === 'MARKETING'">
      <el-col class="table-container" style="width:60.1%;margin:15px auto 15px 0px;">
        <b class="font14">产品信息</b>
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
      </el-col>
      <el-col class="table-container" style="padding:20px 0;width:38.4%;float:right;margin: 15px 0px 15px auto">
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
    <!-- 当活动类型是服务活动时 展示问卷 -->
    <el-row type="flex" v-if="campaignType === 'SERVICE'">
      <el-col class="table-container">
        <b class="font14">问卷信息</b>
        <el-tabs v-model="tabs_questionnaire">
          <el-tab-pane v-for="(item,index) in questionnaireTabs" :key="item.id" :label="item.name" :name="index+''">
            <el-container>
              <el-container style="margin-left:60px">
                  <!-- <div class="title-content-detail">
                    <span>{{item.name}}&nbsp;
                    </span><br/>
                  </div> -->
                  <!-- <div class="survey-desc">
                    <div class="desc-content">欢迎参加调查！答卷数据仅用于统计分析，请放心填写。题目选项无对错之分，按照实际情况选择即可。感谢您的帮助！</div>
                  </div> -->
                  <div class="quest-box">
                      <el-form size="small" :model="answerData[index]">
                          <div style="margin-top:-8px">
                            <el-form-item v-for="(item1,index1) in item.titles" :key="index1">
                              <div class="topic-type-content">
                                <span>{{index1+1}}.</span>
                                <span placeholder="标题" style="width:300px">{{item1.name}}</span>

                              <!-- 单选 -->
                                  <div class="options" v-if="item1.type===0">
                                    <el-radio-group v-model="answerData[index][item1.id]">
                                      <el-radio
                                        v-for="(a, radioIndex) in item1.options"
                                        :key="radioIndex"
                                        :label="a.content"
                                        v-model="a.content"></el-radio>
                                    </el-radio-group>
                                  </div>

                                <!-- 多选 -->
                                <div v-else-if="item1.type===1">
                                  <el-checkbox-group v-model="answerData[index][item1.id]">
                                    <el-checkbox
                                      v-for="(a,checkboxIndex) in item1.options"
                                      :label="a.content"
                                      :key="checkboxIndex"></el-checkbox>
                                  </el-checkbox-group>
                                </div>

                                <!-- 单行 -->
                                <div v-else-if="item1.type===2">
                                  <el-input
                                    v-model="answerData[index][item1.id]"
                                    type="text"
                                    clearable
                                    style="width:478px;margin:2px"
                                    maxlength="45"></el-input>
                                </div>

                                <!-- 多行 -->
                                <div v-else-if="item1.type===3">
                                  <el-input
                                    v-model="answerData[index][item1.id]"
                                    type="textarea"
                                    rows="4"
                                    resize="none"
                                    style="width:478px;margin:2px"
                                    maxlength="45" ></el-input>
                                </div>
                              </div>
                            </el-form-item>
                          </div>
                      </el-form>
                  </div>
                  <!-- <div class="lastbuttons" >
                    <div style="margin-top:8px">
                      <el-button type="primary" size="small" @click="">完成</el-button>
                    </div>
                  </div> -->
              </el-container>
            </el-container>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <el-row class="table-container task-status" style="margin-bottom:20px;">
      <el-row>
        <el-form :inline="true" size="mini">
          <el-col :span="7" style="height:48px;">
            <el-form-item label="话后小结：" style="margin-bottom:12px;" :rules="{required:true}">
              <div>
                <el-cascader
                  size="mini"
                  placeholder="请选择小结"
                  v-model='selectedSummarys'
                  :options="nodulesTree"
                  filterable
                  :props="summaryTreeProps"
                  @change="handleNoduleChange">
                </el-cascader>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="7" v-show="this.selectedSummarys[0] === '3'">
            <span style="color:red;line-height:34px;">*</span>
            <el-form-item label="预约日期：" class="working-date-form">
              <b style="font-size: 16px;color: #333333;letter-spacing: 0;text-align: left;">T + </b>
              <el-input style="width:70px" type="text" v-model="addDays" onkeyup="if(! /^d+$/.test(this.addDays)){this.addDays='0';}"></el-input>
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
          <el-col :span="4" style="height:48px;line-height:30px;" v-if="showSendMessage === true && campaignType !== 'RECRUIT' && hasProductInfo === true">
            <el-checkbox v-model="sendMessage" checked="checked">发送支付短信</el-checkbox>
          </el-col>
          <el-col :span="5" style="height:48px;line-height:34px;" v-if="showAutoDial===true && !autoCallDial">
            <el-checkbox checked="checked" v-model="autoDialNext">完成后继续拨打下一个客户</el-checkbox>
          </el-col>
          <el-col :span="5" style="height:48px;line-height:34px;" v-if="autoCallDial">
            <el-checkbox checked="checked" v-model="autoCalllNext">完成后继续自动外呼</el-checkbox>
          </el-col>
          <!-- <el-col :span="5" style="height:48px;line-height:30px;"> -->
            <!-- <el-checkbox checked="checked" v-model="keepReady">完成后为就绪状态</el-checkbox> -->
            <!-- <div style="display:inline-block;">
              <el-switch
                v-model="keepReady"
                active-text="完成后为就绪状态"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
            </div> -->
          <!-- </el-col> -->
        </el-form>
      </el-row>
      <el-row>
        <el-form>
          <el-form-item>
            <el-col :span="16">
              <b class="font12" style="color:#020202;">小结备注：</b>
              <el-input
                type="textarea"
                :maxlength="100"
                :autosize="{ minRows: 4, maxRows: 6}"
                v-model="summary_description">{{summary_description}}
              </el-input>
            </el-col>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <div style="text-align:center">
          <!-- <el-button plain type="primary" size="small" @click="returnList();customerNote='';sumTotal=0;products=[];resetReview();" style="margin-right:40px;">返回</el-button> -->
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
  .description-hide{
    text-overflow: ellipsis;
    white-space:nowrap;
    overflow: hidden;
  }
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
  .title-content-detail {
    height: 64px;
    font-size: 25px;
    text-align: center;
    line-height: 48px;
    border: 1px solid #dbdbdb;
    position: relative;
    outline: 0;
  }
  .quest-box {
    margin: 4px 0;
    width: 100%;
    // min-height: 550px;
  }
  .lastbuttons {
    border: 1px solid #dbdbdb;
    margin-top: 4px 0;
    width: 100%;
    text-align: center;
    height: 50px;
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
import { formatDateTime, clone } from '@/utils/tools' // 格式化时间
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
  addMoreOrder,
  modifyProduct,
  editCustomerBasic,
  editCustomerCar,
  addCustomerCar,
  editCustomerLink,
  editCustomerAddress,
  addCustomerAddress,
  getRegion
} from '@/api/dialTask' // 接口
import { departAgents, getDepartId } from '@/api/ctiReport'
import { permsDepart, permsStaff } from '@/api/reportPermission'
import { getWechatCustomer } from '@/api/wechat_list'
import { queryOneQuestionnaire, generateQuestionnaireRecord } from '@/api/questionnaire'
import { getLocalPhonePrefix, getNonLocalPhonePrefix } from '@/config/phone_config_codes'
import { findNoduleByNoduleId } from '@/api/nodule_list'
var vm = null

export default {
  name: 'my_dial_task',

  data() {
    return {
      provinces: [],
      cities: [],
      districts: [],
      addAddress: false, // 用来判断是增加地址或是修改地址的标志
      addCar: false, // 用来判断是增加车辆或是修改修改的标志
      customerVmodels: {},
      allCustomerParams: {
        customerName: ''
      },
      summaryType: '',
      phoneCanDial: false, // 话机是否允许拨号
      autoStyle: {}, // 控制窗口大小，动态出现滚动条，用于点击完成之后，置顶功能
      customerPhones: [], // 快速拨打号码
      distributeTimeValue: null,
      modifyTimeValue: null,
      appointTimeValue: null,
      answerData: [], // 所有问卷的填写记录
      tabs_questionnaire: '0',
      questionnaireTabs: [], // 所有需要展示的问卷模板
      // keepReady: true,
      autoCallDial: false, // 自动外呼
      reViewAutoCallDial: false, // 自动外呼
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
      tempProducts: [], // 用来回显切换页面时的缓存
      productNums: [], // 活动下的产品库存
      isRecruit: false,
      addDays: '',
      reViewAddDays: '', // 回显天数
      summariesInfo: [], // 小结下拉选择
      campaignsInfo: [], // 活动下拉选择
      taskStatusOptions: [
        {
          // 任务状态选项框
          value: '',
          label: '全部'
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
        customerId: ''
      },
      editCarInfo: {
        carinfoId: ''
      },
      editLinkInfo: {
        linkId: ''
      },
      editAddressInfo: {
        addressId: ''
      },
      interval: null,
      canContact: 1,
      hideDialTo: false, // 判断超出拨打次数限制时是否将图标置灰
      isLastContactTime: false, // 判断是否是最后一次拨打次数
      isDialTask: true, // 判断是进入哪个界面  true为拨打任务  false为 拨打任务详情
      campaignType: '', // 活动类型
      reViewCampaignType: '', // 活动类型
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
      appointTime: '', // 预约时间
      reViewAppointTime: '', // 回显预约时间
      hasProductInfo: false, // 是否有产品的标志
      productInfo: [], // 需要展示的产品的id
      selectedProduct: {}, // 选中的需要生成的产品信息
      productDetailId: '', // 新建/生成产品详细id
      order_Params: {}, // 即将生成订单的参数
      activeTab: '', // 产品展示项
      showAutoDial: false, // 是否展示自动拨打下一个
      reViewShowAutoDial: false, // 是否展示自动拨打下一个
      autoDialNext: true, // 完成后自动拨打下一个
      autoCalllNext: true, // 是否继续自动外呼
      showSendMessage: false, // 是否展示发送支付短信
      reViewShowSendMessage: false, // 是否展示发送支付短信
      sendMessage: true, //  发送支付短信checkbox
      reViewSendMessage: false, // 回显支付短信发送
      nodulesTree: [], // 需要展示的小结树 数据
      summaryTreeProps: {
        children: 'summaryDetailInfos',
        label: 'name',
        value: 'id'
      },
      selectedSummarys: [], // 选中的小结id
      reViewSelectedSummarys: [], // 回显选中的小结
      summary_description: '', // 小结备注
      // 查询条件
      req: {
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
        address: '',
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
  // computed: {
  //   keepReady() {
  //     return this.$store.state.ctiData.keepReady
  //   }
  // },
  methods: {
    getCities(parentid) {
      getRegion(parentid).then(res => {
        if (res.data.code === 0) {
          this.customerVmodels.cityCode = ''
          this.customerVmodels.districtCode = ''
          this.cities = res.data.data
          if (res.data.data[0].regionLevel === 2 && res.data.data.length === 1) {
            this.customerVmodels.cityCode = res.data.data[0].regionCode
            this.getDistricts(res.data.data[0].regionCode)
          }
        }
      })
    },
    getDistricts(parentid) {
      getRegion(parentid).then(res => {
        if (res.data.code === 0) {
          this.districts = res.data.data
          this.customerVmodels.districtCode = ''
        }
      })
    },
    showInputInfo(item) {
      if (item === 'customerName' || item === 'idNo' || item === 'linkValue' || item === 'score' || item === 'detail' ||
       item === 'remark' || item === 'nation' || item === 'nativePlace' || item === 'highestEducation' || item === 'height' ||
       item === 'weight' || item === 'carBrand' || item === 'carType' || item === 'licenseNo' || item === 'vinNo' || item === 'engineNo') {
        return true
      } else {
        return false
      }
    },
    cancelEdit(item) {
      this.customerVmodels = clone(this.customerInfo)
      this.customerVmodels.linkValue = this.customerPhone
      this.changeToInput(item)
    },
    changePhoneNum(phone) { // 改手机号为11位正常手机号
      let result = ''
      if (typeof phone === 'undefined' || phone === null || phone.trim() === '') return
      switch (phone.length) {
        case 12:
          if (phone.substring(0, 1) === getLocalPhonePrefix()) {
            result = phone.substring(1)
          } else {
            result = phone
          }
          break
        case 13:
          if (phone.substring(0, 2) === getNonLocalPhonePrefix()) {
            result = phone.substring(2)
          } else {
            result = phone
          }
          break
        default:
          result = phone
          break
      }
      return result
    },
    resetReview() { // 清空回显数据
      this.reViewAddDays = ''
      this.reViewAutoCallDial = false
      this.reViewCampaignType = ''
      this.reViewRadio = ''
      this.reViewAppointTime = ''
      this.reViewShowAutoDial = false
      this.reViewShowSendMessage = false
      this.reViewSendMessage = false
      this.reViewSelectedSummarys = []
      this.tempProducts = []
      this.summary_description = ''
    },
    changeKeepReady(val) {
      this.$store.commit('SET_KEEPREADY', val)
    },
    showCustomerColumnName(item) {
      switch (item) {
        case 'customerName': return '客户姓名：'
        case 'customerSex': return '性别：'
        case 'idNo': return '身份证：'
        case 'linkValue': return '手机号码：'
        case 'score': return '客户评分：'
        case 'province': return '地区：' // 这里由于省市县里 只要有省就要显示 因此取了province
        case 'detail': return '详细地址：'
        case 'remark': return '备注：'
        case 'birthday': return '出生年月：'
        case 'nation': return '民族：'
        case 'nativePlace': return '籍贯：'
        case 'highestEducation': return '最高学历：'
        case 'height': return '身高(cm)：'
        case 'weight': return '体重(kg)：'
        case 'isMarried': return '是否婚配：'
        case 'carBrand': return '车辆品牌：'
        case 'carType': return '车辆类型：'
        case 'licenseNo': return '车牌号：'
        case 'vinNo': return '车辆识别码：'
        case 'engineNo': return '发动机号：'
        default : return ''
      }
    },
    showCustomerColumnValue(item) {
      switch (item) {
        case 'customerName': return this.customerVmodels.customerName ? this.customerVmodels.customerName + '' : '未知'
        case 'customerSex': return this.customerVmodels.customerSex === 0 ? '男' : this.customerVmodels.customerSex === 1 ? '女' : '未知'
        case 'idNo': return this.customerVmodels.idNo ? this.customerVmodels.idNo + '' : '未知'
        case 'linkValue': return !this.customerVmodels.linkValue ? '' : this.customerVmodels.linkValue + ''
        case 'score': return this.customerVmodels.score === null ? '' : this.customerVmodels.score + ''
        case 'province': return this.customerVmodels.address ? this.customerVmodels.address + '' : '未知'
        case 'detail': return this.customerVmodels.detail ? this.customerVmodels.detail + '' : '未知'
        case 'remark': return this.customerVmodels.remark === null ? '未知' : this.customerVmodels.remark + ''
        case 'birthday': return this.customerVmodels.birthday === null ? '未知' : this.customerVmodels.birthday + ''
        case 'nation': return this.customerVmodels.nation === null ? '未知' : this.customerVmodels.nation + ''
        case 'nativePlace': return this.customerVmodels.nativePlace === null ? '未知' : this.customerVmodels.nativePlace + ''
        case 'highestEducation': return this.customerVmodels.highestEducation === null ? '未知' : this.customerVmodels.highestEducation + ''
        case 'height': return this.customerVmodels.height === null ? '未知' : this.customerVmodels.height + ''
        case 'weight': return this.customerVmodels.weight === null ? '未知' : this.customerVmodels.weight + ''
        case 'isMarried': return this.customerVmodels.isMarried === null ? '未知' : this.customerVmodels.isMarried === 0 ? '未婚' : '已婚'
        case 'carBrand': return this.customerVmodels.carBrand === null ? '未知' : this.customerVmodels.carBrand + ''
        case 'carType': return this.customerVmodels.carType === null ? '未知' : this.customerVmodels.carType + ''
        case 'licenseNo': return this.customerVmodels.licenseNo === null ? '未知' : this.customerVmodels.licenseNo + ''
        case 'vinNo': return this.customerVmodels.vinNo === null ? '未知' : this.customerVmodels.vinNo + ''
        case 'engineNo': return this.customerVmodels.engineNo === null ? '未知' : this.customerVmodels.engineNo + ''
        default : return ''
      }
    },
    handleChangeAcitve(active = ['1']) {
      if (active.length) {
        $('.form-more').text('收起')
      } else {
        $('.form-more').text('更多')
      }
    },
    // 判断客户是否绑定微信公众号
    checkBindWechat(customerId) {
      const customerInfos = JSON.stringify(this.customerInfos)
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
      this.$router.push({
        path: process.env.BUILT_IN_ROUTERS.wechatDial,
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
    // 状态首拨和预约才能拨打
    showStatus(status) {
      return status === '1' || status === '0'
    },
    // 检查是否为免访号码
    checkBlacklist(isBlacklist) {
      return isBlacklist === '0'
    },
    // 检查是否为免访号段
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
        this.$message({
          message: '请先登录话机！',
          type: 'error',
          duration: 1000
        })
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
                      vm.isLastContactTime = true
                      queryOneTask(taskId).then(response1 => {
                        if (response1.data.code === 0) {
                          if (
                            response1.data.data.status === '2' ||
                        response1.data.data.status === '3'
                          ) {
                            vm.$message({
                              message: '该拨打任务已结束！',
                              type: 'error',
                              duration: 1000
                            })
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
                            vm.$message({
                              message: '该拨打任务已结束！',
                              type: 'error',
                              duration: 1000
                            })
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
                    vm.$message({
                      message: '超过拨打限制次数！',
                      type: 'error',
                      duration: 1000
                    })
                    return
                  }
                }
              })
            } else {
              vm.$message({
                message: '该号码在免访号段或黑名单中！',
                type: 'error',
                duration: 1000
              })
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
        const reasoncode = localStorage.getItem(localStorage.getItem('agentId')) ? JSON.parse(localStorage.getItem(localStorage.getItem('agentId'))).reasoncode : '-2'
        if (reasoncode === '-2' || reasoncode === '-3' || reasoncode === '-4' || reasoncode === '0' || reasoncode === '-100' || reasoncode === '-101' || reasoncode === '-5' || reasoncode === '-6') {
          this.$message({
            message: '请在示忙或后处理状态下拨打号码！',
            type: 'error',
            duration: 1000
          })
          return
        }
      }
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
            this.$message({
              message: '请重新登录话机！',
              type: 'error',
              duration: 1000
            })
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
          this.$message({
            message: '请重新登录话机！',
            type: 'error',
            duration: 1000
          })
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
    // 小结级联选择事件
    handleNoduleChange(arr) {
      if (arr[0] === '1') {
        this.showSendMessage = true
      } else if (arr[0] === '3') {
        this.showSendMessage = false
        this.addDays = '1'
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
      queryInfo.appointTimeEnd = this.appointTimeValue ? this.appointTimeValue[0] : null
      queryInfo.appointTimeStart = this.appointTimeValue ? this.appointTimeValue[1] : null
      queryInfo.contactStatus = req.contactStatus
      queryInfo.contactedNum = req.contactedNum
      queryInfo.customerName = req.customerName
      queryInfo.customerPhone = req.customerPhone
      queryInfo.distributeTimeEnd = this.distributeTimeValue ? this.distributeTimeValue[0] : null
      queryInfo.distributeTimeStart = this.distributeTimeValue ? this.distributeTimeValue[1] : null
      queryInfo.modifyTimeEnd = this.modifyTimeValue ? this.modifyTimeValue[0] : null
      queryInfo.modifyTimeStart = this.modifyTimeValue ? this.modifyTimeValue[1] : null
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
      this.req.customerName = ''
      this.req.customerPhone = ''
      this.req.pageNo = this.pageInfo.pageNo
      this.req.pageSize = this.pageInfo.pageSize
      this.req.status = ''
      this.req.contactedNum = ''
      this.req.summaryId = ''
      this.req.campaignId = ''
      this.distributeTimeValue = null
      this.modifyTimeValue = null
      this.appointTimeValue = null
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
          this.customerPhones.push(val[i].customerPhone)
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
            // this.recordId = ''
            vm.activeTab = ''
            vm.canContact = 1
            vm.addDays = '0'
            vm.summary_description = vm.summary_description ? vm.summary_description : ''
            vm.appointTime = ''
            // vm.selectedSummarys = []
            vm.showDetailInfos(taskId, campaignId, customerId, isBlacklist, customerPhone)
            vm.sendMessageToNavbar(vm.isDialTask)
            sessionStorage.setItem('isDialTask', vm.isDialTask)
          } else {
            if (vm.isDialTask && customerPhone === '') { // 说明是刷新页面的问题

            } else {
              vm.$message({
                message: '该客户在黑名单或免访号段中,无法拨打!',
                type: 'error',
                duration: 1000
              })
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
      if (!this.phoneCanDial) {
        this.$message({
          message: '电话只有在示忙状态下才可以拨号！',
          type: 'error',
          duration: 1000
        })
        return
      }
      if (this.taskIds.length === 0) {
        this.$message({
          message: '您还未选中任务，或选中的任务未包含可拨打客户!',
          type: 'error',
          duration: 1000
        })
      } else {
        sessionStorage.setItem('quickDialto', true)
        this.autoCallDial = false// 退出自动外呼
        this.taskId = this.taskIds[0]
        this.campaignId = this.campaignIds[0]
        this.isBlacklist = this.isBlacklists[0]
        this.customerId = this.customerIds[0]
        this.customerPhone = this.customerPhones[0]
        sessionStorage.setItem('setDetails', JSON.stringify({ 'taskIds': this.taskIds, 'campaignIds': this.campaignIds, 'isBlacklists': this.isBlacklists, 'customerIds': this.customerIds }))
        // this.$store.dispatch('setDetails', [this.taskIds, this.campaignIds, this.isBlacklists, this.customerIds])
        this.canContact = 1
        this.addDays = '0'
        this.showDetailInfos(
          this.taskIds[0],
          this.campaignIds[0],
          this.customerIds[0],
          this.isBlacklists[0],
          this.customerPhones[0]
        )
        this.dialTo(this.taskIds[0], this.campaignIds[0], this.isBlacklists[0], this.customerPhones[0])
        if (this.taskIds.length > 1) {
          this.showAutoDial = true
        }
        this.activeTab = ''
        this.activeNames = ['1', '2', '3', '4']
        this.autoDialNext = false
        this.showSendMessage = false
        this.isLastContactTime = false
        this.recordId = ''
        this.summary_description = vm.summary_description ? vm.summary_description : ''
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
        case 'customerName':$('div.customerName').toggle(); $('b.customerName').toggle(); $('#customerNameedit').toggle(); $('#customerNamebtn1').toggle(); $('#customerNamebtn2').toggle(); break
        case 'customerSex': $('div.customerSex').toggle(); $('b.customerSex').toggle(); $('#customerSexedit').toggle(); $('#customerSexbtn1').toggle(); $('#customerSexbtn2').toggle(); break
        case 'idNo': $('div.idNo').toggle(); $('b.idNo').toggle(); $('#idNoedit').toggle(); $('#idNobtn1').toggle(); $('#idNobtn2').toggle(); break
        case 'score': $('div.score').toggle(); $('b.score').toggle(); $('#scoreedit').toggle(); $('#scorebtn1').toggle(); $('#scorebtn2').toggle(); break
        case 'remark': $('div.remark').toggle(); $('b.remark').toggle(); $('#remarkedit').toggle(); $('#remarkbtn1').toggle(); $('#remarkbtn2').toggle(); break
        case 'linkValue': $('div.linkValue').toggle(); $('b.linkValue').toggle(); $('#linkValueedit').toggle(); $('#linkValuebtn1').toggle(); $('#linkValuebtn2').toggle(); break
        case 'province': $('div.province').toggle(); $('b.province').toggle(); $('#provinceedit').toggle(); $('#provincebtn1').toggle(); $('#provincebtn2').toggle(); break
        case 'detail': $('div.detail').toggle(); $('b.detail').toggle(); $('#detailedit').toggle(); $('#detailbtn1').toggle(); $('#detailbtn2').toggle(); break
        case 'birthday': $('div.birthday').toggle(); $('b.birthday').toggle(); $('#birthdayedit').toggle(); $('#birthdaybtn1').toggle(); $('#birthdaybtn2').toggle(); break
        case 'nation': $('div.nation').toggle(); $('b.nation').toggle(); $('#nationedit').toggle(); $('#nationbtn1').toggle(); $('#nationbtn2').toggle(); break
        case 'nativePlace':$('div.nativePlace').toggle(); $('b.nativePlace').toggle(); $('#nativePlaceedit').toggle(); $('#nativePlacebtn1').toggle(); $('#nativePlacebtn2').toggle(); break
        case 'highestEducation': $('div.highestEducation').toggle(); $('b.highestEducation').toggle(); $('#highestEducationedit').toggle(); $('#highestEducationbtn1').toggle(); $('#highestEducationbtn2').toggle(); break
        case 'height': $('div.height').toggle(); $('b.height').toggle(); $('#heightedit').toggle(); $('#heightbtn1').toggle(); $('#heightbtn2').toggle(); break
        case 'weight':$('div.weight').toggle(); $('b.weight').toggle(); $('#weightedit').toggle(); $('#weightbtn1').toggle(); $('#weightbtn2').toggle(); break
        case 'isMarried': $('div.isMarried').toggle(); $('b.isMarried').toggle(); $('#isMarriededit').toggle(); $('#isMarriedbtn1').toggle(); $('#isMarriedbtn2').toggle(); break
        case 'carBrand': $('div.carBrand').toggle(); $('b.carBrand').toggle(); $('#carBrandedit').toggle(); $('#carBrandbtn1').toggle(); $('#carBrandbtn2').toggle(); break
        case 'carType': $('div.carType').toggle(); $('b.carType').toggle(); $('#carTypeedit').toggle(); $('#carTypebtn1').toggle(); $('#carTypebtn2').toggle(); break
        case 'licenseNo': $('div.licenseNo').toggle(); $('b.licenseNo').toggle(); $('#licenseNoedit').toggle(); $('#licenseNobtn1').toggle(); $('#licenseNobtn2').toggle(); break
        case 'vinNo': $('div.vinNo').toggle(); $('b.vinNo').toggle(); $('#vinNoedit').toggle(); $('#vinNobtn1').toggle(); $('#vinNobtn2').toggle(); break
        case 'engineNo': $('div.engineNo').toggle(); $('b.engineNo').toggle(); $('#engineNoedit').toggle(); $('#engineNobtn1').toggle(); $('#engineNobtn2').toggle(); break
      }
    },
    changeLocationValue(v, arr) {
      const obj = arr.find((item) => {
        return item.regionCode === v
      })
      return obj.regionName
    },
    modifyCustomerInfo(customerId, linkId, addressId, carinfoId, item, index) {
      const reg_ID = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      const reg_phone = /^[1][3,4,5,6,7,8][0-9]{9}$/
      this.editCustomerInfo = {}
      this.editCarInfo = {}
      this.editAddressInfo = {}
      this.editLinkInfo = {}
      this.editCustomerInfo.customerId = customerId
      this.editLinkInfo.customerId = customerId
      this.editLinkInfo.linkId = linkId
      this.editAddressInfo.customerId = customerId
      this.editAddressInfo.addressId = addressId
      this.editCarInfo.customerId = customerId
      this.editCarInfo.carinfoId = carinfoId
      switch (item) {
        case 'customerName':
          if (this.isEmpty(this.customerVmodels.customerName)) {
            this.$message.error('客户姓名不能为空！')
            this.cancelEdit(item)
            return
          }
          this.editCustomerInfo.customerName = this.customerVmodels.customerName
          this.editCustomerBasicInfo(this.editCustomerInfo, item, '客户姓名')
          break
        case 'customerSex':
          if (this.customerVmodels.customerSex === null || this.isEmpty(this.customerVmodels.customerSex)) {
            this.$message.error('请选择客户性别！')
            this.cancelEdit(item)
            return
          }
          this.editCustomerInfo.customerSex = this.customerVmodels.customerSex
          this.editCustomerBasicInfo(this.editCustomerInfo, item, '客户性别')
          break
        case 'idNo':
          if (!reg_ID.test(this.customerVmodels.idNo)) {
            this.$message.error('请输入正确的身份证号！')
            this.cancelEdit(item)
            return
          }
          this.editCustomerInfo.idNo = this.customerVmodels.idNo
          this.editCustomerBasicInfo(this.editCustomerInfo, item, '身份证')
          break
        case 'linkValue':
          if (this.isEmpty(this.customerVmodels.linkValue) || !reg_phone.test(this.customerVmodels.linkValue)) {
            this.$message.error('请输入正确的手机号码！')
            this.cancelEdit(item)
            return
          }
          this.editLinkInfo.linkValue = this.customerVmodels.linkValue
          this.editLinkInfo.linkType = 0
          this.editCustomerLinkInfo(this.editLinkInfo, item, '手机号码')
          break
        case 'province':
          this.editAddressInfo.province = this.customerVmodels.provinceCode
          this.editAddressInfo.city = this.customerVmodels.cityCode
          this.editAddressInfo.district = this.customerVmodels.districtCode
          this.editAddressInfo.addressType = 1
          if (!this.addAddress) {
            editCustomerAddress(this.editAddressInfo).then(res => {
              if (res.data.code === 0) {
                this.$message.success('修改客户地址成功！')
                const province = this.changeLocationValue(this.editAddressInfo.province, this.provinces)
                const city = this.changeLocationValue(this.editAddressInfo.city, this.cities)
                const district = this.changeLocationValue(this.editAddressInfo.district, this.districts)
                this.customerInfo.provinceCode = this.customerVmodels.provinceCode
                this.customerInfo.cityCode = this.customerVmodels.cityCode
                this.customerInfo.districtCode = this.customerVmodels.districtCode
                this.customerInfo.address = province + city + district
                this.customerVmodels.address = province + city + district
                this.changeToInput(item)
              } else {
                this.$message.error('修改客户地址失败！')
                this.cancelEdit(item)
              }
            }).catch(error => {
              throw error
            })
          } else {
            // 增加客户地址
            this.editAddressInfo.isDefault = 1 // 设为默认地址
            addCustomerAddress(this.editAddressInfo).then(res => {
              if (res.data.code === 0) {
                this.addAddress = false
                this.customerInfo.addressId = res.data.message
                this.$message.success('修改客户地址成功！')
                const province = this.changeLocationValue(this.customerVmodels.provinceCode, this.provinces)
                const city = this.changeLocationValue(this.customerVmodels.cityCode, this.cities)
                const district = this.changeLocationValue(this.customerVmodels.districtCode, this.districts)
                this.customerInfo.provinceCode = this.customerVmodels.provinceCode
                this.customerInfo.cityCode = this.customerVmodels.cityCode
                this.customerInfo.districtCode = this.customerVmodels.districtCode
                this.customerInfo.address = province + city + district
                this.customerVmodels.address = province + city + district
                this.changeToInput(item)
              } else {
                this.$message.error('修改客户地址失败！')
                this.cancelEdit(item)
              }
            }).catch(error => {
              throw error
            })
          }
          break
        case 'detail':
          this.editAddressInfo.addressType = 1
          this.editAddressInfo.detail = this.customerVmodels.detail
          if (!this.addAddress) {
            editCustomerAddress(this.editAddressInfo).then(res => {
              if (res.data.code === 0) {
                this.$message.success('修改详细地址成功！')
                this.customerInfo.detail = this.customerVmodels.detail
                this.changeToInput(item)
              } else {
                this.$message.error('修改详细地址失败！')
                this.cancelEdit(item)
              }
            }).catch(error => {
              throw error
            })
          } else {
            // 增加客户地址
            this.editAddressInfo.isDefault = 1 // 设为默认地址
            addCustomerAddress(this.editAddressInfo).then(res => {
              if (res.data.code === 0) {
                this.addAddress = false
                this.customerInfo.addressId = res.data.message
                this.$message.success('修改详细地址成功！')
                this.customerInfo.detail = this.customerVmodels.detail
                this.changeToInput(item)
              } else {
                this.$message.error('修改详细地址失败！')
                this.cancelEdit(item)
              }
            }).catch(error => {
              throw error
            })
          }
          break
        case 'score':
          if (typeof (parseInt(this.customerVmodels.score)) !== 'number') {
            this.$message.error('客户评分只能为数字！')
            this.cancelEdit(item)
            return
          }
          if (isNaN(this.customerVmodels.score)) {
            this.$message.error('客户评分只能为数字！')
            this.cancelEdit(item)
            return
          }
          if (this.customerVmodels.score < 0) {
            this.$message.error('客户评分不能为负数！')
            this.cancelEdit(item)
            return
          }
          this.editCustomerInfo.score = this.customerVmodels.score
          this.editCustomerBasicInfo(this.editCustomerInfo, item, '客户评分')
          break
        case 'remark':
          this.editCustomerInfo.remark = this.customerVmodels.remark
          this.editCustomerBasicInfo(this.editCustomerInfo, item, '备注')
          break
        case 'birthday':
          this.editCustomerInfo.birthday = this.customerVmodels.birthday
          this.editCustomerBasicInfo(this.editCustomerInfo, item, '出生年月')
          break
        case 'nation':
          this.editCustomerInfo.nation = this.customerVmodels.nation
          this.editCustomerBasicInfo(this.editCustomerInfo, item, '民族')
          break
        case 'nativePlace':
          this.editCustomerInfo.nativePlace = this.customerVmodels.nativePlace
          this.editCustomerBasicInfo(this.editCustomerInfo, item, '籍贯')
          break
        case 'highestEducation':
          this.editCustomerInfo.highestEducation = this.customerVmodels.highestEducation
          this.editCustomerBasicInfo(this.editCustomerInfo, item, '最高学历')
          break
        case 'height':
          if (typeof (parseInt(this.customerVmodels.height)) !== 'number') {
            this.$message.error('身高只能为数字！')
            this.cancelEdit(item)
            return
          }
          if (isNaN(this.customerVmodels.height)) {
            this.$message.error('身高只能为数字！')
            this.cancelEdit(item)
            return
          }
          if (this.customerVmodels.height < 0) {
            this.$message.error('身高不能为负数！')
            this.cancelEdit(item)
            return
          }
          this.editCustomerInfo.height = this.customerVmodels.height
          this.editCustomerBasicInfo(this.editCustomerInfo, item, '身高')
          break
        case 'weight':
          if (typeof (parseInt(this.customerVmodels.weight)) !== 'number') {
            this.$message.error('体重只能为数字！')
            this.cancelEdit(item)
            return
          }
          if (isNaN(this.customerVmodels.weight)) {
            this.$message.error('体重只能为数字！')
            this.cancelEdit(item)
            return
          }
          if (this.customerVmodels.weight < 0) {
            this.$message.error('体重不能为负数！')
            this.cancelEdit(item)
            return
          }
          this.editCustomerInfo.weight = this.customerVmodels.weight
          this.editCustomerBasicInfo(this.editCustomerInfo, item, '体重')
          break
        case 'isMarried':
          this.editCustomerInfo.isMarried = this.customerVmodels.isMarried
          this.editCustomerBasicInfo(this.editCustomerInfo, item, '')
          break
        case 'carBrand':
          this.editCarInfo.carBrand = this.customerVmodels.carBrand
          if (!this.addCar) {
            this.editCustomerCarInfo(this.editCarInfo, item, '车辆品牌')
          } else {
            // 增加车辆信息
            addCustomerCar(this.editCarInfo).then(res => {
              if (res.data.code === 0) {
                this.addCar = false
                this.customerInfo.carinfoId = res.data.message
                this.$message.success('修改车辆品牌成功！')
                this.$set(this.customerInfo, item, this.customerVmodels[item])
                this.changeToInput(item)
              } else {
                this.$message.error('修改车辆品牌失败！')
                this.cancelEdit(item)
              }
            })
          }
          break
        case 'carType':
          this.editCarInfo.carType = this.customerVmodels.carType
          if (!this.addCar) {
            this.editCustomerCarInfo(this.editCarInfo, item, '车辆类型')
          } else {
            // 增加车辆信息
            addCustomerCar(this.editCarInfo).then(res => {
              if (res.data.code === 0) {
                this.addCar = false
                this.customerInfo.carinfoId = res.data.message
                this.$message.success('修改车辆类型成功！')
                this.$set(this.customerInfo, item, this.customerVmodels[item])
                this.changeToInput(item)
              } else {
                this.$message.error('修改车辆类型失败！')
                this.cancelEdit(item)
              }
            })
          }
          break
        case 'licenseNo':
          this.editCarInfo.licenseNo = this.customerVmodels.licenseNo
          if (!this.addCar) {
            this.editCustomerCarInfo(this.editCarInfo, item, '车牌号')
          } else {
            // 增加车辆信息
            addCustomerCar(this.editCarInfo).then(res => {
              if (res.data.code === 0) {
                this.addCar = false
                this.customerInfo.carinfoId = res.data.message
                this.$message.success('修改车牌号成功！')
                this.$set(this.customerInfo, item, this.customerVmodels[item])
                this.changeToInput(item)
              } else {
                this.$message.error('修改车牌号失败！')
                this.cancelEdit(item)
              }
            })
          }
          break
        case 'vinNo':
          this.editCarInfo.vinNo = this.customerVmodels.vinNo
          if (!this.addCar) {
            this.editCustomerCarInfo(this.editCarInfo, item, '车辆识别码')
          } else {
            // 增加车辆信息
            addCustomerCar(this.editCarInfo).then(res => {
              if (res.data.code === 0) {
                this.addCar = false
                this.customerInfo.carinfoId = res.data.message
                this.$message.success('修改车辆识别码成功！')
                this.$set(this.customerInfo, item, this.customerVmodels[item])
                this.changeToInput(item)
              } else {
                this.$message.error('修改车辆识别码失败！')
                this.cancelEdit(item)
              }
            })
          }
          break
        case 'engineNo':
          this.editCarInfo.engineNo = this.customerVmodels.engineNo
          if (!this.addCar) {
            this.editCustomerCarInfo(this.editCarInfo, item, '发动机号')
          } else {
            // 增加车辆信息
            addCustomerCar(this.editCarInfo).then(res => {
              if (res.data.code === 0) {
                this.addCar = false
                this.customerInfo.carinfoId = res.data.message
                this.$message.success('修改发动机号成功！')
                this.$set(this.customerInfo, item, this.customerVmodels[item])
                this.changeToInput(item)
              } else {
                this.$message.error('修改发动机号失败！')
                this.cancelEdit(item)
              }
            })
          }
          break
      }
    },
    isEmpty(obj) {
      if (typeof (obj) === 'undefined' || obj === null || obj === '') {
        return true
      } else {
        return false
      }
    },
    editCustomerBasicInfo(data, item, msg) {
      editCustomerBasic(data).then(res => {
        if (res.data.code === 0) {
          this.$message.success({
            message: '修改' + msg + '成功！',
            type: 'success',
            duration: 1000
          })
          // this.customerInfo[item] = this.customerVmodels[item]
          this.$set(this.customerInfo, item, this.customerVmodels[item])
          this.changeToInput(item)
        } else {
          this.$message.success({
            message: '修改' + msg + '失败！',
            type: 'error',
            duration: 1000
          })
          this.cancelEdit(item)
        }
      }).catch(error => {
        throw error
      })
    },
    editCustomerCarInfo(data, item, msg) {
      editCustomerCar(data).then(res => {
        if (res.data.code === 0) {
          this.$message.success({
            message: '修改' + msg + '成功！',
            type: 'success',
            duration: 1000
          })
          // this.customerInfo[item] = this.customerVmodels[item]
          this.$set(this.customerInfo, item, this.customerVmodels[item])
          this.changeToInput(item)
        } else {
          this.$message.success({
            message: '修改' + msg + '失败！',
            type: 'error',
            duration: 1000
          })
          this.cancelEdit(item)
        }
      }).catch(error => {
        throw error
      })
    },
    editCustomerLinkInfo(data, item, msg) {
      editCustomerLink(data).then(res => {
        if (res.data.code === 0) {
          this.$message.success({
            message: '修改' + msg + '成功！',
            type: 'success',
            duration: 1000
          })
          // this.customerInfo[item] = this.customerVmodels[item]
          this.$set(this.customerInfo, item, this.customerVmodels[item])
          this.changeToInput(item)
        } else {
          this.$message.success({
            message: '修改' + msg + '失败！',
            type: 'error',
            duration: 1000
          })
          this.cancelEdit(item)
        }
      }).catch(error => {
        throw error
      })
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
        }
        this.questionnaireTabs = []
        this.answerData = []
        //  判断是否需要查询问卷
        if (res1.data.code === 0 && res1.data.data.questionnaireIds.length > 0) {
          // 循环查询
          for (let j = 0; j < res1.data.data.questionnaireIds.length; j++) {
            queryOneQuestionnaire(res1.data.data.questionnaireIds[j]).then(response => {
              if (response.data) {
                if (response.data.code === 0) {
                  this.answerData.push({})
                  this.questionnaireTabs.push(response.data.data)
                  for (let k = 0; k < this.questionnaireTabs[j].titles.length; k++) {
                    if (this.questionnaireTabs[j].titles[k].type === 1) {
                      this.$set(this.answerData[j], this.questionnaireTabs[j].titles[k].id, [])
                    } else {
                      this.$set(this.answerData[j], this.questionnaireTabs[j].titles[k].id, '')
                    }
                  }
                }
              }
            })
          }
        }
        // 判断小结类型是呼入还是呼出
        findNoduleByNoduleId({ noduleId: res1.data.data.summaryId }).then(response => {
          if (response.data) {
            if (response.data.code === 0) {
              this.summaryType = response.data.data.summaryType
            }
          }
        })
      })
      // 获取客户信息
      queryCustomerInfo(customerId).then(res => {
        if (res.data.code === 0) {
          this.customerInfo = res.data.data
          this.idNumber = res.data.data.idNo
          const customerLinks = res.data.data.linkResultInfos
          const customerAddress = res.data.data.addressResultInfos
          const customerCars = res.data.data.carResultInfos
          if (customerLinks.length > 0) {
            for (var i = 0; i < customerLinks.length; i++) {
              if (customerLinks[i].linkType === 0 && customerLinks[i].isUsually === 1) {
                this.customerInfo.linkValue = customerLinks[i].linkValue
                this.customerPhone = customerLinks[i].linkValue
                this.customerInfo.linkId = customerLinks[i].linkId
              }
            }
          }
          if (customerAddress.length > 0) {
            this.addAddress = false
            // 原本有地址的情况
            for (var j = 0; j < customerAddress.length; j++) {
              if (customerAddress[j].isDefault === 1) {
                this.customerInfo.address = customerAddress[j].provinceName + customerAddress[j].cityName + customerAddress[j].districtName // 这里取出的地址是中文而非code
                this.customerInfo.provinceCode = customerAddress[j].province
                this.customerInfo.cityCode = customerAddress[j].city
                this.customerInfo.districtCode = customerAddress[j].district
                this.customerInfo.detail = customerAddress[j].detail
                this.customerInfo.addressId = customerAddress[j].addressId
                getRegion(0).then(res => {
                  if (res.data.code === 0) {
                    this.provinces = res.data.data
                  }
                })
                getRegion(this.customerInfo.provinceCode).then(res => {
                  if (res.data.code === 0) {
                    this.cities = res.data.data
                  }
                })
                getRegion(this.customerInfo.cityCode).then(res => {
                  if (res.data.code === 0) {
                    this.districts = res.data.data
                  }
                })
              }
            }
          } else {
            // 该客户没有存地址的情况
            this.addAddress = true
            this.customerInfo.provinceCode = ''
            this.customerInfo.cityCode = ''
            this.customerInfo.districtCode = ''
            this.customerInfo.address = ''
            getRegion(0).then(res => {
              if (res.data.code === 0) {
                this.provinces = res.data.data
              }
            })
          }
          if (customerCars.length > 0) {
            this.addCar = false
            // 原本有车辆信息的情况
            this.customerInfo.carinfoId = customerCars[0].carinfoId
            this.customerInfo.carBrand = customerCars[0].carBrand
            this.customerInfo.carType = customerCars[0].carType
            this.customerInfo.licenseNo = customerCars[0].licenseNo
            this.customerInfo.vinNo = customerCars[0].vinNo
            this.customerInfo.engineNo = customerCars[0].engineNo
          } else {
            // 客户没有车辆的情况
            this.addCar = true
          }
          this.customerVmodels = clone(this.customerInfo)
          this.customerVmodels.linkValue = this.customerPhone
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
              if (this.tempProducts.length < 1) { // tempProducts用来做缓存，最初没有缓存的时候，赋值返回来的参数
                this.tempProducts = res.data.data
              }
              this.productNums = []
              for (let i = 0; i < this.products.length; i++) {
                this.productNums.push(this.products[i].productNum)
                this.$set(this.products[i], 'number', (this.tempProducts[i].number && this.tempProducts[i].productId === this.products[i].productId) ? this.tempProducts[i].number : 0)// 如果有缓存，则给其赋值
              }
            }
          })
        }
      })
      // 根任务id获取小结
      getSummaries(taskId).then(res4 => {
        if (res4.data.code === 0 && res4.data.data.length > 0) {
          this.nodulesTree = res4.data.data
          this.selectedSummarys = this.reViewSelectedSummarys.length > 0 ? this.reViewSelectedSummarys : []
        }
      })
      this.isDialTask = false
      this.showSendMessage = this.reViewShowSendMessage
      this.campaignType = this.reViewCampaignType
      this.showAutoDial = this.reViewShowAutoDial
      this.autoCallDial = this.reViewAutoCallDial
      if (this.selectedSummarys && this.selectedSummarys[0] === '3') {
        this.addDays = this.reViewAddDays
        this.appointTime = this.reViewAppointTime
      }
      // switch (this.radio) {
      //   case '1':// 预约
      //     this.addDays = this.reViewAddDays
      //     this.appointTime = this.reViewAppointTime
      //     break
      //   case '2':// 成功
      //     // this.sendMessage = this.reViewSendMessage
      //     break
      //   case '3':// 失败
      //   default:
      //     break
      // }
    },
    showSex(sex) {
      if (sex === 0) {
        return '男'
      } else if (sex === 1) {
        return '女'
      } else {
        return ''
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
        this.$message({
          message: '购买数量只能为整数！',
          type: 'error',
          duration: 1000
        })
        return false
      }
      if (number >= 0) {
        if (number > this.productNums[index]) {
          this.products[index].productNum = this.productNums[index]
          this.$message({
            message: '购买的数量不能超过产品库存！',
            type: 'error',
            duration: 1000
          })
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
    checkPhone(phone) {
      const customerPhone = this.changePhoneNum(phone)
      const regex = customerPhone.length > 11 ? customerPhone.substring(customerPhone.length - 11) : customerPhone
      if (localStorage.getItem('callInfo')) {
        const caller = JSON.parse(localStorage.getItem('callInfo')).callerid
        const callee = JSON.parse(localStorage.getItem('callInfo')).calleeid
        if (caller && callee) {
          const callerRegex = caller.length > 11 ? caller.substring(caller.length - 11) : caller
          const calleeRegex = callee.length > 11 ? callee.substring(callee.length - 11) : callee
          console.log(callerRegex, calleeRegex, regex, (callerRegex.indexOf(regex) !== -1 || calleeRegex.indexOf(regex) !== -1))
          return callerRegex.indexOf(regex) !== -1 || calleeRegex.indexOf(regex) !== -1
        }
      }
      return false
    },
    // 生成订单/接触记录/修改任务状态
    generateRecord() {
      const taskStatus = this.selectedSummarys[0] === '1' ? '2' : this.selectedSummarys[0] === '2' ? '3' : this.selectedSummarys[0] === '3' ? '1' : ''
      // 判断 1、是否打电话 2、是否选择任务状态  3、是否勾选小结
      if (this.recordId === '') {
        this.$message({
          message: '您还未拨打电话！',
          type: 'error',
          duration: 1000
        })
        return false
      } else if ((JSON.parse(localStorage.getItem(localStorage.getItem('agentId'))).reasoncode === '-100' ||
      JSON.parse(localStorage.getItem(localStorage.getItem('agentId'))).reasoncode === '-101' ||
      JSON.parse(localStorage.getItem(localStorage.getItem('agentId'))).reasoncode === '-3' ||
      JSON.parse(localStorage.getItem(localStorage.getItem('agentId'))).reasoncode === '-4') &&
     this.checkPhone(this.customerPhone)) {
        this.$message({
          message: '还在通话或者响铃中，不能结束任务',
          type: 'error',
          duration: 1000
        })
        return false
      } else if (this.selectedSummarys.length === 0 || taskStatus === '') {
        this.$message({
          message: '未选择小结！',
          type: 'error',
          duration: 1000
        })
        return false
      } else if (this.selectedSummarys[0] === '3' && this.appointTime === '') {
        this.$message({
          message: '未选择预约时间！',
          type: 'error',
          duration: 1000
        })
        return false
      } else if (
        this.selectedSummarys[0] === '3' &&
        this.appointTime < formatDateTime(new Date())
      ) {
        this.$message({
          message: '预约时间不能小于当前时间！',
          type: 'error',
          duration: 1000
        })
        return false
      } else {
        // 生成完整接触记录及小结
        // 判断任务状态 2：成功 3：失败  3：预约
        if (this.selectedSummarys[0] === '1' && this.campaignType === 'MARKETING' && this.hasProductInfo === true) {
          if (this.sumTotal <= 0) {
            this.$message({
              message: '未选择产品或产品库存不足！',
              type: 'error',
              duration: 1000
            })
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
              vm.resetReview()// 清空缓存数据
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
                  this.customerPhone
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
                type: 'error',
                duration: 1000
              })
              return
            }
          })
        }
        if (taskStatus === '2' && this.campaignType === 'SERVICE' && this.questionnaireTabs.length > 0) {
          // 是服务活动 判断问卷记录是否填写正确
          for (let i = 0; i < this.questionnaireTabs.length; i++) {
          // 发送请求 填写问卷
            const params = this.questionnaireTabs[i].titles.map(item => {
              const obj = {
                name: item.name,
                type: item.type
              }
              if (item.type === 1) { // 多选
                if (typeof (this.answerData[i][item.id]) === 'undefined') {
                  // obj.options = { 'content': [{}] }
                  obj.options = []
                } else {
                  obj.options = this.answerData[i][item.id].map(item => {
                    return { 'content': item }
                  })
                }
              } else {
                obj.options = [{ 'content': typeof (this.answerData[i][item.id]) === 'undefined' ? '' : this.answerData[i][item.id] }]
              }
              return obj
            })
            console.log(params)
            generateQuestionnaireRecord(this.taskId, this.questionnaireTabs[i].id, this.questionnaireTabs[i].name, params)
          }
        }
        console.log('即将修改任务状态...')
        var selectedSummarys2 = []
        selectedSummarys2.push(this.selectedSummarys[this.selectedSummarys.length - 1])
        // 选择失败、预约 或 成功但没有产品(如招聘)的情况
        // 修改任务状态
        updateTaskStatus(this.taskId, taskStatus, this.appointTime).then(
          res => {
            if (res.data.code === 0) {
              this.changeKeepReady('13')
              // 修改小结备注
              updateRecordInfo(this.recordId, taskStatus, selectedSummarys2, this.summary_description)
                .then(res1 => {
                  if (res1.data.code === 0) {
                  // 后处理
                    if (this.autoDialNext === true) {
                      // 回到顶部
                      const timer = setInterval(function() {
                        if (vm.$refs.dialtask.scrollTop <= 0) {
                          clearInterval(timer)
                        } else {
                          vm.$refs.dialtask.scrollTop -= 30
                        }
                      }, 30)
                      //  勾选了自动拨打下一个
                      console.log('before shift:' + this.taskIds[0] + ',' + this.campaignIds[0] + ',' + this.customerIds[0] + ',' + this.isBlacklists[0])
                      this.taskIds.shift()
                      this.campaignIds.shift()
                      this.customerIds.shift()
                      this.isBlacklists.shift()
                      this.customerPhones.shift()
                      console.log('after shift:' + this.taskIds[0] + ',' + this.campaignIds[0] + ',' + this.customerIds[0] + ',' + this.isBlacklists[0])
                      this.taskId = this.taskIds[0]
                      this.campaignId = this.campaignIds[0]
                      this.customerId = this.customerIds[0]
                      this.isBlacklist = this.isBlacklists[0]
                      this.customerPhone = this.customerPhones[0]
                      this.dialTo(this.taskId, this.campaignId, this.isBlacklist, this.customerPhone)
                      this.activeNames = ['1', '2', '3', '4']
                      this.recordId = ''
                      this.summary_description = ''
                      this.canContact = 1
                      this.addDays = '0'
                      this.appointTime = ''
                      this.selectedSummarys = []
                      this.hideDialTo = false
                      this.isLastContactTime = false
                      this.showDetailInfos(this.taskIds[0], this.campaignIds[0], this.customerIds[0], this.isBlacklists[0], this.customerPhones[0])
                      // 判断展示 checkbox与否
                      if (this.taskIds.length > 1) {
                        this.showAutoDial = true
                        this.autoCallDial = false
                      } else {
                        this.showAutoDial = false
                        this.autoDialNext = false
                      }
                    } else {
                      if (this.autoCalllNext === true) {
                        if (localStorage.getItem('autocall') === 'true') {
                          this.$root.eventHub.$emit('autocallReady', 'auto')
                        }
                      } else { // 没有勾选继续自动外呼
                        this.autoCallDial = false// 下次进页面时，默认不是自动外呼选项
                        if (localStorage.getItem('autocall') === 'true') { // 向软话机栏发送手动切换自动外呼的信号
                          this.$root.eventHub.$emit('autocallReady', 'manual')
                        }
                        localStorage.removeItem('autocall')// 移除自动外呼的缓存
                      }
                      // 没勾选自动拨打下一个 返回列表
                      this.recordId = ''
                      this.summary_description = ''
                      this.appointTime = ''
                      this.selectedSummarys = []
                      this.canContact = 1
                      this.addDays = '0'
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
                    this.$message({
                      message: res1.data.message,
                      type: 'error',
                      duration: 1000
                    })
                    this.searchByKeyWords(this.req)
                    this.isDialTask = true
                    this.sendMessageToNavbar(this.isDialTask)
                  }
                })
            } else {
              this.$message({
                message: res.data.message,
                type: 'error',
                duration: 1000
              })
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
            this.$message({
              message: '该微信任务已结束！',
              type: 'error',
              duration: 1000
            })
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

            this.$router.push({
              path: process.env.BUILT_IN_ROUTERS.wechatDial,
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
    if (localStorage.getItem('agentId') && localStorage.getItem(localStorage.getItem('agentId')) && JSON.parse(localStorage.getItem(localStorage.getItem('agentId'))).reasoncode == '13') {
      this.phoneCanDial = true
    }
    this.keepReady = true
    this.addDays = '1'
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
        permsDepart(localStorage.getItem('accountNo')).then(r => {
          const code = parseInt(r.data.code)
          if (code === 200) {
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
          } else if (code === 403) {
            permsStaff(localStorage.getItem('accountNo')).then(re => {
              const code = parseInt(re.data.code)
              if (code === 200) {
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
              } else {
                this.$message(re.data.message)
              }
            })
          } else {
            this.$message(r.data.message)
          }
        }).catch((error) => {
          console.log(error)
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
            vm.summariesInfo.push({ 'id': '', 'name': '全部' })
            this.handle(response.data.data)
          } else {
            vm.summariesInfo.push({ 'id': '', 'name': '全部' })
          }
        }
      }).catch(error => {
        console.error(error)
        vm.summariesInfo.push({ 'id': '', 'name': '全部' })
      })
      findCampaignByUser().then(res => {
        vm.campaignsInfo = []
        if (res.data.code === 0) {
          vm.campaignsInfo.push({ campaignId: '', campaignName: '全部' })
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
          vm.campaignsInfo.push({ campaignId: '', campaignName: '全部' })
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
      vm.$root.eventHub.$on('phoneCanDial', (flag) => {
        this.phoneCanDial = flag
      })
    })
  },
  activated() {
    this.$root.eventHub.$emit('disabledDial', true)
    if (this.isDialTask) return
    // 切换页面保留缓存开始
    this.reViewShowSendMessage = this.showSendMessage
    this.reViewCampaignType = this.campaignType
    this.reViewShowAutoDial = this.showAutoDial
    this.reViewAutoCallDial = this.autoCallDial
    this.reViewSelectedSummarys = this.selectedSummarys
    if (this.selectedSummarys && this.selectedSummarys[0] === '3') { // 预约情况缓存预约时间
      this.reViewAddDays = this.addDays
      this.reViewAppointTime = this.appointTime
    }
    vm = this
    let i = 0
    vm.sumInfo.forEach((val, key) => { // 给缓存的产品清单赋值
      vm.tempProducts[i].number = val.number
      i++
    })
    // 切换页面保留缓存结束
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
        permsDepart(localStorage.getItem('accountNo')).then(r => {
          const code = parseInt(r.data.code)
          if (code === 200) {
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
          } else if (code === 403) {
            permsStaff(localStorage.getItem('accountNo')).then(re => {
              const code = parseInt(re.data.code)
              if (code === 200) {
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
              } else {
                Message({
                  message: re.data.message,
                  type: 'error',
                  duration: 2 * 1000
                })
              }
            })
          } else {
            Message({
              message: r.data.message,
              type: 'error',
              duration: 2 * 1000
            })
          }
        }).catch((error) => {
          console.error(error)
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
            vm.summariesInfo.push({ 'id': '', 'name': '全部' })
            this.handle(response.data.data)
          } else {
            vm.summariesInfo.push({ 'id': '', 'name': '全部' })
          }
        }
      }).catch(error => {
        console.error(error)
        vm.summariesInfo.push({ 'id': '', 'name': '全部' })
      })
      findCampaignByUser().then(res => {
        vm.campaignsInfo = []
        if (res.data.code === 0) {
          vm.campaignsInfo.push({ campaignId: '', campaignName: '全部' })
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
          vm.campaignsInfo.push({ campaignId: '', campaignName: '全部' })
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
    // 默认界面滚动条
    this.autoStyle.overflow = 'auto'
    this.autoStyle.height = '800px'
  },
  deactivated() {
    this.$root.eventHub.$emit('disabledDial', false)
  },
  // 离开时清除定时器
  destroyed: function() {
    this.resetReview()// 清空缓存数据
    this.customerNote = ''
    this.products = []
    this.sumTotal = 0
    this.sumInfo = new Map()
    this.tempProducts = []
    this.summary_description = ''
    clearInterval(this.interval)
    localStorage.removeItem('global_taskId')
    this.sendMessageToNavbar(true)
    this.$root.eventHub.$emit('DISABLED_DIAL', '')
    this.$root.eventHub.$emit('autocallReady', 'manual')
    // this.$store.dispatch('setReq', this.req)
    this.$root.eventHub.$off('NAVBAR')
    this.$root.eventHub.$off('phoneCanDial')
  }
}
</script>
