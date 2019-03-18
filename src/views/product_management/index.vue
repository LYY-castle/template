<template>
  <div class="container" >
    <el-collapse v-model="formContainerOpen" class="form-container" @change="handleChangeAcitve">
      <el-collapse-item title="筛选条件" name="1">
        <el-form :inline="true" size="small" :model="req" ref="searchForm">
          <el-form-item prop="productId" label="产品编号：">
            <el-input v-model="req.productId" placeholder="产品编号（限长20字符）" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item prop="productName" label="产品名称：">
            <el-input v-model="req.productName" placeholder="产品名称（限长50字符）" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item prop="priceStart" label="产品价格：">
            <el-input v-model="req.priceStart" placeholder="产品价格（限长11字符）" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item prop="priceEnd" label="至">
            <el-input v-model="req.priceEnd" placeholder="产品价格（限长11字符）" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item prop="modifierName" label="操作人：">
            <el-input v-model="req.modifierName" placeholder="操作人（限长50字符）" maxlength="50"></el-input>
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
          <el-form-item prop="modifierName" label="产品状态：">
            <el-radio-group v-model="req.status" size="small">
              <el-radio label='0'>上架</el-radio>
              <el-radio label='1'>下架</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" @click="req.pageNo=1;queryTemplateList(req)">查询</el-button>
            <el-button size="small" @click="timeValue=[],resetReq();">重置</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
     <!-- 表格 -->
    <el-row class="table-container">
      <el-row class="margin-bottom-20">
        <div class="font14 bold">产品管理表</div>
      </el-row>
      <el-row class="margin-bottom-20">
        <el-button type="success" size="small" @click="addVisible=true;resetAddProduct();">新建</el-button>
        <el-button type="danger" size="small" @click="batchDelVisible=true">批量删除</el-button>
      </el-row>
      <el-row>
        <el-table
          :data="tableData"
          @selection-change="handleSelectionChange">
          <el-table-column
            align="center"
            type="selection"
            width="50">
          </el-table-column>
          <el-table-column
            width="140"
            align="center"
            label="编号"
            prop="productId">
          </el-table-column> 
          <el-table-column
            align="center"
            label="名称"
            prop="productName"
            :show-overflow-tooltip="true">
          </el-table-column> 
          <el-table-column
            width="80"
            align="center"
            label="类型"
            prop="productTypeInfo.productTypeName">
            <template slot-scope="scope">
              {{scope.row.productType==='0'?'实体产品':scope.row.productType==='1'?'虚拟产品':''}}
            </template>
          </el-table-column>
          <el-table-column
            width="50"
            align="center"
            label="用途"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{scope.row.productPurpose===0?'销售':scope.row.productPurpose===1?'促销':''}}
            </template>
          </el-table-column> 
          <el-table-column
            width="50"
            align="center"
            label="状态"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{scope.row.status==='0'?'上架':scope.row.status==='1'?'下架':''}}
            </template>
          </el-table-column> 
          <el-table-column
            align="center"
            label="数量"
            prop="productNum"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            align="center"
            label="价格"
            prop="price">
            <template slot-scope="scope">
              {{scope.row.price +" 元"}}
            </template>
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
            width="130"
            :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-button @click="modifyVisible=true;productId=scope.row.productId;queryTemplateInfo();" type="text" size="small">修改</el-button>
            <el-button @click="delVisible=true;productId=scope.row.productId" type="text" size="small">删除</el-button>
            <el-button @click="modifyProductsStatus(scope.row)" type="text" size="small" v-if="scope.row.status==='1'">上架</el-button>
            <el-button @click="modifyProductsStatus(scope.row)" type="text" size="small" v-if="scope.row.status==='0'">下架</el-button>
          </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row style="margin-top:20px;">
        <el-pagination
          v-if="pageShow"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page='pageInfo.pageNo'
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size='pageInfo.pageSize'
          layout="total, sizes, prev, pager, next, jumper "
          :total='pageInfo.totalCount' style="text-align: right;float:right;">
        </el-pagination>
      </el-row>
    </el-row>
    <!-- 新建产品 -->
    <el-dialog
      align:left
      width="86%"
      title="新建产品"
      :visible.sync="addVisible"
      append-to-body>
      <el-form size="small" :rules="rules" :model="addProduct" ref="refAddProduct" label-width="100px">
        <el-form-item label="产品名称" prop="productName">
          <el-input v-model="addProduct.productName" size="small" placeholder="限长50字符" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="产品价格" prop="price">
          <el-input v-model="addProduct.price" size="small" placeholder="价格保留小数点后两位（限长11字符）" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="产品数量" prop="productNum">
          <el-input v-model="addProduct.productNum" size="small" placeholder="限长11字符" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="产品类型" prop="productType">
          <!-- <el-select v-model="addProduct.productTypeId" style="width: 100%;">
            <el-option key="" label="请选择类型" value=""></el-option>
            <el-option
                v-for="item in ProductType"
                :key="item.productTypeId"
                :label="item.productTypeName"
                :value="item.productTypeId">
            </el-option>
          </el-select> -->
          <el-radio-group v-model="addProduct.productType" size="small">
            <el-radio label='0'>实体产品</el-radio>
            <el-radio label='1'>虚拟产品</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="产品用途" prop="productPurpose">
          <el-radio-group v-model="addProduct.productPurpose" size="small">
            <el-radio :label='0'>销售</el-radio>
            <el-radio :label='1'>促销</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="产品状态" prop="status">
          <el-radio-group v-model="addProduct.status" size="small">
            <el-radio label='0'>上架</el-radio>
            <el-radio label='1'>下架</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="产品备注" prop="description">
          <el-input type="textarea" v-model="addProduct.description" size="small"  placeholder="限长100字符" maxlength="100" :rows="4"></el-input>
        </el-form-item>
        <!-- 新增属性 -->
        <!-- <el-form-item label="属性">
          <el-button type="success" @click="resetProductPropertyInfo();propertyVisible=true">新增</el-button>
        </el-form-item> -->

        <!-- <el-form-item
          v-for="item in addProduct.propertyInfos"
          :label="item.propertyName"
          :key="item.key"
          :rules="[{required: item.isRequired==='1' ,trigger: 'change' }]">
          <el-input v-model="item.propertyValue" v-if="item.templateType==='text'" 
          :readonly="item.showOrInput==='0'" style="width: 80%;">
           </el-input> -->

           <!-- <el-button @click.prevent="modifyPropertyVisible=true;modifyItem(item)" v-if="item.templateType==='text'" style="width: 15%;margin-left: 10px;">修改</el-button>
           <el-button @click.prevent="removeItem(item)" v-if="item.templateType==='text'" style="width: 15%;">删除</el-button> -->
          
          <!-- <el-input type="textarea" v-model="item.propertyValue" v-if="item.templateType==='textarea'" :readonly="item.showOrInput==='0'"  style="width: 60%;"></el-input> -->
          
          <!-- <el-button @click.prevent="modifyPropertyVisible=true;modifyItem(item)" v-if="item.templateType==='textarea'" style="width: 15%;margin-left: 10px;">修改</el-button>
          <el-button @click.prevent="removeItem(item)" v-if="item.templateType==='textarea'" style="width: 15%;">删除</el-button> -->
          
          <!-- <el-radio-group v-model="item.propertyType" :readonly="item.showOrInput==='0'" 
            style="width: 80%;" 
            v-if="item.templateType==='radio'">
            <el-radio
                v-for="tag in item.propertyValue"
                :label="tag"
                :value="tag"
                style="width:100%;margin:0.5% 0"
                disabled>
            </el-radio>
          </el-radio-group> -->

          <!-- <el-button  @click.prevent="modifyPropertyVisible=true;modifyItem(item)" v-if="item.templateType==='radio'" style="width: 15%;margin-left: 10px;">修改</el-button>
          <el-button @click.prevent="removeItem(item)" v-if="item.templateType==='radio'" style="width: 15%;">删除</el-button> -->
          
          <!-- <el-select  v-model="item.propertyType"  :readonly="item.showOrInput==='0'"   style="width: 80%;" 
          v-if="item.templateType==='select'" >
            <el-option
                v-for="tag in item.propertyValueSelect"
                :label="tag"
                :value="tag"
                disabled>
            </el-option>
          </el-select> -->
          
          <!-- <el-button @click.prevent="modifyPropertyVisible=true;modifyItem(item)" v-if="item.templateType==='select'"  style="width: 15%;margin-left: 10px;">修改</el-button>
          <el-button @click.prevent="removeItem(item)" v-if="item.templateType==='select'"  style="width: 15%;">删除</el-button> -->
          
          <!-- <el-checkbox-group  v-model="item.propertyType"  style="width: 80%;line-height:1" 
             :readonly="item.showOrInput==='0'"  v-if="item.templateType==='checkbox'" >
            <el-checkbox
                v-for="tag in item.propertyValueCheckbox"
                :label="tag"
                :key="tag"
                :value="tag"
                style="width:100%;margin: 0"
                 disabled>
            </el-checkbox>
          </el-checkbox-group>
          <el-button @click.prevent="modifyPropertyVisible=true;modifyItem(item)" style="margin-left: 10px;">修改</el-button>
          <el-button @click.prevent="removeItem(item)" >删除</el-button>
        </el-form-item> -->
      </el-form>
      <div slot="footer" style="text-align: right;">
        <el-button size="small" @click="resetForm('refAddProduct');">重置</el-button>
        <el-button size="small" type="primary" plain @click="addVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="createTemplateInfo('refAddProduct')">确定</el-button>
      </div>
    </el-dialog>
      <!-- 修改产品 -->
    <el-dialog
      align:left
      width="86%"
      title="修改产品"
      :visible.sync="modifyVisible"
      append-to-body>
      <el-form :rules="rules" :model="addProduct" ref="refUpateProduct" label-width="100px">
        <el-form-item label="产品名称" prop="productName">
          <el-input v-model="addProduct.productName" size="small" placeholder="产品名称（限长50字符）" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="产品价格" prop="price">
          <el-input v-model="addProduct.price" size="small" placeholder="价格保留小数点后两位（限长11字符）" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="产品数量" prop="productNum">
          <el-input v-model="addProduct.productNum" size="small" placeholder="限长11字符" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="产品类型" prop="productType">
          <!-- <el-select v-model="addProduct.productTypeId" style="width: 100%;">
            <el-option key="" label="请选择类型" value=""></el-option>
            <el-option
                v-for="item in ProductType"
                :key="item.productTypeId"
                :label="item.productTypeName"
                :value="item.productTypeId">
            </el-option>
          </el-select> -->
          <el-radio-group v-model="addProduct.productType" size="small">
            <el-radio label='0'>实体产品</el-radio>
            <el-radio label='1'>虚拟产品</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="产品用途" prop="productPurpose">
          <el-radio-group v-model="addProduct.productPurpose" size="small">
            <el-radio :label='0'>销售</el-radio>
            <el-radio :label='1'>促销</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="产品备注" prop="description">
          <el-input type="textarea" v-model="addProduct.description" size="small" placeholder="限长100字符" maxlength="100"></el-input>
        </el-form-item>
        <!-- 新增属性 -->
        <!-- <el-form-item label="属性">
          <el-button type="success" @click="resetProductPropertyInfo();propertyVisible=true">新增</el-button>
        </el-form-item> -->
        <!-- <el-form-item
          v-for="item in addProduct.propertyInfos"
          :label="item.propertyName"
          :key="item.key"
          :rules="[{required: item.isRequired==='1' ,trigger: 'change' }]">
          <el-input v-model="item.propertyValue" v-if="item.templateType==='text'" readonly="true" style="width: 80%;"></el-input> -->
          
          <!-- <el-button @click.prevent="modifyPropertyVisible=true;modifyItem(item)" v-if="item.templateType==='text'" style="width: 20%;margin-left: 10px;">修改</el-button><el-button @click.prevent="removeItem(item)" v-if="item.templateType==='text'" style="width: 20%;">删除</el-button> -->
          
          <!-- <el-input type="textarea" v-model="item.propertyValue" v-if="item.templateType==='textarea'" readonly="true" style="width: 80%;"></el-input> -->
          
          <!-- <el-button @click.prevent="modifyPropertyVisible=true;modifyItem(item)" v-if="item.templateType==='textarea'" style="width: 20%;margin-left: 10px;">修改</el-button><el-button @click.prevent="removeItem(item)" v-if="item.templateType==='textarea'" style="width: 20%;">删除</el-button> -->
          
          <!-- <el-radio-group v-model="item.propertyType" readonly="true" style="width: 80%;display:inline-block;line-height:1;" v-if="item.templateType==='radio'" >
            <el-radio
                v-for="tag in item.propertyValueRadio"
                :label="tag"
                :value="tag"
                style="margin:0;width:100%"
                :disabled="true">
            </el-radio>
          </el-radio-group> -->
          
          <!-- <el-button  @click.prevent="modifyPropertyVisible=true;modifyItem(item)" v-if="item.templateType==='radio'" style="width: 20%;margin-left: 10px;">修改</el-button><el-button @click.prevent="removeItem(item)" v-if="item.templateType==='radio'" style="width: 20%;">删除</el-button> -->
          
          <!-- <el-checkbox-group multiple v-model="item.propertyType" readonly="true"  style="width: 80%;line-height:1;display:inline-block" v-if="item.templateType==='checkbox'" >
            <el-checkbox
                v-for="tag in item.propertyValueCheckbox"
                :label="tag"
                :value="tag"
                style="width:100%;margin:0"
                :disabled="true">
            </el-checkbox>
          </el-checkbox-group>
          <el-select multiple v-model="item.propertyType" readonly="true"  style="width: 80%;" v-if="item.templateType==='select'" >
            <el-option
                v-for="tag in item.propertyValueSelect"
                :label="tag"
                :value="tag"
                :disabled="true">
            </el-option>
          </el-select>
          <el-button @click.prevent="modifyPropertyVisible=true;modifyItem(item)" style="margin-left: 10px;">修改</el-button>
          <el-button @click.prevent="removeItem(item)" >删除</el-button>
        </el-form-item> -->
      </el-form>
        <div slot="footer" style="text-align: right;">
          <el-button size="small" @click="queryTemplateInfo(productId);">重置</el-button>
          <el-button size="small" type="primary" plain @click="modifyVisible = false">取消</el-button>
          <el-button size="small" type="primary" @click="modifyDialog('refUpateProduct')">确定</el-button>
        </div>
    </el-dialog>
    <!-- 新增属性 -->
     <!-- <el-dialog
      align:left
      width="60%"
      title="新增属性"
      :visible.sync="propertyVisible"
      append-to-body>
      <el-form :rules="rules" :model="productPropertyInfo" ref="refProperty" label-width="120px">
        <el-form-item label="属性名称" prop="propertyName">
          <el-input v-model="productPropertyInfo.propertyName" size="small" placeholder="限长50字符" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="英文名称" prop="propertyKey">
          <el-input v-model="productPropertyInfo.propertyKey" size="small" placeholder="限长50字符" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="输入或展示" prop="showOrInput">
          <el-select v-model="productPropertyInfo.showOrInput" style="width: 100%;" @change="resetProperty()">
            <el-option value="" label="请选择输入或展示"></el-option>
            <el-option value="1" label="输入"></el-option>
            <el-option value="0" label="展示"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="属性值长度" prop="propertyLength" v-if="productPropertyInfo.showOrInput==='1'">
          <el-input v-model="productPropertyInfo.propertyLength" size="small" placeholder="长文本限长1023，其他限长50.超出则按最长限制" @change="checkNum(productPropertyInfo.propertyLength)"></el-input>
        </el-form-item> -->

        <!-- <el-form-item label="属性值类型" prop="propertyType" v-if="productPropertyInfo.showOrInput==='1'">
          <el-select v-model="productPropertyInfo.propertyType" style="width: 100%;">
            <el-option value="" label="请选择类型"></el-option>
            <el-option value="1" label="字符串"></el-option>
            <el-option value="2" label="数字"></el-option>
          </el-select>
        </el-form-item> -->

        <!-- <el-form-item label="属性值是否必填" prop="isRequired" v-if="productPropertyInfo.showOrInput==='1'">
          <el-select v-model="productPropertyInfo.isRequired" style="width: 100%;">
            <el-option value="" label="请选择属性值是否必填"></el-option>
            <el-option value="0" label="否"></el-option>
            <el-option value="1" label="是"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板类型" prop="templateType" v-if="productPropertyInfo.showOrInput==='0'">
          <el-select v-model="productPropertyInfo.templateType" style="width: 100%;">
            <el-option value="" label="请选择模板类型"></el-option>
            <el-option value="text" label="短文本"></el-option>
            <el-option value="textarea" label="长文本"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板类型" prop="templateType" v-if="productPropertyInfo.showOrInput==='1'">
          <el-select v-model="productPropertyInfo.templateType" style="width: 100%;"  @change="changeResetProductProperty(productPropertyInfo.templateType)">
            <el-option value="" label="请选择模板类型"></el-option>
            <el-option value="text" label="短文本"></el-option>
            <el-option value="radio" label="单选"></el-option>
            <el-option value="checkbox" label="多选"></el-option>
            <el-option value="select" label="下拉框"></el-option>
            <el-option value="textarea" label="长文本"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="属性值" prop="propertyValue" v-if="productPropertyInfo.showOrInput==='0'&&productPropertyInfo.templateType==='text'">
          <el-input v-model="productPropertyInfo.propertyValue" size="small" placeholder="限长50字符" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="属性值" prop="propertyValue" v-if="productPropertyInfo.showOrInput==='0'&&productPropertyInfo.templateType==='textarea'">
          <el-input type="textarea" v-model="productPropertyInfo.propertyValue" size="small"  placeholder="限长1023字符" maxlength="1023"></el-input>
        </el-form-item> -->

         <!-- <el-form-item label="属性排序" prop="sort">
          <el-input  v-model="productPropertyInfo.sort" size="small" placeholder="该属性在该产品所有属性的展示顺序"></el-input>
        </el-form-item>  -->

        <!-- <el-form-item label="属性备注" prop="mark">
          <el-input type="textarea" v-model="productPropertyInfo.mark" size="small" placeholder="限长100字符" maxlength="100"></el-input>
        </el-form-item> -->

        <!-- 新增属性值 -->
        <!-- <el-form-item label="属性值"  v-if="productPropertyInfo.templateType==='radio'||productPropertyInfo.templateType==='checkbox'||productPropertyInfo.templateType==='select'">
          <el-button type="success" @click="addDomain()" v-if="productPropertyInfo.templateType==='radio'||productPropertyInfo.templateType==='checkbox'||productPropertyInfo.templateType==='select'">新增</el-button>
        </el-form-item>
        <el-form-item
            v-for="(domain, index) in productPropertyInfo.domains"
            :label="'属性值'+(index+1)"
            :key="domain.key"
            :prop="'domains.' + index + '.value'"
            :rules="[
            {required: true, message: '不能为空', trigger: 'blur'},
            { min: 0, message: '超过长度', trigger: 'change' }
            ]" v-if="productPropertyInfo.templateType==='radio'||productPropertyInfo.templateType==='checkbox'||productPropertyInfo.templateType==='select'">
            <el-input v-model="domain.value" style="width: 80%;" v-show="parseInt(productPropertyInfo.propertyLength)<=50" :placeholder="'限长'+productPropertyInfo.propertyLength+'字符'" :maxlength="productPropertyInfo.propertyLength"></el-input>
            <el-input v-model="domain.value" style="width: 80%;" v-show="parseInt(productPropertyInfo.propertyLength)>50||productPropertyInfo.propertyLength===''" placeholder="限长50字符" maxlength="50"></el-input>
            <el-button @click.prevent="removeDomain(domain)" style="margin-left: 10px;">删除</el-button>
        </el-form-item> -->
        
      <!-- </el-form>
        <div slot="footer" style="text-align: right;">
          <el-button size="small" type="danger" @click="resetProductPropertyInfo();">重 置</el-button>
          <el-button size="small" @click="propertyVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="addProductPropertyInfo('refProperty');">确 定</el-button>
        </div>
    </el-dialog> -->
    <!-- 修改产品属性 -->
     <!-- <el-dialog
      align:left
      width="60%"
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
          <el-input v-model="modifyProductPropertyInfo.propertyLength" size="small" placeholder="长文本限长1023，其他限长50.超出则按最长限制" @change="checkModifyNum(modifyProductPropertyInfo.propertyLength)"></el-input>
        </el-form-item> -->

        <!-- <el-form-item label="属性值类型" prop="propertyType" v-if="modifyProductPropertyInfo.showOrInput==='1'">
          <el-select v-model="modifyProductPropertyInfo.propertyType" style="width: 100%;">
            <el-option value="" label="请选择类型"></el-option>
            <el-option value="1" label="字符串"></el-option>
            <el-option value="2" label="数字"></el-option>
          </el-select>
        </el-form-item> -->

        <!-- <el-form-item label="属性值是否必填" prop="isRequired" v-if="modifyProductPropertyInfo.showOrInput==='1'">
          <el-select v-model="modifyProductPropertyInfo.isRequired" style="width: 100%;">
            <el-option value="" label="请选择属性值是否必填"></el-option>
            <el-option value="0" label="否"></el-option>
            <el-option value="1" label="是"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板类型" prop="templateType" v-if="modifyProductPropertyInfo.showOrInput==='0'">
          <el-select v-model="modifyProductPropertyInfo.templateType" style="width: 100%;">
            <el-option value="" label="请选择模板类型"></el-option>
            <el-option value="text" label="短文本"></el-option>
            <el-option value="textarea" label="长文本"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板类型" prop="templateType" v-if="modifyProductPropertyInfo.showOrInput==='1'">
          <el-select v-model="modifyProductPropertyInfo.templateType" style="width: 100%;"  @change="changeResetModifyProperty(modifyProductPropertyInfo.templateType)">
            <el-option value="" label="请选择模板类型"></el-option>
            <el-option value="text" label="短文本"></el-option>
            <el-option value="radio" label="单选"></el-option>
            <el-option value="checkbox" label="多选"></el-option>
            <el-option value="select" label="下拉框"></el-option>
            <el-option value="textarea" label="长文本"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="属性值" prop="propertyValue" v-if="modifyProductPropertyInfo.showOrInput==='0'&&modifyProductPropertyInfo.templateType==='text'">
          <el-input v-model="modifyProductPropertyInfo.propertyValue" size="small" placeholder="限长50字符" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="属性值" prop="propertyValue" v-if="modifyProductPropertyInfo.showOrInput==='0'&&modifyProductPropertyInfo.templateType==='textarea'">
          <el-input type="textarea" v-model="modifyProductPropertyInfo.propertyValue" size="small" placeholder="限长1023字符" maxlength="1023"></el-input>
        </el-form-item> -->

         <!-- <el-form-item label="属性排序" prop="sort">
          <el-input  v-model="modifyProductPropertyInfo.sort" size="small" placeholder="该属性在该产品所有属性的展示顺序"></el-input>
        </el-form-item> -->

        <!-- <el-form-item label="属性备注" prop="mark">
          <el-input type="textarea" v-model="modifyProductPropertyInfo.mark" size="small" placeholder="限长100字符" maxlength="100"></el-input>
        </el-form-item> -->

        <!-- 新增属性值 -->
        <!-- <el-form-item label="属性值" v-if="modifyProductPropertyInfo.templateType==='radio'||modifyProductPropertyInfo.templateType==='checkbox'||modifyProductPropertyInfo.templateType==='select'">
          <el-button type="success" @click="addModifyDomain()" v-if="modifyProductPropertyInfo.templateType==='radio'||modifyProductPropertyInfo.templateType==='checkbox'||modifyProductPropertyInfo.templateType==='select'">新增</el-button>
         </el-form-item>
        <el-form-item
          v-for="(domain, index) in modifyProductPropertyInfo.domains"
          :label="'属性值'+(index+1)"
          :key="domain.key"
          :prop="'domains.' + index + '.value'"
          :rules="[
          {required: true, message: '不能为空', trigger: 'blur' },
          { min: 0, message: '超过长度', trigger: 'change' }
          ]" v-if="modifyProductPropertyInfo.templateType==='radio'||modifyProductPropertyInfo.templateType==='checkbox'||modifyProductPropertyInfo.templateType==='select'">
          <el-input v-model="domain.value" style="width: 70%;" v-show="parseInt(modifyProductPropertyInfo.propertyLength)<=50" :placeholder="'限长'+modifyProductPropertyInfo.propertyLength+'字符'" :maxlength="modifyProductPropertyInfo.propertyLength"></el-input>
          <el-input v-model="domain.value" style="width: 70%;" v-show="parseInt(modifyProductPropertyInfo.propertyLength)>50||modifyProductPropertyInfo.propertyLength===''" placeholder="限长50字符" maxlength="50"></el-input>
          <el-button @click="removeModifyDomain(domain)" style="width: 20%;margin-left: 10px;">删除</el-button>
        </el-form-item>
      </el-form>
        <div slot="footer" style="text-align: right;">
          <el-button size="small" type="danger" @click="resetModifyProductPropertyInfo();">重 置</el-button>
          <el-button size="small" @click="modifyPropertyVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="modifyProductProperty('refModifyProperty');">确 定</el-button>
        </div>
    </el-dialog> -->
    <!-- 批量删除 -->
    <el-dialog
      width="30%"
      title="批量删除"
      :visible.sync="batchDelVisible"
      append-to-body>
      <span style="font-size:20px;">确定删除选定内容？</span>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button type="primary" plain @click="batchDelVisible = false">取消</el-button>
        <el-button type="primary" @click="batchDelVisible = false;deleteTemplateInfos(batchDelIds);">确定</el-button>
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
        <el-button type="primary" plain @click="delVisible = false">取消</el-button>
        <el-button type="primary" @click="delVisible = false;deleteTemplateInfo(productId);">确定</el-button>
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
        <el-button type="primary" plain @click="modifyDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="modifyDialogVisible = false;updateTemplateInfo();">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { modifyProductsStatus, queryTemplateList, queryTemplateInfo, deleteTemplateInfos, deleteTemplateInfo, queryProductTypes, createTemplateInfo, updateTemplateInfo } from '@/api/product_management'
export default {
  name: 'product_management',
  data() {
    var validNum = (eule, value, callback) => {
      if (value < 1) {
        return callback(new Error('输入值不能小于1'))
      } else if (value > 1023) {
        return callback(new Error('输入值不能大于1023'))
      } else {
        callback()
      }
    }
    return {
      visibleClass: '',
      formContainerOpen: '1',
      formContainer: this.$store.state.app.formContainer,
      rules: {
        productName: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        productNum: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { pattern: /^[1-9]\d*$/, message: '请输正整数', trigger: 'change' }
        ],
        productPurpose: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { pattern: /^\d+(?=\.{0,1}\d+$|$)/, message: '请输入数字', trigger: 'change' }
        ],
        productType: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        propertyName: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        propertyKey: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { pattern: /^[A-Za-z]+$/, message: '请输入字母', trigger: 'change' }
        ],
        isRequired: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        propertyLength: [
          { required: true, message: '不能为空', trigger: 'change' },
          { pattern: /^[0-9]*$/, message: '请输入数字', trigger: 'change' },
          { validator: validNum, trigger: 'change' }
        ],
        propertyType: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        showOrInput: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { pattern: /^[0-9]*$/, message: '请输入数字', trigger: 'change' }
        ],
        templateType: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        propertyValue: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 0, message: '超出长度', trigger: 'change' }
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
        productId: '',
        productName: '',
        modifierName: '',
        modifyTimeStart: '',
        modifyTimeEnd: '',
        status: '0',
        pageNo: 1,
        pageSize: 10
      },
      timeValue: [],
      batchDelIds: [],
      tableData: [],
      pageInfo: {},
      productId: '',
      ProductType: {},
      addProduct: {
        status: '0',
        productPurpose: 0,
        productNum: '',
        productName: '',
        price: '',
        productType: '0'
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
    this.formContainer()
    this.handleChangeAcitve()
    this.queryTemplateList()
  },
  methods: {
    handleChangeAcitve(active = ['1']) {
      if (active.length) {
        $('.form-more').text('收起')
      } else {
        $('.form-more').text('更多')
      }
    },
    // 上下架
    modifyProductsStatus(row) {
      const req = {
        productIds: [row.productId],
        status: ''
      }
      if (row.status === '0') {
        req.status = '1'
      } else {
        req.status = '0'
      }
      modifyProductsStatus(req).then(response => {
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
          this.queryTemplateList()
        } else {
          this.$message.error(response.data.message)
        }
      }).catch(error => {
        throw new Error(error)
      })
    },
    checkNum(val) { // 属性值长度确定
      if (this.productPropertyInfo.templateType === 'textarea') {
        if (val > 1023) {
          this.productPropertyInfo.propertyLength = 1023
        }
      } else {
        if (val > 50) {
          this.productPropertyInfo.propertyLength = 50
        }
      }
    },
    checkModifyNum(val) {
      if (this.modifyProductPropertyInfo.templateType === 'textarea') {
        if (val > 1023) {
          this.modifyProductPropertyInfo.propertyLength = 1023
        }
      } else {
        if (val > 50) {
          this.modifyProductPropertyInfo.propertyLength = 50
        }
      }
    },
    queryTemplateList() {
      this.req.modifyTimeStart = this.timeValue ? this.timeValue[0] : null
      this.req.modifyTimeEnd = this.timeValue ? this.timeValue[1] : null
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
          this.$message({
            message: response.data.message,
            type: 'error'
          })
          this.tableData = response.data.data
          this.pageShow = false
        }
      }).catch(error => {
        throw new Error(error)
      })
    },
    queryTemplateInfo() {
      queryTemplateInfo(this.productId).then(response => {
        if (response.data.code === 0) {
          this.addProduct = response.data.data
        } else {
          this.$message.error(response.data.message)
        }
      })
    },
    // queryTemplateInfo() {
    //   queryProductTypes().then(response => {
    //     if (response.data.code === 0) {
    //       this.ProductType = response.data.data
    //       queryTemplateInfo(this.productId).then(response => {
    //         if (response.data.code === 0) {
    //           this.addProduct = response.data.data
    //           this.addProduct.productTypeId = response.data.data.productTypeInfo.productTypeId
    //           if (this.addProduct.propertyInfos) {
    //             for (let index = 0; index < this.addProduct.propertyInfos.length; index++) {
    //               if (this.addProduct.propertyInfos[index].propertyValue && (this.addProduct.propertyInfos[index].templateType === 'radio' || this.addProduct.propertyInfos[index].templateType === 'checkbox' || this.addProduct.propertyInfos[index].templateType === 'select')) {
    //                 this.addProduct.propertyInfos[index].propertyValue = JSON.parse(this.addProduct.propertyInfos[index].propertyValue)
    //                 switch (this.addProduct.propertyInfos[index].templateType) {
    //                   case 'select':
    //                     this.addProduct.propertyInfos[index].propertyValueSelect = this.addProduct.propertyInfos[index].propertyValue
    //                     break
    //                   case 'checkbox':
    //                     this.addProduct.propertyInfos[index].propertyValueCheckbox = this.addProduct.propertyInfos[index].propertyValue
    //                     break
    //                   case 'radio':
    //                     this.addProduct.propertyInfos[index].propertyValueRadio = this.addProduct.propertyInfos[index].propertyValue
    //                     break
    //                 }
    //               }
    //             }
    //           } else {
    //             this.addProduct.propertyInfos = []
    //           }
    //           this.modifyVisible = true
    //         } else {
    //           this.$message.error(response.data.message)
    //         }
    //       }).catch(error => {
    //         throw new Error(error)
    //       })
    //     } else {
    //       this.$message.error(response.data.message)
    //     }
    //   }).catch(error => {
    //     throw new Error(error)
    //   })
    // },
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
            throw new Error(error)
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
        throw new Error(error)
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
        throw new Error(error)
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
          throw new Error(error)
        })
      }
    },
    deleteTemplateInfo() {
      deleteTemplateInfo(this.productId).then(response => {
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
          this.req.pageNo = 1
          this.queryTemplateList()
        } else {
          this.$message.error(response.data.message)
        }
      }).catch(error => {
        throw new Error(error)
      })
    },
    resetForm(formName) {
      this.addProduct = {
        status: '0',
        productPurpose: 0,
        productNum: '',
        productName: '',
        price: '',
        productType: '0'
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
          if (this.productPropertyInfo.templateType === 'checkbox' || this.productPropertyInfo.templateType === 'radio' || this.productPropertyInfo.templateType === 'select') {
            this.productPropertyInfo.propertyValue = []
            this.productPropertyInfo.propertyValueRadio = []
            this.productPropertyInfo.propertyValueCheckbox = []
            this.productPropertyInfo.propertyValueSelect = []
            this.productPropertyInfo.domains.forEach(element => {
              this.productPropertyInfo.propertyValue.push(element.value)
              switch (this.productPropertyInfo.templateType) {
                case 'radio':
                  this.productPropertyInfo.propertyValueRadio.push(element.value)
                  break
                case 'checkbox':
                  this.productPropertyInfo.propertyValueCheckbox.push(element.value)
                  break
                case 'select':
                  this.productPropertyInfo.propertyValueSelect.push(element.value)
                  break
              }
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
            propertyValueRadio: this.productPropertyInfo.propertyValueRadio, // 属性value
            propertyValueCheckbox: this.productPropertyInfo.propertyValueCheckbox, // 属性value
            propertyValueSelect: this.productPropertyInfo.propertyValueSelect, // 属性value
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
        status: '0',
        productPurpose: 0,
        productNum: '',
        productName: '',
        price: '',
        productType: '0'
      }
    },
    resetReq() {
      this.req = {
        productId: '',
        productName: '',
        modifierName: '',
        modifyTimeStart: '',
        modifyTimeEnd: '',
        status: '0',
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
      this.productPropertyInfo.propertyValueRadio = ''// 属性value
      this.productPropertyInfo.propertyValueCheckbox = ''// 属性value
      this.productPropertyInfo.propertyValueSelect = ''// 属性value
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
          if (this.modifyProductPropertyInfo.templateType === 'checkbox' || this.modifyProductPropertyInfo.templateType === 'radio' ||
          this.modifyProductPropertyInfo.templateType === 'select') {
            this.modifyProductPropertyInfo.propertyValue = []
            this.modifyProductPropertyInfo.propertyValueSelect = []
            this.modifyProductPropertyInfo.propertyValueCheckbox = []
            this.modifyProductPropertyInfo.propertyValueRadio = []
            this.modifyProductPropertyInfo.domains.forEach(element => {
              this.modifyProductPropertyInfo.propertyValue.push(element.value)
              switch (this.modifyProductPropertyInfo.templateType) {
                case 'checkbox':
                  this.modifyProductPropertyInfo.propertyValueCheckbox.push(element.value)
                  break
                case 'radio':
                  this.modifyProductPropertyInfo.propertyValueRadio.push(element.value)
                  break
                case 'select':
                  this.modifyProductPropertyInfo.propertyValueSelect.push(element.value)
                  break
              }
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
            propertyValueRadio: this.modifyProductPropertyInfo.propertyValueRadio, // 属性value
            propertyValueCheckbox: this.modifyProductPropertyInfo.propertyValueCheckbox, // 属性value
            propertyValueSelect: this.modifyProductPropertyInfo.propertyValueSelect, // 属性value
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
    changeResetModifyProperty(val) {
      if (val === 'textarea') {
        if (this.modifyProductPropertyInfo.propertyLength > 1023) {
          this.modifyProductPropertyInfo.propertyLength = 1023
        }
      } else {
        if (this.modifyProductPropertyInfo.propertyLength > 50) {
          this.modifyProductPropertyInfo.propertyLength = 50
        }
      }
      this.modifyProductPropertyInfo.propertyValue = ''
      this.modifyProductPropertyInfo.propertyValueRadio = []
      this.modifyProductPropertyInfo.propertyValueCheckbox = []
      this.modifyProductPropertyInfo.propertyValueSelect = []
      this.modifyProductPropertyInfo.domains = []
      this.modifyProductPropertyInfo.domains.push({
        value: '',
        key: Date.now()
      })
    },
    changeResetProductProperty(val) {
      if (val === 'textarea') {
        if (this.productPropertyInfo.propertyLength > 1023) {
          this.productPropertyInfo.propertyLength = 1023
        }
      } else {
        if (this.productPropertyInfo.propertyLength > 50) {
          this.productPropertyInfo.propertyLength = 50
        }
      }
      this.productPropertyInfo.propertyValue = ''
      this.productPropertyInfo.propertyValueRadio = []
      this.productPropertyInfo.propertyValueCheckbox = []
      this.productPropertyInfo.propertyValueSelect = []
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
