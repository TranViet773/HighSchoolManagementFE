import React, { useState, useEffect } from 'react';
import { Table, Card, Typography } from 'antd';
import ScoreService from '../../../../services/scoreService';

const { Title } = Typography;

const conductMap = {
  EXCELENT: 'Tốt',
  GOOD: 'Khá',
  AVERAGE: 'Đạt',
  WEAK: 'Chưa đạt',
};

const classifyMap = {
  EXCELENT: 'Xuất sắc',
  GOOD: 'Giỏi',
};

const StatisticalFinalResult = ({ classId, semester = 0, year }) => {
  const [studentData, setStudentData] = useState([]);
  const [finalResult, setFinalResult] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await ScoreService.GetFinalResultStudentsInClass({ classId, semester, year });
      setStudentData(data.data.studentData);
      setFinalResult(data.data.finalResult);
    } catch (error) {
      console.error("Error fetching final results:", error);
    }
  };

  const columns = [
    { title: 'STT', dataIndex: 'stt', key: 'stt' },
    { title: 'Mã số', dataIndex: 'studentCode', key: 'studentCode', render: (text) => <strong>{text}</strong> },
    { title: 'Họ và tên', dataIndex: 'studentName', key: 'studentName', render: (text) => <strong>{text}</strong> },
    {
      title: 'ĐTB',
      dataIndex: 'avG_Semester_Score',
      key: 'avG_Semester_Score',
      render: (v) => v?.toFixed(2) || '-',
    },
    {
      title: 'Rèn luyện',
      dataIndex: 'conduct',
      key: 'conduct',
      render: (value) => conductMap[value] || '-',
    },
    {
      title: 'Học lực',
      dataIndex: 'performance',
      key: 'performance',
      render: (value) => conductMap[value] || '-',
    },
    { title: 'Hạng', dataIndex: 'rank', key: 'rank' },
    {
      title: 'Lên lớp',
      dataIndex: 'lenlop',
      key: 'lenlop',
      render: (v) => v || '-',
    },
    {
      title: 'Khen thưởng',
      dataIndex: 'classify',
      key: 'classify',
      render: (v) => classifyMap[v] || '-',
    },
    {
      title: 'Nghỉ',
      key: 'nghi',
      render: (_, record) =>
        `Có phép: ${record.quantityOfAbsentWithPermission}, Không phép: ${record.quantityOfAbsentWithoutPermission}`,
    },
  ];

  const formattedData = studentData?.map((s, index) => ({
    key: s.studentId,
    stt: index + 1,
    ...s,
  }));

  const getPercentage = (count) =>
    studentData?.length > 0 ? ((count / studentData?.length) * 100).toFixed(1) + '%' : '0%';

  const getCountAndPercent = (items, targetName) => {
    const item = items?.find((i) => i.name === targetName);
    const count = item?.count || 0;
    const percent = getPercentage(count);
    return `${count}/${studentData?.length || 0}  --  ${percent}`;
  };

  const getAvgScore = () => {
    if (!studentData?.length) return '-';
    const total = studentData.reduce((sum, s) => sum + (s.avG_Semester_Score || 0), 0);
    return (total / studentData.length).toFixed(2);
  };

  const mergeIfSingleCell = (value, row, columnKey) => {
    const fullRow = {
      average: 'trungbinh',
      promotion: 'trungbinh',
      reward: 'trungbinh',
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
      category: 'Học lực',
      yeu: getCountAndPercent(finalResult?.performance, 'WEAK'),
      trungbinh: getCountAndPercent(finalResult?.performance, 'AVERAGE'),
      kha: getCountAndPercent(finalResult?.performance, 'GOOD'),
      totgioi: getCountAndPercent(finalResult?.performance, 'EXCELENT'),
    },
    {
      key: 'classify',
      category: 'Xếp loại',
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
      <Title level={3} style={{ marginBottom: 24 }}>
        Bảng Tổng Kết Kết Quả Học Tập
      </Title>

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

export default StatisticalFinalResult;
