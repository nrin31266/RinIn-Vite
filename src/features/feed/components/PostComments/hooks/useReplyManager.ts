import { useState } from "react";

interface AuthorInfo {
  firstName: string | undefined;
  lastName: string | undefined;
  id: number;
}

/**
 * Custom hook quản lý state và logic cho reply forms
 * Tách riêng logic phức tạp khỏi component chính
 */
export const useReplyManager = (
  parentOpenReply?: Set<number>,
  parentSetOpenReply?: React.Dispatch<React.SetStateAction<Set<number>>>,
  parentReplyToInfo?: Map<number, AuthorInfo>,
  parentSetReplyToInfo?: React.Dispatch<React.SetStateAction<Map<number, AuthorInfo>>>
) => {
  // Local state cho component Comments ở tầng gốc (level 0)
  const [openReply, setOpenReply] = useState<Set<number>>(new Set());
  const [replyToInfo, setReplyToInfo] = useState<Map<number, AuthorInfo>>(new Map());

  // Sử dụng parent state nếu có (nested comments), nếu không thì dùng local state
  const currentOpenReply = parentOpenReply || openReply;
  const currentSetOpenReply = parentSetOpenReply || setOpenReply;
  const currentReplyToInfo = parentReplyToInfo || replyToInfo;
  const currentSetReplyToInfo = parentSetReplyToInfo || setReplyToInfo;

  // Mở form reply với auto scroll và focus
  const openReplyForm = (uniqueReplyKey: number, authorInfo: AuthorInfo) => {
    if (currentOpenReply.has(uniqueReplyKey)) {
      // TH1: Form đã mở rồi -> chỉ cập nhật thông tin người được reply
      currentSetReplyToInfo(prev => {
        const newMap = new Map(prev);
        newMap.set(uniqueReplyKey, authorInfo);
        return newMap;
      });
      
      // Focus lại textarea khi switch reply target
      setTimeout(() => {
        const replyFormElement = document.querySelector(`[data-reply-key="${uniqueReplyKey}"]`);
        if (replyFormElement) {
          const textarea = replyFormElement.querySelector('textarea');
          if (textarea) {
            textarea.focus();
          }
        }
      }, 50);
    } else {
      // TH2: Form chưa mở -> mở form và set thông tin người được reply
      currentSetOpenReply((prev) => new Set(prev).add(uniqueReplyKey));
      currentSetReplyToInfo(prev => {
        const newMap = new Map(prev);
        newMap.set(uniqueReplyKey, authorInfo);
        return newMap;
      });
      
      // Auto scroll to reply form sau khi state update
      setTimeout(() => {
        const replyFormElement = document.querySelector(`[data-reply-key="${uniqueReplyKey}"]`);
        if (replyFormElement) {
          replyFormElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
          
          // Auto focus vào textarea sau khi scroll
          setTimeout(() => {
            const textarea = replyFormElement.querySelector('textarea');
            if (textarea) {
              textarea.focus();
            }
          }, 200);
        }
      }, 100);
    }
  };

  // Đóng form reply
  const closeReplyForm = (uniqueReplyKey: number) => {
    currentSetOpenReply(prev => {
      const newSet = new Set(prev);
      newSet.delete(uniqueReplyKey);
      return newSet;
    });
    
    currentSetReplyToInfo(prev => {
      const newMap = new Map(prev);
      newMap.delete(uniqueReplyKey);
      return newMap;
    });
  };

  // Lấy tên người được reply từ Map, fallback về tên gốc
  const getReplyToName = (uniqueReplyKey: number, fallbackName: string) => {
    const replyInfo = currentReplyToInfo.get(uniqueReplyKey);
    return replyInfo
      ? `${replyInfo.firstName || ''} ${replyInfo.lastName || ''}`
      : fallbackName;
  };

  // Lấy ID người được reply từ Map, fallback về ID gốc
  const getReplyToId = (uniqueReplyKey: number, fallbackId: number) => {
    const replyInfo = currentReplyToInfo.get(uniqueReplyKey);
    return replyInfo ? replyInfo.id : fallbackId;
  };

  return {
    currentOpenReply,
    currentSetOpenReply,
    currentReplyToInfo,
    currentSetReplyToInfo,
    openReplyForm,
    closeReplyForm,
    getReplyToName,
    getReplyToId
  };
};
