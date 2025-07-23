import React, { useEffect, useState } from 'react';
import { Modal, Button, Table } from 'antd';
import { toast } from "react-toastify";
import StudentService from "../../../services/studentService";
import TeacherService from '../../../services/teacherService';
import ClassService from '../../../services/classService';


const ModalTeacherSelect = ({ visible, onCancel, onSave, classData }) => {
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [teachers, setTeachers] = useState([]); // Khởi tạo là mảng rỗng thay vì null
  const [advisors, setAdvisors] = useState([]); 
  const [mergeData, setMergeData] = useState([]);

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (classData != null) {
      fetchAdvisors();
      console.log(classData)
    }
  }, [classData]);

  const fetchTeachers = async () => {
    try {
      const { data } = await StudentService.GetAll("TEACHER");
      setTeachers(data); // Lưu dữ liệu giáo viên vào state
    } catch {
      toast.error("Lỗi khi tải dữ liệu!");
    }
  };

  const fetchAdvisors = async () => {
    try {
      const { data } = await TeacherService.getAdvisorsInYear(classData.year);
      setAdvisors(data.data); 
    } catch {
      toast.error("Lỗi khi tải dữ liệu chủ nhiệm!");
    }
  };

  const mergeTeacherData = () => {
    if (!teachers || teachers.length === 0 || !advisors || advisors.length === 0) return [];

    return teachers.map((teacher) => {
      // Kiểm tra xem giáo viên có phải là giáo viên chủ nhiệm của lớp không
      const advisor = advisors.find((classItem) => classItem.code === teacher.code);

      return {
        ...teacher,
        className: advisor ? advisor.classCode : '',  // Nếu giáo viên là chủ nhiệm, gán classCode, nếu không để trống
      };
    });
  };

  useEffect(() => {
    if (teachers?.length > 0 && advisors.length > 0) {
      const mergedData = mergeTeacherData(); 
      setMergeData(mergedData); // Lưu dữ liệu đã merge vào state
    }
  }, [teachers, advisors]); // Hàm này sẽ chạy lại khi teachers hoặc advisors thay đổi

  const handleSelectTeacher = (id) => {
    setSelectedTeacherId(id);
  };

  const handleSave = async () => {
    if (selectedTeacherId) {
      try{
        console.log({classId: classData.classes_Id, teacher_Id: selectedTeacherId, year: classData.year, semester: "all"})
        const {data} = await ClassService.UpdateAdvisorForClass({classId: classData.classes_Id, teacher_Id: selectedTeacherId, year: classData.year, semester: "all"});
        console.log(data.code)
        if(data.code == "500"){
          toast.error("Giáo viên được chọn đang chủ nhiệm một lớp khác!");
        }else{
          toast.success("Cập nhật thành công!");
        }
        visible = false
      }catch{
        toast.error("Có lỗi khi cập nhật!");
      }
    }
  };

  const columnsTeacherData = [
    { title: 'MSCB', dataIndex: 'code', key: 'code' },
    { title: 'Tên giáo viên', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Lớp chủ nhiệm', dataIndex: 'className', key: 'className' }
  ];

  const columnsAvailableTeachers = [
    { title: 'Mã giáo viên', dataIndex: 'code', key: 'code' },
    { title: 'Tên giảng viên', dataIndex: 'fullName', key: 'fullName' }
  ];

  return (
    <Modal
      title="Chọn Giáo Viên"
      visible={visible}
      onCancel={onCancel}
      onOk={handleSave}
      okText="Cập nhật"
      width="70%" 
    >
      <div className="flex space-x-4" style={{ width: '100%' }}>
        <div className="flex-1 overflow-y-auto" style={{ maxHeight: '480px', width: '48%' }}>
          <h3 className="font-bold mb-4">Danh sách giáo viên</h3>
          <Table
            columns={columnsTeacherData}
            dataSource={mergeData}
            pagination={false}
            scroll={{ y: 480 }}
            rowKey="code"
            size="middle"
            bordered
            style={{ width: '100%' }} 
          />
        </div>

        {/* Bảng lựa chọn giáo viên */}
        <div className="flex-1 overflow-y-auto" style={{ maxHeight: '480px', width: '48%' }}>
          <h3 className="font-bold mb-4">Lựa chọn giảng viên</h3>
          <Table
            columns={columnsAvailableTeachers}
            dataSource={teachers}
            pagination={false}
            scroll={{ y: 480 }}
            rowKey="code"
            size="middle"
            onRow={(record) => ({
              onClick: () => handleSelectTeacher(record.id)
            })}
            rowClassName={(record) =>
              record.id === selectedTeacherId ? 'bg-blue-100' : ''
            }
            style={{ width: '100%' }} 
          />
        </div>
      </div>
    </Modal>
  );
};

export default ModalTeacherSelect;
