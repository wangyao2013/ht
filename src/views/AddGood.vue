<style lang="scss" scoped>
  .breadcrumb {
    margin: 10px 0;
  }

  .steps {
    padding: 5px 20px
  }
  ::v-deep .editor{
    height: 200px;
  }
.add{
  margin-top: 90px
}
</style>

<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/users' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/addGood' }">商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-alert class="alert" center title="添加商品的信息" type="info">
      </el-alert>
      <!-- 步骤条 -->
      <el-steps class="steps" align-center :active="active" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 左侧导航 -->
      <el-tabs v-model="activeName" :before-leave="beforeleave" tab-position="left">
        <el-tab-pane label="基本信息" name="1">
          <!-- 带验证的表格 -->
          <el-form label-position="top" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="ruleForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="ruleForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="ruleForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input type="number" v-model="ruleForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader @change="change" class="cascader" :props="{value:'cat_id',label:'cat_name'}"
                v-model="ruleForm.goods_cat" :options="options"></el-cascader>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name=2>
          <el-form label-position="top" label-width="55px">
            <el-form-item v-for="(item, index) in myList" :key="index" :label="item.attr_name">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border v-for="(ele, index) in item.attr_vals" :key="index" :label="ele"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name=3>
          <el-form label-position="top" label-width="80px">
            <el-form-item v-for="item in olList" :key="item.attr_id" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="4">
          <!-- 上传图片 -->
          <el-upload action="http://www.ysqorz.top:8888/api/private/v1/upload" list-type="picture-card"
            :on-preview="handlePictureCardPreview" :on-success="headerSuccess" :headers="header"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="5">
          <quill-editor class="editor"   v-model="goods_introduce"  />
          <el-button @click="add" class="add">上传</el-button>
        </el-tab-pane>
      </el-tabs>

    </el-card>

  </div>
</template>
<script>
  import {
    addGoods,
    Getcategories1,
    attributes

  } from "../http/https"
  export default {
    data() {

      return {
        olList: [],
        checkList: [],
        header: {
          Authorization: window.sessionStorage.getItem('token')
        },
     
        // 添加信息数据
        formInline: {
          contentFileList: ""
        },
        // 上传图片
        dialogImageUrl: '',
        dialogVisible: false,
        // 联机选择器
        options: [],
        // props:{
        //     label:cat_name
        // },
        activeName: '1',
        cat: {
          type: [1]
        },
        active: 0,
        // 表单验证数据
        ruleForm: {
          goods_name: "",
          goods_number: "",
          goods_price: "",
          goods_weight: "",
          goods_cat: "",

        },
        goods_introduce: "",
        pics: {},
        attrs: [],

        // 验证
        rules: {
          goods_name: [{
            required: true,
            message: '请输入商品名称',
            trigger: 'blur'
          }],
          goods_number: [{
            required: true,
            message: '请输入商品数量',
            trigger: 'blur'
          }],
          goods_price: [{
            required: true,
            message: '请输入商品价格',
            trigger: 'blur'
          }],
          goods_weight: [{
            required: true,
            message: '请输入商品重量',
            trigger: 'blur'
          }],
          goods_cat: [{
            required: true,
            message: '请输入商品分类',
            trigger: 'change'
          }]
        },
        val: "",
        // 参数sel
        sel: "",
        id: "",
        myList: [],
        // 参数
        attr_vals: [],
        arr2:[]
      }
    },
    methods: {
      // 富文本添加图片
      // 图片上传成功的钩子函数
      headerSuccess(val) {
        console.log(val);
        this.pics = {
          pic: val.data.tmp_path
        }
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      // 上传图片
      add() {
        console.log(this.ruleForm);
        const data = {
          ...this.ruleForm,
          goods_introduce: this.goods_introduce,
          pics: this.pics,
          attrs: [...this.myList, ...this.olList]
        }
        console.log(data);
        addGoods(data).then(res => {
          console.log(res);
        })
        this.$router.push("/goods")
      },
      change(e) {
        this.id = e[2]
        console.log(this.id);
        this.arr2=e
        this.ruleForm.goods_cat = e.join(",")
      },
      // 点击侧边栏触发
      beforeleave(to, from) {
        let flag = false
        for (const i in this.ruleForm) {
          if (this.ruleForm[i] === "") {
            flag = true
          }
        }
        if(this.arr2.length!=3){
          this.$message.error('需要选择三级分类');
          return false
        }
        if (flag === false) {
          // 根据要去的下表判断sel的状态
          if (to == 2) {
            this.sel = "many"
            const data = {
              id: this.id,
              sel: this.sel
            }
            console.log(data);
            attributes(data).then(res => {
              res.data.data.forEach((item) => {
                item.attr_vals = item.attr_vals.length > 0 ? item.attr_vals.split(',') : []
              })
              this.myList = res.data.data
              console.log(this.myList);
            })
          } else if (to == 3) {
            this.sel = "only"
            const data = {
              id: this.id,
              sel: this.sel
            }
            console.log(data);
            attributes(data).then(res => {
              this.olList = res.data.data
            })
          }
          this.active = Number(to - 1)
          return true
        } else {
          this.$message.error('内容不能为空');
          return false
        }

      },
      render() {
        Getcategories1(this.cat).then(res => {
          console.log(res);
          this.options = res.data.data
        })

      }
    },
    created() {
      this.render()
    },
  }
</script>
