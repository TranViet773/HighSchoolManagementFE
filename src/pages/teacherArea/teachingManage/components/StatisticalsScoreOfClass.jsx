import React, { useEffect, useState } from "react";
import { Select, Table } from "antd";
import ScoreService from "../../../../services/scoreService";
import Title from "antd/es/typography/Title";
// import "./scoreTable.css"; // import CSS

const StatisticalsScoreOfClass = ({ classId, year, semester, subjectId }) => {
  const [scoreRatio, setScoreRatio] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(semester);
  useEffect(() => {
    fetchRatioScore();
  }, [year, selectedSemester]);

  const fetchRatioScore = async () => {
    const { data } = await ScoreService.GetScoreRatioOfClass({
      classId,
      semester: selectedSemester,
      year,
      subjectId,
    });
    if (data) setScoreRatio(data.data);
  };

  const columnKeys = [
    { key: "ratioOfOralScore", label: "Miệng" },
    { key: "ratioOfOralScore1", label: "Miệng 1" },
    { key: "ratioOfOralScore2", label: "Miệng 2" },
    { key: "ratioOfOralScore3", label: "Miệng 3" },
    { key: "ratioOfQuizScore", label: "15P" },
    { key: "ratioOfQuizScore1", label: "15P 1" },   
    { key: "ratioOfQuizScore2", label: "15P 2" },
    { key: "ratioOfQuizScore3", label: "15P 3" },
    { key: "ratioOfMidTermScore", label: "Giữa kỳ" },
    { key: "ratioOfFinalScore", label: "Cuối kỳ" },
    { key: "ratioOfAverageScore", label: "TBM HK II" },
    { key: "ratioOfFinalAverageScore", label: "TBM CN" },
  ];

  const ranges = [
    { label: "8.0 - 10", field: "ratio80to100" },
    { label: "6.5 - 7.9", field: "ratio65to79" },
    { label: "5.0 - 6.4", field: "ratio50to64" },
    { label: "3.5 - 4.9", field: "ratio35to49" },
    { label: "0 - 3.4", field: "ratio0to34" },
    { label: "Trên 5.0", field: "ratioMoreThan50" },
  ];

  const get = (key, field, type) => {
    const value = scoreRatio?.[key]?.[field];
    if (!value || value[type] == null) return "-";
    return type === "ratio" ? `${value[type]}%` : value[type];
  };

  const dataSource = [];

  ranges.forEach((range, idx) => {
    const quantityRow = {
      key: `quantity-${idx}`,
      range: range.label,
      type: "SL",
      isStriped: idx % 2 === 0,
      rowSpan: 2,
    };
    const percentRow = {
      key: `percent-${idx}`,
      range: "", // merge ở dòng trên
      type: "%",
      isStriped: idx % 2 === 0,
      rowSpan: 0,
    };

    columnKeys.forEach((col) => {
      quantityRow[col.label] = get(col.key, range.field, "quantity");
      percentRow[col.label] = get(col.key, range.field, "ratio");
    });

    dataSource.push(quantityRow, percentRow);
  });

  const columns = [
    {
      title: "Thống kê",
      children: [
        {
          title: "Khoảng",
          dataIndex: "range",
          key: "range",
          align: "center",
          width: 100,
          render: (text, row) => {
            return {
              children: text,
              props: {
                rowSpan: row.rowSpan,
                style: { verticalAlign: "middle", textAlign: "center" },
              },
            };
          },
        },
        {
          title: "",
          dataIndex: "type",
          key: "type",
          align: "center",
          width: 60,
        },
      ],
    },
    ...columnKeys.map((col) => ({
      title: col.label,
      dataIndex: col.label,
      key: col.label,
      align: "center",
    })),
  ];

  console.log(scoreRatio)
  return (
    <>
      <div className="flex items-center justify-center">
        <Title level={4} style={{ textAlign: "center"}}>
          THỐNG KÊ TỶ LỆ PHÂN BỐ ĐIỂM
        </Title>
        <Select value={selectedSemester} onChange={(value) => setSelectedSemester(value)} style={{ width: 120, marginLeft: 20, marginBottom: 12 }}>
          <Select.Option value={1}>Học kỳ 1</Select.Option>
          <Select.Option value={2}>Học kỳ 2</Select.Option>
        </Select>
      </div>
      <Table
        className="striped-rows"
        dataSource={dataSource}
        columns={columns}
        bordered
        pagination={false}
        scroll={{ x: "max-content" }}
        rowClassName={(_, index) => {
          // xen kẽ block 2 hàng
          return index % 2 === 0 ? "striped" : "";
        }}
      />
    </>
  );
};

export default StatisticalsScoreOfClass;
