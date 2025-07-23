import { Layout, Card, Descriptions, Button, Modal, Select, message, Avatar, Divider, Row, Col, Tag, Segmented } from "antd";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AuthService from "../../services/authService";
import ClassService from "../../services/classService";
import Sidebar from "../../components/SideBarComponent/SidebarComponent";
import { toast } from "react-toastify";
import getCurrentYear from "../../utils/year.util";

const { schoolYear, listYear, semester } = getCurrentYear();
const { Content } = Layout;
const { Option } = Select;

const DetailStaffPage = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedTab, setSelectedTab] = useState("Hồ sơ cá nhân");
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
      toast.error("Lỗi khi thay đổi lớp!");
    }
  };

  // Render trạng thái
  const renderStatus = () => {
    if (student.isDeleted) {
      return <Tag color="red">Đã xóa</Tag>;
    }
    if (student.isBlocked) {
      return <Tag color="orange">Đã khóa</Tag>;
    }
    if (student.isActive) {
      return <Tag color="green">Đang hoạt động</Tag>;
    }
    return <Tag color="default">Không rõ</Tag>;
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout style={{ padding: "20px" }}>
        <Content>
            <Card title="Thông tin cá nhân" loading={loading}>
              {student && (
                <>
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
                        <Descriptions.Item label="Trạng thái">{renderStatus()}</Descriptions.Item>
                      </Descriptions>
                    </Col>
                  </Row>

                  <Divider />

                  <Descriptions title="Thông tin tài khoản" bordered column={2} size="small">
                    <Descriptions.Item label="Username">{student.username}</Descriptions.Item>
                    <Descriptions.Item label="Email">{student.email}</Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">{student.phoneNumber}</Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo tài khoản">
                      {new Date(student.createAccountAt).toLocaleString("vi-VN")}
                    </Descriptions.Item>
                    <Descriptions.Item label="Lần đăng nhập gần nhất">
                      {student.latestLogIn ? new Date(student.latestLogIn).toLocaleString("vi-VN") : "Chưa đăng nhập"}
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
                </>
              )}
            </Card>

        </Content>
      </Layout>
    </Layout>
  );
};

export default DetailStaffPage;
