<template>
  <el-row class="tac" style="margin-top: 1%">
    <el-col :span="5">
      <el-scrollbar wrapClass="scrollbar-wrapper">
        <el-menu
          mode="vertical"
          :show-timeout="200"
          :collapse="false"
          background-color="#545c64"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
          style="max-height:500px;"
        >
          <el-menu-item index="0" @click="dialogFormVisible = true">
            <i class="el-icon-plus"></i>
            <span slot="title">新增顶级目录</span>
          </el-menu-item>
          <sidebar-item1 :routes="parentArr"></sidebar-item1>
        </el-menu>
      </el-scrollbar>
      <el-dialog title="新增目录" :visible.sync="dialogFormVisible" append-to-body>
        <el-form :model="form">
          <el-form-item label="目录名称" label-width="120px">
            <el-input v-model="form.name" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParent">确 定</el-button>
        </div>
      </el-dialog>
    </el-col>
    <el-col :span="19">
      <div class="components-container board">
        <Kanban :key="1" class="kanban todo" :list="list1" :options="options" header-text="文章列表"/>
        <!--<Kanban :key="2" class="kanban working" :list="list2" :options="options" header-text="Working"/>-->
        <!--<Kanban :key="3" class="kanban done" :list="list3" :options="options" header-text="Done"/>-->
      </div>
    </el-col>
  </el-row>
</template>

<script>
  import Kanban from '@/components/Kanban'
  import SidebarItem1 from './nav'
  import { getAllDirectory, addDirectory } from '@/api/kb'

  export default {
    name: 'kb',
    components: {
      Kanban,
      SidebarItem1
    },
    data() {
      return {
        dialogFormVisible: false,
        form: {
          name: ''
        },
        parentArr: [],
        navData: [],
        options: {
          group: 'mission'
        },
        list1: [
          { name: 'Mission', id: 1 },
          { name: 'Mission', id: 2 },
          { name: 'Mission', id: 3 },
          { name: 'Mission', id: 4 }
        ]
      }
    },
    methods: {
      addParent() {
        this.dialogFormVisible = false
        addDirectory({
          name: this.form.name,
          parentid: 0
        }).then(response => {
          response.data.children = []
          response.data.path = '/' + response.data.parentid + '/' + response.data.id
          this.parentArr.push(response.data)
          this.dialogFormVisible = false
        })
      },
      routes() {
        return this.navData
      },
      handleOpen(key, keyPath) {
        console.log(key, keyPath)
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath)
      },
      route() {
        if (this.navData.length) {
          for (let i = 0; i < this.navData.length; i++) {
            this.navData[i].children = []
            if (this.navData[i].parentid === 0) {
              this.parentArr.push(this.navData[i])
            }
            for (let j = 0; j < this.navData.length; j++) {
              if (this.navData[i].id === this.navData[j].parentid) {
                this.navData[i].children.push(this.navData[j])
              }
            }
          }
        }
      }
    },
    mounted() {
      getAllDirectory().then(response => {
        this.navData = response.data.data
        this.route()
      })
    }
  }
</script>
<style lang="scss">
  .board {
    /*width: 1000px;*/
    margin-left: 5px;
    display: flex;
    justify-content: space-around;
    flex-direction: row;
    align-items: flex-start;
  }
  .kanban {
    &.todo {
      .board-column-header {
        background: #4A9FF9;
      }
    }
    &.working {
      .board-column-header {
        background: #f9944a;
      }
    }
    &.done {
      .board-column-header {
        background: #2ac06d;
      }
    }
  }
</style>
<style>
  .el-scrollbar__bar {
    position: relative;
    right: 0;
    bottom: 0;
  }
</style>
