"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  BsArrowLeft,
  BsCalendar,
  BsCreditCard,
  BsPerson,
  BsFileText,
  BsCheckCircle,
  BsXCircle,
  BsClock,
} from "react-icons/bs"
import SpinnerLoading from "@/components/SpinnerLoading"

export default function RefundDetailPage({ params }) {
  const [refundData, setRefundData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const router = useRouter()
  const { refundId } = params

  useEffect(() => {
    if (refundId) {
      fetchRefundDetails()
    }
  }, [refundId])

  const fetchRefundDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}superAdmin/getRefundRequestById?refundId=${refundId}`)
      const result = await response.json()

      if (result.success) {
        setRefundData(result.data)
      } else {
        setError("Failed to fetch refund details")
      }
    } catch (err) {
      setError("Error fetching refund details: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateRefundStatus = async (status) => {
    try {
      setUpdatingStatus(true)
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
        setRefundData((prev) => ({ ...prev, status: status }))
      } else {
        setError("Failed to update refund status")
      }
    } catch (err) {
      setError("Error updating status: " + err.message)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return <BsCheckCircle className="text-success" size={20} />
      case "rejected":
        return <BsXCircle className="text-danger" size={20} />
      case "pending":
        return <BsClock className="text-warning" size={20} />
      default:
        return <BsClock className="text-secondary" size={20} />
    }
  }

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "badge bg-success-subtle text-success border border-success-subtle"
      case "pending":
        return "badge bg-warning-subtle text-warning border border-warning-subtle"
      case "rejected":
        return "badge bg-danger-subtle text-danger border border-danger-subtle"
      default:
        return "badge bg-secondary-subtle text-secondary border border-secondary-subtle"
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount) => {
    if (!amount) return "N/A"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
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
      <div className="page pt-4 px-0">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    )
  }

  if (!refundData) {
    return (
      <div className="page pt-4 px-0">
        <div className="alert alert-warning" role="alert">
          Refund request not found
        </div>
      </div>
    )
  }

  return (
    <div className="page pt-4 px-0">
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <button className="btn btn-outline-secondary me-3 d-flex align-items-center" onClick={() => router.back()}>
          <BsArrowLeft className="me-2" />
          Back
        </button>
        <div>
          <h2 className="mb-0 fw-bold">Refund Request Details</h2>
          <p className="text-muted mb-0">Transaction ID: {refundData.transactionId || "N/A"}</p>
        </div>
      </div>

      <div className="row g-4 pt-4">
        {/* Main Details Card */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 pb-0">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="card-title mb-1">Refund Information</h5>
                  <p className="text-muted mb-0">Complete details of the refund request</p>
                </div>
                <div className="d-flex align-items-center gap-2">
                  {getStatusIcon(refundData.status)}
                  <span className={getStatusBadgeClass(refundData.status)}>{refundData.status || "Unknown"}</span>
                </div>
              </div>
            </div>
            <div className="card-body mt-4">
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <div className="bg-primary-subtle rounded-circle p-2 me-3 d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
                      <BsPerson className="text-primary" size={20} />
                    </div>
                    <div>
                      <h6 className="mb-1">User Information</h6>
                      <p className="text-muted mb-0">User ID: {refundData.userId || "N/A"}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <div className="bg-success-subtle rounded-circle p-2 me-3 d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
                      <BsCreditCard className="text-success" size={20} />
                    </div>
                    <div>
                      <h6 className="mb-1">Transaction ID</h6>
                      <p className="text-muted mb-0 font-monospace">{refundData.transactionId || "N/A"}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <div className="bg-info-subtle rounded-circle p-2 me-3 d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
                      <BsCalendar className="text-info" size={20} />
                    </div>
                    <div>
                      <h6 className="mb-1">Request Date</h6>
                      <p className="text-muted mb-0">{formatDate(refundData.createdAt)}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <div className="bg-warning-subtle rounded-circle p-2 me-3 d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
                      <BsCreditCard className="text-warning" size={20} />
                    </div>
                    <div>
                      <h6 className="mb-1">Refund Amount</h6>
                      <p className="text-muted mb-0">{formatCurrency(refundData.amount)}</p>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-flex align-items-start">
                    <div className="bg-secondary-subtle rounded-circle p-2 me-3 d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
                      <BsFileText className="text-secondary" size={20} />
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1">Refund Reason</h6>
                      <div className="bg-light rounded p-3">
                        <p className="mb-0">{refundData.reason || "No reason provided"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Card */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="card-title mb-0">Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                {refundData.status !== "Approved" && (
                  <button
                    className="btn btn-success d-flex align-items-center justify-content-center"
                    onClick={() => updateRefundStatus("Approved")}
                    disabled={updatingStatus}
                  >
                    {updatingStatus ? (
                      <div className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      <BsCheckCircle className="me-2" />
                    )}
                    Approve Refund
                  </button>
                )}
                {refundData.status !== "Rejected" && (
                  <button
                    className="btn btn-danger d-flex align-items-center justify-content-center"
                    onClick={() => updateRefundStatus("Rejected")}
                    disabled={updatingStatus}
                  >
                    {updatingStatus ? (
                      <div className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      <BsXCircle className="me-2" />
                    )}
                    Reject Refund
                  </button>
                )}
                {refundData.status !== "Pending" && (
                  <button
                    className="btn btn-warning d-flex align-items-center justify-content-center"
                    onClick={() => updateRefundStatus("Pending")}
                    disabled={updatingStatus}
                  >
                    {updatingStatus ? (
                      <div className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      <BsClock className="me-2" />
                    )}
                    Mark as Pending
                  </button>
                )}
              </div>

              <hr className="my-4" />

              <div className="text-center">
                <small className="text-muted">Last updated: {formatDate(refundData.updatedAt)}</small>
              </div>
            </div>
          </div>

          {/* Status Timeline Card */}
          <div className="card border-0 shadow-sm mt-4">
            <div className="card-header bg-white border-0">
              <h5 className="card-title mb-0">Status Timeline</h5>
            </div>
            <div className="card-body">
              <div className="timeline">
                <div className="timeline-item d-flex align-items-center mb-3">
                  <div className=" rounded-circle p-1 me-3  d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px", background: "#2f620b" }}>
                    <BsFileText className="text-white" size={20} />
                  </div>
                  <div>
                    <small className="text-muted">Request Created</small>
                    <div className="fw-medium">{formatDate(refundData.createdAt)}</div>
                  </div>
                </div>
                {refundData.updatedAt && refundData.updatedAt !== refundData.createdAt && (
                  <div className="timeline-item d-flex align-items-center">
                    <div className=" rounded-circle p-1 me-3">{getStatusIcon(refundData.status)}</div>
                    <div>
                      <small className="text-muted">Status Updated</small>
                      <div className="fw-medium">{formatDate(refundData.updatedAt)}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
