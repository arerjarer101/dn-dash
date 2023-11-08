<script setup>
const props = defineProps(['currentGame', 'users'])
</script>

<template>
  <DataTable :value="props.currentGame.players" tableStyle="min-width: 10rem">
      <Column field="username" header="Players"></Column>
  </DataTable>
</template>

<style scoped></style>