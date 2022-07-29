<style lang="scss" scoped>
  .breadcrumb {
    margin: 10px 0;
  }

  .input-with-select {
    width: 300px
  }
  .cascader{
    width: 100%
  }

</style>

<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/' }">订单管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/' }">订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 搜索框 -->
      <el-input placeholder="请输入内容" clearable @clear="search" v-model="page.query" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
      <!-- 表格 -->
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" label="#" width="50">
        </el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="120">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="120">
        </el-table-column>
        <el-table-column prop="order_pay" label="订单状态" width="120">
          <template slot-scope="scope">
            <el-tag type="success" v-show="scope.row.order_pay==1">支付宝</el-tag>
            <el-tag type="danger" v-show="scope.row.order_pay==0">未支付</el-tag>
            <el-tag type="warning" v-show="scope.row.order_pay==2">银行卡</el-tag>
          </template>

        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="120">
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="120">
          <template slot-scope="scope">
            {{scope.row.create_time|data}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="primary"  @click="emit" icon="el-icon-edit"></el-button>
            <el-button type="success" @click="handleClick(scope.row.order_id)" icon="el-icon-setting"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 查看物流的弹出框 -->
      <el-dialog title="物流" class="dialog" :visible.sync="dialogVisible" width="50%">
        <el-timeline :reverse="reverse">
          <el-timeline-item :color="activity.color" :icon="activity.icon" v-for="(activity, index) in activities" :key="index" :timestamp="activity.timestamp">
            {{activity.content}}
          </el-timeline-item>
        </el-timeline>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分页 -->
      <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="page.pagenum" :page-sizes="[2, 5, 10, 15]" :page-size="page.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
      <!-- 编辑的弹出框 -->
      <el-dialog title="修改地址" :visible.sync="dialogVisibleEmit" width="40%">
        <!-- 级联选择器 -->
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="省市区/县">
            <el-cascader class="cascader" v-model="form.city" :options="options" :props="{ expandTrigger: 'hover' }"
              @change="handleChange">
            </el-cascader>
          </el-form-item>
           <el-form-item label="详细地址">
            <el-input v-model="form.Address"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleEmit = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisibleEmit = false">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  import addres from '@/assets/city_data2017_element'
  import {
    getOrders,
    kuaidi
  } from "../../http/https"
  export default {
    data() {
      return {
        page: {
          query: "",
          pagenum: 1,
          pagesize: 10,
        },
        val: "",
        tableData: [],
        dialogVisibleEmit: false,
        // 级联选择器数据绑定
        city: [],
        form: {
         Address:"",
         city:[]
        },
         options: [],

        total: 0,
        dialogVisible: false,
        order_id: "",
        reverse: false,
        activities: [{
            "timestamp": "2018-05-10 09:39:00",
            "content": "已签收,感谢使用顺丰,期待再次为您服务",
            "location": "",
            "icon":"el-icon-check",
            "color":"#0bbd87"
          },
          {
            "timestamp": "2018-05-10 08:23:00",
            "content": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
            "location": ""
          },
          {
            "timestamp": "2018-05-10 07:32:00",
            "content": "快件到达 [北京海淀育新小区营业点]",
            "location": ""
          },
          {
            "timestamp": "2018-05-10 02:03:00",
            "content": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
            "location": ""
          },
          {
            "timestamp": "2018-05-09 23:05:00",
            "content": "快件到达 [北京顺义集散中心]",
            "location": ""
          },
          {
            "timestamp": "2018-05-09 21:21:00",
            "content": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
            "location": ""
          },
          {
            "timestamp": "2018-05-09 13:07:00",
            "content": "顺丰速运 已收取快件",
            "location": ""
          },
          {
            "timestamp": "2018-05-09 12:25:03",
            "content": "卖家发货",
            "location": ""
          },
          {
            "timestamp": "2018-05-09 12:22:24",
            "content": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
            "location": ""
          },
          {
            "timestamp": "2018-05-08 21:36:04",
            "content": "商品已经下单",
            "location": ""
          }
        ]
      }
    },
    methods: {
      // 级联选择器事件
      handleChange() {

      },
      // 编辑
      emit() {
        this.dialogVisibleEmit = true
      },
      // 物流信息
      handleClick(e) {

        this.dialogVisible = true
      },
      search() {
        // this.render()
        getOrders(this.page).then(res => {
          console.log(res);
          this.tableData = res.data.data.goods.filter(item => {
            return item.order_number.includes(this.page.query)
          })
          this.total = res.data.data.total
        })
        // this.tableData = this.tableData
      },
      handleSizeChange(e) {
        this.page.pagesize = e
        this.render()
      },
      handleCurrentChange(e) {
        this.page.pagenum = e
        this.render()
      },
      render() {
        getOrders(this.page).then(res => {
          console.log(res);
          this.tableData = res.data.data.goods
          this.total = res.data.data.total
        })
        this.options = addres
        // console.log(addres);
      },
    },
    created() {
      this.render()
    }
  }

</script>
