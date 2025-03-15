// import Comment from '@/components/Comment'
// import CommentCount from '@/components/CommentCount'
// import CommentList from '@/components/CommentList'
// import LikeCount from '@/components/LikeCount'
import Loading from '@/components/Loading'
import RelatedBlog from '@/components/RelatedBlog'
import { Avatar } from '@/components/ui/avatar'
import { getEnv } from '@/helpers/getEnv'
import { useFetch } from '@/hooks/useFetch'
import { AvatarImage } from '@radix-ui/react-avatar'
import { decode } from 'entities'
import moment from 'moment'
import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { RouteBlogByCategory } from '@/helpers/RouteName'
import { EmailIcon, EmailShareButton, WhatsappShareButton, WhatsappIcon, TelegramIcon, TelegramShareButton} from 'react-share'
// import { useSelector } from "react-redux";
// import GoogleLogin from '@/components/GoogleLogin'
// import SignIn from './SignIn'

const SingleBlogDetails = () => {
    // const user = useSelector(state => state.user)
    const { blog, category } = useParams()
    const shareUrl = window.location.href;

    const { data, loading, error } = useFetch(`${getEnv('VITE_API_BASE_URL')}/blog/get-blog/${blog}`, {
        method: 'get',
        credentials: 'include',
    }, [blog, category])

    if (loading) return <Loading />
    return (
        
        <div className="flex flex-col">
        {data && data.blog &&
                <>
            <div className="bg-gray-100 py-8">
                <div className="container mx-auto">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">{data.blog.title}</h1>
                    <p className='text-gray-600'>By {data.blog.author.name} | Published On {moment(data.blog.createdAt).format('DD-MM-YYYY')}</p>
                    <div className='mt-1'>
                            <EmailShareButton
                            url={shareUrl}
                            subject={data.blog.title}
                            className='mx-1'
                            >
                            <EmailIcon size={32} round />
                            </EmailShareButton>
                            <WhatsappShareButton
                            url={shareUrl}
                            title={data.blog.title}
                            className='mx-1'
                            >
                            <WhatsappIcon size={32} round />
                            </WhatsappShareButton>
                            <TelegramShareButton
                            url={shareUrl}
                            title={data.blog.title}
                            className='mx-1'
                            >
                            <TelegramIcon size={32} round />
                            </TelegramShareButton>
                    </div>
                </div>
             </div>
            <div className="py-8">
                <div className="container mx-auto flex flex-col md:flex-row">
                    <div className="w-full md:w-3/4">
                        <img src={data.blog.featuredImage} className='rounded mb-8' />
                        <div className="prose max-w-none">
                            <p dangerouslySetInnerHTML={{ __html: decode(data.blog.blogContent) || '' }}>
                    
                            </p>
                        </div>
                    </div> <br />
                <div className="w-full md:w-1/4 px-4 mt-10 lg:mt-0">
                    <div className="bg-white p-4">
                        {/* <h2 class="text-xl font-bold text-gray-800 mb-4">Recent Posts</h2> */}
                        <ul className="list-none">
                            <li className="mb-2">
                                <RelatedBlog props={{ category: category, currentBlog: blog }} />
                            </li>
                        </ul>
                    </div>
                </div>
                </div>

        </div>
    
            </>
                // :
                // <>
                // <SignIn />
                // </>
                
            }
        </div>
            )
        }

export default SingleBlogDetails