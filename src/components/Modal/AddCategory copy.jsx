"use client";

import Modal from "./layout";
import "./modal.css";
import { RxCross2 } from "react-icons/rx";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AuthBtn } from "../AuthBtn/AuthBtn";
import SpinnerLoading from "../Spinner/SpinnerLoading";
import axios from "axios";

function AddCategory({ isOpen, onClose, btntitle, onSuccess }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]); // MULTIPLE
  const [tag, setTag] = useState(""); // selected categoryId from dropdown
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch categories when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchBusinessCategories();
    }
  }, [isOpen]);

  const fetchBusinessCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}admin/getSuperAdminWithoutId`
      );

      if (response?.data?.success && Array.isArray(response.data.data)) {
        const admins = response.data.data;

        // Extract categories from all admins
        let allCategories = [];

        admins.forEach((admin) => {
          if (Array.isArray(admin.categoryId)) {
            allCategories = [...allCategories, ...admin.categoryId];
          }
        });

        // Remove duplicates by _id
        const uniqueCategories = Array.from(
          new Map(allCategories.map((cat) => [cat._id, cat])).values()
        );

        setCategories(uniqueCategories);
      } else {
        toast.error("Failed to load categories");
      }
    } catch (error) {
      console.error("Fetch categories error:", error);
      toast.error("Error loading categories");
    }
  };


  // Add category to list
  const handleCategoryAdd = () => {
    if (!tag) return;

    if (!selectedCategories.includes(tag)) {
      setSelectedCategories([...selectedCategories, tag]); // Add categoryId
    } else {
      toast.error("Category already added");
    }

    setTag("");
  };

  // Remove tag
  const handleCategoryRemove = (categoryId) => {
    setSelectedCategories((prev) => prev.filter((id) => id !== categoryId));
  };

  // Submit categories
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const adminData = JSON.parse(sessionStorage.getItem("admin"));

    if (!selectedCategories.length) {
      setError("Please select at least one category");
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("adminId", adminData?._id);

      // 🔥 Backend expects STRINGIFIED ARRAY
      formData.append("categoryId", JSON.stringify(selectedCategories));

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}admin/updateAdmin`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
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
      setTag("");
    }
  };



  const handleClose = () => {
    onClose();
    setSelectedCategories([]);
    setTag("");
    setError(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      {success ? (
        <SpinnerLoading />
      ) : (
        <div className="AddCategory_modal_body">
          <div className="d-flex align-items-center justify-content-between">
            <h3>Add Categories</h3>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>

          <form>
            <div style={{ margin: "35px 0 40px", minHeight: "150px" }}>
              <label className="mb-2">Select Categories</label>

              <div className="d-flex align-items-center gap-2">
                <select
                  className="form-select input_field2"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                >
                  <option value="">Search Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.businessCatName}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  className="add_cat_btn"
                  onClick={handleCategoryAdd}
                  disabled={!tag}
                >
                  Add
                </button>
              </div>

              {/* Selected Tags */}
              <div className="d-flex my-3 flex-wrap" style={{ gap: 10 }}>
                {selectedCategories.map((catId) => {
                  const cat = categories.find((c) => c._id === catId);
                  return (
                    <div key={catId} className="tags_category">
                      {cat?.businessCatName}
                      <span
                        onClick={() => handleCategoryRemove(catId)}
                        style={{ marginLeft: 5, cursor: "pointer" }}
                      >
                        <RxCross2 />
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="sort_btn justify-content-end gap-2">
              <button type="button" className="themebtn4 green btn" onClick={handleClose}>
                Cancel
              </button>

              <AuthBtn
                title={btntitle}
                onClick={handleSubmit}
                location_btn="themebtn4 green btn"
                type="button"
                disabled={isLoading}
              />
            </div>
          </form>
        </div>
      )}
    </Modal>
  );
}

export default AddCategory;
