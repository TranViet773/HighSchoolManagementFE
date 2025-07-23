import { Card, Input, Segmented, Table } from 'antd';
import React, { isValidElement, useEffect, useState } from 'react';
import StudentService from '../../../services/studentService';
import ClassService from '../../../services/classService';
import SelectStudentUpgradeComponent from './SelectStudentUpgradeComponent';

const StudentsNotPassClassComponent = ({ year }) => {
  const [studentsData, setStudentData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedTab, setSelectedTab] = useState('Danh sách học sinh');
  const [listClassNextYear, setListClassNextYear] = useState([]);

  useEffect(() => {
    fetchStudentsNotPassClass();
  }, [year]);

  useEffect(() => {
    fetchClassesNextYear();
  }, selectedTab == "Phân bố lớp mới");

  const fetchStudentsNotPassClass = async () => {
    try {
      const { data } = await StudentService.GetStudentsNotPassClass({ year, grade: '10' });
      setStudentData(data);
      console.log(data)
    } catch (e) {
      console.log('Lỗi khi lấy danh sách học sinh ở lại lớp: ', e);
    }
  };

  const fetchClassesNextYear = async () => {
    const [start, end] = year.split('-').map(Number);
    const nextYear = `${start + 1}-${end + 1}`; 
    try {
        const { data } = await ClassService.getAll(nextYear);
        console.log("Dữ liệu lớp năm mới: ", data);
        setListClassNextYear(data.data);
    } catch (e) {
        console.log("Có lỗi khi lấy danh sách lớp năm kế tiếp: ", e);
    }
 };


  const filteredData = studentsData.filter((student) => {
    const keyword = searchText.toLowerCase();
    return (
      student.fullName?.toLowerCase().includes(keyword) ||
      student.code?.toLowerCase().includes(keyword) ||
      student.classCode?.toLowerCase().includes(keyword)
    );
  });

  const columns = [
    {
      title: 'STT',
      key: 'index',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Mã học sinh',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'doB',
      key: 'doB',
      render: (dob) => {
        if (!dob) return '';
        const date = new Date(dob);
        return date.toLocaleDateString('vi-VN');
      },
    },
    {
      title: 'Mã lớp',
      dataIndex: 'classCode',
      key: 'classCode',
    },
    {
      title: 'Mã lớp mới',
      dataIndex: 'newClassCode',
      key: 'newClassCode',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
  ];

  return (
    <Card title="Danh sách học sinh không đủ điều kiện lên lớp">
        <Segmented
          options={['Danh sách học sinh', 'Phân bố lớp mới']}
          value={selectedTab}
          onChange={(value) => setSelectedTab(value)}
        />

        

      {selectedTab === 'Danh sách học sinh' ? (
        <div>
            <Input
                placeholder="Tìm theo tên, mã học sinh hoặc mã lớp"
                allowClear
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ maxWidth: 200, marginBottom: 10, marginTop: 10 }}
            />
            <Table
            dataSource={filteredData}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 30 }}
            />  
        </div>
      ) : (
        <div className="text-center text-gray-500 p-6">
          {/* Hiển thị danh sách lớp mới ở đây dưới dạng*/}
          <SelectStudentUpgradeComponent listClassNextYear={listClassNextYear} studentNotPassed={studentsData} year={year}/>
        </div>
      )}
    </Card>
  );
};

export default StudentsNotPassClassComponent;
