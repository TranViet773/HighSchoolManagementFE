import { Layout, Button, Table, Space, message, Input, Select, Row, Col } from "antd";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../../../components/SideBarComponent/SidebarComponent";
import StudentService from "../../../services/studentService";
import { SearchOutlined } from "@ant-design/icons";
import getCurrentYear from "../../../utils/year.util";
import AuthService from "../../../services/authService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const {schoolYear, listYear, semester} = getCurrentYear();
const { Content } = Layout;
const { Option } = Select;

const role = "TEACHER";

const HomeTeacherPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedYear, setSelectedYear] = useState(null); // Lưu giá trị năm học
  const [searchQuery, setSearchQuery] = useState(null); // Lưu giá trị tìm kiếm
  const [selectedCodeClass, setSelectedCodeClass] = useState(null); 
  const pageSize = 50; // Số học sinh mỗi trang
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  // Gọi API lấy danh sách học sinh
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async (codeClass, year, query) => {
    setLoading(true);
    try {
      const { data } = await StudentService.FilterStudent(codeClass, year, query, role);
      setStudents(data);
    } catch (error) {
      message.error("Lỗi khi tải danh sách học sinh!");
    } finally {
      setLoading(false);
    }
  };
  

  // Hàm Filter gọi API khi năm học hoặc từ khóa tìm kiếm thay đổi
  const handleFilterChange = (value, type) => {
    let newCodeClass = selectedCodeClass;
    let newYear = selectedYear;
    let newQuery = searchQuery;
  
    if (type === "codeClass") {
      newCodeClass = value;
      setSelectedCodeClass(value);
    } else if (type === "year") {
      newYear = value;
      setSelectedYear(value);
    } else if (type === "search") {
      newQuery = value;
      setSearchQuery(value);
    }
  
    fetchStudents(newCodeClass, newYear, newQuery);
  };
  

  // Hàm xử lý block
  const handleBlockStudent = async (studentId) => { // sửa lại thành chức năng vô hiệu hóa
    const {data} = await AuthService.BlockAndUnblock(studentId);
    console.log(data.code);
    if (data.code == "200") {
      toast.success("Cập nhật thành công!");
      fetchStudents();
    } else {
      toast.error(`Lỗi khi cập nhật trạng thái học sinh có ID ${studentId}: ${data.message}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchText.trim() !== "") {
      handleFilterChange(searchText.trim(), "year");
    }
  };
  
  // Cấu hình các cột của bảng
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1, // Tính STT theo trang
    },
    {
      title: "Mã Lớp",
      dataIndex: "classcode",
      key: "classcode",
    },
    {
      title: "Mã Cán bộ",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Tên Cán bộ",
      key: "studentName",
      render: (record) => `${record.lastName || ""} ${record.firstName || ""}`.trim(),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button danger onClick={() => handleBlockStudent(record.id)}>
           {record.isBlocked ? "Mở khóa" : "Khóa"}
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
              <Link to="/admin/create-teacher">
                <Button type="primary">Thêm mới giáo viên</Button>
              </Link>
            </Col>
            <Col>
              <Select
                showSearch
                placeholder="Chọn hoặc nhập năm học"
                style={{ width: 150 }}
                onSearch={(value) => setSearchText(value)}
                onChange={(value) => handleFilterChange(value, "year")}
                onKeyDown={handleKeyDown}
                value={selectedYear}
                allowClear
                filterOption={(input, option) =>
                  option?.children?.toLowerCase().includes(input.toLowerCase())
                }
              >
                {listYear.map((year) => (
                  <Option key={year} value={year}>
                    {year}
                  </Option>
                ))}
              </Select>
            </Col>

            {/* Ô tìm kiếm */}
            <Col flex="auto">
              <Input
                placeholder="Tìm kiếm"
                prefix={<SearchOutlined />}
                style={{ width: 200 }}
                onChange={(e) => handleFilterChange(e.target.value, "search")}
                value={searchQuery}
              />
            </Col>
          </Row>

          {/* Bảng danh sách học sinh với phân trang */}
          <Table
            columns={columns}
            dataSource={students}
            rowKey="studentId"
            loading={loading}
            pagination={{
              pageSize: pageSize,
              onChange: (page) => setCurrentPage(page),
            }} 
            onRow={(record) => ({
              onClick: () => {navigate(`/admin/teacher/${record.id}`)},
            })}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default HomeTeacherPage;
