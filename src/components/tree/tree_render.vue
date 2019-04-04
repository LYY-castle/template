<template>
	<span class="tree-expand">
		<span class="tree-label" v-if="DATA.isEdit">
			<el-input class="edit" size="mini" autofocus
			placeholder="请输入名称"
			v-model="DATA.name"
			:ref="'treeInput'+DATA.ID"
			@click.stop.native="nodeEditFocus"
			@keyup.enter.stop.native="nodeEditPass(STORE,DATA,NODE)"></el-input>
		</span>
		<span v-if="!(DATA.isEdit)" 
		:class="[DATA.ID > maxexpandId ? 'tree-new tree-label' : 'tree-label']">
			<span>{{DATA.name}}</span>
		</span>
		<span class="tree-btn" v-show="!DATA.isEdit">
			<i class="el-icon-plus" @click.stop="nodeAdd(STORE,DATA,NODE)" v-show="NODE.level>1"></i>
			<i class="el-icon-edit" @click.stop="nodeEdit(STORE,DATA,NODE)" v-show="NODE.level>2"></i>
			<i class="el-icon-delete" @click.stop="nodeDel(STORE,DATA,NODE)" v-show="NODE.level>2"></i>
		</span>
		<span class="tree-btn-edit" v-show="DATA.isEdit">
			<i class="el-icon-check" v-show="!editCancel" @click.stop="submitAdd(STORE,DATA,NODE)"></i>
			<i class="el-icon-check" v-show="editCancel" @click.stop="submitEdit(STORE,DATA,NODE)"></i>
			<i class="el-icon-close" v-show="!editCancel" @click.stop="nodeCancel(STORE,DATA,NODE)"></i>
			<i class="el-icon-close" v-show="editCancel" @click.stop="editCannel(STORE,DATA,NODE)"></i>
		</span>
	</span>
</template>

<script>
export default{
  name: 'treeExpand',
  props: ['NODE', 'DATA', 'STORE', 'maxexpandId', 'editCancel', 'permission'],
  data() {
    return {
      nodeName: ''
    }
  },
  methods: {
    nodeAdd(s, d, n) { // 新增
      this.$emit('nodeAdd', s, d, n)
      // this.$nextTick(() => {
      //   // this.$refs['treeInput' + d.id].$refs.input.focus()
      //   console.log(d)
      // 	 this.$refs['treeInput' + d.ID].$refs.input.focus()
      //   console.log('treeInput' + d.children[d.children.length - 1].ID)
      // })
    },
    editCannel(s, d, n) {
      this.$set(d, 'isEdit', false)
      this.$emit('editCannel', s, d, n)
      this.DATA.name = this.nodeName
    },
    submitAdd(s, d, n) {
      this.$emit('submitAdd', s, d, n)
      // this.nodeEditPass(s, d, n)
    },
    nodeEdit(s, d, n) { // 编辑
      // // console.log(d.isEdit)
      this.nodeName = d.name
      this.$set(d, 'isEdit', true)
      // // console.log(d.isEdit)
      this.$nextTick(() => {
        this.$refs['treeInput' + d.ID].$refs.input.focus()
      })
      this.$emit('nodeEdit', s, d, n)
    },
    submitEdit(s, d, n) {
      console.log('gaile')
      this.$emit('submitEdit', s, d, n)
    },
    nodeDel(s, d, n) { // 删除
      this.$emit('nodeDel', s, d, n)
    },
    nodeCancel(s, d, n) { // 取消
      this.$emit('nodeCancel', s, d, n)
    },
    nodeEditPass(s, d, n) { // 编辑完成
      if (d.name && d.isEdit === true) {
        this.$set(d, 'isEdit', false)
        this.$emit('nodeEditPass', s, d, n)
      } else {
        this.$message.error('请输入小结名称')
      }
    },
    nodeEditFocus() {
      // 阻止点击节点的事件冒泡
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
	#summary{
    .tree-expand{
		overflow:hidden;
	}
	.tree-expand .tree-label.tree-new{
		font-weight:600;
	}
	.tree-expand .tree-label{
		font-size:0.9em;
	}
	.tree-expand .tree-label .edit{
		width:80%;
	}
	.tree-expand .tree-btn{
		/* display:none; */
    opacity:0;
		margin-left:10px;
    width:62px;
	}
	.tree-expand .tree-btn-edit i:hover{
		color:white;
	}
	.tree-expand .tree-btn i{
		color:#8492a6;
		font-size:0.9em;
		margin-right:3px;
	}
	.tree-expand .tree-btn i:hover{
		color:white;
	}
  }
</style>