<style lang="scss" scoped>
  .el-table__row,
  td {
    max-height: 50px !important
  }

  td {
    max-height: 50px !important
  }

  .p1 {
    display: flex;
    //    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between
  }

  .as {
    display: flex;
    flex-direction: column;
  }

  .one {
    width: 20%
  }

  .two {
    width: 30%
  }

  .three {
    width: 50%;

  }

  .nm {
    display: flex
  }

  .breadcrumb {
    margin: 10px 0
  }

</style>

<template>
  <div>
    <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      <!-- <el-breadcrumb-item>活动详情</el-breadcrumb-item> -->
    </el-breadcrumb>
    <!-- <h1>角色列表</h1> -->

    <!-- 卡片 -->
    <el-card class="box-card">
      <el-button type="primary" @click="dialogVisible=!dialogVisible">添加角色</el-button>
      <el-table :data="tableData" style="width: 100%" border toggleRowExpansion>
        <el-table-column type="expand">
          <template slot-scope="props">
            <div v-if="props.row.children.length!=0" class="p1">
              <div class="as one">
                <div v-for="item in props.row.children" :key="item.id">
                  <div>
                    <el-tag closable @close="delt(item.id,props.row.id)">{{item.authName}}</el-tag>
                  </div>
                </div>
              </div>
              <div class="as two">
                <div v-for="item in props.row.children" :key="item.id">
                  <div v-for="ele in item.children" :key="ele.id">
                    <div>
                      <el-tag type="success" closable @close="delt(ele.id,props.row.id)">{{ele.authName}}
                      </el-tag>
                    </div>
                  </div>
                </div>
              </div>
              <div class="as three">
                <div v-for="item in props.row.children" :key="item.id">
                  <div v-for="ele in item.children" :key="ele.id" class="nm">
                    <div v-for="a in ele.children" :key="a.id">
                      <el-tag type="info" closable @close="delt(a.id,props.row.id)">{{a.authName}}
                      </el-tag>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p v-if="props.row.children.length==0">暂无权限</p>
          </template>
        </el-table-column>
        <el-table-column type="index" width="150">
        </el-table-column>
        <el-table-column label="角色名称" prop="roleName" width="200">
        </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc" width="300">
        </el-table-column>
        <el-table-column label="操作" prop="desc">
          <template slot-scope="scope">
            <el-button type="success" icon="el-icon-edit" @click="emit(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="del(scope.row.id)">删除</el-button>
            <el-button type="primary" icon="el-icon-setting" @click="emitRoles(scope.row)">角色修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 点击添加的弹出层 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="50%">
      <!-- <span>这是一段信息</span> -->
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="form.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="form.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="add()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 树形图弹出层 -->
    <el-dialog title="提示" :visible.sync="dialogVisible2" width="50%">
      <!-- 树形控件 -->
      <el-tree :default-checked-keys="defaultChecked" :data="list" show-checkbox default-expand-all node-key="id"
        ref="tree" :props="defaultProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="setRoles()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑的弹出层 -->
    <el-dialog title="编辑用户" :visible.sync="dialogVisible3" width="50%">
      <!-- <span>这是一段信息</span> -->
      <el-form ref="form" :model="form3" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="form3.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="form3.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="emitok()">确 定</el-button>
      </span>
    </el-dialog>
     
  </div>
  
</template>
 <script>
  import {
    getRid,
    rolesDel,
    addRoles,
    getRights,
    changeRoles,
    emitRoles,
    delRoledRight
  } from "../http/https"
  export default {
    data() {
      return {
        tableData: [],
        dialogVisible: false,
        dialogVisible2: false,
        dialogVisible3: false,
        defaultChecked: [],
        list: [],
        form: {
          roleName: "",
          roleDesc: ""
        },
        form3: {
          roleName: "",
          roleDesc: ""
        },
        defaultProps: {
          children: 'children',
          label: 'authName'
        },
        id: ""
      }
    },
    methods: {
      change(row, expanded) {
        console.log(row, expand);
      },
      emit(e) {
        this.id = e.id
        this.dialogVisible3 = true
        this.form3.roleName = e.roleName
        this.form3.roleDesc = e.roleDesc
      },
      async delt(a, b) {
        console.log(a, b);
        const data = {
          roleId: b,
          rightId: a
        }
        await delRoledRight(data)
        this.render()
      },
      emitok() {
        this.dialogVisible3 = false
        const data = {
          id: this.id,
          roleName: this.form3.roleName,
          roleDesc: this.form3.roleDesc,

        }
        console.log(data);
        emitRoles(data).then(res => {
          this.render()
        })
      },
      setRoles() {
        console.log(this.defaultChecked);
        this.dialogVisible2 = false
        let a = this.$refs.tree.getCheckedKeys()
        let b = this.$refs.tree.getHalfCheckedKeys()
        const arr = [...a, ...b]
        const arr2 = arr.join(",")
        // console.log(arr2);
        const data = {
          roleId: this.id,
          rids: arr2
        }
        console.log(data);
        changeRoles(data).then(res => {
          console.log(res);
          this.render()
        })
      },
      emitRoles(row) {
        this.defaultChecked = []
        console.log(row);
        this.id = row.id
        // console.log(this.defaultChecked);
        this.recursion(row, this.defaultChecked)
        getRights().then(res => {
          console.log(res);
          this.list = res.data.data
          this.dialogVisible2 = true
        })
      },
      // 递归方法
      recursion(row, keys) {
        if (!row.children) {
          return keys.push(row.id);
        }
        row.children.forEach((ele) => {
          this.recursion(ele, keys);
        });

      },
      render() {
        getRid().then(res => {
          this.tableData = res.data.data
        })
      },
      add() {
        this.dialogVisible = false
        addRoles(this.form).then(res => {
          this.render()
        })
        this.form.roleName = ""
        this.form.roleDesc = ""
      },
      del(e) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          rolesDel(e).then(res => {
            this.render()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      }
    },
    created() {
      this.render()
    }
  }

</script>
