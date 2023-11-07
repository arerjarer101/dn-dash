<script setup>
import axios from 'axios';
import { reactive, ref, inject } from 'vue';

const toast = inject('toast')
const apiURL = import.meta.env.VITE_API_URL

const props = defineProps(['currentGame'])
const emit = defineEmits(['updateCharacters'])
const newCharacter = reactive({})
const newCharData = reactive({})
const isNPC = ref(false)
const selectedPlayer = ref({})

async function addChar() {
  await createCharacter()
  emit('updateCharacters')
}

async function createCharacter() {
  const character = {
    playerId: selectedPlayer.value.id,
    name: newCharacter.name,
    charData: newCharData
  }
  await axios({
    method: 'post',
    url: `${apiURL}/character/create`, 
    data: { character }, 
    headers: { 'Authorization': `Bearer ${localStorage.accessToken}` } 
  }).then(async res => {
    toast.add({
      severity: 'success', summary: `Added`, detail: `Character ${res.data.createdCharacter.name} added`, life: 3000
    });
		console.log(res.data.createdCharacter)
    await addCharacter(res.data.createdCharacter.id)
  }).catch(error => {
    console.log(error.message)
    toast.add({
			severity: 'error', summary: 'An error occured when creating a character', detail: error.response.data.error, life: 10000
		});
  })
}

async function addCharacter(characterId) {
  const data = {
    characterId: characterId,
    gameId: props.currentGame.id
  }
  await axios({
    method: 'post',
    url: `${apiURL}/game/add/character`, 
    data: { data }, 
    headers: { 'Authorization': `Bearer ${localStorage.accessToken}` } 
  }).then(res => {
    toast.add({
      severity: 'success', summary: `Added`, detail: `Character added to game ${res.data.updatedGame.name}`, life: 3000
    });
		console.log(res.data.updatedGame)
    localStorage.currentGame = JSON.stringify(res.data.updatedGame)
  }).catch(error => {
    console.log(error.message)
    toast.add({
			severity: 'error', summary: `An error occured when adding a character to the game`, detail: error.response.data.error, life: 10000
		});
  })
}
</script>

<template>
  <Card class="mb-3">
    <template #title>Add a character</template>
    <template #content>
      <div class="flex flex-column gap-2 mb-4">
        <label for="name">Character name</label>
        <InputText id="username" v-model="newCharacter.name" aria-describedby="username-help" />
        <small id="name-help">A new challenger appears!</small>
      </div>
      <div class="flex align-items-center mb-4">
        <Checkbox disabled v-model="isNPC" :binary="true" />
        <label for="ingredient1" class="ml-2">This character is an NPC</label>
      </div>
      <div v-if="!isNPC" class="flex flex-column gap-2 mb-4">
        <label for="name">Player</label>
        <Dropdown v-model="selectedPlayer" :options="props.currentGame.players" optionLabel="username" placeholder="Select a Player" class="w-full md:w-14rem" />
        <small id="name-help">Who will play for this character?</small>
      </div>
      <div class="flex flex-column gap-2 mb-4">
        <label for="level">Level</label>
        <InputNumber v-model="newCharData.level" inputId="level" mode="decimal" showButtons :min="0"/>
      </div>
      <div class="flex flex-column gap-2 mb-4">
        <label for="colortag">Color tag</label>
        <ColorPicker id="colortag" v-model="newCharData.colortag" />
      </div>
      <div class="flex flex-column gap-2 mb-4">
        <label for="age">Age</label>
        <InputNumber v-model="newCharData.age" inputId="age" mode="decimal" showButtons :min="0"/>
      </div>
      <div class="flex flex-column gap-2 mb-4">
        <label for="style">Style</label>
        <InputText id="style" v-model="newCharData.style" />
      </div>
      <div class="flex flex-column gap-2 mb-4">
        <label for="ideals">Ideals</label>
        <InputText id="ideals" v-model="newCharData.ideals" />
      </div>
      <div class="flex flex-column gap-2 mb-4">
        <label for="chartraits">Character traits</label>
        <InputText id="chartraits" v-model="newCharData.chartraits" />
      </div>

      <Button v-if="newCharacter.name" @click="addChar()" class="mr-2">Add char</Button>
      <Button v-else disabled class="mr-2">Add char</Button>
    </template>
  </Card>
</template>

<style scoped></style>