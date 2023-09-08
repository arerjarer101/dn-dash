<script setup>
import { useLayout } from '../layout/composables/layout.js';
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
// import router from '../router'
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';

const toast = useToast();

const router  = useRouter()
const route = useRoute()

localStorage.previousPath = 'register'

const backgroundImg = ref(getRandomImg())

const { layoutConfig } = useLayout();
const username = ref('');
const email = ref('');
const password = ref('');

const apiURL = 'http://10.100.102.5:7070'

onMounted(() => {
	username.value = route.query.username
})

async function onRegister() {
	await axios.post(`${apiURL}/auth/register`, {
		username: username.value,
		email: email.value,
		password: password.value
	}).then(res => {
		console.log(res)
		if (res.data.accessToken && res.data.refreshToken) {
			localStorage.accessToken = res.data.accessToken
			localStorage.refreshToken = res.data.refreshToken
			localStorage.user = JSON.stringify(res.data.user)

			router.push({
				path: '/',
				query: {
					action: 'login',
				}
			})
		}
	}).catch((error) => {
		toast.add({
			severity: 'error', summary: 'Sign up error', detail: error.response.data.error, life: 10000
		});
	})
}

function onRedirectToLogin() {
	router.push({
		name: 'login', query: {
			username: username.value
		}
	})
}

function getRandomImg() {
	return 'layout/images/background/' + Math.floor(Math.random() * 13 + 1) + '.jpg'
}

const parallax = ref('transform: translate3d(0px, 0px, 0)')

function onMousemove($event) {
	parallax.value = `transform: translate3d(${-($event.clientX) / 20}px, ${-($event.clientY)/ 20}px, 0)`
}


const logoUrl = computed(() => {
	return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});
</script>

<template>
	<div @mousemove="onMousemove" style="overflow: hidden; max-height: 100vh;">
		<div  class="background" :style="[`background-image: url('${backgroundImg}')`, parallax]"></div>
		<div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden" style="position: absolute; top: 0px; background-color: transparent !important;">
			<Toast :pt="{
				root: { style: 'margin-top:-5.5rem' }
			}"></Toast>
			<div class="flex flex-column align-items-center justify-content-center">
				<div class="logo">
					<img :src="logoUrl" alt="Dn-dash logo"
						:class="['w-10rem flex-shrink-0']" />
					</div>
				<div
					style="filter: drop-shadow(0 0 0.5rem var(--primary-color)); border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
					<div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
						<div class="text-center mb-5">
							<div class="text-900 text-3xl font-medium mb-3">Ready for a journey?</div>
							<span class="text-600 font-medium">Create an account or <a @click="onRedirectToLogin" class="font-medium no-underline text-right cursor-pointer" style="color: var(--primary-color)">sign in</a> if you already have one</span>
						</div>

						<div>
							<label for="username1" class="block text-900 text-xl font-medium mb-2">Username</label>
							<InputText id="username1" type="text" placeholder="Unique username" class="w-full md:w-30rem mb-5"
								style="padding: 1rem" v-model="username" />

							<label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
							<InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-30rem mb-5"
								style="padding: 1rem" v-model="email" />

							<label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
							<Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="w-full md:w-30rem mb-3"
								inputClass="w-full md:w-30rem" inputStyle="padding:1rem"></Password>
							
							<div class="">
								<Button label="Create an account" class="w-full p-3 mt-6 text-xl" @click="onRegister" />
								<Button label="I already have one" class="w-full p-3 mt-5 text-xl" outlined @click="onRedirectToLogin" />
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
}
</style>
