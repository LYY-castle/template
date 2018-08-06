<template>
  <div>
    <!-- 列表管理 -->
    <div class="container" style="padding:0 20px;" v-show="isListPage==='1'">
      <el-row><br/>
        <el-form :inline="true" size="small">
          <el-form-item label="笔记标题">
            <el-input type="text" v-model="req.keyword" size="medium" placeholder="笔记标题"></el-input>
          </el-form-item>
          <el-form-item label="最近修改时间">
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
            <el-button type="primary" icon="el-icon-search" @click="req.page=1;searchByKeyWords(req)">筛选</el-button>
            <el-button type="danger"  @click="resetQueryCondition()" icon="el-icon-refresh">重置</el-button>
          </el-form-item>
        </el-form>
      </el-row>

      <el-row>
        <el-col>
          <el-table :data="tableData" border>
            <!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
            <el-table-column align="center" label="序号" width="55">
              <template slot-scope="scope">
                <div>{{scope.$index+(req.page-1)*10+1}}</div>
              </template>
            </el-table-column>
            <!-- <el-table-column align="center" label="笔记编号" prop="noteid"></el-table-column> -->
            <el-table-column align="center" label="笔记标题">
              <template slot-scope="scope">
                <el-button @click="queryOne(scope.row.noteid,scope.row.userid)" type="text" size="medium">{{scope.row.title}}</el-button>
              </template>
            </el-table-column>
            <el-table-column align="center" label="创建时间">
              <template slot-scope="scope">
                <div v-html="formatDateTime(scope.row.createdat)"></div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="最近修改时间">
              <template slot-scope="scope">
                <div v-html="formatDateTime(scope.row.updatedat)"></div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button type="text" icon="el-icon-edit" size="medium" @click="showEditNote(scope.row.noteid,scope.row.userid)">修改</el-button>
                <el-button type="text" size="medium" @click="deleteVisiable=true;del_noteid=scope.row.noteid;del_uid=scope.row.userid">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <el-row style="margin-top:5px;">
        <el-button type="success" size="small" @click="noteTitle='';noteTitleVisiable=true" icon="el-icon-plus">新建笔记</el-button>
        <!-- <el-button type="danger" size="small" @click="" icon="el-icon-minus">批量删除</el-button> -->
        <el-pagination
            v-if="pageShow"
            background
            @current-change="handleCurrentChange"
            :current-page=pageInfo.page_current
            :page-sizes="[10, 20, 30, 50]"
            :page-size=pageInfo.page_size
            layout="total, prev, pager, next, jumper"
            :total=pageInfo.note_total style="text-align: right;float:right;">
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
    <div class="container" style="padding:0 20px;" v-show="isListPage==='2'">
      <div style="text-align:center">
        <h3>{{noteTitle}}</h3>
        <quill-editor
        v-model="content" 
        ref="myQuillEditor" 
        :options="editorOption" 
        style="white-space:pre"
        @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
        @change="onEditorChange($event)"
        ></quill-editor><br/><br/><br/><br/>
        <el-button type="success" round @click="generateNote();" size="medium" icon="el-icon-check">新建笔记</el-button>
        <el-button type="primary" round @click="noteTitle='';isListPage='1';content=null" size="medium">取消</el-button>
      </div>
    </div>
    <!-- 新建笔记end -->

    <!-- 笔记详情 -->
    <div class="container" style="padding:0 20px;" v-show="isListPage==='3'">
      <div style="text-align:center">
        <h3>{{noteDetail.title}}&nbsp;&nbsp;</h3>
        <quill-editor
        :content="noteDetail.content" 
        style="white-space:pre"
        ref="myQuillEditor" 
        :options="editorOption"></quill-editor><br/><br/><br/><br/>
        <el-button type="primary" round @click="noteDetail.title='';isListPage='1';noteDetail.content=null" size="medium">返回列表</el-button>
      </div>
    </div>
    <!-- 笔记详情end -->

    <!-- 修改笔记 -->
    <div class="container" style="padding:0 20px;" v-show="isListPage==='4'">
      <div style="text-align:center">
        <h3>{{editDetail.title}}
          <el-tooltip class="item" effect="dark" content="修改笔记标题" placement="right-start">  
            <el-button type="primary" icon="el-icon-edit-outline" @click="editNoteTitleVisiable=true" size="mini" circle></el-button>
          </el-tooltip>  
        </h3>
        <quill-editor
        v-model="editDetail.content" 
        ref="myQuillEditor" 
        style="white-space:pre"
        :options="editorOption"
        @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
        @change="onEditorChange($event)"
        ></quill-editor><br/><br/><br/><br/>
        <el-button type="success" round @click="modifyNote();" size="medium" icon="el-icon-check">修改笔记</el-button>
        <el-button type="primary" round @click="editDetail.title='';isListPage='1';editDetail.content=null" size="medium">取消</el-button>
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

<style lang='scss' scoped>
  .quill-editor {
        height: 450px;
    }
</style>

<script>
// import { quillEditor } from 'vue-quill-editor'
import { getMenu } from '@/api/dashboard' // 侧边栏菜单
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
        page: 1,
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
            this.pageInfo = response.data.paging
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
            this.pageInfo = response.data.paging
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
        page: 1,
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
    // 分页查询
    handleCurrentChange(val) {
      this.req.page = val
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
      console.log(temp_content)
      if (temp_content === '' || temp_content === null || temp_content.split(' ').join('').length === 0) {
        this.$message.error('笔记内容不能为空！')
        return
      } else {
        this.note_item.title = this.noteTitle
        this.note_item.content = this.content
        console.log(this.content)
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

  beforeCreate() {
    getMenu()
      .then(response => {
        const data = response.data
        sessionStorage.setItem('getMenu', JSON.stringify(data))
      })
      .catch(error => {
        console.log(error)
      })
  },

  watch: {},

  components: {},

  mixins: [],

  vuex: {},

  created() {}

}

</script>
