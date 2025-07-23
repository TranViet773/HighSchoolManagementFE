import React, { useEffect, useState } from "react";
import { Card, Table, Typography, Divider, Tag } from "antd";
import ReevaluationService from "../../../services/reevaluationService";

const { Title, Text } = Typography;

const ReevaluationComponent = ({ studentId, listYear }) => {
  const [reevaluationData, setReevaluationData] = useState([]);

  useEffect(() => {
    fetchReevaluationData();
  }, []);

  const fetchReevaluationData = async () => {
    try {
      const response = await ReevaluationService.GetAllReevaluationOfStudent(
        studentId,
        listYear
      );
      setReevaluationData(response.data || []);
      console.log("Reevaluation data fetched:", response.data);
    } catch (error) {
      console.error("Error fetching Reevaluation data:", error);
    }
  };

  const renderReevaluationTable = (yearData) => {
    const { year, reevaluations } = yearData;

    const columns = [
      {
        title: "STT",
        render: (_, __, index) => index + 1,
        width: 50,
      },
      {
        title: "Môn học",
        dataIndex: "subjectName",
        key: "subjectName",
      },
      {
        title: "Học kỳ",
        dataIndex: "reevaluation_Semester",
        key: "reevaluation_Semester",
        width: 80,
      },
      {
        title: "Cột điểm",
        dataIndex: "reevaluation_ScoreColumn",
        key: "reevaluation_ScoreColumn",
      },
      {
        title: "Điểm trước",
        dataIndex: "reevaluation_PreScore",
        key: "reevaluation_PreScore",
      },
      {
        title: "Điểm sau",
        dataIndex: "reevaluation_AfterScore",
        key: "reevaluation_AfterScore",
      },
      {
        title: "Lý do",
        dataIndex: "reevaluation_Reason",
        key: "reevaluation_Reason",
      },
      {
        title: "Ngày yêu cầu",
        dataIndex: "reevaluation_TimestampRequest",
        key: "reevaluation_TimestampRequest",
        render: (timestamp) =>
          new Date(timestamp).toLocaleString("vi-VN", {
            dateStyle: "short",
            timeStyle: "short",
          }),
      },
      {
        title: "Trạng thái",
        dataIndex: "reevaluation_Status",
        key: "reevaluation_Status",
        render: (status) => {
          switch (status) {
            case 1:
              return <Tag color="blue">Chờ duyệt</Tag>;
            case 2:
              return <Tag color="orange">Đã chỉnh sửa</Tag>;
            case 5:
              return <Tag color="green">Đã duyệt</Tag>;
            case 6:
              return <Tag color="red">Từ chối</Tag>;
            default:
              return <Tag color="default">Không rõ</Tag>;
          }
        },
      },
      {
        title: "Giáo viên duyệt",
        dataIndex: "teacherName",
        key: "teacherName",
        render: (text, record) =>
          text || `ID: ${record.reevaluation_ApporverId}`,
      },
    ];

    return (
      <div key={year}>
        <Title level={4}>Năm học: {year}</Title>
        <Table
          dataSource={reevaluations}
          columns={columns}
          rowKey="reevaluation_Id"
          pagination={false}
          bordered
        />
        <Divider />
      </div>
    );
  };

  return (
    <Card title="Thông tin khiếu nại điểm">
      {reevaluationData.length === 0 ? (
        <Text type="secondary">Chưa có thông tin khiếu nại.</Text>
      ) : (
        reevaluationData.map((yearData) => renderReevaluationTable(yearData))
      )}
    </Card>
  );
};

export default ReevaluationComponent;
