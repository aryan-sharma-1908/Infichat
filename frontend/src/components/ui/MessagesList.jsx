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
        const x = e.clientX;
        const y = e.clientY;

        const MENU_WIDTH = 200; // keep in sync with w-[200px]
        const MENU_PADDING = 10;
        const optionsCount = from === 'me' ? 2 : 1;
        const MENU_HEIGHT = optionsCount === 2 ? 110 : 68; // approx (2 items vs 1 item)

        const left = Math.min(
            Math.max(x, MENU_PADDING),
            window.innerWidth - MENU_WIDTH - MENU_PADDING
        );
        const top = Math.min(
            Math.max(y, MENU_PADDING),
            window.innerHeight - MENU_HEIGHT - MENU_PADDING
        );

        setContextMenu({ left, top, messageId, from })
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
                    className="fixed z-50 w-[200px] rounded-xl border border-black/10 bg-white shadow-lg overflow-hidden dark:bg-[#2B2B34] dark:border-white/10"
                    style={{
                        left: contextMenu.left,
                        top: contextMenu.top,
                    }}
                >
                    <button
                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100 dark:text-white dark:hover:bg-[#44444E] flex items-center gap-2 border-b border-black/5 dark:border-white/10"
                        onClick={() => {
                            deleteMessage(contextMenu?.messageId, true)
                            setContextMenu(null);
                        }}
                    >
                        <span className="h-2 w-2 rounded-full bg-[#fbadba]" />
                        Delete for me
                    </button>

                    {contextMenu.from === 'me' && (
                        <button
                            className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100 dark:text-white dark:hover:bg-[#44444E] flex items-center gap-2"
                            onClick={() => {
                                deleteMessage(contextMenu?.messageId, false)
                                setContextMenu(null);
                            }}
                        >
                            <span className="h-2 w-2 rounded-full bg-[#8ADCF9]" />
                            Delete for everyone
                        </button>
                    )}
                </div>
            )}
            <div ref={bottomRef} />
        </div>
    )
}

export default MessagesList
