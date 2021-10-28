import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import './plugins/element.js'

import './assets/assets/fonts/iconfont.css'

import './assets/assets/css/global.css'

import axios from 'axios'
axios.defaults.baseURL = 'http://139.9.202.95:8888/api/private/v1/'
Vue.prototype.$http = axios;

axios.interceptors.request.use(config => {
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
