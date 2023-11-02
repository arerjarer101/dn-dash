<script setup>
import { useLayout } from '@/layout/composables/layout';
import { computed } from 'vue';

const { layoutConfig } = useLayout();
console.log('layoutConfig', layoutConfig)

const logoUrl = computed(() => {
	return `../../public/layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});
</script>

<template>
	<div class="layout-footer">
		<div class="logo">
			<img :src="logoUrl" alt="Logo" height="30" class="mr-2" />
		</div>
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
