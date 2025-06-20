"use client";
import { useEffect, useState } from "react";
import InputField from "@/components/Form/InputField";
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import { useRouter } from "next/navigation";
import { Textarea } from '@chakra-ui/react'
import { useHeader } from "@/components/context/HeaderContext";
import axios from "axios";
import * as yup from "yup"; // Ensure proper import
import SpinnerLoading from "@/components/Spinner/SpinnerLoading";
import Image from "next/image";
const mailGen = "/images/profile.png";

// yup validation
const genderValidation = yup.object().shape({
  phone: yup
    .string()
    .min(3, "Phone Number must be at least 3 numbers long")
    .matches(
      /^(?:\+?\d{1,3}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}|(?:\([0-9]{3}\)|[0-9]{3})[-. ]?[0-9]{3}[-. ]?[0-9]{4}|\+[1-9]\d{1,14})$/,
      "Invalid phone number format"
    )
    .required("Phone number is required"),
  gender: yup
    .string()
    .required("Gender is required")
    .oneOf(["male", "female"], "Invalid gender. Must be either male or female"),
  bio: yup
    .string()
    .required("Bio is required")
    .min(3, "Bio must be at least 3 characters long"),
});

export default function GenderSelectionPage() {
  const header = useHeader();
  const router = useRouter();
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
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
      gender: gender,
      bio: bio,
      phone: phone,
    };

    try {
      await genderValidation.validate(requestData, { abortEarly: false }); // Validate data
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}admin/updateAdmin`, requestData);

      if (response.status === 200) {
        setSuccess(true);
        router.push("addlocation"); // Move to next page
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
              <div>
                <div className="gender_container d-flex justify-content-center gap-3 align-items-center mb-3 mb-md-4 mb-xl-5">
                  <div className="text-center">
                    <label className="select_gender">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        onChange={(e) => setGender(e.target.value)}
                      />
                      <div className="gender_btn">
                        <Image width={20} height={20} src={mailGen} alt="gender icon" />
                      </div>
                      Male
                    </label>
                  </div>
                  <div className="text-center">
                    <label className="select_gender">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        onChange={(e) => setGender(e.target.value)}
                      />
                      <div className="gender_btn">
                        <Image width={20} height={20} src={mailGen} alt="gender icon" />
                      </div>
                      Female
                    </label>
                  </div>
                </div>
              </div>

              <label htmlFor="phone">Phone Number:</label>
              <InputField
                type="number"
                id="phone"
                value={phone}
                placeholder="(0) 123 456 789"
                classInput="classInput"
                onChange={(e) => setPhone(e.target.value)}
              />
              <Textarea
                placeholder="Bio"
                className="textarea_field"
                onChange={(e) => setBio(e.target.value)}
              />

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
