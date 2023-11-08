<script setup>
import { useLayout } from '../layout/composables/layout.js';
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';

const toast = useToast();
const router = useRouter()
const route = useRoute()

localStorage.previousPath = 'login'

const backgroundImg = ref(getRandomImg())
const { layoutConfig } = useLayout();
const username = ref('');
const password = ref('');
const apiURL = import.meta.env.VITE_API_URL

onMounted(() => {
	username.value = route.query.username

	if (route.query.action === 'logout') {
		setTimeout(() => {
			toast.add({
				severity: 'success', summary: 'Logged out', detail: `Goodbye!`, life: 3000
			});
		}, 100)

		route.query.action = ''
	}

	if (route.query.action === 'logoutAll') {
		setTimeout(() => {
			toast.add({
				severity: 'success', summary: 'Terminated all sessions', detail: `Goodbye!`, life: 3000
			});
		}, 100)

		route.query.action = ''
	}
})

async function onLogin() {
	await axios.post(`${apiURL}/auth/login`, {
		username: username.value,
		password: password.value
	}).then(res => {
		console.log(res)
		if (res.data && res.data.accessToken && res.data.refreshToken) {
			localStorage.refreshToken = res.data.refreshToken
			localStorage.accessToken = res.data.accessToken
			localStorage.user = JSON.stringify(res.data.user)

			router.push({
				path: '/',
				query: {
					action: 'login',
				}
			})
		}
	}).catch(error => {
		toast.add({
			severity: 'error', summary: 'Sign in error', detail: error.response.data.error, life: 10000
		});
		console.log(error.response.data.error)
	})
}

function onRedirectToRegister() {
	router.push({
		name: 'register', query: {
			username: username.value
		}
	})
}

function forgotPassword() {
	toast.add({
		severity: 'info', summary: 'Forgot password?', detail: 'Please, contact the administrator', life: 10000
	});
}

function getRandomImg() {
	return 'layout/images/background/' + Math.floor(Math.random() * 13 + 1) + '.jpg'
}

const parallax = ref('transform: translate3d(0px, 0px, 0)')

function onMousemove($event) {
	parallax.value = `transform: translate3d(${-($event.clientX) / 20}px, ${-($event.clientY)/ 20}px, 0)`
}

const logoUrl = computed(() => {
	return `layout/images/logo.svg`;
});

</script>

<template>
	<div @mousemove="onMousemove" style="overflow: hidden; max-height: 100vh;">
		<div  class="background" :style="[`background-image: url('${backgroundImg}')`, parallax]"></div>
		<div 
			class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden"
			style="position: absolute; top: 0px; background-color: transparent !important;">
			<Toast :pt="{
				root: { style: 'margin-top:-5.5rem' }
			}"></Toast>
			<div class="flex flex-column align-items-center justify-content-center">
				<div :class="[layoutConfig.darkTheme.value ? 'logo-dark' : 'logo-white', 'logo']">
					<img :src="logoUrl" alt="Dn-dash logo"
						:class="['w-10rem flex-shrink-0']" />
				</div>
				<div
					style="filter: drop-shadow(0 0 0.5rem var(--primary-color)); border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
					<div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
						<div class="text-center mb-5">
							<!-- <img src="/demo/images/login/avatar.png" alt="Image" height="50" class="mb-3" /> -->
							<div class="text-900 text-3xl font-medium mb-4">Greetings, traveller!</div>
							<span class="text-600 font-medium">Sign in or <a @click="onRedirectToRegister"
									class="font-medium no-underline text-right cursor-pointer" style="color: var(--primary-color)">create an
									account</a> to continue</span>
						</div>

						<div>
							<label for="username1" class="block text-900 text-xl font-medium mb-2">Username</label>
							<InputText id="username1" type="text" placeholder="Your username" class="w-full md:w-30rem mb-5"
								style="padding: 1rem" v-model="username" />

							<label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
							<Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="w-full mb-3"
								inputClass="w-full" inputStyle="padding:1rem" :feedback="false"></Password>

							<div class="flex align-items-center justify-content-between mb-5 gap-5">
								<a @click="forgotPassword" class="font-medium no-underline ml-2 text-right cursor-pointer"
									style="color: var(--primary-color)">Forgot password?</a>
							</div>
							<div class="mt-6">
								<Button label="Sign In" class="w-full p-3 text-xl" @click="onLogin" />
								<Button label="Create a new account" class="w-full p-3 mt-5 text-xl" outlined
									@click="onRedirectToRegister" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.background {
	height: 106vh;
	width: 108vw;
	transform-origin: center;
	background-repeat:repeat-y;
	overflow: hidden;
	transition: all 1s cubic-bezier(0.5, 1.2, 0.8, 1);
	background-size: cover;

}
.logo {
	filter: drop-shadow(0 0 0.5rem var(--primary-color));
	min-height: 5rem;
	margin: 0.5rem;
	padding: 0.5rem;
	border-radius: 7rem 7rem 4rem 4rem;
}
.logo img {
	filter: brightness(1.2) grayscale(20%) drop-shadow(0 0 0.7rem var(--primary-color));
}
.pi-eye {
	transform: scale(1.6);
	margin-right: 1rem;
}
.pi-eye-slash {
	transform: scale(1.6);
	margin-right: 1rem;
}</style>
