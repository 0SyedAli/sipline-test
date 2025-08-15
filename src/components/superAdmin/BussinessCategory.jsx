"use client"

import { useState, useEffect } from "react"
import SpinnerLoading from "../SpinnerLoading"

export default function BussinessCategory() {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showAddModal, setShowAddModal] = useState(false)
    const [newCategoryName, setNewCategoryName] = useState("")
    const [addingCategory, setAddingCategory] = useState(false)
    const [editingCategory, setEditingCategory] = useState(null)
    const [editCategoryName, setEditCategoryName] = useState("")

    // Fetch all business categories
    const fetchCategories = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}superAdmin/getAllbusinessCategories`, {
                method: "GET"
            });
            const data = await response.json()

            if (data.success && data.data) {
                setCategories(data.data)
            } else {
                setError(data.message || "Failed to fetch categories")
            }
        } catch (err) {
            setError("Error fetching categories")
            console.error("Fetch error:", err)
        } finally {
            setLoading(false)
        }
    }

    // Add new category
    const handleAddCategory = async (e) => {
        e.preventDefault()
        if (!newCategoryName.trim()) return

        try {
            setAddingCategory(true)
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}superAdmin/addBusinessCat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ businessCatName: newCategoryName.trim() }),
            })

            const data = await response.json()

            if (data.success) {
                setNewCategoryName("")
                setShowAddModal(false)
                fetchCategories() // Refresh the list
            } else {
                setError(data.message || "Failed to add category")
            }
        } catch (err) {
            setError("Error adding category")
            console.error("Add error:", err)
        } finally {
            setAddingCategory(false)
        }
    }

    // Delete category
    const handleDeleteCategory = async (categoryId) => {
        if (!confirm("Are you sure you want to delete this category?")) return

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}superAdmin/deleteBusinessCat?categoryId=${categoryId}`, {
                method: "DELETE",
            })

            const data = await response.json()

            if (data.success) {
                fetchCategories() // Refresh the list
            } else {
                setError(data.message || "Failed to delete category")
            }
        } catch (err) {
            setError("Error deleting category")
            console.error("Delete error:", err)
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    if (loading) {
        return (
            <div className="page pt-4 px-0">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
                    <SpinnerLoading />
                </div>
            </div>
        )
    }

    return (
        <div className="container py-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item">
                            <a href="/" className="text-decoration-none">
                                🏠
                            </a>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            Business Category
                        </li>
                    </ol>
                </nav>
                <div className="position-relative">
                    <span className="badge bg-danger position-absolute top-0 start-100 translate-middle rounded-pill">
                        {categories.length || "0"}
                    </span>
                    <i className="bi bi-bell fs-5"></i>
                </div>
            </div>

            {/* Add Category Button */}
            <div className="mb-4">
                <button className="btn btn-success d-flex align-items-center gap-2" onClick={() => setShowAddModal(true)}>
                    <span className="fs-4">+</span>
                    Add New Business Category
                </button>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError(null)} aria-label="Close"></button>
                </div>
            )}

            {/* Categories Table */}
            <div className="bg-white rounded shadow-sm">
                <div className="p-3 border-bottom">
                    <h6 className="mb-0 fw-semibold">Category Name</h6>
                </div>

                {categories.length === 0 ? (
                    <div className="p-4 text-center text-muted">No categories found. Add your first category above.</div>
                ) : (
                    <div className="list-group list-group-flush">
                        {categories.map((category) => (
                            <div
                                key={category._id}
                                className="list-group-item d-flex justify-content-between align-items-center py-3"
                            >
                                <span>{category.businessCatName}</span>
                                <div className="d-flex gap-2">
                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={() => {
                                            setEditingCategory(category)
                                            setEditCategoryName(category.name)
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteCategory(category._id)}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Category Modal */}
            {showAddModal && (
                <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add New Business Category</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowAddModal(false)}
                                    aria-label="Close"
                                ></button>
                            </div>
                            <form onSubmit={handleAddCategory}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label htmlFor="categoryName" className="form-label">
                                            Category Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="categoryName"
                                            value={newCategoryName}
                                            onChange={(e) => setNewCategoryName(e.target.value)}
                                            placeholder="Enter category name"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-success" disabled={addingCategory}>
                                        {addingCategory ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Adding...
                                            </>
                                        ) : (
                                            "Add Category"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Category Modal */}
            {editingCategory && (
                <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Business Category</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setEditingCategory(null)}
                                    aria-label="Close"
                                ></button>
                            </div>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    // Handle edit logic here
                                    setEditingCategory(null)
                                }}
                            >
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label htmlFor="editCategoryName" className="form-label">
                                            Category Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="editCategoryName"
                                            value={editCategoryName}
                                            onChange={(e) => setEditCategoryName(e.target.value)}
                                            placeholder="Enter category name"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setEditingCategory(null)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-success">
                                        Update Category
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
