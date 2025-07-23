import { useState } from "react";
import { Input, Button, Form } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import "../LogInPage/LogIn.css";
import AuthService from "../../services/authService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChangePasswordPage = () => {
    const [visibleOld, setVisibleOld] = useState(false);
    const [visibleNew, setVisibleNew] = useState(false);

    const handleChangePassword = async (values) => {
        const { OldPassword, NewPassword } = values;
        console.log("comp: "+ OldPassword, NewPassword);
        try {
            await AuthService.changePassword({ OldPassword, NewPassword });
            toast.success("Đổi mật khẩu thành công!", {
                autoClose: 1500,
            });
            setTimeout(() => {
                window.location.href = "/"; // Chuyển về trang đăng nhập sau khi đổi mật khẩu
            }, 1500);
        } catch (error) {
            toast.error(error.message || "Đổi mật khẩu thất bại.", {
                autoClose: 2000,
            });
        }
    };

    return (
        <div className="flex justify-center items-center w-screen">
            <div className="w-full max-w-md p-8 rounded-lg shadow-md bg-blue-100">
                <h1 className="text-center text-2xl font-bold mb-6 text-gray-900">Đổi mật khẩu</h1>
                <Form name="change-password" onFinish={handleChangePassword}>
                    {/* Trường nhập mật khẩu cũ */}
                    <Form.Item name="OldPassword" required>
                        <Input
                            className="mb-4"
                            placeholder="Mật khẩu cũ"
                            type={visibleOld ? "text" : "password"}
                            suffix={
                                visibleOld ? (
                                    <EyeOutlined onClick={() => setVisibleOld(false)} className="cursor-pointer" />
                                ) : (
                                    <EyeInvisibleOutlined onClick={() => setVisibleOld(true)} className="cursor-pointer" />
                                )
                            }
                        />
                    </Form.Item>

                    {/* Trường nhập mật khẩu mới */}
                    <Form.Item name="NewPassword" required>
                        <Input
                            className="mb-4"
                            placeholder="Mật khẩu mới"
                            type={visibleNew ? "text" : "password"}
                            suffix={
                                visibleNew ? (
                                    <EyeOutlined onClick={() => setVisibleNew(false)} className="cursor-pointer" />
                                ) : (
                                    <EyeInvisibleOutlined onClick={() => setVisibleNew(true)} className="cursor-pointer" />
                                )
                            }
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>Đổi mật khẩu</Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default ChangePasswordPage;
