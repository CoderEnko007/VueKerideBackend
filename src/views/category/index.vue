<template>
  <div class="app-container">
    <div class="filter-container clearfix">
      <h2 style="float: left; margin-left: 20px" class="info"><i class="el-icon-menu"></i>  {{$route.meta.title}}</h2>
      <el-button class="add-btn" @click="handleCreate" type="primary" icon="el-icon-edit">增加产品分类</el-button>
    </div>

    <el-table :data="list" v-loading="listLoading" element-loading-text="加载中..." border fit highlight-current-row>
      <el-table-column width="65" align="center" label="序号" >
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200" align="center" label="类别名称">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150" align="left" label="描述">
        <template slot-scope="scope">
          <span>{{scope.row.desc}}</span>
        </template>
      </el-table-column>
      <el-table-column width="95" align="center" label="总数">
        <template slot-scope="scope">
          <span>{{scope.row.nums}}</span>
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
      <el-form :rules="rules" ref="dataForm" :model="data" label-position="left" label-width="70px" style='width: 800px; margin-left:50px;'>
        <el-form-item label="类别名" prop="name">
          <el-input v-model="data.name"></el-input>
        </el-form-item>
        <el-form-item label="描述信息">
          <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="Please input" v-model="data.desc">
          </el-input>
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
import {getCategory, createCategory, updateCategory, deleteCategory} from "../../api/keride";

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      // 对话框相关变量
      data: {
        id: undefined,
        name: '',
        desc: '',
        nums: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新建'
      },
      rules: {
        name: [{ required: true, message: '请填写类别名', trigger: 'blur' }],
      },
    }
  },
  methods: {
    getCategoriesList() {
      getCategory().then(res => {
        this.list = res.data.list
        this.listLoading = false
      }).catch(err => {
        this.listLoading = false
      })
    },
    handleUpdate(row) {
      this.data = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row) {
      this.listLoading = true
      deleteCategory(row.id).then(res => {
        this.getCategoriesList()
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleCreate(row) {
      this.resetData()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          createCategory({
            name: this.data.name,
            desc: this.data.desc
          }).then(res => {
            // this.list.unshift(this.data)
            this.getCategoriesList()
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
          updateCategory({
            id: this.data.id,
            name: this.data.name,
            desc: this.data.desc
          }).then( res => {
            this.getCategoriesList()
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
              message: '更新失败',
              type: 'warning',
              duration: 2000
            })
          })
        }
      })
    },
    resetData() {
      this.data = {
        id: undefined,
        name: '',
        desc: '',
        nums: undefined
      }
    },
  },
  mounted() {
    this.getCategoriesList()
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
  .cell span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
