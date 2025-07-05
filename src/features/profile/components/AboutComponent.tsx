import React from 'react'
import type { IUser } from '../../../store/authSlice'
import { useAppSelector } from '../../../store/store'
interface Props {
  showUser: IUser
}
const AboutComponent = ({ showUser }: Props) => {
  const authenticatedUser = useAppSelector(state => state.auth.user)
  return (
    <>
      <div className='w-full h-max p-4 bg-white shadow rounded-md'>
        <h2 className='text-xl font-semibold text-gray-800'>About</h2>
        <p className='text-gray-600 text-center'>{showUser.about || "Not provided"}</p>
        {authenticatedUser?.id === showUser.id && <button className='mt-2 bg-gray-200 px-2 py-1 rounded-md w-full font-semibold text-gray-800 hover:bg-gray-300 cursor-pointer'>Edit</button>}
      </div>
    </>
  )
}

export default AboutComponent
