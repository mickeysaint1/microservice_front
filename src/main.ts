import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Element)

//axios.defaults.baseURL = "http://localhost/api/";
axios.defaults.baseURL = "http://localhost:8040/";
Vue.prototype.axios = axios;

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
