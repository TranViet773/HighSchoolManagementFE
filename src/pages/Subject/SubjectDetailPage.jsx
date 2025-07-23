import React, { useEffect, useState } from 'react';
import { Layout, Select, Table, Card, Empty, Button } from 'antd';
import Sidebar from '../../components/SideBarComponent/SidebarComponent';
import SubjectService from '../../services/subjectService';
import { useParams } from 'react-router-dom';

const { Content } = Layout;
const { Option } = Select;

const SubjectDetailPage = () => {
  const { id } = useParams();
  const [selectedGrade, setSelectedGrade] = useState('10');
  const [selectedYear, setSelectedYear] = useState();
  const [searchText, setSearchText] = useState('');
  const [listYear] = useState(["2024-2025", "2023-2024", "2022-2023"]);
  const [teachingData, setTeachingData] = useState([]);
  const [subjectInfo, setSubjectInfo] = useState({ name: '---', code: id });

  useEffect(() => {
    if (selectedYear) {
      fetchTeachingBySubjectData();
    }
  }, [selectedGrade, selectedYear]);

  const fetchTeachingBySubjectData = async () => {
    try {
      const { data } = await SubjectService.getTeachingBySubject({
        subjectId: id,
        year: selectedYear,
        grade: selectedGrade
      });

      setTeachingData(data.teachingByGradeAndSubjectResponse || []);
      if (data.subjectName) {
        setSubjectInfo({ name: data.subjectName, code: id });
      }
    } catch (e) {
      console.error('Failed to fetch teaching data:', e);
    }
  };

  const handleFilterChange = (value, type) => {
    if (type === "year") {
      setSelectedYear(value);
    } else if (type === "grade") {
      setSelectedGrade(value);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchText.trim() !== "") {
      handleFilterChange(searchText.trim(), "year");
    }
  };

  const columns = [
    {
      title: 'STT',
      key: 'index',
      render: (_, __, index) => index + 1,
      width: 60,
    },
    {
      title: 'Giáo viên',
      dataIndex: 'teacherName',
      key: 'teacherName',
    },
    {
      title: 'Mã GV',
      dataIndex: 'teacherCode',
      key: 'teacherCode',
    },
    {
      title: 'Lớp',
      dataIndex: 'className',
      key: 'className',
    },
    {
      title: 'Mã lớp',
      dataIndex: 'classCode',
      key: 'classCode',
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Button
          
          //onClick={() => handleAssign(record)}
        >
          Phân công
        </Button>
      ),
    }

  ];

  return (
    <Layout className="min-h-screen">
      <Sidebar />
      <Layout className="p-5">
        <Content>
          <Card className="shadow rounded-xl p-6">
            {/* Thông tin môn học + Dropdown */}
            <div className="flex flex-col items-center text-center gap-4 mb-8">
              <div>
                <h2 className="text-xl font-semibold">Thông tin môn học</h2>
                <p className="text-base">
                  <span className="font-medium">Tên môn:</span> {subjectInfo.name}
                </p>
                <p className="text-base">
                  <span className="font-medium">Mã môn:</span> {subjectInfo.code}
                </p>
              </div>

              {/* Dropdown trung tâm */}
              <div className="flex flex-wrap justify-center gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1 text-left">Năm học</label>
                  <Select
                    showSearch
                    placeholder="Chọn năm học"
                    style={{ width: 180 }}
                    value={selectedYear}
                    onSearch={(value) => setSearchText(value)}
                    onChange={(value) => handleFilterChange(value, "year")}
                    onKeyDown={handleKeyDown}
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
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-left">Khối lớp</label>
                  <Select
                    placeholder="Chọn khối"
                    style={{ width: 120 }}
                    value={selectedGrade}
                    onChange={(value) => handleFilterChange(value, "grade")}
                  >
                    <Option value="10">10</Option>
                    <Option value="11">11</Option>
                    <Option value="12">12</Option>
                  </Select>
                </div>
              </div>
            </div>

            {/* Bảng dữ liệu */}
            <Table
              columns={columns}
              dataSource={teachingData}
              rowKey="classId"
              pagination={{ pageSize: 5 }}
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Không có dữ liệu"
                  />
                ),
              }}
            />
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default SubjectDetailPage;
