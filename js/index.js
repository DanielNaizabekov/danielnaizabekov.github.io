// document.addEventListener("DOMContentLoaded", function(event) {
//     console.log("DOM fully loaded and parsed");
// });

const firebaseConfig = {
    apiKey: "AIzaSyC85twijFU8KRfVYJ71hvsj9meG8YeMSjg",
    authDomain: "decoblog-4df8b.firebaseapp.com",
    databaseURL: "https://decoblog-4df8b.firebaseio.com",
    projectId: "decoblog-4df8b",
    storageBucket: "decoblog-4df8b.appspot.com",
    messagingSenderId: "180553791102",
    appId: "1:180553791102:web:e233eddec7ca012bc54a2f",
    measurementId: "G-VCD20PZ0HE"
  };

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.requestPermission()
.then(function() {
    console.log('have permission');
    return messaging.getToken();
})
.then(function(token) {
    console.log(token)
})
.catch(function() {
    console.log('error')
})


// importScripts('https://www.gstatic.com/firebasejs/3.6.8/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/3.6.8/firebase-messaging.js');

// firebase.initializeApp({
//     messagingSenderId: '180553791102'
// });

// const messaging = firebase.messaging();
// messaging.requestPermission();

console.log(Notification.permission);