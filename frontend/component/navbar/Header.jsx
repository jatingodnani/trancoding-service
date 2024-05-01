import React from "react";
import NavItems from "./navi.tem";
import Toolbox from "./toolbox";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import Image from "next/image";
const Header = () => {
  return (
    <header
      className="sticky w-full top-0 left-0 z-[999] border-b text-white bg-[#232627]
   border-b-[#000] h-[80px]  p-10 rounded-md flex font-clashDisplay shadow-lg justify-between items-center"
    >
      <div>
        <Link href={"/"}><Image width={"80"} height="80"src={"/logo.png"}/></Link>
      </div>
      <div>
        <NavItems />
      </div>
      <div className="flex items-center gap-3">
        <Toolbox />
      </div>
    
      
    </header>
  );
};

export default Header;
