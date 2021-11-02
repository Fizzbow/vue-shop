import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import Users from "../components/user/Users";
import Welcom from "../components/Welcom";

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
      component: Home,
      redirect:'/users',
      children :[
        {
          path:'/users',component:Users
        }
      ]
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
