"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const StatusUpdateModal = ({ isOpen, onClose }) => {
  const [shopStatus, setShopStatus] = useState(true);
  const [lastCall, setLastCall] = useState(true);
  const [venueCapacityFull, setVenueCapacityFull] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) fetchShopStatus();
  }, [isOpen]);

  const fetchShopStatus = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const admin = JSON.parse(sessionStorage.getItem("admin"));
      const adminId = admin?._id;

      if (!adminId || !token) return;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}admin/getShopByAdminId?adminId=${adminId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success && response.data.data) {
        const data = response.data.data;
        setShopStatus(data.shopStatus === "Open");
        setLastCall(!!data.lastCall);
        setVenueCapacityFull(!!data.venueCapacityFull);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch shop data.");
    }
  };

  // ✅ Function to update only one status at a time
  const updateSingleStatus = async (field, value) => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      const admin = JSON.parse(sessionStorage.getItem("admin"));
      const adminId = admin?._id;
      const shopId = admin?.shopId?._id;

      if (!adminId || !shopId || !token) {
        toast.error("Missing admin or shop information.");
        return;
      }

      // Create FormData
      const formData = new FormData();
      formData.append("adminId", adminId);
      formData.append("shopId", shopId);

      // Append only the changed field
      if (field === "shopStatus") formData.append("shopStatus", value ? "Open" : "Closed");
      if (field === "lastCall") formData.append("lastCall", value);
      if (field === "venueCapacityFull") formData.append("venueCapacityFull", value);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}admin/updateShop`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Do NOT manually set 'Content-Type' — Axios will handle it
          },
        }
      );

      if (response.data.success) {
        toast.success("Status updated successfully!");
      } else {
        toast.error(response.data.message || "Failed to update status.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };


  // ✅ Each switch directly triggers updateSingleStatus
  const handleToggle = (field, value) => {
    if (field === "shopStatus") setShopStatus(value);
    if (field === "lastCall") setLastCall(value);
    if (field === "venueCapacityFull") setVenueCapacityFull(value);
    updateSingleStatus(field, value);
  };

  return (
    <div
      className={`modal fade ${isOpen ? "show d-block" : ""}`}
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered status_dialog">
        <div className="modal-content p-3">
          <div className="modal-header">
            <h5 className="modal-title fw-bolder">Update Shop Status</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
              disabled={loading}
            ></button>
          </div>

          <div className="modal-body">
            {/* Shop Status */}
            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="shopStatus"
                checked={shopStatus}
                onChange={(e) => handleToggle("shopStatus", e.target.checked)}
                disabled={loading}
              />
              <label className="form-check-label" htmlFor="shopStatus">
                Shop Status <strong>({shopStatus ? "Open" : "Closed"})</strong>
              </label>
            </div>

            {/* Last Call */}
            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="lastCall"
                checked={lastCall}
                onChange={(e) => handleToggle("lastCall", e.target.checked)}
                disabled={loading}
              />
              <label className="form-check-label" htmlFor="lastCall">
                Last Call <strong>({lastCall ? "Active" : "Inactive"})</strong>
              </label>
            </div>

            {/* Venue Capacity Full */}
            <div className="form-check form-switch ">
              <input
                className="form-check-input"
                type="checkbox"
                id="venueCapacityFull"
                checked={venueCapacityFull}
                onChange={(e) =>
                  handleToggle("venueCapacityFull", e.target.checked)
                }
                disabled={loading}
              />
              <label
                className="form-check-label"
                htmlFor="venueCapacityFull"
              >
                Venue Capacity Full <strong>({venueCapacityFull ? "Yes" : "No"})</strong>
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusUpdateModal;
