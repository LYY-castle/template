<template>
  <div class="container">
    <el-row class="table-container" v-if="tableShow">
      <el-row class="margin-bottom-20">
        <div class="font14 bold">工作表单</div>
      </el-row>
      <el-row class="margin-bottom-20">
        <el-button type="success" size="small" @click="createWorkFrom()">新建</el-button>
        <el-button type="danger" size="small" @click="mutipledelVisible = true">批量删除</el-button>
        <!-- <el-button type="info" size="small" @click="importVisible=true;importInfo.uploadFileName='';importInfo.batchName='';importInfo.source=''">导入客户</el-button> -->
      </el-row>
      <el-row>
        <el-table
          :data="workFormData"
          highlight-current-row
          @selection-change="handleSelectionChange"
          ref="multipleTable"
        >
          <el-table-column align="center" type="selection" width="55"></el-table-column>

          <el-table-column align="center" label="表单名" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span @click="edite(scope.row)" style="color:red;cursor:pointer;">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="modifierName"
            label="操作人"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">{{ scope.row.modifierName }}</template>
          </el-table-column>
          <!-- 操作时间 -->
          <el-table-column align="center" width="155" label="操作时间">
            <template slot-scope="scope">{{ formatDateTime(scope.row.modifyTime) }}</template>
          </el-table-column>

          <el-table-column align="center" label="备注">
            <template slot-scope="scope">{{ scope.row.remark }}</template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column align="center" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="showModifyContent(scope.row)" type="text" size="small">修改</el-button>
              <el-button
                @click="
                  singledelVisible = true;
                  workFormId = scope.row.id;
                "
                type="text"
                size="small"
              >删除</el-button>
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
        ></el-pagination>
      </el-row>
    </el-row>
    <!-- 新建工作表单 -->
    <div v-if="createShow">
      <el-row :gutter="20" class="colmn">
        <!-- 选择类型 -->
        <el-col :span="3" class="leftside" v-if="show === 1 || show === 2">
          <el-menu class="el-menu-vertical-demo">
            <el-menu-item index="12" style="font-size:18px;font-weight:800">控件列表</el-menu-item>
            <el-menu-item index="1" @click="addDemo('input')">
              <i class="icofont-underline"></i>
              <span slot="title">单行文本</span>
            </el-menu-item>
            <el-menu-item index="2" @click="addDemo('textarea')">
              <i class="icofont-small-cap"></i>
              <span slot="title">多行文本</span>
            </el-menu-item>
            <el-menu-item index="3" @click="addDemo('inputNumber')">
              <i class="icofont-numbered"></i>
              <span slot="title">数字</span>
            </el-menu-item>
            <el-menu-item index="4" @click="addDemo('radio')">
              <i class="icofont-check-alt"></i>
              <span slot="title">单选框</span>
            </el-menu-item>
            <el-menu-item index="5" @click="addDemo('checkbox')">
              <i class="icofont-checked"></i>
              <span slot="title">多选框</span>
            </el-menu-item>
            <el-menu-item index="6" @click="addDemo('select')">
              <i class="icofont-thin-down"></i>
              <span slot="title">下拉框</span>
            </el-menu-item>
            <el-menu-item index="8" @click="addDemo('multipleSelect')">
              <i class="icofont-stylish-down"></i>
              <span slot="title">多级下拉框</span>
            </el-menu-item>
            <el-menu-item index="7" @click="addDemo('datetime')">
              <i class="icofont-ui-timer"></i>
              <span slot="title">日期+时间</span>
            </el-menu-item>
            <el-menu-item index="9" @click="addDemo('date')">
              <i class="icofont-table"></i>
              <span slot="title">日期</span>
            </el-menu-item>
            <el-menu-item index="10" @click="addDemo('time')">
              <i class="icofont-wall-clock"></i>
              <span slot="title">时间</span>
            </el-menu-item>
            <el-menu-item index="11" @click="addDemo('span')">
              <i class="icofont-code"></i>
              <span slot="title">span</span>
            </el-menu-item>
            <el-menu-item index="12" @click="addDemo('address')">
              <i class="icofont-address-book"></i>
              <span slot="title">地址</span>
            </el-menu-item>
          </el-menu>
        </el-col>
        <!-- 模板 -->
        <el-col :span="13" style="background-color: #fff;">
          <div class="template">
            <div style="font-size:18px;font-weight:800">工单模板</div>
            <div
              class="title"
              @click="changeTitle"
              style="text-align:center"
            >{{ workFormTable.name }}</div>
            <div
              class="selectShow"
              v-for="(item, index) in workFormTable.workformPropertyCreateInfos"
              :key="index"
              v-dragging="{
                item: item,
                list: workFormTable.workformPropertyCreateInfos,
                group: 'item'
              }"
              @click="changeItem(item, index)"
            >
              <div class="demo">
                <div class="name">{{ item.name }}</div>
                <div class="name">
                  <p class="white-space:normal;width:100%;">{{ item.val }}</p>
                </div>
                <div v-if="item.dataType === 'input'">
                  <el-input
                    type="text"
                    size="small"
                    :disabled="show===3?false:true"
                    style="inputWidth"
                    :placeholder="item.placeholder"
                    v-model="item.defaultValue"
                    :maxlength="item.maxValue"
                    :minlength="item.minValue"
                  ></el-input>
                </div>
                <div v-if="item.dataType === 'textarea'">
                  <el-input
                    size="small"
                    type="textarea"
                    :rows="1"
                    :disabled="show===3?false:true"
                    style="inputWidth"
                    :placeholder="item.placeholder"
                    v-model="item.defaultValue"
                    :maxlength="item.maxValue"
                    :minlength="item.minValue"
                  ></el-input>
                </div>
                <div v-if="item.dataType === 'inputNumber'">
                  <el-input
                    size="small"
                    type="number"
                    :disabled="show===3?false:true"
                    :placeholder="item.placeholder"
                    v-model="item.defaultValue"
                    :maxlength="item.maxValue"
                    :minlength="item.minValue"
                  ></el-input>
                </div>
                <div v-if="item.dataType === 'radio'">
                  <el-radio-group v-model="item.defaultValue">
                    <el-radio
                      :label="item1.value"
                      :disabled="show===3?false:true"
                      v-for="(item1,index1) in item.dataValues"
                      :key="index1"
                    ></el-radio>
                  </el-radio-group>
                </div>
                <div v-if="item.dataType === 'checkbox'">
                  <el-checkbox-group v-model="item.defaultValue">
                    <el-checkbox
                      v-for="(item2,index2) in item.dataValues"
                      :key="index2"
                      :label="item2.value"
                      :disabled="show===3?false:true"
                    ></el-checkbox>
                  </el-checkbox-group>
                </div>
                <div v-if="item.dataType === 'select'|| item.dataType === 'multipleSelect'">
                  <el-select
                    :placeholder="item.placeholder"
                    v-model="item.defaultValue"
                    :disabled="show===3?false:true"
                    :multiple="item.dataType==='multipleSelect'?true:false"
                  >
                    <el-option v-for="i in item.dataValues" :key="i.value" :value="i.value"></el-option>
                  </el-select>
                </div>
                <div
                  v-if="item.dataType === 'datetime'||item.dataType === 'date'||item.dataType === 'time'"
                >
                  <el-date-picker
                    :type="item.dataType"
                    :placeholder="item.placeholder"
                    :disabled="show===3?false:true"
                    v-model="item.defaultValue"
                  ></el-date-picker>
                </div>
                <div v-if="item.dataType==='span'">
                  <quill-editor
                    :disabled="show===3?false:true"
                    v-model="item.defaultValue"
                    :options="editorOption"
                    :placeholder="item.placeholder"
                    :maxlength="item.maxValue"
                    :minlength="item.minValue"
                  ></quill-editor>
                </div>
                <div v-if="item.dataType === 'address'">
                  <div style="display:flex;justify-content: space-between;">
                    <el-select
                      v-model="item.defaultValue.province"
                      placeholder="请选择"
                      :disabled="show===3?false:true"
                    >
                      <el-option
                        v-for="item in province"
                        :key="item.id"
                        :label="item.regionName"
                        :value="item.regionCode"
                      ></el-option>
                    </el-select>
                    <el-select
                      v-model="item.defaultValue.city"
                      placeholder="请选择"
                      :disabled="show===3?false:true"
                    >
                      <el-option
                        v-for="item in city"
                        :key="item.id"
                        :label="item.regionName"
                        :value="item.regionCode"
                      ></el-option>
                    </el-select>
                    <el-select
                      v-model="item.defaultValue.area"
                      placeholder="请选择"
                      :disabled="show===3?false:true"
                    >
                      <el-option
                        v-for="item in area"
                        :key="item.id"
                        :label="item.regionName"
                        :value="item.regionCode"
                      ></el-option>
                    </el-select>
                  </div>
                  <el-input
                    type="textarea"
                    rows="2"
                    :placeholder="item.placeholder"
                    v-model="item.defaultValue.detail"
                    :disabled="show===3?false:true"
                  ></el-input>
                </div>
              </div>
              <div class="tools">
                <i class="el-icon-plus" @click="addDemo(item.dataType)"></i>
                <i class="el-icon-delete" @click="removeDemo(item, index)" title="删除"></i>
                <i class="el-icon-rank" title="可拖拽"></i>
              </div>
            </div>
            <div style="display: flex;justify-content: center;">
              <el-button size="small" type="primary" @click="modifyWorkForm" v-if="show === 2">确认</el-button>
              <el-button size="small" type="primary" @click="submitUpload" v-if="show === 1">提交</el-button>
              <el-button
                size="small"
                type="primary"
                plain
                @click="
                  initWorkFormTable;
                  createShow = false;
                  tableShow = true;
                  show = 0;
                "
              >取消</el-button>
            </div>
          </div>
        </el-col>
        <!-- 设值 -->
        <el-col :span="7" class="setting" v-if="show === 1 || show === 2" :rules="rules">
          <div style="font-size:18px;font-weight:800">字段属性</div>
          <div v-show="table">
            <div>
              <div>
                <span class="star">工单名称:</span>
              </div>
              <el-input type="textarea" :rows="1" v-model="workFormTable.name"></el-input>
            </div>
            <div>
              <div>
                <span>工单有效性:</span>
              </div>
              <el-radio-group v-model="workFormTable.enabled">
                <el-radio :label="1">有效</el-radio>
                <el-radio :label="0">无效</el-radio>
              </el-radio-group>
            </div>
            <div>
              <div>
                <span>工单备注:</span>
              </div>
              <el-input type="textarea" :rows="1" v-model="workFormTable.remark"></el-input>
            </div>
          </div>
          <div
            v-for="(item, index) in workFormTable.workformPropertyCreateInfos"
            :key="index"
            v-show="text&&typeShow[index]"
            class="singchange"
          >
            <!-- 模板详情 -->
            <div>
              <!-- 字段名称 -->
              <div>
                <div>
                  <span class="star">字段名称:</span>
                </div>
                <el-input type="text" :rows="1" v-model="item.name"></el-input>
              </div>
              <!-- 字段描述 -->
              <div>
                <div>
                  <span class="star">字段描述:</span>
                </div>
                <el-input type="textarea" :rows="2" v-model="item.val"></el-input>
              </div>
              <!-- 特殊类型 radio/checkbox/select/multipleSelect/address-->
              <div
                v-if="item.dataType==='radio'||item.dataType==='checkbox'||item.dataType==='select'||item.dataType==='multipleSelect'"
              >
                <div>
                  <div>
                    <span>选择项</span>
                  </div>
                  <div>
                    <div v-for="(item5,index5) in item.dataValues" :key="index5" class="addDemo">
                      <div>
                        <el-input v-model="item5.value" size="small" type="text"></el-input>
                      </div>
                      <div class="addDemoTools">
                        <div class="tool">
                          <i
                            class="el-icon-plus"
                            style="cursor:pointer;color:#54B8FF;font-size:12px;"
                            @click="addRadio(item.dataValues)"
                            title="新建选项"
                          ></i>
                          <div v-if="item.dataValues.length > 1">
                            <el-button
                              icon="el-icon-arrow-up"
                              type="text"
                              size="mini"
                              title="上移"
                              @click="upOption(item.dataValues, index5, item.dataValues.length)"
                            ></el-button>
                            <el-button
                              icon="el-icon-arrow-down"
                              type="text"
                              size="mini"
                              title="下移"
                              @click="
                          downOption(item.dataValues, index5, item.dataValues.length)
                        "
                            ></el-button>
                            <el-button
                              icon="el-icon-delete"
                              type="text"
                              size="mini"
                              title="删除"
                              @click="removeRadio(item.dataValues, index5)"
                            ></el-button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 默认值 -->
              <div>
                <div>
                  <span>默认值:</span>
                </div>
                <div v-if="item.dataType==='textarea'">
                  <el-input type="textarea" rows="2" v-model="item.defaultValue"></el-input>
                </div>
                <div v-else-if="item.dataType==='inputNumber'">
                  <el-input type="number" v-model="item.defaultValue"></el-input>
                </div>
                <div v-else-if="item.dataType==='checkbox'||item.dataType==='multipleSelect'">
                  <div class="addDemo" v-for="(item9,index9) in item.defaultValue" :key="index9">
                    <el-input type="text" v-model="item9.value"></el-input>
                    <div class="addDemoTools">
                      <div class="tool">
                        <i
                          class="el-icon-plus"
                          style="cursor:pointer;color:#54B8FF;font-size:12px;"
                          @click="addRadio(item.defaultValue)"
                          title="新建选项"
                        ></i>
                        <div v-if="item.defaultValue.length > 1">
                          <el-button
                            icon="el-icon-arrow-up"
                            type="text"
                            size="mini"
                            title="上移"
                            @click="upOption(item.defaultValue, index9, item.defaultValue.length)"
                          ></el-button>
                          <el-button
                            icon="el-icon-arrow-down"
                            type="text"
                            size="mini"
                            title="下移"
                            @click="
                          downOption(item.defaultValue, index9, item.defaultValue.length)
                        "
                          ></el-button>
                          <el-button
                            icon="el-icon-delete"
                            type="text"
                            size="mini"
                            title="删除"
                            @click="removeRadio(item.defaultValue, index9)"
                          ></el-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else-if="item.dataType==='span'">
                  <quill-editor
                    v-model="item.defaultValue"
                    :options="editorOption"
                    :placeholder="item.placeholder"
                    style="white-space:pre"
                  ></quill-editor>
                </div>
                <div v-else-if="item.dataType==='address'">
                  <div style="display:flex;justify-content: space-between;flex-wrap:wrap;">
                    <el-select
                      v-model="item.defaultValue.province"
                      placeholder="请选择"
                      style="width:100%;"
                      @change="getLower1(item)"
                    >
                      <el-option
                        v-for="item in province"
                        :key="item.id"
                        :label="item.regionName"
                        :value="item.regionCode"
                      ></el-option>
                    </el-select>
                    <el-select
                      v-model="item.defaultValue.city"
                      placeholder="请选择"
                      style="width:100%;"
                      @change="getLower2(item)"
                    >
                      <el-option
                        v-for="item in city"
                        :key="item.id"
                        :label="item.regionName"
                        :value="item.regionCode"
                      ></el-option>
                    </el-select>
                    <el-select
                      v-model="item.defaultValue.area"
                      placeholder="请选择"
                      style="width:100%;"
                    >
                      <el-option
                        v-for="item in area"
                        :key="item.id"
                        :label="item.regionName"
                        :value="item.regionCode"
                      ></el-option>
                    </el-select>
                  </div>
                  <el-input type="textarea" rows="2" v-model="item.defaultValue.detail"></el-input>
                </div>
                <el-input v-else type="text" v-model="item.defaultValue"></el-input>
              </div>
              <!-- 默认值类型 -->
              <div>
                <div>
                  <span class="star">默认值类型:</span>
                </div>
                <el-input type="number" v-model="item.defaultValueType"></el-input>
              </div>
              <!-- 默认占位符 -->
              <div>
                <div>
                  <span>默认占位符:</span>
                </div>
                <el-input type="text" v-model="item.placeholder"></el-input>
              </div>
              <!-- 范围 -->
              <div>
                <div>
                  <span>范围:</span>
                </div>
                <el-input type="number" v-model="item.minValue" placeholder="最小长度"></el-input>
                <el-input type="number" v-model="item.maxValue" placeholder="最大长度"></el-input>
              </div>
              <!-- 填写方式 -->
              <div>
                <div>
                  <span>填写方式:</span>
                </div>
                <el-radio-group v-model="item.propertyUsage">
                  <el-radio :label="0">新增填写</el-radio>
                  <el-radio :label="1">审核填写</el-radio>
                </el-radio-group>
              </div>
              <!-- 设置可读可写 -->
              <div>
                <div>
                  <span>设置:</span>
                </div>
                <el-checkbox-group v-model="item.checklist" @change="changeChecklist(item)">
                  <el-checkbox label="1">可读</el-checkbox>
                  <el-checkbox label="2">可写</el-checkbox>
                </el-checkbox-group>
              </div>
              <!-- 是否必填 -->
              <div>
                <div>
                  <span>是否必填：</span>
                </div>
                <el-checkbox v-model="item.isRequired" true-label="1" false-label="0">必填</el-checkbox>
              </div>
              <!-- 校验规则 -->
              <div>
                <div>
                  <span>校验规则:</span>
                </div>
                <el-input type="text" v-model="item.regex"></el-input>
              </div>
              <!-- 规则提醒 -->
              <div>
                <div>
                  <span>规则提醒:</span>
                </div>
                <el-input type="text" v-model="item.regMsg"></el-input>
              </div>
              <!-- 属性值排序 -->
              <div>
                <div>
                  <span>属性值排序:</span>
                </div>
                <el-input type="number" v-model="item.propertySort"></el-input>
              </div>
              <!-- 备注 -->
              <div>
                <div>
                  <span>备注:</span>
                </div>
                <el-input type="text" v-model="item.remark"></el-input>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 单个删除dialog -->
    <el-dialog width="30%" title="操作提示" :visible.sync="singledelVisible" append-to-body>
      <span style="font-size:20px;">确定删除此工作表单？</span>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button
          type="primary"
          @click="
            singledelVisible = false;
            deleteWorkForm(workFormId);
          "
        >确定</el-button>
        <el-button
          type="primary"
          plain
          @click="
            singledelVisible = false;
          "
        >取消</el-button>
      </div>
    </el-dialog>
    <!-- 批量删除 -->
    <el-dialog width="30%" title="操作提示" :visible.sync="mutipledelVisible" append-to-body>
      <span style="font-size:20px;">确定删除此选中工作的表单？</span>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button
          type="primary"
          @click="
            mutipledelVisible = false;
            mutipleDelete(deleteIds);
          "
        >确定</el-button>
        <el-button
          type="primary"
          plain
          @click="
            mutipledelVisible = false;
          "
        >取消</el-button>
      </div>
    </el-dialog>
    <!-- 校验提醒 -->
    <el-dialog title="提示" :visible.sync="checkDialogVisible" width="30%">
      <span>请输入0或者1</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="checkDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="checkDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getWorkForm,
  deleteWorkForm,
  createWorkForm,
  queryWorkForm,
  updateWorkForm,
  getAddress,
  getLowerAddress,
  mutipledeleteWorkForm
} from "@/api/work_form_manage";
import { formatDateTime, swapArray } from "@/utils/tools";

export default {
  name: "work_form_manage",
  data() {
    return {
      formContainerOpen: "1",
      // 工作表单列表
      workFormData: [],
      workFormId: [],
      createShow: false,
      singledelVisible: false,
      mutipledelVisible: false,
      deleteIds: [],
      tableShow: true,
      table: true, //标题显示
      text: false, //单题属性显示
      show: 0, //1新建，2修改，3查看
      // 单个展示
      typeShow: [],
      checkDialogVisible: false,
      // 新建工作表单
      workFormTable: {
        creatorId: localStorage.getItem("agentId"),
        creatorName: localStorage.getItem("userName"),
        name: "工单名称",
        enabled: 1,
        remark: "",
        workformPropertyCreateInfos: []
      },
      rules: {
        name: [{ required: true, message: "请输入工单名称", trigger: "blur" }]
      },

      // 修改工作表单
      modifyWorkFormTable: {
        id: "",
        modifierId: localStorage.getItem("agentId"),
        modifierName: localStorage.getItem("userName"),
        workformPropertyUpdateInfos: []
      },
      editorOption: {
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike", "image"], // 加粗bold 斜体italic 下划线underline 删除线strike
            ["blockquote", "code-block"], // 引用blockquote 代码块code-block
            [
              { direction: "rtl" },
              { script: "sub" },
              { script: "super" },
              { list: "ordered" },
              { list: "bullet" }
            ],
            [{ size: ["small", false, "large", "huge"] }],
            [{ color: [] }, { background: [] }, { font: [] }, { align: [] }]
          ]
        },
        placeholder: "这里可以显示HTML内容"
      },
      // 分页数据
      pageShow: false,
      pageInfo: {},
      reqPag: {},
      arr: [],

      // 省市区三级联动
      province: [],
      city: [],
      area: [
        {
          id: 0,
          regionCode: "",
          regionLevel: 1,
          regionName: "",
          regionParentId: ""
        }
      ]
    };
  },
  mounted() {
    this.getWorkFormList();
    this.$dragging.$on("dragged", ({ value }) => {});
    this.getAddress();
  },
  methods: {
    // 获取一级地址
    getAddress() {
      getAddress(1).then(res => {
        if (res.data.code === 0) {
          this.province = res.data.data;
        }
      });
    },
    // 获取二级级地址
    getLower1(item) {
      this.city = [];
      this.area = [];
      item.defaultValue.city = "";
      item.defaultValue.area = "";
      getLowerAddress(item.defaultValue.province).then(res => {
        if (res.data.code === 0) {
          this.city = res.data.data;
        }
      });
    },
    // 获取三级地址
    getLower2(item) {
      this.area = [];
      item.defaultValue.area = "";
      getLowerAddress(item.defaultValue.city).then(res => {
        if (res.data.code === 0) {
          this.area = res.data.data;
        }
      });
    },
    changeArea(item) {
      console.log(item);
    },
    // 获取列表数据
    getWorkFormList(reqPag) {
      getWorkForm(reqPag)
        .then(res => {
          if (res.data.code === 0) {
            this.workFormData = res.data.data;
            if (res.data.pageInfo) {
              this.pageInfo = res.data.pageInfo;
              this.pageShow = true;
            } else {
              this.pageShow = false;
            }
          } else {
            this.$message.error(res.data.message);
            this.workFormData = res.data.data;
            this.pageShow = false;
          }
        })
        .catch(error => {
          throw error;
        });
    },
    // 新建初始化
    createWorkFrom() {
      this.tableShow = false;
      this.createShow = true;
      this.show = 1;
      this.workFormTable = {
        creatorId: localStorage.getItem("agentId"),
        creatorName: localStorage.getItem("userName"),
        name: "工单名称",
        enabled: 1,
        remark: "",
        workformPropertyCreateInfos: []
      };
    },
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
    addDemo(item) {
      this.initFrom(item);
    },
    // 删除题目类型
    removeDemo(item, index) {
      this.workFormTable.workformPropertyCreateInfos.splice(index, 1);
    },
    // 设置可读可写

    changeChecklist(item) {
      this.workFormTable.workformPropertyCreateInfos.forEach(a => {
        a.checklist = item.checklist;
      });
    },
    // 标题属性切换
    changeTitle() {
      this.table = true;
      this.text = false;
    },
    // 点击类型初始化题型
    initFrom(obj) {
      if (obj === "input") {
        this.workFormTable.workformPropertyCreateInfos.push({
          dataType: "input",
          dataValues: "",
          defaultValue: "",
          defaultValueType: "0",
          formatValue: "",
          isRequired: 0,
          isSmsColumn: 0,
          maxValue: "",
          minValue: "",
          name: "单行文本",
          placeholder: "",
          regex: "",
          remark: "",
          rw: 3,
          val: "",
          styleValue: "",
          propertyUsage: 0,
          checklist: ["1", "2"],
          propertySort: 0,
          regMsg: ""
        });
      } else if (obj === "textarea") {
        this.workFormTable.workformPropertyCreateInfos.push({
          dataType: "textarea",
          dataValues: "",
          defaultValue: "",
          defaultValueType: "0",
          formatValue: "",
          isRequired: 0,
          isSmsColumn: 0,
          maxValue: "",
          minValue: "",
          name: "多行文本",
          placeholder: "",
          regex: "",
          remark: "",
          rw: 3,
          val: "",
          styleValue: "",
          propertyUsage: 0,
          checklist: ["1", "2"],
          propertySort: 0,
          regMsg: ""
        });
      } else if (obj === "inputNumber") {
        this.workFormTable.workformPropertyCreateInfos.push({
          dataType: "inputNumber",
          dataValues: "",
          defaultValue: "",
          defaultValueType: "0",
          formatValue: "",
          isRequired: 0,
          isSmsColumn: 0,
          maxValue: "",
          minValue: "",
          name: "数字",
          placeholder: "",
          regex: "",
          remark: "",
          rw: 3,
          val: "",
          styleValue: "",
          propertyUsage: 0,
          checklist: ["1", "2"],
          propertySort: 0,
          regMsg: ""
        });
      } else if (obj === "radio") {
        this.workFormTable.workformPropertyCreateInfos.push({
          dataType: "radio",
          dataValues: [
            { value: "选项1" },
            { value: "选项2" },
            { value: "选项3" }
          ],
          defaultValue: "",
          defaultValueType: "0",
          formatValue: "",
          isRequired: 0,
          isSmsColumn: 0,
          maxValue: "",
          minValue: "",
          name: "单选框",
          placeholder: "",
          regex: "",
          remark: "",
          rw: 3,
          val: "",
          styleValue: "",
          propertyUsage: 0,
          checklist: ["1", "2"],
          propertySort: 0,
          regMsg: ""
        });
      } else if (obj === "checkbox") {
        this.workFormTable.workformPropertyCreateInfos.push({
          dataType: "checkbox",
          dataValues: [
            { value: "选项1" },
            { value: "选项2" },
            { value: "选项3" }
          ],
          defaultValue: [{ value: "选项1" }],
          defaultValueType: "0",
          formatValue: "",
          isRequired: 0,
          isSmsColumn: 0,
          maxValue: "",
          minValue: "",
          name: "多选框",
          placeholder: "",
          regex: "",
          remark: "",
          rw: 3,
          val: "",
          styleValue: "",
          propertyUsage: 0,
          checklist: ["1", "2"],
          propertySort: 0,
          regMsg: ""
        });
      } else if (obj === "select") {
        this.workFormTable.workformPropertyCreateInfos.push({
          dataType: "select",
          dataValues: [
            { value: "选项1" },
            { value: "选项2" },
            { value: "选项3" }
          ],
          defaultValue: "",
          defaultValueType: "0",
          formatValue: "",
          isRequired: 0,
          isSmsColumn: 0,
          maxValue: "",
          minValue: "",
          name: "下拉框",
          placeholder: "",
          regex: "",
          remark: "",
          rw: 3,
          val: "",
          styleValue: "",
          propertyUsage: 0,
          checklist: ["1", "2"],
          propertySort: 0,
          regMsg: ""
        });
      } else if (obj === "datetime") {
        this.workFormTable.workformPropertyCreateInfos.push({
          dataType: "datetime",
          dataValues: "",
          defaultValue: "",
          defaultValueType: "0",
          formatValue: "",
          isRequired: 0,
          isSmsColumn: 0,
          maxValue: "",
          minValue: "",
          name: "日期+时间",
          placeholder: "",
          regex: "",
          remark: "",
          rw: 3,
          val: "",
          styleValue: "",
          propertyUsage: 0,
          checklist: ["1", "2"],
          propertySort: 0,
          regMsg: ""
        });
      } else if (obj === "multipleSelect") {
        this.workFormTable.workformPropertyCreateInfos.push({
          dataType: "multipleSelect",
          dataValues: [
            { value: "选项1" },
            { value: "选项2" },
            { value: "选项3" }
          ],
          defaultValue: [{ value: "选项1" }],
          defaultValueType: "0",
          formatValue: "",
          isRequired: 0,
          isSmsColumn: 0,
          maxValue: "",
          minValue: "",
          name: "多选下拉框",
          placeholder: "",
          regex: "",
          remark: "",
          rw: 3,
          val: "",
          styleValue: "",
          propertyUsage: 0,
          checklist: ["1", "2"],
          propertySort: 0,
          regMsg: ""
        });
      } else if (obj === "date") {
        this.workFormTable.workformPropertyCreateInfos.push({
          dataType: "date",
          dataValues: "",
          defaultValue: "",
          defaultValueType: "0",
          formatValue: "",
          isRequired: 0,
          isSmsColumn: 0,
          maxValue: "",
          minValue: "",
          name: "日期",
          placeholder: "",
          regex: "",
          remark: "",
          rw: 3,
          val: "",
          styleValue: "",
          propertyUsage: 0,
          checklist: ["1", "2"],
          propertySort: 0,
          regMsg: ""
        });
      } else if (obj === "time") {
        this.workFormTable.workformPropertyCreateInfos.push({
          dataType: "time",
          dataValues: "",
          defaultValue: "",
          defaultValueType: "0",
          formatValue: "",
          isRequired: 0,
          isSmsColumn: 0,
          maxValue: "",
          minValue: "",
          name: "时间",
          placeholder: "",
          regex: "",
          remark: "",
          rw: 3,
          val: "",
          styleValue: "",
          propertyUsage: 0,
          checklist: ["1", "2"],
          propertySort: 0,
          regMsg: ""
        });
      } else if (obj === "span") {
        this.workFormTable.workformPropertyCreateInfos.push({
          dataType: "span",
          dataValues: "",
          defaultValue: "",
          defaultValueType: "0",
          formatValue: "",
          isRequired: 0,
          isSmsColumn: 0,
          maxValue: "",
          minValue: "",
          name: "描述文字",
          placeholder: "",
          regex: "",
          remark: "",
          rw: 3,
          val: "",
          styleValue: "",
          propertyUsage: 0,
          checklist: ["1", "2"],
          propertySort: 0,
          regMsg: ""
        });
      } else if (obj === "address") {
        this.workFormTable.workformPropertyCreateInfos.push({
          dataType: "address",
          dataValues: "",
          defaultValue: {},
          defaultValueType: "0",
          formatValue: "",
          isRequired: 0,
          isSmsColumn: 0,
          maxValue: "",
          minValue: "",
          name: "地址",
          placeholder: "",
          regex: "",
          remark: "",
          rw: 3,
          val: "",
          styleValue: "",
          propertyUsage: 0,
          checklist: ["1", "2"],
          propertySort: 0,
          regMsg: ""
        });
      }
    },
    // 检验默认数据类型规定0：string，1：object
    checkData(item) {
      console.log(item);
      // if (item !== 0 || item !== 1) {
      //   this.checkDialogVisible = true;
      // } else {
      //   console.log("yes");
      //   item = item;
      // }
    },
    // 点击题项初始化数据
    changeItem(item, index) {
      this.table = false;
      this.text = false;
      this.typeShow.length = this.workFormTable.workformPropertyCreateInfos.length;
      for (
        let i = 0;
        i < this.workFormTable.workformPropertyCreateInfos.length;
        i++
      ) {
        this.typeShow[i] = false;
      }
      this.typeShow[index] = true;
      this.text = this.typeShow[index];
    },
    // 批量删除状态切换
    handleSelectionChange(val) {
      this.deleteIds.length = 0;
      for (var i = 0; i < val.length; i++) {
        this.deleteIds.push(val[i].id);
      }
    },
    // 批量删除
    mutipleDelete(ids) {
      if (ids.length !== 0) {
        mutipledeleteWorkForm(ids).then(res => {
          if (res.data.code === 0) {
            this.$message.success(res.data.message);
            this.getWorkFormList();
          } else {
            this.$message.error(res.data.message);
          }
        });
      } else {
        this.$message.error("请选择要删除的工单");
      }
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
    // 初始化表单属性
    initWorkFormTable() {
      this.workFormTable = {
        creatorId: localStorage.getItem("agentId"),
        creatorName: localStorage.getItem("userName"),
        name: "工单名称",
        enabled: 1,
        remark: "",
        workformPropertyCreateInfos: []
      };
    },
    // 新建选项
    addRadio(options) {
      options.push({
        value: ""
      });
    },
    // 新建修改成功
    success() {
      this.tableShow = true;
      this.createShow = false;
      this.getWorkFormList();
    },
    // dateValues转成对象字符串
    arrToString(arr) {
      const array = arr;
      const target = {};
      array.forEach(a => {
        const source = JSON.parse(`{"${a.value}":"${a.value}"}`);
        Object.assign(target, source);
      });
      return JSON.stringify(target);
    },
    // 字符串对象转数组
    stringToArr(str) {
      let obj = JSON.parse(str);
      let arr = [];
      for (let key in obj) {
        arr.push({ value: key });
      }
      return arr;
    },
    // 新建
    submitUpload() {
      if (this.workFormTable.name === "") {
        this.$message.error("请输入工单名称");
        return;
      }
      if (this.workFormTable.workformPropertyCreateInfos.length !== 0) {
        let flag = true;
        if (flag) {
          this.workFormTable.workformPropertyCreateInfos.forEach(item => {
            if (
              item.name !== "" &&
              item.val !== "" &&
              item.defaultValueType !== ""
            ) {
              if (
                item.defaultValueType === "0" ||
                item.defaultValueType === "1"
              ) {
                if (item.checklist) {
                  if (item.checklist.length === 2) {
                    item.rw = 3;
                  } else if (item.checklist.length === 1) {
                    if (item.checklist[0] === "1") {
                      item.rw = 1;
                    } else {
                      item.rw = 2;
                    }
                  }
                } else {
                  item.rw = 0;
                }
                delete item.checklist;
                if (item.dataType === "radio" || item.dataType === "select") {
                  item.dataValues = this.arrToString(item.dataValues);
                }
                if (
                  item.dataType === "multipleSelect" ||
                  item.dataType === "checkbox"
                ) {
                  item.dataValues = this.arrToString(item.dataValues);
                  item.defaultValue = this.arrToString(item.defaultValue);
                }
                if (item.dataType === "address") {
                  item.defaultValue = JSON.stringify(item.defaultValue);
                }
              } else {
                console.log(item.defaultValueType);
                this.$message.error("默认值类型请输入0或1");
                flag = false;
              }
            } else {
              this.$message.error("请完善信息");
              flag = false;
            }
          });
        }
        if (flag) {
          createWorkForm(this.workFormTable).then(res => {
            if (res.data.code === 0) {
              this.$message.success(res.data.message);
              this.success();
            } else {
              this.$message.error(res.data.message);
              this.success();
            }
          });
        }
      } else {
        this.$message.error("请至少选择一种模板题型");
        return;
      }
    },
    // 删除工作表单
    deleteWorkForm(workFormId) {
      console.log(workFormId);
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
          this.$message("删除失败");
        });
    },
    // 修改传值
    showModifyContent(row) {
      row.workformProperties.forEach(item => {
        if (item.rw === 3) {
          item.checklist = ["1", "2"];
        } else if (item.rw === 2) {
          item.checklist = ["2"];
        } else if (item.rw === 1) {
          item.checklist = ["1"];
        } else {
          item.checklist = [];
        }
        item.isRequired = item.isRequired === 1 ? true : false;
        item.defaultValueType = String(item.defaultValueType);
        if (item.dataType === "radio" || item.dataType === "select") {
          item.dataValues = this.stringToArr(item.dataValues);
        }
        if (
          item.dataType === "checkbox" ||
          item.dataType === "multipleSelect"
        ) {
          item.dataValues = this.stringToArr(item.dataValues);
          item.defaultValue = this.stringToArr(item.defaultValue);
        }
        if (item.dataType === "address") {
          item.defaultValue = JSON.parse(item.defaultValue);
          let address = item.defaultValue;
          getLowerAddress(String(address.province)).then(res => {
            if (res.data.code === 0) {
              this.city = res.data.data;
            }
          });
          getLowerAddress(String(address.city)).then(res => {
            if (res.data.code === 0) {
              this.area = res.data.data;
            }
          });
        }
      });
      this.modifyWorkFormTable.id = row.id;
      this.workFormTable.name = row.name;
      this.workFormTable.enabled = row.enabled;
      this.workFormTable.remark = row.remark;
      this.workFormTable.workformPropertyCreateInfos = row.workformProperties;
      this.createShow = true;
      this.tableShow = false;
      this.show = 2;
      this.table = true;
      this.text = false;
    },
    // 修改
    modifyWorkForm(row) {
      if (this.workFormTable.workformPropertyCreateInfos.length !== 0) {
        this.workFormTable.workformPropertyCreateInfos.forEach(item => {
          delete item.checklist;
          item.isRequired = item.isRequired ? 1 : 0;
          if (item.dataType === "radio" || item.dataType === "select") {
            item.dataValues = this.arrToString(item.dataValues);
          }
          if (
            item.dataType === "checkbox" ||
            item.dataType === "multipleSelect"
          ) {
            item.dataValues = this.arrToString(item.dataValues);
            item.defaultValue = this.arrToString(item.defaultValue);
          }
          if (item.dataType === "address") {
            item.defaultValue = JSON.stringify(item.defaultValue);
          }
        });
        this.workFormTable.workformPropertyCreateInfos.forEach(item => {
          if (
            item.name !== "" &&
            item.val !== "" &&
            item.defaultValueType !== ""
          ) {
            console.log(item.defaultValue);
            if (
              item.defaultValueType !== "0" ||
              item.defaultValueType !== "1"
            ) {
              this.$message.error("默认值类型请输入0或1");
              return;
            }
          } else {
            this.$message.error("请完善信息");
            return;
          }
        });
        this.modifyWorkFormTable.name = this.workFormTable.name;
        this.modifyWorkFormTable.enabled = this.workFormTable.enabled;
        this.modifyWorkFormTable.remark = this.workFormTable.remark;
        this.modifyWorkFormTable.workformPropertyUpdateInfos = this.workFormTable.workformPropertyCreateInfos;
        updateWorkForm(this.modifyWorkFormTable).then(res => {
          if (res.data.code === 0) {
            this.$message.success(res.data.message);
            this.success();
          } else {
            this.$message.error(res.data.message);
            this.success();
          }
        });
      } else {
        this.$message.error("请至少选择一种模板题型");
        return;
      }
    },
    // 查看编辑
    edite(row) {
      row.workformProperties.forEach(item => {
        if (item.rw === 3) {
          item.checklist = ["1", "2"];
        } else if (item.rw === 2) {
          item.checklist = ["2"];
        } else if (item.rw === 1) {
          item.checklist = ["1"];
        } else {
          item.checklist = [];
        }
        item.isRequired = item.isRequired === 1 ? true : false;
        item.defaultValueType = String(item.defaultValueType);
        if (item.dataType === "radio" || item.dataType === "select") {
          item.dataValues = this.stringToArr(item.dataValues);
        }
        if (
          item.dataType === "checkbox" ||
          item.dataType === "multipleSelect"
        ) {
          item.dataValues = this.stringToArr(item.dataValues);
          item.defaultValue = this.stringToArr(item.defaultValue);
        }
        if (item.dataType === "address") {
          item.defaultValue = JSON.parse(item.defaultValue);
          let address = item.defaultValue;
          getLowerAddress(String(address.province)).then(res => {
            if (res.data.code === 0) {
              this.city = res.data.data;
            }
          });
          getLowerAddress(String(address.city)).then(res => {
            if (res.data.code === 0) {
              this.area = res.data.data;
            }
          });
        }
      });
      this.workFormTable.name = row.name;
      this.workFormTable.enabled = row.enabled;
      this.workFormTable.remark = row.remark;
      this.workFormTable.workformPropertyCreateInfos = row.workformProperties;
      this.createShow = true;
      this.tableShow = false;
      this.show = 2;
      this.table = true;
      this.text = false;
    },
    // 页面显示条数
    handleSizeChange(val) {
      console.log(val);
      this.reqPag.pageNo = 1;
      this.reqPag.pageSize = val;
      console.log(this.pageInfo);
      this.getWorkFormList(this.reqPag);
    },
    // 分页翻页功能
    handleCurrentChange(val) {
      console.log(val);
      this.reqPag.pageNo = val;
      this.reqPag.pageSize = this.pageInfo.pageSize;
      console.log(this.pageInfo);
      this.getWorkFormList(this.reqPag);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.colmn {
  display: flex;
  justify-content: space-around;
  height: 100%;
}
.table-container {
  .form-container {
    box-shadow: none;
    border: 1px solid #ebeef5;
    border-left: solid 4px #57afff;
  }
}
.leftside {
  min-width: 150px;
  padding-left: 0;
}
.leftside .el-menu-item {
  padding: 0 10px;
  padding-left: 0;
  i {
    font-size: 20px;
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
  margin-top: 10px;
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
  padding: 10px 0;
  height: 600px;
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
      font-size: 16px;
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
  padding-top: 10px;
  background-color: #fff;
  height: 600px;
  margin-left: 15px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 0;
  }
  & > div {
    margin-bottom: 10px;
    span {
      font-size: 12px;
      color: #96999e;
      display: inline-block;
      margin: 15px 0 5px 0;
    }
    p {
      font-size: 14px;
      display: inline-block;
      margin: 15px 0 5px 0;
    }
  }
  .singchange {
    .tool {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .addDemoTools {
      display: none;
    }
    .addDemo:hover {
      .addDemoTools {
        display: block;
      }
    }
  }
}
.el-radio,
.el-radio + .el-radio {
  margin: 0 20px 0 0;
}
.el-checkbox {
  margin-bottom: 10px;
  margin-right: 20px;
}
.el-input {
  margin: 5px 0;
}
.el-menu-item {
  height: 40px;
  line-height: 40px;
}
.el-select {
  margin: 5px 0;
}
.el-checkbox + .el-checkbox {
  margin-left: 0;
}
.star {
  padding-left: 10px;
  display: block;
  position: relative;
  &::before {
    content: "*";
    width: 5px;
    height: 5px;
    color: red;
    position: absolute;
    left: 0;
    top: 0;
    transform: translate(-50%);
  }
}
</style>
