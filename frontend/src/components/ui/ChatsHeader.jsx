import React, { useState } from 'react'
import { CiSearch } from "react-icons/ci";
import { InputGroup, InputGroupAddon, InputGroupInput } from './input-group';
import Addfriends from './Addfriends';
const ChatsHeader = ({ setSearchQuery, searchQuery }) => {

  const handleSearchQuery = (e) => {
    setSearchQuery(e.target.value)
  }
  return (
    <div className='dark:bg-[#37353E] bg-white w-full border-b-white border-b-2 pb-2 dark:border-0'>
      <div className='flex justify-between px-6 py-2'>
        <div className='flex items-center'>
          <div className='w-14 h-14 rounded-full translate-y-[3px]'>
            <img src="/logo.png" alt="" className='w-full h-full object-cover' />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900/70 dark:text-white/70">
            InfiChat
          </h1>
        </div>
        <Addfriends />
      </div>

      <div className='px-4'>
        <InputGroup className="rounded-4xl focus-within:ring-0! dark:border-[#D3DAD9] border-gray-300">
          <InputGroupInput
            placeholder="Search..."
            value={searchQuery} onChange={handleSearchQuery} className='dark:text-white placeholder:text-[#D3DAD9]'
          />
          <InputGroupAddon>
            <CiSearch className='dark:text-[#D3DAD9]' />
          </InputGroupAddon>
        </InputGroup>

      </div>
    </div>
  )
}

export default ChatsHeader
