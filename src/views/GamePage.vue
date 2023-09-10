<script setup>
import { ref } from 'vue'

const currentGame = ref(localStorage.currentGame)
console.log(localStorage.currentGame)

</script>

<template>
  <div>{{ currentGame }}</div>
</template>

<style scoped></style>