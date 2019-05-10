<template>
  <div>
    <div class="filter-container">
      <el-collapse v-model="formContainerOpen" class="form-container" @change="handleChangeAcitve" style="position:relative;">
        <span class="form-more bold" style="line-height: 24px;font-size: 14px;float:right;margin-right:6px;color:#57AFFF;position:absolute;top:12px;right:40px;">收起</span>
        <el-collapse-item title="筛选条件" name="1">
          <el-form :inline="true" class="demo-form-inline" size="small">
            <!-- <el-form-item label="所属部门：" >
              <el-select v-model="formInline.departId" placeholder="所属部门">
                <el-option v-for="item in regionOptions" :key="item.id" :label="item.departName" :value="item.id"></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="所属部门：" >
              <el-cascader
                placeholder="请选择部门"
                v-model="formInline.departId"
                :clearable=true
                :options="regionOptions"
                change-on-select>
              </el-cascader>
            </el-form-item>
            <el-form-item label="入司时间：">
              <el-date-picker
                v-model="timeValue1"
                type="daterange"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="出生日期：">
              <el-date-picker
                v-model="timeValue2"
                type="daterange"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd">
              </el-date-picker>
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
              <el-button type="primary" @click="formInline.pageNo = 1;searchStaff(formInline)">查询</el-button>
              <el-button @click="reset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
      <el-row class="table-container">
        <el-row class="margin-bottom-20">
          <div class="font14 bold">人员结构报表</div>
        </el-row>
        <el-row>
          <el-table
            :header-row-style="headerRow"
            :data="tableData"
            ref="multipleTable"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange">
            <el-table-column
              align="center"
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              align="center"
              prop="staffNo"
              label="员工工号"
              :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
              align="center"
              prop="name"
              label="员工姓名"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
              {{scope.row.name}}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="staffSex"
              label="性别"
              width="55">
            </el-table-column>
            <el-table-column
              align="center"
              prop="depart.name"
              label="所属部门"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{ scope.row.depart?(scope.row.depart.name?scope.row.depart.name:""):"" }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="phone"
              label="联系方式"
              :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
              align="center"
              prop="birthday"
              label="出生日期"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{ scope.row.birthday }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="hiredate"
              label="入司日期"
              width="155">
            </el-table-column>
            <el-table-column
              align="center"
              prop="hiredTime"
              label="司龄（天）"
              width="155">
            </el-table-column>

          </el-table>
        </el-row>
        <el-row style="margin-top:20px;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="pagination.pageNo"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper "
            :total="pagination.totalCount" style="text-align: right">
          </el-pagination>
        </el-row>
      </el-row>
      
    </div>
  </div>
</template>

<script>
  import { getAllVisibleDepts, queryDepts, query } from '@/api/employee_list'
  import { Message } from 'element-ui'
  import { formatDateTime, formatDate, list2Tree, getChildren } from '@/utils/tools'

export default {
    name: 'staff_structure',
    data() {
      return {
        formContainerOpen: '1',
        staffData: {},
        tempRoute: {},
        timeValue: [], // 操作时间
        timeValue1: [], // 入司时间
        timeValue2: [], // 出生日期
        pagination: {
          pageSize: null,
          pageNo: null,
          totalCount: null,
          totalPage: null
        },
        customer: {
          name: '',
          phone: ''
        },
        regionOptions: [], // 所有部门
        visibleDepts: [], // 所有可见部门
        tableData: [],
        multipleSelection: [],
        formInline: {
          departId: [],
          angentId: '',
          modifierName: '',
          pageNo: 1,
          pageSize: 10,
          departName: ''
        }
  
      }
    },
    methods: {
      handleChangeAcitve(active = ['1']) {
        if (active.length) {
          $('.form-more').text('收起')
        } else {
          $('.form-more').text('更多')
        }
      },
      searchStaff(data) {
        // 根据老版本的逻辑 查询只能传分页页码的第一页
        const req = {}
        req.pageNo = 1
        req.startTime = this.timeValue ? this.timeValue[0] : null
        req.stopTime = this.timeValue ? this.timeValue[1] : null
        req.startHiredate = this.timeValue1 ? this.timeValue1[0] : null
        req.endHiredate = this.timeValue1 ? this.timeValue1[1] : null
        req.startBirthday = this.timeValue2 ? this.timeValue2[0] : null
        req.endBirthday = this.timeValue2 ? this.timeValue2[1] : null
        req.departId = data.departId[data.departId.length - 1]
        req.pageNo = data.pageNo ? data.pageNo : this.pagination.pageNo
        req.pageSize = data.pageSize ? data.pageSize : this.pagination.pageSize
        query(req).then(response => {
          this.tableData = []
          this.pagination = {}
          if (response.data.code === 1) {
            this.queryStaff(response)
          }
        })
      },
      queryStaff(res) {
        this.tableData = res.data.data
        this.pagination = res.data.pageInfo
        if (this.tableData.length !== 0) {
          for (let i = 0; i <= this.tableData.length; i++) {
            if (this.tableData[i]) {
              this.tableData[i].hiredTime = this.tableData[i].hiredate ? Math.floor((new Date(new Date().setHours(23, 59, 59, 0)).getTime() - (new Date(new Date(this.tableData[i].hiredate).setHours(0, 0, 0, 0)).getTime())) / (1000 * 60 * 60 * 24) + 1) : ''
              this.tableData[i].updateTime = formatDateTime(this.tableData[i].updateTime)
              this.tableData[i].hiredate = formatDate(this.tableData[i].hiredate)
              if (this.tableData[i].sex === 1) {
                this.tableData[i].staffSex = '男'
              } else {
                this.tableData[i].staffSex = '女'
              }
            }
          }
        } else {
          Message({
            message: '无查询结果，请核对查询条件',
            type: 'error',
            duration: 3 * 1000
          })
        }
      },
      reset() {
        this.timeValue = []
        this.timeValue1 = []
        this.timeValue2 = []
        this.formInline = {
          departId: [],
          angentId: '',
          modifierName: '',
          startTime: '',
          stopTime: '',
          departName: '',
          pageNo: this.pagination.pageNo,
          pageSize: this.pagination.pageSize
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
        console.log(val)
      },

      handleSizeChange(val) {
        this.pagination.pageNo = 1
        this.formInline.pageNo = 1
        this.formInline.pageSize = val
        this.searchStaff(this.formInline)
      },
      handleCurrentChange(val) {
        this.formInline.pageNo = val
        // 操作时间
        this.formInline.startTime = this.timeValue ? this.timeValue[0] : null
        this.formInline.stopTime = this.timeValue ? this.timeValue[1] : null
        // 入司时间
        this.formInline.startHiredate = this.timeValue1 ? this.timeValue1[0] : null
        this.formInline.endHiredate = this.timeValue1 ? this.timeValue1[1] : null
        // 出生日期
        this.formInline.startBirthday = this.timeValue2 ? this.timeValue2[0] : null
        this.formInline.endBirthday = this.timeValue2 ? this.timeValue2[1] : null
        this.searchStaff(this.formInline)
      },
      headerRow({ row, rowIndex }) {
        if (rowIndex === 0) {
          return 'color:black'
        } else {
          return ''
        }
      }

    },
    created() {
      if (this.$route.params.id !== ':id') {
        query({ departName: sessionStorage.getItem(this.$route.params.id) }).then(response => {
          this.formInline.departName = sessionStorage.getItem(this.$route.params.id)
          this.pagination = response.data.pageInfo
        })
      } else {
        query({ pageNo: 1 }).then(response => {
  
        })
      }
      queryDepts().then(response => {
        const arr = []
        if (response.data.code === 1 && response.data.data.length > 0) {
          const tempTree = list2Tree({
            data: response.data.data,
            rootId: 0,
            parentIdFielName: 'upId'
          })
          for (let i = 0; i < tempTree.length; i++) {
            const obj = getChildren(tempTree[i], 'id', 'name')
            arr.push(obj)
          }
          this.regionOptions = arr
        }
      })
      getAllVisibleDepts().then(response1 => {
        this.visibleDepts = response1.data.data
      })
    },
    mounted() {
      this.handleChangeAcitve()
      this.searchStaff(this.formInline)
    }
  
  }
</script>
<!--<style>-->
  <!--.el-table{-->
    <!--width: 100% !important;-->
  <!--}-->
<!--</style>-->
