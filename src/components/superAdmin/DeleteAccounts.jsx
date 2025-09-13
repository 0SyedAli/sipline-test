"use client"
import { useState, useEffect } from "react"
import { BsSearch, BsChevronLeft, BsChevronRight } from "react-icons/bs"
import "../../styles/refund.css"
import Image from "next/image"
import CustomerImage from "./CustomerImage"
import SpinnerLoading from "../SpinnerLoading"
import Link from "next/link"
import { useRouter } from "next/navigation"
const customer = "/images/default-avatar.png";
export default function DeleteAccounts() {
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const router = useRouter();
    const [stats, setStats] = useState({
        allOrders: 0,
        pending: 0,
        completed: 0,
        cancelled: 0,
        returned: 0,
        damaged: 0,
        delivered: 0,
        rejected: 0,
    })

    const fetchOrders = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}superAdmin/getAllOrders`)

            if (!response.ok) {
                throw new Error("Failed to fetch orders")
            }

            const result = await response.json()

            if (result.success) {
                setOrders(result.data)
                calculateStats(result.data)
            } else {
                throw new Error(result.msg || "Failed to fetch orders")
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred")
        } finally {
            setLoading(false)
        }
    }

    const calculateStats = (ordersData) => {
        const stats = ordersData.reduce(
            (acc, order) => {
                acc.allOrders++

                switch (order.status.toLowerCase()) {
                    case "pending":
                        acc.pending++
                        break
                    case "completed":
                        acc.completed++
                        break
                    case "cancelled":
                        acc.cancelled++
                        break
                    case "returned":
                        acc.returned++
                        break
                    case "damaged":
                        acc.damaged++
                        break
                    case "delivered":
                        acc.delivered++
                        break
                    case "rejected":
                        acc.rejected++
                        break
                }

                return acc
            },
            {
                allOrders: 0,
                pending: 0,
                completed: 0,
                cancelled: 0,
                returned: 0,
                damaged: 0,
                delivered: 0,
                rejected: 0,
            },
        )

        setStats(stats)
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    const getStatusBadge = (status) => {
        switch (status.toLowerCase()) {
            case "completed":
                return <span className="badge py-2 bg-success">Completed</span>
            case "delivered":
                return <span className="badge py-2 bg-success">Delivered</span>
            case "pending":
                return <span className="badge py-2 bg-warning text-dark">Pending</span>
            case "rejected":
                return <span className="badge py-2 bg-danger">Rejected</span>
            case "cancelled":
                return <span className="badge py-2 bg-secondary">Cancelled</span>
            case "returned":
                return <span className="badge py-2 bg-info">Returned</span>
            case "damaged":
                return <span className="badge py-2 bg-dark">Damaged</span>
            default:
                return <span className="badge py-2 bg-secondary">{status}</span>
        }
    }
    const viewOrderDetails = (orderId) => {
        router.push(`/super-admin/dashboard/manage-orders/order/${orderId}`)
    }
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
                    <button className="btn btn-outline-danger" onClick={fetchOrders}>
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="page pt-4">
            {/* Statistics Cards */}
            <div className="row g-2 g-sm-3 mb-4">
                <div className="col-6 col-md-4 col-lg-3 col-xl">
                    <div className="card h-100 border-start border-success border-4">
                        <div className="card-body p-2 py-3 p-sm-3">
                            <div className="d-flex gap-2">
                                <h3 className="mb-0">All Orders:</h3>
                                <h3 className="fw-bold mb-0">{stats.allOrders}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-6 col-md-4 col-lg-3 col-xl">
                    <div className="card h-100 border-start border-warning border-4">
                        <div className="card-body p-2 py-3 p-sm-3">
                            <div className="d-flex gap-2">
                                <h3 className="mb-0">Pending:</h3>
                                <h3 className="fw-bold mb-0">{stats.pending}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-6 col-md-4 col-lg-3 col-xl">
                    <div className="card h-100 border-start border-success border-4">
                        <div className="card-body p-2 py-3 p-sm-3">
                            <div className="d-flex gap-2">
                                <h3 className="mb-0">Delivered:</h3>
                                <h3 className="fw-bold mb-0">{stats.delivered}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-6 col-md-4 col-lg-3 col-xl">
                    <div className="card h-100 border-start border-success border-4">
                        <div className="card-body p-2 py-3 p-sm-3">
                            <div className="d-flex gap-2">
                                {/* <small className="text-muted d-block">Completed</small> */}
                                <h3 className="mb-0">Completed:</h3>
                                <h3 className="fw-bold mb-0">{stats.completed}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Customer Orders Table */}
            <div className="card">
                <div className="card-header bg-white">
                    <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
                        <h5 className="card-title mb-0 fw-bolder">Customer Orders</h5>
                        <div className="d-flex gap-2 align-items-center flex-wrap">
                            <button className="btn btn-outline-primary btn-sm" onClick={fetchOrders} disabled={loading}>
                                Refresh
                            </button>
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
                        </div>
                    </div>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr>

                                    <th scope="col">Customer Name</th>
                                    <th scope="col">Order ID</th>
                                    <th scope="col">Order Date</th>
                                    <th scope="col">Products</th>
                                    <th scope="col">Order Total</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentOrders.length > 0 ? (
                                    currentOrders.map((order) => (
                                        <tr key={order._id}>

                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <CustomerImage order={order} />
                                                    <div>
                                                        <div className="fw-medium text-nowrap">{order.userId?.fullName || "Unkown User"}</div>
                                                        <small className="text-muted">New Customer</small>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="text-muted font-monospace">#{order._id.slice(-8)}</td>
                                            <td className="text-muted text-nowrap">{order.date}</td>
                                            <td className="text-muted">
                                                {order.product.length} item{order.product.length !== 1 ? "s" : ""}
                                                <br />
                                                <small className="text-muted">
                                                    {order.product
                                                        .map((p) => p.productId?.name)
                                                        .filter(Boolean)
                                                        .join(", ")
                                                        .slice(0, 50)}
                                                    {order.product
                                                        .map((p) => p.productId?.name)
                                                        .filter(Boolean)
                                                        .join(", ").length > 50
                                                        ? "..."
                                                        : ""}
                                                </small>
                                            </td>
                                            <td className="fw-medium">₦{order.grandTotal.toFixed(2)}</td>
                                            <td>{getStatusBadge(order.status)}</td>
                                            <td>
                                                <div className="dropdown">
                                                    <button
                                                        className="btn btn-outline-secondary btn-sm text-nowrap"
                                                        type="button"
                                                        onClick={() => viewOrderDetails(order._id)}
                                                    >
                                                        View Details
                                                    </button>
                                                    {/* <ul className="dropdown-menu">
                                                    <li>
                                                        <button className="dropdown-item" >
                                                            View Details
                                                        </button>
                                                    </li>
                                                </ul> */}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 text-muted">
                                            No Orders found.
                                        </td>
                                    </tr>
                                )}
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
                </div>
            </div>
        </div>
    )
}
