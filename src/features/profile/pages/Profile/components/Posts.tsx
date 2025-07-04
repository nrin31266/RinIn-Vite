import React, { useEffect } from "react";
import type { IUser } from "../../../../../store/authSlice";
import { useAppDispatch, useAppSelector } from "../../../../../store/store";

import Post from "../../../../feed/components/Post/Post";
import * as postsSlice from "../../../../../store/postsSlice";
interface Props {
  userId: number;
}
const Posts = ({ userId }: Props) => {
    const dispatch = useAppDispatch();
    

  const handleFetchPosts = async (userId: number) => {
    await dispatch(postsSlice.fetchPostsByUserId({userId}));
  };
  
  const {posts} = useAppSelector(state=> state.posts); // Changed from state.feed

  useEffect(() => {
    if (userId) {
      handleFetchPosts(userId);
    }
  }, [userId]);

  return <div className="space-y-4 w-full">

    {
        posts.map((post)=><Post post={post} key={post.id}/>)
    }
  </div>;
};

export default Posts;
