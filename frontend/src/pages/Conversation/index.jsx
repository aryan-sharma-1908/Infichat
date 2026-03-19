import React, { useContext, useEffect, useRef, useState } from 'react'
import MessagesHeader from '../../components/ui/MessagesHeader'
import MessageInput from '../../components/ui/MessageInput'
import MessagesList from '@/components/ui/MessagesList'
import { useParams } from 'react-router-dom'
import { MessageContext } from '@/context/MesageContext'
import { v4 as uuid } from 'uuid'
import { ChatContext } from '@/context/ChatContext'
import apiClient from '@/lib/api-client'
import { DELETE_ALL_MESSAGES_ROUTES, MESSAGE_ROUTES, DELETE_MESSAGE_ROUTES, IMAGE_UPLOAD_ROUTES } from '@/utils/constants'
import { SocketContext } from '@/context/SocketContext'
import { UserContext } from '@/context/UserContext'
import { toast } from 'sonner'

const Conversation = () => {
  const { friendId } = useParams();
  const { socket } = useContext(SocketContext);
  const { friends } = useContext(ChatContext);
  const { user } = useContext(UserContext);
  const { messages, setMessages } = useContext(MessageContext);
  const [conversationId, setConversationId] = useState(null);
  const messagesRef = useRef(messages);
  const activeFriend = friends.find(friend => friend._id === friendId);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (!activeFriend?._id) return;

    const getOldMessages = async () => {
      try {
        const response = await apiClient.get(`${MESSAGE_ROUTES}/${activeFriend._id}`, { withCredentials: true });
        if (response.data.success) {
          setConversationId(response.data.conversationId);
        }
        setMessages(response.data.messages || []);
      } catch (error) {
        console.error('Error in getOldMessages: ', error);
        toast.error('Failed to load messages');
        setMessages([]);
      }
    }

    getOldMessages();
  }, [activeFriend?._id]);

  useEffect(() => {
    if (!socket) return;

    const handler = (socketMessage) => {
      const isAckForOptimisticMessage =
        !!socketMessage.clientMessageId &&
        messagesRef.current.some(m => m.clientMessageId === socketMessage.clientMessageId);

      if (isAckForOptimisticMessage && !conversationId && socketMessage.conversationId) {
        setConversationId(socketMessage.conversationId);
      }

      setMessages(prev => {
        // Replace optimistic message with server response by clientMessageId.
        const messageIndex = prev.findIndex(m =>
          m.clientMessageId && m.clientMessageId === socketMessage.clientMessageId
        );

        if (messageIndex !== -1) {
          const updated = [...prev];
          updated[messageIndex] = {
            ...updated[messageIndex],
            ...socketMessage
          };
          return updated;
        }

        // Before conversation is established for this screen, don't append unknown messages.
        if (!conversationId && socketMessage.conversationId) {
          setConversationId(socketMessage.conversationId);
        }

        if (String(socketMessage.conversationId) !== String(conversationId)) {
          return prev;
        }

        const alreadyExists = prev.some(m => m._id === socketMessage._id);
        if (alreadyExists) return prev;

        return [...prev, socketMessage];
      });
    };

    const handleMessageError = ({ clientMessageId }) => {
      if (!clientMessageId) return;
      setMessages(prev =>
        prev.map(m =>
          m.clientMessageId === clientMessageId ? { ...m, status: 'failed' } : m
        )
      );
    };

    socket.on('new_message', handler);
    socket.on('message_error', handleMessageError);

    return () => {
      socket.off('new_message', handler);
      socket.off('message_error', handleMessageError);
    };
  }, [socket, conversationId, setMessages]);

  useEffect(() => {
    if (!socket || !conversationId) return;
    socket.emit('join_conversation', conversationId);
  }, [socket, conversationId]);

  useEffect(() => {
    if (!socket) return;
    const handleMessagesDeleted = ({ conversationId: cid }) => {
      if (cid === conversationId) {
        setMessages([]);
      }
    }

    socket.on('delete_all_messages', handleMessagesDeleted);

    return () => { socket.off('delete_all_messages', handleMessagesDeleted); }
  }, [socket, conversationId]);

  useEffect(() => {
    if (!socket) return;

    const handleMessageDeleted = ({ conversationId, messageId, type }) => {
      if (type === 'delete_for_me') {
        setMessages(prev => prev.filter(m => m._id !== messageId && m.clientMessageId !== messageId))
      }
      if (type === 'delete_for_everyone') {
        setMessages(prev => prev.map(m => m._id === messageId ? { ...m, deletedAt: new Date() } : m))
      }
    }

    socket.on('message_deleted', handleMessageDeleted);

    return () => socket.off('message_deleted', handleMessageDeleted);
  }, [socket, conversationId])


  const handleSendMessage = async ({ text, image }) => {

    if (!socket) return;

    const clientMessageId = uuid();

    let localPreview = null;

    if (image) {
      localPreview = URL.createObjectURL(image);
    }

    // optimistic message for sender only
    const optimisticMessage = {
      _id: clientMessageId,
      clientMessageId,
      text: text || "",
      image: localPreview,
      senderId: user._id,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, optimisticMessage]);

    let imageUrl = null;

    if (image) {
      try {
        const formData = new FormData();
        formData.append("image", image);

        const response = await apiClient.post(
          IMAGE_UPLOAD_ROUTES,
          formData,
          { withCredentials: true }
        );


        if (response.data.success) {
          imageUrl = response.data.url;

          if(localPreview) {
            URL.revokeObjectURL(localPreview);
          }
        }

      } catch (error) {
        toast.error("Image upload failed.");
        return;
      }
    }

    socket.emit("send_message", {
      clientMessageId,
      text: text || "",
      image: imageUrl, // cloudinary url
      friendId
    });

  };

  const handleDeleteAllMessages = async () => {
    const previousMessages = messages;
    setMessages([]);
    try {
      const deletAllRoute = `${DELETE_ALL_MESSAGES_ROUTES}/${friendId}`
      const response = await apiClient.delete(`${deletAllRoute}`);

      if (response.data.success) {
        toast.success('All messages are deleted.')
      }

    } catch (error) {
      setMessages(previousMessages);
      console.error("Error in deleteAllMessages: ", error);
      toast.error("Error while deleting message");
    }
  }

  const deleteMessage = async (messageId, deleteForMe) => {
    // Delete message logic here 
    try {
      if (!messageId) {
        toast.error('Message ID not found.')
        return;
      }

      if (!friendId) {
        toast.error('Friend ID not found.')
        return;
      }

      const response = await apiClient.patch(`${DELETE_MESSAGE_ROUTES}/${messageId}`, {
        deleteForMe, friendId
      });

      if (response.data.success) {
        toast.success('Message deleted successfully');
      }

      if (deleteForMe) {
        setMessages(prev => prev.filter(m => m._id !== messageId && m.clientMessageId !== messageId))
      } else {
        setMessages(prev => prev.map(m => m._id === messageId ? { ...m, deletedAt: new Date() } : m))
      }
    } catch (error) {
      toast.error('Error while deleting message');
      console.error('Error in deleteMessage: ', error);
    }
  }


  return (
    <div className='flex flex-col h-full w-full'>
      <div className="shrink-0">
        <MessagesHeader onDeleteAll={handleDeleteAllMessages} />
      </div>
      <div className='flex-1 min-h-0 overflow-y-auto dark:bg-[#44444E]'>
        <MessagesList messages={messages} deleteMessage={deleteMessage} />
      </div>
      <div className="shrink-0 p-2 dark:bg-[#44444E]">
        <MessageInput onSend={handleSendMessage} />
      </div>
    </div>
  )
}

export default Conversation
