"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import OtpInput from "react-otp-input";
import axios from "axios";
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import SpinnerLoading from "@/components/Spinner/SpinnerLoading";
import { useHeader } from "@/components/context/HeaderContext";

export default function OtpVerification() {
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email");
  const router = useRouter();
  const header = useHeader();
  const [state, setState] = useState({
    code: "",
    email: "",
    isLoading: false,
    error: "",
    success: false
  });

  // Load email from session storage on component mount
  useEffect(() => {
    if (!emailFromQuery) {
      toast.error("Email missing in URL");
      router.push('/dashboard/delete-account');
    }
    setState(prev => ({ ...prev, email: emailFromQuery }));
  }, [emailFromQuery]);


  const handleChange = (code) => {
    if (/^\d*$/.test(code)) {
      setState(prev => ({ ...prev, code, error: "" }));
    }
  };

  const verifyOTP = useCallback(async () => {
    if (state.code.length !== 4) {
      setState(prev => ({ ...prev, error: "Please enter a valid 4-digit OTP" }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: "" }));

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}admin/verifyPasswordOTP`,
        { email: state.email, OTP: state.code, type: "DeleteAdmin", },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response?.data?.success) {
        toast.success(response.data.msg || "OTP verified successfully!");
        setState(prev => ({ ...prev, success: true }));
        router.push("/dashboard/delete-account");
      } else {
        throw new Error(response.data.msg || "Invalid OTP");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.msg || error.message || "Verification failed";
      toast.error(errorMessage);
      setState(prev => ({ ...prev, error: errorMessage }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state.code, state.email, router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    verifyOTP();
  };

  if (state.success) {
    return <SpinnerLoading />;
  }

  return (
    <div className="row justify-content-center" style={{ marginTop: "100px" }}>
      <div className="col-md-6">
        <div className="otp-verification-container">
          <form className="auth_otp" onSubmit={handleSubmit}>
            <OtpInput
              value={state.code}
              onChange={handleChange}
              numInputs={4}
              separator={<span style={{ width: "8px" }} />}
              isInputNum={true}
              shouldAutoFocus={true}
              renderInput={(props) => (
                <input
                  {...props}
                  onKeyDown={(e) => {
                    if (!/[0-9]/.test(e.key) && e.key !== "Backspace") {
                      e.preventDefault();
                    }
                  }}
                />
              )}
              inputStyle={{
                border: "1px solid #7843AA",
                borderRadius: "8px",
                width: "64px",
                height: "64px",
                fontSize: "25px",
                color: "#000000bd",
                fontWeight: "400",
                caretColor: "#ccc",
              }}
              focusStyle={{
                border: "1px solid #CFD3DB",
                outline: "none",
              }}
            />

            {state.error && (
              <p className="error-message" style={{ color: "red", textAlign: 'center' }}>
                {state.error}
              </p>
            )}

            <AuthBtn
              title={state.isLoading ? "Verifying..." : "Next"}
              type="submit"
              disabled={state.isLoading}
            />
            <div className="resend_code my-0 pt-3">
              <p>{`Code didn't receive?`}</p>
              <h5 onClick={() => {
                router.push("/dashboard/delete-account")
              }} style={{ cursor: "pointer" }}>Resend Code</h5>
            </div>
            {/* <div className="resend_code mt-0 pt-3">
          <p>{"Need help? Contact support if you didn't receive the code."}</p>
        </div> */}
          </form>
        </div>
      </div>
    </div>
  );
}