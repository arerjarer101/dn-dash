<script setup>
import { ref, inject, watch } from 'vue';

const toast = inject('toast')

const props = defineProps(['readonly', 'items'])
const emit = defineEmits(['updateItems'])

const items = ref(JSON.parse(JSON.stringify(props.items)))
if (!items.value) items.value = []

const newItem = ref()
const itemDialog = ref(false)
const submittedItem = ref(false);
const selectedItems = ref()
const deleteItemsDialog = ref(false)

const openItemDialog = () => {
  newItem.value = { amount: 1 }
  submittedItem.value = false
  itemDialog.value = true
};
const hideItemDialog = () => {
  itemDialog.value = false
  submittedItem.value = false
};
const addNewItem = () => {
  submittedItem.value = true;

  if (isNameDuplicate(newItem.value.name)) {
    toast.add({ severity: 'error', summary: 'Already Exists!', detail: `Item ${newItem.value.name} already exists`, life: 3000 });
    itemDialog.value = false;
    newItem.value = {};
    return;
  }

  if (newItem.value.name.trim()) {
    items.value.push(newItem.value);
    toast.add({ severity: 'success', summary: 'Successful', detail: 'New item added!', life: 3000 });
    console.log('emit updateItems', items.value)
    emit('updateItems', items.value)
    itemDialog.value = false;
    newItem.value = {};
  }
};
const confirmDeleteSelected = () => {
  deleteItemsDialog.value = true;
};
const deleteSelectedItems = () => {
  items.value = items.value.filter(val => !selectedItems.value.includes(val));
  deleteItemsDialog.value = false;
  selectedItems.value = null;
  toast.add({ severity: 'success', summary: 'Deleted', detail: 'Selected items deleted', life: 3000 });
  console.log('emit updateItems', items.value)
  emit('updateItems', items.value)
};

if (!items.value) items.value = []
const itemColumns = ref([
  { field: 'name', header: 'Item' },
  { field: 'amount', header: 'Amount' },
  { field: 'description', header: 'Description' },
  { field: 'equipped', header: 'Equipped' },
])

const onCellEditComplete = (event) => {
  let { data, newValue, field } = event;
  if (field === 'name' && data[field] !== newValue && isNameDuplicate(newValue)) {
    toast.add({ severity: 'error', summary: 'Already Exists!', detail: `Item ${newValue} already exists`, life: 3000 });
    return;
  }
  data[field] = newValue
  console.log('emit updateItems', items.value)
  emit('updateItems', items.value)
};

const onRowReorder = (event) => {
  items.value = event.value
  console.log('emit updateItems', items.value)
  emit('updateItems', items.value)
}

const isNameDuplicate = (name) => {
  return items.value.findIndex(e => e.name === name) >= 0
}

const setEquippedItemStyle = (data) => {
  let style = ''
  let color = 'var(--primary-600)'
  if(data.equipped) style = `background-image: linear-gradient(to right, ${color}, color-mix(in srgb, ${color} 30%, transparent) 5%, color-mix(in srgb, ${color} 1%, transparent) 10%, color-mix(in srgb, ${color} 2%, transparent) 75%, color-mix(in srgb, ${color} 20%, transparent) 90%, ${color});`
  return style
}

watch(() => props.items, () => {
  if(props.items) items.value = JSON.parse(JSON.stringify(props.items))
}, { deep: true })


</script>

<template>
  <Fieldset class="mt-2" legend="Items" :toggleable="true">
    <Toolbar v-if="!props.readonly">
      <template #start>
        <Button label="New" icon="pi pi-plus" outlined severity="success" class="mr-2" @click="openItemDialog" />
        <Button label="Delete" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected"
          :disabled="!selectedItems || !selectedItems.length" />
      </template>
    </Toolbar>
    <DataTable :value="items" :reordableColumns="true" @rowReorder="onRowReorder" v-model:selection="selectedItems"
      :metaKeySelection="false" editMode="cell" @cell-edit-complete="onCellEditComplete"
      :rowStyle="setEquippedItemStyle"
      @cell-edit-init="(data)=> {if (data.field === 'equipped') data.data.equipped = !data.data.equipped}"
      :pt="{
        table: { style: 'min-width: 50rem' },
        column: {
          bodycell: ({ state }) => ({
            class: [{ 'pt-0 pb-0': state['d_editing'] }]
          })
        }
      }">
      <Column v-if="!props.readonly" rowReorder headerStyle="width: 3rem" />
      <Column v-if="!props.readonly" selectionMode="multiple" headerStyle="width: 3rem" />
      <Column v-for="col, id of itemColumns" :key="id" :field="col.field" :header="col.header"
        :style="col.field === 'description' ? 'width: 70%' : col.field === 'name' ? 'width: 20%' : 'width: 5%'">
        <template #body="{ data, field }">
          <Checkbox v-if="field === 'equipped'"  readonly v-model="data[field]" :binary="true" />
          <div v-else :style="{ 'max-width': field === 'description' ? '20rem' : '5rem', 'flex-grow': '1', 'overflow-wrap': 'break-word'}">
            {{ data[field] }}
          </div>
        </template>
        <template v-if="!props.readonly" #editor="{ data, field }">
          <template v-if="field === 'amount'">
            <InputNumber v-model="data[field]" showButtons :min="0"
              autofocus />
          </template>
          <template v-else-if="field === 'description'">
            <Textarea v-model="data[field]" :rows="5" :cols="50" />
          </template>
          <template v-else-if="field === 'equipped'">
            <Checkbox v-model="data[field]" :binary="true" />
          </template>
          <template v-else>
            <InputText v-model="data[field]" autofocus />
          </template>
        </template>
      </Column>
    </DataTable>
  </Fieldset>

  <Dialog v-model:visible="itemDialog" :style="{ width: '45rem' }" header="Add a new item" :modal="true"
    class="p-fluid">
    <div class="field">
      <label for="name">Name</label>
      <InputText id="name" v-model.trim="newItem.name" required="true" autofocus
        :class="{ 'p-invalid': submittedItem && !newItem.name }" />
      <small class="p-error" v-if="submittedItem && !newItem.name">Name is required.</small>
    </div>
    <div class="field">
      <label for="amount">Amount</label>
      <InputNumber id="amount" v-model="newItem.amount" integeronly showButtons :min="0" />
    </div>
    <div class="field">
      <label for="description">Description</label>
      <Textarea id="description" v-model="newItem.description" required="true" rows="3" cols="20" />
    </div>
    <div class="field flex mt-5">
      <label for="equipped">Equipped</label>
      <Checkbox class="ml-2" v-model="newItem.equipped" :binary="true" />
    </div>
    <template #footer>
      <Button label="Cancel" icon="pi pi-times" text @click="hideItemDialog" />
      <Button label="Save" icon="pi pi-check" text @click="addNewItem" />
    </template>
  </Dialog>

  <Dialog v-model:visible="deleteItemsDialog" :style="{ width: '45rem' }" header="Delete selected items" :modal="true">
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
      <span v-if="selectedItems">Are you sure you want to delete these items: <b v-for="item, id in selectedItems"
          :key="id">&nbsp;{{ item.name }}</b>?</span>
    </div>
    <template #footer>
      <Button label="No" icon="pi pi-times" text @click="deleteItemsDialog = false" />
      <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedItems" />
    </template>
  </Dialog>
</template>

<style scoped></style>