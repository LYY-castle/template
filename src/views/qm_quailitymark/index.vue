<template>
  <div class="app-container">
    <div class="filter-container">
      <el-collapse v-model="formContainerOpen" class="form-container" @change="handleChangeAcitve">
        <el-collapse-item title="筛选条件" name="1">
          <el-form :inline="true" class="demo-form-inline" size="small">
            <el-form-item label="接触历史编号:">
              <el-input placeholder="接触历史编号（限30字）" v-model="formInline.contactRecord" maxlength="30"></el-input>
            </el-form-item>
            <el-form-item label="任务名称:">
              <el-input placeholder="任务名称（限50字）" v-model="formInline.taskName" maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="操作人:">
              <el-input placeholder="操作人（限45字）" maxlength="45" v-model="formInline.modifierName"></el-input>
            </el-form-item>
            <el-form-item label="完成状态:" prop="status">
              <el-radio-group v-model="formInline.status">
                <el-radio-button label="">所有情况</el-radio-button>
                <el-radio-button label="0">未开始</el-radio-button>
                <el-radio-button label="1">已完成</el-radio-button>
                <el-radio-button label="2">未完成</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="分配时间：">
              <el-date-picker
                v-model="timeValue1"
                type="datetimerange"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
              <el-form-item label="操作时间：">
              <el-date-picker
                v-model="timeValue2"
                type="datetimerange"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="质检员：" prop="staffId" v-if="isManager">
              <el-select placeholder=""  v-model="formInline.staffId">
                <el-option label="本部门人员" value=""></el-option>
                <el-option
                v-for="item in staffs"
                :label="item.staffName"
                :value="item.staffId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchTask(formInline)">查询</el-button>
              <el-button @click="reset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
      <el-row class="table-container">
        <el-row class="margin-bottom-20">
          <div class="font14 bold">质检评分表</div>
        </el-row>
        <el-row>
          <el-table
            :header-row-style="headerRow"
            :data="tableData"
            ref="multipleTable"
            tooltip-effect="dark"
            style="width: 100%;"
            @selection-change="handleSelectionChange">
            <el-table-column
              align="center"
              prop="recordId"
              width="150"
              :show-overflow-tooltip="true"
              label="接触历史编号">
            </el-table-column>
            <el-table-column
              align="center"
              prop="contactTaskId"
              width="150"
              :show-overflow-tooltip="true"
              label="接触任务编号">
            </el-table-column>
            <el-table-column
              align="center"
              prop="taskName"
              :show-overflow-tooltip="true"
              label="任务名称">
              <template slot-scope="scope">
                {{ scope.row.taskName }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="modifierName"
              :show-overflow-tooltip="true"
              label="操作人">
              <template slot-scope="scope">
                {{ scope.row.modifierName }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="modifierName"
              :show-overflow-tooltip="true"
              v-if="isManager"
              label="质检员">
              <template slot-scope="scope">
                {{ showStaffName(scope.row.staffId )}}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="activityName"
              :show-overflow-tooltip="true"
              label="活动名称">
              <template slot-scope="scope">
                {{ scope.row.activityName }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="contactStaffId"
              :show-overflow-tooltip="true"
              label="坐席工号">
              <template slot-scope="scope">
                {{ scope.row.contactStaffId }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="customerName"
              label="客户姓名"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{ scope.row.customerName }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="touchTime"
              label="最近联系时间"
              width="155">
            </el-table-column>
            <el-table-column
              align="center"
              prop="status"
              :show-overflow-tooltip="true"
              label="完成情况">
            </el-table-column>
            <el-table-column
              align="center"
              prop="staffDistributeTime"
              label="任务分配时间"
              width="155">
            </el-table-column>
            <el-table-column
              align="center"
              prop="modifierTime"
              label="操作时间"
              width="155">
            </el-table-column>
            <el-table-column
              align="center"
              label="操作"
              fixed="right"
              width="80">
              <template slot-scope="scope" >
                <el-button @click="handleClick(scope.row)" type="text" size="small" v-if="scope.row.status==='未开始'&&scope.row.staffId===staffId">开始评分</el-button>
                <el-button type="text" size="small" v-if="scope.row.status==='未开始'&&scope.row.staffId!==staffId">没有权限</el-button>
                <el-button @click="handleClickDetail(scope.row)" type="text" size="small" v-if="scope.row.status!=='未开始'&&scope.row.staffId===staffId">修改评分</el-button>
                <el-button type="text" size="small" v-if="scope.row.status!=='未开始'&&scope.row.staffId!==staffId">没有权限</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row style="margin-top:20px;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="pagination.pageNo"
            :page-size="pagination.pageSize"
            :page-sizes="[10, 20, 30, 50]"
            layout="total, sizes, prev, pager, next, jumper "
            :total="pagination.totalCount" style="text-align: right">
          </el-pagination>
        </el-row>
      </el-row>
    </div>
    <el-dialog title="开始质检评分" :visible.sync="dialogFormVisible" width="80%" @close="cleanInfo()" append-to-body>
      <div >正在对：{{taskId}} 进行操作</div>
      <div >
        <vue-plyr class="audio-style" :options="option">
          <audio>
            <source :src="addScopeUrl"/>
          </audio>
        </vue-plyr>
      </div>
      <div class="demo-ruleForm">接触记录</div>
      <el-row>
      <el-table
              :header-row-style="headerRow"
              :data="contactRecordData"
              ref="multipleTable"
              tooltip-effect="dark"
              border
              style="width: 100%;"
              @selection-change="handleSelectionChange">
              <el-table-column
                align="center"
                prop="staffId"
                :show-overflow-tooltip="true"
                label="坐席工号">
              </el-table-column>
              <el-table-column
                align="center"
                prop="DN"
                :show-overflow-tooltip="true"
                label="分机号码">
              </el-table-column>
              <el-table-column
                align="center"
                prop="recordId"
                :show-overflow-tooltip="true"
                label="记录编号">
              </el-table-column>
              <el-table-column
                align="center"
                prop="callTime"
                :show-overflow-tooltip="true"
                label="拨打时间">
              </el-table-column>
              <el-table-column
                align="center"
                :show-overflow-tooltip="true"
                prop="answerTime"
                label="接听时间">
              </el-table-column>
              <el-table-column
                align="center"
                prop="talkTime"
                :show-overflow-tooltip="true"
                label="通话时长">
              </el-table-column>
              <el-table-column
                align="center"
                prop="callDirection"
                :show-overflow-tooltip="true"
                label="呼叫方向">
              </el-table-column>
              <el-table-column
                align="center"
                prop="originNumber"
                :show-overflow-tooltip="true"
                label="原始主叫">
              </el-table-column>
              <el-table-column
                align="center"
                prop="callerNumber"
                :show-overflow-tooltip="true"
                label="主叫号码">
              </el-table-column>
              <el-table-column
                align="center"
                prop="calleeNumber"
                :show-overflow-tooltip="true"
                label="被叫号码">
              </el-table-column>
              <el-table-column
                align="center"
                prop="taskStatus"
                :show-overflow-tooltip="true"
                label="任务状态">
              </el-table-column>
              <el-table-column
                align="center"
                prop="summaryDetailInfos"
                :show-overflow-tooltip="true"
                label="话后小结">
              </el-table-column>
              <el-table-column
                align="center"
                prop="description"
                :show-overflow-tooltip="true"
                label="小结备注">
              </el-table-column>
        </el-table>
      </el-row>
      <el-row style="margin-down:2%;margin-top:2%">
        <el-col style="width:25%">
              <el-card class="box-card"
                        :data="customerData">
                <div slot="header" class="clearfix">
                  <span>客户信息</span>
                </div>
                <div 
                  class="text item text-hidden" 
                  v-if="customerData.customerId" 
                  style="max-width=100%;">
                  <span>
                    编号：
                  </span>
                  <span :title="customerData.customerId">
                    {{customerData.customerId }}
                  </span>
                </div>
                <div 
                  class="text item text-hidden"  
                  v-if="customerData.customerName"
                  style="max-width=100%;">
                  <span>
                    姓名：
                  </span>
                  <span :title="customerData.customerName">
                    {{customerData.customerName }}
                  </span>
                </div>
                <div 
                  class="text item text-hidden"  
                  v-if="customerData.customerSex"
                  style="max-width=100%;">
                  <span>
                    性别：
                  </span>
                  <span :title="customerData.customerSex">
                    {{customerData.customerSex}}
                  </span>
                </div>
                <div v-if="customerData.customerLinks.length">
                  <div 
                    v-for="(item,index) in customerData.customerLinks"
                    class="text item text-hidden"  
                    style="max-width=100%;">
                    <span :key="index">
                      {{item.linkType===0?'电话：':item.linkType===1?'微信：':item.linkType===2?'QQ：':item.linkType===3?'邮箱：':item.linkType===4?'微信电话：':''}}
                    </span>
                    <span>
                      {{item.linkValue}}
                    </span>
                  </div>
                </div>
                <div v-if="customerData.customerAddresses.length">
                  <div 
                    class="text item text-hidden"  
                    v-for="(item,index) in customerData.customerAddresses"
                    style="max-width=100%;">
                    <span>
                      {{'地址' + index + ':'}}
                    </span>
                    <span :title="customerData.customerAddresses" :key="index">
                      {{ + customerData.customerAddresses }}
                    </span>
                  </div>
                </div>
                <div 
                  class="text item text-hidden"  
                  v-if="customerData.idNo"
                  style="max-width=100%;">
                  <span>
                    身份证：
                  </span>
                  <span :title="customerData.idNo">
                    {{customerData.idNo}}
                  </span>
                </div>
                <div 
                  class="text item text-hidden"  
                  v-if="customerData.idNo"
                  style="max-width=100%;">
                  <span>
                    评分：
                  </span>
                  <span :title="customerData.score">
                    {{customerData.score }}
                  </span>
                </div>
                <div 
                  class="text item"  
                  v-if="customerData.remark">
                  <span>
                    备注：
                  </span>
                  <span 
                    :title="customerData.remark"
                    style="word-wrap:break-word">
                    {{customerData.remark}}
                  </span>
                </div>
              </el-card>
        </el-col>
        <el-col  style="margin-left:2%;width:73%;">
                <!-- <el-tabs :data="orderData"
                        type="border-card"
                        v-if="orderHide" style="min-height:223px"
                        v-model="orderActiveName">
                <el-tab-pane
                  v-for="(item,index) in orderData"
                  :key="item.productId"
                  :label="item.productName"
                  :name="item.productId">
                  <span><font>产品id：</font>{{item.productId}}</span><br/>
                  <span><font>产品名称：</font>{{item.productName}}</span><br/>
                  <span><font>购买数量：</font>{{item.productNum}}<font>件</font></span><br/>
                  <span><font>产品类型id：</font>{{item.productTypeId}}</span><br/>
                  <span><font>产品类型名称：</font>{{item.productTypeName}}</span><br/>
                </el-tab-pane>
              </el-tabs> -->
          <div class="table-container" style="margin:0">
            <el-row class="margin-bottom-20">
              <div class="font14 bold">订单信息表</div>
            </el-row>
            <el-table
              :data="orderData">
              <el-table-column
                align="center"
                label="产品id"
                prop="productId">
              </el-table-column>
              <el-table-column
                align="center"
                prop="productName"
                label="产品名称">
              </el-table-column>
              <el-table-column
                align="center"
                prop="productNum"
                label="购买数量">
              </el-table-column>
            </el-table>
          </div>
          <!-- <el-card class="box-card"  v-if="!orderHide" style="min-height:223px">
                <div slot="header" class="clearfix">
                  <span>订单信息</span>
                </div>
                <div class="text item" style="text-align:center">
                    无订单
                </div>
          </el-card> -->

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
                <textarea v-model="comment[item.id]"></textarea>
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
      <div style="margin-top:5px">
        <label>评分等级：</label>
        <el-rate
          v-model="gradeRate"
          show-text
          :max=4
          :texts="['差','中','良','优']"
          style="margin-left:1%">
        </el-rate>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align:center">
       <el-button type="primary" @click="toAddQCGradeRecord(1)">完成质检</el-button>
        <el-button @click="toAddQCGradeRecord(0)">暂存</el-button>
        <el-button @click="reLoad('dialogFormVisible')">重置</el-button>
      </div>
    </el-dialog>


    <el-dialog title="修改质检评分" :visible.sync="dialogFormVisibleReverse" width="80%"  @close="cleanInfo()" append-to-body>
      <div>正在对：{{taskId}} 进行操作</div>
      <div >
        <vue-plyr class="audio-style" :options="option">
          <audio>
            <source :src="addScopeUrl"/>
          </audio>
        </vue-plyr>
      </div>
      <div >接触记录</div>
      <el-row>

      <el-table
              :header-row-style="headerRow"
              :data="contactRecordData"
              ref="multipleTable"
              tooltip-effect="dark"
              style="width:100%;"
              @selection-change="handleSelectionChange">
              <el-table-column
                align="center"
                prop="staffId"
                :show-overflow-tooltip="true"
                label="坐席工号">
              </el-table-column>
              <el-table-column
                align="center"
                prop="DN"
                :show-overflow-tooltip="true"
                label="分机号码">
              </el-table-column>
              <el-table-column
                align="center"
                prop="recordId"
                :show-overflow-tooltip="true"
                label="记录编号">
              </el-table-column>
              <el-table-column
                align="center"
                prop="callTime"
                :show-overflow-tooltip="true"
                label="拨打时间">
              </el-table-column>
              <el-table-column
                align="center"
                prop="answerTime"
                :show-overflow-tooltip="true"
                label="接听时间">
              </el-table-column>
              <el-table-column
                align="center"
                prop="talkTime"
                :show-overflow-tooltip="true"
                label="通话时长">
              </el-table-column>
              <el-table-column
                align="center"
                prop="callDirection"
                :show-overflow-tooltip="true"
                label="呼叫方向">
              </el-table-column>
              <el-table-column
                align="center"
                prop="originNumber"
                :show-overflow-tooltip="true"
                label="原始主叫">
              </el-table-column>
              <el-table-column
                align="center"
                prop="callerNumber"
                :show-overflow-tooltip="true"
                label="主叫号码">
              </el-table-column>
              <el-table-column
                align="center"
                prop="calleeNumber"
                :show-overflow-tooltip="true"
                label="被叫号码">
              </el-table-column>
              <el-table-column
                align="center"
                prop="taskStatus"
                :show-overflow-tooltip="true"
                label="任务状态">
              </el-table-column>
              <el-table-column
                align="center"
                prop="summaryDetailInfos"
                :show-overflow-tooltip="true"
                label="话后小结">
              </el-table-column>
              <el-table-column
                align="center"
                prop="description"
                :show-overflow-tooltip="true"
                label="小结备注">
              </el-table-column>
        </el-table>
      </el-row>
      <el-row style="margin-top:2%;margin-down:2%">
        <el-col style="width:25%">
              <el-card class="box-card"
                        :data="customerData">
                <div slot="header" class="clearfix">
                  <span>客户信息</span>
                </div>
                 <div 
                  class="text item text-hidden" 
                  v-if="customerData.customerId" 
                  style="max-width=100%;">
                  <span>
                    编号：
                  </span>
                  <span :title="customerData.customerId">
                    {{customerData.customerId }}
                  </span>
                </div>
                <div 
                  class="text item text-hidden"  
                  v-if="customerData.customerName"
                  style="max-width=100%;">
                  <span>
                    姓名：
                  </span>
                  <span :title="customerData.customerName">
                    {{customerData.customerName }}
                  </span>
                </div>
                <div 
                  class="text item text-hidden"  
                  v-if="customerData.customerSex"
                  style="max-width=100%;">
                  <span>
                    性别：
                  </span>
                  <span :title="customerData.customerSex">
                    {{customerData.customerSex}}
                  </span>
                </div>
                <div v-if="customerData.customerLinks.length">
                  <div 
                    v-for="(item,index) in customerData.customerLinks"
                    class="text item text-hidden"  
                    style="max-width=100%;">
                    <span :key="index">
                      {{item.linkType===0?'电话：':item.linkType===1?'微信：':item.linkType===2?'QQ：':item.linkType===3?'邮箱：':item.linkType===4?'微信电话：':''}}
                    </span>
                    <span>
                      {{item.linkValue}}
                    </span>
                  </div>
                </div>
                <div v-if="customerData.customerAddresses.length">
                  <div 
                    class="text item text-hidden"  
                    v-for="(item,index) in customerData.customerAddresses"
                    style="max-width=100%;">
                    <span>
                      {{'地址' + index + ':'}}
                    </span>
                    <span :title="customerData.customerAddresses" :key="index">
                      {{ + customerData.customerAddresses }}
                    </span>
                  </div>
                </div>
                <div 
                  class="text item text-hidden"  
                  v-if="customerData.idNo"
                  style="max-width=100%;">
                  <span>
                    身份证：
                  </span>
                  <span :title="customerData.idNo">
                    {{customerData.idNo}}
                  </span>
                </div>
                <div 
                  class="text item text-hidden"  
                  v-if="customerData.idNo"
                  style="max-width=100%;">
                  <span>
                    评分：
                  </span>
                  <span :title="customerData.score">
                    {{customerData.score }}
                  </span>
                </div>
                <div 
                  class="text item"  
                  v-if="customerData.remark">
                  <span>
                    备注：
                  </span>
                  <span 
                    :title="customerData.remark"
                    style="word-wrap:break-word">
                    {{customerData.remark}}
                  </span>
                </div>
              </el-card>
        </el-col>

        <el-col  style="margin-left:2%;width:73%;">
                <!-- <el-tabs :data="orderData"
                        type="border-card"
                        v-if="orderHide" style="min-height:223px"
                        v-model="orderActiveName">
                <el-tab-pane
                  v-for="(item,index) in orderData"
                  :key="item.productId"
                  :label="item.productName"
                  :name="item.productId">
                  <span><font>产品id：</font>{{item.productId}}</span><br/>
                  <span><font>产品名称：</font>{{item.productName}}</span><br/>
                  <span><font>购买数量：</font>{{item.productNum}}<font>件</font></span><br/>
                  <span><font>产品类型id：</font>{{item.productTypeId}}</span><br/>
                  <span><font>产品类型名称：</font>{{item.productTypeName}}</span><br/>
                </el-tab-pane>
              </el-tabs> -->
              <div class="table-container" style="margin:0">
                <el-row class="margin-bottom-20">
                  <div class="font14 bold">订单信息表</div>
                </el-row>
                <el-table
                  :data="orderData">
                  <el-table-column
                    align="center"
                    label="产品id"
                    prop="productId">
                  </el-table-column>
                  <el-table-column
                    align="center"
                    prop="productName"
                    label="产品名称">
                  </el-table-column>
                  <el-table-column
                    align="center"
                    prop="productNum"
                    label="购买数量">
                  </el-table-column>
                </el-table>
              </div>
              <!-- <el-card class="box-card"  v-if="!orderHide" style="min-height:223px">
                    <div slot="header" class="clearfix">
                      <span>订单信息</span>
                    </div>
                    <div class="text item" style="text-align:center">
                        无订单
                    </div>
              </el-card> -->

            </el-col>
      </el-row>

        <el-tabs  type="border-card"
                  style="width:100%;margin-top:2%;min-height:223px"
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
                <label>描&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;述：</label>
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
                      <el-radio style="width:18%;margin-left:2%" v-for="(item2,index2) in item1.gradeOptions" :label="String.fromCharCode(65 +parseInt(index2))+' '+item2.optionName+' 分值：'+item2.score" @change="changeTotalAmount(item.id,item1.titleId,item2.score,item1[index1]);changeCheckMenu(item.id,item1.titleId,item2.id)" ></el-radio>
                    </el-radio-group>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="2">
                <label>质检评价：</label>
              </el-col>
              <el-col :span="10">
                <textarea v-model="comment[item.id]"></textarea>
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
      <div style="margin-top:5px">
        <label>评分等级：</label>
        <el-rate
          v-model="gradeRate"
          show-text
          :max=4
          :texts="['差','中','良','优']"
          style="margin-left:1%">
        </el-rate>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align:center">
       <el-button type="primary" @click="toEditQCGradeRecord(1)">完成质检</el-button>
        <el-button @click="toEditQCGradeRecord(0)">暂存</el-button>
        <el-button @click="reLoad('dialogFormVisibleReverse')">重置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { findQualityTaskByInfo, getMarksByTaskId, getGradeListByGradeId, querycustomerbyid, queryrecordbytaskid, queryOrder, addQCGradeRecord, editQCGradeRecord, getGradeByGradeId, repalceString, getStaffByDepartId } from '@/api/qm_quailitymark'
  import { permsqualityMonitorWorkingSet, permsqualityOrdWorkingSet } from '@/api/reportPermission'
  import { formatDateTime } from '@/utils/tools'

  export default {
    name: 'qm_quailitymark',
    data() {
      return {
        option: { i18n: { normal: '1×', speed: '播放速度' }},
        formContainerOpen: '1',
        formContainer: this.$store.state.app.formContainer,
        staffId: '', // 当前质检员
        departId: '', // 部门id
        isManager: false, // 是否主管
        isStaff: false, // 是否质检员
        staffs: [], // 质检员
        gradeArr: ['差', '中', '良', '优'],
        gradeRate: 0,
        taskId: '',
        row: {},
        activeName: '',
        orderActiveName: '',
        comment: [],
        gradeMarks: [{
          id: 0,
          gradeId: '',
          gradeName: ''
        }],
        totalAmountMap: new Map(),
        totalAmount: new Map(),
        totalCheckMap: new Map(),
        totalCheck: new Map(),
        gradeChoice: [],
        addScopeUrl: '',
        timeValue1: [],
        timeValue2: [],
        pagination: {
  
          pageNo: null,
          pageSize: null,
          totalCount: null,
          totalPage: null
        },
        addUrlData: {
          id: null
        },
        tableData: [],
        contactRecordData: [],
        customerData: {
          customerLinks: [],
          customerAddresses: []
        },
        orderData: [],
        gradeInfo: [],
        gradeRecordId: '',
        gradeRecord: {
          complete: '',
          creatorId: '',
          creatorName: '',
          modifierId: '',
          modifierName: '',
          qualityTaskId: '',
          qualityDepartId: '',
          markParameters: [{
            branch: '',
            evalute: '',
            gradeId: '',
            gradeName: '',
            markTitleParameters: [{
              titleId: '',
              markOptionParameters: ''
            }]
          }]
        },
        gradeTitleData: [],
        multipleSelection: [],
        orderHide: false,
        gradeHide: false,
        formInline: {
          contactRecord: '',
          status: '',
          pageSize: 10,
          pageNo: 1,
          assignStart: '',
          assignStop: '',
          staffId: '',
          taskName: '',
          doneStart: '',
          doneStop: '',
          modifierName: ''
        },
        handleSelectionChange(val) {
          this.multipleSelection = val
          console.log(val)
        },
        dialogFormVisible: false,
        dialogFormVisibleReverse: false,
        dialogFormVisibleDetail: false,
        rules: { }
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
      async checkPermission(staffId) {
        // 判断主管
        await permsqualityMonitorWorkingSet(staffId).then(response => {
          this.isManager = true
        }).catch(() => {
          this.isManager = false
        })
        // 判断员工
        await permsqualityOrdWorkingSet(staffId).then(response => {
          this.isStaff = true
        }).catch(() => {
          this.isStaff = false
        })
      },
      showStaffName(val) {
        for (let i = 0; i < this.staffs.length; i++) {
          if (this.staffs[i].staffId === val) {
            return this.staffs[i].staffName
          }
        }
        return '未查到对应人'
      },
      reLoad(obj) {
        this.comment = []
        switch (obj) {
          case 'dialogFormVisible':this.dialogFormVisible = false
            this.handleClick(this.row)
            break
          case 'dialogFormVisibleReverse':this.dialogFormVisibleReverse = false
            this.handleClickDetail(this.row)
            break
          default:break
        }
      },
      toEditQCGradeRecord(value) {
        var gradeRecord = this.getGradeRecord(value, 1)
        if (this.checkChoose() && value === 1) { // 说明还有选项未填
          this.$message('还有选项未选择，请检查')
        } else {
          if (value === 0) { // 草稿判断是否更改过
            if (this.totalCheckMap.size < 1) {
              this.$message('没有选择任何数据，请检查')
              return
            }
          }
          editQCGradeRecord({ 'gradeRecord': gradeRecord }).then(response => {
            if (response.data.code === 0) {
              this.comment = []
              this.dialogFormVisibleReverse = false
              this.formInline.status = '0'
              this.searchTask(this.formInline)
            } else {
              this.$message(response.data.message)
            }
          }).catch(error => {
            console.log(error)
          })
        }
      },
      getGradeRecord(value, type) {
        var gradeRecord = {}
        gradeRecord.gradeRate = parseInt(this.gradeRate)
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
      checkChoose() {
        if (this.totalCheckMap.size < 1) { // 没有选任何选项
          return true
        }
        var checkedNum = 0
        var chooseNum = 0
        this.totalCheckMap.forEach((value, key) => {
          value.forEach((val, key1) => {
            checkedNum++
          })
        })
        for (var s = 0; s < this.gradeInfo.length; s++) {
          chooseNum += this.gradeInfo[s].gradeTitles.length
        }
        return chooseNum > checkedNum
      },
      toAddQCGradeRecord(value) {
        var gradeRecord = this.getGradeRecord(value, 0)
        if (this.checkChoose() && value === 1) { // 说明还有选项未填
          this.$message('还有选项未选择，请检查')
        } else {
          if (value === 0) { // 草稿判断是否更改过
            if (this.totalCheckMap.size < 1) {
              this.$message('没有选择任何数据，请检查')
              return
            }
          }
          addQCGradeRecord({ 'gradeRecord': gradeRecord }).then(response => {
            if (response.data.code === 0) {
              this.comment = []
              this.dialogFormVisible = false
              this.formInline.status = '0'
              this.searchTask(this.formInline)
            } else {
              this.$message(response.data.message)
            }
          }).catch(error => {
            console.log(error)
          })
        }
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
      showBody(val) {
        this.totalAmountMap = new Map()
        this.totalAmount = 0
        getGradeByGradeId({ 'gradeId': val.paneName }).then(res => {
          if (res.data.code === 0) {
            this.gradeTitleData = res.data.data.gradeTitles
          } else {
            this.$message(res.data.message)
          }
        })
      },
      reset() {
        this.timeValue1 = []
        this.timeValue2 = []
        this.formInline = {
          contactRecord: '',
          taskName: '',
          modifierName: '',
          status: '',
          staffId: '',
          pageNo: (isNaN(this.pagination.pageNo) ? 1 : this.pagination.pageNo),
          pageSize: (isNaN(this.pagination.pageSize) ? 1 : this.pagination.pageSize)
        }
      },
      handleClickDetail(row) {
        this.row = row
        this.editUrlData = {
          id: row.id
        }
        this.totalAmountMap = new Map()
        this.totalAmount = new Map()
        this.getContactRecord(row, 2)
        this.getCustomerInfo(row)
        this.getOrderInfo(row)
        this.getMarks(row, 1)
      },
      cleanInfo() {
        this.gradeRate = 0
        this.addScopeUrl = ''
        this.comment = []
        this.gradeInfo = []
        this.totalAmountMap = new Map()
        this.totalAmount = new Map()
        this.totalCheckMap = new Map()
        this.totalCheck = new Map()
      },
      /** 获取通话记录 */
      getContactRecord(row, type) { // 1开始评分 2 修改评分
        queryrecordbytaskid({ 'taskId': row.contactTaskId, 'campaignId': row.activityId }).then(response => {
          if (response.data.code === 0) {
            this.contactRecordData = response.data.data
            if (type === 1) {
              this.dialogFormVisible = true
            }
            if (type === 2) {
              this.dialogFormVisibleReverse = true
            }
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
            this.customerData = {
              customerLinks: [],
              customerAddresses: []
            }
            this.customerData = response.data.data
          } else {
            this.customerData = {
              customerLinks: [],
              customerAddresses: []
            }
            this.$message.error(response.data.message)
          }
          this.$forceUpdate()
        }).catch(error => {
          throw new Error(error)
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
              this.orderData = data[0].productInfos
              if (this.orderData.length > 0) {
                this.orderActiveName = this.orderData[0].productId
              }
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
        getMarksByTaskId({ 'taskId': row.id }).then(response => {
          if (response.data.code === 0) {
            var data = response.data.data
            if (data === null || data.length <= 0) {
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
      /** 回显质检评分结果 */
      getQuailtyRecord(row) {
        this.totalCheckMap = new Map()
        getGradeListByGradeId({ 'qualityTaskId': row.id }).then(response => {
          this.totalAmountMap = new Map()
          this.totalAmount = new Map()
          this.totalCheckMap = new Map()
          this.totalCheck = new Map()
          if (response.data.code === 0) {
            this.gradeRecordId = response.data.data.gradeRecordId
            if (response.data.data.gradeRate) {
              this.gradeRate = parseInt(response.data.data.gradeRate)
            } else {
              this.gradeRate = 0
            }
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
            this.$forceUpdate()
          } else {
            this.$message(response.data.message)
          }
          this.$forceUpdate()
        }).catch(error => {
          console.log(error)
        })
      },
      handleClick(row) {
        this.row = row
        this.addUrlData = {
          id: row.id
        }
        this.totalAmountMap = new Map()
        this.totalAmount = new Map()
        this.getContactRecord(row, 1)
        this.getCustomerInfo(row)
        this.getOrderInfo(row)
        this.getMarks(row, 0)
      },
      handleSizeChange(val) {
        const obj = {}
        this.formInline.pageSize = val
        obj.pageSize = val
        // this.formInline.assignStart = this.timeValue1[0]
        obj.assignStart = this.timeValue1 ? this.timeValue1[0] : null
        // this.formInline.assignStop = this.timeValue1[1]
        obj.assignStop = this.timeValue1 ? this.timeValue1[1] : null
        // this.formInline.doneStart = this.timeValue2[0]
        obj.doneStart = this.timeValue2 ? this.timeValue2[0] : null
        // this.formInline.doneStop = this.timeValue2[1]
        obj.doneStop = this.timeValue2 ? this.timeValue2[1] : null
        // this.formInline.status = this.formInline.status
        obj.status = this.formInline.status
        // this.formInline.staffId = localStorage.getItem('agentId')
        obj.contactRecord = this.formInline.contactRecord// 接触历史编号
        obj.taskName = this.formInline.taskName// 任务名称
        obj.modifierName = this.formInline.modifierName// 操作人
        if (this.isManager) {
          if (this.formInline.staffId === '') {
            let tempStr = ''
            for (let i = 0; i < this.staffs.length; i++) {
              tempStr = tempStr + this.staffs[i].staffId + ','
            }
            obj.staffId = tempStr.substring(0, tempStr.length - 1)
            this.formInline.staffId = ''
          } else {
            obj.staffId = this.formInline.staffId
          }
        } else {
          this.formInline.staffId = localStorage.getItem('agentId')
          obj.staffId = localStorage.getItem('agentId')
        }
        this.pagination.pageNo = 1
        findQualityTaskByInfo(obj).then(response => {
          this.queryGradeList(response)
        })
      },
      handleCurrentChange(val) {
        const obj = {}
        obj.pageNo = val
        this.formInline.pageNo = val
        obj.pageSize = this.formInline.pageSize
        // this.formInline.assignStart = this.timeValue1[0]
        obj.assignStart = this.timeValue1 ? this.timeValue1[0] : null
        // this.formInline.assignStop = this.timeValue1[1]
        obj.assignStop = this.timeValue1 ? this.timeValue1[1] : null
        // this.formInline.doneStart = this.timeValue2[0]
        obj.doneStart = this.timeValue2 ? this.timeValue2[0] : null
        // this.formInline.doneStop = this.timeValue2[1]
        obj.doneStop = this.timeValue2 ? this.timeValue2[1] : null
        obj.status = this.formInline.status
        obj.contactRecord = this.formInline.contactRecord// 接触历史编号
        obj.taskName = this.formInline.taskName// 任务名称
        obj.modifierName = this.formInline.modifierName// 操作人
        if (this.isManager) {
          if (this.formInline.staffId === '') {
            let tempStr = ''
            for (let i = 0; i < this.staffs.length; i++) {
              tempStr = tempStr + this.staffs[i].staffId + ','
            }
            obj.staffId = tempStr.substring(0, tempStr.length - 1)
            // this.formInline.staffId = ''
          } else {
            obj.staffId = this.formInline.staffId
          }
        } else {
          this.formInline.staffId = localStorage.getItem('agentId')
          obj.staffId = localStorage.getItem('agentId')
        }
        findQualityTaskByInfo(obj).then(response => {
          this.queryGradeList(response)
        })
      },
      headerRow({ row, rowIndex }) {
        if (rowIndex === 0) {
          return 'color:black'
        } else {
          return ''
        }
      },
      queryGradeList(res) {
        this.tableData = res.data.data
        this.pagination = typeof res.data.pageInfo === 'undefined' ? this.pagination : res.data.pageInfo
        if (typeof this.tableData !== 'undefined' && this.tableData.length !== 0) {
          for (let i = 0; i <= this.tableData.length; i++) {
            if (this.tableData[i]) {
              this.tableData[i].touchTime = this.tableData[i].touchTime === null ? '' : formatDateTime(this.tableData[i].touchTime)
              this.tableData[i].modifierTime = this.tableData[i].modifierTime === null ? '' : formatDateTime(this.tableData[i].modifierTime)
              this.tableData[i].staffDistributeTime = this.tableData[i].staffDistributeTime === null ? '' : formatDateTime(this.tableData[i].staffDistributeTime)
              const tableStatus = this.tableData[i].status
              switch (tableStatus) {
                case 0: this.tableData[i].status = '未开始'
                  this.tableData[i].gradeStatus = true
                  break
                case 1: this.tableData[i].status = '已完成'
                  this.tableData[i].gradeStatus = false
                  break
                case 2: this.tableData[i].status = '未完成'
                  this.tableData[i].gradeStatus = false
                  break
                default: this.tableData[i].status = '未开始'
                  this.tableData[i].gradeStatus = true
                  break
              }
            }
          }
        } else {
          console.log('查不到符合条件的数据')
        }
      },
      searchTask(req1) {
        const req = {}
        req.pageNo = 1
        this.formInline.pageNo = 1
        // 分配时间开始、结束
        this.formInline.assignStart = this.timeValue1 ? this.timeValue1[0] : null
        req.assignStart = this.timeValue1 ? this.timeValue1[0] : null
        this.formInline.assignStop = this.timeValue1 ? this.timeValue1[1] : null
        req.assignStop = this.timeValue1 ? this.timeValue1[1] : null
  
        // 操作时间开始、结束
        this.formInline.doneStart = this.timeValue2 ? this.timeValue2[0] : null
        req.doneStart = this.timeValue2 ? this.timeValue2[0] : null
        this.formInline.doneStop = this.timeValue2 ? this.timeValue2[1] : null
        req.doneStop = this.timeValue2 ? this.timeValue2[1] : null
  
        if (this.isManager) { // 是否主管权限
          if (this.formInline.staffId !== '') {
            req.staffId = this.formInline.staffId
          } else {
            let str = ''
            for (let i = 0; i < this.staffs.length; i++) {
              str = str + this.staffs[i].staffId + ','
            }
            req.staffId = this.staffs.length < 1 ? localStorage.getItem('agentId') : str.substring(0, str.length - 1)
          }
        } else {
          req.staffId = localStorage.getItem('agentId')
        }
        req.status = this.formInline.status// 完成状态
        req.contactRecord = this.formInline.contactRecord// 接触历史编号
        req.taskName = this.formInline.taskName// 任务名称
        req.modifierName = this.formInline.modifierName// 操作人
        findQualityTaskByInfo(req).then(response => {
          this.queryGradeList(response)
        })
      },
      queryrecordbytaskid(req) {
        findQualityTaskByInfo(req).then(response => {
          this.queryGradeList(response)
        })
      }
    },
    mounted() {
      this.formContainer()
      this.handleChangeAcitve()
      this.staffId = localStorage.getItem('agentId')
      if (this.$route.query.status) { // 说明是由工作台跳转(质检员和质检主管共用一个状态)
        if (this.$route.query.status === '3') { // 说明是查总任务状态，不需要状态和时间条件
          this.formInline.status = ''
        } else if (this.$route.query.status === '4') { // 说明是查当日完成情况，须带状态和时间
          this.formInline.status = '1'
          this.timeValue2 = []
          this.timeValue2[0] = formatDateTime(new Date().setHours(0, 0, 0, 0))
          this.timeValue2[1] = formatDateTime(new Date().setHours(23, 59, 59, 0))
        } else { // 未完成，已完成，未开始，只需要状态不需要时间条件查询
          this.formInline.status = this.$route.query.status
        }
      } else {
        this.searchTask(this.formInline)
      }
      this.checkPermission(this.staffId).then(res => {
        if (this.isManager) {
          this.departId = localStorage.getItem('departId')
          getStaffByDepartId(this.departId).then(response => {
            const lists = response.data.dataAll
            this.staffs = []
            lists.forEach(element => {
              this.staffs.push({ 'staffName': element[2], 'staffId': element[1] })
            })
            if (this.$route.query.staffId) {
              this.formInline.staffId = this.$route.query.staffId
            } else {
              this.formInline.staffId = ''
            }
            this.searchTask(this.formInline)
          })
        } else {
          if (this.isStaff) {
            this.formInline.staffId = localStorage.getItem('agentId')
            this.searchTask(this.formInline)
          } else {
            this.$message('您未拥有该页面的权限！')
            return
          }
        }
      })
    }
  
  }
</script>
<style lang='scss' scoped>
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
</style>

