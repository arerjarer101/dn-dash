<script setup>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';

const toast = useToast();


const text = ref();
const greet = () => {
  toast.add({
            severity: 'info',
            summary: 'Info Message', 
            detail: text.value, 
            delay: 3000,
            life: 3000
          })
}

</script>

<template>
    <Toast></Toast>
    <span class="p-float-label">
      <InputText id="txt" type="text" v-model="text" />
      <label for="txt">Text</label>
    </span>

    <Button label="Greet" @click="greet" icon="pi pi-user"></Button>
</template>

<style scoped>

</style>
