"use client"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import FeatureImage from "./FeatureImage"
import { toast } from "react-toastify";

export default function FeaturesComponent() {
  const [features, setFeatures] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [description, setDescription] = useState("")
  const [featureType, setFeatureType] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [shops, setShops] = useState([])
  const [selectedShopId, setSelectedShopId] = useState("")
  const [products, setProducts] = useState([])
  const [selectedProductId, setSelectedProductId] = useState("")
  const fileInputRef = useRef(null)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const fetchShops = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}superAdmin/getAllShops`)
      const data = await res.json()
      if (data.success) {
        setShops(data.data)
      }
    } catch (err) {
      console.error("Error fetching shops", err)
    }
  }


  const handleShopSelect = async (shopId) => {
    setSelectedShopId(shopId);
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
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Error fetching products for shop", err);
    }
  };
  // Fetch all features
  const fetchFeatures = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}superAdmin/getAllFeatures`)
      const data = await response.json()

      if (data.success) {
        setFeatures(data.data)
      } else {
        console.error("Failed to fetch features:", data.msg)
      }
    } catch (error) {
      console.error("Error fetching features:", error)
    } finally {
      setLoading(false)
    }
  }

  // Handle image selection
  const handleImageSelect = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedImage || !description.trim()) {
      toast.error("Please fill in all fields and select an image");
      return;
    }

    try {
      setSubmitting(true);
      const supAdminId = sessionStorage.getItem("adminId");
      const formData = new FormData();
      formData.append("adminId", supAdminId);
      formData.append("description", description);
      formData.append("Banner", selectedImage);

      // if (featureType === "Shop") {
      //   if (!selectedShopId) return alert("Please select a shop");
      //   formData.append("shopId", selectedShopId);

      // } else if (featureType === "Product") {
      //   if (!selectedShopId) return alert("Please select a shop");
      //   if (!selectedProductId) return alert("Please select a product");
      //   formData.append("shopId", selectedShopId);
      //   formData.append("productId", selectedProductId);
      // }
      if (featureType === "Shop") {
        if (!selectedShopId) return toast.error("Please select a shop");
        formData.append("shopId", selectedShopId);

      } else if (featureType === "Product") {
        if (!selectedProductId) return toast.error("Please select a product");
        formData.append("productId", selectedProductId);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}superAdmin/createFeature`,
        { method: "POST", body: formData }
      );

      const result = await response.json();

      if (result.success) {
        setDescription("");
        setSelectedImage(null);
        setImagePreview(null);
        setFeatureType("");
        setSelectedShopId("");
        setSelectedProductId("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchFeatures();
        toast.success("Feature created successfully!");
      } else {
        toast.error("Failed to create feature: " + result.msg);
      }
    } catch (error) {
      console.error("Error creating feature:", error);
      toast.error("Error creating feature");
    } finally {
      setSubmitting(false);
    }
  };
  const toggleFeatureStatus = async (featureId, currentStatus) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}superAdmin/updateFeature`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            featureId,
            isActive: !currentStatus,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        // Update UI without full reload
        setFeatures((prev) =>
          prev.map((f) =>
            f._id === featureId ? { ...f, isActive: !currentStatus } : f
          )
        );
      } else {
        toast.error("Failed to update status: " + data.msg);
      }
    } catch (err) {
      console.error("Error updating feature status", err);
      toast.error("Error updating status");
    }
  };

  useEffect(() => {
    fetchFeatures()
  }, [])
  useEffect(() => {
    const totalPages = Math.ceil(features.length / itemsPerPage);

    // If current page becomes invalid after delete, go back to last valid page
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }

    // If features become empty, move to page 1
    if (features.length === 0) {
      setCurrentPage(1);
    }
  }, [features, currentPage]);
  const deleteFeature = async (featureId) => {
    if (!confirm("Are you sure you want to delete this feature?")) return;

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
        toast.success("Feature Deleted Successfully!");
      } else {
        toast.error("Failed to delete feature: " + data.msg);
      }
    } catch (err) {
      console.error("Error deleting feature", err);
      toast.error("Error deleting feature");
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFeatures = features.slice(startIndex, startIndex + itemsPerPage);

  const totalPages = Math.ceil(features.length / itemsPerPage);
  return (
    <div className="py-4">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Features Management</h2>

          {/* Create Feature Form */}
          <div className="card mb-4">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row gy-3">
                  <div className="col-md-4">
                    {/* Image Upload Area */}
                    <div
                      className="upload-area d-flex flex-column align-items-center justify-content-center"
                      style={{
                        backgroundColor: "#2E610B",
                        color: "white",
                        height: "240px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        border: "2px dashed rgba(255,255,255,0.3)",
                      }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {imagePreview ? (
                        <Image
                          src={imagePreview || "/images/default-avatar.png"}
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
                            <span style={{ color: "#2E610B", fontSize: "25px", fontWeight: "bold" }}>+</span>
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
                    {/* Description Input */}
                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">
                        Description
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="description"
                        placeholder="description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      />
                    </div>

                    {/* Feature Type Dropdown */}
                    <div className="mb-3">
                      <label htmlFor="featureType" className="form-label">Feature Type</label>
                      <select
                        className="form-select"
                        id="featureType"
                        value={featureType}
                        onChange={(e) => {
                          const type = e.target.value;
                          setFeatureType(type);
                          if (type === "Shop" || type === "Product") {
                            fetchShops();
                          }
                        }}
                      >
                        <option value="">Select Type</option>
                        <option value="Shop">Shop</option>
                        <option value="Product">Product</option>
                      </select>
                    </div>
                    {/* Shops Dropdown (for Shop or Product) */}
                    {(featureType === "Shop" || featureType === "Product") && (
                      <div className="mb-3">
                        <label htmlFor="shopSelect" className="form-label">Select Shop</label>
                        <select
                          id="shopSelect"
                          className="form-select"
                          value={selectedShopId}
                          onChange={(e) => handleShopSelect(e.target.value)}
                        >
                          <option value="">-- Choose Shop --</option>
                          {shops.map((shop) => (
                            <option key={shop._id} value={shop._id}>
                              {shop.barName || shop.barDetails?.slice(0, 4) || "Bar Name"}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Products Dropdown (only for Product) */}
                    {featureType === "Product" && products.length > 0 && (
                      <div className="mb-3">
                        <label htmlFor="productSelect" className="form-label">Select Product</label>
                        <select
                          id="productSelect"
                          className="form-select"
                          value={selectedProductId}
                          onChange={(e) => setSelectedProductId(e.target.value)}
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

                    {/* Submit Button */}
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

          {/* Running Features Section */}
          <div className="card">
            <div className="card-body">
              <h4 className="mb-4">Running Features</h4>

              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
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
                              {/* <Image
                                src={feature.bannerImage && `${process.env.NEXT_PUBLIC_IMAGE_URL}${feature.bannerImage}`}
                                alt="Feature"
                                width={80}
                                height={60}
                                style={{
                                  width: "80px",
                                  height: "60px",
                                  objectFit: "cover",
                                  borderRadius: "6px",
                                }}
                                onError={(e) => {
                                  e.target.src = "/images/default-avatar.png"
                                }}
                              /> */}
                              <FeatureImage fImage={feature} />
                            </div>
                            <div className="col">
                              <div className="d-flex align-items-center flex-wrap gap-3 row-gap-1">
                                <h6 className="mb-1"><span className="fw-bold">Bar Name: </span>{feature?.shopId?.barName || "N/A"}</h6>
                                {/* {feature?.productId && } */}
                                {feature?.productId && <>
                                  <span>||</span>
                                  <h6 className="mb-1"><span className="fw-bold">Product Name:</span> {feature?.productId?.name || "N/A"}</h6>
                                  <span>||</span>
                                  <h6 className="mb-1"><span className="fw-bold">Product isFeatured:</span> {feature?.productId?.isFeatured === true ? "On" : "Off" || "N/A"}</h6>
                                </>}
                              </div>
                              <p className="mb-0 text-muted small">{feature.description}</p>
                            </div>
                            <div className="col-auto d-flex align-items-center gap-2">
                              {/* Toggle Switch */}
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={feature.isActive}
                                  onChange={() => toggleFeatureStatus(feature._id, feature.isActive)}
                                  style={{
                                    backgroundColor: feature.isActive ? "#2E610B" : "#ccc",
                                    borderColor: feature.isActive ? "#2E610B" : "#ccc",
                                    height: "25px",
                                    width: "50px"
                                  }}
                                />
                              </div>

                              {/* Delete Button */}
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
                          {'<'}
                        </button>
                      </li>

                      {/* Page Numbers */}
                      {Array.from({ length: totalPages }, (_, i) => (
                        <li
                          key={i}
                          className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
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
                        className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage((p) => p + 1)}
                        >
                          {'>'}
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
  )
}
