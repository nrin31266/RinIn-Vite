import Divider from '@mui/material/Divider'
import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../store/store'
import UserSuggestionCard from '../UserSuggestionCard/UserSuggestionCard'
import { fetchSuggestions } from '../../../../store/networkingSlide'

const SuggestionsNetwork = () => {

    const {suggestions, error, status} = useAppSelector((state) => state.networking)
    const {user} = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchSuggestions());
    }, [dispatch, user?.id]);


  return (
    <div className='bg-white rounded-md border-1 border-gray-200 flex flex-col gap-4'>
      <div>
        <h1 className='text-md font-bold text-gray-800 p-4'>
        People you may know
      </h1>
      <Divider/>
      </div>
      <div className='flex flex-col gap-4 px-4'>
       {
        suggestions.length > 0 ? suggestions.map((user) => <UserSuggestionCard key={user.id} user={user} />) : (
          <div className='text-gray-500 text-sm pb-4'>
            No suggestions available at the moment.
          </div>
       )}
      </div>
    </div>
  )
}

export default SuggestionsNetwork