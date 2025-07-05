import React, { useEffect, useState } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import type { IUser } from '../../../../store/authSlice'
import { useAppDispatch, useAppSelector } from '../../../../store/store'
import Loading from '../../../../components/Loading/Loading'
import Header from '../../components/Header'
import { fetchUserProfileById, setShowUser } from '../../../../store/profileSlide'

const ProfileLayout = () => {

    const {userId} = useParams();
    const showUser = useAppSelector(state => state.profile.showUser);
    const authUser = useAppSelector(state => state.auth.user);
    const dispatch = useAppDispatch();
    const fetchProfileStatus = useAppSelector(state => state.profile.status.fetchUserProfileById);
    
    const handleFetchUser = (userId: number)=>{
        
        if(Number(userId) === authUser?.id){
            dispatch(setShowUser(authUser));
        }else{
            // Fetch user 
            dispatch(fetchUserProfileById(userId));

        }
    } 

    useEffect(() => {
      if(userId){
        handleFetchUser(Number(userId));    
      }
    }, [userId]);

    if(!userId && !Number(userId)){
        return null;
    }

    if((!showUser || fetchProfileStatus === 'loading' || fetchProfileStatus === 'idle')){
        return <Loading/>
    }

  return (
    <div className='grid grid-cols-1 lg:grid-cols-[1fr_20rem] gap-4'>
        <div className=' w-full gap-4 flex flex-col items-center p-1'>
            <Header user={showUser} />
            <Outlet context={showUser} />
        </div>
        <div className='bg-blue-500 shadow min-h-screen w-full hidden lg:block'></div>
    </div>
  )
}

export default ProfileLayout
