import Vue from 'vue'
import VueRouter from 'vue-router'

//import Login from '@/components/Login.vue'
const Login = () =>
    import(/* webpackChunkName: "login_home_welcome" */ '@/components/Login.vue')

//import Home from '@/components/Home.vue'
const Home = () =>
    import(/* webpackChunkName: "login_home_welcome" */ '@/components/Home.vue')

//import Users from "../components/user/Users";
const Users = () =>
    import(/* webpackChunkName: "login_home_welcome" */ '../components/user/Users')


//import Right from "../components/power/Right"
const Right = () =>
    import(/* webpackChunkName: "right_roles" */ '../components/power/Right')

//import Roles from "../components/power/Roles";
const Roles = () =>
    import(/* webpackChunkName: "right_roles" */ '../components/power/Roles')


//import Cate from '../components/goods/Cate'
const Cate = () =>
    import(/* webpackChunkName: "cate_params_goods" */ '../components/goods/Cate')

//import Params from "../components/goods/Params";
const Params = () =>
    import(/* webpackChunkName: "cate_params_goods" */ '../components/goods/Params')

//import Goods from "../components/goods/Goods";
const Goods = () =>
    import(/* webpackChunkName: "cate_params_goods" */ '../components/goods/Goods')

//import Add from '../components/goods/Add'
const Add = () =>
    import(/* webpackChunkName: "add_order_report" */ '../components/goods/Add')


//import Order from '../components/order/Order'
const Order = () =>
    import(/* webpackChunkName: "add_order_report" */ '../components/order/Order')

//import Report from "../components/report/Report";
const Report = () =>
    import(/* webpackChunkName: "add_order_report" */ '../components/report/Report')

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
        },
        {
          path:'/rights',component:Right
        },
        {
          path:'/roles',component:Roles
        },
        {
          path:'/categories',component:Cate
        },
        {
          path:'/params',component:Params
        },
        {
          path:'/goods',component:Goods
        },
        {
          path:'/goods/add',component:Add
        },
        {
          path:'/orders',component:Order
        },
        {
          path:'/reports',component:Report
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
