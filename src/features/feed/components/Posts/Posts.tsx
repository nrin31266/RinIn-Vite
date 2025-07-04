import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../store/store'
import { fetchPosts, type IPostDto } from '../../../../store/postsSlice';
import Post from '../Post/Post';
import PostDetailsModel from '../PostDetailsModel/PostDetailsModel';



const Posts = () => {
    const { posts, status, error, selectedPost } = useAppSelector((state) => state.posts)
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch, user?.id]);

  return (
    <div className='space-y-4 flex flex-col p-0'>
        {status.fetchPosts === 'loading' && <div>Loading...</div>}
        {status.fetchPosts === 'failed' && <div>Error: {error.fetchPosts}</div>}
        {status.fetchPosts === 'succeeded' && posts.map((post) => (
            <Post key={post.id} post={post} />
        ))}
        
    </div>
  )
}

export default Posts
