"use client";
import InputField from "../Form/InputField";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { AuthBtn } from "../AuthBtn/AuthBtn";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import SpinnerLoading from "../Spinner/SpinnerLoading";
const uploadImg = "/images/solar_upload-linear.png";

export const EditProduct = ({ btntitle, onClose, productId }) => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [productName, setProductName] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [discount, setDiscount] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [products, setProducts] = useState("");
  const [category, setCategory] = useState([]);
  const [brandName, setBrandName] = useState("");
  const [adminId, setAdminId] = useState("");
  const router = useRouter();

  useEffect(() => {
    const adminData = JSON.parse(sessionStorage.getItem("admin"));
    if (adminData._id) {
      setAdminId(adminData._id);
    } else {
      console.error("User not found or missing 'id' property");
      // router.push("/auth/add-services");
    }
  }, [router]);

  useEffect(() => {
    if (adminId) {
      fetchCategory();
      if (productId) { // Only fetch product details if productId exists
        fetchProductDetails();
      }
    }
  }, [adminId, productId]); // Add productId to dependency array

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}admin/AllCategoriesByAdmin?adminId=${adminId}`
      );

      if (response?.data?.success) {
        setCategory(response?.data?.data || []);
        setTimeout(() => {
          toast.success("Categories fetched successfully!");
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast.error("Failed to fetch categories.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProductDetails = async () => {
    try {
      setLoading3(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}admin/getProductById?productId=${productId}`
      );

      if (response?.data?.success) {
        const product = response.data.data;
        // Pre-fill form with existing product data
        setProductName(product.name);
        setStockQuantity(product.StockQuantity);
        setDiscount(product.discount);
        setPrice(product.price);
        setCategoryId(product.category?._id || "");
        setBrandName(product.brandName || "");

        // Set existing images if available
        if (product.productImages?.length > 0) {
          setPreviewImages(
            product.productImages.map(
              img => `${process.env.NEXT_PUBLIC_IMAGE_URL}${img}`
            )
          );
        }

        toast.success("Product details loaded!");
      }
    } catch (error) {
      console.error("Failed to fetch product:", error);
      toast.error("Failed to load product details.");
    } finally {
      setLoading3(false);
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
    if (!productName || !stockQuantity || !discount || !price || !category || !brandName) {
      alert("Please fill all subservice fields.");
      return;
    }

    const formData = new FormData();
    formData.append("productId", productId);
    // Only append fields that have values
    if (productName) formData.append("name", productName);
    if (stockQuantity) formData.append("StockQuantity", stockQuantity);
    if (discount) formData.append("discount", discount);
    if (price) formData.append("price", price);
    if (categoryId) formData.append("category", categoryId);
    if (brandName) formData.append("brandName", brandName);

    // Only append images if new ones were selected
    if (productImages && productImages.length > 0) {
      productImages.forEach((file) => {
        formData.append("ProductImages", file);
      });
    }
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}admin/updateProduct`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data?.success) {
        setSuccess(true);
        onClose();
        toast.success(response?.data?.msg || "Signup successful!");
        setError(null);
      }
    } catch (error) {
      // Handle validation or request errors
      setError(error?.response?.data?.msg || error?.message);
      setSuccess(false);
      setIsLoading(false); // Re-enable button on error
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <div className="add_new_product">
      {/* Multiple FileUpload Components */}
      {/* <FileUpload
        title={title}
        state={files}
        setState={setFiles}
        handleFiles={handleFiles}
      /> */}


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
            {/* <div className="col-6">
              <label htmlFor="category">Product</label>
              <select
                className="form-select my-2 input_field"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                aria-label="Search Category"
              >
                <option value="" defaultValue>
                  Product Name
                </option>
                {Array.isArray(products) && products.map((product, index) => (
                  <option key={product._id} value={product._id}>
                    {product?.name}
                  </option>
                ))}
              </select>
            </div> */}
          </div>
          <div className="product_bottom">
            <AuthBtn title={btntitle} onClick={handleSubServiceSubmit} location_btn="themebtn4 green btn" type="submit" disabled={isLoading} />
          </div>
        </form>
      )}

    </div>
  );
};
