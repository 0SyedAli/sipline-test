"use client"
import CardLineChart from "@/components/CardLineChart";
import CardLineChart2 from "@/components/CardLineChart2";
import OverviewCards from "@/components/OverviewCards";
import NewOrder from "@/components/superAdmin/NewOrder";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const img1 = "/images/dollar-circle.png";
const img2 = "/images/chart-square.png";
const img3 = "/images/money-send.png";
const img4 = "/images/discount-circle.png";

const DashboardPanel = ({ activeTab }) => {
  // const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adminId, setAdminId] = useState("");
  const router = useRouter();

  useEffect(() => {
    const adminData = sessionStorage.getItem("adminId");
    if (adminData) {
      setAdminId(adminData); // Use the actual admin ID from session storage
    } else {
      console.error("User not found or missing 'adminId' property");
      // router.push("/auth/add-services");
    }
  }, [router]);

  useEffect(() => {
    if (adminId) {
      fetchOrders();
    }
  }, [adminId]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}admin/allOrdersByAdmin?adminId=${adminId}`
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.msg || "Failed to fetch orders");
      }

      setOrders(data?.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="dashboard_panel_inner">
        <div className="row gx-3 gy-2 gy-sm-3 gx-xl-4">
          <div className="col-sm-6 col-lg-3">
            <OverviewCards ovimg={img1} title="Today Earning" price="$984.42" discount="+$120.5" />
          </div>
          <div className="col-sm-6 col-lg-3">
            <OverviewCards ovimg={img2}  title="Total Orders" price="100k+" discount="+10K" />
          </div>
          <div className="col-sm-6 col-lg-3">
            <OverviewCards ovimg={img3}  title="Total Bars" price="845" discount="Lorem" />
          </div>
          <div className="col-sm-6 col-lg-3">
            <OverviewCards ovimg={img4}  title="Total Customers" price="88k" discount="+25k" />
          </div>
        </div>
        <div className="py-4 dash_list">
          {/* <div className="table-responsive">
            <table className="table caption-top">
              <thead>
                <tr className="borderless">
                  <th scope="col">ID</th>
                  <th scope="col">Customer Name</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Date</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 8).map((order, index) => (
                  <tr
                    key={order._id} // Use order._id as key instead of index
                    onClick={() => (router.push("dashboard/manage-orders"))} // Use order._id instead of order.order_id
                    style={{ cursor: "pointer" }}
                  >
                    <th scope="row">OID-{order._id}</th>
                    <td className="user_td">
                      <Image
                        width={30}
                        height={30}
                        src={
                          order.userId?.profileImage
                            ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${order.userId.profileImage}`
                            : "/images/default-avatar.png"
                        }
                        alt="User Avatar"
                        onError={(e) => {
                          e.target.src = "/images/default-avatar.png"; // Fallback if image fails to load
                        }}
                      />
                      <h6>
                        {order?.customerName || "Guest User"}
                      </h6>
                    </td>
                    <td className="dollar_td">{order.grandTotal}</td>
                    <td>{order.date}</td>
                    <td>
                      {order.quantity}  
                    </td>
                    <td className={`status_td`}>
                      <span>{order.status}</span>
                    </td>
                    <td>View more</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div> */}
          <NewOrder />
        </div>
      </div>
    </div>
  );
};

export default DashboardPanel;
