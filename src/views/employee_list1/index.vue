<template>
  <div class="container" style="padding:0 20px;">
    <el-row>
      <h3>当前位置:员工管理</h3>
    </el-row>
    <el-row>
      <div style="font-size:16px;">查询条件</div>
      <div style="border-bottom:2px solid #439AE6;margin:10px 0;"></div>
    </el-row>
    <el-row>
      <el-form :inline="true" class="demo-form-inline" size="small">
        <el-form-item label="员工姓名：">
          <el-input v-model="formInline.customerName"></el-input>
        </el-form-item>
        <el-form-item label="员工工号：">
          <el-input v-model="formInline.customerPhone"></el-input>
        </el-form-item>
        <el-form-item label="归属组织">
          <el-select v-model="formInline.region" placeholder="所有组织">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-form :inline="true" class="demo-form-inline" size="small">
        <el-form-item label="操作人员：">
          <el-input v-model="formInline.modifierName"></el-input>
        </el-form-item>
        <el-form-item label="操作时间：">
          <el-date-picker
              v-model="formInline.startModifierTime"
              type="datetime"
              placeholder="开始日期"
              value-format="yyyy-MM-dd hh:mm:ss"
              default-time="00:00:00">
          </el-date-picker>
          到
          <el-date-picker
              v-model="formInline.endModifierTime"
              type="datetime"
              placeholder="结束日期"
              value-format="yyyy-MM-dd hh:mm:ss"
              default-time="00:00:00">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchCustomer(req)">查询</el-button>
          <el-button type="danger">重置</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <div style="font-size:16px;">客户列表</div>
      <div style="border-bottom:2px solid #439AE6;margin:10px 0;"></div>
    </el-row>
    <el-row style="margin-bottom:1%;">
      <el-col :span="4">
        <el-button type="success" size="small"  @click="dialogFormVisible = true">新增</el-button>
        <el-button type="danger" size="small">批量删除</el-button>
      </el-col>
      <el-col :span="18">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="10"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="100"  style="text-align: right;">
        </el-pagination>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-table
          :data="tableData"
          ref="multipleTable"
          tooltip-effect="dark"
          stripe
          style="width: 94%;"
          @selection-change="handleSelectionChange">
          <el-table-column
            align="center"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            align="center"
            type="index"
            label="序号">
          </el-table-column>
          <el-table-column
            align="center"
            prop="angentId"
            label="员工工号">
          </el-table-column>
          <el-table-column
            align="center"
            prop="staffName"
            label="员工姓名">
          </el-table-column>
          <el-table-column
            align="center"
            prop="staffSex"
            label="员工性别">
          </el-table-column>
          <el-table-column
            align="center"
            prop="departName"
            label="所属组织">
          </el-table-column>
          <el-table-column
            align="center"
            prop="userPhone"
            label="联系方式">
          </el-table-column>
          <el-table-column
            align="center"
            prop="creator"
            label="操作人员">
          </el-table-column>
          <el-table-column
            align="center"
            prop="updateTime"
            label="操作时间">
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="120">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">修改</el-button>
              <el-button
                @click.native.prevent="deleteRow(scope.$index, tableData)"
                type="text"
                size="small">
                移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog title="添加员工" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="活动名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { query } from '@/api/employee_list'

export default {
  name: 'employee_list',
  data() {
    return {
      customer: {
        name: '',
        phone: ''
      },
      tableData: [],
      multipleSelection: [],
      formInline: {
        customerName: '',
        customerPhone: '',
        modifierName: '',
        startModifierTime: '',
        endModifierTime: '',
        pageNo: 1,
        region: 'shanghai'
      },
      dialogFormVisible: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '120px'
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    handleClick(row) {
      console.log(row)
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    }
  },
  created() {
    query({ from: 1 }).then(response => {
      this.tableData = response.data.data
      for (let i = 0; i <= this.tableData.length; i++) {
        if (this.tableData[i]) {
          if (this.tableData[i].sex === 1) {
            this.tableData[i].staffSex = '男'
          } else {
            this.tableData[i].staffSex = '女'
          }
        }
      }
    })
    // queryDepts().then(response => {
    // })
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
