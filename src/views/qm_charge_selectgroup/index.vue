<template>
  <div class='container'>
    <el-row>
      <el-form :inline="true" size="small">
        <el-form-item label="活动名称:">
          <el-input v-model="req.campaignName" placeholder="活动名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="req.pageNo=1;searchByCampaign(req)">筛选</el-button>
          <el-button  type="danger" @click="req.campaignName=''">重置</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <el-row>
      <el-col>
        <el-table :data="tableData" border>
          <el-table-column align="center" label="序号" width="55">
            <template slot-scope="scope">
              <div>{{scope.$index+(req.pageNo-1)*req.pageSize+1}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="活动编号" prop="campaignId">
          </el-table-column>
          <el-table-column align="center" label="活动名称" prop="activityName">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="right">
                <p>{{ scope.row.activityName }}</p>
                <div slot="reference">
                  {{ scope.row.activityName }}
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column align="center" label="质检组织">
            <template slot-scope="scope">
              <div>{{showQmDepart(scope.row.departName)}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="评分表">
            <template slot-scope="scope">
              <div>{{showGradenames(scope.row.gradeNames)}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="名单有效期">
            <template slot-scope="scope">
              <div>{{scope.row.listExpiryDate}}天</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="活动备注" prop="description">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="right">
                <p>{{ scope.row.description }}</p>
                <div slot="reference">
                  {{ scope.row.description }}
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="qcdept='';grade=[];assignParams.activityId=scope.row.campaignId;assignParams.activityName=scope.row.activityName;searchByCampaignId(scope.row.campaignId);searchQcDepts(scope.row.campaignId);searchGrades(scope.row.campaignId);"  v-if="scope.row.departName === null && scope.row.gradeNames === null">指定</el-button>
              <el-button type="text" @click="assignParams.activityId=scope.row.campaignId;assignParams.activityName=scope.row.activityName;searchByCampaignId(scope.row.campaignId);searchQcDepts(scope.row.campaignId);searchGrades(scope.row.campaignId);showQcDeptByCampaignId(scope.row.campaignId);showGradeNamesByCampaignId(scope.row.campaignId)"  v-if="scope.row.departName !== null || scope.row.gradeNames !== null">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 分页信息 -->
    <el-row style="margin-top:5px;">
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

    <!-- 指定质检组织、评分表的dialog  -->
    <el-dialog
    align:left
    width="30%"
    title="指定质检组织/评分表"
    :visible.sync="appointVisiable"
    append-to-body>
      <el-form label-width="100px">
        <el-form-item label="活动名称：">
          <div>{{campaignDetail.campaignName}}</div>
        </el-form-item>
        <el-form-item label="名单有效期：">
          <div>{{campaignDetail.listExpiryDate}}天</div>
        </el-form-item>
        <el-form-item label="活动状态：">
            <div v-html="showStatus(campaignDetail.status)"></div>
        </el-form-item>
        <el-form-item label="活动组织：">
          <div>{{campaignDetail.departName}}</div>
        </el-form-item>
        <el-form-item label="话后小结：">
          <div>{{campaignDetail.summaryName}}</div>
        </el-form-item>
        <el-form-item label="质检组织：">
          <el-select v-model="qcdept" placeholder="请选择质检组织" clearable @change="selectQcDept">
              <el-option
                v-for="qcdepart in qcdepts"
                :label="qcdepart.departName"
                :value="qcdepart.id">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="评分表：">
          <el-select v-model="grade" multiple placeholder="请选择评分表" clearable @change="selectMarks">
            <el-option
            v-for="item in grades"
            :key="item.gradeId"
            :label="item.gradeName"
            :value="item.gradeId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动备注：">
          <div>{{campaignDetail.description}}</div>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center;">
        <el-button @click="completeAssign();" type="success">确定</el-button>
        <el-button @click="appointVisiable = false">返回</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang='scss' scoped>
</style>

<script>
import {
  queryByCampaign,
  queryByCampaignId,
  queryDeptById,
  queryNodulesById,
  queryallQcdepts,
  quertyAllMarks,
  queryQcDeptByCampaignId,
  queryGradeNamesByCampaignId,
  completeAssignGroupsAndGrades
} from '@/api/qm_charge_selectgroup'
export default {
  name: 'qm_charge_selectgroup',

  data() {
    return {
      tableData: [], // 表格数据
      pageShow: false, // 分页显示与否
      pageInfo: {}, // 分页信息
      appointVisiable: false, // 指定组织/评分表的dialog
      qcdepts: [], // 下属所有质检组织
      grades: [], // 所有的评分表
      qcdept: '', // 选中的或回显的质检组织
      qcdeptId: '', // 选中的或回显的质检组织id
      grade: [], //  选中的或回显的评分表
      gradeIds: [], // 选中的或回显的评分表id
      req: {
        campaignName: '',
        pageSize: 10,
        pageNo: 1
      },
      // 活动详情信息
      campaignDetail: {
        departName: '',
        summaryName: ''
      },

      // 需要指定或修改的参数
      assignParams: {
        qcdeptId: '',
        qcdeptName: '',
        grades: [],
        activityId: '',
        activityName: ''
      }

    }
  },

  methods: {
    // 质检组织显示
    showQmDepart(departName) {
      if (departName) {
        return departName
      } else {
        return '未指定'
      }
    },
    // 评分表显示
    showGradenames(gradeNames) {
      if (gradeNames !== null && gradeNames.length > 0) {
        var name = ''
        for (var i = 0; i < gradeNames.length; i++) {
          name += gradeNames[i] + '/'
        }
        name = name.substr(0, (name.length - 1))
        return name
      } else {
        return '未指定'
      }
    },
    // 展示活动名称
    showDept() {
      var deptName = localStorage.getItem('departName')
      localStorage.removeItem('departName')
      return deptName
    },
    // 展示小结名称
    showNodules() {
      var summaryName = localStorage.getItem('summaryName')
      localStorage.removeItem('summaryName')
      return summaryName
    },
    // 综合查询
    searchByCampaign(req) {
      queryByCampaign(req)
        .then(response => {
          if (response.data.code === 0) {
            this.tableData = response.data.data
            this.pageShow = true
            this.pageInfo = response.data.pageInfo
          } else {
            this.tableData = response.data.data
            this.pageShow = false
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 根据活动id查找活动
    searchByCampaignId(campaignId) {
      queryByCampaignId(campaignId)
        .then(response => {
          if (response.data.code === 0) {
            this.campaignDetail = response.data.data
            var summaryId = response.data.data.summaryId
            // 通过部门id显示部门
            queryDeptById(response.data.data.departId)
              .then(response => {
                if (response.data.code === 1) {
                  console.log(response.data.data.departName)
                  this.campaignDetail.departName = response.data.data.departName
                  // 通过小结id显示小结名称
                  queryNodulesById(summaryId)
                    .then(response => {
                      if (response.data.code === 0) {
                        console.log(response.data.data.summaryName)
                        this.campaignDetail.summaryName = response.data.data.summaryName
                        console.log(this.campaignDetail)
                        this.appointVisiable = true
                      }
                    })
                }
              })
          } else {
            this.$message.error = response.data.message
          }
        })
    },
    // 查询下属质检组织
    searchQcDepts(campaignId) {
      queryallQcdepts()
        .then(response => {
          if (response.data.code === 1) {
            this.qcdepts = response.data.data
          }
        })
    },
    // 根据活动id查询评分表
    searchGrades(campaignId) {
      quertyAllMarks()
        .then(response => {
          if (response.data.code === 0) {
            this.grades = response.data.data
          }
        })
    },
    // showDialog() {
    //   if (this.campaignDetail.summaryName && this.campaignDetail.departName) {
    //     this.appointVisiable = true
    //   } else {
    //     this.appointVisiable = false
    //   }
    // },
    // 显示活动状态
    showStatus(status) {
      if (status === '0') {
        return "<span style='color:green'>有效</span>"
      } else {
        return "<span style='color:red'>无效</span>"
      }
    },
    // 页面显示条数
    handleSizeChange(val) {
      this.req.pageNo = 1
      this.req.pageSize = val
      this.pageInfo.pageNo = 1
      this.searchByCampaign(this.req)
    },
    // 翻页功能
    handleCurrentChange(val) {
      this.req.pageNo = val
      this.searchByCampaign(this.req)
    },
    // 根据活动id显示当前活动的质检组织
    showQcDeptByCampaignId(campaignId) {
      queryQcDeptByCampaignId(campaignId)
        .then(response => {
          if (response.data.code === 0) {
            this.qcdept = response.data.data[0].departName
            this.qcdeptId = response.data.data[0].departId
            // this.assignParams.qcdeptId = response.data.data[0].departId
            // this.assignParams.qcdeptName = response.data.data[0].departName
            // this.assignParams.activityId = response.data.data[0].activityId
            // this.assignParams.activityName = response.data.data[0].activityName
          }
        })
    },
    // 根据活动id显示当前活动采用的评分表
    showGradeNamesByCampaignId(campaignId) {
      this.grade = []
      this.gradeIds = []
      queryGradeNamesByCampaignId(campaignId)
        .then(response => {
          if (response.data.code === 0 && response.data.data.length > 0) {
            for (var i = 0; i < response.data.data.length; i++) {
              this.grade.push(response.data.data[i].gradeId)
              this.gradeIds.push(response.data.data[i].gradeId)
            }
          }
        })
    },
    // 将选择的质检组织id和名称传参
    selectQcDept(value) {
      this.qcdeptId = value
      let obj = {}
      obj = this.qcdepts.find((qcdepart) => {
        return qcdepart.id === value
      })
      if (obj) {
        this.qcdept = obj.departName
      } else {
        this.qcdept = ''
      }
    },
    //
    selectMarks(value) {
      this.gradeIds = []
      this.gradeIds = this.grade
    },
    // 完成指定或修改
    completeAssign() {
      this.assignParams.qcdeptId = this.qcdeptId
      this.assignParams.qcdeptName = this.qcdept
      this.assignParams.grades = []
      this.assignParams.grades = this.gradeIds
      // console.log(this.assignParams.qcdeptId + ',' + this.assignParams.qcdeptName + ',' + this.assignParams.grades + ',' + this.assignParams.activityId + ',' + this.assignParams.activityName)
      if (this.assignParams.grades.length === 0) {
        this.$message.error('未选中任何评分表！')
        return false
      }
      if (this.assignParams.qcdeptName === '') {
        this.$message.error('未指定质检组织！')
        return false
      }
      completeAssignGroupsAndGrades(this.assignParams)
        .then(response => {
          if (response.data.code === 0) {
            this.$message.success = response.data.message
            this.appointVisiable = false
            this.searchByCampaign(this.req)
          } else {
            this.$message.error = response.data.message
          }
        })
    }
  },

  mounted() {
    this.searchByCampaign(this.req)
  },

  watch: {},

  components: {},

  mixins: [],

  vuex: {},

  created() {}

}

</script>
