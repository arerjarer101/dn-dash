<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
	{
		label: 'Games',
		items: [
			{ label: 'Created', notPrimeIcon: true, id: 'bug', icon: 'pi-dna', to: '/created-games' },
			{ label: 'Participated', notPrimeIcon: true, id: 'qwe', icon: 'pi-qwe', to: '/participated-games' },
		]
	},
	{
		label: 'Home',
		items: [
			{ label: 'Profile', icon: 'pi pi-user', to: '/profile' },
			{ label: 'Initial View', icon: 'pi pi-eye', to: '/home' },
			{ label: 'Ui Settings', icon: 'pi pi-cog', to: '/ui-settings' },
		]
	},
]);
</script>

<template>
	<ul class="layout-menu">
		<template v-for="(item, i) in model" :key="item">
			<app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
			<li v-if="item.separator" class="menu-separator"></li>
		</template>
	</ul>
</template>

<style lang="scss" scoped></style>
