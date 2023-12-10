<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';
// import { useRouter } from 'vue-router';

const { onMenuToggle } = useLayout();
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

// const logoUrl = computed(() => {
// 	return `/layout/images/logo.svg`;
// });

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
	<div class="layout-topbar surface-ground surface-border" style="height: 3rem; border-bottom: 1px solid; border-top: 1px solid">
		<!-- <router-link to="/created-games" class="layout-topbar-logo ">
			<div class="logo">
				<img :src="logoUrl" alt="logo" />
			</div>
		</router-link> -->

		<button class="ml-1 p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
			<i class="pi pi-bars"></i>
		</button>

		<Button style="height: 2rem;" @click="routeBack" >Back</Button>

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

.layout-menu-button {
	margin-right: 2rem;
}
</style>
