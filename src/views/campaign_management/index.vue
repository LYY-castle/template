<template>
  <div class="container campaignManagement">
    <el-row margin-top:>
      <el-form :inline="true" size="small" :model="req" ref="searchForm">
        <el-form-item prop="campaignId" label="活动编号：">
          <el-input v-model="req.campaignId" placeholder="活动名称"></el-input>
        </el-form-item>
        <el-form-item prop="campaignName" label="活动名称：">
          <el-input v-model="req.campaignName" placeholder="活动名称"></el-input>
        </el-form-item>
        <el-form-item label="活动状态：" prop="status">
          <el-radio-group v-model="req.status" size="small">
            <el-radio label='0'>有效</el-radio>
            <el-radio label='1'>无效</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="modifierName" label="操作人：">
          <el-input v-model="req.modifierName" placeholder="操作人"></el-input>
        </el-form-item>
        <el-form-item label="操作时间：">
          <el-date-picker
              v-model="timeValue"
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="req.pageNo=1;findCampaignByConditions(req);req2=clone(req)" icon="el-icon-search">查询</el-button>
          <el-button type="danger" @click="timeValue=[],resetReq('searchForm');">重置</el-button>
        </el-form-item>
      </el-form>
    </el-row>
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
              <div>{{scope.$index+(req2.pageNo-1)*req2.pageSize+1}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="活动编号"
             width="105">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="detailVisible=true;getDeptByCampaignId(scope.row.campaignId);getMarksByCampaignId(scope.row.campaignId);getCampaignById(scope.row.campaignId);">{{scope.row.campaignId}}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="campaignName"
            label="活动名称">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="right">
                <p>{{ scope.row.campaignName }}</p>
                <div slot="reference">
                  {{ scope.row.campaignName }}
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="95"
            label="名单有效期">
            <template slot-scope="scope">
              <div>{{scope.row.listExpiryDate+'天'}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="canContactNum"
            label="拨打次数">
            <template slot-scope="scope">
              <div>{{scope.row.canContactNum==null?'':(scope.row.canContactNum+'次')}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="products"
            label="产品">
            <template slot-scope="scope">
             <span>{{(getProductName(scope.row.products)).join(",")}}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="summaryId"
            label="小结">
            <template slot-scope="scope">
             <span>{{getSummaryName(scope.row.summaryId)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="departId"
            label="活动部门">
            <template slot-scope="scope">
             <span>{{getDepartName(scope.row.departId)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="modifierName"
            label="操作人">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="right">
                <p>{{ scope.row.modifierName }}</p>
                <div slot="reference">
                  {{ scope.row.modifierName }}
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="有效性">
            <template slot-scope="scope">
              <div>{{(scope.row.status == 0) ? '有效':'无效'}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="modifyTime"
            width="155"
            label="操作时间">
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="200">1
          <template slot-scope="scope">
            <el-button @click="editVisible=true;delReq.campaignId=scope.row.campaignId;getDeptByCampaignId(scope.row.campaignId);getMarksByCampaignId(scope.row.campaignId);getCampaignById(scope.row.campaignId);" type="text" size="small">修改</el-button>
            <el-button @click="delVisible=true;delReq.campaignId=scope.row.campaignId" type="text" size="small">删除</el-button>
            <el-button @click="changeVisible=true;delReq.campaignId=scope.row.campaignId;delReq.status=scope.row.status" type="text" size="small">{{scope.row.status==='0'?'禁用':'启用'}}</el-button>
            <div>
            <el-button @click="campaignName=scope.row.campaignName;nameListExclude.campaignId=scope.row.campaignId;nameLists.campaignId=scope.row.campaignId;addList=true;nameLists.pageSize=10;nameListExclude.pageSize=10;nameListExclude.pageNo = 1;nameLists.pageNo = 1;getNameLists(nameLists);getNameListExclude(nameListExclude)" type="text" size="small">添加名单</el-button>
            <el-button @click="campaignName=scope.row.campaignName;nameLists.campaignId=scope.row.campaignId;removeVisible=true;nameLists.pageNo = 1;getNameLists(nameLists)" type="text" size="small">移除名单</el-button>
            </div>
          </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row style="margin-top:5px;">
        <el-button type="success" size="small" @click="addVisible=true;clearForm(campaignDetail,'campaignDetail')">添加</el-button>
        <el-button type="danger" size="small" @click="batchDelVisible=true">批量删除</el-button>
        <el-pagination
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
      width="30%"
      title="活动信息修改"
      :visible.sync="editVisible"
      append-to-body>
      <el-form label-width="100px" :model="campaignDetail" ref="editCampaign" :rules="rule">
        <el-form-item label="活动名称" prop="campaignName">
          <el-input v-model="campaignDetail.campaignName" size="small"></el-input>
        </el-form-item>
        <el-form-item label="活动类型" prop="campaignTypeCode">
          <el-select v-model="campaignDetail.campaignTypeCode" placeholder="请选择产品" style="width: 100%;">
            <el-option
                v-for="item in campaignTypes"
                :key="item.code"
                :label="item.name"
                :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品" prop="products" v-if="!(campaignDetail.campaignTypeCode=='RECRUIT')">
          <el-select v-model="campaignDetail.products" multiple placeholder="请选择产品" style="width: 100%;">
            <el-option
                v-for="item in productData"
                :key="item.productId"
                :label="item.productName"
                :value="item.productId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名单有效期" prop="listExpiryDate">
          <el-input v-model="campaignDetail.listExpiryDate" size="small" placeholder="单位：天"></el-input>
        </el-form-item>
        <el-form-item label="拨打次数" prop="canContactNum">
          <el-input v-model="campaignDetail.canContactNum" size="small" placeholder="单位：次"></el-input>
        </el-form-item>
        <el-form-item label="活动状态:" prop="status">
          <el-radio-group v-model="campaignDetail.status" size="small">
            <el-radio label='0' border>有效</el-radio>
            <el-radio label='1' border>无效</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动组织" prop="departId">
          <el-select v-model="campaignDetail.departId" placeholder="请选择活动组织" style="width: 100%;">
          <el-option
              v-for="item in deptData"
              :key="item.id"
              :label="item.departName"
              :value="item.id">
          </el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="话后小结" prop="summaryId">
          <el-select v-model="campaignDetail.summaryId" placeholder="请选择小结" style="width: 100%;">
            <el-option
                v-for="item in summaryData"
                :key="item.summaryId"
                :label="item.summaryName"
                :value="item.summaryId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="质检组织">
          <span v-for="item in qcdeptData" v-if="qcdeptData.length!==0">{{(qcdeptData.length===0)?'无':item+' , '}}</span>
          <span v-if="qcdeptData.length===0">无</span>
        </el-form-item>
        <el-form-item label="评分表">
          <span v-for="item in marksData" v-if="marksData.length!==0">{{(marksData.length===0)?'无':item.gradeName+' , '}}</span>
          <span v-if="marksData.length===0">无</span>
        </el-form-item>
        <el-form-item label="活动备注" prop="description">
        <el-input v-model="campaignDetail.description" size="small"></el-input>
      </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: right;">
        <el-button type="danger" @click="getCampaignById(delReq.campaignId)">重 置</el-button>
        <el-button @click="editVisible = false;">取 消</el-button>
        <el-button type="primary" @click="submitForm('editCampaign');editCampaign(campaignDetail)">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      align:left
      width="30%"
      title="活动信息详情"
      :visible.sync="detailVisible"
      append-to-body>
      <el-form label-width="100px" >
        <el-form-item label="活动名称">
          <span>{{campaignDetail.campaignName}}</span>
        </el-form-item>
        <el-form-item label="活动类型">
          <span>{{campaignDetail.campaignTypeInfo.name}}</span>
        </el-form-item>
        <el-form-item label="产品" v-if="!(campaignDetail.campaignTypeInfo.code=='RECRUIT')">
          <span v-for="item in productName">{{item+' , '}}</span>
        </el-form-item>
        <el-form-item label="名单有效期">
          <span>{{campaignDetail.listExpiryDate+'天'}}</span>
        </el-form-item>
        <el-form-item label="拨打次数">
          <span>{{campaignDetail.canContactNum==null?'':(campaignDetail.canContactNum+'次')}}</span>
        </el-form-item>
        <el-form-item label="活动状态">
          <span>{{campaignDetail.status==='1'?'无效':'有效'}}</span>
        </el-form-item>
        <el-form-item label="活动组织">
          <span>{{departName}}</span>
        </el-form-item>
        <el-form-item label="话后小结">
          <span>{{summaryName}}</span>
        </el-form-item>
        <el-form-item label="质检组织">
          <span v-for="item in qcdeptData" v-if="qcdeptData.length!==0">{{(qcdeptData.length===0)?'无':item+' , '}}</span>
          <span v-if="qcdeptData.length===0">无</span>
        </el-form-item>
        <el-form-item label="评分表">
          <span v-for="item in marksData" v-if="marksData.length!==0">{{(marksData.length===0)?'无':item.gradeName+' , '}}</span>
          <span v-if="marksData.length===0">无</span>
        </el-form-item>
        <el-form-item label="活动备注">
          <span>{{campaignDetail.description}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: right;">
        <el-button @click="detailVisible = false">返 回</el-button>
      </div>
    </el-dialog>
    <el-dialog
      align:left
      width="30%"
      title="添加活动"
      :visible.sync="addVisible"
      append-to-body>
      <el-form :rules="rule" :model="campaignDetail" ref="campaignDetail" label-width="100px">
        <el-form-item label="活动名称" prop="campaignName">
          <el-input v-model="campaignDetail.campaignName" size="small"></el-input>
        </el-form-item>
        <el-form-item label="活动类型" prop="campaignTypeCode">
          <el-select v-model="campaignDetail.campaignTypeCode" placeholder="请选择产品" style="width: 100%;">
            <el-option
                v-for="item in campaignTypes"
                :key="item.code"
                :label="item.name"
                :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品" prop="products" v-if="!(campaignDetail.campaignTypeCode=='RECRUIT')">
          <el-select v-model="campaignDetail.products" multiple placeholder="请选择产品" style="width: 100%;">
            <el-option
                v-for="item in productData"
                :key="item.productId"
                :label="item.productName"
                :value="item.productId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名单有效期" prop="listExpiryDate">
          <el-input v-model="campaignDetail.listExpiryDate" size="small" placeholder="单位：天"></el-input>
        </el-form-item>
        <el-form-item label="拨打次数" prop="listExpiryDate">
          <el-input v-model="campaignDetail.canContactNum" size="small" placeholder="单位：次"></el-input>
        </el-form-item>
        <el-form-item label="活动状态" prop="status">
          <el-radio-group v-model="campaignDetail.status" size="small">
            <el-radio label='0' border>有效</el-radio>
            <el-radio label='1' border>无效</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动组织" prop="departId">
        <el-select v-model="campaignDetail.departId" placeholder="请选择活动组织" style="width: 100%;">
          <el-option
              v-for="item in deptData"
              :key="item.id"
              :label="item.departName"
              :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="话后小结" prop="summaryId">
        <el-select v-model="campaignDetail.summaryId" placeholder="请选择小结" style="width: 100%;">
          <el-option
              v-for="item in summaryData"
              :key="item.summaryId"
              :label="item.summaryName"
              :value="item.summaryId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动备注" prop="description">
        <el-input v-model="campaignDetail.description" size="small"></el-input>
      </el-form-item>
      </el-form>
        <div slot="footer" style="text-align: right;">
          <el-button type="danger" @click="resetForm('campaignDetail');">重 置</el-button>
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('campaignDetail');addCampaign(campaignDetail);">确 定</el-button>
        </div>
    </el-dialog>
    <el-dialog
      width="30%"
      title="删除"
      :visible.sync="delVisible"
      append-to-body>
      <span style="font-size:20px;">确定删除此内容？</span>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="delVisible = false;delCampaign(delReq);">确 定</el-button>
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
        <el-button type="primary" @click="batchDelVisible = false;batchDelCampaigns(batchDelReq);">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="30%"
      :visible.sync="changeVisible"
      append-to-body>
      <span style="font-size:20px;">确定切换活动状态吗？</span>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button @click="changeVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeVisible = false;changeStatus(delReq);">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      top="5vh"
      width="90%"
      :visible.sync="addList"
      append-to-body>
      <div slot="title" style="text-align: center;">
        <el-button @click="addList = false;" style="float:left;" icon="el-icon-arrow-left">返 回</el-button>
        <h3 style="display:inline;">活动名称：{{campaignName}}</h3>
      </div>
      <el-row>
        <el-form :inline="true" size="small">
          <el-form-item>
            <el-input v-model="nameListExclude.listId" placeholder="名单编号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="nameListExclude.listName" placeholder="名单名称"></el-input>
          </el-form-item>
          <el-form-item label="操作时间：">
            <el-date-picker
                v-model="nameListExclude.startCreateTime"
                type="datetime"
                placeholder="开始日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                default-time="00:00:00">
            </el-date-picker>
            到
            <el-date-picker
                v-model="nameListExclude.endCreateTime"
                type="datetime"
                placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                default-time="00:00:00">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="nameListExclude.pageNo=1;nameLists.pageNo=1;getNameLists(nameLists);getNameListExclude(nameListExclude)" icon="el-icon-search">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <el-row>
          <h2 style="display:inline">可选名单列表</h2>
        </el-row>
        <el-table
          :data="nameListExcludeTablel"
          border
          @selection-change="nameListSelectionChange">
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
              <div>{{scope.$index+(nameListExcludePageinfo.pageNo-1)*nameListExcludePageinfo.pageSize+1}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="listId"
            label="名单编号">
          </el-table-column>
          <el-table-column
            align="center"
            prop="listName"
            label="名单名称">
          </el-table-column>
          <el-table-column
            align="center"
            prop="listnameNumber"
            label="名单数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="modifierName"
            label="操作人">
          </el-table-column>
          <el-table-column
            align="center"
            prop="modifierTime"
            label="操作时间">
            <template
              slot-scope="scope">
              <div>{{formatDateTime(scope.row.modifierTime)}}</div>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <el-pagination
          v-if="pageShow2"
          background
          @size-change="nameListExcludeSizeChange"
          @current-change="nameListExcludeChange"
          :current-page='nameListExcludePageinfo.pageNo'
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size='nameListExclude.pageSize'
          layout="total, sizes, prev, pager, next, jumper "
          :total='nameListExcludePageinfo.totalCount' style="text-align: right;float:right;">
        </el-pagination>
      </el-row>
      <el-row>
        <el-row style="margin-top:1%;">
          <h2 style="display:inline" >已选名单列表</h2>
        </el-row>
        <el-table
          :data="nameListsTable"
          border>
          <el-table-column
            align="center"
            label="序号"
            width="55">
            <template
              slot-scope="scope">
              <div>{{scope.$index+(nameListsPageinfo.pageNo-1)*nameListsPageinfo.pageSize+1}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="listId"
            label="名单编号">
          </el-table-column>
          <el-table-column
            align="center"
            prop="listName"
            label="名单名称">
          </el-table-column>
          <el-table-column
            align="center"
            prop="listnameNumber"
            label="名单数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="modifierName"
            label="操作人">
          </el-table-column>
          <el-table-column
            align="center"
            prop="modifierTime"
            label="操作时间">
            <template
              slot-scope="scope">
              <div>{{formatDateTime(scope.row.modifierTime)}}</div>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <el-pagination
          v-if="pageShow3"
          background
          @size-change="nameListSizeChange"
          @current-change="nameListChange"
          :current-page='nameListsPageinfo.pageNo'
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size='nameLists.pageSize'
          layout="total, sizes, prev, pager, next, jumper "
          :total='nameListsPageinfo.totalCount' style="text-align: right;float:right;">
        </el-pagination>
      </el-row>
      <div slot="footer" style="text-align: right;">
        <el-button type="success" @click="addCampaignAndList(addNameList);">添 加</el-button>
        <el-button type="danger" @click="addList = false;">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="30%"
      title="删除"
      :visible.sync="delVisible"
      append-to-body>
      <span style="font-size:20px;">确定删除此内容？</span>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="delVisible = false;delCampaign(delReq);">确 定</el-button>
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
        <el-button type="primary" @click="batchDelVisible = false;batchDelCampaigns(batchDelReq);">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 活动移除名单 -->
     <el-dialog
      top="5vh"
      width="90%"
      :visible.sync="removeVisible"
      append-to-body>
      <div slot="title" style="text-align: center;">
        <el-button @click="removeVisible = false;" style="float:left;" icon="el-icon-arrow-left">返 回</el-button>
        <h3 style="display:inline;">活动名称：{{campaignName}}</h3>
      </div>
      <el-row>
        <el-row>
          <h2 style="display:inline">名单列表</h2>
          <el-pagination
            background
            @current-change="nameListChange"
            :current-page=nameListsPageinfo.pageNo
            :page-sizes="[10, 20, 30, 50]"
            :page-size=nameListsPageinfo.pageSize
            layout="total, prev, pager, next, jumper"
            :total=nameListsPageinfo.totalCount style="text-align: right;float:right;">
          </el-pagination>
        </el-row>
        <el-table
          :data="nameListsTable"
          border
          @selection-change="removeListSelectionChange">
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
              <div>{{scope.$index+(nameListsPageinfo.pageNo-1)*10+1}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="listId"
            label="名单编号">
          </el-table-column>
          <el-table-column
            align="center"
            prop="listName"
            label="名单名称">
          </el-table-column>
          <el-table-column
            align="center"
            prop="listnameNumber"
            label="名单数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="modifierName"
            label="操作人">
          </el-table-column>
          <el-table-column
            align="center"
            prop="modifierTime"
            label="操作时间">
            <template
              slot-scope="scope">
              <div>{{formatDateTime(scope.row.modifierTime)}}</div>
            </template>
          </el-table-column>
           <el-table-column
            align="center"
            label="操作"
            width="200">1
          <template slot-scope="scope">
            <el-button @click="removeListVisible=true;saveRemoveListId(scope.row.listId)" type="text" size="small">移除名单</el-button>
          </template>
          </el-table-column>
        </el-table>
      </el-row>
      <div slot="footer" style="text-align: right;">
        <el-button type="success" @click="batchListVisible=true;">批量移除名单</el-button>
        <el-button type="danger" @click="removeVisible = false;">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="30%"
      title="批量移除名单"
      :visible.sync="batchListVisible"
      append-to-body>
      <span style="font-size:20px;">确定移除选定内容？</span>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button @click="batchListVisible = false">取 消</el-button>
        <el-button type="primary" @click="batchListVisible = false;removeList();">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="30%"
      title="移除名单"
      :visible.sync="removeListVisible"
      append-to-body>
      <span style="font-size:20px;">确定移除吗？</span>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button @click="removeListVisible = false">取 消</el-button>
        <el-button type="primary" @click="removeListVisible = false;removeList();">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import {
  findAllProduct,
  queryDepts,
  findAllNodules,
  findMarksByCampaignId,
  findDeptByCampaignId,
  modifyCampaign,
  changeCampaignStatus,
  findAllCampaignTypes
} from '@/api/campaign'
import {
  queryCampaign,
  addCampaign,
  findCampaignById,
  delCampaigns,
  delCampaignById,
  showNameListsById,
  findNameListExcludeById,
  assignCampaignAndList,
  removeList
} from '@/api/campaign_management'
import { formatDateTime, clone } from '@/utils/tools'

export default {
  name: 'campaignManagement',
  data() {
    // 有效时间不能超过9999天
    var checkExpiryDate = (eule, value, callback) => {
      if (value > 9999) {
        return callback(new Error('有效时间不能超过9999天'))
      }
      if (!/^\d+$/.test(value)) {
        return callback(new Error('请输入数字'))
      } else {
        callback()
      }
    }
    var checkCanContactNum = (eule, value, callback) => {
      if (!/^\d+$/.test(value)) {
        return callback(new Error('请输入数字'))
      } else {
        callback()
      }
    }
    return {
      rule: {
        campaignName: [
          { required: true, message: '请输入活动名称', trigger: 'change' }
        ],
        campaignTypeCode: [
          { required: true, message: '请选择活动类型', trigger: 'change' }
        ],
        productIds: [
          { required: true, message: '请选择产品', trigger: 'change' }
        ],
        products: [
          { required: true, message: '请选择产品', trigger: 'change' }
        ],
        listExpiryDate: [
          { required: true, message: '请输入名单有效期', trigger: 'change' },
          { validator: checkExpiryDate, trigger: 'change' }
        ],
        canContactNum: [
          { required: true, message: '请输入拨打次数', trigger: 'change' },
          { validator: checkCanContactNum, trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择活动状态', trigger: 'change' }
        ],
        departId: [
          { required: true, message: '请选择活动组织', trigger: 'change' }
        ],
        summaryId: [
          { required: true, message: '请选择活动组织', trigger: 'change' }
        ]
      },
      timeValue: [],
      removeListVisible: false, // 单个移除
      batchListVisible: false, // 批量移除名单
      removeLists: [], // 批量移除ids
      removeVisible: false, // 移除名单
      detailVisible: false,
      delVisible: false, // 删除对话框显示隐藏
      editVisible: false, // 修改对话框显示隐藏
      addVisible: false, // 添加对话框显示隐藏
      batchDelVisible: false, // 批量删除对话框显示隐藏
      changeVisible: false, // 切换个状态对话框显示隐藏
      addList: false,
      tableData: [], // 表格数据
      validate: true, // 验证不通过阻止发请求
      pageShow: false, // 分页显示隐藏
      pageShow2: false, // 分页显示隐藏
      pageShow3: false, // 分页显示隐藏
      // nameListExcludePage: false,//可选名单分页
      // nameListPage: false,//已选名单分页
      productData: [], // 产品
      deptData: [], // 活动组织
      qcdeptData: [], // 质检组织
      summaryData: [], // 小结
      campaignTypes: [], // 活动类型
      marksData: [], // 评分表
      productName: [], // 产品名称
      departName: '', // 活动组织名称
      summaryName: '', // 小结名称
      campaignName: '', // 活动名称
      delReq: {
        campaignId: '',
        productIds: []
      },
      batchDelReq: {
        campaignIds: []
      },
      // 查询 发送请求参数
      req: {
        campaignId: '',
        campaignName: '',
        status: '0',
        modifierName: '',
        modifyTimeStart: '',
        modifyTimeEnd: '',
        pageSize: 10,
        pageNo: 1
      },
      req2: {
        campaignId: '',
        campaignName: '',
        status: '0',
        modifierName: '',
        modifyTimeStart: '',
        modifyTimeEnd: '',
        pageSize: 10,
        pageNo: 1
      },
      campaignDetail: {
        campaignTypeCode: '',
        campaignTypeInfo: {},
        productIds: [],
        products: [],
        deptId: [],
        summaryId: [],
        canContactNum: '',
        campaignName: '',
        listExpiryDate: '',
        status: '0',
        departId: '',
        description: ''
      }, // 活动详情
      // 分页数据
      pageInfo: {},
      // 添加名单
      nameLists: {
        campaignId: '',
        pageSize: 10,
        pageNo: 1
      },
      nameListsTable: [],
      nameListsPageinfo: {
        pageNo: 1,
        pageSize: 10,
        totalCount: 0
      },
      nameListExclude: {
        listId: '',
        listName: '',
        startCreateTime: '',
        endCreateTime: '',
        pageSize: 10,
        pageNo: 1,
        campaignId: ''
      },
      nameListExcludeTablel: [],
      nameListExcludePageinfo: {},
      addNameList: {
        campaignId: '',
        listIds: []
      }
    }
  },
  mounted() {
    this.findCampaignByConditions(this.req)
    this.getAllProduct()
    this.getDepts()
    this.getAllNodules()
    this.getAllCampaignTypes()
  },
  methods: {
    // 深度克隆
    clone: clone,
    // 时间戳转年月日时分秒
    formatDateTime: formatDateTime,
    clearForm(obj, formName) {
      for (var key in obj) {
        if (key === 'products' || key === 'productIds') {
          obj[key] = []
        }
      }
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
    },
    reset() {
      this.req = {
        campaignId: '',
        campaignName: '',
        status: '0',
        modifierName: '',
        modifyTimeStart: '',
        modifyTimeEnd: '',
        pageSize: 10,
        pageNo: 1
      }
      this.req2 = {
        campaignId: '',
        campaignName: '',
        status: '0',
        modifierName: '',
        modifyTimeStart: '',
        modifyTimeEnd: '',
        pageSize: 10,
        pageNo: 1
      }
    },
    resetReq() {
      this.req = {
        campaignId: '',
        campaignName: '',
        status: '0',
        modifierName: '',
        modifyTimeStart: '',
        modifyTimeEnd: '',
        pageSize: 10,
        pageNo: 1
      }
    },
    resetForm(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
    },
    removeList() {
      if (this.removeLists.length <= 0) {
        this.$message.error('请选择要移除的')
        return
      }
      removeList(this.nameLists.campaignId, this.removeLists).then(response => {
        if (response.data.code === 0) {
          this.$message.success('操作成功')
          this.removeVisible = false
        } else {
          this.$message.error(response.data.message)
        }
      })
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
    // 查询活动信息
    findCampaignByConditions(req) {
      if (this.timeValue !== null && typeof (this.timeValue) !== undefined && this.timeValue.length > 0) {
        req.modifyTimeStart = this.timeValue[0]
        req.modifyTimeEnd = this.timeValue[1]
      }
      queryCampaign(req)
        .then(response => {
          if (response.data.code === 0) {
            if (response.data.data) {
              this.tableData = response.data.data
              if (response.data.pageInfo) {
                this.pageInfo = response.data.pageInfo
                this.pageShow = true
              } else {
                this.pageShow = false
              }
            }
            if (response.data.data.length === 0) {
              this.pageShow = false
            }
          } else {
            this.$message(response.data.message)
            this.tableData = response.data.data
            this.pageShow = false
          }
        })
        .catch(error => {
          console.log(error)
          this.$message('操作失败')
        })
    },
    // 得到产品名称
    getProductName(productIds) {
      var productNames = []
      var list
      if (productIds !== null && typeof (productIds) !== undefined && productIds.length > 0) {
        for (var i = 0; i < productIds.length; i++) {
          list = productIds[i]
          for (var j = 0; j < this.productData.length; j++) {
            if (list === this.productData[j].productId) {
              if (this.productName.indexOf() === -1) {
                productNames.push(this.productData[j].productName)
              }
            }
          }
        }
      }
      return productNames
    },
    // 得到部门名称
    getDepartName(departId) {
      var departName = ''
      for (var a = 0; a < this.deptData.length; a++) {
        if (this.deptData[a].id === parseInt(departId)) {
          departName = this.deptData[a].departName
        }
      }
      return departName
    },
    // 得到小结名称
    getSummaryName(summaryId) {
      var summaryName = ''
      // 遍历查找对应小结
      for (var c = 0; c < this.summaryData.length; c++) {
        if (this.summaryData[c].summaryId === summaryId) {
          summaryName = this.summaryData[c].summaryName
        }
      }
      return summaryName
    },
    // 删除活动信息
    delCampaign(campaignId) {
      delCampaignById(campaignId)
        .then(response => {
          if (response.data.code === 0) {
            this.$message.success(response.data.message)
            this.req2.pageNo = 1
            this.pageInfo.pageNo = 1
            this.findCampaignByConditions(this.req2)
          } else {
            this.$message(response.data.message)
          }
        })
        .catch(error => {
          console.log(error)
          this.$message('删除失败')
        })
    },
    // 查询活动详情
    getCampaignById(campaignId) {
      findCampaignById(campaignId)
        .then(response => {
          var list
          if (response.data.code === 0) {
            this.campaignDetail = response.data.data
            this.campaignDetail.departId = parseInt(this.campaignDetail.departId)
            this.$set(this.campaignDetail, 'campaignTypeCode', this.campaignDetail.campaignTypeInfo.code)
          }
          // 遍历查找对应产品名称
          this.productName = []
          this.departName = ''
          console.log('8585:', this.campaignDetail.products)
          for (var i = 0; i < this.campaignDetail.products.length; i++) {
            list = this.campaignDetail.products[i]
            for (var j = 0; j < this.productData.length; j++) {
              if (list === this.productData[j].productId) {
                if (this.productName.indexOf() === -1) {
                  this.productName.push(this.productData[j].productName)
                }
              }
            }
          }
          // 遍历查找对应活动组织
          for (var a = 0; a < this.deptData.length; a++) {
            if (this.deptData[a].id === this.campaignDetail.departId) {
              this.departName = this.deptData[a].departName
            }
          }
          // 遍历查找对应小结
          for (var c = 0; c < this.summaryData.length; c++) {
            if (this.summaryData[c].summaryId === this.campaignDetail.summaryId) {
              this.summaryName = this.summaryData[c].summaryName
            }
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 修改活动信息
    editCampaign(campaignDetail) {
      if (!this.validate) {
        return false
      }
      this.editVisible = false
      campaignDetail.productIds = campaignDetail.products
      modifyCampaign(campaignDetail).then(response => {
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
          this.findCampaignByConditions(this.req2)
        } else {
          this.$message(response.data.message)
        }
      }).catch(error => {
        console.log(error)
        this.$message('操作失败')
      })
    },
    // 查询所有产品
    getAllProduct() {
      findAllProduct().then(response => {
        if (response.data.code === 0) {
          this.productData = response.data.data
        }
      }).catch(error => {
        console.log(error)
      })
    },
    getAllCampaignTypes() {
      findAllCampaignTypes().then(response => {
        if (response.data.code === 0) {
          this.campaignTypes = response.data.data
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 查询活动组织
    getDepts() {
      queryDepts().then(response => {
        this.deptData = response.data.data
      })
    },
    // 查询小结
    getAllNodules() {
      findAllNodules().then(response => {
        this.summaryData = response.data.data
      })
    },
    // 详情页面查询评分表
    getMarksByCampaignId(campaignId) {
      findMarksByCampaignId(campaignId).then(response => {
        this.marksData = response.data.data
      })
    },
    // 详情页面查询质检组织
    getDeptByCampaignId(campaignId) {
      findDeptByCampaignId(campaignId).then(response => {
        this.qcdeptData = []
        for (var i = 0; i < response.data.data.length; i++) {
          this.qcdeptData.push(response.data.data[i].departName)
        }
      })
    },
    // 添加活动
    addCampaign(campaignDetail) {
      if (!this.validate) {
        return false
      }
      campaignDetail.productIds = campaignDetail.products
      this.addVisible = false
      addCampaign(campaignDetail).then(response => {
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
          this.findCampaignByConditions(this.req2)
        } else {
          this.$message(response.data.message)
        }
      }).catch(error => {
        this.$message('添加失败')
        console.log(error)
      })
    },
    // 批量删除
    batchDelCampaigns(batchDelReq) {
      if (batchDelReq.campaignIds.length === 0) {
        this.$message.error('请选择需要删除的内容')
      } else {
        delCampaigns(batchDelReq.campaignIds).then(response => {
          if (response.data.code === 0) {
            this.$message.success(response.data.message)
            this.req2.pageNo = 1
            this.pageInfo.pageNo = 1
            this.findCampaignByConditions(this.req2)
          } else {
            this.$message(response.data.message)
          }
        }).catch(error => {
          console.log(error)
          this.$message('删除失败')
        })
      }
    },
    // 表格多选框
    handleSelectionChange(val) {
      this.batchDelReq.campaignIds.length = 0
      for (var i = 0; i < val.length; i++) {
        this.batchDelReq.campaignIds.push(val[i].campaignId)
      }
    },
    nameListSelectionChange(val) {
      this.addNameList.listIds.length = 0
      for (var i = 0; i < val.length; i++) {
        this.addNameList.listIds.push(val[i].listId)
      }
    },
    removeListSelectionChange(val) {
      this.removeLists.length = 0
      for (var i = 0; i < val.length; i++) {
        this.removeLists.push(val[i].listId)
      }
    },
    saveRemoveListId(id) {
      this.removeLists.length = 0
      this.removeLists.push(id)
    },
    // 切换活动状态
    changeStatus(status) {
      if (status.status === '0') {
        status.status = '1'
      } else {
        status.status = '0'
      }
      findCampaignById(status.campaignId).then(response => {
        if (response.data.code === 0) {
          status.productIds = response.data.data.products
          changeCampaignStatus(status).then(response => {
            if (response.data.code === 0) {
              this.$message.success(response.data.message)
              this.findCampaignByConditions(this.req2)
            } else {
              this.$message(response.data.message)
            }
          }).catch(error => {
            console.log(error)
            this.$message('操作失败')
          })
        }
      }).catch(error => {
        console.log(error)
        this.$message('操作失败')
      })
    },
    // 添加名单
    // 查询已选名单列表
    getNameLists(campaignId) {
      showNameListsById(campaignId).then(response => {
        if (response.data.code === 0) {
          if (response.data.data) {
            this.nameListsTable = response.data.data
            this.pageShow3 = true
          } else {
            this.nameListsTable = []
            this.pageShow3 = false
          }
          if (response.data.pageInfo !== undefined && response.data.pageInfo) {
            this.nameListsPageinfo = response.data.pageInfo
          } else {
            this.nameListsPageinfo = {
              pageNo: 1,
              pageSize: 10,
              totalCount: 0 }
          }
        }
      }).catch(error => {
        console.log(error)
        this.$message('操作失败')
      })
    },
    // 查询可选名单列表
    getNameListExclude(searchReq) {
      findNameListExcludeById(searchReq).then(response => {
        if (response.data.code === 0) {
          console.log(response.data.data)
          if (response.data.data) {
            this.nameListExcludeTablel = response.data.data
            this.pageShow2 = true
          } else {
            this.nameListExcludeTablel = []
            this.pageShow2 = false
          }
          if (response.data.pageInfo !== undefined && response.data.pageInfo !== null) {
            this.nameListExcludePageinfo = response.data.pageInfo
          }
        } else {
          this.$message(response.data.message)
        }
      }).catch(error => {
        console.log(error)
        this.$message('操作失败')
      })
    },
    // 提交添加名单
    addCampaignAndList(addNameList) {
      addNameList.campaignId = this.nameLists.campaignId
      assignCampaignAndList(addNameList).then(response => {
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
          this.getNameLists(this.nameLists)
          this.getNameListExclude(this.nameListExclude)
          this.addList = false
        }
      }).catch(error => {
        console.log(error)
        this.$message('操作失败')
      })
    },
    // 活动管理---------------------------------
    // 页面显示条数
    handleSizeChange(val) {
      this.req2.pageSize = val
      this.req.pageSize = val
      this.req2.pageNo = 1
      this.pageInfo.pageNo = 1
      this.findCampaignByConditions(this.req2)
    },
    // 分页翻页功能
    handleCurrentChange(val) {
      this.req2.pageNo = val
      this.findCampaignByConditions(this.req2)
    },
    // 可选名单---------------------------------
    // 添加名单分页
    nameListExcludeChange(val) {
      this.nameListExclude.pageNo = val
      this.getNameListExclude(this.nameListExclude)
    },
    // 页面显示条数
    nameListExcludeSizeChange(val) {
      this.nameListExclude.pageSize = val
      this.nameListExclude.pageNo = 1
      this.nameListExcludePageinfo.pageNo = 1
      this.getNameListExclude(this.nameListExclude)
    },
    // 已选名单---------------------------------
    // 翻页
    nameListChange(val) {
      this.nameLists.pageNo = val
      this.getNameLists(this.nameLists)
    },
    // 页面显示条数
    nameListSizeChange(val) {
      this.nameLists.pageSize = val
      this.nameLists.pageNo = 1
      this.nameListsPageinfo.pageNo = 1
      this.getNameLists(this.nameLists)
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
</style>
