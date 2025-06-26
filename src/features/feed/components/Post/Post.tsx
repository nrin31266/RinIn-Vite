import React from 'react'
import type { IPostDto } from '../../../../store/feedSlide'
import { DateUtils } from '../../../../utils/dateUtils'
import IconButton from '@mui/material/IconButton'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PostMediaGrid from '../PostMediaGrid/PostMediaGrid';
import PostActionsBottom from './components/PostActionsBottom/PostActionsBottom';
const Post = ({ post }: { post: IPostDto }) => {
  return (
    <div className='p-2 rounded-md shadow bg-white'>
      <div className='grid grid-cols-[auto_1fr_auto] gap-2 items-center'>
        <img src={post.author.profilePicture || '/avatar.jpg'} alt="avt" className='w-10 h-10 rounded-full'/>
        <div>
            <div className='font-bold text-gray-800'>{post.author.firstName + ' ' + post.author.lastName}</div>
            <div className='text-sm text-gray-500'>{DateUtils.timeAgo(new Date(post.creationDate))}</div>
        </div>
        <div className='text-sm text-gray-500'>
          <div className='flex items-center gap-2'>
            <IconButton>
               <MoreHorizIcon />
            </IconButton>
          </div>
        </div>
      </div>
      <div>
        {post.postType === 'BACKGROUND' ? 
            <div className='mt-2 relative'>
              {
                post.postBg?.type === 'COLOR' ? <div className='aspect-[4/3] sm:aspect-[16/9] rounded-md' style={{ backgroundColor: post.postBg.bgColor }} /> : 
                post.postBg?.type === 'IMAGE_URL' ? <img src={post.postBg.bgImgUrl} alt="background" className='w-full h-full object-cover rounded-md' /> : null
              }
                <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center'>
                    <div className='text-lg font-bold wrap-anywhere text-center px-10 py-10' style={{color: post.postBg?.textColor}}>{post.content}</div>
                </div>
            </div> : 
            <div className='mt-2'>
              <div className='text-lg'>{post.content}</div>
              {post.postMedias.length > 0 && <PostMediaGrid postMedias={post.postMedias} />}
            </div>
        }
      </div>
      <PostActionsBottom post={post} />
    </div>
  )
}

export default Post