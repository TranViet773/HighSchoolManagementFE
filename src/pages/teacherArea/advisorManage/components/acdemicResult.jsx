import React, { useEffect, useState } from "react";
import { Table, InputNumber, Card, Typography, Select, Space } from "antd";
import SubjectService from "../../../../services/subjectService";
import { toast } from "react-toastify";
import ScoreService from "../../../../services/scoreService";

const { Title } = Typography;
const { Option } = Select;


const curYear = new Date().getFullYear();
const schoolYear = `${curYear}-${curYear+1}`;
let optionSchoolYear = [
  `${curYear-2}-${curYear-1}`,
  `${curYear-1}-${curYear}`,
  `${curYear}-${curYear+1}`
]

// let evaluation_Result = {

// }

// ---------- Component này cho phép sử dụng XEM điểm của một student có idStudent.
const ScoreTable = ({idStudent}) => {
  const [data, setData] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("1");
  const [selectedYear, setSelectedYear] = useState(schoolYear);
  const [subjects, setSubjects] = useState([]);
  const [scoreBoard, setScoreBoard] = useState([]);
  const [finalAssessment, setFinalAssessment] = useState([]);
  const [resultFinalTerm, setResultFinalTerm] = useState({});

  useEffect(() => {
    fetchSubjects();
    fetchScoreBoard();
    fetchResultFinalTerm();
  }, [selectedSemester, selectedYear]);

  useEffect(() => {
    console.log("Chạy");
    if (
      subjects.length > 0 &&
      scoreBoard?.data?.scoreOfSubjectResponses &&
      scoreBoard.data.scoreOfSubjectResponses.length > 0
    )  {
      //Lấy dữ liệu cuối kỳ
      const finalAssessmentData = [
        {
          avgSemesterScore: scoreBoard.data.avG_Semester_Score,
          classification: scoreBoard.data.classification,
          comment: scoreBoard.data.comment,
          eConduct: scoreBoard.data.eConduct,
          ePerformance: scoreBoard.data.ePerformance,
          grade: scoreBoard.data.grade
        }   
      ];
      setFinalAssessment(finalAssessmentData);
      //merge Subject và Score để hiển thị ra bảng
        const mergedData = subjects.map((subject, index) => {
            const score = scoreBoard.data.scoreOfSubjectResponses.find(s => s.subjectId === subject.subject_Id) || {};
            return {
                key: index.toString(),
                subject_Name: subject.subject_Name,
                subject_Id: subject.subject_Id,
                oral: score.oralScore,
                fifteenMin: score.quizScore,
                onePeriod: score.testScore,
                midTerm: score.midTearmScore,
                finalExam: score.finalExamScore,
                finalAvg:  (score.oralScore + score.quizScore + score.testScore*2 + score.midTearmScore*2 + score.finalExamScore*3)/9 || 0,
                comment: score?.comment,
                comment_UpdateAt: score?.comment_UpdateAt,
            };
        });
        setData(mergedData);
        //console.log(" ád" +mergedData);
    }else{
      setData([]);
    }
  }, [subjects, scoreBoard]);

  const fetchSubjects = async () => {
    try{
      const {data} = await SubjectService.getAll();
      setSubjects(data.data)
    }catch{
      toast.error("Can not get subject list!");
    }
  }

  //Lấy bang diem của học sinh đnag học theo NĂMHỌC - HỌC KỲ 
  const fetchScoreBoard = async () =>{
    try{
      console.log(`Id: ${idStudent} year: ${selectedYear} semester: ${selectedSemester}`);
      const {data, status} = await ScoreService.GetScoreBoard({studentId: idStudent, year: selectedYear, semester: selectedSemester});
      setScoreBoard(data);
      console.log(data)
    }catch(error){
      toast.error("Có lỗi khi tải dữ liệu. Vui lòng thử lại sau!");
    }
  }


  const fetchResultFinalTerm = async () =>{
    try{
      const {data} = await ScoreService.GetResultFinalTerm({studentId: idStudent, year: selectedYear, semester: selectedSemester});
      //console.log(data);
      setResultFinalTerm(data.data);
    }catch{
      
    }
  }
  // Tính điểm trung bình tất cả môn cuối kỳ
  const totalFinalAvg = data.reduce((sum, item) => sum + item.finalAvg, 0) / subjects.length;
  
  const getRank = (avg) => {
    if (avg >= 8.5) return "Giỏi";
    if (avg >= 6.5) return "Khá";
    if (avg >= 5.0) return "Trung Bình";
    return "Yếu";
  };


  const columns = [
    {
      title: <span style={{ color: "#5D9CEC" }}>Môn học</span>,
      dataIndex: "subject_Name",
      key: "subject_Name",
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
      dataIndex: "oral",
      key: "oral",
      render: (text, record) => (
        <InputNumber style={{ color: text < 5 ? "red" : "blue" }} disabled={true} min={0} max={10} step={0.1} value={text} onChange={(value) => handleScoreChange(record.key, "oral", value)} />
      ),
    },
    {
      title: "15 phút",
      dataIndex: "fifteenMin",
      key: "fifteenMin",
      render: (text, record) => (
        <InputNumber style={{ color: text < 5 ? "red" : "blue" }} disabled={true} min={0} max={10} step={0.1} value={text} onChange={(value) => handleScoreChange(record.key, "fifteenMin", value)} />
      ),
    },
    {
      title: "1 tiết",
      dataIndex: "onePeriod",
      key: "onePeriod",
      render: (text, record) => (
        <InputNumber style={{ color: text < 5 ? "red" : "blue" }} disabled={true} min={0} max={10} step={0.1} value={text} onChange={(value) => handleScoreChange(record.key, "onePeriod", value)} />
      ),
    },
    {
      title: "Giữa kỳ",
      dataIndex: "midTerm",
      key: "midTerm",
      render: (text, record) => (
        <InputNumber style={{ color: text < 5 ? "red" : "blue" }} disabled={true} min={0} max={10} step={0.1} value={text} onChange={(value) => handleScoreChange(record.key, "midTerm", value)} />
      ),
    },
    {
      title: "Cuối kỳ",
      dataIndex: "finalExam",
      key: "finalExam",
      render: (text, record) => (
        <InputNumber style={{ color: text < 5 ? "red" : "blue" }} disabled={true} min={0} max={10} step={0.1} value={text} onChange={(value) => handleScoreChange(record.key, "finalExam", value)} />
      ),
    },
    {
      title: "Điểm TB cuối kỳ",
      dataIndex: "finalAvg",
      key: "finalAvg",
      render: (text) => <b>{Number(text || 0).toFixed(2)}</b>,
    },
    {
      title: "Đánh giá từ giáo viên bộ môn",
      dataIndex: "comment",
      key: "comment",
      render: (text) => <b>{text}</b>,
    }
  ];


  const assessmentColumns = [
    {
      title: <span style={{ color: "#5D9CEC" }}>DTB Học kỳ</span>,
      dataIndex: "avgSemesterScore",
      key: "avgSemesterScore",
      onCell: () => ({
        style: {
          fontWeight: "bold",
          textAlign: "center",
        },
      }),
      render: (text) => <span style={{ fontWeight: "bold" }}>{text}</span>,
    },
    {
      title: <span style={{ color: "#5D9CEC" }}>Hạnh Kiểm</span>,
      dataIndex: "eConduct",
      key: "eConduct",
      onCell: () => ({
        style: {
          fontWeight: "bold",
          textAlign: "center",
        },
      }),
      render: (text) => <span style={{ fontWeight: "bold" }}>{text}</span>,
    },
    {
      title: <span style={{ color: "#5D9CEC" }}>Học Lực</span>,
      dataIndex: "ePerformance",
      key: "ePerformance",
      onCell: () => ({
        style: {
          fontWeight: "bold",
          textAlign: "center",
        },
      }),
      render: (text) => <span style={{ fontWeight: "bold" }}>{text}</span>,
    },
    {
      title: <span style={{ color: "#5D9CEC" }}>Xếp loại</span>,
      dataIndex: "classification",
      key: "classification",
      onCell: () => ({
        style: {
          fontWeight: "bold",
          textAlign: "center",
        },
      }),
      render: (text) => <span style={{ fontWeight: "bold" }}>{text}</span>,
    },
    {
      title: <span style={{ color: "#5D9CEC" }}>Xếp Hạng</span>,
      dataIndex: "grade",
      key: "grade",
      onCell: () => ({
        style: {
          fontWeight: "bold",
          textAlign: "center",
        },
      }),
      render: (text) => <span style={{ fontWeight: "bold" }}>{text}</span>,
    },
    {
      title: <span style={{ color: "#5D9CEC" }}>Đánh giá của giáo viên</span>,
      dataIndex: "comment",
      key: "comment",
      onCell: () => ({
        style: {
          fontWeight: "bold",
          textAlign: "center",
        },
      }),
      render: (text) => <span style={{ fontWeight: "bold" }}>{text}</span>,
    }

  ];


  return (
    <Card 
      title={
        <Space size="middle">
          <Title level={4} style={{ marginBottom: 0 }}>Bảng Điểm Học Kỳ</Title>
          <Select value={selectedSemester} onChange={setSelectedSemester} style={{ width: 120 }}>
            <Option value="1">Học kỳ 1</Option>
            <Option value="2">Học kỳ 2</Option>
          </Select>
          <span>Năm học:</span>
          <Select value={selectedYear} onChange={setSelectedYear} style={{ width: 120 }}>
            {optionSchoolYear.map((year, index) => {
              return <Option key={index} value={year}>{year}</Option>
            })}
          </Select>
        </Space>
      }
      className="shadow-md" 
      headStyle={{ backgroundColor: "#B5E7FF", color: "#333", borderRadius: "8px 8px 0 0" }}
    >
      <Table
        columns={columns}
        bordered
        dataSource={[
          ...data,
          // {
          //   key: "summary",
          //   subject: <b>Tổng kết</b>,
          //   finalAvg: <b>{Number(totalFinalAvg || 0).toFixed(2)}</b>,
          // },
        ]}
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

      <div style={{marginTop: "30px", marginBottom: "10%"}}>
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
    </Card>
  );
};

export default ScoreTable;
