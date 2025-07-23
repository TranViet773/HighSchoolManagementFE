import React, { useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Button, message } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import ScoreService from "../../services/scoreService";

const ExportClassYearlyReportExcel = ({ classData, filename, year, semester }) => {
  const [loading, setLoading] = useState(false);

  const exportYearlyReportToExcel = async () => {
    try {
      setLoading(true);

      // Lấy dữ liệu từ API
      const response = await ScoreService.GetFinalResultStudentsInClass({
        classId: classData.classId,
        year,
        semester: semester || 0 // 0 cho cả năm
      });

      if (!response?.data?.data) {
        message.warning("Không có dữ liệu để xuất báo cáo!");
        return;
      }

      const { studentData, finalResult } = response.data.data;

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Báo cáo kết quả cả năm");

      const today = new Date();
      const formattedDate = `Cần Thơ, ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;

      // Header bên trái
      sheet.mergeCells("A1:D1");
      sheet.getCell("A1").value = "SỞ GIÁO DỤC & ĐÀO TẠO TPCT";
      sheet.getCell("A1").alignment = { horizontal: "center", vertical: "middle" };
      sheet.getCell("A1").font = { bold: true, size: 12, name: "Times New Roman" };

      sheet.mergeCells("A2:D2");
      sheet.getCell("A2").value = "TRƯỜNG THCS ABC";
      sheet.getCell("A2").alignment = { horizontal: "center", vertical: "middle" };
      sheet.getCell("A2").font = { bold: true, size: 12, name: "Times New Roman" };

      // Header bên phải
      sheet.mergeCells("F1:J1");
      sheet.getCell("F1").value = "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM";
      sheet.getCell("F1").alignment = { horizontal: "center", vertical: "middle" };
      sheet.getCell("F1").font = { bold: true, size: 12, name: "Times New Roman" };

      sheet.mergeCells("F2:J2");
      sheet.getCell("F2").value = "Độc lập - Tự do - Hạnh phúc";
      sheet.getCell("F2").alignment = { horizontal: "center", vertical: "middle" };
      sheet.getCell("F2").font = { italic: true, size: 11, name: "Times New Roman" };

      sheet.mergeCells("F4:J4");
      sheet.getCell("F4").value = formattedDate;
      sheet.getCell("F4").alignment = { horizontal: "center", vertical: "middle" };
      sheet.getCell("F4").font = { italic: true, size: 11, name: "Times New Roman" };

      // Tên báo cáo
      const reportTitle = semester === 0 
        ? "BẢNG BÁO CÁO KẾT QUẢ CUỐI NĂM" 
        : `BẢNG BÁO CÁO KẾT QUẢ HỌC KỲ ${semester}`;
      
      sheet.mergeCells("A6:J6");
      sheet.getCell("A6").value = reportTitle;
      sheet.getCell("A6").alignment = { horizontal: "center", vertical: "middle" };
      sheet.getCell("A6").font = { bold: true, size: 16, name: "Times New Roman" };

      sheet.mergeCells("A7:J7");
      sheet.getCell("A7").value = `Lớp: ${classData?.className || classData?.classCode || ''} - Năm học: ${year}`;
      sheet.getCell("A7").alignment = { horizontal: "center", vertical: "middle" };
      sheet.getCell("A7").font = { italic: true, size: 12, name: "Times New Roman" };

      // Mapping cho các giá trị
      const conductMap = {
        'EXCELENT': 'Tốt',
        'GOOD': 'Khá', 
        'AVERAGE': 'Đạt',
        'WEAK': 'Chưa đạt'
      };

      const classifyMap = {
        'EXCELENT': 'Xuất sắc',
        'GOOD': 'Giỏi'
      };

      // Tạo bảng dữ liệu học sinh
      const startRow = 9;
      
      // Header của bảng học sinh
      const headers = ['STT', 'MS', 'HỌ TÊN', 'ĐTB', 'RL', 'HL', 'Hạng', 'Lên lớp', 'Khen', 'Nghỉ'];
      headers.forEach((header, index) => {
        const cell = sheet.getCell(startRow, index + 1);
        cell.value = header;
        cell.font = { bold: true, size: 11, name: "Times New Roman" };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" }
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE6E6E6' }
        };
      });

      // Dữ liệu học sinh
      studentData.forEach((student, index) => {
        const row = startRow + 1 + index;
        const rowData = [
          index + 1,
          student.studentCode,
          student.studentName,
          student.avG_Semester_Score ? student.avG_Semester_Score.toFixed(1) : '-',
          conductMap[student.conduct] || '-',
          conductMap[student.performance] || '-',
          student.rank || '-',
          student.lenlop == null ? '-' : student.lenlop ? 'Lên lớp' : 'Không lên lớp',
          classifyMap[student.classify] || '-',
          `CP: ${student.quantityOfAbsentWithPermission || 0} - KP: ${student.quantityOfAbsentWithoutPermission || 0}`
        ];

        rowData.forEach((data, colIndex) => {
          const cell = sheet.getCell(row, colIndex + 1);
          cell.value = data;
          cell.font = { size: 10, name: "Times New Roman" };
          cell.alignment = { 
            horizontal: colIndex === 2 ? "left" : "center", 
            vertical: "middle" 
          };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" }
          };
        });
      });

      // Hàm lấy số lượng và phần trăm
      const getCountAndPercent = (items, targetName) => {
        const item = items?.find(i => i.name === targetName);
        const count = item?.count || 0;
        const percent = studentData.length > 0 ? ((count / studentData.length) * 100).toFixed(1) : '0.0';
        return `${count}/${studentData.length} -- ${percent}%`;
      };

      // Tính điểm trung bình
      const avgScore = studentData.length > 0 ? 
        (studentData.reduce((sum, s) => sum + (s.avG_Semester_Score || 0), 0) / studentData.length).toFixed(2) : '0.00';

      // Bảng thống kê với mỗi cột = 2 cột Excel
      const statsStartRow = startRow + studentData.length + 3;
      
      // Header thống kê - merge mỗi cột thành 2 cột Excel
      const statsHeaders = ['Tiêu chí', 'Chưa đạt', 'Đạt', 'Khá', 'Tốt/Giỏi'];
      statsHeaders.forEach((header, index) => {
        const startCol = index * 2 + 1;
        const endCol = startCol + 1;

        sheet.mergeCells(statsStartRow, startCol, statsStartRow, endCol);
        const cell = sheet.getCell(statsStartRow, startCol);
        cell.value = header;
        cell.font = { bold: true, size: 11, name: "Times New Roman" };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" }
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE6E6E6' }
        };

        const endCell = sheet.getCell(statsStartRow, endCol);
        endCell.border = cell.border;
        endCell.fill = cell.fill;
      });

      // Dữ liệu bảng thống kê
      const statsData = [
        [
          'Rèn luyện',
          getCountAndPercent(finalResult?.conduct, 'WEAK'),
          getCountAndPercent(finalResult?.conduct, 'AVERAGE'),
          getCountAndPercent(finalResult?.conduct, 'GOOD'),
          getCountAndPercent(finalResult?.conduct, 'EXCELENT')
        ],
        [
          'Học lực',
          getCountAndPercent(finalResult?.performance, 'WEAK'),
          getCountAndPercent(finalResult?.performance, 'AVERAGE'),
          getCountAndPercent(finalResult?.performance, 'GOOD'),
          getCountAndPercent(finalResult?.performance, 'EXCELENT')
        ],
        [
          'Xếp loại',
          getCountAndPercent(finalResult?.classify, 'WEAK'),
          getCountAndPercent(finalResult?.classify, 'AVERAGE'),
          getCountAndPercent(finalResult?.classify, 'GOOD'),
          getCountAndPercent(finalResult?.classify, 'EXCELENT')
        ]
      ];

      statsData.forEach((rowData, rowIndex) => {
        const row = statsStartRow + 1 + rowIndex;

        rowData.forEach((data, colIndex) => {
          const startCol = colIndex * 2 + 1;
          const endCol = startCol + 1;

          sheet.mergeCells(row, startCol, row, endCol);
          const cell = sheet.getCell(row, startCol);
          cell.value = data;
          cell.font = { size: 10, name: "Times New Roman" };
          cell.alignment = {
            horizontal: colIndex === 0 ? "left" : "center",
            vertical: "middle"
          };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" }
          };

          const endCell = sheet.getCell(row, endCol);
          endCell.border = cell.border;
        });
      });

      // Các thống kê bổ sung giữ nguyên như cũ
      const additionalStats = [
        ['Bình quân ĐTB', avgScore],
        ['Lên lớp', getCountAndPercent(finalResult?.lenlop, 'Lên lớp')],
        ['Khen thưởng', getCountAndPercent(finalResult?.classify, 'GOOD')]
      ];

      additionalStats.forEach((rowData, rowIndex) => {
        const row = statsStartRow + 4 + rowIndex;

        // Tiêu đề bên trái
        const labelCell = sheet.getCell(row, 1);
        labelCell.value = rowData[0];
        labelCell.font = { size: 10, name: "Times New Roman" };
        labelCell.alignment = { horizontal: "left", vertical: "middle" };
        labelCell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" }
        };

        // 👉 Merge toàn bộ từ cột 2 đến 9 cho giá trị
        sheet.mergeCells(row, 3, row, 10);
        const valueCell = sheet.getCell(row, 3);
        valueCell.value = rowData[1];
        valueCell.font = { size: 10, name: "Times New Roman" };
        valueCell.alignment = { horizontal: "center", vertical: "middle" };
        valueCell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" }
        };

        // Kẻ border cho từng ô trong phần merge
        for (let col = 2; col <= 10; col++) {
          const cell = sheet.getCell(row, col);
          cell.border = valueCell.border;
        }
      });



      // Điều chỉnh độ rộng cột
      sheet.getColumn(1).width = 5;   // STT
      sheet.getColumn(2).width = 10;  // MS
      sheet.getColumn(3).width = 20;  // Họ tên
      sheet.getColumn(4).width = 8;   // ĐTB
      sheet.getColumn(5).width = 10;  // RL
      sheet.getColumn(6).width = 10;  // HL
      sheet.getColumn(7).width = 8;   // Hạng
      sheet.getColumn(8).width = 12;  // Lên lớp
      sheet.getColumn(9).width = 12;  // Khen
      sheet.getColumn(10).width = 15; // Nghỉ

      // Điều chỉnh chiều cao hàng
      for (let i = 1; i <= sheet.rowCount; i++) {
        sheet.getRow(i).height = 20;
      }

      // Export file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });

      const className = classData?.className || 'lop';
      const semesterText = semester === 1 ? 'HK1' : semester === 2 ? 'HK2' : 'ca_nam';
      const defaultFilename = `bao_cao_ket_qua_${semesterText}_${className}_${year?.replace('-', '_')}.xlsx`;
      saveAs(blob, filename || defaultFilename);

      message.success("Xuất báo cáo kết quả thành công!");

    } catch (error) {
      console.error("Lỗi khi xuất báo cáo:", error);
      message.error("Có lỗi xảy ra khi xuất báo cáo!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="primary"
      icon={<DownloadOutlined />}
      onClick={exportYearlyReportToExcel}
      loading={loading}
      style={{ backgroundColor: "#52c41a", borderColor: "#52c41a", marginLeft: 8 }}
    >
      {loading ? "Đang xuất..." : "Xuất Báo Cáo Kết Quả"}
    </Button>
  );
};

export default ExportClassYearlyReportExcel;