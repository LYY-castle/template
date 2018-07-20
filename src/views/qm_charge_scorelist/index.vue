<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-form :inline="true" class="demo-form-inline" size="small">
          <el-form-item>
            <el-input placeholder="评分表名（限长50字符）" v-model="formInline.gradeName" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input placeholder="操作人员（限长45字符）" v-model="formInline.modifierName" maxlength="45"></el-input>
          </el-form-item>
          <el-form-item label="操作时间：">
            <el-date-picker
              v-model="timeValue"
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchGrade(formInline)">查询</el-button>
            <el-button type="danger" @click="reset">清空</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :header-row-style="headerRow"
          :data="tableData"
          ref="multipleTable"
          tooltip-effect="dark"
          border
          style="width: 94%;"
          @selection-change="handleSelectionChange">
          <el-table-column
            align="center"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            width="55"
            align="center"
            type="index"
            label="序号">
          </el-table-column>
          <el-table-column
            align="center"
            label="评分编号">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleClickDetail(scope.row)">{{scope.row.gradeId}}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="gradeName"
            label="评分表名">
          </el-table-column>
          <el-table-column
            align="center"
            prop="modifier"
            label="操作人员">
          </el-table-column>
          <el-table-column
            align="center"
            prop="updateTime"
            label="操作时间">
          </el-table-column>
          <el-table-column
            align="center"
            prop="description"
            label="备注">
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="250">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small"> 修改</el-button>
              <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row style="margin-top:1%;">
        <el-col :span="4">
          <el-button type="primary" size="small" @click="addGrade()">新增评分表</el-button>
          <el-button type="danger" size="small" @click="deleteAll()">批量删除</el-button>
        </el-col>
        <el-col :span="18">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="pagination.pageNo"
            :page-size="pagination.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="pagination.totalCount" style="text-align: right">
          </el-pagination>
        </el-col>
      </el-row>
    </div>
    <el-dialog title="新增评分表" :visible.sync="dialogFormVisible" width="80%" @close="resetForm('ruleForm')">
      <el-form :model="ruleForm" ref="ruleForm" label-width="150px" class="demo-ruleForm">
        <el-row>
          <el-col :span="10">
            <el-form-item label="评分表名" prop="gradeName" :rules="{ required: true, message: '请填写评分表名', trigger: 'blur' }">
              <el-input placeholder="此处填写评分表名，上限50字符" maxlength="50" v-model='ruleForm.gradeName'>{{ruleForm.gradeName}}</el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="评分表描述信息">
          <textarea v-model='ruleForm.description' placeholder="此处填写评分表简单描述，上限100字符" maxlength="100" cols="63" rows="10">{{ruleForm.description}}</textarea>
        </el-form-item>
         <el-form-item>
          <el-button size="mini" type="primary" @click="add">添加评分题目</el-button>
        </el-form-item>
        <el-card class="box-card" v-for="(item, index) in ruleForm.gradeTitles">
          <el-row>
            <el-col :span="18">
              <el-form-item :label="parseInt(index)+1+''"  :prop="'gradeTitles.'+index+'.titleName'" :rules="{ required: true, message: '请填写评分标题', trigger: 'blur' }">
                <el-input v-model='item.titleName' placeholder="在此输入标题,上限50字符" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
                <el-button type="danger" @click.prevent="remove(index)" v-if="ruleForm.gradeTitles.length>1">删除</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item>
              <el-button size="mini" type="primary" @click="addChoice(index)">添加评分选项</el-button>
            </el-form-item>
            <div v-for="(node, index1) in item.gradeOptions">
                <el-row>
                  <el-col :span="10">
                    <el-form-item :label="'选项'+String.fromCharCode(65+parseInt(index1))" :prop="'gradeTitles.'+index+'.gradeOptions.'+index1+'.optionName'" :rules="{ required: true, message: '请给出评分条件', trigger: 'blur' }">
                      <el-input v-model="node.optionName" placeholder="在此输入选项，上限50字符"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="分值" :prop="'gradeTitles.'+index+'.gradeOptions.'+index1+'.score'" :rules="{ required: true,  pattern: /^(\-?[1-9][0-9]{0,1}|0)$/, message: '分值需在±99间' }">
                      <el-input v-model="node.score"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-button type="danger" @click.prevent="removeChild(index,index1)" v-if="ruleForm.gradeTitles[index].gradeOptions.length>1">删除</el-button>
                  </el-col>
                </el-row>
              </div>
          </el-row>
        </el-card>
        </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        <el-button type="danger" @click="resetForm('ruleForm')">重置</el-button>
        <el-button @click="dialogFormVisible = false">返 回</el-button>
      </div>
    </el-dialog>
      <el-dialog title="修改评分表" :visible.sync="dialogFormVisibleReverse" width="80%" @close="resetFormReverse('ruleFormReverse')">
      <el-form :model="ruleFormReverse" ref="ruleFormReverse" label-width="150px" class="demo-ruleForm">
        <el-row>
          <el-col :span="10">
            <el-form-item label="评分表名" prop="gradeName" :rules="{ required: true, message: '请填写评分表名', trigger: 'blur' }">
              <el-input placeholder="此处填写评分表名，上限50字符" maxlength="50" v-model='ruleFormReverse.gradeName'>{{ruleFormReverse.gradeName}}</el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="评分表描述信息">
          <textarea v-model='ruleFormReverse.description' placeholder="此处填写评分表简单描述，上限100字符" maxlength="100" cols="63" rows="10">{{ruleFormReverse.description}}</textarea>
        </el-form-item>
         <el-form-item>
          <el-button size="mini" type="primary" @click="addReverse">添加评分题目</el-button>
        </el-form-item>
        <el-card class="box-card" v-for="(item, index) in ruleFormReverse.gradeTitles"  v-if="ruleFormReverse.gradeTitles[index].isDelete!='1'">
          <el-row >
            <el-col :span="18">
              <el-form-item :label="parseInt(index)+1+''"  :prop="'gradeTitles.'+index+'.titleName'" :rules="{ required: true, message: '请填写评分标题', trigger: 'blur' }">
                <el-input v-model='item.titleName' placeholder="在此输入标题,上限50字符" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
                <el-button type="danger" @click.prevent="removeReverse(index)" v-if="ruleFormReverse.gradeTitles.length>1">删除</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item>
              <el-button size="mini" type="primary" @click="addReverseChoice(index)">添加评分选项</el-button>
            </el-form-item>
            <div v-for="(node, index1) in item.gradeOptions" v-if="node.isDelete!='1'">
                <el-row>
                  <el-col :span="10">
                    <el-form-item :label="'选项'+String.fromCharCode(65+parseInt(index1))" :prop="'gradeTitles.'+index+'.gradeOptions.'+index1+'.optionName'" :rules="{ required: true, message: '请给出评分条件', trigger: 'blur' }">
                      <el-input v-model="node.optionName" placeholder="在此输入选项，上限50字符"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="分值" :prop="'gradeTitles.'+index+'.gradeOptions.'+index1+'.score'" :rules="{ required: true,  pattern: /^(\-?[1-9][0-9]{0,1}|0)$/, message: '分值需在±99间' }">
                      <el-input v-model="node.score"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-button type="danger" @click.prevent="removeReverseChild(index,index1)" v-if="ruleFormReverse.gradeTitles[index].gradeOptions.length>1">删除</el-button>
                  </el-col>
                </el-row>
              </div>
          </el-row>
        </el-card>
        </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormReverse('ruleFormReverse')">确 定</el-button>
        <el-button type="danger" @click="resetFormReverse('ruleFormReverse')">重置</el-button>
        <el-button @click="dialogFormVisibleReverse = false">返 回</el-button>
      </div>
    </el-dialog>
      <el-dialog title="查看评分表" :visible.sync="dialogFormVisibleDetail" width="80%" @close="resetFormDetail('dialogFormVisibleDetail')">
      <el-form :model="ruleFormDetail" ref="ruleFormDetail" label-width="150px" class="demo-ruleForm">
        <el-row>
          <el-col :span="10">
            <el-form-item label="评分表名" prop="gradeName" readonly>
              <el-input placeholder="此处填写评分表名，上限50字符" maxlength="50" readonly="readonly" v-model='ruleFormDetail.gradeName'>{{ruleFormDetail.gradeName}}</el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="评分表描述信息">
          <textarea v-model='ruleFormDetail.description' placeholder="此处填写评分表简单描述，上限100字符" readonly="readonly" maxlength="100" cols="63" rows="10">{{ruleFormDetail.description}}</textarea>
        </el-form-item>
             <el-card class="box-card" v-for="(item, index) in ruleFormDetail.gradeTitles"  v-if="ruleFormDetail.gradeTitles[index].isDelete!='1'">
          <el-row >
            <el-col :span="18">
              <el-form-item :label="parseInt(index)+1+''"  :prop="'gradeTitles.'+index+'.titleName'" >
                <el-input v-model='item.titleName' placeholder="在此输入标题,上限50字符" readonly="readonly" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
                     </el-row>
          <el-row>
            <div v-for="(node, index1) in item.gradeOptions" v-if="node.isDelete!='1'">
                <el-row>
                  <el-col :span="10">
                    <el-form-item :label="'选项'+String.fromCharCode(65+parseInt(index1))" :prop="'gradeTitles.'+index+'.gradeOptions.'+index1+'.optionName'" >
                      <el-input v-model="node.optionName" placeholder="在此输入选项，上限50字符" readonly="readonly"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="分值" :prop="'gradeTitles.'+index+'.gradeOptions.'+index1+'.score'">
                      <el-input v-model="node.score" readonly="readonly"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
          </el-row>
        </el-card>
        </el-form>
      <div slot="footer" class="dialog-footer">
         <el-button @click="dialogFormVisibleDetail = false" type="danger">返 回</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { findAllGradeForm, deleteGradeFormByGradeId, deleteGradeFormByTeam, getGradeByGradeId, addGrade, editGrade } from '@/api/qm_charge_scorelist'
  import { Message, MessageBox } from 'element-ui'
  import { formatDateTime } from '@/utils/tools'

  export default {
    name: 'qm_charge_scorelist',
    data() {
      return {
        timeValue: '',
        pagination: {
          pageNo: null,
          pageSize: null,
          totalCount: null,
          totalPage: null
        },
        tableData: [],
        multipleSelection: [],
        formInline: {
          gradeName: '',
          modifierName: '',
          start_time: '',
          end_time: '',
          currentPage: 1
        },
        ruleForm: {
          gradeName: '',
          description: '',
          gradeTitles: [{
            titleName: '',
            gradeOptions: [{
              score: '',
              optionName: ''
            }]
          }]
        },
        ruleFormReverse: {
          gradeId: '',
          isDelete: '0',
          id: null,
          gradeName: '',
          description: '',
          gradeTitles: [{
            gradeId: '',
            id: null,
            isDelete: '0',
            titleId: '',
            titleName: '',
            gradeOptions: [{
              score: '',
              optionName: '',
              id: null,
              titleId: '',
              isDelete: '0'
            }]
          }]
        },
        ruleFormDetail: {
          gradeId: '',
          isDelete: '0',
          id: null,
          gradeName: '',
          description: '',
          gradeTitles: [{
            gradeId: '',
            id: null,
            isDelete: '0',
            titleId: '',
            titleName: '',
            gradeOptions: [{
              score: '',
              optionName: '',
              id: null,
              titleId: '',
              isDelete: '0'
            }]
          }]
        },
        dialogFormVisible: false,
        dialogFormVisibleReverse: false,
        dialogFormVisibleDetail: false
      }
    },
    mounted() {
      this.searchGrade({})
    },
    methods: {
      addReverse() {
        this.ruleFormReverse.gradeTitles.push({
          titleName: '',
          gradeOptions: [{
            score: '',
            optionName: ''
          }]
        })
      },
      addReverseChoice(index) {
        this.ruleFormReverse.gradeTitles[index].gradeOptions.push({
          score: '',
          optionName: ''
        })
      },
      add() {
        this.ruleForm.gradeTitles.push({
          titleName: '',
          gradeOptions: [{
            score: '',
            optionName: ''
          }]
        })
      },
      addChoice(index) {
        this.ruleForm.gradeTitles[index].gradeOptions.push({
          score: '',
          optionName: ''
        })
      },
      addGrade() {
        this.dialogFormVisible = true
      },
      handleDelete(row) {
        MessageBox.confirm('确定执行删除操作吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteGradeFormByGradeId({ 'gradeId': row.gradeId }).then(response => {
            if (response.data.code === 0) {
              this.searchGrade({})
            } else {
              Message({
                message: response.data.message,
                type: 'error',
                duration: 3 * 1000
              })
            }
          }).catch(error => {
            console.log(error)
          })
        })
      },
      removeReverse(index) {
        if (typeof this.ruleFormReverse.gradeTitles[index].id !== 'undefined') {
          var gradeId = this.ruleFormReverse.gradeTitles[index].gradeId
          var gradeOptions = this.ruleFormReverse.gradeTitles[index].gradeOptions
          var id = this.ruleFormReverse.gradeTitles[index].id
          var titleId = this.ruleFormReverse.gradeTitles[index].titleId
          var titleName = this.ruleFormReverse.gradeTitles[index].titleName
          this.ruleFormReverse.gradeTitles.splice(index, 1)
          this.ruleFormReverse.gradeTitles.push({
            'gradeId': gradeId,
            'gradeOptions': gradeOptions,
            'id': parseInt(id),
            'titleId': titleId,
            'titleName': titleName,
            'isDelete': '1'
          })
        } else {
          this.ruleFormReverse.gradeTitles.splice(index, 1)
        }
      },
      removeReverseChild(index1, index2) {
        if (typeof this.ruleFormReverse.gradeTitles[index1].gradeOptions[index2].id !== 'undefined') {
          var obj = this.ruleFormReverse.gradeTitles[index1].gradeOptions[index2]
          var id = obj.id
          var isDelete = '1'
          var optionName = obj.optionName
          var score = obj.score
          var titleId = obj.titleId
          this.ruleFormReverse.gradeTitles[index1].gradeOptions.splice(index2, 1)
          this.ruleFormReverse.gradeTitles[index1].gradeOptions.push({
            'id': id,
            'isDelete': isDelete,
            'optionName': optionName,
            'score': score,
            'titleId': titleId
          })
        } else {
          this.ruleFormReverse.gradeTitles[index1].gradeOptions.splice(index2, 1)
        }
      },
      remove(index) {
        this.ruleForm.gradeTitles.splice(index, 1)
      },
      removeChild(index1, index2) {
        this.ruleForm.gradeTitles[index1].gradeOptions.splice(index2, 1)
      },
      deleteAll() {
        const chk_box = this.multipleSelection.map(function(item, index) {
          return item.gradeId
        })
        MessageBox.confirm('确定执行批量操作吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteGradeFormByTeam({ 'chk_box': chk_box }).then(res => {
            if (res.data.code === 0) {
              this.searchGrade({})
            } else {
              Message({
                message: res.data.message,
                type: 'error',
                duration: 3 * 1000
              })
            }
          }).catch(err => {
            console.log(err)
          })
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          addGrade(this.ruleForm).then(response => {
            if (response.data.code === 0) {
              this.dialogFormVisible = false
              this.searchGrade({})
            } else {
              Message({
                message: response.data.message,
                type: 'error',
                duration: 3 * 1000
              })
            }
          }).catch(error => {
            console.log(error)
          })
        })
      },
      submitFormReverse(formName) {
        this.$refs[formName].validate((valid) => {
          editGrade(this.ruleFormReverse).then(response => {
            if (response.data.code === 0) {
              this.dialogFormVisibleReverse = false
              this.searchGrade({})
            } else {
              Message({
                message: response.data.message,
                type: 'error',
                duration: 3 * 1000
              })
            }
          }).catch(error => {
            console.log(error)
          })
        })
      },
      resetForm(formName) {
        this.ruleForm = {
          gradeName: '',
          description: '',
          gradeTitles: [{
            titleName: '',
            gradeOptions: [{
              score: '',
              optionName: ''
            }]
          }]
        }
      },
      resetFormReverse(formName) {
        this.ruleFormReverse = {
          gradeId: '',
          isDelete: '0',
          id: null,
          gradeName: '',
          description: '',
          gradeTitles: [{
            gradeId: '',
            id: null,
            isDelete: '0',
            titleId: '',
            titleName: '',
            gradeOptions: [{
              score: '',
              optionName: '',
              id: null,
              titleId: '',
              isDelete: '0'
            }]
          }]
        }
      },
      resetFormDetail(formName) {
        this.ruleFormDetail = {
          gradeId: '',
          isDelete: '0',
          id: null,
          gradeName: '',
          description: '',
          gradeTitles: [{
            gradeId: '',
            id: null,
            isDelete: '0',
            titleId: '',
            titleName: '',
            gradeOptions: [{
              score: '',
              optionName: '',
              id: null,
              titleId: '',
              isDelete: '0'
            }]
          }]
        }
      },
      reset() {
        this.timeValue = ''
        this.formInline = {
          gradeName: '',
          modifierName: '',
          start_time: '',
          end_time: '',
          currentPage: this.pagination.pageNo
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
        console.log(val)
      },
      handleClick(row) {
        this.dialogFormVisibleReverse = true
        getGradeByGradeId({ 'gradeId': row.gradeId }).then(response => {
          if (response.data.code === 0) {
            var data = response.data.data
            var gradeTitles = []
            for (var a = 0; a < data.gradeTitles.length; a++) {
              var obj = {}
              obj.gradeId = data.gradeTitles[a].gradeId
              obj.id = data.gradeTitles[a].id
              obj.isDelete = data.gradeTitles[a].isDelete
              obj.titleId = data.gradeTitles[a].titleId
              obj.titleName = data.gradeTitles[a].titleName

              var gradeOptions = []
              for (var i = 0; i < data.gradeTitles[a].gradeOptions.length; i++) {
                var gradeOption = {}
                gradeOption.id = data.gradeTitles[a].gradeOptions[i].id
                gradeOption.isDelete = data.gradeTitles[a].gradeOptions[i].isDelete
                gradeOption.optionName = data.gradeTitles[a].gradeOptions[i].optionName
                gradeOption.score = data.gradeTitles[a].gradeOptions[i].score
                gradeOption.titleId = data.gradeTitles[a].gradeOptions[i].titleId
                gradeOptions.push(gradeOption)
              }
              obj.gradeOptions = gradeOptions
              gradeTitles.push(obj)
            }

            this.ruleFormReverse = {
              gradeId: data.gradeId,
              isDelete: data.isDelete,
              id: data.id,
              gradeName: data.gradeName,
              description: data.description,
              gradeTitles: gradeTitles
            }
          } else {
            Message({
              message: '未能查到相应评分表信息，请稍后再试',
              type: 'error',
              duration: 3 * 1000
            })
          }
        })
      },
      handleClickDetail(row) {
        this.dialogFormVisibleDetail = true
        getGradeByGradeId({ 'gradeId': row.gradeId }).then(response => {
          if (response.data.code === 0) {
            var data = response.data.data
            var gradeTitles = []
            for (var a = 0; a < data.gradeTitles.length; a++) {
              var obj = {}
              obj.gradeId = data.gradeTitles[a].gradeId
              obj.id = data.gradeTitles[a].id
              obj.isDelete = data.gradeTitles[a].isDelete
              obj.titleId = data.gradeTitles[a].titleId
              obj.titleName = data.gradeTitles[a].titleName

              var gradeOptions = []
              for (var i = 0; i < data.gradeTitles[a].gradeOptions.length; i++) {
                var gradeOption = {}
                gradeOption.id = data.gradeTitles[a].gradeOptions[i].id
                gradeOption.isDelete = data.gradeTitles[a].gradeOptions[i].isDelete
                gradeOption.optionName = data.gradeTitles[a].gradeOptions[i].optionName
                gradeOption.score = data.gradeTitles[a].gradeOptions[i].score
                gradeOption.titleId = data.gradeTitles[a].gradeOptions[i].titleId
                gradeOptions.push(gradeOption)
              }
              obj.gradeOptions = gradeOptions
              gradeTitles.push(obj)
            }

            this.ruleFormDetail = {
              gradeId: data.gradeId,
              isDelete: data.isDelete,
              id: data.id,
              gradeName: data.gradeName,
              description: data.description,
              gradeTitles: gradeTitles
            }
          } else {
            Message({
              message: '未能查到相应评分表信息，请稍后再试',
              type: 'error',
              duration: 3 * 1000
            })
          }
        })
        // row已经包含了单个的数据
      },
      handleCurrentChange(val) {
        this.formInline.currentPage = val
        this.formInline.start_time = this.timeValue[0]
        this.formInline.end_time = this.timeValue[1]
        findAllGradeForm(this.formInline).then(response => {
          this.queryGrade(response)
        })
      },
      headerRow({ row, rowIndex }) {
        if (rowIndex === 0) {
          return 'color:black'
        } else {
          return ''
        }
      },
      queryGrade(res) {
        this.tableData = []
        this.pagination = res.data.pageInfo
        if (res.data.data && (res.data.data.length > 0)) {
          for (let i = 0; i <= res.data.data.length; i++) {
            if (res.data.data[i] && (res.data.data.length !== 0)) {
              var data = {}
              data.gradeId = res.data.data[i].gradeId
              data.gradeName = res.data.data[i].gradeName
              data.updateTime = formatDateTime(res.data.data[i].modifierTime)
              data.description = res.data.data[i].description
              data.modifier = res.data.data[i].modifierName
              this.tableData.push(data)
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
      searchGrade(req) {
        // 根据老版本的逻辑 查询只能传分页页码的第一页
        req.currentPage = 1
        req.gradeName = this.formInline.gradeName
        req.modifierName = this.formInline.modifierName
        req.start_time = this.timeValue[0]
        req.end_time = this.timeValue[1]
        findAllGradeForm(req).then(response => {
          this.queryGrade(response)
        })
      }
  
    }
  }
</script>
<style>
  .el-checkbox+.el-checkbox {
    margin-left: 0px;
  }
  .el-checkbox__label {
    padding-left: 0px;
  }
  .reverse{
    width: 70%;
  }
</style>
