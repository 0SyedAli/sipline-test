import { useState, useEffect } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { useRouter } from "next/navigation";

function NotificationModal() {
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


  const { notifications, status, errorMessage } = useNotifications(adminId);

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
                  <div key={n.notification_id} className="notify_item">
                    <div className="noti_icon">
                      <img src="/images/ticket.png" alt="ticket" />
                    </div>
                    <div>
                      <h5>{n.title}</h5>
                      <p dangerouslySetInnerHTML={{ __html: n.body }}></p>
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
              onClick={() => (window.location = "/super-admin/dashboard/allnotification")}
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
