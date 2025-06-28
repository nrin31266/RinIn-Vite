import React from 'react';
import type { IPostDto } from '../../../../../../store/feedSlide';
import { DateUtils } from '../../../../../../utils/dateUtils';
import IconButton from '@mui/material/IconButton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

interface PostHeaderProps {
  post: IPostDto;
  onMoreClick?: () => void;
}

const PostHeader = ({ post, onMoreClick }: PostHeaderProps) => {
  return (
    <div className='grid grid-cols-[auto_1fr_auto] gap-2 items-center'>
      <img 
        src={post.author.profilePicture || '/avatar.jpg'} 
        alt="avatar" 
        className='w-10 h-10 rounded-full'
      />
      <div>
        <div className='font-bold text-gray-800'>
          {post.author.firstName + ' ' + post.author.lastName}
        </div>
        <div className='text-sm text-gray-500'>
          {DateUtils.timeAgo(new Date(post.creationDate))}
        </div>
      </div>
      <div className='text-sm text-gray-500'>
        <div className='flex items-center gap-2'>
          <IconButton onClick={onMoreClick}>
            <MoreHorizIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default PostHeader;
