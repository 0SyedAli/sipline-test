"use client";
import CategoryCards from "@/components/CategoryCards";
import Filter from "@/components/Modal/Filter";
import AreYouSure from "@/components/notificationModalCont/AreYouSure";
import ProductCards from "@/components/ProductCards";
import { useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from 'react-redux';
const productImagePlaceholder = "/images/category-image.jpg";

const ManageProduct = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [adminId, setAdminId] = useState("");
  const [activeTab, setActiveTab] = useState("products");
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const refreshKey = useSelector((state) => state.refresh.refreshKey);
  const router = useRouter();

  useEffect(() => {
    const adminData = JSON.parse(sessionStorage.getItem("admin"));
    if (adminData?._id) {
      setAdminId(adminData._id);
    } else {
      console.error("Admin not found or missing '_id' property");
      router.push("/auth/add-services");
    }
  }, [router]);

  useEffect(() => {
    if (adminId) {
      fetchData();
    }
  }, [adminId, refreshKey]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    await Promise.all([getProducts(), getCategories()]);
    setLoading(false);
  };

  const getProducts = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("Authentication details missing. Please log in again.");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}admin/getAllProducts?adminId=${adminId}`
      );
      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
        toast.success("Products fetched successfully!");
      } else {
        throw new Error(data.msg || "Failed to fetch products.");
      }
    } catch (err) {
      handleError(err, "Failed to load products.");
    }
  };

  const getCategories = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("Authentication details missing. Please log in again.");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}admin/AllCategoriesByAdmin?adminId=${adminId}`
      );
      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
        // setTimeout(() => {
        //   toast.success("Categories fetched successfully!");
        // }, 3000)
      } else {
        throw new Error(data.msg || "Failed to fetch categories.");
      }
    } catch (err) {
      handleError(err, "Failed to load categories.");
    }
  };

  const handleError = (err, defaultMessage) => {
    const message = err?.message || defaultMessage;
    setError(message);
    toast.error(message);
    console.error(message);
  };

  const deleteCategory = async (catId) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}admin/deleteCategory?categoryId=${catId}`
      );
      if (response?.data?.success) {
        toast.success("Category deleted successfully");
        getCategories();
      } else {
        throw new Error(response?.data?.msg || "Failed to delete category");
      }
    } catch (err) {
      handleError(err, "Error deleting category.");
    }
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete);
      setCategoryToDelete(null);
    }
  };

  const renderProducts = () => {
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (products.length === 0) return <p>No products found.</p>;

    return (
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 row-cols-lg-5 g-3">
        {products.map((product) => (
          <div className="col" key={product._id}>
            <ProductCards
              name={product.name}
              price={product.price}
              stockQuantity={product.StockQuantity}
              btntitle="Update"
              image={product.productImages?.[0]
                ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${product.productImages[0]}`
                : "/images/default-product.png"}
              productId={product._id}
            />
          </div>
        ))}
      </div>
    );
  };

  const renderCategories = () => {
    if (categories.length === 0) return <p>No categories found.</p>;

    return (
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 row-cols-lg-5 g-3">
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
                <h4 className="my-3">{category.categoryName}</h4>
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
          <h3>Manage Product</h3>
          <div className="tabs mo_tabs">
            {/* {activeTab === "products" && <button type="button" onClick={onOpen}>Filter</button>} */}
            <button
              className={activeTab === "products" ? "active" : ""}
              onClick={() => setActiveTab("products")}
            >
              Products
            </button>
            <button
              className={activeTab === "categories" ? "active" : ""}
              onClick={() => setActiveTab("categories")}
            >
              Categories
            </button>
          </div>
        </div>
        <Filter btntitle="Filter" isOpen={isOpen} onClose={onClose} />
        <div className="manage_order_body">
          {activeTab === "products" ? renderProducts() : renderCategories()}
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

export default ManageProduct;
