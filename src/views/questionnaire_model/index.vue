<template>
  <div class='container bg_color'>
    <!-- 管理主页div -->
    <div  v-show="isMainPage===true && isDetail === false">
      <el-collapse v-model="formContainerOpen" class="form-container" @change="handleChangeAcitve">
        <el-collapse-item title="筛选条件" name="1">
          <el-form :inline="true" size="small">
            <el-form-item label="问卷模板名称">
              <el-input type="text" v-model="req.name" placeholder="问卷模板名称（限长45字符）" maxlength="45" class="hideBorder"></el-input>
            </el-form-item>
            <el-form-item label="操作人">
              <el-input type="text" v-model="req.modifier" placeholder="操作人（限长45字符）" maxlength="45"></el-input>
            </el-form-item>
            <el-form-item label="操作时间">
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
              <el-button type="primary" @click="req.pageNo=1;req.accurate='0';searchByKeyWords(req)">查询</el-button>
              <el-button @click="resetQueryCondition()">重置</el-button>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
      <!-- 问卷表 -->
      <el-row class="table-container">
        <el-row class="margin-bottom-20">
          <div class="font14 bold">问卷表</div>
        </el-row>
        <el-row class="margin-bottom-20">
          <el-button type="success" size="small" @click="isMainPage = false;isDetail=true;allItems=[],questionnaireName='',asideHideOrShow=true,newHideOrShow=1;newModifyLook=1;">新建</el-button>
          <el-button type="danger" size="small" @click="isSelectIds(batchdel.ids)" >批量删除</el-button>
        </el-row>
        <el-row>
          <el-table :data="tableData" @selection-change="handleSelectionChange">
            <el-table-column align="center" type="selection" width="55"></el-table-column>
            <el-table-column align="center" label="问卷模板名称">
              <template slot-scope="scope">
                <a type="text" size="medium" @click="checkDetail(scope.row.id);newModifyLook=2;trueOrFalse=true;">{{scope.row.name}}</a>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作人" width="" prop="modifier">
              <template slot-scope="scope">
                {{scope.row.modifier}}
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作时间" width="155" >
              <template slot-scope="scope">
                <div v-html="formatDateTime(scope.row.modifyTime)"></div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="medium" @click="showeditDetails(scope.row.id);isMainPage=false;newModifyLook=3;isDetail=true;hideOrShowPage=true;newHideOrShow = 3;asideHideOrShow = true;">修改</el-button>
                <el-button type="text" size="medium" @click="deleteReq.id=scope.row.id;deleteVisiable=true">删除</el-button>
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
              :page-size='req.pageSize'
              layout="total, sizes, prev, pager, next, jumper "
              :total='pageInfo.totalCount' style="text-align: right;float:right;">
          </el-pagination>
        </el-row>
      </el-row>

      <!-- 新建问卷dialog -->
      <el-dialog width="30%" :visible.sync="questionnaireTitleVisiable" append-to-body>
        <span style="color:red">*</span><span style="font-size:15px;">问卷模板标题：</span>
        <el-input type="text" placeholder="请输入问卷模板标题（限长45字符）" size="medium" v-model="questionnaireName" maxlength="45"></el-input>
        <div slot="footer" class="dialog-footer" style="text-align: center;">
          <el-button type="primary" @click="checkTitleIsNullOrNot();questionnaireTitleVisiable = false">确定</el-button>
          <el-button type="primary" plain @click="questionnaireTitleVisiable = false">取消</el-button>
        </div>
      </el-dialog>

      <!-- 删除dialog -->
      <el-dialog width="30%" title="删除提示" :visible.sync="deleteVisiable" append-to-body>
        <span style="font-size:15px;">确定删除此问卷模板？</span>
        <div slot="footer" class="dialog-footer" style="text-align: right;">
          <el-button type="primary" @click="deleteVisiable = false;deleteQuestionnaire(deleteReq.id);">确定</el-button>
          <el-button type="primary" plain @click="deleteVisiable = false">取消</el-button>
        </div>
      </el-dialog>

      <!-- 批量删除dialog -->
      <el-dialog width="30%" title="删除提示" :visible.sync="batchdeleteVisiable" append-to-body>
        <span style="font-size:15px;">确定删除这些问卷模板？</span>
        <div slot="footer" class="dialog-footer" style="text-align: right;">
          <el-button type="primary" @click="batchdeleteVisiable = false;batchdeleteQuestionnaire(batchdel.ids);">确定</el-button>
          <el-button type="primary" plain @click="batchdeleteVisiable = false">取消</el-button>
        </div>
      </el-dialog>
      <!-- 修改问卷 -->
      <el-dialog width="30%" title="修改问卷模板名称" :visible.sync="editQuestionnaireName" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
        <span style="color:red">*</span><span style="font-size:15px;">问卷模板标题：</span>
        <el-input maxlength="45" type="text" placeholder="请输入问卷模板标题（限长45字符）" size="medium" v-model="questionnaireName1" clearable @change="checkEditName(questionnaireName1);"></el-input>
        <div slot="footer" class="dialog-footer" style="text-align: center;">
          <span style="color:red" v-if="hasQuestionnaireName===false">模板名称不能为空</span>
          <el-button type="primary" @click="editQuestionnaireName=false;questionnaireName=questionnaireName1" v-if="hasQuestionnaireName===true">确定</el-button>
          <el-button type="primary" plain @click="editQuestionnaireName = false" v-if="hasQuestionnaireName===true">取消</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 新建问卷或者修改问卷以及问卷详情 -->
    <div  v-show="isMainPage===false && isDetail === true" class="question" ref="set_height">
      <el-row type="flex">
        <el-col :span="5"></el-col>
        <el-col :span="14">
          <el-container>
            <el-aside class="select_quest" v-show="asideHideOrShow">
              <el-menu :default-openeds="['1']" active-text-color="#121212">
                <el-submenu index="1">
                  <template slot="title"><i class="el-icon-menu"></i>题型选择</template>
                  <el-menu-item-group>
                    <div>
                      <!-- 创建模板 -->
                      <el-menu-item index="1-1" @click="createNewModel(1);" class="module" style="background-position:0 -4px">单选题</el-menu-item>
                      <el-menu-item index="1-2" @click="createNewModel(2);"  class="module" style="background-position:0 -76px">多选题</el-menu-item>
                      <el-menu-item index="1-3" @click="createNewModel(3);"  class="module" style="background-position:0 -112px">单行填空</el-menu-item>
                      <el-menu-item index="1-4" @click="createNewModel(4);" class="module" style="background-position:0 -148px">多行填空</el-menu-item>
                    </div>
                  </el-menu-item-group>
                </el-submenu>
              </el-menu>
            </el-aside>
            <!-- 模板详情 -->
            <el-container style="margin-left:150px">
              <el-header>
                <!-- titleHead -->
                <div class="title-content">
                  <input type="text" placeholder="请输入问卷模板标题（限长45字符）" v-model="questionnaireName" maxlength="45" class="title_resize" ref="inputDisplay" style="text-align:center" :disabled="trueOrFalse">
                </div>
                <div class="survey-desc">
                  <div class="desc-content">欢迎参加调查！答卷数据仅用于统计分析，请放心填写。题目选项无对错之分，按照实际情况选择即可。感谢您的帮助！</div>
                </div>
                <div>
                    <el-form size="small" class="quest-box">
                        <div style="margin-top:-8px" ref="questBox">
                          <el-form-item v-for="(item,index) in allItems" :key="index" class="newStyle" v-show="hideOrShowPage" v-dragging="{item: item,list:allItems,group:'item'}">
                            <div v-show="item.type===0">
                                  <span>{{index+1}}.</span>
                                  <el-input size="small" v-model="item.name" :placeholder="setplaceHolder(item.type)" style="width:493px;margin:3px;" clearable maxlength="45" class="hideBorder" :disabled="trueOrFalse"></el-input>
                                  <div v-for="(a,radioIndex) in item.options" :key="radioIndex" class="options">
                                    <span class="showEditOption">
                                      <el-radio label="1" name="1"  disabled>
                                        <el-input size="small" type="text" placeholder='选项(45个字符内)' style="width:456px;margin:2px" v-model="a.content" clearable maxlength="45" :disabled="trueOrFalse"></el-input>
                                          <span class="editoptions" v-show="newModifyLook===1||newModifyLook===3">
                                            <el-button icon="el-icon-arrow-up" type="text" size="mini" title="上移" @click="upOption(item.options,radioIndex,item.options.length)"></el-button>
                                            <el-button icon="el-icon-arrow-down" type="text" size="mini" title="下移" @click="downOption(item.options,radioIndex,item.options.length)"></el-button>
                                            <el-button icon="el-icon-delete" type="text" size="mini" title="删除" @click="removeRadio(item.options,radioIndex)"></el-button>
                                          </span>
                                      </el-radio>
                                    </span>
                                  </div>
                            </div>
                            <div v-show="item.type===1">
                                   <span>{{index+1}}.</span>
                                   <el-input size="small" v-model="item.name" :placeholder="setplaceHolder(item.type)" style="width:493px;margin:3px" clearable maxlength="45" :disabled="trueOrFalse"></el-input>
                                   <div v-for="(a,checkboxIndex) in item.options" :key="checkboxIndex" class="options">
                                    <el-checkbox disabled checked>
                                      <span class="showEditOption">
                                        <el-input size="small" type="text" placeholder='选项(45个字符内)' style="width:456px;margin:2px" v-model="a.content" clearable maxlength="45" :disabled="trueOrFalse"></el-input>
                                        <span class="editoptions" v-show="newModifyLook===1||newModifyLook===3">
                                          <el-button icon="el-icon-arrow-up" type="text" size="mini" title="上移" @click="upOption(item.options,checkboxIndex,item.options.length)"></el-button>
                                          <el-button icon="el-icon-arrow-down" type="text" size="mini" title="下移" @click="downOption(item.options,checkboxIndex,item.options.length)"></el-button>
                                          <el-button icon="el-icon-delete" type="text" size="mini" title="删除" @click="removeRadio(item.options,checkboxIndex)"></el-button>
                                        </span>
                                      </span>
                                    </el-checkbox>
                                  </div>
                            </div>
                            <div v-show="item.type===2">
                                   <span>{{index+1}}.</span>
                                   <el-input size="small" v-model="item.name" :placeholder="setplaceHolder(item.type)" style="width:493px;margin:3px" clearable maxlength="45" :disabled="trueOrFalse"></el-input>
                                   <div v-for="(a,blankIndex) in item.options" :key="blankIndex" class="options">
                                    <el-input type="textarea" placeholder='回答' resize="none" rows="1" style="width:478px;margin:2px" v-model="a.content"  maxlength="45" :disabled="trueOrFalse"></el-input>
                                  </div>
                            </div>
                            <div v-show="item.type===3">
                                   <span>{{index+1}}.</span>
                                   <el-input size="small" v-model="item.name" :placeholder="setplaceHolder(item.type)" style="width:493px;margin:3px" clearable maxlength="45" :disabled="trueOrFalse"></el-input>
                                   <div v-for="(a,blankIndex) in item.options" :key="blankIndex" class="options">
                                    <el-input type="textarea" resize="none" rows="4" placeholder='回答' style="width:478px;margin:2px" v-model="a.content" :disabled="trueOrFalse" maxlength="150"></el-input>
                                  </div>
                            </div>
                            <div class="tools" v-show="newModifyLook===1||newModifyLook===3">
                              <div class="showaddTool" v-show="item.type===0||item.type===1">
                                <i class="el-icon-plus" style="cursor:pointer" @click="addRadio(item.options)" title="新建选项"></i>
                              </div>
                              <div style="display:flex;justify-content:flex-end;width:100%">
                                <div class="showdeleteTool" style="margin:0 20px;">
                                <i class="el-icon-delete" style="cursor:pointer;font-size:20px;" @click="removeSingle(index)" title="点击删除这道题目"></i>
                                </div>
                                <div class="showDragTool my-handle" style="margin:0 20px;" >
                                 <i class="el-icon-rank" style="cursor:pointer;font-size:20px;" title="可拖拽"></i>
                                </div>
                              </div>
                            </div>
                          </el-form-item>
                        </div>
                    </el-form>
                </div>
                <!-- 新建 -->
                <div class="lastbuttons" v-show="newHideOrShow===1?true:false">
                  <div style="margin-top:8px">
                    <el-button size="small" type="primary" @click="makeQuestionnaire(questionnaireName,allItems)" class="create">生成</el-button>
                    <el-button size="small" type="primary" plain @click="isMainPage=true;isDetail=false;questionnaireName='';allItems=[]">取消</el-button>
                  </div>
                </div>
                <!-- 查看 -->
                <div class="lastbuttons" v-show="newHideOrShow===2?true:false">
                  <div style="margin-top:8px">
                    <el-button type="primary" plain size="small" @click="isMainPage=true;isDetail=false;">返回</el-button><br/><br/>
                  </div>
                </div>
                <!-- 修改 -->
                <div class="lastbuttons" v-show="newHideOrShow===3?true:false">
                  <div style="margin-top:8px">
                    <el-button size="small" type="primary" @click="editQuestionnaire(editQuestionnaireId,questionnaireName,allItems)" class="modify">确定</el-button>
                    <el-button size="small" type="primary" plain @click="isMainPage=true;isDetail=false;questionnaireName='';allItems=[]">返回</el-button>
                  </div>
                </div>
              </el-header>
            </el-container>
          </el-container>
        </el-col>
        <el-col :span="5"></el-col>
      </el-row>
    </div>
  </div>
</template>
<style rel='stylesheet/scss' lang="scss">
.question{
  height: 800px!important;
  overflow: auto;
}
.question .el-input.is-disabled .el-input__inner,
.el-textarea.is-disabled .el-textarea__inner{
  color: #000;
  background:#fff;
  border:none;
}
.el-textarea.is-disabled .el-textarea__inner{
  border: 1px solid #dcdfe6;
}
.question .el-radio+.el-radio{
  margin-left:0;
}
.question .el-checkbox+.el-checkbox{
   margin-left:0;
}
.question .el-input__inner{
  border:1px solid #fff;
}
.question .el-input__inner:focus{
  border:1px solid #dcdfe6;
  background: #fff;
}
.question .el-menu{
  border-right: none;
}
.el-menu-item-group__title{
  padding:0;
}
.newStyle{
  padding-left: 30px;
  background-color: #fff;
  padding-bottom: 10px;
  border: 1px solid #dcdfe6;
  margin: 10px 0 10px 0!important;
}
.title_resize{
  width:100%;
  outline: none;
  padding:0 30px;
  background:none;
  border:none;
  font-size: 16px;
}

</style>

<style rel='stylesheet/scss' lang="scss" scoped>
.bg_color{
  background: #fff!important;
}
.select_quest{
  box-sizing: border-box;
  width: 164px!important;
  overflow: hidden;
  border: 1px solid #dcdfe6;
  position:fixed;
}
.myButton{
  padding: 0px;
  border:none;
}
.title-content {
  height: 48px;
  font-size: 20px;
  line-height: 48px;
  border: 1px solid #dbdbdb;
  position: relative;
  outline: 0;
}
.title-content-detail {
  height: 88px;
  font-size: 22px;
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
.tools{
  display:flex;
  justify-content: space-between;
  padding: 0 60px 0 30px;
  opacity: 0;
  user-select: none;
}
.editoptions {
  float: right;
  opacity: 0;
}
.showEditOption:hover .editoptions{
  opacity: 1;
}
.newStyle:hover .tools,.newStyle:hover .tools{
  opacity: 1;
}
.topic-type-content:hover .tools,.topic-type-content:hover .tools{
  opacity: 1;
}
.module {
    cursor: pointer;
    height: 35px;
    text-align: left;
    line-height: 36px;
    background: url(../../../static/images/my_imgs/question_logo.png) no-repeat;
    padding-left: 0;
}
</style>

<script>
import { formatDateTime, swapArray } from '@/utils/tools'
import {
  queryByKeyWords,
  generateQuestionnaire,
  deleteOneQuestionnaire,
  deleteQuestionnaires,
  queryOneQuestionnaire,
  modifyQuestionnaire,
  checkByQuestionnaireName,
  checkModifyByQuestionnaireName
} from '@/api/questionnaire_management'

export default {
  name: 'questionnaire_management',
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      trueOrFalse:false,
      // 拖拽实现所要使用
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      sortable: null,
      oldList: [],
      newList: [],
      // 定义大数组
      allItems:[],
      allItemsCheck:false,
      // 有无数据  是否显示
      hideOrShowPage:false,
      // 题型显示隐藏
      asideHideOrShow:true,
      // 查看详情时禁用input
      look: 1,//1新建2查看3修改
      // 按钮显示隐藏
      newHideOrShow:1,//1新建2查看3修改
      // 小工具按钮的显示隐藏
      newModifyLook:1, //1新建2查看3修改
      // 判断标题
      checkTitle:false,
      formContainerOpen: '1',
      formContainer: this.$store.state.app.formContainer,
      selectOption_single: [],
      selectOption_multi: [],
      selectOption_blanks: [],
      selectOption_multiblanks: [],
      isMainPage: true, // 判断是否是管理主页
      isDetail: false, // 判断是否是详情
      tableData: [], // 表格数据
      pageShow: false, // 分页显示与否
      pageInfo: {}, // 分页信息
      timeValue: [], // 查询时间显示
      hasSingle: false,
      hasMulti: false,
      hasBlanks: false,
      hasMultiBlanks: false,
      req: {
        accurate: '0', // 是否精确查找 0否 1是
        name: '', // 问卷模板名称
        modifier: '', // 操作人
        beginTime: '', // 操作时间开始
        afterTime: '', // 操作时间结束
        pageNo: 1,
        pageSize: 10
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

      questionnaireName1: '', // 修改问卷名称
      singelItems: [], // 单选 所有选项
      multiItems: [], // 多选 所有选项
      fillBlanks: [], // 单行填空 所有选项
      multiBlanks: [], // 多行填空
      // 校验
      singleCheck: false,
      multiCheck: false,
      blanksCheck: false,
      multiblanksCheck: false,

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
    //新建或者修改时创建新模板
    createNewModel(num){
      if(num === 1){
        this.allItems.push({
          type: 0,
          name: '',
          options: [
            {
              content: ''
            },
            {
              content: ''
            },
            {
              content: ''
            }
          ]
        })
      }else if(num === 2){
        this.allItems.push({
          type: 1,
          name: '',
          options: [
            {
              content: ''
            },
            {
              content: ''
            },
            {
              content: ''
            }
          ]
        })
      }else if(num === 3){
        this.allItems.push({
          type: 2,
          name: '',
          options: [
            {
              content: ''
            }
          ]
        })
      }else if(num === 4){
        this.allItems.push({
          type: 3,
          name: '',
          options: [
            {
              content: ''
            }
          ]
        })
      }
      this.hideOrShowPage=true
      console.log(this.allItems)
    },
    // 收起点击事件
    handleChangeAcitve(active = ['1']) {
      if (active.length) {
        $('.form-more').text('收起')
      } else {
        $('.form-more').text('更多')
      }
    },
    // 上移
    upOption(arr, index, length) {
      if (index !== 0) {
        swapArray(arr, index, index - 1)
      } else {
        this.$message.error('当前该项已在顶部')
      }
    },
    // 下移
    downOption(arr, index, length) {
      if (index !== (length - 1)) {
        swapArray(arr, index, index + 1)
      } else {
        this.$message.error('当前该项已在底部')
      }
    },

    // 重置查询条件
    resetQueryCondition() {
      this.timeValue = []
      this.req = {
        accurate: '0',
        name: '', // 问卷模板名称
        modifier: '', // 操作人
        beginTime: '', // 操作时间开始
        afterTime: '', // 操作时间结束
        pageNo: this.pageInfo.pageNo,
        pageSize: this.pageInfo.pageSize
      }
    },
    // 动态设置placeholder
    setplaceHolder(num) {
      if(num == 0){
        return "单选题"
      }else if(num == 1){
        return "多选题"
      }else if(num == 2){
        return "单行填空"
      }else if(num == 3){
        return "多行填空"
      }
    },
    // 删除数组元素
    removeSingle(index) {
      this.allItems.splice(index, 1)
    },
    // 删除单选
    removeRadio(a, index) {
      a.splice(index, 1)
    },
    // 新建单选项
    addRadio(options) {
      options.push({
        content: '',
      })
    },
    // 删除多选
    removeCheckbox(a, index) {
      a.splice(index, 1)
    },
    // 新建多选项
    addCheckbox(options) {
      options.push({
        content: ''
      })
    },

    removeBlank(a, index) {
      a.splice(index, 1)
    },
    addBlank(options) {
      options.push({
        content: '回答'
      })
    },
    // 生成问卷
    makeQuestionnaire(questionnaireName, allItems) {
     if (this.questionnaireName === '' || this.questionnaireName.split(' ').join('').length === 0) {
        this.$message.error('请先输入问卷标题！')
        return
      } else {
        checkByQuestionnaireName(this.questionnaireName, '1')
          .then(res => {
            if (res.data && res.data.code === 0 && res.data.data.length > 0) {
              this.$message.error('已存在同名的问卷模板！')
              return
            }else{
              // 判断是否还有未填项
              this.hasBlanksOrNotCreate(allItems)
              console.log(1234567890)
              if (this.allItemsCheck===true) {
                console.log('到这里')
                var data = {
                    name:questionnaireName,
                    titles:allItems
                }
                generateQuestionnaire(
                  data
                ).then(response => {
                  console.log(response)
                  if (response.data && response.data.code === 0) {
                    this.$message.success(response.data.message)
                    this.questionnaireName = ''
                    this.allItems = []
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
              }

            }
          })
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
    editQuestionnaire(editQuestionnaireId,questionnaireName,allItems) {
      console.log(editQuestionnaireId,questionnaireName)
      if (this.questionnaireName === '' || this.questionnaireName.split(' ').join('').length === 0) {
        this.$message.error('请先输入问卷标题！')
        return
      } else {
        checkModifyByQuestionnaireName(editQuestionnaireId,questionnaireName)
        .then(res => {
            if (res.data.code === 1) {
              this.$message.error(res.data.message)
              return
            }else{
               if(allItems.length === 0){
                  this.$message.error('未选择任何类型！')
                  return
              }else{
                this.hasBlanksOrNotCreate(allItems)
                if(this.allItemsCheck===true){
                  var data = {
                      id:editQuestionnaireId,
                      name:questionnaireName,
                      titles:allItems
                  }
                   modifyQuestionnaire(data)
                    .then(response => {
                    if (response.data && response.data.code === 0) {
                      this.$message.success(response.data.message)
                      this.questionnaireName = ''
                      this.allItems = []
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
                }
              }
            }
          })
      }
    },
    // 综合查询
    searchByKeyWords(req) {
      req.beginTime = this.timeValue ? this.timeValue[0] : null
      req.afterTime = this.timeValue ? this.timeValue[1] : null
      queryByKeyWords(req).then(response => {
        if (response.data.code === 0) {
          this.tableData = response.data.data
          this.pageShow = true
          this.pageInfo = response.data.pageInfo
        } else {
          this.pageShow = false
        }
      })
    },
    // 页面显示条数
    handleSizeChange(val) {
      this.req.pageSize = val
      this.req.pageNo = 1
      this.pageInfo.pageNo = 1
      this.searchByKeyWords(this.req)
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
      this.allItems=[]
      this.oneDetails.titles = {
        // 单个问卷详情数据
        modifier: '',
        modifyTime: '',
        name: '',
        titles: []
      }
      queryOneQuestionnaire(id)
        .then(response => {
          if (response.data.code === 0) {
            this.oneDetails.name = response.data.data.name
            this.oneDetails.modifier = response.data.data.modifier
            this.oneDetails.modifyTime = formatDateTime(response.data.data.modifyTime)
            this.oneDetails.titles = response.data.data.titles
            this.questionnaireName = response.data.data.name

            this.newHideOrShow = 2
            this.allItems = response.data.data.titles
            this.asideHideOrShow = false
            this.hideOrShowPage = true
            this.isMainPage = false
            this.isDetail = true
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 展示修改问卷div
    showeditDetails(id){
      this.allItems=[]
      queryOneQuestionnaire(id).then(response => {
        if (response.data.code === 0) {//请求成功
          this.questionnaireName = response.data.data.name
          this.editQuestionnaireId = response.data.data.id
          this.allItems = response.data.data.titles
          console.log(this.allItems)
        }
      })
    },
    // 新建或者修改时判断页面是否还有未填的项
    hasBlanksOrNotCreate(allItems){
      this.allItemsCheck = false
      if (allItems.length > 0) {//数组不为空遍历数组
        for (var i = 0; i < allItems.length; i++) {
          if(allItems[i].name !==''){//标题名不为空 根据题型判断option
            if(allItems[i].type===0 || allItems[i].type===1){//单选多选题
              if (allItems[i].options.length !== 0) {
                for (var j = 0; j < allItems[i].options.length; j++) {
                  if (allItems[i].options[j].content === '') {
                    this.allItemsCheck = false
                    this.$message.error('第'+(i+1)+'题第'+(j+1)+'个选项还有信息未完善！')
                    return
                  } else {
                    this.allItemsCheck = true
                  }
                }
              }else{
                this.allItemsCheck = false
                this.$message.error('第'+(i+1)+'题还有信息未完善！')
                return
              }
            }else if(allItems[i].type===2 || allItems[i].type===3){//单行，多行
              if(allItems[i].options !== ''){
                this.allItemsCheck = true
              }else{
                this.allItemsCheck = false
                this.$message.error('第'+(i+1)+'题还有信息未完善！')
                return
              }
            }
          }else{
            this.allItemsCheck = false
            this.$message.error('第'+(i+1)+'题还有信息未完善！')
            return
          }
        }
      } else {
        this.allItemsCheck = false
        this.$message.error('未选择任何题型！')
        return
      }
    },
    // 删除
    deleteQuestionnaire(id) {
      deleteOneQuestionnaire(id)
        .then(response => {
          if (response.data.code === 0) {
            this.deleteVisiable = false
            this.req.pageNo = 1
            this.pageInfo.pageNo = 1
            this.searchByKeyWords(this.req)
            this.$message.success(response.data.message)
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
            this.req.pageNo = 1
            this.pageInfo.pageNo = 1
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
      if (this.questionnaireName === '' || this.questionnaireName.split(' ').join('').length === 0) {
        this.$message.error('请先输入问卷标题！')
        return
      } else {
        checkByQuestionnaireName(this.questionnaireName, '1')
          .then(res => {
            if (res.data && res.data.code === 0 && res.data.data.length > 0) {
              this.$message.error('已存在同名的问卷模板！')
              return
            }
          })
      }
    },
  },
  mounted() {
    this.formContainer()
    this.handleChangeAcitve()
    this.searchByKeyWords(this.req);
    this.$dragging.$on('dragged', ({ value }) => {
      console.log(value.item)
      console.log(value.list)
      console.log(value.otherData)
      this.allItems = value.list
      console.log(this.allItems)
    })
    this.$dragging.$on('dragend', () => {

    })
  },

  watch: {
  },
  components: {
  },

  mixins: [],

  vuex: {},

  created() {
  },
}
</script>
