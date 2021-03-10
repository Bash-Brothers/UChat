import firebase from 'firebase/app';
import 'firebase/storage';

var firebaseConfig = {
    apiKey: "AIzaSyAVz1E9_03Q90-C70kV1RrRJSDq_Rsd-64",
    authDomain: "uchat-b0200.firebaseapp.com",
    projectId: "uchat-b0200",
    storageBucket: "uchat-b0200.appspot.com",
    messagingSenderId: "13772868028",
    appId: "1:13772868028:web:fdf96ac1582be2d0d3c3b9"
  };

 firebase.initializeApp(firebaseConfig);


const storage = firebase.storage();

export {
	storage, firebase as default
};