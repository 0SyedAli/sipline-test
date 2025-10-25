"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const TransactionHistory = () => {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [adminId, setAdminId] = useState("");

  // ✅ Load admin data first
  useEffect(() => {
    const adminData = sessionStorage.getItem("admin");

    if (!adminData) {
      router.replace("/auth/login");
      return;
    }

    try {
      const parsed = JSON.parse(adminData);
      if (parsed?._id) {
        setAdminId(parsed._id);
      } else {
        throw new Error("Invalid admin data");
      }
    } catch (err) {
      console.error("Error parsing admin data:", err);
      router.replace("/auth/login");
    }
  }, [router]);

  // ✅ Fetch transactions after adminId is set
  useEffect(() => {
    if (!adminId) return;

    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}admin/allOrdersByAdmin?adminId=${adminId}&page=${currentPage}&limit=10`
        );

        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const data = await res.json();

        if (data.success) {
          setTransactions(data.data || []);
          if (data.totalPages) setTotalPages(data.totalPages);
        } else {
          throw new Error(data.msg || "Failed to fetch transactions");
        }
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [adminId, currentPage]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // ✅ Loading state
  if (loading) {
    return (
      <div className="page">
        <div className="dash_head2">
          <h3>All Transactions</h3>
        </div>
        <div className="transaction_body mt-3 text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3">Loading transactions...</p>
        </div>
      </div>
    );
  }

  // ✅ Error state
  if (error) {
    return (
      <div className="page">
        <div className="dash_head2">
          <h3>All Transactions</h3>
        </div>
        <div className="transaction_body mt-3">
          <div className="alert alert-danger" role="alert">
            <h4>Error Loading Transactions</h4>
            <p>{error}</p>
            <button className="btn btn-primary mt-3" onClick={() => setCurrentPage(1)}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="dash_head2">
        <h3>All Transactions</h3>
      </div>

      <div className="transaction_body mt-3">
        {transactions.length === 0 ? (
          <div className="text-center py-5">
            <h5>No transactions found</h5>
            <p>{`You don't have any transactions yet.`}</p>
          </div>
        ) : (
          <>
            {transactions.map((transaction) => (
              <div key={transaction._id} className="transaction_item d-flex justify-content-between align-items-center">
                <div className="d-flex flex-column">
                  <h5>
                    {transaction.transactionStatus === "Approved"
                      ? `Received from ${transaction.userId?.fullName || "Customer"}`
                      : `Payment to ${transaction.userId?.fullName || "Customer"}`}
                  </h5>
                  <div className="d-flex align-items-center gap-3 text-muted">
                    <small>Date: {transaction.date || "N/A"}</small>
                    <small>Order ID: #{transaction.transactionId || "N/A"}</small>
                  </div>
                </div>
                <h3
                  className={
                    transaction.transactionStatus === "Approved" ? "text-success  mb-0" : "text-danger mb-0"
                  }
                >
                  {transaction.transactionStatus === "Approved" ? "+" : "-"}$
                  {Number(transaction.grandTotal || 0).toFixed(2)}
                </h3>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination justify-content-end mt-4">
                <button
                  className="btn btn-light me-1"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      className={`btn ${currentPage === page ? "btn-primary" : "btn-light"} mx-1`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  className="btn btn-light"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  &gt;
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
