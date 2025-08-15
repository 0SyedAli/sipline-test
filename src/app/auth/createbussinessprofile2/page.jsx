"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Import useRouter
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import { Textarea } from "@chakra-ui/react";
import { RxCross2 } from "react-icons/rx";
import { useHeader } from "@/components/context/HeaderContext";
import SpinnerLoading from "@/components/Spinner/SpinnerLoading";
import { toast } from "react-toastify";

export default function CreateBusinessProfilePage2() {
  const [barDetail, setBarDetail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [adminId, setAdminId] = useState(""); // Loading state
  const [categories] = useState(["Category1", "Category2", "Category3", "Category4"]);
  const [shopId, setShopId] = useState(""); // Loading state
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [tag, setTag] = useState("");
  const router = useRouter(); // Initialize router
  const header = useHeader();
  const searchParams = useSearchParams();

  useEffect(() => {
    const shopId = searchParams.get("shop_id");
    if (shopId) {
      setShopId(shopId);
    }
  }, [searchParams]);

  const handleCategoryAdd = () => {
    if (tag && !selectedCategories.includes(tag)) {
      setSelectedCategories((prev) => [...prev, tag]);
    }
    setTag(""); // Clear the dropdown selection
  };

  const handleCategoryRemove = (category) => {
    setSelectedCategories((prev) => prev.filter((cat) => cat !== category));
  };

  useEffect(() => {
    const adminData = sessionStorage.getItem("admin");

    if (adminData) {
      try {
        const parsedAdminData = JSON.parse(adminData);
        setAdminId(parsedAdminData._id);
      } catch (error) {
        console.error("Error parsing admin data from sessionStorage:", error);
      }
    } else {
      router.replace("/auth/login"); // Redirect if no admin data
    }

  }, []);
  // const handleNext = () => {
  //   if (!selectedCategories || !barDetail) {
  //     setError("All fields are required.");
  //     setIsLoading(false);
  //     setSuccess(false);
  //     return;
  //   }

  //   setError(null); // Clear any existing errors
  //   setIsLoading(true);

  //   // Dispatch to update Redux state
  //   dispatch(
  //     updateShopData({
  //       categories: selectedCategories, // Pass all selected categories
  //       bar_detail: barDetail,
  //     })
  //   );

  //   setIsLoading(false);
  //   setSuccess(true);

  //   // Navigate to the next page
  //   router.push("createbussinessprofile3");
  // };

  const handleNext = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    const apiPayload = new FormData();
    apiPayload.append("adminId", adminId);
    apiPayload.append("shopId", shopId);
    apiPayload.append("category", selectedCategories);
    apiPayload.append("barDetails", barDetail);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}admin/updateShop`, {
        method: "POST",
        body: apiPayload,
      });

      // Check if the response status is OK
      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.message || "Failed to Create Shop");
      }

      const result = await response.json();

      // Handle success scenario
      if (result?.success) {
        setSuccess(true);
        toast.success(result?.msg || "Shop Created successfully!");
        setError(null);
        // sessionStorage.setItem("admin", JSON.stringify(result?.data));
             router.push(`createbussinessprofile3?shop_id=${result?.data?._id}`);
      } else {
        // Handle server-side failure
        setSuccess(false);
        toast.error(result?.msg || "Invalid data received");
        setError(result?.msg || "Invalid data received");
      }

    } catch (err) {
      // General error handling
      console.error("API Error:", err);
      setError(err.message || "An unexpected error occurred");
      toast.error(err.message || "An unexpected error occurred");
      setIsLoading(false);
      setSuccess(false);
    }
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
