import { createApp, provide } from 'vue'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Inplace from 'primevue/inplace';
import Password from 'primevue/password';
import Card from 'primevue/card';
import Checkbox from 'primevue/checkbox';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';

import '@/assets/styles.scss';

const app = createApp(App);


app.use(router)
app.use(PrimeVue, {ripple: true});
app.use(ToastService);

app.component('Button', Button);
app.component('InputText', InputText);
app.component('InputNumber', InputNumber);
app.component('Inplace', Inplace);
app.component('Password', Password);
app.component('Card', Card);
app.component('Checkbox', Checkbox);
app.component('Toast', Toast);


app.mount('#app')
