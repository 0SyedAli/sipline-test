"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import AreYouSure from "@/components/notificationModalCont/AreYouSure";
import moment from "moment-timezone";
import SpinnerLoading from "@/components/Spinner/SpinnerLoading";
import ErrorHandler from "utilities/errorHandler";

const edetIcon = "/images/edit-2.svg";
const deleteIcon = "/images/trash.svg";

const Discounts = () => {
  const [coupons, setCoupons] = useState([]);
  const [pg, setPg] = useState(1);
  const [page, setPage] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const barId = sessionStorage.getItem("bar_id");
  const handleError = (status, message) => {
    setError({ status, message }); // Set error with status and message
  };
  const deleteCoupon = async (couponId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}vendor/coupons/delete_coupon?coupon_id=${couponId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      fetchCoupons(pg);
    } catch (error) {
      handleError(error.response?.status, error.message); // Use the error handler here
    }
  };

  const [couponToDelete, setCouponToDelete] = useState(null);

  const handleDelete = (couponId) => {
    setCouponToDelete(couponId);
  };

  const handleConfirmDelete = () => {
    deleteCoupon(couponToDelete);
    setCouponToDelete(null);
  };

  const fetchCoupons = async (pageIndex) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}vendor/coupons/list?bar_id=${barId}&&page=${pageIndex}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      setCoupons(data.data[0]);
      setPage(data.data[1]);
      setPg(pageIndex);
    } catch (error) {
      handleError(error.response?.status, error.message); // Use the error handler here
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons(pg);
  }, []);

  return (
    <>
      <ErrorHandler err={error} /> {/* Include the error handler component */}
      {loading ? (
        <div className="main_dash2">
          <h3>
            <SpinnerLoading />
          </h3>
        </div>
      ) : error ? (
        <h3 className="mt-5 error_color">Error: {error}</h3>
      ) : (
        <>
          <div className="dash_head2">
            <h3>All Transactions</h3>
            <div className="dash_head2_select">
              <Link href="/dashboard/coupon" className="gen_btn">
                Generate Discount
              </Link>
              <select
                className="form-select"
                aria-label="Default select example"
              >
                <option defaultValue>Sort by month</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>
            </div>
          </div>
          <div className="transaction_body">
            {Array.isArray(coupons) &&
              coupons.map((coupon, index) => (
                <div key={index} className="transaction_item">
                  <div className="d-flex flex-column">
                    <h5>Coupon Code: {coupon.coupon_code?.split("_")[1]}</h5>
                    <div className="d-flex align-items-center gap-3">
                      <h6>{new Date(coupon.createdAt).toLocaleString()}</h6>
                      <h6>Status: {coupon.status}</h6>
                    </div>
                  </div>
                  <div className="ed_btns">
                    <Link
                      href={`/dashboard/coupon?id=${coupon.id}`}
                      className="edit_btn"
                    >
                      <img src={edetIcon} alt="Edit" />
                    </Link>
                    <button
                      className="delete_btn"
                      type="button"
                      data-bs-toggle="modal"
                      data-bs-target="#areyousure"
                      onClick={() => handleDelete(coupon.id)}
                    >
                      <img src={deleteIcon} alt="Delete" />
                    </button>
                  </div>
                </div>
              ))}
            {page >= 1 ? (
              <div className="pagination justify-content-end mt-4">
                {[...Array(page).keys()].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => fetchCoupons(index + 1)}
                    className={index + 1 === pg ? "active" : ""}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => fetchCoupons([...Array(page).keys()].length)}
                >
                  &gt;&gt;
                </button>
              </div>
            ) : null}
          </div>
          <AreYouSure
            onConfirm={handleConfirmDelete}
            couponId={couponToDelete}
          />
        </>
      )}
    </>
  );
};

export default Discounts;



// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import AreYouSure from "@/components/notificationModalCont/AreYouSure";
// import SpinnerLoading from "@/components/Spinner/SpinnerLoading";

// const edetIcon = "/images/edit-2.svg";
// const deleteIcon = "/images/trash.svg";

// const Discounts = () => {
//   const [coupons, setCoupons] = useState([]);
//   const [pg, setPg] = useState(1);
//   const [page, setPage] = useState();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const barId = sessionStorage.getItem("bar_id");
//   const [couponToDelete, setCouponToDelete] = useState(null);
//   // Validate and handle input data
//   const validateInput = (data) => {
//     // Implement input validation logic
//   };

//   // Handle API errors
//   const handleError = (error) => {
//     setError(error.message);
//   };

//   // Delete coupon
//   const deleteCoupon = async (couponId) => {
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_SERVER_URL}vendor/coupons/delete_coupon?coupon_id=${couponId}`,
//         {
//           method: "DELETE",
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
//       fetchCoupons(pg);
//     } catch (error) {
//       handleError(error);
//     }
//   };

//   // Fetch coupons
//   const fetchCoupons = async (pageIndex) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_SERVER_URL}vendor/coupons/list?bar_id=${barId}&&page=${pageIndex}`,
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
//       setCoupons(data.data[0]);
//       setPage(data.data[1]);
//       setPg(pageIndex);
//     } catch (error) {
//       handleError(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCoupons(pg);
//   }, []);

//   // Handle delete confirmation
//   const handleConfirmDelete = () => {
//     deleteCoupon(couponToDelete);
//     setCouponToDelete(null);
//   };

//   // Handle delete button click
//   const handleDelete = (couponId) => {
//     setCouponToDelete(couponId);
//   };

//   return (
//     <>
//       {loading ? (
//         <div className="main_dash2">
//           <h3>
//             <SpinnerLoading />
//           </h3>
//         </div>
//       ) : error ? (
//         <h3 className="mt-5 error_color">Error: {error}</h3>
//       ) : (
//         <>
//           <div className="dash_head2">
//             <h3>All Transactions</h3>
//             <div className="dash_head2_select">
//               <Link href="/dashboard/coupon" className="gen_btn">
//                 Generate Discount
//               </Link>
//               <select
//                 className="form-select"
//                 aria-label="Default select example"
//               >
//                 <option defaultValue>Sort by month</option>
//                 <option value="1">One</option>
//                 <option value="2">Two</option>
//                 <option value="3">Three</option>
//               </select>
//             </div>
//           </div>
//           <div className="transaction_body">
//             {Array.isArray(coupons) &&
//               coupons.map((coupon, index) => (
//                 <div key={index} className="transaction_item">
//                   <div className="d-flex flex-column">
//                     <h5>Coupon Code: {coupon.coupon_code?.split("_")[1]}</h5>
//                     <div className="d-flex align-items-center gap-3">
//                       <h6>{new Date(coupon.createdAt).toLocaleString()}</h6>
//                       <h6>Status: {coupon.status}</h6>
//                     </div>
//                   </div>
//                   <div className="ed_btns">
//                     <Link
//                       href={`/dashboard/coupon?id=${coupon.id}`}
//                       className="edit_btn"
//                     >
//                       <img src={edetIcon} alt="Edit" />
//                     </Link>
//                     <button
//                       className="delete_btn"
//                       type="button"
//                       data-bs-toggle="modal"
//                       data-bs-target="#areyousure"
//                       onClick={() => handleDelete(coupon.id)}
//                     >
//                       <img src={deleteIcon} alt="Delete" />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             {page >= 1 ? (
//               <div className="pagination justify-content-end mt-4">
//                 {[...Array(page).keys()].map((_, index) => (
//                   <button
//                     key={index}
//                     onClick={() => fetchCoupons(index + 1)}
//                     className={index + 1 === pg ? "active" : ""}
//                   >
//                     {index + 1}
//                   </button>
//                 ))}
//                 <button
//                   onClick={() => fetchCoupons([...Array(page).keys()].length)}
//                 >
//                   &gt;&gt;
//                 </button>
//               </div>
//             ) : null}
//           </div>
//           <AreYouSure
//             onConfirm={handleConfirmDelete}
//             couponId={couponToDelete}
//           />
//         </>
//       )}
//     </>
//   );
// };
// export default Discounts;
