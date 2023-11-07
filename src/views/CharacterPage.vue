<script setup>
import axios from 'axios';
import { computed, inject, ref, toRaw } from 'vue';
import { useConfirm } from "primevue/useconfirm";

const toast = inject('toast')
const apiURL = import.meta.env.VITE_API_URL
const confirm = useConfirm();

const props = defineProps(['character', 'charData'])
const emit = defineEmits(['deleteCharacter', 'updateCharacter'])
const newCharacter = ref(JSON.parse(JSON.stringify(props.character)))
const newCharData = ref(JSON.parse(JSON.stringify(props.charData)))

const newSkill = ref()
const skillDialog = ref(false)
const submittedSkill = ref(false);
const selectedSkills = ref()
const deleteSkillsDialog = ref(false)

const openSkillDialog = () => {
  newSkill.value = { level: 1 }
  submittedSkill.value = false
  skillDialog.value = true
};
const hideSkillDialog = () => {
  skillDialog.value = false
  submittedSkill.value = false
};
const addNewSkill = () => {
  submittedSkill.value = true;

  if (newSkill.value.name.trim()) {
    // newSkill.value.id = newCharData.value.skills ? newCharData.value.skills.length + 1 : 1
    newCharData.value.skills.push(newSkill.value);
    toast.add({ severity: 'success', summary: 'Successful', detail: 'New skill added!', life: 3000 });

    skillDialog.value = false;
    newSkill.value = {};
  }
};
const confirmDeleteSelected = () => {
  deleteSkillsDialog.value = true;
};
const deleteSelectedSkills = () => {
  newCharData.value.skills = newCharData.value.skills.filter(val => !selectedSkills.value.includes(val));
  deleteSkillsDialog.value = false;
  selectedSkills.value = null;
  toast.add({ severity: 'success', summary: 'Deleted', detail: 'Selected skills deleted', life: 3000 });
};

if (!newCharData.value.skills) newCharData.value.skills = []
const skillColumns = ref([
  // { field: 'id', header: 'ID' },
  { field: 'name', header: 'Skill' },
  { field: 'level', header: 'Level' },
  { field: 'description', header: 'Description' },
])

const dataBio = computed(() => {
  return Object.entries(newCharData.value)
})

const onCellEditComplete = (event) => {
  let { data, newValue, field } = event;

  switch (field) {
    case 'level':
      data[field] = newValue;
      break;
    default:
      if (newValue.trim().length > 0) data[field] = newValue;
      else event.preventDefault();
      break;
  }
};

function onStateChanged($event) {
  console.log($event.explicitOriginalTarget.id)

  editedState.value[$event.explicitOriginalTarget.id] = true
}

function onReset() {
  newCharacter.value = JSON.parse(JSON.stringify(props.character))
  newCharData.value = JSON.parse(JSON.stringify(props.charData))
  if (!newCharData.value.skills) newCharData.value.skills = []
}

async function onDeleteCharacter() {
  confirmDeleteCharacter(props.character)
}

async function onUpdateCharacter() {
  await updateCharacter()
  emit('updateCharacter', props.character.name)
}

const confirmDeleteCharacter = (character) => {
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
      severity: 'success', summary: 'Deleted', detail: `Character ${updatedCharacter.name} was updated!`, life: 3000
    });
  }).catch(error => {
    console.log(error.message)
    toast.add({
      severity: 'error', summary: 'An error occured when updating the character', detail: error.response.data.error, life: 10000
    });
  })
}
</script>

<template>
  <div class="flex mb-5 mt-4">
    <span class="flex-2 flex flex-row gap-2 mr-5">
      <label class="mt-3" for="name">Name:</label>
      <InputText id="name" v-model="newCharacter.name" />
    </span>
    <span class="flex-2 flex flex-row gap-2 mr-5">
      <label class="mt-3" for="level">Level:</label>
      <InputNumber :inputStyle="{
        'max-width': '4rem'
      }" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" v-model="newCharData.level" inputId="level"
        mode="decimal" showButtons buttonLayout="horizontal" :min="0" />
    </span>
    <span class="flex gap-2 mr-2 mt-2">
      <label class="mt-2" for="colortag">Color tag:</label>
      <ColorPicker class="ml-2" id="colortag" v-model="newCharData.colortag" />
    </span>
  </div>
  <Splitter class="mb-5">
    <SplitterPanel class="p-3">
      <Fieldset legend="Biography" :toggleable="true">
        <div class="p-float-label flex flex-column gap-2 mb-4">
          <InputNumber v-model="newCharData.age" inputId="age" mode="decimal" showButtons :min="0" />
          <label for="age">Age</label>
        </div>
        <div class="p-float-label flex flex-column gap-2 mb-4">
          <InputText id="style" v-model="newCharData.style" />
          <label for="style">Style</label>
        </div>
        <div class="p-float-label flex flex-column gap-2 mb-4">
          <InputText id="ideals" v-model="newCharData.ideals" />
          <label for="ideals">Ideals</label>
        </div>
        <div class="p-float-label flex flex-column gap-2 mb-4">
          <InputText id="chartraits" v-model="newCharData.chartraits" />
          <label for="chartraits">Character traits</label>
        </div>
        <Fieldset legend="Story" :collapsed="true" :toggleable="true">
          <Textarea v-model="newCharData.story" cols="30"></Textarea>
        </Fieldset>
      </Fieldset>
      <Fieldset class="mt-3" legend="Skills" :collapsed="false" :toggleable="true">
        <Toolbar class="mb-4">
          <template #start>
            <Button label="New" icon="pi pi-plus" severity="success" class="mr-2" @click="openSkillDialog" />
            <Button label="Delete" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected"
              :disabled="!selectedSkills || !selectedSkills.length" />
          </template>
        </Toolbar>

        <DataTable :value="newCharData.skills" v-model:selection="selectedSkills" :dataKey="name" :metaKeySelection="true"
          editMode="cell" @cell-edit-complete="onCellEditComplete" :pt="{
            table: { style: 'min-width: 50rem' },
            column: {
              bodycell: ({ state }) => ({
                class: [{ 'pt-0 pb-0': state['d_editing'] }]
              })
            }
          }">
          <!-- <Column selectionMode="single" headerStyle="width: 3rem"></Column> -->
          <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
          <Column v-for="col, id of skillColumns" :key="id" :field="col.field" :header="col.header"
            :style="col.field === 'description' ? 'width: 75%' : col.field === 'name' ? 'width: 20%' : 'width: 5%'">
            <template #body="{ data, field }">
              <span>
                {{ data[field] }}
              </span>
            </template>
            <template #editor="{ data, field }">
              <template v-if="field === 'level'">
                <InputNumber v-model="data[field]" showButtons buttonLayout="vertical" style="width: 4rem" :min="0"
                  autofocus />
              </template>
              <template v-else-if="field === 'description'">
                <Textarea v-model="data[field]" :rows="5" :cols="50" />
              </template>
              <template v-else>
                <InputText v-model="data[field]" autofocus />
              </template>
            </template>
          </Column>
        </DataTable>

        <Dialog v-model:visible="skillDialog" :style="{ width: '45rem' }" header="Add a new skill" :modal="true"
          class="p-fluid">
          <div class="field">
            <label for="name">Name</label>
            <InputText id="name" v-model.trim="newSkill.name" required="true" autofocus
              :class="{ 'p-invalid': submittedSkill && !newSkill.name }" />
            <small class="p-error" v-if="submittedSkill && !newSkill.name">Name is required.</small>
          </div>
          <div class="field">
            <label for="level">Level</label>
            <InputNumber id="level" v-model="newSkill.level" integeronly showButtons :min="0" />
          </div>
          <div class="field">
            <label for="description">Description</label>
            <Textarea id="description" v-model="newSkill.description" required="true" rows="3" cols="20" />
          </div>
          <template #footer>
            <Button label="Cancel" icon="pi pi-times" text @click="hideSkillDialog" />
            <Button label="Save" icon="pi pi-check" text @click="addNewSkill" />
          </template>
        </Dialog>

        <Dialog v-model:visible="deleteSkillsDialog" :style="{ width: '45rem' }" header="Delete selected skills" :modal="true">
          <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="selectedSkills">Are you sure you want to delete these skills: <b v-for="skill, id in selectedSkills" :key="id">&nbsp;{{ skill.name }}</b>?</span>
          </div>
          <template #footer>
            <Button label="No" icon="pi pi-times" text @click="deleteSkillsDialog = false" />
            <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedSkills" />
          </template>
        </Dialog>
      </Fieldset>

    </SplitterPanel>
    <SplitterPanel class="p-3">
      <Fieldset legend="Header" :toggleable="true">
        <span class="p-float-label flex-1 flex flex-column gap-2 mr-2">
          <InputText id="bio" v-model="newCharData.bio" />
          <label for="bio">BIO</label>
        </span>
      </Fieldset>
    </SplitterPanel>
  </Splitter>

  <div class="mt-6 flex flex-row gap-2">
    <Button severity="danger" @click="onDeleteCharacter">Delete</Button>
    <Button severity="info" @click="onReset">Reset</Button>
    <Button @click="onUpdateCharacter">&nbsp;Save</Button>
  </div>
</template>

<style scoped>
.opacity_1 {
  opacity: 1;
}

.outline_edited {
  outline: purple 3px;
  color: rgb(29, 167, 155);
}

/* .input_field {
  width: 10rem;
} */
</style>