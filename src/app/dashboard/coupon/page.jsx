"use client";
import { useState, useEffect, Suspense } from "react";
import InputField from "@/components/Form/InputField";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import SpinnerLoading from "@/components/Spinner/SpinnerLoading";
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
  const [formData, setFormData] = useState({
    couponCode: "",
    discountType: "percentage",
    discountPercent: "",
    minOrders: "",
    areaOfService: "",
    startDate: "",
    endDate: "",
    status: "Active",
    barName: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
          barName: coupon.barName || ""
        });
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
    const [day, month, year] = dateString.split("-");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  const formatDateForAPI = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.couponCode) {
      setError("Coupon code is required");
      toast.error("Coupon code is required");
      return false;
    }
    if (!formData.discountPercent || isNaN(formData.discountPercent)) {
      setError("Please enter a valid discount percentage");
      toast.error("Please enter a valid discount percentage");
      return false;
    }
    if (!formData.minOrders || isNaN(formData.minOrders)) {
      setError("Please enter a valid minimum order amount");
      toast.error("Please enter a valid minimum order amount");
      return false;
    }
    if (!formData.areaOfService) {
      setError("Area of service is required");
      toast.error("Area of service is required");
      return false;
    }
    if (!formData.startDate || !formData.endDate) {
      setError("Please select both start and end dates");
      toast.error("Please select both start and end dates");
      return false;
    }
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setError("End date must be after start date");
      toast.error("End date must be after start date");
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
      const payload = {
        couponBy: adminId,
        couponCode: formData.couponCode,
        discountType: formData.discountType,
        discountPercent: Number(formData.discountPercent),
        minOrders: Number(formData.minOrders),
        areaOfService: formData.areaOfService,
        startDate: formatDateForAPI(formData.startDate),
        endDate: formatDateForAPI(formData.endDate),
        status: formData.status,
        ...(formData.barName && { barName: formData.barName })
      };

      let response;
      if (couponId) {
        // Update existing coupon
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}admin/updateCoupon`,
          { ...payload, couponId }
        );
      } else {
        // Create new coupon
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}admin/createCounpon`,
          payload
        );
      }

      if (response.data.success) {
        toast.success(response.data.msg || (couponId ? "Coupon updated successfully!" : "Coupon created successfully!"));
        router.push("/dashboard/discounts");
      } else {
        throw new Error(response.data.msg || "Operation failed");
      }
    } catch (error) {
      setError(error.response?.data?.msg || error.message);
      toast.error(error.response?.data?.msg || error.message);
    } finally {
      setLoading(false);
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
                      <option value="fixed">Fixed Amount</option>
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