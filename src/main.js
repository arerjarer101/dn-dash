import { createApp } from 'vue'
import { createPinia } from 'pinia';
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Inplace from 'primevue/inplace';
import Password from 'primevue/password';
import PickList from 'primevue/picklist';
import Card from 'primevue/card';
import Checkbox from 'primevue/checkbox';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import MultiSelect from 'primevue/multiselect';
import Listbox from 'primevue/listbox';
import ConfirmDialog from 'primevue/confirmdialog';
import Dialog from 'primevue/dialog';
import Divider from 'primevue/divider';
import ConfirmationService from 'primevue/confirmationservice';
import DataTable from 'primevue/datatable';
import Dropdown from 'primevue/dropdown';
import Column from 'primevue/column'
import Row from 'primevue/row';  
import ColorPicker from 'primevue/colorpicker';
import Fieldset from 'primevue/fieldset';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import Tag from 'primevue/tag';
import Textarea from 'primevue/textarea';
import Toolbar from 'primevue/toolbar';
import Skeleton from 'primevue/skeleton';

import '@/assets/styles.scss';

const app = createApp(App);

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {ripple: true});
app.use(ToastService);
app.use(ConfirmationService);
// app.use(FilterMatchMode);

app.component('Button', Button);
app.component('InputText', InputText);
app.component('InputNumber', InputNumber);
app.component('Inplace', Inplace);
app.component('Password', Password);
app.component('PickList', PickList);
app.component('Card', Card);
app.component('Checkbox', Checkbox);
app.component('Toast', Toast);
app.component('TabView', TabView);
app.component('TabPanel', TabPanel);
app.component('MultiSelect', MultiSelect);
app.component('Listbox', Listbox);
app.component('Dialog', Dialog);
app.component('Divider', Divider);
app.component('ConfirmDialog', ConfirmDialog);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('Row', Row);
app.component('Dropdown', Dropdown);
app.component('ColorPicker', ColorPicker);
app.component('Fieldset', Fieldset);
app.component('Splitter', Splitter);
app.component('SplitterPanel', SplitterPanel);
app.component('Tag', Tag);
app.component('Textarea', Textarea);
app.component('Toolbar', Toolbar);
app.component('Skeleton', Skeleton);

app.mount('#app')
