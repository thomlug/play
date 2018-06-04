// Initialize Firebase
var config = {
    apiKey: "AIzaSyAXGFFPs0Hsax2ryPMbuNGj1kj0MiBRnUg",
    authDomain: "play-14e3e.firebaseapp.com",
    databaseURL: "https://play-14e3e.firebaseio.com",
    projectId: "play-14e3e",
    storageBucket: "play-14e3e.appspot.com",
    messagingSenderId: "952744572741"
  };
  var developmentAppConfig = {
    apiKey: "<API_KEY>",
    authDomain: "play-14e3e.firebaseapp.com",
    databaseURL: "https://play-14e3e-dev.firebaseio.com/",
    storageBucket: "play-14e3e.appspot.com",
    messagingSenderId: "952744572741"
};
  var firebaseApp = firebase.initializeApp(config);
  var development = firebase.initializeApp(developmentAppConfig, "development");
  
  export const db = firebaseApp.database();

  