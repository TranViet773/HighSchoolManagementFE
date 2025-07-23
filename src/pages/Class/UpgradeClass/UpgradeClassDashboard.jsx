import React, { useState, useEffect } from "react";
import { Layout, Segmented, Card, Table, Select, Row, Col, message, Button } from "antd";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/SideBarComponent/SidebarComponent";
import ClassService from "../../../services/classService";
import getCurrentYear from "../../../utils/year.util";
import UpgradeClassComponent from "./UpgradeClassComponent";
import StudentsNotPassClassComponent from "./StudentsNotPassClassComponent";

const { Content } = Layout;
const { Option } = Select;
const { schoolYear } = getCurrentYear();

const UpgradeClassDashboard = () => {
  const [activeSegment, setActiveSegment] = useState("Danh sách lớp");
  const [classes, setClasses] = useState([]);
  //const [filteredClasses, setFilteredClasses] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const { data } = await ClassService.getAll(schoolYear);
      setClasses(data.data || []);
      //setFilteredClasses(data.data || []);
    } catch (error) {
      message.error("Lỗi khi tải danh sách lớp học!");
    } finally {
      setLoading(false);
    }
  };

  const renderClassList = () => (
    <UpgradeClassComponent classesData={classes} schoolYear={schoolYear}/>
  );

  const renderStudentList = () => (
    <StudentsNotPassClassComponent year={schoolYear}/>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout style={{ padding: "20px" }}>
        <Content>
          <Segmented
            options={["Danh sách lớp", "Danh sách học sinh"]}
            value={activeSegment}
            onChange={setActiveSegment}
            style={{ marginBottom: 20 }}
          />
          {activeSegment === "Danh sách lớp" ? renderClassList() : renderStudentList()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default UpgradeClassDashboard;
