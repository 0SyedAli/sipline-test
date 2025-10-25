"use client";
import CardLineChart from "@/components/CardLineChart";
import OverviewCards from "@/components/OverviewCards";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const img1 = "/images/dollar-circle.png";
const img2 = "/images/chart-square.png";
const img3 = "/images/money-send.png";
const img4 = "/images/discount-circle.png";
const img5 = "/images/calendar.png"; // optional new icon for “This Month”

const DashboardPanel = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adminId, setAdminId] = useState("");
  const router = useRouter();

  // ✅ Load Admin ID
  useEffect(() => {
    try {
      const adminData = JSON.parse(sessionStorage.getItem("admin"));
      if (adminData?._id) setAdminId(adminData._id);
    } catch (err) {
      console.error("Error parsing admin:", err);
    }
  }, []);

  // ✅ Fetch Stats
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

  // ✅ Derived Data
  const last10Months = Array.isArray(stats?.last10Months) ? stats.last10Months : [];
  const selectedMonth = stats?.selectedMonth || {};

  // Find this month (from selectedMonth)
  const thisMonthTotal = Number(selectedMonth?.netSales || 0).toFixed(2);
  const thisMonthName = selectedMonth?.month || "N/A";
  const thisMonthYear = selectedMonth?.year || "";

  // Find last month (previous entry in last10Months)
  const currentIndex = last10Months.findIndex(
    (m) => m.month === thisMonthName && m.year === thisMonthYear
  );
  const lastMonthData = currentIndex > 0 ? last10Months[currentIndex - 1] : null;
  const lastMonthTotal = Number(lastMonthData?.netSales || 0).toFixed(2);
  const lastMonthName = lastMonthData?.month || "N/A";
  const lastMonthYear = lastMonthData?.year || "";

  return (
    <div className="page">
      <div className="dashboard_panel_inner">
        {/* ✅ Stats Overview Cards */}
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xxl-5 gx-3 gy-3">
          {/* 1️⃣ Total Customers */}
          <div className="col">
            <OverviewCards
              ovimg={img1}
              title="Total Customers"
              price={selectedMonth?.totalCustomers ?? 0}
              discount="This Month"
            />
          </div>

          {/* 2️⃣ New Customers (assuming same as total for now) */}
          <div className="col">
            <OverviewCards
              ovimg={img2}
              title="Total Orders"
              price={selectedMonth?.totalOrders ?? 0}
              discount="This Month"
            />
          </div>

          {/* 3️⃣ Total Revenue */}
          <div className="col">
            <OverviewCards
              ovimg={img3}
              title="Total Revenue"
              price={`$${Number(stats?.totalRevenue || 0).toFixed(2)}`}
              discount="All Time"
            />
          </div>

          {/* 4️⃣ Last Month Revenue */}
          <div className="col">
            <OverviewCards
              ovimg={img4}
              title={`Last Month (${lastMonthName?.slice(0, 4)} ${lastMonthYear})`}
              price={`$${lastMonthTotal}`}
              discount="Last Month"
            />
          </div>

          {/* 5️⃣ This Month Revenue */}
          <div className="col">
            <OverviewCards
              ovimg={img4}
              title={`This Month (${thisMonthName?.slice(0, 4)} ${thisMonthYear})`}
              price={`$${thisMonthTotal}`}
              discount="Current Month"
            />
          </div>
        </div>

        {/* ✅ Charts */}
        <div className="my-4 d-flex align-items-end flex-column flex-lg-row">
          {/* Pass last10Months data to chart */}
          <CardLineChart TotalRevenueData={stats?.last10Months} isLoading={!stats}  />
        </div>

        {/* ✅ Orders Table */}
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
                      onClick={() => router.push(`/dashboard/manage-orders/order/${order._id}`)}
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
                        <h6 className="mb-0">{order.userId?.fullName || "Guest User"}</h6>
                      </td>
                      <td>${Number(order.grandTotal || 0).toFixed(2)}</td>
                      <td>{order.date || "N/A"}</td>
                      <td>
                        {Array.isArray(order.product)
                          ? order.product.reduce((total, item) => total + (item.quantity || 0), 0)
                          : 0}
                      </td>
                      <td className={`status_td ${order.status?.toLowerCase()}`}>
                        <span>{order.status || "Unknown"}</span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/dashboard/manage-orders/order/${order._id}`);
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
