// "use client";
// import NewOrderProductCard from "@/components/NewOrderProductCard";
// import Image from "next/image";
// import Link from "next/link";
// import { useState, useEffect } from "react";

// const user1 = "/images/customer.png";

// const Order = ({ params }) => {
//   const orderId = params.order_id;
//   const [orderDetails, setOrderDetails] = useState();
//   const [newOrder, setNewOrder] = useState([]);
//   const [customer, setCustomer] = useState({});
//   const [grandTotal, setGrandTotal] = useState(0);
//   const [status, setStatus] = useState("");
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const getOrderDetails = async () => {
//       const token = sessionStorage.getItem("token");
//       const barId = sessionStorage.getItem("bar_id");

//       if (!token || !barId) {
//         setError("Missing authentication details. Please log in again.");
//         return;
//       }

//       try {
//         setError(null); // Reset error before fetching
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_SERVER_URL}vendor/order/details?order_id=${orderId}&bar_id=${barId}`,
//           {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const data = await response.json();

//         if (data.status === "OK") {
//           const orderData = data.data[0] || {}; // Default to empty object if not available
//           setOrderDetails(orderData);
//           setCustomer(orderData.tbl_customer || {});
//           setGrandTotal(orderData.grand_total || 0);
//           setStatus(orderData.status || "");
//           setNewOrder(data.data[1] || []);
//         } else {
//           throw new Error("Failed to fetch order details");
//         }
//       } catch (error) {
//         console.error("Error fetching order details:", error);
//         setError("Failed to load order details. Please try again later.");
//       }
//     };

//     getOrderDetails();
//   }, [orderId]);

//   if (
//     orderDetails &&
//     orderDetails?.bar_id !== parseInt(sessionStorage.getItem("bar_id"))
//   ) {
//     return <>You don't have access to view the order</>;
//   }

//   return (
//     <div className="page">
//       <div className="manage_order_head mt-3">
//         <h3>Order Details</h3>
//       </div>
//       <div className="manage_order_body new_order_display">
//         {error ? (
//           <div className="error-message">
//             <p>{error}</p>
//           </div>
//         ) : (
//           <div className="row">
//             <div className="col-9">
//               <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 gx-3 pb-3">
//                 {newOrder.slice(0, 4).map((order, index) => (
//                   <div key={index} className="col">
//                     <NewOrderProductCard
//                       title={
//                         order.tbl_product?.product_name || "Unnamed Product"
//                       }
//                       id={order.id}
//                       quantity={order.quantity}
//                       coupon={"V1231231"} // Replace with actual coupon code if available
//                       status={status}
//                       price={order.total_price}
//                     />
//                   </div>
//                 ))}
//               </div>
//               <div className="SubHeading">
//                 <h5>Variants</h5>
//               </div>
//               <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 gx-3 pb-3">
//                 {newOrder.slice(0, 4).map((order) =>
//                   order.tbl_order_products_variants
//                     ?.slice(0, 4)
//                     .map((variant, index) => (
//                       <div key={index} className="col">
//                         <NewOrderProductCard
//                           title={
//                             variant.tbl_product_variant?.product_name ||
//                             "Unnamed Variant"
//                           }
//                           id={variant.id}
//                           quantity={variant.quantity}
//                           coupon={"V1231231"} // Replace with actual coupon code if available
//                           status={status}
//                           price={variant.total_price}
//                         />
//                       </div>
//                     ))
//                 )}
//               </div>
//             </div>
//             <div className="col-3">
//               <div className="new_order_rightBar">
//                 <div className="order_map">
//                   <div
//                     style={{
//                       position: "relative",
//                       height: "350px",
//                       width: "100%",
//                     }}
//                   >
//                     <iframe
//                       src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117944.0852058463!2d-94.4387242276673!3d39.03045329060634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87c0f75eafe99997%3A0x558525e66aaa51a2!2sKansas%20City%2C%20MO%2C%20USA!5e0!3m2!1sen!2s!4v1726036305513!5m2!1sen!2s"
//                       width="100%"
//                       height="100%"
//                       style={{ border: 0 }}
//                       allowFullScreen=""
//                       loading="lazy"
//                       referrerPolicy="no-referrer-when-downgrade"
//                     ></iframe>
//                   </div>
//                 </div>
//                 <div className="special_cont">
//                   <h4>Special Instructions</h4>
//                   <p>
//                     Lorem Ipsum is simply dummy text of the printing and
//                     typesetting industry.
//                   </p>
//                   <div className="grand_total mt-4 d-flex align-items-center justify-content-between pt-3 border-top">
//                     <h5 className="m-0">Grand Total</h5>
//                     <h4 className="m-0">
//                       <span>${grandTotal}</span>
//                     </h4>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//         <div className="row">
//           <div className="col-9">
//             <div className="customer_section">
//               <p>Customer Name</p>
//               <div className="d-flex align-items-center justify-content-between">
//                 <div className="cs_user d-flex align-items-center gap-2">
//                   <Image
//                     src={`/customer/images/${customer.profile_image || user1}`}
//                     alt="Customer Image"
//                     width={50}
//                     height={50}
//                   />
//                   <h3 className="m-0">
//                     {customer.full_name || "Unnamed Customer"}
//                   </h3>
//                 </div>
//                 <div className="d-flex align-items-center gap-2">
//                   {status === "new" ? (
//                     <>
//                       <Link href="/" className="themebtn4 green btn">
//                         Accept
//                       </Link>
//                       <Link href="/" className="themebtn4 red btn">
//                         Reject
//                       </Link>
//                     </>
//                   ) : status === "preparing" ? (
//                     <Link href="/" className="themebtn4 red btn">
//                       Picked
//                     </Link>
//                   ) : status === "picked" ? (
//                     <Link href="/" className="themebtn4 red btn">
//                       Delivered
//                     </Link>
//                   ) : null}
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="col-3"></div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Order;
"use client";
import NewOrderProductCard from "@/components/NewOrderProductCard";
import SpinnerLoading from "@/components/Spinner/SpinnerLoading";
import Spinner2 from "@/components/Spinner2";
import { Spinner } from "@chakra-ui/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const defaultUserImage = "/images/customer.png";

const Order = ({ params }) => {
  const orderId = params.order_id;
  const [orderDetails, setOrderDetails] = useState(null);
  const [products, setProducts] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [grandTotal, setGrandTotal] = useState(0);
  const [status, setStatus] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    const getOrderDetails = async () => {
      const token = sessionStorage.getItem("token");

      if (!token) {
        setError("Missing authentication details. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        setError(null);
        setLoading(true);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}admin/getOrderById?orderId=${orderId}`,
          {
            method: "GET",
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setOrderDetails(data.data);
          setProducts(data.data.product || []);
          setGrandTotal(data.data.grandTotal || 0);
          setStatus(data.data.status || "");

          // You might need to fetch customer details separately if not included in the order response
          // For now, we'll create a basic customer object
          setCustomer({
            full_name: data?.data?.userId?.fullName || "Unknown", // You might want to fetch actual customer name
            profile_image: data?.data?.userId?.profileImage
          });
        } else {
          throw new Error(data.msg || "Failed to fetch order details");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        setError(error.message || "Failed to load order details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getOrderDetails();
  }, [orderId]);

  const updateStatus = async (newStatus) => {
    const token = sessionStorage.getItem("token");

    try {
      setError(null);
      setStatusLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}admin/udpateOrderStatus?orderId=${orderId}&status=${newStatus}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      const data = await response.json();
      if (data.success) {
        setStatus(newStatus);
        toast.success(data?.msg, "Status Updated Successful!")
      } else {
        throw new Error(data.msg || "Status update failed");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setError(error.message || "Failed to update order status. Please try again later.");
    }
    finally {
      setStatusLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="manage_order_head mt-3">
          <h3>Order Details</h3>
        </div>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          <SpinnerLoading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="manage_order_head mt-3">
          <h3>Order Details</h3>
        </div>
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="page">
        <div className="manage_order_head mt-3">
          <h3>Order Details</h3>
        </div>
        <div className="alert alert-warning">Order not found</div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="manage_order_head mt-3">
        <h3>Order Details</h3>
      </div>
      <div className="manage_order_body new_order_display">
        <div className="row">
          <div className="col-lg-9 col-md-12">
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 gx-3 pb-3">
              {products.map((product, index) => (
                <div key={`product-${product._id || index}`} className="col">
                  <NewOrderProductCard
                    title={product.productId?.name || "Unnamed Product"}
                    id={product.productId?._id}
                    quantity={product.quantity || 0}
                    price={product.productId?.price || 0}
                    status={status}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="col-lg-3 col-md-12">
            <div className="new_order_rightBar">
              <div className="order_map mb-3">
                <div style={{ position: "relative", height: "350px", width: "100%" }}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117944.0852058463!2d-94.4387242276673!3d39.03045329060634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87c0f75eafe99997%3A0x558525e66aaa51a2!2sKansas%20City%2C%20MO%2C%20USA!5e0!3m2!1sen!2s!4v1726036305513!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Delivery Location Map"
                  />
                </div>
              </div>

              <div className="special_cont">
                <h4>Order Summary</h4>
                <div className="order-summary">
                  <p>Subtotal: ${orderDetails.subTotal?.toFixed(2)}</p>
                  <p>Coupon Discount: ${orderDetails.couponDiscount?.toFixed(2)}</p>
                  <p>Sales Tax: ${orderDetails.salesTax?.toFixed(2)}</p>
                  <p>Platform Charges: ${orderDetails.platFormCharges?.toFixed(2)}</p>
                </div>
                <div className="grand_total mt-4 d-flex align-items-center justify-content-between pt-3 border-top">
                  <h5 className="m-0">Grand Total</h5>
                  <h4 className="m-0">
                    <span>${grandTotal.toFixed(2)}</span>
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-lg-12">
            <div className="customer_section">
              <p>Customer</p>
              <div className="d-flex align-items-center justify-content-between">
                <div className="cs_user d-flex align-items-center gap-2">
                  <Image
                    src={customer?.profile_image
                      ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${customer.profile_image}`
                      : defaultUserImage}
                    alt="Customer"
                    width={50}
                    height={50}
                    className="rounded-circle"
                    onError={(e) => {
                      e.target.src = defaultUserImage;
                    }}
                  />
                  <h3 className="m-0">
                    {customer?.full_name || "Guest Customer"}
                  </h3>
                </div>

                <div className="d-flex align-items-center gap-2">
                  {status === "Pending" && (
                    <>
                      <button
                        onClick={() => updateStatus("Preparing")}
                        disabled={statusLoading}
                        className="themebtn4 green btn"
                      >
                        {statusLoading ? <Spinner2 /> : "Accept"}
                      </button>
                      <button
                        onClick={() => updateStatus("Rejected")}
                        disabled={statusLoading}
                        className="themebtn4 red btn"
                      >
                        {statusLoading ? <Spinner2 /> : "Reject"}

                      </button>
                    </>
                  )}
                  {status === "Preparing" && (
                    <button
                      onClick={() => updateStatus("Picked")}
                      disabled={statusLoading}
                      className="themebtn4 blue btn"
                    >
                      {statusLoading ? <Spinner2 /> : "Mark as Picked"}

                    </button>
                  )}
                  {status === "Picked" && (
                    <button
                      onClick={() => updateStatus("Delivered")}
                      disabled={statusLoading}
                      className="themebtn4 green btn"
                    >
                      {statusLoading ? <Spinner2 /> : "Mark as Delivered"}

                    </button>
                  )}
                  {status === "Delivered" && (
                    <button
                      // onClick={() => updateStatus("Delivered")}
                      className="themebtn4 text-dark border-2 border-dark success btn"
                      style={{ cursor: "text" }}
                    >
                      Product Delivered!
                    </button>
                  )}
                  {status === "Rejected" && (
                    <button
                      // onClick={() => updateStatus("Rejected")}
                      className="themebtn4 bg-danger text-white border-2 border-dark success btn"
                      style={{ cursor: "text" }}
                    >
                      Product Rejected!
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-12"></div>
        </div>
      </div>
    </div>
  );
};

export default Order;