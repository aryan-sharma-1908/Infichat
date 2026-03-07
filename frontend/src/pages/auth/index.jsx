import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import apiClient from '@/lib/api-client.js'
import { AUTH_ROUTES, SIGNUP_ROUTES } from '@/utils/constants'
import { LOGIN_ROUTES } from '@/utils/constants'
import { toast } from "sonner"
import { UserContext } from '@/context/UserContext'
import ThemeButton from '@/components/ui/ThemeButton'

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

        if (!isValidEmail(email)) {
            toast.error("Enter a valid email!");
            setIsLoading(false);
            return;
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

        if (!isValidEmail(email)) {
            toast.error("Enter a valid email!");
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
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSignup();
        }
    }

    const handleEnterPressLogin = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleLogin();
        }
    }

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    return (
        <div className='min-h-screen w-full flex items-center justify-center px-4 py-8 bg-[linear-gradient(160deg,#fef5f6_0%,#f2fafd_50%,#f8f4f8_100%)] dark:bg-[linear-gradient(135deg,#1a1516_0%,#0f1a1f_50%,#151a24_100%)]'>
            <div className="flex items-center justify-between mb-6 absolute top-5 left-5 gap-3">
                <h1 className='text-2xl font-semibold text-gray-800 dark:text-white'>
                    <span className='text-[#fbadba]'>Infi</span>
                    <span className='text-[#2c7a8a] dark:text-[#8ADCF9]'>Chat</span>
                </h1>

                <div className="opacity-70 hover:opacity-100 transition">
                    <ThemeButton />
                </div>
            </div>

            <div className='dark:bg-[#37353E] dark:border-[#44444E] w-full max-w-md bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden'>
                {/* Top accent strip using both colors */}
                <div className='h-1.5 w-full flex'>
                    <span className='flex-1 bg-[#fbadba]' />
                    <span className='flex-1 bg-[#8ADCF9]' />
                </div>
                <div className='px-6 py-6'>
                    <div className="mb-6 text-center">
                        <h1 className='text-2xl font-semibold text-gray-800 dark:text-white'>
                            <span className='text-[#fbadba]'>Infi</span><span className='text-[#2c7a8a] dark:text-[#8ADCF9]'>Chat</span>
                        </h1>
                        <p className='mt-2 text-sm text-gray-600 dark:text-[#D3DAD9]'>
                            Sign in or create an account to start chatting with friends.
                        </p>
                    </div>

                    <Tabs value={tab} onValueChange={setTab} className='w-full'>
                        <TabsList className='w-full flex border-b border-gray-200 dark:border-gray-600 bg-transparent rounded-none mb-4'>
                            <TabsTrigger
                                value='login'
                                className='w-1/2 pb-2.5 text-sm font-medium text-gray-500 dark:text-gray-400 data-[state=active]:text-gray-800 data-[state=active]:dark:text-white data-[state=active]:border-b-2 data-[state=active]:border-b-[#fbadba] rounded-none'
                            >
                                Login
                            </TabsTrigger>
                            <TabsTrigger
                                value='signup'
                                className='w-1/2 pb-2.5 text-sm font-medium text-gray-500 dark:text-gray-400 data-[state=active]:text-gray-800 data-[state=active]:dark:text-white data-[state=active]:border-b-2 data-[state=active]:border-b-[#8ADCF9] rounded-none'
                            >
                                Signup
                            </TabsTrigger>
                        </TabsList>

                        <div className='min-h-[250px]'>
                            <TabsContent value='login' className='mt-4 flex flex-col gap-4 data-[state=inactive]:hidden'>
                                <Input
                                    type="email"
                                    placeholder='Email'
                                    value={email}
                                    onKeyDown={handleEnterPressLogin}
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                    }}
                                    className='rounded-xl border border-gray-300 dark:border-gray-500 bg-gray-50/50 dark:bg-white/5 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#D3DAD9] focus-visible:ring-2 focus-visible:ring-[#8ADCF9]/60 focus-visible:border-[#8ADCF9]'
                                />
                                <Input
                                    type="password"
                                    placeholder='Password'
                                    value={password}
                                    onKeyDown={handleEnterPressLogin}
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                    }}
                                    className='rounded-xl border border-gray-300 dark:border-gray-500 bg-gray-50/50 dark:bg-white/5 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#D3DAD9] focus-visible:ring-2 focus-visible:ring-[#8ADCF9]/60 focus-visible:border-[#8ADCF9]'
                                />
                                <Button
                                    className='mt-1 rounded-xl bg-[#fbadba] hover:bg-[#f59aa8] text-gray-800 text-sm font-medium py-3 border-0 shadow-sm transition-colors active:scale-[0.99]'
                                    onClick={handleLogin}
                                >
                                    Login
                                </Button>
                            </TabsContent>

                            <TabsContent value='signup' className='mt-4 flex flex-col gap-4'>
                                <Input
                                    type="email"
                                    placeholder='Email'
                                    value={email}
                                    required
                                    onKeyDown={handleEnterPressSignUp}
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                    }}
                                    className='rounded-xl border border-gray-300 dark:border-gray-500 bg-gray-50/50 dark:bg-white/5 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#D3DAD9] focus-visible:ring-2 focus-visible:ring-[#8ADCF9]/60 focus-visible:border-[#8ADCF9]'
                                />
                                <Input
                                    type="password"
                                    placeholder='Password'
                                    value={password}
                                    required
                                    onKeyDown={handleEnterPressSignUp}
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                    }}
                                    className='rounded-xl border border-gray-300 dark:border-gray-500 bg-gray-50/50 dark:bg-white/5 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#D3DAD9] focus-visible:ring-2 focus-visible:ring-[#8ADCF9]/60 focus-visible:border-[#8ADCF9]'
                                />
                                <Input
                                    type="password"
                                    placeholder='Confirm Password'
                                    value={confirmPassword}
                                    required
                                    onKeyDown={handleEnterPressSignUp}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value)
                                    }}
                                    className='rounded-xl border border-gray-300 dark:border-gray-500 bg-gray-50/50 dark:bg-white/5 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#D3DAD9] focus-visible:ring-2 focus-visible:ring-[#8ADCF9]/60 focus-visible:border-[#8ADCF9]'
                                />
                                <Button
                                    className='mt-1 rounded-xl bg-[#8ADCF9] hover:bg-[#6fd4f7] text-gray-800 text-sm font-medium py-3 border-0 shadow-sm transition-colors active:scale-[0.99]'
                                    onClick={handleSignup}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Signing up..." : "Sign up"}
                                </Button>
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

export default Auth
