<template>
  <div class="app-container">
    <div class="filter-container clearfix">
      <h2 style="float: left; margin-left: 20px" class="info"><i class="el-icon-menu"></i>  {{$route.meta.title}}</h2>
      <el-button class="add-btn" @click="handleCreate" type="primary" icon="el-icon-edit">添加</el-button>
    </div>

    <el-table :data="pageList" v-loading="listLoading" element-loading-text="加载中..." border fit highlight-current-row>
      <!--<el-table-column width="65" align="center" label="序号" >-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{scope.row.id}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column width="200" align="center" label="名称">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200" align="center" label="类别">
        <template slot-scope="scope">
          <span>{{scope.row.type.text}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150" align="left" label="图片">
        <template slot-scope="scope">
          <span>{{scope.row.image}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200" align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @current-change="handleCurrentChange" :current-page="currentPage"
                     :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="postForm" label-position="left" label-width="70px" style='max-width: 800px; margin-left:50px; margin-right: 50px;'>
        <el-form-item label="名称" prop="name">
          <el-input v-model="postForm.name"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="name">
          <el-radio v-model="postForm.type" :label=PARTNER_STYLE[0].key>{{PARTNER_STYLE[0].text}}</el-radio>
          <el-radio v-model="postForm.type" :label=PARTNER_STYLE[1].key>{{PARTNER_STYLE[1].text}}</el-radio>
        </el-form-item>
        <el-form-item label="图片" class="uploader clearfix" prop="image">
          <el-upload
            class="image-uploader"
            :action= domain
            :http-request = uploadImage
            :show-file-list="false"
            :before-upload="beforeUpload"
            v-loading="imageLoading">
            <div>
              <i class="el-icon-plus image-uploader-icon"></i>
              <div class="icon-text">添加图片</div>
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
import {getPartner, addPartner, deletePartner, updatePartner} from "../../api/keride";
import { config, getToken, upload } from '@/api/qiniu'
import {resizeImage} from "../../utils";

const defaultData = {
  id: undefined,
  name: '',
  image: '',
  type: 1
}
export default {
  data() {
    return {
      list: null,
      listLoading: false,
      imageLoading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新建'
      },
      postForm: Object.assign({}, defaultData),
      PARTNER_STYLE: [
        {key: 1, text: '代理品牌'},
        {key: 2, text: '工业客户'}
      ],
      domain: config.domain,
      rules: {
        image: [{ required: true, message: '请添加图片' }]
      },
      pageList: null,
      currentPage: 1,
      pageSize: 8,
      total: 0
    }
  },
  methods: {
    initListByPage(list) {
      let start = (this.currentPage-1)*this.pageSize
      let end = start + this.pageSize
      return list.slice(start, end)
    },
    getPartnerList() {
      getPartner().then(res => {
        this.list = res.data
        this.total = res.data.length
        this.pageList = this.initListByPage(this.list)
        console.log('aaa', this.pageList)
        this.listLoading = false
      }).catch(err => {
        this.listLoading = false
      })
    },
    handleCreate() {
      this.postForm = Object.assign({}, defaultData)
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.postForm = Object.assign({}, {
        id: row.id,
        name: row.name,
        image: row.image,
        type: row.type.key
      })
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        deletePartner(row.id).then(res => {
          this.getPartnerList()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

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

    createData() {
      this.$refs['dataForm'].validate((valid => {
        if (valid) {
          this.listLoading = true
          addPartner(this.postForm).then(res => {
            this.getPartnerList()
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
      }))
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          updatePartner(this.postForm).then(res => {
            this.getPartnerList()
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
    handleCurrentChange(val) {
      this.currentPage = val
      // let start = (this.currentPage-1)*this.pageSize
      // let end = start + this.pageSize
      // this.list = this.list.slice(start, end)
      this.pageList = this.initListByPage(this.list)
    }
  },
  mounted() {
    this.getPartnerList()
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
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: auto;
            height: auto;
            max-width: 100%;
            max-height: 100%;
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
