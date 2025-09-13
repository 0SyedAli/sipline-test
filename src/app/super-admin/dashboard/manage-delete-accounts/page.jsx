'use client';

import ShopImage from '@/components/superAdmin/ShopImage';
import { useState, useEffect } from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import './manage-delete.css'
const DeleteAccountRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch all delete account requests
  const fetchDeleteRequests = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}superAdmin/getAllRequests`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setRequests(data.data || []);
      } else {
        throw new Error(data.msg || 'Failed to fetch delete requests');
      }
    } catch (err) {
      console.error('Error fetching delete requests:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeleteRequests();
  }, []);

  // Update request status (confirm deletion)
  const updateRequestStatus = async (requestId, status) => {
    try {
      setUpdatingId(requestId);
      setError('');
      setSuccessMessage('');

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}superAdmin/updateDeleteAccountRequest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId,
          status
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage('Request status updated successfully');
        // Refresh the list
        fetchDeleteRequests();
      } else {
        throw new Error(data.msg || 'Failed to update request status');
      }
    } catch (err) {
      console.error('Error updating request status:', err);
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  // Format date if available
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (err) {
      return dateString;
    }
  };

  // Get status badge class
  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'status-badge status-pending';
      case 'deleted':
        return 'status-badge status-deleted';
      default:
        return 'status-badge';
    }
  };

  return (
    <div className="page-container">


      <div className="page-header">
        <h1 className="page-title mb-0">Delete Account Requests</h1>
        <button
          className="refresh-btn"
          onClick={fetchDeleteRequests}
          disabled={loading}
        >
          {loading ? <span className="loading-spinner"></span> : '↻'}
          Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success">
          {successMessage}
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <span className="loading-spinner" style={{ width: '24px', height: '24px' }}></span>
          <p>Loading delete requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="empty-state">
          <p>No delete account requests found.</p>
        </div>
      ) : (
        <div className="card">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="fw-medium text-muted">
                      User Name
                    </th>
                    <th scope="col" className="fw-medium text-muted">
                      User Email
                    </th>
                    <th scope="col" className="fw-medium text-muted">
                      Phone
                    </th>
                    <th scope="col" className="fw-medium text-muted">
                      Date of Birth
                    </th>
                    <th scope="col" className="fw-medium text-muted">
                      Status
                    </th>
                    <th scope="col" className="fw-medium text-muted">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request._id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <ShopImage shop={request?.userId} />
                          <div>
                            <div className="fw-medium text-dark text-nowrap">{request?.userId?.fullName || "Unknown Bar"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-muted ">
                        {request.userId?.email || 'N/A'}
                      </td>
                      <td className="text-muted ">
                        {request.userId?.phone || 'N/A'}
                      </td>
                     
                      <td className="text-muted  text-nowrap">{request.userId?.DOB ? formatDate(request.userId.DOB) : 'N/A'}</td>
                       <td>
                        <div className="d-flex align-items-center gap-2">
                          <span className={`${getStatusClass(request.status)} py-1 px-3`}
                          >{request.status}</span>
                        </div>
                      </td>
                      <td>
                        <button
                          className="action-btn btn-confirm"
                          onClick={() => updateRequestStatus(request._id, 'deleted')}
                          disabled={request.status === 'deleted' || updatingId === request._id}
                        >
                          {updatingId === request._id ? (
                            <span className="loading-spinner"></span>
                          ) : (
                            'Confirm Deletion'
                          )}
                        </button>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* <div className="d-flex justify-content-between align-items-start p-3 bottom_pagination border-top gap-3">
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
            </div> */}
          </div>
        </div>
      )
      }
    </div >
  );
};

export default DeleteAccountRequests;