'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import "react-toastify/dist/ReactToastify.css";
import "./user.css";
import { toast, ToastContainer } from "react-toastify";
const DeleteAccount = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email || !password) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (!confirmDelete) {
      toast.error('Please confirm that you understand this action is permanent.');
      return;
    }

    // Show confirmation dialog
    setShowConfirmDialog(true);
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    setShowConfirmDialog(false);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}user/RequestDeleteAccount`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.succesS) {
        // Account deletion request successful
        toast.success('Account deletion request submitted. You will receive a confirmation email shortly.');
        // Redirect to home page
        router.push('/');
      } else {
        toast.error(data.msg || 'Failed to delete account. Please try again.');
      }
    } catch (err) {
      console.error('Error deleting account:', err);
      toast.error('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
         <ToastContainer />


      <nav className="navbar">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center flex-column flex-sm-row w-100">
            <a href="https://thesipline.com" className="nav-link">HOME</a>
            <a className="navbar-brand" href='https://thesipline.com'>
              <Image src="/images/dashLogo.png" width={80} height={80} alt='' />
            </a>
            <a href="#!" className="nav-link">SUBSCRIBE FOR UPDATES</a>
          </div>
        </div>
      </nav>

      <div className="container mt-5">
        <div className="form-container">
          <div className="text-center">
            <h1 className="main-heading">Delete Account</h1>
            <p className="subtitle">This action cannot be undone. All your data will be permanently removed.</p>
          </div>

          <div className="warning-box">
            <div className="warning-title">⚠️ Warning</div>
            <p className="warning-text">
              Deleting your account will permanently remove all your personal information,
              preferences, and account history. This action cannot be reversed.
            </p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                checked={confirmDelete}
                onChange={(e) => setConfirmDelete(e.target.checked)}
                required
                disabled={isLoading}
                id="confirmDelete"
              />
              <label className="form-check-label" htmlFor="confirmDelete">
                I understand that this action is permanent and cannot be undone
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-delete"
              disabled={!confirmDelete || isLoading}
            >
              {isLoading ? 'Processing...' : 'DELETE ACCOUNT PERMANENTLY'}
            </button>
          </form>

          <div className="text-center">
            <a href="https://thesipline.com" className="cancel-link">Cancel and go back to home</a>
          </div>

          <div className="text-center footer-text">
            This site is protected by reCAPTCHA and the Google
            <a href="https://thesipline.com/privacy-policy" className="footer-link"> Privacy Policy</a> and
            <a href="https://thesipline.com/term-and-condition" className="footer-link"> Terms of Service</a> apply.
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Are you absolutely sure?</h3>
            <p className="modal-text">
              This action cannot be undone. This will permanently delete your account
              and remove all your data from our servers.
            </p>
            <div className="modal-buttons">
              <button
                className="btn-cancel"
                onClick={() => setShowConfirmDialog(false)}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                className="btn-confirm"
                onClick={handleDeleteAccount}
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Yes, delete my account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteAccount;