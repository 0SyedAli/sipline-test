"use client"
import CardLineChart from "@/components/CardLineChart";
import CardLineChart2 from "@/components/CardLineChart2";
import OverviewCards from "@/components/OverviewCards";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const img1 = "/images/dollar-circle.png";
const img2 = "/images/chart-square.png";
const img3 = "/images/money-send.png";
const img4 = "/images/discount-circle.png";

const DashboardPanel = ({ activeTab }) => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adminId, setAdminId] = useState("");
  const router = useRouter();

  useEffect(() => {
    const adminData = JSON.parse(sessionStorage.getItem("admin"));
    if (adminData && adminData._id) {
      setAdminId("681120f22f4715831181a9c4"); // Use the actual admin ID from session storage
    } else {
      console.error("User not found or missing '_id' property");
      router.push("/auth/add-services");
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
  // Sample order data
  // const orders = [
  //   {
  //     id: "#4FE21",
  //     image: image1,
  //     name: "Ronald Richards",
  //     category: "Burger",
  //     amount: "+$10",
  //     date: "20/09/2022",
  //     quantity: 4,
  //     status: "pending",
  //   },
  //   {
  //     id: "#4FE22",
  //     image: image2,
  //     name: "John Doe",
  //     category: "Pizza",
  //     amount: "-$12",
  //     date: "21/09/2022",
  //     quantity: 2,
  //     status: "ready",
  //   },
  //   {
  //     id: "#4FE22",
  //     image: image2,
  //     name: "John Doe",
  //     category: "Pizza",
  //     amount: "-$12",
  //     date: "21/09/2022",
  //     quantity: 2,
  //     status: "rejected",
  //   },
  //   {
  //     id: "#4FE22",
  //     image: image2,
  //     name: "John Doe",
  //     category: "Pizza",
  //     amount: "-$12",
  //     date: "21/09/2022",
  //     quantity: 2,
  //     status: "picked",
  //   },
  // ];

  return (
    <div className="page">
      <div className="dashboard_panel_inner">
        <div className="row">
          <div className="col-md-3">
            <OverviewCards ovimg={img1} />
          </div>
          <div className="col-md-3">
            <OverviewCards ovimg={img2} />
          </div>
          <div className="col-md-3">
            <OverviewCards ovimg={img3} />
          </div>
          <div className="col-md-3">
            <OverviewCards ovimg={img4} />
          </div>
        </div>
        <div className="my-4 d-flex align-items-end">
          <CardLineChart />
          <CardLineChart2 />
        </div>
        <div className="py-4 dash_list">
          <h2 className="mb-3">New Order</h2>
          <div className="table-responsive">
            <table className="table caption-top">
              <thead>
                <tr className="borderless">
                  <th scope="col">ID</th>
                  <th scope="col">Customer Name</th>
                  {/* <th scope="col">Category</th> */}
                  <th scope="col">Amount</th>
                  <th scope="col">Date</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 4).map((order, index) => (
                  <tr
                    key={order._id} // Use order._id as key instead of index
                    onClick={() => (router.push("dashboard/manage-orders"))} // Use order._id instead of order.order_id
                    style={{ cursor: "pointer" }}
                  >
                    <th scope="row">OID-{order._id.slice(-4)}</th>
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
                        {order.userId ? order.userId.fullName : "Guest User"}
                      </h6>
                    </td>
                    <td className="dollar_td">${order.grandTotal.toFixed(2)}</td>
                    <td>{order.date}</td>
                    <td>
                      {order.product.reduce((total, item) => total + item.quantity, 0)}
                    </td>
                    <td className={`status_td ${order.status.toLowerCase()}`}>
                      <span>{order.status}</span>
                    </td>
                    <td>View more</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPanel;
