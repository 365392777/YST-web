// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import request from './utils/request'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import './permission'
import InputNumDigit from '@/directive/InputNumDigit'

Vue.directive('num-digit', InputNumDigit)

Vue.use(Element)

Vue.config.productionTip = false
Vue.prototype.$axios = request

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
