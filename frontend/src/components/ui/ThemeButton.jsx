import { ThemeContext } from '@/context/ThemeContext';
import React, { useContext } from 'react'
import { Button } from './button';
import { IoPartlySunnyOutline } from "react-icons/io5";
import { GiNightSleep } from "react-icons/gi";

const ThemeButton = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const handleToggleTheme = () => {
        toggleTheme();
    }
    return (
        <>
            <Button className={`w-8 h-8 rounded-full shadow-lg flex items-center justify-center cursor-pointer border border-gray-300 ${theme === 'dark' ? 'bg-gray-400' : 'bg-amber-50'}`} onClick={handleToggleTheme}>
                {theme === 'light' ? <IoPartlySunnyOutline className='text-yellow-500 text-lg' /> : <GiNightSleep className='text-blue-950 text-lg' />}
            </Button>
        </>
    )
}

export default ThemeButton
