"use client"
import { useState, useEffect } from "react"
import { BsSearch, BsChevronLeft, BsChevronRight, BsBell, BsEye, BsCheck, BsX } from "react-icons/bs"
import "../../styles/refund.css"
import SpinnerLoading from "../SpinnerLoading"
import { useRouter } from "next/navigation"

export default function NewOrder() {
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const router = useRouter();
    const [error, setError] = useState(null)

    const fetchNewOrders = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}superAdmin/getAllOrders`)

            if (!response.ok) {
                throw new Error("Failed to fetch orders")
            }

            const result = await response.json()

            if (result.success) {
                // Filter for new/pending orders only
                const newOrders = result.data.filter(
                    (order) => order.status.toLowerCase() === "pending" || order.status.toLowerCase() === "new",
                )
                setOrders(newOrders)
            } else {
                throw new Error(result.msg || "Failed to fetch orders")
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchNewOrders()

        // Auto-refresh every 30 seconds for new orders
        // const interval = setInterval(fetchNewOrders, 30000)
        // return () => clearInterval(interval)
    }, [])

    // const handleAcceptOrder = async (orderId) => {
    //     // TODO: Implement accept order API call
    //     console.log("Accept order:", orderId)
    // }

    // const handleRejectOrder = async (orderId) => {
    //     // TODO: Implement reject order API call
    //     console.log("Reject order:", orderId)
    // }

    const term = (searchTerm || "").toLowerCase();

    const filteredOrders = orders.filter((order) => {
        const fullName = (order.userId?.fullName || "").toLowerCase();
        const orderId = (order._id || "").toLowerCase();
        const status = (order.status || "").toLowerCase();

        return (
            fullName.includes(term) ||
            orderId.includes(term) ||
            status.includes(term)
        );
    });

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentOrders = filteredOrders.slice(startIndex, endIndex)

    if (loading) {
        return (
            <div className="page pt-4 px-0">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
                    <SpinnerLoading />
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="page pt-4">
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Error!</h4>
                    <p>{error}</p>
                    <button className="btn btn-outline-danger" onClick={fetchNewOrders}>
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="page pt-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4 g-3 flex-wrap " style={{ gap: "15px" }}>
                <div>
                    <h2 className="mb-3 d-flex align-items-center">
                        <BsBell className="me-2 text-warning" />
                        New Order</h2>

                    <p className="text-muted mb-0">
                        {orders.length} new order{orders.length !== 1 ? "s" : ""} awaiting your attention
                    </p>
                </div>
                <div className="d-flex gap-2 align-items-center flex-wrap">
                    <div className="position-relative">
                        <BsSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                        <input
                            type="text"
                            className="form-control ps-5 w-100"
                            placeholder="Search by customer, order ID, or status..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: "300px" }}
                        />
                    </div>
                    <button className="btn btn-outline-primary" onClick={fetchNewOrders} disabled={loading}>
                        Refresh
                    </button>
                </div>
            </div>

            {/* New Orders Alert */}
            {/* {orders.length > 0 && (
                <div className="alert alert-info d-flex align-items-center mb-4" role="alert">
                    <BsBell className="me-2" />
                    <div>
                        You have <strong>{orders.length}</strong> new order{orders.length !== 1 ? "s" : ""} that need
                        {orders.length === 1 ? "s" : ""} your attention.
                    </div>
                </div>
            )} */}

            {/* Orders Table */}
            <div className="card">
                {/* <div className="card-header bg-white">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="card-title mb-0">New Orders</h5>
                        
                    </div>
                </div> */}
                <div className="card-body p-0">
                    {orders.length === 0 ? (
                        <div className="text-center py-5">
                            <BsCheck className="display-1 text-success mb-3" />
                            <h4>No New Orders</h4>
                            <p className="text-muted">All orders have been processed. Great job!</p>
                        </div>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th scope="col">Customer</th>
                                            <th scope="col">Order ID</th>
                                            <th scope="col">Date</th>
                                            <th scope="col">Products</th>
                                            <th scope="col">Total</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentOrders.map((order) => (
                                            <tr key={order._id} className="">
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div
                                                            className="rounded-circle d-flex align-items-center justify-content-center me-2"
                                                            style={{ width: "32px", height: "32px", background: "#2f620b" }}
                                                        >
                                                            <span className="text-white fw-bold ">{order.userId?.fullName?.charAt(0) || "G"}</span>
                                                        </div>
                                                        <div>
                                                            <div className="fw-medium text-nowrap">{order.userId?.fullName || "Guest User"}</div>
                                                            <small className="text-muted">New Customer</small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="font-monospace">
                                                    <span className="badge bg-warning text-dark">NEW</span>
                                                    <br />
                                                    <small>{order._id.slice(-8)}</small>
                                                </td>
                                                <td className="text-muted text-nowrap">{order.date}</td>
                                                <td>
                                                    <div>
                                                        <strong>{order.product.length}</strong> item{order.product.length !== 1 ? "s" : ""}
                                                    </div>
                                                    <small className="text-muted">
                                                        {order.product
                                                            .map((p) => p.productId?.name)
                                                            .filter(Boolean)
                                                            .join(", ")
                                                            .slice(0, 30)}
                                                        {order.product
                                                            .map((p) => p.productId?.name)
                                                            .filter(Boolean)
                                                            .join(", ").length > 30
                                                            ? "..."
                                                            : ""}
                                                    </small>
                                                </td>
                                                <td className="fw-bold text-success">₦{order.grandTotal.toFixed(2)}</td>
                                                <td>
                                                    <span className="badge bg-warning text-dark">{order.status}</span>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-outline-secondary btn-sm text-nowrap"
                                                        type="button"
                                                        onClick={() => router.push("/super-admin/dashboard/manage-orders")}
                                                    >
                                                        View More
                                                    </button>
                                                    {/* <div className="btn-group" role="group">
                                                        
                                                        <button
                                                            className="btn btn-success btn-sm"
                                                            onClick={() => handleAcceptOrder(order._id)}
                                                            title="Accept Order"
                                                        >
                                                            <BsCheck />
                                                        </button>
                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => handleRejectOrder(order._id)}
                                                            title="Reject Order"
                                                        >
                                                            <BsX />
                                                        </button>
                                                    </div> */}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="d-flex justify-content-between align-items-start bottom_pagination p-3  gap-3 border-top">
                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                    <select
                                        className="form-select form-select-sm"
                                        style={{ width: "auto" }}
                                        value={itemsPerPage}
                                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                    >
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
                                    </select>
                                    <small className="text-muted">
                                        Items per page: {startIndex + 1}-{Math.min(endIndex, filteredOrders.length)} of {filteredOrders.length}{" "}
                                        items
                                    </small>
                                </div>

                                <div className="d-flex align-items-center gap-2  flex-wrap-reverse">
                                    <small className="text-muted">
                                        {currentPage} of {totalPages} pages
                                    </small>
                                    <div className="d-flex align-items-center gap-2" >

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
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
