import { useState, useEffect } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { useRouter } from "next/navigation";

function NotificationModal() {
  const [adminId, setAdminId] = useState(null);
  const router = useRouter();
  useEffect(() => {
    const adminData = JSON.parse(sessionStorage.getItem("admin"));
    if (adminData && adminData._id) {
      setAdminId(adminData._id); // Use the actual admin ID from session storage
    } else {
      console.error("User not found or missing '_id' property");
      router.push("/auth/login");
    }
  }, [router]);


  const { notifications, status, errorMessage } = useNotifications(adminId);
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
  return (
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
              {status === "loading" && <p>Loading...</p>}
              {status === "error" && <p>{errorMessage}</p>}
              {status === "success" && notifications.length === 0 && <p>No notifications found...</p>}

              {status === "success" &&
                notifications.slice(0, 5).map((n) => (
                  <div key={n._id} className="notify_item">
                    <div className="noti_icon">
                      <img src="/images/ticket.png" alt="ticket" />
                    </div>
                    <div>
                      <h5>#{n.orderId.slice(0, 5)}</h5>
                      <p dangerouslySetInnerHTML={{ __html: n.message }}></p>
                      <p className="pt-4">
                        <span>{formatTimeAgo(n.createdAt)}</span>
                      </p>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>

          {/* Footer should be outside of the notifications loop */}
          <div className="modal-footer noti_modal_container_footer">
            {/* <button
              type="button"
              className="border-0 bg-transparent"
              onClick={markAllAsRead}
              disabled={markingRead}
            >
              {markingRead ? "Marking..." : "Mark as read"}
            </button> */}
            <button
              onClick={() => (window.location = "/dashboard/allnotification")}
              className="border-0 bg-transparent"
            >
              View All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationModal;
