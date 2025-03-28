import { Layout, Card, Descriptions, Button, Modal, Select, message } from "antd";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AuthService from "../../../services/authService";
import ClassService from "../../../services/classService";
import Sidebar from "../../../components/SideBarComponent/SidebarComponent";
import { toast } from "react-toastify";

const { Content } = Layout;
const { Option } = Select;
const curYear = new Date().getFullYear();
const schoolYear = `${curYear}-${curYear + 1}`;

const DetailStudentPage = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    fetchStudent();
    fetchClasses();
  }, []);

  const fetchStudent = async () => {
    try {
      const { data } = await AuthService.getById(id);
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

  const handleAddClass = async () => {
    if (!selectedClass) {
      message.warning("Vui lòng chọn lớp trước!");
      return;
    }
    try {
      await ClassService.addStudentToClass(student.code, selectedClass);
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
      await ClassService.changeStudentToClass(student.code, selectedClass);
      toast.success("Sửa lớp thành công!");
      setIsModalVisible(false);
      fetchStudent(); 
    } catch (error) {
      toast.error("Lỗi khi thêm lớp!");
    }
  };
  

  return (
    <Layout style={{ minHeight: "100vh"}}>
        <Sidebar />
        <Layout style={{ padding: "20px" }}>
      <Content>
        <Card title="Chi tiết Sinh Viên" loading={loading}>
          {student && (
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Họ và tên">{student.fullName}</Descriptions.Item>
              <Descriptions.Item label="Mã số">{student.code}</Descriptions.Item>
              <Descriptions.Item label="Email">{student.email}</Descriptions.Item>
              <Descriptions.Item label="Giới tính">{student.gender === "MALE" ? "Nam" : "Nữ"}</Descriptions.Item>
              <Descriptions.Item label="Ngày sinh">{student.doB}</Descriptions.Item>
              <Descriptions.Item label="Username">{student.username}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">{student.phoneNumber}</Descriptions.Item>
              <Descriptions.Item label="Mã lớp">{student.classCode}</Descriptions.Item>
            </Descriptions>
          )}
          {student && (
            <Button type="primary" onClick={() => setIsModalVisible(true)}>
                {student.classCode ? "Sửa lớp" : "Thêm lớp"}
            </Button>
            )}

        </Card>

        <Modal
          title="Chọn lớp"
          open={isModalVisible}
          onOk={student?.classCode ? handleChangeClass : handleAddClass}
          onCancel={() => setIsModalVisible(false)}
          okText="Thêm"
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
