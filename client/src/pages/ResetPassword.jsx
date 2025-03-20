import React, { useState } from 'react'
import Logo from '../assets/images/sharanlogo.png'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { showToast } from '@/helpers/showToast'
import { Card } from '@/components/ui/card'
import { RouteSignIn, RouteIndex } from '@/helpers/RouteName'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"


const ResetPassword = () => {
  const backendUrl = import.meta.env.VITE_API_BASE_URL
  axios.defaults.withCredentials = true
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [newPassword, setnewPassword] = useState('')
  const[isEmailSent, setIsEmailSent] = useState('')
  const[otp, setOtp] = useState(0)
  const[isOtpSubmit, setIsOtpSubmit] = useState(false)


  const inputRefs = React.useRef([])
  const handleInput = (e, index) =>{
    if(e.target.value.length > 0 && index < inputRefs.current.length - 1){
      inputRefs.current[index + 1].focus()
    }
  }
  const handleKeyDown = (e, index) =>{
    if(e.key === 'Backspace' && e.target.value === '' && index > 0)
      inputRefs.current[index - 1].focus()
  }
  const handlePaste = (e) =>{
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('')
    pasteArray.forEach((char, index)=>{
      if(inputRefs.current[index]){
        inputRefs.current[index].value = char
      }
    })
  }
 

  const onSubmitEmail = async (e)=>{
    e.preventDefault()
    try{
      const {data} = await axios.post(backendUrl + '/auth/send-reset-otp', {email})
      data.success ? showToast('success', data.message) : showToast('error', data.message)
      data.success && setIsEmailSent(true)

    }catch(error){
      showToast('error', error.message)
    }
  }
  const onSubmitOtp = async (e)=>{
    e.preventDefault()
    const OtpArray = inputRefs.current.map(e => e.value)
    setOtp(OtpArray.join(''))
    setIsOtpSubmit(true)
  }

  const onSubmitNewPassword = async (e) =>{
    e.preventDefault()
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Check password validity first
    if (!passwordRegex.test(newPassword)) {
        showToast('error', 'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.');
        setError('Invalid password'); // Set an error message
        return; // Stop further execution
    }

    try {
        // Make the API request if the password is valid
        const { data } = await axios.post(`${backendUrl}/auth/reset-password`, { email, otp, newPassword });

        // Show success or error message based on API response
        if (data.success) {
            showToast('success', data.message);
            navigate('/sign-in'); // Redirect to sign-in
        } else {
            showToast('error', data.message);
        }
    } catch (error) {
        // Handle any API call errors
        showToast('error', 'Something went wrong. Please try again.');
        console.error(error);
    }

  }
  return (
    <div className='flex justify-center items-center h-screen w-screen'>
      <Card className="w-[400px] p-5">
      <div className='flex justify-center items-center mb-2'>

      <Link to={RouteIndex}>
          <img src={Logo} />
      </Link>
      </div>
      
    
    {!isEmailSent && 
    
    <form onSubmit={onSubmitEmail} className='p-8 w-96 text-sm'>
    <h1 className='text-grey-900 text-2xl font-semibold text-center mb-4'>Reset Password</h1>
    {/* <p className='text-center mb-6 text-indigo-300'>Enter your email id</p> */}
    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-white border'>
      <input type='email' placeholder='Enter your email' className='bg-transparent outline-none' 
      value={email} onChange={e => setEmail(e.target.value)} required/>
    </div>
    <button className='w-full py-3 bg-gradient-to-r from-[#00c6ff] to-[#f509d6] text-white rounded-full'>
            Submit
          </button>

    </form>
    }

    {/* otp Input */}
    {!isOtpSubmit && isEmailSent && 
    <form onSubmit={onSubmitOtp}  className='p-8 w-96 text-sm'>
            <h1 className='text-grey-900 text-2xl font-semibold text-center mb-4'>Reset password OTP</h1>
            <p className='text-center mb-6 text-grey-700'>Enter the 6-digit code sent to your email id</p>
            <div className='flex justify-between mb-8'>
              {Array(6).fill(0).map((_, index)=>(
                <Input type='text' maxLength='1' key={index} required onPaste={handlePaste}
                className='w-12 h-12 bg[#333A5C] text-grey-900 text-center text-xl rounded-md'
                ref={e=>inputRefs.current[index] = e}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e)=>handleKeyDown(e, index)}
                />
              ))}
            </div>
            <button className='w-full py-3 bg-gradient-to-r from-[#00c6ff] to-[#f509d6] text-white rounded-full'>
                Submit
              </button>
    
          </form>
          }

          {/* reset password form */}

          {isOtpSubmit && isEmailSent && 
          <form onSubmit={onSubmitNewPassword} className='p-8 w-96 text-sm'>
            <h1 className='text-grey-900 text-2xl font-semibold text-center mb-4'>New Password</h1>
            <p className='text-center mb-6 text-grey-700'>Enter the new password</p>
            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-white border'>
              <input type='password' placeholder='Enter your password' className='bg-transparent outline-none' 
              value={newPassword} onChange={e => setnewPassword(e.target.value)} required/>
            </div>
            <button className='w-full py-3 bg-gradient-to-r from-[#00c6ff] to-[#f509d6] text-white rounded-full'>
              Submit
            </button>

          </form>

    }
    </Card >
    </div>
  )
}

export default ResetPassword
