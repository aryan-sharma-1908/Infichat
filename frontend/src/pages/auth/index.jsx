import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Background from '@/assets/login2.png'
import Victory from '@/assets/victory.svg'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import apiClient from '@/lib/api-client.js'
import { AUTH_ROUTES, SIGNUP_ROUTES } from '@/utils/constants'
import { LOGIN_ROUTES } from '@/utils/constants'
import { toast } from "sonner"
import { UserContext } from '@/context/UserContext'

const Auth = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false);

    const { setUser, getUserInfo, tab, setTab } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogin = async () => {
        setIsLoading(true);

        if (email.length == 0 || password.length == 0) {
            toast.warning('Please enter required credentials for login!');
            setIsLoading(false)
            return
        }

        try {
            const response = await apiClient.post(`${LOGIN_ROUTES}`, {
                email: email,
                password: password
            }, { withCredentials: true })
            await getUserInfo();
            if (response.data.success) {
                toast.success(response.data.message);
                navigate('/chats');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Something went wrong while logging in! ', error);
            const errorMessage = error.response?.data?.message || "Error occurred during login";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false)
            setEmail("")
            setPassword("")
        }
    }

    const handleSignup = async () => {
        setIsLoading(true);
        if (email.length == 0 || password.length == 0) {
            toast.warning('Please enter required credentials for signup!')
            setIsLoading(false);
            return;
        }

        if (password != confirmPassword) {
            toast.error('Password not matching!')
            setIsLoading(false)
            return;
        }

        try {

            const response = await apiClient.post(`${SIGNUP_ROUTES}`, {
                email: email,
                password: password
            })

            console.log(`${email} signup successful.`)
            toast.success('Signup successful.')
            setTab('login');
        } catch (error) {
            toast.error('Something went Wrong!')
            console.error('Error occured during signup!')
        } finally {
            setIsLoading(false);
            setEmail("");
            setPassword("");
            setConfirmPassword("");
        }
    }

    const handleEnterPressSignUp = (e) => {
        if(e.key === 'Enter') {
            e.preventDefault();
            handleSignup();
        }
    }

    const handleEnterPressLogin = (e) => {
        if(e.key === 'Enter') {
            e.preventDefault();
            handleLogin();
        }
    }

    return (
        <div className='h-screen w-screen flex items-center justify-center'>
            <div className='h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2'>
                <div className='flex flex-col gap-10 items-center justify-center'>
                    <div className="flex items-center justify-center flex-col">
                        <div className="flex items-center justify-center text-center">
                            <h1 className='text-5xl font-bold md:text-6xl text-center'>Welcome</h1>
                            <img src={Victory} alt="Victory emoji" className='h-[100px]' />
                        </div>

                        <p className='font-medium text-center'>Fill in the details to get started with the best chat app</p>
                        <div className="flex items-center justify-center w-full">
                            <Tabs value={tab} onValueChange={setTab} className='w-3/4'>
                                <TabsList className='bg-transparent rounded-none w-full'>
                                    <TabsTrigger value='login' className='data-[state=active]:bg-transparent text-black border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 text-opacity-90'>Login</TabsTrigger>
                                    <TabsTrigger value='signup' className='data-[state=active]:bg-transparent text-black border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 text-opacity-90'>Signup</TabsTrigger>
                                </TabsList>
                                <TabsContent value='login' className='flex flex-col gap-5 '>
                                    <Input type="email" placeholder='Email' value={email} onKeyDown={handleEnterPressLogin} onChange={(e) => {
                                        setEmail(e.target.value)
                                    }}
                                        className='rounded-full p-6' />
                                    <Input type="password" placeholder='Password' value={password} onKeyDown={handleEnterPressLogin} onChange={(e) => {
                                        setPassword(e.target.value)
                                    }}
                                        className='rounded-full p-6' />
                                    <Button className='rounded-full p-6 bg-black text-white active:scale-95 text-xl' onClick={handleLogin}>Login</Button>
                                </TabsContent>
                                <TabsContent value='signup' className='flex flex-col gap-5'>
                                    <Input type="email" placeholder='Email' value={email} required onKeyDown={handleEnterPressSignUp} onChange={(e) => {
                                        setEmail(e.target.value) 
                                    }}
                                        className='rounded-full p-6' />
                                    <Input type="password" placeholder='Password' value={password} required onKeyDown={handleEnterPressSignUp} onChange={(e) => {
                                        setPassword(e.target.value)
                                    }}
                                        className='rounded-full p-6' />
                                    <Input type="password" placeholder='Confirm Password' value={confirmPassword} required onKeyDown={handleEnterPressSignUp} onChange={(e) => {
                                        setConfirmPassword(e.target.value)
                                    }}
                                        className='rounded-full p-6' />
                                    <Button className='rounded-full p-6 bg-black text-white active:scale-95 text-xl' onClick={handleSignup} disabled={isLoading}>{isLoading ? "signing up..." : "Signup"}</Button>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
                <div className="hidden xl:flex justify-center items-center h-[600px]">
                    <img src={Background} alt="background login" />
                </div>
            </div>
        </div>
    )
}

export default Auth
