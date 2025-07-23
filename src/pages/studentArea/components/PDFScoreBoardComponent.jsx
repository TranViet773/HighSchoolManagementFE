import React from "react";
import { Page, Text, View, Document, StyleSheet, Font } from "@react-pdf/renderer";

// Đăng ký font
Font.register({
  family: "Roboto",
  src: "/fonts/Roboto-Regular.ttf",
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Roboto",
    backgroundColor: "#ffffff",
    fontSize: 10,
  },
  header: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  studentInfo: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    marginBottom: 20,
    borderRadius: 8,
    border: "1px solid #e9ecef",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 6,
    alignItems: "center",
  },
  label: {
    fontWeight: "bold",
    width: 100,
    fontSize: 10,
    color: "#495057",
  },
  value: {
    fontSize: 10,
    color: "#212529",
  },
  semesterSection: {
    marginBottom: 25,
    backgroundColor: "#ffffff",
    border: "1px solid #dee2e6",
    borderRadius: 8,
    overflow: "hidden",
  },
  semesterHeader: {
    backgroundColor: "#007bff",
    color: "#ffffff",
    padding: 10,
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  table: {
    width: "100%",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#e9ecef",
    borderBottom: "2px solid #dee2e6",
  },
  tableSubHeader: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    borderBottom: "1px solid #dee2e6",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #dee2e6",
    minHeight: 25,
  },
  subjectCell: {
    width: "20%",
    padding: 8,
    fontWeight: "bold",
    fontSize: 9,
    textAlign: "left",
    borderRight: "1px solid #dee2e6",
    justifyContent: "center",
  },
  groupHeader: {
    width: "20%",
    padding: 6,
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "center",
    borderRight: "1px solid #dee2e6",
    justifyContent: "center",
    backgroundColor: "#e9ecef",
  },
  scoreCell: {
    width: "5%",
    padding: 4,
    fontSize: 8,
    textAlign: "center",
    borderRight: "1px solid #dee2e6",
    justifyContent: "center",
  },
  singleCell: {
    width: "10%",
    padding: 6,
    fontSize: 9,
    textAlign: "center",
    borderRight: "1px solid #dee2e6",
    justifyContent: "center",
  },
  averageCell: {
    width: "10%",
    padding: 6,
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#fff3cd",
    justifyContent: "center",
  },
  summary: {
    padding: 15,
    backgroundColor: "#f8f9fa",
    marginTop: 10,
  },
  summaryRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  summaryLabel: {
    fontWeight: "bold",
    width: 120,
    fontSize: 10,
  },
  summaryValue: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#007bff",
  },
  noData: {
    textAlign: "center",
    fontSize: 14,
    color: "#6c757d",
    marginTop: 50,
  },
});

const PDFScoreBoardComponent = ({ student, scores }) => {
  // Kiểm tra dữ liệu
  if (!scores || scores.length === 0) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={styles.header}>Bảng Điểm Học Sinh</Text>
          <Text style={styles.noData}>Không có dữ liệu điểm để hiển thị</Text>
        </Page>
      </Document>
    );
  }

  const formatScore = (score) => score != null ? score.toString() : "-";
  const formatAverage = (score) => score != null ? score.toFixed(1) : "-";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Bảng Điểm Học Sinh</Text>

        {/* Thông tin học sinh */}
        <View style={styles.studentInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Họ và tên:</Text>
            <Text style={styles.value}>{student?.fullName || "N/A"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Mã học sinh:</Text>
            <Text style={styles.value}>{student?.code || "N/A"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Ngày sinh:</Text>
            <Text style={styles.value}>{student?.doB || "N/A"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Lớp:</Text>
            <Text style={styles.value}>{student?.classCode || "N/A"}</Text>
          </View>
        </View>

        {/* Bảng điểm theo học kỳ */}
        {scores.map((semester, index) => (
          <View key={index} style={styles.semesterSection}>
            <Text style={styles.semesterHeader}>
              Học kỳ {semester.semester} - Năm học {semester.year}
            </Text>

            <View style={styles.table}>
              {/* Header chính - sử dụng Text riêng biệt cho mỗi cột */}
              <View style={styles.tableHeader}>
                <Text style={styles.subjectCell}>Môn học</Text>
                <Text style={styles.groupHeader}>Miệng</Text>
                <Text style={styles.groupHeader}>15p</Text>
                <Text style={styles.singleCell}>1 tiết</Text>
                <Text style={styles.singleCell}>Giữa kỳ</Text>
                <Text style={styles.singleCell}>Cuối kỳ</Text>
                <Text style={styles.averageCell}>TB môn</Text>
              </View>

              {/* Sub header */}
              <View style={styles.tableSubHeader}>
                <Text style={[styles.subjectCell, {backgroundColor: "#f8f9fa"}]}></Text>
                {/* Sub header cho điểm miệng */}
                <Text style={styles.scoreCell}>L1</Text>
                <Text style={styles.scoreCell}>L2</Text>
                <Text style={styles.scoreCell}>L3</Text>
                <Text style={styles.scoreCell}>L4</Text>
                {/* Sub header cho điểm 15p */}
                <Text style={styles.scoreCell}>L1</Text>
                <Text style={styles.scoreCell}>L2</Text>
                <Text style={styles.scoreCell}>L3</Text>
                <Text style={styles.scoreCell}>L4</Text>
                {/* Các cột còn lại */}
                <Text style={[styles.singleCell, {backgroundColor: "#f8f9fa"}]}></Text>
                <Text style={[styles.singleCell, {backgroundColor: "#f8f9fa"}]}></Text>
                <Text style={[styles.singleCell, {backgroundColor: "#f8f9fa"}]}></Text>
                <Text style={[styles.averageCell, {backgroundColor: "#f8f9fa"}]}></Text>
              </View>

              {/* Dữ liệu điểm */}
              {semester?.scoreOfSubjectResponses?.map((subject, idx) => (
                <View key={idx} style={styles.tableRow}>
                  <Text style={styles.subjectCell}>
                    {subject?.subjects?.subject_Name || `Môn ${idx + 1}`}
                  </Text>
                  
                  {/* Điểm miệng */}
                  <Text style={styles.scoreCell}>{formatScore(subject?.oralScore)}</Text>
                  <Text style={styles.scoreCell}>{formatScore(subject?.oralScore1)}</Text>
                  <Text style={styles.scoreCell}>{formatScore(subject?.oralScore2)}</Text>
                  <Text style={styles.scoreCell}>{formatScore(subject?.oralScore3)}</Text>
                  
                  {/* Điểm 15 phút */}
                  <Text style={styles.scoreCell}>{formatScore(subject?.quizScore)}</Text>
                  <Text style={styles.scoreCell}>{formatScore(subject?.quizScore1)}</Text>
                  <Text style={styles.scoreCell}>{formatScore(subject?.quizScore2)}</Text>
                  <Text style={styles.scoreCell}>{formatScore(subject?.quizScore3)}</Text>
                  
                  {/* Các điểm khác */}
                  <Text style={styles.singleCell}>{formatScore(subject?.testScore)}</Text>
                  <Text style={styles.singleCell}>{formatScore(subject?.midTermScore)}</Text>
                  <Text style={styles.singleCell}>{formatScore(subject?.finalExamScore)}</Text>
                  <Text style={styles.averageCell}>{formatAverage(subject?.averageScore)}</Text>
                </View>
              ))}

            </View>

            {/* Tổng kết học kỳ */}
            <View style={styles.summary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Điểm TB học kỳ:</Text>
                <Text style={styles.summaryValue}>
                  {formatAverage(semester.avG_Semester_Score)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Xếp loại:</Text>
                <Text style={styles.summaryValue}>{semester.classification || "Chưa xếp loại"}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Nhận xét:</Text>
                <Text style={styles.summaryValue}>{semester.comment || "Không có nhận xét"}</Text>
              </View>
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default PDFScoreBoardComponent;