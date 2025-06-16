"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import { Textarea } from "@chakra-ui/react";
import { RxCross2 } from "react-icons/rx";
import { useHeader } from "@/components/context/HeaderContext";
import SpinnerLoading from "@/components/Spinner/SpinnerLoading";
import { updateShopData } from "src/lib/redux/store/slices/multiStepFormSlice";
import { useDispatch, useSelector } from "react-redux";

export default function CreateBusinessProfilePage2() {
  const [barDetail, setBarDetail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [categories] = useState(["Category1", "Category2", "Category3", "Category4"]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [tag, setTag] = useState("");
  const dispatch = useDispatch();
  const router = useRouter(); // Initialize router
  const header = useHeader();
  const formData = useSelector((state) => state.multiStepForm);
  console.log(formData);
  const handleCategoryAdd = () => {
    if (tag && !selectedCategories.includes(tag)) {
      setSelectedCategories((prev) => [...prev, tag]);
    }
    setTag(""); // Clear the dropdown selection
  };

  const handleCategoryRemove = (category) => {
    setSelectedCategories((prev) => prev.filter((cat) => cat !== category));
  };

  const handleNext = () => {
    if (!selectedCategories || !barDetail) {
      setError("All fields are required.");
      setIsLoading(false);
      setSuccess(false);
      return;
    }

    setError(null); // Clear any existing errors
    setIsLoading(true);

    // Dispatch to update Redux state
    dispatch(
      updateShopData({
        categories: selectedCategories, // Pass all selected categories
        bar_detail: barDetail,
      })
    );

    setIsLoading(false);
    setSuccess(true);

    // Navigate to the next page
    router.push("createbussinessprofile3");
  };

  return (
    <>
      {success ? (
        <SpinnerLoading />
      ) : (
        <div>
          <div className="form_head">
            <h2>{header?.title}</h2>
            <p>{header?.description}</p>
          </div>
          <form>
            <fieldset>
              <label htmlFor="category" className="mb-2">
                Add Category
              </label>
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
                  {categories
                    .filter((category) => !selectedCategories.includes(category))
                    .map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                </select>
                <button type="button" className="add_cat_btn" onClick={handleCategoryAdd}>
                  Add
                </button>
              </div>

              <div className="d-flex my-2 flex-wrap" style={{ gap: 10 }}>
                {selectedCategories.map((category, index) => (
                  <div key={index} className="tags_category">
                    {category}
                    <span onClick={() => handleCategoryRemove(category)} style={{ marginLeft: 5, cursor: "pointer" }}>
                      <RxCross2 />
                    </span>
                  </div>
                ))}
              </div>

              <Textarea
                placeholder="Bar Details"
                className="textarea_field2 mb-4"
                value={barDetail}
                onChange={(e) => setBarDetail(e.target.value)}
              />
              {error && <p style={{ color: "red" }}>{error}</p>}
              <AuthBtn
                title="Next"
                type="button"
                disabled={isLoading}
                onClick={handleNext}
              />
            </fieldset>
          </form>
        </div>
      )}
    </>
  );
}
