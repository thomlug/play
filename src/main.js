import Vue from 'vue';
import VueRouter from 'vue-router';
import VueFire from 'vuefire';
import TableComponent from 'vue-table-component';
import './firebase';
import helpersPlugin from './components/helpersPlugin.vue';
import { store } from './store/store';

import App from './App.vue'
import routes from './routes.js'


import lodash from 'lodash'
import VueLodash from 'vue-lodash'
import moment from 'moment'

Vue.use(VueRouter);
Vue.use(TableComponent);
Vue.use(VueFire);
Vue.use(VueLodash, lodash)
Vue.use(helpersPlugin);
Vue.prototype.moment = moment


const router = new VueRouter({routes});

const app = new Vue({
  el: "#app",
  router,
  store,
  data: {
    ui: ""
  },
  render(h) {
    return h(App)
  }
});

window.addEventListener('popstate', () => {
  app.currentRoute = window.location.pathname
})
