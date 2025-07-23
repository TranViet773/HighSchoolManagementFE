import React, { useEffect, useState } from "react";
import { Card, Typography, Table, Select } from "antd";
import SubjectService from "../../../services/subjectService";
import ScoreService from "../../../services/scoreService";
import getCurrentYear from "../../../utils/year.util";

const { Title } = Typography;
const { schoolYear, semester, listYear } = getCurrentYear();
const { Option } = Select;

const ScoreBoardComponent = ({ studentId, year }) => {
  const [data, setData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [finalAssessment, setFinalAssessment] = useState([]);
  const [resultFinalYear, setResultFinalYear] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(semester);
  const [selectedYear, setSelectedYear] = useState(year[0]);
  console.log(year);
  // Fetch subjects once
  useEffect(() => {
    fetchSubjects();
  }, []);

  // Fetch scores when subjects and filters change
  useEffect(() => {
    if (subjects.length > 0) {
      fetchScoreBoard();
      fetchResultFinalYear();
    }
  }, [selectedYear, selectedSemester, subjects]);

  const fetchSubjects = async () => {
    try {
      const res = await SubjectService.getAll();
      setSubjects(res.data.data || []);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const fetchScoreBoard = async () => {
    try {
      const res = await ScoreService.GetScoreBoard({
        studentId,
        year: selectedYear,
        semester: selectedSemester,
      });
      console.log("ScoreBoard Response:", res.data);
      const response = res.data?.data;

      if (response) {
        const scoreList = response.scoreOfSubjectResponses || [];
        const finalSubjectAverageList = response.finalSubjectAverageScore || [];

        const finalAssessmentData = [
          {
            avgSemesterScore: response.avG_Semester_Score,
            eConduct: response.eConduct,
            ePerformance: response.ePerformance,
            classification: response.classification,
            grade: response.grade,
            comment: response.comment,
          },
        ];
        setFinalAssessment(finalAssessmentData);

        const mergedData = scoreList.map((item) => {
          const finalScore = finalSubjectAverageList.find(
            (f) => f.subjectId === item.subjectId
          );

          return {
            key: item.subjectId,
            subject_Name: item?.subjects?.subject_Name,
            subject_Id: item?.subjects?.subject_Id,
            OralScore: item?.oralScore,
            OralScore1: item?.oralScore1,
            OralScore2: item?.oralScore2,
            OralScore3: item?.oralScore3,
            QuizScore: item?.quizScore,
            QuizScore1: item?.quizScore1,
            QuizScore2: item?.quizScore2,
            QuizScore3: item?.quizScore3,
            TestScore: item?.testScore,
            FinalExamScore: item?.finalExamScore,
            AverageScore: item?.averageScore,
            ScoringType: item?.scoringType,
            Comment: item?.comment,
            FinalAverageSubjectScore: finalScore?.finalSubjectAverageScore ?? null,
          };
        });

        setData(mergedData);
      }
    } catch (error) {
      console.error("Error fetching score board:", error);
    }
  };

  const fetchResultFinalYear = async () => {
    try {
      const res = await ScoreService.GetResultFinalYear({
        studentId,
        year: selectedYear,
      });
      console.log("Final Year Result Response:", res.data);
      const result = res.data?.data;
      if (result) {
        setResultFinalYear([result]);
      }
    } catch (error) {
      console.error("Error fetching final year result:", error);
    }
  };

  const renderScoreValue = (score, scoringType) => {
    if (score == null || score === "") return "";
    return scoringType ? (score >= 0.5 ? "Đ" : "CĐ") : score;
  };

    const getResultDescription = (value) => {
    switch (value) {
      case 0:
        return "Chưa Có";
      case 1:
        return "Chưa đạt";
      case 2:
        return "Đạt";
      case 3:
        return "Khá";
      case 4:
        return "Tốt";
      default:
        return "Không xác định";
    }
  };

    const getResultClassify = (value) => {
    switch (value) {
      case 0:
        return "-";
      case 1:
        return "Giỏi";
      case 2:
        return "Xuất sắc";
      default:
        return "Không xác định";
    }
  };

  const getResultConduct = (value) => {
    switch (value) {
      case 0:
        return "-";
      case 1:
        return "Chưa đạt";
      case 2:
        return "Đạt ";
      case 3:
        return "Khá";
      case 4:
        return "Tốt";
      default:
        return "Không xác định";
    }
  };
  console.log(data)
  const columns = [
    {
      title: "Môn học",
      dataIndex: "subject_Name",
      key: "subject_Name",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Miệng",
      children: ["", 1, 2, 3].map((index) => ({
        title: index === "" ? "L1" : `L${index + 1}`,
        dataIndex: `OralScore${index}`,
        key: `OralScore${index}`,
        render: (text, record) => (
          <span>{renderScoreValue(record[`OralScore${index}`], record.ScoringType)}</span>
        ),
      })),
    },
    {
      title: "15 phút",
      children: ["", 1, 2, 3].map((index) => ({
        title: index === "" ? "L1" : `L${index + 1}`,
        dataIndex: `QuizScore${index}`,
        key: `QuizScore${index}`,
        render: (text, record) => (
          <span>{renderScoreValue(record[`QuizScore${index}`], record.ScoringType)}</span>
        ),
      })),
    },
    {
      title: "1 tiết",
      dataIndex: "TestScore",
      render: (text, record) => <span>{renderScoreValue(text, record.ScoringType)}</span>,
    },
    {
      title: "Cuối kỳ",
      dataIndex: "FinalExamScore",
      width: 80,
      render: (text, record) => <span>{renderScoreValue(text, record.ScoringType)}</span>,
    },
    {
      title: "Điểm TBM cuối kỳ",
      dataIndex: "AverageScore",
      width: 100,
      render: (text, record) =>
        <b>{record.ScoringType ? (text >= 0.5 ? "Đ" : "CĐ") : text ? Number(text).toFixed(2) : ""}</b>,
    },
    ...(selectedSemester === 2
      ? [{
          title: "TBM cả năm",
          dataIndex: "FinalAverageSubjectScore",
          width: 100,
          render: (text, record) =>
            <b>{record.ScoringType ? (text >= 0.5 ? "Đ" : "CĐ") : text}</b>,
        }]
      : []),
    {
      title: "Nhận xét",
      dataIndex: "Comment",
      width: 200,
      render: (text) => <i>{text}</i>,
    },
  ];

  return (
    <Card
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Title level={5} style={{ margin: 0 }}>Bảng điểm</Title>
          <Select
            value={selectedYear}
            style={{ width: 120 }}
            onChange={setSelectedYear}
          >
            {year.map((y) => (
              <Option key={y} value={y}>{y}</Option>
            ))}
          </Select>
          <Select
            value={selectedSemester}
            style={{ width: 120 }}
            onChange={setSelectedSemester}
          >
            <Option value={1}>Học kỳ 1</Option>
            <Option value={2}>Học kỳ 2</Option>
          </Select>
        </div>
      }
      style={{ marginTop: 20 }}
    >
      <Table
        size="small"
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{ x: "max-content" }}
        bordered
      />

      {finalAssessment.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <Title level={5}>Tổng kết học kỳ</Title>
          <Table
            size="small"
            columns={[
              {
                title: "DTB HK",
                dataIndex: "avgSemesterScore",
                width: 120,
                render: (text) => <b>{Number(text).toFixed(2)}</b>,
              },
              { title: "Rèn luyện", dataIndex: "eConduct", width: 120,render: (text) => getResultConduct(text) },
              { title: "Học lực", dataIndex: "ePerformance", width: 120,render: (text) => getResultDescription(text) },
              { title: "Khen thưởng", dataIndex: "classification", width: 120,render: (text) => getResultClassify(text) },
              { title: "Xếp hạng", dataIndex: "grade", width: 120},
              {
                title: "Nhận xét",
                dataIndex: "comment",
                render: (text) => <i>{text}</i>,
              },
            ]}
            dataSource={finalAssessment}
            pagination={false}
            bordered
          />
        </div>
      )}

      {selectedSemester === 2 && resultFinalYear.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <Title level={5}>Tổng kết năm học</Title>
          <Table
            size="small"
            columns={[
              {
                title: "DTB cả năm",
                dataIndex: "avG_Semester_Score_Final",
                render: (text) => <b>{Number(text).toFixed(2)}</b>,
              },
              { title: "Rèn luyện", dataIndex: "eConduct_Final", render: (text) => getResultConduct(text) },
              { title: "Học lực", dataIndex: "ePerformance_Final", render: (text) => getResultDescription(text) },
              { title: "Khen thưởng", dataIndex: "classification_Final", render: (text) => getResultClassify(text) },
              { title: "Xếp hạng", dataIndex: "grade_Final" },
              {
                title: "Nhận xét",
                dataIndex: "comment_Final",
                render: (text) => <i>{text}</i>,
              },
            ]}
            dataSource={resultFinalYear}
            pagination={false}
            bordered
          />
        </div>
      )}
    </Card>
  );
};

export default ScoreBoardComponent;
