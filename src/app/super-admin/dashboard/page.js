import DashboardPanel from "./dashboard-panel/page";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function Dashboard() {
  return (
    <>
      <ToastContainer />
      <DashboardPanel />
    </>
  );
}
