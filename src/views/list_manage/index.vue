<template>
  <div class="container">
    <el-collapse v-model="formContainerOpen" class="form-container" @change="handleChangeAcitve" style="position:relative">
      <span class="form-more bold" style="line-height: 24px;font-size: 14px;float:right;margin-right:6px;color:#57AFFF;position:absolute;top:11px;right:41px;">收起</span>
      <el-collapse-item title="筛选条件" name="1">
        <el-form :inline="true" size="small" >
          <el-form-item label="名单编号:">
            <el-input v-model="req.listId" placeholder="名单编号（限长20字符）" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="名单名称:">
            <el-input v-model="req.listName" placeholder="名单名称（限长50字符）" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="操作人:">
            <el-input v-model="req.modifierName" placeholder="操作人（限长50字符）" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="操作时间:">
            <el-date-picker
                v-model.trim="timeValue"
                type="datetimerange"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="req2=clone(req);req.pageNo=1;searchNamelist(req)">查询</el-button>
            <el-button size="small" @click="clearForm(req);req2=clone(req);">重置</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <el-row class="table-container">
      <el-row class="margin-bottom-20">
        <div class="font14 bold">名单管理表</div>
      </el-row>
      <el-row class="margin-bottom-20">
        <el-button type="danger" size="small" @click="batchDelVisible=true">批量删除</el-button>
        <el-button type="info" @click="extractVisible=true;getRegion3(0);getAllBatch();" title="名单抽取">名单抽取</el-button>
        <!-- <el-button type="success" size="small" @click="addVisible=true;addNameList.listName='';namelistPageInfo.pageSize=10;searchCustomer.pageSize=10;searchCustomer.pageNo=1;getCustomers(searchCustomer);clearForm(searchCustomer);">新建</el-button> -->
      </el-row>
      <el-row>
        <el-table
          :data="tableData"
          @selection-change="handleSelectionChange">
          <el-table-column
            align="center"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            align="center"
            prop="listId"
            label="名单编号"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.listId }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="listName"
            label="名单名称"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
                  {{ scope.row.listName }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="listnameNumber"
            :show-overflow-tooltip="true"
            label="名单数量">
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
            prop="modifierTime"
            label="操作时间"
            width="155">
          </el-table-column>
          <el-table-column
            align="center"
            label="当前状态"
            width="155">
            <template slot-scope="scope">
              <div :class="scope.row.validityStatus===0?'visible':'invisible'">
                <span>{{scope.row.validityStatus===0?'可见':'可见'}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="100">
          <template slot-scope="scope">
            <el-button @click="editVisible=true;delReq.listId=scope.row.listId;searchByListId(delReq);" type="text" size="small">修改</el-button>
            <el-button @click="delVisible=true;delReq.listId=scope.row.listId" type="text" size="small">删除</el-button>
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
          :page-size='pageInfo.pageSize'
          layout="total, sizes, prev, pager, next, jumper "
          :total='pageInfo.totalCount' style="text-align: right;float:right;">
        </el-pagination>
      </el-row>
    </el-row>
    <el-dialog
      align:left
      width="30%"
      title="修改名单"
      :visible.sync="editVisible"
      append-to-body>
      <el-form label-width="100px" :model="namelistDetail" ref="editNamelist">
        <el-form-item label="名单编号">
          <span>{{namelistDetail.listId}}</span>
        </el-form-item>
        <el-form-item label="名单名称" prop="listName">
          <el-input v-model="namelistDetail.listName" size="small" placeholder="名单名称（限长50字符）" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="当前状态" prop="visible">
          <el-switch
          v-model="namelistDetail.validityStatus"
          active-text="可见"
          inactive-text="不可见"
          :active-value=0
          :inactive-value=1
          active-color="#67C23A"
          ></el-switch>
        </el-form-item>
        <el-form-item label="名单数量" prop="listnameNumber">
          <span>{{namelistDetail.listnameNumber}}</span>
        </el-form-item>
        <el-form-item label="操作人" prop="modifierName">
          <span>{{namelistDetail.modifierName}}</span>
        </el-form-item>
        <el-form-item label="操作时间" prop="modifierTime">
          <span>{{formatDateTime(namelistDetail.modifierTime)}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: right;">
        <el-button size="small" type="primary" @click="editNamelist()">确定</el-button>
        <el-button size="small" @click="searchByListId(delReq);">重置</el-button>
        <el-button size="small" type="primary" plain @click="editVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="30%"
      title="批量删除"
      :visible.sync="batchDelVisible"
      append-to-body>
    <span style="font-size:20px;">确定删除选定内容？</span>
    <div slot="footer" class="dialog-footer" style="text-align: right;">
      <el-button size="small" type="primary" @click="batchDelVisible = false;batchDelNamelist(batchDelReq);">确定</el-button>
      <el-button type="primary" plain size="small" @click="batchDelVisible = false">取消</el-button>
    </div>
    </el-dialog>
    <el-dialog
      width="30%"
      title="删除"
      :visible.sync="delVisible"
      append-to-body>
    <span style="font-size:20px;">确定删除此内容？</span>
    <div slot="footer" class="dialog-footer" style="text-align: right;">
      <el-button size="small" type="primary" @click="delVisible = false;delNamelist(delReq);">确定</el-button>
      <el-button type="primary" plain size="small" @click="delVisible = false">取消</el-button>
    </div>
    </el-dialog>
    <el-dialog
      width="30%"
      title="操作提示"
      :visible.sync="visibleCheck"
      append-to-body>
    <span style="font-size:20px;">即将设置名单为不可见状态，确认？</span>
    <div slot="footer" class="dialog-footer" style="text-align: right;">
      <el-button size="small" type="primary" @click="visibleCheck = false;checkEditNamelist(editReq)">确定</el-button>
      <el-button type="primary" plain size="small" @click="visibleCheck = false;namelistDetail.visible=1">取消</el-button>
    </div>
    </el-dialog>
    <!-- 名单抽取 -->
    <el-dialog
      width="85%"
      title="名单抽取"
      :visible.sync="extractVisible"
      @close="resetScreening"
      append-to-body>
      <el-row class="table-container">
        
        <el-row class="form-container" style="padding: 20px 0 0 20px;">
          <el-row class="screening">
            <el-row class="margin-bottom-20">
              <div class="font14 bold">基本筛选条件</div>
            </el-row>
            <el-form 
              :inline="true" 
              size="small">
              <el-row>
                <el-form-item label="批次名称：">
                  <el-select v-model="searchReq.batchId" style="width:133px;">
                    <el-option value="">请选择</el-option>
                    <el-option
                      v-for="item in allBatch"
                      :key="item.id"
                      :value="item.batchId"
                      :label="item.batchName">
                      </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="性别：">
                  <el-select v-model="searchReq.customerSex" style="width:116px;">
                    <el-option value="">请选择</el-option>
                    <el-option value="0" label="男"></el-option>
                    <el-option value="1" label="女"></el-option>
                  </el-select>
                </el-form-item>
      
                <el-form-item label="客户质量评分：" prop="min" class="min">
                  <el-input style="width:81px;" v-model="searchReq.beginScore" v-on:blur="checkPositiveInteger(searchReq)"></el-input>
                </el-form-item>
                <b style="display:inline-block;font-size:14px;color: #606266;position:relative;top:1px;right:5px;">到</b>
                <el-form-item prop="max" class="max">
                  <el-input style="width:81px;" v-model="searchReq.endScore" v-on:blur="checkPositiveInteger(searchReq)"></el-input>
                </el-form-item>
                <el-row style="display:inline-block;">
                  <el-form-item :inline="true" label="地区：" prop="min" class="min region">
                    <el-col :span="7" :offset="1">
                      <el-select v-model="searchReq.province" placeholder="省" @change="getRegion3(searchReq.province)">
                        <el-option value="">请选择</el-option>
                        <el-option
                          v-for="item in screening.region.province"
                          :key="item.id"
                          :label="item.regionName"
                          :value="item.regionCode">
                        </el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="7" :offset="1">
                      <el-select v-model="searchReq.city" placeholder="市" @change="getRegion3(searchReq.city)">
                        <el-option value="">请选择</el-option>
                        <el-option
                          v-for="item in screening.region.city"
                          :key="item.id"
                          :label="item.regionName"
                          :value="item.regionCode">
                        </el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="7" :offset="1">
                      <el-select v-model="searchReq.district" placeholder="县/区">
                        <el-option value="">请选择</el-option>
                        <el-option
                          v-for="item in screening.region.district"
                          :key="item.regionCode"
                          :label="item.regionName"
                          :value="item.regionCode">
                        </el-option>
                      </el-select>
                    </el-col>
                  </el-form-item>
                </el-row>
                <el-form-item label="操作时间：">
                  <el-date-picker
                      v-model="screeningTimeValue"
                      type="datetimerange"
                      range-separator="-"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间"
                      value-format="yyyy-MM-dd HH:mm:ss">
                  </el-date-picker>
                </el-form-item>
              </el-row>
            </el-form>
          </el-row>
        </el-row>

        <el-collapse v-model="screeningFormOpen" class="screening form-container" @change="handleChangeAcitve2" style="position:relative">
          <el-button type="success" @click="getAllField();" style="position:absolute;top:8px;left:127px;">添加</el-button>
          <span class="form-more2 bold" style="float:right;margin-right:6px;color:#57AFFF;position:absolute;top:11px;right:41px;">更多</span>
          <el-collapse-item class="screening" title="自定义筛选条件" name="1">
            <el-row style="min-height:30px;">
              <el-tag
                style="margin-right:10px;"
                v-for="(item,index) in fieldTags"
                @close="closeTag(index)"
                :disable-transitions="true"
                closable>
                <span v-if="item.value||item.value===0">{{`${item.name}  ${item.condition}  ${item.value}`}}</span>
                <span v-else>{{`${item.name}  ${item.condition}  ${item.valueFrom} ~ ${item.valueTo}`}}</span>
              </el-tag>
            </el-row>
          </el-collapse-item>
        </el-collapse>

        <el-row class="form-container" style="padding: 20px 0 0 20px;" v-if="addScreeningVisible">
          <el-row class="margin-bottom-20">
            <div class="font14 bold">添加/修改筛选条件</div>
          </el-row>
          <el-row>
            <el-form 
              :inline="true" 
              size="small">
              <el-form-item label="字段名：">
                <el-select
                  v-model="customRequirement.propertyCode"
                  @change="changeFieldName"
                  style="width:133px;">
                  <el-option
                    v-for="(item,index) in allFieldName"
                    :key="index"
                    :label="item.propertyName"
                    :value="item.propertyCode">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="条件：">
                <el-select 
                  v-model="customRequirement.range"
                  @change="changeField"
                  style="width:133px;">
                  <el-option
                    v-for="(item,index) in condition"
                    :key="index"
                    :label="item.name"
                    :value="item.value">
                    </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="条件值：" v-if="fieldType=='int'">
                <el-input v-model="customRequirement.value" @blur="checkNumber(customRequirement.value)"></el-input>
              </el-form-item>

              <el-form-item label="条件值：" v-if="fieldType=='string'">
                <el-input v-model="customRequirement.value"></el-input>
              </el-form-item>
              <el-form-item label="条件值：" v-if="fieldType=='dateInterval'">
                <el-date-picker
                  v-model="fieldValues"
                  type="datetimerange"
                  range-separator="-"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="条件值：" v-if="fieldType=='dateTime'">
                <el-date-picker
                  v-model="customRequirement.value"
                  type="datetime"
                  placeholder="选择日期时间"
                  value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
              </el-form-item>
              <el-row style="display:inline-block;" v-if="fieldType=='interval'">
                <el-form-item label="条件值：">
                  <el-input style="width:81px;" v-model="customRequirement.valueFrom" v-on:blur="checkInt(customRequirement)"></el-input>
                </el-form-item>
                <b style="display:inline-block;font-size:14px;color: #606266;position:relative;top:1px;right:5px;">到</b>
                <el-form-item>
                  <el-input style="width:81px;" v-model="customRequirement.valueTo" v-on:blur="checkInt(customRequirement)"></el-input>
                </el-form-item>
              </el-row>
              <el-form-item v-if="fieldType">
                <el-button type="primary" @click="addFieldTag();screeningFormOpen='1'">确定</el-button>
                <el-button type="primary" plain @click="cancelAddFieldTag">取消</el-button>
              </el-form-item>
            </el-form>
          </el-row>
        </el-row>
        <el-row style="text-align:left;">
          <el-button type="primary" @click="getFiltercustomers">查询</el-button>
          <el-button @click="resetScreeningForm()">重置</el-button>
        </el-row>
      </el-row>

      <el-row class="table-container font14" style="font-size:16px;margin-bottom:15px;">
        <span style="padding-left:4px;">
          共筛选出
          <span style="color:#57AFFF;">
            {{totalCount}}
          </span>
          条客户数据
        </span>
      </el-row>

      <el-row class="form-container" style="padding: 20px 0 0 20px;">
        <el-row class="margin-bottom-20">
          <div class="font14 bold">填写基本信息</div>
        </el-row>
        <el-form :inline="true" size="small">
          <el-form-item label="名单名称：">
            <el-input v-model="addListReq.listName" style="width:133px;" placeholder="请输入名单名称"></el-input>
          </el-form-item>
          <el-form-item label="名单状态：">
            <el-switch
              v-model="addListReq.validityStatus"
              active-color="#13ce66"
              inactive-color="#999999"
              active-text="可见"
              inactive-text="不可见"
              active-value="0"
              inactive-value="1">
            </el-switch>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row slot="footer" style="text-align:right;">
        <el-button type="primary" :disabled="totalCount === 0" @click="addGenerate">确定</el-button>
        <el-button type="primary" plain @click="extractVisible=false;">取消</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import {
  queryNamelist,
  addNamelist,
  addNameList,
  queryByListId,
  editNamelist,
  delList,
  batchDelList
} from '@/api/sc_list_generate'

import { queryBatch } from '@/api/batch_management'
import {
  getRegion,
  queryByCustomer,
  getAllBatch,
  getAllField,
  getFiltercustomers,
  addGenerate
} from '@/api/customerManagement'
import { rule } from '@/utils/validate'
import { clone, formatDateTime } from '@/utils/tools'

export default {
  name: 'sc_list_generate',
  data() {
    return {
      timeValue: null,
      // 名单抽取
      extractVisible: false,
      screeningFormOpen: [],
      addScreeningVisible: false,
      allBatch: [],
      allFieldName: [],
      totalCount: 0,
      screeningTimeValue: null,
      searchReq: {
        batchId: '',
        beginScore: '',
        city: '',
        customRequirements: [
          {
            // belongTo: '',
            // fieldType: '',
            // propertyCode: '',
            // range: '',
            // value: '',
            // valueFrom: '',
            // valueTo: ''
          }
        ],
        customerSex: '',
        district: '',
        endScore: '',
        province: '',
        modifyTimeStart: '',
        modifyTimeEnd: ''
      },
      addListReq: {
        customerQueryModel: {},
        listName: '',
        validityStatus: '0'
      },
      fieldType: '',
      fieldValues: [],
      fieldTags: [],
      fieldTagInfo: {},
      customRequirement: {
        belongTo: '',
        fieldType: '',
        propertyCode: '',
        range: '',
        value: '',
        valueFrom: '',
        valueTo: ''
      },
      customRequirements: [],
      condition: [],
      screening: {
        region: {
          province: '',
          city: '',
          district: ''
        }
      },
      // ---------------------
      formContainerOpen: '1',
      rule: rule,
      detailVisible: false,
      delVisible: false, // 删除对话框显示隐藏
      editVisible: false, // 修改对话框显示隐藏
      visibleCheck: false, // 设置为不可见提示
      addVisible: false, // 新建对话框显示隐藏
      batchDelVisible: false, // 批量删除对话框显示隐藏
      tableData: [], // 表格数据
      batchTableData: [], // 批次表格
      customerTableData: [], // 客户信息表格
      validate: true, // 验证不通过阻止发请求
      pageShow: false, // 分页显示隐藏
      pageShow2: false, // 分页显示隐藏
      namelistDetail: {},
      delReq: {
        listId: ''
      },
      batchDelReq: {
        idlist: []
      },
      // 查询 发送请求参数
      req: {
        listId: '',
        listName: '',
        modifierName: '',
        startCreateTime: '',
        endCreateTime: '',
        pageNo: 1,
        pageSize: 10
      },
      req2: {
        listId: '',
        listName: '',
        modifierName: '',
        startCreateTime: '',
        endCreateTime: '',
        pageNo: 1,
        pageSize: 10
      },
      searchCustomer: {
        isInternalAdmin: parseInt(localStorage.getItem('is_internal_admin')),
        customerId: '',
        customerName: '',
        mobile: '',
        modifierName: '',
        startModifierTime: '',
        endModifierTime: '',
        pageNo: 1,
        pageSize: 10
      },
      addNamelist: {
        listName: '',
        batchIds: [],
        assignStatus: 1,
        visible: 1
      },
      addNameList: {
        listName: '',
        customerIds: [],
        assignStatus: 1,
        visible: 1
      },
      editReq: {
        listId: '',
        listName: '',
        modifierName: '',
        modifierTime: '',
        visible: null
      },
      editCheck: false,
      // editNamelist: {},
      // 分页数据
      pageInfo: {},
      // 新建名单分页
      namelistPageInfo: {}
    }
  },
  mounted() {
    this.handleChangeAcitve()
    this.searchNamelist(this.req)
  },
  methods: {
    handleChangeAcitve(active = ['1']) {
      if (active.length) {
        $('.form-more').text('收起')
      } else {
        $('.form-more').text('更多')
      }
    },
    handleChangeAcitve2(active = ['1']) {
      if (active.length) {
        $('.form-more2').text('收起')
      } else {
        $('.form-more2').text('更多')
      }
    },
    // 名单抽取
    checkCustomForm() {
      if (!this.customRequirement.propertyCode) {
        this.$message.error('请选择字段名')
        return false
      } else if (!this.customRequirement.range) {
        this.$message.error('请选择条件')
        return false
      } else if (this.customRequirement.value === 0) {
        return true
      } else if (!this.customRequirement.value) {
        if (this.customRequirement.fieldType === 2 && this.customRequirement.range === 8 && !(this.fieldValues.length)) {
          this.$message.error('请填写条件值')
          return false
        } else if (!this.customRequirement.valueFrom) {
          this.$message.error('请填写条件值')
          return false
        } else if (!this.customRequirement.valueTo) {
          this.$message.error('请填写条件值')
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    },
    // 查询客户返回数量
    getFiltercustomers() {
      if (this.fieldTags.length) {
        this.searchReq.customRequirements = this.customRequirements
      } else {
        this.searchReq.customRequirements = []
      }
      this.searchReq.modifyTimeStart = this.screeningTimeValue ? this.screeningTimeValue[0] : null
      this.searchReq.modifyTimeEnd = this.screeningTimeValue ? this.screeningTimeValue[1] : null
      getFiltercustomers(this.searchReq).then(response => {
        if (response.data.code === 0) {
          this.totalCount = response.data.data
        } else {
          this.totalCount = 0
          this.$message.error('查询失败')
        }
      }).catch(error => {
        throw error
      })
    },
    // 查询所有字段名
    getAllField() {
      getAllField().then(response => {
        if (response.data.code === 0) {
          this.allFieldName = this.fieldNameFilter(response.data.data)
        } else {
          this.$message.error('获取字段名失败')
        }
        this.addScreeningVisible = true
      }).catch(error => {
        throw error
      })
    },
    // 去掉基础条件重复的字段名
    fieldNameFilter(arr) {
      var obj = arr
      for (var i = 0; i < obj.length; i++) {
        if (obj[i].id === 33) obj.splice(i, 1)
        if (obj[i].id === 39) obj.splice(i, 1)
        if (obj[i].id === 40) obj.splice(i, 1)
        if (obj[i].id === 41) obj.splice(i, 1)
        if (obj[i].id === 69) obj.splice(i, 1)
      }
      return obj
    },
    // 查询所有批次
    getAllBatch() {
      console.log(this.searchReq)
      getAllBatch().then(response => {
        if (response.data.code === 0) {
          this.allBatch = response.data.data
        } else {
          this.$message.error('获取批次失败')
        }
      }).catch(error => {
        throw error
      })
    },
    // 正整数且前者不能大于后者
    checkPositiveInteger(req) {
      var beginVal = 0
      var endVal = 0
      if (req.beginScore) beginVal = parseInt(req.beginScore)
      else if (!req.beginScore) beginVal = 0
      if (req.endScore) endVal = parseInt(req.endScore)
      else if (!req.endScore) endVal = 0
      if (beginVal >= 0) {
        if (beginVal > endVal && req.endScore) {
          this.$message.error('分数取值前者不能大于后者！')
        }
      } else {
        this.$message.error('分数只能是正整数')
        this.searchReq.beginScore = '0'
      }
      if (endVal >= 0) {
        if (beginVal > endVal && req.endScore) {
          this.$message.error('分数取值前者不能大于后者！')
        }
      } else {
        this.$message.error('分数只能是正整数')
        this.searchReq.endScore = '0'
      }
    },
    // 数字且前者不能大于后者
    checkInt(req) {
      if (req.valueFrom === null && req.valueTo === null) return false
      var beginVal = 0
      var endVal = 0
      var reg = /-[0-9]+(.[0-9]+)?|[0-9]+(.[0-9]+)?/
      if (req.valueFrom) beginVal = Number(req.valueFrom)
      if (req.valueTo) endVal = Number(req.valueTo)
      if (reg.test(beginVal) && reg.test(endVal)) {
        if (beginVal > endVal && req.valueTo) {
          this.$message.error('数字条件值前者不能大于后者！')
          this.customRequirement.valueFrom = null
          this.customRequirement.valueTo = null
        }
      } else {
        this.$message.error('请填写数字')
        this.customRequirement.valueFrom = null
        this.customRequirement.valueTo = null
      }
    },
    checkNumber(val) {
      var num = 0
      var reg = /-[0-9]+(.[0-9]+)?|[0-9]+(.[0-9]+)?/
      if (val) num = Number(val)
      if (!reg.test(num)) {
        this.$message.error('请填写数字')
        this.customRequirement.value = 0
      } else {
        return true
      }
    },
    // 地区三级连跳
    getRegion3(req) {
      getRegion(req).then(response => {
        if (response.data.code === 0) {
          if (response.data.data[0].regionLevel === 1) {
            this.screening.region.province = response.data.data
          } else if (response.data.data[0].regionLevel === 2) {
            this.screening.region.city = response.data.data
            if (this.screening.region.city.length === 1) {
              this.searchReq.city = response.data.data[0].regionCode
              this.$set(this.searchReq, 'district', '')
              getRegion(this.searchReq.city).then(response => {
                this.screening.region.district = response.data.data
              }).catch(error => {
                throw error
              })
            } else {
              this.searchReq.city = ''
              this.$set(this.searchReq, 'district', '')
            }
          } else if (response.data.data[0].regionLevel === 3) {
            this.screening.region.district = response.data.data
            this.$set(this.screening, 'district', '')
          }
        }
      }).catch(error => {
        throw error
      })
    },
    // 自定义筛选条件
    // 选择字段名
    changeFieldName(value) {
      let obj = {}
      obj = this.allFieldName.find((item) => {
        return item.propertyCode === value
      })
      this.fieldValues = []
      this.$set(this.customRequirement, 'value', '')
      this.$set(this.customRequirement, 'valueFrom', '')
      this.$set(this.customRequirement, 'valueTo', '')
      this.$set(this.customRequirement, 'range', '')
      this.$set(this.customRequirement, 'fieldType', obj.fieldType)
      this.$set(this.customRequirement, 'belongTo', obj.belongTo)
      this.$set(this.fieldTagInfo, 'name', obj.propertyName)
      this.getFieldItem(obj)
    },
    // 选择条件
    changeField(index) {
      let obj = {}
      obj = this.condition.find((item) => {
        return item.value === index
      })
      this.fieldValues = []
      this.$set(this.fieldTagInfo, 'condition', obj.name)
      this.$set(this.customRequirement, 'value', '')
      this.$set(this.customRequirement, 'valueFrom', '')
      this.$set(this.customRequirement, 'valueTo', '')
      if (this.customRequirement.fieldType === 0) this.fieldType = 'string'
      else if (index >= '0' && index <= '5' && this.customRequirement.fieldType === 2) this.fieldType = 'dateTime'
      else if (index === '8' && this.customRequirement.fieldType === 2) {
        this.fieldType = 'dateInterval'
        this.customRequirement.value = ''
      } else if (index === '8' && this.customRequirement.fieldType === 1) {
        this.fieldType = 'interval'
      } else this.fieldType = 'int'
    },
    // 添加标签
    addFieldTag() {
      console.log(this.customRequirement.value)
      var tagTemp = {}
      var temp = {}
      if (this.customRequirement.value || this.customRequirement.value === 0) {
        this.$set(this.fieldTagInfo, 'value', this.customRequirement.value)
        this.fieldTagInfo.valueFrom = ''
        this.fieldTagInfo.valueTo = ''
        this.customRequirement.valueFrom = ''
        this.customRequirement.valueTo = ''
      } else if (this.fieldValues.length) {
        this.$set(this.customRequirement, 'valueFrom', this.fieldValues[0])
        this.$set(this.customRequirement, 'valueTo', this.fieldValues[1])
        this.$set(this.fieldTagInfo, 'valueFrom', this.fieldValues[0])
        this.$set(this.fieldTagInfo, 'valueTo', this.fieldValues[1])
        this.fieldTagInfo.value = ''
        this.customRequirement.value = ''
      } else {
        this.$set(this.fieldTagInfo, 'valueFrom', this.customRequirement.valueFrom)
        this.$set(this.fieldTagInfo, 'valueTo', this.customRequirement.valueTo)
        this.fieldTagInfo.value = ''
        this.customRequirement.value = ''
      }
      if (!this.checkCustomForm()) {
        return false
      }
      tagTemp = clone(this.fieldTagInfo)
      if (JSON.stringify(this.fieldTags).indexOf(JSON.stringify(tagTemp)) === -1) {
        this.fieldTags.push(tagTemp)
      } else {
        this.$message.error('请勿添加相同的自定义筛选条件')
      }
      temp = clone(this.customRequirement)
      if (JSON.stringify(this.customRequirements).indexOf(JSON.stringify(temp)) === -1) {
        this.customRequirements.push(temp)
      } else {
        this.$message.error('请勿添加相同的自定义筛选条件')
      }
    },
    // 取消添加
    cancelAddFieldTag() {
      this.customRequirement = {
        belongTo: '',
        fieldType: '',
        propertyCode: '',
        range: '',
        value: '',
        valueFrom: '',
        valueTo: ''
      }
      this.fieldValues = []
      this.fieldTagInfo = {}
      this.addScreeningVisible = false
    },
    closeTag(index) {
      this.fieldTags.splice(index, 1)
      this.customRequirements.splice(index, 1)
    },
    getFieldItem(obj) { // 0 string , 1 int , 2 date
      this.condition = []
      if (obj.fieldType === 0) {
        this.condition = [
          { name: '等于', value: '0' },
          { name: '包含', value: '6' },
          { name: '不包含', value: '7' }
        ]
      } else if (obj.fieldType === 1) {
        this.condition = [
          { name: '等于', value: '0' },
          { name: '不等于', value: '1' },
          { name: '大于', value: '2' },
          { name: '大于等于', value: '3' },
          { name: '小于', value: '4' },
          { name: '小于等于', value: '5' },
          { name: '范围', value: '8' }
        ]
      } else {
        this.condition = [
          { name: '等于', value: '0' },
          { name: '不等于', value: '1' },
          { name: '大于', value: '2' },
          { name: '大于等于', value: '3' },
          { name: '小于', value: '4' },
          { name: '小于等于', value: '5' },
          { name: '范围', value: '8' }
        ]
      }
    },
    resetScreeningForm() {
      console.log(this.searchReq)
      this.fieldType = ''
      this.fieldTags = []
      this.screeningTimeValue = null
      this.fieldValues = []
      this.customRequirements = []
      this.searchReq = {
        batchId: '',
        beginScore: '',
        city: '',
        customRequirements: [
          // {
          //   belongTo: '',
          //   fieldType: '',
          //   propertyCode: '',
          //   range: '',
          //   value: '',
          //   valueFrom: '',
          //   valueTo: ''
          // }
        ],
        customerSex: '',
        district: '',
        endScore: '',
        province: '',
        modifyTimeStart: '',
        modifyTimeEnd: ''
      }
      this.cancelAddFieldTag()
    },
    addGenerate() {
      if (!this.addListReq.listName) {
        this.$message.error('请输入名单名称')
        return false
      } else {
        if (this.fieldTags.length) {
          this.searchReq.customRequirements = this.customRequirements
        } else {
          this.searchReq.customRequirements = []
        }
        this.searchReq.modifyTimeStart = this.screeningTimeValue ? this.screeningTimeValue[0] : null
        this.searchReq.modifyTimeEnd = this.screeningTimeValue ? this.screeningTimeValue[1] : null
        this.addListReq.customerQueryModel = clone(this.searchReq)
        getFiltercustomers(this.searchReq).then(response => {
          if (response.data.code === 0) {
            this.totalCount = response.data.data
            if (!this.totalCount) {
              this.$message.error('该条件下无符合的数据，无法生成名单')
            } else {
              addGenerate(this.addListReq).then(response => {
                if (response.data.code === 0) {
                  this.$message.success('生成名单成功')
                  this.req.pageNo = 1
                  this.searchNamelist(this.req)
                  this.extractVisible = false
                  this.importVisible = false
                } else {
                  this.$message.error('生成名单失败')
                }
              }).catch(error => {
                throw error
              })
            }
          } else {
            this.totalCount = 0
          }
        }).catch(error => {
          throw error
        })
      }
    },
    resetScreening() {
      this.addListReq = {
        customerQueryModel: {},
        listName: '',
        validityStatus: '0'
      }
      this.totalCount = 0
      this.resetScreeningForm()
    },
    // ---------------------------------
    formatDateTime: formatDateTime,
    // 深度克隆
    clone: clone,
    resetForm(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.validate = true
        } else {
          this.validate = false
        }
      })
    },
    // 身份证号码加密
    hideIdNumber(idNumber) {
      if (idNumber) {
        return idNumber.substring(0, 10) + '****' + idNumber.substring(14, 18)
      }
    },
    // 手机号码加密
    hideMobile(mobileNo) {
      if (mobileNo) {
        return mobileNo.substring(0, 3) + '****' + mobileNo.substring(7, 11)
      }
    },
    // 性别显示判断
    showSex(code) {
      return code === 1 ? '女' : '男'
    },
    // 清空重置
    clearForm(obj, formName) {
      this.req = {
        listId: '',
        listName: '',
        modifierName: '',
        startCreateTime: '',
        endCreateTime: '',
        pageNo: this.pageInfo.pageNo,
        pageSize: this.pageInfo.pageSize
      }
      this.req2 = {
        listId: '',
        listName: '',
        modifierName: '',
        startCreateTime: '',
        endCreateTime: '',
        pageNo: this.pageInfo.pageNo,
        pageSize: this.pageInfo.pageSize
      }
      this.timeValue = null
    },
    clearForm3() {
      this.timeValue = null
      this.searchCustomer = {
        isInternalAdmin: parseInt(localStorage.getItem('is_internal_admin')),
        customerId: '',
        customerName: '',
        mobile: '',
        modifierName: '',
        startModifierTime: '',
        endModifierTime: '',
        pageSize: this.namelistPageInfo.pageSize,
        pageNo: this.namelistPageInfo.pageNo
      }
    },
    // 查询名单信息
    searchNamelist(val) {
      var req = val
      req.startCreateTime = this.timeValue ? this.timeValue[0] : null
      req.endCreateTime = this.timeValue ? this.timeValue[1] : null
      queryNamelist(req)
        .then(response => {
          if (response.data.code === 0) {
            this.tableData = response.data.data
            // this.$set(this.tableData, response.data.data)
            if (response.data.pageInfo) {
              this.pageInfo = response.data.pageInfo
              this.pageShow = true
            } else {
              this.pageShow = false
            }
          } else {
            this.$message(response.data.message)
            this.tableData = response.data.data
            this.pageShow = false
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    getBatch(req) {
      queryBatch(req)
        .then(response => {
          if (response.data.code === 0) {
            if (response.data.data) {
              this.batchTableData = response.data.data
              this.namelistPageInfo = response.data.pageInfo
              this.pageShow2 = true
            } else {
              this.batchTableData = response.data.data
              this.pageShow2 = false
            }
          } else {
            this.$message(response.data.message)
            this.pageShow2 = false
          }
        })
        .catch(error => {
          console.log(error)
          this.$message('操作失败')
        })
    },
    // 查询客户信息
    getCustomers(req) {
      req.startModifierTime = this.timeValue ? this.timeValue[0] : null
      req.endModifierTime = this.timeValue ? this.timeValue[1] : null
      queryByCustomer(req)
        .then(response => {
          if (response.data.code === 0) {
            this.customerTableData = response.data.data
            if (response.data.pageInfo) {
              this.namelistPageInfo = response.data.pageInfo
              this.pageShow2 = true
            } else {
              this.pageShow2 = false
            }
          } else {
            this.$message(response.data.messages)
            this.customerTableData = response.data.data
            this.pageShow2 = false
          }
        })
        .catch(error => {
          console.log(error)
          this.$message('操作失败')
        })
    },
    // 删除名单信息
    delNamelist(listId) {
      delList(listId)
        .then(response => {
          if (response.data.code === 0) {
            this.$message.success(response.data.message)
            this.req2.pageNo = 1
            this.pageInfo.pageNo = 1
            this.searchNamelist(this.req2)
          } else {
            this.$message(response.data.message)
          }
        })
        .catch(error => {
          console.log(error)
          this.$message('删除失败')
        })
    },
    // 查询名单详情
    searchByListId(listId) {
      queryByListId(listId)
        .then(response => {
          if (response.data.code === 0) {
            this.namelistDetail = response.data.data
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    checkEditNamelist(obj) {
      editNamelist(obj).then(response => {
        if (response.data.code === 0) {
          this.editVisible = false
          this.$message.success(response.data.message)
          this.searchNamelist(this.req2)
        } else {
          this.$message(response.data.message)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 修改名单信息
    editNamelist() {
      this.editReq.listId = this.namelistDetail.listId
      this.editReq.listName = this.namelistDetail.listName
      this.editReq.modifierName = this.namelistDetail.modifierName
      this.editReq.modifierTime = this.namelistDetail.modifierTime
      this.editReq.validityStatus = this.namelistDetail.validityStatus

      if (this.editReq.validityStatus === 1) {
        this.visibleCheck = true
      } else {
        this.editVisible = false
        editNamelist(this.editReq).then(response => {
          if (response.data.code === 0) {
            this.$message.success(response.data.message)
            this.searchNamelist(this.req2)
          } else {
            this.$message(response.data.message)
          }
        }).catch(error => {
          console.log(error)
        })
      }
    },
    // 新建名单(通过批次)
    newNamelist(addReq) {
      if (!this.validate) {
        this.$message.error('请输入名单名称')
        return false
      }
      if (this.addNamelist.batchIds.length === 0) {
        this.$message.error('请选择需要生成名单的批次')
        return false
      }
      this.addVisible = false
      addNamelist(addReq).then(response => {
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
          setTimeout(() => {
            this.searchNamelist(this.req2)
          }, 500)
        } else {
          this.$message('新建失败')
        }
      }).catch(error => {
        this.$message('新建失败')
        console.log(error)
      })
    },
    // 新建名单(通过客户信息)
    newNameList(addReq) {
      if (!this.validate) {
        this.$message.error('请输入名单名称')
        return false
      }
      if (this.addNameList.customerIds.length === 0) {
        this.$message.error('请选择需要生成名单的客户')
        return false
      }
      this.addVisible = false
      addNameList(addReq).then(response => {
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
          setTimeout(() => {
            this.searchNamelist(this.req2)
          }, 500)
        } else {
          this.$message('新建失败')
        }
        this.addNameList.listName = ''
        this.clearForm3()
      }).catch(error => {
        this.$message('新建失败')
        console.log(error)
      })
    },
    // 批量删除
    batchDelNamelist(batchDelReq) {
      if (batchDelReq.idlist.length === 0) {
        this.$message.error('请选择需要删除的内容')
      } else {
        batchDelList(batchDelReq.idlist).then(response => {
          if (response.data.code === 0) {
            this.$message.success(response.data.message)
            this.req2.pageNo = 1
            this.pageInfo.pageNo = 1
            this.searchNamelist(this.req2)
          } else {
            this.$message('删除失败')
          }
        }).catch(error => {
          console.log(error)
          this.$message('删除失败')
        })
      }
    },
    // 表格多选框
    handleSelectionChange(val) {
      this.batchDelReq.idlist.length = 0
      for (var i = 0; i < val.length; i++) {
        this.batchDelReq.idlist.push(val[i].listId)
      }
    },
    namelistSelectionChange(val) {
      this.addNameList.customerIds.length = 0
      for (var i = 0; i < val.length; i++) {
        this.addNameList.customerIds.push(val[i].customerId)
      }
    },
    // 页面显示条数
    handleSizeChange(val) {
      this.req.pageSize = val
      this.req2.pageSize = val
      this.req2.pageNo = 1
      this.pageInfo.pageNo = 1
      this.searchNamelist(this.req2)
    },
    namelistSizeChange(val) {
      this.searchCustomer.pageSize = val
      this.getCustomers(this.searchCustomer)
    },
    // 分页翻页功能
    handleCurrentChange(val) {
      this.req2.pageNo = val
      this.searchNamelist(this.req2)
    },
    namelistPageChange(val) {
      this.searchCustomer.pageSize = this.namelistPageInfo.pageSize
      this.searchCustomer.pageNo = val
      this.getCustomers(this.searchCustomer)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.table-container{
  .form-container{
    box-shadow:none;
    border:1px solid #EBEEF5;
    border-left: solid 4px #57AFFF;
  }
}
</style>