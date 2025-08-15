"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useNotifications } from "@/hooks/useNotifications";

const AllNotification = () => {
  const [adminId, setAdminId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const adminData = sessionStorage.getItem("adminId");
      if (adminData) {
        setAdminId(adminData);
      } else {
        router.push("/super-admin/auth/login");
      }
    } catch {
      router.push("/super-admin/auth/login");
    }
  }, [router]);

  const { notifications, status, errorMessage, fetchNotificationList } = useNotifications(adminId);

  const formatTimeAgo = (date) => {
    if (!date) return "Unknown time";
    const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
    const units = [
      { label: "year", value: 31536000 },
      { label: "month", value: 2592000 },
      { label: "day", value: 86400 },
      { label: "hour", value: 3600 },
      { label: "minute", value: 60 },
    ];
    for (const unit of units) {
      const interval = Math.floor(seconds / unit.value);
      if (interval >= 1) return `${interval} ${unit.label}${interval > 1 ? "s" : ""} ago`;
    }
    return `${seconds} seconds ago`;
  };

  if (status === "loading") return <p className="mt-3">Loading notifications...</p>;
  if (status === "error") return (
    <div className="page">
      <div className="manage_order_head mb-2 pb-2">
        <h3>All Notifications</h3>
      </div>
      <p className="text-danger">{errorMessage}</p>
      <button onClick={fetchNotificationList}>Retry</button>
    </div>
  )

  if (notifications.length === 0) {
    return (
      <div className="page">
        <div className="manage_order_head mb-2 pb-2">
          <h3>All Notifications</h3>
        </div>
        <p>No notifications found.</p>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="manage_order_head pb-2">
        <h3>All Notifications</h3>
      </div>
      <div className="allNotification_body">
        {notifications.map((notification) => (
          <div key={notification.notification_id} className="notify_item">
            <div className="noti_icon">
              <Image src={ticket} alt="ticket" width={40} height={40} />
            </div>
            <div className="d-flex justify-content-between w-100">
              <div>
                <h5>{notification.title}</h5>
                <p dangerouslySetInnerHTML={{ __html: notification.body }}></p>
              </div>
              <p className="">
                <span>{formatTimeAgo(notification.createdAt)}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllNotification;
