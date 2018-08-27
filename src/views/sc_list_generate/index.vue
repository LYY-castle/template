<template>
  <div class="container">
    <el-row margin-top:>
      <el-form :inline="true" size="small" >
        <el-form-item>
          <el-input v-model="req.listId" placeholder="名单编号" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="req.listName" placeholder="名单名称" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="req.modifierName" placeholder="操作人员" ></el-input>
        </el-form-item>
        <el-form-item label="操作时间:">
          <el-date-picker
              v-model="req.startCreateTime"
              type="datetime"
              placeholder="开始日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="00:00:00">
          </el-date-picker>
          到
          <el-date-picker
              v-model="req.endCreateTime"
              type="datetime"
              placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="00:00:00">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="req2=clone(req);req.pageNo=1;searchNamelist(req)" icon="el-icon-search">查询</el-button>
          <el-button type="danger" @click="clearForm(req);req2=clone(req);">重置</el-button>
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
              <div>{{scope.$index+(pageInfo.pageNo-1)*pageInfo.pageSize+1}}</div>
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
          </el-table-column>
          <el-table-column
            align="center"
            prop="modifierTime"
            label="分配状态">
            <template slot-scope="scope">
              <div>{{scope.row.assignStatus===0?'已分配':'未分配'}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="100">1
          <template slot-scope="scope">
            <el-button @click="editVisible=true;delReq.listId=scope.row.listId;searchByListId(delReq);" type="text" size="small">修改</el-button>
            <el-button @click="delVisible=true;delReq.listId=scope.row.listId" type="text" size="small">删除</el-button>
          </template>
          </el-table-column>
        </el-table>
      </el-col> 
    </el-row>
    <el-row style="margin-top:5px;">
        <el-button type="success" size="small" @click="addVisible=true;addNamelist.listName='';namelistPageInfo.pageSize=10;searchBatch.pageSize=10;searchBatch.pageNo=1;getBatch(searchBatch);clearForm(searchBatch);searchBatch.validityStatus=0">新建名单</el-button>
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
    <el-dialog
      align:left
      width="30%"
      title="修改名单"
      :visible.sync="editVisible"
      append-to-body>
      <el-form label-width="100px" :model="namelistDetail" ref="editNamelist">
        <el-form-item label="名单编号">
          <span>{{namelistDetail.listId}}</span>
        </el-form-item>
        <el-form-item label="名单名称" prop="listName">
          <el-input v-model="namelistDetail.listName" size="small" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="名单数量" prop="listnameNumber">
          <span>{{namelistDetail.listnameNumber}}</span>
        </el-form-item>
        <el-form-item label="操作人员" prop="modifierName">
          <span>{{namelistDetail.modifierName}}</span>
        </el-form-item>
        <el-form-item label="操作时间" prop="modifierTime">
          <span>{{namelistDetail.modifierTime}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: right;">
        <el-button type="danger" @click="searchByListId(delReq);">重 置</el-button>
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editNamelist()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      top="5vh"
      width="90%"
      :visible.sync="addVisible"
      append-to-body>
      <div slot="title" style="text-align: center;">
        <el-button @click="addVisible = false;" style="float:left;" icon="el-icon-arrow-left">返 回</el-button>
        <h3 style="display:inline;text-align:center;">添加名单</h3>
      </div>
      <el-row>
        <el-form :inline="true" size="small">
          <el-form-item>
            <el-input v-model="searchBatch.batchId" placeholder="批次号" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="searchBatch.batchName" placeholder="批次名称" maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="操作时间：">
            <el-date-picker
                v-model="searchBatch.startCreateTime"
                type="datetime"
                placeholder="开始日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                default-time="00:00:00">
            </el-date-picker>
            到
            <el-date-picker
                v-model="searchBatch.endCreateTime"
                type="datetime"
                placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                default-time="00:00:00">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchBatch2=clone(searchBatch);searchBatch.pageNo=1;getBatch(searchBatch)" icon="el-icon-search">查询</el-button>
            <el-button type="danger" @click="clearForm2();searchBatch.validityStatus=0;searchBatch2=clone(searchBatch)">重置</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <el-table
          :data="batchTableData"
          border
          @selection-change="namelistSelectionChange">
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
              <div>{{scope.$index+(namelistPageInfo.pageNo-1)*namelistPageInfo.pageSize+1}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="batchId"
            label="批次号">
          </el-table-column>
          <el-table-column
            align="center"
            prop="batchName"
            label="批次名称">
          </el-table-column>
          <el-table-column
            align="center"
            prop="validityTime"
            label="有效期">
          </el-table-column>
          <el-table-column
            align="center"
            prop="customerNumber"
            label="导入数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="successNumber"
            label="可用数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="modifierName"
            label="可用性">
            <template
              slot-scope="scope">
              <div>{{scope.row.validityStatus == 0 ? '可用':'不可用'}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="modifierTime"
            label="操作时间">
            <template 
              slot-scope="scope">
              <div>{{scope.row.modifierTime}}</div>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <div slot="footer" style="text-align: right;">
        <el-pagination
          v-if="pageShow2"
          background
          @size-change="namelistSizeChange"
          @current-change="namelistPageChange"
          :current-page='namelistPageInfo.pageNo'
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size='namelistPageInfo.pageSize'
          layout="total, sizes, prev, pager, next, jumper "
          :total='namelistPageInfo.totalCount' style="text-align:right;float:left;">
        </el-pagination>
        <el-form :inline="true" size="small" :model="addNamelist" ref="addNamelist" :rules="rule">
          <el-form-item prop="listName"> 
            <el-input v-model="addNamelist.listName" placeholder="名单名称" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="submitForm('addNamelist');newNamelist(addNamelist)">确 定</el-button>
            <el-button @click="addVisible = false;">取 消</el-button>
          </el-form-item>
        </el-form>
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
      <el-button type="primary" @click="batchDelVisible = false;batchDelNamelist(batchDelReq);">确 定</el-button>
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
      <el-button type="primary" @click="delVisible = false;delNamelist(delReq);">确 定</el-button>
    </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  queryNamelist,
  addNamelist,
  queryByListId,
  editNamelist,
  delList,
  batchDelList
} from '@/api/sc_list_generate'
import { queryBatch } from '@/api/batch_management'
import { rule } from '@/utils/validate'
import { clone } from '@/utils/tools'

export default {
  name: 'scListGenerate',
  data() {
    return {
      rule: rule,
      detailVisible: false,
      delVisible: false, // 删除对话框显示隐藏
      editVisible: false, // 修改对话框显示隐藏
      addVisible: false, // 添加对话框显示隐藏
      batchDelVisible: false, // 批量删除对话框显示隐藏
      tableData: [], // 表格数据
      batchTableData: [], // 批次表格
      validate: true, // 验证不通过阻止发请求
      pageShow: false, // 分页显示隐藏
      pageShow2: false, // 分页显示隐藏
      namelistDetail: {},
      delReq: {
        listId: ''
      },
      batchDelReq: {
        idlist: []
      },
      // 查询 发送请求参数
      req: {
        listId: '',
        listName: '',
        modifierName: '',
        startCreateTime: '',
        endCreateTime: '',
        pageNo: 1,
        pageSize: 10
      },
      req2: {
        listId: '',
        listName: '',
        modifierName: '',
        startCreateTime: '',
        endCreateTime: '',
        pageNo: 1,
        pageSize: 10
      },
      searchBatch: {
        batchId: '',
        batchName: '',
        validityStatus: 0,
        createAuthor: '',
        startCreateTime: '',
        endCreateTime: '',
        pageSize: 10,
        pageNo: 1
      },
      searchBatch2: {
        batchId: '',
        batchName: '',
        validityStatus: 0,
        createAuthor: '',
        startCreateTime: '',
        endCreateTime: '',
        pageSize: 10,
        pageNo: 1
      },
      addNamelist: {
        listName: '',
        batchIds: [],
        assignStatus: 1
      },
      editReq: {
        listId: '',
        listName: '',
        modifierName: '',
        modifierTime: ''
      },
      // editNamelist: {},
      // 分页数据
      pageInfo: {},
      // 新建名单分页
      namelistPageInfo: {}
    }
  },
  mounted() {
    this.searchNamelist(this.req)
  },
  methods: {
    // 深度克隆
    clone: clone,
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
          this.validate = false
        }
      })
    },
    // 清空重置
    clearForm(obj, formName) {
      this.req = {
        listId: '',
        listName: '',
        modifierName: '',
        startCreateTime: '',
        endCreateTime: '',
        pageNo: this.pageInfo.pageNo,
        pageSize: this.pageInfo.pageSize
      }
      this.req2 = {
        listId: '',
        listName: '',
        modifierName: '',
        startCreateTime: '',
        endCreateTime: '',
        pageNo: this.pageInfo.pageNo,
        pageSize: this.pageInfo.pageSize
      }
    },
    clearForm2() {
      this.searchBatch = {
        batchId: '',
        batchName: '',
        validityStatus: 0,
        createAuthor: '',
        startCreateTime: '',
        endCreateTime: '',
        pageSize: this.namelistPageInfo.pageSize,
        pageNo: this.namelistPageInfo.pageNo
      }
      this.searchBatch2 = {
        batchId: '',
        batchName: '',
        validityStatus: 0,
        createAuthor: '',
        startCreateTime: '',
        endCreateTime: '',
        pageSize: this.namelistPageInfo.pageSize,
        pageNo: this.namelistPageInfo.pageNo
      }
    },
    // 查询名单信息
    searchNamelist(req) {
      queryNamelist(req)
        .then(response => {
          if (response.data.code === 0) {
            this.tableData = response.data.data
            // this.$set(this.tableData, response.data.data)
            if (response.data.pageInfo) {
              this.pageInfo = response.data.pageInfo
              this.pageShow = true
            } else {
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
        })
    },
    getBatch(req) {
      console.log(111)
      console.log(req)
      queryBatch(req)
        .then(response => {
          if (response.data.code === 0) {
            if (response.data.data) {
              this.batchTableData = response.data.data
              this.namelistPageInfo = response.data.pageInfo
              this.pageShow2 = true
            } else {
              this.batchTableData = response.data.data
              this.pageShow2 = false
            }
          } else {
            this.$message(response.data.message)
            this.pageShow2 = false
          }
        })
        .catch(error => {
          console.log(error)
          this.$message('操作失败')
        })
    },
    // 删除名单信息
    delNamelist(listId) {
      delList(listId)
        .then(response => {
          if (response.data.code === 0) {
            this.$message.success(response.data.message)
            this.req2.pageNo = 1
            this.pageInfo.pageNo = 1
            this.searchNamelist(this.req2)
          } else {
            this.$message(response.data.message)
          }
        })
        .catch(error => {
          console.log(error)
          this.$message('删除失败')
        })
    },
    // 查询名单详情
    searchByListId(listId) {
      queryByListId(listId)
        .then(response => {
          if (response.data.code === 0) {
            this.namelistDetail = response.data.data
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 修改名单信息
    editNamelist() {
      this.editVisible = false
      this.editReq.listId = this.namelistDetail.listId
      this.editReq.listName = this.namelistDetail.listName
      this.editReq.modifierName = this.namelistDetail.modifierName
      this.editReq.modifierTime = this.namelistDetail.modifierTime
      editNamelist(this.editReq).then(response => {
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
          this.searchNamelist(this.req2)
        } else {
          this.$message(response.data.message)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 添加名单
    newNamelist(addReq) {
      if (!this.validate) {
        this.$message.error('请输入名单名称')
        return false
      }
      if (this.addNamelist.batchIds.length === 0) {
        this.$message.error('请选择需要生成名单的批次')
        return false
      }
      this.addVisible = false
      addNamelist(addReq).then(response => {
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
          setTimeout(() => {
            this.searchNamelist(this.req2)
          }, 500)
        } else {
          this.$message('添加失败')
        }
      }).catch(error => {
        this.$message('添加失败')
        console.log(error)
      })
    },
    // 批量删除
    batchDelNamelist(batchDelReq) {
      if (batchDelReq.idlist.length === 0) {
        this.$message.error('请选择需要删除的内容')
      } else {
        batchDelList(batchDelReq.idlist).then(response => {
          if (response.data.code === 0) {
            this.$message.success(response.data.message)
            this.req2.pageNo = 1
            this.pageInfo.pageNo = 1
            this.searchNamelist(this.req2)
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
      this.batchDelReq.idlist.length = 0
      for (var i = 0; i < val.length; i++) {
        this.batchDelReq.idlist.push(val[i].listId)
      }
    },
    namelistSelectionChange(val) {
      this.addNamelist.batchIds.length = 0
      for (var i = 0; i < val.length; i++) {
        this.addNamelist.batchIds.push(val[i].batchId)
      }
    },
    // 页面显示条数
    handleSizeChange(val) {
      this.req.pageSize = val
      this.req2.pageSize = val
      this.req2.pageNo = 1
      this.pageInfo.pageNo = 1
      this.searchNamelist(this.req2)
    },
    namelistSizeChange(val) {
      this.searchBatch.pageSize = val
      this.searchBatch2.pageSize = val
      this.searchBatch2.pageNo = 1
      this.namelistPageInfo.pageNo = 1
      this.getBatch(this.searchBatch2)
    },
    // 分页翻页功能
    handleCurrentChange(val) {
      this.req2.pageNo = val
      this.searchNamelist(this.req2)
    },
    namelistPageChange(val) {
      this.searchBatch2.pageSize = this.namelistPageInfo.pageSize
      this.searchBatch2.pageNo = val
      this.getBatch(this.searchBatch2)
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
</style>
