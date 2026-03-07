import MessageInput from '@/components/ui/MessageInput'
import ChatsHeader from '@/components/ui/ChatsHeader'
import MessagesHeader from '@/components/ui/MessagesHeader'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import Chat from './Chat'
import AryanProfile from '@/assets/AryanProfile.jpeg'
import AdityaProfile from '@/assets/AdityaProfile.jpeg'
import SudhanshuProfile from '@/assets/SudhanshuProfile.jpeg'
import RupamProfile from '@/assets/RupamProfile.jpeg'
import PakshikProfile from '@/assets/PakshikProfile.jpeg'
import Conversation from '../../pages/Conversation'
import { toast } from 'sonner'
import apiClient from '@/lib/api-client'
import { DELETE_FRIEND_ROUTES, FRIEND_ROUTES } from '@/utils/constants'
import { ChatContext } from '@/context/ChatContext'
import ConversationSkeleton from './skeletons/ConversationSkeleton'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { SocketContext } from '@/context/SocketContext'
import { UserContext } from '@/context/UserContext'
import ChatsFooter from './ChatsFooter'
const Chats = () => {
  const { friendId } = useParams();
  const { friends, setFriends, fetchFriends } = useContext(ChatContext);
  const navigate = useNavigate();
  const { connectSocket, disconnectSocket } = useContext(SocketContext);
  const { user } = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300)

    return () => clearTimeout(timer);
  }, [searchQuery])

  useEffect(() => {
    if (user) {
      connectSocket();
      fetchFriends();
    }
    return () => {
      disconnectSocket();
    };
  }, [user]);



  const filteredFriends = useMemo(() => {
    return friends.filter(friend => friend.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [friends, debouncedQuery])


  const handleDeleteFriend = async (friendId) => {
    try {
      const response = await apiClient.delete(`${DELETE_FRIEND_ROUTES}/${friendId}`);
      if(response.data.success) {
        toast.success("Friend deleted successfully");
        setFriends(prev => prev.filter(friend => friend._id !== friendId))
      }


    } catch (error) {
      toast.error("Failed to delete friend. Please try again.");
      console.error('Error deleting friend: ', error);
    }
  }

  return (
    <div className='h-screen flex items-stretch w-full'>
      <div className="dark:bg-[#37353E] chats w-[25%] bg-white h-full shadow-xl flex flex-col">
        <div className='sticky top-0 z-10 mb-1'>
          <ChatsHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
        <div className='chat group/users flex-1 overflow-y-auto scroll-smooth '>
          {filteredFriends.map(friend => (
            <Chat key={friend._id} friend={friend} isActive={friendId == friend._id} onClick={() => navigate(`/chats/${friend._id}`)} handleDeleteFriend={handleDeleteFriend}/>
          ))}
        </div>
        <div className='sticky bottom-0 z-10 shadow-t-md'>
          <ChatsFooter name={user.name} avatar={user.avatar} />
        </div>
      </div>
      <div className="messages w-[75%] bg-[#F8F9FA] bg-cover h-full fixed right-0">
        <Outlet />
      </div>
    </div>
  )
}

export default Chats
