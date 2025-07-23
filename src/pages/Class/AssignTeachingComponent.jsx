import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Modal, Tag, Typography, Radio, Space } from 'antd';
import SubjectService from '../../services/subjectService';

const { Title } = Typography;

const colorMap = [
  "blue", "green", "volcano", "magenta", "purple", "orange", "geekblue", "gold"
];

const getColorBySubject = (subjectName) => {
  let hash = 0;
  for (let i = 0; i < subjectName.length; i++) {
    hash = subjectName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colorMap[Math.abs(hash) % colorMap.length];
};

const AssignTeachingComponent = ({ classId, year, semester }) => {
  const [subjectData, setSubjectData] = useState([]);
  const [teachingData, setTeachingData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [teachersBySubject, setTeachersBySubject] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  useEffect(() => {
    fetchSubjects();
    fetchTeachingData();
  }, []);

  const fetchSubjects = async () => {
    try {
      const { data } = await SubjectService.getAll();
      setSubjectData(data.data);
    } catch (e) {
      console.error('Lỗi lấy danh sách môn học:', e);
    }
  };

  const fetchTeachingData = async () => {
    try {
      const { data } = await SubjectService.getTeachingByClass({ classId, year, semester });
      setTeachingData(data.teacherSubjects);
    } catch (e) {
      console.error('Lỗi lấy dữ liệu phân công:', e);
    }
  };

  const fetchTeachingsByTeachers = async () => {
    try {
      const { data } = await SubjectService.getTeachingByTeacher({ year });
      setTeachersBySubject(data);
    } catch (e) {
      console.error('Lỗi lấy dữ liệu giáo viên theo môn:', e);
    }
  };

  const handleOpenPopup = async (subject) => {
    setSelectedSubject(subject);
    await fetchTeachingsByTeachers();
    setShowPopup(true);
  };

  const handleAssignTeacher = async (teacherId) => {
    try {
      const isUpdating = teachingData.some((item) => item.subjectId === selectedSubject.subject_Id);
      const payload = {
        subject_id: selectedSubject.subject_Id,
        teacher_id: teacherId,
        class_id: classId,
        year,
        semester,
      };

      if (isUpdating) {
        await SubjectService.updateTeacherForSubject(payload);
      } else {
        await SubjectService.assignTeacherForSubject(payload);
      }

      setShowPopup(false);
      fetchTeachingData();
    } catch (error) {
      console.error('Lỗi khi gán/cập nhật giáo viên:', error);
    }
  };

  const columns = [
    {
      title: 'STT',
      render: (_, __, index) => index + 1,
      width: 60,
    },
    {
      title: 'Tên môn học',
      dataIndex: 'subject_Name',
    },
    {
      title: 'Giáo viên giảng dạy',
      dataIndex: 'teacherName',
      render: (_, record) => {
        const assigned = teachingData.find((t) => t.subjectId == record.subject_Id);
        return assigned ? assigned.teacherName : '';
      },
    },
    {
      title: 'Thao tác',
      render: (_, record) => (
        <Button type="primary" onClick={() => handleOpenPopup(record)}>
          Cập nhật
        </Button>
      ),
    },
  ];

  const mergedData = subjectData.map((subject) => {
    const assigned = teachingData.find((t) => t.subjectId === subject.subject_Id);
    return {
      ...subject,
      teacherName: assigned ? assigned.teacherName : null,
    };
  });

  return (
    <Card title="Phân công giảng dạy" className="shadow-md rounded-xl">
      <Table
        columns={columns}
        dataSource={mergedData}
        rowKey="subject_Id"
        pagination={false}
        className="rounded-xl"
      />

      <Modal
        title={<Title level={3}>Phân công môn: {selectedSubject?.subject_Name}</Title>}
        open={showPopup}
        onCancel={() => setShowPopup(false)}
        footer={null}
        width={900}
      >
        <Table
          rowKey="teacherId"
          dataSource={teachersBySubject}
          pagination={false}
          columns={[
            {
              title: 'MSGV',
              dataIndex: 'teacherCode',
              width: 100,
            },
            {
              title: 'Tên giáo viên',
              dataIndex: 'teacherName',
              width: 200,
            },
            {
              title: 'Môn giảng dạy',
              render: (_, record) => (
                <Space wrap>
                  {record.teachingByTeacher?.map((item, idx) => (
                    <Tag key={idx} color={getColorBySubject(item.subjectName)}>
                      {item.subjectName} - {item.className}
                    </Tag>
                  ))}
                </Space>
              )
            },
            {
              title: 'Phân công',
              render: (_, record) => (
                <Radio
                  checked={selectedTeacher === record.teacherId}
                  onChange={() => {
                    setSelectedTeacher(record.teacherId);
                    handleAssignTeacher(record.teacherId);
                  }}
                >
                  Chọn
                </Radio>
              )
            }
          ]}
        />
      </Modal>
    </Card>
  );
};

export default AssignTeachingComponent;
