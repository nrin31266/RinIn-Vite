import React, { useEffect } from 'react'

const usePageTitle = (title: string) => {
  useEffect(() => {
    document.title = "RinIn | " + title;
  }, []);
}

export default usePageTitle