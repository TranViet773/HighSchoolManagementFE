import React, { useState, useMemo } from 'react';
import { Card, Select, Row, Col, Button, Table, message } from 'antd';
import ClassService from '../../../services/classService';
import { toast } from 'react-toastify';

const { Option } = Select;

const SelectStudentUpgradeComponent = ({ listClassNextYear, studentNotPassed, year }) => {
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [targetKeys, setTargetKeys] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchClassDataById = async (classId) => {
    try {
      const { data } = await ClassService.getClass(classId);
      const classData = data.data;
      setSelectedClass(classData);

      // Mặc định đưa học sinh đã có vào targetKeys
      const existingIds = (classData.students || []).map((s) => s.id);
      setTargetKeys(existingIds);
    } catch (e) {
      console.log("Có lỗi khi lấy thông tin lớp: ", e);
    }
  };

  const filteredClasses = useMemo(() => {
    if (!selectedGrade) return listClassNextYear;
    return listClassNextYear.filter((cls) => cls.classes_Name.startsWith(selectedGrade));
  }, [listClassNextYear, selectedGrade]);

  const gradeOptions = Array.from(
    new Set(listClassNextYear.map((cls) => cls.classes_Name.slice(0, 2)))
  );

  const leftColumns = [
    { title: 'Tên học sinh', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Mã số', dataIndex: 'code', key: 'code' },
    { title: 'Mã lớp', dataIndex: 'classCode', key: 'classCode' },
    {
      title: 'Trạng thái',
      render: () => 'Chưa nâng lớp',
    }
  ];

  const rightColumns = [
    { title: 'Tên học sinh', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Mã số', dataIndex: 'code', key: 'code' },
    {
      title: 'Trạng thái',
      render: (_, record) =>
        selectedClass?.students?.some((s) => s.id === record.id)
          ? 'Đã có trong lớp'
          : 'Mới thêm',
    }
  ];

  const handleTransfer = () => {
    const newTargets = [...targetKeys, ...selectedRowKeys.filter((k) => !targetKeys.includes(k))];
    setTargetKeys(newTargets);
    setSelectedRowKeys([]);
  };

  const handleRemove = () => {
    const existingIds = selectedClass?.students?.map((s) => s.id) || [];
    const filtered = selectedRowKeys.filter((id) => !existingIds.includes(id)); // không cho xoá học sinh cũ
    const remaining = targetKeys.filter((k) => !filtered.includes(k));
    setTargetKeys(remaining);
    setSelectedRowKeys([]);
  };

  const handleConfirm = async () => {
    if (!selectedClass) {
      message.warning("Vui lòng chọn lớp để nâng.");
      return;
    }

    const existingIds = selectedClass.students?.map(s => s.id) || [];
    const newIdsToAdd = targetKeys.filter(id => !existingIds.includes(id));

    if (newIdsToAdd.length === 0) {
      message.warning("Không có học sinh nào mới để thêm vào lớp.");
      return;
    }

    const selectedStudents = studentNotPassed.filter(s => newIdsToAdd.includes(s.id));
    const studentCodes = selectedStudents.map(s => s.code);
    const classId = selectedClass.classes_Id;

    setLoading(true);
    try {
      const { data, status } = await ClassService.AdvanceClassForStudents(studentCodes, classId, year);
      if (status === 200) {
        toast.success(data.message || "Nâng lớp thành công!");
        fetchClassDataById(classId); // reload lại danh sách học sinh
      } else {
        toast.error(data.message || "Có lỗi xảy ra.");
      }
    } catch (e) {
      toast.error("Lỗi khi nâng lớp học sinh.");
    } finally {
      setLoading(false);
    }
  };

  const renderTransferTable = () => {
    const currentGrade = selectedClass.classes_Name.slice(0, 2);

    const leftData = studentNotPassed.filter(
      (student) =>
        !targetKeys.includes(student.id) && student.classCode.startsWith(currentGrade)
    );

    const rightData = [
      ...studentNotPassed.filter((s) => targetKeys.includes(s.id)),
      ...(selectedClass.students?.filter(
        (s) => !studentNotPassed.some((sp) => sp.id === s.id)
      ) || []),
    ];

    return (
      <>
        <h2 className="text-lg font-semibold mb-4">Bảng phân lớp cho học sinh ở lại</h2>
        <Row gutter={16} align="middle">
          <Col span={11}>
            <Card title="Danh sách học sinh ở lại" style={{ border: '1px solid #d9d9d9' }}>
              <Table
                rowSelection={{
                  selectedRowKeys,
                  onChange: setSelectedRowKeys,
                }}
                rowKey="id"
                dataSource={leftData}
                columns={leftColumns}
                pagination={{ pageSize: 10 }}
                scroll={{ y: 400 }}
              />
            </Card>
          </Col>
          <Col
            span={2}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button onClick={handleTransfer} disabled={selectedRowKeys.length === 0}>{'>'}</Button>
            <Button onClick={handleRemove} disabled={selectedRowKeys.length === 0} style={{ marginTop: 8 }}>{'<'}</Button>
          </Col>
          <Col span={11}>
            <Card title={`Danh sách học sinh lớp "${selectedClass.classes_Code}"`} style={{ border: '1px solid #d9d9d9' }}>
              <Table
                rowSelection={{
                  selectedRowKeys,
                  onChange: setSelectedRowKeys,
                }}
                rowKey="id"
                dataSource={rightData}
                columns={rightColumns}
                pagination={{ pageSize: 10 }}
                scroll={{ y: 400 }}
              />
            </Card>
          </Col>
        </Row>
        <div className="mt-4 text-center">
          <Button type="primary" loading={loading} onClick={handleConfirm}>Xác nhận nâng lớp</Button>
        </div>
      </>
    );
  };

  return (
    <Card title="Chọn lớp để phân bổ học sinh lên lớp">
      {selectedClass ? (
        <>
          <Button
            onClick={() => {
              setSelectedClass(null);
              setTargetKeys([]);
              setSelectedRowKeys([]);
            }}
            style={{ marginBottom: 16 }}
          >
            ← Quay lại danh sách lớp
          </Button>
          {renderTransferTable()}
        </>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-4">
            <span>Chọn khối:</span>
            <Select
              allowClear
              placeholder="Tất cả"
              style={{ width: 120 }}
              value={selectedGrade}
              onChange={(value) => setSelectedGrade(value)}
            >
              {gradeOptions.map((grade) => (
                <Option key={grade} value={grade}>
                  Khối {grade}
                </Option>
              ))}
            </Select>
          </div>

          <Row gutter={[16, 16]}>
            {filteredClasses.map((cls) => (
              <Col xs={24} sm={12} md={8} lg={6} key={cls.classes_Id}>
                <Card
                  hoverable
                  onClick={() => fetchClassDataById(cls.classes_Id)}
                  style={{
                    backgroundColor: 'rgba(0, 0, 255, 0.05)',
                    border: '1px solid #1E40AF',
                    borderRadius: 12,
                    padding: 16,
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  <h3 style={{ color: '#1E40AF', fontWeight: 'bold' }}>{cls.classes_Name}</h3>
                  <p><strong>Mã lớp:</strong> {cls.classes_Code}</p>
                  <p><strong>Sỉ số:</strong> {cls.classes_Quantity || '0'}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </Card>
  );
};

export default SelectStudentUpgradeComponent;
