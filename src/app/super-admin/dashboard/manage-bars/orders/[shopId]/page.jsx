"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SpinnerLoading from "@/components/SpinnerLoading";
import CustomerOrderImage from "@/components/superAdmin/CustomerOrderImage";
import { BsSearch, BsChevronLeft, BsChevronRight } from "react-icons/bs";

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50];

const NewOrder = ({ params }) => {
  const shopId = params.shopId;
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    if (shopId) fetchOrders();
  }, [shopId]);

  useEffect(() => {
    filterOrders();
  }, [searchTerm, orders]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}admin/allOrdersByAdmin?adminId=${shopId}`
      );
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        setOrders(data.data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    if (!searchTerm) {
      setFilteredOrders(orders);
    } else {
      const lowerTerm = searchTerm.toLowerCase();
      const filtered = orders.filter((order) =>
        order.userId?.fullName?.toLowerCase().includes(lowerTerm) ||
        order.status?.toLowerCase().includes(lowerTerm) ||
        order._id?.toLowerCase().includes(lowerTerm)
      );
      setFilteredOrders(filtered);
      setCurrentPage(1);
    }
  };

  const handleRowClick = (orderId) => {
    router.push(`/super-admin/dashboard/manage-bars/order-details/${orderId}`);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="page pt-4 px-0">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
          <SpinnerLoading />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-danger mt-5"><strong>Error:</strong> {error}</div>;
  }

  if (!orders || orders.length === 0) {
    return <p className="mt-5">No orders found for this bar.</p>;
  }

  return (
    <div className="page pt-3 px-0">
      {/* Header with search */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap" style={{ gap: "15px" }}>
        <h1 className="h5 fw-semibold text-dark mb-0">Total Orders: {orders.length}</h1>

        <div className="position-relative dash_searc" style={{width:"400px"}}>
          <BsSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
          <input
            type="text"
            className="form-control ps-5"
            placeholder="Search by Order ID, Name, or Status"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.length > 0 ? (
                  currentOrders.map((order) => {
                    const totalQty = Array.isArray(order.product)
                      ? order.product.reduce((sum, item) => sum + (item.quantity || 0), 0)
                      : 0;

                    return (
                      <tr key={order._id} onClick={() => handleRowClick(order._id)} style={{ cursor: "pointer" }}>
                        <td>{order._id}</td>
                        <td className="user_td d-flex align-items-center gap-2">
                          <CustomerOrderImage oImage={order} />
                          <h6 className="mb-0">{order.userId?.fullName || "Guest User"}</h6>
                        </td>
                        <td className="dollar_td">
                          ${order.grandTotal ? order.grandTotal.toFixed(2) : "0.00"}
                        </td>
                        <td>{order.date || "N/A"}</td>
                        <td>{totalQty}</td>
                        <td className={`status_td ${order.status?.toLowerCase() || ""}`}>
                          <span>{order.status || "Pending"}</span>
                        </td>
                        <td>View more</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-start p-3 bottom_pagination border-top gap-3 flex-wrap">
            <div className="d-flex align-items-center gap-2">
              <select
                className="form-select form-select-sm"
                style={{ width: "auto" }}
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                {ITEMS_PER_PAGE_OPTIONS.map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
              <small className="text-muted">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredOrders.length)} of {filteredOrders.length} orders
              </small>
            </div>

            <div className="d-flex align-items-center gap-2 flex-wrap-reverse">
              <small className="text-muted text-nowrap">
                Page {currentPage} of {totalPages || 1}
              </small>
              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <BsChevronLeft />
                </button>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  <BsChevronRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewOrder;
