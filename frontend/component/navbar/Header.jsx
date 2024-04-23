
import React from 'react'
import NavItems from "./navi.tem"
import Toolbox from './toolbox'
import Link from 'next/link'

const Header = () => {
  return (
   <header className='sticky w-full top-0 left-0 z-[999] border-b text-black
   border-b-[#000] h-[80px]  p-10 flex justify-between items-center'>
   <div>
    <Link href={"/"}>
    Transcoding service
    </Link>
   </div>
   <div>
    <NavItems/>
   </div>
   <div className='flex items-center gap-3'>
   <Toolbox/>
   </div>
   </header>
  )
}

export default Header