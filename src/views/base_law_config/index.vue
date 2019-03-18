<template>
  <div class="app-container">
    <div class="filter-container">
      <el-collapse v-model="formContainerOpen" class="form-container" @change="handleChangeAcitve">
        <el-collapse-item title="筛选条件" name="1">
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
            <el-form-item label="编号:">
              <el-input placeholder="编号（限长45字符）" v-model="formInline.code" maxlength="45"></el-input>
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
            <el-form-item label="操作人姓名:">
              <el-input placeholder="操作人姓名（限长45字符）" v-model="formInline.modifier_realname" maxlength="45"></el-input>
            </el-form-item>
            <el-form-item label="操作人id:">
              <el-input placeholder="操作人id（限长45字符）" v-model="formInline.modifier_id" maxlength="45"></el-input>
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
              <el-button @click="resetFormInline()">重置</el-button>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
      <el-row class="table-container">
        <el-row class="margin-bottom-20">
          <div class="font14 bold">配置管理表</div>
        </el-row>
        <el-row class="margin-bottom-20">
          <el-button type="primary" size="small" @click="addRuleFormPage()">新建</el-button>
          <el-button type="danger" size="small" @click="deleteAll()">批量删除</el-button>
          <!-- <el-button type="primary" size="small" @click="batchVisable()">批量可见</el-button>
          <el-button type="danger" size="small" @click="batchCover()">批量不可见</el-button> -->
          <el-dropdown size="small" trigger="click" @command="moreOperating" style="margin-left:10px">
            <el-button type="info" style="width:auto">
              更多操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown" class="info">
              <el-dropdown-item command='1'>批量可见</el-dropdown-item>
              <el-dropdown-item command='2'>批量不可见</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-row>
        <el-row>
          <el-table
            :header-row-style="headerRow"
            :data="tableData"
            ref="multipleTable"
            tooltip-effect="dark"
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
              prop="code"
              label="编号"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{scope.row.code}}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="type"
              label="配置类型"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{showConfigType(scope.row.type)}}
              </template>
            </el-table-column>
              <el-table-column
              align="center"
              prop="val_type"
              label="值类型"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{showValueType( scope.row.val_type )}}
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
                {{showEnabledType( scope.row.enabled )}}
              </template>
            </el-table-column>
            
            <el-table-column
              align="center"
              prop="modifier_realname"
              label="操作人"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{ scope.row.modifier_realname }}
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
              width="180">
              <template slot-scope="scope">
                <el-button @click="handleQuery(scope.row)" type="text" size="small"> 查看</el-button>
                <el-button @click="handleClick(scope.row)" type="text" size="small"> 编辑</el-button>
                <el-button @click="handleCopy(scope.row)" type="text" size="small" > 复制</el-button>
                <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row style="margin-top:20px;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="pagination.pageNo"
            :page-size="pagination.pageSize"
            :page-sizes="[10, 20, 30, 40, 50]"
            layout="total, sizes, prev, pager, next, jumper "
            :total="pagination.totalCount" style="text-align: right">
          </el-pagination>
        </el-row>
      </el-row>
    </div>
    <el-dialog title="新增配置" :visible.sync="dialogFormVisible" width="60%" @close="resetForm('ruleForm')" append-to-body>
      <el-form size="small" :model="ruleForm" ref="ruleForm" label-width="150px" class="demo-ruleForm">
        <el-row>
          <el-col :span="17">
            <el-form-item label="配置名称" prop="name" :rules="{ required: true, message: '请填写配置名称', trigger: 'blur' }">
              <el-input size="small" placeholder="此处填写配置名称，上限50字符"  maxlength="50" v-model='ruleForm.name' >{{ruleForm.name}}</el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="配置类型">
          <el-select size="small" v-model="ruleForm.type" placeholder="配置类型">
            <el-option label="基础配置" value="0"></el-option>
            <el-option label="浮动配置" value="1"></el-option>
            <el-option label="其他金额配置" value="2"></el-option>
            <!-- <el-option v-for="item in allLevels" :key="item.level_id" :label="item.level_name" :value="item.level_name"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="值类型"  :rules="{required:true}" v-if="ruleForm.type==='1'">
          <el-radio-group v-model='ruleForm.val_type' size="mini">
            <el-radio-button label='0'>金额</el-radio-button>
            <el-radio-button label='1'>系数</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="值类型"  :rules="{required:true}" v-if="ruleForm.type==='0'||ruleForm.type==='2'">
          <span v-model='ruleForm.val_type' size="mini" value='0'>金额</span>
        </el-form-item>
        <el-form-item label="备注">
          <textarea v-model='ruleForm.remark' placeholder="此处填写配置名称简单备注，上限100字符" maxlength="100" cols="63" rows="4">{{ruleForm.remark}}</textarea>
        </el-form-item>
        <el-form-item label="值" v-if="ruleForm.type==='2'" :rules="{required: true}">
          <i style="color:red">￥</i><el-input v-model='ruleForm.value' placeholder="此处填写金额" maxlength="11" style="width:150px;margin-left:1%" @change="checkNum(ruleForm.value)">{{ruleForm.value}}</el-input>元
        </el-form-item>
        <template>
          <div style="margin-bottom:1%" v-if="ruleForm.type==='0'||ruleForm.type==='1'">
           <el-button type="primary" @click="addRuleForm(ruleForm.type)">添加栏</el-button>
          </div>
        <el-table
          v-if="ruleForm.type==='0'"
          :data="ruleForm.base_setting"
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
              <el-select size="small" v-model="scope.row.job_id" placeholder="岗位" @change="checkRow('ruleForm',scope.row)">
                  <!-- <el-option label="所有岗位" value=""></el-option>
                  <el-option label="坐席" value="0"></el-option>
                  <el-option label="质检" value="1"></el-option> -->
                  <el-option v-for="item in allJobs" :key="item.job_id" :label="item.job_name" :value="item.job_name"></el-option>
              </el-select>
            </template>
          </el-table-column>
         
          <el-table-column
            align="center"
            prop="level_name"
            label="职级"
            width="180">
            <template slot-scope="scope">
              <el-select size="small" v-model="scope.row.level_id" placeholder="职级"  @change="checkRow('ruleForm',scope.row)">
                  <!-- <el-option label="所有职级" value=""></el-option>
                  <el-option label="一级" value="0"></el-option>
                  <el-option label="二级" value="1"></el-option> -->
                  <el-option v-for="item in allLevels" :key="item.level_id" :label="item.level_name" :value="item.level_name"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="val"
            label="值">
             <template slot-scope="scope">
               <el-input size="small" v-model="scope.row.val" style="width:100px" @change="checkNum(scope.row.val)"  maxlength="11"></el-input>
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
          :data="ruleForm.float_setting"
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
              <el-select size="small" v-model="scope.row.job_id" placeholder="岗位" @change="checkRow('ruleFormArray',scope.row)">
                  <!-- <el-option label="所有岗位" value=""></el-option>
                  <el-option label="坐席" value="0"></el-option>
                  <el-option label="质检" value="1"></el-option> -->
                  <el-option v-for="item in allJobs" :key="item.job_id" :label="item.job_name" :value="item.job_name"></el-option>
              </el-select>
            </template>
          </el-table-column>
         
          <el-table-column
            align="center"
            prop="level_name"
            label="职级"
            width="180">
            <template slot-scope="scope">
              <el-select size="small" v-model="scope.row.level_id" placeholder="职级"  @change="checkRow('ruleFormArray',scope.row)">
                  <!-- <el-option label="所有职级" value=""></el-option>
                  <el-option label="一级" value="0"></el-option>
                  <el-option label="二级" value="1"></el-option> -->
                  <el-option v-for="item in allLevels" :key="item.level_id" :label="item.level_name" :value="item.level_name"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="val_start"
            label="开始值">
             <template slot-scope="scope">
               <el-input size="small" v-model="scope.row.val_start" @change="checkNum(scope.row.val_start),checkRow('ruleFormArray',scope.row)" maxlength="11"></el-input>
             </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="rule1"
            label="与开始值比较">
             <template slot-scope="scope">
             <el-select size="small" v-model="scope.row.rule1" @change="checkRow('ruleFormArray',scope.row)">
                  <el-option label="" value=""></el-option>
                  <el-option label="<=" value="<="></el-option>
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
                <el-select size="small" v-model="scope.row.rule2" @change="checkRow('ruleFormArray',scope.row)">
                  <el-option label="" value=""></el-option>
                  <el-option label="<=" value="<="></el-option>
                  <el-option label="<" value="<"></el-option>
                  <!-- <el-option v-for="item in allLevels" :key="item.level_id" :label="item.level_name" :value="item.level_name"></el-option> -->
              </el-select>
             </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="val_end"
            label="结束值">
             <template slot-scope="scope" >
               <el-input size="small" v-model="scope.row.val_end" @change="checkNum(scope.row.val_end),checkRow('ruleFormArray',scope.row)" maxlength="11" ></el-input>
             </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="val"
            label="值">
             <template slot-scope="scope">
               <el-input size="small" v-model="scope.row.val" maxlength="11" @change="checkNum(scope.row.val)"></el-input>
             </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="rate"
            label="权重"
            width="120"
            v-if="ruleForm.val_type==='1'">
             <template slot-scope="scope">
               <el-input size="small" style="width:80px" v-model="scope.row.rate" maxlength="5" @change="checkNum(scope.row.rate),checkRow('ruleFormArray',scope.row)"></el-input>%
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
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button type="primary" plain @click="resetForm('ruleForm');dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
      </div>
    </el-dialog>
     <el-dialog title="修改配置" :visible.sync="dialogFormVisibleReverse" width="60%" @close="resetForm('ruleFormReverse')" append-to-body>
      <el-form size="small" :model="ruleFormReverse" ref="ruleFormReverse" label-width="150px" class="demo-ruleFormReverse">
        <el-row>
          <el-col :span="17">
            <el-form-item label="配置名称" prop="name" :rules="{ required: true, message: '请填写配置名称', trigger: 'blur' }">
              <el-input placeholder="此处填写配置名称，上限50字符"  maxlength="50" v-model='ruleFormReverse.name'>{{ruleFormReverse.name}}</el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="配置类型">
          <el-select  v-model="ruleFormReverse.type" placeholder="配置类型" disabled="disabled">
            <el-option label="基础配置" value="0"></el-option>
            <el-option label="浮动配置" value="1"></el-option>
            <el-option label="其他金额配置" value="2"></el-option>
            <!-- <el-option v-for="item in allLevels" :key="item.level_id" :label="item.level_name" :value="item.level_name"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="值类型"  :rules="{required:true}" >
          <el-radio-group v-model='ruleFormReverse.val_type' size="mini" v-if="ruleFormReverse.type==='1'">
            <el-radio-button label='0'>金额</el-radio-button>
            <el-radio-button label='1'>系数</el-radio-button>
          </el-radio-group>
          <span v-model='ruleFormReverse.val_type' size="mini" v-if="ruleFormReverse.type==='0'||ruleFormReverse.type==='2'">
            金额
          </span>
        </el-form-item>
        <el-form-item label="备注">
          <textarea v-model='ruleFormReverse.remark' placeholder="此处填写配置名称简单备注，上限100字符" maxlength="100" cols="63" rows="4">{{ruleFormReverse.remark}}</textarea>
        </el-form-item>
         <el-form-item label="值" v-if="ruleFormReverse.type==='2'" :rules="{required: true}">
          <i style="color:red">￥</i><el-input v-model='ruleFormReverse.value' placeholder="此处填写金额" maxlength="11" style="width:150px;margin-left:1%" @change="checkNum(ruleFormReverse.value)">{{ruleForm.value}}</el-input>元
        </el-form-item>
        <template>
          <div style="margin-bottom:1%" v-if="ruleFormReverse.type==='0'||ruleFormReverse.type==='1'">
           <el-button type="success" @click="addRuleFormReverse(ruleFormReverse.type)">添加栏</el-button>
          </div>
        <el-table
          :data="ruleFormReverse.base_setting"
          v-if="ruleFormReverse.type==='0'"
          style="width: 100%">
          <el-table-column
            align="center"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            align="center"
            prop="id"
            v-if="false"
            width="55"
            label="id">
          </el-table-column>
          <el-table-column
            align="center"
            prop="job_name"
            label="岗位"
            width="180">
            <template slot-scope="scope">
              <el-select size="small" v-model="scope.row.job_id" placeholder="岗位" @change="checkRow('ruleFormReverse',scope.row)">
                  <!-- <el-option label="所有岗位" value=""></el-option>
                  <el-option label="坐席" value="0"></el-option>
                  <el-option label="质检" value="1"></el-option> -->
                  <el-option v-for="item in allJobs" :key="item.job_id" :label="item.job_name" :value="item.job_name"></el-option>
              </el-select>
            </template>
          </el-table-column>
          
          <el-table-column
            align="center"
            prop="level_name"
            label="职级"
            width="180">
            <template slot-scope="scope">
              <el-select size="small" v-model="scope.row.level_id" placeholder="职级"  @change="checkRow('ruleFormReverse',scope.row)">
                  <!-- <el-option label="所有职级" value=""></el-option>
                  <el-option label="一级" value="0"></el-option>
                  <el-option label="二级" value="1"></el-option> -->
                  <el-option v-for="item in allLevels" :key="item.level_id" :label="item.level_name" :value="item.level_name"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="val"
            label="值">
             <template slot-scope="scope">
               <el-input size="small" v-model="scope.row.val" style="width:100px" maxlength="11" @change="checkNum(scope.row.val)"></el-input>
             </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-button size="small" type="danger" @click="deleteRow('ruleFormReverse',scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-table
          v-if="ruleFormReverse.type==='1'"
          :data="ruleFormReverse.float_setting"
          style="width: 100%">
          <el-table-column
            align="center"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            align="center"
            prop="id"
            v-if="false"
            label="id">
          </el-table-column>
          <el-table-column
            align="center"
            prop="job_name"
            label="岗位"
            width="180">
            <template slot-scope="scope">
              <el-select size="small" v-model="scope.row.job_id" placeholder="岗位" @change="checkRow('ruleFormReverseArray',scope.row)">
                  <!-- <el-option label="所有岗位" value=""></el-option>
                  <el-option label="坐席" value="0"></el-option>
                  <el-option label="质检" value="1"></el-option> -->
                  <el-option v-for="item in allJobs" :key="item.job_id" :label="item.job_name" :value="item.job_name"></el-option>
              </el-select>
            </template>
          </el-table-column>
         
          <el-table-column
            align="center"
            prop="level_name"
            label="职级"
            width="180">
            <template slot-scope="scope">
              <el-select size="small" v-model="scope.row.level_id" placeholder="职级"  @change="checkRow('ruleFormReverseArray',scope.row)">
                  <!-- <el-option label="所有职级" value=""></el-option>
                  <el-option label="一级" value="0"></el-option>
                  <el-option label="二级" value="1"></el-option> -->
                  <el-option v-for="item in allLevels" :key="item.level_id" :label="item.level_name" :value="item.level_name"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="val_start"
            label="开始值">
             <template slot-scope="scope">
               <el-input size="small" v-model="scope.row.val_start" @change="checkNum(scope.row.val_start),checkRow('ruleFormReverseArray',scope.row)" maxlength="11"></el-input>
             </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="rule1"
            label="与开始值比较">
             <template slot-scope="scope">
             <el-select size="small" v-model="scope.row.rule1" @change="checkRow('ruleFormReverseArray',scope.row)">
                  <el-option label="" value=""></el-option>
                  <el-option label="<=" value="<="></el-option>
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
                <el-select size="small" v-model="scope.row.rule2" @change="checkRow('ruleFormReverseArray',scope.row)">
                  <el-option label="" value=""></el-option>
                  <el-option label="<=" value="<="></el-option>
                  <el-option label="<" value="<"></el-option>
                  <!-- <el-option v-for="item in allLevels" :key="item.level_id" :label="item.level_name" :value="item.level_name"></el-option> -->
              </el-select>
             </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="val_end"
            label="结束值">
             <template slot-scope="scope" >
               <el-input size="small" v-model="scope.row.val_end" @change="checkNum(scope.row.val_end),checkRow('ruleFormReverseArray',scope.row)" maxlength="11" ></el-input>
             </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="val"
            label="值">
             <template slot-scope="scope">
               <el-input size="small" v-model="scope.row.val" maxlength="11" @change="checkNum(scope.row.val)"></el-input>
             </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="rate"
            label="权重"
            width="120"
            v-if="ruleFormReverse.val_type==='1'">
             <template slot-scope="scope">
               <el-input size="small" style="width:80px" v-model="scope.row.rate" maxlength="5" @change="checkNum(scope.row.rate),checkRow('ruleFormReverseArray',scope.row)"></el-input>%
             </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-button type="danger" @click="deleteRow('ruleFormReverseArray',scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="resetForm('ruleFormReverse')">重置</el-button>
        <el-button type="primary" plain @click="resetForm('ruleFormReverse');dialogFormVisibleReverse = false">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleFormReverse')">确定</el-button>
      </div>
    </el-dialog>
     <el-dialog title="查询配置" :visible.sync="dialogFormVisibleDetail" width="60%" @close="resetForm('ruleFormDetail')" append-to-body>
      <el-form size="small" :model="ruleFormDetail" ref="ruleFormDetail" label-width="150px" class="demo-ruleFormDetail">
        <el-row>
          <el-col :span="17">
            <el-form-item label="配置名称" prop="name" >
              <span>{{ruleFormDetail.name}}</span>
              <!-- <el-input placeholder="此处填写配置名称，上限50字符"  maxlength="50" v-model='ruleFormDetail.name' readonly="readonly">{{ruleFormDetail.name}}</el-input> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注">
          <textarea v-model='ruleFormDetail.remark' placeholder="此处填写配置名称简单备注，上限100字符" maxlength="100" cols="63" rows="4" readonly>{{ruleFormDetail.remark}}</textarea>
        </el-form-item>
        <el-form-item label="值类型"   >
          <el-radio-group v-model='ruleFormDetail.val_type' size="mini" disabled v-if="ruleFormDetail.type==='1'">
            <el-radio-button label='0'>金额</el-radio-button>
            <el-radio-button label='1'>系数</el-radio-button>
          </el-radio-group>
          <span v-model='ruleFormDetail.val_type' size="mini" disabled v-if="ruleFormDetail.type==='0'||ruleFormDetail.type==='2'">
            金额
          </span>
        </el-form-item>
        <el-form-item label="值" v-if="ruleFormDetail.type==='2'">
          <i style="color:red">￥</i><el-input v-model='ruleFormDetail.value' style="width:150px;margin-left:1%" disabled="disabled">{{ruleFormDetail.value}}</el-input>元
        </el-form-item>
        <template>
        
        <el-table
          :data="ruleFormDetail.base_setting"
          v-if="ruleFormDetail.type==='0'"
          style="width: 100%">
          <el-table-column
            align="center"
            prop="job_name"
            label="岗位"
            width="180">
            <template slot-scope="scope">
              <el-select size="small" v-model="scope.row.job_id" placeholder="岗位" disabled>
                  <!-- <el-option label="所有岗位" value=""></el-option>
                  <el-option label="坐席" value="0"></el-option>
                  <el-option label="质检" value="1"></el-option> -->
                  <el-option v-for="item in allJobs" :key="item.job_id" :label="item.job_name" :value="item.job_name"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="level_name"
            label="职级"
            width="180">
            <template slot-scope="scope">
              <el-select size="small" v-model="scope.row.level_id" placeholder="职级" disabled>
                  <!-- <el-option label="所有职级" value=""></el-option>
                  <el-option label="一级" value="0"></el-option>
                  <el-option label="二级" value="1"></el-option> -->
                  <el-option v-for="item in allLevels" :key="item.level_id" :label="item.level_name" :value="item.level_name"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="val"
            label="值">
             <template slot-scope="scope">
               {{scope.row.val}}
               <!-- <el-input v-model="scope.row.value" style="width:100px" readonly="readonly"></el-input> -->
             </template>
          </el-table-column>
        </el-table>

        <el-table
          v-if="ruleFormDetail.type==='1'"
          :data="ruleFormDetail.float_setting"
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
              <el-select size="small" v-model="scope.row.job_id" placeholder="岗位" disabled="disabled">
                  <!-- <el-option label="所有岗位" value=""></el-option>
                  <el-option label="坐席" value="0"></el-option>
                  <el-option label="质检" value="1"></el-option> -->
                  <el-option v-for="item in allJobs" :key="item.job_id" :label="item.job_name" :value="item.job_name"></el-option>
              </el-select>
            </template>
          </el-table-column>
         
          <el-table-column
            align="center"
            prop="level_name"
            label="职级"
            width="180">
            <template slot-scope="scope">
              <el-select size="small" v-model="scope.row.level_id" placeholder="职级" disabled="disabled">
                  <!-- <el-option label="所有职级" value=""></el-option>
                  <el-option label="一级" value="0"></el-option>
                  <el-option label="二级" value="1"></el-option> -->
                  <el-option v-for="item in allLevels" :key="item.level_id" :label="item.level_name" :value="item.level_name"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="val_start"
            label="开始值">
             <template slot-scope="scope">
               <el-input size="small" v-model="scope.row.val_start" disabled="disabled"></el-input>
             </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="rule1"
            label="与开始值比较">
             <template slot-scope="scope">
             <el-select size="small" v-model="scope.row.rule1" disabled="disabled">
                  <el-option label="" value=""></el-option>
                  <el-option label="<=" value="<="></el-option>
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
                <el-select size="small" v-model="scope.row.rule2" disabled="disabled">
                  <el-option label="" value=""></el-option>
                  <el-option label="<=" value="<="></el-option>
                  <el-option label="<" value="<"></el-option>
                  <!-- <el-option v-for="item in allLevels" :key="item.level_id" :label="item.level_name" :value="item.level_name"></el-option> -->
              </el-select>
             </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="val_end"
            label="结束值">
             <template slot-scope="scope" >
               <el-input size="small" v-model="scope.row.val_end" disabled="disabled"></el-input>
             </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="val"
            label="值">
             <template slot-scope="scope">
               <el-input size="small" v-model="scope.row.val" maxlength="11" disabled="disabled"></el-input>
             </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="rate"
            label="权重"
            width="120"
            v-if="ruleFormDetail.val_type==='1'">
             <template slot-scope="scope">
               <el-input size="small" style="width:80px" v-model="scope.row.rate" disabled="disabled"></el-input>%
             </template>
          </el-table-column>
       </el-table>
       
      </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" plain @click="resetForm('ruleFormDetail');dialogFormVisibleDetail = false">返回</el-button>
       </div>
    </el-dialog>
      
</div>
</template>

<script>
  import { addBaseLawConfig, searchInfo, queryOne, updateBaseLawConfig, delBaseLawConfig, batchSetEnabled } from '@/api/base_law_config'
  import { MessageBox } from 'element-ui'
  import { formatDateTime } from '@/utils/tools'
  import { getJob, getLevel } from '@/config/category_codes'
export default {
    name: 'base_law_config',
    data() {
      return {
        formContainerOpen: '1',
        formContainer: this.$store.state.app.formContainer,
        allJobs: [],
        allLevels: [],
        timeValue: [], // 时间插件
        pagination: {// 页码插件
          pageNo: null,
          pageSize: null,
          totalCount: null,
          totalPage: null
        },
        tableData: [], // 列表数据
        formInline: {// 查询列表数据
          name: '',
          code: '',
          type: '',
          val_type: '',
          enabled: '',
          modifier_realname: '',
          modifier_id: '',
          modifierTimeStart: '',
          modifierTimeEnd: '',
          pageNo: 1,
          pageSize: 10
        },
        tempDeleteArr: [], // 用来保存临时假删除的数据
        ruleForm: {// 新增时的配置参数
          name: '',
          type: '0',
          val_type: '0',
          remark: '',
          base_setting: [{// 基础配置
            job_id: '',
            level_id: '',
            val: '1'
          }],
          float_setting: [{// 浮动配置
            job_id: '',
            level_id: '',
            val_start: '',
            val_end: '',
            val: '1',
            rule1: '<',
            rule2: '<',
            rate: 100
          }],
          value: ''// 其他金额配置
        },
        ruleFormReverse: {// 修改时的配置参数
          id: '',
          name: '',
          type: '',
          val_type: '',
          remark: '',
          base_setting: [{// 基础配置
            id: '',
            job_id: '',
            level_id: '',
            val: '1',
            isDelete: '1'// 1:可见，0:不可见（假删除）
          }],
          float_setting: [{// 浮动配置
            id: '',
            job_id: '',
            level_id: '',
            val_start: '',
            val_end: '',
            val: '1',
            rule1: '<',
            rule2: '<',
            rate: 100,
            isDelete: '1'// 1:可见，0:不可见（假删除）
          }],
          value: ''// 其他金额配置
        },
        ruleFormDetail: {
        },
        dialogFormVisible: false,
        dialogFormVisibleReverse: false,
        dialogFormVisibleDetail: false
      }
    },
    mounted() {
      this.formContainer()
      this.handleChangeAcitve()
      console.log(getJob(), getLevel(), '11111')
      this.searchInfo(this.formInline)
    },
    methods: {
      moreOperating(val) {
        if (val === '1') this.batchVisable()
        else this.batchCover()
      },
      handleChangeAcitve(active = ['1']) {
        if (active.length) {
          $('.form-more').text('收起')
        } else {
          $('.form-more').text('更多')
        }
      },
      showEnabledType(str) {
        let result = ''
        switch (str) {
          case 0:result = '不可见'
            break
          case 1:result = '可见'
            break
          default:break
        }
        return result
      },
      showValueType(str) {
        let result = ''
        switch (str) {
          case '0':result = '金额'
            break
          case '1':result = '系数'
            break
          default:break
        }
        return result
      },
      showConfigType(str) {
        let result = ''
        switch (str) {
          case '0':result = '基础配置'
            break
          case '1':result = '浮动配置'
            break
          case '2':result = '其他金额配置'
            break
          default:break
        }
        return result
      },
      checkNum(value) {
        if (isNaN(value)) {
          this.$message.error('您填写了一个非数字类型的值，如不修改将会不能提交！')
        }
      },
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
        if (arr1[0] === 'min' || arr1[0] === '') { // 如果第一个数据只有最大值，则用第二个数据的最小值去比较
          return parseFloat(arr2[0]) < parseFloat(arr1[1])
        }
        if (arr1[1] === 'max' || arr1[1] === '') { // 如果第一个数据只有最小值，则用第二个数据的最大值去比较
          return parseFloat(arr1[0]) < parseFloat(arr2[1])
        }
        if (arr2[0] === 'min' || arr2[0] === '') { // 如果第二个数据只有最大值，则用第一个数据的最小值去比较
          return parseFloat(arr2[0]) > parseFloat(arr1[1])
        }
        if (arr1[1] === 'max' || arr1[1] === '') { // 如果第二个数据只有最小值，则用第一个数据的最大值去比较
          return parseFloat(arr1[0]) > parseFloat(arr2[1])
        }
        return !((parseFloat(arr1[0]) >= parseFloat(arr2[1])) || (parseFloat(arr1[1]) <= parseFloat(arr2[0])))
      },
      resetFormInline() {
        this.formInline = {
          name: '',
          code: '',
          type: '',
          val_type: '',
          enabled: '',
          modifier_realname: '',
          modifier_id: '',
          modifierTimeStart: '',
          modifierTimeEnd: '',
          pageNo: 1,
          pageSize: 10
        }
        this.timeValue = []
      },
      searchInfo(obj) { // 调用主页查询方法
        obj.modifierTimeStart = this.timeValue ? this.timeValue[0] : null
        obj.modifierTimeEnd = this.timeValue ? this.timeValue[1] : null
        searchInfo(obj).then(res => {
          if (res.data.result && res.data.result.data && res.data.result.data.length > 0) {
            this.tableData = res.data.result.data
          }
        })
      },
      batchVisable() { // 批量可见
        if (typeof this.multipleSelection === 'undefined') {
          this.$message.error('还未选中条目！')
          return
        }
        const setting_ids = []
        let flag = true
        this.multipleSelection.map(function(item, index) {
          if (item.enabled === 0) {
            flag = flag && false
          }
          setting_ids.push(item.setting_id)
        })
        if (setting_ids.length < 1) {
          this.$message.error('还未选中需要设置为可见的条目！')
          return
        }
        if (flag) {
          this.$message.error('选中的条目已经都是可见！')
          return
        }
        batchSetEnabled(setting_ids.join(','), 1).then(res => {
          console.log(res, 'res')
        })
      },
      batchCover() { // 批量不可见
        if (typeof this.multipleSelection === 'undefined') {
          this.$message.error('还未选中条目！')
          return
        }
        const setting_ids = []
        let flag = true
        this.multipleSelection.map(function(item, index) {
          if (item.enabled === 1) {
            flag = flag && false
          }
          setting_ids.push(item.setting_id)
        })
        if (setting_ids.length < 1) {
          this.$message.error('还未选中需要设置为不可见的条目！')
          return
        }
        if (flag) {
          this.$message.error('选中的条目已经都是不可见！')
          return
        }
        batchSetEnabled(setting_ids.join(','), 0).then(res => {
          console.log(res, 'res')
        })
      },
      deleteAll() {
        if (typeof this.multipleSelection === 'undefined') {
          this.$message.error('还未选中条目！')
          return
        }
        const setting_ids = []
        this.multipleSelection.map(function(item, index) {
          setting_ids.push(item.setting_id)
        })
        if (setting_ids.length < 1) {
          this.$message.error('还未选中需要删除的条目！')
          return
        }
        delBaseLawConfig(null, setting_ids.join(',')).then(res => {
          console.log(res, 'res')
        })
        // const chk_box = this.multipleSelection.map(function(item, index) {
        //   return item.gradeId
        // })
      },
      checkRow(str, obj) { // 改变岗位和职级的对应关系，判定是否重复
        let base_setting = []
        let float_setting = []
        if (str === 'ruleForm') {
          base_setting = this.ruleForm.base_setting
        }
        if (str === 'ruleFormArray') {
          float_setting = this.ruleForm.float_setting
        }
        if (str === 'ruleFormReverse') {
          base_setting = this.ruleFormReverse.base_setting
        }
        if (str === 'ruleFormReverseArray') {
          float_setting = this.ruleFormReverse.float_setting
        }
        let count = 0
        if (str === 'ruleForm' || str === 'ruleFormReverse') {
          for (let i = 0; i < base_setting.length; i++) {
            if (base_setting[i].job_id === obj.job_id && base_setting[i].level_id === obj.level_id) {
              count++
              if (count > 1) { // 说明已经存在现有关系，尝试删除最新添加的空白栏
                this.$message.error('已存在此对应关系，如不修改，则会导致不能提交！')
              }
            }
          }
        }
        if (str === 'ruleFormArray' || str === 'ruleFormReverseArray') {
          if (((obj.val_start && obj.rule1) || (!obj.val_start && !obj.rule1)) && ((obj.val_end && obj.rule2) || (!obj.val_end && !obj.rule2))) {
            if (obj.val_start && obj.val_end && parseFloat(obj.val_start) >= parseFloat(obj.val_end)) {
              this.$message.error('结束值不能小于开始值，否则将不能提交！')
              return
            }
            if (obj.val_start === '' && obj.val_end === '') {
              this.$message.error('开始值和结束值均未填，不能提交！')
              return
            }
            const arr = []
            const rate_arr = []
            for (let i = 0; i < float_setting.length; i++) {
              if (float_setting[i].job_id === obj.job_id && float_setting[i].level_id === obj.level_id) {
                const tempArr = []
                tempArr[0] = float_setting[i].val_start ? float_setting[i].val_start : 'min'
                tempArr[1] = float_setting[i].val_end ? float_setting[i].val_end : 'max'
                arr.push(tempArr)
                rate_arr.push(float_setting[i])
              }
            }
            let total_rate = 0
            for (let k = 0; k < rate_arr.length; k++) {
              if (parseFloat(rate_arr[k].rate) < 0 || parseFloat(rate_arr[k].rate) > 100) {
                this.$message.error('权重须在0到100之间！')
                return
              } else {
                total_rate = total_rate + parseFloat(rate_arr[k].rate)
                if ((this.ruleForm.val_type === '1' || this.ruleFormReverse.type === '1') && (total_rate > 100 || total_rate < 0)) {
                  this.$message.error('同类型配置权重和须在0到100之间！')
                  return
                }
              }
            }
            let len = arr.length
            while (len > 0) {
              for (let j = 0; j < arr.length - 1; j++) {
                if (this.copy(arr[j], arr[j + 1])) {
                  this.$message.error('存在交叉数据的问题，请认真核对，否则不能提交！')
                  return
                }
              }
              len--
            }
          }
        }
      },

      equals(o1, o2) {
        if (o1.job_id === o2.job_id && o1.level_id === o2.level_id && (o1.isDelete !== '0' && o2.isDelete !== '0')) {
          return 1
        } else {
          return 0
        }
      },
      checkArr(obj) {
        const relation = []
        if (((obj.val_start && obj.rule1) || (!obj.val_start && !obj.rule1)) && ((obj.val_end && obj.rule2) || (!obj.val_end && !obj.rule2))) {
          if (obj.val_start && obj.val_end && parseFloat(obj.val_start) >= parseFloat(obj.val_end)) {
            this.$message.error('存在开始值大于或等于结束值的情况，不能提交！')
            return null
          }
          if (obj.val_start === '' && obj.val_end === '') {
            this.$message.error('开始值和结束值均未填，不能提交！')
            return null
          }
          relation[0] = obj.val_start ? obj.val_start : 'min'
          relation[1] = obj.val_end ? obj.val_end : 'max'
          return relation
        } else {
          this.$message.error('存在开始值或结束值与符号不匹配的情况，不能提交！')
          return null
        }
      },
      deleteItem(arr, obj) {
        if (arr.length < 1) {
          arr[0] = obj[0]
          arr[1] = obj[1]
        } else {
          arr.indexOf(obj[0]) > -1 ? arr.splice(arr.indexOf(obj[0]), 1) : arr.push(obj[0])
          arr.indexOf(obj[1]) > -1 ? arr.splice(arr.indexOf(obj[1]), 1) : arr.push(obj[1])
        }
        return arr
      },
      checkForm(obj, str) {
        if (!obj.name || !obj.val_type) {
          return { 'code': false, 'message': '必填项不能留空白！' }
        }
        if ((this.ruleForm.type === '0' && str === '0') || (this.ruleFormReverse.type === '0' && str === '1')) { // 基础配置
          if (obj.base_setting.length === 0) {
            return { 'code': true, 'message': '没有确立关系！' }
          }
          const base_setting = obj.base_setting
          let len = base_setting.length
          let count_copy = 0
          for (let a = 0; a < base_setting.length; a++) {
            if (isNaN(base_setting[a].val)) {
              return { 'code': false, 'message': '存在非数值类的值，请仔细检查！' }
            }
          }
          while (len > 1) {
            for (let i = len - 1; i > 0; i--) {
              count_copy = count_copy + this.equals(base_setting[i - 1], base_setting[len - 1])
              if (count_copy > 0) {
                return { 'code': false, 'message': '存在重复项，请仔细检查！' }
              }
            }
            len--
          }
          return { 'code': true, 'message': '校验内容无误！' }
        }

        if ((this.ruleForm.type === '1' && str === '0') || (this.ruleFormReverse.type === '1' && str === '1')) { // 浮动配置
          if (obj.float_setting.length === 0) {
            return { 'code': true, 'message': '没有确立关系！' }
          }
          const float_setting = obj.float_setting
          for (let a = 0; a < float_setting.length; a++) {
            if (isNaN(float_setting[a].val_start) || isNaN(float_setting[a].val_end) || isNaN(float_setting[a].val)) {
              return { 'code': false, 'message': '存在非数值类的值，请仔细检查！' }
            }
            if (isNaN(float_setting[a].rate)) {
              return { 'code': false, 'message': '权重为非数值类型，请检查！' }
            } else {
              if (parseFloat(float_setting[a].rate) < 0 || parseFloat(float_setting[a].rate) > 100) {
                return { 'code': false, 'message': '权重为超出0到100的范围，请检查！' }
              }
            }
          }
          const objArr = []
          for (let i = 0; i < float_setting.length; i++) {
            let flag = false
            for (let j = 0; j < objArr.length; j++) {
              if (objArr[j].job_id === float_setting[i].job_id && objArr[j].level_id === float_setting[i].level_id) {
                if (this.checkArr(float_setting[i])) {
                  objArr[j].arr.push(this.checkArr(float_setting[i]))
                  objArr[j].rate.push(float_setting[i].rate)
                  flag = true
                } else {
                  this.$message.error('匹配关系存在错误，请核对并修正！')
                  return { 'code': false, 'message': '匹配关系存在错误，请核对并修正！' }
                }
              }
            }
            if (!flag) {
              if (this.checkArr(float_setting[i])) {
                const tempArr1 = []
                tempArr1.push(this.checkArr(float_setting[i]))
                const tempArr2 = []
                tempArr2.push(float_setting[i].rate)
                objArr.push({ 'job_id': float_setting[i].job_id, 'level_id': float_setting[i].level_id, 'arr': tempArr1, 'rate': tempArr2 })
              } else {
                this.$message.error('匹配关系存在错误，请核对并修正！')
                return { 'code': false, 'message': '匹配关系存在错误，请核对并修正！' }
              }
            }
          }
          let isLack = true
          let count = 0
          const count_arr = []
          let rate_flag = true
          for (let o = 0; o < objArr.length; o++) {
            const arr = objArr[o].arr
            const arr_rate = objArr[o].rate
            let count_rate = 0
            for (let q = 0; q < arr_rate.length; q++) {
              count_rate = count_rate + parseFloat(arr_rate[q])
            }
            if (count_rate > 100 && obj.val_type === '1') { // 值类型为系数时，权重和大于100则提示错误
              this.$message.error('同条件配置权重超出范围，请认真核对并修改！')
              return { 'code': false, 'message': '同条件配置权重超出范围，请认真核对并修改！' }
            } else if (count_rate === 100) {
              rate_flag = rate_flag && true
            } else {
              rate_flag = false
            }

            let length = arr.length
            let tempArr = []
            while (length > 0) { // 冒泡判断是否有交叉数据
              for (let k = length - 1; k > 0; k--) {
                if (this.copy(arr[k - 1], arr[k])) {
                  this.$message.error('存在交叉数据的问题，请认真核对并修改！')
                  return { 'code': false, 'message': '存在交叉数据的问题，请认真核对并修改！' }
                }
              }
              length--
            }
            for (let p = 0; p < arr.length; p++) {
              tempArr = this.deleteItem(tempArr, arr[p])
            }
  
            count_arr.push(tempArr)
          }
          for (let q = 0; q < count_arr.length; q++) {
            if (count_arr[q].indexOf('min') > -1) {
              count_arr[q].splice(count_arr[q].indexOf('min'), 1)
            }
            if (count_arr[q].indexOf('max') > -1) {
              count_arr[q].splice(count_arr[q].indexOf('max'), 1)
            }
            if (count_arr[q].length > 0) {
              isLack = false
              count = count + Math.floor((count_arr[q].length + 1) / 2)
            } else {
              isLack = true && isLack
            }
          }
          //  提交数据
          let isCross = true
          if (!isLack) {
            console.log('还有一些区间没有包括到', count)
            if (window.confirm('至少还有' + count + '个条件没有包含到，是否继续提交')) {
              isCross = isCross && true
            } else {
              isCross = false
            }
          }
          if (!rate_flag && obj.val_type === '1') { // 值类型为系数，校验权重不大于100
            if (window.confirm('部分配置权重和小于100，是否继续提交')) {
              isCross = isCross && true
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
        if ((this.ruleForm.type === '2' && str === '0') || (this.ruleFormReverse.type === '2' && str === '1')) { // 其他金额配置
          const value = obj.value
          if (value.trim() === '') {
            return { 'code': false, 'message': '金额不能为空' }
          }
          if (isNaN(value)) {
            return { 'code': false, 'message': '金额配置有问题' }
          } else {
            return { 'code': true, 'message': '校验内容无误！' }
          }
        }
      },
      submitForm(str) { // 提交表单
        if (str === 'ruleForm') {
          const obj = this.checkForm(this.ruleForm, '0')// 核对是否已经存在对应关系
          if (obj.code) {
            const datas = {}
            datas.name = this.ruleForm.name
            datas.type = this.ruleForm.type
            datas.val_type = this.ruleForm.val_type
            datas.remark = this.ruleForm.remark
            datas.setting_id = null
            // 创建人信息
            datas.creator_id = localStorage.getItem('agentId') ? localStorage.getItem('agentId') : ''
            datas.modifier_id = localStorage.getItem('agentId') ? localStorage.getItem('agentId') : ''
            datas.creator_realname = localStorage.getItem('agentName') ? localStorage.getItem('agentName') : ''
            datas.modifier_realname = localStorage.getItem('agentName') ? localStorage.getItem('agentName') : ''

            if (this.ruleForm.type === '0') { // 基本配置
              datas.base_setting = this.ruleForm.base_setting
              for (let i = 0; i < datas.base_setting.length; i++) {
                datas.base_setting[i].id = null
              }
              addBaseLawConfig(datas).then(res1 => {
                console.log(res1)
              })
            }
            if (this.ruleForm.type === '1') { // 浮动配置
              datas.float_setting = this.ruleForm.float_setting
              for (let i = 0; i < datas.float_setting.length; i++) {
                datas.float_setting[i].id = null
              }
              addBaseLawConfig(datas).then(res2 => {
                console.log(res2)
              })
            }
            if (this.ruleForm.type === '2') { // 其他金额配置
              const obj = []
              obj[0] = { 'val': this.ruleForm.value }
              datas.other_money_setting = obj
              addBaseLawConfig(datas).then(res3 => {
                console.log(res3)
              })
            }
          } else {
            this.$message.error(obj.message)
          }
        }
        if (str === 'ruleFormReverse') {
          // const tempData = { 'name': this.ruleFormReverse.name,
          //   'remark': this.ruleFormReverse.remark,
          //   'val_type': this.ruleFormReverse.val_type,
          //   'base_setting': this.tempDeleteArr.concat(this.ruleFormReverse.base_setting) }
          const obj = this.checkForm(this.ruleFormReverse, '1')// 核对是否已经存在对应关系
          if (obj.code) {
            const datas = {}
            datas.setting_id = this.ruleFormReverse.setting_id
            datas.enabled = this.ruleFormReverse.enabled
            datas.name = this.ruleFormReverse.name
            datas.remark = this.ruleFormReverse.remark
            datas.type = this.ruleFormReverse.type
            datas.val_type = this.ruleFormReverse.val_type

            // 修改人信息
            datas.modifier_id = localStorage.getItem('agentId') ? localStorage.getItem('agentId') : ''
            datas.modifier_realname = localStorage.getItem('agentName') ? localStorage.getItem('agentName') : ''

            if (this.ruleFormReverse.type === '0') { // 基本配置
              datas.base_setting = this.ruleFormReverse.base_setting
              updateBaseLawConfig(datas.setting_id, datas).then(res1 => {
                console.log(res1, 'res1')
              })
            }
            if (this.ruleFormReverse.type === '1') { // 浮动配置
              datas.float_setting = this.ruleFormReverse.float_setting
              updateBaseLawConfig(datas.setting_id, datas).then(res2 => {
                console.log(res2, 'res2')
              })
            }
            if (this.ruleFormReverse.type === '2') { // 其他金额配置
              const obj = []
              obj[0] = { 'val': this.ruleFormReverse.value }
              datas.other_money_setting = obj
              updateBaseLawConfig(datas.setting_id, datas).then(res3 => {
                console.log(res3, 'res3')
              })
            }
          } else {
            this.$message.error(obj.message)
          }
        }
      },
      deleteRow(str, obj) { // 删除表栏
        if (str === 'ruleFormReverse') {
          const arr = this.ruleFormReverse.base_setting
          for (let i = 0; i < arr.length; i++) {
            if (arr[i] === obj) {
              // if (obj.isDelete === '0' && obj.relation_id !== null) { // 如果是已经存在的关系，则做假删除
              if (obj.isDelete === '0') { // 从原有基础上假删除
                obj.isDelete = '1'
                this.tempDeleteArr.push(obj)
              }
              this.ruleFormReverse.base_setting.splice(i, 1)
            }
          }
        }
        if (str === 'ruleForm') {
          const arr = this.ruleForm.base_setting
          for (let i = 0; i < arr.length; i++) {
            if (arr[i] === obj) {
              this.ruleForm.base_setting.splice(i, 1)
            }
          }
        }
        if (str === 'ruleFormArray') {
          const arr = this.ruleForm.float_setting
          for (let i = 0; i < arr.length; i++) {
            if (arr[i] === obj) {
              this.ruleForm.float_setting.splice(i, 1)
            }
          }
        }
      },
      addRuleFormReverse(type) {
        if (type === '0') {
          const base_setting = this.ruleFormReverse.base_setting
          for (let i = 0; i < base_setting.length; i++) {
            if (base_setting[i].job_id === '' && base_setting[i].level_id === '' && base_setting[i].isDelete !== 0) {
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
            val: '1'
          }
          this.ruleFormReverse.base_setting.push(item)
        }
        if (type === '1') { // 浮动配置
          const float_setting = this.ruleFormReverse.float_setting
          for (let i = 0; i < float_setting.length; i++) {
            if (float_setting[i].job_id === '' && float_setting[i].level_id === '') {
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
            val_start: '',
            val_end: '',
            val: '1',
            rule1: '<',
            rule2: '<',
            rate: 100
          }
          this.ruleFormReverse.float_setting.push(item)
        }
      },
      addRuleForm(str) { // 添加表栏
        if (str === '0') { // 基础配置
          const base_setting = this.ruleForm.base_setting
          for (let i = 0; i < base_setting.length; i++) {
            if (base_setting[i].job_id === '' && base_setting[i].level_id === '') {
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
            val: '1'
          }
          this.ruleForm.base_setting.push(item)
        }
        if (str === '1') { // 浮动配置
          const float_setting = this.ruleForm.float_setting
          for (let i = 0; i < float_setting.length; i++) {
            if (float_setting[i].job_id === '' && float_setting[i].level_id === '') {
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
            val_start: '',
            val_end: '',
            val: '1',
            rule1: '<',
            rule2: '<',
            rate: 100
          }
          this.ruleForm.float_setting.push(item)
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
              remark: '',
              base_setting: [{
                job_id: '',
                level_id: '',
                val: '1'
              }],
              float_setting: [{
                job_id: '',
                level_id: '',
                val_start: '',
                val_end: '',
                val: '1',
                rule1: '<',
                rule2: '<',
                rate: 100
              }],
              value: ''
            }
            break
          case 'ruleFormReverse':
            queryOne(this.ruleFormReverse.setting_id).then(res => {
              if (res.data.result) {
                this.ruleFormReverse = res.data.result
                if (res.data.result.type === '2') {
                  this.ruleFormReverse.value = res.data.result.other_money_setting[0].val
                }
              }
            })
            break
          case 'ruleFormDetail':
            break
        }
      },
      handleDelete(row) { //
        MessageBox.confirm('确定执行删除操作吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const setting_id = row.setting_id
          delBaseLawConfig(null, setting_id).then(res => {
            console.log(res, 'res')
          })
        })
      },
      handleCopy(row) {
        this.reverseRow = row
        this.dialogFormVisible = true
        queryOne(row.setting_id).then(res => {
          if (res.data.result) {
            this.ruleForm = res.data.result
            if (res.data.result.type === '2') {
              this.ruleForm.value = res.data.result.other_money_setting[0].val
            }
          }
        })
      },
      handleQuery(row) {
        this.reverseRow = row
        this.dialogFormVisibleDetail = true
        queryOne(row.setting_id).then(res => {
          if (res.data.result) {
            this.ruleFormDetail = res.data.result
            if (res.data.result.type === '2') {
              this.ruleFormDetail.value = res.data.result.other_money_setting[0].val
            }
          }
        })
      },
      handleClick(row) {
        this.reverseRow = row
        this.dialogFormVisibleReverse = true
        queryOne(row.setting_id).then(res => {
          if (res.data.result) {
            this.ruleFormReverse = res.data.result
            if (res.data.result.type === '2') {
              this.ruleFormReverse.value = res.data.result.other_money_setting[0].val
            }
          }
        })
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
      },
      handleSizeChange(val) {
        this.formInline.pageNo = 1
        this.formInline.pageSize = val
        this.formInline.modifierTimeStart = this.timeValue ? this.timeValue[0] : null
        this.formInline.modifierTimeEnd = this.timeValue ? this.timeValue[1] : null
        this.pagination.pageNo = 1
      },
      handleCurrentChange(val) {
        this.formInline.pageNo = val
        this.formInline.modifierTimeStart = this.timeValue ? this.timeValue[0] : null
        this.formInline.modifierTimeEnd = this.timeValue ? this.timeValue[1] : null
      }
    }
  }
</script>
<style>

</style>
