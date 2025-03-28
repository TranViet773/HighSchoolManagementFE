import React, { useEffect, useState } from "react";
import Sidebar from "../../components/SideBarComponent/SidebarComponent";
import { Layout, Button, Table, Space, message, Input, Row, Col, Modal, Form } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import SubjectService from "../../services/subjectService";
import { toast } from "react-toastify";
const { Content } = Layout;

const SubjectHomePage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]); // Dữ liệu bảng
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await SubjectService.getAll();
      setData(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách lớp học!");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
    await SubjectService.deleteSubject({id});
      toast.success("Xóa môn học thành công!");
      fetchData();
    } catch (error) {
      toast.error("Lỗi khi xóa môn học!");
    }
  };

  const handleFilterChange = (value) => {
    setSearchValue(value);
  };

  const filteredData = data.filter((item) =>
    item.subject_Name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleAddSubject = async () => {
    try {
      const values = await form.validateFields(); // Lấy giá trị từ form
      const { subjectName } = values;
  
      console.log(subjectName); // Kiểm tra giá trị
  
      const { data } = await SubjectService.createSubject({subject_Name: subjectName});
  
      console.log(data); // Xem phản hồi từ API
      message.success("Thêm mới môn học thành công!");
      
      fetchData(); // Cập nhật danh sách
      handleCloseModal(); // Đóng popup
    } catch (error) {
      console.error("Lỗi:", error);
      message.error("Lỗi khi thêm môn học!");
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Tên Môn Học",
      dataIndex: "subject_Name",
      key: "subject_Name",
    },
    {
      title: "Mã Môn học",
      dataIndex: "subject_Id",
      key: "subject_Id",
    },
    {
      title: "Tổ trưởng chuyên môn",
      dataIndex: "classes_Quantity",
      key: "classes_Quantity",
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button danger onClick={() => handleDelete(record.subject_Id)}>
            Block
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout style={{ padding: "20px" }}>
        <Content>
          <Row gutter={16} align="middle" style={{ marginBottom: "20px" }}>
            <Col>
              <Button type="primary" onClick={handleOpenModal}>
                Thêm mới môn học
              </Button>
            </Col>

            <Col flex="auto">
              <Input
                placeholder="Tìm kiếm lớp học"
                prefix={<SearchOutlined />}
                style={{ width: 200 }}
                onChange={(e) => handleFilterChange(e.target.value)}
                value={searchValue}
              />
            </Col>
          </Row>

          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="classes_Code"
            loading={loading}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              onChange: (page) => setCurrentPage(page),
            }}
            // onRow={(record) => ({
            //   onClick: () => navigate(`/admin/class/${record.classes_Id}`),
            // })}
          />
        </Content>
      </Layout>

      {/* Popup thêm mới */}
      <Modal
        title="Thêm mới môn học"
        open={isModalOpen}
        onCancel={handleCloseModal}
        onOk={handleAddSubject}
        okText="Thêm mới"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên môn học"
            name="subjectName"
            rules={[{ required: true, message: "Vui lòng nhập tên môn học!" }]}
          >
            <Input placeholder="Nhập tên môn học" />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default SubjectHomePage;