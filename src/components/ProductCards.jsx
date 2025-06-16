import { useDisclosure } from "@chakra-ui/react";
import AddNow from "./Modal/AddNow";
import Image from "next/image";

const ProductCards = ({ name, price, stockQuantity, image }) => {
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
        {/* <div className="form-check form-switch">
          <label className="form-check-label" htmlFor={`stockSwitch-${name}`}>
            In Stock
          </label>
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id={`stockSwitch-${name}`}
            defaultChecked={stockQuantity > 0}
          />
        </div> */}

        <button type="button" className="border-0 bg-transparent" onClick={onOpen}>
          <Image width={23} height={23} src="/images/edit_icon.png" alt="Edit" />
        </button>
      </div>
      <AddNow isOpen={isOpen} onClose={onClose} btntitle="Update" />
    </div>
  );
};

export default ProductCards;
