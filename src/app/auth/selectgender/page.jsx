"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputField from "@/components/Form/InputField";
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import { useRouter } from "next/navigation";
import Textarea from "@/components/Form/TextArea";
import { useHeader } from "@/components/context/HeaderContext";
import axios from "axios";
import SpinnerLoading from "@/components/Spinner/SpinnerLoading";
import { updateForm } from "../../../lib/redux/store/slices/multiStepFormSlice";
import Image from "next/image";
const mailGen = "/images/profile.png";

// yup validation
// const selectGenderValidation = yup.object().shape({
//   phone: yup
//     .string()
//     .matches(
//       /^(?:\+?\d{1,3}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}|(?:\([0-9]{3}\)|[0-9]{3})[-. ]?[0-9]{3}[-. ]?[0-9]{4}|\+[1-9]\d{1,14})$/,
//       "Invalid phone number format"
//     )
//     .required("Phone number is required"),
//   gender: yup
//     .string()
//     .required("Gender is required")
//     .oneOf(["male", "female"], "Invalid gender. Must be either male or female"),
//   bio: yup
//     .string()
//     .required("Bio is required")
//     .min(3, "Bio must be at least 3 characters long"),
// });

export default function GenderSelectionPage() {
  const header = useHeader();
  const router = useRouter();
  const dispatch = useDispatch();
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  // fetch api
  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true); // Disable the button on submit
  //   const requestData = {
  //     gender: gender,
  //     bio: bio,
  //     phone: phone,
  //   };

  //   try {
  //     await selectGenderValidation.validate(requestData); // Validate the data using Yup
  //     const response = await axios.put(
  //       `${process.env.NEXT_PUBLIC_SERVER_URL}vendor/auth/select_gender`,
  //       requestData,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${sessionStorage.getItem("token")}`,
  //         },
  //       }
  //     );
  //     if (response?.data?.code === 200) {
  //       sessionStorage.setItem("step_after_login", "/auth/addlocation");
  //       setSuccess(true);
  //       setError(null);
  //       router.push("/auth/addlocation");
  //     } else {
  //       setError(response.data.message || "Request failed");
  //       setSuccess(false);
  //       setIsLoading(false); // Re-enable button on failure
  //     }
  //   } catch (error) {
  //     setError(error?.message || error?.response?.data?.message);
  //     setSuccess(false);
  //     setIsLoading(false); // Re-enable button on error
  //   }
  // };
  const formData = useSelector((state) => state);
  console.log("formData:" ,formData);
  
  const handleNext = () => {
    if (!gender || !phone || !bio) {
      setError("All fields are required.");
      setIsLoading(false)
      setSuccess(false)
      return;
    }
    setIsLoading(true)
    setSuccess(true)

    dispatch(updateForm({
      gender: gender,
      phone: phone,
      bio: bio,
    }));
    console.log("Merged form data:", {
      ...formData,
    });
    router.push("addlocation"); // move to next page
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
                <div className="gender_container d-flex justify-content-center gap-3 align-items-center mb-5">
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
                title="Bio"
                value={bio}
                setBio={setBio} // Ensure this is working correctly
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
