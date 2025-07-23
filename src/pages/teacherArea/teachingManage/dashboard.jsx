import React, { useState } from 'react';
import { Layout, Row, Col, Segmented, Select, Card, Input } from 'antd';
import SidebarTeacher from '../../../components/SideBarComponent/SideBarTeacher';
import ListClassComponent from './components/listClassComponent';
import getCurrentYear from '../../../utils/year.util';

const { schoolYear, listYear, semester } = getCurrentYear();
const { Content } = Layout;
const { Option } = Select;
const { Search } = Input;


const TeachingManager = () => {
  const [selectedYear, setSelectedYear] = useState(listYear[2]); // Mặc định chọn năm học đầu tiên trong danh sách
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <SidebarTeacher />
      <Layout style={{ padding: "20px", background: "#fff" }}>
        <Content>
          {/* Header */}
          <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
            <Col>
              <Select value={selectedYear} onChange={setSelectedYear} style={{ width: 150 }}>
                {listYear.map(year => (
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
