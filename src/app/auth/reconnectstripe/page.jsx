"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function StripeFailed() {
  const router = useRouter();
  const [adminId, setAdminId] = useState("");

  useEffect(() => {
    const adminData = sessionStorage.getItem("admin");

    if (adminData) {
      try {
        const parsedAdminData = JSON.parse(adminData);
        setAdminId(parsedAdminData._id);
      } catch (error) {
        console.error("Error parsing admin data from sessionStorage:", error);
      }
    } else {
      router.replace("/auth/login"); // Redirect if no admin data
    }

  }, []);

  return (
    <div
      className="card border-0 text-center"
    >

      {/* Error Icon */}
      <div className="mb-4">
        <div
          className="mx-auto d-flex align-items-center justify-content-center rounded-circle"
          style={{
            width: "70px",
            height: "70px",
            backgroundColor: "#fdecea",
            color: "#d93025",
            fontSize: "32px",
            fontWeight: "bold",
          }}
        >
          ✕
        </div>
      </div>

      {/* Heading */}
      <h2 className="mb-2 fw-semibold text-danger">
        Stripe Connection Failed
      </h2>

      {/* Description */}
      <p className="text-muted mb-3">
        We were unable to complete your Stripe account setup.
      </p>

      <p className="text-muted mb-4">
        This may have happened due to incomplete information, a network issue,
        or if the setup process was interrupted.
      </p>

      {/* Info Box */}
      <div
        className="alert alert-danger d-flex align-items-start text-start"
        role="alert"
      >
        <span className="me-2">⚠️</span>
        <div>
          Please try connecting your Stripe account again.
          Make sure all required details are filled in correctly.
        </div>
      </div>

      {/* Action Buttons */}
      <div className="d-grid gap-2 mt-3">
        <button
          className="btn btn-danger"
          onClick={() => router.push(`https://apiforapp.link/api/reauth/${adminId}`)}
        >
          Retry Stripe Connection
        </button>

        <button
          className="btn btn-outline-secondary"
          onClick={() => router.push("/vendor/dashboard")}
        >
          Go to Dashboard
        </button>
      </div>

    </div>
  );
}
