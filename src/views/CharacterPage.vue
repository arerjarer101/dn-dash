<script setup>
import axios from 'axios';
import { inject, ref, toRaw } from 'vue';
import { useConfirm } from "primevue/useconfirm";
import SkillList from './components/SkillsList.vue'
import InventoryList from './components/InventoryList.vue'
import EffectList from './components/EffectList.vue'
import AbilityList from './components/AbilityList.vue'
// import { useGameStore } from '../stores/GameStore';

// const gameStore = useGameStore();


const toast = inject('toast')
const apiURL = import.meta.env.VITE_API_URL
const confirm = useConfirm();

const props = defineProps(['readonly', 'character', 'charData'])
const emit = defineEmits(['deleteCharacter', 'updateCharacter'])

const newCharacter = ref(JSON.parse(JSON.stringify(props.character)))
const newCharData = ref(JSON.parse(JSON.stringify(props.charData)))

if (!newCharData.value.skills) newCharData.value.skills = []
if (!newCharData.value.items) newCharData.value.items = []
if (!newCharData.value.effects) newCharData.value.effects = []
if (!newCharData.value.abilities) newCharData.value.abilities = []

function onReset() {
  newCharacter.value = JSON.parse(JSON.stringify(props.character))
  newCharData.value = JSON.parse(JSON.stringify(props.charData))
  if (!newCharData.value.skills) newCharData.value.skills = []
  if (!newCharData.value.items) newCharData.value.items = []
  if (!newCharData.value.effects) newCharData.value.effects = []
  if (!newCharData.value.abilities) newCharData.value.abilities = []
}

async function onDeleteCharacter() {
  confirmDeleteCharacter(props.character)
}

async function onUpdateCharacter() {
  await updateCharacter()
  emit('updateCharacter', props.character.name)
}

const confirmDeleteCharacter = () => {
  confirm.require({
    message: 'Are you sure you want to proceed?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    defaultFocus: 'reject',
    accept: async () => {
      await deleteCharacter()
      emit('deleteCharacter', props.character.name)
    },
    reject: () => {
      toast.add({ severity: 'info', summary: 'Cancelled', detail: 'Action cancelled', life: 5000 });
    }
  });
}

const toggleItem = async (characterId, itemName) => {
  await axios({
    method: 'post',
    url: `${apiURL}/character/toggle/item`,
    data: { characterId, itemName },
    headers: { 'Authorization': `Bearer ${localStorage.accessToken}` }
  }).then(res => {
    const updatedCharacter = res.data.updatedCharacter
    console.log(updatedCharacter)
    toast.add({
      severity: 'success', summary: 'Updated', detail: `Character ${updatedCharacter.name} was updated!`, life: 3000
    });
  }).catch(error => {
    console.log(error.message)
    toast.add({
      severity: 'error', summary: 'An error occured when updating character', detail: error.response.data.error, life: 10000
    });
  })
}

async function deleteCharacter() {
  const character = {
    id: props.character.id
  }
  await axios({
    method: 'post',
    url: `${apiURL}/character/delete`,
    data: { character },
    headers: { 'Authorization': `Bearer ${localStorage.accessToken}` }
  }).then(res => {
    const deletedCharacter = res.data.deletedCharacter
    console.log(deletedCharacter)
    toast.add({
      severity: 'success', summary: 'Deleted', detail: `Character ${deletedCharacter.name} was deleted!`, life: 3000
    });
  }).catch(error => {
    console.log(error.message)
    toast.add({
      severity: 'error', summary: 'An error occured when deleting the game', detail: error.response.data.error, life: 10000
    });
  })
}

async function updateCharacter() {
  const character = {
    id: props.character.id,
    name: newCharacter.value.name,
    charData: toRaw(newCharData.value)
  }

  await axios({
    method: 'post',
    url: `${apiURL}/character/update`,
    data: { character },
    headers: { 'Authorization': `Bearer ${localStorage.accessToken}` }
  }).then(res => {
    const updatedCharacter = res.data.updatedCharacter
    console.log(updatedCharacter)
    toast.add({
      severity: 'success', summary: 'Updated', detail: `Character ${updatedCharacter.name} was updated!`, life: 3000
    });
  }).catch(error => {
    console.log(error.message)
    toast.add({
      severity: 'error', summary: 'An error occured when updating the character', detail: error.response.data.error, life: 10000
    });
  })
}

// async function showCharacter() {
//   await axios({
//     method: 'get',
//     url: `${apiURL}/character/show/${props.character.id}`,
//     headers: { 'Authorization': `Bearer ${localStorage.accessToken}` }
//   }).then(res => {
//     const updatedCharacter = res.data
//     console.log(updatedCharacter)
//     toast.add({
//       severity: 'success', summary: 'Updated', detail: `Character ${updatedCharacter.name} was updated!`, life: 3000
//     });
//   }).catch(error => {
//     console.log(error.message)
//     toast.add({
//       severity: 'error', summary: 'An error occured when updating the character', detail: error.response.data.error, life: 10000
//     });
//   })
// }

function onSkillsUpdated(updatedSkills) {
  console.log('updatedSkills', updatedSkills)
  newCharData.value.skills = updatedSkills
}

function onItemsUpdated(updatedItems) {
  console.log('updatedItems', updatedItems)
  newCharData.value.items = updatedItems
}

function onEffectsUpdated(updatedEffects) {
  console.log('updatedEffects', updatedEffects)
  newCharData.value.effects = updatedEffects
}

function onAbilitiesUpdated(updatedAbilities) {
  console.log('updatedAbilities', updatedAbilities)
  newCharData.value.abilities = updatedAbilities
}

</script>

<template>
  <!-- <div>{{gameStore.currentCharacter}}</div> -->
  <!-- <div>{{gameStore.currentCharData}}</div> -->

  <div v-if="!props.readonly" class="surface-section border-bottom-1 border-noround-bottom surface-border xl:sticky lg:sticky md:relative sm:relative z-4" style="height: 6.5rem; top: 5rem;">
    <Toolbar class="surface-section border-none xl:sticky lg:sticky md:relative sm:relative z-4" style="top: 6.5rem; ">
      <template #start>
          <span class="mr-3">
            <label class="mr-2" for="name">Name:</label>
            <InputText id="name" v-model="newCharacter.name" />
          </span>
          <span class="mr-3">
            <label class="mr-2" for="level">Level:</label>
            <InputNumber :inputStyle="{
              'max-width': '4rem'
            }" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" v-model="newCharData.level"
              inputId="level" mode="decimal" showButtons buttonLayout="horizontal" :min="0" />
          </span>
          <span>
            <label class="mr-2" for="colortag">Color tag:</label>
            <ColorPicker id="colortag" v-model="newCharData.colortag" />
          </span>
        <!-- <Divider class="mt-1 mb-0" /> -->
      </template>
      <template #end>
          <Button class="mr-2 lg:mt-0 sm:mt-2" severity="success" @click="onUpdateCharacter">&nbsp;Save</Button>
          <Button class="mr-2 lg:mt-0 sm:mt-2" severity="info" outlined @click="onReset">Discard changes</Button>
          <Button class="mr-2 lg:mt-0 sm:mt-2" severity="danger" outlined @click="onDeleteCharacter">Delete</Button>
        <!-- <Divider class="mt-1 mb-0" /> -->
      </template>
    </Toolbar>
  </div>
  <Splitter class="surface-ground" style="border: none;">
    <SplitterPanel class="p-3 pt-5">
      <Fieldset class="pt-3" legend="Biography" :toggleable="true">
        <div class="p-float-label flex flex-column gap-2 mb-4">
          <InputNumber :readonly="props.readonly" :showButtons="!props.readonly" v-model="newCharData.age" inputId="age" mode="decimal"  :min="0" />
          <label for="age">Age</label>
        </div>
        <div class="p-float-label flex flex-column gap-2 mb-4">
          <InputText :readonly="props.readonly" id="style" v-model="newCharData.style" />
          <label for="style">Style</label>
        </div>
        <div class="p-float-label flex flex-column gap-2 mb-4">
          <InputText :readonly="props.readonly" id="ideals" v-model="newCharData.ideals" />
          <label for="ideals">Ideals</label>
        </div>
        <div class="p-float-label flex flex-column gap-2 mb-4">
          <InputText :readonly="props.readonly" id="chartraits" v-model="newCharData.chartraits" />
          <label for="chartraits">Character traits</label>
        </div>
        <Fieldset legend="Story" :collapsed="true" :toggleable="true">
          <Textarea :readonly="props.readonly" v-model="newCharData.story" cols="30"></Textarea>
        </Fieldset>
      </Fieldset>
      <SkillList :readonly="props.readonly" :skills="newCharData.skills" @update-skills="onSkillsUpdated"></SkillList>
      <AbilityList :readonly="props.readonly" :abilities="newCharData.abilities" @update-abilities="onAbilitiesUpdated"></AbilityList>
    </SplitterPanel>
    <SplitterPanel class="p-3 pt-5">
      <Fieldset class="pt-3" legend="Assets" :toggleable="true">
        <div class="p-float-label flex flex-column gap-2 mb-4">
          <InputNumber :readonly="props.readonly" :showButtons="!props.readonly" v-model="newCharData.money" inputId="money" mode="decimal" :min="0" />
          <label for="money">Money</label>
        </div>
        <div class="p-float-label flex flex-column gap-2 mb-4">
          <InputNumber :readonly="props.readonly" :showButtons="!props.readonly" v-model="newCharData.destiny" inputId="destiny" mode="decimal" :min="0" />
          <label for="destiny">Destiny Points</label>
        </div>
        <div class="p-float-label flex flex-column gap-2 mb-4">
          <InputNumber :readonly="props.readonly" :showButtons="!props.readonly" v-model="newCharData.durability" inputId="durability" mode="decimal" :min="0" />
          <label for="durability">Durability</label>
        </div>
      </Fieldset>
      <InventoryList :readonly="props.readonly" @toggle-item="async (itemName) => await toggleItem(props.character.id, itemName)" @update-items="onItemsUpdated"></InventoryList>

      <EffectList :readonly="props.readonly" :effects="newCharData.effects" @update-effects="onEffectsUpdated"></EffectList>
    </SplitterPanel>
  </Splitter>
</template>

<style scoped></style>