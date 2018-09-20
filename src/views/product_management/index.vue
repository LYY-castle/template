<template>
  <div class="container" >
    <el-row margin-top:>
      <el-form :inline="true" size="small" :model="req" ref="searchForm">
        <el-form-item prop="templateId" label="产品编号：">
          <el-input v-model="req.templateId" placeholder="产品编号"></el-input>
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
          <el-button size="small" type="primary" @click="req.pageNo=1;queryTemplateList(req)">查询</el-button>
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
            prop="templateId">
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
            <el-button @click="editVisible=true;templateId=scope.row.templateId;queryTemplateInfo(scope.row.templateId);" type="text" size="small">修改</el-button>
            <el-button @click="delVisible=true;templateId=scope.row.templateId" type="text" size="small">删除</el-button>
          </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row style="margin-top:5px;">
        <el-button type="success" size="small" @click="addVisible=true;queryProductTypes();resetAddProduct();">新建</el-button>
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
      <el-form :rules="rules" :model="addProduct" ref="refAddProduct" label-width="100px">
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
        <el-form-item label="产品备注" prop="description">
          <el-input type="textarea" v-model="addProduct.description" size="small"></el-input>
        </el-form-item>
        <!-- 新增属性 -->
        <el-form-item label="属性">
          <el-button type="success" @click="resetProductPropertyInfo();propertyVisible=true">新增</el-button>
        </el-form-item>
        <el-form-item
          v-for="item in addProduct.propertyInfos"
          :label="item.propertyName"
          :key="item.key">
          <el-input v-model="item.propertyValue" v-if="item.templateType==='text'" readonly="true" style="width: 50%;"></el-input><el-button @click.prevent="modifyPropertyVisible=true;modifyItem(item)" v-if="item.templateType==='text'" style="width: 20%;margin-left: 10px;">修改</el-button><el-button @click.prevent="removeItem(item)" v-if="item.templateType==='text'" style="width: 20%;">删除</el-button>
          <el-input type="textarea" v-model="item.propertyValue" v-if="item.templateType==='textarea'" readonly="true"  style="width: 50%;"></el-input><el-button @click.prevent="modifyPropertyVisible=true;modifyItem(item)" v-if="item.templateType==='textarea'" style="width: 20%;margin-left: 10px;">修改</el-button><el-button @click.prevent="removeItem(item)" v-if="item.templateType==='textarea'" style="width: 20%;">删除</el-button>
          <el-select v-model="item.propertyType" readonly="true" style="width: 50%;" v-if="item.templateType==='radio'" >
            <el-option
                v-for="tag in item.propertyValue"
                :label="tag"
                :value="tag"
                :disabled="true">
            </el-option>
          </el-select><el-button  @click.prevent="modifyPropertyVisible=true;modifyItem(item)" v-if="item.templateType==='radio'" style="width: 20%;margin-left: 10px;">修改</el-button><el-button @click.prevent="removeItem(item)" v-if="item.templateType==='radio'" style="width: 20%;">删除</el-button>
          <el-select multiple v-model="item.propertyType" readonly="true"  style="width: 50%;" v-if="item.templateType==='checkbox'" >
            <el-option
                v-for="tag in item.propertyValue"
                :label="tag"
                :value="tag"
                :disabled="true">
            </el-option>
          </el-select><el-button @click.prevent="modifyPropertyVisible=true;modifyItem(item)" v-if="item.templateType==='checkbox'"  style="width: 20%;margin-left: 10px;">修改</el-button><el-button @click.prevent="removeItem(item)" v-if="item.templateType==='checkbox'"  style="width: 20%;">删除</el-button>
        </el-form-item>
      </el-form>
        <div slot="footer" style="text-align: right;">
          <el-button size="small" type="danger" @click="resetForm('refAddProduct');">重 置</el-button>
          <el-button size="small" @click="addVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="createTemplateInfo('refAddProduct')">确 定</el-button>
        </div>
    </el-dialog>
      <!-- 修改产品 -->
     <el-dialog
      align:left
      width="30%"
      title="修改产品"
      :visible.sync="modifyVisible"
      append-to-body>
      <el-form :rules="rules" :model="addProduct" ref="refUpateProduct" label-width="100px">
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
        <el-form-item label="产品备注" prop="description">
          <el-input type="textarea" v-model="addProduct.description" size="small"></el-input>
        </el-form-item>
        <!-- 新增属性 -->
        <el-form-item label="属性">
          <el-button type="success" @click="resetProductPropertyInfo();propertyVisible=true">新增</el-button>
        </el-form-item>
        <el-form-item
          v-for="item in addProduct.propertyInfos"
          :label="item.propertyName"
          :key="item.key">
          <el-input v-model="item.propertyValue" v-if="item.templateType==='text'" readonly="true" style="width: 50%;"></el-input><el-button @click.prevent="modifyPropertyVisible=true;modifyItem(item)" v-if="item.templateType==='text'" style="width: 20%;margin-left: 10px;">修改</el-button><el-button @click.prevent="removeItem(item)" v-if="item.templateType==='text'" style="width: 20%;">删除</el-button>
          <el-input type="textarea" v-model="item.propertyValue" v-if="item.templateType==='textarea'" readonly="true" style="width: 50%;"></el-input><el-button @click.prevent="modifyPropertyVisible=true;modifyItem(item)" v-if="item.templateType==='textarea'" style="width: 20%;margin-left: 10px;">修改</el-button><el-button @click.prevent="removeItem(item)" v-if="item.templateType==='textarea'" style="width: 20%;">删除</el-button>
          <el-select v-model="item.propertyType" readonly="true" style="width: 50%;" v-if="item.templateType==='radio'" >
            <el-option
                v-for="tag in item.propertyValue"
                :label="tag"
                :value="tag"
                :disabled="true">
            </el-option>
          </el-select><el-button  @click.prevent="modifyPropertyVisible=true;modifyItem(item)" v-if="item.templateType==='radio'" style="width: 20%;margin-left: 10px;">修改</el-button><el-button @click.prevent="removeItem(item)" v-if="item.templateType==='radio'" style="width: 20%;">删除</el-button>
          <el-select multiple v-model="item.propertyType" readonly="true"  style="width: 50%;" v-if="item.templateType==='checkbox'" >
            <el-option
                v-for="tag in item.propertyValue"
                :label="tag"
                :value="tag"
                :disabled="true">
            </el-option>
          </el-select><el-button @click.prevent="modifyPropertyVisible=true;modifyItem(item)" v-if="item.templateType==='checkbox'" style="width: 20%;margin-left: 10px;">修改</el-button><el-button @click.prevent="removeItem(item)" v-if="item.templateType==='checkbox'" style="width: 20%;">删除</el-button>
        </el-form-item>
      </el-form>
        <div slot="footer" style="text-align: right;">
          <el-button size="small" type="danger" @click="queryTemplateInfo(templateId);">重 置</el-button>
          <el-button size="small" @click="modifyVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="modifyDialog('refUpateProduct')">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 新增属性 -->
     <el-dialog
      align:left
      width="30%"
      title="新增属性"
      :visible.sync="propertyVisible"
      append-to-body>
      <el-form :rules="rules" :model="productPropertyInfo" ref="refProperty" label-width="120px">
        <el-form-item label="属性名称" prop="propertyName">
          <el-input v-model="productPropertyInfo.propertyName" size="small"></el-input>
        </el-form-item>
        <el-form-item label="英文名称" prop="propertyKey">
          <el-input v-model="productPropertyInfo.propertyKey" size="small"></el-input>
        </el-form-item>
        <el-form-item label="输入或展示" prop="showOrInput">
          <el-select v-model="productPropertyInfo.showOrInput" style="width: 100%;" @change="resetProperty()">
            <el-option value="" label="请选择输入或展示"></el-option>
            <el-option value="1" label="输入"></el-option>
            <el-option value="0" label="展示"></el-option>
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
            <el-option value="text" label="短文本"></el-option>
            <el-option value="textarea" label="长文本"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板类型" prop="templateType" v-if="productPropertyInfo.showOrInput==='0'">
          <el-select v-model="productPropertyInfo.templateType" style="width: 100%;"  @change="changeResetProductProperty()">
            <el-option value="" label="请选择模板类型"></el-option>
            <el-option value="text" label="短文本"></el-option>
            <el-option value="radio" label="单选"></el-option>
            <el-option value="checkbox" label="多选"></el-option>
            <el-option value="textarea" label="长文本"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="属性值" prop="propertyValue" v-if="productPropertyInfo.showOrInput==='0'&&productPropertyInfo.templateType==='text'">
          <el-input v-model="productPropertyInfo.propertyValue" size="small"></el-input>
        </el-form-item>
        <el-form-item label="属性值" prop="propertyValue" v-if="productPropertyInfo.showOrInput==='0'&&productPropertyInfo.templateType==='textarea'">
          <el-input type="textarea" v-model="productPropertyInfo.propertyValue" size="small"></el-input>
        </el-form-item>
         <el-form-item label="属性排序" prop="sort">
          <el-input  v-model="productPropertyInfo.sort" size="small" placeholder="该属性在该产品所有属性的展示顺序"></el-input>
        </el-form-item> 
        <el-form-item label="属性备注" prop="mark">
          <el-input type="textarea" v-model="productPropertyInfo.mark" size="small"></el-input>
        </el-form-item>
        <!-- 新增属性值 -->
        <el-form-item label="属性值"  v-if="productPropertyInfo.templateType==='radio'||productPropertyInfo.templateType==='checkbox'||productPropertyInfo.templateType==='select'">
          <el-button type="success" @click="addDomain()" v-if="productPropertyInfo.templateType==='radio'||productPropertyInfo.templateType==='checkbox'||productPropertyInfo.templateType==='select'">新增</el-button>
        </el-form-item>
        <el-form-item
            v-for="(domain, index) in productPropertyInfo.domains"
            :label="'属性值'+(index+1)"
            :key="domain.key"
            :prop="'domains.' + index + '.value'"
            :rules="[
            {required: true, message: '不能为空', trigger: 'blur'},
            { min: 0, max: 50, message: '超过长度', trigger: 'blur' }
            ]" v-if="productPropertyInfo.templateType==='radio'||productPropertyInfo.templateType==='checkbox'||productPropertyInfo.templateType==='select'">
            <el-input v-model="domain.value" style="width: 70%;"></el-input><el-button @click.prevent="removeDomain(domain)" style="width: 20%;margin-left: 10px;">删除</el-button>
        </el-form-item>
      </el-form>
        <div slot="footer" style="text-align: right;">
          <el-button size="small" type="danger" @click="resetProductPropertyInfo();">重 置</el-button>
          <el-button size="small" @click="propertyVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="addProductPropertyInfo('refProperty');">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 修改产品属性 -->
     <el-dialog
      align:left
      width="30%"
      title="修改属性"
      :visible.sync="modifyPropertyVisible"
      append-to-body>
      <el-form :rules="rules" :model="modifyProductPropertyInfo" ref="refModifyProperty" label-width="120px">
        <el-form-item label="属性名称" prop="propertyName">
          <el-input v-model="modifyProductPropertyInfo.propertyName" size="small"></el-input>
        </el-form-item>
        <el-form-item label="英文名称" prop="propertyKey">
          <el-input v-model="modifyProductPropertyInfo.propertyKey" size="small"></el-input>
        </el-form-item>
        <el-form-item label="输入或展示" prop="showOrInput">
          <el-select v-model="modifyProductPropertyInfo.showOrInput" style="width: 100%;" @change="resetProperty()">
            <el-option value="" label="请选择输入或展示"></el-option>
            <el-option value="1" label="输入"></el-option>
            <el-option value="0" label="展示"></el-option>
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
            <el-option value="text" label="短文本"></el-option>
            <el-option value="textarea" label="长文本"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板类型" prop="templateType" v-if="modifyProductPropertyInfo.showOrInput==='0'">
          <el-select v-model="modifyProductPropertyInfo.templateType" style="width: 100%;"  @change="changeResetModifyProperty()">
            <el-option value="" label="请选择模板类型"></el-option>
            <el-option value="text" label="短文本"></el-option>
            <el-option value="radio" label="单选"></el-option>
            <el-option value="checkbox" label="多选"></el-option>
            <el-option value="textarea" label="长文本"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="属性值" prop="propertyValue" v-if="modifyProductPropertyInfo.showOrInput==='0'&&modifyProductPropertyInfo.templateType==='text'">
          <el-input v-model="modifyProductPropertyInfo.propertyValue" size="small"></el-input>
        </el-form-item>
        <el-form-item label="属性值" prop="propertyValue" v-if="modifyProductPropertyInfo.showOrInput==='0'&&modifyProductPropertyInfo.templateType==='textarea'">
          <el-input type="textarea" v-model="modifyProductPropertyInfo.propertyValue" size="small"></el-input>
        </el-form-item>
         <el-form-item label="属性排序" prop="sort">
          <el-input  v-model="modifyProductPropertyInfo.sort" size="small" placeholder="该属性在该产品所有属性的展示顺序"></el-input>
        </el-form-item>
        <el-form-item label="属性备注" prop="mark">
          <el-input type="textarea" v-model="modifyProductPropertyInfo.mark" size="small"></el-input>
        </el-form-item>
        <!-- 新增属性值 -->
        <el-form-item label="属性值" v-if="modifyProductPropertyInfo.templateType==='radio'||modifyProductPropertyInfo.templateType==='checkbox'||modifyProductPropertyInfo.templateType==='select'">
          <el-button type="success" @click="addModifyDomain()" v-if="modifyProductPropertyInfo.templateType==='radio'||modifyProductPropertyInfo.templateType==='checkbox'||modifyProductPropertyInfo.templateType==='select'">新增</el-button>
         </el-form-item>
        <el-form-item
          v-for="(domain, index) in modifyProductPropertyInfo.domains"
          :label="'属性值'+(index+1)"
          :key="domain.key"
          :prop="'domains.' + index + '.value'"
          :rules="[
          {required: true, message: '不能为空', trigger: 'blur' },
          { min: 0, max: 50, message: '超过长度', trigger: 'blur' }
          ]" v-if="modifyProductPropertyInfo.templateType==='radio'||modifyProductPropertyInfo.templateType==='checkbox'||modifyProductPropertyInfo.templateType==='select'">
          <el-input v-model="domain.value" style="width: 70%;"></el-input><el-button @click="removeModifyDomain(domain)" style="width: 20%;margin-left: 10px;">删除</el-button>
        </el-form-item>
      </el-form>
        <div slot="footer" style="text-align: right;">
          <el-button size="small" type="danger" @click="resetModifyProductPropertyInfo();">重 置</el-button>
          <el-button size="small" @click="modifyPropertyVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="modifyProductProperty('refModifyProperty');">确 定</el-button>
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
          <el-button type="primary" @click="batchDelVisible = false;deleteTemplateInfos(batchDelIds);">确 定</el-button>
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
        <el-button type="primary" @click="delVisible = false;deleteTemplateInfo(templateId);">确 定</el-button>
      </div>
    </el-dialog>
        <!-- 修改 -->
      <el-dialog
      width="30%"
      title="修改"
      :visible.sync="modifyDialogVisible"
      append-to-body>
      <span style="font-size:20px;">确定修改吗？</span>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button @click="modifyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyDialogVisible = false;updateTemplateInfo();">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { queryTemplateList, queryTemplateInfo, deleteTemplateInfos, deleteTemplateInfo, queryProductTypes, createTemplateInfo, updateTemplateInfo } from '@/api/product_management'
export default {
  name: 'productManagement',
  data() {
    var validNum = (eule, value, callback) => {
      if (value < 1) {
        return callback(new Error('输入值不能小于1'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        productName: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        price: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { pattern: /^\d+(?=\.{0,1}\d+$|$)/, message: '请输入数字' }
        ],
        productTypeId: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        propertyName: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5]+$/, message: '属性名称必须为中文', trigger: 'blur' }
        ],
        propertyKey: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { pattern: /^[A-Za-z]+$/, message: '请输入字母' }
        ],
        isRequired: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        propertyLength: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { pattern: /^[0-9]*$/, message: '请输入数字' },
          { validator: validNum, trigger: 'blur' }
        ],
        propertyType: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        showOrInput: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        sort: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { pattern: /^[0-9]*$/, message: '请输入数字' }
        ],
        templateType: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        propertyValue: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 0, max: 50, message: '超过长度', trigger: 'blur' }
        ]
      },
      modifyDialogVisible: false,
      modifyVisible: false,
      modifyPropertyVisible: false,
      propertyVisible: false,
      addVisible: false,
      delVisible: false,
      batchDelVisible: false,
      pageShow: true,
      req: {
        templateId: '',
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
      templateId: '',
      ProductType: {},
      addProduct: {
        productName: '',
        price: '',
        productTypeId: '',
        description: '',
        propertyInfos: []
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
    this.queryTemplateList()
  },
  methods: {
    queryTemplateList() {
      this.req.modifyTimeStart = ''
      this.req.modifyTimeEnd = ''
      if (this.timeValue && this.timeValue.length > 0) {
        this.req.modifyTimeStart = this.timeValue[0]
        this.req.modifyTimeEnd = this.timeValue[1]
      }
      queryTemplateList(this.req).then(response => {
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
    queryTemplateInfo() {
      queryProductTypes().then(response => {
        if (response.data.code === 0) {
          this.ProductType = response.data.data
          queryTemplateInfo(this.templateId).then(response => {
            if (response.data.code === 0) {
              this.addProduct = response.data.data
              this.addProduct.productTypeId = response.data.data.productTypeInfo.productTypeId
              if (this.addProduct.propertyInfos) {
                for (let index = 0; index < this.addProduct.propertyInfos.length; index++) {
                  if (this.addProduct.propertyInfos[index].propertyValue && (this.addProduct.propertyInfos[index].templateType === 'radio' || this.addProduct.propertyInfos[index].templateType === 'checkbox')) {
                    this.addProduct.propertyInfos[index].propertyValue = JSON.parse(this.addProduct.propertyInfos[index].propertyValue)
                  }
                }
              } else {
                this.addProduct.propertyInfos = []
              }
              this.modifyVisible = true
            } else {
              this.$message.error(response.data.message)
            }
          })
        } else {
          this.$message.error(response.data.message)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    createTemplateInfo(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.addProduct.propertyInfos) {
            for (let index = 0; index < this.addProduct.propertyInfos.length; index++) {
              if (this.addProduct.propertyInfos[index].propertyType instanceof Array) {
                this.addProduct.propertyInfos[index].propertyType = ''
              }
              if (this.addProduct.propertyInfos[index].propertyValue instanceof Array) {
                this.addProduct.propertyInfos[index].propertyValue = JSON.stringify(this.addProduct.propertyInfos[index].propertyValue)
              }
            }
          }
          console.log('this.addProduct', this.addProduct)
          createTemplateInfo(this.addProduct).then(response => {
            if (response.data.code === 0) {
              this.$message.success(response.data.message)
              this.queryTemplateList()
              this.addVisible = false
            } else {
              this.$message.error(response.data.message)
            }
          }).catch(error => {
            console.log(error)
          })
        } else {
          this.$message.error('请检查是否填写正确')
        }
      })
    },
    modifyDialog(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.modifyDialogVisible = true
        } else {
          this.$message.error('请检查是否填写正确')
        }
      })
    },
    updateTemplateInfo() {
      if (this.addProduct.propertyInfos) {
        for (let index = 0; index < this.addProduct.propertyInfos.length; index++) {
          if (this.addProduct.propertyInfos[index].propertyType instanceof Array) {
            this.addProduct.propertyInfos[index].propertyType = ''
          }
          if (this.addProduct.propertyInfos[index].propertyValue instanceof Array) {
            this.addProduct.propertyInfos[index].propertyValue = JSON.stringify(this.addProduct.propertyInfos[index].propertyValue)
          }
        }
      }
      updateTemplateInfo(this.addProduct).then(response => {
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
          this.queryTemplateList()
          this.modifyVisible = false
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
    deleteTemplateInfos() {
      if (this.batchDelIds.length === 0) {
        this.$message.error('请选择需要删除的内容')
      } else {
        deleteTemplateInfos(this.batchDelIds).then(response => {
          if (response.data.code === 0) {
            this.$message.success(response.data.message)
            this.req.pageNo = 1
            this.queryTemplateList()
          } else {
            this.$message.error(response.data.message)
          }
        }).catch(error => {
          console.log(error)
        })
      }
    },
    deleteTemplateInfo() {
      deleteTemplateInfo(this.templateId).then(response => {
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
          this.req.pageNo = 1
          this.queryTemplateList()
        } else {
          this.$message.error(response.data.message)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    resetForm(formName) {
      this.addProduct = {
        productName: '',
        price: '',
        productTypeId: '',
        description: '',
        propertyInfos: []
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
    addProductPropertyInfo(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.productPropertyInfo.templateType === 'checkbox' || this.productPropertyInfo.templateType === 'radio') {
            this.productPropertyInfo.propertyValue = []
            this.productPropertyInfo.domains.forEach(element => {
              this.productPropertyInfo.propertyValue.push(element.value)
            })
            if (this.productPropertyInfo.propertyValue.length < 2) {
              this.$message.error('值的个数不能小于2')
              return
            }
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
          this.addProduct.propertyInfos.push(obj)
          this.propertyVisible = false
        } else {
          this.$message.error('请检查是否填写正确')
        }
      })
    },
    resetAddProduct() {
      this.addProduct = {
        productName: '',
        price: '',
        productTypeId: '',
        description: '',
        propertyInfos: []
      }
    },
    resetReq() {
      this.req = {
        templateId: '',
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
        this.batchDelIds.push(val[i].templateId)
      }
    },
    // 页面显示条数
    handleSizeChange(val) {
      this.req.pageNo = 1
      this.req.pageSize = val
      this.queryTemplateList(this.req)
    },
    // 分页翻页功能
    handleCurrentChange(val) {
      this.req.pageNo = val
      this.queryTemplateList(this.req)
    },
    removeDomain(item) {
      var index = this.productPropertyInfo.domains.indexOf(item)
      if (index !== -1) {
        this.productPropertyInfo.domains.splice(index, 1)
      }
    },
    removeItem(item) {
      var index = this.addProduct.propertyInfos.indexOf(item)
      if (index !== -1) {
        this.addProduct.propertyInfos.splice(index, 1)
      }
    },
    modifyItem(item) {
      this.modifyProductPropertyInfo = JSON.parse(JSON.stringify(item))
      if (this.modifyProductPropertyInfo.templateType === 'radio' || this.modifyProductPropertyInfo.templateType === 'checkbox' || this.modifyProductPropertyInfo.templateType === 'select') {
        this.modifyProductPropertyInfo.domains = []
        this.modifyProductPropertyInfo.propertyValue.forEach(element => {
          this.modifyProductPropertyInfo.domains.push({
            value: element
          })
        })
      }
      this.modifyId = this.addProduct.propertyInfos.indexOf(item)
    },
    addDomain() {
      this.productPropertyInfo.domains.push({
        value: '',
        key: Date.now()
      })
    },
    addModifyDomain() {
      this.modifyProductPropertyInfo.domains.push({
        value: '',
        key: Date.now()
      })
      var obj = JSON.parse(JSON.stringify(this.modifyProductPropertyInfo))
      this.modifyProductPropertyInfo = {}
      this.modifyProductPropertyInfo = JSON.parse(JSON.stringify(obj))
    },
    removeModifyDomain(item) {
      var index = this.modifyProductPropertyInfo.domains.indexOf(item)
      if (index !== -1) {
        this.modifyProductPropertyInfo.domains.splice(index, 1)
      }

      var obj = JSON.parse(JSON.stringify(this.modifyProductPropertyInfo))
      this.modifyProductPropertyInfo = {}
      this.modifyProductPropertyInfo = JSON.parse(JSON.stringify(obj))
    },
    modifyProductProperty(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.modifyProductPropertyInfo.templateType === 'checkbox' || this.modifyProductPropertyInfo.templateType === 'radio') {
            this.modifyProductPropertyInfo.propertyValue = []
            this.modifyProductPropertyInfo.domains.forEach(element => {
              this.modifyProductPropertyInfo.propertyValue.push(element.value)
            })
            if (this.modifyProductPropertyInfo.propertyValue.length < 2) {
              this.$message.error('值的个数不能小于2')
              return
            }
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
          this.addProduct.propertyInfos.splice(this.modifyId, 1, obj)
          this.modifyId = ''
          this.modifyPropertyVisible = false
        } else {
          this.$message.error('请检查是否填写正确')
        }
      })
    },
    changeResetModifyProperty() {
      this.modifyProductPropertyInfo.propertyValue = ''
      this.modifyProductPropertyInfo.domains = []
      this.modifyProductPropertyInfo.domains.push({
        value: '',
        key: Date.now()
      })
    },
    changeResetProductProperty() {
      this.productPropertyInfo.propertyValue = ''
      this.productPropertyInfo.domains = []
      this.productPropertyInfo.domains.push({
        value: '',
        key: Date.now()
      })
    },
    resetModifyProductPropertyInfo() {
      this.modifyProductPropertyInfo = ''
      var obj = this.addProduct.propertyInfos[this.modifyId]
      this.modifyProductPropertyInfo = JSON.parse(JSON.stringify(obj))
      if (this.modifyProductPropertyInfo.templateType === 'radio' || this.modifyProductPropertyInfo.templateType === 'checkbox' || this.modifyProductPropertyInfo.templateType === 'select') {
        this.modifyProductPropertyInfo.domains = []
        this.modifyProductPropertyInfo.propertyValue.forEach(element => {
          this.modifyProductPropertyInfo.domains.push({
            value: element,
            key: Date.now() + '' + Math.random()
          })
        })
      }
    }
  }
}
</script>
