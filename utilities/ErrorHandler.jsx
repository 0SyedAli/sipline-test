"use client"; // Ensure this is at the top
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation

const clearSession = () => {
  localStorage.removeItem("authToken");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("bar_id");
};

const ErrorHandler = ({ err }) => {
  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter(); // Correctly using useRouter

  useEffect(() => {
    if (err) {
      const status = err?.response?.status;
      
      if (
        status === 401 || // Unauthorized
        status === 417 || // Expectation Failed
        status === 406 || // Not Acceptable
        status === 500 || // Internal Server Error
        status === 502 // Bad Gateway
      ) {
        setErrorMessage(err.response.data?.message || "An error occurred.");
        setShow(true);
        
        // Handle session expiry
        if (status === 401) {
          clearSession();
          router.push("/auth/login"); // Redirect to login
        }
      } else if (status === 404) {
        setErrorMessage(`Unknown API Called: ${err?.response?.config?.url}. Please ensure the API exists.`);
        setShow(true);
      } else if (status === 511) {
        setErrorMessage("Your session has been ended!!");
        setShow(true);
        clearSession(); // Clear session
      }
    }
  }, [err, router]);

  return (
    <>
      {show && (
        <div
          className="toast show position-fixed bottom-0 end-0 m-3"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          style={{ zIndex: 1050 }} // Ensure it's above other content
        >
          <div className="toast-header">
            <strong className="me-auto">Error</strong>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShow(false)}
              aria-label="Close"
            ></button>
          </div>
          <div className="toast-body">
            {errorMessage}
          </div>
        </div>
      )}
    </>
  );
};

export default ErrorHandler;
