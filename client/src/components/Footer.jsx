import { RoutePrivacy } from '@/helpers/RouteName';
import React from 'react'
import CookieConsent, { Cookies } from "react-cookie-consent";
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div className='text-sm text-center bg-gray-50 py-4'>
            <CookieConsent
                location="bottom"
                buttonText="I understood"
                cookieName="accesswebpage"
                style={{ background: "#2B373B" }}
                buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
            >
                We use cookies to give you the best possible experience on our website. To find out more, read our updated <Link to={RoutePrivacy} className='text-red-400 underline'>Privacy policy</Link>
            </CookieConsent>
            © Copyright <a href='https://isharankumar.com' className='font-bold blue-gradient_text' target='_blank'>SHARAN KUMAR</a> some rights are reserved.
        </div>
    )
}

export default Footer