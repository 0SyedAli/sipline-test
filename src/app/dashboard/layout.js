"use client";

import SideBar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useFcmToken from "@/hooks/useFcmToken";

export default function Dashboard({ children }) {
  const router = useRouter();
  const [adminId, setAdminId] = useState(null);

  // Load admin from sessionStorage on client only
  useEffect(() => {
    if (typeof window !== "undefined") {
      const admin = JSON.parse(sessionStorage.getItem("admin"));
      
      if (!admin) {
        router.replace("/auth/login");
        return;
      }

      setAdminId(admin._id); // store adminId safely
    }
  }, []);

  // Register FCM token when adminId becomes available
  useFcmToken(adminId);

  return (
    <div className="dashboard_container">
      <SideBar />
      <div className="dashboard_panel">
        <TopBar />
        {children}
      </div>
    </div>
  );
}
