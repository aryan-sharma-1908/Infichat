import React from 'react'
import { MdOutlineWatchLater } from "react-icons/md";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { MdBlock } from "react-icons/md";
const MessageBubble = ({ time, text, from, status, onRightClick, deletedForEveryone }) => {
    return (
        <div className={`flex flex-col w-full ${from === 'me' ? "items-end" : "items-start"} px-4`}>
            <div className='dark:bg-[#715A5A] bg-[#FFF2C6] flex max-w-[70%] rounded-2xl px-3 py-2  gap-1 shadow-sm' onContextMenu={onRightClick}>
                {deletedForEveryone ? (<div className='flex items-center gap-1'><MdBlock className='text-gray-500' /><p className='text-gray-500'>Message deleted for everyone</p></div>) : <p className='dark:text-white'>{text}</p>}
                <div className='flex gap-1 justify-end items-end'>
                    <div className='text-gray-700 text-[12px] dark:text-[#D3DAD9]'>{time}</div>
                    {from === 'me' && <div className='flex items-center'>
                        {status === 'pending' ? <MdOutlineWatchLater className='text-gray-400' /> : <IoCheckmarkDoneOutline className={`${status === 'sent' ? 'text-gray-400' : 'text-blue-500'} ${from === 'me' && 'flex-end'}`} />}
                    </div>}
                </div>

            </div>
        </div >
    )
}

export default MessageBubble
