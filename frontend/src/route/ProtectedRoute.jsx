import { useContext } from 'react'
import { UserContext } from '@/context/UserContext'
import { Spinner } from "@/components/ui/spinner"
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
    const { user, loading } = useContext(UserContext);
    console.log("User in protected route", user);
    if (loading) {
        return <Spinner />
    }

    if (!user) {
        console.log("User not found in protected route, redirecting to login: ", user?.email);
        return <Navigate to='/auth' replace />
    }

    if (user && user.profileSetup === false) {
        console.log("User profile not setup, redirecting to profile setup: ", user?.email);
        return <Navigate to='/profile-setup' replace />
    }

    return <Outlet />
}

export default ProtectedRoute;