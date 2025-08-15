"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import InputField from "@/components/Form/InputField";
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import Link from "next/link";
import { useHeader } from "@/components/context/HeaderContext";
import { toast } from "react-toastify";

import { object, string } from "yup";
import SpinnerLoading from "@/components/Spinner/SpinnerLoading";
import { useRouter } from "next/navigation";

const emailImage = "/images/email.png";
const passImage = "/images/lock.png";

const signinValidation = object().shape({
  email: string().email("Invalid email format").required("Email is required"),
  password: string()
    .min(6, "Password must be at least 6 characters")
    // .matches(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#.$!%*?&])/,
    //   "Password must contain uppercase, lowercase, digit and special character"
    // )
    .required("Password is required"),
});

export default function LoginPage() {
  const header = useHeader();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const router = useRouter();
  useEffect(() => {
    if (window.location.href.includes("logout")) {
      sessionStorage.clear();
    }
  }, []);
  const handleClick = () => setShow(!show);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Clear previous errors

    const requestData = { email, password };

    try {
      // Validate input fields
      await signinValidation.validate(requestData);

      // Make API request (no token needed for login)
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}superAdmin/login`,
        requestData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (!data?.success) {
        throw new Error(data?.msg || "Login failed");
      }

      // Ensure data is valid
      if (!data?.data?._id) {
        throw new Error("Admin ID not found in response");
      }

      // Store necessary session data
      sessionStorage.setItem("email", data?.data?.email);
      sessionStorage.setItem("adminId", data?.data?._id);

      toast.success(data?.msg || "Login successful!");
      setSuccess(true);

      router.push("/super-admin/dashboard");

    } catch (error) {
      const errorMsg =
        error?.response?.data?.msg ||
        error?.message ||
        "Login failed";
      setError(errorMsg);
      toast.error(errorMsg);
      setSuccess(false);
    } finally {
      setIsLoading(false); // Always re-enable button
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
          <form onSubmit={handleLogin}>
            <label htmlFor="email">Email:</label>
            <InputField
              type="text"
              id="email"
              imageSrc={emailImage}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password">Password:</label>
            <InputField
              type={show ? "text" : "password"}
              id="password"
              imageSrc={passImage}
              show={!show}
              handleClick={handleClick}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="remember d-flex justify-content-between align-items-center pb-4">
              <div className="d-flex align-items-center gap-2">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember"> Remember me</label>
              </div>
              <Link href="forgot">Forgot Password?</Link>
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <AuthBtn title="Login" type="submit" disabled={isLoading} />
          </form>
          <div className="register_link">
            <h5>
              {"Don't have an account? "}
              <Link href="signup">Sign Up</Link>
            </h5>
          </div>
        </>
      )}
    </>
  );
}
