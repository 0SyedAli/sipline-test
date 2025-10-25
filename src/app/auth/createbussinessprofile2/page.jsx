"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthBtn } from "@/components/AuthBtn/AuthBtn";
import { Textarea } from "@chakra-ui/react";
import { toast } from "react-toastify";
import { useHeader } from "@/components/context/HeaderContext";
import SpinnerLoading from "@/components/Spinner/SpinnerLoading";
import Map from "@/components/MapShop";

export default function CreateBusinessProfilePage2() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const header = useHeader();

  const [barDetail, setBarDetail] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [shopId, setShopId] = useState("");
  const [locationData, setLocationData] = useState({
    address: "",
    latitude: null,
    longitude: null,
  });

  // ✅ Get shop_id from URL
  useEffect(() => {
    const id = searchParams.get("shop_id");
    if (id) setShopId(id);
  }, [searchParams]);

  // ✅ Get admin data from sessionStorage
  useEffect(() => {
    const adminData = sessionStorage.getItem("admin");
    if (adminData) {
      try {
        const parsed = JSON.parse(adminData);
        if (parsed?._id) {
          setAdminId(parsed._id);
        } else {
          router.replace("/auth/login");
        }
      } catch (err) {
        console.error("Error parsing admin data:", err);
        router.replace("/auth/login");
      }
    } else {
      router.replace("/auth/login");
    }
  }, [router]);

  // ✅ Handle form submit
  const handleNext = async (e) => {
    e.preventDefault();

    const { latitude, longitude, address } = locationData;

    if (!latitude || !longitude || !address) {
      toast.error("Please select a valid location before continuing.");
      return;
    }

    if (!barDetail.trim()) {
      toast.error("Please enter bar details.");
      return;
    }

    setIsLoading(true);

    try {
      const apiPayload = new FormData();
      apiPayload.append("adminId", adminId);
      apiPayload.append("shopId", shopId);
      apiPayload.append("latitude", latitude);
      apiPayload.append("longitude", longitude);
      apiPayload.append("address", address);
      apiPayload.append("barDetails", barDetail);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}admin/updateShop`,
        {
          method: "POST",
          body: apiPayload,
        }
      );

      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "Failed to update shop");

      if (result?.success) {
        toast.success(result?.msg || "Shop updated successfully!");
        router.push(`createbussinessprofile3?shop_id=${result?.data?._id}`);
      } else {
        toast.error(result?.msg || "Invalid data received");
        setError(result?.msg || "Invalid data received");
      }
    } catch (err) {
      console.error("API Error:", err);
      setError(err.message);
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="createShop2">
      <div className="form_head">
        <h2>{header?.title}</h2>
        <p>{header?.description}</p>
      </div>

      <form onSubmit={handleNext}>
        <fieldset>
          <Map setLocationData={setLocationData} />

          <Textarea
            placeholder="Bar Details"
            className="textarea_field2 mb-4"
            value={barDetail}
            onChange={(e) => setBarDetail(e.target.value)}
          />

          {error && <p className="text-danger">{error}</p>}

          <AuthBtn title="Next" type="submit" disabled={isLoading} />
        </fieldset>
      </form>

      {/* {isLoading && <SpinnerLoading />} */}
    </div>
  );
}
