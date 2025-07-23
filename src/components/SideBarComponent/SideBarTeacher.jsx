import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import {
  DesktopOutlined,
  BookOutlined,
  FileSearchOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useLocation, Link } from "react-router-dom";
import "../SideBarComponent/SideBar.css";
import { getInforJwt } from "../../tools/utils";

const { Sider } = Layout;

const SidebarTeacher = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => setCollapsed(!collapsed);

  const idUser = getInforJwt().Id;
  const currentYear = new Date().getUTCFullYear().toString();
  const isAdvisor =
    getInforJwt().isAdvisor === "True"
    // getInforJwt().timeAdvisor === currentYear;
    // console.log("isAdvisor", isAdvisor);
    // console.log("currentYear", currentYear);
  const selectedKey = location.pathname.startsWith("/teacher/advisor/")
    ? "/teacher/advisor/"
    : location.pathname.startsWith("/teacher/teaching/")
    ? "/teacher/teaching/"
    : location.pathname.startsWith("/teacher/submition/")
    ? "/teacher/submition/"
    : "";

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      width={250}
      className="shadow-lg sidebar-custom"
    >
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800">
        {!collapsed && (
          <h2 className="text-white text-lg font-bold">Quản lý giáo viên</h2>
        )}
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleCollapsed}
          style={{ color: "white" }}
        />
      </div>

      <Menu
        mode="inline"
        theme="dark"
        selectedKeys={[selectedKey]}
        defaultOpenKeys={["sub1"]}
        inlineCollapsed={collapsed}
      >
        {isAdvisor && (
          <Menu.Item
            key="/teacher/advisor/"
            icon={<DesktopOutlined />}
            className="hover:bg-blue-700"
          >
            <Link to={`/teacher/advisor/${idUser}`}>
              Quản lý chủ nhiệm
            </Link>
          </Menu.Item>
        )}

        <Menu.SubMenu
          key="sub1"
          icon={<BookOutlined />}
          title="Học vụ"
        >
          <Menu.Item
            key="/teacher/submition/"
            icon={<FileSearchOutlined />}
            className="hover:bg-blue-700"
          >
            <Link to={`/teacher/submition/`}>
              Phúc khảo
            </Link>
          </Menu.Item>
          <Menu.Item
            key="/teacher/teaching/"
            icon={<DesktopOutlined />}
            className="hover:bg-blue-700"
          >
            <Link to={`/teacher/teaching/${idUser}`}>
              Giảng dạy
            </Link>
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
    </Sider>
  );
};

export default SidebarTeacher;
