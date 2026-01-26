"use client";

import InputField from "@/components/Form/InputField";
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import { useRouter } from "next/navigation";
import SpinnerLoading from "@/components/Spinner/SpinnerLoading";
import { useState } from "react";
import { object, string } from "yup";
import { useHeader } from "@/components/context/HeaderContext";
import { toast } from "react-toastify";
import axios from "axios";

const emailImage = "/images/email.png";

const signinValidation = object().shape({
  email: string().email("Invalid email format").required("Email is required"),
});

export default function DeleteAccount() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const header = useHeader();

  const handleForgot = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const requestData = { email, type: "DeleteAdmin" };

    try {
      await signinValidation.validate(requestData);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}admin/forgetPassword`,
        requestData,
        { headers: { "Content-Type": "application/json" } }
      );

      const msg = response?.data?.msg || "";

      // CASE 1: success but duplicate request
      if (response?.data?.success && msg === "Delete account request already exist") {
        toast.info(msg);
        setIsLoading(false);
        return;  // ⛔ STOP — do not redirect
      }

      // CASE 2: success and should continue to OTP
      if (response?.data?.success) {
        toast.success(msg || "Pls Verify!");
        setSuccess(true);
        setTimeout(() => {
          router.push(`/dashboard/otpverify?email=${email}`);
        }, 1000);
        return;
      }

      // CASE 3: unexpected error message
      throw new Error(msg || "Invalid data received");

    } catch (err) {
      const errorMessage =
        err?.response?.data?.msg || err?.message || "An unexpected error occurred";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      {success ? (
        <SpinnerLoading />
      ) : (
        <>
          <div className="row justify-content-center" style={{marginTop:"100px"}}>
            <div className="col-md-6">
              <form onSubmit={handleForgot}>
                <label htmlFor="email">Email Address</label>
                <InputField
                  type="email"
                  id="email"
                  imageSrc={emailImage}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {error && <p style={{ color: "red" }}>{error}</p>}
                <AuthBtn title={isLoading ? "Submitting..." : "Verify"} type="submit" disabled={isLoading} />
              </form>
            </div>
          </div>

        </>
      )}
    </>
  );
}
