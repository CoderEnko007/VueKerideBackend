<template>
  <div class="app-container">
    <div class="filter-container clearfix">
      <h2 style="float: left; margin-left: 20px" class="info"><i class="el-icon-menu"></i>  {{$route.meta.title}}</h2>
      <div class="filter">
        <el-cascader filterable expand-trigger="hover" :options="categoryOptions" v-model="selectedOption" @change="handleFilter">
        </el-cascader>
        <el-button @click="handleCreate" type="primary" icon="el-icon-edit">增加产品分类</el-button>
      </div>
    </div>

    <el-table :data="list" v-loading="listLoading" element-loading-text="加载中..." border fit highlight-current-row>
      <!--<el-table-column width="65" align="center" label="序号" >-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{scope.row.id}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
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
      <el-table-column width="120" align="center" label="分类级别">
        <template slot-scope="scope">
          <span>{{scope.row.category_type.text}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" label="父级分类">
        <template slot-scope="scope">
          <span>{{scope.row.parent_category.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="95" align="center" label="总数">
        <template slot-scope="scope">
          <span v-show="scope.row.category_type.id === 2">{{scope.row.nums}}</span>
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
      <el-form :rules="rules" ref="dataForm" :model="categoryData" label-position="left" label-width="70px" style='width: 800px; margin-left:50px;'>
        <el-form-item label-width="120px" label="类别名" prop="name">
          <el-input v-model="categoryData.name"></el-input>
        </el-form-item>
        <el-form-item label-width="120px" label="父级类别名" class="postInfo-container-item">
          <el-select clearable v-model="categoryData.parent_category.id" placeholder="请选择">
            <el-option v-for="(item, index) in parentOptions" :key="index" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
          <span><strong><em>（若不选择父级类别则表示该新建类别为一级类别）</em></strong></span>
        </el-form-item>
        <el-form-item label-width="120px" label="描述信息">
          <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="Please input" v-model="categoryData.desc">
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
const defaultQuery = {
  category_type: null,
  parent_category: null
}
export default {
  data() {
    return {
      list: null,
      listLoading: true,
      // 对话框相关变量
      categoryData: {
        id: undefined,
        name: '',
        desc: '',
        parent_category: {
          id: null,
          name: null
        },
        nums: undefined
      },
      listQuery: Object.assign({}, defaultQuery),
      parentOptions: [],
      categoryOptions: [],
      selectedOption: ['0'],
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
    initCategoryOptions(list) {
      let options = [
        {value: '0', label: '全部分类'},
        {value: '1', label: '一级分类'},
        {value: '2', label: '二级分类', children: []}
      ]
      this.parentOptions = []
      list.map(v => {
        let temp = {}
        if (v.category_type.id === 1) {
          temp.value = v.id
          temp.label = v.name
          // temp.children = []
          options[2].children.push(temp)
          this.parentOptions.push(v)
        }
      })
      return options
    },
    getCategoriesList() {
      getCategory(this.listQuery).then(res => {
        this.list = res.data.list
        if (this.listQuery.category_type !== "2") {
          this.categoryOptions = this.initCategoryOptions(this.list)
        }
        this.listLoading = false
      }).catch(err => {
        this.listLoading = false
      })
    },
    handleUpdate(row) {
      console.log('aaa',row)
      this.categoryData = Object.assign({}, row)
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
        deleteCategory(row.id).then(res => {
          this.getCategoriesList()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        }).catch(err => {
          this.listLoading = false
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleCreate() {
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
            name: this.categoryData.name,
            desc: this.categoryData.desc,
            parent_category: this.categoryData.parent_category.id
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
            id: this.categoryData.id,
            name: this.categoryData.name,
            desc: this.categoryData.desc,
            parent_category: this.categoryData.parent_category.id
          }).then( res => {
            this.getCategoriesList()
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
    resetData() {
      this.categoryData = {
        id: undefined,
        name: '',
        desc: '',
        parent_category: {
          id: null,
          name: null
        },
        nums: undefined
      }
    },
    handleFilter() {
      // "0" 代表全部分类，不做条件过滤
      if (this.selectedOption[0] === "0") {
        this.listQuery = Object.assign({}, defaultQuery)
      } else {
        this.listQuery.category_type = this.selectedOption[0] // 表示分类的级别，一级或者二级分类
        this.listQuery.parent_category = this.selectedOption[1]?this.selectedOption[1]:null //selectedOption[1]表示父级分类,若为null则为一级分类
      }
      this.getCategoriesList()
    }
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
    .filter {
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
