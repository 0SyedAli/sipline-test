"use client";
import { useEffect, useState } from "react";
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import { useRouter, useSearchParams } from "next/navigation";
import { useHeader } from "@/components/context/HeaderContext";
import SpinnerLoading from "@/components/Spinner/SpinnerLoading";
import { toast } from "react-toastify";
export default function CreateBusinessProfilePage3() {
  // const [workingDays, setWorkingDays] = useState([]);
  // const [workStartTime, setWorkStartTime] = useState("");
  // const [workEndTime, setWorkEndTime] = useState("");
  const [workingDays, setWorkingDays] = useState({
    Monday: { isActive: false, openingTime: "", closeingTime: "" },
    Tuesday: { isActive: false, openingTime: "", closeingTime: "" },
    Wednesday: { isActive: false, openingTime: "", closeingTime: "" },
    Thursday: { isActive: false, openingTime: "", closeingTime: "" },
    Friday: { isActive: false, openingTime: "", closeingTime: "" },
    Saturday: { isActive: false, openingTime: "", closeingTime: "" },
    Sunday: { isActive: false, openingTime: "", closeingTime: "" },
  });


  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); // Store only one error at a time
  const [success, setSuccess] = useState(""); // Store only one error at a time
  const [shopId, setShopId] = useState(""); // Store only one error at a time
  const router = useRouter();
  const header = useHeader();
  const [adminId, setAdminId] = useState("");

  const searchParams = useSearchParams();

  useEffect(() => {
    const shopId = searchParams.get("shop_id");
    if (shopId) {
      setShopId(shopId);
    }
  }, [searchParams]);
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

  }, [router]);

  // Handle day change
  // const handleDayChange = (e) => {
  //   const day = e.target.value;
  //   if (e.target.checked) {
  //     setWorkingDays([...workingDays, day]);
  //   } else {
  //     setWorkingDays(workingDays.filter((d) => d !== day));
  //   }
  // };

  const handleDayChange = (day) => {
    setWorkingDays(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        isActive: !prev[day].isActive,
      }
    }));
  };
  const updateDayTime = (day, field, value) => {
    setWorkingDays(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      }
    }));
  };
  const handleActiveToggle = (day) => {
    setWorkingDays(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        isActive: !prev[day].isActive,
      },
    }));
  };

  const handleTimeChange = (day, field, value) => {
    setWorkingDays(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
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
    // if (!workingDays || !workStartTime || !workEndTime) {
    //   setError("All fields are required.");
    //   setIsLoading(false);
    //   setSuccess(false);
    //   return;
    // }
    const activeDays = Object.keys(workingDays).filter(
      (day) => workingDays[day].isActive
    );

    // No active days selected
    if (activeDays.length === 0) {
      setError("Please select at least one working day.");
      setIsLoading(false);
      return;
    }

    // Check time for each active day
    for (const day of activeDays) {
      const { openingTime, closeingTime } = workingDays[day];
      if (!openingTime || !closeingTime) {
        setError(`Please select start & end time for ${day}.`);
        setIsLoading(false);
        return;
      }
    }

    setError(null); // Clear any existing errors
    setIsLoading(true);

    // const formattedWorkingDays = workingDays.map((day) => ({
    //   day,
    //   isActive: true,
    //   openingTime: workStartTime,
    //   closeingTime: workEndTime,
    // }));

    const formattedWorkingDays = Object.keys(workingDays).map((day) => ({
      day,
      isActive: workingDays[day].isActive,
      openingTime: workingDays[day].openingTime,
      closeingTime: workingDays[day].closeingTime,
    }));



    const apiPayload = new FormData();
    apiPayload.append("adminId", adminId);
    apiPayload.append("shopId", shopId);
    apiPayload.append("workingDays", JSON.stringify(formattedWorkingDays));
    // apiPayload.append("latitude", 40.672552);
    // apiPayload.append("longitude", -73.946558);
    // apiPayload.append("address", "static address");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}admin/updateShop`, {
        method: "POST",
        body: apiPayload,
      });

      const result = await response.json();

      if (response.ok && result?.success) {
        toast.success(result?.msg || "Profile updated successfully!");
        setSuccess(true);
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("admin");
        router.push("login");
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
              {/* <div className="calender_container">
                <label htmlFor="working-days" className="pb-1">
                  Select Working Days
                </label>
                <div className="d-flex my-3" style={{ gap: 10 }}>
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
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
              </label> */}
              <div className="cs-form time_picker d-flex gap-3 align-items-center py-3">
                {/* <div className="d-flex flex-column w-100">
                  <input
                    type="time"
                    className="form-control"
                    value={workStartTime} // show only HH:MM in input
                    onChange={handleStartTimeChange}
                  />
                </div>
                <span>To</span>
                <div className="d-flex flex-column w-100">
                  <input
                    type="time"
                    className="form-control"
                    value={workEndTime} // show only HH:MM in input
                    onChange={handleEndTimeChange}
                  />
                </div> */}
                <div className="wd_table">
                  <label htmlFor="time-range" className="mb-2">
                    Working days & timing
                  </label>

                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Day</th>
                          <th>Active</th>
                          <th style={{ width: 120 }}>Start</th>
                          <th style={{ width: 120 }}>End</th>
                        </tr>
                      </thead>

                      <tbody>
                        {Object.keys(workingDays).map((day) => (
                          <tr key={day}>
                            <td>{day}</td>

                            {/* Active Checkbox */}
                            <td>
                              <input
                                type="checkbox"
                                checked={workingDays[day].isActive}
                                onChange={() => handleActiveToggle(day)}
                              />
                            </td>

                            {/* Start Time */}
                            <td>
                              <input
                                type="time"
                                className="form-control"
                                value={workingDays[day].openingTime}
                                disabled={!workingDays[day].isActive}
                                onChange={(e) =>
                                  handleTimeChange(day, "openingTime", e.target.value)
                                }
                              />
                            </td>

                            {/* End Time */}
                            <td>
                              <input
                                type="time"
                                className="form-control"
                                value={workingDays[day].closeingTime}
                                disabled={!workingDays[day].isActive}
                                onChange={(e) =>
                                  handleTimeChange(day, "closeingTime", e.target.value)
                                }
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
