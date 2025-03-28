import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {FileTextTwoTone} from "@ant-design/icons";
import { Layout, Table, Segmented, Card, Space, Input, Select, Row, Col } from "antd";
import SidebarTeacher from "../../../components/SideBarComponent/SideBarTeacher";
import TeacherService from "../../../services/teacherService";

const { Content } = Layout;
const { Option } = Select;
const curYear = new Date().getFullYear();
const schoolYear = `${curYear}-${curYear + 1}`;
const optionSchoolYear = [
  `${curYear - 2}-${curYear - 1}`,
  `${curYear - 1}-${curYear}`,
  `${curYear}-${curYear + 1}`,
];

const DashboardAdvisorPage = () => {
  const navigate = useNavigate();
  const { teacherId } = useParams();
  const [selectedTab, setSelectedTab] = useState("Quản lý học sinh");
  const [searchText, setSearchText] = useState("");
  const [selectedYear, setSelectedYear] = useState(schoolYear);
  const [classInfo, setClassInfo] = useState(null);
  const [studentData, setStudentData] = useState([]);

  useEffect(() => {
    fetchClassInfo();
  }, [selectedYear]);

  const fetchClassInfo = async () => {
    try {
      const response = await TeacherService.getClassAndStudentByAdvisor({ teacherId, year: selectedYear });
      if (response && response.data) {
        const classData = response.data.data;
        const yearSuffix = classData.classes_Code.slice(-2);
        const schoolYear = `20${yearSuffix} - 20${parseInt(yearSuffix) + 1}`;

        setClassInfo({
          maLop: classData.classes_Code,
          tenLop: classData.classes_Name,
          siSo: classData.students.length,
          namHoc: schoolYear,
        });

        const students = classData.students.map((student, index) => ({
          key: student.id,
          stt: index + 1,
          maHS: student.code,
          tenHS: student.fullName,
          email: student.email,
          gioiTinh: student.gender ? "Nam" : "Nữ",
        }));

        setStudentData(students);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu lớp:", error);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = [`${currentYear - 2}`, `${currentYear - 1}`, `${currentYear}`];

  const filteredData = studentData.filter(student =>
    student.tenHS.toLowerCase().includes(searchText.toLowerCase()) ||
    student.maHS.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { title: "STT", dataIndex: "stt", key: "stt" },
    { title: "Mã HS", dataIndex: "maHS", key: "maHS" },
    { title: "Tên HS", dataIndex: "tenHS", key: "tenHS" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Giới tính", dataIndex: "gioiTinh", key: "gioiTinh" },
    { title: "Ngày sinh", dataIndex: "ngaySinh", key: "ngaySinh" },
    { title: "Dân tộc", dataIndex: "danToc", key: "danToc" },
    {
      title: "Hồ sơ",
      dataIndex: "hoSo",
      key: "hoSo",
      render: (_, record) => (
        <FileTextTwoTone
          style={{ fontSize: "18px", cursor: "pointer" }}
          onClick={() => navigate(`/teacher/advisor/student/${record.key}`)} // Điều hướng theo mã HS
        />
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      key: "trangThai",
      render: (_, record) => (
        <h3 style={{color: "green"}}>Đang hoạt động</h3>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <SidebarTeacher />
      <Layout style={{ padding: "20px", background: "#fff" }}>
        <Content>
          <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
            <Col>
              <Segmented options={["Quản lý chung", "Quản lý học sinh"]} value={selectedTab} onChange={setSelectedTab} />
            </Col>
            <Col>
              <Select value={selectedYear} onChange={setSelectedYear} style={{ width: 150 }}>
                {optionSchoolYear.map(year => (
                  <Option key={year} value={year}>{year}</Option>
                ))}
              </Select>
            </Col>
          </Row>

          {/* Thông tin lớp học */}
          {classInfo && (
            <Card style={{ textAlign: "center", marginBottom: 20 }}>
              <Space size={30}>
                <div><strong>Mã lớp:</strong> {classInfo.maLop}</div>
                <div><strong>Tên lớp:</strong> {classInfo.tenLop}</div>
                <div><strong>Năm học:</strong> {classInfo.namHoc}</div>
                <div><strong>Sỉ số lớp:</strong> {classInfo.siSo}</div>
              </Space>
            </Card>
          )}

          {selectedTab === "Quản lý học sinh" && (
            <Input placeholder="Tìm kiếm học sinh..." value={searchText} onChange={(e) => setSearchText(e.target.value)} style={{ marginBottom: 10, width: 300 }} />
          )}

          {selectedTab === "Quản lý học sinh" && (
            <Table 
              columns={columns} 
              dataSource={filteredData} 
              bordered
              pagination={{ pageSize: 5 }} 
            />
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardAdvisorPage;
