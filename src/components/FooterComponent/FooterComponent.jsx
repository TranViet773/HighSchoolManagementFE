import React from "react";
import { Layout, Row, Col } from "antd";
import { HeartFilled } from "@ant-design/icons";

const { Footer } = Layout;

const AppFooter = () => {
  return (
    <Footer className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <Row gutter={[16, 16]}>
          {/* About Section */}
          <Col xs={24} md={8}>
            <h3 className="text-lg font-semibold text-primary mb-4">Về <strong className="text-blue-500">Pharmative</strong></h3>
            <p className="text-gray-600">
              Chúng tôi tự hào là một nhà cung cấp dược phẩm đáng tin cậy, chất lượng và được nhiều người sử dụng đánh giá tích cực.
            </p>
          </Col>

          {/* Navigation Section */}
          <Col xs={24} md={8}>
            <h3 className="text-lg font-semibold text-primary mb-4">Điều hướng</h3>
            <ul className="list-none space-y-2">
              <li><a href="/" className="text-gray-600 hover:text-primary">Trang chủ</a></li>
              <li><a href="/products/list" className="text-gray-600 hover:text-primary">Sản phẩm</a></li>
              <li><a href="/aboutus" className="text-gray-600 hover:text-primary">Về chúng tôi</a></li>
              <li><a href="/contactus" className="text-gray-600 hover:text-primary">Liên hệ</a></li>
            </ul>
          </Col>

          {/* Contact Info */}
          <Col xs={24} md={8}>
            <h3 className="text-lg font-semibold text-primary mb-4">Thông tin liên lạc</h3>
            <ul className="list-none space-y-2 text-gray-600">
              <li>Pharmative, đường 3 tháng 2, phường Xuân Khánh, quận Ninh Kiều, TP.Cần Thơ</li>
              <li><a href="tel://23923929210" className="hover:text-primary">+8438090909</a></li>
              <li><a href="mailto:emailaddress@domain.com" className="hover:text-primary">support@pharmative.com</a></li>
            </ul>
          </Col>
        </Row>
        {/* Copyright */}
        <div className="text-center mt-8 text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} All rights reserved | Made with <HeartFilled className="text-red-500" /> by <a href="#" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Pharmative</a>
          </p>
        </div>
      </div>
    </Footer>
  );
};

export default AppFooter;
