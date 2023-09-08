<script setup>
import {ref, onMounted, watch, reactive, inject} from 'vue'
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const router  = useRouter()
const route  = useRoute()
const apiURL = 'http://10.100.102.5:7070'
const refreshToken = ref(localStorage.refreshToken)
const user = ref('')
// const accessToken = inject('token')
const accessToken = ref(localStorage.accessToken)

user.value = localStorage.user && JSON.parse(localStorage.user) 
console.log(localStorage.user)

const headers = reactive({ 'Authorization': 'Bearer ' + localStorage.accessToken })

onMounted(() => {
  console.log(route.query.action)
  if (route.query.action === "login") {
    setTimeout(() => {
      toast.add({
        severity: 'success', summary: 'Logged in', detail: `Welcome back, ${user.value.username}!`, life: 3000
      });
    }, 100)

    route.query.action = ''
  }
})

async function updateUser() {
  const newdata = user.value
  // newdata.newpassword = newdata.newpassword || newdata.oldpassword
  console.log('HEADERS:',headers)
  await axios({
    method: 'post',
    url: `${apiURL}/user/update`, 
    data: { newdata }, 
    headers: { 'Authorization': `Bearer ${localStorage.accessToken}` } 
  }).then(res => {
    toast.add({
      severity: 'success', summary: `User ${res.data.user.username} updated`, detail: `some fields were updated`, life: 3000
    });
    localStorage.user = JSON.stringify(res.data.user)
    console.log(res.message)
    newdata.newpassword = ''
    newdata.oldpassword = ''
  }).catch(error => {
    console.log(error.message)
    toast.add({
			severity: 'error', summary: 'An error occured when updating user data', detail: error.response.data.error, life: 10000
		});
  })
}

async function updateToken() {
  await axios.post(`${apiURL}/token/refresh`, {
    token: localStorage.refreshToken
  }).then((res) => {
    localStorage.accessToken = res.data.accessToken
    accessToken.value = res.data.accessToken
    toast.add({
      severity: 'success', summary: `Success!`, detail: `Access token updated`, life: 3000
    });
  }).catch((error) => {
    toast.add({
			severity: 'error', summary: 'An error occured when updating access token', detail: error.response.data.error, life: 10000
		});
  })
}

async function onLogoutAll() {
  await axios({
    method: 'delete',
    url: `${apiURL}/user/logoutAll`, 
    data: { token: localStorage.refreshToken }, 
    headers: { 'Authorization': `Bearer ${localStorage.accessToken}` }
  }).then(res => {
    console.log(res)

    localStorage.accessToken = ""
    localStorage.refreshToken = ""
    localStorage.user = ""
    router.push({
      path: '/login',
      query: {
        action: "logoutAll",
      }
    })
  }).catch(res => {
    console.log(res)

    localStorage.user = ""
    localStorage.accessToken = ""
    localStorage.refreshToken = ""
    router.push({
      path: '/login'
    })
  })
}

async function onLogout() {
  await axios({
    method: 'delete',
    url: `${apiURL}/user/logout`, 
    data: { token: localStorage.refreshToken }, 
    headers: { 'Authorization': `Bearer ${localStorage.accessToken}` }
  }).then(res => {
    console.log(res.data)

    localStorage.accessToken = ""
    localStorage.refreshToken = ""
    localStorage.user = ""

    router.push({
      path: '/login',
      query: {
        action: "logout",
      }
    })
  }).catch(res => {
    console.log(res.data)

    localStorage.accessToken = ""
    localStorage.refreshToken = ""
    localStorage.user = ""

    router.push({
      path: '/login'
    })
  })
}

// watch(accessToken, (newToken) => {
//   localStorage.accessToken = newToken
//   headers.Authorization = `Bearer ${accessToken.value}`
// })

function onCss() {
  let str = document.styleSheets[0].href
  str = str.replace('http://10.100.102.5:7000/themes/', '')
  let currentTheme = str.replace('/theme.css', '')

  let defaultColor = getComputedStyle(document.querySelector(':root')).getPropertyValue('--text-color')
  let activeColor = getComputedStyle(document.querySelector(':root')).getPropertyValue('--primary-color')
  // console.log(document.styleSheets[0].cssRules[0])
  console.log(currentTheme)
  console.log(defaultColor)
  console.log(activeColor)
  console.log(`'${currentTheme}': {\n\tdefaultColor: '${defaultColor}',\n\tactiveColor: '${activeColor}'\n},`)
}
// http://10.100.102.5:7000/themes/bootstrap4-dark-blue/theme.css
</script>

<template>
  <Toast></Toast>
  
  <Card class="mb-3">
    <template #title>User settings</template>
    <template #content>
      <div class="card flex flex-column  gap-3">
        <div class="p-inputgroup flex-1">
            <span class="p-inputgroup-addon">
                <i class="pi pi-user"></i>
            </span>
            <InputText placeholder="Username" v-model="user.username"/>
        </div>

        <div class="p-inputgroup flex-1">
            <span class="p-inputgroup-addon">
              <i class="pi pi-lock"></i>
            </span>
            <Password placeholder="Old password" v-model="user.oldpassword" :feedback="false"/>
        </div>

        <div class="p-inputgroup flex-1">
            <span class="p-inputgroup-addon">
              <i class="pi pi-lock"></i>
            </span>
            <Password placeholder="New password" v-model="user.newpassword"/>
        </div>

        <div class="p-inputgroup flex-1">
            <span class="p-inputgroup-addon">
              <i class="pi pi-envelope"></i>
            </span>
            <InputText placeholder="Email" v-model="user.email"/>
        </div> 

        <Button label="Save" class="w-full p-2 mt-5 text-xl" @click="updateUser"></Button>
      </div>
    </template>
  </Card>

  <Card class="mb-3">
    <template #title>User settings</template>
    <template #content>
      <Inplace :closable="true">
          <template #display>
              {{ user.username || 'Click to Edit' }}
          </template>
          <template #content>
              <InputText v-model="user.username" autofocus />
          </template>
      </Inplace>
    </template>
  </Card>

  <Card class="mb-3">
    <template #title>accessToken</template>
    <template #content>
        <p class="token">
          {{ accessToken }}
        </p>
        <Button label="Update access token" class="w-full p-2 mt-5 text-xl" @click="updateToken"></Button>
    </template>

  </Card>

  <Card class="mb-3">
    <template #title>refreshToken</template>
    <template #content>
        <p class="token">
          {{ refreshToken }}
        </p>
    </template>
  </Card>

  <Card class="mb-3">
    <template #title>user</template>
    <template #content>
        <p class="token">
          {{ user }}
        </p>
    </template>
  </Card>

  <Button label="CSS" class="w-full p-3 mt-5 text-xl" @click="onCss"></Button>
  
  <Button label="Logout" class="w-full p-3 mt-5 text-xl" @click="onLogout"></Button>
  <Button label="Logout Everywhere" class="w-full p-3 mt-5 text-xl" @click="onLogoutAll"></Button>
</template>

<style>
.token {
  max-width: inherit;
  overflow: scroll;
  word-wrap: break-word;
}
</style>