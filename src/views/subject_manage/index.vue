<template>
  <div class="app-container">
    <div class="filter-container">
      <el-collapse v-model="formContainerOpen" class="form-container" @change="handleChangeAcitve" style="position:relative;">
        <span class="form-more bold" style="float:right;margin-right:6px;color:#57AFFF;position:absolute;top:16px;right:41px;font-size: 14px">更多</span>
        <el-collapse-item title="筛选条件" name="1">
          <el-form :inline="true" class="demo-form-inline" size="small">
            <el-form-item label="考题内容：">
              <el-input placeholder="考题内容（模糊匹配）" v-model="formInline.context"></el-input>
            </el-form-item>
            <el-form-item label="考题等级:">
              <el-select v-model="formInline.complexity" placeholder="考题等级"  style="width:6em">
                <el-option value="" label="全部"></el-option>
                <el-option value="1" label="简单"></el-option>
                <el-option value="2" label="中等"></el-option>
                <el-option value="3" label="困难"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="考题类型:">
              <el-select v-model="formInline.type" placeholder="考题类型"  style="width:7em">
                <el-option value="" label="全部"></el-option>
                <el-option value="1" label="单选题"></el-option>
                <el-option value="2" label="判断题"></el-option>
                <el-option value="3" label="多选题"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="培训对象:">
              <el-select v-model="formInline.useObject" placeholder="考题对象"  style="width:8em">
                <el-option value="" label="全部"></el-option>
                <el-option value="1" label="坐席主管"></el-option>
                <el-option value="2" label="坐席"></el-option>
                <el-option value="3" label="质检主管"></el-option>
                <el-option value="4" label="质检员"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="操作人：">
              <el-input placeholder="操作人" v-model="formInline.userName"></el-input>
            </el-form-item>
            <el-form-item label="操作时间：">
              <el-date-picker
                v-model="receiveTimeValue"
                type="datetimerange"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search(formInline)">查询</el-button>
              <el-button @click="reset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
      <el-row class="table-container">
        <el-row class="margin-bottom-20">
          <div class="font14 bold">考题管理表</div>
        </el-row>
        <el-row class="margin-bottom-20">
          <el-button type="success" size="small" @click="addStaff">新建</el-button>
          <el-button type="primary" size="small" @click="batchAddStaff">批量导入</el-button>
          <el-button type="danger" size="small" @click="deleteQuestion">批量删除</el-button>
        </el-row>

        <el-row>
          <el-table
            :data="tableData"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange">
            <el-table-column
              align="center"
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              align="center"
              prop="id"
              label="考题编号"
              :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
              align="center"
              prop="userName"
              label="创建人">
            </el-table-column>
            <el-table-column
              align="center"
              prop="context"
              label="考题内容"
              :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
              align="center"
              prop="type"
              label="考题类型"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <div v-html="showQuestionsType(scope.row.type)"></div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="complexity"
              label="考题等级"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <div v-html="showQuestionsComplexity(scope.row.complexity)"></div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="useObject"
              label="培训对象">
              <template slot-scope="scope">
                <div v-html="showQuestionsUseObject(scope.row.useObject)"></div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="creatorTime"
              label="创建时间">
            </el-table-column>
            <el-table-column
              align="center"
              prop="modifierTime"
              label="最后修改时间">
            </el-table-column>
            <el-table-column
              align="center"
              label="操作"
              width="180">
              <template slot-scope="scope">
                <el-button @click="updateStaff(scope.row.id)" type="text" size="small">修改</el-button>
                <el-button
                  @click.native.prevent="deleteQuestion(scope.row.id,0)"
                  type="text"
                  size="small">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row style="margin-top:20px;">
          <el-col :span="20" :offset="4">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="pagination.pageNo"
              :page-sizes="[10, 20, 30, 40, 50]"
              :page-size="pagination.pageSize"
              layout="total, sizes, prev, pager, next, jumper "
              :total="pagination.totalCount" style="text-align: right">
            </el-pagination>
          </el-col>
        </el-row>
      </el-row>
    </div>
    <div>

      <!-- 批量导入考题 -->
      <el-dialog
        align:left
        width="30%"
        title="导入考题"
        :visible.sync="importVisible"
        append-to-body
        @close="batchDialog" >
        <el-form label-width="100px">
          <el-form-item label="上传文件：" class="inputWidth">
            <el-input size="small" v-model="importInfo.uploadFileName" disabled style="width: 70%"></el-input>
          </el-form-item>
        </el-form>
        <div style="float: right;">
          <el-upload
            ref="upload"
            :action="uploadUrl"
            :headers="{'Authorization':'Bearer ' +token}"
            :http-request="uploadFileInfo"
            :on-change="handleUploadOnChange"
            :show-file-list="false"
            :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <a href="http://119.27.179.175:8111/training/download/importTemplate">
              <el-button size="small" type="info">下载模板</el-button>
            </a>
          </el-upload>
        </div>
        <br/><br/>
        <div style="float: right">
          <span style="font-size:12px;color:red">提示：文件格式支持xls、xlsx，文件大小限制为10M</span>
        </div>
        <br/>
        <div v-if="hasFalseinfo">
          <span style="font-size:18px"><b>验证失败原因</b></span>
          <el-table :data="falseInfo" border highlight-current-row>
            <el-table-column
              align="center"
              label="行"
              prop="rowNum">
            </el-table-column>
            <el-table-column
              align="center"
              label="列"
              prop="colNum">
            </el-table-column>
            <el-table-column
              align="center"
              label="失败原因"
              prop="log">
            </el-table-column>
          </el-table>
        </div>
        <div slot="footer">
          <el-button type="primary" @click="submitUploadandimport()">确认导入</el-button>
          <el-button type="primary" @click="batchDialog">取消</el-button>
        </div>
      </el-dialog>


      <!-- 修改考题 -->
      <el-dialog title="修改考题" :visible.sync="dialogUpdateFormVisible" width="30%" @close="updateForm"
                 append-to-body>
        <el-form size="small" :model="updateForm" :rules="rules" ref="updateForm" label-width="100px"
                 class="demo-ruleForm">
          <el-form-item label="考题内容:" prop="context">
            <el-input v-model="updateForm.context" type="text"></el-input>
          </el-form-item>
          <el-form-item label="考题类型:" prop="type">
            <el-radio-group v-model="updateForm.type" size="small">
              <el-radio-button label="1">单选题</el-radio-button>
              <el-radio-button label="3">多选题</el-radio-button>
              <el-radio-button label="2">判断题</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="难度等级:" prop="complexity">
            <el-radio-group v-model="updateForm.complexity" size="small">
              <el-radio-button label="1">简单</el-radio-button>
              <el-radio-button label="2">中等</el-radio-button>
              <el-radio-button label="3">困难</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="培训对象" prop="useObject">
            <el-radio-group v-model="updateForm.useObject" size="small">
              <el-radio-button label="1">坐席主管</el-radio-button>
              <el-radio-button label="2">坐席</el-radio-button>
              <el-radio-button label="3">质检主管</el-radio-button>
              <el-radio-button label="4">质检员</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="正确答案:" prop="sucAnswer" v-show="updateForm.type!=2">
            <el-input v-model="updateForm.sucAnswer" placeholder="答案英文半角分号区分"></el-input>
            <label style="color: red;font-size:12px">答案使用英文半角分号隔断</label>
          </el-form-item>
          <el-form-item label="错误答案:" prop="errorAnswer" v-show="updateForm.type!=2">
            <el-input v-model="updateForm.errorAnswer" placeholder="答案英文半角分号区分"></el-input>
            <label style="color: red;font-size:12px">答案使用英文半角分号隔断</label>
          </el-form-item>
          <el-form-item label="判断题答案:" prop="isRight" v-show="updateForm.type==2">
            <el-radio-group v-model="updateForm.isRight" size="small">
              <el-radio-button label="1">正确</el-radio-button>
              <el-radio-button label="0">错误</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addReset">重置</el-button>
          <el-button plain type="primary" @click="dialogUpdateFormVisible = false">取消</el-button>
          <el-button type="primary" @click="updateQuestions('updateForm')">确定</el-button>
        </div>
      </el-dialog>


      <!-- 新增考题 -->
      <el-dialog title="新建考题" :visible.sync="dialogAddFormVisible" width="30%" @close="addReset()"
                 append-to-body>
        <el-form size="small" :model="addForm" :rules="rules" ref="addForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="考题内容:" prop="context">
            <el-input v-model="addForm.context" type="text"></el-input>
          </el-form-item>
          <el-form-item label="考题类型:" prop="type">
            <el-radio-group v-model="addForm.type" size="small">
              <el-radio-button label="1">单选题</el-radio-button>
              <el-radio-button label="3">多选题</el-radio-button>
              <el-radio-button label="2">判断题</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="难度等级:" prop="complexity">
            <el-radio-group v-model="addForm.complexity" size="small">
              <el-radio-button label="1">简单</el-radio-button>
              <el-radio-button label="2">中等</el-radio-button>
              <el-radio-button label="3">困难</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="考题对象:" prop="useObject">
            <el-radio-group v-model="addForm.useObject" size="small">
              <el-radio-button label="1">坐席主管</el-radio-button>
              <el-radio-button label="2">坐席</el-radio-button>
              <el-radio-button label="3">质检主管</el-radio-button>
              <el-radio-button label="4">质检员</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="正确答案:" prop="sucAnswer" v-show="addForm.type!=2">
            <el-input v-model="addForm.sucAnswer" placeholder="答案英文半角分号区分"></el-input>
          </el-form-item>
          <el-form-item label="错误答案:" prop="errorAnswer" v-show="addForm.type!=2">
            <el-input v-model="addForm.errorAnswer" placeholder="答案英文半角分号区分"></el-input>
          </el-form-item>
          <el-form-item label="判断题答案:" prop="isRight" v-show="addForm.type==2">
            <el-radio-group v-model="addForm.isRight" size="small">
              <el-radio-button label="1">正确</el-radio-button>
              <el-radio-button label="0">错误</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addQuestions('addForm')">确定</el-button>
          <el-button @click="addReset">重置</el-button>
          <el-button plain type="primary" @click="dialogAddFormVisible = false">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>


<script>
  import {
    querySynthesizeReq,
    queryQuestionsOne,
    deleteQuestions,
    addQuestions,
    uploadFileandImport,
    updateQuestions
  } from '@/api/subject_manage.js'
  import { Message, MessageBox } from 'element-ui'

  export default {
    name: 'subject_manage',
    data() {
      return {
        formContainerOpen: '1',
        formContainer: this.$store.state.app.formContainer,
        pageShow: false,
        receiveTimeValue: [],
        multipleSelection: [],
        formInline: {
          userName: '',
          context: '',
          type: '',
          complexity: '',
          useObject: '',
          pageNo: 1,
          pageSize: 10
        },
        pagination: {
          pageSize: null,
          pageNo: null,
          totalCount: null,
          totalPage: null
        },
        batchDelParam: {
          idlist: []
        },
        addForm: {
          id: null,
          context: null,
          type: null,
          useObject: null,
          complexity: null,
          sucAnswer: null,
          errorAnswer: null,
          isRight: null
        },
        rules: {
          type: [
            { required: true, message: '考题类型不能为空', trigger: 'blur' }
          ],
          complexity: [
            { required: true, message: '难度等级不能为空', trigger: 'blur' }
          ],
          useObject: [
            { required: true, message: '考题对象不能为空', trigger: 'blur' }
          ],
          context: [
            { required: true, message: '考题内容不能为空', trigger: 'blur' }
          ],
          uploadFileName: [
            { required: true, message: '文件名不能为空', trigger: 'blur' }
          ]
        },
        importInfo: { // 导入需要的信息
          uploadFileName: ''
        },
        hasFalseinfo: false, // 校验是否有错误信息
        falseInfo: [], // 批量导入错误信息
        importVisible: false, // 导入考题对话框显示隐藏
        uploadUrl: 'questions/upload', // 上传文件url
        token: localStorage.getItem('Admin-Token'),
        dialogAddFormVisible: false,
        dialogUpdateFormVisible: false,
        tableData: [],
        updateForm: []
      }
    },
    mounted() {
      this.handleChangeAcitve()
      this.querySynthesize(this.formInline)
    },

    methods: {
      handleChangeAcitve(active = ['1']) {
        if (active.length) {
          $('.form-more').text('收起')
        } else {
          $('.form-more').text('更多')
        }
      },

      // 综合查询
      querySynthesize(formInline) {
        querySynthesizeReq(formInline).then(res => {
          this.tableData = res.data.data
          console.log(this.tableData)
          this.pagination = res.data.pageInfo
        })
      },

      // 条件查询
      search(formInline) {
        const obj = {}
        obj.id = formInline.id ? formInline.id : ''
        obj.context = formInline.context ? formInline.context : ''
        obj.complexity = formInline.complexity ? formInline.complexity : ''
        obj.type = formInline.type ? formInline.type : ''
        obj.useObject = formInline.useObject ? formInline.useObject : ''
        obj.userName = formInline.userName ? formInline.userName : ''
        obj.startCreateTime = this.receiveTimeValue ? this.receiveTimeValue[0] : null
        obj.endCreateTime = this.receiveTimeValue ? this.receiveTimeValue[1] : null
        obj.pageNo = this.pagination.pageNo ? this.pagination.pageNo : this.formInline.pageNo
        obj.pageSize = this.pagination.pageSize ? this.pagination.pageSize : this.formInline.pageSize
        console.log(obj)
        querySynthesizeReq(obj).then(res => {
          this.tableData = res.data.data
          this.pagination = res.data.pageInfo
        })
      },

      // 分页
      handleSizeChange(val) {
        this.pagination.pageSize = val
        this.search(this.formInline)
      },
      handleCurrentChange(val) {
        this.formInline.pageNo = val
        this.formInline.pageSize = this.pagination.pageSize
        this.search(this.formInline)
      },

      // 重置
      reset() {
        this.receiveTimeValue = []
        this.formInline = {
          userName: '',
          context: '',
          type: '',
          complexity: '',
          useObject: ''
        }
      },
      addReset() {
        this.addForm = {
          context: null,
          type: null,
          useObject: null,
          complexity: null,
          sucAnswer: null,
          errorAnswer: null,
          isRight: null
        }
      },

      // 新增窗口控制
      addStaff() {
        this.dialogAddFormVisible = true
      },
      // 修改窗口控制
      updateStaff(questionsId) {
        this.dialogUpdateFormVisible = true
        queryQuestionsOne(questionsId).then(res => {
          this.updateForm = res.data.data
        })
      },

      // 修改
      updateQuestions(updateForm) {
        this.$refs[updateForm].validate((valid) => {
          if (valid) {
            this.addForm = this.updateForm
            this.addForm.userId = localStorage.getItem('agentId'),
            updateQuestions(this.addForm).then(res => {
              if (res.data.code === 0) {
                Message({
                  message: res.data.message,
                  type: 'success'
                })
                this.pagination.pageNo = 1
                this.search(this.formInline)
              } else {
                Message({
                  message: res.data.message,
                  type: 'error'
                })
              }
              this.$refs[updateForm].resetFields()
              this.dialogUpdateFormVisible = false
            })
          }
        })
      },

      // 导入窗口控制
      batchAddStaff() {
        this.importVisible = true
      },

      // 导入窗口清除缓存
      batchDialog() {
        this.importVisible = false
        // this.$refs.upload.clearFiles()
        this.importInfo = {
          uploadFileName: ''
        }
        this.falseInfo = []
        this.hasFalseinfo = false
      },

      // 批量导入文件
      submitUploadandimport() {
        this.$refs.upload.submit()
      },

      // 上传的动作
      uploadFileInfo(fileList) {
        var formdata = new FormData()
        if (this.importInfo.uploadFileName != '') {
          formdata.append('multipartFile', fileList.file)
          uploadFileandImport(formdata).then(response => {
            if (response.data.code === 0) {
              this.hasFalseinfo = false
              this.$message.success(response.data.message)
              this.importVisible = false
              this.formInline.pageNo = 1
              // 查询列表
              setTimeout(() => {
                this.search(this.formInline)
              }, 1000)
            } else {
              this.$message.error(response.data.message)
              this.falseInfo = response.data.data
              this.hasFalseinfo = true
            }
          })
        } else {
          this.$message.error('上传文件不能为空')
        }
      },

      handleUploadOnChange(file, fileList) {
        fileList.length = 0
        this.file = file
        fileList.push(file)
        this.importInfo.uploadFileName = file.name
        var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)

        const extension = testmsg === 'xls'
        const extension2 = testmsg === 'xlsx'
        const isLt2M = file.size / 1024 / 1024 < 10
        if (!extension && !extension2) {
          this.$message({
            message: '上传文件只能是 xls、xlsx格式!',
            type: 'warning'
          })
          fileList.length = 0
          this.importInfo.uploadFileName = ''
        }
        if (!isLt2M) {
          this.$message({
            message: '上传文件大小不能超过 10MB!',
            type: 'warning'
          })
          fileList.length = 0
          this.importInfo.uploadFileName = ''
        }
      },

      // 添加
      addQuestions(addForm) {
        this.$refs[addForm].validate((valid) => {
          if (valid) {
            this.addForm.userId = localStorage.getItem('agentId'),
            addQuestions(this.addForm).then(res => {
              if (res.data.code === 0) {
                Message({
                  message: res.data.message,
                  type: 'success'
                })
                this.pagination.pageNo = 1
                this.search(this.formInline)
              } else {
                Message({
                  message: res.data.message,
                  type: 'error'
                })
              }
              this.$refs[addForm].resetFields()
              this.dialogAddFormVisible = false
            })
          }
        })
      },

      // 单个/批量 删除
      deleteQuestion(id, isBatchDel) {
        debugger
        var reminder
        // 判断是否批量删除
        if (isBatchDel != 0) {
          reminder = '确定执行批量删除操作吗？'
          this.batchDelParam = this.multipleSelection.map(function(item, index) {
            return item.id
          }).join(',')
        } else {
          reminder = '确定执行删除操作吗？'
          this.batchDelParam = id
        }
        MessageBox.confirm(reminder, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteQuestions(this.batchDelParam).then(res => {
            if (res.data.code === 0) {
              Message({
                message: res.data.message,
                type: 'success',
                duration: 1000
              })
              this.pagination.pageNo = 1
              this.search(this.formInline)
            } else {
              Message({
                message: '删除失败',
                type: 'error'
              })
            }
          })
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },

      // 表单判断
      showQuestionsType(judge) {
        if (judge == 1) {
          return '单选题'
        } else if (judge == 2) {
          return '判断题'
        } else if (judge == 3) {
          return '多选题'
        }
      },
      showQuestionsComplexity(judge) {
        if (judge == 1) {
          return '简单'
        } else if (judge == 2) {
          return '中等'
        } else if (judge == 3) {
          return '困难'
        }
      },
      showQuestionsUseObject(judge) {
        if (judge == 1) {
          return '坐席主管 '
        } else if (judge == 2) {
          return '坐席'
        } else if (judge == 3) {
          return '质检主管'
        } else if (judge == 4) {
          return '质检员'
        }
      }

    }
  }
</script>

<style scoped>

</style>
