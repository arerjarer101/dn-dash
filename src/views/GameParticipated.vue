<script setup>
import axios from 'axios';
import { computed, onBeforeMount, ref } from 'vue';
import CharacterPage from './CharacterPage.vue';

const apiURL = import.meta.env.VITE_API_URL

const currentGame = ref(JSON.parse(localStorage.currentGame))

const users = ref()

const charList = computed(() => {
  return currentGame.value.characters
})

onBeforeMount(async () => {
  await getUsers()
})

async function getUsers() {
  await axios({
    method: 'get',
    url: `${apiURL}/user/list`,
    params: { refreshToken: localStorage.refreshToken },
    headers: { 'Authorization': `Bearer ${localStorage.accessToken}` }
  }).then(res => {
    users.value = res.data
    console.log('GOT USERS', users.value)
  }).catch((error) => {
    console.log(error)
  })
}
</script>

<template>
  <TabView :scrollable="true" class="z-5 mb-3" :pt="{
    panelContainer: { style: 'padding: 10px 0 0 0;', class: ['surface-ground z-5 '] },
    navContainer: { style: 'position: sticky; top: 3rem;', class: ['surface-section z-5 '] },
  }">
    <TabPanel :header="character.name" v-for="(character, charId) of charList" :key="charId">
      <CharacterPage :readonly="true" :character="character" :charData="JSON.parse(character.charData)" />
    </TabPanel>
  </TabView>
</template>

<style scoped>
.topbar_back {
  position: static;
  top: 20px;
  z-index: 3000;
}
</style>