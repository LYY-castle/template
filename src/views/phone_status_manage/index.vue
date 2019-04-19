<template>
  <div class="app-container">
    <!--主表-->
    <el-row class="table-container" style="margin-top:0">
      <el-row class="margin-bottom-20">
        <div class="font14 bold">外呼状态管理表</div>
      </el-row>
      <el-row class="margin-bottom-20">
        <el-button type="success" @click="handleAdd();">新建</el-button>
      </el-row>
      <el-row>
        <tree-table
          :key="key"
          :default-expand-all="defaultExpandAll"
          :data="data"
          :columns="columns">
          <template slot="scope" slot-scope="{scope}">
            <el-tag>level: {{ scope.row._level }}</el-tag>
            <el-tag>expand: {{ scope.row._expand }}</el-tag>
            <el-tag>select: {{ scope.row._select }}</el-tag>
          </template>
          <template slot="status" slot-scope="{scope}">{{ statusCode2String(scope.row.status) }}</template>
          <template slot="icon" slot-scope="{scope}">
            <i class="icon-in-table" v-bind:class="scope.row.icon"></i>
          </template>
          <template slot="operation" slot-scope="{scope}">
            <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </tree-table>
      </el-row>
    </el-row>
    <!--新建外呼状态对话框-->
    <el-dialog
      title="新建外呼状态"
      :visible.sync="dialogNewVisible"
      width="30%">
      <el-form :model="dialogData" ref="newMenuForm" label-width="120px">
        <el-form-item label="状态名称：" class="inputWidth">
          <el-input size="small" v-model="dialogData.name"></el-input>
        </el-form-item>
        <el-form-item label="状态值：" class="inputWidth">
          <el-input size="small" v-model="dialogData.code"></el-input>
        </el-form-item>
        <el-form-item label="状态所属：" class="inputWidth">
          <el-cascader
            style="width:100%;"
            v-model="parentIds"
            placeholder="请选择所属"
            :options="data"
            :props="cascaderProps"
            show-all-levels
            filterable
            size="small"
            change-on-select
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addPhoneStatus()">确定</el-button>
        <el-button type="primary" plain @click="dialogNewVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <!--编辑菜单对话框-->
    <el-dialog
      title="编辑外呼状态"
      :visible.sync="dialogEditVisible"
      width="30%">
      <el-form :model="dialogData" ref="newMenuForm" label-width="120px">
        <el-form-item label="状态名称：" class="inputWidth">
          <el-input size="small" v-model="dialogData.name"></el-input>
        </el-form-item>
        <el-form-item label="状态值：" class="inputWidth">
          <el-input size="small" v-model="dialogData.code"></el-input>
        </el-form-item>
        <el-form-item label="状态所属：" class="inputWidth">
          <el-cascader
            style="width:100%;"
            v-model="parentIds"
            placeholder="请选择所属"
            :options="data"
            :props="cascaderProps"
            show-all-levels
            filterable
            size="small"
            change-on-select
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editPhoneStatus()">确定</el-button>
        <el-button type="primary" plain @click="dialogEditVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <!--单个删除提示-->
    <el-dialog align:left width="30%" title="操作提示" :visible.sync="delOneVisiable" append-to-body>
      <span style="font-size:15px;">确定删除该菜单？</span>
      <div slot="footer" style="text-align: right;">
        <el-button @click="deletePhoneStatus(deleteId)" type="primary">确认</el-button>
        <el-button @click="delOneVisiable=false;" type="primary" plain>取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
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
<script>
import treeTable from '@/components/TreeTable'
import {
  getPhoneStatus,
  addPhoneStatus,
  editPhoneStatus,
  deletePhoneStatus
} from '@/api/phone_status_manage'
export default {
  name: 'menu_management',
  components: { treeTable },
  data() {
    return {
      dialogNewVisible: false,
      dialogEditVisible: false,
      delOneVisiable: false,
      deleteId: 0,
      delSelectVisiable: false,
      defaultExpandAll: false,
      key: 1,
      columns: [
        {
          width: 100,
          expand: true,
          align: 'left'
        },
        {
          label: '菜单名称',
          key: 'name',
          align: 'left'
        },
        {
          label: '操作',
          key: 'operation',
          width: 100
        }
      ],
      parentIds: [],
      data: [],
      dialogData: {
        id: null,
        name: '',
        code: '',
        parentIds: '',
        parentId: ''
      },
      cascaderProps: {
        label: 'name',
        value: 'id',
        children: 'children'
      }
    }
  },
  mounted() {
    this.getPhoneStatus()
  },
  methods: {
    getPhoneStatus() {
      getPhoneStatus().then(response => {
        if (response.data.code === 0) {
          this.data = response.data.data
        } else {
          this.$message.error(response.data.message)
        }
      }).catch(error => {
        throw new Error(error)
      })
    },
    handleAdd() {
      this.dialogData = {
        id: null,
        name: '',
        code: '',
        parentIds: [],
        parentId: ''
      }
      this.parentIds = []
      this.dialogNewVisible = true
    },
    addPhoneStatus() {
      let parentId = '0'
      if (this.parentIds.length !== 0) {
        parentId = this.parentIds[this.parentIds.length - 1].toString()
        this.dialogData.parentId = parentId
      } else {
        this.dialogData.parentId = '0'
      }
      this.dialogData.parentIds = this.parentIds.join(',')
      addPhoneStatus(this.dialogData).then(response => {
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
          this.dialogNewVisible = false
        } else {
          this.$message.error(response.data.message)
        }
        this.getPhoneStatus()
      }).catch(error => {
        throw new Error(error)
      })
    },
    handleEdit(row) {
      this.dialogEditVisible = true
      if (row.parentIds) this.parentIds = row.parentIds.split(',')
      else this.parentIds = []
      this.dialogData.id = row.id
      this.dialogData.name = row.name
      this.dialogData.code = row.code
    },
    editPhoneStatus() {
      let parentId = '0'
      if (this.parentIds.length !== 0) {
        parentId = this.parentIds[this.parentIds.length - 1].toString()
        this.dialogData.parentId = parentId
      } else {
        this.dialogData.parentId = '0'
      }
      this.dialogData.parentIds = this.parentIds.join(',')
      editPhoneStatus(this.dialogData).then(response => {
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
          this.dialogEditVisible = false
        } else {
          this.$message.error(response.data.message)
        }
        this.getPhoneStatus()
      }).catch(error => {
        throw new Error(error)
      })
    },
    handleDelete(row) {
      this.deleteId = row.id
      this.delOneVisiable = true
    },
    deletePhoneStatus() {
      deletePhoneStatus(this.deleteId).then(response => {
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
        } else {
          this.$message.error(response.data.message)
        }
        this.getPhoneStatus()
        this.delOneVisiable = false
      }).catch(error => {
        throw new Error(error)
      })
    }

  }
}
</script>