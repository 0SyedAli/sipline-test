"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import Image from "next/image";
import axios from "axios";
import InputField from "@/components/Form/InputField";
import { Textarea } from "@chakra-ui/react";
import { RxCross2 } from "react-icons/rx";
import UploadImage from "@/components/UploadImage";
import { toast } from "react-toastify";

const userCover = "/images/userCover.jpg";

const UserProfile = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tag, setTag] = useState("");
  const [error, setError] = useState(null);
  const [adminId, setAdminId] = useState("");
  const [shopId, setShopId] = useState("");
  const [shopData, setShopData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [workingDays, setWorkingDays] = useState({
    Monday: { isActive: false, openingTime: "", closeingTime: "" },
    Tuesday: { isActive: false, openingTime: "", closeingTime: "" },
    Wednesday: { isActive: false, openingTime: "", closeingTime: "" },
    Thursday: { isActive: false, openingTime: "", closeingTime: "" },
    Friday: { isActive: false, openingTime: "", closeingTime: "" },
    Saturday: { isActive: false, openingTime: "", closeingTime: "" },
    Sunday: { isActive: false, openingTime: "", closeingTime: "" },
  });
  const [formData, setFormData] = useState({
    barName: "",
    postalCode: "",
    cookingTime: "",
    barDetails: "",
    address: "",
    shopImage: "",
  });

  const router = useRouter();

  const handleCategoryAdd = () => {
    if (tag && !selectedCategories.includes(tag)) {
      setSelectedCategories((prev) => [...prev, tag]);
    }
    setTag("");
  };

  const handleCategoryRemove = (category) => {
    setSelectedCategories((prev) => prev.filter((cat) => cat !== category));
  };

  const handleFileChange = (file) => {
    setImageFile(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const adminData = JSON.parse(sessionStorage.getItem("admin"));
    if (adminData?._id && adminData?.shopId) {
      setAdminId(adminData._id);
      // setShopId(adminData?.shopId?._id);
    } else {
      console.error("User not authenticated");
      // // router.push("/auth/login"); 2 2
    }
  }, [router]);

  const fetchBusinessCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}superAdmin/getAllbusinessCategories`
      );
      if (response?.data?.success && Array.isArray(response.data.data)) {
        setCategories(response.data.data);
      } else {
        setCategories([]); // safe fallback
        toast.error("Failed to load categories");
      }
    } catch (error) {
      console.error("Fetch categories error:", error);
      toast.error("Error loading categories");
    }
  };

  useEffect(() => {
    if (adminId) {
      getShopData();
      fetchBusinessCategories();

    }
  }, [adminId]);

  const getShopData = async () => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      setError("Authentication required. Please log in again.");
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}admin/getShopByAdminId?adminId=${adminId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.success) {
        setShopData(response.data?.data || {});
        setFormData({
          barName: response.data?.data?.barName || "",
          postalCode: response.data?.data?.postalCode || "",
          cookingTime: response.data?.data?.cookingTime || "",
          barDetails: response.data?.data?.barDetails || "",
          address: response.data?.data?.address || "",
          shopImage: response.data?.data?.shopImage
            ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${response.data.data.shopImage}`
            : "",
        });
        if (response.data.data.shopImage) {
          // You'll need to fetch the actual image from your server
          const imageUrl = `${process.env.NEXT_PUBLIC_IMAGE_URL}${response.data.data.shopImage}`;
          // Convert to base64 or use directly depending on your UploadImage component
          setImageFile(response.data.data.shopImage); // Store the filename
          // If your component needs a preview, you might need to fetch the image
        }
        setSelectedCategories(response.data?.data?.category || []);
        // ✅ Map Working Days into state
        if (response.data?.data?.workingDays) {
          const apiDays = response.data.data.workingDays;

          const formatted = { ...workingDays };

          apiDays.forEach((wd) => {
            if (formatted[wd.day]) {
              formatted[wd.day] = {
                isActive: wd.isActive,
                openingTime: wd.openingTime || "",
                closeingTime: wd.closeingTime || "",
              };
            }
          });

          setWorkingDays(formatted);
        }
      } else {
        setError("Failed to fetch shop data.");
      }
    } catch (error) {
      setError("Error fetching shop data.");
      console.error(error);
    }
  };

  // console.log("abc:", `${formData.shopImage}`);
  const handleActiveToggle = (day) => {
    setWorkingDays((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        isActive: !prev[day].isActive,
      },
    }));
  };

  const handleTimeChange = (day, field, value) => {
    setWorkingDays((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };
  // console.log(selectedCategories);

  const handleUpdateShop = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const token = sessionStorage.getItem("token");
    if (!token) {
      setError("Authentication required. Please log in again.");
      setIsLoading(false);
      return;
    }

    const formDataToSend = new FormData();

    // Append the image file if it exists
    if (imageFile) {
      formDataToSend.append("shopImage", imageFile);
    }
    const formattedWorkingDays = Object.keys(workingDays).map((day) => ({
      day,
      isActive: workingDays[day].isActive,
      openingTime: workingDays[day].openingTime,
      closeingTime: workingDays[day].closeingTime,
    }));

    formDataToSend.append("workingDays", JSON.stringify(formattedWorkingDays));
    // Append other form data
    formDataToSend.append("barName", formData.barName);
    formDataToSend.append("postalCode", formData.postalCode);
    formDataToSend.append("cookingTime", formData.cookingTime);
    formDataToSend.append("barDetails", formData.barDetails);
    formDataToSend.append("address", formData.address);
    // formDataToSend.append("category", JSON.stringify(selectedCategories));
    // selectedCategories.forEach((cat) => {
    //   formDataToSend.append("category", cat);
    // });
    formDataToSend.append("adminId", adminId);
    formDataToSend.append("shopId", shopData?._id);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}admin/updateShop`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success) {
        toast.success(response.data?.msg || "Profile updated successfully!", {
          autoClose: 3000,
        });
        getShopData(); // Refresh the data
        // router.back();
      } else {
        toast.error(response.data?.msg || "Failed to update profile");
        setError(response.data?.msg || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error during API call:", error);
      toast.error(error.response?.data?.msg || "An unexpected error occurred");
      setError(error.response?.data?.msg || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page">
      <form onSubmit={handleUpdateShop}>
        <div className="user_banner mt-5">
          <div className="up_upload">
            <div className="up_cover">
              <Image width={1461} height={300} src={userCover} alt="Cover" priority={false} />
              {/* <div className="up_upload_btn">
                <FaPlus />
              </div> */}
            </div>
            <div className="user_profile">
              <UploadImage
                onFileChange={handleFileChange}
                existingImage={formData.shopImage ? formData.shopImage : null}
              />
            </div>
          </div>
        </div>

        <div className="user_profile_body">
          <div className="row">
            <div className="col-md-8">
              <div className="row">
                <div className="col-md-6">
                  <label htmlFor="barName">Business Name</label>
                  <InputField
                    type="text"
                    name="barName"
                    placeholder="Neon Night Bar"
                    id="barName"
                    classInput="classInput"
                    value={formData.barName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="postalCode">Postal Code</label>
                  <InputField
                    type="number"
                    name="postalCode"
                    placeholder="05546"
                    id="postalCode"
                    classInput="classInput"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="address">Address</label>
                  <InputField
                    type="text"
                    name="address"
                    placeholder="Jerry"
                    id="address"
                    classInput="classInput"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="cookingTime">Cooking Time</label>
                  <InputField
                    type="text"
                    name="cookingTime"
                    placeholder="25min to 30min"
                    id="cookingTime"
                    classInput="classInput"
                    value={formData.cookingTime}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div>
                {/* <label htmlFor="category" className="mb-2">
                  Add Category
                </label>
                <div className="d-flex align-items-center gap-2">
                  <select
                    className="form-select input_field2"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    aria-label="Search Category"
                  >
                    <option value="">Search Category</option>
                    {Array.isArray(categories) &&
                      categories
                        .filter((category) => !selectedCategories.includes(category.businessCatName))
                        .map((category) => (
                          <option key={category._id} value={category.businessCatName}>
                            {category.businessCatName}
                          </option>
                        ))}
                  </select>
                  <button type="button" className="add_cat_btn" onClick={handleCategoryAdd}>
                    Add
                  </button>
                </div>

                <div className="d-flex my-2 flex-wrap" style={{ gap: 10, minHeight: "35px" }}>
                  {selectedCategories.map((category, index) => (
                    <div key={index} className="tags_category">
                      {category}
                      <span onClick={() => handleCategoryRemove(category)} style={{ marginLeft: 5, cursor: "pointer" }}>
                        <RxCross2 />
                      </span>
                    </div>
                  ))}
                </div> */}
                <div>
                  <label htmlFor="barDetails" className="mb-2">Bar Details</label>
                  <Textarea
                    placeholder="Bar Details"
                    className="textarea_field2 textarea_field4"
                    name="barDetails"
                    value={formData.barDetails}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <label className="mb-3">Working Days & Timings</label>

              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th style={{ width: "100px" }}>Day</th>
                      <th style={{ width: "50px", textAlign: "center" }}>Active</th>
                      <th style={{ width: 120 }}>Start</th>
                      <th style={{ width: 120 }}>End</th>
                    </tr>
                  </thead>

                  <tbody>
                    {Object.keys(workingDays).map((day) => (
                      <tr key={day}>
                        <td>{day}</td>

                        <td className="text-center">
                          <input
                            type="checkbox"
                            checked={workingDays[day].isActive}
                            onChange={() => handleActiveToggle(day)}
                          />
                        </td>

                        <td>
                          <input
                            type="time"
                            className="form-control"
                            disabled={!workingDays[day].isActive}
                            value={workingDays[day].openingTime}
                            onChange={(e) =>
                              handleTimeChange(day, "openingTime", e.target.value)
                            }
                          />
                        </td>

                        <td>
                          <input
                            type="time"
                            className="form-control"
                            disabled={!workingDays[day].isActive}
                            value={workingDays[day].closeingTime}
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
            <div className="col-md-12">
              <div className="row">
                <div className="col-3">
                  <div className="">
                    <AuthBtn
                      title={isLoading ? "Processing..." : "Submit"}
                      type="submit"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;