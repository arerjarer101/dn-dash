<script setup>
import axios from 'axios';
import { onMounted, ref, inject, toRaw, reactive } from 'vue';
import { useGameStore } from '../../stores/GameStore';

const gameStore = useGameStore();
const toast = inject('toast')
const apiURL = import.meta.env.VITE_API_URL
const props = defineProps(['readonly', 'currentGameCharacters'])
const emit = defineEmits(['itemsTransferred'])
console.log(props)

const characters = ref()
const mode = ref({
  source: '',
  target: ''
})

const selectedItems = reactive({
  left: [],
  right: []
})
const selectedCharacter = ref({
  left: {},
  right: {}
})

const transferItemsDialog = ref(false)
const transferParams = ref()

async function getCharactersWithItems() {

  await axios({
    method: 'get',
    url: `${apiURL}/game/${gameStore.currentGame.id}/characters/parsed`,
    // params: { refreshToken: localStorage.refreshToken },
    headers: { 'Authorization': `Bearer ${localStorage.accessToken}` }
  }).then(res => {
    characters.value = res.data.parsedCharacters
    // console.log('res.data.parsedCharacters', res.data.parsedCharacters)
    // console.log('got characters', characters.value[0].charData)
  }).catch((error) => {
    console.log(error)
  })
}

async function transferItems(transfer) {
  const data = transfer
  data.currentGameId = gameStore.currentGame.id
  data.creatorId = gameStore.currentGame.creatorId
  console.log(data)

  await axios({
    method: 'post',
    url: `${apiURL}/character/transfer/items`,
    data: {data},
    headers: { 'Authorization': `Bearer ${localStorage.accessToken}` }
  }).then(async res => {
    toast.add({ severity: 'success', summary: 'Transferred', detail: 'Selected items were transferred', life: 3000 })
    console.log('Items Transferred',res.data)
    emit('itemsTransferred')
    selectedCharacter.value[mode.value.source] = res.data.source
    selectedCharacter.value[mode.value.target] = res.data.target
  }).then(async () => {
    // await getCharactersWithItems()
  }).catch((error) => {
    console.log(error)
  })
}

function transfer(source, target) {
  mode.value.source = source;
  mode.value.target = target;

  transferParams.value = {
    sourceId: selectedCharacter.value[source].id,
    targetId: selectedCharacter.value[target].id,
    items: JSON.parse(JSON.stringify(selectedItems[source])),
    maxValue: selectedItems[source].map(e => e.amount)
  }
  transferItemsDialog.value = true;
  selectedItems[source] = []

}

async function transferSelectedItems() {
  console.log(toRaw(transferParams.value))

  transferItemsDialog.value = false;

  await transferItems(transferParams.value)

};

onMounted(async () => {
  // await getCharactersWithItems()
})

</script>

<template>
  <div class="flex align-items-stretch">
    <div class="flex-1 p-3">
      <Dropdown v-model="selectedCharacter.left" :options="selectedCharacter.right.id ? gameStore.currentGame.characters.filter(e => e.id !== selectedCharacter.right.id) : gameStore.currentGame.characters" optionLabel="name"  dataKey="id"
        placeholder="Select a Character" class="w-full mb-3" :pt="{
          root: {
            draggable: true
          }
        }" />
      <Listbox v-if="selectedCharacter.left.id" multiple v-model="selectedItems.left" :options="JSON.parse(selectedCharacter.left.charData).items" optionLabel="name" class="w-full mb-3" :metaKeySelection="true" :pt="{
        item: {
          draggable: true,
        }
      }" >
        <template #option="slotProps">
          <div class="flex align-items-center">
              <div class="flex-1">{{ slotProps.option.name }}</div>
              <div class="flex-1">{{ slotProps.option.amount }}</div>
          </div>
        </template>
      </Listbox>
      <Button :disabled="!(selectedCharacter.left.id && selectedCharacter.right.id && selectedItems.left.length)" label="Transfer selected >" 
        @click="() => {transfer('left', 'right')}"></Button>
    </div>
    <div class="flex-1 p-3">
      <Dropdown v-model="selectedCharacter.right" :options="selectedCharacter.left.id ? gameStore.currentGame.characters.filter(e => e.id !== selectedCharacter.left.id) : gameStore.currentGame.characters" optionLabel="name"  dataKey="id"
        placeholder="Select a Character" class="w-full mb-3" />
      <Listbox v-if="selectedCharacter.right.id" multiple v-model="selectedItems.right" :options="JSON.parse(selectedCharacter.right.charData).items" optionLabel="name" class="w-full mb-3" :pt="{
        item: {
          draggable: true
        }
      }">
        <template #option="slotProps">
          <div class="flex align-items-center">
              <div class="flex-1">{{ slotProps.option.name }}</div>
              <div class="flex-1">{{ slotProps.option.amount }}</div>
          </div>
        </template>
      </Listbox>
      <Button :disabled="!(selectedCharacter.left.id && selectedCharacter.right.id && selectedItems.right.length)" label="< Transfer selected" @click="() => {transfer('right', 'left')}"></Button>
    </div>
  </div>

  <Dialog v-model:visible="transferItemsDialog" :style="{ width: '45rem' }" header="Transfer selected items" :modal="true">
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
      <span class="mb-5">Select the amount of items to transfer</span>
      <Divider />
      <div v-for="item, id in transferParams.items" :key="id" class="grid align-items-center pl-5 pt-3 pr-5">
        <span class="col-2">{{ item.name }}</span>
        <InputNumber class="col-2" v-model="item.amount" showButtons :min="0" :max="transferParams.maxValue[id]" autofocus 
        :pt="{
          root: {style:'max-height: 4rem'},
          input: {style:'max-width: 6rem'},
        }"/>
      </div>
      <!-- {{transferParams}} -->
      
    </div>
    <template #footer>
      <Button label="No" icon="pi pi-times" text @click="transferItemsDialog = false" />
      <Button label="Yes" icon="pi pi-check" text @click="transferSelectedItems" />
    </template>
  </Dialog>
</template>

<style scoped></style>