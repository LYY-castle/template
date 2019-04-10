<template>
	<span class="tree-expand">
		<span class="tree-label is-edit" v-if="DATA.isEdit">
			<el-input class="edit" size="mini" autofocus
			placeholder="请输入名称"
			v-model="DATA.name"
			:ref="'treeInput'+DATA.ID"
			@click.stop.native="nodeEditFocus"
			@keyup.enter.stop.native="nodeEditPass(STORE,DATA,NODE)"></el-input>
		</span>
		<span 
      v-if="!(DATA.isEdit)"
      class="tree-label">
			<span>{{DATA.name}}</span>
		</span>
		<span class="tree-btn" v-show="!DATA.isEdit" v-if="permission">
			<i class="tree-button tree-plus" @click.stop="nodeAdd(STORE,DATA,NODE)"></i>
			<i class="tree-button tree-edit" @click.stop="nodeEdit(STORE,DATA,NODE)"></i>
			<i class="tree-button tree-delete" @click.stop="nodeDel(STORE,DATA,NODE)"></i>
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
      nodeName: '',
      labelClassName: 'tree-label'
    }
  },
  methods: {
    nodeAdd(s, d, n) { // 新增
      this.$emit('nodeAdd', s, d, n)
    },
    editCannel(s, d, n) {
      this.$set(d, 'isEdit', false)
      this.$emit('editCannel', s, d, n)
      this.DATA.name = this.nodeName
    },
    submitAdd(s, d, n) {
      this.$emit('submitAdd', s, d, n)
      this.nodeEditPass(s, d, n)
    },
    nodeEdit(s, d, n) { // 编辑
      this.nodeName = d.name
      this.$set(d, 'isEdit', true)
      this.$nextTick(() => {
        this.$refs['treeInput' + d.ID].$refs.input.focus()
      })
      this.$emit('nodeEdit', s, d, n)
    },
    submitEdit(s, d, n) {
      this.$emit('submitEdit', s, d, n)
    },
    nodeDel(s, d, n) { // 删除
      this.$emit('nodeDel', s, d, n)
    },
    nodeCancel(s, d, n) { // 删除
      this.$emit('nodeCancel', s, d, n)
    },
    nodeEditPass(s, d, n) { // 编辑完成
      if (d.name && d.isEdit === true) {
        this.$set(d, 'isEdit', false)
      } else {
        this.$message.error('请输入目录名称')
      }
    },
    nodeEditFocus() {
      // 阻止点击节点的事件冒泡
    }
  },
  mounted() {
    $('.tree-label').click(function() {
      $(this).addClass('checked')
    })
  }
}
</script>

<style lang="scss">
 .tree-label .el-input__inner{
    height:22px;
  }
</style>
<style lang="scss" scoped>
  .tree-button{
    padding:6px;
    &.tree-plus{
      cursor:pointer;
      background:url('../../../static/images/tree_plus.png') no-repeat 0 8px;
    }
    &.tree-edit{
      cursor:pointer;
      background:url('../../../static/images/tree_edit.png') no-repeat 2px 9px;
    }
    &.tree-delete{
      cursor:pointer;
      background:url('../../../static/images/tree_delete.png') no-repeat 0 8px;
    }
  }
	.tree-expand .tree-label.tree-new{
		font-weight:600;
	}
	.tree-expand .tree-label .edit{
    width:93px;
	}
	.tree-expand .tree-btn{
    opacity:0;
		margin-left:10px;
		margin-right:10px;
    width:62px;
    text-align:right;
	}
	.tree-expand .tree-btn-edit i:hover{
		opacity:0.5;
	}
	.tree-expand .tree-btn i{
		color:#8492a6;
		font-size:0.9em;
		margin-right:10px;
	}
	.tree-expand .tree-btn i:hover{
		opacity:0.5;
	}
</style>