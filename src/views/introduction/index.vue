<template>
<div class="intro-container">
  <sticky :className="'sub-navbar '+postForm.status">
    <span style="float: left; margin-left: 20px" class="info"><i class="el-icon-menu"></i>  {{$route.meta.title}}</span>
    <el-button class="el-button--primary" @click="submitForm" v-loading="loading">保 存</el-button>
  </sticky>
  <el-form class="editor-content" :model="postForm" :rules="rules" ref="postForm">
    <el-form-item class="uploader clearfix" prop="imageUrl">
      <el-upload
        class="image-uploader"
        :action= domain
        :http-request = uploadImage
        :show-file-list="false"
        :before-upload="beforeUpload">
        <div>
          <i class="el-icon-plus image-uploader-icon"></i>
          <div class="icon-text">添加背景图</div>
        </div>
      </el-upload>
      <div class="image-app-preview">
        <div class="image-preview-wrapper" v-show="postForm.imageUrl.length>1">
          <img :src="postForm.imageUrl">
        </div>
      </div>
    </el-form-item>
    <el-form-item prop="content">
      <tinymce :height="600" v-model="postForm.content"></tinymce>
    </el-form-item>
  </el-form>
</div>
</template>
<script>
import { getIntro, updateIntro } from '../../api/keride'
import Tinymce from '@/components/Tinymce'
import Sticky from '@/components/Sticky'
import { config, getToken, upload } from '@/api/qiniu'
import {resizeImage} from "../../utils";

const defaultForm = {
  status: 'draft',
  content: '', // 文章内容
  imageUrl: '', // 背景图片
}

export default {
  name: 'introduction',
  components: { Tinymce, Sticky },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(null)
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      domain: config.domain,
      rules: {
        content: [{ validator: validateRequire }],
        imageUrl: [{ validator: validateRequire }]
      },
      loading: false
    }
  },
  methods: {
    fetchData() {
      getIntro().then(res => {
        this.postForm.content = res.data.text
        this.postForm.imageUrl = res.data.image
      }).catch(err => {
        console.log(err)
      })
    },
    beforeUpload (file) {
      // const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      // const isLt2M = file.size / 1024 / 1024 < 2
      // const isLt500K = file.size / 1024 < 500
      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
      // }
      // if (!isLt500K) {
      //   this.$message.error('上传头像图片大小不能超过 500kb!')
      // }
      // return isJPG && isLt500K
    },
    uploadImage(req) {
      const token = this.$store.getters.token
      let fileType = req.file.name.replace(/.+\./, "").toLowerCase();
      const keyName = Date.now() + '.' + fileType

      resizeImage(req.file, {width:480, quality:0.7, filename:keyName}).then(res => {
        console.log('压缩后大小', ((res.file.size/1024/1024)*100).toFixed(2)+'kb')
        getToken(token).then(response => {
          console.log(response)
          const formData = new FormData()
          formData.append('token', response.data.token)
          formData.append('key', keyName)
          formData.append('file', res.file)
          upload(formData).then((res) => {
            this.postForm.imageUrl = 'http://' + config.qiniuaddr + '/' + res.data.key
            console.log(this.postForm.imageUrl)
          }).catch(err => {
            console.log(err)
            this.$message({
              message:'图片上传失败',
              type: 'error'
            })
          })
        })
      }).catch(err => {
        console.log(err)
        this.$message({
          message:'图片压缩失败',
          type: 'error'
        })
      })
    },
    submitForm() {
      console.log('submitForm')
      this.$refs.postForm.validate(valid => {
        console.log('submitForm',valid)
        if (valid) {
          this.loading = true
          updateIntro({
            text: this.postForm.content,
            image: this.postForm.imageUrl
          }).then(res => {
            console.log(res)
            this.$notify({
              title: '成功',
              message: '发布文章成功',
              type: 'success',
              duration: 2000
            })
            this.postForm.status = 'published'
            this.loading = false
          }).catch(err => {
            console.log('error submit!!')
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  mounted() {
    this.fetchData()
  }
}
</script>
<style lang="scss" scoped>
.intro-container {
  .editor-content {
    margin: 30px 50px;
    .uploader {
      margin-bottom: 20px;
      .image-uploader {
        height: 180px;
        width: 180px;
        border: 1px dashed black;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        float: left;
        margin-right: 50px;
        margin-bottom: 10px;
        .image-uploader-icon {
          font-size: 28px;
          color: #8c939d;
          width: 178px;
          margin-top: 50%;
          transform: translateY(-50%);
          text-align: center;
        }
        .icon-text {
          font-size: 28px;
          color: #8c939d;
          width: 178px;
        }
      }
      .image-uploader:hover {
        border-color: #409EFF;
      }
      .image-app-preview {
        width: 320px;
        height: 180px;
        position: relative;
        border: 1px dashed #d9d9d9;
        float: left;
        margin-bottom: 10px;
        .image-preview-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}

</style>
