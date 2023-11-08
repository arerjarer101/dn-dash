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
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import MultiSelect from 'primevue/multiselect';
// import ConfirmPopup from 'primevue/confirmpopup';
import ConfirmDialog from 'primevue/confirmdialog';
import Dialog from 'primevue/dialog';
import Divider from 'primevue/divider';
import ConfirmationService from 'primevue/confirmationservice';
import DataTable from 'primevue/datatable';
import Dropdown from 'primevue/dropdown';
import Column from 'primevue/column'
import ColorPicker from 'primevue/colorpicker';
import Fieldset from 'primevue/fieldset';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import Textarea from 'primevue/textarea';
import Toolbar from 'primevue/toolbar';

import '@/assets/styles.scss';

const app = createApp(App);


app.use(router)
app.use(PrimeVue, {ripple: true});
app.use(ToastService);
app.use(ConfirmationService)

app.component('Button', Button);
app.component('InputText', InputText);
app.component('InputNumber', InputNumber);
app.component('Inplace', Inplace);
app.component('Password', Password);
app.component('Card', Card);
app.component('Checkbox', Checkbox);
app.component('Toast', Toast);
app.component('TabView', TabView);
app.component('TabPanel', TabPanel);
app.component('MultiSelect', MultiSelect);
// app.component('ConfirmPopup', ConfirmPopup);
app.component('Dialog', Dialog);
app.component('Divider', Divider);
app.component('ConfirmDialog', ConfirmDialog);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('Dropdown', Dropdown);
app.component('ColorPicker', ColorPicker);
app.component('Fieldset', Fieldset);
app.component('Splitter', Splitter);
app.component('SplitterPanel', SplitterPanel);
app.component('Textarea', Textarea);
app.component('Toolbar', Toolbar);

app.mount('#app')
