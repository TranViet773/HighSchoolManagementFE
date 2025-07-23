import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Table,
  Select,
  Button,
  Modal,
  Radio,
  message,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ClassService from '../../../services/classService';
const { Option } = Select;

const UpgradeClassComponent = ({ classesData = [], newClassData = [], schoolYear }) => {
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [filteredClasses, setFilteredClasses] = useState(classesData);
  const [classesInNextYear, setClassesInNextYear] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOldClass, setSelectedOldClass] = useState(null);
  const [selectedNewClassId, setSelectedNewClassId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setFilteredClasses(classesData);
  }, [classesData]);

  const handleGradeFilter = (value) => {
    setSelectedGrade(value);
    if (!value) {
      setFilteredClasses(classesData);
    } else {
      const filtered = classesData.filter((cls) =>
        cls.classes_Name?.startsWith(value)
      );
      setFilteredClasses(filtered);
    }
  };

  console.log(classesData)
  useEffect(() => {
    fetchClassNextYear();
  }, [isModalOpen]);

  const fetchClassNextYear = async () => {
    try {
        const parts = schoolYear.split("-");
        const nextYear =
            parts.length === 2
                ? `${parseInt(parts[0]) + 1}-${parseInt(parts[1]) + 1}`
                : null;
        if (!nextYear) {
            toast.error("Năm học không hợp lệ!");
            return;
        }

        const { data } = await ClassService.getAll(nextYear);
        setClassesInNextYear(data.data || []);
        //console.log(data);
    } catch (error) {
        message.error("Lỗi khi tải danh sách lớp học!");
    } finally {
        setLoading(false);
    }
  };

  const handleCreateNewNextClass = async () => {
  try {
    const listCodeClass = classesData.map(cls => cls.classes_Code);
    const { data } = await ClassService.CreateClassToAdvance({
      listCodeClass,
      year: schoolYear
    });

    toast.success("Tạo lớp mới để nâng lớp thành công!");
    // Có thể fetch lại danh sách lớp năm kế tiếp nếu muốn
    fetchClassNextYear(); 
  } catch (error) {
    console.error(error);
    toast.error("Tạo lớp mới thất bại!");
  }
};


  const openModal = (oldClass) => {
    setSelectedOldClass(oldClass);
    setSelectedNewClassId(null);
    setIsModalOpen(true);
  };

  const handleAssign = async () => {
  if (!selectedNewClassId) {
    message.warning('Vui lòng chọn lớp mới để nâng lớp');
    return;
  }

  try {
    const { data, status } = await ClassService.AdvanceStudentToNextClass({
      oldClassId: selectedOldClass.classes_Id,
      newClassId: selectedNewClassId,
      year: schoolYear
    });

    if (data?.code === "200") {
      toast.success("Nâng lớp thành công!");
      setIsModalOpen(false);
      // Optional: refresh danh sách học sinh nếu cần
    } else {
      toast.error("Lỗi khi nâng lớp: " + (data?.message || "Không xác định"));
    }
  } catch (error) {
    console.error(error);
    toast.error("Lỗi hệ thống khi nâng lớp!");
  }
};


  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Tên Lớp',
      dataIndex: 'classes_Name',
      key: 'classes_Name',
      render: (text, record) => (
        <a onClick={() => navigate(`/admin/class/${record.classes_Id}`)}>
          {text}
        </a>
      ),
    },
    {
      title: 'Mã Lớp',
      dataIndex: 'classes_Code',
      key: 'classes_Code',
    },
    {
      title: 'Số lượng',
      dataIndex: 'classes_Quantity',
      key: 'classes_Quantity',
    },
    {
      title: 'Nâng lớp',
      key: 'classes_NextClassId',
      render: (_, record) => (
        record.cLasses_NextClassId ? (
          <span>{record.cLassess_NextClassId || 'Đã chọn lớp'}</span>
        ) : (
          <Button type="link" onClick={() => openModal(record)}>
            Chọn lớp
          </Button>
        )
      ),
    }

  ];

  return (
    <>
      <Card title="Danh sách lớp hiện tại">
        <Row gutter={16} align="middle" style={{ marginBottom: '20px' }}>
          <Col>
            <Select
              allowClear
              placeholder="Chọn khối"
              style={{ width: 150 }}
              onChange={handleGradeFilter}
              value={selectedGrade}
            >
              <Option value="10">Khối 10</Option>
              <Option value="11">Khối 11</Option>
              <Option value="12">Khối 12</Option>
            </Select>
          </Col>
          <Col>
            <Button type="primary" onClick={handleCreateNewNextClass}>Tạo mới các lớp để nâng lớp</Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredClasses}
          rowKey="classes_Id"
          loading={loading}
          pagination={{ pageSize: 50 }}
        />
      </Card>

      <Modal
        title={`Phân lớp cho "${selectedOldClass?.classes_Name}"`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleAssign}
        okText="Phân lớp"
        cancelText="Hủy"
        width={700}
        >
        <Table
            dataSource={classesInNextYear.filter(cls => {
            if (!selectedOldClass) return false;

            // Lấy khối từ lớp hiện tại (VD: "10A1" -> "10")
            const oldGrade = selectedOldClass.classes_Name.match(/^\d+/)?.[0];
            const nextGrade = oldGrade ? (parseInt(oldGrade) + 1).toString() : null;

            return cls.classes_Name.startsWith(nextGrade);
            })}
            rowKey="classes_Id"
            pagination={false}
            loading={loading}
            rowSelection={{
            type: 'radio',
            selectedRowKeys: selectedNewClassId ? [selectedNewClassId] : [],
            onChange: (selectedRowKeys) => {
                setSelectedNewClassId(selectedRowKeys[0]);
            },
            }}
            columns={[
            {
                title: 'STT',
                key: 'index',
                render: (_, __, index) => index + 1,
            },
            {
                title: 'Tên lớp',
                dataIndex: 'classes_Name',
                key: 'classes_Name',
            },
            {
                title: 'Mã lớp',
                dataIndex: 'classes_Code',
                key: 'classes_Code',
            },
            {
                title: 'Số lượng',
                dataIndex: 'classes_Quantity',
                key: 'classes_Quantity',
            },
            ]}
        />
        </Modal>

    </>
  );
};

export default UpgradeClassComponent;
