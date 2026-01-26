"use client";
import OtpInput from "react-otp-input";
import axios from "axios";
import { useDispatch } from "react-redux";
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import { useRouter } from "next/navigation";
import { useHeader } from "@/components/context/HeaderContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SpinnerLoading from "@/components/Spinner/SpinnerLoading";
import { useEffect, useState } from "react";
import { setAdmin } from "@/lib/redux/store/slices/multiStepFormSlice";

export default function Otp() {
  const router = useRouter();
  const header = useHeader();
  const dispatch = useDispatch();
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [resendMessage, setResendMessage] = useState(""); // Message for Resend OTP

  useEffect(() => {
    const adminData = JSON.parse(sessionStorage.getItem("admin"));
    const token = sessionStorage.getItem("token");
    if (!adminData) {
      router.push('/auth/signup');
    } else {
      setEmail(adminData || "");
      setToken(token || "");
    }
  }, [router]);


  return (
    <>
      {success ? (
        <SpinnerLoading />
      ) : (
        <>
          <div className="form_head">
            <h2>{header?.title}</h2>
            <p>{header?.description}</p>
          </div>
          <form className="auth_otp">
            
            <div>
              {error && <p style={{ color: "red", textAlign: 'center' }}>{error}</p>}
              <AuthBtn title="Next" type="button" onClick={handleSubmit} disabled={isLoading} />
              <div className="resend_code">
                <p>{`Code didn't receive?`}</p>
                <h5 onClick={() => {
                  router.push("signup")
                }} style={{ cursor: "pointer" }}>Resend Code</h5>
              </div>
            </div>
          </form>
        </>
      )}
    </>
  );
}