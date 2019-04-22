<template>
  <div>
    <el-collapse v-model="formContainerOpen" class="form-container" @change="handleChangeAcitve" style="position:relative">
      <span class="form-more bold" style="line-height: 24px;font-size: 14px;float:right;margin-right:6px;color:#57AFFF;position:absolute;top:12px;right:40px;">收起</span>
      <el-collapse-item title="筛选条件" name="1">
        <el-form :inline="true" size="small" :model="req" ref="activeNameList" :rules="rule">
          <el-form-item label="活动名称:" v-show="activeNameList && activeNameList.length > 0" prop="campaignId">
            <el-select v-model="req.campaignId" placeholder="请选择活动">
              <el-option v-for="item in activeNameList" :key="item.campaignId" :label="item.campaignName" :value="item.campaignId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('activeNameList');searchList(req);req2=clone(req);">查询</el-button>
            <el-button @click="clearForm('activeNameList');req2=clone(req)">重置</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <el-row class="table-container">
      <el-row class="margin-bottom-20">
        <div class="font14 bold">名单报表</div>
      </el-row>
      <el-row>
        <el-table
          :data="tableData">
          <el-table-column
            align="center"
            prop="campaignId"
            label="活动">
            <template
              slot-scope="scope">
              <div>{{campaignPair(scope.row.campaignId)}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="totalNum"
            label="总数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="dialNum"
            label="拨打量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="answerNum"
            label="接通量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="answerRate"
            label="接通率">
            <template
              slot-scope="scope">
              <div>{{scope.row.answerRate+'%'}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="totalAnswerRate"
            label="总接通率">
            <template
              slot-scope="scope">
              <div>{{scope.row.totalAnswerRate+'%'}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="dealNum"
            label="成交量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="dialCount"
            label="拨打次数">
          </el-table-column>
        </el-table>
      </el-row>
    </el-row>
  </div>
</template>
<script>

import { getListReport } from '@/api/list_report'
import { queryAllCamps } from '@/api/qm_charge_generatetask'
import { clone } from '@/utils/tools'
import { rule } from '@/utils/validate'

export default {
  name: 'list_report',
  data() {
    return {
      formContainerOpen: '1',
      validate: false,
      rule: rule,
      activeNameList: [],
      tableData: [],
      req: {
        campaignId: ''
      },
      req2: {
        campaignId: ''
      },
      pageInfo: {}
    }
  },
  mounted() {
    this.handleChangeAcitve()
    queryAllCamps().then(response => {
      if (response.data.code === 0) {
        this.activeNameList = response.data.data
      } else {
        this.$message(response.data.message)
      }
    }).catch(error => {
      console.log(error)
    })
  },
  methods: {
    handleChangeAcitve(active = ['1']) {
      if (active.length) {
        $('.form-more').text('收起')
      } else {
        $('.form-more').text('更多')
      }
    },
    clone: clone,
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.validate = true
        } else {
          this.$message.error('请选择活动')
          this.validate = false
        }
      })
    },
    clearForm(formName) {
      this.req = {
        campaignId: ''
      }
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
    },
    searchList(req) {
      if (this.validate) {
        getListReport(req).then(response => {
          console.log(response.data.result)
          if (response.data.error === null) {
            this.tableData = []
            this.tableData.push(response.data.result)
          } else {
            this.$message(response.data.error)
          }
        }).catch(error => {
          throw new Error(error)
        })
      } else {
        return false
      }
    },
    // 配对活动id返回对应活动名称
    campaignPair(campaignId) {
      for (var i = 0; i < this.activeNameList.length; i++) {
        this.activeNameList[i]
        if (this.activeNameList[i].campaignId === campaignId) {
          return this.activeNameList[i].campaignName
        }
      }
    }

  }
}
</script>
<style rel="stylesheet/scss" lang="scss">

</style>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
