"use client";

import { useEffect } from "react";

export default function PushNotificationRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then(() => console.log("Service Worker Registered for FCM"));
    }
  }, []);

  return null;
}
