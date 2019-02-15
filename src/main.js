import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'

Vue.config.productionTip = false

import './stylesheets/main.scss';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import '@/common/filters';


Vue.use(ElementUI);


new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
