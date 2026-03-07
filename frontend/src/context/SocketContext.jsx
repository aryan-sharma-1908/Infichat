import { createContext, useRef, useState, useMemo } from "react";
import { io } from "socket.io-client";
import apiClient from "@/lib/api-client";

export const SocketContext = createContext(null);

const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);

  const connectSocket = () => {
    // Prevent duplicate connections
    if (socketRef.current) return;
    console.log('called');

    const socketInstance = io(apiClient.defaults.baseURL, {
      withCredentials: true,
      transports: ["websocket"],
    });

    socketRef.current = socketInstance;
    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("✅ Socket connected:", socketInstance.id);
    });

    socketInstance.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    socketInstance.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });
  };

  const disconnectSocket = () => {
    if (!socketRef.current) return;

    socketRef.current.disconnect();
    socketRef.current = null;
    setSocket(null);
  };

  const value = useMemo(() => ({
    socket,
    connectSocket,
    disconnectSocket,
  }), [socket]);

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
