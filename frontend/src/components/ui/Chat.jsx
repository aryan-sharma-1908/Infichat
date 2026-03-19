import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'
import { SlOptionsVertical } from "react-icons/sl";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';
import { MdDeleteOutline } from "react-icons/md";

const Chat = ({ friend, isactive, onClick, handleDeleteFriend }) => {

    const { _id, name, description, avatar } = friend;

    return (
        <div className={`w-full h-20 p-2 flex gap-3 hover:bg-gray-500/50 ${isactive && 'bg-gray-500/30'} cursor-pointer dark:border-0 relative dark:hover:bg-gray-500/50 group`} onClick={onClick}>
            <div className='w-14 h-14 min-w-14'>
                <Avatar className='w-full h-full shadow-md'>
                    <AvatarImage src={avatar} className='rounded-full object-cover' />
                    <AvatarFallback>{name?.[0]}</AvatarFallback>
                </Avatar>
            </div>
            <div className='userInfo overflow-y-hidden'>
                <h1 className='text-xl font-medium dark:text-white'>{name}</h1>
                <p className='text-black opacity-70 dark:text-[#D3DAD9] max-w-60 leading-loose'>{description}</p>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className='invisible absolute right-2 top-1/3 rounded-full p-1 group-hover:visible transition-opacity duration-300'>
                        <SlOptionsVertical className='dark:text-white text-black ' />
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuGroup>
                        <DropdownMenuItem className='flex justify-between items-center cursor-pointer px-3' onSelect={(e) => {
                            e.preventDefault();
                            handleDeleteFriend(_id);
                        }}><MdDeleteOutline className='text-red-500 text-lg' /><p className='text-red-500 text-[16px]'>Delete</p></DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default Chat
