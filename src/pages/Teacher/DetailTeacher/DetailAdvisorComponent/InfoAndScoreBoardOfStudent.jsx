import React, { useEffect, useState } from 'react';
import AuthService from '../../../../services/authService';
import { Card, Row, Col, Typography, Avatar } from 'antd';
import ScoreBoardComponent from '../../../Student/DetailStudent/ScoreBoardComponent'
const { Text, Title } = Typography;

const InfoAndScoreBoardOfStudent = ({ studentData , year}) => {
  const [studentInfo, setStudentInfo] = useState(null);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const { data } = await AuthService.getById(studentData.id);
    //   console.log(data);
      setStudentInfo(data);
    } catch (e) {
      console.log("Có lỗi kho lấy dữ liệu học sinh:", e);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <Card title="Thông tin học sinh" style={{ marginBottom: 16 }}>
        {studentInfo && (
          <Row gutter={[16, 8]}>
            <Col span={4}>
              <Avatar
                shape="square"
                size={100}
                src={studentInfo.avatar}
                alt="avatar"
              />
            </Col>
            <Col span={20}>
              <Row gutter={[16, 8]}>
                <Col span={12}>
                  <Text strong>Họ và tên: </Text>
                  <Text>{studentInfo.fullName}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Giới tính: </Text>
                  <Text>{studentInfo.gender ? 'Nam' : 'Nữ'}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Ngày sinh: </Text>
                  <Text>{new Date(studentInfo.doB).toLocaleDateString()}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Email: </Text>
                  <Text>{studentInfo.email}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Tài khoản: </Text>
                  <Text>{studentInfo.username}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Mã học sinh: </Text>
                  <Text>{studentInfo.code}</Text>
                </Col>
                <Col span={24}>
                  <Text strong>Địa chỉ: </Text>
                  <Text>
                    {studentInfo.address?.address_Detail}, {studentInfo.address?.ward_Name}, {studentInfo.address?.district_Name}
                  </Text>
                </Col>
                <Col span={12}>
                  <Text strong>Họ tên cha: </Text>
                  <Text>{studentInfo.student_Father_Name}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Nghề nghiệp cha: </Text>
                  <Text>{studentInfo.student_Father_Career}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Họ tên mẹ: </Text>
                  <Text>{studentInfo.student_Mother_Name}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Nghề nghiệp mẹ: </Text>
                  <Text>{studentInfo.student_Mother_Career}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Liên hệ phụ huynh: </Text>
                  <Text>{studentInfo.student_Parent_Phone}</Text>
                </Col>
              </Row>
            </Col>
          </Row>
        )}
      </Card>

      <ScoreBoardComponent studentId={studentData.id} year={year}/>
    </div>
  );
};

export default InfoAndScoreBoardOfStudent;
