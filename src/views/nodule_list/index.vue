<template>
  <div class="container">
    <el-row margin-top:>
      <el-form :inline="true" size="small">
        <el-form-item>
          <el-input v-model="req.nodule_title" placeholder="小结标题" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="req.modify_name" placeholder="修改人" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="修改时间：">
          <el-date-picker
              v-model="req.startCreateTime"
              type="datetime"
              placeholder="开始日期"
              value-format="yyyy-MM-dd hh:mm:ss"
              default-time="00:00:00">
          </el-date-picker>
          到
          <el-date-picker
              v-model="req.endCreateTime"
              type="datetime"
              placeholder="结束日期"
              value-format="yyyy-MM-dd hh:mm:ss"
              default-time="00:00:00">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="req2=clone(req);req.pageNo=1;getNoduleByInfo(req)" icon="el-icon-search">查询</el-button>
          <el-button type="danger" @click="reset">重置</el-button>
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
            prop="summaryId"
            label="小结编号">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="detailVisible=true;delReq.noduleId=scope.row.summaryId;findNoduleByNoduleId(delReq);">{{scope.row.summaryId}}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="summaryName"
            label="小结名称">
          </el-table-column>
          <el-table-column
            align="center"
            prop="description"
            label="备注">
          </el-table-column>
          <el-table-column
            align="center"
            prop="modifierName"
            label="修改人">
          </el-table-column>
          <el-table-column
            align="center"
            prop="modifyTime"
            label="修改时间">
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="100">
          <template slot-scope="scope">
            <el-button @click="editVisible=true;delReq.noduleId=scope.row.summaryId;summaryDetail.summaryId=scope.row.summaryId;findNoduleByNoduleId(delReq);" type="text" size="small">修改</el-button>
            <el-button @click="delVisible=true;delReq.noduleId=scope.row.summaryId" type="text" size="small">删除</el-button>
          </template>
          </el-table-column>
        </el-table>
      </el-col> 
    </el-row>
    <el-row style="margin-top:5px;">
        <el-button type="success" size="small" @click="addVisible=true;clearForm(addSummary,'addSummary');setTree=[];">添加</el-button>
        <el-button type="danger" size="small" @click="batchDelVisible=true">批量删除</el-button>
        <el-pagination
          v-if="pageShow"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page='pageInfo.pageNo'
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size='req2.pageSize'
          layout="total, sizes, prev, pager, next, jumper "
          :total='pageInfo.totalCount' style="text-align: right;float:right;">
        </el-pagination>
    </el-row>
    <el-dialog
      align:left
      width="30%"
      title="小结信息修改"
      :visible.sync="editVisible"
      append-to-body>
      <el-form label-width="100px" :model="summaryDetail" ref="editNodule" :rules="rule">
        <el-form-item label="小结标题" prop="summaryName">
          <el-input v-model="summaryDetail.summaryName" size="small" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="summaryDetail.description" type="textarea" size="small" maxlength="255"></el-input>
        </el-form-item>
        <div class="expand">
          <div>
            <el-button @click="handleAddTop">添加小结</el-button>
            <el-tree class="expand-tree"
            key="tree-one"
            ref="treeOne"
            v-if="isLoadingTree"
            :data="setTree2"
            highlight-current
            :props="defaultProps"
            :expand-on-click-node="false"
            :render-content="renderContent"
            :default-expanded-keys="defaultExpandKeys"
            @node-click="handleNodeClick"></el-tree>
          </div>
        </div>
      </el-form>
      <div slot="footer" style="text-align: right;">
        <el-button type="danger" @click="findNoduleByNoduleId(delReq)">重 置</el-button>
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('editNodule');editNodule(summaryDetail)">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      align:left
      width="30%"
      title="小结信息详情"
      :visible.sync="detailVisible"
      append-to-body>
      <el-form label-width="100px">
        <el-form-item label="小结编号">
          <span>{{summaryDetail.summaryId}}</span>
        </el-form-item>
        <el-form-item label="备注">
          <span>{{summaryDetail.description}}</span>
        </el-form-item>
        <div class="expand2">
          <div>
            <el-tree class="expand-tree"
            key="tree-two"
            ref="treeTwo"
            v-if="isLoadingTree"
            :data="setTree1"
            highlight-current
            :props="defaultProps"
            :expand-on-click-node="false"
            :render-content="renderContent"
            :default-expanded-keys="defaultExpandKeys"
            @node-click="handleNodeClick"></el-tree>
          </div>
        </div>
      </el-form>
      <div slot="footer" style="text-align: right;">
        <el-button @click="detailVisible = false">返 回</el-button>
      </div>
    </el-dialog>
    <el-dialog
      align:left
      width="30%"
      title="添加小结"
      :visible.sync="addVisible"
      append-to-body>
      <el-form :rules="rule" :model="addSummary" ref="addSummary" label-width="100px">
        <el-form-item label="小结标题" prop="summaryName">
          <el-input v-model="addSummary.summaryName" size="small" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addSummary.description" type="textarea" size="small" maxlength="255"></el-input>
        </el-form-item>
        <div class="expand">
          <div>
            <el-button @click="handleAddTop">添加小结</el-button>
            <el-tree class="expand-tree"
            key="tree-three"
            ref="treeThree"
            v-if="isLoadingTree"
            :data="setTree"
            highlight-current
            :props="defaultProps"
            :expand-on-click-node="false"
            :render-content="renderContent"
            :default-expanded-keys="defaultExpandKeys"
            @node-click="handleNodeClick"></el-tree>
          </div>
        </div>
      </el-form>
        <div slot="footer" style="text-align: right;">
          <el-button type="danger" @click="resetForm('addSummary');setTree=[]">重 置</el-button>
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('addSummary');addNodule(addSummary);">确 定</el-button>
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
      <el-button type="primary" @click="delVisible = false;delNoduleByNoduleId(delReq);">确 定</el-button>
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
      <el-button type="primary" @click="batchDelVisible = false;delNodulesByNoduleIds(batchDelReq);">确 定</el-button>
    </div>
  </el-dialog>
  </div>
</template>
<script>
import {
  findNoduleByInfo,
  findNoduleByNoduleId,
  addNodule,
  editNodule,
  delNoduleByNoduleId,
  delNodulesByNoduleIds
} from '@/api/nodule_list'
import { formatDateTime, clone } from '@/utils/tools'

import TreeRender from '@/components/tree/tree_render.vue'
export default {
  name: 'nodule_list',
  data() {
    return {
      rule: {
        summaryName: [
          { required: true, message: '请输入小结标题', trigger: 'blur' }
        ]
        // description: [
        //   { required: true, message: '请输入小结描述', trigger: 'blur' }
        // ]
      },
      detailVisible: false,
      delVisible: false, // 删除对话框显示隐藏
      editVisible: false, // 修改对话框显示隐藏
      addVisible: false, // 添加对话框显示隐藏
      batchDelVisible: false, // 批量删除对话框显示隐藏
      tableData: [], // 表格数据
      validate: true, // 验证不通过阻止发请求
      pageShow: true, // 分页显示隐藏
      delReq: {
        noduleId: ''
      },
      batchDelReq: {
        chk_box: []
      },
      // 查询 发送请求参数
      req: {
        nodule_title: '',
        modify_name: '',
        startCreateTime: '',
        endCreateTime: '',
        pageNo: 1,
        pageSize: 10
      },
      req2: {
        nodule_title: '',
        modify_name: '',
        startCreateTime: '',
        endCreateTime: '',
        pageNo: 1,
        pageSize: 10
      },
      addSummary: {
        summaryName: '',
        summaryDetailInfos: [],
        description: ''
      },
      summaryDetail: {
        summaryName: '',
        sex: '',
        mobile: '',
        idNumber: '',
        resideAddress: ''
      }, // 小结详情
      // 分页数据
      pageInfo: {},
      // tree-----------------------
      // maxexpandId: api.maxexpandId, // 新增节点开始id
      // non_maxexpandId: api.maxexpandId, // 新增节点开始id(不更改)
      isLoadingTree: false, // 是否加载节点树
      setTree: [], // 添加窗口 节点树数据
      setTree1: [], // 详情窗口 节点树数据
      setTree2: [], // 修改窗口 节点树数据
      defaultProps: {
        children: 'summaryDetailInfos',
        label: 'name'
      },
      defaultExpandKeys: [] // 默认展开节点列表
    }
  },
  mounted() {
    this.getNoduleByInfo(this.req)
    this.initExpand()
  },
  methods: {
    reset() {
      this.req = {
        nodule_title: '',
        modify_name: '',
        startCreateTime: '',
        endCreateTime: '',
        pageNo: this.pageInfo.pageNo,
        pageSize: this.pageInfo.pageSize
      }
      this.req2 = {
        nodule_title: '',
        modify_name: '',
        startCreateTime: '',
        endCreateTime: '',
        pageNo: this.pageInfo.pageNo,
        pageSize: this.pageInfo.pageSize
      }
    },
    resetForm(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
    },
    submitForm(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.validate = true
          } else {
            this.$message.error('请检查是否填写正确')
            this.validate = false
          }
        })
      }
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
    // 深度克隆
    clone: clone,
    // 查询小结信息
    getNoduleByInfo(req) {
      findNoduleByInfo(req)
        .then(response => {
          if (response.data.code === 0) {
            if (response.data.data) {
              this.tableData = response.data.data
              this.pageInfo = response.data.pageInfo
              this.pageShow = true
            } else {
              this.$message(response.data.message)
              this.tableData = response.data.data
              this.pageShow = false
            }
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 删除小结信息
    delNoduleByNoduleId(summaryId) {
      delNoduleByNoduleId(summaryId)
        .then(response => {
          if (response.data.code === 0) {
            this.$message.success(response.data.message)
            this.req2.pageNo = 1
            this.pageInfo.pageNo = 1
            this.getNoduleByInfo(this.req2)
          } else {
            this.$message(response.data.message)
          }
        })
        .catch(error => {
          console.log(error)
          this.$message('删除失败')
        })
    },
    // 查询小结详情
    findNoduleByNoduleId(noduleId) {
      findNoduleByNoduleId(noduleId)
        .then(response => {
          if (response.data.code === 0) {
            this.summaryDetail = response.data.data
            this.setTree1 = response.data.data.summaryDetailInfos
            this.setTree2 = response.data.data.summaryDetailInfos
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 修改小结信息
    editNodule(summaryDetail) {
      if (!this.validate) {
        return false
      }
      this.editVisible = false
      editNodule(summaryDetail)
        .then(response => {
          if (response.data.code === 0) {
            this.$message.success(response.data.message)
            this.getNoduleByInfo(this.req2)
          } else {
            this.$message(response.data.message)
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 添加小结
    addNodule(addSummary) {
      if (!this.validate) {
        return false
      }
      if (this.setTree.length === 0) {
        this.$message.error('请添加小结')
        return false
      }
      addSummary.summaryDetailInfos = this.setTree
      this.addVisible = false
      addNodule(addSummary)
        .then(response => {
          if (response.data.code === 0) {
            this.$message.success(response.data.message)
            this.getNoduleByInfo(this.req2)
          } else {
            this.$message('添加失败')
          }
        })
        .catch(error => {
          this.$message('添加失败')
          console.log(error)
        })
    },
    // 批量删除
    delNodulesByNoduleIds(batchDelReq) {
      if (batchDelReq.chk_box.length === 0) {
        this.$message.error('请选择需要删除的内容')
      } else {
        delNodulesByNoduleIds(batchDelReq)
          .then(response => {
            if (response.data.exchange.body.code === 0) {
              this.$message.success(response.data.exchange.body.message)
              this.req2.pageNo = 1
              this.pageInfo.pageNo = 1
              this.getNoduleByInfo(this.req2)
            } else {
              this.$message(this.$message(response.data.exchange.body.message))
            }
          })
          .catch(error => {
            console.log(error)
            this.$message('删除失败')
          })
      }
    },
    // 表格多选框
    handleSelectionChange(val) {
      this.batchDelReq.chk_box.length = 0
      for (var i = 0; i < val.length; i++) {
        this.batchDelReq.chk_box.push(val[i].summaryId)
      }
    },
    // 页面显示条数
    handleSizeChange(val) {
      this.req2.pageSize = val
      this.req.pageSize = val
      this.req2.pageNo = 1
      this.pageInfo.pageNo = 1
      this.getNoduleByInfo(this.req2)
    },
    // 分页翻页功能
    handleCurrentChange(val) {
      this.req2.pageNo = val
      this.getNoduleByInfo(this.req2)
    },
    // tree------------------------

    initExpand() {
      // this.setTree.map(a => {
      //   this.defaultExpandKeys.push(a.id)
      // })
      this.isLoadingTree = true
    },
    handleNodeClick(d, n, s) {
      // 点击节点
      // console.log(d,n)
      if (d.isEdit === true) {
        d.isEdit = false // 放弃编辑状态
        this.$set(d, 'isEdit', false)
      }
    },
    renderContent(h, { node, data, store }) {
      // 加载节点
      const that = this
      return h(TreeRender, {
        props: {
          DATA: data,
          NODE: node,
          STORE: store
          // maxexpandId: that.non_maxexpandId
        },
        on: {
          nodeAdd: (s, d, n) => that.handleAdd(s, d, n),
          nodeEdit: (s, d, n) => that.handleEdit(s, d, n),
          nodeDel: (s, d, n) => that.handleDelete(s, d, n)
        }
      })
    },
    // 新增节点
    handleAddTop() {
      this.setTree.push({
        // id: ++this.maxexpandId,
        name: '新增小结',
        // pid: '',
        isEdit: false,
        summaryDetailInfos: []
      })
      this.setTree2.push({
        // id: ++this.maxexpandId,
        name: '新增小结',
        // pid: '',
        isEdit: false,
        summaryDetailInfos: []
      })
    },
    handleAdd(s, d, n) {
      // 增加节点
      // if (n.level >= 6) {
      //   this.$message.error('最多只支持五级！')
      //   return false
      // }
      if (d.summaryDetailInfos === null) {
        d.summaryDetailInfos = []
      }
      // 添加数据
      d.summaryDetailInfos.push({
        // id: ++this.maxexpandId,
        name: '新增小结',
        // pid: d.id,
        isEdit: false,
        summaryDetailInfos: []
      })
      // 展开节点
      if (!n.expanded) {
        n.expanded = true
      }
    },
    handleDelete(s, d, n) {
      // 删除节点
      const that = this
      // 有子级不删除
      if (d.summaryDetailInfos && d.summaryDetailInfos.length !== 0) {
        this.$message.error('此节点有子级，不可删除！')
        return false
      } else {
        // 新增节点直接删除，否则要询问是否删除
        const delNode = () => {
          const list = n.parent.data.summaryDetailInfos || n.parent.data // 节点同级数据
          let _index = 99999 // 要删除的index
          /* if(!n.parent.data.children){//删除顶级节点，无children
              list = n.parent.data
            }*/
          list.map((c, i) => {
            if (d.id === c.id) {
              _index = i
            }
          })
          list.splice(_index, 1)
          // console.log(_index,k)
          this.$message.success('删除成功！')
        }
        const isDel = () => {
          that
            .$confirm('是否删除此节点？', '提示', {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning'
            })
            .then(() => {
              delNode()
            })
            .catch(() => {
              return false
            })
        }
        // 判断是否新增
        d.id > this.non_maxexpandId ? delNode() : isDel()
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.el-table thead {
  color: #000 !important;
}
// tree样式
.expand{
  width:100%;
  height:100%;
  overflow:hidden;
}
.expand>div{
  height:85%;
  padding-top:20px;
  width:90%;
  margin:0 auto;
  // max-width:400px;
  overflow-y:auto;
}
.expand>div::-webkit-scrollbar-track{
  box-shadow: inset 0 0 6px rgba(0,0,0,.3);
  border-radius:5px;
}
.expand>div::-webkit-scrollbar-thumb{
  background-color:rgba(50, 65, 87, 0.5);
  outline:1px solid slategrey;
  border-radius:5px;
}
.expand>div::-webkit-scrollbar{
  width:10px;
}
.expand-tree{
  border:none;
  margin-top:10px;
}
.expand-tree .is-current>.el-tree-node__content .tree-label{
  font-weight:600;
  white-space:normal;
}
div.expand .expand-tree .el-tree-node.is-current,
div.expand .expand-tree .el-tree-node:hover{
  overflow:hidden;
}
div.expand .expand-tree .is-current>.el-tree-node__content .tree-btn,
div.expand .expand-tree .el-tree-node__content:hover .tree-btn{
  display:inline-block;
}
div.expand2 .expand-tree .el-tree-node.is-current,
div.expand2 .expand-tree .el-tree-node:hover{
  overflow:hidden;
}
div.expand2 .expand-tree .is-current>.el-tree-node__content .tree-btn,
div.expand2 .expand-tree .el-tree-node__content:hover .tree-btn{
  display:none;
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
