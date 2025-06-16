"use client"
import Providers from "./providers";
import ToastConfig from "../toast.config";
import "react-toastify/dist/ReactToastify.css";
export default function Root({ children }) {
  return (
    <>
        <Providers>
          {children}
        </Providers>
      <ToastConfig />
    </>
  );
}
