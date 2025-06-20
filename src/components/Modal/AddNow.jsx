import { EditProduct } from "../EditProduct/page";
import Modal from "./layout";
import "./modal.css";

function AddNow({ isOpen, onClose, btntitle, productId }) {
  return (
    <>
      {/* Passing AddNewProduct as children to Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <EditProduct productId={productId} onClose={onClose} title="22" btntitle={btntitle} />
        <button className="close_md" onClick={onClose}>X</button>
      </Modal>
    </>
  );
}

export default AddNow;
