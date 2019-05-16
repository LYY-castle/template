<template>
  <div class="app-container">
    <div class="filter-container">
      <el-collapse v-model="formContainerOpen" class="form-container" @change="handleChangeAcitve">
        <el-collapse-item title="筛选条件" name="1">
          <el-form :inline="true" class="demo-form-inline" size="small">
            <el-form-item label="产品类型编号：">
              <el-input placeholder="类型编号（上限20字）" v-model="formInline.productTypeId" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="产品类型名称：">
              <el-input placeholder="类型名称（上限100字）" v-model="formInline.productTypeName" maxlength="100"></el-input>
            </el-form-item>
                  <el-form-item label="操作人：">
              <el-input placeholder="操作人（上限45字）" v-model="formInline.modifierName" maxlength="45"></el-input>
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
              <el-button type="primary" @click="formInline.pageNo = 1;queryList()">查询</el-button>
              <el-button @click="reset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
      <el-row class="table-container">
        <el-row class="margin-bottom-20">
          <div class="font14 bold">产品类型表</div>
        </el-row>
        <el-row class="margin-bottom-20">
          <el-button type="success" size="small"  @click="addProductType()">新建</el-button>
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
              prop="productTypeId"
              label="产品类型编号"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <a @click="handleClickDetail(scope.row)">{{scope.row.productTypeId}}</a>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="productTypeName"
              label="产品类型名称"
              :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
              align="center"
              prop="description"
              label="描述"
              :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
              align="center"
              prop="modifierName"
              label="操作人"
              :show-overflow-tooltip="true">
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
                  @click.native.prevent="delVisible=true,delReq=scope.row.productTypeId"
                  type="text"
                  size="small">
                  删除
                </el-button>
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
    <el-dialog title="新建产品类型" :visible.sync="dialogFormVisible" width="30%" @close="resetForm('ruleForm')" append-to-body>
      <el-form size="small" :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="类型名称:" prop="productTypeName">
          <el-input v-model="ruleForm.productTypeName" maxlength="100" placeholder="上限100字符"></el-input>
        </el-form-item>
        <el-form-item label="描述:" prop="description">
          <el-input v-model="ruleForm.description" placeholder="上限255字符" maxlength="255" type="textarea" :rows="4"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')" :disabled="clickTwice">确定</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button type="primary" plain @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改产品类型" :visible.sync="dialogFormVisibleReverse" width="30%" @close="resetForm('ruleFormReverse')" append-to-body>
      <el-form size="small" :model="ruleFormReverse" ref="ruleFormReverse" label-width="100px" class="demo-ruleForm">
        <el-form-item label="产品类型id" prop="productTypeId" hidden>
          <span>{{ruleFormReverse.productTypeId}}</span>
        </el-form-item>
        <el-form-item label="类型名称:" prop="productTypeName">
          <el-input v-model="ruleFormReverse.productTypeName" maxlength="100" placeholder="上限100字符"></el-input>
        </el-form-item>
        <el-form-item label="描述:" prop="description">
          <el-input v-model="ruleFormReverse.description" placeholder="上限255字符" maxlength="255" type="textarea" :rows="4"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormReverse('ruleFormReverse')" :disabled="clickTwiceReverse">确 定</el-button>
        <el-button @click="resetReverse">重置</el-button>
        <el-button type="primary" plain @click="dialogFormVisibleReverse = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="产品类型详情" :visible.sync="dialogFormVisibleDetail" width="30%" append-to-body>
      <el-form size="small" :model="ruleFormReverseDetail" ref="ruleFormReverseDetail" label-width="100px" class="demo-ruleForm">
        <el-form-item label="产品类型id" prop="productTypeId">
          <span>{{ruleFormReverseDetail.productTypeId}}</span>
        </el-form-item>
        <el-form-item label="类型名称:" prop="productTypeName">
          <el-input v-model="ruleFormReverseDetail.productTypeName" maxlength="100" placeholder="上限100字符"></el-input>
        </el-form-item>
        <el-form-item label="描述:" prop="description">
          <el-input v-model="ruleFormReverseDetail.description" placeholder="上限255字符" maxlength="255" type="textarea" :rows="4"></el-input>
        </el-form-item>
        <el-form-item label="操作人：">
          <span>{{ruleFormReverseDetail.modifier}}</span>
        </el-form-item>
        <el-form-item label="操作时间：">
          <span>{{ruleFormReverseDetail.modifyTime}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" plain @click="dialogFormVisibleDetail = false">关闭</el-button>
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
  import { queryProductType, addProductType, deleteProductType, editProductType, queryProductTypeList, deleteProductTypes } from '@/api/product_type'
  import { Message } from 'element-ui'
  import { formatDateTime } from '@/utils/tools'

  export default {
    name: 'product_type',
    data() {
      return {
        batchDelVisible: false,
        delVisible: false,
        delReq: '',
        visibleClass: '',
        formContainerOpen: '1',
        formContainer: this.$store.state.app.formContainer,
        clickTwice: false, // “确定”按钮多次点击
        clickTwiceReverse: false, // “确定”按钮多次点击
        info: {},
        multipleSelection: [],
        timeValue: [],
        pagination: {
          pageSize: null,
          pageNo: null,
          totalCount: null,
          totalPage: null
        },
        tableData: [],
        formInline: {
          productTypeId: null,
          productTypeName: null,
          modifierName: null,
          modifyTimeStart: null,
          modyfyTimeEnd: null,
          pageNo: 1,
          pageSize: 10
        },
        ruleForm: {
          productTypeName: '',
          description: ''
        },
        ruleFormReverse: {
          productTypeId: '',
          productTypeName: '',
          description: ''
        },
        // <-- 暂存修改之前的数据
        tempProdTypeId: '',
        tempProdTypeName: '',
        tempProdDescription: '',
        // -->
        ruleFormReverseDetail: {
          productTypeId: '',
          productTypeName: '',
          description: '',
          modifier: '',
          modifyTime: ''
        },
        dialogFormVisible: false,
        dialogFormVisibleReverse: false,
        dialogFormVisibleDetail: false
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
      addProductType() {
        this.dialogFormVisible = true
        this.clickTwice = false
        this.ruleForm = {
          productTypeName: '',
          description: ''
        }
      },
      deleteAll() {
        const listId = this.multipleSelection.map(function(item, index) {
          return item.productTypeId
        })
        if (listId.length < 1) {
          Message({
            message: '还未选中需要删除的选项',
            type: 'error',
            duration: 1500
          })
          return
        }
        deleteProductTypes(listId).then(res => {
          if (res.data.code === 0) {
            this.formInline.pageNo = 1
            this.queryList()
          }
        })
      },
      submitForm(formName) {
        this.clickTwice = true
        this.$refs[formName].validate((valid) => {
          if (valid) {
            addProductType(this.ruleForm).then(res => {
              if (res.data.code === 0) { // 添加成功
                this.dialogFormVisible = false
                this.queryList()
                this.$refs[formName].resetFields()
              } else {
                Message({
                  message: res.data.message,
                  type: 'error',
                  duration: 1500
                })
                this.clickTwice = false
              }
            })
          } else {
            // console.log('error submit!!')
            this.clickTwice = false
            return false
          }
        })
      },
      submitFormReverse(formName) {
        this.clickTwiceReverse = true
        this.$refs[formName].validate((valid) => {
          if (valid) {
            editProductType(this.ruleFormReverse).then(res => {
              if (res.data.code === 0) {
                this.dialogFormVisibleReverse = false
                this.queryList()
              } else {
                Message({
                  message: res.data.message,
                  type: 'error',
                  duration: 1500
                })
                this.clickTwiceReverse = false
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
        this.timeValue = []
        this.formInline = {
          product_type_name: '',
          modifierName: '',
          modifyTimeStart: '',
          modifyTimeEnd: '',
          pageNo: this.pagination.pageNo,
          pageSize: this.pagination.pageSize
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      deleteRow() {
        deleteProductType({ 'productTypeId': this.delReq }).then(res => {
          if (res.data.code === 0) {
            this.formInline.pageNo = 1
            this.queryList()
          }
        })
      },
      handleClickDetail(row) {
        this.dialogFormVisibleDetail = true
        this.ruleFormReverseDetail = {
          description: row.description,
          productTypeId: row.productTypeId,
          productTypeName: row.productTypeName,
          modifier: row.modifierName,
          modifyTime: formatDateTime(row.modifyTime)
        }
      },
      handleClick(row) {
        this.info = row
        this.dialogFormVisibleReverse = true
        this.clickTwiceReverse = false
        // row已经包含了单个的数据
        queryProductType({ 'productTypeId': row.productTypeId }).then(res => {
          if (res.data.code === 0) {
            this.ruleFormReverse = res.data.data
            this.tempProdTypeName = res.data.data.productTypeName
            this.tempProdTypeId = res.data.data.productTypeId
            this.tempProdDescription = res.data.data.description
          } else {
            Message({
              message: res.data.message,
              type: 'error',
              duration: 1500
            })
          }
        })
      },
      resetReverse() {
        this.ruleFormReverse.productTypeId = this.tempProdTypeId
        this.ruleFormReverse.productTypeName = this.tempProdTypeName
        this.ruleFormReverse.description = this.tempProdDescription
      },
      handleSizeChange(val) {
        this.pagination.pageNo = 1
        this.formInline.pageNo = 1
        this.formInline.pageSize = val
        this.searchProductType(this.formInline)
      },
      handleCurrentChange(val) {
        this.formInline.pageNo = val
        this.formInline.modifyTimeStart = this.timeValue ? this.timeValue[0] : null
        this.formInline.modifyTimeEnd = this.timeValue ? this.timeValue[1] : null
        this.queryList()
      },
      headerRow({ row, rowIndex }) {
        if (rowIndex === 0) {
          return 'color:black'
        } else {
          return ''
        }
      },
      showProductType(res) {
        this.tableData = res.data.data
        this.pagination = res.data.pageInfo
        if (this.tableData.length !== 0) {
          for (let i = 0; i <= this.tableData.length; i++) {
            if (this.tableData[i]) {
              this.tableData[i].updateTime = formatDateTime(this.tableData[i].updateTime)
            }
          }
        }
      },
      searchProductType(req) {
        // 根据老版本的逻辑 查询只能传分页页码的第一页
        req.pageNo = 1
        req.modifyTimeStart = this.timeValue ? this.timeValue[0] : null
        req.modifyTimeEnd = this.timeValue ? this.timeValue[1] : null
        queryProductTypeList(req).then(response => {
          this.showProductType(response)
        })
      },
      queryList() {
        this.formInline.modifyTimeStart = this.timeValue ? this.timeValue[0] : null
        this.formInline.modifyTimeEnd = this.timeValue ? this.timeValue[1] : null
        queryProductTypeList(this.formInline).then(res => {
          if (res.data.code === 0) {
            this.showProductType(res)
          } else {
            Message({
              message: res.data.message,
              type: 'error',
              duration: 1500
            })
          }
        })
      }
    },
    mounted() {
      this.formContainer()
      this.handleChangeAcitve()
      this.queryList()
    }
  }
</script>

