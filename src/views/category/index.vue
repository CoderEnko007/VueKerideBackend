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
  </div>
</template>
<script>
import {getCategory} from "../../api/keride";

export default {
  data() {
    return {
      list: null,
      listLoading: true
    }
  },
  methods: {
    getCategoriesList() {
      getCategory().then(res => {
        this.list = res.data.list
        this.listLoading = false
        console.log(this.list)
      })
    },
    handleUpdate(row) {
      console.log(row)
    },
    handleDelete(row) {
      console.log(row)
    },
    handleCreate(row) {
      console.log(row)
    }
  },
  mounted() {
    this.getCategoriesList()
    console.log(this.$route.meta.title)
  }
}
</script>
<style lang="scss" scoped>
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
</style>
