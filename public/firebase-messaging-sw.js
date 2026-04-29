


/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyB3t604DkQ0CdSMlieiF_B123lxtT14-oA",
  authDomain: "souq-syria-app.firebaseapp.com",
  projectId: "souq-syria-app",
  storageBucket: "souq-syria-app.firebasestorage.app",
  messagingSenderId: "813395459515",
  appId: "1:813395459515:web:3079b6ae14c92a4d97589e",
  measurementId: "G-3BW9VV7PD4"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message:", payload);
  // self.registration.showNotification(payload.notification.title, {
  //   body: payload.notification.body,
  //   icon: "/logo192.png",
  // });
});
