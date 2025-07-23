import React, { useEffect, useState } from "react";
import {
  Layout, Card, Select, Timeline, Row, Col, Typography, Tag,
  Segmented} from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import TeacherService from "../../../../services/teacherService";
import ClassService from "../../../../services/classService";
import { values } from "lodash";
import ScoreBoardOfClassComponent from "./ScoreBoardOfClassComponent";
import DashboardClassInfor from "./DashboardClassInfor";

const { Content } = Layout;
const { Option } = Select;
const { Title, Text } = Typography;

const ListClassTeachingComponent = ({ teacherId }) => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [timelineData, setTimelineData] = useState([]);
  const [allYears, setAllYears] = useState([]);
  const [selectedTab, setSelectedTab] = useState("Điểm");
  const [selectedClass, setSelectedClass] = useState(null);
  
  useEffect(() => {
    fetchTimeLineData();
  }, []);

  useEffect(() => {
    if (selectedYear) {
      fetchClassesTeachingData(selectedYear);
    }
  }, [selectedYear]);

  const fetchTimeLineData = async () => {
    try {
      const { data } = await TeacherService.getTimeLineTeaching(teacherId);
      console.log("timeline data: ", data);
      setTimelineData(data.data);

      // Lấy danh sách năm từ timeline data
      const years = data.data.map((item) => item.year);
      setAllYears(years);
      if (years.length > 0) {
        setSelectedYear(years[0]);
      }
    } catch (e) {
      console.log("Có lỗi khi lấy timeline data: ", e);
    }
  };

  const fetchClassesTeachingData = async (year) => {
    try {
      const { data } = await ClassService.getClassByTeacher({ id: teacherId, year });
      console.log("list class data: ", data);
    } catch (e) {
      console.log("Có lỗi khi lấy list class data: ", e);
    }
  };

  // Lọc dữ liệu theo năm được chọn
  const filteredClasses =
    timelineData.find((item) => item.year === selectedYear)?.classResponses || [];

  return (
    <Layout style={{ padding: 24, background: "#fff" }}>
      <Content>
        <Title level={4}>Hồ sơ giảng dạy</Title>
          {selectedClass == null && (
            <Row gutter={24}>
              {/* LEFT: TIMELINE */}
              <Col xs={24} md={8}>
                <Card
                  title="Dòng thời gian giảng dạy"
                  style={{ height: "100%" }}
                  bodyStyle={{ maxHeight: "600px", overflowY: "auto" }}
                >
                  <Timeline mode="left">
                    {timelineData.map((yearItem) => (
                      <React.Fragment key={yearItem.year}>
                        <Timeline.Item color="red">
                          <Text strong style={{ fontSize: 18, color: "red" }}>{yearItem.year}</Text>
                        </Timeline.Item>
                        {yearItem.classResponses.map((cls, idx) => (
                          <React.Fragment key={cls.classes_Id + idx}>
                            <Timeline.Item color="blue">
                              <Text strong style={{color: "green"}}>{`${cls.classes_Name} - ${cls.subject_Name}`}</Text>
                            </Timeline.Item>
                            
                          </React.Fragment>
                        ))}
                      </React.Fragment>
                    ))}
                  </Timeline>
                </Card>
              </Col>

              {/* RIGHT: CLASS CARDS */}
              <Col xs={24} md={16}>
                <Card
                  title={
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Danh sách lớp giảng dạy</span>
                      <Select
                        value={selectedYear}
                        onChange={setSelectedYear}
                        style={{ width: 180 }}
                      >
                        {allYears.map((year) => (
                          <Option key={year} value={year}>
                            Năm học: {year}
                          </Option>
                        ))}
                      </Select>
                    </div>
                  }
                  style={{ height: "100%" }}
                  bodyStyle={{ minHeight: 600 }}
                >
                  <Row gutter={[16, 16]}>
                    {filteredClasses.map((cls, index) => (
                      <Col xs={24} sm={12} md={8} key={index}>
                        <Card
                          hoverable
                          onClick={() => {
                            setSelectedClass({
                              classId: cls.classes_Id,
                              className: cls.classes_Name,
                              subjectId: cls.subject_Id,
                              subjectName: cls.subject_Name,
                              year: cls.year,
                              semester: cls.semester, // nếu có
                            });
                            setSelectedTab("Thống kê kết quả");
                          }}
                          style={{
                            backgroundColor: "#f0f5ff",
                            borderColor: "#adc6ff",
                            transition: "transform 0.3s",
                            cursor: "pointer",
                          }}
                          bodyStyle={{ padding: 16 }}
                          className="hover:scale-105 rounded-xl shadow-lg"
                        >

                          <Title level={4} style={{ margin: 0 }}>{cls.classes_Name}</Title>
                          <Tag color="blue">{cls.subject_Name}</Tag>
                          <br />
                          <Text type="secondary">{cls.year}</Text>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Card>
              </Col>
            </Row>
          )}
          {selectedClass !=null && (
            <DashboardClassInfor classInfo={selectedClass} />
          )}
      </Content>
    </Layout>
  );
};

export default ListClassTeachingComponent;
