<template>
<div class="product-container">
  <sticky :className="'sub-navbar '+postForm.status">
    <span style="float: left; margin-left: 20px" class="info"><i class="el-icon-menu"></i>  {{$route.meta.title}}</span>
    <el-button class="el-button--primary" @click="submitForm" v-loading="loading">发 布</el-button>
  </sticky>
  <el-form class="editor-content" :model="postForm" :rules="rules" ref="postForm">
    <div class="createPost-main-container">
      <el-row>
        <el-col :span="21">
          <el-form-item style="margin-bottom: 40px;" prop="name">
            <MDinput name="name" v-model="postForm.name" required :maxlength="100">
              标题
            </MDinput>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label-width="80px" label="产品分类:" class="postInfo-container-item">
            <el-select clearable v-model="postForm.category_id" placeholder="产品类别">
              <el-option v-for="item in categoryOptions" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="21">
          <el-form-item label-width="80px" class="uploader clearfix" label="封面图:" prop="image">
            <el-upload
              class="image-uploader"
              :action= domain
              :http-request = uploadImage
              :show-file-list="false"
              :before-upload="beforeUpload"
              v-loading="imageLoading">
              <div>
                <i class="el-icon-plus image-uploader-icon"></i>
                <div class="icon-text">添加封面图</div>
              </div>
            </el-upload>
            <div class="image-app-preview">
              <div class="image-preview-wrapper" v-show="postForm.image.length>1">
                <img :src="postForm.image">
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item prop="content">
        <tinymce :height="600" v-model="postForm.desc"></tinymce>
      </el-form-item>
    </div>
  </el-form>
</div>
</template>
<script>
import Tinymce from '@/components/Tinymce'
import Sticky from '@/components/Sticky'
import MDinput from '@/components/MDinput'
import { config, getToken, upload } from '@/api/qiniu'
import { getCategory, createProduct, getProductDetail, updateProduct} from "../../../api/keride";
import {resizeImage} from "../../../utils";

const defaultForm = {
  status: 'draft',
  name: '', // 产品名称
  desc: '', // 产品描述
  image: '', // 封面图
  id: undefined,
  category_id: undefined
}
export default {
  name: 'articleDetail',
  components: { Tinymce, Sticky, MDinput },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback()
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      domain: config.domain,
      rules: {
        name: [{ validator: validateRequire }],
        desc: [{ validator: validateRequire }]
      },
      loading: false,
      imageLoading: false,
      categoryOptions: []
    }
  },
  methods: {
    getCategoriesList() {
      getCategory().then(res => {
        this.categoryOptions = res.data.list
      })
    },
    uploadImage(req) {
      const token = this.$store.getters.token
      let fileType = req.file.name.replace(/.+\./, "").toLowerCase();
      const keyName = Date.now() + '.' + fileType
      this.imageLoading = true

      resizeImage(req.file, {width:480, quality:0.7, filename:keyName}).then(res => {
        console.log('压缩后大小', ((res.file.size / 1024 / 1024) * 100).toFixed(2) + 'kb')
        getToken(token).then(response => {
          const formData = new FormData()
          formData.append('token', response.data.token)
          formData.append('key', keyName)
          formData.append('file', res.file)
          upload(formData).then((res) => {
            this.postForm.image = 'http://' + config.qiniuaddr + '/' + res.data.key
            this.imageLoading = false
          })
        }).catch(err => {
          this.imageLoading = false
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
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.isEdit) {
            const id = this.$route.params && this.$route.params.id
            this.postForm.id = id
            updateProduct(this.postForm).then(res => {
              this.$notify({
                title: '成功',
                message: '产品添加成功',
                type: 'success',
                duration: 2000
              })
              this.postForm.status = 'published'
              this.loading = false
              this.$router.push({ name: 'productsList' })
            }).catch(err => {
              this.loading = false
            })
          } else {
            createProduct(this.postForm).then(res => {
              this.$notify({
                title: '成功',
                message: '产品添加成功',
                type: 'success',
                duration: 2000
              })
              this.postForm.status = 'published'
              this.loading = false
              this.$router.push({ name: 'productsList' })
            }).catch(err => {
              this.loading = false
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    beforeUpload (file) {
      // const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      // const isLt1M = file.size / 1024 / 1024 < 1
      // if (!isJPG) {
      //   this.$message.error('上传图片只能是 JPG/PNG 格式!')
      // }
      // if (!isLt1M) {
      //   this.$message.error('上传图片大小不能超过 1MB!')
      // }
      // return isJPG && isLt1M
    },

    fetchData(id) {
      getProductDetail(id).then(res => {
        this.postForm = res.data
        this.postForm.status = defaultForm.status
      })
    }
  },
  mounted() {
    this.getCategoriesList()
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }
  }
}
</script>
<style lang="scss" scoped>
.product-container {
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
        width: 180px;
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
