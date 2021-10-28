<template>
    <el-container class="home-container">
      <el-header>
        <div>
          <span>电商管理系统</span>
        </div>

        <el-button type="info" @click="logout">退出</el-button>
      </el-header>

      <el-container>
        <el-aside width="200px">
            <el-menu
                background-color="#0D162F"
                text-color="#fff"
                active-text-color="#2EA043">
              <el-submenu :index="item.id+''"  v-for="item in menuList" :key="item.id">
                <template slot="title">
                  <i class="iconsObj[item.id]"></i>
                  <span>{{ item.authName }}</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id">{{ subItem.authName }}</el-menu-item>
                </el-menu-item-group>
                </el-submenu>
            </el-menu>
        </el-aside>
        <el-main>Main</el-main>
      </el-container>

    </el-container>
</template>
<script>
export  default {
  data() {
    return {
      menuList:[],
      iconsObj:{
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse:false,
      activePath:''
    }
  },
  created() {
    this.getMenuList()
  },
  methods:{

    //清空token，重定向到login页面
    logout() {
      window.sessionStorage.clear()
      this.$router.push('./login')
    },
    async getMenuList() {
      const { data:res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data;
      console.log(res);
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #0E1832;
  display: flex;
  justify-content: space-between;
  color:#BFBFBF;
  align-items: center;
  line-height: 60px;
  >div{
    span{
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #0D162F;
}
.el-main {
  background-color: #161B22;
}
</style>