import { Button } from '@/components/ui/button';
import React, { useContext } from 'react'
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { ChatContext } from '@/context/ChatContext';

const Profile = () => {
  const navigate = useNavigate();
  const { friendId } = useParams();
  const {friends} = useContext(ChatContext);

  const friend = friends.find(f => f._id === friendId);
  console.log(friend);
  
  return (
    <div className='w-full h-screen flex justify-center flex-col gap-4 dark:bg-[#44444E]'>
      <div className='w-full flex justify-left items-center gap-2 sticky h-15'>
        <Button className='cursor-pointer hover:bg-gray-300/50' onClick={() => navigate(-1)}>
          <FaArrowLeft className='text-black text-2xl! dark:text-white' />
        </Button>
        <h1 className='text-2xl font-bold text-black dark:text-white'>Friends Info</h1>
      </div>
      <div className='flex-1 flex flex-col items-center justify-center max-h-screen w-full'>
        <div className='w-40 h-40 rounded-full overflow-hidden shadow-md ' >
          <img src={friend?.avatar} alt="" className='w-full h-full object-cover' />
        </div>
        <div className='grid grid-cols-12 gap-6 mt-4 w-full max-w-[80%]'>
          <h2 className='font-bold text-xl col-span-2 dark:text-white p-4'>Name:</h2>
          <p className='bg-gray-300 col-span-10 p-4 rounded-md shadow-md text-lg' >{friend?.name}</p>
        </div>
        <div className='grid grid-cols-12 gap-4 mt-4 w-full max-w-[80%]'>
          <h2 className='font-bold text-xl col-span-2 dark:text-white p-4'>Description:</h2>
          <p className='bg-gray-300 col-span-10 p-4 rounded-md shadow-md row-span-4 text-lg' >{friend?.description}</p>
        </div>
        
      </div>
      <div></div>
    </div>
  )
}

export default Profile
