<template>
  <div class="container">
    <!-- 列表管理 -->
    <div v-show="isListPage==='1'">
      <el-row><br/>
        <el-form :inline="true" size="small">
          <el-form-item label="笔记标题">
            <el-input type="text" v-model="req.keyword" placeholder="笔记标题"></el-input>
          </el-form-item>
          <el-form-item label="最近操作时间">
            <el-date-picker
                v-model="timeValue"
                type="datetimerange"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="req.pageNo=1;searchByKeyWords(req)">查询</el-button>
            <el-button type="danger"  @click="resetQueryCondition()">重置</el-button>
          </el-form-item>
        </el-form>
      </el-row>

      <el-row>
        <el-col>
          <el-table :data="tableData" border>
            <!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
            <el-table-column align="center" label="序号" width="55">
              <template slot-scope="scope">
                <div>{{scope.$index+(req.pageNo-1)*req.pageSize+1}}</div>
              </template>
            </el-table-column>
            <!-- <el-table-column align="center" label="笔记编号" prop="noteid"></el-table-column> -->
            <el-table-column align="center" label="笔记标题" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <a @click="queryOne(scope.row.noteid,scope.row.userid)">{{scope.row.title}}</a>
              </template>
            </el-table-column>
            <el-table-column align="center" label="新建时间">
              <template slot-scope="scope">
                <div v-html="formatDateTime(scope.row.createdat)"></div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="最近操作时间">
              <template slot-scope="scope">
                <div v-html="formatDateTime(scope.row.updatedat)"></div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="showEditNote(scope.row.noteid,scope.row.userid)">修改</el-button>
                <el-button type="text" size="small" @click="deleteVisiable=true;del_noteid=scope.row.noteid;del_uid=scope.row.userid">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <el-row style="margin-top:1%;">
        <el-button type="success" size="small" @click="noteTitle='';noteTitleVisiable=true">新建</el-button>
        <!-- <el-button type="danger" size="small" @click="" icon="el-icon-minus">批量删除</el-button> -->
        <el-pagination
            v-if="pageShow"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page=pageInfo.pageNo
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size=pageInfo.pageSize
            layout="total, sizes, prev, pager, next, jumper "
            :total=pageInfo.totalCount style="text-align: right;float:right;">
        </el-pagination>
      </el-row>

      <!-- 新建笔记dialog -->
      <el-dialog width="30%" title="新建笔记" :visible.sync="noteTitleVisiable" append-to-body>
        <span style="color:red">*</span><span style="font-size:15px;">笔记标题：</span>
        <el-input type="text" placeholder="请输入笔记标题" size="medium" v-model="noteTitle" maxlength="45"></el-input>
        <div slot="footer" class="dialog-footer" style="text-align: center;">
          <el-button type="primary" @click="checkTitleIsNullOrNot(noteTitle);noteTitleVisiable = false">确定</el-button>
          <el-button @click="noteTitleVisiable = false">取消</el-button>
        </div>
      </el-dialog>

      <!-- 删除笔记dialog -->
      <el-dialog width="30%" title="删除提示" :visible.sync="deleteVisiable" append-to-body>
        <span style="font-size:15px;">确定删除该笔记？</span>
        <div slot="footer" class="dialog-footer" style="text-align: right;">
          <el-button type="primary" @click="deleteVisiable = false;deleteNote(del_noteid,del_uid);">确定</el-button>
          <el-button @click="deleteVisiable = false">取消</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 列表管理end -->

    <!-- 新建笔记 -->
    <div v-show="isListPage==='2'">
      <div style="text-align:center">
        <h3>{{noteTitle}}</h3>
        <quill-editor
        v-model="content"
        ref="myQuillEditor"
        :options="editorOption"
        style="white-space:pre"
        @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
        @change="onEditorChange($event)"
        ></quill-editor>
        <el-row style="margin-top:1%">
          <el-button type="success" @click="generateNote();" size="small">确定</el-button>
          <el-button type="primary" @click="noteTitle='';isListPage='1';content=null" size="small">取消</el-button>
        </el-row>
      </div>
    </div>
    <!-- 新建笔记end -->

    <!-- 笔记详情 -->
    <div  v-show="isListPage==='3'">
      <div>
        <h3 style="text-align:center">{{noteDetail.title}}&nbsp;&nbsp;</h3>
        <!-- <quill-editor
        style="white-space:pre"
        ref="myQuillEditor"
        :options="editorOption"></quill-editor> -->
        <div v-html="noteDetail.content" class="note-content">

        </div>
        <el-row style="margin-top:1%;text-align:center;">
          <el-button type="primary" @click="noteDetail.title='';isListPage='1';noteDetail.content=null">返回列表</el-button>
        </el-row>
      </div>
    </div>
    <!-- 笔记详情end -->

    <!-- 修改笔记 -->
    <div v-show="isListPage==='4'">
      <div style="text-align:center">
        <h3>{{editDetail.title}}
          <el-tooltip class="item" effect="dark" content="修改笔记标题" placement="right-start">
            <el-button style="font-size:16px;" type="text" icon="el-icon-edit-outline" @click="editNoteTitleVisiable=true" size="mini" circle></el-button>
          </el-tooltip>
        </h3>
        <quill-editor
        v-model="editDetail.content"
        ref="myQuillEditor"
        style="white-space:pre"
        :options="editorOption"
        @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
        @change="onEditorChange($event)"
        ></quill-editor>
        <el-row style="margin-top:1%;">
          <el-button type="success" @click="modifyNote();" size="small">确定</el-button>
          <el-button type="primary" @click="editDetail.title='';isListPage='1';editDetail.content=null" size="small">取消</el-button>
        </el-row>
      </div>
    </div>
    <!-- 修改笔记 end-->


    <!-- 修改笔记标题 dialog -->
      <el-dialog width="30%" title="修改笔记标题" :visible.sync="editNoteTitleVisiable" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
        <span style="color:red">*</span><span style="font-size:15px;">笔记标题：</span>
          <el-input maxlength="45" type="text" placeholder="请输入笔记标题" size="medium" v-model="editDetail.title" clearable @change="checkEditTitle(editDetail.title);"></el-input>
        <div slot="footer" class="dialog-footer" style="text-align: center;">
        <span style="color:red" v-if="hasNoteTitle===false">笔记标题不能为空</span>
          <el-button type="primary" @click="editNoteTitleVisiable=false" v-if="hasNoteTitle===true">确定</el-button>
          <el-button @click="editNoteTitleVisiable = false" v-if="hasNoteTitle===true">取消</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<style rel="stylesheet/scss" lang="scss" scoped>
  // .quill-editor {
  //   box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  // }
  .note-content{
    white-space:pre;
    width:100%;
    min-height:442px;
    border: 1px solid #ccc;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }
</style>
<style rel="stylesheet/scss" lang="scss">
  .ql-container{
    min-height: 400px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }
  .ql-toolbar{
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }
</style>


<script>
import { formatDateTime } from '@/utils/tools' // 格式化时间
import { getRequestUser, verify } from '@/utils/tools' // 获取当前用户信息
import {
  firstIn,
  queryByKeyWords,
  addNotes,
  getNoteDetail,
  modifyNote,
  deleteOneNote
} from '@/api/note_list' // 接口
export default {
  name: 'note_list',

  data() {
    return {
      isListPage: '1', // 是否是主页
      uid: '', // 每次查询默认带上的参数
      req: {
        pageNo: 1,
        pageSize: 10,
        keyword: '',
        startat: '',
        endat: '',
        uid: ''
      },
      timeValue: '', // 查询时间显示
      tableData: [], // 表格数据
      pageShow: false, // 分页显示与否
      pageInfo: {}, // 分页信息
      noteTitle: '', // 新建笔记标题
      hasNoteTitle: true, // 判断是否有笔记标题
      noteTitleVisiable: false, // 新建笔记dialog显示与否
      editNoteTitleVisiable: false, // 修改笔记标题dialog
      deleteVisiable: false, // 删除dialog显示与否
      del_noteid: '', // 删除的笔记id
      del_uid: '', // 删除的操作人id
      content: '',
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike', 'image'], // 加粗bold 斜体italic 下划线underline 删除线strike
            ['blockquote', 'code-block'], // 引用blockquote 代码块code-block
            [{ 'direction': 'rtl' }, { 'script': 'sub' }, { 'script': 'super' }, { 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'color': [] }, { 'background': [] }, { 'font': [] }, { 'align': [] }]
          ]
        },
        placeholder: '在此键入文本或图片内容(上限16MB)...'
      },
      note_item: { // 新建/修改笔记参数
        title: '',
        content: ''
      },
      noteid: '', // 修改的笔记id
      noteDetail: { // 笔记详情
        title: '',
        content: ''
      },
      editDetail: { // 修改笔记详情
        title: '',
        content: ''
      }
    }
  },

  methods: {
    // 默认查询
    firstInQuery(uid) {
      firstIn(uid)
        .then(response => {
          if (response.data.paging.note_total !== 0) {
            this.tableData = response.data.notes
            this.pageShow = true
            this.pageInfo.pageNo = response.data.paging.page_current
            this.pageInfo.pageSize = response.data.paging.page_size
            this.pageInfo.totalCount = response.data.paging.note_total
          } else {
            this.pageShow = false
            this.$message.error('无查询结果，请核对查询条件')
          }
        })
    },
    // 综合查询
    searchByKeyWords(req) {
      req.startat = this.timeValue[0]
      req.endat = this.timeValue[1]
      this.req.uid = this.uid
      queryByKeyWords(req)
        .then(response => {
          if (response.data.paging.note_total !== 0) {
            this.tableData = response.data.notes
            this.pageShow = true
            this.pageInfo.pageNo = response.data.paging.page_current
            this.pageInfo.pageSize = response.data.paging.page_size
            this.pageInfo.totalCount = response.data.paging.note_total
          } else {
            this.tableData = response.data.notes
            this.pageShow = false
            this.$message.error('无查询结果，请核对查询条件')
          }
        })
    },
    // 格式化时间
    formatDateTime: formatDateTime,
    // 重置查询项
    resetQueryCondition() {
      this.timeValue = ''
      this.req = {
        pageNo: this.pageInfo.pageNo,
        pageSize: this.pageInfo.pageSize,
        keyword: '',
        startat: '',
        endat: ''
      }
    },
    // 判断修改笔记标题是否为空
    checkEditTitle(noteTitle) {
      if (
        noteTitle === '' ||
        noteTitle.split(' ').join('').length === 0
      ) {
        this.hasNoteTitle = false
      } else {
        this.hasNoteTitle = true
      }
    },
    // 表格多选
    // handleSelectionChange(val) {

    // },
    // 页面显示条数
    handleSizeChange(val) {
      this.req.pageSize = val
      this.req.pageNo = 1
      this.pageInfo.pageNo = 1
      this.searchByKeyWords(this.req)
    },
    // 分页查询
    handleCurrentChange(val) {
      this.req.pageNo = val
      this.searchByKeyWords(this.req)
    },
    // 判断笔记标题是否为空
    checkTitleIsNullOrNot(noteTitle) {
      if (noteTitle === '') {
        this.$message.error('请输入笔记标题！')
        return
      } else {
        this.isListPage = '2'
      }
    },
    onEditorBlur(editor) {
      // 失去焦点事件
    },
    onEditorFocus(editor) { // 获得焦点事件

    },
    onEditorChange({ editor, html, text }) { // 编辑器文本发生变化
      // this.content可以实时获取到当前编辑器内的文本内容
      // console.log(html)
      // this.text = text
    },
    // 新建笔记
    generateNote() {
      var temp_content = this.content
      temp_content = verify(temp_content, '<p>')
      temp_content = verify(temp_content, '</p>')
      temp_content = verify(temp_content, '<br>')
      if (temp_content === '' || temp_content === null || temp_content.split(' ').join('').length === 0) {
        this.$message.error('笔记内容不能为空！')
        return
      } else {
        this.note_item.title = this.noteTitle
        this.note_item.content = this.content
        addNotes(this.note_item, this.uid)
          .then(response => {
            if (response.data) {
              this.$message.success('新建笔记成功')
              this.note_item.content = ''
              this.note_item.title = ''
              this.content = null
              this.noteTitle = ''
              this.searchByKeyWords(this.req)
              this.isListPage = '1'
            } else {
              this.$message.error('服务出错啦...请稍后重试')
            }
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
    // 单个查询
    queryOne(noteid, uid) {
      getNoteDetail(noteid, uid)
        .then(response => {
          // if (response.data.code === 200) {
          if (response.data) {
            this.noteDetail.title = response.data.title
            this.noteDetail.content = response.data.content
            console.log('linn:' + this.noteDetail.content)
            this.isListPage = '3'
          } else {
            this.$message.error('服务器出错！请稍后重试')
          }
        })
    },
    // 展示修改笔记详情
    showEditNote(noteid, uid) {
      getNoteDetail(noteid, uid)
        .then(response => {
          // if (response.data.code === 200) {
          if (response.data) {
            this.editDetail.title = response.data.title
            this.editDetail.content = response.data.content
            this.noteid = response.data.noteid
            this.isListPage = '4'
          } else {
            this.$message.error('服务器出错！请稍后重试')
          }
        })
    },
    // 修改笔记
    modifyNote() {
      var temp_content = this.editDetail.content
      temp_content = verify(temp_content, '<p>')
      temp_content = verify(temp_content, '</p>')
      temp_content = verify(temp_content, '<br>')
      if (temp_content === '' || temp_content === null || temp_content.split(' ').join('').length === 0) {
        this.$message.error('笔记内容不能为空！')
        return
      } else {
        this.note_item.title = this.editDetail.title
        this.note_item.content = this.editDetail.content
        modifyNote(this.note_item, this.uid, this.noteid)
          .then(response => {
            this.$message.success('修改笔记成功')
            this.note_item.content = ''
            this.note_item.title = ''
            this.noteid = ''
            this.editDetail.content = null
            this.editDetail.title = ''
            this.searchByKeyWords(this.req)
            this.isListPage = '1'
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
    // 删除笔记 单个删除
    deleteNote(del_noteid, del_uid) {
      deleteOneNote(del_noteid, del_uid)
        .then(response => {
          this.$message.success('删除成功')
          this.deleteVisiable = false
          this.req.pageNo = 1
          this.pageInfo.pageNo =
          this.searchByKeyWords(this.req)
        })
    }
  },

  mounted() {
    getRequestUser()
      .then(res => {
        this.uid = res.data.agentid
        this.req.uid = res.data.agentid
        if (this.req.uid !== '') {
          this.firstInQuery(this.req.uid)
        }
      })
  },

  watch: {},

  components: {},

  mixins: [],

  vuex: {},

  created() {}

}

</script>
