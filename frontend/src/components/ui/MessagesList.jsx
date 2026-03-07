import React, { useContext, useEffect, useRef, useState } from 'react'
import MessageBubble from './MessageBubble'
import { UserContext } from '@/context/UserContext';
import { DELETE_MESSAGE_ROUTES } from '@/utils/constants';
import apiClient from '@/lib/api-client';

const MessagesList = ({ messages, deleteMessage }) => {
    const { user } = useContext(UserContext);
    const bottomRef = useRef();
    const [contextMenu, setContextMenu] = useState(null);
    const menuRef = useRef(null);
    useEffect(() => {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    useEffect(() => {
        if (!contextMenu) return;

        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setContextMenu(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [contextMenu]);


    const openMessageContextMenu = (e, messageId, from) => {
        e.preventDefault();
        e.stopPropagation();
        let x = e.clientX;
        let y = e.clientY;
        const containerHeight = 180;
        const containerWidth = 80;
        const viewPortWidth = window.innerWidth;
        const viewPortHeight = window.innerHeight;

        const anchorX = x + containerWidth + 120 > viewPortWidth ? 'right' : 'left';
        const anchorY = y + containerHeight + 120 > viewPortHeight ? 'bottom' : 'top';

        setContextMenu({
            x,
            y,
            anchorX,
            anchorY,
            messageId,
            from
        })
    }

    console.log(messages);
    

    return (
        <div className='flex flex-col gap-2 py-2 px-2'>
            {messages.map(message => (
                <MessageBubble
                    key={message._id ?? message.clientMessageId}
                    text={message.text}
                    image={message.image}
                    from={message.senderId === user._id ? 'me' : 'them'}
                    deletedForEveryone={!!message.deletedAt}
                    time={new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                    status={message.status}
                    onRightClick={(e) =>
                        openMessageContextMenu(
                            e,
                            message._id,
                            message.senderId === user._id ? 'me' : 'them'
                        )
                    }
                />


            ))}
            {contextMenu && (
                <div
                    ref={menuRef}
                    className="fixed bg-white shadow-lg rounded-md z-50 w-[180px]"
                    style={{
                        ...(contextMenu.anchorX === 'left' ?
                            { left: contextMenu.x } : { right: window.innerWidth - contextMenu.x }
                        ),
                        ...(contextMenu.anchorY === 'top' ?
                            { top: contextMenu.y } : { bottom: contextMenu.y }
                        )
                    }}
                >
                    <button className="block w-full px-4 py-2 text-left hover:bg-gray-100" onClick={() => {
                        deleteMessage(contextMenu?.messageId, true)
                        setContextMenu(null);
                    }}>Delete for me</button>
                    {contextMenu.from === 'me' && (
                        <button className='block w-full px-4 py-2 text-left hover:bg-gray-100' onClick={() => {
                            deleteMessage(contextMenu?.messageId, false)
                            setContextMenu(null);
                        }}>Delete for everyone</button>
                    )}
                </div>
            )}
            <div ref={bottomRef} />
        </div>
    )
}

export default MessagesList
