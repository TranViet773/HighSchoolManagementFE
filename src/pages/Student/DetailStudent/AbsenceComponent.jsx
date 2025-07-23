import React, { useState, useEffect } from "react";
import { Card, Divider, Table, Typography, Tag } from "antd";
import AttendanceService from "../../../services/attendanceService";

const { Title, Text } = Typography;

const AbsenceComponent = ({ studentId, listYear }) => {
  const [absenceData, setAbsenceData] = useState([]);
    //listYear = ['2023-2024', '2024-2025', '2025-2026']; // Example list of years, replace with actual data if needed 
  useEffect(() => {
    fetchAbsenteData();
  }, []);

  const fetchAbsenteData = async () => {
    try {
      const response = await AttendanceService.GetAllAbsenceOfStudent(studentId, listYear);
      setAbsenceData(response.data);
      console.log("Absence data fetched:", response.data);
    } catch (error) {
      console.error("Error fetching absence data:", error);
    }
  };

  const renderAbsenceTable = (yearData) => {
    const { year, absent } = yearData;

    const columns = [
      {
        title: "STT",
        render: (_, __, index) => index + 1,
        width: 50,
      },
      {
        title: "Môn học",
        dataIndex: "attendance_SubjectName",
        key: "attendance_SubjectName",
      },
      {
        title: "Học kỳ",
        dataIndex: "attendance_Semester",
        key: "attendance_Semester",
        width: 80,
      },
      {
        title: "Ngày giờ nghỉ",
        dataIndex: "attendance_Timestamp",
        key: "attendance_Timestamp",
        render: (timestamp) => {
          const date = new Date(timestamp);
          return date.toLocaleString("vi-VN", {
            dateStyle: "short",
            timeStyle: "short",
          });
        },
      },
      {
        title: "Giáo viên điểm danh",
        dataIndex: "attendance_Teacher",
        key: "attendance_Teacher",
        render: (text, record) => text || `ID: ${record.attendance_MarkedBy}`,
      },
      {
        title: "Học sinh",
        key: "student",
        render: (_, record) => (
          <>
            <div><Text strong>{record.attendance_StudentName}</Text></div>
            <div><Text type="secondary">{record.attendance_StudentCode}</Text></div>
          </>
        ),
      },
      {
        title: "Ghi chú",
        dataIndex: "attendance_Note",
        key: "attendance_Note",
      },
      {
        title: "Loại nghỉ",
        key: "type",
        render: (_, record) => {
          if (record.isExcused) return <Tag color="green">Có phép</Tag>;
          if (record.isUnexcused) return <Tag color="red">Không phép</Tag>;
          return <Tag color="default">Không rõ</Tag>;
        },
      },
    ];

    const totalExcused = absent.filter((a) => a.isExcused).length;
    const totalUnexcused = absent.filter((a) => a.isUnexcused).length;

    return (
      <div key={year}>
        <Title level={4}>Năm học: {year}</Title>
        <Table
          dataSource={absent}
          columns={columns}
          rowKey="attendance_Id"
          pagination={false}
          bordered
        />
        <div style={{ marginTop: 8 }}>
          <Text strong>Tổng số buổi nghỉ:</Text>{" "}
          <Tag color="green">Có phép: {totalExcused}</Tag>{" "}
          <Tag color="red">Không phép: {totalUnexcused}</Tag>
        </div>
        <Divider />
      </div>
    );
  };

  return (
    <Card title="Thông tin nghỉ học">
      {absenceData.length === 0 ? (
        <Text type="secondary">Chưa có thông tin nghỉ học.</Text>
      ) : (
        absenceData.map((yearData) => renderAbsenceTable(yearData))
      )}
    </Card>
  );
};

export default AbsenceComponent;
