import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import './plugins/element.js'
import './assets/assets/fonts/iconfont.css'
import './assets/assets/css/global.css'

import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

import TreeTable from 'vue-table-with-tree-grid'


import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

import axios from 'axios'
axios.defaults.baseURL = 'http://139.9.202.95:8888/api/private/v1/'
Vue.prototype.$http = axios;


//request拦截器中，展示进度条
axios.interceptors.request.use(config => {
    console.log(config)
    //在response拦截器中，打开进度条
    Nprogress.start()
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})
//response拦截器中，隐藏进度条
axios.interceptors.response.use(config=>{
        Nprogress.done()
        return config
    }
)

Vue.config.productionTip = false
Vue.component('tree-table',TreeTable)

Vue.filter('dataFormate',function (originVal){
    const dt = new Date(originVal)

    const y = dt.getFullYear()
    const m =( dt.getMonth()+1+'').padStart(2,'0') //padStart(2,'0'):不足两位补字符串0
    const d = (dt.getDate()+'').padStart(2,'0')

    const hh = (dt.getHours() + '').padStart(2,'0')
    const mm = (dt.getMinutes() + '').padStart(2,'0')
    const ss = (dt.getSeconds() + '').padStart(2,'0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
Vue.use(VueQuillEditor)



new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
