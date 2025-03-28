import { Layout, Button, Table, Space, message, Input, Select, Row, Col } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../../components/SideBarComponent/SidebarComponent";
import { SearchOutlined } from "@ant-design/icons";
import ClassService from "../../services/classService";
import { toast } from "react-toastify";

const { Content } = Layout;
const { Option } = Select;
const curYear = new Date().getFullYear();
const schoolYear = `${curYear}-${curYear + 1}`;
const optionSchoolYear = [
  `${curYear - 2}-${curYear - 1}`,
  `${curYear - 1}-${curYear}`,
  `${curYear}-${curYear + 1}`,
];


const HomeClassPage = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedYear, setSelectedYear] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const pageSize = 50;

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async (year, query) => {
    setLoading(true);
    try {
      const { data } = await ClassService.getAll(year || schoolYear);
      let filteredClasses = data.data;
  
      // Nếu có query, lọc theo tên lớp
      if (query) {
        filteredClasses = filteredClasses.filter((cls) =>
          cls.classes_Name.toLowerCase().includes(query.toLowerCase())
        );
      }
  
      setClasses(filteredClasses);
    } catch (error) {
      message.error("Lỗi khi tải danh sách lớp học!");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (value, type) => {
    if (type === "year") {
      setSelectedYear(value);
      fetchClasses(value, searchQuery);
    } else if (type === "search") {
      setSearchQuery(value);
      fetchClasses(selectedYear, value);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const result = await ClassService.deleteClass(id);
        toast.success("Xóa lớp học thành công!");
        fetchClasses(selectedYear, searchQuery);
        setClasses((prevClasses) => prevClasses.filter((cls) => cls.classes_Code !== id));
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa lớp học!");
    } finally {
      setLoading(false);
    }
  };
  

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Tên Lớp",
      dataIndex: "classes_Name",
      key: "classes_Name",
    },
    {
      title: "Mã Lớp",
      dataIndex: "classes_Code",
      key: "classes_Code",
    },
    {
        title: "Số lượng",
        dataIndex: "classes_Quantity",
        key: "classes_Quantity",
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button danger onClick={() => handleDelete(record.classes_Id)}>
            Block
          </Button>
        </Space>
      ),
    },
    // {
    //   title: "Năm Học",
    //   dataIndex: "year",
    //   key: "year",
    // },
    // {
    //   title: "Giảng viên Cố vấn",
    //   dataIndex: "advisor",
    //   key: "advisor",
    // },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout style={{ padding: "20px" }}>
        <Content>
          <Row gutter={16} align="middle" style={{ marginBottom: "20px" }}>
            <Col>
              <Link to="/admin/create-class">
                <Button type="primary">Thêm mới lớp học</Button>
              </Link>
            </Col>
            <Col>
              <Select
                placeholder="Chọn năm học"
                style={{ width: 150 }}
                onChange={(value) => handleFilterChange(value, "year")}
                value={selectedYear}
              >
                {optionSchoolYear.map((year, index) =>{
                  return <Option value={year}>{year}</Option>
                })}
              </Select>
            </Col>
            <Col flex="auto">
              <Input
                placeholder="Tìm kiếm"
                prefix={<SearchOutlined />}
                style={{ width: 200 }}
                onChange={(e) => handleFilterChange(e.target.value, "search")}
                value={searchQuery}
              />
            </Col>
          </Row>

          <Table
            columns={columns}
            dataSource={classes}
            rowKey="classCode"
            loading={loading}
            pagination={{
              pageSize: pageSize,
              onChange: (page) => setCurrentPage(page),
            }}
            onRow={(record) => ({
              onClick: () => navigate(`/admin/class/${record.classes_Id}`), // Chuyển hướng khi click vào hàng
            })}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default HomeClassPage;
