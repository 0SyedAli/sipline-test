"use client";

import { useRouter } from "next/navigation";

export default function Thankyou() {
    const router = useRouter();

    return (
        <div className="card border-0  text-center" >

            {/* Success Icon */}
            <div className="mb-4">
                <div
                    className="mx-auto d-flex align-items-center justify-content-center rounded-circle"
                    style={{
                        width: "70px",
                        height: "70px",
                        backgroundColor: "#e6f7f0",
                        color: "#1bbf83",
                        fontSize: "32px",
                        fontWeight: "bold",
                    }}
                >
                    ✓
                </div>
            </div>

            {/* Heading */}
            <h3 className="mb-3 fw-semibold">
                Stripe Account Connected
            </h3>

            {/* Description */}
            <p className="text-muted mb-3">
                Thank you for completing your Stripe account setup.
            </p>

            <p className="text-muted mb-4">
                Your information has been submitted successfully and is currently under review.
                Once approved, you’ll receive a confirmation email and will be able to start
                accepting payments.
            </p>

            {/* Info Box */}
            <div
                className="alert alert-warning d-flex align-items-start text-start"
                role="alert"
            >
                <span className="me-2">⏳</span>
                <div>
                    Please keep an eye on your email inbox (and spam folder).
                    No further action is required from you at this time.
                </div>
            </div>

            {/* Action Button */}
            <button
                className="btn btn-primary w-100 mt-3"
                onClick={() => router.push("/auth/login")}
            >
                Go to Login Page
            </button>

        </div>
    );
}
