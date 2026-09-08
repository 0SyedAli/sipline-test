"use client";

import SideBar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useFcmToken from "@/hooks/useFcmToken";

export default function Dashboard({ children }) {
  const router = useRouter();
  const [adminId, setAdminId] = useState(null);

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const admin = JSON.parse(sessionStorage.getItem("admin"));

  //     if (!admin && !admin?.shopCreated) {
  //       router.replace("/auth/login");
  //       sessionStorage.clear();
  //       return;

  //     } else if (admin?.shopCreated) {
  //       if (admin?.onboardingStatus === "incomplete") {
  //         router.push(`https://apiforapp.link/api/reauth/${adminData?._id}`);
  //         sessionStorage.clear();
  //         return;
  //       } else if (admin?.onboardingStatus === "pending") {
  //         router.push("/auth/login");
  //         sessionStorage.clear();
  //         return;
  //       }
  //     }
  //     setAdminId(admin._id);
  //   }
  // }, []);

  // Load admin from sessionStorage on client only
  useEffect(() => {
    if (typeof window !== "undefined") {
      const admin = JSON.parse(sessionStorage.getItem("admin"));

      // If admin does not exist or shopCreated is false, redirect to login
      if (!admin || !admin?.shopCreated) {
        router.replace("/auth/login");
        sessionStorage.clear();
        return;
      }

      // Check onboarding status
      if (admin?.onboardingStatus === "incomplete") {
        // Redirect to reauth page if onboarding is incomplete
        router.push(`https://apiforapp.link/api/reauth/${admin._id}`);
        sessionStorage.clear();
        return;
      } else if (admin?.onboardingStatus === "pending") {
        // Redirect to login if onboarding is pending
        router.push("/auth/login");
        sessionStorage.clear();
        return;
      }

      // If all checks pass, store adminId and proceed
      setAdminId(admin._id); // Store adminId safely
    }
  }, []);

  // Register FCM token when adminId becomes available
  useFcmToken(adminId);

  return (
    <div className="dashboard_container">
      <SideBar />
      <div className="dashboard_panel pt-0">
        <TopBar />
        {children}
      </div>
    </div>
  );
}
