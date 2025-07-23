import { Layout, Button, Table, Space, message, Input, Select, Row, Col } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../../components/SideBarComponent/SidebarComponent";
import StudentService from "../../services/studentService";
import ClassService from "../../services/classService";
import { SearchOutlined } from "@ant-design/icons";
import AuthService from "../../services/authService";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import getCurrentYear from "../../utils/year.util";

const { schoolYear, listYear, semester } = getCurrentYear();
const { Content } = Layout;
const { Option } = Select;
// const curYear = new Date().getFullYear();
// const schoolYear = `${curYear}-${curYear + 1}`;
// const optionSchoolYear = [
//   `${curYear - 2}-${curYear - 1}`,
//   `${curYear - 1}-${curYear}`,
//   `${curYear}-${curYear + 1}`,
// ];

const role = "MANAGERMENT_STAFF";

const StaffPage = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedYear, setSelectedYear] = useState(schoolYear); // Năm mặc định
  const [searchQuery, setSearchQuery] = useState(null);
  const [selectedCodeClass, setSelectedCodeClass] = useState(null);
  const navigate = useNavigate();
  const pageSize = 50;
  const [searchText, setSearchText] = useState("");


  useEffect(() => {
    fetchClasses(selectedYear);
    fetchStudents();
  }, []);

  useEffect(() => {
    fetchClasses(selectedYear);
  }, [selectedYear]);

  const fetchStudents = async (codeClass, year, query) => {
    setLoading(true);
    try {
      const { data } = await StudentService.FilterStudent(codeClass, year, query, role);
      setStudents(data);
      console.log(data);
    } catch (error) {
      message.error("Lỗi khi tải danh sách học sinh!");
    } finally {
      setLoading(false);
    }
  };
  
  const fetchClasses = async (year) => {
    try {
      const { data } = await ClassService.getAll(year);
      setClasses(data.data);
    } catch (error) {
      message.error("Lỗi khi tải danh sách lớp học!");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchText.trim() !== "") {
      handleFilterChange(searchText.trim(), "year");
    }
  };

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
      setSelectedCodeClass(null); // Reset mã lớp khi đổi năm
    } else if (type === "search") {
      newQuery = value;
      setSearchQuery(value);
    }
  
    fetchStudents(newCodeClass, newYear, newQuery);
  };

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

 

  const columns = [
    { title: "STT", dataIndex: "index", key: "index", render: (_, __, index) => (currentPage - 1) * pageSize + index + 1 },
    { title: "Mã NV", dataIndex: "code", key: "code" },
    { title: "Tên nhân viên", key: "studentName", render: (record) => `${record.lastName || ""} ${record.firstName || ""}`.trim() },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Thao tác", key: "actions", render: (_, record) => (<Space><Button danger onClick={(event) => {event.stopPropagation(); handleBlockStudent(record.id); }}>{record.isBlocked ? "Mở khóa" : "Khóa"}</Button></Space>) },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout style={{ padding: "20px" }}>
        <Content>
          <Row gutter={16} align="middle" style={{ marginBottom: "20px" }}>
            <Col><Link to="/admin/staff/create"><Button type="primary">Thêm mới nhân viên</Button></Link></Col>
            <Col>
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
          <Table
            columns={columns}
            dataSource={students}
            rowKey="studentId"
            loading={loading}
            pagination={{ pageSize: pageSize, onChange: (page) => setCurrentPage(page) }}
            onRow={(record) => ({
              onClick: () => {navigate(`/admin/staff/${record.id}`)},
            })}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default StaffPage;
