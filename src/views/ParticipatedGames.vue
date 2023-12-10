<script setup>
import { onBeforeMount, ref, inject } from 'vue'
import axios from 'axios';

const toast = inject('toast')
const apiURL = import.meta.env.VITE_API_URL

localStorage.currentGame = ''

const users = ref()

const games = ref('')

async function getUsers() {
  await axios({
    method: 'get',
    url: `${apiURL}/user/list`,
    params: { refreshToken: localStorage.refreshToken },
    headers: { 'Authorization': `Bearer ${localStorage.accessToken}` }
  }).then(res => {
    users.value = res.data
    console.log('GOT USERS', users.value)
  }).catch((error) => {
    console.log(error)
  })
}

async function getParticipatedGames() {
  await axios({
    method: 'get',
    url: `${apiURL}/game/participated`,
    headers: { 'Authorization': `Bearer ${localStorage.accessToken}` }
  }).then(res => {
    games.value = res.data.userGames
  }).catch(error => {
    console.log(error.message)
  })
}

function open(game) {
  localStorage.currentGame = JSON.stringify(game)
}

onBeforeMount(() => {
  getParticipatedGames()
  getUsers()
})
</script>

<template>
  <div>
    <Card v-for="game in games" :key="game" class="mb-2">
      <template #title>{{game.name}}</template>
      <template #content >
        <div>
          <RouterLink :to="`/participated-games/${game.name}`" @click="open(game)"><Button class="mr-2">Open</Button></RouterLink>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>

</style>