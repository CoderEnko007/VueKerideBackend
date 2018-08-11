<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style>
.clearfix:after{
  content:".";
  display:block;
  height:0;
  clear:both;
  visibility:hidden;
}
.info {
  color: #303133;
  font-size: 22px;
}
.el-dialog {
  min-width: 770px;
}
</style>
