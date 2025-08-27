"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SpinnerLoading from "./SpinnerLoading";
import Image from "next/image";

const NewOrder = ({ activeTab }) => {
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
      // router.push("/auth/login"); 2
    }
  }, [router]);

  useEffect(() => {
    if (adminId) {
      fetchOrders();
    }
  }, [adminId, activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}admin/allOrdersByAdmin?adminId=${adminId}&status=${activeTab}`
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.msg || "Failed to fetch orders");
      }

      // Filter orders by status if needed (or let backend handle it via query param)
      const ordersData = Array.isArray(data.data)
        ? data.data.filter(order => order.status === activeTab)
        : [];

      setOrders(ordersData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleRowClick = (orderId) => {
    router.push(`manage-orders/order/${orderId}`);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="py-4 dash_list page">
      {loading ? (
        <div className="page pt-4 px-0">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
            <SpinnerLoading />
          </div>
        </div>
      ) : orders && orders.length === 0 ? (
        <p className="mt-5">No orders found with status: {activeTab}.</p>
      ) : (
        <div className="table-responsive">
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
              {orders.map((order, index) => (
                <tr
                  key={order._id} // Use order._id as key instead of index
                  onClick={() => handleRowClick(order._id)} // Use order._id instead of order.order_id
                  style={{ cursor: "pointer" }}
                >
                  <th scope="row">{order._id}</th>
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
      )}
      {/* <div className="pagination justify-content-end">
        <button className="active">1</button>
        <button>2</button>
        <button>3</button>
        <button>4</button>
        <button>&gt;&gt;</button>
      </div> */}
    </div>
  );
};

export default NewOrder;