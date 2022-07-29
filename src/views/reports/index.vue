<style lang="scss" scoped>
  #main {
    width: 100%;
    height: 500px
  }

  .box {
    width: 100%;
    height: 600px
  }

  .breadcrumb {
    margin: 10px 0
  }

</style>

<template>
  <div>
    <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div class="box">
        <div id="main" ref="main"></div>
      </div>
    </el-card>

  </div>
</template>
<script>
  import * as echarts from 'echarts';
  import {
    Echarts
  } from "../../http/https"
  export default {
    data() {
      return {
        myChart: null,
        // 公共数据
        predata: {
          title: {
            text: "用户来源"
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
        },
      }
    },
    methods: {
      render() {
        const chartDom = this.$refs.main
        this.myChart = echarts.init(chartDom)
        Echarts().then(res => {
          console.log(res);
          const data = res.data.data
          const op = {
            ...this.predata,
            ...data
          }
          this.myChart.setOption(op)
        })
      },
    },
    mounted() {
      this.render()
      window.addEventListener("resize", this.myChart.resize)
    },
 
  }

</script>
