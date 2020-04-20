
let btn = document.querySelector('.btn');

btn.onclick = () => {
    fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
            'Authorization': 'key=AAAAKgnYNn4:APA91bHOTjidUdenjycvDNPGW85b9vVGqF-px2HV0lPBBZzG0vN8lTBkH0x2tnzAzaXNM0ViQnETihMPIAJLlKOz5XYa70oyH3MuK8qLk_Tr27F8okZ2zrNiIjsScGWy6JGfOzAEmLRu',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            // Firebase loses 'image' from the notification.
            // And you must see this: https://github.com/firebase/quickstart-js/issues/71
            data: {
                "title": "Ералаш",
                "body": "Начало в 21:00",
            },
            to: 'eb6Ua_SCMFg:APA91bFoU8aMdI29EDHhAZihZIQgS8WvrE4-tt1cT5L6NAVGBsIcgMkfFzpP2Xm1--oa-WOs8NIry9ioBuVyhm8FwPaDNtyEgZA_cyTaMbZ3ve_w8fmc9GNgYYM642yArJXRucdKXszz'
        })
    }).then(response => console.log(response))
};


firebase.initializeApp({
    messagingSenderId: '180553791102'
});

// браузер поддерживает уведомления
// вообще, эту проверку должна делать библиотека Firebase, но она этого не делает
if ('Notification' in window) {
    messaging = firebase.messaging();

    // пользователь уже разрешил получение уведомлений
    // подписываем на уведомления если ещё не подписали
    if (Notification.permission === 'granted') {
        subscribe();
    }

    subscribe();
    // по клику, запрашиваем у пользователя разрешение на уведомления
    // и подписываем его
}
subscribe();
messaging.onMessage(function(payload) {
    console.log('Message received', payload);
    // register fake ServiceWorker for show notification on mobile devices
    navigator.serviceWorker.register('/serviceworker/firebase-messaging-sw.js');
    Notification.requestPermission(function(permission) {
        if (permission === 'granted') {
            navigator.serviceWorker.ready.then(function(registration) {
              // Copy data object to get parameters in the click handler
              payload.data.data = JSON.parse(JSON.stringify(payload.data));

              registration.showNotification(payload.data.title, payload.data);
            }).catch(function(error) {
                // registration failed :(
                showError('ServiceWorker registration failed', error);
            });
        }
    });
});

function subscribe() {
    // запрашиваем разрешение на получение уведомлений
    messaging.requestPermission()
        .then(function () {
            // получаем ID устройства
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

// отправка ID на сервер
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

// используем localStorage для отметки того,
// что пользователь уже подписался на уведомления
function isTokenSentToServer(currentToken) {
    return window.localStorage.getItem('sentFirebaseMessagingToken') == currentToken;
}

function setTokenSentToServer(currentToken) {
    window.localStorage.setItem(
        'sentFirebaseMessagingToken',
        currentToken ? currentToken : ''
    );
}