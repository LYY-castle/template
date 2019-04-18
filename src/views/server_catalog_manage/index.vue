<template>
    <div class="app-container">
      <!--主表-->
      <el-row class="table-container">
        <el-row class="margin-bottom-20">
          <div class="font14 bold">菜单管理表</div>
        </el-row>
        <el-row class="margin-bottom-20">
          <el-button type="success" @click="addOne()">新建</el-button>
        </el-row>
        <el-row>
          <tree-table :key="key" :default-expand-all="defaultExpandAll" :data="data" :columns="columns" border>
            <template slot="scope" slot-scope="{scope}">
              <el-tag>level: {{ scope.row._level }}</el-tag>
              <el-tag>expand: {{ scope.row._expand }}</el-tag>
              <el-tag>select: {{ scope.row._select }}</el-tag>
            </template>
            <template slot="status" slot-scope="{scope}">
              {{ statusCode2String(scope.row.status) }}
            </template>
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
      <!--新建菜单对话框-->
      <el-dialog
        title="新建菜单"
        :visible.sync="dialogNewVisible"
        width="30%"
        :before-close="handleClose">
          <el-form  :model="dialogData" ref="newMenuForm" label-width="120px">
          <el-form-item label="菜单名称：" class="inputWidth">
             <el-input size="small" v-model="dialogData.name"></el-input>
          </el-form-item>
          <el-form-item label="菜单值：" class="inputWidth">
            <el-input size="small" v-model="dialogData.value"></el-input>
          </el-form-item>
          <el-form-item label="菜单所属：" class="inputWidth">
            <el-cascader
            style="width:100%;"
            v-model="dialogData.parentId"
            placeholder="请选择所属菜单"
            :options="data"
            :props="cascaderProps"
            show-all-levels
            filterable
            size="small"
            change-on-select
            clearable
          ></el-cascader>
          </el-form-item>
          <el-form-item label="菜单图标：" class="inputWidth">
            <el-input size="small" v-model="dialogData.icon" :disabled="true">
              <template slot="prepend"><i v-bind:class="dialogData.icon"></i></template>
              <el-button slot="append" icon="el-icon-search" @click="dialogSelectIconVisible = true"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="菜单顺序：" class="inputWidth">
            <el-input size="small" v-model="dialogData.order"></el-input>
          </el-form-item>
          <el-form-item label="菜单状态：" class="inputWidth">
            <el-select v-model="dialogData.status" placeholder="请选择显示状态" style="width:100%">
              <el-option label="显示" value="1"></el-option>
              <el-option label="隐藏" value="0"></el-option>
            </el-select>
          </el-form-item>
      </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleNewSaveAction()">确定</el-button>
          <el-button @click="dialogNewVisible = false">取消</el-button>
        </span>
      </el-dialog>
      <!--编辑菜单对话框-->
      <el-dialog
        title="编辑菜单"
        :visible.sync="dialogEditVisible"
        width="30%"
        :before-close="handleClose">
        <el-form  :model="dialogData" ref="newMenuForm" label-width="120px">
          <el-form-item label="菜单名称：" class="inputWidth">
             <el-input size="small" v-model="dialogData.name"></el-input>
          </el-form-item>
          <el-form-item label="菜单值：" class="inputWidth">
            <el-input size="small" v-model="dialogData.value"></el-input>
          </el-form-item>
          <el-form-item label="菜单所属：" class="inputWidth">
            <el-cascader
            style="width:100%;"
            v-model="dialogData.parentId"
            placeholder="请选择所属菜单"
            :options="data"
            :props="cascaderProps"
            show-all-levels
            filterable
            size="small"
            change-on-select
            clearable
          ></el-cascader>
          </el-form-item>
          <el-form-item label="菜单图标：" class="inputWidth">
            <el-input prefix-icon="dialogData.icon" size="small" v-model="dialogData.icon" :disabled="true">
              <template slot="prepend"><i v-bind:class="dialogData.icon"></i></template>
              <el-button slot="append" icon="el-icon-search" @click="dialogSelectIconVisible = true"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="菜单顺序：" class="inputWidth">
            <el-input size="small" v-model="dialogData.order"></el-input>
          </el-form-item>
          <el-form-item label="菜单状态：" class="inputWidth">
            <el-select v-model="dialogData.status" placeholder="请选择显示状态" style="width:100%">
              <el-option label="显示" value="1"></el-option>
              <el-option label="隐藏" value="0"></el-option>
            </el-select>
          </el-form-item>
      </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleEditSaveAction()">确定</el-button>
          <el-button @click="dialogEditVisible = false">取消</el-button>
        </span>
      </el-dialog>
      <!--单个删除提示-->
      <el-dialog
      align:left
      width="30%"
      title="删除提示"
      :visible.sync="delOneVisiable"
      append-to-body>
        <span style="font-size:15px;">确定删除该菜单？</span>
        <div slot="footer" style="text-align: right;">
          <el-button @click="deleteOne(deleteId)" type="primary">确认</el-button>
          <el-button @click="delOneVisiable=false;" type="primary" plain>取消</el-button>
        </div>
    </el-dialog>
    <!--选择图标-->
    <el-dialog
      align:left
      width="60%"
      title="选择图标"
      :visible.sync="dialogSelectIconVisible"
      append-to-body>
        <ul>
          <li v-for="(iconClassName,index) in iconList" :key="index" class="icon-item">
            <i v-bind:class="iconClassName" @click="selectIcon(iconClassName)"></i>
          </li>
        </ul>
    </el-dialog>
    </div>
</template>
<style>
.icon-item {
  float: left;
  width:10%;
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
  getMenuList,
  getIconList,
  saveNewMenu,
  saveEditMenu,
  deleteMenu
} from '@/api/menu_management'
import {
  list2Tree
} from '@/utils/tools'
export default {
  name: 'menu_management',
  components: { treeTable },
  data() {
    return {
      dialogNewVisible: false,
      dialogEditVisible: false,
      dialogSelectIconVisible: false,
      delOneVisiable: false,
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
          label: '菜单名称',
          key: 'name'
        },
        {
          label: '菜单值',
          key: 'value'
        },
        {
          label: '菜单图标',
          key: 'icon',
          width: 50
        },
        {
          label: '菜单顺序',
          key: 'menuOrder',
          width: 50
        },
        {
          label: '状态',
          key: 'status',
          width: 100
        },
        {
          label: '操作',
          key: 'operation'
        }
      ],
      data: [],
      dialogData: {
        id: null,
        name: '',
        value: '',
        icon: '',
        order: '',
        status: '',
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
    this.iconList = getIconList()
    this.getMenuList()
  },
  methods: {
    getMenuList() {
      getMenuList().then(response => {
        const result = response.data.result
        for (let i = 0; i < result.length; i++) {
          result[i].parentId = parseInt(result[i].parentId)
        }
        this.data = list2Tree({ data: result, rootId: 0, idFieldName: 'id', parentIdFielName: 'parentId' })
      }).catch(error => {
        throw new Error(error)
      })
    },
    handleEdit(row) {
      var parentIds = row.idPath.split('/').filter(n => { return n })
      parentIds.pop()
      parentIds = parentIds.map(item => { return parseInt(item) })
      this.dialogData.id = row.id
      this.dialogData.name = row.name
      this.dialogData.value = row.value
      this.dialogData.icon = row.icon
      this.dialogData.parentId = parentIds
      this.dialogData.order = row.menuOrder
      this.dialogData.status = row.status
      this.dialogEditVisible = true
    },
    handleDelete(row) {
      this.deleteId = row.id
      this.delOneVisiable = true
    },
    addOne() {
      this.dialogData.id = null
      this.dialogData.name = ''
      this.dialogData.value = ''
      this.dialogData.icon = ''
      this.dialogData.parentId = []
      this.dialogData.order = '0'
      this.dialogData.status = '1'
      this.dialogNewVisible = true
    },
    deleteOne(deleteid) {
      this.delOneVisiable = false
      deleteMenu(deleteid).then(response => {
        this.getMenuList()
      }).catch(error => {
        throw new Error(error)
      })
    },
    selectIcon(iconClassName) {
      this.dialogData.icon = iconClassName
      this.dialogSelectIconVisible = false
    },
    statusCode2String(code) {
      return code === '0' ? '隐藏' : '显示'
    },
    handleEditSaveAction() {
      this.dialogEditVisible = false
      var parentId = '0'
      if (this.dialogData.parentId.length !== 0) {
        parentId = this.dialogData.parentId[this.dialogData.parentId.length - 1].toString()
      }
      saveEditMenu({
        id: this.dialogData.id,
        name: this.dialogData.name,
        value: this.dialogData.value,
        parentId: parentId,
        icon: this.dialogData.icon,
        menuOrder: this.dialogData.order,
        status: this.dialogData.status
      }).then(response => {
        this.getMenuList()
      }).catch(error => {
        throw new Error(error)
      })
    },
    handleNewSaveAction() {
      this.dialogNewVisible = false
      var parentId = '0'
      if (this.dialogData.parentId.length !== 0) {
        parentId = this.dialogData.parentId[this.dialogData.parentId.length - 1].toString()
      }
      saveNewMenu({
        name: this.dialogData.name,
        value: this.dialogData.value,
        parentId: parentId,
        icon: this.dialogData.icon,
        menuOrder: this.dialogData.order,
        status: this.dialogData.status
      }).then(response => {
        this.getMenuList()
      }).catch(error => {
        throw new Error(error)
      })
    }
  }
}
</script>