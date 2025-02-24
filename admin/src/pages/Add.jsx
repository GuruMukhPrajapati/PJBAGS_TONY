import React, { useState } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Real Silver Poshak");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));
      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);
      const response = await axios.post(backendUrl + "/api/product/add", formData, { headers: { token } });
      if (response.data.success) {
        toast.success(response.data.message);
        setName('');
        setDescription('');
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice('');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3 bg-[#C4D9FF] text-white p-5 rounded-lg'>
      <div>
        <p className='mb-2 text-black'>Upload Image</p>
        <div className='flex gap-2'>
          {[image1, image2, image3, image4].map((img, index) => (
            <label key={index} htmlFor={`image${index + 1}`} className='cursor-pointer'>
              <img className='w-20 bg-gray-800 p-1 rounded' src={!img ? assets.upload_area : URL.createObjectURL(img)} alt='' />
              <input onChange={(e) => {
                const images = [setImage1, setImage2, setImage3, setImage4];
                images[index](e.target.files[0]);
              }} type='file' id={`image${index + 1}`} hidden />
            </label>
          ))}
        </div>
      </div>
      <div className='w-full'>
        <p className='mb-2 text-black'>Product name</p>
        <input onChange={(e) => setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded' type='text' placeholder='Type here' required />
      </div>
      <div className='w-full'>
        <p className='mb-2 text-black'>Product description</p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded' placeholder='Write content here' required />
      </div>
      <div className='w-full flex gap-4'>
        <div>
          <p className='mb-2 text-black'>Product category</p>
          <select onChange={(e) => setCategory(e.target.value)} className='px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded'>
            <option value='Men'>Men</option>
            <option value='Women'>Women</option>
            <option value='Kids'>Kids</option>
          </select>
        </div>
        <div>
          <p className='mb-2 text-black'>Sub category</p>
          <select onChange={(e) => setSubCategory(e.target.value)} className='px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded'>
            <option value='Sports'>Sports</option>
            <option value='College'>College</option>
            <option value='TrolleyBag'>Trolley Bag</option>
            <option value='Outdoor'>Outdoor</option>
          </select>
        </div>
        <div>
          <p className='mb-2 text-black'>Product Price</p>
          <input onChange={(e) => setPrice(e.target.value)} value={price} className='px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded w-24' type='number' placeholder='25' />
        </div>
      </div>
      <div className='flex items-center gap-2 mt-2'>
        <input onChange={() => setBestseller((prev) => !prev)} checked={bestseller} type='checkbox' id='bestseller' className='accent-gray-500' />
        <label className='cursor-pointer text-black' htmlFor='bestseller'>Add to bestseller</label>
      </div>
      <button type='submit' className='w-28 py-3 mt-4 bg-gray-700 hover:bg-gray-600 text-white rounded'>ADD</button>
    </form>
  );
};

export default Add;
