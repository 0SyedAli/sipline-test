"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputField from "@/components/Form/InputField";
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import { useRouter } from "next/navigation";
import UploadPhoto from "@/components/UploadPhoto";
import { useHeader } from "@/components/context/HeaderContext";
import { updateForm } from "../../../lib/redux/store/slices/multiStepFormSlice";
import SpinnerLoading from "@/components/Spinner/SpinnerLoading";
import "react-toastify/dist/ReactToastify.css";
const profileImg = "/images/profile.png";

export default function CreateProfilePage() {
  const header = useHeader();
  const router = useRouter();
  const dispatch = useDispatch();
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState({
    day: "",
    month: "",
    year: "",
  });
  const [image, setImage] = useState({ base64Image: "", fileName: null });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const handleImageChange = (base64Image) => {
    setImage(base64Image);
  };
  const handleNext = () => {
    if (!image.fileName || !fullName || !dateOfBirth.day || !dateOfBirth.month || !dateOfBirth.year) {
      setError("All fields are required.");
      setIsLoading(false)
      setSuccess(false)
      return;
    }
    setIsLoading(true)
    setSuccess(true)
    const dob = `${dateOfBirth.day.padStart(2, "0")}-${dateOfBirth.month.padStart(2, "0")}-${dateOfBirth.year}`;

    dispatch(updateForm({
      profile_image: image.fileName,
      full_name: fullName,
      date_of_birth: dob,
    }));

    router.push("selectgender"); // move to next page
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
              <label htmlFor="fullName">Full Name</label>
              <InputField
                type="text"
                id="fullName"
                imageSrc={profileImg}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <div className="inputField">
                <label htmlFor="dateOfBirth">Date of birth</label>
                <div className="date_picker py-2 d-flex align-items-center justify-content-between">
                  <input
                    type="number"
                    placeholder="dd"
                    value={dateOfBirth.day}
                    onChange={(e) => {
                      const value = e.target.value.slice(0, 2); // Limit to 2 characters
                      setDateOfBirth({ ...dateOfBirth, day: value });
                    }}
                    max={2}
                  />
                  <input
                    type="number"
                    placeholder="mm"
                    value={dateOfBirth.month}
                    onChange={(e) => {
                      const value = e.target.value.slice(0, 2);
                      setDateOfBirth({ ...dateOfBirth, month: value })
                    }}
                    max={2}
                  />
                  <input
                    type="number"
                    placeholder="yyyy"
                    value={dateOfBirth.year}
                    onChange={(e) => {
                      const value = e.target.value.slice(0, 4);
                      setDateOfBirth({ ...dateOfBirth, year: value })
                    }}
                  />
                </div>
              </div>
              {error && <p style={{ color: "red" }}>{error}</p>}
              <AuthBtn
                title="Next"
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
