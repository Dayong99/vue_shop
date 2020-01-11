import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入axios
import axios from 'axios'
// 配置请求的根路径
// axios.defaults.baseURL = 'http://49.235.242.56:8888/api/private/v1/'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  // config即是请求对象
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后要把config return出去
  return config
})
// 每一个vue组件都可以通过this直接访问到$http,从而发起axios请求
Vue.prototype.axios = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
