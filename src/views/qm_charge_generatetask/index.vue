 <template>
  <div class="container">
    <el-collapse v-model="formContainerOpen" class="form-container" @change="handleChangeAcitve">
      <el-collapse-item title="筛选条件" name="1">
        <el-form :inline="true" size="small">
          <el-form-item label="任务编号:">
            <el-input v-model="req.taskId" placeholder="任务编号（限长45字符）" maxlength="45"></el-input>
          </el-form-item>
          <el-form-item label="任务名称:">
            <el-input v-model="req.taskName" placeholder="任务名称（限长45字符）" maxlength="45"></el-input>
          </el-form-item>
          <el-form-item label="活动名称:">
            <el-select v-model="req.activityId" placeholder="活动名称" style="width: 100%;">
              <el-option value='' label="所有活动"></el-option>
              <el-option
                v-for="item in campsData"
                :key="item.campaignId"
                :label="item.campaignName"
                :value="item.campaignId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="操作人:">
            <el-input v-model="req.modifierName" placeholder="操作人（限长50字符）" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="操作时间：">
            <el-date-picker
              v-model="req.startTime"
              type="datetime"
              placeholder="开始时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="00:00:00">
            </el-date-picker>
            到
            <el-date-picker
              v-model="req.stopTime"
              type="datetime"
              placeholder="结束时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="00:00:00">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="req.pageNo=1;req2=clone(req);searchTask(req)">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <el-row class="table-container">
      <el-row class="margin-bottom-20">
        <div class="font14 bold">质检任务管理表</div>
      </el-row>
      <el-row class="margin-bottom-20">
        <el-button type="success" size="small" @click="addVisible=true;clearForm(getRecords);getRecords.getAll=1;recodeTable=[];pageShow=false;addTask.taskName=''">新建</el-button>
        <el-button type="danger" size="small" @click="batchDelVisible=true">批量删除</el-button>
      </el-row>
      <el-row>
        <el-table
          :data="tableData"
          @selection-change="handleSelectionChange">
          <el-table-column
            align="center"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            align="center"
            prop="taskId"
            label="任务编号"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            align="center"
            prop="taskName"
            label="任务名称"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.taskName }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="活动名称"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{scope.row.activityId == '0'|| scope.row.activityId == null?'无':scope.row.activityName}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="recordNumber"
            label="接触记录数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="modifierName"
            label="操作人"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.modifierName }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作时间"
            width="155">
            <template slot-scope="scope">
              <div>{{formatDateTime(scope.row.modifierTime)}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="100">1
          <template slot-scope="scope">
            <el-button @click="editVisible=true;editReq.taskId=scope.row.taskId;delReq.taskId=scope.row.taskId;getoneByTaskId(delReq);" type="text" size="small">修改</el-button>
            <el-button @click="removeVisible=true;editReq.taskId=scope.row.taskId;" type="text" size="small" v-if="!(scope.row.activityId == '0'|| scope.row.activityId == null)">移除</el-button>
            <el-button @click="delVisible=true;delReq.taskId=scope.row.taskId;" type="text" size="small" v-if="scope.row.activityId == '0'|| scope.row.activityId == null">删除</el-button>
          </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row style="margin-top:20px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page='req2.pageNo'
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size='pageInfo.pageSize'
          layout="total, sizes, prev, pager, next, jumper "
          :total='pageInfo.totalCount' style="text-align: right;float:right;">
        </el-pagination>
      </el-row>
    </el-row>
    
    <el-dialog
      align:left
      width="30%"
      title="修改质检任务信息"
      :visible.sync="editVisible"
      append-to-body>
      <el-form size="small" label-width="100px" :model="taskDetail" ref="editTask" :rules="rule">
        <el-form-item label="任务编号">
          <span>{{taskDetail.taskId}}</span>
        </el-form-item>
        <el-form-item label="任务名称" prop="taskName">
          <el-input v-model="taskDetail.taskName" size="small" maxlength="45" placeholder="任务名称（限长45字符）"></el-input>
        </el-form-item>
        <el-form-item label="活动名称">
          <span>{{taskDetail.activityName}}</span>
        </el-form-item>
        <el-form-item label="接触记录数量">
          <span>{{taskDetail.recordNumber}}</span>
        </el-form-item>
        <el-form-item label="操作人">
          <span>{{taskDetail.modifierName}}</span>
        </el-form-item>
        <el-form-item label="操作时间">
          <span>{{formatDateTime(taskDetail.modifierTime)}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: right;">
        <el-button @click="getoneByTaskId(delReq)">重 置</el-button>
        <el-button type="primary" plain @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('editTask');editTask(editReq)">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      top="5vh"
      width="90%"
      :visible.sync="addVisible"
      append-to-body>
      <div slot="title" style="text-align: center;">
        <h3 style="display:inline;">新建质检任务</h3>
      </div>
      <el-row>
        <el-form :inline="true" size="small" :model="getRecords" ref="addTask" :rules="rule">
          <el-form-item label="活动名称:">
            <el-select v-model="getRecords.campaign" placeholder="活动名称" @change="getActivityName" style="width: 100%;">
              <el-option
                v-for="item in campsData"
                :key="item.campaignId"
                :label="item.campaignName"
                :value="item.campaignId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户姓名:">
            <el-input v-model="getRecords.customerName" size="small" placeholder="客户姓名（限长45字符）" maxlength="45"></el-input>
          </el-form-item>
          <el-form-item label="拨打时间：">
            <el-date-picker
              v-model="getRecords.startTime"
              type="datetime"
              placeholder="开始时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="00:00:00">
            </el-date-picker>
            到
            <el-date-picker
              v-model="getRecords.endTime"
              type="datetime"
              placeholder="结束时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="00:00:00">
            </el-date-picker>
          </el-form-item>
          <el-form-item class="talktime-form" label="通话时长" prop="resideAddress">
            <el-input v-model="getRecords.stime" size="small" style="width:65px;" type="number"></el-input>
            到
            <el-input v-model="getRecords.etime" size="small" style="width:65px;" type="number"></el-input>
            分钟
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getRecordsByConditions(getRecords)">查询</el-button>
            <el-button @click="clearForm(getRecords);getRecords.getAll=1;">重置</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <el-table
          :data="recodeTable">
          <el-table-column
            align="center"
            prop="recordId"
            label="接触历史编号"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            align="center"
            prop="staffId"
            label="员工工号"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            align="center"
            label="分机号"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{scope.row.callDirection == "0" ? scope.row.callerNumber : scope.row.calleeNumber}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="customerName"
            label="客户姓名"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            align="center"
            label="联系电话"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{hideMobile(scope.row.customerPhone)}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="hangUpTime"
            label="最近联系时间"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            align="center"
            prop="talkTime"
            label="通话时长"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            align="center"
            label="话后小结"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{summary(scope.row.summaryDetailInfos)}}
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <div slot="footer" style="text-align: right;">
        <el-pagination
          v-if="pageShow"
          :current-page='recodePage.pageNo'
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size='recodePage.pageSize'
          layout="total"
          :total='recodePage.totalCount' style="text-align: right;float:left;">
        </el-pagination>
        <el-form :inline="true" size="small"  :model="addTask" ref="addTask" :rules="rule">
          <el-form-item prop="taskName">
            <el-input v-model="addTask.taskName" size="small" placeholder="质检任务名称" maxlength="45"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('addTask');addTasks(addTask);">确定</el-button>
            <el-button plain type="primary" @click="addVisible = false;">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <el-dialog
      width="30%"
      title="删除"
      :visible.sync="delVisible"
      append-to-body>
      <span style="font-size:20px;">确定删除此内容？</span>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button type="primary" plain @click="delVisible = false">取消</el-button>
        <el-button type="primary" @click="delVisible = false;delTask(delReq);">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="30%"
      title="移除"
      :visible.sync="removeVisible"
      append-to-body>
      <span style="font-size:20px;">确定移除此任务对应活动？</span>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button type="primary" plain @click="removeVisible = false">取消</el-button>
        <el-button type="primary" @click="removeVisible = false;removeCamp(editReq);">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="30%"
      title="批量删除"
      :visible.sync="batchDelVisible"
      append-to-body>
      <span style="font-size:20px;">确定删除选定内容？</span>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button type="primary" plain @click="batchDelVisible = false">取消</el-button>
        <el-button type="primary" @click="batchDelVisible = false;batchDelTask(batchDelReq);">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  queryAllCamps,
  queryTask,
  findRecordsByConditions,
  generateTask,
  queryoneByTaskId,
  modifytask,
  delTask,
  batchdel
} from '@/api/qm_charge_generatetask'
import { rule } from '@/utils/validate'
import { formatDateTime, clone } from '@/utils/tools'
export default {
  name: 'qm_charge_generatetask',
  data() {
    return {
      visibleClass: '',
      formContainerOpen: '1',
      formContainer: this.$store.state.app.formContainer,
      detailVisible: false,
      delVisible: false, // 删除对话框显示隐藏
      editVisible: false, // 修改对话框显示隐藏
      addVisible: false, // 新建对话框显示隐藏
      batchDelVisible: false, // 批量删除对话框显示隐藏
      removeVisible: false, // 移除对应活动
      tableData: [], // 表格数据
      recodeTable: [], // 新建页面表格
      validate: true, // 验证不通过阻止发请求
      pageShow: false, // 分页显示隐藏
      campsData: [], // 所有活动
      taskDetail: {}, // 任务详情
      rule: rule,
      delReq: {
        taskId: ''
      },
      batchDelReq: {
        taskIds: []
      },
      // 查询 发送请求参数
      req: {
        taskId: '',
        status: '',
        activityId: '',
        taskName: '',
        modifierName: '',
        startTime: '',
        stopTime: '',
        pageNo: 1,
        pageSize: 10
      },
      req2: {
        taskId: '',
        status: '',
        activityId: '',
        taskName: '',
        modifierName: '',
        startTime: '',
        stopTime: '',
        pageNo: 1,
        pageSize: 10
      },
      getRecords: {
        campaign: '',
        customerName: '',
        startTime: '',
        endTime: '',
        stime: '',
        etime: '',
        getAll: 1
      },
      addTask: {
        taskName: '',
        activityId: '',
        activityName: '',
        customerName: '',
        callTimeStart: '',
        callTimeEnd: '',
        talkTimeStart: '',
        talkTimeEnd: ''
      }, // 质检任务详情
      editReq: {
        taskId: '',
        taskName: '',
        isRemove: ''
      },
      // 分页数据
      pageInfo: {},
      recodePage: {}
    }
  },
  mounted() {
    this.formContainer()
    this.handleChangeAcitve()
    this.searchTask(this.req)
    this.getAllCamps()
  },
  methods: {
    handleChangeAcitve(active = ['1']) {
      if (active.length) {
        $('.form-more').text('收起')
      } else {
        $('.form-more').text('更多')
      }
    },
    // 深度克隆
    clone: clone,
    getAllCamps() {
      queryAllCamps()
        .then(response => {
          if (response.data.code === 0) {
            this.campsData = response.data.data
          } else {
            this.$message(response.data.message)
          }
        }).catch(error => {
          console.log(error)
        })
    },
    summary(summaryDetail) {
      var summaryNames = []
      if (summaryDetail.length > 1 || summaryDetail.name) {
        for (var i = 0; i < summaryDetail.length; i++) {
          summaryNames.push(summaryDetail[i].name)
        }
        return summaryNames.join(' , ')
      } else if (summaryDetail.length === 0) {
        return '无'
      } else {
        return summaryDetail[0].name
      }
    },
    resetForm(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.validate = true
        } else {
          this.validate = false
        }
      })
    },
    reset() {
      this.req = {
        taskId: '',
        status: '',
        activityId: '',
        taskName: '',
        modifierName: '',
        startTime: '',
        stopTime: '',
        pageNo: this.req2.pageNo,
        pageSize: this.pageInfo.pageSize
      }
      this.req2 = {
        taskId: '',
        status: '',
        activityId: '',
        taskName: '',
        modifierName: '',
        startTime: '',
        stopTime: '',
        pageNo: this.req2.pageNo,
        pageSize: this.pageInfo.pageSize
      }
    },
    // 清空重置
    clearForm(obj, formName) {
      for (const key in obj) {
        if (key !== 'pageNo') {
          obj[key] = ''
        }
      }
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
    },
    // 时间戳转年月日时分秒
    formatDateTime: formatDateTime,
    // 手机号码加密
    hideMobile(mobileNo) {
      if (mobileNo) {
        return mobileNo.substring(0, 3) + '****' + mobileNo.substring(7, 11)
      }
    },
    // 查询质检任务信息
    searchTask(req) {
      queryTask(req)
        .then(response => {
          if (response.data.code === 0) {
            this.tableData = response.data.data
            if (response.data.pageInfo && response.data.data.length !== 0) {
              this.pageInfo = response.data.pageInfo
              this.pageShow = true
            } else {
              this.pageShow = false
            }
          } else {
            this.$message(response.data.message)
            this.tableData = response.data.data
            this.pageShow = false
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 移除质检任务对应活动
    removeCamp(editTask) {
      editTask.isRemove = 'yes'
      modifytask(editTask).then(response => {
        if (response.data.code === 0) {
          this.$message.success('移除活动成功')
          this.searchTask(this.req2)
        } else {
          this.$message(response.data.message)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 删除质检任务
    delTask(taskId) {
      delTask(taskId)
        .then(response => {
          if (response.data.code === 0) {
            this.$message.success(response.data.message)
            this.req2.pageNo = 1
            this.pageInfo.pageNo = 1
            this.searchTask(this.req2)
          } else {
            this.$message(response.data.message)
          }
        })
        .catch(error => {
          console.log(error)
          this.$message('删除失败')
        })
    },
    // 修改前查询质检任务详情
    getoneByTaskId(taskId) {
      queryoneByTaskId(taskId)
        .then(response => {
          if (response.data.code === 0) {
            this.taskDetail = response.data.data[0]
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 修改质检任务信息
    editTask(editReq) {
      if (!this.validate) {
        this.$message('请输入质检任务名称')
        return false
      }
      this.editVisible = false
      editReq.isRemove = 'no'
      editReq.taskName = this.taskDetail.taskName
      modifytask(editReq).then(response => {
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
          this.searchTask(this.req2)
        } else {
          this.$message(response.data.messages)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 新建页面 查询
    getRecordsByConditions(req) {
      if (req.campaign) {
        findRecordsByConditions(req).then(response => {
          if (response.data.code === 0) {
            if (response.data.data.length === 0) {
              this.$message('无查询结果，请核对查询条件')
              this.recodeTable = []
              this.recodePage = response.data.pageInfo
            } else {
              this.recodeTable.length = 0
              // 只显示5条数据
              if (response.data.data.length >= 5) {
                for (var i = 0; i < 5; i++) {
                  this.recodeTable.push(response.data.data[i])
                }
              } else {
                for (var j = 0; j < response.data.data.length; j++) {
                  this.recodeTable.push(response.data.data[j])
                }
              }
              this.recodePage = response.data.pageInfo
              this.pageShow = true
            }
          }
        }).catch(error => {
          console.log(error)
        })
      } else {
        this.$message('请先选择活动')
      }
    },
    // 获取select标签名
    getActivityName(val) {
      let obj = {}
      obj = this.campsData.find((item) => {
        return item.campaignId === val
      })
      this.addTask.activityName = obj.campaignName
    },
    // 新建质检任务
    addTasks(addTask) {
      addTask.activityId = this.getRecords.campaign
      addTask.customerName = this.getRecords.customerName
      addTask.callTimeStart = this.getRecords.startTime
      addTask.callTimeEnd = this.getRecords.endTime
      addTask.talkTimeStart = this.getRecords.stime
      addTask.talkTimeEnd = this.getRecords.etime
      if (!this.addTask.taskName) {
        this.$message('请输入质检任务名称')
      } else if (!addTask.activityId) {
        this.$message('您还没有选择活动')
      } else if (this.recodeTable.length === 0) {
        this.$message('当前无接触记录，请重新查询~')
      } else {
        this.addVisible = false
        generateTask(addTask).then(response => {
          if (response.data.code === 0) {
            this.$message({
              message: response.data.message,
              type: 'success'
            })
            this.searchTask(this.req2)
          } else {
            this.$message('新建失败：' + response.data.message)
          }
        }).catch(error => {
          this.$message('新建失败:请求异常')
          console.log(error)
        })
      }
    },
    // 批量删除
    batchDelTask(batchDelReq) {
      if (batchDelReq.taskIds.length === 0) {
        this.$message.error('请选择需要删除的内容')
      } else {
        batchdel(batchDelReq).then(response => {
          if (response.data.code === 0) {
            this.$message.success(response.data.message)
            this.req2.pageNo = 1
            this.pageInfo.pageNo = 1
            this.searchTask(this.req2)
          } else {
            this.$message(response.data.message)
          }
        }).catch(error => {
          console.log(error)
          this.$message('删除失败')
        })
      }
    },
    // 表格多选框
    handleSelectionChange(val) {
      this.batchDelReq.taskIds.length = 0
      for (var i = 0; i < val.length; i++) {
        this.batchDelReq.taskIds.push(val[i].taskId)
      }
    },
    // 页面显示条数
    handleSizeChange(val) {
      this.req2.pageSize = val
      this.req.pageSize = val
      this.req2.pageNo = 1
      this.pageInfo.pageNo = 1
      this.searchTask(this.req2)
    },
    // 分页翻页功能
    handleCurrentChange(val) {
      this.req2.pageNo = val
      this.searchTask(this.req2)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
  .talktime-form{
    .el-form-item__content{
      width:200px;
    }
  }
</style>
