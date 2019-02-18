import Vue from 'vue'
import Router from 'vue-router'
import ManageFile from '@/pages/ManageFile'
import Upload from '@/components/upload'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ManageFile',
      component: ManageFile
    },
    {
      path: '/upload',
      name: 'upload',
      component: Upload
    }
  ]
})
