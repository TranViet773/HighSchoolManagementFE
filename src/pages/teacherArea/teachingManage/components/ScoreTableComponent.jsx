import React, { useEffect, useState } from "react";
import { Table, Input, Typography, Row, Col, Select, Button } from "antd";
import ScoreService from "../../../../services/scoreService";
import { toast } from "react-toastify";
import getCurrentYear from "../../../../utils/year.util";
import ExportExcelButton from "../../../../components/ExportComponent/ExportExcelButton";

const { schoolYear, semester } = getCurrentYear();
const { Option } = Select;
const { Title } = Typography;
const currentTime = new Date();

const ScoreTable = ({ students, year, subject, classData }) => {
  const [studentData, setStudentData] = useState(students);
  const [selectedSemester, setSelectedSemester] = useState(semester);
  //const [sortOrder, setSortOrder] = useState(null);
  const [scores, setScores] = useState();
  const [scoreChanges, setScoreChanges] = useState([]); // dữ liệu khi cập nhật
  const [csvScoreData, setCSVScoreData] = useState([]);

  const headers = [
    { label: "STT", key: "stt" },
    { label: "Mã số", key: "code" },
    { label: "Họ tên", key: "fullName" },
    { label: "Miệng 1", key: "OralScore" },
    { label: "Miệng 2", key: "OralScore1" },
    { label: "Miệng 3", key: "OralScore2" },
    { label: "15p 1", key: "QuizScore" },
    { label: "15p 2", key: "QuizScore1" },
    { label: "15p 3", key: "QuizScore2" },
    { label: "Giữa kỳ", key: "TestScore" },
    { label: "Cuối kỳ", key: "FinalExamScore" },
    { label: "TBM Cuối kỳ", key: "AverageScore" },
    { label: "TB Cả năm", key: "FinalAverageSubjectScore" }
  ];

  useEffect(() => {
    //console.log(studentData);
    for( let i = 1; i<3; i++){
      studentData?.map((student, index) => {
        //console.log(student);
        //InitializeScoreBoard(student.id, year, i);
        InitializeScoreBoardForSubject(student.id, year, i, subject.subjectId);
      });
    }
    
  },[]);

  useEffect(() => {
    fetchScoreOfStudent();
  }, [selectedSemester])

  useEffect(() => {
    if(scores?.length > 0){
      const csvData = scores.map((item, index) => ({
        stt: index + 1,
        code: item.code,
        fullName: item.fullName,
        OralScore: item.OralScore ?? "",
        OralScore1: item.OralScore1 ?? "",
        OralScore2: item.OralScore2 ?? "",
        QuizScore: item.QuizScore ?? "",
        QuizScore1: item.QuizScore1 ?? "",
        QuizScore2: item.QuizScore2 ?? "",
        TestScore: item.TestScore ?? "",
        FinalExamScore: item.FinalExamScore ?? "",
        AverageScore: item.AverageScore?.toFixed(2) ?? "",
        FinalAverageSubjectScore: item.FinalAverageSubjectScore ?? ""
      }));

      console.log(csvData);
      setCSVScoreData(csvData);
    }
  }, scores);


  const InitializeScoreBoardForSubject = async (id, year, semester, subjectId) =>{
    try{
      const {data} = await ScoreService.InitializeScoreBoardForSubject({studentId: id, year: year, semester: semester, subjectId: subjectId});
    }catch(e){
      
    }
  }

  const fetchScoreOfStudent = async () =>{
    try{
      let studentIds = [];  
      studentData.map(student => {
        studentIds.push({ studentId: student.id });
      });
      //console.log(subjectId);
      const {data} = await ScoreService.GetScoreBySubject({subjectId: subject.subjectId, year: year, semester: selectedSemester, studentIds});
      console.log(data);
      const mergedData = studentData.map((student, index) => {
      const score = data?.data?.scoreOfSubjectResponses.find(s => s.studentId === student.id) || {};
      const finalSubjectAverageScore = data?.data?.finalSubjectAverageScore.find(s => s.studentId === student.id) || {};
        
      return{
          id: student.id,
          code: student.code,
          fullName: student.fullName,
          OralScore: score.oralScore,
          OralScore1: score.oralScore1,
          OralScore2: score.oralScore2,
          OralScore3: score.oralScore3,
          QuizScore: score.quizScore,
          QuizScore1: score.quizScore1,
          QuizScore2: score.quizScore2,
          QuizScore3: score.quizScore3,
          TestScore: score.testScore,
          FinalExamScore: score.finalExamScore,
          oralScore_Timestamp: score.oralScore_Timestamp,
          oralScore1_Timestamp: score.oralScore1_Timestamp,
          oralScore2_Timestamp: score.oralScore2_Timestamp,
          oralScore3_Timestamp: score.oralScore3_Timestamp,
          quizScore_Timestamp: score.quizScore_Timestamp,
          quizScore1_Timestamp: score.quizScore1_Timestamp,
          quizScore2_Timestamp: score.quizScore2_Timestamp,
          quizScore3_Timestamp: score.quizScore3_Timestamp,
          testScore_Timestamp: score.testScore_Timestamp,
          finalExamScore_Timestamp: score.finalExamScore_Timestamp,
          Comment: score.comment,
          Comment_Expire: score?.comment_Expire,
          Comment_UpdateAt: score?.comment_UpdateAt,
          AverageScore: score?.averageScore,
          ScoringType: score?.scoringType,
          FinalAverageSubjectScore: finalSubjectAverageScore?.finalSubjectAverageScore
        }
      });
      console.log(mergedData)
      setScores(mergedData);
    }catch(e){
      console.log(e);
    }
  }

  const handleChange = (studentId, column, value) => {
    const newValue = column === "finalEvaluation" ? value : parseFloat(value) || 0;

    // Cập nhật state scores
    setScores((prevScores) =>
      prevScores.map((student) =>
        student.id === studentId ? { ...student, [column]: newValue } : student
      )
    );

    // Cập nhật danh sách thay đổi
    setScoreChanges((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.studentId === studentId && item.column === column
      );

      if (existingIndex !== -1) {
        const updatedScores = [...prev];
        updatedScores[existingIndex] = { 
          studentId, 
          column, 
          ...(column === "finalEvaluation" ? { comment: newValue } : { score: newValue }) 
        };
        return updatedScores;
      } else {
        return [...prev, { 
          studentId, 
          column, 
          ...(column === "finalEvaluation" ? { comment: newValue } : { score: newValue }) 
        }];
      }
    });
};


  const handleUpdateScore = async () =>{
    try{
      console.log("Cập nhật điểm");
      console.log("selectedSemester: " + selectedSemester + " " + year);
      console.log(scoreChanges)
      const {data} = await ScoreService.UpdateScoreOfSubjectByColumn({subjectId: subject.subjectId, year: year, semester: selectedSemester, scores: scoreChanges});
      console.log(data);
      toast.success("Cập nhật điểm thành công!");
    }catch(e){
        toast.error("Lỗi khi cập nhật điểm số!");
        console.log("Lỗi cập nhật điểm: " + e);
    }
  }

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      width: 60,
      align: "center",
      render: (text, record, index) => <strong>{index + 1}</strong>,
      fixed: "left",
    },
    {
      title: "Mã số",
      sorter: (a, b) => a.code.localeCompare(b.code),
      sortDirections: ["ascend", "descend"],
      width: 100,
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      fixed: "left",
      width: 200,
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
      sortDirections: ["ascend", "descend"],
      render: (text) => <strong style={{ color: "#1890ff" }}>{text}</strong>,
    },

    {
      title: (
        <>
          Miệng
          <div style={{fontSize: "12px", fontStyle: "italic", color: "blue", opacity: "0.6"}}>Chỉnh sửa lần cuối</div>
          <div style={{ fontSize: "12px", fontStyle: "italic", color: "green" }}>
            {scores?.length > 0 && scores[scores.length - 1].oralScore_Timestamp
              ? new Date(scores[scores.length - 1].oralScore_Timestamp).toLocaleString()
              : "Chưa có dữ liệu"}
          </div>
        </>
      ),
      children: ['', 1, 2, 3].map((index) => ({
        dataIndex: `OralScore${index}`, // ví dụ: ORALSCORE1, ORALSCORE2, ...
        key: `OralScore${index}`,
        align: "center",
        width: 80,
        render: (text, record) => {
          const timestamp = record[`oralScore${index}_Timestamp`];
          const isDisabled = timestamp
            ? new Date() > new Date(new Date(timestamp).getTime() +  2 * 60 * 1000)
            : false;

          return (
            (
              !record.ScoringType ? (
                <Input
                  className="no-spinner"
                  disabled={isDisabled}
                  type="number"
                  min={0}
                  max={10}
                  step={0.1}
                  value={record[`OralScore${index}`] ?? ""}
                  onChange={(e) => handleChange(record.id, `OralScore${index}`, e.target.value)}
                />
              ) : (
                <Select
                  value={record[`OralScore${index}`] ?? ""}
                  onChange={(e) => handleChange(record.id, `OralScore${index}`, e)}
                  disabled={isDisabled}
                >
                  <Select.Option value={1}>Đ</Select.Option>
                  <Select.Option value={0}>CĐ</Select.Option>
                </Select>
              )
            )
          );
        },
      })),
    },

    {
      title: (
        <>
          15 phút
          <div style={{fontSize: "12px", fontStyle: "italic", color: "blue", opacity: "0.6"}}>Chỉnh sửa lần cuối</div>
          <div style={{ fontSize: "12px", fontStyle: "italic", color: "green" }}>
            {scores?.length > 0 && scores[scores.length - 1].quizScore_Timestamp
              ? new Date(scores[scores.length - 1].quizScore_Timestamp).toLocaleString()
              : "Chưa có dữ liệu"}
          </div>
        </>
      ),
      children: ['', 1, 2, 3].map((index) => ({
        dataIndex: `QuizScore${index}`, // ví dụ: ORALSCORE1, ORALSCORE2, ...
        key: `QuizScore${index}`,
        align: "center",
        width: 75,
        render: (text, record) => {
          const timestamp = record[`quizScore${index}_Timestamp`];
          const isDisabled = timestamp
            ? new Date() > new Date(new Date(timestamp).getTime() + 2 * 60 * 60 * 1000)
            : false;

          return (
            (
              !record.ScoringType ? (
                <Input
                  className="no-spinner"
                  disabled={isDisabled}
                  type="number"
                  min={0}
                  max={10}
                  step={0.1}
                  value={record[`QuizScore${index}`] ?? ""}
                  onChange={(e) => handleChange(record.id, `QuizScore${index}`, e.target.value)}
                />
              ) : (
                <Select
                  value={record[`QuizScore${index}`] ?? ""}
                  onChange={(e) => handleChange(record.id, `QuizScore${index}`, e)}
                  disabled={isDisabled}
                >
                  <Select.Option value={1}>Đ</Select.Option>
                  <Select.Option value={0}>CĐ</Select.Option>
                </Select>
              )
            )
          );
        },
      })),
    },
    {
      title: (
        <>
          1 tiết
          <div style={{fontSize: "12px", fontStyle: "italic", color: "blue", opacity: "0.6"}}>Chỉnh sửa lần cuối</div>
          <div style={{ fontSize: "12px", fontStyle: "italic", color: "green" }}>
            {scores?.length > 0 && scores[scores.length - 1].testScore_Timestamp
              ? new Date(scores[scores.length - 1].testScore_Timestamp).toLocaleString()
              : "Chưa có dữ liệu"}
          </div>
        </>
      ),
      dataIndex: "TestScore",
      key: "TestScore",
      align: "center",
      sorter: (a, b) => a.code.localeCompare(b.code),
      sortDirections: ["ascend", "descend"],
      width: 100,
      render: (text, record) => {
        const timestamp = record.testScore_Timestamp;
        const isDisabled = timestamp
            ? new Date() > new Date(new Date(timestamp).getTime() + 7 * 24 * 60 * 60 * 1000)
            : false;
        return (
          !record.ScoringType ? (
            <Input
              className="no-spinner"
              disabled={isDisabled}
              type="number"
              min={0}
              max={10}
              step={0.1}
              value={record.TestScore}
              onChange={(e) => handleChange(record.id, `TestScore`, e.target.value)}
            />
          ) : (
            <Select
              value={record.TestScore}
              onChange={(e) => handleChange(record.id, `TestScore`, e)}
              disabled={isDisabled}
            >
              <Select.Option value={1}>Đ</Select.Option>
              <Select.Option value={0}>CĐ</Select.Option>
            </Select>
          )
        )
      }
    },
    {
      title: (
        <>
          Cuối kỳ
          <div style={{fontSize: "12px", fontStyle: "italic", color: "blue", opacity: "0.6"}}>Chỉnh sửa lần cuối</div>
          <div style={{ fontSize: "12px", fontStyle: "italic", color: "green" }}>
            {scores?.length > 0 && scores[scores.length - 1].finalExamScore_Timestamp
              ? new Date(scores[scores.length - 1].finalExamScore_Timestamp).toLocaleString()
              : "Chưa có dữ liệu"}
          </div>
        </>
      ),
      dataIndex: "FinalExamScore",
      key: "FinalExamScore",
      align: "center",
      sorter: (a, b) => a.code.localeCompare(b.code),
      sortDirections: ["ascend", "descend"],
      width: 100,
      render: (text, record) =>{
        const timestamp = record.finalEvaluation_Timestamp;
        const isDisabled = timestamp
            ? new Date() > new Date(new Date(timestamp).getTime() + 7 * 24 * 60 * 60 * 1000)
            : false;
        return (
          !record.ScoringType ? (
            <Input
              className="no-spinner"
              disabled={isDisabled}
              type="number"
              min={0}
              max={10}
              step={0.1}
              value={record[`FinalExamScore`] ?? ""}
              onChange={(e) => handleChange(record.id, `FinalExamScore`, e.target.value)}
            />
          ) : (
            <Select
              value={record[`FinalExamScore`] ?? ""}
              onChange={(e) => handleChange(record.id, `FinalExamScore`, e)}
              disabled={isDisabled}
            >
              <Select.Option value={1}>Đ</Select.Option>
              <Select.Option value={0}>CĐ</Select.Option>
            </Select>
          )
        )
      }
    },

    {
      title: (
        <>
          TBM Cuối kỳ
        </>
      ),
      dataIndex: "AverageScore",
      key: "AverageScore",
      align: "center",
      sorter: (a, b) => a?.AverageScore.localeCompare(b?.AverageScore),
      sortDirections: ["ascend", "descend"],
      width: 100,
      render: (text, record) => (
        record.AverageScore ? (
          record.ScoringType == true ? (record.AverageScore >= 0.5 ? "Đạt" : "Chưa Đạt") :(
            record.AverageScore.toFixed(2)
          )
        ) : "Chưa có"
        
      ),
    },
    ...(selectedSemester == 2
      ? [
          {
            title: (
              <>
                TBM Cả năm
              </>
            ),
            dataIndex: "FinalAverageSubjectScore",
            key: "FinalAverageSubjectScore",
            align: "center",
            sorter: (a, b) => a?.FinalAverageSubjectScore.localeCompare(b?.FinalAverageSubjectScore),
            sortDirections: ["ascend", "descend"],
            width: 100,
            render: (text, record) => (
              record.FinalAverageSubjectScore ? (
                record.ScoringType == true ? (record.FinalAverageSubjectScore >= 0.5 ? "Đạt" : "Chưa Đạt") :(
                  record.FinalAverageSubjectScore.toFixed(2)
                )
              ) : "Chưa có"
              
            ),
          },
        ]
      : []),
    {
      title: (
        <>
          Đánh giá cuối kỳ
          <div style={{ fontSize: "12px", fontStyle: "italic", color: "blue", opacity: "0.6" }}>
            Chỉnh sửa lần cuối
          </div>
          <div style={{ fontSize: "12px", fontStyle: "italic", color: "green" }}>
            {scores?.length > 0 && scores[scores.length - 1].finalEvaluation_Timestamp
                ? new Date(scores[scores.length - 1].finalEvaluation_Timestamp).toLocaleString()
                : "Chưa có dữ liệu"}
          </div>
        </>
      ),
      dataIndex: "Comment",
      key: "Comment",
      width: 200,
      render: (text, record) => (
        <Input
          placeholder="Nhận xét"
          disabled={record.finalEvaluation_Expire != null && currentTime > record.finalEvaluation_Expire}
          value={record.Comment || ""}
          onChange={(e) => handleChange(record.id, "Comment", e.target.value)}
        />
      ),
    },
    
  ];

  return (
    <div>
      {/* CSS để ẩn spinner */}
      <style>
        {`
          .no-spinner::-webkit-outer-spin-button,
          .no-spinner::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }

          .no-spinner[type=number] {
            -moz-appearance: textfield;
          }
        `}
      </style>
      <Row justify="center" align="middle" style={{ textAlign: "center", marginBottom: 20 }}>
        <Col>
          <Title level={3} style={{ marginBottom: 0, color: "#333" }}>
            BẢNG CHẤM ĐIỂM HỌC SINH
          </Title>
        </Col>
        <Col>
          <Select style={{ width: 120, marginLeft: 20 }} onChange={setSelectedSemester} defaultValue={selectedSemester}>
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
        scroll={{ x: "100%", y: 800 }}
        sticky
      />
      <Row className="mt-4 flex justify-between items-stretch">
        <div>
          <ExportExcelButton
            data={csvScoreData}
            headers={headers}
            fileName={`bang-cham-diem-${subject.subjectId}-${year}-${selectedSemester}.xlsx`}
            classData={classData}
            subject={subject}
            year={year}
            semester={selectedSemester}
          />
        </div>
        <div>
          <Button color="pink" variant="outlined" className="mr-4">Đặt lại</Button>
          <Button onClick={handleUpdateScore} type="primary">Lưu thay đổi</Button>
        </div>
      </Row>
    </div>
  );
};

export default ScoreTable;
