import React from 'react'
import { Button } from './ui/button'
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '@/helpers/firebase';
import { RouteIndex } from '@/helpers/RouteName';
import { showToast } from '@/helpers/showToast';
import { getEnv } from '@/helpers/getEnv';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/user/user.slice';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const GoogleLogin = () => {
    const dispath = useDispatch()
    const navigate = useNavigate()
    //
    const dateTransformer = z.string().transform((val) => {
        const date = new Date(val);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    });

    const handleLogin = async () => {
        try {
            const googleResponse = await signInWithPopup(auth, provider)
            const user = googleResponse.user
            const bodyData = {
                name: user.displayName,
                email: user.email,
                avatar: user.photoURL,
                date_join: user.date_join
            }
            const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/auth/google-login`, {
                method: 'post',
                headers: { 'Content-type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(bodyData)
            })
            const data = await response.json()
            if (!response.ok) {
                return showToast('error', data.message)
            }
            dispath(setUser(data.user))
            navigate(RouteIndex)
            showToast('success', data.message)
        } catch (error) {
            showToast('error', error.message)
        }
    }
    return (
        <Button variant="outline" className="w-full" onClick={handleLogin} >
            <FcGoogle />
            Continue With Google
        </Button>
    )
}

export default GoogleLogin