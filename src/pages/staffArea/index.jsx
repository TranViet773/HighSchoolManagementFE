import React from 'react'
import { Layout } from 'antd'
import Sidebar from '../../components/SideBarComponent/SidebarStaff'
const HomeStaffPage = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
        <Sidebar />
        <Layout style={{ padding: "20px" }}>
            <h1>Nội dung nhân viên</h1>
        </Layout>    
    </Layout>
  )
}

export default HomeStaffPage
