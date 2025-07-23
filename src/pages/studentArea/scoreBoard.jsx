import React, { useState, useEffect } from 'react';
import { Layout, Card, Table, Select, Typography, Segmented, InputNumber, Button  } from 'antd';
import PrintScoreBoardOptions from './components/printScoreBoardOption';
import { getInforJwt } from '../../tools/utils';
import ScoreService from '../../services/scoreService';
import SubjectService from '../../services/subjectService';
import getCurrentYear from '../../utils/year.util';
import { ExceptionOutlined } from '@ant-design/icons'
import ReevaluationModal from '../../components/OthersComponent/ReEvaluationModal';
import AuthService from '../../services/authService';
import { toast } from 'react-toastify';
import ReevaluationService from '../../services/reevaluationService';

const { Title } = Typography;
const { Option } = Select;
const { schoolYear, listYear, semester } = getCurrentYear();



const id = getInforJwt().Id;
const ScoreBoard = () => {
  const [selectedSemester, setSelectedSemester] = useState(semester);
  const [selectedYear, setSelectedYear] = useState(schoolYear)
  const [view, setView] = useState("Bảng điểm");
  const [subjects, setSubjects] = useState(null);
  const [scoreBoard, setScoreBoard] = useState(null);
  const [data, setData] = useState([]);
  const [finalAssessment, setFinalAssessment] = useState([]);
  const [resultFinalYear, setResultFinalYear] = useState([]); 
  const [modalVisible, setModalVisible] = useState(false)
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    fetchStudentData();
  }, []);
  
  useEffect(() => {
      fetchSubjects();
      fetchScoreBoard();
      fetchResultFinalYear();
    }, [selectedSemester, selectedYear]);
  
  useEffect(() => {
    if (
      subjects?.length > 0 &&
      scoreBoard?.data?.scoreOfSubjectResponses &&
      scoreBoard?.data.scoreOfSubjectResponses.length > 0
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
                OralScore: score.oralScore,
                OralScore1: score.oralScore1,
                OralScore2: score.oralScore2,
                OralScore3: score.oralScore3,
                QuizScore: score.quizScore,
                TestScore: score.testScore,
                FinalExamScore: score.finalExamScore,
                AverageScore: score?.averageScore?.toFixed(2),
                comment: score?.comment,
                comment_UpdateAt: score?.comment_UpdateAt,
                scoringType: score?.scoringType
            };
        });
        setData(mergedData);
        //console.log(" ád" +mergedData);
    }else{
      setData([]);
      setFinalAssessment([])
    }
  }, [subjects, scoreBoard]);

  const fetchStudentData = async () => {
    try{
      const {data} = await AuthService.getById(id);
      console.log(data);
      setStudentData(data);
    }catch{
      toast.error("Lỗi khi lấy thông tin người dùng!");
    }
  }
  const fetchResultFinalYear = async () => {
    try{
      const {data} = await ScoreService.GetResultFinalYear({studentId: id, year: selectedYear});
      if(data.data!=null){
        console.log(data.data)
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
        setResultFinalYear(result)
      }
     
    }catch{
      toast.error("Can not get final result!");
    }
  }

  const fetchSubjects = async () => {
    try{
      const {data} = await SubjectService.getAll();
      setSubjects(data.data)
    }catch{
      toast.error("Can not get subject list!");
    }
  }

  const fetchScoreBoard = async () =>{
    try{
      // console.log(`Id: ${id} year: ${selectedYear} semester: ${selectedSemester}`);
      const {data, status} = await ScoreService.GetScoreBoard({studentId: id, year: selectedYear, semester: selectedSemester});
      setScoreBoard(data);
      console.log(data)
    }catch(error){
      toast.error("Có lỗi khi tải dữ liệu. Vui lòng thử lại sau!");
    }
  }

  const getResultDescription = (value) => {
    switch (value) {
      case 0:
        return "Chưa Có";
      case 1:
        return "Giỏi";
      case 2:
        return "Khá";
      case 3:
        return "Trung bình";
      case 4:
        return "Yếu";
      default:
        return "Không xác định"; // Đảm bảo trường hợp không hợp lệ
    }
  };

  const handleOpenReevaluationModal = () => {
    setModalVisible(true);
  }

  const handleCreateReevaluation = async (formData) => {
    try{
      console.log({formData});
      const {data} = await ReevaluationService.CreateReevaluation(formData);
      console.log(data);
      toast.success("Tạo đơn phúc khảo thành công!");
    }catch{
      toast.error("Có lỗi khi tạo đơn phúc khảo!");
    }
  }

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
      children: ['', 1, 2, 3].map((index) => ({
        dataIndex: `OralScore${index}`, // ví dụ: ORALSCORE1, ORALSCORE2, ...
        key: `OralScore${index}`,
        align: "center",
        width: 80,
        render: (text, record) => (
          record.scoringType == false ? (
            <span style={{ color: record[`OralScore${index}`] < 5 ? "red" : "blue" }}>
              {record[`OralScore${index}`]}
            </span>
          ) : (
            <span style={{ color: record[`OralScore${index}`] < 0.5 ? "red" : "blue" }}>
              {record[`OralScore${index}`] < 0.5 ? "CĐ" : "Đ"}
            </span>
          )
        )
      }))
    },
    {
      title: "15 phút",
      dataIndex: "fifteenMin",
      key: "fifteenMin",
      render: (text) => (
        <span style={{ color: text < 5 ? "red" : "blue" }}>{text}</span>
      ),
    },
    {
      title: "1 tiết",
      dataIndex: "onePeriod",
      key: "onePeriod",
      render: (text) => (
        <span style={{ color: text < 5 ? "red" : "blue" }}>{text}</span>
      ),
    },
    {
      title: "Giữa kỳ",
      dataIndex: "midTerm",
      key: "midTerm",
      render: (text) => (
        <span style={{ color: text < 5 ? "red" : "blue" }}>{text}</span>
      ),
    },
    {
      title: "Cuối kỳ",
      dataIndex: "finalExam",
      key: "finalExam",
      render: (text) => (
        <span style={{ color: text < 5 ? "red" : "blue" }}>{text}</span>
      ),
    },
    {
      title: "Điểm TB cuối kỳ",
      dataIndex: "averageScore",
      key: "averageScore",
      render: (text) => (
        <span style={{ color: text < 5 ? "red" : "blue" }}>{text}</span>
      ),
    },
    {
      title: "Đánh giá từ giáo viên bộ môn",
      dataIndex: "comment",
      key: "comment",
      render: (text) => <b>{text}</b>,
    },
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
      render: (text) => <span style={{ fontWeight: "bold" }}>{Number.parseFloat(text).toFixed(2)}</span>,
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
      render: (text) => <span style={{ fontWeight: "bold" }}>{getResultDescription(text)}</span>,
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
      render: (text) => <span style={{ fontWeight: "bold" }}>{getResultDescription(text)}</span>,
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
      render: (text) => <span style={{ fontWeight: "bold" }}>{getResultDescription(text)}</span>,
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
      render: (text) => <span style={{ fontWeight: "bold" }}>
          {text}
        </span>,
    }
  ];

  const assessmentFinalYearColumns = [
    {
      title: <span style={{ color: "#5D9CEC" }}>DTB Học kỳ</span>,
      dataIndex: "avG_Semester_Score_Final",
      key: "avG_Semester_Score_Final",
      onCell: () => ({
        style: {
          fontWeight: "bold",
          textAlign: "center",
        },
      }),
      render: (text) => <span style={{ fontWeight: "bold" }}>{Number.parseFloat(text).toFixed(2)}</span>,
    },
    {
      title: <span style={{ color: "#5D9CEC" }}>Hạnh Kiểm</span>,
      dataIndex: "eConduct_Final",
      key: "eConduct_Final",
      onCell: () => ({
        style: {
          fontWeight: "bold",
          textAlign: "center",
        },
      }),
      render: (text) => <span style={{ fontWeight: "bold" }}>{getResultDescription(text)}</span>,
    },
    {
      title: <span style={{ color: "#5D9CEC" }}>Học Lực</span>,
      dataIndex: "ePerformance_Final",
      key: "ePerformance_Final",
      onCell: () => ({
        style: {
          fontWeight: "bold",
          textAlign: "center",
        },
      }),
      render: (text) => <span style={{ fontWeight: "bold" }}>{getResultDescription(text)}</span>,
    },
    {
      title: <span style={{ color: "#5D9CEC" }}>Xếp loại</span>,
      dataIndex: "classification_Final",
      key: "classification_Final",
      onCell: () => ({
        style: {
          fontWeight: "bold",
          textAlign: "center",
        },
      }),
      render: (text) => <span style={{ fontWeight: "bold" }}>{getResultDescription(text)}</span>,
    },
    {
      title: <span style={{ color: "#5D9CEC" }}>Xếp Hạng</span>,
      dataIndex: "grade_Final",
      key: "grade_Final",
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
      dataIndex: "comment_Final",
      key: "comment_Final",
      onCell: () => ({
        style: {
          fontWeight: "bold",
          textAlign: "center",
        },
      }),
      render: (text) => <span style={{ fontWeight: "bold" }}>
          {text}
        </span>,
    }
  ];

  const column = [
    { title: "ĐTB Cả Học Kỳ", dataIndex: "avgSemester", key: "avgSemester" },
    { title: "Học Lực", dataIndex: "ranking", key: "ranking" },
    { title: "Hạnh Kiểm", dataIndex: "conduct", key: "conduct" },
    { title: "Xếp Loại", dataIndex: "classification", key: "classification" },
    { title: "Xếp Hạng", dataIndex: "position", key: "position" },
    { title: "Đánh Giá Cuối Năm", dataIndex: "evaluation", key: "evaluation" },
  ];

  return (
    <Layout className="flex justify-center p-5 min-h-screen" style={{backgroundColor: "#E8F4FF"}}>
      <Layout style={{ padding: "20px", maxWidth: "100%", margin: "0 auto", backgroundColor: "#E8F4FF", marginBottom: "30vh" }}>
        <Card className="shadow-lg rounded-xl hover:shadow-xl p-4 bg-white">
          <Segmented
              options={["Bảng điểm", "Xác nhận in bảng điểm"]}
              value={view}
              onChange={setView}
              className="mb-4"
            />

          {view === "Bảng điểm" ? (
            <>
            <Title level={4} className="text-center">Bảng điểm học sinh</Title>
            <div className="relative mb-4">
              {/* Icon nằm sát lề phải */}
              
                <ExceptionOutlined
                  style={{ fontSize: 22, color: 'blue' }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 transition transform hover:scale-110 duration-300"
                  onClick={handleOpenReevaluationModal}
                />

              {/* Dropdown giữ nguyên ở giữa */}
              <div className="flex justify-center space-x-4">
                <Select value={selectedYear} onChange={setSelectedYear} style={{ width: 150 }}>
                  {listYear.map((item, index) => (
                    <Option value={item} key={index}>{item}</Option>
                  ))}
                </Select>
                <Select value={selectedSemester} onChange={setSelectedSemester} style={{ width: 150, marginLeft: 2 }}>
                  <Option value="1">Học kỳ 1</Option>
                  <Option value="2">Học kỳ 2</Option>
                </Select>
              </div>
            </div>

        
              <Table 
                columns={columns} 
                dataSource={data} 
                pagination={false} 
                bordered 
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

              <Title level={5} className="mt-4">Kết quả cuối kỳ</Title>
              <Table
                dataSource={finalAssessment}
                columns={assessmentColumns}
                pagination={false}
                bordered
              />
              {
                selectedSemester == "2" ?
                (<>
                    <Title level={5} className="mt-4">Kết quả cả năm</Title>
                      <Table
                        dataSource={resultFinalYear}
                        columns={assessmentFinalYearColumns}
                        pagination={false}
                        bordered
                      />
                </>) : (<></>)
              }
            </>
            ) : (
              <div style={{width: "47vw", height: "30vh", paddingBottom: "300px"}}>
                 <PrintScoreBoardOptions/>
              </div>
          )}
        </Card>
        <ReevaluationModal 
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          onSubmit={handleCreateReevaluation}
          studentData={studentData}
          year = {selectedYear}
          semester = {selectedSemester}
        />
      </Layout>
    </Layout>
  );
};

export default ScoreBoard;