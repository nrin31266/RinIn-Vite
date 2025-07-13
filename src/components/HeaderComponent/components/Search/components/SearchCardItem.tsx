import React from 'react'
import type { IUser } from '../../../../../store/authSlice';
import { useNavigate } from 'react-router-dom';
interface SearchCardItemProps {
    // Define any props you need for SearchCardItem
    user: IUser;
    onClick: () => void;
}
const SearchCardItem = ({ user, onClick }: SearchCardItemProps) => {

  return (
    <div
      onClick={onClick}
      className='p-2 border-gray-200 hover:bg-gray-200 cursor-pointer not-last:border-b grid grid-cols-[auto_1fr] gap-2 items-center'>
        <img
            src={user.profilePicture || "/avatar.jpg"}
            alt={user.id.toString() || "Unknown User"}
            className="h-10 w-10 rounded-full object-cover"
        />
        <div className='flex flex-col'>
            <h1 className='text-sm font-semibold'>{user.firstName + " " + user.lastName || "Unknown User"}</h1>
            <p className='text-xs text-gray-500'>{user.position + " at " + user.company || "Unknown Company"}</p>
        </div>
    </div>
  )
}

export default SearchCardItem