import Image from "next/image";
import { useState } from "react";
const defaultFeatureImage = "/images/default-avatar.png";

export default function FeatureImage({ fImage }) {
  const [imgSrc, setImgSrc] = useState(
    fImage?.bannerImage
      ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${fImage?.bannerImage}`
      : defaultFeatureImage
  );

  return (
    <Image
      src={imgSrc}
      alt="Customer"
      width={50}
      height={50}
      className="rounded-circle"
      onError={() => setImgSrc(defaultFeatureImage)}
    />
  );
}