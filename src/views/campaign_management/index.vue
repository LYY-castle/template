<template>
  <div class="container campaignManagement">
    <el-collapse v-model="formContainerOpen" class="form-container" @change="handleChangeAcitve">
      <el-collapse-item title="筛选条件" name="1">
        <el-form :inline="true" size="small" :model="req" ref="searchForm">
          <el-form-item prop="campaignId" label="活动编号：">
            <el-input v-model="req.campaignId" placeholder="活动编号（限长20字符）" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item prop="campaignName" label="活动名称：">
            <el-input v-model="req.campaignName" placeholder="活动名称（限长128字符）" maxlength="128"></el-input>
          </el-form-item>
          <el-form-item label="活动状态：" prop="status">
            <el-radio-group v-model="req.status" size="small">
              <el-radio label=''>所有</el-radio>
              <el-radio label='0'>有效</el-radio>
              <el-radio label='1'>无效</el-radio>
            </el-radio-group>
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
          <el-form-item>
            <el-button size="small" type="primary" @click="req.pageNo=1;findCampaignByConditions(req);req2=clone(req)">查询</el-button>
            <el-button size="small" @click="timeValue=[],resetReq('searchForm');">重置</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <el-row class="table-container">
      <el-row class="margin-bottom-20">
        <div class="font14 bold">活动管理表</div>
      </el-row>
      <el-row class="margin-bottom-20">
        <el-button type="success" @click="addVisible=true;clearForm(campaignDetail,'campaignDetail');outcalltimeInfos=[];failTreatmentInfos=[];campaignExpiryDate=[];customerColumnInfos=[];new_dept_ids=[]">新建</el-button>
        <el-button type="danger" @click="batchDelVisible=true">批量删除</el-button>
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
            align="center"
            label="活动编号"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <a @click="detailVisible=true;getDeptByCampaignId(scope.row.campaignId);getMarksByCampaignId(scope.row.campaignId);getCampaignById(scope.row.campaignId);">{{scope.row.campaignId}}</a>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="campaignName"
            label="活动名称"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.campaignName }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="有效期"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{scope.row.listExpiryDate+'天'}}
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
            label="产品"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
             {{(getProductName(scope.row.products)).join(",")}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="summaryId"
            label="小结"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
             {{getSummaryName(scope.row.summaryId)}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="departId"
            label="活动部门"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
             {{getDepartName(scope.row.departId)}}
            </template>
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
            label="状态">
            <template slot-scope="scope">
              <div :class="scope.row.status == 0?'visible':'invisible'">
                <span>{{scope.row.status == 0?'有效':'无效'}}</span>
              </div>
            </template>
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
            width="300">
          <template slot-scope="scope">
            <el-button @click="editVisible=true;delReq.campaignId=scope.row.campaignId;getDeptByCampaignId(scope.row.campaignId);getMarksByCampaignId(scope.row.campaignId);getCampaignById(scope.row.campaignId);outcalltimeInfos=[];failTreatmentInfos=[]" type="text" size="small">修改</el-button>
            <el-button @click="delVisible=true;delReq.campaignId=scope.row.campaignId" type="text" size="small">删除</el-button>
            <!-- <el-button @click="changeVisible=true;delReq.campaignId=scope.row.campaignId;delReq.status=scope.row.status" type="text" size="small">{{scope.row.status==='0'?'禁用':'启用'}}</el-button> -->
            <el-button @click="campaignName=scope.row.campaignName;nameListExclude.campaignId=scope.row.campaignId;nameLists.campaignId=scope.row.campaignId;addList=true;nameLists.pageSize=10;nameListExclude.pageSize=10;nameListExclude.pageNo = 1;nameLists.pageNo = 1;getNameLists(nameLists);getNameListExclude(nameListExclude)" type="text" size="small">添加名单</el-button>
            <el-button v-if="scope.row.status == 0" @click="campaignName=scope.row.campaignName;nameLists.campaignId=scope.row.campaignId;removeVisible=true;nameLists.pageNo = 1;getNameLists(nameLists)" type="text" size="small">移除名单</el-button>
          </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row style="margin-top:20px;">
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
    </el-row>
    <el-dialog
      align:left
      width="32%"
      title="活动信息修改"
      :visible.sync="editVisible"
      append-to-body>
      <el-form size="small" label-width="108px" :model="campaignDetail" ref="editCampaign" :rules="rule">
        <el-form-item label="活动名称" prop="campaignName">
          <el-input v-model="campaignDetail.campaignName" size="small" placeholder="活动名称（限长128字符）" maxlength="128"></el-input>
        </el-form-item>
        <el-form-item label="活动类型" prop="campaignTypeCode">
          <el-select v-model="campaignDetail.campaignTypeCode" placeholder="请选择活动类型" style="width: 100%;">
            <el-option
              v-for="item in campaignTypes"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <span slot="label">
            <span style="color:#f56c6c">*</span> 客户配置项
          </span>
          <el-select v-model="customerColumnInfos" placeholder="请选择展示的客户字段" style="width:100%" multiple>
            <el-option
              v-for="item in customerParams"
              :key="item.value"
              :label="item.name"
              :value="item.value"
              v-if="show_wechat==='true'"
            ></el-option>
            <el-option
              v-for="item in customerParams1"
              :key="item.value"
              :label="item.name"
              :value="item.value"
              v-if="show_wechat==='false'"
            ></el-option>
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
        <el-form-item label="拨打方式" prop="callType" v-if="campaignDetail.campaignTypeCode==='AUTO_OUT_CALL'">
          <el-select v-model="campaignDetail.callType" placeholder="请选择拨打方式" style="width:100%" clearable>
            <el-option
              v-for="item in callTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item  v-if="campaignDetail.campaignTypeCode==='AUTO_OUT_CALL'">
          <span slot="label">
            <span style="color:#f56c6c">*</span> 拨打时段
          </span>
          <div v-for="(item,indexx) in outcalltimeInfos">
            <span>{{indexx+1}}.</span>
            <el-time-picker
            style="width:40%"
            arrow-control
            value-format='HH:mm:ss'
            v-model="item.outcallTimeStart"
            placeholder="外呼起始时间">
          </el-time-picker>
          <el-time-picker
            style="width:40%"
            arrow-control
            value-format='HH:mm:ss'
            v-model="item.outcallTimeEnd"
            placeholder="外呼结束时间">
          </el-time-picker>
          <i class="el-icon-delete" style="cursor:pointer;margin:0px 22px;" title="点击删除该时间段" @click="remove(indexx)"></i>
          </div>
          <div class="showaddTool">
            <i class="el-icon-plus" circle title="点击添加一个时间段" @click="addOutCallTimes()"></i>
          </div>
        </el-form-item>
        <el-form-item  v-if="campaignDetail.campaignTypeCode==='AUTO_OUT_CALL'">
          <span slot="label">
            <span style="color:#f56c6c">*</span> 呼叫失败处理
          </span>
          <div v-for="(item,index) in failTreatmentInfos">
            <span>{{index+1}}.</span>
            <el-select v-model="item.failType" placeholder="错误类型" clearable style="width:25%">
              <el-option
                v-for="item1 in failTypes"
                :key="item1.value"
                :label="item1.label"
                :value="item1.value"
              ></el-option>
            </el-select>
            <el-select v-model="item.treatment" placeholder="处理方式" clearable style="width:30%">
              <el-option
                v-for="item2 in treatments"
                :key="item2.value"
                :label="item2.label"
                :value="item2.value"
              ></el-option>
            </el-select>
            <el-input placeholder="失败拨打次数" style="width:25%" type="number" v-model="item.failCallNum"></el-input>
            <i class="el-icon-delete" style="cursor:pointer;margin:0px 22px;" title="点击删除该处理方式" @click="removeTreatment(index)"></i>
          </div>
          <div class="showaddTool">
            <i class="el-icon-plus" circle title="点击添加一个处理方式" @click="addTreatments()"></i>
          </div>
        </el-form-item>
        <el-form-item>
          <span slot="label">
            <span style="color:#f56c6c">*</span> 活动组织
          </span>
          <el-cascader
            style="width:100%;"
            v-model="edit_dept_ids"
            placeholder="请选择组织"
            :options="visibleDepts"
            :props="org_props"
            show-all-levels
            filterable
            size="small"
            change-on-select
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="话后小结" prop="summaryId">
          <el-select v-model="campaignDetail.summaryId" placeholder="请选择小结" style="width: 100%;">
            <el-option
                v-for="item in visibleSummaryData"
                :key="item.summaryId"
                :label="item.summaryName"
                :value="item.summaryId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="质检组织">
          <span v-for="item in qcdeptData" v-if="qcdeptData && qcdeptData.length!==0">{{(qcdeptData.length===0)?'无':item+' , '}}</span>
          <span v-if="qcdeptData && qcdeptData.length===0">无</span>
        </el-form-item>
        <el-form-item label="评分表">
          <span v-for="item in marksData" v-if="marksData && marksData.length!==0">{{(marksData.length===0)?'无':item.gradeName+' , '}}</span>
          <span v-if="marksData && marksData.length===0">无</span>
        </el-form-item>
        <el-form-item label="活动备注" prop="description">
        <el-input v-model="campaignDetail.description" size="small" placeholder="活动备注（限长255字符）" maxlength="255"></el-input>
      </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: right;">
        <el-button size="small" @click="getCampaignById(delReq.campaignId)">重置</el-button>
        <el-button size="small" type="primary" plain @click="editVisible = false;">取消</el-button>
        <el-button size="small" type="primary" @click="submitForm('editCampaign');editCampaign(campaignDetail)">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      align:left
      width="32%"
      title="活动信息详情"
      :visible.sync="detailVisible"
      append-to-body>
      <el-form label-width="100px" size="small">
        <el-form-item label="活动名称">
          <span>{{campaignDetail.campaignName}}</span>
        </el-form-item>
        <el-form-item label="活动类型">
          <span>{{campaignDetail.campaignTypeInfo.name}}</span>
        </el-form-item>
        <el-form-item label="客户配置项">
          <span v-for="item in toshowcustomerColumnInfos">{{item+' , '}}</span>
        </el-form-item>
        <el-form-item label="产品" v-if="!(campaignDetail.campaignTypeInfo.code=='RECRUIT')">
          <span v-for="item in productName">{{item+' , '}}</span>
        </el-form-item>
        <el-form-item label="名单有效期">
          <span>{{campaignDetail.listExpiryDate+'天'}}</span>
        </el-form-item>
        <el-form-item label="活动有效期">
          <span>{{campaignDetail.startTime + '至' + campaignDetail.endTime}}</span>
        </el-form-item>
        <el-form-item label="拨打次数">
          <span>{{campaignDetail.canContactNum==null?'':(campaignDetail.canContactNum+'次')}}</span>
        </el-form-item>
        <el-form-item label="拨打方式">
          <span v-html="showCallType(campaignDetail.callType)"></span>
        </el-form-item>
        <el-form-item label="外呼起止时段">
          <div v-for="(item,indexx) in outcalltimeInfos">
            <span>{{indexx+1}}.</span>
            <el-time-picker
            style="width:40%"
            arrow-control
            value-format='HH:mm:ss'
            v-model="item.outcallTimeStart"
            placeholder="拨打时段开始"
            disabled>
          </el-time-picker>
          <el-time-picker
            style="width:40%"
            arrow-control
            value-format='HH:mm:ss'
            v-model="item.outcallTimeEnd"
            placeholder="拨打时段结束"
            disabled>
          </el-time-picker>
          </div>
        </el-form-item>
        <el-form-item label="呼叫失败处理">
          <div v-for="(item,index) in failTreatmentInfos">
            <span>{{index+1}}.</span>
            <el-select v-model="item.failType" placeholder="失败类型" clearable style="width:25%" disabled>
              <el-option
                v-for="item1 in failTypes"
                :key="item1.value"
                :label="item1.label"
                :value="item1.value"
              ></el-option>
            </el-select>
            <el-select v-model="item.treatment" placeholder="处理方式" clearable style="width:30%" disabled>
              <el-option
                v-for="item2 in treatments"
                :key="item2.value"
                :label="item2.label"
                :value="item2.value"
              ></el-option>
            </el-select>
            <el-input placeholder="失败拨打次数" style="width:25%" type="number" v-model="item.failCallNum" disabled></el-input>
          </div>
        </el-form-item>
        <!-- <el-form-item label="活动状态">
          <span>{{campaignDetail.status==='1'?'无效':'有效'}}</span>
        </el-form-item> -->
        <el-form-item label="活动组织">
          <span>{{departName}}</span>
        </el-form-item>
        <el-form-item label="话后小结">
          <span>{{summaryName}}</span>
        </el-form-item>
        <el-form-item label="质检组织">
          <span v-for="item in qcdeptData" v-if="qcdeptData && qcdeptData.length!==0">{{(qcdeptData.length===0)?'无':item+' , '}}</span>
          <span v-if="qcdeptData && qcdeptData.length===0">无</span>
        </el-form-item>
        <el-form-item label="评分表">
          <span v-for="item in marksData" v-if="marksData && marksData.length!==0">{{(marksData.length===0)?'无':item.gradeName+' , '}}</span>
          <span v-if="marksData && marksData.length===0">无</span>
        </el-form-item>
        <el-form-item label="活动备注">
          <span>{{campaignDetail.description}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: right;">
        <el-button type="primary" plain size='small' @click="detailVisible = false">返回</el-button>
      </div>
    </el-dialog>
    <el-dialog
      align:left
      width="32%"
      title="新建活动"
      :visible.sync="addVisible"
      append-to-body>
      <el-form size="small" :rules="rule" :model="campaignDetail" ref="campaignDetail" label-width="108px">
        <el-form-item label="活动名称" prop="campaignName" >
          <el-input v-model="campaignDetail.campaignName" size="small" placeholder="活动名称（限长128字符）" maxlength="128"></el-input>
        </el-form-item>
        <el-form-item label="活动类型" prop="campaignTypeCode">
          <el-select v-model="campaignDetail.campaignTypeCode" placeholder="请选择活动" style="width: 100%;">
            <el-option
                v-for="item in campaignTypes"
                :key="item.code"
                :label="item.name"
                :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item >
          <span slot="label">
            <span style="color:#f56c6c">*</span> 客户配置项
          </span>
          <el-select v-model="customerColumnInfos" placeholder="请选择展示的客户字段" style="width:100%" multiple v-if="show_wechat==='true'">
            <el-option
              v-for="item in customerParams"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select v-model="customerColumnInfos" placeholder="请选择展示的客户字段" style="width:100%" multiple v-else>
            <el-option
                v-for="item in customerParams1"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
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
        <el-form-item label="活动有效期">
          <el-date-picker
              style="width:100%"
              v-model="campaignExpiryDate"
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="拨打次数" prop="canContactNum">
          <el-input v-model="campaignDetail.canContactNum" size="small" placeholder="单位：次"></el-input>
        </el-form-item>
        <!-- <el-form-item label="最大拨打量" prop="callNum" v-if="campaignDetail.campaignTypeCode==='AUTO_OUT_CALL'">
          <el-input v-model="campaignDetail.callNum" size="small" placeholder="单位：人"></el-input>
        </el-form-item> -->
        <el-form-item label="拨打方式" prop="callType" v-if="campaignDetail.campaignTypeCode==='AUTO_OUT_CALL'">
          <el-select v-model="campaignDetail.callType" placeholder="请选择拨打方式" style="width:100%" clearable>
            <el-option
              v-for="item in callTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item  v-if="campaignDetail.campaignTypeCode==='AUTO_OUT_CALL'">
          <span slot="label">
            <span style="color:#f56c6c">*</span> 拨打时段
          </span>
          <div v-for="(item,indexx) in outcalltimeInfos">
            <span>{{indexx+1}}.</span>
            <el-time-picker
            style="width:40%"
            arrow-control
            value-format='HH:mm:ss'
            v-model="item.outcallTimeStart"
            placeholder="拨打时段开始">
          </el-time-picker>
          <el-time-picker
            style="width:40%"
            arrow-control
            value-format='HH:mm:ss'
            v-model="item.outcallTimeEnd"
            placeholder="拨打时段结束">
          </el-time-picker>
          <i class="el-icon-delete" style="cursor:pointer;margin:0px 22px;" title="点击删除该时间段" @click="remove(indexx)"></i>
          </div>
          <div class="showaddTool">
            <i class="el-icon-plus" circle title="点击添加一个时间段" @click="addOutCallTimes()"></i>
          </div>
        </el-form-item>
        <el-form-item v-if="campaignDetail.campaignTypeCode==='AUTO_OUT_CALL'">
          <span slot="label">
            <span style="color:#f56c6c">*</span> 呼叫失败处理
          </span>
          <div v-for="(item,index) in failTreatmentInfos">
            <span>{{index+1}}.</span>
            <el-select v-model="item.failType" placeholder="失败类型" clearable style="width:25%">
              <el-option
                v-for="item1 in failTypes"
                :key="item1.value"
                :label="item1.label"
                :value="item1.value"
              ></el-option>
            </el-select>
            <el-select v-model="item.treatment" placeholder="处理方式" clearable style="width:30%">
              <el-option
                v-for="item2 in treatments"
                :key="item2.value"
                :label="item2.label"
                :value="item2.value"
              ></el-option>
            </el-select>
            <el-input placeholder="失败拨打次数" style="width:25%" type="number" v-model="item.failCallNum"></el-input>
            <i class="el-icon-delete" style="cursor:pointer;margin:0px 22px;" title="点击删除该处理方式" @click="removeTreatment(index)"></i>
          </div>
          <div class="showaddTool">
            <i class="el-icon-plus" circle title="点击添加一个处理方式" @click="addTreatments()"></i>
          </div>
        </el-form-item>
        <el-form-item>
          <span slot="label">
            <span style="color:#f56c6c">*</span> 活动组织
          </span>
          <el-cascader
            style="width:100%;"
            v-model="new_dept_ids"
            placeholder="请选择组织"
            :options="visibleDepts"
            :props="org_props"
            show-all-levels
            filterable
            size="small"
            change-on-select
            clearable
          ></el-cascader>
      </el-form-item>
      <el-form-item label="话后小结" prop="summaryId">
        <el-select v-model="campaignDetail.summaryId" placeholder="请选择小结" style="width: 100%;">
          <el-option
              v-for="item in visibleSummaryData"
              :key="item.summaryId"
              :label="item.summaryName"
              :value="item.summaryId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动备注" prop="description">
        <el-input v-model="campaignDetail.description" size="small" placeholder="活动备注（限长255字符）" maxlength="255"></el-input>
      </el-form-item>
      </el-form>
        <div slot="footer" style="text-align: right;">
          <el-button size="small" @click="resetForm('campaignDetail');">重置</el-button>
          <el-button size="small" plain type="primary" @click="addVisible = false">取消</el-button>
          <el-button size="small" type="primary" @click="submitForm('campaignDetail');addCampaign(campaignDetail);">确定</el-button>
        </div>
    </el-dialog>
    <el-dialog
      width="30%"
      title="删除"
      :visible.sync="delVisible"
      append-to-body>
      <span style="font-size:20px;">确定删除此内容？</span>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button size="small" type="primary" plain @click="delVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="delVisible = false;delCampaign(delReq);">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="30%"
      title="批量删除"
      :visible.sync="batchDelVisible"
      append-to-body>
      <span style="font-size:20px;">确定删除选定内容？</span>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button size="small" type="primary" plain @click="batchDelVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="batchDelVisible = false;batchDelCampaigns(batchDelReq);">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      top="5vh"
      width="90%"
      :visible.sync="addList"
      append-to-body>
      <div slot="title" style="text-align: center;">
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
                placeholder="开始时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                default-time="00:00:00">
            </el-date-picker>
            到
            <el-date-picker
                v-model="nameListExclude.endCreateTime"
                type="datetime"
                placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                default-time="00:00:00">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="nameListExclude.pageNo=1;nameLists.pageNo=1;getNameLists(nameLists);getNameListExclude(nameListExclude)">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <el-row>
          <h2 style="display:inline">可选名单列表</h2>
        </el-row>
        <el-table
          :data="nameListExcludeTablel"
          @selection-change="nameListSelectionChange">
          <el-table-column
            align="center"
            type="selection"
            width="55">
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
          :data="nameListsTable">
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
        <el-button size="small" type="success" @click="addCampaignAndList(addNameList);">添加</el-button>
        <el-button size="small" type="primary" plain @click="addList = false;">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="30%"
      title="删除"
      :visible.sync="delVisible"
      append-to-body>
      <span style="font-size:20px;">确定删除此内容？</span>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button size="small" type="primary" plain @click="delVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="delVisible = false;delCampaign(delReq);">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="30%"
      title="批量删除"
      :visible.sync="batchDelVisible"
      append-to-body>
      <span style="font-size:20px;">确定删除选定内容？</span>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button size="small" type="primary" plain @click="batchDelVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="batchDelVisible = false;batchDelCampaigns(batchDelReq);">确定</el-button>
      </div>
    </el-dialog>

    <!-- 活动移除名单 -->
     <el-dialog
      top="5vh"
      width="90%"
      :visible.sync="removeVisible"
      append-to-body>
      <div slot="title" style="text-align: center;">
        <h3 style="display:inline;">活动名称：{{campaignName}}</h3>
      </div>
      <el-row>
        <el-row>
          <h2 style="display:inline">名单列表</h2>
          <el-pagination
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
          @selection-change="removeListSelectionChange">
          <el-table-column
            align="center"
            type="selection"
            width="55">
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
        <el-button size="small" type="danger" @click="batchListVisible=true;">批量移除</el-button>
        <el-button size="small" type="primary" plain @click="removeVisible = false;">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="30%"
      title="批量移除名单"
      :visible.sync="batchListVisible"
      append-to-body>
      <span style="font-size:20px;">确定移除选定内容？</span>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button type="primary" plain @click="batchListVisible = false">取消</el-button>
        <el-button type="primary" @click="batchListVisible = false;removeList();">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="30%"
      title="移除名单"
      :visible.sync="removeListVisible"
      append-to-body>
      <span style="font-size:20px;">确定移除吗？</span>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button type="primary" plain @click="removeListVisible = false">取消</el-button>
        <el-button type="primary" @click="removeListVisible = false;removeList();">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import {
  findAllProduct,
  queryDepts,
  getAllVisibleDepts,
  findAllNodules,
  findAllVisibleNodules,
  findMarksByCampaignId,
  findDeptByCampaignId,
  modifyCampaign,
  // changeCampaignStatus,
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
import { formatDateTime, clone, list2Tree } from '@/utils/tools'

export default {
  name: 'campaign_management',
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
    // 拨打次数不能超过9999次
    var checkCanContactNum = (eule, value, callback) => {
      if (value > 9999) {
        return callback(new Error('拨打次数不能超过9999次'))
      }
      if (!/^\d+$/.test(value)) {
        return callback(new Error('请输入数字'))
      } else {
        callback()
      }
    }
    // 拨打数量不能超过9999次
    var checkCallNum = (eule, value, callback) => {
      if (value > 9999) {
        return callback(new Error('拨打数量不能超过9999人'))
      }
      if (value < 0) {
        return callback(new Error('拨打数量不能为负数'))
      }
      if (!/^\d+$/.test(value)) {
        return callback(new Error('请输入数字'))
      } else {
        callback()
      }
    }
    // 拨打间隔不能超过9999分钟
    var checkCallSpacing = (eule, value, callback) => {
      if (value > 9999) {
        return callback(new Error('拨打间隔不能超过9999分钟'))
      }
      if (value < 0) {
        return callback(new Error('拨打间隔不能为负数'))
      }
      if (!/^\d+$/.test(value)) {
        return callback(new Error('请输入数字'))
      } else {
        callback()
      }
    }
    // 外呼起始时间不能大于外呼结束时间
    var checkTimeStart = (eule, value, callback) => {
      if (this.campaignDetail.outCallTimeEnd) {
        if (new Date(value).getTime() > new Date(this.campaignDetail.outCallTimeEnd).getTime()) {
          return callback(new Error('外呼起始时间不能大于外呼结束时间'))
        }
      }
    }
    // 外呼结束时间不能小于外呼起始时间
    var checkTimeEnd = (eule, value, callback) => {
      if (this.campaignDetail.outCallTimeStart) {
        if (new Date(value).getTime() < new Date(this.campaignDetail.outCallTimeStart).getTime()) {
          return callback(new Error('外呼结束时间不能小于外呼起始时间'))
        }
      }
    }
    // 选择活动组织
    var checkDept = (rule, value, callback) => {
      if (this.new_dept_ids.length === 0) {
        callback(new Error('请选择组织！'))
      }
    }
    return {
      formContainerOpen: '1',
      formContainer: this.$store.state.app.formContainer,
      rule: {
        campaignDepartment: [
          { required: true, validator: checkDept, trigger: 'change' }
        ],
        campaignName: [
          { required: true, message: '请输入活动名称', trigger: 'change' }
        ],
        campaignTypeCode: [
          { required: true, message: '请选择活动类型', trigger: 'change' }
        ],
        callType: [
          { required: true, message: '请选择拨打方式', trigger: 'change' }
        ],
        productIds: [
          { required: true, message: '请选择产品', trigger: 'change' }
        ],
        products: [
          { required: true, message: '请选择产品', trigger: 'change' }
        ],
        callNum: [
          { required: true, message: '请输入拨打人数', trigger: 'change' },
          { validator: checkCallNum, trigger: 'change' }
        ],
        callSpacing: [
          { required: true, message: '请输入拨打间隔时间', trigger: 'change' },
          { validator: checkCallSpacing, trigger: 'change' }
        ],
        outCallTimeStart: [
          { required: true, message: '请选择外呼起始时间', trigger: 'change' },
          { validator: checkTimeStart, trigger: 'change' }
        ],
        outCallTimeEnd: [
          { required: true, message: '请选择外呼结束时间', trigger: 'change' },
          { validator: checkTimeEnd, trigger: 'change' }
        ],
        outcalltimeInfos: [
          { required: true, message: '请选择外呼起止时段', trigger: 'change' }
        ],
        listExpiryDate: [
          { required: true, message: '请输入名单有效期', trigger: 'change' },
          { validator: checkExpiryDate, trigger: 'change' }
        ],
        treatments: [
          { required: true, message: '请选择错误处理方式', trigger: 'change' }
        ],
        canContactNum: [
          { required: true, message: '请输入拨打次数', trigger: 'change' },
          { validator: checkCanContactNum, trigger: 'change' }
        ],
        // status: [
        //   { required: true, message: '请选择活动状态', trigger: 'change' }
        // ],
        departId: [
          { required: true, validator: checkDept, trigger: 'change' }
        ],
        summaryId: [
          { required: true, message: '请选择话后小结', trigger: 'change' }
        ]
      },
      callTypes: [
        {
          value: '0',
          label: '坐席接听'
        },
        {
          value: '1',
          label: '客户接听'
        }
      ],
      failTypes: [
        {
          value: '0',
          label: '未接听'
        },
        {
          value: '1',
          label: '停机'
        },
        {
          value: '2',
          label: '不在服务区'
        }
      ],
      treatments: [
        {
          value: '0',
          label: '不再拨打'
        },
        {
          value: '1',
          label: '换时间段拨打'
        }
      ],
      customerParams: [
        {
          value: 'customerId',
          name: '客户编号'
        },
        {
          value: 'customerName',
          name: '客户姓名'
        },
        {
          value: 'sex',
          name: '性别'
        },
        {
          value: 'mobile',
          name: '联系电话'
        },
        // {
        //   value: 'province',
        //   name: '所在省'
        // },
        // {
        //   value: 'city',
        //   name: '所在市'
        // },
        // {
        //   value: 'district',
        //   name: '所在县/区'
        // },
        // {
        //   value: 'detail',
        //   name: '详细地址'
        // },
        {
          value: 'idNumber',
          name: '身份证'
        },
        {
          value: 'score',
          name: '客户评分'
        },
        {
          value: 'remark',
          name: '备注'
        }
      ],
      customerParams1: [
        {
          value: 'customerId',
          name: '客户编号'
        },
        {
          value: 'customerName',
          name: '客户姓名'
        },
        {
          value: 'sex',
          name: '性别'
        },
        {
          value: 'mobile',
          name: '联系电话'
        },
        // {
        //   value: 'province',
        //   name: '所在省'
        // },
        // {
        //   value: 'city',
        //   name: '所在市'
        // },
        // {
        //   value: 'district',
        //   name: '所在县/区'
        // },
        // {
        //   value: 'detail',
        //   name: '详细地址'
        // },
        {
          value: 'idNumber',
          name: '身份证'
        },
        {
          value: 'idNumber',
          name: '身份证'
        },
        {
          value: 'score',
          name: '客户评分'
        },
        {
          value: 'remark',
          name: '备注'
        }
      ],
      new_dept_ids: [], // 新建活动
      edit_dept_ids: [], // 修改活动
      reverse_edit_dept_ids: [], // 用以回显修改组织
      org_props: {
        label: 'departName',
        value: 'id',
        children: 'children'
      },
      beforeTransfer_visibleDepts: [], // 所有可见组织 - 转成树结构之前
      // 是否展示微信相关
      show_wechat: `${process.env.SHOW_WECHAT}`,
      campaignExpiryDate: [],
      timeValue: [],
      removeListVisible: false, // 单个移除
      batchListVisible: false, // 批量移除名单
      removeLists: [], // 批量移除ids
      removeVisible: false, // 移除名单
      detailVisible: false,
      delVisible: false, // 删除对话框显示隐藏
      editVisible: false, // 修改对话框显示隐藏
      addVisible: false, // 新建对话框显示隐藏
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
      deptData: [], // 所有组织
      visibleDepts: [], // 所有可见组织
      qcdeptData: [], // 质检组织
      allSummaryData: [], // 所有小结
      visibleSummaryData: [], // 所有可见的小结
      campaignTypes: [], // 活动类型
      marksData: [], // 评分表
      productName: [], // 产品名称
      customerColumnInfos: [], // 选择显示的客户字段
      toshowcustomerColumnInfos: [], // 需要显示在活动详情的客户字段
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
        status: '',
        modifierName: '',
        modifyTimeStart: '',
        modifyTimeEnd: '',
        pageSize: 10,
        pageNo: 1
      },
      req2: {
        campaignId: '',
        campaignName: '',
        status: '',
        modifierName: '',
        modifyTimeStart: '',
        modifyTimeEnd: '',
        pageSize: 10,
        pageNo: 1
      },
      outcalltimeInfos: [],
      failTreatmentInfos: [],
      campaignDetail: {
        // callNum: '', // 自动外呼-一次拨打数量
        callType: '', // 自动外呼-拨打方式
        // outCallTimeStart: '', // 自动外呼-时间段开始
        // outCallTimeEnd: '', // 自动外呼-时间段结束
        customerColumnInfos: [], // 显示的客户字段
        outCallFlag: '', // 自动外呼-标志 0关闭 1开启
        outcalltimeInfos: [], // 自动外呼-外呼时间段
        failTreatmentInfos: [], // 自动外呼-错误处理方式
        startTime: '', // 活动有效期
        endTime: '', // 活动有效期
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
      // 新建名单
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
        campaignId: '',
        visible: 1
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
    this.formContainer()
    this.handleChangeAcitve()
    this.findCampaignByConditions(this.req)
    this.getAllProduct()
    this.getDepts()
    this.getVisibleDepts()
    this.getAllNodules()
    this.getAllVisibleNodules()
    this.getAllCampaignTypes()
  },
  methods: {
    handleChangeAcitve(active = ['1']) {
      if (active.length) {
        $('.form-more').text('收起')
      } else {
        $('.form-more').text('更多')
      }
    },
    addOutCallTimes() {
      this.outcalltimeInfos.push({
        outcallTimeStart: '',
        outcallTimeEnd: ''
      })
    },
    remove(index) {
      this.outcalltimeInfos.splice(index, 1)
    },
    addTreatments() {
      this.failTreatmentInfos.push({
        failCallNum: '',
        failType: '',
        treatment: ''
      })
    },
    removeTreatment(index) {
      this.failTreatmentInfos.splice(index, 1)
    },
    showCallType(callType) {
      if (callType) {
        if (callType === '0') {
          return '坐席接听'
        } else {
          return '客户接听'
        }
      } else {
        return '无'
      }
    },
    // 深度克隆
    clone: clone,
    // 时间戳转年月日时分秒
    formatDateTime: formatDateTime,
    clearForm(obj, formName) {
      for (var key in obj) {
        if (key === 'products' || key === 'productIds') {
          obj[key] = []
        } else {
          obj[key] = ''
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
          this.req2.pageNo = 1
          this.pageInfo.pageSize = 1
          this.findCampaignByConditions(this.req)
        } else {
          this.$message.error(response.data.message)
        }
      })
    },
    submitForm(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (formName === 'campaignDetail') {
              if (this.new_dept_ids.length === 0) {
                this.$message.error('请选择活动组织')
                this.validate = false
                return
              } else {
                this.validate = true
              }
            } else {
              if (this.edit_dept_ids.length === 0) {
                this.$message.error('请选择活动组织')
                this.validate = false
                return
              } else {
                this.validate = true
              }
            }
          } else {
            this.$message.error('请检查是否填写正确')
            this.validate = false
          }
        })
      }
    },
    // 查询活动信息
    findCampaignByConditions(req) {
      req.modifyTimeStart = this.timeValue ? this.timeValue[0] : null
      req.modifyTimeEnd = this.timeValue ? this.timeValue[1] : null
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
      for (var c = 0; c < this.allSummaryData.length; c++) {
        if (this.allSummaryData[c].summaryId === summaryId) {
          summaryName = this.allSummaryData[c].summaryName
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
            this.req2.status = ''
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
            /** 回显上级组织的逻辑 start */
            let arr = []
            for (var q = 0; q < this.beforeTransfer_visibleDepts.length; q++) {
              if (this.beforeTransfer_visibleDepts[q].id === parseInt(response.data.data.departId)) {
                arr = this.beforeTransfer_visibleDepts[q].idPath.split('/')
              }
            }
            for (var w = 0; w < arr.length; w++) {
              if (arr[w] === null || arr[w] === '') {
                arr.splice(w, 1)
                w = w - 1
              }
            }
            for (var e = 0; e < arr.length; e++) {
              arr[e] = parseInt(arr[e])
            }
            this.edit_dept_ids = arr
            this.reverse_edit_dept_ids = arr
            /** 回显上级组织的逻辑 end */

            this.campaignDetail = response.data.data
            this.campaignDetail.departId = parseInt(this.campaignDetail.departId)
            if (this.campaignDetail.outCallTimeStart) {
              this.campaignDetail.outCallTimeStart = this.campaignDetail.outCallTimeStart.split(' ')[1]
            }
            if (this.campaignDetail.outCallTimeEnd) {
              this.campaignDetail.outCallTimeEnd = this.campaignDetail.outCallTimeEnd.split(' ')[1]
            }
            if (this.campaignDetail.failTreatmentInfos) {
              this.failTreatmentInfos = this.campaignDetail.failTreatmentInfos
            }
            if (this.campaignDetail.outcalltimeInfos) {
              this.outcalltimeInfos = this.campaignDetail.outcalltimeInfos
            }
            this.$set(this.campaignDetail, 'campaignTypeCode', this.campaignDetail.campaignTypeInfo.code)
            // 遍历查找客户字段
            this.toshowcustomerColumnInfos = []
            this.customerColumnInfos = []
            const columns = this.campaignDetail.customerColumnInfos
            if (columns && columns.length > 0) {
              for (var k = 0; k < columns.length; k++) {
                this.toshowcustomerColumnInfos.push(
                  columns[k].customerColumn === 'customerId' ? '客户编号' : columns[k].customerColumn === 'customerName' ? '客户姓名'
                    : columns[k].customerColumn === 'sex' ? '性别' : columns[k].customerColumn === 'mobile' ? '联系电话'
                      : columns[k].customerColumn === 'idNumber' ? '身份证' : columns[k].customerColumn === 'resideAddress' ? '地址'
                        : columns[k].customerColumn === 'email' ? '邮箱' : columns[k].customerColumn === 'bankCardType' ? '持卡类型'
                          : columns[k].customerColumn === 'source' ? '来源' : '无'
                )
                this.customerColumnInfos.push(columns[k].customerColumn)
              }
            }
          }
          // 遍历查找对应产品名称
          this.productName = []
          this.departName = ''
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
          for (var c = 0; c < this.visibleSummaryData.length; c++) {
            if (this.visibleSummaryData[c].summaryId === this.campaignDetail.summaryId) {
              this.summaryName = this.visibleSummaryData[c].summaryName
            }
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 修改活动信息
    editCampaign(campaignDetail) {
      const arr = this.customerColumnInfos
      campaignDetail.customerColumnInfos = []
      for (let i = 0; i < arr.length; i++) {
        campaignDetail.customerColumnInfos.push({
          customerColumn: arr[i]
        })
      }
      campaignDetail.failTreatmentInfos = this.failTreatmentInfos
      campaignDetail.outcalltimeInfos = this.outcalltimeInfos
      if (this.campaignExpiryDate !== '') {
        campaignDetail.startTime = this.campaignExpiryDate[0]
        campaignDetail.endTime = this.campaignExpiryDate[1]
      }
      if (!this.validate) {
        return false
      }
      if (campaignDetail.customerColumnInfos.length === 0) {
        this.$message.error('请选择客户配置项')
        return
      }
      if (campaignDetail.campaignTypeCode === 'AUTO_OUT_CALL') {
        // 默认设置自动外呼标志为开启
        campaignDetail.outCallFlag = '1'
        if (campaignDetail.outcalltimeInfos.length === 0) {
          this.$message.error('请选择拨打时段！')
          return
        }
        if (campaignDetail.failTreatmentInfos.length === 0) {
          this.$message.error('请选择呼叫失败处理！')
          return
        }
      }
      this.editVisible = false
      campaignDetail.productIds = campaignDetail.products
      campaignDetail.departId = this.edit_dept_ids[this.edit_dept_ids.length - 1]
      modifyCampaign(campaignDetail).then(response => {
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
          this.req2.status = ''
          this.findCampaignByConditions(this.req2)
        } else {
          this.$message(response.data.message)
        }
      }).catch(error => {
        console.error(error)
        this.$message('操作失败')
      })
    },
    // 新建活动
    addCampaign(campaignDetail) {
      const arr = this.customerColumnInfos
      campaignDetail.customerColumnInfos = []
      for (let i = 0; i < arr.length; i++) {
        campaignDetail.customerColumnInfos.push({
          customerColumn: arr[i]
        })
      }
      campaignDetail.failTreatmentInfos = this.failTreatmentInfos
      campaignDetail.outcalltimeInfos = this.outcalltimeInfos
      if (this.campaignExpiryDate !== '') {
        campaignDetail.startTime = this.campaignExpiryDate[0]
        campaignDetail.endTime = this.campaignExpiryDate[1]
      }
      if (!this.validate) {
        return false
      }
      if (campaignDetail.customerColumnInfos.length === 0) {
        this.$message.error('请选择客户配置项')
        return
      }
      if (campaignDetail.campaignTypeCode === 'AUTO_OUT_CALL') {
        // 默认设置自动外呼标志为开启
        campaignDetail.outCallFlag = '1'
        if (campaignDetail.outcalltimeInfos.length === 0) {
          this.$message.error('请选择拨打时段！')
          return
        }
        if (campaignDetail.failTreatmentInfos.length === 0) {
          this.$message.error('请选择呼叫失败处理！')
          return
        }
      }
      campaignDetail.productIds = campaignDetail.products
      campaignDetail.status = '1'
      campaignDetail.departId = this.new_dept_ids[this.new_dept_ids.length - 1]
      this.addVisible = false
      addCampaign(campaignDetail).then(response => {
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
          this.req2.status = ''
          this.findCampaignByConditions(this.req2)
        } else {
          this.$message(response.data.message)
        }
      }).catch(error => {
        this.$message('新建失败')
        console.log(error)
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
    // 查询所有可见组织
    getVisibleDepts() {
      getAllVisibleDepts().then(response => {
        this.beforeTransfer_visibleDepts = response.data.data
        const map = {
          data: response.data.data,
          rootId: 0,
          idFieldName: 'id',
          parentIdFielName: 'upId'
        }
        this.visibleDepts = list2Tree(map)
      })
    },
    // 查询所有小结
    getAllNodules() {
      findAllNodules().then(response => {
        this.allSummaryData = response.data.data
      })
    },
    // 查询所有可见小结
    getAllVisibleNodules() {
      findAllVisibleNodules().then(response => {
        this.visibleSummaryData = response.data.data
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
        if (response.data && response.data.data && response.data.data.length > 0) {
          for (var i = 0; i < response.data.data.length; i++) {
            this.qcdeptData.push(response.data.data[i].departName)
          }
        }
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
    // changeStatus(status) {
    //   if (status.status === '0') {
    //     status.status = '1'
    //   } else {
    //     status.status = '0'
    //   }
    //   findCampaignById(status.campaignId).then(response => {
    //     if (response.data.code === 0) {
    //       status.productIds = response.data.data.products
    //       changeCampaignStatus(status).then(response => {
    //         if (response.data.code === 0) {
    //           this.$message.success(response.data.message)
    //           this.findCampaignByConditions(this.req2)
    //         } else {
    //           this.$message(response.data.message)
    //         }
    //       }).catch(error => {
    //         console.log(error)
    //         this.$message('操作失败')
    //       })
    //     }
    //   }).catch(error => {
    //     console.log(error)
    //     this.$message('操作失败')
    //   })
    // },
    // 新建名单
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
    // 提交新建名单
    addCampaignAndList(addNameList) {
      addNameList.campaignId = this.nameLists.campaignId
      addNameList.endTime = new Date(new Date().setHours(23, 59, 59, 0))
      assignCampaignAndList(addNameList).then(response => {
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
          this.getNameLists(this.nameLists)
          this.getNameListExclude(this.nameListExclude)
          this.addList = false
          this.req2.pageNo = 1
          this.pageInfo.pageSize = 1
          this.findCampaignByConditions(this.req)
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
    // 新建名单分页
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

<style rel="stylesheet/scss" lang="scss" scoped>
.showaddTool {
  float: right;
  margin: 0px 65%;
  height: 20px;
  cursor: pointer;
}
</style>
