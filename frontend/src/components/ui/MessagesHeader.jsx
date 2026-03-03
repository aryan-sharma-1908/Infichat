import React, { useContext, useMemo } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button'
import { SlOptionsVertical } from "react-icons/sl"
import { useParams } from 'react-router-dom'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChatContext } from '@/context/ChatContext'
import { MdDeleteOutline } from "react-icons/md";
import apiClient from '@/lib/api-client'
import { DELETE_ALL_MESSAGES_ROUTES } from '@/utils/constants'
import { useNavigate } from 'react-router-dom'

const MessagesHeader = ({ onDeleteAll }) => {
    const { friends } = useContext(ChatContext);
    const { friendId } = useParams();
    const activeFriend = friends.find(friend => friend._id === friendId);
    const navigate = useNavigate();

    const onFriendInfoClick = () => {
        navigate(`/chats/friendProfile/${friendId}`);
    }
    if (!activeFriend) return null
    return (
        <div className='dark:bg-[#37353E] bg-white w-full h-22 flex items-center justify-between p-5 shadow-sm dark:border-0'>
            <div className="user_info gap-4 flex justify-between items-center cursor-pointer" onClick={onFriendInfoClick}>
                <div className="user_avatar w-14 h-14 min-w-14">
                    <Avatar className='w-full h-full shadow-md border-2 border-white'>
                        <AvatarImage src={activeFriend.avatar} className='rounded-full' />
                        <AvatarFallback>{activeFriend.name}</AvatarFallback>
                    </Avatar>
                </div>
                <div className='flex-col justify-between items-center'>
                    <div className="dark:text-white user_name text-[#2B2A2A] text-2xl font-bold">{activeFriend.name}</div>
                    <p className='dark:text-[#D3DAD9] font-medium text-gray-500'>click here to get {activeFriend.name} info</p>
                </div>
            </div>
            <div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size='icon-lg' className='relative overflow-hidden rounded-full
                before:content-[""] before:bg-transparent
                before:scale-80 hover:before:bg-[#f1f1f1] before:absolute hover:before:scale-100 before:duration-300 before:inset-0 before:rounded-full cursor-pointer transition-transform dark:hover:before:bg-gray-700/30' >
                            <span className='relative z-10 cursor-pointer'><SlOptionsVertical className='dark:text-white'/></span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuGroup>
                            <DropdownMenuItem className='flex justify-between items-center cursor-pointer px-3' onSelect={(e) => {
                                e.preventDefault();
                                onDeleteAll();
                            }}><MdDeleteOutline className='text-red-500 text-lg' /><p className='text-red-500 text-[16px]'>Delete</p></DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
        </div>
    )
}

export default MessagesHeader
