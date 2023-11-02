<script setup>
import { onBeforeMount, ref, inject } from 'vue'
import axios from 'axios';
import { useConfirm } from "primevue/useconfirm";

const toast = inject('toast')
const apiURL = import.meta.env.VITE_API_URL

localStorage.currentGame = ''

const confirm = useConfirm();

const games = ref('')
const newGame = ref({
  name: '',
  links: ''
})

const confirmDeleteGame = (game) => {
  confirm.require({
    message: 'Are you sure you want to proceed?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    defaultFocus: 'reject',
    accept: async () => {
      await deleteGame(game.id)
    },
    reject: () => {
      toast.add({ severity: 'info', summary: 'Cancelled', detail: 'Action cancelled', life: 5000 });
    }
  });
}

// watch(
//   () => games,
//   () => {
//     if(currentGame.value) currentGame.value = games.value.find(game => game.name === currentGame.value.name)
//   }, 
//   {deep: true}
// )

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
  const game = newGame.value

  await axios({
    method: 'post',
    url: `${apiURL}/game/create`, 
    data: { game }, 
    headers: { 'Authorization': `Bearer ${localStorage.accessToken}` } 
  }).then(res => {
    const createdGame = res.data.createdGame
    toast.add({
      severity: 'success', summary: `Created`, detail: `Game ${createdGame.name} created!`, life: 3000
    });
    Object.keys(newGame.value).forEach(element => { newGame.value[element] = '' });
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
    const deletedGame = res.data.deletedGame
    console.log(deletedGame)
    toast.add({
      severity: 'success', summary: 'Deleted', detail: `Game ${deletedGame.name} deleted!`, life: 3000
    });
    getCreatedGames()

  }).catch(error => {
    console.log(error.message)
    toast.add({
			severity: 'error', summary: 'An error occured when deleting the game', detail: error.response.data.error, life: 10000
		});
  })
}

function open(game) {
  localStorage.currentGame = JSON.stringify(game)
}

onBeforeMount(() => {
  getCreatedGames()
})
</script>

<template>
  <!-- <GamePage v-if="showGame" 
    :currentGame="currentGame" 
    @updateGameData="(newGameData, gameId) => {updateGameData(newGameData, gameId)}" 
    @goBack="gameSelected = false; currentGame = ''"
  ></GamePage> -->
  
  <div>
    <Card>
      <template #title>Create a game</template>
      <template #content>
        <div class="flex flex-column gap-2 mb-4">
          <label for="name">Game name</label>
          <InputText id="username" v-model="newGame.name" aria-describedby="username-help" />
          <small id="name-help">Define a name for your adventure!</small>
        </div>
        <div class="flex flex-column gap-2 mb-4">
          <label for="name">Links</label>
          <InputText id="links" v-model="newGame.links" aria-describedby="username-help" />
          <small id="name-help">Provide a link to your <s>documentation</s> lore</small>
        </div>

        <Button v-if="newGame.name" @click="createGame" class="mr-2">Create</Button>
        <Button v-else disabled class="mr-2">Create</Button>
      </template>
    </Card>

    <Card v-for="game in games" :key="game" class="mt-2">
      <template #title>{{game.name}}</template>
      <template #content >
        <div class="mb-5">{{game}}</div>
        <div>
          <RouterLink :to="`/created-games/${game.name}`" @click="open(game)"><Button class="mr-2">Open</Button></RouterLink>
          <Button @click="confirmDeleteGame(game)" label="Delete" severity="danger" class="mr-2"></Button>
        </div>
      </template>
    </Card>
  </div>

</template>

<style scoped>

</style>