import { createApp, defineAsyncComponent } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index.js'

import BaseButton from './components/ui/BaseButton.vue'
import BaseSearch from './components/ui/BaseSearch.vue'
import BaseSpinner from './components/ui/BaseSpinner.vue'

const BaseDialog = defineAsyncComponent(() => import('./components/ui/BaseDialog.vue'))

const app = createApp(App).use(router).use(store)

app.component('base-button', BaseButton)
app.component('base-search', BaseSearch)
app.component('base-spinner', BaseSpinner)
app.component('base-dialog', BaseDialog)

app.mount('#app')
