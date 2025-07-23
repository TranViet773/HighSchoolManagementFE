import React, { useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Button, message } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import ScoreService from "../../services/scoreService"; 

const ExportClassScoreExcel = ({ classData, filename, year, semester }) => {
  const [loading, setLoading] = useState(false);

  const exportToExcel = async () => {
    try {
      setLoading(true);

      const data = await ScoreService.GetScoreBoardAllStudentOfClassInSemester({
        classId: classData.classId,
        year,
        semester
      });

      if (!data || data.length === 0) {
        message.warning("Không có dữ liệu điểm để xuất!");
        return;
      }

      const studentsData = data.data.data;
      console.log("Students Data:", studentsData);
      const hasValidData = studentsData.some(student =>
        student &&
        student.scoresOfStudent &&
        student.scoresOfStudent.scoreOfSubjectResponses &&
        student.scoresOfStudent.scoreOfSubjectResponses.length > 0
      );

      if (!hasValidData) {
        message.warning("Không có điểm số để xuất Excel!");
        return;
      }

      const workbook = new ExcelJS.Workbook();
      const today = new Date();
      const formattedDate = `Cần Thơ, ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;

      studentsData.forEach((studentData, index) => {
        const student = studentData;
        const scores = studentData.scoresOfStudent;

        if (!student || !scores || !scores.scoreOfSubjectResponses || scores.scoreOfSubjectResponses.length === 0) {
          return;
        }

        const sheet = workbook.addWorksheet(`${student.studentName || 'Student_' + (index + 1)}`);

        // Header bên trái
        sheet.mergeCells("A1:F1");
        sheet.getCell("A1").value = "SỞ GIÁO DỤC & ĐÀO TẠO TPCT";
        sheet.getCell("A1").alignment = { horizontal: "center", vertical: "middle" };
        sheet.getCell("A1").font = { bold: true, size: 16, name: "Times New Roman" };

        sheet.mergeCells("A2:F2");
        sheet.getCell("A2").value = "TRƯỜNG THCS ABC";
        sheet.getCell("A2").alignment = { horizontal: "center", vertical: "middle" };
        sheet.getCell("A2").font = { bold: true, size: 16, name: "Times New Roman" };

        // Header bên phải
        sheet.mergeCells("H1:N1");
        sheet.getCell("H1").value = "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM";
        sheet.getCell("H1").alignment = { horizontal: "center", vertical: "middle" };
        sheet.getCell("H1").font = { bold: true, size: 16, name: "Times New Roman" };

        sheet.mergeCells("H2:N2");
        sheet.getCell("H2").value = "Độc lập - Tự do - Hạnh phúc";
        sheet.getCell("H2").alignment = { horizontal: "center", vertical: "middle" };
        sheet.getCell("H2").font = { italic: true, size: 14, name: "Times New Roman" };

        sheet.mergeCells("H4:N4");
        sheet.getCell("H4").value = formattedDate;
        sheet.getCell("H4").alignment = { horizontal: "center", vertical: "middle" };
        sheet.getCell("H4").font = { italic: true, size: 14, name: "Times New Roman" };

        // Tên bảng
        sheet.mergeCells("A6:N6");
        sheet.getCell("A6").value = `KẾT QUẢ HỌC TẬP`;
        sheet.getCell("A6").alignment = { horizontal: "center", vertical: "middle" };
        sheet.getCell("A6").font = { bold: true, size: 20, name: "Times New Roman" };

        sheet.mergeCells("A7:N7");
        sheet.getCell("A7").value = `Năm học: ${scores.year || year} - Học kỳ: ${scores.semester || semester}`;
        sheet.getCell("A7").alignment = { horizontal: "center", vertical: "middle" };
        sheet.getCell("A7").font = { italic: true, size: 14, name: "Times New Roman" };

        // Thông tin học sinh
        sheet.mergeCells("A9:F9");
        sheet.getCell("A9").value = `Họ tên: ${student.studentName || ''}`;
        sheet.getCell("A9").font = { bold: true, size: 14, name: "Times New Roman" };
        sheet.getCell("A9").alignment = { vertical: "middle" };

        sheet.mergeCells("G9:J9");
        sheet.getCell("G9").value = `Mã số: ${student.studentCode || ''}`;
        sheet.getCell("G9").font = { bold: true, size: 14, name: "Times New Roman" };
        sheet.getCell("G9").alignment = { vertical: "middle" };

        sheet.mergeCells("K9:N9");
        let formattedBirthDate = '';
        if (student.dateOfBirth) {
          const birthDate = new Date(student.dateOfBirth);
          formattedBirthDate = `${birthDate.getDate().toString().padStart(2, '0')}/${(birthDate.getMonth() + 1).toString().padStart(2, '0')}/${birthDate.getFullYear()}`;
        }
        sheet.getCell("K9").value = `Ngày sinh: ${formattedBirthDate}`;
        sheet.getCell("K9").font = { bold: true, size: 14, name: "Times New Roman" };
        sheet.getCell("K9").alignment = { vertical: "middle" };

        sheet.addRow([]);

        // Tiêu đề nhóm
        let headerColumns = ["STT", "Tên môn", "Miệng", "", "", "", "15 phút", "", "", "", "Giữa kỳ", "Cuối kỳ"];
        if (parseInt(scores.semester) === 2 || parseInt(semester) === 2) {
          headerColumns.push("TB cả năm");
        }
        const mainHeaderRow = sheet.addRow(headerColumns);
        mainHeaderRow.font = { bold: true, size: 13, name: "Times New Roman" };
        mainHeaderRow.alignment = { horizontal: "center", vertical: "middle" };
        sheet.mergeCells("C11:F11");
        sheet.mergeCells("G11:J11");

        // Dòng con
        let subHeaderColumns = ["", "", "Lần 1", "Lần 2", "Lần 3", "Lần 4", "Lần 1", "Lần 2", "Lần 3", "Lần 4", "", ""];
        if (parseInt(scores.semester) === 2 || parseInt(semester) === 2) {
          subHeaderColumns.push("");
        }
        const subHeaderRow = sheet.addRow(subHeaderColumns);
        subHeaderRow.font = { italic: true, size: 13, name: "Times New Roman" };
        subHeaderRow.alignment = { horizontal: "center", vertical: "middle" };

        // Viền
        const applyBorders = (row) => {
          row.eachCell((cell) => {
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" }
            };
          });
        };
        applyBorders(mainHeaderRow);
        applyBorders(subHeaderRow);

        // Điểm môn
        scores.scoreOfSubjectResponses.forEach((subject, subjectIndex) => {
          const formatScore = (score, scoringType) => {
            if (!score && score !== 0) return "";
            return scoringType === true ? (parseFloat(score) >= 0.5 ? "Đ" : "CĐ") : score;
          };

          let rowData = [
            subjectIndex + 1,
            subject.subjects?.subject_Name || 'N/A',
            formatScore(subject.oralScore, subject?.scoringType),
            formatScore(subject.oralScore1, subject?.scoringType),
            formatScore(subject.oralScore2, subject?.scoringType),
            formatScore(subject.oralScore3, subject?.scoringType),
            formatScore(subject.quizScore, subject?.scoringType),
            formatScore(subject.quizScore1, subject?.scoringType),
            formatScore(subject.quizScore2, subject?.scoringType),
            formatScore(subject.quizScore3, subject?.scoringType),
            formatScore(subject.testScore, subject?.scoringType),
            formatScore(subject.finalExamScore, subject?.scoringType)
          ];

          if (parseInt(scores.semester) === 2 || parseInt(semester) === 2) {
            const finalScore = scores.finalSubjectAverageScore?.find(fs => fs.subjectId === subject.subjectId);
            rowData.push(formatScore(finalScore?.finalSubjectAverageScore, subject.subjects?.scoringType));
          }

          const row = sheet.addRow(rowData);
          row.font = { size: 13, name: "Times New Roman" };
          row.alignment = { vertical: "middle", horizontal: "center" };
          applyBorders(row);
        });

        // Thêm bảng "Kết quả cuối năm" chỉ khi là học kỳ 2
        if (parseInt(scores.semester) === 2 || parseInt(semester) === 2) {
          const resultFinalYear = studentData.resultFinalYear;
          
          // Thêm 1 dòng trống
          sheet.addRow([]);
          
          // Tiêu đề bảng kết quả cuối năm
          const finalResultTitleRow = sheet.addRow([]);
          const numColumns = headerColumns.length; // Sử dụng số cột giống bảng điểm
          const titleCell = sheet.getCell(finalResultTitleRow.number, 1);
          titleCell.value = "Kết quả cuối năm";
          titleCell.font = { bold: true, size: 14, name: "Times New Roman" };
          titleCell.alignment = { horizontal: "center", vertical: "middle" };
          titleCell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" }
          };
          
          // Merge tất cả cột cho tiêu đề
          sheet.mergeCells(finalResultTitleRow.number, 1, finalResultTitleRow.number, numColumns);
          
          // Dòng header của bảng kết quả cuối năm
          const finalHeaderColumns = [
            "TB Học kỳ 1", "TB Học kỳ 2", "TB cả năm", 
            "Rèn luyện", "Học tập", "Khen thưởng", "Lên lớp", "Nhận xét"
          ];
          
          const finalHeaderRow = sheet.addRow(finalHeaderColumns);
          finalHeaderRow.font = { bold: true, size: 12, name: "Times New Roman" };
          finalHeaderRow.alignment = { horizontal: "center", vertical: "middle" };
          
          // Merge các cột để cân xứng với bảng trên
          // Cột 1-2: TB Học kỳ 1, TB Học kỳ 2
          // Cột 3: Trung bình cả năm
          // Cột 4-5: Rèn luyện, Học tập
          // Cột 6-7: Khen thưởng, Lên lớp  
          // Cột 8-end: Nhận xét
          
          if (numColumns >= 8) {
            // Merge nhận xét để chiếm các cột còn lại
            sheet.mergeCells(finalHeaderRow.number, 8, finalHeaderRow.number, numColumns);
          }
          
          applyBorders(finalHeaderRow);
          
          // Dòng dữ liệu kết quả cuối năm
          const getClassificationText = (value) => { //Khen thưởng
            switch(value) {
              case 2: return "Xuất sắc";
              case 1: return "Giỏi";
              case 0: return "-";
              default: return "-";
            }
          };
          
          const getConductText = (value) => {
            switch(value) {
              case 1: return "Chưa đạt";
              case 2: return "Đạt";
              case 3: return "Khá";
              case 4: return "Tốt";
              default: return "-";
            }
          };
          
          const getPerformanceText = (value) => {
            switch(value) {
              case 1: return "Chưa đạt";
              case 2: return "Đạt";
              case 3: return "Khá";
              case 4: return "Tốt";
              default: return "-";
            }
          };

          //Lên lớp
          // const getPerformanceText = (value) => {
          //   switch(value) {
          //     case 1: return "Được lên lớp";
          //     case 2: return "Ở lại lớp";
          //     // /case 3: return "Chuyển trường";
          //     default: return "-";
          //   }
          // };
          
          const finalDataRow = sheet.addRow([
            resultFinalYear?.avG_Semester1_Score || "-",
            resultFinalYear?.avG_Semester2_Score || "-",
            resultFinalYear?.avG_Semester_Score_Final || "-",
            getConductText(resultFinalYear?.eConduct_Final),
            getPerformanceText(resultFinalYear?.ePerformance_Final),
            getClassificationText(resultFinalYear?.classification_Final),
            "", // Lên lớp - có thể thêm logic sau
            resultFinalYear?.comment_Final || "Chưa có nhận xét"
          ]);
          
          finalDataRow.font = { size: 12, name: "Times New Roman" };
          finalDataRow.alignment = { horizontal: "center", vertical: "middle" };
          
          // Merge nhận xét để chiếm các cột còn lại
          if (numColumns >= 8) {
            sheet.mergeCells(finalDataRow.number, 8, finalDataRow.number, numColumns);
          }
          
          applyBorders(finalDataRow);
          
          // Căn chỉnh height cho các dòng bảng kết quả cuối năm
          sheet.getRow(finalResultTitleRow.number).height = 25;
          sheet.getRow(finalHeaderRow.number).height = 20;
          sheet.getRow(finalDataRow.number).height = 20;
        }

        // Auto resize
        sheet.columns.forEach((column, index) => {
          column.width = index === 1 ? 25 : 18;
        });

        // Height
        sheet.getRow(11).height = 25;
        sheet.getRow(12).height = 20;
        sheet.getRow(9).height = 20;
      });

      if (workbook.worksheets.length === 0) {
        message.error("Không có dữ liệu hợp lệ để tạo file Excel!");
        return;
      }

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });

      const className = classData?.className || 'lop';
      const defaultFilename = `ket_qua_hoc_tap_${className}_${year?.replace('-', '_')}_HK${semester}.xlsx`;
      saveAs(blob, filename || defaultFilename);

      message.success("Xuất file Excel thành công!");
    } catch (error) {
      console.error("Lỗi khi xuất Excel:", error);
      message.error("Có lỗi xảy ra khi xuất file Excel!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="primary"
      icon={<DownloadOutlined />}
      onClick={exportToExcel}
      loading={loading}
      style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" , marginRight: "1.9em"}}
    >
      {loading ? "Đang xuất..." : "Xuất Excel Bảng Điểm Lớp"}
    </Button>
  );
};

export default ExportClassScoreExcel;