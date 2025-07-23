import React, { useEffect, useState } from 'react';
import { Layout, Card, Row, Col, Table, Tag, Spin, message, Select, Segmented } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Sidebar from '../../components/SideBarComponent/SidebarComponent';
import { FaUserGraduate, FaChalkboardTeacher, FaUserTie, FaSchool, FaBook, FaFileAlt } from 'react-icons/fa';
import { ClockCircleOutlined } from '@ant-design/icons';
import StatisticalService from '../../services/statisticalService';
import getCurrentYear from '../../utils/year.util';
import StatisticalScoreComponent from '../Statistical/Teacher/StatisticalScoreComponent';

const { Content } = Layout;
const { schoolYear } = getCurrentYear();
const {Option} = Select;
const StatisticalDashboard = () => {
  const [statisticalData, setStatisticalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(schoolYear);
  const [selectedTab, setSelectedTab] = useState('Tổng quan');

  useEffect(() => {
    fetchStatisticalData();
  }, [selectedYear]);

  const fetchStatisticalData = async () => {
    try {
      setLoading(true);
      const { data } = await StatisticalService.getAllStatistical(selectedYear);
      console.log("Statistical Data: ", data);
      setStatisticalData(data.data);
      message.success("Lấy thông tin thống kê thành công!");
    } catch (error) {
      console.error("Error fetching statistical data:", error);
      message.error("Không thể lấy dữ liệu thống kê!");
    } finally {
      setLoading(false);
    }
  };

  // Transform API data for charts
  const getYearlyStudentData = () => {
    console.log("getYearlyStudentData - numberOfStudentByGender:", statisticalData?.numberOfStudentByGender);
    console.log("getYearlyStudentData - numberOfStudentEnrolleds:", statisticalData?.numberOfStudentEnrolleds);
    
    if (!statisticalData?.numberOfStudentByGender) return [];
    
    // Create a map of enrolled students by year for easier lookup
    const enrolledByYear = {};
    if (statisticalData?.numberOfStudentEnrolleds) {
      statisticalData.numberOfStudentEnrolleds.forEach(item => {
        enrolledByYear[item.year] = item.enrolledStudents || 0;
      });
    }
    
    return statisticalData.numberOfStudentByGender.map(item => {
      return {
        year: item.year,
        male: item.male || 0,
        female: item.female || 0,
        total: (item.male || 0) + (item.female || 0),
        enrolled: enrolledByYear[item.year] || 0
      };
    });
  };  

  const getGradeStudentData = () => {
    if (!statisticalData?.numberOfStudentByGrade) return [];
    
    return statisticalData.numberOfStudentByGrade.map(item => ({
      year: item.year,
      khối10: item.numberOfStudentOf10 || 0,
      khối11: item.numberOfStudentOf11 || 0,
      khối12: item.numberOfStudentOf12 || 0
    }));
  };

  const getReviewTableData = () => {
    if (!statisticalData?.numberOfReevaluationByYear) return [];
    
    return statisticalData.numberOfReevaluationByYear.map((item, index) => ({
      key: index.toString(),
      year: item.year,
      processed: item.handled || 0,
      pending: item.notHandleYet || 0
    }));
  };

  // Table columns for review data
  const columns = [
    { 
      title: 'Năm học', 
      dataIndex: 'year', 
      key: 'year',
      align: 'center'
    },
    { 
      title: 'Đã xử lý', 
      dataIndex: 'processed', 
      key: 'processed',
      align: 'center',
      render: val => <Tag color="green">{val}</Tag> 
    },
    { 
      title: 'Chưa xử lý', 
      dataIndex: 'pending', 
      key: 'pending',
      align: 'center',
      render: val => <Tag color="red">{val}</Tag> 
    },
  ];

  const generateSchoolYears = () => {
  const currentYear = parseInt(schoolYear.split("-")[0]);
  return Array.from({ length: 10 }, (_, i) => {
      const start = currentYear - (9 - i);
      return `${start}-${start + 1}`;
    });
  };

  // Calculate totals from API data
  const getTotalStudents = () => {
    if (!statisticalData?.numberOfStudent) return '0';
    return statisticalData.numberOfStudent.toString();
  };

  const getTotalTeachers = () => {
    if (!statisticalData?.numberOfTeacher) return '0';
    return statisticalData.numberOfTeacher.toString();
  };

  const getTotalStaff = () => {
    if (!statisticalData?.numberOfStaff) return '0';
    return statisticalData.numberOfStaff.toString();
  };

  const getTotalClasses = () => {
    if (!statisticalData?.numberOfClass) return '0';
    return statisticalData.numberOfClass.toString();
  };

  const getTotalSubjects = () => {
    if (!statisticalData?.numberOfSubject) return '0';
    return statisticalData.numberOfSubject.toString();
  };

  const getTotalReevaluations = () => {
    if (!statisticalData?.numberOfReevaluation) return '0';
    return statisticalData.numberOfReevaluation.toString();
  };

  // Stat cards configuration
  const statCards = [
    {
      title: 'Học Sinh',
      value: getTotalStudents(),
      icon: <FaUserGraduate size={30} color="#faad14" />,
      footer: 'Tất cả trong hệ thống',
      color: '#fffbe6',
    },
    {
      title: 'Giáo Viên',
      value: getTotalTeachers(),
      icon: <FaChalkboardTeacher size={30} color="#52c41a" />,
      footer: 'Tất cả trong hệ thống',
      color: '#f6ffed',
    },
    {
      title: 'Nhân Viên',
      value: getTotalStaff(),
      icon: <FaUserTie size={30} color="#1890ff" />,
      footer: 'Tất cả trong hệ thống',
      color: '#e6f7ff',
    },
    {
      title: 'Lớp Học',
      value: getTotalClasses(),
      icon: <FaSchool size={30} color="#eb2f96" />,
      footer: 'Năm hiện tại',
      color: '#fff0f6',
    },
    {
      title: 'Môn Học',
      value: getTotalSubjects(),
      icon: <FaBook size={30} color="#722ed1" />,
      footer: 'Trong năm học',
      color: '#f9f0ff',
    },
    {
      title: 'Đơn phúc khảo',
      value: getTotalReevaluations(),
      icon: <FaFileAlt size={30} color="#fa8c16" />,
      footer: 'Tổng số đơn',
      color: '#fff7e6',
    },
  ];

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sidebar />
        <Layout style={{ padding: '20px' }}>
          <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Spin size="large" tip="Đang tải dữ liệu thống kê..." />
          </Content>
        </Layout>
      </Layout>
    );
  }

  const yearlyData = getYearlyStudentData();
  const gradeData = getGradeStudentData();
  const reviewData = getReviewTableData();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout style={{ padding: '20px' }}>
        <Content>
          <div className='clas' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
              Thống kê tổng quan
            </h1>
            <Select
              value={selectedYear}
              onChange={(value) => setSelectedYear(value)}
              style={{ width: 200 }}
            >
              {generateSchoolYears().map((year) => (
                <Option key={year} value={year}>{`Năm học ${year}`}</Option>
              ))}
            </Select>
          </div>
          <Segmented 
            options={['Tổng quan', 'Học tập']}
            style={{ marginBottom: 20, borderRadius: '8px', boxShadow: '0 2px 8px rgba(112, 132, 248, 0.99)' }}
            defaultValue="Tổng quan"
            onChange={(value) => setSelectedTab(value)}
          />

          {selectedTab === 'Tổng quan' && (
            <div>

              <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
                {statCards.slice(0, 3).map((item, index) => (
                  <Col xs={24} sm={8} key={index}>
                    <Card
                      style={{ 
                        background: item.color, 
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                      bordered={false}
                      bodyStyle={{ padding: 16 }}
                      hoverable
                    >
                      <Row align="middle" gutter={16}>
                        <Col>{item.icon}</Col>
                        <Col flex={1}>
                          <div style={{ fontSize: 14, color: '#555', marginBottom: 4 }}>{item.title}</div>
                          <div style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 4 }}>{item.value}</div>
                          <div style={{ fontSize: 12, color: '#888' }}>
                            <ClockCircleOutlined style={{ marginRight: 4 }} />
                            {item.footer}
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                ))}
              </Row>

              <Row gutter={[16, 16]} style={{ marginBottom: 30 }}>
                {statCards.slice(3, 6).map((item, index) => (
                  <Col xs={24} sm={8} key={index + 3}>
                    <Card
                      style={{ 
                        background: item.color, 
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                      bordered={false}
                      bodyStyle={{ padding: 16 }}
                      hoverable
                    >
                      <Row align="middle" gutter={16}>
                        <Col>{item.icon}</Col>
                        <Col flex={1}>
                          <div style={{ fontSize: 14, color: '#555', marginBottom: 4 }}>{item.title}</div>
                          <div style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 4 }}>{item.value}</div>
                          <div style={{ fontSize: 12, color: '#888' }}>
                            <ClockCircleOutlined style={{ marginRight: 4 }} />
                            {item.footer}
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* Line Chart for Student Data */}
              <Card 
                title={
                  <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                    Biểu đồ học sinh theo năm (Nam, Nữ, Tất cả)
                  </span>
                }
                style={{ 
                  marginBottom: 30, 
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                {yearlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={yearlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="male" 
                        name="Nam" 
                        stroke="#1890ff" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="female" 
                        name="Nữ" 
                        stroke="#f5222d" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="total" 
                        name="Tất cả" 
                        stroke="#52c41a" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="enrolled" 
                        name="Nhập học" 
                        stroke="#fb06b1ff" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        strokeDasharray="5 5"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ textAlign: 'center', padding: '50px', color: '#999' }}>
                    Không có dữ liệu để hiển thị
                  </div>
                )}
              </Card>

              {/* Bottom Row with Bar Chart and Table */}
              <Row gutter={[16, 16]}>
                {/* Bar Chart for Grade Data */}
                <Col xs={24} md={12}>
                  <Card 
                    title={
                      <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                        Học sinh theo khối (3 năm)
                      </span>
                    }
                    style={{ 
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    {gradeData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={gradeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="khối10" stackId="a" name="Khối 10" fill="#8884d8" />
                          <Bar dataKey="khối11" stackId="a" name="Khối 11" fill="#82ca9d" />
                          <Bar dataKey="khối12" stackId="a" name="Khối 12" fill="#ffc658" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '50px', color: '#999' }}>
                        Không có dữ liệu để hiển thị
                      </div>
                    )}
                  </Card>
                </Col>

                {/* Review Table */}
                <Col xs={24} md={12}>
                  <Card 
                    title={
                      <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                        Phúc khảo theo năm
                      </span>
                    }
                    style={{ 
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    <Table
                      columns={columns}
                      dataSource={reviewData}
                      pagination={false}
                      bordered
                      size="middle"
                      locale={{
                        emptyText: 'Không có dữ liệu để hiển thị'
                      }}
                      style={{ fontSize: '14px' }}
                    />
                  </Card>
                </Col>
              </Row>
            </div>
          )}

          {selectedTab === 'Học tập' && (
            <StatisticalScoreComponent year={selectedYear}/>
          )}

        </Content>
      </Layout>
    </Layout>
  );
};

export default StatisticalDashboard;