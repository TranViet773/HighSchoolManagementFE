import React, { useState, useEffect } from 'react';
import { Card, Select, Row, Col, Segmented } from 'antd';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import StatisticalService from '../../../services/statisticalService';
import StatisticalResultByYearsComponent from './StatisticalResultByYearsComponent';
const { Option } = Select;
const gradeOptions = [10, 11, 12];

const StatisticalScoreComponent = ({ year }) => {
  const [selectedGrade, setSelectedGrade] = useState(10);
  const [statisticalData, setStatisticalData] = useState(null);
  const [selectedTab, setSelectedTab] = useState('Năm hiện tại');
  useEffect(() => {
    fetchStatisticalResultOfGradeAsync();
  }, [year, selectedGrade]);

  const fetchStatisticalResultOfGradeAsync = async () => {
    try {
      const {data} = await StatisticalService.StatisticalResultOfGradeAsync(year, selectedGrade);
      //console.log("Statistical Data:", data.data);
      setStatisticalData(data.data);
    } catch (error) {
      console.error("Error fetching statistical result of grade", error);
    }
  };

  // Transform data for Learning and Practices charts (4 columns each)
  const transformLearningPracticesData = (list, type) => {
    if (!list || list.length === 0) return [];

    return list.map((item, index) => ({
      name: item.classCode || `Lớp ${index + 1}`,
      'Xuất sắc': item.excelent || item.excellent || 0,
      'Giỏi': item.good || 0,
      'Đạt': item.passed || 0,
      'Chưa đạt': item.notPassed || 0
    }));
  };

  // Transform data for Reward chart (2 columns)
  const transformRewardData = (list) => {
    if (!list || list.length === 0) return [];

    return list.map((item, index) => ({
      name: item.classCode || `Lớp ${index + 1}`,
      'Xuất sắc': item.excelent || item.excellent || 0,
      'Giỏi': item.good || 0
    }));
  };

  // Transform data for Class Promotion chart (2 columns)
  const transformPromotionData = (list) => {
    if (!list || list.length === 0) return [];

    return list.map((item, index) => {
      const total = (item.excelent || item.excellent || 0) + 
                   (item.good || 0) + 
                   (item.passed || 0) + 
                   (item.notPassed || 0);
      const promoted = total - (item.notPass || 0);
      
      return {
        name: item.classCode || `Lớp ${index + 1}`,
        'Qua lớp': promoted,
        'Ở lại': item.notPass || 0
      };
    });
  };

  return (
    <Card title={
      <div>
        `Kết quả thống kê theo khối ${selectedGrade}`
        <Segmented 
          options={["Năm hiện tại", "Các năm trước"]}
          style={{ marginLeft: 16 }}
          defaultValue="Năm hiện tại"
          value={selectedTab}
          onChange={(value) => setSelectedTab(value)}
        />
      </div>
    }>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Select
            value={selectedGrade}
            onChange={setSelectedGrade}
            style={{ width: '100%' }}
          >
            {gradeOptions.map(grade => (
              <Option key={grade} value={grade}>Khối {grade}</Option>
            ))}
          </Select>
        </Col>
      </Row>
      {selectedTab === "Năm hiện tại" && (
        <Row gutter={[0, 24]}>
          {/* Kết quả học tập - 4 cột */}
          <Col span={24}>
            <Card title="Kết quả học tập" className="shadow-md rounded-lg">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={transformLearningPracticesData(statisticalData?.learnings, 'learnings')}
                  margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                >
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    fontSize={12}
                    interval={0}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#f6f6f6', 
                      border: '1px solid #ccc',
                      borderRadius: '4px' 
                    }}
                  />
                  <Legend />
                  <Bar dataKey="Xuất sắc" fill="#ff4d4f" name="Xuất sắc" />
                  <Bar dataKey="Giỏi" fill="#52c41a" name="Giỏi" />
                  <Bar dataKey="Đạt" fill="#1890ff" name="Đạt" />
                  <Bar dataKey="Chưa đạt" fill="#faad14" name="Chưa đạt" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          {/* Rèn luyện - 4 cột */}
          <Col span={24}>
            <Card title="Rèn luyện" className="shadow-md rounded-lg">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={transformLearningPracticesData(statisticalData?.practices, 'practices')}
                  margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                >
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    fontSize={12}
                    interval={0}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#f6f6f6', 
                      border: '1px solid #ccc',
                      borderRadius: '4px' 
                    }}
                  />
                  <Legend />
                  <Bar dataKey="Xuất sắc" fill="#722ed1" name="Xuất sắc" />
                  <Bar dataKey="Giỏi" fill="#13c2c2" name="Giỏi" />
                  <Bar dataKey="Đạt" fill="#52c41a" name="Đạt" />
                  <Bar dataKey="Chưa đạt" fill="#fa8c16" name="Chưa đạt" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          {/* Khen thưởng - 2 cột */}
          <Col span={24}>
            <Card title="Khen thưởng" className="shadow-md rounded-lg">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={transformRewardData(statisticalData?.reward)}
                  margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                >
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    fontSize={12}
                    interval={0}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#f6f6f6', 
                      border: '1px solid #ccc',
                      borderRadius: '4px' 
                    }}
                  />
                  <Legend />
                  <Bar dataKey="Xuất sắc" fill="#eb2f96" name="Xuất sắc" />
                  <Bar dataKey="Giỏi" fill="#f5222d" name="Giỏi" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          {/* Lên lớp - 2 cột */}
          <Col span={24}>
            <Card title="Lên lớp" className="shadow-md rounded-lg">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={transformPromotionData(statisticalData?.notPassedClass)}
                  margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                >
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    fontSize={12}
                    interval={0}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#f6f6f6', 
                      border: '1px solid #ccc',
                      borderRadius: '4px' 
                    }}
                  />
                  <Legend />
                  <Bar dataKey="Ở lại" fill="#cf1322" name="Ở lại" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
      )}

      {selectedTab === "Các năm trước" && (
        <StatisticalResultByYearsComponent year={year} grade={selectedGrade} />
      )}
    </Card>
  );
};

export default StatisticalScoreComponent;