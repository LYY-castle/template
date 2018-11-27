<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-form :inline="true" class="demo-form-inline" size="small">
          <el-form-item label="选项值：">
            <el-input placeholder="选项值" v-model="formInline.name" maxlength="45"></el-input>
          </el-form-item>
          <el-form-item label="编号：">
            <el-input placeholder="编号" v-model="formInline.code"></el-input>
          </el-form-item>
          <!--<el-form-item label="备注：">-->
            <!--<el-input placeholder="备注" v-model="formInline.remark"></el-input>-->
          <!--</el-form-item>-->
          <el-form-item label="可见状态:">
            <el-radio-group v-model="formInline.enabled">
              <el-radio-button label="">所有情况</el-radio-button>
              <el-radio-button label="0">不可见</el-radio-button>
              <el-radio-button label="1">可见</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="操作人员：">
            <el-input placeholder="操作人员（限长45字符）" v-model="formInline.updator_realname" maxlength="45"></el-input>
          </el-form-item>
          <el-form-item label="操作时间：">
            <el-date-picker
              v-model="formInline.timeValue"
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="timestamp">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="formInline.pageNo = 1;searchOrgan(formInline)">查询</el-button>
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
            prop="name"
            label="选项值"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            align="center"
            prop="code"
            label="编号"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            align="center"
            prop="rank"
            label="排序"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.rank }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="可见性"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div v-html="showOrgStatus(scope.row.enabled)"></div>
            </template>
          </el-table-column>
          <!--<el-table-column-->
            <!--align="center"-->
            <!--prop="creator_realname"-->
            <!--label="创建人"-->
            <!--:show-overflow-tooltip="true">-->
            <!--<template slot-scope="scope">-->
              <!--{{ scope.row.creator_realname }}-->
            <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
            <!--align="center"-->
            <!--prop="creator_at"-->
            <!--label="创建时间"-->
            <!--width="155">-->
            <!--<template slot-scope="scope">-->
              <!--{{ formatTime(scope.row.creator_at) }}-->
            <!--</template>-->
          <!--</el-table-column>-->
          <el-table-column
            align="center"
            prop="updator_realname"
            label="操作人员"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.updator_realname }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="updator_at"
            label="操作时间"
            width="155">
            <template slot-scope="scope">
              {{ formatTime(scope.row.updator_at) }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="185">
            <template slot-scope="scope">
              <el-button @click="handleClickStaff(scope.row)" type="text" size="small">查看</el-button>
              <el-button @click="handleClickSearch(scope.row)" type="text" size="small">查看子集</el-button>
              <el-button @click="handleClick(scope.row)" type="text" size="small">修改</el-button>
              <el-button
                @click.native.prevent="deleteRow(scope.row)"
                type="text"
                size="small">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row style="margin-top:1%;">
        <el-col :span="12">
          <el-button type="success" size="small"  @click="dialogFormVisible = true">新建</el-button>
          <el-button type="danger" size="small" @click="deleteAll">批量删除</el-button>
          <el-button type="success" size="small" @click="reverseAll(1)">批量可见</el-button>
          <el-button type="danger" size="small" @click="reverseAll(0)">批量不可见</el-button>
        </el-col>
        <el-col :span="12">
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
    <el-dialog title="新建选项" :visible.sync="dialogFormVisible" width="30%" @close="resetForm('ruleForm')" append-to-body>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="选项值" prop="name">
          <el-input v-model="ruleForm.name" placeholder="上限45字符" maxlength="45"></el-input>
        </el-form-item>
        <!--<el-form-item label="选项值">-->
          <!--<el-input v-model="ruleForm.value" placeholder="请输入选项值(数字)" maxlength="45"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="排序" prop="rank">
          <el-input v-model="ruleForm.rank" placeholder="请输入排序值" maxlength="45"></el-input>
        </el-form-item>
        <el-form-item label="可见状态">
          <el-switch
            v-model="ruleForm.enabled"
            active-text="可见"
            inactive-text="不可见"
            active-color="#13ce66"
            :active-value=1
            :inactive-value=0
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="resetForm('ruleForm')">重置</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改选项" :visible.sync="dialogFormVisibleReverse" width="38%" @close="resetForm('ruleFormReverse')" append-to-body>
      <el-form :model="ruleFormReverse" :rules="rules" ref="ruleFormReverse" label-width="100px" class="demo-ruleForm">
        <el-form-item label="选项值" prop="name">
          <el-input v-model="ruleFormReverse.name" placeholder="上限45字符" maxlength="45"></el-input>
        </el-form-item>
        <!--<el-form-item label="选项值">-->
          <!--<el-input v-model="ruleFormReverse.value" placeholder="请输入选项值(数字)" maxlength="45"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="排序" prop="rank">
          <el-input v-model="ruleFormReverse.rank" placeholder="请输入排序值" maxlength="45"></el-input>
        </el-form-item>
        <el-form-item label="可见状态">
          <el-switch
            v-model="ruleFormReverse.enabled"
            active-text="可见"
            inactive-text="不可见"
            active-color="#13ce66"
            :active-value=1
            :inactive-value=0
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="resetReverse">重置</el-button>
        <el-button @click="dialogFormVisibleReverse = false">取 消</el-button>
        <el-button type="primary" @click="submitFormReverse('ruleFormReverse')">确 定</el-button>
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
        <el-button @click="op_hints = false;ruleFormReverse.visible=1">取 消</el-button>
        <el-button type="primary" @click="op_hints = false;updateOrganStatus(visibleData)">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="选项详情" :visible.sync="dialogFormVisibleDetail" width="38%" append-to-body>
      <el-form :model="ruleFormReverseDetail" label-width="100px" class="demo-ruleForm">
        <el-form-item label="选项值">
          <span>{{ruleFormReverseDetail.name}}</span>
        </el-form-item>
        <el-form-item label="编号">
          <span>{{ruleFormReverseDetail.code}}</span>
        </el-form-item>
        <el-form-item label="排序">
          <span>{{ruleFormReverseDetail.rank}}</span>
        </el-form-item>
        <!--<el-form-item label="选项值">-->
          <!--<span>{{ruleFormReverseDetail.value}}</span>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="可见性">-->
          <!--<span v-html="showOrgStatus(ruleFormReverseDetail.enabled)"></span>-->
        <!--</el-form-item>-->
        <el-form-item label="创建人员">
          <span>{{ruleFormReverseDetail.creator_realname}}</span>
        </el-form-item>
        <el-form-item label="创建时间">
          <span>{{formatTime(ruleFormReverseDetail.creator_at)}}</span>
        </el-form-item>
        <el-form-item label="操作人员">
          <span>{{ruleFormReverseDetail.updator_realname}}</span>
        </el-form-item>
        <el-form-item label="操作时间">
          <span>{{formatTime(ruleFormReverseDetail.updator_at)}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisibleDetail = false">返回</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { categoriesEdit, categoriesQuery, categoriesSpecific, categoriesCreate, categoriesDelete, categoriesBatchDelete, categoriesBatchEnable } from '@/api/category'
  import { Message, MessageBox } from 'element-ui'
  import { formatDateTime } from '@/utils/tools'
  import { validSpace } from '@/utils/validate'

  export default {
    name: 'CategoryChild',
    data() {
      return {
        tagName: '',
        tempRoute: {},
        timeValueClone: [],
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
          nameClone: '',
          name: '',
          code: '',
          remark: '',
          enabled: '',
          enabledClone: '',
          updator_realname: '',
          codeClone: '',
          remarkClone: '',
          updator_realnameClone: '',
          timeValue: [],
          pageNo: 1,
          pageSize: 10
        },
        ruleFormReverseDetail: {
          category_id: '',
          code: '',
          creator_at: '',
          creator_id: '',
          creator_realname: '',
          enabled: '',
          is_delete: '',
          name: '',
          parent_id: '',
          rank: '',
          remark: '',
          updator_at: '',
          updator_id: '',
          updator_realname: '',
          value: ''
        },
        ruleForm: {
          creator_id: '',
          creator_realname: '',
          enabled: 1,
          name: '',
          parent_id: '',
          rank: '',
          updator_id: '',
          updator_realname: '',
          value: null
        },
        ruleFormReverse: {
          category_id: '',
          code: '',
          creator_at: '',
          creator_id: '',
          creator_realname: '',
          enabled: null,
          is_delete: '',
          name: '',
          parent_id: '',
          rank: '',
          remark: '',
          updator_at: '',
          updator_id: '',
          updator_realname: '',
          value: ''
        },
        dialogFormVisible: false,
        dialogFormVisibleReverse: false,
        dialogFormVisibleDetail: false,
        op_hints: false,
        ophints_check: false,
        rules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { validator: validSpace, trigger: 'blur' }
          ],
          rank: [
            { pattern: /^(0|[1-9][0-9]*)$/, message: '请输入合理排序值', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      handleClickSearch(row) {
        this.$router.push({
          path: '/category/categoryChild/' + row.category_id
        })
      },
      formatTime(time) {
        return formatDateTime(new Date(time))
      },
      showOrgStatus(visible) {
        if (!visible) {
          // 不可见
          return "<span style='color:red'>不可见</span>"
        } else {
          // 可见
          return "<span style='color:green'>可见</span>"
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            categoriesCreate({
              creator_id: Number(localStorage.getItem('agentId')),
              creator_realname: localStorage.getItem('agentName'),
              enabled: this.ruleForm.enabled,
              name: this.ruleForm.name,
              parent_id: Number(this.$route.params.id),
              rank: Number(this.ruleForm.rank),
              updator_id: Number(localStorage.getItem('agentId')),
              updator_realname: localStorage.getItem('agentName'),
              value: this.ruleForm.value
            }).then(response => {
              if (response.data.result) {
                categoriesQuery({
                  name: this.formInline.nameClone,
                  code: this.formInline.codeClone,
                  updator_realname: this.formInline.updator_realnameClone,
                  remark: this.formInline.remarkClone,
                  start_updated_at: this.timeValueClone.length ? this.timeValueClone[0] : '',
                  end_updated_at: this.timeValueClone.length ? this.timeValueClone[1] : '',
                  enabled: this.formInline.enabledClone ? Number(this.formInline.enabledClone) : '',
                  parent_id: this.$route.params.id,
                  pageNo: this.formInline.pageNo,
                  pageSize: this.formInline.pageSize
                }).then(response => {
                  this.queryOrgan(response)
                  this.dialogFormVisible = false
                })
              } else {
                Message({
                  message: response.data.error,
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
      submitFormReverse(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const obj = {
              name: this.ruleFormReverse.name,
              value: this.ruleFormReverse.value,
              enabled: Number(this.ruleFormReverse.enabled),
              rank: Number(this.ruleFormReverse.rank)
            }
            categoriesEdit(this.ruleFormReverse.category_id, obj).then(response => {
              if (response.data.error === null) {
                this.$message.success('修改成功！')
                this.dialogFormVisibleReverse = false
                categoriesQuery({
                  name: this.formInline.nameClone,
                  code: this.formInline.codeClone,
                  updator_realname: this.formInline.updator_realnameClone,
                  remark: this.formInline.remarkClone,
                  start_updated_at: this.timeValueClone.length ? this.timeValueClone[0] : '',
                  end_updated_at: this.timeValueClone.length ? this.timeValueClone[1] : '',
                  enabled: this.formInline.enabledClone ? Number(this.formInline.enabledClone) : '',
                  parent_id: this.$route.params.id,
                  pageNo: this.formInline.pageNo,
                  pageSize: this.formInline.pageSize
                }).then(response => {
                  this.queryOrgan(response)
                })
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
      },
      reset() {
        this.formInline.name = ''
        this.formInline.timeValue = []
        this.formInline.updator_realname = ''
        this.formInline.code = ''
        this.formInline.remark = ''
        this.formInline.enabled = ''
        this.formInline.pageNo = this.pagination.pageNo
        this.formInline.pageSize = this.pagination.pageSize
      },
      handleClickStaff(row) {
        this.dialogFormVisibleDetail = true
        this.ruleFormReverseDetail = row
      },
      handleClick(row) {
        this.dialogFormVisibleReverse = true
        categoriesQuery({
          name: row.name
        }).then(response => {
          // 由于按照ID查询后台返回数组 可以写死0位置
          const data = response.data.result[0]
          this.organData = data
          this.ruleFormReverse = {
            category_id: data.category_id,
            code: data.code,
            creator_at: data.creator_at,
            creator_id: data.creator_id,
            creator_realname: data.creator_realname,
            enabled: data.enabled,
            is_delete: data.is_delete,
            name: data.name,
            parent_id: data.parent_id,
            rank: data.rank,
            remark: data.remark,
            updator_at: data.updator_at,
            updator_id: data.updator_id,
            updator_realname: data.updator_realname,
            value: data.value
          }
        })
        // row已经包含了单个的数据
      },
      resetReverse() {
        this.ruleFormReverse = {
          category_id: this.organData.category_id,
          code: this.organData.code,
          creator_at: this.organData.creator_at,
          creator_id: this.organData.creator_id,
          creator_realname: this.organData.creator_realname,
          enabled: this.organData.enable,
          is_delete: this.organData.is_delete,
          name: this.organData.name,
          parent_id: this.organData.parent_id,
          rank: this.organData.rank,
          remark: this.organData.remark,
          updator_at: this.organData.updator_at,
          updator_id: this.organData.updator_id,
          updator_realname: this.organData.updator_realname,
          value: this.organData.value
        }
      },
      handleCurrentChange(val) {
        this.formInline.pageNo = val
        categoriesQuery({
          name: this.formInline.nameClone,
          code: this.formInline.codeClone,
          updator_realname: this.formInline.updator_realnameClone,
          remark: this.formInline.remarkClone,
          start_updated_at: this.timeValueClone.length ? this.timeValueClone[0] : '',
          end_updated_at: this.timeValueClone.length ? this.timeValueClone[1] : '',
          enabled: this.formInline.enabledClone ? Number(this.formInline.enabledClone) : '',
          parent_id: this.$route.params.id,
          pageNo: this.formInline.pageNo,
          pageSize: this.formInline.pageSize
        }).then(response => {
          this.queryOrgan(response)
        })
      },
      handleSizeChange(val) {
        this.pagination.pageNo = 1
        this.formInline.pageNo = 1
        this.formInline.pageSize = val
        categoriesQuery({
          name: this.formInline.nameClone,
          code: this.formInline.codeClone,
          updator_realname: this.formInline.updator_realnameClone,
          remark: this.formInline.remarkClone,
          start_updated_at: this.timeValueClone.length ? this.timeValueClone[0] : '',
          end_updated_at: this.timeValueClone.length ? this.timeValueClone[1] : '',
          enabled: this.formInline.enabledClone ? Number(this.formInline.enabledClone) : '',
          parent_id: this.$route.params.id,
          pageNo: this.formInline.pageNo,
          pageSize: this.formInline.pageSize
        }).then(response => {
          this.queryOrgan(response)
        })
      },
      deleteRow(row) {
        MessageBox.confirm('确定执行删除操作吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          categoriesDelete(row.category_id).then(response => {
            if (response.data.result) {
              Message({
                message: '删除成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.formInline.pageNo = 1
              this.pagination.pageNo = 1
              categoriesQuery({
                name: this.formInline.nameClone,
                code: this.formInline.codeClone,
                updator_realname: this.formInline.updator_realnameClone,
                remark: this.formInline.remarkClone,
                start_updated_at: this.timeValueClone.length ? this.timeValueClone[0] : '',
                end_updated_at: this.timeValueClone.length ? this.timeValueClone[1] : '',
                enabled: this.formInline.enabledClone ? Number(this.formInline.enabledClone) : '',
                parent_id: this.$route.params.id,
                pageNo: this.formInline.pageNo,
                pageSize: this.formInline.pageSize
              }).then(response => {
                this.queryOrgan(response)
              })
            } else {
              Message({
                message: response.data.error,
                type: 'error',
                duration: 3 * 1000
              })
            }
          }).catch(() => {
            Message({
              message: '删除失败',
              type: 'error',
              duration: 3 * 1000
            })
          })
        }).catch(() => {
          Message({
            message: '已经取消删除',
            type: 'error',
            duration: 3 * 1000
          })
        })
      },
      deleteAll() {
        if (this.multipleSelection.length) {
          const category_ids = this.multipleSelection.map(function(item, index) {
            return item.category_id
          })
          MessageBox.confirm('确定执行批量删除操作吗？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            categoriesBatchDelete({
              category_ids: category_ids.join(',')
            }).then(response => {
              if (response.data.result) {
                Message({
                  message: '删除成功',
                  type: 'success',
                  duration: 3 * 1000
                })
                this.formInline.pageNo = 1
                this.pagination.pageNo = 1
                categoriesQuery({
                  name: this.formInline.nameClone,
                  code: this.formInline.codeClone,
                  updator_realname: this.formInline.updator_realnameClone,
                  remark: this.formInline.remarkClone,
                  start_updated_at: this.timeValueClone.length ? this.timeValueClone[0] : '',
                  end_updated_at: this.timeValueClone.length ? this.timeValueClone[1] : '',
                  enabled: this.formInline.enabledClone ? Number(this.formInline.enabledClone) : '',
                  parent_id: this.$route.params.id,
                  pageNo: this.formInline.pageNo,
                  pageSize: this.formInline.pageSize
                }).then(response => {
                  this.queryOrgan(response)
                })
              } else {
                Message({
                  message: response.data.message,
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
        } else {
          Message({
            message: '请选择需要删除的条目',
            type: 'error',
            duration: 3 * 1000
          })
        }
      },
      reverseAll(val) {
        if (this.multipleSelection.length) {
          const category_ids = this.multipleSelection.map(function(item, index) {
            return item.category_id
          })
          const comment = val ? '确定执行批量可见操作吗？' : '确定执行批量不可见操作吗？'
          MessageBox.confirm(comment, {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            categoriesBatchEnable({
              category_ids: category_ids.join(','),
              enabled: val
            }).then(response => {
              if (response.data.result) {
                Message({
                  message: '修改成功',
                  type: 'success',
                  duration: 3 * 1000
                })
                this.formInline.pageNo = 1
                this.pagination.pageNo = 1
                categoriesQuery({
                  name: this.formInline.nameClone,
                  code: this.formInline.codeClone,
                  updator_realname: this.formInline.updator_realnameClone,
                  remark: this.formInline.remarkClone,
                  start_updated_at: this.timeValueClone.length ? this.timeValueClone[0] : '',
                  end_updated_at: this.timeValueClone.length ? this.timeValueClone[1] : '',
                  enabled: this.formInline.enabledClone ? Number(this.formInline.enabledClone) : '',
                  parent_id: this.$route.params.id,
                  pageNo: this.formInline.pageNo,
                  pageSize: this.formInline.pageSize
                }).then(response => {
                  this.queryOrgan(response)
                })
              } else {
                Message({
                  message: response.data.message,
                  type: 'error',
                  duration: 3 * 1000
                })
              }
            })
          }).catch(() => {
            Message({
              message: '已经取消修改',
              type: 'error',
              duration: 3 * 1000
            })
          })
        } else {
          Message({
            message: '请选择需要修改的条目',
            type: 'error',
            duration: 3 * 1000
          })
        }
      },
      setTagsViewTitle() {
        const route = Object.assign({}, this.tempRoute, { title: '选项管理-' + this.tagName })
        this.$store.dispatch('updateVisitedView', route)
      },
      headerRow({ row, rowIndex }) {
        if (rowIndex === 0) {
          return 'color:black'
        } else {
          return ''
        }
      },
      queryOrgan(res) {
        this.tableData = res.data.result
        if (this.tableData.length === 0) {
          Message({
            message: '无查询结果，请核对查询条件',
            type: 'error',
            duration: 3 * 1000
          })
        }
        this.pagination.pageNo = Number(res.data.pageNo)
        this.pagination.pageSize = Number(res.data.pageSize)
        this.pagination.totalCount = Number(res.data.totalCount)
      },
      searchOrgan(req) {
        console.log(req.enabled)
        this.formInline.nameClone = req.name
        this.formInline.updator_realnameClone = req.updator_realname
        this.formInline.codeClone = req.code
        this.formInline.remarkClone = req.remark
        this.formInline.enabledClone = req.enabled
        if (this.formInline.timeValue.length) {
          this.timeValueClone[0] = this.formInline.timeValue[0]
          this.timeValueClone[1] = this.formInline.timeValue[1]
        } else {
          this.timeValueClone = []
        }
        categoriesQuery({
          name: req.nameClone,
          code: req.codeClone,
          updator_realname: req.updator_realnameClone,
          remark: req.remarkClone,
          start_updated_at: this.timeValueClone.length ? this.timeValueClone[0] : '',
          end_updated_at: this.timeValueClone.length ? this.timeValueClone[1] : '',
          enabled: req.enabledClone ? Number(req.enabledClone) : '',
          parent_id: this.$route.params.id,
          pageNo: req.pageNo,
          pageSize: req.pageSize
        }).then(response => {
          this.queryOrgan(response)
        })
      }
    },
    created() {
      this.searchOrgan(this.formInline)
    },
    mounted() {
      categoriesSpecific(this.$route.params.id).then(response => {
        this.tagName = response.data.result.name
        this.tempRoute = Object.assign({}, this.$route)
        this.setTagsViewTitle()
      })
    }
  }
</script>

