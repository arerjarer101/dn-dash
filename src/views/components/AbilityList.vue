<script setup>
import { ref, watch } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import { useGameStore } from '../../stores/GameStore';

const gameStore = useGameStore();
const props = defineProps(['readonly','abilities'])
const emit = defineEmits(['updateAbilities'])

// const abilities = ref(JSON.parse(JSON.stringify(props.abilities)))
if (!gameStore.currentCharData.abilities) gameStore.currentCharData.abilities = []

const newAbility = ref()
const abilityDialog = ref(false)
const submittedAbility = ref(false);
const selectedAbilities = ref()
const deleteAbilitiesDialog = ref(false)

const openAbilityDialog = () => {
  newAbility.value = { level: 1 }
  submittedAbility.value = false
  abilityDialog.value = true
};
const hideAbilityDialog = () => {
  abilityDialog.value = false
  submittedAbility.value = false
};
const addNewAbility = () => {
  submittedAbility.value = true;

  if (newAbility.value.name.trim()) {
    gameStore.currentCharData.abilities.push(newAbility.value);
    emit('updateAbilities', gameStore.currentCharData.abilities)
    abilityDialog.value = false;
    newAbility.value = {};
  }
};
const confirmDeleteSelected = () => {
  deleteAbilitiesDialog.value = true;
};
const deleteSelectedAbilities = () => {
  gameStore.currentCharData.abilities = gameStore.currentCharData.abilities.filter(val => !selectedAbilities.value.includes(val));
  deleteAbilitiesDialog.value = false;
  selectedAbilities.value = null;
  emit('updateAbilities', gameStore.currentCharData.abilities)
};

if (!gameStore.currentCharData.abilities) gameStore.currentCharData.abilities = []
const abilityColumns = ref([
  { field: 'name', header: 'Ability' },
  { field: 'tag', header: 'Type' },
  { field: 'difficulty', header: 'Difficulty' },
  { field: 'description', header: 'Description' },
])

const filters = ref({
  'tag': { value: null, matchMode: FilterMatchMode.EQUALS },
});

const abilityTags = ref(['attack', 'defence', 'spell', 'biography', 'style'])

const getTagStyle = (tag) => {
  switch (tag) {
    case 'attack':
      return 'background: var(--red-400)'
    case 'defence':
      return 'background: var(--yellow-400)'
    case 'style':
      return 'background: var(--indigo-400)'
    case 'biography':
      return 'background: var(--green-400)'
    case 'spell':
      return 'background: var(--cyan-400)'
    default:
      return 'background: var(--primary-400)'
  }
}

const onCellEditComplete = (event) => {
  let { data, newValue, field } = event;

  data[field] = newValue;
  emit('updateAbilities', gameStore.currentCharData.abilities)
};

const onRowReorder = (event) => {
  gameStore.currentCharData.abilities = event.value
  emit('updateAbilities', gameStore.currentCharData.abilities)
}

watch(() => props.abilities, () => {
  gameStore.currentCharData.abilities = JSON.parse(JSON.stringify(props.abilities))
}, { deep: true })


</script>

<template>
  <Fieldset class="mt-2" legend="Abilities" :toggleable="true">
    <Toolbar v-if="!props.readonly">
      <template #start>
        <Button label="New" icon="pi pi-plus" outlined severity="success" class="mr-2" @click="openAbilityDialog" />
        <Button label="Delete" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected"
          :disabled="!selectedAbilities || !selectedAbilities.length" />
      </template>
    </Toolbar>
    <DataTable v-model:filters="filters" :value="gameStore.currentCharData.abilities" :reordableColumns="true" @rowReorder="onRowReorder"
      v-model:selection="selectedAbilities" :metaKeySelection="false" editMode="cell" filterDisplay="row"
      @cell-edit-complete="onCellEditComplete" :pt="{
        table: { style: 'min-width: 50rem' },
        column: {
          bodycell: ({ state }) => ({
            class: [{ 'pt-0 pb-0': state['d_editing'] }]
          })
        }
      }">
      <!-- <template #header>
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText v-model="filters['global'].value" placeholder="Global Search" />
        </span>
      </template> -->
      <Column v-if="!props.readonly" rowReorder headerStyle="width: 3rem" />
      <Column v-if="!props.readonly" selectionMode="multiple" headerStyle="width: 3rem" />
      <Column headerStyle="width: 3rem" v-for="col, id of abilityColumns" :key="id" :field="col.field" sortable filter
        :header="col.header" :style="col.field === 'description' ? 'width: 70%' : 'width: 10%'">
        <template #body="{ data, field }">
          <div v-if="field !== 'tag'" :style="{ 'flex-grow': '1', 'overflow-wrap': 'break-word' }">
            {{ data[field] }}
          </div>
          <div class="flex justify-content-center mx-6" v-else
            :style="{ 'max-width': '5rem', 'flex-grow': '1', 'overflow-wrap': 'break-word' }">
            <Tag :value="data[field]" :style="getTagStyle(data[field])" class="text-lg"></Tag>
          </div>
        </template>

        <template v-if="col.field === 'tag'" #filter="{ filterModel, filterCallback }">
          <Dropdown v-model="filterModel.value" :options="abilityTags" placeholder="Select Type" @change="filterCallback"
            class="p-column-filter">
            <template #value="slotProps">
              <div v-if="slotProps.value" class="flex align-items-center">
                <Tag :value="slotProps.value" :style="getTagStyle(slotProps.value)" class="text-lg w-full"></Tag>
              </div>
            </template>

            <template #option="slotProps">
              <Tag :value="slotProps.option" :style="getTagStyle(slotProps.option)" class="text-lg w-full"></Tag>
            </template>
          </Dropdown>
        </template>

        <template v-if="!props.readonly" #editor="{ data, field }">
          <template v-if="field === 'difficulty'">
            <InputNumber v-model="data[field]" showButtons buttonLayout="vertical" style="width: 4rem" :min="0"
              autofocus />
          </template>

          <template v-else-if="field === 'description'">
            <Textarea v-model="data[field]" :rows="5" :cols="50" />
          </template>

          <template v-else-if="field === 'tag'">
            <Dropdown id="description" v-model="data[field]" :options="abilityTags" optionLabel="name"
              placeholder="Select a Tag">
              <template #value="slotProps">
                <div v-if="slotProps.value" class="flex align-items-center">
                  <Tag :value="slotProps.value" :style="getTagStyle(slotProps.value)" class="text-xl"></Tag>
                </div>
              </template>

              <template #option="slotProps">
                <Tag :value="slotProps.option" :style="getTagStyle(slotProps.option)" class="text-xl"></Tag>
              </template>
            </Dropdown>
          </template>

          <template v-else>
            <InputText v-model="data[field]" autofocus />
          </template>
        </template>
      </Column>
    </DataTable>
  </Fieldset>

  <Dialog v-model:visible="abilityDialog" :style="{ width: '45rem' }" header="Add a new ability" :modal="true"
    class="p-fluid">
    <div class="field">
      <label for="name">Name</label>
      <InputText id="name" v-model.trim="newAbility.name" required="true" autofocus
        :class="{ 'p-invalid': submittedAbility && !newAbility.name }" />
      <small class="p-error" v-if="submittedAbility && !newAbility.name">Name is required.</small>
    </div>
    <div class="field">
      <label for="difficulty">Difficulty</label>
      <InputNumber id="level" v-model="newAbility.difficulty" integeronly showButtons :min="0" />
    </div>
    <div class="field">
      <label for="description">Description</label>
      <Textarea id="description" v-model="newAbility.description" required="true" rows="3" cols="20" />
    </div>
    <div class="field">
      <label for="description">Type</label>
      <Dropdown id="description" v-model="newAbility.tag" :options="abilityTags" optionLabel="name"
        placeholder="Select a Tag">
        <template #value="slotProps">
          <div v-if="slotProps.value" class="flex align-items-center">
            <Tag :value="slotProps.value" :style="getTagStyle(slotProps.value)" class="text-2xl"></Tag>
          </div>
        </template>
        <template #option="slotProps">
          <Tag :value="slotProps.option" :style="getTagStyle(slotProps.option)" class="text-2xl"></Tag>
        </template>
      </Dropdown>
    </div>
    <template #footer>
      <Button label="Cancel" icon="pi pi-times" text @click="hideAbilityDialog" />
      <Button label="Save" icon="pi pi-check" text @click="addNewAbility" />
    </template>
  </Dialog>

  <Dialog v-model:visible="deleteAbilitiesDialog" :style="{ width: '45rem' }" header="Delete selected abilities"
    :modal="true">
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
      <span v-if="selectedAbilities">Are you sure you want to delete these abilities: <b
          v-for="ability, id in selectedAbilities" :key="id">&nbsp;{{ ability.name }}</b>?</span>
    </div>
    <template #footer>
      <Button label="No" icon="pi pi-times" text @click="deleteAbilitiesDialog = false" />
      <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedAbilities" />
    </template>
  </Dialog>
</template>

<style scoped>
.sdfs123123 {
  color: rgba(31, 109, 148, 0.664)
}
</style>