"use client";
import { useDisclosure } from "@chakra-ui/react";
import { AddNewProduct } from "@/components/AddNewProduct/page";
import AddVariantModal from "@/components/Modal/AddVariantModal";

const Page = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  return (
    <div className="page">
      <div className="manage_order_head">
        <h3 className="pb-2">Add New Products</h3>
      </div>
      <div className="add_product_container d-flex justify-content-between">
        <AddNewProduct btntitle="Add Product" title="11" />
        <button type="button" onClick={onOpen} className="themebtn4 green btn">
          Add Variants
        </button>
      </div>

      <AddVariantModal btntitle="Add Varient" isOpen={isOpen} onClose={onClose} />

      {/* <div className="manage_order_head pt-0">
        <h3 className="pb-2">Variants</h3>
      </div>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 row-cols-xl-5 row-cols-xxl-6 gx-3 pt-4 variant_product">
        {variantOrder.map((order, index) => (
          <div key={index} className="col">
            <VariantProduct
              title={order.title}
              price={order.price}
              quantity={order.quantity}
            />
          </div>
        ))}
      </div> */}
      {/* <div className="text-end">
        <Link href="/" className="themebtn4 green btn">
          Add Now
        </Link>
      </div> */}
    </div>
  );
};

export default Page;
