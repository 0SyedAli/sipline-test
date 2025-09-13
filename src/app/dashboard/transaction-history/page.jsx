"use client"
import React, { useState, useEffect } from 'react';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // API endpoint and admin ID
  const adminId = "68a8a83a1de16a26e5d3ef32";
  const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}admin/allOrdersByAdmin?adminId=${adminId}&page=${currentPage}&limit=10`;

  // Fetch transactions from API
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setTransactions(data.data);
        // If your API returns pagination info, set it here
        // setTotalPages(data.totalPages);
      } else {
        throw new Error(data.msg || 'Failed to fetch transactions');
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [currentPage]);

  // Format date function
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="page">
        <div className="dash_head2">
          <h3>All Transactions</h3>
        </div>
        <div className="transaction_body mt-3">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading transactions...</p>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="page">
        <div className="dash_head2">
          <h3>All Transactions</h3>
        </div>
        <div className="transaction_body mt-3">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error Loading Transactions</h4>
            <p>{error}</p>
            <button 
              className="btn btn-primary mt-3"
              onClick={fetchTransactions}
            >
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
              <div key={transaction._id} className="transaction_item">
                <div className="d-flex flex-column">
                  <h5>
                    {transaction.transactionStatus === 'Approved' 
                      ? `Received from ${transaction.userId?.fullName || 'Customer'}` 
                      : `Payment to ${transaction.userId?.fullName || 'Customer'}`
                    }
                  </h5>
                  <div className="d-flex align-items-center gap-3">
                    <h6>{transaction.date}</h6>
                    <h6>Order ID : #{transaction.transactionId}</h6>
                  </div>
                </div>
                <h3 className={transaction.transactionStatus === 'Approved' ? 'text-success' : 'text-danger'}>
                  {transaction.transactionStatus === 'Approved' ? '+' : '-'}${transaction.grandTotal.toFixed(2)}
                </h3>
              </div>
            ))}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination justify-content-end mt-4">
                <button 
                  className={currentPage === 1 ? 'disabled' : ''}
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
                      className={currentPage === page ? 'active' : ''}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button 
                  className={currentPage === totalPages ? 'disabled' : ''}
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