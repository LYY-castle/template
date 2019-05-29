<template>
  <div class="container" >
    <el-collapse v-model="formContainerOpen" class="form-container" @change="handleChangeAcitve">
      <el-collapse-item title="筛选条件" name="1">
        <el-form :inline="true" size="small" :model="req" ref="searchForm">
          <el-form-item prop="name" label="名称：">
            <el-input v-model="req.name" placeholder="名称" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item prop="offerType" label="优惠类型：">
             <el-select placeholder="优惠类型：" v-model="req.offerType"  style="width:6em">
              <el-option label="全部" value=''></el-option>
              <el-option label="免费住宿" :value=0></el-option>
              <el-option label="住二送一" :value=1></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="bedType" label="床型：">
             <el-select placeholder="床型：" v-model="req.bedType"  style="width:6em">
              <el-option label="全部" value=''></el-option>
              <el-option label="大床" :value=0></el-option>
              <el-option label="双床" :value=1></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="mealType" label="餐型：">
             <el-select placeholder="床型：" v-model="req.mealType"  style="width:6em">
              <el-option label="全部" value=''></el-option>
              <el-option label="无早" :value=0></el-option>
              <el-option label="单早" :value=1></el-option>
              <el-option label="双早" :value=2></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="status" label="状态：">
            <el-select placeholder="状态：" v-model="req.status"  style="width:6em">
              <el-option label="全部" value=''></el-option>
              <el-option label="有效" :value=0></el-option>
              <el-option label="无效" :value=1></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" @click="req.pageNo=1;queryList(req)">查询</el-button>
            <el-button size="small" @click="resetReq();">重置</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
     <!-- 表格 -->
    <el-row class="table-container">
      <el-row class="margin-bottom-20">
        <div class="font14 bold">酒店资料库表</div>
      </el-row>
      <el-row class="margin-bottom-20">
        <el-button type="success" size="small" @click="addVisible=true;restAddHotel()">新建</el-button>
        <el-dropdown size="small" trigger="click" @command="moreOperating" style="margin-left:10px">
          <el-button type="info" style="width:auto">
            更多操作<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown" class="info">
            <el-dropdown-item command='1'>批量有效</el-dropdown-item>
            <el-dropdown-item command='2'>批量无效</el-dropdown-item>
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
            width="50">
          </el-table-column>
          <el-table-column
            width="140"
            align="center"
            label="名称"
            prop="name">
          </el-table-column> 
          <el-table-column
            align="center"
            label="国籍"
            prop="country"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            align="center"
            label="城市"
            prop="city"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            align="center"
            label="地址"
            prop="address"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            width="80"
            align="center"
            label="优惠类型"
            prop="offerType">
            <template slot-scope="scope">
              {{offerTypeName(scope.row.offerType)}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="房型"
            prop="roomType"
            :show-overflow-tooltip="true">
          </el-table-column>      
          <el-table-column
            width="80"
            align="center"
            label="床型"
            prop="bedType">
            <template slot-scope="scope">
              {{bedTypeName(scope.row.bedType)}}
            </template>
          </el-table-column>
          <el-table-column
            width="80"
            align="center"
            label="餐型"
            prop="mealType">
            <template slot-scope="scope">
              {{mealTypeName(scope.row.mealType)}}
            </template>
          </el-table-column>
           <el-table-column
            width="80"
            align="center"
            label="状态"
            prop="status">
            <template slot-scope="scope">
              {{statusName(scope.row.status)}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="130"
            :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-button @click="modifyVisible=true;modifyId=scope.row.id;findHotelById(scope.row.id)" type="text" size="small">修改</el-button>
            <el-button @click="updateStatus(scope.row.id,0)" v-if="scope.row.status===1" type="text" size="small">有效</el-button>
            <el-button @click="updateStatus(scope.row.id,1)" v-if="scope.row.status===0" type="text" size="small">无效</el-button>
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
    <!-- 新建产品 -->
    <el-dialog
      align:left
      width="32%"
      title="新建酒店资料库"
      :visible.sync="addVisible"
      append-to-body>
      <el-form size="small" :rules="rules" :model="addHotel" ref="refAddHotel" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="addHotel.name" size="small" placeholder="限长50字符" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="国籍" prop="country">
          <el-input v-model="addHotel.country" size="small" placeholder="限长45字符" maxlength="45"></el-input>
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-input v-model="addHotel.city" size="small" placeholder="限长45字符" maxlength="45"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="addHotel.address" size="small" placeholder="限长100字符" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="房型" prop="roomType">
          <el-input v-model="addHotel.roomType" size="small" placeholder="如：豪华客房（限长45字符）" maxlength="45"></el-input>
        </el-form-item>
        <el-form-item prop="offerType" label="优惠类型：">
             <el-select placeholder="优惠类型：" v-model="addHotel.offerType"  style="width:6em">
              <el-option label="请选择优惠类型" value=''></el-option>
              <el-option label="免费住宿" :value=0></el-option>
              <el-option label="住二送一" :value=1></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="bedType" label="床型：">
             <el-select placeholder="床型：" v-model="addHotel.bedType"  style="width:6em">
              <el-option label="请选择床型" value=''></el-option>
              <el-option label="大床" :value=0></el-option>
              <el-option label="双床" :value=1></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="mealType" label="餐型：">
             <el-select placeholder="餐型：" v-model="addHotel.mealType"  style="width:6em">
              <el-option label="请选择餐型" value=''></el-option>
              <el-option label="无早" :value=0></el-option>
              <el-option label="单早" :value=1></el-option>
              <el-option label="双早" :value=2></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="status" label="状态：">
            <el-switch
              v-model="addHotel.status"
              active-text="有效"
              inactive-text="无效"
              active-color="#67C23A"
              :active-value=0
              :inactive-value=1
            ></el-switch>
          </el-form-item>
      </el-form>
        <div slot="footer" style="text-align: right;">
          <el-button size="small" type="primary" @click="add('refAddHotel')">确定</el-button>
          <el-button size="small" @click="restAddHotel(modifyId);">重置</el-button>
          <el-button size="small" type="primary" plain @click="addVisible = false">取消</el-button>
        </div>
    </el-dialog>
    <!-- 批量有效 -->
    <el-dialog
      width="30%"
      title="批量有效"
      :visible.sync="batchValidVisible"
      append-to-body>
      <span style="font-size:20px;">是否设置选定内容为有效吗？</span>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button type="primary" @click="batchUpdateStatus(0)">确定</el-button>
        <el-button type="primary" plain @click="batchValidVisible = false">取消</el-button>
      </div>
    </el-dialog>
     <!-- 批量无效 -->
    <el-dialog
      width="30%"
      title="批量无效"
      :visible.sync="batchInvalidVisible"
      append-to-body>
      <span style="font-size:20px;">是否设置选定内容为无有效吗？</span>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button type="primary" @click="batchUpdateStatus(1)">确定</el-button>
        <el-button type="primary" plain @click="batchInvalidVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 修改状态 -->
    <el-dialog
      width="30%"
      title="删除"
      :visible.sync="updateStatusVisible"
      append-to-body>
      <span style="font-size:20px;">确定删选定内容？</span>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button type="primary" @click="updateStatus(productId);">确定</el-button>
        <el-button type="primary" plain @click="updateStatusVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 修改产品 -->
    <el-dialog
      align:left
      width="32%"
      title="修改酒店资料库"
      :visible.sync="modifyVisible"
      append-to-body>
      <el-form size="small" :rules="rules" :model="modifyHotel" ref="refModifyHotel" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="modifyHotel.name" size="small" placeholder="限长50字符" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="国籍" prop="country">
          <el-input v-model="modifyHotel.country" size="small" placeholder="限长45字符" maxlength="45"></el-input>
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-input v-model="modifyHotel.city" size="small" placeholder="限长45字符" maxlength="45"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="modifyHotel.address" size="small" placeholder="限长100字符" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="房型" prop="roomType">
          <el-input v-model="modifyHotel.roomType" size="small" placeholder="如：豪华客房（限长45字符）" maxlength="45"></el-input>
        </el-form-item>
        <el-form-item prop="offerType" label="优惠类型：">
             <el-select placeholder="优惠类型：" v-model="modifyHotel.offerType"  style="width:6em">
              <el-option label="请选择优惠类型" value=''></el-option>
              <el-option label="免费住宿" :value=0></el-option>
              <el-option label="住二送一" :value=1></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="bedType" label="床型：">
             <el-select placeholder="床型：" v-model="modifyHotel.bedType"  style="width:6em">
              <el-option label="请选择床型" value=''></el-option>
              <el-option label="大床" :value=0></el-option>
              <el-option label="双床" :value=1></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="mealType" label="餐型：">
             <el-select placeholder="餐型：" v-model="modifyHotel.mealType"  style="width:6em">
              <el-option label="请选择餐型" value=''></el-option>
              <el-option label="无早" :value=0></el-option>
              <el-option label="单早" :value=1></el-option>
              <el-option label="双早" :value=2></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="status" label="状态：">
            <el-switch
              v-model="modifyHotel.status"
              active-text="有效"
              inactive-text="无效"
              active-color="#67C23A"
              :active-value=0
              :inactive-value=1
            ></el-switch>
          </el-form-item>
      </el-form>
        <div slot="footer" style="text-align: right;">
          <el-button size="small" type="primary" @click="modify('refModifyHotel')">确定</el-button>
          <el-button size="small" @click="findHotelById(modifyId);">重置</el-button>
          <el-button size="small" type="primary" plain @click="modifyVisible = false">取消</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import { findAll, batchUpdateStatus, updateStatus, findOne, update, save } from '@/api/hotel_manage'
export default {
  name: 'product_management',
  data() {
    return {
      visibleClass: '',
      formContainerOpen: '1',
      formContainer: this.$store.state.app.formContainer,
      rules: {
        name: [
          { required: true, message: '姓名不能为空', trigger: 'change' }
        ],
        address: [
          { required: true, message: '地址不能为空', trigger: 'change' }
        ],
        bedType: [
          { required: true, message: '床型不能为空', trigger: 'change' }
        ],
        city: [
          { required: true, message: '城市不能为空', trigger: 'change' }
        ],
        country: [
          { required: true, message: '国家不能为空', trigger: 'change' }
        ],
        mealType: [
          { required: true, message: '餐型不能为空', trigger: 'change' }
        ],
        offerType: [
          { required: true, message: '优惠类型不能为空', trigger: 'change' }
        ],
        roomType: [
          { required: true, message: '房型类型不能为空', trigger: 'change' }
        ]
      },
      modifyVisible: false,
      addVisible: false,
      updateStatusVisible: false,
      batchInvalidVisible: false,
      batchValidVisible: false,
      pageShow: true,
      modifyId: null,
      selectIds: [],
      modifyHotel: {},
      req: {
        name: '',
        offerType: '',
        mealType: '',
        bedType: '',
        status: '',
        pageNo: 1,
        pageSize: 10
      },
      tableData: [],
      pageInfo: {},
      addHotel: {
        name: '',
        country: '',
        city: '',
        address: '',
        offerType: '',
        roomType: '',
        bedType: '',
        mealType: '',
        status: 0
      }
    }
  },
  mounted() {
    this.formContainer()
    this.handleChangeAcitve()
    this.queryList()
  },
  methods: {

    handleChangeAcitve(active = ['1']) {
      if (active.length) {
        $('.form-more').text('收起')
      } else {
        $('.form-more').text('更多')
      }
    },
    moreOperating(val) {
      if (val === '1') {
        this.batchValidVisible = true
      }
      if (val === '2') {
        this.batchInvalidVisible = true
      }
    },
    queryList() {
      findAll(this.req).then(response => {
        if (response.data.code === 0) {
          this.tableData = response.data.data
          if (response.data.pageInfo) {
            this.pageInfo = response.data.pageInfo
            this.pageShow = true
          } else {
            this.pageShow = false
          }
        } else {
          this.tableData = response.data.data
          this.pageShow = false
        }
      }).catch(error => {
        console.log(error)
      })
    },

    add(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          save(this.addHotel).then(response => {
            const code = response.data.code
            if (code === 0) {
              this.addVisible = false
              this.$message.success(response.data.message)
              this.req.pageNo = 1
              this.queryList(this.req)
            } else {
              this.$message.error(response.data.message)
            }
          })
        } else {
          this.$message.error('请检查是否填写正确')
        }
      })
    },
    modify(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          update(this.modifyHotel).then(response => {
            const code = response.data.code
            if (code === 0) {
              this.modifyVisible = false
              this.req.pageNo = 1
              this.queryList(this.req)
              this.$message.success(response.data.message)
            } else {
              this.$message.error(response.data.message)
            }
          })
        } else {
          this.$message.error('请检查是否填写正确')
        }
      })
    },
    updateStatus(id, status) {
      updateStatus(id, status).then(response => {
        const code = response.data.code
        if (code === 0) {
          this.req.pageNo = 1
          this.queryList(this.req)
          this.$message.success(response.data.message)
        } else {
          this.$message.error(response.data.message)
        }
      })
    },
    batchUpdateStatus(param) {
      if (this.selectIds.length <= 0) {
        return this.$message.error('请选择内容！')
      }
      var obj = { 'ids': this.selectIds, 'status': param }
      batchUpdateStatus(obj).then(response => {
        const code = response.data.code
        if (code === 0) {
          if (param === 0) {
            this.batchValidVisible = false
          }
          if (param === 1) {
            this.batchInvalidVisible = false
          }
          this.req.pageNo = 1
          this.queryList(this.req)
          this.$message.success(response.data.message)
        } else {
          this.$message.error(response.data.message)
        }
        return response.data.message
      })
    },
    findHotelById(id) {
      findOne(id).then(response => {
        const code = response.data.code
        if (code === 0) {
          this.modifyHotel = response.data.data
        }
      })
    },
    // 表格多选框
    handleSelectionChange(val) {
      this.selectIds = []
      for (var i = 0; i < val.length; i++) {
        this.selectIds.push(val[i].id)
      }
    },
    offerTypeName(param) {
      if (param === 0) {
        return '免费住宿'
      }
      if (param === 1) {
        return '住二送一'
      }
      return ''
    },
    bedTypeName(param) {
      if (param === 0) {
        return '大床'
      }
      if (param === 1) {
        return '双床'
      }
      return ''
    },
    mealTypeName(param) {
      if (param === 0) {
        return '无早'
      }
      if (param === 1) {
        return '单早'
      }
      if (param === 2) {
        return '双早'
      }
      return ''
    },
    statusName(param) {
      if (param === 0) {
        return '有效'
      }
      if (param === 1) {
        return '无效'
      }
      return ''
    },
    resetReq() {
      this.req = {
        name: '',
        offerType: '',
        mealType: '',
        bedType: '',
        status: '',
        pageNo: 1,
        pageSize: 10
      }
    },
    restAddHotel() {
      this.addHotel = {
        name: '',
        country: '',
        city: '',
        address: '',
        offerType: '',
        roomType: '',
        bedType: '',
        mealType: '',
        status: 0
      }
    },
    // 页面显示条数
    handleSizeChange(val) {
      this.req.pageNo = 1
      this.req.pageSize = val
      this.queryList()
    },
    // 分页翻页功能
    handleCurrentChange(val) {
      this.req.pageNo = val
      this.queryList(this.req)
    }
  }
}
</script>
