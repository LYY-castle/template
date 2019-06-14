<template>
  <div class="app-container work-bench">
    <div>
      <div id="main-board">
          <div>
            <el-row :gutter="5">
              <el-collapse v-model="formContainerOpen1" class="form-container" @change="handleChangeActive1">
                <span class="form-more1 bold" style="line-height: 24px;font-size: 14px;float:right;margin-right:6px;color:#57AFFF;position:absolute;top:11px;right:41px;">收起</span>
                <el-collapse-item  name="1" title="筛选条件">
                  <el-form :inline="true" class="demo-form-inline" size="small" style="margin-left:1%;">
                    <el-form-item label="名称:">
                      <el-input placeholder="名称（限长45字符）" v-model="formInline.name" maxlength="45"></el-input>
                    </el-form-item>
                    <el-form-item label="编号:">
                      <el-input placeholder="编号（限长45字符）" v-model="formInline.code" maxlength="45"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="呼叫类型:">
                      <el-select size="small" v-model="formInline.bondType" placeholder="呼叫类型">
                        <el-option label="请选择" value=""></el-option>
                        <el-option label="呼出" value="0"></el-option>
                        <el-option label="呼入" value="1"></el-option>
                        <el-option label="呼入与呼出" value="2"></el-option>
                      </el-select>
                    </el-form-item> -->
                    <el-form-item label="有效性:">
                      <el-select size="small" v-model="formInline.enabled" placeholder="有效性">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="有效" value=1></el-option>
                        <el-option label="无效" value=0></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="操作人:">
                      <el-input placeholder="操作人（限长45字符）" v-model="formInline.modifier" maxlength="45"></el-input>
                    </el-form-item>
                    <el-form-item label="操作时间：">
                      <el-date-picker
                        v-model="formInline.timeValue"
                        type="datetimerange"
                        range-separator="-"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        value-format="yyyy-MM-dd HH:mm:ss">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="searchInfo(formInline)">查询</el-button>
                      <el-button @click="resetFormInline()">重置</el-button>
                    </el-form-item>
                  </el-form>
                </el-collapse-item>
              </el-collapse>
            </el-row>
          </div>
          <div class="table-container">
            <el-row>
              <div class="work-title-style font14 bold">技能组清单</div>
            </el-row>
            <el-row style="margin-top:1%;">
              <el-col :span="10">
                <el-button type="success" size="small" @click="addRuleFormPage()">新建</el-button>
                <el-button type="danger" size="small" @click="deleteAll()">批量删除</el-button>
              </el-col>
            </el-row>
            <el-row style="margin-top:15px;">
              <el-col>
                <el-table
                  :header-row-style="headerRow"
                  :data="tableData"
                  ref="multipleTable"
                  tooltip-effect="dark"
                  :row-class-name="tableRowClassName"
                  @selection-change="handleSelectionChange">
                  <el-table-column
                    fixed
                    align="center"
                    type="selection"
                    width="55">
                  </el-table-column>
                  <el-table-column
                    fixed
                    align="center"
                    label="名称"
                    prop="name"
                    :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                      {{scope.row.name}}
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    prop="code"
                    label="编号"
                    :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                      {{scope.row.code}}
                    </template>
                  </el-table-column>
                  <!-- <el-table-column
                    align="center"
                    prop="bondType"
                    label="呼叫类型"
                    :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                      {{showBondType(scope.row.bondType)}}
                    </template>
                  </el-table-column> -->
                  <el-table-column
                    align="center"
                    prop="enabled"
                    label="有效性"
                    :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                      <div :class="scope.row.enabled==='0'?'invisible':'visible'">
                        <span>{{scope.row.enabled==='0'?'无效':'有效'}}</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    prop="modifier"
                    label="操作人"
                    :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                      {{ scope.row.modifier }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    prop="updateTime"
                    label="操作时间"
                    width="155"
                    :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                      {{ showTime(scope.row.updateTime) }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    fixed="right"
                    align="center"
                    label="操作"
                    width="240">
                    <template slot-scope="scope">
                      <el-button @click="handleQuery(scope.row)" type="text" size="small"> 查看</el-button>
                      <el-button @click="handleEdit(scope.row)" type="text" size="small"> 编辑</el-button>
                      <el-button @click="handleAddStaff(scope.row)" type="text" size="small">分配坐席</el-button>
                      <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
            <el-row style="margin-top:1%;">
              <el-col :span="24">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page.sync="pagination.pageNo"
                  :page-size="pagination.pageSize"
                  :page-sizes="[10, 20, 30, 40, 50]"
                  layout="total, sizes, prev, pager, next, jumper "
                  :total="pagination.totalCount" style="text-align: right">
                </el-pagination>
              </el-col>
            </el-row>

          </div>
      </div>
      <div id="minor-board" v-if="dialogAddStaff" style="float:right;width:48.5%;margin-left:15px;" >
        <el-form :model="staffRelationship" ref="staffRelationship" label-width="150px" class="demo-staffRelationship" size="small" :rules="rules">
          <div class="table-container" style="margin-top:0;">
            <el-row>
              <div class="work-title-style font14 bold">坐席列表，所属技能组：{{ownnerSkillSetName}}<i class="el-icon-close pull-right" style="cursor:pointer;" @click="closeMinorBoard()"></i></div>

            </el-row>
            <el-row style="margin-top:1%;">
              <el-col :span="10">
                <el-button type="success" size="small" @click="addStaff()">添加坐席</el-button>
                <el-button type="danger" size="small" @click="batchDel()">批量删除</el-button>
              </el-col>
            </el-row>
            <el-row style="margin-top:15px;">
              <el-col>
                <el-table
                  :header-row-style="headerRow"
                  :data="staffRelationshipData"
                  ref="multipleTable"
                  tooltip-effect="dark"
                  @selection-change="handleSelectionChange1">
                  <el-table-column
                    fixed
                    align="center"
                    type="selection"
                    width="55">
                  </el-table-column>
                  <el-table-column
                    fixed
                    align="center"
                    label="账号"
                    prop="agentId"
                    :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                      {{scope.row.agentId}}
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    prop="agentName"
                    label="姓名"
                    :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                      {{scope.row.agentName}}
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    prop="sex"
                    label="性别"
                    :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                      {{showSex(scope.row.sex)}}
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    prop="departName"
                    label="所属部门"
                    :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                      {{scope.row.departName}}
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    prop="userPhone"
                    label="联系方式"
                    :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                      {{ scope.row.userPhone }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    prop="priority"
                    label="优先级"
                    :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                      <el-input size="mini" v-show="scope.row.isEdit" v-model="scope.row.priority" maxlength="5"></el-input>
                      <label v-show="!scope.row.isEdit">{{scope.row.priority}}</label>
                    </template>
                  </el-table-column>
                  <el-table-column
                    fixed="right"
                    align="center"
                    label="操作"
                    width="120">
                    <template slot-scope="scope">
                      <el-button v-show="!scope.row.isEdit" @click="handleEditStaffRelationship(scope.row)" type="text" size="small"> 修改</el-button>
                      <el-button v-show="scope.row.isEdit"  @click="handleSaveStaffRelationship(scope.row)" type="text" size="small"> 保存</el-button>
                      <el-button @click="handleDeleteStaffRelationship(scope.row)" type="text" size="small">移除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
            <el-row style="margin-top:1%;">
              <el-col :span="24">
                <el-pagination
                  @size-change="handleSizeChange1"
                  @current-change="handleCurrentChange1"
                  :current-page.sync="pagination1.pageNo"
                  :page-size="pagination1.pageSize"
                  :page-sizes="[10, 20, 30, 40, 50]"
                  layout="total, sizes, prev, pager, next, jumper "
                  :total="pagination1.totalCount" style="text-align: right">
                </el-pagination>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </div>
    </div>
    <el-dialog title="新建技能组" :visible.sync="dialogFormVisible" :width="autosize" @close="resetForm('ruleForm')" append-to-body >
      <el-form :inline="true" :model="ruleForm" ref="ruleForm" label-width="150px" class="demo-ruleForm" size="small" :rules="rules">
        <el-row>
          <el-col>
            <el-form-item label="名称:" prop="name" style="margin-right:2.2%;">
              <el-input size="small" placeholder="此处填写技能组名称"  maxlength="50" v-model='ruleForm.name' >{{ruleForm.name}}</el-input>
            </el-form-item>
            <el-form-item label="编号:" prop="code">
              <el-input size="small" placeholder="此处填写技能组编号"  maxlength="50" v-model='ruleForm.code' >{{ruleForm.code}}</el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <!-- <el-form-item label="呼叫类型:" prop="bondType">
              <el-select size="small" v-model="ruleForm.bondType" style="width:93%;" >
                <el-option label="呼出" value="0"></el-option>
                <el-option label="呼入" value="1"></el-option>
                <el-option label="呼入与呼出" value="2"></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="有效性:" prop="enabled">
              <el-switch
                v-model="ruleForm.enabled"
                style="display: block;margin-top:5px;"
                active-text="有效"
                inactive-text="无效"
                active-color="#13ce66"
                :active-value=1
                :inactive-value=0
              ></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注:">
          <textarea v-model='ruleForm.remarks' style="border:solid #DCDFE6 1px;" placeholder="此处填写配置名称简单备注，上限100字符" maxlength="100" cols="75" rows="8">{{ruleForm.remarks}}</textarea>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm');addSkillSet(ruleForm)">确定</el-button>
        <el-button @click="dialogFormVisible = false" >取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改技能组" :visible.sync="dialogFormVisibleReverse" :width="autosize" @close="resetForm('ruleFormReverse')" append-to-body >
      <el-form :inline="true" :model="ruleFormReverse" ref="ruleFormReverse" label-width="150px" class="demo-ruleFormReverse" size="small" :rules="rules">
        <el-row>
          <el-col>
            <el-form-item label="名称:" prop="name" style="margin-right:2.2%;" >
              <el-input size="small" placeholder="此处填写技能组名称"  maxlength="50" v-model='ruleFormReverse.name' >{{ruleFormReverse.name}}</el-input>
            </el-form-item>
            <el-form-item label="编号:" prop="code">
              <el-input size="small" placeholder="此处填写技能组编号"  maxlength="50" v-model='ruleFormReverse.code' >{{ruleFormReverse.code}}</el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <!-- <el-form-item label="呼叫类型:" prop="bondType">
              <el-select size="small" v-model="ruleFormReverse.bondType" style="width:93%;" >
                <el-option label="呼出" value="0"></el-option>
                <el-option label="呼入" value="1"></el-option>
                <el-option label="呼入与呼出" value="2"></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="有效性:" prop="enabled" >
              <el-switch
                v-model="ruleFormReverse.enabled"
                style="display: block;margin-top:5px;"
                active-text="有效"
                inactive-text="无效"
                active-color="#13ce66"
                :active-value=1
                :inactive-value=0
              ></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注:">
          <textarea v-model='ruleFormReverse.remarks' style="border:solid #DCDFE6 1px;" placeholder="此处填写配置名称简单备注，上限100字符" maxlength="100" cols="75" rows="8">{{ruleFormReverse.remarks}}</textarea>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleFormReverse');editSkillSet(ruleFormReverse)">确定</el-button>
        <el-button @click="dialogFormVisibleReverse = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="查看技能组" :visible.sync="dialogFormVisibleDetail" :width="autosize" @close="resetForm('ruleFormDetail')" append-to-body >
      <el-form :inline="true" :model="ruleFormDetail" ref="ruleFormDetail" label-width="150px" class="demo-ruleFormDetail" size="small">
        <el-row>
          <el-col>
            <el-form-item label="名称:" prop="name" style="margin-right:2.2%;" >
              <el-input size="small" placeholder="此处填写技能组名称" disabled maxlength="50" v-model='ruleFormDetail.name' >{{ruleFormDetail.name}}</el-input>
            </el-form-item>
            <el-form-item label="编号:" prop="code">
              <el-input size="small" placeholder="此处填写技能组编号" disabled maxlength="50" v-model='ruleFormDetail.code' >{{ruleFormDetail.code}}</el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <!-- <el-form-item label="呼叫类型:" prop="bondType">
              <el-select size="small" v-model="ruleFormDetail.bondType" style="width:93%;" disabled >
                <el-option label="呼出" value="0"></el-option>
                <el-option label="呼入" value="1"></el-option>
                <el-option label="呼入与呼出" value="2"></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="有效性:" prop="enabled" >
             <el-switch
                disabled
                v-model="ruleFormDetail.enabled"
                style="display: block;margin-top:5px;"
                active-text="有效"
                inactive-text="无效"
                active-color="#13ce66"
                :active-value=1
                :inactive-value=0
              ></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注:">
          <textarea v-model='ruleFormDetail.remarks' disabled style="border:solid #DCDFE6 1px;" placeholder="此处填写配置名称简单备注，上限100字符" maxlength="100" cols="75" rows="8">{{ruleFormDetail.remarks}}</textarea>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  type="primary" plain @click="resetForm('ruleFormDetail');dialogFormVisibleDetail= false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加坐席员工" style="margin-top:-8vh;" :visible.sync="dialogSelectStaff" width="86%" append-to-body   @close="tags=[];history_tags=[];filterText='';resetStaffInfo();">
      <div  style="min-width:986px;">
        <el-row >
          <el-col :span="4">
            <div>
              <el-input
                style="width:100%;margin:1% 0;"
                placeholder="请输入关键字"
                size="small"
                v-model="filterText"
                @change="selectStaffItem.departName=null,selectStaffItem.departId=null"
                clearable>
                <i slot="prefix" class="el-input__icon el-icon-search" ></i>
              </el-input>
            </div>
            <div style="border:solid #DCDFE6 1px;margin-top:15px;overflow:auto;max-height:587px;"  >
              <el-tree
              :style="treeDivCSS"
              class="filter-tree"
              :data="treeData"
              node-key="id"
              :props="defaultProps"
              default-expand-all
              @node-click="handleNodeClick"
              style="margin-top:5px"
              :filter-node-method="filterNode"
              ref="tree2">

              </el-tree>
            </div>
          </el-col>
          <el-col :span="14" style="margin-left:15px;">
            <div>
              <el-row :gutter="5">
                <el-collapse v-model="formContainerOpen2" class="form-container"   @change="handleChangeActive2" style="position:relative;">
                  <span class="form-more2 bold" style="line-height: 24px;font-size: 14px;float:right;margin-right:6px;color:#57AFFF;position:absolute;top:11px;right:41px;">收起</span>
                  <el-collapse-item  name="2" title="筛选条件">
                    <el-form :inline="true" class="demo-form-inline" size="small" style="margin-left:1%;">
                      <el-form-item label="姓名:">
                        <el-input placeholder="姓名" v-model="selectStaffItem.name" maxlength="45"></el-input>
                      </el-form-item>
                      <el-form-item label="账号:" >
                        <el-input placeholder="账号" v-model="selectStaffItem.accountNo" maxlength="45"></el-input>
                      </el-form-item>
                      <el-form-item label="联系方式:">
                        <el-input placeholder="联系方式" v-model="selectStaffItem.userPhone" maxlength="45"></el-input>
                      </el-form-item>
                      <el-form-item label="部门:">
                        <el-input  v-model="selectStaffItem.departName" maxlength="45" :readonly="true"></el-input>
                      </el-form-item>
                      <el-form-item>
                        <el-button type="primary" @click="searchStaffInfo(selectStaffItem,0)">查询</el-button>
                        <el-button  @click="resetStaffInfo()">重置</el-button>
                      </el-form-item>
                    </el-form>
                  </el-collapse-item>
                </el-collapse>
              </el-row>
            </div>
            <div class="table-container">
              <el-row>
                <div class="work-title-style font14 bold">员工</div>
                <span style="font-size:10px;color:red;">提示：可直接点击一行数据或勾选员工数据后点击&nbsp;&nbsp;“本次已选员工”&nbsp;&nbsp;后的&nbsp;</span><div style="display:inline;border:solid grey 1px;border-radius:50%;background-color:#57AFFF;"><i class="el-icon-d-arrow-right"></i></div><span style="font-size:10px;color:red;">&nbsp;一次性转移到本次已选员工区域。</span>
              </el-row>
              <el-row style="margin-top:10px;">
                <el-col>
                  <el-table
                    :max-height=tableHight
                    :header-row-style="headerRow"
                    :data="selectStaffTableData"
                    ref="multipleTable"
                    @selection-change="handleSelectionChange2"
                    tooltip-effect="dark"
                    @row-click="haddleRow">
                    <el-table-column
                      fixed
                      align="center"
                      type="selection"
                      width="55">
                      </el-table-column>
                    <el-table-column
                      fixed
                      align="center"
                      label="账号"
                      prop="accountNo"
                      :show-overflow-tooltip="true">
                      <template slot-scope="scope">
                        {{scope.row.accountNo}}
                      </template>
                    </el-table-column>
                    <el-table-column
                      align="center"
                      prop="name"
                      label="姓名"
                      :show-overflow-tooltip="true">
                      <template slot-scope="scope">
                        {{scope.row.staffResultInfo.name}}
                      </template>
                    </el-table-column>
                    <el-table-column
                      align="center"
                      prop="sex"
                      label="性别"
                      :show-overflow-tooltip="true">
                      <template slot-scope="scope">
                        {{showSex(scope.row.staffResultInfo.sex)}}
                      </template>
                    </el-table-column>
                    <el-table-column
                      align="center"
                      prop="departName"
                      label="归属部门"
                      :show-overflow-tooltip="true">
                      <template slot-scope="scope">
                        {{ scope.row.staffResultInfo.depart?(scope.row.staffResultInfo.depart.name?scope.row.staffResultInfo.depart.name:""):"" }}
                      </template>
                    </el-table-column>
                    <el-table-column
                      align="center"
                      prop="userPhone"
                      label="联系方式"
                      :show-overflow-tooltip="true">
                      <template slot-scope="scope">
                        {{scope.row.staffResultInfo.phone?scope.row.staffResultInfo.phone:""}}
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
              <el-row style="margin-top:1%;">
                <el-col :span="24">
                  <el-pagination
                    @size-change="handleSizeChange2"
                    @current-change="handleCurrentChange2"
                    :current-page.sync="pagination2.pageNo"
                    :page-size="pagination2.pageSize"
                    :page-sizes="[10, 20, 30, 40, 50]"
                    layout="total, sizes, prev, pager, next, jumper "
                    :total="pagination2.totalCount" style="text-align: right">
                  </el-pagination>
                </el-col>
              </el-row>

            </div>
          </el-col>
          <el-col :span="5" style="margin-left:15px;">
            <div class="work-title-style font14 bold">历史已选员工</div>
            <div style="border:solid #DCDFE6 1px;margin-top:-4px;overflow:auto;height:144px;">
              <el-tag
                size="small"
                style="margin:3px;"
                v-for="tag in history_tags"
                :key="tag.name">
                {{tag.name}}
              </el-tag>
            </div>
            <div class="work-title-style font14 bold" style="margin-top:7px;">本次已选员工<div style="display:inline;border:solid grey 1px;border-radius:50%;margin-left: 10px;background-color:#57AFFF;"><i class="el-icon-d-arrow-right" style="cursor:pointer;" @click="checkTags()"></i></div></div>
            <div style="border:solid #DCDFE6 1px;margin-top:-4px;overflow:auto;max-height:426px;" :style="tagsDivCSS">
              <el-tag
                size="small"
                style="margin:3px;"
                v-for="tag in tags"
                :key="tag.name"
                @close="handleCloseTag(tag)"
                closable>
                {{tag.name}}
              </el-tag>
            </div>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer" style="margin-right:40px;">
          <el-button type="primary" @click="addStaffSkillSet()">确定</el-button>
          <el-button @click="dialogSelectStaff = false">取消</el-button>
      </div>
    </el-dialog>
  </div>





  </div>
</template>

<script>
import { formatDateTime, list2Tree } from '@/utils/tools'
import { querySkillSetList, addSkillSet, queryOne, editSkillSet, hiddenOne, deleteOneUserSkillSet, deleteBatch, addUserSkillSet, editUserSkillSet, deleteBatchUserSkillSet } from '@/api/skillset'
import { queryDepts } from '@/api/employee_list'
import { getAccountList, getAccountListBySkillsetIdNotEqual } from '@/api/account_list'
import { Message } from 'element-ui'

var vm = null
export default {
  name: 'skillset',
  data() {
    return {
      autosize: '60%',
      formContainerOpen1: '1',
      formContainerOpen2: '1',
      filterText: '',
      treeDivCSS: {},
      tagsDivCSS: {},
      tableHight: '240', // 员工表高度
      tags: [], // 标签
      history_tags: [], // 历史标签
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      ownnerSkillSetName: '', // 所属技能组
      ownnerSkillSetId: '', // 所属技能组id
      selectStaffTableData: [],
      staffRelationshipData: [],
      selectStaffItem: {
        name: '',
        accountNo: '',
        userPhone: '',
        departId: null,
        departName: '所有部门'
      },
      staffRelationship: {},
      formInline: {},
      pagination: {},
      pagination1: {},
      pagination2: {},
      tableData: [],
      timeValue: '',
      dialogSelectStaff: false,
      dialogAddStaff: false,
      dialogFormVisible: false,
      dialogFormVisibleReverse: false,
      dialogFormVisibleDetail: false,
      ruleForm: {
        name: '',
        code: '',
        enabled: 1,
        bondType: '0',
        // priority: '',
        remarks: ''
      },
      ruleFormReverse: {
        id: '',
        name: '',
        code: '',
        enabled: 1,
        bondType: '',
        // priority: '',
        remarks: ''
      },
      ruleFormDetail: {
        id: '',
        name: '',
        code: '',
        enabled: 1,
        bondType: '',
        // priority: '',
        remarks: ''
      },
      validate: false,
      rules: {
        name: [{ required: true, message: '请填写技能组名称', trigger: 'blur' }],
        code: [{ required: true, trigger: 'blur', message: '请填写技能组编号' }],
        bondType: [{ required: true, trigger: 'change', message: '请选择呼叫类型' }],
        enabled: [{ required: true, trigger: 'change', message: '请选择有效性' }]
      }
    }
  },
  destroyed() {

  },
  mounted() {
    this.handleChangeActive1()
    this.handleChangeActive2()
    this.searchInfo(this.formInline)
    if (window.screen.width >= 1600) { this.autosize = '50%' }
    queryDepts().then(response => {
      const map = {
        data: response.data.data,
        rootId: 0,
        idFieldName: 'id',
        parentIdFielName: 'upId'
      }
      this.treeData = list2Tree(map)
      console.log('this.treeData', this.treeData)
    })
  },
  methods: {
    batchDel() { // 批量删除
      const req = {}
      const arr = []
      for (let i = 0; i < this.multipleSelection1.length; i++) {
        arr.push(this.multipleSelection1[i].id)
      }
      req.ids = arr
      req.operatorId = localStorage.getItem('agentId')
      req.operatorName = localStorage.getItem('agentName')
      if (window.confirm('确定执行批量删除操作？')) {
        deleteBatchUserSkillSet(req).then(res => {
          if (res.data.code === 1) {
            const requestParam = {}
            requestParam.skillsetId = this.ownnerSkillSetId
            this.getAccountList(requestParam)
          } else {
            console.log(res.data)
          }
        })
      }
    },
    handleDeleteStaffRelationship(row) {
      if (window.confirm('是否要删除此行数据？')) {
        const req = {}
        req.id = row.id
        req.operatorId = localStorage.getItem('agentId') ? localStorage.getItem('agentId') : ''
        req.operatorName = localStorage.getItem('agentName') ? localStorage.getItem('agentName') : ''
        req.delFlag = '0'
        deleteOneUserSkillSet(req).then(res => {
          if (res.data.code === 1) {
            const requestParam = {}
            requestParam.skillsetId = this.ownnerSkillSetId
            this.getAccountList(requestParam)
          } else {
            console.log(res.data)
          }
        })
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.name === this.ownnerSkillSetName && row.id === this.ownnerSkillSetId) {
        return 'high-light'
      }
    },
    handleSaveStaffRelationship(row) {
      row.isEdit = false
      const req = {}
      req.id = row.id
      req.operatorId = localStorage.getItem('agentId') ? localStorage.getItem('agentId') : ''
      req.operatorName = localStorage.getItem('agentName') ? localStorage.getItem('agentName') : ''
      const regex = /^(0|[1-9][0-9]*)$/
      if (regex.test(row.priority)) {
        req.priority = row.priority
      } else {
        this.$message.error('优先率只能为非负整数')
        return
      }
      editUserSkillSet(req).then(res => {
        if (res.data.code === 1) {
          const req = {}
          req.skillsetId = this.ownnerSkillSetId
          this.getAccountList(req)
        }
      })
    },
    handleEditStaffRelationship(row) {
      row.isEdit = true
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    showSex(str) {
      let result = ''
      switch (str) {
        case 1:
          result = '男'
          break
        case 0:
          result = '女'
          break
      }
      return result
    },
    addStaffSkillSet() {
      const req = {}
      req.operatorId = localStorage.getItem('agentId')
      req.operatorName = localStorage.getItem('agentName')
      const agentIds = []
      for (let i = 0; i < this.tags.length; i++) {
        agentIds.push(this.tags[i].id)
      }
      req.staffIds = agentIds
      req.skillsetId = this.ownnerSkillSetId
      req.priority = '0'
      req.delFlag = '1'
      if (agentIds.length < 1) {
        Message({
          message: '请选择员工！',
          type: 'error',
          duration: 3 * 1000
        })
        return
      }
      addUserSkillSet(req).then(res => {
        if (res.data.code === 1) {
          this.dialogSelectStaff = false
          const req = {}
          req.skillsetId = this.ownnerSkillSetId
          this.tags = []
          this.filterText = ''
          this.resetStaffInfo()
          this.getAccountList(req)
        }
      })
    },
    handleCloseTag(val) {
      this.tags.splice(this.tags.indexOf(val), 1)
    },
    checkTags() {
      const data = this.multipleSelection2
      if (data === null || typeof data === 'undefined' || data.length < 1) {
        this.$message('您还未在左边员工列表勾选员工！')
        return
      }
      const new_tags = []
      for (let i = 0; i < data.length; i++) {
        const tag = {}
        tag.id = data[i].id
        tag.name = data[i].staffResultInfo.name + '（' + data[i].accountNo + '）'
        new_tags.push(tag)
      }
      if (this.tags.length > 0) {
        const tags = this.tags
        for (let j = 0; j < new_tags.length; j++) {
          let flag = true
          for (let q = 0; q < tags.length; q++) {
            if (new_tags[j].id === tags[q].id) {
              flag = false
              break
            }
          }
          if (flag) {
            this.tags.push(new_tags[j])
          }
        }
      } else {
        this.tags = new_tags
      }
    },
    haddleRow(val) {
      console.log('val', val)
      const tag = {}
      tag.name = val.staffResultInfo.name + '（' + val.accountNo + '）'
      tag.id = val.id
      if (this.tags.length > 0) {
        let flag = true
        for (let i = 0; i < this.tags.length; i++) {
          if (this.tags[i].id === tag.id) {
            flag = false
            break
          }
        }
        if (flag) {
          this.tags.push(tag)
        }
      } else {
        this.tags.push(tag)
      }
    },
    resetStaffInfo() {
      this.selectStaffItem.name = ''
      this.selectStaffItem.accountNo = ''
      this.selectStaffItem.userPhone = ''
      this.selectStaffItem.departName = '所有部门'
      this.selectStaffItem.departId = null
      this.pagination2.pageNo = 1
      this.pagination2.pageSize = 10
    },
    handleNodeClick(data) {
      // 先清空筛选条件下的条件内容
      this.resetStaffInfo()
      const req = {}
      req.departName = data.name
      req.departId = data.id
      this.selectStaffItem.departName = data.name
      this.selectStaffItem.departId = data.id
      this.searchStaffInfo(req, 1)
      // if (req.departId === null) {
      //   this.$message('部门id为空默认查询所有')
      // }
    },
    queryStaff(res) {
      this.selectStaffTableData = res.data.data
      console.log('this.selectStaffTableData', this.selectStaffTableData)
      this.pagination2 = res.data.pageInfo
    },
    searchStaffInfo(req, val) {
      const param = { name: '', userPhone: '', departId: null, staffNo: '', accountNo: '' }
      param.name = req.name
      param.userPhone = req.userPhone
      param.departId = req.departId
      param.staffNo = req.staffNo
      param.accountNo = req.accountNo
      param.pageNo = req.pageNo ? req.pageNo : 1
      param.pageSize = req.pageSize ? req.pageSize : (this.pagination2.pageSize ? this.pagination2.pageSize : 10)
      param.skillsetId = this.ownnerSkillSetId
      getAccountListBySkillsetIdNotEqual(param).then(response => {
        this.queryStaff(response)
      })
      // if (val === 0) {
      //   queryUserSkillSet(param).then(response => {
      //     this.queryStaff(response)
      //   })
      // } else {
      //   queryUserSkillSetByDepart(param).then(res => {
      //     this.queryStaff(res)
      //   })
      // }
    },
    resetFormInline() {
      this.formInline = {}
    },
    showBondType(str) {
      let result = ''
      switch (str) {
        case '0':result = '呼出'
          break
        case '1':result = '呼入'
          break
        case '2':result = '呼入与呼出'
          break
      }
      return result
    },
    showTime(obj) {
      return formatDateTime(obj) ? formatDateTime(obj) : ''
    },
    deleteAll() {
      if (typeof this.multipleSelection === 'undefined') {
        this.$message.error('还未选中条目！')
        return
      }
      const ids = []
      this.multipleSelection.map(function(item, index) {
        ids.push(item.id)
      })
      if (ids.length < 1) {
        this.$message.error('还未选中需要删除的条目！')
        return
      }
      if (window.confirm('确定要执行批量删除吗？')) {
        const obj = {}
        obj.operatorId = localStorage.getItem('agentId')
        obj.operatorName = localStorage.getItem('agentName')
        obj.ids = ids
        deleteBatch(obj).then(res => {
          if (res.data.code === 1) {
            this.closeMinorBoard()// 先关闭右侧技能组，防止删除了关联技能组还展示了数据
            this.searchInfo(this.formInline)
          } else {
            this.$message.error(res.data.message)
          }
        })
      }
    },
    addStaff() {
      vm = this
      this.dialogSelectStaff = true
      this.resetStaffInfo()
      this.searchStaffInfo(this.selectStaffItem)
      const req = {}
      req.skillsetId = this.ownnerSkillSetId
      req.pageable = false
      getAccountList(req).then(res => {
        if (res.data && res.data.data.length > 0) {
          const data = res.data.data

          for (let i = 0; i < data.length; i++) {
            const temp_tag = {}
            temp_tag.id = data[i].id
            temp_tag.name = (data[i].staffResultInfo.name ? data[i].staffResultInfo.name : '') + '（' + (data[i].accountNo ? data[i].accountNo : '') + '）'
            vm.history_tags.push(temp_tag)
          }
        }
      })
      let body_height = document.body.clientHeight
      this.treeDivCSS.height = '340px'
      this.tableHight = '198'
      this.tagsDivCSS.height = '186px'
      window.onresize = function resize() {
        body_height = document.body.clientHeight
        vm.treeDivCSS.height = (85 * parseInt(body_height) / 100 - 533) > 0 ? (85 * parseInt(body_height) / 100 - 193) + 'px' : '340px'
        vm.tableHight = (85 * parseInt(body_height) / 100 - 685) > 0 ? (85 * parseInt(body_height) / 100 - 335) : '198'
        vm.tagsDivCSS.height = (85 * parseInt(body_height) / 100 - 526) > 0 ? (85 * parseInt(body_height) / 100 - 348) + 'px' : '186px'
      }
    },
    closeMinorBoard() {
      this.dialogAddStaff = false
      this.ownnerSkillSetId = null
      document.getElementById('main-board').classList.remove('show-half')
    },
    handleAddStaff(obj) {
      this.staffRelationshipData = []
      if (!this.dialogAddStaff) {
        this.dialogAddStaff = true
        document.getElementById('main-board').className += ' show-half'
      }
      this.ownnerSkillSetName = obj.name
      this.ownnerSkillSetId = obj.id
      const req = {
        'skillsetId': obj.id
      }
      this.getAccountList(req)
    },
    getAccountList(obj) {
      this.staffRelationshipData = []
      this.pagination1 = { 'pageNo': 0, 'pageSize': this.pagination1.pageSize, 'totalCount': 0 }
      getAccountList(obj).then(res => {
        if (res.data.code === 1 && res.data.data.length > 0) {
          const data = res.data.data
          console.log('15151515', data)
          for (let i = 0; i < data.length; i++) {
            const shipData = {}
            if (data[i].staffResultInfo) {
              shipData.agentId = data[i].accountNo ? data[i].accountNo : ''
              shipData.agentName = data[i].staffResultInfo.name ? data[i].staffResultInfo.name : ''
              shipData.sex = data[i].staffResultInfo.sex
              shipData.departName = data[i].staffResultInfo.depart ? (data[i].staffResultInfo.depart.name ? data[i].staffResultInfo.depart.name : '') : ''
              shipData.userPhone = data[i].staffResultInfo.phone ? data[i].staffResultInfo.phone : ''
              shipData.isEdit = false
            }
            shipData.id = data[i].userSkillSetResultInfo[0].id
            shipData.priority = data[i].userSkillSetResultInfo[0].priority
            this.staffRelationshipData.push(shipData)
          }
          this.pagination1 = res.data.pageInfo
        }
      })
    },
    handleDelete(obj) {
      if (window.confirm('确认删除此项？')) {
        const id = obj.id
        const operatorId = localStorage.getItem('agentId')
        hiddenOne({ 'id': id, 'operatorId': operatorId, 'delFlag': '0' }).then(res => {
          if (res.data.code === 1) {
            this.closeMinorBoard()// 防止删除了技能组，导致页面展示信息
            this.searchInfo(this.formInline)
          } else {
            this.$message.error(res.data.message)
          }
        })
      }
    },
    handleQuery(obj) {
      this.dialogFormVisibleDetail = true
      const id = obj.id
      queryOne({ 'id': id }).then(res => {
        if (res.data.code === '1') {
          this.ruleFormDetail = res.data.data
          this.ruleFormDetail.enabled = parseInt(res.data.data.enabled)
        }
      })
    },
    handleEdit(obj) {
      this.dialogFormVisibleReverse = true
      const id = obj.id
      queryOne({ 'id': id }).then(res => {
        if (res.data.code === '1') {
          this.ruleFormReverse = res.data.data
          this.ruleFormReverse.enabled = parseInt(res.data.data.enabled)
        }
      })
    },
    editSkillSet(ruleFormReverse) {
      if (this.validate) {
        ruleFormReverse.operatorId = localStorage.getItem('agentId')
        ruleFormReverse.operatorName = localStorage.getItem('agentName')
        editSkillSet(ruleFormReverse).then(res => {
          if (res.data.code === 1) {
            this.dialogFormVisibleReverse = false
            this.searchInfo(this.formInline)
          } else {
            this.$message(res.data.message)
          }
        })
      } else {
        return false
      }
    },
    addSkillSet(ruleForm) {
      if (this.validate) {
        ruleForm.creator = ruleForm.creator ? ruleForm.creator : localStorage.getItem('agentId')
        ruleForm.operatorId = localStorage.getItem('agentId')
        ruleForm.operatorName = localStorage.getItem('agentName')
        addSkillSet(ruleForm).then(res => {
          if (res.data.code === 1) {
            this.dialogFormVisible = false
            this.resetForm('ruleForm')
            this.searchInfo(this.formInline)
          } else {
            this.$message(res.data.message)
          }
        })
      } else {
        return false
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
    resetForm(obj) {
      this.$refs[obj].resetFields()
      switch (obj) {
        case 'ruleForm':this.ruleForm = {
          name: '',
          code: '',
          enabled: 1,
          bondType: '0',
          remarks: ''
        }
          break
        case 'ruleFormReverse':this.ruleFormReverse = {
          name: '',
          code: '',
          enabled: 1,
          bondType: '0',
          remarks: ''
        }
          break
        case 'ruleFormDetail':this.ruleFormDetail = {
          name: '',
          code: '',
          enabled: 1,
          bondType: '0',
          remarks: ''
        }
          break
      }
    },
    addRuleFormPage() { // 打开新增页面
      this.dialogFormVisible = true
    },
    searchInfo(obj) {
      const requestParam = {}
      requestParam.name = obj.name ? obj.name : null
      requestParam.code = obj.code ? obj.code : null
      requestParam.bondType = obj.bondType === '' ? null : obj.bondType
      requestParam.enabled = obj.enabled === '' ? null : obj.enabled
      requestParam.modifier = obj.modifier ? obj.modifier : null
      requestParam.modifierTimeStart = obj.timeValue ? obj.timeValue[0] : null
      requestParam.modifierTimeEnd = obj.timeValue ? obj.timeValue[1] : null
      requestParam.pageNo = obj.pageNo ? obj.pageNo : 1
      requestParam.pageSize = obj.pageSize ? obj.pageSize : 10

      querySkillSetList(requestParam).then(res => {
        if (res.data.code === 1) {
          this.tableData = res.data.data
          this.pagination = res.data.pageInfo
        }
      })
    },
    headerRow({ row, rowIndex }) {
      if (rowIndex === 0) {
        return 'color:black'
      } else {
        return ''
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSizeChange(val) {
      this.formInline.pageNo = 1
      this.formInline.pageSize = val
      this.pagination.pageNo = 1
      this.searchInfo(this.formInline)
    },
    handleCurrentChange(val) {
      this.formInline.pageNo = val
      this.searchInfo(this.formInline)
    },
    handleSelectionChange1(val) {
      this.multipleSelection1 = val
    },
    handleSizeChange1(val) {
      this.staffRelationshipData = []
      const req = {}
      req.skillsetId = this.ownnerSkillSetId
      req.pageNo = 1
      req.pageSize = val
      this.getAccountList(req)
    },
    handleCurrentChange1(val) {
      this.staffRelationshipData = []
      const req = {}
      req.skillsetId = this.ownnerSkillSetId
      req.pageNo = val
      req.pageSize = this.pagination1.pageSize
      this.getAccountList(req)
    },
    handleSelectionChange2(val) {
      this.multipleSelection2 = val
    },
    handleSizeChange2(val) {
      this.selectStaffItem.pageSize = val
      this.selectStaffItem.pageNo = 1
      this.searchStaffInfo(this.selectStaffItem, 1)
    },
    handleCurrentChange2(val) {
      this.selectStaffItem.pageNo = val
      this.searchStaffInfo(this.selectStaffItem, 1)
    },
    handleChangeActive1(active = ['1']) {
      if (active.length) {
        $('.form-more1').text('收起')
      } else {
        $('.form-more1').text('更多')
      }
    },
    handleChangeActive2(active = ['1']) {
      if (active.length) {
        $('.form-more2').text('收起')
      } else {
        $('.form-more2').text('更多')
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
@media screen and (min-width: 1281px) and (max-width:1367px){
  .work-bench .font30 {
    font-size: 27px !important;
  }
}
@media all and (min-width:1024px) and (max-width:1280px)  {
  .work-bench .font30 {
    font-size: 25px !important;
  }
}
.show-half{
  display:inline-block;
  width:50%;
}
.pull-right{
  float: right;
}

// .treeDiv-768{
//   height: 432px;
// }
// .tagsDiv-768{
//   height: 440px;
// }
// .treeDiv-normal{
//   height: 522px;
// }
// .tagsDiv-normal{
//   height: 530px;
// }
.el-table .high-light{
  background-color: #ECF5FF
}

</style>
