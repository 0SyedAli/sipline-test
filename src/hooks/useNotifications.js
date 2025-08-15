"use client";
import { useState, useEffect, useCallback } from "react";

export function useNotifications(adminId) {
  const [notifications, setNotifications] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [errorMessage, setErrorMessage] = useState("");

  const fetchNotificationList = useCallback(async () => {
    if (!adminId) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}admin/getAllNotification?adminId=${adminId}`
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      // Handle no notifications as empty state
      if (!data?.success) {
        if (data?.msg === "No Notification Found") {
          setNotifications([]);
          setStatus("success");
          return;
        }
        throw new Error(data?.msg || "Failed to fetch notifications");
      }

      setNotifications(data.data || []);
      setStatus("success");

    } catch (error) {
      console.error("Fetch error:", error);
      setErrorMessage(error.message || "An unexpected error occurred");
      setStatus("error");
    }
  }, [adminId]);

  useEffect(() => {
    if (adminId) fetchNotificationList();
  }, [adminId, fetchNotificationList]);

  return { notifications, status, errorMessage, fetchNotificationList };
}
