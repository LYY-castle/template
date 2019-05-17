<template>
  <div class="container">
    <el-row class="table-container" v-if="tableShow">
      <el-row class="margin-bottom-20">
        <div class="font14 bold">工作表单</div>
      </el-row>
      <el-row class="margin-bottom-20">
        <el-button
          type="success"
          size="small"
          @click="
            createWorkFrom;
            tableShow = false;
            createShow = true;
          "
          >新建</el-button
        >
        <!-- <el-button type="danger" size="small" @click="batchDelVisible = true"
          >批量删除</el-button
        > -->
        <!-- <el-button type="info" size="small" @click="importVisible=true;importInfo.uploadFileName='';importInfo.batchName='';importInfo.source=''">导入客户</el-button> -->
      </el-row>
      <el-row>
        <el-table :data="workFromData" highlight-current-row>
          <!-- <el-table-column align="center" type="selection" width="55">
          </el-table-column> -->

          <el-table-column
            align="center"
            label="表单名"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="modifierName"
            label="操作人"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ scope.row.modifierName }}
            </template>
          </el-table-column>
          <!-- 操作时间 -->
          <el-table-column align="center" width="155" label="操作时间">
            <template slot-scope="scope">
              {{ formatDateTime(scope.row.modifyTime) }}
            </template>
          </el-table-column>

          <el-table-column align="center" label="备注">
            <template slot-scope="scope">
              {{ scope.row.remark }}
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column align="center" label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                @click="searchByCustomerId(scope.row, 2)"
                type="text"
                size="small"
                >修改</el-button
              >
              <el-button
                @click="
                  delVisible = true;
                  workFormId = scope.row.id;
                "
                type="text"
                size="small"
                >删除</el-button
              >
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
          :total="pageInfo.totalCount"
          style="text-align: right;float:right;"
        >
        </el-pagination>
      </el-row>
    </el-row>
    <!-- 新建工作表单 -->
    <div v-if="createShow">
      <el-row :gutter="20">
        <!-- 选择类型 -->
        <el-col :span="4">
          <el-menu class="el-menu-vertical-demo">
            <el-menu-item index="1" @click="addDemo(1)">
              <i class="el-icon-edit"></i>
              <span slot="title">单行文本</span>
            </el-menu-item>
            <el-menu-item index="2" @click="addDemo(2)">
              <i class="el-icon-tickets"></i>
              <span slot="title">多行文本</span>
            </el-menu-item>
            <el-menu-item index="3" @click="addDemo(3)">
              <i class="el-icon-plus"></i>
              <span slot="title">数字</span>
            </el-menu-item>
            <el-menu-item index="4" @click="addDemo(4)">
              <i class="el-icon-circle-check-outline"></i>
              <span slot="title">单选框</span>
            </el-menu-item>
            <el-menu-item index="5" @click="addDemo(5)">
              <i class="el-icon-success"></i>
              <span slot="title">多选框</span>
            </el-menu-item>
            <el-menu-item index="6" @click="addDemo(6)">
              <i class="el-icon-arrow-down"></i>
              <span slot="title">下拉框</span>
            </el-menu-item>
            <el-menu-item index="7" @click="addDemo(7)">
              <i class="el-icon-date"></i>
              <span slot="title">时间</span>
            </el-menu-item>
          </el-menu>
        </el-col>
        <!-- 模板 -->
        <el-col :span="12" style="background-color: #fff;">
          <div class="template">
            <div class="title" @click="changeTitle">
              {{ workFormTable.name }}
            </div>
            <div
              class="selectShow"
              v-for="(item, index) in workFormTable.workformProperties"
              :key="index"
              v-dragging="{
                item: item,
                list: workFormTable.workformProperties,
                group: 'item'
              }"
              @click="changeItem(item, index)"
            >
              <div v-if="item.dataType === 'input'" class="demo">
                <div class="name">{{ item.name }}</div>
                <div class="name">{{ item.val }}</div>
                <el-input
                  size="small"
                  :disabled="item.rw === 0 ? true : false"
                  style="inputWidth"
                  :placeholder="item.placeholder"
                ></el-input>
              </div>
              <div v-if="item.dataType === 'textarea'" class="demo">
                <div class="name">{{ item.name }}</div>
                <div class="name">{{ item.val }}</div>
                <el-input
                  size="small"
                  type="textarea"
                  :rows="1"
                  :disabled="item.rw === 0 ? true : false"
                  style="inputWidth"
                  :placeholder="item.placeholder"
                ></el-input>
              </div>
              <div v-if="item.dataType === 'number'" class="demo">
                <div class="name">{{ item.name }}</div>
                <div class="name">{{ item.val }}</div>
                <el-input
                  size="small"
                  type="number"
                  :disabled="item.rw === 0 ? true : false"
                ></el-input>
              </div>
              <div v-if="item.dataType === 'radio'" class="demo">
                <div class="name">{{ item.name }}</div>
                <div class="name">{{ item.val }}</div>
                <!-- <div v-for="(a, k) in item.options" :key="k">
                  <el-radio-group>
                    <el-radio :label="k" :disabled="item.rw===0?true:false">{{
                      a.content
                    }}</el-radio>
                  </el-radio-group>
                </div> -->
              </div>
              <div v-if="item.dataType === 'checkbox'" class="demo">
                <div class="name">{{ item.name }}</div>
                <div class="name">{{ item.val }}</div>
                <!-- <div>
                  <el-checkbox-group v-for="(a, k) in item.options" :key="k">
                    <el-checkbox label="k" :disabled="item.rw===0?true:false">{{
                      a.content
                    }}</el-checkbox>
                  </el-checkbox-group>
                </div> -->
              </div>
              <div v-if="item.dataType === 'select'" class="demo">
                <div class="name">{{ item.name }}</div>
                <div class="name">{{ item.val }}</div>
                <!-- <el-select
                  :placeholder="item.placeholder"
                  v-model="item.value"
                  :disabled="item.rw===0?true:false"
                >
                  <el-option
                    v-for="(a, i) in item.options"
                    :key="i"
                    :value="a.content"
                    :disabled="item.rw===0?true:false"
                  ></el-option>
                </el-select> -->
              </div>
              <div v-if="item.dataType === 'datetime'" class="demo">
                <div class="name">{{ item.name }}</div>
                <div class="name">{{ item.val }}</div>
                <el-date-picker
                  type="datetime"
                  :placeholder="item.placeholder"
                  :disabled="item.rw === 0 ? true : false"
                >
                </el-date-picker>
              </div>
              <div class="tools">
                <i class="el-icon-plus" @click="addDemo()"></i>
                <i
                  class="el-icon-delete"
                  @click="removeDemo(index)"
                  title="删除"
                ></i>
                <i class="el-icon-rank" title="可拖拽"></i>
              </div>
            </div>
            <div style="display: flex;justify-content: center;">
              <el-button size="small" type="primary" @click="submitUpload"
                >提交</el-button
              >
              <el-button
                size="small"
                type="primary"
                plain
                @click="
                  workFormTable = [];
                  createShow = false;
                  tableShow = true;
                "
                >返回</el-button
              >
            </div>
          </div>
        </el-col>
        <!-- 设值 -->
        <el-col :span="7" class="setting">
          <div v-show="table">
            <div>
              <div><span>工单名称</span></div>
              <el-input
                type="textarea"
                :rows="1"
                v-model="workFormTable.name"
              ></el-input>
            </div>
            <div>
              <div><span>工单有效性</span></div>
              <el-radio-group v-model="workFormTable.enabled">
                <el-radio label="1">有效</el-radio><br />
                <el-radio label="0">无效</el-radio>
              </el-radio-group>
            </div>
            <div>
              <div><span>工单备注</span></div>
              <el-input
                type="textarea"
                :rows="1"
                v-model="workFormTable.remark"
              ></el-input>
            </div>
            <div>
              <div><span>工单版本</span></div>
              <el-input
                type="textarea"
                :rows="1"
                v-model="workFormTable.remark"
              ></el-input>
            </div>
          </div>
          <div
            v-for="(item, index) in workFormTable.workformProperties"
            :key="index"
            v-show="text"
          >
            <div v-show="item.dataType === 'input' && typeShow[index]">
              <div>
                <div><span>字段名称</span></div>
                <el-input type="text" :rows="1" v-model="item.name"></el-input>
              </div>
              <div>
                <div><p>字段描述</p></div>
                <el-input
                  type="text"
                  :rows="2"
                  v-model="item.val"
                ></el-input>
              </div>
              <div>
                <div><span>默认值</span></div>
                <el-input type="text"></el-input>
              </div>

              <div>
                <div><span>默认占位符</span></div>
                <el-input type="text" v-model="item.placeholder"></el-input>
              </div>

              <div>
                <div><span>设置</span></div>
                <el-radio-group v-model="item.rw">
                  <el-radio label="0">只读</el-radio><br />
                  <el-radio label="1">可读可写</el-radio>
                </el-radio-group>
              </div>
              <div>
                <div><span>校验规则</span></div>
                <el-input type="text" v-model="item.regex"></el-input>
              </div>

              <div>
                <div><span>备注</span></div>
                <el-input type="text" v-model="item.remark"> </el-input>
              </div>
            </div>
            <div v-show="item.dataType === 'textarea' && typeShow[index]">
              <div>
                <div><span>字段名称</span></div>
                <el-input type="text" :rows="1" v-model="item.name"></el-input>
              </div>
              <div>
                <div><p>字段描述</p></div>
                <el-input
                  type="textarea"
                  :rows="2"
                  v-model="item.val"
                ></el-input>
              </div>
              <div>
                <div><span>默认值</span></div>
                <el-input type="text"></el-input>
              </div>

              <div>
                <div><span>默认占位符</span></div>
                <el-input type="text" v-model="item.placeholder"></el-input>
              </div>

              <div>
                <div><span>设置</span></div>
                <el-radio-group v-model="item.rw">
                  <el-radio label="0">只读</el-radio><br />
                  <el-radio label="1">可读可写</el-radio>
                </el-radio-group>
              </div>
              <div>
                <div><span>校验规则</span></div>
                <el-input type="text" v-model="item.regex"></el-input>
              </div>

              <div>
                <div><span>备注</span></div>
                <el-input type="text" v-model="item.remark"> </el-input>
              </div>
            </div>
            <div v-show="item.dataType === 'number' && typeShow[index]">
              <div>
                <div><span>字段名称</span></div>
                <el-input type="text" :rows="1" v-model="item.name"></el-input>
              </div>
              <div>
                <div><p>字段描述</p></div>
                <el-input
                  type="textarea"
                  :rows="2"
                  v-model="item.val"
                ></el-input>
              </div>
              <div>
                <div><span>默认值</span></div>
                <el-input type="text"></el-input>
              </div>

              <div>
                <div><span>默认占位符</span></div>
                <el-input type="text" v-model="item.placeholder"></el-input>
              </div>

              <div>
                <div><span>设置</span></div>
                <el-radio-group v-model="item.rw">
                  <el-radio label="0">只读</el-radio><br />
                  <el-radio label="1">可读可写</el-radio>
                </el-radio-group>
              </div>
              <div>
                <div><span>校验规则</span></div>
                <el-input type="text" v-model="item.regex"></el-input>
              </div>

              <div>
                <div><span>备注</span></div>
                <el-input type="text" v-model="item.remark"> </el-input>
              </div>
            </div>
            <div v-show="item.dataType === 'radio' && typeShow[index]">
              <div>
                <div><span>字段名称</span></div>
                <el-input type="text" :rows="1" v-model="item.name"></el-input>
              </div>
              <div>
                <div><p>字段描述</p></div>
                <el-input
                  type="textarea"
                  :rows="2"
                  v-model="item.val"
                ></el-input>
              </div>
              <div>
                <div><span>选择项</span></div>
                <!-- <div v-for="(a, k) in item.options" :key="k">
                  <el-radio-group>
                    <el-radio :label="1"
                      ><el-input
                        size="small"
                        type="text"
                        v-model="a.content"
                        clearable
                      ></el-input>
                      <el-button
                        icon="el-icon-arrow-up"
                        type="text"
                        size="mini"
                        title="上移"
                        @click="upOption(item.options, k, item.options.length)"
                      ></el-button>
                      <el-button
                        icon="el-icon-arrow-down"
                        type="text"
                        size="mini"
                        title="下移"
                        @click="
                          downOption(item.options, k, item.options.length)
                        "
                      ></el-button>
                      <el-button
                        icon="el-icon-delete"
                        type="text"
                        size="mini"
                        title="删除"
                        @click="removeRadio(item.options, k)"
                      ></el-button>
                    </el-radio>
                  </el-radio-group>
                </div> -->
              </div>

              <div>
                <div><span>设置</span></div>
                <el-radio-group v-model="item.rw">
                  <el-radio label="0">只读</el-radio><br />
                  <el-radio label="1">可读可写</el-radio>
                </el-radio-group>
              </div>
              <div>
                <div><span>校验规则</span></div>
                <el-input type="text" v-model="item.regex"></el-input>
              </div>

              <div>
                <div><span>备注</span></div>
                <el-input type="text" v-model="item.remark"> </el-input>
              </div>
            </div>
            <div v-show="item.dataType === 'checkbox' && typeShow[index]">
              <div>
                <div><span>字段名称</span></div>
                <el-input type="text" :rows="1" v-model="item.name"></el-input>
              </div>
              <div>
                <div><p>字段描述</p></div>
                <el-input
                  type="textarea"
                  :rows="2"
                  v-model="item.val"
                ></el-input>
              </div>
              <!-- <div>
                <div><span>选择项</span></div>
                <div v-for="(a, k) in item.options" :key="k">
                  <el-checkbox-group>
                    <el-checkbox label="复选框 A"
                      ><el-input
                        size="small"
                        type="text"
                        v-model="a.content"
                        clearable
                      ></el-input>
                      <el-button
                        icon="el-icon-arrow-up"
                        type="text"
                        size="mini"
                        title="上移"
                        @click="upOption(item.options, a, item.options.length)"
                      ></el-button>
                      <el-button
                        icon="el-icon-arrow-down"
                        type="text"
                        size="mini"
                        title="下移"
                        @click="
                          downOption(item.options, a, item.options.length)
                        "
                      ></el-button>
                      <el-button
                        icon="el-icon-delete"
                        type="text"
                        size="mini"
                        title="删除"
                        @click="removeRadio(item.options, a)"
                      ></el-button>
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
              </div> -->

              <div>
                <div><span>设置</span></div>
                <el-radio-group v-model="item.rw">
                  <el-radio label="0">只读</el-radio><br />
                  <el-radio label="1">可读可写</el-radio>
                </el-radio-group>
              </div>
              <div>
                <div><span>校验规则</span></div>
                <el-input type="text" v-model="item.regex"></el-input>
              </div>

              <div>
                <div><span>备注</span></div>
                <el-input type="text" v-model="item.remark"> </el-input>
              </div>
            </div>
            <div v-show="item.dataType === 'select' && typeShow[index]">
              <div>
                <div><span>字段名称</span></div>
                <el-input type="text" :rows="1" v-model="item.name"></el-input>
              </div>
              <div>
                <div><p>字段描述</p></div>
                <el-input
                  type="textarea"
                  :rows="2"
                  v-model="item.val"
                ></el-input>
              </div>
              <div>
                <div><span>选择项</span></div>
                <!-- <div>
                  <el-input
                    type="text"
                    v-for="(a, k) in item.options"
                    :key="k"
                    v-model="a.content"
                  ></el-input>
                </div> -->
              </div>
              <div>
                <div><span>设置</span></div>
                <el-radio-group v-model="item.rw">
                  <el-radio label="0">只读</el-radio><br />
                  <el-radio label="1">可读可写</el-radio>
                </el-radio-group>
              </div>
              <div>
                <div><span>校验规则</span></div>
                <el-input type="text" v-model="item.regex"></el-input>
              </div>

              <div>
                <div><span>备注</span></div>
                <el-input type="text" v-model="item.remark"> </el-input>
              </div>
            </div>
            <div v-show="item.dataType === '' && typeShow[index]">
              <div>
                <div><span>字段名称</span></div>
                <el-input type="text" :rows="1" v-model="item.name"></el-input>
              </div>
              <div>
                <div><p>字段描述</p></div>
                <el-input
                  type="textarea"
                  :rows="2"
                  v-model="item.val"
                ></el-input>
              </div>
              <div>
                <div><span>默认值</span></div>
                <el-input type="text"></el-input>
              </div>

              <div>
                <div><span>默认占位符</span></div>
                <el-input type="text" v-model="item.placeholder"></el-input>
              </div>

              <div>
                <div><span>设置</span></div>
                <el-radio-group v-model="item.rw">
                  <el-radio label="0">只读</el-radio><br />
                  <el-radio label="1">可读可写</el-radio>
                </el-radio-group>
              </div>
              <div>
                <div><span>校验规则</span></div>
                <el-input type="text" v-model="item.regex"></el-input>
              </div>

              <div>
                <div><span>备注</span></div>
                <el-input type="text" v-model="item.remark"> </el-input>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 单个删除dialog -->
    <el-dialog
      width="30%"
      title="操作提示"
      :visible.sync="delVisible"
      append-to-body
    >
      <span style="font-size:20px;">确定删除此工作表单？</span>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button
          type="primary"
          @click="
            delVisible = false;
            deleteWorkForm(workFormId);
          "
          >确定</el-button
        >
        <el-button type="primary" plain @click="delVisible = false"
          >取消</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getWorkForm,
  deleteWorkForm,
  createWorkForm,
  queryWorkForm
} from "@/api/work_form_manage";
import { formatDateTime, swapArray } from "@/utils/tools";

export default {
  name: "work_form_manage",
  data() {
    return {
      formContainerOpen: "1",
      // 工作表单列表
      workFromData: [],
      createShow: false,
      delVisible: false,
      tableShow: true,
      table: true, //标题显示
      text: false, //单题属性显示
      // 数据双向绑定
      // 单个展示
      typeShow: [],
      // 工作表单
      workFormTable: {
        name: "工单名称",
        enabled: "1",
        remark: "",
        version: 0,
        workformProperties: []
      },

      // 分页数据
      pageShow: false,
      pageInfo: {}
    };
  },
  mounted() {
    this.getWorkFormList();
    this.$dragging.$on("dragged", ({ value }) => {
      // this.workFormTable = value.list;
      console.log(this.workFormTable);
    });
  },
  methods: {
    // 获取列表数据
    getWorkFormList() {
      getWorkForm()
        .then(res => {
          if (res.data.code === 0) {
            this.workFromData = res.data.data;
            if (res.data.pageInfo) {
              this.pageInfo = res.data.pageInfo;
              this.pageShow = true;
            } else {
              this.pageShow = false;
            }
          } else {
            this.$message(res.data.messages);
            this.workFromData = res.data.data;
            this.pageShow = false;
          }
        })
        .catch(error => {
          throw error;
        });
    },
    // 新建初始化
    createWorkFrom() {},
    // 时间格式转换,
    formatDateTime: formatDateTime,
    // 收起展开
    handleChangeAcitve(active = ["1"]) {
      if (active.length) {
        $(".form-more").text("收起");
      } else {
        $(".form-more").text("更多");
      }
    },
    // 添加模板
    addDemo(num) {
      this.initFrom(num);
    },
    // 删除题目类型
    removeDemo(index) {
      this.workFormTable.splice(index, 1);
    },
    // 删除工作表单
    deleteWorkForm(workFormId) {
      deleteWorkForm(workFormId)
        .then(response => {
          if (response.data.code === 0) {
            this.$message.success(response.data.message);
            this.getWorkFormList();
          } else {
            this.$message.error(response.data.message);
          }
        })
        .catch(error => {
          console.log(error);
          this.$message("删除失败");
        });
    },

    // 标题属性切换
    changeTitle() {
      this.table = true;
      this.text = false;
    },
    // 点击类型初始化题型
    initFrom(num) {
      if (num === 1) {
        this.workFormTable.workformProperties.push({
          dataType: 'input',
          dataValues: "",
          defaultValue: "",
          formatValue: "",
          isRequired: 0,
          isSmsColumn: 0,
          workform: {},
          maxValue: "",
          minValue: "",
          name: "单行文本",
          placeholder: "",
          regex: "",
          remark: "",
          rw: 0,
          val: "",
          styleValue: ""
        });
      } else if (num === 2) {
        this.workFormTable.workformProperties.push({
          dataType: 'textarea',
          dataValues: "",
          defaultValue: "",
          formatValue: "",
          isRequired: 0,
          isSmsColumn: 0,
          workform: {},
          maxValue: "",
          minValue: "",
          name: "多行文本",
          placeholder: "",
          regex: "",
          remark: "",
          rw: 0,
          val: "",
          styleValue: ""
        });
      } else if (num === 3) {
        this.workFormTable.workformProperties.push({
          dataType: 'number',
          dataValues: "",
          defaultValue: "",
          formatValue: "",
          isRequired: 0,
          isSmsColumn: 0,
          workform: {},
          maxValue: "",
          minValue: "",
          name: "数字",
          placeholder: "",
          regex: "",
          remark: "",
          rw: 0,
          val: "",
          styleValue: ""
        });
      } else if (num === 4) {
        this.workFormTable.workformProperties.push({
          dataType: 'radio',
          dataValues: "",
          defaultValue: "",
          formatValue: "",
          isRequired: 0,
          isSmsColumn: 0,
          workform: {},
          maxValue: "",
          minValue: "",
          name: "单选框",
          placeholder: "",
          regex: "",
          remark: "",
          rw: 0,
          val: "",
          styleValue: ""
        });
      } else if (num === 5) {
        this.workFormTable.workformProperties.push({
          dataType: 'checkbox',
          dataValues: "",
          defaultValue: "",
          formatValue: "",
          isRequired: 0,
          isSmsColumn: 0,
          workform: {},
          maxValue: "",
          minValue: "",
          name: "多选框",
          placeholder: "",
          regex: "",
          remark: "",
          rw: 0,
          val: "",
          styleValue: ""
        });
      } else if (num === 6) {
        this.workFormTable.workformProperties.push({
          dataType: 'select',
          dataValues: "",
          defaultValue: "",
          formatValue: "",
          isRequired: 0,
          isSmsColumn: 0,
          workform: {},
          maxValue: "",
          minValue: "",
          name: "下拉框",
          placeholder: "",
          regex: "",
          remark: "",
          rw: 0,
          val: "",
          styleValue: ""
        });
      } else if (num === 7) {
        this.workFormTable.workformProperties.push({
          dataType: 'datetime',
          dataValues: "",
          defaultValue: "",
          formatValue: "",
          isRequired: 0,
          isSmsColumn: 0,
          workform: {},
          maxValue: "",
          minValue: "",
          name: "时间",
          placeholder: "",
          regex: "",
          remark: "",
          rw: 0,
          val: "",
          styleValue: ""
        });
      }
    },
    // 点击题项初始化数据
    changeItem(item, index) {
      this.table = false;
      this.text = false;
      this.typeShow.length = this.workFormTable.workformProperties.length;
      for (let i = 0; i < this.workFormTable.workformProperties.length; i++) {
        this.typeShow[i] = false;
      }
      this.typeShow[index] = true;
      this.text = this.typeShow[index];
    },
    // 上移
    upOption(arr, index, length) {
      if (index !== 0) {
        swapArray(arr, index, index - 1);
      } else {
        this.$message.error("当前该项已在顶部");
      }
    },
    // 下移
    downOption(arr, index, length) {
      if (index !== length - 1) {
        swapArray(arr, index, index + 1);
      } else {
        this.$message.error("当前该项已在底部");
      }
    },
    // 删除单选项
    removeRadio(a, index) {
      a.splice(index, 1);
    },
    // 提交
    submitUpload() {
      console.log(this.workFormTable);
    },
    // 页面显示条数
    handleSizeChange(val) {
      this.req2.pageSize = val;
      this.req.pageSize = val;
      this.pageInfo.pageNo = 1;
      this.req.pageNo = 1;
      this.req2.pageNo = 1;
      this.searchCustomer(this.req2);
    },
    // 分页翻页功能
    handleCurrentChange(val) {
      this.req2.pageNo = val;
      this.searchCustomer(this.req2);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.table-container {
  .form-container {
    box-shadow: none;
    border: 1px solid #ebeef5;
    border-left: solid 4px #57afff;
  }
}

.inputWidth {
  width: 55%;
}
.inputWidth1 {
  width: 46%;
}
.showaddTool {
  float: right;
  margin: 0px 65%;
  height: 20px;
  cursor: pointer;
}
.title {
  padding: 10px;
  &:hover {
    border: 1px dashed #eee;
    background-color: rgba(87, 175, 255, 0.1);
    cursor: pointer;
  }
}
.tools {
  display: flex;
  justify-content: flex-end;
  i {
    margin: 0 10px;
    font-size: 18px;
    cursor: pointer;
    display: none;
  }
}
.template {
  padding: 20px 10px;
  height: 800px;
  overflow: hidden;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 0;
  }
}
.selectShow {
  &:hover {
    cursor: pointer;
    border: 1px dashed #eee;
    background-color: rgba(87, 175, 255, 0.1);
    i {
      display: block;
    }
  }
  .demo {
    padding: 10px;
    .name {
      font-size: 14px;
      margin-bottom: 10px;
    }
  }
}
.setting {
  background-color: #fff;
  height: 800px;
  margin-left: 15px;
  padding: 20px;
  overflow: hidden;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 0;
  }
  & > div {
    margin-bottom: 10px;
    span {
      font-size: 14px;
      display: inline-block;
      margin: 15px 0 5px 0;
    }
    p {
      font-size: 14px;
      display: inline-block;
      margin: 15px 0 5px 0;
    }
  }
}
.el-radio,
.el-radio + .el-radio {
  margin: 10px 0;
}
.el-checkbox {
  margin-bottom: 10px;
}
.el-input {
  margin: 5px 0;
}
</style>
