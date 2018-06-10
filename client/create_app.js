import Vue from 'vue'

import App from './layouts/app.vue'
import createStore from './store.js'
import createRouter from './routes.js'
import meta from './utils/meta.js'
import {siteName} from '../config.js'

Vue.mixin(meta(siteName))

export default () => {
    const store = createStore()
    const router = createRouter()

    const app = new Vue({
        router,
        store,
        ...App,
    })

    return {
        app,
        router,
        store,
    }
}
