import React from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import ScoreService from "../../services/scoreService";

const ExportExcelButton = ({ data, headers, classData, subject, year, semester, filename, classId, subjectId }) => {
  console.log("ExportExcelButton props:", { data, headers, classData, subject, year, semester, filename, classId, subjectId });
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(subject.subjectName.toUpperCase());

    const today = new Date();
    const formattedDate = `..., ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;

    // === GÓC TRÁI: SỞ GIÁO DỤC ===
    sheet.mergeCells("A1:D1");
    sheet.getCell("A1").value = "SỞ GIÁO DỤC & ĐÀO TẠO ...";
    sheet.getCell("A1").alignment = { horizontal: "center" };
    sheet.getCell("A1").font = { bold: true };

    sheet.mergeCells("A2:D2");
    sheet.getCell("A2").value = "TRƯỜNG THCS ABC";
    sheet.getCell("A2").alignment = { horizontal: "center" };
    sheet.getCell("A2").font = { bold: true };

    // === GÓC PHẢI: CHXHCNVN ===
    sheet.mergeCells("J1:M1");
    sheet.getCell("J1").value = "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM";
    sheet.getCell("J1").alignment = { horizontal: "center" };
    sheet.getCell("J1").font = { bold: true };

    sheet.mergeCells("J2:M2");
    sheet.getCell("J2").value = "Độc lập - Tự do - Hạnh phúc";
    sheet.getCell("J2").alignment = { horizontal: "center" };
    sheet.getCell("J2").font = { italic: true };

    // === Địa điểm, ngày tháng năm ===
    sheet.mergeCells("J3:M3");
    sheet.getCell("J3").value = formattedDate;
    sheet.getCell("J3").alignment = { horizontal: "center" };
    sheet.getCell("J3").font = { italic: true };

    // === TÊN BẢNG ===
    sheet.mergeCells("A5:M5");
    sheet.getCell("A5").value = `THỐNG KÊ XẾP LOẠI HỌC LỰC MÔN ${subject.subjectName.toUpperCase()}`;
    sheet.getCell("A5").alignment = { horizontal: "center" };
    sheet.getCell("A5").font = { bold: true, size: 14 };

    // === Dòng phụ: lớp và năm học ===
    sheet.mergeCells("A6:M6");
    sheet.getCell("A6").value = `Lớp ${classData.className} - HK ${semester} - năm học ${year}`;
    sheet.getCell("A6").alignment = { horizontal: "center" };
    sheet.getCell("A6").font = { italic: true };

    sheet.addRow([]); // Dòng trống

    // === LỌC HEADERS THEO HỌC KỲ ===
    const filteredHeaders =
      semester === 1
        ? headers.filter((h) => h.key !== "FinalAverageSubjectScore")
        : headers;

    // === DÒNG TIÊU ĐỀ ===
    const headerRow = sheet.addRow(filteredHeaders.map((h) => h.label));
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: "center", vertical: "middle" };
    headerRow.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
      };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFDCE6F1" }
      };
    });

    // === DỮ LIỆU ===
    data.forEach((item) => {
      const row = sheet.addRow(filteredHeaders.map((h) => item[h.key] ?? ""));
      row.alignment = { horizontal: "left", vertical: "middle" };
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" }
        };
      });
    });

    // === THÊM BẢNG THỐNG KÊ % ĐIỂM HỌC KỲ ==
    if (classData.classId && subject.subjectId) {
      console.log("Fetching score ratio for class:", classData.classId, "semester:", semester, "year:", year, "subjectId:", subject.subjectId);
      try {
        // Gọi API lấy dữ liệu thống kê ratio
        const { data: scoreRatioResponse } = await ScoreService.GetScoreRatioOfClass({
          classId: classData.classId,
          semester,
          year,
          subjectId: subject.subjectId,
        });

        if (scoreRatioResponse && scoreRatioResponse.data) {
          const scoreRatio = scoreRatioResponse.data;
          
          // Thêm khoảng trống
          sheet.addRow([]);
          sheet.addRow([]);

          // === TIÊU ĐỀ BẢNG THỐNG KÊ ===
          const statsCurrentRow = sheet.lastRow.number + 1;
          const statsEndCol = String.fromCharCode(65 + filteredHeaders.length + 1); // A=65, tính theo số cột
          
          sheet.mergeCells(`A${statsCurrentRow}:${statsEndCol}${statsCurrentRow}`);
          sheet.getCell(`A${statsCurrentRow}`).value = "BẢNG THỐNG KÊ ĐIỂM SỐ";
          sheet.getCell(`A${statsCurrentRow}`).alignment = { horizontal: "center" };
          sheet.getCell(`A${statsCurrentRow}`).font = { bold: true, size: 12 };

          sheet.addRow([]); // Dòng trống

          // Định nghĩa các cột thống kê
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

          // === HEADER THỐNG KÊ ===
          // Header chính
          const headerLabels = ["Thống kê", "", ...columnKeys.map(col => col.label)];
          const statsHeaderRow1 = sheet.addRow(headerLabels);
          
          // Header phụ
          const subHeaderLabels = ["Khoảng", "", ...columnKeys.map(() => "")];
          const statsHeaderRow2 = sheet.addRow(subHeaderLabels);

          const headerRowNum1 = statsHeaderRow1.number;
          const headerRowNum2 = statsHeaderRow2.number;
          
          // Merge cells cho header
          sheet.mergeCells(`A${headerRowNum1}:A${headerRowNum2}`);
          sheet.mergeCells(`B${headerRowNum1}:B${headerRowNum2}`);
          
          // Style cho header thống kê
          [statsHeaderRow1, statsHeaderRow2].forEach(row => {
            row.font = { bold: true };
            row.alignment = { horizontal: "center", vertical: "middle" };
            row.eachCell((cell) => {
              cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" }
              };
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFDCE6F1" }
              };
            });
          });

          // === DỮ LIỆU THỐNG KÊ ===
          ranges.forEach((range) => {
            // Dòng số lượng
            const quantityRowData = [
              range.label,
              "SL",
              ...columnKeys.map(col => get(col.key, range.field, "quantity"))
            ];
            const quantityRow = sheet.addRow(quantityRowData);
            
            // Dòng phần trăm
            const percentRowData = [
              "",
              "%",
              ...columnKeys.map(col => get(col.key, range.field, "ratio"))
            ];
            const percentRow = sheet.addRow(percentRowData);

            // Merge cell cho cột đầu tiên (Khoảng)
            const qRowNum = quantityRow.number;
            const pRowNum = percentRow.number;
            sheet.mergeCells(`A${qRowNum}:A${pRowNum}`);

            // Style cho dòng dữ liệu thống kê
            [quantityRow, percentRow].forEach(row => {
              row.alignment = { horizontal: "center", vertical: "middle" };
              row.eachCell((cell) => {
                cell.border = {
                  top: { style: "thin" },
                  left: { style: "thin" },
                  bottom: { style: "thin" },
                  right: { style: "thin" }
                };
              });
            });
          });

          // Căn chỉnh lại độ rộng cột cho toàn bộ sheet
          const allColumns = Math.max(filteredHeaders.length, columnKeys.length + 2);
          sheet.columns = Array.from({ length: allColumns }, (_, i) => {
            if (i === 0) return { width: 15 }; // Cột "Khoảng"
            if (i === 1) return { width: 8 };  // Cột "SL/%"
            return { width: 12 }; // Các cột điểm
          });
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu thống kê:", error);
      }
    }

    // === TỰ ĐỘNG CANH CỘT CHO BẢNG CHÍNH ===
    if (semester !== 2) {
      sheet.columns = filteredHeaders.map((h, i) => {
          const maxLength = Math.max(
              h.label.length,
              ...data.map((d) => (d[h.key] ? d[h.key].toString().length : 0))
          );
          return {
              width: maxLength + 2
          };
      });
    }

    // === XUẤT FILE ===
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    saveAs(blob, filename || `export_${subject.subjectName}_${year}_HK${semester}.xlsx`);
  };

  return (
    <Button
        type="primary"
        icon={<DownloadOutlined />}
        onClick={exportToExcel}
        style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
    >
        Xuất Excel
    </Button>
  );
};

export default ExportExcelButton;