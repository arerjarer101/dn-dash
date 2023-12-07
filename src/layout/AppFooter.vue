<script setup>
import { useLayout } from '@/layout/composables/layout';
import { computed } from 'vue';

const { layoutConfig } = useLayout();
console.log('layoutConfig', layoutConfig.darkTheme.value)

const logoUrl = computed(() => {
	return `/layout/images/logo.svg`;
});
</script>

<template>
	<div class="layout-footer">
		<div class="logo">
			<a href="https://github.com/arerjarer101/dn-dash">
				<img :src="logoUrl" alt="Logo" height="30" class="mr-2" />
			</a>
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
