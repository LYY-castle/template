<template>
  <div class='container' v-if="isMainPage===true">
    <el-collapse v-model="formContainerOpen" class="form-container" @change="handleChangeAcitve">
      <el-collapse-item title="筛选条件" name="1">
        <el-form :inline="true" size="small">
          <el-form-item label="客户编号：">
            <el-input placeholder="客户编号（限长20字符）" v-model="req.customerId" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="活动名称：" prop="campaignId">
            <el-select placeholder="请选择活动"  @change="selectOneCampaign(campaignId)" v-model="campaignId">
              <el-option label="所有情况" value=""></el-option>
              <el-option
              v-for="item in campaigns"
              :label="item.campaignName"
              :value="item.campaignId">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 下属是部门 -->
          <el-form-item label="操作人：" prop="angentId" v-if="isManager">
            <el-select placeholder=""  v-model="req.agentid">
              <el-option label="本部门人员" value=""></el-option>
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
          </el-form-item>
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
          </el-form-item>
            <el-form-item label="接通状态：">
              <el-radio-group v-model="req.status"  @change="changeChoice()">
                <el-radio-button label="-1">所有情况</el-radio-button>
                <el-radio-button label="1">已接通</el-radio-button>
                <el-radio-button label="0">未接通</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="接触类型：">
              <el-select placeholder="接触类型：" v-model="req.contactType">
                <el-option label="全部" value=""></el-option>
                <el-option label="微信" value="2"></el-option>
                <el-option label="电话" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="通话时长：" v-if="showTalkTime">
              <el-input v-model="req.stime" style="width:80px" @change="checkNo(req.stime)" onkeypress="return event.keyCode>=48&&event.keyCode<=57" :maxlength="3"></el-input>
              至
              <el-input v-model="req.etime" style="width:80px" @change="checkNo(req.stime)" onkeypress="return event.keyCode>=48&&event.keyCode<=57" :maxlength="3"></el-input>分钟
            </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="req.pageNo=1;searchByKeyWords(req);">查询</el-button>
            <el-button @click="campaignId='';resetReq();">重置</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <el-row class="table-container">
      <el-row class="margin-bottom-20">
        <div class="font14 bold">接触历史表</div>
      </el-row>
      <el-row>
        <el-table :data="tableData">
            <el-table-column align="center" label="客户编号" width="160">
            <template slot-scope="scope">
                <div>{{scope.row.customerId}}</div>
            </template>
          </el-table-column>
          <el-table-column fixed align="center" label="客户姓名" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <a @click="transferParameters(scope.row.taskId, scope.row.campaignId,scope.row.customerId,scope.row.customerPhone)" size="medium">{{scope.row.customerName}}</a>
            </template>
          </el-table-column>
          <el-table-column align="center" label="接触类型" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div>{{scope.row.contactType =="1"?'电话':'微信'}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="联系电话">
            <template slot-scope="scope">
              <div>{{hideMobile(scope.row.customerPhone)}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="活动名称" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{showCampaignName(scope.row.campaignId)}}
              </template>
          </el-table-column>
          <el-table-column align="center" label="操作人" :show-overflow-tooltip="true">
            <template slot-scope="scope">
                {{scope.row.staffName}}
            </template>
          </el-table-column>
          <el-table-column width="150" align="center" label="最近联系时间" :show-overflow-tooltip="true">
            <template slot-scope="scope">
                {{scope.row.hangUpTime}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="预约时间" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{showAppointTime(scope.row.appointTime)}}
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
          <el-table-column align="center" label="状态">
            <template slot-scope="scope">
              <div :class="scope.row.status==='1'?'visible':'invisible'">
                <span>{{scope.row.status==='1'?'接通':'未接通'}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="通话时长">
             <template slot-scope="scope">
                <div>{{scope.row.talkTime}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="话后小结">
             <template slot-scope="scope">
                <div>{{showSummarys(scope.row.summaryDetailInfos)}}</div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" align="center" label="操作">
            <template slot-scope="scope">
              <el-button v-if="scope.row.contactType =='1'" type="text" @click="contactType='1';isMainPage=false;detailInfo.recordInfo=[],detailInfo.orderInfo=[];ids.campaignId=scope.row.campaignId;ids.recordId=scope.row.recordId;ids.taskId=scope.row.taskId;ids.agentId=scope.row.staffId;ids.customerId=scope.row.customerId;contactDetail()" size="medium">详情</el-button>
              <el-button v-if="scope.row.contactType =='2'" type="text" @click="contactType='2';isMainPage=false;detailInfo.recordInfo=[],detailInfo.orderInfo=[];ids.campaignId=scope.row.campaignId;ids.recordId=scope.row.recordId;ids.taskId=scope.row.taskId;ids.agentId=scope.row.staffId;ids.customerId=scope.row.customerId;getChatRecords(scope.row.recordId);contactDetail();" size="medium">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row style="margin-top:20px;">
        <el-pagination
          v-if="pageShow"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageInfo.pageNo"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="pageInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper "
          :total="pageInfo.totalCount" style="text-align: right;float:right;">
        </el-pagination>
      </el-row>
    </el-row>

  </div>
  <!-- 详情 -->
  <div class="container record-dail" v-else>
    <div class="table-container" style="margin-top:0;">
      <b class="font14" style="padding-top:10px;">{{detailInfo.contactInfo.recordId}}</b>
      <el-row style="padding-top:20px;">
        <div style="width:20%;float:left;">
          <el-row class="font12">
            <span style="color:#666666;">员工姓名：</span>
            <b style="color:#020202;" :title="detailInfo.staffInfo.staffName">{{detailInfo.staffInfo.staffName}}</b>
          </el-row>
          <el-row class="font12">
            <span style="color:#666666;">客户姓名：</span>
            <b style="color:#020202;" :title="detailInfo.contactInfo.customerName">{{detailInfo.contactInfo.customerName}}</b>
          </el-row>
          <el-row class="font12">
            <span style="color:#666666;">话后小结：</span>
            <b style="color:#020202;" :title="showSummaryInfo(detailInfo.contactInfo.summaryDetailInfos)">{{showSummaryInfo(detailInfo.contactInfo.summaryDetailInfos)}}</b>
          </el-row>
        </div>

        <div style="width:20%;float:left;">
          <el-row class="font12">
            <span style="color:#666666;">员工工号：</span>
            <b style="color:#020202;" :title="detailInfo.contactInfo.staffId">{{detailInfo.contactInfo.staffId}}</b>
          </el-row>
          <el-row class="font12">
            <span style="color:#666666;">身份证号：</span>
            <b style="color:#020202;" :title="hideIdNumber(detailInfo.customerInfo.idNo)">{{hideIdNumber(detailInfo.customerInfo.idNo)}}</b>
          </el-row>
          <el-row class="font12">
            <span style="color:#666666;">小结备注：</span>
            <b style="color:#020202;" :title="detailInfo.contactInfo.description?detailInfo.contactInfo.description:'无'">{{detailInfo.contactInfo.description?detailInfo.contactInfo.description:"无"}}</b>
          </el-row>
        </div>

        <div style="width:20%;float:left;">
          <el-row class="font12">
            <span style="color:#666666;">主叫号码：</span>
            <b style="color:#020202;" :title="detailInfo.contactInfo.callerNumber">{{detailInfo.contactInfo.callerNumber}}</b>
          </el-row>
          <el-row class="font12">
            <span style="color:#666666;">被叫号码：</span>
            <b style="color:#020202;" :title="hideMobile(detailInfo.contactInfo.calleeNumber)">{{hideMobile(detailInfo.contactInfo.calleeNumber)}}</b>
          </el-row>
        </div>

        <div style="width:20%;float:left;">
          <el-row class="font12">
            <span style="color:#666666;">拨打时间：</span>
            <b style="color:#020202;" :title="detailInfo.contactInfo.callTime">{{detailInfo.contactInfo.callTime}}</b>
          </el-row>
          <el-row class="font12">
            <span style="color:#666666;">接听时间：</span>
            <b style="color:#020202;" :title="(detailInfo.contactInfo.answerTime)== null?'无':(detailInfo.contactInfo.answerTime)">{{(detailInfo.contactInfo.answerTime)== null?'无':(detailInfo.contactInfo.answerTime)}}</b>
          </el-row>
        </div>

        <div style="width:20%;float:left;">
          <el-row class="font12">
            <span style="color:#666666;">通话时间：</span>
            <b style="color:#020202;" :title="formatSeconds(detailInfo.contactInfo.talkTime)">{{formatSeconds(detailInfo.contactInfo.talkTime)}}</b>
          </el-row>
          <el-row class="font12">
            <span style="color:#666666;">任务状态：</span>
            <b style="color:#54B8FF;" v-if="detailInfo.dialTaskInfo.status=='2'">● 成功</b>
            <b style="color:#ED2135;" v-if="detailInfo.dialTaskInfo.status=='3'">● 失败</b>
            <b style="color:#28CC6C;" v-if="detailInfo.dialTaskInfo.status=='1'">● 预约</b>
            <b style="color:#28CC6C;" v-if="detailInfo.dialTaskInfo.status=='1'&&detailInfo.dialTaskInfo.appointTime">({{detailInfo.dialTaskInfo.appointTime?detailInfo.dialTaskInfo.appointTime:'无'}})</b>
          </el-row>
        </div>
      </el-row>
      <el-row>
        <div style="width:20%;float:left;">
          <el-row class="font12">
            <b style="color:#020202;">电话录音</b>
          </el-row>
          <el-row class="font12">
            <vue-plyr ref="plyr" class="audio-style" :options="option">
              <audio>
                <source :src="detailInfo.contactInfo.soundRecordUrl"/>
              </audio>
            </vue-plyr>
          </el-row>
        </div>
      </el-row>
      <el-row style="width:100%;border-top:1px solid #ccc;margin:20px 0;"></el-row>
      <el-row>
        <div style="text-align:center">
          <el-button type="primary" @click="edit();editVisible=true">编辑</el-button>
          <el-button plain type="primary" @click="searchByKeyWords(req);isMainPage = true" style="margin-right:40px;">返回</el-button>
        </div>
      </el-row>
    </div>
    <div class="table-container" v-if="contactType=='1'">
      <b class="font14">相关接触记录</b>
      <el-row style="margin-top:20px;">
        <el-table :data="detailInfo.recordInfo">
          <el-table-column align="center" label="记录编号" :show-overflow-tooltip="true">
            <template slot-scope="item">
              <a @click="ids.recordId=item.row.recordId;resetDetai();contactDetail()" size="medium">{{item.row.recordId}}</a>
            </template>
          </el-table-column>
          <el-table-column align="center" label="拨打时间" prop="callTime" :show-overflow-tooltip="true">
            <template slot-scope="item">
              {{item.row.callTime}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="接听时间" :show-overflow-tooltip="true">
             <template slot-scope="item">
                {{item.row.answerTime==null?'无':item.row.answerTime}}
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
          <el-table-column align="center" label="话后小结" :show-overflow-tooltip="true">
            <template slot-scope="item">
              {{showSummaryInfo(item.row.summaryDetailInfos)}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="小结备注" :show-overflow-tooltip="true">
            <template slot-scope="item">
              {{item.row.description==null||item.row.description==''?'无':item.row.description}}
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </div>
    <!-- 微信聊天记录 -->
    <div :class="isWechat('wechatRecord')" v-if="contactType=='2'">
        <div id="short-message-content">
          <!-- 点击加载更多div -->
          <div style="font-size:14px;color:#35ABE2;text-align:center" v-if="hasMoreRecords">
            <a @click="getChatRecords(sessionId,queryPageNum);queryPageNum++" style="color:#57AFFF;">查看更多消息</a>
          </div>
          <div v-for="(item,index) in contents">
          <!-- 来自客户的消息 -->
          <el-row style="min-height:30px;border-radius: 2px;text-align:left;word-break:break-all;" v-if="'0'===item.direction">
            <div style="margin-left:9px;">
              <span class="el-icon-loading" v-if="'2'===item.code" style="margin-left:4px;line-height:32px;"></span>
              <span class="el-icon-warning" v-if="'4'===item.code" style="margin-left:4px;line-height:32px;"></span>
              <div v-if="item.msgType=='text'" class="font12 left chat-container fl" v-html="showMsgs(item.content)"></div>
              <div v-if="item.msgType=='link'" class="font12 left chat-container fl">
                <a class="link" style="color:#115DFF;" @click="jump(item.content)">{{item.content}}</a>
              </div>
              <div v-if="item.msgType=='image'" class="font12 left chat-container fl">
                <img :src="item.mediaUrl" style="width:100%;" @click="imageDetailVisible=true;imgsrc=item.mediaUrl">
              </div>
              <div v-if="item.msgType=='voice'" class="font12 left chat-container fl">
                <audio controls="controls" :src="item.mediaUrl" style="width:240px;background: #F3F5FA;border-radius: 1px;height:32px;"></audio>
              </div>
            </div>
          </el-row>
          <el-row style="text-align:left;margin-bottom:22px;" v-if="'0'===item.direction">
            <span class="font12" style="padding-left:9px;color:#ccc;">{{formatDateTime(item.createTime)}}</span>
          </el-row>
          <!-- 我发出的消息  -->
          <el-row style="min-height:30px;border-radius: 2px;text-align:left;word-break:break-all;" v-if="'1'===item.direction">
            <!-- <el-col :span="19" :offset="5"> -->
              <div style="float:right;margin-right:9px;">
                <span class="el-icon-loading" v-if="'2'===item.code" style="margin-right:4px;line-height:32px;"></span>
                <a class="el-icon-warning" v-if="'4'===item.code" @click="sendMessageAgainVisible=true;sendMessageAgain_Obj=item;sendMessageAgain_Index=index;" style="margin-right:4px;line-height:40px;color:red;"></a>
                <div v-if="item.msgType=='text'" class="font12 right chat-container fr" v-html="showMsgs(item.content)"></div>
                <div v-if="item.msgType=='link'" class="font12 right chat-container fr">
                  <a class="link" style="color:#115DFF;text-shadow:1px 1px 1px #fff;" @click="jump(item.content)">{{decodeURI(item.content)}}</a>
                </div>
                <div v-if="item.msgType=='image'" class="font12 right chat-container fr">
                  <img :src="item.mediaUrl" style="width:100%;" @click="imageDetailVisible=true;imgsrc=item.mediaUrl">
                </div>
                <div v-if="item.msgType=='voice'" class="font12 right chat-container fr">
                  <audio controls="controls" :src="item.mediaUrl"></audio>
                </div>
              </div>
            <!-- </el-col> -->
          </el-row>
          <el-row style="text-align:right;margin-bottom:22px;" v-if="'1'===item.direction">
            <span class="font12" style="padding-right:9px;color:#ccc;">{{formatDateTime(item.createTime)}}</span>
          </el-row>
        </div>
      </div>
    </div>
    <div :class="isWechat('order')">
      <b class="font14">订单详情</b>
      <el-row style="margin-top:20px;">
        <el-table :data="detailInfo.orderInfo">
          <el-table-column align="center" label="订单编号" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <a @click="detailVisible=true;orderId=scope.row.orderId;quertOrderDetail()" size="medium">{{scope.row.orderId}}</a>
            </template>
          </el-table-column>
          <el-table-column align="center" label="产品名称" :show-overflow-tooltip="true">
            <template slot-scope="scope">{{showProducts(scope.row.productInfos)}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="新建时间" prop="createTime" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column align="center" label="订单状态" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div>{{scope.row.status === '0' ? "未完成": "已完成"}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="订单金额" prop="totalAmount" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column align="center" label="订单描述" prop="description" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div>{{scope.row.description==null||scope.row.description==''?'无':scope.row.description}}</div>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </div>
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
        <el-form-item label="新建时间：" prop="createTime">
          <span>{{orderDetailInfo.createTime}}</span>
        </el-form-item>
        <el-form-item label="订单状态：">
          <span>{{orderDetailInfo.status==='0'?"未完成":"已完成"}}</span>
        </el-form-item>
        <el-form-item label="支付方式：" prop="modifyTime">
          <span>{{orderDetailInfo.productId==="P20180101000001"?'赠险无需支付':(orderDetailInfo.payTypeName==null?'无':orderDetailInfo.payTypeName)}}</span>
        </el-form-item>
        <el-form-item label="选购产品：" prop="productName">
          <span>{{showProducts(orderDetailInfo.productInfos)}}</span>
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
      <!-- 接触记录修改 -->
      <el-dialog
      align:left
      width="30%"
      title="接触历史修改"
      :visible.sync="editVisible"
      append-to-body>
      <el-form  :model="detailInfo" ref="contactDetailForm" label-width="100px">
        <el-form-item label="预约时间：" prop="dialTaskInfo.appointTime" v-if="detailInfo.dialTaskInfo.status=='1'"  size="small">
          <el-date-picker
            v-model="detailInfo.dialTaskInfo.appointTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
            placeholder="选择日期时间"  size="small">
         </el-date-picker>
        </el-form-item>
        <el-form-item label="话后小结：">
          <el-tree
            class="summaryTreeEdit"
            ref = "tree"
            :data="detailInfo.summariesInfo"
            show-checkbox
            :default-checked-keys="keys"
            node-key="id"
            default-expand-all
            :check-strictly='true'
            @check="summaryIdChange"
            :props="defaultProps">
          </el-tree>
          <!-- <el-cascader
              placeholder="请选择小结"
              v-model='keys'
              :options="detailInfo.summariesInfo"
              filterable
              :props="defaultProps"
            ></el-cascader> -->
          </el-form-item>
        <el-form-item label="小结备注：" prop="contactInfo.description">
          <el-input type="textarea" v-model="detailInfo.contactInfo.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: right;">
        <el-button type="primary" @click="checkEdit()">确 定</el-button>
        <el-button type="danger" @click="resetDetai();contactDetail()">重 置</el-button>
        <el-button @click="editVisible = false;resetDetai();contactDetail()">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang='scss' scoped>
.record-dail{
  .table-container{
    &.is-wechat{
      float:left;
      width:49%
    }
    .font12{
      height:30px;
    }
    .audio-style{
      /deep/ .plyr--audio .plyr__controls{
        width:406px;
        background: #F3F5FA;
        border-radius: 1px;
        height:32px;
      }
      /deep/ .plyr__menu__container{
        top:41px;
        bottom:auto;
      }
      /deep/ .plyr__menu__container::after{
        display:none;
      }
    }
    .left,.right{
        min-height: 40px;
        position: relative;
        display: table;
    }
    .left > p,.right > p{    /*使内容居中*/
        display: table-cell;
        vertical-align: middle;
        padding: 0 10px;
    }
    .left:before,.right:after{   /*用伪类写出小三角形*/
        content: '';
        display: block;
        width: 0;
        height: 0;
        border: 8px solid transparent;
        position: absolute;
        top: 7px;
    }
    /*分别给左右两边的小三角形定位*/
    .left:before{
        border-right: 8px solid #ccc;
        left: -16px;
    }
    .right:after{
        border-left: 8px solid #57AFFF;
        right: -16px;
    }
    &.chat-record-container{
      padding:10px;
      height:45vh;
      overflow-y:auto;
    }
    .chat-container{
      max-width:290px;
      text-align:left;
      word-break:break-all;
      color:#020202;
      padding:7px 10px;
      min-height:30px;
      background-color:#fff;
      border-radius: 2px;
      border: 1px solid #57AFFF;
      &.fl{
        background-color:#fff;
        border: 1px solid #CCCCCC;
      }
      &.fr{
        background: #57AFFF;
        color:#fff;
      }
    }
  }
  .fr{
    float:right !important;
  }
  .fl{
    float:left !important;
  }
}
audio {
    width: 250px;
    height: 50px;
}
.title-class{
  margin-top: 10px;
  margin-bottom: 22px;
}
.el-form-div{
  margin-bottom: 0px;
}
@media screen and (min-width: 1281px) and (max-width:1367px){
  .record-dail{
    .table-container{
      &.chat-record-container{
        height:37vh;
      }
    }
  }
}
@media all and (min-width:1024px) and (max-width:1280px)  {
  .record-dail{
    .table-container{
      &.chat-record-container{
        height:33vh;
      }
    }
  }
}
</style>

<script>
  import { formatDateTime, checkNo, hideIdNumber, hideMobile, formatSeconds } from '@/utils/tools' // 格式化时间
  import {
    getAllCamps,
    queryByKeyWords,
    isHaveManager,
    isHaveStaff,
    getSummariesByTaskId,
    getContactByGradeId,
    queryrecordbytaskid,
    getStaffNameByAgentId,
    queryTaskByTaskId,
    queryOrderByTaskId,
    querycustomerbyid,
    updateTaskStatus,
    generateRecord,
    quertOrderDetail,
    getStaffByDepartId,
    queryRecords
  } from '@/api/contact_record_dail' // api接口引用
  import { permsManager } from '@/api/permission'
  import Emotion from '@/components/Emotion1/index'
  import vueEmoji from '@/components/Emotion3/emoji.vue'
  import emojidata from '@/components/Emotion3/emoji-data.js'
  import reg_emoji from '@/components/Emotion3/reg_emojis.js'

  export default {
    name: 'contact_record_dail',
    data() {
      return {
        option: { i18n: { normal: '1×', speed: '播放速度' }},
        visibleClass: '',
        formContainerOpen: '1',
        formContainer: this.$store.state.app.formContainer,
        emojidata: emojidata,
        reg_emojis: reg_emoji,
        keys: [],
        editVisible: false, // 修改
        showTalkTime: true,
        detailVisible: false, // 订单详情展示开关
        isMainPage: true, // 显示或隐藏详情页面
        requestFail: false, // 请求失败
        orderId: '', // 订单Id
        orderDetailInfo: {}, // 订单详情
        originalStatus: '',
        oriQueryStatus: '-1',
        oriSTime: '',
        oriETime: '',
        oriAgentId: '',
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
          contactType: '',
          customerId: '',
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
          pageNo: 1,
          status: '-1'
        },
        contents: [],
        hasMoreRecords: false,
        queryPageNum: 2,
        sessionId: null,
        contactType: '',
        unicoded_qq_face: ['/::)', '/::~', '/::B', '/::|', '/:8-)', '/::<', '/::$', '/::X', '/::Z', "/::'(", '/::-|', '/::@', '/::P', '/::D', '/::O', '/::(', '/::+', '[囧]', '/::Q', '/::T', '/:,@P', '/:,@-D', '/::d', '/:,@o', '/::g', '/:|-)', '/::!', '/::L', '/::>', '/::,@', '/:,@f', '/::-S', '/:?', '/:,@x', '/:,@@', '/::8', '/:,@!', '/:!!!', '/:xx', '/:bye', '/:wipe', '/:dig', '/:handclap', '/:&-(', '/:B-)', '/:<@', '/:@>', '/::-O', '/:>-|', '/:P-(', "/::'|", '/:X-)', '/::*', '/:@x', '/:8*', '/:pd', '/:<W>', '/:beer', '/:basketb', '/:oo', '/:coffee', '/:eat', '/:pig', '/:rose', '/:fade', '/:showlove', '/:heart', '/:break', '/:cake', '/:li', '/:bome', '/:kn', '/:footb', '/:ladybug', '/:shit', '/:moon', '/:sun', '/:gift', '/:hug', '/:strong', '/:weak', '/:share', '/:v', '/:@)', '/:jj', '/:@@', '/:bad', '/:lvu', '/:no', '/:ok', '/:love', '/:<L>', '/:jump', '/:shake', '/:<O>', '/:circle', '/:kotow', '/:turn', '/:skip', '[挥手]', '/:#-0', '/:hiphot', '/:<&', '/:&>'],
        unicoded_emoji_face: ['0x1f600', '0x1f601', '0x1f602', '0x1f923', '0x1f603', '0x1f604', '0x1f605', '0x1f606', '0x1f609', '0x1f60a', '0x1f60b', '0x1f60e', '0x1f60d', '0x1f618', '0x1f617', '0x1f619', '0x1f61a', '0x263a', '0x1f642', '0x1f917', '0x1f914', '0x1f610', '0x1f611', '0x1f636', '0x1f644', '0x1f60f', '0x1f623', '0x1f625', '0x1f62e', '0x1f910', '0x1f62f', '0x1f62a', '0x1f62b', '0x1f634', '0x1f60c', '0x1f61b', '0x1f61c', '0x1f61d', '0x1f924', '0x1f6120', '0x1f613', '0x1f614', '0x1f615', '0x1f643', '0x1f911', '0x1f632', '0x2639', '0x1f641', '0x1f616', '0x1f61e', '0x1f61f', '0x1f624', '0x1f622', '0x1f62d', '0x1f626', '0x1f627', '0x1f628', '0x1f629', '0x1f62c', '0x1f630', '0x1f631', '0x1f633', '0x1f635', '0x1f621', '0x1f620', '0x1f637', '0x1f912', '0x1f915', '0x1f922', '0x1f927', '0x1f607', '0x1f920', '0x1f921', '0x1f925', '0x1f913', '0x1f608', '0x1f47f', '0x1f479', '0x1f47a', '0x1f480', '0x1f47b', '0x1f47d', '0x1f916', '0x1f4a9', '0x1f63a', '0x1f638', '0x1f639', '0x1f63b', '0x1f63c', '0x1f63d', '0x1f640', '0x1f63f', '0x1f63e', '0x1f3fb', '0x1f3fc', '0x1f3fd', '0x1f3fe', '0x1f3ff', '0x1f5e3', '0x1f464', '0x1f465', '0x1f46b', '0x1f46c', '0x1f46d', '0x1f442', '0x1f442 0x1f3fb', '0x1f442 0x1f3fc', '0x1f442 0x1f3fd', '0x1f442 0x1f3fe', '0x1f442 0x1f3ff', '0x1f443', '0x1f443 0x1f3fb', '0x1f443 0x1f3fc', '0x1f443 0x1f3fd', '0x1f443 0x1f3fe', '0x1f443 0x1f3ff', '0x1f463', '0x1f440', '0x1f441', '0x1f445', '0x1f444', '0x1f48b', '0x1f453', '0x1f576', '0x1f454', '0x1f455', '0x1f456', '0x1f457', '0x1f458', '0x1f459', '0x1f45a', '0x1f45b', '0x1f45c', '0x1f45d', '0x1f392', '0x1f45e', '0x1f45f', '0x1f460', '0x1f461', '0x1f462', '0x1f451', '0x1f452', '0x1f3a9', '0x1f393', '0x26d1', '0x1f484', '0x1f48d', '0x1f302', '0x1f4bc']
      }
    },
    components: {
      Emotion,
      vueEmoji
    },
    mounted() {
      // this.player.options = {'i18n':}
      // console.log(this.player)
      // this.$nextTick(() => {
      // this.player.options = { autoplay: true }
      // })
      // this.player.options = { 'speed': { selected: 1, options: [0.5, 0.75, 1] }}
      this.formContainer()
      this.handleChangeAcitve()
      new Promise((resolve, reject) => {
        getStaffByDepartId(localStorage.getItem('departId')).then(response => {
          const lists = response.data.dataAll
          this.staffs = []
          lists.forEach(element => {
            this.staffs.push({ 'staffName': element[2], 'angentId': element[1] })
          })
          resolve()
        })
      })
      this.checkPermission().then(() => {
        this.searchByKeyWords(this.req)
      })
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
    computed: {
      player() { return this.$refs.plyr.player }
    },
    created() {
      if (typeof (this.$route.query.sTime) !== 'undefined') {
        this.req.startTime = this.$route.query.sTime
        this.oriSTime = this.$route.query.sTime
      }
      if (typeof (this.$route.query.eTime) !== 'undefined') {
        this.req.endTime = this.$route.query.eTime
        this.oriETime = this.$route.query.eTime
      }
      if (typeof (this.$route.query.callStatu) === 'undefined') {
        this.req.status = '-1'
      } else {
        this.req.agentid = localStorage.getItem('agentId')
        if (this.$route.query.callStatu === 1) {
          this.req.status = '1'
          this.oriQueryStatus = '1'
        } else {
          this.req.status = '0'
          this.oriQueryStatus = '0'
        }
        this.oriAgentId = localStorage.getItem('agentId')
        this.staffInfo.agentid = localStorage.getItem('agentId')
      }
      this.req.pageNo = 1
    },
    methods: {
      handleChangeAcitve(active = ['1']) {
        if (active.length) {
          $('.form-more').text('收起')
        } else {
          $('.form-more').text('更多')
        }
      },
      hideEmoji(e) {
        var emoji_div = document.getElementById('emoji_div')
        if (emoji_div) {
          if (!emoji_div.contains(e.target)) {
            this.showEmojis = false
          }
        }
      },
      showMsgs(content) {
        const qq_reg = "(/::\\)|/::~|\\[囧\\]|\\[挥手\\]|/::B|/::\\||/:8-\\)|/::<|/::\\$|/::X|/::Z|/::'\\(|/::-\\||/::@|/::P|/::D|/::O|/::\\(|/::\\+|/:--b|/::Q|/::T|/:,@P|/:,@-D|/::d|/:,@o|/::g|/:\\|-\\)|/::!|/::L|/::>|/::,@|/:,@f|/::-S|/:\\?|/:,@x|/:,@@|/::8|/:,@!|/:!!!|/:xx|/:bye|/:wipe|/:dig|/:handclap|/:&-\\(|/:B-\\)|/:<@|/:@>|/::-O|/:>-\\||/:P-\\(|/::'\\||/:X-\\)|/::\\*|/:@x|/:8\\*|/:pd|/:<W>|/:beer|/:basketb|/:oo|/:coffee|/:eat|/:pig|/:rose|/:fade|/:showlove|/:heart|/:break|/:cake|/:li|/:bome|/:kn|/:footb|/:ladybug|/:shit|/:moon|/:sun|/:gift|/:hug|/:strong|/:weak|/:share|/:v|/:@\\)|/:jj|/:@@|/:bad|/:lvu|/:no|/:ok|/:love|/:<L>|/:jump|/:shake|/:<O>|/:circle|/:kotow|/:turn|/:skip|/:oY|/:\\#-0|/:hiphot|/:kiss|/:<&|/:&>)"
        const emoji_reg = this.reg_emojis
        var array = ''
        while ((array = content.match(qq_reg)) !== null) {
          const index = this.unicoded_qq_face.indexOf(array[0])
          content = content.replace(new RegExp(qq_reg), "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/" + index + ".gif' align='middle' width='26px' height='26px'>")
        }
        while ((array = content.match(emoji_reg)) !== null) {
          content = content.replace(new RegExp(emoji_reg), this.emoji1(array[0]))
        }
        content = content.replace(/(\r\n)|(\n)/g, '<br>')
        // console.log(content)
        return content
      },
      handleEmotion(i) {
        this.showEmojis = false
        this.$refs.myMessages_div.innerHTML += this.emotion(i)
      },
      handleEmotion1(i) {
        this.showEmojis = false
        this.$refs.myMessages_div.innerHTML += this.emoji(i)
      },
      htmlspecialchars_decode(str) {
        str = str.replace(/&amp;/g, '&')
        str = str.replace(/&lt;/g, '<')
        str = str.replace(/&gt;/g, '>')
        str = str.replace(/&quot;/g, "''")
        str = str.replace(/&#039;/g, "'")
        return str
      },
      // 将匹配结果替换QQ表情图片
      emotion(res) {
        const word = res.replace(/\#/, '').replace(/\;/, '')
        const index = this.unicoded_qq_face.indexOf(word)
        return `<img src="https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/${index}.gif" align="middle" width="26px" height="26px" alt="` + word + `">`
      },
      // 将匹配结果替换emoji
      emotion1(res) {
        const word = res.replace(/\#|\;/gi, '')
        const imgName = this.showData(word)
        return `<img src="../../../static/emoji/` + imgName + `" align="middle" width='26px' height='26px' alt="` + this.findKey(this.emojiData, imgName) + `">`
      },
      isWechat(type) {
        if (this.contactType === '2' && type === 'order') {
          return 'table-container is-wechat fr'
        } else if (this.contactType === '2' && type === 'wechatRecord') {
          return 'chat-record-container table-container is-wechat'
        } else {
          return 'table-container'
        }
      },
      // 展示产品信息
      showProducts(item) {
        let productStr = ''
        if (typeof item === 'undefined' || item === null) {
          return productStr
        } else {
          for (let i = 0; i < item.length; i++) {
            productStr += item[i].productName + ' * ' + item[i].productNum + '，'
          }
          productStr = productStr.substring(0, productStr.length - 1)
          return productStr
        }
      },
      edit() {
        this.editVisible = true
        console.log('tree', this.$refs.tree)
        setTimeout(() => {
          $('.summaryTreeEdit').find('.el-tree-node__expand-icon').next('.el-checkbox').hide()
          $('.summaryTreeEdit').find('.el-tree-node__expand-icon.is-leaf').next('.el-checkbox').show()
        }, 100)
        if (this.$refs.tree) {
          this.$refs.tree.setCheckedKeys(this.keys)
        }
      },
      summaryIdChange(node, data) {
        var keys = []
        keys.push(node.id)
        this.$refs.tree.setCheckedKeys(keys)
      },
      changeChoice() {
        switch (this.req.status) {
          case '-1':this.showTalkTime = true
            break
          case '0':this.showTalkTime = false
            break
          case '1':this.showTalkTime = true
            break
        }
      },
      resetReq() {
        this.showTalkTime = true
        this.req = {
          customerId: '',
          customerName: '',
          campaign: [],
          caller: '',
          callee: '',
          startTime: this.oriSTime,
          endTime: this.oriETime,
          stime: '',
          etime: '',
          departId: '',
          agentid: this.oriAgentId,
          pageSize: 10,
          pageNo: 1,
          status: this.oriQueryStatus
        }
      },
      // 跳转到别的组件
      transferParameters(taskId, campaignId, customerId, customerPhone) {
        queryTaskByTaskId(taskId).then(response => {
          if (response.data.code === 0) {
            const isBlacklist = response.data.data.isBlacklist
            sessionStorage.setItem('isDialTask', false)
            this.$router.push({
              path: process.env.BUILT_IN_ROUTERS.myDialTask,
              query: {// 通过query 传递参数
                taskId: taskId, campaignId: campaignId, customerId: customerId, isBlacklist: isBlacklist, customerPhone: customerPhone
              }
            })
          }
        }).catch(error => {
          console.log(error)
        })
      },
      async checkPermission() {
        // 判断现场主管
        await permsManager(localStorage.getItem('agentId')).then(response => {
          const code = parseInt(response.data.code)
          if (code === 200) {
            this.isManager = true
          } else if (code === 403) {
            this.isManager = false
            // 判断班组长
            isHaveManager(localStorage.getItem('agentId')).then(response => {
              const code = parseInt(response.data.code)
              if (code === 200) this.isManager = true
              else if (code === 403) this.isManager = false
            }).catch(error => {
              throw new Error(error)
            })
          }
        }).catch(error => {
          throw new Error(error)
        })
        // 判断员工
        await isHaveStaff(localStorage.getItem('agentId')).then(response => {
          const code = parseInt(response.data.code)
          if (code === 200) this.isStaff = true
          else if (code === 403) this.isStaff = false
        }).catch(error => {
          throw new Error(error)
        })
        return true
      },
      // 显示小结信息
      showSummarys(nodules) {
        if (nodules && nodules.length > 0) {
          var names = []
          for (var i = 0; i < nodules.length; i++) {
            names.push(nodules[i].name)
          }
          names = names.join('，')
          return names
        } else {
          return '无'
        }
      },
      // 详情页面加载
      contactDetail() {
        getSummariesByTaskId(this.ids.taskId).then(response => {
          // console.log(this.player)
          // this.player.options = { i18n: { normal: '1' }}
          // this.player.options = { autoplay: true }
          if (response.data.code === 0) {
            this.detailInfo.summariesInfo = response.data.data
          }
        })
        getContactByGradeId(this.ids.recordId).then(response => {
          if (response.data.code === 0) {
            this.detailInfo.contactInfo = response.data.data
            // this.checkedSummaryKeys(response.data.data.summaryDetailInfos)
            const a = response.data.data.summaryDetailInfos.map(function(item, index) {
              if (item) {
                return item.id
              } else {
                return
              }
            })
            this.keys = []
            this.keys = a
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
          this.$message.error('预约时间不能比现在早！')
          return
        }
        if (this.originalStatus == null || this.originalStatus === '') {
          this.updateStatusOrNodule(taskId, taskStatus, appointTime, recordId, nodules, description)
        } else {
          if (this.originalStatus !== taskStatus) {
            if (this.originalStatus === '2' && (taskStatus === '1' || taskStatus === '3') && this.detailInfo.orderInfo.length > 0) {
              this.$message.error('请您先删除订单再修改任务状态!')
              return
            }
            if (this.originalStatus === '3' && (taskStatus === '2')) {
              this.$message.error('非法操作!')
              return
            }
            if (this.originalStatus === '1' && (taskStatus === '2')) {
              this.$message.error('非法操作!')
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
                  // this.searchByKeyWords(this.req)
                  this.resetDetai()// 刷新
                  this.contactDetail()// 刷新
                  this.editVisible = false
                  this.$message.success('修改成功')
                } else {
                  this.$message.error(response.data.message)
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
                // this.searchByKeyWords(this.req)
                this.resetDetai()// 刷新
                this.contactDetail()// 刷新
                this.editVisible = false
                this.$message.success('修改成功')
              } else {
                this.$message.error(response.data.message)
              }
            })
          } else {
            this.$message.error(response.data.message)
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
      // 页面显示条数
      handleSizeChange(val) {
        this.req.pageSize = val
        this.req.pageNo = 1
        this.pageInfo.pageNo = 1
        this.searchByKeyWords(this.req)
      },
      // 分页翻页功能
      handleCurrentChange(val) {
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
      searchByKeyWords(req) {
        if (this.isManager) {
          this.req.departId = localStorage.getItem('departId')
        } else if (this.isStaff) {
          this.req.agentid = localStorage.getItem('agentId')
        } else {
          this.$message.error('您无法操作该页面，请联系管理员！')
          return
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
              this.$message.error('无查询结果，请核对查询条件')
            }
          })
          .catch(error => {
            console.log(error)
          })
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
        var html = []
        if (!summary || summary.length === 0) {
          html.push('无')
        } else {
          for (var j in summary) {
            html.push(summary[j].name)
          }
        }
        return html.join('，')
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
      // 综合查询聊天记录
      getChatRecords(sessionId, queryPageNum) {
        this.sessionId = sessionId
        queryRecords(this.sessionId, queryPageNum)
          .then(response => {
            if (response.data.code === 0 && response.data.data) {
              if (response.data.data.length) {
                if (!queryPageNum) {
                  // 不传页数默认查询第一页 把第一页数据直接放数组中
                  this.contents = response.data.data
                  // 判断是否还有更多消息记录
                  if (response.data.pageInfo.totalPage > 1) {
                    this.hasMoreRecords = true
                  } else {
                    this.hasMoreRecords = false
                  }
                  this.queryPageNum = 2
                } else {
                  // 传了页数 将查询的数据插入数组的最前
                  const contentDiv = document.getElementById('short-message-content')
                  const y = contentDiv.scrollTop
                  for (var i = response.data.data.length - 1; i >= 0; i--) {
                    this.contents.unshift(response.data.data[i])
                  }
                  setTimeout(() => {
                    contentDiv.scrollTop = y
                  }, 10)
                  // 判断是否还有更多消息记录
                  if (response.data.pageInfo.totalPage > queryPageNum) {
                    this.hasMoreRecords = true
                  } else {
                    this.hasMoreRecords = false
                  }
                }
              } else {
                this.contents = []
                this.$message({
                  message: '该客户无微信聊天记录'
                })
              }
            } else {
              this.contents = []
              this.$message.error(response.data.message)
            }
          }).catch(error => {
            throw new Error(error)
          })
      }

    },
    watch: {}

  }

</script>
