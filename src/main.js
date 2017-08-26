import Vue from 'vue';
import VueRouter from 'vue-router';
import VueFire from 'vuefire';
import TableComponent from 'vue-table-component';
import routes from './routes';
import './firebase';

Vue.use(VueRouter);
Vue.use(TableComponent);
Vue.use(VueFire);

  
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
  computed: {
    ViewComponent () {
      const matchingView = routes[this.currentRoute]
      return matchingView
        ? require('./pages/' + matchingView + '.vue')
        : require('./pages/404.vue')
    }
  },
  render (h) {
    return h(this.ViewComponent)
  }
})

window.addEventListener('popstate', () => {
  app.currentRoute = window.location.pathname
})
