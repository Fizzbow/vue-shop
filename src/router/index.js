import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes:[
    {
      path:'/',
      redirect:'/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home
    }
  ]
})
router.beforeEach((to,from,next) =>{
  //去登录页直接放行
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  //无token强制跳转向登录页
  if (!tokenStr) return next('/login')
  //有token放行
  next()
})
export default router
