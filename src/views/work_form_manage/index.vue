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
            show = 1;
          "
          >新建</el-button
        >
        <el-button
          type="danger"
          size="small"
          @click="mutipleDelete([workFormData])"
          >批量删除</el-button
        >
        <!-- <el-button type="info" size="small" @click="importVisible=true;importInfo.uploadFileName='';importInfo.batchName='';importInfo.source=''">导入客户</el-button> -->
      </el-row>
      <el-row>
        <el-table
          :data="workFormData"
          highlight-current-row
          @selection-change="handleSelectionChange"
          ref="multipleTable"
        >
          <el-table-column align="center" type="selection" width="55">
          </el-table-column>

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
                @click="showModifyContent(scope.row)"
                type="text"
                size="small"
                >修改</el-button
              >
              <el-button
                @click="
                  delVisible = true;
                  workFormId = [scope.row.id];
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
      <el-row :gutter="20" class="colmn">
        <!-- 选择类型 -->
        <el-col :span="3" class="leftside" v-if="show === 1 || show === 2">
          
          <el-menu class="el-menu-vertical-demo">
            <el-menu-item style="font-size:18px;font-weight:800">控件列表</el-menu-item>
            <el-menu-item index="1" @click="addDemo(1)">
              <i class="icofont-underline"></i>
              <span slot="title">单行文本</span>
            </el-menu-item>
            <el-menu-item index="2" @click="addDemo(2)">
              <i class="icofont-small-cap"></i>
              <span slot="title">多行文本</span>
            </el-menu-item>
            <el-menu-item index="3" @click="addDemo(3)">
              <i class="icofont-numbered"></i>
              <span slot="title">数字</span>
            </el-menu-item>
            <el-menu-item index="4" @click="addDemo(4)">
              <i class="icofont-check-alt"></i>
              <span slot="title">单选框</span>
            </el-menu-item>
            <el-menu-item index="5" @click="addDemo(5)">
              <i class="icofont-checked"></i>
              <span slot="title">多选框</span>
            </el-menu-item>
            <el-menu-item index="6" @click="addDemo(6)">
              <i class="icofont-thin-down"></i>
              <span slot="title">下拉框</span>
            </el-menu-item>
            <el-menu-item index="7" @click="addDemo(7)">
              <i class="icofont-ui-timer"></i>
              <span slot="title">日期+时间</span>
            </el-menu-item>
            <el-menu-item index="8" @click="addDemo(8)">
              <i class="icofont-stylish-down"></i>
              <span slot="title">多级下拉框</span>
            </el-menu-item>
            <el-menu-item index="9" @click="addDemo(9)">
              <i class="icofont-table"></i>
              <span slot="title">日期</span>
            </el-menu-item>
            <el-menu-item index="10" @click="addDemo(10)">
              <i class="icofont-wall-clock"></i>
              <span slot="title">时间</span>
            </el-menu-item>
            <el-menu-item index="11" @click="addDemo(11)">
              <i class="icofont-code"></i>
              <span slot="title">span</span>
            </el-menu-item>
          </el-menu>
        </el-col>
        <!-- 模板 -->
        <el-col :span="11" style="background-color: #fff;">
          <div class="template">
            <div style="font-size:18px;font-weight:800">工单模板</div>
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
                <div class="name">
                  <p class="white-space:normal;width:100%;">{{ item.val }}</p>
                </div>
                <el-input
                  size="small"
                  :disabled="item.rw === 0 ? true : false"
                  style="inputWidth"
                  :placeholder="item.placeholder"
                  v-model="item.dataValues"
                ></el-input>
              </div>
              <div v-if="item.dataType === 'textarea'" class="demo">
                <div class="name">{{ item.name }}</div>
                <div class="name">
                  <p>{{ item.val }}</p>
                </div>
                <el-input
                  size="small"
                  type="textarea"
                  :rows="1"
                  :disabled="item.rw === 0 ? true : false"
                  style="inputWidth"
                  :placeholder="item.placeholder"
                  v-model="item.dataValues"
                ></el-input>
              </div>
              <div v-if="item.dataType === 'inputNumber'" class="demo">
                <div class="name">{{ item.name }}</div>
                <div class="name">
                  <p>{{ item.val }}</p>
                </div>
                <el-input
                  size="small"
                  type="number"
                  :disabled="item.rw === 0 ? true : false"
                  :placeholder="item.placeholder"
                  v-model="item.dataValues"
                ></el-input>
              </div>
              <div v-if="item.dataType === 'radio'" class="demo">
                <div class="name">{{ item.name }}</div>
                <div class="name">
                  <p>{{ item.val }}</p>
                </div>
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
                <div class="name">
                  <p>{{ item.val }}</p>
                </div>
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
                <div class="name">
                  <p>{{ item.val }}</p>
                </div>
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
                <div class="name">
                  <p>{{ item.val }}</p>
                </div>
                <el-date-picker
                  type="datetime"
                  :placeholder="item.placeholder"
                  :disabled="item.rw === 0 ? true : false"
                  v-model="item.dataValues"
                >
                </el-date-picker>
              </div>
              <div v-if="item.dataType === 'multipleSelect'" class="demo">
                <div class="name">{{ item.name }}</div>
                <div class="name">
                  <p>{{ item.val }}</p>
                </div>
                <el-select
                  v-model="item.dataValues"
                  multiple
                  :placeholder="item.placeholder"
                  :disabled="item.rw === 0 ? true : false"
                >
                  <!-- <el-option
                    v-for="item in item.dataValues"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option> -->
                </el-select>
              </div>
              <div v-if="item.dataType === 'date'" class="demo">
                <div class="name">{{ item.name }}</div>
                <div class="name">
                  <p>{{ item.val }}</p>
                </div>
                <el-date-picker
                  v-model="item.dataValues"
                  type="date"
                  :placeholder="item.placeholder"
                  :disabled="item.rw === 0 ? true : false"
                >
                </el-date-picker>
              </div>
              <div v-if="item.dataType === 'time'" class="demo">
                <div class="name">{{ item.name }}</div>
                <div class="name">
                  <p>{{ item.val }}</p>
                </div>
                <el-date-picker
                  v-model="item.dataValues"
                  type="date"
                  :placeholder="item.placeholder"
                  :disabled="item.rw === 0 ? true : false"
                >
                </el-date-picker>
              </div>
              <div v-if="item.dataType === 'span'" class="demo">
                <div class="name">{{ item.name }}</div>
                <div class="name">
                  <p>{{ item.val }}</p>
                </div>
                <quill-editor
                  :disabled="item.rw === 0 ? true : false"
                  v-model="item.dataValues"
                  :options="editorOption"
                  :placeholder="item.placeholder"
                  style="white-space:pre"
                ></quill-editor>
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
              <el-button
                size="small"
                type="primary"
                @click="modifyWorkForm"
                v-if="show === 2"
                >修改</el-button
              >
              <el-button
                size="small"
                type="primary"
                @click="submitUpload"
                v-if="show === 1"
                >提交</el-button
              >
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
                >返回</el-button
              >
            </div>
          </div>
        </el-col>
        <!-- 设值 -->
        <el-col :span="6" class="setting" v-if="show === 1 || show === 2">
          <div style="font-size:18px;font-weight:800">字段属性</div>
          <div v-show="table">
            <div>
              <div><span>工单名称:</span></div>
              <el-input
                type="textarea"
                :rows="1"
                v-model="workFormTable.name"
              ></el-input>
            </div>
            <div>
              <div><span>工单有效性:</span></div>
              <el-radio-group v-model="workFormTable.enabled">
                <el-radio label="1">有效</el-radio><br />
                <el-radio label="0">无效</el-radio>
              </el-radio-group>
            </div>
            <div>
              <div><span>工单备注:</span></div>
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
            <div v-if="item.dataType === 'input' && typeShow[index]">
              <div>
                <div><span>字段名称:</span></div>
                <el-input type="text" :rows="1" v-model="item.name"></el-input>
              </div>
              <div>
                <div><span>字段描述</span></div>
                <el-input
                  type="textarea"
                  :rows="2"
                  v-model="item.val"
                ></el-input>
              </div>
              <div>
                <div><span>默认值</span></div>
                <el-input type="text" v-model="item.dataValues"></el-input>
              </div>

              <div>
                <div><span>默认占位符:</span></div>
                <el-input type="text" v-model="item.placeholder"></el-input>
              </div>

              <div>
                <div><span>设置:</span></div>
                <el-radio-group v-model="item.rw">
                  <el-radio label="0">不可读不可写</el-radio><br />
                  <el-radio label="1">不可读可写</el-radio><br />
                  <el-radio label="2">可读不可写</el-radio><br />
                  <el-radio label="3">可读可写</el-radio>
                </el-radio-group>
              </div>
              <div>
                <div><span>校验规则:</span></div>
                <el-input type="text" v-model="item.regex"></el-input>
              </div>

              <div>
                <div><span>备注:</span></div>
                <el-input type="text" v-model="item.remark"> </el-input>
              </div>
            </div>
            <div v-if="item.dataType === 'textarea' && typeShow[index]">
              <div>
                <div><span>字段名称:</span></div>
                <el-input type="text" :rows="1" v-model="item.name"></el-input>
              </div>
              <div>
                <div><span>字段描述:</span></div>
                <el-input
                  type="textarea"
                  :rows="2"
                  v-model="item.val"
                ></el-input>
              </div>
              <div>
                <div><span>默认值</span></div>
                <el-input type="text" v-model="item.dataValues"></el-input>
              </div>

              <div>
                <div><span>默认占位符:</span></div>
                <el-input type="text" v-model="item.placeholder"></el-input>
              </div>

              <div>
                <div><span>设置:</span></div>
                <el-radio-group v-model="item.rw">
                  <el-radio label="0">不可读不可写</el-radio><br />
                  <el-radio label="1">不可读可写</el-radio><br />
                  <el-radio label="2">可读不可写</el-radio><br />
                  <el-radio label="3">可读可写</el-radio>
                </el-radio-group>
              </div>
              <div>
                <div><span>校验规则:</span></div>
                <el-input type="text" v-model="item.regex"></el-input>
              </div>

              <div>
                <div><span>备注:</span></div>
                <el-input type="text" v-model="item.remark"> </el-input>
              </div>
            </div>
            <div v-if="item.dataType === 'inputNumber' && typeShow[index]">
              <div>
                <div><span>字段名称:</span></div>
                <el-input type="text" :rows="1" v-model="item.name"></el-input>
              </div>
              <div>
                <div><span>字段描述:</span></div>
                <el-input
                  type="textarea"
                  :rows="2"
                  v-model="item.val"
                ></el-input>
              </div>
              <div>
                <div><span>默认值</span></div>
                <el-input type="number" v-model="item.dataValues"></el-input>
              </div>

              <div>
                <div><span>默认占位符:</span></div>
                <el-input type="text" v-model="item.placeholder"></el-input>
              </div>

              <div>
                <div><span>设置:</span></div>
                <el-radio-group v-model="item.rw">
                  <el-radio label="0">不可读不可写</el-radio><br />
                  <el-radio label="1">不可读可写</el-radio><br />
                  <el-radio label="2">可读不可写</el-radio><br />
                  <el-radio label="3">可读可写</el-radio>
                </el-radio-group>
              </div>
              <div>
                <div><span>校验规则:</span></div>
                <el-input type="text" v-model="item.regex"></el-input>
              </div>

              <div>
                <div><span>备注:</span></div>
                <el-input type="text" v-model="item.remark"> </el-input>
              </div>
            </div>
            <div v-if="item.dataType === 'radio' && typeShow[index]">
              <div>
                <div><span>字段名称:</span></div>
                <el-input type="text" :rows="1" v-model="item.name"></el-input>
              </div>
              <div>
                <div><span>字段描述:</span></div>
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
                <div><span>设置:</span></div>
                <el-radio-group v-model="item.rw">
                  <el-radio label="0">不可读不可写</el-radio><br />
                  <el-radio label="1">不可读可写</el-radio><br />
                  <el-radio label="2">可读不可写</el-radio><br />
                  <el-radio label="3">可读可写</el-radio>
                </el-radio-group>
              </div>
              <div>
                <div><span>校验规则:</span></div>
                <el-input type="text" v-model="item.regex"></el-input>
              </div>

              <div>
                <div><span>备注:</span></div>
                <el-input type="text" v-model="item.remark"> </el-input>
              </div>
            </div>
            <div v-if="item.dataType === 'checkbox' && typeShow[index]">
              <div>
                <div><span>字段名称:</span></div>
                <el-input type="text" :rows="1" v-model="item.name"></el-input>
              </div>
              <div>
                <div><span>字段描述:</span></div>
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
                <div><span>设置:</span></div>
                <el-radio-group v-model="item.rw">
                  <el-radio label="0">不可读不可写</el-radio><br />
                  <el-radio label="1">不可读可写</el-radio><br />
                  <el-radio label="2">可读不可写</el-radio><br />
                  <el-radio label="3">可读可写</el-radio>
                </el-radio-group>
              </div>
              <div>
                <div><span>校验规则:</span></div>
                <el-input type="text" v-model="item.regex"></el-input>
              </div>

              <div>
                <div><span>备注:</span></div>
                <el-input type="text" v-model="item.remark"> </el-input>
              </div>
            </div>
            <div v-if="item.dataType === 'select' && typeShow[index]">
              <div>
                <div><span>字段名称:</span></div>
                <el-input type="text" :rows="1" v-model="item.name"></el-input>
              </div>
              <div>
                <div><span>字段描述:</span></div>
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
                <div><span>设置:</span></div>
                <el-radio-group v-model="item.rw">
                  <el-radio label="0">不可读不可写</el-radio><br />
                  <el-radio label="1">不可读可写</el-radio><br />
                  <el-radio label="2">可读不可写</el-radio><br />
                  <el-radio label="3">可读可写</el-radio>
                </el-radio-group>
              </div>
              <div>
                <div><span>校验规则:</span></div>
                <el-input type="text" v-model="item.regex"></el-input>
              </div>

              <div>
                <div><span>备注:</span></div>
                <el-input type="text" v-model="item.remark"> </el-input>
              </div>
            </div>
            <div v-if="item.dataType === 'datetime' && typeShow[index]">
              <div>
                <div><span>字段名称:</span></div>
                <el-input type="text" :rows="1" v-model="item.name"></el-input>
              </div>
              <div>
                <div><span>字段描述:</span></div>
                <el-input
                  type="textarea"
                  :rows="2"
                  v-model="item.val"
                ></el-input>
              </div>
              <div>
                <div><span>默认值</span></div>
                <el-input type="text" v-model="item.dataValues"></el-input>
              </div>

              <div>
                <div><span>默认占位符:</span></div>
                <el-input type="text" v-model="item.placeholder"></el-input>
              </div>

              <div>
                <div><span>设置:</span></div>
                <el-radio-group v-model="item.rw">
                  <el-radio label="0">不可读不可写</el-radio><br />
                  <el-radio label="1">不可读可写</el-radio><br />
                  <el-radio label="2">可读不可写</el-radio><br />
                  <el-radio label="3">可读可写</el-radio>
                </el-radio-group>
              </div>
              <div>
                <div><span>校验规则:</span></div>
                <el-input type="text" v-model="item.regex"></el-input>
              </div>

              <div>
                <div><span>备注:</span></div>
                <el-input type="text" v-model="item.remark"> </el-input>
              </div>
            </div>
            <div v-if="item.dataType === 'multipleSelect' && typeShow[index]">
              <div>
                <div><span>字段名称:</span></div>
                <el-input type="text" :rows="1" v-model="item.name"></el-input>
              </div>
              <div>
                <div><span>字段描述:</span></div>
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
                <div><span>设置:</span></div>
                <el-radio-group v-model="item.rw">
                  <el-radio label="0">不可读不可写</el-radio><br />
                  <el-radio label="1">不可读可写</el-radio><br />
                  <el-radio label="2">可读不可写</el-radio><br />
                  <el-radio label="3">可读可写</el-radio>
                </el-radio-group>
              </div>
              <div>
                <div><span>校验规则:</span></div>
                <el-input type="text" v-model="item.regex"></el-input>
              </div>

              <div>
                <div><span>备注:</span></div>
                <el-input type="text" v-model="item.remark"> </el-input>
              </div>
            </div>
            <div v-if="item.dataType === 'date' && typeShow[index]">
              <div>
                <div><span>字段名称:</span></div>
                <el-input type="text" :rows="1" v-model="item.name"></el-input>
              </div>
              <div>
                <div><span>字段描述:</span></div>
                <el-input
                  type="textarea"
                  :rows="2"
                  v-model="item.val"
                ></el-input>
              </div>
              <div>
                <div><span>默认值</span></div>
                <el-input type="text" v-model="item.dataValues"></el-input>
              </div>

              <div>
                <div><span>默认占位符:</span></div>
                <el-input type="text" v-model="item.placeholder"></el-input>
              </div>

              <div>
                <div><span>设置:</span></div>
                <el-radio-group v-model="item.rw">
                  <el-radio label="0">不可读不可写</el-radio><br />
                  <el-radio label="1">不可读可写</el-radio><br />
                  <el-radio label="2">可读不可写</el-radio><br />
                  <el-radio label="3">可读可写</el-radio>
                </el-radio-group>
              </div>
              <div>
                <div><span>校验规则:</span></div>
                <el-input type="text" v-model="item.regex"></el-input>
              </div>

              <div>
                <div><span>备注:</span></div>
                <el-input type="text" v-model="item.remark"> </el-input>
              </div>
            </div>
            <div v-if="item.dataType === 'time' && typeShow[index]">
              <div>
                <div><span>字段名称:</span></div>
                <el-input type="text" :rows="1" v-model="item.name"></el-input>
              </div>
              <div>
                <div><span>字段描述:</span></div>
                <el-input
                  type="textarea"
                  :rows="2"
                  v-model="item.val"
                ></el-input>
              </div>
              <div>
                <div><span>默认值</span></div>
                <el-input type="text" v-model="item.dataValues"></el-input>
              </div>

              <div>
                <div><span>默认占位符:</span></div>
                <el-input type="text" v-model="item.placeholder"></el-input>
              </div>

              <div>
                <div><span>设置:</span></div>
                <el-radio-group v-model="item.rw">
                  <el-radio label="0">不可读不可写</el-radio><br />
                  <el-radio label="1">不可读可写</el-radio><br />
                  <el-radio label="2">可读不可写</el-radio><br />
                  <el-radio label="3">可读可写</el-radio>
                </el-radio-group>
              </div>
              <div>
                <div><span>校验规则:</span></div>
                <el-input type="text" v-model="item.regex"></el-input>
              </div>

              <div>
                <div><span>备注:</span></div>
                <el-input type="text" v-model="item.remark"> </el-input>
              </div>
            </div>
            <div v-if="item.dataType === 'span' && typeShow[index]">
              <div>
                <div><span>字段名称:</span></div>
                <el-input type="text" :rows="1" v-model="item.name"></el-input>
              </div>
              <div>
                <div><span>字段描述:</span></div>
                <el-input
                  type="textarea"
                  :rows="2"
                  v-model="item.val"
                ></el-input>
              </div>
              <div>
                <div><span>详细内容</span></div>
                <quill-editor
                  :disabled="item.rw === 0 ? true : false"
                  v-model="item.dataValues"
                  :options="editorOption"
                  :placeholder="item.placeholder"
                  style="white-space:pre"
                ></quill-editor>
              </div>
              <div>
                <div><span>默认占位符:</span></div>
                <el-input type="text" v-model="item.placeholder"></el-input>
              </div>

              <div>
                <div><span>设置:</span></div>
                <el-radio-group v-model="item.rw">
                  <el-radio label="0">不可读不可写</el-radio><br />
                  <el-radio label="1">不可读可写</el-radio><br />
                  <el-radio label="2">可读不可写</el-radio><br />
                  <el-radio label="3">可读可写</el-radio>
                </el-radio-group>
              </div>
              <div>
                <div><span>校验规则:</span></div>
                <el-input type="text" v-model="item.regex"></el-input>
              </div>

              <div>
                <div><span>备注:</span></div>
                <el-input type="text" v-model="item.remark"> </el-input>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 删除dialog -->
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
        <el-button
          type="primary"
          plain
          @click="
            delVisible = false;
            workFormId = [];
          "
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
      workFormData: [],
      workFormId: [],
      createShow: false,
      delVisible: false,
      tableShow: true,
      table: true, //标题显示
      text: false, //单题属性显示
      show: 0, //1新建，2修改，3查看
      // 单个展示
      typeShow: [],
      // 工作表单
      workFormTable: {
        creatorId: localStorage.getItem("agentId"),
        creatorName: localStorage.getItem("userName"),
        name: "工单名称",
        enabled: "1",
        remark: "",
        workformProperties: []
      },
      // 修改工作表单
      modifyWorkFormTable: {
        id:'',
        modifierId: localStorage.getItem("agentId"),
        modifierName: localStorage.getItem("userName"),
        name: "工单名称",
        enabled: "1",
        remark: "",
        workformProperties: []
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
      pageInfo: {}
    };
  },
  mounted() {
    this.getWorkFormList();
    this.$dragging.$on("dragged", ({ value }) => {
      // this.workFormTable = value.list;
      console.log(this.workFormTable.workformProperties);
    });
  },
  methods: {
    // 获取列表数据
    getWorkFormList() {
      getWorkForm()
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
            this.$message(res.data.messages);
            this.workFormData = res.data.data;
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
      this.workFormTable.workformProperties.splice(index, 1);
    },

    // 标题属性切换
    changeTitle() {
      this.table = true;
      this.text = false;
    },
    // 点击类型初始化题型
    initFrom(num) {
      console.log(num);
      if (num === 1) {
        console.log(1);
        this.workFormTable.workformProperties.push({
          dataType: "input",
          dataValues: "",
          defaultValue: "",
          formatValue: "",
          isRequired: 0,
          isSmsColumn: 0,
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
        console.log(1111);
      } else if (num === 2) {
        this.workFormTable.workformProperties.push({
          dataType: "textarea",
          dataValues: "",
          defaultValue: "",
          formatValue: "",
          isRequired: 0,
          isSmsColumn: 0,
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
          dataType: "inputNumber",
          dataValues: "",
          defaultValue: "",
          formatValue: "",
          isRequired: 0,
          isSmsColumn: 0,
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
          dataType: "radio",
          dataValues: "",
          defaultValue: "",
          formatValue: "",
          isRequired: 0,
          isSmsColumn: 0,
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
          dataType: "checkbox",
          dataValues: "",
          defaultValue: "",
          formatValue: "",
          isRequired: 0,
          isSmsColumn: 0,
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
          dataType: "select",
          dataValues: "",
          defaultValue: "",
          formatValue: "",
          isRequired: 0,
          isSmsColumn: 0,
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
          dataType: "datetime",
          dataValues: "",
          defaultValue: "",
          formatValue: "",
          isRequired: 0,
          isSmsColumn: 0,
          maxValue: "",
          minValue: "",
          name: "日期+时间",
          placeholder: "",
          regex: "",
          remark: "",
          rw: 0,
          val: "",
          styleValue: ""
        });
      } else if (num === 8) {
        this.workFormTable.workformProperties.push({
          dataType: "multipleSelect",
          dataValues: "",
          defaultValue: "",
          formatValue: "",
          isRequired: 0,
          isSmsColumn: 0,
          maxValue: "",
          minValue: "",
          name: "多选下拉框",
          placeholder: "",
          regex: "",
          remark: "",
          rw: 0,
          val: "",
          styleValue: ""
        });
      } else if (num === 9) {
        this.workFormTable.workformProperties.push({
          dataType: "date",
          dataValues: "",
          defaultValue: "",
          formatValue: "",
          isRequired: 0,
          isSmsColumn: 0,
          maxValue: "",
          minValue: "",
          name: "日期",
          placeholder: "",
          regex: "",
          remark: "",
          rw: 0,
          val: "",
          styleValue: ""
        });
      } else if (num === 10) {
        this.workFormTable.workformProperties.push({
          dataType: "time",
          dataValues: "",
          defaultValue: "",
          formatValue: "",
          isRequired: 0,
          isSmsColumn: 0,
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
      } else if (num === 11) {
        this.workFormTable.workformProperties.push({
          dataType: "span",
          dataValues: "",
          defaultValue: "",
          formatValue: "",
          isRequired: 0,
          isSmsColumn: 0,
          maxValue: "",
          minValue: "",
          name: "描述文字",
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
      console.log(index);
      this.table = false;
      this.text = false;
      this.typeShow.length = this.workFormTable.workformProperties.length;
      for (let i = 0; i < this.workFormTable.workformProperties.length; i++) {
        this.typeShow[i] = false;
      }
      this.typeShow[index] = true;
      this.text = this.typeShow[index];
    },
    // 批量删除状态切换
    handleSelectionChange(val) {
      this.workFormId = val;
      console.log(this.workFormId);
    },
    // 批量删除
    mutipleDelete(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
        this.delVisible = true;
      } else {
        this.$refs.multipleTable.clearSelection();
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
        enabled: "1",
        remark: "",
        workformProperties: []
      };
    },
    // 新建
    submitUpload() {
      if (this.workFormTable.workformProperties.length !== 0) {
        createWorkForm(this.workFormTable).then(res => {
          if (res.data.code === 0) {
            this.$message.success(res.data.message);
            this.tableShow = true;
            this.createShow = false;
            this.getWorkFormList();
            this.workFormTable = {
              creatorId: localStorage.getItem("agentId"),
              creatorName: localStorage.getItem("userName"),
              name: "工单名称",
              enabled: "1",
              remark: "",
              workformProperties: []
            };
          } else {
            this.$message.error(res.data.messages);
          }
        });
      } else {
        this.$message.error("请选择至少一种模板题型");
      }
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
    // 修改传值
    showModifyContent(row) {
      this.modifyWorkFormTable.id = row.id
      this.workFormTable = row
      this.createShow = true;
      this.tableShow = false;
      this.show = 2;
    },
    // 修改
    modifyWorkForm(row) {
      this.modifyWorkFormTable.name = this.workFormTable.name;
      this.modifyWorkFormTable.enabled = this.workFormTable.enabled;
      this.modifyWorkFormTable.remark = this.workFormTable.remark;
      this.modifyWorkFormTable.workformProperties = this.workFormTable.workformProperties;
      if (this.modifyWorkFormTable.workformProperties.length !== 0) {
        createWorkForm(this.modifyWorkFormTable).then(res => {
          if (res.data.code === 0) {
            this.$message.success(res.data.message);
            this.tableShow = true;
            this.createShow = false;
            this.getWorkFormList();
            this.modifyWorkFormTable = {
              modifierId: localStorage.getItem("agentId"),
              modifierName: localStorage.getItem("userName"),
              name: "工单名称",
              enabled: "1",
              remark: "",
              workformProperties: []
            };
          } else {
            this.$message.error(res.data.message);
          }
        });
      } else {
        this.$message.error("请选择至少一种模板题型");
      }
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
.colmn {
  display: flex;
  justify-content: space-between;
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
  margin-top:10px;
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
      font-size: 20px;
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
  overflow: auto;
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
.el-menu-item {
  height: 40px;
  line-height: 40px;
}
</style>
