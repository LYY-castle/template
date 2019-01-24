<template>
  <div class="container">
    <el-row>
      <el-form :inline="true" size="small">
        <el-form-item label="小结编号:">
          <el-input v-model="req.summaryId" placeholder="小结编号（限长50字符）" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="小结标题:">
          <el-input v-model="req.summaryName" placeholder="小结标题（限长50字符）" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="操作人:">
          <el-input v-model="req.modify_name" placeholder="操作人（限长50字符）" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="操作时间：">
          <el-date-picker
              v-model="req.modifyTimeStart"
              type="datetime"
              placeholder="开始时间"
              value-format="yyyy-MM-dd hh:mm:ss"
              default-time="00:00:00">
          </el-date-picker>
          到
          <el-date-picker
              v-model="req.modifyTimeEnd"
              type="datetime"
              placeholder="结束时间"
              value-format="yyyy-MM-dd hh:mm:ss"
              default-time="00:00:00">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="req2=clone(req);req.pageNo=1;getNoduleByInfo(req)">查询</el-button>
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
            prop="summaryId"
            label="小结编号"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <a @click="detailVisible=true;delReq.noduleId=scope.row.summaryId;findNoduleByNoduleId(delReq);">{{scope.row.summaryId}}</a>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="summaryName"
            label="小结标题"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.summaryName }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="description"
            label="备注"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.description }}
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
            prop="modifyTime"
            width="155"
            label="操作时间">
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="200">
          <template slot-scope="scope">
            <!-- <el-button @click="setNoduleVisible=true;noduleObj=scope.row" size="small" type="text" v-show="scope.row.isDelete==='2'">可见</el-button>
            <el-button @click="setNoduleInvisible=true;noduleObj=scope.row" size="small" type="text" v-show="scope.row.isDelete==='0'">不可见</el-button> -->
            <el-button @click="editTitleVisible=true;delReq.noduleId=scope.row.summaryId;summaryDetail.summaryId=scope.row.summaryId;findNoduleByNoduleId(delReq,'title');" type="text" size="small">修改标题</el-button>
            <!-- <el-button @click="delVisible=true;delReq.noduleId=scope.row.summaryId" type="text" size="small">删除</el-button> -->
            <el-button @click="editItemVisible=true;delReq.noduleId=scope.row.summaryId;summaryDetail.summaryId=scope.row.summaryId;findNoduleByNoduleId(delReq,'item');" type="text" size="small">修改内容</el-button>
          </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row style="margin-top:5px;">
        <!-- <el-button type="success" size="small" @click="addVisible=true;clearForm(addSummary,'addSummary');setTree=[];">新建</el-button>
        <el-button type="danger" size="small" @click="batchDelVisible=true">批量删除</el-button> -->
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
      title="小结标题修改"
      :visible.sync="editTitleVisible"
      append-to-body>
      <el-form label-width="100px" :model="summaryTitleDetail" ref="editNoduleTitle" :rules="rule">
        <el-form-item label="小结标题" prop="summaryName">
          <el-input v-model="summaryTitleDetail.summaryName" size="small" maxlength="50" placeholder="小结标题（限长50字符）"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="summaryTitleDetail.description" type="textarea" size="small" maxlength="255"  placeholder="备注（限长255字符）"></el-input>
        </el-form-item>
       
      </el-form>
      <div slot="footer" style="text-align: right;">
        <!-- <el-button size="small" type="danger" @click="findNoduleByNoduleId(delReq)">重 置</el-button> -->
        <el-button size="small" @click="editTitleVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="submitForm('editNoduleTitle');editNoduleTitle(summaryTitleDetail)">确 定</el-button>
      </div>
    </el-dialog>
      <el-dialog
      align:left
      width="30%"
      title="小结内容修改"
      :visible.sync="editItemVisible"
      append-to-body>
      <el-form label-width="100px" :model="summaryItemDetail" ref="editNoduleItem" :rules="rule">
        <div class="expand">
          <div>
            <!-- <el-button size="small" @click="handleAddTop">新建小结</el-button> -->
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
        <el-button size="small" type="primary" @click="editItemVisible">确 定</el-button>
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
        <el-button size="small" @click="detailVisible = false">返 回</el-button>
      </div>
    </el-dialog>
    <el-dialog
      align:left
      width="30%"
      title="新建小结"
      :visible.sync="addVisible"
      append-to-body>
      <el-form :rules="rule" :model="addSummary" ref="addSummary" label-width="100px">
        <el-form-item label="小结标题" prop="summaryName">
          <el-input v-model="addSummary.summaryName" size="small" maxlength="50" placeholder="小结标题（限长50字符）"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addSummary.description" type="textarea" size="small" maxlength="255" placeholder="备注（限长255字符）"></el-input>
        </el-form-item>
        <div class="expand">
          <div>
            <!-- <el-button size="small" @click="handleAddTop">新建小结</el-button> -->
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
          <el-button size="small" type="danger" @click="resetForm('addSummary');setTree=[]">重 置</el-button>
          <el-button size="small" @click="addVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="submitForm('addSummary');addNodule(addSummary);">确 定</el-button>
        </div>
      </el-dialog>
    <el-dialog
      width="30%"
      title="删除"
      :visible.sync="delVisible"
      append-to-body>
    <span style="font-size:20px;">确定删除此内容？</span>
    <div slot="footer" class="dialog-footer" style="text-align: right;">
      <el-button size="small" @click="delVisible = false">取 消</el-button>
      <el-button size="small" type="primary" @click="delVisible = false;delNoduleByNoduleId(delReq);">确 定</el-button>
    </div>
  </el-dialog>
  <el-dialog
    width="30%"
    title="批量删除"
    :visible.sync="batchDelVisible"
    append-to-body>
    <span style="font-size:20px;">确定删除选定内容？</span>
    <div slot="footer" class="dialog-footer" style="text-align: right;">
      <el-button size="small" @click="batchDelVisible = false">取 消</el-button>
      <el-button size="small" type="primary" @click="batchDelVisible = false;delNodulesByNoduleIds(batchDelReq);">确 定</el-button>
    </div>
  </el-dialog>

  <el-dialog
    width="30%"
    title="操作提示"
    :visible.sync="setNoduleVisible"
    append-to-body>
    <span style="font-size:20px;">确认设置该小结为可见？</span>
    <div slot="footer" class="dialog-footer" style="text-align: right;">
      <el-button size="small" @click="setNoduleVisible = false">取 消</el-button>
      <el-button size="small" type="primary" @click="setNoduleVisible = false;setVisibleStatus(noduleObj);">确 定</el-button>
    </div>
  </el-dialog>
  <el-dialog
    width="30%"
    title="操作提示"
    :visible.sync="setNoduleInvisible"
    append-to-body>
    <span style="font-size:20px;">确认设置该小结为不可见？</span>
    <div slot="footer" class="dialog-footer" style="text-align: right;">
      <el-button size="small" @click="setNoduleInvisible = false">取 消</el-button>
      <el-button size="small" type="primary" @click="setNoduleInvisible = false;setVisibleStatus(noduleObj);">确 定</el-button>
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
  editNoduleItem,
  editNoduleTitle,
  addNoduleOneItem,
  editNoduleOneItem,
  delOneNoduleById,
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
      setNoduleVisible: false,
      setNoduleInvisible: false,
      delVisible: false, // 删除对话框显示隐藏
      editTitleVisible: false, // 修改对话框显示隐藏(标题备注)
      editItemVisible: false, // 修改对话框显示隐藏(内容)
      addVisible: false, // 新建对话框显示隐藏
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
        summaryId: '',
        summaryName: '',
        modifierName: '',
        modifyTimeStart: '',
        modifyTimeEnd: '',
        pageNo: 1,
        pageSize: 10
      },
      req2: {
        summaryId: '',
        summaryName: '',
        modifierName: '',
        modifyTimeStart: '',
        modifyTimeEnd: '',
        pageNo: 1,
        pageSize: 10
      },
      addSummary: {
        summaryName: '',
        summaryDetailInfos: [],
        description: ''
      },
      summaryTitleDetail: {// 小结标题，备注，用于修改
        summaryName: '',
        description: '',
        status: '',
        summaryId: ''
      },
      summaryItemDetail: {// 小结内容，用于修改
        summaryDetailInfos: [],
        summaryId: ''
      },
      summaryDetail: {// 小结详情
      }, // 小结详情
      // 分页数据
      pageInfo: {},
      // tree-----------------------
      maxexpandId: 0, // 新建节点开始id
      non_maxexpandId: this.maxexpandId, // 新建节点开始id(不更改)
      isLoadingTree: false, // 是否加载节点树
      setTree: [], // 新建窗口 节点树数据
      setTree1: [], // 详情窗口 节点树数据
      setTree2: [], // 修改窗口 节点树数据
      defaultProps: {
        children: 'summaryDetailInfos',
        label: 'name'
      },
      defaultExpandKeys: [], // 默认展开节点列表
      noduleObj: {}
    }
  },
  mounted() {
    this.getNoduleByInfo(this.req)
    this.initExpand()
  },
  methods: {
    // 设置小结状态可见/不可见
    setVisibleStatus(obj) {
      // isDelete  0:可见  1:删除 2:不可见
      if (obj.isDelete === '0') {
        // 设置为不可见
        this.delReq.noduleId = obj.summaryId
        findNoduleByNoduleId(this.delReq)
          .then(response => {
            if (response && response.data.code === 0) {
              this.summaryDetail = response.data.data
              this.summaryDetail.isDelete = '2'
              editNodule(this.summaryDetail)
                .then(response => {
                  if (response && response.data.code === 0) {
                    this.$message.success('操作成功！')
                    this.getNoduleByInfo(this.req2)
                  } else {
                    this.$message.error('服务器异常！')
                  }
                })
            }
          })
      } else if (obj.isDelete === '2') {
        // 设置为可见
        this.delReq.noduleId = obj.summaryId
        findNoduleByNoduleId(this.delReq)
          .then(response => {
            if (response && response.data.code === 0) {
              this.summaryDetail = response.data.data
              this.summaryDetail.isDelete = '0'
              editNodule(this.summaryDetail)
                .then(response => {
                  if (response && response.data.code === 0) {
                    this.$message.success('操作成功！')
                    this.getNoduleByInfo(this.req2)
                  } else {
                    this.$message.error('服务器异常！')
                  }
                })
            }
          })
      }
    },
    reset() {
      this.req = {
        summaryId: '',
        summaryName: '',
        modifierName: '',
        modifyTimeStart: '',
        modifyTimeEnd: '',
        pageNo: this.pageInfo.pageNo,
        pageSize: this.pageInfo.pageSize
      }
      this.req2 = {
        summaryId: '',
        summaryName: '',
        modifierName: '',
        modifyTimeStart: '',
        modifyTimeEnd: '',
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
    findNoduleByNoduleId(noduleId, str) {
      findNoduleByNoduleId(noduleId)
        .then(response => {
          if (response.data.code === 0) {
            this.summaryDetail = response.data.data
            this.summaryItemDetail.summaryDetailInfos = response.data.data.summaryDetailInfos ? response.data.data.summaryDetailInfos : []
            this.summaryItemDetail.summaryId = response.data.data.summaryId
            this.setTree1 = response.data.data.summaryDetailInfos ? response.data.data.summaryDetailInfos : []
            this.setTree2 = response.data.data.summaryDetailInfos ? response.data.data.summaryDetailInfos : []
            if (str === 'title') {
              this.summaryTitleDetail.summaryName = response.data.data.summaryName
              this.summaryTitleDetail.description = response.data.data.description
              this.summaryTitleDetail.summaryId = response.data.data.summaryId
              this.summaryTitleDetail.status = response.data.data.status
            }
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
    // 修改小结标题
    editNoduleTitle(summaryTitleDetail) {
      if (!this.validate) {
        return false
      }
      this.editTitleVisible = false
      editNoduleTitle(summaryTitleDetail)
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
    // 修改小结内容
    editNoduleItem(summaryItemDetail) {
      if (!this.validate) {
        return false
      }
      console.log(summaryItemDetail, 'summary')
      // this.editTitleVisible = false
      editNoduleItem(summaryItemDetail)
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
    // 新建小结
    addNodule(addSummary) {
      if (!this.validate) {
        return false
      }
      if (this.setTree.length === 0) {
        this.$message.error('请新建小结')
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
            this.$message(response.data.message)
          }
        })
        .catch(error => {
          this.$message('新建失败')
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
          STORE: store,
          maxexpandId: that.non_maxexpandId
        },
        on: {
          nodeAdd: (s, d, n) => that.handleAdd(s, d, n),
          submitAdd: (s, d, n) => that.handleNoduleOneItem(s, d, n),
          nodeEdit: (s, d, n) => that.handleEdit(s, d, n),
          submitEdit: (s, d, n) => that.submitEdit(s, d, n),
          nodeDel: (s, d, n) => that.handleDelete(s, d, n),
          nodeCancel: (s, d, n) => that.handleCancel(s, d, n)
          // nodeEditPass: (s, d, n) => that.handleNoduleOneItem(s, d, n)
        }
      })
    },
    handleCancel(s, d, n) {
      // 删除节点
      const list = n.parent.data.summaryDetailInfos || n.parent.data // 节点同级数据
      let _index = 99999 // 要删除的index
      list.map((c, i) => {
        if (d.id === c.id) {
          _index = i
        }
      })
      list.splice(_index, 1)
    },
    handleNoduleOneItem(s, d, n) {
      if (!d.name) {
        this.$message.error('还未填小结内容！')
        return
      }
      if (d.id) {
        editNoduleOneItem({ 'id': d.id, 'name': d.name }).then(res => {
          if (res.data.code !== 0) {
            this.$message.error('修改失败！')
          }
        })
      } else {
        addNoduleOneItem({ 'parentId': d.parentid + '', 'name': d.name, 'summaryId': this.summaryItemDetail.summaryId }).then(res => {
          if (res.data.code !== 0) {
            this.$message.error('新增失败！')
          }
        })
      }
    },
    // 新建节点
    handleAddTop() {
      this.setTree.push({
        pid: ++this.maxexpandId,
        name: '新增父节点',
        // pid: '',
        isEdit: false,
        summaryDetailInfos: []
      })
      this.setTree2.push({
        pid: ++this.maxexpandId,
        name: '新增父节点',
        // pid: '',
        isEdit: false,
        summaryDetailInfos: []
      })
    },
    // handleAdd(s, d, n) {
    //   // 增加节点
    //   // if (n.level >= 6) {
    //   //   this.$message.error('最多只支持五级！')
    //   //   return false
    //   // }
    //   if (d.summaryDetailInfos === null) {
    //     d.summaryDetailInfos = []
    //   }
    //   // 新建数据
    //   d.summaryDetailInfos.push({
    //     pid: ++this.maxexpandId,
    //     name: '新增子节点',
    //     // pid: d.id,
    //     isEdit: false,
    //     summaryDetailInfos: []
    //   })
    //   // 展开节点
    //   if (!n.expanded) {
    //     n.expanded = true
    //   }
    // },
    handleAdd(s, d, n) {
      let a = 0
      const parentid = n.data.id
      this.editCancel = false

      if (d.summaryDetailInfos) {
        for (let i = 0; i < d.summaryDetailInfos.length; i++) {
          if (d.summaryDetailInfos[i].isEdit) {
            a = a + 1
            d.summaryDetailInfos.splice(i, 1)
          }
        }
        if (!a) {
          if (d.summaryDetailInfos === null) {
            d.summaryDetailInfos = []
          }
          // 新建数据
          d.summaryDetailInfos.push({
            pid: ++this.maxexpandId,
            name: '',
            parentid: parentid,
            isEdit: true,
            summaryDetailInfos: []
          })
          // 展开节点
          // if (!n.expanded) {
          //   n.expanded = true
          // }
        }
      } else {
        d.summaryDetailInfos = []
        d.summaryDetailInfos.push({
          pid: ++this.maxexpandId,
          name: '',
          parentid: parentid,
          isEdit: true,
          summaryDetailInfos: []
        })
      }
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
        // 新建节点直接删除，否则要询问是否删除
        const delNode = () => {
          const list = n.parent.data.summaryDetailInfos || n.parent.data // 节点同级数据
          let _index = 99999 // 要删除的index
          /* if(!n.parent.data.children){//删除顶级节点，无children
              list = n.parent.data
            }*/
          list.map((c, i) => {
            if (d.id === c.id) {
              _index = i
              delOneNoduleById({ 'id': d.id }).then(res => {
                console.log(res, 'rs')
                list.splice(_index, 1)
                // console.log(_index,k)
                this.$message.success('删除成功！')
              })
            }
          })
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
        // 判断是否新建
        d.id > this.non_maxexpandId ? delNode() : isDel()
      }
    },
    submitEdit(s, d, n) {
      console.log(d, '修改')
      // editCatalogs(d.ID, { 'name': d.name }).then(response => {
      //   console.log(response.data)
      //   this.getCatalogs()
      //   // 展开节点
      //   this.expandedItem = []
      //   this.expandedItem.push(d.parentid)
      // })
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
div.expand .expand-tree .el-tree-node__content:hover .tree-btn{
  display:inline-block;
  opacity:1;
  background:rgb(190, 214, 221);
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
