<template>
  <div class='container' style="padding:0 20px;">
      <el-row>
          <el-form :inline="true" size="small">
            <el-form-item label="订单状态：">
              <el-select v-model="req.status" placeholder="请选择" clearable>
                  <el-option
                    v-for="item in options"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>&nbsp;&nbsp;

            <el-form-item label="订单编号：">
                <el-input v-model="req.orderId" placeholder="订单编号"></el-input>
            </el-form-item>&nbsp;&nbsp;&nbsp;&nbsp;

            <el-form-item label="产品名称：">
                <el-input v-model="req.productName" placeholder="产品名称"></el-input>
            </el-form-item><br/>
            
            <el-form-item label="活动名称：">
              <el-select v-model="req.campaignId" placeholder="请选择" clearable filterable>
                  <el-option
                    v-for="campaign in campaigns"
                    :label="campaign.campaignName"
                    :value="campaign.campaignId">
                  </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="客户姓名：">
                <el-input v-model="req.customerName" placeholder="客户姓名"></el-input>
            </el-form-item>&nbsp;&nbsp;&nbsp;&nbsp;

            <el-form-item label="销售日期：">
                <el-date-picker
                    v-model="req.modifyTimeStart"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    default-time="00:00:00">
                </el-date-picker>
                到
                <el-date-picker
                    v-model="req.modifyTimeEnd"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    default-time="00:00:00">
                </el-date-picker>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="req.pageNo=1;searchByKeyWords(req)" icon="el-icon-search">筛选</el-button>
                <el-button type="danger" @click="clearForm(req)">重置</el-button>
            </el-form-item>
          </el-form>
      </el-row>
      
      <el-row>
      <el-col>
        <el-table
          :data="tableData"
          border>
          <el-table-column
            align="center"
            label="序号"
            width="50">
            <template
              slot-scope="scope">
              <div>{{scope.$index+(req.pageNo-1)*10+1}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="订单编号"
            width="180">
            <template slot-scope="scope">
              <el-button type="text" size="medium" @click="detailVisiable=true;searchByOrderId(scope.row.orderId)">{{scope.row.orderId}}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="产品名称"
            prop="productName">
          </el-table-column>
          <el-table-column
            align="center"
            label="客户姓名"
            prop="customerName">
          </el-table-column>
          <el-table-column
          align="center"
          label="所属活动">
          <template slot-scope="scope">
            <div>{{showCampaignName(scope.row.campaignId)}}</div>
          </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="客户电话"
            width="100">
            <template slot-scope="scope">
              <div>{{hideMobile(scope.row.customerPhone)}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="员工工号"
            prop="staffId">
          </el-table-column>
          <el-table-column
            align="center"
            label="员工姓名"
            width="110"
            prop="staffName">
          </el-table-column>
          <el-table-column
            align="center"
            label="操作时间"
            width="180"
            prop="modifyTime">
          </el-table-column>
          <el-table-column
            align="center"
            label="合计金额(元)"
            prop="totalAmount">
          </el-table-column>
          <el-table-column
            align="center"
            label="订单状态">
            <template slot-scope="scope">
              <div v-html="showStatus(scope.row.status)"></div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="订单备注"
            prop="description">
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="150">
          <template slot-scope="scope">
            <el-button v-if="scope.row.productId != 'P20180101000001'" @click="editVisiable=true;searchByOrderId(scope.row.orderId)" type="text" size="medium">修改</el-button>
            <el-button v-if="scope.row.productId != 'P20180101000001'" @click="delVisiable=true;deleteReq.orderId=scope.row.orderId;deleteReq.status=scope.row.status" type="text" size="medium">删除</el-button>
            <el-button v-if="scope.row.productId === 'P20180101000001'" type="text" size="medium" @click="detailVisiable=true;searchByOrderId(scope.row.orderId)">详情</el-button>
            <el-button v-if="scope.row.status === '0' && scope.row.productId != 'P20180101000001'" @click="messageVisiable=true;messageParams.orderId=scope.row.orderId;messageParams.phone=scope.row.customerPhone;" type="text" size="medium">发送短信</el-button>
          </template>
          </el-table-column>
        </el-table> 
      </el-col> 
    </el-row>
    <el-row style="margin-top:5px;">
        <el-pagination
          v-if="pageShow"
          background
          @current-change="handleCurrentChange"
          :current-page=pageInfo.pageNo
          :page-sizes="[10, 20, 30, 50]"
          :page-size=pageInfo.pageSize
          layout="total, prev, pager, next, jumper"
          :total=pageInfo.totalCount style="text-align: right;float:right;">
        </el-pagination>
    </el-row>

    <!-- 订单详情的dialog -->
    <el-dialog
    align:left
    width="30%"
    title="订单详情"
    :visible.sync="detailVisiable"
    append-to-body>
      <el-form label-width="100px">
        <el-form-item label="订单编号">
          <span>{{orderDetail.orderId}}</span>
        </el-form-item>
        <el-form-item label="客户姓名">
          <span>{{orderDetail.customerName}}</span>
        </el-form-item>
        <el-form-item label="客户电话">
          <span v-text="hideMobile(orderDetail.customerPhone)"></span>
        </el-form-item>
        <el-form-item label="创建时间">
          <span>{{orderDetail.createTime}}</span>
        </el-form-item>
        <el-form-item label="订单状态">
          <span v-html="showStatus(orderDetail.status)"></span>
        </el-form-item>
        <el-form-item label="支付方式">
          <span>{{orderDetail.payTypeName}}</span>
        </el-form-item>
        <el-form-item label="选购产品">
          <span>{{orderDetail.productName}}</span>
        </el-form-item>
        <el-form-item label="订单金额(元)">
          <span>{{orderDetail.totalAmount}}</span>
        </el-form-item>
        <el-form-item label="订单备注">
          <span>{{orderDetail.description}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: right;">
        <el-button @click="detailVisiable=false">返回</el-button>
      </div>
    </el-dialog>
    <!-- 订单详情的dialog  end-->

    <!-- 订单修改的dialog -->
    <el-dialog
    align:left
    width="30%"
    title="修改订单"
    :visible.sync="editVisiable"
    append-to-body>
      <el-form label-width="100px" :model="orderDetail" ref="editorder" :rules="rule">
        <el-form-item label="订单编号">
          <span>{{orderDetail.orderId}}</span>
        </el-form-item>
        <el-form-item label="客户姓名">
          <el-input type="text" v-model="orderDetail.customerName" size="small"></el-input>
        </el-form-item>
        <el-form-item label="客户电话">
          <el-input type="text" v-model="orderDetail.customerPhone" size="small"></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <span>{{orderDetail.createTime}}</span>
        </el-form-item>
        <el-form-item label="订单状态">
          <span v-html="showStatus(orderDetail.status)"></span>
        </el-form-item>
        <el-form-item label="支付方式">
          <span>{{orderDetail.payTypeName}}</span>
        </el-form-item>
        <el-form-item label="选购产品">
          <span>{{orderDetail.productName}}</span>
        </el-form-item>
        <el-form-item label="订单金额(元)">
          <span>{{orderDetail.totalAmount}}</span>
        </el-form-item>
        <el-form-item label="订单备注">
          <el-input type="text" v-model="orderDetail.description" size="small"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: right;">
        <el-button type="primary" @click="submitForm('editorder');editOrder(orderDetail)">确定</el-button>
        <el-button type="danger" @click="searchByOrderId(orderDetail.orderId)">重置</el-button>
        <el-button @click="editVisiable=false">返回</el-button>
      </div>
    </el-dialog>
    <!-- 订单修改的dialog  end-->
    
    <el-dialog
      width="30%"
      title="删除提示"
      :visible.sync="delVisiable"
      append-to-body>
      <span style="font-size:15px;">确定删除此订单？</span>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button type="primary" @click="delVisiable = false;delOrder(deleteReq);">确定</el-button>
        <el-button @click="delVisiable = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      width="30%"
      title="提示信息"
      :visible.sync="messageVisiable"
      append-to-body>
      <span style="font-size:15px;">是否向客户发送支付短信?</span>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button type="primary" @click="messageVisiable = false;sendMessage(messageParams);">确定</el-button>
        <el-button @click="messageVisiable = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang='scss' scoped>
</style>

<script>
  import { getMenu } from '@/api/dashboard' // 侧边菜单栏
  import { rule } from '@/utils/validate' // 校验工具
  // import { formatDateTime } from '@/utils/tools' // 格式化时间
  import {
    getAllCamps,
    queryByKeyWords,
    queryByOrderId,
    checkEditOrder,
    deleteOrderById,
    sendMessageToCustomer
  } from '@/api/order_management_staff' // api接口引用

  export default {
    name: 'order_management_staff',

    data() {
      return {
        tableData: [], // 表格数据
        pageShow: true, // 是否显示分页
        pageInfo: {}, // 分页信息
        detailVisiable: false, // 详情dialog显示隐藏
        editVisiable: false, // 修改dialog显示隐藏
        delVisiable: false, // 删除dialog显示隐藏
        messageVisiable: false, // 发送短信dialog显示隐藏
        rule: rule, // 检验规则
        validated: false, // 校验是否通过的标志
        // 订单状态
        options: [
          {
            label: '',
            value: ''
          },
          {
            label: '待支付',
            value: '0'
          },
          {
            label: '支付完成',
            value: '1'
          },
          {
            label: '订单完成',
            value: '2'
          }
        ],
        // 所有活动
        campaigns: [],
        // 查询条件
        req: {
          status: '',
          orderId: '',
          productName: '',
          campaignId: '',
          customerName: '',
          modifyTimeStart: '',
          modifyTimeEnd: '',
          pageNo: 1,
          departId: null
        },
        // 订单详情
        orderDetail: {
          customerName: '',
          customerPhone: '',
          orderId: '',
          createTime: '',
          status: '',
          payTypeName: '',
          productName: '',
          totalAmount: '',
          description: ''
        },
        // 删除参数
        deleteReq: {
          orderId: '',
          status: ''
        },
        // 发送短信参数
        messageParams: {
          orderId: '',
          phone: ''
        }
      }
    },

    methods: {
      // 综合查询
      searchByKeyWords(req) {
        queryByKeyWords(req)
          .then(response => {
            if (response.data.code === 0) {
              if (response.data.data) {
                this.tableData = response.data.data
                this.pageShow = true
                this.pageInfo = response.data.pageInfo
              } else {
                this.tableData = response.data.data
                this.pageShow = false
                this.$message.error = '无查询结果，请核对查询条件'
              }
            }
          })
      },
      // 分页翻页功能
      handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
        this.req.pageNo = val
        this.searchByKeyWords(this.req)
      },
      // 隐藏手机号
      hideMobile(mobile) {
        if (mobile) {
          return mobile.substring(0, 3) + '****' + mobile.substring(7, 11)
        }
      },
      // 显示活动名称
      showCampaignName(campaignId) {
        for (var i = 0; i < this.campaigns.length; i++) {
          if (campaignId === this.campaigns[i].campaignId) {
            return this.campaigns[i].campaignName
          }
        }
      },
      // 判断订单状态 回显
      showStatus(orderStatus) {
        if (orderStatus === '0') {
          return "<span style='color:red'>待支付</span>"
        } else if (orderStatus === '1') {
          return "<span style='color:green'>支付完成</span>"
        } else if (orderStatus === '2') {
          return "<span style='color:green'>订单完成</span>"
        }
      },

      // 根据当前登录人显示活动
      getAllCampsByStaff() {
        getAllCamps()
          .then(response => {
            if (response.data.code === 0) {
              this.campaigns = response.data.data
            }
          })
          .catch(error => {
            console.log(error)
          })
      },
  
      // 根据订单id查询
      searchByOrderId(orderId) {
        queryByOrderId(orderId)
          .then(response => {
            if (response.data.code === 0) {
              this.orderDetail = response.data.data
            } else {
              this.$message.error = response.data.message
            }
          })
          .catch(error => {
            console.log(error)
          })
      },

      // 支付方式名称补无
      // showPayType(payTypeName) {
      //   if (payTypeName) {
      //     return ''
      //   } else {
      //     return '无'
      //   }
      // },

      // 校验
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.validated = true
          } else {
            this.$message.error = '请检验字段是否填写正确'
            this.validated = false
          }
        })
      },

      // 修改订单信息
      editOrder(orderDetail) {
        // 判断是否校验通过
        if (!this.validated) {
          return false
        }
        // 校验通过 关闭修改dialog执行修改逻辑并重新查询以刷新页面
        this.editVisiable = false
        checkEditOrder(orderDetail)
          .then(response => {
            if (response.data.code === 0) {
              this.$message.success = response.data.message
              this.searchByKeyWords(this.req)
            } else {
              this.$message(response.data.message)
            }
          })
          .catch(error => {
            console.log(error)
          })
      },
      // 删除订单
      delOrder(deleteReq) {
        if (deleteReq.status === '1') {
          this.$message.error('该订单已支付，无法删除!')
          return false
        } else if (deleteReq.status === '2') {
          this.$message.error('该订单已完成，无法删除!')
          return false
        } else {
          deleteOrderById(deleteReq)
            .then(response => {
              if (response.data.code === 0) {
                this.delVisiable = false
                this.$message.success = response.data.message
                this.searchByKeyWords(this.req)
              } else {
                this.$message.error = response.data.message
              }
            })
            .catch(error => {
              console.log(error)
            })
        }
      },
      // 发送支付短信
      sendMessage(sendMessage) {
        sendMessageToCustomer(sendMessage)
          .then(response => {
            if (response.data.code === 0) {
              // 将按钮置灰
              this.$message.success('发送成功')
            } else {
              this.$message.error(response.data.message)
            }
          })
          .catch(error => {
            console.log(error)
          })
      },
      // 重置搜索选项
      clearForm(obj, formName) {
        for (const key in obj) {
          if (key !== 'pageNo') {
            obj[key] = ''
          }
        }
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields()
        }
      }

    },

    // 组件刚被创建时 属性还未计算时   methods方法还未调用时
    beforeCreate() {
      // 菜单
      getMenu()
        .then(response => {
          const data = response.data
          sessionStorage.setItem('getMenu', JSON.stringify(data))
        })
        .catch(error => {
          console.log(error)
        })
    },

    // 组件挂载时
    mounted() {
      this.getAllCampsByStaff()
      this.searchByKeyWords(this.req)
    }

}
</script>
