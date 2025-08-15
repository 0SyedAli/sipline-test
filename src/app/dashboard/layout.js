"use client";
import SideBar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isAuthenticated } from "../../utils/Auth";
export default function Dashboard({ children }) {
  const router = useRouter();
  // useEffect(() => {
  //   const isAuth = isAuthenticated();
  //   if (!isAuth) {
  //     router.replace("/auth/login");
  //   }
  // }, [router]);


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
