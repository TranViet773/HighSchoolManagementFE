import React from "react";
import { ConfigProvider, App as AntApp } from "antd";
import { ToastContainer } from "react-toastify";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { publicRoutes, studentRoutes, teacherRoutes, adminRoutes, parentRoutes, staffRoutes } from "./routes";
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
import { getInforJwt } from "./tools/utils";
import "./index.css";
import "./style.css";

// Hàm lấy role từ localStorage


function App() {
  const role = getInforJwt().role;

  // Chọn routes theo role
  let roleRoutes = [];
  switch(role) {
    case "STUDENT":
      roleRoutes = studentRoutes;
      break;
    case "PARENT":
      roleRoutes = parentRoutes;
      break;
    case "TEACHER":
      roleRoutes = teacherRoutes;
      break;
    case "SYS_ADMIN":
      roleRoutes = adminRoutes;
      break; 
    case "MANAGERMENT_STAFF":
        roleRoutes = staffRoutes;
        break;
    default:
      roleRoutes = publicRoutes;
      break;
  }

  return (
    <ConfigProvider>
      <AntApp>
        <ToastContainer />
        <BrowserRouter>
          <Routes>
            {/* Public Routes (Ai cũng truy cập được) */}
            {publicRoutes.map(({ path, page: Page, isShowHeader }) => {
              const Layout = isShowHeader ? DefaultComponent : React.Fragment;
              return (
                <Route
                  key={path}
                  path={path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}

            {/* Role-Based Routes */}
            {roleRoutes.map(({ path, page: Page, isShowHeader }) => {
              const Layout = isShowHeader ? DefaultComponent : React.Fragment;
              return (
                <Route
                  key={path}
                  path={path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}

            {/* Điều hướng nếu không có quyền */}
            {role === "guest" && <Route path="*" element={<Navigate to="/" />} />}
          </Routes>
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;
