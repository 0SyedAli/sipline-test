"use client";
import AreYouSure from "@/components/notificationModalCont/AreYouSure";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const productImagePlaceholder = "/images/category-image.jpg";

const ManageCategory = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const refreshKey = useSelector((state) => state.refresh.refreshKey);

  // ✅ Moved getCategories outside useEffect
  const getCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}superAdmin/getAllbusinessCategories`
      );
      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      } else {
        throw new Error(data.msg || "Failed to fetch categories.");
      }
    } catch (err) {
      const message = err?.message || "Failed to load categories.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, [refreshKey]);

  const deleteCategory = async (catId) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}superAdmin/deleteBusinessCat?categoryId=${catId}`
      );
      if (response?.data?.success) {
        toast.success("Category deleted successfully");
        getCategories(); // ✅ Now works because function is in scope
      } else {
        throw new Error(response?.data?.msg || "Failed to delete category");
      }
    } catch (err) {
      const message = err?.message || "Error deleting category.";
      setError(message);
      toast.error(message);
    }
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete);
      setCategoryToDelete(null);
    }
  };

  return (
    <>
      <div className="page">
        <div className="manage_order_head">
          <h3>Manage Categories</h3>
        </div>

        <div className="manage_order_body">
          {loading && <p>Loading...</p>}
          {error && <p className="text-danger">{error}</p>}
          {!loading && categories.length === 0 && <p>No categories found.</p>}

          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xxl-5 g-3">
            {categories.map((category) => (
              <div className="col" key={category._id}>
                <div className="product_card">
                  <Image
                    width={255}
                    height={200}
                    className="product_image"
                    src={productImagePlaceholder}
                    alt="category image"
                  />
                  <div className="text-center mt-3">
                    <h4 className="my-3">{category?.businessCatName}</h4>
                    <button
                      className="button_detele"
                      type="button"
                      data-bs-toggle="modal"
                      data-bs-target="#areyousure"
                      onClick={() => setCategoryToDelete(category._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AreYouSure
        onConfirm={handleConfirmDelete}
        onCancel={() => setCategoryToDelete(null)}
        title="Delete Category"
        message="Are you sure you want to delete this category?"
      />
    </>
  );
};

export default ManageCategory;
