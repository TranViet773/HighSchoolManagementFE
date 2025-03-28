import React, { useState } from 'react';
import { Layout, Row, Col, Segmented, Select, Card, Input } from 'antd';
import SidebarTeacher from '../../../components/SideBarComponent/SideBarTeacher';
import ListClassComponent from './components/listClassComponent';

const { Content } = Layout;
const { Option } = Select;
const { Search } = Input;

// Tính năm học hiện tại và danh sách năm học để chọn
const curYear = new Date().getFullYear();
const schoolYear = `${curYear}-${curYear + 1}`;
const optionSchoolYear = [
  `${curYear - 2}-${curYear - 1}`,
  `${curYear - 1}-${curYear}`,
  `${curYear}-${curYear + 1}`,
];


const TeachingManager = () => {
  const [selectedYear, setSelectedYear] = useState(schoolYear);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <SidebarTeacher />
      <Layout style={{ padding: "20px", background: "#fff" }}>
        <Content>
          {/* Header */}
          <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
            <Col>
              <Select value={selectedYear} onChange={setSelectedYear} style={{ width: 150 }}>
                {optionSchoolYear.map(year => (
                  <Option key={year} value={year}>{year}</Option>
                ))}
              </Select>
            </Col>
          </Row>
          <ListClassComponent selectedYear={selectedYear}/>
        </Content>
      </Layout>
    </Layout>
  );
};

export default TeachingManager;
