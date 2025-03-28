import { Layout, Button, Table, Space, message, Input, Select, Row, Col } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../../../components/SideBarComponent/SidebarComponent";
import StudentService from "../../../services/studentService";
import ClassService from "../../../services/classService";
import { SearchOutlined } from "@ant-design/icons";
import AuthService from "../../../services/authService";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";

const { Content } = Layout;
const { Option } = Select;
const curYear = new Date().getFullYear();
const schoolYear = `${curYear}-${curYear + 1}`;
const optionSchoolYear = [
  `${curYear - 2}-${curYear - 1}`,
  `${curYear - 1}-${curYear}`,
  `${curYear}-${curYear + 1}`,
];

const role = "STUDENT";

const HomeStudentPage = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedYear, setSelectedYear] = useState(schoolYear); // Năm mặc định
  const [searchQuery, setSearchQuery] = useState(null);
  const [selectedCodeClass, setSelectedCodeClass] = useState(null);
  const navigate = useNavigate();
  const pageSize = 50;

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

  const handleBlockStudent = async (studentId) => {
    const {data} = await AuthService.deleteById(studentId);
    console.log(data.code);
    if (data.code == "200") {
      toast.success("Xóa thành công!");
      fetchStudents();
    } else {
      toast.error(`Lỗi khi xóa học sinh có ID ${studentId}: ${data.message}`);
    }
  };

 

  const columns = [
    { title: "STT", dataIndex: "index", key: "index", render: (_, __, index) => (currentPage - 1) * pageSize + index + 1 },
    { title: "Mã Lớp", dataIndex: "classCode", key: "classCode" },
    { title: "Mã HS", dataIndex: "code", key: "code" },
    { title: "Tên HS", key: "studentName", render: (record) => `${record.lastName || ""} ${record.firstName || ""}`.trim() },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Thao tác", key: "actions", render: (_, record) => (<Space><Button danger onClick={(event) => {event.stopPropagation(); handleBlockStudent(record.id); }}>Block</Button></Space>) },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout style={{ padding: "20px" }}>
        <Content>
          <Row gutter={16} align="middle" style={{ marginBottom: "20px" }}>
            <Col><Link to="/admin/create-student"><Button type="primary">Thêm mới học sinh</Button></Link></Col>
            <Col>
              <Select
                placeholder="Chọn lớp"
                style={{ width: 150 }}
                onChange={(value) => handleFilterChange(value, "codeClass")}
                value={selectedCodeClass}
              >
                {classes.map((item) => (
                  <Option key={item.id} value={item.classes_Code}>{item.classes_Name}</Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Select
                placeholder="Chọn năm học"
                style={{ width: 150 }}
                onChange={(value) => handleFilterChange(value, "year")}
                value={selectedYear}
              >
               {optionSchoolYear.map((year, index)=>{
                return <Option value = {year}>{year}</Option>
               })}
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
              onClick: () => {navigate(`/admin/student/${record.id}`)},
            })}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default HomeStudentPage;
