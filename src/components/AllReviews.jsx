"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import SpinnerLoading from "./SpinnerLoading";

const AllReviews = ({ limit = null }) => {
    const [rating, setRating] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [shopId, setShopId] = useState("");
    const [adminId, setAdminId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    // Fetch admin and shop data on mount
    useEffect(() => {
        const adminData = JSON.parse(sessionStorage.getItem("admin"));
        if (adminData?._id) {
            setAdminId(adminData._id);
            setShopId(adminData.shopId);
        } else {
            // router.push("/auth/login"); 2
        }
    }, [router]);

    // Fetch rating and reviews when shopId and adminId are set
    useEffect(() => {
        if (shopId && adminId) {
            fetchReviews();
            fetchOverallRating();
        }
    }, [shopId, adminId]);

    const fetchOverallRating = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}review/overAllRating?adminId=${adminId}`
            );

            if (!response.ok) throw new Error(`Failed to fetch rating: ${response.status}`);
            
            const data = await response.json();
            if (data?.success) setRating(data?.data);
        } catch (err) {
            handleError(err, "Error fetching overall rating.");
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            handleError(new Error("No token found."), "Please log in again.");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}review/shopReviews?shopId=${shopId}`
            );

            if (!response.ok) throw new Error(`Failed to fetch reviews: ${response.status}`);

            const data = await response.json();
            if (data?.success) setReviews(data?.data);
        } catch (err) {
            handleError(err, "Error fetching reviews.");
        } finally {
            setLoading(false);
        }
    };

    const handleError = (err, message) => {
        console.error(err);
        toast.error(message);
        setError(err.message);
    };

    const displayedReviews = limit ? reviews.slice(0, limit) : reviews;

    return (
        <div className="page product_tab">
            {loading ? (
                <SpinnerLoading />
            ) : (
                <div>
                    {/* Rating Section */}
                    <div className="rating_head">
                        <div className="rh_rating">
                            <h2>{rating?.avgRating || "0.0"}</h2>
                        </div>
                        <div>
                            <div className="rh_stars">
                                {Array.from({ length: 5 }, (_, i) => (
                                    <FaStar key={i} color={i < (rating?.avgRating || 0) ? "#ffc107" : "#e4e5e9"} />
                                ))}
                            </div>
                            <p>Based on {rating?.totalCount || 0} reviews</p>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    {displayedReviews.length > 0 ? (
                        displayedReviews.map((review, index) => (
                            <div key={index} className="user_rating_item">
                                <div className="user_rating_item_inner">
                                    <div className="d-flex align-items-center gap-3">
                                        <Image
                                            width={90}
                                            height={90}
                                            src={
                                                review?.userId?.profileImage
                                                    ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${review?.userId?.profileImage}`
                                                    : "/images/default-avatar.png"
                                            }
                                            alt="User Avatar"
                                        />
                                        <div className="user_rating_info">
                                            <h3 className="pb-2">{review?.userId?.fullName || "Unknown"}</h3>
                                            <div className="rh_stars">
                                                {Array.from({ length: 5 }, (_, i) => (
                                                    <FaStar
                                                        key={i}
                                                        color={i < review?.stars ? "#ffc107" : "#e4e5e9"}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-100">
                                        <div className="d-flex align-items-center justify-content-between pb-2">
                                            <h4>
                                                {new Date(review?.createdAt).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "2-digit",
                                                    day: "2-digit",
                                                })}
                                            </h4>
                                        </div>
                                        <p>{review?.text || "No review text provided."}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty_reviews">
                            <p>No reviews available for this shop.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AllReviews;
