<template>
  <div class="container incoming-call" @click="hideEmoji">
    <div>
      <div
        style="float:left;height:79vh;width:auto;box-shadow: 0 0 10px 0 rgba(39,48,69,0.10);border-radius: 2px;">
        <el-container style="height:100%;">
          <el-aside>
            <el-header>
              <b class="font14">当前会话</b>
            </el-header>
            <el-menu
              active-text-color="#409EFF"
              :default-active="customerActive"
              style="borderoverflow:auto;width:100%;text-align:left;"
            >
              <!-- <div v-for="(item,index) in wechatCustomerInfos">
                <el-menu-item
                  class="font12"
                  :index="index+''"
                  slot="reference"
                  @click="showNameAndSearchRecords(item.customerName,item.customerPhone,item.taskId,item.campaignId,item.customerId,item.unreadNum);dailTaskCustomer=item;customerActive=index.toString();changeCustomerTalking(index)"
                >
                  <div style="margin-bottom:7px;">
                    <span>{{item.customerName}}</span>
                    <b
                      v-if="item.isTalking==false&&item.unreadNum>0"
                      style="color:#ED2135;"
                    >({{item.unreadNum>99?'99+':item.unreadNum}})</b>
                  </div>
                  <div>
                    <span style="float:left;">{{item.customerPhone}}</span> -->
                    <!-- <span style="float:right;color:#ccc;">时间</span> -->
                  <!-- </div>
                </el-menu-item>
              </div> -->
              <el-menu-item
                style="height:auto;"
                class="font12"
                v-if="customerPhone"
                index="1">
                <div style="margin-bottom:7px;">
                  <span>{{menuCustomerName}}</span>
                </div>
                <div style="overflow:hidden">
                  <span style="text-align:left">{{customerPhone}}</span>
                </div>
              </el-menu-item>
            </el-menu>
          </el-aside>
          <el-container class="chat-record-container" v-if="false">
            <!-- 客户姓名div-->
            <div class="chat-header">
              <b
                class="font12"
                style="margin-left:1%;color:#020202;"
              >{{customerName ? customerName : '暂无联系人'}}</b>
              <b class="font12" style="margin-left:1%;color:#020202;">{{customerPhoneHeader}}</b>
              <img
                style="width:25px;position: relative;bottom: -6px;cursor:pointer;"
                src="../../../static/images/dial_normal.png"
                @click="toDialTask(dailTaskCustomer)"
                alt="拨打电话"
              >
            </div>
            <div
              id="short-message-content-container"
              style="background-color:#FBFBFB;padding:0;height:55.1vh;overflow-y:auto;"
            >
              <!-- 聊天记录 对话框 div -->
              <div
                id="short-message-content"
                style="position:relative;padding:10px;background-color:#FBFBFB;overflow-x:hidden"
                ref="refContentMessage"
              >
                <!-- 点击加载更多div -->
                <div style="font-size:14px;color:#35ABE2;text-align:center" v-if="hasMoreRecords">
                  <a @click="getChatRecords(customerId,queryPageNum);queryPageNum++;">查看更多消息</a>
                </div>
                <div v-for="(item,index) in wechatContents">
                  <!-- 来自客户的消息 -->
                  <el-row
                    style="min-height:30px;border-radius: 2px;text-align:left;word-break:break-all;"
                    v-if="item.direction=='0'"
                  >
                    <div style="margin-left:9px;">
                      <span
                        class="el-icon-loading"
                        v-if="item.code=='2'"
                        style="margin-left:4px;line-height:32px;"
                      ></span>
                      <span
                        class="el-icon-warning"
                        v-if="item.code=='4'"
                        style="margin-left:4px;line-height:32px;"
                      ></span>
                      <div
                        v-if="item.msgType=='text'"
                        class="font12 left chat-container fl"
                        v-html="showMsgs(item.content)"
                      ></div>
                      <div v-if="item.msgType=='link'" class="font12 left chat-container fl">
                        <a
                          class="link"
                          style="color:#115DFF;"
                          @click="jump(item.content)"
                        >{{item.content}}</a>
                      </div>
                      <div v-if="item.msgType=='image'" class="font12 left chat-container fl">
                        <img
                          :src="item.mediaUrl"
                          style="width:100%;cursor:pointer;"
                          @click="imageDetailVisible=true;imgsrc=item.mediaUrl"
                        >
                      </div>
                      <div v-if="item.msgType=='voice'" class="font12 left chat-container fl">
                        <audio
                          controls="controls"
                          :src="item.mediaUrl"
                          style="width:240px;background: #F3F5FA;border-radius: 1px;height:32px;"
                        ></audio>
                      </div>
                    </div>
                  </el-row>
                  <el-row style="text-align:left;margin-bottom:22px;" v-if="item.direction=='0'">
                    <span
                      class="font12"
                      style="padding-left:9px;color:#ccc;"
                    >{{formatDateTime(item.createTime)}}</span>
                  </el-row>
                  <!-- 我发出的消息  -->
                  <!-- <el-row style="color:#737373;min-height: 5vh;;line-height:5vh;text-align:center;border-radius: 4px;font-size:14px;" v-if="item.direction=='1'">{{formatDateTime(item.createTime)}}</el-row> -->
                  <!-- <el-row v-if="item.direction=='1'" style="text-align:right;color:rgb(191, 191, 191);font-size:16px;">{{"坐席工号："+item.staffId}}</el-row> -->
                  <el-row
                    style="min-height:30px;border-radius: 2px;text-align:left;word-break:break-all;"
                    v-if="item.direction=='1'"
                  >
                    <div style="float:right;margin-right:9px;">
                      <span
                        class="el-icon-loading"
                        v-if="item.code=='2'"
                        style="margin-right:4px;line-height:32px;"
                      ></span>
                      <a
                        class="el-icon-warning"
                        v-if="item.code=='4'"
                        @click="sendMessageAgainVisible=true;sendMessageAgain_Obj=item;sendMessageAgain_Index=index;"
                        style="margin-right:4px;line-height:40px;color:red;"
                      ></a>
                      <div
                        v-if="item.msgType=='text'"
                        class="font12 right chat-container fr"
                        v-html="showMsgs(item.content)"
                      ></div>
                      <div v-if="item.msgType=='file'" class="font12 right chat-container fr">
                        <a
                          class="link"
                          style="color:#115DFF;text-shadow:1px 1px 1px #fff;"
                          @click="jump(item.content)"
                        >{{decodeURI(item.content)}}</a>
                      </div>
                      <div
                        v-if="item.msgType=='link'"
                        style="min-height:40px;color:#3A2424;padding:10px;background-color:#67c23a;float:right;border-radius: 4px"
                      >
                        <a
                          class="link"
                          style="color:#115DFF;text-shadow:1px 1px 1px #fff;"
                          @click="jump(item.content)"
                        >{{decodeURI(item.content)}}</a>
                      </div>
                      <div v-if="item.msgType=='image'" class="font12 right chat-container fr">
                        <img
                          :src="item.mediaUrl"
                          style="width:100%;cursor:pointer;"
                          @click="imageDetailVisible=true;imgsrc=item.mediaUrl"
                        >
                      </div>
                    </div>
                  </el-row>
                  <el-row style="text-align:right;margin-bottom:22px;" v-if="'1'===item.direction">
                    <span
                      class="font12"
                      style="padding-right:9px;color:#ccc;"
                    >{{formatDateTime(item.createTime)}}</span>
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
                </div>-->
              </div>
            </div>
            <!-- 是否重新发送消息dialog -->
            <el-dialog width="30%" title="操作提示" :visible.sync="sendMessageAgainVisible">
              <span style="font-size:15px;">是否重新发送消息？</span>
              <div slot="footer" class="dialog-footer" style="text-align: center;">
                <el-button
                  type="primary"
                  @click="sendMessageAgainVisible=false;sendMessageAgain(sendMessageAgain_Obj,sendMessageAgain_Index)"
                >确定</el-button>
                <el-button @click="sendMessageAgainVisible = false">关闭</el-button>
              </div>
            </el-dialog>

            <el-footer
              style="position:relative;border-top:1px solid #ECECEC;background-color:#FBFBFB;padding:0;"
            >
              <!-- 表情选择 -->
              <div
                v-if="showEmojis"
                style="line-height:0;position:absolute;top:-286px;left:0px;background:#FBFBFB;width: 80%;box-shadow:1px 3px 8px 0 rgba(207, 212, 220, 0.3);"
                id="emoji_div"
              >
                <el-tabs v-model="chooseEmojis" style="margin:0;margin-left:5px;">
                  <el-tab-pane label="QQ表情" name="qq_face">
                    <emotion @emotion="handleEmotion" :height="230"></emotion>
                  </el-tab-pane>
                  <el-tab-pane label="emoji表情" name="emoji_face">
                    <vue-emoji @select="handleEmotion1"></vue-emoji>
                  </el-tab-pane>
                </el-tabs>
              </div>
              <!-- 发送图片及录音 -->
              <div
                class="multi"
                style="color:#909399;line-height:0;height:35px;text-align:left;background:#FBFBFB;"
              >
                <a
                  title="表情"
                  class="select_emojis"
                  href="javascript:;"
                  @click="showEmojis=!showEmojis;chooseEmojis='qq_face'"
                ></a>
                <el-upload
                  class="upload-demo"
                  ref="upload"
                  :action="updateUrl"
                  :http-request="uploadFile"
                  :disabled="uploadDisabled"
                  accept="image/*"
                >
                  <i
                    slot="trigger"
                    @click="checkCustomerName"
                    class="el-icon-picture-outline"
                    style="margin-left:10px;line-height:35px;font-size:30px;cursor:pointer;"
                    title="发送图片"
                  ></i>
                </el-upload>
                <el-upload
                  class="upload-demo"
                  ref="upload"
                  :action="updateUrl"
                  :http-request="uploadFile"
                  :disabled="uploadDisabled"
                >
                  <i
                    slot="trigger"
                    @click="checkCustomerName"
                    style="margin-left:10px;line-height:35px;font-size:30px;cursor:pointer;"
                    title="发送文件"
                  >
                    <svg-icon
                      icon-class="file"
                      class="icon-size"
                      style="width:27px;height:27px;vertical-align:-3px;"
                    />
                  </i>
                </el-upload>
                <!-- <i @click="recordingbtn" class="el-icon-service" style="margin-left:10px;line-height:35px;font-size:30px;cursor:pointer" title="录音"></i> -->
                <!-- <b @click="recVisible=true" style="margin-left:10px;line-height:35px;font-size:18px;color:#000;">录音时长:{{recTime}}s</b> -->
              </div>
              <!-- 编辑文本消息-->
              <div
                contenteditable="true"
                style="line-height:1;padding:3px 10px;overflow-x:hidden;text-align:left;height:103px;word-wrap:break-word;font-size:18px"
                ref="myMessages_div"
                @keyup.enter="sendMessage('text')"
              ></div>
              <!-- 发送按钮div -->
              <div style="text-align:right;line-height:40px;z-index:999;width:100%;margin: 0px 0px">
                <!-- <el-button v-if="recVisible&&!stoprecVisible" style="background:#F5F5F5;margin-right:10px;" @click="startRecording();recVisible=false;stoprecVisible=true">开始录音</el-button>
                <el-button v-if="stoprecVisible" style="background:#F5F5F5;margin-right:10px;" @click="stopRecording();">停止录音</el-button>-->
                <el-button
                  style="background:#F5F5F5;margin-right:10px;"
                  v-if="sendVisible"
                  @click="sendMessage('text');recVisible=false;stoprecVisible=false"
                >发送</el-button>
              </div>
            </el-footer>
          </el-container>
        </el-container>
      </div>
      <div
        class="elaside1"
        style="position:relative;height:51vh;overflow-x:hidden;background:#FBFBFB;float:right;width:calc(100% - 240px);box-shadow: 0 0 10px 0 rgba(39,48,69,0.10);border-radius: 2px;">
        <el-tabs v-model="activeName" type="card" style="background: #F3F5FA;" @tab-click="handleTabClick" @tab-remove="handleTabRemove">
          <el-tab-pane label="基本信息" name="1">
            <el-collapse class="form-container" v-model="basicInfo" @change="basicInfoChangeAcitve" style="box-shadow:none;border-top:none;border-left:none;position:relative;">
              <span class="form-more bold" style="line-height: 24px;font-size: 14px;float:right;margin-right:6px;color:#57AFFF;position:absolute;top:12px;right:40px;">{{callInfoActive[0]}}</span>
              <el-collapse-item class="callInfo" title="通话信息" :name="0">
                <div class="callInfo-item font12" v-if="false">
                  <span>IVR路径：</span>
                  <span style="color:#333;">未知</span>
                </div>
                <div class="callInfo-item font12">
                  <span>号码归属地：</span>
                  <span style="color:#333;" v-if="customerPhoneAddress">{{`${customerPhoneAddress.province} ${customerPhoneAddress.city} ${customerPhoneAddress.phoneBelongTo}`}}</span>
                  <span style="color:#333;" v-if="!customerPhoneAddress">未知</span>
                </div>
              </el-collapse-item>
              <div style="position:relative;border-bottom: 1px solid #ebeef5;">
                <span class="form-more bold" style="line-height: 24px;font-size: 14px;float:right;margin-right:6px;color:#57AFFF;position:absolute;top:12px;right:40px;">{{callInfoActive[1]}}</span>
                <el-collapse-item class="customerInfo" title="客户名片" :name="1" v-if="customerPhone">
                  <el-row>
                    <span class="font12 bold" style="color:#333">基础信息</span>
                  </el-row>
                  <!-- <el-row style="border-bottom:1px solid #54B8FF;"></el-row> -->
                  <el-row>
                    <el-col class="customerInfo-item font12" :span="6">
                      <span style="line-height:30px;">姓名：</span>
                      <span style="color:#333;line-height:30px;" v-if="!customerInfosFormVisbile.customerName">{{customerInfos.customerName?customerInfos.customerName:'未知'}}</span>
                      <el-input v-model="customerInfos.customerName" :inline="true" size="mini" style="width:45%;" v-if="customerInfosFormVisbile.customerName" placeholder="姓名"></el-input>
                      <i class="el-icon-circle-check-outline" title="保存" v-if="customerInfosFormVisbile.customerName" @click="editCustomer('customerName')"></i>
                      <i class="el-icon-circle-close-outline" title="取消" v-if="customerInfosFormVisbile.customerName" @click="cancelEditCustomer('customerName')"></i>
                      <i v-if="!customerInfosFormVisbile.customerName" style="cursor:pointer;" @click="customerInfosFormToggle('customerName')">
                        <img src="../../../static/images/edit_btn.png">
                      </i>
                    </el-col>
                    <el-col class="customerInfo-item font12" :span="6">
                      <span style="line-height:30px;">性别：</span>
                      <span style="color:#333;line-height:30px;" v-if="!customerInfosFormVisbile.customerSex">{{customerInfos.customerSex===0?'男':customerInfos.customerSex===1?'女':'未知'}}</span>
                      <el-radio-group v-if="customerInfosFormVisbile.customerSex" v-model="customerInfos.customerSex">
                        <el-radio :label="0">
                          <span style="font-size:12px;">男</span>
                        </el-radio>
                        <el-radio :label="1">
                          <span style="font-size:12px;">女</span>
                        </el-radio>
                      </el-radio-group>
                      <i class="el-icon-circle-check-outline" title="保存" v-if="customerInfosFormVisbile.customerSex" @click="editCustomer('customerSex')"></i>
                      <i class="el-icon-circle-close-outline" title="取消" v-if="customerInfosFormVisbile.customerSex" @click="cancelEditCustomer('customerSex')"></i>
                      <i v-if="!customerInfosFormVisbile.customerSex" style="cursor:pointer;" @click="customerInfosFormToggle('customerSex')">
                        <img src="../../../static/images/edit_btn.png">
                      </i>
                    </el-col>
                    <el-col class="customerInfo-item font12" :span="6">
                      <span style="line-height:30px;">身份证：</span>
                      <span style="color:#333;line-height:30px;" v-if="!customerInfosFormVisbile.idNo">{{customerInfos.idNo?customerInfos.idNo:'未知'}}</span>
                      <el-input v-model="customerInfos.idNo" :inline="true" size="mini" style="width:45%;" v-if="customerInfosFormVisbile.idNo" placeholder="身份证"></el-input>
                      <i class="el-icon-circle-check-outline" title="保存" style="cursor:pointer;" v-if="customerInfosFormVisbile.idNo" @click="editCustomer('idNo')"></i>
                      <i class="el-icon-circle-close-outline" title="取消" style="cursor:pointer;" v-if="customerInfosFormVisbile.idNo" @click="cancelEditCustomer('idNo')"></i>
                      <i v-if="!customerInfosFormVisbile.idNo" style="cursor:pointer;" @click="customerInfosFormToggle('idNo')">
                        <img src="../../../static/images/edit_btn.png">
                      </i>
                    </el-col>
                  </el-row>  
                  <el-row style="margin-top:15px;">
                    <el-row>
                      <span class="font12 bold" style="color:#333">联系信息</span>
                      <span 
                        class="el-icon-circle-plus-outline" 
                        style="cursor:pointer;color:#28CC6C;font-size:14px;position:relative;top:1px;left:2px;" 
                        title="添加联系信息" 
                        @click="handleAddContactInfo"></span>
                    </el-row>
                    <!-- <el-row style="border-bottom:1px solid #54B8FF;"></el-row> -->
                    <el-row>
                      <el-col v-if="customerInfos.linkResultInfos!==undefined&&customerInfos.linkResultInfos.length>0" class="customerInfo-item font12" v-for="(item2,index) in customerInfos.linkResultInfos" :span="6">
                        <span style="line-height:30px;">{{'手机号码'+(index+1)+'：'}}</span>
                        <span style="color:#333;line-height:30px;" :key="index" v-if="!customerInfosFormVisbile.linkResultInfos[index]">{{item2.linkValue}}</span>
                        <el-input v-model="customerInfos.linkResultInfos[index].linkValue" :inline="true" size="mini" style="width:45%;" v-if="customerInfosFormVisbile.linkResultInfos[index]" placeholder="手机号码"></el-input>
                        <i class="el-icon-circle-check-outline" title="保存" v-if="customerInfosFormVisbile.linkResultInfos[index]" @click="editCustomer('linkResultInfos',index,false)"></i>
                        <i class="el-icon-circle-close-outline" title="取消" v-if="customerInfosFormVisbile.linkResultInfos[index]" @click="customerInfosFormToggle('linkResultInfos',index,false)"></i>
                        <i 
                          v-if="customerPhone!==customerInfos.linkResultInfos[index].linkValue&&!(customerInfosFormVisbile.linkResultInfos[index])" 
                          style="cursor:pointer;" 
                          @click="customerInfosFormToggle('linkResultInfos',index,true)">
                          <img src="../../../static/images/edit_btn.png">
                        </i>
                        <el-button v-if="showDefaultBtn&&(item2.isUsually===null||item2.isUsually===0)" size="mini" type="text" @click="setDefaultLink('linkResultInfos',index,false)" style="color:#54B8FF;">设为默认</el-button>
                        <el-tag :disable-transitions="true" v-if="showDefaultBtn&&item2.isUsually===1" size="mini">默认</el-tag>
                      </el-col>
                      <!-- <el-col v-if="customerInfos.linkResultInfos!==undefined&&customerInfos.linkResultInfos.length===0||!(customerInfos.linkResultInfos)" class="customerInfo-item font12" :span="6">
                        <span>手机号码：</span>
                        <span style="color:#333;">无</span>
                      </el-col> -->
                    </el-row>
                  </el-row>
                  <el-row style="margin:15px 0;">
                    <el-row>
                      <span class="font12 bold" style="color:#333">地址信息</span>
                      <span v-if="provincesCache" class="el-icon-circle-plus-outline" style="cursor:pointer;color:#28CC6C;font-size:14px;position:relative;top:1px;left:2px;" title="添加地址信息" @click="handleAddAddressInfo"></span>
                    </el-row>
                    <!-- <el-row style="border-bottom:1px solid #54B8FF;"></el-row> -->
                    <el-row>
                      <el-col v-if="customerInfos.addressResultInfos!==undefined&&customerInfos.addressResultInfos.length>0" class="customerInfo-item font12" v-for="(item,index2) in customerInfos.addressResultInfos">
                        <span>{{'地址'+(index2+1)+'：'}}</span>
                        <span style="color:#333;line-height:30px;" :key="index2" v-if="!(customerInfosFormVisbile.addressResultInfos[index2])&&item.provinceName">{{item.provinceName+item.cityName+item.districtName+item.detail}}</span>
                        <div style="display:inline-block;width:90%;" v-if="customerInfosFormVisbile.addressResultInfos[index2]">
                          <el-select v-model="customerVmodels[index2].province" placeholder="省" @change="getCities(customerVmodels[index2].province,index2)" style="width:85px;" size="mini">
                            <el-option
                              v-for="(province,index3) in provinces[index2]"
                              :key="province.id"
                              :value="province.regionCode"
                              :label="province.regionName"
                            ></el-option>
                          </el-select>
                          <el-select v-model="customerVmodels[index2].city" placeholder="市" @change="getDistricts(customerVmodels[index2].city,index2)" style="width:85px;" size="mini">
                            <el-option
                              v-for="(city,index3) in cities[index2]"
                              :key="city.id"
                              :value="city.regionCode"
                              :label="city.regionName"
                            ></el-option>
                          </el-select>
                          <el-select v-model="customerVmodels[index2].district" placeholder="县" style="width:85px;" size="mini">
                            <el-option
                              v-for="(district,index3) in districts[index2]"
                              :key="district.id"
                              :value="district.regionCode"
                              :label="district.regionName"
                            ></el-option>
                          </el-select>
                          <el-input v-model="customerVmodels[index2].detail" :inline="true" size="mini" placeholder="详细地址" style="width:calc(100% - 270px);"></el-input>
                        </div>
                        <i class="el-icon-circle-check-outline" title="保存" v-if="customerInfosFormVisbile.addressResultInfos[index2]" @click="editCustomer('addressResultInfos',index2,false)"></i>
                        <i class="el-icon-circle-close-outline" title="取消" v-if="customerInfosFormVisbile.addressResultInfos[index2]" @click="customerInfosFormToggle('addressResultInfos',index2,false)"></i>
                        <i v-if="!customerInfosFormVisbile.addressResultInfos[index2]&&provinces&&provinces.length" style="cursor:pointer;" @click="handleEditRegion(index2);">
                          <img src="../../../static/images/edit_btn.png">
                        </i>
                        <el-button v-if="showDefaultBtn&&(item.isDefault===null||item.isDefault===0)" size="mini" type="text" @click="setDefaultAddress('addressResultInfos',index2,false)" style="color:#54B8FF;">设为默认</el-button>
                        <el-tag :disable-transitions="true" v-if="showDefaultBtn&&item.isDefault===1" size="mini">默认</el-tag>
                      </el-col>
                      <!-- <el-col v-if="customerInfos.addressResultInfos!==undefined&&customerInfos.addressResultInfos.length===0||!(customerInfos.addressResultInfos)" class="customerInfo-item font12" :span="24">
                        <span>地址:</span>
                        <span style="color:#333;">无</span>
                      </el-col> -->
                    </el-row>
                  </el-row>
                </el-collapse-item>
                
              </div>
              <!-- <div style="position:relative;border-bottom: 1px solid #ebeef5;">
                <span class="form-more bold" style="line-height: 24px;font-size: 14px;float:right;margin-right:6px;color:#57AFFF;position:absolute;top:12px;right:40px;">{{callInfoActive[2]}}</span>
                <el-collapse-item title="保单信息" :name="2">

                </el-collapse-item>
              </div> -->
            </el-collapse>
          </el-tab-pane>
          <el-tab-pane label="服务记录" name="2">
            <el-collapse class="form-container" v-model="serviceRecord" @change="handleChangeAcitve" style="box-shadow:none;margin-bottom:0;border-top:none;border-left:none;position:relative;">
              <span class="form-more bold" style="line-height: 24px;font-size: 14px;float:right;margin-right:6px;color:#57AFFF;position:absolute;top:12px;right:40px;">{{callInfoActive[0]}}</span>
              <el-collapse-item class="callInfo" title="筛选条件" :name="1">
                <el-form :inline="true" size="small">
                  <el-form-item label="接触类型：">
                    <el-select v-model="searchContactListReq.contactType">
                      <el-option label="全部" value=""></el-option>
                      <el-option label="微信" value="2"></el-option>
                      <el-option label="电话" value="1"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="呼叫方式：">
                    <el-select v-model="searchContactListReq.callDirection">
                      <el-option value="" label="全部"></el-option>
                      <el-option value="0" label="呼出"></el-option>
                      <el-option value="1" label="呼入"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="getContactList" size="small">查询</el-button>
                    <el-button @click="resetServiceRecordForm" size="small">重置</el-button>
                  </el-form-item>
                </el-form>
              </el-collapse-item>
            </el-collapse>
            <el-row class="table-container" style="margin-top:0;box-shadow:none;">
              <el-row class="margin-bottom-15">
                <div class="font14 bold">服务记录</div>
              </el-row>
              <el-table
                :data="contactList"
                style="width: 100%">
                <el-table-column
                  label="接触类型"
                  align="center">
                  <template slot-scope="scope">
                    <div>{{scope.row.contactType =="1"?'电话':'微信'}}</div>
                  </template>
                </el-table-column>
                <el-table-column
                  label="呼叫方式"
                  align="center">
                  <template slot-scope="scope">
                    <div>{{scope.row.callDirection =="0"?'呼出':'呼入'}}</div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="ringTime"
                  label="呼入时间"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="talkTime"
                  label="时长"
                  align="center">
                </el-table-column>
                <el-table-column
                  label="状态"
                  align="center">
                  <template slot-scope="scope">
                    <div :class="scope.row.status==='1'?'visible':'invisible'">
                      <span>{{scope.row.status==='1'?'接通':'未接通'}}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="callTime"
                  label="操作"
                  align="center">
                  <template slot-scope="scope">
                    <el-button type="text" size="medium" @click="ids.recordId=scope.row.recordId;contactDetail()">查看</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-row style="margin-top:5px;">
                <el-pagination
                  @size-change="handleServiceRecordSizeChange"
                  @current-change="handleServiceRecordCurrentChange"
                  :current-page.sync="serviceRecordPagination.pageNo"
                  :page-size="serviceRecordPagination.pageSize"
                  :page-sizes="[10, 20, 30, 40, 50]"
                  layout="total, sizes, prev, pager, next, jumper "
                  :total="serviceRecordPagination.totalCount" style="text-align: right">
                </el-pagination>
              </el-row>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="话术知识库" name="3">
            <knowledge-query></knowledge-query>
          </el-tab-pane>
          <el-tab-pane label="工单记录" name="4" v-if="isConversation.workformRecordVisible">
            <el-collapse class="form-container" v-model="serviceRecord" @change="handleChangeAcitve" style="box-shadow:none;margin-bottom:0;border-top:none;border-left:none;position:relative;">
              <span class="form-more bold" style="line-height: 24px;font-size: 14px;float:right;margin-right:6px;color:#57AFFF;position:absolute;top:12px;right:40px;">{{callInfoActive[0]}}</span>
              <el-collapse-item class="callInfo" title="筛选条件" :name="1">
                <el-form :inline="true">
                  <el-form-item label="工单名称：">
                    <el-input v-model="searchWorkFormRecord.name"></el-input>
                  </el-form-item>
                  <el-form-item label="工单状态：">
                    <el-select v-model="searchWorkFormRecord.status">
                      <el-option label="全部" value=""></el-option>
                      <el-option label="初始化" :value="0"></el-option>
                      <el-option label="成功" :value="3"></el-option>
                      <el-option label="失败" :value="2"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="操作人：">
                    <el-input v-model="searchWorkFormRecord.modifierName"></el-input>
                  </el-form-item>
                  <el-form-item label="操作时间：">
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
                    <el-button type="primary" @click="getWorkFormRecord">查询</el-button>
                    <el-button @click="resetReq">重置</el-button>
                  </el-form-item>
                </el-form>
              </el-collapse-item>
            </el-collapse>
            <el-row class="table-container" style="margin-top:0">
              <el-row class="margin-bottom-15">
                <div class="font14 bold">工单记录</div>
              </el-row>
              <el-table
                :data="workFormRecordList"
                style="width: 100%">
                <el-table-column
                  fixed
                  align="center"
                  label="名称"
                  prop="name"
                  :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column
                  align="center"
                  label="工单号"
                  prop="code"
                  :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column
                  align="center"
                  label="客户名称"
                  prop="customerName"
                  :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column
                  align="center"
                  label="服务目录"
                  prop="serviceMenu"
                  :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    {{scope.row.serviceMenu?scope.row.serviceMenu.namePath:"未找到关联的服务目录"}}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="工单状态"
                  align="center">
                  <template slot-scope="scope">
                    <div :class="scope.row.status===0?'create':scope.row.status===2?'invisible':scope.row.status===3?'visible':''">
                      <span>{{scope.row.status===0?'初始化':scope.row.status===2?'失败':scope.row.status===3?'成功':''}}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                      prop="urgeCounts"
                      label="催办状态"
                      :render-header="showQuestion"
                      align="center">
                  <template slot-scope="scope">
                    <el-badge   v-if="scope.row.urgeCounts==null||scope.row.urgeCounts==0" :hidden="scope.row.urgeCounts==null||scope.row.urgeCounts==0">
                      <el-tag size="small" type="info">未催办</el-tag>
                    </el-badge>
                    <el-badge :value="scope.row.urgeCounts" class="badge_item" type="primary" v-else-if="scope.row.urgeCounts>0">
                      <el-popover trigger="click">
                        <el-table :data="urgeList" >
                          <el-table-column 
                            label="催办内容"
                            width="180"
                            prop="urgeContent"
                            :show-overflow-tooltip="true">
                          </el-table-column>
                          <el-table-column
                            label="催办人"
                            prop="creatorName"
                            :show-overflow-tooltip="true">
                            </el-table-column>
                          <el-table-column
                            label="催办时间"
                            width="180"
                            prop="createTime"
                            :show-overflow-tooltip="true">
                          </el-table-column>
                          <el-table-column
                            label="操作"
                            :show-overflow-tooltip="true">
                              <template slot-scope="scope">
                                <el-button type="text" size="small" @click="toCancelUrge(scope.row.id)">取消催办</el-button>
                              </template>
                          </el-table-column>
                        </el-table>
                        <a slot="reference" @click="showUrgeList(scope.row.id)"><el-tag size="small" type="success" >已催办</el-tag></a>
                      </el-popover>
                    </el-badge>
                    <el-badge v-else>
                      <el-tag size="small">未知情况</el-tag>
                    </el-badge>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="modifierName"
                  label="操作人"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="modifyTime"
                  label="操作时间"
                  align="center">
                </el-table-column>
                <el-table-column
                  fixed="right"
                  width="180"
                  label="操作"
                  align="center">
                  <template slot-scope="scope">
                    <el-button type="text" size="medium" @click="getWorkFormRecordDetail(scope.row.id)">查看</el-button>
                    <el-button type="text" size="medium" @click="toAddUrge(scope.row.id)">催办</el-button>
                    <el-button type="text" size="medium" @click="reSendMsg(scope.row.id)">重发短信</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-row style="margin-top:20px;">
                <el-pagination
                  @size-change="workFormRecordSizeChange"
                  @current-change="workFormRecordCurrentChange"
                  :current-page.sync="workFormRecordPagination.pageNo"
                  :page-size="workFormRecordPagination.pageSize"
                  :page-sizes="[10, 20, 30, 40, 50]"
                  layout="total, sizes, prev, pager, next, jumper "
                  :total="workFormRecordPagination.totalCount" style="text-align: right">
                </el-pagination>
              </el-row>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="新建工单" name="5" v-if="addWorkFormTabVisible&&isAddWorkOrder">
            <div style="padding:15px;">
              <div style="text-align:center" class="margin-bottom-20">
                <el-form>
                  <el-form-item :inline="true">
                    <el-input class="workform-title-input" v-model="addWorkForm.name" placeholder="请输入工单名称" title="工单名称"></el-input>
                  </el-form-item>
                </el-form>
              </div>
              <div style="width:100%;">
                <!-- <el-form :inline="true" size="small" ref="workform"> -->
                  <el-row>
                    <el-col
                      :span="item.dataType=='textarea'?24:12"
                      v-for="(item,index) in workformInfo.workformProperties">
                      <el-form
                      label-position="right"
                      :model="addWorkForm.workformRecordRuleCreateInfos[index]"
                      size="small"
                      ref="workform">
                      <el-form-item label-width="180px" prop="recordValue" v-if="item.propertyUsage===0"  :rules="workFormRules(item)" :label="item.name+'：'" :key="index">
                        <!-- input 和 textarea -->
                        <el-input
                          v-if="item.dataType=='input'||item.dataType=='textarea'||item.dataType=='inputnumber'"
                          :type="item.dataType=='textarea'?'textarea':item.dataType=='inputnumber'?'number':''"
                          :placeholder="item.placeholder"
                          v-model="addWorkForm.workformRecordRuleCreateInfos[index].recordValue"
                        ></el-input>
                        <!-- radio -->
                        <el-radio-group
                          v-if="item.dataType=='radio'"
                          :placeholder="item.placeholder"
                          v-model="addWorkForm.workformRecordRuleCreateInfos[index].recordValue">
                          <el-radio
                            v-for="(item2,index2) in item.dataValues"
                            :label="index2"
                            :key="index2">
                              {{item2}}
                            </el-radio>
                        </el-radio-group>
                        <!-- select -->
                        <el-select
                          v-if="item.dataType=='select'||item.dataType=='multipleSelect'"
                          :multiple="item.dataType=='multipleSelect'?true:false"
                          :placeholder="item.placeholder"
                          v-model="addWorkForm.workformRecordRuleCreateInfos[index].recordValue">
                          <el-option
                            v-for="(item2,index2) in item.dataValues"
                            :label="item2"
                            :key="index2"
                            :value="index2">
                          </el-option>
                        </el-select>
                        <!-- checkbox -->
                        <el-checkbox-group
                          v-if="item.dataType=='checkbox'"
                          :placeholder="item.placeholder"
                          v-model="addWorkForm.workformRecordRuleCreateInfos[index].recordValue">
                          <el-checkbox
                             v-for="(item2,index2) in item.dataValues"
                            :label="index2"
                            :key="index2">
                            {{item2}}
                          </el-checkbox>
                        </el-checkbox-group>
                        <!-- date 和 datetime -->
                        <el-date-picker
                          v-if="item.dataType=='date'||item.dataType=='datetime'"
                          :type="item.dataType"
                          :placeholder="item.placeholder"
                          :value-format="item.formatValue"
                          v-model="addWorkForm.workformRecordRuleCreateInfos[index].recordValue">
                        </el-date-picker>
                        <!-- time -->
                        <el-time-picker
                          v-if="item.dataType=='time'"
                          :placeholder="item.placeholder"
                          :value-format="item.formatValue"
                          v-model="addWorkForm.workformRecordRuleCreateInfos[index].recordValue">
                        </el-time-picker>
                        <!-- span -->
                        <span v-if="item.dataType=='span'" style="color:#666666;">{{item.defaultValue}}</span>
                      </el-form-item>
                      </el-form>
                    </el-col>

                  </el-row>
                <!-- </el-form> -->
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="酒店信息" name="8">
            <el-collapse class="form-container" v-model="serviceRecord" @change="handleChangeAcitve" style="box-shadow:none;margin-bottom:0;border-top:none;border-left:none;position:relative;">
              <span class="form-more bold" style="line-height: 24px;font-size: 14px;float:right;margin-right:6px;color:#57AFFF;position:absolute;top:12px;right:40px;">{{callInfoActive[0]}}</span>
              <el-collapse-item class="callInfo" title="筛选条件" :name="1">
                <el-form :inline="true">
                  <el-form-item label="酒店名称：">
                    <el-input v-model="searchHotelReq.name"></el-input>
                  </el-form-item>
                  <el-form-item label="国家：">
                    <el-input v-model="searchHotelReq.country"></el-input>
                  </el-form-item>
                  <el-form-item label="城市：">
                    <el-input v-model="searchHotelReq.city"></el-input>
                  </el-form-item>
                  <el-form-item label="状态：" placeholder="请选择状态">
                    <el-select v-model="searchHotelReq.status" @change="time_dimensionChange">
                      <el-option label="有效" :value="0"></el-option>
                      <el-option label="无效" :value="1"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="优惠类型：" placeholder="请选择优惠类型">
                    <el-select v-model="searchHotelReq.offerType" @change="time_dimensionChange">
                      <el-option label="免费住宿" :value="0"></el-option>
                      <el-option label="住二送一" :value="1"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="getHotelList">查询</el-button>
                    <el-button @click="resetHotelReq">重置</el-button>
                  </el-form-item>
                </el-form>
              </el-collapse-item>
            </el-collapse>
            <el-row class="table-container" style="margin-top:0">
              <el-row class="margin-bottom-15">
                <div class="font14 bold">酒店信息</div>
              </el-row>
              <el-table
                class="hotel-table"
                :data="hotelTableData"
                style="width: 100%">
                <el-table-column align="center" type="expand">
                  <template slot-scope="props">
                    <el-form label-position="left">
                      <el-form-item label="酒店名称">
                        <span>{{ props.row.name }}</span>
                      </el-form-item>
                      <el-form-item label="国家">
                        <span>{{ props.row.country }}</span>
                      </el-form-item>
                      <el-form-item label="城市">
                        <span>{{ props.row.city }}</span>
                      </el-form-item>
                      <el-form-item label="优惠类型">
                        <span>{{ props.row.offerType===0?'免费住宿':'住二送一' }}</span>
                      </el-form-item>
                      <el-form-item label="房间类型">
                        <span>{{ props.row.roomType }}</span>
                      </el-form-item>
                      <el-form-item label="床型">
                        <span>{{ props.row.bedType===0?'大床':'双床' }}</span>
                      </el-form-item>
                      <el-form-item label="餐型">
                        <span>{{ props.row.mealType===0?'无早':props.row.mealType===1?'单早':'双早' }}</span>
                      </el-form-item>
                      <el-form-item label="地址">
                        <span>{{ props.row.address }}</span>
                      </el-form-item>
                      <el-form-item label="状态">
                        <span>{{ props.row.status===0?'有效':'无效' }}</span>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  label="商品名称"
                  prop="name">
                </el-table-column>
                <el-table-column
                  align="center"
                  label="国家"
                  prop="country">
                </el-table-column>
                <el-table-column
                  align="center"
                  label="地址"
                  prop="address">
                </el-table-column>
                <el-table-column
                  align="center"
                  label="状态">
                  <template slot-scope="scope">
                    <div :class="scope.row.status===0?'visible':'invisible'">
                      <span>{{scope.row.status===0?'有效':'无效'}}</span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <el-row style="margin-top:20px;">
                <el-pagination
                  @size-change="hotelSizeChange"
                  @current-change="hotelCurrentChange"
                  :current-page.sync="hotelPagination.pageNo"
                  :page-size="hotelPagination.pageSize"
                  :page-sizes="[10, 20, 30, 40, 50]"
                  layout="total, sizes, prev, pager, next, jumper "
                  :total="hotelPagination.totalCount" style="text-align: right">
                </el-pagination>
              </el-row>
            </el-row>
          </el-tab-pane>
          <el-tab-pane closable label="服务记录详情" name="6" class="record-dail" v-if="recordDailTabVisible">
            <div class="table-container" style="margin-top:0;">
              <b class="font14" style="padding-top:10px;">{{detailInfo.contactInfo.recordId}}</b>
              <el-row style="padding-top:20px;">
                <div style="width:20%;float:left;">
                  <!-- <el-row class="font12">
                    <span style="color:#666666;">员工姓名：</span>
                    <b style="color:#020202;" :title="detailInfo.staffInfo.staffName">{{detailInfo.staffInfo.staffName}}</b>
                  </el-row> -->
                  <el-row class="font12">
                    <span style="color:#666666;">员工工号：</span>
                    <b style="color:#020202;" :title="detailInfo.contactInfo.staffId">{{detailInfo.contactInfo.staffId}}</b>
                  </el-row>
                  <el-row class="font12">
                    <span style="color:#666666;">客户姓名：</span>
                    <b style="color:#020202;" :title="detailInfo.contactInfo.customerName">{{detailInfo.contactInfo.customerName}}</b>
                  </el-row>
                </div>

                <!-- <div style="width:20%;float:left;">
                  <el-row class="font12" style="opacity:0">
                    <span style="color:#666666;">员工工号：</span>
                    <b style="color:#020202;" :title="detailInfo.contactInfo.staffId">{{detailInfo.contactInfo.staffId}}</b>
                  </el-row>
                  <el-row class="font12">
                    <span style="color:#666666;">身份证号：</span>
                    <b style="color:#020202;" :title="hideIdNumber(detailInfo.customerInfo.idNo)">{{hideIdNumber(detailInfo.customerInfo.idNo)}}</b>
                  </el-row>
                </div> -->

                <div style="width:20%;float:left;">
                  <el-row class="font12">
                    <span style="color:#666666;">主叫号码：</span>
                    <b style="color:#020202;" :title="detailInfo.contactInfo.callerNumber">{{detailInfo.contactInfo.callerNumber}}</b>
                  </el-row>
                  <el-row class="font12">
                    <span style="color:#666666;">被叫号码：</span>
                    <b style="color:#020202;" :title="hideMobile(detailInfo.contactInfo.calleeNumber)">{{hideMobile(detailInfo.contactInfo.calleeNumber)}}</b>
                  </el-row>
                </div>

                <div style="width:20%;float:left;">
                  <el-row class="font12">
                    <span style="color:#666666;">接听时间：</span>
                    <b style="color:#020202;" :title="(detailInfo.contactInfo.answerTime)== null?'无':(detailInfo.contactInfo.answerTime)">{{(detailInfo.contactInfo.answerTime)== null?'无':(detailInfo.contactInfo.answerTime)}}</b>
                  </el-row>
                  <el-row class="font12">
                    <span style="color:#666666;">话后小结：</span>
                    <b style="color:#020202;" :title="showSummaryInfo(detailInfo.contactInfo.summaryDetailInfos)">{{showSummaryInfo(detailInfo.contactInfo.summaryDetailInfos)}}</b>
                  </el-row>
                </div>

                <div style="width:20%;float:left;">
                  <el-row class="font12">
                    <span style="color:#666666;">通话时间：</span>
                    <b style="color:#020202;" :title="detailInfo.contactInfo.talkTime?formatSeconds(detailInfo.contactInfo.talkTime):''">{{detailInfo.contactInfo.talkTime?formatSeconds(detailInfo.contactInfo.talkTime):''}}</b>
                  </el-row>
                  <el-row class="font12">
                    <span style="color:#666666;">小结备注：</span>
                    <b style="color:#020202;" :title="detailInfo.contactInfo.description?detailInfo.contactInfo.description:'无'">{{detailInfo.contactInfo.description?detailInfo.contactInfo.description:"无"}}</b>
                  </el-row>
                </div>
              </el-row>
              <el-row>
                <div style="width:20%;float:left;">
                  <el-row class="font12">
                    <b style="color:#020202;">电话录音</b>
                  </el-row>
                  <el-row class="font12">
                    <vue-plyr ref="plyr" class="audio-style" :options="option" v-if="showPlayer">
                      <audio>
                        <source :src="detailInfo.contactInfo.soundRecordUrl"/>
                      </audio>
                    </vue-plyr>
                  </el-row>
                </div>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane closable label="工单记录详情" name="7" v-if="workFormRecordTabVisible">
            <div style="padding:15px;">
              <div style="text-align:center" class="margin-bottom-20">
                <h5>{{workformRecordDetail.name}}</h5>
              </div>
              <div style="width:100%;">
                <div class="callInfo-item font12 fl" style="width:50%;margin-bottom:15px;">
                   <span>工单号：</span>
                   <span style="color:#333;">{{workformRecordDetail.code}}</span>
                </div>
                <div class="callInfo-item font12 fl" style="width:50%;margin-bottom:15px;">
                   <span>服务目录：</span>
                   <span style="color:#333;" >{{workformRecordDetail.serviceMenu?workformRecordDetail.serviceMenu.namePath:""}}</span>
                </div>
              </div>
              <div style="width:100%;">
                <div class="callInfo-item font12 fl" style="width:50%;margin-bottom:15px;" v-for="(item,index) in workformRecordContent" :key="index">
                  <span>{{item.workformProperty.name + "："}}</span>
                  <span style="color:#333;">
                    {{item.workformProperty.dataType==="span"||item.workformProperty.dataType==="textarea"||item.workformProperty.dataType==="time"||item.workformProperty.dataType==="datetime"||item.workformProperty.dataType==="inputnumber"||item.workformProperty.dataType==="input"||item.workformProperty.dataType==="date" ? (item.recordValue || '') : (showSelectValue(item.workformProperty.dataType,item.workformProperty.dataValues,item.recordValue) || '')}}</span>
                </div>
              </div>
            </div>
          </el-tab-pane>
          

          <!-- <el-tab-pane
            closable
            v-for="(item, index) in editableTabs"
            :key="item.name"
            :label="item.title"
            :name="item.name">
            <component :is="item.content"></component>
          </el-tab-pane> -->
        </el-tabs>
      </div>
      <div class="summary table-container fr" style="padding:15px;width:calc(100% - 240px);min-height:calc(27vh - 15px);">
        <el-row class="margin-bottom-15">
          <div class="font14 bold">小结</div>
        </el-row>
        <el-row>
          <el-form :inline="true">
            <el-form-item label="话后小结：">
              <el-cascader
                :class="isConversation.summaryDisabled?'disabled':''"
                :disabled="isConversation.summaryDisabled"
                size="mini"
                expand-trigger="hover"
                placeholder="请选择小结"
                v-model="recordSummaryCreateInfo.summaryIds"
                :options="nodulesTree"
                filterable
                :props="summaryTreeProps"
                @change="handleNoduleChange"
              ></el-cascader>
            </el-form-item>
            <!-- <el-col
              style="height:48px;line-height:34px;margin-top:-45px;"
              v-if="showSendMessage === true && campaignType !== 'RECRUIT' && hasProductInfo === true"
            >
              <el-checkbox v-model="sendMessageOrNot" checked="checked">发送支付短信</el-checkbox>
            </el-col> -->
            <el-form-item label="是否产生工单：">
              <div @click="checkSummaryIds">
                <el-switch
                  :disabled="isConversation.addWorkformDisabled"
                  active-text="是"
                  inactive-text="否"
                  v-model="isAddWorkOrder"
                  @change="handleChangeWorkFormSwitch">
                </el-switch>
              </div>
            </el-form-item>
            <el-form-item label="服务目录：" v-if="isAddWorkOrder" >
              <el-cascader
                size="mini"
                style="width:130%"
                expand-trigger="hover"
                placeholder="请选择服务目录"
                v-model="selectedServiceList"
                :options="serviceListTree"
                filterable
                :props="serviceListTreeProps"
                @change="handleServiceListChange"
              ></el-cascader>
            </el-form-item>
          </el-form>
          <!-- <el-form
            style="text-align:left;"
            :inline="true"
            v-show="this.selectedSummarys[0] === '3'"
          >
            <el-form-item label="预约日期：" class="working-date-form">
              <span style="color:red;line-height:34px;">*</span>
              <b style="font-size: 16px;color: #333333;letter-spacing: 0;text-align: left;">T +</b>
              <el-input
                style="width:60px"
                type="text"
                v-model="addDays"
                onkeyup="if(! /^d+$/.test(this.addDays)){this.addDays='';}"
              ></el-input>
            </el-form-item>
            <el-form-item class="time-picker-form">
              <el-date-picker
                v-model="appointTime"
                placeholder="请选择日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                default-time="00:00:00"
                type="datetime"
                style="width:200px"
              ></el-date-picker>
            </el-form-item>
          </el-form> -->
          <el-form>
            <el-form-item label="小结备注：">
              <el-input
                type="textarea"
                :maxlength="100"
                :autosize="{ minRows: 3, maxRows: 3}"
                v-model="recordSummaryCreateInfo.description"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-row>
        <el-row style="text-align:center;">
          <el-button
            type="primary"
            v-if="isConversation.completeButtonVisible"
            v-show="(!isAddWorkOrder)||selectedWorkFormId||selectedWorkFormId===0"
            @click="handleSubmit">
              完成
            </el-button>
        </el-row>
      </div>
    </div>
    <el-dialog
      width="30%"
      title="催办"
      :visible.sync="urgeVisible"
      :before-close="cancelUrge"
      append-to-body>
      <el-form v-model="addUrge" ref="addUrge">
        <el-form-item label="工单号：" v-model="addUrge.workformRecordId">{{addUrge.workformRecordId}}</el-form-item>
        <el-form-item label="工单名称：" v-model="addUrge.workformRecordName">{{addUrge.workformRecordName}}</el-form-item>
        <el-form-item label="催办内容：" >
          <el-input type="textarea" v-model="addUrge.urgeContent" placeholder="请输入催办内容" :autosize="{ minRows: 2, maxRows: 4}" style="resize:vertical;" :value="addUrge.urgeContent"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button
          type="primary"
          @click="submitUrge()"
        >确定</el-button>
        <el-button @click="cancelUrge()">取消</el-button>
      </div>
    </el-dialog>
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
        <el-button
          type="primary"
          @click="imageVisible = false;sendVisible=true;sendMessage('image')"
        >确定</el-button>
        <el-button @click="imageVisible = false;sendVisible=true;removeFile()">取消</el-button>
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
        <el-button
          type="primary"
          @click="fileVisible = false;sendVisible=true;sendMessage('file')"
        >确定</el-button>
        <el-button @click="fileVisible = false;sendVisible=true;removeFile()">取消</el-button>
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
        <el-button type="primary" @click="imageDetailVisible = false;">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang='scss' scoped>
#app {
  .record-dail{
    .table-container{
      &.is-wechat{
        float:left;
        width:49%
      }
      .font12{
        height:30px;
      }
      .audio-style{
        /deep/ .plyr--audio .plyr__controls{
          width:406px;
          background: #F3F5FA;
          border-radius: 1px;
          height:32px;
        }
        /deep/ .plyr__menu__container{
          top:41px;
          bottom:auto;
        }
        /deep/ .plyr__menu__container::after{
          display:none;
        }
      }
      .left,.right{
          min-height: 40px;
          position: relative;
          display: table;
      }
      .left > p,.right > p{    /*使内容居中*/
          display: table-cell;
          vertical-align: middle;
          padding: 0 10px;
      }
      .left:before,.right:after{   /*用伪类写出小三角形*/
          content: '';
          display: block;
          width: 0;
          height: 0;
          border: 8px solid transparent;
          position: absolute;
          top: 7px;
      }
      /*分别给左右两边的小三角形定位*/
      .left:before{
          border-right: 8px solid #ccc;
          left: -16px;
      }
      .right:after{
          border-left: 8px solid #57AFFF;
          right: -16px;
      }
      &.chat-record-container{
        padding:10px;
        height:45vh;
        overflow-y:auto;
      }
      .chat-container{
        max-width:290px;
        text-align:left;
        word-break:break-all;
        color:#020202;
        padding:7px 10px;
        min-height:30px;
        background-color:#fff;
        border-radius: 2px;
        border: 1px solid #57AFFF;
        &.fl{
          background-color:#fff;
          border: 1px solid #CCCCCC;
        }
        &.fr{
          background: #57AFFF;
          color:#fff;
        }
      }
    }
    .fr{
      float:right !important;
    }
    .fl{
      float:left !important;
    }
  }
  audio {
      width: 250px;
      height: 50px;
  }
  .summary{
    /deep/ .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
      margin-bottom:10px;
    }
    .disabled{
      /deep/ .el-cascader .el-input, .el-cascader .el-input__inner{
        cursor:not-allowed;
      }
      /deep/ .el-cascader__label{
        cursor:not-allowed;
      }
    }
  }
  .incoming-call {
    /deep/ .el-form-item__label {
      font-size: 12px !important;
      color: #020202 !important;
      letter-spacing: 0.25px !important;
    }
    .nowrap {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .el-container {
      width: 100%;
    }
    .chat-header {
      border-bottom: 1px solid #dedede;
      background: #f3f5fa;
      height: 4.6vh !important;
      min-height: 4.6vh !important;
      padding: 0px 0 0px 8px;
      line-height: 4.6vh;
    }
    .el-aside {
      .el-menu {
        border: none;
        border-right: 1px solid #f3f5fa;
      }
      border-right: 1px solid #dedede;
      .el-header {
        border-bottom: 1px solid #dedede;
        background: #f3f5fa;
        height: 4.6vh !important;
        min-height: 4.6vh !important;
        padding: 0px 0 0px 8px;
        line-height: 4.6vh;
        div {
          width: 100%;
          height: 100%;
          text-align: left;
        }
      }
      background-color: #fff;
      color: #333;
      width: 210px !important;
    }
    /deep/ .elaside1 {
      width: 41%;
      color: #333;
      // text-align: center;
      height: 834px;
      .hotel-table{
        .el-table__expanded-cell{
          padding:10px 15px 15px 57px;
        }
        .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
          margin-bottom:0;
        }
      }
      .el-icon-circle-check-outline,.el-icon-circle-close-outline{
        font-size:16px;
        cursor:pointer;
        position:relative;
        top:2px;
        margin-left:3px;
        &:hover{
          opacity: 0.7;
        }
      }
      .el-icon-circle-check-outline{
        color:#28CC6C;
      }
      .el-icon-circle-close-outline{
        color:#ED2135;
      }
      .workform-title-input{
        /deep/ .el-input__inner{
          width:200px;
          background:none;
          border:none;
          border-bottom:1px solid #dcdfe6;
        }
      }
      .callInfo{
        div.callInfo-item{
          display:inline-block;
          margin-right:20px;
        }
      }
      // .customerInfo{
        // div.customerInfo-item{
          // display:inline-block;
          // margin-right:20px;
        // }
      // }
      .el-tabs{
        height:100%;
      }
      .el-tabs__header {
        margin-bottom: 0;
        height: 4.6vh;
      }
      .el-tabs--card > .el-tabs__header .el-tabs__nav {
        border: none;
        border-right: 1px solid #dedede;
        transform: none !important;
        div {
          height: 4.6vh;
        }
      }
      .el-tabs__nav-scroll {
        height: 4.6vh;
      }
      /deep/ .el-tabs__content {
        overflow-y: auto;
        // height: 100%;
        height: calc(100% - 4.6vh);
        background: #fbfbfb;
      }
      .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
        background: #fbfbfb;
        border-bottom: 1px solid #fbfbfb;
        height: 4.6vh;
        line-height: 4.6vh;
      }
      .shopping-list {
        border-top: 1px solid #ced4e2;
        border-bottom: 1px solid #ced4e2;
        max-height: 270px;
        margin-top: 20px;
        overflow-y: auto;
        li {
          .empty-text {
            font-size: 14px;
            width: 100%;
            color: #909399;
          }
          height: 45px;
          line-height: 44px;
          color: #020202;
          border-bottom: 1px solid #eee;
          box-sizing: border-box;
          span {
            display: inline-block;
            text-align: center;
            vertical-align: middle;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .product-name {
            width: 37%;
          }
        }
      }
      .userinfo-container {
        .el-row {
          box-sizing: border-box;
          background: #fbfbfb;
        }
        .font12 {
          margin-top: 2px;
          height: 30px;
          line-height: 30px;
          text-align: left;
        }
        .description-hide {
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
      }
    }
    .el-menu-item {
      box-sizing: border-box;
      height: 40px;
      padding: 5px 9px 5px 11px !important;
      line-height: normal;
      color: #333 !important;
      border-bottom: 1px solid #dedede;
      &:hover {
        background: #e8e8e8;
      }
      &:focus {
        background: #e8e8e8;
      }
      &.is-active {
        background: #e8e8e8;
      }
    }
    .audio-style {
      width: 406px;
      background: #f3f5fa;
      border-radius: 1px;
      height: 32px;
    }
    .left,
    .right {
      min-height: 40px;
      position: relative;
      display: table;
    }
    .left > p,
    .right > p {
      /*使内容居中*/
      display: table-cell;
      vertical-align: middle;
      padding: 0 10px;
    }
    .left:before,
    .right:after {
      /*用伪类写出小三角形*/
      content: "";
      display: block;
      width: 0;
      height: 0;
      border: 8px solid transparent;
      position: absolute;
      top: 7px;
    }
    /*分别给左右两边的小三角形定位*/
    .left:before {
      border-right: 8px solid #ccc;
      left: -16px;
    }
    .right:after {
      border-left: 8px solid #57afff;
      right: -16px;
    }
    .chat-record-container {
      // height: 78vh;
      overflow-y: auto;
    }
    .chat-container {
      max-width: 290px;
      text-align: left;
      word-break: break-all;
      color: #020202;
      padding: 7px 10px;
      min-height: 30px;
      background-color: #fff;
      border-radius: 2px;
      border: 1px solid #57afff;
      &.fl {
        background-color: #fff;
        border: 1px solid #cccccc;
      }
      &.fr {
        background: #57afff;
        color: #fff;
      }
    }
    .fr {
      float: right !important;
    }
    .fl {
      float: left !important;
    }
    .el-footer {
      height: auto !important;
    }
    .multi i:hover {
      color: #000;
    }
    .multi {
      i {
        color: rgb(144, 147, 153);
      }
      .upload-demo {
        display: inline-block;
      }
      .el-upload-list {
        display: none;
      }
    }
  }
}

.select_emojis {
  width: 30px;
  height: 30px;
  padding: 12px 15px;
  background: url(../../../static/images/my_imgs/select_face.png) no-repeat -404px -398px;
  background-size: 487px 462px;
  margin-left: 10px;
}
</style>


<script>
import {
  clone,
  formatDateTime,
  uploading,
  hideIdNumber,
  hideMobile,
  formatSeconds,
  list2Tree
} from '@/utils/tools'
import {
  getRegion,
  editCustomer
} from '@/api/customerManagement'
import {
  getContactList,
  getPhoneAddress,
  getSummary,
  getServiceList,
  getWorkFormRecord,
  getWorkFormRecordDetail,
  getWorkFormTempById,
  addWorkFormRecord,
  recordSummaryInfo,
  getCustomerInfoByPhone,
  reSendMsg,
  addUrge,
  queryUrgeList,
  cancelUrge,
  getHotelList
} from '@/api/incoming_call'
import {
  getContactByGradeId,
  getStaffNameByAgentId,
  querycustomerbyid,
  queryTaskByTaskId
} from '@/api/contact_record_dail'
import { getUploadInfo, delUpload } from '@/api/public_request'
import {
  queryContactRecord,
  queryContactRecordByTaskIdandStatus,
  getCampaignType,
  getSummaries,
  sendMsgTo,
  queryRecords,
  generateRecordId,
  changeRecords,
  // getWechatCustomer,
  getUnreadNum
} from '@/api/wechat_list' // 接口
import { navbarQueryRecords } from '@/api/navbar'
import knowledgeQuery from '../knowledge_query/index'
import contactRecordQuery from '../contact_record_query/index'
import Emotion from '@/components/Emotion1/index'
import vueEmoji from '@/components/Emotion3/emoji.vue'
import emojidata from '@/components/Emotion3/emoji-data.js'
import reg_emoji from '@/components/Emotion3/reg_emojis.js'
// var vm = null
let overallIncallCache = {}
export default {
  name: 'incoming_call',
  inject: ['reloadCompoment'],
  data() {
    let cache = {}
    if (this.$store.state.incomingCall.incall_cache.customerPhone) {
      cache = this.$store.state.incomingCall.incall_cache
    } else {
      cache = {
        showDefaultBtn: true,
        searchHotelReq: {
          name: '',
          country: '',
          city: '',
          status: null,
          offerType: null,
          pageNo: 1,
          pageSize: 10
        },
        searchHotelReq2: {
          name: '',
          country: '',
          city: '',
          status: null,
          offerType: null,
          pageNo: 1,
          pageSize: 10
        },
        hotelTableData: [],
        hotelPagination: {},
        urgeList: [],
        urgeVisible: false, // 显示催办弹窗
        addUrge: {// 新增催办请求对象
          workformRecordId: null,
          workformRecordName: '',
          urgeContent: '',
          creatorId: '',
          creatorName: ''
        },
        hideHits: false,
        menuCustomerName: '',
        customerEditReq: {
          customer: {},
          customerAddresses: [],
          customerLinks: [],
          customerCars: []
        },
        customerInfosFormVisbile: {// 控制客户名片编辑表单与内容的切换
          customerName: null,
          customerSex: null,
          idNo: null,
          linkResultInfos: [],
          addressResultInfos: []
        },
        customerVmodels: [],
        provincesCache: null,
        provinces: [],
        cities: [],
        districts: [],
        isConversation: { // 控制在是否会话中的表单可用不可用
          summaryDisabled: false,
          addWorkformDisabled: false,
          workformRecordInvisible: false
        },
        reload: true,
        showCustomerAddresses: false,
        timeValue: null,
        // 需删除---------------------
        // taskId: 'T2019040200000000007',
        // ---------------------
        canSubmit: true,
        workformVali: [],
        searchWorkFormRecord: {
          customerId: null,
          name: '',
          modifierName: '',
          timeStart: null,
          timeEnd: null,
          pageNo: 1,
          pageSize: 10
        },
        searchWorkFormRecord2: {
          customerId: null,
          name: '',
          modifierName: '',
          timeStart: null,
          timeEnd: null,
          pageNo: 1,
          pageSize: 10
        },
        workformRecordDetail: {},
        workformRecordContent: {},
        workformRecordRule: {},
        workformInfo: {},
        addWorkForm: {
          name: null,
          workformId: null,
          customerId: null,
          customerName: null,
          customerPhone: null,
          creatorId: null,
          status: null,
          creatorName: null,
          workformRecordRuleCreateInfos: []
        },
        addWorkFormTabVisible: false,
        workFormRecordTabVisible: false,
        isAddWorkOrder: false,
        recordSummaryCreateInfo: {
          description: '',
          recordId: '',
          summaryIds: ''
        // taskStatus: '' // 任务状态 1 预约,2 完成,3 失败
        },
        showPlayer: false,
        option: { i18n: { normal: '1×', speed: '播放速度' }},
        customerPhoneAddress: '',
        ids: {
          recordId: '',
          agentId: '',
          customerId: ''
        },
        detailInfo: {
          contactInfo: {},
          staffInfo: {},
          customerInfo: {}
        },
        recordDailTabVisible: false,
        editableTabs: [],
        routeParams: {},
        agentId: localStorage.getItem('agentId'),
        defaultPagination: {
          pageNo: 1,
          pageSize: 10,
          totalCount: 0,
          totalPage: 1
        },
        searchContactListReq: {
          contactType: '',
          customerId: '',
          callDirection: '',
          pageNo: 1,
          pageSize: 10
        },
        searchContactListReq2: {
          contactType: '',
          customerId: '',
          callDirection: '',
          pageNo: 1,
          pageSize: 10
        },
        contactList: [],
        workFormRecordList: [],
        customerInfos: [],
        serviceRecordPagination: {// 插件页码
          pageNo: 1,
          pageSize: 10,
          totalCount: 0,
          totalPage: 1
        },
        workFormRecordPagination: {// 页码插件
          pageNo: 1,
          pageSize: 10,
          totalCount: 0,
          totalPage: 1
        },
        serviceRecord: [1],
        basicInfo: [0, 1, 2],
        callInfoActive: ['收起', '收起', '收起'],
        customerPhoneHeader: '',
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
        nodulesTree: [], // 需要展示的小结树 数据
        serviceListTree: [],
        serviceList: [],
        selectedServiceList: [],
        selectedWorkFormId: '',
        serviceListTreeProps: {
          children: 'children',
          label: 'serviceName',
          value: 'id'
        },
        summaryTreeProps: {
          children: 'summaryDetailInfos',
          label: 'name',
          value: 'id'
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
        myMessages: '', // 发送的消息
        activeTab: '', // 产品展示项
        products: [], // 活动下的产品
        customerNote: '', // 客户留言
        sumTotal: 0, // 总价格
        sumInfo: new Map(), // 所选中的产品
        checks: {},
        taskId: 'T2019040200000000007',
        campaignId: '',
        customerId: '',
        customerPhone: '',
        customerName: '', // 对话框中客户姓名
        idNumber: '',
        customerColumnInfos: [], // 用来展示的客户字段
        isRecruit: false, // 活动类型的判断
        contactRecord: [], // 接触记录信息
        activeName: '1', // 折叠板默认打开项
        msgIds: [],
        dailTaskCustomer: {},
        customerActive: null,
        unicoded_qq_face: [
          '/::)',
          '/::~',
          '/::B',
          '/::|',
          '/:8-)',
          '/::<',
          '/::$',
          '/::X',
          '/::Z',
          "/::'(",
          '/::-|',
          '/::@',
          '/::P',
          '/::D',
          '/::O',
          '/::(',
          '/::+',
          '[囧]',
          '/::Q',
          '/::T',
          '/:,@P',
          '/:,@-D',
          '/::d',
          '/:,@o',
          '/::g',
          '/:|-)',
          '/::!',
          '/::L',
          '/::>',
          '/::,@',
          '/:,@f',
          '/::-S',
          '/:?',
          '/:,@x',
          '/:,@@',
          '/::8',
          '/:,@!',
          '/:!!!',
          '/:xx',
          '/:bye',
          '/:wipe',
          '/:dig',
          '/:handclap',
          '/:&-(',
          '/:B-)',
          '/:<@',
          '/:@>',
          '/::-O',
          '/:>-|',
          '/:P-(',
          "/::'|",
          '/:X-)',
          '/::*',
          '/:@x',
          '/:8*',
          '/:pd',
          '/:<W>',
          '/:beer',
          '/:basketb',
          '/:oo',
          '/:coffee',
          '/:eat',
          '/:pig',
          '/:rose',
          '/:fade',
          '/:showlove',
          '/:heart',
          '/:break',
          '/:cake',
          '/:li',
          '/:bome',
          '/:kn',
          '/:footb',
          '/:ladybug',
          '/:shit',
          '/:moon',
          '/:sun',
          '/:gift',
          '/:hug',
          '/:strong',
          '/:weak',
          '/:share',
          '/:v',
          '/:@)',
          '/:jj',
          '/:@@',
          '/:bad',
          '/:lvu',
          '/:no',
          '/:ok',
          '/:love',
          '/:<L>',
          '/:jump',
          '/:shake',
          '/:<O>',
          '/:circle',
          '/:kotow',
          '/:turn',
          '/:skip',
          '[挥手]',
          '/:#-0',
          '/:hiphot',
          '/:<&',
          '/:&>'
        ],
        unicoded_emoji_face: [
          '0x1f600',
          '0x1f601',
          '0x1f602',
          '0x1f923',
          '0x1f603',
          '0x1f604',
          '0x1f605',
          '0x1f606',
          '0x1f609',
          '0x1f60a',
          '0x1f60b',
          '0x1f60e',
          '0x1f60d',
          '0x1f618',
          '0x1f617',
          '0x1f619',
          '0x1f61a',
          '0x263a',
          '0x1f642',
          '0x1f917',
          '0x1f914',
          '0x1f610',
          '0x1f611',
          '0x1f636',
          '0x1f644',
          '0x1f60f',
          '0x1f623',
          '0x1f625',
          '0x1f62e',
          '0x1f910',
          '0x1f62f',
          '0x1f62a',
          '0x1f62b',
          '0x1f634',
          '0x1f60c',
          '0x1f61b',
          '0x1f61c',
          '0x1f61d',
          '0x1f924',
          '0x1f6120',
          '0x1f613',
          '0x1f614',
          '0x1f615',
          '0x1f643',
          '0x1f911',
          '0x1f632',
          '0x2639',
          '0x1f641',
          '0x1f616',
          '0x1f61e',
          '0x1f61f',
          '0x1f624',
          '0x1f622',
          '0x1f62d',
          '0x1f626',
          '0x1f627',
          '0x1f628',
          '0x1f629',
          '0x1f62c',
          '0x1f630',
          '0x1f631',
          '0x1f633',
          '0x1f635',
          '0x1f621',
          '0x1f620',
          '0x1f637',
          '0x1f912',
          '0x1f915',
          '0x1f922',
          '0x1f927',
          '0x1f607',
          '0x1f920',
          '0x1f921',
          '0x1f925',
          '0x1f913',
          '0x1f608',
          '0x1f47f',
          '0x1f479',
          '0x1f47a',
          '0x1f480',
          '0x1f47b',
          '0x1f47d',
          '0x1f916',
          '0x1f4a9',
          '0x1f63a',
          '0x1f638',
          '0x1f639',
          '0x1f63b',
          '0x1f63c',
          '0x1f63d',
          '0x1f640',
          '0x1f63f',
          '0x1f63e',
          '0x1f3fb',
          '0x1f3fc',
          '0x1f3fd',
          '0x1f3fe',
          '0x1f3ff',
          '0x1f5e3',
          '0x1f464',
          '0x1f465',
          '0x1f46b',
          '0x1f46c',
          '0x1f46d',
          '0x1f442',
          '0x1f442 0x1f3fb',
          '0x1f442 0x1f3fc',
          '0x1f442 0x1f3fd',
          '0x1f442 0x1f3fe',
          '0x1f442 0x1f3ff',
          '0x1f443',
          '0x1f443 0x1f3fb',
          '0x1f443 0x1f3fc',
          '0x1f443 0x1f3fd',
          '0x1f443 0x1f3fe',
          '0x1f443 0x1f3ff',
          '0x1f463',
          '0x1f440',
          '0x1f441',
          '0x1f445',
          '0x1f444',
          '0x1f48b',
          '0x1f453',
          '0x1f576',
          '0x1f454',
          '0x1f455',
          '0x1f456',
          '0x1f457',
          '0x1f458',
          '0x1f459',
          '0x1f45a',
          '0x1f45b',
          '0x1f45c',
          '0x1f45d',
          '0x1f392',
          '0x1f45e',
          '0x1f45f',
          '0x1f460',
          '0x1f461',
          '0x1f462',
          '0x1f451',
          '0x1f452',
          '0x1f3a9',
          '0x1f393',
          '0x26d1',
          '0x1f484',
          '0x1f48d',
          '0x1f302',
          '0x1f4bc'
        ]
      }
      overallIncallCache = cache
      this.$store.commit('SET_INCALL_CACHE', cache)
    }
    return cache
  },
  components: {
    knowledgeQuery,
    contactRecordQuery,
    Emotion,
    vueEmoji
  },
  computed: {
    incall_cache() {
      return this.$store.state.incomingCall.incall_cache
    },
    wechatContents() {
      return this.$store.state.app.wechat_contents
    },
    wechatCustomerInfos() {
      return this.$store.state.app.wechat_customerInfos
    },
    player() {
      return this.$refs.plyr.player
    },
    incomingCall() {
      return this.$store.state.ctiData.incomingCall
    }
  },
  methods: {
    showQuestion(h, { column, $index }) {
      return (<span>催办状态&nbsp;<el-tooltip content='点击查看详情' placement='top'><i class='el-icon-question' /></el-tooltip></span>)
    },
    toCancelUrge(id) {
      this.$confirm('确认取消催办？', '请确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        cancelUrge(id).then(res => {
          if (res.data && res.data.code === 0) {
            this.$message({
              message: res.data.message,
              type: 'success',
              duration: 1000
            })
            this.getWorkFormRecord()
          } else {
            this.$message({
              message: res.data.message || '未知错误',
              type: 'error',
              duration: 1000
            })
          }
        })
      })
    },
    showUrgeList(workformRecordId) {
      const req = {}
      req.workformRecordId = workformRecordId
      queryUrgeList(req).then(res => {
        if (res.data.code === 0 && res.data.data) {
          this.urgeList = res.data.data
        } else {
          this.$message({
            message: res.data.message || '催办记录不完善',
            type: 'error',
            duration: 1000
          })
        }
      })
    },
    submitUrge() {
      this.addUrge.creatorId = localStorage.getItem('agentId')
      this.addUrge.creatorName = localStorage.getItem('agentName')
      addUrge(this.addUrge).then(res => {
        if (res.data.code === 0) {
          this.cancelUrge()// 清缓存
          this.getWorkFormRecord()// 查询列表
        } else {
          this.$message({
            message: res.data.message || '催办失败',
            type: 'error',
            duration: 1000
          })
          return
        }
      })
    },
    cancelUrge() {
      this.urgeVisible = false
      this.addUrge = {
        workformRecordId: null,
        workformRecordName: '',
        urgeContent: '',
        creatorId: '',
        creatorName: ''
      }
    },
    toAddUrge(workFormRecordId) {
      const vm = this
      getWorkFormRecordDetail(workFormRecordId).then(res => {
        if (res.data.code === 0 && res.data.data) {
          vm.addUrge.workformRecordId = (res.data.data.id == null) ? '' : res.data.data.id
          vm.addUrge.workformRecordName = (res.data.data.name == null) ? '' : res.data.data.name
        } else {
          vm.$message({
            message: res.data.message || '未查到工单记录',
            type: 'error',
            duration: 1000
          })
          return
        }
      })
      this.urgeVisible = true
    },
    reSendMsg(id) {
      this.$confirm('确认重发短信？', '请确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        reSendMsg(id).then(res => {
          if (res.data && res.data.code === 0) {
            this.$message({
              message: res.data.message,
              type: 'success',
              duration: 1000
            })
          } else {
            this.$message({
              message: res.data.message || '未知错误',
              type: 'error',
              duration: 1000
            })
          }
        })
      })
    },
    resetReq() { // 工单记录查询的重置按钮
      this.searchWorkFormRecord = {
        customerId: null,
        name: '',
        modifierName: '',
        timeStart: null,
        timeEnd: null,
        pageNo: 1,
        pageSize: 10 }
      this.timeValue = null
    },
    formatSeconds: formatSeconds,
    hideIdNumber: hideIdNumber,
    hideMobile: hideMobile,
    getCustomerInfoByPhone() {
      getCustomerInfoByPhone(this.customerPhone).then(response => {
        this.customerInfos = response.data.data
        sessionStorage.setItem('inCall_customerInfos', JSON.stringify(this.customerInfos))
        this.menuCustomerName = clone(this.customerInfos.customerName)
        this.createCustomerInfosFormVisbile(response.data.data)
        // 地址信息回显
        if (this.customerInfos.addressResultInfos.length) this.customerVmodels = clone(this.customerInfos.addressResultInfos)
        for (let i = 0; i < this.customerVmodels.length; i++) {
          for (const key in this.customerVmodels[i]) {
            if (key.indexOf('modifier') !== -1) {
              delete this.customerVmodels[i][key]
            }
          }
        }
      }).catch(error => {
        throw error
      })
    },
    handleChangeWorkFormSwitch(val) {
      if (!val) {
        this.selectedServiceList = []
        this.selectedWorkFormId = ''
        this.addWorkFormTabVisible = false
        this.activeName = '4'
        this.getWorkFormRecord()
      }
    },
    handleTabRemove(targetName) {
      if (targetName === '6') { // 关闭服务记录详情
        this.recordDailTabVisible = false
        this.showPlayer = false
        this.activeName = '2'
      } else if (targetName === '7') { // 关闭工单记录详情
        this.workFormRecordTabVisible = false
        this.activeName = '4'
      }
    },
    handleTabClick(tab) {
      console.log(tab)
      if (tab.name === '1') { // 基本信息
        console.log('基本信息')
      } else if (tab.name === '2') { // 服务记录
        this.getContactList()
      } else if (tab.name === '3') { // 话术知识库
        console.log('话术知识库')
      } else if (tab.name === '4') { // 工单记录
        this.getWorkFormRecord()
      } else if (tab.name === '8') {
        this.getHotelList()
      }
    },
    // 基本信息--------------1
    // 初始化联系信息及地址信息表单显示隐藏数据
    createCustomerInfosFormVisbile(customerInfo) {
      getRegion(0).then(res => {
        if (res.data.code === 0) {
          this.provincesCache = res.data.data
          customerInfo.addressResultInfos.forEach(() => {
            this.provinces.push(res.data.data)
            this.customerInfosFormVisbile['addressResultInfos'].push(false)
          })
        }
      }).catch(error => {
        throw error
      })
      customerInfo.linkResultInfos.forEach(() => {
        this.customerInfosFormVisbile['linkResultInfos'].push(false)
      })
    },
    // 编辑时显示隐藏表单
    customerInfosFormToggle(fieldName, index, val) {
      this.showDefaultBtn = false
      if (index === 0 || index) {
        if (this.customerInfos[fieldName][index].isAdd) {
          this.showDefaultBtn = true
          this.customerInfos[fieldName].splice(index, 1)
          this.customerInfosFormVisbile[fieldName].splice(index, 1)
          if (fieldName === 'addressResultInfos') {
            this.customerVmodels.splice(index, 1)
          }
        } else {
          this.$set(this.customerInfosFormVisbile[fieldName], index, val)
          this.showDefaultBtn = !val
          // this.customerInfos = JSON.parse(sessionStorage.getItem('inCall_customerInfos'))
          if (fieldName === 'addressResultInfos') {
            // 还原回显数据
            this.customerVmodels = clone(this.customerInfos.addressResultInfos)
            for (let i = 0; i < this.customerVmodels.length; i++) {
              for (const key in this.customerVmodels[i]) {
                if (key.indexOf('modifier') !== -1) {
                  delete this.customerVmodels[i][key]
                }
              }
            }
          }
        }
      } else {
        this.customerInfosFormVisbile[fieldName] = true
      }
    },
    cancelEditCustomer(fieldName) {
      const customerInfoSession = JSON.parse(sessionStorage.getItem('inCall_customerInfos'))
      this.customerInfos[fieldName] = clone(customerInfoSession[fieldName])
      // this.customerInfos = JSON.parse(sessionStorage.getItem('inCall_customerInfos'))
      this.customerInfosFormVisbile[fieldName] = false
      this.showDefaultBtn = true
    },
    // 点击添加联系信息
    handleAddContactInfo() {
      this.showDefaultBtn = false
      const lastOne = this.customerInfosFormVisbile.linkResultInfos[this.customerInfosFormVisbile.linkResultInfos.length - 1]
      if (lastOne) {
        this.$message.error('请先提交当前添加的联系信息再继续添加')
        return false
      }
      this.customerInfos.linkResultInfos.push({ isAdd: true, linkType: 0, customerId: this.customerInfos.customerId })
      this.customerInfosFormVisbile.linkResultInfos.push(true)
    },
    // 点击添加地址信息
    handleAddAddressInfo(index) {
      this.showDefaultBtn = false
      const lastOne = this.customerInfosFormVisbile.addressResultInfos[this.customerInfosFormVisbile.addressResultInfos.length - 1]
      if (lastOne) {
        this.$message.error('请先提交当前添加的地址信息再继续添加')
        return false
      }
      this.provinces.push(this.provincesCache)
      this.customerInfos.addressResultInfos.push({ isAdd: true })
      this.customerInfosFormVisbile.addressResultInfos.push(true)
      this.customerVmodels.push({ province: '', city: '', district: '', detail: '' })
    },
    // 编辑并回显客户地址信息
    handleEditRegion(index) {
      this.showDefaultBtn = false
      this.customerInfosFormToggle('addressResultInfos', index, true)
      getRegion(this.customerInfos.addressResultInfos[index].province).then(res => {
        if (res.data.code === 0) {
          this.$set(this.cities, index, res.data.data)
        }
      }).catch(error => {
        throw error
      })
      getRegion(this.customerInfos.addressResultInfos[index].city).then(res => {
        if (res.data.code === 0) {
          this.$set(this.districts, index, res.data.data)
        }
      }).catch(error => {
        throw error
      })
    },
    getProvince() {
      getRegion(0).then(res => {
        if (res.data.code === 0) {
          this.provinces = res.data.data
        }
      }).catch(error => {
        throw error
      })
    },
    getCities(parentid, index) {
      getRegion(parentid).then(res => {
        if (res.data.code === 0) {
          this.customerVmodels[index].city = ''
          this.customerVmodels[index].district = ''
          this.$set(this.cities, index, res.data.data)
          console.log('getCities', res.data.data)
          if (res.data.data[0].regionLevel === 2 && res.data.data.length === 1) {
            this.customerVmodels[index].city = res.data.data[0].regionCode
            this.getDistricts(res.data.data[0].regionCode, index)
          }
        }
      })
    },
    getDistricts(parentid, index) {
      getRegion(parentid).then(res => {
        if (res.data.code === 0) {
          this.$set(this.districts, index, res.data.data)
          this.customerVmodels[index].district = ''
        }
      })
    },
    // 初始化修改客户请求参数
    createCustomerEditReq(fieldName) {
      let result = true
      this.customerEditReq = {
        customer: {},
        customerAddresses: [],
        customerLinks: [],
        customerCars: []
      }
      this.customerEditReq.customer.customerId = this.customerInfos.customerId
      if (fieldName === 'linkResultInfos') {
        const lastLink = this.customerEditReq.customerLinks[this.customerEditReq.customerLinks.length - 1]
        this.customerEditReq.customerLinks = this.customerInfos.linkResultInfos
        if (lastLink && !lastLink.linkValue) {
          this.$message.error('添加的联系信息不能为空')
          result = false
        }
      } else if (fieldName === 'addressResultInfos') {
        const lastAddress = this.customerVmodels[this.customerVmodels.length - 1]
        if (this.customerVmodels.length === 1) this.customerVmodels[0]['isDefault'] = 1
        this.customerEditReq.customerAddresses = this.customerVmodels
        if (lastAddress && !lastAddress.province) {
          this.$message.error('添加的地址信息的省份不能为空')
          result = false
        }
      } else {
        this.customerEditReq.customer.customerName = this.customerInfos.customerName
        this.customerEditReq.customer.customerSex = this.customerInfos.customerSex
        this.customerEditReq.customer.idNo = this.customerInfos.idNo
      }
      return result
    },
    // 校验修改信息
    valiCustomer() {
      let result = true
      const reg_ID = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      // const reg_phone = /^[1][3,4,5,6,7,8][0-9]{9}$/
      const customer = this.customerEditReq.customer
      // const customerAddresses = this.customerEditReq.customerAddresses
      // const customerLinks = this.customerEditReq.customerLinks
      if (customer.idNo && (!reg_ID.test(customer.idNo))) {
        this.$message.error('请输入正确的身份证号！')
        result = false
      }
      return result
    },
    // 修改客户信息
    editCustomer(fieldName, index, val) {
      if (!this.createCustomerEditReq(fieldName)) {
        return false
      }
      if (!this.valiCustomer()) {
        return false
      }
      // 隐藏表单
      if (index === 0 || index) {
        this.$set(this.customerInfosFormVisbile[fieldName], index, val)
      } else {
        this.customerInfosFormVisbile[fieldName] = false
      }
      editCustomer(this.customerEditReq).then(response => {
        if (response.data.code === 0) {
          this.showDefaultBtn = true
          this.$message.success(response.data.message)
          getCustomerInfoByPhone(this.customerPhone).then(response => {
            this.customerInfos[fieldName] = response.data.data[fieldName]
            sessionStorage.setItem('inCall_customerInfos', JSON.stringify(this.customerInfos))
            this.menuCustomerName = clone(this.customerInfos.customerName)
            // 地址信息回显
            if (fieldName === 'addressResultInfos') this.customerVmodels = clone(this.customerInfos.addressResultInfos)
            for (let i = 0; i < this.customerVmodels.length; i++) {
              for (const key in this.customerVmodels[i]) {
                if (key.indexOf('modifier') !== -1) {
                  delete this.customerVmodels[i][key]
                }
              }
            }
          })
        } else {
          this.$set(this.customerInfosFormVisbile[fieldName], index, true)
          this.$message.error(response.data.message)
        }
      }).catch(error => {
        this.$set(this.customerInfosFormVisbile[fieldName], index, true)
        throw error
      })
    },
    // 设置默认地址或联系方式
    setDefaultAddress(fieldName, index, val) {
      for (let i = 0; i < this.customerInfos.addressResultInfos.length; i++) {
        index === i ? this.customerVmodels[i].isDefault = 1 : this.customerVmodels[i].isDefault = 0
      }
      this.editCustomer(fieldName, index, val)
    },
    setDefaultLink(fieldName, index, val) {
      for (let i = 0; i < this.customerInfos.linkResultInfos.length; i++) {
        index === i ? this.customerInfos.linkResultInfos[i].isUsually = 1 : this.customerInfos.linkResultInfos[i].isUsually = 0
      }
      this.editCustomer(fieldName, index, val)
    },
    // 服务记录--------------2
    resetServiceRecordForm() {
      this.searchContactListReq.contactType = ''
      this.searchContactListReq.callDirection = ''
    },
    showRecordDailTab() { // 只是显示服务记录详情，如需增加tab必须另写方法
      this.recordDailTabVisible = true
      this.activeName = '6'
    },
    // 查询服务记录（接触历史）
    getContactList() {
      this.searchContactListReq2 = clone(this.searchContactListReq)
      getContactList(this.searchContactListReq).then(response => {
        if (response.data.code === 0) {
          this.contactList = response.data.data
          this.serviceRecordPagination = response.data.pageInfo || this.defaultPagination
        } else {
          this.$message.error(response.data.message)
        }
      }).catch(error => {
        throw error
      })
    },
    // 服务记录详情
    contactDetail() {
      this.ids.customerId = this.customerInfos.customerId
      this.ids.agentId = this.agentId
      this.showRecordDailTab()
      getContactByGradeId(this.ids.recordId).then(response => {
        if (response.data.code === 0) {
          this.$set(this.detailInfo, 'contactInfo', response.data.data)
          this.showPlayer = true
          const a = response.data.data.summaryDetailInfos.map(function(item, index) {
            if (item) {
              return item.id
            } else {
              return
            }
          })
          this.keys = []
          this.keys = a
        }
      })
      getStaffNameByAgentId(this.ids.agentId).then(response => {
        if (response.data.code === 1) {
          this.detailInfo.staffInfo = response.data.data[0]
        }
      })
      // queryTaskByTaskId(this.ids.taskId).then(response => {
      //   if (response.data.code === 0) {
      //     this.detailInfo.dialTaskInfo = response.data.data
      //     this.originalStatus = response.data.data.status
      //   }
      // })
      querycustomerbyid(this.ids.customerId).then(response => {
        if (response.data.code === 0) {
          this.detailInfo.customerInfo = response.data.data
        }
      })
    },
    // 详情小结展示
    showSummaryInfo(summary) {
      var html = []
      if (!summary || summary.length === 0) {
        html.push('无')
      } else {
        for (var j in summary) {
          html.push(summary[j].name)
        }
      }
      return html.join('，')
    },
    handleServiceRecordSizeChange(val) {
      this.searchContactListReq2 = clone(this.searchContactListReq)
      this.searchContactListReq2.pageSize = val
      this.searchContactListReq.pageSize = val
      this.searchContactListReq.pageNo = 1
      this.serviceRecordPagination.pageNo = 1
      this.getContactList()
    },
    handleServiceRecordCurrentChange(val) {
      this.searchContactListReq2 = clone(this.searchContactListReq)
      this.searchContactListReq2.pageNo = val
      this.searchContactListReq.pageNo = val
      this.getContactList()
    },
    // 话术知识库------------3
    // 工单记录--------------4
    // 查询工单记录
    getWorkFormRecord() {
      console.log('into getWorkFormRecord customerInfos =', this.customerInfos)
      this.searchWorkFormRecord2 = clone(this.searchWorkFormRecord)
      this.searchWorkFormRecord.customerId = this.customerInfos.customerId
      this.searchWorkFormRecord.timeStart = this.timeValue ? this.timeValue[0] : null
      this.searchWorkFormRecord.timeEnd = this.timeValue ? this.timeValue[1] : null
      getWorkFormRecord(this.searchWorkFormRecord).then(response => {
        console.log('工单记录', response.data.data)
        if (response.data.code === 0) {
          this.workFormRecordList = response.data.data
          this.workFormRecordPagination = response.data.pageInfo || this.defaultPagination
        } else {
          this.$message.error(response.data.message)
        }
      }).catch(error => {
        throw error
      })
    },
    workFormRecordSizeChange(val) {
      this.searchWorkFormRecord2 = clone(this.searchWorkFormRecord)
      this.searchWorkFormRecord2.customerId = this.customerInfos.customerId
      this.searchWorkFormRecord2.pageSize = val
      this.searchWorkFormRecord.pageSize = val
      this.searchWorkFormRecord.pageNo = 1
      this.workFormRecordPagination.pageNo = 1
      this.getWorkFormRecord()
    },
    workFormRecordCurrentChange(val) {
      this.searchWorkFormRecord2 = clone(this.searchWorkFormRecord)
      this.searchWorkFormRecord2.pageNo = val
      this.searchWorkFormRecord.pageNo = val
      this.getWorkFormRecord()
    },
    // 工单记录详情
    getWorkFormRecordDetail(id) {
      getWorkFormRecordDetail(id).then(response => {
        if (response.data.data) {
          this.workFormRecordTabVisible = true
          this.activeName = '7'
          this.workformRecordDetail = response.data.data
          this.workformRecordContent = response.data.data.workformRecordRuleResults
        } else {
          this.$message.error(response.data.message)
        }
      }).catch(error => {
        throw error
      })
    },
    // 新建工单----------5
    // 查询工单模板
    getWorkFormTempById() {
      getWorkFormTempById(this.selectedWorkFormId).then(response => {
        if (response.data.code === 0) {
          this.showWorkFormTemp(response.data.data)
        } else {
          this.$message.error(response.data.message)
        }
      }).catch(error => {
        throw error
      })
    },
    // 根据工单模板展示工单,初始化需绑定的绑定数据
    showWorkFormTemp(tempInfo) {
      this.workformInfo = tempInfo
      this.addWorkForm.name = this.workformInfo.name
      this.addWorkForm.workformRecordRuleCreateInfos = []
      this.workformInfo.workformProperties.forEach((item) => {
        if (item.dataType === 'checkbox' || item.dataType === 'multipleSelect') {
          this.addWorkForm.workformRecordRuleCreateInfos.push({
            workformProperty: item.id,
            recordValue: []
          })
        } else if (item.dataType === 'input') {
          this.addWorkForm.workformRecordRuleCreateInfos.push({
            workformProperty: item.id,
            recordValue: item.defaultValue
          })
        } else if (item.dataType === 'span') {
          this.addWorkForm.workformRecordRuleCreateInfos.push({
            workformProperty: item.id,
            recordValue: item.defaultValue
          })
        } else {
          this.addWorkForm.workformRecordRuleCreateInfos.push({
            workformProperty: item.id,
            recordValue: null
          })
        }
      })
    },
    // 展示多选类表单对应值的label
    showSelectValue(type, options, val) {
      const obj = options ? JSON.parse(options) : {}
      const arr = []
      let val2
      if (type === 'multipleSelect' || type === 'checkbox') {
        val2 = JSON.parse(JSON.stringify(val.split(',')))
      }
      let result
      if (val2 !== undefined && val2.length) {
        for (var key in obj) {
          val2.forEach(item => {
            if (key === item) {
              arr.push(obj[key])
            }
          })
        }
        return arr.join(',')
      } else {
        for (var key2 in obj) {
          if (key2 === val) result = obj[key2]
        }
        return result
      }
    },
    // 初始化添加工单请求数据
    createAddWorkForm() {
      // this.addWorkForm.name = this.workformInfo.name
      this.addWorkForm.workformId = this.selectedWorkFormId
      this.addWorkForm.customerName = this.customerInfos.customerName
      this.addWorkForm.customerId = this.customerInfos.customerId
      this.addWorkForm.customerPhone = this.customerPhone.toString()
      this.addWorkForm.creatorId = localStorage.getItem('agentId')
      this.addWorkForm.status = 0
      this.addWorkForm.creatorName = localStorage.getItem('agentName')
    },
    resetAll() {
      this.addWorkForm.name = null
      this.addWorkForm.workformId = null
      this.addWorkForm.customerId = null
      this.addWorkForm.customerName = null
      this.addWorkForm.customerPhone = null
      this.addWorkForm.creatorId = null
      this.addWorkForm.status = null
      this.addWorkForm.creatorName = null
      this.addWorkForm.workServiceMenuId = null
      this.isAddWorkOrder = false
      this.addWorkForm.workformRecordRuleCreateInfos.forEach((item, index) => {
        this.addWorkForm.workformRecordRuleCreateInfos[index].recordValue = null
      })
      this.recordSummaryCreateInfo.description = null
      this.recordSummaryCreateInfo.summaryIds = []
      // this.recordSummaryCreateInfo.taskStatus = null // 任务状态 1 预约,2 完成,3 失败
      // this.$store.commit('SET_CUSTOMER_INFOS', [])
      // this.$store.commit('SET_CUSTOMER_PHONE', null)
      this.customerPhoneAddress = null
      this.customerInfos = { cuatomerName: '', cuatomerId: null }
      this.selectedServiceList = []
    },
    // 生成校验
    workFormRules(formInfo) {
      const regex = new RegExp(formInfo.regex)
      if (formInfo.isRequired && formInfo.regex) {
        return [
          { required: true, message: '请输入内容', trigger: 'blur' },
          { pattern: regex, message: '请输入正确的内容', trigger: 'blur' }
        ]
      } else if (formInfo.isRequired && !formInfo.regex) {
        return [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      } else if (!formInfo.isRequired && formInfo.regex) {
        return [
          { pattern: regex, message: '请输入正确的内容', trigger: 'blur' }
        ]
      } else {
        return []
      }
    },
    checkSummaryIds() {
      if (this.recordSummaryCreateInfo.summaryIds && this.recordSummaryCreateInfo.summaryIds.length === 0) {
        this.isAddWorkOrder = false
        this.$message.error('请先选择话后小结')
      }
    },
    // 小结级联选择事件
    handleNoduleChange(arr) {
      var checkedSummaryId = arr[arr.length - 1]
      this.recordSummaryCreateInfo.summaryIds = arr
      console.log(checkedSummaryId)
      // 查询所有服务目录
      getServiceList().then(response => {
        if (response.data.code === 0) {
          this.serviceList = clone(response.data.data)
          const serviceListFullTree = list2Tree({ data: response.data.data, rootId: 0 })
          // 比对小结对应的服务目录(暂时写死)
          switch (checkedSummaryId) {
            case '14': // 咨询
              this.serviceListTree = serviceListFullTree.filter(item => {
                return (item.id === 1)
              })
              break
            case '15': // 预定
              this.serviceListTree = serviceListFullTree.filter(item => {
                return (item.id === 2)
              })
              break
            case '16': // 退货
              this.serviceListTree = serviceListFullTree.filter(item => {
                return (item.id === 4)
              })
              break
            case '17': // 投诉
              this.serviceListTree = serviceListFullTree.filter(item => {
                return (item.id === 3)
              })
              break
            case '18': // 催办
              this.serviceListTree = serviceListFullTree.filter(item => {
                return (item.id === 80)
              })
              break
          }
        } else {
          this.$message.error(response.data.message)
        }
      }).catch(error => {
        throw error
      })
    },
    // 服务目录级联选择事件
    handleServiceListChange(arr) {
      this.addWorkForm.workServiceMenuId = arr[arr.length - 1]
      if (arr.length <= 2) {
        this.selectedServiceList = []
        this.$message.error('请选择服务项目')
      } else {
        for (let i = 0; i < this.serviceList.length; i++) {
          if (this.serviceList[i].id === arr[arr.length - 1]) {
            this.selectedWorkFormId = this.serviceList[i].workFormId
            this.addWorkFormTabVisible = true
            this.activeName = '5'
          }
        }
        this.getWorkFormTempById(this.selectedWorkFormId)
      }
    },
    recordSummaryInfo() {
      recordSummaryInfo(this.recordSummaryCreateInfo).then(response => {
        if (response.data.code === 0) {
          this.resetAll()
          this.addWorkFormTabVisible = false
          this.$message.success('操作成功')
          this.changeKeepReady('0')
          this.activeName = '1'
          this.$store.commit('SET_NAV_INCOMING_CALL', false)
          this.$root.eventHub.$emit('SET_INCOMING_CALL', true)
          sessionStorage.removeItem('inCall_customerPhone')
          sessionStorage.removeItem('inCall_customerInfos')
          sessionStorage.removeItem('inCall_recordId')
          this.$store.commit('SET_INCALL_CACHE', {})
          this.customerPhone = null
          this.menuCustomerName = null
          this.isConversation = {
            summaryDisabled: true,
            addWorkformDisabled: true,
            workformRecordVisible: false,
            completeButtonVisible: false
          }
        } else {
          this.$message.error(response.data.message)
        }
      }).catch(error => {
        throw error
      })
    },
    // 提交前校验
    submitForm(formName) {
      const vm = this
      const forms = vm.$refs[formName]
      this.workformVali = []
      this.canSubmit = true
      if (forms) {
        for (let i = 0; i < forms.length; i++) {
          forms[i].validate((valid) => {
            if (valid) {
              this.workformVali.push(true)
            } else {
              this.workformVali.push(false)
            }
          })
        }
      }
      this.canSubmit = !this.workformVali.includes(false)
      if (this.canSubmit) {
        if (!this.recordSummaryCreateInfo.summaryIds) {
          this.$message.error('请选择话后小结')
          return false
        }
        this.createAddWorkForm()
        if (!this.addWorkForm.name) {
          this.$message.error('请输入工单名称')
        }
        addWorkFormRecord(this.addWorkForm).then(response => {
          if (response.data.code === 0) {
            this.recordSummaryInfo()
          } else {
            this.$message.error(response.data.message)
          }
        }).catch(error => {
          throw error
        })
      } else {
        this.$message.error('请将工单填写完整后提交 ')
      }
    },
    // 提交完成
    handleSubmit() {
      if (!this.recordSummaryCreateInfo.summaryIds) {
        this.$message.error('请选择话后小结')
        return false
      }
      if (this.isAddWorkOrder) {
        this.submitForm('workform')
      } else {
        this.recordSummaryInfo()
      }
    },
    // 改为就绪状态
    changeKeepReady(val) {
      this.$store.commit('SET_KEEPREADY', val)
    },
    // 酒店信息-----------------8
    getHotelList() {
      this.searchHotelReq2 = clone(this.searchHotelReq)
      getHotelList(this.searchHotelReq).then(response => {
        if (response.data.code === 0) {
          this.hotelTableData = response.data.data
          this.hotelPagination = response.data.pageInfo
        } else {
          this.$message.error(response.data.message)
        }
      }).catch(error => {
        throw error
      })
    },
    resetHotelReq() {
      this.searchHotelReq.name = ''
      this.searchHotelReq.country = ''
      this.searchHotelReq.city = ''
      this.searchHotelReq.status = ''
      this.searchHotelReq.offerType = ''
      this.searchHotelReq2 = clone(this.searchHotelReq)
    },
    hotelSizeChange(val) {
      this.searchHotelReq2 = clone(this.searchHotelReq)
      this.searchHotelReq2.pageSize = val
      this.searchHotelReq.pageSize = val
      this.searchHotelReq.pageNo = 1
      this.hotelPagination.pageNo = 1
      this.getHotelList()
    },
    hotelCurrentChange(val) {
      this.searchHotelReq2 = clone(this.searchHotelReq)
      this.searchHotelReq2 = clone(this.searchHotelReq)
      this.searchHotelReq2.pageNo = val
      this.searchHotelReq.pageNo = val
      this.getHotelList()
    },
    // -----------------------
    handleChangeAcitve(active = [1]) {
      if (active.length) {
        $('.form-more').text('收起')
      } else {
        $('.form-more').text('更多')
      }
    },
    basicInfoChangeAcitve(active) {
      for (var i = 0; i < this.callInfoActive.length; i++) {
        if (active.indexOf(i) !== -1) {
          this.callInfoActive[i] = '收起'
        } else {
          this.callInfoActive[i] = '更多'
        }
      }
    },
    hideEmoji(e) {
      var emoji_div = document.getElementById('emoji_div')
      if (emoji_div) {
        if (!emoji_div.contains(e.target)) {
          this.showEmojis = false
        }
      }
    },
    showMsgs(content) {
      const qq_reg =
        "(/::\\)|/::~|\\[囧\\]|\\[挥手\\]|/::B|/::\\||/:8-\\)|/::<|/::\\$|/::X|/::Z|/::'\\(|/::-\\||/::@|/::P|/::D|/::O|/::\\(|/::\\+|/:--b|/::Q|/::T|/:,@P|/:,@-D|/::d|/:,@o|/::g|/:\\|-\\)|/::!|/::L|/::>|/::,@|/:,@f|/::-S|/:\\?|/:,@x|/:,@@|/::8|/:,@!|/:!!!|/:xx|/:bye|/:wipe|/:dig|/:handclap|/:&-\\(|/:B-\\)|/:<@|/:@>|/::-O|/:>-\\||/:P-\\(|/::'\\||/:X-\\)|/::\\*|/:@x|/:8\\*|/:pd|/:<W>|/:beer|/:basketb|/:oo|/:coffee|/:eat|/:pig|/:rose|/:fade|/:showlove|/:heart|/:break|/:cake|/:li|/:bome|/:kn|/:footb|/:ladybug|/:shit|/:moon|/:sun|/:gift|/:hug|/:strong|/:weak|/:share|/:v|/:@\\)|/:jj|/:@@|/:bad|/:lvu|/:no|/:ok|/:love|/:<L>|/:jump|/:shake|/:<O>|/:circle|/:kotow|/:turn|/:skip|/:oY|/:\\#-0|/:hiphot|/:kiss|/:<&|/:&>)"
      const emoji_reg = this.reg_emojis
      var array = ''
      while ((array = content.match(qq_reg)) !== null) {
        const index = this.unicoded_qq_face.indexOf(array[0])
        content = content.replace(
          new RegExp(qq_reg),
          "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/" +
            index +
            ".gif' align='middle' width='26px' height='26px'>"
        )
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
      return (
        `<img src="https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/${index}.gif" align="middle" width="26px" height="26px" alt="` +
        word +
        `">`
      )
    },
    // 将匹配结果替换emoji
    emotion1(res) {
      const word = res.replace(/\#|\;/gi, '')
      const imgName = this.showData(word)
      return (
        `<img src="../../../static/emoji/` +
        imgName +
        `" align="middle" width='26px' height='26px' alt="` +
        this.findKey(this.emojiData, imgName) +
        `">`
      )
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
    // 时间戳转年月日时分秒
    formatDateTime: formatDateTime,
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
      var word = this.$refs.myMessages_div.innerHTML
        .replace(new RegExp(/&nbsp;/g), ' ')
        .replace(/<br>/g, '\n')
        .replace(/<div(([\s\S])*?)<\/div>/g, '')
      const patten = /(.*?)<img.+?alt=('|")(.*?)\2.*?>([^<]*)/gi
      let resultStr = ''
      let str = ''
      while ((str = patten.exec(word)) !== null) {
        resultStr += str[1] + str[3] + str[4]
      }
      resultStr = this.htmlspecialchars_decode(resultStr)
        .replace(new RegExp(/&nbsp;/g), ' ')
        .replace(/<br>/g, '\n')
        .replace(/<div(([\s\S])*?)<\/div>/g, '')
      let content = ''
      let mediaUrl = ''
      let json = {}
      let message = {}
      const phone = this.customerPhone
      const customerId = this.customerId
      const index = this.contents.length
      // 获取div里输入的内容
      const myMessages =
        this.$refs.myMessages_div.innerHTML.indexOf('<img src') > -1
          ? resultStr
          : word
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
          json = {
            createTime: formatDateTime(new Date()),
            direction: '1',
            code: '2',
            content: encodeURI(content),
            phone: phone,
            msgType: 'link',
            staffId: localStorage.getItem('agentId')
          }
          this.contents.splice(index, 1, json)
          // 清空文字输入框里的内容
          this.myMessages = ''
          this.$refs.myMessages_div.innerText = ''
          message = {
            customerId: customerId,
            content: encodeURI(content),
            msgType: 'link',
            sessionId: this.sessionId
          }
        } else {
          // 刚开始发送时 receiveState: 1表示发送消息  0为接受消息   code: 0 发送成功  2 显示loading标志 4 显示warning标志
          json = {
            createTime: formatDateTime(new Date()),
            direction: '1',
            code: '2',
            content: content,
            phone: phone,
            msgType: 'text',
            staffId: localStorage.getItem('agentId')
          }
          this.contents.splice(index, 1, json)
          // 清空文字输入框里的内容
          this.myMessages = ''
          this.$refs.myMessages_div.innerHTML = ''
          message = {
            customerId: customerId,
            content: content,
            msgType: 'text',
            sessionId: this.sessionId
          }
        }
      } else if (type === 'image') {
        mediaUrl = this.DLurl[0].url
        // 刚开始发送时 receiveState: 1表示发送消息  0为接受消息   code: 0 发送成功  2 显示loading标志 4 显示warning标志
        json = {
          createTime: formatDateTime(new Date()),
          direction: '1',
          code: '2',
          mediaUrl: mediaUrl,
          phone: phone,
          msgType: 'image',
          staffId: localStorage.getItem('agentId')
        }
        this.contents.splice(index, 1, json)
        // 清空文字输入框里的内容
        this.myMessages = ''
        this.$refs.myMessages_div.innerText = ''
        message = {
          customerId: customerId,
          mediaUrl: mediaUrl,
          msgType: 'image',
          sessionId: this.sessionId
        }
      } else if (type === 'file') {
        mediaUrl = this.DLurl[0].url
        // 刚开始发送时 receiveState: 1表示发送消息  0为接受消息   code: 0 发送成功  2 显示loading标志 4 显示warning标志
        json = {
          createTime: formatDateTime(new Date()),
          direction: '1',
          code: '2',
          content: encodeURI(mediaUrl),
          phone: phone,
          msgType: 'file',
          staffId: localStorage.getItem('agentId')
        }
        this.contents.splice(index, 1, json)
        // 清空文字输入框里的内容
        this.myMessages = ''
        this.$refs.myMessages_div.innerText = ''
        message = {
          customerId: customerId,
          content: encodeURI(mediaUrl),
          msgType: 'file',
          sessionId: this.sessionId
        }
      }
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
        })
        .catch(error => {
          // 服务出错时 将loading标志换为waring标志
          json.code = '4'
          this.contents.splice(index, 1, json)
          console.log(error)
        })
      const contentDiv = document.getElementById('short-message-content')
      const contentDivBox = document.getElementById(
        'short-message-content-container'
      )
      setTimeout(() => {
        contentDivBox.scrollTop = contentDiv.scrollHeight
      }, 10)
      this.contents.splice(index, 1, json)
    },
    // 再次请求发送消息
    sendMessageAgain(item, index) {
      const json = item
      console.log(json)
      json.code = '2'
      this.contents.splice(index, 1, json)
      let message = {}
      if (item.msgType === 'text') {
        message = {
          customerId: this.customerId,
          content: item.content,
          msgType: item.msgType,
          sessionId: this.sessionId
        }
      } else {
        message = {
          customerId: this.customerId,
          mediaUrl: item.mediaUrl,
          msgType: item.msgType,
          sessionId: this.sessionId
        }
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
        })
        .catch(error => {
          // 服务出错时 将loading标志换为waring标志
          json.code = '4'
          this.contents.splice(index, 1, json)
          console.log(error)
        })
    },
    // 点击列表时显示客户姓名 获取聊天记录
    showNameAndSearchRecords(
      customerName,
      customerPhone,
      taskId,
      campaignId,
      customerId,
      unreadNum
    ) {
      // 将之前isTalking(如果有)设置为false
      for (var i = 0; i < this.customerInfos.length; i++) {
        if (this.customerInfos[i].isTalking === true) {
          this.customerInfos[i].isTalking = false
        }
      }
      // 将本次点击的isTalking设置为true
      for (var k = 0; k < this.customerInfos.length; k++) {
        if (this.customerInfos[k].taskId === taskId) {
          this.customerInfos[k].isTalking = true
        }
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
      this.customerPhoneHeader = customerPhone
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
      const contentDivBox = document.getElementById(
        'short-message-content-container'
      )
      setTimeout(() => {
        contentDivBox.scrollTop = contentDiv.scrollHeight
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
            navbarQueryRecords(localStorage.getItem('agentId')).then(
              response => {
                this.$store.commit(
                  'CHANGE_WECHATMSG',
                  (response.data.pageInfo || this.defaultPagination).totalCount
                )
              }
            )
          }
        }
      }
      // return new Promise((resolve) => {
      //   resolve()
      // })
    },
    changeCustomerTalking(index) {
      this.customerInfos = JSON.parse(localStorage.getItem('customerInfos')) || { cuatomerName: '', cuatomerId: null }
      for (let i = 0; i < this.customerInfos.length; i++) {
        this.customerInfos[i].isTalking = false
      }
      this.customerInfos[index].isTalking = true
      localStorage.setItem('customerInfos', JSON.stringify(this.customerInfos))
      this.$store.commit('SET_WECHATCUSTOMERINFO', this.customerInfos)
    },
    // 综合查询聊天记录
    getChatRecords(customerId, queryPageNum) {
      queryRecords(customerId, queryPageNum).then(response => {
        if (response.data.code === 0) {
          if (response.data.data) {
            if (queryPageNum === null) {
              // 不传页数默认查询第一页 把第一页数据直接放数组中
              this.contents = response.data.data
              const contentDiv = document.getElementById(
                'short-message-content'
              )
              const contentDivBox = document.getElementById(
                'short-message-content-container'
              )
              setTimeout(() => {
                contentDivBox.scrollTop = contentDiv.scrollHeight
              }, 10)
              this.$store.commit('SET_WECHATCONTENTS', this.contents)
              // 判断是否还有更多消息记录
              if ((response.data.pageInfo || this.defaultPagination).totalPage > 1) {
                this.hasMoreRecords = true
              } else {
                this.hasMoreRecords = false
              }
            } else {
              for (var i = response.data.data.length - 1; i >= 0; i--) {
                this.contents.unshift(response.data.data[i])
              }
              this.$store.commit('SET_WECHATCONTENTS', this.contents)
              // 判断是否还有更多消息记录
              if ((response.data.pageInfo || this.defaultPagination).totalPage > queryPageNum) {
                this.hasMoreRecords = true
              } else {
                this.hasMoreRecords = false
              }
            }
          } else {
            this.contents = []
            this.$store.commit('SET_WECHATCONTENTS', this.contents)
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
                if (
                  this.customerInfos[i].customerId ===
                  response.data.data[j].customerId
                ) {
                  this.customerInfos[i].unreadNum = response.data.data[j].num
                }
              }
            }
          }
          this.$store.commit('SET_WECHATCUSTOMERINFO', this.customerInfos)
          localStorage.setItem(
            'customerInfos',
            JSON.stringify(this.customerInfos)
          )
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
                  if (
                    this.customerInfos[i].customerId ===
                    response.data.data[j].customerId
                  ) {
                    this.customerInfos[i].unreadNum = response.data.data[j].num
                  }
                }
              }
            }
            this.$store.commit('SET_WECHATCUSTOMERINFO', this.customerInfos)
            localStorage.setItem(
              'customerInfos',
              JSON.stringify(this.customerInfos)
            )
          })
        }
      })
    },
    // 查询未读消息(聊天对象)
    navbarQueryRecords() {
      navbarQueryRecords(localStorage.getItem('agentId')).then(response => {
        if (response.data.code === 0) {
          this.$store.commit(
            'CHANGE_WECHATMSG',
            (response.data.pageInfo || this.defaultPagination).totalCount
          )
        }
      })
    },
    // 获取div里的文字信息
    transferToWords(name) {
      return name.replace(/^\s+/, '').replace(/\s+$/, '')
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
        this.customerColumnInfos = []
        if (res1.data.code === 0 && res1.data.data.customerColumnInfos) {
          for (let i = 0; i < res1.data.data.customerColumnInfos.length; i++) {
            this.customerColumnInfos.push(
              res1.data.data.customerColumnInfos[i].customerColumn
            )
          }
          this.customerColumnInfos.push(
            {
              customerColumn: 'customerName'
            },
            { customerColumn: 'customerPhone' }
          )
          this.campaignType = res1.data.data.campaignTypeInfo.code
          if (this.campaignType === 'RECRUIT') {
            this.isRecruit = true
          } else {
            this.isRecruit = false
          }
        }
      })
      // 判断是否有接触记录信息
      queryContactRecord(taskId, campaignId).then(res2 => {
        if (res2.data.code === 0) {
          this.contactRecord = res2.data.data
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
      vm.uploadInfoReq.objectName =
        localStorage.getItem('agentId') +
        '/' +
        date +
        '/' +
        vm.timeStamp +
        '_' +
        formData.file.name
      uploadInfoReq2 = clone(this.uploadInfoReq)
      this.openFullScreen()
      getUploadInfo(uploadInfoReq2).then(response => {
        if (response.data.presignedPutUrl) {
          uploading(
            process.env.FILE_SERVER_URL,
            response.data.presignedPutUrl,
            formData,
            date,
            vm.timeStamp
          )
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
                  if (
                    vm.DLurl.length &&
                    formData.file.type.indexOf('image') !== -1
                  ) {
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
            message:
              '服务器上存在与' +
              vm.timeStamp +
              '_' +
              formData.file.name +
              '相同名字的文件，请删除或重命名后重新上传',
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
            this.$router.push({
              path: process.env.BUILT_IN_ROUTERS.myDialTask,
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
        this.dailTaskCustomer = JSON.parse(
          localStorage.getItem('customerInfos')
        )
        queryTaskByTaskId(this.dailTaskCustomer[0].taskId).then(response => {
          if (response.data.code === 0) {
            const isBlacklist = response.data.data.isBlacklist
            sessionStorage.setItem('isDialTask', false)
            this.$router.push({
              path: process.env.BUILT_IN_ROUTERS.myDialTask,
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
  watch: {
    incomingCall(val) {
      if (this.$route.path === '/incoming_call') {
        this.reloadCompoment()
      }
    },
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
    this.activeName = '1'
    console.log(this.incall_cache)
    if (!this.incall_cache.customerPhone) {
      // 获取路由传参的值
      // this.$store.dispatch('setCustomerInfosAndRecodId', { customerPhone: customerPhone, customerInfos: customerInfos, recordId: recordId })
      if (sessionStorage.getItem('inCall_customerInfos')) {
        this.customerPhone = sessionStorage.getItem('inCall_customerPhone')
        this.getCustomerInfoByPhone()
        this.customerInfos = JSON.parse(sessionStorage.getItem('inCall_customerInfos')) || { cuatomerName: '', cuatomerId: null }
        this.searchContactListReq.customerId = this.customerInfos ? this.customerInfos.customerId : ''
        this.recordSummaryCreateInfo.recordId = sessionStorage.getItem('inCall_recordId')
      } else {
        this.customerPhone = ''
        this.customerInfos = { cuatomerName: '', cuatomerId: null }
      }
      if (this.customerPhone) {
        this.customerActive = '1' // 进入界面默认选中第一个客户
        this.isConversation = {
          summaryDisabled: false,
          addWorkformDisabled: false,
          workformRecordVisible: true,
          completeButtonVisible: true
        }
      } else if (!this.customerPhone) {
        this.customerActive = ''
        this.isConversation = {
          summaryDisabled: true,
          addWorkformDisabled: true,
          workformRecordVisible: false,
          completeButtonVisible: false
        }
      }
      if (this.customerPhone) {
        // 查询号码归属地
        getPhoneAddress(this.customerPhone).then(response => {
          if (response.data.code === 0) {
            this.customerPhoneAddress = response.data.data
          } else {
            console.log(response.data.message) // 静默报错
          }
        }).catch(error => {
          throw error
        })
      }
      // 获取所有呼入小结
      getSummary().then(response => {
        if (response.data.code === 0) {
          this.nodulesTree = response.data.data
          console.log(this.nodulesTree)
        } else {
          this.$message.error(response.data.message)
        }
      }).catch(error => {
        throw error
      })
      // if (this.$route.query) {
      //   this.dailTaskCustomer.taskId = this.$route.query.taskId
      //   this.dailTaskCustomer.campaignId = this.$route.query.campaignId
      //   this.dailTaskCustomer.customerId = this.$route.query.customerId
      //   this.dailTaskCustomer.customerPhone = this.$route.query.customerPhone
      //   this.customerPhoneHeader = this.$route.query.customerPhone
      // } else if (!this.dailTaskCustomer) {
      //   this.dailTaskCustomer = this.customerInfos[0]
      //   this.customerPhoneHeader = this.customerInfos[0].customerPhone
      // }
      // // 查询所有客户列表
      // getWechatCustomer(localStorage.getItem('agentId')).then(response => {
      //   this.customerInfos = response.data.data
      //   this.$store.commit('SET_WECHATCUSTOMERINFO', this.customerInfo)
      //   localStorage.setItem('customerInfos', JSON.stringify(response.data.data))
      //   if (this.customerInfos.length) {
      //     if (this.$route.query && this.$route.query.fromDialTask === '0') {
      //       this.taskId = this.$route.query.taskId
      //       this.campaignId = this.$route.query.campaignId
      //       this.customerId = this.$route.query.customerId
      //       this.customerPhone = this.$route.query.customerPhone
      //       this.customerPhoneHeader = this.$route.query.customerPhone
      //       for (var a = 0; a < this.customerInfos.length; a++) {
      //         if (
      //           this.customerInfos[a].customerId === this.$route.query.customerId
      //         ) {
      //           this.customerInfos[a].isTalking = true
      //           this.customerActive = a.toString()
      //         } else {
      //           this.customerInfos[a].isTalking = false
      //         }
      //       }
      //       localStorage.setItem(
      //         'customerInfos',
      //         JSON.stringify(this.customerInfo)
      //       )
      //       // 展示客户信息
      //       this.showCustomerInfos(
      //         this.taskId,
      //         this.campaignId,
      //         this.customerId,
      //         this.customerPhone
      //       )
      //       // 获取聊天记录
      //       this.getChatRecords(this.$route.query.customerId, null)
      //       const contentDiv = document.getElementById('short-message-content')
      //       const contentDivBox = document.getElementById(
      //         'short-message-content-container'
      //       )
      //       setTimeout(() => {
      //         contentDivBox.scrollTop = contentDiv.scrollHeight
      //       }, 10)
      //     } else {
      //       this.customerActive = '0'
      //       const customerInfos = JSON.parse(
      //         localStorage.getItem('customerInfos')
      //       )
      //       this.customerInfos[0].isTalking = true
      //       for (var i = 1; i < this.customerInfos.length; i++) {
      //         this.customerInfos[i].isTalking = false
      //       }
      //       this.taskId = customerInfos[0].taskId
      //       const taskId = customerInfos[0].taskId
      //       const campaignId = customerInfos[0].campaignId
      //       const customerId = customerInfos[0].customerId
      //       const customerPhone = customerInfos[0].customerPhone
      //       this.customerId = customerInfos[0].customerId
      //       this.customerPhoneHeader = customerInfos[0].customerPhone
      //       this.customerName = customerInfos[0].customerName
      //       // 展示客户信息
      //       this.showCustomerInfos(taskId, campaignId, customerId, customerPhone)
      //       // 获取聊天记录
      //       this.getChatRecords(customerId, null)
      //       const contentDiv = document.getElementById('short-message-content')
      //       const contentDivBox = document.getElementById(
      //         'short-message-content-container'
      //       )
      //       setTimeout(() => {
      //         contentDivBox.scrollTop = contentDiv.scrollHeight
      //       }, 10)
      //     }
      //   } else {
      //     this.contents = []
      //     this.customerPhoneHeader = ''
      //     this.$store.commit('SET_WECHATCONTENTS', this.contents)
      //   }

      //   // 查询客户列表对应显示的未读数量
      //   getUnreadNum(localStorage.getItem('agentId')).then(response => {
      //     if (response.data.data.length === 0) {
      //       for (var n = 0; n < this.customerInfos.length; n++) {
      //         this.customerInfos[n].unreadNum = 0
      //       }
      //     } else {
      //       for (let i = 0; i < this.customerInfos.length; i++) {
      //         const res = JSON.stringify(response.data.data)
      //         if (res.indexOf(this.customerInfos[i].customerId) === -1) {
      //           this.customerInfos[i].unreadNum = 0
      //         }
      //         for (let j = 0; j < response.data.data.length; j++) {
      //           if (
      //             this.customerInfos[i].customerId ===
      //             response.data.data[j].customerId
      //           ) {
      //             this.customerInfos[i].unreadNum = response.data.data[j].num
      //           }
      //         }
      //       }
      //     }
      //     this.$store.commit('SET_WECHATCUSTOMERINFO', this.customerInfos)
      //     localStorage.setItem(
      //       'customerInfos',
      //       JSON.stringify(this.customerInfos)
      //     )
      //   })
      // })
      // }
    }
  },

  beforeRouteLeave(to, from, next) {
    console.log('leave')
    for (var key in overallIncallCache) {
      overallIncallCache[key] = this[key]
    }
    // this.resetAll()
    this.$store.commit('SET_INCALL_CACHE', overallIncallCache)
    // sessionStorage.setItem('incall_compoment', JSON.stringify(incall_cache))
    // sessionStorage.setItem('incallCompoment', JSON.stringify(this))
    next()
  }
}
</script>
<style>
.badge_item {
  margin-top: 10px;
  margin-right: 5px;
}
</style>