<script setup>
import axios from 'axios';
import { onMounted, ref, toRaw, inject } from 'vue';

const props = defineProps(['currentGame'])
console.log('props.currentGame KEK', props)
const emit = defineEmits(['updatePlayers'])
const toast = inject('toast')
const apiURL = import.meta.env.VITE_API_URL
const players = ref([])
const selectedPlayers = ref([])

async function getUsers() {
  await axios({
    method: 'get',
    url: `${apiURL}/user/list`,
    params: { refreshToken: localStorage.refreshToken },
    headers: { 'Authorization': `Bearer ${localStorage.accessToken}` }
  }).then(res => {
    console.log('List of users', res.data)
    players.value = res.data
  }).catch((error) => {
    console.log(error)
  })
}

async function updatePlayers(players) {
  const game = {
    id: props.currentGame.id,
    players: players
  }

  console.log(game)
  await axios({
    method: 'post',
    url: `${apiURL}/game/update/players`, 
    data: { game }, 
    headers: { 'Authorization': `Bearer ${localStorage.accessToken}` } 
  }).then(res => {
    toast.add({
      severity: 'success', summary: `Players updated!`, detail: ``, life: 3000
    });
    const updatedGame = res.data.updatedGame

		console.log('updatedGame',updatedGame)
		localStorage.currentGame = JSON.stringify(updatedGame)

    emit('updatePlayers',updatedGame)
    
  }).catch(error => {
    console.log(error.message)
    toast.add({
			severity: 'error', summary: 'An error occured when creating a game', detail: error.response.data.error, life: 10000
		});
  })
}

async function addPlayers() {
  console.log(toRaw(selectedPlayers.value))
  console.log(toRaw(players.value))
  await updatePlayers(toRaw(selectedPlayers.value))
  selectedPlayers.value = []
}

onMounted(async () => {
  await getUsers()
})

</script>

<template>
  <Card>
    <template #title>Add players</template>
    <template #content>
      <MultiSelect v-model="selectedPlayers" :options="players" filter optionLabel="username" placeholder="Select Players"
      :maxSelectedLabels="3" class="w-full md:w-20rem mr-4" />
      <Button v-if="selectedPlayers.length > 0" @click="addPlayers()" class="mb-1">Add players</Button>
      <Button v-else disabled class="mb-1">Add players</Button>
    </template>
  </Card>
</template>

<style scoped></style>