"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import AreYouSure from "@/components/notificationModalCont/AreYouSure";
import SpinnerLoading from "@/components/SpinnerLoading";
import { BsDot } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import Image from "next/image";

const edetIcon = "/images/edit-2.svg";
const deleteIcon = "/images/trash.svg";

const Discounts = () => {
  const [adminId, setAdminId] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const adminData = JSON.parse(sessionStorage.getItem("admin"));
    if (adminData?._id) {
      setAdminId("681120f22f4715831181a9c4");
    } else {
      console.error("Admin not found");
      // router.push("/auth/add-services");
    }
  }, [router]);

  useEffect(() => {
    if (adminId) {
      fetchCoupons();
    }
  }, [adminId]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}admin/getAllCouponsByAdmin?adminId=${adminId}`
      );

      if (response?.data?.success) {
        setCoupons(response.data.data || []);
      } else {
        setError(response?.data?.msg || "Failed to fetch coupons");
        toast.error(response?.data?.msg || "Failed to fetch coupons");
      }
    } catch (error) {
      setError(error.message);
      toast.error("Failed to fetch coupons");
      console.error("Error fetching coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCoupon = async (couponId) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}admin/deleteCoupon?couponId=${couponId}`
      );

      if (response?.data?.success) {
        toast.success("Coupon deleted successfully");
        fetchCoupons(); // Refresh the list after deletion
      } else {
        throw new Error(response?.data?.msg || "Failed to delete coupon");
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Error deleting coupon:", error);
    }
  };

  const handleConfirmDelete = () => {
    if (couponToDelete) {
      deleteCoupon(couponToDelete);
      setCouponToDelete(null);
    }
  };

  const handleDelete = (couponId) => {
    setCouponToDelete(couponId);
  };

  return (
    <>
      <div className="dash_head2">
        <h3>All Discounts</h3>
        <div className="dash_head2_select">
          <Link href="/dashboard/coupon" className="gen_btn">
            Generate Discount
          </Link>
          {/* <select className="form-select" aria-label="Default select example">
            <option defaultValue>Sort by month</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </select> */}
        </div>
      </div>

      {loading ? (
        <div className="page pt-4 px-0">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
            <SpinnerLoading />
          </div>
        </div>
      ) : error ? (
        <p className="mt-5 error_color">Error: {error}</p>
      ) : coupons.length === 0 ? (
        <p className="mt-5">No coupons found. Create your first coupon!</p>
      ) : (
        <div className="transaction_body discount2_body">
          {coupons.map((coupon) => (
            <div key={coupon._id} className="transaction_item">
              <div className="ti_inner d-flex align-items-center gap-3">
                <Image
                  width={80}
                  height={80}
                  src={coupon?.couponImage ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${coupon?.couponImage}` : "/images/default-avatar.png"}
                  alt="category image"
                />
                <div className="d-flex flex-column">
                  <h5>Coupon Code: {coupon.couponCode}</h5>
                  {/* <div className="d-flex align-items-center gap-3">
                  <h6>Discount: {coupon.discountPercent}% ({coupon.discountType})</h6>
                  <h6>Min Orders: ${coupon.minOrders}</h6>
                </div> */}
                  <div className="ti_validity d-flex align-items-center gap-3">
                    <h6>Valid: {coupon.startDate}
                      {/* to {coupon.endDate} */}
                    </h6>
                    <h6><BsDot /></h6>
                    <h6>Status: {coupon.status}</h6>
                  </div>
                  {/* {coupon.barName && <h6>Bar: {coupon.barName}</h6>} */}
                </div>
              </div>
              <div className="ed_btns">
                <Link
                  href={`/dashboard/coupon?coupon_id=${coupon._id}`}
                  className="edit_btn"
                >
                  <img src={edetIcon} alt="Edit" />
                </Link>
                <button
                  className="delete_btn"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#areyousure"
                  onClick={() => handleDelete(coupon._id)}
                >
                  <img src={deleteIcon} alt="Delete" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AreYouSure
        onConfirm={handleConfirmDelete}
        onCancel={() => setCouponToDelete(null)}
        title="Delete Coupon"
        message="Are you sure you want to delete this coupon?"
      />
    </>
  );
};

export default Discounts;