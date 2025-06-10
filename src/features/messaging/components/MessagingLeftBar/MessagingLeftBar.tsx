import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import React, { useState } from 'react'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import IconButton from '@mui/material/IconButton';
import DoNotDisturbOnOutlinedIcon from '@mui/icons-material/DoNotDisturbOnOutlined';
import ListConversations from '../ListConversations/ListConversations';
import SearchConversations from '../SearchConversations/SearchConversations';
const MessagingLeftBar = () => {

  const [search, setSearch] = useState(false);

  return (
    <div>
      <div className='p-2 flex justify-between items-center'>
        <h1 className='text-md font-bold text-gray-800'>Messaging</h1>
        <IconButton className='' size='small'>
          {!search ? (
            <AddCircleOutlineIcon onClick={() => setSearch(true)} className='text-gray-600 hover:text-gray-800' />
          ) : (
            <DoNotDisturbOnOutlinedIcon onClick={() => setSearch(false)} className='text-gray-600 hover:text-gray-800' />
          )}
        </IconButton>
      </div>
      <Divider/>
      <div className={`${search ? 'hidden' : 'block'}`}>
            <ListConversations/>
          </div>
          <div className={`${search ? 'block' : 'hidden'}`}>
            <SearchConversations/>
          </div>
    </div>
  )
}

export default MessagingLeftBar