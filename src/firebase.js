import firebase from "firebase/app";
import "firebase/auth"; //login-register işlemleri için.
import "firebase/database"; //real-time yapısı için
import "firebase/storage"; //verilerimizi anlık kaydetme

var config = {
  apiKey: "AIzaSyAlRCUvVg4X5v7cAbGMIgZ1iRlnDl5W9dY",
  authDomain: "chat-db-adf9c.firebaseapp.com",
  databaseURL: "https://chat-db-adf9c.firebaseio.com",
  projectId: "chat-db-adf9c",
  storageBucket: "chat-db-adf9c.appspot.com",
  messagingSenderId: "204049524731",
  appId: "1:204049524731:web:0e3131eb4c0c38d981cd5e"
};
// Initialize Firebase
firebase.initializeApp(config);

export default firebase;

