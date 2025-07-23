import React, { useEffect, useState } from "react";
import { Table } from "antd";
import AttendanceService from "../../../../services/attendanceService";

const AttendanceComponent = ({ classId, year }) => {
  const [attendanceAll, setAttendanceAll] = useState([]);

  useEffect(() => {
    if (classId && year) {
      fetchAttendanceDataAll();
    }
  }, [classId, year]);

  const fetchAttendanceDataAll = async () => {
    try {
      const { data } = await AttendanceService.GetAttendancesByClass({
        classId,
        year,
      });

      const mappedData = data.map((item) => ({
        id: item.attendance_Id,
        code: item.attendance_StudentCode,
        fullName: item.attendance_StudentName,
        withPermission: item.isExcused ? 1 : 0,
        withoutPermission: item.isUnexcused ? 1 : 0,
        date: item.attendance_Timestamp.split("T")[0],
        teacher: item.attendance_Teacher,
        subject: item.attendance_SubjectName,
        note: item.attendance_Note || "",
      }));

      setAttendanceAll(mappedData);
    } catch (error) {
      console.error("Error fetching attendance data for all:", error);
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
      title: "Mã HS",
      dataIndex: "code",
      key: "code",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Tên HS",
      dataIndex: "fullName",
      key: "fullName",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Vắng có phép",
      dataIndex: "withPermission",
      key: "withPermission",
      sorter: (a, b) => a.withPermission - b.withPermission,
    },
    {
      title: "Vắng không phép",
      dataIndex: "withoutPermission",
      key: "withoutPermission",
      sorter: (a, b) => a.withoutPermission - b.withoutPermission,
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      render: (text) => <span className="text-green-600">{text}</span>,
    },
    {
      title: "GV điểm danh",
      dataIndex: "teacher",
      key: "teacher",
    },
    {
      title: "Môn học",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
    },
  ];

  const totalWithPermission = attendanceAll.reduce((sum, d) => sum + d.withPermission, 0);
  const totalWithoutPermission = attendanceAll.reduce((sum, d) => sum + d.withoutPermission, 0);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-left text-gray-800">Bảng điểm danh cả năm</h2>
      <hr className="my-2 border-gray-400" />
      <Table
        columns={columns}
        dataSource={attendanceAll}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        className="border border-gray-400 rounded-md"
      />
      <div className="mt-2 text-right text-sm font-medium text-red-600">
        Tổng vắng có phép: {totalWithPermission} | Không phép: {totalWithoutPermission}
      </div>
    </div>
  );
};

export default AttendanceComponent;
