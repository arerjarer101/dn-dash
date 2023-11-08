<script setup>
import { ref, inject, watch } from 'vue';

const toast = inject('toast')

const props = defineProps(['skills'])
const emit = defineEmits(['updateSkills'])

const skills = ref(JSON.parse(JSON.stringify(props.skills)))
if (!skills.value) skills.value = []

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
    skills.value.push(newSkill.value);
    toast.add({ severity: 'success', summary: 'Successful', detail: 'New skill added!', life: 3000 });
    console.log('emit updateSkills', skills.value)
    emit('updateSkills', skills.value)
    skillDialog.value = false;
    newSkill.value = {};
  }
};
const confirmDeleteSelected = () => {
  deleteSkillsDialog.value = true;
};
const deleteSelectedSkills = () => {
  skills.value = skills.value.filter(val => !selectedSkills.value.includes(val));
  deleteSkillsDialog.value = false;
  selectedSkills.value = null;
  toast.add({ severity: 'success', summary: 'Deleted', detail: 'Selected skills deleted', life: 3000 });
  console.log('emit updateSkills', skills.value)
  emit('updateSkills', skills.value)
};

if (!skills.value) skills.value = []
const skillColumns = ref([
  { field: 'name', header: 'Skill' },
  { field: 'level', header: 'Level' },
  { field: 'description', header: 'Description' },
])

const onCellEditComplete = (event) => {
  let { data, newValue, field } = event;

  data[field] = newValue;
  console.log('emit updateSkills', skills.value)
  emit('updateSkills', skills.value)
};

const onRowReorder = (event) => {
  skills.value = event.value
  console.log('emit updateSkills', skills.value)
  emit('updateSkills', skills.value)
}

watch(() => props.skills, () => {
  skills.value = JSON.parse(JSON.stringify(props.skills))
}, { deep: true })


</script>

<template>
  <Fieldset class="mt-2" legend="Skills" :toggleable="true">
    <Toolbar>
      <template #start>
        <Button label="New" icon="pi pi-plus" severity="success" class="mr-2" @click="openSkillDialog" />
        <Button label="Delete" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected"
          :disabled="!selectedSkills || !selectedSkills.length" />
      </template>
    </Toolbar>
    <DataTable :value="skills" :reordableColumns="true" @rowReorder="onRowReorder" v-model:selection="selectedSkills"
      :metaKeySelection="false" editMode="cell" @cell-edit-complete="onCellEditComplete" :pt="{
        table: { style: 'min-width: 50rem' },
        column: {
          bodycell: ({ state }) => ({
            class: [{ 'pt-0 pb-0': state['d_editing'] }]
          })
        }
      }">
      <Column rowReorder headerStyle="width: 3rem" />
      <Column selectionMode="multiple" headerStyle="width: 3rem" />
      <Column headerStyle="width: 3rem" v-for="col, id of skillColumns" :key="id" :field="col.field" :header="col.header"
        :style="col.field === 'description' ? 'width: 75%' : col.field === 'name' ? 'width: 20%' : 'width: 5%'">
        <template #body="{ data, field }">
          <div :style="{ 'max-width': field === 'description' ? '20rem' : '5rem', 'flex-grow': '1', 'overflow-wrap': 'break-word'}">
            {{ data[field] }}
          </div>
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
  </Fieldset>

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
      <span v-if="selectedSkills">Are you sure you want to delete these skills: <b v-for="skill, id in selectedSkills"
          :key="id">&nbsp;{{ skill.name }}</b>?</span>
    </div>
    <template #footer>
      <Button label="No" icon="pi pi-times" text @click="deleteSkillsDialog = false" />
      <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedSkills" />
    </template>
  </Dialog>
</template>

<style scoped></style>