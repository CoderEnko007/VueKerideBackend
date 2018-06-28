<template>
  <div class="app-container">
    <div class="filter-container clearfix">
      <h2 style="float: left; margin-left: 20px" class="info"><i class="el-icon-menu"></i>  {{$route.meta.title}}</h2>
      <el-button class="add-btn" @click="handleCreate" type="primary" icon="el-icon-edit">添加联系方式</el-button>
    </div>

    <el-table :data="contactList" v-loading="listLoading" element-loading-text="加载中..." border fit highlight-current-row>
      <el-table-column width="65" align="center" label="序号" >
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200" align="center" label="名称" >
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150" align="left" label="地址">
        <template slot-scope="scope">
          <span>{{scope.row.address}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200" align="center" label="联系电话" >
        <template slot-scope="scope">
          <span>{{scope.row.phone}}</span>
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
      <el-form :rules="rules" ref="dataForm" :model="postForm" label-position="left" label-width="90px" style='width: 800px; margin-left:50px;'>
        <el-form-item label="名称" prop="name">
          <el-input v-model="postForm.name"></el-input>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="详细地址" v-model="postForm.address">
          </el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="纬度" prop="latitude">
              <el-input v-model="postForm.latitude" style="width: 200px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经度" prop="longitude">
              <el-input v-model="postForm.longitude" style="width: 200px;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="联系电话" prop="phone" :rules="[{ type: 'number', message: '格式错误'}]">
          <el-input v-model.number="postForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="postForm.email"></el-input>
        </el-form-item>
        <el-form-item label="传真" prop="fax" :rules="[{ type: 'number', message: '格式错误'}]">
          <el-input v-model.number="postForm.fax"></el-input>
        </el-form-item>
        <el-form-item label="邮政编码" prop="zipcode">
          <el-input v-model="postForm.zipcode"></el-input>
        </el-form-item>
        <p><em><a href="http://api.map.baidu.com/lbsapi/getpoint/index.html">（注：经纬度请点击这里查看）</a></em></p>
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
import {isEmail, isValidPost} from "../../utils";
import {getContacts, addContacts, updateContacts, deleteContacts} from "../../api/keride";

const defaultData = {
  id: undefined,
  name: '',
  latitude: null,
  longitude: null,
  address: null,
  phone: null,
  email: null,
  fax: null,
  zipcode: null
}
export default {
  data() {
    const validateLatitude = (rule, value, callback) => {
      // 纬度范围-90~90，经度范围-180~180
      if (value && value>=-90 && value<=90) {
        callback()
      } else {
        callback(new Error('请输入-90~90的数字'));
      }
    };
    const validateLongitude = (rule, value, callback) => {
      // 纬度范围-90~90，经度范围-180~180
      if (value && value>=-180 && value<=180) {
        callback()
      } else {
        callback(new Error('请输入-180~180的数字'));
      }
    };
    const validateEmail = (rule, value, callback) => {
      if (value && !isEmail(value)) {
        callback(new Error('邮箱格式不正确'));
      } else {
        callback();
      }
    };
    const validateZipcode = (rule, value, callback) => {
      console.log(value)
      if (value && !isValidPost(value)) {
        callback(new Error('邮编格式不正确'));
      } else {
        callback();
      }
    }
    return {
      contactList: null,
      listLoading: false,
      postForm: Object.assign({}, defaultData),
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新建'
      },
      rules: {
        name: [{ required: true, message: '请填写名称', trigger: 'blur' }],
        latitude: [{ required: true, message: '该字段不能为空' }, { validator: validateLatitude, trigger: 'blur' }],
        longitude: [{ required: true, message: '该字段不能为空' }, { validator: validateLongitude, trigger: 'blur' }],
        address: [{ required: true, message: '请填写详细地址', trigger: 'blur' }],
        email: [{ validator: validateEmail }],
        zipcode: [{ validator: validateZipcode }],
      },
    }
  },
  methods: {
    getContactsList() {
      getContacts().then(res => {
        this.contactList = res.data
        this.listLoading = false
      }).catch(err => {
        this.listLoading = false
      })
    },
    handleCreate() {
      this.postForm = Object.assign({}, defaultData)
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          addContacts(this.postForm).then(res => {
            this.getContactsList()
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
          updateContacts(this.postForm).then( res => {
            this.getContactsList()
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
    handleUpdate(row) {
      this.postForm = Object.assign({}, row)
      this.postForm.phone = Number(this.postForm.phone)
      this.postForm.fax = Number(this.postForm.fax)
      this.postForm.zipcode = Number(this.postForm.zipcode)
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
        deleteContacts(row.id).then(res => {
          this.getContactsList()
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
    }
  },
  mounted() {
    this.getContactsList()
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
