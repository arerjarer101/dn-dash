<script setup>
import { onBeforeMount, ref } from 'vue'
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const apiURL = 'http://10.100.102.5:7070'
const router = useRouter()

const games = ref('')

async function getCreatedGames() {
  await axios({
    method: 'get',
    url: `${apiURL}/game/created`,
    headers: { 'Authorization': `Bearer ${localStorage.accessToken}` }
  }).then(res => {
    games.value = res.data.userGames
  }).catch(error => {
    console.log(error.message)
  })
}

async function createGame() {
  const game = {
    name: 'test',
  }
  await axios({
    method: 'post',
    url: `${apiURL}/game/create`, 
    data: { game }, 
    headers: { 'Authorization': `Bearer ${localStorage.accessToken}` } 
  }).then(res => {
    toast.add({
      severity: 'success', summary: `Game created!`, detail: ``, life: 3000
    });
    console.log(res.data)
    getCreatedGames()
  }).catch(error => {
    console.log(error.message)
    toast.add({
			severity: 'error', summary: 'An error occured when creating a game', detail: error.response.data.error, life: 10000
		});
  })
}

async function deleteGame(id) {
  const game = {
    id: id
  }
  await axios({
    method: 'post',
    url: `${apiURL}/game/delete`, 
    data: { game }, 
    headers: { 'Authorization': `Bearer ${localStorage.accessToken}` } 
  }).then(res => {
    toast.add({
      severity: 'success', summary: `Game deleted!`, detail: ``, life: 3000
    });
    console.log(res.data)
    getCreatedGames()

  }).catch(error => {
    console.log(error.message)
    toast.add({
			severity: 'error', summary: 'An error occured when deleting the game', detail: error.response.data.error, life: 10000
		});
  })
}

function openGame(game) {
  console.log(router.getRoutes())
  localStorage.currentGame = JSON.stringify(game)
  router.push({ path: `/created-games/${game.id}` })
}

onBeforeMount(() => {
  getCreatedGames()
})

</script>

<template>
  
  <Card>
    <template #title>Create a game</template>
    <template #content>
      <Button @click="createGame" class="mr-2">Create</Button>
      <Button @click="getCreatedGames">getCreatedGames</Button>
    </template>
  </Card>

  <Card v-for="game in games" :key="game" class="mt-2">
    <template #title>{{game.name}}</template>
    <template #content >
      <div class="mb-5">{{game}}</div>
      <div>
        <Button @click="openGame(game)" class="mr-2">Open</Button>
        <Button @click="deleteGame(game.id)" class="mr-2">Delete</Button>
      </div>
    </template>
  </Card>


</template>

<style scoped>
.block {
  
}
.token {
  max-width: inherit;
  overflow: scroll;
  word-wrap: break-word;
}
</style>