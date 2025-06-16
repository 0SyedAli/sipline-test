"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews, fetchRating } from "../lib/redux/store/slices/reviewsSlice";
import SpinnerLoading from "./Spinner/SpinnerLoading";
import { FaStar } from "react-icons/fa";
import Image from "next/image";

const AllReviews = ({ limit = null, shopId, adminId }) => {
    const dispatch = useDispatch();
    const { reviews, rating, loading, error } = useSelector((state) => state.reviews);

    useEffect(() => {
        if (shopId) dispatch(fetchReviews({ shopId }));
        if (adminId) dispatch(fetchRating({ adminId }));
    }, [dispatch, shopId, adminId]);

    const displayedReviews = limit ? reviews.slice(0, limit) : reviews;

    if (loading) return <SpinnerLoading />;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <div className="rating_head">
                <div className="rh_rating">
                    <h2>{rating?.avgRating || 0.0}</h2>
                </div>
                <div>
                    {(() => {
                        const bigStars = Array.from({ length: 5 }, (_, i) => (
                            <FaStar key={i} color={i < rating?.avgRating ? "#ffc107" : "#e4e5e9"} />
                        ));
                        return <div className="rh_stars">{bigStars}</div>;
                    })()}
                    <p>Based on {rating?.totalCount || 0} reviews</p>
                </div>
            </div>
            {displayedReviews.map((review, index) => (
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
                                alt=""
                            />
                            <div className="user_rating_info">
                                <h3 className="pb-2">{review?.userId?.fullName || "Unknown"}</h3>
                                {(() => {
                                    const stars = Array.from({ length: 5 }, (_, i) => (
                                        <FaStar key={i} color={i < review?.stars ? "#ffc107" : "#e4e5e9"} />
                                    ));
                                    return <div className="rh_stars">{stars}</div>;
                                })()}
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
                            <p>{review?.text || "No text"}</p>
                        </div>
                    </div>
                </div>
            ))}

            {/* <div className="user_rating_item">
        <div className="user_rating_item_inner">
          <div className="d-flex gap-3">
            <img src={userRating} alt="" />
            <div className="user_rating_info">
              <h3 className="pb-2">Allen Warn</h3>
              <div className="rh_stars">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
            </div>
          </div>
          <div>
            <div className="d-flex align-items-center justify-content-between pb-3">
              <h3>Amazing Taste</h3>
              <h4>Order ID - #12345</h4>
            </div>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum is simply dummy text of the printing and
              typesetting industry.Lorem Ipsum is simply dummy text of the
              printing and typesetting industry. Lorem Ipsum is simply dummy
              text of the printing and typesetting industry.
            </p>
          </div>
        </div>
      </div> */}
        </>
    );
};

export default AllReviews;
