<template>
  <div class="container">
    <el-collapse v-model="formContainerOpen" class="form-container" @change="handleChangeAcitve">
      <el-collapse-item title="筛选条件" name="1">
        <el-form :inline="true" size="small">
          <el-form-item label="组织">
            <el-cascader
              v-model="selected_dept_id"
              placeholder="请选择组织"
              :options="org_options"
              :props="org_props"
              show-all-levels
              filterable
              size="small"
              @change="showStaffs"
              change-on-select
            ></el-cascader>
          </el-form-item>
          <el-form-item label="坐席">
            <el-select v-model="req.staffId">
              <el-option label="所有坐席" :value="s_staffIds" v-if="hasAgent"></el-option>
              <el-option label="无" value="" v-if="!hasAgent"></el-option>
              <el-option
                v-for="item in s_staffs"
                :key="item[1]"
                :label="item[2]+' ('+item[1]+')'"
                :value="item[1]"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户姓名">
            <el-input v-model="req.customerName" placeholder="客户姓名（限长50字符）" maxlength="50" clearable></el-input>
          </el-form-item>
          <el-form-item label="客户电话">
              <el-input v-model="req.customerPhone" placeholder="客户电话（限长50字符）" maxlength="50" clearable></el-input>
          </el-form-item>
          <!-- <el-form-item label="话后小结">
            <el-select v-model="req.summaryId">
              <el-option
                v-for="item in summariesInfo"
                :key="item.id"
                :value="item.id"
                :label="item.name">
              </el-option>
            </el-select>
          </el-form-item> -->
          <br/>
          <el-form-item label="拨打次数">
            <el-input v-model="req.contactedNum" maxlength="4" min="0" type="number"></el-input>
          </el-form-item>
          <el-form-item label="分配时间">
            <el-date-picker
                v-model="req.distributeTimeStart"
                type="datetime"
                placeholder="开始时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                default-time="00:00:00">
            </el-date-picker>
            到
            <el-date-picker
                v-model="req.distributeTimeEnd"
                type="datetime"
                placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                default-time="00:00:00">
            </el-date-picker>
          </el-form-item>&nbsp;&nbsp;
          <el-form-item label="上次拨打时间">
            <el-date-picker
                v-model="req.lastContactTimeStart"
                type="datetime"
                placeholder="开始时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                default-time="00:00:00">
            </el-date-picker>
            到
            <el-date-picker
                v-model="req.lastContactTimeEnd"
                type="datetime"
                placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                default-time="00:00:00">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="req.pageNo=1;searchByKeyWords(req)">查询</el-button>
              <el-button @click="clearForm(req)">重置</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>

    <el-row class="table-container">
      <el-row class="margin-bottom-20">
        <div class="font14 bold">名单恢复表</div>
      </el-row>
      <el-row class="margin-bottom-20">
        <el-button type="primary" @click="checkTransferNum(contactTaskIds);transfer_dept_id=[]">恢复</el-button>
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
            label="客户姓名"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{scope.row.customerName}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="客户电话"
            :show-overflow-tooltip="true">
            <template
              slot-scope="scope">
              {{hideMobile(scope.row.customerPhone)}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="地区"
            prop="customerAddress"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            align="center"
            label="所属坐席"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{showStaffName(scope.row.staffId)}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="任务状态">
            <template
              slot-scope="scope">
              <div>{{getTaskStatus(scope.row.status)}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="拨打次数"
            prop="contactedNum">
          </el-table-column>
          <el-table-column
            align="center"
            label="话后小结">
            <template
              slot-scope="scope">
              <div>{{getSummariesDetail(scope.row.summaries)}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="distributeTime"
            label="分配时间"
            width="155">
          </el-table-column>
          <el-table-column
            align="center"
            label="预约时间"
            width="155">
            <template
              slot-scope="scope">
              <div>{{hasAppointTime(scope.row.appointTime)}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="上次拨打时间"
            width="155">
            <template slot-scope="scope">
              <div>{{hasLastContactTime(scope.row.lastContactTime)}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="description"
            label="描述">
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
    

    <!-- 选择转移的坐席dialog -->
    <el-dialog width="30%" title="操作提示" :visible.sync="transferVisible" append-to-body>
      <el-form size="small">
        <el-form-item label="转移的组织：">
          <el-cascader
            style="width:100%;"
            v-model="transfer_dept_id"
            placeholder="请选择组织"
            :options="org_options"
            :props="org_props"
            show-all-levels
            filterable
            size="small"
            @change="showStaffs1"
            change-on-select
          ></el-cascader>
        </el-form-item>
        <el-form-item label="转移的坐席：">
          <el-select style="width:100%;" v-model="transferToAgentId" clearable >
            <el-option
              v-for="item in s_staffs1"
              :key="item[1]"
              :label="item[2]+' ('+item[1]+')'"
              :value="item[1]"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button type="primary" @click="checkTransfer(contactTaskIds,transferToAgentId)">确定</el-button>
        <el-button type="primary" plain @click="transferVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang='scss' scoped>
</style>

<script>
import {
  getAgentsByDeptId,
  recoverAndTransfer
} from '@/api/dialtask_recover'
import { getAllDeptsByCurrent, getAllAgentsRecursion } from '@/utils/tools'
import {
  queryByKeywords,
  findCampaignByUser,
  getSummariesByAgentId
} from '@/api/dialTask' // 接口
var vm = this
export default {
  name: 'dialtask_recover',

  data() {
    return {
      formContainerOpen: '1',
      formContainer: this.$store.state.app.formContainer,
      org_options: [], // 用以展示级联的组织
      selected_dept_id: [], // 级联选中的组织id
      transfer_dept_id: [], // 用以dialog中级联选中的组织id
      org_props: {
        label: 'departName',
        value: 'id',
        children: 'subDeparts'
      },
      transferVisible: false,
      transferToAgentId: '',
      pageShow: true, // 是否显示分页
      pageInfo: {}, // 分页信息
      tableData: [],
      req: {
        staffId: '',
        customerName: '',
        customerPhone: '',
        status: '3', // 失败的情况
        summaryId: '',
        contactedNum: '',
        distributeTimeStart: '',
        distributeTimeEnd: '',
        lastContactTimeStart: '',
        lastContactTimeEnd: '',
        pageNo: 1,
        pageSize: 10

      },
      allAgentIds: '', // 当前部门关联的所有坐席的id
      all_staffs: [], // 当前部门关联的所有坐席
      s_staffIds: '', // 选中的部门的所有坐席id
      staffs: [], // 当前选中的部门的所有员工
      s_staffs: [], // 当前选中的部门的所有坐席
      s_staffs1: [], //
      hasAgent: false, // 是否有坐席
      contactTaskIds: [],
      campaignsInfo: [], // 活动下拉选择
      summariesInfo: [] // 小结下拉选择

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
    // 综合查询
    searchByKeyWords(req) {
      if (this.selected_dept_id.length === 0) {
        req.staffId = this.allAgentIds
      }
      queryByKeywords(req)
        .then(response => {
          if (response.data.code === 0) {
            if (response.data.data) {
              this.tableData = response.data.data
              this.pageInfo = response.data.pageInfo
              this.pageShow = true
            } else {
              this.$message = '无查询结果，请核对查询条件'
              this.tableData = response.data.data
              this.pageShow = false
            }
            if (req.staffId === this.allAgentIds && this.selected_dept_id.length === 0) {
              this.req.staffId = ''
            }
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    showStaffs(value) {
      const departId = value[value.length - 1]
      getAgentsByDeptId(departId)
        .then(res => {
          if (res.data.code === 0) {
            this.s_staffIds = ''
            this.hasAgent = true
            this.s_staffs = res.data.data
            for (var i = 0; i < this.s_staffs.length; i++) {
              this.s_staffIds += this.s_staffs[i][1] + ','
            }
            this.req.staffId = this.s_staffIds
          } else {
            this.hasAgent = false
            this.s_staffs.length = 0
            this.s_staffIds = ''
            this.req.staffId = ''
            console.log(res.data.message)
          }
        })
    },
    showStaffs1(value) {
      const departId = value[value.length - 1]
      getAgentsByDeptId(departId)
        .then(res => {
          if (res.data.code === 0) {
            this.s_staffs1 = res.data.data
          } else {
            this.s_staffs1.length = 0
            this.s_staffs1 = []
            this.transferToAgentId = ''
          }
        })
    },
    // 判断是否选中
    checkTransferNum(contactTaskIds) {
      if (contactTaskIds.length === 0) {
        this.$message.error('未选中任何数据！')
        return
      }
      this.transferToAgentId = ''
      this.transferVisible = true
    },
    // 恢复并且转移的方法
    checkTransfer(taskIds, transferTo) {
      if (transferTo === '' || transferTo === null) {
        this.$message.error('请选择转移的坐席！')
        return
      }
      const paramsMap = {
        contactTaskIds: taskIds,
        transferToAgentId: transferTo
      }
      // 执行恢复并且转移
      recoverAndTransfer(paramsMap)
        .then(response => {
          if (response.data && response.data.code === 0) {
            this.$message.success(response.data.message)
            this.req.pageNo = 1
            this.searchByKeyWords(this.req)
            this.transferVisible = false
          } else {
            this.$message.error(response.data.message)
          }
        })
        .catch(error => {
          console.error(error)
        })
    },
    // 清空重置
    clearForm(obj, formName) {
      this.req.distributeTimeStart = ''
      this.req.distributeTimeEnd = ''
      this.req.lastContactTimeStart = ''
      this.req.lastContactTimeEnd = ''
      this.req.customerName = ''
      this.req.customerPhone = ''
      this.req.pageNo = this.pageInfo.pageNo
      this.req.pageSize = this.pageInfo.pageSize
      this.req.status = '3'
      this.req.contactedNum = ''
      this.req.summaryId = ''
      this.selected_dept_id = []
      this.hasAgent = false
      this.s_staffIds = this.allAgentIds
      this.req.staffId = this.s_staffIds
      this.s_staffs.length = 0
    },
    handle(obj) {
      for (let i = 0; i < obj.length; i++) {
        if (obj[i].summaryDetailInfos === null) {
          var nodeObj = {}
          nodeObj.id = obj[i].id
          nodeObj.name = obj[i].name
          vm.summariesInfo.push(nodeObj)
        } else {
          vm.handle(obj[i].summaryDetailInfos)
        }
      }
    },
    // 表格多选框
    handleSelectionChange(val) {
      this.contactTaskIds.length = 0
      for (var i = 0; i < val.length; i++) {
        this.contactTaskIds.push(val[i].taskId)
      }
    },
    // 隐藏手机号
    hideMobile(mobile) {
      if (mobile) {
        return mobile.substring(0, 3) + '****' + mobile.substring(7, 11)
      }
    },
    // 显示活动名称
    showCampaign(info) {
      for (let i = 0; i < vm.campaignsInfo.length; i++) {
        if (vm.campaignsInfo[i].campaignId === info) {
          return vm.campaignsInfo[i].campaignName
        }
      }
      return ''
    },
    // 任务状态
    getTaskStatus(str) {
      let status = '首拨'
      switch (str) {
        case '0':
          status = '首拨'
          break
        case '1':
          status = '预约'
          break
        case '2':
          status = '成功'
          break
        case '3':
          status = '失败'
          break
        case '4':
          status = '过期'
          break
      }
      return status
    },
    // 小结
    getSummariesDetail(obj) {
      let summaries = ''
      if (obj !== null) {
        for (let i = 0; i < obj.length; i++) {
          summaries += obj[i].name + ','
        }
        if (summaries.length > 0) {
          summaries = summaries.substring(0, summaries.length - 1)
        }
      } else {
        summaries = '无'
      }
      return summaries
    },
    // 预约时间补无
    hasAppointTime(appointTime) {
      if (appointTime) {
        return appointTime
      } else {
        return '无'
      }
    },
    // 最后联系时间补无
    hasLastContactTime(lastContactTime) {
      if (lastContactTime) {
        return lastContactTime
      } else {
        return '无'
      }
    },
    // 页面显示条数
    handleSizeChange(val) {
      this.req.pageSize = val
      this.req.pageNo = 1
      this.pageInfo.pageNo = 1
      this.searchByKeyWords(this.req)
    },
    // 分页翻页功能
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.req.pageNo = val
      this.searchByKeyWords(this.req)
    },
    // 显示坐席名称+id
    showStaffName(staffId) {
      for (var i = 0; i < this.all_staffs.length; i++) {
        if (staffId === this.all_staffs[i][1]) {
          return this.all_staffs[i][2] + ' (' + staffId + ')'
        }
      }
    }
  },

  mounted() {
    vm = this
    this.formContainer()
    this.handleChangeAcitve()
    // 获取所有部门及子部门下的坐席id用以默认查询
    getAllAgentsRecursion(localStorage.getItem('departId'))
      .then(response => {
        if (response.data) {
          if (response.data.code === 0) {
            this.all_staffs = response.data.data
            for (var i = 0; i < response.data.data.length; i++) {
              this.allAgentIds += response.data.data[i][1] + ','
            }
            this.req.staffId = this.allAgentIds
            this.searchByKeyWords(this.req)
          }
        }
      })
      .catch(error => {
        console.error(error)
      })
    // 获取所有部门及子部门用以展示级联部门
    getAllDeptsByCurrent().then(response => {
      if (response.data && response.data.code === 1) {
        this.org_options = response.data.data
      }
    })
    getSummariesByAgentId(localStorage.getItem('agentId')).then(response => {
      vm.summariesInfo = [] // 清空小结节点
      if (response.data.code === 0) {
        if (response.data && response.data.data && response.data.data.length > 0) {
          vm.summariesInfo.push({ 'id': '', 'name': '所有小结' })
          this.handle(response.data.data)
        } else {
          vm.summariesInfo.push({ 'id': '', 'name': '所有小结' })
        }
      }
    }).catch(error => {
      console.error(error)
      vm.summariesInfo.push({ 'id': '', 'name': '所有小结' })
    })

    findCampaignByUser().then(res => {
      vm.campaignsInfo = []
      if (res.data.code === 0) {
        vm.campaignsInfo.push({ campaignId: '', campaignName: '所有活动' })
        if (res.data.data.length > 0) {
          for (let i = 0; i < res.data.data.length; i++) { // 返回值活动数组
            let flag = false// 初始化变量值为否
            for (let j = 0; j < vm.campaignsInfo.length; j++) { // 活动列表数组
              if (res.data.data[i].campaignId === vm.campaignsInfo[j].campaignId) { // 如果活动列表已经存在了返回值的数组id
                flag = true
                break
              }
            }
            if (!flag) { // 如果活动不存在，那么增加活动
              vm.campaignsInfo.push({
                campaignId: res.data.data[i].campaignId,
                campaignName: res.data.data[i].campaignName
              })
            }
          }
        }
      } else {
        vm.campaignsInfo.push({ campaignId: '', campaignName: '所有活动' })
      }
    })
  }

}

</script>
