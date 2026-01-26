"use client";
import Link from "next/link";
import NotificationModal from "./notificationModalCont/NotificationModal";
import Image from "next/image";
import { useDisclosure } from "@chakra-ui/react";
import AddCategory from "./Modal/AddCategory";
import { useDispatch } from 'react-redux';
import { triggerRefresh } from "src/lib/redux/store/slices/refreshSlice";
import { useState } from "react";
import { RiMenu3Line } from "react-icons/ri";
import StatusUpdateModal from "./notificationModalCont/StatusModal";

const TopBar = () => {
  const dispatch = useDispatch();
  const { isOpen: isNotfOpen, onOpen:onNotfOpen, onClose:onNotfClose } = useDisclosure();
  const { isOpen: isStatusOpen, onOpen: onStatusOpen, onClose: onStatusClose } = useDisclosure();

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };


  return (
    <>
      <div className="topbar_container">
        <div>
          <h2 className="mb-1">
            Welcome
            <span>
              <Image
                src="/images/greeting.png"
                alt="greeting"
                width={50}
                height={50}
              />
            </span>
          </h2>
          <p>Are you thirsty? Would you like something?</p>
        </div>
        <div className="menu_wrapper">
          <button
            className="menu_toggle"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <RiMenu3Line />
          </button>
          <div
            className={`top_menu d-flex align-items-center gap-3 ${menuOpen ? "open" : ""
              }`}
          >
            <div onClick={onStatusOpen} className="btn btntheme3">
              Update Status
            </div>
            <button
              type="button"
              className="noti_btn"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              <Image
                src="/images/notification.png"
                alt="notification icon"
                width={25}
                height={25}
              />
            </button>
            <div onClick={onNotfOpen} className="btn btntheme3">
              Add Category
            </div>
            <Link href="/dashboard/addproduct" className="btn btntheme3">
              Add Product
            </Link>
          </div>
        </div>
      </div>
      <AddCategory
        btntitle="Add now"
        isOpen={isNotfOpen}
        onClose={onNotfClose}
        onSuccess={() => dispatch(triggerRefresh())}
      />
      <NotificationModal />
      <StatusUpdateModal
        isOpen={isStatusOpen}
        onClose={onStatusClose}
        onSuccess={() => dispatch(triggerRefresh())}
      />
    </>
  );
};

export default TopBar;
