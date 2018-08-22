<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-form :inline="true" class="demo-form-inline" size="small">
          <el-form-item label="组织编号：">
            <el-input placeholder="组织编号（限长11字符）" v-model="formInline.organ_id" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="组织名称：">
            <el-input placeholder="组织名称（限长45字符）" v-model="formInline.organ_name" maxlength="45"></el-input>
          </el-form-item>
          <el-form-item label="上级组织：">
            <el-select v-model="formInline.parent_organ" placeholder="上级组织">
              <el-option label="所有上级组织" value=""></el-option>
              <el-option label="一级组织" value="0"></el-option>
              <el-option v-for="item in regionOptions" :key="item.departName" :label="item.departName" :value="item.departName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="操作人员：">
            <el-input placeholder="操作人员（限长45字符）" v-model="formInline.creator" maxlength="45"></el-input>
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
            <el-button type="primary" @click="searchOrgan(formInline)">查询</el-button>
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
            width="55"
            align="center"
            type="index"
            label="序号">
            <template
              slot-scope="scope">
              <div>{{scope.$index+(pagination.pageNo-1)*10+1}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="number"
            label="组织编号">
          </el-table-column>
          <el-table-column
            align="center"
            prop="departName"
            label="组织名">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="right">
                <p>{{ scope.row.departName }}</p>
                <div slot="reference">
                  {{ scope.row.departName }}
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="upDepartName"
            label="上级组织">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="right">
                <p>{{ scope.row.upDepartName }}</p>
                <div slot="reference">
                  {{ scope.row.upDepartName }}
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="comment"
            label="备注">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="right">
                <p>{{ scope.row.comment }}</p>
                <div slot="reference">
                  {{ scope.row.comment }}
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="modifier"
            label="操作人员">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="right">
                <p>{{ scope.row.modifier }}</p>
                <div slot="reference">
                  {{ scope.row.modifier }}
                </div>
              </el-popover>
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
        <el-col :span="4">
          <el-button type="success" size="small"  @click="dialogFormVisible = true">新增</el-button>
          <el-button type="danger" size="small" @click="deleteAll">批量删除</el-button>
        </el-col>
        <el-col :span="18">
          <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page.sync="pagination.pageNo"
            :page-size="pagination.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="pagination.totalCount" style="text-align: right">
          </el-pagination>
        </el-col>
      </el-row>
    </div>
    <el-dialog title="新增组织" :visible.sync="dialogFormVisible" width="30%" @close="resetForm('ruleForm')" append-to-body>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="组织名" prop="departName">
          <el-input v-model="ruleForm.departName" placeholder="上限45字符" maxlength="45"></el-input>
        </el-form-item>
        <el-form-item label="上级组织">
          <el-select v-model="ruleForm.id" placeholder="请选择部门" style="width: 100%;">
            <el-option label="根组织" value=""></el-option>
            <el-option v-for="item in regionOptions" :key="item.departName" :label="item.departName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="ruleForm.comment" placeholder="上限255字符" maxlength="255"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="resetForm('ruleForm')">重置</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改组织" :visible.sync="dialogFormVisibleReverse" width="30%" @close="resetForm('ruleFormReverse')" append-to-body>
      <el-form :model="ruleFormReverse" :rules="rules" ref="ruleFormReverse" label-width="100px" class="demo-ruleForm">
        <el-form-item label="组织编号">
          <span>{{ruleFormReverse.number}}</span>
        </el-form-item>
        <el-form-item label="组织名" prop="departName">
          <el-input v-model="ruleFormReverse.departName" placeholder="上限45字符" maxlength="45"></el-input>
        </el-form-item>
        <el-form-item label="上级组织">
          <el-select v-model="ruleFormReverse.upId" placeholder="请选择部门" style="width: 100%;">
            <el-option label="根组织" value=""></el-option>
            <el-option v-for="item in regionOptions" :key="item.departName" :label="item.departName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="ruleFormReverse.comment" placeholder="上限255字符" maxlength="255"></el-input>
        </el-form-item>
        <el-form-item label="创建人">
          <span>{{ruleFormReverse.creator}}</span>
        </el-form-item>
        <el-form-item label="创建时间">
          <span>{{ruleFormReverse.createTime}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="resetReverse">重置</el-button>
        <el-button @click="dialogFormVisibleReverse = false">取 消</el-button>
        <el-button type="primary" @click="submitFormReverse('ruleFormReverse')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { modifyOrgan, delOrgan, addOrganization, delOrgansByOrganIds, findAllOrganGet, findAllOrganPost, findAllOrganTo } from '@/api/organization_list'
  import { Message, MessageBox } from 'element-ui'
  import { formatDateTime } from '@/utils/tools'
  import { validSpace } from '@/utils/validate'

  export default {
    name: 'organization_list',
    data() {
      return {
        timeValue: '',
        organData: {},
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
          organ_id: '',
          organ_name: '',
          parent_organ: '',
          startTime: '',
          stopTime: '',
          from: 1,
          creator: ''
        },
        ruleForm: {
          id: '',
          departName: '',
          comment: ''
        },
        ruleFormReverse: {
          upId: '',
          id: null,
          creator: '',
          number: '',
          upDepartName: '',
          departName: '',
          comment: '',
          createTime: ''
        },
        dialogFormVisible: false,
        dialogFormVisibleReverse: false,
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
      deleteAll() {
        const organIds = this.multipleSelection.map(function(item, index) {
          return item.id
        })
        MessageBox.confirm('确定执行批量删除操作吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delOrgansByOrganIds({
            listId: organIds,
            operatorId: JSON.parse(sessionStorage.getItem('getMenu')).agentId
          }).then(response => {
            if (response.data.code === 1) {
              Message({
                message: response.data.message,
                type: 'success',
                duration: 3 * 1000
              })
              findAllOrganGet().then(response => {
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
          })
        }).catch(() => {
          Message({
            message: '已经取消删除',
            type: 'error',
            duration: 3 * 1000
          })
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let obj = {}
            if (this.ruleForm.id) {
              obj = {
                organ_cn: this.ruleForm.departName,
                upId: this.ruleForm.id,
                remark: this.ruleForm.comment
              }
            } else {
              obj = {
                organ_cn: this.ruleForm.departName,
                remark: this.ruleForm.comment
              }
            }
            addOrganization(obj).then(response => {
              if (response.data.exchange.body.code === 1) {
                this.dialogFormVisible = false
                findAllOrganGet().then(response => {
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
      submitFormReverse(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let obj = {}
            if (this.ruleFormReverse.upId) {
              obj = {
                organ_id: this.ruleFormReverse.id,
                organ_No: this.ruleFormReverse.number,
                group_cn: this.ruleFormReverse.departName,
                select_uporgan: this.ruleFormReverse.upId,
                remark: this.ruleFormReverse.comment,
                creator: this.ruleFormReverse.creator,
                createTime: this.ruleFormReverse.createTime
              }
            } else {
              obj = {
                organ_id: this.ruleFormReverse.id,
                organ_No: this.ruleFormReverse.number,
                group_cn: this.ruleFormReverse.departName,
                remark: this.ruleFormReverse.comment,
                creator: this.ruleFormReverse.creator,
                createTime: this.ruleFormReverse.createTime
              }
            }
            modifyOrgan(obj).then(response => {
              if (response.data.exchange.body.code === 1) {
                this.dialogFormVisibleReverse = false
                findAllOrganGet().then(response => {
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
      },
      reset() {
        this.timeValue = ''
        this.formInline = {
          organ_id: '',
          organ_name: '',
          parent_organ: '',
          startTime: '',
          stopTime: '',
          creator: '',
          from: this.pagination.pageNo
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
        console.log(val)
      },
      deleteRow(row) {
        MessageBox.confirm('确定执行删除操作吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delOrgan({ organ_id: row.id }).then(response => {
            if (response.data.exchange.body.code === 1) {
              Message({
                message: response.data.exchange.body.message,
                type: 'success',
                duration: 3 * 1000
              })
              findAllOrganGet().then(response => {
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
          })
        }).catch(() => {
          Message({
            message: '已经取消删除',
            type: 'error',
            duration: 3 * 1000
          })
        })
      },
      handleClickOrgan(row) {
        this.$router.push({
          name: 'organization_list.html',
          query: { parent_organ: row.departName }
        })
        // this.refreshOrgan()
      },
      handleClickStaff(row) {
        this.$router.push({
          name: 'employee_list.html',
          query: { departName: row.departName }
        })
      },
      handleClickUser(row) {
        this.$router.push({
          name: 'account_list.html',
          query: { departName: row.departName }
        })
      },
      handleClick(row) {
        this.dialogFormVisibleReverse = true
        findAllOrganPost({ organ_id: row.number }).then(response => {
          if (response.data.code === 1) {
            // 由于按照ID查询后台返回数组 可以写死0位置
            const data = response.data.data[0]
            this.organData = data
            this.ruleFormReverse = {
              upId: data.upId ? data.upId : '',
              id: data.id,
              creator: data.creator,
              number: data.number,
              upDepartName: data.upDepartName,
              departName: data.departName,
              comment: data.comment,
              createTime: formatDateTime(data.createTime)
            }
          }
        })
        // row已经包含了单个的数据
      },
      resetReverse() {
        this.ruleFormReverse = {
          upId: this.organData.upId,
          id: this.organData.id,
          creator: this.organData.creator,
          number: this.organData.number,
          upDepartName: this.organData.upDepartName,
          departName: this.organData.departName,
          comment: this.organData.comment,
          createTime: formatDateTime(this.organData.createTime)
        }
      },
      handleCurrentChange(val) {
        this.formInline.from = val
        this.formInline.startTime = this.timeValue[0]
        this.formInline.stopTime = this.timeValue[1]
        findAllOrganPost(this.formInline).then(response => {
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
        req.from = 1
        this.formInline.startTime = this.timeValue[0]
        this.formInline.stopTime = this.timeValue[1]
        findAllOrganPost(req).then(response => {
          this.queryOrgan(response)
        })
      },
      refreshOrgan() {
        this.formInline.parent_organ = this.$route.query.parent_organ
        // 由于老版本不需要实时更新查询条件去查询下属组织 因此传参只需要2个值即可,其他字段完全无用 （备注 可以改装）
        findAllOrganPost({
          organ_id: '',
          organ_name: '',
          parent_organ: this.$route.query.parent_organ,
          startTime: '',
          stopTime: '',
          creator: '',
          from: 1
        }).then(response => {
          this.queryOrgan(response)
        })
      },
      refreshOrganTo() {
        findAllOrganTo().then(response => {
          this.regionOptions = response.data.data
        })
      }
    },
    created() {
      console.log(this.$route.query.parent_organ)
      if (this.$route.query.parent_organ) {
        this.refreshOrgan()
      } else {
        findAllOrganGet().then(response => {
          this.queryOrgan(response)
        })
      }
      this.refreshOrganTo()
    },
    watch: {
      $route(to, from) {
        // 判断url是否带参
        if (!to.query.parent_organ) {
          this.formInline.parent_organ = ''
          findAllOrganGet().then(response => {
            this.queryOrgan(response)
          })
        } else {
          this.refreshOrgan()
        }
      }
    }
  }
</script>
