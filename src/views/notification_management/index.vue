<template>
  <div class="container">
    <!-- 消息通知管理 -->
    <div>
      <el-row>
        <el-form :inline="true" size="small">
          <el-form-item label="级别：">
              <el-select v-model.trim="req.emergency_degree" placeholder="请选择" clearable size="small" >
                  <el-option
                    v-for="item in options1"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="发布时间：">
            <el-date-picker
                v-model.trim="timeValue"
                type="datetimerange"
                range-separator="-"
                start-placeholder="发布开始时间"
                end-placeholder="发布结束时间"
                value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item><br/>
          <el-form-item label="关键字：">
            <el-input type="text" v-model.trim="req.key_text" size="small" placeholder="关键字(上限20字符)" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="标题：">
            <el-input type="text" v-model.trim="req.title" size="small" placeholder="消息通知标题(上限20字符)" maxlength="20" style="width:250px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="req.pageNo=1;searchByKeyWords(req)">查询</el-button>
            <el-button type="danger"  @click="resetQueryCondition()">重置</el-button>
          </el-form-item>
        </el-form>
      </el-row>

      <el-row>
        <el-tabs @tab-click="handleTabClick" v-model="activeNames" type="card">
          <el-tab-pane name="releaseNotifications" label="发布箱"></el-tab-pane>
          <el-tab-pane name="draftbox" label="草稿箱"></el-tab-pane>
        </el-tabs>
      </el-row>

      <el-row v-if="activeNames==='releaseNotifications'">
        <el-col>
          <el-table :data="tableData" border>
            <el-table-column align="center" label="序号" width="55">
              <template slot-scope="scope">
                <div>{{scope.$index+(req.pageNo-1)*req.pageSize+1}}</div>
              </template>
            </el-table-column>

            <el-table-column align="center" label="消息通知标题">
              <template slot-scope="scope">
                <el-button @click="notificationDetail={};detailVisiable=true;queryOne(scope.row.notification_id,1)" type="text" size="medium">{{scope.row.title}}</el-button>
              </template>
            </el-table-column>

            <el-table-column align="center" label="接收用户/部门">
                <template slot-scope="scope">
                  <div v-html="showReceivers(scope.row.receiver_user_realnames,scope.row.receiver_dept_names)"></div>
                </template>
            </el-table-column>

            <el-table-column align="center" label="发布状态">
                <template slot-scope="scope">
                  <div v-html="showStatus(scope.row.status)">
                  </div>
                </template>
            </el-table-column>

            <el-table-column align="center" label="级别" width="80px">
                <template slot-scope="scope">
                  <div v-html="showEmergencyDegree(scope.row.emergency_degree)"></div>
                </template>
            </el-table-column>

            <el-table-column align="center" label="发布人">
                <template slot-scope="scope">
                  <div v-html="showReleaser(scope.row.status,scope.row.updated_by_realname)"></div>
                </template>
            </el-table-column>

            <el-table-column align="center" label="阅读状态(已读/总人数)" width="165px">
                <template slot-scope="scope">
                  <div v-html="showReadNumbers(scope.row.status,scope.row.readed_count,scope.row.all_read_count)"></div>
                </template>
            </el-table-column>

            <el-table-column align="center" label="发布时间" width="200px" >
             <template slot-scope="scope">
               <div v-html="showReleaseTime(scope.row.status,scope.row.release_time)"></div>
             </template>
            </el-table-column>

            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button type="text" icon="el-icon-document" size="medium" @click="notificationDetail={};detailVisiable=true;queryOne(scope.row.notification_id,1)">详情</el-button>
                <el-button type="text" icon="el-icon-back" size="medium" @click="recallVisiable=true;recallId=scope.row.notification_id">撤回</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <el-row v-if="activeNames==='draftbox'">
        <el-col>
          <el-table :data="tableData" border>
            <el-table-column align="center" label="序号" width="55">
              <template slot-scope="scope">
                <div>{{scope.$index+(req.pageNo-1)*req.pageSize+1}}</div>
              </template>
            </el-table-column>

            <el-table-column align="center" label="消息通知标题">
              <template slot-scope="scope">
                <el-button @click="notificationDetail={};detailVisiable=true;queryOne(scope.row.notification_id,1)" type="text" size="medium">{{scope.row.title}}</el-button>
              </template>
            </el-table-column>

            <el-table-column align="center" label="接收用户/部门">
                <template slot-scope="scope">
                  <div v-html="showReceivers(scope.row.receiver_user_realnames,scope.row.receiver_dept_names)"></div>
                </template>
            </el-table-column>

            <el-table-column align="center" label="发布状态">
                <template slot-scope="scope">
                  <div v-html="showStatus(scope.row.status)">
                  </div>
                </template>
            </el-table-column>

            <el-table-column align="center" label="级别" width="80px">
                <template slot-scope="scope">
                  <div v-html="showEmergencyDegree(scope.row.emergency_degree)"></div>
                </template>
            </el-table-column>

            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button type="text" icon="el-icon-edit" size="medium" @click="editnotificationDetail={};editNotificationVisiable=true;queryOne(scope.row.notification_id,2);releaseNow=true;editNotification_id=scope.row.notification_id">修改</el-button>
                <el-button type="text"  size="medium" @click="delVisiable=true;deleteId=scope.row.notification_id">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <el-row style="margin-top:5px;">
        <el-button type="success" size="small" @click="flagCheck=true;addNotificationVisiable=true;getAllDepts();selectedDepts.length=0;newnotification.title='';newnotification.emergency_degree=1;newnotification.body='';releaseNow=true;autoSelectSubdept=false">新建</el-button>
        <el-pagination
            v-if="pageShow"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page=currentPage
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size=pageSize
            layout="total,sizes, prev, pager, next, jumper"
            :total=totalCount style="text-align: right;float:right;">
        </el-pagination>
      </el-row>

    <!-- 新建消息dialog -->
    <el-dialog
      align:left
      width="50%"
      top="1"
      title="新建消息通知"
      :visible.sync="addNotificationVisiable"
      append-to-body>
        <el-form label-width="100px">
          <el-form-item label="标题：">
            <el-input placeholder="请输入消息通知标题(上限30字符)" maxlength="30" type="text" v-model="newnotification.title"></el-input>
          </el-form-item>
          <el-form-item label="内容：">
            <el-input type="textarea" placeholder="请输入消息通知内容(上限100字符)" maxlength="100" :rows="4" v-model="newnotification.body"></el-input>
          </el-form-item>
          <el-form-item label="接收部门：">
            <!-- <tree-transfer width="80%" height="250px" node_key="id" :from_data ="allDepts" :to_data="selectedDepts" @addBtn="add" @removeBtn="remove"  :title="['部门列表','所选部门']" :defaultProps="deptsProps"></tree-transfer> -->
            <el-col :span="18">
              <el-tree v-show="autoSelectSubdept===false" :check-strictly="true" :data="allDepts"  @check-change="sendSelectedIds" show-checkbox node-key="id" ref="tree" highlight-current :props="deptsProps" empty-text="暂无数据" default-expand-all></el-tree>
              <el-tree v-show="autoSelectSubdept===true" :data="allDepts"  @check-change="sendSelectedIds" show-checkbox node-key="id" ref="tree" highlight-current :props="deptsProps" empty-text="暂无数据" default-expand-all></el-tree>
            </el-col>
            <el-col :span="6">
              <el-switch v-model="autoSelectSubdept" active-color="#13ce66" inactive-color="#909399" @change="resetSelectDepts()">
              </el-switch>关联子部门
            </el-col>
          </el-form-item>
          <el-form-item label="紧急程度：">
            <el-rate
             style="margin-top:10px"
             v-model="newnotification.emergency_degree"
             show-text
             :max=4
             :texts="['普通','加急','特急','特提']"
             :colors="['#67C23A','#E6A23C','#F56C6C']"
             ></el-rate>
          </el-form-item>
        </el-form>
        <br/>
        <div slot="footer" style="text-align: center;">
          <el-checkbox v-model="releaseNow" checked>立即发布</el-checkbox>
          <el-button @click="goAddNewNotification()" type="success" v-show="flagCheck===true">保存</el-button>
          <el-button @click="addNotificationVisiable=false;">取消</el-button>
        </div>
    </el-dialog>

    <!-- 消息详情dialog -->
    <el-dialog
      align:left
      width="35%"
      top="1vh"
      title="消息通知详情"
      :visible.sync="detailVisiable"
      append-to-body>
        <el-form label-width="100px">
          <el-form-item label="标题：">
            <span>{{notificationDetail.title}}</span>
          </el-form-item>
          <el-form-item label="内容：" class="testMy">
            <span>{{notificationDetail.body}}</span>
          </el-form-item>
          <el-form-item label="接收部门：">
            <div v-html="showReceivers(null,notificationDetail.receiver_dept_names)"></div>
          </el-form-item>
          <el-form-item label="紧急程度：">
            <el-rate
             style="margin-top:10px"
             disabled
             v-model="notificationDetail.emergency_degree"
             show-text
             :max=4
             :texts="['普通','加急','特急','特提']"
             :colors="['#67C23A','#E6A23C','#F56C6C']"
             ></el-rate>
          </el-form-item>
          <el-form-item label="状态：">
            <div v-html="showStatus(notificationDetail.status)"></div>
          </el-form-item>
          <el-form-item label="发布人：">
            <div v-html="showReleaser(notificationDetail.status,notificationDetail.updated_by_realname)"></div>
          </el-form-item>
          <el-form-item label="发布时间：">
            <div v-html="showReleaseTime(notificationDetail.status,notificationDetail.release_time)"></div>
          </el-form-item>
        </el-form>
        <br/>
        <div slot="footer" style="text-align: center;">
          <el-button @click="detailVisiable=false;">返回</el-button>
        </div>
    </el-dialog>

    <!-- 修改消息dialog -->
    <el-dialog
      align:left
      width="50%"
      top="1"
      title="修改消息通知"
      :visible.sync="editNotificationVisiable"
      append-to-body>
        <el-form label-width="100px">
          <el-form-item label="标题：">
            <el-input placeholder="请输入消息通知标题(上限30字符)" maxlength="30" type="text" v-model="editnotificationDetail.title"></el-input>
          </el-form-item>
          <el-form-item label="内容：">
            <el-input type="textarea" placeholder="请输入消息通知内容(上限100字符)" maxlength="100" :rows="4" v-model="editnotificationDetail.body"></el-input>
          </el-form-item>
          <el-form-item label="接收部门：">
            <!-- <tree-transfer width="80%" height="250px" node_key="id" :from_data ="allDepts" :to_data="selectedDepts" @addBtn="add" @removeBtn="remove"  :title="['部门列表','所选部门']" :defaultProps="deptsProps"></tree-transfer> -->
            <el-col :span="18">
              <el-tree v-show="autoSelectSubdept===false" @check-change="sendSelectedIds2"   :check-strictly="true" :data="allDepts" :default-checked-keys="editkeys" show-checkbox node-key="id" ref="tree" highlight-current :props="deptsProps" empty-text="暂无数据" default-expand-all></el-tree>
              <el-tree v-show="autoSelectSubdept===true" @check-change="sendSelectedIds2"  :data="allDepts" :default-checked-keys="editkeys"  show-checkbox node-key="id" ref="tree" highlight-current :props="deptsProps" empty-text="暂无数据" default-expand-all></el-tree>
            </el-col>
            <el-col :span="6">
              <el-switch v-model="autoSelectSubdept" active-color="#13ce66" inactive-color="#909399" @change="resetSelectDepts()">
              </el-switch>关联子部门
            </el-col>
          </el-form-item>
          
          <el-form-item label="紧急程度：">
            <el-rate
             style="margin-top:10px"
             v-model="editnotificationDetail.emergency_degree"
             show-text
             :max=4
             :texts="['普通','加急','特急','特提']"
             :colors="['#67C23A','#E6A23C','#F56C6C']"
             ></el-rate>
          </el-form-item>
        </el-form>
        <br/>
        <div slot="footer" style="text-align: center;">
          <el-checkbox v-model="releaseNow" checked>立即发布</el-checkbox>
          <el-button @click="goEditNewNotification()" type="success">保存</el-button>
          <el-button @click="editNotificationVisiable=false;">取消</el-button>
        </div>
    </el-dialog>

    <!-- 删除消息dialog -->
    <el-dialog
      align:left
      width="30%"
      title="删除提示"
      :visible.sync="delVisiable"
      append-to-body>
        <span style="font-size:15px;">确定删除该消息通知？</span>
        <div slot="footer" style="text-align: center;">
          <el-button @click="deleteOne(deleteId)" type="primary">确认</el-button>
          <el-button @click="delVisiable=false;">取消</el-button>
        </div>
    </el-dialog>

    <!-- 撤回消息dialog -->
    <el-dialog
      align:left
      width="30%"
      title="撤回提示"
      :visible.sync="recallVisiable"
      append-to-body>
        <span style="font-size:15px;">确认撤回该条消息通知？</span>
        <div slot="footer" style="text-align: center;">
          <el-button @click="recallOneNotification(recallId)" type="primary">确认</el-button>
          <el-button @click="recallVisiable=false;">取消</el-button>
        </div>
    </el-dialog>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.testMy{
  // text-overflow: ellipsis; 
  // overflow: hidden;
  // white-space:normal;
  word-wrap:break-word; 
  word-break:break-all;
}
</style>

<script>
import { formatDateTime, getAllDeptsByCurrent } from '@/utils/tools' // 格式化时间
import {
  queryByKeyWords,
  getAllStaffs,
  addNewNotification,
  releaseNotification,
  queryOneNotification,
  editNotification,
  deleteOneNotification,
  recallNotification
} from '@/api/notification_management'
export default {
  name: 'notification_management',

  data() {
    return {
      activeNames: 'releaseNotifications', // tabs的显示页
      autoSelectSubdept: false, // 自动关联子部门
      deptsProps: {
        id: 'id',
        // pid: 'upId',
        label: 'departName',
        children: 'subDeparts'
      },
      flagCheck: true, // 保存并发布标志
      allDepts: [], // 所有部门
      selectedDepts: [], // 选中的部门
      editkeys: [], // 修改时回显部门的id
      editNodes: [], // 修改时回显的部门信息
      addNotificationVisiable: false, // 新建消息通知dialog 显示与否
      detailVisiable: false, // 消息通知详情dialog
      editNotificationVisiable: false, // 修改消息通知dialog
      delVisiable: false, // 删除消息通知dialog
      deleteId: '', // 执行删除的id
      recallVisiable: false, // 撤回消息通知dialog
      recallId: '', // 执行撤回的id
      newnotification: {// 新建消息通知实体
        title: '',
        body: '',
        emergency_degree: 1
      },
      notificationDetail: { // 详情
        title: '',
        body: '',
        emergency_degree: null,
        receiver_dept_names: '',
        release_time: '',
        status: '',
        updated_by_realname: ''
      },
      editNotification_id: '', // 修改的id
      editnotificationDetail: { // 修改信息
        title: '',
        body: '',
        emergency_degree: null
      },
      // receiverType: '1', // 接收主体
      allemployees: [], // 所有员工
      releaseNow: true, // 新建时判断是否保存并发布的标志
      // 级别
      options1: [
        {
          label: '',
          value: ''
        },
        {
          label: '普通',
          value: '1'
        },
        {
          label: '加急',
          value: '2'
        },
        {
          label: '特急',
          value: '3'
        },
        {
          label: '特提',
          value: '4'
        }
      ],
      req: {
        status: '2', // 发布状态  默认查询已发布的
        emergency_degree: '', // 类别
        key_text: '', // 关键字
        title: '', // 标题
        start_release_time: '', // 发布开始时间
        end_release_time: '', // 发布结束时间
        pageNo: 1, // 当前页数
        pageSize: 10 // 每页数量
      },
      timeValue: '',
      pageShow: false, // 分页显示与否
      pageInfo: {}, // 分页数据
      currentPage: '', // 当前页数
      totalCount: '', // 总条数
      pageSize: '', // 每页条数
      tableData: [] // 表格数据
    }
  },

  methods: {
    // tab点击时触发的事件
    handleTabClick(tab, event) {
      if (tab.name === 'releaseNotifications') {
        // 点击了已发布
        this.req.status = '2'
        this.req.pageNo = 1
        this.searchByKeyWords(this.req)
      } else if (tab.name === 'draftbox') {
        // 点击了草稿箱
        this.req.status = '1'
        this.req.pageNo = 1
        this.searchByKeyWords(this.req)
      }
    },
    sendSelectedIds(data, checked, ischildSelected) {
      // if (checked && !data.subDeparts) {
      if (checked) {
        this.selectedDepts.push(data)
      } else {
        if (this.selectedDepts.some(i => i === data)) {
          // 移除数组中此项id
          this.selectedDepts.splice(this.selectedDepts.indexOf(data), 1)
        }
      }
    },
    sendSelectedIds2(data, checked, ischildSelected) {
      // if (checked && !data.subDeparts) {
      // console.log('方法执行前:' + this.editkeys)
      if (checked) {
        if (this.editkeys.some(i => i === data.id)) {
          this.editkeys = Array.from(new Set(this.editkeys))
        } else {
          this.editkeys.push(data.id)
          this.editkeys = Array.from(new Set(this.editkeys))
        }
      } else {
        if (this.editkeys.some(i => i === data.id)) {
          // 移除数组中此项id
          this.editkeys.splice(this.editkeys.indexOf(data.id), 1)
          this.editkeys = Array.from(new Set(this.editkeys))
        }
      }
    },
    resetSelectDepts() {
      this.selectedDepts.length = 0
      this.getAllDepts()
    },
    // 新建消息通知
    goAddNewNotification() {
      if (this.newnotification.title === '') {
        this.$message.error('请输入消息通知标题！')
        return
      } else if (this.newnotification.body === '') {
        this.$message.error('请输入内容！')
        return
      } else if (this.selectedDepts.length === 0) {
        this.$message.error('请选择接收部门！')
        return
      } else {
        this.flagCheck = false
        addNewNotification(this.newnotification, this.selectedDepts)
          .then(response => {
            if (response.data.error === null) {
              if (this.releaseNow) {
              // 直接发布
                releaseNotification(response.data.result.notification_id)
                  .then(res1 => {
                    if (response.data) {
                      if (res1.data.error === null) {
                        this.$message.success('保存并发布成功！')
                        this.searchByKeyWords(this.req)
                        this.addNotificationVisiable = false
                      } else {
                        this.$message.error(response.data.error)
                        this.searchByKeyWords(this.req)
                        this.addNotificationVisiable = false
                      }
                    } else {
                      this.$message.error('服务器出错..请稍后再试')
                    }
                  })
              } else {
              // 不直接发布
                this.$message.success('保存成功！')
                this.searchByKeyWords(this.req)
                this.addNotificationVisiable = false
              }
            } else {
              this.$message.error(response.data.error)
              this.addNotificationVisiable = false
            }
          })
      }
    },
    // 单个查询
    queryOne(notification_id, num) {
      if (num === 1) {
        // 详情
        queryOneNotification(notification_id)
          .then(response => {
            if (response.data.error === null) {
              this.notificationDetail = response.data.result
              this.notificationDetail.emergency_degree = parseInt(response.data.result.emergency_degree)
            } else {
              this.$message.error(response.data.error)
              this.detailVisiable = false
            }
          })
      } else {
        // 修改
        queryOneNotification(notification_id)
          .then(response => {
            if (response.data.error === null) {
              this.editnotificationDetail = response.data.result
              this.editnotificationDetail.emergency_degree = parseInt(response.data.result.emergency_degree)
              getAllDeptsByCurrent()
                .then(res => {
                  if (res.data.code === 1) {
                    this.allDepts = res.data.data
                  }
                  if (this.editnotificationDetail.receiver_dept_ids) {
                    // 将数据中的部门解析
                    var ids = this.editnotificationDetail.receiver_dept_ids.split(',')
                    this.editkeys = []
                    this.selectedDepts = []
                    for (var i = 0; i < ids.length; i++) {
                      if (ids[i] !== '') {
                        this.editkeys.push(parseInt(ids[i]))
                      }
                    }
                  }
                })
            } else {
              this.$message.error(response.data.error)
              this.editNotificationVisiable = false
            }
          })
      }
    },
    // 修改消息通知
    goEditNewNotification() {
      this.selectedDepts = []
      // console.log(this.editkeys)
      for (var i = 0; i < this.editkeys.length; i++) {
        this.selectedDepts.push(this.$refs.tree.getNode(this.editkeys[i]).data)
      }
      this.selectedDepts = Array.from(new Set(this.selectedDepts))
      // console.log(this.selectedDepts)
      // TODO 非空校验
      if (this.editnotificationDetail.title === '') {
        this.$message.error('请输入消息通知标题！')
        return
      } else if (this.editnotificationDetail.body === '') {
        this.$message.error('请输入内容！')
        return
      } else if (this.selectedDepts.length === 0) {
        this.$message.error('请选择接收部门！')
        return
      } else {
        editNotification(this.editNotification_id, this.editnotificationDetail, this.selectedDepts)
          .then(response => {
            if (response.data.error === null) {
              if (this.releaseNow) {
                // 直接发布
                releaseNotification(response.data.result.notification_id)
                  .then(res1 => {
                    if (res1.data.error === null) {
                      this.$message.success('修改并发布成功！')
                      this.searchByKeyWords(this.req)
                      this.editNotificationVisiable = false
                    } else {
                      this.$message.error(response.data.error)
                      this.searchByKeyWords(this.req)
                      this.editNotificationVisiable = false
                    }
                  })
              } else {
                // 不直接发布
                this.$message.success('修改成功！')
                this.searchByKeyWords(this.req)
                this.editNotificationVisiable = false
              }
            } else {
              this.$message.error(response.data.error)
              this.editNotificationVisiable = false
            }
          })
      }
    },
    // 删除
    deleteOne(id) {
      deleteOneNotification(id)
        .then(response => {
          if (response.data.error === null && response.data.result === true) {
            this.$message.success('删除成功！')
            this.req.pageNo = 1
            this.searchByKeyWords(this.req)
            this.deleteId = ''
            this.delVisiable = false
          } else {
            this.$message.error(response.data.error)
            this.deleteId = ''
            this.delVisiable = false
          }
        })
    },
    // 撤回
    recallOneNotification(id) {
      recallNotification(id)
        .then(response => {
          if (response.data) {
            if (response.data.error === null) {
              this.$message.success('撤回成功！')
              this.req.pageNo = 1
              this.searchByKeyWords(this.req)
              this.recallId = ''
              this.recallVisiable = false
            } else {
              this.$message.error(response.data.error)
              this.recallId = ''
              this.recallVisiable = false
            }
          } else {
            this.$message.error('出错啦...请稍后重试')
            this.recallId = ''
            this.recallVisiable = false
          }
        })
    },
    // 显示消息通知已读/总人数
    showReadNumbers(status, readNum, allNum) {
      if (status === 1) {
        // 未发布 不存在已读未读人数
        return '&nbsp;&nbsp;/&nbsp;&nbsp;'
      } else {
        return readNum + '&nbsp;&nbsp;/&nbsp;&nbsp;' + allNum
      }
    },
    // 格式化时间
    formatDateTime: formatDateTime,
    // 获得部门信息
    getAllDepts() {
      getAllDeptsByCurrent()
        .then(response => {
          if (response.data.code === 1) {
            this.allDepts = response.data.data
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 综合查询
    searchByKeyWords(req) {
      console.log(this.timeValue)
      if (this.timeValue !== '' && this.timeValue !== null) {
        req.start_release_time = Date.parse(new Date(this.timeValue[0]))
        req.end_release_time = Date.parse(new Date(this.timeValue[1]))
      } else {
        req.start_release_time = ''
        req.end_release_time = ''
      }
      queryByKeyWords(req)
        .then(response => {
          this.pageShow = true
          this.tableData = response.data.result
          this.currentPage = response.data.pageNo
          this.totalCount = response.data.total_count
          this.pageSize = response.data.pageSize
        })
    },
    // 分页查询
    handleCurrentChange(val) {
      this.req.pageNo = val
      this.searchByKeyWords(this.req)
    },
    // 展示接收人或者部门
    showReceivers(names, deptNames) {
      if (names) {
        names = names.split(',')
        var str1 = ''
        for (var k = 0; k < names.length; k++) {
          if (names[k] === '') {
            names.splice(k, 1)
          }
        }
        if (names.length > 2) {
          str1 = str1 + names[0] + '、' + names[1] + '等人员'
          return str1
        } else {
          for (var z = 0; z < names.length; z++) {
            str1 += names[z] + '、'
          }
          str1 = str1.substr(0, (str1.length - 1))
          return str1
        }
      } else if (deptNames) {
        deptNames = deptNames.split(',')
        var str = ''
        for (var i = 0; i < deptNames.length; i++) {
          if (deptNames[i] === '') {
            deptNames.splice(i, 1)
          }
        }
        if (deptNames.length > 2) {
          str = str + deptNames[0] + '、' + deptNames[1] + '等' + deptNames.length + '个部门'
          return str
        } else {
          for (var j = 0; j < deptNames.length; j++) {
            str += deptNames[j] + '、'
          }
          str = str.substr(0, (str.length - 1))
          return str
        }
      } else {
        return '无'
      }
    },
    // 展示发布状态
    showStatus(status) {
      if (status === 1) {
        return "<i class='el-icon-info' style='color:#409EFF'><span style='color:#409EFF'>&nbsp;未发布</span>"
      } else if (status === 2) {
        return "<i class='el-icon-success' style='color:#67C23A'></i><span style='color:#67C23A'>&nbsp;已发布</span>"
      } else if (status === 3) {
        return "<i class='el-icon-warning' style='color:#F56C6C'></i><span style='color:#F56C6C'>&nbsp;已失效</span>"
      }
    },
    // 展示发布时间
    showReleaseTime(status, time) {
      if (status === 2 && time) {
        return formatDateTime(time)
      } else {
        return '无'
      }
    },
    // 展示发布人
    showReleaser(status, releaser) {
      if (status === 2 && releaser) {
        return releaser
      } else {
        return '无'
      }
    },
    // 展示消息通知类别
    showEmergencyDegree(degree) {
      if (degree === '4') {
        return "<i class='el-icon-info' style='color:#909399'><span style='color:#909399'>&nbsp;特提</span>"
      } else if (degree === '3') {
        return "<i class='el-icon-warning' style='color:#F56C6C'></i><span style='color:#F56C6C'>&nbsp;特急</span>"
      } else if (degree === '2') {
        return "<i class='el-icon-star-on' style='color:#E6A23C'></i><span style='color:#E6A23C'>&nbsp;加急</span>"
      } else if (degree === '1') {
        return "<i class='el-icon-message' style='color:#67C23A'></i><span style='color:#67C23A'>&nbsp;普通</span>"
      }
    },
    // 获得所有员工
    getAllEmployees() {
      getAllStaffs()
        .then(response => {
          if (response.data.code === 1) {
            this.allemployees = response.data.data
          }
        })
    },
    // 重置查询条件
    resetQueryCondition() {
      this.timeValue = '' //
      this.req.emergency_degree = '' // 类别
      this.req.key_text = '' // 关键字
      this.req.title = '' // 标题
      this.req.start_release_time = '' // 发布开始时间
      this.req.end_release_time = '' // 发布结束时间
      this.req.pageNo = 1 // 当前页数
      this.req.pageSize = this.pageSize // 每页数量
    },
    // 页面显示条数
    handleSizeChange(val) {
      this.pageSize = val
      this.req.pageNo = 1
      this.currentPage = 1
      this.req.pageSize = val
      this.searchByKeyWords(this.req)
    }

  },

  mounted() {
    this.searchByKeyWords(this.req)
    // 获取所有部门信息
    // this.getAllDepts()
  },

  watch: {},

  components: {

  },

  mixins: [],

  vuex: {},

  created() {}

}

</script>
