import React, { useEffect, useState } from 'react'
import { IoIosAttach } from "react-icons/io";
import { BsSendFill } from "react-icons/bs";
import { Textarea } from './textarea';
import { Button } from './button';
import { toast } from 'sonner';

const MessageInput = ({ onSend }) => {
  const [text, setText] = useState('');

  const handleSubmitText = (e) => {
    e.preventDefault();
    const trimmedText = text.trim();
    onSend(trimmedText);
    setText("");
  }

  const handleEnterPress = (e) => {
    const focusedElement = document.activeElement;
    if (e.key === 'Enter' && focusedElement?.tagName === 'TEXTAREA') {
      e.preventDefault();
      const trimmedText = text.trim();
      if(!trimmedText) {
        toast.error('Please enter text to send.')
      }
      onSend(trimmedText);
      setText("");
    }
  }

  return (
    <form className='w-full' onSubmit={handleSubmitText}>
      <div className='dark:bg-[#44444E] w-full h-16 py-4 px-3 rounded-4xl flex bg-white items-center shadow-md gap-4 border border-gray-500/70'>
        <Button className='cursor-pointer active:scale-95 rounded-full w-12 h-12 flex items-center justify-center p-0! bg-[#FFF2C6]! min-w-12 dark:bg-[#715A5A]! shadow-md' size='icon'>
          <IoIosAttach className='text-2xl! font-bold! text-black dark:text-white' />
        </Button>
        <Textarea className='w-full flex-1 focus-visible:ring-0 focus-visible:ring-offset-0 outline-0! ring-0! border-0! min-h-8 text-[18px]! text-[#060505c4] font-medium max-h-16 resize-none' value={text} onChange={(e) => setText(e.target.value)} onKeyDown={handleEnterPress} />
        <Button type='submit' className='cursor-pointer active:scale-95 p-0 bg-[#FFF2CF]! rounded-full w-12 h-12 flex items-center justify-center dark:bg-[#715A5A]! shadow-md'>
          <BsSendFill className='dark:text-white text-2xl active:scale-95 text-black' />
        </Button>
      </div>
    </form>

  )
}

export default MessageInput
