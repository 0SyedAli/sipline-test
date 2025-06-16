"use client";
import InputField from "../Form/InputField";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { AuthBtn } from "../AuthBtn/AuthBtn";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import SpinnerLoading from "../Spinner/SpinnerLoading";
const uploadImg = "/images/solar_upload-linear.png";
export const AddNewProduct = ({ title, btntitle }) => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const [isLoading, setIsLoading] = useState(false); // Loading state
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
  const router = useRouter();
  useEffect(() => {
    const adminData = JSON.parse(sessionStorage.getItem("admin")); // Parse user from localStorage
    if (adminData._id) {
      setAdminId(adminData._id); // Set adminId if available
    } else {
      console.error("User not found or missing 'id' property");
      router.push("/auth/add-services"); // Redirect to add services if user is invalid
    }
  }, [router]); // Runs once on mount
  useEffect(() => {
    if (adminId) {
      fetchCategory();
    }
  }, [adminId]); // Runs when adminId changes

  const fetchCategory = async () => {
    try {
      setLoading(true); // Start loading
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/AllCategoriesByAdmin?adminId=${adminId}`
      );

      if (response?.data?.success) {
        const categories = response?.data?.data || []; // Ensure it's an array
        setCategory(categories);
        toast.success("Categories fetched successfully!");
      } else {
        console.error("Failed to fetch categories:", response?.data?.msg);
        toast.error("Failed to fetch categories.");
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast.error("Failed to fetch categories.");
    } finally {
      setLoading(false); // Stop loading
    }
  };


  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setProductImages(files);

    // Generate preview URLs
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previewUrls);
  };
  const handleSubServiceSubmit = async (e) => {
    e.preventDefault();
    if (!adminId || !productName || !stockQuantity || !discount || !price || !category || !brandName) {
      alert("Please fill all subservice fields.");
      return;
    }

    const formData = new FormData();
    formData.append("adminId", adminId);
    formData.append("name", productName);
    formData.append("StockQuantity", stockQuantity);
    formData.append("discount", discount);
    formData.append("price", price);
    formData.append("category", categoryId);
    formData.append("brandName", brandName);
    // Append all images
    productImages.forEach((file) => {
      formData.append("ProductImages", file);
    });
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/addProduct`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data?.success) {
        setSuccess(true);
        toast.success(response?.data?.msg || "Signup successful!");
        setError(null);
        setProductName("");
        setStockQuantity("");
        setDiscount("");
        setPrice("");
        setCategoryId([]);
        setBrandName("");
        setProductImages([]);
        setPreviewImages([]);
         if (fileInputRef.current) {
                    fileInputRef.current.value = ""; // Reset the file input value
                }
      }
    } catch (error) {
      // Handle validation or request errors
      setError(error?.response?.data?.msg || error?.message);
      toast.error(response?.data?.msg || "Signup successful!");
      setSuccess(false);
      setIsLoading(false); // Re-enable button on error
    } finally {
      setIsLoading(false);
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
          <div className="row">
            <div className="col-6">
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
            <div className="col-6">
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
            <div className="col-6">
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
            <div className="col-6">
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
            <div className="col-6">
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
            <div className="col-6">
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
          <div className="product_bottom">
            <AuthBtn title={btntitle} onClick={handleSubServiceSubmit} location_btn="themebtn4 green btn" type="submit" disabled={isLoading} />
          </div>
        </form>
      )}

    </div>
  );
};
