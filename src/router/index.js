import Vue from 'vue'
import Router from 'vue-router'
import ManageFile from '@/pages/ManageFile'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ManageFile',
      component: ManageFile
    }
  ]
})
