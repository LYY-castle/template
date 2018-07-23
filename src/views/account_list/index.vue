<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-form :inline="true" class="demo-form-inline" size="small">
          <el-form-item>
            <el-input placeholder="员工姓名（限长45字符）" v-model="formInline.staffName" maxlength="45"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input placeholder="员工工号（限长45字符）" v-model="formInline.angentId" maxlength="45"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="formInline.status" placeholder="所属部门">
              <el-option label="所有情况" value=""></el-option>
              <el-option label="已停用" value="0"></el-option>
              <el-option label="启用中" value="1"></el-option>
              <el-option label="未启用" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="formInline.departName" placeholder="所属组织">
              <el-option v-for="item in regionOptions" :key="item.departName" :label="item.departName" :value="item.departName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input placeholder="操作人员（限长45字符）" v-model="formInline.creator" maxlength="45"></el-input>
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
            prop="agentId"
            label="系统账号">
          </el-table-column>
          <el-table-column
            align="center"
            prop="staffName"
            label="姓名">
          </el-table-column>
          <el-table-column
            align="center"
            prop="departName"
            label="所属组织">
          </el-table-column>
          <el-table-column
            align="center"
            prop="statusZH"
            label="账号状态">
          </el-table-column>
          <el-table-column
            align="center"
            prop="modifier"
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
            width="250">
            <template slot-scope="scope">
              <el-button @click="handleClickDetail(scope.row)" type="text" size="small" v-show="scope.row.status !== 2">详情</el-button>
              <el-button @click="handleClickAdd(scope.row)" type="text" size="small" v-show="scope.row.status === 2">增加</el-button>
              <el-button @click="handleClick(scope.row)" type="text" size="small" v-show="scope.row.status !== 2">修改</el-button>
              <el-button @click="handleClickPass(scope.row)" type="text" size="small" v-show="scope.row.status !== 2">重置密码</el-button>
              <el-button @click="handleClickStop(scope.row)" type="text" size="small" v-show="scope.row.status === 1">停用</el-button>
              <el-button @click="handleClickStart(scope.row)" type="text" size="small" v-show="scope.row.status === 0">启用</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row style="margin-top:1%;">
        <el-col :span="4">
          <el-button type="success" size="small"  @click="all(1)">批量启用</el-button>
          <el-button type="danger" size="small" @click="all(0)">批量停用</el-button>
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
    <el-dialog title="生成系统账号" :visible.sync="dialogFormVisible" width="30%" @close="resetForm('ruleForm')">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="工号">
          <span>{{ruleForm.agentId}}</span>
        </el-form-item>
        <el-form-item label="组织">
          <span v-if="ruleForm.upDepartName!=='0'">{{ruleForm.upDepartName}}--></span>
          <span style="color: blue">{{ruleForm.departName}}</span>
        </el-form-item>
        <el-form-item label="角色建议">
          <el-checkbox-group v-model="checkedRoles" @change="handleCheckedRolesChange">
            <el-checkbox v-model="checkAgent" label="agent" @change="handleCheckAgent">普通坐席</el-checkbox>
            <el-checkbox v-model="checkMonitor" label="monitor" @change="handleCheckMonitor">团队长坐席</el-checkbox>
            <el-checkbox v-model="checkChief" label="chief" @change="handleCheckChief">坐席主管</el-checkbox>
            <el-checkbox v-model="checkQc" label="qc" @change="handleCheckQc">质检员</el-checkbox>
            <el-checkbox v-model="checkQcmonitor" label="qcmonitor" @change="handleCheckQcmonitor">质检队长</el-checkbox>
            <el-checkbox v-model="checkQcchief" label="qcchief" @change="handleCheckQcchief">质检主管</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="系统权限">
          <!--<el-input v-model="ruleFormReverse.permission"></el-input>-->
          <el-checkbox-group v-model="checkedPermission" @change="handleCheckedPermissionChange">
            <el-checkbox v-for="permission in permissions" :label="permission.roleNumber" :key="permission.roleNumber">{{permission.roleName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="add">添加其他账号</el-button>
        </el-form-item>
        <div v-for="(other_account, index) in ruleForm.other_accounts">
          <el-form-item label="账号方式">
            <el-select v-model="other_account.comment" class="reverse">
              <el-option label="QQ账号" value="QQ"></el-option>
              <el-option label="微信账号" value="WX"></el-option>
              <el-option label="CTI账号" value="CTI"></el-option>
            </el-select>
            <el-button type="danger" @click.prevent="remove(index)">删除</el-button>
          </el-form-item>
          <el-form-item label="账号" :prop="'other_accounts.'+index+'.username'" :rules="{ required: true, message: '请输入账号', trigger: 'blur' }">
            <el-input v-model="other_account.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" :prop="'other_accounts.'+index+'.passWord'" :rules="{ required: true, message: '请输入密码', trigger: 'blur' }">
            <el-input v-model="other_account.passWord"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        <el-button type="danger" @click="resetForm('ruleForm')">重置</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改系统账号" :visible.sync="dialogFormVisibleReverse" width="30%" @close="resetFormReverse">
      <el-form :model="ruleFormReverse" :rules="rules" ref="ruleFormReverse" label-width="100px" class="demo-ruleForm">
        <el-form-item label="工号">
          <span>{{ruleFormReverse.agentId}}</span>
        </el-form-item>
        <el-form-item label="组织">
          <span v-if="ruleFormReverse.upDepartName!=='0'">{{ruleFormReverse.upDepartName}}--></span>
          <span style="color: blue">{{ruleFormReverse.departName}}</span>
        </el-form-item>
        <el-form-item label="角色建议">
          <el-checkbox-group v-model="checkedRoles" @change="handleCheckedRolesChange">
            <el-checkbox v-model="checkAgent" label="agent" @change="handleCheckAgent">普通坐席</el-checkbox>
            <el-checkbox v-model="checkMonitor" label="monitor" @change="handleCheckMonitor">团队长坐席</el-checkbox>
            <el-checkbox v-model="checkChief" label="chief" @change="handleCheckChief">坐席主管</el-checkbox>
            <el-checkbox v-model="checkQc" label="qc" @change="handleCheckQc">质检员</el-checkbox>
            <el-checkbox v-model="checkQcmonitor" label="qcmonitor" @change="handleCheckQcmonitor">质检队长</el-checkbox>
            <el-checkbox v-model="checkQcchief" label="qcchief" @change="handleCheckQcchief">质检主管</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="系统权限">
          <!--<el-input v-model="ruleFormReverse.permission"></el-input>-->
          <el-checkbox-group v-model="checkedPermission" @change="handleCheckedPermissionChange">
            <el-checkbox v-for="permission in permissions" :label="permission.roleNumber" :key="permission.roleNumber">{{permission.roleName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="addUser">添加其他账号</el-button>
        </el-form-item>
        <div v-for="(other_account, index) in ruleFormReverse.other_accounts">
          <el-form-item label="账号方式">
            <el-select v-model="other_account.comment" class="reverse">
              <el-option label="QQ账号" value="QQ"></el-option>
              <el-option label="微信账号" value="WX"></el-option>
              <el-option label="CTI账号" value="CTI"></el-option>
            </el-select>
            <el-button type="danger" @click.prevent="removeDomain(index)">删除</el-button>
          </el-form-item>
          <el-form-item label="账号" :prop="'other_accounts.'+index+'.username'" :rules="{ required: true, message: '请输入账号', trigger: 'blur' }">
            <el-input v-model="other_account.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" :prop="'other_accounts.'+index+'.passWord'" :rules="{ required: true, message: '请输入密码', trigger: 'blur' }">
            <el-input v-model="other_account.passWord"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormReverse('ruleFormReverse')">确 定</el-button>
        <el-button type="danger" @click="resetReverse(ruleFormReverse.agentId)">重置</el-button>
        <el-button @click="dialogFormVisibleReverse = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="系统账号详情" :visible.sync="dialogFormVisibleDetail" width="30%">
      <el-form :model="ruleFormReverseDetail" ref="ruleFormReverseDetail" label-width="100px" class="demo-ruleForm">
        <el-form-item label="工号">
          <span>{{ruleFormReverseDetail.agentId}}</span>
        </el-form-item>
        <el-form-item label="组织">
          <span>{{ruleFormReverseDetail.departName}}</span>
        </el-form-item>
        <el-form-item label="系统权限">
          <span v-for="role in ruleFormReverseDetail.roles">{{role.roleName}} | </span>
        </el-form-item>
        <div v-for="other_account in ruleFormReverseDetail.other_accounts">
          <el-form-item :label="other_account.comment">
            <span>{{other_account.username}}</span>
          </el-form-item>
        </div>
        <el-form-item label="创建人">
          <span>{{ruleFormReverseDetail.creator}}</span>
        </el-form-item>
        <el-form-item label="创建时间">
          <span>{{ruleFormReverseDetail.createTime}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisibleDetail = false">返回</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { findAllAccount, findAllOrganTo, changeState, resetPWDById, findAccountByAgentid, getRoleList, readProp, modifyAccount, alterAccountList, findOrganById, addAccount } from '@/api/account_list'
  import { Message, MessageBox } from 'element-ui'
  import { formatDateTime } from '@/utils/tools'

  export default {
    name: 'account_list',
    data() {
      return {
        permissions: [],
        checkAgent: false,
        checkMonitor: false,
        checkChief: false,
        checkQc: false,
        checkQcmonitor: false,
        checkQcchief: false,
        checkedPermission: [],
        roles: [
          {
            name: '普通坐席',
            label: 'agent'
          },
          {
            name: '团队长坐席',
            label: 'monitor'
          },
          {
            name: '坐席主管',
            label: 'chief'
          },
          {
            name: '质检员',
            label: 'qc'
          },
          {
            name: '质检队长',
            label: 'qcmonitor'
          },
          {
            name: '质检主管',
            label: 'qcchief'
          }
        ],
        checkedRoles: [],
        timeValue: '',
        staffData: {},
        pagination: {
          pageNo: null,
          pageSize: null,
          totalCount: null,
          totalPage: null
        },
        regionOptions: [],
        tableData: [],
        multipleSelection: [],
        formInline: {
          staffName: '',
          angentId: '',
          creator: '',
          start_time: '',
          end_time: '',
          from: 1,
          departName: '',
          status: ''
        },
        ruleForm: {
          departId: '',
          upDepartName: '',
          departName: '',
          agentId: '',
          other_accounts: []
        },
        ruleFormReverse: {
          departId: '',
          upDepartName: '',
          departName: '',
          agentId: '',
          other_accounts: []
        },
        ruleFormReverseDetail: {
          agentId: '',
          departName: '',
          creator: '',
          createTime: '',
          roles: [],
          other_accounts: []
        },
        dialogFormVisible: false,
        dialogFormVisibleReverse: false,
        dialogFormVisibleDetail: false,
        rules: {
          qwe: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          w: [
            { required: true, message: '请输入账号', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      add() {
        this.ruleForm.other_accounts.push({
          comment: 'QQ',
          username: '',
          passWord: ''
        })
      },
      addUser() {
        this.ruleFormReverse.other_accounts.push({
          comment: 'QQ',
          username: '',
          passWord: ''
        })
      },
      remove(index) {
        this.ruleForm.other_accounts.splice(index, 1)
      },
      removeDomain(index) {
        this.ruleFormReverse.other_accounts.splice(index, 1)
      },
      all(status) {
        const chk_box = this.multipleSelection.map(function(item, index) {
          return item.agentId
        })
        MessageBox.confirm('确定执行批量操作吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          alterAccountList({
            angentIdList: chk_box,
            status: status
          }).then(response => {
            if (response.data.code === 1) {
              Message({
                message: response.data.message,
                type: 'success',
                duration: 3 * 1000
              })
              findAllAccount({ departName: '', from: this.pagination.pageNo }).then(responsedata => {
                this.queryStaff(responsedata)
              })
            } else {
              Message({
                message: response.data.message,
                type: 'error',
                duration: 3 * 1000
              })
            }
          })
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.checkedPermission.indexOf(undefined) !== -1) {
              this.checkedPermission.splice(this.checkedPermission.indexOf(undefined), 1)
            }
            addAccount({
              agentid: this.ruleForm.agentId,
              organ: this.ruleForm.departId,
              chk: this.checkedPermission,
              other_accounts: this.ruleForm.other_accounts
            }).then(response => {
              if (response.data.exchange.body.code === 1) {
                this.dialogFormVisible = false
                Message({
                  message: response.data.exchange.body.message + '密码为：' + response.data.exchange.body.password,
                  type: 'success',
                  duration: 6 * 1000
                })
                findAllAccount({ departName: '' }).then(response => {
                  this.queryStaff(response)
                })
              } else {
                Message({
                  message: response.data.exchange.body.message,
                  type: 'error',
                  duration: 6 * 1000
                })
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
            if (this.checkedPermission.indexOf(undefined) !== -1) {
              this.checkedPermission.splice(this.checkedPermission.indexOf(undefined), 1)
            }
            modifyAccount({
              agentid: this.ruleFormReverse.agentId,
              organ: this.ruleFormReverse.departId,
              other_accounts: this.ruleFormReverse.other_accounts,
              chk: this.checkedPermission
            }).then(response => {
              if (response.data.exchange.body.code === 1) {
                this.dialogFormVisibleReverse = false
                findAllAccount({ departName: this.$route.query.departName ? this.$route.query.departName : '' }).then(responsedata => {
                  this.queryStaff(responsedata)
                })
              } else {
                Message({
                  message: response.data.exchange.body.message,
                  type: 'error',
                  duration: 6 * 1000
                })
              }
            })
          } else {
            return false
          }
        })
      },
      resetForm(formName) {
        this.checkedPermission = []
        this.checkedRoles = []
        this.ruleForm = {
          departId: '',
          upDepartName: '',
          departName: '',
          agentId: '',
          other_accounts: []
        }
      },
      resetFormReverse() {
        this.resetReverse(this.ruleFormReverse.agentId)
      },
      reset() {
        this.timeValue = ''
        this.formInline = {
          staffName: '',
          angentId: '',
          creator: '',
          start_time: '',
          end_time: '',
          departName: '',
          status: '',
          from: this.pagination.pageNo
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
        console.log(val)
      },
      handleCheckAgent(value) {
        this.check(value, 'agent')
      },
      handleCheckMonitor(value) {
        this.check(value, 'monitor')
      },
      handleCheckChief(value) {
        this.check(value, 'chief')
      },
      handleCheckQc(value) {
        this.check(value, 'qc')
      },
      handleCheckQcmonitor(value) {
        this.check(value, 'qcmonitor')
      },
      handleCheckQcchief(value) {
        this.check(value, 'qcchief')
      },
      check(bool, item) {
        readProp({ item: item }).then(response => {
          if (response.data.length) {
            if (bool) {
              for (let i = 0; i <= response.data.length; i++) {
                if (this.checkedPermission.indexOf(response.data[i]) === -1) {
                  this.checkedPermission.push(response.data[i])
                }
              }
            } else {
              for (let i = 0; i <= response.data.length; i++) {
                if (this.checkedPermission.indexOf(response.data[i]) !== -1) {
                  this.checkedPermission.splice(this.checkedPermission.indexOf(response.data[i]), 1)
                }
              }
            }
          }
        })
      },
      handleCheckedRolesChange(value) {
        // 选中之后的数据组成的数组
        console.log(value)
      },
      handleCheckedPermissionChange(value) {
        console.log(this.checkedPermission)
      },
      handleClick(row) {
        this.checkedPermission = []
        this.dialogFormVisibleReverse = true
        findAccountByAgentid({ agentid: row.agentId }).then(response => {
          if (response.data.code === 1) {
            this.ruleFormReverse = {
              departId: row.departId,
              upDepartName: response.data.depart.upDepartName,
              departName: response.data.depart.departName,
              agentId: response.data.account.angentId,
              other_accounts: response.data.otherAccount
            }
            getRoleList().then(responseRole => {
              if (responseRole.data.code === 1) {
                this.permissions = responseRole.data.data
                for (let i = 0; i <= response.data.account.roles.length; i++) {
                  if (response.data.account.roles[i]) {
                    this.checkedPermission.push(response.data.account.roles[i].roleNumber)
                  }
                }
              }
            })
          }
        })
      },
      handleClickDetail(row) {
        this.dialogFormVisibleDetail = true
        findAccountByAgentid({ agentid: row.agentId }).then(response => {
          if (response.data.code === 1) {
            this.ruleFormReverseDetail = {
              agentId: response.data.account.angentId,
              departName: response.data.depart.departName,
              creator: response.data.account.creator,
              createTime: formatDateTime(response.data.account.createTime),
              roles: response.data.account.roles,
              other_accounts: response.data.otherAccount
            }
          }
        })
        // row已经包含了单个的数据
      },
      handleClickPass(row) {
        resetPWDById({ agentId: row.agentId }).then(response => {
          if (response.data.code === 1) {
            Message({
              message: '重置密码成功，密码为该员工身份证的后六位',
              type: 'success',
              duration: 3 * 1000
            })
          }
        })
      },
      handleClickStop(row) {
        changeState({
          angentId: row.agentId,
          status: 0
        }).then(response => {
          if (response.data.code === 1) {
            findAllAccount({ departName: '' }).then(responseData => {
              this.queryStaff(responseData)
            })
          }
        })
      },
      handleClickStart(row) {
        changeState({
          angentId: row.agentId,
          status: 1
        }).then(response => {
          if (response.data.code === 1) {
            findAllAccount({ departName: '' }).then(responseData => {
              this.queryStaff(responseData)
            })
          }
        })
      },
      handleClickAdd(row) {
        this.checkedPermission = []
        this.checkedRoles = []
        this.dialogFormVisible = true
        this.ruleForm.departName = row.departName
        this.ruleForm.agentId = row.agentId
        this.ruleForm.departId = row.departId
        findOrganById({ id: row.departId }).then(response => {
          if (response.data.code === 1) {
            this.ruleForm.upDepartName = response.data.data.upDepartName
          }
        })
        getRoleList().then(responseRole => {
          if (responseRole.data.code === 1) {
            this.permissions = responseRole.data.data
          }
        })
      },
      resetReverse(id) {
        findAccountByAgentid({ agentid: id }).then(response => {
          if (response.data.code === 1) {
            this.ruleFormReverse = {
              departId: response.data.depart.departId,
              upDepartName: response.data.depart.upDepartName,
              departName: response.data.depart.departName,
              agentId: response.data.account.angentId,
              other_accounts: response.data.otherAccount
            }
            this.checkedPermission = []
            this.checkedRoles = []
            for (let i = 0; i <= response.data.account.roles.length; i++) {
              if (response.data.account.roles[i]) {
                this.checkedPermission[i] = response.data.account.roles[i].roleNumber
              }
            }
          }
        })
      },
      handleCurrentChange(val) {
        this.formInline.from = val
        this.formInline.start_time = this.timeValue[0]
        this.formInline.end_time = this.timeValue[1]
        findAllAccount(this.formInline).then(response => {
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
        this.tableData = []
        this.pagination = res.data.pageInfo
        if (res.data.data && (res.data.data.length !== 0)) {
          for (let i = 0; i <= res.data.data.length; i++) {
            if (res.data.data[i] && (res.data.data.length !== 0)) {
              var data = {}
              data.updateTime = formatDateTime(res.data.data[i][8])
              data.agentId = res.data.data[i][5]
              data.staffName = res.data.data[i][2]
              data.departName = res.data.data[i][3]
              data.statusZH = (res.data.data[i][6] === 0) ? '已停用' : ((res.data.data[i][6] === 1) ? '启用中' : ((res.data.data[i][6] === 2) ? '未启用' : ''))
              data.status = res.data.data[i][6]
              data.modifier = res.data.data[i][9]
              data.departId = res.data.data[i][7]
              data.userPhone = res.data.data[i][4]
              this.tableData.push(data)
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
        req.start_time = this.timeValue[0]
        req.end_time = this.timeValue[1]
        findAllAccount(req).then(response => {
          this.queryStaff(response)
        })
      },
      refreshOrganTo() {
        findAllOrganTo().then(response => {
          this.regionOptions = response.data.data
        })
      }
    },
    created() {
      if (this.$route.query.departName) {
        findAllAccount({ departName: this.$route.query.departName }).then(response => {
          this.queryStaff(response)
          this.formInline.departName = this.$route.query.departName
          this.pagination = response.data.pageInfo
        })
      } else {
        findAllAccount({ departName: '' }).then(response => {
          this.queryStaff(response)
        })
      }
      this.refreshOrganTo()
    },
    watch: {
      $route(to, from) {
        // 判断url是否带参
        if (!to.query.departName) {
          this.formInline.departName = ''
          findAllAccount({ departName: '' }).then(response => {
            this.queryStaff(response)
          })
        }
      }
    }
  }
</script>
<style>
  .el-checkbox+.el-checkbox {
    margin-left: 0px;
  }
  .el-checkbox__label {
    padding-left: 0px;
  }
  .reverse{
    width: 70%;
  }
</style>
