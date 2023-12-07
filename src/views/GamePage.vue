<script setup>
import axios from 'axios';
import { computed, inject, onBeforeMount, ref } from 'vue';
import CharacterPage from './CharacterPage.vue';
import AddCharacter from './AddCharacter.vue';
import AddPlayer from './AddPlayer.vue';
import RemovePlayer from './RemovePlayer.vue';
import PlayersList from './PlayersList.vue';
import SharedInventory from './components/SharedInventory.vue';

const toast = inject('toast')
const apiURL = import.meta.env.VITE_API_URL

const currentGame = ref(JSON.parse(localStorage.currentGame))
const newGameData = ref(JSON.parse(localStorage.currentGame).gameData)
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
		currentGame.value = res.data.updatedGame
		localStorage.currentGame = JSON.stringify(res.data.updatedGame)
		newGameData.value = JSON.parse(localStorage.currentGame).gameData
    
  }).catch(error => {
    toast.add({
			severity: 'error', summary: 'An error occured updating a game', detail: error.response.data.error, life: 10000
		});
  })
}

async function onCharactersUpdated() {
  console.log('characters updated')
  currentGame.value = JSON.parse(localStorage.currentGame)
}

async function onCharacterDeleted(name) {
  console.log('deleted character ',name)
  await getUpdatedGame(currentGame.value.id)
}

async function onCharacterUpdated(name) {
  console.log('updated character ',name)
  await getUpdatedGame(currentGame.value.id)
}

async function onPlayersUpdated(updatedGame) {
  console.log('emitted updatedGame', updatedGame)
  currentGame.value = JSON.parse(localStorage.currentGame)
}

async function onItemsTransferred() {
  await getUpdatedGame(currentGame.value.id)
}
</script>

<template>
  <TabView :scrollable="true" :pt="{ panelContainer: { style: 'padding: 0;' } }">
    <TabPanel header="Characters">
			<TabView :scrollable="true" class="z-5 mb-3" :pt="{ 
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
          <AddCharacter :currentGame="currentGame" @update-characters="onCharactersUpdated"></AddCharacter>
        </TabPanel>
      </TabView>
		</TabPanel>

		<TabPanel header="Game settings">
      <PlayersList :currentGame="currentGame" :users="users" @update-players="onPlayersUpdated" class=" mt-3 mb-4"></PlayersList>
      <AddPlayer :currentGame="currentGame" :users="users" @update-players="onPlayersUpdated" class=" mt-3 mb-4"></AddPlayer>
      <RemovePlayer :currentGame="currentGame" :users="users" @update-players="onPlayersUpdated" class="mb-4"></RemovePlayer>
		</TabPanel>

    <TabPanel v-if="currentGame.characters.length > 0" header="Shared inventory">
      <SharedInventory :currentGameCharacters="currentGame.characters" :readonly="false" @items-transferred="onItemsTransferred"></SharedInventory>
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