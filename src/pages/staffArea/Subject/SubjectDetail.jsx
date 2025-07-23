import React, { useState, useEffect } from "react";
import { Layout, Typography, Select, Table, Button, Modal, Form } from "antd";
import Sidebar from "../../../components/SideBarComponent/SidebarStaff";
import ClassService from "../../../services/classService";
import { createSessionStorage, useParams } from "react-router-dom";
import SubjectService from "../../../services/subjectService";
import AuthService from "../../../services/authService";
import TeacherService from "../../../services/teacherService";
import StudentService from "../../../services/studentService";
import SelectAdvisorPopup from "../../../components/OthersComponent/PopupTeacher";
import getCurrentYear from "../../../utils/year.util";
const { schoolYear, listYear, semester } = getCurrentYear();
const curYear = new Date().getFullYear();
const { Title } = Typography;
const { Option } = Select;

const SubjectDetailPage = () => {
  const id = useParams();
  const [selectedYear, setSelectedYear] = useState(schoolYear);
  const [selectedClass, setSelectedClass] = useState("10");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subject, setSubject] = useState(null);
  const [isAssign, setIsAssign] = useState(true);
  const [form] = Form.useForm();

  // Fetch dữ liệu khi trang load hoặc khi selectedYear/selectedClass thay đổi
  useEffect(() => {
    fetchSubject(id)
    fetchClasses(selectedClass, selectedYear, id);
    fetchTeachers();  
  }, [selectedYear, selectedClass]);

  const fetchClasses = async (grade, year, id) => {
    try {
      const { data } = await ClassService.getByGrade({ grade, year });
      const classesWithTeachers = await Promise.all(
        data.data.map(async (cls) => {
          try {
            let classId = cls.classes_Id;
            const teacherResponse = await TeacherService.getBySubjectAndClass(id.id,classId);
            if (teacherResponse!=null)
              return { ...cls, teacher: teacherResponse.data.data };
            else{
              return {...cls, teacher: "-" };
            }
          } catch (error) {
            
            return { ...cls, teacher: "-" };
          }
        })
      );
      setClasses(classesWithTeachers);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách lớp:", error);
    }
  };
  
  const fetchTeachers = async () => {
    const {data} = await StudentService.GetAll("TEACHER");
    console.log(data);
    setTeachers(data);
  }

  const fetchSubject = async (id) => {
    const { data } = await SubjectService.getById(id.id);
    setSubject(data);
  }

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  const handleClassClick = (className) => {
    setSelectedClass(className);
  };

  const handleAssignTeacherForSubject = async () => {
    try {
      console.log("Assigning");
      let teacher = form.getFieldValue("selectedTeacher");
      let classSelected = form.getFieldValue("selectClass");
      console.log(`subject: ${id.id} teacher: ${teacher} class: ${classSelected} year: ${selectedYear}`);
      await SubjectService.assignTeacherForSubject({
        subject_id: id.id,
        teacher_id: teacher,
        class_id: classSelected,   // Cập nhật đúng khóa chính
        year: selectedYear
      });
      setShowPopup(false);
      console.log("selectedClass: " + selectedClass);
      fetchClasses(selectedClass, selectedYear, id); // Cập nhật danh sách
    } catch (error) {
      console.error("Lỗi khi gán giáo viên:", error);
    }
  };
  
  const handleUpdateTeacherForSubject = async () => {
    try {
      console.log("Updating");
      let teacher = form.getFieldValue("selectedTeacher");
      let classSelected = form.getFieldValue("selectClass");
      console.log(`subject: ${id.id} teacher: ${teacher} class: ${classSelected} year: ${selectedYear}`);
      await SubjectService.updateTeacherForSubject({
        subject_id: id.id,
        teacher_id: teacher,
        class_id: classSelected,
        year: selectedYear
      });
      setShowPopup(false);
      fetchClasses(selectedClass, selectedYear, id); // Cập nhật danh sách
    } catch (error) {
      console.error("Lỗi khi cập nhật giáo viên:", error);
    }
  };

  const handleDeleteTeacherFromSubject = async () => {
    try {
      console.log("Deleting");
      let teacher = form.getFieldValue("teacherDelete");
      console.log(teacher);
      await SubjectService.deleteTeacherFromSubject({
        subject_id: id.id,
        class_id: form.getFieldValue("selectClass"),
        teacher_id: teacher
      });
      form.resetFields();
      fetchClasses(selectedClass, selectedYear, id); // Cập nhật danh sách
    } catch (error) {
      console.error("Lỗi khi xóa giáo viên:", error);
    }
  }
  

  const handleOpenModal = (record) => {
    setSelectedTeacher(null); 
    setShowPopup(true);
  };
  
  const handleCancel = () => {
    setShowPopup(false);
    form.resetFields();
  };

  const columns = [
    { title: "STT", dataIndex: "index", key: "index", render: (_, __, index) => index + 1 },
    { title: "Tên Lớp", dataIndex: "classes_Name", key: "classes_Name" },
    { title: "Mã Lớp", dataIndex: "classes_Code", key: "classes_Code" },
    { title: "Giáo viên giảng dạy", dataIndex: "teacher_Name", key: "teacher_Name", render: (text) => text || "-" },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) =>
        record.teacher && record.teacher !== "-" ? (
          <>
            <Button type="primary" 
            disabled={selectedYear == schoolYear ? false : true}
            onClick={() => {
                console.log("Class ID:", record.year);
                setIsAssign(false); 
                handleOpenModal(record);
                form.setFieldsValue({ selectClass: record.classes_Id }); 
              }
            }>Sửa
          </Button>
          <Button type="primary" 
            className="ml-2"
            disabled={selectedYear == schoolYear ? false : true}
            danger
            onClick={() => {
                console.log("Class ID:", record.classes_Id);
                form.setFieldsValue({ selectClass: record.classes_Id }); 
                form.setFieldsValue({ teacherDelete: record.teacher_Id });
                
                let teacher = form.getFieldValue("teacherDelete");
                console.log("teacher ID:", teacher);
                handleDeleteTeacherFromSubject();
              }
            }>Xóa
          </Button>
          </>
        ) : (
          <Button type="link" 
            onClick={() => {
                console.log("Class ID:", record.classes_Id); // Kiểm tra giá trị
                setIsAssign(true);
                handleOpenModal(record);
                form.setFieldsValue({ selectClass: record.classes_Id }); 
              }
            }>Thêm
          </Button>
        ),
    },
    
  ];

  const data = classes.map((cls, index) => ({
    key: cls.classes_Id, 
    classes_Id: cls.classes_Id,
    classes_Name: cls.classes_Name,
    classes_Code: cls.classes_Code,
    teacher: cls.teacher,
    teacher_Name: cls.teacher?.fullName ?? "-",
    teacher_Id: cls.teacher?.id ?? null 
  }));
  
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div className="site-layout-content" style={{ width: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", width: "100%" }}>
            <Title level={1}>
              Tên môn học: {subject ? subject.subject_Name : "Đang tải..."}
            </Title>
            <Title level={5} style={{ marginBottom: 10 }}>
              Mã số môn học: {subject ? subject.subject_Id : "Đang tải..."}
            </Title>

            <div style={{ marginBottom: 20 }}>
              <span>Chọn năm học: </span>
              <Select value={selectedYear} onChange={handleYearChange} style={{ width: 120 }}>
                {listYear.map((year) => (
                  <Option key={year} value={year}>
                    {year}
                  </Option>
                ))}
              </Select>
            </div>

            <div>
              <Button type={selectedClass === "10" ? "primary" : "default"} onClick={() => handleClassClick("10")}>
                Khối 10
              </Button>
              <Button type={selectedClass === "11" ? "primary" : "default"} onClick={() => handleClassClick("11")} style={{ marginLeft: 10 }}>
                Khối 11
              </Button>
              <Button type={selectedClass === "12" ? "primary" : "default"} onClick={() => handleClassClick("12")} style={{ marginLeft: 10 }}>
                Khối 12
              </Button>
            </div>
          </div>
          <Table columns={columns} dataSource={data} style={{ marginTop: 20 }} />

        {showPopup && (
        <SelectAdvisorPopup
          onSelect={(record) => {
            form.setFieldValue("selectedTeacher", record.id); 
          }}
          onClose={() => {
            setShowPopup(false);
            console.log(selectedClass);
            isAssign ==  false
              ? handleUpdateTeacherForSubject()
              : handleAssignTeacherForSubject();
          }}
        />
        )}

        </div>
      </Layout>
    </Layout>
  );
};

export default SubjectDetailPage;
