<script setup>
import { useRouter } from 'vue-router';
import { ref, provide, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';

import { changeTheme } from '../src/layout/composables/config.js';
import { getThemeColors } from '../src/layout/composables/colors.js';

const router = useRouter()
const toast = useToast();
const apiURL = 'http://10.100.102.5:7070'
// const token = ref('')
let isAuthenticated = !!localStorage.refreshToken && !!localStorage.accessToken

const intervalRefresh = setInterval(() => {
  isAuthenticated = !!localStorage.refreshToken && !!localStorage.accessToken
  if (isAuthenticated) {
    updateToken()
  } else {
    console.log('UNAUTHORIZED, nothing to update')
  }
}, 10000) 

console.log('previous path: ', localStorage.previousPath || 'login')

if (!isAuthenticated) router.push('/' + (localStorage.previousPath || 'login'))

async function updateToken() {
  await axios.post(`${apiURL}/token/refresh`, {
    token: localStorage.refreshToken
  }).then((res) => {
    localStorage.accessToken = res.data.accessToken
    // token.value = res.data.accessToken
    console.log('updated accessToken:', localStorage.accessToken)
    toast.add({
      severity: 'success', summary: `Success!`, detail: `Access token updated`, life: 3000
    });
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

onMounted(() => {
	if (localStorage.theme) {
		changeTheme(localStorage.theme)
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

<style scoped>

</style>
