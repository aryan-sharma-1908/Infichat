import React, { createContext, useMemo } from 'react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import apiClient from '@/lib/api-client'
import { FRIEND_ROUTES } from '@/utils/constants'

export const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [friends, setFriends] = useState([])
    const [isActiveChat, setIsActiveChat] = useState(null);
    const fetchFriends = async () => {
        try {
            const response = await apiClient.get(FRIEND_ROUTES, {withCredentials : true});
            setFriends(response.data.friends || []);
        } catch (error) {
            console.error('Error fetching friends: ', error);
            toast.error("Failed to fetch friends. Please try again.")
            setFriends([]);
        }
    }

    const value = useMemo(() => ({
        friends,
        isActiveChat,
        setIsActiveChat,
        setFriends,
        fetchFriends
    }), [friends, isActiveChat]);

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}

export default ChatProvider
