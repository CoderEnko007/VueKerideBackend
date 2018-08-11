<template>
  <div class="app-container">
    <div class="filter-container clearfix">
      <h2 style="float: left; margin-left: 20px" class="info"><i class="el-icon-menu"></i>  {{$route.meta.title}}</h2>
      <div class="filter">
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;" placeholder="新闻标题" v-model="listQuery.title"/>
        <el-select @change='handleFilter' style="width: 140px" v-model="listQuery.sort">
          <el-option v-for="(item, index) in sortOptions" :key="index" :label="item.label" :value="item.key">
          </el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="handleReset">重置</el-button>
        <el-button type="primary" icon="el-icon-edit" @click="handleCreate">添加新闻动态</el-button>
      </div>
    </div>

    <el-table :data="newsList" v-loading="listLoading" element-loading-text="加载中..." border fit highlight-current-row>
      <!--<el-table-column width="65" align="center" label="序号" >-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{scope.row.id}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column width="200" align="center" label="新闻标题" >
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row.id)">{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="300" align="left" label="新闻内容" >
        <template slot-scope="scope">
          <span>{{scope.row.desc}}</span>
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
import { getNews, deleteNews } from "@/api/keride";
import { strDisCode } from "@/utils";

const defaultList = {
  page: 1,
  pageSize: 10,
  title: undefined,
  sort: 'asc'
}

export default {
  data() {
    return {
      msg: this.$route.name,
      sortOptions: [{ label: '+创建时间', key: 'asc' }, { label: '-创建时间', key: 'desc' }],
      listQuery: Object.assign({}, defaultList),
      listLoading: false,
      newsList: null,
      total: 0,
    }
  },
  methods: {
    getNewsList() {
      this.listLoading = true
      getNews(this.listQuery).then(res => {
        this.listLoading = false
        this.newsList = res.data.list
        this.total = res.data.count
        for (let index in this.newsList) {
          if (this.newsList.hasOwnProperty(index)) {
            let desc = this.newsList[index].desc.replace(/<[^>]*>|/g,""); //去除HTML tag
            desc = desc.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
            desc = desc.replace(/&nbsp;/ig,'');//去掉&nbsp;
            desc = desc.replace(/\s/g,''); //将空格去掉
            this.newsList[index].desc = strDisCode(desc)
          }
        }
      }).catch(err => {
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getNewsList()
    },
    handleReset() {
      this.listQuery = Object.assign({}, defaultList)
      this.getNewsList()
    },
    handleCreate() {
      this.$router.push({name: 'addNews'})
    },
    handleUpdate(id) {
      this.$router.push({ name: 'editNews', params: {id: id}})
    },
    handleDelete(id) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteNews(id).then(res => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.getNewsList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleSizeChange(val) {
      console.log(val)
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getNewsList()
    },
  },
  mounted() {
    this.getNewsList()
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
