<script setup>
import { computed, watch, ref, onBeforeMount } from 'vue';
import AppTopbar from './AppTopbar.vue';
import AppFooter from './AppFooter.vue';
import AppSidebar from './AppSidebar.vue';
import AppConfig from './AppConfig.vue';
import { useLayout } from '@/layout/composables/layout';

const { layoutConfig, layoutState, isSidebarActive } = useLayout();

const outsideClickListener = ref(null);
const innerWidth = ref(window.innerWidth)

onBeforeMount(() => {
	// innerWidth.value = window.innerWidth
})

watch(isSidebarActive, (newVal) => {
	if (newVal) {
		bindOutsideClickListener();
	} else {
		unbindOutsideClickListener();
	}
});

const containerClass = computed(() => {
	return {
		'layout-theme-light': layoutConfig.darkTheme.value === 'light',
		'layout-theme-dark': layoutConfig.darkTheme.value === 'dark',
		'layout-overlay': layoutConfig.menuMode.value === 'overlay',
		'layout-static': layoutConfig.menuMode.value === 'static',
		'layout-static-inactive': layoutState.staticMenuDesktopInactive.value && layoutConfig.menuMode.value === 'static',
		'layout-overlay-active': layoutState.overlayMenuActive.value,
		'layout-mobile-active': layoutState.staticMenuMobileActive.value,
		'p-input-filled': layoutConfig.inputStyle.value === 'filled',
		'p-ripple-disabled': !layoutConfig.ripple.value
	};
});
const bindOutsideClickListener = () => {
	if (!outsideClickListener.value) {
		outsideClickListener.value = (event) => {
			if (isOutsideClicked(event)) {
				layoutState.overlayMenuActive.value = false;
				layoutState.staticMenuMobileActive.value = false;
				layoutState.menuHoverActive.value = false;
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
	const sidebarEl = document.querySelector('.layout-sidebar');
	const topbarEl = document.querySelector('.layout-menu-button');

	return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
};

console.log('window.innerWidth', innerWidth.value)
</script>

<template>
	<div class="layout-wrapper" :class="containerClass">
		<app-topbar></app-topbar>
		<div class="layout-sidebar surface-ground border-round-sm">
			<app-sidebar></app-sidebar>
		</div>
		<div :class="[innerWidth > 991 ? 'ml__12' : '']">
			<div :class="['layout-main-container']">
				<div class="'layout-main'">
					<ConfirmDialog></ConfirmDialog>
					<Toast position="bottom-right"></Toast>
					<router-view></router-view>
				</div>
				<app-footer></app-footer>
			</div>
		</div>
		<app-config></app-config>
		<div class="layout-mask"></div>
	</div>
</template>

<style lang="scss" scoped>
.layout-main-container {
	padding: 4rem 2rem 2rem 2rem;
}

.layout-wrapper.layout-static .ml__12 .layout-main-container {
	margin-left: 12rem !important; 
}

.layout-wrapper.layout-static.layout-static-inactive .ml__12 .layout-main-container {
	margin-left: 0 !important; 
}

.layout-sidebar {
	top: 4rem;
  left: 1rem;
	width: 12rem;
	padding: 0.5rem 1.5rem 0.5rem 1.5rem;
	height: 93%;
}
</style>
