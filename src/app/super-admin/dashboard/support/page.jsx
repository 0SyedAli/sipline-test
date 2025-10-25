"use client";

import SpinnerLoading from "@/components/SpinnerLoading";
import CustomerOrderImage from "@/components/superAdmin/CustomerOrderImage";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  BsEnvelope,
  BsSearch,
  BsChevronLeft,
  BsChevronRight,
  BsChatDots,
} from "react-icons/bs";

export default function SupportPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [supportList, setSupportList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Support Messages
  useEffect(() => {
    const fetchSupport = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}superAdmin/getAllSupport`);
        if (!res.ok) throw new Error("Failed to fetch support data");

        const data = await res.json();
        if (data.success) {
          setSupportList(data.data);
        } else {
          throw new Error(data.msg || "Failed to load support messages");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSupport();
  }, []);

  // Filter Support Messages
  const filteredSupport = supportList.filter((item) => {
    const name = item?.email?.toLowerCase() || "";
    const message = item?.message?.toLowerCase() || "";
    const userName = item?.userId?.fullName?.toLowerCase() || "";
    return (
      name.includes(searchTerm.toLowerCase()) ||
      message.includes(searchTerm.toLowerCase()) ||
      userName.includes(searchTerm.toLowerCase())
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredSupport.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMessages = filteredSupport.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading)
    return (
      <div className="page pt-4 px-0">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
          <SpinnerLoading />
        </div>
      </div>
    );

  if (error)
    return (
      <div className="page">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error!</h4>
          <p>{error}</p>
        </div>
      </div>
    );

  return (
    <div className="page pt-3 px-0">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap" style={{ gap: "15px" }}>
        <div className="d-flex align-items-center gap-2">
          <BsEnvelope className="text-muted fs-5" />
          <h1 className="h4 fw-semibold text-dark mb-0">
            Support Messages: {supportList.length}
          </h1>
        </div>
        <div className="position-relative">
          <BsSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
          <input
            type="text"
            className="form-control ps-5"
            placeholder="Search by name or message"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "250px" }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="fw-medium text-muted">User</th>
                  <th scope="col" className="fw-medium text-muted">Email</th>
                  <th scope="col" className="fw-medium text-muted">Message</th>
                  <th scope="col" className="fw-medium text-muted">Date</th>
                </tr>
              </thead>
              <tbody>
                {currentMessages.length > 0 ? (
                  currentMessages.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <CustomerOrderImage oImage={item} />
                          <div>
                            <div className="fw-medium text-dark text-nowrap">
                              {item?.userId?.fullName || item?.email || "Unknown User"}
                            </div>
                            <small className="text-muted">
                              {item?.userId?.phone || "No phone"}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td className="text-muted">{item?.name || "N/A"}</td>
                      <td className="text-muted" style={{ maxWidth: "300px" }}>
                        <BsChatDots className="me-1 text-primary" />
                        {item?.message || "No message"}
                      </td>
                      <td className="text-muted text-nowrap">{formatDate(item?.createdAt)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-muted">
                      No Support Messages Found
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
                Items {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredSupport.length)} of {filteredSupport.length}
              </small>
            </div>

            <div className="d-flex align-items-center gap-2 flex-wrap-reverse">
              <small className="text-muted text-nowrap">
                {currentPage} of {totalPages || 1} pages
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
                  disabled={currentPage === totalPages || totalPages === 0}
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
}
