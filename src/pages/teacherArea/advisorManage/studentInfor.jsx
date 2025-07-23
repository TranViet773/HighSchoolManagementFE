import React, { useEffect, useState } from "react";
import { Layout, Card, Table, Typography, Select, Form, Input, Button, Upload, Row, Col, Segmented, DatePicker } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useParams, useLocation } from "react-router-dom";
import SidebarTeacher from "../../../components/SideBarComponent/SideBarTeacher";
import AddressComponent from "./components/addressComponent";
import ParentComponent from "./components/parentComponent";
import ScoreTable from "./components/acdemicResult";
import AuthService from "../../../services/authService";
import StudentManageService from "../../../services/teacher/studentService";
import ImportService from "../../../services/commonService";
import AttendanceService from "../../../services/attendanceService";
import getCurrentYear from "../../../utils/year.util";
import RadarChartComponent from "../../../components/ChartsComponent/RadarChartComponent";


const { schoolYear, listYear, semester } = getCurrentYear();
import { toast } from "react-toastify";
import dayjs from 'dayjs';
import ScoreService from "../../../services/scoreService";
const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const StudentInfor = () => {
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const year = queryParams.get('year');
  
  const [student, setStudent] = useState(null);
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Thông tin học sinh");
  const [avatarFile, setAvatarFile] =  useState(null);
  const [attendanceAll, setAttendanceAll] = useState([]);
  const [radarChartData, setRadarChartData] = useState([]);

  useEffect(() => {
    fetchStudent();
    fetchAttendanceDataAll();
    fetchStatisticalAvgScore();
  }, []);

  const fetchStudent = async () => {
      const {data} = await AuthService.getById(id, year || schoolYear);
      setStudent({
        id: id,
        avatar: data.avatar,
        fullName: data.fullName,
        studentCode: data.code,
        classCode: data.classCode,
        enrollmentYear: 2000 + Number(data.code.substring(2, 4)),
        gender: true ? "Nam" : "Nữ",
        birthDate: data.doB,
        email: data.email,
        phone: data.phoneNumber,
        ethnicity: "Kinh",
        mom_career: data.student_Mother_Career ? data.student_Mother_Career : "",
        mom_name: data.student_Mother_Name ? data.student_Mother_Name : "",
        dad_name: data.student_Father_Name ? data.student_Father_Name : "",
        dad_career: data.student_Father_Career ? data.student_Father_Career : "",
        parent_phone: data.student_Parent_Phone ? data.student_Parent_Phone : "",

        address: {
          province: data.address?.province_Name || "",
          district: data.address?.district_Name || "",
          ward: data.address?.ward_Name || "",
          detail: data.address?.address_Detail || "",
        },
      });
    }

  const updateStudent = async (values) =>{
    const {fullName, gender, email, phone, birthDate} = values;
    let avatar;
    if(avatarFile!=null){
      try{
        const {data} = await ImportService.UploadImage(avatarFile);
        console.log(data);
        avatar = data.secureUri;
      }catch{
        toast.error("Lỗi khi upload ảnh. Vui lòng thử lại!", 1000);
      }
    }

    try{
      console.log(birthDate);
      const dob = new Date(birthDate);
      console.log(dob);
      const {data} = await StudentManageService.UpdateStudent({
        id: id,
        FullName: fullName,
        Email: email,
        Gender: gender == "Nam" ? true : false,
        PhoneNumber: phone,
        Avatar: avatar,
        DoB: birthDate
      });
      toast.success("Cập nhật thông tin thành công!", 1000);
    }catch{
      toast.error("Lỗi khi cập nhật. Vui lòng thử lại!", 1000);
    }
  }

  const fetchAttendanceDataAll = async () => {
  try {
    const { data } = await AttendanceService.GetAttendanceByStudentId(
      id,
      schoolYear);
    console.log(data);
    // Map dữ liệu từ API về dạng sampleData
    const mappedData = data.map((item) => ({
      id: item.attendance_Id,
      code: item.attendance_StudentCode, // Thay thế bằng mã học sinh nếu có
      fullName: item.attendance_StudentName, // Cần sửa nếu API có trả về tên học sinh
      withPermission: item.isExcused ? 1 : 0,
      withoutPermission: item.isUnexcused ? 1 : 0,
      date: item.attendance_Timestamp.split("T")[0], // Lấy ngày
      teacher: item.attendance_Teacher,
      subject: item.attendance_SubjectName,
      note: item.attendance_Note || "",
    }));
    console.log(mappedData);
    setAttendanceAll(mappedData);
  } catch (error) {
    console.error("Error fetching attendance data for all:", error);
  }
}
  // Dữ liệu mẫu
  const fetchStatisticalAvgScore = async () => {
    try{
      const {data} = await ScoreService.StatisticalAvgSubject({studentId: id, year: year || schoolYear});
      //console.log(data.data);
      if(data.data.avgSubject_Final[0].averageScore != 0)
        setRadarChartData(data.data.avgSubject_Final);
      else if(data.data.avgSubject_Semester2[0].averageScore != 0)
               setRadarChartData(data.data.avgSubject_Semester2);
              else
                setRadarChartData(data.data.avgSubject_Semester1);
    }catch(e){
      console.log(e);
    }
  }

  const columnsScores = [
    { title: "Môn học", dataIndex: "subject", key: "subject" },
    { title: "Điểm", dataIndex: "score", key: "score" },
    { title: "Xếp loại", dataIndex: "grade", key: "grade" },
  ];

  const columnsAttendance = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Mã HS",
      dataIndex: "code",
      key: "code",
      render: (text) => <span className="text-blue-600 font-medium">{text}</span>,
    },
    {
      title: "Tên HS",
      dataIndex: "fullName",
      key: "fullName",
      render: (text) => <span className="text-blue-600">{text}</span>,
    },
    {
      title: "Vắng có phép",
      dataIndex: "withPermission",
      key: "withPermission",
      sorter: (a, b) => a.withPermission - b.withPermission,
    },
    {
      title: "Vắng không phép",
      dataIndex: "withoutPermission",
      key: "withoutPermission",
      sorter: (a, b) => a.withoutPermission - b.withoutPermission,
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      render: (text) => <span className="text-green-600">{text}</span>,
    },
    {
      title: "GV điểm danh",
      dataIndex: "teacher",
      key: "teacher",
    },
    {
      title: "Môn học",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
    },
  ];

  const sampleDiscipline = [
    { key: "1", date: "2024-02-10", violation: "Đi học muộn", punishment: "Nhắc nhở" },
    { key: "2", date: "2024-03-05", violation: "Không làm bài tập", punishment: "Hạ hạnh kiểm" },
  ];

  console.log(student)
  return (
    <Layout className="min-h-screen bg-gray-100">
      <SidebarTeacher />
      <Layout className="p-5">
        <Content>

          <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
              <Col>
                <Segmented options={["Thông tin học sinh", "Kết quả học tập"]} value={selectedTab} onChange={setSelectedTab} />
              </Col>
          </Row>

          {selectedTab === "Thông tin học sinh" &&(
            <>
              {/* Frame 1: Thông tin học sinh */}
              {student && (
                <Card
                  className="mt-2 mb-2 shadow-lg rounded-lg border-0"
                  title={
                    <div className="py-4 px-6 font-semibold text-lg text-gray-800 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                      <i className="fas fa-user-graduate mr-3"></i>
                      Thông tin học sinh
                    </div>
                  }
                  variant="borderless"
                  headStyle={{ 
                    backgroundColor: "transparent", 
                    border: "none",
                    padding: 0,
                    margin: 0
                  }}
                  bodyStyle={{ padding: 0 }}
                  style={{marginBottom: "20px"}}
                >
                  <div className="flex flex-col lg:flex-row bg-white min-h-[500px]">
                    {/* Left Side - Student Info */}
                    <div className="flex-1 lg:flex-[0.6] p-4 lg:p-6">
                      <div className="flex flex-col lg:flex-row gap-6 h-full">
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center justify-start lg:justify-start">
                          <div className="relative mb-4">
                            <img
                              src={student?.avatar ? student.avatar : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"}
                              alt="Avatar"
                              height={140}
                              width={140}
                              className="rounded-full border-4 border-blue-200 shadow-lg object-cover w-[120px] h-[120px] lg:w-[140px] lg:h-[140px]"
                            />
                          </div>
                          <Upload
                            showUploadList={false}
                            beforeUpload={(file) => {
                              setAvatarFile(file);
                            }}
                          >
                            <Button 
                              size="default"
                              className="border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 rounded-md font-medium" 
                              icon={<UploadOutlined />} 
                              disabled={!isEditing}
                            >
                              Tải ảnh lên
                            </Button>
                          </Upload>
                        </div>
                        
                        {/* Form Section */}
                        <div className="flex-1">
                          <Form form={form} layout="vertical" initialValues={student} onFinish={updateStudent}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 lg:gap-x-6 gap-y-4">
                              {/* Row 1 */}
                              <Form.Item 
                                label={<span className="text-sm font-semibold text-gray-700">Mã lớp</span>} 
                                name="classCode"
                                className="mb-0"
                              >
                                <Input 
                                  disabled={true} 
                                  size="large"
                                  className="bg-gray-50 border-gray-300 rounded-md"
                                />
                              </Form.Item>
                              
                              <Form.Item 
                                label={<span className="text-sm font-semibold text-gray-700">Mã số</span>} 
                                name="studentCode"
                                className="mb-0"
                              >
                                <Input 
                                  disabled={true} 
                                  size="large"
                                  className="bg-gray-50 border-gray-300 rounded-md"
                                />
                              </Form.Item>

                              <Form.Item 
                                label={<span className="text-sm font-semibold text-gray-700">Giới tính</span>} 
                                name="gender"
                                className="mb-0"
                              >
                                <Select 
                                  disabled={!isEditing}
                                  size="large"
                                  className="w-full"
                                  placeholder="Chọn giới tính"
                                >
                                  <Option value="Nam">Nam</Option>
                                  <Option value="Nữ">Nữ</Option>
                                </Select>
                              </Form.Item>

                              {/* Row 2 */}
                              <Form.Item 
                                label={<span className="text-sm font-semibold text-gray-700">Họ và tên đệm</span>} 
                                name="fullName"
                                className="mb-0 md:col-span-2 lg:col-span-2"
                              >
                                <Input 
                                  disabled={!isEditing} 
                                  size="large"
                                  className="border-gray-300 focus:border-blue-500 focus:shadow-sm rounded-md"
                                  placeholder="Nhập họ và tên đệm"
                                />
                              </Form.Item>

                              <Form.Item
                                label={<span className="text-sm font-semibold text-gray-700">Ngày sinh</span>}
                                name="birthDate"
                                className="mb-0"
                                getValueProps={(value) => ({
                                  value: value ? dayjs(value) : null,
                                })}
                                getValueFromEvent={(date) => (date ? dayjs(date).format("YYYY-MM-DD") : null)}
                              >
                                <DatePicker
                                  disabled={!isEditing}
                                  format="DD/MM/YYYY"
                                  size="large"
                                  className="w-full border-gray-300 focus:border-blue-500 rounded-md"
                                  placeholder="Chọn ngày sinh"
                                />
                              </Form.Item>

                              {/* Row 3 */}
                              <Form.Item 
                                label={<span className="text-sm font-semibold text-gray-700">Email</span>} 
                                name="email"
                                className="mb-0 md:col-span-2 lg:col-span-2"
                              >
                                <Input 
                                  disabled={!isEditing} 
                                  size="large"
                                  className="border-gray-300 focus:border-blue-500 focus:shadow-sm rounded-md"
                                  placeholder="Nhập địa chỉ email"
                                />
                              </Form.Item>

                              <Form.Item 
                                label={<span className="text-sm font-semibold text-gray-700">Dân tộc</span>} 
                                name="ethnicity"
                                className="mb-0"
                              >
                                <Input 
                                  disabled={!isEditing} 
                                  size="large"
                                  className="border-gray-300 focus:border-blue-500 focus:shadow-sm rounded-md"
                                  placeholder="Nhập dân tộc"
                                />
                              </Form.Item>

                              {/* Row 4 - Phone number takes 2 columns, button takes 1 */}
                              <Form.Item 
                                label={<span className="text-sm font-semibold text-gray-700">Số điện thoại</span>} 
                                name="phone"
                                className="mb-0 md:col-span-2 lg:col-span-2"
                              >
                                <Input 
                                  disabled={!isEditing} 
                                  size="large"
                                  className="border-gray-300 focus:border-blue-500 focus:shadow-sm rounded-md"
                                  placeholder="Nhập số điện thoại"
                                />
                              </Form.Item>
                              
                              <Form.Item 
                                label={<span className="text-sm font-semibold text-gray-700">Năm nhập học</span>}
                                name="enrollmentYear"
                                className="mb-0"
                              >
                                <Input 
                                  disabled={true} 
                                  size="large"
                                  className="border-gray-300 focus:border-blue-500 focus:shadow-sm rounded-md"
                                  //value={student.classCode?.match(/\d{4}/)?.[0] || ""}
                                />
                              </Form.Item>
                              {/* Action Buttons */}
                              <div className="flex items-end">
                                {isEditing ? (
                                  <div className="flex gap-2 w-full">
                                    <Button 
                                      type="primary" 
                                      size="large"
                                      onClick={() => form.submit()}
                                      className="bg-green-500 hover:bg-green-600 border-green-500 flex-1 font-medium rounded-md text-xs lg:text-sm"
                                      icon={<i className="fas fa-check"></i>}
                                    >
                                      <span className="hidden sm:inline">Lưu lại</span>
                                      <span className="sm:hidden">Lưu</span>
                                    </Button>
                                    <Button 
                                      size="large"
                                      onClick={() => setIsEditing(false)}
                                      className="border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 font-medium rounded-md text-xs lg:text-sm"
                                      icon={<i className="fas fa-times"></i>}
                                    >
                                      <span className="hidden sm:inline">Hủy bỏ</span>
                                      <span className="sm:hidden">Hủy</span>
                                    </Button>
                                  </div>
                                ) : (
                                  <Button 
                                    type="primary" 
                                    size="large"
                                    onClick={() => setIsEditing(true)} 
                                    disabled={isEditing || year}
                                    className="bg-blue-500 hover:bg-blue-600 border-blue-500 w-full font-medium rounded-md text-xs lg:text-sm"
                                    icon={<i className="fas fa-edit"></i>}
                                  >
                                    <span className="hidden sm:inline">Chỉnh sửa</span>
                                    <span className="sm:hidden">Chỉnh sửa</span>
                                  </Button>
                                )}
                              </div>
                            </div>
                          </Form>
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Chart */}
                    <div className="flex-1 lg:flex-[0.4] bg-gradient-to-br from-gray-50 to-gray-100 border-t lg:border-t-0 lg:border-l border-gray-200 p-4 lg:p-6 flex flex-col">
                      <div className="mb-4 lg:mb-6">
                        <h4 className="font-bold text-gray-800 text-base lg:text-lg flex items-center">
                          <i className="fas fa-chart-radar mr-2 lg:mr-3 text-blue-500 text-lg lg:text-xl"></i>
                          Biểu đồ năng lực
                        </h4>
                      </div>
                      <div className="flex-1 flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-200 p-3 lg:p-4 min-h-[250px] lg:min-h-[300px]">
                        <RadarChartComponent radarChartData={radarChartData}/>
                      </div>
                      
                      {/* Additional Stats */}
                      <div className="mt-3 lg:mt-4 grid grid-cols-2 gap-2 lg:gap-3">
                        <div className="bg-white p-2 lg:p-3 rounded-lg shadow-sm border border-gray-200 text-center">
                          <div className="text-xl lg:text-2xl font-bold text-blue-600">8.5</div>
                          <div className="text-xs text-gray-600">Điểm TB</div>
                        </div>
                        <div className="bg-white p-2 lg:p-3 rounded-lg shadow-sm border border-gray-200 text-center">
                          <div className="text-xl lg:text-2xl font-bold text-green-600">95%</div>
                          <div className="text-xs text-gray-600">Chuyên cần</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {student && student.address && <AddressComponent studentAddress={student.address} idUser={id} />}
              <ParentComponent data={student}/>

              {/* Frame 3: Kỷ luật */}
              <Card className="mt-2 mb-2 shadow-lg" title="Chuyên cần" variant="borderless" headStyle={{ backgroundColor: "#B5E7FF", color: "#333" }}>
                <Title level={4} className="text-red-600">
                  Lịch sử Kỷ Luật
                </Title>  
                <Table columns={columnsAttendance} dataSource={attendanceAll} pagination={false} />
              </Card>
            </>
          )}


          {selectedTab === "Kết quả học tập" && (
            <ScoreTable idStudent={id}/>
          )

          }
        </Content>
      </Layout>
    </Layout>
  );
};

export default StudentInfor;
