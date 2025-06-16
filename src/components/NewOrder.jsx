// "use client";
// import { useState, useEffect } from "react";
// import SpinnerLoading from "./Spinner/SpinnerLoading";

// const NewOrder = ({ activeTab }) => {
//   const [orders, setOrders] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const barId = sessionStorage.getItem("bar_id");

//   useEffect(() => {
//     const fetchOrders = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_SERVER_URL}vendor/order/list?status=${activeTab}&&bar_id=${barId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${sessionStorage.getItem("token")}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error(response.statusText);
//         }

//         const data = await response.json();

//         if (data.status !== "OK") {
//           throw new Error(data.message);
//         }

//         setOrders(data.data[0]);
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, [activeTab, barId]);

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <div className="py-4 dash_list page">
//       {loading ? (
//         <div className="main_dash2">
//           <h3>
//             <SpinnerLoading />
//           </h3>
//         </div>
//       ) : orders && orders.length === 0 ? (
//         <p className="mt-5">No data found.</p>
//       ) : (
//         <div className="table-responsive">
//           <table className="table caption-top">
//             <thead>
//               <tr className="borderless">
//                 <th scope="col">ID</th>
//                 <th scope="col">Customer Name</th>
//                 <th scope="col">Amount</th>
//                 <th scope="col">Date</th>
//                 <th scope="col">Quantity</th>
//                 <th scope="col">Status</th>
//                 <th scope="col">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((order, index) => (
//                 <tr key={index}>
//                   <th scope="row">{order.order_id}</th>
//                   <td className="user_td">
//                     <img
//                       src={`/customer/images/${order.tbl_customer.profile_image}`}
//                       alt="User Avatar"
//                     ></img>
//                     {order.tbl_customer.full_name}
//                   </td>
//                   <td className="dollar_td">{order.grand_total}</td>
//                   <td>{order.createdAt}</td>
//                   <td>{order.no_of_products}</td>
//                   <td className={`status_td ${order.status.toLowerCase()}`}>
//                     <span>{order.status}</span>
//                   </td>
//                   <td>View more</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//       <div className="pagination justify-content-end">
//         <button className="active">1</button>
//         <button>2</button>
//         <button>3</button>
//         <button>4</button>
//         <button>&gt;&gt;</button>
//       </div>
//     </div>
//   );
// };

// export default NewOrder;

// "use client";
// import { useState, useEffect } from "react";
// import SpinnerLoading from "./Spinner/SpinnerLoading";

// const NewOrder = ({ activeTab }) => {
//   const [orders, setOrders] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [barId, setBarId] = useState(null); // Move barId to state

//   useEffect(() => {
//     // Set barId from sessionStorage only in the browser
//     if (typeof window !== "undefined") {
//       setBarId(sessionStorage.getItem("bar_id"));
//     }
//   }, []);

//   useEffect(() => {
//     if (!barId) return; // Don't fetch if barId is not set

//     const fetchOrders = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_SERVER_URL}vendor/order/list?status=${activeTab}&&bar_id=${barId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${sessionStorage.getItem("token")}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error(response.statusText);
//         }

//         const data = await response.json();

//         if (data.status !== "OK") {
//           throw new Error(data.message);
//         }

//         setOrders(data.data[0]);
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, [activeTab, barId]);
//   const handleRowClick = (orderId) => {
//     router.push(`/order-detail?order_id=${orderId}`);
//   };
//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <div className="py-4 dash_list page">
//       {loading ? (
//         <div className="main_dash2">
//           <h3>
//             <SpinnerLoading />
//           </h3>
//         </div>
//       ) : orders && orders.length === 0 ? (
//         <p className="mt-5">No data found.</p>
//       ) : (
//         <div className="table-responsive">
//           <table className="table caption-top">
//             <thead>
//               <tr className="borderless">
//                 <th scope="col">ID</th>
//                 <th scope="col">Customer Name</th>
//                 <th scope="col">Amount</th>
//                 <th scope="col">Date</th>
//                 <th scope="col">Quantity</th>
//                 <th scope="col">Status</th>
//                 <th scope="col">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((order, index) => (
//                 <tr key={index} onClick={() => handleRowClick(order.order_id)}>
//                   <th scope="row">{order.order_id}</th>
//                   <td className="user_td">
//                     <img
//                       src={`/customer/images/${order.tbl_customer.profile_image}`}
//                       alt="User Avatar"
//                     ></img>
//                     {order.tbl_customer.full_name}
//                   </td>
//                   <td className="dollar_td">{order.grand_total}</td>
//                   <td>{order.createdAt}</td>
//                   <td>{order.no_of_products}</td>
//                   <td className={`status_td ${order.status.toLowerCase()}`}>
//                     <span>{order.status}</span>
//                   </td>
//                   <td>View more</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//       <div className="pagination justify-content-end">
//         <button className="active">1</button>
//         <button>2</button>
//         <button>3</button>
//         <button>4</button>
//         <button>&gt;&gt;</button>
//       </div>
//     </div>
//   );
// };

// export default NewOrder;



// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation"; // Import useRouter for navigation
// import SpinnerLoading from "./Spinner/SpinnerLoading";

// const NewOrder = ({ activeTab }) => {
//   const [orders, setOrders] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [adminId, setAdminId] = useState("");
//   const router = useRouter(); // Initialize useRouter

//   useEffect(() => {
//     const adminData = JSON.parse(sessionStorage.getItem("admin")); // Parse user from localStorage
//     if (adminData._id) {
//       setAdminId("681120f22f4715831181a9c4"); // Set adminId if available
//     } else {
//       console.error("User not found or missing 'id' property");
//       router.push("/auth/add-services"); // Redirect to add services if user is invalid
//     }
//   }, [router]); // Runs once on mount
//   useEffect(() => {
//     if (adminId) {
//       fetchOrders();
//     }
//   }, [adminId, activeTab]); // Runs when adminId changes


//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}admin/allOrdersByAdmin?adminId=${adminId}`);

//       if (!response.ok) {
//         throw new Error(response.statusText);
//       }

//       const data = await response.json();

//       if (data.status !== "OK") {
//         throw new Error(data.message);
//       }
//       setOrders(data?.data);
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const handleRowClick = (orderId) => {
//     router.push(`manage-orders/order/${orderId}`);
//   };

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <div className="py-4 dash_list page">
//       {loading ? (
//         <div className="main_dash2">
//           <h3>
//             <SpinnerLoading />
//           </h3>
//         </div>
//       ) : orders && orders.length === 0 ? (
//         <p className="mt-5">No data found.</p>
//       ) : (
//         <div className="table-responsive">
//           <table className="table caption-top">
//             <thead>
//               <tr className="borderless">
//                 <th scope="col">ID</th>
//                 <th scope="col">Customer Name</th>
//                 <th scope="col">Amount</th>
//                 <th scope="col">Date</th>
//                 <th scope="col">Quantity</th>
//                 <th scope="col">Status</th>
//                 <th scope="col">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((order, index) => (
//                 <tr
//                   key={index}
//                   onClick={() => handleRowClick(order.order_id)} // Set click handler
//                   style={{ cursor: "pointer" }} // Optional: Change cursor to pointer
//                 >
//                   <th scope="row">{order._id}</th>
//                   <td className="user_td">
//                     {/* <img
//                       src={`${}${order.tbl_customer.profile_image}`}
//                       alt="User Avatar"
//                     /> */}
//                     {order.userId.fullName}
//                   </td>
//                   <td className="dollar_td">{order.grandTotal}</td>
//                   <td>{order.date}</td>
//                   <td>{order.subTotal}</td>
//                   <td className={`status_td ${order.status.toLowerCase()}`}>
//                     <span>{order.status}</span>
//                   </td>
//                   <td>View more</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//       <div className="pagination justify-content-end">
//         <button className="active">1</button>
//         <button>2</button>
//         <button>3</button>
//         <button>4</button>
//         <button>&gt;&gt;</button>
//       </div>
//     </div>
//   );
// };

// export default NewOrder;


"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SpinnerLoading from "./Spinner/SpinnerLoading";
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
      router.push("/auth/login");
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
        <div className="main_dash2">
          <h3>
            <SpinnerLoading />
          </h3>
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