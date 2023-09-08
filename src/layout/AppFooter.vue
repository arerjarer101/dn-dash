<script setup>
import { useLayout } from '@/layout/composables/layout';
import { computed } from 'vue';

const { layoutConfig } = useLayout();

const logoUrl = computed(() => {
	return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});
</script>

<template>
	<div class="layout-footer">
		<div class="logo">
			<img :src="logoUrl" alt="Logo" height="20" class="mr-2" />
		</div>
		<kbd>crafted with<a href="https://primevue.org/" class="font-medium ml-2">PrimeVue</a>
		</kbd>
	</div>
</template>
<style lang="scss" scoped>
.logo {
	margin-top: 0.2rem;
	filter: drop-shadow(0 0 0.3rem var(--primary-color));
}

.logo img {
	filter: brightness(1.2) grayscale(20%) drop-shadow(0 0 0.2rem var(--primary-color));
}
</style>
