import Vue from 'vue'
import Router from 'vue-router'
import Launch from '@/components/Launch'
import Main from '@/components/Main'
import Ending from '@/components/Ending'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Launch',
      component: Launch
    }, {
      path: '/main',
      name: 'Main',
      component: Main
    }, {
      path: '/end',
      name: 'Ending',
      component: Ending
    }
  ]
})
