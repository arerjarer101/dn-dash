<script setup>
import axios from 'axios';
import { computed, inject, onMounted, ref } from 'vue';
import CharacterPage from './CharacterPage.vue';
import AddCharacter from './AddCharacter.vue';
import AddPlayer from './AddPlayer.vue';
import RemovePlayer from './RemovePlayer.vue';
import PlayersList from './PlayersList.vue';
import SharedInventory from './components/SharedInventory.vue';

import { useGameStore } from '../stores/GameStore';

const gameStore = useGameStore();

const toast = inject('toast')
const apiURL = import.meta.env.VITE_API_URL

const currentGameId = ref(localStorage.currentGameId)
console.log(gameStore.currentGame)
const users = ref()

const charList = computed(() => {
	return gameStore.currentGame.characters
})

onMounted(async () => {
  await getUsers()
  await getUpdatedGame(localStorage.currentGameId)
  if (charList.value.length) {
    gameStore.setCurrentCharacter(0)
  }
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

async function getUpdatedGame(id) {
  await axios({
    method: 'get',
    url: `${apiURL}/game/by/${id}`, 
    headers: { 'Authorization': `Bearer ${localStorage.accessToken}` } 
  }).then(res => {
    toast.add({
      severity: 'success', summary: `Updated`, detail: `Game ${res.data.updatedGame.name} updated`, life: 3000
    });

		console.log('updated GAME',res.data.updatedGame)
		gameStore.currentGame = res.data.updatedGame
		localStorage.currentGameId = res.data.updatedGame.id
    
  }).catch(error => {
    toast.add({
			severity: 'error', summary: 'An error occured updating a game', detail: error.response.data.error, life: 10000
		});
  })
}

async function onCharactersUpdated() {
  console.log('characters updated')
  await getUpdatedGame(gameStore.currentGame.id)
  // gameStore.currentGame = JSON.parse(localStorage.currentGame)
}

async function onCharacterDeleted(name) {
  console.log('deleted character ',name)
  await getUpdatedGame(gameStore.currentGame.id)
}

async function onCharacterUpdated(name) {
  console.log('updated character ',name)
  await getUpdatedGame(gameStore.currentGame.id)
}

async function onPlayersUpdated(updatedGame) {
  console.log('emitted updatedGame', updatedGame)
  gameStore.currentGame = JSON.parse(localStorage.currentGame)
}

async function onItemsTransferred() {
  await getUpdatedGame(gameStore.currentGame.id)
}

const setChar = (index) => {
  if (index >= charList.value.length) return

  gameStore.setCurrentCharacter(index)
}

const data = computed(() => {
  return gameStore.getCurrentCharData
})
</script>

<template>
  <div v-if="gameStore.currentGame.characters">
    <!-- <div>{{gameStore.currentGame.characters}}</div>
    <div>{{gameStore.currentCharacter}}</div>
    <div>{{data}}</div> -->
    
    <!-- <Button @click="gameStore.setActiveTab(gameStore.activeTab)" label="Increment tab"></Button> -->
    <TabView :scrollable="true" :pt="{ panelContainer: { style: 'padding: 0;' } }">
      <TabPanel header="Characters">
        <TabView :scrollable="true" class="z-5 mb-3" 
          @update:activeIndex="(index)=>{setChar(index)}"
          :pt="{ 
            // root: { style: 'border: 1px solid red !important;' },
            panelContainer: { style: 'padding: 10px 0 0 0;', class: ['surface-ground z-5 '] }, 
            navContainer: { style: 'position: sticky; top: 3rem;', class: ['surface-section z-5 '] },
          }">
          <TabPanel :header="character.name" v-for="(character, charId) of charList" :key="charId">
            <CharacterPage 
            :character="character" 
            :charData="JSON.parse(character.charData)" 
            @delete-character="(name) => onCharacterDeleted(name)"
            @update-character="(name) => onCharacterUpdated(name)"></CharacterPage>
          </TabPanel>
          <TabPanel header="+ add a character">
            <AddCharacter :currentGame="gameStore.currentGame" @update-characters="onCharactersUpdated"></AddCharacter>
          </TabPanel>
          <TabPanel v-if="gameStore.currentGame.characters && gameStore.currentGame.characters.length > 0" header="Shared inventory">
            <SharedInventory :currentGameCharacters="gameStore.currentGame.characters" :readonly="false" @items-transferred="onItemsTransferred"></SharedInventory>
          </TabPanel>
        </TabView>
      </TabPanel>

      <TabPanel header="Game settings">
        <PlayersList :currentGame="gameStore.currentGame" :users="users" @update-players="onPlayersUpdated" class=" mt-3 mb-4"></PlayersList>
        <AddPlayer :currentGame="gameStore.currentGame" :users="users" @update-players="onPlayersUpdated" class=" mt-3 mb-4"></AddPlayer>
        <RemovePlayer :currentGame="gameStore.currentGame" :users="users" @update-players="onPlayersUpdated" class="mb-4"></RemovePlayer>
      </TabPanel>
    </TabView>
    
  </div>
  <div v-else>
    <Skeleton height="3rem" class="mb-2"></Skeleton>
    <Skeleton height="3rem" class="mb-2"></Skeleton>
    <Skeleton height="5rem" class="mb-2"></Skeleton>
    <div class="flex mt-3 ml-3 mr-3">
      <Skeleton height="40vh" width="50vw" class=""></Skeleton>
      <Skeleton height="40vh" width="50vw" class="ml-1"></Skeleton>
    </div>
    <div class="flex mt-2 mb-2 ml-3 mr-3">
      <Skeleton height="40vh" width="50vw" class=""></Skeleton>
      <Skeleton height="40vh" width="50vw" class="ml-1"></Skeleton>
    </div>
  </div>
</template>
<style scoped>
.topbar_back {
  position: static;
  top: 20px;
  z-index: 3000;
}

</style>