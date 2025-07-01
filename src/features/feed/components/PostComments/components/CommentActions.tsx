import React from 'react'

interface Props {
    openReply: () => void;
}

const CommentActions = ({ openReply }: Props) => {
  return (
    <div className='flex items-center gap-2'>
      <button onClick={openReply} className="text-blue-500 hover:underline text-xs cursor-pointer">Reply</button>
    </div>
  )
}

export default CommentActions