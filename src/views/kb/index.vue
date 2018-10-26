<template>
  <el-container style="min-height:99vh;" id="kb">
    <el-col :span="4">
      <el-aside style="width:19%;">
        <div class="expand">
          <div v-if="permission" style="position:fixed;top:101px;width:18.1%;height:81px;background:#252E34;z-index:500;"></div>
          <div style="position:relative;top:83px;min-width:100%">
            <el-button v-if="permission" class="tree-add-top" type="success" size="small" @click="handleAddTop">新建目录</el-button>
            <el-tree class="expand-tree"
            key="tree"
            ref="tree"
            :draggable="draggable"
            v-if="isLoadingTree"
            :data="setTree"
            highlight-current
            :props="defaultProps"
            :expand-on-click-node="false"
            :render-content="renderContent"
            @node-drag-end="handleDragEnd"
            @node-click="handleNodeClick"
            node-key="ID"
            :default-expanded-keys="expandedItem"></el-tree>
          </div>
        </div>
      </el-aside>
    </el-col>
    <el-col :span="1"></el-col>
    <el-col :span="19">
      <el-container class="kb-main" style="width:100%">
      <!-- 主页 -->
      <el-main v-if="isListPage==='1'">
        <el-row>
          <el-form>
            <el-form-item label="查询方式：" prop="validityStatus">
              <el-radio-group v-model="searchType" size="small" @change="searchTypeChange">
                <el-radio-button label='0' border>普通</el-radio-button>
                <el-radio-button label='1' border>高级</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <el-form :inline="true" size="small" v-if="searchType==='0'">
            <el-form-item label="标题:">
              <el-input v-model="req.title" placeholder="标题"></el-input>
            </el-form-item>
            <el-form-item label="发布时间：">
              <el-date-picker
                  v-model="timeValue"
                  type="datetimerange"
                  range-separator="-"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getArticles1(req);req2=clone(req);">查询</el-button>
              <el-button type="danger" @click="reset();req2=clone(req)">重置</el-button>
            </el-form-item>
          </el-form>
          <el-form :inline="true" size="small" v-if="searchType==='1'">
            <el-form-item label="关键字:">
              <el-input v-model="searchReq.query" placeholder="关键字"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchReq.pageNo=1;getArticles1(searchReq);searchReq2=clone(searchReq);getPath();">查询</el-button>
              <el-button type="danger" @click="reset();searchReq2=clone(searchReq)">重置</el-button>
            </el-form-item>
          </el-form>
        </el-row>
        <!-- 普通查询 -->
        <el-row v-if="tableType===2||tableType===1">
          <el-table
            :data="tableData">
            <!-- <el-table-column
              align="left"
              type="selection"
              width="30">
            </el-table-column> -->
            <el-table-column
              align="center"
              prop="name"
              width="58">
              <template
                slot-scope="scope">
                <div>
                  <span v-if="scope.row.hits&&scope.row.hot" style="color:red;font-size:10px;">Hot</span>
                  <span v-if="scope.row.status==1&&setNew(scope.row)" style="color:#E8D343;font-size:10px;">New</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="title"
              label="标题">
              <template
                slot-scope="scope">
                <div style="text-align:left;">
                  <a @click="queryOne(scope.row.ID);">
                      {{scope.row.title}}
                  </a>
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column
              align="center"
              prop="title"
              label="路径">
              <template
                slot-scope="scope">
                <div>
                  {{getPath(scope.row)}}
                </div>
              </template>
            </el-table-column> -->
            <el-table-column
              width="80"
              align="center"
              prop="hits"
              label="阅读次数">
            </el-table-column>
            <el-table-column
              width="100"
              align="center"
              prop="creatorRealname"
              label="创建人">
            </el-table-column>
            <el-table-column
              width="100"
              align="center"
              prop="updatorRealname"
              label="修改人">
            </el-table-column>
            <el-table-column
              align="center"
              prop="CreatedAt"
              label="创建时间">
              <template slot-scope="scope">
                <div>{{formatDateTime(scope.row.CreatedAt)}}</div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="UpdatedAt"
              label="修改时间">
              <template slot-scope="scope">
                <div>{{formatDateTime(scope.row.UpdatedAt)}}</div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="release_time"
              label="发布时间">
              <template slot-scope="scope">
                <div v-if="scope.row.status==1">{{formatDateTime(scope.row.release_time)}}</div>
              </template>  
            </el-table-column>
            <el-table-column
              width="273"
              v-if="permission"
              align="center"
              label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="articleid=scope.row.ID;showEditNote(scope.row.ID)">修改</el-button>
                <el-button @click="delVisible=true;delReq.articleid=scope.row.ID" type="text" size="small">删除</el-button>
                <el-button v-if="scope.row.sticked==0" @click="setTop(scope.row)" type="text" size="small">置顶</el-button>
                <el-button v-if="scope.row.sticked==1" @click="setTop(scope.row)" type="text" size="small">取消置顶</el-button>
                <el-button v-if="scope.row.status==0" @click="releaseInfo=scope.row;releaseVisible=true" type="text" size="small">发布</el-button>
                <el-button v-if="scope.row.status==1" @click="release(scope.row)" type="text" size="small">取消发布</el-button>
                <el-button @click="setTree2=setTree;linkVisiable=true;addLinkReq.articleId=scope.row.ID;resetTree()" type="text" size="small">添加目录</el-button>
              </template>
            </el-table-column>
          </el-table>
          </el-row>
          <!-- 高级查询 -->
          <el-row v-if="tableType===3">
            <div>
              <div class="el-form-item__label">
                <b>查询标题结果：</b>
              </div>
              <el-table
                :data="tableDataTitle">
              <!-- <el-table-column
                align="left"
                type="selection"
                width="30">
              </el-table-column> -->
              <el-table-column
                align="center"
                prop="name"
                width="58">
                <template
                  slot-scope="scope">
                  <div>
                    <span v-if="scope.row.hits&&scope.row.hot" style="color:red;font-size:10px;">Hot</span>
                    <span v-if="scope.row.status==1&&setNew(scope.row)" style="color:#E8D343;font-size:10px;">New</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="title"
                label="标题">
                <template
                  slot-scope="scope">
                  <div style="text-align:left;">
                    <a @click="queryOne(scope.row.ID);">
                        {{scope.row.title}}
                    </a>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                width="80"
                align="center"
                prop="hits"
                label="阅读次数">
              </el-table-column>
              <el-table-column
                width="100"
                align="center"
                prop="creatorRealname"
                label="创建人">
              </el-table-column>
              <el-table-column
                width="100"
                align="center"
                prop="updatorRealname"
                label="修改人">
              </el-table-column>
              <el-table-column
                align="center"
                prop="CreatedAt"
                label="创建时间">
                <template slot-scope="scope">
                  <div>{{formatDateTime(scope.row.CreatedAt)}}</div>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="UpdatedAt"
                label="修改时间">
                <template slot-scope="scope">
                  <div>{{formatDateTime(scope.row.UpdatedAt)}}</div>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="release_time"
                label="发布时间">
                <template slot-scope="scope">
                  <div v-if="scope.row.status==1">{{formatDateTime(scope.row.release_time)}}</div>
                </template>  
              </el-table-column>
              <el-table-column
                width="273"
                v-if="permission"
                align="center"
                label="操作">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="articleid=scope.row.ID;showEditNote(scope.row.ID)">修改</el-button>
                  <el-button @click="delVisible=true;delReq.articleid=scope.row.ID" type="text" size="small">删除</el-button>
                  <el-button v-if="scope.row.sticked==0" @click="setTop(scope.row)" type="text" size="small">置顶</el-button>
                  <el-button v-if="scope.row.sticked==1" @click="setTop(scope.row)" type="text" size="small">取消置顶</el-button>
                  <el-button v-if="scope.row.status==0" @click="releaseInfo=scope.row;releaseVisible=true" type="text" size="small">发布</el-button>
                  <el-button v-if="scope.row.status==1" @click="release(scope.row)" type="text" size="small">取消发布</el-button>
                  <el-button @click="setTree2=setTree;linkVisiable=true;addLinkReq.articleId=scope.row.ID;resetTree()" type="text" size="small">添加目录</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="smallPaging"> 
              <el-pagination
                v-if="titlePageShow"
                background
                @size-change="titleSizeChange"
                @current-change="titleCurrentChange"
                :current-page='titlePageInfo.pageNo'
                :page-sizes="[1, 20, 30, 40, 50]"
                :page-size='titlePageInfo.pageSize'
                layout="total, sizes, prev, pager, next, jumper "
                :total='titlePageInfo.total' style="text-align: right;">
              </el-pagination>
            </div>
          </div>
            <div>
              <div class="el-form-item__label">
                <b>查询内容结果：</b>
              </div>
              <el-table
                :data="tableDataBody">
              <!-- <el-table-column
                align="left"
                type="selection"
                width="30">
              </el-table-column> -->
              <el-table-column
                align="center"
                prop="name"
                width="58">
                <template
                  slot-scope="scope">
                  <div>
                    <span v-if="scope.row.hits&&scope.row.hot" style="color:red;font-size:10px;">Hot</span>
                    <span v-if="scope.row.status==1&&setNew(scope.row)" style="color:#E8D343;font-size:10px;">New</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="title"
                label="标题">
                <template
                  slot-scope="scope">
                  <div style="text-align:left;">
                    <a @click="queryOne(scope.row.ID);">
                        {{scope.row.title}}
                    </a>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                width="80"
                align="center"
                prop="hits"
                label="阅读次数">
              </el-table-column>
              <el-table-column
                width="100"
                align="center"
                prop="creatorRealname"
                label="创建人">
              </el-table-column>
              <el-table-column
                width="100"
                align="center"
                prop="updatorRealname"
                label="修改人">
              </el-table-column>
              <el-table-column
                align="center"
                prop="CreatedAt"
                label="创建时间">
                <template slot-scope="scope">
                  <div>{{formatDateTime(scope.row.CreatedAt)}}</div>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="UpdatedAt"
                label="修改时间">
                <template slot-scope="scope">
                  <div>{{formatDateTime(scope.row.UpdatedAt)}}</div>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="release_time"
                label="发布时间">
                <template slot-scope="scope">
                  <div v-if="scope.row.status==1">{{formatDateTime(scope.row.release_time)}}</div>
                </template>  
              </el-table-column>
              <el-table-column
                width="273"
                v-if="permission"
                align="center"
                label="操作">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="articleid=scope.row.ID;showEditNote(scope.row.ID)">修改</el-button>
                  <el-button @click="delVisible=true;delReq.articleid=scope.row.ID" type="text" size="small">删除</el-button>
                  <el-button v-if="scope.row.sticked==0" @click="setTop(scope.row)" type="text" size="small">置顶</el-button>
                  <el-button v-if="scope.row.sticked==1" @click="setTop(scope.row)" type="text" size="small">取消置顶</el-button>
                  <el-button v-if="scope.row.status==0" @click="releaseInfo=scope.row;releaseVisible=true" type="text" size="small">发布</el-button>
                  <el-button v-if="scope.row.status==1" @click="release(scope.row)" type="text" size="small">取消发布</el-button>
                  <el-button @click="setTree2=setTree;linkVisiable=true;addLinkReq.articleId=scope.row.ID;resetTree()" type="text" size="small">添加目录</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="smallPaging"> 
              <el-pagination
                v-if="bodyPageShow"
                background
                @size-change="bodySizeChange"
                @current-change="bodyCurrentChange"
                :current-page='bodyPageInfo.pageNo'
                :page-sizes="[1, 20, 30, 40, 50]"
                :page-size='bodyPageInfo.pageSize'
                layout="total, sizes, prev, pager, next, jumper "
                :total='bodyPageInfo.total' style="text-align: right;">
              </el-pagination>
            </div>
          </div>
          <div>
            <div class="el-form-item__label">
              <b>查询概要结果：</b>
            </div>
            <el-table
              :data="tableDataBrief">
              <!-- <el-table-column
                align="left"
                type="selection"
                width="30">
              </el-table-column> -->
              <el-table-column
                align="center"
                prop="name"
                width="58">
                <template
                  slot-scope="scope">
                  <div>
                    <span v-if="scope.row.hits&&scope.row.hot" style="color:red;font-size:10px;">Hot</span>
                    <span v-if="scope.row.status==1&&setNew(scope.row)" style="color:#E8D343;font-size:10px;">New</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="title"
                label="标题">
                <template
                  slot-scope="scope">
                  <div style="text-align:left;">
                    <a @click="queryOne(scope.row.ID);">
                        {{scope.row.title}}
                    </a>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                width="80"
                align="center"
                prop="hits"
                label="阅读次数">
              </el-table-column>
              <el-table-column
                width="100"
                align="center"
                prop="creatorRealname"
                label="创建人">
              </el-table-column>
              <el-table-column
                width="100"
                align="center"
                prop="updatorRealname"
                label="修改人">
              </el-table-column>
              <el-table-column
                align="center"
                prop="CreatedAt"
                label="创建时间">
                <template slot-scope="scope">
                  <div>{{formatDateTime(scope.row.CreatedAt)}}</div>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="UpdatedAt"
                label="修改时间">
                <template slot-scope="scope">
                  <div>{{formatDateTime(scope.row.UpdatedAt)}}</div>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="release_time"
                label="发布时间">
                <template slot-scope="scope">
                  <div v-if="scope.row.status==1">{{formatDateTime(scope.row.release_time)}}</div>
                </template>  
              </el-table-column>
              <el-table-column
                width="273"
                v-if="permission"
                align="center"
                label="操作">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="articleid=scope.row.ID;showEditNote(scope.row.ID)">修改</el-button>
                  <el-button @click="delVisible=true;delReq.articleid=scope.row.ID" type="text" size="small">删除</el-button>
                  <el-button v-if="scope.row.sticked==0" @click="setTop(scope.row)" type="text" size="small">置顶</el-button>
                  <el-button v-if="scope.row.sticked==1" @click="setTop(scope.row)" type="text" size="small">取消置顶</el-button>
                  <el-button v-if="scope.row.status==0" @click="releaseInfo=scope.row;releaseVisible=true" type="text" size="small">发布</el-button>
                  <el-button v-if="scope.row.status==1" @click="release(scope.row)" type="text" size="small">取消发布</el-button>
                  <el-button @click="setTree2=setTree;linkVisiable=true;addLinkReq.articleId=scope.row.ID;resetTree()" type="text" size="small">添加目录</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="smallPaging"> 
              <el-pagination
                v-if="briefPageShow"
                background
                @size-change="briefSizeChange"
                @current-change="briefCurrentChange"
                :current-page='briefPageInfo.pageNo'
                :page-sizes="[1, 20, 30, 40, 50]"
                :page-size='briefPageInfo.pageSize'
                layout="total, sizes, prev, pager, next, jumper "
                :total='briefPageInfo.total' style="text-align: right;">
              </el-pagination>
            </div>
          </div>
          <div>
            <div class="el-form-item__label">
              <b>查询备注结果：</b>
            </div>
            <el-table
              :data="tableDataRemark">
              <!-- <el-table-column
                align="left"
                type="selection"
                width="30">
              </el-table-column> -->
              <el-table-column
                align="center"
                prop="name"
                width="58">
                <template
                  slot-scope="scope">
                  <div>
                    <span v-if="scope.row.hits&&scope.row.hot" style="color:red;font-size:10px;">Hot</span>
                    <span v-if="scope.row.status==1&&setNew(scope.row)" style="color:#E8D343;font-size:10px;">New</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="title"
                label="标题">
                <template
                  slot-scope="scope">
                  <div style="text-align:left;">
                    <a @click="queryOne(scope.row.ID);">
                        {{scope.row.title}}
                    </a>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                width="80"
                align="center"
                prop="hits"
                label="阅读次数">
              </el-table-column>
              <el-table-column
                width="100"
                align="center"
                prop="creatorRealname"
                label="创建人">
              </el-table-column>
              <el-table-column
                width="100"
                align="center"
                prop="updatorRealname"
                label="修改人">
              </el-table-column>
              <el-table-column
                align="center"
                prop="CreatedAt"
                label="创建时间">
                <template slot-scope="scope">
                  <div>{{formatDateTime(scope.row.CreatedAt)}}</div>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="UpdatedAt"
                label="修改时间">
                <template slot-scope="scope">
                  <div>{{formatDateTime(scope.row.UpdatedAt)}}</div>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="release_time"
                label="发布时间">
                <template slot-scope="scope">
                  <div v-if="scope.row.status==1">{{formatDateTime(scope.row.release_time)}}</div>
                </template>  
              </el-table-column>
              <el-table-column
                width="273"
                v-if="permission"
                align="center"
                label="操作">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="articleid=scope.row.ID;showEditNote(scope.row.ID)">修改</el-button>
                  <el-button @click="delVisible=true;delReq.articleid=scope.row.ID" type="text" size="small">删除</el-button>
                  <el-button v-if="scope.row.sticked==0" @click="setTop(scope.row)" type="text" size="small">置顶</el-button>
                  <el-button v-if="scope.row.sticked==1" @click="setTop(scope.row)" type="text" size="small">取消置顶</el-button>
                  <el-button v-if="scope.row.status==0" @click="releaseInfo=scope.row;releaseVisible=true" type="text" size="small">发布</el-button>
                  <el-button v-if="scope.row.status==1" @click="release(scope.row)" type="text" size="small">取消发布</el-button>
                  <el-button @click="setTree2=setTree;linkVisiable=true;addLinkReq.articleId=scope.row.ID;resetTree()" type="text" size="small">添加目录</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="smallPaging"> 
              <el-pagination
                v-if="remarkPageShow"
                background
                @size-change="remarkSizeChange"
                @current-change="remarkCurrentChange"
                :current-page='remarkPageInfo.pageNo'
                :page-sizes="[1, 20, 30, 40, 50]"
                :page-size='remarkPageInfo.pageSize'
                layout="total, sizes, prev, pager, next, jumper "
                :total='remarkPageInfo.total' style="text-align: right;">
              </el-pagination>
            </div>
          </div>
        </el-row>
        <el-row style="margin-top:5px;">
          <el-button v-if="permission" type="success" size="small" @click="checkCatalogid();clearUpload('upload');">新建</el-button>
          <!-- <el-button type="danger" size="small" @click="batchDelVisible=true">批量删除</el-button> -->
          <el-pagination
            v-if="nodePageShow"
            background
            @size-change="nodeSizeChange"
            @current-change="nodeCurrentChange"
            :current-page='pageInfo.pageNo'
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size='pageInfo.pageSize'
            layout="total, sizes, prev, pager, next, jumper "
            :total='pageInfo.total' style="text-align: right;float:right;">
          </el-pagination>
          <el-pagination
            v-if="queryPageShow1"
            background
            @size-change="querySizeChange1"
            @current-change="queryCurrentChange1"
            :current-page='pageInfo.pageNo'
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size='pageInfo.pageSize'
            layout="total, sizes, prev, pager, next, jumper "
            :total='pageInfo.total' style="text-align: right;float:right;">
          </el-pagination>
        </el-row>
      </el-main>
      <!-- 新建 -->
      <el-dialog
        top="5vh"
        width="90%"
        :visible.sync="addArticles"
        append-to-body>
        <div style="text-align:center">
          <h3>
            {{noteTitle}}
            <el-tooltip class="item" effect="dark" content="修改标题" placement="right-start">
              <el-button style="font-size:16px;" type="text" icon="el-icon-edit-outline" @click="editNoteTitleVisiable=true;editDetail.title=noteTitle" size="mini" circle></el-button>
            </el-tooltip>
          </h3>
          <!-- <el-row style="text-align:left">
            <el-form :inline="true">
              <el-form-item label="标签:" style="float:left;min-height:41px;">
                <el-tag
                  style="margin-left:10px;"
                  :key="tag"
                  v-for="tag in dynamicTags"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag)">
                  {{tag}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm">
                </el-input>
                <el-button type="success" v-else class="button-new-tag" size="small" @click="showInput">新建标签</el-button>
              </el-form-item>
            </el-form>
          </el-row> -->
          <el-row>
            <el-form>
              <el-form-item label-width="45px" label="概要:">
                <el-input :rows="1" v-model="brief" type="textarea" class="article-textarea" autosize placeholder="请输入内容"/>
              </el-form-item>
            </el-form>
          </el-row>
          <div style="position:relative">
            <quill-editor
            v-model="body"
            ref="myQuillEditor"
            :options="editorOption"
            style="white-space:pre"
            ></quill-editor>
          </div>
          <el-row style="margin-top:1%">
            <el-row style="text-align:left">
              <el-form>
                <el-form-item label-width="45px" label="备注:">
                  <el-input :rows="1" v-model="remark" type="textarea" class="article-textarea" autosize placeholder="请输入内容"/>
                </el-form-item>
                <el-form-item label-width="45px" label="附件:">
                  <el-upload
                    class="kb-upload"
                    ref="upload"
                    :action="updateUrl"
                    :headers="{'Authorization':'Bearer ' +token}"
                    :on-remove="uploadRemove"
                    :before-remove="beforeRemove"
                    :http-request="uploadFile"
                    :auto-upload="false">
                    <el-button slot="trigger" size="small" type="primary">选取附件</el-button>
                    <el-button style="margin-left:10px;" size="small" type="success" @click="submitUpload();">上传</el-button>
                    <div style="font-weight:bold;color:red;" slot="tip" class="el-upload__tip">注：上传附件只能是 xls,xlsx,doc,docx,ppt,pptx,txt,pdf 格式，大小不能超过10MB</div>
                  </el-upload>
                </el-form-item>
              </el-form>
            </el-row>
            <el-row>
              <el-button type="success" @click="generateNote();" size="small" :disabled="uploadDisable">确定</el-button>
              <el-button @click="noteTitle='';addArticles=false;body=null;brief=null;remark=null" size="small">取消</el-button>
            </el-row>
          </el-row>
        </div>
      </el-dialog>
        <!-- 修改 -->
      <el-dialog
        top="5vh"
        width="90%"
        :visible.sync="editArticles"
        append-to-body>
        <div style="text-align:center">
          <h3>{{editDetail.title}}
            <el-tooltip class="item" effect="dark" content="修改标题" placement="right-start">
              <el-button style="font-size:16px;" type="text" icon="el-icon-edit-outline" @click="editNoteTitleVisiable=true" size="mini" circle></el-button>
            </el-tooltip>
          </h3>
          <!-- <el-row style="text-align:left">
            <el-form :inline="true">
              <el-form-item label="标签:" style="float:left;min-height:41px;">
                <el-tag
                  style="margin-left:10px;"
                  :key="tag"
                  v-for="tag in dynamicTags"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag)">
                  {{tag}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm">
                </el-input>
                <el-button type="success" v-else class="button-new-tag" size="small" @click="showInput">新建标签</el-button>
              </el-form-item>
            </el-form>
          </el-row> -->
          <el-row>
            <el-form>
              <el-form-item label-width="45px" label="概要:">
                <el-input :rows="1" v-model="editDetail.brief" type="textarea" class="article-textarea" autosize placeholder="请输入内容"/>
              </el-form-item>
            </el-form>
          </el-row>
          <div style="position:relative">
            <quill-editor
            v-model="editDetail.body"
            ref="myQuillEditor"
            style="white-space:pre"
            :options="editorOption"
            ></quill-editor>
          </div>
          <el-row style="margin-top:1%">
            <el-row style="text-align:left">
              <el-form>
                <el-form-item label-width="45px" label="备注:">
                  <el-input :rows="1" v-model="editDetail.remark" type="textarea" class="article-textarea" autosize placeholder="请输入内容"/>
                </el-form-item>
                <el-form-item label-width="45px" label="附件:">
                  <el-upload
                    class="kb-upload"
                    ref="upload"
                    :action="updateUrl"
                    :headers="{'Authorization':'Bearer ' +token}"
                    :on-remove="uploadRemove"
                    :before-remove="beforeRemove"
                    :http-request="uploadFile"
                    :file-list="fileList"
                    :auto-upload="false">
                    <el-button slot="trigger" size="small" type="primary">选取附件</el-button>
                    <el-button style="margin-left:10px;" size="small" type="success" @click="submitUpload();">上传</el-button>
                    <div style="font-weight:bold;color:red;" slot="tip" class="el-upload__tip">注：上传附件只能是 xls,xlsx,doc,docx,ppt,pptx,txt,pdf 格式，大小不能超过10MB</div>
                  </el-upload>
                </el-form-item>
              </el-form>
            </el-row>
            <el-row>
              <el-button type="success" @click="modifyNote();" size="small" :disabled="uploadDisable">确定</el-button>
              <el-button @click="editDetail.title='';editArticles=false;editDetail.body=null" size="small">取消</el-button>
            </el-row>
          </el-row>
        </div>
      </el-dialog>
      <!-- 详情 -->
      <el-dialog 
        top="5vh"
        width="90%"
        :visible.sync="detailArticles"
        append-to-body>
        <div>
          <h3 style="text-align:center">{{noteDetail.title}}&nbsp;&nbsp;</h3>
          <!-- <el-row style="text-align:left">
            <el-form :inline="true">
              <el-form-item label="标签:" style="float:left;min-height:41px;">
                <el-tag
                  style="margin-left:10px;"
                  :key="tag"
                  v-for="tag in dynamicTags">
                  {{tag}}
                </el-tag>
              </el-form-item>
            </el-form>
          </el-row> -->
          <el-row>
            <el-form :inline="true" style="margin-left:-5px;margin-top:-20px;">
              <el-form-item label="创建人:" label-width="65px">
                <div>{{noteDetail.creatorRealname}}</div>
              </el-form-item>
              <el-form-item label="创建时间:" label-width="75px" style="margin-left:100px;">
                <div>{{formatDateTime(noteDetail.CreatedAt)}}</div>
              </el-form-item>
            </el-form>
          </el-row>
          <el-row>
            <el-form :inline="true" style="margin-left:-5px;margin-top:-20px;">
              <el-form-item label="修改人:" label-width="65px">
                <div>{{noteDetail.updatorRealname}}</div>
              </el-form-item>
              <el-form-item label="修改时间:" label-width="75px" style="margin-left:100px;">
                <div>{{formatDateTime(noteDetail.UpdatedAt)}}</div>
              </el-form-item>
            </el-form>
          </el-row>
          <el-row>
            <el-form>
              <el-form-item style="margin-left:-2px;margin-top:-20px;" label-width="75px" label="所在目录:">
                <div v-for="item in noteDetail.catalogs" :key="item.path">{{item.path_name}}</div>
              </el-form-item>
            </el-form>
          </el-row>
          <el-row>
            <el-form>
              <el-form-item style="margin-top:-20px;" label-width="45px" label="概要:">
                <div>{{noteDetail.brief}}</div>
              </el-form-item>
            </el-form>
          </el-row>
          <div v-html="noteDetail.body" class="note-content div-content" style="word-wrap:auto;">

          </div>
          <el-row>
            <el-form>
              <div style="font-weight:bold;color:red;" class="el-upload__tip">注：txt和pdf格式的文件直接点击为预览，预览页面可以右键另存为下载，也可以右键选择另存为直接下载</div>
              <el-form-item label-width="45px" label="附件:">
                <div v-for="item in DLurl" :key="item.name">
                  <span>{{item.name}}</span><el-button style="font-size:16px;" type="text" icon="el-icon-download" size="mini" circle @click="download(item.url,item.name)"></el-button>
                </div>
              </el-form-item>
              
              <el-form-item label-width="45px" label="备注:">
                <div>{{noteDetail.remark}}</div>
              </el-form-item>
            </el-form>
          </el-row>
          <el-row style="margin-top:1%;text-align:center;">
            <el-button type="primary" @click="noteDetail.title='';detailArticles=false;noteDetail.body=null;">关闭</el-button>
          </el-row>
        </div>
      </el-dialog>
      <!-- 删除 -->
      <el-dialog
          width="30%"
          title="删除"
          :visible.sync="delVisible"
          append-to-body>
          <span style="font-size:20px;">确定删除此内容？</span>
          <div slot="footer" class="dialog-footer" style="text-align: right;">
            <el-button @click="delVisible = false">取 消</el-button>
            <el-button type="primary" @click="delVisible = false;delArticles(delReq);">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 批量删除 -->
        <!-- <el-dialog
          width="30%"
          title="批量删除"
          :visible.sync="batchDelVisible"
          append-to-body>
          <span style="font-size:20px;">确定删除选定内容？</span>
          <div slot="footer" class="dialog-footer" style="text-align: right;">
            <el-button @click="batchDelVisible = false">取 消</el-button>
            <el-button type="primary" @click="batchDelVisible = false;">确 定</el-button>
          </div>
        </el-dialog> -->
        <!-- 新建文章输入标题 -->
        <el-dialog 
          width="30%" 
          title="新建文章" 
          :visible.sync="noteTitleVisiable" 
          append-to-body>
          <span style="color:red">*</span><span style="font-size:15px;">标题：</span>
          <el-input type="text" placeholder="请输入标题" size="medium" v-model="noteTitle" maxlength="45"></el-input>
          <div slot="footer" class="dialog-footer" style="text-align: center;">
            <el-button type="primary" @click="checkTitleIsNullOrNot(noteTitle);">确定</el-button>
            <el-button @click="noteTitle=null;noteTitleVisiable = false">取消</el-button>
          </div>
        </el-dialog>
        <!-- 修改标题 dialog -->
        <el-dialog width="30%" title="修改标题" :visible.sync="editNoteTitleVisiable" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
          <span style="color:red">*</span><span style="font-size:15px;">标题：</span>
            <el-input maxlength="45" type="text" placeholder="请输入标题" size="medium" v-model="editDetail.title" clearable @change="checkEditTitle(editDetail.title);"></el-input>
          <div slot="footer" class="dialog-footer" style="text-align: center;">
          <span style="color:red" v-if="hasNoteTitle===false">标题不能为空</span>
            <el-button type="primary" @click="editNoteTitleVisiable=false;noteTitle=editDetail.title" v-if="hasNoteTitle===true">确定</el-button>
            <el-button @click="editNoteTitleVisiable = false" v-if="hasNoteTitle===true">取消</el-button>
          </div>
        </el-dialog>
        <!-- 发布的newdays -->
        <el-dialog 
          width="30%" 
          title="填写new标签持续时间" 
          :visible.sync="releaseVisible" 
          append-to-body>
          <span style="color:red">*</span><span style="font-size:15px;">天数：</span>
          <el-input type="text" placeholder="请输入天数" size="medium" v-model="newdays"></el-input>
          <div slot="footer" class="dialog-footer" style="text-align: center;">
            <el-button type="primary" @click="release(releaseInfo,newdays)">确定</el-button>
            <el-button @click="newdays=null;noteTitle=null;releaseVisible = false">取消</el-button>
          </div>
        </el-dialog>
        <!-- 文章添加链接节点 -->
        <el-dialog
          top="5vh" 
          width="30%" 
          title="添加文章链接目录" 
          :visible.sync="linkVisiable" 
          append-to-body>
          <div>
            <el-tree class="expand-tree"
              key="tree2"
              ref="tree2"
              v-if="isLoadingTree"
              :data="setTree"
              highlight-current
              multiple
              :props="defaultProps"
              :expand-on-click-node="false"
              :render-content="renderContent"
              @node-click="choseLink"
              node-key="ID"
              :default-expanded-keys="[]"></el-tree>
          </div>
          <div slot="footer" class="dialog-footer" style="text-align: center;">
            <el-button type="primary" @click="addArticlesLink(addLinkReq);">确定</el-button>
            <el-button @click="linkVisiable = false">取消</el-button>
          </div>
        </el-dialog>
    </el-container>
    </el-col>
    
  </el-container>
</template>

<script>
import { MessageBox } from 'element-ui'
import TreeRender from '@/components/tree/tree_kb.vue'
import {
  getPermission,
  getCatalogs,
  addCatalogs,
  delCatalogs,
  editCatalogs,
  getArticlesDetail,
  addArticles,
  getArticlesById, // 查询目录下的文章
  getArticles1, // 普通查询
  editArticles,
  delArticles,
  addArticlesLink,
  getUploadInfo,
  delUpload
} from '@/api/kb'
import {
  clone,
  formatDateTime,
  verify
} from '@/utils/tools'
export default{
  name: 'kb',
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
      // dynamicTags: ['标签一', '标签二', '标签三'],
      // inputVisible: false,
      // inputValue: '',
      nodePageShow: false, // 节点分页显示隐藏
      queryPageShow1: false,
      bodyPageShow: false,
      titlePageShow: false,
      briefPageShow: false,
      remarkPageShow: false,
      pageInfo: {},
      titlePageInfo: {},
      bodyPageInfo: {},
      briefPageInfo: {},
      remarkPageInfo: {},
      isListPage: '1', // 是否是主页
      searchType: '0',
      addArticles: false,
      editArticles: false,
      detailArticles: false,
      // uploadVisible: false,
      addVisible: false,
      delVisible: false,
      // batchDelVisible: false,
      noteTitleVisiable: false, // 新建笔记模态框显示隐藏
      editNoteTitleVisiable: false, // 修改笔记模态框显示隐藏
      linkVisiable: false,
      releaseVisible: false,
      timeValue: null,
      noteTitle: '', // 新建标题
      brief: '',
      remark: '',
      hasNoteTitle: true, // 判断是否有标题
      newdays: 0,
      releaseInfo: {},
      body: '',
      req: {
        title: null,
        pageNo: 1,
        pageSize: 10
      },
      req2: {
        title: null,
        pageNo: 1,
        pageSize: 10
      },
      nodeReq: {
        pageNo: 1,
        pageSize: 10
      },
      searchReq: {
        query: '',
        title: {
          pageNo: 1,
          pageSize: 10
        },
        body: {
          pageNo: 1,
          pageSize: 10
        },
        brief: {
          pageNo: 1,
          pageSize: 10
        },
        remark: {
          pageNo: 1,
          pageSize: 10
        }
      },
      searchReq2: {
        query: '',
        title: {
          pageNo: 1,
          pageSize: 10
        },
        body: {
          pageNo: 1,
          pageSize: 10
        },
        brief: {
          pageNo: 1,
          pageSize: 10
        },
        remark: {
          pageNo: 1,
          pageSize: 10
        }
      },
      delReq: {
        catalogid: '',
        articleid: ''
      },
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
      note_item: { // 新建参数
        title: '',
        body: '',
        brief: '',
        remark: '',
        updatorid: null,
        updatorRealname: '',
        creatorid: null,
        creatorRealname: '',
        attachments: []
      },
      noteDetail: { // 详情
        title: '',
        body: '',
        brief: '',
        remark: ''
      },
      editDetail: { // 修改详情
        title: '',
        body: '',
        brief: '',
        remark: '',
        updatorid: null,
        updatorRealname: '',
        attachments: []
      },
      tableData: [],
      tableDataTitle: [],
      tableDataBody: [],
      tableDataBrief: [],
      tableDataRemark: [],
      tableType: null, // 1 按节点查询   2 普通查询   3 高级查询
      addLinkId: null,
      addLinkReq: {
        catalogId: null,
        articleId: null
      },
      uploadInfoReq: {
        bucketName: 'crm',
        objectName: ''
      },
      delUploadReq: {
        bucketName: 'crm',
        objectName: null
      },
      updateUrl: '',
      DLurl: [],
      uploadCount: 0,
      uploadSuccessCount: 0,
      fileList: [],
      uploadDisable: false
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
        console.log(error)
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
      // consolle.log(d,n)
      this.catalogid = d.ID
      // if (d.isEdit === true) {
      //   d.isEdit = false // 放弃编辑状态
      //   this.$set(d, 'isEdit', false)
      //   return false
      // }
      // 展开节点
      if (!n.expanded) {
        n.expanded = true
      } else if (n.expanded) {
        n.expanded = false
      }
      // 查询文章列表
      getArticlesById(d.ID, this.nodeReq).then(response => {
        this.tableData = response.data.result
        this.pageInfo = response.data.pageInfo
        this.setHot(this.tableData, 5)
        this.nodePageShow = true
        this.queryPageShow1 = false
        this.tableType = 1
      }).catch(error => {
        this.$message({
          message: '获取文章列表失败',
          type: 'error'
        })
        console.log(error)
      })
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
    // 新建top节点
    handleAddTop() {
      let a = 0
      for (let i = 0; i < this.setTree.length; i++) {
        if (this.setTree[i].isEdit) {
          a = a + 1
          this.setTree.splice(i, 1)
        }
      }
      if (!a) {
        this.setTree.push({
          ID: ++this.maxexpandId,
          name: '',
          parentid: 0,
          isEdit: true,
          children: []
        })
        this.editCancel = false
      }
    },
    // 新建子节点
    handleAdd(s, d, n) {
      let a = 0
      const parentid = n.data.ID
      this.editCancel = false
      // 增加节点
      // if (n.level >= 6) {
      //   this.$message.error('最多只支持五级！')
      //   return false
      // }
      if (d.children) {
        for (let i = 0; i < d.children.length; i++) {
          if (d.children[i].isEdit) {
            a = a + 1
            d.children.splice(i, 1)
          }
        }
        if (!a) {
          if (d.children === null) {
            d.children = []
          }
          // 新建数据
          d.children.push({
            ID: ++this.maxexpandId,
            name: '',
            parentid: parentid,
            isEdit: true,
            children: []
          })
          // 展开节点
          if (!n.expanded) {
            n.expanded = true
          }
        }
      }
    },
    // 新建节点
    addCatalogs(s, d, n) {
      if (n.data.name) {
        addCatalogs({ 'name': n.data.name, parentid: d.parentid }).then(response => {
          n.parent.childNodes = response.data
          this.getCatalogs()
          // 展开节点
          this.expandedItem = []
          this.expandedItem.push(d.parentid)
        }).catch(error => {
          this.$message({
            message: '新建节点失败，请重新操作',
            type: 'error'
          })
          this.getCatalogs()
          console.log(error)
        })
      } else {
        this.$message.error('请输入节点名')
      }
      this.$set(n, 'expanded', true)
    },
    handleEdit(s, d, n) { // 编辑节点
      this.editCancel = true
    },
    // 提交编辑
    submitEdit(s, d, n) {
      editCatalogs(d.ID, { 'name': d.name }).then(response => {
        console.log(response.data)
        this.getCatalogs()
        // 展开节点
        this.expandedItem = []
        this.expandedItem.push(d.parentid)
      })
    },
    handleDelete(s, d, n) {
      // 删除节点
      const that = this
      // 有子级不删除
      if (d.children && d.children.length !== 0) {
        this.$message.error('此节点有子级，不可删除！')
        return false
      } else {
        // 新建节点直接删除，否则要询问是否删除
        const delNode = () => {
          let list = n.parent.data.children || n.parent.data // 节点同级数据
          let _index = 99999 // 要删除的index
          if (!n.parent.data.children) { // 删除顶级节点，无children
            list = n.parent.data
          }
          list.map((c, i) => {
            if (d.ID === c.ID) {
              _index = i
            }
          })
          list.splice(_index, 1)
          delCatalogs(d).then(response => {
            console.log('删除成功')
            this.getCatalogs()
            // 展开节点
            this.expandedItem = []
            this.expandedItem.push(d.parentid)
            console.log(this.expandedItem)
          }).catch(error => {
            if (error.response.data === "catalog has article, can't delete" && error.response.status === 405) {
              this.$message({
                message: '删除节点失败，节点内有文章',
                type: 'error'
              })
              this.getCatalogs()
              console.log(error)
            } else {
              this.$message({
                message: '删除节点失败，请重新操作',
                type: 'error'
              })
              this.getCatalogs()
              console.log(error)
            }
          })
        }
        const isDel = () => {
          that
            .$confirm('是否删除此节点？', '提示', {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning'
            })
            .then(() => {
              delNode()
            })
            .catch(() => {
              return false
            })
        }
        // 判断是否新建
        d.ID > this.non_maxexpandId ? delNode() : isDel()
      }
    },
    handleCancel(s, d, n) {
      // 删除节点
      const list = n.parent.data.children || n.parent.data // 节点同级数据
      let _index = 99999 // 要删除的index
      list.map((c, i) => {
        if (d.ID === c.ID) {
          _index = i
        }
      })
      list.splice(_index, 1)
    },
    // 拖拽结束时
    handleDragEnd(n1, n2, e) {
      if (e === 'inner') {
        editCatalogs(n1.data.ID, { 'parentid': n2.data.ID }).then(response => {
          this.getCatalogs()
          // 展开节点
          this.expandedItem = []
          this.expandedItem.push(n2.data.ID)
        })
      }
    },
    // 上传---------------------
    uploadFile(uploadInfo) {
      if (!this.beforeUpload(uploadInfo.file)) {
        return false
      }
      const vm = this
      let date = new Date()
      let uploadInfoReq2 = {}
      vm.uploadDisable = true
      date = formatDateTime(date).split(' ')[0]
      vm.uploadInfoReq.objectName = localStorage.getItem('agentId') + '/' + date + '/' + uploadInfo.file.name
      uploadInfoReq2 = clone(this.uploadInfoReq)
      getUploadInfo(uploadInfoReq2).then(response => {
        if (response.data.presignedPutUrl) {
          const xhr = new XMLHttpRequest()
          xhr.open('PUT', response.data.presignedPutUrl, true)
          xhr.send(uploadInfo.file)
          xhr.onload = () => {
            if (xhr.status === 200) {
              if (!vm.note_item.attachments) {
                vm.note_item.attachments = []
              }
              if (!vm.editDetail.attachments) {
                vm.editDetail.attachments = []
              }
              if (!vm.DLurl) {
                vm.DLurl = []
              }
              vm.$notify({
                message: uploadInfo.file.name + '上传成功!',
                type: 'success'
              })
              vm.uploadSuccessCount++
              vm.uploadDisable = false
              vm.note_item.attachments.push({
                'file_path': localStorage.getItem('agentId') + '/' + date + '/' + uploadInfo.file.name,
                'created_by': localStorage.getItem('agentId')
              })
              vm.editDetail.attachments.push({
                'file_path': localStorage.getItem('agentId') + '/' + date + '/' + uploadInfo.file.name,
                'created_by': localStorage.getItem('agentId'),
                'ArticleId': this.articleid
              })
              vm.DLurl.push({ 'name': uploadInfo.file.name, 'url': `${process.env.FS_SERVER_HOST}/crm/${localStorage.getItem('agentId') + '/' + date + '/' + uploadInfo.file.name}` })
            }
          }
        } else {
          vm.$notify({
            message: '服务器上存在与' + uploadInfo.file.name + '相同名字的文件，请删除或重命名后重新上传',
            type: 'error'
          })
          vm.uploadSuccessCount++
          // vm.clearUpload('upload')
        }
      })
    },
    beforeRemove(file, fileList) {
      let date = new Date()
      date = formatDateTime(date).split(' ')[0]
      this.delUploadReq.objectName = localStorage.getItem('agentId') + '/' + date + '/' + file.name
      return MessageBox.confirm(`确定移除 ${file.name}？`, '确定注销', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除附件
        delUpload(this.delUploadReq).then(response => {
          if (response.data.flag) {
            this.$message({
              message: '删除附件成功',
              type: 'success'
            })
            for (let i = 0; i < this.note_item.attachments.length; i++) {
              if (this.note_item.attachments[i].file_path.indexOf(file.name) >= 0) {
                this.note_item.attachments.splice(i, 1)
              }
            }
            for (let i = 0; i < this.editDetail.attachments.length; i++) {
              if (this.editDetail.attachments[i].file_path.indexOf(file.name) >= 0) {
                this.editDetail.attachments.splice(i, 1)
              }
            }
            for (let i = 0; i < fileList.length; i++) {
              if (fileList[i].name.indexOf(file.name) >= 0) {
                fileList.splice(i, 1)
              }
            }
          } else {
            this.$message({
              message: response.data.message,
              type: 'error'
            })
            if (response.data.message === '文件对象不存在, 请检查文件名') {
              for (let i = 0; i < fileList.length; i++) {
                if (fileList[i].name.indexOf(file.name) >= 0) {
                  fileList.splice(i, 1)
                }
              }
              for (let i = 0; i < this.editDetail.attachments.length; i++) {
                if (this.editDetail.attachments[i].file_path.indexOf(file.name) >= 0) {
                  this.editDetail.attachments.splice(i, 1)
                }
              }
            }
          }
        }).catch(() => {
          throw new Error('reject')
        })
        throw new Error('reject')
      }).catch(() => {
        throw new Error('reject')
      })
    },
    uploadRemove(file, fileList) {
      for (let i = 0; i < this.note_item.attachments.length; i++) {
        if (this.note_item.attachments[i].file_path.indexOf(file.name) >= 0) {
          this.note_item.attachments.splice(i, 1)
        }
      }
      for (let i = 0; i < this.editDetail.attachments.length; i++) {
        if (this.editDetail.attachments[i].file_path.indexOf(file.name) >= 0) {
          this.editDetail.attachments.splice(i, 1)
        }
      }
    },
    // 验证上传文件的格式及大小
    beforeUpload(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      this.uploadCount++
      this.file = file
      const extension = testmsg.toLowerCase() === 'xls'
      const extension2 = testmsg.toLowerCase() === 'xlsx'
      const extension3 = testmsg.toLowerCase() === 'doc'
      const extension4 = testmsg.toLowerCase() === 'docx'
      const extension5 = testmsg.toLowerCase() === 'txt'
      const extension6 = testmsg.toLowerCase() === 'pdf'
      const extension7 = testmsg.toLowerCase() === 'ppt'
      const extension8 = testmsg.toLowerCase() === 'pptx'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!extension && !extension2 && !extension3 && !extension4 && !extension5 && !extension6 && !extension7 && !extension8) {
        this.$message({
          message: '上传附件只能是xls,xlsx,doc,docx,ppt,pptx,txt,pdf格式!',
          type: 'warning'
        })
      }
      if (!isLt2M) {
        this.$message({
          message: '上传文件大小不能超过 10MB!',
          type: 'warning'
        })
      }
      return (extension || extension2 || extension3 || extension4 || extension5 || extension6 || extension7 || extension8) && isLt2M
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    // 清空上传列表
    clearUpload(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].clearFiles()
      }
    },
    download(url, name) {
      window.open(url)
    },
    // -------------------------
    clone: clone,
    formatDateTime: formatDateTime,
    searchTypeChange(label) {
      this.reset()
      if (label === '0') {
        this.req.pageNo = 1
        this.getArticles1(this.req)
        this.req2 = clone(this.req)
      } else {
        this.tableDataTitle = []
        this.tableDataBody = []
        this.tableDataBrief = []
        this.tableDataRemark = []
        this.bodyPageShow = false
        this.titlePageShow = false
        this.briefPageShow = false
        this.remarkPageShow = false
        this.tableType = 3
        this.queryPageShow1 = false
        this.nodePageShow = false
      }
    },
    reset() {
      this.timeValue = null
      if (this.pageInfo.pageNo) {
        this.req = {
          title: '',
          pageNo: this.pageInfo.pageNo,
          pageSize: this.pageInfo.pageSize
        }
        this.searchReq = {
          query: '',
          title: {
            pageNo: this.pageInfo.pageNo,
            pageSize: this.pageInfo.pageSize
          },
          body: {
            pageNo: this.pageInfo.pageNo,
            pageSize: this.pageInfo.pageSize
          },
          brief: {
            pageNo: this.pageInfo.pageNo,
            pageSize: this.pageInfo.pageSize
          },
          remark: {
            pageNo: this.pageInfo.pageNo,
            pageSize: this.pageInfo.pageSize
          }
        }
      } else {
        this.req = {
          title: '',
          pageNo: 1,
          pageSize: 10
        }
        this.searchReq = {
          query: '',
          title: {
            pageNo: 1,
            pageSize: 10
          },
          body: {
            pageNo: 1,
            pageSize: 10
          },
          brief: {
            pageNo: 1,
            pageSize: 10
          },
          remark: {
            pageNo: 1,
            pageSize: 10
          }
        }
      }

      this.req2 = {
        title: '',
        pageNo: 1,
        pageSize: 10
      }

      this.searchReq2 = {
        query: '',
        pageNo: 1,
        pageSize: 10
      }
    },
    // 新建文章验证catalogid
    checkCatalogid() {
      if (!this.catalogid) {
        this.$message.error('请先选择新建文章的目录')
        return false
      } else {
        this.noteTitle = ''
        this.noteTitleVisiable = true
      }
    },
    // 节点ID查询文章
    getArticlesById(catalogid, obj) {
      getArticlesById(catalogid, obj).then(response => {
        this.tableData = response.data.result
        this.pageInfo = response.data.pageInfo
        this.setHot(this.tableData, 5)
        this.nodePageShow = true
        this.queryPageShow1 = false
        this.tableType = 1
      })
    },
    // 获取文章路径
    // getPath(row) {
    //   console.log(row.catalogs)
    //   for (let i = 0; i < row.catalogs.length; i++) {
    //     const path = row.catalogs[i].path.split('/')
    //     console.log(path)
    //   }
    //   return row.title
    // },
    // 查询
    getArticles1(req) {
      if (this.searchType === '0') {
        if (this.timeValue) {
        // lower 开始时间
        // upper 结束时间
          req.lower = this.timeValue[0].getTime()
          req.upper = this.timeValue[1].getTime()
        } else {
          req.lower = null
          req.upper = null
        }
        if (!req.title) {
          delete req.title
        }
        if (!this.permission) {
          this.req.status = 1
        } else if (this.permission) {
          delete req.status
        }
        getArticles1(req).then(response => {
          this.tableData = response.data.result
          this.pageInfo = response.data.pageInfo
          this.setHot(this.tableData, 5)
          this.queryPageShow1 = true
          this.nodePageShow = false
          this.tableType = 2
        }).catch(error => {
          this.$message({
            message: '查询文章失败',
            type: 'error'
          })
          console.log(error)
        })
      } else {
        if (!req.query) {
          this.$message({
            message: '请输入关键字，再进行查询',
            type: 'error'
          })
          return false
        }
        const titleReq = req.title
        const bodyReq = req.body
        const briefReq = req.brief
        const remarkReq = req.remark
        titleReq.title = req.query
        bodyReq.body = req.query
        briefReq.brief = req.query
        remarkReq.remark = req.query
        if (!this.permission) {
          titleReq.status = 1
          bodyReq.status = 1
          briefReq.status = 1
          remarkReq.status = 1
        } else if (this.permission) {
          delete titleReq.status
          delete bodyReq.status
          delete briefReq.status
          delete remarkReq.status
        }
        getArticles1(titleReq).then(response => {
          this.tableDataTitle = response.data.result
          this.titlePageInfo = response.data.pageInfo
          this.titlePageShow = true
        }).catch(error => {
          this.$message({
            message: '按标题查询文章失败',
            type: 'error'
          })
          this.titlePageShow = true
          throw new Error(error)
        })
        getArticles1(bodyReq).then(response => {
          this.tableDataBody = response.data.result
          this.bodyPageInfo = response.data.pageInfo
          this.bodyPageShow = true
        }).catch(error => {
          this.$message({
            message: '按标题查询文章失败',
            type: 'error'
          })
          this.bodyPageShow = true
          throw new Error(error)
        })
        getArticles1(briefReq).then(response => {
          this.tableDataBrief = response.data.result
          this.briefPageInfo = response.data.pageInfo
          this.briefPageShow = true
        }).catch(error => {
          this.$message({
            message: '按标题查询文章失败',
            type: 'error'
          })
          this.briefPageShow = true
          throw new Error(error)
        })
        getArticles1(remarkReq).then(response => {
          this.tableDataRemark = response.data.result
          this.remarkPageInfo = response.data.pageInfo
          this.remarkPageShow = true
        }).catch(error => {
          this.$message({
            message: '按标题查询文章失败',
            type: 'error'
          })
          this.remarkPageShow = true
          throw new Error(error)
        })
      }
    },
    // // 高级查询
    // getArticles2(searchReq) {
    //   if (this.timeValue) {
    //     // dateLower 开始时间
    //     // dateUpper 结束时间
    //     searchReq.dateLower = this.timeValue[0].getTime()
    //     searchReq.dateUpper = this.timeValue[1].getTime()
    //   } else {
    //     searchReq.dateLower = null
    //     searchReq.dateUpper = null
    //   }
    //   getArticles2(searchReq).then(response => {
    //     this.tableData = response.data.result
    //     this.pageInfo = response.data.pageInfo
    //     this.setHot(this.tableData, 5)
    //     this.queryPageShow1 = false
    //     this.nodePageShow = false
    //     this.tableType = 3
    //   }).catch(error => {
    //     this.$message({
    //       message: '查询文章失败',
    //       type: 'error'
    //     })
    //     console.log(error)
    //   })
    // },
    // 判断标题是否为空
    checkTitleIsNullOrNot(noteTitle) {
      if (noteTitle === '') {
        this.$message.error('请输入标题！')
        this.noteTitleVisiable = true
        return
      } else {
        this.addArticles = true
        this.noteTitleVisiable = false
      }
    },
    // 打开修改页面
    showEditNote(articleid) {
      this.editArticles = true
      getArticlesDetail(articleid)
        .then(response => {
          if (response.data) {
            this.fileList.length = 0
            if (response.data.attachments) {
              if (response.data.attachments.length) {
                for (let i = 0; i < response.data.attachments.length; i++) {
                  const file = response.data.attachments[i].file_path.split('/')
                  this.fileList.push({ 'name': file[file.length - 1] })
                }
              }
            } else {
              this.fileList = []
            }
            this.editDetail.title = response.data.title
            this.editDetail.body = response.data.body
            this.editDetail.remark = response.data.remark
            this.editDetail.brief = response.data.brief
            if (this.editDetail.attachments) {
              this.editDetail.attachments = response.data.attachments
            } else {
              this.editDetail.attachments = []
            }
            this.editArticles = true
          } else {
            this.$message.error('服务器或网络出错！请稍后重试')
          }
        }).catch(error => {
          this.editDetail.title = '服务器或网络出错！请稍后重试'
          this.editDetail.body = '服务器或网络出错！请稍后重试'
          this.editDetail.remark = '服务器或网络出错！请稍后重试'
          this.editDetail.brief = '服务器或网络出错！请稍后重试'
          this.fileList = []
          throw new Error(error)
        })
    },
    // 提交修改
    modifyNote() {
      var temp_content = this.editDetail.body
      temp_content = verify(temp_content, '<p>')
      temp_content = verify(temp_content, '</p>')
      temp_content = verify(temp_content, '<br>')
      if (temp_content === '' || temp_content === null || temp_content.split(' ').join('').length === 0) {
        this.$message.error('内容不能为空！')
        return
      } else {
        this.editDetail.updatorid = parseInt(localStorage.getItem('agentId'))
        this.editDetail.updatorRealname = localStorage.getItem('agentName')
        editArticles(this.articleid, this.editDetail)
          .then(response => {
            this.$message.success('修改文章成功')
            this.editDetail.body = ''
            this.editDetail.title = ''
            this.editDetail.brief = ''
            this.editDetail.remark = ''
            this.editDetail.updatorid = null
            this.editDetail.updatorRealname = ''
            if (this.tableType === 1) {
              this.getArticlesById(this.catalogid, this.nodeReq)
            } else if (this.searchType === '0') {
              this.getArticles1(this.req2)
            } else if (this.searchType === '1') {
              this.getArticles1(this.searchReq2)
            }
            if (this.editDetail.attachments) {
              this.editDetail.attachments.length = 0
            }
            this.editArticles = false
          })
          .catch(error => {
            this.$message({
              message: '修改文章失败',
              type: 'error'
            })
            if (this.editDetail.attachments) {
              this.editDetail.attachments.length = 0
            }
            console.log(error)
          })
      }
    },
    // 删除文章
    delArticles(delReq) {
      if (this.catalogid) {
        delReq.catalogid = this.catalogid
        delArticles(delReq).then(response => {
          if (this.tableType === 1) {
            this.getArticlesById(this.catalogid, this.nodeReq)
          } else if (this.searchType === '0') {
            this.getArticles1(this.req2)
          } else if (this.searchType === '1') {
            this.getArticles1(this.searchReq2)
          }
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }).catch(error => {
          this.$message({
            message: '删除失败',
            type: 'error'
          })
          console.log(error)
        })
      } else {
        this.$message.error('请选择需要删除文章的目录')
      }
    },
    // 判断修改标题是否为空
    checkEditTitle(noteTitle) {
      if (noteTitle === '' || noteTitle.split(' ').join('').length === 0) {
        this.hasNoteTitle = false
      } else {
        this.hasNoteTitle = true
      }
    },
    // 提交新建
    generateNote() {
      var temp_content = this.body
      temp_content = verify(temp_content, '<p>')
      temp_content = verify(temp_content, '</p>')
      temp_content = verify(temp_content, '<br>')
      if (temp_content === '' || temp_content === null || temp_content.split(' ').join('').length === 0) {
        this.$message.error('内容不能为空！')
        return
      } else {
        this.note_item.title = this.noteTitle
        this.note_item.body = this.body
        this.note_item.brief = this.brief
        this.note_item.remark = this.remark
        this.note_item.creatorid = parseInt(localStorage.getItem('agentId'))
        this.note_item.creatorRealname = localStorage.getItem('agentName')
        this.note_item.updatorid = parseInt(localStorage.getItem('agentId'))
        this.note_item.updatorRealname = localStorage.getItem('agentName')
        addArticles(this.catalogid, this.note_item)
          .then(response => {
            this.$message.success('新建文章成功')
            this.noteTitle = ''
            this.body = ''
            this.brief = ''
            this.remark = ''
            this.note_item.body = ''
            this.note_item.title = ''
            this.note_item.brief = ''
            this.note_item.remark = ''
            this.note_item.creatorid = null
            this.note_item.creatorRealname = ''
            this.note_item.updatorid = null
            this.note_item.updatorRealname = ''
            this.body = null
            this.noteTitle = ''
            if (this.tableType === 1) {
              this.getArticlesById(this.catalogid, this.nodeReq)
            } else if (this.searchType === '0') {
              this.getArticles1(this.req2)
            } else if (this.searchType === '1') {
              this.getArticles1(this.searchReq2)
            }
            if (this.note_item.attachments) {
              this.note_item.attachments.length = 0
            }
            this.addArticles = false
          })
          .catch(error => {
            this.$message({
              message: '新建文章失败',
              type: 'error'
            })
            if (this.note_item.attachments) {
              this.note_item.attachments.length = 0
            }
            this.getArticlesById(this.catalogid, this.nodeReq)
            console.log(error)
          })
      }
    },
    // 详情
    queryOne(id) {
      this.detailArticles = true
      getArticlesDetail(id)
        .then(response => {
          // if (response.data.code === 200) {
          if (response.data) {
            this.DLurl.length = 0
            if (response.data.attachments) {
              if (response.data.attachments.length) {
                for (let i = 0; i < response.data.attachments.length; i++) {
                  const url = `${process.env.FS_SERVER_HOST}/crm/${response.data.attachments[i].file_path}`
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
            if (this.tableType === 1) {
              this.getArticlesById(this.catalogid, this.nodeReq)
            } else if (this.searchType === '0') {
              this.getArticles1(this.req2)
            } else if (this.searchType === '1') {
              this.getArticles1(this.searchReq2)
            }
          } else {
            this.$message.error('服务器或网络出错！请稍后重试')
          }
        }).catch(error => {
          this.noteDetail.title = '服务器或网络出错！请稍后重试'
          this.noteDetail.body = '服务器或网络出错！请稍后重试'
          this.noteDetail.brief = '服务器或网络出错！请稍后重试'
          this.noteDetail.remark = '服务器或网络出错！请稍后重试'
          this.DLurl = []
          throw new Error(error)
        })
    },
    // 置顶
    setTop(row) {
      let req = {}
      if (row.sticked === 1) {
        req = { 'sticked': 0 }
      } else {
        req = { 'sticked': 1 }
      }
      editArticles(row.ID, req).then(response => {
        if (this.tableType === 1) {
          this.getArticlesById(this.catalogid, this.nodeReq)
        } else if (this.searchType === '0') {
          this.getArticles1(this.req2)
        } else if (this.searchType === '1') {
          this.getArticles1(this.searchReq2)
        }
      })
    },
    // new标签
    setNew(row) {
      if (row.status) {
        const endTime = new Date(row.release_time)// 发布时间
        const startTime = new Date(row.CreatedAt) // 创建时间
        const NEWDAYS = endTime - startTime
        return (NEWDAYS / 1000 / 60 / 60 / 24).toFixed(2) < row.newdays
      }
    },
    // 发布
    release(row, newdays) {
      let req = {}
      if (row.status === 1) {
        req = { 'status': 0, 'newdays': 0 }
      } else {
        req = { 'status': 1, 'newdays': parseInt(newdays) }
        if (!/^\d+$/.test(newdays)) {
          this.$message({
            message: '请输入整数',
            type: 'error'
          })
          this.newdays = null
          return false
        } else if (!newdays) {
          this.$message({
            message: '请输入天数',
            type: 'error'
          })
          return false
        } else if (newdays === '0') {
          this.$message({
            message: '输入天数必须大于一天',
            type: 'error'
          })
          this.newdays = null
          return false
        }
      }
      this.releaseVisible = false
      editArticles(row.ID, req).then(response => {
        if (this.tableType === 1) {
          this.getArticlesById(this.catalogid, this.nodeReq)
        } else if (this.searchType === '0') {
          this.getArticles1(this.req2)
        } else if (this.searchType === '1') {
          this.getArticles1(this.searchReq2)
        }
        this.newdays = null
      })
    },
    // 获取点击数前五的文章添加hot标签
    achieveMax(tableData, len) {
      const arr = []
      const maxArr = []
      for (let j = 0; j < tableData.length; j++) {
        arr.push(tableData[j].hits)
      }
      arr.sort(function(a, b) {
        return a - b
      })
      for (let i = 0; i < arr.length; i++) {
        const arrPop = arr.pop()
        if (maxArr.length < len && maxArr.indexOf(arrPop) === -1) {
          maxArr.push(arrPop)
        }
      }
      return maxArr.reverse()
    },
    setHot(tableData, len) {
      const arr = this.achieveMax(tableData, len)
      for (let i = 0; i < tableData.length; i++) {
        for (let j = 0; j < arr.length; j++) {
          if (this.tableData[i].hits !== 0 && this.tableData[i].hits === arr[j]) {
            this.tableData[i].hot = true
          }
        }
      }
    },
    // 节点页面显示条数
    nodeSizeChange(val) {
      this.nodeReq.pageSize = val
      this.nodeReq.pageNo = 1
      this.pageInfo.pageNo = 1
      this.getArticlesById(this.catalogid, this.nodeReq)
    },
    // 节点分页翻页功能
    nodeCurrentChange(val) {
      this.nodeReq.pageNo = val
      this.getArticlesById(this.catalogid, this.nodeReq)
    },
    // 普通查询页面显示条数
    querySizeChange1(val) {
      this.req.pageSize = val
      this.req2.pageSize = val
      this.req2.pageNo = 1
      this.pageInfo.pageNo = 1
      this.getArticles1(this.req2)
    },
    // 普通查询分页翻页功能
    queryCurrentChange1(val) {
      this.req2.pageNo = val
      this.getArticles1(this.req2)
    },
    // 高级查询页面显示条数
    titleSizeChange(val) {
      const titleReq = this.searchReq2.title
      titleReq.title = this.searchReq2.query
      titleReq.pageSize = val
      titleReq.pageNo = 1
      this.titlePageInfo.pageNo = 1
      getArticles1(titleReq).then(response => {
        this.tableDataTitle = response.data.result
        this.titlePageInfo = response.data.pageInfo
      }).catch(error => {
        this.$message({
          message: '按标题查询文章失败',
          type: 'error'
        })
        this.titlePageShow = true
        throw new Error(error)
      })
    },
    bodySizeChange(val) {
      const bodyReq = this.searchReq2.body
      bodyReq.body = this.searchReq2.query
      bodyReq.pageSize = val
      bodyReq.pageNo = 1
      this.bodyPageInfo.pageNo = 1
      getArticles1(bodyReq).then(response => {
        this.tableDataBody = response.data.result
        this.bodyPageInfo = response.data.pageInfo
      }).catch(error => {
        this.$message({
          message: '按内容查询文章失败',
          type: 'error'
        })
        this.bodyPageShow = true
        throw new Error(error)
      })
    },
    briefSizeChange(val) {
      const briefReq = this.searchReq2.brief
      briefReq.brief = this.searchReq2.query
      briefReq.pageSize = val
      briefReq.pageNo = 1
      this.briefPageInfo.pageNo = 1
      getArticles1(briefReq).then(response => {
        this.tableDataBrief = response.data.result
        this.briefPageInfo = response.data.pageInfo
      }).catch(error => {
        this.$message({
          message: '按内容查询文章失败',
          type: 'error'
        })
        this.briefPageShow = true
        throw new Error(error)
      })
    },
    remarkSizeChange(val) {
      const remarkReq = this.searchReq2.remark
      remarkReq.remark = this.searchReq2.query
      remarkReq.pageSize = val
      remarkReq.pageNo = 1
      this.remarkPageInfo.pageNo = 1
      getArticles1(remarkReq).then(response => {
        this.tableDataRemark = response.data.result
        this.remarkPageInfo = response.data.pageInfo
      }).catch(error => {
        this.$message({
          message: '按内容查询文章失败',
          type: 'error'
        })
        this.remarkPageShow = true
        throw new Error(error)
      })
    },
    // 高级查询分页翻页功能
    titleCurrentChange(val) {
      const titleReq = this.searchReq2.title
      titleReq.title = this.searchReq2.query
      titleReq.pageNo = val
      getArticles1(titleReq).then(response => {
        this.tableDataTitle = response.data.result
        this.titlePageInfo = response.data.pageInfo
      }).catch(error => {
        this.$message({
          message: '按标题查询文章失败',
          type: 'error'
        })
        this.titlePageShow = true
        throw new Error(error)
      })
    },
    bodyCurrentChange(val) {
      const bodyReq = this.searchReq2.body
      bodyReq.body = this.searchReq2.query
      bodyReq.pageNo = val
      getArticles1(bodyReq).then(response => {
        this.tableDataBody = response.data.result
        this.bodyPageInfo = response.data.pageInfo
      }).catch(error => {
        this.$message({
          message: '按标题查询文章失败',
          type: 'error'
        })
        this.bodyPageShow = true
        throw new Error(error)
      })
    },
    briefCurrentChange(val) {
      const briefReq = this.searchReq2.brief
      briefReq.brief = this.searchReq2.query
      briefReq.pageNo = val
      getArticles1(briefReq).then(response => {
        this.tableDataBrief = response.data.result
        this.briefPageInfo = response.data.pageInfo
      }).catch(error => {
        this.$message({
          message: '按标题查询文章失败',
          type: 'error'
        })
        this.briefPageShow = true
        throw new Error(error)
      })
    },
    remarkCurrentChange(val) {
      const remarkReq = this.searchReq2.remark
      remarkReq.remark = this.searchReq2.query
      remarkReq.pageNo = val
      getArticles1(remarkReq).then(response => {
        this.tableDataRemark = response.data.result
        this.remarkPageInfo = response.data.pageInfo
      }).catch(error => {
        this.$message({
          message: '按标题查询文章失败',
          type: 'error'
        })
        this.remarkPageShow = true
        throw new Error(error)
      })
    },
    // 选择链接节点ID
    choseLink(d, n, s) {
      // 展开节点
      if (!n.expanded) {
        n.expanded = true
      } else if (n.expanded) {
        n.expanded = false
      }
      this.addLinkReq.catalogId = d.ID
    },
    // 提交添加
    addArticlesLink(addLinkReq) {
      if (!this.addLinkReq.catalogId) {
        this.$message({
          message: '请选择需要添加到文章的链接节点',
          type: 'error'
        })
        return false
      }
      addArticlesLink(addLinkReq).then(response => {
        if (this.tableType === 1) {
          this.getArticlesById(this.catalogid, this.nodeReq)
        } else if (this.searchType === '0') {
          this.getArticles1(this.req2)
        } else if (this.searchType === '1') {
          this.getArticles1(this.searchReq2)
        }
        this.$message({
          message: '添加文章链接节点成功',
          type: 'success'
        })
        this.linkVisiable = false
      }).catch(error => {
        this.$message({
          message: '添加文章链接节点失败',
          type: 'error'
        })
        console.log(error)
      })
    }
    // 标签
    // handleClose(tag) {
    //   this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    // },

    // showInput() {
    //   this.inputVisible = true
    //   this.$nextTick(() => {
    //     console.log(this.$refs.saveTagInput)
    //     this.$refs.saveTagInput.$refs.input.focus()
    //   })
    // },

    // handleInputConfirm() {
    //   const inputValue = this.inputValue
    //   if (inputValue) {
    //     this.dynamicTags.push(inputValue)
    //   }
    //   this.inputVisible = false
    //   this.inputValue = ''
    // }
  },
  mounted() {
    this.initExpand()
    this.getCatalogs()
    $('aside').height($(window).height() - 108.55 + 10)
    $(window).resize(function() {
      $('aside').height($(window).height() - 108.55 + 10)
    })
    // 获取权限
    getPermission(localStorage.getItem('agentId')).then(response => {
      if (response.data) {
        this.permission = true
        this.getArticles1(this.req)
      } else {
        window.location.reload()
      }
    }).catch(error => {
      if (error.response.status === 403) {
        this.permission = false
        this.getArticles1(this.req)
      } else {
        window.location.reload()
      }
    })
  }
}
</script>
<style lang="scss" scoped>

  //页面样式
  aside{
    background:#252E34;
    color:#BFCBBA;
    margin-top: -20px;
    position:fixed;
    height:100%;
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
  .tree-add-top{
    // width:330px;
    // margin-left:-17.9px;
    position:fixed;
    top:150px;
    z-index:999;
  }
  // .tree-add-top:hover{
  //   opacity:1;
  // }
</style>
<style lang="scss">

  #kb{
     /* tree样式 */
    .el-tree{
      color:#BFCBCF;
      background:none;
    }
    .el-tree__empty-text{
      color:#BFCBCF;
    }
    .expand{
      // height:89.8%;
      height:100%;
      overflow:auto;
    }
    .expand>div{
      display: inline-block;
      // height:85%;
      // width:90%;
      margin:0 auto;
      overflow:auto;
    }
    .expand>div::-webkit-scrollbar-track{
      box-shadow: inset 0 0 6px rgba(0,0,0,.3);
      border-radius:5px;
    }
    .expand>div::-webkit-scrollbar-thumb{
      background-color:rgba(50, 65, 87, 0.5);
      outline:1px solid slategrey;
      border-radius:5px;
    }
    .expand>div::-webkit-scrollbar{
      width:10px;
    }
    .expand-tree{
      border:none;
    }
    .expand-tree .is-current>.el-tree-node__content .tree-label{
      font-weight:600;
      white-space:nowrap;
    }
    div.expand .expand-tree .el-tree-node.is-current,
    div.expand .expand-tree .el-tree-node:hover{
      overflow:hidden;
    }
    .el-tree-node__content:hover{
      background:#39484D;
    }
    .el-tree-node__content{
      background:none;
    }
    .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
      background:#39484D;
    }
    div.expand .expand-tree .is-current>.el-tree-node__content .tree-btn,
    div.expand .expand-tree .el-tree-node__content:hover .tree-btn{
      display:inline-block;
      opacity:1;
      background:#39484D;
    }
    div.expand2 .expand-tree .el-tree-node.is-current,
    div.expand2 .expand-tree .el-tree-node:hover{
      overflow:hidden;
    }
    div.expand2 .expand-tree .is-current>.el-tree-node__content .tree-btn,
    div.expand2 .expand-tree .el-tree-node__content:hover .tree-btn{
      display:none;
      background:#39484D;
    }
    .el-container.kb-main{
      width:100% !important;
      float:right;
    }
    // .sertion{
    //   display:block !important;
    // }
    .kb-main>.el-main{
      overflow:visible;
    }
    // .smallPaging{
    //   margin:0;
    //   width:354px;
    //   box-sizing:border-box;
    //   // .el-pagination__total{
    //   //   display:block;
    //   // }
    //   .el-pagination__sizes{
    //     display:block;
    //     float:left;
    //     margin-left:14%;
    //   }
    //   .el-pagination__jump{
    //     display:block;
    //     float:left;
    //   }
    //   .el-pagination__total{
    //     float:left;
    //     margin-left:15%;
    //   }
    //   .btn-prev{
    //     float:left;
    //   }
    //   .el-pager{
    //     float:left;
    //   }
    //   .btn-next{
    //     float:left;
    //   }
    // }
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
  // .input-new-tag{
  //   margin-left:8px;
  //   width:18%;
  // }
  // .button-new-tag{
  //   position:relative;
  //   top:1px;
  //   margin-left:8px;
  // }
 .ql-container{
    min-height: 400px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }
</style>
