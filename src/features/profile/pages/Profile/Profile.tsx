import React, { useEffect, useState } from 'react'
import About from './components/About'
import Posts from './components/Posts'
import Header from './components/Header'
import { useParams } from 'react-router-dom'
import type { IUser } from '../../../../store/authSlice'
import { useAppSelector } from '../../../../store/store'
import Loading from '../../../../components/Loading/Loading'

const Profile = () => {

    const {userId} = useParams();
    const [loading, setLoading] = useState(false);
    const [showUser, setShowUser] = useState<IUser>();
    const authUser = useAppSelector(state => state.auth.user);
    
    const handleFetchUser = async (userId: number)=>{
        
        if(Number(userId) === authUser?.id){
            setShowUser(authUser);
            
        }else{
            // Fetch user 
            setLoading(true);
            setLoading(false);
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
    
    if(!showUser || loading){
        return <Loading/>
    }

  return (
    <div className='grid grid-cols-1 lg:grid-cols-[1fr_20rem] gap-4'>
        <div className=' w-full gap-4 flex flex-col items-center p-1'>
            <Header user={showUser} />
            <About />
            <Posts userId={Number(userId)} />
        </div>
        <div className='bg-blue-500 shadow min-h-screen w-full hidden lg:block'></div>
    </div>
  )
}

export default Profile
