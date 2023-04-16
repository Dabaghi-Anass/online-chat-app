import React, { useState } from "react";
import links from "./links.json";
import { Link } from "react-router-dom";
const Slide = ({onPathChange }) => {
  const [slideLinks] = useState(links);
  return (
      <div id="slide"
      className={`text-xl hidden h-[92vh] mt-2 text-white absolute translate-x-full  tansition lg:hidden duration-300  bg-gradient-to-bl from-[hsl(271,65%,11%)] to-[hsl(270,79%,32%)] w-full place-content-left p-4`}
    >
      <ul className="p-4 mt-8 flex flex-col gap-4 items-start text-2xl ">
        {slideLinks &&
          slideLinks.map((link) => (
            <li
              onClick={onPathChange}
              key={link.id}
              className="border-b border-[#9507dc70] pb-4 w-full text-left"
            >
              <Link
                to={link.path}
                className="flex items-center gap-8 uppercase"
              >
                <s className="text-2xl">
                  <ion-icon name={link.icon}></ion-icon>
                </s>
                <span>{link.name}</span>
              </Link>
              <span></span>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Slide;
