<script setup>
import axios from 'axios';
import { computed, onBeforeMount, onMounted, ref } from 'vue';
import CharacterPage from './CharacterPage.vue';
import { useGameStore } from '../stores/GameStore';

const gameStore = useGameStore();
const apiURL = import.meta.env.VITE_API_URL

const currentGame = ref(JSON.parse(localStorage.currentGame))
const characters = ref()
console.log(JSON.parse(localStorage.currentGame))

const users = ref()

const charList = computed(() => {
  return characters.value
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
async function getCharacters() {
  await axios({
    method: 'get',
    url: `${apiURL}/game/participated/${currentGame.value.id}/characters`,
    params: { refreshToken: localStorage.refreshToken },
    headers: { 'Authorization': `Bearer ${localStorage.accessToken}` }
  }).then(res => {
    characters.value = res.data.userChars
    console.log('GOT CHARACTERS', characters.value)
  }).catch((error) => {
    console.log(error)
  })
}

onMounted(async () => {
  await getCharacters()
  gameStore.setCurrentCharacterValue(characters.value[0])
})

const setChar = (index) => {
  if (index >= characters.value.length) return
  gameStore.setCurrentCharacterValue(characters.value[index])
}
</script>

<template>
  <TabView @update:activeIndex="(index)=>{setChar(index)}" :scrollable="true" class="z-5 mb-3" :pt="{
    panelContainer: { style: 'padding: 10px 0 0 0;', class: ['surface-ground z-5 '] },
    navContainer: { style: 'position: sticky; top: 3rem;', class: ['surface-section z-5 '] },
  }">
    <TabPanel  :header="character.name" v-for="(character, charId) of charList" :key="charId">
      <CharacterPage :readonly="true" :character="character" :charData="character.charData" />
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