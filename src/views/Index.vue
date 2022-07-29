<style lang="scss" scoped>
  .el-header,
  .el-footer {
    background-color: #373d41;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    // height: calc(100vh - 30px) !important
  }

  .el-container,
  .is-vertical,
  .one,
  .el-menu-vertical-demo {
    // height: 100%;
    height: calc(100vh - 52px) !important 
  }

  .title {
    padding: 0 !important
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    height: 100%
  }

  .sp1 {
    box-sizing: border-box;
    padding-left: 70px !important
  }

  // .el-menu-vertical-demo{
  //   padding-left: 0
  // }

  // .aside{
  //   height: calc( 100vh - 16px )
  // }

</style>

<template>
  <div class="one">
    <!-- 布局容器 -->
    <el-container>
      <el-header>
        <p>公司logo</p>
        <p>企业后台管理系统</p>
        <p>
          <el-button type="warning" @click="back">登出</el-button>
        </p>
      </el-header>
      <el-container>
        <el-aside class="aside" :width="isCollapse==false?'220px':'60px'">
          <!-- 侧边栏 -->
          <p class="el-icon-s-operation" @click="isCollapse=!isCollapse"></p>
          <el-menu :collapse="isCollapse" :default-active="active" class="el-menu-vertical-demo"
            background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" router>
            <el-submenu :index="item.path" v-for="(item,i) in leftList" :key="i">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span class="title">{{item.authName}}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item :index="ele.path" v-for="(ele,index) in item.children" :key="index" class="sp1">
                  {{ele.authName}}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
  import {
    Getmenus
  } from "../http/https"
  export default {
    data() {
      return {
        leftList: [],
        isCollapse: false,
        active: ""
      }
    },
    watch: {
      $route: {
        deep: true,
        immediate: true,
        handler(oval, nval) {
          // console.log(oval.matched[1].name);
          this.active = oval.matched[1].name
        }
      }
    },
    methods: {
      render() {
        const token = sessionStorage.getItem("token")
        Getmenus(token).then(res => {
          console.log(res);
          this.leftList = res.data.data
        })
      },
      back() {
        sessionStorage.removeItem("token")
        this.$router.push("/login")
      }
    },
    created() {
      this.render()
    },
  }

</script>
