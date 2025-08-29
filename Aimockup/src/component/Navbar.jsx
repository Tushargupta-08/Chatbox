import React from 'react'

const Navbar = () => {
  return (
    <div className='flex flex-row bg-gradient-to-bl from-black to-white p-4 justify-between items-center' >
     <div>

      <h2 className='text-lg font-semibold'>ChatBot</h2>
     </div>
   
   <div>

    <button className='bg-white text-black p-2 rounded outline-none cursor pointer w-20'> Login</button>
   </div>
    </div>
  )
}

export default Navbar
