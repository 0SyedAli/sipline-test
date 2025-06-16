"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import InputField from "@/components/Form/InputField";
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import Link from "next/link";
import { useHeader } from "@/components/context/HeaderContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

export default function SignUp() {
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

  const handleSignup = async (e) => {
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
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}admin/signup`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      if (response?.data?.success === true) {
        if (response?.data?.data) {
          // Handle successful Signup
          setSuccess(true);
          toast.success(response?.data?.msg || "Signup successful!");
          setError(null);

          // Store data in sessionStorage

          sessionStorage.setItem("token", response?.data?.accessToken);
          sessionStorage.setItem("admin", JSON.stringify(response?.data?.data));
          router.push("otp");
        }
        else {
          toast.error(response?.data?.msg || "Invalid Email");
          setError(response?.data?.msg || "Signup failed");
          setSuccess(false);
          setIsLoading(false); // Re-enable button on failure
        }
        // Redirect to next step
      } else {
        // Handle Signup failure
        setError(response?.data?.msg || "Signup failed");
        setSuccess(false);
        setIsLoading(false); // Re-enable button on failure
      }
    } catch (error) {
      // Handle validation or request errors
      setError(error?.response?.data?.msg || error?.message);
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
          <form onSubmit={handleSignup}>
            <label htmlFor="email">Email:</label>
            <InputField
              type="email"
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
              show={show}
              handleClick={handleClick}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="remember d-flex justify-content-between align-items-center pb-4">
              <div className="d-flex align-items-center gap-2">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember"> Remember me</label>
              </div>
              {/* <Link href="/auth/login" style={{ color: "blue!important", textDecoration: "underline" }}>Already have an account?</Link> */}
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <AuthBtn title="Login" type="submit" disabled={isLoading} />
          </form>
          <div className='register_link'>
            <h5>Already have an account? <Link href="login">Login</Link></h5>
          </div>
        </>
      )}
    </>
  );
}
