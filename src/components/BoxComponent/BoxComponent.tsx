import React from 'react'

const BoxComponent = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div
        className={`md:bg-white p-2 md:rounded-lg md:shadow-[0_4px_12px_rgba(0,0,0,0.15)] md:p-6 md:w-[30rem] md:mx-auto ${className}`}
    >{children}</div>
  )
}

export default BoxComponent
