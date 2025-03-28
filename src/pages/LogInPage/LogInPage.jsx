import { useEffect, useState } from "react";
import { Input, Button, Form } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import "../LogInPage/LogIn.css";
import AuthService from "../../services/authService";
import { saveTokens } from "../../tools/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {getInforJwt} from "../../tools/utils"
const LogInPage = () => {
    const [visible, setVisible] = useState(false);
    const Login = async (values) =>{
        const {email, password} = values;
        try {
            const { data } =  await AuthService.Login({ email, password });
            saveTokens(data.accessToken, data.refreshToken); // Save tokens to local storage
            toast.success('Login successful!', {
              autoClose: 1000,
            });
            const role = getInforJwt().role; 
            switch(role){
                case 'SYS_ADMIN':
                    window.location.href = '/admin/student';
                    break;
                case 'TEACHER':
                    {
                        //check xem pass có còn hiệu lực(được đổi lần đầu chưa)
                        if(getInforJwt().IsActive == "False" || getInforJwt.IsBlocked == "False"){
                            window.location.href = '/change-password'
                        }
                        else{
                            if(getInforJwt.IsBlocked == "True"){
                                window.location.href = '/abc';
                            }
                            else{
                                window.location.href = `/teacher/advisor/${getInforJwt().Id}`;
                            }
                        }
                    }
                    break;
                case 'STUDENT':
                    window.location.href = '/student';
                    break;
                case 'PARENT':
                        window.location.href = '/parent';
                        break;
                case 'MANAGERMENT_STAFF':
                    window.location.href = '/staff';
                    break;       
                default:
                    toast.error('Role not found.', {
                        autoClose: 2000,
                    });
                    break;
            }
          } catch (error) {
            toast.error(error.message || 'Login failed.', {
              autoClose: 2000,
            });
          }
    }
    return (
        <div className="flex justify-center items-center w-screen">
            <div className="w-full max-w-md p-8 rounded-lg shadow-md bg-blue-100">
                <h1 className="text-center text-2xl font-bold mb-6 text-gray-900">Đăng nhập</h1>
                <Form
                    name="login"
                    initialValues={{remember: true}}   
                    onFinish={Login} 
                >
                    <Form.Item 
                        name="email"
                        required
                    >
                        <Input className="mb-4" placeholder="Email" required/>
                    </Form.Item>
                    <Form.Item 
                        required
                        name="password"
                    >
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
                        <Button type="primary" htmlType="submit" block>Đăng nhập</Button>
                    </Form.Item>
                    <p className="text-center text-sm text-gray-600">
                        Bạn chưa có tài khoản? <a href="/register" className="text-blue-500">Đăng ký ngay</a>
                    </p>
                </Form>
            </div>
        </div>
    );
};

export default LogInPage;
