<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-form :inline="true" class="demo-form-inline" size="small">
          <el-form-item>
            <el-input placeholder="员工姓名" v-model="formInline.name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input placeholder="员工工号" v-model="formInline.angentId"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="formInline.departName" placeholder="所属部门">
              <el-option v-for="item in regionOptions" :key="item.departName" :label="item.departName" :value="item.departName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input placeholder="操作人员" v-model="formInline.modifierName"></el-input>
          </el-form-item>
          <el-form-item label="操作时间：">
            <el-date-picker
              v-model="timeValue"
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchStaff(formInline)">查询</el-button>
            <el-button type="danger" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table
        :header-row-style="headerRow"
        :data="tableData"
        ref="multipleTable"
        tooltip-effect="dark"
        border
        style="width: 94%;"
        @selection-change="handleSelectionChange">
        <el-table-column
          align="center"
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          width="55"
          align="center"
          type="index"
          label="序号">
        </el-table-column>
        <el-table-column
          align="center"
          prop="angentId"
          label="员工工号">
        </el-table-column>
        <el-table-column
          align="center"
          prop="staffName"
          label="员工姓名">
        </el-table-column>
        <el-table-column
          align="center"
          prop="staffSex"
          label="性别"
          width="55">
        </el-table-column>
        <el-table-column
          align="center"
          prop="departName"
          label="所属组织">
        </el-table-column>
        <el-table-column
          align="center"
          prop="userPhone"
          label="联系方式">
        </el-table-column>
        <el-table-column
          align="center"
          prop="creator"
          label="操作人员">
        </el-table-column>
        <el-table-column
          align="center"
          prop="updateTime"
          label="操作时间">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="180">
          <template slot-scope="scope">
            <el-button @click="handleClickDetail(scope.row)" type="text" size="small">详情</el-button>
            <el-button @click="handleClick(scope.row)" type="text" size="small">修改</el-button>
            <el-button
              @click.native.prevent="deleteRow(scope.$index, tableData)"
              type="text"
              size="small">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      </el-row>
      <el-row style="margin-top:1%;">
        <el-col :span="4">
          <el-button type="success" size="small"  @click="addStaff">新增</el-button>
          <el-button type="danger" size="small" @click="deleteAll">批量删除</el-button>
        </el-col>
        <el-col :span="18">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="pagination.pageNo"
            :page-size="pagination.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="pagination.totalCount" style="text-align: right">
          </el-pagination>
        </el-col>
      </el-row>
    </div>
    <el-dialog title="添加员工" :visible.sync="dialogFormVisible" width="30%" @close="resetForm('ruleForm')">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="姓名:" prop="staffName">
          <el-input v-model="ruleForm.staffName"></el-input>
        </el-form-item>
        <el-form-item label="性别:" prop="sex">
          <el-radio-group v-model="ruleForm.sex">
            <el-radio label="1">男</el-radio>
            <el-radio label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="身份证:" prop="idNumber">
          <el-input v-model="ruleForm.idNumber"></el-input>
        </el-form-item>
        <el-form-item label="籍贯:" prop="origin">
          <el-cascader
            size="large"
            :options="options"
            v-model="ruleForm.origin"
            @change="handleChange" style="width: 100%;">
          </el-cascader>
        </el-form-item>
        <el-form-item label="出生日期:" prop="birthday">
          <el-date-picker
            v-model="ruleForm.birthday"
            type="date"
            placeholder="选择出生日期" style="width: 100%;">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="组织:" prop="departName">
          <el-select v-model="ruleForm.departName" placeholder="请选择部门" style="width: 100%;">
            <el-option v-for="item in regionOptions" :key="item.departName" :label="item.departName" :value="item.departName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系方式:" prop="userPhone">
          <el-input v-model="ruleForm.userPhone"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        <el-button type="danger" @click="resetForm('ruleForm')">重置</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改员工" :visible.sync="dialogFormVisibleReverse" width="30%" @close="resetForm('ruleFormReverse')">
      <el-form :model="ruleFormReverse" :rules="rules" ref="ruleFormReverse" label-width="100px" class="demo-ruleForm">
        <el-form-item label="工号" prop="angentId">
          <span>{{ruleFormReverse.angentId}}</span>
        </el-form-item>
        <el-form-item label="姓名" prop="staffName">
          <el-input v-model="ruleFormReverse.staffName"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="ruleFormReverse.sex">
            <el-radio label="1">男</el-radio>
            <el-radio label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="身份证" prop="idNumber">
          <el-input v-model="ruleFormReverse.idNumber"></el-input>
        </el-form-item>
        <el-form-item label="籍贯" prop="origin">
          <el-cascader
            size="large"
            :options="options"
            v-model="ruleFormReverse.origin"
            @change="handleChange" style="width: 100%;">
          </el-cascader>
        </el-form-item>
        <el-form-item label="出生日期" prop="birthday">
          <el-date-picker
            v-model="ruleFormReverse.birthday"
            type="date"
            placeholder="选择出生日期" style="width: 100%;">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="组织" prop="departName">
          <el-select v-model="ruleFormReverse.departName" placeholder="请选择部门" style="width: 100%;">
            <el-option v-for="item in regionOptions" :key="item.departName" :label="item.departName" :value="item.departName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系方式" prop="userPhone">
          <el-input v-model="ruleFormReverse.userPhone"></el-input>
        </el-form-item>
        <el-form-item label="操作人员" prop="modifier">
          <span>{{ruleFormReverse.modifier}}</span>
        </el-form-item>
        <el-form-item label="操作时间">
          <span>{{ruleFormReverse.updateTime}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormReverse('ruleFormReverse')">确 定</el-button>
        <el-button type="danger" @click="resetReverse">重置</el-button>
        <el-button @click="dialogFormVisibleReverse = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="员工详情" :visible.sync="dialogFormVisibleDetail" width="30%">
      <el-form :model="ruleFormReverse" :rules="rules" ref="ruleFormReverse" label-width="100px" class="demo-ruleForm">
        <el-form-item label="工号">
          <span>{{ruleFormReverse.angentId}}</span>
        </el-form-item>
        <el-form-item label="姓名">
          <span>{{ruleFormReverse.staffName}}</span>
        </el-form-item>
        <el-form-item label="性别">
          <span v-if="ruleFormReverse.sex === '1'">男</span>
          <span v-if="ruleFormReverse.sex === '0'">女</span>
        </el-form-item>
        <el-form-item label="身份证">
          <span>{{ruleFormReverse.idNumber}}</span>
        </el-form-item>
        <el-form-item label="籍贯">
          <span>{{ruleFormReverse.origin}}</span>
        </el-form-item>
        <el-form-item label="出生日期">
          <span>{{ruleFormReverse.birthday}}</span>
        </el-form-item>
        <el-form-item label="组织">
          <span>{{ruleFormReverse.departName}}</span>
        </el-form-item>
        <el-form-item label="联系方式">
          <span>{{ruleFormReverse.userPhone}}</span>
        </el-form-item>
        <el-form-item label="操作人员">
          <span>{{ruleFormReverse.modifier}}</span>
        </el-form-item>
        <el-form-item label="操作时间">
          <span>{{ruleFormReverse.updateTime}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisibleDetail = false">返回</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { queryDepts, query, deleteStaff, addStaff, queryone, edit, deleteAllStaff } from '@/api/employee_list'
  import { Message, MessageBox } from 'element-ui'
  import { regionData, CodeToText } from 'element-china-area-data'
  import { formatDateTime } from '@/utils/tools'

  export default {
    name: 'employee_list',
    data() {
      return {
        staffData: {},
        options: regionData,
        timeValue: '',
        pagination: {
          pageNo: null,
          pageSize: null,
          totalCount: null,
          totalPage: null
        },
        customer: {
          name: '',
          phone: ''
        },
        regionOptions: [],
        tableData: [],
        multipleSelection: [],
        formInline: {
          name: '',
          angentId: '',
          modifierName: '',
          startTime: '',
          stopTime: '',
          from: 1,
          departName: ''
        },
        ruleForm: {
          staffName: '',
          origin: [],
          idNumber: '',
          sex: '1',
          birthday: '',
          departName: '',
          userPhone: ''
        },
        ruleFormReverse: {
          id: null,
          staffName: '',
          origin: [],
          idNumber: '',
          sex: '1',
          birthday: '',
          departName: '',
          userPhone: '',
          angentId: '',
          modifier: '',
          updateTime: ''
        },
        dialogFormVisible: false,
        dialogFormVisibleReverse: false,
        dialogFormVisibleDetail: false,
        rules: {
          staffName: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          origin: [
            { required: true, message: '请选择籍贯', trigger: 'blur' }
          ],
          idNumber: [
            { required: true, message: '请输入身份证号码', trigger: 'blur' },
            { pattern: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/, message: '请输入正确的身份证号码' }
          ],
          birthday: [
            { required: true, message: '请输入出生日期', trigger: 'blur' }
          ],
          departName: [
            { required: true, message: '请选择部门', trigger: 'change' }
          ],
          userPhone: [
            { required: true, message: '请输入联系方式', trigger: 'blur' },
            { pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号码' }
          ]
        }
      }
    },
    methods: {
      addStaff() {
        this.dialogFormVisible = true
        this.ruleForm = {
          staffName: '',
          origin: [],
          idNumber: '',
          sex: '1',
          birthday: '',
          departName: '',
          userPhone: ''
        }
      },
      deleteAll() {
        const listId = this.multipleSelection.map(function(item, index) {
          return item.id
        })
        MessageBox.confirm('确定执行批量删除操作吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteAllStaff(listId).then(response => {
            if (response.data.code === 1) {
              Message({
                message: response.data.message,
                type: 'success',
                duration: 3 * 1000
              })
              query({ from: this.pagination.pageNo }).then(responseData => {
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
        }).catch(() => {
          Message({
            message: '已经取消删除',
            type: 'error',
            duration: 3 * 1000
          })
        })
      },
      handleChange(value) {
        console.log(CodeToText[value[2]])
        console.log(this.ruleForm.origin)
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            addStaff(this.ruleForm).then(response => {
              if (response.data.code === 1) {
                this.dialogFormVisible = false
                query({ from: 1 }).then(responseData => {
                  this.queryStaff(responseData)
                  this.pagination = responseData.data.pageInfo
                })
                this.$refs[formName].resetFields()
              }
            })
          } else {
            // console.log('error submit!!')
            return false
          }
        })
      },
      submitFormReverse(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            edit(this.ruleFormReverse).then(response => {
              if (response.data.code === 1) {
                this.dialogFormVisibleReverse = false
                query({ from: this.pagination.pageNo }).then(responseData => {
                  this.queryStaff(responseData)
                  // this.pagination = responseData.data.pageInfo
                })
              }
            })
          } else {
            // console.log('error submit!!')
            return false
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      reset() {
        this.timeValue = ''
        this.formInline = {
          name: '',
          angentId: '',
          modifierName: '',
          startTime: '',
          stopTime: '',
          departName: '',
          from: this.pagination.pageNo
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
        console.log(val)
      },
      deleteRow(index, rows) {
        MessageBox.confirm('确定执行删除操作吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteStaff(rows[index].id).then(response => {
            if (response.data.code === 1) {
              Message({
                message: response.data.message,
                type: 'success',
                duration: 3 * 1000
              })
              // rows.splice(index, 1)
              query({ from: this.pagination.pageNo }).then(responseData => {
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
        }).catch(() => {
          Message({
            message: '已经取消删除',
            type: 'error',
            duration: 3 * 1000
          })
        })
      },
      handleClickDetail(row) {
        this.dialogFormVisibleDetail = true
        this.ruleFormReverse = {
          id: row.id,
          staffName: row.staffName,
          origin: CodeToText[JSON.parse(row.origin)[0]] + CodeToText[JSON.parse(row.origin)[1]] + CodeToText[JSON.parse(row.origin)[2]],
          idNumber: row.idNumber,
          sex: row.sex.toString(),
          birthday: row.birthday,
          departName: row.departName,
          userPhone: row.userPhone,
          angentId: row.angentId,
          modifier: row.modifier,
          updateTime: formatDateTime(row.updateTime)
        }
      },
      handleClick(row) {
        this.dialogFormVisibleReverse = true
        queryone(row.id).then(response => {
          if (response.data.code === 1) {
            const data = response.data.data
            this.staffData = data
            this.ruleFormReverse = {
              id: data.id,
              staffName: data.staffName,
              origin: JSON.parse(data.origin),
              idNumber: data.idNumber,
              sex: data.sex.toString(),
              birthday: data.birthday,
              departName: data.departName,
              userPhone: data.userPhone,
              angentId: data.angentId,
              modifier: data.modifier,
              updateTime: formatDateTime(data.updateTime)
            }
          }
        })
        // row已经包含了单个的数据
      },
      resetReverse() {
        this.ruleFormReverse = {
          id: this.staffData.id,
          staffName: this.staffData.staffName,
          origin: JSON.parse(this.staffData.origin),
          idNumber: this.staffData.idNumber,
          sex: this.staffData.sex.toString(),
          birthday: this.staffData.birthday,
          departName: this.staffData.departName,
          userPhone: this.staffData.userPhone,
          angentId: this.staffData.angentId,
          modifier: this.staffData.modifier,
          updateTime: formatDateTime(this.staffData.updateTime)
        }
      },
      handleCurrentChange(val) {
        this.formInline.from = val
        this.formInline.startTime = this.timeValue[0]
        this.formInline.stopTime = this.timeValue[1]
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
        this.tableData = res.data.data
        this.pagination = res.data.pageInfo
        if (this.tableData.length !== 0) {
          for (let i = 0; i <= this.tableData.length; i++) {
            if (this.tableData[i]) {
              this.tableData[i].updateTime = formatDateTime(this.tableData[i].updateTime)
              if (this.tableData[i].sex === 1) {
                this.tableData[i].staffSex = '男'
              } else {
                this.tableData[i].staffSex = '女'
              }
            }
          }
        } else {
          Message({
            message: '无查询结果，请核对查询条件',
            type: 'error',
            duration: 3 * 1000
          })
        }
      },
      searchStaff(req) {
        // 根据老版本的逻辑 查询只能传分页页码的第一页
        req.from = 1
        req.startTime = this.timeValue[0]
        req.stopTime = this.timeValue[1]
        query(req).then(response => {
          this.queryStaff(response)
        })
      }
    },
    created() {
      if (this.$route.query.departName) {
        query({ departName: this.$route.query.departName }).then(response => {
          this.queryStaff(response)
          this.formInline.departName = this.$route.query.departName
          this.pagination = response.data.pageInfo
        })
      } else {
        query({ from: 1 }).then(response => {
          this.queryStaff(response)
        })
      }
      queryDepts().then(response => {
        this.regionOptions = response.data.data
      })
    },
    watch: {
      $route(to, from) {
        // 判断url是否带参
        if (!to.query.departName) {
          this.formInline.departName = ''
          query({ from: 1 }).then(response => {
            this.queryStaff(response)
          })
        }
      }
    }
  }
</script>
<!--<style>-->
  <!--.el-table{-->
    <!--width: 100% !important;-->
  <!--}-->
<!--</style>-->
