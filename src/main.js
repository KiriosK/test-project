import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import VueMask from 'v-mask'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import App from './App.vue'
import { store } from './store/index'

Vue.use(BootstrapVue)
Vue.use(VueMask)

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
