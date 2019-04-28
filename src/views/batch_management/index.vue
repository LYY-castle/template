<template>
  <div class="container">
    <el-collapse v-model="formContainerOpen" class="form-container" @change="handleChangeAcitve">
      <el-collapse-item title="筛选条件" name="1">
        <el-form :inline="true" size="small" :model="req" ref="searchForm">
          <el-form-item prop="batchId" label="批次号：">
            <el-input v-model="req.batchId" placeholder="批次号（限长20字符）" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item prop="batchName" label="批次名称：">
            <el-input v-model="req.batchName" placeholder="批次名称（限长100字符）" maxlength="100"></el-input>
          </el-form-item>
          <el-form-item prop="modifierName" label="操作人：">
            <el-input v-model="req.modifierName" placeholder="操作人（限长50字符）" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="操作时间：" prop="startCreateTime">
            <el-date-picker
                v-model.trim="createTimeValue"
                type="datetimerange"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="req.pageNo=1;req2=clone(req);getBatch(req);">查询</el-button>
            <el-button @click="clearForm();req2=clone(req);">重置</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <el-row class="table-container">
      <el-row class="margin-bottom-20">
        <div class="font14 bold">批次管理表</div>
      </el-row>
      <el-row class="margin-bottom-20">
        <!-- <el-button type="success" size="small" @click="addVisible=true;batchSnapshot=[];fileList=[];resetForm('addBatch');clearUpload('upload');">新建</el-button> -->
        <el-button type="danger" size="small" @click="batchDelVisible=true">批量删除</el-button>
        <!-- <el-button type="primary" size="small" @click="getTemp()">下载模板</el-button> -->
        <!-- <el-button type="primary" size="small" @click="uploadVisible=true;changeUpload(1);clearUpload('upload');">上传模板</el-button> -->
      </el-row>
      <el-row>
        <el-table
          :data="tableData"
          empty-text="无"
          @selection-change="handleSelectionChange">
          <el-table-column
            align="center"
            type="selection"
            width="40">
          </el-table-column>
          <el-table-column
            align="center"
            prop="batchId"
            label="批次号"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            align="center"
            prop="batchName"
            label="批次名称"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.batchName }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="数据来源"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ showSource(scope.row.source) }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="importNum"
            label="可用数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="creatorName"
            label="操作人"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.creatorName }}
            </template>
          </el-table-column>
          <el-table-column
            width="155"
            align="center"
            label="操作时间">
            <template slot-scope="scope">
              {{formatDateTime(scope.row.creatorTime)}}
            </template>
          </el-table-column>
          <el-table-column
            width="100"
            align="center"
            label="操作">
          <template slot-scope="scope">
            <el-button @click="editVisible=true;delReq.batchId=scope.row.batchId;getDetailById(scope.row.batchId)" type="text" size="small">修改</el-button>
            <el-button @click="delVisible=true;delReq.batchId=scope.row.batchId" type="text" size="small">删除</el-button>
          </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row style="margin-top:20px;">
        <el-pagination
          v-if="pageShow"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageInfo.pageNo"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="pageInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper "
          :total="pageInfo.totalCount" style="text-align: right;float:right;">
        </el-pagination>
      </el-row>
    </el-row>
    <el-dialog
      align:left
      width="30%"
      title="批次信息修改"
      :visible.sync="editVisible"
      append-to-body>
      <el-form size="small" label-width="100px" :model="batchDetail" ref="editBatch" :rules="rule">
        <el-form-item label="批次号" prop="batchId">
          <span>{{batchDetail.batchId}}</span>
        </el-form-item>
        <el-form-item label="批次名称" prop="batchName">
          <el-input v-model="batchDetail.batchName" size="small" placeholder="上限100字符" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="数据来源" prop="source">
          <el-input v-model="batchDetail.source" size="small" placeholder="上限100字符" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="导入数量">
          <span>{{batchDetail.importNum}}</span>
        </el-form-item>
        <el-form-item label="操作人" prop="modifierName">
          <span>{{batchDetail.creatorName}}</span>
        </el-form-item>
        <el-form-item label="操作时间" prop="modifierTime">
          <span>{{formatDateTime(batchDetail.creatorTime)}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: right;">
        <el-button size="small" type="primary" @click="submitForm('editBatch');editBatch(batchDetail);">确定</el-button>
        <el-button size="small" @click="getDetailById(delReq.batchId)">重置</el-button>
        <el-button size="small" type="primary" plain @click="editVisible = false;">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      align:left
      width="30%"
      title="失败详情"
      :visible.sync="detailVisible"
      append-to-body>
      <div class="overfl">{{failDetail}}</div>
      <div slot="footer" style="text-align: right;">
        <el-button type="primary" plain @click="detailVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 上传文件 -->
    <el-dialog
      width="30%"
      :title="uploadData.title"
      :visible.sync="uploadVisible"
      append-to-body>
      <el-upload
        ref="upload"
        :action="uploadData.url"
        :headers="{'Authorization':'Bearer ' +token}"
        :before-upload="beforeUpload"
        :http-request="uploadFileInfo"
        :auto-upload="false">
        <el-button slot="trigger" size="small" type="info">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="primary" @click="submitUpload()">上传</el-button>
        <div slot="tip" class="el-upload__tip">上传文件只能是 xls、xlsx格式，大小不能超过10MB</div>
      </el-upload>
    </el-dialog>
    <el-dialog
      width="30%"
      title="删除"
      :visible.sync="delVisible"
      append-to-body>
      <span style="font-size:20px;">确定删除此内容？</span>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button size="small" type="primary" @click="delVisible = false;delBatch(delReq);">确定</el-button>
        <el-button size="small" type="primary" plain @click="delVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="30%"
      title="批量删除"
      :visible.sync="batchDelVisible"
      append-to-body>
      <span style="font-size:20px;">确定删除选定内容？</span>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button type="primary" @click="batchDelVisible = false;batchDelBatchs(batchDelReq);">确定</el-button>
        <el-button type="primary" plain @click="batchDelVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      top="5vh"
      width="90%"
      :visible.sync="addVisible"
      append-to-body>
      <div slot="title" style="text-align: center;">
        <!-- <el-button @click="addVisible = false;" style="float:left;" icon="el-icon-arrow-left">返 回</el-button> -->
        <h3 style="display:inline;">新建批次</h3>
      </div>
      <el-row>
        <el-form :inline="true" size="small" :model="addReq" ref="addBatch" :rules="rule">
          <el-form-item prop="batchName" label="批次名称:">
            <el-input v-model="addReq.batchName" placeholder="批次名称（限长100字符）" maxlength="100"></el-input>
          </el-form-item>
           <el-form-item prop="description" label="备注:">
            <el-input v-model="addReq.description" placeholder="备注（限长200字符）" maxlength="200"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="uploadVisible=true;changeUpload(2);">上传文件</el-button>
            <el-button type="info" size="small" @click="getTemp()">下载模板</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <el-table
          :data="batchSnapshot"
          border>
          <el-table-column
            align="center"
            prop="customerName"
            label="客户姓名">
          </el-table-column>
          <el-table-column
            align="center"
            label="性别">
            <template slot-scope="scope">
              <div>{{scope.row.sex=== 1 ? '女' : '男'}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="身份证号">
            <template slot-scope="scope">
              <div>{{hideIdNumber(scope.row.idNumber)}}</div>
            </template>
          </el-table-column>
          <!-- <el-table-column
            align="center"
            label="联系方式">
             <template slot-scope="scope">
              <div>{{hideMobile(scope.row.mobile)}}</div>
            </template>
          </el-table-column> -->
          <el-table-column
            align="center"
            prop="resideAddress"
            label="地址">
          </el-table-column>
          <el-table-column
            align="center"
            prop="bankCardType"
            label="银行卡类型">
          </el-table-column>
        </el-table>
      </el-row>
      <div slot="footer" style="text-align: right;">
        <el-button size="small" type="primary" @click="submitForm('addBatch');addBatchList(addReq);">确认导入</el-button>
        <el-button size="small" type="primary" plain @click="addVisible = false;">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  queryBatch,
  queryDetailById,
  confirmimport,
  modifyBatch,
  delBatchById,
  delBatchs,
  batchListimport,
  getUploadPath
} from '@/api/batch_management'
import { getToken } from '@/utils/auth'
import { rule } from '@/utils/validate'
import { formatDateTime, clone } from '@/utils/tools'
import moment from 'moment'

export default {
  name: 'batch_management',
  data() {
    return {
      createTimeValue: null,
      formContainerOpen: '1',
      formContainer: this.$store.state.app.formContainer,
      fileList: [],
      file: {},
      detailVisible: false,
      delVisible: false, // 删除对话框显示隐藏
      editVisible: false, // 修改对话框显示隐藏
      addVisible: false, // 新建对话框显示隐藏
      batchDelVisible: false, // 批量删除对话框显示隐藏
      uploadVisible: false, // 上传模版
      tableData: [], // 表格数据
      validate: true, // 验证不通过阻止发请求
      failDetail: '',
      fileUrl: '', // 上传到的文件地址
      pageShow: true, // 分页显示隐藏
      rule: rule,
      ascrislistData: [], // 归属
      batchSnapshot: [],
      uploadData: {
        url: '',
        title: '',
        type: 0
      },
      token: localStorage.getItem('Admin-Token'),
      validity: [
        { name: '可用', val: '0' },
        { name: '不可用', val: '1' },
        { name: '导入中', val: '-1' }
      ],
      delReq: {
        batchId: ''
      },
      batchDelReq: {
        batchIds: []
      },
      // 查询 发送请求参数
      req: {
        batchId: '',
        batchName: '',
        modifierName: '',
        startCreateTime: '',
        endCreateTime: '',
        pageNo: 1,
        pageSize: 10
      },
      req2: {
        batchId: '',
        batchName: '',
        modifierName: '',
        startCreateTime: '',
        endCreateTime: '',
        pageNo: 1,
        pageSize: 10
      },
      batchDetail: {
      },
      addReq: {
        batchName: '',
        ascriptionId: '',
        validityTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        fileName: '',
        description: '',
        filePath: '',
        isInternalAdmin: ''
      },
      // 分页数据
      pageInfo: {}
    }
  },
  mounted() {
    this.formContainer()
    this.handleChangeAcitve()
    this.getBatch(this.req)
  },
  methods: {
    showSource(source) {
      if (source) {
        return source
      } else {
        return '无'
      }
    },
    handleChangeAcitve(active = ['1']) {
      if (active.length) {
        $('.form-more').text('收起')
      } else {
        $('.form-more').text('更多')
      }
    },
    // 深度克隆
    clone: clone,
    // 获取token
    getToken: getToken,
    // 时间戳转年月日时分秒
    formatDateTime: formatDateTime,
    // 切换上传对话框 1为上传模板 2为导入名单
    changeUpload(code) {
      if (code === 1) {
        this.uploadData.title = '上传模板'
        this.uploadData.url = '/api/v1/batch/uploadtemplate'
        this.uploadData.type = 1
      } else if (code === 2) {
        this.uploadData.title = '上传导入名单'
        this.uploadData.url = '/api/v1/batch/upload'
        this.uploadData.type = 2
      }
    },
    clearObj(obj) {
      for (const key in obj) {
        if (key !== 'pageNo') {
          obj[key] = ''
        }
      }
    },
    // 下载模版
    getTemp() {
      window.location.href = `/api/v1/batch/downloadtemp?token=Bearer ${this.token}`
      // window.location.href = `http://localhost:9091/batch/downloadtemp?token=Bearer ${this.token}`
    },
    // 上传
    // 验证上传文件的格式及大小
    beforeUpload(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      this.file = file
      console.log(file)
      const extension = testmsg === 'xls'
      const extension2 = testmsg === 'xlsx'
      const extension3 = testmsg === 'csv'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!extension && !extension2 && !extension3) {
        this.$message({
          message: '上传文件只能是 xls、xlsx、csv格式!',
          type: 'warning'
        })
      }
      if (!isLt2M) {
        this.$message({
          message: '上传文件大小不能超过 10MB!',
          type: 'warning'
        })
      }
      return (extension || extension2 || extension3) && isLt2M
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    uploadFileInfo(file) {
      if (!this.beforeUpload(file.file)) {
        return false
      }
      const d = new Date()
      const date_str = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
      // 先获取文件管理服务器预签名的上传地址
      const bucketName = 'crm'
      const objectName = localStorage.getItem('agentId') + '/' + date_str + '/' + file.file.name
      this.fileUrl = `${process.env.FILE_SERVER_URL}/crm/` + objectName
      getUploadPath(bucketName, objectName)
        .then(response => {
          if (response.data.presignedPutUrl) {
            // 成功获得地址 准备上传到服务器
            const xhr = new XMLHttpRequest()
            xhr.open('PUT', response.data.presignedPutUrl, true)
            xhr.send(file.file)
            xhr.onload = () => {
              if (xhr.status === 200) {
                // 上传到服务器成功
                this.$message.success('上传文件成功!')
                // 验证文件 生成快照
                confirmimport(this.fileUrl, file.file.name).then(res1 => {
                  if (res1.data.code === 0) {
                    this.batchSnapshot = res1.data.data.previewData
                    this.$message.success(res1.data.message)
                    this.fileList.length = 0
                    this.fileList.push(file)
                    this.addReq.fileName = file.name
                    this.addReq.filePath = this.fileUrl
                    this.uploadVisible = false
                  } else {
                    this.$message.error(res1.data.message)
                  }
                }).catch(error => {
                  console.log(error)
                })
              }
            }
          } else {
            this.$message.error(response.data.message)
          }
        })
    },
    // uploadSuccess(response, file, fileList) {
    //   if (response.code === 0) {
    //     this.$message.success(response.message)
    //     this.uploadVisible = false
    //     // 上传成功后生成快照
    //     if (this.uploadData.type === 2) {
    //       confirmimport(file.name).then(response => {
    //         if (response.data.code === 0) {
    //           this.batchSnapshot = response.data.data.previewData
    //           this.$message.success(response.data.message)
    //           this.fileList = fileList
    //           this.addReq.fileName = file.name
    //         }
    //       }).catch(error => {
    //         console.log(error)
    //         this.message(response.data.message)
    //       })
    //     }
    //   } else {
    //     this.$message(response.message)
    //   }
    // },
    // 清空上传列表
    clearUpload(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].clearFiles()
      }
    },
    // 确认导入
    addBatchList(addReq) {
      if (!this.validate) {
        return false
      }
      if (this.fileList.length !== 0) {
        this.addVisible = false
        addReq.isInternalAdmin = localStorage.getItem('is_internal_admin')
        batchListimport(addReq).then(response => {
          if (response.data.code === 0) {
            this.$message.success(response.data.message)
            this.addVisible = false
            this.getBatch(this.req2)
          } else {
            this.$message(response.data.message)
          }
        }).catch(error => {
          console.log(error)
          this.$message('操作失败')
        })
      } else {
        this.$message.error('请确认是否上传文件')
      }
    },
    //, 手机号码加密
    hideMobile(mobileNo) {
      if (mobileNo) {
        return mobileNo.substring(0, 3) + '****' + mobileNo.substring(7, 11)
      }
    },
    // 身份证号码加密
    hideIdNumber(idNumber) {
      if (idNumber) {
        return idNumber.substring(0, 10) + '****' + idNumber.substring(14, 18)
      }
    },
    // 重置
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
          this.$message.error('请检查是否填写正确')
          this.validate = false
        }
      })
    },
    // 清空重置
    clearForm() {
      this.req = {
        batchId: '',
        batchName: '',
        modifierName: '',
        startCreateTime: '',
        endCreateTime: '',
        pageNo: this.pageInfo.pageNo,
        pageSize: this.pageInfo.pageSize
      }
      this.req2 = {
        batchId: '',
        batchName: '',
        modifierName: '',
        startCreateTime: '',
        endCreateTime: '',
        pageNo: 1,
        pageSize: 10
      }
      this.createTimeValue = null
    },
    // 查询批次信息
    getBatch(val) {
      var req = val
      if (this.createTimeValue) {
        req.startCreateTime = this.createTimeValue[0]
        req.endCreateTime = this.createTimeValue[1]
      } else {
        req.startCreateTime = null
        req.endCreateTime = null
      }
      queryBatch(req)
        .then(response => {
          if (response.data.code === 0) {
            if (response.data.data) {
              this.tableData = response.data.data
              this.pageInfo = response.data.pageInfo
              this.pageShow = true
            } else {
              this.tableData = response.data.data
              this.pageShow = false
            }
          } else {
            this.$message(response.data.message)
            this.pageShow = false
          }
        })
        .catch(error => {
          console.log(error)
          this.$message('操作失败')
        })
    },
    // 删除批次信息
    delBatch(batchId) {
      delBatchById(batchId)
        .then(response => {
          if (response.data.code === 0) {
            this.$message.success(response.data.message)
            this.req2.pageNo = 1
            this.pageInfo.pageNo = 1
            this.getBatch(this.req2)
          } else {
            this.$message('删除成功')
          }
        })
        .catch(error => {
          console.log(error)
          this.$message('删除失败')
        })
    },
    // 查询失败详情
    getDetailById(batchId) {
      queryDetailById(batchId)
        .then(response => {
          if (response.data.code === 0) {
            this.batchDetail = response.data.data
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 修改批次信息
    editBatch(req) {
      if (!this.validate) {
        return false
      }
      delete req['creatorId']
      delete req['batchId']
      delete req['creatorName']
      delete req['creatorTime']
      delete req['importTime']
      this.editVisible = false
      modifyBatch(req).then(response => {
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
          this.getBatch(this.req2)
        } else {
          this.$message(response.data.message)
        }
      }).catch(error => {
        console.log(error)
        this.$message('操作失败')
      })
    },
    // 批量删除
    batchDelBatchs(batchDelReq) {
      if (batchDelReq.batchIds.length === 0) {
        this.$message.error('请选择需要删除的内容')
      } else {
        delBatchs(batchDelReq.batchIds).then(response => {
          if (response.data.code === 0) {
            this.$message.success(response.data.message)
            this.req2.pageNo = 1
            this.pageInfo.pageNo = 1
            this.getBatch(this.req2)
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
      this.batchDelReq.batchIds.length = 0
      for (var i = 0; i < val.length; i++) {
        this.batchDelReq.batchIds.push(val[i].batchId)
      }
    },
    // 页面显示条数
    handleSizeChange(val) {
      this.req2.pageSize = val
      this.req.pageSize = val
      this.req2.pageNo = 1
      this.pageInfo.pageNo = 1
      this.getBatch(this.req2)
    },
    // 分页翻页功能
    handleCurrentChange(val) {
      this.req2.pageNo = val
      this.getBatch(this.req2)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.overfl{
  word-wrap: break-word;
  word-break: normal;
}
</style>
