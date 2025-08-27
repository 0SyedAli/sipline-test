"use client";
import SideBar2 from "@/components/Sidebar2";
import TopBar2 from "@/components/TopBar2";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isAuthenticated } from "src/utils/AuthAdmin";
export default function Dashboard({ children }) {
  const router = useRouter();
  // useEffect(() => {
  //   const isAuth = isAuthenticated();
  //   if (!isAuth) {
  //     router.replace("/super-admin/auth/login");
  //   }
  // }, [router]);


  return (
    <div className="dashboard_container">
      <SideBar2 />
      <div className="dashboard_panel">
        <TopBar2 />
        {children}
      </div>
    </div>
  );
}
