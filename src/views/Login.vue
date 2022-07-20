<style lang="scss" scoped>
  .login {
    width: 100%;
    background-color: #2e4a65;
    height: 100%
  }

  .login_box {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 500px;
    height: 300px;
    background-color: #fff;

    .img {
      width: 80px;
      height: 80px;
      border: 10px solid #eee;
      border-radius: 50px;
      margin-top: -10%;
      margin-left: 40%;
      background-color: pink;
    }
  }

  .input {
    box-sizing: border-box;
    padding: 30px
  }

  .buts {
    display: flex;
    justify-content: end
  }

</style>

<template>
  <div class="login">
    <div class="login_box">
      <img src="../assets/logo.png" alt="" class="img">
      <div class="input">
        <el-form ref="ruleForm" class="demo-ruleForm" :model="ruleForm" :rules="rules" label-width="80px">
          <el-form-item label="名称" prop="name">
            <el-input prefix-icon="iconfont icon-yonghu" v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pass">
            <el-input prefix-icon="iconfont icon-mima" type="password" v-model="ruleForm.pass"></el-input>
          </el-form-item>
        </el-form>
        <div class="buts">
          <el-button type="primary" @click="login('ruleForm')">登录</el-button>
          <el-button type="info">重置</el-button>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
  import {
    LoginApi
  } from "../http/https"
  export default {
    data() {
      return {
        ruleForm: {
          name: "",
          pass: ""
        },
        rules: {
          name: [{
              required: true,
              message: '请输入用户名称',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 5,
              message: '长度在 3 到 5 个字符',
              trigger: 'blur'
            }
          ],
          pass: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      login(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data={
                username:this.ruleForm.name,
                password:this.ruleForm.pass
            }
            LoginApi(data).then(res => {
            //   console.log(res);
            this.$router.push("/wel")
            })
          } else {
            console.log('登录失败!!')
            return false
          }
        })

      }
    },
  }

</script>
