"use client";

import Modal from "./layout";
import "./modal.css";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { AuthBtn } from "../AuthBtn/AuthBtn";
import SpinnerLoading from "../Spinner/SpinnerLoading";
import axios from "axios";
import { useRouter } from "next/navigation";

function AddBusCategory({ isOpen, onClose, btntitle, onSuccess }) {
  const [tag, setTag] = useState("");
  const [adminId, setAdminId] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const adminId = sessionStorage.getItem("adminId");
    if (adminId) {
      setAdminId(adminId);
    } else {
      router.replace("/super-admin/auth/login");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!tag.trim()) {
      setError("Please enter a category name");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}superAdmin/addBusinessCat`,
        {
          superAdminId: adminId,
          businessCatName: tag.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.data?.success) {
        toast.success(response?.data?.msg || "Category added successfully!");
        onSuccess();
        onClose();
      } else {
        toast.error(response?.data?.msg || "Invalid data received");
        setError(response?.data?.msg);
      }
    } catch (error) {
      setError(error?.response?.data?.message || error?.message);
    } finally {
      setIsLoading(false);
      setTag("");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="AddCategory_modal_body">
        <h3>Add Category</h3>

        <form>
          <div style={{ margin: "35px 0 40px" }}>
            <label className="mb-2">Category</label>
            <input
              type="text"
              className="form-control input_field2"
              value={tag}
              placeholder="Enter Category Name"
              onChange={(e) => setTag(e.target.value)}
            />
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <div className="sort_btn justify-content-end gap-2">
            <button
              type="button"
              className="themebtn4 green btn"
              onClick={() => {
                onClose();
                setTag("");
                setError(null);
              }}
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
    </Modal>
  );
}

export default AddBusCategory;
