import React, { useEffect, useContext, useState }from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../assets/images/sharanlogo.png'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { showToast } from '@/helpers/showToast'
import { Card } from '@/components/ui/card'
import { useDispatch, useSelector } from 'react-redux'
import { AppContent } from '@/context/AppContext'
import { RouteIndex, RouteSignIn } from '@/helpers/RouteName'
import { useForm } from 'react-hook-form'
import { useFetch } from '@/hooks/useFetch'
import { removeUser } from '@/redux/user/user.slice';



const EmailVerify = () => {
  const navigate = useNavigate ()
  const dispath = useDispatch()
  const user = useSelector((state) => state.user)

  axios.defaults.withCredentials = true
  const backendUrl = import.meta.env.VITE_API_BASE_URL
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
  const onSubmitHandler = async (e) =>{
    try{
      e.preventDefault()
      const otpArray = inputRefs.current.map(e => e.value)
      const otp = otpArray.join('')

      const {data} = await axios.post(backendUrl + '/auth/verify-account', {otp})
      if(data.success){
        showToast('success', data.message)
        dispath(removeUser())
        navigate(RouteSignIn)
      }else{
        showToast('error', data.message)
      }

    }catch(error){
        showToast('error', error.message)
    }
  }
useEffect(()=>{
  user && user.user.isAccountVerified && navigate('/profile')
}, [user])
  return (
    <div className='flex justify-center items-center h-screen w-screen'>
      <Card className="w-[400px] p-5">
      <div className='flex justify-center items-center mb-2'>

      <Link to={RouteIndex}>
          <img src={Logo} />
      </Link>
      </div>
    
      <form onSubmit={onSubmitHandler}  className='p-8 w-96 text-sm'>
                  <h1 className='text-grey-900 text-2xl font-semibold text-center mb-4'>Verify your account</h1>
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
    </Card >
    </div>
  )
}

export default EmailVerify
