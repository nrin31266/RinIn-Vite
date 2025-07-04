import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import { fetchConnections } from '../../../../store/networkingSlide';
import Divider from '@mui/material/Divider';
import ConnectionCard from '../../components/ConnectionCard/ConnectionCard';

const Connections = () => {
const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { connections, error, status } = useAppSelector(
    (state) => state.networking
  );

  useEffect(() => {
    dispatch(fetchConnections());
  }, [dispatch, user?.id]);

  return (
      <div className="flex flex-col border-1 border-gray-200 rounded-md bg-white">
      <div className="p-4">
        <h1 className="text-md font-bold text-gray-800">
          Connections ({connections.length})
        </h1>
        
      </div>
      <Divider/>
      
      <div className="flex flex-col gap-4 px-4 pt-4">
        {connections.length > 0 ? (
          connections.map((connection) => (
            <ConnectionCard key={connection.id} connection={connection} type="accepted" />
          ))
        ) : (
          <div className="text-gray-500 text-sm py-4">
            No connections at the moment.
          </div>
        )}
      </div>
    </div>
  )
}

export default Connections
