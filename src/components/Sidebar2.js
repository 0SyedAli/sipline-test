"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";

const SideBar2 = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(pathname);
  const [loading, setLoading] = useState(false);
  const [adminData, setAdminData] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar visibility toggle
  const customer = "/images/default-avatar.png";

  // useEffect(() => {
  //   const adminData = JSON.parse(sessionStorage.getItem("admin"));
  //   if (adminData && adminData?._id) {
  //     setAdminData(adminData);
  //   } else {
  //     console.error("User not found or missing '_id' property");
  //     // router.push("/auth/login"); 2
  //   }
  // }, [router]);

  const navigationRouters = [
    { href: "/super-admin/dashboard", icon: "/images/li1.png", text: "Dashboard" },
    { href: "/super-admin/dashboard/manage-orders", icon: "/images/li2.png", text: "Manage Orders" },
    { href: "/super-admin/dashboard/manage-bars", icon: "/images/li3.png", text: "Manage Bars" },
    { href: "/super-admin/dashboard/manage-refunds", icon: "/images/li4.png", text: "Manage Refunds" },
    { href: "/super-admin/dashboard/manage-delete-accounts", icon: "/images/li4.png", text: "Manage Delete Accounts" },
    { href: "/super-admin/dashboard/features", icon: "/images/calendar-tick.png", text: "Features Ads" },
    { href: "/super-admin/dashboard/privacy-policy", icon: "/images/li7.png", text: "Privacy Policy" },
    { href: "/super-admin/dashboard/terms-&-condition", icon: "/images/li8.png", text: "Terms & Conditions" },
    { href: "/super-admin/auth/login?action=logout", icon: "/images/li9.png", text: "Log Out" },
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
        <button className="hamburger" style={{ margin: "20px auto 0" }} onClick={toggleSidebar}>
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
        {/* <Link className="du_a" href="/dashboard/user-profile">
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
        </Link> */}
      </div>

    </div>
  );
};

export default SideBar2;
