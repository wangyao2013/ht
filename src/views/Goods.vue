<style lang="scss" scoped>
  h1 {
    text-align: center
  }

  .input-with-select {
    width: 300px
  }

  .breadcrumb {
    margin: 10px 0
  }

  .tab {
    margin-top: 20px
  }

</style>

<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/users' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索输入框 -->
    <el-card class="box-card">
      <el-input clearable @clear="render" placeholder="请输入内容" v-model="page.query" class="input-with-select">
        <el-button slot="append" @click="render" icon="el-icon-search"></el-button>
      </el-input>
      <el-button type="primary" @click="$router.push('/addGood')">添加商品</el-button>
      <!-- 表格 -->
      <el-table :data="tableData" border style="width: 100%" class="tab">
        <el-table-column type="index" width="100">
        </el-table-column>
        <el-table-column prop="goods_name" label="商品姓名" width="300">
        </el-table-column>
        <el-table-column prop="goods_number" label="商品数量" width="150">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width="150">
        </el-table-column>
        <el-table-column  label="创建时间" width="250">
          <template slot-scope="scope">
            {{scope.row.add_time|data}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small">编辑</el-button>
            <el-button type="text" size="small" @click="del(scope.row.goods_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.pagenum"
        :page-sizes="[2, 5, 10, 15]" :page-size="page.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
  import {
    getGoods,
    delGoods
  } from "../http/https"
  export default {
    data() {
      return {
        page: {
          query: "",
          pagenum: 1,
          pagesize: 10
        },
        total: 0,
        tableData: []
      }
    },
    methods: {
      handleSizeChange(e) {
        // console.log(e);
        this.page.pagesize = e
        this.render()
      },
      async del(id) {
        // console.log(id);
        await delGoods(id)
        this.render()
      },
      handleCurrentChange(e) {
        this.page.pagenum = e
        this.render()
      },
      render() {
        getGoods(this.page).then(res => {
          console.log(res);
          this.tableData = res.data.data.goods
          this.total = res.data.data.total
        })
      }
    },
    created() {
      this.render()
    }
  }

</script>
