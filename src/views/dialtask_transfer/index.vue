<template>
  <div class="container">
    <el-row margin-top:>
      <el-form :inline="true" size="small">
        <el-form-item label="坐席">
          <el-select v-model="req.staffId" clearable>
            <el-option label="所有坐席" :value="s_staffIds"></el-option>
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
        <el-form-item label="客户电话：">
            <el-input v-model="req.customerPhone" placeholder="客户电话（限长50字符）" maxlength="50" clearable></el-input>
        </el-form-item>
        <el-form-item label="任务状态：">
          <el-select v-model="req.status" placeholder="请选择">
            <el-option
              v-for="item in taskStatusOptions"
              :key="item.value"
              :value="item.value"
              :label="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="话后小结：">
          <el-select v-model="req.summaryId">
            <el-option
              v-for="item in summariesInfo"
              :key="item.id"
              :value="item.id"
              :label="item.name">
            </el-option>
          </el-select>
        </el-form-item><br/>
        <el-form-item label="拨打次数">
          <el-input v-model="req.contactedNum" maxlength="4" min="0" type="number"></el-input>
        </el-form-item>
        <el-form-item label="分配时间：">
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
        <el-form-item label="上次拨打时间：">
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
            <el-button type="danger" @click="clearForm(req)">重置</el-button>
        </el-form-item>
      </el-form>
    </el-row>

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
            label="所属活动"
            :show-overflow-tooltip="true">
            <template
              slot-scope="scope">
              {{showCampaign(scope.row.campaignId)}}
            </template>
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
          <!-- <el-table-column
            align="center"
            label="操作时间"
            width="155">
            <template slot-scope="scope">
              <div>{{hasLastContactTime(scope.row.modifyTime)}}</div>
            </template>
          </el-table-column> -->
          <el-table-column
            align="center"
            prop="description"
            label="描述">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row style="margin-top:5px;">
      <el-form :inline="true" size="small">
        <el-form-item>
          <el-button type="primary" @click="checkTransferNum(contactTaskIds);">转移</el-button>
        </el-form-item>
      </el-form>
        <el-pagination
          v-if="pageShow"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page='pageInfo.pageNo'
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size='pageInfo.pageSize'
          layout="total, sizes, prev, pager, next, jumper "
          :total='pageInfo.totalCount' style="text-align: right;float:right;">
        </el-pagination>
    </el-row>

    <!-- 选择转移的坐席dialog -->
    <el-dialog width="30%" title="操作提示" :visible.sync="transferVisible" append-to-body>
      <el-form>
        <el-form-item label="转移的坐席：">
          <el-select v-model="transferToAgentId" clearable>
            <el-option
              v-for="item in s_staffs"
              :key="item[1]"
              :label="item[2]+' ('+item[1]+')'"
              :value="item[1]"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button type="primary" @click="transferVisible = false;checkTransfer(contactTaskIds,transferToAgentId)">确定</el-button>
        <el-button @click="transferVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang='scss' scoped>
</style>

<script>
  import {
    getAllStaffs,
    filter_split_agents,
    transferContactTasks
  } from '@/api/dialtask_transfer'
  import {
    queryByKeywords,
    findCampaignByUser,
    getSummariesByAgentId
} from '@/api/dialTask' // 接口
var vm = null
  export default {
    name: 'dialtask_transfer',

    data() {
      return {
        transferToAgentId: '',
        transferVisible: false,
        pageShow: true, // 是否显示分页
        pageInfo: {}, // 分页信息
        tableData: [],
        contactTaskIds: [],
        allStaffIds: '', // 所有员工id
        s_staffIds: '', // 所有坐席id
        req: {
          staffId: '',
          customerName: '',
          customerPhone: '',
          status: '0',
          summaryId: '',
          contactedNum: '',
          distributeTimeStart: '',
          distributeTimeEnd: '',
          lastContactTimeStart: '',
          lastContactTimeEnd: '',
          pageNo: 1,
          pageSize: 10

        },
        staffs: [], // 当前主管下的所有员工
        s_staffs: [], // 当前主管下的所有坐席
        taskStatusOptions: [
          {
            value: '0',
            label: '首拨'
          },
          {
            value: '1',
            label: '预约'
          }
        ],
        campaignsInfo: [], // 活动下拉选择
        summariesInfo: [] // 小结下拉选择

      }
    },

    methods: {
      // 判断是否选中
      checkTransferNum(contactTaskIds) {
        if (contactTaskIds.length === 0) {
          this.$message.error('未选中任何数据！')
          return
        }
        this.transferToAgentId = ''
        this.transferVisible = true
      },
      // 获取当前主管下的坐席人员
      getAllStaffs() {
        getAllStaffs()
          .then(res => {
            if (res.data.code === 1) {
              var colName = res.data.data
              var json = []
              colName.forEach(function(item) {
                var temp = {}
                item.forEach(function(value, index) {
                  temp[index] = value
                })
                json.push(temp)
              })
              this.staffs = json
              for (var i = 0; i < this.staffs.length; i++) {
                this.allStaffIds += this.staffs[i][1] + ','
              }
              filter_split_agents(this.allStaffIds)
                .then(response => {
                  if (response.data.result) {
                    const r2 = response.data.result.R2 // 所有的坐席
                    for (var j = 0; j < r2.length; j++) {
                      this.s_staffIds += r2[j] + ',' // 所有的坐席id
                      for (var k = 0; k < this.staffs.length; k++) {
                        if (r2[j] === this.staffs[k][1]) {
                          this.s_staffs.push(this.staffs[k])
                        }
                      }
                    }
                    this.req.staffId = this.s_staffIds
                    this.searchByKeyWords(this.req)
                  }
                })
            } else {
              this.$message.error('获取坐席信息失败')
            }
          })
          .catch(error => {
            console.error(error)
          })
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
        this.req.status = '0'
        this.req.contactedNum = ''
        this.req.summaryId = ''
        this.req.staffId = this.s_staffIds
      },
      // 确认转移
      checkTransfer(contactTaskIds, transferToAgentId) {
        const paramsMap = {
          contactTaskIds: contactTaskIds,
          transferToAgentId: transferToAgentId
        }
        transferContactTasks(paramsMap)
          .then(response => {
            if (response.data.code === 0) {
              this.$message.success('操作成功！')
              this.searchByKeyWords(this.req)
              this.transferVisible = false
            } else {
              this.$message.error('操作失败')
            }
          })
          .catch(error => {
            console.error(error)
          })
      },
      // 综合查询
      searchByKeyWords(req) {
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
            }
          })
          .catch(error => {
            console.log(error)
          })
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
      // 显示坐席名称+id
      showStaffName(staffId) {
        for (var i = 0; i < this.s_staffs.length; i++) {
          if (staffId === this.s_staffs[i][1]) {
            return this.s_staffs[i][2] + ' (' + staffId + ')'
          }
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
      }
  
    },

    mounted() {
      vm = this
      // 查询当前主管下的坐席人员(包括自己)
      this.getAllStaffs()
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
