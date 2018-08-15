<template>
  <div>
    <!-- 管理主页div -->
    <div class="container" style="padding:0 20px;" v-show="isMainPage===true && isDetail === false">
      <el-row>
        <el-form :inline="true" size="small">
          <el-form-item label="问卷模板名称">
            <el-input type="text" v-model="req.name" size="medium" placeholder="问卷模板名称"></el-input>
          </el-form-item>
          <el-form-item label="操作人">
            <el-input type="text" v-model="req.modifier" size="medium" placeholder="操作人"></el-input>
          </el-form-item>
          <el-form-item label="操作时间">
            <el-date-picker
                v-model="timeValue"
                type="datetimerange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="req.pageNo=1;searchByKeyWords(req)">筛选</el-button>
            <el-button type="danger"  @click="resetQueryCondition()" icon="el-icon-refresh">重置</el-button>
          </el-form-item>
        </el-form>
      </el-row>

      <el-row>
        <el-col>
          <el-table :data="tableData" border @selection-change="handleSelectionChange">
            <el-table-column align="center" type="selection" width="55"></el-table-column>
            <el-table-column align="center" label="序号" width="55">
              <template slot-scope="scope">
                <div>{{scope.$index+(req.pageNo-1)*10+1}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="问卷模板名称" width="350px" >
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" placement="top">
                  <div slot="content">{{scope.row.name}}</div>
                  <el-button type="text" size="medium" @click="checkDetail(scope.row.id)">{{scope.row.name}}</el-button>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作人" width="" prop="modifier">

            </el-table-column>
            <el-table-column align="center" label="操作时间" width="" >
              <template slot-scope="scope">
                <div v-html="formatDateTime(scope.row.modifyTime)"></div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button type="text" icon="el-icon-edit" size="medium" @click="showeditDetails(scope.row.id);singelItems=[];multiItems=[];fillBlanks=[]">修改</el-button>
                <el-button type="text" size="medium" @click="deleteReq.id=scope.row.id;deleteVisiable=true">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <el-row style="margin-top:5px;">
        <el-button type="success" size="small" @click="questionnaireName='';questionnaireTitleVisiable=true" icon="el-icon-plus">新建问卷模板</el-button>
        <el-button type="danger" size="small" @click="isSelectIds(batchdel.ids)" icon="el-icon-minus">批量删除</el-button>
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

      <!-- 新建问卷dialog -->
      <el-dialog width="30%" title="新建问卷模板" :visible.sync="questionnaireTitleVisiable" append-to-body>
        <span style="color:red">*</span><span style="font-size:15px;">问卷模板标题：</span>
        <el-input type="text" placeholder="请输入问卷模板标题" size="medium" v-model="questionnaireName" maxlength="45"></el-input>
        <div slot="footer" class="dialog-footer" style="text-align: center;">
          <el-button type="primary" @click="checkTitleIsNullOrNot();questionnaireTitleVisiable = false">确定</el-button>
          <el-button @click="questionnaireTitleVisiable = false">取消</el-button>
        </div>
      </el-dialog>

      <!-- 删除dialog -->
      <el-dialog width="30%" title="删除提示" :visible.sync="deleteVisiable" append-to-body>
        <span style="font-size:15px;">确定删除此问卷模板？</span>
        <div slot="footer" class="dialog-footer" style="text-align: right;">
          <el-button type="primary" @click="deleteVisiable = false;deleteQuestionnaire(deleteReq.id);">确定</el-button>
          <el-button @click="deleteVisiable = false">取消</el-button>
        </div>
      </el-dialog>

      <!-- 批量删除dialog -->
      <el-dialog width="30%" title="删除提示" :visible.sync="batchdeleteVisiable" append-to-body>
        <span style="font-size:15px;">确定删除这些问卷模板？</span>
        <div slot="footer" class="dialog-footer" style="text-align: right;">
          <el-button type="primary" @click="batchdeleteVisiable = false;batchdeleteQuestionnaire(batchdel.ids);">确定</el-button>
          <el-button @click="batchdeleteVisiable = false">取消</el-button>
        </div>
      </el-dialog>

    </div>

    <!-- 新建问卷div -->
    <div class='container' style="padding:0 20px;" v-show="isMainPage===false && isDetail === false">
      <div class="fixedButton"><br/>
        <el-button @click="addSingleCheck();" type="primary" size="medium" round icon="el-icon-plus">单选</el-button>
        <el-button @click="addMultiCheck();" type="primary" size="medium" round icon="el-icon-plus">多选</el-button>
        <el-button @click="addFillBlank();" type="primary" size="medium" round icon="el-icon-plus">填空</el-button>
      </div>
      <hr/>
      <el-row type="flex">
        <el-col :span="3"></el-col>
        <el-col :span="18" class="quest">
          <div style="text-align:center">
              <h2>{{this.questionnaireName}}</h2>
          </div><br/>
          <div style="margin-left:0">
                <el-form>
                  <!--  单选  -->
                  <h5 style="float:left" v-if="this.singelItems.length > 0">&nbsp;&nbsp;&nbsp;&nbsp;单选:</h5><br/>
                    <div style="margin-left:25%">
                      <el-form-item v-for="(item,index) in singelItems">
                        <el-input v-model="item.name" placeholder="标题(45个字符内)" style="width:480px" clearable maxlength="45"></el-input>
                        <el-tooltip class="item" effect="dark" content="点击删除该单选题" placement="right-start">
                          <el-button class="myButton" size="medium" icon="el-icon-error" @click="removeSingle(index)"  circle></el-button>
                        </el-tooltip>
                        <div v-for="(a,radioIndex) in item.options">
                          <el-radio label="1" name="1"  disabled>
                            <el-input type="text" placeholder='选项(45个字符内)' style="width:456px" v-model="a.content" clearable maxlength="45"></el-input>
                          </el-radio>
                          <el-tooltip class="item" effect="dark" content="点击删除该单选项" placement="right-start">
                            <el-button class="myButton" size="small" icon="el-icon-minus" @click="removeRadio(item.options,radioIndex)" circle></el-button>
                          </el-tooltip>
                        </div>
                        <div style="margin-left:20%">
                          <el-tooltip class="item" effect="dark" content="添加一个单选项" placement="right-start">
                            <el-button class="myButton" size="mini" icon="el-icon-plus" @click="addRadio(item.options)" circle ></el-button>
                          </el-tooltip>
                        </div>
                      </el-form-item>
                    </div>
                  
                  <!--  多选  -->
                  <h5 style="float:left" v-if="this.multiItems.length > 0">&nbsp;&nbsp;&nbsp;&nbsp;多选:</h5><br/>
                  <div style="margin-left:25%">
                    <el-form-item v-for="(item,index) in multiItems">
                      <el-input v-model="item.name" placeholder="标题(45个字符内)" style="width:480px" clearable maxlength="45"></el-input>
                      <el-tooltip class="item" effect="dark" content="点击删除该多选题" placement="right-start">
                        <el-button class="myButton" size="medium" icon="el-icon-error" @click="removeMulti(index)"  circle></el-button>
                      </el-tooltip>
                      <div v-for="(a,checkboxIndex) in item.options">
                        <el-checkbox disabled checked>
                        <el-input type="text" placeholder='选项(45个字符内)' style="width:456px;" v-model="a.content" clearable maxlength="45"></el-input>
                        <el-tooltip class="item" effect="dark" content="点击删除该多选项" placement="right-start">
                          <el-button class="myButton" size="small" icon="el-icon-minus" @click="removeCheckbox(item.options,checkboxIndex)" circle></el-button>
                        </el-tooltip>
                      </el-checkbox>
                      </div>
                      <div style="margin-left:20%">
                        <el-tooltip class="item" effect="dark" content="添加一个多选项" placement="right-start">
                          <el-button class="myButton" size="small" icon="el-icon-plus" @click="addCheckbox(item.options)" circle></el-button>
                        </el-tooltip>
                      </div>
                    </el-form-item>
                  </div>

                  <!--  填空  -->
                  <h5 style="float:left" v-if="this.fillBlanks.length > 0">&nbsp;&nbsp;&nbsp;&nbsp;填空:</h5><br/>
                  <div style="margin-left:25%">
                    <el-form-item v-for="(item,index) in fillBlanks">
                      <el-input v-model="item.name" placeholder="标题(45个字符内)" style="width:480px" clearable maxlength="45"></el-input>
                      <el-tooltip class="item" effect="dark" content="点击删除该问答题" placement="right-start">
                        <el-button class="myButton" size="medium" icon="el-icon-error" @click="removeBlanks(index)"  circle></el-button>
                      </el-tooltip>
                      <div v-for="(a,blankIndex) in item.options">
                        <el-input type="text" placeholder='回答(45个字符内)' style="width:480px" v-model="a.content" clearable maxlength="45"></el-input>
                      </div>
                    </el-form-item>
                  </div>
                </el-form>
                <br/>
                <div style="margin-left:40%">
                  <el-button type="success" size="medium" @click="makeQuestionnaire(questionnaireName,singelItems,multiItems,fillBlanks)" icon="el-icon-check">生成问卷</el-button>
                  <el-button type="primary" size="medium" @click="isMainPage=true;isDetail=false;questionnaireName='';singelItems=[];multiItems=[];fillBlanks=[]">取消</el-button>
                </div>
          </div>
        </el-col>
        <el-col :span="3"></el-col>
      </el-row>
    </div>

    <!-- 问卷详情div -->
    <div  class='container' style="padding:0 20px;" v-show="isMainPage===true && isDetail===true">
      <div style="text-align:center">
        <h2>{{this.oneDetails.name}}</h2>
        <!-- <span>
          非常感谢您的参与！如有涉及个人信息，我们将严格保密。
        </span> -->
        <span>{{this.oneDetails.modifier}}</span>&nbsp;&nbsp;<span>{{formatDateTime(this.oneDetails.modifyTime)}}</span>
      </div><hr/>
      <el-row type="flex">
        <el-col :span="3"></el-col>
        <el-col :span="18" class="quest">
          <div style="margin-left:0">
            <el-form>
                  <!--  单选  -->
                  <h5 style="float:left" v-if="hasSingle===true">&nbsp;&nbsp;&nbsp;&nbsp;单选:</h5><br/>
                  <div style="margin-left:15%">
                    <el-form-item v-for="(item,index) in oneDetails.titles" v-if="item.type===0">
                    <span v-model="item.name" placeholder="标题" style="width:300px">{{index+1}}.&nbsp;{{item.name}}</span>
                    <div v-for="(a,radioIndex) in item.options">
                      <el-radio disabled>
                      </el-radio>
                        <span style="width:300px">{{a.content}}</span>
                    </div>
                    </el-form-item>
                  </div>
                  
                  <!--  多选  -->
                  <h5 style="float:left" v-if="hasMulti===true">&nbsp;&nbsp;&nbsp;&nbsp;多选:</h5><br/>
                  <div style="margin-left:15%">
                  <el-form-item v-for="(item,index) in oneDetails.titles" v-if="item.type===1">
                    <span v-model="item.name" placeholder="标题" style="width:300px">{{index+1}}.&nbsp;{{item.name}}</span>
                    <div v-for="(a,checkboxIndex) in item.options">
                      <el-checkbox disabled checked>
                      </el-checkbox>
                      <span style="width:300px">{{a.content}}</span>
                    </div>
                  </el-form-item>
                  </div>

                  <!--  问答  -->
                  <h5 style="float:left" v-if="hasBlanks===true">&nbsp;&nbsp;&nbsp;&nbsp;问答:</h5><br/>
                  <div style="margin-left:15%">
                  <el-form-item v-for="(item,index) in oneDetails.titles" v-if="item.type===2">
                    <span v-model="item.name" placeholder="标题" style="width:300px">{{index+1}}.&nbsp;{{item.name}}</span>
                    <div v-for="(a,blankIndex) in item.options">
                      <el-input type="text" placeholder='回答' style="width:500px" v-model="a.content" disabled></el-input>
                      <!-- <span style="width:300px">{{a.content}}</span> -->
                    </div>
                  </el-form-item>
                  </div>
            </el-form>
            <div style="margin-left:45%">
              <el-button type="primary" size="medium" @click="isMainPage=true;isDetail=false;">返回</el-button><br/><br/>
            </div>
          </div>
        </el-col>
        <el-col :span="3"></el-col>
      </el-row>
    </div>

    <!-- 修改问卷div -->
    <div class='container' style="padding:0 20px;" v-show="isMainPage===false && isDetail===true">
      <div class="fixedButton"><br/>
        <el-button @click="addSingleCheck();" type="primary" size="medium" round icon="el-icon-plus">单选</el-button>
        <el-button @click="addMultiCheck();" type="primary" size="medium" round icon="el-icon-plus">多选</el-button>
        <el-button @click="addFillBlank();" type="primary" size="medium" round icon="el-icon-plus">填空</el-button>
      </div>
      <hr/>
      <el-row type="flex">
        <el-col :span="3"></el-col>
        <el-col :span="18" class="quest">
          <div style="text-align:center">
            <h2>{{this.questionnaireName}}&nbsp;
              <el-tooltip class="item" effect="dark" content="修改问卷模板标题" placement="right-start">  
                <el-button type="primary" icon="el-icon-edit-outline" @click="editQuestionnaireName=true;" size="mini" circle></el-button>
              </el-tooltip>  
            </h2>
          </div><br/>
          <div style="margin-left:0">
                <el-form>
                  <!--  单选  -->
                  <h5 style="float:left" v-if="this.singelItems.length > 0">&nbsp;&nbsp;&nbsp;&nbsp;单选:</h5><br/>
                  <div style="margin-left:25%">
                    <el-form-item v-for="(item,index) in singelItems">
                      <el-input v-model="item.name" placeholder="标题" style="width:480px" clearable maxlength="45"></el-input>
                      <el-tooltip class="item" effect="dark" content="点击删除该单选题" placement="right-start">
                        <el-button class="myButton" size="medium" icon="el-icon-error" @click="removeSingle(index)"  circle></el-button>
                      </el-tooltip>
                      <div v-for="(a,radioIndex) in item.options">
                        <el-radio label="1" name="1"  disabled>
                          <el-input type="text" placeholder='选项' style="width:456px" v-model="a.content" clearable maxlength="45"></el-input>
                        </el-radio>
                        <el-tooltip class="item" effect="dark" content="点击删除该单选项" placement="right-start">
                          <el-button class="myButton" size="small" icon="el-icon-minus" @click="removeRadio(item.options,radioIndex)" circle></el-button>
                        </el-tooltip>
                      </div>
                      <div style="margin-left:20%">
                        <el-tooltip class="item" effect="dark" content="添加一个单选项" placement="right-start">
                          <el-button class="myButton" size="mini" icon="el-icon-plus" @click="addRadio(item.options)" circle ></el-button>
                        </el-tooltip>
                      </div>
                    </el-form-item>
                  </div>
                  
                  <!--  多选  -->
                  <h5 style="float:left" v-if="this.multiItems.length > 0">&nbsp;&nbsp;&nbsp;&nbsp;多选:</h5><br/>
                  <div style="margin-left:25%">
                    <el-form-item v-for="(item,index) in multiItems">
                      <el-input v-model="item.name" placeholder="标题" style="width:480px" clearable maxlength="45"></el-input>
                      <el-tooltip class="item" effect="dark" content="点击删除该多选题" placement="right-start">
                        <el-button class="myButton" size="medium" icon="el-icon-error" @click="removeMulti(index)"  circle></el-button>
                      </el-tooltip>
                      <div v-for="(a,checkboxIndex) in item.options">
                        <el-checkbox checked disabled>
                        <el-input type="text" placeholder='选项' style="width:456px;" v-model="a.content" clearable maxlength="45"></el-input>
                        <el-tooltip class="item" effect="dark" content="点击删除该多选项" placement="right-start">
                          <el-button class="myButton" size="small" icon="el-icon-minus" @click="removeCheckbox(item.options,checkboxIndex)" circle></el-button>
                        </el-tooltip>
                      </el-checkbox>
                      </div>
                      <div style="margin-left:20%">
                        <el-tooltip class="item" effect="dark" content="添加一个多选项" placement="right-start">
                          <el-button class="myButton" size="small" icon="el-icon-plus" @click="addCheckbox(item.options)" circle></el-button>
                        </el-tooltip>
                      </div>
                    </el-form-item>
                  </div>

                  <!--  问答  -->
                  <h5 style="float:left" v-if="this.fillBlanks.length > 0">&nbsp;&nbsp;&nbsp;&nbsp;问答:</h5><br/>
                  <div style="margin-left:25%">
                    <el-form-item v-for="(item,index) in fillBlanks">
                      <el-input v-model="item.name" placeholder="标题" style="width:480px" clearable maxlength="45"></el-input>
                      <el-tooltip class="item" effect="dark" content="点击删除该问答题" placement="right-start">
                        <el-button class="myButton" size="medium" icon="el-icon-error" @click="removeBlanks(index)"  circle></el-button>
                      </el-tooltip>
                      <div v-for="(a,blankIndex) in item.options">
                        <el-input type="text" placeholder='回答' style="width:480px" v-model="a.content" clearable maxlength="45"></el-input>
                      </div>
                    </el-form-item>
                  </div>
                </el-form>
                <div style="margin-left:40%">
                  <el-button type="success" size="medium" @click="editQuestionnaire(editQuestionnaireId,questionnaireName,singelItems,multiItems,fillBlanks)" icon="el-icon-edit">修改问卷模板</el-button>
                  <el-button type="primary" size="medium" @click="isMainPage=true;isDetail=false;questionnaireName='';singelItems=[];multiItems=[];fillBlanks=[]">返回</el-button>
                </div>

                <!-- 修改问卷模板名称dialog -->
                <el-dialog width="30%" title="修改问卷模板名称" :visible.sync="editQuestionnaireName" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
                  <span style="color:red">*</span><span style="font-size:15px;">问卷模板标题：</span>
                  <el-input maxlength="45" type="text" placeholder="请输入问卷模板标题" size="medium" v-model="questionnaireName" clearable @change="checkEditName(questionnaireName);"></el-input>
                  <div slot="footer" class="dialog-footer" style="text-align: center;">
                    <span style="color:red" v-if="hasQuestionnaireName===false">模板名称不能为空</span>
                    <el-button type="primary" @click="editQuestionnaireName=false" v-if="hasQuestionnaireName===true">确定</el-button>
                    <el-button @click="editQuestionnaireName = false" v-if="hasQuestionnaireName===true">取消</el-button>
                  </div>
                </el-dialog>
          </div>
        </el-col>
        <el-col :span="3"></el-col>
      </el-row>
    </div>
  </div>
</template>

<style rel='stylesheet/scss' lang="scss" scoped>
.quest{
  border:1px solid #ddd;
  -webkit-box-shadow:5px 0 0 #888;
  box-shadow:5px 5px 5px 0px #888;
  min-height:75vh;
  margin-bottom: 3vh;
}
.myButton{
  padding: 5px;
  border:none
}
</style>

<script>
import { formatDateTime } from '@/utils/tools'
import {
  queryByKeyWords,
  generateQuestionnaire,
  deleteOneQuestionnaire,
  deleteQuestionnaires,
  queryOneQuestionnaire,
  modifyQuestionnaire
} from '@/api/questionnaire_management'

export default {
  name: 'questionnaire_management',

  data() {
    return {
      isMainPage: true, // 判断是否是管理主页
      isDetail: false, // 判断是否是详情
      tableData: [], // 表格数据
      pageShow: false, // 分页显示与否
      pageInfo: {}, // 分页信息
      timeValue: '', // 查询时间显示
      // singleIndex: '', // 单选题目序号
      // multiIndex: '', // 多选题序号
      // blanksIndex: '', // 问答题序号
      hasSingle: false,
      hasMulti: false,
      hasBlanks: false,
      req: {
        name: '', // 问卷模板名称
        modifier: '', // 操作人
        beginTime: '', // 操作时间开始
        afterTime: '', // 操作时间结束
        pageNo: 1
      },
      deleteReq: {
        id: ''
      },
      batchdel: {
        ids: []
      },
      questionnaireTitleVisiable: false, // 新建问卷标题dialog
      deleteVisiable: false, // 删除dialog显示与否
      batchdeleteVisiable: false, // 批量删除dialog显示与否
      editQuestionnaireName: false, // 修改问卷模板名称dialog显示与否
      hasQuestionnaireName: true, // 判断有无名称
      editQuestionnaireId: '', // 需要修改的问卷模板id
      questionnaireName: '', // 新建问卷名称
      singelItems: [], // 单选 所有选项
      multiItems: [], // 多选 所有选项
      fillBlanks: [], // 填空 所有选项
      singleCheck: false,
      multiCheck: false,
      blanksCheck: false,
      oneDetails: {
        // 单个问卷详情数据
        modifier: '',
        modifyTime: '',
        name: '',
        titles: []
      }
    }
  },

  methods: {
    // 重置查询条件
    resetQueryCondition() {
      this.timeValue = ''
      this.req = {
        name: '', // 问卷模板名称
        modifier: '', // 操作人
        beginTime: '', // 操作时间开始
        afterTime: '', // 操作时间结束
        pageNo: 1
      }
    },
    // 添加单选
    addSingleCheck() {
      this.singelItems.push({
        type: '0',
        name: '',
        options: [
          {
            content: ''
          }
        ]
      })
    },
    // 添加多选
    addMultiCheck() {
      this.multiItems.push({
        type: '1',
        name: '',
        options: [
          {
            content: ''
          }
        ]
      })
    },
    // 添加填空
    addFillBlank() {
      this.fillBlanks.push({
        type: '2',
        name: '',
        options: [
          {
            content: ''
          }
        ]
      })
    },
    removeSingle(index) {
      this.singelItems.splice(index, 1)
    },
    removeRadio(a, index) {
      a.splice(index, 1)
    },
    addRadio(options) {
      options.push({
        content: ''
      })
    },
    removeMulti(index) {
      this.multiItems.splice(index, 1)
    },
    removeCheckbox(a, index) {
      a.splice(index, 1)
    },
    addCheckbox(options) {
      options.push({
        content: ''
      })
    },
    removeBlanks(index) {
      this.fillBlanks.splice(index, 1)
    },
    // removeBlank(a, index) {
    //   a.splice(index, 1)
    // },
    // addBlank(options) {
    //   options.push({
    //     content: '回答'
    //   })
    // },

    // 生成问卷
    makeQuestionnaire(questionnaireName, singelItems, multiItems, fillBlanks) {
      if (
        singelItems.length === 0 &&
        multiItems.length === 0 &&
        fillBlanks.length === 0
      ) {
        this.$message.error('未选择任何类型！')
        return false
      } else {
        // 判断是否还有未填项
        this.hasBlanksOrNot(singelItems, multiItems, fillBlanks)
        console.log(this.singleCheck + ' ' + this.multiCheck + ' ' + this.blanksCheck)
        if (
          this.singleCheck === true &&
          this.multiCheck === true &&
          this.blanksCheck === true
        ) {
          generateQuestionnaire(
            questionnaireName,
            singelItems,
            multiItems,
            fillBlanks
          ).then(response => {
            if (response.data.code === 0) {
              this.$message.success(response.data.message)
              this.questionnaireName = ''
              this.singelItems = []
              this.multiItems = []
              this.fillBlanks = []
              this.req.modifier = ''
              this.req.name = ''
              this.req.beginTime = ''
              this.req.afterTime = ''
              this.req.pageNo = 1
              this.searchByKeyWords(this.req)
              this.isMainPage = true
              this.isDetail = false
            } else {
              this.$message.error(response.data.message)
            }
          })
        } else {
          this.$message.error('当前页面还有信息未完善！')
          return false
        }
      }
    },
    // 判断名称是否为空
    checkEditName(questionnaireName) {
      if (
        questionnaireName === '' ||
        questionnaireName.split(' ').join('').length === 0
      ) {
        this.hasQuestionnaireName = false
      } else {
        this.hasQuestionnaireName = true
      }
    },
    // 修改问卷模板
    editQuestionnaire(
      editQuestionnaireId,
      questionnaireName,
      singelItems,
      multiItems,
      fillBlanks
    ) {
      if (
        singelItems.length === 0 &&
        multiItems.length === 0 &&
        fillBlanks.length === 0
      ) {
        this.$message.error('未选择任何类型！')
        return false
      } else {
        // 判断是否还有未填项
        this.hasBlanksOrNot(singelItems, multiItems, fillBlanks)
        console.log(this.singleCheck + ' ' + this.multiCheck + ' ' + this.blanksCheck)
        if (
          this.singleCheck === true &&
          this.multiCheck === true &&
          this.blanksCheck === true
        ) {
          modifyQuestionnaire(
            editQuestionnaireId,
            questionnaireName,
            singelItems,
            multiItems,
            fillBlanks
          ).then(response => {
            if (response.data.code === 0) {
              this.$message.success(response.data.message)
              this.questionnaireName = ''
              this.singelItems = []
              this.multiItems = []
              this.fillBlanks = []
              this.req.modifier = ''
              this.req.name = ''
              this.req.beginTime = ''
              this.req.afterTime = ''
              this.req.pageNo = 1
              this.searchByKeyWords(this.req)
              this.isMainPage = true
              this.isDetail = false
            } else {
              this.$message.error(response.data.message)
            }
          })
        } else {
          this.$message.error('当前页面还有信息未完善！')
          return false
        }
      }
    },
    // 综合查询
    searchByKeyWords(req) {
      req.beginTime = this.timeValue[0]
      req.afterTime = this.timeValue[1]
      queryByKeyWords(req).then(response => {
        if (response.data.code === 0) {
          this.tableData = response.data.data
          this.pageShow = true
          this.pageInfo = response.data.pageInfo
        } else {
          this.pageShow = false
          this.$message.error('无查询结果，请核对查询条件')
        }
      })
    },
    // 翻页
    handleCurrentChange(val) {
      this.req.pageNo = val
      this.searchByKeyWords(this.req)
    },
    // 表格多选
    handleSelectionChange(val) {
      this.batchdel.ids.length = 0
      for (var i = 0; i < val.length; i++) {
        this.batchdel.ids.push(val[i].id)
      }
    },
    // 格式化时间
    formatDateTime: formatDateTime,

    // 查询详情
    checkDetail(id) {
      this.hasSingle = false
      this.hasMulti = false
      this.hasBlanks = false
      queryOneQuestionnaire(id)
        .then(response => {
          if (response.data.code === 0) {
            this.oneDetails.name = response.data.data.name
            this.oneDetails.modifier = response.data.data.modifier
            this.oneDetails.modifyTime = formatDateTime(
              response.data.data.modifyTime
            )
            this.oneDetails.titles = response.data.data.titles
            for (var i = 0; i < response.data.data.titles.length; i++) {
              if (response.data.data.titles[i].type === 0) {
                this.hasSingle = true
              }
              if (response.data.data.titles[i].type === 1) {
                this.hasMulti = true
              }
              if (response.data.data.titles[i].type === 2) {
                this.hasBlanks = true
              }
            }
            this.isMainPage = true
            this.isDetail = true
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 展示修改问卷div
    showeditDetails(id) {
      this.singelItems.length = 0
      this.multiItems.length = 0
      this.fillBlanks.length = 0
      this.singelItems = []
      this.multiItems = []
      this.fillBlanks = []
      queryOneQuestionnaire(id).then(response => {
        if (response.data.code === 0) {
          this.questionnaireName = response.data.data.name
          this.editQuestionnaireId = response.data.data.id
          for (var i = 0; i < response.data.data.titles.length; i++) {
            if (response.data.data.titles[i].type === 0) {
              this.singelItems.push(response.data.data.titles[i])
            } else if (response.data.data.titles[i].type === 1) {
              this.multiItems.push(response.data.data.titles[i])
            } else if (response.data.data.titles[i].type === 2) {
              this.fillBlanks.push(response.data.data.titles[i])
            }
          }
          this.isMainPage = false
          this.isDetail = true
        }
      })
    },
    // 判断页面是否还有未填的项
    hasBlanksOrNot(singelItems, multiItems, fillBlanks) {
      this.singleCheck = false
      this.multiCheck = false
      this.blanksCheck = false
      if (singelItems.length > 0) {
        for (var i = 0; i < singelItems.length; i++) {
          if (singelItems[i].name !== '') {
            for (var j = 0; j < singelItems[i].options.length; j++) {
              if (singelItems[i].options[j].content === '') {
                this.singleCheck = false
                return
              } else {
                this.singleCheck = true
              }
            }
          } else {
            this.singleCheck = false
            return
          }
        }
      } else {
        this.singleCheck = true
      }

      if (multiItems.length > 0) {
        for (var k = 0; k < multiItems.length; k++) {
          if (multiItems[k].name !== '') {
            for (var a = 0; a < multiItems[k].options.length; a++) {
              if (multiItems[k].options[a].content === '') {
                this.multiCheck = false
                return
              } else {
                this.multiCheck = true
              }
            }
          } else {
            this.multiCheck = false
            return
          }
        }
      } else {
        this.multiCheck = true
      }

      if (fillBlanks.length > 0) {
        for (var b = 0; b < fillBlanks.length; b++) {
          if (fillBlanks[b].name !== '') {
            for (var c = 0; c < fillBlanks[b].options.length; c++) {
              if (fillBlanks[b].options[c].content === '') {
                this.blanksCheck = false
                return
              } else {
                this.blanksCheck = true
              }
            }
          } else {
            this.blanksCheck = false
            return
          }
        }
      } else {
        this.blanksCheck = true
      }
    },
    // 删除
    deleteQuestionnaire(id) {
      deleteOneQuestionnaire(id)
        .then(response => {
          if (response.data.code === 0) {
            this.$message.success(response.data.message)
            this.deleteVisiable = false
            this.searchByKeyWords(this.req)
          } else {
            this.$message.error(response.data.message)
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 判断是否勾选了checkbox
    isSelectIds(ids) {
      if (ids.length === 0) {
        this.$message.error('未选择任何问卷！')
      } else {
        this.batchdeleteVisiable = true
      }
    },
    // 批量删除
    batchdeleteQuestionnaire(ids) {
      deleteQuestionnaires(ids)
        .then(response => {
          if (response.data.code === 0) {
            this.$message.success(response.data.message)
            this.batchdeleteVisiable = false
            this.searchByKeyWords(this.req)
          } else {
            this.$message.error(response.data.message)
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 判断问卷标题名是否为空
    checkTitleIsNullOrNot() {
      if (this.questionnaireName === '') {
        this.$message.error('请先输入问卷标题！')
      } else {
        this.isMainPage = false
        this.isDetail = false
      }
    }
  },

  mounted() {
    this.searchByKeyWords(this.req)
  },

  watch: {},

  components: {},

  mixins: [],

  vuex: {},

  created() {}
}
</script>
