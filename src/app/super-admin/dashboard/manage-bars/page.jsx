"use client"

import SpinnerLoading from "@/components/SpinnerLoading"
import ShopImage from "@/components/superAdmin/ShopImage"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import {
  BsPeople,
  BsSearch,
  BsChevronLeft,
  BsChevronRight,
  BsThreeDotsVertical,
  BsFilter,
  BsSortDown,
} from "react-icons/bs"

export default function ManageBarPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter();
  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}superAdmin/getAllShops`)

        if (!response.ok) {
          throw new Error("Failed to fetch shops")
        }

        const result = await response.json()

        if (result.success) {
          setShops(result.data)
        } else {
          throw new Error(result.msg || "Failed to fetch shops")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchShops()
  }, [])

  const filteredBars = shops.filter(
    (shop) =>
      (shop.barName && shop.barName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (shop.address && shop.address.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const totalPages = Math.ceil(filteredBars.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentBars = filteredBars.slice(startIndex, endIndex)

  const formatWorkingDays = (workingDays) => {
    if (!workingDays || !Array.isArray(workingDays)) return "N/A"

    const activeDays = workingDays.filter((day) => day.isActive)
    if (activeDays.length === 7) return "Mon - Sun"
    if (activeDays.length === 0) return "Closed"

    const dayNames = activeDays.map((day) => day.day.slice(0, 3))
    return dayNames.join(", ")
  }

  const getStatusColor = (rating) => {
    if (rating >= 4) return "success"
    if (rating >= 3) return "warning"
    if (rating >= 2) return "info"
    if (rating >= 1) return "primary"
    return "danger"
  }

  const formatJoiningDate = (shopId) => {
    // Since there's no joining date in API, we'll use a placeholder
    // You can modify this based on your actual data structure
    return "Jan 15, 2024"
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
      <div className="page">
        <div className="">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error!</h4>
            <p>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page pt-3 px-0">
      <div className="">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap " style={{ gap: "15px" }}>
          <div className="d-flex align-items-center gap-2">
            <BsPeople className="text-muted fs-5" />
            <h1 className="h4 fw-semibold text-dark mb-0">Total Bars: {shops.length} Bars</h1>
          </div>
          <div className="d-flex align-items-center gap-3">
            <div className="position-relative">
              <BsSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
              <input
                type="text"
                className="form-control ps-5"
                placeholder="Search payroll or name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: "250px" }}
              />
            </div>
            {/* <button className="btn btn-outline-secondary d-flex align-items-center gap-2">
              <BsFilter />
              Filter
            </button>
            <button className="btn btn-outline-secondary d-flex align-items-center gap-2">
              <BsSortDown />
              Sort
            </button> */}
          </div>
        </div>

        {/* Bars Table */}
        <div className="card">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="fw-medium text-muted">
                      Name
                    </th>
                    <th scope="col" className="fw-medium text-muted">
                      Location
                    </th>
                    <th scope="col" className="fw-medium text-muted">
                      Working Days
                    </th>
                    <th scope="col" className="fw-medium text-muted">
                      Joining Date
                    </th>
                    <th scope="col" className="fw-medium text-muted">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentBars.length > 0 ? (
                    currentBars.map((shop) => (
                      <tr key={shop._id}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <ShopImage shop={shop} />
                            <div>
                              <div className="fw-medium text-dark text-nowrap">{shop.barName || "Unknown Bar"}</div>
                              <small className="text-muted">
                                {shop.barDetails
                                  ? shop.barDetails.split(" ").slice(0, 4).join(" ")
                                  : "No details available"}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td className="text-muted ">
                          {shop.address
                            ? shop.address.split(" ").slice(0, 4).join(" ")
                            : "No address available"}
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <span
                              className={`badge bg-${getStatusColor(shop.avgRating || 0)} rounded-pill`}
                              style={{ width: "8px", height: "8px" }}
                            ></span>
                            <span className="text-muted  text-nowrap">{formatWorkingDays(shop.workingDays)}</span>
                          </div>
                        </td>
                        <td className="text-muted  text-nowrap">{formatJoiningDate(shop._id)}</td>
                        <td>
                          <button
                            className="btn btn-outline-secondary btn-sm text-nowrap"
                            onClick={() => {
                              console.log(`View shop details for: ${shop._id}`)
                              // You can implement navigation to shop details page here
                              router.push(`manage-bars/bar/${shop._id}`)
                            }}
                          >
                            View Detail
                          </button>

                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        No Bars found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-start p-3 bottom_pagination border-top gap-3">
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
                  Items per page: {startIndex + 1}-{Math.min(endIndex, filteredBars.length)} of {filteredBars.length}{" "}
                  items
                </small>
              </div>

              <div className="d-flex align-items-center gap-2  flex-wrap-reverse">
                <small className="text-muted text-nowrap">
                  {currentPage} of {totalPages} pages
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
    </div>
  )
}
