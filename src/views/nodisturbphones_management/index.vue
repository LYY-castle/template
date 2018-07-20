<template>
  <div class="container" style="padding:0 20px;">
      <el-row margin-top:>
      <el-form :inline="true" size="small" :model="req" ref="searchForm">
        <el-form-item prop="startNumber">
          <el-input v-model="req.startNumber" placeholder="开始号段"></el-input>
        </el-form-item>
        <el-form-item  prop="endNumber">
          <el-input v-model="req.endNumber" placeholder="结束号段"></el-input>
        </el-form-item>
        <el-form-item  prop="modifier">
          <el-input v-model="req.modifier" placeholder="操作人员"></el-input>
        </el-form-item>
        <el-form-item label="操作时间：">
            <el-date-picker
                v-model="req.queryStart"
                type="datetime"
                placeholder="开始日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                default-time="00:00:00">
            </el-date-picker>
            到
            <el-date-picker
                v-model="req.queryStop"
                type="datetime"
                placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                default-time="00:00:00">
            </el-date-picker>
          </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="req.pageNo=1;paginationReq=cloneData(req);querynodisturbphones(req);" icon="el-icon-search">查询</el-button>
          <el-button type="danger" @click="reset();">重置</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <!-- 表格 -->
    <el-row>
      <el-col>
        <el-table
          :data="tableData"
          border
          @selection-change="handleSelectionChange">
          <el-table-column
            align="center"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            align="center"
            label="序号"
            width="55">
            <template
              slot-scope="scope">
              <div>{{scope.$index+(req.pageNo-1)*10+1}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="开始号段 ~ 结束号段">
            <template slot-scope="scope">
             <div>{{scope.row.startNumber+"~"+scope.row.endNumber}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="modifier"
            label="操作人">
          </el-table-column>
          <el-table-column
            align="center"
            label="操作时间">
            <template slot-scope="scope">
                <div>{{formatDateTime(scope.row.modifyTime)}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="200">1
          <template slot-scope="scope">
            <el-button @click="editVisible=true;delReq.id=scope.row.id;resetEdit();queryone(scope.row.id);" type="text" size="small">修改</el-button>
            <el-button @click="delVisible=true;delReq.id=scope.row.id" type="text" size="small">删除</el-button>
          </template>
          </el-table-column>
        </el-table>
      </el-col> 
    </el-row>
    <el-row style="margin-top:5px;">
        <el-button type="success" size="small" @click="addVisible=true;clearForm(addNoDisturbPhonesDetail,'addPhonesForm');">创建免访号段</el-button>
        <el-button type="danger" size="small" @click="batchDelVisible=true">批量删除</el-button>
        <el-pagination
          v-if="pageShow"
          background
          @current-change="handleCurrentChange"
          :current-page=pageInfo.pageNo
          :page-sizes="[10, 20, 30, 50]"
          :page-size=pageInfo.pageSize
          layout="total, prev, pager, next, jumper"
          :total=pageInfo.totalCount style="text-align: right;float:right;">
        </el-pagination>
    </el-row>
    <!-- 新增免访号段 -->
     <el-dialog
      align:left
      width="30%"
      title="新增免访号段"
      :visible.sync="addVisible"
      append-to-body>
      <el-form :rules="rule" :model="addNoDisturbPhonesDetail" ref="addPhonesForm" label-width="100px">
        <el-form-item label="开始号段" prop="startNumber">
           <el-input v-model="addNoDisturbPhonesDetail.startNumber" size="small" @blur.native="console.log(111);formatNum(addNoDisturbPhonesDetail.startNumber,'startNumber')"></el-input>
        </el-form-item>
        <el-form-item label="结束号段:" prop="endNumber">
             <el-input v-model="addNoDisturbPhonesDetail.endNumber" size="small" @blur.native="formatNum(addNoDisturbPhonesDetail.startNumber,'startNumber')"></el-input>
        </el-form-item>
      </el-form>
        <div slot="footer" style="text-align: right;">
          <el-button type="danger" @click="resetForm('addPhonesForm')">重 置</el-button>
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('addPhonesForm',addNoDisturbPhonesDetail);addNoDisturbZones(addNoDisturbPhonesDetail);">确 定</el-button>
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
          <el-button @click="batchDelVisible = false">取 消</el-button>
          <el-button type="primary" @click="batchDelVisible = false;batchdel(batchDelReq);">确 定</el-button>
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
        <el-button type="primary" @click="delVisible = false;deleteone(delReq.id);">确 定</el-button>
      </div>
    </el-dialog>
      <!-- 修改免访客户 -->
      <el-dialog
      align:left
      width="30%"
      title="修改免访号段"
      :visible.sync="editVisible"
      append-to-body>
      <el-form :rules="rule" :model="editNoDisturbPhonesDetail" ref="editPhoneForm" label-width="100px">
        <el-form-item label="开始号段:" prop="startNumber">
           <el-input v-model="editNoDisturbPhonesDetail.startNumber" size="small" @blur.native="formatNum(editNoDisturbPhonesDetail.startNumber,'startNumber')"></el-input>
        </el-form-item>
        <el-form-item label="结束号段:" prop="endNumber">
             <el-input v-model="editNoDisturbPhonesDetail.endNumber" size="small" @blur.native="formatNum(editNoDisturbPhonesDetail.endNumber,'endNumber')"></el-input>
        </el-form-item>
        <el-form-item label="操作人员:" prop="modifier">
          <span>{{editNoDisturbPhonesDetail.modifier}}</span>
        </el-form-item>
        </el-form-item>
         <el-form-item label="操作时间:" prop="modifyTime">
          <span>{{formatDateTime(editNoDisturbPhonesDetail.modifyTime)}}</span>
        </el-form-item>
      </el-form>
        <div slot="footer" style="text-align: right;">
          <el-button type="danger" @click="queryone(delReq.id)">重 置</el-button>
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('editPhoneForm',editNoDisturbPhonesDetail);eidtNoDisturbZones(editNoDisturbPhonesDetail);">确 定</el-button>
        </div>
      </el-dialog>
  </div>
</template>
<script>
import { querynodisturbphones, queryone, addNoDisturbZones, batchdel, eidtNoDisturbZones, deleteone } from '@/api/nodisturbphones_management'
import { formatDateTime } from '@/utils/tools'

export default {
  name: 'customerNoVisit',
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
      delVisible: false, // 删除对话框显示隐藏
      editVisible: false, // 修改对话框显示隐藏
      batchDelVisible: false, // 批量删除对话框显示隐藏
      validate: true, // 验证不通过阻止发请求
      addVisible: false, // 添加对话框显示隐藏
      pageShow: false, // 分页显示隐藏
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
        ]
      },
      // 查询 发送请求参数
      req: {
        startNumber: '', // 号段
        endNumber: '', // 号段
        modifier: '', // 操作人
        queryStart: '', // 操作时间
        queryStop: '', // 操作时间
        pageNo: 1
      },
      paginationReq: {
        startNumber: '', // 号段
        endNumber: '', // 号段
        modifier: '', // 操作人
        queryStart: '', // 操作时间
        queryStop: '', // 操作时间
        pageNo: 1
      }, // 记录上次查询条件
      addNoDisturbPhonesDetail: {
        startNumber: '', // 开始号段
        endNumber: '' // 结束号段
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
    this.querynodisturbphones(this.req)
  },
  methods: {
    // 重置查询框内容
    reset() {
      this.req = {
        startNumber: '', // 号段
        endNumber: '', // 号段
        modifier: '', // 操作人
        queryStart: '', // 操作时间
        queryStop: '', // 操作时间
        pageNo: 1
      }
    },
    resetAdd() {
      this.addNoDisturbPhonesDetail = {
        startNumber: '', // 开始号段
        endNumber: '' // 结束号段
      }
    },
    resetEdit() {
      this.editNoDisturbPhonesDetail = {
        startNumber: '', // 开始号段
        endNumber: '' // 结束号段
      }
    },
    // 查询表格数据
    querynodisturbphones(req) {
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
          this.$message(response.data.messages)
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
          this.editNoDisturbPhonesDetail = response.data.data
        } else {
          this.$message.success(response.data.message)
        }
      }).catch(error => {
        console.error(error)
      })
    },
    // 新增
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
          this.$message('添加失败')
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
            this.querynodisturbphones(this.paginationReq)
          } else {
            this.$message('删除失败')
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
          this.$message('修改失败')
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
          this.querynodisturbphones(this.paginationReq)
        } else {
          this.$message('删除失败')
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
    // 分页翻页功能
    handleCurrentChange(val) {
      this.paginationReq.pageNo = val
      this.req.pageNo = val
      this.querynodisturbphones(this.paginationReq)
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
    resetForm(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
    },
    // 校验检测
    submitForm(formName, value) {
      console.log(value)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.validate = true
        } else {
          this.$message.error('请检查是否填写正确')
          this.validate = false
        }
        console.log(this.validate)
        if (this.validate) {
          if (parseInt(value.startNumber) > parseInt(value.endNumber)) {
            this.$message.error('开始号段不能大于结束号段')
            this.validate = false
          }
        }
      })
    },
    formatNum(num, name) {
      console.log(111)
      var pattern = '/^\d{1,11}$/'
      var tag = pattern.test(num)
      console.log(tag)
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

