import { useFormikContext, type FormikProps } from 'formik';
import { useEffect, useState } from 'react';
import type { IFormPostCreator } from '../PostCreatorModal';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { updateMedias } from '../../../store/postCreatorSlide';

interface FileSectionProps {
  files: File[];
  onRemove: (index: number) => void;
  
}

const FileSection = ({ files, onRemove }: FileSectionProps) => {
  const { postRq} = useAppSelector((state) => state.postCreator);
  const dispatch = useAppDispatch();
  if (!files.length) return null;

  // Thống kê số lượng ảnh, video, tổng dung lượng
  const stats = files.reduce(
    (acc, file) => {
      if (file.type.startsWith('image')) acc.images++;
      else if (file.type.startsWith('video')) acc.videos++;
      acc.size += file.size;
      return acc;
    },
    { images: 0, videos: 0, size: 0 }
  );

  const formatSize = (size: number) => {
    if (size > 1024 * 1024) return (size / (1024 * 1024)).toFixed(1) + ' MB';
    if (size > 1024) return (size / 1024).toFixed(1) + ' KB';
    return size + ' B';
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-1">
        {stats.videos > 0 && <span>{stats.videos} {stats.videos > 1 ? 'videos' : 'video'}</span>}
        {stats.images > 0 && <span>{stats.images} {stats.images > 1 ? 'images' : 'image'}</span>}
        <span>{formatSize(stats.size)}</span>
      </div>
      {files.map((file, idx) => {
        const url = URL.createObjectURL(file);
        return (
          <div key={idx} >
            <div className="relative w-full bg-black/10 overflow-hidden flex flex-col items-center justify-center" style={{ minHeight: 180 }}>
            {file.type.startsWith('image') ? (
              <img src={url} alt="media" className="w-full h-auto object-contain" />
            ) : file.type.startsWith('video') ? (
              <video src={url} controls className="w-full h-auto object-contain" />
            ) : null}
           
            <button
              type="button"
              className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 flex items-center justify-center shadow-md"
              style={{ width: 32, height: 32 }}
              onClick={() => onRemove(idx)}
              aria-label="Delete"
            >
              <span className="text-lg">&#10005;</span>
            </button>
            
          </div>
           <textarea rows={1} className={`overflow-hidden border-none mt-2 h-[50px] border-gray-500 w-full min-h-[50px] py-2.5  resize-none bg-transparent focus:outline-none px-2 
                 `}
                style={{
                  whiteSpace: "pre-wrap",
                }}
                onInput={(e => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = `${Math.max(target.scrollHeight, 50)}px`;
                })}
                value={postRq.postMedias?.[idx]?.content || ''}
                onChange={(e) => {
                  const newContent = e.target.value;

                  dispatch(updateMedias({ postMedias: postRq.postMedias.map((media, i) =>
                    i === idx ? { ...media, content: newContent } : media
                  ) || [] }));
                }}
                placeholder="Talk about your media..." />
          </div>
        );
      })}
    </div>
  );
};

export default FileSection;
