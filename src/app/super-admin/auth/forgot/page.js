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

export default function Forget() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const header = useHeader();

  const handleForgot = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Reset error state

    const requestData = { email };

    try {
      // Validate email using Yup schema
      await signinValidation.validate(requestData);

      // Make API request
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}superAdmin/forgetPassword`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Handle successful response
      if (response?.data?.success) {
        toast.success(response.data.msg || "Password reset link sent!");
        setSuccess(true);
        sessionStorage.setItem("admin", JSON.stringify(response?.data?.data));
        setTimeout(() => {
          router.push("otpverify");
        }, 1000);
      } else {
        throw new Error(response?.data?.msg || "Invalid data received");
      }
    } catch (err) {
      // Handle validation or API errors
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
          <div className="form_head">
            <h2>{header?.title}</h2>
            <p>{header?.description}</p>
          </div>
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
            <AuthBtn title={isLoading ? "Submitting..." : "Login"} type="submit" disabled={isLoading} />
          </form>
        </>
      )}
    </>
  );
}
