import React, {useState, useEffect} from 'react'
import {Card, Segmented, Space} from 'antd';
import ListStudentOfClassComponent from './ListStudentOfClassComponent';
import AttendanceComponent from './AttendanceComponent';
import StatisticalFinalResult from './StatisticalFinalResult';

const DashboardClassAdvisorInfo = ({classInfo}) => {
    const [classData, setClassData] = useState([]);
    const [selectedTab, setSelectedTab] = useState("Danh sách lớp học");
    console.log(classInfo)
  return (
    <Card title={
        <Segmented options={["Danh sách lớp học", "Thống kê kết quả cuối kỳ", "Vắng học"]} value={selectedTab} onChange={(e)=> setSelectedTab(e)}/>
    }>
        <Card style={{ textAlign: "center", marginBottom: 20, marginTop: 20 }}>
            <Space size={30}>
                <div><strong>Mã lớp:  </strong>{classInfo.classes_Code}</div>
                <div><strong>Tên lớp:  </strong>{classInfo.classes_Name}</div>
                <div><strong>Năm học:   </strong> {classInfo.year}</div>
                <div><strong>Sỉ số lớp:  </strong>{classInfo?.classes_Quantity}</div>
            </Space>
        </Card>
        {selectedTab=="Danh sách lớp học" && (
            <ListStudentOfClassComponent students={classInfo.students} year={classInfo.year}/>
        )}
        {selectedTab == "Thống kê kết quả cuối kỳ" && (
            <StatisticalFinalResult classId={classInfo.classes_Id} year={classInfo.year} semester={0}/>
        )}
        {selectedTab == "Vắng học" && (
            <AttendanceComponent classId={classInfo.classes_Id} year={classInfo.year}/>
        )}

    </Card>
  )
}

export default DashboardClassAdvisorInfo
