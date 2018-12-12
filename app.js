// Initialize Firebase

var firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDXUMBNPBoIOTdcRTBdjjS5ttYW3zb_i7U",
    authDomain: "ae-bb-securite.firebaseapp.com",
    databaseURL: "https://ae-bb-securite.firebaseio.com",
    projectId: "ae-bb-securite",
    storageBucket: "ae-bb-securite.appspot.com",
    messagingSenderId: "1055477094114"
  });
  var db = firebaseApp.database()