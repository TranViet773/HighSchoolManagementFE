import React, { useState, useEffect } from 'react';
import { Card, Timeline, Typography, Row, Col } from 'antd';
import { toast } from 'react-toastify';
import TeacherService from '../../../../services/teacherService';
import { ClockCircleOutlined } from '@ant-design/icons';
import DashboardClassAdvisorInfo from './DashboardClassAdvisorInfo';

const { Title, Text } = Typography;

const ListClassAdvisorComponent = ({ teacherId }) => {
  const [classesAdvisor, setClassesAdvisor] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    fetchClassesAdvisorData();
  }, []);

  const fetchClassesAdvisorData = async () => {
    try {
      const { data, error } = await TeacherService.getListClassAndStudentByAdvisor({ teacherId });
      if (error) {
        toast.error(error);
      } else {
        setClassesAdvisor(data.data);
      }
    } catch (e) {
      toast.error("Có lỗi khi lấy dữ liệu chủ nhiệm. Vui lòng tải lại!");
    }
  };

  const fetchStudentAndClassByAdvisor = async (year) => {
    try{
      console.log(year);
      const {data} = await TeacherService.getClassAndStudentByAdvisor({teacherId, year: year});
      console.log(data);
      setSelectedClass(data.data);
    }catch(e)
    {
      console.log(e);
    }
  }
  
  const groupedByYear = classesAdvisor.reduce((acc, cls) => {
    acc[cls.year] = acc[cls.year] || [];
    acc[cls.year].push(cls);
    return acc;
  }, {});

  const sortedYears = Object.keys(groupedByYear).sort((a, b) => b.localeCompare(a));

  return (
    <Card title="Hồ sơ chủ nhiệm">
      {selectedClass == null && (
        <Timeline mode="left">
          {sortedYears.map((year) => (
            <Timeline.Item
              key={year}
              label={<strong>{year}</strong>}
              dot={<ClockCircleOutlined style={{ fontSize: '16px' }} />}
            >
              <Row gutter={[16, 16]}>
                {groupedByYear[year].map((cls) => {
                  const isSelected = selectedClass?.classes_Id === cls.classes_Id;

                  return (
                    <Col key={cls.classes_Id} xs={24} sm={12} md={8} lg={6}>
                      <Card
                        hoverable
                        onClick={() => fetchStudentAndClassByAdvisor(cls.year)}
                        className={`rounded-xl shadow-sm transition-all duration-200 ${
                          isSelected ? 'ring-2 ring-blue-500' : ''
                        }`}
                        style={{
                          textAlign: "center",
                          backgroundColor: isSelected ? "#e6f7ff" : "#f0f5ff",
                          border: "1px solid #d6e4ff",
                          borderRadius: "12px",
                          cursor: "pointer"
                        }}
                      >
                        <Title level={4} style={{ marginBottom: 8 }}>{cls.classes_Name}</Title>
                        <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>
                          Mã lớp: <strong>{cls.classes_Code}</strong>
                        </Text>
                        <Text>Sĩ số: <strong>{cls.classes_Quantity}</strong> học sinh</Text>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </Timeline.Item>
          ))}
        </Timeline>
      )}

      {selectedClass && (
        <div style={{ marginTop: 24 }}>
          <DashboardClassAdvisorInfo classInfo={selectedClass} />
        </div>
      )}
    </Card>
  );
};

export default ListClassAdvisorComponent;
