"use client"
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BootstrapClients from '@/components/BootstrapClients';
import { Provider } from "react-redux";
import { store } from "../lib/redux/store/index";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <Provider store={store}>
          <ToastContainer />
          {children}
        </Provider>
        <BootstrapClients />
      </body>
    </html>
  );
}