import React from 'react'
import { setUser, type IUser } from '../../../store/authSlice'
import { useAppDispatch, useAppSelector } from '../../../store/store'
import Button from '@mui/material/Button'
import { updateProfileAbout } from '../../../store/profileSlide'
interface Props {
  showUser: IUser
}
const AboutComponent = ({ showUser }: Props) => {
  const authenticatedUser = useAppSelector(state => state.auth.user)
  const [isEditing, setIsEditing] = React.useState(false);
  const editAboutRef = React.useRef<HTMLTextAreaElement>(null);
  const [about, setAbout] = React.useState<string>("");
  const updateAboutStatus = useAppSelector(state => state.profile.status.updateProfileAbout);
  const updateAboutError = useAppSelector(state => state.profile.error.updateProfileAbout);
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    if (isEditing && editAboutRef.current) {
      setAbout(showUser.about || ""); // Set the initial value to the user's about section
      editAboutRef.current.focus();
    }
  }, [isEditing]);

  const handleUpdateAbout = async () => {
    // Dispatch the updateProfileAbout action with the new about text
    await dispatch(updateProfileAbout({ about })).unwrap()
      .then((data) => {
        if(data.id === authenticatedUser?.id){
          dispatch(setUser(data));
        }
        setIsEditing(false);
      })
      .catch((error) => {
        console.error("Failed to update about section:", error);
      });
    
  };

  return (
    <>
      <div className='w-full h-max p-4 bg-white shadow rounded-md'>
        <h2 className='text-xl font-semibold text-gray-800 mb-2'>About</h2>
       { authenticatedUser?.id === showUser.id && isEditing ? <div>
        <textarea
          className='w-full p-2 border-2 rounded-md  bg-gray-200 focus:outline-none focus:border-[var(--primary-color)]'
          value={about}
          ref={editAboutRef}
          maxLength={100}
          placeholder='Write something about yourself...'
          onChange={(e) => {
            // Handle the change to update the about section
            setAbout(e.target.value);
          }}
        />
        <p className='text-gray-500 text-end text-sm'>Characters: {about.length}/100</p>
       <div className='flex justify-end mt-2 gap-2'>
          <Button disabled={updateAboutStatus === 'loading'} variant='outlined' onClick={() => setIsEditing(false)} className=''>Cancel</Button>
          <Button loading={updateAboutStatus === 'loading'} variant='contained' onClick={handleUpdateAbout} className=''>Save</Button>
       </div>

       </div>: <>
        <p className='text-gray-600 text-center'>{showUser.about || "Not provided"}</p>
        {authenticatedUser?.id === showUser.id && <button onClick={() => setIsEditing(true)} className='mt-2 bg-gray-200 px-2 py-1 
        rounded-md w-full font-semibold text-gray-800 hover:bg-gray-300 cursor-pointer'>Edit About</button>}</>}
      </div>
    </>
  )
}

export default AboutComponent
