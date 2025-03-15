import React from 'react'
import { Card, CardContent } from './ui/card'
import { Badge } from "@/components/ui/badge"
import { useSelector } from 'react-redux'
import { Avatar } from './ui/avatar'
import { AvatarImage } from '@radix-ui/react-avatar'
import { FaRegCalendarAlt } from "react-icons/fa";
import usericon from '@/assets/images/user.png'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { RouteBlogDetails } from '@/helpers/RouteName'
import { RouteBlogByCategory } from '@/helpers/RouteName'
const BlogCard = ({ props }) => {
 
    return (
        
            <Card className="pt-5">
            <CardContent>
        <div className="relative mx-auto max-w-full">
        <div className="flex flex-col overflow-hidden">
            <div className="flex-shrink-0">
            <Link to={RouteBlogDetails(props.category.slug, props.slug)}>
            <img src={props.featuredImage} className='rounded' />
            </Link>
            </div>
            <div className="flex flex-1 flex-col justify-between bg-white p-6">
            <div className="flex-1">
                <Link to={RouteBlogByCategory(props.category.slug)}>
                <p className="text-sm font-medium text-purple-500 hover:underline">
                    {props.category.name}
                </p>
                </Link>
                
                <Link to={RouteBlogDetails(props.category.slug, props.slug)}>
                <p className="text-xl font-semibold text-gray-900">{props.title}</p>
                <p className="mt-3 text-base text-gray-500">{props.description}</p>
                </Link>
            </div>
            <div className="mt-6 flex items-center">
                <div className="flex-shrink-0">
                    <span className="sr-only">{props.author.name}</span>
                    <img className="h-10 w-10 rounded-full" src={props.author.avatar || usericon} />
                </div>
                <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                    {props.author.name}
                </p>
                <div className="flex space-x-1 text-sm text-gray-500">
                    <time>{moment(props.createdAt).format('DD-MM-YYYY')}</time>
                    <span aria-hidden="true">·</span>
                    {/* <span>6 min read</span> */}
                </div>
                </div>
            </div>
            </div>
        </div>
  </div>
            </CardContent>
                        </Card>
                 

                    // <div classNameName='my-2'>
                    //     <img src={props.featuredImage} classNameName='rounded' />
                    // </div>
                    // <div>
                    //     <h2 classNameName='text-2xl font-bold line-clamp-2'>{props.title}</h2>
                    // </div>

                    // <div classNameName='flex items-center justify-between'>
                    //     <div classNameName='flex justify-between items-center gap-2'>
                    //         <Avatar>
                    //             <AvatarImage classNameName='w-[50px]' src={props.author.avatar || usericon} />
                    //         </Avatar>
                    //         <span>{props.author.name}</span>
                    //     </div>
                    //     {props.author.role === 'admin' &&
                    //         <Badge variant="outline" classNameName="bg-violet-500">Admin</Badge>
                    //     }
                    // </div>
                    // <p classNameName='flex items-center gap-2 mb-2 font-thin'>
                           
                    //         <span>{moment(props.createdAt).format('DD-MM-YYYY')}</span>
                    // </p>

                
        
    )
}

export default BlogCard