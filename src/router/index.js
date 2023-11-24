import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProfileSettings from '../views/ProfileSettings.vue'
import CreatedGames from '../views/CreatedGames.vue'
import GamePage from '../views/GamePage.vue'
import GameParticipated from '../views/GameParticipated.vue'
import ParticipatedGames from '../views/ParticipatedGames.vue'
import UiSettings from '../views/UiSettings.vue'
import AppLayout from '@/layout/AppLayout.vue'
import axios from 'axios'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'root',
      component: AppLayout,
      children: [
        {
          path: '/profile',
          name: 'profile',
          component: ProfileSettings
        },
        {
          path: '/home',
          component: HomeView
        },
        {
          path: '/ui-settings',
          component: UiSettings
        },
        {
          path: '/created-games',
          name: 'created-games',
          component: CreatedGames,
        },
        {
          path: '/created-games/:gameId',
          name: 'game-page',
          component: GamePage,
        },
        {
          path: '/participated-games',
          component: ParticipatedGames,
        },
        {
          path: '/participated-games/:gameId',
          name: 'game-participated',
          component: GameParticipated,
        },
      ]
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        freeAccess: true,
      },
      component: () => import('../views/LoginPage.vue')
    },
    {
      path: '/register',
      name: 'register',
      meta: {
        freeAccess: true,
      },
      component: () => import('../views/RegisterPage.vue')
    },
  ]
})

router.beforeEach(async (to, from) => {
  if (to.meta.freeAccess === true) return true

  const arrPathTo = to.fullPath.split('/')
  const arrPathFrom = from.fullPath.split('/')
  if (arrPathTo.length > 2 &&  ['created-games', 'participated-games'].includes(arrPathTo[1])) {
    if(localStorage.currentGame === '') router.push(arrPathFrom[1])
  }

  const apiURL = import.meta.env.VITE_API_URL
  const userStatus = {}

  await axios({
    method: 'get',
    url: `${apiURL}/token/loggedIn`,
    params: { refreshToken: localStorage.refreshToken },
    headers: { 'Authorization': `Bearer ${localStorage.accessToken}` }
  }).then(res => {
    userStatus.loggedIn = res.data
    console.log('Logged In status', userStatus.loggedIn)
  }).catch((error) => {
    console.log(error)
  })
  
  if (!userStatus.loggedIn) {
    router.push('/login')
    console.log('user is not logged in, pushed out!!!')
  }
  
  await axios({
    method: 'post',
    url: `${apiURL}/token/refresh`,
    data: { token: localStorage.refreshToken },
    headers: { 'Authorization': `Bearer ${localStorage.accessToken}` } 
  }).then((res) => {
    localStorage.accessToken = res.data.accessToken
  }).catch((error) => {
    console.log(error)
  })
})


export default router
