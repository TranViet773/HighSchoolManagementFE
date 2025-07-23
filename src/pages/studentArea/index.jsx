import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/SideBarComponent/SidebarComponent';
import { Card, Avatar, Typography, Button, Row, Col, Layout, Descriptions, Modal} from 'antd';
import { Link } from 'react-router-dom';
import InfomationStudentModal from './modalComponent/InfomationStudentModal';
import { 
  UserOutlined, 
  ScheduleOutlined, 
  SolutionOutlined, 
  FileProtectOutlined, 
  ReadOutlined, 
  HomeOutlined 
} from '@ant-design/icons';
import AuthService from '../../services/authService';
import { getInforJwt } from '../../tools/utils';
import { toast } from 'react-toastify';
import TeacherService from '../../services/teacherService';
import EditInformationStudentModal from './modalComponent/EditInformationStudentModal';
import getCurrentYear from '../../utils/year.util';
const { Title, Text } = Typography;

const { schoolYear, listYear, semester } = getCurrentYear();

// const guardianInfo = {
//     father: 'Trần Văn Năng',
//     mother: 'Lý Thị Mười',
//     address: '396, tổ 13, khu vực/ấp Ấp Hòa Lợi, Xã Phú Hiệp, Huyện Phú Tân, Tỉnh An Giang',
//     phone: '0343399498'
// };

// const advisorInfo = {
//     id: '002454',
//     name: 'Phạm Trương Hồng Ngân',
//     email: 'pthngan@abc.edu.vn',
//     phone: '0384.307.629'
// };

const functions = [
  { icon: <ScheduleOutlined />, text: 'Lịch học'},
  { icon: <SolutionOutlined />, text: 'Học bạ', link: "/student/school-report" },
  { icon: <ReadOutlined />, text: 'Kết quả học tập', link: '/student/score-board' },
  { icon: <HomeOutlined />, text: 'Thông báo môn học' },
  { icon: <FileProtectOutlined />, text: 'Yêu cầu xác nhận' }
];
const id = getInforJwt().Id;
const Dashboard = () => {
    const [isModalDetailVisible , setIsModalDetailVisible] = useState(false);
    const [isModalEditVisible , setIsModalEditVisible] = useState(false);
    const [studentInfo, setStudentInfo] = useState(null);
    const [advisorInfo, setAdvisorInfo] = useState(null);
    useEffect(() => {
        fetchStudentInfo();
    }, []);
    
    useEffect(() => {
        if (studentInfo?.classId) {
            fetchAdvisorInfo();
        }
    }, [studentInfo]); 

    const fetchStudentInfo = async () => {
        try{
            const {data} = await AuthService.getById(id);
            console.log(data);
            setStudentInfo(data);
        }catch(e){
            toast.error("Lỗi khi lấy dữ liệu! Vui lòng thử lại sau!");
            console.log(e);
        }
    }

    const fetchAdvisorInfo = async () => {
        try{
            console.log(studentInfo?.classId)
            if(studentInfo?.classId != null){
                //console.log(studentInfo.classId)
                const {data} = await TeacherService.getAdvisorByStudent({classId: studentInfo.classId, year: schoolYear, semester: "all"});
                //console.log(data);
                setAdvisorInfo(data.data);
            }
            
        }catch(e){
            toast.error("Lỗi khi lấy dữ liệu! Vui lòng thử lại sau!");
            console.log(e);
        }
    }

    const showModalDetail = () => {
        setIsModalDetailVisible(true);
      };
    
    const showModalEdit = () => {
        setIsModalEditVisible(true);
      };
    
      const handleCancel = () => {
        setIsModalDetailVisible(false);
        setIsModalEditVisible(false);
      };


  return (
    <Layout className="min-h-screen flex justify-center" style={{backgroundColor: "#E8F4FF", paddingBottom: "20vh"}}>
        <Layout style={{ padding: "20px", maxWidth: "70%", margin: "0 auto", backgroundColor: "#E8F4FF"}}>            
            <div className="container mx-auto">
                <Row gutter={[16, 16]}>
                    {/* Cột 1 */}
                    <Col sm={24} md={12}>
                        <Card className="shadow-lg rounded-xl hover:shadow-xl border border-black">
                            <Avatar 
                                size={64} 
                                src={studentInfo?.avatar} 
                                icon={!studentInfo?.avatar && <UserOutlined />} 
                                className="mb-3" 
                            />
                            <Title level={4}>{studentInfo?.fullName}</Title>
                            <Descriptions column={1} size="small">
                                <Descriptions.Item label="Mã SV"><span className="text-[#086DCB] font-bold">{studentInfo?.code}</span></Descriptions.Item>
                                <Descriptions.Item label="Ngày sinh"><span className="text-[#086DCB] font-bold">{studentInfo?.doB}</span></Descriptions.Item>
                                <Descriptions.Item label="Giới tính"><span className="text-[#086DCB] font-bold">{studentInfo?.gender ? "Name" : "Nữ"}</span></Descriptions.Item>
                                <Descriptions.Item label="Lớp"><span className="text-[#086DCB] font-bold">{studentInfo?.classCode}</span></Descriptions.Item>
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
                                <Descriptions.Item label="Ngày tạo tài khoản"><span className="text-[#086DCB] font-bold">{studentInfo?.createAccountAt}</span></Descriptions.Item>
                                <Descriptions.Item label="Số điện thoại"><span className="text-[#086DCB] font-bold">{studentInfo?.phoneNumber ? studentInfo.phoneNumber : "Chưa cập nhật"}</span></Descriptions.Item>
                                <Descriptions.Item label="Email"><span className="text-[#086DCB] font-bold">{studentInfo?.email}</span></Descriptions.Item>
                                <Descriptions.Item label="Địa chỉ"><span className="text-[#086DCB] font-bold">{studentInfo?.address ? studentInfo?.address?.address_Detail + ", " + studentInfo?.address?.ward_Name + ", " + 
                                                                                            studentInfo?.address?.district_Name + ", " + studentInfo?.address?.province_Name : ""}</span></Descriptions.Item>
                            </Descriptions>
                            <Row>
                                <Col>
                                    <div className="mt-4">
                                        <Button type="primary" variant="filled" onClick={showModalEdit}>Cập nhật thông tin</Button>
                                    </div>
                                </Col>
                                <Col>
                                    <div className="mt-4 ml-4">
                                        <Button type="primary" variant="filled" className="text-red-500 border-red-500" onClick={showModalDetail}>
                                            Xem chi tiết
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    
                    <Col sm={24} md={12}>
                        <Card className="shadow-lg rounded-xl hover:shadow-xl">
                            <Row gutter={[16, 16]}>
                                {functions.map((item, index) => (
                                    <Col key={index} sm={24} md={12}>
                                        <Link to={item.link}>
                                            <Card className="shadow-md text-center hover:shadow-2xl cursor-pointer transition duration-300 transform hover:scale-105" style={{backgroundColor: "#086DCB"}}>
                                                <div className="text-3xl text-white mb-2">{item.icon}</div>
                                                <Text style={{color: "white"}}>{item.text}</Text>
                                            </Card>
                                        </Link>
                                    </Col>
                                ))}
                            </Row>
                        </Card>
                    </Col>
                    
                </Row>

                <Row gutter={[16, 16]} className="mt-6">
                    {/* Cột 1 */}
                    <Col sm={24} md={12}>
                    <Card className="shadow-lg rounded-xl hover:shadow-xl border border-black">
                        <Title level={4}>Thông tin gia đình</Title>
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
                                <span className="text-[#086DCB] font-bold">{studentInfo?.student_Parent_Phone}</span>
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>


                    </Col>
                    
                    {/* Cột 2 */}
                    <Col sm={24} md={12}>
                    <Card className="shadow-lg rounded-xl hover:shadow-xl border border-black">
                        <Title level={4}>Cố vấn học tập</Title>
                        <Descriptions column={1} size="small">
                            <Descriptions.Item label="Mã số CB">
                                <span className="font-bold text-[#086DCB]">{advisorInfo?.code}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="Họ và tên">
                                <span className="font-bold text-[#086DCB]">{advisorInfo?.fullName}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="Email">
                                <span className="font-bold text-[#086DCB]">{advisorInfo?.email}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="Điện thoại">
                                <span className="font-bold text-[#086DCB]">{advisorInfo?.phoneNumber}</span>
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>

                    </Col>
                </Row>

                <Modal 
                    title="Thông Tin Chi Tiết" 
                    open={isModalDetailVisible} 
                    onCancel={handleCancel} 
                    footer={null}
                    width={700}
                >
                    <InfomationStudentModal studentInfo={studentInfo} advisorInfo={advisorInfo} />
                </Modal>

                <Modal 
                    title="Thông Tin Chi Tiết" 
                    open={isModalEditVisible} 
                    onCancel={handleCancel} 
                    footer={null}
                    width={700}
                >
                    <EditInformationStudentModal student={studentInfo}/>
                </Modal>

            </div>
        </Layout>
    </Layout>
  )
}

export default Dashboard;