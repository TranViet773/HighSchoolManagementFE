import { Modal, Button, Row, Col, Tag, Table, Transfer, Flex } from 'antd';
import { useState, useEffect } from 'react';
import ClassService from '../../../services/classService';
import { toast } from 'react-toastify';

const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
  <Transfer {...restProps} showSelectAll={false}>
    {({
      direction,
      filteredItems,
      onItemSelect,
      onItemSelectAll,
      selectedKeys,
      disabled: listDisabled,
    }) => {
      const columns = direction === 'left' ? leftColumns : rightColumns;
      const rowSelection = {
        getCheckboxProps: () => ({ disabled: listDisabled }),
        onChange: (selectedRowKeys) => {
          onItemSelectAll(selectedRowKeys, 'replace');
        },
        selectedRowKeys: selectedKeys,
        selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
      };
      return (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredItems}
          size="small"
          pagination={{ pageSize: 10 }}
          style={{ pointerEvents: listDisabled ? 'none' : undefined }}
          onRow={({ key, disabled: itemDisabled }) => ({
            onClick: () => {
              if (itemDisabled || listDisabled) return;
              onItemSelect(key, !selectedKeys.includes(key));
            },
          })}
        />
      );
    }}
  </Transfer>
);

const UpdateStudentModal = ({ open, onClose, students, currentClass }) => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [targetKeys, setTargetKeys] = useState([]);
  const [allClasses, setAllClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [originalSelectedClassStudents, setOriginalSelectedClassStudents] = useState([]);
  const [originalCurrentClassStudents, setOriginalCurrentClassStudents] = useState([]);

  useEffect(() => {
    handleGetAllClassData();
  }, []);

  useEffect(() => {
    if (students) {
      setOriginalCurrentClassStudents(students.map(s => s.id.toString()));
    }
  }, [students]);

  const handleGetAllClassData = async () => {
    try {
      const { data } = await ClassService.getAll(currentClass.year);
      setAllClasses(data.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchClassDetail = async (id) => {
    try {
      const { data } = await ClassService.getClass(id);
      setSelectedClass(data.data);
      const originalStudents = data.data.students.map((s) => s.id.toString());
      setOriginalSelectedClassStudents(originalStudents);
      setTargetKeys(originalStudents);
    } catch (error) {
      toast.error("Không thể tải thông tin lớp!");
    }
  };

  const handleSelectClass = (cls) => {
    fetchClassDetail(cls.classes_Id);
  };

  const handleTransferChange = (nextTargetKeys) => {
    setTargetKeys(nextTargetKeys);
  };

  const resetAll = () => {
    setSelectedClass(null);
    setTargetKeys([]);
    setOriginalSelectedClassStudents([]);
    setOriginalCurrentClassStudents([]);
  };

  const handleChangesStudentToClass = async () => {
    if (!selectedClass) return;

    setLoading(true);
    try {
      const studentsToSelectedClass = targetKeys.filter(studentId => 
        originalCurrentClassStudents.includes(studentId)
      );

      const studentsToCurrentClass = originalSelectedClassStudents.filter(studentId => 
        !targetKeys.includes(studentId)
      );

      const getStudentCodeById = (studentId) => {
        const currentStudent = students.find(s => s.id.toString() === studentId);
        if (currentStudent) return currentStudent.code;
        const selectedStudent = selectedClass.students.find(s => s.id.toString() === studentId);
        if (selectedStudent) return selectedStudent.code;
        return null;
      };

      if (studentsToSelectedClass.length > 0) {
        const studentCodes = studentsToSelectedClass.map(getStudentCodeById).filter(code => code !== null);
        if (studentCodes.length > 0) {
          await ClassService.changeStudentsToClass(
            studentCodes, 
            selectedClass.classes_Id, 
            currentClass.year
          );
        }
      }

      if (studentsToCurrentClass.length > 0) {
        const studentCodes = studentsToCurrentClass.map(getStudentCodeById).filter(code => code !== null);
        if (studentCodes.length > 0) {
          await ClassService.changeStudentsToClass(
            studentCodes, 
            currentClass.classes_Id, 
            currentClass.year
          );
        }
      }

      toast.success("Cập nhật học sinh thành công!");
      onClose();
      resetAll();

    } catch (error) {
      toast.error("Cập nhật học sinh sang lớp khác thất bại!");
      console.error('Error updating students to class:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = () => {
    handleChangesStudentToClass();
  };

  const allStudentData = [
    ...students.map((s) => ({
        key: s.id.toString(),
        title: s.fullName,
        code: s.code,
        gender: s.gender,
        classCode: currentClass.classes_Code,
    })),
    ...(selectedClass?.students || []).map((s) => ({
        key: s.id.toString(),
        title: s.fullName,
        code: s.code,
        gender: s.gender,
        classCode: selectedClass.classes_Code,
    })),
  ];

  const deduplicatedStudentData = Object.values(
    allStudentData.reduce((acc, cur) => {
      acc[cur.key] = cur;
      return acc;
    }, {})
  );

  const columns = [
    {
        dataIndex: 'code',
        title: 'Mã HS',
    },
    {
        dataIndex: 'title',
        title: 'Họ tên',
    },
    {
        dataIndex: 'gender',
        title: 'Giới tính',
        render: (g) => <Tag color={g === 'Male' ? 'blue' : 'pink'}>{g === 'Male' ? 'Nam' : 'Nữ'}</Tag>,
    },
    {
        dataIndex: 'classCode',
        title: 'Lớp',
        render: (classCode, record) => {
        const isCurrent = students.some((s) => s.id.toString() === record.key);
        const color = isCurrent ? 'green' : 'purple';
        return <Tag color={color}>{classCode}</Tag>;
        },
    },
  ];

  return (
    <Modal
      title="Cập nhật học sinh sang lớp khác"
      open={open}
      onCancel={() => {
        onClose();
        resetAll();
      }}
      footer={null}
      width={1000}
    >
      {!selectedClass ? (
        <Row gutter={[8, 8]}>
          {allClasses
            .filter((cls) => cls.classes_Id !== currentClass?.classes_Id)
            .map((cls) => (
                <Col span={4} key={cls.classes_Id}>
                <Button block onClick={() => handleSelectClass(cls)}>
                    {cls.classes_Code} - Sĩ số: {cls.classes_Quantity}
                </Button>
                </Col>
            ))}
        </Row>
      ) : (
        <Flex vertical gap="middle">
          <TableTransfer
            dataSource={deduplicatedStudentData}
            targetKeys={targetKeys}
            onChange={handleTransferChange}
            leftColumns={columns}
            rightColumns={columns}
            titles={["Lớp hiện tại", `Lớp ${selectedClass.classes_Code}`]}
            filterOption={(input, item) =>
              item.title.toLowerCase().includes(input.toLowerCase()) ||
              item.code.toLowerCase().includes(input.toLowerCase())
            }
            showSearch
          />

          <Flex gap="small">
            <Button 
              type="primary" 
              onClick={handleUpdate} 
              loading={loading}
              disabled={targetKeys.length === 0}
            >
              Cập nhật
            </Button>
            <Button onClick={resetAll} disabled={loading}>
              Chọn lại lớp
            </Button>
          </Flex>
        </Flex>
      )}
    </Modal>
  );
};

export default UpdateStudentModal;