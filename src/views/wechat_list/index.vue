<template>
<div class="container wechat-list" @click="hideEmoji">
  <div style="height:100%;border:1px solid #ECECEC;">
    <el-container>
      <el-aside>
        <el-header>
          <b>最近联系人</b>
        </el-header>
        <el-menu 
        active-text-color="#409EFF" 
        :default-active="customerActive"
        style="overflow:auto;border-right:none;width:100%;background-color: #DEDEDE;text-align:left;" 
        >
          <div v-for="(item,index) in wechatCustomerInfos">
            <el-menu-item :index="index+''" slot="reference" @click="showNameAndSearchRecords(item.customerName,item.taskId,item.campaignId,item.customerId,item.unreadNum);dailTaskCustomer=item;customerActive=index.toString();changeCustomerTalking(index)">
              <span slot="title">{{item.customerName+'('+item.customerPhone+')'}}</span>
              <!-- 未读消息 div -->
              <div v-if="item.isTalking==false&&item.unreadNum>0" style="width:16px;height:16px;font-size:5px;line-height:16px;border-radius: 15px;text-align:center;background:red;color:#fff;float:right;margin-top:13px;padding-right:3px;">
                {{item.unreadNum}}
              </div>
            </el-menu-item>
          </div>
        </el-menu>
      </el-aside>

      <el-container style="width:48%;max-width:48%">
        <el-main style="background-color:#F5F5F5;padding:0;">
          <!-- 客户姓名div-->
          <div style="background-color:#F5F5F5;border-bottom:1px solid #E7E7E7;line-height:61px;height:61px;width:100%;text-align:left;font-size:20px;">
            <span style="margin-left:1%">
              {{customerName ? customerName : '暂无联系人'}}
            </span>
            <el-button style="float:right;margin-right:1.8%;margin-top:12px;" @click="toDialTask(dailTaskCustomer)">拨打电话</el-button>
          </div>

          <!-- 聊天记录 对话框 div -->
          <div id="short-message-content" style="position:relative;padding:10px;height: 595px;background-color:#F5F5F5;overflow-x:hidden" ref="refContentMessage">
            <!-- 点击加载更多div -->
            <div style="font-size:14px;color:#35ABE2" v-if="hasMoreRecords">
              <a @click="getChatRecords(customerId,queryPageNum);queryPageNum++;">查看更多消息</a>
            </div>
            <div v-for="(item,index) in wechatContents">
              <!-- 来自客户的消息 -->
              <el-row style="color:#737373;min-height: 5vh;;line-height:5vh;text-align:center;border-radius: 4px;font-size:14px;" v-if="item.direction=='0'">{{formatDateTime(item.createTime)}}</el-row>
              <el-row style="border-radius: 4px;text-align:left;word-break:break-all;" v-if="item.direction=='0'">
                <el-col :span="19" :offset="0">
                  <div>
                    <span class="el-icon-loading" v-if="item.code=='2'" style="margin-left:4px;line-height:40px;"></span>
                    <span class="el-icon-warning" v-if="item.code=='4'" style="margin-left:4px;line-height:40px;"></span>
                    <div v-if="item.msgType=='text'" style="line-height:26px;min-height:26px;color:#3A2424;padding:13px 10px 7px;background-color:#fff;float:left;border-radius: 4px" v-html="showMsgs(item.content)"></div>
                    <div v-if="item.msgType=='link'" style="min-height:40px;color:#3A2424;padding:10px;background-color:#fff;float:left;border-radius: 4px">
                      <a class="link" style="color:#4190E7;" @click="jump(item.content)">{{item.content}}</a>
                    </div>
                    <div v-if="item.msgType=='image'" style="width:220px;color:#3A2424;padding:10px;background-color:#fff;float:left;border-radius: 4px">
                      <img :src="item.mediaUrl" style="width:100%;cursor:pointer;" @click="imageDetailVisible=true;imgsrc=item.mediaUrl">
                    </div>
                    <div v-if="item.msgType=='voice'" style="color:#3A2424;padding:10px;background-color:#fff;float:left;border-radius: 4px">
                      <audio controls="controls" :src="item.mediaUrl"></audio>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <!-- 我发出的消息  -->
              <el-row style="color:#737373;min-height: 5vh;;line-height:5vh;text-align:center;border-radius: 4px;font-size:14px;" v-if="item.direction=='1'">{{formatDateTime(item.createTime)}}</el-row>
              <el-row v-if="item.direction=='1'" style="text-align:right;color:rgb(191, 191, 191);font-size:16px;">{{"坐席工号："+item.staffId}}</el-row>
              <el-row style="border-radius: 4px;text-align:left;word-break:break-all" v-if="item.direction=='1'">
                <el-col :span="19" :offset="5">
                  <div style="float:right">
                    <span class="el-icon-loading" v-if="item.code=='2'" style="margin-left:26px;line-height:40px;"></span>
                    <a class="el-icon-warning" v-if="item.code=='4'" @click="sendMessageAgainVisible=true;sendMessageAgain_Obj=item;sendMessageAgain_Index=index;" style="margin-left:26px;line-height:40px;"></a>
                    <div v-if="item.msgType=='text'" style="line-height:26px;min-height:26px;color:#3A2424;padding:13px 10px 7px;background-color:#fff;float:left;border-radius: 4px" v-html="showMsgs(item.content)"></div>
                    <div v-if="item.msgType=='file'" style="min-height:40px;color:#3A2424;padding:10px;background-color:#67c23a;float:right;border-radius: 4px">
                      <a class="link" style="color:#4190E7;" @click="jump(item.content)">{{decodeURI(item.content)}}</a>
                    </div>
                    <div v-if="item.msgType=='link'" style="min-height:40px;color:#3A2424;padding:10px;background-color:#67c23a;float:right;border-radius: 4px">
                      <a class="link" style="color:#4190E7;" @click="jump(item.content)">{{decodeURI(item.content)}}</a>
                    </div>
                    <div v-if="item.msgType=='image'" style="width:220px;color:#3A2424;padding:10px;background-color:#67c23a;float:right;border-radius: 4px">
                      <img :src="item.mediaUrl" style="width:100%;cursor:pointer;" @click="imageDetailVisible=true;imgsrc=item.mediaUrl">
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
	          <!-- 表情选择 -->
            <!-- <div v-if="showEmojis" style="position:absolute;top:1025px;left:0;background:#fff;width: 68%;box-shadow:1px 3px 8px 0 rgba(207, 212, 220, 0.3);" id="emoji_div">
              <el-tabs v-model="chooseEmojis" style="margin:0;margin-left:5px;">
                <el-tab-pane label="QQ表情" name="qq_face">
                  <emotion @emotion="handleEmotion" :height="230" ></emotion>
                </el-tab-pane>
                <el-tab-pane label="emoji表情" name="emoji_face">
                  <vue-emoji @select="handleEmotion1"></vue-emoji>
                </el-tab-pane>
              </el-tabs>
            </div> -->
          </div>
        </el-main>
        <!-- 是否重新发送消息dialog -->
          <el-dialog width="30%" title="操作提示" :visible.sync="sendMessageAgainVisible">
            <span style="font-size:15px;">是否重新发送消息？</span>
            <div slot="footer" class="dialog-footer" style="text-align: center;">
              <el-button type="primary" @click="sendMessageAgainVisible=false;sendMessageAgain(sendMessageAgain_Obj,sendMessageAgain_Index)">确定</el-button>
              <el-button @click="sendMessageAgainVisible = false">取消</el-button>
            </div>
          </el-dialog>

        <el-footer style="position:relative;border-top:1px solid #ECECEC;height:178px;background-color:#FFFFFF;padding:0;">
          <!-- 表情选择 -->
            <div v-if="showEmojis" style="line-height:0;position:absolute;top:-286px;left:0px;background:#fff;width: 80%;box-shadow:1px 3px 8px 0 rgba(207, 212, 220, 0.3);" id="emoji_div">
              <el-tabs v-model="chooseEmojis" style="margin:0;margin-left:5px;">
                <el-tab-pane label="QQ表情" name="qq_face">
                  <emotion @emotion="handleEmotion" :height="230" ></emotion>
                </el-tab-pane>
                <el-tab-pane label="emoji表情" name="emoji_face">
                  <vue-emoji @select="handleEmotion1"></vue-emoji>
                </el-tab-pane>
              </el-tabs>
            </div>
          <!-- 发送图片及录音 -->
          <div class="multi" style="color:#909399;line-height:0;height:35px;text-align:left;background:#fff;">
	        <a title="表情" class="select_emojis" href="javascript:;" @click="showEmojis=!showEmojis;chooseEmojis='qq_face'"></a>
            <el-upload
              class="upload-demo"
              ref="upload"
              :action="updateUrl"
              :http-request="uploadFile"
              :disabled="uploadDisabled"
              accept="image/*">
              <i slot="trigger" @click="checkCustomerName" class="el-icon-picture-outline" style="margin-left:10px;line-height:35px;font-size:30px;cursor:pointer;" title="发送图片"></i>
            </el-upload>
            <el-upload
              class="upload-demo"
              ref="upload"
              :action="updateUrl"
              :http-request="uploadFile"
              :disabled="uploadDisabled">
              <i slot="trigger" @click="checkCustomerName" style="margin-left:10px;line-height:35px;font-size:30px;cursor:pointer;" title="发送文件"><svg-icon icon-class="file" class="icon-size" style="width:27px;height:27px;vertical-align:-3px;"/></i>
            </el-upload>
            <!-- <i @click="recordingbtn" class="el-icon-service" style="margin-left:10px;line-height:35px;font-size:30px;cursor:pointer" title="录音"></i> -->
            <!-- <b @click="recVisible=true" style="margin-left:10px;line-height:35px;font-size:18px;color:#000;">录音时长:{{recTime}}s</b> -->
          </div>
          <!-- 编辑文本消息-->
          <div contenteditable="true" style="line-height:1;padding:3px 10px;overflow-x:hidden;text-align:left;height:103px;word-wrap:break-word;font-size:18px" ref="myMessages_div" @keyup.enter="sendMessage('text')">
          </div>
          <!-- 发送按钮div -->
          <div style="text-align:right;line-height:40px;z-index:999;width:100%;margin: 0px 0px" >
            <!-- <el-button v-if="recVisible&&!stoprecVisible" style="background:#F5F5F5;margin-right:10px;" @click="startRecording();recVisible=false;stoprecVisible=true">开始录音</el-button>
            <el-button v-if="stoprecVisible" style="background:#F5F5F5;margin-right:10px;" @click="stopRecording();">停止录音</el-button> -->
            <el-button style="background:#F5F5F5;margin-right:10px;" v-if="sendVisible" @click="sendMessage('text');recVisible=false;stoprecVisible=false">发送</el-button>
          </div>
        </el-footer>
      </el-container>

      <div class="elaside1"  style="overflow-x:hidden;background:#EDEDED;">
        <el-collapse v-model="activeNames">
          <!--  客户基本信息  -->
          <el-collapse-item name="1" style="text-align:left;">
            <template slot="title">
              <b style="margin-left:2%">基本信息<i class="el-icon-d-caret"></i></b>
            </template>
            <el-row :gutter="20">
              <el-col :span="5" style="text-align:center">
                <br/>
                <div>
                  <b v-text="customerInfo.customerName" style="font-size:18px"></b>
                </div><br/>
                <div>
                  <span v-text="customerInfo.mobile"></span>
                </div>
              </el-col>
              <el-col :span="3"></el-col>
              <el-col :span="8" v-if="!isRecruit">
                <br/>
              <div>
                <label>性别：</label><span v-text="showSex(customerInfo.sex)"></span>
              </div><br/>
              <div>
                <label>卡号：</label><span v-text="customerInfo.bankCard"></span>
              </div><br/>
              <div>
                <label>地址：</label><span v-text="customerInfo.resideAddress"></span>
              </div>
              </el-col>
              <el-col :span="8" v-if="isRecruit">
                <br/>
              <div>
                <label>性别：</label><span v-text="showSex(customerInfo.sex)"></span>
              </div><br/>
              <div>
                <label>来源：</label><span v-text="customerInfo.source"></span>
              </div><br/>
              <div>
                <label>备注：</label><span v-text="customerInfo.comment"></span>
              </div>
              </el-col>
              <el-col :span="8" v-if="!isRecruit">
                <br/>
                <div>
                <label>身份证：</label><span v-text="customerInfo.idNumber"></span>
              </div><br/>
              <div>
                <label>持卡类型：</label><span v-text="customerInfo.bankCardType"></span>
              </div>
              </el-col>
              <el-col :span="8" v-if="isRecruit">
                <br/>
                <div>
                <label>身份证：</label><span v-text="customerInfo.idNumber"></span>
              </div><br/>
              <div>
                <label>地址：</label><span v-text="customerInfo.resideAddress"></span>
              </div>
              </el-col>
            </el-row>
          </el-collapse-item>

          <!--  客户接触信息  -->
          <el-collapse-item name="2" style="text-align:left;">
            <template slot="title">
              <b style="margin-left:2%">接触记录<i class="el-icon-d-caret"></i></b>
            </template>
            <el-table
            :data="contactRecord"
            border>
              <el-table-column align="center" label="序号" width="55">
                <template slot-scope="scope">
                  <div>{{scope.$index + 1}}</div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="记录编号" width="170" prop="recordId">
              </el-table-column>
              <el-table-column align="center" label="任务小结" width="">
                <template slot-scope="scope">
                  <div v-html="showSummarys(scope.row.summaryDetailInfos)"></div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="小结备注" width="" >
                <template slot-scope="scope">
                  <div v-html="showDescription(scope.row.description)"></div>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>

           <!--  产品信息  -->
          <el-collapse-item name="3" style="text-align:left;">
            <template slot="title">
              <b style="margin-left:2%">产品信息<i class="el-icon-d-caret"></i></b>
            </template>
            <div>
            <el-tabs v-model="activeTab" type="border-card" @tab-click="">
              <!--
                v-if="this.productInfo.some(i => i=== this.car_insurance)"
                v-if="this.productInfo.some(i => i === this.child_insurance)"
                v-if="this.productInfo.some(i => i=== this.disease_insurance)"
                -->
              <el-tab-pane 
               v-for="(item,index) in products" 
               :label="item.productName">
                <div class="text item" hidden>模板类型id：<font style="color:blue;size:14px;font-weight:bold">{{item.productTypeInfo===null?'':item.productTypeInfo.productTypeId}}</font></div>
                <div class="text item">模板类型：<font style="color:blue;size:14px;font-weight:bold">{{item.productTypeInfo===null?'':item.productTypeInfo.productTypeName}}</font></div>
                <div class="text item">模板编号：<font style="color:blue;size:14px;font-weight:bold">{{item.templateId}}</font></div>
                <div class="text item">模板名称：<font style="color:blue;size:14px;font-weight:bold">{{item.productName}}</font></div>
                <div class="text item">产品单价：<font style="color:red;font-weight:bold">￥&nbsp;</font><font style="color:blue;font-weight:bold">{{item.price===null?0:item.price}}</font></div>
                <div class="text item">产品概述：{{item.description}}</div>
                <div v-if="item.showMessage"><font style="color:blue">Tips:以下带</font><font style="color:red">*</font><font style="color:blue">的为必填项</font></div>
                <el-form  class="text item" >
                  <!-- <div v-for="(i,index1) in item.propertyInfos"> -->
                    <el-form-item  v-for="(i,index1) in item.propertyInfos" 
                      :label="i.propertyName + '：'" style="display:inline"   
                      :rules="{required:i.showOrInput === '1' && i.isRequired === '1', message: '此项为必填项', trigger: 'change' }">
                      <span v-if="i.showOrInput === '0' && i.templateType !== 'textarea'">{{i.propertyValue}}</span>
                      <textarea v-if="i.showOrInput === '0' && i.templateType === 'textarea'" readonly>{{i.propertyValue}}</textarea>
                      <textarea v-if="i.showOrInput === '1' && i.templateType === 'textarea'" 
                        v-model="i.propertyValue" :placeholder="'限长' + i.propertyLength + '字符'">{{i.propertyValue}}</textarea>
                      <input v-if="i.templateType === 'text' && i.showOrInput === '1'" 
                        v-model="i.propertyValue" :placeholder="'限长' + i.propertyLength + '字符'" :maxlength="i.propertyLength"  ></input>
                      <el-radio-group size="mini" v-if="i.templateType === 'radio' && i.showOrInput === '1' && i.showInLine" 
                        v-model="i.propertyValueRadio">
                        <el-radio-button v-for="a in JSON.parse(i.propertyValue)" :label="a">{{a}}</el-radio-button>
                      </el-radio-group>
                      <el-radio-group size="mini" v-if="i.templateType === 'radio' && i.showOrInput === '1' && !i.showInLine" 
                        v-model="i.propertyValueRadio">
                        <el-radio v-for="a in JSON.parse(i.propertyValue)" :label="a">{{a}}</el-radio>
                      </el-radio-group>
                      <el-checkbox-group  size="mini"  v-if="i.templateType === 'checkbox' && i.showOrInput === '1'  && i.showInLine" 
                        v-model="checks[index1]" @change="getCheckes(checks[index1],i)">
                        <el-checkbox-button   v-for="b in JSON.parse(i.propertyValue)"  :label="b">{{b}}</el-checkbox-button>
                      </el-checkbox-group>
                      <el-checkbox-group  size="mini"  v-if="i.templateType === 'checkbox' && i.showOrInput === '1' && !i.showInLine" 
                        v-model="checks[index1]" @change="getCheckes(checks[index1],i)">
                        <el-checkbox v-for="b in JSON.parse(i.propertyValue)"  :label="b">{{b}}</el-checkbox>
                      </el-checkbox-group>
                      <el-select   size="mini" v-model="i.propertyValueSelect" placeholder="请选择" 
                        v-if="i.templateType === 'select' && i.showOrInput === '1'">
                        <el-option
                          v-for="s in JSON.parse(i.propertyValue)"
                          :label="s"
                          :value="s">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  <!-- </div> -->
                </el-form>
                    
                <div style="width:25%;float:right">
                  <span>认购数量：</span>
                  <el-input-number v-model="item.number" @change="handleChange(item.templateId,item.price,item.number)" :min="0" :max="1000" label="认购数量" size="mini">
                      {{item.number}}
                  </el-input-number>
                </div>
              </el-tab-pane>
            </el-tabs>
            <div style="width:50%;float:left">
              <label>客户留言:</label><el-input placeholder="有特别要求请注明，限100字符" maxlength="100" style="width:80%" v-model="customerNote"></el-input>
            </div>
            <div style="width:50%;float:right">
              <label>选购清单：</label>
              <el-card shadow="hover" v-for="(item,index) in products">
                  <div style="margin-left:5%;color:blue;font-weight:700;font-size:14px">{{item.productName}}</div>
                  <div style="color:blue;font-weight:bold;text-align:right">
                    {{(typeof item.price==='undefined'||item.price===null)?0:item.price}}
                    <span style="color:red;font-weight:bold;margin:0 3%">*</span>
                    <el-input-number v-model="item.number" @change="handleChange(item.templateId,item.price,item.number)" :min="0" :max="1000" label="预购数量" size="mini">
                      {{item.number}}
                    </el-input-number>
                    <span style="color:black;margin:0 2%">=</span>
                    <span v-model="item.sum">{{item.price * item.number ? (item.price * item.number).toFixed(2) : 0 }}</span>
                  </div>
              </el-card>
              <div style="color:blue;font-weight:bold;text-align:left;width:20%;float:right">
                <label>总价：</label><font style="color:red;font-weight:bold">￥ {{sumTotal}}&nbsp;</font>
              </div>
            </div>
          </div>
          </el-collapse-item>

           <!--  任务状态  -->
          <el-collapse-item name="4" style="text-align:left;">
            <template slot="title">
              <b style="margin-left:2%">任务状态<i class="el-icon-d-caret"></i></b>
            </template>

            <div>
              <el-row :gutter="20">
                <el-col :span="24">
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <el-radio v-model="taskRadio" label="2" name="2" border @change="setSendMessage(taskRadio)"><span style="color:#67C23A">成功</span></el-radio>
                  <el-radio v-model="taskRadio" label="3" name="3" border @change="setSendMessage(taskRadio)"><span style="color:#F56C6C">失败</span></el-radio>
                  <el-radio v-model="taskRadio" label="1" name="1" border @change="setSendMessage(taskRadio)" v-show="isLastContactTime===false"><span style="color:#409EFF">预约</span></el-radio>
                </el-col><br/><br/><br/>
                <div :span="4" v-show="this.taskRadio === '1'">
                  <div style="margin-left:3%">
                    <span style="color:#F56C6C">*</span>请选择预约时间：
                    <span><b>T + </b></span>
                    <el-input style="width:100px" type="text" v-model="addDays"
                    onkeyup="if(! /^d+$/.test(this.addDays)){this.addDays='';}"></el-input>
                    <el-date-picker
                      v-model="appointTime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      default-time="00:00:00"
                      type="datetime" style="width:55%">
                    </el-date-picker>
                  </div>
                </div>
              </el-row>
            </div>

          </el-collapse-item>

           <!--  任务小结  -->
          <el-collapse-item name="5" style="text-align:left;">
            <template slot="title">
              <b style="margin-left:2%">小结与备注<i class="el-icon-d-caret"></i></b>
            </template>
            <div>
              <b>任务小结：</b>
              <!-- @check-change="sendSummaryId" @node-click="checkOrNot" <el-tree :data="nodulesTree" show-checkbox lazy :props="summaryTreeProps" empty-text="该拨打任务暂无小结" :load="loadNodes"></el-tree> -->
              <el-tree :data="nodulesTree" @check-change="sendSummaryId" show-checkbox default-expand-all node-key="id" ref="tree" highlight-current :props="summaryTreeProps" empty-text="暂无小结"></el-tree>
            </div>
            <div>
              <b>小结备注：</b>
              <el-input type="textarea" v-model="summary_description" rows="3">/</el-input>
            </div>
          </el-collapse-item>
        </el-collapse>
        <div style="text-align:center"><br/>
          <!-- <el-checkbox v-if="showAutoDial===true" checked="checked" v-model="autoDialNext">完成后显示下一个客户</el-checkbox> -->
          <el-checkbox v-if="showSendMessage === true && campaignType !== 'RECRUIT'" v-model="sendMessageOrNot" checked="checked">发送支付短信</el-checkbox>
          <el-button type="success" size="small"  @click="completeTask()">完成</el-button>
        </div>
      </div>
    </el-container>
  </div>
  <el-dialog
      width="30%"
      title="发送图片确认"
      :visible.sync="imageVisible"
      :before-close="beforeImageDialog"
      append-to-body>
      <div v-if="imgsrc">
        <img style="width:100%" :src="imgsrc">
      </div>
    <div slot="footer" class="dialog-footer" style="text-align: right;">
      <el-button @click="imageVisible = false;sendVisible=true;removeFile()">取 消</el-button>
      <el-button type="primary" @click="imageVisible = false;sendVisible=true;sendMessage('image')">确 定</el-button>
    </div>
  </el-dialog>
  <el-dialog
      width="30%"
      title="发送文件确认"
      :visible.sync="fileVisible"
      :before-close="beforeImageDialog"
      append-to-body>
      <div v-if="fileSrc">
        <div>
          <span>{{"文件："+fileName}}</span>
        </div>
        <div>
          <span>{{"大小："+fileSize}}</span>
          <a :href="fileSrc" :download="fileName" style="color:#4190E7;">下载</a>
        </div>
        
      </div>
    <div slot="footer" class="dialog-footer" style="text-align: right;">
      <el-button @click="fileVisible = false;sendVisible=true;removeFile()">取 消</el-button>
      <el-button type="primary" @click="fileVisible = false;sendVisible=true;sendMessage('file')">确 定</el-button>
    </div>
  </el-dialog>
  <el-dialog
      width="30%"
      :visible.sync="imageDetailVisible"
      :before-close="beforeImageDialog"
      append-to-body>
      <div v-if="imgsrc">
        <img style="width:100%" :src="imgsrc">
      </div>
    <div slot="footer" class="dialog-footer" style="text-align: right;">
      <el-button type="primary" @click="imageDetailVisible = false;">确 定</el-button>
    </div>
  </el-dialog>
</div>

</template>

<style lang='scss' scoped>

</style>

<style lang='scss'>

.wechat-list{
  .el-container{
    height:100%;
  }
  .el-aside {
    background-color: #EDEDED;
    color: #333;
    text-align: center;
    width:220px !important;
    height:834px;
    li{
      line-height: 40px;
      height: 40px;
      padding-right:4px;
    } 
  }
  .elaside1 {
    width: 41%;
    color: #333;
    text-align: center;
    height:834px;
  }
  .el-menu-item:hover {
    background:#DAD9D9;
  }
  .el-menu-item:focus{
    background:#C3C3C4;
  }
  .el-menu-item.is-active{
    background:#C3C3C4;
  }
  .el-main {
    color: #333;
    text-align: center;
  }
  .el-header,.el-footer {
    background-color: #DBD9D8;
    color: #333;
    text-align: center;
    height: 500px;
    line-height: 65px;
  }
  .multi i:hover{ 
    color:#000;
  }
  .multi{
    i{
      color:rgb(144, 147, 153);
    }
    .upload-demo{
      display:inline-block;
    }
    .el-upload-list{
      display:none;
    }
  }
}
.select_emojis {
  width: 30px;
  height: 30px;
  padding:12px 15px;
  background:url(../../../static/images/my_imgs/select_face.png) no-repeat -404px -398px;
  background-size: 487px 462px;
  margin-left:10px;
}


</style>


<script>
import {
  clone,
  formatDateTime,
  uploading
} from '@/utils/tools' // 格式化时间
import { queryTaskByTaskId } from '@/api/contact_record_dail'
import {
  getUploadInfo,
  delUpload
} from '@/api/public_request'
import {
  queryCustomerInfo,
  queryContactRecord,
  queryContactRecordByTaskIdandStatus,
  getCampaignType,
  hasOrderInfos,
  getProducts,
  getSummaries,
  sendMsgTo,
  queryRecords,
  generateRecordId,
  batchCreatProduct,
  addMoreOrder,
  sendMessageToCustomer,
  updateTaskStatus,
  updateRecordInfo,
  changeRecords,
  getWechatCustomer,
  getUnreadNum
} from '@/api/wechat_list' // 接口
import { navbarQueryRecords } from '@/api/navbar'
import getDynamicRouter from '@/router/dynamic-router'
import Emotion from '@/components/Emotion1/index'
import vueEmoji from '@/components/Emotion3/emoji.vue'
import emojidata from '@/components/Emotion3/emoji-data.js'
import reg_emoji from '@/components/Emotion3/reg_emojis.js'
var vm = null
export default {
  name: 'wechat_list1',
  data() {
    return {
      emojidata: emojidata,
      reg_emojis: reg_emoji,
      finalContent: '',
      showEmojis: false, // 是否显示出表情的div
      chooseEmojis: 'qq_face', // 显示表情的tabs
      sessionId: '',
      queryPageNum: 2,
      hasMoreRecords: false, // 判断是否有更多记录 是否需要显示loading按钮
      sendMessageAgainVisible: false, // 是否重新发送dialog
      sendMessageAgain_Obj: null, //
      sendMessageAgain_Index: '', //
      sendVisible: true,
      imageVisible: false,
      fileVisible: false,
      imageDetailVisible: false,
      recordingVisible: false,
      uploadDisabled: false,
      uploadInfoReq: {
        bucketName: 'crm',
        objectName: ''
      },
      imgsrc: '',
      fileName: '',
      fileSize: '',
      fileSrc: '',
      DLurl: [],
      updateUrl: '',
      timeStamp: null,
      contents: this.$store.state.app.wechat_contents, // 聊天记录
      customerInfos: [], // 缓存中的客户数据
      nodulesTree: [], // 需要展示的小结树 数据
      summaryTreeProps: {
        children: 'summaryDetailInfos',
        label: 'name',
        id: 'id'
      },
      showSendMessage: false, // 是否展示发送支付短信
      sendMessageOrNot: true, //  发送支付短信checkbox
      campaignType: '', // 活动类型
      hasProductInfo: false, // 是否有产品的标志
      selectedSummarys: [], // 选中的小结id
      summary_description: '', // 小结备注
      addDays: '', // 预约时间添加的天数
      isLastContactTime: false, // 判断是否是最后一次拨打次数
      appointTime: '', // 预约时间
      taskRadio: '', // 任务状态
      customerName: '', // 对话框中客户姓名
      myMessages: '', // 发送的消息
      activeTab: '', // 产品展示项
      products: [], // 活动下的产品
      customerNote: '', // 客户留言
      sumTotal: 0, // 总价格
      sumInfo: new Map(), // 所选中的产品
      checks: {},
      taskId: '',
      campaignId: '',
      customerId: '',
      customerPhone: '',
      isRecruit: false, // 活动类型的判断
      customerInfo: {}, // 客户基本信息
      contactRecord: [], // 接触记录信息
      activeNames: ['1'], // 折叠板默认打开项
      msgIds: [],
      dailTaskCustomer: {},
      customerActive: null,
      unicoded_qq_face: ['/::)', '/::~', '/::B', '/::|', '/:8-)', '/::<', '/::$', '/::X', '/::Z', "/::'(", '/::-|', '/::@', '/::P', '/::D', '/::O', '/::(', '/::+', '[囧]', '/::Q', '/::T', '/:,@P', '/:,@-D', '/::d', '/:,@o', '/::g', '/:|-)', '/::!', '/::L', '/::>', '/::,@', '/:,@f', '/::-S', '/:?', '/:,@x', '/:,@@', '/::8', '/:,@!', '/:!!!', '/:xx', '/:bye', '/:wipe', '/:dig', '/:handclap', '/:&-(', '/:B-)', '/:<@', '/:@>', '/::-O', '/:>-|', '/:P-(', "/::'|", '/:X-)', '/::*', '/:@x', '/:8*', '/:pd', '/:<W>', '/:beer', '/:basketb', '/:oo', '/:coffee', '/:eat', '/:pig', '/:rose', '/:fade', '/:showlove', '/:heart', '/:break', '/:cake', '/:li', '/:bome', '/:kn', '/:footb', '/:ladybug', '/:shit', '/:moon', '/:sun', '/:gift', '/:hug', '/:strong', '/:weak', '/:share', '/:v', '/:@)', '/:jj', '/:@@', '/:bad', '/:lvu', '/:no', '/:ok', '/:love', '/:<L>', '/:jump', '/:shake', '/:<O>', '/:circle', '/:kotow', '/:turn', '/:skip', '[挥手]', '/:#-0', '/:hiphot', '/:<&', '/:&>'],
      unicoded_emoji_face: ['0x1f600', '0x1f601', '0x1f602', '0x1f923', '0x1f603', '0x1f604', '0x1f605', '0x1f606', '0x1f609', '0x1f60a', '0x1f60b', '0x1f60e', '0x1f60d', '0x1f618', '0x1f617', '0x1f619', '0x1f61a', '0x263a', '0x1f642', '0x1f917', '0x1f914', '0x1f610', '0x1f611', '0x1f636', '0x1f644', '0x1f60f', '0x1f623', '0x1f625', '0x1f62e', '0x1f910', '0x1f62f', '0x1f62a', '0x1f62b', '0x1f634', '0x1f60c', '0x1f61b', '0x1f61c', '0x1f61d', '0x1f924', '0x1f6120', '0x1f613', '0x1f614', '0x1f615', '0x1f643', '0x1f911', '0x1f632', '0x2639', '0x1f641', '0x1f616', '0x1f61e', '0x1f61f', '0x1f624', '0x1f622', '0x1f62d', '0x1f626', '0x1f627', '0x1f628', '0x1f629', '0x1f62c', '0x1f630', '0x1f631', '0x1f633', '0x1f635', '0x1f621', '0x1f620', '0x1f637', '0x1f912', '0x1f915', '0x1f922', '0x1f927', '0x1f607', '0x1f920', '0x1f921', '0x1f925', '0x1f913', '0x1f608', '0x1f47f', '0x1f479', '0x1f47a', '0x1f480', '0x1f47b', '0x1f47d', '0x1f916', '0x1f4a9', '0x1f63a', '0x1f638', '0x1f639', '0x1f63b', '0x1f63c', '0x1f63d', '0x1f640', '0x1f63f', '0x1f63e', '0x1f3fb', '0x1f3fc', '0x1f3fd', '0x1f3fe', '0x1f3ff', '0x1f5e3', '0x1f464', '0x1f465', '0x1f46b', '0x1f46c', '0x1f46d', '0x1f442', '0x1f442 0x1f3fb', '0x1f442 0x1f3fc', '0x1f442 0x1f3fd', '0x1f442 0x1f3fe', '0x1f442 0x1f3ff', '0x1f443', '0x1f443 0x1f3fb', '0x1f443 0x1f3fc', '0x1f443 0x1f3fd', '0x1f443 0x1f3fe', '0x1f443 0x1f3ff', '0x1f463', '0x1f440', '0x1f441', '0x1f445', '0x1f444', '0x1f48b', '0x1f453', '0x1f576', '0x1f454', '0x1f455', '0x1f456', '0x1f457', '0x1f458', '0x1f459', '0x1f45a', '0x1f45b', '0x1f45c', '0x1f45d', '0x1f392', '0x1f45e', '0x1f45f', '0x1f460', '0x1f461', '0x1f462', '0x1f451', '0x1f452', '0x1f3a9', '0x1f393', '0x26d1', '0x1f484', '0x1f48d', '0x1f302', '0x1f4bc']
    }
  },
  components: {
    Emotion,
    vueEmoji
  },
  computed: {
    wechatContents() {
      return this.$store.state.app.wechat_contents
    },
    wechatCustomerInfos() {
      return this.$store.state.app.wechat_customerInfos
    }
  },
  methods: {
    hideEmoji(e) {
      var emoji_div = document.getElementById('emoji_div')
      if (emoji_div) {
        if (!emoji_div.contains(e.target)) {
          this.showEmojis = false
        }
      }
    },
    showMsgs(content) {
      const qq_reg = "(/::\\)|/::~|\\[囧\\]|\\[挥手\\]|/::B|/::\\||/:8-\\)|/::<|/::\\$|/::X|/::Z|/::'\\(|/::-\\||/::@|/::P|/::D|/::O|/::\\(|/::\\+|/:--b|/::Q|/::T|/:,@P|/:,@-D|/::d|/:,@o|/::g|/:\\|-\\)|/::!|/::L|/::>|/::,@|/:,@f|/::-S|/:\\?|/:,@x|/:,@@|/::8|/:,@!|/:!!!|/:xx|/:bye|/:wipe|/:dig|/:handclap|/:&-\\(|/:B-\\)|/:<@|/:@>|/::-O|/:>-\\||/:P-\\(|/::'\\||/:X-\\)|/::\\*|/:@x|/:8\\*|/:pd|/:<W>|/:beer|/:basketb|/:oo|/:coffee|/:eat|/:pig|/:rose|/:fade|/:showlove|/:heart|/:break|/:cake|/:li|/:bome|/:kn|/:footb|/:ladybug|/:shit|/:moon|/:sun|/:gift|/:hug|/:strong|/:weak|/:share|/:v|/:@\\)|/:jj|/:@@|/:bad|/:lvu|/:no|/:ok|/:love|/:<L>|/:jump|/:shake|/:<O>|/:circle|/:kotow|/:turn|/:skip|/:oY|/:\\#-0|/:hiphot|/:kiss|/:<&|/:&>)"
      const emoji_reg = this.reg_emojis
      var array = ''
      while ((array = content.match(qq_reg)) !== null) {
        const index = this.unicoded_qq_face.indexOf(array[0])
        content = content.replace(new RegExp(qq_reg), "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/" + index + ".gif' align='middle' width='26px' height='26px'>")
      }
      while ((array = content.match(emoji_reg)) !== null) {
        content = content.replace(new RegExp(emoji_reg), this.emoji1(array[0]))
      }
      content = content.replace(/(\r\n)|(\n)/g, '<br>')
      // console.log(content)
      return content
    },
    handleEmotion(i) {
      this.showEmojis = false
      this.$refs.myMessages_div.innerHTML += this.emotion(i)
    },
    handleEmotion1(i) {
      this.showEmojis = false
      this.$refs.myMessages_div.innerHTML += this.emoji(i)
    },
    htmlspecialchars_decode(str) {
      str = str.replace(/&amp;/g, '&')
      str = str.replace(/&lt;/g, '<')
      str = str.replace(/&gt;/g, '>')
      str = str.replace(/&quot;/g, "''")
      str = str.replace(/&#039;/g, "'")
      return str
    },
    // 将匹配结果替换QQ表情图片
    emotion(res) {
      const word = res.replace(/\#/, '').replace(/\;/, '')
      const index = this.unicoded_qq_face.indexOf(word)
      return `<img src="https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/${index}.gif" align="middle" width="26px" height="26px" alt="` + word + `">`
    },
    // 将匹配结果替换emoji
    emotion1(res) {
      const word = res.replace(/\#|\;/gi, '')
      const imgName = this.showData(word)
      return `<img src="../../../static/emoji/` + imgName + `" align="middle" width='26px' height='26px' alt="` + this.findKey(this.emojiData, imgName) + `">`
    },
    // loading
    openFullScreen() {
      this.loading = this.$loading({
        lock: true,
        text: '上传中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      setTimeout(() => {
        this.loading.close()
      }, 3000)
    },
    // 完成任务
    completeTask() {
      if (this.taskRadio === '') {
        this.$message.error('未选择任务状态！')
        return false
      } else if (this.taskRadio === '1' && this.appointTime === '') {
        this.$message.error('未选择预约时间！')
        return false
      } else if (
        this.taskRadio === '1' &&
        this.appointTime < formatDateTime(new Date())
      ) {
        this.$message.error('预约时间不能小于当前时间！')
        return false
      } else if (this.selectedSummarys.length === 0) {
        this.$message.error('未选择任务小结！')
        return false
      } else {
        // 生成完整接触记录及小结
        // 判断任务状态taskRadio  2：成功 3：失败  1：预约
        if (this.taskRadio === '2' && this.campaignType !== 'RECRUIT') {
          if (this.sumTotal < 0) {
            this.$message.error('未选择预购产品！')
            return false
          }
          const createInfo = {}
          createInfo.campaignId = this.campaignId // 活动id
          createInfo.taskId = this.taskId // 任务id
          createInfo.description = this.customerNote // 客户留言

          createInfo.customerId = this.customerId // 客户id
          createInfo.customerName = this.customerInfo.customerName // 客户姓名
          createInfo.customerPhone = this.customerPhone // 客户手机

          createInfo.totalAmount = this.sumTotal
          // 创建产品逻辑
          const productTempInfo = []

          let flag = true // 默认校验正确

          for (let j = 0; j < this.products.length; j++) {
            if (this.products[j].number > 0 && this.products[j].propertyInfos !== null) {
              const propertyInfos = this.products[j].propertyInfos

              for (let k = 0; k < propertyInfos.length; k++) {
                if (propertyInfos[k].isRequired === '1' && propertyInfos[k].showOrInput === '1') {
                  switch (propertyInfos[k].templateType) {
                    case 'text':
                      if (propertyInfos[k].propertyValue === '') {
                        flag = false
                        this.$message.error('预购订单还有必填项：' + propertyInfos[k].propertyName + '没有完成')
                        return
                      }
                      break
                    case 'input':
                      if (propertyInfos[k].propertyValue === '') {
                        flag = false
                        this.$message.error('预购订单还有必填项：' + propertyInfos[k].propertyName + '没有完成')
                        return
                      }
                      break
                    case 'radio':
                      if (typeof propertyInfos[k].propertyValueRadio === 'undefined' || propertyInfos[k].propertyValueRadio === '') {
                        flag = false
                        this.$message.error('预购订单还有必填项：' + propertyInfos[k].propertyName + '没有完成')
                        return
                      }
                      break
                    case 'select':
                      if (typeof propertyInfos[k].propertyValueSelect === 'undefined' || propertyInfos[k].propertyValueSelect === '') {
                        flag = false
                        this.$message.error('预购订单还有必填项：' + propertyInfos[k].propertyName + '没有完成')
                        return
                      }
                      break
                    case 'checkbox':
                      if (typeof propertyInfos[k].propertyValueCheckbox === 'undefined' || propertyInfos[k].propertyValueCheckbox === '') {
                        flag = false
                        this.$message.error('预购订单还有必填项：' + propertyInfos[k].propertyName + '没有完成')
                        return
                      }
                      break
                    case 'textarea':
                      if (propertyInfos[k].propertyValue === '') {
                        flag = false
                        this.$message.error('预购订单还有必填项：' + propertyInfos[k].propertyName + '没有完成')
                        return
                      }
                      break
                    default:
                      if (propertyInfos[k].propertyValue === '') {
                        flag = false
                        this.$message.error('预购订单还有必填项：' + propertyInfos[k].propertyName + '  没有完成')
                        return
                      }
                      break
                  }
                }
              }
            }
          }
          if (flag) {
            for (let i = 0; i < this.products.length; i++) {
              if (this.products[i].number > 0) {
                const productInfo = this.products[i]
                const result = {}
                result.description = productInfo.description
                result.price = productInfo.price
                result.number = productInfo.number
                result.productName = productInfo.productName
                result.productTypeId = productInfo.productTypeInfo.productTypeId
                result.productTypeName = productInfo.productTypeInfo.productTypeName
                result.status = productInfo.status
                // 回复选择情况
                const propertyInfos = []
                if (productInfo.propertyInfos !== null && productInfo.propertyInfos.length > 0) {
                  for (let j = 0; j < productInfo.propertyInfos.length; j++) {
                    const obj = productInfo.propertyInfos[j]
                    const propertyInfo = {}
                    propertyInfo.isRequired = obj.isRequired
                    propertyInfo.mark = obj.mark
                    propertyInfo.propertyKey = obj.propertyKey
                    propertyInfo.propertyLength = obj.propertyLength
                    propertyInfo.propertyName = obj.propertyName
                    propertyInfo.propertyType = obj.propertyType
                    switch (obj.templateType) {
                      case 'radio':
                        propertyInfo.propertyValue = obj.propertyValueRadio
                        break
                      case 'checkbox':
                        if (typeof obj.propertyValueCheckbox !== 'undefined' && obj.propertyValueCheckbox !== '') {
                          propertyInfo.propertyValue = '[' + obj.propertyValueCheckbox.join(',') + ']'
                        } else {
                          propertyInfo.propertyValue = '[]'
                        }
                        break
                      case 'select':
                        propertyInfo.propertyValue = obj.propertyValueSelect
                        break
                      default:
                        propertyInfo.propertyValue = obj.propertyValue
                        break
                    }
                    propertyInfo.showOrInput = obj.showOrInput
                    propertyInfo.sort = obj.sort
                    propertyInfo.templateType = obj.templateType
                    propertyInfos.push(propertyInfo)
                  }
                }
                result.propertyInfos = propertyInfos
                productTempInfo.push(result)
              }
            }
            // 请求后台处理创建订单
            batchCreatProduct(productTempInfo).then(res => {
              if (res.data.code === 0) {
                for (let a = 0; a < productTempInfo.length; a++) {
                  productTempInfo[a].productId = res.data.data[a]
                }
                // 拼接订单信息
                const productInfos = []
                for (let b = 0; b < productTempInfo.length; b++) {
                  const productInfo = {}
                  productInfo.productId = productTempInfo[b].productId
                  productInfo.productName = productTempInfo[b].productName
                  productInfo.productNum = productTempInfo[b].number
                  productInfo.productTypeId = productTempInfo[b].productTypeId
                  productInfo.productTypeName = productTempInfo[b].productTypeName
                  productInfos.push(productInfo)
                }
                createInfo.productInfos = productInfos
                // 生成订单逻辑
                addMoreOrder(createInfo).then(response => {
                  if (response.data.code === 0) {
                    vm.customerNote = ''
                    vm.products = []
                    vm.sumTotal = 0
                    vm.sumInfo = new Map()
                    // 成功生成订单 判断是否发送短信
                    if (this.sendMessage === true) {
                      sendMessageToCustomer(
                        response.data.data,
                        this.customerInfo.mobile
                      )
                    }
                    this.$message({
                      message: response.data.message,
                      type: 'success'
                    })
                    sessionStorage.removeItem('isDialTask')
                    sessionStorage.removeItem('recordId')
                  } else {
                    this.$message({
                      message: response.data.message,
                      type: 'error'
                    })
                    return
                  }
                })
              } else {
                this.$message.error(res.data.message)
                return
              }
            })
          } else {
            this.$message.error('订单还有未填的必填项')
            return
          }
        }
        // 选择失败、预约 或 成功但没有产品(如招聘)的情况
        // 修改任务状态
        updateTaskStatus(this.taskId, this.taskRadio, this.appointTime).then(response => {
          if (response.data.code === 0) {
            // console.log('成功修改任务状态')
            // 修改小结备注
            updateRecordInfo(this.sessionId, this.taskRadio, this.selectedSummarys, this.summary_description)
              .then(response1 => {
                if (response1.data.code === 0) {
                  // console.log('成功修改小结')
                  // 将数组中的该客户移除 并更新缓存
                  for (var i = 0; i < this.customerInfos.length; i++) {
                    if (this.customerInfos[i].taskId === this.taskId) {
                      this.customerInfos.splice(i, 1)
                    }
                  }
                  localStorage.setItem('customerInfos', JSON.stringify(this.customerInfos))

                  // 判断数组中还有无客户 有就展示下一个的信息
                  if (this.customerInfos.length > 0) {
                    // 说明还有客户
                    this.taskId = ''
                    this.customerName = ''
                    this.campaignId = ''
                    this.customerId = ''
                    this.customerPhone = ''
                    this.contents = []
                    this.customerInfo = {}
                    this.contactRecord = []
                    this.taskRadio = ''
                    this.appointTime = ''
                    this.selectedSummarys = []
                    this.nodulesTree = []
                    this.summary_description = ''
                    this.hasMoreRecords = false
                    this.showNameAndSearchRecords(this.customerInfos[0].customerName, this.customerInfos[0].taskId, this.customerInfos[0].campaignId, this.customerInfos[0].customerId, this.customerInfos[0].unreadNum)
                  } else {
                    // 无客户 清空当前页面的聊天记录 客户信息等
                    this.taskId = ''
                    this.customerName = ''
                    this.campaignId = ''
                    this.customerId = ''
                    this.customerPhone = ''
                    this.contents = []
                    this.customerInfo = {}
                    this.contactRecord = []
                    this.taskRadio = ''
                    this.appointTime = ''
                    this.selectedSummarys = []
                    this.nodulesTree = []
                    this.summary_description = ''
                    this.hasMoreRecords = false
                  }
                  window.location.href = window.location.href.split('?')[0]
                }
              })
          }
        })
      }
    },
    handleChange(templateId, price, number) {
      this.sumInfo.set(templateId, { price: price, number: number })
      this.sumTotal = 0
      this.sumInfo.forEach((val, key) => {
        if (val !== null && typeof val.price !== 'undefined') {
          this.sumTotal += parseFloat(val.price === null ? 0 : val.price) * parseInt(val.number === null ? 0 : val.number)
        }
      })
      this.sumTotal = this.sumTotal.toFixed(2)
    },
    // 时间戳转年月日时分秒
    formatDateTime: formatDateTime,
    // 接听时间补无
    showAnswerTime(answerTime) {
      if (answerTime) {
        return answerTime
      } else {
        return '无'
      }
    },
    showCallDirection(callDirection) {
      if (callDirection === '0') {
        return '呼出'
      } else {
        return '呼入'
      }
    },
    // 小结备注补无
    showDescription(description) {
      if (description) {
        return description
      } else {
        return '无'
      }
    },
    // 显示小结
    showSummarys(summarys) {
      if (summarys.length === 0) {
        return '无'
      } else {
        let summaryNames = ''
        for (var i = 0; i < summarys.length; i++) {
          summaryNames += summarys[i].name + '/'
        }
        summaryNames = summaryNames.substr(0, summaryNames.length - 1)
        return summaryNames
      }
    },
    // 发送消息
    sendMessage(type) {
      var word = this.$refs.myMessages_div.innerHTML.replace(new RegExp(/&nbsp;/g), ' ').replace(/<br>/g, '\n').replace(/<div(([\s\S])*?)<\/div>/g, '')
      const patten = /(.*?)<img.+?alt=('|")(.*?)\2.*?>([^<]*)/gi
      let resultStr = ''
      let str = ''
      while ((str = patten.exec(word)) !== null) {
        resultStr += str[1] + str[3] + str[4]
      }
      resultStr = this.htmlspecialchars_decode(resultStr).replace(new RegExp(/&nbsp;/g), ' ').replace(/<br>/g, '\n').replace(/<div(([\s\S])*?)<\/div>/g, '')
      let content = ''
      let mediaUrl = ''
      let json = {}
      let message = {}
      const phone = this.customerPhone
      const customerId = this.customerId
      const index = this.contents.length
      // 获取div里输入的内容
      const myMessages = this.$refs.myMessages_div.innerHTML.indexOf('<img src') > -1 ? resultStr : word
      if (this.customerName === '') {
        this.$message.error('请选择联系人！')
        return false
      }
      if (type === 'text') {
        content = myMessages
        // var Expression = "^((https|http|ftp|rtsp|mms)?://)?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}\\.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+\\.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\\.[a-z]{2,6})(:[0-9]{1,4})?((/?)|(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$"
        // var objExp = new RegExp(Expression)
        var Expression = /(http|ftp|https|ftp|rtsp|mms)?:\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/
        if (!myMessages) {
          console.log('信息为空！')
          return
        }
        if (Expression.test('http://' + content) || Expression.test(content)) {
          // 刚开始发送时 receiveState: 1表示发送消息  0为接受消息   code: 0 发送成功  2 显示loading标志 4 显示warning标志
          json = { createTime: formatDateTime(new Date()), direction: '1', code: '2', content: encodeURI(content), phone: phone, msgType: 'link', staffId: localStorage.getItem('agentId') }
          this.contents.splice(index, 1, json)
          // 清空文字输入框里的内容
          this.myMessages = ''
          this.$refs.myMessages_div.innerText = ''
          message = { 'customerId': customerId, 'content': encodeURI(content), 'msgType': 'link', 'sessionId': this.sessionId }
        } else {
        // 刚开始发送时 receiveState: 1表示发送消息  0为接受消息   code: 0 发送成功  2 显示loading标志 4 显示warning标志
          json = { createTime: formatDateTime(new Date()), direction: '1', code: '2', content: content, phone: phone, msgType: 'text', staffId: localStorage.getItem('agentId') }
          this.contents.splice(index, 1, json)
          // 清空文字输入框里的内容
          this.myMessages = ''
          this.$refs.myMessages_div.innerHTML = ''
          message = { 'customerId': customerId, 'content': content, 'msgType': 'text', 'sessionId': this.sessionId }
        }
      } else if (type === 'image') {
        mediaUrl = this.DLurl[0].url
        // 刚开始发送时 receiveState: 1表示发送消息  0为接受消息   code: 0 发送成功  2 显示loading标志 4 显示warning标志
        json = { createTime: formatDateTime(new Date()), direction: '1', code: '2', mediaUrl: mediaUrl, phone: phone, msgType: 'image', staffId: localStorage.getItem('agentId') }
        this.contents.splice(index, 1, json)
        // 清空文字输入框里的内容
        this.myMessages = ''
        this.$refs.myMessages_div.innerText = ''
        message = { 'customerId': customerId, 'mediaUrl': mediaUrl, 'msgType': 'image', 'sessionId': this.sessionId }
      } else if (type === 'file') {
        mediaUrl = this.DLurl[0].url
        // 刚开始发送时 receiveState: 1表示发送消息  0为接受消息   code: 0 发送成功  2 显示loading标志 4 显示warning标志
        json = { createTime: formatDateTime(new Date()), direction: '1', code: '2', content: encodeURI(mediaUrl), phone: phone, msgType: 'file', staffId: localStorage.getItem('agentId') }
        this.contents.splice(index, 1, json)
        // 清空文字输入框里的内容
        this.myMessages = ''
        this.$refs.myMessages_div.innerText = ''
        message = { 'customerId': customerId, 'content': encodeURI(mediaUrl), 'msgType': 'file', 'sessionId': this.sessionId }
      }
      const contentDiv = document.getElementById('short-message-content')
      sendMsgTo(message)
        .then(response => {
          if (response.data.code === 0) {
            // 发送成功 取消loading标志
            json.code = '0'
            this.contents.splice(index, 1, json)
          } else {
            // 发送失败 将loading标志换为waring标志
            json.code = '4'
            this.contents.splice(index, 1, json)
            this.$message.error(response.data.message)
          }
        }).catch(error => {
          // 服务出错时 将loading标志换为waring标志
          json.code = '4'
          this.contents.splice(index, 1, json)
          console.log(error)
        })

      this.contents.splice(index, 1, json)
      setTimeout(() => {
        contentDiv.scrollTop = contentDiv.scrollHeight
      }, 10)
    },
    // 再次请求发送消息
    sendMessageAgain(item, index) {
      const json = item
      console.log(json)
      json.code = '2'
      this.contents.splice(index, 1, json)
      let message = {}
      if (item.msgType === 'text') {
        message = { 'customerId': this.customerId, 'content': item.content, 'msgType': item.msgType, 'sessionId': this.sessionId }
      } else {
        message = { 'customerId': this.customerId, 'mediaUrl': item.mediaUrl, 'msgType': item.msgType, 'sessionId': this.sessionId }
      }
      console.log('message', message)
      sendMsgTo(message)
        .then(response => {
          if (response.data.code === 0) {
            // 发送成功 取消loading标志
            json.code = '0'
            this.contents.splice(index, 1, json)
          } else {
            // 发送失败 将loading标志换为waring标志
            json.code = '4'
            this.contents.splice(index, 1, json)
            this.$message.error(response.data.message)
          }
        }).catch(error => {
          // 服务出错时 将loading标志换为waring标志
          json.code = '4'
          this.contents.splice(index, 1, json)
          console.log(error)
        })
    },
    // 点击列表时显示客户姓名 获取聊天记录
    showNameAndSearchRecords(customerName, taskId, campaignId, customerId, unreadNum) {
      // 将之前isTalking(如果有)设置为false
      for (var i = 0; i < this.customerInfos.length; i++) {
        if (this.customerInfos[i].isTalking === true) {
          this.customerInfos[i].isTalking = false
        }
        // console.log(111)
      }
      // 将本次点击的isTalking设置为true
      for (var k = 0; k < this.customerInfos.length; k++) {
        if (this.customerInfos[k].taskId === taskId) {
          this.customerInfos[k].isTalking = true
        }
        // console.log(222)
      }
      // 如果有未读数 点击时将未读置为0
      if (unreadNum > 0) {
        for (var a = 0; a < this.customerInfos.length; a++) {
          if (this.customerInfos[a].taskId === taskId) {
            this.customerInfos[a].unreadNum = 0
          }
        }
      }
      // 客户姓名
      this.customerName = customerName
      this.taskId = taskId
      this.campaignId = campaignId
      this.customerId = customerId
      // 展示客户信息 接触记录 产品等
      this.showCustomerInfos(taskId, campaignId, customerId, null)
      if (this.customerName) {
        this.uploadDisabled = false
      }
      // 获取聊天记录 todo
      this.getChatRecords(customerId, null)
      this.queryPageNum = 2
      const contentDiv = document.getElementById('short-message-content')
      setTimeout(() => {
        contentDiv.scrollTop = contentDiv.scrollHeight
      }, 10)
    },
    // websocket接受到消息后需要调用的方法
    setUnreadNum(oneMsg) {
      for (var a = 0; a < this.customerInfos.length; a++) {
        if (this.customerInfos[a].customerId === oneMsg.customerId) {
          console.log('正在聊天收到消息')
          if (this.customerInfos[a].isTalking === true) {
            const msgId = []
            msgId.push(oneMsg.id)
            this.$set(this.contents, this.contents.length, oneMsg)
            this.changeRecords(msgId)
          } else {
            this.customerInfos[a].unreadNum++
          }
        }
        if (this.customerInfos[a].customerId !== oneMsg.customerId) {
          console.log('不是正在聊天收到消息')
          if (this.customerInfos[a].isTalking === true) {
          // 不是当前在聊天的人  增加未读数量
            navbarQueryRecords(localStorage.getItem('agentId')).then(response => {
              this.$store.commit('CHANGE_WECHATMSG', response.data.pageInfo.totalCount)
            })
          }
        }
      }
      // return new Promise((resolve) => {
      //   resolve()
      // })
    },
    changeCustomerTalking(index) {
      this.customerInfos = JSON.parse(localStorage.getItem('customerInfos'))
      console.log(this.customerInfos)
      for (let i = 0; i < this.customerInfos.length; i++) {
        this.customerInfos[i].isTalking = false
      }
      this.customerInfos[index].isTalking = true
      console.log(this.customerInfos)
      localStorage.setItem('customerInfos', JSON.stringify(this.customerInfos))
      this.$store.commit('SET_WECHATCUSTOMERINFO', this.customerInfos)
    },
    // 综合查询聊天记录
    getChatRecords(customerId, queryPageNum) {
      queryRecords(customerId, queryPageNum)
        .then(response => {
          if (response.data.code === 0) {
            if (response.data.data) {
              if (queryPageNum === null) {
                // 不传页数默认查询第一页 把第一页数据直接放数组中
                this.contents = response.data.data
                this.$store.commit('SET_WECHATCONTENTS', this.contents)
                // 判断是否还有更多消息记录
                if (response.data.pageInfo.totalPage > 1) {
                  this.hasMoreRecords = true
                } else {
                  this.hasMoreRecords = false
                }
              } else {
                // 传了页数 将查询的数据插入数组的最前
                const contentDiv = document.getElementById('short-message-content')
                const y = contentDiv.scrollTop
                for (var i = response.data.data.length - 1; i >= 0; i--) {
                  this.contents.unshift(response.data.data[i])
                }
                this.$store.commit('SET_WECHATCONTENTS', this.contents)
                setTimeout(() => {
                  contentDiv.scrollTop = y
                }, 10)
                // 判断是否还有更多消息记录
                if (response.data.pageInfo.totalPage > queryPageNum) {
                  this.hasMoreRecords = true
                } else {
                  this.hasMoreRecords = false
                }
              }
            } else {
              this.contents = []
            }
            this.msgIds = []
            for (let i = 0; i < response.data.data.length; i++) {
              this.msgIds.push(response.data.data[i].id)
            }
            this.changeRecords(this.msgIds)
          } else {
            this.contents = []
            this.$message.error(response.data.message)
          }
          // 查询客户列表对应显示的未读数量
          getUnreadNum(localStorage.getItem('agentId')).then(response => {
            if (response.data.data.length === 0) {
              for (var n = 0; n < this.customerInfos.length; n++) {
                this.customerInfos[n].unreadNum = 0
              }
            } else {
              for (let i = 0; i < this.customerInfos.length; i++) {
                const res = JSON.stringify(response.data.data)
                if (res.indexOf(this.customerInfos[i].customerId) === -1) {
                  this.customerInfos[i].unreadNum = 0
                }
                for (let j = 0; j < response.data.data.length; j++) {
                  if (this.customerInfos[i].customerId === response.data.data[j].customerId) {
                    this.customerInfos[i].unreadNum = response.data.data[j].num
                  }
                }
              }
            }
            this.$store.commit('SET_WECHATCUSTOMERINFO', this.customerInfos)
            localStorage.setItem('customerInfos', JSON.stringify(this.customerInfos))
          })
        })
    },
    // 修改未读消息为已读
    changeRecords(msgIds) {
      changeRecords(msgIds).then(response => {
        if (response.data.code === 0) {
          this.navbarQueryRecords()
          // 查询客户列表对应显示的未读数量
          getUnreadNum(localStorage.getItem('agentId')).then(response => {
            if (response.data.data.length === 0) {
              for (var n = 0; n < this.customerInfos.length; n++) {
                this.customerInfos[n].unreadNum = 0
              }
            } else {
              for (let i = 0; i < this.customerInfos.length; i++) {
                const res = JSON.stringify(response.data.data)
                if (res.indexOf(this.customerInfos[i].customerId) === -1) {
                  this.customerInfos[i].unreadNum = 0
                }
                for (let j = 0; j < response.data.data.length; j++) {
                  if (this.customerInfos[i].customerId === response.data.data[j].customerId) {
                    this.customerInfos[i].unreadNum = response.data.data[j].num
                  }
                }
              }
            }
            this.$store.commit('SET_WECHATCUSTOMERINFO', this.customerInfos)
            localStorage.setItem('customerInfos', JSON.stringify(this.customerInfos))
          })
        }
      })
    },
    // 查询未读消息(聊天对象)
    navbarQueryRecords() {
      navbarQueryRecords(localStorage.getItem('agentId')).then(response => {
        if (response.data.code === 0) {
          this.$store.commit('CHANGE_WECHATMSG', response.data.pageInfo.totalCount)
        }
      })
    },
    // 获取div里的文字信息
    transferToWords(name) {
      return name.replace(/^\s+/, '').replace(/\s+$/, '')
    },
    // 判断是否需要显示发送支付短信的checkbox
    setSendMessage(radio) {
      if (radio === '2') {
        this.showSendMessage = true
      } else {
        this.showSendMessage = false
        this.sendMessageOrNot = false
      }
    },
    sendSummaryId(data, checked, ischildSelected) {
      if (checked && data.summaryDetailInfos === null) {
        this.selectedSummarys.push(data.id)
      } else {
        if (this.selectedSummarys.some(i => i === data.id)) {
          // 移除数组中此项id
          this.selectedSummarys.splice(
            this.selectedSummarys.indexOf(data.id),
            1
          )
        }
      }
    },
    // 展示客户信息（基本信息、接触记录、相关产品、任务状态、话后小结)
    showCustomerInfos(taskId, campaignId, customerId, customerPhone) {
      console.log(taskId)
      // 根据任务id status判断是否需要创建一个sessionId（recordId）
      queryContactRecordByTaskIdandStatus(taskId).then(res5 => {
        if (res5.data.data && res5.data.data.length !== 0) {
          this.sessionId = res5.data.data[0].recordId
          // console.log(this.sessionId)
        } else {
          // 创建新的sessionId
          generateRecordId(taskId, '2').then(res6 => {
            this.sessionId = res6.data
            console.log('创建新的sessionId:' + this.sessionId)
          })
        }
      })
      // 判断活动类型
      getCampaignType(campaignId).then(res1 => {
        if (res1.data.code === 0) {
          this.campaignType = res1.data.data.campaignTypeInfo.code
          if (this.campaignType === 'RECRUIT') {
            this.isRecruit = true
          } else {
            this.isRecruit = false
          }
        }
      })
      queryCustomerInfo(customerId)
        .then(response1 => {
          if (response1.data.code === 0) {
            this.customerInfo = response1.data.data
            this.customerName = response1.data.data.customerName
          }
        })
      // 判断是否有接触记录信息
      queryContactRecord(taskId, campaignId).then(res2 => {
        if (res2.data.code === 0) {
          this.contactRecord = res2.data.data
        }
      })
      // 判断是否有产品信息
      hasOrderInfos(campaignId).then(res3 => {
        if (res3.data.code === 0 && res3.data.data.length > 0) {
          this.hasProductInfo = true
          this.productInfo = res3.data.data
          getProducts(res3.data.data).then(res => {
            if (res.data.code === 0 && res.data.data.length > 0) {
              this.products = res.data.data
              for (let i = 0; i < this.products.length; i++) {
                const tempValue = this.products[i].propertyInfos
                this.products[i].showMessage = false
                if (
                  typeof tempValue !== 'undefined' &&
                  tempValue !== null &&
                  tempValue.length > 0
                ) {
                  for (let j = 0; j < tempValue.length; j++) {
                    if (
                      tempValue[j].templateType === 'checkbox' &&
                      tempValue[j].showOrInput === '1'
                    ) {
                      this.$set(this.checks, j, [])
                    }
                    if (tempValue[j].templateType === 'checkbox' || tempValue[j].templateType === 'radio') {
                      const arr = JSON.parse(tempValue[j].propertyValue)
                      this.products[i].propertyInfos[j].showInLine = true
                      for (let k = 0; k < arr.length; k++) {
                        if (arr[k].length > 4) {
                          this.products[i].propertyInfos[j].showInLine = false
                          break
                        }
                      }
                    }
                    if (tempValue[j].showOrInput === '1' && tempValue[j].isRequired === '1') {
                      this.products[i].showMessage = true
                    }
                  }
                }
              }
            }
          })
        }
      })

      // 根任务id获取小结
      getSummaries(taskId).then(res4 => {
        if (res4.data.code === 0 && res4.data.data.length > 0) {
          this.nodulesTree = res4.data.data
        }
      })
    },
    showSex(sex) {
      if (sex === 0) {
        return '男'
      } else if (sex === 1) {
        return '女'
      } else {
        return ''
      }
    },
    beforeUpload(file) {
      if (file.type.indexOf('image') !== -1) {
        const isLt2M = file.size / 1024 / 1024 < 1
        if (!isLt2M) {
          this.$message({
            message: '上传图片大小不能超过 1MB!',
            type: 'warning'
          })
        }
        this.clearUpload('upload')
        return isLt2M
      } else {
        return true
      }
    },
    checkCustomerName() {
      if (this.customerName === '') {
        this.$message.error('请选择联系人！')
        this.uploadDisabled = true
      } else {
        this.uploadDisabled = false
      }
    },
    uploadFile(formData) {
      if (!this.beforeUpload(formData.file)) {
        console.log('stop')
        return false
      }
      const vm = this
      let date = new Date()
      let uploadInfoReq2 = {}
      vm.fileName = formData.file.name
      if (vm.fileName >= 1024) {
        vm.fileSize = formData.file.size / 1024 + 'kb'
      } else if (vm.fileName > 1048576) {
        vm.fileSize = formData.file.size / 1024 / 1024 + 'mb'
      } else {
        vm.fileSize = formData.file.size + '字节'
      }
      vm.timeStamp = new Date().getTime()
      date = formatDateTime(date).split(' ')[0]
      vm.uploadInfoReq.objectName = localStorage.getItem('agentId') + '/' + date + '/' + vm.timeStamp + '_' + formData.file.name
      uploadInfoReq2 = clone(this.uploadInfoReq)
      this.openFullScreen()
      getUploadInfo(uploadInfoReq2).then(response => {
        if (response.data.presignedPutUrl) {
          uploading(process.env.FILE_SERVER_URL, response.data.presignedPutUrl, formData, date, vm.timeStamp)
          if (sessionStorage.getItem('DLurl')) {
            this.loading.close()
            vm.DLurl = JSON.parse(sessionStorage.getItem('DLurl'))
            vm.imgsrc = vm.DLurl[0].url
            vm.fileSrc = vm.DLurl[0].url
            if (vm.DLurl.length && formData.file.type.indexOf('image') !== -1) {
              console.log(vm.DLurl[0].name + '上传成功!')
              this.clearUpload('upload')
              sessionStorage.removeItem('DLurl')
              this.imageVisible = true
            } else {
              console.log(vm.DLurl[0].name + '上传成功!')
              this.clearUpload('upload')
              sessionStorage.removeItem('DLurl')
              this.fileVisible = true
            }
          } else {
            this.imgsrc = ''
            const timeout = () => {
              setTimeout(() => {
                if (sessionStorage.getItem('DLurl')) {
                  vm.DLurl = JSON.parse(sessionStorage.getItem('DLurl'))
                  vm.imgsrc = vm.DLurl[0].url
                  vm.fileSrc = vm.DLurl[0].url
                  if (vm.DLurl.length && formData.file.type.indexOf('image') !== -1) {
                    console.log(vm.DLurl[0].name + '上传成功!')
                    this.loading.close()
                    this.clearUpload('upload')
                    sessionStorage.removeItem('DLurl')
                    this.imageVisible = true
                  } else {
                    console.log(vm.DLurl[0].name + '上传成功!')
                    this.loading.close()
                    this.clearUpload('upload')
                    sessionStorage.removeItem('DLurl')
                    this.fileVisible = true
                  }
                } else {
                  timeout()
                }
              }, 500)
            }
            timeout()
          }
        } else {
          this.loading.close()
          vm.$notify({
            message: '服务器上存在与' + vm.timeStamp + '_' + formData.file.name + '相同名字的文件，请删除或重命名后重新上传',
            type: 'error'
          })
        }
      })
    },
    removeFile() {
      delUpload(this.uploadInfoReq).then(response => {
        if (response.data.flag) {
          console.log('删除附件成功')
          sessionStorage.removeItem('DLurl')
        } else {
          console.log(response.data.message)
        }
      })
    },
    beforeImageDialog(done) {
      this.clearUpload('upload')
      done()
    },
    // 清空上传列表
    clearUpload(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].clearFiles()
      }
    },
    toDialTask(dailTaskCustomer) {
      console.log(dailTaskCustomer)
      console.log(this.customerInfos)
      if (dailTaskCustomer.taskId) {
        queryTaskByTaskId(dailTaskCustomer.taskId).then(response => {
          if (response.data.code === 0) {
            const isBlacklist = response.data.data.isBlacklist
            sessionStorage.setItem('isDialTask', false)
            let path = ''
            const router = getDynamicRouter(JSON.parse(sessionStorage.getItem('getMenu')))
            for (let i = 0; i < router.length; i++) {
              for (let j = 0; j < router[i].children.length; j++) {
                if (router[i].children[j].name === 'dial_task') {
                  path = router[i].path + '/' + router[i].children[j].name
                }
              }
            }
            this.$router.push({
              path: path,
              query: {
                taskId: dailTaskCustomer.taskId,
                campaignId: dailTaskCustomer.campaignId,
                customerId: dailTaskCustomer.customerId,
                isBlacklist: isBlacklist,
                customerPhone: dailTaskCustomer.customerPhone
              }
            })
          }
        })
      } else {
        this.dailTaskCustomer = JSON.parse(localStorage.getItem('customerInfos'))
        queryTaskByTaskId(this.dailTaskCustomer[0].taskId).then(response => {
          if (response.data.code === 0) {
            const isBlacklist = response.data.data.isBlacklist
            sessionStorage.setItem('isDialTask', false)
            let path = ''
            const router = getDynamicRouter(JSON.parse(sessionStorage.getItem('getMenu')))
            for (let i = 0; i < router.length; i++) {
              for (let j = 0; j < router[i].children.length; j++) {
                if (router[i].children[j].name === 'dial_task') {
                  path = router[i].path + '/' + router[i].children[j].name
                }
              }
            }
            this.$router.push({
              path: path,
              query: {
                taskId: this.dailTaskCustomer[0].taskId,
                campaignId: this.dailTaskCustomer[0].campaignId,
                customerId: this.dailTaskCustomer[0].customerId,
                isBlacklist: isBlacklist,
                customerPhone: this.dailTaskCustomer[0].customerPhone
              }
            })
          }
        })
      }
    },
    jump(link) {
      var Expression = '^(https|http|ftp|rtsp|mms)'
      var objExp = new RegExp(Expression)
      if (objExp.test(link) !== true) {
        window.open('http://' + link)
      } else {
        window.open(link)
      }
    }
  },
  created() {
  },
  watch: {
    // 预约时间显示T+
    addDays: function(val, oldval) {
      if (parseInt(val)) {
        var days = parseInt(val)
        var ms = days * 86400000
        var appointTimeMs = new Date().getTime() + ms
        this.appointTime = formatDateTime(appointTimeMs)
      } else {
        this.appointTime = ''
      }
    },
    contents() {
      this.$nextTick(() => {
        this.$refs.refContentMessage.scrollTop = this.$refs.refContentMessage.scrollHeight
      })
    }

  },
  mounted() {
    if (this.$route.query) {
      this.dailTaskCustomer.taskId = this.$route.query.taskId
      this.dailTaskCustomer.campaignId = this.$route.query.campaignId
      this.dailTaskCustomer.customerId = this.$route.query.customerId
      this.dailTaskCustomer.customerPhone = this.$route.query.customerPhone
    } else if (!this.dailTaskCustomer) {
      this.dailTaskCustomer = this.customerInfos[0]
    }
    // 查询所有客户列表
    getWechatCustomer(localStorage.getItem('agentId')).then(response => {
      this.customerInfos = response.data.data
      localStorage.setItem('customerInfos', JSON.stringify(response.data.data))
      if (this.$route.query && this.$route.query.fromDialTask === '0') {
        this.taskId = this.$route.query.taskId
        this.campaignId = this.$route.query.campaignId
        this.customerId = this.$route.query.customerId
        this.customerPhone = this.$route.query.customerPhone
        for (var a = 0; a < this.customerInfos.length; a++) {
          if (this.customerInfos[a].customerId === this.$route.query.customerId) {
            this.customerInfos[a].isTalking = true
            this.customerActive = a.toString()
          } else {
            this.customerInfos[a].isTalking = false
          }
        }
        localStorage.setItem('customerInfos', JSON.stringify(this.customerInfo))
        // 展示客户信息
        this.showCustomerInfos(this.taskId, this.campaignId, this.customerId, this.customerPhone)
        // 获取聊天记录
        this.getChatRecords(this.$route.query.customerId, null)
        const contentDiv = document.getElementById('short-message-content')
        setTimeout(() => {
          contentDiv.scrollTop = contentDiv.scrollHeight
        }, 10)
      } else {
        this.customerActive = '0'
        const customerInfos = JSON.parse(localStorage.getItem('customerInfos'))
        this.customerInfos[0].isTalking = true
        for (var i = 1; i < this.customerInfos.length; i++) {
          this.customerInfos[i].isTalking = false
        }
        const taskId = customerInfos[0].taskId
        const campaignId = customerInfos[0].campaignId
        const customerId = customerInfos[0].customerId
        const customerPhone = customerInfos[0].customerPhone
        this.customerId = customerInfos[0].customerId
        // 展示客户信息
        this.showCustomerInfos(taskId, campaignId, customerId, customerPhone)
        // 获取聊天记录
        this.getChatRecords(customerId, null)
        const contentDiv = document.getElementById('short-message-content')
        setTimeout(() => {
          contentDiv.scrollTop = contentDiv.scrollHeight
        }, 10)
      }
      // 查询客户列表对应显示的未读数量
      getUnreadNum(localStorage.getItem('agentId')).then(response => {
        if (response.data.data.length === 0) {
          for (var n = 0; n < this.customerInfos.length; n++) {
            this.customerInfos[n].unreadNum = 0
          }
        } else {
          for (let i = 0; i < this.customerInfos.length; i++) {
            const res = JSON.stringify(response.data.data)
            if (res.indexOf(this.customerInfos[i].customerId) === -1) {
              this.customerInfos[i].unreadNum = 0
            }
            for (let j = 0; j < response.data.data.length; j++) {
              if (this.customerInfos[i].customerId === response.data.data[j].customerId) {
                this.customerInfos[i].unreadNum = response.data.data[j].num
              }
            }
          }
        }
        this.$store.commit('SET_WECHATCUSTOMERINFO', this.customerInfos)
        localStorage.setItem('customerInfos', JSON.stringify(this.customerInfos))
      })
    })
  },
  destroyed() {
    for (var i = 0; i < this.contents.length; i++) {
      this.contents[i].customerId = ''
    }
    this.$store.commit('SET_WECHATCONTENTS', this.contents)
  }
}

</script>

