<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';
// import { useRouter } from 'vue-router';

const { layoutConfig, onMenuToggle } = useLayout();
const router = useRouter()
const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
// const router = useRouter();

onMounted(() => {
	bindOutsideClickListener();
});

onBeforeUnmount(() => {
	unbindOutsideClickListener();
});

const logoUrl = computed(() => {
	return `../../public/layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});

// const onTopBarMenuButton = () => {
// 	topbarMenuActive.value = !topbarMenuActive.value;
// };
// const onSettingsClick = () => {
// 	topbarMenuActive.value = false;
// 	router.push('/documentation');
// };
// const topbarMenuClasses = computed(() => {
// 	return {
// 		'layout-topbar-menu-mobile-active': topbarMenuActive.value
// 	};
// });

const routeBack = () => {
	router.back()
}

const bindOutsideClickListener = () => {
	if (!outsideClickListener.value) {
		outsideClickListener.value = (event) => {
			if (isOutsideClicked(event)) {
				topbarMenuActive.value = false;
			}
		};
		document.addEventListener('click', outsideClickListener.value);
	}
};
const unbindOutsideClickListener = () => {
	if (outsideClickListener.value) {
		document.removeEventListener('click', outsideClickListener);
		outsideClickListener.value = null;
	}
};
const isOutsideClicked = (event) => {
	if (!topbarMenuActive.value) return;

	const sidebarEl = document.querySelector('.layout-topbar-menu');
	const topbarEl = document.querySelector('.layout-topbar-menu-button');

	return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
};
</script>

<template>
	<div class="layout-topbar">
		<Button class="" @click="routeBack" >Back</Button>
		<!-- <router-link to="/" class="layout-topbar-logo ">
			<div class="logo">
				<img :src="logoUrl" alt="logo" />
			</div>
		</router-link> -->

		<button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
			<i class="pi pi-bars"></i>
		</button>

		<!-- <button class="p-link layout-topbar-menu-button layout-topbar-button mr-6" @click="onTopBarMenuButton()">
			<i class="pi pi-ellipsis-v"></i>
		</button>

		<div class="layout-topbar-menu mr-7" :class="topbarMenuClasses">
			<button @click="onTopBarMenuButton()" class="p-link layout-topbar-button">
				<i class="pi pi-calendar"></i>
				<span>Calendar</span>
			</button>
			<button @click="onTopBarMenuButton()" class="p-link layout-topbar-button">
				<i class="pi pi-user"></i>
				<span>Profile</span>
			</button>
			<button @click="onSettingsClick()" class="p-link layout-topbar-button">
				<i class="pi pi-cog"></i>
				<span>Settings</span>
			</button>
		</div> -->
	</div>
</template>

<style lang="scss" scoped>
.layout-topbar-logo {
	max-width: 4rem;
}

.logo {
	filter: drop-shadow(0 0 0.5rem var(--primary-color));
}

.logo img {
	filter: brightness(1.2) grayscale(20%) drop-shadow(0 0 0.7rem var(--primary-color));
}
</style>
