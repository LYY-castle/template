<template>
  <div class="app-container">
    <div class="filter-container">
      <el-collapse v-model="formContainerOpen" class="form-container" @change="handleChangeAcitve">
        <el-collapse-item title="筛选条件" name="1">
          <el-form :inline="true" class="demo-form-inline" size="small">
            <el-form-item label="组织编号：">
              <el-input placeholder="组织编号（限长11字符）" v-model="formInline.organ_id" maxlength="11"></el-input>
            </el-form-item>
            <el-form-item label="组织名：">
              <el-input placeholder="组织名（限长45字符）" v-model="formInline.organ_name" maxlength="45"></el-input>
            </el-form-item>
            <el-form-item label="上级组织：" v-if="$route.params.id === ':id'">
              <el-cascader
                v-model="selected_dept_id"
                placeholder="请选择组织"
                :options="allDepts"
                :props="org_props"
                show-all-levels
                filterable
                size="small"
                change-on-select
                clearable
              ></el-cascader>
              <!-- <el-select v-model="formInline.parent_organ_id" placeholder="上级组织">
                <el-option label="所有上级组织" value=""></el-option>
                <el-option label="一级组织" value="0"></el-option>
                <el-option v-for="item in allDepts" :key="item.departName" :label="item.departName" :value="item.id"></el-option>
              </el-select> -->
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
              <el-button type="primary" @click="formInline.pageNo = 1;searchOrgan(formInline)">查询</el-button>
              <el-button @click="reset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
      <el-row class="table-container">
        <el-row class="margin-bottom-20">
          <div class="font14 bold">组织管理表</div>
        </el-row>
        <el-row class="margin-bottom-20">
          <el-button type="success" size="small"  @click="dialogFormVisible = true;ruleForm.id = '';ruleForm.comment = '';new_dept_ids=[]">新建</el-button>
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
              prop="number"
              label="组织编号"
              :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
              align="center"
              prop="departName"
              label="组织名"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{ scope.row.departName }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="upDepartName"
              label="上级组织"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{ scope.row.upDepartName }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="组织状态"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <div :class="scope.row.visible===0?'invisible':'visible'">
                  <span>{{scope.row.visible===0?'不可见':'可见'}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="comment"
              label="备注"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{ scope.row.comment }}
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
              width="155">
            </el-table-column>
            <el-table-column
              align="center"
              label="操作"
              width="300">
              <template slot-scope="scope">
                <el-button @click="handleClickOrgan(scope.row)" type="text" size="small">下属组织</el-button>
                <el-button @click="handleClickStaff(scope.row)" type="text" size="small">下属人员</el-button>
                <el-button @click="handleClickUser(scope.row)" type="text" size="small">下属账号</el-button>
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
    <el-dialog title="新建组织" :visible.sync="dialogFormVisible" width="30%" @close="resetForm('ruleForm')" append-to-body>
      <el-form size="small" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="组织名" prop="departName">
          <el-input size="small" v-model="ruleForm.departName" placeholder="上限45字符" maxlength="45"></el-input>
        </el-form-item>
        <el-form-item label="上级组织">
          <el-cascader
            v-model="new_dept_ids"
            placeholder="请选择组织"
            :options="regionOptions"
            :props="org_props"
            show-all-levels
            filterable
            size="small"
            change-on-select
            clearable
          ></el-cascader>
          <!-- <el-select v-model="ruleForm.id" placeholder="请选择部门" style="width: 100%;">
            <el-option label="根组织" value=""></el-option>
            <el-option v-for="item in regionOptions" :key="item.departName" :label="item.departName" :value="item.id"></el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item label="组织状态">
          <el-switch
            v-model="ruleForm.visible"
            active-text="可见"
            inactive-text="不可见"
            active-color="#13ce66"
            :active-value=1
            :inactive-value=0
          ></el-switch>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="ruleForm.comment" placeholder="上限255字符" maxlength="255"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button plain type="primary" @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改组织" :visible.sync="dialogFormVisibleReverse" width="30%" @close="resetForm('ruleFormReverse')" append-to-body>
      <el-form size="small" :model="ruleFormReverse" :rules="rules" ref="ruleFormReverse" label-width="100px" class="demo-ruleForm">
        <el-form-item label="组织编号">
          <span>{{ruleFormReverse.number}}</span>
        </el-form-item>
        <el-form-item label="组织名" prop="departName">
          <el-input v-model="ruleFormReverse.departName" placeholder="上限45字符" maxlength="45"></el-input>
        </el-form-item>
        <el-form-item label="上级组织">
          <el-cascader
            v-model="edit_dept_ids"
            placeholder="请选择组织"
            :options="regionOptions"
            :props="org_props"
            show-all-levels
            filterable
            size="small"
            change-on-select
            clearable
          ></el-cascader>
          <!-- <el-select v-model="ruleFormReverse.upId" placeholder="请选择部门" style="width: 100%;">
            <el-option label="根组织" value=""></el-option>
            <el-option v-for="item in regionOptions" :key="item.departName" :label="item.departName" :value="item.id"></el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item label="组织状态">
          <el-switch
            @change="checkVisibleStatus(ruleFormReverse)"
            v-model="ruleFormReverse.visible"
            active-text="可见"
            inactive-text="不可见"
            active-color="#13ce66"
            :active-value=1
            :inactive-value=0
          ></el-switch>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="ruleFormReverse.comment" placeholder="上限255字符" maxlength="255"></el-input>
        </el-form-item>
        <el-form-item label="新建人">
          <span>{{ruleFormReverse.creator}}</span>
        </el-form-item>
        <el-form-item label="新建时间">
          <span>{{ruleFormReverse.createTime}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormReverse('ruleFormReverse')">确定</el-button>
        <el-button @click="resetReverse">重置</el-button>
        <el-button plain type="primary" @click="dialogFormVisibleReverse = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      width="30%"
      title="操作提示"
      :visible.sync="op_hints"
      :close-on-press-escape=false
      :close-on-click-modal=false
      :show-close=false
      append-to-body>
      <span style="font-size:20px;">该部门下存在可见的下属组织，是否设置为不可见。</span>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button type="primary" @click="op_hints = false;updateOrganStatus(visibleData)">确定</el-button>
        <el-button type="primary" plain @click="op_hints = false;ruleFormReverse.visible=1">取消</el-button>
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
  import { queryDepts, verifyDept, modifyOrganStatus, modifyOrgan, delOrgan, addOrganization, delOrgansByOrganIds, findAllOrganPost, findAllOrganTo } from '@/api/organization_list'
  import { Message } from 'element-ui'
  import { formatDateTime, list2Tree } from '@/utils/tools'
  import { validSpace } from '@/utils/validate'

  export default {
    name: 'organization_list',
    data() {
      return {
        batchDelVisible: false,
        delVisible: false,
        delReq: '',
        formContainerOpen: '1',
        formContainer: this.$store.state.app.formContainer,
        selected_dept_id: [], // 查询条件
        new_dept_ids: [], // 新建组织
        edit_dept_ids: [], // 修改组织
        reverse_edit_dept_ids: [], // 用以回显修改组织
        org_props: {
          label: 'departName',
          value: 'id',
          children: 'children'
        },
        tagName: '',
        tempRoute: {},
        timeValue: [],
        organData: {},
        visibleData: {},
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
        regionOptions: [], // 所有可见组织
        allDepts: [], // 所有组织
        tableData: [],
        multipleSelection: [],
        formInline: {
          organ_id: '',
          organ_name: '',
          parent_organ: '',
          parent_organ_id: '',
          startTime: '',
          stopTime: '',
          pageNo: 1,
          pageSize: 10,
          creator: ''
        },
        ruleForm: {
          id: '',
          departName: '',
          comment: '',
          visible: 1 // 组织状态  0：不可见    1：可见
        },
        ruleFormReverse: {
          upId: '',
          id: null,
          creator: '',
          number: '',
          upDepartName: '',
          departName: '',
          comment: '',
          createTime: '',
          visible: null
        },
        dialogFormVisible: false,
        dialogFormVisibleReverse: false,
        op_hints: false,
        ophints_check: false,
        rules: {
          departName: [
            { required: true, message: '请输入组织名', trigger: 'blur' },
            { validator: validSpace, trigger: 'blur' }
          ],
          upDepartName: [
            { required: true, message: '请选择部门', trigger: 'change' }
          ]
          // id: [
          //   { required: true, message: '请输入组织名', trigger: 'change' }
          // ]
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
      // 修改组织可见/不可见状态
      updateOrganStatus(obj) {
        modifyOrganStatus(obj)
          .then(res1 => {
            if (!res1 || res1.data.code === 0) {
              this.$message.error('修改组织状态失败！')
            } else {
              this.searchOrgan(this.formInline)
            }
          })
      },
      deleteAll() {
        const organIds = this.multipleSelection.map(function(item, index) {
          return item.id
        })
        delOrgansByOrganIds({
          listId: organIds,
          operatorId: localStorage.getItem('agentId')
        }).then(response => {
          if (response.data.code === 1) {
            Message({
              message: response.data.message,
              type: 'success',
              duration: 3 * 1000
            })
            this.formInline.pageNo = 1
            this.pagination.pageNo = 1
            findAllOrganPost(this.formInline).then(response => {
              this.queryOrgan(response)
            })
            this.refreshOrganTo()
          } else {
            Message({
              message: response.data.message,
              type: 'error',
              duration: 3 * 1000
            })
          }
        }).catch(() => {
          // Message({
          //   message: '已经取消删除',
          //   type: 'error',
          //   duration: 3 * 1000
          // })
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let obj = {}
            this.new_dept_ids.length === 0 ? this.ruleForm.id = '' : this.ruleForm.id = this.new_dept_ids[this.new_dept_ids.length - 1]
            if (this.ruleForm.id) {
              obj = {
                organ_cn: this.ruleForm.departName,
                upId: this.ruleForm.id,
                remark: this.ruleForm.comment,
                visible: parseInt(this.ruleForm.visible)
              }
            } else {
              obj = {
                organ_cn: this.ruleForm.departName,
                remark: this.ruleForm.comment,
                visible: parseInt(this.ruleForm.visible)
              }
            }
            addOrganization(obj).then(response => {
              if (response.data.exchange.body.code === 1) {
                this.dialogFormVisible = false
                findAllOrganPost(this.formInline).then(response => {
                  this.queryOrgan(response)
                })

                this.refreshOrganTo()
              } else {
                Message({
                  message: response.data.exchange.body.message,
                  type: 'error',
                  duration: 3 * 1000
                })
              }
            })
          } else {
            // console.log('error submit!!')
            return false
          }
        })
      },
      checkVisibleStatus(obj) {
        if (obj.visible === 0) {
          // 说明从可见设置为不可见 需要判断是否有可见的下级部门
          this.visibleData = obj
          verifyDept(obj.id)
            .then(response => {
              if (response.data.code === 0) {
                // 存在可见下级部门
                this.op_hints = true
              } else {
                // 不存在可见下级部门
                // 直接更改
                this.updateOrganStatus(obj)
              }
            })
        } else {
          // 从不可见设置为可见 直接更改
          this.updateOrganStatus(obj)
        }
      },
      submitFormReverse(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const obj = {
              organ_id: this.ruleFormReverse.id,
              organ_No: this.ruleFormReverse.number,
              group_cn: this.ruleFormReverse.departName,
              remark: this.ruleFormReverse.comment,
              creator: this.ruleFormReverse.creator,
              createTime: this.ruleFormReverse.createTime
            }
  
            if (this.edit_dept_ids.length === 0) {
              obj.select_uporgan = ''
            } else {
              obj.select_uporgan = this.edit_dept_ids[this.edit_dept_ids.length - 1]
            }
            // if (this.ruleFormReverse.upId) {
            //   obj.select_uporgan = this.ruleFormReverse.upId
            // }
            modifyOrgan(obj).then(response => {
              if (response.data.exchange.body.code === 1) {
                this.$message.success('修改成功！')
                this.dialogFormVisibleReverse = false
                findAllOrganPost(this.formInline).then(response => {
                  this.queryOrgan(response)
                })
                this.refreshOrganTo()
              } else {
                Message({
                  message: response.data.exchange.body.message,
                  type: 'error',
                  duration: 3 * 1000
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
        if (formName === 'ruleForm') {
          this.ruleForm.departName = ''
          this.new_dept_ids = []
          this.ruleForm.visible = 1
          this.ruleForm.comment = ''
        } else {
          this.ruleFormReverse.departName = ''
          this.edit_dept_ids = []
          this.ruleFormReverse.visible = 1
          this.ruleFormReverse.comment = ''
        }
      },
      reset() {
        this.timeValue = []
        this.selected_dept_id = []
        this.formInline = {
          organ_id: '',
          organ_name: '',
          parent_organ: '',
          parent_organ_id: this.$route.params.id === ':id' ? '' : this.$route.params.id,
          startTime: '',
          stopTime: '',
          creator: '',
          pageNo: this.pagination.pageNo,
          pageSize: this.pagination.pageSize
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      deleteRow() {
        delOrgan({ organ_id: this.delReq }).then(response => {
          if (response.data.exchange.body.code === 1) {
            Message({
              message: response.data.exchange.body.message,
              type: 'success',
              duration: 3 * 1000
            })
            this.formInline.pageNo = 1
            this.pagination.pageNo = 1
            findAllOrganPost(this.formInline).then(response => {
              this.queryOrgan(response)
            })
            this.refreshOrganTo()
          } else {
            Message({
              message: '删除失败',
              type: 'error',
              duration: 3 * 1000
            })
          }
        }).catch(() => {
          // Message({
          //   message: '已经取消删除',
          //   type: 'error',
          //   duration: 3 * 1000
          // })
        })
      },
      handleClickOrgan(row) {
        this.selected_dept_id = []
        this.$router.push({
          name: 'organization_list',
          // query: { parent_organ: row.departName }
          params: { id: row.id }
        })
        // this.refreshOrgan()
        sessionStorage.setItem(row.id, row.departName)
      },
      handleClickStaff(row) {
        this.$router.push({
          name: 'employee_list',
          params: { id: row.id }
        })
        sessionStorage.setItem(row.id, row.departName)
      },
      handleClickUser(row) {
        this.$router.push({
          name: 'account_list',
          params: { id: row.id }
        })
        sessionStorage.setItem(row.id, row.departName)
      },
      handleClick(row) {
        this.dialogFormVisibleReverse = true
        findAllOrganPost({ organ_id: row.number }).then(response => {
          if (response.data.code === 1) {
            // 由于按照ID查询后台返回数组 可以写死0位置
            const data = response.data.data[0]
            this.organData = data
  
            /** 回显上级组织的逻辑 start */
            let arr = []
            arr = data.idPath.split('/')
            for (var i = 0; i < arr.length; i++) {
              if (arr[i] === null || arr[i] === '') {
                arr.splice(i, 1)
                i = i - 1
              }
            }
            arr.splice(arr.length - 1, 1)
            for (var j = 0; j < arr.length; j++) {
              arr[j] = parseInt(arr[j])
            }
            this.edit_dept_ids = arr
            this.reverse_edit_dept_ids = arr
            /** 回显上级组织的逻辑 end */
  
            this.ruleFormReverse = {
              upId: data.upId ? data.upId : '',
              id: data.id,
              creator: data.creator,
              number: data.number,
              upDepartName: data.upDepartName,
              departName: data.departName,
              comment: data.comment,
              createTime: formatDateTime(data.createTime),
              visible: data.visible
            }
          }
        })
        // row已经包含了单个的数据
      },
      resetReverse() {
        this.edit_dept_ids = this.reverse_edit_dept_ids
        this.ruleFormReverse = {
          upId: this.organData.upId,
          id: this.organData.id,
          creator: this.organData.creator,
          number: this.organData.number,
          upDepartName: this.organData.upDepartName,
          departName: this.organData.departName,
          comment: this.organData.comment,
          createTime: formatDateTime(this.organData.createTime),
          visible: this.organData.visible
        }
      },
      handleCurrentChange(val) {
        this.formInline.pageNo = val
        this.formInline.startTime = this.timeValue ? this.timeValue[0] : null
        this.formInline.stopTime = this.timeValue ? this.timeValue[1] : null
        findAllOrganPost(this.formInline).then(response => {
          this.queryOrgan(response)
        })
      },
      handleSizeChange(val) {
        this.pagination.pageNo = 1
        this.formInline.pageNo = 1
        this.formInline.pageSize = val
        this.searchOrgan(this.formInline)
      },
      headerRow({ row, rowIndex }) {
        if (rowIndex === 0) {
          return 'color:black'
        } else {
          return ''
        }
      },
      queryOrgan(res) {
        this.tableData = res.data.data
        if (this.tableData.length === 0) {
          Message({
            message: '无查询结果，请核对查询条件',
            type: 'error',
            duration: 3 * 1000
          })
        } else {
          for (let i = 0; i <= this.tableData.length; i++) {
            if (this.tableData[i]) {
              this.tableData[i].updateTime = formatDateTime(this.tableData[i].updateTime)
              if (this.tableData[i].upId === 0) {
                this.tableData[i].upDepartName = '根组织'
              }
            }
          }
        }
        this.pagination = res.data.pageInfo
      },
      searchOrgan(req) {
        // 根据老版本的逻辑 查询只能传分页页码的第一页
        this.formInline.startTime = this.timeValue ? this.timeValue[0] : null
        this.formInline.stopTime = this.timeValue ? this.timeValue[1] : null
        if (this.selected_dept_id.length === 0) {
          if (this.$route.params.id === ':id') {
            req.parent_organ_id = ''
          } else {
            req.parent_organ_id = this.$route.params.id
          }
        } else {
          req.parent_organ_id = this.selected_dept_id[this.selected_dept_id.length - 1]
        }
        // if (this.selected_dept_id.length === 0 && this.$route.params.id === ':id') {
        //   req.parent_organ_id = ''
        // } else {
        //   req.parent_organ_id = this.selected_dept_id[this.selected_dept_id.length - 1]
        // }
        findAllOrganPost(req).then(response => {
          this.queryOrgan(response)
        })
      },
      setTagsViewTitle() {
        const route = Object.assign({}, this.tempRoute, { title: this.$route.params.id === ':id' ? this.tempRoute.meta.title : this.tempRoute.meta.title + '-' + sessionStorage.getItem(this.$route.params.id) })
        this.$store.dispatch('updateVisitedView', route)
      },
      refreshOrgan() {
        // this.formInline.parent_organ = this.$route.query.parent_organ
        this.formInline.parent_organ_id = this.$route.params.id === ':id' ? '' : this.$route.params.id
        // 由于老版本不需要实时更新查询条件去查询下属组织 因此传参只需要2个值即可,其他字段完全无用 （备注 可以改装）
        findAllOrganPost({
          organ_id: '',
          organ_name: '',
          parent_organ_id: this.$route.params.id === ':id' ? '' : this.$route.params.id,
          startTime: '',
          stopTime: '',
          creator: '',
          pageNo: 1
        }).then(response => {
          this.queryOrgan(response)
        })
      },
      refreshOrganTo() {
        findAllOrganTo().then(response => {
          const map = {
            data: response.data.data,
            rootId: 0,
            idFieldName: 'id',
            parentIdFielName: 'upId'
          }
          this.regionOptions = list2Tree(map)
        })
        queryDepts().then(res => {
          const map = {
            data: res.data.data,
            rootId: 0,
            idFieldName: 'id',
            parentIdFielName: 'upId'
          }
          this.allDepts = list2Tree(map)
        })
      }
    },
    mounted() {
      this.formContainer()
      this.handleChangeAcitve()
      this.tempRoute = Object.assign({}, this.$route)
      this.setTagsViewTitle()
      // this.formInline.parent_organ = this.$route.params.id === ':id' ? '' : this.$route.params.id
      // if (this.$route.params.id === ':id') {
      //   this.refreshOrgan()
      // } else {
      // findAllOrganGet().then(response => {
      //   this.queryOrgan(response)
      // })
      this.refreshOrgan()
      // }
      this.refreshOrganTo()
    },
    activated() {
      this.setTagsViewTitle()
      this.searchOrgan(this.formInline)
    }
    // watch: {
    //   $route(to, from) {
    //     // 判断url是否带参
    //     if (!to.query.parent_organ) {
    //       this.formInline.parent_organ = ''
    //       findAllOrganGet().then(response => {
    //         this.queryOrgan(response)
    //       })
    //     } else {
    //       this.refreshOrgan()
    //     }
    //   }
    // }
  }
</script>
