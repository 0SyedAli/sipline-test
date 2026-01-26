"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Image from "next/image";
import axios from "axios";
import AreYouSure from "@/components/notificationModalCont/AreYouSure";
import {
  DragDropContext,
  Droppable,
  Draggable
} from "@hello-pangea/dnd";

const productImagePlaceholder = "/images/cat_image.webp";

const ManageCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const refreshKey = useSelector((state) => state.refresh.refreshKey);

  /** ─────────────── Get Categories ─────────────── */
  const getCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}admin/getSuperAdminWithoutId`
      );
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      // if (data.success) {
      //   const sorted = [...data?.data].sort(
      //     (a, b) => (a.position ?? 0) - (b.position ?? 0)
      //   );
      //   console.log(sorted);

      //   setCategories(sorted);
      // }
      if (data.success) {
        const superAdmin = data.data[0]; // first record
        const categories = superAdmin.categoryId || [];

        const sorted = [...categories].sort(
          (a, b) => (a.position ?? 0) - (b.position ?? 0)
        );

        setCategories(sorted);
      }
      else {
        throw new Error(data.msg || "Failed to fetch categories");
      }
    } catch (err) {
      const message = err?.message || "Error loading categories";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, [refreshKey]);

  /** ─────────────── Delete Category ─────────────── */
  const deleteCategory = async (catId) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}superAdmin/deleteBusinessCat?categoryId=${catId}`
      );
      if (res.data.success) {
        toast.success("Category deleted successfully");
        getCategories();
      } else {
        throw new Error(res.data.msg || "Delete failed");
      }
    } catch (err) {
      toast.error(err.message || "Error deleting category");
    }
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete);
      setCategoryToDelete(null);
    }
  };

  /** ─────────────── Handle Reorder ─────────────── */
  // const handleOnDragEnd = async (result) => {
  //   if (!result.destination) return;

  //   const newOrder = Array.from(categories);
  //   const [movedItem] = newOrder.splice(result.source.index, 1);
  //   newOrder.splice(result.destination.index, 0, movedItem);
  //   setCategories(newOrder);

  //   try {
  //     // Send only moved category and new index
  //     await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}api/admin/category`, {
  //       categoryId: movedItem._id,
  //       newIndex: result.destination.index,
  //     });
  //     toast.success(`Updated ${movedItem.businessCatName} position`);
  //   } catch (err) {
  //     toast.error(err?.response?.data?.msg || "Failed to update order");
  //   }
  // };

  const handleOnDragEnd = async (result) => {
    if (!result.destination) return;

    const newOrder = Array.from(categories);
    const [movedItem] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, movedItem);

    // Update UI instantly
    setCategories(newOrder);

    // Build new array of IDs in new order
    const categoryIds = newOrder.map((cat) => cat._id);

    // Get super admin ID
    const superAdminId = sessionStorage.getItem("adminId");

    // Prepare payload
    const payload = {
      categoryId: categoryIds,
      superAdminId: superAdminId
    };

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}superAdmin/updateSuperAdmin`,
        payload
      );

      toast.success("Category positions updated successfully");
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Failed to update order");
    }
  };
  return (
    <>
      <div className="page">
        <div className="manage_order_head">
          <h3>Manage Categories</h3>
        </div>

        <div className="manage_order_body">
          {loading && <p>Loading...</p>}
          {error && <p className="text-danger">{error}</p>}
          {!loading && categories.length === 0 && <p>No categories found.</p>}

          <DragDropContext onDragEnd={handleOnDragEnd}>
            {categories.length > 0 && (
              <Droppable droppableId="categories"
                type="COLUMN"
                direction="horizontal">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="category-grid"
                  >
                    {categories.map((category, index) => (
                      <Draggable
                        key={category._id}
                        draggableId={String(category._id)}  // ✅ Must be string
                        index={index}
                      >
                        {(provided) => (
                          <div
                            className="col"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div className="product_card" style={{ border: "2px dashed #ccc", cursor: "grab" }}>
                              <Image
                                width={255}
                                height={100}
                                src={productImagePlaceholder}
                                alt={category.businessCatName}
                                className="w-100 object-fit-cover"
                              />
                              <div className="text-center mt-3">
                                <h4 className="my-3">{category.businessCatName}</h4>
                                <button
                                  className="button_detele"
                                  type="button"
                                  data-bs-toggle="modal"
                                  data-bs-target="#areyousure"
                                  onClick={() => setCategoryToDelete(category._id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            )}
          </DragDropContext>

        </div>
      </div>

      <AreYouSure
        onConfirm={handleConfirmDelete}
        onCancel={() => setCategoryToDelete(null)}
        title="Delete Category"
        message="Are you sure you want to delete this category?"
      />
    </>
  );
};

export default ManageCategory;
