import React, { useContext, useState } from 'react'
import { IoLogOutOutline } from "react-icons/io5";
import { Button } from './button';
import apiClient from '@/lib/api-client';
import { LOGOUT_ROUTES } from '@/utils/constants';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { IoPartlySunnyOutline } from "react-icons/io5";
import { ThemeContext } from '@/context/ThemeContext';
import { LuCloudMoon } from "react-icons/lu";

const ChatsFooter = ({ name, avatar }) => {
    const { theme, toggleTheme } = useContext(ThemeContext);

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

    const handleToggleTheme = () => {
        toggleTheme();
    }

    return (
        <div className='dark:bg-[#37353E] bg-white flex items-center justify-between p-4 shadow-[0_-4px_6px_-3px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]'>
            <div className='flex justify-between items-center gap-2 active:bg-gray-300 cursor-pointer'>
                <div className=' rounded-full w-12 h-12 overflow-hidden border-2 border-transparent hover:border-green-400 shadow-md box-border'><img src={avatar} alt="" className='w-full h-full' /></div>
                <div>
                    <h1 className='dark:text-white text-black text-2xl font-bold leading-5 '>{name}</h1>
                    <p className='text-[#7F7F7F] dark:text-[#D3DAD9]'>click here to get user info.</p>
                </div>
            </div>
            <div className='flex gap-2' >
                <Button className={`w-8 h-8 rounded-full shadow-lg flex items-center justify-center cursor-pointer border border-gray-300 ${theme === 'dark' ? 'bg-gray-400' : 'bg-amber-50'}`} onClick={handleToggleTheme}>
                    {theme === 'light' ? <IoPartlySunnyOutline className='text-yellow-500 text-lg' /> : <LuCloudMoon className='text-blue-950 text-lg' />}
                </Button>
                <Button className='dark:bg-[#44444E]  w-8 h-8 rounded-full shadow-lg flex items-center justify-center cursor-pointer border border-gray-300 ' onClick={handleLogout} >
                    <IoLogOutOutline className='text-red-600 text-lg' />
                </Button>
            </div>

        </div>
    )
}

export default ChatsFooter
