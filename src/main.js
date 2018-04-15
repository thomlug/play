import Vue from 'vue';
import VueRouter from 'vue-router';
import VueFire from 'vuefire';
import TableComponent from 'vue-table-component';
import './firebase';
import helpersPlugin from './components/helpersPlugin.vue';
import { store } from './store/store';

import App from './App.vue'

import Login from './pages/Login.vue'
import Signup from './pages/Signup.vue'
import Home from './pages/Home.vue'
import Members from './pages/Members.vue'
import Teams from './pages/Teams.vue'
import Team from './pages/Team.vue'
import Competitions from './pages/Competitions.vue'
import Marketing from './pages/Marketing.vue'
import Results from './pages/Results.vue'
import Profile from './pages/Profile.vue'
import Fixtures from './components/Fixtures.vue'
import NewFixture from './pages/NewFixture.vue'
import Chat from './pages/Chat.vue'
import lodash from 'lodash'
import VueLodash from 'vue-lodash'
import moment from 'moment'

Vue.use(VueRouter);
Vue.use(TableComponent);
Vue.use(VueFire);
Vue.use(VueLodash, lodash)
Vue.use(helpersPlugin);
Vue.prototype.moment = moment

const routes = [
  { path: '/login', component: Login, name: 'login', },
  { path: '/signup', component: Signup, name: 'signup' },
  { path: '/chat', component: Chat, name: 'chat', meta: { requiresAuth: true } },
  { path: '/members', component: Members, name: 'members', meta: { requiresAuth: true } },
  { path: '/teams', component: Teams, name: 'teams', meta: { requiresAuth: true } },
  { path: '/competitions', component: Competitions, name: 'competitions', meta: { requiresAuth: true } },
  { path: '/marketing', component: Marketing, name: 'marketing', meta: { requiresAuth: true } },
  { path: '/fixtures', component: Fixtures, name: 'fixtures', meta: { requiresAuth: true } },
  { path: '/newfixture', component: NewFixture, name: 'newfixture', meta: { requiresAuth: true } },
  { path: '/results/:match_id', component: Results, name: 'results', meta: { requiresAuth: true } },
  { path: '/profile/:player_id', component: Profile, name: 'profile', meta: { requiresAuth: true } },
  { path: '/team/:team_id', component: Team, name: 'team', meta: { requiresAuth: true } },
  { path: '/home', alias: '', component: Home, name: 'home', meta: { requiresAuth: true } },
];

const router = new VueRouter({ routes });

router.beforeEach((to, from, next) => {
  // const currentUser = firebase.auth().getCurrentUser();
  let currentUser = firebase.auth().currentUser;
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (requiresAuth && !currentUser) {
    next('/login');
  } else if (requiresAuth && currentUser){
    next();
  } else {
    next();
  }
});


const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
  store.commit('setUser', user || false); 
  new Vue({
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
  unsubscribe();
})


window.addEventListener('popstate', () => {
  app.currentRoute = window.location.pathname
})
