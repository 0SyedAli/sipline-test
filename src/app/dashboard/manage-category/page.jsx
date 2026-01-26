"use client";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import AreYouSure from "@/components/notificationModalCont/AreYouSure";

const productImagePlaceholder = "/images/cat_image.webp";
const ManageCategory = () => {
  const [categories, setCategories] = useState([]);
  const [adminId, setAdminId] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const refreshKey = useSelector((state) => state.refresh.refreshKey);

  useEffect(() => {
    const adminData = JSON.parse(sessionStorage.getItem("admin"));
    if (adminData?._id) {
      setAdminId(adminData._id);
    } else {
      console.error("Admin not found or missing '_id' property");
    }
  }, []);

  useEffect(() => {
    if (adminId) getCategories();
  }, [adminId, refreshKey]);

  const getCategories = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("Authentication details missing. Please log in again.");

      const response = await fetch(
        // `${process.env.NEXT_PUBLIC_SERVER_URL}admin/AllCategoriesByAdmin?adminId=${adminId}`
        `${process.env.NEXT_PUBLIC_SERVER_URL}admin/adminProfile?adminId=${adminId}`
      );
      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();
      if (data.success) {
        setCategories(data?.data?.categoryId);
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

  const deleteCategory = async (catId) => {
    try {
      const payload = {
        adminId: adminId,
        categoryIds: [catId],  // <-- MUST be an array
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}admin/addOrRemoveCategory`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response?.data?.success) {
        toast.success("Category deleted successfully");
        getCategories();
      } else {
        throw new Error(response?.data?.msg || "Failed to delete category");
      }
    } catch (err) {
      const message = err?.message || "Error deleting category.";
      toast.error(message);
    }
  };


  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete);
      setCategoryToDelete(null);
    }
  };

  const renderCategories = () => {
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (categories.length === 0) return <p>No categories found.</p>;

    return (
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xxl-5 g-3">
        {categories.map((category) => (
          <div className="col" key={category._id}>
            <div className="product_card">
              <Image
                width={255}
                height={100}
                className="product_image"
                style={{ height: "100px" }}
                src={productImagePlaceholder}
                alt="category image"
              />
              <div className="text-center mt-3">
                <h4 className="my-3">{category.businessCatName}</h4>
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
    );
  };

  return (
    <>
      <div className="page">
        <div className="manage_order_head">
          <h3>Manage Categories</h3>
        </div>
        <div className="manage_order_body">{renderCategories()}</div>
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
