import React, { useState } from "react";
import Logo from "./app_logo";
import Menu from "./Menu";
import Slide from "./Slide";
import links from "./links.json";
import { NavLink } from "react-router-dom";
export function NavBar() {
  const [menuOpened, setMenuOpened] = useState(false);
  const openSlide = () => {
    const slide = document.getElementById("slide");
    if (menuOpened) {
      slide.classList.add("translate-x-full");
      setTimeout(() => {
        slide.classList.add("hidden");
      }, 300);
    } else {
      slide.classList.remove("hidden");
      slide.classList.remove("translate-x-full");
    }
  };
  const openMenu = () => {
    openSlide();
    setMenuOpened((prev) => !prev);
  };
  const changePath = () => {
    openSlide();
    setMenuOpened(false);
  };

  return (
    <div className="pt-4 fixed top-0 pb-2 bg-black bg-opacity-20 backdrop-blur-md w-full z-10">
      <nav className="display  flex items-center justify-between px-8 h-fit">
        <div className="font-bold text-white">
          <Logo width="2rem" />
        </div>
        <div className="text-white text-4xl lg:hidden transition-all">
          <Menu onClick={openMenu} opened={menuOpened} />
        </div>
        <ul className="hidden h-100 lg:flex text-white text-3xl gap-16 items-center">
          {links.map((link) => (
            <li
              id={link.name}
              className="border-b-4 relative text-2xl isolate z-1 hover:rotate-6 border-transparent pb-2  hover:text-[#ff004c80]"
              key={link.id}
            >
              <NavLink to={link.path}>
                <span>
                  <ion-icon name={link.icon}></ion-icon>
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <Slide onPathChange={changePath} menuOpened={menuOpened} />
    </div>
  );
}
export function Footer() {
  return <div>footer</div>;
}
