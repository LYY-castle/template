<template>
  <div class="container">
    <!-- 搜索 -->
    <!-- <el-collapse v-model="formContainerOpen" class="form-container" @change="handleChangeAcitve" style="position:relative;">
      <span class="form-more bold" style="line-height: 24px;font-size: 14px;float:right;margin-right:6px;color:#57AFFF;position:absolute;top:11px;right:41px;">收起</span>
      <el-collapse-item title="筛选条件" name="1">
        <el-form :inline="true" size="small">
          <el-form-item label="批次编号:">
            <el-input v-model="req.batchId" placeholder="批次编号（限长50字符）" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="客户编号:">
            <el-input v-model="req.customerId" placeholder="客户编号（限长50字符）" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="客户姓名:">
            <el-input v-model="req.customerName" placeholder="客户姓名（限长50字符）" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="身份证:">
            <el-input v-model="req.idNo" placeholder="身份证（限长50字符）" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="操作人:">
            <el-input v-model="req.modifierName" placeholder="操作人（限长50）字符" maxlength="50"></el-input>
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
            <el-button type="primary" @click="req.pageNo=1;searchCustomer(req);req2=clone(req);">查询</el-button>
            <el-button @click="reset();req2=clone(req)">重置</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse> -->
    <el-row class="table-container" v-if="tableShow">
      <el-row class="margin-bottom-20">
        <div class="font14 bold">工作表单</div>
      </el-row>
      <el-row class="margin-bottom-20">
        <el-button type="success" size="small" @click="createWorkFrom;tableShow=false"
          >新建</el-button
        >
        <!-- <el-button type="danger" size="small" @click="batchDelVisible = true"
          >批量删除</el-button
        > -->
        <!-- <el-button type="info" size="small" @click="importVisible=true;importInfo.uploadFileName='';importInfo.batchName='';importInfo.source=''">导入客户</el-button> -->
      </el-row>
      <el-row>
        <el-table
          :data="workFromData"
          highlight-current-row
          @selection-change="handleSelectionChange"
        >
          <!-- <el-table-column align="center" type="selection" width="55">
          </el-table-column> -->

          <el-table-column
            align="center"
            label="客户姓名"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="modifierName"
            label="操作人"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ scope.row.modifierName }}
            </template>
          </el-table-column>
          <!-- 操作时间 -->
          <el-table-column align="center" width="155" label="操作时间">
            <template slot-scope="scope">
              {{ formatDateTime(scope.row.modifyTime) }}
            </template>
          </el-table-column>
          <!-- 备注 -->
          <el-table-column align="center" label="备注">
            <template slot-scope="scope">
              {{ scope.row.remark }}
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column align="center" label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                @click="searchByCustomerId(scope.row, 2)"
                type="text"
                size="small"
                >修改</el-button
              >
              <el-button
                @click="
                  delVisible = true;
                  workFormId = scope.row.id;
                "
                type="text"
                size="small"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row style="margin-top:20px;">
        <el-pagination
          v-if="pageShow"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageInfo.pageNo"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="pageInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper "
          :total="pageInfo.totalCount"
          style="text-align: right;float:right;"
        >
        </el-pagination>
      </el-row>
    </el-row>
    <!-- 新建工作表单 -->
    <div v-if="createShow">
      <el-row :gutter="20">
        <el-col :span="8"><div class="grid-content bg-purple">左边</div></el-col>
        <el-col :span="8"><div class="grid-content bg-purple">中间</div></el-col>
        <el-col :span="8"><div class="grid-content bg-purple">右边</div></el-col>
      </el-row>
    </div>
    <!-- 单个删除dialog -->
    <el-dialog
      width="30%"
      title="操作提示"
      :visible.sync="delVisible"
      append-to-body
    >
      <span style="font-size:20px;">确定删除此客户？</span>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button
          type="primary"
          @click="
            delVisible = false;
            deleteWorkForm(workFormId);
          "
          >确定</el-button
        >
        <el-button type="primary" plain @click="delVisible = false"
          >取消</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getWorkForm,
  deleteWorkForm,
  createWorkForm
} from "@/api/work_form_manage";
import { formatDateTime, clone } from "@/utils/tools";
export default {
  name: "work_form_manage",
  data() {
    return {
      formContainerOpen: "1",
      // 工作表单
      workFromData: [],
      createShow: false,
      delVisible: false,
      workFormId: "",

      // 传参
      workFormParam: {
        createTime: "",
        creatorName: "",
        modifierName: "",
        modifyTime: "",
        name: "",
        remark: "",
        version: "",
        workformProperties: {
          dataType: "",
          dataValues: "",
          isRequired: "",
          name: "",
          placeholder: "",
          regex: "",
          remark: "",
          rw: "",
          val: "",
          workform: ""
        }
      },
      // 分页数据
      pageShow: false,
      pageInfo: {}
    };
  },
  mounted() {
    this.getWorkFormList();
  },
  methods: {
    // 获取列表数据
    getWorkFormList() {
      getWorkForm()
        .then(res => {
          if (res.cede === 0) {
            this.workFromData = res.data.data;
            if (res.data.pageInfo) {
              this.pageInfo = res.data.pageInfo;
              this.pageShow = true;
            } else {
              this.pageShow = false;
            }
          } else {
            this.$message(res.data.messages);
            this.workFromData = res.data.data;
            this.pageShow = false;
          }
        })
        .catch(error => {
          throw error;
        });
    },
    // 新建初始化
    createWorkFrom() {
      this.createShow = true;
    },
    // 时间格式转换,
    formatDateTime: formatDateTime,
    // 收起展开
    handleChangeAcitve(active = ["1"]) {
      if (active.length) {
        $(".form-more").text("收起");
      } else {
        $(".form-more").text("更多");
      }
    },
    // 新建
    createWorkForm(workFormParam) {
      console.log(workFormParam);
    },
    // 删除
    deleteWorkForm(workFormId) {
      deleteWorkForm(workFormId)
        .then(response => {
          if (response.data.code === 0) {
            this.$message.success(response.data.message);
            this.getWorkFormList();
          } else {
            this.$message.error(response.data.message);
          }
        })
        .catch(error => {
          console.log(error);
          this.$message("删除失败");
        });
    },
    // 批量删除
    // batchdeleteWorkForm(batchDelReq) {
    //   console.log(batchDelReq.customerIds);
    //   if (batchDelReq.customerIds.length === 0) {
    //     this.$message.error("请选择需要删除的内容");
    //   } else {
    //     batchdeleteWorkForm(batchDelReq.customerIds)
    //       .then(response => {
    //         if (response.data.code === 0) {
    //           this.$message.success(response.data.message);
    //           this.req2.pageNo = 1;
    //           this.pageInfo.pageNo = 1;
    //           this.searchCustomer(this.req2);
    //         } else {
    //           this.$message("删除失败");
    //         }
    //       })
    //       .catch(error => {
    //         console.log(error);
    //         this.$message("删除失败");
    //       });
    //   }
    // },
    // 表格多选框
    handleSelectionChange(val) {
      this.batchDelReq.customerIds.length = 0;
      for (var i = 0; i < val.length; i++) {
        this.batchDelReq.customerIds.push(val[i].customerId);
      }
    },
    // 页面显示条数
    handleSizeChange(val) {
      this.req2.pageSize = val;
      this.req.pageSize = val;
      this.pageInfo.pageNo = 1;
      this.req.pageNo = 1;
      this.req2.pageNo = 1;
      this.searchCustomer(this.req2);
    },
    // 分页翻页功能
    handleCurrentChange(val) {
      this.req2.pageNo = val;
      this.searchCustomer(this.req2);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.table-container {
  .form-container {
    box-shadow: none;
    border: 1px solid #ebeef5;
    border-left: solid 4px #57afff;
  }
}

.inputWidth {
  width: 55%;
}
.inputWidth1 {
  width: 46%;
}
.showaddTool {
  float: right;
  margin: 0px 65%;
  height: 20px;
  cursor: pointer;
}
</style>
