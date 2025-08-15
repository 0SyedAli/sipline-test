"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";

const SideBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(pathname);
  const [loading, setLoading] = useState(false);
  const [adminData, setAdminData] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar visibility toggle
  const customer = "/images/default-avatar.png";

  useEffect(() => {
    const adminData = JSON.parse(sessionStorage.getItem("admin"));
    if (adminData && adminData?._id) {
      setAdminData(adminData);
    } else {
      console.error("User not found or missing '_id' property");
      // router.push("/auth/login"); 2
    }
  }, [router]);

  const navigationRouters = [
    { href: "/dashboard", icon: "/images/li1.png", text: "Dashboard" },
    { href: "/dashboard/manage-orders", icon: "/images/li2.png", text: "Manage Orders" },
    { href: "/dashboard/manage-product", icon: "/images/li3.png", text: "Manage Products" },
    { href: "/dashboard/ratings", icon: "/images/li4.png", text: "Ratings" },
    { href: "/dashboard/transaction-history", icon: "/images/calendar-tick.png", text: "Transaction History" },
    { href: "/dashboard/discounts", icon: "/images/li6.png", text: "Discounts" },
    { href: "/dashboard/privacy-policy", icon: "/images/li7.png", text: "Privacy Policy" },
    { href: "/dashboard/help-support", icon: "/images/li8.png", text: "Help & Support" },
    { href: "/auth/login?action=logout", icon: "/images/li9.png", text: "Log Out" },
  ];

  useEffect(() => {
    setActiveTab(pathname);
  }, [pathname]);

const handleTabClick = (tab) => {
  setLoading(true);
  setActiveTab(tab);
  setIsSidebarOpen(false); // Close sidebar on click
  router.push(tab);
};
  const handleHover = (href) => {
    router.prefetch(href);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="sidebar_container">
      <div className="sidebar_header">
        <Image src="/images/dashLogo.png" alt="Logo" width={130} height={100} />
        <button className="hamburger" onClick={toggleSidebar}>
          ☰
        </button>
      </div>
      <div className={`sidebar_menu ${isSidebarOpen ? "open" : ""}`}>
        <Image src="/images/dashLogo.png" className="sm_logo" alt="Logo" width={130} height={100} />
        <button className="hamburger" style={{margin: "20px auto 0"}} onClick={toggleSidebar}>
          <RxCross2 />
        </button>
        <ul>
          {navigationRouters.map((item, index) => (
            <li
              key={index}
              className={activeTab === item?.href ? "active" : ""}
              onClick={() => handleTabClick(item?.href)}
              onMouseEnter={() => handleHover(item?.href)}
            >
              <Link href={item?.href}>
                <span>
                  <Image
                    src={item.icon}
                    alt={`${item.text} Icon`}
                    width={24}
                    height={24}
                  />
                </span>
                {item.text}
              </Link>
            </li>
          ))}
        </ul>
        <Link className="du_a" href="/dashboard/user-profile">
          <div className="dashboard_user">
            <Image
              width={40}
              height={40}
              src={
                adminData?.profileImage
                  ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${adminData?.profileImage}`
                  : customer
              }
              alt="User Avatar"
            />
            <p>{adminData?.fullName || "Unknown"}</p>
          </div>
        </Link>
      </div>

    </div>
  );
};

export default SideBar;
