import Vue from 'vue';
import VueRouter from 'vue-router';
import VueFire from 'vuefire';
import TableComponent from 'vue-table-component';
import './firebase';
import helpersPlugin from './components/helpersPlugin.vue';


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
  {path: '/login', alias:'', component: Login, name:'login'},
  {path: '/signup', component: Signup, name:'signup'},
  {path: '/home', component: Home, name:'home'},
  {path: '/chat', component: Chat, name:'chat'},
  {path: '/members', component: Members, name:'members'},
  {path: '/teams', component: Teams, name:'teams'},
  {path: '/competitions', component: Competitions, name: 'competitions'},
  {path: '/marketing', component: Marketing, name: 'marketing'},
  {path: '/fixtures', component: Fixtures, name: 'fixtures'},
  {path: '/newfixture', component: NewFixture, name: 'newfixture'},
  {path: '/results/:match_id', component: Results, name:'results'},
  {path: '/profile/:player_id', component: Profile, name:'profile'},
  {path: '/team/:team_id', component: Team, name:'team'}
];

const router = new VueRouter({routes});


const app = new Vue({
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        this.$router.push('/home')
      } else {
        this.$router.push('/signup')
      }
     });
    },
  el:"#app",
  router,
  render (h) {
    return h(App)
  }
});

window.addEventListener('popstate', () => {
  app.currentRoute = window.location.pathname
})
