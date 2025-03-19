import React, { useState } from 'react'
import logo from '@/assets/images/sharanlogo.png'
import { Button } from './ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { MdLogin } from "react-icons/md";
import SearchBox from './SearchBox';
import { RouteBlogAdd, RouteIndex, RouteProfile, RouteSignIn } from '@/helpers/RouteName';
import { useDispatch, useSelector } from 'react-redux';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import usericon from '@/assets/images/user.png'

import { FaRegUser } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { IoLogOutOutline, IoSearch } from "react-icons/io5";
import { removeUser } from '@/redux/user/user.slice';
import { showToast } from '@/helpers/showToast';
import { getEnv } from '@/helpers/getEnv';
import { IoMdSearch } from "react-icons/io";
import { AiOutlineMenu } from "react-icons/ai";
import { useSidebar } from './ui/sidebar';
import axios from 'axios'

const Topbar = () => {
    const { toggleSidebar } = useSidebar()
    const [showSearch, setShowSearch] = useState(false)
    const dispath = useDispatch()
    const navigate = useNavigate()
    const user = useSelector((state) => state.user)
    const backendUrl = import.meta.env.VITE_API_BASE_URL

    const sendVerificationOtp = async () => {
        try{
            axios.defaults.withCredentials = true
            const {data} = await axios.post(backendUrl + '/auth/send-verify-otp')
            if(data.success){
                navigate('/email-verify')
                showToast('success', data.message)

            }else{
                showToast('error', data.message)
            }

        }catch(error){
            showToast('error', error.message)
        }

    }


    const handleLogout = async () => {
        try {
            const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/auth/logout`, {
                method: 'get',
                credentials: 'include',
            })
            const data = await response.json()
            if (!response.ok) {
                return showToast('error', data.message)
            }
            dispath(removeUser())
            navigate(RouteSignIn)
            showToast('success', data.message)
        } catch (error) {
            showToast('error', error.message)
        }
    }

    const toggleSearch = () => {
        setShowSearch(!showSearch)
    }

    return (
        <div className='flex justify-between items-center h-16 fixed w-full z-20 bg-white px-5 border-b shadow-sm'>
            <div className='flex justify-center items-center gap-2'>
                <button onClick={toggleSidebar} className='md:hidden' type='button'>
                    <AiOutlineMenu />
                </button>
                <Link to={RouteIndex}>
                    <img src={logo} className='md:w-auto w-48' />
                </Link>
            </div>
            <div className='w-[500px]'>
                <div className={`md:relative md:block absolute bg-white left-0 w-full md:top-0 top-16 md:gap-6 md:p-0 p-5`}>  
                    <SearchBox />
                </div>
            </div>
            {/* <div>
                <Link to={RouteIndex}>Home</Link>
            </div>
            <div>
                <Link to='https://isharankumar.com'>Portfolio</Link>
            </div> */}
            <div className='flex items-center gap-2'>

                {/* <button onClick={toggleSearch} type='button' className='md:hidden block'>
                    <IoMdSearch size={25} />
                </button> 
                To toggle search box-> ${showSearch ? 'block' : 'hidden'}
                */}

                {!user.isLoggedIn ?
                    <Button asChild className="rounded-full bg-gradient-to-r from-[#00c6ff] to-[#f509d6]">
                        <Link to={RouteSignIn}  >
                            <MdLogin />
                            Get In
                        </Link>
                    </Button>
                    :
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Avatar>
                                <AvatarImage src={user.user.avatar || usericon} />
                            </Avatar>

                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>
                                <p>{user.user.name}
                                { 
                                    user.user.isAccountVerified ? (
                                        <svg className='inline-block ml-1 mb-1' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="18" height="18"><path fill="#16a34a" fill-rule="evenodd" d="M10.9388 1.13669C11.4793 0.449229 12.5208 0.44923 13.0613 1.13669L14.808 3.35829L17.527 2.58767C18.3683 2.34921 19.2109 2.96138 19.2441 3.83525L19.3514 6.65926L22.004 7.63397C22.8249 7.93559 23.1467 8.92611 22.6599 9.6526L21.0868 12.0003L22.6599 14.3481C23.1467 15.0746 22.8249 16.0651 22.004 16.3667L19.3514 17.3414L19.2441 20.1654C19.2109 21.0393 18.3683 21.6515 17.527 21.413L14.808 20.6424L13.0613 22.864C12.5208 23.5515 11.4793 23.5515 10.9388 22.864L9.19206 20.6424L6.47311 21.413C5.63175 21.6515 4.78916 21.0393 4.75596 20.1654L4.64866 17.3414L1.99603 16.3667C1.17519 16.0651 0.853351 15.0746 1.34014 14.3481L2.91324 12.0003L1.34013 9.6526C0.85335 8.92611 1.17519 7.93559 1.99603 7.63397L4.64866 6.65926L4.75596 3.83525C4.78916 2.96138 5.63175 2.34921 6.47311 2.58767L9.19206 3.35829L10.9388 1.13669ZM8.35859 11.8486C8.65148 11.5557 9.12635 11.5557 9.41925 11.8486L10.8889 13.3182L14.3586 9.84858C14.6515 9.55568 15.1264 9.55568 15.4192 9.84858C15.7121 10.1415 15.7121 10.6163 15.4192 10.9092L11.4192 14.9092C11.1264 15.2021 10.6515 15.2021 10.3586 14.9092L8.35859 12.9092C8.06569 12.6163 8.06569 12.1415 8.35859 11.8486Z" clip-rule="evenodd" class="color000 svgShape"></path></svg>
                                        
                                    ) : (<Link onClick={sendVerificationOtp} className='text-red-600 ml-1'>
                                        Verify
                                    </Link> )
                                    }    
                                </p> 
                                
                                <p className='text-sm'>{user.user.email}</p>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild className="cursor-pointer">
                                <Link to={RouteProfile}>
                                    <FaRegUser />
                                    Profile
                                </Link>
                            </DropdownMenuItem>
                            {user && user.isLoggedIn && user.user.role === 'admin'
                            ? <>
                            <DropdownMenuItem asChild className="cursor-pointer">
                                <Link to={RouteBlogAdd}>
                                    <FaPlus />
                                    Create Blog
                                </Link>
                            </DropdownMenuItem>
                            </>
                            :
                            <></>
                        }
                            <DropdownMenuSeparator />

                            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                                <IoLogOutOutline color='red' />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                }


            </div>



        </div >
    )
}

export default Topbar