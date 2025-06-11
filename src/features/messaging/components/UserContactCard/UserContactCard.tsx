import React from 'react'
import type { IUser } from '../../../../store/authSlice'
import { useNavigate } from 'react-router-dom'

const UserContactCard = ({contact} : {contact:IUser}) => {
    const navigate = useNavigate();

  return (
    <div onClick={() => {navigate(`/messaging/conversations/new?recipientId=${contact.id}`)}} className='grid grid-cols-[auto_1fr] gap-4 items-center p-2 rounded-sm hover:bg-gray-100 cursor-pointer'>
      <img src={contact.profilePicture || "/avatar.jpg"} alt=""  className='w-12 h-12 object-cover rounded-full'/>
      <div>
        <h1 className='text-sm font-bold text-gray-800'>{contact.firstName} {contact.lastName}</h1>
        <p className='text-xs text-gray-600'>{contact.position} at {contact.company}</p>
      </div>
    </div>
  )
}

export default UserContactCard