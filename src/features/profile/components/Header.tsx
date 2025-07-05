import React, { use } from 'react'

import ProfileMenu from './ProfileMenu'
import type { IUser } from '../../../store/authSlice'

interface Props{
    user: IUser
}
const Header = ({user}: Props) => {
    
  return (
    <div className='w-full bg-white shadow rounded-[8px]'>
        <img src="/test2.jpg" className='w-full h-[13rem] sm:h-[14rem] md:h-[17rem] xl:h-[21rem] object-cover object-center rounded-[8px_8px_0_0]'  alt="" />
        <div className='flex justify-start px-2 items-center -mt-12'>
            <div className='grid grid-cols-[auto_1fr]'>
                <img src={"/avatar.jpg"} alt="" className='border-6 scale-z-50 border-white size-36 rounded-full'/>
                <div className='flex flex-col justify-end py-2'>
                    <h1 className='text-2xl font-bold text-gray-950'>{user.firstName + " " + user.lastName}</h1>
                </div>
            </div>
        </div>
        <ProfileMenu authenticatedUser={user} />
    </div>
  )
}

export default Header
