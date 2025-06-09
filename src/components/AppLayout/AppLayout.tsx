import React from 'react'
import { Outlet } from 'react-router-dom'
import HeaderComponent from '../HeaderComponent/HeaderComponent'

const AppLayout = () => {
  return (
    <div>
      <HeaderComponent/>
      <div>
        <Outlet/>
      </div>
    </div>
  )
}

export default AppLayout