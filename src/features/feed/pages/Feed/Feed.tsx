import React from 'react'
import { FeedHeader } from '../../components/FeedHeader/FeedHeader'
import Posts from '../../components/Posts/Posts'

const Feed = () => {
  return (
    <div className='grid xl:grid-cols-[17rem_1fr_20rem] md:grid-cols-[17rem_1fr] grid-cols-[1fr] gap-4'>
      <div className='bg-red-500 hidden md:block h-max fixed w-[17rem]'>Left</div><div className='hidden md:block w-max'></div>
      <div className='p-2 space-y-4 flex flex-col'>
        <FeedHeader/>
        <Posts/>
      </div>
      <div className='bg-blue-500 hidden xl:block h-max'>Right Sidebar</div>
    </div>
  )
}

export default Feed
