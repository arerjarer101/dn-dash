<script setup>
import { useGameStore } from '../stores/GameStore';

const gameStore = useGameStore();
</script>

<template>
  <DataTable :value="gameStore.currentGame.players" tableStyle="min-width: 10rem">
      <Column field="username" header="Players"></Column>
  </DataTable>
</template>

<style scoped></style>