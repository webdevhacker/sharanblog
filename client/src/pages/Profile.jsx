import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { z, ZodReadonly } from 'zod'
import { getEnv } from '@/helpers/getEnv'
import { showToast } from '@/helpers/showToast'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { Textarea } from "@/components/ui/textarea"
import { useFetch } from '@/hooks/useFetch'
import Loading from '@/components/Loading'
import { IoCameraOutline } from "react-icons/io5";
import Dropzone from 'react-dropzone'
import { setUser } from '@/redux/user/user.slice'
import moment from 'moment'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { RouteEmailVerify } from '@/helpers/RouteName'
import VerifiedBadge from '../assets/images/verified-badge.svg'
//import { handleError } from "../helpers/handleError.js"

const Profile = () => {
    const navigate = useNavigate()

    const [filePreview, setPreview] = useState()
    const [file, setFile] = useState()
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

    const { data: userData, loading, error } = useFetch(`${getEnv('VITE_API_BASE_URL')}/user/get-user/${user.user._id}`,
        { method: 'get', credentials: 'include' },

    )

    // const dateTransformer = z.string().transform((val) => {
    //     const date = new Date(val);
    //     const year = date.getFullYear();
    //     const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    //     const day = String(date.getDate()).padStart(2, '0');
    //     return `${year}-${month}-${day}`;
    //   });

    const dispath = useDispatch()

    const formSchema = z.object({
        name: z.string().min(3, 'Name must be at least 3 character long.'),
        email: z.string().email(),
        bio: z.string().min(3, 'Bio must be at least 3 character long.'),
        //date_join: z.string() date.toISOString().split('T')[0
    })

    // const parsedData = formSchema.parse(date_join)

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            bio: '',
            password: '',
           // date_join:'',
        },
    })

    useEffect(() => {
        if (userData && userData.success) {
            form.reset({
                name: userData.user.name,
                email: userData.user.email,
                bio: userData.user.bio,
               // date_join:userData.user.date_join,
               isAccountVerified: userData.user.isAccountVerified,
            })
        }
    }, [userData])



    async function onSubmit(values) {
        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('data', JSON.stringify(values))

            const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/user/update-user/${userData.user._id}`, {
                method: 'put',
                credentials: 'include',
                body: formData
            })
            const data = await response.json()
            if (!response.ok) {
                return showToast('error', data.message)
            }
            dispath(setUser(data.user))
            showToast('success', data.message)
        } catch (error) {
            showToast('error', error.message)
        }
    }

    const handleFileSelection = (files) => {
        const file = files[0]
        const preview = URL.createObjectURL(file)
        setFile(file)
        setPreview(preview)
    }

    if (loading) return <Loading />
    return (
        <Card className="max-w-screen-md mx-auto mt-10 md:mt-6 ">

            <CardContent>
                <div className='flex justify-center items-center mt-10' >

                    <Dropzone onDrop={acceptedFiles => handleFileSelection(acceptedFiles)}>
                        {({ getRootProps, getInputProps }) => (
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <Avatar className="w-28 h-28 relative group">
                                    <AvatarImage src={filePreview ? filePreview : userData?.user?.avatar} />
                                    <div className='absolute z-50 w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 justify-center items-center bg-black bg-opacity-20 border-2 border-violet-500 rounded-full group-hover:flex hidden cursor-pointer'>
                                        <IoCameraOutline color='#7c3aed' />
                                    </div>
                                </Avatar>
                            </div>
                        )}
                    </Dropzone>


                </div>
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}  >
                            <div className='mb-3'>
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='mb-3'>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email
                                            { 
                                            user.user.isAccountVerified ? (
                                            
                                                <svg className='inline-block ml-1 mb-1' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="18" height="18"><path fill="rgb(29 155 240)" fill-rule="evenodd" d="M10.9388 1.13669C11.4793 0.449229 12.5208 0.44923 13.0613 1.13669L14.808 3.35829L17.527 2.58767C18.3683 2.34921 19.2109 2.96138 19.2441 3.83525L19.3514 6.65926L22.004 7.63397C22.8249 7.93559 23.1467 8.92611 22.6599 9.6526L21.0868 12.0003L22.6599 14.3481C23.1467 15.0746 22.8249 16.0651 22.004 16.3667L19.3514 17.3414L19.2441 20.1654C19.2109 21.0393 18.3683 21.6515 17.527 21.413L14.808 20.6424L13.0613 22.864C12.5208 23.5515 11.4793 23.5515 10.9388 22.864L9.19206 20.6424L6.47311 21.413C5.63175 21.6515 4.78916 21.0393 4.75596 20.1654L4.64866 17.3414L1.99603 16.3667C1.17519 16.0651 0.853351 15.0746 1.34014 14.3481L2.91324 12.0003L1.34013 9.6526C0.85335 8.92611 1.17519 7.93559 1.99603 7.63397L4.64866 6.65926L4.75596 3.83525C4.78916 2.96138 5.63175 2.34921 6.47311 2.58767L9.19206 3.35829L10.9388 1.13669ZM8.35859 11.8486C8.65148 11.5557 9.12635 11.5557 9.41925 11.8486L10.8889 13.3182L14.3586 9.84858C14.6515 9.55568 15.1264 9.55568 15.4192 9.84858C15.7121 10.1415 15.7121 10.6163 15.4192 10.9092L11.4192 14.9092C11.1264 15.2021 10.6515 15.2021 10.3586 14.9092L8.35859 12.9092C8.06569 12.6163 8.06569 12.1415 8.35859 11.8486Z" clip-rule="evenodd" class="color000 svgShape"></path></svg>    
                                                
                                                
                                            ) : (<Link onClick={sendVerificationOtp} className='text-red-600 ml-1'>
                                                Verify
                                            </Link> )
                                            }
                                            </FormLabel>
                                            
                                            <FormControl>
                                                <Input placeholder="email address" {...field} readOnly/>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                
                            </div>
                            <div className='mb-3'>
                                <FormField
                                    control={form.control}
                                    name="bio"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bio</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Enter bio" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            {/* <div className='mb-3'>
                                <FormField
                                    control={form.control}
                                    name="date_join"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Member since</FormLabel>
                                            <FormControl>
                                                <Textarea readOnly>{moment(user.date_join).format('DD-MM-YYYY')}</Textarea>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div> */}
                            {/* <div className='mb-3'>
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="Enter your password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div> */}

                            <Button type="submit" className="w-full bg-gradient-to-r from-[#00c6ff] to-[#f509d6]">Save Changes</Button>
                        </form>
                    </Form>

                </div>

            </CardContent>


        </Card>
    )
}

export default Profile