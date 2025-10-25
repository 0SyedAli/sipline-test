"use client"
import OverviewCards from "@/components/superAdmin/OverviewCards";
import NewOrder from "@/components/superAdmin/NewOrder";
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
  const [stats, setStats] = useState(null);
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

  // useEffect(() => {
  //   if (adminId) {
  //     fetchOrders();
  //   }
  // }, [adminId]);

  // const fetchOrders = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_SERVER_URL}admin/allOrdersByAdmin?adminId=${adminId}`
  //     );

  //     if (!response.ok) {
  //       throw new Error(response.statusText);
  //     }

  //     const data = await response.json();

  //     if (!data.success) {
  //       throw new Error(data.msg || "Failed to fetch orders");
  //     }

  //     setOrders(data?.data);
  //   } catch (error) {
  //     setError(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  useEffect(() => {
    if (!adminId) return;

    const fetchStats = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}superAdmin/AllOverStats`
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
  return (
    <div className="page">
      <div className="dashboard_panel_inner">
        {/* <div className="row gx-3 gy-2 gy-sm-3 gx-xl-4">
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
        </div> */}
        <div className="row gx-3 gy-2 gy-sm-3 gx-xl-4">
          <div className="col-sm-6 col-lg-3">
            <OverviewCards
              ovimg={img1}
              title="Total Earning"
              price={`$${stats?.TotalRevenue?.toFixed(2) ?? "0.00"}`}
            />
          </div>
          <div className="col-sm-6 col-lg-3">
            <OverviewCards
              ovimg={img2}
              title="Total Orders"
              price={stats?.totalOrder ?? 0}
            />
          </div>
          <div className="col-sm-6 col-lg-3">
            <OverviewCards
              ovimg={img3}
              title="Total Bars"
              price={stats?.totalBars ?? 0}
            />
          </div>
          <div className="col-sm-6 col-lg-3">
            <OverviewCards
              ovimg={img4}
              title="Total Customers"
              price={stats?.totalBars ?? 0}
            />
          </div>
        </div>
        <div className="py-4 dash_list">
          <NewOrder />
        </div>
      </div>
    </div>
  );
};

export default DashboardPanel;
