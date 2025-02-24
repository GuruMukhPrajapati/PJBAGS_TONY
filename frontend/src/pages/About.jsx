import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="PJ Bags Collection" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>
            PJ Bags has established itself as a premier destination for high-quality, stylish bags that combine functionality with fashion. With years of experience in the industry, we understand that a bag is more than just an accessory – it's an essential part of your daily life and personal style statement.
          </p>
          <p>
            Our carefully curated collection features everything from elegant handbags and practical totes to durable backpacks and sophisticated briefcases. Each piece in our collection is selected with attention to detail, quality of materials, and contemporary design trends, ensuring that our customers always find the perfect bag to suit their needs.
          </p>
          <b className='text-gray-800'>Our Mission</b>
          <p>
            At PJ Bags, our mission is to provide our customers with exceptional quality bags that enhance their lifestyle. We're committed to offering a thoughtfully curated selection of bags that combine style, functionality, and durability, all while delivering outstanding value and customer service that exceeds expectations.
          </p>
        </div>
      </div>

      <div className='text-xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance:</b>
          <p className='text-gray-600'>Every bag in our collection undergoes rigorous quality checks to ensure durability, craftsmanship, and excellence in every detail.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convenience:</b>
          <p className='text-gray-600'>Shop our extensive collection online with easy navigation, secure checkout, and fast shipping to your doorstep.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service:</b>
          <p className='text-gray-600'>Our dedicated team is always ready to assist you with product selection, order tracking, and after-sales support.</p>
        </div>
      </div>

      <NewsletterBox/>
    </div>
  )
}

export default About