"use client";
import CardLineChart from "@/components/CardLineChart";
import CardLineChart2 from "@/components/CardLineChart2";
import OverviewCards from "@/components/OverviewCards";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const img1 = "/images/dollar-circle.png";
const img2 = "/images/chart-square.png";
const img3 = "/images/money-send.png";
const img4 = "/images/discount-circle.png";

const DashboardPanel = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null); // ✅ vendor stats
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adminId, setAdminId] = useState("");
  const router = useRouter();

  // ✅ Load Admin ID
  useEffect(() => {
    try {
      const adminData = JSON.parse(sessionStorage.getItem("admin"));
      if (adminData?._id) {
        setAdminId(adminData._id);
      } else {
        console.warn("Admin not found in session storage");
      }
    } catch (err) {
      console.error("Error parsing admin:", err);
    }
  }, []);

  // ✅ Fetch Vendor Stats
  useEffect(() => {
    if (!adminId) return;

    const fetchStats = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}admin/getVendorStats?adminId=${adminId}`
        );
        if (!res.ok) throw new Error(res.statusText);

        const data = await res.json();
        if (!data.success) throw new Error(data.msg || "Failed to fetch stats");

        setStats(data.data || {});
      } catch (err) {
        console.error("Stats fetch error:", err);
        setStats(null);
      }
    };

    fetchStats();
  }, [adminId]);

  // ✅ Fetch Orders
  useEffect(() => {
    if (!adminId) return;

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}admin/allOrdersByAdmin?adminId=${adminId}`
        );

        if (!response.ok) throw new Error(response.statusText);

        const data = await response.json();
        if (!data.success) throw new Error(data.msg || "Failed to fetch orders");

        setOrders(Array.isArray(data?.data) ? data.data : []);
      } catch (err) {
        setError(err.message);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [adminId]);

  return (
    <div className="page">
      <div className="dashboard_panel_inner">
        {/* ✅ Stats Overview Cards */}
        <div className="row gx-3 gy-2 gy-sm-3 gx-xl-4">
          <div className="col-sm-6 col-lg-3">
            <OverviewCards
              ovimg={img1}
              title="Total Customers"
              price={stats?.totalCustomers ?? 0}
              discount={stats?.newCustmoers ?? "+" + 0}
            />
          </div>
          <div className="col-sm-6 col-lg-3">
            <OverviewCards
              ovimg={img2}
              title="New Customers"
              price={stats?.newCustmoers ?? 0}
              discount={`${stats?.totalCustomers ?? 0} Total`}
            />
          </div>
          <div className="col-sm-6 col-lg-3">
            <OverviewCards
              ovimg={img3}
              title="Total Revenue"
              price={`$${stats?.TotalRevenue?.toFixed(2) ?? "0.00"}`}
              discount="All Time"
            />
          </div>
          <div className="col-sm-6 col-lg-3">
            <OverviewCards
              ovimg={img4}
              title="Monthly Revenue"
              price={`$${(stats?.monthlyRevenue?.slice(-1)[0] || 0).toFixed(2)}`}
              discount="Last Month"
            />
          </div>
        </div>

        {/* Charts */}
        <div className="my-4 d-flex align-items-end flex-column flex-lg-row">
          <CardLineChart />
          <CardLineChart2 />
        </div>

        {/* Orders Section */}
        <div className="py-4 dash_list">
          <h2 className="mb-3">New Orders</h2>
          {loading && <p>Loading orders...</p>}
          {error && <p className="text-danger">⚠ {error}</p>}
          {!loading && !error && orders.length === 0 && <p>No orders found.</p>}

          {!loading && !error && orders.length > 0 && (
            <div className="table-responsive">
              <table className="table caption-top">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer Name</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Quantity</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 4).map((order) => (
                    <tr
                      key={order._id}
                      onClick={() =>
                        router.push(`/dashboard/manage-orders/${order._id}`)
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <th scope="row">OID-{order._id?.slice(-4)}</th>
                      <td className="user_td d-flex align-items-center">
                        <Image
                          width={30}
                          height={30}
                          src={
                            order.userId?.profileImage
                              ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${order.userId.profileImage}`
                              : "/images/default-avatar.png"
                          }
                          alt="User Avatar"
                          className="rounded-circle me-2"
                        />
                        <h6 className="mb-0">
                          {order.userId?.fullName || "Guest User"}
                        </h6>
                      </td>
                      <td>${Number(order.grandTotal || 0).toFixed(2)}</td>
                      <td>{order.date || "N/A"}</td>
                      <td>
                        {Array.isArray(order.product)
                          ? order.product.reduce(
                              (total, item) => total + (item.quantity || 0),
                              0
                            )
                          : 0}
                      </td>
                      <td className={`status_td ${order.status?.toLowerCase()}`}>
                        <span>{order.status || "Unknown"}</span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/dashboard/manage-orders/${order._id}`);
                          }}
                        >
                          View more
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPanel;
