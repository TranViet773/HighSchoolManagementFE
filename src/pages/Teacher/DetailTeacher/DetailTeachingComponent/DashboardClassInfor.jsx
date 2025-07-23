import React, { useEffect, useState } from 'react'
import {Card, Segmented, Space} from 'antd';
import { toast } from 'react-toastify';

import ClassService from '../../../../services/classService';
import SubjectService from '../../../../services/subjectService';
import Title from 'antd/es/skeleton/Title';
import ScoreBoardOfClassComponent from './ScoreBoardOfClassComponent';
import StatisticalsScoreOfClass from '../../../teacherArea/teachingManage/components/StatisticalsScoreOfClass';
const DashboardClassInfor = ({classInfo}) => {
  const [classData, setClassData] = useState([]);
  const [selectedTab, setSelectedTab] = useState("Điểm số");
  useEffect(() => {
    fetchClassInfomation(classInfo.classId);
  }, [])
  
  console.log(classInfo.classId)
  
  const fetchClassInfomation = async () =>{
      try{
          //console.log("id: " + id.classId);
          const {data} = await ClassService.getClass(classInfo.classId);
          const response = await SubjectService.getById(classInfo.subjectId);
          data.data.subject_Name = response.data.subject_Name;
          data.data.subject_Id = response.data.subject_Id;
          setClassData(data.data);
      }catch(e){
          console.log("Lỗi lấy dữ liệu ra e"+ e);
          toast.error("Có lỗi khi tải dữ liệu. Vui lòng thử lại sau!");
      }
  }
  return (
    <Card title={
        <Segmented options={["Điểm số", "Thống kê kết quả cuối kỳ"]} value={selectedTab} onChange={(e)=> setSelectedTab(e)}/>
    }>
        <Card style={{ textAlign: "center", marginBottom: 20, marginTop: 20 }}>
            <Space size={30}>
                <div><strong>Tên môn học:  </strong><span style={{ fontSize: "1.1rem", color: "blue" }}>{classData.subject_Name}</span></div>
                <div><strong>Mã lớp:  </strong>{classData.classes_Code}</div>
                <div><strong>Tên lớp:  </strong>{classData.classes_Name}</div>
                <div><strong>Năm học:   </strong> {classInfo.year}</div>
                <div><strong>Sỉ số lớp:  </strong>{classData?.students?.length}</div>
            </Space>
        </Card>
        {selectedTab=="Điểm số" && (
            <ScoreBoardOfClassComponent classData={classData}/>
        )}
        {selectedTab == "Thống kê kết quả cuối kỳ" && (
            <StatisticalsScoreOfClass classId={classInfo.classId}  semester={1} year={classInfo.year} subjectId={classInfo.subjectId}/>
        )}

    </Card>
  )
}

export default DashboardClassInfor;
