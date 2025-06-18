"use client";
import { useState, useEffect, Suspense } from "react";
import InputField from "@/components/Form/InputField";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import SpinnerLoading from "@/components/Spinner/SpinnerLoading";
import UploadImage from "@/components/UploadImage";
const AddDiscountWrapper = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Discount />
    </Suspense>
  );
};
const Discount = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [couponId, setCouponId] = useState("");
  const [adminId, setAdminId] = useState("");
  const [imageFile, setImageFile] = useState(null); // Only store filename
  const [formData, setFormData] = useState({
    couponCode: "",
    discountType: "percentage",
    discountPercent: "",
    minOrders: "",
    areaOfService: "",
    startDate: "",
    endDate: "",
    status: "Active", // Default status
    barName: "",
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const handleFileChange = (file) => {
    setImageFile(file);
  };

  useEffect(() => {
    const adminData = JSON.parse(sessionStorage.getItem("admin"));
    if (adminData?._id) {
      setAdminId("681120f22f4715831181a9c4");
    } else {
      console.error("Admin not found");
      router.push("/auth/add-services");
    }
  }, [router]);

  useEffect(() => {
    const couponId = searchParams.get("coupon_id");
    if (couponId) {
      setCouponId(couponId);
      fetchCouponDetails(couponId);
    }
  }, [searchParams]);

  const fetchCouponDetails = async (couponId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}admin/couponById?couponId=${couponId}`
      );

      if (response.data.success) {
        const coupon = response.data.data;
        setFormData({
          couponCode: coupon.couponCode,
          discountType: coupon.discountType,
          discountPercent: coupon.discountPercent,
          minOrders: coupon.minOrders,
          areaOfService: coupon.areaOfService,
          startDate: formatDateForInput(coupon.startDate),
          endDate: formatDateForInput(coupon.endDate),
          status: coupon.status,
          barName: coupon.barName || "",
          couponImage: coupon.couponImage || "",
        });

        // Set image preview if image exists
        if (coupon.image) {
          // You'll need to fetch the actual image from your server
          const imageUrl = `${process.env.NEXT_PUBLIC_IMAGE_URL}${coupon.image}`;
          // Convert to base64 or use directly depending on your UploadImage component
          setImageFile(coupon.image); // Store the filename
          // If your component needs a preview, you might need to fetch the image
        }
      } else {
        throw new Error(response.data.msg || "Failed to fetch coupon details");
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";

    // Handle both "DD-MM-YYYY" and "YYYY-MM-DD" formats
    if (dateString.includes("-")) {
      const parts = dateString.split("-");
      if (parts[0].length === 4) {
        // Already in YYYY-MM-DD format
        return dateString;
      } else {
        // Convert from DD-MM-YYYY to YYYY-MM-DD
        const [day, month, year] = parts;
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      }
    }
    return "";
  };

  const formatDateForAPI = (dateString) => {
    if (!dateString) return "";

    // Convert from YYYY-MM-DD to DD-MM-YYYY
    const [year, month, day] = dateString.split("-");
    return `${day.padStart(2, "0")}-${month.padStart(2, "0")}-${year}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.couponCode?.trim()) errors.push("Coupon code is required");
    if (isNaN(parseFloat(formData.discountPercent))) errors.push("Valid discount percentage is required");
    if (isNaN(parseFloat(formData.minOrders))) errors.push("Valid minimum order amount is required");
    if (!formData.areaOfService?.trim()) errors.push("Area of service is required");
    if (!formData.startDate) errors.push("Start date is required");
    if (!formData.endDate) errors.push("End date is required");
    if (new Date(formData.endDate) < new Date(formData.startDate)) errors.push("End date must be after start date");

    if (errors.length > 0) {
      setError(errors.join(", "));
      errors.forEach(e => toast.error(e));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    try {
      setLoading(true);

      // Create the payload object (not FormData)
      const payload = {
        couponBy: adminId,
        couponCode: formData.couponCode,
        discountType: formData.discountType,
        discountPercent: parseFloat(formData.discountPercent),
        minOrders: parseFloat(formData.minOrders),
        areaOfService: formData.areaOfService,
        startDate: formatDateForAPI(formData.startDate),
        endDate: formatDateForAPI(formData.endDate),
        status: formData.status,
        ...(formData.barName && { barName: formData.barName }),
        ...(couponId && { couponId }), // Include couponId for updates
      };

      // For new coupons with image upload
      if (!couponId && imageFile) {
        // If you need to upload image for new coupons, use FormData
        const formDataToSend = new FormData();
        formDataToSend.append("image", imageFile);
        Object.entries(payload).forEach(([key, value]) => {
          formDataToSend.append(key, value);
        });

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}admin/createCounpon`,
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        handleResponse(response);
        return;
      }

      // For updates or when no image is being uploaded
      const endpoint = couponId
        ? `${process.env.NEXT_PUBLIC_SERVER_URL}admin/updateCoupon`
        : `${process.env.NEXT_PUBLIC_SERVER_URL}admin/createCounpon`;

      const response = await axios.post(endpoint, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      handleResponse(response);

    } catch (error) {
      setError(error.response?.data?.msg || error.message);
      toast.error(error.response?.data?.msg || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = (response) => {
    if (response.data.success) {
      toast.success(response.data.msg || (couponId ? "Coupon updated successfully!" : "Coupon created successfully!"));
      router.push("/dashboard/discounts");
    } else {
      throw new Error(response.data.msg || "Operation failed");
    }
  };

  if (loading && couponId) {
    return <SpinnerLoading />;
  }

  return (
    <div className="page">
      <div className="edit_discount">
        <form onSubmit={handleSubmit}>
          <div className="dash_head2">
            <h3>{couponId ? "Edit Coupon" : "Create New Coupon"}</h3>
          </div>

          <div className="row">
            <div className="col-12 col-md-10 col-lg-8 col-xxl-6">
              <div className="row">
                <div className="col-6">
                  <UploadImage
                    onFileChange={handleFileChange}
                    existingImage={couponId ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${formData.couponImage}` : null}
                  />
                </div>
                <div className="col-6">
                  <label htmlFor="couponCode">Coupon Code</label>
                  <InputField
                    type="text"
                    name="couponCode"
                    value={formData.couponCode}
                    onChange={handleChange}
                    placeholder="e.g. SUMMER20"
                    id="couponCode"
                    classInput="classInput"
                  />
                </div>
                <div className="col-6">
                  <label htmlFor="discountType">Discount Type</label>
                  <div className="inputField">
                    <select
                      className="form-select input_select"
                      name="discountType"
                      value={formData.discountType}
                      onChange={handleChange}
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed</option>
                    </select>
                  </div>
                </div>
                <div className="col-6">
                  <label htmlFor="discountPercent">
                    Discount {formData.discountType === "percentage" ? "(%)" : "(Amount)"}
                  </label>
                  <InputField
                    type="number"
                    name="discountPercent"
                    value={formData.discountPercent}
                    onChange={handleChange}
                    placeholder={formData.discountType === "percentage" ? "20" : "10"}
                    id="discountPercent"
                    classInput="classInput"
                  />
                </div>
                <div className="col-6">
                  <label htmlFor="minOrders">Minimum Order ($)</label>
                  <InputField
                    type="number"
                    name="minOrders"
                    value={formData.minOrders}
                    onChange={handleChange}
                    placeholder="50"
                    id="minOrders"
                    classInput="classInput"
                  />
                </div>
                <div className="col-6">
                  <label htmlFor="areaOfService">Area of Service</label>
                  <InputField
                    type="text"
                    name="areaOfService"
                    value={formData.areaOfService}
                    onChange={handleChange}
                    placeholder="United States"
                    id="areaOfService"
                    classInput="classInput"
                  />
                </div>
                <div className="col-6">
                  <label htmlFor="barName">Bar Name (Optional)</label>
                  <InputField
                    type="text"
                    name="barName"
                    value={formData.barName}
                    onChange={handleChange}
                    placeholder="The Royal Club"
                    id="barName"
                    classInput="classInput"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="dash_head2 pt-3">
            <h3>Validity Period</h3>
          </div>

          <div className="row">
            <div className="col-6">
              <div className="row">
                <div className="col-6">
                  <label htmlFor="startDate">Start Date</label>
                  <InputField
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    id="startDate"
                    classInput="classInput"
                  />
                </div>
                <div className="col-6">
                  <label htmlFor="endDate">End Date</label>
                  <InputField
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    id="endDate"
                    classInput="classInput"
                  />
                </div>
                <div className="col-6">
                  <label htmlFor="status">Status</label>
                  <div className="inputField">
                    <select
                      className="form-select input_select"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="mt-3">
            <button
              className="themebtn4 green btn"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span>Processing...</span>
              ) : couponId ? (
                "Update Coupon"
              ) : (
                "Create Coupon"
              )}
            </button>
          </div>

          {error && (
            <div className="alert alert-danger mt-3">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddDiscountWrapper;