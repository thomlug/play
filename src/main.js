import Vue from 'vue'
import VueRouter from 'vue-router'
import TableComponent from 'vue-table-component';
import routes from './routes'
Vue.use(VueRouter)
Vue.use(TableComponent);

var VueFire = require('vuefire')

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


// Initialize Firebase
    var config = {
      apiKey: "AIzaSyAXGFFPs0Hsax2ryPMbuNGj1kj0MiBRnUg",
      authDomain: "play-14e3e.firebaseapp.com",
      databaseURL: "https://play-14e3e.firebaseio.com",
      projectId: "play-14e3e",
      storageBucket: "play-14e3e.appspot.com",
      messagingSenderId: "952744572741"
    };
    var firebaseApp = firebase.initializeApp(config);
    var db = firebaseApp.database()

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

