<template>
  <div class="app-container">
    <div class="filter-container clearfix">
      <h2 style="float: left; margin-left: 20px" class="info"><i class="el-icon-menu"></i>  {{$route.meta.title}}</h2>
      <el-button class="add-btn" @click="handleCreate" type="primary" icon="el-icon-edit">添加首页轮播图</el-button>
    </div>

    <el-table :data="list" v-loading="listLoading" element-loading-text="加载中..." border fit highlight-current-row>
      <el-table-column width="65" align="center" label="序号" >
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200" align="center" label="对应产品" >
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.product.name}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="200" align="left" label="轮播图" >
        <template slot-scope="scope">
          <span>{{scope.row.image}}</span>
        </template>
      </el-table-column>
      <el-table-column width="220" align="center" label="轮播顺序（数值越大越靠前）" >
        <template slot-scope="scope">
          <span>{{scope.row.index}}</span>
        </template>
      </el-table-column>

      <el-table-column width="200" align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="postForm" label-position="left" label-width="70px" style='width: 800px; margin-left:50px;'>
        <el-form-item label="轮播产品">
          <el-select v-model="postForm.product_id" filterable placeholder="请选择">
            <el-option
              v-for="item in productsList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="轮播顺序" prop="index">
          <el-input v-model.number="postForm.index" type="number" placeholder="数值越大显示越靠前（默认为0）"></el-input>
        </el-form-item>
        <el-form-item label="轮播图" class="uploader clearfix" prop="image">
          <el-upload
            class="image-uploader"
            :action= domain
            :http-request = uploadImage
            :show-file-list="false"
            :before-upload="beforeUpload"
            v-loading="imageLoading">
            <div>
              <i class="el-icon-plus image-uploader-icon"></i>
              <div class="icon-text">添加轮播图</div>
            </div>
          </el-upload>
          <div class="image-app-preview">
            <div class="image-preview-wrapper" v-show="postForm.image.length>1">
              <img :src="postForm.image">
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus==='create'" type="primary" @click="createData">确认</el-button>
        <el-button v-else type="primary" @click="updateData">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getBanners, getProducts, addBanner, updateBanner, deleteBanner } from "../../api/keride";
import { config, getToken, upload } from '@/api/qiniu'
import {resizeImage} from "../../utils";

const defaultQueryForm = {
  page: 1,
  pageSize: 10000,
  name: undefined,
  product_id: undefined,
  sort: 'asc'
}

export default {
  data() {
    const validateNumber = (rule, value, callback) => {
      if (!Number.isInteger(value)) {
        callback(new Error('请输入数字值'));
      } else {
        callback();
      }
    };
    return {
      list: [],
      listLoading: true,
      imageLoading: false,
      queryForm: Object.assign({}, defaultQueryForm),
      domain: config.domain,
      productsList: null,
      postForm: {
        id: undefined,
        product_id: undefined,
        image: '',
        index: 0,
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新建'
      },
      rules: {
        index: [{ validator: validateNumber, trigger: 'blur' }]
      },
    }
  },
  methods: {
    beforeUpload (file) {
      // const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      // const isLt2M = file.size / 1024 / 1024 < 2
      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
      // }
      // if (!isLt2M) {
      //   this.$message.error('上传头像图片大小不能超过 2MB!')
      // }
      // return isJPG && isLt2M
    },
    uploadImage(req) {
      const token = this.$store.getters.token
      const fileType = req.file.name.replace(/.+\./, "").toLowerCase();
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
          console.log(err)
        })
      }).catch(err => {
        console.log(err)
        this.$message({
          message:'图片压缩失败',
          type: 'error'
        })
      })
    },

    initBannerList() {
      getBanners().then(res => {
        this.list = res.data
        this.listLoading = false
      }).catch(err => {
        this.listLoading = false
      })
    },
    getProductsList() {
      getProducts(this.queryForm).then(res => {
        this.productsList = res.data.list
      })
    },
    resetForm() {
      this.postForm = {
        id: undefined,
        product_id: undefined,
        image: '',
        index: 0,
      }
    },
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.postForm = Object.assign({}, {
        id: row.id,
        product_id: row.product.id,
        image: row.image,
        index: row.index,
      })
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row) {
      this.listLoading = true
      deleteBanner(row.id).then(res => {
        this.initBannerList()
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      }).catch(err => {
        this.$notify({
          title: '失败',
          message: '删除失败',
          type: 'warning',
          duration: 2000
        })
        this.listLoading = false
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          addBanner(this.postForm).then(res => {
            this.initBannerList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          }).catch(err => {
            this.listLoading = false
            this.$notify({
              title: '失败',
              message: '创建失败',
              type: 'warning',
              duration: 2000
            })
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          updateBanner(this.postForm).then(res => {
            this.initBannerList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          }).catch(err => {
            this.listLoading = false
            this.$notify({
              title: '失败',
              message: '更新失败',
              type: 'warning',
              duration: 2000
            })
          })
        }
      })
    },
  },
  mounted() {
    this.initBannerList()
    this.getProductsList()
  }
}
</script>
<style lang="scss" scoped>
  .app-container {
    padding-top: 0;
    .filter-container {
      position: relative;
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      .add-btn {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
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
    .cell span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>
