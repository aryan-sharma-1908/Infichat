import React, { useEffect, useRef, useState } from 'react'
import { IoIosAttach } from "react-icons/io";
import { BsSendFill } from "react-icons/bs";
import { Textarea } from './textarea';
import { Button } from './button';
import { toast } from 'sonner';
import { IoClose } from "react-icons/io5";
const MessageInput = ({ onSend }) => {
  const [text, setText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const handleSubmitText = (e) => {
    e.preventDefault();
    const trimmedText = text.trim();
    if (!trimmedText && !selectedImage) {
      toast.error('Please enter text or select an image to send.')
      return;
    }
    onSend(
      {
        text: trimmedText,
        image: selectedImage
      }
    );
    setText("");
    setSelectedImage(null);

    if(fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  }

  const handleEnterPress = (e) => {
    const focusedElement = document.activeElement;
    if (e.key === 'Enter' && focusedElement?.tagName === 'TEXTAREA') {
      handleSubmitText(e);
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size should be less than 10MB.');
      return;
    }
    setSelectedImage(file);
    e.target.value = null;
  }

  const removeImage = () => {
    setSelectedImage(null);
    if(fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  }


  return (
    <form className='w-full' onSubmit={handleSubmitText}>
      {selectedImage && (
        <div className='relative px-3 py-3 w-40 bg-[#FFF2C6] dark:bg-[#715A5A] rounded-lg mb-3'>
          <img src={URL.createObjectURL(selectedImage)} alt="" className='h-24 rounded-lg border shadow' />
          <button
            type="button"
            onClick={removeImage}
            className="absolute bottom-0 right-0 bg-red-500 text-white rounded-full p-1 shadow"
          >
            <IoClose size={16} />
          </button>
        </div>
      )}
      <div className='dark:bg-[#44444E] w-full h-16 py-4 px-3 rounded-4xl flex bg-white items-center shadow-md gap-4 border border-gray-500/70'>

        <Button className='cursor-pointer active:scale-95 rounded-full w-12 h-12 flex items-center justify-center p-0! bg-[#FFF2C6]! min-w-12 dark:bg-[#715A5A]! shadow-md' size='icon' onClick={() => {
          fileInputRef.current.value = null,
          fileInputRef.current.click()
          }} type='button'>
          <IoIosAttach className='text-2xl! font-bold! text-black dark:text-white' />
        </Button>
        <Textarea className='w-full flex-1 focus-visible:ring-0 focus-visible:ring-offset-0 outline-0! ring-0! border-0! min-h-8 text-[18px]! text-[#060505c4] font-medium max-h-16 resize-none' value={text} onChange={(e) => setText(e.target.value)} onKeyDown={handleEnterPress} />
        <Button type='submit' className='cursor-pointer active:scale-95 p-0 bg-[#FFF2CF]! rounded-full w-12 h-12 flex items-center justify-center dark:bg-[#715A5A]! shadow-md'>
          <BsSendFill className='dark:text-white text-2xl active:scale-95 text-black' />
        </Button>
      </div>
      <input hidden type='file' ref={fileInputRef} accept='image/*' onChange={handleImageChange} />
    </form>

  )
}

export default MessageInput
