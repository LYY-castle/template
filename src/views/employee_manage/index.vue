<template>
  <div class="app-container">
    <div class="filter-container">
      <el-collapse v-model="formContainerOpen" class="form-container" @change="handleChangeAcitve">
        <el-collapse-item title="筛选条件" name="1">
           <el-form :inline="true" class="demo-form-inline" size="small">
            <el-form-item label="员工姓名：">
              <el-input placeholder="员工姓名（上限45字符）" v-model="formInline.name" maxlength="45"></el-input>
            </el-form-item>
            <el-form-item label="员工工号：">
              <el-input placeholder="员工工号（上限45字符）" v-model="formInline.staffNo" maxlength="45"></el-input>
            </el-form-item>
            <el-form-item label="所属部门：">
              <el-cascader
                v-model="selected_dept_id"
                placeholder="请选择部门"
                :options="visibleDepts"
                :props="org_props"
                show-all-levels
                filterable
                size="small"
                change-on-select
              ></el-cascader>
              <!-- <el-select v-model="formInline.departName" placeholder="所属部门">
                <el-option v-for="item in regionOptions" :key="item.departName" :label="item.departName" :value="item.departName"></el-option>
              </el-select> -->
            </el-form-item>
            <el-form-item label="操作人：">
              <el-input placeholder="操作人（上限45字符）" v-model="formInline.modifierName" maxlength="45"></el-input>
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
              <el-button type="primary" @click="formInline.pageNo = 1;searchStaff(formInline)">查询</el-button>
              <el-button @click="reset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
      <el-row class="table-container">
        <el-row class="margin-bottom-20">
          <div class="font14 bold">员工管理表</div>
        </el-row>
        <el-row class="margin-bottom-20">
          <el-button type="success" size="small"  @click="addStaff">新建</el-button>
          <el-button type="danger" size="small" @click="batchDelVisible=true">批量删除</el-button>
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
              prop="staffNo"
              label="员工工号"
              :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
              align="center"
              prop="name"
              label="员工姓名"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <a @click="handleClickDetail(scope.row)">{{scope.row.name}}</a>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="staffSex"
              label="性别"
              width="55">
            </el-table-column>
            <el-table-column
              align="center"
              label="所属部门"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{ scope.row.depart==null?"":(scope.row.depart.name==null?"":scope.row.depart.name) }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="phone"
              label="联系方式"
              :show-overflow-tooltip="true">
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
              prop="modifyTime"
              label="操作时间"
              width="155">
            </el-table-column>
            <el-table-column
              align="center"
              label="操作"
              width="180">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">修改</el-button>
                <el-button
                  @click.native.prevent="delReq=scope.row.id,delVisible=true"
                  type="text"
                  size="small">
                  删除
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
              :total="pagination.totalCount" style="text-align: right">
            </el-pagination>
          </el-col>
        </el-row>
      </el-row>
      
    </div>
    <el-dialog title="新建员工" :visible.sync="dialogFormVisible" width="30%" @close="resetForm('ruleForm')" append-to-body>
      <el-form size="small" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="姓名:" prop="staffName">
          <el-input v-model="ruleForm.staffName" maxlength="45" placeholder="上限45字符"></el-input>
        </el-form-item>
        <el-form-item label="身份证:" prop="idNumber">
          <el-input v-model="ruleForm.idNumber" placeholder="上限45字符" maxlength="45" @change="autoFill()"></el-input>
        </el-form-item>
        <el-form-item label="性别:" prop="sex">
          <el-radio-group v-model="ruleForm.sex" size="small">
            <el-radio-button label="1">男</el-radio-button>
            <el-radio-button label="0">女</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="籍贯:" prop="origin">
          <el-cascader
            size="small"
            :options="options"
            v-model="ruleForm.origin"
            style="width: 100%;">
          </el-cascader>
        </el-form-item>
        <el-form-item label="入司日期:" prop="hiredate">
          <el-date-picker
            v-model="ruleForm.hiredate"
            type="date"
            placeholder="选择入司日期" style="width: 100%;"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="出生日期:" prop="birthday">
          <el-date-picker
            v-model="ruleForm.birthday"
            type="date"
            placeholder="选择出生日期" style="width: 100%;"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="部门:">
          <el-cascader
            v-model="new_dept_ids"
            placeholder="请选择部门"
            :options="visibleDepts"
            :props="org_props"
            show-all-levels
            filterable
            size="small"
            change-on-select
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="联系方式:" prop="phone">
          <el-input v-model="ruleForm.phone" maxlength="20" placeholder="上限20字符"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button plain type="primary" @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改员工" :visible.sync="dialogFormVisibleReverse" width="30%" @close="resetForm('ruleFormReverse')" append-to-body>
      <el-form size="small" :model="ruleFormReverse" :rules="rules" ref="ruleFormReverse" label-width="100px" class="demo-ruleForm">
        <el-form-item label="工号" prop="staffNo">
          <span>{{ruleFormReverse.staffNo}}</span>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="ruleFormReverse.name" maxlength="45" placeholder="上限45字符"></el-input>
        </el-form-item>
        <el-form-item label="身份证" prop="idNumber">
          <el-input v-model="ruleFormReverse.idNumber" placeholder="上限45字符" maxlength="45" @change="autoFillReverse()"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="ruleFormReverse.sex" size="small">
            <el-radio-button label="1">男</el-radio-button>
            <el-radio-button label="0">女</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="籍贯" prop="origin">
          <el-cascader
            :options="options"
            v-model="ruleFormReverse.origin"
            style="width: 100%;">
          </el-cascader>
        </el-form-item>
        <el-form-item label="入司日期" prop="hiredate">
          <el-date-picker
            v-model="ruleFormReverse.hiredate"
            type="date"
            placeholder="选择入司日期" style="width: 100%;"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="出生日期" prop="birthday">
          <el-date-picker
            v-model="ruleFormReverse.birthday"
            type="date"
            placeholder="选择出生日期" style="width: 100%;"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="部门">
          <el-cascader
            v-model="edit_dept_ids"
            placeholder="请选择部门"
            :options="visibleDepts"
            :props="org_props"
            show-all-levels
            filterable
            size="small"
            change-on-select
            clearable
          ></el-cascader>
          <!-- <el-select v-model="ruleFormReverse.departName" placeholder="请选择部门" style="width: 100%;">
            <el-option v-for="item in visibleDepts" :key="item.departName" :label="item.departName" :value="item.departName"></el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="ruleFormReverse.phone" maxlength="20" placeholder="上限20字符"></el-input>
        </el-form-item>
        <el-form-item label="操作人" prop="modifier">
          <span>{{ruleFormReverse.modifier}}</span>
        </el-form-item>
        <el-form-item label="操作时间">
          <span>{{ruleFormReverse.modifyTime}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormReverse('ruleFormReverse')">确定</el-button>
        <el-button @click="resetReverse">重置</el-button>
        <el-button plain type="primary" @click="dialogFormVisibleReverse = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="员工详情" :visible.sync="dialogFormVisibleDetail" width="30%" append-to-body>
      <el-form size="small" :model="ruleFormReverseDetail" :rules="rules" ref="ruleFormReverseDetail" label-width="100px" class="demo-ruleForm">
        <el-form-item label="工号">
          <span>{{ruleFormReverseDetail.staffNo}}</span>
        </el-form-item>
        <el-form-item label="姓名">
          <span>{{ruleFormReverseDetail.name}}</span>
        </el-form-item>
        <el-form-item label="性别">
          <span v-if="ruleFormReverseDetail.sex === '1'">男</span>
          <span v-if="ruleFormReverseDetail.sex === '0'">女</span>
        </el-form-item>
        <el-form-item label="身份证">
          <span>{{ruleFormReverseDetail.idNumber}}</span>
        </el-form-item>
        <el-form-item label="籍贯">
          <span>{{ruleFormReverseDetail.origin}}</span>
        </el-form-item>
        <el-form-item label="入司日期">
          <span>{{ruleFormReverseDetail.hiredate}}</span>
        </el-form-item>
        <el-form-item label="出生日期">
          <span>{{ruleFormReverseDetail.birthday}}</span>
        </el-form-item>
        <el-form-item label="部门">
          <span>{{ruleFormReverseDetail.departName}}</span>
        </el-form-item>
        <el-form-item label="联系方式">
          <span>{{ruleFormReverseDetail.phone}}</span>
        </el-form-item>
        <el-form-item label="操作人">
          <span>{{ruleFormReverseDetail.modifier}}</span>
        </el-form-item>
        <el-form-item label="操作时间">
          <span>{{ruleFormReverseDetail.modifyTime}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button plain type="primary" @click="dialogFormVisibleDetail = false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="30%"
      title="删除"
      :visible.sync="delVisible"
      append-to-body>
      <span style="font-size:20px;">确定删除此内容？</span>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button size="small" type="primary" @click="delVisible = false;deleteRow();">确定</el-button>
        <el-button size="small" type="primary" plain @click="delVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="30%"
      title="批量删除"
      :visible.sync="batchDelVisible"
      append-to-body>
      <span style="font-size:20px;">确定删除选定内容？</span>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button size="small" type="primary" @click="batchDelVisible = false;deleteAll();">确定</el-button>
        <el-button size="small" type="primary" plain @click="batchDelVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getAllVisibleDepts, query, deleteStaff, addStaff, queryone, edit, deleteAllStaff } from '@/api/employee_list'
  import { Message } from 'element-ui'
  import { provinceAndCityData, CodeToText } from 'element-china-area-data'
  import { formatDateTime, isJson, formatDate, list2Tree } from '@/utils/tools'

  export default {
    name: 'employee_list',
    data() {
      var checkIdNo = (rule, value, callback) => {
        if (value) {
          var idNo1 = this.ruleForm.idNumber
          var idNo2 = this.ruleFormReverse.idNumber
          var reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
          if (reg.test(idNo1)) {
            if (idNo1.substring(0, 4) !== value[1].substring(0, 4)) {
              callback(new Error('所选地址和身份证信息不匹配'))
            } else {
              callback()
            }
          } else if (reg.test(idNo2)) {
            if (idNo2.substring(0, 4) !== value[1].substring(0, 4)) {
              callback(new Error('所选地址和身份证信息不匹配'))
            } else {
              callback()
            }
          } else {
            if (idNo1 === '' && idNo2 === '') {
              callback()
            } else {
              callback(new Error('身份证号不符合规则'))
            }
          }
        } else {
          callback(new Error('所选地址不能为空'))
        }
      }
      var checkSex = (rule, value, callback) => {
        if (value !== '') {
          var idNo1 = this.ruleForm.idNumber
          var idNo2 = this.ruleFormReverse.idNumber
          var reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
          var sexStr = '1'
          if (reg.test(idNo1)) {
            sexStr = Number(idNo1.substring(idNo1.length - 2, idNo1.length - 1)) % 2 === 1 ? '1' : '0'
            if (sexStr !== value.toString()) {
              callback(new Error('所选性别和身份证信息不匹配'))
            } else {
              callback()
            }
          } else if (reg.test(idNo2)) {
            sexStr = Number(idNo2.substring(idNo2.length - 2, idNo2.length - 1)) % 2 === 1 ? '1' : '0'
            if (sexStr !== value.toString()) {
              callback(new Error('所选性别和身份证信息不匹配'))
            } else {
              callback()
            }
          } else {
            callback(new Error('身份证号不符合规则'))
          }
        } else {
          callback(new Error('性别不能为空'))
        }
      }
      var checkDept = (rule, value, callback) => {
        if (this.new_dept_ids.length === 0) {
          callback(new Error('请选择部门！'))
        }
      }
      return {
        batchDelVisible: false,
        delVisible: false,
        delReq: '',
        formContainerOpen: '1',
        formContainer: this.$store.state.app.formContainer,
        selected_dept_id: [], // 查询条件
        new_dept_ids: [], // 新建员工显示部门
        edit_dept_ids: [], // 修改员工显示部门
        reverse_edit_dept_ids: [], // 用以回显修改员工时的部门
        org_props: {
          label: 'name',
          value: 'id',
          children: 'children'
        },
        staffData: {},
        tempRoute: {},
        options: provinceAndCityData,
        timeValue: [],
        pagination: {
          pageSize: null,
          pageNo: null,
          totalCount: null,
          totalPage: null
        },
        customer: {
          name: '',
          phone: ''
        },
        regionOptions: [], // 所有部门
        visibleDepts: [], // 所有可见部门
        beforeTransfer_visibleDepts: [], // 所有可见部门 - 转成树结构之前
        tableData: [],
        multipleSelection: [],
        formInline: {
          name: '',
          staffNo: '',
          modifierName: '',
          startTime: '',
          stopTime: '',
          pageNo: 1,
          pageSize: 10,
          departId: ''
        },
        ruleForm: {
          staffName: '',
          origin: [],
          idNumber: '',
          sex: '1',
          hiredate: '',
          birthday: '',
          departId: '',
          phone: ''
        },
        ruleFormReverse: {
          id: null,
          name: '',
          origin: [],
          idNumber: '',
          sex: '1',
          hiredate: '',
          birthday: '',
          departId: '',
          phone: '',
          staffNo: '',
          modifier: '',
          modifyTime: ''
  
        },
        ruleFormReverseDetail: {
          id: null,
          name: '',
          origin: [],
          idNumber: '',
          sex: '1',
          hiredate: '',
          birthday: '',
          departName: '',
          phone: '',
          staffNo: '',
          modifier: '',
          modifyTime: ''
  
        },
        dialogFormVisible: false,
        dialogFormVisibleReverse: false,
        dialogFormVisibleDetail: false,
        rules: {
          sex: [
            { validator: checkSex, trigger: 'change' }
          ],
          staffName: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          origin: [
            { required: true, message: '请选择籍贯', trigger: 'blur' },
            { validator: checkIdNo, trigger: 'change' }
          ],
          idNumber: [
            { required: true, message: '请输入身份证号码', trigger: 'blur' },
            { pattern: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/, message: '请输入正确的身份证号码' }
          ],
          hiredate: [
            { required: true, message: '请输入入司日期', trigger: 'blur' }
          ],
          birthday: [
            { required: true, message: '请输入出生日期', trigger: 'blur' }
          ],
          departName: [
            { required: true, validator: checkDept, trigger: 'change' }
          ],
          userPhone: [
            { required: true, message: '请输入联系方式', trigger: 'blur' },
            { pattern: /^([1][3,4,5,7,8][0-9]{9}|0\d{2,3}-\d{7,8}|\d{1,20})$/, message: '请输入正确的号码' }
          ]
        }
      }
    },
    methods: {
      handleChangeAcitve(active = ['1']) {
        if (active.length) {
          $('.form-more').text('收起')
        } else {
          $('.form-more').text('更多')
        }
      },
      autoFill() {
        var reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
        const idNo = this.ruleForm.idNumber
        if (reg.test(idNo)) {
          this.ruleForm.origin = []
          this.ruleForm.sex = '1'
          this.ruleForm.birthday = ''
          var prov = idNo.substring(0, 2) + '0000'
          var zone = idNo.substring(0, 4) + '00'
          this.ruleForm.origin = [prov, zone]
          var birthdayStr = idNo.substring(6, 10) + '-' + idNo.substring(10, 12) + '-' + idNo.substring(12, 14)
          this.ruleForm.birthday = birthdayStr
          this.ruleForm.sex = Number(idNo.substring(idNo.length - 2, idNo.length - 1)) % 2 === 1 ? '1' : '0'
        }
      },
      autoFillReverse() {
        var reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
        const idNo = this.ruleFormReverse.idNumber
        if (reg.test(idNo)) {
          this.ruleFormReverse.origin = []
          this.ruleFormReverse.sex = '1'
          this.ruleFormReverse.birthday = ''
          var prov = idNo.substring(0, 2) + '0000'
          var zone = idNo.substring(0, 4) + '00'
          this.ruleFormReverse.origin = [prov, zone]
          var birthdayStr = idNo.substring(6, 10) + '-' + idNo.substring(10, 12) + '-' + idNo.substring(12, 14)
          this.ruleFormReverse.birthday = birthdayStr
          this.ruleFormReverse.sex = Number(idNo.substring(idNo.length - 2, idNo.length - 1)) % 2 === 1 ? '1' : '0'
        }
      },
      addStaff() {
        this.dialogFormVisible = true
        this.new_dept_ids = []
        this.ruleForm = {
          staffName: '',
          origin: [],
          idNumber: '',
          sex: '1',
          hiredate: '',
          birthday: '',
          departId: '',
          phone: ''
        }
      },
      deleteAll() {
        const listId = this.multipleSelection.map(function(item, index) {
          return item.id
        })
        if (!listId || listId.length <= 0) {
          this.$message.error('请选择要删除的内容')
          return
        }
        deleteAllStaff(listId).then(response => {
          if (response.data.code === 1) {
            Message({
              message: response.data.message,
              type: 'success',
              duration: 3 * 1000
            })
            this.formInline.pageNo = 1
            this.pagination.pageNo = 1
            query(this.formInline).then(responseData => {
              this.queryStaff(responseData)
              this.pagination = responseData.data.pageInfo
            })
          } else {
            Message({
              message: '删除失败',
              type: 'error',
              duration: 3 * 1000
            })
          }
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.new_dept_ids.length === 0) {
              this.$message.error('请选择部门！')
              return
            } else {
              this.ruleForm.departId = this.new_dept_ids[this.new_dept_ids.length - 1]
            }
            this.ruleForm.sex = Number(this.ruleForm.sex)
            console.log('this.ruleForm', this.ruleForm)
            addStaff(this.ruleForm).then(response => {
              if (response.data.code === 1) {
                this.dialogFormVisible = false
                query(this.formInline).then(responseData => {
                  this.queryStaff(responseData)
                  this.pagination = responseData.data.pageInfo
                })
                this.$refs[formName].resetFields()
              } else {
                this.$message.error(response.data.message)
              }
            })
          } else {
            return false
          }
        })
      },
      submitFormReverse(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.ruleFormReverse.sex = Number(this.ruleFormReverse.sex)
            if (this.edit_dept_ids.length === 0) {
              this.$message.error('请选择部门！')
              return
            } else {
              this.ruleFormReverse.departId = this.edit_dept_ids[this.edit_dept_ids.length - 1]
            }
            edit(this.ruleFormReverse).then(response => {
              if (response.data.code === 1) {
                this.dialogFormVisibleReverse = false
                query(this.formInline).then(responseData => {
                  this.queryStaff(responseData)
                })
              }
            })
          } else {
            return false
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      reset() {
        this.timeValue = []
        this.selected_dept_id = []
        this.formInline = {
          name: '',
          staffNo: '',
          modifierName: '',
          startTime: '',
          stopTime: '',
          departId: '',
          pageNo: this.pagination.pageNo,
          pageSize: this.pagination.pageSize
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      deleteRow() {
        deleteStaff(this.delReq).then(response => {
          if (response.data.code === 1) {
            Message({
              message: response.data.message,
              type: 'success',
              duration: 3 * 1000
            })
            this.formInline.pageNo = 1
            this.pagination.pageNo = 1
            // rows.splice(index, 1)
            query(this.formInline).then(responseData => {
              this.queryStaff(responseData)
              // this.pagination = responseData.data.pageInfo
            })
          } else {
            Message({
              message: '删除失败',
              type: 'error',
              duration: 3 * 1000
            })
          }
        })
      },
      handleClickDetail(row) {
        this.dialogFormVisibleDetail = true
        this.ruleFormReverseDetail = {
          id: row.id,
          name: row.name,
          origin: isJson(row.origin) && row.origin ? CodeToText[JSON.parse(row.origin)[0]] + (typeof CodeToText[JSON.parse(row.origin)[1]] === 'undefined' ? '' : CodeToText[JSON.parse(row.origin)[1]]) : row.origin,
          idNumber: row.idNumber,
          sex: typeof row.sex === 'undefined' || row.sex === null ? '' : row.sex.toString(),
          birthday: row.birthday,
          hiredate: row.hiredate ? formatDate(row.hiredate) : '',
          departName: row.depart == null ? '' : (row.depart.name == null ? '' : row.depart.name),
          phone: row.phone,
          staffNo: row.staffNo,
          modifier: row.modifier,
          modifyTime: formatDateTime(row.modifyTime)
        }
      },
      handleClick(row) {
        this.dialogFormVisibleReverse = true
        queryone(row.id).then(response => {
          if (response.data.code === 1) {
            const data = response.data.data
            this.staffData = data
  
            /** 回显上级部门的逻辑 start */
  
            this.edit_dept_ids = []
            this.reverse_edit_dept_ids = []
            let arr = []
            arr = data.depart == null ? null : (data.depart.idPath == null ? null : data.depart.idPath.substring(1, data.depart.idPath.length - 1).split('/'))
            if (arr != null) {
              for (var i = 0; i < arr.length; i++) {
                const val = parseInt(arr[i])
                this.edit_dept_ids.push(val)
                this.reverse_edit_dept_ids.push(val)
              }
            }
  
            /** 回显上级部门的逻辑 end */
  
            this.ruleFormReverse = {
              id: data.id,
              name: data.name,
              origin: isJson(data.origin) && data.origin ? JSON.parse(data.origin) : ['000000', '000000'],
              idNumber: data.idNumber,
              sex: typeof data.sex === 'undefined' || data.sex === null ? '' : data.sex.toString(),
              hiredate: data.hiredate ? formatDate(data.hiredate) : '',
              birthday: data.birthday,
              departId: data.departId,
              phone: data.phone,
              staffNo: data.staffNo,
              modifier: data.modifier,
              modifyTime: formatDateTime(data.modifyTime)
            }
          }
        })
        // row已经包含了单个的数据
      },
      resetReverse() {
        this.edit_dept_ids = this.reverse_edit_dept_ids
        this.ruleFormReverse = {
          id: this.staffData.id,
          staffName: this.staffData.staffName,
          origin: isJson(this.staffData.origin) && this.staffData.origin ? JSON.parse(this.staffData.origin) : ['000000', '000000'],
          idNumber: this.staffData.idNumber,
          sex: typeof this.staffData.sex === 'undefined' || this.staffData.sex === null ? '' : this.staffData.sex.toString(),
          hiredate: this.staffData.hiredate ? formatDate(this.staffData.hiredate) : '',
          birthday: this.staffData.birthday,
          departName: this.staffData.departName,
          userPhone: this.staffData.userPhone,
          staffNo: this.staffData.staffNo,
          modifier: this.staffData.modifier,
          updateTime: formatDateTime(this.staffData.updateTime)
        }
      },
      handleSizeChange(val) {
        this.pagination.pageNo = 1
        this.formInline.pageNo = 1
        this.formInline.pageSize = val
        this.searchStaff(this.formInline)
      },
      handleCurrentChange(val) {
        this.formInline.pageNo = val
        this.formInline.startTime = this.timeValue ? this.timeValue[0] : null
        this.formInline.stopTime = this.timeValue ? this.timeValue[1] : null
        query(this.formInline).then(response => {
          this.queryStaff(response)
        })
      },
      headerRow({ row, rowIndex }) {
        if (rowIndex === 0) {
          return 'color:black'
        } else {
          return ''
        }
      },
      queryStaff(res) {
        if (!res.data.data) {
          this.tableData = []
          return
        }
        this.tableData = res.data.data
        this.pagination = res.data.pageInfo
        if (this.tableData.length !== 0) {
          for (let i = 0; i <= this.tableData.length; i++) {
            if (this.tableData[i]) {
              if (this.tableData[i].sex === 1) {
                this.tableData[i].staffSex = '男'
              } else {
                this.tableData[i].staffSex = '女'
              }
            }
          }
        }
      },
      searchStaff(req) {
        req.pageNo = 1
        req.startTime = this.timeValue ? this.timeValue[0] : null
        req.stopTime = this.timeValue ? this.timeValue[1] : null
        if (this.selected_dept_id.length > 0) {
          req.departId = this.selected_dept_id[this.selected_dept_id.length - 1]
        }
        query(req).then(response => {
          this.queryStaff(response)
        })
      }
    },
    created() {
      getAllVisibleDepts().then(response1 => {
        this.beforeTransfer_visibleDepts = response1.data.data
        const map = {
          data: response1.data.data,
          rootId: 0,
          idFieldName: 'id',
          parentIdFielName: 'upId'
        }
        this.visibleDepts = list2Tree(map)
        if (this.$route.query.id !== ':id') {
          const departId = this.$route.query.id
          const idPath = this.$route.query.idPath
          query({ departId: departId }).then(response => {
            this.queryStaff(response)
            this.formInline.departId = departId
            this.pagination = response.data.pageInfo
          })
          let arr = []
          arr = idPath == null ? null : idPath.substring(1, idPath.length - 1).split('/')
          if (!arr) {
            return
          }
          this.selected_dept_id = []
          for (var i = 0; i < arr.length; i++) {
            const val = parseInt(arr[i])
            this.selected_dept_id.push(val)
          }
        } else {
          query({ pageNo: 1 }).then(response => {
            this.queryStaff(response)
          })
        }
      })
    },
    mounted() {
      this.formContainer()
      this.handleChangeAcitve()
      this.tempRoute = Object.assign({}, this.$route)
    }
  }
</script>
