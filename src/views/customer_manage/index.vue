<template>
  <div class="container">
    <el-collapse v-model="formContainerOpen" class="form-container" @change="handleChangeAcitve" style="position:relative;">
      <span class="form-more bold" style="line-height: 24px;font-size: 14px;float:right;margin-right:6px;color:#57AFFF;position:absolute;top:11px;right:41px;">收起</span>
      <el-collapse-item title="筛选条件" name="1">
        <el-form :inline="true" size="small">
          <el-form-item label="批次编号:">
            <el-input v-model="req.batchId" placeholder="批次编号（限长50字符）" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="客户编号:">
            <el-input v-model="req.customerId" placeholder="客户编号（限长50字符）" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="客户姓名:">
            <el-input v-model="req.customerName" placeholder="客户姓名（限长50字符）" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="身份证:">
            <el-input v-model="req.idNo" placeholder="身份证（限长50字符）" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="操作人:">
            <el-input v-model="req.modifierName" placeholder="操作人（限长50）字符" maxlength="50"></el-input>
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
            <el-button type="primary" @click="req.pageNo=1;searchCustomer(req);req2=clone(req);">查询</el-button>
            <el-button @click="reset();req2=clone(req)">重置</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <el-row class="table-container">
      <el-row class="margin-bottom-20">
        <div class="font14 bold">客户管理表</div>
      </el-row>
      <el-row class="margin-bottom-20">
        <el-button type="success" size="small" @click="resetArrays();addVisible=true;clearForm(customerDetail,'customerDetail');">新建</el-button>
        <el-button type="danger" size="small" @click="batchDelVisible=true">批量删除</el-button>
        <el-button type="info" size="small" @click="importVisible=true;importInfo.uploadFileName='';importInfo.batchName='';importInfo.source=''">导入客户</el-button>
      </el-row>
      <el-row>
        <el-table
          :data="tableData"
          highlight-current-row
          @selection-change="handleSelectionChange">
          <el-table-column
            align="center"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            align="center"
            label="批次编号"
            prop="batchId">
          </el-table-column>
            <el-table-column
            align="center"
            prop="customerId"
            label="客户编号">
          </el-table-column>
          <el-table-column
            align="center"
            label="客户姓名"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <a @click="customerReverseDetail.customerAddresses=[];customerReverseDetail.customerLinks=[];customerReverseDetail.customerCars=[];searchByCustomerId(scope.row,1);">{{scope.row.customerName}}</a>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="性别"
            width="55">
            <template
              slot-scope="scope">
              <div>{{showSex(scope.row.customerSex)}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="出生日期"
            prop="birthday">
          </el-table-column>
          <el-table-column
            align="center"
            label="身份证"
            :show-overflow-tooltip="true">
            <template
              slot-scope="scope">
              {{hideIdNumber(scope.row.idNo)}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="客户评分"
            prop="score">
          </el-table-column>
          <el-table-column
            align="center"
            prop="modifierName"
            label="操作人"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.modifierName }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="155"
            label="操作时间">
            <template slot-scope="scope">
              {{formatDateTime(scope.row.modifierTime)}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="100">
          <template slot-scope="scope">
            <el-button @click="searchByCustomerId(scope.row,2);" type="text" size="small">修改</el-button>
            <el-button @click="delVisible=true;delReq.customerId=scope.row.customerId" type="text" size="small">删除</el-button>
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
    <el-dialog
      align:left
      width="40%"
      title="导入客户"
      :visible.sync="importVisible"
      append-to-body>
      <el-form size="small" label-width="100px" :model="importInfo" :rules="rule" ref="importInfo">
        <el-form-item label="批次名称：" class="inputWidth" prop="batchName">
          <el-input size="small" v-model="importInfo.batchName"></el-input>
        </el-form-item>
        <el-form-item label="数据来源：" class="inputWidth" prop="source">
          <el-input size="small" v-model="importInfo.source"></el-input>
        </el-form-item>
        <el-form-item class="inputWidth">
          <span slot="label">
            <span style="color:#f56c6c">*</span> 上传文件：
          </span>
          <el-input size="small" v-model="importInfo.uploadFileName" disabled></el-input>
        </el-form-item>
      </el-form>
      <div style="margin-left:60%;margin-top: -52px;">
        <el-upload
          ref="upload"
          :action="uploadUrl"   
          :headers="{'Authorization':'Bearer ' +token}"
          :http-request="uploadFileInfo"
          :on-change="handleUploadOnChange"
          :show-file-list="false"
          :auto-upload="false">
          <el-button slot="trigger" size="small" type="success">选取文件</el-button>
          <el-button type="info" @click="templateVisible=true;fileType='xls';getTags()">下载模板</el-button>
        </el-upload>
      </div>
      <span style="font-size:12px;color:red;">提示：文件格式支持xls、xlsx，文件大小限制为10M</span>
      <br/><br/>
      <div v-if="hasFalseinfo">
        <span style="font-size:18px"><b>验证失败原因</b></span>
        <el-table :data="falseInfo" border highlight-current-row>
          <el-table-column
            align="center"
            label="行"
            prop="rowNum">
          </el-table-column>
          <el-table-column
            align="center"
            label="列"
            prop="colNum">
          </el-table-column>
          <el-table-column
            align="center"
            label="失败原因"
            prop="log">
          </el-table-column>
        </el-table>
      </div>


      <!-- 名单抽取 123 -->
      <el-dialog
        width="85%"
        title="名单抽取"
        :visible.sync="extractVisible"
        @close="resetScreening"
        append-to-body>
        <el-row class="table-container">
          
          <el-row class="form-container" style="padding: 20px 0 0 20px;">
            <el-row class="screening">
              <el-row class="margin-bottom-20">
                <div class="font14 bold">基本筛选条件</div>
              </el-row>
              <el-form 
                :inline="true" 
                size="small">
                <el-row>
                  <el-form-item label="批次名称：">
                    <el-select v-model="searchReq.batchId" style="width:133px;">
                      <el-option value="">请选择</el-option>
                      <el-option
                        v-for="item in allBatch"
                        :key="item.id"
                        :value="item.batchId"
                        :label="item.batchName">
                        </el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item label="性别：">
                    <el-select v-model="searchReq.customerSex" style="width:116px;">
                      <el-option value="">请选择</el-option>
                      <el-option value="0" label="男"></el-option>
                      <el-option value="1" label="女"></el-option>
                    </el-select>
                  </el-form-item>
        
                  <el-form-item label="客户质量评分：" prop="min" class="min">
                    <el-input style="width:81px;" v-model="searchReq.beginScore" v-on:blur="checkPositiveInteger(searchReq)"></el-input>
                  </el-form-item>
                  <b style="display:inline-block;font-size:14px;color: #606266;position:relative;top:1px;right:5px;">到</b>
                  <el-form-item prop="max" class="max">
                    <el-input style="width:81px;" v-model="searchReq.endScore" v-on:blur="checkPositiveInteger(searchReq)"></el-input>
                  </el-form-item>
                  <el-row style="display:inline-block;">
                    <el-form-item :inline="true" label="地区：" prop="min" class="min region">
                      <el-col :span="7" :offset="1">
                        <el-select v-model="searchReq.province" placeholder="省" @change="getRegion3(searchReq.province)">
                          <el-option value="">请选择</el-option>
                          <el-option
                            v-for="item in screening.region.province"
                            :key="item.id"
                            :label="item.regionName"
                            :value="item.regionCode">
                          </el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="7" :offset="1">
                        <el-select v-model="searchReq.city" placeholder="市" @change="getRegion3(searchReq.city)">
                          <el-option value="">请选择</el-option>
                          <el-option
                            v-for="item in screening.region.city"
                            :key="item.id"
                            :label="item.regionName"
                            :value="item.regionCode">
                          </el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="7" :offset="1">
                        <el-select v-model="searchReq.district" placeholder="县/区">
                          <el-option value="">请选择</el-option>
                          <el-option
                            v-for="item in screening.region.district"
                            :key="item.regionCode"
                            :label="item.regionName"
                            :value="item.regionCode">
                          </el-option>
                        </el-select>
                      </el-col>
                    </el-form-item>
                  </el-row>
                  <el-form-item label="操作时间：">
                    <el-date-picker
                        v-model="screeningTimeValue"
                        type="datetimerange"
                        range-separator="-"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                  </el-form-item>
                </el-row>
              </el-form>
            </el-row>
          </el-row>

          <el-collapse v-model="screeningFormOpen" class="screening form-container" @change="handleChangeAcitve2" style="position:relative">
            <el-button type="success" @click="getAllField();" style="position:absolute;top:8px;left:127px;">添加</el-button>
            <span class="form-more2 bold" style="float:right;margin-right:6px;color:#57AFFF;position:absolute;top:11px;right:41px;">更多</span>
            <el-collapse-item class="screening" title="自定义筛选条件" name="1">
              <el-row style="min-height:30px;">
                <el-tag
                  style="margin-right:10px;"
                  v-for="(item,index) in fieldTags"
                  @close="closeTag(index)"
                  :disable-transitions="true"
                  closable>
                  <span v-if="item.value||item.value===0">{{`${item.name}  ${item.condition}  ${item.value}`}}</span>
                  <span v-else>{{`${item.name}  ${item.condition}  ${item.valueFrom} ~ ${item.valueTo}`}}</span>
                </el-tag>
              </el-row>
            </el-collapse-item>
          </el-collapse>

          <el-row class="form-container" style="padding: 20px 0 0 20px;" v-if="addScreeningVisible">
            <el-row class="margin-bottom-20">
              <div class="font14 bold">添加/修改筛选条件</div>
            </el-row>
            <el-row>
              <el-form 
                :inline="true" 
                size="small">
                <el-form-item label="字段名：">
                  <el-select
                    v-model="customRequirement.propertyCode"
                    @change="changeFieldName"
                    style="width:133px;">
                    <el-option
                      v-for="(item,index) in allFieldName"
                      :key="index"
                      :label="item.propertyName"
                      :value="item.propertyCode">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="条件：">
                  <el-select 
                    v-model="customRequirement.range"
                    @change="changeField"
                    style="width:133px;">
                    <el-option
                      v-for="(item,index) in condition"
                      :key="index"
                      :label="item.name"
                      :value="item.value">
                      </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="条件值：" v-if="fieldType=='int'">
                  <el-input v-model="customRequirement.value" @blur="checkNumber(customRequirement.value)"></el-input>
                </el-form-item>

                <el-form-item label="条件值：" v-if="fieldType=='string'">
                  <el-input v-model="customRequirement.value"></el-input>
                </el-form-item>
                <el-form-item label="条件值：" v-if="fieldType=='dateInterval'">
                  <el-date-picker
                    v-model="fieldValues"
                    type="datetimerange"
                    range-separator="-"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    value-format="yyyy-MM-dd HH:mm:ss">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="条件值：" v-if="fieldType=='dateTime'">
                  <el-date-picker
                    v-model="customRequirement.value"
                    type="datetime"
                    placeholder="选择日期时间"
                    value-format="yyyy-MM-dd HH:mm:ss">
                  </el-date-picker>
                </el-form-item>
                <el-row style="display:inline-block;" v-if="fieldType=='interval'">
                  <el-form-item label="条件值：">
                    <el-input style="width:81px;" v-model="customRequirement.valueFrom" v-on:blur="checkInt(customRequirement)"></el-input>
                  </el-form-item>
                  <b style="display:inline-block;font-size:14px;color: #606266;position:relative;top:1px;right:5px;">到</b>
                  <el-form-item>
                    <el-input style="width:81px;" v-model="customRequirement.valueTo" v-on:blur="checkInt(customRequirement)"></el-input>
                  </el-form-item>
                </el-row>
                <el-form-item v-if="fieldType">
                  <el-button type="primary" @click="addFieldTag();screeningFormOpen=['1']">确定</el-button>
                  <el-button type="primary" plain @click="cancelAddFieldTag">取消</el-button>
                </el-form-item>
              </el-form>
            </el-row>
          </el-row>
          <el-row style="text-align:left;">
            <el-button type="primary" @click="getFiltercustomers">查询</el-button>
            <el-button @click="resetScreeningForm()">重置</el-button>
          </el-row>
        </el-row>

        <el-row class="table-container font14" style="font-size:16px;margin-bottom:15px;">
          <span style="padding-left:4px;">
            共筛选出
            <span style="color:#57AFFF;">
              {{totalCount}}
            </span>
            条客户数据
          </span>
        </el-row>

        <el-row class="form-container" style="padding: 20px 0 0 20px;">
          <el-row class="margin-bottom-20">
            <div class="font14 bold">填写基本信息</div>
          </el-row>
          <el-form :inline="true" size="small">
            <el-form-item label="名单名称：">
              <el-input v-model="addListReq.listName" style="width:133px;" placeholder="请输入名单名称"></el-input>
            </el-form-item>
             <el-form-item label="名单状态：">
              <el-switch
                v-model="addListReq.validityStatus"
                active-color="#13ce66"
                inactive-color="#999999"
                active-text="可见"
                inactive-text="不可见"
                active-value="0"
                inactive-value="1">
              </el-switch>
            </el-form-item>
          </el-form>
        </el-row>
        <el-row slot="footer" style="text-align:right;">
          <el-button type="primary" :disabled="totalCount === 0" @click="addGenerate">确定</el-button>
          <el-button type="primary" plain @click="extractVisible=false;importVisible=false;">取消</el-button>
          <el-button type="info" @click="extractVisible=false" title="客户导入">上一步</el-button>
        </el-row>
      </el-dialog>


      <div slot="footer" style="text-align: right;">
        <el-button type="primary" @click="submitUploadandimport()">确定导入</el-button>
        <el-button type="primary" plain @click="importVisible = false">取消</el-button>
        <el-button type="info" @click="extractVisible=true;getRegion3(0);getAllBatch();" title="名单抽取">名单抽取</el-button>
      </div>
    </el-dialog>

    <el-dialog
      align:left
      width="40%"
      title="定制导入模板"
      :visible.sync="templateVisible"
      append-to-body>
      <el-form size="small" label-width="100px">
        <el-form-item label="支持字段：">
          <div style="overflow-y:scroll;height: 100px;border:1px solid #dcdcdc;padding: 3px 1px 0px 6px;">
            <el-tag :key="tag.propertyCode" v-for="tag in alltags" v-dragging="{item: tag,list:alltags,group:'tag'}" type="primary" @click.native="setToSelectedTags(tag)" size="medium" style="cursor:pointer;padding: 0px 10px;margin-right:10px">
              {{tag.propertyName}}
            </el-tag>
            <span v-if="alltags.length === 0">暂无更多字段</span>
          </div>
          <span style="font-size:12px; color:red; margin-top: 2%;" v-if="alltags.length > 0">提示：点击字段名称添加到已选字段</span>
        </el-form-item>
        <br/>
        <el-form-item label="已选字段：" style="margin-top: -18px;">
          <div style="overflow-y:scroll;height: 100px;border:1px solid #dcdcdc;padding: 3px 1px 0px 6px;margin-top: -20px;">
            <el-tag v-for="selectedtag in selectedtags" v-dragging="{item: selectedtag,list:selectedtags,group:'selectedtag'}" type="success" @close="handleClose(selectedtag)" size="medium" style="padding: 0px 10px;margin-right:10px" :closable="selectedtag.isRequired!==1">
              {{selectedtag.propertyName}}
            </el-tag>
            <span v-if="selectedtags.length === 0">暂无已选字段</span>
          </div>
        </el-form-item>
        <br/>
        <el-form-item label="文件格式：">
          <el-radio v-model="fileType" label="xls" style="margin-right: -15px;">xls</el-radio>
          <el-radio v-model="fileType" label="xlsx">xlsx</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: right;margin-top: -35px">
        <el-button type="primary" @click="downloadTemplate(selectedtags,fileType)">确认</el-button>
        <el-button type="primary" plain @click="templateVisible = false">取消</el-button>
      </div>
    </el-dialog>
    
    <el-dialog
      align:left
      width="60%"
      title="修改客户"
      :visible.sync="editVisible"
      append-to-body>
      <div>
        <el-form size="small" :rules="rule" :model="customerReverseDetail.customer" ref="customerDetail" label-width="100px">
          <el-form-item label="客户姓名" style="width:50%">
            <el-input v-model="customerReverseDetail.customer.customerName" size="small" placeholder="上限50字符" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="客户性别">
            <el-radio-group v-model="customerReverseDetail.customer.customerSex" size="small">
                <el-radio-button label='0' border>男</el-radio-button>
                <el-radio-button label='1' border>女</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="身份证"  style="width:50%">
            <el-input v-model="customerReverseDetail.customer.idNo" size="small" placeholder="上限50字符" maxlength="50" @change="autoFill()"></el-input>
          </el-form-item>
          <el-form-item label="出生日期">
            <el-date-picker
              v-model="customerReverseDetail.customer.birthday"
              size="small"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="客户评分"  style="width:50%">
            <el-input v-model="customerReverseDetail.customer.score" max="100" size="small"></el-input>
          </el-form-item>
          <el-form-item label="客户地址">
            <el-table border empty-text="请添加数据" :data="customerReverseDetail.customerAddresses">
              <el-table-column align="center" label="省" width="150px">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.province" placeholder="省" @change="changeRegion(scope.row.province,scope.$index)">
                    <el-option
                      v-for="(province,index) in region1[scope.$index].province"
                      :key="province.id"
                      :value="province.regionCode"
                      :label="province.regionName"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column align="center" label="市" width="150px">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.city" placeholder="市"  @change="changeRegion(scope.row.city,scope.$index)">
                    <el-option
                      v-for="(city,index) in region1[scope.$index].city"
                      :key="city.id"
                      :value="city.regionCode"
                      :label="city.regionName"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column align="center" label="县/区" width="150px">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.district" placeholder="县/区">
                    <el-option
                      v-for="(district,index) in region1[scope.$index].district"
                      :key="district.id"
                      :value="district.regionCode"
                      :label="district.regionName"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column align="center" label="详细地址"width="250px">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.detail"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" label="是否默认" width="110px">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.isDefault"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="是"
                    inactive-text="否"
                    :active-value=1
                    :inactive-value=0>
                  </el-switch>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <i class="el-icon-delete" style="cursor:pointer;margin:0px 22px;" title="删除客户地址" @click="removeAddress1(scope)"></i>
                </template>
              </el-table-column>
            </el-table>
            <div class="showaddTool">
              <i class="el-icon-plus" circle title="点击添加一个客户地址" @click="addAddress1()"></i>
            </div>
          </el-form-item>
          <el-form-item>
            <span slot="label">
              <span style="color:#f56c6c">*</span> 联系信息
            </span>
            <el-table border empty-text="请添加数据" :data="customerReverseDetail.customerLinks">
              <el-table-column align="center" label="联系方式">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.linkType" placeholder="联系方式" clearable :disabled="scope.$index===0">
                    <el-option
                      v-for="type in linkTypes"
                      :key="type.value"
                      :value="type.value"
                      :label="type.label"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column align="center" label="对应值">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.linkValue"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" label="是否常用">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.isUsually"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="是"
                    inactive-text="否"
                    :active-value=1
                    :inactive-value=0
                    :disabled="scope.$index===0">
                  </el-switch>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <i class="el-icon-delete" style="cursor:pointer;margin:0px 22px;" title="删除联系方式" @click="removeLinkInfo1(scope)"></i>
                </template>
              </el-table-column>
            </el-table>
            <div class="showaddTool">
              <i class="el-icon-plus" circle title="点击添加一个联系信息" @click="addLinkInfo1()"></i>
            </div>
          </el-form-item>
          <el-form-item label="车辆信息">
            <el-table border empty-text="请添加数据" :data="customerReverseDetail.customerCars">
              <el-table-column align="center" label="汽车品牌">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.carBrand"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" label="汽车类型">
                <template slot-scope="scope">
                  <el-input  size="small" v-model="scope.row.carType"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" label="车牌号">
                <template slot-scope="scope">
                  <el-input  size="small" v-model="scope.row.licenseNo"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" label="车辆识别码">
                <template slot-scope="scope">
                  <el-input  size="small" v-model="scope.row.vinNo"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" label="发动机号">
                <template slot-scope="scope">
                  <el-input  size="small" v-model="scope.row.engineNo"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="操作">
                <template slot-scope="scope">
                  <i class="el-icon-delete" style="cursor:pointer;margin:0px 22px;" title="删除车辆信息" @click="removeCar1(scope)"></i>
                </template>
              </el-table-column>
            </el-table>
            <div class="showaddTool">
              <i class="el-icon-plus" circle title="点击添加一个车辆信息" @click="addCarInfo1()"></i>
            </div>
          </el-form-item>
        </el-form>
      </div>
        <div slot="footer" style="text-align: right;">
          <!-- <el-button type="danger" @click="searchByCustomerId(resetParam,2);">重 置</el-button> -->
          <el-button type="primary" @click="submitForm('customerDetail');editCustomer(customerReverseDetail)">确定</el-button>
          <el-button type="primary" plain @click="editVisible = false">取消</el-button>
        </div>
      </el-dialog>

      <el-dialog append-to-body :visible.sync="deleteVisible" title="操作提示" width="30%">
        <span style="font-size:20px;">确认要删除该行吗？</span>
        <div slot="footer" class="dialog-footer" style="text-align: right;">
          <el-button type="primary" @click="deleteSth(deleteData,deleteType);">确定</el-button>
          <el-button type="primary" plain @click="deleteVisible = false">取消</el-button>
        </div>
      </el-dialog>

    <el-dialog
      align:left
      width="30%"
      title="客户信息详情"
      :visible.sync="detailVisible"
      append-to-body>
      <div style="height:500px;overflow-y:auto;">
        <el-form size="small" label-width="100px">
        <el-form-item label="批次编号">
          <span>{{customerReverseDetail.customer.batchId}}</span>
        </el-form-item>
        <el-form-item label="客户编号">
          <span>{{customerReverseDetail.customer.customerId}}</span>
        </el-form-item>
        <el-form-item label="客户姓名">
          <span>{{customerReverseDetail.customer.customerName}}</span>
        </el-form-item>
        <el-form-item label="客户性别">
          <span>{{showSex(customerReverseDetail.customer.customerSex)}}</span>
        </el-form-item>
        <el-form-item label="出生日期">
          <span>{{customerReverseDetail.customer.birthday}}</span>
        </el-form-item>
        <el-form-item label="身份证">
          <span>{{hideIdNumber(customerReverseDetail.customer.idNo)}}</span>
        </el-form-item>
        <el-form-item label="客户评分">
          <span>{{customerReverseDetail.customer.score}}</span>
        </el-form-item>
        <el-form-item :label="'客户地址'+(index+1)" v-for="(item,index) in customerReverseDetail.customerAddresses" :key="customerReverseDetail.customerAddresses.id" v-if="customerReverseDetail.customerAddresses && customerReverseDetail.customerAddresses.length > 0">
          <span>{{showAddress(item)}}</span>
        </el-form-item>
        <el-form-item :label="'车辆信息'+(index+1)" v-for="(item,index) in customerReverseDetail.customerCars" :key="customerReverseDetail.customerCars.id" v-if="customerReverseDetail.customerCars && customerReverseDetail.customerCars.length > 0">
          &nbsp;&nbsp;&nbsp;&nbsp;<span>品牌：{{item.carBrand}}</span><br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<span>类型：{{item.carType}}</span> <br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<span>车牌号：{{item.licenseNo}}</span> 
        </el-form-item>
        <el-form-item :label="'联系信息'+(index+1)" v-for="(item,index) in customerReverseDetail.customerLinks" :key="customerReverseDetail.customerLinks.id" v-if="customerReverseDetail.customerLinks && customerReverseDetail.customerLinks.length > 0">
          &nbsp;&nbsp;&nbsp;&nbsp;<span>联系类型：{{showLinkType(item.linkType)}}</span><br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<span>对应值：{{item.linkValue}}</span>
        </el-form-item>
        <el-form-item label="操作人">
          <span>{{customerReverseDetail.customer.modifierName}}</span>
        </el-form-item>
        <el-form-item label="操作时间">
          <span>{{formatDateTime(customerReverseDetail.customer.modifierTime)}}</span>
        </el-form-item>
      </el-form>
      </div>
      <div slot="footer" style="text-align: right;">
        <el-button type="primary" plain @click="detailVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      align:left
      width="60%"
      title="新建客户"
      :visible.sync="addVisible"
      append-to-body>
        <el-form size="small" :rules="rule" :model="customerDetail" ref="customerDetail" label-width="100px">
          <el-form-item label="客户姓名" style="width:50%">
            <el-input v-model="customerDetail.customerName" size="small" placeholder="上限50字符" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="客户性别">
            <el-radio-group v-model="customerDetail.customerSex" size="small">
              <el-radio-button label='0' border>男</el-radio-button>
              <el-radio-button label='1' border>女</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="身份证" style="width:50%">
            <el-input v-model="customerDetail.idNo" size="small" placeholder="上限50字符" maxlength="50" @change="autoFill()"></el-input>
          </el-form-item>
          <el-form-item label="出生日期">
            <el-date-picker
              v-model="customerDetail.birthday"
              size="small"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="客户评分"  style="width:50%">
            <el-input v-model="customerDetail.score" max="100" size="small"></el-input>
          </el-form-item>
          <el-form-item label="数据来源"  style="width:50%">
            <el-input v-model="customerDetail.source" max="100" size="small"></el-input>
          </el-form-item>
          <el-form-item label="客户地址">
            <el-table border empty-text="请添加数据" :data="addressDatas">
              <el-table-column align="center" label="省" width="150px">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.province" placeholder="省" @change="getRegion(scope.row.province,scope.$index)">
                    <el-option
                      v-for="(province,index) in region[scope.$index].province"
                      :key="province.id"
                      :value="province.regionCode"
                      :label="province.regionName"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column align="center" label="市" width="150px">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.city" placeholder="市"  @change="getRegion(scope.row.city,scope.$index)">
                    <el-option
                      v-for="(city,index) in region[scope.$index].city"
                      :key="city.id"
                      :value="city.regionCode"
                      :label="city.regionName"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column align="center" label="县/区" width="150px">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.district" placeholder="县/区">
                    <el-option
                      v-for="(district,index) in region[scope.$index].district"
                      :key="district.id"
                      :value="district.regionCode"
                      :label="district.regionName"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column align="center" label="详细地址"width="300px">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.detail"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" label="是否默认">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.isDefault"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="是"
                    inactive-text="否"
                    :active-value=1
                    :inactive-value=0>
                  </el-switch>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <i class="el-icon-delete" style="cursor:pointer;margin:0px 22px;" title="删除客户地址" @click="removeAddress(scope)"></i>
                </template>
              </el-table-column>
            </el-table>
            <div class="showaddTool">
              <i class="el-icon-plus" circle title="点击添加一个客户地址" @click="addAddress()"></i>
            </div>
          </el-form-item>
          <el-form-item>
            <span slot="label">
              <span style="color:#f56c6c">*</span> 联系信息
            </span>
            <el-table border empty-text="请添加数据" :data="linkDatas">
              <el-table-column align="center" label="联系方式">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.linkType" placeholder="联系方式" clearable  :disabled="scope.$index===0">
                    <el-option
                      v-for="type in linkTypes"
                      :key="type.value"
                      :value="type.value"
                      :label="type.label"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column align="center" label="对应值">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.linkValue"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" label="是否常用">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.isUsually"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="是"
                    inactive-text="否"
                    :active-value=1
                    :inactive-value=0
                    :disabled="scope.$index===0">
                  </el-switch>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <i class="el-icon-delete" style="cursor:pointer;margin:0px 22px;" title="删除联系方式" @click="removeLinkInfo(scope)"></i>
                </template>
              </el-table-column>
            </el-table>
            <div class="showaddTool">
              <i class="el-icon-plus" circle title="点击添加一个联系信息" @click="addLinkInfo()"></i>
            </div>
          </el-form-item>
          <el-form-item label="车辆信息">
            <el-table border empty-text="请添加数据" :data="carDatas">
              <el-table-column align="center" label="汽车品牌">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.carBrand"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" label="汽车类型">
                <template slot-scope="scope">
                  <el-input  size="small" v-model="scope.row.carType"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" label="车牌号">
                <template slot-scope="scope">
                  <el-input  size="small" v-model="scope.row.licenseNo"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" label="车辆识别码">
                <template slot-scope="scope">
                  <el-input  size="small" v-model="scope.row.vinNo"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" label="发动机号">
                <template slot-scope="scope">
                  <el-input  size="small" v-model="scope.row.engineNo"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="操作">
                <template slot-scope="scope">
                  <i class="el-icon-delete" style="cursor:pointer;margin:0px 22px;" title="删除车辆信息" @click="removeCar(scope.row)"></i>
                </template>
              </el-table-column>
            </el-table>
            <div class="showaddTool">
              <i class="el-icon-plus" circle title="点击添加一个车辆信息" @click="addCarInfo()"></i>
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" style="text-align: right;">
          <el-button type="primary" @click="submitForm('customerDetail');addCustomer(customerDetail,addressDatas,linkDatas,carDatas)">确定</el-button>
          <el-button @click="resetForm('customerDetail');resetArrays()">重置</el-button>
          <el-button type="primary" plain @click="addVisible = false">取消</el-button>
        </div>
      </el-dialog>
    <el-dialog
      width="30%"
      title="操作提示"
      :visible.sync="delVisible"
      append-to-body>
    <span style="font-size:20px;">确定删除此客户？</span>
    <div slot="footer" class="dialog-footer" style="text-align: right;">
      <el-button type="primary" @click="delVisible = false;delCustomer(delReq);">确定</el-button>
      <el-button type="primary" plain @click="delVisible = false">取消</el-button>
    </div>
  </el-dialog>
  <el-dialog
    width="30%"
    title="批量删除"
    :visible.sync="batchDelVisible"
    append-to-body>
  <span style="font-size:20px;">确定删除选定内容？</span>
  <div slot="footer" class="dialog-footer" style="text-align: right;">
    <el-button type="primary" @click="batchDelVisible = false;batchDelCustomer(batchDelReq);">确定</el-button>
    <el-button type="primary" plain @click="batchDelVisible = false">取消</el-button>
  </div>
  </el-dialog>
  </div>
</template>
<script>

import {
  queryByCustomer,
  delCustomer,
  queryByCustomerId,
  editCustomer,
  addCustomer,
  batchDelCustomer,
  getSupportedTags,
  setIsSelected,
  uploadFileandImport,
  getRegion,
  deleteAddress,
  deleteLink,
  deleteCar,
  getAllBatch,
  getAllField,
  getFiltercustomers,
  addGenerate
} from '@/api/customerManagement'
import { formatDateTime, clone } from '@/utils/tools'

export default {
  name: 'customer_management',
  data() {
    return {
      formContainerOpen: '1',
      // 名单抽取
      extractVisible: false,
      screeningFormOpen: [],
      addScreeningVisible: false,
      allBatch: [],
      allFieldName: [],
      totalCount: 0,
      screeningTimeValue: [],
      searchReq: {
        batchId: '',
        beginScore: '',
        city: '',
        customRequirements: [
          {
            // belongTo: '',
            // fieldType: '',
            // propertyCode: '',
            // range: '',
            // value: '',
            // valueFrom: '',
            // valueTo: ''
          }
        ],
        customerSex: '',
        district: '',
        endScore: '',
        province: '',
        modifyTimeStart: '',
        modifyTimeEnd: ''
      },
      addListReq: {
        customerQueryModel: {},
        listName: '',
        validityStatus: '0'
      },
      updateObj: {
        id: '',
        isSelected : ''
      },
      fieldType: '',
      fieldValues: [],
      fieldTags: [],
      fieldTagInfo: {},
      customRequirement: {
        belongTo: '',
        fieldType: '',
        propertyCode: '',
        range: '',
        value: '',
        valueFrom: '',
        valueTo: '',
      },
      customRequirements: [],
      condition: [],
      screening: {
        region: {
          province: '',
          city: '',
          district: ''
        }
      },
      // ---------------------
      deleteData: '', // 用来删除的信息
      deleteType: '', // 删除的类型
      deleteVisible: false,
      addressDatas: [], // 地址信息
      linkDatas: [], // 联系信息
      carDatas: [], // 车辆信息
      linkTypes: [
        {
          value: 0,
          label: '电话'
        },
        {
          value: 1,
          label: '微信'
        },
        {
          value: 2,
          label: 'QQ'
        },
        {
          value: 3,
          label: '邮箱'
        }
      ], // 联系方式
      region1: [],
      region: [{
        province: '',
        city: '',
        district: ''
      }],
      importVisible: false, // 导入客户对话框显示隐藏
      hasFalseinfo: false, // 校验是否有错误信息
      falseInfo: [], // 错误信息
      file: {}, // 上传的文件
      uploadUrl: '/api/v1/customer/upload', // 上传文件url
      importInfo: { // 导入需要的信息
        batchName: '',
        source: '',
        uploadFileName: ''
      },
      templateVisible: false, // 下载模板对话框显示隐藏
      alltags: [], // 模板支持的所有字段
      testAlltags: [], // 模板支持全部的所有字段
      selectedtags: [], // 模板已选择的字段
      fileType: 'xls', // 模板文件格式 默认xls
      detailVisible: false,
      delVisible: false, // 删除对话框显示隐藏
      editVisible: false, // 修改对话框显示隐藏
      addVisible: false, // 新建对话框显示隐藏
      batchDelVisible: false, // 批量删除对话框显示隐藏
      tableData: [], // 表格数据
      validate: true, // 验证不通过阻止发请求
      pageShow: false, // 分页显示隐藏
      token: localStorage.getItem('Admin-Token'),
      timeValue: [],
      rule: {
        customerName: [
          { required: true, message: '请输入客户名称', trigger: 'blur' }
        ],
        birthday: [
          { required: true, message: '请输入出生年月', trigger: 'blur' }
        ],
        score: [
          { required: true, message: '请输入客户评分', trigger: 'blur' }
        ],
        idNo: [
          { required: true, message: '请输入身份证号码', trigger: 'blur' },
          { pattern: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/, message: '请输入正确的身份证号码' }
        ],
        customerSex: [
          { required: true, message: '请选择客户性别', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^([1][3,4,5,7,8][0-9]{9}|0\d{2,3}-\d{7,8}|\d{1,20})$/, message: '请输入正确的电话号码' }
        ],
        batchName: [
          { required: true, message: '请输入批次名称', trigger: 'blur' }
        ],
        source: [
          { required: true, message: '请输入数据来源', trigger: 'blur' }
        ]
      },
      delReq: {
        customerId: ''
      },
      batchDelReq: {
        customerIds: []
      },
      // 查询 发送请求参数
      req: {
        batchId: '',
        customerId: '',
        customerName: '',
        idNo: '',
        modifierName: '',
        modifyTimeStart: '',
        modifyTimeEnd: '',
        pageNo: 1,
        pageSize: 10
      },
      req2: {
        batchId: '',
        customerId: '',
        customerName: '',
        idNo: '',
        modifierName: '',
        modifyTimeStart: '',
        modifyTimeEnd: '',
        pageNo: 1,
        pageSize: 10
      },
      customerDetail: {
        customerName: '',
        customerSex: '',
        idNo: '',
        birthday: '',
        score: ''

      }, // 客户详情
      customerReverseDetail: {
        customer: {},
        customerAddresses: [],
        customerCars: [],
        customerLinks: []

      },
      // 分页数据
      pageInfo: {}
    }
  },
  mounted() {
    this.handleChangeAcitve()
    this.searchCustomer(this.req)
  },
  methods: {
    handleChangeAcitve(active = ['1']) {
      if (active.length) {
        $('.form-more').text('收起')
      } else {
        $('.form-more').text('更多')
      }
    },
    handleChangeAcitve2(active = ['1']) {
      if (active.length) {
        $('.form-more2').text('收起')
      } else {
        $('.form-more2').text('更多')
      }
    },
    // 名单抽取
    checkCustomForm() {
      if (!this.customRequirement.propertyCode) {
        this.$message.error('请选择字段名')
        return false
      } else if (!this.customRequirement.range) {
        this.$message.error('请选择条件')
        return false
      } else if (this.customRequirement.value === 0) {
        return true
      } else if (!this.customRequirement.value) {
        if (this.customRequirement.fieldType === 2 && this.customRequirement.range === 8 && !(this.fieldValues.length)) {
          this.$message.error('请填写条件值')
          return false
        } else if (!this.customRequirement.valueFrom) {
          this.$message.error('请填写条件值')
          return false
        } else if (!this.customRequirement.valueTo) {
          this.$message.error('请填写条件值')
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    },
    // 查询客户返回数量
    getFiltercustomers() {
      if (this.fieldTags.length) {
        this.searchReq.customRequirements = this.customRequirements
      } else {
        this.searchReq.customRequirements = []
      }
      if (this.screeningTimeValue.length) {
        this.searchReq.modifyTimeStart = this.screeningTimeValue[0]
        this.searchReq.modifyTimeEnd = this.screeningTimeValue[1]
      } else {
        this.searchReq.modifyTimeStart = ''
        this.searchReq.modifyTimeEnd = ''
      }
      getFiltercustomers(this.searchReq).then(response => {
        if (response.data.code === 0) {
          this.totalCount = response.data.data
        } else {
          this.totalCount = 0
          this.$message.error('查询失败')
        }
      }).catch(error => {
        throw error
      })
    },
    // 查询所有字段名
    getAllField() {
      getAllField().then(response => {
        if (response.data.code === 0) {
          this.allFieldName = this.fieldNameFilter(response.data.data)
        } else {
          this.$message.error('获取字段名失败')
        }
        this.addScreeningVisible = true
      }).catch(error => {
        throw error
      })
    },
    // 去掉基础条件重复的字段名
    fieldNameFilter(arr) {
      var obj = arr
      for (var i = 0; i < obj.length; i++) {
        if (obj[i].id === 33) obj.splice(i, 1)
        if (obj[i].id === 39) obj.splice(i, 1)
        if (obj[i].id === 40) obj.splice(i, 1)
        if (obj[i].id === 41) obj.splice(i, 1)
        if (obj[i].id === 69) obj.splice(i, 1)
      }
      return obj
    },
    // 查询所有批次
    getAllBatch() {
      console.log(this.searchReq)
      getAllBatch().then(response => {
        if (response.data.code === 0) {
          this.allBatch = response.data.data
        } else {
          this.$message.error('获取批次失败')
        }
      }).catch(error => {
        throw error
      })
    },
    // 正整数且前者不能大于后者
    checkPositiveInteger(req) {
      var beginVal = 0
      var endVal = 0
      if (req.beginScore) beginVal = parseInt(req.beginScore)
      else if (!req.beginScore) beginVal = 0
      if (req.endScore) endVal = parseInt(req.endScore)
      else if (!req.endScore) endVal = 0
      if (beginVal >= 0) {
        if (beginVal > endVal && req.endScore) {
          this.$message.error('分数取值前者不能大于后者！')
        }
      } else {
        this.$message.error('分数只能是正整数')
        this.searchReq.beginScore = '0'
      }
      if (endVal >= 0) {
        if (beginVal > endVal && req.endScore) {
          this.$message.error('分数取值前者不能大于后者！')
        }
      } else {
        this.$message.error('分数只能是正整数')
        this.searchReq.endScore = '0'
      }
    },
    // 数字且前者不能大于后者
    checkInt(req) {
      if (req.valueFrom === null && req.valueTo === null) return false
      var beginVal = 0
      var endVal = 0
      var reg = /-[0-9]+(.[0-9]+)?|[0-9]+(.[0-9]+)?/
      if (req.valueFrom) beginVal = Number(req.valueFrom)
      if (req.valueTo) endVal = Number(req.valueTo)
      if (reg.test(beginVal) && reg.test(endVal)) {
        if (beginVal > endVal && req.valueTo) {
          this.$message.error('数字条件值前者不能大于后者！')
          this.customRequirement.valueFrom = null
          this.customRequirement.valueTo = null
        }
      } else {
        this.$message.error('请填写数字')
        this.customRequirement.valueFrom = null
        this.customRequirement.valueTo = null
      }
    },
    checkNumber(val) {
      var num = 0
      var reg = /-[0-9]+(.[0-9]+)?|[0-9]+(.[0-9]+)?/
      if (val) num = Number(val)
      if (!reg.test(num)) {
        this.$message.error('请填写数字')
        this.customRequirement.value = 0
      } else {
        return true
      }
    },
    // 地区三级连跳
    getRegion3(req) {
      getRegion(req).then(response => {
        if (response.data.code === 0) {
          if (response.data.data[0].regionLevel === 1) {
            this.screening.region.province = response.data.data
          } else if (response.data.data[0].regionLevel === 2) {
            this.screening.region.city = response.data.data
            if (this.screening.region.city.length === 1) {
              this.searchReq.city = response.data.data[0].regionCode
              this.$set(this.searchReq, 'district', '')
              getRegion(this.searchReq.city).then(response => {
                this.screening.region.district = response.data.data
              }).catch(error => {
                throw error
              })
            } else {
              this.searchReq.city = ''
              this.$set(this.searchReq, 'district', '')
            }
          } else if (response.data.data[0].regionLevel === 3) {
            this.screening.region.district = response.data.data
            this.$set(this.screening, 'district', '')
          }
        }
      }).catch(error => {
        throw error
      })
    },
    // 自定义筛选条件
    // 选择字段名
    changeFieldName(value) {
      let obj = {}
      obj = this.allFieldName.find((item) => {
        return item.propertyCode === value
      })
      this.fieldValues = []
      this.$set(this.customRequirement, 'value', '')
      this.$set(this.customRequirement, 'valueFrom', '')
      this.$set(this.customRequirement, 'valueTo', '')
      this.$set(this.customRequirement, 'range', '')
      this.$set(this.customRequirement, 'fieldType', obj.fieldType)
      this.$set(this.customRequirement, 'belongTo', obj.belongTo)
      this.$set(this.fieldTagInfo, 'name', obj.propertyName)
      this.getFieldItem(obj)
    },
    // 选择条件
    changeField(index) {
      let obj = {}
      obj = this.condition.find((item) => {
        return item.value === index
      })
      this.fieldValues = []
      this.$set(this.fieldTagInfo, 'condition', obj.name)
      this.$set(this.customRequirement, 'value', '')
      this.$set(this.customRequirement, 'valueFrom', '')
      this.$set(this.customRequirement, 'valueTo', '')
      if (this.customRequirement.fieldType === 0) this.fieldType = 'string'
      else if (index >= '0' && index <= '5' && this.customRequirement.fieldType === 2) this.fieldType = 'dateTime'
      else if (index === '8' && this.customRequirement.fieldType === 2) {
        this.fieldType = 'dateInterval'
        this.customRequirement.value = ''
      } else if (index === '8' && this.customRequirement.fieldType === 1) {
        this.fieldType = 'interval'
      } else this.fieldType = 'int'
    },
    // 添加标签
    addFieldTag() {
      console.log(this.customRequirement.value)
      var tagTemp = {}
      var temp = {}
      if (this.customRequirement.value || this.customRequirement.value === 0) {
        this.$set(this.fieldTagInfo, 'value', this.customRequirement.value)
        this.fieldTagInfo.valueFrom = ''
        this.fieldTagInfo.valueTo = ''
        this.customRequirement.valueFrom = ''
        this.customRequirement.valueTo = ''
      } else if (this.fieldValues.length) {
        this.$set(this.customRequirement, 'valueFrom', this.fieldValues[0])
        this.$set(this.customRequirement, 'valueTo', this.fieldValues[1])
        this.$set(this.fieldTagInfo, 'valueFrom', this.fieldValues[0])
        this.$set(this.fieldTagInfo, 'valueTo', this.fieldValues[1])
        this.fieldTagInfo.value = ''
        this.customRequirement.value = ''
      } else {
        this.$set(this.fieldTagInfo, 'valueFrom', this.customRequirement.valueFrom)
        this.$set(this.fieldTagInfo, 'valueTo', this.customRequirement.valueTo)
        this.fieldTagInfo.value = ''
        this.customRequirement.value = ''
      }
      if (!this.checkCustomForm()) {
        return false
      }
      tagTemp = clone(this.fieldTagInfo)
      if (JSON.stringify(this.fieldTags).indexOf(JSON.stringify(tagTemp)) === -1) {
        this.fieldTags.push(tagTemp)
      } else {
        this.$message.error('请勿添加相同的自定义筛选条件')
      }
      temp = clone(this.customRequirement)
      if (JSON.stringify(this.customRequirements).indexOf(JSON.stringify(temp)) === -1) {
        this.customRequirements.push(temp)
      } else {
        this.$message.error('请勿添加相同的自定义筛选条件')
      }
    },
    // 取消添加
    cancelAddFieldTag() {
      this.customRequirement = {
        belongTo: '',
        fieldType: '',
        propertyCode: '',
        range: '',
        value: '',
        valueFrom: '',
        valueTo: ''
      }
      this.fieldValues = []
      this.fieldTagInfo = {}
      this.addScreeningVisible = false
    },
    closeTag(index) {
      this.fieldTags.splice(index, 1)
      this.customRequirements.splice(index, 1)
    },
    getFieldItem(obj) { // 0 string , 1 int , 2 date
      this.condition = []
      if (obj.fieldType === 0) {
        this.condition = [
          { name: '等于', value: '0' },
          { name: '包含', value: '6' },
          { name: '不包含', value: '7' }
        ]
      } else if (obj.fieldType === 1) {
        this.condition = [
          { name: '等于', value: '0' },
          { name: '不等于', value: '1' },
          { name: '大于', value: '2' },
          { name: '大于等于', value: '3' },
          { name: '小于', value: '4' },
          { name: '小于等于', value: '5' },
          { name: '范围', value: '8' }
        ]
      } else {
        this.condition = [
          { name: '等于', value: '0' },
          { name: '不等于', value: '1' },
          { name: '大于', value: '2' },
          { name: '大于等于', value: '3' },
          { name: '小于', value: '4' },
          { name: '小于等于', value: '5' },
          { name: '范围', value: '8' }
        ]
      }
    },
    resetScreeningForm() {
      console.log(this.searchReq)
      this.fieldType = ''
      this.fieldTags = []
      this.screeningTimeValue = []
      this.fieldValues = []
      this.customRequirements = []
      this.searchReq = {
        batchId: '',
        beginScore: '',
        city: '',
        customRequirements: [
          // {
          //   belongTo: '',
          //   fieldType: '',
          //   propertyCode: '',
          //   range: '',
          //   value: '',
          //   valueFrom: '',
          //   valueTo: ''
          // }
        ],
        customerSex: '',
        district: '',
        endScore: '',
        province: '',
        modifyTimeStart: '',
        modifyTimeEnd: ''
      }
      this.cancelAddFieldTag()
    },
    addGenerate() {
      if (!this.addListReq.listName) {
        this.$message.error('请输入名单名称')
        return false
      } else {
        if (this.fieldTags.length) {
          this.searchReq.customRequirements = this.customRequirements
        } else {
          this.searchReq.customRequirements = []
        }
        if (this.screeningTimeValue.length) {
          this.searchReq.modifyTimeStart = this.screeningTimeValue[0]
          this.searchReq.modifyTimeEnd = this.screeningTimeValue[1]
        } else {
          this.searchReq.modifyTimeStart = ''
          this.searchReq.modifyTimeEnd = ''
        }
        this.addListReq.customerQueryModel = clone(this.searchReq)
        getFiltercustomers(this.searchReq).then(response => {
          if (response.data.code === 0) {
            this.totalCount = response.data.data
            if (!this.totalCount) {
              this.$message.error('该条件下无符合的数据，无法生成名单')
            } else {
              addGenerate(this.addListReq).then(response => {
                if (response.data.code === 0) {
                  this.$message.success('生成名单成功')
                  this.extractVisible = false
                  this.importVisible = false
                } else {
                  this.$message.error('生成名单失败')
                }
              }).catch(error => {
                throw error
              })
            }
          } else {
            this.totalCount = 0
          }
        }).catch(error => {
          throw error
        })
      }
    },
    resetScreening() {
      this.addListReq = {
        customerQueryModel: {},
        listName: '',
        validityStatus: '0'
      }
      this.totalCount = 0
      this.resetScreeningForm()
    },
    // ---------------------------------
    addAddress() {
      this.addressDatas.push({
        province: '',
        city: '',
        district: '',
        detail: '',
        isDefault: 0
      })
      this.region.push({
        province: '',
        city: '',
        district: ''
      })
      this.getRegion(0, this.region.length - 1)
    },
    addAddress1() {
      this.customerReverseDetail.customerAddresses.push({
        province: '',
        city: '',
        district: '',
        detail: '',
        isDefault: 0
      })
      this.region1.push({
        province: [],
        city: [],
        district: []
      })
      this.region = this.region1
      this.getRegion(0, this.region1.length - 1)
    },
    removeAddress(data) {
      this.addressDatas.splice(data.$index, 1)
      this.region.splice(data.$index, 1)
    },
    removeAddress1(data) {
      if (data.row.id) {
        this.deleteData = data
        this.deleteType = 1
        this.deleteVisible = true
      } else {
        this.customerReverseDetail.customerAddresses.splice(data.$index, 1)
      }
    },
    addLinkInfo() {
      this.linkDatas.push({
        linkType: '',
        linkValue: '',
        isUsually: 0
      })
    },
    addLinkInfo1() {
      this.customerReverseDetail.customerLinks.push({
        linkType: '',
        linkValue: '',
        isUsually: 0
      })
    },
    removeLinkInfo(data) {
      if (data.$index === 0) {
        this.$message.error('该项为必填项！')
        return
      }
      this.linkDatas.splice(data.$index, 1)
    },
    removeLinkInfo1(data) {
      if (data.$index === 0) {
        this.$message.error('该项为必填项！')
        return
      }
      if (data.row.id) {
        this.deleteData = data
        this.deleteType = 2
        this.deleteVisible = true
      } else {
        this.customerReverseDetail.customerLinks.splice(data.$index, 1)
      }
    },
    addCarInfo() {
      this.carDatas.push({
        carBrand: '',
        carType: '',
        licenseNo: '',
        vinNo: '',
        engineNo: ''
      })
    },
    addCarInfo1() {
      this.customerReverseDetail.customerCars.push({
        carBrand: '',
        carType: '',
        licenseNo: '',
        vinNo: '',
        engineNo: ''
      })
    },
    removeCar(data) {
      this.carDatas.splice(data.$index, 1)
    },
    removeCar1(data) {
      if (data.row.id) {
        this.deleteData = data
        this.deleteType = 3
        this.deleteVisible = true
      } else {
        this.customerReverseDetail.customerCars.splice(data.$index, 1)
      }
    },
    showLinkType(code) {
      switch (code) {
        case 0: return '电话'
        case 1: return '微信'
        case 2: return 'QQ'
        case 3: return '邮箱'
      }
    },
    deleteSth(data, type) {
      if (type === 1) {
        deleteAddress(data.row.addressId).then(response => {
          if (response.data.code === 0) {
            this.$message.success(response.data.message)
            this.deleteVisible = false
            this.customerReverseDetail.customerAddresses.splice(data.$index, 1)
            this.region1.splice(data.$index, 1)
          } else {
            this.$message.error(response.data.message)
            this.deleteVisible = false
          }
        })
      } else if (type === 2) {
        deleteLink(data.row.linkId).then(response => {
          if (response.data.code === 0) {
            this.$message.success(response.data.message)
            this.deleteVisible = false
            this.customerReverseDetail.customerLinks.splice(data.$index, 1)
          } else {
            this.$message.error(response.data.message)
            this.deleteVisible = false
          }
        })
      } else if (type === 3) {
        deleteCar(data.row.carinfoId).then(response => {
          if (response.data.code === 0) {
            this.$message.success(response.data.message)
            this.deleteVisible = false
            this.customerReverseDetail.customerCars.splice(data.$index, 1)
          } else {
            this.$message.error(response.data.message)
            this.deleteVisible = false
          }
        })
      }
    },
    resetArrays() {
      this.addressDatas = []
      this.linkDatas = []
      this.linkDatas.push({
        linkType: 0,
        linkValue: '',
        isUsually: 1
      })
      this.carDatas = []
      this.region = []
      this.customerDetail.score = ''
    },
    changeRegion(req, index) {
      getRegion(req).then(response => {
        if (response.data.code === 0) {
          if (response.data.data[0].regionLevel === 1) {
            this.region1[index].province = response.data.data
          } else if (response.data.data[0].regionLevel === 2) {
            this.region1[index].city = response.data.data
            if (this.region1[index].city.length === 1) { // 直辖市
              this.customerReverseDetail.customerAddresses[index].city = response.data.data[0].regionCode
              this.$set(this.customerReverseDetail.customerAddresses[index], 'district', '')
              getRegion(this.customerReverseDetail.customerAddresses[index].city).then(response => {
                this.region1[index].district = response.data.data
              })
                .catch(error => {
                  throw error
                })
            } else { // 包含多个市
              this.customerReverseDetail.customerAddresses[index].city = ''
              this.customerReverseDetail.customerAddresses[index].district = ''
              this.$set(this.customerReverseDetail.customerAddresses[index], 'district', '')
            }
          } else if (response.data.data[0].regionLevel === 3) {
            this.region1[index].district = response.data.data
            this.customerReverseDetail.customerAddresses[index].district = ''
          }
        }
      })
    },
    // 查询地区
    getRegion(req, index) {
      getRegion(req).then(response => {
        if (response.data.code === 0) {
          if (response.data.data[0].regionLevel === 1) {
            this.region[index].province = response.data.data
          } else if (response.data.data[0].regionLevel === 2) {
            this.region[index].city = response.data.data
            if (this.region[index].city.length === 1) { // 直辖市
              this.addressDatas[index].city = response.data.data[0].regionCode
              this.addressDatas[index].district = ''
              getRegion(this.addressDatas[index].city).then(response => {
                this.region[index].district = response.data.data
              }).catch(error => {
                throw error
              })
            } else {
              this.addressDatas[index].city = ''
              this.addressDatas[index].district = ''
            }
          } else if (response.data.data[0].regionLevel === 3) {
            this.addressDatas[index].district = ''
            this.region[index].district = response.data.data
          }
        }
      }).catch(error => {
        throw error
      })
    },
    getRegion1(req) {
      this.region1 = []
      this.region = []
      for (let i = 0; i < this.customerReverseDetail.customerAddresses.length; i++) {
        this.region1.push({
          province: [],
          city: [],
          district: []
        })
        getRegion(0).then(response => {
          this.region1[i].province = response.data.data
          this.customerReverseDetail.customerAddresses[i].province = req.customerAddresses[i].province
          if (req.customerAddresses[i].province) {
            getRegion(req.customerAddresses[i].province).then(response => {
              this.region1[i].city = response.data.data
              this.customerReverseDetail.customerAddresses[i].city = req.customerAddresses[i].city
              if (req.customerAddresses[i].city) {
                getRegion(req.customerAddresses[i].city).then(response => {
                  this.region1[i].district = response.data.data
                  this.customerReverseDetail.customerAddresses[i].district = req.customerAddresses[i].district
                }).catch(error => {
                  throw error
                })
              }
            }).catch(error => {
              throw error
            })
          }
        }).catch(error => {
          throw error
        })
      }
    },
    // 获取所有支持的可用模板字段
    getTags() {
      getSupportedTags().then(response => {
        if (response.data.code === 0) {
          this.alltags = response.data.data
          if (this.alltags.length > 0) {
            this.selectedtags.length = 0
            for (var i = 0; i < this.alltags.length; i++) {
              if (this.alltags[i].isRequired === 1) {
                this.selectedtags.push(this.alltags[i])
                var temp = i++;
                this.alltags.splice(temp,1)
              }
            }
            for (var j = 0; j < this.alltags.length; j++) {
              if (this.alltags[j].isSelected === 1) {
                  this.selectedtags.push(this.alltags[j])
                  // 之所以不删除而用替换是因为删除会改变整个数组顺序导致数据紊乱
                  this.updateObj.id = -1
                  this.alltags.splice(j, 1, this.updateObj)
              }
            }
            this.testAlltags = this.alltags
            this.alltags = []
            // 去除-1元素
            for (var a = 0; a < this.testAlltags.length; a++) {
              console.log(this.testAlltags[a].id)
              if (this.testAlltags[a].id !== -1) {
                this.alltags.push(this.testAlltags[a])
              }
            }
          }
        }
      })
        .catch(error => {
          console.log(error)
        })
    },
    // 点击tag事件
    setToSelectedTags(tag) {
      this.updateObj.length=0
      if (this.selectedtags.length === 0) {
        this.selectedtags.push(tag)
        this.updateObj.id = tag.id
        this.updateObj.isSelected = 1
        setIsSelected(this.updateObj).then(res => {
          if (res.data.code === 0) {
            console.log('修改选中状态成功！')
          } else {
            console.log(res.data.message)
          }
        })
          .catch(error => {
            console.log(error)
          })
      } else {
        for (var i = 0; i < this.selectedtags.length; i++) {
          if (this.selectedtags.indexOf(tag) === -1) {
            this.selectedtags.push(tag)
            this.updateObj.id = tag.id
            this.updateObj.isSelected = 1
            setIsSelected(this.updateObj).then(res => {
              if (res.data.code === 0) {
                console.log('修改选中状态成功！')
              }
            }).catch(error => {
                console.log(error)
              })
          }
        }
      }
      // 去除待选元素
      for (var i = 0; i < this.alltags.length; i++) {
        if (tag.id === this.alltags[i].id) {
          this.alltags.splice(i,1)
        }
      }
    },
    // 关闭tag事件
    handleClose(selectedtag) {
      this.updateObj.length=0
      // 先判断isRequired字段
      if (selectedtag.isRequired === 1) {
        this.$message.error('该字段为必选项！')
        return
      }
      // 移除并且调用接口改变isSelected值为0
      this.selectedtags.splice(this.selectedtags.indexOf(selectedtag), 1)
      this.updateObj.id = selectedtag.id
      this.updateObj.isSelected = 0
      setIsSelected(this.updateObj).then(res => {
        if (res.data.code === 0) {
          console.log('取消选中状态成功！')
        } else {
          console.log(res.data.message)
        }
      })
      // 加入待选元素
      this.alltags.push(selectedtag)
    },
    // 确认下载模板
    downloadTemplate(selectedtags, fileType) {
      var headers1 = []
      for (var i = 0; i < selectedtags.length; i++) {
        headers1.push(selectedtags[i].propertyName)
      }
      var headers = headers1.join(',')
      window.location.href = process.env.BASE_API + `/customer/exportexcel?headers=` + headers + `&fileType=` + fileType
      // window.location.href = `http://localhost:9091/customer/exportexcel?headers=` + headers + `&fileType=` + fileType
      this.templateVisible = false
    },
    //
    submitUploadandimport() {
      if (this.importInfo.batchName === '') {
        this.$message.error('请输入批次名称！')
        return
      } else if (this.importInfo.source === '') {
        this.$message.error('请输入数据来源！')
        return
      } else if (this.importInfo.uploadFileName === '') {
        this.$message.error('请选择上传文件！')
        return
      }
      this.$refs.upload.submit()
    },
    // 上传的动作
    uploadFileInfo(fileList) {
      var formdata = new FormData()
      formdata.append('multipartFile', fileList.file)
      formdata.append('batchName', this.importInfo.batchName)
      formdata.append('source', this.importInfo.source)
      uploadFileandImport(formdata).then(response => {
        if (response.data.code === 0) {
          this.hasFalseinfo = false
          this.$message.success(response.data.message)
          this.importVisible = false
          this.req.pageNo = 1
          // 查询列表
          setTimeout(() => {
            this.searchCustomer(this.req)
          }, 3000)
        } else {
          this.$message.error(response.data.message)
          this.falseInfo = response.data.data
          this.hasFalseinfo = true
        }
      })
    },
    //
    handleUploadOnChange(file, fileList) {
      fileList.length = 0
      fileList.push(file)
      this.importInfo.uploadFileName = file.name
      var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      this.file = file
      const extension = testmsg === 'xls'
      const extension2 = testmsg === 'xlsx'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!extension && !extension2) {
        this.$message({
          message: '上传文件只能是 xls、xlsx格式!',
          type: 'warning'
        })
        fileList.length = 0
        this.importInfo.uploadFileName = ''
      }
      if (!isLt2M) {
        this.$message({
          message: '上传文件大小不能超过 10MB!',
          type: 'warning'
        })
        fileList.length = 0
        this.importInfo.uploadFileName = ''
      }
    },
    // 深度克隆
    clone: clone,
    // 重置查询框内容
    reset() {
      this.timeValue = []
      this.req = {
        isInternalAdmin: parseInt(localStorage.getItem('is_internal_admin')),
        batchId: '',
        customerId: '',
        customerName: '',
        idNo: '',
        modifierName: '',
        modifyTimeStart: '',
        modifyTimeEnd: '',
        pageNo: this.pageInfo.pageNo,
        pageSize: this.pageInfo.pageSize
      }
    },
    autoFill() {
      var reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
      const idNo = this.customerDetail.idNumber
      if (reg.test(idNo)) {
        this.customerDetail.sex = ''
        this.customerDetail.sex = Number(idNo.substring(idNo.length - 2, idNo.length - 1)) % 2 === 1 ? '0' : '1'
      }
    },
    autoFillReverse() {
      var reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
      const idNo = this.customerReverseDetail.idNumber
      if (reg.test(idNo)) {
        this.customerReverseDetail.sex = ''
        this.customerReverseDetail.sex = Number(idNo.substring(idNo.length - 2, idNo.length - 1)) % 2 === 1 ? '0' : '1'
      }
    },
    resetForm(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.validate = true
        } else {
          this.$message.error('请检查是否填写正确')
          this.validate = false
        }
      })
    },
    // 清空重置
    clearForm(obj, formName) {
      for (const key in obj) {
        if (key !== 'pageNo') {
          obj[key] = ''
        }
      }
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
    },
    // 时间戳转年月日时分秒
    formatDateTime: formatDateTime,
    // 手机号码加密
    hideMobile(mobileNo) {
      if (mobileNo) {
        return mobileNo.substring(0, 3) + '****' + mobileNo.substring(7, 11)
      }
    },
    // 身份证号码加密
    hideIdNumber(idNumber) {
      if (idNumber) {
        return idNumber.substring(0, 10) + '****' + idNumber.substring(14, 18)
      }
    },
    // 性别显示判断
    showSex(code) {
      return (code === 1 || code === '1') ? '女' : ((code === 0 || code === '0') ? '男' : '')
    },
    // 地址
    showAddress(customerAddresses) {
      const province = customerAddresses.province === null ? '' : customerAddresses.province
      const city = customerAddresses.city === null ? '' : customerAddresses.city
      const district = customerAddresses.district === null ? '' : customerAddresses.district
      const detail = customerAddresses.detail === null ? '' : customerAddresses.detail
      return province + city + district + detail
    },
    // 查询客户信息
    searchCustomer(req) {
      req.modifyTimeStart = this.timeValue ? this.timeValue[0] : null
      req.modifyTimeEnd = this.timeValue ? this.timeValue[1] : null
      queryByCustomer(req)
        .then(response => {
          if (response.data.code === 0) {
            this.tableData = response.data.data
            if (response.data.pageInfo) {
              this.pageInfo = response.data.pageInfo
              this.pageShow = true
            } else {
              this.pageShow = false
            }
          } else {
            this.$message(response.data.messages)
            this.tableData = response.data.data
            this.pageShow = false
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 删除客户信息
    delCustomer(customerId) {
      delCustomer(customerId)
        .then(response => {
          if (response.data.code === 0) {
            this.$message.success(response.data.message)
            this.req2.pageNo = 1
            this.pageInfo.pageNo = 1
            this.searchCustomer(this.req2)
          } else {
            this.$message.error(response.data.message)
          }
        })
        .catch(error => {
          console.log(error)
          this.$message('删除失败')
        })
    },
    // 修改前查询客户详情
    searchByCustomerId(customer, num) {
      // 基本信息
      this.customerReverseDetail.customer = customer
      // 把车辆 地址 联系信息都查出来
      queryByCustomerId(customer.customerId, num)
        .then(response => {
          if (response.data.code === 0) {
            // if (response.data.data.customerAddresses.length > 0) {
            this.customerReverseDetail.customerAddresses = response.data.data.customerAddresses
            // }
            // if (response.data.data.customerCars.length > 0) {
            this.customerReverseDetail.customerCars = response.data.data.customerCars
            // }
            // if (response.data.data.customerLinks.length > 0) {
            this.customerReverseDetail.customerLinks = response.data.data.customerLinks
            // }

            if (num === 1) {
              // 详情页
              this.detailVisible = true
            } else {
              this.editVisible = true
              this.getRegion1(this.customerReverseDetail, 0)
            }
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 修改客户信息
    editCustomer(customerReverseDetail) {
      customerReverseDetail.customer.customerSex = parseInt(customerReverseDetail.customer.customerSex)
      customerReverseDetail.customer.score = parseInt(customerReverseDetail.customer.score)
      // customerReverseDetail.customer.birthday = formatDateTime(customerReverseDetail.customer.birthday)
      console.log(customerReverseDetail)
      if (!this.validate) {
        return false
      }

      editCustomer(customerReverseDetail).then(response => {
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
          this.req.pageNo = 1
          this.searchCustomer(this.req)
          this.editVisible = false
        } else {
          this.$message.error(response.data.message)
        }
      })
        .catch(error => {
          console.log(error)
        })
    },
    // 新建客户
    addCustomer(customerDetail, addressDatas, linkDatas, carDatas) {
      if (!this.validate) {
        return false
      }
      if (linkDatas.length <= 0) {
        this.$message.error('请输入联系方式对应值！')
        return
      } else {
        if (linkDatas[0].linkValue === '') {
          this.$message.error('请输入联系方式对应值！')
          return
        }
        for (var i = 1; i < linkDatas.length; i++) {
          if (linkDatas[i].linkType === 0 && linkDatas[i].isUsually === linkDatas[0].isUsually) {
            this.$message.error('常用电话只能有一个！')
          }
        }
      }
      let map = {}
      map = customerDetail
      map.birthday = formatDateTime(map.birthday)
      map.addressDatas = addressDatas
      map.linkDatas = linkDatas
      map.carDatas = carDatas
      addCustomer(map).then(response => {
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
          this.req.pageNo = 1
          this.searchCustomer(this.req)
          this.addVisible = false
        } else {
          this.$message.error(response.data.message)
        }
      }).catch(error => {
        this.$message('新建失败')
        console.log(error)
      })
    },
    // 批量删除
    batchDelCustomer(batchDelReq) {
      console.log(batchDelReq.customerIds)
      if (batchDelReq.customerIds.length === 0) {
        this.$message.error('请选择需要删除的内容')
      } else {
        batchDelCustomer(batchDelReq.customerIds).then(response => {
          if (response.data.code === 0) {
            this.$message.success(response.data.message)
            this.req2.pageNo = 1
            this.pageInfo.pageNo = 1
            this.searchCustomer(this.req2)
          } else {
            this.$message('删除失败')
          }
        }).catch(error => {
          console.log(error)
          this.$message('删除失败')
        })
      }
    },
    // 表格多选框
    handleSelectionChange(val) {
      this.batchDelReq.customerIds.length = 0
      for (var i = 0; i < val.length; i++) {
        this.batchDelReq.customerIds.push(val[i].customerId)
      }
    },
    // 页面显示条数
    handleSizeChange(val) {
      this.req2.pageSize = val
      this.req.pageSize = val
      this.pageInfo.pageNo = 1
      this.req.pageNo = 1
      this.req2.pageNo = 1
      this.searchCustomer(this.req2)
    },
    // 分页翻页功能
    handleCurrentChange(val) {
      this.req2.pageNo = val
      this.searchCustomer(this.req2)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.table-container{
  .form-container{
    box-shadow:none;
    border:1px solid #EBEEF5;
    border-left: solid 4px #57AFFF;
  }
}

.inputWidth {
  width:55%;
}
.inputWidth1 {
  width:46%;
}
.showaddTool {
  float: right;
  margin: 0px 65%;
  height: 20px;
  cursor: pointer;
}
</style>
