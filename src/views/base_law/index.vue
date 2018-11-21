<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-form :inline="true" class="demo-form-inline" size="small">
          <el-form-item label="岗位:">
             <el-select v-model="formInline.job_id" placeholder="岗位">
                <el-option label="所有岗位" value=""></el-option>
                <el-option label="坐席" value="0"></el-option>
                <el-option label="质检" value="1"></el-option>
                <!-- <el-option v-for="item in allJobs" :key="item.job_id" :label="item.job_name" :value="item.job_name"></el-option> -->
            </el-select>
          </el-form-item>
          <el-form-item label="职级:">
             <el-select v-model="formInline.level_id" placeholder="职级">
                <el-option label="所有职级" value=""></el-option>
                <el-option label="一级" value="0"></el-option>
                <el-option label="二级" value="1"></el-option>
                <!-- <el-option v-for="item in allLevels" :key="item.level_id" :label="item.level_name" :value="item.level_name"></el-option> -->
            </el-select>
          </el-form-item>
          <el-form-item label="类目名称:">
            <el-input placeholder="类目名称（限长45字符）" v-model="formInline.name" maxlength="45"></el-input>
          </el-form-item>
          <el-form-item label="值类型:">
             <el-select v-model="formInline.val_type" placeholder="值类型">
                <el-option label="所有类型" value=""></el-option>
                <el-option label="金额" value="0"></el-option>
                <el-option label="系数" value="1"></el-option>
                <!-- <el-option v-for="item in allValueTypes" :key="item.val_type" :label="item.val_name" :value="item.val_name"></el-option> -->
            </el-select>
          </el-form-item>
          <el-form-item label="值区间:">
              <el-input placeholder="最小值" v-model="formInline.min" maxlength="10" style="width:100px"></el-input>--
              <el-input placeholder="最大值" v-model="formInline.max" maxlength="10" style="width:100px"></el-input>
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
            label="岗位id"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{scope.row.job_id}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="job_name"
            label="岗位"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.job_name }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="name"
            label="类目名称"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.name }}
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
            prop="value"
            label="值"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.value }}
            </template>
          </el-table-column>
          
          <el-table-column
            align="center"
            prop="modifier"
            label="操作人"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.modifier }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="updateTime"
            label="操作时间"
            width="155"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="150">
            <template slot-scope="scope">
              <el-button @click="changeStatus(scope.row)" type="text" size="small" v-if="scope.row.isDelete==='0'"> 禁用</el-button>
              <el-button @click="changeStatus(scope.row)" type="text" size="small" v-if="scope.row.isDelete==='2'"> 启用</el-button>
              <el-button @click="handleClick(scope.row)" type="text" size="small"> 修改</el-button>
              <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row style="margin-top:1%;">
        <el-col :span="10">
          <el-button type="primary" size="small" @click="addRuleFormPage()">新建</el-button>
          <el-button type="danger" size="small" @click="deleteAll()">批量删除</el-button>
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
    <el-dialog title="新增岗位类目" :visible.sync="dialogFormVisible" width="60%" @close="resetForm('ruleForm')" append-to-body>
      <el-form :model="ruleForm" ref="ruleForm" label-width="150px" class="demo-ruleForm">
        <el-row>
          <el-col :span="17">
            <el-form-item label="类目名称" prop="name" :rules="{ required: true, message: '请填写类目名称', trigger: 'blur' }">
              <el-input placeholder="此处填写类目名称，上限50字符"  maxlength="50" v-model='ruleForm.name' @change="changeName('ruleForm')">{{ruleForm.name}}</el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="类目名称描述">
          <textarea v-model='ruleForm.description' placeholder="此处填写类目名称简单描述，上限100字符" maxlength="100" cols="63" rows="4">{{ruleForm.description}}</textarea>
        </el-form-item>
        <el-form-item label="值类型"  :rules="{required:true}">
          <el-radio-group v-model='ruleForm.val_type' size="mini">
            <el-radio-button label='0'>金额</el-radio-button>
            <el-radio-button label='1'>系数</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <template>
          <div style="margin-bottom:1%">
           <el-button type="primary" @click="addRuleForm()">添加栏</el-button>
          </div>
        <el-table
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
            prop="name"
            label="类目名称"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
               {{scope.row.name}}
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
      </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="resetForm('ruleForm')">重置</el-button>
        <el-button @click="resetForm('ruleForm');dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
     <el-dialog title="修改岗位类目" :visible.sync="dialogFormVisibleReverse" width="60%" @close="resetForm('ruleFormReverse')" append-to-body>
      <el-form :model="ruleFormReverse" ref="ruleFormReverse" label-width="150px" class="demo-ruleFormReverse">
        <el-row>
          <el-col :span="17">
            <el-form-item label="类目名称" prop="name" :rules="{ required: true, message: '请填写类目名称', trigger: 'blur' }">
              <el-input placeholder="此处填写类目名称，上限50字符"  maxlength="50" v-model='ruleFormReverse.name' @change="changeName('ruleFormReverse')">{{ruleFormReverse.name}}</el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="类目名称描述">
          <textarea v-model='ruleFormReverse.description' placeholder="此处填写类目名称简单描述，上限100字符" maxlength="100" cols="63" rows="4">{{ruleFormReverse.description}}</textarea>
        </el-form-item>
        <el-form-item label="值类型"  :rules="{required:true}">
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
            prop="name"
            label="类目名称"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
               {{scope.row.name}}
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
     <el-dialog title="查询岗位类目" :visible.sync="dialogFormVisibleDetail" width="60%" @close="resetForm('ruleFormDetail')" append-to-body>
      <el-form :model="ruleFormDetail" ref="ruleFormDetail" label-width="150px" class="demo-ruleFormDetail">
        <el-row>
          <el-col :span="17">
            <el-form-item label="类目名称" prop="name" >
              <span>{{ruleFormDetail.name}}</span>
              <!-- <el-input placeholder="此处填写类目名称，上限50字符"  maxlength="50" v-model='ruleFormDetail.name' readonly="readonly">{{ruleFormDetail.name}}</el-input> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="类目名称描述">
          <textarea v-model='ruleFormDetail.description' placeholder="此处填写类目名称简单描述，上限100字符" maxlength="100" cols="63" rows="4" readonly>{{ruleFormDetail.description}}</textarea>
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
            prop="name"
            label="类目名称"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
               {{scope.row.name}}
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
  import { findAllAccount } from '@/api/base_law'
  import { Message, MessageBox } from 'element-ui'
  import { formatDateTime } from '@/utils/tools'
import { duration } from 'moment'

export default {
    name: 'base_law',
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
          val_type: '0',
          description: '',
          list: [{
            job_id: '',
            name: '',
            level_id: '',
            value: '1'
          }]
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
        if (str === 'ruleFormReverse') {
          list = this.ruleFormReverse.list
        }
        let count = 0
        for (let i = 0; i < list.length; i++) {
          if (list[i].job_id === obj.job_id && list[i].level_id === obj.level_id) {
            count++
            if (count > 1) { // 说明已经存在现有关系，尝试删除最新添加的空白栏
              this.$message.error('已存在此对应关系，如不修改，则会导致不能提交！')
            }
          }
        }
      },
      changeName(obj) { // 改变类目名称（标题），相应改变表格中的name
        let name = ''
        let list = []
        switch (obj) {
          case 'ruleFormReverse':
            name = this.ruleFormReverse.name
            list = this.ruleFormReverse.list
            break
          case 'ruleForm':
            name = this.ruleForm.name
            list = this.ruleForm.list
            break
        }
        for (let i = 0; i < list.length; i++) {
          list[i].name = name
        }
      },
      equals(o1, o2) {
        if (o1.job_id === o2.job_id && o1.level_id === o2.level_id && (o1.isDelete !== '1' && o2.isDelete !== '1')) {
          return 1
        } else {
          return 0
        }
      },
      checkForm(obj) {
        if (!obj.name || !obj.val_type) {
          return { 'code': false, 'message': '必填项不能留空白！' }
        }
        if (obj.list.length === 0) {
          return { 'code': true, 'message': '没有确立关系！' }
        }
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
      addRuleForm() { // 添加表栏
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
          name: this.ruleForm.name,
          level_id: '',
          value: '1'
        }
        this.ruleForm.list.push(item)
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
              description: '',
              val_type: '0',
              list: [{
                job_id: '',
                name: '',
                level_id: '',
                value: '1'
              }]
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
