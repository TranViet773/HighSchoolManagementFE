import { Layout, Card, Descriptions, Button, Modal, Select, message, Avatar, Divider, Row, Col, Segmented, Steps } from "antd";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AuthService from "../../../services/authService";
import ClassService from "../../../services/classService";
import Sidebar from "../../../components/SideBarComponent/SidebarComponent";
import { toast } from "react-toastify";
import getCurrentYear from "../../../utils/year.util";
import ScoreBoardComponent from "./ScoreBoardComponent";
import AbsenceComponent from "./AbsenceComponent";
import ReevaluationComponent from "./ReevaluationComponent";

const { schoolYear, listYear, semester } = getCurrentYear();
const { Content } = Layout;
const { Option } = Select;
const { Step } = Steps;

const DetailStudentPage = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedTab, setSelectedTab] = useState("Hồ sơ cá nhân");
  const [listClassOfStudent, setListClassOfStudent] = useState([]);

  useEffect(() => {
    fetchStudent();
    fetchClasses();
  }, []);

  useEffect(() => {
    fetchClassesOfStudent();
  }, [selectedTab == "Quá trình học tập"]);

  const fetchStudent = async () => {
    try {
      const { data } = await AuthService.getById(id, schoolYear);
      setStudent(data);
      console.log(data);
    } catch (error) {
      message.error("Lỗi khi tải thông tin sinh viên!");
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const { data } = await ClassService.getAll(schoolYear);
      setClasses(data.data);
    } catch (error) {
      message.error("Lỗi khi tải danh sách lớp học!");
    }
  };

  const fetchClassesOfStudent = async () => {
    try {
      const { data } = await ClassService.getClassByStudent({id});
      setListClassOfStudent(data.data.classOfStudents);
      //console.log("data: ", data.data);
    }  catch (error) {
      message.error("Lỗi khi tải danh sách lớp học của sinh viên!");
    }
  };

  const handleAddClass = async () => {
    if (!selectedClass) {
      message.warning("Vui lòng chọn lớp trước!");
      return;
    }
    try {
      await ClassService.addStudentToClass(student.code, selectedClass, schoolYear);
      toast.success("Thêm lớp thành công!");
      setIsModalVisible(false);
      fetchStudent(); 
    } catch (error) {
      toast.error("Lỗi khi thêm lớp!");
    }
  };

  const handleChangeClass  = async () => {
    if (!selectedClass) {
      message.warning("Vui lòng chọn lớp trước!");
      return;
    }
    try {
      console.log("schoolYear: ", schoolYear);
      const {data} = await ClassService.changeStudentToClass(student.code, selectedClass, schoolYear);
      console.log("data: ", data);
      toast.success("Sửa lớp thành công!");
      setIsModalVisible(false);
      fetchStudent(); 
    } catch (error) {
      toast.error("Lỗi khi thêm lớp!");
    }
  };

  
  const steps = listClassOfStudent.map((item) => ({
    title: item.year,
    description: `Lớp ${item.className}`,
  }));

  const currentStepIndex = listClassOfStudent.findIndex(
    (cls) => cls.year === schoolYear
  );

  const listYearAthentic = steps.map((item) => item.title); // Truyền dô component ScoreBoardComponent
  //console.log("listYearAthentic: ", listYearAthentic);
  return (
    <Layout style={{ minHeight: "100vh"}}>
        <Sidebar />
        <Layout style={{ padding: "20px" }}>
          <Content>
            <Segmented 
              options={["Hồ sơ cá nhân", "Quá trình học tập", "Nghỉ học", "Khiếu nại"]}
              value={selectedTab}
              onChange={setSelectedTab}
            />
            <Divider />
            {selectedTab === "Hồ sơ cá nhân" && (
              <Card title="Thông tin cá nhân" loading={loading}>
                {student && (
                  <>
                    {/* Avatar + Thông tin cơ bản nằm ngang */}
                    <Row gutter={16} style={{ marginBottom: 24 }}>
                      <Col xs={24} sm={24} md={6} style={{ display: "flex", alignItems: "center" }}>
                        <Avatar src={student.avatar} size={100} style={{ marginRight: 16 }} />
                        <div>
                          <h3 style={{ margin: 0 }}>{student.fullName}</h3>
                          <p style={{ margin: 0 }}>Mã số: {student.code}</p>
                        </div>
                      </Col>

                      <Col xs={24} sm={24} md={18}>
                        <Descriptions title="Thông tin cơ bản" bordered column={2} size="small">
                          <Descriptions.Item label="Họ và tên">{student.fullName}</Descriptions.Item>
                          <Descriptions.Item label="Giới tính">{student.gender ? "Nam" : "Nữ"}</Descriptions.Item>
                          <Descriptions.Item label="Ngày sinh">{student.doB}</Descriptions.Item>
                          <Descriptions.Item label="Mã lớp">{student.classCode || "Chưa có lớp"}</Descriptions.Item>
                        </Descriptions>
                      </Col>
                    </Row>

                    <Divider />

                    <Descriptions title="Thông tin tài khoản" bordered column={2} size="small">
                      <Descriptions.Item label="Username">{student.username}</Descriptions.Item>
                      <Descriptions.Item label="Email">{student.email}</Descriptions.Item>
                      <Descriptions.Item label="Số điện thoại">{student.phoneNumber}</Descriptions.Item>
                      <Descriptions.Item label="Ngày tạo tài khoản">
                        {new Date(student.createAccountAt).toLocaleDateString()}
                      </Descriptions.Item>
                      <Descriptions.Item label="Lần đăng nhập gần nhất">
                        {student.latestLogIn ? new Date(student.latestLogIn).toLocaleString() : "Chưa đăng nhập"}
                      </Descriptions.Item>
                    </Descriptions>

                    <Divider />

                    <Descriptions title="Thông tin liên hệ & địa chỉ" bordered column={2} size="small">
                      <Descriptions.Item label="Địa chỉ chi tiết">{student.address?.address_Detail}</Descriptions.Item>
                      <Descriptions.Item label="Phường / Xã">{student.address?.ward_Name}</Descriptions.Item>
                      <Descriptions.Item label="Quận / Huyện">{student.address?.district_Name}</Descriptions.Item>
                      <Descriptions.Item label="Tỉnh / Thành phố">{student.address?.province_Name || "An Giang"}</Descriptions.Item>
                    </Descriptions>

                    <Divider />

                    <Descriptions title="Thông tin phụ huynh" bordered column={2} size="small">
                      <Descriptions.Item label="Họ tên cha">{student.student_Father_Name}</Descriptions.Item>
                      <Descriptions.Item label="Nghề nghiệp cha">{student.student_Father_Career}</Descriptions.Item>
                      <Descriptions.Item label="Họ tên mẹ">{student.student_Mother_Name}</Descriptions.Item>
                      <Descriptions.Item label="Nghề nghiệp mẹ">{student.student_Mother_Career}</Descriptions.Item>
                      <Descriptions.Item label="SĐT phụ huynh" span={2}>{student.student_Parent_Phone}</Descriptions.Item>
                    </Descriptions>

                    <Divider />

                    <Button type="primary" onClick={() => setIsModalVisible(true)}>
                      {student.classCode ? "Sửa lớp" : "Thêm lớp"}
                    </Button>
                  </>
                )}
              </Card>
            )}
            {selectedTab === "Quá trình học tập" && (
              <div>
                <Card title="Quá trình học tập" loading={loading}>
                  {/* Hiển thị quá trình học tập ở đây */}
                  <Steps current={currentStepIndex} size="small">
                    {steps.map((step, index) => (
                      <Step key={index} title={step.title} description={step.description} />
                    ))}
                  </Steps>

                </Card>
                <ScoreBoardComponent studentId={id} year={listYearAthentic || []}/>
              </div>
            )}
            {selectedTab === "Nghỉ học" && (
              <AbsenceComponent studentId={id} listYear={listYearAthentic}/>
            )}
            {selectedTab === "Khiếu nại" && (
              <ReevaluationComponent studentId={id} listYear={listYearAthentic}/>
            )}

            {/* Modal để thêm hoặc sửa lớp */}
            <Modal
              title="Chọn lớp"
              open={isModalVisible}
              onOk={student?.classCode ? handleChangeClass : handleAddClass}
              onCancel={() => setIsModalVisible(false)}
              okText={student?.classCode ? "Cập nhật" : "Thêm"}
              cancelText="Hủy"
            >
              <Select
                style={{ width: "100%" }}
                placeholder="Chọn lớp"
                onChange={(value) => setSelectedClass(value)}
              >
                {classes.map((item) => (
                  <Option key={item.id} value={item.classes_Id}>
                    {item.classes_Name}
                  </Option>
                ))}
              </Select>
            </Modal>
          </Content>
      </Layout>
    </Layout>
  );
};

export default DetailStudentPage;

