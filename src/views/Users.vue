<style lang="scss" scoped>
  .user {
    width: 100%
  }

  .users_box {
    width: 100%;
    border: 1px solid #eee;
    background-color: #fff;
    box-sizing: border-box;
    padding: 20px;
  }

  .breadcrumb {
    margin: 10px 0;
  }

  .input-with-select {
    width: 300px;
  }

  .tab {
    margin-top: 20px
  }

</style>

<template>
  <div class="user">
    <!-- 面包靴 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="users_box">
      <!-- 搜索框 -->
      <el-input placeholder="请输入内容" v-model="page.query" @clear="render" clearable class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="render"></el-button>
      </el-input>
      <el-button type="primary" @click="show">添加用户</el-button>
      <!-- 表格 -->
      <el-table class="tab" :data="tableData" border style="width: 100%">
        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column prop="username" label="姓名" width="150">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="150">
        </el-table-column>
        <el-table-column prop="mobile" label="电话" width="120">
        </el-table-column>
        <el-table-column prop="role_name" label="角色" width="300">
        </el-table-column>
        <el-table-column prop="mg_state" label="状态" width="120">
          <template slot-scope="scope">
            <el-switch @change="change(scope.row.id,scope.row.mg_state)" v-model="scope.row.mg_state"
              active-color="#13ce66" inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="300">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="emit(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="del(scope.row.id)"></el-button>
            <el-button type="warning" icon="el-icon-setting" @click="set(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.pagenum"
        :page-sizes="[2, 5, 10, 15]" :page-size="page.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <!-- 添加用户对话框 -->
      <el-dialog title="添加用户'" :visible.sync="dialogVisible" width="50%">
        <!-- from输入框 -->
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="ruleForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="ruleForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="ruleForm.email"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="ruleForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="add('ruleForm')">确 定</el-button>
          <el-button type="primary" @click="emitOk()">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑用户的弹框 -->
      <el-dialog title="编辑用户'" :visible.sync="dialogVisible3" width="50%">
        <!-- from输入框 -->
        <el-form :model="ruleForm2" :rules="rules" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="ruleForm2.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="ruleForm2.email"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="ruleForm2.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="emitOk('ruleForm2')">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配权限的弹出 -->
      <el-dialog title="分配角色" :visible.sync="dialogVisible2" width="50%">
        <p>
          <span>当前用户：</span>
          <span>{{user.username}}</span>
        </p>
        <p>
          <span>当前角色：</span>
          <span>{{user.role_name}}</span>
        </p>
        <p>
          分配新角色：
          <el-select v-model="newRole" placeholder="请选择">
            <el-option v-for="(item,i) in rolesList" :key="i" :label="item.roleName" :value="item.id"></el-option>
          </el-select>
        </p>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="setOk()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import {
    getUsers,
    addUsers,
    changeStatus,
    emit,
    del,
    setRole,
    getRid
  } from "../http/https"
  export default {
    data() {
      const emailCheck = (rule, value, callback) => {
        let reg = /^\w+@[a-z0-9]+.[a-z]{2,4}$/
        if (!reg.test(value)) {
          callback(new Error("请输入正确邮箱格式"))
        } else {
          callback()
        }
      }
      const mobileCheck = (rule, value, callback) => {
        let reg = /^1[3456789]\d{9}$/
        if (!reg.test(value)) {
          callback(new Error("请输入正确的手机号"))
        } else {
          callback()
        }
      }
      return {
        flag: true,
        dialogVisible2: false,
        dialogVisible3: false,
        tableData: [],
        total: 0,
        ruleForm2: {
          username: "",
          email: "",
          mobile: "",
        },
        page: {
          pagenum: 1,
          pagesize: 10,
          query: ""
        },
        dialogVisible: false,
        id: "",
        // 验证
        ruleForm: {
          username: "",
          password: "",
          email: "",
          mobile: "",
        },
        rolesList: [],
        newRole: "",
        user: {


        },
        rules: {
          username: [{
            required: true,
            message: '请输入用户名称',
            trigger: 'blur'
          }, {
            min: 3,
            max: 5,
            message: '长度在 3 到 5 个字符',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }, ],
          mobile: [{
            required: true,
            message: '请输入电话号',
            trigger: 'blur'
          }, {
            validator: mobileCheck,
            trigger: "blur"
          }],
          email: [{
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          }, {
            validator: emailCheck,
            trigger: "blur"
          }]
        }
      }
    },
    methods: {
      search(){

        let time=setTimeout(()=>{
          this.render()
          
        },1000)
      },
      setOk() {
        //  console.log(this.newRole);
        this.dialogVisible2 = false
        let data = {
          id: this.user.id,
          rid: this.newRole
        }
        console.log(data);
        setRole(data)
        this.render()
      },
      set(e) {
        this.dialogVisible2 = true
        this.user = e
        // console.log(this.user);
        getRid().then(res => {
          this.rolesList = res.data.data
        })
      },
      del(id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          del(id).then(res => {
            // console.log(res);
            this.render()
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });


      },
      emitOk(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data = {
              id: this.id,
              email: this.ruleForm2.email,
              mobile: this.ruleForm2.mobile
            }
            emit(data).then(res => {
              this.render()
            })

            this.dialogVisible3 = false
            // alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });


      },
      emit(e) {
        console.log(e);
        this.dialogVisible3 = true
        this.ruleForm2 = e
        this.id = e.id

      },
      show() {
        this.dialogVisible = !this.dialogVisible
        this.flag = true
        this.ruleForm.username = ""
        this.ruleForm.password = ""
        this.ruleForm.mobile = ""
        this.ruleForm.email = ""
      },
      change(id, status) {
        let data = {
          id: id,
          mg_state: status
        }
        changeStatus(data)
      },
      add(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            addUsers(this.ruleForm).then(res => {
              console.log(res);
              if (res.data.meta.status == 201) {
                this.$message({
                  message: res.data.meta.msg,
                  type: 'success'
                });
              } else {
                this.$message.error(res.data.meta.msg);
              }
              this.render()
            })
            this.dialogVisible = false
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },
      handleSizeChange(e) {
        //    console.log(e);
        this.page.pagesize = e
        this.render()
      },
      handleCurrentChange(e) {
        this.page.pagenum = e
        this.render()
      },
      render() {
        getUsers(this.page).then(res => {
          //   console.log(res);
          this.tableData = res.data.data.users
          this.total = res.data.data.total
        })

      }
    },
    created() {
      this.render()
    }
  }

</script>
