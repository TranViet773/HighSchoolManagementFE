import React, { useEffect, useState } from 'react';
import { Modal, Input, Radio, Checkbox, Button, Select } from 'antd';
import SubjectService from '../../services/subjectService';

const { TextArea } = Input;
const { Option } = Select;

const ReevaluationModal = ({ visible, onCancel, onSubmit, studentData, year, semester }) => {
  const [selectedType, setSelectedType] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [teacherSubjectData, setTeacherSubjectData] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [currentScore, setCurrentScore] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (visible) {
      fetchTeacherSubjects();
      // Reset form state
      setSelectedType(null);
      setConfirm(false);
      setSelectedTeacher(null);
      setCurrentScore('');
      setReason('');
    }
  }, [visible]);

  const fetchTeacherSubjects = async () => {
    try {
      const response = await SubjectService.getTeacherByStudents({
        classId: studentData.classId,
        year,
        semester,
      });
      setTeacherSubjectData(response.data.teacherSubjects);
    } catch (error) {
      console.error('Có lỗi khi lấy dữ liệu giáo viên - môn học:', error);
    }
  };

  const handleOnSubmit = () => {
    if (!selectedTeacher || !selectedType || !currentScore || !reason) {
      alert('Vui lòng điền đầy đủ thông tin trước khi gửi.');
      return;
    }

    const formData = {
      studentsId: studentData.id,
      reevaluation_Year: year,
      reevaluation_Semester: semester,
      subjectsId: selectedTeacher.subjectId,
      teacherId: selectedTeacher.teacherId,
      reevaluation_ScoreColumn: selectedType,
      reevaluation_PreScore: currentScore,
      reevaluation_Reason: reason,
      reevaluation_TimestampRequest: new Date().toISOString(),
      ClassId: studentData.classId,
    };

    onSubmit(formData);
  };

  return (
    <Modal
      title="Phiếu thông tin phúc khảo của học sinh"
      open={visible}
      onCancel={onCancel}
      footer={null}
      centered
    >
      <div className="space-y-4">
        {/* Họ tên & Mã HS */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Họ tên học sinh</label>
            <Input disabled value={studentData?.fullName} style={{ color: 'blue', fontWeight: '500' }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mã học sinh</label>
            <Input disabled value={studentData?.code} style={{ color: 'blue', fontWeight: '500' }} />
          </div>
        </div>

        {/* Năm học & Học kỳ */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Năm học</label>
            <Input disabled value={year} style={{ color: 'blue', fontWeight: '500' }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Học kỳ</label>
            <Input disabled value={semester} style={{ color: 'blue', fontWeight: '500' }} />
          </div>
        </div>

        {/* Môn học & GV */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tên môn học</label>
            <Select
              placeholder="Chọn môn học"
              style={{ width: '100%' }}
              value={selectedTeacher?.subjectId || undefined}
              onChange={(value) => {
                const selected = teacherSubjectData.find((item) => item.subjectId === value);
                setSelectedTeacher(selected || null);
              }}
            >
              {teacherSubjectData?.map((item) => (
                <Option key={item.subjectId} value={item.subjectId}>
                  {item.subjectName}
                </Option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Giáo viên giảng dạy</label>
            <Input
              disabled
              value={selectedTeacher?.teacherName || ''}
              style={{ color: 'blue', fontWeight: '500' }}
            />
          </div>
        </div>

        {/* Cột điểm */}
        <div>
          <label className="block text-sm font-medium mb-1">Cột điểm muốn phúc khảo</label>
          <Radio.Group value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            <div className="grid grid-cols-3 gap-2">
              <Radio value="OralScore">Miệng</Radio>
              <Radio value="QuizScore">15 phút</Radio>
              <Radio value="TestScore">1 Tiết</Radio>
              <Radio value="MidTearmScore">Giữa kỳ</Radio>
              <Radio value="FinalExamScore">Cuối kỳ</Radio>
            </div>
          </Radio.Group>
        </div>

        {/* Ngày & điểm */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Ngày thực hiện</label>
            <Input
              disabled
              value={new Date().toLocaleDateString()}
              style={{ color: 'blue', fontWeight: '500' }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Điểm hiện tại</label>
            <Input
              type="number"
              value={currentScore}
              onChange={(e) => setCurrentScore(e.target.value)}
              placeholder="Nhập điểm hiện tại"
            />
          </div>
        </div>

        {/* Lý do */}
        <div>
          <label className="block text-sm font-medium mb-1">Lý do phúc khảo</label>
          <TextArea
            rows={3}
            placeholder="Nhập lý do phúc khảo"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        {/* Xác nhận */}
        <div>
          <Checkbox checked={confirm} onChange={(e) => setConfirm(e.target.checked)}>
            Tôi xác nhận chịu trách nhiệm về thông tin đã cung cấp
          </Checkbox>
          <p style={{ fontSize: '12px', fontStyle: 'italic', marginLeft: '50px' }}>
            (Lưu ý: Thời gian phúc khảo là 10 ngày kể từ ngày công bố điểm.)
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-2 pt-4">
          <Button onClick={onCancel}>Hủy</Button>
          <Button type="primary" disabled={!confirm} onClick={handleOnSubmit}>
            Gửi
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ReevaluationModal;
