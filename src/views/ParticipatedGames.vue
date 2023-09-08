<script setup>
import { ref, onMounted, reactive } from 'vue'
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import Password from 'primevue/password';

const toast = useToast();
const apiURL = 'http://10.100.102.5:7070'
const user = ref('')

user.value = localStorage.user && JSON.parse(localStorage.user) 
console.log(localStorage.user)

const headers = reactive({ 'Authorization': 'Bearer ' + localStorage.accessToken })

onMounted(() => {

})

async function updateUser() {
  const newdata = user.value
  // newdata.newpassword = newdata.newpassword || newdata.oldpassword
  console.log('HEADERS:',headers)
  await axios({
    method: 'post',
    url: `${apiURL}/user/update`, 
    data: { newdata }, 
    headers: { 'Authorization': `Bearer ${localStorage.accessToken}` } 
  }).then(res => {
    toast.add({
      severity: 'success', summary: `User ${res.data.user.username} updated`, detail: `Goodbye!`, life: 3000
    });
    localStorage.user = JSON.stringify(res.data.user)
    console.log(res.message)
    newdata.newpassword = ''
    newdata.oldpassword = ''
  }).catch(error => {
    console.log(error.message)
    toast.add({
			severity: 'error', summary: 'An error occured when updating user data', detail: error.response.data.error, life: 10000
		});
  })
}

</script>

<template>
  <Toast></Toast>


</template>

<style scoped>
.block {
  
}
.token {
  max-width: inherit;
  overflow: scroll;
  word-wrap: break-word;
}
</style>