import React, { useContext, useState } from 'react'
import Logo from '../assets/images/sharanlogo.png'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '@/context/AppContext'
import e from 'cors'
import { showToast } from '@/helpers/showToast'
import axios from 'axios'

const Login = () =>{
    const navigate = useNavigate ()
    const {backendUrl, setIsLoggedin} = useContext(AppContent)
    const [state, setState] = useState('Register')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmitHandler = async (e) =>{
        try{
            e.preventDefault()
            axios.defaults.withCredentials = true
            if(state === 'Register'){
              const {data} =  await axios.post(backendUrl + '/auth/register', {name, email, password})
              if(data.success){
                setIsLoggedin(true)
                navigate('/')
              }else{
                showToast('error', error.message)
            }
            }else{
              const {data} =  await axios.post(backendUrl + '/auth/login', { email, password})
              if(data.success){
                setIsLoggedin(true)
                navigate('/')
              }else{
                showToast('error', error.message)
            }

            }
        }catch (error) {
            showToast('error', error.message)
        }
    }
    return(
        <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-200'>
            <img onClick={()=>navigate('/')} src ={Logo} alt ="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />
            <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
                <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === 'Register' ? 'Create Account' : 'Login'}</h2>
                <p className='text-center font-semibold text-white mb-3'>{state === 'Register' ? 'Create your account' : 'Login to your account'}</p>

            <form onSubmit={onSubmitHandler}>
                {state === 'Register' && 
                <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                {/* <img src={} alt="" /> */}
                <input 
                onChange={e => setName(e.target.value)} value={name} 
                className='bg-transparent outline-none' 
                type='text' placeholder='Enter your full name' required />
                </div>
                }
                
                <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                    {/* <img src={} alt="" /> */}
                    <input
                    onChange={e => setEmail(e.target.value)} value={email}
                    className='bg-transparent outline-none' type='email' placeholder='Enter your email' required />
                </div>
                <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                    {/* <img src={} alt="" /> */}
                    <input 
                    onChange={e => setPassword(e.target.value)} value={password}
                    className='bg-transparent outline-none' type='password' placeholder='Enter your password' required />
                </div>

                <p onClick={()=>navigate('/reset-password')} className='mb-4 text-indigo-500 cursor-pointer'>
                    Forgot password?
                </p>
                <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-[#00c6ff] to-[#f509d6] text-white'>
                    {state}
                </button>
                
            </form>
            {state==='Register' ? (<p className='text-indigo-500 cursor-pointer mt-4'>
                    Already have an account? <span onClick={()=>setState('Login')} className='underline'>Login here</span>
                </p>) 
                : 
                (<p className='text-indigo-500 cursor-pointer mt-4'>
                    Don't have an account? <span onClick={()=>setState('Register')} className='underline'>Register here</span>
                </p>) }
                
            </div>
        </div>
    )
}

export default Login