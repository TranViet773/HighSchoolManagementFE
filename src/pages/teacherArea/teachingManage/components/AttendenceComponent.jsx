import React, { useEffect, useState } from "react";
import { Table, Input, Space, Select, Button, message } from "antd";
import { SearchOutlined, DeleteFilled } from "@ant-design/icons";
import AttendanceService from "../../../../services/attendanceService";
import getCurrentYear from "../../../../utils/year.util";
import { toast } from "react-toastify";

const { schoolYear, listYear, semester } = getCurrentYear();
const { Option } = Select;
const currentDate = new Date();
const timeStamp = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, "0")}-${currentDate.getDate().toString().padStart(2, "0")}`

const AttendenceComponent = ({ studentData, classId, subjectName, subjectId}) => {
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [sortOrder, setSortOrder] = useState(null);

  // 🎯 Tích hợp API getAttendanceByClassId khi mở comp
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gọi API lấy dữ liệu điểm danh có sẵn
        const { data: apiData } = await AttendanceService.GetAttendanceByClassAndDate({classId, date: timeStamp, year: schoolYear});
        const attendanceMap = {};
        apiData.forEach((item) => {
          attendanceMap[item.studentsId] = item;
        });

        // Kết hợp dữ liệu studentData với dữ liệu API
        const enhancedData = studentData.map((student) => {
          const attendance = attendanceMap[student.id];
          return {
            ...student,
            absence: attendance
              ? attendance.isExcused
                ? "Có phép"
                : attendance.isUnexcused
                ? "Không phép"
                : "Không"
              : "Không",
            note: attendance ? attendance.attendance_Note : "",
            learning: "", // Nếu có trường learning trong API thì thêm vào đây
            attendanceId: attendance ? attendance.attendance_Id : null,
          };
        });
        setFilteredData(enhancedData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu điểm danh từ API:", error);
        // Nếu lỗi, vẫn giữ dữ liệu mặc định từ studentData
        const fallbackData = studentData.map((student) => ({
          ...student,
          absence: "Không",
          note: "",
          learning: "",
        }));
        setFilteredData(fallbackData);
      }
    };

    fetchData();
  }, [studentData, classId]);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = filteredData.filter(
      (student) =>
        student.code.toLowerCase().includes(value) ||
        student.fullName.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  const handleSort = () => {
    const newOrder = sortOrder === "ascend" ? "descend" : "ascend";
    setSortOrder(newOrder);
    const sortedData = [...filteredData].sort((a, b) =>
      newOrder === "ascend" ? a.code.localeCompare(b.code) : b.code.localeCompare(a.code)
    );
    setFilteredData(sortedData);
  };

  const handleChange = (value, record, field) => {
    const updatedData = filteredData.map((item) =>
      item.id === record.id ? { ...item, [field]: value } : item
    );
    setFilteredData(updatedData);
  };

  const handleDeleteAttendance = (attendanceId) => () => {
    try{
        const {data} = AttendanceService.DeleteAttendanceById(attendanceId);
        toast.success("Xóa điểm danh thành công!");
    }catch (error) {
      console.error("Lỗi khi xóa điểm danh:", error);
      message.error("Đã xảy ra lỗi khi xóa điểm danh. Vui lòng thử lại.");
    }
  }

  const handleSubmit = async () => {
    const attendance = filteredData
      .filter((item) => item.absence !== "Không" || item.note.trim() !== "")
      .map((item) => ({
        isExcused: item.absence === "Có phép",
        isUnexcused: item.absence === "Không phép",
        attendance_Note: item.note,
        studentsId: item.id,
      }));

    const finalData = {
      Attendance_Year: schoolYear,
      Attendance_Semester: semester,
      Attendance_Timestamp: timeStamp,
      Attendance_SubjectName: subjectName,
      Attendance_SubjectId: subjectId,
      Attendance: attendance,
    };

    try {
      const { data } = await AttendanceService.CreateListAttendance(finalData);
      toast.success("Dữ liệu đã được cập nhật!");
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu:", error);
      message.error("Đã xảy ra lỗi khi gửi dữ liệu. Vui lòng thử lại.");
    }
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
      title: "Vắng mặt",
      dataIndex: "absence",
      key: "absence",
      render: (text, record) => (
        <Select
          value={record.absence}
          onChange={(value) => handleChange(value, record, "absence")}
          style={{ width: 120 }}
        >
          <Option value="Không">
            <span style={{ color: "green", fontWeight: 500 }}>Không</span>
          </Option>
          <Option value="Có phép">
            <span style={{ color: "blue", fontWeight: 500 }}>Có phép</span>
          </Option>
          <Option value="Không phép">
            <span style={{ color: "red", fontWeight: 500 }}>Không phép</span>
          </Option>
        </Select>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (text, record) => (
        <Input
          value={record.note}
          onChange={(e) => handleChange(e.target.value, record, "note")}
          placeholder="Nhập ghi chú"
        />
      ),
    },
    {
      title: "Hành động",
      render: (text, record) => (
      <Button style={{color: "red", border: "none"}} onClick={handleDeleteAttendance(record.attendanceId)}>
        <DeleteFilled />
      </Button>
      ),
    }
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Tìm kiếm mã số hoặc tên học sinh..."
          value={searchText}
          onChange={handleSearch}
          allowClear
        />
        <h2 className="mr-2 font-medium text-base italic text-green-600">
          Ngày {currentDate.getDate()} tháng {currentDate.getMonth() + 1} năm {currentDate.getFullYear()}
        </h2>
      </Space>
      <Table columns={columns} dataSource={filteredData} rowKey="id" pagination={{ pageSize: 10 }} />
      <div style={{ marginTop: 16, textAlign: "right" }}>
        <Button type="primary" onClick={handleSubmit}>Gửi</Button>
      </div>
    </div>
  );
};

export default AttendenceComponent;
