import React from 'react';  
import Layout from 'antd/es/layout/layout';
import { Card } from 'antd';

const SchoolReport = () => {
  return (
    <Layout className="flex justify-center p-5 min-h-screen" style={{backgroundColor: "#E8F4FF"}}>
      <Layout style={{ padding: "20px", maxWidth: "100%", margin: "0 auto", backgroundColor: "#E8F4FF", marginBottom: "30vh" }}>
        <Card className="shadow-lg rounded-xl hover:shadow-xl p-4 bg-white">
            <h2>Chức năng chưa phát triển</h2>
        </Card>
        </Layout>
    </Layout>
  )
}

export default SchoolReport
