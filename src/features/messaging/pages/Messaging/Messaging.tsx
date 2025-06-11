import React from 'react'
import { Outlet, useParams, useSearchParams } from 'react-router-dom'
import MessagingLeftBar from '../../components/MessagingLeftBar/MessagingLeftBar'

const Messaging = () => {
  const {conversationId} = useParams()
  const [searchParams] = useSearchParams();
  const recipientId = searchParams.get('recipientId')

  const isConversationSelected = Boolean(conversationId || recipientId);



  return (
    <div className='grid xl:grid-cols-[1fr_20rem] gap-4 px-1 md:px-2'>
      <div className='grid lg:grid-cols-[20rem_1fr] border border-gray-200 bg-white rounded-sm'>
        <div className={`lg:border-r border-gray-200 lg:block ${isConversationSelected ? 'hidden' : 'block'}`}>
          <MessagingLeftBar />
        </div>
        <div className={`lg:block ${isConversationSelected ? 'block' : 'hidden'}`}>
          <Outlet />
        </div>
      </div>
      <div className='hidden xl:block bg-amber-300'>2</div>
    </div>
  )
}

export default Messaging