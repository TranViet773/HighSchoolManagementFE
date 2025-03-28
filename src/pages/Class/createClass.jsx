import { useState } from "react";
import { Layout, Card, Form, Input, Button, Select, Row, Col } from "antd";
import Sidebar from "../../components/SideBarComponent/SidebarComponent";
import ClassService from "../../services/classService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SelectAdvisorPopup from "../../components/OthersComponent/PopupTeacher";

const { Content } = Layout;
const { Option } = Select;

const CreateClassPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [advisor, setAdvisor] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // Xử lý tạo mới lớp học
  const onFinish = async (values) => {
    console.log("Giá trị form:", values); // Debug xem có chạy không

    const { className, academicYear, advisor } = values;
    
    try {
      console.log("className:", className, typeof className);
      const { data } = await ClassService.createClass(
        className,
        academicYear,
        advisor
      );

      if (data) {
        toast.success("Lớp học được tạo thành công!", { autoClose: 1000 });
        navigate("/admin/class");
      }
    } catch (error) {
      toast.error("Tạo lớp học thất bại!", { autoClose: 1000 });
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout style={{ padding: "20px" }}>
        <Content
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            background: "#f4f4f4",
          }}
        >
          <Card title="Tạo Mới Lớp Học" style={{ width: 600, marginTop: -100 }}>
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    label="Tên Lớp"
                    name="className"
                    rules={[{ required: true, message: "Vui lòng nhập tên lớp!" }]}
                  >
                    <Input placeholder="Nhập tên lớp" />
                  </Form.Item>
                </Col>
                
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Năm Học"
                    name="academicYear"
                    rules={[{ required: true, message: "Vui lòng nhập năm học!" }]}
                  >
                    <Input placeholder="2025" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Giảng Viên Cố Vấn"
                    name="advisor"
                    rules={[{ required: true, message: "Vui lòng nhập tên giảng viên cố vấn!" }]}
                  >
                    <Input
                      placeholder="Chọn giáo viên"
                      onClick={() => setShowPopup(true)}
                      value={advisor ? advisor.fullName : ""}
                      readOnly // Tránh nhập tay
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading}>
                  Tạo Lớp Học
                </Button>
              </Form.Item>
              {showPopup && (
              <SelectAdvisorPopup
                onSelect={(record) => {
                  setAdvisor(record); // Lưu toàn bộ object
                  form.setFieldsValue({ advisor: record.id }); // Cập nhật form
                }} 
                onClose={() => setShowPopup(false)}
              />)}
            </Form>
          </Card>
          
        </Content>
      </Layout>
    </Layout>
  );
};

export default CreateClassPage;
