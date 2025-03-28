import React, { useEffect, useState } from "react";
import { Table, Input, Typography, Row, Col, Select, Button } from "antd";
import ScoreService from "../../../../services/scoreService";
import { toast } from "react-toastify";
const { Option } = Select;
const { Title } = Typography;
const currentTime = new Date();

const ScoreTable = ({ students, year, subjectId }) => {
  const [studentData, setStudentData] = useState(students);
  const [selectedSemester, setSelectedSemester] = useState("1");
  //const [sortOrder, setSortOrder] = useState(null);
  const [scores, setScores] = useState();
  const [scoreChanges, setScoreChanges] = useState([]); // dữ liệu khi cập nhật

  useEffect(() => {
    console.log(studentData);
    for( let i = 1; i<3; i++){
      studentData?.map((student, index) => {
        console.log(student);
        InitializeScoreBoard(student.id, year, i);
      });
    }
    
  },[]);

  useEffect(() => {
    fetchScoreOfStudent();
  }, [selectedSemester])

  const InitializeScoreBoard = async (id, year, semester) =>{
    try{
      const {data} = await ScoreService.InitializeScoreBoard({studentId: id, year: year, semester: semester});
    }catch(e){

    }
  }

  const fetchScoreOfStudent = async () =>{
    try{
      let studentIds = [];  
      studentData.map(student => {
        studentIds.push({ studentId: student.id });
      });
      console.log(subjectId);
      const {data} = await ScoreService.GetScoreBySubject({subjectId: subjectId, year: year, semester: selectedSemester, studentIds});
      console.log(data);
      const mergedData = studentData.map((student, index) => {
        const score = data?.data?.scoreOfSubjectResponses.find(s => s.studentId === student.id) || {};
        return{
          id: student.id,
          code: student.code,
          fullName: student.fullName,
          ORALSCORE: score.oralScore,
          QUIZSCORE: score.quizScore,
          TESTSCORE: score.testScore,
          MIDTERMSCORE: score.midTearmScore,
          FINALEXAMSCORE: score.finalExamScore,
          oralScore_Timestamp: score.oralScore_Timestamp,
          oralScore_Expire: score.oralScore_Expire ? new Date(score.oralScore_Expire) : null,
          quizScore_Timestamp: score.quizScore_Timestamp,
          quizScore_Expire: score.quizScore_Expire,
          testScore_Timestamp: score.testScore_Timestamp,
          testScore_Expire: score.testScore_Expire,
          midTermScore_Timestamp: score.midTermScore_Timestamp,
          midTermScore_Expire: score.midTermScore_Expire,
          finalExamScore_Timestamp: score.finalExamScore_Timestamp,
          finalExamScore_Expire: score.finalExamScore_Expire,
          finalEvaluation: score.comment,
          finalEvaluation_Expire: score?.comment_Expire,
          finalEvaluation_Timestamp: score?.comment_UpdateAt,
        }
      });
      console.log(mergedData)
      setScores(mergedData);
    }catch(e){

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
      const {data} = await ScoreService.UpdateScoreOfSubjectByColumn({subjectId: subjectId, year: year, semester: selectedSemester, scores: scoreChanges});
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
      dataIndex: "ORALSCORE",
      key: "ORALSCORE",
      align: "center",
      width: 100,
      sorter: (a, b) => a.code.localeCompare(b.code),
      sortDirections: ["ascend", "descend"],
      render: (text, record) => (
        <Input
          disabled={record.oralScore_Expire != null && currentTime > record.oralScore_Expire}
          type="number"
          min={0}
          max={10}
          step={0.1}
          value={record.ORALSCORE ?? ""}
          onChange={(e) => handleChange(record.id, "ORALSCORE", e.target.value)}
        />
      ),
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
      dataIndex: "QUIZSCORE",
      key: "QUIZSCORE",
      align: "center",
      sorter: (a, b) => a.code.localeCompare(b.code),
      sortDirections: ["ascend", "descend"],
      width: 100,
      width: 100,
      render: (text, record) => (
        <Input
          type="number"
          min={0}
          max={10}
          step={0.1}
          value={record.QUIZSCORE}
          onChange={(e) => handleChange(record.id, "QUIZSCORE", e.target.value)}
        />
      ),
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
      dataIndex: "TESTSCORE",
      key: "TESTSCORE",
      align: "center",
      sorter: (a, b) => a.code.localeCompare(b.code),
      sortDirections: ["ascend", "descend"],
      width: 100,
      width: 100,
      render: (text, record) => (
        <Input
          type="number"
          min={0}
          max={10}
          step={0.1}
          value={record.TESTSCORE}
          onChange={(e) => handleChange(record.id, "TESTSCORE", e.target.value)}
        />
      ),
    },
    {
      title: (
        <>
          Giữa kỳ
          <div style={{fontSize: "12px", fontStyle: "italic", color: "blue", opacity: "0.6"}}>Chỉnh sửa lần cuối</div>
          <div style={{ fontSize: "12px", fontStyle: "italic", color: "green" }}>
            {scores?.length > 0 && scores[scores.length - 1].midTermScore_Timestamp
              ? new Date(scores[scores.length - 1].midTermScore_Timestamp).toLocaleString()
              : "Chưa có dữ liệu"}
          </div>
        </>
      ),
      dataIndex: "MIDTERMSCORE",
      key: "MIDTERMSCORE",
      align: "center",
      sorter: (a, b) => a.code.localeCompare(b.code),
      sortDirections: ["ascend", "descend"],
      width: 100,
      width: 100,
      render: (text, record) => (
        <Input
          type="number"
          min={0}
          max={10}
          step={0.1}
          value={record.MIDTERMSCORE}
          onChange={(e) => handleChange(record.id, "MIDTERMSCORE", e.target.value)}
        />
      ),
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
      dataIndex: "FINALEXAMSCORE",
      key: "FINALEXAMSCORE",
      align: "center",
      sorter: (a, b) => a.code.localeCompare(b.code),
      sortDirections: ["ascend", "descend"],
      width: 100,
      width: 100,
      render: (text, record) => (
        <Input
          type="number"
          min={0}
          max={10}
          step={0.1}
          value={record.FINALEXAMSCORE}
          onChange={(e) => handleChange(record.id, "FINALEXAMSCORE", e.target.value)}
        />
      ),
    },
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
      dataIndex: "finalEvaluation",
      key: "finalEvaluation",
      width: 200,
      render: (text, record) => (
        <Input
          placeholder="Nhận xét"
          value={record.finalEvaluation || ""}
          onChange={(e) => handleChange(record.id, "finalEvaluation", e.target.value)}
        />
      ),
    },
    
  ];

  return (
    <div>
      <Row justify="center" align="middle" style={{ textAlign: "center", marginBottom: 20 }}>
        <Col>
          <Title level={3} style={{ marginBottom: 0, color: "#333" }}>
            BẢNG CHẤM ĐIỂM HỌC SINH
          </Title>
        </Col>
        <Col>
          <Select style={{ width: 120, marginLeft: 20 }} onChange={setSelectedSemester} defaultValue={selectedSemester}>
            <Option value="1">HK1</Option>
            <Option value="2">HK2</Option>
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
      />
      <Row align="stretch" justify="end" className="mt-4">
      <Button color="pink" variant="outlined" className="mr-4">Đặt lại</Button>
      <Button onClick={handleUpdateScore} type="primary">Lưu thay đổi</Button>
    </Row>
    </div>
  );
};

export default ScoreTable;
