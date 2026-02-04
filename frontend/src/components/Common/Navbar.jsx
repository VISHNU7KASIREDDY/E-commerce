import {React,useState} from 'react'
import { Link } from 'react-router-dom'
import {HiOutlineUser,HiOutlineShoppingCart,HiBars3BottomRight} from "react-icons/hi2"
const Navbar = () => {
    const [query, setQuery] = useState("");

  return (
    <>
      <nav className='container mx auto flex items-center justify-between py-4 px-6' >
        <div className='container w-1/2 flex items-center justify-evenly'>
        <div>
          <Link to='/' className='text-2xl font-bold ' >Spice Route</Link>
        </div>

        <div className='hidden md:flex space-x-6 '>
          <Link to='#' className='text-black  hover:text-orange-500 text-base font-medium ' >
            Shop
          </Link>
        </div>
        <div className='hidden md:flex space-x-6 '>
          <Link to='#' className='text-black hover:text-orange-500 text-base font-medium ' >
            About us
          </Link>
        </div>
        <div className='hidden md:flex space-x-6 '>
          <Link to='#' className='text-black hover:text-orange-500 text-base font-medium ' >
            Contact
          </Link>
        </div>
        </div>

        <div className='container w-1/2 flex items-center justify-around'>
          {}
          <div className='w-1/3'>
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-96 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"/>
          </div>
          <Link to='/login'  >
            <button className='px-4 py-2 bg-orange-500 text-white font-bold rounded hover:shadow-md'>
              Log in
            </button>
          </Link>
          <button className='relative  '>
            <HiOutlineShoppingCart className='h-8 w-8 hover:text-orange-500   text-black font-bold' />
          </button>
        </div>
      </nav>
    </>
  )
}

export default Navbar