import React, { useState } from 'react';
import { Modal, Input, Button, Popconfirm, Descriptions, message } from 'antd';

const ReevaluationModal = ({ visible, setVisible, data, onSave }) => {
  const [afterScore, setAfterScore] = useState(data?.reevaluation_AfterScore || '');

  const handleSave = (status) => {
    // Gọi hàm lưu từ props hoặc xử lý ở đây
    if (!afterScore) {
      message.warning("Vui lòng nhập điểm mới.");
      return;
    }

    onSave({
      reevaluation_AfterScore: afterScore,
      reevaluation_TimestampEdit: new Date().toISOString(),
      reevaluation_Id: data.reevaluation_Id,
      year: data.reevaluation_Year,
      semester: data.reevaluation_Semester,
      status: status
    }); 

    setVisible(false);
  };

  return (
    <Modal
      title="Phiếu thông tin phúc khảo của học sinh"
      open={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      centered
    >
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="Mã học sinh">{data.studentCode}</Descriptions.Item>
        <Descriptions.Item label="Họ tên">{data.studentName}</Descriptions.Item>
        <Descriptions.Item label="Email học sinh">{data.studentEmail}</Descriptions.Item>
        <Descriptions.Item label="Môn học">{data.subjectName}</Descriptions.Item>
        <Descriptions.Item label="Cột điểm">{data.reevaluation_ScoreColumn}</Descriptions.Item>
        <Descriptions.Item label="Điểm trước phúc khảo">{data.reevaluation_PreScore}</Descriptions.Item>
        <Descriptions.Item label="Lý do phúc khảo">{data.reevaluation_Reason}</Descriptions.Item>
        <Descriptions.Item label="Năm học">{data.reevaluation_Year}</Descriptions.Item>
        <Descriptions.Item label="Học kỳ" >{data.reevaluation_Semester}</Descriptions.Item>
        <Descriptions.Item label="Ngày yêu cầu" >{new Date(data.reevaluation_TimestampRequest).toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label="Ngày xét duyệt" >{new Date(data.reevaluation_TimestampApprove).toLocaleString()}</Descriptions.Item>    
        { data.reevaluation_Status == 2 ? (
          <Descriptions.Item label="Ngày chỉnh sửa" >{new Date(data.reevaluation_TimestampEdit).toLocaleString()}</Descriptions.Item>  
        ) : (<></>)}      
        { data.reevaluation_Status == 2 ? (
          <Descriptions.Item label="Điểm sau khi chỉnh sửa" >{data.reevaluation_AfterScore}</Descriptions.Item>  
        ) : (<></>)}  
      </Descriptions>

      {
        data.reevaluation_Status == 1 || data.reevaluation_Status == 5  ? (
          <div style={{ marginTop: 20 }}>
            <label>Điểm mới sau phúc khảo:</label>
            <Input
              type="number"
              placeholder="Nhập điểm mới"
              value={afterScore}
              onChange={(e) => setAfterScore(e.target.value)}
              min={0}
              max={10}
              step={0.1}
            />
          </div>
        ): (<></>)
      }

      <div style={{ marginTop: 20, textAlign: 'right' }}>
        <Button onClick={() => setVisible(false)} style={{ marginRight: 8 }}>
          Hủy
        </Button>

        <Popconfirm
          title="Bạn có chắc chắn muốn lưu điểm phúc khảo?"
          onConfirm={() => handleSave(5)} // editting
          okText="Lưu"
          cancelText="Hủy"
        >
          <Button type="primary" disabled={(data.reevaluation_Status != 5)}>Lưu</Button>
        </Popconfirm>

        <Popconfirm
          title="Chắc chắn với kết quả điểm - Chức năng nhập điểm sẽ bị khóa?"
          onConfirm={() => handleSave(2)} //completed
          okText="Lưu"
          cancelText="Hủy"
          className='ml-2'
        >
          <Button type="dashed" disabled={!(data.reevaluation_Status == 5)}>Kết thúc</Button>
        </Popconfirm>
      </div>
    </Modal>
  );
};

export default ReevaluationModal;
