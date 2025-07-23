import React, {useState, useEffect} from 'react';
import { Table, Card, Typography, Select } from 'antd';
import ScoreService from '../../../../services/scoreService';
import ExportClassYearlyReportExcel from '../../../../components/ExportComponent/ExportClassYearlyReportExcel';

const { Title } = Typography;
const { Option } = Select;

const conductMap = {
  EXCELENT: 'Tốt',
  GOOD: 'Khá',
  AVERAGE: 'Đạt',
  WEAK: 'Chưa đạt',
};

const classifyMap = {
  EXCELENT: 'Xuất sắc',
  GOOD: 'Giỏi'
};

const FinalResultComponent = ({ classId, semester, year, classInfo }) => {
  const [studentData, setStudentData] = useState([]);
  const [finalResult, setFinalResult] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(semester || 0);

  useEffect(() => {
    featchData();
  }, [selectedSemester]);

  const featchData = async () => {
    try {
      const { data, error } = await ScoreService.GetFinalResultStudentsInClass({ classId, semester: selectedSemester, year });
      console.log("Final Result Data:", data);
      if (error) {
        console.error("Error fetching final results:", error);
      } else {
        setStudentData(data.data.studentData);
        setFinalResult(data.data.finalResult);
      }
    } catch (error) {
      console.error("An error occurred while fetching final results:", error);
    }
  };

  const columns = [
    { title: 'STT', dataIndex: 'stt', key: 'stt' },
    { title: 'Mã số', dataIndex: 'studentCode', key: 'studentCode' },
    { title: 'Họ và tên', dataIndex: 'studentName', key: 'studentName' },
    { title: 'ĐTB', dataIndex: 'avG_Semester_Score', key: 'avG_Semester_Score', render: (v) => v.toFixed(2) || '-' },
    { title: 'Rèn luyện', dataIndex: 'conduct', key: 'conduct', render: (value) => conductMap[value] || '-' },
    { title: 'Học lực', dataIndex: 'performance', key: 'performance', render: (value) => conductMap[value] || '-' },
    { title: 'Hạng', dataIndex: 'rank', key: 'rank' },
    { title: 'Lên lớp', dataIndex: 'lenlop', key: 'lenlop', render: (v) => v || '-' },
    { title: 'Khen thưởng', dataIndex: 'classify', key: 'classify', render: (v) => classifyMap[v] || '-' },
    {
      title: 'Nghỉ',
      key: 'nghi',
      render: (_, record) => `Có phép: ${record.quantityOfAbsentWithPermission}, Không phép: ${record.quantityOfAbsentWithoutPermission}`,
    },
  ];

  const formattedData = studentData?.map((s, index) => ({
    key: s.studentId,
    stt: index + 1,
    ...s,
  }));

  const getPercentage = (count) => studentData?.length > 0 ? ((count / studentData?.length) * 100).toFixed(1) + '%' : '0%';

  const getCountAndPercent = (items, targetName) => {
    const item = items?.find(i => i.name === targetName);
    const count = item?.count || 0;
    const percent = getPercentage(count);
    return `${count}/${studentData?.length || 0}  --  ${percent}`;
  };

  const getAvgScore = () => {
    if (!studentData?.length) return '-';
    const total = studentData.reduce((sum, student) => sum + (student.avG_Semester_Score || 0), 0);
    return (total / studentData.length).toFixed(2);
  };

  const mergeIfSingleCell = (value, row, columnKey) => {
    const fullRow = {
      'average': 'trungbinh',
      'promotion': 'trungbinh',
      'reward': 'trungbinh',
    };

    if (fullRow[row.key] === columnKey) {
      return {
        children: <div style={{ textAlign: 'center' }}>{value}</div>,
        props: { colSpan: 4 },
      };
    }
    if (fullRow[row.key]) {
      return { children: null, props: { colSpan: 0 } };
    }
    return { children: value };
  };

  const statisticsData = [
    {
      key: 'conduct',
      category: 'Rèn luyện',
      yeu: getCountAndPercent(finalResult?.conduct, 'WEAK'),
      trungbinh: getCountAndPercent(finalResult?.conduct, 'AVERAGE'),
      kha: getCountAndPercent(finalResult?.conduct, 'GOOD'),
      totgioi: getCountAndPercent(finalResult?.conduct, 'EXCELENT'),
    },
    {
      key: 'performance',
      category: 'Học Lực',
      yeu: getCountAndPercent(finalResult?.performance, 'WEAK'),
      trungbinh: getCountAndPercent(finalResult?.performance, 'AVERAGE'),
      kha: getCountAndPercent(finalResult?.performance, 'GOOD'),
      totgioi: getCountAndPercent(finalResult?.performance, 'EXCELENT'),
    },
    {
      key: 'classify',
      category: 'Xếp Loại',
      yeu: getCountAndPercent(finalResult?.classify, 'WEAK'),
      trungbinh: getCountAndPercent(finalResult?.classify, 'AVERAGE'),
      kha: getCountAndPercent(finalResult?.classify, 'GOOD'),
      totgioi: getCountAndPercent(finalResult?.classify, 'EXCELENT'),
    },
    {
      key: 'average',
      category: 'Bình quân ĐTB',
      yeu: '',
      trungbinh: getAvgScore(),
      kha: '',
      totgioi: '',
    },
    {
      key: 'promotion',
      category: 'Lên lớp',
      yeu: '',
      trungbinh: getCountAndPercent(finalResult?.lenlop, 'Lên lớp'),
      kha: '',
      totgioi: '',
    },
    {
      key: 'reward',
      category: 'Khen thưởng',
      yeu: '',
      trungbinh: getCountAndPercent(finalResult?.classify, 'GOOD'),
      kha: '',
      totgioi: '',
    },
  ];

  const statisticsColumns = [
    {
      title: '',
      dataIndex: 'category',
      key: 'category',
      width: 160,
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Chưa đạt',
      dataIndex: 'yeu',
      key: 'yeu',
      align: 'center',
      render: (value, row) => mergeIfSingleCell(value, row, 'yeu'),
    },
    {
      title: 'Đạt',
      dataIndex: 'trungbinh',
      key: 'trungbinh',
      align: 'center',
      render: (value, row) => mergeIfSingleCell(value, row, 'trungbinh'),
    },
    {
      title: 'Khá',
      dataIndex: 'kha',
      key: 'kha',
      align: 'center',
      render: (value, row) => mergeIfSingleCell(value, row, 'kha'),
    },
    {
      title: 'Tốt/Giỏi',
      dataIndex: 'totgioi',
      key: 'totgioi',
      align: 'center',
      render: (value, row) => mergeIfSingleCell(value, row, 'totgioi'),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div className='flex justify-between' style={{ marginBottom: 24 }}>
        <div className='flex'>
          <Title level={3} style={{ marginBottom: 24 }}>Bảng Tổng Kết Kết Quả Học Tập</Title>
          <Select
            style={{ width: 120, marginLeft: 16 }}
            onChange={(value) => setSelectedSemester(value)}
            placeholder="Chọn học kỳ"
            defaultValue={selectedSemester}
          >
            <Option value={1}>HK1</Option>
            <Option value={2}>HK2</Option>
            <Option value={0}>Cả năm</Option>
          </Select>
        </div>
        
        <ExportClassYearlyReportExcel
          classData={classInfo}
          year={year}
          semester={selectedSemester}
          fileName={`bang-diem-${classInfo.maLop}-${year}-${selectedSemester}.xlsx`}
          style={{ marginRight: 0 }}
        />
      </div>

      <Card bordered style={{ marginBottom: 32 }}>
        <Table
          columns={columns}
          dataSource={formattedData}
          pagination={false}
          bordered
        />
      </Card>

      <Title level={4}>Thống kê</Title>
      <Table
        bordered
        pagination={false}
        dataSource={statisticsData}
        columns={statisticsColumns}
        showHeader={true}
        size="middle"
      />
    </div>
  );
};

export default FinalResultComponent;
