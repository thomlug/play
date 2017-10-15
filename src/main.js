import Vue from 'vue';
import VueRouter from 'vue-router';
import VueFire from 'vuefire';
import TableComponent from 'vue-table-component';
import './firebase';

import App from './App.vue'

import Home from './pages/Home.vue'
import Members from './pages/Members.vue'
import Teams from './pages/Teams.vue'
import Competitions from './pages/Competitions.vue'
import Marketing from './pages/Marketing.vue'
import Fixtures from './pages/Fixtures.vue'
import Results from './pages/Results.vue'
import lodash from 'lodash'
import VueLodash from 'vue-lodash'
import moment from 'moment'

Vue.use(VueRouter);
Vue.use(TableComponent);
Vue.use(VueFire);
Vue.use(VueLodash, lodash)
Vue.prototype.moment = moment

  
var uiConfig = {
  signInFlow: 'popup',
      signInSuccessUrl: '#',
      signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID         
      ],
      // Terms of service url.
      tosUrl: '<your-tos-url>'
};
  
// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);
  
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    app.data.signedIn = true;
  } else {
    app.data.signedIn = false;
  }
});

const routes = [
  {path: '/home', alias:'/', component: Home},
  {path: '/members', component: Members},
  {path: '/teams', component: Teams},
  {path: '/competitions', component: Competitions},
  {path: '/marketing', component: Marketing},
  {path: '/fixtures', component: Fixtures},
  {path: '/results/:match_id', component: Results, name:'results'},
];

const router = new VueRouter({routes});
  

const app = new Vue({
  el: '#app',
  data: {
    signedIn: false,
    currentRoute: window.location.pathname,
    data: {cards: [
      {title: 'Active Competitions', subtitle: 'In your organisation'},
      {title: 'Revenue', subtitle: 'Per Competition'},
      {title: 'Total Revenue To Date', subtitle: 'In your organisation from payments'},
      {title: 'Outstanding Payments', subtitle: 'From players in your organisation'},
    ]}
  },
  router,
  render (h) {
    return h(App)
  }
})

window.addEventListener('popstate', () => {
  app.currentRoute = window.location.pathname
})
