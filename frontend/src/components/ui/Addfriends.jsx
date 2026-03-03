import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from './button'
import { FiPlusCircle } from "react-icons/fi";
import apiClient from '@/lib/api-client';
import { toast } from 'sonner';
import { NON_FRIENDS_ROUTES } from '@/utils/constants.js'
import UserData from './UserData';
const Addfriends = () => {
  const [usersData, setUsersData] = useState([]);

  const handleOpenUsersList = async () => {
    try {
      const response = await apiClient.get(NON_FRIENDS_ROUTES, { withCredentials: true });

      setUsersData(response.data.nonFriends);

    } catch (error) {
      console.error("Error fetching non-friends: ", error);
      toast.error("Failed to fetch non-friends. Please try again.")
    }
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <div className='active:scale-95 flex items-center' onClick={handleOpenUsersList}>
            <FiPlusCircle className='w-full text-2xl min-w-full  hover:bg-gray-100 dark:text-white dark:hover:bg-black rounded-full' />
          </div>
        </DialogTrigger>
        <DialogContent className='bg-white/80 '>
          <DialogHeader>
            <DialogTitle className='text-black text-3xl pl-2'>Add friends</DialogTitle>
            <DialogDescription>

            </DialogDescription>
          </DialogHeader>
          {
            usersData.map(userData => (
              <UserData
                key={userData._id}
                name={userData.name}
                avatar={userData.avatar}
                _id={userData._id}
                description={userData.description}
                onAdded={() => setUsersData(prev => prev.filter(u => u._id !== userData._id))}
              />
            ))
          }
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Addfriends
