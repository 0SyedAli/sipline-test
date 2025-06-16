"use client";
import { useEffect, useState } from "react";
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import { useRouter } from "next/navigation";
import { useHeader } from "@/components/context/HeaderContext";
import { useSelector } from "react-redux";
import SpinnerLoading from "@/components/Spinner/SpinnerLoading";
import { toast } from "react-toastify";
export default function CreateBusinessProfilePage3() {
  const [workingDays, setWorkingDays] = useState([]);
  const [workStartTime, setWorkStartTime] = useState("");
  const [workEndTime, setWorkEndTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); // Store only one error at a time
  const [success, setSuccess] = useState(""); // Store only one error at a time
  const router = useRouter();
  const header = useHeader();
  const [adminId, setAdminId] = useState("");
  const formData = useSelector((state) => state.multiStepForm);
  console.log(formData);

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

  // Handle day change
  const handleDayChange = (e) => {
    const day = e.target.value;
    if (e.target.checked) {
      setWorkingDays([...workingDays, day]);
    } else {
      setWorkingDays(workingDays.filter((d) => d !== day));
    }
  };

  // Ensure seconds are added as :00 to the time input
  const formatTimeWithSeconds = (time) => {
    if (time && !time.includes(":00")) {
      return `${time}`;
    }
    return time;
  };

  // Handle start time change
  const handleStartTimeChange = (e) => {
    const startTime = e.target.value;
    setWorkStartTime(formatTimeWithSeconds(startTime));
  };
  // Handle end time change
  const handleEndTimeChange = (e) => {
    const endTime = e.target.value;
    setWorkEndTime(formatTimeWithSeconds(endTime));
  };

  const handleNext = async () => {
    if (!workingDays || !workStartTime || !workEndTime) {
      setError("All fields are required.");
      setIsLoading(false);
      setSuccess(false);
      return;
    }

    setError(null); // Clear any existing errors
    setIsLoading(true);

    const formattedWorkingDays = workingDays.map((day) => ({
      day,
      isActive: true,
      openingTime: workStartTime,
      closeingTime: workEndTime,
    }));

    const apiPayload = new FormData();
    apiPayload.append("adminId", adminId);
    apiPayload.append("postalCode", formData?.shopData?.postalCode);
    apiPayload.append("cookingTime", formData?.shopData?.cookingTime);
    apiPayload.append("category", JSON.stringify(formData?.shopData?.categories));
    apiPayload.append("barDetails", JSON.stringify(formData?.shopData?.bar_detail));
    apiPayload.append("workingDays", JSON.stringify(formattedWorkingDays));
    apiPayload.append("longitude", 67.001137);
    apiPayload.append("latitude", 24.860735);
    apiPayload.append("address", "static address");
    if (formData?.shopData?.shopImage) {
      apiPayload.append("shopImage", formData?.shopData?.shopImage);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}admin/createShop`, {
        method: "POST",
        body: apiPayload,
      });

      const result = await response.json();

      if (response.ok && result?.success) {
        toast.success(result?.msg || "Profile updated successfully!");
        setSuccess(true);
        router.push("/dashboard");
      } else {
        toast.error(result?.msg || "Invalid data received");
        setError(result?.msg || "Invalid data received");
      }
    } catch (err) {
      console.error("Error during API call:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {success ? (
        <SpinnerLoading />
      ) : (
        <div>
          <div className="form_head">
            <h2>{header?.title}</h2>
            <p>{header?.description}</p>
          </div>
          <form className="position-relative mt-5 pt-0">
            <fieldset>
              <div className="calender_container">
                <label htmlFor="working-days" className="pb-1">
                  Select Working Days
                </label>
                <div className="d-flex my-3" style={{ gap: 10 }}>
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Saturday",
                    "Sunday",
                  ].map((day) => (
                    <div key={day} className="calender_item">
                      <input
                        type="checkbox"
                        id={day.toLowerCase()}
                        value={day}
                        onChange={handleDayChange}
                      />
                      <label htmlFor={day.toLowerCase()}>{day.slice(0, 3)}</label>
                      <div className="calender_spot"></div>
                    </div>
                  ))}
                </div>
              </div>

              <label htmlFor="time-range" className="mt-2">
                Time Range
              </label>
              <div className="cs-form time_picker d-flex gap-3 align-items-center py-3">
                <div className="d-flex flex-column">
                  <input
                    type="time"
                    className="form-control"
                    value={workStartTime.replace(":00", "")} // show only HH:MM in input
                    onChange={handleStartTimeChange}
                  />
                </div>
                <span>To</span>
                <div className="d-flex flex-column">
                  <input
                    type="time"
                    className="form-control"
                    value={workEndTime.replace(":00", "")} // show only HH:MM in input
                    onChange={handleEndTimeChange}
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
        </div>
      )}
    </>
  );
}
