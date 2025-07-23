import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;
const currentDay = new Date().getDate();

// Đăng ký font Roboto
Font.register({
  family: 'Roboto',
  src: "/fonts/Roboto-Regular.ttf",
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Roboto',
    fontSize: 11,
    lineHeight: 1.3,
  },
  
  // Header styles
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottom: '1px solid #000',
    paddingBottom: 10,
  },
  headerLeft: {
    width: '45%',
    textAlign: 'center',
  },
  headerRight: {
    width: '45%',
    textAlign: 'center',
  },
  orgName: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  schoolName: {
    fontSize: 11,
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
  nation: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  motto: {
    fontSize: 10,
    //fontStyle: 'italic',
    textDecoration: 'underline',
  },

  // Title section
  titleSection: {
    textAlign: 'center',
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 12,
    //fontStyle: 'italic',
  },

  // Photo and basic info section
  photoInfoSection: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  photoContainer: {
    width: '25%',
    alignItems: 'center',
  },
  photoBox: {
    width: 80,
    height: 100,
    border: '2px solid #000',
    textAlign: 'center',
    fontSize: 9,
    paddingTop: 40,
    backgroundColor: '#f8f8f8',
  },
  basicInfoContainer: {
    width: '75%',
    paddingLeft: 20,
  },

  // Info sections
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 8,
    textAlign: 'center',
    backgroundColor: '#f0f0f0',
    padding: 5,
    borderRadius: 3,
  },
  
  // Info rows
  infoRow: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'flex-start',
  },
  labelContainer: {
    width: '30%',
  },
  label: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  valueContainer: {
    width: '70%',
  },
  value: {
    fontSize: 11,
    borderBottom: '1px dotted #666',
    paddingBottom: 2,
    minHeight: 15,
  },
  
  // Two column layout
  twoColumnRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  leftColumn: {
    width: '50%',
    paddingRight: 10,
  },
  rightColumn: {
    width: '50%',
    paddingLeft: 10,
  },

  // Address section
  addressSection: {
    marginBottom: 15,
  },
  addressTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  addressRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  addressLabel: {
    width: '25%',
    fontSize: 10,
    fontWeight: 'bold',
  },
  addressValue: {
    width: '75%',
    fontSize: 10,
    borderBottom: '1px dotted #666',
    paddingBottom: 1,
  },

  // Guardian section  
  guardianSection: {
    marginBottom: 15,
  },
  guardianRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  guardianLeft: {
    width: '50%',
    paddingRight: 10,
  },
  guardianRight: {
    width: '50%',
    paddingLeft: 10,
  },

  // Footer section
  footer: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerLeft: {
    width: '45%',
    textAlign: 'center',
  },
  footerRight: {
    width: '45%',
    textAlign: 'center',
  },
  footerTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  footerDate: {
    fontSize: 11,
    //fontStyle: 'italic',
    marginBottom: 30,
  },
  footerName: {
    fontSize: 11,
    fontWeight: 'bold',
  },

  // Confirmation section
  confirmationSection: {
    marginTop: 20,
    padding: 10,
    border: '1px solid #000',
    textAlign: 'center',
  },
  confirmationTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  confirmationText: {
    fontSize: 10,
    //fontStyle: 'italic',
  },
});

const PDFComponent = ({ studentInfo, guardianInfo, advisorInfo }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '___/___/______';
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const formatGender = (gender) => {
    if (gender === true || gender === 'true' || gender === 'Nam') return 'Nam';
    if (gender === false || gender === 'false' || gender === 'Nữ') return 'Nữ';
    return '________________';
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <Text style={styles.orgName}>BỘ GIÁO DỤC VÀ ĐÀO TẠO</Text>
            <Text style={styles.schoolName}>TRƯỜNG THPT ABC</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.nation}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</Text>
            <Text style={styles.motto}>Độc lập - Tự do - Hạnh phúc</Text>
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>PHIẾU THÔNG TIN LÝ LỊCH HỌC SINH</Text>
          <Text style={styles.subTitle}>Năm học {currentYear - 1} - {currentYear}</Text>
        </View>

        {/* Photo and Basic Info */}
        <View style={styles.photoInfoSection}>
          <View style={styles.photoContainer}>
            <Text style={styles.photoBox}>Ảnh 3x4 cm</Text>
          </View>
          <View style={styles.basicInfoContainer}>
            <View style={styles.infoRow}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Họ và tên:</Text>
              </View>
              <View style={styles.valueContainer}>
                <Text style={styles.value}>{studentInfo?.fullName || '________________________________'}</Text>
              </View>
            </View>
            
            <View style={styles.twoColumnRow}>
              <View style={styles.leftColumn}>
                <View style={styles.infoRow}>
                  <View style={styles.labelContainer}>
                    <Text style={styles.label}>Mã HS:</Text>
                  </View>
                  <View style={styles.valueContainer}>
                    <Text style={styles.value}>{studentInfo?.code || '______________'}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.rightColumn}>
                <View style={styles.infoRow}>
                  <View style={styles.labelContainer}>
                    <Text style={styles.label}>Lớp:</Text>
                  </View>
                  <View style={styles.valueContainer}>
                    <Text style={styles.value}>{studentInfo?.classCode || '______________'}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.twoColumnRow}>
              <View style={styles.leftColumn}>
                <View style={styles.infoRow}>
                  <View style={styles.labelContainer}>
                    <Text style={styles.label}>Giới tính:</Text>
                  </View>
                  <View style={styles.valueContainer}>
                    <Text style={styles.value}>{formatGender(studentInfo?.gender)}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.rightColumn}>
                <View style={styles.infoRow}>
                  <View style={styles.labelContainer}>
                    <Text style={styles.label}>Ngày sinh:</Text>
                  </View>
                  <View style={styles.valueContainer}>
                    <Text style={styles.value}>{formatDate(studentInfo?.doB)}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.twoColumnRow}>
              <View style={styles.leftColumn}>
                <View style={styles.infoRow}>
                  <View style={styles.labelContainer}>
                    <Text style={styles.label}>Năm nhập học:</Text>
                  </View>
                  <View style={styles.valueContainer}>
                    <Text style={styles.value}>{formatGender(studentInfo?.gender)}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.rightColumn}>
                <View style={styles.infoRow}>
                  <View style={styles.labelContainer}>
                    <Text style={styles.label}>Năm tốt nghiệp:</Text>
                  </View>
                  <View style={styles.valueContainer}>
                    <Text style={styles.value}>{formatDate(studentInfo?.doB)}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Address Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>I. THÔNG TIN CƯ TRÚ</Text>
          <View style={styles.addressSection}>
            <View style={styles.addressRow}>
              <Text style={styles.addressLabel}>Địa chỉ chi tiết:</Text>
              <Text style={styles.addressValue}>
                {studentInfo?.address?.address_Detail || '________________________________________________'}
              </Text>
            </View>
            <View style={styles.addressRow}>
              <Text style={styles.addressLabel}>Phường/Xã:</Text>
              <Text style={styles.addressValue}>
                {studentInfo?.address?.ward_Name || '________________________________________________'}
              </Text>
            </View>
            <View style={styles.addressRow}>
              <Text style={styles.addressLabel}>Quận/Huyện:</Text>
              <Text style={styles.addressValue}>
                {studentInfo?.address?.district_Name || '________________________________________________'}
              </Text>
            </View>
            <View style={styles.addressRow}>
              <Text style={styles.addressLabel}>Tỉnh/Thành phố:</Text>
              <Text style={styles.addressValue}>
                {studentInfo?.address?.province_Name || '________________________________________________'}
              </Text>
            </View>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>II. THÔNG TIN LIÊN LẠC</Text>
          <View style={styles.twoColumnRow}>
            <View style={styles.leftColumn}>
              <View style={styles.infoRow}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>Số điện thoại:</Text>
                </View>
                <View style={styles.valueContainer}>
                  <Text style={styles.value}>{studentInfo?.phoneNumber || '_______________'}</Text>
                </View>
              </View>
            </View>
            <View style={styles.rightColumn}>
              <View style={styles.infoRow}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>Email:</Text>
                </View>
                <View style={styles.valueContainer}>
                  <Text style={styles.value}>{studentInfo?.email || '_______________________'}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Guardian Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>III. THÔNG TIN PHỤ HUYNH</Text>
          <View style={styles.guardianSection}>
            <View style={styles.guardianRow}>
              <View style={styles.guardianLeft}>
                <View style={styles.infoRow}>
                  <View style={styles.labelContainer}>
                    <Text style={styles.label}>Họ tên Cha:</Text>
                  </View>
                  <View style={styles.valueContainer}>
                    <Text style={styles.value}>{guardianInfo?.father || '____________________'}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.guardianRight}>
                <View style={styles.infoRow}>
                  <View style={styles.labelContainer}>
                    <Text style={styles.label}>Họ tên Mẹ:</Text>
                  </View>
                  <View style={styles.valueContainer}>
                    <Text style={styles.value}>{guardianInfo?.mother || '____________________'}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Academic Information */}
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>IV. THÔNG TIN HỌC TẬP</Text>
          <View style={styles.twoColumnRow}>
            <View style={styles.leftColumn}>
              <View style={styles.infoRow}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>Năm nhập học:</Text>
                </View>
                <View style={styles.valueContainer}>
                  <Text style={styles.value}>{studentInfo?.yearEnrolled || '___________'}</Text>
                </View>
              </View>
            </View>
            <View style={styles.rightColumn}>
              <View style={styles.infoRow}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>Dự kiến tốt nghiệp:</Text>
                </View>
                <View style={styles.valueContainer}>
                  <Text style={styles.value}>{studentInfo?.expectedGraduationYear || '___________'}</Text>
                </View>
              </View>
            </View>
          </View>
        </View> */}

        {/* Advisor Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>V. GIÁO VIÊN CHỦ NHIỆM</Text>
          <View style={styles.infoRow}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Họ và tên:</Text>
            </View>
            <View style={styles.valueContainer}>
              <Text style={styles.value}>{advisorInfo?.fullName || '________________________________'}</Text>
            </View>
          </View>
          <View style={styles.twoColumnRow}>
            <View style={styles.leftColumn}>
              <View style={styles.infoRow}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>Mã CB:</Text>
                </View>
                <View style={styles.valueContainer}>
                  <Text style={styles.value}>{advisorInfo?.code || '______________'}</Text>
                </View>
              </View>
            </View>
            <View style={styles.rightColumn}>
              <View style={styles.infoRow}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>SĐT:</Text>
                </View>
                <View style={styles.valueContainer}>
                  <Text style={styles.value}>{advisorInfo?.phoneNumber || '_______________'}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <Text style={styles.footerTitle}>HỌC SINH</Text>
            <Text style={styles.footerDate}>(Ký, ghi rõ họ tên)</Text>
            <Text style={styles.footerName}>{studentInfo?.fullName || ''}</Text>
          </View>
          <View style={styles.footerRight}>
            <Text style={styles.footerDate}>
              Cần Thơ, ngày {currentDay} tháng {currentMonth} năm {currentYear}
            </Text>
            <Text style={styles.footerTitle}>GIÁO VIÊN CHỦ NHIỆM</Text>
            <Text style={styles.footerDate}>(Ký, ghi rõ họ tên)</Text>
            <Text style={styles.footerName}>{advisorInfo?.fullName || ''}</Text>
          </View>
        </View>

        {/* Confirmation */}
        <View style={styles.confirmationSection}>
          <Text style={styles.confirmationTitle}>XÁC NHẬN CỦA NHÀ TRƯỜNG</Text>
          <Text style={styles.confirmationText}>
            Tôi xin cam đoan những thông tin trên là đúng sự thật và chịu trách nhiệm trước pháp luật về tính chính xác của thông tin đã khai.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default PDFComponent;