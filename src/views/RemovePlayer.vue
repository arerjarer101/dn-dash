<script setup>
import { ref, toRaw, inject } from 'vue';
import { useGameStore } from '../stores/GameStore';

const gameStore = useGameStore();
const toast = inject('toast')
const selectedPlayers = ref([])

async function removePlayers() {
  await gameStore.removePlayers(toRaw(selectedPlayers.value))
  .then(()=>{
    toast.add(gameStore.toast);
    selectedPlayers.value = [];
  });
}
</script>

<template>
  <Card>
    <template #title>Remove players</template>
    <template #content>
      <MultiSelect v-model="selectedPlayers" :options="gameStore.currentGame.players" filter optionLabel="username" placeholder="Select Players"
      :maxSelectedLabels="3" class="w-full md:w-20rem mr-4" />
      <Button v-if="selectedPlayers.length > 0" @click="removePlayers" class="mb-1">Remove players</Button>
      <Button v-else disabled class="mb-1">Remove players</Button>   
    </template>
  </Card>
</template>

<style scoped></style>