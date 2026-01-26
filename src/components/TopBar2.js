"use client";
import Link from "next/link";
import Image from "next/image";
import AddBusCategory from "./Modal/AddBusCategory";
import { useDispatch } from 'react-redux';
import { triggerRefresh } from "src/lib/redux/store/slices/refreshSlice";
import { useState } from "react";
import { RiMenu3Line } from "react-icons/ri";

const TopBar2 = () => {
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

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

        <div className={`top_menu d-flex align-items-center gap-3 ${menuOpen ? "open" : ""}`}>
          <div onClick={onOpen} className="btn btntheme3">
            Add Category
          </div>
        </div>
      </div>

      <AddBusCategory
        btntitle="Add now"
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={() => dispatch(triggerRefresh())}
      />
    </>
  );
};

export default TopBar2;
