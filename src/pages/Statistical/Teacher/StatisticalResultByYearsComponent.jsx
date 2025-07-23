import React, { useEffect, useState } from 'react';
import { Card, Row, Col } from 'antd';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StatisticalService from '../../../services/statisticalService';

const StatisticalResultByYearsComponent = ({ year, grade }) => {
  const [statisticalData, setStatisticalData] = useState(null);

  useEffect(() => {
    fetchStatisticalResultOfGradeAsync();
  }, [year, grade]);

  const fetchStatisticalResultOfGradeAsync = async () => {
    try {
      const { data } = await StatisticalService.StatisticalResultOfGradeByYearsAsync(year, grade);
      console.log("Statistical Data:", data.data);
      setStatisticalData(data.data);
    } catch (error) {
      console.error("Error fetching statistical result of grade", error);
    }
  };

  // Transform data for Learning charts - 4 columns per year
  const transformLearningData = (dataArray) => {
    if (!dataArray || dataArray.length === 0) return [];

    return dataArray.map((yearData) => {
      const learnings = yearData.learnings && yearData.learnings.length > 0 ? yearData.learnings[0] : {};
      return {
        name: yearData.year || 'N/A',
        'Xuất sắc': learnings.excelent || learnings.excellent || 0,
        'Giỏi': learnings.good || 0,
        'Đạt': learnings.passed || 0,
        'Chưa đạt': learnings.notPassed || 0
      };
    });
  };

  // Transform data for Practices charts - 4 columns per year
  const transformPracticesData = (dataArray) => {
    if (!dataArray || dataArray.length === 0) return [];

    return dataArray.map((yearData) => {
      const practices = yearData.practices && yearData.practices.length > 0 ? yearData.practices[0] : {};
      return {
        name: yearData.year || 'N/A',
        'Xuất sắc': practices.excelent || practices.excellent || 0,
        'Giỏi': practices.good || 0,
        'Đạt': practices.passed || 0,
        'Chưa đạt': practices.notPassed || 0
      };
    });
  };

  // Transform data for Reward chart - 2 columns per year
  const transformRewardData = (dataArray) => {
    if (!dataArray || dataArray.length === 0) return [];

    return dataArray.map((yearData) => {
      const reward = yearData.reward && yearData.reward.length > 0 ? yearData.reward[0] : {};
      return {
        name: yearData.year || 'N/A',
        'Xuất sắc': reward.excelent || reward.excellent || 0,
        'Giỏi': reward.good || 0
      };
    });
  };

  // Transform data for Class Promotion chart - 2 columns per year
  const transformPromotionData = (dataArray) => {
    if (!dataArray || dataArray.length === 0) return [];

    return dataArray.map((yearData) => {
      const notPassedClass = yearData.notPassedClass && yearData.notPassedClass.length > 0 ? yearData.notPassedClass[0] : {};
      
      // Calculate total students and promoted students
      const total = (notPassedClass.excelent || notPassedClass.excellent || 0) + 
                   (notPassedClass.good || 0) + 
                   (notPassedClass.passed || 0) + 
                   (notPassedClass.notPassed || 0);
      const promoted = total - (notPassedClass.notPass || 0);
      
      return {
        name: yearData.year || 'N/A',
        'Qua lớp': promoted,
        'Ở lại': notPassedClass.notPass || 0
      };
    });
  };

  return (
    <Card title={`Kết quả thống kê các năm - Khối ${grade}`}>
      <Row gutter={[0, 24]}>
        {/* Kết quả học tập theo năm - 4 cột */}
        <Col span={24}>
          <Card title="Kết quả học tập theo năm" className="shadow-md rounded-lg">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={transformLearningData(statisticalData)}
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

        {/* Rèn luyện theo năm - 4 cột */}
        <Col span={24}>
          <Card title="Rèn luyện theo năm" className="shadow-md rounded-lg">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={transformPracticesData(statisticalData)}
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

        {/* Khen thưởng theo năm - 2 cột */}
        <Col span={24}>
            <Row gutter={[3, 24]}>
                <Col span={12} >
                <Card title="Khen thưởng theo năm" className="shadow-md rounded-lg">
                    <ResponsiveContainer width="100%" height={350}>
                    <BarChart
                        data={transformRewardData(statisticalData)}
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

                {/* Lên lớp theo năm - 2 cột */}
                <Col span={12}>
                <Card title="Lên lớp theo năm" className="shadow-md rounded-lg">
                    <ResponsiveContainer width="100%" height={350}>
                    <BarChart
                        data={transformPromotionData(statisticalData)}
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
                        {/* <Bar dataKey="Qua lớp" fill="#52c41a" name="Qua lớp" /> */}
                        <Bar dataKey="Ở lại" fill="#cf1322" name="Ở lại" />
                    </BarChart>
                    </ResponsiveContainer>
                </Card>
                </Col>
            </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default StatisticalResultByYearsComponent;