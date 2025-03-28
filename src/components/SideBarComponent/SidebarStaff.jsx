import React from "react";
import { Layout, Menu } from "antd";
import { DesktopOutlined, UserOutlined, BankOutlined, BookOutlined } from "@ant-design/icons";
import { useLocation, Link } from "react-router-dom";
import { Library, Users, Briefcase } from "lucide-react";
import "../SideBarComponent/SideBar.css";

const { Sider } = Layout;

const Sidebar = () => {
  const location = useLocation(); // Lấy URL hiện tại
  const selectedKey = location.pathname; // Gán key theo đường dẫn

  return (
    <Sider width={250} className="text-white shadow-lg sidebar-custom">
      <div className="flex items-center justify-center p-6">
        <h2 className="text-2xl font-bold text-white">Quản lý nhân viên</h2>
      </div>
      <Menu
        mode="inline"
        theme="dark"
        selectedKeys={[selectedKey]} // Dùng selectedKeys thay vì defaultSelectedKeys
        className="text-white"
      >
        {/* Quản lý nhân viên */}
        <Menu.Item key="/staff/subject" icon={<DesktopOutlined />} className="hover:bg-blue-700">
          <Link to="/staff/subject" className="text-white hover:text-yellow-300">Quản lý môn học</Link>
        </Menu.Item>

        {/* Quản lý học sinh */}
        <Menu.Item key="/staff/schedule" icon={<UserOutlined />} className="hover:bg-blue-700">
          <Link to="/staff/schedule" className="text-white hover:text-yellow-300">Quản lý lịch học</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
