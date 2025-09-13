import { useEffect, useState } from "react";
import Image from "next/image";

export default function ShopImage({ shop }) {
  const [imageUrl, setImageUrl] = useState("/images/default-avatar.png");

  useEffect(() => {
    if (shop?.shopImage || shop?.profileImage) {
      console.log(shop?.profileImage);
      
      const testUrl = `${process.env.NEXT_PUBLIC_IMAGE_URL}${shop.shopImage || shop?.profileImage}`;
      fetch(testUrl, { method: "HEAD" })
        .then((res) => {
          if (res.ok) {
            setImageUrl(testUrl); // File exists
          }
        })
        .catch(() => {
          // do nothing, fallback stays
        });
    }
  }, [shop]);

  return (
    <Image
      src={imageUrl}
      alt={shop?.profileImage || "Shop"}
      className="rounded-circle"
      width={40}
      height={40}
      unoptimized
    />
  );
}
