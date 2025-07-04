import React from 'react'
import type { IUser } from '../../../../store/authSlice'
import Button from '@mui/material/Button'
import { useAppDispatch } from '../../../../store/store'
import { sendInvitation } from '../../../../store/networkingSlide'

const UserSuggestionCard = ({ user }: { user: IUser}) => {
    const dispatch = useAppDispatch();

  return (
    <div className='grid grid-cols-[auto_1fr_auto] items-center gap-2 not-last:border-b border-gray-200 pb-4'>
      <img src={user.profilePicture|| "/avatar.jpg"} alt={`Avatar ${user.id}`} className='w-12 h-12 rounded-full object-cover' />
      <div className='flex flex-col'>
        <span className='text-sm font-semibold text-gray-800'>{user.firstName + " " + user.lastName}</span>
        <span className='text-xs text-gray-600'>{user.location}</span>
        <span className='text-sm text-gray-600'>{user.position + " at " + user.company}</span>
      </div>
      <div>
        <Button variant="contained" color="primary" size='small' className='!text-xs !px-3 !py-1 !rounded-full' onClick={() => {
            dispatch(sendInvitation({ recipientId: user.id }));
        }}>
          Connect
        </Button>
      </div>
    </div>
  )
}

export default UserSuggestionCard
