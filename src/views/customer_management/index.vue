<template>
  <div class="container">
    <el-row margin-top:>
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
        </el-form-item><br/>
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
          <el-button type="danger" @click="reset();req2=clone(req)">重置</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-col>
        <el-table
          :data="tableData"
          highlight-current-row
          border
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
      </el-col>
    </el-row>
    <el-row style="margin-top:5px;">
        <el-button type="success" size="small" @click="resetArrays();addVisible=true;clearForm(customerDetail,'customerDetail');">新建</el-button>
        <el-button type="danger" size="small" @click="batchDelVisible=true">批量删除</el-button>
        <el-button type="success" size="small" @click="importVisible=true;importInfo.uploadFileName='';importInfo.batchName=''">导入客户</el-button>
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
    <el-dialog
      align:left
      width="40%"
      title="导入客户"
      :visible.sync="importVisible"
      append-to-body>
      <el-form label-width="100px">
        <el-form-item label="批次名称：" class="inputWidth">
          <el-input size="small" v-model="importInfo.batchName"></el-input>
        </el-form-item>
        <el-form-item label="上传文件：" class="inputWidth">
          <el-input size="small" v-model="importInfo.uploadFileName" disabled></el-input>
        </el-form-item>
      </el-form>
      <div style="margin-left:60%;margin-top:-56px">
        <el-upload
          ref="upload"
          :action="uploadUrl"   
          :headers="{'Authorization':'Bearer ' +token}"
          :http-request="uploadFileInfo"
          :on-change="handleUploadOnChange"
          :show-file-list="false"
          :auto-upload="false">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        </el-upload>
      </div>
      <div style="margin-left:77%;margin-top:-32px">
        <el-button type="primary" @click="templateVisible=true;fileType='xls';getTags()">下载模板</el-button>
      </div>
      <div style="marin-left:30%">
        <span style="font-size:12px;color:red">提示：文件格式支持xls、xlsx，文件大小限制为10M</span>
      </div>
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
      <div slot="footer" style="text-align: right;">
        <el-button type="primary" @click="submitUploadandimport()">确认导入</el-button>
        <el-button @click="importVisible = false">取消</el-button>
        <el-button type="primary" @click="">下一步</el-button>
      </div>
    </el-dialog>

    <el-dialog
      align:left
      width="30%"
      title="定制导入模板"
      :visible.sync="templateVisible"
      append-to-body>
      <el-form label-width="100px">
        <el-form-item label="支持字段：">
          <el-tag :key="tag.propertyCode" v-for="tag in alltags" type="primary" @click.native="setToSelectedTags(tag)" size="medium" style="cursor:pointer;">
            {{tag.propertyName}}
          </el-tag>
          <span v-if="alltags.length === 0">暂无支持字段，请先添加</span>
        </el-form-item>
        <div style="margin-left:15%;">
          <span style="font-size:12px;color:red" v-if="alltags.length > 0">提示：点击字段名称添加到已选字段，已选字段重复点击无效</span>
        </div><br/>
        <el-form-item label="已选字段：">
          <el-tag :key="selectedtag.propertyCode" v-for="selectedtag in selectedtags" type="success" closable @close="handleClose(selectedtag)" size="medium">
            {{selectedtag.propertyName}}
          </el-tag>
          <span v-if="selectedtags.length === 0">暂无已选字段</span>
        </el-form-item><br/>
        <el-form-item label="文件格式：">
          <el-radio v-model="fileType" label="xls">xls</el-radio>
          <el-radio v-model="fileType" label="xlsx">xlsx</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: right;">
        <el-button type="primary" @click="downloadTemplate(selectedtags,fileType)">确认</el-button>
        <el-button @click="templateVisible = false">取消</el-button>
      </div>
    </el-dialog>
    
    <el-dialog
      align:left
      width="60%"
      title="修改客户"
      :visible.sync="editVisible"
      append-to-body>
      <div style="height:600px;overflow-y:auto;">
        <el-form :rules="rule" :model="customerReverseDetail.customer" ref="customerDetail" label-width="100px">
          <el-form-item label="客户姓名" prop="customerName" style="width:50%">
            <el-input v-model="customerReverseDetail.customer.customerName" size="small" placeholder="上限50字符" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="客户性别" prop="customerSex">
            <el-radio-group v-model="customerReverseDetail.customer.customerSex" size="small">
              <el-radio-button label='0' border>男</el-radio-button>
              <el-radio-button label='1' border>女</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="身份证" prop="idNo"  style="width:50%">
            <el-input v-model="customerReverseDetail.customer.idNo" size="small" placeholder="上限50字符" maxlength="50" @change="autoFill()"></el-input>
          </el-form-item>
          <el-form-item label="出生日期" prop="birthday">
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
          <el-form-item label="联系信息">
            <el-table border empty-text="请添加数据" :data="customerReverseDetail.customerLinks">
              <el-table-column align="center" label="联系方式">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.linkType" placeholder="联系方式" clearable>
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
                    :inactive-value=0>
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
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('customerDetail');editCustomer(customerReverseDetail)">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog append-to-body :visible.sync="deleteVisible" title="操作提示" width="30%">
        <span style="font-size:20px;">确认要删除该行吗？</span>
        <div slot="footer" class="dialog-footer" style="text-align: right;">
          <el-button @click="deleteVisible = false">取 消</el-button>
          <el-button type="primary" @click="deleteSth(deleteData,deleteType);">确 定</el-button>
        </div>
      </el-dialog>

    <el-dialog
      align:left
      width="30%"
      title="客户信息详情"
      :visible.sync="detailVisible"
      append-to-body>
      <div style="height:500px;overflow-y:auto;">
        <el-form label-width="100px">
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
        <el-button @click="detailVisible = false">返 回</el-button>
      </div>
    </el-dialog>
    <el-dialog
      align:left
      width="60%"
      title="新建客户"
      :visible.sync="addVisible"
      append-to-body>
      <div style="height:600px;overflow-y:auto;">
        <el-form :rules="rule" :model="customerDetail" ref="customerDetail" label-width="100px">
          <el-form-item label="客户姓名" prop="customerName" style="width:50%">
            <el-input v-model="customerDetail.customerName" size="small" placeholder="上限50字符" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="客户性别" prop="customerSex">
            <el-radio-group v-model="customerDetail.customerSex" size="small">
              <el-radio-button label='0' border>男</el-radio-button>
              <el-radio-button label='1' border>女</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="身份证" prop="idNo"  style="width:50%">
            <el-input v-model="customerDetail.idNo" size="small" placeholder="上限50字符" maxlength="50" @change="autoFill()"></el-input>
          </el-form-item>
          <el-form-item label="出生日期" prop="birthday">
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
          <el-form-item label="联系信息">
            <el-table border empty-text="请添加数据" :data="linkDatas">
              <el-table-column align="center" label="联系方式">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.linkType" placeholder="联系方式" clearable>
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
                    :inactive-value=0>
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
      </div>
        <div slot="footer" style="text-align: right;">
          <el-button type="danger" @click="resetForm('customerDetail');resetArrays()">重 置</el-button>
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('customerDetail');addCustomer(customerDetail,addressDatas,linkDatas,carDatas)">确 定</el-button>
        </div>
      </el-dialog>
    <el-dialog
      width="30%"
      title="操作提示"
      :visible.sync="delVisible"
      append-to-body>
    <span style="font-size:20px;">确定删除此客户？</span>
    <div slot="footer" class="dialog-footer" style="text-align: right;">
      <el-button @click="delVisible = false">取 消</el-button>
      <el-button type="primary" @click="delVisible = false;delCustomer(delReq);">确 定</el-button>
    </div>
  </el-dialog>
  <el-dialog
    width="30%"
    title="批量删除"
    :visible.sync="batchDelVisible"
    append-to-body>
  <span style="font-size:20px;">确定删除选定内容？</span>
  <div slot="footer" class="dialog-footer" style="text-align: right;">
    <el-button @click="batchDelVisible = false">取 消</el-button>
    <el-button type="primary" @click="batchDelVisible = false;batchDelCustomer(batchDelReq);">确 定</el-button>
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
  deleteCar
} from '@/api/customerManagement'
import { formatDateTime, clone } from '@/utils/tools'

export default {
  name: 'customer_management',
  data() {
    return {
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
        uploadFileName: ''
      },
      templateVisible: false, // 下载模板对话框显示隐藏
      alltags: [], // 模板支持的所有字段
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
    this.searchCustomer(this.req)
  },
  methods: {
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
      this.linkDatas.splice(data.$index, 1)
    },
    removeLinkInfo1(data) {
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
                  throw new Error(error)
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
                throw new Error(error)
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
        throw new Error(error)
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
                  throw new Error(error)
                })
              }
            }).catch(error => {
              throw new Error(error)
            })
          }
        }).catch(error => {
          throw new Error(error)
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
              }
            }
            for (var j = 0; j < this.alltags.length; j++) {
              if (this.alltags[j].isSelected === 1) {
                if (this.selectedtags.indexOf(this.alltags[j]) === -1) {
                  this.selectedtags.push(this.alltags[j])
                }
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
      if (this.selectedtags.length === 0) {
        this.selectedtags.push(tag)
        tag.isSelected = 1
        setIsSelected(tag).then(res => {
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
            tag.isSelected = 1
            setIsSelected(tag).then(res => {
              if (res.data.code === 0) {
                console.log('修改选中状态成功！')
              }
            })
              .catch(error => {
                console.log(error)
              })
          }
        }
      }
    },
    // 关闭tag事件
    handleClose(selectedtag) {
      // 先判断isRequired字段
      if (selectedtag.isRequired === 1) {
        this.$message.error('该字段为必选项！')
        return
      }
      // 移除并且调用接口改变isSelected值为0
      this.selectedtags.splice(this.selectedtags.indexOf(selectedtag), 1)
      selectedtag.isSelected = 0
      setIsSelected(selectedtag).then(res => {
        if (res.data.code === 0) {
          console.log('取消选中状态成功！')
        } else {
          console.log(res.data.message)
        }
      })
    },
    // 确认下载模板
    downloadTemplate(selectedtags, fileType) {
      var headers1 = []
      for (var i = 0; i < selectedtags.length; i++) {
        headers1.push(selectedtags[i].propertyName)
      }
      var headers = headers1.join(',')
      window.location.href = `/api/v1/customer/exportexcel?headers=` + headers + `&fileType=` + fileType
      // window.location.href = `http://localhost:9091/customer/exportexcel?headers=` + headers + `&fileType=` + fileType
      this.templateVisible = false
    },
    //
    submitUploadandimport() {
      this.$refs.upload.submit()
    },
    // 上传的动作
    uploadFileInfo(fileList) {
      var formdata = new FormData()
      formdata.append('multipartFile', fileList.file)
      formdata.append('batchName', this.importInfo.batchName)
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
<style rel="stylesheet/scss" lang="scss">
.el-table thead {
  color: #000 !important;
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-table {
  border: 1px solid #ecebe9;
  thead th .cell {
    color: #000;
  }
}
.el-form-item {
  margin-bottom: 20px;
}
// el-dialog .el-form-item{
//   margin-bottom:50px;
// }
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
