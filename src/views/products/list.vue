<template>
  <div class="app-container">
    <div class="filter-container clearfix">
      <h2 style="float: left; margin-left: 20px" class="info"><i class="el-icon-menu"></i>  {{$route.meta.title}}</h2>
      <div class="filter">
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;" placeholder="产品名称" v-model="listQuery.name"/>
        <el-select clearable style="width: 130px" v-model="listQuery.category_id" placeholder="产品类别">
          <el-option v-for="item in  categoryOptions" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <el-select @change='handleFilter' style="width: 140px" v-model="listQuery.sort">
          <el-option v-for="(item, index) in sortOptions" :key="index" :label="item.label" :value="item.key">
          </el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="handleReset">重置</el-button>
        <el-button type="primary" icon="el-icon-edit" @click="handleCreate">添加产品</el-button>
      </div>
    </div>

    <el-table :data="productsList" v-loading="listLoading" element-loading-text="加载中..." border fit highlight-current-row>
      <el-table-column width="65" align="center" label="序号" >
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200" align="center" label="产品名称" >
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row.id)">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200" align="center" label="产品类别" >
        <template slot-scope="scope">
          <span>{{scope.row.category.name}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="300" align="left" label="产品描述" >
        <template slot-scope="scope">
          <span>{{scope.row.desc}}</span>
        </template>
      </el-table-column>
      <el-table-column width="95" align="center" label="点击数" >
        <template slot-scope="scope">
          <span>{{scope.row.click_nums}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200" align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
                     :page-size="listQuery.pageSize" layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { getCategory, getProducts, deleteProduct } from "../../api/keride";

const defaultList = {
  page: 1,
  pageSize: 10,
  name: undefined,
  category_id: undefined,
  sort: 'asc'
}
export default {
  data() {
    return {
      productsList: null,
      listLoading: true,
      listQuery: Object.assign({}, defaultList),
      sortOptions: [{ label: '+创建时间', key: 'asc' }, { label: '-创建时间', key: 'desc' }],
      categoryOptions: [],
      total: 0
    }
  },
  methods: {
    getCategoriesList() {
      getCategory().then(res => {
        this.categoryOptions = res.data.list
        this.categoryOptions.unshift({
          id: 0,
          name: '全部'
        })
        this.listLoading = false
      })
    },
    getProductsList() {
      this.listLoading = true
      if (this.listQuery.category_id === 0) {
        this.listQuery.category_id = undefined
      }
      getProducts(this.listQuery).then(res => {
        this.productsList = res.data.list
        this.total = res.data.count
        for (let index in this.productsList) {
          if (this.productsList.hasOwnProperty(index)) {
            this.productsList[index].desc = this.productsList[index].desc.replace(/<[^>]*>|/g,"");
          }
        }
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getProductsList()
    },
    handleReset() {
      this.listQuery = Object.assign({}, defaultList)
      this.getProductsList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getProductsList()
    },
    handleCreate() {
      this.$router.push({ name: 'createProduct'})
    },
    handleUpdate(id) {
      this.$router.push({ name: 'editProduct', params: {id: id}})
    },
    handleDelete(id) {
      deleteProduct(id).then(res => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.getProductsList()
      })
    }
  },
  mounted() {
    this.getCategoriesList()
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
