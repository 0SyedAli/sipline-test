"use client";
import { useState } from "react";
import InputField from "@/components/Form/InputField";
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import { useRouter } from "next/navigation";
import UploadPhoto from "@/components/UploadPhoto";
import axios from "axios";
import { object, string } from "yup";
import { useHeader } from "@/components/context/HeaderContext";
import SpinnerLoading from "@/components/Spinner/SpinnerLoading";
const profileImg = "/images/profile.png";

// Define the validation schema using Yup
const createProfileValidation = object().shape({
  profile_image: string()
    .matches(
      /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/u,
      "Invalid image format."
    )
    .required("Profile Image is required"),
  image_name: string().required("Profile Image is required"),
  full_name: string()
    .matches(/^[\p{L}\s'-]{2,50}$/u, "Invalid full name.")
    .required("Full name is required"),
  date_of_birth: string()
    .required("Date of birth is required")
    .min(8, "Invalid Date")
    .test("age", "Your age must be 18 or above.", (value) => {
      const today = new Date();
      const birthDate = new Date(value);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age >= 18;
    }),
});

export default function CreateProfilePage() {
  const header = useHeader();
  const router = useRouter();
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

  const handleLogin = async () => {
    setIsLoading(true); // Disable the button on submit
    const profileData = {
      profile_image: image.base64Image.split(",")[1],
      image_name: image.fileName,
      full_name: fullName,
      date_of_birth: `${dateOfBirth.year}-${dateOfBirth.month.padStart(
        2,
        "0"
      )}-${dateOfBirth.day.padStart(2, "0")}`,
    };

    try {
      // Perform Yup validation
      await createProfileValidation.validate(profileData);

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}vendor/auth/create_profile`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.code === 200) {
        setSuccess(true);
        router.push("/auth/selectgender");
        sessionStorage.setItem("step_after_login", "/auth/selectgender")
      } else {
        setError(response.data.message || "Profile creation failed");
        setSuccess(false);
        setIsLoading(false); // Re-enable button on failure
      }
    } catch (error) {
      // Collect validation errors and display them
      setError(error?.response?.data?.message || error?.message);
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
                    onChange={(e) =>
                      setDateOfBirth({ ...dateOfBirth, day: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    placeholder="mm"
                    value={dateOfBirth.month}
                    onChange={(e) =>
                      setDateOfBirth({ ...dateOfBirth, month: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    placeholder="yyyy"
                    value={dateOfBirth.year}
                    onChange={(e) =>
                      setDateOfBirth({ ...dateOfBirth, year: e.target.value })
                    }
                  />
                </div>
              </div>
              {error && <p style={{ color: "red" }}>{error}</p>}
              <AuthBtn
                title="Next"
                type="button"
                disabled={isLoading}
                onClick={handleLogin}
              />
            </fieldset>
          </form>
        </>
      )}
    </>
  );
}
