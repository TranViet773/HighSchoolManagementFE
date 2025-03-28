import { Layout, Table, Button, Space, Row, Col, Card, Typography, Modal, Input } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/SideBarComponent/SidebarComponent";
import { useEffect, useState } from "react";
import ClassService from "../../services/classService"; // Giả định có service lấy dữ liệu
import { toast } from "react-toastify";

const { Content } = Layout;
const { Title } = Typography;

const DetailClassPage = () => {
  const { id } = useParams(); // Lấy id lớp học từ URL
  const [classDetail, setClassDetail] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentCode, setStudentCode] = useState("");

  useEffect(() => {
    fetchClassDetail();
  }, []);

  const fetchClassDetail = async () => {
    try {
      setLoading(true);
      const { data } = await ClassService.getClass(id); // API lấy thông tin lớp
      setClassDetail(data.data);
      setStudents(data.data.students);
    } catch (error) {
      toast.error("Không thể tải thông tin lớp!");
    } finally {
      setLoading(false);
    }
  };

  // Mở popup nhập mã học sinh
  const showAddStudentModal = () => {
    setIsModalOpen(true);
  };

  // Đóng popup
  const handleCancel = () => {
    setIsModalOpen(false);
    setStudentCode(""); // Xóa input sau khi đóng
  };

  // Xử lý thêm học sinh
  const handleAddStudent = async () => {
    if (!studentCode.trim()) {
      toast.warning("Vui lòng nhập mã học sinh!");
      return;
    }
    
    try {
      console.log(studentCode,id);
      await ClassService.addStudentToClass(studentCode, id);
      toast.success("Thêm học sinh thành công!");
      
      // Cập nhật danh sách học sinh
      setStudents([...students, { id: Math.random(), code: studentCode }]);
      
      handleCancel(); // Đóng modal sau khi thêm thành công
    } catch (error) {
      toast.error("Thêm học sinh thất bại!");
    }
  };

  // Xử lý xóa học sinh
  const handleDeleteStudent = async (studentCode) => {
    try {
      await ClassService.deleteStudentFromClass(studentCode, id);
      toast.success("Xóa học sinh thành công!");
      setStudents(students.filter((s) => s.code !== studentCode));
    } catch (error) {
      toast.error("Xóa học sinh thất bại!");
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Mã HS",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Tên HS",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Giới Tính",
      dataIndex: "gender",
      key: "gender",
      render: (gender) => (gender === "Male" ? "Nam" : "Nữ"),
    },
    {
      title: "Ngày Sinh",
      dataIndex: "dob",
      key: "dob",
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Button danger onClick={() => handleDeleteStudent(record.code)}>
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout style={{ padding: "20px" }}>
        <Content>
          <Card>
            <Row justify="space-between" align="middle">
              <Col>
                <Title level={4}>{classDetail?.classes_Name}</Title>
                <p>Mã Lớp: {classDetail?.classes_Code} - Sĩ Số: {classDetail?.classes_Quantity}</p>
                <h3>Chủ nhiệm: </h3><span>{classDetail?.advisor}</span>
              </Col>
              <Col>
                <Button type="primary" onClick={showAddStudentModal}>Thêm mới học sinh</Button>
              </Col>
            </Row>
          </Card>

          <Table
            columns={columns}
            dataSource={students}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
            style={{ marginTop: "20px" }}
            onRow={(record) => ({
              onClick: () => {navigate(`/admin/student/${record.id}`)},
            })}
          />

          {/* Modal nhập mã học sinh */}
          <Modal
            title="Thêm học sinh vào lớp"
            open={isModalOpen}
            onCancel={handleCancel}
            onOk={handleAddStudent} // Gọi API khi bấm OK
            okText="Thêm"
            cancelText="Hủy"
          >
            <Input
              placeholder="Nhập mã học sinh..."
              value={studentCode}
              onChange={(e) => setStudentCode(e.target.value)}
            />
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DetailClassPage;
