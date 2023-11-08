<script setup>
import axios from 'axios';
import { computed, inject, onBeforeMount, reactive, ref, toRaw } from 'vue';
import CharacterPage from './CharacterPage.vue';
import AddCharacter from './AddCharacter.vue';
import AddPlayer from './AddPlayer.vue';
import RemovePlayer from './RemovePlayer.vue';
import PlayersList from './PlayersList.vue';

const toast = inject('toast')
const apiURL = import.meta.env.VITE_API_URL

const currentGame = ref(JSON.parse(localStorage.currentGame))
const newGameData = ref(JSON.parse(localStorage.currentGame).gameData)

const newCharacter = reactive({})
const users = ref()

const charList = computed(() => {
	return currentGame.value.characters
})

onBeforeMount(async () => {
  await getUsers()
})

// onMounted(async () => {
//   await getUsers()
// })

async function addChar() {
	if(!newGameData.value.characters) newGameData.value.characters = []
	newGameData.value.characters.push(JSON.parse(JSON.stringify(newCharacter)))
	updateGameData(toRaw(newGameData.value), currentGame.value.id)
  Object.keys(newCharacter).forEach((key) => { newCharacter[key] = '' })
}

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

async function updateGameData(gameData, gameId) {
  const game = {
    id: gameId,
    gameData: gameData
  }

  await axios({
    method: 'post',
    url: `${apiURL}/game/update/gameData`, 
    data: { game }, 
    headers: { 'Authorization': `Bearer ${localStorage.accessToken}` } 
  }).then(res => {
    toast.add({
      severity: 'success', summary: `Added`, detail: `Character ${res.data} added`, life: 3000
    });

		console.log(res.data.updatedGame)
		currentGame.value = res.data.updatedGame
		localStorage.currentGame = JSON.stringify(res.data.updatedGame)
		newGameData.value = JSON.parse(localStorage.currentGame).gameData
    
  }).catch(error => {
    console.log(error.message)
    toast.add({
			severity: 'error', summary: 'An error occured when creating a game', detail: error.response.data.error, life: 10000
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
</script>

<template>
  <TabView :scrollable="true" :pt="{ panelContainer: { style: 'padding: 0;' } }">
    
    <TabPanel header="Characters">
			<TabView :scrollable="true" :pt="{ panelContainer: { style: 'padding: 0;' } }">
        <TabPanel :header="character.name" v-for="(character, charId) of charList" :key="charId">
          <CharacterPage 
          :character="character" 
          :charData="JSON.parse(character.charData)" 
          @delete-character="(name) => onCharacterDeleted(name)"
          @update-character="(name) => onCharacterUpdated(name)"></CharacterPage>
        </TabPanel>
        <!-- <TabPanel header="+old+">
          <Card class="mb-3">
            <template #title>Add a character</template>
            <template #content>
              <div class="flex flex-column gap-2 mb-4">
                <label for="name">Character name</label>
                <InputText id="username" v-model="newCharacter.name" aria-describedby="username-help" />
                <small id="name-help">A new challenger appears!</small>
              </div>

              <Button v-if="newCharacter.name" @click="addChar()" class="mr-2">Add char</Button>
              <Button v-else disabled class="mr-2">Add char</Button>
            </template>
          </Card>
        </TabPanel> -->
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
  </TabView>
</template>

<style scoped>
.topbar_back {
  position: static;
  top: 20px;
  z-index: 3000;
}

</style>