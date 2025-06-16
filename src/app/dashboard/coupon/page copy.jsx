// "use client";
// import { useState, useEffect } from "react";
// import InputField from "@/components/Form/InputField";
// import { useSearchParams } from "next/navigation";

// const Discount = () => {
//   const searchParams = useSearchParams(); // Get the URL search parameters
//   const [couponId, setCouponId] = useState(""); // Check if a coupon ID is present
//   const [couponCode, setCouponCode] = useState("");
//   const [discountType, setDiscountType] = useState("");
//   const [discount, setDiscount] = useState("");
//   const [minimumOrder, setMinimumOrder] = useState("");
//   const [areaOfService, setAreaOfService] = useState("");
//   const [validFrom, setValidFrom] = useState("");
//   const [year, setYear] = useState("");
//   const [month, setMonth] = useState("");
//   const [day, setDay] = useState("");
//   const [toYear, setToYear] = useState("");
//   const [toMonth, setToMonth] = useState("");
//   const [toDay, setToDay] = useState("");
//   const [validTo, setValidTo] = useState("");
//   const [status, setStatus] = useState("");
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState("");
//   const barId = `${sessionStorage.getItem("bar_id")}`;

//   // Fetch coupon details when editing
//   const fetchCouponDetails = async (couponId) => {
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_SERVER_URL}vendor/coupons/details?id=${couponId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${sessionStorage.getItem("token")}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`API request failed with status ${response.status}`);
//       }

//       const data = await response.json();

//       // Populate state with fetched coupon details
//       setCouponCode(data?.data?.coupon_code?.split("_")[1]);
//       setDiscountType(data?.data?.discount_type);
//       setDiscount(data?.data?.discount);
//       setMinimumOrder(data?.data?.minimum_order);
//       setAreaOfService(data?.data?.area_of_service);
//       setValidFrom(data?.data?.valid_from);
//       setValidTo(data?.data?.valid_to);
//       setStatus(data?.data?.status);
//     } catch (error) {
//       setError(error?.message);
//     }
//   };

//   // Create new coupon
//   const createCoupon = async (couponData) => {
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_SERVER_URL}vendor/coupons/create_coupon`,
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${sessionStorage.getItem("token")}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(couponData),
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`API request failed with status ${response.status}`);
//       }

//       const data = await response.json();
//       setSuccessMessage("Coupon created successfully!");
//     } catch (error) {
//       setError(error.message);
//     }
//   };

//   // Edit existing coupon
//   const editCouponDetails = async (couponId, couponData) => {
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_SERVER_URL}vendor/coupons/edit_coupon`,
//         {
//           method: "PUT",
//           headers: {
//             Authorization: `Bearer ${sessionStorage.getItem("token")}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(couponData),
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`API request failed with status ${response.status}`);
//       }

//       const data = await response.json();
//       setSuccessMessage("Coupon details updated successfully!");
//     } catch (error) {
//       setError(error.message);
//     }
//   };

//   // Determine if creating or editing based on presence of coupon ID
//   useEffect(() => {
//     const couponId = searchParams.get("id");
//     if (couponId) {
//       setCouponId(couponId);
//       fetchCouponDetails(couponId);
//     }
//   }, []);

//   useEffect(() => {
//     const splitDate = (dateString, setYear, setMonth, setDay) => {
//       if (dateString) {
//         const [year, month, day] = dateString.split("-");
//         setYear(year);
//         setMonth(month);
//         setDay(day);
//       }
//     };

//     splitDate(validFrom, setYear, setMonth, setDay);
//     splitDate(validTo, setToYear, setToMonth, setToDay);
//   }, [validFrom, validTo]);

//   // Handle both create and update logic
//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const validFrom = `${year}-${month}-${day.length === 1 ? "0" + day : day}`;
//     const validTo = `${toYear}-${toMonth}-${toDay}`;
//     const couponData = {
//       coupon_code: couponCode,
//       discount_type: discountType,
//       discount: discount,
//       minimum_order: minimumOrder,
//       area_of_service: areaOfService,
//       valid_from: validFrom,
//       valid_to: validTo,
//       status: status,
//       bar_id: barId,
//     };

//     if (couponId) {
//       couponData.coupon_id = couponId; // Add coupon ID when editing
//       editCouponDetails(couponId, couponData);
//     } else {
//       createCoupon(couponData); // Create new coupon if no ID exists
//     }
//   };

//   return (
//     <div className="page">
//       <div className="edit_discount">
//         <form onSubmit={(event) => handleSubmit(event)}>
//           <div className="dash_head2">
//             <h3>Coupon Code For Mobile App Users</h3>
//           </div>
//           <div className="row">
//             <div className="col-12 col-md-10 col-lg-8 col-xxl-6">
//               <div className="row">
//                 <div className="col-6">
//                   <label htmlFor="couponCode">Coupon Code</label>
//                   <InputField
//                     type="text"
//                     value={couponCode}
//                     onChange={(event) => setCouponCode(event.target.value)}
//                     placeholder="Neon Night Bar"
//                     id="couponCode"
//                     classInput="classInput"
//                   />
//                 </div>
//                 <div className="col-6">
//                   <label htmlFor="discountType">Discount Type</label>
//                   <div className="inputField">
//                     <select
//                       className="form-select input_select"
//                       aria-label="Discount Type"
//                       value={discountType}
//                       onChange={(event) => setDiscountType(event.target.value)}
//                     >
//                       <option value="percentage">Percentage</option>
//                       <option value="fixed">Fixed</option>
//                     </select>
//                   </div>
//                 </div>
//                 <div className="col-6">
//                   <label htmlFor="discount">Discount</label>
//                   <InputField
//                     type="text"
//                     value={discount}
//                     onChange={(event) => setDiscount(event.target.value)}
//                     placeholder="40%"
//                     id="discount"
//                     classInput="classInput"
//                   />
//                 </div>
//                 <div className="col-6">
//                   <label htmlFor="minimumOrder">Minimum Order</label>
//                   <InputField
//                     type="text"
//                     value={minimumOrder}
//                     onChange={(event) => setMinimumOrder(event.target.value)}
//                     placeholder="200"
//                     id="minimumOrder"
//                     classInput="classInput"
//                   />
//                 </div>
//                 <div className="col-6">
//                   <label htmlFor="areaOfService">Area of Service</label>
//                   <InputField
//                     type="text"
//                     value={areaOfService}
//                     onChange={(event) => setAreaOfService(event.target.value)}
//                     placeholder="United States"
//                     id="areaOfService"
//                     classInput="classInput"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="dash_head2 pt-3">
//             <h3>Time Validation Start & End Date</h3>
//           </div>
//           <div className="row">
//             {/* <div className="col-4 col-xxl-3">
//               <label htmlFor="validFrom">From</label>
//               <input
//                 type="date"
//                 value={validFrom}
//                 onChange={(event) => setValidFrom(event.target.value)}
//                 className="form-control"
//               />
//             </div> */}
//             <div className="col-4 col-xxl-3">
//               <label htmlFor="validFrom">From</label>
//               <div className="date_picker py-2 d-flex align-items-center justify-content-between">
//                 <input
//                   type="number"
//                   value={year}
//                   onChange={(event) => setYear(event.target.value)}
//                   placeholder="yyyy"
//                   maxLength={4}
//                 />
//                 <input
//                   type="number"
//                   value={month}
//                   onChange={(event) => setMonth(event.target.value)}
//                   placeholder="mm"
//                   maxLength={2}
//                 />
//                 <input
//                   type="number"
//                   value={day}
//                   onChange={(event) => setDay(event.target.value)}
//                   placeholder="dd"
//                   maxLength={2}
//                 />
//               </div>
//             </div>
//             <div className="col-4 col-xxl-3">
//               <label htmlFor="validTo">To</label>
//               <div className="date_picker py-2 d-flex align-items-center justify-content-between">
//                 <input
//                   type="number"
//                   value={toYear}
//                   onChange={(event) => setToYear(event.target.value)}
//                   placeholder="yyyy"
//                   maxLength={4}
//                 />
//                 <input
//                   type="number"
//                   value={toMonth}
//                   onChange={(event) => setToMonth(event.target.value)}
//                   placeholder="mm"
//                   maxLength={2}
//                 />
//                 <input
//                   type="number"
//                   value={toDay}
//                   onChange={(event) => setToDay(event.target.value)}
//                   placeholder="dd"
//                   maxLength={2}
//                 />
//               </div>
//             </div>
//             <div className="col-4 col-xxl-3">
//               <label htmlFor="status">Status</label>
//               <div className="inputField">
//                 <select
//                   className="form-select input_select"
//                   aria-label="Status"
//                   value={status}
//                   onChange={(event) => setStatus(event.target.value)}
//                 >
//                   <option value="active">Active</option>
//                   <option value="inactive">Inactive</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           <div className="mt-5">
//             <button className="themebtn4 green btn" type="submit">
//               {couponId ? "Update Coupon" : "Create Coupon"}
//             </button>
//           </div>
//           {successMessage && (
//             <div className="alert alert-success">{successMessage}</div>
//           )}

//         </form>
//       </div>
//     </div>
//   );
// };

// export default Discount;

"use client";
import { useState, useEffect } from "react";
import InputField from "@/components/Form/InputField";
import { useSearchParams } from "next/navigation";

const Discount = () => {
  const searchParams = useSearchParams();
  const [couponId, setCouponId] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [discountType, setDiscountType] = useState("");
  const [discount, setDiscount] = useState("");
  const [minimumOrder, setMinimumOrder] = useState("");
  const [areaOfService, setAreaOfService] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [toYear, setToYear] = useState("");
  const [toMonth, setToMonth] = useState("");
  const [toDay, setToDay] = useState("");
  const [validTo, setValidTo] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const barId = `${sessionStorage.getItem("bar_id")}`;

  const fetchCouponDetails = async (couponId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}vendor/coupons/details?id=${couponId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.data.error[0] ||
            `Failed to create coupon: ${response.status}`
        );
      }

      const data = await response.json();
      setCouponCode(data?.data?.coupon_code?.split("_")[1] || "");
      setDiscountType(data?.data?.discount_type || "");
      setDiscount(data?.data?.discount || "");
      setMinimumOrder(data?.data?.minimum_order || "");
      setAreaOfService(data?.data?.area_of_service || "");
      setValidFrom(data?.data?.valid_from || "");
      setValidTo(data?.data?.valid_to || "");
      setStatus(data?.data?.status || "active");
    } catch (error) {
      setError(error?.message);
    } finally {
      setLoading(false);
    }
  };

  const createCoupon = async (couponData) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}vendor/coupons/create_coupon`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(couponData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.data.error[0] ||
            `Failed to create coupon: ${response.status}`
        );
      }

      setSuccessMessage("Coupon created successfully!");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const editCouponDetails = async (couponId, couponData) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}vendor/coupons/edit_coupon`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(couponData),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.data.error[0] ||
            `Failed to create coupon: ${response.status}`
        );
      }

      setSuccessMessage("Coupon details updated successfully!");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const couponId = searchParams.get("id");
    if (couponId) {
      setCouponId(couponId);
      fetchCouponDetails(couponId);
    }
  }, [searchParams]);

  useEffect(() => {
    const splitDate = (dateString, setYear, setMonth, setDay) => {
      if (dateString) {
        const [year, month, day] = dateString.split("-");
        setYear(year);
        setMonth(month);
        setDay(day);
      }
    };

    splitDate(validFrom, setYear, setMonth, setDay);
    splitDate(validTo, setToYear, setToMonth, setToDay);
  }, [validFrom, validTo]);

  const validateInputs = () => {
    if (
      !couponCode ||
      !discountType ||
      !discount ||
      !minimumOrder ||
      !areaOfService
    ) {
      setError("All fields are required.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateInputs()) return;

    const validFrom = `${year}-${month.padStart(2, "0")}-${day.padStart(
      2,
      "0"
    )}`;
    const validTo = `${toYear}-${toMonth.padStart(2, "0")}-${toDay.padStart(
      2,
      "0"
    )}`;
    const couponData = {
      coupon_code: couponCode,
      discount_type: discountType,
      discount: discount,
      minimum_order: minimumOrder,
      area_of_service: areaOfService,
      valid_from: validFrom,
      valid_to: validTo,
      status: status,
      bar_id: barId,
    };

    if (couponId) {
      couponData.coupon_id = couponId;
      await editCouponDetails(couponId, couponData);
    } else {
      await createCoupon(couponData);
    }
  };

  return (
    <div className="page">
      <div className="edit_discount">
        <form onSubmit={handleSubmit}>
          <div className="dash_head2">
            <h3>Coupon Code For Mobile App Users</h3>
          </div>
          <div className="row">
            <div className="col-12 col-md-10 col-lg-8 col-xxl-6">
              <div className="row">
                <div className="col-6">
                  <label htmlFor="couponCode">Coupon Code</label>
                  <InputField
                    type="text"
                    value={couponCode}
                    onChange={(event) => {
                      setCouponCode(event.target.value);
                      setError(null);
                    }}
                    placeholder="Neon Night Bar"
                    id="couponCode"
                    classInput="classInput"
                  />
                </div>
                <div className="col-6">
                  <label htmlFor="discountType">Discount Type</label>
                  <div className="inputField">
                    <select
                      className="form-select input_select"
                      aria-label="Discount Type"
                      value={discountType}
                      onChange={(event) => {
                        setDiscountType(event.target.value);
                        setError(null);
                      }}
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed</option>
                    </select>
                  </div>
                </div>
                <div className="col-6">
                  <label htmlFor="discount">Discount</label>
                  <InputField
                    type="text"
                    value={discount}
                    onChange={(event) => {
                      setDiscount(event.target.value);
                      setError(null);
                    }}
                    placeholder="40%"
                    id="discount"
                    classInput="classInput"
                  />
                </div>
                <div className="col-6">
                  <label htmlFor="minimumOrder">Minimum Order</label>
                  <InputField
                    type="text"
                    value={minimumOrder}
                    onChange={(event) => {
                      setMinimumOrder(event.target.value);
                      setError(null);
                    }}
                    placeholder="200"
                    id="minimumOrder"
                    classInput="classInput"
                  />
                </div>
                <div className="col-6">
                  <label htmlFor="areaOfService">Area of Service</label>
                  <InputField
                    type="text"
                    value={areaOfService}
                    onChange={(event) => {
                      setAreaOfService(event.target.value);
                      setError(null);
                    }}
                    placeholder="United States"
                    id="areaOfService"
                    classInput="classInput"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="dash_head2 pt-3">
            <h3>Time Validation Start & End Date</h3>
          </div>
          <div className="row">
            <div className="col-4 col-xxl-3">
              <label htmlFor="validFrom">From</label>
              <div className="date_picker py-2 d-flex align-items-center justify-content-between">
                <input
                  type="number"
                  value={year}
                  onChange={(event) => {
                    setYear(event.target.value);
                    setError(null);
                  }}
                  placeholder="yyyy"
                  maxLength={4}
                />
                <input
                  type="number"
                  value={month}
                  onChange={(event) => {
                    setMonth(event.target.value);
                    setError(null);
                  }}
                  placeholder="mm"
                  maxLength={2}
                />
                <input
                  type="number"
                  value={day}
                  onChange={(event) => {
                    setDay(event.target.value);
                    setError(null);
                  }}
                  placeholder="dd"
                  maxLength={2}
                />
              </div>
            </div>
            <div className="col-4 col-xxl-3">
              <label htmlFor="validTo">To</label>
              <div className="date_picker py-2 d-flex align-items-center justify-content-between">
                <input
                  type="number"
                  value={toYear}
                  onChange={(event) => {
                    setToYear(event.target.value);
                    setError(null);
                  }}
                  placeholder="yyyy"
                  maxLength={4}
                />
                <input
                  type="number"
                  value={toMonth}
                  onChange={(event) => {
                    setToMonth(event.target.value);
                    setError(null);
                  }}
                  placeholder="mm"
                  maxLength={2}
                />
                <input
                  type="number"
                  value={toDay}
                  onChange={(event) => {
                    setToDay(event.target.value);
                    setError(null);
                  }}
                  placeholder="dd"
                  maxLength={2}
                />
              </div>
            </div>
            <div className="col-4 col-xxl-3">
              <label htmlFor="status">Status</label>
              <div className="inputField">
                <select
                  className="form-select input_select"
                  aria-label="Status"
                  value={status}
                  onChange={(event) => {
                    setStatus(event.target.value);
                    setError(null);
                  }}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <button
              className="themebtn4 green btn"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Processing..."
                : couponId
                ? "Update Coupon"
                : "Create Coupon"}
            </button>
          </div>
          {successMessage && (
            <div className="alert alert-success">{successMessage}</div>
          )}
          {error && <div className="alert alert-danger">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default Discount;
