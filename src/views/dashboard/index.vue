<template>
  <div class="dashboard-container">
    <div>
      <p class="hello">欢迎来到客瑞德小程序管理后台</p>
      <img class="emptyGif" :src="emptyGif">
    </div>
  </div>
</template>

<script>
export default {
  name: 'dashboard',
  data() {
    return {
      emptyGif: 'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3'
    }
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-container {
  background-color: #e3e3e3;
  min-height: 100vh;
  padding: 50px 60px 0px;
  .emptyGif {
    display: block;
    width: 45%;
    margin: 0 auto;
  }
  .hello {
    color:#fefefe;
    font-size: 38px;
    text-shadow:
      0px 1px 0px #c0c0c0,
      0px 2px 0px #b0b0b0,
      0px 3px 0px #a0a0a0,
      0px 4px 0px #909090,
      0px 5px 10px rgba(0, 0, 0, .9);
  }
}
</style>
