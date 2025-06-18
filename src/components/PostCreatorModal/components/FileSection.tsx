import { useEffect, useState } from 'react';

interface FileSectionProps {
  files: File[];
  onRemove: (index: number) => void;
}

const FileSection = ({ files, onRemove }: FileSectionProps) => {
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
          <div key={idx} className="relative w-full bg-black/10 overflow-hidden flex items-center justify-center" style={{ minHeight: 180 }}>
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
        );
      })}
    </div>
  );
};

export default FileSection;
