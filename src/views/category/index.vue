<template>
  <div class="app-container">
    <div class="filter-container">
      <el-collapse v-model="formContainerOpen" class="form-container" @change="handleChangeAcitve">
        <el-collapse-item title="筛选条件" name="1">
          <el-form :inline="true" class="demo-form-inline" size="small">
            <el-form-item label="选项名：">
              <el-input placeholder="选项名（限长45字符）" v-model="formInline.name" maxlength="45"></el-input>
            </el-form-item>
            <el-form-item label="编号：">
              <el-input placeholder="编号" v-model="formInline.code"></el-input>
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
            <el-form-item label="备注：">
              <el-input placeholder="备注" v-model="formInline.remark"></el-input>
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
          <div class="font14 bold">选项管理表</div>
        </el-row>
        <el-row>
          <el-table
            :header-row-style="headerRow"
            :data="tableData"
            ref="multipleTable"
            tooltip-effect="dark">
            <el-table-column
              align="center"
              prop="name"
              label="名称"
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
            prop="remark"
            label="备注"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
            {{ scope.row.remark }}
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
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row style="margin-top:20px;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="pagination.pageNo"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper "
            :total="pagination.totalCount" style="text-align: right">
          </el-pagination>
        </el-row>
      </el-row>
    </div>
    <el-dialog title="修改选项" :visible.sync="dialogFormVisibleReverse" width="38%" @close="resetForm('ruleFormReverse')" append-to-body>
      <el-form size="small" :model="ruleFormReverse" :rules="rules" ref="ruleFormReverse" label-width="100px" class="demo-ruleForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="ruleFormReverse.name" placeholder="上限45字符" maxlength="45"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormReverse('ruleFormReverse')">确定</el-button>
        <el-button @click="resetReverse">重置</el-button>
        <el-button type="primary" plain @click="dialogFormVisibleReverse = false">取消</el-button>
      </div>
    </el-dialog>
    
    <el-dialog title="选项详情" :visible.sync="dialogFormVisibleDetail" width="38%" append-to-body>
      <el-form size="small" :model="ruleFormReverseDetail" label-width="100px" class="demo-ruleForm">
        <el-form-item label="名称" class="marginBottom">
          <span>{{ruleFormReverseDetail.name}}</span>
        </el-form-item>
        <el-form-item label="编号" class="marginBottom">
          <span>{{ruleFormReverseDetail.code}}</span>
        </el-form-item>
        <!--<el-form-item label="排序" class="marginBottom">-->
          <!--<span>{{ruleFormReverseDetail.rank}}</span>-->
        <!--</el-form-item>-->
        <el-form-item label="备注" class="marginBottom">
          <span>{{ruleFormReverseDetail.remark}}</span>
        </el-form-item>
        <!--<el-form-item label="选项值" class="marginBottom">-->
          <!--<span>{{ruleFormReverseDetail.value}}</span>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="可见性" class="marginBottom">-->
          <!--<span v-html="showOrgStatus(ruleFormReverseDetail.enabled)"></span>-->
        <!--</el-form-item>-->
        <el-form-item label="创建人员" class="marginBottom">
          <span>{{ruleFormReverseDetail.creator_realname}}</span>
        </el-form-item>
        <el-form-item label="创建时间" class="marginBottom">
          <span>{{formatTime(ruleFormReverseDetail.creator_at)}}</span>
        </el-form-item>
        <el-form-item label="操作人员" class="marginBottom">
          <span>{{ruleFormReverseDetail.updator_realname}}</span>
        </el-form-item>
        <el-form-item label="操作时间" class="marginBottom">
          <span>{{formatTime(ruleFormReverseDetail.updator_at)}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" plain @click="dialogFormVisibleDetail = false">返回</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { categoriesEdit, categoriesQuery } from '@/api/category'
  import { Message } from 'element-ui'
  import { formatDateTime } from '@/utils/tools'
  import { validSpace } from '@/utils/validate'

  export default {
    name: 'category',
    data() {
      return {
        formContainerOpen: '1',
        formContainer: this.$store.state.app.formContainer,
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
          timeValue: [],
          timeValueClone: null,
          nameClone: '',
          name: '',
          updator_realname: '',
          code: '',
          remark: '',
          updator_realnameClone: '',
          codeClone: '',
          remarkClone: '',
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
          id: '',
          departName: '',
          comment: '',
          visible: 1 // 组织状态  0：不可见    1：可见
        },
        ruleFormReverse: {
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
        dialogFormVisible: false,
        dialogFormVisibleReverse: false,
        dialogFormVisibleDetail: false,
        op_hints: false,
        ophints_check: false,
        rules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { validator: validSpace, trigger: 'blur' }
          ]
        }
      }
    },
    mounted() {
      console.log(this.$router)
      this.formContainer()
      this.handleChangeAcitve()
    },
    methods: {
      handleChangeAcitve(active = ['1']) {
        if (active.length) {
          $('.form-more').text('收起')
        } else {
          $('.form-more').text('更多')
        }
      },
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
      submitFormReverse(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const obj = {
              name: this.ruleFormReverse.name,
              value: this.ruleFormReverse.value,
              updator_id: this.ruleFormReverse.updator_id,
              updator_realname: this.ruleFormReverse.updator_realname,
              is_delete: this.ruleFormReverse.is_delete,
              enabled: this.ruleFormReverse.enabled,
              rank: this.ruleFormReverse.rank,
              remark: this.ruleFormReverse.remark
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
                  parent_id: 0,
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
          parent_id: 0,
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
          parent_id: 0,
          pageNo: this.formInline.pageNo,
          pageSize: this.formInline.pageSize
        }).then(response => {
          this.queryOrgan(response)
        })
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
        this.formInline.nameClone = req.name
        this.formInline.updator_realnameClone = req.updator_realname
        this.formInline.codeClone = req.code
        this.formInline.remarkClone = req.remark
        if (this.formInline.timeValue.length) {
          this.timeValueClone[0] = this.formInline.timeValue[0]
          this.timeValueClone[1] = this.formInline.timeValue[1]
        } else {
          this.timeValueClone = []
        }
        // if (this.formInline.organ_id) {
        categoriesQuery({
          name: req.nameClone,
          code: req.codeClone,
          updator_realname: req.updator_realnameClone,
          remark: req.remarkClone,
          start_updated_at: this.timeValueClone.length ? this.timeValueClone[0] : '',
          end_updated_at: this.timeValueClone.length ? this.timeValueClone[1] : '',
          parent_id: 0,
          pageNo: req.pageNo,
          pageSize: req.pageSize
        }).then(response => {
          this.queryOrgan(response)
        })
      }
    },
    created() {
      this.searchOrgan(this.formInline)
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .marginBottom {
    margin-bottom: 10px
  }
</style>
