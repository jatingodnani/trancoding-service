import { navItems } from "../../constants";
import Link from 'next/link'
import React from 'react'

function NevItems() {
  return (
    <div className='w-full hidden md:flex item-center justify-between font-semibold'>
        {
            navItems.map((i,index)=>(
           <Link className='px-5 text-lg' key={index} href="/">
          {i.title}
           </Link>
            ))
        }
    </div>
  )
}

export default NevItems
