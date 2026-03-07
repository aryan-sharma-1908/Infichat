import { createContext, useOptimistic, useState, useMemo } from 'react'
import { v4 as uuid } from 'uuid'
export const MessageContext = createContext(null);

const MessageProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);

    const value = useMemo(() => ({
        messages,
        setMessages
    }), [messages]);

    return (
        <MessageContext.Provider value={value}>
            {children}
        </MessageContext.Provider>
    )
}

export default MessageProvider
