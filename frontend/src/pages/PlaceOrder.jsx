import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {
    const [method, setMethod] = useState('cod');
    const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);
    
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: ''
    });

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: ''
    });

    const validateField = (name, value) => {
        let error = '';
        
        switch (name) {
            case 'firstName':
            case 'lastName':
                if (!/^[A-Za-z\s]{2,30}$/.test(value)) {
                    error = 'Only letters allowed, 2-30 characters';
                }
                break;
            
            case 'email':
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    error = 'Please enter a valid email address';
                }
                break;

            case 'street':
                if (value.length < 5) {
                    error = 'Street address must be at least 5 characters';
                }
                break;

            case 'city':
            case 'state':
            case 'country':
                if (!/^[A-Za-z\s]{2,30}$/.test(value)) {
                    error = 'Only letters allowed, 2-30 characters';
                }
                break;

            case 'zipcode':
                if (!/^\d{5,6}$/.test(value)) {
                    error = 'Zipcode must be 5-6 digits';
                }
                break;

            case 'phone':
                if (!/^\d{10,12}$/.test(value)) {
                    error = 'Phone number must be 10-12 digits';
                }
                break;

            default:
                break;
        }
        return error;
    };

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        
        const error = validateField(name, value);
        
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));

        setFormData(data => ({ ...data, [name]: value }));
    };

    const initPay = (order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: 'Order Payment',
            description: 'Order Payment',
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {
                try {
                    const { data } = await axios.post(backendUrl + '/api/order/verifyRazorpay', response, { headers: { token } })
                    if (data.success) {
                        navigate('/orders')
                        setCartItems({})
                    }
                } catch (error) {
                    console.log(error)
                    toast.error(error)
                }
            }
        }
        const rzp = new window.Razorpay(options)
        rzp.open()
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        // Validate all fields
        let hasErrors = false;
        const newErrors = {};
        
        Object.keys(formData).forEach(field => {
            const error = validateField(field, formData[field]);
            if (error) {
                hasErrors = true;
                newErrors[field] = error;
            }
        });

        if (hasErrors) {
            setErrors(newErrors);
            toast.error('Please fix the errors in the form');
            return;
        }

        try {
            let orderItems = []

            for (const items in cartItems) {
                for (const item in cartItems[items]) {
                    if (cartItems[items][item] > 0) {
                        const itemInfo = structuredClone(products.find(product => product._id === items))
                        if (itemInfo) {
                            itemInfo.size = item
                            itemInfo.quantity = cartItems[items][item]
                            orderItems.push(itemInfo)
                        }
                    }
                }
            }

            let orderData = {
                address: formData,
                items: orderItems,
                amount: getCartAmount() + delivery_fee
            }

            switch (method) {
                case 'cod':
                    const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } })
                    if (response.data.success) {
                        setCartItems({})
                        navigate('/orders')
                    } else {
                        toast.error(response.data.message)
                    }
                    break;

                case 'stripe':
                    const responseStripe = await axios.post(backendUrl + '/api/order/stripe', orderData, { headers: { token } })
                    if (responseStripe.data.success) {
                        const { session_url } = responseStripe.data
                        window.location.replace(session_url)
                    } else {
                        toast.error(responseStripe.data.message)
                    }
                    break;

                case 'razorpay':
                    const responseRazorpay = await axios.post(backendUrl + '/api/order/razorpay', orderData, { headers: { token } })
                    if (responseRazorpay.data.success) {
                        initPay(responseRazorpay.data.order)
                    }
                    break;

                default:
                    break;
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
            <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
                <div className='text-xl sm:text-2xl my-3'>
                    <Title text1={'DELIVERY'} text2={'INFORMATION'} />
                </div>

                <div className='flex gap-3'>
                    <div className='w-full'>
                        <input 
                            required 
                            onChange={onChangeHandler} 
                            name='firstName' 
                            value={formData.firstName} 
                            className={`border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded py-1.5 px-3.5 w-full`} 
                            type="text" 
                            placeholder='First name' 
                        />
                        {errors.firstName && <p className='text-red-500 text-xs mt-1'>{errors.firstName}</p>}
                    </div>
                    <div className='w-full'>
                        <input 
                            required 
                            onChange={onChangeHandler} 
                            name='lastName' 
                            value={formData.lastName} 
                            className={`border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded py-1.5 px-3.5 w-full`} 
                            type="text" 
                            placeholder='Last name' 
                        />
                        {errors.lastName && <p className='text-red-500 text-xs mt-1'>{errors.lastName}</p>}
                    </div>
                </div>

                <div>
                    <input 
                        required 
                        onChange={onChangeHandler} 
                        name='email' 
                        value={formData.email} 
                        className={`border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded py-1.5 px-3.5 w-full`} 
                        type="email" 
                        placeholder='Email address' 
                    />
                    {errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email}</p>}
                </div>

                <div>
                    <input 
                        required 
                        onChange={onChangeHandler} 
                        name='street' 
                        value={formData.street} 
                        className={`border ${errors.street ? 'border-red-500' : 'border-gray-300'} rounded py-1.5 px-3.5 w-full`} 
                        type="text" 
                        placeholder='Street' 
                    />
                    {errors.street && <p className='text-red-500 text-xs mt-1'>{errors.street}</p>}
                </div>

                <div className='flex gap-3'>
                    <div className='w-full'>
                        <input 
                            required 
                            onChange={onChangeHandler} 
                            name='city' 
                            value={formData.city} 
                            className={`border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded py-1.5 px-3.5 w-full`} 
                            type="text" 
                            placeholder='City' 
                        />
                        {errors.city && <p className='text-red-500 text-xs mt-1'>{errors.city}</p>}
                    </div>
                    <div className='w-full'>
                        <input 
                            onChange={onChangeHandler} 
                            name='state' 
                            value={formData.state} 
                            className={`border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded py-1.5 px-3.5 w-full`} 
                            type="text" 
                            placeholder='State' 
                        />
                        {errors.state && <p className='text-red-500 text-xs mt-1'>{errors.state}</p>}
                    </div>
                </div>

                <div className='flex gap-3'>
                    <div className='w-full'>
                        <input 
                            required 
                            onChange={onChangeHandler} 
                            name='zipcode' 
                            value={formData.zipcode} 
                            className={`border ${errors.zipcode ? 'border-red-500' : 'border-gray-300'} rounded py-1.5 px-3.5 w-full`} 
                            type="number" 
                            placeholder='Zipcode' 
                        />
                        {errors.zipcode && <p className='text-red-500 text-xs mt-1'>{errors.zipcode}</p>}
                    </div>
                    <div className='w-full'>
                        <input 
                            required 
                            onChange={onChangeHandler} 
                            name='country' 
                            value={formData.country} 
                            className={`border ${errors.country ? 'border-red-500' : 'border-gray-300'} rounded py-1.5 px-3.5 w-full`} 
                            type="text" 
                            placeholder='Country' 
                        />
                        {errors.country && <p className='text-red-500 text-xs mt-1'>{errors.country}</p>}
                    </div>
                </div>

                <div>
                    <input 
                        required 
                        onChange={onChangeHandler} 
                        name='phone' 
                        value={formData.phone} 
                        className={`border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded py-1.5 px-3.5 w-full`} 
                        type="number" 
                        placeholder='Phone' 
                    />
                    {errors.phone && <p className='text-red-500 text-xs mt-1'>{errors.phone}</p>}
                </div>
            </div>

            <div className='mt-8'>
                <div className='mt-8 min-w-80'>
                    <CartTotal />
                </div>

                <div className='mt-12'>
                    <Title text1={'PAYMENT'} text2={'METHOD'} />
                    <div className='flex gap-3 flex-col lg:flex-row'>
                        <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
                            <img className='h-5 mx-4' src={assets.stripe_logo} alt="" />
                        </div>
                        <div onClick={() => setMethod('razorpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`}></p>
                            <img className='h-5 mx-4' src={assets.razorpay_logo} alt="" />
                        </div>
                        <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
                            <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
                        </div>
                    </div>

                    <div className='w-full text-end mt-8'>
                        <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>PLACE ORDER</button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default PlaceOrder