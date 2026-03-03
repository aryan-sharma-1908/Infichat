import React, { useContext, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdOutlineModeEditOutline } from "react-icons/md";
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button';
import { FaRegUser } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { toast } from "sonner"
import apiClient from '@/lib/api-client';
import { PROFILE_ROUTES, UPLOAD_ROUTES } from '@/utils/constants';
import { UserContext } from '@/context/UserContext';

const ProfileSetup = () => {
  const { user, setUser, getUserInfo } = useContext(UserContext);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
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
      toast.warning("Please enter required fields")
      setLoading(false);
      return;
    }
    try {
      const formData = new FormData();
      formData.append('file', image);

      const response_Image = await apiClient.post(UPLOAD_ROUTES, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }, { withCredentials: true })

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
          ...response_info.data.user}));
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
    <div className='flex justify-center items-center w-full h-screen'>
      <form onSubmit={handleSave}>
        <div className="h-120 w-180 shadow-lg flex items-center p-3">
          <div className={`profileImage rounded-full w-50 h-50 min-w-50 flex items-center justify-center group border-black border bg-gray-500/50 relative cursor-pointer shadow-md ${preview ? '' : 'p-5'}`} onClick={openPicker}>
            <div className='absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition rounded-full'>
              <FiEdit2 className=' text-white text-4xl' />
            </div>
            <img src={preview || '/user.png'} alt="" className='w-full h-full object-fit rounded-full' />
          </div>
          <input type="file" accept='image/*' ref={fileRef} onChange={handleFile} className='hidden' />

          <div className='flex flex-col w-full px-6 gap-6'>
            <div className='gap-2 flex flex-col'>
              <div className='flex gap-1'>
                <Label htmlFor="text">Display Name</Label>
                <span className='text-red-600 font-bold'>*</span>
              </div>
              <Input type="text" id="text" placeholder="Name" className='outline-0! ring-0!' value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className='flex flex-col gap-2'>
              <Label>Description</Label>
              <Textarea className='outline-0! ring-0! resize-none' placeholder='Enter your description...' value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <Button className={`bg-green-600 hover:bg-green-700 w-20 h-10 text-white text-lg shadow-md border border-white`} type='submit' disabled={loading}>Save</Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ProfileSetup
