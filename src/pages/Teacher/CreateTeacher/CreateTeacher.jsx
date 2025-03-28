import { useState } from "react";
import { Layout, Card, Form, Input, Button, Select, DatePicker, Row, Col, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Sidebar from "../../../components/SideBarComponent/SidebarComponent";
import dayjs from "dayjs";
import StudentService from "../../../services/studentService";
import ImportService from "../../../services/commonService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;
const { Option } = Select;

const CreateTeacherPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Trạng thái tải lên file
  const [file, setFile] = useState(null);
  const eRole = 2;
  // Xử lý tạo mới học sinh
  const onFinish = async (values) => {
    const { lastName, firstName, email, gender, phone, doB } = values;
    
    let password = `y8Emnxbk`; 

    // Chuyển đổi doB thành chuỗi YYYY-MM-DD
    const formattedDoB = doB.format("YYYY-MM-DD");

    try {
      const { data } = await StudentService.CreateStudent({
        lastName, 
        firstName, 
        email, 
        password, 
        gender, 
        phone, 
        doB: formattedDoB, 
        eRole
      });

      if (data) {
        toast.success("Student created successfully", { autoClose: 1000 });
        navigate("/student");
      }
    } catch (error) {
      toast.error("Student creation failed!", { autoClose: 1000 });
    }
  };

  // Xử lý khi chọn file
  const handleFileChange = (info) => {
    setFile(info.file);
  };

  // Xử lý khi nhấn upload file Excel
  const handleUpload = async () => {
    if (!file) {
      toast.warning("Vui lòng chọn file Excel!", { autoClose: 1000 });
      return;
    }

    setLoading(true);
    try {
      const { data } = await ImportService.uploadExcel(file, eRole);
      toast.success(data.message || "Import thành công!", { autoClose: 1000 });
      setFile(null); // Reset file
      form.resetFields(); // Reset form
    } catch (error) {
      toast.error("Import file thất bại!", { autoClose: 1000 });
    }
    setLoading(false);
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
          <Card title="Thêm Mới Giáo Viên" style={{ width: 600, marginTop: -100 }}>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                gender: true,
                doB: dayjs("2025-02-15"),
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Họ"
                    name="lastName"
                    rules={[{ required: true, message: "Vui lòng nhập họ!" }]}
                  >
                    <Input placeholder="Nhập họ" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Tên"
                    name="firstName"
                    rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
                  >
                    <Input placeholder="Nhập tên" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, type: "email", message: "Email không hợp lệ!" }]}
                  >
                    <Input placeholder="Nhập email" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
                  >
                    <Input placeholder="Nhập số điện thoại" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Giới tính"
                    name="gender"
                    rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
                  >
                    <Select>
                      <Option value={true}>Nam</Option>
                      <Option value={false}>Nữ</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Ngày sinh"
                    name="doB"
                    rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <Button type="primary" htmlType="submit" block className="mb-2">
                  Tạo Học Sinh
                </Button>

                {/* Upload File Excel */}
                <Upload beforeUpload={() => false} onChange={handleFileChange}>
                  <Button icon={<UploadOutlined />} block>
                    Chọn File Excel
                  </Button>
                </Upload>

                <Button
                  type="default"
                  onClick={handleUpload}
                  className="mt-2 bg-green-500 text-white hover:bg-green-600"
                  block
                  loading={loading}
                >
                  Nhập từ file Excel
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default CreateTeacherPage;
