"use client"
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const productimage1 = "/images/product1.jpg";
const idLabel = "/images/receipt-2.png";
const edit_icon = "/images/edit_icon.png";
const NewOrderProductCard = ({
  id,
  status,
  title,
  quantity,
  coupon,
  price,
  image
}) => {
  const [imgSrc, setImgSrc] = useState(
    image ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${image}` : productimage1
  );
  return (
    <div className="product_card">
      {/* <img className="product_image" src={productimage1} /> */}
      <Image
        src={imgSrc}
        alt="Customer"
        width={200}
        height={200}
        className="product_image"
        onError={() => setImgSrc(productimage1)}
      />
      <div className="product_top">
        {status && (
          <div className={`status_td ${status?.toLowerCase() || ""}`}>
            <span>{status}</span>
          </div>
        )}
        <h4>${price ? price : "48"}</h4>
      </div>
      {id && (
        <div className="new_order_id">
          <img src={idLabel} alt="" />
          <span>{id}</span>
        </div>
      )}
      <h4>{title}</h4>
      <h5 className="quanity_h5">Quantity: {quantity}</h5>
      {coupon && <div className="coupon_code d-flex align-items-center justify-content-between border-top">
        <h5>Coupon Code:</h5>
        <h5>
          <span>{coupon}</span>
        </h5>
      </div>}
    </div>
  );
};

export default NewOrderProductCard;
