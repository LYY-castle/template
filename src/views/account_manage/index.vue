<template>
  <div class="app-container">
    <div class="filter-container">
      <el-collapse v-model="formContainerOpen" class="form-container" @change="handleChangeAcitve">
        <el-collapse-item title="筛选条件" name="1">
          <el-form :inline="true" class="demo-form-inline" size="small">
            <el-form-item label="员工姓名：">
              <el-input placeholder="员工姓名（限长45字符）" v-model="formInline.staffName" maxlength="45"></el-input>
            </el-form-item>
            <el-form-item label="系统账号：">
              <el-input placeholder="系统账号（限长45字符）" v-model="formInline.angentId" maxlength="45"></el-input>
            </el-form-item>
            <el-form-item label="账号状态：">
              <el-select v-model="formInline.status"  style="width:7em">
                <el-option label="全部" value=""></el-option>
                <el-option label="已停用" value="0"></el-option>
                <el-option label="启用中" value="1"></el-option>
                <el-option label="未启用" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属部门：" >
              <el-cascader
                v-model="selected_dept_id"
                placeholder="请选择部门"
                :options="regionOptions"
                :props="org_props"
                show-all-levels
                filterable
                size="small"
                change-on-select
                
              ></el-cascader>
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
              <el-button @click="reset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
      <el-row class="table-container">
        <el-row class="margin-bottom-20">
          <div class="font14 bold">账号管理表</div>
        </el-row>
        <el-row class="margin-bottom-20">
           <el-button type="primary" size="small" @click="addAccountVisible=true;resetStaffForm(),roleMenu=[],resetAddAcountModel()">新建</el-button>
          <el-dropdown size="small" trigger="click" @command="moreOperating" style="margin-left:10px">
            <el-button type="info" style="width:auto">
              更多操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown" class="info">
              <el-dropdown-item command='1'>批量启用</el-dropdown-item>
              <el-dropdown-item command='0'>批量停用</el-dropdown-item>
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

            <!-- <el-table-column type="expand">
              <template slot-scope="props">
                 <el-table
                  :data="props.row.accountCertResultInfos"
                  stripe
                  style="width: 30%;background:#fff"
                  :header-cell-style="getRowClass"
                  >
                  <el-table-column
                    align="center"
                    label="用户名"
                    prop="userName"
                    width="180">
                    
                  </el-table-column>
                  
                  <el-table-column
                    align="center"
                    prop="type"
                    label="类型">
                    <template slot-scope="scope">
                    <span>{{returnType(scope.row.type)}}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column> -->


            <el-table-column
              align="center"
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              align="center"
              prop="accountNo"
              label="系统账号"
              :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
              align="center"
              label="姓名"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{ scope.row.staffResultInfo?scope.row.staffResultInfo.name:"" }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="departName"
              label="所属部门"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{ scope.row.staffResultInfo?(scope.row.staffResultInfo.depart?scope.row.staffResultInfo.depart.name:"") :""}}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="账号状态"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <div :class="scope.row.status===0?'invisible':scope.row.status=== 1?'visible':'not-enabled'">
                  <span>{{returnStatus(scope.row.status)}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="modifier"
              label="操作人"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{ scope.row.modifier?scope.row.modifier:"" }}
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
              width="250">
              <template slot-scope="scope">
                <el-button @click="handleClickDetail(scope.row)" type="text" size="small" v-show="scope.row.status !== 2">详情</el-button>
                <!-- <el-button @click="handleClickAdd(scope.row)" type="text" size="small" v-show="scope.row.status === 2">增加</el-button> -->
                <el-button @click="checkRoleData2 = [],roleIds=[],handleClick(scope.row)" type="text" size="small" v-show="scope.row.status !== 2">修改</el-button>
                <el-button @click="handleClickPass(scope.row)" type="text" size="small" v-show="scope.row.status !== 2">重置密码</el-button>
                <el-button @click="handleClickStop(scope.row)" type="text" size="small" v-show="scope.row.status === 1">停用</el-button>
                <el-button @click="handleClickStart(scope.row)" type="text" size="small" v-show="scope.row.status === 0">启用</el-button>
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
        <el-button type="primary" @click="addRole(roleIds)">确定</el-button>
        <el-button @click="checkRoleData2=[];roleMenu=[]">重置</el-button>
        <el-button plain type="primary" @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
<!-- 新建 -->
    <el-dialog title="新建系统账号" :visible.sync="addAccountVisible" width="70%" append-to-body>
      <el-row>
        <el-card>
          <el-row slot="header">
            <el-col>
              <div>
                <el-collapse v-model="formContainerOpenAdd"  class="form-container"  @change="handleChangeAcitveAdd">
                  <el-collapse-item title="筛选条件" name="1">
                    <el-form :inline="true" class="demo-form-inline" size="small">
                      <el-form-item label="员工姓名：">
                        <el-input placeholder="员工姓名（上限45字符）" v-model="staffForm.name" maxlength="45"></el-input>
                      </el-form-item>
                      <el-form-item label="员工工号：">
                        <el-input placeholder="员工工号（上限45字符）" v-model="staffForm.staffNo" maxlength="45"></el-input>
                      </el-form-item>
                      <el-form-item label="所属部门：">
                        <el-cascader
                          v-model="staff_dept_ids"
                          placeholder="请选择部门"
                          :options="regionOptions"
                          :props="org_props"
                          show-all-levels
                          filterable
                          size="small"
                          change-on-select
                        ></el-cascader>
                      </el-form-item>
                      <el-form-item>
                        <el-button type="primary" @click="findStaff()">查询</el-button>
                        <el-button @click="resetStaffForm()">重置</el-button>
                      </el-form-item>
                    </el-form>
                  </el-collapse-item>
                </el-collapse>
                <el-form size="small" :model="addAccountModel"  ref="addRuleForm" label-width="100px" class="demo-ruleForm" style="margin-top:20px">
                  <el-form-item label="员工:">
                    <el-select v-model="addAccountModel.staffId" >
                      <el-option value="" label="请选择员工"></el-option>
                      <el-option v-for="item in staffAll" :key="item.id" :label="item.name ? item.name + ' (' + item.staffNo + ')' : item.staffNo" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                  <!-- <el-form-item label="用户名:" prop="userName"  >
                    <el-input v-model="addAccountModel.userName" maxlength="20" placeholder="上限45字符" style="width:30%"></el-input>
                  </el-form-item>
                  <el-form-item label="密码:"  prop="password">
                    <el-input name="password"  :type="pwdType" v-model="addAccountModel.password" placeholder="请输入密码" style="width:30%"></el-input>
                    <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye"/></span>
                  </el-form-item> -->
                  <el-form-item label="状态:" prop="status">
                    <el-switch
                      v-model="addAccountModel.status"
                      active-text="启用中"
                      inactive-text="未启用"
                      active-color="#67C23A"
                      :active-value="1"
                      :inactive-value="2">
                    </el-switch>
                  </el-form-item>
                    <el-form-item label="类型:">
                    <el-select v-model="addAccountModel.type" >
                      <el-option value="" label="请选择类型"></el-option>
                      <el-option :value="0" label="系统账号"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
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
        <el-button type="primary" @click="addRole(roleIds)">确定</el-button>
        <el-button @click="roleMenu=[],resetAddAcountModel()">重置</el-button>
        <el-button type="primary" plain @click="addAccountVisible = false">取消</el-button>
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
        <el-button type="primary" @click="editRole(roleIds)">确定</el-button>
        <el-button @click="getUserRole(ruleFormReverse.accountNo)">重置</el-button>
        <el-button type="primary" plain @click="dialogFormVisibleReverse = false">取消</el-button>
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
        <el-button plain type="primary" @click="dialogFormVisibleDetail = false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="30%"
      title="批量操作"
      :visible.sync="batchDelVisible"
      append-to-body>
      <span style="font-size:20px;">确定<span v-if="batchStatus===1">启用</span><span v-if="batchStatus===0">停用</span>选定内容？</span>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button size="small" type="primary" @click="batchDelVisible = false;all();">确定</el-button>
        <el-button size="small" type="primary" plain @click="batchDelVisible = false">取消</el-button>
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
  findStaffById,
  readProp,
  alterAccountList,
  addAccount,
  // 角色
  getRoles,
  getMenuById,
  addRole,
  getUserRole,
  editRole,
  queryStaff
} from '@/api/account_list'
import { Message } from 'element-ui'
import { formatDateTime, list2Tree } from '@/utils/tools'
import md5 from 'js-md5'

export default {
  name: 'account_list',
  data() {
    return {
      pwdType: 'password',
      addAccountVisible: false,
      batchDelVisible: false,
      batchStatus: '',
      formContainerOpen: '1',
      formContainerOpenAdd: '1',
      formContainer: this.$store.state.app.formContainer,
      selected_dept_id: [], // 查询条件
      new_dept_ids: [],
      staff_dept_ids: [],
      staffAll: [],
      staffForm: {
        name: '',
        staffNO: '',
        departId: ''
      },
      addAccountModel: {
        creator: '',
        creatorId: '',
        password: '',
        staffId: '',
        status: 1,
        type: 0,
        userName: '',
        roleIds: []
      },
      org_props: {
        label: 'name',
        value: 'id',
        children: 'children'
      },
      // 是否显示微信相关
      show_wechat: `${process.env.SHOW_WECHAT}`,
      tempRoute: {},
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
        staffNo: '',
        modifier: '',
        startTime: '',
        stopTime: '',
        pageNo: 1,
        departId: '',
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
        accountNo: '',
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
    this.formContainer()
    this.handleChangeAcitve()
    this.handleChangeAcitveAdd()
    this.tempRoute = Object.assign({}, this.$route)
    // this.setTagsViewTitle()
    this.getRoles()
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    findStaff() {
      this.addAccountModel.staffId = ''
      this.staffForm.pageable = false
      if (this.staff_dept_ids.length > 0) {
        this.staffForm.departId = this.staff_dept_ids[this.staff_dept_ids.length - 1]
      }
      queryStaff(this.staffForm).then(response => {
        this.staffAll = response.data.data
        console.log('staffAll', this.staffAll)
      })
    },
    handleChangeAcitve(active = ['1']) {
      if (active.length) {
        $('.form-more').text('收起')
      } else {
        $('.form-more').text('更多')
      }
    },
    handleChangeAcitveAdd(active = ['1']) {
      if (active.length) {
        $('.form-more').text('收起')
      } else {
        $('.form-more').text('更多')
      }
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background:#fff'
      } else {
        return ''
      }
    },
    returnType(type) {
      if (type === 0) {
        return '系统账号'
      } else {
        return '其他账号'
      }
    },
    // 更多操作
    moreOperating(val) {
      if (val === '1') {
        this.batchStatus = 1
        this.batchDelVisible = true
      } else {
        this.batchStatus = 0
        this.batchDelVisible = true
      }
    },
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
          // 判断是否需要展示微信相关
          if (this.show_wechat === 'false') {
            for (var j = 0; j < this.roleMenu.length; j++) {
              if (this.roleMenu[j].id === 58) {
                this.roleMenu.splice(j, 1)
              }
            }
          }
        } else {
          this.roleMenu.length = 0
        }
      }).catch(error => {
        this.roleMenu = []
        console.error(error)
      })
    },
    // 赋予角色
    addRole(roleIds) {
      if (!this.addAccountModel.staffId) {
        this.$message.error('请选择员工')
        return
      }
      if (this.checkRoleData2.length === 0) {
        this.$message.error('请选择角色')
        return false
      }
      if (this.addAccountModel.password) {
        this.addAccountModel.password = md5(this.addAccountModel.password)
      }
      this.addAccountModel.roleIds = roleIds
      // 标记后台什么请求
      this.addAccountModel['method'] = 'POST'
      addRole(this.addAccountModel).then(response => {
        if (response.status === 200) {
          this.dialogFormVisible = false
          this.$message({
            message: '赋予用户角色成功',
            type: 'success'
          })

          if (this.$route.params.id !== ':id') {
            this.formInline.departName = sessionStorage.getItem(this.$route.params.id)
            findAllAccount(this.formInline).then(
              response => {
                this.queryStaff(response)
                this.formInline.departName = sessionStorage.getItem(this.$route.params.id)
                this.pagination = response.data.pageInfo
              }
            )
          } else {
            findAllAccount(this.formInline).then(response => {
              this.queryStaff(response)
            })
          }
          this.addAccountVisible = false
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
      editRole(this.ruleFormReverse.accountNo, roleIds).then(response => {
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
    all() {
      const status = this.batchStatus
      const chk_box = this.multipleSelection.map(function(item, index) {
        return item.id
      })
      if (!chk_box || chk_box.length === 0) {
        Message({
          message: '请选择内容！',
          type: 'error',
          duration: 3 * 1000
        })
        return
      }
      alterAccountList({
        accountIds: chk_box,
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
              findAllAccount({ departId: '' }).then(response => {
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
      this.timeValue = []
      this.selected_dept_id = []
      this.formInline = {
        staffName: '',
        staffNo: '',
        modifier: '',
        startTime: '',
        stopTime: '',
        departName: '',
        departId: '',
        status: '',
        pageNo: this.pagination.pageNo,
        pageSize: this.pagination.pageSize
      }
    },
    resetAddAcountModel() {
      this.pwdType = 'password'
      this.checkRoleData2 = []
      this.addAccountModel = {
        creator: '',
        creatorId: '',
        password: '',
        staffId: '',
        status: 1,
        type: 0,
        userName: '',
        roleIds: []
      }
    },
    resetStaffForm() {
      this.staff_dept_ids = []
      this.staffForm = {
        name: '',
        staffNO: '',
        departId: ''
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
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
      findStaffById({ id: row.staffResultInfo.id }).then(response => {
        if (response.data.code === 1) {
          const result = response.data.data
          this.ruleFormReverse = {
            departId: result.depart ? (result.depart.id ? result.depart.id : '') : '',
            upDepartName: result.depart ? (result.depart.upDepartName ? result.depart.upDepartName : '') : '',
            departName: result.depart ? (result.depart.name ? result.depart.name : '') : '',
            agentId: result.staffNo,
            accountNo: row.accountNo
          }
        }
      })
      this.getUserRole(row.accountNo)
    },
    handleClickDetail(row) {
      this.dialogFormVisibleDetail = true
      findStaffById({ id: row.staffResultInfo.id }).then(response => {
        if (response.data.code === 1) {
          const result = response.data.data
          this.ruleFormReverse = {
            departId: result.depart ? (result.depart.id ? result.depart.id : '') : '',
            upDepartName: result.depart ? (result.depart.upDepartName ? result.depart.upDepartName : '') : '',
            departName: result.depart ? (result.depart.name ? result.depart.name : '') : '',
            agentId: result.staffNo,
            accountNo: row.accountNo
          }
        }
      })
      this.getUserRole(row.accountNo)
      // row已经包含了单个的数据
    },
    handleClickPass(row) {
      resetPWDById({ accountId: row.id }).then(response => {
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
        accountId: row.id,
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
        accountId: row.id,
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
      findStaffById({ agentid: row.agentId }).then(response => {
        if (response.data.code === 1) {
          const result = response.data.data
          this.ruleFormReverse = {
            departId: result.depart ? (result.depart.id ? result.depart.id : '') : '',
            upDepartName: result.depart ? (result.depart.upDepartName ? result.depart.upDepartName : '') : '',
            departName: result.depart ? (result.depart.name ? result.depart.name : '') : '',
            agentId: result.staffNo,
            accountNo: row.accountNo
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
      this.formInline.startTime = this.timeValue ? this.timeValue[0] : null
      this.formInline.stopTime = this.timeValue ? this.timeValue[1] : null
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
            this.tableData = res.data.data
            // var data = {}
            // data.updateTime = formatDateTime(res.data.data[i][8])
            // data.agentId = res.data.data[i][5]
            // data.staffName = res.data.data[i][2]
            // data.departName = res.data.data[i][3]
            // data.statusZH =
            //   res.data.data[i][6] === 0
            //     ? '已停用'
            //     : res.data.data[i][6] === 1
            //       ? '启用中'
            //       : res.data.data[i][6] === 2 ? '未启用' : ''
            // data.status = res.data.data[i][6]
            // data.modifier = res.data.data[i][9]
            // data.departId = res.data.data[i][7]
            // data.userPhone = res.data.data[i][4]
            // this.tableData.push(data)
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
    returnStatus(status) {
      if (status === 0) {
        return '已停用'
      } else if (status === 1) {
        return '启用中'
      } else {
        return '未启用'
      }
    },
    searchStaff(req) {
      // 根据老版本的逻辑 查询只能传分页页码的第一页
      req.pageNo = 1
      req.start_time = this.timeValue ? this.timeValue[0] : null
      req.end_time = this.timeValue ? this.timeValue[1] : null
      if (this.selected_dept_id.length === 0) {
        req.departId = ''
      } else {
        req.departId = this.selected_dept_id[this.selected_dept_id.length - 1]
      }
      console.log(req)
      findAllAccount(req).then(response => {
        this.queryStaff(response)
      })
    },
    refreshOrganTo() {
      queryDepts().then(response => {
        const map = {
          data: response.data.data,
          rootId: 0,
          idFieldName: 'id',
          parentIdFielName: 'upId'
        }
        this.regionOptions = list2Tree(map)
        if (this.$route.query.id !== ':id') {
          console.log('route', this.$route.query)
          const departId = this.$route.query.id
          const idPath = this.$route.query.idPath
          console.log('departId', departId)
          console.log('idPath', idPath)
          findAllAccount({ departId: departId }).then(
            response => {
              this.queryStaff(response)
              this.formInline.departId = departId
              this.pagination = response.data.pageInfo
            }
          )
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
          findAllAccount({ departId: '' }).then(response => {
            this.queryStaff(response)
          })
        }
      })
    }
    // setTagsViewTitle() {
    //   const route = Object.assign({}, this.tempRoute, { title: this.$route.params.id === ':id' ? this.tempRoute.meta.title : this.tempRoute.meta.title + '-' + sessionStorage.getItem(this.$route.params.id) })
    //   this.$store.dispatch('updateVisitedView', route)
    // }
  },
  created() {
    this.findStaff()

    this.refreshOrganTo()
  }
  // watch: {
  //   $route(to, from) {
  //     // 判断url是否带参
  //     if (!to.query.departName) {
  //       this.formInline.departName = ''
  //       findAllAccount({ departName: '' }).then(response => {
  //         this.queryStaff(response)
  //       })
  //     }
  //   }
  // }
}
</script>
<style scoped>
.el-checkbox + .el-checkbox {
  margin-left: 0px;
}
.el-checkbox__label {
  padding-left: 0px;
}
.reverse {
  width: 70%;
}
.btn-custom-cancel {
  float: right;
  margin-left: 10px;
}
.show-pwd {
      position: absolute;
      left: 27%;
      top: 0px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
</style>
