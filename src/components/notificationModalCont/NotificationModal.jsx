import { useState, useEffect } from "react";
import Link from "next/link";

const ticket = "/images/ticket.png";

function NotificationModal() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markingRead, setMarkingRead] = useState(false);

  // Fetch notifications when the modal is opened
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

  // Mark all notifications as read
  const markAllAsRead = async () => {
    setMarkingRead(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}vendor/notifications/mark_as_read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark notifications as read");
      }

      console.log("Notifications marked as read");
    } catch (error) {
      setError(error.message);
    } finally {
      setMarkingRead(false);
    }
  };

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

  return (
    <>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog noti-modal-dialog">
          <div className="modal-content">
            <div className="modal-body p-0">
              <div className="noti_modal_container_body">
                {loading ? (
                  // <p>Loading notifications...</p>
                  <p>No notifications available</p>
                ) : error ? (
                  <p className="text-danger">Error: {error}</p>
                ) : notifications.length === 0 ? (
                  <p>No notifications available</p>
                ) : (
                  notifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification.notification_id}
                      className="notify_item"
                    >
                      <div className="noti_icon">
                        <img src={ticket} alt="ticket icon" />
                      </div>
                      <div>
                        <h5>{notification.title}</h5>
                        <p
                          dangerouslySetInnerHTML={{
                            __html: notification.body,
                          }}
                        ></p>
                        <p className="pt-4">
                          <span>{formatTimeAgo(notification.createdAt)}</span>
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div className="modal-footer noti_modal_container_footer">
                  <button
                    type="button"
                    className="border-0 bg-transparent"
                    onClick={markAllAsRead}
                    disabled={markingRead}
                  >
                    {markingRead ? "Marking..." : "Mark as read"}
                  </button>
                  <button
                    onClick={() =>
                      (window.location = "/dashboard/allnotification")
                    }
                    className="border-0 bg-transparent"
                  >
                    View All
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NotificationModal;
