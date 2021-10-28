<template>
  <div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>
<script>
export  default {
  methods:{
    //清空token，重定向到login页面
    logout() {
      window.sessionStorage.clear()
      this.$router.push('./login')
    }
  }
}
</script>