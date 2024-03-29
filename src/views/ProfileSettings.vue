<script setup>
import { ref, onMounted, reactive, inject } from 'vue'
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';

const toast = inject('toast')
const router  = useRouter()
const route  = useRoute()
const apiURL = import.meta.env.VITE_API_URL
const refreshToken = ref(localStorage.refreshToken)
const user = ref('')
const accessToken = ref(localStorage.accessToken)

user.value = localStorage.user && JSON.parse(localStorage.user) 

const headers = reactive({ 'Authorization': 'Bearer ' + localStorage.accessToken })

onMounted(() => {
  if (route.query.action === "login") {
    setTimeout(() => {
      toast.add({
        severity: 'success', summary: 'Logged in', detail: `Welcome back, ${user.value.username}!`, life: 3000
      });
    }, 100)

    route.query.action = ''
  }

  if (route.query.action === "register") {
    setTimeout(() => {
      toast.add({
        severity: 'success', summary: 'User registered', detail: `Welcome aboard, ${user.value.username}!`, life: 3000
      });
    }, 100)

    route.query.action = ''
  }
})

async function updateUser() {
  const newdata = user.value
  // newdata.newpassword = newdata.newpassword || newdata.oldpassword
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
  await axios({
    method: 'post',
    url: `${apiURL}/token/refresh`,
    data: { token: localStorage.refreshToken },
    headers: { 'Authorization': `Bearer ${localStorage.accessToken}` } 
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
  }).catch(error => {
    console.log(error)

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
  }).then(() => {
    localStorage.accessToken = ""
    localStorage.refreshToken = ""
    localStorage.user = ""

    router.push({
      path: '/login',
      query: {
        action: "logout",
      }
    })
  }).catch(error => {
    console.log(error.data)

    localStorage.accessToken = ""
    localStorage.refreshToken = ""
    localStorage.user = ""

    router.push({
      path: '/login'
    })
  })
}

</script>

<template> 
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