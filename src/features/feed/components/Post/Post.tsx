import React from 'react'
import type { IPostDto } from '../../../../store/postsSlice'
import PostActionsBottom from './components/PostActionsBottom/PostActionsBottom';
import PostStatistical from './components/PostStatistical/PostStatistical';
import PostHeader from './components/PostHeader/PostHeader';
import PostContent from './components/PostContent/PostContent';
const Post = ({ post }: { post: IPostDto }) => {
  return (
    <div className='p-2 rounded-md w-full shadow bg-white'>
      <PostHeader post={post} />
      <PostContent post={post} />
      <PostStatistical post={post} />
      <PostActionsBottom post={post} />
    </div>
  )
}

export default Post
