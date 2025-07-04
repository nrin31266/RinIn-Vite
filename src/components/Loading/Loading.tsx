import React from 'react'

const Loading = () => {
  return (
    <div className='h-screen w-full flex flex-col items-center justify-center'>
        <img src="/logo.png" alt="loading" className='animate-bounce rounded-md w-20 h-20'/>
        <div className="mt-4 w-40 h-2 rounded-full bg-gray-200"><div className="w-12 h-2 rounded-full bg-[var(--primary-color)] animate-slide"></div></div>
        
    </div>
  )
}

export default Loading
