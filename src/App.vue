<script setup>
import { useRouter } from 'vue-router';
import { ref, provide, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';

import { changeTheme } from '../src/layout/composables/config.js';
import { getThemeColors } from '../src/layout/composables/colors.js';

const router = useRouter()
const toast = useToast();
const apiURL = import.meta.env.VITE_API_URL
let isAuthenticated = !!localStorage.refreshToken && !!localStorage.accessToken

const intervalRefresh = setInterval(() => {
  isAuthenticated = !!localStorage.refreshToken && !!localStorage.accessToken
  if (isAuthenticated) {
    updateToken()
  } else {
    console.log('UNAUTHORIZED, nothing to update')
  }
}, 10000) 

if (!isAuthenticated) router.push('/login')

async function updateToken() {
  await axios({
    method: 'post',
    url: `${apiURL}/token/refresh`,
    data: { token: localStorage.refreshToken },
    headers: { 'Authorization': `Bearer ${localStorage.accessToken}` } 
  }).then((res) => {
    localStorage.accessToken = res.data.accessToken
    isAuthenticated = true
  }).catch((error) => {
    toast.add({
      severity: 'error', summary: 'An error occured when updating access token', detail: error.response.data.error, life: 10000
    });

    isAuthenticated = false
    localStorage.clear()
  })
  
}

const colors = ref({
  defaultColor: getComputedStyle(document.querySelector(':root')).getPropertyValue('--text-color'),
  activeColor: getComputedStyle(document.querySelector(':root')).getPropertyValue('--primary-color')
})

function updateColors(defaultColor, activeColor) {
  colors.value.defaultColor = defaultColor
  colors.value.activeColor = activeColor
}

provide('colors', {colors, updateColors})
provide('toast', toast)

onMounted(() => {
	if (localStorage.theme) {
		changeTheme(localStorage.theme, localStorage.mode)
		const newColors = getThemeColors(localStorage.theme)
  	updateColors(newColors.defaultColor, newColors.activeColor)
	}
})

onUnmounted(() => {
  clearInterval(intervalRefresh)
})

</script>

<template>
  <router-view />
</template>

<style>

</style>
