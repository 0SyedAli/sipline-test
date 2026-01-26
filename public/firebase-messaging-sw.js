// public/firebase-messaging-sw.js

importScripts("https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyB8TeewNfSgbQb9Gmr5vPlDdQITz2yDI6c",
    authDomain: "sipline-585ca.firebaseapp.com",
    projectId: "sipline-585ca",
    storageBucket: "sipline-585ca.firebasestorage.app",
    messagingSenderId: "413350991118",
    appId: "1:413350991118:web:cf33c190fc5e03c7a8335f",
});

// Initialize messaging
const messaging = firebase.messaging();

// Background push handler
messaging.onBackgroundMessage((payload) => {
    console.log("[firebase-messaging-sw.js] Received background message: ", payload);

    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: "/icons/icon-192x192.png", // optional
    });
});

self.addEventListener("notificationclick", function (event) {
    event.notification.close();

    event.waitUntil(
        clients.openWindow(event.notification?.data?.click_action || "/")
    );
});
