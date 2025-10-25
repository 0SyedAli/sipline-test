'use client';

import Modal from "./layout";
import "./modal.css";
import { RxCross2 } from "react-icons/rx";
import { useState } from "react";
import { toast } from "react-toastify";
import { AuthBtn } from "../AuthBtn/AuthBtn";
import SpinnerLoading from "../Spinner/SpinnerLoading";
import axios from "axios";

function AddBusCategory({ isOpen, onClose, btntitle, onSuccess }) {
  const [tag, setTag] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCategoryAdd = () => {
    if (tag.trim()) {
      setSelectedCategory(tag.trim());
      setTag(""); // Clear input after adding
    }
  };

  const handleCategoryRemove = () => {
    setSelectedCategory("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null)
    const adminData = JSON.parse(sessionStorage.getItem("admin"));

    if (!selectedCategory) {
      setError("Please enter a category name");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}superAdmin/addBusinessCat`,
        {
          businessCatName: selectedCategory,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.data?.success === true) {
        toast.success(response?.data?.msg || "Category added successfully!");
        onSuccess(); // Notify parent
        setError(null)
        onClose();   // Close modal
      } else {
        toast.error(response?.data?.msg || "Invalid data received");
        setError(response?.data?.msg || "Invalid data received");
      }
    } catch (error) {
      setError(error?.response?.data?.message || error?.message);
    } finally {
      setIsLoading(false);
      setSelectedCategory("");
      setTag("");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {success ? (
        <SpinnerLoading />
      ) : (
        <div className="AddCategory_modal_body">
          <h3>Add Category</h3>
          <form>
            <div style={{ margin: "35px 0 40px", height: "150px" }}>
              <label className="mb-2">Category</label>
              <div className="d-flex align-items-center gap-2">
                <input
                  type="text"
                  className="form-control input_field2"
                  value={tag}
                  placeholder="Enter Category Name"
                  onChange={(e) => setTag(e.target.value)}
                />
                <button
                  type="button"
                  className="add_cat_btn"
                  onClick={handleCategoryAdd}
                  disabled={!tag.trim()}
                >
                  Add
                </button>
              </div>

              <div className="d-flex my-3 flex-wrap" style={{ gap: 10 }}>
                {selectedCategory && (
                  <div className="tags_category">
                    {selectedCategory}
                    <span
                      onClick={handleCategoryRemove}
                      style={{ marginLeft: 5, cursor: "pointer" }}
                    >
                      <RxCross2 />
                    </span>
                  </div>
                )}
              </div>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="sort_btn justify-content-end gap-2">
              <button
                onClick={() => {
                  onClose();
                  setSelectedCategory("");
                  setTag("");
                  setError(null);
                }}
                type="button"
                className="themebtn4 green btn"
              >
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

export default AddBusCategory;
