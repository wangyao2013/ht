<style lang="scss" scoped>
  .breadcrumb {
    margin: 10px 0
  }

  .top {
    margin: auto;
    width: 100%;
    align-items: center;
    display: flex;
    text-align: center
  }

  .tag {
    margin: 0 5px
  }

  .input-new-tag {
    width: 110px
  }

</style>

<template>
  <div>
    <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/users' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/addGood' }">商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon>
      </el-alert>
      <div class="top">
        <p>请选择商品分类：</p>
        <el-cascader @change="change" class="cascader" :props="{value:'cat_id',label:'cat_name'}" v-model="goods_cat"
          :options="list"></el-cascader>
      </div>
      <!-- 标签页 -->
      <el-tabs v-model="activeName" :before-leave="change2">
        <el-tab-pane label="动态参数" name="1">
          <el-button @click="dialogVisible=!dialogVisible" :disabled="dis">添加动态参数</el-button>
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <div>
                  <!-- tag标签  -->
                  <el-row>
                    <el-tag class="tag" :key="i" v-for="(item,i) in scope.row.attr_vals" closable
                      :disable-transitions="false" @close="handleClose(i,scope.row)">
                      {{item}}
                    </el-tag>
                    <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                      ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)">
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                    </el-button>
                  </el-row>
                </div>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#">
            </el-table-column>
            <el-table-column prop="attr_name" label="参数名称" width="800">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="300">
              <template slot-scope="scope">
                <el-button type="warning" size="small" @click="emit(scope.row)">编辑</el-button>
                <el-button @click="del(scope.row.attr_id)" type="danger" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="2">
          <el-button @click="dialogVisible=!dialogVisible">添加静态参数</el-button>
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <div>
                  <!-- tag标签  -->
                  <el-row>
                    <el-tag class="tag" :key="i" v-for="(item,i) in scope.row.attr_vals" closable
                      :disable-transitions="false" @close="handleClose(i,scope.row)">
                      {{item}}
                    </el-tag>
                    <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                      ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)">
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                    </el-button>
                  </el-row>
                </div>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#">
            </el-table-column>
            <el-table-column prop="attr_name" label="参数名称" width="800">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="300">
              <template slot-scope="scope">
                <el-button type="warning" size="small" @click="emit(scope.row)">编辑</el-button>
                <el-button @click="del(scope.row.attr_id)" type="danger" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

      </el-tabs>
      <!-- 添加参数的弹出框 -->
      <el-dialog title="添加" :visible.sync="dialogVisible" width="50%">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="参数名称" prop="attr_name">
            <el-input v-model="ruleForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="add('ruleForm')">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑参数的弹出框 -->
      <el-dialog title="编辑" :visible.sync="dialogVisible2" width="50%">
        <el-form :model="ruleFormEmit" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="参数名称" prop="attr_name">
            <el-input v-model="ruleFormEmit.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="emitOk('ruleForm')">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
  import {
    Getcategories,
    attributes,
    addcategories,
    delCategories,
    emitParameter
  } from "../http/https"
  export default {
    data() {
      return {
        list: [],
        inputValue: "",
        inputVisible: false,
        goods_cat: "",
        dis: true,
        activeName: "1",
        tableData: [],
        sel: "many",
        dialogVisible: false,
        dialogVisible2: false,
        ruleForm: {
          attr_name: ""

        },
        ruleFormEmit: {
          attr_name: "",
          attrId: "",
          attr_vals: ""
        },
        id: "",

        rules: {
          attr_name: [{
            required: true,
            message: '请输入参数名称',
            trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      // 编辑

      emit(e) {
        console.log(e);
        this.dialogVisible2 = true
        this.ruleFormEmit.attrId = e.attr_id
        this.ruleFormEmit.attr_name = e.attr_name
        this.ruleFormEmit.attr_vals = e.attr_vals
      },
      emitOk() {

        const data = {
          id: this.id,
          attrId: this.ruleFormEmit.attrId,
          attr_sel: this.sel,
          attr_name: this.ruleFormEmit.attr_name,
          attr_vals: this.ruleFormEmit.attr_vals.join(",")
        }
        // console.log(data);
        emitParameter(data).then(res => {
          this.packageFunction()
        })
        this.dialogVisible2 = false
      },
      // 点击关闭
      handleClose(index, e) {
        // console.log(row);
        e.attr_vals.splice(index, 1)
        const data = {
          id: this.id,
          attrId: e.attr_id,
          attr_name: e.attr_name,
          attr_sel: this.sel,
          attr_vals: this.sel == "many" ? e.attr_vals.join(",") : e.attr_vals
        }
        // console.log(data);
        emitParameter(data)
      },
      // 点击添加按钮触发
      showInput(row) {
        row.inputVisible = true
        console.log(row);
        //等待dom加载更新完成时才对dom进行操作
        this.$nextTick((_) => {
          // console.log(this.$refs.saveTagInput.$refs.input);
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },
      // 回车和点击触发添加
      handleInputConfirm(e) {
        // console.log(e);
        let val = e.inputValue
        if (val.trim().length !== 0) {
          e.attr_vals.push(val)
          const data = {
            id: this.id,
            attrId: e.attr_id,
            attr_name: e.attr_name,
            attr_sel: this.sel,
            attr_vals: e.attr_vals.join(",")
          }
          console.log(data);
          emitParameter(data)
        }
        e.inputValue = ""
        e.inputVisible = false
      },
      change2(to, from) {
        console.log(to, from);
        if (to == 2 && this.goods_cat == "") {
          this.$message.error('请选择三级分类');
          return false
        } else {
          if (to == 1) {
            this.sel = "many"
            this.packageFunction()
          } else {
            this.sel = "only"
            this.packageFunction()
          }
        }
      },
      del(a) {
        console.log(a);
        const data = {
          id: this.id,
          attrid: a
        }
        delCategories(data).then(res => {
          this.packageFunction()
        })
      },
      add(formName) {
        if (this.goods_cat == "") {
          this.$message.error('请选择三级分类后添加');
          return false
        } else {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.dialogVisible = false
              const data = {
                id: this.id,
                attr_name: this.ruleForm.attr_name,
                attr_sel: this.sel
              }
              addcategories(data).then(res => {
                this.packageFunction()
              })
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        }

      },
      async render() {
        await Getcategories().then(res => {
          console.log(res);

          this.list = res.data.data
        })

      },
      // 封装请求函数
      packageFunction() {
        const obj = {
          id: this.id,
          sel: this.sel
        }
        attributes(obj).then(res => {
          res.data.data.forEach(item => {
            item.attr_vals = item.attr_vals.length > 0 ? item.attr_vals.split(",") : []
            item.inputValue = ""
            item.inputVisible = false
          })
          this.tableData = res.data.data
        })
      },
      change(e) {
        if (e.length === 3) {
          this.dis = false
          console.log(e[2]);
          this.id = e[2]
          this.packageFunction()

        } else {
          this.dis = true
          this.goods_cat = ""
          console.log(this.goods_cat);
          this.$message.error('需要选择三级分类！');
        }
      }
    },
    created() {
      this.render()
    }
  }

</script>
