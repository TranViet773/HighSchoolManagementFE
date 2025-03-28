import React from 'react';
import { Layout, Menu, Input, Badge, Drawer, Button, Dropdown } from 'antd';
import { ShoppingCartOutlined, SearchOutlined, MenuOutlined, UserOutlined, CarryOutOutlined, SettingOutlined, LogoutOutlined } from "@ant-design/icons";
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import { Link, useNavigate } from 'react-router-dom';
import { getRefreshToken, removeTokens } from '../../tools/auth';
import AuthService from '../../services/authService';
import "../HeaderComponent/Header.css"
const { Header } = Layout;

function HeaderComponent() {
  const navigate = useNavigate();
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
        <Menu.Item key="1" icon={<SettingOutlined />}>
          Cài đặt tài khoản
        </Menu.Item>
        <Menu.Item key="2" icon={<LogoutOutlined />} onClick={handleLogout}>
          Đăng xuất
        </Menu.Item>
      </Menu>
    );
  return (
    <>
      <Header className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 p-5 shadow-md text-white">
        {/* Logo */}
        <div className="text-2xl font-bold text-white">ESchool</div>

        {/* Search */}
        <Input 
          placeholder="Search" 
          prefix={<SearchOutlined />} 
          className="max-w-xs ml-5 border-blue bg-transparent text-white focus:border-white focus:ring-0"
        />

        {/* Desktop Menu */}
        <div className="hidden md:flex">
          <Menu 
            mode="horizontal" 
            className="w-100 custom-menu" 
            style={{ borderBottom: 'none' }} 
            items={[
              { key: 'home', label: <a href="/" className="text-white custom-item">Trang Chủ</a> },
              { key: 'about', label: <a href="/aboutus" className="text-white custom-item">Về Chúng Tôi</a> },
              { key: 'contact', label: <a href="/contactus" className="text-white custom-item">Liên Hệ</a> },
            ]}
          />
        </div>

        {/* Mobile Menu */}
        <div className="flex md:hidden">
          <Button type="primary" className="bg-blue-600">
            <MenuOutlined className="text-white" />
          </Button>
          <Drawer title="Menu" placement="right" className="bg-blue-600 text-white">
            <Menu mode="vertical" items={[
              { key: 'home', label: <a href="/" className="text-white">Trang Chủ</a> },
              { key: 'product', label: <a href="/product" className="text-white">Sản Phẩm</a> },
              { key: 'about', label: <a href="/aboutus" className="text-white">Về Chúng Tôi</a> },
              { key: 'contact', label: <a href="/contactus" className="text-white">Liên Hệ</a> },
              { key: 'login', label: <a href="/login" className="text-white">Đăng nhập</a> },
            ]} />
          </Drawer>
        </div>

        {/* Cart & Order Icons */}
        <div className="flex items-center">
          {true && (
            <div className="mr-5">
              <Badge count={0} offset={[10, 0]}>
                <Link to="/order">
                  <CarryOutOutlined className="text-2xl text-white" />
                </Link>
              </Badge>
            </div>
          )}
          
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
  