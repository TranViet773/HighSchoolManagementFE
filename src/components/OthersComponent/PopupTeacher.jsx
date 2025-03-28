import React, { useEffect, useState } from "react";
import { Modal, Input, Table } from "antd";
import StudentService from "../../services/studentService";
const SelectAdvisorPopup = ({ onSelect, onClose }) => {
  const [search, setSearch] = useState("");
  const [teachers, setTeachers] = useState([]);
    useEffect(() => {
        getAllTeacher();
      }, []);

  const getAllTeacher = async () => 
  {
    try {
      const response = await StudentService.GetAll("TEACHER");
      if (response.status === 200) {
        setTeachers(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  }
 
  const filteredTeachers = teachers.filter((teacher) =>
    teacher.fullName.toLowerCase().includes(search.toLowerCase())
  );

 
  const columns = [
    {
      title: "Mã GV",
      dataIndex: "code",
      key: "code",
      width: 80,
      align: "center",
    },
    {
      title: "Tên GV",
      dataIndex: "fullName",
      key: "fullName",
    },
  ];

  return (
    <Modal
      title="Chọn Giáo Viên Cố Vấn"
      open={true}
      onCancel={onClose}
      footer={null}
      width={500}
    >
      
      <Input.Search
        placeholder="Tìm kiếm giáo viên..."
        allowClear
        onChange={(e) => setSearch(e.target.value)}
        className="mb-3"
      />

      
      <Table
        dataSource={filteredTeachers}
        columns={columns}
        rowKey="id"
        pagination={false} 
        scroll={{ y: 300 }}
        onRow={(record) => ({
          onClick: () => {
            onSelect(record); 
            onClose(); 
          },
        })}
        className="cursor-pointer"
      />
    </Modal>
  );
};

export default SelectAdvisorPopup;
