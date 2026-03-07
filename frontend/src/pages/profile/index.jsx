import { Button } from '@/components/ui/button';
import React, { useContext } from 'react'
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { ChatContext } from '@/context/ChatContext';
import ThemeButton from '@/components/ui/ThemeButton';

const Profile = () => {
  const navigate = useNavigate();
  const { friendId } = useParams();
  const { friends } = useContext(ChatContext);

  const friend = friends.find(f => f._id === friendId);

  if (!friend) {
    return (
      <div className='min-h-screen w-full flex items-center justify-center text-gray-800 dark:text-white'>
        <p>Friend not found.</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen w-full flex items-center justify-center px-4 py-8 bg-[linear-gradient(160deg,#fef5f6_0%,#f2fafd_50%,#f8f4f8_100%)] dark:bg-[linear-gradient(135deg,#1a1516_0%,#0f1a1f_50%,#151a24_100%)]'>
      <div className='w-full max-w-md bg-white dark:bg-[#37353E] rounded-2xl shadow-md border border-gray-200 dark:border-[#44444E] overflow-hidden'>
        {/* colored accent strip */}
        <div className='h-1.5 w-full flex'>
          <span className='flex-1 bg-[#fbadba]' />
          <span className='flex-1 bg-[#8ADCF9]' />
        </div>
        <div className='px-6 py-6'>
          <div className='flex items-center justify-between mb-6'>
            <div className='flex items-center gap-2'>
              <Button className='cursor-pointer hover:bg-gray-300/50' onClick={() => navigate(-1)}>
                <FaArrowLeft className='text-black text-2xl dark:text-white' />
              </Button>
              <h1 className='text-2xl font-semibold text-gray-800 dark:text-white'>Friend Info</h1>
            </div>
          </div>

          <div className='flex flex-col items-center gap-6'>
            <div className='w-32 h-32 rounded-full overflow-hidden shadow-md'>
              <img
                src={friend.avatar || '/user.png'}
                alt={friend.name || 'avatar'}
                className='w-full h-full object-cover'
              />
            </div>
            <div className='w-full'>
              <h2 className='text-sm font-medium text-gray-700 dark:text-gray-300'>Name</h2>
              <p className='mt-1 text-lg text-gray-900 dark:text-white bg-gray-100 dark:bg-[#44444E] p-3 rounded-lg'>
                {friend.name || 'N/A'}
              </p>
            </div>
            <div className='w-full'>
              <h2 className='text-sm font-medium text-gray-700 dark:text-gray-300'>Description</h2>
              <p className='mt-1 text-lg text-gray-900 dark:text-white bg-gray-100 dark:bg-[#44444E] p-3 rounded-lg whitespace-pre-wrap'>
                {friend.description || 'No description'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile
