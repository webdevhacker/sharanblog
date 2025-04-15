import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { RouteAddCategory, RouteEditCategory } from '@/helpers/RouteName'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useFetch } from '@/hooks/useFetch'
import { getEnv } from '@/helpers/getEnv'
import Loading from '@/components/Loading'
import { FiEdit } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";
import { deleteData } from '@/helpers/handleDelete'
import { showToast } from '@/helpers/showToast'
import usericon from '@/assets/images/user.png'
import moment from 'moment'
const User = () => {
    const [refreshData, setRefreshData] = useState(false)
    const { data, loading, error } = useFetch(`${getEnv('VITE_API_BASE_URL')}/user/get-all-user`, {
        method: 'get',
        credentials: 'include'
    }, [refreshData])

    const handleDelete = async (id) => {
        const response = await deleteData(`${getEnv('VITE_API_BASE_URL')}/user/delete/${id}`)
        if (response) {
            setRefreshData(!refreshData)
            showToast('success', 'Data deleted.')
        } else {
            showToast('error', 'Data not deleted.')
        }
    }

    console.log(data)


    if (loading) return <Loading />
    return (
        <div>
            <Card>

                <CardContent>
                    <Table>

                        <TableHeader>
                            <TableRow>
                                <TableHead>Role </TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Avatar</TableHead>
                                <TableHead>Date Of Join</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data && data.user.length > 0 ?

                                data.user.map(user =>
                                    <TableRow key={user._id}>
                                        <TableCell>{user.role}</TableCell>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}
                                            { 
                                                user.isAccountVerified ? (
                                                    <svg className='inline-block ml-1 mb-1' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="18" height="18"><path fill="rgb(29 155 240)" fill-rule="evenodd" d="M10.9388 1.13669C11.4793 0.449229 12.5208 0.44923 13.0613 1.13669L14.808 3.35829L17.527 2.58767C18.3683 2.34921 19.2109 2.96138 19.2441 3.83525L19.3514 6.65926L22.004 7.63397C22.8249 7.93559 23.1467 8.92611 22.6599 9.6526L21.0868 12.0003L22.6599 14.3481C23.1467 15.0746 22.8249 16.0651 22.004 16.3667L19.3514 17.3414L19.2441 20.1654C19.2109 21.0393 18.3683 21.6515 17.527 21.413L14.808 20.6424L13.0613 22.864C12.5208 23.5515 11.4793 23.5515 10.9388 22.864L9.19206 20.6424L6.47311 21.413C5.63175 21.6515 4.78916 21.0393 4.75596 20.1654L4.64866 17.3414L1.99603 16.3667C1.17519 16.0651 0.853351 15.0746 1.34014 14.3481L2.91324 12.0003L1.34013 9.6526C0.85335 8.92611 1.17519 7.93559 1.99603 7.63397L4.64866 6.65926L4.75596 3.83525C4.78916 2.96138 5.63175 2.34921 6.47311 2.58767L9.19206 3.35829L10.9388 1.13669ZM8.35859 11.8486C8.65148 11.5557 9.12635 11.5557 9.41925 11.8486L10.8889 13.3182L14.3586 9.84858C14.6515 9.55568 15.1264 9.55568 15.4192 9.84858C15.7121 10.1415 15.7121 10.6163 15.4192 10.9092L11.4192 14.9092C11.1264 15.2021 10.6515 15.2021 10.3586 14.9092L8.35859 12.9092C8.06569 12.6163 8.06569 12.1415 8.35859 11.8486Z" clip-rule="evenodd" class="color000 svgShape"></path></svg>
                                                    
                                                ) : (<p className='text-red-600 ml-1'>
                                                    Not Verified
                                                </p> )
                                            }

                                        </TableCell>
                                        <TableCell>
                                            <img src={user.avatar || usericon} className='w-10' />
                                        </TableCell>
                                        <TableCell>{moment(user.date_join).format('DD-MM-YYYY')}</TableCell>

                                        <TableCell className="flex gap-3">

                                            <Button onClick={() => handleDelete(user._id)} variant="outline" className="hover:bg-violet-500 hover:text-white" >
                                                <FaRegTrashAlt />
                                            </Button>
                                        </TableCell>
                                    </TableRow>

                                )

                                :

                                <TableRow>
                                    <TableCell colSpan="3">
                                        Data not found.
                                    </TableCell>
                                </TableRow>
                            }
                        </TableBody>
                    </Table>

                </CardContent>
            </Card>
        </div>
    )
}

export default User