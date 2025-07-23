import React, { useEffect, useState } from "react";
import { Card, Radio, Select, Button, Space } from "antd";
import { getInforJwt } from "../../../tools/utils";
import ScoreService from "../../../services/scoreService";
import { toast } from "react-toastify";
import AuthService from "../../../services/authService";
import PDFScoreBoardComponent from "./PDFScoreBoardComponent";
import { PDFDownloadLink } from "@react-pdf/renderer";

import getCurrentYear from "../../../utils/year.util";
import { list } from "postcss";
const { schoolYear, listYear } = getCurrentYear();

const id = getInforJwt().Id;
const PrintScoreBoardOptions = () => {
  const [printOption, setPrintOption] = useState("all");
  const [fromYear, setFromYear] = useState(schoolYear);
  const [fromSemester, setFromSemester] = useState("2");
  const [toYear, setToYear] = useState(schoolYear);
  const [toSemester, setToSemester] = useState("2");
  const [studentData, setUserData] = useState(null);
  const [scoreData, setScoreData] = useState(null);
  const [stableScoreData, setStableScoreData] = useState(null);
  const [isReady, setIsReady] = useState(false); // Cờ kiểm soát khi dữ liệu sẵn sàng

  useEffect(() => {
    fetchStudentInfo();
  }, []);

  useEffect(() => {
    if (scoreData) {
      setStableScoreData([...scoreData]); // Copy dữ liệu để tránh tham chiếu
    }
  }, [scoreData]);

  // Cập nhật state khi chọn "In tất cả học kỳ"
  useEffect(() => {
    if (printOption === "all") {
      setFromYear(listYear[0]); 
      setFromSemester("1");
      setToYear(listYear[listYear.length - 1]);
      setToSemester("2");
    }
  }, [printOption, listYear]);

  const fetchStudentInfo = async () => {
    try {
      const { data } = await AuthService.getById(id);
      setUserData(data);
    } catch (e) {
      toast.error("Lỗi khi lấy dữ liệu! Vui lòng thử lại sau!");
      console.log(e);
    }
  };

  const fetchScoreToPrint = async () => {
    try {
      setIsReady(false); // Ngăn tải PDF khi dữ liệu chưa cập nhật
      const { data } = await ScoreService.GetScoreToPrint({
        studentId: id,
        semesterStart: fromSemester,
        semesterEnd: toSemester,
        yearStart: fromYear,
        yearEnd: toYear
      });
      setScoreData(data.data);
      toast.success("Dữ liệu điểm đã được cập nhật!");
      setIsReady(true); // Khi dữ liệu cập nhật xong thì cho phép tải PDF
    } catch (e) {
      toast.error("Lỗi khi tải dữ liệu! Vui lòng thử lại sau!");
    }
  };

  return (
    <Card className="shadow-lg p-4 max-w-lg mx-auto" style={{ margin: "0 auto", marginTop: "20px" }}>
      <Radio.Group
        value={printOption}
        className="flex flex-col space-y-2"
        onChange={(e) => {
          setPrintOption(e.target.value);
          if (e.target.value === "all") {
            setFromYear(listYear[0]); 
            setFromSemester("1"); // Học kỳ 1
            setToYear(listYear[listYear.length - 1]); // Năm học cuối cùng
            setToSemester("2"); // Học kỳ 2
          }
        }}
      >
        <Radio value="all">In tất cả học kì</Radio>
        <Radio value="some">In một số học kì</Radio>
      </Radio.Group>
      {printOption === "some" && (
        <div className="mt-4 space-y-3">
          <Space>
            <span>Từ: Năm học</span>
            <Select value={fromYear} onChange={setFromYear} style={{ width: 120 }}>
              {listYear.map((item, index) => (
                <Select.Option value={item} key={index}>
                  {item}
                </Select.Option>
              ))}
            </Select>
            <span>Học kỳ</span>
            <Select value={fromSemester} onChange={setFromSemester} style={{ width: 60 }}>
              <Select.Option value="1">1</Select.Option>
              <Select.Option value="2">2</Select.Option>
            </Select>
          </Space>
          <Space>
            <span>Đến: Năm học</span>
            <Select value={toYear} onChange={setToYear} style={{ width: 120 }}>
              {listYear.map((item, index) => (
                <Select.Option value={item} key={index}>
                  {item}
                </Select.Option>
              ))}
            </Select>
            <span>Học kỳ</span>
            <Select value={toSemester} onChange={setToSemester} style={{ width: 60 }}>
              <Select.Option value="1">1</Select.Option>
              <Select.Option value="2">2</Select.Option>
            </Select>
          </Space>
        </div>
      )}

      <Button type="default" className="mt-4 w-full" onClick={fetchScoreToPrint}>
        Lấy Dữ Liệu
      </Button>

      {isReady && stableScoreData && stableScoreData.length > 0 && studentData ? (
        <PDFDownloadLink
          document={<PDFScoreBoardComponent student={studentData} scores={stableScoreData} />}
          fileName="student_info.pdf"
        >
          {({ loading }) =>
            loading ? (
              <Button type="primary" className="mt-4 w-full" disabled>
                Đang tạo PDF...
              </Button>
            ) : (
              <Button type="primary" className="mt-4 w-full">
                Tải PDF
              </Button>
            )
          }
        </PDFDownloadLink>
      ) : (
        <p className="text-center mt-4">Chưa có dữ liệu hoặc dữ liệu không hợp lệ</p>
      )}
    </Card>
  );
};

export default PrintScoreBoardOptions;
