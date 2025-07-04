import React from 'react'
import type { IPostDto } from '../../../../../../store/postsSlice'

// Fake data
const fakeReactions = [
    { type: 'LIKE', count: 10 },
    { type: 'LOVE', count: 50 },
    { type: 'WOW', count: 25 },
    { type: 'HAHA', count: 11 },
    { type: 'SAD', count: 5 },
];

export const mapReactionIcon = (type: string) => {
    switch (type) {
        case 'LIKE':
            return '👍';
        case 'LOVE':
            return '❤️';
        case 'WOW':
            return '😮';
        case 'HAHA':
            return '😂';
        case 'SAD':
            return '😢';
        case 'ANGRY':
            return '😡';
        default:
            return '';
    }
}

const PostStatistical = ({ post }: { post: IPostDto }) => {

    const top3Reactions : { type : string, count: number }[] = Object.entries(post.reactCounts)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

//  const top3Reactions : { type : string, count: number }[] = fakeReactions.sort((a, b) => b.count - a.count).slice(0, 3);
  return (
    <div className='mt-2 w-full grid grid-cols-2 gap-4 text-gray-500 text-sm'>
      <div>{
        top3Reactions.length > 0 ? (
            <div className='flex items-center gap-2'>
                <div className='flex'>
                {top3Reactions.map((reaction, idx) => (
                    // Dịch chuyển sang trái nếu không phải là biểu tượng đầu tiên
                     <span key={idx} className={`${idx > 0 && '-ml-2.5'} text-lg`}>{mapReactionIcon(reaction.type)}</span>
                ))}
            </div>
            <span className='text-sm'>{top3Reactions.reduce((acc, curr) => acc + curr.count, 0)}</span>
            </div>
        ) : (
            <span>No reactions yet</span>
        )
      }</div>
        <div className='flex items-center gap-2 justify-end'>
            <span>Comments: {post.commentCount || 0}</span>
        </div>
    </div>
  )
}

export default PostStatistical
