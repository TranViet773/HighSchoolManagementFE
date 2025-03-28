import React from "react";
import { Layout, Menu } from "antd";
import { DesktopOutlined, UserOutlined, BankOutlined, BookOutlined } from "@ant-design/icons";
import { useLocation, Link } from "react-router-dom";
import { Library, Users, Briefcase } from "lucide-react";
import "../SideBarComponent/SideBar.css";
import { getInforJwt } from "../../tools/utils";

const { Sider } = Layout;

const SidebarTeacher = () => {
  const location = useLocation();
  const selectedKey = location.pathname.startsWith("/teacher/teaching/")
    ? "/teacher/teaching/"
    : location.pathname.startsWith("/teacher/advisor/")
    ? "/teacher/advisor/"
    : "";

  //const selectedKey = location.pathname;
  const idUser = getInforJwt().Id;
  let is_Advisor;
  const currentYear = new Date().getUTCFullYear().toString(); // Lấy năm hiện tại
  if(getInforJwt().isAdvisor == "True" && getInforJwt().timeAdvisor == currentYear){ // cần lưu ý nhưng giá trị của year sẽ được chỉnh sửa thành năm học như thực tế
    is_Advisor = true;
  }
  return (
    <Sider width={250} className="text-white shadow-lg sidebar-custom">
      <div className="flex items-center justify-center p-6">
        <h2 className="text-2xl font-bold text-white">Quản lý giáo viên</h2>
      </div>
      <Menu mode="inline" theme="dark" selectedKeys={[selectedKey]} className="text-white">
      {is_Advisor && (
        <Menu.Item key="/teacher/advisor/" icon={<DesktopOutlined />} className="hover:bg-blue-700">
          <Link to={`/teacher/advisor/${idUser}`} className="text-white hover:text-yellow-300">
            Quản lý chủ nhiệm
          </Link>
        </Menu.Item>
      )}
      <Menu.Item key="/teacher/teaching/" icon={<UserOutlined />} className="hover:bg-blue-700">
        <Link to={`/teacher/teaching/${idUser}`} className="text-white hover:text-yellow-300">
          Quản lý giảng dạy
        </Link>
      </Menu.Item>
    </Menu>
    </Sider>
  );
};

export default SidebarTeacher;
