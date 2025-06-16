"use client";
import { useState, useEffect } from "react";
import InputField from "@/components/Form/InputField";
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import { useRouter } from "next/navigation";
import UploadPhoto from "@/components/UploadPhoto";
import SpinnerLoading from "@/components/Spinner/SpinnerLoading";
import { useHeader } from "@/components/context/HeaderContext";
import { updateShopData } from "../../../lib/redux/store/slices/multiStepFormSlice";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";

export default function CreateBusinessProfilePage() {
  const router = useRouter();
  const [postalCode, setPostalCode] = useState("");
  const dispatch = useDispatch();
  const header = useHeader();
  const [shopImage, setShopImage] =  useState({ base64Image: "", fileName: null });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [selectedCookingTimeId, setSelectedCookingTimeId] = useState("");
  const cookingTime = ["30 min", "40 min", "50 min"];
  const handleImageChange = (base64Image) => {
    if (base64Image) {
      setShopImage(base64Image);
    }
  };

  const handleNext = () => {
    if (!shopImage?.fileName || !postalCode || !selectedCookingTimeId) {
      setError("All fields are required.");
      setIsLoading(false)
      setSuccess(false)
      return;
    }
    setIsLoading(true)
    setSuccess(true)

    dispatch(updateShopData({
      shopImage: shopImage?.fileName,
      postalCode: postalCode,
      cookingTime: selectedCookingTimeId,
    }));

    router.push("createbussinessprofile2"); // move to next page
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
              <UploadPhoto onImageUpload={handleImageChange} />
              <label>Postal Code</label>
              <InputField
                type="number"
                id="postal_code"
                classInput="classInput"
                placeholder="25"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
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
