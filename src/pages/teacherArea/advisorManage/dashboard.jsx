import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {  FileTextTwoTone, DownloadOutlined } from "@ant-design/icons";
import { Layout, Table, Segmented, Card, Space, Input, Select, Row, Col, Radio, Button } from "antd";
import SidebarTeacher from "../../../components/SideBarComponent/SideBarTeacher";
import TeacherService from "../../../services/teacherService";
import getCurrentYear from "../../../utils/year.util";
import AbsenceReport from "./attendenceComponent";
import FolderCard from "./components/folderComponent";
import { toast } from "react-toastify";
import Title from "antd/es/typography/Title";
import ExportClassScoreExcel from "../../../components/ExportComponent/ExportExcelScoreBoardStudent";
import FinalResultComponent from "./components/finalResultComponent";
import ExportClassYearlyReportExcel from "../../../components/ExportComponent/ExportClassYearlyReportExcel";
const { schoolYear, listYear, semester } = getCurrentYear();
const { Content } = Layout;
const { Option } = Select;


const DashboardAdvisorPage = () => {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const year = queryParams.get('year');

  //console.log(year);
  const navigate = useNavigate();
  const { teacherId } = useParams();
  const [selectedTab, setSelectedTab] = useState("Quản lý học sinh");
  const [selectedSubTab, setSelectedSubTab] = useState("Chuyên cần");
  const [searchText, setSearchText] = useState("");
  const [selectedYear, setSelectedYear] = useState(year || schoolYear);
  const [classInfo, setClassInfo] = useState(null);
  const [studentData, setStudentData] = useState([]);
  const [listClassAdvisor, setListClassAdvisor] = useState([]); //Danh sach lop chu nhiem
  const [selectedSemester, setSelectedSemester] = useState(semester); // Này là để xuất file
  
  useEffect(() => {
    fetchClassInfo();
  }, [selectedYear, selectedSemester]);

  useEffect(() => {
    fetchListClassAndStudentByAdvisor();
  }, [selectedTab==="Hồ sơ chủ nhiệm"])
  //console.log(selectedYear)
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
          classId: classData.classes_Id
        });

        const students = classData.students.map((student, index) => ({
          key: student.id,
          stt: index + 1,
          maHS: student.code,
          tenHS: student.fullName,
          email: student.email,
          gioiTinh: student.gender ? "Nam" : "Nữ",
          truyCap: student.latestLogIn
        }));

        setStudentData(students);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu lớp:", error);
    }
  };

  const fetchListClassAndStudentByAdvisor = async () => {
    try{
      const {data, error} = await TeacherService.getListClassAndStudentByAdvisor({teacherId});
      console.log({data, error, teacherId})
      if(error)
        toast.error(error);
      setListClassAdvisor(data.data);
    }catch(e){
      toast.error("Có lỗi khi lấy dữ liệu chủ nhiêm. Vui lòng thử lại!");
    }
  }

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
          onClick={() =>
            navigate(
              `/teacher/advisor/student/${record.key}` + (year ? `?year=${year}` : "")
            )
          }
        />
      ),
    },
    {
      title: "Lần truy cập gần nhất",
      dataIndex: "truyCap",
      key: "truyCap",
      render: (text, record) => (
        <h3 style={{ color: "green" }}>
          {text ? new Date(text).toLocaleString() : 'Chưa có dữ liệu'}
        </h3>
      ),
    }
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <SidebarTeacher />
      <Layout style={{ padding: "20px", background: "#fff" }}>
        <Content>
          <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
            <Col>
              <Segmented options={["Quản lý chung", "Quản lý học sinh", "Hồ sơ chủ nhiệm"]} value={selectedTab} onChange={setSelectedTab} />
            </Col>
            <Col>
              <Select value={selectedYear} onChange={setSelectedYear} style={{ width: 150 }}>
                {/* {listYear.map(year => (
                  <Option key={year} value={year}>{year}</Option>
                ))} */}
                <Option key={2024-2025} value="2024-2025">2024-2025</Option>
                <Option key={2025-2026} value="2025-2026">2025-2026</Option>
              </Select>
            </Col>
          </Row>

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

          {selectedTab === "Quản lý chung" && (
            <div>
              <Segmented options={["Chuyên cần", "Kết quả học tập"]} value={selectedSubTab} onChange={setSelectedSubTab} style={{marginBottom: "1.5em"}}/>
              {selectedSubTab === "Chuyên cần" && (
                  <div>
                    <h2 className="text-lg font-semibold text-center text-gray-800">Biểu đồ thống kê số lượt vắng học</h2>
                    {classInfo && <AbsenceReport classId={classInfo?.classId} />}
                  </div>
                )
              }
              {selectedSubTab === "Kết quả học tập" && (
                  <div className="flex flex-col gap-4 mb-5">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                      <h2 className="text-lg font-semibold text-gray-800">Tổng kết điểm</h2>

                      <div className="flex flex-wrap items-center gap-2">
                        <Radio.Group
                          value={selectedSemester}
                          onChange={(e) => setSelectedSemester(e.target.value)}
                          size="small"
                        >
                          <Radio.Button value={1}>Học kỳ 1</Radio.Button>
                          <Radio.Button value={2}>Học kỳ 2</Radio.Button>
                        </Radio.Group>

                        <ExportClassScoreExcel
                          classData={classInfo}
                          year={selectedYear}
                          semester={selectedSemester}
                          fileName={`bang-diem-${classInfo.maLop}-${selectedYear}-${selectedSemester}.xlsx`}
                          
                        />
                        
                      </div>
                    </div>

                    <FinalResultComponent
                      classId={classInfo.classId}
                      year={selectedYear}
                      semester={selectedSemester}
                      classInfo={classInfo}
                    />

                  </div>

                )
              }
            </div>

          )}

          {selectedTab === "Quản lý học sinh" && (
            <div>
              <Input placeholder="Tìm kiếm học sinh..." value={searchText} onChange={(e) => setSearchText(e.target.value)} style={{ marginBottom: 10, width: 300 }} />
              <Table 
                columns={columns} 
                dataSource={filteredData} 
                bordered
                pagination={{ pageSize: 5 }} 
              />
            </div>
          )}

          {selectedTab === "Hồ sơ chủ nhiệm" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 gap-y-10">
                {listClassAdvisor.map((item) => (
                  <FolderCard
                    key={item.classes_Id}
                    className={item.classes_Name}
                    quantity={item.classes_Quantity}
                    year={item.year}
                    classId={item.classes_Id}
                    teacherId={teacherId}
                  />
                ))}
              </div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
  
};

export default DashboardAdvisorPage;
