<template>
  <div class="setting container">
    <el-form label-width="100px" size="small" :model="req" ref="changeForm">
      <el-form-item :inline='true' label="修改系统logo" prop="logo" style="width:487px;">
        <el-upload
          ref="upload"
          action="http://119.27.179.175:8111/linntestportal/themeandcolor/upload"
          :headers="{'Authorization':'Bearer ' +token}"
          :on-success="uploadSuccess"
          :before-upload="beforeUpload"
          :file-list="fileList"
          :auto-upload="false">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload()">上传</el-button> -->
          <div slot="tip" class="el-upload__tip">上传文件只能是 jpg,jpeg,gif,png,bmp图片，大小不能超过500KB</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="修改系统名称" prop="title" style="width:487px;">
        <el-input v-model="req.title" size="small" placeholder="请输入修改内容" maxlength="100"></el-input>
      </el-form-item>
      <el-form-item label="修改系统主题" prop="theme">
        <span v-if="req.theme">所选主题为：{{themeInfo}}</span>
      </el-form-item>
    </el-form>
    <el-row>
      <div style="max-height:50vh;background:#F8F8F8;">
        <div v-for="(item,index) in logo" style="width:14%;display:inline-block;margin:15px 15px; 0 15px;">
          <img :key="index" :src="item" :class="themeItem+index" class="themeItem" @click="choiceTheme(index)">
          <div style="text-align:center">{{'主题 '+(index+1)}}</div>
        </div>
      </div>
    </el-row>
    <el-button style="margin-top:10px;" size="small" type="primary" @click="submitUpload()">提交</el-button>
  </div>
</template>

<script>
import { modifyTheme } from '@/api/theme'
export default {
  name: 'theme',
  data() {
    return {
      token: localStorage.getItem('Admin-Token'),
      file: {},
      fileList: [],
      themeVisible: false,
      themeInfoShow: false,
      themeItem: 'themeItem',
      themeInfo: '',
      loading: {},
      req: {
        title: '',
        theme: '',
        logo: ''
      },
      logo: [
        '../../../static/images/theme1.png',
        '../../../static/images/theme2.png'
      ],
      uploadData: {
        url: '',
        title: '',
        type: 0
      }
    }
  },
  methods: {
    // loading
    openFullScreen() {
      this.loading = this.$loading({
        lock: true,
        text: '切换主题中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      // setTimeout(() => {
      //   this.loading.close()
      // }, 3000)
    },
    changeTheme(req) {
      modifyTheme(req).then(response => {
        if (response.data.code === 0) {
          localStorage.setItem('themeInfo', JSON.stringify(response.data.data))
          this.themeCommand()
          this.changeTitle()
          this.$store.commit('SET_LOGO', JSON.parse(localStorage.getItem('themeInfo')).logo)
        }
      })
    },
    choiceTheme(index) {
      if ($('.themeItem' + index).hasClass('active')) {
        $('.themeItem').removeClass('active')
        this.req.theme = ''
      } else {
        $('.themeItem').removeClass('active')
        $('.themeItem' + index).addClass('active')
        this.themeInfo = '主题' + (index + 1)
        this.req.theme = 'theme' + (index + 1)
      }
    },
    // 修改title
    changeTitle() {
      const val = JSON.parse(localStorage.getItem('themeInfo'))
      document.title = val.title
    },
    // 主题切换
    themeCommand() {
      const val = JSON.parse(localStorage.getItem('themeInfo'))
      if (val) {
        this.$message.success('切换主题成功')
        $('body').removeClass('theme1')
        $('body').removeClass('theme2')
        $('body').addClass(val.theme)
        setTimeout(() => {
          this.loading.close()
        }, 1000)
      } else {
        this.$message.error('切换主题失败')
      }
    },
    // 上传
    // 验证上传文件的格式及大小
    beforeUpload(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      this.file = file
      const extension = testmsg.toLowerCase() === 'jpg'
      const extension2 = testmsg.toLowerCase() === 'jpeg'
      const extension3 = testmsg.toLowerCase() === 'gif'
      const extension4 = testmsg.toLowerCase() === 'png'
      const extension5 = testmsg.toLowerCase() === 'bmp'
      const isLt2M = file.size / 1024 / 1024 < 0.5
      if (!extension && !extension2 && !extension3 && !extension4 && !extension5) {
        this.$message({
          message: '上传文件只能是(jpg,jpeg,gif,png,bmp)图片!',
          type: 'warning'
        })
      }
      if (!isLt2M) {
        this.$message({
          message: '上传文件大小不能超过 500KB!',
          type: 'warning'
        })
      }
      if ((extension || extension2 || extension3 || extension4 || extension5) && isLt2M) {
        this.openFullScreen()
      }
      return (extension || extension2 || extension3 || extension4 || extension5) && isLt2M
    },
    submitUpload() {
      if (this.$refs.upload.uploadFiles.length === 1) {
        this.$refs.upload.submit()
        if (this.req.title || this.req.theme) {
          this.changeTheme(this.req)
        }
      } else if (this.$refs.upload.uploadFiles.length > 1) {
        this.clearUpload('upload')
        this.$message({
          message: '一次只能上传一张图片!',
          type: 'warning'
        })
      } else if (this.req.title || this.req.theme) {
        this.changeTheme(this.req)
      }
    },
    uploadSuccess(response, file, fileList) {
      if (response.code === 0) {
        this.$message.success(response.message)
        this.uploadVisible = false
        this.$refs.upload.uploadFiles.length = 0
        console.log('上传成功')
        this.$set(this.req, 'logo', 'data:image/png;base64,' + response.base64)
        this.changeTheme(this.req)
      }
    },
    // 清空上传列表
    clearUpload(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].clearFiles()
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  // .setting .el-input .el-input__inner {
  //   width:299px !important;
  // }
  .setting .el-input{
    width:299px !important;
  }
  
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  .themeItem{
    cursor: pointer;
    width:100%;
    height:100%;
    display:block;
    border:3px solid transparent;
    box-sizing:border-box;
  }
  .themeItem:hover{
    transition:box-shadow .5s;
    box-shadow: 0px 0px 5px 2px #409EFF;
  }
  .themeItem.active{
    border:3px solid #409EFF;
    box-sizing:border-box;
  }
</style>
