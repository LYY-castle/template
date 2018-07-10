<template>
  <div class="container campaignManagement" style="padding:0 20px;">
    <!-- <el-row>
      <h3>当前位置:活动管理</h3>
    </el-row> -->
    <el-row margin-top:>
      <el-form :inline="true" size="small" :model="req" ref="searchForm">
        <el-form-item prop="campaignName">
          <el-input v-model="req.campaignName" placeholder="活动名称"></el-input>
        </el-form-item>
        <el-form-item label="活动状态" prop="status">
          <el-radio-group v-model="req.status" size="small">
            <el-radio label='0'>有效</el-radio>
            <el-radio label='1'>无效</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="req.num=1;findCampaignByConditions(req);" icon="el-icon-search">查询</el-button>
          <el-button type="danger" @click="resetForm('searchForm');">重置</el-button>
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
              <div>{{scope.$index+(req.num-1)*10+1}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="campaignId"
            label="活动编号">
          </el-table-column>
          <el-table-column
            align="center"
            label="活动名称">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="detailVisible=true;getDeptByCampaignId(scope.row.campaignId);getMarksByCampaignId(scope.row.campaignId);getCampaignById(scope.row.campaignId);">{{scope.row.campaignName}}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="名单有效期">
            <template slot-scope="scope">
              <div>{{scope.row.listExpiryDate+'天'}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="modifierName"
            label="操作人">
          </el-table-column>
          <el-table-column
            align="center"
            prop="modifierName"
            label="有效性">
            <template slot-scope="scope">
              <div>{{(scope.row.status == 0) ? '有效':'无效'}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="modifyTime"
            label="操作时间">
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="200">1
          <template slot-scope="scope">
            <el-button @click="editVisible=true;delReq.campaignId=scope.row.campaignId;getDeptByCampaignId(scope.row.campaignId);getMarksByCampaignId(scope.row.campaignId);getCampaignById(scope.row.campaignId);" type="text" size="small">修改</el-button>
            <el-button @click="delVisible=true;delReq.campaignId=scope.row.campaignId" type="text" size="small">删除</el-button>
            <el-button @click="changeVisible=true;delReq.campaignId=scope.row.campaignId;delReq.status=scope.row.status;" type="text" size="small">{{scope.row.status==='0'?'禁用':'启用'}}</el-button>
            <el-button @click="campaignName=scope.row.campaignName;nameListExclude.campaignId=scope.row.campaignId;nameLists.campaignId=scope.row.campaignId;addList=true;nameListExclude.pageNo = 1;nameLists.pageNo = 1;getNameLists(nameLists);getNameListExclude(nameListExclude)" type="text" size="small">添加名单</el-button>
          </template>
          </el-table-column>
        </el-table>
      </el-col> 
    </el-row>
    <el-row style="margin-top:5px;">
        <el-button type="success" size="small" @click="addVisible=true;resetForm('campaignDetail')">添加</el-button>
        <el-button type="danger" size="small" @click="batchDelVisible=true">批量删除</el-button>
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page=pageInfo.pageNo
          :page-sizes="[10, 20, 30, 50]"
          :page-size=pageInfo.pageSize
          layout="total, prev, pager, next, jumper"
          :total=pageInfo.totalCount style="text-align: right;float:right;">
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
        <el-form-item label="产品" prop="productIds">
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
      width="20%"
      title="活动信息详情"
      :visible.sync="detailVisible"
      append-to-body>
      <el-form label-width="100px" >
        <el-form-item label="活动名称">
          <span>{{campaignDetail.campaignName}}</span>
        </el-form-item>
        <el-form-item label="产品">
          <span v-for="item in productName">{{item+' , '}}</span>
        </el-form-item>
        <el-form-item label="名单有效期">
          <span>{{campaignDetail.listExpiryDate+'天'}}</span>
        </el-form-item>
        <el-form-item label="活动状态">
          <span>{{campaignDetail.status===0?'无效':'有效'}}</span>
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
        <el-form-item label="产品" prop="productIds">
          <el-select v-model="campaignDetail.productIds" multiple placeholder="请选择产品" style="width: 100%;">
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
            <el-button type="primary" @click="getNameLists(nameLists);getNameListExclude(nameListExclude)" icon="el-icon-search">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <el-row>
          <h2 style="display:inline">可选名单列表</h2>
          <el-pagination
            background
            @current-change="nameListExcludeChange"
            :current-page=nameListExcludePageinfo.pageNo
            :page-sizes="[10, 20, 30, 50]"
            :page-size=nameListExcludePageinfo.pageSize
            layout="total, prev, pager, next, jumper"
            :total=nameListExcludePageinfo.totalCount style="text-align: right;float:right;">
          </el-pagination>
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
              <div>{{scope.$index+(nameListExcludePageinfo.pageNo-1)*10+1}}</div>
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
        <el-row style="margin-top:1%;">
          <h2 style="display:inline" >已选名单列表</h2>
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
          border>
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
        </el-table>
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
  changeCampaignStatus
} from '@/api/campaign'// 侧边栏菜单
import {
  getMenu,
  queryCampaign,
  addCampaign,
  findCampaignById,
  delCampaigns,
  delCampaignById,
  showNameListsById,
  findNameListExcludeById,
  assignCampaignAndList
} from '@/api/campaign_management'
import { formatDateTime } from '@/utils/tools'

export default {
  name: 'campaignManagement',
  data() {
    // 有效时间不能超过365天
    var checkExpiryDate = (eule, value, callback) => {
      if (value > 365) {
        return callback(new Error('有效时间不能超过365天'))
      }
      if (!/^\d+$/.test(value)) {
        return callback(new Error('请输入数字'))
      } else {
        callback()
      }
    }
    return {
      rule: {
        listExpiryDate: [
          { validator: checkExpiryDate, trigger: 'blur' }
        ]
      },
      asd: [],
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
      // nameListExcludePage: false,//可选名单分页
      // nameListPage: false,//已选名单分页
      productData: [], // 产品
      deptData: [], // 活动组织
      qcdeptData: [], // 质检组织
      summaryData: [], // 小结
      marksData: [], // 评分表
      productName: [], // 产品名称
      departName: '', // 活动组织名称
      summaryName: '', // 小结名称
      campaignName: '', // 活动名称
      delReq: {
        campaignId: ''
      },
      batchDelReq: {
        campaignIds: []
      },
      // 查询 发送请求参数
      req: {
        campaignName: '',
        status: '0',
        pagesize: 10,
        num: 1
      },
      campaignDetail: {
        productIds: [],
        products: [],
        deptId: [],
        summaryId: [],
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
      nameListsPageinfo: {},
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
  },
  beforeCreate() {
    getMenu()
      .then(response => {
        const data = response.data
        sessionStorage.setItem('getMenu', JSON.stringify(data))
      })
      .catch(error => {
        console.log(error)
      })
  },
  methods: {
    // 时间戳转年月日时分秒
    formatDateTime: formatDateTime,
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
    // 查询活动信息
    findCampaignByConditions(req) {
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
            this.$message(response.data.messages)
            this.tableData = response.data.data
            this.pageShow = false
          }
        })
        .catch(error => {
          console.log(error)
          this.$message('操作失败')
        })
    },
    // 删除活动信息
    delCampaign(campaignId) {
      delCampaignById(campaignId)
        .then(response => {
          if (response.data.code === 0) {
            this.$message.success(response.data.message)
            this.findCampaignByConditions(this.req)
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
          }
          // 遍历查找对应产品名称
          this.productName.length = 0
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
              // console.log(this.deptData[a].id)
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
          this.findCampaignByConditions(this.req)
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
        this.qcdeptData.length = 0
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
      this.addVisible = false
      addCampaign(campaignDetail).then(response => {
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
          this.findCampaignByConditions(this.req)
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
            this.findCampaignByConditions(this.req)
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
    // 切换活动状态
    changeStatus(status) {
      if (status.status === '0') {
        status.status = '1'
      } else {
        status.status = '0'
      }
      changeCampaignStatus(status).then(response => {
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
          this.findCampaignByConditions(this.req)
        } else {
          this.$message(response.data.message)
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
          this.nameListsTable = response.data.data
          if (response.data.pageInfo !== undefined && response.data.pageInfo !== null) {
            this.nameListsPageinfo = response.data.pageInfo
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
          this.nameListExcludeTablel = response.data.data
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
          this.addNameList.listIds = this.addNameList.listIds.split(',')
          this.addList = false
        } else {
          this.$message(response.data.message)
          this.addNameList.listIds = this.addNameList.listIds.split(',')
        }
      }).catch(error => {
        console.log(error)
        this.$message('操作失败')
      })
    },
    // 页面显示条数
    // handleSizeChange(val) {
    //   // console.log(`每页 ${val} 条`);
    //   this.searchReq.pageSize = val
    //   this.searchCustomer(this.req)
    // },
    // 分页翻页功能
    // 活动管理
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.req.num = val
      this.findCampaignByConditions(this.req)
    },
    // 添加名单分页
    // 可选名单
    nameListExcludeChange(val) {
      // console.log(`当前页: ${val}`);
      this.nameListExclude.pageNo = val
      this.getNameListExclude(this.nameListExclude)
    },
    // 已选名单
    nameListChange(val) {
      // console.log(`当前页: ${val}`);
      this.nameLists.pageNo = val
      this.getNameLists(this.NameLists)
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
