"use client";
import Link from "next/link";
import NotificationModal from "./notificationModalCont/NotificationModal";
import Image from "next/image";
import { useDisclosure } from "@chakra-ui/react";
import AddCategory from "./Modal/AddCategory";
import { useDispatch } from 'react-redux';
import { triggerRefresh } from "src/lib/redux/store/slices/refreshSlice";

const TopBar = () => {
  const dispatch = useDispatch();

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <div className="topbar_container">
        <div>
          <h2 className="mb-1">
            Welcome Back, Travis
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
        <div className="d-flex align-items-center gap-3">
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
          <div onClick={onOpen} className="btn btntheme3">
            Add Category
          </div>
          <Link href="/dashboard/addproduct" className="btn btntheme3">
            Add Product
          </Link>
        </div>
      </div>
      <AddCategory
        btntitle="Add now"
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={() => dispatch(triggerRefresh())}
      />
      <NotificationModal />
    </>
  );
};

export default TopBar;
