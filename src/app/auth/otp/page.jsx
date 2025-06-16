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
import { setAdmin } from "../../../lib/redux/store/slices/multiStepFormSlice";

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
  }, []);

  const handleChange = (code) => {
    // Ensure only numeric input
    if (/^\d*$/.test(code)) {
      setCode(code);
    }
  };

  // const verifyOTP = async () => {

  //   setIsLoading(true);
  //   setError("");
  //   setResendMessage("");

  //   const requestData = {
  //     email: email,
  //     OTP: code,
  //     signupToken: token,
  //   };

  //   try {
  //     const response = await axios.post(
  //       `${process.env.NEXT_PUBLIC_SERVER_URL}admin/verifyOTP`,
  //       requestData,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     const { accessToken } = response?.data;
  //     // Check if response status is successful
  //     if (response?.status === 200 || response?.status === 201) {
  //       if (response?.data?.data) {
  //         sessionStorage.setItem("admin", JSON.stringify(response?.data?.data));
  //         sessionStorage.setItem("token", accessToken);
  //         toast.success(response?.data?.msg || "OTP has been verified successfully!");
  //         router.push("createprofile");
  //       }
  //       else {
  //         toast.error(response?.data?.msg || "Invalid OTP");
  //       }
  //     } else {
  //       // Handle unexpected success responses with non-2xx status codes
  //       toast.error(response?.data?.msg || "Invalid OTP");
  //       setError(response?.data?.msg || "Invalid OTP");
  //       setSuccess(false);
  //       setIsLoading(false); // Re-enable button on failure
  //     }
  //   } catch (error) {
  //     toast.error(error.response?.data?.msg || "Invalid OTP");
  //     setError(error?.response?.data?.message || error?.message || "invalid OTP");
  //     setSuccess(false);
  //     setIsLoading(false); // Re-enable button on error
  //     // Log the error for debugging purposes
  //     console.error("Error verifying OTP:", error);
  //   }
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (code.length === 4) {
  //     verifyOTP();
  //   } else {
  //     setError("Please enter a valid 4-digit OTP.");
  //   }
  // };


  const verifyOTP = async () => {

    setIsLoading(true);
    setError("");
    setResendMessage("");

    const requestData = {
      email: email,
      OTP: code,
      signUpToken: token, // ✅ This must match exactly
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}admin/verifyOTP`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { accessToken } = response?.data;

      if (response?.status === 200 || response?.status === 201) {
        if (response?.data?.data) {
          dispatch(setAdmin({
            token: response?.data?.accessToken,
            adminId: response?.data?.data?._id || response?.data?.data?.adminId,
          }));

          setSuccess(true);
          toast.success(response?.data?.msg || "OTP has been verified successfully!");
          setError(null);

          sessionStorage.setItem("admin", JSON.stringify(response?.data?.data));
          sessionStorage.setItem("token", accessToken);
          router.push("createprofile");
        } else {
          toast.error(response?.data?.msg || "Invalid OTP");
          setError(response?.data?.msg || "Invalid OTP");
          setSuccess(false);
          setIsLoading(false); // Re-enable button on failure
        }
      } else {
        toast.error(response?.data?.msg || "Invalid OTP");
        setError(response?.data?.msg || "Invalid OTP");
      }
    } catch (error) {
      setError(error?.response?.data?.msg || error?.message);
      setSuccess(false);
      setIsLoading(false); // Re-enable button on error
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.length === 4) {
      verifyOTP();
    } else {
      setError("Please enter a valid 4-digit OTP.");
    }
  };

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
            <OtpInput
              value={code}
              onChange={handleChange}
              numInputs={4}
              separator={<span style={{ width: "8px" }}></span>}
              isInputNum={true}
              shouldAutoFocus={true}
              renderInput={(props) => (
                <input
                  {...props}
                  onKeyDown={(e) => {
                    if (!/[0-9]/.test(e.key) && e.key !== "Backspace") {
                      e.preventDefault(); // Block non-numeric keys
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