import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Message } from 'element-ui'
// Message--element-ui中的提示框组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message
