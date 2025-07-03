import React, { useEffect } from 'react'
import { editComment, type ICommentDto } from '../../../../../../store/feedSlide'
import type { IUser } from '../../../../../../store/authSlice'
import PostCommentAction from '../../../PostCommentAction/PostCommentAction'
import Divider from '@mui/material/Divider'
import { useAppDispatch, useAppSelector } from '../../../../../../store/store'

interface Props{
    comment: ICommentDto,
    auth: IUser
    onClose: ()=> void
}

const EditComment = ({auth, comment, onClose}: Props) => {
    const dispatch = useAppDispatch();
    const status = useAppSelector((state) => state.feed.status.editComment[comment.id]);
    useEffect(() => {
        // Focus the textarea when editing starts
        const textarea: HTMLTextAreaElement | null = document.querySelector(`[editing-comment-id="${comment.id}"] textarea`);
        if (textarea) {
          textarea.focus();
        }
    }, []);
    const handleEditComment =async (content: string) => {
        await dispatch(editComment({ commentId: comment.id, rq: { content, targetId: comment.id } }));
        onClose(); // Close the edit comment UI after editing
    }

  return (
    <div editing-comment-id={comment.id} className='relative'>
        
       <h1 className='text-gray-800 text-sm px-2 ml-10 font-semibold'>Editing Your Comment...</h1>
        <div className='absolute right-2 -top-1 z-1'><button
            onClick={onClose}
            className="px-1 text-[0.8rem] bg-red-200 text-black rounded hover:bg-red-300 cursor-pointer"
          >
            X
          </button></div>
        <PostCommentAction
          initialValue={comment.content}
          loading={status === "loading"}
          placeholder={`Edit comment as ${auth.firstName} ${auth.lastName}...`}
          onAction={(content) => {
            handleEditComment(content);
          }}
        />
    </div>
  )
}

export default EditComment