import React from 'react'
import { MdOutlineWatchLater } from "react-icons/md";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { MdBlock } from "react-icons/md";

const MessageBubble = ({
  time,
  text,
  image,
  from,
  status,
  onRightClick,
  deletedForEveryone
}) => {

  return (
    <div className={`flex flex-col w-full ${from === 'me' ? "items-end" : "items-start"} px-4`}>

      <div
        className={`flex flex-col max-w-[70%] rounded-2xl gap-1 shadow-sm
        ${image && !text
            ? "bg-transparent shadow-none p-0"
            : "dark:bg-[#715A5A] bg-[#FFF2C6] px-3 py-2"
          }`}
        onContextMenu={onRightClick}
      >

        {deletedForEveryone ? (
          <div className='flex items-center gap-1'>
            <MdBlock className='text-gray-500' />
            <p className='text-gray-500'>Message deleted for everyone</p>
          </div>
        ) : (
          <>
            {/* TEXT MESSAGE */}
            {text && (
              <p className='dark:text-white'>{text}</p>
            )}

            {/* IMAGE MESSAGE */}
            {image && (
              <img
                src={image}
                alt="sent"
                className="rounded-lg max-w-[250px] max-h-[300px] object-cover hover:scale-[1.02] cursor-pointer"
                loading="lazy"
              />
            )}
          </>
        )}

        {/* TIME + STATUS */}
        <div className='flex gap-1 justify-end items-end'>
          <div className='text-gray-700 text-[12px] dark:text-[#D3DAD9]'>{time}</div>

          {from === 'me' && (
            <div className='flex items-center'>
              {status === 'pending' ? (
                <MdOutlineWatchLater className='text-gray-400' />
              ) : (
                <IoCheckmarkDoneOutline
                  className={`${status === 'sent' ? 'text-gray-400' : 'text-blue-500'}`}
                />
              )}
            </div>
          )}
        </div>

      </div>

    </div>
  )
}

export default MessageBubble