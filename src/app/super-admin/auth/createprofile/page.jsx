"use client";
import { useEffect, useState } from "react";
import InputField from "@/components/Form/InputField";
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import { useRouter } from "next/navigation";
import { useHeader } from "@/components/context/HeaderContext";
import SpinnerLoading from "@/components/Spinner/SpinnerLoading";
import UploadImage from "@/components/UploadImage";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
const profileImg = "/images/profile.png";
const defaultProfileImage = "/images/default-avatar.png";

export default function CreateProfilePage() {
  const header = useHeader();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState({
    day: "",
    month: "",
    year: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [existingImage, setExistingImage] = useState(defaultProfileImage);

  // useEffect(() => {
  //   const adminData = sessionStorage.getItem("admin");

  //   if (adminData) {
  //     try {
  //       const AdminData = JSON.parse(adminData);
  //       setAdminId(AdminData._id);

  //       // Set the existing profile image if available
  //       const profileImagePath = AdminData.profileImagePath || defaultProfileImage;
  //       setExistingImage(`${process.env.NEXT_PUBLIC_IMAGE_URL}${profileImagePath}`);
  //     } catch (error) {
  //       console.error("Error parsing admin data from sessionStorage:", error);
  //     }
  //   } else {
  //     router.replace("/auth/login"); // Redirect if no admin data
  //   }
  // }, []);

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

  const handleFileChange = (file) => {
    setImageFile(file);
    setExistingImage(URL.createObjectURL(file)); // Update the preview image dynamically
  };

  const handleNext = async () => {
    if (!imageFile || !fullName || !dateOfBirth.day || !dateOfBirth.month || !dateOfBirth.year) {
      setError("All fields are required.");
      setIsLoading(false);
      setSuccess(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const dob = `${dateOfBirth.day.padStart(2, "0")}-${dateOfBirth.month.padStart(2, "0")}-${dateOfBirth.year}`;
    const formData = new FormData();
    formData.append("adminId", adminId);
    formData.append("fullName", fullName);
    formData.append("DOB", dob);
    formData.append("profilePath", "auth/addlocation");
    if (imageFile) {
      formData.append("adminProfile", imageFile);
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}admin/updateAdmin`, formData);

      if (response.status === 200) {
        setSuccess(true);
        router.push("selectgender");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error updating admin profile:", error);
      setError(error.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
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
              <UploadImage
                onFileChange={handleFileChange}
                existingImage={existingImage}
              />
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
                      const value = e.target.value.slice(0, 2);
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
                      setDateOfBirth({ ...dateOfBirth, month: value });
                    }}
                    max={2}
                  />
                  <input
                    type="number"
                    placeholder="yyyy"
                    value={dateOfBirth.year}
                    onChange={(e) => {
                      const value = e.target.value.slice(0, 4);
                      setDateOfBirth({ ...dateOfBirth, year: value });
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
