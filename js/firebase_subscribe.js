let btn = document.querySelector('.btn');
btn.onclick = () => {
    sendNotify();
};

setTimeout(() => {
    sendNotify();
}, 3000);

function sendNotify() {
    messaging.getToken().then(token => {
        console.log(token);

        fetch('https://fcm.googleapis.com/fcm/send', {
          method: 'POST',
          headers: {
            'Authorization': 'key=AAAAKgnYNn4:APA91bHOTjidUdenjycvDNPGW85b9vVGqF-px2HV0lPBBZzG0vN8lTBkH0x2tnzAzaXNM0ViQnETihMPIAJLlKOz5XYa70oyH3MuK8qLk_Tr27F8okZ2zrNiIjsScGWy6JGfOzAEmLRu',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: {
              title: 'Уведомление',
              body: 'Начало в 21:00',
            },
            to: token,
          }),
        }).then(response => console.log(response));
      });
};


firebase.initializeApp({
    apiKey: "AIzaSyC85twijFU8KRfVYJ71hvsj9meG8YeMSjg",
    authDomain: "decoblog-4df8b.firebaseapp.com",
    databaseURL: "https://decoblog-4df8b.firebaseio.com",
    projectId: "decoblog-4df8b",
    storageBucket: "decoblog-4df8b.appspot.com",
    messagingSenderId: "180553791102",
    appId: "1:180553791102:web:e233eddec7ca012bc54a2f",
    measurementId: "G-VCD20PZ0HE",
});

if ('Notification' in window) {
    messaging = firebase.messaging();

    subscribe();

    messaging.onMessage(function(payload) {
        console.log('Message received', payload);
    });
}


function subscribe() {
    messaging.requestPermission()
        .then(function () {
            messaging.getToken()
                .then(function (currentToken) {
                    if (currentToken) {
                        sendTokenToServer(currentToken);
                    } else {
                        console.log('Не удалось получить токен.');
                        setTokenSentToServer(false);
                    }
                })
                .catch(function (err) {
                    console.log('При получении токена произошла ошибка.', err);
                    setTokenSentToServer(false);
                });
    })
    .catch(function (err) {
        console.log('Не удалось получить разрешение', err);
    });
};

function sendTokenToServer(currentToken) {
    if (!isTokenSentToServer(currentToken)) {
        // var url = ''; // адрес, где хранятся токены
        // $.post(url, {
        //     token: currentToken
        // });

        setTokenSentToServer(currentToken);
    } else {
        console.log('Токен уже отправлен на сервер.');
    }
}

function isTokenSentToServer(currentToken) {
    return window.localStorage.getItem('sentFirebaseMessagingToken') == currentToken;
}

function setTokenSentToServer(currentToken) {
    window.localStorage.setItem(
        'sentFirebaseMessagingToken',
        currentToken ? currentToken : ''
    );
}