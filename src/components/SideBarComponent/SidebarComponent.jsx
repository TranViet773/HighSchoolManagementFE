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
        <h2 className="text-2xl font-bold text-white">Quản lý hệ thống</h2>
      </div>
      <Menu
        mode="inline"
        theme="dark"
        selectedKeys={[selectedKey]} // Dùng selectedKeys thay vì defaultSelectedKeys
        className="text-white"
      >
        {/* Quản lý nhân viên */}
        <Menu.Item key="/" icon={<DesktopOutlined />} className="hover:bg-blue-700">
          <Link to="/" className="text-white hover:text-yellow-300">Quản lý nhân viên</Link>
        </Menu.Item>

        {/* Quản lý học sinh */}
        <Menu.Item key="/admin/student" icon={<UserOutlined />} className="hover:bg-blue-700">
          <Link to="/admin/student" className="text-white hover:text-yellow-300">Quản lý học sinh</Link>
        </Menu.Item>

        {/* Quản lý giáo viên */}
        <Menu.Item key="/admin/teacher" icon={<Briefcase  />} className="hover:bg-blue-700">
          <Link to="/admin/teacher" className="text-white hover:text-yellow-300">Quản lý giáo viên</Link>
        </Menu.Item>
        <Menu.Item key="/admin/class" icon={<BankOutlined  />} className="hover:bg-blue-700">
          <Link to="/admin/class" className="text-white hover:text-yellow-300">Quản lý lớp học</Link>
        </Menu.Item>
        <Menu.Item key="/admin/subject" icon={<BookOutlined  />} className="hover:bg-blue-700">
          <Link to="/admin/subject" className="text-white hover:text-yellow-300">Quản lý môn học</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
