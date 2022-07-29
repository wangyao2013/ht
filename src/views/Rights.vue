<style lang="scss" scoped>
.breadcrumb{
    margin: 10px 0
}
</style>

<template>
  <div>
    <!-- 权限页 -->
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/users' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/rights' }">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 表格 -->
      <el-table  :data="tableData" style="width: 100%">
        <el-table-column type="index" width="150">
        </el-table-column>
        <el-table-column prop="authName" label="权限名称" width="250">
        </el-table-column>
        <el-table-column prop="path" label="路径" width="250">
        </el-table-column>
        <el-table-column prop="level" label="权限等级" width="250">
            <template slot-scope="scope">
                <el-tag v-show="scope.row.level=='0'">一级</el-tag>
                <el-tag  v-show="scope.row.level=='1'" type="success">二级</el-tag>
                <el-tag v-show="scope.row.level=='2'" type="info">三级</el-tag>
            </template>
        </el-table-column>
      </el-table>
    </el-card>

  </div>
</template>
<script>
  import {
    getRightList
  } from "../http/https"
  export default {
    data() {
      return {

        tableData: []
      }
    },
    methods: {
      render() {
        getRightList().then(res=>{
            console.log(res);
            this.tableData = res.data.data
        })
      }
    },
    created() {
      this.render()
    },
  }

</script>
