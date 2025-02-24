import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { FaWhatsapp, FaFacebook, FaInstagram } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'

const Footer = () => {
  const navigate = useNavigate()

  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        <div>
          <img src={assets.logo} className='mb-5 w-32' alt="" />
          <p className='w-full md:w-2/3 text-gray-600'>
            "At PJ Bags, we believe that your accessories should not just complete your look but elevate your entire experience. Our bags are thoughtfully crafted to blend contemporary designs with exceptional functionality, making sure you're always ready to face the day with confidence and style."
          </p>
        </div>  
        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>
              <button 
                onClick={() => navigate('/')}
                className='hover:text-black transition-colors'
              >
                Home
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigate('/collection')}
                className='hover:text-black transition-colors'
              >
                Collection
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigate('/about')}
                className='hover:text-black transition-colors'
              >
                About
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigate('/contact')}
                className='hover:text-black transition-colors'
              >
                Contact
              </button>
            </li>
          </ul>
        </div>
        <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <div className='flex gap-4 text-gray-600'>
            <a 
              href="https://wa.me/919694543817" 
              target="_blank" 
              rel="noopener noreferrer"
              className='text-2xl hover:text-green-500 transition-colors'
            >
              <FaWhatsapp />
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className='text-2xl hover:text-blue-600 transition-colors'
            >
              <FaFacebook />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className='text-2xl hover:text-pink-600 transition-colors'
            >
              <FaInstagram />
            </a>
            <a 
              href="mailto:praveenjoshiw@gmail.com"
              className='text-2xl hover:text-red-500 transition-colors'
            >
              <MdEmail />
            </a>
          </div>
        </div>
      </div>
      <div>
        <hr />
        <p className='py-5 text-sm text-center'>Copyright 2025@ Dailyshopping - All Right Reserved.</p>
      </div>
    </div>
  )
}

export default Footer