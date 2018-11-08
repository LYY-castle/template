<template>
  <div class='container'>
    <!-- 管理主页div -->
    <div  v-show="isMainPage===true && isDetail === false">
      <el-row>
        <el-form :inline="true" size="small">
          <el-form-item label="问卷模板名称"> 
            <el-input type="text" v-model="req.name" size="medium" placeholder="问卷模板名称（限长45字符）" maxlength="45"></el-input>
          </el-form-item>
          <el-form-item label="操作人">
            <el-input type="text" v-model="req.modifier" size="medium" placeholder="操作人（限长45字符）" maxlength="45"></el-input>
          </el-form-item>
          <el-form-item label="操作时间">
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
            <el-button type="primary"  @click="req.pageNo=1;req.accurate='0';searchByKeyWords(req)">查询</el-button>
            <el-button type="danger"  @click="resetQueryCondition()">重置</el-button>
          </el-form-item>
        </el-form>
      </el-row>

      <el-row>
        <el-col>
          <el-table :data="tableData" border @selection-change="handleSelectionChange">
            <el-table-column align="center" type="selection" width="55"></el-table-column>
            <el-table-column align="center" label="问卷模板名称">
              <template slot-scope="scope">
                <a type="text" size="medium" @click="checkDetail(scope.row.id);selectOption_single.length=0;selectOption_blanks.length=0;selectOption_multiblanks.length=0">{{scope.row.name}}</a>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作人" width="" prop="modifier">
              <template slot-scope="scope">
                {{scope.row.modifier}}
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作时间" width="155" >
              <template slot-scope="scope">
                <div v-html="formatDateTime(scope.row.modifyTime)"></div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="medium" @click="showeditDetails(scope.row.id);singelItems=[];multiItems=[];fillBlanks=[];multiBlanks=[]">修改</el-button>
                <el-button type="text" size="medium" @click="deleteReq.id=scope.row.id;deleteVisiable=true">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <el-row style="margin-top:5px;">
        <el-button type="success" size="small" @click="questionnaireName='';questionnaireTitleVisiable=true">新建</el-button>
        <el-button type="danger" size="small" @click="isSelectIds(batchdel.ids)" >批量删除</el-button>
        <el-pagination
            v-if="pageShow"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page='pageInfo.pageNo'
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size='req.pageSize'
            layout="total, sizes, prev, pager, next, jumper "
            :total='pageInfo.totalCount' style="text-align: right;float:right;">
        </el-pagination>
      </el-row>

      <!-- 新建问卷dialog -->
      <el-dialog width="30%" title="新建问卷模板" :visible.sync="questionnaireTitleVisiable" append-to-body>
        <span style="color:red">*</span><span style="font-size:15px;">问卷模板标题：</span>
        <el-input type="text" placeholder="请输入问卷模板标题（限长45字符）" size="medium" v-model="questionnaireName" maxlength="45"></el-input>
        <div slot="footer" class="dialog-footer" style="text-align: center;">
          <el-button type="primary" @click="checkTitleIsNullOrNot();questionnaireTitleVisiable = false">确定</el-button>
          <el-button @click="questionnaireTitleVisiable = false">取消</el-button>
        </div>
      </el-dialog>

      <!-- 删除dialog -->
      <el-dialog width="30%" title="删除提示" :visible.sync="deleteVisiable" append-to-body>
        <span style="font-size:15px;">确定删除此问卷模板？</span>
        <div slot="footer" class="dialog-footer" style="text-align: right;">
          <el-button type="primary" @click="deleteVisiable = false;deleteQuestionnaire(deleteReq.id);">确定</el-button>
          <el-button @click="deleteVisiable = false">取消</el-button>
        </div>
      </el-dialog>

      <!-- 批量删除dialog -->
      <el-dialog width="30%" title="删除提示" :visible.sync="batchdeleteVisiable" append-to-body>
        <span style="font-size:15px;">确定删除这些问卷模板？</span>
        <div slot="footer" class="dialog-footer" style="text-align: right;">
          <el-button type="primary" @click="batchdeleteVisiable = false;batchdeleteQuestionnaire(batchdel.ids);">确定</el-button>
          <el-button @click="batchdeleteVisiable = false">取消</el-button>
        </div>
      </el-dialog>

    </div>

    <!-- 新建问卷div -->
    <div  v-show="isMainPage===false && isDetail === false" class="question">
      <el-row type="flex">
        <el-col :span="2"></el-col>
        <el-col :span="20" >
          <el-container style="height: 750px;">
            <el-aside width="210px" style="background-color: rgb(238, 241, 246);border: 1px solid #eee;position:fixed;top:109px;">
              <el-menu :default-openeds="['1']" active-text-color="#121212">
                <el-submenu index="1">
                  <template slot="title"><i class="el-icon-menu"></i>题型选择</template>
                  <el-menu-item-group>
                    <div style="text-align:left">
                      <el-menu-item index="1-1" @click="addSingleCheck();" class="module" style="background-position:35px -4px">单选题</el-menu-item>
                      <el-menu-item index="1-2" @click="addMultiCheck();"  class="module" style="background-position:35px -76px">多选题</el-menu-item>
                      <el-menu-item index="1-3" @click="addFillBlank();"  class="module" style="background-position:35px -112px">&nbsp;&nbsp;&nbsp;&nbsp;单行填空</el-menu-item>
                      <el-menu-item index="1-4" @click="addMultiBlanks();" class="module" style="background-position:35px -148px">&nbsp;&nbsp;&nbsp;&nbsp;多行填空</el-menu-item>
                    </div>
                  </el-menu-item-group>
                </el-submenu>
              </el-menu>
            </el-aside>
            
            <el-container style="margin-left:200px">
              <el-header>
                <div class="title-content">
                  {{questionnaireName}}
                </div>
                <div class="survey-desc">
                  <div class="desc-content">欢迎参加调查！答卷数据仅用于统计分析，请放心填写。题目选项无对错之分，按照实际情况选择即可。感谢您的帮助！</div>
                </div>

                <div class="quest-box">
                  <!--  单选  -->
                    <el-form>
                      <h5 v-if="this.singelItems.length > 0">&nbsp;&nbsp;&nbsp;&nbsp;单选:</h5><br/>
                        <div style="margin-top:-25px">
                          <el-form-item v-for="(item,index) in singelItems">
                            <div class="topic-type-content">
                                <span>{{index+1}}.</span>
                                <el-input size="small" v-model="item.name" placeholder="标题(45个字符内)" style="width:493px;margin:3px" clearable maxlength="45"></el-input>
                                <div v-for="(a,radioIndex) in item.options" class="options">
                                  <span class="showEditOption">
                                    <el-radio label="1" name="1"  disabled>
                                      <el-input size="small" type="text" placeholder='选项(45个字符内)' style="width:456px;margin:2px" v-model="a.content" clearable maxlength="45"></el-input>&nbsp;&nbsp;
                                        <span class="editoptions">
                                          <el-button icon="el-icon-arrow-up" type="text" size="mini" title="上移" @click="upOption(item.options,radioIndex,item.options.length)"></el-button>
                                          <el-button icon="el-icon-arrow-down" type="text" size="mini" title="下移" @click="downOption(item.options,radioIndex,item.options.length)"></el-button>
                                          <el-button icon="el-icon-delete" type="text" size="mini" title="删除" @click="removeRadio(item.options,radioIndex)"></el-button>
                                        </span>
                                    </el-radio>
                                  </span>
                                </div>
                                <div class="showaddTool">
                                  <i class="el-icon-plus" style="cursor:pointer" @click="addRadio(item.options)" title="新建一个单选项"></i>
                                </div>
                                <div class="showdeleteTool">
                                  <i class="el-icon-delete" style="cursor:pointer" @click="removeSingle(index)" title="点击删除该单选题"></i>
                                </div>
                            </div>
                          </el-form-item>
                        </div>
                    </el-form>
                  

                  <!--  多选  -->
                  <el-form>
                    <h5 v-if="this.multiItems.length > 0">&nbsp;&nbsp;&nbsp;&nbsp;多选:</h5><br/>
                    <div style="margin-top:-25px">
                      <el-form-item v-for="(item,index) in multiItems">
                        <div class="topic-type-content">
                          <span>{{index+1}}.</span>
                          <el-input size="small" v-model="item.name" placeholder="标题(45个字符内)" style="width:493px;margin:3px" clearable maxlength="45"></el-input>
                          <div v-for="(a,checkboxIndex) in item.options" class="options">
                            <el-checkbox disabled checked>
                            <span class="showEditOption">
                            <el-input size="small" type="text" placeholder='选项(45个字符内)' style="width:456px;margin:2px" v-model="a.content" clearable maxlength="45"></el-input>
                              <span class="editoptions">
                                <el-button icon="el-icon-arrow-up" type="text" size="mini" title="上移" @click="upOption(item.options,checkboxIndex,item.options.length)"></el-button>
                                <el-button icon="el-icon-arrow-down" type="text" size="mini" title="下移" @click="downOption(item.options,checkboxIndex,item.options.length)"></el-button>
                                <el-button icon="el-icon-delete" type="text" size="mini" title="删除" @click="removeRadio(item.options,checkboxIndex)"></el-button>
                              </span>
                            </span>
                          </el-checkbox>
                          </div>
                          <div class="showaddTool">
                            <i class="el-icon-plus" style="cursor:pointer" @click="addCheckbox(item.options)" title="新建一个多选项"></i>
                          </div>
                          <div class="showdeleteTool">
                            <i class="el-icon-delete" style="cursor:pointer" @click="removeMulti(index)" title="点击删除该多选题"></i>
                          </div>
                        </div>
                      </el-form-item>
                    </div>
                  </el-form>

                  <!--  单行填空  -->
                   <el-form>
                    <h5 v-if="this.fillBlanks.length > 0">&nbsp;&nbsp;&nbsp;&nbsp;单行填空:</h5><br/>
                      <div style="margin-top:-25px">
                        <el-form-item v-for="(item,index) in fillBlanks">
                          <div class="topic-type-content">
                            <span>{{index+1}}.</span>
                            <el-input v-model="item.name" placeholder="标题(45个字符内)" style="width:493px;margin:3px" clearable maxlength="45"></el-input>
                            <div v-for="(a,blankIndex) in item.options" class="options">
                              <el-input type="text" placeholder='回答' style="width:478px;margin:2px" v-model="a.content"  maxlength="45"  disabled></el-input>
                            </div>
                            <div class="showdeleteTool">
                              <i class="el-icon-delete" style="cursor:pointer" @click="removeBlanks(index)" title="点击删除该题"></i>
                            </div>
                          </div>
                        </el-form-item>
                      </div>
                  </el-form>

                  <!--  多行填空  -->
                   <el-form>
                    <h5 v-if="this.multiBlanks.length > 0">&nbsp;&nbsp;&nbsp;&nbsp;多行填空:</h5><br/>
                      <div style="margin-top:-25px">
                        <el-form-item v-for="(item,index) in multiBlanks">
                          <div class="topic-type-content">
                            <span>{{index+1}}.</span>
                            <el-input v-model="item.name" placeholder="标题(45个字符内)" style="width:493px;margin:3px" clearable maxlength="45"></el-input>
                            <div v-for="(a,blankIndex) in item.options" class="options">
                              <el-input type="textarea" resize="none" rows="4" placeholder='回答' style="width:478px;margin:2px" v-model="a.content" disabled maxlength="150"></el-input>
                            </div>
                            <div class="showdeleteTool">
                              <i class="el-icon-delete" style="cursor:pointer" @click="removeMultiBlanks(index)" title="点击删除该题"></i>
                            </div>
                          </div>
                        </el-form-item>
                      </div>
                  </el-form>

                </div>
                <div class="lastbuttons" >
                  <div style="margin-top:8px">
                    <el-button size="small" type="primary" @click="makeQuestionnaire(questionnaireName,singelItems,multiItems,fillBlanks,multiBlanks)">生成</el-button>
                    <el-button size="small" type="default" @click="isMainPage=true;isDetail=false;questionnaireName='';singelItems=[];multiItems=[];fillBlanks=[];multiBlanks=[]">取消</el-button>
                  </div>
                </div>
              </el-header>
            </el-container>
          </el-container>
        </el-col>
        <el-col :span="2"></el-col>
      </el-row>
    </div>

    <!-- 问卷详情div -->
    <div  v-show="isMainPage===true && isDetail===true" class="question">
      <el-row type="flex">
        <el-col :span="2"></el-col>
        <el-col :span="20" >
          <el-container style="height: 750px;">
            <el-container style="margin-left:60px">
              <el-header>
                <div class="title-content-detail">
                  <span>{{this.oneDetails.name}}&nbsp;
                  </span><br/>
                  <span style="font-size: 10px;padding:30px">{{this.oneDetails.modifier}}&nbsp;&nbsp;{{formatDateTime(this.oneDetails.modifyTime)}}</span>
                </div>
                <div class="survey-desc">
                  <div class="desc-content">欢迎参加调查！答卷数据仅用于统计分析，请放心填写。题目选项无对错之分，按照实际情况选择即可。感谢您的帮助！</div>
                </div>

                <div class="quest-box">
                  <!--  单选  -->
                    <el-form>
                      <h5 v-if="hasSingle===true">&nbsp;&nbsp;&nbsp;&nbsp;单选:</h5><br/>
                        <div style="margin-top:-25px">
                          <el-form-item v-for="(item,index) in oneDetails.titles" v-if="item.type===0">
                            <div class="topic-type-content">
                                <span>{{index+1}}.</span>
                                <!-- <el-input size="small" v-model="item.name" placeholder="标题" style="width:493px;margin:3px" clearable maxlength="45"></el-input> -->
                                <span v-model="item.name" placeholder="标题" style="width:300px">{{item.name}}</span>
                                <div v-for="(a,radioIndex) in item.options" class="options">
                                  <el-radio :label="radioIndex" v-model="selectOption_single[index]">
                                    {{a.content}}
                                  </el-radio>
                                </div>
                            </div>
                          </el-form-item>
                        </div>
                    </el-form>
                  

                  <!--  多选  -->
                  <el-form>
                    <h5 v-if="hasMulti===true">&nbsp;&nbsp;&nbsp;&nbsp;多选:</h5><br/>
                    <div style="margin-top:-25px">
                      <el-form-item v-for="(item,index) in oneDetails.titles" v-if="item.type===1">
                        <div class="topic-type-content">
                          <span>{{index+1}}.</span>
                          <span v-model="item.name" placeholder="标题" style="width:300px">{{item.name}}</span>
                          <div v-for="(a,checkboxIndex) in item.options" class="options">
                            <el-checkbox :label="a.content"></el-checkbox>
                          </div>
                        </div>
                      </el-form-item>
                    </div>
                  </el-form>

                  <!--  单行填空  -->
                   <el-form>
                    <h5 v-if="hasBlanks===true">&nbsp;&nbsp;&nbsp;&nbsp;单行填空:</h5><br/>
                      <div style="margin-top:-25px">
                        <el-form-item v-for="(item,index) in oneDetails.titles" v-if="item.type===2">
                          <div class="topic-type-content">
                            <span>{{index+1}}.</span>
                            <span v-model="item.name" placeholder="标题" style="width:300px">{{item.name}}</span>
                            <div v-for="(a,blankIndex) in item.options" class="options">
                              <el-input type="text" style="width:478px;margin:2px" v-model="selectOption_blanks[index]"  maxlength="45" ></el-input>
                            </div>
                          </div>
                        </el-form-item>
                      </div>
                  </el-form>

                  <!--  多行填空  -->
                   <el-form>
                    <h5 v-if="hasMultiBlanks===true">&nbsp;&nbsp;&nbsp;&nbsp;多行填空:</h5><br/>
                      <div style="margin-top:-25px">
                        <el-form-item v-for="(item,index) in oneDetails.titles" v-if="item.type===3">
                          <div class="topic-type-content">
                            <span>{{index+1}}.</span>
                            <span v-model="item.name" placeholder="标题" style="width:300px">{{item.name}}</span>
                            <div v-for="(a,blankIndex) in item.options" class="options">
                              <el-input type="textarea" rows="4"  resize="none" style="width:478px;margin:2px" v-model="selectOption_multiblanks[index]"  maxlength="45"></el-input>
                            </div>
                          </div>
                        </el-form-item>
                      </div>
                  </el-form>

                </div>
                <div class="lastbuttons" >
                  <div style="margin-top:8px">
                    <el-button type="primary" size="small" @click="isMainPage=true;isDetail=false;">返回</el-button><br/><br/>
                  </div>
                </div>

              </el-header>
            </el-container>
          </el-container>
        </el-col>
        <el-col :span="2"></el-col>
      </el-row>
    </div>

    <!-- 修改问卷div -->
    <div v-show="isMainPage===false && isDetail===true" class="question">
      <el-row type="flex">
        <el-col :span="2"></el-col>
        <el-col :span="20" >
          <el-container style="height: 750px;">
            <el-aside width="210px" style="background-color: rgb(238, 241, 246);border: 1px solid #eee;position:fixed;top:109px;">
              <el-menu :default-openeds="['1']" active-text-color="#121212">
                <el-submenu index="1">
                  <template slot="title"><i class="el-icon-menu"></i>题型选择</template>
                  <el-menu-item-group>
                    <el-menu-item index="1-1" @click="addSingleCheck();" class="module" style="background-position:35px -4px">单选题</el-menu-item>
                    <el-menu-item index="1-2" @click="addMultiCheck();"  class="module" style="background-position:35px -76px">多选题</el-menu-item>
                    <el-menu-item index="1-3" @click="addFillBlank();"  class="module" style="background-position:35px -112px">&nbsp;&nbsp;&nbsp;&nbsp;单行填空</el-menu-item>
                    <el-menu-item index="1-4" @click="addMultiBlanks();" class="module" style="background-position:35px -148px">&nbsp;&nbsp;&nbsp;&nbsp;多行填空</el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
              </el-menu>
            </el-aside>
            
            <el-container style="margin-left:200px">
              <el-header>
                <div class="title-content">
                  <span>{{questionnaireName}}&nbsp;
                    <el-tooltip class="item" effect="dark" content="修改问卷模板标题" placement="right-start">
                      <el-button type="default" @click="editQuestionnaireName=true;questionnaireName1=questionnaireName" size="small" icon="el-icon-edit" style="width:50px"></el-button>
                    </el-tooltip>
                  </span>
                </div>
                <div class="survey-desc">
                  <div class="desc-content">欢迎参加调查！答卷数据仅用于统计分析，请放心填写。题目选项无对错之分，按照实际情况选择即可。感谢您的帮助！</div>
                </div>

                <div class="quest-box">
                  <!--  单选  -->
                    <el-form>
                      <h5 v-if="this.singelItems.length > 0">&nbsp;&nbsp;&nbsp;&nbsp;单选:</h5><br/>
                        <div style="margin-top:-25px">
                          <el-form-item v-for="(item,index) in singelItems">
                            <div class="topic-type-content">
                                <span>{{index+1}}.</span>
                                <el-input size="small" v-model="item.name" placeholder="标题" style="width:493px;margin:3px" clearable maxlength="45"></el-input>
                                <div v-for="(a,radioIndex) in item.options" class="options">
                                  <el-radio label="1" name="1"  disabled>
                                    <span class="showEditOption">
                                      <el-input size="small" type="text" placeholder='选项' style="width:456px;margin:2px" v-model="a.content" clearable maxlength="45"></el-input>&nbsp;&nbsp;
                                        <span class="editoptions">
                                          <el-button icon="el-icon-arrow-up" type="text" size="mini" title="上移" @click="upOption(item.options,radioIndex,item.options.length)"></el-button>
                                          <el-button icon="el-icon-arrow-down" type="text" size="mini" title="下移" @click="downOption(item.options,radioIndex,item.options.length)"></el-button>
                                          <el-button icon="el-icon-delete" type="text" size="mini" title="删除" @click="removeRadio(item.options,radioIndex)"></el-button>
                                        </span>
                                    </span>
                                  </el-radio>
                                </div>
                                <div class="showaddTool">
                                  <i class="el-icon-plus" style="cursor:pointer" @click="addRadio(item.options)" title="新建一个单选项"></i>
                                </div>
                                <div class="showdeleteTool">
                                  <i class="el-icon-delete" style="cursor:pointer" @click="removeSingle(index)" title="点击删除该单选题"></i>
                                </div>
                            </div>
                          </el-form-item>
                        </div>
                    </el-form>
                  

                  <!--  多选  -->
                  <el-form>
                    <h5 v-if="this.multiItems.length > 0">&nbsp;&nbsp;&nbsp;&nbsp;多选:</h5><br/>
                    <div style="margin-top:-25px">
                      <el-form-item v-for="(item,index) in multiItems">
                        <div class="topic-type-content">
                          <span>{{index+1}}.</span>
                          <el-input size="small" v-model="item.name" placeholder="标题" style="width:493px;margin:3px" clearable maxlength="45"></el-input>
                          <div v-for="(a,checkboxIndex) in item.options" class="options">
                            <el-checkbox disabled checked>
                            <span class="showEditOption">
                            <el-input size="small" type="text" placeholder='选项' style="width:456px;margin:2px" v-model="a.content" clearable maxlength="45"></el-input>&nbsp;&nbsp;
                              <span class="editoptions">
                                <el-button icon="el-icon-arrow-up" type="text" size="mini" title="上移" @click="upOption(item.options,checkboxIndex,item.options.length)"></el-button>
                                <el-button icon="el-icon-arrow-down" type="text" size="mini" title="下移" @click="downOption(item.options,checkboxIndex,item.options.length)"></el-button>
                                <el-button icon="el-icon-delete" type="text" size="mini" title="删除" @click="removeRadio(item.options,checkboxIndex)"></el-button>
                              </span>
                            </span>
                          </el-checkbox>
                          </div>
                          <div class="showaddTool">
                            <i class="el-icon-plus" style="cursor:pointer" @click="addCheckbox(item.options)" title="新建一个多选项"></i>
                          </div>
                          <div class="showdeleteTool">
                            <i class="el-icon-delete" style="cursor:pointer" @click="removeMulti(index)" title="点击删除该多选题"></i>
                          </div>
                        </div>
                      </el-form-item>
                    </div>
                  </el-form>

                  <!--  单行填空  -->
                   <el-form>
                    <h5 v-if="this.fillBlanks.length > 0">&nbsp;&nbsp;&nbsp;&nbsp;单行填空:</h5><br/>
                      <div style="margin-top:-25px">
                        <el-form-item v-for="(item,index) in fillBlanks">
                          <div class="topic-type-content">
                            <span>{{index+1}}.</span>
                            <el-input v-model="item.name" placeholder="标题" style="width:493px;margin:3px" clearable maxlength="45"></el-input>
                            <div v-for="(a,blankIndex) in item.options" class="options">
                              <el-input type="text" placeholder='回答' style="width:478px;margin:2px" v-model="a.content"  maxlength="45"  disabled></el-input>
                            </div>
                            <div class="showdeleteTool">
                              <i class="el-icon-delete" style="cursor:pointer" @click="removeBlanks(index)" title="点击删除该题"></i>
                            </div>
                          </div>
                        </el-form-item>
                      </div>
                  </el-form>

                  <!--  多行填空  -->
                   <el-form>
                    <h5 v-if="this.multiBlanks.length > 0">&nbsp;&nbsp;&nbsp;&nbsp;多行填空:</h5><br/>
                      <div style="margin-top:-25px">
                        <el-form-item v-for="(item,index) in multiBlanks">
                          <div class="topic-type-content">
                            <span>{{index+1}}.</span>
                            <el-input v-model="item.name" placeholder="标题" style="width:493px;margin:3px" clearable maxlength="45"></el-input>
                            <div v-for="(a,blankIndex) in item.options" class="options">
                              <el-input type="textarea" rows="4" placeholder='回答' style="width:478px;margin:2px" v-model="a.content" disabled maxlength="150"></el-input>
                            </div>
                            <div class="showdeleteTool">
                              <i class="el-icon-delete" style="cursor:pointer" @click="removeMultiBlanks(index)" title="点击删除该题"></i>
                            </div>
                          </div>
                        </el-form-item>
                      </div>
                  </el-form>

                </div>
                <div class="lastbuttons" >
                  <div style="margin-top:8px">
                    <el-button size="small" type="primary" @click="editQuestionnaire(editQuestionnaireId,questionnaireName1,singelItems,multiItems,fillBlanks,multiBlanks)">修改</el-button>
                    <el-button size="small" type="default" @click="isMainPage=true;isDetail=false;questionnaireName='';questionnaireName1='';singelItems=[];multiItems=[];fillBlanks=[];multiBlanks=[]">返回</el-button>
                  </div>
                </div>

                <!-- 修改问卷模板名称dialog -->
                <el-dialog width="30%" title="修改问卷模板名称" :visible.sync="editQuestionnaireName" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
                  <span style="color:red">*</span><span style="font-size:15px;">问卷模板标题：</span>
                  <el-input maxlength="45" type="text" placeholder="请输入问卷模板标题（限长45字符）" size="medium" v-model="questionnaireName1" clearable @change="checkEditName(questionnaireName1);"></el-input>
                  <div slot="footer" class="dialog-footer" style="text-align: center;">
                    <span style="color:red" v-if="hasQuestionnaireName===false">模板名称不能为空</span>
                    <el-button type="primary" @click="editQuestionnaireName=false;questionnaireName=questionnaireName1" v-if="hasQuestionnaireName===true">确定</el-button>
                    <el-button @click="editQuestionnaireName = false" v-if="hasQuestionnaireName===true">取消</el-button>
                  </div>
                </el-dialog>
              </el-header>
            </el-container>
          </el-container>
        </el-col>
        <el-col :span="2"></el-col>
      </el-row>
    </div>
  </div>
</template>
<style>
.question .el-input__inner:focus{
  border: 1px solid #000;
  background:rgb(253, 249, 205);
}
.question .el-input__inner:hover{
  background:rgb(253, 249, 205);
}
.question .el-textarea__inner:focus{
  background:rgb(253, 249, 205);
}
.question .el-textarea__inner:hover{
  background:rgb(253, 249, 205);
}
</style>

<style rel='stylesheet/scss' lang="scss" scoped>
// .quest{
//   border:1px solid #ddd;
//   -webkit-box-shadow:5px 0 0 #888;
//   box-shadow:5px 5px 5px 0px #888;
//   min-height:75vh;
//   margin-bottom: 3vh;
// }
.myButton{
  padding: 0px;
  border:none;
}
.title-content {
  height: 48px;
  font-size: 20px;
  text-align: center;
  line-height: 48px;
  border: 1px solid #dbdbdb;
  position: relative;
  outline: 0;
}
.title-content-detail {
  height: 88px;
  font-size: 22px;
  text-align: center;
  line-height: 48px;
  border: 1px solid #dbdbdb;
  position: relative;
  outline: 0;
}
.survey-desc {
  border: 1px solid #dbdbdb;
  margin: 4px 0;
  display: inline-block;
  width: 100%;
  background: #fff;
  padding: 20px;
}
.desc-content {
  text-align: center;
  position: relative;
  outline: 0;
  width: 100%;
  min-height: 30px;
  line-height: 30px;
}
.quest-box {
  margin: 4px 0;
  width: 100%;
  min-height: 550px;
}
.topic-type-content {
  border: 1px solid #dbdbdb;
  margin: -5px 0;
  padding-left:50px;
  display: inline-block;
  width: 100%;
  background: #fff;
}
.options {
  padding-left: 30px;
}
.lastbuttons {
  border: 1px solid #dbdbdb;
  margin-top: 4px 0;
  width: 100%;
  text-align: center;
  height: 50px;
}
.showaddTool {
  float: right;
  margin-right: 92%;
  height: 0px;
  cursor: pointer;
  opacity: 0;
}
.showdeleteTool {
    float: right;
    margin-right: 55%;
    height: 36px;
    cursor: pointer;
    opacity: 0;
}
.editoptions {
  float: right;
  opacity: 0;
}
.showEditOption:hover .editoptions{
  opacity: 1;
}
.topic-type-content:hover .showdeleteTool,.topic-type-content:hover .showaddTool{
  opacity: 1;
}
.module {
    cursor: pointer;
    height: 35px;
    text-align: center;
    line-height: 36px;
    background: url(../../../static/images/my_imgs/question_logo.png) no-repeat;
    padding-left: 50px;
}
</style>

<script>
import { formatDateTime, swapArray } from '@/utils/tools'
import {
  queryByKeyWords,
  generateQuestionnaire,
  deleteOneQuestionnaire,
  deleteQuestionnaires,
  queryOneQuestionnaire,
  modifyQuestionnaire,
  checkByQuestionnaireName
} from '@/api/questionnaire_management'

export default {
  name: 'questionnaire_management',

  data() {
    return {
      selectOption_single: [],
      selectOption_multi: [],
      selectOption_blanks: [],
      selectOption_multiblanks: [],
      isMainPage: true, // 判断是否是管理主页
      isDetail: false, // 判断是否是详情
      tableData: [], // 表格数据
      pageShow: false, // 分页显示与否
      pageInfo: {}, // 分页信息
      timeValue: '', // 查询时间显示
      hasSingle: false,
      hasMulti: false,
      hasBlanks: false,
      hasMultiBlanks: false,
      req: {
        accurate: '0', // 是否精确查找 0否 1是
        name: '', // 问卷模板名称
        modifier: '', // 操作人
        beginTime: '', // 操作时间开始
        afterTime: '', // 操作时间结束
        pageNo: 1,
        pageSize: 10
      },
      deleteReq: {
        id: ''
      },
      batchdel: {
        ids: []
      },
      questionnaireTitleVisiable: false, // 新建问卷标题dialog
      deleteVisiable: false, // 删除dialog显示与否
      batchdeleteVisiable: false, // 批量删除dialog显示与否
      editQuestionnaireName: false, // 修改问卷模板名称dialog显示与否
      hasQuestionnaireName: true, // 判断有无名称
      editQuestionnaireId: '', // 需要修改的问卷模板id
      questionnaireName: '', // 新建问卷名称
      questionnaireName1: '', // 修改问卷名称
      singelItems: [], // 单选 所有选项
      multiItems: [], // 多选 所有选项
      fillBlanks: [], // 单行填空 所有选项
      multiBlanks: [], // 多行填空
      singleCheck: false,
      multiCheck: false,
      blanksCheck: false,
      multiblanksCheck: false,
      oneDetails: {
        // 单个问卷详情数据
        modifier: '',
        modifyTime: '',
        name: '',
        titles: []
      }
    }
  },

  methods: {
    // 上移
    upOption(arr, index, length) {
      if (index !== 0) {
        swapArray(arr, index, index - 1)
      } else {
        this.$message.error('当前该项已在顶部')
      }
    },
    // 下移
    downOption(arr, index, length) {
      if (index !== (length - 1)) {
        swapArray(arr, index, index + 1)
      } else {
        this.$message.error('当前该项已在底部')
      }
    },

    // 重置查询条件
    resetQueryCondition() {
      this.timeValue = ''
      this.req = {
        accurate: '0',
        name: '', // 问卷模板名称
        modifier: '', // 操作人
        beginTime: '', // 操作时间开始
        afterTime: '', // 操作时间结束
        pageNo: this.pageInfo.pageNo,
        pageSize: this.pageInfo.pageSize
      }
    },
    // 新建单选
    addSingleCheck() {
      this.singelItems.push({
        type: '0',
        name: '',
        options: [
          {
            content: ''
          }
        ]
      })
    },
    // 新建多选
    addMultiCheck() {
      this.multiItems.push({
        type: '1',
        name: '',
        options: [
          {
            content: ''
          }
        ]
      })
    },
    // 新建单行填空
    addFillBlank() {
      this.fillBlanks.push({
        type: '2',
        name: '',
        options: [
          {
            content: ''
          }
        ]
      })
    },
    // 新建多行填空
    addMultiBlanks() {
      this.multiBlanks.push({
        type: '3',
        name: '',
        options: [
          {
            content: ''
          }
        ]
      })
    },
    removeSingle(index) {
      this.singelItems.splice(index, 1)
    },
    removeRadio(a, index) {
      a.splice(index, 1)
    },
    addRadio(options) {
      options.push({
        content: ''
      })
    },
    removeMulti(index) {
      this.multiItems.splice(index, 1)
    },
    removeCheckbox(a, index) {
      a.splice(index, 1)
    },
    addCheckbox(options) {
      options.push({
        content: ''
      })
    },
    removeBlanks(index) {
      this.fillBlanks.splice(index, 1)
    },
    removeMultiBlanks(index) {
      this.multiBlanks.splice(index, 1)
    },
    // removeBlank(a, index) {
    //   a.splice(index, 1)
    // },
    // addBlank(options) {
    //   options.push({
    //     content: '回答'
    //   })
    // },
    // 生成问卷
    makeQuestionnaire(questionnaireName, singelItems, multiItems, fillBlanks, multiBlanks) {
      if (
        singelItems.length === 0 &&
        multiItems.length === 0 &&
        fillBlanks.length === 0 &&
        multiBlanks.length === 0
      ) {
        this.$message.error('未选择任何类型！')
        return
      } else {
        // 判断是否还有未填项
        this.hasBlanksOrNot(singelItems, multiItems, fillBlanks, multiBlanks)
        if (
          this.singleCheck === true &&
          this.multiCheck === true &&
          this.blanksCheck === true &&
          this.multiblanksCheck === true
        ) {
          generateQuestionnaire(
            questionnaireName,
            singelItems,
            multiItems,
            fillBlanks,
            multiBlanks
          ).then(response => {
            if (response.data && response.data.code === 0) {
              this.$message.success(response.data.message)
              this.questionnaireName = ''
              this.singelItems = []
              this.multiItems = []
              this.fillBlanks = []
              this.multiBlanks = []
              this.req.modifier = ''
              this.req.name = ''
              this.req.beginTime = ''
              this.req.afterTime = ''
              this.req.pageNo = 1
              this.searchByKeyWords(this.req)
              this.isMainPage = true
              this.isDetail = false
            } else {
              this.$message.error(response.data.message)
            }
          })
        } else {
          this.$message.error('当前页面还有信息未完善！')
          return
        }
      }
    },
    // 判断名称是否为空
    checkEditName(questionnaireName) {
      if (
        questionnaireName === '' ||
        questionnaireName.split(' ').join('').length === 0
      ) {
        this.hasQuestionnaireName = false
      } else {
        this.hasQuestionnaireName = true
      }
    },
    // 修改问卷模板
    editQuestionnaire(
      editQuestionnaireId,
      questionnaireName,
      singelItems,
      multiItems,
      fillBlanks,
      multiBlanks
    ) {
      if (
        singelItems.length === 0 &&
        multiItems.length === 0 &&
        fillBlanks.length === 0 &&
        multiBlanks.length === 0
      ) {
        this.$message.error('未选择任何类型！')
        return
      } else {
        // 判断是否还有未填项
        this.hasBlanksOrNot(singelItems, multiItems, fillBlanks, multiBlanks)
        if (
          this.singleCheck === true &&
          this.multiCheck === true &&
          this.blanksCheck === true &&
          this.multiblanksCheck === true
        ) {
          modifyQuestionnaire(
            editQuestionnaireId,
            questionnaireName,
            singelItems,
            multiItems,
            fillBlanks,
            multiBlanks
          ).then(response => {
            if (response.data && response.data.code === 0) {
              this.$message.success(response.data.message)
              this.questionnaireName = ''
              this.singelItems = []
              this.multiItems = []
              this.fillBlanks = []
              this.multiBlanks = []
              this.req.modifier = ''
              this.req.name = ''
              this.req.beginTime = ''
              this.req.afterTime = ''
              this.req.pageNo = 1
              this.searchByKeyWords(this.req)
              this.isMainPage = true
              this.isDetail = false
            } else {
              this.$message.error(response.data.message)
            }
          })
        } else {
          this.$message.error('当前页面还有信息未完善！')
          return
        }
      }
    },
    // 综合查询
    searchByKeyWords(req) {
      req.beginTime = this.timeValue[0]
      req.afterTime = this.timeValue[1]
      queryByKeyWords(req).then(response => {
        if (response.data.code === 0) {
          this.tableData = response.data.data
          this.pageShow = true
          this.pageInfo = response.data.pageInfo
        } else {
          this.pageShow = false
          this.$message.error('无查询结果，请核对查询条件')
        }
      })
    },
    // 页面显示条数
    handleSizeChange(val) {
      this.req.pageSize = val
      this.req.pageNo = 1
      this.pageInfo.pageNo = 1
      this.searchByKeyWords(this.req)
    },
    // 翻页
    handleCurrentChange(val) {
      this.req.pageNo = val
      this.searchByKeyWords(this.req)
    },
    // 表格多选
    handleSelectionChange(val) {
      this.batchdel.ids.length = 0
      for (var i = 0; i < val.length; i++) {
        this.batchdel.ids.push(val[i].id)
      }
    },
    // 格式化时间
    formatDateTime: formatDateTime,

    // 查询详情
    checkDetail(id) {
      this.hasSingle = false
      this.hasMulti = false
      this.hasBlanks = false
      this.hasMultiBlanks = false
      this.oneDetails.titles = {
        // 单个问卷详情数据
        modifier: '',
        modifyTime: '',
        name: '',
        titles: []
      }
      queryOneQuestionnaire(id)
        .then(response => {
          if (response.data.code === 0) {
            this.oneDetails.name = response.data.data.name
            this.oneDetails.modifier = response.data.data.modifier
            this.oneDetails.modifyTime = formatDateTime(response.data.data.modifyTime)
            this.oneDetails.titles = response.data.data.titles
            for (var i = 0; i < response.data.data.titles.length; i++) {
              if (response.data.data.titles[i].type === 0) {
                this.hasSingle = true
              }
              if (response.data.data.titles[i].type === 1) {
                this.hasMulti = true
              }
              if (response.data.data.titles[i].type === 2) {
                this.hasBlanks = true
              }
              if (response.data.data.titles[i].type === 3) {
                this.hasMultiBlanks = true
              }
            }
            this.isMainPage = true
            this.isDetail = true
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 展示修改问卷div
    showeditDetails(id) {
      this.singelItems.length = 0
      this.multiItems.length = 0
      this.fillBlanks.length = 0
      this.multiBlanks.length = 0
      this.singelItems = []
      this.multiItems = []
      this.fillBlanks = []
      this.multiBlanks = []
      queryOneQuestionnaire(id).then(response => {
        if (response.data.code === 0) {
          this.questionnaireName = response.data.data.name
          this.questionnaireName1 = response.data.data.name
          this.editQuestionnaireId = response.data.data.id
          for (var i = 0; i < response.data.data.titles.length; i++) {
            if (response.data.data.titles[i].type === 0) {
              this.singelItems.push(response.data.data.titles[i])
            } else if (response.data.data.titles[i].type === 1) {
              this.multiItems.push(response.data.data.titles[i])
            } else if (response.data.data.titles[i].type === 2) {
              this.fillBlanks.push(response.data.data.titles[i])
            } else if (response.data.data.titles[i].type === 3) {
              this.multiBlanks.push(response.data.data.titles[i])
            }
          }
          this.isMainPage = false
          this.isDetail = true
        }
      })
    },
    // 判断页面是否还有未填的项
    hasBlanksOrNot(singelItems, multiItems, fillBlanks, multiBlanks) {
      this.singleCheck = false
      this.multiCheck = false
      this.blanksCheck = false
      this.multiblanksCheck = false
      if (singelItems.length > 0) {
        for (var i = 0; i < singelItems.length; i++) {
          if (singelItems[i].name !== '' && singelItems[i].options.length !== 0) {
            for (var j = 0; j < singelItems[i].options.length; j++) {
              if (singelItems[i].options[j].content === '') {
                this.singleCheck = false
                return
              } else {
                this.singleCheck = true
              }
            }
          } else {
            this.singleCheck = false
            return
          }
        }
      } else {
        this.singleCheck = true
      }

      if (multiItems.length > 0) {
        for (var k = 0; k < multiItems.length; k++) {
          if (multiItems[k].name !== '' && multiItems[k].options.length !== 0) {
            for (var a = 0; a < multiItems[k].options.length; a++) {
              if (multiItems[k].options[a].content === '') {
                this.multiCheck = false
                return
              } else {
                this.multiCheck = true
              }
            }
          } else {
            this.multiCheck = false
            return
          }
        }
      } else {
        this.multiCheck = true
      }

      if (fillBlanks.length > 0) {
        for (var b = 0; b < fillBlanks.length; b++) {
          if (fillBlanks[b].name !== '') {
            this.blanksCheck = true
          } else {
            this.blanksCheck = false
            return
          }
        }
      } else {
        this.blanksCheck = true
      }

      if (multiBlanks.length > 0) {
        for (var q = 0; q < multiBlanks.length; q++) {
          if (multiBlanks[q].name !== '') {
            this.multiblanksCheck = true
          } else {
            this.multiblanksCheck = false
            return
          }
        }
      } else {
        this.multiblanksCheck = true
      }
    },
    // 删除
    deleteQuestionnaire(id) {
      deleteOneQuestionnaire(id)
        .then(response => {
          if (response.data.code === 0) {
            this.deleteVisiable = false
            this.req.pageNo = 1
            this.pageInfo.pageNo = 1
            this.searchByKeyWords(this.req)
            this.$message.success(response.data.message)
          } else {
            this.$message.error(response.data.message)
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 判断是否勾选了checkbox
    isSelectIds(ids) {
      if (ids.length === 0) {
        this.$message.error('未选择任何问卷！')
      } else {
        this.batchdeleteVisiable = true
      }
    },
    // 批量删除
    batchdeleteQuestionnaire(ids) {
      deleteQuestionnaires(ids)
        .then(response => {
          if (response.data.code === 0) {
            this.$message.success(response.data.message)
            this.batchdeleteVisiable = false
            this.req.pageNo = 1
            this.pageInfo.pageNo = 1
            this.searchByKeyWords(this.req)
          } else {
            this.$message.error(response.data.message)
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 判断问卷标题名是否为空
    checkTitleIsNullOrNot() {
      if (this.questionnaireName === '' || this.questionnaireName.split(' ').join('').length === 0) {
        this.$message.error('请先输入问卷标题！')
      } else {
        checkByQuestionnaireName(this.questionnaireName, '1')
          .then(res => {
            if (res.data && res.data.code === 0 && res.data.data.length > 0) {
              this.$message.error('已存在同名的问卷模板！')
              return
            } else {
              this.isMainPage = false
              this.isDetail = false
            }
          })
      }
    }
  },

  mounted() {
    this.searchByKeyWords(this.req)
  },

  watch: {},

  components: {},

  mixins: [],

  vuex: {},

  created() {}
}
</script>
