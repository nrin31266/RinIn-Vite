import React, { use } from 'react'
import Posts from '../../components/Posts'
import { useOutletContext, useParams } from 'react-router-dom';
import About from '../../components/AboutComponent';
import { Outlet } from 'react-router-dom';
import type { IUser } from '../../../../store/authSlice';

const Profile = () => {
    const {userId} = useParams();

    if(!userId || isNaN(Number(userId))){
        return <div className='text-center text-red-500'>Invalid User ID</div>
    }
    //Get context Outlet
    const showUser: IUser = useOutletContext();

  return (
    <div className='w-full h-full grid grid-cols-1 xl:grid-cols-[20rem_1fr] gap-4'>
        <About showUser={showUser} />
        <Posts userId={Number(userId)} />
    </div>
  )
}

export default Profile