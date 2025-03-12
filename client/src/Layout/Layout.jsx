import AppSidebar from '@/components/AppSidebar'
import Footer from '@/components/Footer'
import Topbar from '@/components/Topbar'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const Layout = () => {
    return (

        <SidebarProvider>
            <Topbar />
            <AppSidebar />
            <main className='w-full bg-[#f5f5f5]'>
                <div className='w-full min-h-[calc(100vh-45px)] py-28  px-10 mt-1 lg:mt-1'>
                    <Outlet />
                </div>
                <Footer />
            </main>
        </SidebarProvider>
    )
}

export default Layout