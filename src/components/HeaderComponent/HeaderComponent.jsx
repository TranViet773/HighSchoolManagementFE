import React from 'react';
import { Layout, Menu, Input, Badge, Drawer, Button, Dropdown } from 'antd';
import { ShoppingCartOutlined, SearchOutlined, MenuOutlined, UserOutlined, CarryOutOutlined, SettingOutlined, LogoutOutlined, KeyOutlined } from "@ant-design/icons";
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import { Link, useNavigate } from 'react-router-dom';
import { getRefreshToken, removeTokens } from '../../tools/auth';
import AuthService from '../../services/authService';
import "../HeaderComponent/Header.css"
import { getInforJwt } from '../../tools/utils';
const { Header } = Layout;

function HeaderComponent() {
  const id = getInforJwt().Id;
  const role = getInforJwt().role;
  const navigate = useNavigate();

  let linkPath = "";

  switch (role) {
    case "TEACHER":
      linkPath = `/teacher/information/${id}`;
      break;
    case "MANAGERMENT_STAFF":
      linkPath = `/staff/information/${id}`;
      break;
    case "STUDENT": 
      linkPath = `/student/information/${id}`;
    case "SYS_ADMIN": 
      linkPath = `/admin/information/${id}`;  
    default:
      linkPath = null;
  }

  const handleLogout = async () => 
    {
      const refreshToken = await getRefreshToken();
      if (!refreshToken) {
        console.log('Refresh token do not exist');
        navigate("/");
      }
      const {data} = await AuthService.LogOut(refreshToken);
      removeTokens();
      navigate("/");
    };
    const menu = (
      <Menu>
        {
          linkPath && (
            <Menu.Item key="1" icon={<SettingOutlined />}>
              <Link to={linkPath}>Cài đặt tài khoản</Link>
            </Menu.Item>
          )
        }
        <Menu.Item key="2" icon={<KeyOutlined />} >
          <Link to="/change-password">Đổi mật khẩu</Link>
        </Menu.Item>
        
        <Menu.Item key="3" icon={<LogoutOutlined />} onClick={handleLogout}>
          Đăng xuất
        </Menu.Item>
      </Menu>
    );
  return (
    <>
      <Header className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 p-5 shadow-md text-white">
        {/* Logo */}
        <div className="text-2xl font-bold text-white">ESchool</div>
        {/* Cart & Order Icons */}
        <div className="flex items-center">
          <Dropdown overlay={menu} trigger={["hover"]} placement="bottomRight">
            <span className="cursor-pointer">
              <UserOutlined className="text-2xl text-white ml-5" style={{color: '#4169e1'}} />
            </span>
          </Dropdown>
        </div>
      </Header>

      <ToastContainer />
    </>
  );
}

export default HeaderComponent;
  