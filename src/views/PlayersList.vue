<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';

// const props = defineProps(['currentGame'])
// const toast = inject('toast')
const apiURL = import.meta.env.VITE_API_URL
const players = ref([])

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

onMounted(async () => {
  await getUsers()
})

</script>

<template>
  <DataTable :value="players" tableStyle="min-width: 10rem">
      <Column field="username" header="Players"></Column>
  </DataTable>
</template>

<style scoped></style>