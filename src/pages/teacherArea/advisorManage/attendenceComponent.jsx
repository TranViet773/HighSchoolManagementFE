import React, {useState, useEffect} from "react";
import { Table } from "antd";
import AttendanceService from "../../../services/attendanceService";
import getCurrentYear from "../../../utils/year.util";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import PieChartComponent from "../../../components/ChartsComponent/PieChartComponent";
import LineChartComponent from "../../../components/ChartsComponent/LineChartComponent";
import { values } from "lodash";


const { schoolYear, listYear, semester } = getCurrentYear();
const currentDate = new Date();
const timeStamp = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, "0")}-${currentDate.getDate().toString().padStart(2, "0")}`

const sampleData = [
  {
    id: 1,
    code: "HS001",
    fullName: "Nguyễn Văn A",
    withPermission: 1,
    withoutPermission: 0,
    date: "2024-05-20",
    teacher: "Thầy Hùng",
    subject: "Toán",
    note: "Bị ốm",
  },
  {
    id: 2,
    code: "HS002",
    fullName: "Trần Thị B",
    withPermission: 0,
    withoutPermission: 1,
    date: "2024-05-20",
    teacher: "Cô Lan",
    subject: "Văn",
    note: "Không rõ lý do",
  },
];

const AbsenceReport = ({classId}) => {
  const [attendanceInDay, setAttendanceInDay] = useState(sampleData);
  const [attendanceInWeek, setAttendanceInWeek] = useState(sampleData);
  const [attendanceAll, setAttendanceAll] = useState(sampleData);
  const [pieChartData, setPieChartData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  useEffect(()=>{
    fetchAttendanceDataInDay();
    fetchAttendanceDataInWeek();
    fetchAttendanceDataAll();
  }, []);

  useEffect(() => {
    const attendanceQuatity = CaculateAttendance(attendanceAll);
    const chartData = [
      { name: "Có phép", value: attendanceQuatity.withPermission },
      { name: "Không phép", value: attendanceQuatity.withoutPermission },
    ];
    setPieChartData(chartData);
  }, [attendanceAll]);

  useEffect(() => {
  const fetchData = async () => {
    const data = await GetAbsenceStatisticsForTheMonth(); // giả sử hàm này trả về mảng các tuần
    console.log(data);
    const lineData = data.map((week, index) => ({
      name: `Tuần ${week.week}`,           // hoặc `index + 1` nếu không có `week.week`
      CP: week.withPermission || 0,
      KP: week.withoutPermission || 0
    }));
    setLineChartData(lineData);
  };

  fetchData();
}, [attendanceAll]);


  const fetchAttendanceDataInDay = async () => {
    try {
      const { data } = await AttendanceService.GetAttendanceByClassAndDate({
        classId,
        date: timeStamp,
        year: schoolYear,
      });

      // Map dữ liệu từ API về dạng sampleData
      const mappedData = data.map((item) => ({
        id: item.attendance_Id,
        code: item.attendance_StudentCode, // Thay thế bằng mã học sinh nếu có
        fullName: item.attendance_StudentName, // Cần sửa nếu API có trả về tên học sinh
        withPermission: item.isExcused ? 1 : 0,
        withoutPermission: item.isUnexcused ? 1 : 0,
        date: item.attendance_Timestamp.split("T")[0], // Lấy ngày
        teacher: item.attendance_Teacher,
        subject: item.attendance_SubjectName,
        note: item.attendance_Note || "",
      }));

      setAttendanceInDay(mappedData);
    } catch (error) {
      console.error("Error fetching attendance data for today:", error);
    }
  };

  const fetchAttendanceDataInWeek = async () => {
    try {
      const { data } = await AttendanceService.GetAttendanceByClassAndWeek({
        classId,
        date: timeStamp,
        year: schoolYear,
      });

      // Map dữ liệu từ API về dạng sampleData
      const mappedData = data.map((item) => ({
        id: item.attendance_Id,
        code: item.attendance_StudentCode, // Thay thế bằng mã học sinh nếu có
        fullName: item.attendance_StudentName, // Cần sửa nếu API có trả về tên học sinh
        withPermission: item.isExcused ? 1 : 0,
        withoutPermission: item.isUnexcused ? 1 : 0,
        date: item.attendance_Timestamp.split("T")[0], // Lấy ngày
        teacher: item.attendance_Teacher,
        subject: item.attendance_SubjectName,
        note: item.attendance_Note || "",
      }));

      setAttendanceInWeek(mappedData);
    } catch (error) {
      console.error("Error fetching attendance data for today:", error);
    }
  };

  const fetchAttendanceDataAll = async () => {
    try {
      const { data } = await AttendanceService.GetAttendancesByClass({
        classId,
        year: schoolYear,
      });

      // Map dữ liệu từ API về dạng sampleData
      const mappedData = data.map((item) => ({
        id: item.attendance_Id,
        code: item.attendance_StudentCode, // Thay thế bằng mã học sinh nếu có
        fullName: item.attendance_StudentName, // Cần sửa nếu API có trả về tên học sinh
        withPermission: item.isExcused ? 1 : 0,
        withoutPermission: item.isUnexcused ? 1 : 0,
        date: item.attendance_Timestamp.split("T")[0], // Lấy ngày
        teacher: item.attendance_Teacher,
        subject: item.attendance_SubjectName,
        note: item.attendance_Note || "",
      }));

      setAttendanceAll(mappedData);
    } catch (error) {
      console.error("Error fetching attendance data for all:", error);
    }
  }

  const CaculateAttendance = (attendanceAll) => {
    const total =  attendanceAll.reduce((acc, current) => {
      acc.withPermission += current.withPermission;
      acc.withoutPermission += current.withoutPermission;
      return acc;
    }, { withPermission: 0, withoutPermission: 0 });
    return total;
  }

  const GetAbsenceStatisticsForTheMonth = async () =>{
    try{
      const {data} = await AttendanceService.GetAbsenceStatisticsForTheMonth(classId, schoolYear);
      console.log(data)
      if(data?.length > 0 ){
        return data;
      }
      return null;
    }catch(e){
      console.log(e);
    }
  }

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Mã HS",
      dataIndex: "code",
      key: "code",
      render: (text) => <span className="text-blue-600 font-medium">{text}</span>,
    },
    {
      title: "Tên HS",
      dataIndex: "fullName",
      key: "fullName",
      render: (text) => <span className="text-blue-600">{text}</span>,
    },
    {
      title: "Vắng có phép",
      dataIndex: "withPermission",
      key: "withPermission",
      sorter: (a, b) => a.withPermission - b.withPermission,
    },
    {
      title: "Vắng không phép",
      dataIndex: "withoutPermission",
      key: "withoutPermission",
      sorter: (a, b) => a.withoutPermission - b.withoutPermission,
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      render: (text) => <span className="text-green-600">{text}</span>,
    },
    {
      title: "GV điểm danh",
      dataIndex: "teacher",
      key: "teacher",
    },
    {
      title: "Môn học",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
    },
  ];

  const renderSection = (title, data) => {
    const totalWithPermission = data.reduce((sum, d) => sum + d.withPermission, 0);
    const totalWithoutPermission = data.reduce((sum, d) => sum + d.withoutPermission, 0);

    return (
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-left text-gray-800">{title}</h2>
        <hr className="my-2 border-gray-400" />
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          pagination={false}
          className="border border-gray-400 rounded-md"
        />
        <div className="mt-2 text-right text-sm font-medium text-red-600">
          Tổng vắng có phép: {totalWithPermission} | Không phép: {totalWithoutPermission}
        </div>
      </div>
    );
  };
  
  console.log(lineChartData);
  return (
    <div className="p-4">
      <div className="flex">
        <PieChartComponent PieChartData={pieChartData}/>
        <LineChartComponent LineChartData={lineChartData} column1="CP" column2="KP"/>
      </div>
      {renderSection("Hôm nay", attendanceInDay)}
      {renderSection("Tuần này", attendanceInWeek)}
      {renderSection("Tất cả", attendanceAll)}
    </div>
  );
};

export default AbsenceReport;
