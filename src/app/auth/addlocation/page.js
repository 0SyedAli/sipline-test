"use client";
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import Map from "@/components/Map";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import * as yup from "yup";

// ✅ Validation schema matches backend keys
const locationValidation = yup.object().shape({
  locationName: yup.string().required("Location is required").min(2),
  latitude: yup.number().required("Latitude is required"),
  longitude: yup.number().required("Longitude is required"),
});

export default function AddLocation() {
  const [addLocation, setAddLocation] = useState(false);
  const [locationData, setLocationData] = useState({
    locationName: "",
    latitude: null,
    longitude: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [adminId, setAdminId] = useState("");

  useEffect(() => {
    const adminData = sessionStorage.getItem("admin");
    if (adminData) {
      try {
        setAdminId(JSON.parse(adminData)._id);
      } catch {
        router.replace("/auth/login");
      }
    } else {
      router.replace("/auth/login");
    }
  }, [router]);

  const handleNext = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const requestData = { adminId, ...locationData };

    try {
      await locationValidation.validate(requestData, { abortEarly: false });
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}admin/updateAdmin`,
        requestData
      );
      if (response.status === 200) {
        router.push("locationdetails");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      if (err.name === "ValidationError") {
        setError(err.errors.join(", "));
      } else {
        setError(err.response?.data?.message || "An error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form>
      {!addLocation ? (
        <button type="button" className="locationBtn" onClick={() => { setAddLocation(true); }} > <span> <FaPlus /> </span> Add Location </button>
      ) : (
        <>
          <Map setLocationData={setLocationData} />
          <div className="mt-3">
            {error && <div className="text-danger mb-2">{error}</div>}
            <AuthBtn
              title={isLoading ? "Saving..." : "Confirm"}
              type="button"
              disabled={isLoading}
              onClick={handleNext}
            />
          </div>
        </>
      )}
    </form>
  );
}
