let btn = document.querySelector('.btn');
btn.onclick = () => {
    messaging.getToken().then(token => {
      console.log(token);
      fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          Authorization:
            'key=AAAAKgnYNn4:APA91bHOTjidUdenjycvDNPGW85b9vVGqF-px2HV0lPBBZzG0vN8lTBkH0x2tnzAzaXNM0ViQnETihMPIAJLlKOz5XYa70oyH3MuK8qLk_Tr27F8okZ2zrNiIjsScGWy6JGfOzAEmLRu',
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
    messagingSenderId: '180553791102'
});

if ('Notification' in window) {
    messaging = firebase.messaging();

    // if (Notification.permission === 'granted') {
    //     subscribe();
    // }

    subscribe();

    messaging.onMessage(function(payload) {
        console.log('Message received', payload);
        navigator.serviceWorker.register('/serviceworker/firebase-messaging-sw.js');
        Notification.requestPermission(function(permission) {
            if (permission === 'granted') {
                navigator.serviceWorker.ready.then(function(registration) {
                  payload.data.data = JSON.parse(JSON.stringify(payload.data));
    
                  registration.showNotification(payload.data.title, payload.data);
                }).catch(function(error) {
                    showError('ServiceWorker registration failed', error);
                });
            }
        });
    });
}


function subscribe() {
    messaging.requestPermission()
        .then(function () {
            messaging.getToken()
                .then(function (currentToken) {
                    console.log(currentToken);

                    if (currentToken) {
                        sendTokenToServer(currentToken);
                    } else {
                        console.warn('Не удалось получить токен.');
                        setTokenSentToServer(false);
                    }
                })
                .catch(function (err) {
                    console.warn('При получении токена произошла ошибка.', err);
                    setTokenSentToServer(false);
                });
    })
    .catch(function (err) {
        console.warn('Не удалось получить разрешение на показ уведомлений.', err);
    });
}

function sendTokenToServer(currentToken) {
    if (!isTokenSentToServer(currentToken)) {
        console.log('Отправка токена на сервер...');

        // var url = ''; // адрес скрипта на сервере который сохраняет ID устройства
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