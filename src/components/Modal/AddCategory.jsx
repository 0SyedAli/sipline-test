"use client";

import Modal from "./layout";
import "./modal.css";
import { RxCross2 } from "react-icons/rx";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AuthBtn } from "../AuthBtn/AuthBtn";
import SpinnerLoading from "../Spinner/SpinnerLoading";
import axios from "axios";
import { MultiSelect } from "react-multi-select-component"; // FIXED IMPORT

function AddCategory({ isOpen, onClose, btntitle, onSuccess }) {
  const [categories, setCategories] = useState([]);
  const [existingCategories, setExistingCategories] = useState([]); // already assigned categories
  const [selectedCategories, setSelectedCategories] = useState([]); // NEW selections only
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load data when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchBusinessCategories();
      fetchAdminProfile();
    }
  }, [isOpen]);

  // 🔥 Fetch existing admin categoryId
  const fetchAdminProfile = async () => {
    try {
      const adminData = JSON.parse(sessionStorage.getItem("admin"));
      if (!adminData?._id) return;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}admin/adminProfile?adminId=${adminData._id}`
      );

      if (response?.data?.success) {
        const alreadyAssigned = response.data.data.categoryId.map(
          (cat) => cat._id
        );
        setExistingCategories(alreadyAssigned);
      }
    } catch (error) {
      console.error("Failed to fetch admin profile", error);
    }
  };

  // 🔥 Fetch all categories from superAdmins
  const fetchBusinessCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}admin/getSuperAdminWithoutId`
      );

      if (response?.data?.success && Array.isArray(response.data.data)) {
        const admins = response.data.data;

        let allCategories = [];

        admins.forEach((admin) => {
          if (Array.isArray(admin.categoryId)) {
            allCategories = [...allCategories, ...admin.categoryId];
          }
        });

        // remove duplicate by _id
        const unique = Array.from(
          new Map(allCategories.map((cat) => [cat._id, cat])).values()
        );

        setCategories(unique);
      } else {
        toast.error("Failed to load categories");
      }
    } catch (error) {
      console.error("Fetch categories error:", error);
      toast.error("Error loading categories");
    }
  };

  // 🔥 Only show NEW categories in MultiSelect
  const formattedCategories = categories
    .filter((cat) => !existingCategories.includes(cat._id)) // hide existing
    .map((cat) => ({
      label: cat.businessCatName,
      value: cat._id,
    }));

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const adminData = JSON.parse(sessionStorage.getItem("admin"));

    if (!selectedCategories.length) {
      setError("Please select at least one category");
      setIsLoading(false);
      return;
    }

    const selectedIds = selectedCategories.map((item) => item.value);

    try {
      const payload = {
        adminId: adminData?._id,
        categoryIds: selectedIds,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}admin/addOrRemoveCategory`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.data?.success === true) {
        toast.success(response?.data?.msg || "Categories added successfully!");
        onSuccess();
        onClose();
      } else {
        toast.error(response?.data?.msg || "Invalid data received");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Request failed");
    } finally {
      setIsLoading(false);
      setSelectedCategories([]);
      setError(null);
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedCategories([]);
    setError(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="AddCategory_modal_body">
        <div className="d-flex align-items-center justify-content-between">
          <h3>Add Categories</h3>
          <button type="button" className="btn-close" onClick={handleClose}></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ margin: "35px 0 40px" }}>
            <label className="mb-2">Select Categories</label>

            <MultiSelect
              options={formattedCategories}
              value={selectedCategories}
              onChange={setSelectedCategories}
              labelledBy="Select Categories"
              className="multi-select-custom"
            />
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <div className="sort_btn justify-content-end gap-2">
            <button
              type="button"
              className="themebtn4 green btn"
              onClick={handleClose}
            >
              Cancel
            </button>

            <AuthBtn
              title={btntitle}
              location_btn="themebtn4 green btn"
              type="submit"
              disabled={isLoading}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default AddCategory;
