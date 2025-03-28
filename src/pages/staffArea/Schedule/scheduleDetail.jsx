import React from 'react';
import Sidebar from '../../../components/SideBarComponent/SidebarStaff';
import { Layout } from 'antd';
import { Row, Col, Card } from 'antd';

const scheduleDetailPage = () => {
  const periods = Array.from({ length: 10 }, (_, i) => i + 1); // Số tiết từ 1 đến 10
  const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout style={{ padding: '20px' }}>
        <div className="flex flex-col space-y-4">
          <div className="grid grid-cols-8 gap-4">
            <div className="bg-gray-100 p-4 shadow-md rounded text-center">Tiết</div>
            {days.map((day, index) => (
              <div key={index} className="bg-gray-100 p-4 shadow-md rounded text-center">{day}</div>
            ))}
          </div>
          {periods.map((period) => (
            <div key={period} className="grid grid-cols-8 gap-4">
              <div className="bg-white p-4 shadow-md rounded text-center">{period}</div>
              {days.map((_, index) => (
                <div key={index} className="bg-white p-4 shadow-md rounded flex items-center justify-center">Nội dung</div>
              ))}
            </div>
          ))}
        </div>
      </Layout>
    </Layout>
  );
};

export default scheduleDetailPage;
