import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import InitialView from '../views/InitialView.vue'
import UiSettings from '../views/UiSettings.vue'
import AppLayout from '@/layout/AppLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: '/',
          component: InitialView
        },
        {
          path: '/home',
          component: HomeView
        },
        {
          path: '/ui-settings',
          component: UiSettings
        }
      ]
    }
  ]
})

export default router
