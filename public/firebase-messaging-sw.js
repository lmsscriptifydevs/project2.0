importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');



const firebaseConfig = {
    apiKey: "AIzaSyBHQUZ320kHRSycZXzkYxSEz5Pks68WmA8",
    authDomain: "grape-task-4d779.firebaseapp.com",
    projectId: "grape-task-4d779",
    storageBucket: "grape-task-4d779.appspot.com",
    messagingSenderId: "972296757683",
    appId: "1:972296757683:web:c2896a15facb2fe9d3abc6"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();


messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});













// importScripts('https://www.gstatic.com/firebasejs/7.20.0/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/3.5.0/firebase-messaging.js');

// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('../firebase-messaging-sw.js')
//       .then(function(registration) {
//         console.log('Registration successful, scope is:', registration.scope);
//       }).catch(function(err) {
//         console.log('Service worker registration failed, error:', err);
//       });
//     }

// firebase.initializeApp({
//     messagingSenderId: "972296757683",
// })

// const initMessaging = firebase.messaging()