"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { BsStarFill, BsStarHalf, BsStar, BsClock, BsGeoAlt, BsInfoCircle } from "react-icons/bs"
import "../../../../../../styles/shop.css"
import SpinnerLoading from "@/components/SpinnerLoading"
const defaultShopImage = "/placeholder.svg?height=400&width=600"

const BarDetails = ({ params }) => {
    const shopId = params.shopId
    const [shop, setShop] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getShopDetails = async () => {
            try {
                setError(null)
                setLoading(true)

                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}superAdmin/getShopById?shopId=${shopId}`, { method: "GET" })

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`)
                }

                const data = await response.json()
                if (data.success) {
                    setShop(data.data)
                } else {
                    throw new Error(data.msg || "Failed to fetch shop details")
                }
            } catch (error) {
                console.error("Error fetching shop details:", error)
                setError(error.message || "Failed to load shop details")
            } finally {
                setLoading(false)
            }
        }

        getShopDetails()
    }, [shopId])

    const renderStars = (rating) => {
        const stars = []
        const fullStars = Math.floor(rating)
        const hasHalfStar = rating % 1 !== 0

        for (let i = 0; i < fullStars; i++) {
            stars.push(<BsStarFill key={i} className="text-warning" />)
        }

        if (hasHalfStar) {
            stars.push(<BsStarHalf key="half" className="text-warning" />)
        }

        const emptyStars = 5 - Math.ceil(rating)
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<BsStar key={`empty-${i}`} className="text-muted" />)
        }

        return stars
    }

    if (loading) {
        return (
            <div className="page pt-4 px-0">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
                    <SpinnerLoading />
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="page px-0">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="alert alert-danger border-0 shadow-sm rounded-4 text-center">
                            <BsInfoCircle className="fs-1 text-danger mb-3" />
                            <h4>Oops! Something went wrong</h4>
                            <p className="mb-0">{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!shop) {
        return (
            <div className="page px-0">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="alert alert-warning border-0 shadow-sm rounded-4 text-center">
                            <BsInfoCircle className="fs-1 text-warning mb-3" />
                            <h4>Bar Not Found</h4>
                            <p className="mb-0">{`The bar you're looking for doesn't exist or has been removed.`}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const imageUrl = shop.shopImage ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${shop.shopImage}` : defaultShopImage

    return (
        <div className="page px-0">
            {/* Hero Section */}
            <div className="position-relative overflow-hidden">
                <div className="hero-gradient"></div>
                <div className="container-fluid py-3 px-0">
                    <div className="row gy-4">
                        <div className="col-lg-8">
                            <div className="bar_detail_left">
                                <Image
                                    src={imageUrl || "/placeholder.svg"}
                                    alt={shop.barName}
                                    width={800}
                                    height={500}
                                    className="w-100 object-fit-cover"
                                    style={{ height: "500px" }}
                                    onError={(e) => {
                                        e.target.src = defaultShopImage
                                    }}
                                />
                                <div className="position-absolute bottom-0 start-0 bg-dark bg-gradient-dark p-4">
                                    <div className="text-white">
                                        <h2 className="display-4 fw-bold mb-2">{shop.barName || "Unknown Bar"}</h2>
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <div className="d-flex gap-1">{renderStars(shop.avgRating || 0)}</div>
                                            <span className="badge bg-warning text-dark px-3 py-2 rounded-pill">
                                                {shop.avgRating || "0.0"} Rating
                                            </span>
                                        </div>
                                        <p className="fs-6 mb-0 opacity-75">
                                            <BsGeoAlt className="me-2" />
                                            {shop.address}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="h-100 position-relative">
                                <div className="order_map mb-3 h-100">
                                    <div style={{ position: "relative", height: "350px", width: "100%" }}>
                                        <iframe
                                            src={`https://www.google.com/maps?q=${shop.latitude},${shop.longitude}&hl=es;z=14&output=embed`}
                                            width="100%"
                                            height="500"
                                            style={{ border: 0 }}
                                            allowFullScreen
                                            loading="lazy"
                                            title="Bar Location"
                                            className="rounded"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container-fluid py-3 px-0">
                <div className="row g-4">
                    {/* Bar Information */}
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm rounded-4 mb-4">
                            <div className="card-body p-4">
                                <h3 className="card-title text-primary mb-4 d-flex align-items-center">
                                    <BsInfoCircle className="me-2" />
                                    Bar Information
                                </h3>
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <div className="info-item">
                                            <label className="form-label text-muted fw-semibold">Address</label>
                                            <p className="fs-5 mb-0">{shop.address}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="info-item">
                                            <label className="form-label text-muted fw-semibold">Postal Code</label>
                                            <p className="fs-5 mb-0">{shop.postalCode}</p>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="info-item">
                                            <label className="form-label text-muted fw-semibold">Description</label>
                                            <p className="fs-6 text-muted mb-0">{shop.barDetails || "No description available"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Working Hours */}
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-body p-4">
                                <h3 className="card-title text-primary mb-4 d-flex align-items-center">
                                    <BsClock className="me-2" />
                                    Working Hours
                                </h3>
                                <div className="row g-3">
                                    {shop.workingDays?.map((day, index) => (
                                        <div key={index} className="col-md-6">
                                            <div
                                                className={`working-day-card p-3 rounded-3 ${day.isActive ? "bg-success-subtle border-success" : "bg-light border"}`}
                                            >
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <span className="fw-semibold text-dark">{day.day}</span>
                                                    <span className={`badge ${day.isActive ? "bg-success" : "bg-secondary"} px-3 py-2`}>
                                                        {day.isActive ? `${day.openingTime} - ${day.closeingTime}` : "Closed"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="col-lg-4">
                        <div className="sticky-top" style={{ top: "2rem" }}>
                            {/* Quick Stats */}
                            <div className="card border-0 shadow-sm rounded-4 mb-4">
                                <div className="card-body p-4 text-center">
                                    <h4 className="card-title text-primary mb-4">Quick Stats</h4>
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <div className="stat-item bg-primary-subtle p-3 rounded-3">
                                                <div className="d-flex align-items-center justify-content-center gap-2">
                                                    {renderStars(shop.avgRating || 0)}
                                                </div>
                                                <h3 className="text-primary mb-0 mt-2">{shop.avgRating || "0.0"}</h3>
                                                <small className="text-muted">Average Rating</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="card border-0 shadow-sm rounded-4">
                                <div className="card-body p-4">
                                    <h4 className="card-title text-primary mb-4">Location Details</h4>
                                    <div className="d-flex align-items-start gap-3 mb-3">
                                        <BsGeoAlt className="text-primary mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="mb-1 fw-semibold">Address</p>
                                            <p className="text-muted mb-0 small">{shop.address}</p>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-start gap-3">
                                        <BsInfoCircle className="text-primary mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="mb-1 fw-semibold">Postal Code</p>
                                            <p className="text-muted mb-0 small">{shop.postalCode}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BarDetails
