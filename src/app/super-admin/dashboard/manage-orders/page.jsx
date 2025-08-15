"use client"

import MangeOrder from "@/components/superAdmin/MangeOrder"

// Mock data...

export default function ManageOrdersPage() {
  // const [searchTerm, setSearchTerm] = useState("")
  // const [currentPage, setCurrentPage] = useState(1)
  // const [itemsPerPage, setItemsPerPage] = useState(10)

  // const getStatusBadge = (status) => {
  //   switch (status) {
  //     case "Completed":
  //       return <span className="badge py-2 bg-success">Completed</span>
  //     case "In-Progress":
  //       return <span className="badge py-2 bg-primary">In-Progress</span>
  //     case "Pending":
  //       return <span className="badge py-2 bg-warning text-dark">Pending</span>
  //     default:
  //       return <span className="badge py-2 bg-secondary">{status}</span>
  //   }
  // }

  // const filteredOrders = orders.filter((order) =>
  //   order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  // )

  // const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  // const startIndex = (currentPage - 1) * itemsPerPage
  // const endIndex = startIndex + itemsPerPage
  // const currentOrders = filteredOrders.slice(startIndex, endIndex)

  return (
    // <div className="page pt-4">
    //   {/* Header */}
    //   {/* <div className="d-flex justify-content-between align-itemscenter mb-4">
    //       <div>
    //         <h1 className="h2 fw-semibold text-dark mb-1">Manage Orders</h1>
    //         <nav aria-label="breadcrumb">
    //           <ol className="breadcrumb mb-0">
    //             <li className="breadcrumb-item">
    //               <BsHouseDoor className="me-1" />
    //               Manage Orders
    //             </li>
    //           </ol>
    //         </nav>
    //       </div>
    //     </div> */}

    //   {/* Statistics Cards */}
    //   <div className="row g-3 mb-4">
    //     <div className="col-6 col-md-4 col-lg-3 col-xl">
    //       <div className="card h-100 border-start border-success border-4">
    //         <div className="card-body p-3">
    //           {/* <div className="justify-content-center align-items-center mb-2" style={{ background: "green", color: "#FFF", display: "inline-flex", borderRadius:"100%", width:"30px", height:"30px" }}>
    //               <BsBox />
    //             </div> */}
    //           <div>
    //             <small className="text-muted d-block">All Orders</small>
    //             <h3 className="fw-bold mb-0">450</h3>
    //           </div>
    //         </div>
    //       </div>
    //     </div>

    //     <div className="col-6 col-md-4 col-lg-3 col-xl">
    //       <div className="card h-100 border-start border-success border-4">
    //         <div className="card-body p-3">
    //           {/* <div className="justify-content-center align-items-center mb-2" style={{ background: "green", color: "#FFF", display: "inline-flex", borderRadius:"100%", width:"30px", height:"30px" }}>
    //               <BsClock className=" fs-5" />
    //             </div> */}
    //           <div>
    //             <small className="text-muted d-block">Pending</small>
    //             <h3 className="fw-bold mb-0">5</h3>
    //           </div>
    //         </div>
    //       </div>
    //     </div>

    //     <div className="col-6 col-md-4 col-lg-3 col-xl">
    //       <div className="card h-100 border-start border-success border-4">
    //         <div className="card-body p-3">
    //           {/* <div className="justify-content-center align-items-center mb-2" style={{ background: "green", color: "#FFF", display: "inline-flex", borderRadius:"100%", width:"30px", height:"30px" }}>
    //               <BsCheckCircle className=" fs-5" />
    //             </div> */}
    //           <div>
    //             <small className="text-muted d-block">Completed</small>
    //             <h3 className="fw-bold mb-0">320</h3>
    //           </div>
    //         </div>
    //       </div>
    //     </div>

    //     <div className="col-6 col-md-4 col-lg-3 col-xl">
    //       <div className="card h-100 border-start border-success border-4">
    //         <div className="card-body p-3">
    //           {/* <div className="justify-content-center align-items-center mb-2" style={{ background: "green", color: "#FFF", display: "inline-flex", borderRadius:"100%", width:"30px", height:"30px" }}>
    //               <BsXCircle className=" fs-5" />
    //             </div> */}
    //           <div>
    //             <small className="text-muted d-block">Cancelled</small>
    //             <div className="d-flex align-items-center justify-content-between">
    //               <h3 className="fw-bold mb-0">30</h3>
    //               <small className="text-danger">20%</small>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>

    //     <div className="col-6 col-md-4 col-lg-3 col-xl">
    //       <div className="card h-100 border-start border-success border-4">
    //         <div className="card-body p-3">
    //           {/* <div className="justify-content-center align-items-center mb-2" style={{ background: "green", color: "#FFF", display: "inline-flex", borderRadius:"100%", width:"30px", height:"30px" }}>
    //               <BsArrowReturnLeft className=" fs-5" />
    //             </div> */}
    //           <div>
    //             <small className="text-muted d-block">Returned</small>
    //             <h3 className="fw-bold mb-0">20</h3>
    //           </div>
    //         </div>
    //       </div>
    //     </div>

    //     <div className="col-6 col-md-4 col-lg-3 col-xl">
    //       <div className="card h-100 border-start border-success border-4">
    //         <div className="card-body p-3">
    //           {/* <div className="justify-content-center align-items-center mb-2" style={{ background: "green", color: "#FFF", display: "inline-flex", borderRadius:"100%", width:"30px", height:"30px" }}>
    //               <BsExclamationTriangle className=" fs-5" />
    //             </div> */}
    //           <div>
    //             <small className="text-muted d-block">Damaged</small>
    //             <h3 className="fw-bold mb-0">5</h3>
    //           </div>
    //         </div>
    //       </div>
    //     </div>

    //     <div className="col-6 col-md-4 col-lg-3 col-xl">
    //       <div className="card h-100 border-start border-success border-4">
    //         <div className="card-body p-3">
    //           {/* <div className="justify-content-center align-items-center mb-2" style={{ background: "green", color: "#FFF", display: "inline-flex", borderRadius:"100%", width:"30px", height:"30px" }}>
    //               <BsCart className=" fs-5" />
    //             </div> */}
    //           <div>
    //             <small className="text-muted d-block">Abandoned Cart</small>
    //             <div className="d-flex align-items-center justify-content-between">
    //               <h3 className="fw-bold mb-0">20%</h3>
    //               <small className="text-danger">0.0%</small>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>

    //     <div className="col-6 col-md-4 col-lg-3 col-xl">
    //       <div className="card h-100 border-start border-success border-4">
    //         <div className="card-body p-3">
    //           {/* <div className="justify-content-center align-items-center mb-2" style={{ background: "green", color: "#FFF", display: "inline-flex", borderRadius:"100%", width:"30px", height:"30px" }}>
    //               <BsPeople className=" fs-5" />
    //             </div> */}
    //           <div>
    //             <small className="text-muted d-block">Customers</small>
    //             <h3 className="fw-bold mb-0">30</h3>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   {/* Customer Orders Table */}
    //   <div className="card">
    //     <div className="card-header bg-white">
    //       <div className="d-flex justify-content-between align-items-center">
    //         <h5 className="card-title mb-0">Customer Orders</h5>
    //         <div className="position-relative">
    //           <BsSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
    //           <input
    //             type="text"
    //             className="form-control ps-5"
    //             placeholder="Search..."
    //             value={searchTerm}
    //             onChange={(e) => setSearchTerm(e.target.value)}
    //             style={{ width: "250px" }}
    //           />
    //         </div>
    //       </div>
    //     </div>
    //     <div className="card-body p-0">
    //       <div className="table-responsive">
    //         <table className="table table-hover mb-0">
    //           <thead className="table-light">
    //             <tr>
    //               <th scope="col" style={{ width: "50px" }}>
    //                 <input type="checkbox" className="form-check-input" />
    //               </th>
    //               <th scope="col">Customer Name</th>
    //               <th scope="col">Order Date</th>
    //               <th scope="col">Order Type</th>
    //               <th scope="col">Tracking ID</th>
    //               <th scope="col">Order Total</th>
    //               <th scope="col">Action</th>
    //               <th scope="col">Status</th>
    //             </tr>
    //           </thead>
    //           <tbody>
    //             {currentOrders.map((order) => (
    //               <tr key={order.id}>
    //                 <td>
    //                   <input type="checkbox" className="form-check-input" />
    //                 </td>
    //                 <td className="fw-medium">{order.customerName}</td>
    //                 <td className="text-muted">{order.orderDate}</td>
    //                 <td className="text-muted">{order.orderType}</td>
    //                 <td className="text-muted">{order.trackingId}</td>
    //                 <td className="fw-medium">{order.orderTotal}</td>
    //                 <td>
    //                   <button className="btn btn-danger btn-sm">Cancel</button>
    //                 </td>
    //                 <td>{getStatusBadge(order.status)}</td>
    //               </tr>
    //             ))}
    //           </tbody>
    //         </table>
    //       </div>

    //       {/* Pagination */}
    //       <div className="d-flex justify-content-between align-items-center p-3 border-top">
    //         <div className="d-flex align-items-center gap-2">
    //           <select
    //             className="form-select form-select-sm"
    //             style={{ width: "auto" }}
    //             value={itemsPerPage}
    //             onChange={(e) => setItemsPerPage(Number(e.target.value))}
    //           >
    //             <option value={10}>10</option>
    //             <option value={20}>20</option>
    //             <option value={50}>50</option>
    //           </select>
    //           <small className="text-muted">
    //             Items per page: {startIndex + 1}-{Math.min(endIndex, filteredOrders.length)} of{" "}
    //             {filteredOrders.length} items
    //           </small>
    //         </div>

    //         <div className="d-flex align-items-center gap-2">
    //           <small className="text-muted">
    //             {currentPage} of {totalPages} pages
    //           </small>
    //           <button
    //             className="btn btn-outline-secondary btn-sm"
    //             onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
    //             disabled={currentPage === 1}
    //           >
    //             <BsChevronLeft />
    //           </button>
    //           <button
    //             className="btn btn-outline-secondary btn-sm"
    //             onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
    //             disabled={currentPage === totalPages}
    //           >
    //             <BsChevronRight />
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <MangeOrder />
  )
}
