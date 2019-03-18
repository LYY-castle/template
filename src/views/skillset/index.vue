<template>
  <div class="app-container work-bench">
    <div>
      <el-row :gutter="5">
         <el-collapse accordion>
          <el-collapse-item  name="1" style="color:red;">
            <template slot="title">
              <b style="margin-left:1%;font-size:17px;">筛选条件<i class="el-icon-d-caret"></i></b>
            </template>
            <el-form :inline="true" class="demo-form-inline" size="small" style="margin-left:1%;">
              <el-form-item label="技能组名称:">
                <el-input placeholder="技能组名称（限长45字符）" v-model="formInline.name" maxlength="45"></el-input>
              </el-form-item>
              <el-form-item label="技能组编号:">
                <el-input placeholder="技能组编号（限长45字符）" v-model="formInline.code" maxlength="45"></el-input>
              </el-form-item>
              <el-form-item label="呼叫类型:">
                <el-select size="small" v-model="formInline.bondType" placeholder="呼叫类型">
                  <el-option label="请选择" value=""></el-option>
                  <el-option label="呼出坐席" value="0"></el-option>
                  <el-option label="呼入坐席" value="1"></el-option>
                  <el-option label="混合坐席" value="2"></el-option>                
                </el-select>
              </el-form-item>
              <el-form-item label="操作人:">
                <el-input placeholder="操作人（限长45字符）" v-model="formInline.modifier" maxlength="45"></el-input>
              </el-form-item>
              <el-form-item label="操作时间：">
                <el-date-picker
                  v-model="formInline.timeValue"
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
          </el-collapse-item>
        </el-collapse>
      </el-row>
    </div>
    <div class="table-container">
      <el-row>
        <div class="work-title-style font14 bold">技能组清单</div>
      </el-row>
      <el-row style="margin-top:1%;">
        <el-col :span="10">
          <el-button type="primary" size="small" @click="addRuleFormPage()">新建</el-button>
          <el-button type="danger" size="small" @click="deleteAll()">批量删除</el-button>
        </el-col>
      </el-row>
      <el-row style="margin-top:20px;">
        <el-col>
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
              label="技能组名称"
              prop="name"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{scope.row.name}}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="code"
              label="技能组编号"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{scope.row.code}}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="bondType"
              label="呼叫类型"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{showBondType(scope.row.bondType)}}
              </template>
            </el-table-column>
            <!-- <el-table-column
              align="center"
              prop="priority"
              label="优先级"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{scope.row.priority}}
              </template>
            </el-table-column> -->
   
            <el-table-column
              align="center"
              prop="remarks"
              label="备注"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{ scope.row.remarks }}
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
              <template slot-scope="scope">
                {{ showTime(scope.row.updateTime) }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="操作"
              width="180">
              <template slot-scope="scope">
                <el-button @click="handleQuery(scope.row)" type="text" size="small"> 查看</el-button>
                <el-button @click="handleEdit(scope.row)" type="text" size="small"> 修改</el-button>
                <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
       <el-row style="margin-top:1%;">
        <el-col :span="24">
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
   <el-dialog title="新增技能组" :visible.sync="dialogFormVisible" width="60%" @close="resetForm('ruleForm')" append-to-body >
      
      <el-form :model="ruleForm" ref="ruleForm" label-width="150px" class="demo-ruleForm" size="small" :rules="rules">
       <el-card class="box-card downline">
        <div slot="header" class="clearfix">
          <span><h2>技能组相关信息</h2></span>
        </div>
        <el-row>
          <el-col>
            <el-form-item style="width:40%;" label="技能组名称" prop="name" >
              <el-input size="small" placeholder="此处填写技能组名称，上限50字符"  maxlength="50" v-model='ruleForm.name' >{{ruleForm.name}}</el-input>
            </el-form-item>
             <el-form-item label="技能组编号" style="width:40%;" prop="code">
               <el-input size="small" placeholder="此处填写技能组编号，上限50字符"  maxlength="50" v-model='ruleForm.code' >{{ruleForm.code}}</el-input>
            </el-form-item>
          </el-col>
        </el-row>
    
        <el-form-item label="呼叫类型" prop="bondType" >
            <el-select size="small" v-model="ruleForm.bondType" >
              <el-option label="呼出坐席" value="0"></el-option>
              <el-option label="呼入坐席" value="1"></el-option>
              <el-option label="混合坐席" value="2"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="有效性" prop="enabled" >
          <el-select size="small" v-model="ruleForm.enabled" >
            <el-option label="有效" value="1"></el-option>
            <el-option label="无效" value="0"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="优先级" style="width:40%;" prop="priority" >
            <el-input size="small" placeholder="此处填写优先级，上限5字符"  maxlength="5" v-model='ruleForm.priority' >{{ruleForm.priority}}</el-input>
        </el-form-item> -->
        <el-form-item label="备注">
          <textarea v-model='ruleForm.remarks' placeholder="此处填写配置名称简单备注，上限100字符" style="resize:none;" maxlength="100" cols="63" rows="4">{{ruleForm.remarks}}</textarea>
        </el-form-item>
       </el-card>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm');addSkillSet(ruleForm)">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改技能组" :visible.sync="dialogFormVisibleReverse" width="60%" @close="resetForm('ruleFormReverse')" append-to-body >
      
      <el-form :model="ruleFormReverse" ref="ruleFormReverse" label-width="150px" class="demo-ruleFormReverse" size="small" :rules="rules">
       <el-card class="box-card downline">
        <div slot="header" class="clearfix">
          <span><h2>技能组相关信息</h2></span>
        </div>
        <el-row>
          <el-col>
            <el-form-item style="display:none;" label="技能组id" prop="id" >
              {{ruleFormReverse.id}}
            </el-form-item>
            <el-form-item style="width:40%;" label="技能组名称" prop="name" >
              <el-input size="small" placeholder="此处填写技能组名称，上限50字符"  maxlength="50" v-model='ruleFormReverse.name' >{{ruleFormReverse.name}}</el-input>
            </el-form-item>
             <el-form-item label="技能组编号" style="width:40%;" prop="code" >
               <el-input size="small" placeholder="此处填写技能组编号，上限50字符"  maxlength="50" v-model='ruleFormReverse.code' >{{ruleFormReverse.code}}</el-input>
            </el-form-item>
          </el-col>
        </el-row>
    
        <el-form-item label="呼叫类型"  prop="bondType">
            <el-select size="small" v-model="ruleFormReverse.bondType" >
              <el-option label="呼出坐席" value="0"></el-option>
              <el-option label="呼入坐席" value="1"></el-option>
              <el-option label="混合坐席" value="2"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="有效性"  prop="enabled" >
          <el-select size="small" v-model="ruleFormReverse.enabled" >
            <el-option label="有效" value="1"></el-option>
            <el-option label="无效" value="0"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="优先级" style="width:40%;" prop="priority" >
        
            <el-input size="small" placeholder="此处填写优先级，上限5字符"  maxlength="5" v-model='ruleFormReverse.priority' >{{ruleFormReverse.priority}}</el-input>
        </el-form-item> -->
        <el-form-item label="备注">
          <textarea v-model='ruleFormReverse.remarks' placeholder="此处填写配置名称简单备注，上限100字符" style="resize:none;" maxlength="100" cols="63" rows="4">{{ruleFormReverse.remarks}}</textarea>
        </el-form-item>
       </el-card>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleFormReverse');editSkillSet(ruleFormReverse)">确 定</el-button>
        <el-button @click="dialogFormVisibleReverse = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="查看技能组" :visible.sync="dialogFormVisibleDetail" width="60%" @close="resetForm('ruleFormDetail')" append-to-body >
      
      <el-form :model="ruleFormDetail" ref="ruleFormDetail" label-width="150px" class="demo-ruleFormDetail" size="small">
       <el-card class="box-card downline">
        <div slot="header" class="clearfix">
          <span><h2>技能组相关信息</h2></span>
        </div>
        <el-row>
          <el-col>
            <el-form-item style="display:none;" label="技能组id" prop="id" >
              {{ruleFormDetail.id}}
            </el-form-item>
            <el-form-item style="width:40%;" label="技能组名称" prop="name" >
              <el-input disabled size="small" placeholder="此处填写技能组名称，上限50字符"  maxlength="50" v-model='ruleFormDetail.name' >{{ruleFormDetail.name}}</el-input>
            </el-form-item>
             <el-form-item label="技能组编号" style="width:40%;" prop="code" >
               <el-input disabled size="small" placeholder="此处填写技能组编号，上限50字符"  maxlength="50" v-model='ruleFormDetail.code' >{{ruleFormDetail.code}}</el-input>
            </el-form-item>
          </el-col>
        </el-row>
    
        <el-form-item label="呼叫类型" >
            <el-select size="small" v-model="ruleFormDetail.bondType" placeholder="呼叫类型" disabled >
              <el-option label="呼出坐席" value="0"></el-option>
              <el-option label="呼入坐席" value="1"></el-option>
              <el-option label="混合坐席" value="2"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="有效性" >
          <el-select size="small" v-model="ruleFormDetail.enabled" placeholder="有效性" disabled >
            <el-option label="有效" value="1"></el-option>
            <el-option label="无效" value="0"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="优先级" style="width:40%;" prop="priority" >
            <el-input size="small" disabled placeholder="此处填写优先级，上限5字符"  maxlength="5" v-model='ruleFormDetail.priority' >{{ruleFormDetail.priority}}</el-input>
        </el-form-item> -->
        <el-form-item label="备注">
          <textarea v-model='ruleFormDetail.remarks' disabled placeholder="此处填写配置名称简单备注，上限100字符" style="resize:none;" maxlength="100" cols="63" rows="4">{{ruleFormReverse.remarks}}</textarea>
        </el-form-item>
       </el-card>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleFormDetail');dialogFormVisibleDetail= false">返回</el-button>
      </div>
    </el-dialog>


  </div>

  



  </div>
</template>

<script>
// import { Message, MessageBox } from 'element-ui'
import { formatDateTime, sec_to_time } from '@/utils/tools'
import { querySkillSetList, addSkillSet, queryOne, editSkillSet, hiddenOne, deleteOne, deleteBatch } from '@/api/skillset'
import moment from 'moment'
export default {
  name: 'ord_workingset',
  data() {
    return {
      formInline: {},
      pagination: {},
      tableData: [],
      timeValue: '',
      dialogFormVisible: false,
      dialogFormVisibleReverse: false,
      dialogFormVisibleDetail: false,
      ruleForm: {
        name: '',
        code: '',
        enabled: '1',
        bondType: '0',
        // priority: '',
        remarks: ''
      },
      ruleFormReverse: {
        id: '',
        name: '',
        code: '',
        enabled: '',
        bondType: '',
        // priority: '',
        remarks: ''
      },
      ruleFormDetail: {
        id: '',
        name: '',
        code: '',
        enabled: '',
        bondType: '',
        // priority: '',
        remarks: ''
      },
      validate: false,
      rules: {
        name: [{ required: true, message: '请填写技能组名称', trigger: 'blur' }],
        code: [{ required: true, trigger: 'blur', message: '请填写技能组编号' }],
        bondType: [{ required: true, trigger: 'change', message: '请选择呼叫类型' }],
        enabled: [{ required: true, trigger: 'change', message: '请选择有效性' }]
      }
    }
  },
  destroyed() {

  },
  mounted() {
    this.searchInfo(this.formInline)
  },
  methods: {
    resetFormInline() {
      this.formInline = {}
    },
    showBondType(str) {
      let result = ''
      switch (str) {
        case '0':result = '呼出坐席'
          break
        case '1':result = '呼入坐席'
          break
        case '2':result = '混合坐席'
          break
      }
      return result
    },
    showTime(obj) {
      return formatDateTime(obj) ? formatDateTime(obj) : ''
    },
    deleteAll() {
      if (typeof this.multipleSelection === 'undefined') {
        this.$message.error('还未选中条目！')
        return
      }
      const ids = []
      this.multipleSelection.map(function(item, index) {
        ids.push(item.id)
      })
      if (ids.length < 1) {
        this.$message.error('还未选中需要删除的条目！')
        return
      }
      if (window.confirm('确定要执行批量删除吗？')) {
        const obj = {}
        obj.operatorId = localStorage.getItem('agentId')
        obj.operatorName = localStorage.getItem('agentName')
        obj.ids = ids
        deleteBatch(obj).then(res => {
          if (res.data.code === 1) {
            this.searchInfo(this.formInline)
          }
        })
      }
    },
    handleDelete(obj) {
      if (window.confirm('确认删除此项？')) {
        const id = obj.id
        const operatorId = localStorage.getItem('agentId')
        hiddenOne({ 'id': id, 'operatorId': operatorId, 'delFlag': '0' }).then(res => {
          if (res.data.code === 1) {
            this.searchInfo(this.formInline)
          }
        })
      }
    },
    handleQuery(obj) {
      this.dialogFormVisibleDetail = true
      const id = obj.id
      queryOne({ 'id': id }).then(res => {
        if (res.data.code === '1') {
          this.ruleFormDetail = res.data.data
        }
      })
    },
    handleEdit(obj) {
      this.dialogFormVisibleReverse = true
      const id = obj.id
      queryOne({ 'id': id }).then(res => {
        if (res.data.code === '1') {
          this.ruleFormReverse = res.data.data
        }
      })
    },
    editSkillSet(ruleFormReverse) {
      if (this.validate) {
        ruleFormReverse.operatorId = localStorage.getItem('agentId')
        ruleFormReverse.operatorName = localStorage.getItem('agentName')
        editSkillSet(ruleFormReverse).then(res => {
          if (res.data.code === 1) {
            this.dialogFormVisibleReverse = false
            this.searchInfo(this.formInline)
          } else {
            this.$message(res.data.message)
          }
        })
      } else {
        return false
      }
    },
    addSkillSet(ruleForm) {
      if (this.validate) {
        ruleForm.creator = ruleForm.creator ? ruleForm.creator : localStorage.getItem('agentId')
        ruleForm.operatorId = localStorage.getItem('agentId')
        ruleForm.operatorName = localStorage.getItem('agentName')
        addSkillSet(ruleForm).then(res => {
          if (res.data.code === 1) {
            this.dialogFormVisible = false
            this.resetForm('ruleForm')
            this.searchInfo(this.formInline)
          } else {
            this.$message(res.data.message)
          }
        })
      } else {
        return false
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.validate = true
        } else {
          this.$message.error('请检查是否填写正确')
          this.validate = false
        }
      })
    },
    resetForm(obj) {
      this.$refs[obj].resetFields()
      switch (obj) {
        case 'ruleForm':this.ruleForm = {
          name: '',
          code: '',
          enabled: '1',
          bondType: '0',
          // priority: '',
          remarks: ''
        }
          break
        case 'ruleFormReverse':this.ruleFormReverse = {}
          break
        case 'ruleFormDetail':this.ruleFormDetail = {}
          break
      }
    },
    addRuleFormPage() { // 打开新增页面
      this.dialogFormVisible = true
    },
    searchInfo(obj) {
      const requestParam = {}
      requestParam.name = obj.name ? obj.name : null
      requestParam.code = obj.code ? obj.code : null
      requestParam.bondType = obj.bondType === '' ? null : obj.bondType
      requestParam.modifier = obj.modifier ? obj.modifier : null
      requestParam.modifierTimeStart = obj.timeValue ? obj.timeValue[0] : null
      requestParam.modifierTimeEnd = obj.timeValue ? obj.timeValue[1] : null
      requestParam.pageNo = obj.pageNo ? obj.pageNo : 1
      requestParam.pageSize = obj.pageSize ? obj.pageSize : 10

      querySkillSetList(requestParam).then(res => {
        if (res.data.code === 1) {
          this.tableData = res.data.data
          this.pagination = res.data.pageInfo
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
      this.pagination.pageNo = 1
      this.searchInfo(this.formInline)
    },
    handleCurrentChange(val) {
      this.formInline.pageNo = val
      this.searchInfo(this.formInline)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
@media screen and (min-width: 1281px) and (max-width:1367px){
  .work-bench .font30 {
    font-size: 27px !important;
  }
}
@media all and (min-width:1024px) and (max-width:1280px)  {
  .work-bench .font30 {
    font-size: 25px !important;
  }
}
</style>
