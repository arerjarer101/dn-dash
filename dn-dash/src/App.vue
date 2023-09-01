<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, provide, inject, onUnmounted } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';

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

// provide('token', token)

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

onUnmounted(() => {
  clearInterval(intervalRefresh)
})

</script>

<template>
  <router-view />
</template>

<style scoped>

</style>
