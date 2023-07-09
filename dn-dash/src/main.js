import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import axios from 'axios'

import '@/assets/styles.scss';

const app = createApp(App);

axios.defaults.baseURL = 'http://localhost:7070'

app.use(PrimeVue, {ripple: true});
app.use(router)

app.mount('#app')
