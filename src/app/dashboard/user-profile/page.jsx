"use client";
import ProductCards from "@/components/ProductCards";
import SpinnerLoading from "@/components/SpinnerLoading";
import { FaArrowRightLong } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaPlus, FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import Link from "next/link";
import AllReviews from "@/components/AllReviews";
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import Image from "next/image";
import axios from "axios";
import InputField from "@/components/Form/InputField";
import { Textarea } from "@chakra-ui/react";
import { RxCross2 } from "react-icons/rx";
const user_cover = "/images/userCover.jpg";
const customer = "/images/default-avatar.png";
const edit_icon = "/images/edit_icon.png";
const UserProfile = () => {
  const [categories] = useState(["Category1", "Category2", "Category3", "Category4"]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [tag, setTag] = useState("");
  const [activeTab, setActiveTab] = useState("product");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminId, setAdminId] = useState("");
  const [adminData, setAdminData] = useState("");
  const [shopId, setShopId] = useState("");
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);
  const [products, setProducts] = useState([]);
  const [shopWorkingDays, setShopWorkingDays] = useState([]);
  const [shopData, setShopData] = useState([]);
  const [workingDays, setWorkingDays] = useState([]);
  const [workStartTime, setWorkStartTime] = useState("");
  const [workEndTime, setWorkEndTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(""); // Store only one error at a time
  const [barDetail, setBarDetail] = useState(""); // Store only one error at a time
  const [showFirstDiv, setShowFirstDiv] = useState(true);
  const handleCategoryAdd = () => {
    if (tag && !selectedCategories.includes(tag)) {
      setSelectedCategories((prev) => [...prev, tag]);
    }
    setTag(""); // Clear the dropdown selection
  };

  const handleCategoryRemove = (category) => {
    setSelectedCategories((prev) => prev.filter((cat) => cat !== category));
  };

  const toggleDivs = () => {
    setShowFirstDiv((prev) => !prev);
  };

  useEffect(() => {
    const adminData = JSON.parse(sessionStorage.getItem("admin"));
    if (adminData && adminData?._id && adminData?.shopId) {
      setAdminId(adminData?._id);
      setAdminData(adminData);
      setShopId(adminData?.shopId);
    } else {
      console.error("User not found or missing '_id' property");
      // router.push("/auth/login"); 2
    }
  }, [router, refreshKey]);

  useEffect(() => {
    if (adminId) {
      getProducts();
      getShop(); // Call the function on component mount
    }
  }, [adminId]);

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

  const handleNext = async (e) => {
    e.preventDefault();
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
    apiPayload.append("shopId", shopId);
    apiPayload.append("workingDays", JSON.stringify(formattedWorkingDays));

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}admin/updateShop`, {
        method: "POST",
        body: apiPayload,
      });

      const result = await response.json();

      if (response.ok && result?.success) {
        toast.success(result?.msg || "Profile updated successfully!");
        setSuccess(true);
        await getShop();  // <-- Add this line

        // Also increment refreshKey if you're using it elsewhere
        setRefreshKey(prev => prev + 1);

        // router.push("/dashboard");
      } else {
        toast.error(result?.msg || "Invalid data received");
        setError(result?.msg || "Invalid data received");
      }
    } catch (err) {
      console.error("Error during API call:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
      setSuccess(false);
    }
  };

  const getProducts = async () => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      setError("Missing authentication details. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      setError(null);
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}admin/getAllProducts?adminId=${adminId}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        toast.success("Products fetched successfully!");
        setProducts(data.data);
      } else {
        throw new Error(data.msg || "Failed to fetch products.");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error.message || "Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getShop = async () => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      setError("Missing authentication details. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}admin/getShopByAdminId?adminId=${adminId}`,
      );
      if (response?.data?.success) {
        setShopWorkingDays(response.data.data.workingDays || []);
        setShopData(response?.data?.data || []);
      } else {
        console.error("Failed to fetch shop data");
      }
    } catch (error) {
      console.error("Error fetching shop data:", error);
    }
  };
  console.log("shopData", shopData);

  return (
    <div className="page">
      <div className="user_banner mt-5">
        <div className="up_upload">
          <div className="up_cover">
            <img src={user_cover} alt="" />
            {/* <div className="up_upload_btn">
              <FaPlus />
            </div> */}
          </div>
          <div className="user_profile">
            {console.log("image:", process.env.NEXT_PUBLIC_IMAGE_URL + shopData?.shopImage)}
            <Image width={126} height={126} src={shopData?.shopImage ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${shopData?.shopImage}` : customer} alt="" />
            {/* <div className="up_upload_btn">
              <FaPlus />
            </div> */}
          </div>
        </div>
      </div>
      {showFirstDiv ? (
        <div className="user_profile_body">
          <div className="row gy-4 gy-xl-0">
            <div className="col-xl-9">
              <h4>
                <FaStar />
                0.0 | Rating
              </h4>
              <div className="up_heading d-flex align-items-center gap-3">
                <h3>{shopData?.barName || "Unknown"}</h3>
                <Link className="border-0 bg-transparent" href="edit-profile" >
                  <img src={edit_icon} alt="" />
                </Link>
              </div>
              <h4 className="mb-0">{shopData?.address}</h4>

              <div className="manage_order_head">
                <div className="tabs mo_tabs">
                  <button
                    className={activeTab === "product" ? "active" : ""}
                    onClick={() => setActiveTab("product")}
                  >
                    Products
                  </button>
                  <button
                    className={activeTab === "reviews" ? "active" : ""}
                    onClick={() => setActiveTab("reviews")}
                  >
                    Reviews
                  </button>
                  <button
                    className={activeTab === "details" ? "active" : ""}
                    onClick={() => setActiveTab("details")}
                  >
                    Details
                  </button>
                </div>
              </div>
              <div className="tab-content">
                {activeTab === "product" && (
                  <div className="page product_tab">
                    {loading ? (
                      <div className="page pt-4 px-0">
                        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "150px" }}>
                          <SpinnerLoading />
                        </div>
                      </div>
                    ) : error ? (
                      <p>{error}</p>
                    ) : products.length === 0 ? (
                      <p style={{ textAlign: "left", color: "gray", marginTop: "20px" }}>
                        Product not found.
                      </p>
                    ) : (
                      <>
                        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xxl-4 gx-3">
                          {products.slice(0, 4).map((product) => (
                            <div className="col" key={product._id}>
                              <ProductCards
                                name={product.name}
                                price={product.price}
                                stockQuantity={product.StockQuantity}
                                image={
                                  product.productImages?.[0]
                                    ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${product.productImages?.[0]}`
                                    : "/images/default-product.png"
                                }
                              />
                            </div>
                          ))}
                        </div>
                        <div className="row mt-4">
                          <div className="col-12 text-end">
                            <h4 style={{ justifyContent: 'flex-end' }}>
                              <Link href="manage-products" style={{ color: "blue" }}>
                                View More Products
                                <span style={{ paddingLeft: '10px' }}>
                                  <FaArrowRightLong />
                                </span>
                              </Link>
                            </h4>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="page reviews_tab">
                    <AllReviews limit={1} adminId={adminId} shopId={shopId} />
                  </div>
                )}
                {activeTab === "details" && (
                  <>
                    {success ? (
                      <div className="page pt-4 px-0">
                        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "150px" }}>
                          <SpinnerLoading />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <form key={refreshKey} className="position-relative mt-5 pt-0">
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
                            <div className="row">
                              <div className="col-2">
                                <AuthBtn
                                  title="Next"
                                  type="button"
                                  disabled={isLoading}
                                  onClick={handleNext}
                                />
                              </div>
                            </div>
                          </fieldset>
                        </form>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="col-xl-3">
              <div className="about_sec">
                <h4>About</h4>
                <p>
                  {adminData?.bio || "No Data"}
                </p>
              </div>
              <div className="up_timing">

                {shopWorkingDays.length > 0 ? (
                  shopWorkingDays.map((day, index) => (
                    <div
                      className="d-flex align-items-center justify-content-between"
                      key={index}
                    >
                      <h4>{day.day}</h4>
                      <h4>
                        {day.isActive ? (
                          <span>
                            {day.openingTime} - {day.closeingTime}
                          </span>
                        ) : (
                          <span>Closed</span>
                        )}
                      </h4>
                    </div>
                  ))
                ) : (
                  <p>No working days available</p>
                )}
              </div>
              {/* <div className="up_timing">
              <div className="d-flex align-items-center justify-content-between">
                <h4>Sun</h4>
                <h4>
                  <span>Closed</span>
                </h4>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <h4>Sun</h4>
                <h4>
                  <span>10 : 00 AM - 05 : 00 PM</span>
                </h4>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <h4>Sun</h4>
                <h4>
                  <span>10 : 00 AM - 05 : 00 PM</span>
                </h4>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <h4>Sun</h4>
                <h4>
                  <span>10 : 00 AM - 05 : 00 PM</span>
                </h4>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <h4>Sun</h4>
                <h4>
                  <span>10 : 00 AM - 05 : 00 PM</span>
                </h4>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <h4>Sun</h4>
                <h4>
                  <span>10 : 00 AM - 05 : 00 PM</span>
                </h4>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <h4>Sun</h4>
                <h4>
                  <span>10 : 00 AM - 05 : 00 PM</span>
                </h4>
              </div>
            </div> */}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="user_profile_body">
            <div className="row">
              <div className="col-8">
                <div className="row">
                  <div className="col-6">
                    <label htmlFor="couponCode">Business Name</label>
                    <InputField
                      type="text"
                      name="couponCode"
                      // value={formData.couponCode}
                      // onChange={handleChange}
                      placeholder="Neon Night Bar"
                      id="couponCode"
                      classInput="classInput"
                    />
                  </div>
                  <div className="col-6">
                    <label htmlFor="couponCode">Country</label>
                    <InputField
                      type="text"
                      name="couponCode"
                      // value={formData.couponCode}
                      // onChange={handleChange}
                      placeholder="USA"
                      id="couponCode"
                      classInput="classInput"
                    />
                  </div>
                  <div className="col-6">
                    <label htmlFor="couponCode">Owner Name</label>
                    <InputField
                      type="text"
                      name="couponCode"
                      // value={formData.couponCode}
                      // onChange={handleChange}
                      placeholder="Jerry"
                      id="couponCode"
                      classInput="classInput"
                    />
                  </div>
                  <div className="col-6">
                    <label htmlFor="couponCode">State</label>
                    <InputField
                      type="text"
                      name="couponCode"
                      // value={formData.couponCode}
                      // onChange={handleChange}
                      placeholder="California"
                      id="couponCode"
                      classInput="classInput"
                    />
                  </div>
                  <div className="col-6">
                    <label htmlFor="couponCode">Cooking Time</label>
                    <InputField
                      type="text"
                      name="couponCode"
                      // value={formData.couponCode}
                      // onChange={handleChange}
                      placeholder="25min to 30min"
                      id="couponCode"
                      classInput="classInput"
                    />
                  </div>
                  <div className="col-6">
                    <label htmlFor="couponCode">City</label>
                    <InputField
                      type="text"
                      name="couponCode"
                      // value={formData.couponCode}
                      // onChange={handleChange}
                      placeholder="Los angeles"
                      id="couponCode"
                      classInput="classInput"
                    />
                  </div>
                  <div className="col-6">
                    <label htmlFor="couponCode">Address</label>
                    <InputField
                      type="text"
                      name="couponCode"
                      // value={formData.couponCode}
                      // onChange={handleChange}
                      placeholder="Street 456 Alabama"
                      id="couponCode"
                      classInput="classInput"
                    />
                  </div>
                  <div className="col-6">
                    <label htmlFor="couponCode">Area of Service</label>
                    <InputField
                      type="text"
                      name="couponCode"
                      // value={formData.couponCode}
                      // onChange={handleChange}
                      placeholder="United State"
                      id="couponCode"
                      classInput="classInput"
                    />
                  </div>
                  <div className="col-3 mt-3">
                    <AuthBtn
                      title="Submit"
                      type="button"
                      disabled={isLoading}
                      onClick={handleNext}
                    />
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div>
                  <label htmlFor="category" className="mb-2">
                    Add Category
                  </label>
                  <div className="d-flex align-items-center gap-2">
                    <select
                      className="form-select input_field2"
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                      aria-label="Search Category"
                    >
                      <option value="" defaultValue>
                        Search Category
                      </option>
                      {categories
                        .filter((category) => !selectedCategories.includes(category))
                        .map((category, index) => (
                          <option key={index} value={category}>
                            {category}
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
                  </div>
                  <Textarea
                    placeholder="Bar Details"
                    className="textarea_field2 textarea_field4"
                    value={barDetail}
                    onChange={(e) => setBarDetail(e.target.value)}
                  />
                </div>
                <div className="">
                  <label htmlFor="couponCode">Coupon Code</label>
                  <InputField
                    type="text"
                    name="couponCode"
                    // value={formData.couponCode}
                    // onChange={handleChange}
                    placeholder="12345670"
                    id="couponCode"
                    classInput="classInput"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfile;
