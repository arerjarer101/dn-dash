<script setup>
import axios from 'axios';
import { inject } from 'vue';

const toast = inject('toast')
const apiURL = import.meta.env.VITE_API_URL

const props = defineProps(['character'])
const emit = defineEmits(['deleteCharacter'])

async function onDeleteCharacter() {
  await deleteCharacter()
  emit('deleteCharacter', props.character.name)
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


</script>

<template>
  <p>
    {{props.character}}
  </p>
  <Button severity="danger" @click="onDeleteCharacter" >Delete</Button>
</template>

<style scoped></style>