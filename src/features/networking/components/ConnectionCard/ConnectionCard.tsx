import React from 'react'
import { acceptInvitation, rejectOrCancelInvitation, type IConnection } from '../../../../store/networkingSlide'
import { useAppDispatch, useAppSelector } from '../../../../store/store'
import Button from '@mui/material/Button';


const ConnectionCard = ({ connection, type} : {connection : IConnection, type: "sent" | "received" | "accepted"}) => {

  const dispatch = useAppDispatch();
  const {user} = useAppSelector((state) => state.auth);
  const isSent = connection.author.id === user?.id;
  const accountToShow = user?.id === connection.author.id ? connection.recipient : connection.author;

  return (
    <div className='grid grid-cols-[auto_1fr_auto] items-center gap-2 not-last:border-b border-gray-200 pb-4'>
      <img src={accountToShow.profilePicture||"/avatar.jpg"} alt={accountToShow.id} className='w-12 h-12 min-w-12 rounded-full object-cover' />
      <div className='flex flex-col'>
        <span className='font-medium text-gray-800'>{accountToShow.firstName + " " + accountToShow.lastName}</span>
        <span className='text-xs text-gray-500'>{accountToShow.email}</span>
        <span className='text-sm text-gray-600'>{accountToShow.position + " at " + accountToShow.company}</span>
      </div>
      <div className='flex items-center gap-2 flex-col md:flex-row'>
        {type === "sent" ? (
          <>
            <Button className='!rounded-full !text-xs !px-3 !py-1'  variant='outlined' size='small' color='secondary' onClick={()=>{
              dispatch(rejectOrCancelInvitation({ id: connection.id, action: 'CANCELED' }));
            }}>
              Cancel
            </Button>
          </>
        ) : type === "received" ? (
          <>
           <Button className='!rounded-full !text-xs !px-3 !py-1'  variant='contained' size='small' color='primary' onClick={()=>{
              dispatch(acceptInvitation({ id: connection.id}));
            }}>
              Accept
            </Button>
            <Button className='!rounded-full !text-xs !px-3 !py-1'  variant='outlined' size='small' color='error' onClick={()=>{
              dispatch(rejectOrCancelInvitation({ id: connection.id, action: 'REJECTED' }));
            }}>
              Reject
            </Button>
           
          </>
        ) : type === "accepted" ? (
          <>
            <Button className='!rounded-full !text-xs !px-3 !py-1'  variant='outlined' size='small' color='secondary' onClick={()=>{
              dispatch(rejectOrCancelInvitation({ id: connection.id, action: 'DISCONNECTED' }));
            }}>
              Disconnect
            </Button>
          </>
        ) : null}
      </div>
    </div>
  )
}

export default ConnectionCard