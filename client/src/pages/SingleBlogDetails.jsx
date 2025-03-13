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
import { useParams } from 'react-router-dom'
import { useSelector } from "react-redux";
// import GoogleLogin from '@/components/GoogleLogin'
import SignIn from './SignIn'

const SingleBlogDetails = () => {
    const user = useSelector(state => state.user)
    const { blog, category } = useParams()

    const { data, loading, error } = useFetch(`${getEnv('VITE_API_BASE_URL')}/blog/get-blog/${blog}`, {
        method: 'get',
        credentials: 'include',
    }, [blog, category])

    if (loading) return <Loading />
    return (
        
        <div class="flex flex-col">
{data && data.blog && user && user.isLoggedIn
                ?
                <>
    <div class="bg-gray-100 py-8">
        <div class="container mx-auto px-4">
            <h1 class="text-4xl font-bold text-gray-800 mb-2">{data.blog.title}</h1>
            <p class="text-gray-600">Published On: {moment(data.blog.createdAt).format('DD-MM-YYYY')}</p>
        </div>
    </div>
    <div class="py-8">
        <div class="container mx-auto px-4 flex flex-col md:flex-row">
            <div class="w-full md:w-3/4 px-4">
                <img src={data.blog.featuredImage} className='rounded mb-8' />
                <div class="prose max-w-none">
                    <p dangerouslySetInnerHTML={{ __html: decode(data.blog.blogContent) || '' }}>
			
                    </p>
                </div>
            </div> <br />
            <div class="w-full md:w-1/4 px-4 mt-10 lg:mt-0">
                <div class="bg-white p-4">
                    {/* <h2 class="text-xl font-bold text-gray-800 mb-4">Recent Posts</h2> */}
                    <ul class="list-none">
                        <li class="mb-2">
                            <RelatedBlog props={{ category: category, currentBlog: blog }} />
                        </li>
                     </ul>
                </div>
             </div>
        </div>

    </div>
    
</>
                :
                <>
                <SignIn />
                </>
                
            }
</div>
    )
}

export default SingleBlogDetails