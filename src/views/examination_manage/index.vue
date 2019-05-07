<template>
  <div class="app-container">
    <div class="filter-container" v-show="dialogManagementFormVisible">
      <el-collapse
        v-model="formContainerOpen"
        class="form-container"
        @change="handleChangeAcitve"
        style="position:relative;"
      >
        <span
          class="form-more bold"
          style="float:right;margin-right:6px;color:#57AFFF;position:absolute;top:16px;right:41px;font-size: 14px"
          >更多</span
        >
        <el-collapse-item title="筛选条件" name="1">
          <el-form :inline="true" class="demo-form-inline" size="small">
            <el-form-item label="试卷名称：">
              <el-input
                placeholder="试卷名称"
                v-model="formInline.name"
              ></el-input>
            </el-form-item>
            <el-form-item label="考试对象:">
              <el-select v-model="formInline.useObject" placeholder="考题对象">
                <el-option value="" label="全部"></el-option>
                <el-option value="1" label="坐席主管"></el-option>
                <el-option value="2" label="坐席"></el-option>
                <el-option value="3" label="质检主管"></el-option>
                <el-option value="4" label="质检员"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="难易程度:">
              <el-select v-model="formInline.complexity" placeholder="考题等级">
                <el-option value="" label=""></el-option>
                <el-option value="1" label="简单"></el-option>
                <el-option value="2" label="中等"></el-option>
                <el-option value="3" label="困难"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="答题状态:">
              <el-select v-model="formInline.state" placeholder="答题状态">
                <el-option value="" label="全部"></el-option>
                <el-option value="0" label="考试中"></el-option>
                <el-option value="1" label="已完成"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="创建时间：">
              <el-date-picker
                v-model="receiveTimeValue"
                type="datetimerange"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search(formInline)"
                >查询</el-button
              >
              <el-button @click="reset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
      <el-row class="table-container">
        <el-row class="margin-bottom-20">
          <div class="font14 bold">试卷管理表</div>
        </el-row>
        <el-row class="margin-bottom-20">
          <el-button type="success" size="small" @click="generateTestPapers"
            >生成考题</el-button
          >
        </el-row>
        <el-row>
          <el-table :data="tableData" tooltip-effect="dark">
            <el-table-column
              align="center"
              prop="name"
              label="试卷名称"
              :show-overflow-tooltip="true"
            >
            </el-table-column>
            <el-table-column align="center" prop="state" label="答题状态">
              <template slot-scope="scope">
                <div v-html="showQuestionsState(scope.row.state)"></div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="score" label="得分">
            </el-table-column>
            <el-table-column
              align="center"
              prop="complexity"
              label="试卷等级"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <div
                  v-html="showQuestionsComplexity(scope.row.complexity)"
                ></div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="useObject" label="培训对象">
              <template slot-scope="scope">
                <div v-html="showQuestionsUseObject(scope.row.useObject)"></div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="creatorTime" label="创建时间">
            </el-table-column>
            <el-table-column
              align="center"
              prop="modifierTime"
              label="最后修改时间"
            >
            </el-table-column>
            <el-table-column align="center" label="操作" width="180">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="getTestPapersRecord(scope.row.id, 1)"
                  >查看</el-button
                >
                <el-button
                  type="text"
                  size="small"
                  v-show="scope.row.state == 0"
                  @click="getTestPapersRecord(scope.row.id, 3)"
                  >继续考试
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row style="margin-top:20px;">
          <el-col :span="20" :offset="4">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="pagination.pageNo"
              :page-sizes="[10, 20, 30, 40, 50]"
              :page-size="pagination.pageSize"
              layout="total, sizes, prev, pager, next, jumper "
              :total="pagination.totalCount"
              style="text-align: right"
            >
            </el-pagination>
          </el-col>
        </el-row>
      </el-row>
    </div>

    <!-- 生成考题条件 -->
    <el-dialog
      title="生成考题"
      :visible.sync="dialogGenerateFormVisible"
      width="30%"
      @close="generateReset"
      append-to-body
    >
      <el-form
        size="small"
        :model="generateForm"
        :rules="rules"
        ref="generateForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="试题名称:" prop="testPapersName">
          <el-input
            v-model="generateForm.testPapersName"
            type="text"
          ></el-input>
        </el-form-item>
        <el-form-item label="难度等级:" prop="complexity">
          <el-radio-group v-model="generateForm.complexity" size="small">
            <el-radio-button label="1">简单</el-radio-button>
            <el-radio-button label="2">中等</el-radio-button>
            <el-radio-button label="3">困难</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="考题对象:" prop="useObject">
          <el-radio-group v-model="generateForm.useObject" size="small">
            <el-radio-button label="1">坐席主管</el-radio-button>
            <el-radio-button label="2">坐席</el-radio-button>
            <el-radio-button label="3">质检主管</el-radio-button>
            <el-radio-button label="4">质检员</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="generateReset">重置</el-button>
        <el-button type="primary" @click="generateReqForm(generateForm)"
          >生成</el-button
        >
      </div>
    </el-dialog>
    <!-- 答题界面 -->
    <div
      v-show="dialogManagementFormVisible == false"
      style="display:flex;justify-content: space-between"
    >
      <div style="width:68%">
        <div style="border:1px solid #dbdbdb;border-bottom:none;">
          <center>
            <label style="color: #3f4040;font-size: 20px;line-height: 45px;">{{
              examTitle
            }}</label>
          </center>
        </div>
        <div style=" border:1px solid #dbdbdb;border-top:none;">
          <!-- 单选 -->
          <el-form size="small">
              <p v-if="show_singleItems.length > 0" style="text-align:left;padding-bottom:10px;padding-left:20px;">
                单选题
              </p>
            <label
              style="color: #3f4040;font-size: 20px; float: right;margin-right:20px;"
              v-show="testPapersState == 1"
              >得分：<label
                style="color: red; font-size: 50px;text-decoration: underline"
                >{{ testPapersScore }}</label
              ></label
            >
            <div>
              <el-form-item
                v-for="(item, index) in show_singleItems"
                :key="index"
                style="padding-left:20px;border-top:1px solid rgb(219, 219, 219)"
              >
                <div class="topic-type-content">
                  <span>{{ index + 1 }}.</span>
                  <span
                    v-model="item.context"
                    placeholder="标题"
                    style="width:300px"
                    >{{ item.context }}</span
                  >
                  <div
                    v-for="(a, radioIndex) in item.solutions"
                    class="options"
                  >
                    <el-radio
                      :label="a.id"
                      v-model="selectOption_single[index]"
                      v-show="isShow == 0 || isShow == 3"
                    >
                      {{ a.context }}
                    </el-radio>
                    <!-- 查看 -->
                    <el-radio
                      :label="a.id"
                      v-model="selectOption_single[index]"
                      v-show="isShow == 1"
                      disabled="true"
                      :class="changeClass(a.isRight)"
                    >
                      {{ a.context }}
                    </el-radio>
                  </div>
                  <label
                       v-show="testPapersState == 1 && item.isRight == 0"
                      style="border:1px solid #FF4747;color:#FF4747;background:rgba(255,71,71,0.1);padding:5px 10px;"
                    >
                      <img src="../../../static/images/error.svg" alt="" style="width:10px;margin-left:0;">
                      &nbsp;&nbsp;
                      回答错误，正确答案是：
                      <label
                      v-for="(a, radioIndex) in item.solutions"
                      v-show="a.isRight == 1"
                    >
                      {{ a.context }}
                    </label>
                      </label
                    >
                    <!-- 回答正确 -->
                    <label
                       v-show="testPapersState == 1 && item.isRight == 1"
                      style="border:1px solid rgba(40,204,108,1);color:rgba(40,204,108,1);background:rgba(40,204,108,0.1);padding:5px 10px;"
                    >
                    <img src="../../../static/images/success.svg" alt="" style="width:10px;margin-left:0;">
                    &nbsp;&nbsp;
                      回答正确</label
                    >
                </div>
              </el-form-item>
            </div>
          </el-form>
          <br/><br/>
          <!-- 判断 -->
          <el-form size="small">
            <p v-if="show_judgeItems.length > 0" style="text-align:left;padding-bottom:10px;padding-left:20px;">
              判断题
            </p>
            <div>
              <el-form-item
                v-for="(item, index) in show_judgeItems"
                :key="index"
                style="padding-left:20px;border-top:1px solid rgb(219, 219, 219)"
              >
                <div class="topic-type-content">
                  <span>{{ index + 1 }}.</span>
                  <span
                    v-model="item.context"
                    placeholder="标题"
                    style="width:300px"
                    >{{ item.context }}</span
                  >
                  <div>
                    <el-radio-group
                      v-model="selectOption_judge[index]"
                      v-show="isShow == 0 || isShow == 3"
                    >
                      <el-radio :label="1">
                        正确
                      </el-radio>
                      <el-radio :label="0">
                        错误
                      </el-radio>
                    </el-radio-group>
                    <!-- 查看 -->
                    <el-radio-group
                      v-model="selectOption_judge[index]"
                      v-show="isShow == 1"
                      disabled="true"
                      
                    >
                      <el-radio :label="1" :class="changeClass(item.isRight)">
                        正确
                      </el-radio>
                      <el-radio :label="0" :class="changeClass(item.isRight)">
                        错误
                      </el-radio>
                    </el-radio-group>
                  </div>
                  <!-- 回答错误 -->
                  <label
                    v-show="testPapersState == 1 && item.isRight == 0"
                    style="border:1px solid #FF4747;color:#FF4747;background:rgba(255,71,71,0.1);padding:5px 10px;"
                  >
                  <img src="../../../static/images/error.svg" alt="" style="width:10px;margin-left:0;">
                  &nbsp;&nbsp;
                    回答错误
                  </label>
                     <!-- 回答正确 -->
                  <label
                   v-show="testPapersState == 1 && item.isRight == 1"
                    style="border:1px solid rgba(40,204,108,1);color:rgba(40,204,108,1);background:rgba(40,204,108,0.1);padding:5px 10px;"
                  >
                  <img src="../../../static/images/success.svg" alt="" style="width:10px;margin-left:0;">
                  &nbsp;&nbsp;
                    回答正确
                  </label>
                </div>
              </el-form-item>
            </div>
          </el-form>
          <br/><br/>
          <!--  多选  -->
          <el-form size="small">
              <p v-if="show_multiItems.length > 0" style="text-align:left;padding-bottom:10px;padding-left:20px;">
                多选题
              </p>
            <div>
              <el-form-item
                v-for="(item, index) in show_multiItems"
                :key="index"
                style="padding-left:20px;border-top:1px solid rgb(219, 219, 219)"
              >
                <div class="topic-type-content">
                  <span>{{ index + 1 }}.</span>
                  <span
                    v-model="item.id"
                    placeholder="标题"
                    style="width:300px"
                    >{{ item.context }}</span
                  >
                  <el-checkbox-group
                    v-model="selectOption_multi[index]"
                    v-show="isShow == 0 || isShow == 3"
                  >
                    <el-checkbox
                      v-for="(a, checkboxIndex) in item.solutions"
                      :key="checkboxIndex"
                      :label="a.id"
                    >
                      {{ a.context }}
                    </el-checkbox>
                  </el-checkbox-group>
                  <!-- 查看 -->
                  <el-checkbox-group
                    v-model="selectOption_multi[index]"
                    v-show="isShow == 1"
                    disabled="true"
                    style="color:green;"
                  >
                    <el-checkbox
                      v-for="(a, checkboxIndex) in item.solutions"
                      :key="checkboxIndex"
                      :label="a.id"
                      :class="changeCheckBoxClass(a.isRight)"
                    >
                      {{ a.context }}
                    </el-checkbox>
                  </el-checkbox-group>
                  <!-- 回答错误 -->
                  <label
                    v-if="testPapersState == 1 && item.isRight == 0"
                    style="border:1px solid #FF4747;color:#FF4747;background:rgba(255,71,71,0.1);padding:5px 10px;"
                  >
                  <img src="../../../static/images/error.svg" alt="" style="width:10px;margin-left:0;">
                  &nbsp;&nbsp;
                    回答错误，正确答案是：
                    <label
                      v-for="(a, checkboxIndex) in item.solutions"
                      :key="checkboxIndex"
                      v-show="a.isRight == 1"
                    >
                      {{ a.context }}
                    </label>
                  </label>
                  <!-- 回答正确 -->
                  <label
                    v-show="testPapersState == 1 && item.isRight == 1"
                    style="border:1px solid rgba(40,204,108,1);color:rgba(40,204,108,1);background:rgba(40,204,108,0.1);padding:5px 10px;"
                  >
                  <img src="../../../static/images/success.svg" alt="" style="width:10px;margin-left:0;">
                  &nbsp;&nbsp;
                    回答正确
                  </label>
                </div>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
      <!-- 答题卡 -->
      <div style="width:30%;margin-left:20px;">
        <div style="position: fixed;border:1px solid #dbdbdb;max-height: 600px;overflow: auto;">
          <center>
            <h2 style="margin:20px 0;">答题卡</h2>
          </center>
          <div
            style="float: left;padding: 0 20px 20px 20px;width:100%;text-align:left"
          >
            单选题
            <br /><br />
            <!-- 正常答题-->
            <div v-if="answerSingle == 0 || isShow == 3">
              <a
                v-for="(a, index) in isRightSingle"
                :key="index"
                style="display: inline-block"
                class="show"
                href="javascript:void(0)"
                ref="offsetTip"
                @click="goAnchor('#anchor-' + index)"
              >
                <span
                  v-if="selectOption_single[index] > 99"
                  style="background: green;cursor: pointer;"
                  id="selectOption_single[index]"
                  >{{ index + 1 }}</span
                >
                <span v-else>{{ index + 1 }}</span>
              </a>
            </div>
            <!--查看、继续答题-->
            <a
              v-for="(a, index) in selectOption_single"
              :key="index"
              style="display: inline-block"
              v-else
              class="show"
              href="javascript:void(0)"
              @click="goAnchor('#anchor-' + index)"
            >
              <!--未填答案-->
              <span v-if="isRightSingle[index] == -1">
                {{ index + 1 }}
              </span>
              <!--正确答案-->
              <span
                v-else-if="isRightSingle[index] == 1 && testPapersState == 1"
                class="icon_success"
              >
                {{ index + 1 }}
              </span>
              <!--选中答案-->
              <span v-else-if="testPapersState == 0" style="background: green;">
                {{ index + 1 }}
              </span>
              <!--错误答案-->
              <span v-else class="icon_error">
                {{ index + 1 }}
              </span>
            </a>
            <div v-show="testPapersState == 1">
              <span>正确：{{ singleAnswer[0] }}</span>
              <span style="margin-left: 20px">错误：{{ singleAnswer[1] }}</span>
              <span style="margin-left: 20px">未填：{{ singleAnswer[2] }}</span>
            </div>
          </div>
          <div
            style="float: left;padding: 0 20px 20px 20px;width:100%;text-align:left;"
          >
            判断题
            <br /><br />
            <!-- 正常答题-->
            <div v-if="answerJudge == 0 || isShow == 3">
              <div
                v-for="(a, index) in isRightJudge"
                style="display: inline-block"
                class="show"
              >
                <span
                  v-if="
                    selectOption_judge[index] == 0 ||
                      selectOption_judge[index] == 1
                  "
                  style="background: green"
                  >{{ index + 1 }}</span
                >
                <span v-else>{{ index + 1 }}</span>
              </div>
            </div>
            <!--查看、继续答题-->
            <div
              v-for="(a, index) in selectOption_judge"
              style="display: inline-block"
              class="show"
              v-else
            >
              <!--未填答案-->
              <span v-if="a == -1">
                {{ index + 1 }}
              </span>
              <!--正确答案-->
              <span
                v-else-if="isRightJudge[index] == 1 && testPapersState == 1"
                class="icon_success"
              >
                {{ index + 1 }}
              </span>
              <!--选中答案-->
              <span v-else-if="testPapersState == 0" style="background: green;">
                {{ index + 1 }}
              </span>
              <!--错误答案-->
              <span v-else class="icon_error">
                {{ index + 1 }}
              </span>
            </div>
            <div v-show="testPapersState == 1">
              <span>正确：{{ judgeAnswer[0] }}</span>
              <span style="margin-left: 20px">错误：{{ judgeAnswer[1] }}</span>
              <span style="margin-left: 20px">未填：{{ judgeAnswer[2] }}</span>
            </div>
          </div>
          <div
            style="float: left;padding: 0 20px 20px 20px;width:100%;text-align:left;"
          >
            多选题
            <br /><br />
            <!-- 正常答题-->
            <div v-if="answerMulti == 0 || isShow == 3">
              <div
                v-for="(a, index) in isRightMulti"
                style="display: inline-block"
                class="show"
              >
                <span
                  v-if="
                    selectOption_multi[index].length > 0 &&
                      selectOption_multi[index] != -1
                  "
                  style="background: green"
                  >{{ index + 1 }}</span
                >
                <span v-else>{{ index + 1 }}</span>
              </div>
            </div>
            <!--查看、继续答题-->
            <div
              v-for="(a, index) in selectOption_multi"
              style="display: inline-block"
              class="show"
              v-else
            >
              <!--未填答案-->
              <span v-if="isRightMulti[index] == -1">
                {{ index + 1 }}
              </span>
              <!--正确答案-->
              <span
                v-else-if="isRightMulti[index] == 1 && testPapersState == 1"
                class="icon_success"
              >
                {{ index + 1 }}
              </span>
              <!--选中答案-->
              <span v-else-if="testPapersState == 0" style="background: green;">
                {{ index + 1 }}
              </span>
              <!--错误答案-->
              <span v-else class="icon_error">
                {{ index + 1 }}
              </span>
            </div>
            <div v-show="testPapersState == 1">
              <span>正确：{{ multiAnswer[0] }}</span>
              <span style="margin-left: 20px">错误：{{ multiAnswer[1] }}</span>
              <span style="margin-left: 20px">未填：{{ multiAnswer[2] }}</span>
            </div>
          </div>
          <div
            style="display: flex;justify-content: center;width: 100%;margin-bottom: 20px;"
          >
            <el-button
              type="primary"
              @click="completeFillQuestionnaire(1)"
              v-show="isShow == 0 || isShow == 3"
              >交卷
            </el-button>
            <el-button
              type="info"
              @click="completeFillQuestionnaire(0)"
              v-show="isShow == 0 || isShow == 3"
              >暂存</el-button
            >
            <el-button plain type="primary" @click="goBack">返回</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  querySynthesizeReq,
  generateReq,
  submitTestPaperReq,
  getTestPapersRecordReq
} from "@/api/examination_manage.js";
import { Message, MessageBox } from "element-ui";

export default {
  name: "examination_manage",
  data() {
    return {
      // 单样式
      classA:{

      },
      classB:{

      },
      formContainerOpen: "1",
      formContainer: this.$store.state.app.formContainer,
      pageShow: false,
      receiveTimeValue: [],
      formInline: {
        testPapersName: "",
        complexity: "",
        useObject: "",
        userId: localStorage.getItem("agentId"),
        pageNo: 1,
        pageSize: 10
      },
      generateForm: {
        testPapersName: "",
        useObject: "",
        complexity: ""
      },
      rules: {
        complexity: [
          { required: true, message: "请选择试卷难度等级", trigger: "blur" }
        ],
        useObject: [
          { required: true, message: "请选择试卷使用对象", trigger: "blur" }
        ],
        testPapersName: [
          { required: true, message: "请输入试卷名称", trigger: "blur" }
        ]
      },
      pagination: {
        pageSize: null,
        pageNo: null,
        totalCount: null,
        totalPage: null
      },
      tableData: [],
      examTitle: "", //试卷标题
      // 答题
      dialogManagementFormVisible: true,
      dialogGenerateFormVisible: false,

      testPapersId: "", // 试卷Id
      testPapersState: "", // 试卷状态
      testPapersScore: "", // 试卷得分

      singleItems: [], // 单选 所有选项
      judgeItems: [], // 判断 所有选项
      multiItems: [], // 多选 所有选项

      isRightSingle: [],
      isRightJudge: [],
      isRightMulti: [],

      singleAnswer: [],
      judgeAnswer: [],
      multiAnswer: [],

      selectOption_judge: [],
      selectOption_multi: [],
      selectOption_single: [],

      answerSingle: "",
      answerJudge: "",
      answerMulti: "",

      show_singleItems: [], // 单选 输出所有选项
      show_judgeItems: [], // 判断 输出所有选项
      show_multiItems: [], // 多选 输出所有选项
      singleCheck: false,
      multiCheck: false,
      judgeCheck: false,
      isShow: 0
    };
  },
  mounted() {
    this.handleChangeAcitve();
    this.querySynthesize(this.formInline);
  },

  methods: {
    // 新增样式
    changeClass(item){
      if(item === 1&&this.testPapersState === 1){
        return 'radio-order'
      }else if(item === 0&&this.testPapersState === 1){
        return 'radio-fail'
      }else{
        return ''
      }
    },
    changeCheckBoxClass(item){
      if(item === 1&&this.testPapersState === 1){
        return 'checkbox-success'
      }else if(item === 0&&this.testPapersState === 1){
        return 'checkbox-fail'
      }else{
        return ''
      }
    },
    // 锚点跳转
    goAnchor(selector) {
      // var anchor = this.$refs.offsetTip[0];
      console.log(this.$refs.offsetTip)
      // document.documentElement.scrollTop = anchor.offsetTop;
      console.log(11111111111111111111111111)
    },
    handleChangeAcitve(active = ["1"]) {
      if (active.length) {
        $(".form-more").text("收起");
      } else {
        $(".form-more").text("更多");
      }
    },

    // 初始查询
    querySynthesize(formInline) {
      querySynthesizeReq(formInline).then(res => {
        this.tableData = res.data.data;
        this.pagination = res.data.pageInfo;
      });
    },

    // 条件查询
    search(formInline) {
      const obj = {};
      obj.userId = localStorage.getItem("agentId");
      obj.name = formInline.name ? formInline.name : "";
      obj.complexity = formInline.complexity ? formInline.complexity : "";
      obj.state = formInline.state ? formInline.state : "";
      obj.useObject = formInline.useObject ? formInline.useObject : "";
      obj.startCreateTime = this.receiveTimeValue
        ? this.receiveTimeValue[0]
        : null;
      obj.endCreateTime = this.receiveTimeValue
        ? this.receiveTimeValue[1]
        : null;
      obj.pageNo = this.pagination.pageNo
        ? this.pagination.pageNo
        : this.formInline.pageNo;
      obj.pageSize = this.pagination.pageSize
        ? this.pagination.pageSize
        : this.formInline.pageSize;
      querySynthesizeReq(obj).then(res => {
        this.tableData = res.data.data;
        this.pagination = res.data.pageInfo;
      });
    },

    // 分页
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.search(this.formInline);
    },
    handleCurrentChange(val) {
      this.formInline.pageNo = val;
      this.formInline.pageSize = this.pagination.pageSize;
      this.search(this.formInline);
    },

    // 重置
    reset() {
      this.receiveTimeValue = [];
      this.formInline = {
        state: "",
        context: "",
        type: "",
        complexity: "",
        useObject: ""
      };
    },

    // 重置
    generateReset() {
      this.generateForm = {
        testPapersName: null,
        useObject: null,
        complexity: null
      };
    },

    // 生成考题
    generateReqForm(generateForm) {
      this.selectOption_judge = [];
      this.selectOption_single = [];
      this.selectOption_multi = [];
      this.isRightSingle = [];
      this.isRightJudge = [];
      this.isRightMulti = [];
      this.singleAnswer = [];
      this.judgeAnswer = [];
      this.multiAnswer = [];
      this.testPapersState = "";
      if (
        this.generateForm.testPapersName === "" ||
        this.generateForm.testPapersName === null
      ) {
        Message({
          message: "请填写试题名称",
          type: "error"
        });
        return;
      } else {
        console.log(generateForm);
        this.$refs["generateForm"].validate(valid => {
          if (valid) {
            generateReq(generateForm, localStorage.getItem("agentId")).then(
              res => {
                if (res.data.code === 0) {
                  this.dialogGenerateFormVisible = false;
                  this.dialogManagementFormVisible = false;
                  this.show_singleItems = res.data.data[0];
                  this.show_judgeItems = res.data.data[1];
                  this.show_multiItems = res.data.data[2];
                  this.testPapersId = res.data.data[3];
                  this.examTitle = res.data.data[4];
                  this.isShow = 0;

                  this.dialogGenerateFormVisible = false;
                  this.dialogManagementFormVisible = false;
                  for (let i = 0; i < this.show_multiItems.length; i++) {
                    this.selectOption_multi[i] = [];
                  }
                  for (var i = 0; i < 10; i++) {
                    this.isRightSingle.push(-1);
                    this.isRightJudge.push(-1);
                    this.isRightMulti.push(-1);
                  }
                  this.answerSingle = "0";
                  this.answerJudge = "0";
                  this.answerMulti = "0";

                  this.formInline = {
                    testPapersName: "",
                    complexity: "",
                    useObject: "",
                    userId: localStorage.getItem("agentId"),
                    pageNo: 1,
                    pageSize: 10
                  };
                } else {
                  Message({
                    message: res.data.message,
                    type: "error"
                  });
                }
              }
            );
          }
        });
      }
    },

    // 完成试卷填写
    completeFillQuestionnaire(judge) {
      this.hasBlanksOrNot(
        this.selectOption_single,
        this.selectOption_multi,
        this.selectOption_judge
      );
      var reminder;
      if (judge == 0) {
        // 暂存
        if (
          this.singleCheck === true &&
          this.multiCheck === true &&
          this.judgeCheck === true
        ) {
          reminder = "确定暂存试卷吗？";
        } else {
          reminder = "试卷存在未作答考题，确定暂存试卷吗？";
        }
      } else {
        // 交卷
        if (
          this.singleCheck === true &&
          this.multiCheck === true &&
          this.judgeCheck === true
        ) {
          reminder = "提交完成后不可修改，确定提交试卷吗？";
        } else {
          reminder = "试卷存在未作答考题，提交完成后不可修改，确定继续提交吗？";
        }
      }
      MessageBox.confirm(reminder, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.singleItems.length = 0;
        this.judgeItems.length = 0;
        this.multiItems.length = 0;

        for (var a = 0; a < this.show_singleItems.length; a++) {
          this.singleItems.push({
            questionsId: this.show_singleItems[a].id,
            type: 1,
            solutionId:
              this.selectOption_single[a] == -1
                ? 0
                : this.selectOption_single[a]
          });
        }
        // 判断题
        for (var a = 0; a < this.show_judgeItems.length; a++) {
          this.judgeItems.push({
            questionsId: this.show_judgeItems[a].id,
            type: 2,
            isRight: this.selectOption_judge[a]
          });
        }
        // 多选题
        for (var b = 0; b < this.show_multiItems.length; b++) {
          this.multiItems.push({
            questionsId: this.show_multiItems[b].id,
            type: 3,
            options: []
          });

          for (var i = 0; i < this.selectOption_multi[b].length; i++) {
            if (this.selectOption_multi[b][i] != -1) {
              this.multiItems[b].options.push({
                solutionId: this.selectOption_multi[b][i]
              });
            }
          }
        }
        submitTestPaperReq(
          this.singleItems,
          this.judgeItems,
          this.multiItems,
          localStorage.getItem("agentId"),
          this.testPapersId,
          judge
        ).then(res => {
          if (res.data.code === 0) {
            Message({
              message: res.data.message,
              type: "success"
            });
            this.dialogManagementFormVisible = true;
            this.querySynthesize(this.formInline);
          } else {
            Message({
              message: res.data.message,
              type: "error"
            });
          }
        });
      });
    },

    // 判断是否还有未填写
    hasBlanksOrNot(
      selectOption_single,
      selectOption_multi,
      selectOption_judge
    ) {
      this.singleCheck = false;
      this.judgeCheck = false;
      this.multiCheck = false;
      for (var i = 0; i < 10; i++) {
        if (selectOption_single.length === 0) {
          this.singleCheck = false;
          return;
        }
        if (selectOption_single[i].toString().indexOf(-1) >= 0) {
          this.singleCheck = false;
          return;
        } else {
          this.singleCheck = true;
        }

        if (selectOption_judge.length === 0) {
          this.judgeCheck = false;
          return;
        }
        if (selectOption_judge[i].toString().indexOf(-1) >= 0) {
          this.judgeCheck = false;
          return;
        } else {
          this.judgeCheck = true;
        }

        if (selectOption_multi[i].length > 0) {
          for (let j = 0; j < selectOption_multi[i].length; j++) {
            if (selectOption_multi[i][j].toString().indexOf("-1") >= 0) {
              if (selectOption_multi[i].length === j + 1) {
                this.multiCheck = false;
                return;
              }
              this.multiCheck = false;
            } else {
              this.multiCheck = true;
              break;
            }
          }
        } else {
          this.multiCheck = false;
          return;
        }
      }
    },

    // 查看考题回显
    getTestPapersRecord(testPapersId, judge) {
      this.selectOption_single = [];
      this.selectOption_judge = [];
      this.selectOption_multi = [];
      this.isRightSingle = [];
      this.isRightJudge = [];
      this.isRightMulti = [];
      this.singleAnswer = [];
      this.judgeAnswer = [];
      this.multiAnswer = [];

      this.answerSingle = "1";
      this.answerJudge = "1";
      this.answerMulti = "1";

      getTestPapersRecordReq(testPapersId, judge).then(res => {
        this.dialogGenerateFormVisible = false;
        this.dialogManagementFormVisible = false;
        this.show_singleItems = res.data.data[0];
        this.show_judgeItems = res.data.data[1];
        this.show_multiItems = res.data.data[2];
        this.examTitle = res.data.data[7];
        // 正常答题：0  ---  暂存查看：1    --- 暂存答题：3
        this.isShow = res.data.data[3];

        this.testPapersId = res.data.data[4];
        // 
        this.testPapersState = res.data.data[5];
        this.testPapersScore = res.data.data[6];

        var temp;
        var singleSucAnswerNum = 0;
        var singleErrorAnswerNum = 0;
        var singleEmptyAnswerNum = 0;
        // 单选题

        for (var a = 0; a < 10; a++) {
          if (this.show_singleItems[a].isSelected !== 0) {
            temp = parseInt(this.show_singleItems[a].selectedValue);
            this.selectOption_single.push(temp);
            this.isRightSingle.push(this.show_singleItems[a].isRight);
            if (this.show_singleItems[a].isRight === 1) {
              singleSucAnswerNum++;
            } else {
              singleErrorAnswerNum++;
            }
          } else {
            this.selectOption_single.push(-1);
            this.isRightSingle.push(-1);
            singleEmptyAnswerNum++;
          }
        }
        this.singleAnswer.push(singleSucAnswerNum);
        this.singleAnswer.push(singleErrorAnswerNum);
        this.singleAnswer.push(singleEmptyAnswerNum);

        // 判断题
        var judgeSucAnswerNum = 0;
        var judgeErrorAnswerNum = 0;
        var judgeEmptyAerNum = 0;
        this.selectOption_judge = [];
        for (var b = 0; b < 10; b++) {
          if (this.show_judgeItems[b].isSelected !== 0) {
            temp = parseInt(this.show_judgeItems[b].selectedValue);
            this.selectOption_judge.push(temp);
            this.isRightJudge.push(this.show_judgeItems[b].isRight);
            if (this.show_judgeItems[b].isRight === 1) {
              judgeSucAnswerNum++;
            } else {
              judgeErrorAnswerNum++;
            }
          } else {
            this.selectOption_judge.push(-1);
            this.isRightJudge.push(-1);
            judgeEmptyAerNum++;
          }
        }
        this.judgeAnswer.push(judgeSucAnswerNum);
        this.judgeAnswer.push(judgeErrorAnswerNum);
        this.judgeAnswer.push(judgeEmptyAerNum);

        // 多选题
        var multiSucAnswerNum = 0;
        var multiErrorAnswerNum = 0;
        var multiEmptyAerNum = 0;
        for (var c = 0; c < 10; c++) {
          this.selectOption_multi.push([]);
          if (this.show_multiItems[c].isSelected !== 0) {
            var idsArr = this.show_multiItems[c].selectedValue.split(",");
            var temp = idsArr.length - 1;
            for (var d = 0; d < temp; d++) {
              this.selectOption_multi[c].push(parseInt(idsArr[d]));
            }
            this.isRightMulti.push(this.show_multiItems[c].isRight);
            if (this.show_multiItems[c].isRight === 1) {
              multiSucAnswerNum++;
            } else {
              multiErrorAnswerNum++;
            }
          } else {
            this.selectOption_multi[c].push(-1);
            this.isRightMulti.push(-1);
            multiEmptyAerNum++;
          }
        }

        this.multiAnswer.push(multiSucAnswerNum);
        this.multiAnswer.push(multiErrorAnswerNum);
        this.multiAnswer.push(multiEmptyAerNum);
      });
    },

    // 生成考题窗口控制
    generateTestPapers() {
      this.dialogGenerateFormVisible = true;
    },

    goBack() {
      this.dialogManagementFormVisible = true;
      this.querySynthesize(this.formInline);
    },

    // 表单判断
    showQuestionsState(judge) {
      if (judge === 0) {
        return "考试中";
      } else if (judge === 1) {
        return "已交卷";
      }
    },
    showQuestionsComplexity(judge) {
      if (judge === 1) {
        return "简单";
      } else if (judge === 2) {
        return "中等";
      } else if (judge === 3) {
        return "困难";
      }
    },
    showQuestionsUseObject(judge) {
      if (judge === 1) {
        return "坐席主管 ";
      } else if (judge === 2) {
        return "坐席";
      } else if (judge === 3) {
        return "质检主管";
      } else if (judge === 4) {
        return "质检员";
      }
    }
  }
};
</script>
<style>
#app .main-container {
  background-color: #fff !important;
}
</style>

<style scoped>
.show {
  cursor: pointer;
  
}
.show span {
  position: relative;
  display: block;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border: 1px solid #dcdfe6;
  margin-right: 10px;
  margin-bottom: 10px;
}

img {
  width: 50px;
  margin-left: 30px;
}
.icon_success::after{
  content: "";
  width: 15px;
  height: 15px;
  background: url(../../../static/images/select_yes.png) no-repeat;
  background-size: 100% 100%;
  position: absolute;
  bottom: 0;
  right: 0;
}
.icon_error::after{
  content: "";
  width: 15px;
  height: 15px;
  background: url(../../../static/images/select_no.png) no-repeat;
   background-size: 100% 100%;
  position: absolute;
  bottom: 0;
  right: 0;
}
.border_color_red{
  border-color: red;
}
.border_color_green{
  border-color: green;
}
</style>
