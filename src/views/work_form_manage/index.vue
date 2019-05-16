<template>
  <div class="">
    <!-- 搜索 -->
    <!-- <el-collapse class="form-container">
      <el-collapse-item title="筛选条件" name="1">
        <el-form :inline="true" size="small">
          <el-form-item label="问卷模板名称">
            <el-input
              type="text"
              placeholder="问卷模板名称（限长45字符）"
              maxlength="45"
              class="hideBorder"
            ></el-input>
          </el-form-item>
          <el-form-item label="操作人">
            <el-input
              type="text"
              placeholder="操作人（限长45字符）"
              maxlength="45"
            ></el-input>
          </el-form-item>
          <el-form-item label="操作时间">
            <el-date-picker
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">查询</el-button>
            <el-button>重置</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse> -->
    <!-- 数据展示 -->
    
  </div>
</template>

<script>
import { getWorkForm } from "@/api/work_form_manage";
export default {
  data() {
    return {
      // 表单数据
      workFormsData: []
    };
  },
  methods: {
    getworkformList() {
      getWorkForm().then(res => {
        if(res.code === 0){
          this.workFormsData = res.data.data
        }
      });
    }
  },
   mounted() {
    this.getworkformList()
  },
};
</script>