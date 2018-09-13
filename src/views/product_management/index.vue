<template>
  <div class="container" >
    <el-row margin-top:>
      <el-form :inline="true" size="small" :model="req" ref="searchForm">
        <el-form-item prop="productId" label="产品编号：">
          <el-input v-model="req.productId" placeholder="产品编号"></el-input>
        </el-form-item>
        <el-form-item prop="productName" label="产品名称：">
          <el-input v-model="req.productName" placeholder="产品名称"></el-input>
        </el-form-item>
        <el-form-item prop="priceStart" label="产品价格：">
          <el-input v-model="req.priceStart" placeholder="产品价格"></el-input>
        </el-form-item>
        <el-form-item prop="priceEnd" label="至">
          <el-input v-model="req.priceEnd" placeholder="产品价格"></el-input>
        </el-form-item>
        <el-form-item prop="modifierName" label="操作人：">
          <el-input v-model="req.modifierName" placeholder="操作人"></el-input>
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
          <el-button size="small" type="primary" @click="req.pageNo=1;queryProductList(req)">查询</el-button>
          <el-button size="small" type="danger" @click="timeValue=[],resetReq();">重置</el-button>
        </el-form-item>
      </el-form>
    </el-row>
     <!-- 表格 -->
    <el-row>
      <el-col>
        <el-table
          :data="tableData"
          border
          @selection-change="handleSelectionChange">
          <el-table-column
            align="center"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            align="center"
            label="序号"
            width="55">
            <template
              slot-scope="scope">
              <div>{{scope.$index+(req.pageNo-1)*req.pageSize+1}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="产品编号"
            prop="productId">
          </el-table-column> 
          <el-table-column
            align="center"
            label="产品名称"
            prop="productName"
            :show-overflow-tooltip="true">
          </el-table-column> 
          <el-table-column
            align="center"
            label="产品价格"
            prop="price">
          </el-table-column> 
           <el-table-column
            align="center"
            label="产品类型"
            prop="productTypeInfo.productTypeName">
          </el-table-column> 
          <el-table-column
            align="center"
            label="描述"
            prop="description">
          </el-table-column> 
          <el-table-column
            align="center"
            label="操作人"
            prop="modifierName"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            align="center"
            label="操作时间"
            prop="modifyTime"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="100"
            :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-button @click="editVisible=true;productId=scope.row.productId;queryProductInfo(scope.row.productId);" type="text" size="small">修改</el-button>
            <el-button @click="delVisible=true;productId=scope.row.productId" type="text" size="small">删除</el-button>
          </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row style="margin-top:5px;">
        <el-button type="success" size="small" @click="addVisible=true;queryProductTypes();resetForm('refAddProduct');">新建</el-button>
        <el-button type="danger" size="small" @click="batchDelVisible=true">批量删除</el-button>
        <el-pagination
          v-if="pageShow"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page='pageInfo.pageNo'
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size='pageInfo.pageSize'
          layout="total, sizes, prev, pager, next, jumper "
          :total='pageInfo.totalCount' style="text-align: right;float:right;">
        </el-pagination>
    </el-row>
    <!-- 新建产品 -->
     <el-dialog
      align:left
      width="30%"
      title="新建产品"
      :visible.sync="addVisible"
      append-to-body>
      <el-form  :model="addProduct" ref="refAddProduct" label-width="100px">
        <el-form-item label="产品名称" prop="productName">
          <el-input v-model="addProduct.productName" size="small"></el-input>
        </el-form-item>
        <el-form-item label="产品价格" prop="price">
          <el-input v-model="addProduct.price" size="small"></el-input>
        </el-form-item>
        <el-form-item label="产品类型" prop="productTypeId">
          <el-select v-model="addProduct.productTypeId" style="width: 100%;">
            <el-option key="" label="请选择类型" value=""></el-option>
            <el-option
                v-for="item in ProductType"
                :key="item.productTypeId"
                :label="item.productTypeName"
                :value="item.productTypeId">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item
          v-for="item in addProduct.productPropertyList"
          :label="item.propertyName"
          :key="item.key">
          <el-input v-model="item.propertyValue" v-if="item.templateType==='text'" readonly="true"></el-input><el-button @click.prevent="modifyPropertyVisible=true;modifyItem(item)" v-if="item.templateType==='text'">修改</el-button><el-button @click.prevent="removeItem(item)" v-if="item.templateType==='text'">删除</el-button>
          <el-input type="textarea" v-model="item.propertyValue" v-if="item.templateType==='textarea'" readonly="true"></el-input><el-button @click.prevent="modifyPropertyVisible=true;modifyItem(item)" v-if="item.templateType==='textarea'">修改</el-button><el-button @click.prevent="removeItem(item)" v-if="item.templateType==='textarea'">删除</el-button>
          <el-select v-model="item.propertyType" readonly="true" style="width: 100%;" v-if="item.templateType==='radio'" >
            <el-option
                v-for="tag in item.propertyValue"
                :label="tag"
                :value="tag">
            </el-option>
          </el-select><el-button  @click.prevent="modifyPropertyVisible=true;modifyItem(item)" v-if="item.templateType==='radio'">修改</el-button><el-button @click.prevent="removeItem(item)" v-if="item.templateType==='radio'">删除</el-button>
          <el-select multiple v-model="item.propertyType" readonly="true"  style="width: 100%;" v-if="item.templateType==='checkbox'" >
            <el-option
                v-for="tag in item.propertyValue"
                :label="tag"
                :value="tag">
            </el-option>
          </el-select><el-button @click.prevent="modifyPropertyVisible=true;modifyItem(item)" v-if="item.templateType==='checkbox'">修改</el-button><el-button @click.prevent="removeItem(item)" v-if="item.templateType==='checkbox'">删除</el-button>
        </el-form-item>
        <el-form-item label="产品备注" prop="description">
          <el-input type="textarea" v-model="addProduct.description" size="small"></el-input>
        </el-form-item>
      </el-form>
        <div slot="footer" style="text-align: right;">
          <el-button size="small" type="danger" @click="resetForm('refAddProduct');">重 置</el-button>
          <el-button size="small" @click="addVisible = false">取 消</el-button>
          <el-button @click="resetProductPropertyInfo();propertyVisible=true">新增属性</el-button>
          <el-button size="small" type="primary" @click="createProductInfo()">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 新增产品属性 -->
     <el-dialog
      align:left
      width="30%"
      title="新增属性"
      :visible.sync="propertyVisible"
      append-to-body>
      <el-form  :model="productPropertyInfo" ref="refProperty" label-width="120px">
        <el-form-item label="属性名称" prop="propertyName">
          <el-input v-model="productPropertyInfo.propertyName" size="small"></el-input>
        </el-form-item>
        <el-form-item label="英文名称" prop="propertyKey">
          <el-input v-model="productPropertyInfo.propertyKey" size="small"></el-input>
        </el-form-item>
        <el-form-item label="属性值是否输入" prop="showOrInput">
          <el-select v-model="productPropertyInfo.showOrInput" style="width: 100%;" @change="resetProperty()">
            <el-option value="" label="请选择属性值是否输入"></el-option>
            <el-option value="0" label="是"></el-option>
            <el-option value="1" label="否"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="属性值长度" prop="propertyLength" v-if="productPropertyInfo.showOrInput==='1'">
          <el-input v-model="productPropertyInfo.propertyLength" size="small"></el-input>
        </el-form-item>
        <el-form-item label="属性值类型" prop="propertyType" v-if="productPropertyInfo.showOrInput==='1'">
          <el-select v-model="productPropertyInfo.propertyType" style="width: 100%;">
            <el-option value="" label="请选择类型"></el-option>
            <el-option value="1" label="字符串"></el-option>
            <el-option value="2" label="数字"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="属性值是否必填" prop="isRequired" v-if="productPropertyInfo.showOrInput==='1'">
          <el-select v-model="productPropertyInfo.isRequired" style="width: 100%;">
            <el-option value="" label="请选择属性值是否必填"></el-option>
            <el-option value="1" label="否"></el-option>
            <el-option value="0" label="是"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板类型" prop="templateType" v-if="productPropertyInfo.showOrInput==='1'">
          <el-select v-model="productPropertyInfo.templateType" style="width: 100%;">
            <el-option value="" label="请选择模板类型"></el-option>
            <el-option value="text" label="文本"></el-option>
            <el-option value="textarea" label="文本域"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板类型" prop="templateType" v-if="productPropertyInfo.showOrInput==='0'">
          <el-select v-model="productPropertyInfo.templateType" style="width: 100%;">
            <el-option value="" label="请选择模板类型"></el-option>
            <el-option value="text" label="文本"></el-option>
            <el-option value="radio" label="单选"></el-option>
            <el-option value="checkbox" label="多选"></el-option>
            <el-option value="textarea" label="文本域"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="属性值" prop="propertyValue" v-if="productPropertyInfo.showOrInput==='0'&&productPropertyInfo.templateType==='text'">
          <el-input v-model="productPropertyInfo.propertyValue" size="small"></el-input>
        </el-form-item>
        <el-form-item label="属性值" prop="propertyValue" v-if="productPropertyInfo.showOrInput==='0'&&productPropertyInfo.templateType==='textarea'">
          <el-input type="textarea" v-model="productPropertyInfo.propertyValue" size="small"></el-input>
        </el-form-item>
        <el-form-item
          v-for="(domain, index) in productPropertyInfo.domains"
          label="属性值"
          :key="domain.key"
          :prop="'domains.' + index + '.value'"
          :rules="{
            required: true, message: '域名不能为空', trigger: 'blur'
          }" v-if="productPropertyInfo.templateType==='radio'||productPropertyInfo.templateType==='checkbox'||productPropertyInfo.templateType==='select'">
          <el-input v-model="domain.value"></el-input><el-button @click.prevent="removeDomain(domain)">删除</el-button>
        </el-form-item>
         <el-form-item label="属性排序" prop="sort">
          <el-input  v-model="productPropertyInfo.sort" size="small"></el-input>
        </el-form-item>
        <el-form-item label="属性备注" prop="mark">
          <el-input type="textarea" v-model="productPropertyInfo.mark" size="small"></el-input>
        </el-form-item>
      </el-form>
        <div slot="footer" style="text-align: right;">
          <el-button size="small" type="danger" @click="resetProductPropertyInfo();">重 置</el-button>
          <el-button size="small" @click="propertyVisible = false">取 消</el-button>
          <el-button @click="addDomain()" v-if="productPropertyInfo.templateType==='radio'||productPropertyInfo.templateType==='checkbox'||productPropertyInfo.templateType==='select'">新增属性值</el-button>
          <el-button size="small" type="primary" @click="submitForm('refAddProduct');addProductPropertyInfo();">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 修改产品属性 -->
     <el-dialog
      align:left
      width="30%"
      title="修改属性"
      :visible.sync="modifyPropertyVisible"
      append-to-body>
      <el-form  :model="modifyProductPropertyInfo" ref="refModifyProperty" label-width="120px">
        <el-form-item label="属性名称" prop="propertyName">
          <el-input v-model="modifyProductPropertyInfo.propertyName" size="small"></el-input>
        </el-form-item>
        <el-form-item label="英文名称" prop="propertyKey">
          <el-input v-model="modifyProductPropertyInfo.propertyKey" size="small"></el-input>
        </el-form-item>
        <el-form-item label="属性值是否输入" prop="showOrInput">
          <el-select v-model="modifyProductPropertyInfo.showOrInput" style="width: 100%;" @change="resetProperty()">
            <el-option value="" label="请选择属性值是否输入"></el-option>
            <el-option value="0" label="是"></el-option>
            <el-option value="1" label="否"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="属性值长度" prop="propertyLength" v-if="modifyProductPropertyInfo.showOrInput==='1'">
          <el-input v-model="modifyProductPropertyInfo.propertyLength" size="small"></el-input>
        </el-form-item>
        <el-form-item label="属性值类型" prop="propertyType" v-if="modifyProductPropertyInfo.showOrInput==='1'">
          <el-select v-model="modifyProductPropertyInfo.propertyType" style="width: 100%;">
            <el-option value="" label="请选择类型"></el-option>
            <el-option value="1" label="字符串"></el-option>
            <el-option value="2" label="数字"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="属性值是否必填" prop="isRequired" v-if="modifyProductPropertyInfo.showOrInput==='1'">
          <el-select v-model="modifyProductPropertyInfo.isRequired" style="width: 100%;">
            <el-option value="" label="请选择属性值是否必填"></el-option>
            <el-option value="1" label="否"></el-option>
            <el-option value="0" label="是"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板类型" prop="templateType" v-if="modifyProductPropertyInfo.showOrInput==='1'">
          <el-select v-model="modifyProductPropertyInfo.templateType" style="width: 100%;">
            <el-option value="" label="请选择模板类型"></el-option>
            <el-option value="text" label="文本"></el-option>
            <el-option value="textarea" label="文本域"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板类型" prop="templateType" v-if="modifyProductPropertyInfo.showOrInput==='0'">
          <el-select v-model="modifyProductPropertyInfo.templateType" style="width: 100%;"  @change="resetModifyProperty()">
            <el-option value="" label="请选择模板类型"></el-option>
            <el-option value="text" label="文本"></el-option>
            <el-option value="radio" label="单选"></el-option>
            <el-option value="checkbox" label="多选"></el-option>
            <el-option value="textarea" label="文本域"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="属性值" prop="propertyValue" v-if="modifyProductPropertyInfo.showOrInput==='0'&&modifyProductPropertyInfo.templateType==='text'">
          <el-input v-model="modifyProductPropertyInfo.propertyValue" size="small"></el-input>
        </el-form-item>
        <el-form-item label="属性值" prop="propertyValue" v-if="modifyProductPropertyInfo.showOrInput==='0'&&modifyProductPropertyInfo.templateType==='textarea'">
          <el-input type="textarea" v-model="modifyProductPropertyInfo.propertyValue" size="small"></el-input>
        </el-form-item>
        <el-form-item
          v-for="(domain, index) in modifyProductPropertyInfo.domains"
          label="属性值"
          :key="domain.key"
          :prop="'domains.' + index + '.value'"
          :rules="{
            required: true, message: '域名不能为空', trigger: 'blur'
          }" v-if="modifyProductPropertyInfo.templateType==='radio'||modifyProductPropertyInfo.templateType==='checkbox'||modifyProductPropertyInfo.templateType==='select'">
          <el-input v-model="domain.value"></el-input><el-button @click.prevent="removeModifyDomain(domain)">删除</el-button>
        </el-form-item>
         <el-form-item label="属性排序" prop="sort">
          <el-input  v-model="modifyProductPropertyInfo.sort" size="small"></el-input>
        </el-form-item>
        <el-form-item label="属性备注" prop="mark">
          <el-input type="textarea" v-model="modifyProductPropertyInfo.mark" size="small"></el-input>
        </el-form-item>
      </el-form>
        <div slot="footer" style="text-align: right;">
          <el-button size="small" type="danger" @click="resetModifyProductPropertyInfo();">重 置</el-button>
          <el-button size="small" @click="modifyPropertyVisible = false">取 消</el-button>
          <el-button @click="addModifyDomain()" v-if="modifyProductPropertyInfo.templateType==='radio'||modifyProductPropertyInfo.templateType==='checkbox'||modifyProductPropertyInfo.templateType==='select'">新增属性值</el-button>
          <el-button size="small" type="primary" @click="submitForm('refAddProduct');modifyProductProperty();">确 定</el-button>
        </div>
    </el-dialog>
      <!-- 批量删除 -->
      <el-dialog
        width="30%"
        title="批量删除"
        :visible.sync="batchDelVisible"
        append-to-body>
        <span style="font-size:20px;">确定删除选定内容？</span>
        <div slot="footer" class="dialog-footer" style="text-align: right;">
          <el-button @click="batchDelVisible = false">取 消</el-button>
          <el-button type="primary" @click="batchDelVisible = false;deleteProductInfos(batchDelIds);">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 删除 -->
      <el-dialog
      width="30%"
      title="删除"
      :visible.sync="delVisible"
      append-to-body>
      <span style="font-size:20px;">确定删吗？</span>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="delVisible = false;deleteProductInfo(productId);">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { queryProductList, queryProductInfo, deleteProductInfos, deleteProductInfo, queryProductTypes, createProductInfo } from '@/api/product_management'
export default {
  name: 'productManagement',
  data() {
    return {
      modifyPropertyVisible: false,
      propertyVisible: false,
      addVisible: false,
      delVisible: false,
      batchDelVisible: false,
      pageShow: true,
      req: {
        productId: '',
        productName: '',
        modifierName: '',
        modifyTimeStart: '',
        modifyTimeEnd: '',
        pageNo: 1,
        pageSize: 10
      },
      timeValue: [],
      batchDelIds: [],
      tableData: [],
      pageInfo: {},
      productId: '',
      ProductType: {},
      productDetail: {},
      addProduct: {
        productName: '',
        price: '',
        productTypeId: '',
        description: '',
        productPropertyList: []
      },
      productPropertyInfo: {
        isRequired: '', // 是否必填 0否 1是
        mark: '', // 属性说明
        propertyKey: '', // 属性key
        propertyLength: '', // 属性长度
        propertyName: '', // 属性name
        propertyType: '', // 属性类型 1字符串 2数字
        propertyValue: '', // 属性value
        showOrInput: '', // 输入还是展示 0展示 1输入
        sort: '', // 显示排序
        templateType: '', // 模板类型
        domains: [{
          value: ''
        }]
      },
      modifyId: '',
      modifyProductPropertyInfo: {
        isRequired: '', // 是否必填 0否 1是
        mark: '', // 属性说明
        propertyKey: '', // 属性key
        propertyLength: '', // 属性长度
        propertyName: '', // 属性name
        propertyType: '', // 属性类型 1字符串 2数字
        propertyValue: '', // 属性value
        showOrInput: '', // 输入还是展示 0展示 1输入
        sort: '', // 显示排序
        templateType: '', // 模板类型
        domains: [{
          value: ''
        }]
      }
    }
  },
  mounted() {
    this.queryProductList()
  },
  methods: {
    queryProductList() {
      this.req.modifyTimeStart = ''
      this.req.modifyTimeEnd = ''
      if (this.timeValue && this.timeValue.length > 0) {
        this.req.modifyTimeStart = this.timeValue[0]
        this.req.modifyTimeEnd = this.timeValue[1]
      }
      queryProductList(this.req).then(response => {
        if (response.data.code === 0) {
          this.tableData = response.data.data
          if (response.data.pageInfo) {
            this.pageInfo = response.data.pageInfo
            this.pageShow = true
          } else {
            this.pageShow = false
          }
        } else {
          this.$message.error(response.data.messages)
          this.tableData = response.data.data
          this.pageShow = false
        }
      }).catch(error => {
        console.log(error)
      })
    },
    queryProductInfo() {
      queryProductInfo(this.productId).then(response => {
        if (response.data.code === 0) {
          this.productDetail = response.data.data
        } else {
          this.$message.error(response.data.message)
        }
      })
    },
    createProductInfo() {
      createProductInfo(this.addProduct).then(response => {
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
          this.queryProductList()
          this.addVisible = false
        } else {
          this.$message.error(response.data.message)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    queryProductTypes() {
      queryProductTypes().then(response => {
        if (response.data.code === 0) {
          this.ProductType = response.data.data
        } else {
          this.$message.error(response.data.message)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    deleteProductInfos() {
      if (this.batchDelIds.length === 0) {
        this.$message.error('请选择需要删除的内容')
      } else {
        deleteProductInfos(this.batchDelIds).then(response => {
          if (response.data.code === 0) {
            this.$message.success(response.data.message)
            this.req.pageNo = 1
            this.queryProductList()
          } else {
            this.$message.error(response.data.message)
          }
        }).catch(error => {
          console.log(error)
        })
      }
    },
    deleteProductInfo() {
      deleteProductInfo(this.productId).then(response => {
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
          this.req.pageNo = 1
          this.queryProductList()
        } else {
          this.$message.error(response.data.message)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    resetForm(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
    },
    submitForm(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.validate = true
          } else {
            this.$message.error('请检查是否填写正确')
            this.validate = false
          }
        })
      }
    },
    addProductPropertyInfo() {
      if (this.productPropertyInfo.templateType === 'checkbox' || this.productPropertyInfo.templateType === 'radio') {
        this.productPropertyInfo.propertyValue = []
        this.productPropertyInfo.domains.forEach(element => {
          this.productPropertyInfo.propertyValue.push(element.value)
        })
      }
      const obj = { isRequired: this.productPropertyInfo.isRequired, // 是否必填 0否 1是
        mark: this.productPropertyInfo.mark, // 属性说明
        propertyKey: this.productPropertyInfo.propertyKey, // 属性key
        propertyLength: this.productPropertyInfo.propertyLength, // 属性长度
        propertyName: this.productPropertyInfo.propertyName, // 属性name
        propertyType: this.productPropertyInfo.propertyType, // 属性类型 1字符串 2数字
        propertyValue: this.productPropertyInfo.propertyValue, // 属性value
        showOrInput: this.productPropertyInfo.showOrInput, // 输入还是展示 0展示 1输入
        sort: this.productPropertyInfo.sort, // 显示排序
        templateType: this.productPropertyInfo.templateType // 模板类型
      }
      this.addProduct.productPropertyList.push(obj)
      console.log('productPropertyList:', this.addProduct.productPropertyList)
      this.propertyVisible = false
    },
    resetReq() {
      this.timeValue = {
        productId: '',
        productName: '',
        modifierName: '',
        modifyTimeStart: '',
        modifyTimeEnd: '',
        pageNo: 1,
        pageSize: 10
      }
      this.timeValue = []
    },
    resetProperty() {
      this.productPropertyInfo.isRequired = '' // 是否必填 0否 1是
      this.productPropertyInfo.propertyLength = ''// 属性长度
      this.productPropertyInfo.propertyType = '' // 属性类型 1字符串 2数字
      this.productPropertyInfo.propertyValue = ''// 属性value
      this.productPropertyInfo.templateType = ''// 模板类型
      this.productPropertyInfo.domains = [{
        value: ''
      }]// 模板类型
    },
    resetProductPropertyInfo() {
      this.productPropertyInfo = {
        isRequired: '', // 是否必填 0否 1是
        mark: '', // 属性说明
        propertyKey: '', // 属性key
        propertyLength: '', // 属性长度
        propertyName: '', // 属性name
        propertyType: '', // 属性类型 1字符串 2数字
        propertyValue: '', // 属性value
        showOrInput: '', // 输入还是展示 0展示 1输入
        sort: '', // 显示排序
        templateType: '', // 模板类型
        domains: [{
          value: ''
        }]
      }
    },
    // 表格多选框
    handleSelectionChange(val) {
      this.batchDelIds = []
      for (var i = 0; i < val.length; i++) {
        this.batchDelIds.push(val[i].productId)
      }
    },
    // 页面显示条数
    handleSizeChange(val) {
      this.req.pageNo = 1
      this.req.pageSize = val
      this.queryProductList(this.req)
    },
    // 分页翻页功能
    handleCurrentChange(val) {
      this.req.pageNo = val
      this.queryProductList(this.req)
    },
    removeDomain(item) {
      var index = this.productPropertyInfo.domains.indexOf(item)
      if (index !== -1) {
        this.productPropertyInfo.domains.splice(index, 1)
      }
    },
    removeItem(item) {
      var index = this.addProduct.productPropertyList.indexOf(item)
      if (index !== -1) {
        this.addProduct.productPropertyList.splice(index, 1)
      }
    },
    modifyItem(item) {
      console.log('item55555;', item)
      this.modifyProductPropertyInfo = JSON.parse(JSON.stringify(item))
      if (this.modifyProductPropertyInfo.templateType === 'radio' || this.modifyProductPropertyInfo.templateType === 'checkbox' || this.modifyProductPropertyInfo.templateType === 'select') {
        this.modifyProductPropertyInfo.domains = []
        this.modifyProductPropertyInfo.propertyValue.forEach(element => {
          this.modifyProductPropertyInfo.domains.push({
            value: element
          })
        })
      }
      this.modifyId = this.addProduct.productPropertyList.indexOf(item)
    },
    addDomain() {
      this.productPropertyInfo.domains.push({
        value: '',
        key: Date.now()
      })
    },
    addModifyDomain() {
      console.log('99999999', this.modifyProductPropertyInfo.domains)
      this.modifyProductPropertyInfo.domains.push({
        value: '',
        key: Date.now()
      })
    },
    removeModifyDomain(item) {
      var index = this.modifyProductPropertyInfo.domains.indexOf(item)
      if (index !== -1) {
        this.modifyProductPropertyInfo.domains.splice(index, 1)
      }
    },
    modifyProductProperty() {
      if (this.modifyProductPropertyInfo.templateType === 'checkbox' || this.modifyProductPropertyInfo.templateType === 'radio') {
        this.modifyProductPropertyInfo.propertyValue = []
        this.modifyProductPropertyInfo.domains.forEach(element => {
          this.modifyProductPropertyInfo.propertyValue.push(element.value)
        })
      }
      const obj = { isRequired: this.modifyProductPropertyInfo.isRequired, // 是否必填 0否 1是
        mark: this.modifyProductPropertyInfo.mark, // 属性说明
        propertyKey: this.modifyProductPropertyInfo.propertyKey, // 属性key
        propertyLength: this.modifyProductPropertyInfo.propertyLength, // 属性长度
        propertyName: this.modifyProductPropertyInfo.propertyName, // 属性name
        propertyType: this.modifyProductPropertyInfo.propertyType, // 属性类型 1字符串 2数字
        propertyValue: this.modifyProductPropertyInfo.propertyValue, // 属性value
        showOrInput: this.modifyProductPropertyInfo.showOrInput, // 输入还是展示 0展示 1输入
        sort: this.modifyProductPropertyInfo.sort, // 显示排序
        templateType: this.modifyProductPropertyInfo.templateType // 模板类型
      }
      this.addProduct.productPropertyList.splice(this.modifyId, 1, obj)
      this.modifyPropertyVisible = false
    },
    resetModifyProperty() {
      console.log('5555555555555')
      this.modifyProductPropertyInfo.propertyValue = ''
      this.modifyProductPropertyInfo.domains = []
      this.modifyProductPropertyInfo.domains.push({
        value: ''
      })
      console.log('11111111', this.modifyProductPropertyInfo)
    }
  }
}
</script>
  