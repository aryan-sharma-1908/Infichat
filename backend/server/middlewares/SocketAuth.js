import { Socket } from "socket.io";
import jwt from "jsonwebtoken";

//Messaging Authentication
export const SocketAuth = (socket, next) => {
  try {
    const cookieHeader = socket.request.headers.cookie;

    if (!cookieHeader) {
      return next(new Error("No cookies found."));
    }

    const token = cookieHeader.split('; ').find(row => row.startsWith('token=')).split('=')[1];

    if(!token) {
        return next(new Error("No token provided."))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    socket.userId = decoded._id;

    next()
  } catch (error) {
    next(new Error("Authentication failed!"));
  }
};

export const AttachIo = (io) => {
    return (req,res,next) => {
        req.io = io;
        next();
    }
}