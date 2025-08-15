"use client"

import Image from "next/image"
import { useState, useEffect, useRef } from "react"

export default function FeaturesComponent() {
  const [features, setFeatures] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [description, setDescription] = useState("")
  const [featureType, setFeatureType] = useState("Bar")
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [shops, setShops] = useState([])
  const [selectedShopId, setSelectedShopId] = useState("")
  const [products, setProducts] = useState([])
  const [selectedProductId, setSelectedProductId] = useState("")
  const fileInputRef = useRef(null)

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
      alert("Please fill in all fields and select an image");
      return;
    }

    try {
      setSubmitting(true);
      const supAdminId = sessionStorage.getItem("adminId");
      const formData = new FormData();
      formData.append("adminId", supAdminId);
      formData.append("description", description);
      formData.append("Banner", selectedImage);

      if (featureType === "Shop") {
        if (!selectedShopId) return alert("Please select a shop");
        formData.append("shopId", selectedShopId);

      } else if (featureType === "Product") {
        if (!selectedShopId) return alert("Please select a shop");
        if (!selectedProductId) return alert("Please select a product");
        formData.append("shopId", selectedShopId);
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
        setFeatureType("Bar");
        setSelectedShopId("");
        setSelectedProductId("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchFeatures();
        alert("Feature created successfully!");
      } else {
        alert("Failed to create feature: " + result.msg);
      }
    } catch (error) {
      console.error("Error creating feature:", error);
      alert("Error creating feature");
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
        alert("Failed to update status: " + data.msg);
      }
    } catch (err) {
      console.error("Error updating feature status", err);
      alert("Error updating status");
    }
  };

  useEffect(() => {
    fetchFeatures()
  }, [])

  return (
    <div className="py-4">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Features Management</h2>

          {/* Create Feature Form */}
          <div className="card mb-4">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
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
                  {features.map((feature) => (
                    <div key={feature._id} className="col-12">
                      <div className="card border">
                        <div className="card-body">
                          <div className="row align-items-center">
                            <div className="col-auto">
                              <Image
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
                              />
                            </div>
                            <div className="col">
                              <h6 className="mb-1">{feature?.shopId?.shopName || "Bar Name Here"}</h6>
                              <p className="mb-0 text-muted small">{feature.description}</p>
                            </div>
                            <div className="col-auto">
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
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
