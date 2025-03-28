import { Table, Tag, Input, Space } from "antd";
import { useState, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";

const ListStudent = ({ studentData }) => {
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const [sortOrder, setSortOrder] = useState(null);

  // Khi component render lần đầu, đảm bảo hiển thị danh sách học sinh
  useEffect(() => {
    setFilteredData(studentData);
  }, [studentData]);

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    const filtered = studentData.filter(
      (student) =>
        student.code.toLowerCase().includes(value) ||
        student.fullName.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  // Xử lý sắp xếp mã số học sinh
  const handleSort = () => {
    const newOrder = sortOrder === "ascend" ? "descend" : "ascend";
    setSortOrder(newOrder);

    const sortedData = [...filteredData].sort((a, b) =>
      newOrder === "ascend" ? a.code.localeCompare(b.code) : b.code.localeCompare(a.code)
    );
    setFilteredData(sortedData);
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: (
        <div className="flex justify-between">
          Mã học sinh
          <span onClick={handleSort} className="cursor-pointer ml-2">
            {sortOrder === "ascend" ? "🔼" : "🔽"}
          </span>
        </div>
      ),
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Tên học sinh",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (gender) => (
        <Tag color={gender ? "blue" : "pink"}>{gender ? "Nam" : "Nữ"}</Tag>
      ),
    },
    {
      title: "Lịch sử truy cập",
      dataIndex: "updateAt",
      key: "updateAt",
      render: (date) =>
        date === "0001-01-01T00:00:00"
          ? "Chưa có hoạt động"
          : moment(date).format("DD/MM/YYYY HH:mm"),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Tìm kiếm mã số hoặc tên học sinh..."
          value={searchText}
          onChange={handleSearch}
          allowClear
        />
      </Space>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default ListStudent;
