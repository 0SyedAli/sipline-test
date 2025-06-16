import Modal from "./layout";
import "./modal.css";
import { RxCross2 } from "react-icons/rx";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AuthBtn } from "../AuthBtn/AuthBtn";
import SpinnerLoading from "../Spinner/SpinnerLoading";
import axios from "axios";

function AddCategory({ isOpen, onClose, btntitle }) {
  const [categories] = useState(["Category1", "Category2", "Category3", "Category4"]);
  const [selectedCategory, setSelectedCategory] = useState(""); // Changed to single string
  const [tag, setTag] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCategoryAdd = () => {
    if (tag) {
      setSelectedCategory(tag); // Just set the single category
    }
    setTag(""); // Clear the dropdown selection
  };

  const handleCategoryRemove = () => {
    setSelectedCategory(""); // Just clear the single category
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const adminData = JSON.parse(sessionStorage.getItem("admin"));
    if (!selectedCategory) {
      setError("Please select catogory");
      setIsLoading(false);
      return;
    }
    const requestData = {
      adminId: adminData?._id,
      categoryName: selectedCategory, // Now sending a single string
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}admin/category`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.data?.success === true) {
        setSuccess(true);
        toast.success(response?.data?.msg || "Category Added successfully!");
        setError(null);
        onClose();
        setIsLoading(false);
      } else {
        toast.error(response?.data?.msg || "Invalid");
        setError(response?.data?.msg || "Invalid");
        setSuccess(false);
        setIsLoading(false);
      }
    } catch (error) {
      setError(error?.response?.data?.message || error?.message);
      setSuccess(false);
      setIsLoading(false);
    } finally {
      setSuccess(false);
      setIsLoading(false);
      setError(null)
      setSelectedCategory("")
      setTag("")
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {success ? (
        <SpinnerLoading />
      ) : (
        <div className="AddCategory_modal_body">
          <h3>Add Category</h3>
          <form>
            <div style={{ margin: "35px 0 40px", height: "150px" }}>
              <label className="mb-2">Category</label>
              <div className="d-flex align-items-center gap-2">
                <select
                  className="form-select input_field2"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  aria-label="Search Category"
                >
                  <option value="" defaultValue>
                    Search Category
                  </option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="add_cat_btn"
                  onClick={handleCategoryAdd}
                  disabled={!tag} // Disable if no category selected
                >
                  Add
                </button>
              </div>

              <div className="d-flex my-3 flex-wrap" style={{ gap: 10 }}>
                {selectedCategory && ( // Only show if there's a selected category
                  <div className="tags_category">
                    {selectedCategory}
                    <span
                      onClick={handleCategoryRemove}
                      style={{ marginLeft: 5, cursor: "pointer" }}
                    >
                      <RxCross2 />
                    </span>
                  </div>
                )}
              </div>
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="sort_btn justify-content-end gap-2">
              <button onClick={() => {
                onClose()
                setSelectedCategory("")
                setTag("")
              }} type="button" className="themebtn4 green btn" href="/">
                Cancel
              </button>
              {/* {error && <p style={{ color: "red" }}>{error}</p>} */}
              <AuthBtn title="Add Now" onClick={handleLogin} location_btn="themebtn4 green btn" type="button" disabled={isLoading} />
            </div>
          </form>
        </div>
      )}
    </Modal>
  );
}

export default AddCategory;