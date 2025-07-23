import React, { useState } from 'react';
import { Descriptions, Button, Card, Row, Col, Tag, Popconfirm  } from 'antd';
import { DoubleLeftOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import ReevaluationService from '../../../services/reevaluationService';



const DetailReevaluationComponent = ({ item, onBack }) => {

    const [reevaluationStatus, setReevaluationStatus] = useState(item.reevaluation_Status);
    const [reevaluationTimestampApprove, setReevaluationTimestampApprove] = useState(item.reevaluationTimestampApprove);

    const statusMap = {
        0: { text: "Chờ duyệt", color: "orange" },
        1: { text: "Đã duyệt", color: "blue" },
        2: { text: "Hoàn thành", color: "green" },
        3: { text: "Đã hủy", color: "red" },
    };
    const itemStatus = statusMap[reevaluationStatus] || { text: "Không rõ", color: "gray" };

    const handleUpdateStatus = async (status) => {
      try {
      const { data, message, error } = await ReevaluationService.UpdateStatus(status, item.reevaluation_Id);
      console.log(data);
      if (error) {
        toast.error("Có lỗi khi lấy dữ liệu. Vui lòng thử lại!");
      } else {
        setReevaluationStatus(data.data.reevaluation_Status); // nếu data là mảng kết quả
        setReevaluationTimestampApprove(data.data.reevaluation_TimestampApprove);
      }
    } catch (e) {
      console.log(e);
      toast.error("Lỗi hệ thống.");
    }
    }
  return (
    <Card
      title={
        <div className="flex items-center gap-2 text-blue-600 cursor-pointer" onClick={onBack}>
          <DoubleLeftOutlined />
          <span className="font-semibold">Quay lại danh sách</span>
        </div>
      }
      className="max-w-8xl mx-auto shadow-lg"
      style={{marginTop: "16px"}}
    >
      <Descriptions title="Thông tin học sinh" bordered column={2} size="middle">
        <Descriptions.Item label="Mã HS">{item.studentCode}</Descriptions.Item>
        <Descriptions.Item label="Tên HS">{item.studentName}</Descriptions.Item>
        <Descriptions.Item label="Email HS">{item.studentEmail}</Descriptions.Item>
        <Descriptions.Item label="Mã GV">{item.teacherCode}</Descriptions.Item>
        <Descriptions.Item label="Tên GV">{item.teacherName}</Descriptions.Item>
        <Descriptions.Item label="Email GV">{item.teacherEmail}</Descriptions.Item>
      </Descriptions>

      <Descriptions title="Thông tin phúc khảo" bordered column={2} size="middle" className="mt-6">
        <Descriptions.Item label="Môn học">{item.subjectName}</Descriptions.Item>
        <Descriptions.Item label="Cột điểm">{item.reevaluation_ScoreColumn}</Descriptions.Item>
        <Descriptions.Item label="Điểm trước">{item.reevaluation_PreScore}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
            <Tag color={itemStatus.color}>{itemStatus.text}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Lý do" span={2}>{item.reevaluation_Reason}</Descriptions.Item>
        <Descriptions.Item label="Học kỳ">{item.reevaluation_Semester}</Descriptions.Item>
        <Descriptions.Item label="Năm học">{item.reevaluation_Year}</Descriptions.Item>
        <Descriptions.Item label="Thời gian yêu cầu" span={2}>
          {new Date(item.reevaluation_TimestampRequest).toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label="Thời gian xác nhận" span={2}>
          {new Date(item.reevaluation_TimestampApprove).toLocaleString() || "Chưa cập nhật"}
        </Descriptions.Item>
        <Descriptions.Item label="Điểm sau">{item.reevaluation_AfterScore ?? 'Chưa cập nhật'}</Descriptions.Item>
        <Descriptions.Item label="Thời gian chỉnh sửa" span={1}>
          {new Date(item.ree).toLocaleString() || "Chưa cập nhật"}
        </Descriptions.Item>
      </Descriptions>

      {/* Nút hành động */}
      {item.reevaluation_Status == '0' && 
          <Row justify="end" className="mt-6 space-x-4">
    <Col>
      <Popconfirm
        title="Xác nhận từ chối"
        description="Bạn có chắc chắn muốn từ chối yêu cầu này không?"
        onConfirm={() => handleUpdateStatus("3")}
        okText="Từ chối"
        cancelText="Hủy"
      >
        <Button danger>Từ chối</Button>
      </Popconfirm>
    </Col>
    
    <Col>
      <Popconfirm
        title="Xác nhận phê duyệt"
        description="Bạn có chắc chắn muốn xác nhận yêu cầu này không?"
        onConfirm={() => handleUpdateStatus("1")}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <Button type="primary">Xác nhận</Button>
      </Popconfirm>
    </Col>
  </Row>
      }
    </Card>
  );
};

export default DetailReevaluationComponent;
