import React, { useState } from "react";
import {
  UserOutlined,
  TeamOutlined,
  SolutionOutlined,
  ScheduleOutlined,
  FileTextOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BookOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button } from "antd";
import { useLocation, Link } from "react-router-dom";
import "./SideBar.css";

const { Sider } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const location = useLocation();

  // Xác định selectedKey dựa vào pathname
  const selectedKey = (() => {
    const path = location.pathname;
    if (path.startsWith('/admin/teacher')) return '/admin/teacher';
    if (path.startsWith('/admin/student')) return '/admin/student';
    if (path.startsWith('/admin/staff')) return '/admin/staff';
    if (path.startsWith('/admin/score')) return '/admin/score';
    if (path.startsWith('/admin/schedule')) return '/admin/schedule';
    if (path.startsWith('/admin/class')) return '/admin/class';
    if (path.startsWith('/admin/upgrade-class')) return '/admin/upgrade-class';
    if (path.startsWith('/admin/subject')) return '/admin/subject';
    if (path.startsWith('/admin/submit')) return '/admin/submit';
    if (path.startsWith('/admin/statistical')) return '/admin/statistical';
    return '';
  })();

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      width={250}
      className="shadow-lg sidebar-custom"
    >
      <div className="flex items-center justify-between px-4 py-3 bg-blue-600">
        <h2 className="text-lg text-white font-bold">
          {!collapsed && "Quản trị viên"}
        </h2>
        <Button
          type="text"
          onClick={toggleCollapsed}
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          className="text-white"
        />
      </div>

      <Menu
        mode="inline"
        theme="dark"
        selectedKeys={[selectedKey]}
        defaultOpenKeys={["account", "academic"]}
      >
        {/* Quản lý tài khoản */}
        <Menu.SubMenu key="account" icon={<TeamOutlined />} title="Quản lý tài khoản">
          <Menu.Item key="/admin/teacher" icon={<UserOutlined />}>
            <Link to="/admin/teacher">Giáo viên</Link>
          </Menu.Item>
          <Menu.Item key="/admin/student" icon={<UserOutlined />}>
            <Link to="/admin/student">Học sinh</Link>
          </Menu.Item>
          <Menu.Item key="/admin/staff" icon={<SolutionOutlined />}>
            <Link to="/admin/staff">Nhân viên</Link>
          </Menu.Item>
        </Menu.SubMenu>

        {/* Quản lý học vụ */}
        <Menu.SubMenu key="academic" icon={<ScheduleOutlined />} title="Quản lý học vụ">
          {/* <Menu.Item key="/admin/score" icon={<FileTextOutlined />}>
            <Link to="/admin/score">Điểm số</Link>
          </Menu.Item>*/}
          <Menu.Item key="/admin/upgrade-class" icon={<ScheduleOutlined />}>
            <Link to="/admin/upgrade-class">Nâng lớp</Link>
          </Menu.Item> 
          <Menu.Item key="/admin/class" icon={<ScheduleOutlined />}>
            <Link to="/admin/class">Lớp Học</Link>
          </Menu.Item>
          <Menu.Item key="/admin/subject" icon={<BookOutlined />}>
            <Link to="/admin/subject">Quản lý môn học</Link>
          </Menu.Item>
        </Menu.SubMenu>

        {/* Quản lý môn học */}

        {/* Phúc khảo & Khiếu nại */}
        <Menu.Item key="/admin/submit" icon={<FileTextOutlined />}>
          <Link to="/admin/submit">Phúc khảo & Khiếu nại</Link>
        </Menu.Item>

        {/* Báo cáo & Thống kê */}
        <Menu.Item key="/admin/statistical" icon={<BarChartOutlined />}>
          <Link to="/admin/statistical">Thống kê</Link>
        </Menu.Item>
        <Menu.Item key="/admin/statistical" icon={<BarChartOutlined />}>
          <Link to="/admin/statistical">Cài đặt thông tin hệ thống</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
