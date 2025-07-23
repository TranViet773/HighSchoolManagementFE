import React from 'react';
import {Row, Col, Card, Descriptions, Typography, Avatar, Button } from 'antd';
import {PrinterOutlined, UserOutlined } from '@ant-design/icons';
const { Title } = Typography;
import { PDFDownloadLink } from '@react-pdf/renderer';
import PDFComponent from '../components/PDFComponent';

const InfomationStudentModal = ({studentInfo, guardianInfo, advisorInfo}) => {
  return (
    <Row gutter={[16, 16]}>
        <Col span={24}>
        <Card className="shadow-lg rounded-xl hover:shadow-xl border border-black">
        <Avatar 
            size={64} 
            src={studentInfo?.avatar} 
            icon={!studentInfo?.avatar && <UserOutlined />} 
            className="mb-3" 
        />
        <Title level={4}>{studentInfo?.fullName}</Title>
        <Descriptions column={1} size="small">
            <Descriptions.Item label="Mã SV">
                <span className="text-[#086DCB] font-bold">{studentInfo?.code}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày sinh">
                <span className="text-[#086DCB] font-bold">{studentInfo?.doB}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Giới tính">
                <span className="text-[#086DCB] font-bold">{studentInfo?.gender === 'Nam' ? 'Nam' : 'Nữ'}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Lớp">
                <span className="text-[#086DCB] font-bold">{studentInfo?.classCode}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Năm vào học">
              <span className="text-[#086DCB] font-bold">
                  {studentInfo?.code && studentInfo.code.length >= 4
                  ? Number("20" + studentInfo.code.substring(2, 4))
                  : "N/A"}
              </span>
              </Descriptions.Item>    
              <Descriptions.Item label="Năm dự kiến tốt nghiệp">
              <span className="text-[#086DCB] font-bold">
                  {studentInfo?.code && studentInfo.code.length >= 4
                  ? Number("20" + studentInfo.code.substring(2, 4)) + 3
                  : "N/A"}
              </span>
              </Descriptions.Item> 
            <Descriptions.Item label="Ngày tạo tài khoản">
                <span className="text-[#086DCB] font-bold">{studentInfo?.createAccountAt}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
                <span className="text-[#086DCB] font-bold">
                    {studentInfo?.phoneNumber ? studentInfo?.phoneNumber : "Chưa cập nhật"}
                </span>
            </Descriptions.Item>
            <Descriptions.Item label="Email">
                <span className="text-[#086DCB] font-bold">{studentInfo?.email}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">
                <span className="text-[#086DCB] font-bold">
                    {studentInfo?.address?.address_Detail 
                    + ", " + studentInfo?.address?.ward_Name 
                    + ", " + studentInfo?.address?.district_Name 
                    + ", " + studentInfo?.address?.province_Name}
                </span>
            </Descriptions.Item>
        </Descriptions>
        
    </Card>
        </Col>

        <Col span={24}>
        <Card>
            <Title level={4}>Thông Tin Gia Đình</Title>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Cha">
                  <span className="text-[#086DCB] font-bold">{studentInfo?.student_Father_Name}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Nghề nghiệp">
                  <span className="text-[#086DCB] font-bold">{studentInfo?.student_Father_Career}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Mẹ">
                  <span className="text-[#086DCB] font-bold">{studentInfo?.student_Mother_Name}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Nghề nghiệp">
                  <span className="text-[#086DCB] font-bold">{studentInfo?.student_Mother_Career}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                  <span className="text-[#086DCB] font-bold">{studentInfo?.Student_Parent_Phone}</span>
              </Descriptions.Item>
          </Descriptions>
        </Card>
        </Col>

        <Col span={24}>
        <Card>
            <Title level={4}>Cố Vấn Học Tập</Title>
            <Descriptions column={1} size="small">
            <Descriptions.Item label="Mã số CB">
              <span className="text-[#086DCB] font-bold">{advisorInfo?.code}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Họ và tên">
              <span className="text-[#086DCB] font-bold">{advisorInfo?.fullName}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              <span className="text-[#086DCB] font-bold">{advisorInfo?.email}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Điện thoại">
              <span className="text-[#086DCB] font-bold">{advisorInfo?.phoneNumber}</span>
            </Descriptions.Item>
          </Descriptions>

        </Card>
        </Col>
        <Col span={24} style={{ textAlign: "right" }}>
        <Button type="primary">
          <PDFDownloadLink
            document={<PDFComponent studentInfo={studentInfo} guardianInfo={guardianInfo} advisorInfo={advisorInfo} />}
            fileName="student_info.pdf"
          >
            {({ loading }) => (loading ? "Đang tạo PDF..." : <PrinterOutlined />)}
          </PDFDownloadLink>
        </Button>
        </Col>
    </Row>
  );
}

export default InfomationStudentModal;
