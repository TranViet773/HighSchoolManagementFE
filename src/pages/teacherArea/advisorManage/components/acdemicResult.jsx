import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Table, InputNumber, Card, Typography, Select, Space, Button, Modal, Input } from "antd";
import {EditOutlined} from "@ant-design/icons";
import SubjectService from "../../../../services/subjectService";
import { toast } from "react-toastify";
import ScoreService from "../../../../services/scoreService";
import { getInforJwt } from "../../../../tools/utils";
import EvalutationService from "../../../../services/evaluationService";
import getCurrentYear from "../../../../utils/year.util";

const { schoolYear, listYear, semester } = getCurrentYear();
const { TextArea } = Input;
const { Title } = Typography;
const { Option } = Select;

const role = getInforJwt().role === "TEACHER";
console.log(role);

// ---------- Component này cho phép sử dụng XEM điểm của một student có idStudent.
const ScoreTable = ({idStudent}) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const year = queryParams.get('year');
  const [data, setData] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(semester);
  const [selectedYear, setSelectedYear] = useState(year || schoolYear);
  const [subjects, setSubjects] = useState([]);
  const [scoreBoard, setScoreBoard] = useState([]);
  const [finalAssessment, setFinalAssessment] = useState([]);
  const [resultFinalYear, setResultFinalYear] = useState([]); 
  const [isTeacher, setIsTeacher] = useState(role);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenAllYear, setIsModalOpenYearAllYear] = useState(false);
  const [evaluationText, setEvaluationText] = useState("");

  useEffect(() => {
    fetchSubjects();
    fetchScoreBoard();
    fetchResultFinalYear();
  }, [selectedSemester, selectedYear]);

  useEffect(() => {
    if (
      subjects.length > 0 &&
      scoreBoard?.length > 0
    ) {
      // Merge Subject và Score để hiển thị ra bảng
      const mergedData = subjects.map((subject, index) => {
        const score = scoreBoard.find(s => s.subject_Id === subject.subject_Id) || {};
        return {
          key: index.toString(),
          subject_Name: subject.subject_Name,
          subject_Id: subject.subject_Id,
          OralScore: score.OralScore,
          OralScore1: score.OralScore1,
          OralScore2: score.OralScore2,
          OralScore3: score.OralScore3,
          QuizScore: score.QuizScore,
          QuizScore1: score.QuizScore1,
          QuizScore2: score.QuizScore2,
          QuizScore3: score.QuizScore3,
          TestScore: score.TestScore,
          FinalExamScore: score.FinalExamScore,
          AverageScore: score.AverageScore,
          Comment: score.Comment,
          Comment_Expire: score.Comment_Expire,
          Comment_UpdateAt: score.Comment_UpdateAt,
          ScoringType: score.ScoringType,
          finalSubjectAverageScore: score.FinalAverageSubjectScore,
        };
      });
      setData(mergedData);
    } else {
      setData([]);
    }
  }, [subjects, scoreBoard]);

  const fetchSubjects = async () => {
    try {
      const {data} = await SubjectService.getAll();
      setSubjects(data.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      toast.error("Can not get subject list!");
    }
  };

  const fetchResultFinalYear = async () => {
    try {
      const {data} = await ScoreService.GetResultFinalYear({
        studentId: idStudent, 
        year: selectedYear
      });
      if (data.data != null) {
        console.log(data.data);
        const result = [
          {
            avG_Semester_Score_Final: data.data.avG_Semester_Score_Final,
            classification_Final: data.data.classification_Final,
            comment_Final: data.data.comment_Final,
            eConduct_Final: data.data.eConduct_Final,
            ePerformance_Final: data.data.ePerformance_Final,
            grade_Final: data.data.grade_Final,
          }
        ];
        setResultFinalYear(result);
      }
    } catch (error) {
      console.error("Error fetching final year result:", error);
      toast.error("Can not get final result!");
    }
  };

  // Lấy bang diem của học sinh theo NĂM HỌC - HỌC KỲ 
  const fetchScoreBoard = async () => {
    try {
      console.log(`Id: ${idStudent} year: ${selectedYear} semester: ${selectedSemester}`);
      const {data, status} = await ScoreService.GetScoreBoard({
        studentId: idStudent, 
        year: selectedYear, 
        semester: selectedSemester
      });
      console.log(data)
      if (data?.data) {
        const scoreList = data.data.scoreOfSubjectResponses || [];
        const finalSubjectAverageList = data.data.finalSubjectAverageScore || [];

        // Lấy dữ liệu cuối kỳ
        const finalAssessmentData = [
          {
            avgSemesterScore: data.data.avG_Semester_Score,
            classification: data.data.classification,
            comment: data.data.comment,
            eConduct: data.data.eConduct,
            ePerformance: data.data.ePerformance,
            grade: data.data.grade
          }   
        ];
        console.log(finalAssessmentData);
        setFinalAssessment(finalAssessmentData);

        const mergedData = scoreList.map((item) => {
          const finalScore = finalSubjectAverageList.find(f => f.subjectId === item.subjectId);

          return {
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
            Comment: item?.comment,
            Comment_Expire: item?.comment_Expire,
            Comment_UpdateAt: item?.comment_UpdateAt,
            AverageScore: item?.averageScore,
            ScoringType: item?.scoringType,
            FinalAverageSubjectScore: finalScore?.finalSubjectAverageScore ?? null,
          };
        });

        setScoreBoard(mergedData);
        console.log(mergedData);
      } else {
        setScoreBoard([]);
        setFinalAssessment([]);
      }

    } catch (error) {
      console.error("Error fetching score board:", error);
      toast.error("Có lỗi khi tải dữ liệu. Vui lòng thử lại sau!");
      setScoreBoard([]);
      setFinalAssessment([]);
    }
  };

  const showModal = (semester) => {
    console.log("Show modal for semester:", semester);
    if(semester == 0) {
      setIsModalOpenYearAllYear(true);
    }else{
      setIsModalOpen(true);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalOpenYearAllYear(false);
    setEvaluationText("");
  };

  const handleSave = async (semester) => {
    try {
      console.log(semester);
      const {data} = await EvalutationService.CreateStudentEvaluation({
        studentId: idStudent, 
        year: selectedYear, 
        semester: semester ?? selectedSemester,
        comment: evaluationText
      });
      console.log(data);
      toast.success("Cập nhật thành công!");
      setIsModalOpen(false);
      setEvaluationText("");
      // Refresh data after saving
      fetchScoreBoard();
    } catch (error) {
      console.error("Error saving evaluation:", error);
      toast.error("An error occurred while updating!");
    }
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

  const renderScoreValue = (score, scoringType) => {
    if (score == null || score === "") return "";
    
    if (scoringType) {
      return score >= 0.5 ? "Đ" : "CĐ";
    }
    return score;
  };

  const columns = [
    {
      title: <span style={{ color: "#5D9CEC" }}>Môn học</span>,
      dataIndex: "subject_Name",
      key: "subject_Name",
      fixed: "left",
      width: 200,
      onCell: () => ({
        style: {
          backgroundColor: "#B5E7FF",
          fontWeight: "bold",
          textAlign: "center",
        },
      }),
      render: (text) => <span style={{ fontWeight: "bold" }}>{text}</span>,
    },
    {
      title: "Miệng",
      children: ["", 1, 2, 3].map((index) => ({
        title: index === "" ? "L1" : `L${index + 1}`,
        dataIndex: `OralScore${index}`,
        key: `OralScore${index}`,
        align: "center",
        width: 60,
        render: (text, record) => {
          const score = renderScoreValue(record[`OralScore${index}`], record.ScoringType);
          return (
            <span style={{ color: !record.ScoringType && score < 5 ? "red" : "blue" }}>
              {score}
            </span>
          );
        },
      })),
    },
    {
      title: "15 phút",
      children: ["", 1, 2, 3].map((index) => ({
        title: index === "" ? "L1" : `L${index + 1}`,
        dataIndex: `QuizScore${index}`,
        key: `QuizScore${index}`,
        align: "center",
        width: 60,
        render: (text, record) => {
          const score = renderScoreValue(record[`QuizScore${index}`], record.ScoringType);
          return (
            <span style={{ color: !record.ScoringType && score < 5 ? "red" : "blue" }}>
              {score}
            </span>
          );
        },
      })),
    },
    {
      title: "1 tiết",
      dataIndex: "TestScore",
      key: "TestScore",
      align: "center",
      width: 60,
      render: (text, record) => {
        const score = renderScoreValue(text, record.ScoringType);
        return (
          <span style={{ color: !record.ScoringType && score < 5 ? "red" : "blue" }}>
            {score}
          </span>
        );
      },
    },
    {
      title: "Cuối kỳ",
      dataIndex: "FinalExamScore",
      key: "FinalExamScore",
      align: "center",
      width: 60,
      render: (text, record) => {
        const score = renderScoreValue(text, record.ScoringType);
        return (
          <span style={{ color: !record.ScoringType && score < 5 ? "red" : "blue" }}>
            {score}
          </span>
        );
      },
    },
    {
      title: "Điểm TBM cuối kỳ",
      dataIndex: "AverageScore",
      key: "AverageScore",
      align: "center",
      width: 90,
      render: (text, record) => {
        if (text == null || text === "") return "";
        return (
          <b>
            {record.ScoringType
              ? text >= 0.5
                ? "Đ"
                : "CĐ"
              : Number(text).toFixed(2)}
          </b>
        );
      },
    },
    ...(selectedSemester === 2
      ? [
          {
            title: "Điểm TBM cả năm",
            dataIndex: "FinalAverageSubjectScore",
            key: "FinalAverageSubjectScore",
            align: "center",
            width: 90,
            render: (text, record) => {
              if (text == null || text === "") return "";
              return (
                <b>
                  {record.ScoringType
                    ? text >= 0.5
                      ? "Đ"
                      : "CĐ"
                    : Number(text).toFixed(2)}
                </b>
              );
            },
          },
        ]
      : []),
    {
      title: "Nhận xét từ giáo viên bộ môn",
      dataIndex: "Comment",
      key: "Comment",
      width: 200,
      render: (text) => <i>{text}</i>,
    },
  ];


  const assessmentColumns = [
    {
      title: <span style={{ color: "#5D9CEC" }}>DTB Học kỳ</span>,
      dataIndex: "avgSemesterScore",
      key: "avgSemesterScore",
      align: "center",
      render: (text) => <span style={{ fontWeight: "bold" }}>{Number(text || 0).toFixed(2)}</span>,
    },
    {
      title: <span style={{ color: "#5D9CEC" }}>Rèn luyện</span>,
      dataIndex: "eConduct",
      key: "eConduct",
      align: "center",
      render: (text) => <span style={{ fontWeight: "bold" }}>{getResultConduct(text)}</span>,
    },
    {
      title: <span style={{ color: "#5D9CEC" }}>Học Lực</span>,
      dataIndex: "ePerformance",
      key: "ePerformance",
      align: "center",
      render: (text) => <span style={{ fontWeight: "bold" }}>{getResultDescription(text)}</span>,
    },
    {
      title: <span style={{ color: "#5D9CEC" }}>Khen thưởng</span>,
      dataIndex: "classification",
      key: "classification",
      align: "center",
      render: (text) => <span style={{ fontWeight: "bold" }}>{getResultClassify(text)}</span>,
    },
    {
      title: <span style={{ color: "#5D9CEC" }}>Xếp Hạng</span>,
      dataIndex: "grade",
      key: "grade",
      align: "center",
      render: (text) => <span style={{ fontWeight: "bold" }}>{text}</span>,
    },
    {
      title: <span style={{ color: "#5D9CEC" }}>Nhận xét của giáo viên</span>,
      dataIndex: "comment",
      key: "comment",
      align: "center",
      render: (text) => (
        <span style={{ fontWeight: "bold" }}>
          {isTeacher ? 
            (
              text ? (
                <Space>
                  <span>{text}</span>
                  <EditOutlined onClick={() => showModal(selectedSemester)} style={{ cursor: 'pointer' }} disabled={year}/>  
                </Space>
              ) : <Button type="primary" onClick={() => showModal(selectedSemester)} disabled={year}>Nhận xét</Button>
            )
            : text
          }
        </span>
      ),
    }
  ];

  const assessmentFinalColumns = [
    {
      title: <span style={{ color: "#5D9CEC" }}>DTB Cuối năm</span>,
      dataIndex: "avG_Semester_Score_Final",
      key: "avG_Semester_Score_Final",
      align: "center",
      render: (text) => <span style={{ fontWeight: "bold" }}>{Number(text || 0).toFixed(2)}</span>,
    },
    {
      title: <span style={{ color: "#5D9CEC" }}>Hạnh Kiểm</span>,
      dataIndex: "eConduct_Final",
      key: "eConduct_Final",
      align: "center",
      render: (text) => <span style={{ fontWeight: "bold" }}>{getResultConduct(text)}</span>,
    },
    {
      title: <span style={{ color: "#5D9CEC" }}>Học Lực</span>,
      dataIndex: "ePerformance_Final",
      key: "ePerformance_Final",
      align: "center",
      render: (text) => <span style={{ fontWeight: "bold" }}>{getResultDescription(text)}</span>,
    },
    {
      title: <span style={{ color: "#5D9CEC" }}>Xếp loại</span>,
      dataIndex: "classification_Final",
      key: "classification_Final",
      align: "center",
      render: (text) => <span style={{ fontWeight: "bold" }}>{getResultDescription(text)}</span>,
    },
    {
      title: <span style={{ color: "#5D9CEC" }}>Xếp Hạng</span>,
      dataIndex: "grade_Final",
      key: "grade_Final",
      align: "center",
      render: (text) => <span style={{ fontWeight: "bold" }}>{text}</span>,
    },
    {
      title: <span style={{ color: "#5D9CEC" }}>Nhận xét của giáo viên</span>,
      dataIndex: "comment_Final",
      key: "comment_Final",
      align: "center",
      render: (text) => (
        <span style={{ fontWeight: "bold" }}>
          {isTeacher ? 
            (
              text ? (
                <Space>
                  <span>{text}</span>
                  <EditOutlined onClick={() => showModal(0)} style={{ cursor: 'pointer' }} disabled={year}/>  
                </Space>
              ) : <Button type="primary" onClick={() => showModal(0)} disabled={year}>Nhận xét</Button>
            )
            : text
          }
        </span>
      ),
    }
  ];

  return (
    <>
      <style>
        {`
          .quiz-column {
            background-color: rgb(245, 246, 247);
          }
        `}
      </style>
      <Card 
        title={
          <Space size="middle">
            <Title level={4} style={{ marginBottom: 0 }}>Bảng Điểm Học Kỳ</Title>
            <Select value={selectedSemester} onChange={setSelectedSemester} style={{ width: 120 }}>
              <Option value={1}>Học kỳ 1</Option>
              <Option value={2}>Học kỳ 2</Option>
            </Select>
            <span>Năm học:</span>
            <Select value={selectedYear} onChange={setSelectedYear} style={{ width: 120 }}>
              {listYear.map((year, index) => (
                <Option key={index} value={year}>{year}</Option>
              ))}
            </Select>
          </Space>
        }
        className="shadow-md" 
        headStyle={{ backgroundColor: "#B5E7FF", color: "#333", borderRadius: "8px 8px 0 0" }}
      >
        <Table
          columns={columns}
          bordered
          scroll={{ x: 'max-content' }}
          dataSource={data}
          pagination={false}
          components={{
            header: {
              cell: (props) => (
                <th
                  {...props}
                  style={{
                    backgroundColor: "#B5E7FF",
                    fontWeight: "bold",
                    textAlign: "center",
                    padding: "8px 4px",
                    border: "1px solid #ddd",
                  }}
                />
              ),
            },
          }}
        />

        <div style={{marginTop: "30px", marginBottom: "10%"}}>
          <Title level={5} className="mt-4">Kết quả cuối kỳ</Title>
          <Table 
            columns={assessmentColumns}
            bordered
            dataSource={finalAssessment}
            pagination={false}
            components={{
              header: {
                cell: (props) => (
                  <th
                    {...props}
                    style={{
                      backgroundColor: "#B5E7FF",
                      fontWeight: "bold",
                      textAlign: "center",
                      padding: "10px",
                      border: "1px solid #ddd",
                    }}
                  />
                ),
              },
            }}
          />
        </div>

        {selectedSemester === 2 && resultFinalYear.length > 0 && (
          <div style={{marginTop: "30px", marginBottom: "10%"}}>
            <Title level={5} className="mt-4">Kết quả cuối năm</Title>
            <Table 
              columns={assessmentFinalColumns}
              bordered
              dataSource={resultFinalYear}
              pagination={false}
              scroll={{ x: "100%", y: 100 }}
              components={{
                header: {
                  cell: (props) => (
                    <th
                      {...props}
                      style={{
                        backgroundColor: "#B5E7FF",
                        fontWeight: "bold",
                        textAlign: "center",
                        padding: "10px",
                        border: "1px solid #ddd",
                      }}
                    />
                  ),
                },
              }}
            />
          </div>
        )}

        <div>
          <Button>Xuất phiếu điểm</Button>
        </div>

        <Modal
          title="Nhận xét cuối kỳ"
          open={isModalOpen}
          onCancel={handleCancel}
          onOk={() => handleSave(selectedSemester)}
          okText="Lưu"
          cancelText="Hủy"
        >
          <TextArea
            rows={4} 
            placeholder="Nhập nội dung đánh giá..."
            value={evaluationText}
            onChange={(e) => setEvaluationText(e.target.value)}
          />
        </Modal>
        <Modal
          title="Nhận xét cuối năm"
          open={isModalOpenAllYear}
          onCancel={handleCancel}
          onOk={() => handleSave(0)}
          okText="Lưu"
          cancelText="Hủy"
        >
          <TextArea
            rows={4} 
            placeholder="Nhập nội dung đánh giá..."
            value={evaluationText}
            onChange={(e) => setEvaluationText(e.target.value)}
          />
        </Modal>
      </Card>
    </>
  );
};

export default ScoreTable;