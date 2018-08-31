<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-form :inline="true" class="demo-form-inline" size="small">
          <el-form-item label="任务名称:">
            <el-input placeholder="任务名称" v-model="formInline.taskId"></el-input>
          </el-form-item>
          <el-form-item label="操作人员:">
            <el-input placeholder="操作人员" v-model="formInline.modifierName"></el-input>
          </el-form-item>
          <el-form-item label="完成状态:" prop="status">
            <el-radio-group v-model="formInline.status">
              <el-radio-button label="0">未完成</el-radio-button>
              <el-radio-button label="1">已完成</el-radio-button>
              <el-radio-button label="2">草稿</el-radio-button>
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
          <el-form-item>
            <el-button type="primary" @click="searchTask(formInline)">查询</el-button>
            <el-button type="danger" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table
        :header-row-style="headerRow"
        :data="tableData"
        ref="multipleTable"
        tooltip-effect="dark"
        border
        style="width: 100%;"
        @selection-change="handleSelectionChange">
        <el-table-column
          width="55"
          align="center"
          label="序号">
          <template slot-scope="scope" >
            <div>{{scope.$index+(formInline.pageNo-1)*formInline.pageSize+1}}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="recordId"
          label="接触历史编号">
        </el-table-column>
        <el-table-column
          align="center"
          prop="contactTaskId"
          label="接触任务id">
        </el-table-column>
        <el-table-column
          align="center"
          prop="taskName"
          label="任务名称">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="right">
              <p>{{ scope.row.taskName }}</p>
              <div slot="reference">
                {{ scope.row.taskName }}
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="modifierName"
          label="操作人员">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="right">
              <p>{{ scope.row.modifierName }}</p>
              <div slot="reference">
                {{ scope.row.modifierName }}
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="activityName"
          label="活动名称">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="right">
              <p>{{ scope.row.activityName }}</p>
              <div slot="reference">
                {{ scope.row.activityName }}
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="contactStaffId"
          label="员工姓名">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="right">
              <p>{{ scope.row.contactStaffId }}</p>
              <div slot="reference">
                {{ scope.row.contactStaffId }}
              </div>
            </el-popover>
          </template>
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
          prop="touchTime"
          label="最近联系时间"
          width="155">
        </el-table-column>
        <el-table-column
          align="center"
          prop="status"
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
          label="任务修改时间"
          width="155">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="80">
          <template slot-scope="scope" >
            <el-button @click="handleClick(scope.row)" type="text" size="small" v-if="scope.row.status==='未完成'">开始评分</el-button>
            <el-button @click="handleClickDetail(scope.row)" type="text" size="small" v-if="scope.row.status!=='未完成'">修改评分</el-button>
          </template>
        </el-table-column>
      </el-table>
      </el-row>
      <el-row style="margin-top:1%;">

        <el-col :span="22">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="pagination.pageNo"
            :page-size="pagination.pageSize"
            :page-sizes="[10, 2, 30, 50]"
            layout="total, sizes, prev, pager, next, jumper "
            :total="pagination.totalCount" style="text-align: right">
          </el-pagination>
        </el-col>
      </el-row>
    </div>
    <el-dialog title="开始质检评分" :visible.sync="dialogFormVisible" width="80%" @close="cleanInfo()" append-to-body>
      <div >正在对：{{taskId}} 进行操作</div>
      <div >
          <audio 
                  controls="controls"
                  v-bind:src="addScopeUrl">
          </audio>
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
                width="55"
                align="center"
                type="index"
                label="序号">
              </el-table-column>
              <el-table-column
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
                align="center"
                prop="recordId"
                label="记录编号">
              </el-table-column>
              <el-table-column
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
              <el-card class="box-card"
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
                <el-tabs :data="orderData"
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
      <div slot="footer" class="dialog-footer" style="text-align:center">
       <el-button type="primary" @click="toAddQCGradeRecord(1)">完成质检</el-button>
        <el-button @click="toAddQCGradeRecord(0)">存草稿</el-button>
        <el-button type="danger" @click="reLoad('dialogFormVisible')">重置</el-button>
      </div>
    </el-dialog>


    <el-dialog title="修改质检评分" :visible.sync="dialogFormVisibleReverse" width="80%"  @close="cleanInfo()" append-to-body>
      <div>正在对：{{taskId}} 进行操作</div>
      <div >
          <audio 
                  controls="controls"
                  v-bind:src="addScopeUrl">
          </audio>
      </div>
      <div >接触记录</div>
      <el-row>

      <el-table
              :header-row-style="headerRow"
              :data="contactRecordData"
              ref="multipleTable"
              tooltip-effect="dark"
              border
              style="width:100%;"
              @selection-change="handleSelectionChange">
              <el-table-column
                width="55"
                align="center"
                type="index"
                label="序号">
              </el-table-column>
              <el-table-column
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
                align="center"
                prop="recordId"
                label="记录编号">
              </el-table-column>
              <el-table-column
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
      <el-row style="margin-top:2%;margin-down:2%">
        <el-col style="width:25%">
              <el-card class="box-card"
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
                <el-tabs :data="orderData"
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
      <div slot="footer" class="dialog-footer" style="text-align:center">
       <el-button type="primary" @click="toEditQCGradeRecord(1)">完成质检</el-button>
        <el-button @click="toEditQCGradeRecord(0)">存草稿</el-button>
        <el-button type="danger" @click="reLoad('dialogFormVisibleReverse')">重置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { findQualityTaskByInfo, getMarksByTaskId, getGradeListByGradeId, querycustomerbyid, queryrecordbytaskid, queryOrder, addQCGradeRecord, editQCGradeRecord, getGradeByGradeId, repalceString } from '@/api/qm_quailitymark'
  import { formatDateTime } from '@/utils/tools'

  export default {
    name: 'qm_quailitymark',
    data() {
      return {
        taskId: '',
        row: {},
        activeName: '',
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
        timeValue1: '',
        timeValue2: '',
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
        customerData: {},
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
          status: '0',
          pageSize: 10,
          pageNo: 1,
          start_time: '',
          end_time: '',
          staffId: '',
          taskId: '',
          complete_start: '',
          complete_end: '',
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
        this.timeValue1 = ''
        this.timeValue2 = ''
        this.formInline = {
          taskId: '',
          modifierName: '',
          status: '0',
          pageNo: this.pagination.pageNo
        }
      },
      handleClickDetail(row) {
        this.row = row
        this.dialogFormVisibleReverse = true
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
        this.addScopeUrl = ''
        this.comment = []
        this.gradeInfo = []
        this.totalAmountMap = new Map()
        this.totalAmount = new Map()
        this.totalCheckMap = new Map()
        this.totalCheck = new Map()
      },
      /** 获取通话记录 */
      getContactRecord(row) {
        queryrecordbytaskid({ 'taskId': row.contactTaskId, 'campaignId': row.activityId }).then(response => {
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
        getMarksByTaskId({ 'taskId': row.id }).then(response => {
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
      handleClick(row) {
        this.row = row
        this.dialogFormVisible = true
        this.addUrlData = {
          id: row.id
        }
        this.totalAmountMap = new Map()
        this.totalAmount = new Map()
        this.getContactRecord(row)
        this.getCustomerInfo(row)
        this.getOrderInfo(row)
        this.getMarks(row, 0)
      },
      handleSizeChange(val) {
        this.formInline.pageSize = val
        this.formInline.start_time = this.timeValue1[0]
        this.formInline.end_time = this.timeValue1[1]
        this.formInline.complete_start = this.timeValue2[0]
        this.formInline.complete_end = this.timeValue2[1]
        this.formInline.staffId = localStorage.getItem('agentId')
        this.pagination.pageNo = 1
        findQualityTaskByInfo(this.formInline).then(response => {
          this.queryGradeList(response)
        })
      },
      handleCurrentChange(val) {
        this.formInline.pageNo = val
        this.formInline.start_time = this.timeValue1[0]
        this.formInline.end_time = this.timeValue1[1]
        this.formInline.complete_start = this.timeValue2[0]
        this.formInline.complete_end = this.timeValue2[1]
        this.formInline.staffId = localStorage.getItem('agentId')
        findQualityTaskByInfo(this.formInline).then(response => {
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
        this.pagination = res.data.pageInfo
        if (this.tableData.length !== 0) {
          for (let i = 0; i <= this.tableData.length; i++) {
            if (this.tableData[i]) {
              this.tableData[i].touchTime = this.tableData[i].touchTime === null ? '' : formatDateTime(this.tableData[i].touchTime)
              this.tableData[i].modifierTime = this.tableData[i].modifierTime === null ? '' : formatDateTime(this.tableData[i].modifierTime)
              this.tableData[i].staffDistributeTime = this.tableData[i].staffDistributeTime === null ? '' : formatDateTime(this.tableData[i].staffDistributeTime)
              const tableStatus = this.tableData[i].status
              switch (tableStatus) {
                case 0: this.tableData[i].status = '未完成'
                  this.tableData[i].gradeStatus = true
                  break
                case 1: this.tableData[i].status = '已完成'
                  this.tableData[i].gradeStatus = false
                  break
                case 2: this.tableData[i].status = '草稿'
                  this.tableData[i].gradeStatus = false
                  break
                default: this.tableData[i].status = '未完成'
                  this.tableData[i].gradeStatus = true
                  break
              }
            }
          }
        } else {
          console.log('查不到符合条件的数据')
        }
      },
      searchTask(req) {
        // 根据老版本的逻辑 查询只能传分页页码的第一页
        req.pageNo = 1
        req.start_time = this.timeValue1[0]
        req.end_time = this.timeValue1[1]
        req.complete_start = this.timeValue2[0]
        req.complete_end = this.timeValue2[1]
        req.staffId = localStorage.getItem('agentId')
        req.status = this.formInline.status
        findQualityTaskByInfo(req).then(response => {
          this.queryGradeList(response)
        })
      },
      queryrecordbytaskid(req) {
        // 根据老版本的逻辑 查询只能传分页页码的第一页
        findQualityTaskByInfo(req).then(response => {
          this.queryGradeList(response)
        })
      }
    },
    mounted() {
      this.searchTask({ })
    }
  }
</script>

