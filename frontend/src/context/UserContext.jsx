import apiClient from "@/lib/api-client";
import { USER_INFO_ROUTES } from "@/utils/constants";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [tab, setTab] = useState('signup');
    const getUserInfo = async () => {
        try {
            setIsLoading(true);
            const response = await apiClient.get(USER_INFO_ROUTES, { withCredentials: true });
            console.log(response.data.user);
            setUser(prev => ({
                ...prev,
                ...response.data.user
            }));
        } catch (error) {
            console.error("Error in getting user Info: ", error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getUserInfo();
    }, [])

    return (
        <UserContext.Provider value={{ user: user, loading: isLoading, setUser, getUserInfo, tab, setTab }} >
            {children}
        </UserContext.Provider>
    )
}


export default UserProvider;