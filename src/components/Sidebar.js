"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const SideBar = () => {
  const pathname = usePathname();
  const router = useRouter(); // Initialize the useRouter hook
  const [activeTab, setActiveTab] = useState(pathname);
  const [loading, setLoading] = useState(false); // New loading state
  const [adminData, setAdminData] = useState(false); // New loading state
  const customer = "/images/default-avatar.png";
  useEffect(() => {
    const adminData = JSON.parse(sessionStorage.getItem("admin"));
    if (adminData && adminData?._id) {
      setAdminData(adminData);
    } else {
      console.error("User not found or missing '_id' property");
      router.push("/auth/login");
    }
  }, [router]);
  const navigationRouters = [
    {
      href: "/dashboard",
      icon: "/images/li1.png",
      text: "Dashboard",
    },
    {
      href: "/dashboard/manage-orders",
      icon: "/images/li2.png",
      text: "Manage Orders",
    },
    {
      href: "/dashboard/manage-product",
      icon: "/images/li3.png",
      text: "Manage Products",
    },
    {
      href: "/dashboard/ratings",
      icon: "/images/li4.png",
      text: "Ratings",
    },
    {
      href: "/dashboard/transaction-history",
      icon: "/images/calendar-tick.png",
      text: "Transaction History",
    },
    {
      href: "/dashboard/discounts",
      icon: "/images/li6.png",
      text: "Discounts",
    },
    {
      href: "/dashboard/privacy-policy",
      icon: "/images/li7.png",
      text: "Privacy Policy",
    },
    {
      href: "/dashboard/help-support",
      icon: "/images/li8.png",
      text: "Help & Support",
    },
    {
      href: "/auth/login?action=logout",
      icon: "/images/li9.png",
      text: "Log Out",
    },
  ];
  useEffect(() => {
    setActiveTab(pathname);
  }, [pathname]);

  const handleTabClick = (tab) => {
    setLoading(true); // Start loading
    setActiveTab(tab);
    router.push(tab); // Navigate to the selected tab
  };

  const handleHover = (href) => {
    router.prefetch(href); // Prefetch on hover
  };

  return (
    <div className="sidebar_container">
      <Image src="/images/dashLogo.png" alt="Logo" width={130} height={100} />
      <div>
        <ul>
          {navigationRouters.map((item, index) => (
            <li
              key={index}
              className={activeTab === item?.href ? "active" : ""}
              onClick={() => handleTabClick(item?.href)} // Trigger navigation and loading
              onMouseEnter={() => handleHover(item?.href)} // Prefetch on hover
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
              src={adminData?.profileImage ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${adminData?.profileImage}` : customer}
              alt="User Avatar" />
            <p>{adminData?.fullName || "Unknown"}</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SideBar;
