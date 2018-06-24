<template>
  <div>{{msg}}</div>
</template>
<script>
export default {
  data() {
    return {
      msg: this.$route.name
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
