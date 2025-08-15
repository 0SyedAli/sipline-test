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
    setIsLoading(true); // Disable the button on submit

    const requestData = {
      email: email,
      password: password,
    };

    try {
      // Validate request data
      await signinValidation.validate(requestData);

      // Make API request
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}admin/login`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      if (data?.success) {
        const { msg, accessToken, data: adminData } = data;

        if (!adminData) {
          throw new Error(msg || "Admin data not found");
        }

        const { profileCreated, shopCreated } = adminData; // Destructure from adminData
        sessionStorage.setItem("token", accessToken || "");
        sessionStorage.setItem("admin", JSON.stringify(adminData || {}));
        // Both true
        toast.success(msg || "Login successful!");
        setSuccess(true);

        if (!profileCreated) {
          // profileCreated is false
          router.push("createprofile");
        } else if (!shopCreated) {
          // shopCreated is false
          router.push("createbussinessprofile");
        } else if (profileCreated && shopCreated) {
          // Store token if successful

          router.push("/dashboard");
        }
      } else {
        toast.error(data?.msg || "Login failed!");
        throw new Error(data?.msg || "Login failed");
      }

      // old logic for handling
    } catch (error) {
      // Handle validation or request errors
      console.log(error);

      setError(error?.response?.data?.msg || error?.message || "Login failed");
      setSuccess(false);
      setIsLoading(false); // Re-enable button on error
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
              <Link href="/auth/forgot">Forgot Password?</Link>
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
