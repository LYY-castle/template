<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row class="form-container" style="padding:20px 0 0 0;margin-bottom:0;">
        <el-form :inline="true" size="small" :model="req" style="padding:0px;margin-left:20px;">
          <el-form-item label="活动名称:" >
            <el-select v-model="req.campaignId" @change="selectActive">
              <el-option value="" label="请选择活动"></el-option>
              <el-option v-for="item in activeNameList" :key="item.campaignId" :label="item.campaignName" :value="item.campaignId"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-collapse class="hidden-collapse" v-model="formContainerOpen" @change="handleChangeAcitve" style="position:relative;">
          <span class="form-more bold font14" style="position:absolute;top:15px;right:45px;color:#57AFFF;">更多</span>
          <el-collapse-item title="筛选条件" name="1">
            <el-form :inline="true" size="small" :model="req" style="padding:0px;margin-left:-15px;">
              <el-row style="padding-left:14px">
                <el-form-item label="批次名称:">
                  <el-select v-model="req.customerBatchId">
                    <el-option value="" label="请选择批次"></el-option>
                    <el-option v-for="item in batchList" :key="item.batchId" :label="item.batchName" :value="item.batchId"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="性别:">
                  <el-select v-model="req.customerSex">
                    <el-option value="" label="全部"></el-option>
                    <el-option value="0" label="男"></el-option>
                    <el-option value="1" label="女"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="客户质量评分:">
                  <el-input v-model="req.customerScoreStart" placeholder="客户质量评分" size="small" style="width:70px;"></el-input>
                </el-form-item>
                <el-form-item label="-">
                  <el-input v-model="req.customerScoreEnd" placeholder="客户质量评分" size="small" style="width:70px;"></el-input>
                </el-form-item>
                <el-row style="display:inline-block;">
                  <el-form-item label="地区:">
                    <el-select v-model="req.customerProvince" @change="findRegionByRegionParentId(req.customerProvince,2)">
                      <el-option value="" label="--省份/地区--"></el-option>
                      <el-option v-for="item in provinceInfo" :key="item.regionCode" :label="item.regionName" :value="item.regionCode"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item >
                    <el-select v-model="req.customerCity" @change="findRegionByRegionParentId(req.customerCity,3)">
                      <el-option value="" label="--城市--"></el-option>
                      <el-option v-for="item in cityInfo" :key="item.regionCode" :label="item.regionName" :value="item.regionCode"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item >
                    <el-select v-model="req.customerDistrict">
                      <el-option value="" label="--区/县--"></el-option>
                      <el-option v-for="item in countryInfo" :key="item.regionCode" :label="item.regionName" :value="item.regionCode"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button size="small" type="primary" @click="selectActive">查询</el-button>
                    <el-button size="small" @click="resetReq('searchForm');">重置</el-button>
                  </el-form-item>
                </el-row>
              </el-row>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </el-row>
     
      <el-row class="table-container" style="margin-top:15px;">
        <el-row>
          <div class="work-title-style font14 bold">可分配名单</div>
        </el-row>
        <el-row style="margin-top:20px;">
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
              prop="listId"
              label="名单编号"
              :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
              align="center"
              prop="listName"
              label="名单名称"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{ scope.row.listName }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="totalNum"
              label="总数量">
            </el-table-column>
            <el-table-column
              align="center"
              prop="noUseNum"
              label="可分配数量">
            </el-table-column>
            <el-table-column
              align="center"
              prop="modifierName"
              label="操作人"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{ scope.row.modifierName }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="modifierTime"
              label="操作时间"
              width="155">
            </el-table-column>
          </el-table>
          <el-row style="margin-top:1%;">
            <el-col :span="12"><div style="margin-top:1%;" class="font14">已选中名单统计：总数量<span style="color:red">{{formInline.totalNum}}</span>，可分配数量<span style="color:red">{{formInline.noUseNum}} </span></div></el-col>
            <el-col :span="12">
              <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="pagination.pageNo"
                :page-size="pagination.pageSize"
                :page-sizes="[10, 20, 30, 40, 50]"
                layout="total, sizes, prev, pager, next, jumper "
                :total="pagination.totalCount" style="text-align: right">
              </el-pagination>
            </el-col>
          </el-row>
        </el-row>
      </el-row>

      <el-row class="table-container" style="margin-top:15px">
        <el-form :inline="true" size="small">
          <el-form-item label="本次分配数量:">
            <el-input-number v-model="formInline.num" :step="10" @change="handleChange"></el-input-number>
          </el-form-item>
          <el-form-item label="分配方式:">
            <el-radio v-model="formInline.radio" label="0">顺序分配</el-radio>
            <el-radio v-model="formInline.radio" label="1">平均分配</el-radio>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="loading" @click="confirm(formInline)">确认分配</el-button>
          </el-form-item>
        </el-form>
        <el-row>
          <div>
            <span class="font14" style="color:red;">
              提示：可在下方表格中最后一列手动填写分配数量或由系统自动完成分配动作。
            </span>
          </div>
        </el-row>
        <el-row>
          <div class="font14 bold">下属表</div>
        </el-row>
        <el-row style="margin-top:20px;"> 
          <el-table
            :header-row-style="headerRow"
            :data="tableData2"
            ref="multipleTable"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange2">
            <el-table-column
              align="center"
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              align="center"
              prop="departName"
              label="分配对象"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{ scope.row.departName }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="noUseNum"
              :label="noUseNumLabel">
            </el-table-column>
            <el-table-column
              align="center"
              prop="useNum"
              :label="useNumLabel">
            </el-table-column>
            <el-table-column
              align="center"
              prop="totalNum"
              label="总数量">
            </el-table-column>
            <el-table-column
              align="center"
              label="本次分配数量">
              <template slot-scope="scope">
                <el-input v-model="tableData2[scope.$index].num" @change="handleChange1(scope.row)"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-row>
    </div>
  </div>
</template>

<script>
  import { findCampaignNameListAssignInfo, findDownNamelistInfoByCampaignAndDepart, assignTaskInfo, findAllBatch } from '@/api/captain_list_newdistribute_group'
  import { Message } from 'element-ui'
  import { findCampaignByUser, getDownInfoByCurrentUser } from '@/api/monitor_list_single'
  import { formatDateTime, findRegionByRegionParentId } from '@/utils/tools'

  export default {
    name: 'captain_list_newdistribute_group',
    data() {
      return {
        formContainerOpen: [],
        loading: false,
        type: '',
        totalNum: 0,
        noUseNumLabel: '',
        useNumLabel: '',
        multipleSelection2: [],
        multipleSelection: [],
        campaignIdList: [],
        tableData: [],
        tableData2: [],
        activeNameList: [],
        batchList: [],
        provinceInfo: [], // 省
        cityInfo: [], // 城市
        countryInfo: [], // 县
        formInline: {
          radio: '0',
          campaignId: '',
          num: '',
          totalNum: 0,
          noUseNum: 0
        },
        pagination: {
          pageNo: null,
          pageSize: null,
          totalCount: 0,
          totalPage: null
        },
        // 查询 发送请求参数
        req: {
          campaignId: '',
          departId: localStorage.getItem('departId'),
          customerBatchId: '',
          customerSex: '',
          customerProvince: '',
          customerCity: '',
          customerDistrict: '',
          customerScoreStart: '',
          customerScoreEnd: '',
          pageNo: 1,
          pageSize: 10
        }
      }
    },
    mounted() {
      this.findAllBatch()
      this.findRegionByRegionParentId('0', 1)
    },
    methods: {
      handleChangeAcitve(active = ['1']) {
        if (active.length) {
          $('.form-more').text('收起')
        } else {
          $('.form-more').text('更多')
        }
      },
      findAllBatch() {
        findAllBatch().then(response => {
          if (response.data.code === 0) {
            this.batchList = response.data.data
          } else {
            Message({
              message: response.data.message,
              type: 'error',
              duration: 3 * 1000
            })
          }
        })
      },
      findRegionByRegionParentId(regionParentId, level) {
        console.log('regionParentId:', regionParentId)
        if (regionParentId === '') {
          if (level === 1) {
            this.provinceInfo = []
            this.cityInfo = []
            this.countryInfo = []
            this.req.customerProvince = ''
            this.req.customerCity = ''
            this.req.customerDistrict = ''
          } else if (level === 2) {
            this.cityInfo = []
            this.countryInfo = []
            this.req.customerCity = ''
            this.req.customerDistrict = ''
          } else if (level === 3) {
            this.countryInfo = []
            this.req.customerDistrict = ''
          }
          return
        }
        findRegionByRegionParentId(regionParentId).then(response => {
          if (response.data.code === 0) {
            console.log('region:', response.data)
            if (level === 1) {
              this.provinceInfo = response.data.data
              this.cityInfo = []
              this.countryInfo = []
              this.req.customerCity = ''
              this.req.customerDistrict = ''
            } else if (level === 2) {
              this.cityInfo = response.data.data
              this.countryInfo = []
              this.req.customerCity = ''
              this.req.customerDistrict = ''
            } else if (level === 3) {
              this.countryInfo = response.data.data
              this.req.customerDistrict = ''
            }
          } else {
            Message({
              message: response.data.message,
              type: 'error',
              duration: 3 * 1000
            })
          }
        })
      },
      resetReq() {
        this.req = {
          campaignId: '',
          departId: localStorage.getItem('departId'),
          customerBatchId: '',
          customerSex: '',
          customerProvince: '',
          customerCity: '',
          customerDistrict: '',
          customerScoreStart: '',
          customerScoreEnd: '',
          pageNo: 1,
          pageSize: 10
        }
      },
      selectActive(val) {
        if (!this.req.campaignId) {
          Message({
            message: '请选择活动',
            type: 'error',
            duration: 3 * 1000
          })
          return
        }
        this.req.pageNo = 1
        this.req.pageSize = 10
        findCampaignNameListAssignInfo(this.req).then(response => {
          if (response.data.code === 0) {
            this.tableData = response.data.data
            this.pagination = response.data.pageInfo
            // 清除数据
            // this.handleChange()
            for (let i = 0; i <= this.tableData.length - 1; i++) {
              if (this.tableData[i]) {
                this.tableData[i].modifierTime = formatDateTime(this.tableData[i].modifierTime)
              }
            }
            findDownNamelistInfoByCampaignAndDepart({
              campaignId: val
            }).then(res => {
              if (res.data.code === 0) {
                this.tableData2 = res.data.data
                this.type = res.data.type
                for (let i = 0; i <= this.tableData2.length - 1; i++) {
                  if (this.tableData2[i]) {
                    this.tableData2[i].num = ''
                    if (this.tableData2[i].staffName) {
                      this.tableData2[i].departName = this.tableData2[i].staffName
                    }
                  }
                }
              } else {
                Message({
                  message: res.data.message,
                  type: 'error',
                  duration: 3 * 1000
                })
              }
            })
          } else {
            this.tableData = []
            this.tableData2 = []
            if (val) {
              Message({
                message: response.data.message,
                type: 'error',
                duration: 3 * 1000
              })
            }
          }
        })
      },
      handleSizeChange(val) {
        this.req.pageSize = val
        this.req.pageNo = 1
        this.pagination.pageNo = 1
        findCampaignNameListAssignInfo(this.req).then(response => {
          if (response.data.code === 0) {
            this.tableData = response.data.data
            this.pagination = response.data.pageInfo
            for (let i = 0; i <= this.tableData.length; i++) {
              if (this.tableData[i]) {
                this.tableData[i].modifierTime = formatDateTime(this.tableData[i].modifierTime)
              }
            }
          } else {
            this.tableData = []
            this.tableData2 = []
            Message({
              message: response.data.message,
              type: 'error',
              duration: 3 * 1000
            })
          }
        })
      },
      handleCurrentChange(val) {
        this.req.pageNo = val
        findCampaignNameListAssignInfo(this.req).then(response => {
          if (response.data.code === 0) {
            this.tableData = response.data.data
            this.pagination = response.data.pageInfo
            for (let i = 0; i <= this.tableData.length; i++) {
              if (this.tableData[i]) {
                this.tableData[i].modifierTime = formatDateTime(this.tableData[i].modifierTime)
              }
            }
          } else {
            this.tableData = []
            this.tableData2 = []
            Message({
              message: response.data.message,
              type: 'error',
              duration: 3 * 1000
            })
          }
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
        this.formInline.noUseNum = 0
        this.formInline.totalNum = 0
        for (let i = 0; i <= val.length; i++) {
          if (val[i]) {
            this.formInline.noUseNum += Number(val[i].noUseNum)
            this.formInline.totalNum += Number(val[i].totalNum)
          }
        }
        this.handleChange()
      },
      assignNum() {
        for (let i = 0; i <= this.tableData2.length - 1; i++) {
          if (this.tableData2[i]) {
            this.tableData2[i].num = ''
            this.$set(this.tableData2, i, this.tableData2[i])
          }
        }
        if (this.multipleSelection2.length !== 0) {
          for (let i = 0; i <= this.multipleSelection2.length - 1; i++) {
            this.multipleSelection2[i].num = parseInt(Number(this.formInline.num) / this.multipleSelection2.length)
          }
          for (let i = 0; i < parseInt(Number(this.formInline.num) % this.multipleSelection2.length); i++) {
            this.multipleSelection2[i].num += 1
          }
        }
      },
      handleSelectionChange2(val) {
        this.multipleSelection2 = val
        this.assignNum()
      },
      headerRow({ row, rowIndex }) {
        if (rowIndex === 0) {
          return 'color:black'
        } else {
          return ''
        }
      },
      handleChange(value) {
        if (!value) {
          this.formInline.num = 0
        }
        if (Number(this.formInline.num) > Number(this.formInline.noUseNum)) {
          Message({
            message: '分配量不能大于未分配量',
            type: 'error',
            duration: 3 * 1000
          })
        } else {
          this.assignNum()
        }
      },
      handleChange1(value) {
        this.totalNum = 0
        for (let i = 0; i <= this.multipleSelection2.length - 1; i++) {
          if (this.multipleSelection2[i]) {
            this.totalNum += Number(this.multipleSelection2[i].num)
          }
        }
      },
      confirm() {
        this.handleChange1()
        if (this.multipleSelection.length === 0) {
          Message({
            message: '请选择名单',
            type: 'error',
            duration: 3 * 1000
          })
        } else if (this.multipleSelection2.length === 0) {
          Message({
            message: '请选择分配对象',
            type: 'error',
            duration: 3 * 1000
          })
        } else if (Number(this.formInline.num) > Number(this.formInline.noUseNum)) {
          Message({
            message: '分配量不能大于未分配量',
            type: 'error',
            duration: 3 * 1000
          })
        } else if (this.totalNum !== Number(this.formInline.num)) {
          Message({
            message: '分配数量总和不等于分配量',
            type: 'error',
            duration: 3 * 1000
          })
        } else if (this.formInline.num) {
          const data = []
          const listIds = this.multipleSelection.map(function(item, index) {
            return item.listId
          })
          for (let i = 0; i <= this.multipleSelection2.length - 1; i++) {
            const obj = {}
            if (this.multipleSelection2[i]) {
              if (this.multipleSelection2[i].departId) {
                obj[String(this.multipleSelection2[i].departId)] = this.multipleSelection2[i].num
              } else {
                obj[String(this.multipleSelection2[i].staffId)] = this.multipleSelection2[i].num
              }
              data.push(obj)
            }
          }
          this.loading = true
          assignTaskInfo({
            assignNum: String(this.formInline.num),
            assignType: this.formInline.radio,
            listIds: listIds,
            campaignId: this.req.campaignId,
            data: data,
            type: this.type
          }).then(response => {
            this.loading = false
            if (response.data.code === 0) {
              this.selectActive(this.req.campaignId)
              this.formInline.num = ''
              this.formInline.radio = '0'
            } else {
              Message({
                message: response.data.message,
                type: 'error',
                duration: 3 * 1000
              })
            }
          })
        } else {
          Message({
            message: '请填写分配量',
            type: 'error',
            duration: 3 * 1000
          })
        }
      }
    },
    created() {
      new Promise((resolve, reject) => {
        findCampaignByUser().then(response => {
          this.activeNameList = response.data.data
          resolve(response.data.data)
        })
      }).then(activeNameList => {
        this.campaignIdList = activeNameList.map(function(item, index) {
          return item.campaignId
        })
        getDownInfoByCurrentUser().then(response => {
          if (response.data.code === 1) {
            this.noUseNumLabel = response.data.type ? '未使用数量' : '未分配数量'
            this.useNumLabel = response.data.type ? '已使用数量' : '已分配数量'
          }
        })
      })
    }
  }
</script>
<style>
.el-card__body{
   padding:20px !important
}
</style>

