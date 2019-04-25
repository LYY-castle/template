<template>
  <div class="container">
    <el-collapse v-model="formContainerOpen" class="form-container" @change="handleChangeAcitve">
      <el-collapse-item title="筛选条件" name="1">
        <el-form :inline="true" size="small" :model="req" ref="searchForm">
          <el-form-item prop="startNumber" label="开始号段:">
            <el-input v-model="req.startNumber" placeholder="开始号段（限长45字符）" maxlength="45"></el-input>
          </el-form-item>
          <el-form-item  prop="endNumber" label="结束号段:">
            <el-input v-model="req.endNumber" placeholder="结束号段（限长45字符）" maxlength="45"></el-input>
          </el-form-item>
          <el-form-item  prop="modifier" label="操作人:">
            <el-input v-model="req.modifier" placeholder="操作人（限长45字符）" maxlength="45"></el-input>
          </el-form-item>
          <el-form-item label="操作时间：">
              <el-date-picker
                v-model.trim="timeValue"
                type="datetimerange"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="req.pageNo=1;paginationReq=cloneData(req);querynodisturbphones(req);">查询</el-button>
            <el-button @click="reset();">重置</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <!-- 表格 -->
    <el-row class="table-container">
      <el-row class="margin-bottom-20">
        <div class="font14 bold">免访号段表</div>
      </el-row>
      <el-row class="margin-bottom-20">
        <el-button type="success" size="small" @click="addVisible=true;clearForm(addNoDisturbPhonesDetail,'addPhonesForm');">新建</el-button>
        <el-button type="danger" size="small" @click="batchDelVisible=true">批量删除</el-button>
        <!-- <el-button type="primary" size="small" @click="op_hints1=true">批量可见</el-button>
        <el-button type="primary" size="small" @click="op_hints2=true" style="width:100px">批量不可见</el-button> -->
        <el-dropdown size="small" trigger="click" @command="moreOperating" style="margin-left:10px">
          <el-button type="info" style="width:auto">
            更多操作<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown" class="info">
            <el-dropdown-item command='1'>批量可见</el-dropdown-item>
            <el-dropdown-item command='2'>批量不可见</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-row>
      <el-row>
        <el-table
          :data="tableData"
          @selection-change="handleSelectionChange">
          <el-table-column
            align="center"
            type="selection"
            width="55"
            fixed>
          </el-table-column>
          <el-table-column
            align="center"
            label="开始号段 ~ 结束号段"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
             {{scope.row.startNumber+"~"+scope.row.endNumber}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="modifier"
            label="操作人"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.modifier }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作时间"
            >
            <template slot-scope="scope">
                <div>{{formatDateTime(scope.row.modifyTime)}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="号段状态" >
            <template slot-scope="scope">
              <div :class="scope.row.visible===1?'visible':'invisible'">
                <span>{{scope.row.visible===1?'可见':'不可见'}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            fixed="right">
          <template slot-scope="scope">
            <el-button @click="editVisible=true;delReq.id=scope.row.id;resetEdit();queryone(scope.row.id);" type="text" size="small">修改</el-button>
            <el-button @click="delVisible=true;delReq.id=scope.row.id" type="text" size="small">删除</el-button>
          </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row style="margin-top:20px;">
        <el-pagination
          v-if="pageShow"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page='pageInfo.pageNo'
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size='pageInfo.pageSize'
          layout="total, sizes, prev, pager, next, jumper "
          :total='pageInfo.totalCount' style="text-align: right;float:right;">
        </el-pagination>
      </el-row>
    </el-row>
    
    <!-- 新建免访号段 -->
     <el-dialog
      align:left
      width="30%"
      title="新建免访号段"
      :visible.sync="addVisible"
      append-to-body>
      <el-form size="small" :rules="rule" :model="addNoDisturbPhonesDetail" ref="addPhonesForm" label-width="100px">
        <el-form-item label="开始号段：" prop="startNumber">
           <el-input v-model="addNoDisturbPhonesDetail.startNumber" size="small" @blur.native="console.log(111);formatNum(addNoDisturbPhonesDetail.startNumber,'startNumber')" placeholder="开始号段（限长45字符）" maxlength="45"></el-input>
        </el-form-item>
        <el-form-item label="结束号段：" prop="endNumber">
             <el-input v-model="addNoDisturbPhonesDetail.endNumber" size="small" @blur.native="formatNum(addNoDisturbPhonesDetail.startNumber,'startNumber')" placeholder="结束号段（限长45字符）" maxlength="45"></el-input>
        </el-form-item>
        <el-form-item label="号段状态：" prop="visible">
          <el-switch
          v-model="addNoDisturbPhonesDetail.visible"
          active-text="可见"
          inactive-text="不可见"
          active-color="#67C23A"
          :active-value=1
          :inactive-value=0
          ></el-switch>
        </el-form-item>
      </el-form>
        <div slot="footer" style="text-align: right;">
          <el-button type="primary" @click="submitForm('addPhonesForm',addNoDisturbPhonesDetail);addNoDisturbZones(addNoDisturbPhonesDetail);">确定</el-button>
          <el-button @click="resetForm('addPhonesForm')">重置</el-button>
          <el-button type="primary" plain="" @click="addVisible = false">取消</el-button>
        </div>
      </el-dialog>
      <!-- 批量删除 -->
      <el-dialog
        width="30%"
        title="批量删除"
        :visible.sync="batchDelVisible"
        append-to-body>
        <span style="font-size:20px;">确定删除选定内容？</span>
        <div slot="footer" class="dialog-footer" style="text-align: right;">
          <el-button type="primary" @click="batchDelVisible = false;batchdel(batchDelReq);">确定</el-button>
          <el-button type="primary" plain @click="batchDelVisible = false">取消</el-button>
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
          <el-button type="primary" @click="delVisible = false;deleteone(delReq.id);">确定</el-button>
          <el-button type="primary" plain @click="delVisible = false">取消</el-button>
        </div>
      </el-dialog>
    <!-- 批量可见 -->
    <el-dialog
      width="30%"
      title="操作提示"
      :visible.sync="op_hints1"
      append-to-body>
      <span style="font-size:20px;">是否确认批量设置号段为可见？</span>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button type="primary" @click="op_hints1 = false;batchSetVisibleStatus(batchDelReq,1)">确 定</el-button>
        <el-button type="primary" plain @click="op_hints1 = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 批量不可见 -->
    <el-dialog
      width="30%"
      title="操作提示"
      :visible.sync="op_hints2"
      append-to-body>
      <span style="font-size:20px;">是否确认批量设置号段为不可见？</span>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button type="primary" @click="op_hints2 = false;batchSetVisibleStatus(batchDelReq,0)">确定</el-button>
        <el-button type="primary" plain @click="op_hints2 = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 修改免访客户 -->
    <el-dialog
      align:left
      width="30%"
      title="修改免访号段"
      :visible.sync="editVisible"
      append-to-body>
      <el-form size="small" :rules="rule" :model="editNoDisturbPhonesDetail" ref="editPhoneForm" label-width="100px">
        <el-form-item label="开始号段:" prop="startNumber">
          <el-input v-model="editNoDisturbPhonesDetail.startNumber" size="small" @blur.native="formatNum(editNoDisturbPhonesDetail.startNumber,'startNumber')" placeholder="开始号段（限长45字符）" maxlength="45"></el-input>
        </el-form-item>
        <el-form-item label="结束号段:" prop="endNumber">
            <el-input v-model="editNoDisturbPhonesDetail.endNumber" size="small" @blur.native="formatNum(editNoDisturbPhonesDetail.endNumber,'endNumber')" placeholder="结束号段（限长45字符）" maxlength="45"></el-input>
        </el-form-item>
        <el-form-item label="号段状态：" prop="visible">
          <el-switch
          v-model="editNoDisturbPhonesDetail.visible"
          active-text="可见"
          inactive-text="不可见"
          active-color="#67C23A"
          :active-value=1
          :inactive-value=0
          ></el-switch>
        </el-form-item>
        <el-form-item label="操作人:" prop="modifier">
          <span>{{editNoDisturbPhonesDetail.modifier}}</span>
        </el-form-item>
        <el-form-item label="操作时间:" prop="modifyTime">
          <span>{{formatDateTime(editNoDisturbPhonesDetail.modifyTime)}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: right;">
        <el-button type="primary" @click="submitForm('editPhoneForm',editNoDisturbPhonesDetail);eidtNoDisturbZones(editNoDisturbPhonesDetail);">确定</el-button>
        <el-button @click="queryone(delReq.id)">重置</el-button>
        <el-button type="primary" plain @click="editVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { batchSetVisible, querynodisturbphones, queryone, addNoDisturbZones, batchdel, eidtNoDisturbZones, deleteone } from '@/api/nodisturbphones_management'
import { formatDateTime } from '@/utils/tools'

export default {
  name: 'nodisturbphones_management',
  data() {
    var formatNum = (eule, value, callback) => {
      console.log(eule)
      var pattern = /^\d{1,11}$/
      var tag = pattern.test(value)
      if (tag) {
        var len = 11 - (value.toString().length)
        for (var i = 0; i < len; i++) {
          this.addNoDisturbPhonesDetail[eule.field] = '0' + this.addNoDisturbPhonesDetail[eule.field]
          this.editNoDisturbPhonesDetail[eule.field] = '0' + this.editNoDisturbPhonesDetail[eule.field]
        }
      }
      if (!tag) {
        return callback(new Error('请输入不超过11位数字号段'))
      } else {
        callback()
      }
    }
    return {
      timeValue: null,
      visibleClass: '',
      formContainerOpen: '1',
      formContainer: this.$store.state.app.formContainer,
      delVisible: false, // 删除对话框显示隐藏
      editVisible: false, // 修改对话框显示隐藏
      batchDelVisible: false, // 批量删除对话框显示隐藏
      validate: true, // 验证不通过阻止发请求
      addVisible: false, // 新建对话框显示隐藏
      pageShow: false, // 分页显示隐藏
      op_hints1: false,
      op_hints2: false,
      blur: false,
      rule: {
        startNumber: [
          { required: true, message: '开始号段不能为空', trigger: 'blur' },
          { pattern: /^\d{1,11}$/, message: '请输入不超过11位数字号段' },
          { validator: formatNum, trigger: 'blur' }
        ],
        endNumber: [
          { required: true, message: '开始号段不能为空', trigger: 'blur' },
          { pattern: /^\d{1,11}$/, message: '请输入不超过11位数字号段' },
          { validator: formatNum, trigger: 'blur' }
        ],
        visible: [
          {
            required: true, message: '请选择号段状态', trigger: 'blur'
          }
        ]
      },
      // 查询 发送请求参数
      req: {
        startNumber: '', // 号段
        endNumber: '', // 号段
        modifier: '', // 操作人
        queryStart: '', // 操作时间
        queryStop: '', // 操作时间
        pageNo: 1,
        pageSize: 10
      },
      paginationReq: {
        startNumber: '', // 号段
        endNumber: '', // 号段
        modifier: '', // 操作人
        queryStart: '', // 操作时间
        queryStop: '', // 操作时间
        pageNo: 1,
        pageSize: 10
      }, // 记录上次查询条件
      addNoDisturbPhonesDetail: {
        startNumber: '', // 开始号段
        endNumber: '', // 结束号段
        visible: 1 // 可见不可见字段
      },
      delReq: {
        id: ''
      },
      // 删除ids
      batchDelReq: {
        ids: []
      },
      pageInfo: {}, // 分页数据
      campaignOptions: [], // 选择活动数据
      tableData: [], // 表格数据
      editNoDisturbPhonesDetail: {}, // 修改免访客户
      noVisitCustomerDetail: {
        campaignIds: [],
        customerPhone: '',
        effectiveDate: '',
        expiryDate: ''

      }
    }
  },
  mounted() {
    this.formContainer()
    this.handleChangeAcitve()
    this.querynodisturbphones(this.req)
  },
  methods: {
    moreOperating(val) {
      if (val === '1') this.op_hints1 = true
      else this.op_hints2 = true
    },
    handleChangeAcitve(active = ['1']) {
      if (active.length) {
        $('.form-more').text('收起')
      } else {
        $('.form-more').text('更多')
      }
    },
    batchSetVisibleStatus(batchDelReq, visible) {
      if (batchDelReq.ids.length === 0) {
        this.$message.error('请先选择需要设置的免访号段！')
      } else {
        var NovisitPhoneList = {
          ids: batchDelReq.ids,
          visible: visible
        }
        batchSetVisible(NovisitPhoneList)
          .then(response => {
            if (response.data.code === 0) {
              this.$message.success(response.data.message)
              this.querynodisturbphones(this.req)
            } else {
              this.$message.error(response.data.message)
            }
          })
      }
    },
    // 重置查询框内容
    reset() {
      this.req = {
        startNumber: '', // 号段
        endNumber: '', // 号段
        modifier: '', // 操作人
        queryStart: '', // 操作时间
        queryStop: '', // 操作时间
        pageNo: this.pageInfo.pageNo,
        pageSize: this.pageInfo.pageSize
      }
      this.timeValue = null
    },
    resetAdd() {
      this.addNoDisturbPhonesDetail = {
        startNumber: '', // 开始号段
        endNumber: '', // 结束号段
        visible: 1
      }
    },
    resetEdit() {
      this.editNoDisturbPhonesDetail = {
        startNumber: '', // 开始号段
        endNumber: '' // 结束号段
      }
    },
    // 查询表格数据
    querynodisturbphones(val) {
      var req = val
      req.queryStart = this.timeValue ? this.timeValue[0] : null
      req.queryStop = this.timeValue ? this.timeValue[1] : null
      querynodisturbphones(req).then(response => {
        if (response.data.code === 0) {
          this.tableData = response.data.data
          if (response.data.pageInfo) {
            this.pageInfo = response.data.pageInfo
            this.pageShow = true
          } else {
            this.pageShow = false
          }
        } else {
          this.$message.error(response.data.messages)
          this.tableData = response.data.data
          this.pageShow = false
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 通过Id查询
    queryone(id) {
      queryone(id).then(response => {
        if (response.data.code === 0) {
          console.log(response.data.data)
          this.editNoDisturbPhonesDetail = response.data.data
        } else {
          this.$message.success(response.data.message)
        }
      }).catch(error => {
        console.error(error)
      })
    },
    // 新建
    addNoDisturbZones(obj) {
      if (!this.validate) {
        return
      }
      addNoDisturbZones(obj).then(response => {
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
          this.addVisible = false
          this.reset()
          this.resetAdd()
          this.querynodisturbphones(this.req)
        } else {
          this.$message.error('新建失败')
        }
      }).catch(error => {
        console.error(error)
      })
    },
    // 批量删除
    batchdel(batchDelReq) {
      if (batchDelReq.ids.length === 0) {
        this.$message.error('请选择需要删除的内容')
      } else {
        batchdel(batchDelReq.ids).then(response => {
          if (response.data.code === 0) {
            this.$message.success(response.data.message)
            this.paginationReq.pageNo = 1
            this.pageInfo.pageNo = 1
            this.querynodisturbphones(this.paginationReq)
          } else {
            this.$message.error('删除失败')
          }
        }).catch(error => {
          console.log(error)
        })
      }
    },
    // 修改
    eidtNoDisturbZones(params) {
      if (!this.validate) {
        return
      }
      eidtNoDisturbZones(params).then(response => {
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
          this.editVisible = false
          this.querynodisturbphones(this.paginationReq)
        } else {
          this.$message.error('修改失败')
        }
      }).catch(error => {
        console.error(error)
      })
    },
    // 删除
    deleteone(id) {
      deleteone(id).then(response => {
        if (response.data.code === 0) {
          this.$message.success(response.data.message)
          this.delVisible = false
          this.paginationReq.pageNo = 1
          this.pageInfo.pageNo =
          this.querynodisturbphones(this.paginationReq)
        } else {
          this.$message.error('删除失败')
        }
      }).catch(error => {
        console.error(error)
      })
    },
    formatDateTime: formatDateTime, // 时间格式化
    // 表格多选框
    handleSelectionChange(val) {
      this.batchDelReq.ids.length = 0
      for (var i = 0; i < val.length; i++) {
        this.batchDelReq.ids.push(val[i].id)
      }
    },
    // 页面显示条数
    handleSizeChange(val) {
      this.paginationReq.pageSize = val
      this.paginationReq.pageNo = 1
      this.req.pageSize = val
      this.req.pageNo = 1
      this.pageInfo.pageNo = 1
      this.querynodisturbphones(this.paginationReq)
    },
    // 分页翻页功能
    handleCurrentChange(val) {
      this.paginationReq.pageNo = val
      this.req.pageNo = val
      this.querynodisturbphones(this.paginationReq)
    },
    // 清空重置
    clearForm(obj, formName) {
      for (const key in obj) {
        if (key !== 'pageNo' && key !== 'pageSize') {
          obj[key] = ''
        }
      }
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
    },
    resetForm(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
    },
    // 校验检测
    submitForm(formName, value) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.validate = true
        } else {
          this.$message.error('请检查是否填写正确')
          this.validate = false
        }
        if (this.validate) {
          if (parseInt(value.startNumber) > parseInt(value.endNumber)) {
            this.$message.error('开始号段不能大于结束号段')
            this.validate = false
          }
        }
      })
    },
    formatNum(num, name) {
      var pattern = '/^\d{1,11}$/'
      var tag = pattern.test(num)
      if (tag) {
        var len = 11 - (num.toString().length)
        for (var i = 0; i < len; i++) {
          this.addNoDisturbPhonesDetail[name] = '0' + this.addNoDisturbPhonesDetail[name]
        }
        console.log(this.addNoDisturbPhonesDetail[name])
      }
    },
    // 克隆数据
    cloneData(obj) {
      var data = {}
      data = JSON.parse(JSON.stringify(obj))
      return data
    }
  }
}
</script>
