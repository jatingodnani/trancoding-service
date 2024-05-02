import React from 'react'

function Footer() {
  return (
    <div className="sticky w-full top-0 left-0 z-[999] border-b text-white bg-[#232627]
    border-b-[#000] h-[80px]  p-10 rounded-md flex font-clashDisplay  shadow-lg justify-between items-center">
      <p>
        <div className='flex gap-2 items-center'>Made with <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" 
      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
       stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart text-red-500"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
     </div> By kartik and jatin
      </p>
    </div>
  )
}

export default Footer
