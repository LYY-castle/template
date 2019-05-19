<template>
  <div class="app-container">
    <!--主表-->
    <el-row class="table-container">
      <el-row class="margin-bottom-20">
        <div class="font14 bold">服务目录</div>
      </el-row>
      <el-row class="margin-bottom-20">
        <el-button type="success" @click="addOne()">新建</el-button>
      </el-row>
      <el-row>
        <tree-table
          :key="key"
          :default-expand-all="defaultExpandAll"
          :data="data"
          :columns="columns"
          border
        >
          <template slot="scope" slot-scope="{ scope }">
            <el-tag>level: {{ scope.row._level }}</el-tag>
            <el-tag>expand: {{ scope.row._expand }}</el-tag>
            <el-tag>select: {{ scope.row._select }}</el-tag>
          </template>
          <template slot="operation" slot-scope="{ scope }">
            <el-button @click="handleEdit(scope.row)" type="text" size="small"
            >编辑
            </el-button
            >
            <el-button @click="handleDelete(scope.row)" type="text" size="small"
            >删除
            </el-button
            >
          </template>
        </tree-table>
      </el-row>
    </el-row>
    <!--新建对话框-->
    <el-dialog title="新建" :visible.sync="dialogNewVisible" width="30%">
      <el-form :model="dialogData" ref="newServiceForm" label-width="120px">
        <el-form-item label="名称：" class="inputWidth">
          <el-input size="small" v-model="dialogData.serviceName"></el-input>
        </el-form-item>
        <el-form-item label="上级目录：" class="inputWidth">
          <el-cascader
            v-if="dialogNewVisible"
            style="width:100%;"
            v-model="dialogData.parentId"
            placeholder="请选择上级目录"
            :options="parentData"
            :props="cascaderProps"
            show-all-levels
            filterable
            size="small"
            expand-trigger="hover"
            clearable
            change-on-select
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="工作表单：" class="inputWidth" v-if="workformShow">
          <el-select
            v-model="dialogData.workFormId"
            placeholder="请选择工作表单"
            style="width:100%"
          >
            <el-option
              v-for="(item, i) in workforms"
              :key="i"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公司签名：" class="inputWidth" v-if="workformShow">
          <el-input
            size="small"
            v-model="dialogData.companySign"
            type="text"
            :min="0"
          ></el-input>
        </el-form-item>
        <el-form-item label="短信模板编号：" class="inputWidth" v-if="workformShow">
          <el-input
            size="small"
            v-model="dialogData.smsTempId"
            type="text"
            :min="0"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序值：" class="inputWidth">
          <el-input
            size="small"
            v-model="dialogData.serviceRank"
            type="number"
            :min="0"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否需要审核：" class="inputWidth" v-if="showIsNeedReview">
          <el-radio v-model="dialogData.isNeedReview" label="1">是</el-radio>
          <el-radio v-model="dialogData.isNeedReview" label="0">否</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleNewSaveAction"
        >确定</el-button
        >
        <el-button @click="dialogNewVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <!--编辑对话框-->
    <el-dialog title="编辑" :visible.sync="dialogEditVisible" width="30%">
      <el-form :model="dialogData" ref="newServiceForm" label-width="120px">
        <el-form-item label="名称：" class="inputWidth">
          <el-input size="small" v-model="dialogData.serviceName"></el-input>
        </el-form-item>
        <el-form-item label="上级目录：" class="inputWidth" v-if="editeShow">
          <el-cascader
            style="width:100%;"
            v-model="dialogData.parentId"
            placeholder="请选择上级目录"
            :options="parentData"
            :props="cascaderProps"
            show-all-levels
            filterable
            size="small"
            expand-trigger="hover"
            clearable
            change-on-select
            @blur="editeChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="工作表单：" class="inputWidth" v-if="workformShow">
          <el-select
            v-model="dialogData.workFormId"
            placeholder="请选择工作表单"
            style="width:100%"
          >
            <el-option
              v-for="(item, i) in workforms"
              :key="i"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公司签名：" class="inputWidth" v-if="workformShow">
          <el-input
            size="small"
            v-model="dialogData.companySign"
            type="text"
            :min="0"
          ></el-input>
        </el-form-item>
        <el-form-item label="短信模板编号：" class="inputWidth" v-if="workformShow">
          <el-input
            size="small"
            v-model="dialogData.smsTempId"
            type="text"
            :min="0"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序值：" class="inputWidth">
          <el-input
            size="small"
            v-model="dialogData.serviceRank"
            type="number"
            :min="0"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否需要审核：" class="inputWidth" v-if="showIsNeedReview">
          <el-radio v-model="dialogData.isNeedReview" label="1">是</el-radio>
          <el-radio v-model="dialogData.isNeedReview" label="0">否</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleEditSaveAction()"
        >确定</el-button
        >
        <el-button @click="dialogEditVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <!--单个删除提示-->
    <el-dialog
      align:left
      width="30%"
      title="删除提示"
      :visible.sync="delOneVisiable"
      append-to-body
    >
      <span style="font-size:15px;">确定删除该服务？</span>
      <div slot="footer" style="text-align: right;">
        <el-button @click="deleteOne(deleteId)" type="primary">确认</el-button>
        <el-button @click="delOneVisiable = false" type="primary" plain
        >取消
        </el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import treeTable from '@/components/TreeTable'
  import {
    getAllServer,
    addServer,
    modifyServer,
    deleteServer,
    getTemplate
  } from '@/api/service_catalog_manage'
  import { list2Tree } from '@/utils/tools'

  export default {
    name: 'menu_management',
    components: { treeTable },
    data() {
      return {
        // 新建
        dialogNewVisible: false,
        // 编辑
        dialogEditVisible: false,
        // 删除单个
        delOneVisiable: false,
        // 编辑一级时级联不显示
        editeShow: true,
        showIsNeedReview: false,
        deleteId: 0,
        delSelectVisiable: false,
        defaultExpandAll: false,
        showCheckbox: true,
        iconList: [],
        iconSelected: '',
        key: 1,
        columns: [
          {
            width: 100,
            expand: true,
            align: 'left'
          },
          {
            label: '服务名称',
            key: 'serviceName'
          },
          {
            label: '排序值',
            key: 'serviceRank'
          },
          {
            label: '操作',
            key: 'operation'
          }
        ],
        // 服务清单数据
        data: [],
        // 上级目录数据
        parentData: [],
        // 编辑框当前选择的上级目录长度
        editSuperiorDir: [],
        // 对话框数据
        dialogData: {
          id: null,
          serviceName: '',
          serviceRank: '',
          parentId: [],
          workFormId: '',
          workProcessId: '',
          companySign: '',
          smsTempId: '',
          isNeedReview: '1'
        },
        cascaderProps: {
          label: 'serviceName',
          value: 'id',
          children: 'children'
        },
        workforms: [],
        workformShow: false,

        // 备用数据
        backupData1: [],
        backupData2: []
      }
    },
    mounted() {
      this.getServerList()
      this.getWorkFormTemplate()
    },
    methods: {
      // 获取工作表单
      getWorkFormTemplate() {
        getTemplate()
          .then(res => {
            if (res.data.code === 0) {
              console.log(res.data)
              this.workforms = res.data.data
            }
          })
          .catch(error => {
            throw error
          })
      },
      // 获取服务清单
      getServerList() {
        getAllServer()
          .then(res => {
            this.data = list2Tree({
              data: res.data.data,
              rootId: 0,
              idFieldName: 'id',
              parentIdFielName: 'parentId'
            })
            this.backupData1 = res.data.data
            this.backupData2 = res.data.data
          })
          .catch(error => {
            throw error
          })
      },
      editeChange(ev) {
      },
      handleChange(value) {
        if (value.length === 2) {
          this.workformShow = true
        } else {
          this.workformShow = false
        }
      },
      // 字符串转整数数组
      strTransArr(str) {
        str = str.substring(1)
        return str.split('/').map(item => {
          return parseInt(item)
        })
      },
      // 编辑传ID
      handleEdit(row) {
        this.workformShow = false
        this.dialogEditVisible = true
        const parentIds = this.strTransArr(row.idPath)
        parentIds.pop()
        this.editSuperiorDir = parentIds
        this.dialogData.parentId = parentIds
        this.dialogData.id = row.id
        this.dialogData.serviceName = row.serviceName
        this.dialogData.workFormId = row.workFormId
        this.dialogData.serviceRank = row.serviceRank || 0
        this.dialogData.companySign = row.companySign
        this.dialogData.smsTempId = row.smsTempId
        this.dialogData.isNeedReview = row.isNeedReview
        // 判断级别
        if (parentIds.length === 0) {
          // 一级
          this.editeShow = false
          this.showIsNeedReview = false
        } else if (parentIds.length === 1) {
          // 二级
          console.log(this.backupData1)
          this.editeShow = true
          this.showIsNeedReview = false

          getAllServer()
            .then(res => {
              res.data.data.forEach(p => {
                if (p.idPath.split('/').length - 1 === 3) {
                  p.disabled = true
                }
              })
              this.parentData = list2Tree({
                data: res.data.data,
                rootId: 0,
                idFieldName: 'id',
                parentIdFielName: 'parentId'
              })
              throw error
            })
        } else if (parentIds.length === 2) {
          // 三级
          this.workformShow = true
          this.editeShow = true
          this.showIsNeedReview = true

          getAllServer()
            .then(res => {
              res.data.data.forEach(p => {
                if (p.idPath.split('/').length - 1 === 3) {
                  p.disabled = true
                }
              })
              this.parentData = list2Tree({
                data: res.data.data,
                rootId: 0,
                idFieldName: 'id',
                parentIdFielName: 'parentId'
              })
              throw error
            })
        }
      },
      // 删除时传ID
      handleDelete(row) {
        this.deleteId = row.id
        this.delOneVisiable = true
      },
      // 新建时重置数据
      addOne() {
        this.dialogNewVisible = true
        this.workformShow = false
        this.showIsNeedReview = false
        this.dialogData.workFormId = ''
        this.dialogData.id = null
        this.dialogData.serviceName = ''
        this.dialogData.parentId = []
        this.dialogData.serviceRank = '0'
        this.dialogData.companySign = ''
        this.dialogData.smsTempId = ''
        this.dialogData.isNeedReview = '1'

        getAllServer()
          .then(res => {
            res.data.data.forEach(p => {
              if (p.idPath.split('/').length - 1 === 3) {
                p.disabled = true
              }
            })
            this.parentData = list2Tree({
              data: res.data.data,
              rootId: 0,
              idFieldName: 'id',
              parentIdFielName: 'parentId'
            })
            throw error
          })
      },
      // 删除操作
      deleteOne(deleteid) {
        deleteServer(deleteid)
          .then(response => {
            if (response.data.code === 0) {
              this.delOneVisiable = false
              this.getServerList()
            } else {
              this.$message.error(response.data.message)
              return
            }
          })
          .catch(error => {
            throw error
          })
      },
      // 编辑修改
      handleEditSaveAction() {
        var parentId = 0
        if (this.dialogData.parentId.length !== 0) {
          parentId = this.dialogData.parentId[this.dialogData.parentId.length - 1]
        }
        if (this.dialogData.serviceName === '') {
          this.$message.error('请输入服务名称')
          return
        }
        if (this.dialogData.serviceRank < 0) {
          this.$message.error('请输入大于0的排序值')
          return
        }
        if (!this.dialogData.parentId.length) {
          this.$message.error(`请选择上级目录`)
          return
        }
        if (this.dialogData.parentId.length !== this.editSuperiorDir.length) {
          this.$message.error(`只能选择第${this.editSuperiorDir.length}级的目录`)
          return
        }
        modifyServer({
          id: this.dialogData.id,
          serviceName: this.dialogData.serviceName,
          parentId: parentId,
          serviceRank: this.dialogData.serviceRank,
          workFormId: this.dialogData.workFormId,
          companySign: this.dialogData.companySign,
          smsTempId: this.dialogData.smsTempId,
          isNeedReview: this.dialogData.isNeedReview
        }).then(response => {
          if (response.data.code === 0) {
            this.dialogEditVisible = false
            this.getServerList()
          } else {
            this.$message.error(response.data.message)
            return
          }
        })
      },
      // 确定新建服务
      handleNewSaveAction() {
        var parentId = 0
        if (this.dialogData.parentId.length > 0) {
          parentId = this.dialogData.parentId[this.dialogData.parentId.length - 1]
        }
        if (this.dialogData.serviceName === '') {
          this.$message.error('请输入服务名称')
          return
        }
        if (this.dialogData.serviceRank < 0) {
          this.$message.error('请输入大于0的排序值')
          return
        }
        if (this.dialogData.workFormId === '') {
          if (this.dialogData.parentId.length === 2) {
            this.$message.error('请选择工单目录')
            return
          }
        }
        addServer({
          serviceName: this.dialogData.serviceName,
          parentId: parentId,
          serviceRank: this.dialogData.serviceRank,
          workFormId: this.dialogData.workFormId,
          companySign: this.dialogData.companySign,
          smsTempId: this.dialogData.smsTempId,
          isNeedReview: this.dialogData.isNeedReview
        }).then(response => {
          if (response.data.code === 0) {
            this.dialogNewVisible = false
            this.getServerList()
          } else {
            this.$message.error(response.data.message)
            return
          }
        })
      }
    }
  }
</script>
<style>
  .icon-item {
    float: left;
    width: 10%;
    font-size: 3em;
    text-align: center;
    line-height: 3.25em;
  }

  .icon-in-table {
    font-size: 1.5em;
    text-align: center;
  }
</style>
