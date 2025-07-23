import CreateClassPage from "../pages/Class/createClass";
import HomeClassPage from "../pages/Class/homeClass";
import HomePage from "../pages/index";
import LogInPage from "../pages/LogInPage/LogInPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import CreateStudentPage from "../pages/Student/CreateStudent/CreateStudent";
import HomeStudentPage from "../pages/Student/HomeStudent/HomeStudent"; 
import CreateTeacherPage from "../pages/Teacher/CreateTeacher/CreateTeacher";
import HomeTeacherPage from "../pages/Teacher/HomeTeacher/HomeTeacher";
import DetailClassPage from "../pages/Class/detailClass";
import HomeParentPage from "../pages/Parent/homeParent";
import DetailtStudentPage from "../pages/Student/DetailStudent/DetailStudentPage";
import SubjectHomePage from "../pages/Subject/SubjectHomePage";
import HomeStaffPage from "../pages/staffArea";
import SubjectPage from "../pages/staffArea/Subject/Subject";
import SubjectDetailPage from "../pages/staffArea/Subject/SubjectDetail";
import ScheduleHomePage from "../pages/staffArea/Schedule/schedule";
import scheduleDetailPage from "../pages/staffArea/Schedule/scheduleDetail";
import TeacherHomePage from "../pages/teacherArea";
import DashboardAdvisorPage from "../pages/teacherArea/advisorManage/dashboard";
import ChangePassword from "../pages/ChangePassword/ChangePassword";
import StudentInfor from "../pages/teacherArea/advisorManage/studentInfor";
import TeachingManager from "../pages/teacherArea/teachingManage/dashboard";
import ClassInformation from "../pages/teacherArea/teachingManage/classInfor";
import UserInfo from "../pages/staffArea/UserInfo";
import UserInfoTeacher from "../pages/teacherArea/UserInfo";
import Dashboard from "../pages/studentArea";
import ScoreBoard from "../pages/studentArea/scoreBoard";
import SchoolReport from "../pages/studentArea/schoolReport";
import StaffPage from "../pages/Staff/homeStaff";
import CreateStaffPage from "../pages/Staff/createStaff";
import Reevaluation from "../pages/Submittion/Reevaluation";
import ReevaluationPage from "../pages/teacherArea/teachingManage/reevaluation";
import DetailTeacher from "../pages/Teacher/DetailTeacher/DetailTeacher";
import DetailStaffPage from "../pages/Staff/detailStaff";
import SubjectInfoDetailPage from "../pages/Subject/SubjectDetailPage";
import UpgradeClassDashBoard from "../pages/Class/UpgradeClass/UpgradeClassDashboard";
import StatisticalDashboard from "../pages/Statistical/StaticticalDashboard";
// Routes không yêu cầu đăng nhập
export const publicRoutes = [
   { path: "/Home", page: HomePage, isShowHeader: true },
   { path: "/", page: LogInPage, isShowHeader: false },
   { path: "/register", page: RegisterPage, isShowHeader: false },
   { path: "/change-password", page: ChangePassword, isShowHeader: false }
];

// Routes dành cho student
export const studentRoutes = [
   { path: "/student/information/:id", page: SubjectHomePage, isShowHeader: true},
   { path: "/student", page: Dashboard, isShowHeader: true},
   { path: "/student/score-board", page: ScoreBoard, isShowHeader: true},
   { path: "/student/school-report", page: SchoolReport, isShowHeader: true},
];

// Routes dành cho teacher
export const teacherRoutes = [
   {path: "/teacher", page: TeacherHomePage, isShowHeader: true},
   {path: "/teacher/advisor/:teacherId", page: DashboardAdvisorPage, isShowHeader: true},
   {path: "/teacher/advisor/student/:id", page: StudentInfor, isShowHeader: true},
   {path: "/teacher/teaching/:teacherId", page: TeachingManager, isShowHeader: true},
   {path: "/teacher/teaching/class/:classId/year/:year/subject/:subjectId", page: ClassInformation, isShowHeader: true},
   {path: "/teacher/information/:id", page: UserInfoTeacher, isShowHeader: true},
   {path: "/teacher/submition", page: ReevaluationPage, isShowHeader: true}


];
export const adminRoutes = [
   { path: "/admin/teacher", page: HomeTeacherPage, isShowHeader: true },
   { path: "/admin/create-teacher", page: CreateTeacherPage, isShowHeader: true },
   { path: "/admin/teacher/:id", page: DetailTeacher, isShowHeader: true},
   { path: "/admin/student", page: HomeStudentPage, isShowHeader: true },
   { path: "/admin/create-student", page: CreateStudentPage, isShowHeader: true },
   { path: "/admin/student/:id", page: DetailtStudentPage, isShowHeader: true},
   { path: "/admin/create-class", page: CreateClassPage, isShowHeader: true },
   { path: "/admin/class", page: HomeClassPage, isShowHeader: true },
   { path: "/admin/class/:id", page: DetailClassPage, isShowHeader: true},
   { path: "/admin/upgrade-class", page: UpgradeClassDashBoard, isShowHeader: true },
   { path: "/admin/parent", page: HomeParentPage, isShowHeader: true},
   { path: "/admin/subject", page: SubjectHomePage, isShowHeader: true},
   { path: "/admin/subject/:id", page: SubjectInfoDetailPage, isShowHeader: true},
   { path: "/admin/information/:id", page: SubjectHomePage, isShowHeader: true},
   { path: "/admin/staff", page: StaffPage, isShowHeader: true},
   { path: "/admin/staff/create", page: CreateStaffPage, isShowHeader: true},
   { path: "/admin/staff/:id", page: DetailStaffPage, isShowHeader: true},
   { path: "/admin/submit", page: Reevaluation, isShowHeader: true},
   { path: "/admin/statistical", page: StatisticalDashboard, isShowHeader: true}
];

export const staffRoutes = [
  { path: "/staff", page: HomeStaffPage, isShowHeader: true},
  { path: "/staff/subject", page: SubjectPage, isShowHeader: true},
  { path: "/staff/subject/:id", page: SubjectDetailPage, isShowHeader: true},
  { path: "/staff/schedule", page: ScheduleHomePage, isShowHeader: true},
  { path: "/staff/schedule/:id", page: scheduleDetailPage, isShowHeader: true},
  { path: "/staff/information/:id", page: UserInfo, isShowHeader: true},
];
export const parentRoutes = [
  
];
