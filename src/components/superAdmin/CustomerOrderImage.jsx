import Image from "next/image";
import { useState } from "react";
const defaultUserImage = "/images/default-avatar.png";

export default function CustomerOrderImage({ oImage }) {
  const [imgSrc, setImgSrc] = useState(
    oImage?.userId?.profileImage
      ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${oImage?.userId?.profileImage}`
      : defaultUserImage
  );

  return (
    <Image
      src={imgSrc}
      alt="Customer"
      width={50}
      height={50}
      className="rounded-circle"
      onError={() => setImgSrc(defaultUserImage)}
    />
  );
}