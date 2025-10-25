import Image from "next/image";
import { useState } from "react";
const defaultUserImage = "/images/default-avatar.png";

export default function CustomerImage2({ customer }) {
  const [imgSrc, setImgSrc] = useState(
    customer?.profile_image
      ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${customer.profile_image}`
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