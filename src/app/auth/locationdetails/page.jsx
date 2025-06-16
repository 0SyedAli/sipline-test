"use client";
import InputField from "@/components/Form/InputField";
import { useDispatch, useSelector } from "react-redux";
import { useHeader } from "@/components/context/HeaderContext";
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { updateForm } from "../../../lib/redux/store/slices/multiStepFormSlice";
import SpinnerLoading from "@/components/Spinner/SpinnerLoading";
import { toast } from "react-toastify";

export default function LocationDetail() {
  const header = useHeader();
  const router = useRouter();
  const dispatch = useDispatch();
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

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   const requestData = {
  //     country,
  //     city,
  //     state,
  //     postal_code: postalCode,
  //     latitude: 24.860735,
  //     longitude: 67.001137,
  //     location: "Saima Arabian Villas",
  //   };

  //   try {
  //     await addLocationValidation.validate(requestData);
  //     const response = await axios.post(
  //       `${process.env.NEXT_PUBLIC_SERVER_URL}vendor/auth/add_location`,
  //       requestData,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${sessionStorage.getItem("token")}`,
  //         },
  //       }
  //     );
  //     if (response?.data?.code === 200) {

  //       sessionStorage.setItem("step_after_login", "/auth/createbussinessprofile");
  //       setSuccess(true);
  //       setError(null);
  //       router.push("/auth/createbussinessprofile");
  //       sessionStorage.setItem("bar_id", response?.data?.data?.bar_id);
  //       sessionStorage.setItem(
  //         "cooking_range",
  //         JSON.stringify(response?.data?.data?.cooking_time_ranges)
  //       );
  //     } else {
  //       setError(response.data.message || "Request failed");
  //       setSuccess(false);
  //       setIsLoading(false);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     setError(error?.message || error?.response?.data?.message);
  //     setSuccess(false);
  //     setIsLoading(false);
  //   }
  // };

  const formData = useSelector((state) => state.multiStepForm);
  console.log("adminId:", adminId);


  const handleNext = async () => {
    if (!country || !city || !state || !postalCode) {
      setError("All fields are required.");
      setIsLoading(false);
      setSuccess(false);
      return;
    }

    setIsLoading(true);
    setSuccess(true);

    // 1. Dispatch current step to Redux
    dispatch(updateForm({
      country,
      city,
      state,
      postal_code: postalCode,
    }));

    const apiPayload = {
      adminId: adminId, // if you're storing it in Redux
      fullName: formData?.full_name,
      DOB: formData?.profileData?.date_of_birth,
      gender: formData?.profileData?.gender,
      phone: formData?.profileData?.phone,
      bio: formData?.profileData?.bio,
      latitude: 24.860735,
      longitude: 67.001137,
      locationName: formData?.profileData?.location_address,
      postalCode: postalCode,
      country: country,
      state: state,
      city: city,
      ...(formData?.profileData?.profile_image && { adminProfile: formData?.profileData?.profile_image }),
    };

    // 3. Call the API
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}admin/updateAdmin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiPayload),
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
        toast.success(result?.message || "Profile updated successfully!");
        setError(null);
        router.push("createbussinessprofile");
      } else {
        // Handle server-side failure
        setSuccess(false);
        toast.error(result?.message || "Invalid data received");
        setError(result?.message || "Invalid data received");
      }

      console.log("API Response:", result);
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
              placeholder="Pakistan"
              id="country"
              classInput="classInput"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
            <label htmlFor="city">City</label>
            <InputField
              type="text"
              placeholder="Karachi"
              id="city"
              classInput="classInput"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <label htmlFor="state">State</label>
            <InputField
              type="text"
              placeholder="Sindh"
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
