<template>
  <div class="container">
    <!-- 列表 主页-->
    <div v-show="pagePosition==='1'">
      <el-collapse v-model="formContainerOpen" class="form-container" @change="handleChangeAcitve">
        <el-collapse-item title="筛选条件" name="1">
          <el-form :inline="true" size="small">
            <el-form-item label="问卷名称">
              <el-input type="text" v-model="req2.templateName" size="medium" placeholder="问卷名称（限长45字符）" maxlength="45"></el-input>
            </el-form-item>
            <el-form-item label="答卷工号">
              <el-input type="text" v-model="req2.angentId" placeholder="答卷工号（限长10字符）" maxlength="10"></el-input>
            </el-form-item>
            <el-form-item label="答卷人">
              <el-input type="text" v-model="req2.staffName" placeholder="答卷人（限长45字符）" maxlength="45"></el-input>
            </el-form-item>
            <el-form-item label="答卷时间">
              <el-date-picker
                  v-model="timeValue"
                  type="datetimerange"
                  range-separator="-"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="req2.pageNo=1;getQuestionnaireRecords(req2)">查询</el-button>
              <el-button @click="resetQueryCondition()">重置</el-button>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
      <el-row class="table-container">
        <el-row class="margin-bottom-20">
          <div class="font14 bold">问卷管理表</div>
        </el-row>
        <el-row class="margin-bottom-20">
          <el-button type="info" size="small" @click="showQuestionnaires=true;templateId=''">填写问卷</el-button>
          <el-button type="danger" size="small" @click="isSelectCkb(batchDeleteIds)">批量删除</el-button>
        </el-row>
        <el-row>
          <el-table :data="listRecords" @selection-change="handleSelectionChange">
            <el-table-column align="center" type="selection" width="55"></el-table-column>
            <el-table-column align="center" label="问卷名称">
              <template slot-scope="scope">
                <div>{{scope.row.templateName}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="答卷工号" width="150">
              <template slot-scope="scope">
                <div>{{scope.row.angentId}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="答卷人" width="250">
              <template slot-scope="scope">
                {{scope.row.staffName}}
              </template>
            </el-table-column>
            <el-table-column align="center" label="答卷时间" width="155" >
              <template slot-scope="scope">
                <div v-html="formatDateTime(scope.row.answerTime)"></div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <!-- <el-button type="text" size="medium" @click="fillQuestionnaire(scope.row.id);templateId=scope.row.id">填写</el-button>
                <el-button type="text" size="medium" @click="queryFillRecords(scope.row.id);listTemplateName=scope.row.name;listVisiable=true">查看记录</el-button> -->
                <el-button type="text" size="medium" @click="checkFillDetail(scope.row.templateId,scope.row.recordTitles)">查看详情</el-button>
                <el-button type="text" size="medium" @click="deleteVisiable=true;deleteRecordId=scope.row.id">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row style="margin-top:20px;">    
          <el-pagination
            v-if="pageShow2"
            @size-change="handleSizeChange2"
            @current-change="handleCurrentChange2"
            :current-page='pageInfo2.pageNo'
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size='req2.pageSize'
            layout="total, sizes, prev, pager, next, jumper "
            :total='pageInfo2.totalCount' style="text-align: right;float:right;">
          </el-pagination>
        </el-row>
      </el-row>
      <!-- 查看模板列表 -->
      <el-dialog width="30%" title="问卷模板" :visible.sync="showQuestionnaires" append-to-body>
        <span style="color:red">*</span><span style="font-size:15px;">请选择问卷模板：</span>
        <el-select size="small" style="width:100%;" v-model="templateId" placeholder="请选择问卷模板" clearable filterable>
          <el-option
            v-for="item in templates"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            style="width:300px"
          ></el-option>
        </el-select>
        <div slot="footer" class="dialog-footer" style="text-align: center;">
          <el-button type="primary" @click="showQuestionnaires=false;goFillQuestionnaire(templateId)">确定</el-button>
          <el-button @click="showQuestionnaires = false">取消</el-button>
        </div>
      </el-dialog>

      <!-- 删除dialog -->
      <el-dialog width="30%" title="删除提示" :visible.sync="deleteVisiable" append-to-body>
        <span style="font-size:15px;">确定删除此问卷记录？</span>
        <div slot="footer" class="dialog-footer" style="text-align: right;">
          <el-button type="primary" @click="deleteVisiable = false;deleteQuestionnaireRecord(deleteRecordId);">确定</el-button>
          <el-button type="primary" plain @click="deleteVisiable = false">取消</el-button>
        </div>
      </el-dialog>

      <!-- 批量删除dialog -->
      <el-dialog width="30%" title="批量删除提示" :visible.sync="batchdeletVisiable" append-to-body>
        <span style="font-size:15px;">确定删除这些问卷记录？</span>
        <div slot="footer" class="dialog-footer" style="text-align: right;">
          <el-button type="primary" @click="batchdeletVisiable = false;batchDeleteQuestionnaireRecord(batchDeleteIds);">确定</el-button>
          <el-button type="primary" plain @click="batchdeletVisiable = false">取消</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 填写问卷 -->
    <div v-show="pagePosition==='2'" class="question">
      <el-row type="flex">
        <el-col :span="2"></el-col>
        <el-col :span="20" >
          <el-container style="height: 750px;">
            <el-container style="margin-left:60px">
              <el-header>
                <div class="title-content-detail">
                  <span>{{this.oneDetails.name}}&nbsp;
                  </span><br/>
                  <!-- <span style="font-size: 10px;padding:30px">{{this.oneDetails.modifier}}&nbsp;&nbsp;{{formatDateTime(this.oneDetails.modifyTime)}}</span> -->
                </div>
                <div class="survey-desc">
                  <div class="desc-content">欢迎参加调查！答卷数据仅用于统计分析，请放心填写。题目选项无对错之分，按照实际情况选择即可。感谢您的帮助！</div>
                </div>

                <div class="quest-box">
                  <!--  单选  -->
                    <el-form size="small">
                      <h5 v-if="show_singleItems.length > 0">&nbsp;&nbsp;&nbsp;&nbsp;单选:</h5><br/>
                        <div style="margin-top:-8px">
                          <el-form-item v-for="(item,index) in show_singleItems" :key="index">
                            <div class="topic-type-content">
                                <span>{{index+1}}.</span>
                                <span v-model="item.name" placeholder="标题" style="width:300px">{{item.name}}</span>
                                <div v-for="(a,radioIndex) in item.options" class="options">
                                  <el-radio :label="a.content" v-model="selectOption_single[index]">
                                    {{a.content}}
                                  </el-radio>
                                </div>
                            </div>
                          </el-form-item>
                        </div>
                    </el-form>
                  

                  <!--  多选  -->
                  <el-form size="small">
                    <h5 v-if="show_multiItems.length > 0">&nbsp;&nbsp;&nbsp;&nbsp;多选:</h5><br/>
                    <div style="margin-top:-8px">
                      <el-form-item v-for="(item,index) in show_multiItems" :key="index">
                        <div class="topic-type-content">
                          <span>{{index+1}}.</span>
                          <span v-model="item.name" placeholder="标题" style="width:300px">{{item.name}}</span>
                          <!-- <div v-for="(a,checkboxIndex) in item.options" class="options">
                            <el-checkbox :label="a.content">{{a.content}}</el-checkbox>
                          </div> -->
                          <el-checkbox-group v-model="selectOption_multi[index]">
                            <el-checkbox v-for="(a,checkboxIndex) in item.options" :label="a.content">{{a.content}}</el-checkbox>
                          </el-checkbox-group>
                        </div>
                      </el-form-item>
                    </div>
                  </el-form>

                  <!--  单行填空  -->
                   <el-form size="small">
                    <h5 v-if="show_fillBlanks.length > 0">&nbsp;&nbsp;&nbsp;&nbsp;单行填空:</h5><br/>
                      <div style="margin-top:-8px">
                        <el-form-item v-for="(item,index) in show_fillBlanks" :key="index">
                          <div class="topic-type-content">
                            <span>{{index+1}}.</span>
                            <span v-model="item.name" placeholder="标题" style="width:300px">{{item.name}}</span>
                            <div v-for="(a,blankIndex) in item.options" class="options">
                              <el-input type="text" style="width:478px;margin:2px" v-model="selectOption_blanks[index]"  maxlength="45" ></el-input>
                            </div>
                          </div>
                        </el-form-item>
                      </div>
                  </el-form>

                  <!--  多行填空  -->
                   <el-form size="small">
                    <h5 v-if="show_multiBlanks.length > 0">&nbsp;&nbsp;&nbsp;&nbsp;多行填空:</h5><br/>
                      <div style="margin-top:-8px">
                        <el-form-item v-for="(item,index) in show_multiBlanks" :key="index">
                          <div class="topic-type-content">
                            <span>{{index+1}}.</span>
                            <span v-model="item.name" placeholder="标题" style="width:300px">{{item.name}}</span>
                            <div v-for="(a,blankIndex) in item.options" class="options">
                              <el-input type="textarea" rows="4"  resize="none" style="width:478px;margin:2px" v-model="selectOption_multiblanks[index]"  maxlength="45"></el-input>
                            </div>
                          </div>
                        </el-form-item>
                      </div>
                  </el-form>

                </div>
                <div class="lastbuttons" >
                  <div style="margin-top:8px">
                    <el-button type="primary" size="small" @click="completeFillQuestionnaire(templateId,oneDetails.name);" v-if="showComplete===true">完成</el-button>
                    <el-button type="primary" plain size="small" @click="pagePosition='1'">返回</el-button><br/><br/>
                  </div>
                </div>

              </el-header>
            </el-container>
          </el-container>
        </el-col>
        <el-col :span="2"></el-col>
      </el-row>
    </div>

    <!-- 问卷记录详情 -->
    <div  v-show="pagePosition==='3'" class="question">
      <el-row type="flex">
        <el-col :span="2"></el-col>
        <el-col :span="20" >
          <el-container style="height: 750px;">
            <el-container style="margin-left:60px">
              <el-header>
                <div class="title-content-detail">
                  <span>{{this.oneDetails.name}}&nbsp;
                  </span><br/>
                  <!-- <span style="font-size: 10px;padding:30px">{{this.oneDetails.modifier}}&nbsp;&nbsp;{{formatDateTime(this.oneDetails.modifyTime)}}</span> -->
                </div>
                <div class="survey-desc">
                  <div class="desc-content">欢迎参加调查！答卷数据仅用于统计分析，请放心填写。题目选项无对错之分，按照实际情况选择即可。感谢您的帮助！</div>
                </div>

                <div class="quest-box">
                  <!--  单选  -->
                    <el-form size="small">
                      <h5 v-if="show_singleItems.length > 0">&nbsp;&nbsp;&nbsp;&nbsp;单选:</h5><br/>
                        <div style="margin-top:-8px">
                          <el-form-item v-for="(item,index) in show_singleItems" :key="index">
                            <div class="topic-type-content">
                                <span>{{index+1}}.</span>
                                <span v-model="item.name" placeholder="标题" style="width:300px">{{item.name}}</span>
                                <div v-for="(a,radioIndex) in item.options" class="options">
                                  <el-radio :label="a.content" v-model="selectOption_single[index]">
                                    {{a.content}}
                                  </el-radio>
                                </div>
                            </div>
                          </el-form-item><br/>
                        </div>
                    </el-form>
                  

                  <!--  多选  -->
                  <el-form size="small">
                    <h5 v-if="show_multiItems.length > 0">&nbsp;&nbsp;&nbsp;&nbsp;多选:</h5><br/>
                    <div style="margin-top:-8px">
                      <el-form-item v-for="(item,index) in show_multiItems" :key="index">
                        <div class="topic-type-content">
                          <span>{{index+1}}.</span>
                          <span v-model="item.name" placeholder="标题" style="width:300px">{{item.name}}</span>
                          <!-- <div v-for="(a,checkboxIndex) in item.options" class="options">
                            <el-checkbox :label="a.content">{{a.content}}</el-checkbox>
                          </div> -->
                          <el-checkbox-group v-model="selectOption_multi[index]">
                            <el-checkbox v-for="(a,checkboxIndex) in item.options" :label="a.content">{{a.content}}</el-checkbox>
                          </el-checkbox-group>
                        </div>
                      </el-form-item><br/>
                    </div>
                  </el-form>

                  <!--  单行填空  -->
                   <el-form size="small">
                    <h5 v-if="show_fillBlanks.length > 0">&nbsp;&nbsp;&nbsp;&nbsp;单行填空:</h5><br/>
                      <div style="margin-top:-8px">
                        <el-form-item v-for="(item,index) in show_fillBlanks" :key="index">
                          <div class="topic-type-content">
                            <span>{{index+1}}.</span>
                            <span v-model="item.name" placeholder="标题" style="width:300px">{{item.name}}</span>
                            <div v-for="(a,blankIndex) in item.options" class="options">
                              <el-input type="text" style="width:478px;margin:2px" v-model="selectOption_blanks[index]"  maxlength="45" ></el-input>
                            </div>
                          </div>
                        </el-form-item><br/>
                      </div>
                  </el-form>

                  <!--  多行填空  -->
                   <el-form size="small">
                    <h5 v-if="show_multiBlanks.length > 0">&nbsp;&nbsp;&nbsp;&nbsp;多行填空:</h5><br/>
                      <div style="margin-top:-8px">
                        <el-form-item v-for="(item,index) in show_multiBlanks" :key="index">
                          <div class="topic-type-content">
                            <span>{{index+1}}.</span>
                            <span v-model="item.name" placeholder="标题" style="width:300px">{{item.name}}</span>
                            <div v-for="(a,blankIndex) in item.options" class="options">
                              <el-input type="textarea" rows="4"  resize="none" style="width:478px;margin:2px" v-model="selectOption_multiblanks[index]"  maxlength="45"></el-input>
                            </div>
                          </div>
                        </el-form-item>
                      </div>
                  </el-form>

                </div>
                <div class="lastbuttons" >
                  <div style="margin-top:8px">
                    <el-button type="primary" plain size="small" @click="pagePosition='1'">返回</el-button><br/><br/>
                  </div>
                </div>

              </el-header>
            </el-container>
          </el-container>
        </el-col>
        <el-col :span="2"></el-col>
      </el-row>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.title-content {
  height: 48px;
  font-size: 20px;
  text-align: center;
  line-height: 48px;
  border: 1px solid #dbdbdb;
  position: relative;
  outline: 0;
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
.survey-desc {
  border: 1px solid #dbdbdb;
  margin: 4px 0;
  display: inline-block;
  width: 100%;
  background: #fff;
  padding: 20px;
}
.desc-content {
  text-align: center;
  position: relative;
  outline: 0;
  width: 100%;
  min-height: 30px;
  line-height: 30px;
}
.quest-box {
  margin: 4px 0;
  width: 100%;
  min-height: 550px;
}
.topic-type-content {
  border: 1px solid #dbdbdb;
  margin: -5px 0;
  padding-left:50px;
  display: inline-block;
  width: 100%;
  background: #fff;
}
.options {
  padding-left: 30px;
}
.lastbuttons {
  border: 1px solid #dbdbdb;
  margin-top: 4px 0;
  width: 100%;
  text-align: center;
  height: 50px;
}
.showaddTool {
  float: right;
  margin-right: 92%;
  height: 0px;
  cursor: pointer;
  opacity: 0;
}
.showdeleteTool {
    float: right;
    margin-right: 55%;
    height: 36px;
    cursor: pointer;
    opacity: 0;
}
.editoptions {
  float: right;
  opacity: 0;
}
.showEditOption:hover .editoptions{
  opacity: 1;
}
.topic-type-content:hover .showdeleteTool,.topic-type-content:hover .showaddTool{
  opacity: 1;
}
.module {
    cursor: pointer;
    height: 35px;
    text-align: center;
    line-height: 36px;
    background: url(../../../static/images/my_imgs/question_logo.png) no-repeat;
    padding-left: 50px;
}
</style>

<style>
.question .el-input__inner:focus{
  border: 1px solid #000;
  background:rgb(253, 249, 205);
}
.question .el-input__inner:hover{
  background:rgb(253, 249, 205);
}
.question .el-textarea__inner:focus{
  background:rgb(253, 249, 205);
}
.question .el-textarea__inner:hover{
  background:rgb(253, 249, 205);
}

</style>

<script>
import { formatDateTime } from '@/utils/tools'
import {
  queryByKeyWords,
  queryOneQuestionnaire,
  generateQuestionnaireRecord,
  queryQuestionnaireRecords,
  deleteOneRecord,
  batchDeleteRecords
} from '@/api/questionnaire'
export default {
  name: 'questionnaire',

  data() {
    return {
      formContainerOpen: '1',
      formContainer: this.$store.state.app.formContainer,
      showQuestionnaires: false, // 填写问卷选择模板dialog
      listTemplateName: '', // 记录列表模板名称
      pagePosition: '1', // 是否是主页 1：列表主页  2:填写页面
      templates: [], // 问卷模板数据
      listRecords: [], // 记录列表数据
      pageShow: false, // 分页显示与否
      pageShow2: false, // 分页显示与否
      pageInfo: {}, // 分页信息
      pageInfo2: {}, // 分页信息
      timeValue: [], // 查询时间显示
      req: {
        accurate: '0', // 是否精确查找 0否 1是
        name: '', // 问卷模板名称
        modifier: '', // 操作人
        beginTime: '', // 操作时间开始
        afterTime: '', // 操作时间结束
        queryAll: '1' // 查询所有问卷模板
      },
      req2: {
        angentId: '', // 答卷工号
        staffName: '', // 填写人
        templateName: '',
        beginTime: '', // 操作时间开始
        afterTime: '', // 操作时间结束
        pageNo: 1,
        pageSize: 10
      },
      // 单个问卷详情数据
      oneDetails: {
        modifier: '',
        modifyTime: '',
        name: '',
        titles: []
      },
      singleCheck: false,
      multiCheck: false,
      blanksCheck: false,
      multiblanksCheck: false,
      selectOption_single: [],
      selectOption_multi: [],
      selectOption_blanks: [],
      selectOption_multiblanks: [],
      singleItems: [], // 单选 所有选项
      multiItems: [], // 多选 所有选项
      fillBlanks: [], // 单行填空 所有选项
      multiBlanks: [], // 多行填空
      show_singleItems: [], // 单选 所有选项
      show_multiItems: [], // 多选 所有选项
      show_fillBlanks: [], // 单行填空 所有选项
      show_multiBlanks: [], // 多行填空
      templateId: '', //
      deleteVisiable: false, // 删除提示dialog
      batchdeletVisiable: false, // 批量删除提示dialog
      deleteRecordId: '', // 需要删除记录的id
      batchDeleteIds: [], // 批量删除的ids
      showComplete: true // 是否完成
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
    setMultiItems() {
      for (let i = 0; i < this.show_multiItems.length; i++) {
        this.selectOption_multi[i] = []
      }
    },
    // 查询某个模板的记录列表
    // queryFillRecords(id) {
    //   this.req2.templateId = id
    //   this.getQuestionnaireRecords(this.req2)
    // },
    // 综合查询记录列表
    getQuestionnaireRecords(req) {
      req.beginTime = this.timeValue ? this.timeValue[0] : null
      req.afterTime = this.timeValue ? this.timeValue[1] : null
      queryQuestionnaireRecords(req).then(response => {
        if (response.data.code === 0) {
          this.listRecords = response.data.data
          this.pageShow2 = true
          this.pageInfo2 = response.data.pageInfo
        } else {
          this.pageShow2 = false
          this.$message.error('无查询结果，请核对查询条件')
        }
      })
    },
    // 查看记录详情
    checkFillDetail(id, recordTitles) {
      this.show_singleItems.length = 0
      this.show_multiItems.length = 0
      this.show_fillBlanks.length = 0
      this.show_multiBlanks.length = 0
      this.selectOption_single.length = 0
      this.selectOption_multi.length = 0
      this.selectOption_blanks.length = 0
      this.selectOption_multiblanks.length = 0
      queryOneQuestionnaire(id)
        .then(response => {
          if (response.data.code === 0) {
            this.oneDetails.name = response.data.data.name
            this.oneDetails.modifier = response.data.data.modifier
            this.oneDetails.modifyTime = formatDateTime(response.data.data.modifyTime)
            this.oneDetails.titles = response.data.data.titles
            // 回显问卷题目
            for (var i = 0; i < response.data.data.titles.length; i++) {
              if (response.data.data.titles[i].type === 0) {
                this.show_singleItems.push(response.data.data.titles[i])
              } else if (response.data.data.titles[i].type === 1) {
                this.show_multiItems.push(response.data.data.titles[i])
                this.setMultiItems()
              } else if (response.data.data.titles[i].type === 2) {
                this.show_fillBlanks.push(response.data.data.titles[i])
              } else if (response.data.data.titles[i].type === 3) {
                this.show_multiBlanks.push(response.data.data.titles[i])
              }
            }

            // 回显勾选的答案
            for (var j = 0; j < recordTitles.length; j++) {
              if (recordTitles[j].type === 0) {
                // 单选题
                for (var k = 0; k < recordTitles[j].options.length; k++) {
                  this.selectOption_single.push(recordTitles[j].options[k].content)
                }
              } else if (recordTitles[j].type === 1) {
                // 多选题
                for (var a = 0; a < this.show_multiItems.length; a++) {
                  this.selectOption_multi.push([])
                  for (var d = 0; d < recordTitles[j].options.length; d++) {
                    this.selectOption_multi[a].push(
                      recordTitles[j].options[d].content
                    )
                  }
                }
              } else if (recordTitles[j].type === 2) {
                // 单行填空
                for (var b = 0; b < recordTitles[j].options.length; b++) {
                  this.selectOption_blanks.push(recordTitles[j].options[b].content)
                }
              } else if (recordTitles[j].type === 3) {
                // 多行填空
                for (var c = 0; c < recordTitles[j].options.length; c++) {
                  this.selectOption_multiblanks.push(recordTitles[j].options[c].content)
                }
              }
            }
            this.listVisiable = false
            this.pagePosition = '3'
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 格式化时间
    formatDateTime: formatDateTime,
    // 综合查询
    searchByKeyWords(req) {
      req.beginTime = this.timeValue ? this.timeValue[0] : null
      req.afterTime = this.timeValue ? this.timeValue[1] : null
      queryByKeyWords(req).then(response => {
        if (response.data.code === 0) {
          this.templates = response.data.data
        }
      })
    },
    // 判断是否选中模板
    goFillQuestionnaire(id) {
      if (id === '') {
        this.$message.error('请先选择问卷模板！')
        return
      } else {
        this.showComplete = true
        this.fillQuestionnaire(id)
      }
    },
    // 填写问卷  先查询详情展示模板
    fillQuestionnaire(id) {
      this.oneDetails.titles = {
        // 单个问卷详情数据
        modifier: '',
        modifyTime: '',
        name: '',
        titles: []
      }
      this.selectOption_single.length = 0
      this.selectOption_multi.length = 0
      this.selectOption_blanks.length = 0
      this.selectOption_multiblanks.length = 0
      this.show_singleItems.length = 0
      this.show_multiItems.length = 0
      this.show_fillBlanks.length = 0
      this.show_multiBlanks.length = 0
      queryOneQuestionnaire(id)
        .then(response => {
          if (response.data.code === 0) {
            this.oneDetails.name = response.data.data.name
            this.oneDetails.modifier = response.data.data.modifier
            this.oneDetails.modifyTime = formatDateTime(response.data.data.modifyTime)
            this.oneDetails.titles = response.data.data.titles
            for (var i = 0; i < response.data.data.titles.length; i++) {
              if (response.data.data.titles[i].type === 0) {
                this.show_singleItems.push(response.data.data.titles[i])
              } else if (response.data.data.titles[i].type === 1) {
                this.show_multiItems.push(response.data.data.titles[i])
                this.setMultiItems()
              } else if (response.data.data.titles[i].type === 2) {
                this.show_fillBlanks.push(response.data.data.titles[i])
              } else if (response.data.data.titles[i].type === 3) {
                this.show_multiBlanks.push(response.data.data.titles[i])
              }
            }
            this.pagePosition = '2'
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 完成问卷填写
    completeFillQuestionnaire(templateId, templateName) {
      this.showComplete = false
      this.hasBlanksOrNot(this.show_singleItems, this.show_multiItems, this.show_fillBlanks, this.show_multiBlanks, this.selectOption_single, this.selectOption_multi, this.selectOption_blanks, this.selectOption_multiblanks)
      // console.log(this.singleCheck, this.multiCheck, this.blanksCheck, this.multiblanksCheck)
      if (this.singleCheck === true &&
        this.multiCheck === true &&
        this.blanksCheck === true &&
        this.multiblanksCheck === true) {
        this.singleItems.length = 0
        this.multiItems.length = 0
        this.fillBlanks.length = 0
        this.multiBlanks.length = 0
        for (var a = 0; a < this.show_singleItems.length; a++) {
          this.singleItems.push({
            type: '0',
            name: this.show_singleItems[a].name,
            options: [
              {
                content: this.selectOption_single[a] ? this.selectOption_single[a] : ''
              }
            ]
          })
        }

        for (var b = 0; b < this.show_multiItems.length; b++) {
          this.multiItems.push({
            type: '1',
            name: this.show_multiItems[b].name,
            options: []
          })
          for (var i = 0; i < this.selectOption_multi[b].length; i++) {
            this.multiItems[b].options.push({
              content: this.selectOption_multi[b][i]
            })
          }
        }

        for (var d = 0; d < this.show_fillBlanks.length; d++) {
          this.fillBlanks.push({
            type: '2',
            name: this.show_fillBlanks[d].name,
            options: [
              {
                content: this.selectOption_blanks[d] ? this.selectOption_blanks[d] : ''
              }
            ]
          })
        }

        for (var e = 0; e < this.show_multiBlanks.length; e++) {
          this.multiBlanks.push({
            type: '3',
            name: this.show_multiBlanks[e].name,
            options: [
              {
                content: this.selectOption_multiblanks[e]
              }
            ]
          })
        }

        // 发送请求生成记录
        generateQuestionnaireRecord(templateId, templateName, this.singleItems, this.multiItems, this.fillBlanks, this.multiBlanks)
          .then(response => {
            if (response.data) {
              if (response.data.code === 0) {
                this.$message.success(response.data.message)
                this.getQuestionnaireRecords(this.req2)
                this.pagePosition = '1'
                this.showComplete = true
              } else {
                this.$message.error(response.data.message)
              }
            } else {
              this.$message.error('出错了，请稍后再试')
            }
          })
      } else {
        this.$message.error('当前页还有未填写的信息！')
        return
      }
    },
    // 判断是否还有未填写
    hasBlanksOrNot(singleItems, multiItems, fillBlanks, multiBlanks, selectOption_single, selectOption_multi, selectOption_blanks, selectOption_multiblanks) {
      this.singleCheck = false
      this.multiCheck = false
      this.blanksCheck = false
      this.multiblanksCheck = false

      if (singleItems.length === 0) {
        this.singleCheck = true
      } else {
        if (selectOption_single.length < singleItems.length || selectOption_single.length !== singleItems.length) {
          return
        } else {
          this.singleCheck = true
        }
      }

      if (multiItems.length === 0) {
        this.multiCheck = true
      } else {
        for (let i = 0; i < selectOption_multi.length; i++) {
          if (selectOption_multi[i].length === 0) {
            return
          } else {
            this.multiCheck = true
          }
        }
      }

      if (fillBlanks.length === 0) {
        this.blanksCheck = true
      } else {
        if (selectOption_blanks.length < fillBlanks.length || selectOption_blanks.length !== fillBlanks.length) {
          return
        } else {
          for (let j = 0; j < selectOption_blanks.length; j++) {
            if (selectOption_blanks[j] === '') {
              return
            } else {
              this.blanksCheck = true
            }
          }
        }
      }

      if (multiBlanks.length === 0) {
        this.multiblanksCheck = true
      } else {
        if (selectOption_multiblanks.length < multiBlanks.length || selectOption_multiblanks.length !== multiBlanks.length) {
          return
        } else {
          for (let k = 0; k < selectOption_multiblanks.length; k++) {
            if (selectOption_multiblanks[k] === '') {
              return
            } else {
              this.multiblanksCheck = true
            }
          }
        }
      }
    },
    // 单个删除问卷记录
    deleteQuestionnaireRecord(id) {
      deleteOneRecord(id)
        .then(response => {
          if (response.data.code === 0) {
            this.req2.pageNo = 1
            this.pageInfo2.pageNo = 1
            this.getQuestionnaireRecords(this.req2)
            this.$message.success(response.data.message)
          } else {
            this.$message.error(response.data.message)
          }
        })
    },
    // 重置查询条件
    resetQueryCondition() {
      this.timeValue = []
      this.req2 = {
        templateName: '', // 问卷名称
        staffName: '', // 操作人
        angentId: '',
        pageNo: this.pageInfo2.pageNo,
        pageSize: this.pageInfo2.pageSize
      }
    },
    // 页面显示条数
    handleSizeChange2(val) {
      this.req2.pageSize = val
      this.req2.pageNo = 1
      this.pageInfo2.pageNo = 1
      this.getQuestionnaireRecords(this.req2)
    },
    // 翻页
    handleCurrentChange2(val) {
      this.req2.pageNo = val
      this.getQuestionnaireRecords(this.req2)
    },
    // 表格多选
    handleSelectionChange(val) {
      this.batchDeleteIds.length = 0
      for (var i = 0; i < val.length; i++) {
        this.batchDeleteIds.push(val[i].id)
      }
    },
    // 判断是否勾选checkbox
    isSelectCkb(batchDeleteIds) {
      if (batchDeleteIds.length === 0) {
        this.$message.error('未选中任何问卷记录！')
        return
      } else {
        this.batchdeletVisiable = true
      }
    },
    // 批量删除
    batchDeleteQuestionnaireRecord(batchDeleteIds) {
      batchDeleteRecords(batchDeleteIds)
        .then(response => {
          if (response.data) {
            if (response.data.code === 0) {
              this.$message.success(response.data.message)
              this.batchdeletVisiable = false
              this.req2.pageNo = 1
              this.pageInfo2.pageNo = 1
              this.getQuestionnaireRecords(this.req2)
            } else {
              this.$message.error(response.data.message)
            }
          }
        })
    }
  },

  mounted() {
    this.formContainer()
    this.handleChangeAcitve()
    this.getQuestionnaireRecords(this.req2)
    this.searchByKeyWords(this.req)
  },

  watch: {}

}

</script>
