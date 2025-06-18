import { useDisclosure } from "@chakra-ui/react";
import AddNow from "./Modal/AddNow";
import Image from "next/image";

const ProductCards = ({ name, price, stockQuantity, productId, image , btntitle }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className="product_card">
      <Image width={250} height={200} className="product_image" src={image} alt={name} />
      <div className="product_top">
        <div className="status_td">
          <span>{stockQuantity > 0 ? "In Stock" : "Out of Stock"}</span>
        </div>
        <h4>${price}</h4>
      </div>
      <div className="product_bottom gap-2">
      <h4>{name}</h4>
        <button type="button" className="border-0 bg-transparent" onClick={onOpen}>
          <Image width={23} height={23} src="/images/edit_icon.png" alt="Edit" />
        </button>
      </div>
      <AddNow productId={productId} isOpen={isOpen} onClose={onClose} btntitle={btntitle} />
    </div>
  );
};

export default ProductCards;
