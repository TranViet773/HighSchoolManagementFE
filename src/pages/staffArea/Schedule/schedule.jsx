import React, { useState, useEffect } from "react";
import { Layout, Select, Card, Row, Col } from "antd";
import Sidebar from "../../../components/SideBarComponent/SidebarStaff";
import { Link } from "react-router-dom";
import ClassService from "../../../services/classService";

const { Option } = Select;

// const classesData = {
//   10: ["10A1", "10A2", "10A3", "10A4"],
//   11: ["11A1", "11A2", "11A3", "11A4"],
//   12: ["12A1", "12A2", "12A3", "12A4"],
// };

const ScheduleHomePage = () => {
  const [selectedYear, setSelectedYear] = useState("2024-2025");
  const [selectedGrade, setSelectedGrade] = useState(10);
  const [classesData, setClassesData] = useState([]);

  useEffect(() => {
    fetchClassData();
  }, [selectedYear, selectedGrade]);

  const fetchClassData = async () =>{
    const response = await ClassService.getByGrade({grade: selectedGrade, year: selectedYear});
    console.log(response.data.data);
    setClassesData(response.data.data);
    
    };
  return (
    <Layout style={{minHeight: "100vh"}}>
      <Sidebar />

      {/* Nội dung chính */}
      <Layout className="p-6 w-full">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Thời khóa biểu</h1>

        {/* Bộ lọc năm học & khối lớp */}
        <div className="flex gap-4 mb-6">
          {/* Chọn năm học */}
          <Select
            value={selectedYear}
            onChange={(value) => setSelectedYear(value)}
            className="w-1/3"
          >
            <Option value="2023">Năm học 2023-2024</Option>
            <Option value="2024">Năm học 2024-2025</Option>
            <Option value="2025">Năm học 2025-2026</Option>
          </Select>

          {/* Chọn khối lớp */}
          <Select
            value={selectedGrade}
            onChange={(value) => setSelectedGrade(value)}
            className="w-1/3"
          >
            <Option value={10}>Khối 10</Option>
            <Option value={11}>Khối 11</Option>
            <Option value={12}>Khối 12</Option>
          </Select>
        </div>

        {/* Danh sách lớp theo khối lớp */}
        <Row gutter={[16, 16]}>
          {classesData.map((classItem, index) => (
            <Col key={index} span={6}>
              <Card className="shadow-lg rounded-xl border hover:shadow-2xl transition">
                <h2 className="text-lg font-medium text-gray-700 mb-2">{classItem.classes_Name}</h2>
                <p className="text-sm text-gray-500">Xem chi tiết thời khóa biểu</p>
                <Link
                  to={`/staff/schedule/${classItem.classes_Id}`}
                  className="mt-3 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Xem chi tiết
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </Layout>
    </Layout>
  );
};

export default ScheduleHomePage;
