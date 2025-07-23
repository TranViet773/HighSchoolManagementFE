import React, { useState } from 'react';
import { Card, Table, Typography, Tooltip } from 'antd';
import { FileTextTwoTone  } from '@ant-design/icons';
import moment from 'moment';
import InfoAndScoreBoardOfStudent from './InfoAndScoreBoardOfStudent';  
const { Text } = Typography;

const ListStudentOfClassComponent = ({ students, year }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  console.log([year])
  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      render: (_, __, index) => index + 1,
      width: 60,
      align: 'center',
    },
    {
      title: 'Mã HS',
      dataIndex: 'code',
      key: 'code',
      width: 100,
    },
    {
      title: 'Tên HS',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      width: 80,
      render: (gender) => (gender ? 'Nữ' : 'Nam'),
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'doB',
      key: 'doB',
      width: 120,
      render: (dob) => dob ? moment(dob).format('DD/MM/YYYY') : '',
    },
    {
      title: 'Dân tộc',
      dataIndex: 'ethnicity',
      key: 'ethnicity',
      width: 100,
      render: () => '', // Chưa có dữ liệu
    },
    {
      title: 'Hồ sơ',
      dataIndex: 'file',
      key: 'file',
      width: 80,
      align: 'center',
      render: (_, record) => (
        <FileTextTwoTone
          style={{ fontSize: "18px", cursor: "pointer" }}
          onClick={() =>
            setSelectedStudent(record)
          }
        />
      ),
    },
    {
      title: 'Lần truy cập gần nhất',
      dataIndex: 'latestLogIn',
      key: 'latestLogIn',
      render: (value) =>
        value ? (
          <Text type="success">{moment(value).format('M/D/YYYY, h:mm:ss A')}</Text>
        ) : (
          <Text type="success">Chưa có dữ liệu</Text>
        ),
    },
  ];

  return (
    selectedStudent == null ? (
      <Card title="Danh sách học sinh">
        <Table
          dataSource={students}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          scroll={{ x: 'max-content' }}
        />
      </Card>
    ) : (
      <InfoAndScoreBoardOfStudent studentData={selectedStudent} year={[year]}/>
    )
    //Component thoong tin hojc sinh.
  );
};

export default ListStudentOfClassComponent;
