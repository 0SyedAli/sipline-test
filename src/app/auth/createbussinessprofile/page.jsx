"use client";
import { useState, useEffect } from "react";
import InputField from "@/components/Form/InputField";
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import { useRouter } from "next/navigation";
import SpinnerLoading from "@/components/Spinner/SpinnerLoading";
import { useHeader } from "@/components/context/HeaderContext";
import "react-toastify/dist/ReactToastify.css";
import UploadImage from "@/components/UploadImage";
import { toast } from "react-toastify";
const defaultProfileImage = "/images/default-avatar.png";

export default function CreateBusinessProfilePage() {
  const router = useRouter();
  const [postalCode, setPostalCode] = useState("");
  const header = useHeader();
  const [shopImage, setShopImage] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [adminId, setAdminId] = useState(""); // Loading state
  const [selectedCookingTimeId, setSelectedCookingTimeId] = useState("");
  const cookingTime = ["30 min", "40 min", "50 min"];
  const [existingImage, setExistingImage] = useState(defaultProfileImage);

  const handleFileChange = (file) => {
    setShopImage(file);
    setExistingImage(URL.createObjectURL(file)); // Update the preview image dynamically
  };

  useEffect(() => {
    const adminData = sessionStorage.getItem("admin");

    if (adminData) {
      try {
        const parsedAdminData = JSON.parse(adminData);
        setAdminId(parsedAdminData._id);
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

    const apiPayload = new FormData();
    apiPayload.append("adminId", adminId);
    apiPayload.append("shopImage", shopImage);
    apiPayload.append("postalCode", postalCode);
    apiPayload.append("cookingTime", selectedCookingTimeId);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}admin/createShop`, {
        method: "POST",
        body: apiPayload,
      });

      // Check if the response status is OK
      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.message || "Failed to Create Shop");
      }

      const result = await response.json();

      // Handle success scenario
      if (result?.success) {
        setSuccess(true);
        toast.success(result?.msg || "Shop Created successfully!");
        setError(null);
        // sessionStorage.setItem("admin", JSON.stringify(result?.data));
        router.push(`createbussinessprofile2?shop_id=${result?.data?._id}`);
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
            <fieldset>
              {/* <UploadPhoto onImageUpload={handleImageChange} /> */}
              <UploadImage
                onFileChange={handleFileChange}
                existingImage={existingImage}
              />
              <label>Postal Code</label>
              <InputField
                type="number"
                id="postal_code"
                classInput="classInput"
                placeholder="25"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
              />
              <label>Cooking Time</label>
              <div className="inputField">
                <select
                  className="form-select input_select"
                  aria-label="Cooking Time Range"
                  value={selectedCookingTimeId}
                  onChange={(event) =>
                    setSelectedCookingTimeId(event.target.value)
                  }
                >
                  <option value="" defaultValue>
                    Search Category
                  </option>
                  {cookingTime?.map((time, index) => (
                    <option key={index} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              {error && <p style={{ color: "red" }}>{error}</p>}
              <AuthBtn
                title="Create Business Profile"
                type="button"
                disabled={isLoading}
                onClick={handleNext}
              />
            </fieldset>
          </form>
        </>
      )}
    </>
  );
}
