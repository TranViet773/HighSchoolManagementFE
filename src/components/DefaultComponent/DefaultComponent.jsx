import React from "react";
import HeaderComponent from "../HeaderComponent/HeaderComponent";
import { Footer } from "antd/es/layout/layout";
import FooterComponent from "../FooterComponent/FooterComponent";

const DefaultComponent = ({ children }) => {
  return (
    <div className="w-screen h-screen">
      <HeaderComponent />
      {children}
      <FooterComponent />
    </div>
  );
};

export default DefaultComponent;
