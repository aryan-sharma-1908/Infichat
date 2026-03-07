import React, { useContext, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button';
import { FiEdit2 } from "react-icons/fi";
import { toast } from "sonner"
import apiClient from '@/lib/api-client';
import { PROFILE_ROUTES, IMAGE_UPLOAD_ROUTES } from '@/utils/constants';
import { UserContext } from '@/context/UserContext';
import ThemeButton from '@/components/ui/ThemeButton'

const ProfileSetup = () => {
  const { user, setUser, getUserInfo } = useContext(UserContext);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(user.avatar || "");
  const [name, setName] = useState(user.name || '');
  const [description, setDescription] = useState(user.description || "");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();
  const navigate = useNavigate();
  const openPicker = () => {
    fileRef.current.click();
  }

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  const handleSave = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (!name) {
      toast.warning("Please enter your name")
      setLoading(false);
      return;
    }

    if (!image) {
      toast.warning("Please select a profile image")
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', image);

      const response_Image = await apiClient.post(IMAGE_UPLOAD_ROUTES, formData, {
        withCredentials: true
      })

      if (response_Image.data.success) {
        const imageURL = response_Image.data.url;
        const response_info = await apiClient.post(PROFILE_ROUTES, {
          name,
          avatar: imageURL,
          description
        })

        if (response_info.data.success)
          setUser(prev => ({
            ...prev,
            ...response_info.data.user
          }));
      }

      toast.success('Profile saved successfully.');
      setTimeout(() => {
        navigate('/chats')
      }, 500)
    } catch (error) {
      console.error("Error while saving the profile", error);
      toast.error("Error occured while saving the profile");
    } finally {
      setLoading(false);
    }


  }
  return (
    <div className='min-h-screen w-full flex items-center justify-center px-4 py-8 bg-[linear-gradient(160deg,#fef5f6_0%,#f2fafd_50%,#f8f4f8_100%)] dark:bg-[linear-gradient(135deg,#1a1516_0%,#0f1a1f_50%,#151a24_100%)] relative overflow-hidden'>
      <header className="absolute top-0 left-0 right-0 px-5 py-4 flex items-center justify-between">
        <h1 className='text-2xl font-semibold text-gray-800 dark:text-white'>
          <span className='text-[#fbadba]'>Infi</span>
          <span className='text-[#2c7a8a] dark:text-[#8ADCF9]'>Chat</span>
        </h1>

        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/60 dark:bg-white/10 backdrop-blur-sm border border-gray-200/50 dark:border-white/10 shadow-sm">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 hidden sm:inline">Theme</span>
          <ThemeButton />
        </div>
      </header>
      <form onSubmit={handleSave} className='w-full max-w-lg'>
        <div className='bg-white dark:bg-[#37353E] rounded-2xl shadow-md border border-gray-200 dark:border-[#44444E] overflow-hidden'>
          {/* Top accent strip */}
          <div className='h-1.5 w-full flex'>
            <span className='flex-1 bg-[#fbadba]' />
            <span className='flex-1 bg-[#8ADCF9]' />
          </div>
          <div className='px-6 py-6'>
            <div className='text-center mb-6'>
              <h1 className='text-2xl font-semibold text-gray-800 dark:text-white'>
                <span className='text-[#fbadba]'>Profile</span>
                <span className='text-[#2c7a8a] dark:text-[#8ADCF9]'> setup</span>
              </h1>
              <p className='mt-1 text-sm text-gray-600 dark:text-[#D3DAD9]'>
                Add a photo and a few details so friends can find you.
              </p>
            </div>

            <div className='flex flex-col sm:flex-row sm:items-start gap-6'>
              <div className='flex justify-center'>
                <button
                  type='button'
                  onClick={openPicker}
                  className='relative rounded-full w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center overflow-hidden border-2 border-[#fbadba]/50 dark:border-[#8ADCF9]/50 bg-gray-100 dark:bg-white/10 shadow-md group cursor-pointer'
                >
                  <img src={preview || '/user.png'} alt='' className='w-full h-full object-cover' />
                  <div className='absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition rounded-full'>
                    <FiEdit2 className='text-white text-2xl sm:text-3xl' />
                  </div>
                </button>
              </div>
              <input type='file' accept='image/*' ref={fileRef} onChange={handleFile} className='hidden' />

              <div className='flex-1 flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                  <Label htmlFor='display-name' className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                    Display name <span className='text-[#fbadba]'>*</span>
                  </Label>
                  <Input
                    id='display-name'
                    type='text'
                    placeholder='Your name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className='rounded-xl border border-gray-300 dark:border-gray-500 bg-gray-50/50 dark:bg-white/5 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#D3DAD9] focus-visible:ring-2 focus-visible:ring-[#8ADCF9]/60 focus-visible:border-[#8ADCF9]'
                  />
                </div>
                <div className='flex flex-col gap-2'>
                  <Label htmlFor='description' className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                    Description
                  </Label>
                  <Textarea
                    id='description'
                    placeholder='A short bio (optional)...'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className='rounded-xl border border-gray-300 dark:border-gray-500 bg-gray-50/50 dark:bg-white/5 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#D3DAD9] focus-visible:ring-2 focus-visible:ring-[#8ADCF9]/60 focus-visible:border-[#8ADCF9] resize-none min-h-[88px]'
                  />
                </div>
                <Button
                  type='submit'
                  disabled={loading}
                  className='rounded-xl bg-[#fbadba] hover:bg-[#f59aa8] text-gray-800 text-sm font-medium py-3 border-0 shadow-sm transition-colors active:scale-[0.99] mt-1'
                >
                  {loading ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ProfileSetup
