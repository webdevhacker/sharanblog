import { getEnv } from '@/helpers/getEnv'
import { RouteBlogDetails } from '@/helpers/RouteName'
import { useFetch } from '@/hooks/useFetch'
import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from './ui/card'
import { RouteBlogByCategory } from '@/helpers/RouteName'
import usericon from '@/assets/images/user.png'
import moment from 'moment'

const RelatedBlog = ({ props }) => {
    const { data, loading, error } = useFetch(`${getEnv('VITE_API_BASE_URL')}/blog/get-related-blog/${props.category}/${props.currentBlog}`, {
        method: 'get',
        credentials: 'include',
    })

    if (loading) return <div>Loading....</div>
    return (

         <Card className="pt-5">
            <h2 className='text-2xl font-bold mb-5'>Related Blogs</h2>
                    <CardContent>
                    {data && data.relatedBlog.length > 0
                     ?
                     data.relatedBlog.map(blog => {
                     return (
                <div className="relative mx-auto max-w-full">

                <div className="flex flex-col overflow-hidden">
                    <div className="flex-shrink-0">
                    <Link to={RouteBlogDetails(props.category.slug, props.slug)}>
                    <img src={blog.featuredImage} className='rounded' />
                    </Link>
                    </div>
                    <div className="flex flex-1 flex-col justify-between bg-white p-6">
                    <div className="flex-1">
                        <Link to={RouteBlogByCategory(props.category.slug)}>
                        <p className="text-sm font-medium text-indigo-600 hover:underline">
                            {blog.category.name}
                        </p>
                        </Link>
                        
                        <Link to={RouteBlogDetails(blog.category.slug, props.slug)}>
                        <p className="text-xl font-semibold text-gray-900">{blog.title}</p>
                        <p className="mt-3 text-base text-gray-500">{blog.description}</p>
                        </Link>
                    </div>
                    <div className="mt-6 flex items-center">
                        <div className="flex-shrink-0">
                            <span className="sr-only">{blog.author.name}</span>
                            <img className="h-10 w-10 rounded-full" src={blog.author.avatar || usericon} />
                        </div>
                        <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                            {blog.author.name}
                        </p>
                        <div className="flex space-x-1 text-sm text-gray-500">
                            <time>{moment(blog.createdAt).format('DD-MM-YYYY')}</time>
                            <span aria-hidden="true">·</span>
                            {/* <span>6 min read</span> */}
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
          </div>
                     )
          })

                      :
                      <div>
                          No Related Blog
                      </div>
                  }
                    </CardContent>
        </Card>

        // <div>
        //     <h2 className='text-2xl font-bold mb-5'>Related Blogs</h2>
        //     <div>
        //         {data && data.relatedBlog.length > 0
        //             ?
        //             data.relatedBlog.map(blog => {
        //                 return (
        //                     <Link key={blog._id} to={RouteBlogDetails(props.category, blog.slug)}>
        //                         <div className='flex items-center gap-2 mb-3'>
        //                             <img className='w-[100px] h-[70px] object-cover rounded-md' src={blog.featuredImage} />
        //                             <h4 className='line-clamp-2 text-lg font-semibold'>{blog.title}</h4>
        //                         </div>
        //                     </Link>
        //                 )
        //             })

        //             :
        //             <div>
        //                 No Related Blog
        //             </div>
        //         }

        //     </div>
        // </div>
    )
}

export default RelatedBlog