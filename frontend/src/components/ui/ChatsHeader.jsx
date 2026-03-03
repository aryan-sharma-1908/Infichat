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
      <div className='flex justify-between px-6 py-4'>
        <h1 className='text-4xl font-extrabold font-serif dark:text-white'>ChatApp</h1>
        <Addfriends />
      </div>

      <div className='px-4'>
        <InputGroup className="rounded-4xl focus-within:ring-0! dark:border-[#D3DAD9] border-gray-300">
          <InputGroupInput
            placeholder="Search..."
            value={searchQuery} onChange={handleSearchQuery} className='dark:text-white placeholder:text-[#D3DAD9]'
          />
          <InputGroupAddon>
            <CiSearch className='dark:text-[#D3DAD9]'/>
          </InputGroupAddon>
        </InputGroup>

      </div>
    </div>
  )
}

export default ChatsHeader
