import { Table, Space, Tag, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReevaluationService from '../../../services/reevaluationService';

const ReevaluationComponent = ({ data, onSelectedItem }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [reevalutaionData, setReevaluationData] = useState(data);
  const pageSize = 10;
  const navigate = useNavigate();

  //console.log("📦 Dữ liệu nhận được từ cha:", data);

  useEffect(() => {
    setReevaluationData(data); // cập nhật lại khi data từ cha thay đổi
  }, [data]);


  const handleBlockReevaluation = async (id, status) => {
    try{
      const {data, error} = await ReevaluationService.BlockReevaluation(id, status);
      if(error){
        toast.error(error);
      }
    }catch(e){
      console.log(e);
      toast.error("Có lỗi khi thực hiện thao tác. Vui lòng thử lại!");
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Người thực hiện",
      dataIndex: "studentName",
      key: "studentName",
    },
    {
      title: "Email",
      dataIndex: "studentEmail",
      key: "studentEmail",
    },
    {
      title: "Thời gian thực hiện",
      dataIndex: "reevaluation_TimestampRequest",
      key: "reevaluation_TimestampRequest",
      render: (value) =>
        value ? moment(value).format("DD/MM/YYYY HH:mm") : "N/A",
    },
    {
      title: "Cột điểm",
      dataIndex: "reevaluation_ScoreColumn",
      key: "reevaluation_ScoreColumn",
    },
    {
      title: "Điểm ban đầu",
      dataIndex: "reevaluation_PreScore",
      key: "reevaluation_PreScore",
    },
    {
      title: "Lý do",
      dataIndex: "reevaluation_Reason",
      key: "reevaluation_Reason",
    },
    {
      title: "Trạng thái",
      dataIndex: "reevaluation_Status",
      key: "reevaluation_Status",
      render: (status) => {
        const statusMap = {
          0: { text: "Chờ duyệt", color: "orange" },
          1: { text: "Đã duyệt", color: "blue" },
          2: { text: "Hoàn thành", color: "green" },
          3: { text: "Đã hủy", color: "red" },
          5: { text: "Đang chỉnh sửa", color: "yellow" },
          6: { text: "Đang bị chặn", color: "red" },
        };
        const item = statusMap[status] || { text: "Không rõ", color: "gray" };
        return <Tag color={item.color}>{item.text}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            danger
            onClick={(event) => {
              event.stopPropagation();
              handleBlockReevaluation(record.reevaluation_Id, record.reevaluation_Status);
            }}
          >
            {record.reevaluation_Status != 6 ? "Block" : "Unblock"}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      bordered
      dataSource={reevalutaionData}
      rowKey="reevaluation_Id"
      className="shadow-lg rounded-md mt-2"
      pagination={{
        pageSize,
        onChange: (page) => setCurrentPage(page),
      }}
      onRow={(record, index) => ({
        onClick: () => onSelectedItem(record.reevaluation_Id)
      })}
    />
  );
};

export default ReevaluationComponent;
