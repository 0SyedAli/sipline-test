"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import FeatureImage from "./FeatureImage";
import { toast } from "react-toastify";

export default function FeaturesComponent() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [description, setDescription] = useState("");
  const [featureType, setFeatureType] = useState("");
  const [adminId, setAdminId] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedShopId, setSelectedShopId] = useState(""); // Vendor shop ID
  const fileInputRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 🔥 Load Vendor Shop Automatically
  useEffect(() => {
    const adminData = JSON.parse(sessionStorage.getItem("admin"));

    if (adminData?._id || adminData?.shopId?._id) {
      const shopId = adminData.shopId._id;
      setAdminId(adminData?._id);
      setSelectedShopId(shopId);
      fetchProductsForVendor(shopId);
    }
  }, []);

  // 🔥 Fetch Products for Vendor Shop
  const fetchProductsForVendor = async (shopId) => {
    try {
      const shopRes = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}superAdmin/getShopById?shopId=${shopId}`
      );
      const shopData = await shopRes.json();

      if (shopData.success && shopData.data?.adminId) {
        const adminId =
          typeof shopData.data.adminId === "object"
            ? shopData.data.adminId._id
            : shopData.data.adminId;

        const productRes = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}admin/getAllProducts?adminId=${adminId}`
        );
        const productData = await productRes.json();

        setProducts(productData.success ? productData.data : []);
      }
    } catch (err) {
      console.error("Error loading vendor products", err);
    }
  };

  // 🔥 Fetch all features (Vendor-only view)
  const fetchFeatures = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}superAdmin/getAllFeatures`
      );
      const data = await response.json();

      if (data.success) {
        // Only show vendor shop features
        const filtered = data.data.filter(
          (f) => f?.shopId?._id === selectedShopId
        );
        setFeatures(filtered);
      }
    } catch (error) {
      console.error("Error fetching features:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchFeatures();
  }, [])
  useEffect(() => {
    if (selectedShopId) fetchFeatures();
  }, [selectedShopId]);

  // 🔥 Handle Image Upload
  const handleImageSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 🔥 Submit Feature (Vendor Flow)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedImage || !description.trim()) {
      return toast.error("Please fill all fields and select an image.");
    }

    try {
      setSubmitting(true);

      const formData = new FormData();

      formData.append("adminId", adminId);
      formData.append("description", description);
      formData.append("Banner", selectedImage);
      formData.append("shopId", selectedShopId); // Vendor shop ALWAYS included

      if (featureType === "Product") {
        if (!selectedProductId) return toast.error("Please select a product.");
        formData.append("productId", selectedProductId);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}superAdmin/createFeature`,
        { method: "POST", body: formData }
      );

      const result = await response.json();

      if (result.success) {
        toast.success("Feature created successfully!");
        setDescription("");
        setSelectedImage(null);
        setImagePreview(null);
        setFeatureType("");
        setSelectedProductId("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchFeatures();
      } else {
        toast.error("Failed: " + result.msg);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error creating feature");
    } finally {
      setSubmitting(false);
    }
  };

  // 🔥 Toggle Status
  const toggleFeatureStatus = async (featureId, currentStatus) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}superAdmin/updateFeature`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ featureId, isActive: !currentStatus }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setFeatures((prev) =>
          prev.map((f) =>
            f._id === featureId ? { ...f, isActive: !currentStatus } : f
          )
        );
        toast.success("IsFeatured Status is On")
      } else {
        toast.error("Failed: " + data.msg);
      }
    } catch {
      toast.error("Error updating status");
    }
  };

  // 🔥 Delete
  const deleteFeature = async (featureId) => {
    if (!confirm("Are you sure?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}superAdmin/deleteFeature`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ featureId }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setFeatures((prev) => prev.filter((f) => f._id !== featureId));
        toast.success("Feature deleted!");
      } else {
        toast.error("Failed: " + data.msg);
      }
    } catch {
      toast.error("Error deleting feature");
    }
  };

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFeatures = features.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(features.length / itemsPerPage);

  return (
    <div className="py-4">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Features Management (Vendor)</h2>

          {/* CREATE FEATURE FORM */}
          <div className="card mb-4">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row gy-3">

                  {/* IMAGE UPLOAD */}
                  <div className="col-md-4">
                    <div
                      className="upload-area d-flex flex-column align-items-center justify-content-center"
                      style={{
                        backgroundColor: "#2E610B",
                        color: "white",
                        height: "250px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        border: "2px dashed rgba(255,255,255,0.3)",
                      }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {imagePreview ? (
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          width={100}
                          height={100}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "6px",
                          }}
                          unoptimized
                        />
                      ) : (
                        <>
                          <div
                            className="rounded-circle bg-white d-flex align-items-center justify-content-center mb-2"
                            style={{ width: "40px", height: "40px" }}
                          >
                            <span style={{ color: "#2E610B", fontSize: "25px" }}>+</span>
                          </div>
                          <span className="fw-bold">Upload Image</span>
                        </>
                      )}
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      style={{ display: "none" }}
                    />
                  </div>

                  <div className="col-md-8">
                    {/* DESCRIPTION */}
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      />
                    </div>

                    {/* FEATURE TYPE */}
                    <div className="mb-3">
                      <label className="form-label">Feature Type</label>
                      <select
                        className="form-select"
                        value={featureType}
                        onChange={(e) => setFeatureType(e.target.value)}
                      >
                        <option value="">Select Type</option>
                        <option value="Shop">Shop</option>
                        <option value="Product">Product</option>
                      </select>
                    </div>

                    {/* PRODUCT DROPDOWN */}
                    {featureType === "Product" && (
                      <div className="mb-3">
                        <label className="form-label">Select Product</label>
                        <select
                          className="form-select"
                          value={selectedProductId}
                          onChange={(e) =>
                            setSelectedProductId(e.target.value)
                          }
                        >
                          <option value="">-- Choose Product --</option>

                          {products.map((product) => (
                            <option key={product._id} value={product._id}>
                              {product.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* SUBMIT */}
                    <button
                      type="submit"
                      className="btn text-white px-4"
                      style={{ backgroundColor: "#2E610B" }}
                      disabled={submitting}
                    >
                      {submitting ? "Posting..." : "Post"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* RUNNING FEATURES */}
          <div className="card">
            <div className="card-body">
              <h4 className="mb-4">Running Features</h4>

              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border"></div>
                </div>
              ) : features.length === 0 ? (
                <div className="text-center py-4 text-muted">No features found</div>
              ) : (
                <div className="row g-3">
                  {paginatedFeatures.map((feature) => (
                    <div key={feature._id} className="col-12">
                      <div className="card border">
                        <div className="card-body">
                          <div className="row align-items-center">
                            <div className="col-auto">
                              <FeatureImage fImage={feature} />
                            </div>

                            <div className="col">
                              <h6 className="mb-1">
                                <strong>Bar Name:</strong>{" "}
                                {feature?.shopId?.barName}
                              </h6>

                              {feature?.productId && (
                                <h6 className="mb-1">
                                  <strong>Product:</strong>{" "}
                                  {feature.productId.name}
                                </h6>
                              )}

                              <p className="text-muted small mb-0">
                                {feature.description}
                              </p>
                            </div>

                            <div className="col-auto d-flex align-items-center gap-2">
                              {/* Toggle */}
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={feature.isActive}
                                  onChange={() =>
                                    toggleFeatureStatus(
                                      feature._id,
                                      feature.isActive
                                    )
                                  }
                                />
                              </div>

                              {/* Delete */}
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => deleteFeature(feature._id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-end mt-4">
                  <nav>
                    <ul className="pagination gap-1">
                      {/* Prev */}
                      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage((p) => p - 1)}
                        >
                          {"<"}
                        </button>
                      </li>

                      {/* Numbers */}
                      {Array.from({ length: totalPages }, (_, i) => (
                        <li
                          key={i}
                          className={`page-item ${currentPage === i + 1 ? "active" : ""
                            }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(i + 1)}
                          >
                            {i + 1}
                          </button>
                        </li>
                      ))}

                      {/* Next */}
                      <li
                        className={`page-item ${currentPage === totalPages ? "disabled" : ""
                          }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage((p) => p + 1)}
                        >
                          {">"}
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
