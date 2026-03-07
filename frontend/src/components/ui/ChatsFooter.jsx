import React, { useContext, useState } from 'react'
import { IoLogOutOutline } from "react-icons/io5";
import { Button } from './button';
import apiClient from '@/lib/api-client';
import { LOGOUT_ROUTES } from '@/utils/constants';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

import { ThemeContext } from '@/context/ThemeContext';

import ThemeButton from './ThemeButton';
const ChatsFooter = ({ name, avatar }) => {

    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            const response = await apiClient.post(LOGOUT_ROUTES);

            if (response.data.success) {
                toast.success("Logged out successfully");
                navigate('/login');
            }
        } catch (error) {
            toast.error('Failed to log out. Please try again.');
            console.error('Logout error: ', error);
        }
    }

    return (
        <div className='dark:bg-[#37353E] bg-white/95 backdrop-blur flex items-center justify-between px-4 py-3 border-t border-black/5 dark:border-white/10 shadow-[0_-4px_6px_-3px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]'>
            <div className='flex items-center gap-3 cursor-pointer rounded-2xl px-2 py-1 transition-colors hover:bg-black/5 dark:hover:bg-white/5' onClick={() => navigate('/profile-setup')}>
                <div className='rounded-full w-12 h-12 overflow-hidden border-2 border-transparent hover:border-green-400 shadow-md box-border'><img src={avatar} alt="" className='w-full h-full object-cover' /></div>
                <div>
                    <h1 className='dark:text-white text-black text-lg font-semibold leading-5 '>{name}</h1>
                    <p className='text-xs text-[#7F7F7F] dark:text-[#D3DAD9]'>Click to view your profile.</p>
                </div>
            </div>
            <div className='flex gap-2' >
                <ThemeButton/>
                <Button className='dark:bg-[#44444E]  w-8 h-8 rounded-full shadow-lg flex items-center justify-center cursor-pointer border border-gray-300 ' onClick={handleLogout} >
                    <IoLogOutOutline className='text-red-600 text-lg' />
                </Button>
            </div>

        </div>
    )
}

export default ChatsFooter
