import React from 'react'
import type { IUser } from '../../../store/authSlice'
import { useNavigate } from 'react-router-dom'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import LocationOnIcon from '@mui/icons-material/LocationOn';
interface Props {
  showUser: IUser
}
const InformationComponent = ({ showUser }: Props) => {
  const navigate = useNavigate()
  return (
    <div className='mt-5'>
      <div className='flex items-center mt-2'>
        <LocationOnIcon className='mr-1' />
        <p className='text-gray-600'>{showUser.location || "Unknown Location"}</p>
      </div>
      <div className='flex items-center mt-2'>
        <AlternateEmailIcon className='mr-1' />
        <p className='text-gray-600'>{showUser.email || "Unknown Email"}</p>
      </div>

      <button onClick={() =>{
        navigate(`/profile/${showUser.id}/info`)
      }} className='mt-2 bg-gray-200 px-2 py-1 
        rounded-md w-full font-semibold text-gray-800 hover:bg-gray-300 cursor-pointer'>Information Details</button>
    </div>
  )
}

export default InformationComponent