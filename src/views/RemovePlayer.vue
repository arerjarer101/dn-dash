<script setup>
import axios from 'axios';
import { ref, toRaw, inject } from 'vue';

const toast = inject('toast')
const apiURL = import.meta.env.VITE_API_URL

const props = defineProps(['currentGame'])
const emit = defineEmits(['updatePlayers'])
const selectedPlayers = ref([])

async function removePlayers() {
  const game = {
    id: props.currentGame.id,
    players: toRaw(selectedPlayers.value)
  }

  console.log(game)
  await axios({
    method: 'post',
    url: `${apiURL}/game/remove/player`, 
    data: { game }, 
    headers: { 'Authorization': `Bearer ${localStorage.accessToken}` } 
  }).then(res => {
    toast.add({
      severity: 'success', summary: `Players removed!`, detail: ``, life: 3000
    });
    const updatedGame = res.data.updatedGame

		console.log(updatedGame)
		localStorage.currentGame = JSON.stringify(updatedGame)
    selectedPlayers.value = []

    emit('updatePlayers',updatedGame)
    
  }).catch(error => {
    console.log(error.message)
    toast.add({
			severity: 'error', summary: 'An error occured when creating a game', detail: error.response.data.error, life: 10000
		});
  })
}

</script>

<template>
  <Card>
    <template #title>Remove players</template>
    <template #content>
      <MultiSelect v-model="selectedPlayers" :options="props.currentGame.players" filter optionLabel="username" placeholder="Select Players"
      :maxSelectedLabels="3" class="w-full md:w-20rem mr-4" />
      <Button v-if="selectedPlayers.length > 0" @click="removePlayers" class="mb-1">Remove players</Button>
      <Button v-else disabled class="mb-1">Remove players</Button>   
    </template>
  </Card>
</template>

<style scoped></style>