<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-form :inline="true" class="demo-form-inline" size="small">
          <el-form-item label="员工姓名：">
            <el-input placeholder="员工姓名（限长45字符）" v-model="formInline.staffName" maxlength="45"></el-input>
          </el-form-item>
          <el-form-item label="系统账号：">
            <el-input placeholder="系统账号（限长45字符）" v-model="formInline.angentId" maxlength="45"></el-input>
          </el-form-item>
          <el-form-item label="账号状态：">
            <el-select v-model="formInline.status">
              <el-option label="所有情况" value=""></el-option>
              <el-option label="已停用" value="0"></el-option>
              <el-option label="启用中" value="1"></el-option>
              <el-option label="未启用" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属组织：">
            <el-select v-model="formInline.departName" placeholder="所属组织">
              <el-option v-for="item in regionOptions" :key="item.departName" :label="item.departName" :value="item.departName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="操作人：">
            <el-input placeholder="操作人（限长45字符）" v-model="formInline.creator" maxlength="45"></el-input>
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
            <el-button type="danger" @click="reset">重置</el-button>
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
            prop="agentId"
            label="系统账号"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            align="center"
            prop="staffName"
            label="姓名"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.staffName }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="departName"
            label="所属组织"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.departName }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="statusZH"
            label="账号状态"
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
            prop="updateTime"
            label="操作时间"
            width="155">
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
            background
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
    </div>
    <el-dialog title="赋予系统账号角色" :visible.sync="dialogFormVisible" width="70%" append-to-body>
      <el-row>
        <el-card>
          <el-row slot="header">
            <el-col>
              <div>
                <b>工号：</b>
                <span>{{ruleFormReverse.agentId}}</span>
                <b v-if="ruleFormReverse.upDepartName!=='0'" style="margin-left:30px;">上级部门：</b>
                <span v-if="ruleFormReverse.upDepartName!=='0'">{{ruleFormReverse.upDepartName}}</span>
                <b style="margin-left:30px;">所属部门：</b>
                <span>{{ruleFormReverse.departName}}</span>
              </div>
            </el-col>
          </el-row>
          <div style="text-align:center">
            <el-checkbox-group v-model="checkRoleData2" @change="checkRoles">
              <el-checkbox-button v-for="(item,key) in roleLists" :label="key" :key="item">{{item}}</el-checkbox-button>
            </el-checkbox-group>
          </div>
          <el-row style="margin-top:10px;" v-if="roleMenu.length!=0">
              <el-card>
                <el-row v-model="activeName" style="border-bottom:1px solid #EBEEF5;">
                  <el-row style="color:#B4B4B4;margin-bottom:10px;"><b style="font-size:20px;">所选角色的可用功能为：</b></el-row>
                  <el-col :span="4" v-for="item in roleMenu" style="margin-top:5px;border-bottom:1px solid #EBEEF5;">{{item.name}}</el-col>
                </el-row>
              </el-card>
          </el-row>
        </el-card>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="checkRoleData2=[];roleMenu=[]">重置</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole(roleIds)">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改系统账号角色" :visible.sync="dialogFormVisibleReverse" width="70%" append-to-body>
      <el-row>
        <el-card>
          <el-row slot="header">
            <el-col>
              <div>
                <b>工号：</b>
                <span>{{ruleFormReverse.agentId}}</span>
                <b v-if="ruleFormReverse.upDepartName!=='0'" style="margin-left:30px;">上级部门：</b>
                <span v-if="ruleFormReverse.upDepartName!=='0'">{{ruleFormReverse.upDepartName}}</span>
                <b style="margin-left:30px;">所属部门：</b>
                <span>{{ruleFormReverse.departName}}</span>
              </div>
            </el-col>
          </el-row>
          <div style="text-align:center">
            <el-checkbox-group v-model="checkRoleData2" @change="checkRoles">
              <el-checkbox-button v-for="(item,key) in roleLists" :label="key" :key="item">{{item}}</el-checkbox-button>
            </el-checkbox-group>
          </div>
          <el-row style="margin-top:10px;" v-if="roleMenu.length!=0">
              <el-card>
                <el-row v-model="activeName" style="border-bottom:1px solid #EBEEF5;">
                  <el-row style="color:#B4B4B4;margin-bottom:10px;"><b style="font-size:20px;">所选角色的可用功能为：</b></el-row>
                  <el-col :span="4" v-for="item in roleMenu" style="margin-top:5px;border-bottom:1px solid #EBEEF5;">{{item.name}}</el-col>
                </el-row>
              </el-card>
          </el-row>
        </el-card>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="getUserRole(ruleFormReverse.agentId)">重置</el-button>
        <el-button @click="dialogFormVisibleReverse = false">取 消</el-button>
        <el-button type="primary" @click="editRole(roleIds)">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="系统账号详情" :visible.sync="dialogFormVisibleDetail" width="70%" append-to-body>
     <el-row>
        <el-card>
          <el-row slot="header">
            <el-col>
              <div>
                <b>工号：</b>
                <span>{{ruleFormReverse.agentId}}</span>
                <b v-if="ruleFormReverse.upDepartName!=='0'" style="margin-left:30px;">上级部门：</b>
                <span v-if="ruleFormReverse.upDepartName!=='0'">{{ruleFormReverse.upDepartName}}</span>
                <b style="margin-left:30px;">所属部门：</b>
                <span>{{ruleFormReverse.departName}}</span>
              </div>
            </el-col>
          </el-row>
          <div style="text-align:center">
            <el-checkbox-group v-model="checkRoleData2" @change="checkRoles">
              <el-checkbox-button class="detailChkBox" v-for="(item,key) in roleLists" :label="key" :key="item">{{item}}</el-checkbox-button>
            </el-checkbox-group>
          </div>
          <el-row style="margin-top:10px;" v-if="roleMenu.length!=0">
              <el-card>
                <el-row v-model="activeName" style="border-bottom:1px solid #EBEEF5;">
                  <el-row style="color:#B4B4B4;margin-bottom:10px;"><b style="font-size:20px;">所选角色的可用功能为：</b></el-row>
                  <el-col :span="4" v-for="item in roleMenu" style="margin-top:5px;border-bottom:1px solid #EBEEF5;">{{item.name}}</el-col>
                </el-row>
              </el-card>
          </el-row>
        </el-card>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisibleDetail = false">返回</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  findAllAccount,
  queryDepts,
  changeState,
  resetPWDById,
  findAccountByAgentid,
  readProp,
  alterAccountList,
  addAccount,
  // 角色
  getRoles,
  getMenuById,
  addRole,
  getUserRole,
  editRole
} from '@/api/account_list'
import { Message, MessageBox } from 'element-ui'
import { formatDateTime } from '@/utils/tools'

export default {
  name: 'account_list',
  data() {
    return {
      rule: {
        checkRoleData2: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ]
      },
      validate: false,
      permissions: [],
      roleIds: [],
      roleLists: {},
      roles: [],
      activeName: ['1'],
      checkRoleData: [],
      checkRoleData2: [],
      roleMenu: [],
      tabName: '',
      checkAgent: false,
      checkMonitor: false,
      checkChief: false,
      checkQc: false,
      checkQcmonitor: false,
      checkQcchief: false,
      checkedPermission: [],
      // roles: [
      //   {
      //     name: '普通坐席',
      //     label: 'agent'
      //   },
      //   {
      //     name: '团队长坐席',
      //     label: 'monitor'
      //   },
      //   {
      //     name: '坐席主管',
      //     label: 'chief'
      //   },
      //   {
      //     name: '质检员',
      //     label: 'qc'
      //   },
      //   {
      //     name: '质检队长',
      //     label: 'qcmonitor'
      //   },
      //   {
      //     name: '质检主管',
      //     label: 'qcchief'
      //   }
      // ],
      checkedRoles: [],
      timeValue: [],
      staffData: {},
      pagination: {
        pageSize: null,
        pageNo: null,
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
        pageNo: 1,
        departName: '',
        status: '',
        pageSize: 10
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
        qwe: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        w: [{ required: true, message: '请输入账号', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.getRoles()
  },
  methods: {
    // 查询所有角色列表
    getRoles() {
      getRoles().then(response => {
        var result = response.data.result
        for (var i = 0; i < response.data.result.length; i++) {
          this.roleLists[result[i].id] = result[i].roleName
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 查询用户对应角色
    getUserRole(userId) {
      getUserRole(userId).then(response => {
        this.checkRoleData2 = []
        if (response.data.result.length) {
          for (var i = 0; i < response.data.result.length; i++) {
            this.checkRoleData2.push(response.data.result[i].id.toString())
          }
        }
        this.roleIds = this.checkRoleData2
        if (this.checkRoleData2.length) {
          getMenuById(this.checkRoleData2.join(',')).then(response => {
            if (response.data.result.length !== undefined) {
              // 一级菜单不显示
              this.roleMenu.length = 0
              for (var i = 0; i < response.data.result.length; i++) {
                if (response.data.result[i].parentId !== '0') {
                  this.roleMenu.push(response.data.result[i])
                }
              }
            }
          }).catch(error => {
            if (error.response.status === 403) {
              this.roleMenu = []
            }
            console.log(error)
          })
        } else {
          this.roleMenu = []
        }
      })
    },
    // 选中角色事件
    checkRoles(val) {
      this.roleIds = val
      getMenuById(val.join(',')).then(response => {
        if (response.data.result.length !== undefined) {
          // 一级菜单不显示
          this.roleMenu.length = 0
          for (var i = 0; i < response.data.result.length; i++) {
            if (response.data.result[i].parentId !== '0') {
              this.roleMenu.push(response.data.result[i])
            }
          }
        } else {
          this.roleMenu.length = 0
        }
      }).catch(error => {
        this.roleMenu = []
        console.log(error)
      })
    },
    // 赋予角色
    addRole(roleIds) {
      if (this.checkRoleData2.length === 0) {
        this.$message.error('请选择角色')
        return false
      }
      addRole(this.ruleFormReverse.agentId, roleIds).then(response => {
        if (response.status === 200) {
          this.dialogFormVisible = false
          this.$message({
            message: '赋予用户角色成功',
            type: 'success'
          })
          if (this.$route.query.departName) {
            this.formInline.departName = this.$route.query.departName
            findAllAccount(this.formInline).then(
              response => {
                this.queryStaff(response)
                this.formInline.departName = this.$route.query.departName
                this.pagination = response.data.pageInfo
              }
            )
          } else {
            findAllAccount(this.formInline).then(response => {
              this.queryStaff(response)
            })
          }
        } else {
          this.$message({
            message: '赋予用户角色失败',
            type: 'error'
          })
        }
      }).catch(error => {
        this.$message({
          message: '赋予用户角色失败',
          type: 'error'
        })
        console.log(error)
      })
    },
    // 修改角色
    editRole(roleIds) {
      if (this.checkRoleData2.length === 0) {
        this.$message({
          message: '请选择角色',
          type: 'error'
        })
        return false
      }
      editRole(this.ruleFormReverse.agentId, roleIds).then(response => {
        if (response.status === 200) {
          this.dialogFormVisibleReverse = false
          this.$message({
            message: '修改角色成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '修改角色失败',
            type: 'error'
          })
        }
      }).catch(error => {
        this.$message({
          message: '修改角色失败',
          type: 'error'
        })
        console.log(error)
      })
    },
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
            this.formInline.departName = ''
            findAllAccount(this.formInline).then(responsedata => {
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
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.checkedPermission.indexOf(undefined) !== -1) {
            this.checkedPermission.splice(
              this.checkedPermission.indexOf(undefined),
              1
            )
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
                message:
                  response.data.exchange.body.message +
                  '密码为：' +
                  response.data.exchange.body.password,
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
    // submitRoleForm(formName) {
    //   if (this.$refs[formName] !== undefined) {
    //     this.$refs[formName].validate(valid => {
    //       if (valid) {
    //         this.validate = true
    //       } else {
    //         this.validate = false
    //       }
    //     })
    //   }
    // },
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
      this.timeValue = []
      this.formInline = {
        staffName: '',
        angentId: '',
        creator: '',
        start_time: '',
        end_time: '',
        departName: '',
        status: '',
        pageNo: this.pagination.pageNo,
        pageSize: this.pagination.pageSize
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
                this.checkedPermission.splice(
                  this.checkedPermission.indexOf(response.data[i]),
                  1
                )
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
        }
      })
      this.getUserRole(row.agentId)
    },
    handleClickDetail(row) {
      this.dialogFormVisibleDetail = true
      findAccountByAgentid({ agentid: row.agentId }).then(response => {
        if (response.data.code === 1) {
          this.ruleFormReverse = {
            departId: row.departId,
            upDepartName: response.data.depart.upDepartName,
            departName: response.data.depart.departName,
            agentId: response.data.account.angentId,
            other_accounts: response.data.otherAccount
          }
        }
      })
      this.getUserRole(row.agentId)
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
          this.formInline.departName = ''
          findAllAccount(this.formInline).then(responseData => {
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
          this.formInline.departName = ''
          findAllAccount(this.formInline).then(responseData => {
            this.queryStaff(responseData)
          })
        }
      })
    },
    handleClickAdd(row) {
      this.dialogFormVisible = true
      this.ruleForm.departName = row.departName
      this.ruleForm.agentId = row.agentId
      this.ruleForm.departId = row.departId
      this.roleMenu.length = 0
      this.checkRoleData2 = []
      findAccountByAgentid({ agentid: row.agentId }).then(response => {
        if (response.data.code === 1) {
          this.ruleFormReverse = {
            departId: row.departId,
            upDepartName: response.data.depart.upDepartName,
            departName: response.data.depart.departName,
            agentId: response.data.account.angentId,
            other_accounts: response.data.otherAccount
          }
        }
      })
    },
    resetReverse(id) {
      this.handleClick(id)
    },
    handleSizeChange(val) {
      this.pagination.pageNo = 1
      this.formInline.pageSize = val
      this.searchStaff(this.formInline)
    },
    handleCurrentChange(val) {
      this.formInline.pageNo = val
      this.formInline.start_time = this.timeValue ? this.timeValue[0] : null
      this.formInline.end_time = this.timeValue ? this.timeValue[1] : null
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
      if (res.data.data && res.data.data.length !== 0) {
        for (let i = 0; i <= res.data.data.length; i++) {
          if (res.data.data[i] && res.data.data.length !== 0) {
            var data = {}
            data.updateTime = formatDateTime(res.data.data[i][8])
            data.agentId = res.data.data[i][5]
            data.staffName = res.data.data[i][2]
            data.departName = res.data.data[i][3]
            data.statusZH =
              res.data.data[i][6] === 0
                ? '已停用'
                : res.data.data[i][6] === 1
                  ? '启用中'
                  : res.data.data[i][6] === 2 ? '未启用' : ''
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
      req.pageNo = 1
      req.start_time = this.timeValue ? this.timeValue[0] : null
      req.end_time = this.timeValue ? this.timeValue[1] : null
      findAllAccount(req).then(response => {
        this.queryStaff(response)
      })
    },
    refreshOrganTo() {
      queryDepts().then(response => {
        this.regionOptions = response.data.data
      })
    }
  },
  created() {
    if (this.$route.query.departName) {
      findAllAccount({ departName: this.$route.query.departName }).then(
        response => {
          this.queryStaff(response)
          this.formInline.departName = this.$route.query.departName
          this.pagination = response.data.pageInfo
        }
      )
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
.el-checkbox + .el-checkbox {
  margin-left: 0px;
}
.el-checkbox__label {
  padding-left: 0px;
}
.reverse {
  width: 70%;
}
</style>
