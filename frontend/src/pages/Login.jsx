import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  
  // Form validation errors
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Validate name input
  const validateName = (value) => {
    if (value.length < 3) {
      setNameError('Name must be at least 3 characters long');
      return false;
    } else if (value.length > 20) {
      setNameError('Name must be less than 20 characters');
      return false;
    } else if (/^\d/.test(value)) {
      setNameError('Name cannot start with a number');
      return false;
    } else if (/^[^a-zA-Z]/.test(value)) {
      setNameError('Name cannot start with a special character');
      return false;
    } else {
      setNameError('');
      return true;
    }
  };

  // Validate email input
  const validateEmail = (value) => {
    // Basic email regex pattern to check format username@domainname
    const emailRegex = /^[a-zA-Z][a-zA-Z0-9._-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(value)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    
    // Check for common email provider spelling mistakes
    const emailParts = value.split('@');
    if (emailParts.length === 2) {
      const domain = emailParts[1].toLowerCase();
      
      // Check Gmail spelling
      if (domain.includes('gmail') && domain !== 'gmail.com') {
        setEmailError('Did you mean gmail.com?');
        return false;
      }
      
      // Check Yahoo spelling
      if ((domain.includes('yahoo') || domain.includes('yaho') || domain.includes('yahooo')) && 
          domain !== 'yahoo.com' && domain !== 'yahoo.co.in' && domain !== 'yahoo.co.uk') {
        setEmailError('Did you mean yahoo.com?');
        return false;
      }
      
      // Check Hotmail spelling
      if (domain.includes('hotmail') && domain !== 'hotmail.com') {
        setEmailError('Did you mean hotmail.com?');
        return false;
      }
      
      // Check Outlook spelling
      if (domain.includes('outlook') && 
          domain !== 'outlook.com' && domain !== 'outlook.co.in') {
        setEmailError('Did you mean outlook.com?');
        return false;
      }
    }
    
    setEmailError('');
    return true;
  };

  // Handle name change
  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    if (currentState === 'Sign Up') {
      validateName(value);
    }
  };

  // Handle email change
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (value.length < 6) {
      setPasswordError('Password must be at least 6 characters');
    } else {
      setPasswordError('');
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    
    // For Sign Up, validate all fields
    if (currentState === 'Sign Up') {
      const isNameValid = validateName(name);
      const isEmailValid = validateEmail(email);
      const isPasswordValid = password.length >= 6;
      
      if (!isNameValid || !isEmailValid || !isPasswordValid) {
        toast.error('Please fix the errors in the form');
        return;
      }
    } else {
      // For Login, just validate email
      if (!validateEmail(email)) {
        toast.error('Please enter a valid email address');
        return;
      }
    }

    try {
      if (currentState === 'Sign Up') {
        const response = await axios.post(backendUrl + '/api/user/register', { name, email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          toast.success('Account created successfully!');
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(backendUrl + '/api/user/login', { email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          toast.success('Logged in successfully!');
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>
      
      {currentState === 'Sign Up' && (
        <div className="w-full">
          <input 
            onChange={handleNameChange} 
            value={name} 
            type="text" 
            className='w-full px-3 py-2 border border-gray-800' 
            placeholder='Name' 
            required
          />
          {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
        </div>
      )}
      
      <div className="w-full">
        <input 
          onChange={handleEmailChange} 
          value={email} 
          type="email" 
          className='w-full px-3 py-2 border border-gray-800' 
          placeholder='Email' 
          required
        />
        {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
      </div>
      
      <div className="w-full">
        <input 
          onChange={handlePasswordChange} 
          value={password} 
          type="password" 
          className='w-full px-3 py-2 border border-gray-800' 
          placeholder='Password' 
          required
        />
        {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
      </div>
      
      <div className='w-full flex justify-between text-sm mt-2'>
        <p className='cursor-pointer'>Forgot your password?</p>
        {
          currentState === 'Login'
          ? <p onClick={() => {setCurrentState('Sign Up'); setName(''); setEmail(''); setPassword(''); setNameError(''); setEmailError(''); setPasswordError('');}} className='cursor-pointer'>Create account</p>
          : <p onClick={() => {setCurrentState('Login'); setName(''); setEmail(''); setPassword(''); setNameError(''); setEmailError(''); setPasswordError('');}} className='cursor-pointer'>Login Here</p>
        }
      </div>
      
      <button className='bg-black text-white font-light px-8 py-2 mt-4'>
        {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
      </button>
    </form>
  );
};

export default Login;