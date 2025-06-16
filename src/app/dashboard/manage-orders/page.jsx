"use client";
import { useState } from "react";
import NewOrder from "@/components/NewOrder";

const Page = () => {
const [activeTab, setActiveTab] = useState("Pending");
  return (
    <div className="page">
      <div className="manage_order_head">
        <h3>New Orders</h3>
        <div className="tabs mo_tabs">
          <button
            className={activeTab === "Pending" ? "active" : ""}
            onClick={() => setActiveTab("Pending")}
          >
            Pending
          </button>
          <button
            className={activeTab === "Preparing" ? "active" : ""}
            onClick={() => setActiveTab("Preparing")}
          >
            Preparing
          </button>
          <button
            className={activeTab === "Delivered" ? "active" : ""}
            onClick={() => setActiveTab("Delivered")}
          >
            Delivered
          </button>
          <button
            className={activeTab === "Picked" ? "active" : ""}
            onClick={() => setActiveTab("Picked")}
          >
            Picked
          </button>
          <button
            className={activeTab === "Rejected" ? "active" : ""}
            onClick={() => setActiveTab("Rejected")}
          >
            Rejected
          </button>
        </div>
      </div>
      <div className="tab-content">{<NewOrder activeTab={activeTab} />}</div>
    </div>
  );
};

export default Page;
