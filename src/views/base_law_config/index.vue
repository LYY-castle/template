<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-form :inline="true" class="demo-form-inline" size="small">
          <!-- <el-form-item label="岗位:">
             <el-select v-model="formInline.job_id" placeholder="岗位">
                <el-option label="所有岗位" value=""></el-option>
                <el-option label="坐席" value="0"></el-option>
                <el-option label="质检" value="1"></el-option>
                <el-option v-for="item in allJobs" :key="item.job_id" :label="item.job_name" :value="item.job_name"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="名称:">
            <el-input placeholder="名称（限长45字符）" v-model="formInline.name" maxlength="45"></el-input>
          </el-form-item>
          <el-form-item label="配置类型:">
             <el-select v-model="formInline.type" placeholder="配置类型">
                <el-option label="所有类型" value=""></el-option>
                <el-option label="基础配置" value="0"></el-option>
                <el-option label="浮动配置" value="1"></el-option>
                <el-option label="其他金额配置" value="2"></el-option>
                <!-- <el-option v-for="item in allLevels" :key="item.level_id" :label="item.level_name" :value="item.level_name"></el-option> -->
            </el-select>
          </el-form-item>
          <el-form-item label="值类型:">
             <el-select v-model="formInline.val_type" placeholder="值类型" >
                <el-option label="所有类型" value=""></el-option>
                <el-option label="金额" value="0"></el-option>
                <el-option label="系数" value="1"></el-option>
                <!-- <el-option v-for="item in allValueTypes" :key="item.val_type" :label="item.val_name" :value="item.val_name"></el-option> -->
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="值区间:">
              <el-input placeholder="最小值" v-model="formInline.min" maxlength="10" style="width:100px"></el-input>--
              <el-input placeholder="最大值" v-model="formInline.max" maxlength="10" style="width:100px"></el-input>
          </el-form-item> -->
          <el-form-item label="可见性:">
             <el-select v-model="formInline.enabled" placeholder="可见性">
                <el-option label="所有情况" value=""></el-option>
                <el-option label="可见" value="0"></el-option>
                <el-option label="不可见" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="操作人:">
            <el-input placeholder="操作人（限长45字符）" v-model="formInline.modifierName" maxlength="45"></el-input>
          </el-form-item>
          <el-form-item label="操作时间：">
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
            <el-button type="primary" @click="searchInfo(formInline)">查询</el-button>
            <el-button type="danger" @click="resetFormInline()">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :header-row-style="headerRow"
          :data="tableData"
          ref="multipleTable"
          tooltip-effect="dark"
          border
          @selection-change="handleSelectionChange">
          <el-table-column
            align="center"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            align="center"
            label="名称"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{scope.row.name}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="type"
            label="配置类型"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.type }}
            </template>
          </el-table-column>
            <el-table-column
            align="center"
            prop="val_type"
            label="值类型"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.val_type }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="remark"
            label="备注"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.remark }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="enabled"
            label="可见性"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.enabled }}
            </template>
          </el-table-column>
          
          <el-table-column
            align="center"
            prop="modifier_name"
            label="操作人"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.modifier_name }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="modify_time"
            label="操作时间"
            width="155"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="150">
            <template slot-scope="scope">
              <el-button @click="handleQuery(scope.row)" type="text" size="small"> 查看</el-button>
              <el-button @click="handleClick(scope.row)" type="text" size="small"> 编辑</el-button>
              <el-button @click="handleCopy(scope.row)" type="text" size="small" > 复制</el-button>
              <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row style="margin-top:1%;">
        <el-col :span="10">
          <el-button type="primary" size="small" @click="addRuleFormPage()">新建</el-button>
          <el-button type="danger" size="small" @click="deleteAll()">批量删除</el-button>
          <el-button type="primary" size="small" @click="batchVisable()">批量可见</el-button>
          <el-button type="danger" size="small" @click="batchCover()">批量不可见</el-button>
        </el-col>
        <el-col :span="14">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="pagination.pageNo"
            :page-size="pagination.pageSize"
            :page-sizes="[10, 20, 30, 40, 50]"
            layout="total, sizes, prev, pager, next, jumper "
            :total="pagination.totalCount" style="text-align: right">
          </el-pagination>
        </el-col>
      </el-row>
    </div>
    <el-dialog title="新增配置" :visible.sync="dialogFormVisible" width="60%" @close="resetForm('ruleForm')" append-to-body>
      <el-form :model="ruleForm" ref="ruleForm" label-width="150px" class="demo-ruleForm">
        <el-row>
          <el-col :span="17">
            <el-form-item label="配置名称" prop="name" :rules="{ required: true, message: '请填写配置名称', trigger: 'blur' }">
              <el-input placeholder="此处填写配置名称，上限50字符"  maxlength="50" v-model='ruleForm.name' >{{ruleForm.name}}</el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="配置类型">
          <el-select v-model="ruleForm.type" placeholder="配置类型">
                <el-option label="基础配置" value="0"></el-option>
                <el-option label="浮动配置" value="1"></el-option>
                <el-option label="其他金额配置" value="2"></el-option>
                <!-- <el-option v-for="item in allLevels" :key="item.level_id" :label="item.level_name" :value="item.level_name"></el-option> -->
            </el-select>
        </el-form-item>
        <el-form-item label="值类型"  :rules="{required:true}" v-if="ruleForm.type==='0'||ruleForm.type==='1'">
          <el-radio-group v-model='ruleForm.val_type' size="mini">
            <el-radio-button label='0'>金额</el-radio-button>
            <el-radio-button label='1'>系数</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="值类型"  :rules="{required:true}" v-if="ruleForm.type==='2'">
          <span v-model='ruleForm.val_type' size="mini" value='0'>金额</span>
        </el-form-item>
        <el-form-item label="描述">
          <textarea v-model='ruleForm.description' placeholder="此处填写配置名称简单描述，上限100字符" maxlength="100" cols="63" rows="4">{{ruleForm.description}}</textarea>
        </el-form-item>
        <el-form-item label="值" v-if="ruleForm.type==='2'" :rules="{required: true}">
          <i style="color:red">￥</i><el-input v-model='ruleForm.value' placeholder="此处填写金额" maxlength="10" style="width:150px;margin-left:1%">{{ruleForm.value}}</el-input>元
        </el-form-item>
        <template>
          <div style="margin-bottom:1%" v-if="ruleForm.type==='0'||ruleForm.type==='1'">
           <el-button type="primary" @click="addRuleForm(ruleForm.type)">添加栏</el-button>
          </div>
        <el-table
          v-if="ruleForm.type==='0'"
          :data="ruleForm.list"
          style="width: 100%">
          <el-table-column
            align="center"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            align="center"
            prop="job_name"
            label="岗位"
            width="180">
            <template slot-scope="scope">
              <el-select v-model="scope.row.job_id" placeholder="岗位" @change="checkRow('ruleForm',scope.row)">
                  <el-option label="所有岗位" value=""></el-option>
                  <el-option label="坐席" value="0"></el-option>
                  <el-option label="质检" value="1"></el-option>
                  <!-- <el-option v-for="item in allJobs" :key="item.job_id" :label="item.job_name" :value="item.job_name"></el-option> -->
              </el-select>
            </template>
          </el-table-column>
         
          <el-table-column
            align="center"
            prop="level_name"
            label="职级"
            width="180">
            <template slot-scope="scope">
              <el-select v-model="scope.row.level_id" placeholder="职级"  @change="checkRow('ruleForm',scope.row)">
                  <el-option label="所有职级" value=""></el-option>
                  <el-option label="一级" value="0"></el-option>
                  <el-option label="二级" value="1"></el-option>
                  <!-- <el-option v-for="item in allLevels" :key="item.level_id" :label="item.level_name" :value="item.level_name"></el-option> -->
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="value"
            label="值">
             <template slot-scope="scope">
               <el-input v-model="scope.row.value" style="width:100px"></el-input>
             </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-button type="danger" @click="deleteRow('ruleForm',scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-table
          v-if="ruleForm.type==='1'"
          :data="ruleForm.array"
          style="width: 100%">
          <el-table-column
            align="center"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            align="center"
            prop="job_name"
            label="岗位"
            width="180">
            <template slot-scope="scope">
              <el-select v-model="scope.row.job_id" placeholder="岗位" @change="checkRow('ruleFormArray',scope.row)">
                  <el-option label="所有岗位" value=""></el-option>
                  <el-option label="坐席" value="0"></el-option>
                  <el-option label="质检" value="1"></el-option>
                  <!-- <el-option v-for="item in allJobs" :key="item.job_id" :label="item.job_name" :value="item.job_name"></el-option> -->
              </el-select>
            </template>
          </el-table-column>
         
          <el-table-column
            align="center"
            prop="level_name"
            label="职级"
            width="180">
            <template slot-scope="scope">
              <el-select v-model="scope.row.level_id" placeholder="职级"  @change="checkRow('ruleFormArray',scope.row)">
                  <el-option label="所有职级" value=""></el-option>
                  <el-option label="一级" value="0"></el-option>
                  <el-option label="二级" value="1"></el-option>
                  <!-- <el-option v-for="item in allLevels" :key="item.level_id" :label="item.level_name" :value="item.level_name"></el-option> -->
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="value_start"
            label="开始值">
             <template slot-scope="scope">
               <el-input v-model="scope.row.value_start" @change="checkRow('ruleFormArray',scope.row)"></el-input>
             </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="rule1"
            label="与开始值比较">
             <template slot-scope="scope">
             <el-select v-model="scope.row.rule1" @change="checkRow('ruleFormArray',scope.row)">
                  <el-option label="" value=""></el-option>
                  <el-option label="=<" value="=<"></el-option>
                  <el-option label="<" value="<"></el-option>
                  <!-- <el-option v-for="item in allLevels" :key="item.level_id" :label="item.level_name" :value="item.level_name"></el-option> -->
              </el-select>
             </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="rule2"
            label="与结束值比较">
             <template slot-scope="scope">
                <el-select v-model="scope.row.rule2" @change="checkRow('ruleFormArray',scope.row)">
                  <el-option label="" value=""></el-option>
                  <el-option label="=<" value="=<"></el-option>
                  <el-option label="<" value="<"></el-option>
                  <!-- <el-option v-for="item in allLevels" :key="item.level_id" :label="item.level_name" :value="item.level_name"></el-option> -->
              </el-select>
             </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="value_end"
            label="结束值">
             <template slot-scope="scope" >
               <el-input v-model="scope.row.value_end" @change="checkRow('ruleFormArray',scope.row)" ></el-input>
             </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="value"
            label="值">
             <template slot-scope="scope">
               <el-input v-model="scope.row.value" ></el-input>
             </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="rate"
            label="权重">
             <template slot-scope="scope">
               <el-input v-model="scope.row.rate" ></el-input>
             </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-button type="danger" @click="deleteRow('ruleFormArray',scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      
      </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="resetForm('ruleForm')">重置</el-button>
        <el-button @click="resetForm('ruleForm');dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
     <el-dialog title="修改配置" :visible.sync="dialogFormVisibleReverse" width="60%" @close="resetForm('ruleFormReverse')" append-to-body>
      <el-form :model="ruleFormReverse" ref="ruleFormReverse" label-width="150px" class="demo-ruleFormReverse">
        <el-row>
          <el-col :span="17">
            <el-form-item label="配置名称" prop="name" :rules="{ required: true, message: '请填写配置名称', trigger: 'blur' }">
              <el-input placeholder="此处填写配置名称，上限50字符"  maxlength="50" v-model='ruleFormReverse.name'>{{ruleFormReverse.name}}</el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="描述">
          <textarea v-model='ruleFormReverse.description' placeholder="此处填写配置名称简单描述，上限100字符" maxlength="100" cols="63" rows="4">{{ruleFormReverse.description}}</textarea>
        </el-form-item>
        <el-form-item label="值类型"  :rules="{required:true}" >
          <el-radio-group v-model='ruleFormReverse.val_type' size="mini">
            <el-radio-button label='0'>金额</el-radio-button>
            <el-radio-button label='1'>系数</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <template>
          <div style="margin-bottom:1%">
           <el-button type="primary" @click="addRuleFormReverse()">添加栏</el-button>
          </div>
        <el-table
          :data="ruleFormReverse.list"
          style="width: 100%">
          <el-table-column
            align="center"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            align="center"
            prop="job_name"
            label="岗位"
            width="180">
            <template slot-scope="scope">
              <el-select v-model="scope.row.job_id" placeholder="岗位" @change="checkRow('ruleFormReverse',scope.row)">
                  <el-option label="所有岗位" value=""></el-option>
                  <el-option label="坐席" value="0"></el-option>
                  <el-option label="质检" value="1"></el-option>
                  <!-- <el-option v-for="item in allJobs" :key="item.job_id" :label="item.job_name" :value="item.job_name"></el-option> -->
              </el-select>
            </template>
          </el-table-column>
          
          <el-table-column
            align="center"
            prop="level_name"
            label="职级"
            width="180">
            <template slot-scope="scope">
              <el-select v-model="scope.row.level_id" placeholder="职级"  @change="checkRow('ruleFormReverse',scope.row)">
                  <el-option label="所有职级" value=""></el-option>
                  <el-option label="一级" value="0"></el-option>
                  <el-option label="二级" value="1"></el-option>
                  <!-- <el-option v-for="item in allLevels" :key="item.level_id" :label="item.level_name" :value="item.level_name"></el-option> -->
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="value"
            label="值">
             <template slot-scope="scope">
               <el-input v-model="scope.row.value" style="width:100px"></el-input>
             </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-button type="danger" @click="deleteRow('ruleFormReverse',scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="resetForm('ruleFormReverse')">重置</el-button>
        <el-button @click="resetForm('ruleFormReverse');dialogFormVisibleReverse = false">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleFormReverse')">确 定</el-button>
      </div>
    </el-dialog>
     <el-dialog title="查询配置" :visible.sync="dialogFormVisibleDetail" width="60%" @close="resetForm('ruleFormDetail')" append-to-body>
      <el-form :model="ruleFormDetail" ref="ruleFormDetail" label-width="150px" class="demo-ruleFormDetail">
        <el-row>
          <el-col :span="17">
            <el-form-item label="配置名称" prop="name" >
              <span>{{ruleFormDetail.name}}</span>
              <!-- <el-input placeholder="此处填写配置名称，上限50字符"  maxlength="50" v-model='ruleFormDetail.name' readonly="readonly">{{ruleFormDetail.name}}</el-input> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="描述">
          <textarea v-model='ruleFormDetail.description' placeholder="此处填写配置名称简单描述，上限100字符" maxlength="100" cols="63" rows="4" readonly>{{ruleFormDetail.description}}</textarea>
        </el-form-item>
        <el-form-item label="值类型"   >
          <el-radio-group v-model='ruleFormDetail.val_type' size="mini" disabled>
            <el-radio-button label='0'>金额</el-radio-button>
            <el-radio-button label='1'>系数</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <template>
        
        <el-table
          :data="ruleFormDetail.list"
          style="width: 100%">
          <el-table-column
            align="center"
            prop="job_name"
            label="岗位"
            width="180">
            <template slot-scope="scope">
              <el-select v-model="scope.row.job_id" placeholder="岗位" disabled>
                  <el-option label="所有岗位" value=""></el-option>
                  <el-option label="坐席" value="0"></el-option>
                  <el-option label="质检" value="1"></el-option>
                  <!-- <el-option v-for="item in allJobs" :key="item.job_id" :label="item.job_name" :value="item.job_name"></el-option> -->
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="level_name"
            label="职级"
            width="180">
            <template slot-scope="scope">
              <el-select v-model="scope.row.level_id" placeholder="职级" disabled>
                  <el-option label="所有职级" value=""></el-option>
                  <el-option label="一级" value="0"></el-option>
                  <el-option label="二级" value="1"></el-option>
                  <!-- <el-option v-for="item in allLevels" :key="item.level_id" :label="item.level_name" :value="item.level_name"></el-option> -->
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="value"
            label="值">
             <template slot-scope="scope">
               {{scope.row.value}}
               <!-- <el-input v-model="scope.row.value" style="width:100px" readonly="readonly"></el-input> -->
             </template>
          </el-table-column>
        </el-table>
      </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleFormDetail');dialogFormVisibleDetail = false">取消</el-button>
       </div>
    </el-dialog>
      
</div>
</template>

<script>
  import { findAllAccount } from '@/api/base_law_config'
  import { Message, MessageBox } from 'element-ui'
  import { formatDateTime } from '@/utils/tools'
import { duration } from 'moment'

export default {
    name: 'base_law_config',
    data() {
      return {
        timeValue: '',
        pagination: {
          pageNo: null,
          pageSize: null,
          totalCount: null,
          totalPage: null
        },
        tableData: [],
        formInline: {
          job_id: '',
          job_name: '',
          name: '',
          level_id: '',
          level_name: '',
          min: '',
          max: '',
          val_type: '',
          value: '',
          modifierName: '',
          modifierTimeStart: '',
          modifierTimeEnd: '',
          pageNo: 1,
          pageSize: 10
        },
        dataCopy: {
          id: '',
          name: '',
          val_type: '',
          description: '',
          list: [{
            relation_id: '',
            job_id: '',
            name: '',
            level_id: '',
            value: '1',
            isDelete: '0'
          }]
        }, // 用来保存修改或查询界面的初始数据
        tempDeleteArr: [], // 用来保存临时假删除的数据
        ruleForm: {
          name: '',
          type: '0',
          val_type: '0',
          description: '',
          list: [{
            job_id: '',
            level_id: '',
            value: '1'
          }],
          array: [{
            job_id: '',
            level_id: '',
            value_start: '',
            value_end: '',
            value: '1',
            rule1: '<',
            rule2: '<',
            rate: 1
          }],
          value: ''
        },
        ruleFormReverse: {
          id: '',
          name: '',
          val_type: '',
          description: '',
          list: [{
            relation_id: '',
            job_id: '',
            name: '',
            level_id: '',
            value: '1',
            isDelete: '0'
          }]
        },
        ruleFormDetail: {
          id: '111',
          name: 'haha',
          val_type: '0',
          description: 'dsadsadsadsa',
          list: [{
            relation_id: '1212',
            job_id: '0',
            name: 'haha',
            level_id: '1',
            value: '3',
            isDelete: '0'
          }]
        },
        dialogFormVisible: false,
        dialogFormVisibleReverse: false,
        dialogFormVisibleDetail: false
      }
    },
    mounted() {
  
    },
    methods: {
      max(a, b) {
        if (a === 'min' || a === '') {
          return b
        }
        if (b === 'min' || b === '') {
          return a
        }
        return (parseFloat(a) > parseFloat(b)) ? a : b
      },
      min(a, b) {
        if (a === 'max' || a === '') {
          return b
        }
        if (b === 'max' || b === '') {
          return a
        }
        return (parseFloat(a) > parseFloat(b)) ? b : a
      },
      copy(arr1, arr2) {
        if (((arr1[0] === 'min' || arr1[0] === '') && (arr2[0] === 'min' || arr2[0])) || ((arr1[1] === 'max' || arr1[1] === '') && (arr2[1] === 'max' || arr2[1] === ''))) {
          return false
        }
        return parseFloat(this.max(arr1[0], arr2[0])) < parseFloat(this.min(arr1[1], arr2[1]))
      },
      resetFormInline() {
        this.formInline = {
          job_id: '',
          job_name: '',
          name: '',
          level_id: '',
          level_name: '',
          min: '',
          max: '',
          val_type: '',
          value: '',
          modifierName: '',
          modifierTimeStart: '',
          modifierTimeEnd: '',
          pageNo: 1,
          pageSize: 10
  
        }
      },
      searchInfo(obj) { // 调用主页查询方法
        console.log(obj)
      },
      batchVisable() { // 批量可见
        this.multipleSelection.map(function(item, index) {
          console.log(item)
        })
      },
      batchCover() { // 批量不可见
        this.multipleSelection.map(function(item, index) {
          console.log(item)
        })
      },
      deleteAll() {
        this.multipleSelection.map(function(item, index) {
          console.log(item)
        })
        // const chk_box = this.multipleSelection.map(function(item, index) {
        //   return item.gradeId
        // })
      },
      checkRow(str, obj) { // 改变岗位和职级的对应关系，判定是否重复
        let list = []
        if (str === 'ruleForm') {
          list = this.ruleForm.list
        }
        if (str === 'ruleFormArray') {
          list = this.ruleForm.array
        }
        if (str === 'ruleFormReverse') {
          list = this.ruleFormReverse.list
        }
        let count = 0
        if (str === 'ruleForm' || str === 'ruleFormReverse') {
          for (let i = 0; i < list.length; i++) {
            if (list[i].job_id === obj.job_id && list[i].level_id === obj.level_id) {
              count++
              if (count > 1) { // 说明已经存在现有关系，尝试删除最新添加的空白栏
                this.$message.error('已存在此对应关系，如不修改，则会导致不能提交！')
              }
            }
          }
        }
        if (str === 'ruleFormArray') {
          if (((obj.value_start && obj.rule1) || (!obj.value_start && !obj.rule1)) && ((obj.value_end && obj.rule2) || (!obj.value_end && !obj.rule2))) {
            if (obj.value_start && obj.value_end && obj.value_start > obj.value_end) {
              this.$message.error('结束值不能小于开始值，否则将不能提交！')
              return
            }
            const arr = []
            for (let i = 0; i < list.length; i++) {
              if (list[i].job_id === obj.job_id && list[i].level_id === obj.level_id) {
                const tempArr = []
                tempArr[0] = list[i].value_start ? list[i].value_start : 'min'
                tempArr[1] = list[i].value_end ? list[i].value_end : 'max'
                arr.push(tempArr)
              }
            }
            let len = arr.length
            while (len > 0) {
              for (let j = 0; j < arr.length - 1; j++) {
                if (this.copy(arr[j], arr[j + 1])) {
                  this.$message.error('存在交叉数据的问题，请认真核对，否则不能提交！')
                }
              }
              len--
            }
          }
        }
      },

      equals(o1, o2) {
        if (o1.job_id === o2.job_id && o1.level_id === o2.level_id && (o1.isDelete !== '1' && o2.isDelete !== '1')) {
          return 1
        } else {
          return 0
        }
      },
      checkArr(obj) {
        const relation = []
        if (((obj.value_start && obj.rule1) || (!obj.value_start && !obj.rule1)) && ((obj.value_end && obj.rule2) || (!obj.value_end && !obj.rule2))) {
          if (obj.value_start && obj.value_end && obj.value_start > obj.value_end) {
            this.$message.error('存在开始值大于结束值的情况，不能提交！')
            return null
          }
          relation[0] = obj.value_start ? obj.value_start : 'min'
          relation[1] = obj.value_end ? obj.value_end : 'max'
          return relation
        } else {
          this.$message.error('存在开始值或结束值与符号不匹配的情况，不能提交！')
          return null
        }
      },
      deleteItem(arr, obj) {
        if (arr.length < 1) {
          arr[0] = obj.value_start
          arr[1] = obj.value_end
        } else {
          arr.indexOf(obj.value_start) ? arr.splice(arr.indexOf(obj.value_start), 1) : arr.push(obj.value_start)
          arr.indexOf(obj.value_end) ? arr.splice(arr.indexOf(obj.value_end), 1) : arr.push(obj.value_end)
        }
        return arr
      },
      checkForm(obj) {
        if (!obj.name || !obj.val_type) {
          return { 'code': false, 'message': '必填项不能留空白！' }
        }
        if (obj.list.length === 0) {
          return { 'code': true, 'message': '没有确立关系！' }
        }
        if (this.ruleForm.type === '0') { // 基础配置
          const list = obj.list
          let len = list.length
          let count_copy = 0
          while (len > 0) {
            for (let i = 0; i < len - 1; i++) {
              count_copy = count_copy + this.equals(list[i], list[i + 1])
              if (count_copy > 0) {
                return { 'code': false, 'message': '存在重复项，请仔细检查！' }
              }
            }
            len--
          }
          return { 'code': true, 'message': '校验内容无误！' }
        }
        if (this.ruleForm.type === '1') { // 浮动配置
          const array = obj.array
          const objArr = []
          for (let i = 0; i < array.length; i++) {
            let flag = false
            for (let j = 0; j < objArr.length; j++) {
              if (objArr[j].job_id === array[i].job_id && objArr[j].level_id === array[i].level_id) {
                if (this.checkArr(array[i])) {
                  objArr[j].arr.push(this.checkArr(array[i]))
                  flag = true
                  break
                } else {
                  this.$message.error('匹配关系存在错误，请核对并修正！')
                  return { 'code': false, 'message': '匹配关系存在错误，请核对并修正！' }
                }
              }
            }
            if (!flag) {
              if (this.checkArr(array[i])) {
                objArr.push({ 'job_id': array[i].job_id, 'level_id': array[i].level_id, 'arr': this.checkArr(array[i]) })
              } else {
                this.$message.error('匹配关系存在错误，请核对并修正！')
                return { 'code': false, 'message': '匹配关系存在错误，请核对并修正！' }
              }
            }
          }
          console.log(objArr, 'objArr')
          let isLack = true
          let count = 0
          for (let o = 0; o < objArr.length; o++) {
            const arr = objArr[o].arr
            let length = arr.length
            let tempArr = []
            while (length > 0) { // 冒泡判断是否有交叉数据
              for (let k = 0; k < arr.length - 1; k++) {
                if (this.copy(arr[k], arr[k + 1])) {
                  this.$message.error('存在交叉数据的问题，请认真核对并修改！')
                  return { 'code': false, 'message': '存在交叉数据的问题，请认真核对并修改！' }
                }
              }
              length--
            }
            for (let p = 0; p < arr.length; p++) {
              tempArr = this.deleteItem(tempArr, arr[p])
            }
            if (tempArr.length > 2) {
              isLack = false
              count++
            }
          }
          console.log(array, 'array')
          // TODO 提交数据
          let isCross = true
          if (!isLack) {
            console.log('还有一些区间没有包括到', count)
            if (window.confirm('还有至少' + count + '个条件没有包含到，是否继续提交')) {
              isCross = true
            } else {
              isCross = false
            }
          }
          if (isCross) {
            return { 'code': true, 'message': '校验无误！' }
          } else {
            return { 'code': false, 'message': '放弃提交，重新检查并修改！' }
          }
        }
      },
      submitForm(str) { // 提交表单
        if (str === 'ruleForm') {
          const obj = this.checkForm(this.ruleForm)// 核对是否已经存在对应关系
          if (obj.code) {
            console.log('ok')
          } else {
            this.$message.error(obj.message)
          }
        }
        if (str === 'ruleFormReverse') {
          // const list = this.ruleFormReverse.list
          // for (let i = 0; i < this.tempDeleteArr.length; i++) {
          //   list.push(this.tempDeleteArr[i])
          // }
          const tempData = { 'name': this.ruleFormReverse.name,
            'description': this.ruleFormReverse.description,
            'val_type': this.ruleFormReverse.val_type,
            'list': this.tempDeleteArr.concat(this.ruleFormReverse.list) }
          const obj = this.checkForm(tempData)// 核对是否已经存在对应关系
          if (obj.code) {
            console.log('ok')
          } else {
            this.$message.error(obj.message)
          }
        }
      },
      deleteRow(str, obj) { // 删除表栏
        if (str === 'ruleFormReverse') {
          const arr = this.ruleFormReverse.list
          for (let i = 0; i < arr.length; i++) {
            if (arr[i] === obj) {
              // if (obj.isDelete === '0' && obj.relation_id !== null) { // 如果是已经存在的关系，则做假删除
              if (obj.isDelete === '0') {
                obj.isDelete = '1'
                this.tempDeleteArr.push(obj)
              }
              this.ruleFormReverse.list.splice(i, 1)
            }
          }
        }
        if (str === 'ruleForm') {
          const arr = this.ruleForm.list
          for (let i = 0; i < arr.length; i++) {
            if (arr[i] === obj) {
              this.ruleForm.list.splice(i, 1)
            }
          }
        }
        if (str === 'ruleFormArray') {
          const arr = this.ruleForm.array
          for (let i = 0; i < arr.length; i++) {
            if (arr[i] === obj) {
              this.ruleForm.array.splice(i, 1)
            }
          }
        }
      },
      addRuleFormReverse() {
        const list = this.ruleFormReverse.list
        for (let i = 0; i < list.length; i++) {
          if (list[i].job_id === '' && list[i].level_id === '' && list[i].isDelete !== 0) {
            this.$message({
              message: '请先填好须匹配的岗位、级别对应项!',
              type: 'warning',
              duration: 1000
            })
            return
          }
        }
        const item = {
          job_id: '',
          name: this.ruleFormReverse.name,
          level_id: '',
          value: '1'
        }
        this.ruleFormReverse.list.push(item)
      },
      addRuleForm(str) { // 添加表栏
        if (str === '0') { // 基础配置
          const list = this.ruleForm.list
          for (let i = 0; i < list.length; i++) {
            if (list[i].job_id === '' && list[i].level_id === '') {
              this.$message({
                message: '请先填好须匹配的岗位、级别对应项!',
                type: 'warning',
                duration: 1000
              })
              return
            }
          }
          const item = {
            job_id: '',
            level_id: '',
            value: '1'
          }
          this.ruleForm.list.push(item)
        }
        if (str === '1') { // 浮动配置
          const array = this.ruleForm.array
          for (let i = 0; i < array.length; i++) {
            if (array[i].job_id === '' && array[i].level_id === '') {
              this.$message({
                message: '还有未匹配的岗位、级别对应项!',
                type: 'warning',
                duration: 1000
              })
            }
          }
          const item = {
            job_id: '',
            level_id: '',
            value_start: '',
            value_end: '',
            value: '1',
            rule1: '<',
            rule2: '<',
            rate: 1
          }
          this.ruleForm.array.push(item)
        }
      },
      addRuleFormDetailPage() { // 打开查询页面
        this.dialogFormVisibleDetail = true
      },
      addRuleFormReversePage() { // 打开修改页面
        this.dialogFormVisibleReverse = true
      },
      addRuleFormPage() { // 打开新增页面
        this.dialogFormVisible = true
      },
      resetForm(obj) { // 重置新增,修改，查询页面
        switch (obj) {
          case 'ruleForm':
            this.ruleForm = {
              name: '',
              type: '0',
              val_type: '0',
              description: '',
              list: [{
                job_id: '',
                level_id: '',
                value: '1'
              }],
              array: [{
                job_id: '',
                level_id: '',
                value_start: '',
                value_end: '',
                value: '1',
                rule1: '<',
                rule2: '<',
                rate: 1
              }],
              value: ''
            }
            break
          case 'ruleFormReverse':
            this.ruleFormReverse = this.dataCopy
            break
          case 'ruleFormDetail':
            this.ruleFormDetail = this.dataCopy
            break
        }
      },
      handleDelete(row) { //
        MessageBox.confirm('确定执行删除操作吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
  
        })
      },
      handleCopy(row) {
        this.reverseRow = row
        this.dialogFormVisible = true
      },
      handleQuery(row) {
        this.reverseRow = row
        this.dialogFormVisibleDetail = true
      },
      handleClick(row) {
        this.reverseRow = row
        this.dialogFormVisibleReverse = true
      },
      changeStatus(obj) {
        let statu = '0'
        if (obj.isDelete === '0') {
          statu = '2'
        } else if (obj.isDelete === '2') {
          statu = '0'
        } else {
          statu = '1'
        }
      },
      headerRow({ row, rowIndex }) {
        if (rowIndex === 0) {
          return 'color:black'
        } else {
          return ''
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
        console.log(val)
      },
      handleSizeChange(val) {
        this.formInline.pageNo = 1
        this.formInline.pageSize = val
        this.formInline.start_time = this.timeValue[0]
        this.formInline.end_time = this.timeValue[1]
        this.pagination.pageNo = 1
      },
      handleCurrentChange(val) {
        this.formInline.pageNo = val
        this.formInline.start_time = this.timeValue[0]
        this.formInline.end_time = this.timeValue[1]
      }
    }
  }
</script>
<style>

</style>
