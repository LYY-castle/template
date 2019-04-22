<template>
  <div class='container'>
    <el-collapse v-model="formContainerOpen" class="form-container" @change="handleChangeAcitve">
      <el-collapse-item title="筛选条件" name="1">
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
            <el-input v-model="req.orderId" placeholder="订单编号（上限50字符）" maxlength="50"></el-input>
          </el-form-item>&nbsp;&nbsp;&nbsp;&nbsp;

          <el-form-item label="产品名称：">
            <el-input v-model="req.productName" placeholder="产品名称（上限255字符）" maxlength="255"></el-input>
          </el-form-item>

          <el-form-item label="销售员工：" v-if="this.isManager">
            <el-input v-model="req.staffName" placeholder="员工姓名（上限50字符）" maxlength="50"></el-input>
          </el-form-item>
          <br/>

          <el-form-item label="活动名称：">
            <el-select v-model="req.campaignId" placeholder="请选择" clearable filterable>
              <el-option label="所有活动" value=""></el-option>
              <el-option
                v-for="campaign in campaigns"
                :label="campaign.campaignName"
                :value="campaign.campaignId">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="客户姓名：">
            <el-input v-model="req.customerName" placeholder="客户姓名（上限50字符）" maxlength="50"></el-input>
          </el-form-item>&nbsp;&nbsp;&nbsp;&nbsp;

          <el-form-item label="操作时间：">
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
            <el-button type="primary" @click="req.pageNo=1;searchByKeyWords(req)">查询</el-button>
            <el-button @click="clearForm(req)">重置</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <el-row class="table-container">
      <el-row class="margin-bottom-20">
        <div class="font14 bold">订单管理表</div>
      </el-row>
      <el-row>
        <el-table
          :data="tableData">
          <el-table-column
            align="center"
            label="订单编号"
            width="180"
            fixed
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <a @click="detailVisiable=true;searchByOrderId(scope.row.orderId)">{{scope.row.orderId}}</a>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="产品名称"
            prop="productName"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
                {{ showProducts(scope.row.productInfos) }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="客户姓名"
            prop="customerName"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.customerName }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="客户电话"
            width="100"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{hideMobile(scope.row.customerPhone)}}
            </template>
          </el-table-column>
          <el-table-column
          align="center"
          label="所属活动"
          :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{showCampaignName(scope.row.campaignId)}}
          </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="员工工号"
            prop="staffId"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            align="center"
            label="员工姓名"
            prop="staffName"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.staffName }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作时间"
            width="155"
            prop="modifyTime">
          </el-table-column>
          <el-table-column
            align="center"
            label="合计金额(元)"
            prop="totalAmount"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            align="center"
            label="订单状态">
            <template slot-scope="scope">
              <div :class="scope.row.status==='0'?'invisible':scope.row.status==='1'?'visible':scope.row.status==='2'?'visible':''">
                <span>{{scope.row.status==='0'?'待支付':scope.row.status==='1'?'支付完成':scope.row.status==='2'?'订单完成':''}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="订单备注"
            prop="description"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.description }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            fixed="right"
            width="200">
            <template slot-scope="scope">
              <el-button v-if="scope.row.productId != 'P20180101000001'" @click="editVisiable=true;searchByOrderId(scope.row.orderId)" type="text" size="medium">修改</el-button>
              <el-button v-if="scope.row.productId != 'P20180101000001'" @click="delVisiable=true;deleteReq.orderId=scope.row.orderId;deleteReq.status=scope.row.status" type="text" size="medium">删除
              </el-button>
              <el-button v-if="scope.row.productId === 'P20180101000001'" type="text" size="medium" @click="detailVisiable=true;searchByOrderId(scope.row.orderId)">详情</el-button>
              <el-button v-if="scope.row.status === '0' && scope.row.productId != 'P20180101000001'"
                         @click="messageVisiable=true;messageParams.orderId=scope.row.orderId;messageParams.phone=scope.row.customerPhone;" type="text" size="medium">发送短信
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row style="margin-top:20px;">
        <el-pagination
          v-if="pageShow"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page=pageInfo.pageNo
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size=pageInfo.pageSize
          layout="total, sizes, prev, pager, next, jumper"
          :total=pageInfo.totalCount style="text-align: right;float:right;">
        </el-pagination>
      </el-row>
    </el-row>
    

    <!-- 订单详情的dialog -->
    <el-dialog
      align:left
      width="30%"
      title="订单详情"
      :visible.sync="detailVisiable"
      append-to-body>
      <el-form size="small" label-width="100px">
        <el-form-item label="订单编号">
          <span>{{orderDetail.orderId}}</span>
        </el-form-item>
        <el-form-item label="客户姓名">
          <span>{{orderDetail.customerName}}</span>
        </el-form-item>
        <el-form-item label="客户电话">
          <span v-text="hideMobile(orderDetail.customerPhone)"></span>
        </el-form-item>
        <el-form-item label="新建时间">
          <span>{{orderDetail.createTime}}</span>
        </el-form-item>
        <el-form-item label="订单状态">
          <span v-html="showStatus(orderDetail.status)"></span>
        </el-form-item>
        <el-form-item label="支付方式">
          <span>{{orderDetail.payTypeName}}</span>
        </el-form-item>
        <el-form-item label="选购产品">
          <span>{{showProducts(orderDetail.productInfos)}}</span>
        </el-form-item>
        <el-form-item label="订单金额(元)">
          <span>{{orderDetail.totalAmount}}</span>
        </el-form-item>
        <el-form-item label="订单备注">
          <span>{{orderDetail.description}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: right;">
        <el-button type="primary" plain @click="detailVisiable=false">返回</el-button>
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
      <el-form size="small" label-width="100px" :model="orderDetail" ref="editorder" :rules="rule">
        <el-form-item label="订单编号">
          <span>{{orderDetail.orderId}}</span>
        </el-form-item>
        <el-form-item label="客户姓名">
          <el-input type="text" v-model="orderDetail.customerName" size="small"></el-input>
        </el-form-item>
        <el-form-item label="客户电话">
          <el-input type="text" v-model="orderDetail.customerPhone" size="small"></el-input>
        </el-form-item>
        <el-form-item label="新建时间">
          <span>{{orderDetail.createTime}}</span>
        </el-form-item>
        <el-form-item label="订单状态">
          <span v-html="showStatus(orderDetail.status)"></span>
        </el-form-item>
        <el-form-item label="支付方式">
          <span>{{orderDetail.payTypeName}}</span>
        </el-form-item>
        <el-form-item label="选购产品">
          <span>{{showProducts(orderDetail.productInfos)}}</span>
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
        <el-button @click="searchByOrderId(orderDetail.orderId)">重置</el-button>
        <el-button type="primary" plain @click="editVisiable=false">返回</el-button>
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
        <el-button type="primary" plain @click="delVisiable = false">取消</el-button>
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
        <el-button type="primary" plain @click="messageVisiable = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { rule } from '@/utils/validate' // 校验工具
  import {
    checkManager,
    checkStaff,
    getAllCamps,
    queryByKeyWords,
    queryByOrderId,
    checkEditOrder,
    deleteOrderById,
    sendMessageToCustomer
  } from '@/api/order_management' // api接口引用
  import { permsManager } from '@/api/permission'
  export default {
    name: 'order_management',

    data() {
      return {
        formContainerOpen: '1',
        formContainer: this.$store.state.app.formContainer,
        tableData: [], // 表格数据
        pageShow: true, // 是否显示分页
        pageInfo: {
          pageSize: null,
          pageNo: null,
          totalCount: null,
          totalPage: null
        }, // 分页信息
        isManager: false, // 是主管
        isStaff: false, // 普通员工
        detailVisiable: false, // 详情dialog显示隐藏
        editVisiable: false, // 修改dialog显示隐藏
        delVisiable: false, // 删除dialog显示隐藏
        messageVisiable: false, // 发送短信dialog显示隐藏
        rule: rule, // 检验规则
        validated: false, // 校验是否通过的标志
        // 订单状态
        options: [
          {
            label: '所有状态',
            value: ''
          },
          {
            label: '待支付',
            value: '0'
          },
          // {
          //   label: '支付完成',
          //   value: '1'
          // },
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
          departId: '',
          staffId: '',
          staffName: '',
          pageNo: 1,
          pageSize: 10
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

    // 组件挂载时
    mounted() {
      this.formContainer()
      this.handleChangeAcitve()
      this.req.modifyTimeStart = this.$route.query.startTime ? this.$route.query.startTime : ''
      this.req.modifyTimeEnd = this.$route.query.endTime ? this.$route.query.endTime : ''
      this.checkPermission().then(() => {
        this.searchByKeyWords(this.req)
      })
      this.getAllCampsByStaff()
    },
    methods: {
      handleChangeAcitve(active = ['1']) {
        if (active.length) {
          $('.form-more').text('收起')
        } else {
          $('.form-more').text('更多')
        }
      },
      // 展示订单产品信息
      showProducts(item) {
        let productStr = ''
        if (typeof item === 'undefined' || item === null) {
          return productStr
        } else {
          for (let i = 0; i < item.length; i++) {
            productStr += item[i].productName + ' * ' + item[i].productNum + '，'
          }
          productStr = productStr.substring(0, productStr.length - 1)
          return productStr
        }
      },
      // 综合查询
      searchByKeyWords(req) {
        if (this.isManager) {
          this.req.departId = localStorage.getItem('departId')
        } else if (this.isStaff) {
          this.req.staffId = localStorage.getItem('agentId')
        } else {
          this.pageShow = false
          this.$message.error('你无法操作该页面，请联系管理员')
          return
        }
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
                this.$message.error('无查询结果，请核对查询条件')
              }
            }
          })
      },
      // 分页翻页功能
      handleCurrentChange(val) {
        this.req.pageNo = val
        this.searchByKeyWords(this.req)
      },
      handleSizeChange(val) {
        this.req.pageNo = 1
        this.pageInfo.pageNo = 1
        this.req.pageSize = val
        this.searchByKeyWords(this.req)
      },
      // 隐藏手机号
      hideMobile(mobile) {
        if (mobile) {
          return mobile.substring(0, 3) + '****' + mobile.substring(7, 11)
        }
      },
      async checkPermission() {
        // 判断现场主管
        await permsManager(localStorage.getItem('agentId')).then(response => {
          const code = parseInt(response.data.code)
          if (code === 200) {
            this.isManager = true
          } else if (code === 403) {
            this.isManager = false
            // 判断班组长
            checkManager(localStorage.getItem('agentId')).then(response => {
              const code = parseInt(response.data.code)
              if (code === 200) this.isManager = true
              else if (code === 403) this.isManager = false
            }).catch(error => {
              throw new Error(error)
            })
          }
        }).catch(error => {
          throw new Error(error)
        })
        // 判断员工
        await checkStaff(localStorage.getItem('agentId')).then(response => {
          const code = parseInt(response.data.code)
          if (code === 200) this.isStaff = true
          else if (code === 403) this.isStaff = false
        }).catch(error => {
          throw new Error(error)
        })
        return true
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
      // 显示活动名称
      showCampaignName(campaignId) {
        for (var i = 0; i < this.campaigns.length; i++) {
          if (campaignId === this.campaigns[i].campaignId) {
            return this.campaigns[i].campaignName
          }
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
          if (key !== 'pageNo' && key !== 'pageSize') {
            obj[key] = ''
          }
        }
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields()
        }
      }

    }
  }
</script>
