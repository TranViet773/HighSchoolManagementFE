import React, { useEffect, useState } from "react";
import { Table, Typography, Row, Col, Select, Tooltip, Card } from "antd";
import ScoreService from "../../../../services/scoreService";
import getCurrentYear from "../../../../utils/year.util";

const { Title } = Typography;
const { Option } = Select;
const { schoolYear, semester } = getCurrentYear();

const ScoreBoardOfClassComponent = ({ classData }) => {
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [scores, setScores] = useState([]);

  useEffect(() => {
    if (classData?.students?.length > 0) {
      fetchScoreData();
    }
  }, [selectedSemester, classData]);

  const fetchScoreData = async () => {
    try {
      const studentIds = classData.students.map((student) => ({
        studentId: student.id,
      }));
      const { data } = await ScoreService.GetScoreBySubject({
        subjectId: classData.subject_Id,
        year: classData.year,
        semester: selectedSemester,
        studentIds,
      });

      const merged = classData.students.map((student) => {
        const score =
          data?.data?.scoreOfSubjectResponses.find(
            (s) => s.studentId === student.id
          ) || {};
        const finalSubjectAverageScore =
          data?.data?.finalSubjectAverageScore.find(
            (s) => s.studentId === student.id
          ) || {};
        console.log(finalSubjectAverageScore)   
        return {
          id: student.id,
          code: student.code,
          fullName: student.fullName,
          ScoringType: score?.scoringType,
          Comment: score?.comment,
          Comment_UpdateAt: score?.comment_UpdateAt,
          AverageScore: score?.averageScore,
          FinalAverageSubjectScore:
            finalSubjectAverageScore?.finalSubjectAverageScore,

          OralScore: score.oralScore,
          oralScore_Timestamp: score.oralScore_Timestamp,
          OralScore1: score.oralScore1,
          oralScore1_Timestamp: score.oralScore1_Timestamp,
          OralScore2: score.oralScore2,
          oralScore2_Timestamp: score.oralScore2_Timestamp,

          QuizScore: score.quizScore,
          quizScore_Timestamp: score.quizScore_Timestamp,
          QuizScore1: score.quizScore1,
          quizScore1_Timestamp: score.quizScore1_Timestamp,
          QuizScore2: score.quizScore2,
          quizScore2_Timestamp: score.quizScore2_Timestamp,

          TestScore: score.testScore,
          testScore_Timestamp: score.testScore_Timestamp,
          FinalExamScore: score.finalExamScore,
          finalExamScore_Timestamp: score.finalExamScore_Timestamp,
        };
      });

      setScores(merged);
    } catch (e) {
      console.error("Lỗi lấy dữ liệu điểm:", e);
    }
  };

  const renderCellWithTooltip = (value, timestamp) => (
    <Tooltip title={timestamp ? new Date(timestamp).toLocaleString() : "Chưa có thời gian"}>
      <div style={{ textAlign: "center" }}>{value ?? ""}</div>
    </Tooltip>
  );

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      width: 60,
      align: "center",
      render: (text, record, index) => <strong>{index + 1}</strong>,
    },
    {
      title: "Mã số",
      dataIndex: "code",
      key: "code",
      width: 100,
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      width: 200,
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Miệng",
      children: [ "", "1", "2", "3" ].map((suffix, idx) => ({
        title: `Lần ${idx + 1}`,
        dataIndex: `OralScore${suffix}`,
        key: `OralScore${suffix}`,
        align: "center",
        render: (text, record) =>
          renderCellWithTooltip(text, record[`oralScore${suffix}_Timestamp`]),
        width: 60
      })),
    },
    {
      title: "15 phút",
      children: [ "", "1", "2", "3" ].map((suffix, idx) => ({
        title: `Lần ${idx + 1}`,
        dataIndex: `QuizScore${suffix}`,
        key: `QuizScore${suffix}`,
        align: "center",
        render: (text, record) =>
          renderCellWithTooltip(text, record[`quizScore${suffix}_Timestamp`]),
        width: 60,
      })),
    },
    {
      title: "1 tiết",
      dataIndex: "TestScore",
      key: "TestScore",
      align: "center",
      width: 80,
      render: (text, record) =>
        renderCellWithTooltip(text, record.testScore_Timestamp),
    },
    {
      title: "Cuối kỳ",
      dataIndex: "FinalExamScore",
      key: "FinalExamScore",
      align: "center",
      width: 80,
      render: (text, record) =>
        renderCellWithTooltip(text, record.finalExamScore_Timestamp),
    },
    {
      title: "TBM Cuối kỳ",
      dataIndex: "AverageScore",
      key: "AverageScore",
      align: "center",
      width: 80,
      render: (text, record) =>
        record.ScoringType
          ? text >= 0.5 ? "Đạt" : "CĐ"
          : text?.toFixed(2) ?? "",
    },
    ...(selectedSemester === 2
      ? [
          {
            title: "TBM Cả năm",
            dataIndex: "FinalAverageSubjectScore",
            key: "FinalAverageSubjectScore",
            align: "center",
            width: 80,
            render: (text, record) =>
              record.ScoringType
                ? text >= 0.5 ? "Đạt" : "CĐ"
                : text?.toFixed(2) ?? "",
          },
        ]
      : []),
    {
      title: "Nhận xét",
      dataIndex: "Comment",
      key: "Comment",
      render: (text, record) =>
        renderCellWithTooltip(text, record.Comment_UpdateAt),
      width: 200,
    },
  ];

  return (
    <Card title={`Bảng điểm lớp ${classData?.className || ""}`}>
      <Row justify="center" align="middle" style={{ textAlign: "center", marginBottom: 16 }}>
        <Col>
          <Title level={4} style={{ marginBottom: 0, color: "#333" }}>
            Xem bảng điểm học sinh
          </Title>
        </Col>
        <Col>
          <Select
            style={{ width: 120, marginLeft: 20 }}
            onChange={setSelectedSemester}
            defaultValue={selectedSemester}
          >
            <Option value={1}>HK1</Option>
            <Option value={2}>HK2</Option>
          </Select>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={scores}
        rowKey="id"
        pagination={false}
        bordered
        size="small"
        height
        scroll={{ x: "100%", y: 600 }}
        className="text-sm"
        rowClassName={() => "text-sm"} // nhỏ toàn hàng
        />

    </Card>
  );
};

export default ScoreBoardOfClassComponent;
