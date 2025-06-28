import type { IPostDto } from '../../../../../../store/feedSlide';
import PostMediaGrid from '../../../PostMediaGrid/PostMediaGrid';

interface PostContentProps {
  post: IPostDto;
}

const PostContent = ({ post }: PostContentProps) => {
  return (
    <div>
      {post.postType === 'BACKGROUND' ? (
        <div className='mt-2 relative'>
          {post.postBg?.type === 'COLOR' ? (
            <div 
              className='aspect-[4/3] sm:aspect-[16/9] rounded-md' 
              style={{ backgroundColor: post.postBg.bgColor }} 
            />
          ) : post.postBg?.type === 'IMAGE_URL' ? (
            <img 
              src={post.postBg.bgImgUrl} 
              alt="background" 
              className='w-full h-full object-cover rounded-md' 
            />
          ) : null}
          <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center'>
            <div 
              className='text-lg font-bold wrap-anywhere text-center px-10 py-10' 
              style={{ color: post.postBg?.textColor }}
            >
              {post.content}
            </div>
          </div>
        </div>
      ) : (
        <div className='mt-2'>
          <div className='text-lg'>{post.content}</div>
          {post.postMedias.length > 0 && <PostMediaGrid postMedias={post.postMedias} />}
        </div>
      )}
    </div>
  );
};

export default PostContent;
