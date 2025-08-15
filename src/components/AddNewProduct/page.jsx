"use client";
import InputField from "../Form/InputField";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { AuthBtn } from "../AuthBtn/AuthBtn";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import SpinnerLoading from "../Spinner/SpinnerLoading";
import * as yup from "yup";
const uploadImg = "/images/solar_upload-linear.png";

const validationSchema = yup.object().shape({
  productName: yup.string().required("Product name is required"),
  stockQuantity: yup
    .number()
    .required("Stock quantity is required")
    .positive("Stock quantity must be a positive number"),
  discount: yup
    .number()
    .required("Discount is required")
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot exceed 100%"),
  price: yup
    .number()
    .required("Price is required")
    .positive("Price must be a positive number"),
  categoryId: yup.string().required("Category is required"),
  brandName: yup.string().required("Brand name is required"),
});


export const AddNewProduct = ({ title, btntitle }) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false); // Category fetch loading
  const [isLoading, setIsLoading] = useState(false); // Form submission loading
  const [previewImages, setPreviewImages] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [productName, setProductName] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [discount, setDiscount] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [category, setCategory] = useState([]);
  const [brandName, setBrandName] = useState("");
  const [adminId, setAdminId] = useState("");

  const fileInputRef = useRef(null);
  const refreshKey = useSelector((state) => state.refresh.refreshKey);
  const router = useRouter();

  // Fetch admin data
  useEffect(() => {
    const adminData = JSON.parse(sessionStorage.getItem("admin"));
    if (adminData?._id) {
      setAdminId(adminData._id);
    } else {
      toast.error("Invalid admin data. Redirecting...");
      // router.push("/auth/add-services");
    }
  }, [router]);

  // Fetch categories
  useEffect(() => {
    if (adminId) {
      fetchCategory();
    }
  }, [adminId, refreshKey]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}admin/AllCategoriesByAdmin?adminId=${adminId}`
      );

      if (response?.data?.success) {
        setCategory(response.data.data || []);
        toast.success("Categories fetched successfully!");
      } else {
        toast.error(response?.data?.msg || "Failed to fetch categories.");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred while fetching categories.");
    } finally {
      setLoading(false);
    }
  };

  // Handle image file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setProductImages(files);
    setPreviewImages(files.map((file) => URL.createObjectURL(file)));
  };

  // Handle form submission
  const handleAddProductSubmit = async (e) => {
    e.preventDefault();

    // Validate form data with yup
    try {
      await validationSchema.validate({
        productName,
        stockQuantity,
        discount,
        price,
        categoryId,
        brandName,
      });

      const formData = new FormData();
      formData.append("adminId", adminId);
      formData.append("name", productName);
      formData.append("StockQuantity", stockQuantity);
      formData.append("discount", discount);
      formData.append("price", price);
      formData.append("category", categoryId);
      formData.append("brandName", brandName);
      productImages.forEach((file) => formData.append("ProductImages", file));

      setIsLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}admin/addProduct`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data?.success) {
        toast.success(response.data.msg || "Product added successfully!");
        setError("");
        resetForm();
      } else {
        toast.error(response.data?.msg || "Failed to add product.");
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "An error occurred during submission.");
      setError(err.response?.data?.msg || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setProductName("");
    setStockQuantity("");
    setDiscount("");
    setPrice("");
    setCategoryId("");
    setBrandName("");
    setProductImages([]);
    setPreviewImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="add_new_product">
      {loading ? <SpinnerLoading /> : (
        <form action="/">
          <div className="row mb-3">
            <div className="col-12">
              <div className="auth_upload_bussiness_logo">
                <div className={`upload_btn bg-light d-flex flex-column align-items-center justify-content-center text-center rounded`}
                >
                  <Image width={22} height={22} src={uploadImg} alt="" prefix="none" loading="lazy" />
                  <label htmlFor={`file_abs`} className="">
                    <a className="">Choose File</a> to upload
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <p>JPG, PNG.</p>
                </div>
                {previewImages.length >= 1 && (
                  <div className="d-flex align-items-center gap-2 flex-wrap my-3">
                    {previewImages.map((src, index) => (
                      <Image
                        key={index}
                        src={src}
                        width={100}
                        height={100}
                        alt={`Preview ${index + 1}`}
                        className="preview-thumbnail"
                        prefix="none"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="row gx-2 gx-md-4">
            <div className="col-12 col-sm-6">
              <label htmlFor="name">Name</label>
              <InputField
                type="text"
                placeholder="Orange Juice"
                id="name"
                classInput="classInput"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <div className="col-12 col-sm-6">
              <label htmlFor="stock">Stock Quantity</label>
              <InputField
                type="number"
                placeholder="45"
                id="stock"
                classInput="classInput"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
              />
            </div>
            <div className="col-12 col-sm-6">
              <label htmlFor="discount">Set Discount</label>
              <InputField
                type="number"
                placeholder="%"
                id="discount"
                classInput="classInput"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>
            <div className="col-12 col-sm-6">
              <label htmlFor="price">Price</label>
              <InputField
                type="text"
                placeholder="$500"
                id="price"
                classInput="classInput"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="col-12 col-sm-6">
              <label htmlFor="category">Category</label>
              <select
                className="form-select my-2 input_field"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                aria-label="Search Category"
              >
                <option value="" defaultValue>
                  Category Name
                </option>
                {Array.isArray(category) && category.map((cat, index) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12 col-sm-6">
              <label htmlFor="brand">Brand Name</label>
              <InputField
                type="text"
                placeholder="Jack Daniel"
                id="brand"
                classInput="classInput"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
              />
            </div>
          </div>
          <div className="product_bottom flex-column">
            {error && <p style={{ color: "red" }}>{error}</p>}
            <AuthBtn title={btntitle} onClick={handleAddProductSubmit} location_btn="themebtn4 green btn" type="submit" disabled={isLoading} />
          </div>
        </form>
      )}

    </div>
  );
};
