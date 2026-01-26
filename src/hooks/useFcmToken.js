"use client";

import { useEffect } from "react";
import { messaging, getToken, onMessage } from "../lib/firebase";
import axios from "axios";
import { toast } from "react-toastify";

export default function useFcmToken(adminId) {
  useEffect(() => {
    if (!messaging || !adminId) return;

    // ============================
    // 1️⃣ Register Notification Permission
    // ============================
    const registerFcm = async () => {
      try {
        const permission = await Notification.requestPermission();

        if (permission !== "granted") {
          console.log("Push Notification permission denied");
          return;
        }

        // ============================
        // 2️⃣ Get FCM Token
        // ============================
        const fcmToken = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });

        if (!fcmToken) {
          console.log("No FCM token generated");
          return;
        }

        console.log("FCM Token:", fcmToken);

        // ============================
        // 3️⃣ Save token only if changed
        // ============================
        await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}admin/updateAdmin`,
          {
            adminId,
            FCMToken: fcmToken,
          }
        );

        console.log("FCM Token saved to backend");

      } catch (error) {
        console.error("FCM error:", error);
      }
    };

    registerFcm();

    // ============================
    // 4️⃣ Foreground Messages
    // ============================
    onMessage(messaging, (payload) => {
      console.log("Foreground notification:", payload);

      if (payload?.notification) {
        toast.info(
          `${payload.notification.title}: ${payload.notification.body}`
        );
      }
    });

    // ============================
    // 5️⃣ Token Refresh Listener (if token expires)
    // ============================
    navigator.serviceWorker?.addEventListener("message", async (event) => {
      if (event.data === "fcm-token-refresh") {
        const newToken = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });

        console.log("Refreshed FCM Token:", newToken);

        await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}admin/updateAdmin`,
          {
            adminId,
            FCMToken: newToken,
          }
        );
      }
    });
  }, [adminId]);
}
