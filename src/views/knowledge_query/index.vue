<template>
  <div id="kb-query" clss="container">
    <el-container>
      <el-aside style="width:240px;overflow-y:hidden;background:#fff;border-right:1px solid #ccc;">
        <div class="asinde-header" v-if="permission">
          <span class="font14 bold" style="display:inline-block;margin-right:10px;">目录列表</span>
        </div>
        <div class="expand" style="position:relative;height:93.6%;overflow-y:auto;">
          <div style="display:inline-block;padding-left:20px;box-sizing:border-box;">
            <el-tree 
            class="expand-tree font12"
            key="tree"
            ref="tree"
            :draggable="draggable"
            v-if="isLoadingTree"
            :data="setTree"
            :props="defaultProps"
            :expand-on-click-node="false"
            :render-content="renderContent"
            @node-click="handleNodeClick"
            node-key="ID"
            :default-expanded-keys="expandedItem"></el-tree>
          </div>
        </div>
      </el-aside>
      <el-container>
        <div class="kb-main" style="width:100%;">
          <!-- 主页 -->
          <section style="padding-top:0;height:100%;">
            <div class="kb-form-container">
              <el-form :inline="true" size="small">
                <!-- <el-row> -->
                  <!-- <el-col :span="8"> -->
                  <div style="display:inline;">
                    <el-form-item label="关键字:">
                      <el-input v-model="searchReq.q" placeholder="关键字"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="searchReq.pageNo=1;searchReq2=clone(searchReq);handleSearch();">查询</el-button>
                      <el-button @click="reset();searchReq2=clone(searchReq)">重置</el-button>
                    </el-form-item>
                  </div>
                  <!-- </el-col> -->
                  <!-- <el-col :span="16"> -->
                  <div style="display:inline;white-space:nowrap;">
                    <div
                      class="history-keys"
                      v-for="(item,index) in historyKey">
                      <el-popover 
                        trigger="hover" 
                        placement="bottom" 
                        :content="item.key">
                        <div slot="reference" class="history-key-container">
                          <a 
                            class="history-key font14"
                            @click="searchReq.pageNo=1;searchReq2=clone(searchReq);getArticles(item.key)"
                            :key="index">
                            {{item.key}}
                          </a>
                        </div>
                      </el-popover>
                    </div>
                  </div>
                  <!-- </el-col> -->
                <!-- </el-row> -->
              </el-form>
            </div>
            <div class="kb-content">
              <div class="list">
                <ul>
                  <li v-if="!articlesList.length">
                    暂无数据
                  </li>
                  <li class="list-item" v-for="(item,index) in articlesList" :key="index">
                    <a class="font14 link title" style="margin-bottom:10px;" @click="queryOne(item.id)">{{item.title}}</a>
                    <div class="font12" style="margin-bottom:10px;color:#333;line-height: 16px;">
                      {{item.summary}}
                    </div>
                    <div class="font12" style="margin-bottom:10px;">
                      <span>
                        关键词：
                      </span>
                      <span>
                        {{item.keywords?item.keywords:'无'}}
                      </span>
                      <span style="padding-left:5px;">
                        点击量：
                      </span>
                      <span>
                        {{item.hits}}
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div class="click-rank">
                <div class="font12 margin-bottom-20">找到{{pageInfo.total}}条结果</div>
                <div class="font14" style="margin-bottom:10px;">点击量排行</div>
                <ul>
                  <li  
                    v-for="(item,index) in hitRankList"
                    style="margin-bottom:5px;">
                    <el-popover trigger="hover" placement="left" :content="item.title">
                      <div class="text-hidden" style="display:inline-block;max-width:85%;" slot="reference">
                        <a class="link font12" @click="searchReq.pageNo=1;searchReq2=clone(searchReq);getArticles(item.title)">{{item.title}}</a>
                      </div>
                    </el-popover>
                    <div class="text-hidden" style="display:inline-block;max-width:15%;float:right;">
                      <span class="font14">{{item.hits}}</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageInfo.pageNo"
                :page-sizes="[10, 20, 30, 40, 50]"
                :page-size="pageInfo.pageSize"
                layout="total, sizes, prev, pager, next, jumper "
                :total="pageInfo.total" 
                style="text-align: right;float:right;margin-right:260px;">
              </el-pagination>
            </div>
          </section>
          <!-- 详情 -->
          <el-dialog
            top="5vh"
            width="90%"
            :visible.sync="detailArticles"
            @close="getArticles(key)"
            append-to-body>
            <div>
              <el-row>
                <h3 style="text-align:center">{{noteDetail.title}}&nbsp;&nbsp;</h3>
              </el-row>
              <el-row>
                <el-form size="small" :inline="true" style="margin-left:-5px;">
                  <el-form-item label="创建人:" label-width="65px">
                    <div>{{noteDetail.creatorRealname}}</div>
                  </el-form-item>
                  <el-form-item label="创建时间:" label-width="75px" style="margin-left:100px;">
                    <div>{{formatDateTime(noteDetail.CreatedAt)}}</div>
                  </el-form-item>
                </el-form>
              </el-row>
              <el-row>
                <el-form size="small" :inline="true" style="margin-left:-5px;margin-top:-20px;">
                  <el-form-item label="修改人:" label-width="65px">
                    <div>{{noteDetail.updatorRealname}}</div>
                  </el-form-item>
                  <el-form-item label="修改时间:" label-width="75px" style="margin-left:100px;">
                    <div>{{formatDateTime(noteDetail.UpdatedAt)}}</div>
                  </el-form-item>
                </el-form>
              </el-row>
              <el-row>
                <el-form size="small">
                  <el-form-item style="margin-left:-2px;margin-top:-20px;" label-width="75px" label="所在目录:">
                    <div v-for="item in noteDetail.catalogs" :key="item.path">{{item.path_name}}</div>
                  </el-form-item>
                </el-form>
              </el-row>
              <el-row>
                <el-form size="small">
                  <el-form-item style="margin-top:-20px;" label-width="45px" label="概要:">
                    <div>{{noteDetail.brief}}</div>
                  </el-form-item>
                </el-form>
              </el-row>
              <div v-html="noteDetail.body" class="note-content div-content" style="word-wrap:auto;">

              </div>
              <el-row>
                <el-form size="small">
                  <div style="font-weight:bold;color:red;" class="el-upload__tip">注：txt和pdf格式的文件直接点击为预览，预览页面可以右键另存为下载，也可以右键选择另存为直接下载</div>
                  <el-form-item label-width="45px" label="附件:">
                    <div v-for="item in DLurl" :key="item.name">
                      <span>{{item.name}}</span><a :href="item.url" style="font-size:16px;" type="text" size="mini" circle download target="_blank"><i style="color:blue;padding:0 8px;" class="el-icon-download"></i></a>
                    </div>
                  </el-form-item>

                  <el-form-item label-width="45px" label="备注:">
                    <div>{{noteDetail.remark}}</div>
                  </el-form-item>
                </el-form>
              </el-row>
              <el-row style="margin-top:1%;text-align:center;">
                <el-button type="primary" plain @click="noteDetail.title='';detailArticles=false;noteDetail.body=null;">关闭</el-button>
              </el-row>
            </div>
          </el-dialog>
        </div>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import TreeRender from '@/components/tree/tree_kb.vue'
import {
  getCatalogs,
  getArticlesDetail,
  getArticlesById,
  getArticles
} from '@/api/kb_query'
import {
  permsKBUpdate
} from '@/api/permission'
import {
  clone,
  formatDateTime
} from '@/utils/tools'
export default{
  name: 'knowledge_query',
  data() {
    return {
      token: localStorage.getItem('Admin-Token'),
      permission: false,
      // tree
      isLoadingTree: false, // 是否加载节点树
      draggable: true,
      maxexpandId: 0,
      non_maxexpandId: this.maxexpandId,
      setTree: [], // 新建窗口 节点树数据
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      catalogid: '',
      articleid: '',
      node: {},
      data: {},
      store: {},
      editCancel: false,
      expandedItem: [],
      // -------------------------
      pageInfo: {
        total: 0
      },
      detailArticles: false,
      brief: '',
      remark: '',
      body: '',
      searchReq: {
        q: '',
        c: '',
        pageNo: 1,
        pageSize: 10
      },
      searchReq2: {
        q: '',
        c: '',
        pageNo: 1,
        pageSize: 10
      },
      nodeReq: {
        pageNo: 1,
        pageSize: 10
      },
      historyKey: [],
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
      noteDetail: { // 详情
        title: '',
        body: '',
        brief: '',
        remark: ''
      },
      articlesList: [],
      hitRankList: [],
      DLurl: [],
      key: ''
    }
  },
  methods: {
    // tree------------------------
    initExpand() {
      this.isLoadingTree = true
    },
    // 查询所有节点列表
    getCatalogs() {
      getCatalogs().then(response => {
        this.setTree = response.data
      }).catch(error => {
        throw error
      })
    },
    resetTree() {
      if (this.$refs.tree2) {
        for (var i = 0; i < this.$refs.tree2.store._getAllNodes().length; i++) {
          this.$refs.tree2.store._getAllNodes()[i].expanded = this.isexpand
        }
      }
    },
    handleNodeClick(d, n, s) {
      // 点击节点
      this.catalogid = d.ID
      this.searchReq.c = d.ID
      // 展开节点
      if (!n.expanded) {
        n.expanded = true
      } else if (n.expanded) {
        n.expanded = false
      }
      if (!this.searchReq.q) { // 如果表单无关键字，递归查询节点所有文章
        // 按节点递归查询
        getArticlesById(d.ID).then(response => {
          this.articlesList = response.data.result
          this.pageInfo = response.data.pageInfo
          this.hitRankList = response.data.top
        }).catch(error => {
          this.$message({
            message: '查询失败',
            type: 'error'
          })
          throw error
        })
      }
    },
    renderContent(h, { node, data, store }) {
      // 加载节点
      const that = this
      that.node = node
      that.data = data
      that.store = store
      return h(TreeRender, {
        props: {
          DATA: data,
          NODE: node,
          STORE: store,
          maxexpandId: that.non_maxexpandId,
          editCancel: that.editCancel,
          permission: that.permission
        },
        on: {
          nodeAdd: (s, d, n) => that.handleAdd(s, d, n),
          submitAdd: (s, d, n) => that.addCatalogs(s, d, n),
          nodeEdit: (s, d, n) => that.handleEdit(s, d, n),
          submitEdit: (s, d, n) => that.submitEdit(s, d, n),
          nodeDel: (s, d, n) => that.handleDelete(s, d, n),
          nodeCancel: (s, d, n) => that.handleCancel(s, d, n)
        }
      })
    },
    download(url, name) {
      window.open(url)
    },
    // -------------------------
    clone: clone,
    formatDateTime: formatDateTime,
    reset() {
      $('.tree-label').removeClass('checked')
      this.searchReq = {
        q: '',
        c: '',
        pageNo: 1,
        pageSize: 10
      }
      this.searchReq2 = {
        q: '',
        c: '',
        pageNo: 1,
        pageSize: 10
      }
    },
    // 查询
    // 查询的历史记录
    handleSearch() {
      this.historyKey = []
      if (localStorage.getItem('kb_searchKey')) {
        this.historyKey = JSON.parse(localStorage.getItem('kb_searchKey'))
      }
      this.key = this.searchReq.q
      getArticles(this.searchReq).then(response => {
        if (response.data.result) {
          this.articlesList = response.data.result
          this.pageInfo = response.data.pageInfo
          this.hitRankList = response.data.top
        } else {
          this.$message.error('查询失败')
        }
        if (!this.searchReq.q) {
          return false
        }
        const date = Number(new Date())
        const key = this.searchReq.q
        const temp = { date, key }
        if (this.historyKey.length < 5 && this.historyKey.length !== 0) {
          if (localStorage.getItem('kb_searchKey').indexOf(key) === -1) {
            this.historyKey.push(temp)
          }
        } else if (this.historyKey.length < 5 && this.historyKey.length === 0) {
          this.historyKey.push(temp)
        } else {
          if (localStorage.getItem('kb_searchKey').indexOf(key) === -1) {
            this.historyKey.push(temp)
            this.historyKey.shift()
          }
        }
        console.log(this.historyKey)
        localStorage.setItem('kb_searchKey', JSON.stringify(this.historyKey))
      }).catch(error => {
        throw error
      })
    },
    getArticles(key = '', type) {
      this.searchReq2 = clone(this.searchReq)
      this.searchReq2.q = key
      this.key = key
      getArticles(this.searchReq2).then(response => {
        if (response.data.result) {
          this.articlesList = response.data.result
          this.pageInfo = response.data.pageInfo
          this.hitRankList = response.data.top
        } else {
          this.$message.error('查询失败')
        }
      }).catch(error => {
        throw error
      })
    },
    // 详情
    queryOne(id) {
      this.detailArticles = true
      getArticlesDetail(id)
        .then(response => {
          if (response.data) {
            this.DLurl.length = 0
            if (response.data.attachments) {
              if (response.data.attachments.length) {
                for (let i = 0; i < response.data.attachments.length; i++) {
                  const url = `${process.env.FILE_SERVER_URL}/crm/${response.data.attachments[i].file_path}`
                  const fileName = response.data.attachments[i].file_path.split('/')
                  this.DLurl.push({ 'name': fileName[fileName.length - 1], 'url': url })
                }
              }
            } else {
              this.DLurl = []
            }
            this.noteDetail.title = response.data.title
            this.noteDetail.body = response.data.body
            this.noteDetail.brief = response.data.brief
            this.noteDetail.remark = response.data.remark
            this.noteDetail.CreatedAt = response.data.CreatedAt
            this.noteDetail.UpdatedAt = response.data.UpdatedAt
            this.noteDetail.creatorRealname = response.data.creatorRealname
            this.noteDetail.updatorRealname = response.data.updatorRealname
            this.noteDetail.catalogs = response.data.catalogs
            this.detailArticles = true
          } else {
            this.$message.error('服务器或网络出错！请稍后重试')
          }
        }).catch(error => {
          this.noteDetail.title = '服务器或网络出错！请稍后重试'
          this.noteDetail.body = '服务器或网络出错！请稍后重试'
          this.noteDetail.brief = '服务器或网络出错！请稍后重试'
          this.noteDetail.remark = '服务器或网络出错！请稍后重试'
          this.DLurl = []
          throw error
        })
    },
    // 页面显示条数
    handleSizeChange(val) {
      this.searchReq2 = clone(this.searchReq)
      this.searchReq2.pageSize = val
      this.searchReq.pageSize = val
      this.searchReq2.pageNo = 1
      this.pageInfo.pageNo = 1
      this.getArticles(this.searchReq2.q)
    },
    // 分页翻页功能
    handleCurrentChange(val) {
      this.searchReq2 = clone(this.searchReq)
      this.searchReq2.pageNo = val
      this.searchReq.pageNo = val
      this.getArticles(this.searchReq2.q)
    }
  },
  mounted() {
    const VM = this
    $('body').click(function() {
      $('.tree-label').removeClass('checked')
      VM.searchReq.c = ''
    })
    $('.el-form').click(function(e) {
      e.stopPropagation()
    })
    $('.click-rank ul').click(function(e) {
      e.stopPropagation()
    })
    $('.kb-content .title').click(function(e) {
      e.stopPropagation()
    })
    this.historyKey = JSON.parse(localStorage.getItem('kb_searchKey'))
    this.initExpand()
    this.getCatalogs()
    // 获取权限
    permsKBUpdate(localStorage.getItem('accountNo')).then(response => {
      const code = parseInt(response.data.code)
      if (code === 200) {
        this.permission = true
        this.getArticles()
      } else if (code === 403) {
        this.permission = false
        this.getArticles()
      } else {
        this.$message.error(response.data.message)
        window.location.reload()
      }
    }).catch(error => {
      console.log(error)
    })
  }
}
</script>
<style lang="scss">
  #kb-query{
    //页面样式
    aside{
      background:#252E34;
      color:#BFCBBA;
      width:14%;
    }
    .table-container{
      box-shadow:none;
      margin-top:0;
    }
    .kb-form-container{
      padding:15px;
      padding-bottom:0;
      box-sizing:border-box;
      border-bottom:1px solid rgb(204, 204, 204);
      .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
        margin-bottom:15px;
      }
      .history-keys{
        margin-top:7px;
        margin-right:10px;
        max-width:20%;
        display:inline-block;
        .history-key-container{
          text-overflow: ellipsis;
          white-space:nowrap;
          overflow: hidden;
          width:100%;
          text-align:center;
          .history-key{
            color:#57AFFF;
            display:inline-block;
            &:hover{
              text-decoration: underline;
            }
          }
        }
      }
    }
    .link{
      color:#57AFFF;
      display:inline-block;
      margin-right:15px;
      &:hover{
        text-decoration: underline;
      }
    }
    .kb-content{
      width:100%;
      height: calc(92.2% - 52px);
      overflow-y:auto;
      .list{
        height:100%;
        width: calc(100% - 240px);
        float:left;
        padding:20px;
        padding-right:50px;
        .list-item{
          box-sizing:border-box;
          border-bottom:1px solid #ccc;
          margin-top:7px;
          &:nth-child(1){
            margin-top:0;
          }
        }
      }
      .click-rank{
        margin-top:15px;
        max-height:98%;
        box-sizing:border-box;
        padding:10px;
        padding-bottom:0;
        width:239px;
        border-left:1px solid #ccc;
        position: fixed;
        right: 47px;
        .text-hidden{
          max-width:100%;
          width:auto;
        }
      }
    }
    .note-content{
      white-space:pre;
      width:100%;
      min-height:442px;
      border: 1px solid #ccc;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }
    .note-content.div-content{
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      line-height: 1.42;
      height: 100%;
      outline: none;
      overflow-y: auto;
      padding: 12px 15px;
      -o-tab-size: 4;
      tab-size: 4;
      -moz-tab-size: 4;
      text-align: left;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    .el-tree-node__content{
      height:22px;
      line-height:22px;
      display:inline-block;
      .tree-expand{
        display:inline-block;
        height:100%;
        .tree-label{
          padding:0 10px;
          display:inline-block;
          height:100%;
          &:hover{
            background:#57AFFF;
            color:#fff;
          }
          }
        }
      &:hover{
        background:none;
      }
    }
    
  }
  #kb-query{
    .form-container{
      .el-collapse-item__content{
        padding-bottom:0;
      }
    }
     /* tree样式 */
    .el-tree{
      color:#333;
      background:none;
      position:static;
    }
    .expand::-webkit-scrollbar-track{
      box-shadow: inset 0 0 6px rgba(0,0,0,.3);
      border-radius:5px;
    }
    .expand::-webkit-scrollbar-thumb{
      background-color:rgba(50, 65, 87, 0.5);
      outline:1px solid slategrey;
      border-radius:5px;
    }
    .expand::-webkit-scrollbar{
      width:10px;
    }
    .asinde-header{
      width:100%;
      height:52px;
      padding-left:16px;
      span{
        line-height:52px;
      }
    }
    .tree-button{
      padding:7px;
      &.tree-add-top{
        cursor:pointer;
        background:url('../../../static/images/tree_add_top.png') no-repeat 0 9px;
      }
    }
    .el-tree__empty-text{
      color:#BFCBCF;
    }
    .expand{
      height:93.8%;
      overflow:auto;
    }
    .div{
      display: inline-block;
      margin:0 auto;
      overflow:auto;
    }
    .expand-tree{
      border:none;
      .is-current>.el-tree-node__content{
        background:none;
        .tree-label{
          white-space:nowrap;
          color:#333;
          font-weight: normal;
          &:hover{
            background:#57AFFF;
            color:#fff;
          }
          &.checked{
            color:#fff;
            background:#57AFFF;
          }
        }
      }
    }
    .expand-tree .el-tree-node.is-current,
    .expand-tree .el-tree-node:hover{
      overflow:hidden;
    }
    .el-tree-node__content{
      background:none;
    }
    .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
      background:#39484D;
    }
    .expand-tree .tree-btn{
      display:none;
    }
    .el-container.kb-main{
      float:right;
    }
    .kb-main>.el-main{
      overflow:visible;
    }
  }
  .kb-upload {
    .el-upload-list__item .el-icon-close {
      display:inline;
      position: relative;
      right:35px;
      top:2px;
    }
    .el-upload-list__item-status-label{
      display:none !important;
      position: relative;
      right:-3px;
      top:2px;
    }
    .el-upload-list__item-name{
      display:inline;
      padding:0;
    }
    .el-icon-document{
      display:none;
    }
  }
  // 富文本样式
  .ql-toolbar{
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }
  .ql-editor{
    position:absolute;
    left:0;
    right:0;
    top:0;
    bottom:0;
  }
 .ql-container{
    min-height: 400px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }
  #kb-query>.el-container{
    height:85vh;
    background:#FFF;
    box-shadow: 0 0 10px 0 rgba(39,48,69,0.10);
  }
  @media screen and (min-width: 1281px) and (max-width:1367px){
    #kb-query>.el-container{
      height:80vh;
    }
    #kb-query {
      .kb-content{
        height: calc(92.2% - 105px);
      }
    }
  }
  @media all and (min-width:1024px) and (max-width:1280px)  {
    #kb-query>.el-container{
      height:80vh;
    }
    #kb-query {
      .kb-content{
        height: calc(92.2% - 105px);
      }
    }
  }
</style>
