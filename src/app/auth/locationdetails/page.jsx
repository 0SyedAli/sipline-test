"use client";
import InputField from "@/components/Form/InputField";
import { useHeader } from "@/components/context/HeaderContext";
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SpinnerLoading from "@/components/Spinner/SpinnerLoading";
import { toast } from "react-toastify";

export default function LocationDetail() {
  const header = useHeader();
  const router = useRouter();
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [adminId, setAdminId] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const adminData = sessionStorage.getItem("admin");
    const token = sessionStorage.getItem("token");

    if (adminData && token) {
      try {
        const parsedAdminData = JSON.parse(adminData);
        setAdminId(parsedAdminData._id);
        setToken(token);
      } catch (error) {
        console.error("Error parsing admin data from sessionStorage:", error);
      }
    } else {
      router.replace("/auth/login"); // Redirect if no admin data
    }

    setIsClient(true); // Mark as client-side rendering
  }, []);

  const handleNext = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    const apiPayload = new FormData();
    apiPayload.append("adminId", adminId);
    apiPayload.append("latitude", 40.672552);
    apiPayload.append("longitude", -73.946558);
    apiPayload.append("postalCode", postalCode);
    apiPayload.append("country", country);
    apiPayload.append("state", state);
    apiPayload.append("city", city);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}admin/updateAdmin`, {
        method: "POST",
        body: apiPayload,
      });

      // Check if the response status is OK
      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.message || "Failed to update admin profile");
      }

      const result = await response.json();

      // Handle success scenario
      if (result?.success) {
        setSuccess(true);
        toast.success(result?.msg || "Profile updated successfully!");
        setError(null);
        // sessionStorage.setItem("admin", JSON.stringify(result?.data));
        router.push("createbussinessprofile");
      } else {
        // Handle server-side failure
        setSuccess(false);
        toast.error(result?.msg || "Invalid data received");
        setError(result?.msg || "Invalid data received");
      }

    } catch (err) {
      // General error handling
      console.error("API Error:", err);
      setError(err.message || "An unexpected error occurred");
      toast.error(err.message || "An unexpected error occurred");
      setIsLoading(false);
      setSuccess(false);
    }
  };

  if (!isClient) return null;

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
            <label htmlFor="country">Country</label>
            <InputField
              type="text"
              placeholder="United States"
              id="country"
              classInput="classInput"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
            <label htmlFor="city">City</label>
            <InputField
              type="text"
              placeholder="New york"
              id="city"
              classInput="classInput"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <label htmlFor="state">State</label>
            <InputField
              type="text"
              placeholder="New York"
              id="state"
              classInput="classInput"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
            <label htmlFor="postal_code">Postal Code</label>
            <InputField
              type="number"
              placeholder="54440"
              id="postal_code"
              classInput="classInput"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <br />
            <AuthBtn
              title="Next"
              type="button"
              disabled={isLoading}
              onClick={handleNext}
            />
          </form>
        </>
      )}
    </>
  );
}
