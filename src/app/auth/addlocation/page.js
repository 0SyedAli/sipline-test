"use client";
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import InputField from "@/components/Form/InputField";
import MapDummy from "@/components/MapDummy";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import * as yup from "yup"; // Ensure proper import


const locationValidation = yup.object().shape({
  locationName: yup
    .string()
    .required("Location is required")
    .min(2, "Location must be at least 2 characters long"),
});

export default function AddLocation() {
  const [addLocation, setAddLocation] = useState(false);
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const [adminId, setAdminId] = useState(""); // Loading state

  useEffect(() => {
    const adminData = sessionStorage.getItem("admin");

    if (adminData) {
      try {
        const AdminData = JSON.parse(adminData);
        setAdminId(AdminData._id);
      } catch (error) {
        console.error("Error parsing admin data from sessionStorage:", error);
      }
    } else {
      router.replace("/auth/login"); // Redirect if no admin data
    }
  }, []);

  const handleNext = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const requestData = {
      adminId: adminId,
      locationName: location,
    };

    try {
      await locationValidation.validate(requestData, { abortEarly: false }); // Validate data
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}admin/updateAdmin`, requestData);

      if (response.status === 200) {
        setSuccess(true);
        router.push("locationdetails"); // Move to next page
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        // If validation fails, set error messages
        setError(error.errors.join(", "));
      } else {
        setError(error.response?.data?.message || "An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form>
      {!addLocation ? (
        <button
          type="button"
          className="locationBtn"
          onClick={() => {
            setAddLocation(true);
          }}
        >
          <span>
            <FaPlus />
          </span>
          Add Location
        </button>
      ) : (
        <>
          <InputField
            placeholder="Search"
            classInput="classInput"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <MapDummy />
          
          <div className="mt-4">
             {error && <p style={{ color: "red" }}>{error}</p>}
            <AuthBtn title="Confirm" type="button" disabled={isLoading} onClick={handleNext} />
          </div>
        </>
      )}
    </form>
  );
}
