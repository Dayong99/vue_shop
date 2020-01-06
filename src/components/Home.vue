<template>
  <div>
    <el-button type="info" @click="logout">退出</el-button>
<!--    type="info"会将按钮渲染成灰色-->

  </div>
</template>

<script>
  export default {
    name: 'Home',
    methods: {
      logout() {
        window.sessionStorage.clear() // 清除window.sessionStorage里的token
        this.$router.push('/login')  // 重定向到登陆界面
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
