import React, { useEffect, useState } from 'react'
import { Layout, Select, Input, Segmented, Space, Card } from 'antd'
import SidebarTeacher from '../../../components/SideBarComponent/SideBarTeacher'
import ListStudent from './components/listStudent';
import ClassService from '../../../services/classService';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ScoreTable from './components/ScoreTableComponent';
import SubjectService from '../../../services/subjectService';
const { Content } = Layout;
const { Option } = Select;
const { Search } = Input;
const ClassInformation = () => {
    const {classId, year, subjectId} = useParams();
    const [selectedTab, setSelectedTab] = useState("Danh sách học sinh");
    const [classData, setClassData] = useState([]);

    useEffect(() => {
        fetchClassInfomation();
    },[])

    const fetchClassInfomation = async () =>{
        try{
            //console.log("id: " + id.classId);
            const {data} = await ClassService.getClass(classId);
            const response = await SubjectService.getById(subjectId);
            data.data.subject_Name = response.data.subject_Name;
            data.data.subject_Id = response.data.subject_Id;
            setClassData(data.data);
        }catch(e){
            console.log("Lỗi lấy dữ liệu ra e"+ e);
            toast.error("Có lỗi khi tải dữ liệu. Vui lòng thử lại sau!");
        }
    }
  return (
    <Layout style={{ minHeight: "100vh" }}>
        <SidebarTeacher/>
        <Layout style={{ padding: "20px", background: "#fff" }}>
            <Content>
            <Segmented
                options={["Danh sách học sinh", "Điểm số", "Điểm danh" ]}
                value={selectedTab}
                onChange={setSelectedTab}
              />

            {selectedTab == "Danh sách học sinh" && (
            <>
                <Card style={{ textAlign: "center", marginBottom: 20, marginTop: 20 }}>
                    <Space size={30}>
                    <div><strong>Tên môn học:  </strong><span style={{ fontSize: "1.1rem", color: "blue" }}>{classData.subject_Name}</span></div>
                    <div><strong>Mã lớp:  </strong>{classData.classes_Code}</div>
                    <div><strong>Tên lớp:  </strong>{classData.classes_Name}</div>
                    <div><strong>Năm học:   </strong> {year}</div>
                    <div><strong>Sỉ số lớp:  </strong>{classData?.students?.length}</div>
                    </Space>
                </Card>
                <ListStudent studentData={classData.students}/>
            </>
            )}

            {selectedTab == "Điểm số" && (
            <>
                <Card style={{ textAlign: "center", marginBottom: 20, marginTop: 20 }}>
                    <Space size={30}>
                    <div><strong>Tên môn học:  </strong><span style={{ fontSize: "1.1rem", color: "blue" }}>{classData.subject_Name}</span></div>
                    <div><strong>Mã lớp:  </strong>{classData.classes_Code}</div>
                    <div><strong>Tên lớp:  </strong>{classData.classes_Name}</div>
                    <div><strong>Năm học:  </strong>{year}</div>
                    <div><strong>Sỉ số lớp:  </strong>{classData?.students?.length}</div>
                    </Space>
                </Card>
                <ScoreTable students={classData.students} year={year} subjectId={subjectId}/>
            </>
            )}
            </Content>
        </Layout>
    </Layout>
  )
}

export default ClassInformation
