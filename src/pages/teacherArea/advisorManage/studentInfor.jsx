import React, { useEffect, useState } from "react";
import { Layout, Card, Table, Typography, Select, Form, Input, Button, Upload, Row, Col, Segmented, DatePicker } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import SidebarTeacher from "../../../components/SideBarComponent/SideBarTeacher";
import AddressComponent from "./components/addressComponent";
import ParentComponent from "./components/parentComponent";
import ScoreTable from "./components/acdemicResult";
import AuthService from "../../../services/authService";
import StudentManageService from "../../../services/teacher/studentService";
import ImportService from "../../../services/commonService";
import { toast } from "react-toastify";
import dayjs from 'dayjs';
const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const StudentInfor = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Thông tin học sinh");
  const [avatarFile, setAvatarFile] =  useState(null);
  useEffect(() => {
    fetchStudent();
  }, []);

  const fetchStudent = async () => {
      const {data} = await AuthService.getById(id);
      console.log(data);
      setStudent({
        id: id,
        avatar: data.avatar,
        fullName: data.fullName,
        studentCode: data.code,
        classCode: data.classCode,
        gender: true ? "Nam" : "Nữ",
        birthDate: data.doB,
        email: data.email,
        phone: data.phone,
        ethnicity: "Kinh",
        parent: {
          name: "Nguyễn Văn B",
          phone: "0912345678",
          job: "Kinh doanh",
        },
        address: {
          province: data.address?.province_Name || "",
          district: data.address?.district_Name || "",
          ward: data.address?.ward_Name || "",
          detail: data.address?.address_Detail || "",
        },
      });
    }

  const updateStudent = async (values) =>{
    const {fullName, gender, email, phone, doB} = values;
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
      console.log("flag1");
      const {data} = await StudentManageService.UpdateStudent({
        id: id,
        FullName: fullName,
        Email: email,
        Gender: gender == "Nam" ? true : false,
        Phone: phone,
        Avatar: avatar,
        DoB: doB
      });
      toast.success("Cập nhật thông tin thành công!", 1000);
    }catch{
      toast.error("Lỗi khi cập nhật. Vui lòng thử lại!", 1000);
    }
  }
  // Dữ liệu mẫu


  const columnsScores = [
    { title: "Môn học", dataIndex: "subject", key: "subject" },
    { title: "Điểm", dataIndex: "score", key: "score" },
    { title: "Xếp loại", dataIndex: "grade", key: "grade" },
  ];

  const columnsDiscipline = [
    { title: "Ngày", dataIndex: "date", key: "date" },
    { title: "Lỗi vi phạm", dataIndex: "violation", key: "violation" },
    { title: "Hình thức kỷ luật", dataIndex: "punishment", key: "punishment" },
  ];

  const sampleScores = [
    { key: "1", subject: "Toán", score: 9, grade: "Giỏi" },
    { key: "2", subject: "Văn", score: 8, grade: "Khá" },
    { key: "3", subject: "Anh", score: 7, grade: "Khá" },
  ];

  const sampleDiscipline = [
    { key: "1", date: "2024-02-10", violation: "Đi học muộn", punishment: "Nhắc nhở" },
    { key: "2", date: "2024-03-05", violation: "Không làm bài tập", punishment: "Hạ hạnh kiểm" },
  ];

  return (
    <Layout className="min-h-screen bg-gray-100">
      <SidebarTeacher />
      <Layout className="p-5">
        <Content>

          <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
              <Col>
                <Segmented options={["Thông tin học sinh", "Kết quả học tập"]} value={selectedTab} onChange={setSelectedTab} />
              </Col>
              <Col>
                
              </Col>
          </Row>

          {selectedTab === "Thông tin học sinh" &&(
            <>
              {/* Frame 1: Thông tin học sinh */}
              {student && (
                <Card
                className="mt-2 mb-2 shadow-lg rounded-lg"
                title={<div className="py-2 px-4 font-semibold">Thông tin học sinh</div>}
                variant="borderless"
                headStyle={{ backgroundColor: "#B5E7FF", color: "#333", borderRadius: "8px 8px 0 0" }}
              >
                <div className="p-6 bg-white rounded-lg w-full max-w-3xl mx-auto">
                  <div className="flex items-start gap-6">
                    <div className="flex flex-col items-center">
                      <img
                        src={student?.avatar ? student.avatar : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"}
                        alt="Avatar"
                        height={180}
                        width={180}
                        className="rounded-full border border-gray-300 shadow-sm"
                      />
                      <Upload
                        showUploadList={false}
                        beforeUpload={(file) => {
                          setAvatarFile(file);
                        }}
                      >
                        <Button className="mt-3" icon={<UploadOutlined />}>Tải ảnh lên</Button>
                      </Upload>
                    </div>
                    
                    {/* Form */}
                    <div className="w-full">
                      <Form form={form} layout="vertical" initialValues={student} onFinish={updateStudent}>
                        <div className="grid grid-cols-2 gap-4">
                          <Form.Item label="Mã lớp" name="classCode" className="flex items-center">
                            <Input disabled={true} />
                          </Form.Item>
                          <Form.Item label="Mã số" name="studentCode" className="flex items-center">
                            <Input disabled={true} />
                          </Form.Item>
              
                          <Form.Item label="Họ tên" name="fullName" className="flex items-center">
                            <Input disabled={!isEditing} />
                          </Form.Item>
                          <Form.Item label="Giới tính" name="gender" className="flex items-center">
                            <Select disabled={!isEditing}>
                              <Option value="Nam">Nam</Option>
                              <Option value="Nữ">Nữ</Option>
                            </Select>
                          </Form.Item>

              
                          <Form.Item
                            label="Ngày sinh"
                            name="birthDate"
                            className="flex items-center"
                            getValueProps={(value) => ({ value: value ? dayjs(value) : null })}
                          >
                            <DatePicker disabled={!isEditing} format="DD/MM/YYYY" className="w-full" />
                          </Form.Item>
                          <Form.Item label="Dân tộc" name="ethnicity" className="flex items-center">
                            <Input disabled={!isEditing} />
                          </Form.Item>
                          <Form.Item label="Email" name="email" className="flex items-center">
                            <Input disabled={!isEditing} />
                          </Form.Item>
                          <Form.Item label="phone" name="phone" className="flex items-center">
                            <Input disabled={!isEditing} />
                          </Form.Item>
                        </div>
              
                        <div className="flex gap-4 mt-4">
                          {isEditing ? (
                            <>
                              <Button type="primary" onClick={() => form.submit()}>Lưu</Button>
                              <Button onClick={() => setIsEditing(false)}>Hủy</Button>
                            </>
                          ) : (
                            <Button type="primary" onClick={() => setIsEditing(true)} disabled={isEditing}>Chỉnh sửa</Button>
                          )}
                        </div>
                      </Form>
                    </div>
                  </div>
                </div>
                </Card>
              )}

              {student && student.address && <AddressComponent studentAddress={student.address} idUser={id} />}
              <ParentComponent />

              {/* Frame 3: Kỷ luật */}
              <Card className="mt-2 mb-2 shadow-lg" title="Kỷ luật" variant="borderless" headStyle={{ backgroundColor: "#B5E7FF", color: "#333" }}>
                <Title level={4} className="text-red-600">
                  Lịch sử Kỷ Luật
                </Title>
                <Table columns={columnsDiscipline} dataSource={sampleDiscipline} pagination={false} />
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
