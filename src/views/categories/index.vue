<style lang="scss" scoped>
  .breadcrumb {
    margin: 10px 0;
  }

  i {
    color: #90ee90;
  }

  .pagination {
    text-align: center
  }

</style>
<style>
  .el-radio {
    margin-right: 0;
    width: 70%;
    position: absolute;
  }

  .el-radio__inner {
    display: none
  }

</style>
<style>
  .el-input__inner {
    width: 100%
  }

</style>

<template>
  <div>
    <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/categories' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="add">添加分类</el-button>
      <zk-table ref="table" index-text="#" :data="list" :columns="columns" :stripe="props.stripe" :border="props.border"
        :show-header="props.showHeader" :show-summary="props.showSummary" :show-row-hover="props.showRowHover"
        :show-index="props.showIndex" :tree-type="props.treeType" :is-fold="props.isFold"
        :expand-type="props.expandType" :selection-type="props.selectionType">
        <template slot="isOk" slot-scope="scope">
          <i v-show="scope.row.cat_deleted==true" class="el-icon-success"></i>
          <i v-show="scope.row.cat_deleted==false" class="el-icon-error"></i>
        </template>
        <template slot="level" slot-scope="scope">
          <el-tag v-show="scope.row.cat_level==0">一级</el-tag>
          <el-tag v-show="scope.row.cat_level==1" type="success">二级</el-tag>
          <el-tag v-show="scope.row.cat_level==2" type="warning">三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click="emit(scope.row)">编辑</el-button>
          <el-button type="danger" @click="del(scope.row)" icon="el-icon-delete">删除</el-button>
        </template>
      </zk-table>
      <!-- 分页 -->
      <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="page.pagenum" :page-sizes="[2, 5, 10, 15]" :page-size="page.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>

    </el-card>
    <!-- 添加商品分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="dialogVisible" width="40%">
      <el-form :model="from" label-position="left" label-width="100px">
        <el-form-item label="分类名称">
          <el-input v-model="from.cat_name">
          </el-input>
        </el-form-item>
        <el-form-item label="分类层级">
          <el-cascader ref="cascader" v-model="arr" :options="options"
            :props="{expandTrigger: 'hover',checkStrictly:true, label:'cat_name',value:'cat_id'}"
            @change="handleChange">
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">重置</el-button>
        <el-button type="primary" @click="ok">立即创建</el-button>
      </span>
    </el-dialog>
    <!-- 编辑的弹出框 -->

    <el-dialog title="编辑分类" :visible.sync="emitVisible">
      <el-form :model="emitForm">
        <el-form-item label="分类名称">
          <el-input v-model="emitForm.cat_name" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="emitVisible = false">取 消</el-button>
        <el-button type="primary" @click="emitAdd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    Getcategories,
    AddCategory,
    delcategories,
    emitCate
  } from "../../http/https"
  export default {
    data() {
      return {
        // 编辑的内容
        emitForm: {
          cat_name: "",
          cat_id: ""
        },
        emitVisible: false,
        // 级联选择器
        options: [],
        arr: [],

        // 添加分类弹框
        dialogVisible: false,
        from: {
          cat_pid: "",
          cat_name: "",
          cat_level: ""
        },
        // 分页
        page: {

          pagenum: 1,
          pagesize: 5
        },
        page2: {
          type: 2
        },

        total: 0,
        props: {
          stripe: true, // 是否显示间隔斑马纹
          border: true, // 是否显示纵向边框
          showHeader: true, // 是否显示表头
          showSummary: false, // 是否显示表尾合计行
          showRowHover: true, // 鼠标悬停时，是否高亮当前行
          showIndex: true, // 是否显示数据索引
          treeType: true, // 是否为树形表格
          isFold: true, // 树形表格中父级是否默认折叠
          expandType: false, // 是否为展开行类型表格（为 True 时，需要添加名称为 '$expand' 的作用域插槽, 它可以获取到 row, rowIndex)
          selectionType: false, // 是否为多选类型表格
        },
        list: [],

        columns: [{
            label: '分类名称', // 列标题名称
            prop: 'cat_name', // 对应列内容的属性名
          },
          {
            label: '是否有效',
            type: "template",
            template: "isOk",
            prop: "cat_deleted"
          },
          {
            label: '分类等级',
            type: "template",
            template: "level",
            prop: "cat_level"
          },
          {
            label: '操作',
            type: "template",
            template: "opt",
          },
        ],
      }
    },
    methods: {
      // 编辑弹出框
      emitAdd() {
        console.log(this.emitForm);
        emitCate(this.emitForm)
        this.render()
        this.emitVisible = false

      },
      emit(e) {
        // console.log(e);
        this.emitVisible = true
        this.emitForm.cat_name = e.cat_name
        this.emitForm.cat_id = e.cat_id
      },
      del(e) {
        // console.log(e.cat_id);
        delcategories(e.cat_id)
        this.render()
      },
      // 级联选择器改变事件
      ok() {
        if (this.arr.length !== 0) {
          this.from.cat_level = this.arr.length
          this.from.cat_pid = this.arr[this.arr.length - 1]
        } else {
          this.from.cat_pid = 0
          this.from.cat_level = 0
        }
        console.log(this.from);
        AddCategory(this.from)
        this.dialogVisible = false
        this.render()

      },
      handleChange(e) {
        console.log(this.arr);
        this.$refs.cascader.dropDownVisible = false

      },
      add() {
        // 练级选择器用的数据
        Getcategories(this.page2).then(res => {
          // console.log(res);
          this.options = res.data.data
        })
        this.dialogVisible = true

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
        Getcategories(this.page).then(res => {
          // console.log(res);
          this.list = res.data.data.result
          this.total = res.data.data.total
        })

      }
    },
    created() {
      this.render()
    },
  }

</script>
