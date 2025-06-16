import { AddVariant } from "../AddVariant/page";
import Modal from "./layout";
import "./modal.css";

function AddNow({ isOpen, onClose, btntitle }) {
  return (
    <>
      {/* Passing AddNewProduct as children to Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <AddVariant onClose={onClose} title="22" btntitle={btntitle} />
        <button className="close_md" onClick={onClose}>X</button>
      </Modal>
    </>
  );
}

export default AddNow;
