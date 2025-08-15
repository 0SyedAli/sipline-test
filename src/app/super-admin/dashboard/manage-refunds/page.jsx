"use client"

import { useState, useEffect } from "react"
import { BsSearch, BsFilter, BsThreeDotsVertical } from "react-icons/bs"
import { useRouter } from "next/navigation"
import SpinnerLoading from "@/components/SpinnerLoading"

export default function RefundRequestsPage() {
  const [refundRequests, setRefundRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [updatingStatus, setUpdatingStatus] = useState(null)
  const router = useRouter()

  useEffect(() => {
    fetchRefundRequests()
  }, [])

  const fetchRefundRequests = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}superAdmin/getAllRefundRequests`)
      const result = await response.json()

      if (result.success) {
        setRefundRequests(result.data || [])
      } else {
        setError("Failed to fetch refund requests")
      }
    } catch (err) {
      setError("Error fetching refund requests: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateRefundStatus = async (refundId, status) => {
    try {
      setUpdatingStatus(refundId)
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}superAdmin/updateRefundRequest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refundId: refundId,
          status: status,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setRefundRequests((prev) =>
          prev.map((request) => (request._id === refundId ? { ...request, status: status } : request)),
        )
      } else {
        setError("Failed to update refund status")
      }
    } catch (err) {
      setError("Error updating status: " + err.message)
    } finally {
      setUpdatingStatus(null)
    }
  }

  const viewRefundDetails = (refundId) => {
    router.push(`manage-refunds/${refundId}`)
  }

  const filteredRequests = refundRequests.filter(
    (request) =>
      (request.transactionId && request.transactionId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (request.reason && request.reason.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (request.status && request.status.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentRequests = filteredRequests.slice(startIndex, endIndex)

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "badge bg-success"
      case "pending":
        return "badge bg-warning text-dark"
      case "rejected":
        return "badge bg-danger"
      default:
        return "badge bg-secondary"
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const generateAvatar = (userId) => {
    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8"]
    const colorIndex = userId ? userId.length % colors.length : 0
    return colors[colorIndex]
  }

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
      <div className="container-fluid py-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gx-4" style={{ gap: "20px" }}>
        <div>
          <h2 className="mb-0 fw-bold">Refund Requests</h2>
          <p className="text-muted mb-0">Total Requests: {filteredRequests.length}</p>
        </div>
        <div className="d-flex gap-2 w-md-50">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <BsSearch className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search by transaction ID, reason, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="border-0 fw-semibold text-muted text-nowrap">User</th>
                  <th className="border-0 fw-semibold text-muted text-nowrap">Transaction ID</th>
                  <th className="border-0 fw-semibold text-muted text-nowrap">Reason</th>
                  <th className="border-0 fw-semibold text-muted text-nowrap">Status</th>
                  <th className="border-0 fw-semibold text-muted text-nowrap">Request Date</th>
                  <th className="border-0 fw-semibold text-muted text-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentRequests.map((request, index) => (
                  <tr key={request._id}>
                    <td className="py-3">
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3"
                          style={{
                            width: "40px",
                            height: "40px",
                            backgroundColor: generateAvatar(request.userId),
                            fontSize: "14px",
                          }}
                        >
                          {request.userId ? request.userId.slice(-2).toUpperCase() : "U"}
                        </div>
                        <div>
                          <div className="fw-semibold">
                            User {request.userId ? request.userId.slice(-4) : "Unknown"}
                          </div>
                          <small className="text-muted text-nowrap">ID: {request.userId || "N/A"}</small>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="fw-medium">{request.transactionId || "N/A"}</span>
                    </td>
                    <td className="py-3">
                      <div className="d-flex align-items-center">
                        <span
                          className="rounded-circle me-2"
                          style={{
                            width: "8px",
                            height: "8px",
                            backgroundColor:
                              request.status === "Approved"
                                ? "#28a745"
                                : request.status === "Pending"
                                  ? "#ffc107"
                                  : "#dc3545",
                          }}
                        ></span>
                        <span className="text-truncate" style={{ maxWidth: "200px" }}>
                          {request.reason || "No reason provided"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={getStatusBadgeClass(request.status)}>{request.status || "Unknown"}</span>
                    </td>
                    <td className="py-3">
                      <div className="d-flex align-items-center text-muted">
                        <span>{formatDate(request.createdAt)}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="dropdown">
                        <button
                          className="btn btn-sm btn-outline-secondary border-0"
                          type="button"
                          data-bs-toggle="dropdown"
                          disabled={updatingStatus === request._id}
                        >
                          {updatingStatus === request._id ? (
                            <div className="spinner-border spinner-border-sm" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          ) : (
                            <BsThreeDotsVertical />
                          )}
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <button className="dropdown-item" onClick={() => viewRefundDetails(request._id)}>
                              View Details
                            </button>
                          </li>
                          {request.status !== "Approved" && (
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => updateRefundStatus(request._id, "Approved")}
                              >
                                Approve
                              </button>
                            </li>
                          )}
                          {request.status !== "Rejected" && (
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => updateRefundStatus(request._id, "Rejected")}
                              >
                                Reject
                              </button>
                            </li>
                          )}
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-4 bottom_pagination gap-3">
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <select
            className="form-select form-select-sm"
            style={{ width: "auto" }}
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value))
              setCurrentPage(1)
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="text-muted">Items per page</span>
        </div>

        <div className="d-flex align-items-center gap-3 ">
          <span className="text-muted text-nowrap">
            {startIndex + 1}-{Math.min(endIndex, filteredRequests.length)} of {filteredRequests.length} items
          </span>
          <div className="d-flex align-items-center gap-1 flex-wrap-reverse">
            <span className="text-muted me-2 text-nowrap">
              {currentPage} of {totalPages} pages
            </span>
            <div className="d-flex align-items-center gap-3 ">
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                ‹
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
