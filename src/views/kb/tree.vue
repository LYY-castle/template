<template>
  <div class="custom-tree-container">
    <el-row class="tac" style="margin-top: 1%">
      <el-col :span="5">
          <el-aside style="padding: 15px;">
            <el-tree
              ref="eventCategoryTree"
              :data="eventCategoryTree"
              :props="defaultProps"
              node-key="id"
              highlight-current
              default-expand-all
              :render-content="renderContent"
              :expand-on-click-node="false"
              @node-drag-start="handleDragStart"
              @node-drag-enter="handleDragEnter"
              @node-drag-leave="handleDragLeave"
              @node-drag-over="handleDragOver"
              @node-drag-end="handleDragEnd"
              @node-drop="handleDrop"
              draggable
              :allow-drop="allowDrop"
              :allow-drag="allowDrag">
            </el-tree>
          </el-aside>
          <el-dialog
            title="新增事件分类"
            width="25%"
            class="add-event-dialog"
            :visible.sync="addEventdialogVisible"
            size="tiny">
            <el-form ref="addEventForm" :model="addEventForm">
              <el-form-item label="分类名称" prop="categoryName">
                <el-input v-model="addEventForm.categoryName"></el-input>
              </el-form-item>
              <el-form-item label="分类标识" prop="categoryFlag">
                <el-input v-model="addEventForm.categoryFlag"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <!--<el-button @click="addEventFormCancleBtn('addEventForm')">取 消</el-button>-->
            <el-button type="primary" @click="addEventFormSubmitBtn('addEventForm')">确 定</el-button>
            </span>
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
  </div>
</template>

<script>
  import TreeRender from './tree_render.vue'
  import Kanban from '@/components/Kanban'
  let id = 1000

  export default {
    name: 'kb',
    components: {
      Kanban
    },
    data() {
      return {
        eventCategoryTree: [
          {
            id: 1,
            label: '一级 1',
            addAble: true, // 根据后台给的是否可添加节点，也可以根据当前的node节点自行判断
            delAble: true, // 根据后台给的是否可删除节点，也可以根据当前的node节点自行判断
            parentId: '',
            children: [{
              id: 4,
              label: '二级 1-1',
              addAble: true,
              delAble: true,
              parentId: '1'
            }, {
              id: 5,
              label: '二级 2-1',
              addAble: true,
              delAble: true,
              parentId: '1'
            }, {
              id: 6,
              label: '二级 2-2',
              addAble: true,
              delAble: true,
              parentId: '1'
            }]
          }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },

        /* 触发的当前的节点，放到全局，方便调用*/
        triggerCurrenNodeData: {},
        /* 触发的当前节点*/
        triggerCurrenNode: {},
        /* 新增事件弹窗的输入框数据*/
        addEventdialogVisible: false,
        addEventForm: {
          categoryName: '',
          categoryFlag: ''
        },
        options: {
          group: 'mission'
        },
        list1: [
          { name: 'Mission', id: 1 },
          { name: 'Mission', id: 2 },
          { name: 'Mission', id: 3 },
          { name: 'Mission', id: 4 }
        ],
        list2: [
          { name: 'Mission', id: 5 },
          { name: 'Mission', id: 6 },
          { name: 'Mission', id: 7 }
        ],
        list3: [
          { name: 'Mission', id: 8 },
          { name: 'Mission', id: 9 },
          { name: 'Mission', id: 10 }
        ]
      }
    },

    methods: {
      /* 渲染函数*/
      renderContent(h, { node, data, store }) {
        const that = this// 指向vue
        return h(TreeRender, {
          props: {
            NODE: node,
            DATA: data,
            STORE: store
          },
          on: {
            // 新增
            Append: (s, d, n) => that.appendEvent(s, d, n),
            // 删除节点
            Delete: (s, d, n) => that.removeEvent(s, d, n),
            //  修改
            Reverse: (s, d, n) => that.reverseEvent(s, d, n),
            // 查看
            WatchInfo: (s, d, n) => that.changeMainRegion(s, d, n)
          }
        }
        )
      },
      /* 树形控件添加节点，添加弹窗出现*/
      appendEvent(s, d, n) {
        this.addEventdialogVisible = true
        this.triggerCurrenNodeData = d
        this.triggerCurrenNode = n
      },
      /* 树形控件删除节点*/
      removeEvent(s, d, n) {
        const parent = n.parent
        const children = parent.data.children || parent.data
        const index = children.findIndex(data => data.id === d.id)
        console.log(tree, '索引')
        this.$confirm('确定要删除该节点吗？', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http('delete', `/url/****/****/${d.id}`, { queryParams: null })
            .then((res) => {
              if (res.statusCode === 200) {
                children.splice(tree, 1)
                this.$message({
                  message: res.messages[0],
                  type: 'success'
                })
              }
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      reverseEvent(s, d, n) {
        this.addEventdialogVisible = true
        this.triggerCurrenNodeData = d
        this.triggerCurrenNode = n
      },
      changeMainRegion(s, d, n) {
        this.addEventdialogVisible = true
      },
      /* 节点新增，新增树形菜单事件分类弹窗，提交按钮*/
      addEventFormSubmitBtn(formname) {
        if (!this.triggerCurrenNodeData.children) {
          this.$set(this.triggerCurrenNodeData, 'children', [])
        }
        // 如果已有子节点，就把返回的数据push进去，插入到树形数据中
        this.triggerCurrenNodeData.children.push({
          id: id++,
          label: '二级 2-1',
          addAble: true,
          delAble: true,
          parentId: '1'
        })
        /* 关闭弹窗，重置输入框*/
        this.addEventdialogVisible = false
        this.$refs[formname].resetFields()

        // this.$refs[formname].validate((valid) => {
        //   if (valid) {
        //     console.log('验证成功')
        //     /* 获取当前input上输入的文字*/
        //     const dataPost = {
        //       label: this.addEventForm.categoryName.trim(),
        //       id: this.addEventForm.categoryFlag.trim(),
        //       parentId: this.triggerCurrenNodeData.id, // 当前节点id
        //       depth: this.triggerCurrenNode.level // 当前节点层级
        //     }
        // this.$http('post', '/api/***/****', { queryParams: dataPost })
        //   .then((res) => {
        //     console.log('请求成功')
        //     if (res.statusCode === 200) {
        //       const result = res.data
        //       /* 点击弹窗的确定按钮可以得到输入的数据，作为新的节点名称插入*/
        //       /* 如果没有子节点，就创建一个子节点插入*/
        //       if (!this.triggerCurrenNodeData.children) {
        //         this.$set(this.triggerCurrenNodeData, 'children', [])
        //       }
        //       // 如果已有子节点，就把返回的数据push进去，插入到树形数据中
        //       this.triggerCurrenNodeData.children.push(result)
        //       /* 关闭弹窗，重置输入框*/
        //       this.addEventdialogVisible = false
        //       this.$refs[formname].resetFields()
        //     /* 刷新树形菜单*/
        //     // this.getDictionarytTree();
        //     }
        //   })
        //   .catch((e) => {
        //     console.log('请求失败', e)
        //   })
        // } else {
        //   console.log('验证未通过')
        //   return false
        // }
        // })
      },
      handleOpen(key, keyPath) {
        console.log(key, keyPath)
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath)
      },
      handleDragStart(node, ev) {
        console.log('drag start', node)
      },
      handleDragEnter(draggingNode, dropNode, ev) {
        console.log('tree drag enter: ', dropNode.label)
      },
      handleDragLeave(draggingNode, dropNode, ev) {
        console.log('tree drag leave: ', dropNode.label)
      },
      handleDragOver(draggingNode, dropNode, ev) {
        console.log('tree drag over: ', dropNode.label)
      },
      handleDragEnd(draggingNode, dropNode, dropType, ev) {
        console.log('tree drag end: ', dropNode && dropNode.label, dropType)
      },
      handleDrop(draggingNode, dropNode, dropType, ev) {
        console.log('tree drop: ', dropNode.label, dropType)
      },
      allowDrop(draggingNode, dropNode, type) {
        if (dropNode.data.label === '二级 3-1') {
          return type !== 'inner'
        } else {
          return true
        }
      },
      allowDrag(draggingNode) {
        return draggingNode.data.label.indexOf('三级 3-2-2') === -1
      }
    }
  }
</script>

<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
<style lang="scss">
  .board {
    /*width: 1000px;*/
    margin-left: 20px;
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
