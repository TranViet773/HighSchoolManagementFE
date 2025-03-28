import { useState } from "react";
import { Input, Button, Form } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import "../RegisterPage/RegisterPage.css"

const RegisterPage = () => {
    const [visible, setVisible] = useState(false);

    return (
        <div className="flex justify-center items-center w-screen">
            <div className="w-full max-w-md p-8 rounded-lg shadow-md bg-blue-100">
                <h1 className="text-center text-2xl font-bold mb-6 text-gray-900">Đăng ký</h1>
                <Form>
                    <Form.Item required>
                        <Input className="mb-4" placeholder="Email" required/>
                    </Form.Item>
                    <Form.Item required>
                        <Input className="mb-4" placeholder="Email" required/>
                    </Form.Item>
                    <Form.Item required>
                        <Input className="mb-4" placeholder="Email" required/>
                    </Form.Item>
                    <Form.Item required>
                        <Input className="mb-4" placeholder="Email" required/>
                    </Form.Item>
                    <Form.Item required>
                        <Input
                             
                            className="mb-4"
                            placeholder="Password"
                            type={visible ? "text" : "password"}
                            suffix={
                                visible ? (
                                    <EyeOutlined onClick={() => setVisible(false)} className="cursor-pointer" />
                                ) : (
                                    <EyeInvisibleOutlined onClick={() => setVisible(true)} className="cursor-pointer" />
                                )
                            }
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" block>Đăng ký</Button>
                    </Form.Item>
                    <p className="text-center text-sm text-gray-600">
                        Bạn chưa có tài khoản? <a href="/register" className="text-blue-500">Đăng ký ngay</a>
                    </p>
                </Form>
            </div>
        </div>
    );
};

export default RegisterPage;
