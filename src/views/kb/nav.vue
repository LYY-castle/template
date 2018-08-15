<template>
  <div class="menu-wrapper">
    <template v-for="(item, index) in routes">

      <div v-if="!(item.children&&item.children.length)"
                   :key="item.path">
        <el-popover
          placement="right"
          trigger="hover">
          <el-button-group>
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="add(item,routes,index)"></el-button>
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="reverse(item,routes,index)"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="del(item,routes,index)"></el-button>
          </el-button-group>
          <el-menu-item :index="item.path" :class="{'submenu-title-noDropdown':!isNest}" slot="reference">
            <i class="el-icon-document"></i>
            <span slot="title">{{item.name}}</span>
          </el-menu-item>
        </el-popover>
      </div>

      <el-submenu v-else :index="item.path" :key="item.path">
        <template slot="title">
          <el-popover
            placement="right"
            trigger="hover">
            <el-button-group>
              <el-button type="primary" size="mini" icon="el-icon-plus" @click="add(item,routes,index)"></el-button>
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="reverse(item,routes,index)"></el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="del(item,routes,index)"></el-button>
            </el-button-group>
            <div slot="reference">
              <i class="el-icon-menu"></i>
              <span slot="title">{{item.name}}</span>
            </div>
          </el-popover>
        </template>

        <template v-for="(child, i) in item.children">
          <sidebar-item1 :is-nest="true" class="nest-menu" v-if="child.children&&child.children.length>0" :routes="[child]" :key="child.path"></sidebar-item1>

          <div v-else :key="child.path">
            <el-popover
              placement="right"
              trigger="hover">
              <el-button-group>
                <el-button type="primary" size="mini" icon="el-icon-plus" @click="add(child,item.children,i)"></el-button>
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="reverse(child,item.children,i)"></el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="del(child,item.children,i)"></el-button>
              </el-button-group>
              <el-menu-item :index="child.path" slot="reference">
                <i class="el-icon-document"></i>
                <span slot="title">{{child.name}}</span>
              </el-menu-item>
            </el-popover>
          </div>
        </template>
      </el-submenu>

    </template>
    <el-dialog title="新增目录" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="目录名称" label-width="120px">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改目录" :visible.sync="dialogFormReverseVisible">
      <el-form :model="formReverse">
        <el-form-item label="目录名称" label-width="120px">
          <el-input v-model="formReverse.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormReverseVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitReverse">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { addDirectory, delDirectory, modifyDirectoryName } from '@/api/kb'

  export default {
    data() {
      return {
        menu: {},
        arr: [],
        index: null,
        dialogFormVisible: false,
        dialogFormReverseVisible: false,
        form: {
          name: ''
        },
        formReverse: {
          name: ''
        }
      }
    },
    name: 'SidebarItem1',
    props: {
      routes: {
        type: Array
      },
      isNest: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      hasOneShowingChildren(children) {
        const showingChildren = children.filter(item => {
          return !item.hidden
        })
        if (showingChildren.length === 1) {
          return true
        }
        return false
      },
      add(item, arr, index) {
        this.dialogFormVisible = true
        this.form.name = ''
        this.menu = item
        this.arr = arr
        this.index = index
      },
      reverse(item, arr, index) {
        this.dialogFormReverseVisible = true
        this.formReverse.name = item.name
        this.menu = item
        this.arr = arr
        this.index = index
      },
      del(item, arr, index) {
        delDirectory({
          id: item.id
        }).then(response => {
          if (response.status === 200) {
            arr.splice(index, 1)
          }
        })
      },
      submit() {
        addDirectory({
          name: this.form.name,
          parentid: this.menu.id
        }).then(response => {
          response.data.children = []
          response.data.path = '/' + response.data.parentid + '/' + response.data.id
          this.arr[this.index].children.push(response.data)
          this.dialogFormVisible = false
        })
      },
      submitReverse() {
        modifyDirectoryName({
          name: this.formReverse.name,
          id: this.menu.id
        }).then(response => {
          if (response.status === 200) {
            this.menu.name = this.formReverse.name
            this.dialogFormReverseVisible = false
          }
        })
      }
    }
  }
</script>
