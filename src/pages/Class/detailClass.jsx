import {
  Layout, Table, Button, Space, Row, Col, Card, Typography,
  Modal, Input, Segmented
} from "antd";
import { EditTwoTone } from '@ant-design/icons';
import ModalTeacherSelect from "./ModalComponent/modalChangeAdvisor";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/SideBarComponent/SidebarComponent";
import { useEffect, useState } from "react";
import ClassService from "../../services/classService";
import { toast } from "react-toastify";
import AssignTeachingComponent from "./AssignTeachingComponent";
import UpdateStudentModal from "./ModalComponent/UpdateStudentModal";

const { Content } = Layout;
const { Title } = Typography;

const DetailClassPage = () => {
  const { id } = useParams();
  const [classDetail, setClassDetail] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentCode, setStudentCode] = useState("");
  const [visible, setVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Danh sách học sinh");

  // Modal chuyển lớp
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  

  useEffect(() => {
    fetchClassDetail();
  }, []);

  const fetchClassDetail = async () => {
    try {
      setLoading(true);
      const { data } = await ClassService.getClass(id);
      setClassDetail(data.data);
      setStudents(data.data.students);
    } catch (error) {
      toast.error("Không thể tải thông tin lớp!");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async () => {
    if (!studentCode.trim()) {
      toast.warning("Vui lòng nhập mã học sinh!");
      return;
    }
    try {
      await ClassService.addStudentToClass(studentCode, id, classDetail.year);
      toast.success("Thêm học sinh thành công!");
      setStudents([...students, { id: Math.random(), code: studentCode }]);
      setIsModalOpen(false);
      setStudentCode("");
    } catch (error) {
      toast.error("Thêm học sinh thất bại!");
    }
  };

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
      render: (_, __, index) => index + 1,
    },
    { title: "Mã HS", dataIndex: "code" },
    { title: "Tên HS", dataIndex: "fullName" },
    { title: "Email", dataIndex: "email" },
    {
      title: "Giới Tính",
      dataIndex: "gender",
      render: (g) => (g === "Male" ? "Nam" : "Nữ"),
    },
    { title: "Ngày Sinh", dataIndex: "dob" },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Button danger onClick={() => handleDeleteStudent(record.code)}>
          Xóa khỏi lớp
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
                <p>
                  Mã Lớp: {classDetail?.classes_Code} - Sĩ Số: {classDetail?.classes_Quantity}
                </p>
                <h3>Chủ nhiệm:</h3>
                <span>
                  {classDetail?.advisor}
                  <Button onClick={() => setVisible(true)} style={{ marginLeft: 8 }}>
                    <EditTwoTone />
                  </Button>
                </span>
              </Col>
              <Col>
                <Button type="primary" onClick={() => setIsModalOpen(true)}>
                  Thêm học sinh vào lớp
                </Button>
                <Button
                  style={{ marginLeft: "8px" }}
                  onClick={() => setIsUpdateModalOpen(true)}
                >
                  Cập nhật danh sách học sinh
                </Button>
              </Col>
            </Row>
          </Card>

          <Segmented
            options={["Danh sách học sinh", "Phân công giảng dạy"]}
            value={selectedTab}
            onChange={(e) => setSelectedTab(e)}
          />

          {selectedTab === "Danh sách học sinh" && (
            <Table
              columns={columns}
              dataSource={students}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
              style={{ marginTop: "20px" }}
              onRow={(record) => ({
                onClick: () => navigate(`/admin/student/${record.id}`),
              })}
            />
          )}

          {selectedTab === "Phân công giảng dạy" && (
            <AssignTeachingComponent
              classId={id}
              year={classDetail?.year}
              semester={0}
            />
          )}

          {/* Modal: Thêm học sinh */}
          <Modal
            title="Thêm học sinh vào lớp"
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            onOk={handleAddStudent}
            okText="Thêm"
            cancelText="Hủy"
          >
            <Input
              placeholder="Nhập mã học sinh..."
              value={studentCode}
              onChange={(e) => setStudentCode(e.target.value)}
            />
          </Modal>

          {/* Modal: Chọn giáo viên chủ nhiệm */}
          <ModalTeacherSelect
            visible={visible}
            onCancel={() => setVisible(false)}
            onSave={(teacherId) => {
              console.log('Teacher selected:', teacherId);
              setVisible(false);
            }}
            classData={classDetail}
          />

          {/* Modal: Cập nhật danh sách học sinh */}
          {classDetail && (
            <UpdateStudentModal
              open={isUpdateModalOpen}
              onClose={() => setIsUpdateModalOpen(false)}
              currentClass={classDetail}
              students={students}
              />
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DetailClassPage;
