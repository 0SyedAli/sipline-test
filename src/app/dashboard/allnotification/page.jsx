"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const AllNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch notifications when the component mounts
  // useEffect(() => {
  //   const fetchNotificationList = async () => {
  //     try {
  //       const response = await fetch(
  //         `${process.env.NEXT_PUBLIC_SERVER_URL}vendor/notifications/list`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${sessionStorage.getItem("token")}`,
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );

  //       if (!response.ok) {
  //         throw new Error("Failed to fetch notifications");
  //       }

  //       const data = await response.json();
  //       setNotifications(data?.data || []); // Safely handle undefined
  //     } catch (error) {
  //       setError(error?.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchNotificationList();
  // }, []);

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return `${interval} years ago`;
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return `${interval} months ago`;
    interval = Math.floor(seconds / 86400);
    if (interval > 1) return `${interval} days ago`;
    interval = Math.floor(seconds / 3600);
    if (interval > 1) return `${interval} hours ago`;
    interval = Math.floor(seconds / 60);
    if (interval > 1) return `${interval} minutes ago`;
    return `${seconds} seconds ago`;
  };

  if (loading) {
    return <p>Loading...</p>; // Consider replacing this with a spinner
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button className="btn btntheme3 px-5" onClick={() => window.location.reload()}>Retry</button> {/* Retry button */}
      </div>
    );
  }

  const ticket = "/images/ticket.png";

  return (
    <div className="page">
      <div className="manage_order_head pb-2">
        <h3>All Notifications</h3>
      </div>
      <div className="allNotification_body">
        {notifications.map((notification) => (
          <div key={notification.notification_id} className="notify_item">
            <div className="noti_icon">
              <img src={ticket} alt="ticket icon" />
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
