<script setup>
import { ref, inject, watch } from 'vue';

const toast = inject('toast')

const props = defineProps(['readonly', 'effects'])
const emit = defineEmits(['updateEffects'])

const effects = ref(JSON.parse(JSON.stringify(props.effects)))
if (!effects.value) effects.value = []

const newEffects = ref()
const effectDialog = ref(false)
const submittedEffects = ref(false);
const selectedEffects = ref()
const deleteEffectsDialog = ref(false)

const openEffectsDialog = () => {
  newEffects.value = { level: 1 }
  submittedEffects.value = false
  effectDialog.value = true
};
const hideEffectsDialog = () => {
  effectDialog.value = false
  submittedEffects.value = false
};
const addNewEffects = () => {
  submittedEffects.value = true;

  if (newEffects.value.name.trim()) {
    effects.value.push(newEffects.value);
    toast.add({ severity: 'success', summary: 'Successful', detail: 'New effect added!', life: 3000 });
    console.log('emit updateEffects', effects.value)
    emit('updateEffects', effects.value)
    effectDialog.value = false;
    newEffects.value = {};
  }
};
const confirmDeleteSelected = () => {
  deleteEffectsDialog.value = true;
};
const deleteSelectedEffects = () => {
  effects.value = effects.value.filter(val => !selectedEffects.value.includes(val));
  deleteEffectsDialog.value = false;
  selectedEffects.value = null;
  toast.add({ severity: 'success', summary: 'Deleted', detail: 'Selected effects deleted', life: 3000 });
  console.log('emit updateEffects', effects.value)
  emit('updateEffects', effects.value)
};

if (!effects.value) effects.value = []
const effectColumns = ref([
  { field: 'name', header: 'Effect' },
  { field: 'description', header: 'Description' },
])

const onCellEditComplete = (event) => {
  let { data, newValue, field } = event;
  data[field] = newValue

  console.log('emit updateEffects', effects.value)
  emit('updateEffects', effects.value)
};

const onRowReorder = (event) => {
  effects.value = event.value
  console.log('emit updateEffects', effects.value)
  emit('updateEffects', effects.value)
}

watch(() => props.effects, () => {
  effects.value = JSON.parse(JSON.stringify(props.effects))
}, { deep: true })


</script>

<template>
  <Fieldset class="mt-2" legend="Effects" :toggleable="true">
    <Toolbar v-if="!props.readonly">
      <template #start>
        <Button label="New" icon="pi pi-plus" outlined severity="success" class="mr-2" @click="openEffectsDialog" />
        <Button label="Delete" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected"
          :disabled="!selectedEffects || !selectedEffects.length" />
      </template>
    </Toolbar>
    <DataTable :value="effects" :reordableColumns="true" @rowReorder="onRowReorder" v-model:selection="selectedEffects"
      :metaKeySelection="false" editMode="cell" @cell-edit-complete="onCellEditComplete" :pt="{
        table: { style: 'min-width: 50rem' },
        column: {
          bodycell: ({ state }) => ({
            class: [{ 'pt-0 pb-0': state['d_editing'] }]
          })
        }
      }">
      <Column v-if="!props.readonly" rowReorder headerStyle="width: 3rem" />
      <Column v-if="!props.readonly" selectionMode="multiple" headerStyle="width: 3rem" />
      <Column v-for="col, id of effectColumns" :key="id" :field="col.field" :header="col.header"
        :style="col.field === 'description' ? 'width: 80%' :'width: 20%'">
        <template #body="{ data, field }">
          <div :style="{ 'max-width': field === 'description' ? '20rem' : '10rem', 'flex-grow': '1', 'overflow-wrap': 'break-word'}">
            {{ data[field] }}
          </div>
        </template>
        <template v-if="!props.readonly" #editor="{ data, field }">
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

  <Dialog v-model:visible="effectDialog" :style="{ width: '45rem' }" header="Add a new effect" :modal="true"
    class="p-fluid">
    <div class="field">
      <label for="name">Name</label>
      <InputText id="name" v-model.trim="newEffects.name" required="true" autofocus
        :class="{ 'p-invalid': submittedEffects && !newEffects.name }" />
      <small class="p-error" v-if="submittedEffects && !newEffects.name">Name is required.</small>
    </div>
    <div class="field">
      <label for="level">Level</label>
      <InputNumber id="level" v-model="newEffects.level" integeronly showButtons :min="0" />
    </div>
    <div class="field">
      <label for="description">Description</label>
      <Textarea id="description" v-model="newEffects.description" required="true" rows="3" cols="20" />
    </div>
    <template #footer>
      <Button label="Cancel" icon="pi pi-times" text @click="hideEffectsDialog" />
      <Button label="Save" icon="pi pi-check" text @click="addNewEffects" />
    </template>
  </Dialog>

  <Dialog v-model:visible="deleteEffectsDialog" :style="{ width: '45rem' }" header="Delete selected effects" :modal="true">
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
      <span v-if="selectedEffects">Are you sure you want to delete these effects: <b v-for="effect, id in selectedEffects"
          :key="id">&nbsp;{{ effect.name }}</b>?</span>
    </div>
    <template #footer>
      <Button label="No" icon="pi pi-times" text @click="deleteEffectsDialog = false" />
      <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedEffects" />
    </template>
  </Dialog>
</template>

<style scoped></style>