importScripts('https://www.gstatic.com/firebasejs/3.6.8/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.6.8/firebase-messaging.js');

// const firebaseConfig = {
//     apiKey: "AIzaSyC85twijFU8KRfVYJ71hvsj9meG8YeMSjg",
//     authDomain: "decoblog-4df8b.firebaseapp.com",
//     databaseURL: "https://decoblog-4df8b.firebaseio.com",
//     projectId: "decoblog-4df8b",
//     storageBucket: "decoblog-4df8b.appspot.com",
//     messagingSenderId: "180553791102",
//     appId: "1:180553791102:web:e233eddec7ca012bc54a2f",
//     measurementId: "G-VCD20PZ0HE"
//   };

// firebase.initializeApp(firebaseConfig);

// const messaging = firebase.messaging();

firebase.initializeApp({
    messagingSenderId: '180553791102',
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
    console.log('Handling background message', payload);
  
    // Copy data object to get parameters in the click handler
    payload.data.data = JSON.parse(JSON.stringify(payload.data));
  
    return self.registration.showNotification(payload.data.title, payload.data);
  });
  
  self.addEventListener('notificationclick', function(event) {
    const target = event.notification.data.click_action || '/';
    event.notification.close();
  
    // This looks to see if the current is already open and focuses if it is
    event.waitUntil(clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(function(clientList) {
      // clientList always is empty?!
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if (client.url === target && 'focus' in client) {
          return client.focus();
        }
      }
  
      return clients.openWindow(target);
    }));
  });
