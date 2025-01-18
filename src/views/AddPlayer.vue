<script setup>
import { ref, toRaw, inject } from 'vue';
import { useGameStore } from '../stores/GameStore';
import { useUserStore } from '../stores/UserStore';

const gameStore = useGameStore();
const userStore = useUserStore();

const toast = inject('toast')
const selectedPlayers = ref([])

async function addPlayers() {
  await gameStore.updateGamePlayers(toRaw(selectedPlayers.value))
  .then(()=> {
    toast.add(gameStore.toast);
    selectedPlayers.value = [];
  });
}

</script>

<template>
  <Card>
    <template #title>Add players</template>
    <template #content>
      <MultiSelect v-model="selectedPlayers" :options="userStore.userList" filter optionLabel="username" placeholder="Select Players"
      :maxSelectedLabels="3" class="w-full md:w-20rem mr-4" />
      <Button v-if="selectedPlayers.length > 0" @click="addPlayers()" class="mb-1">Add players</Button>
      <Button v-else disabled class="mb-1">Add players</Button>
    </template>
  </Card>
</template>

<style scoped></style>