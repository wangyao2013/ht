<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {}

</script>

<style>
  * {
    margin: 0;
    padding: 0;
    line-height: none
  }

  html,
  body,
  #app {
    width: 100%;
    height: 100%
  }

  .el-submenu__title {
    padding-left: 0 !important
  }

  .el-table__body,
  .el-table__header {
    width: 100% !important
  }

  .el-cascader-menu {
    height: 300px;
  }

</style>
