"use client";
import { useEffect, useState } from "react";
import InputField from "@/components/Form/InputField";
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import { useRouter } from "next/navigation";
import SpinnerLoading from "@/components/Spinner/SpinnerLoading";
import { object, string } from "yup";
import { useHeader } from "@/components/context/HeaderContext";
import { toast } from "react-toastify";
import axios from "axios";
const passImage = "/images/lock.png";

const signinValidation = object().shape({
  password: string()
    .min(6, "Password must be at least 6 characters")
    // .matches(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#.$!%*?&])/,
    //   "Password must contain uppercase, lowercase, digit and special character"
    // )
    .required("Password is required"),
});

export default function LoginPage() {
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [superAdminId, setSuperAdminId] = useState("");
  const header = useHeader();
  const handleClick = () => setShow(!show);

  const router = useRouter();

  useEffect(() => {
    const adminId = sessionStorage.getItem("adminId");

    if (adminId) {
      try {
        setSuperAdminId(adminId || ""); // Store email in state
      } catch (error) {
        console.error("Error parsing admin data from sessionStorage:", error);
      }
    } else {
      router.replace("/auth/login"); // Redirect if no admin data
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const adminId = sessionStorage.getItem("adminId");

    const requestData = {
      superAdminId: adminId || "",
      password
    };
    try {
      // Validate email using Yup schema
      await signinValidation.validate({ password });

      // Make API request
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}superAdmin/resetPassword`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Handle successful response
      if (response?.data?.success) {
        toast.success(response.data.msg || "Password reset successful!");
        setSuccess(true);
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("admin");
        setTimeout(() => router.push("/auth/login"), 1000);
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
          <form>
            <label htmlFor="password">New Password:</label>
            <InputField
              type={show ? "text" : "password"}
              id="password"
              imageSrc={passImage}
              show={show}
              handleClick={handleClick}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <AuthBtn title="Login" type="button" onClick={handleLogin} disabled={isLoading} />{" "}
          </form>
        </>
      )}
    </>
  );
}
