import Image from "next/image";
import Link from "next/link";

const CategoryCards = ({ title, productimage1 }) => {
  return (
    <div className="product_card">
      <Image width={255} height={200} className="product_image" src={productimage1} alt="category image" />
      <div className="text-center mt-3">
        <h4 className="my-3">{title}</h4>
        <button className="button_detele" href="/dashboard/manage-product">
          Delete
        </button>
      </div>
    </div>
  );
};

export default CategoryCards;
