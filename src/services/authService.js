import axiosInstance, { service } from "../tools/axios.tool";
import { getInforJwt } from "../tools/utils";
import getCurrentYear from "../utils/year.util"
//const {schoolYear} = getCurrentYear();
const AuthService = {
    async Login({ email, password }) {
        try {
            console.log({email, password})
            // Gọi API bằng axios
            console.log(import.meta.env.VITE_API_URL);
            const response = await axiosInstance.post("/Auth/login", { email, password });
    
            // Giả sử service là một hàm xử lý phản hồi từ API
            const { data, status, error } = await service(response);
    
            if (error) {
                // Nếu có lỗi từ service, ném lỗi
                throw error;
            }
    
            // Trả về dữ liệu nếu không có lỗi
            return { data, status };
    
        } catch (error) {
            // Nếu có lỗi trong quá trình gọi API hoặc xử lý, ném lỗi với thông báo chi tiết
            console.error("Login error:", error);
            throw new Error(error.response?.data?.message || "Sai thông tin đăng nhập!");
        }
    }
    ,
    async LogOut(refreshToken) {
        const response = await axiosInstance.post("/Auth/revoke-refresh-token", {refreshToken: refreshToken});
        const { data, status, error } = await service(response);
        if (error) {
            throw error;
        }
        return { data, status };    
    },
    async getById(id, schoolYear) {
        console.log({schoolYear})
        const response = await axiosInstance.get(`/Auth/user/${id}?year=${schoolYear}`);
        const { data, status, error } = await service(response);
        if (error) {
            throw error;
        }
        return { data, status };
    },
    async deleteById(id) {
        const response = await axiosInstance.delete(`/Auth/delete-user/${id}`);
        const { data, status, error } = await service(response);
        if (error) {
            throw error;
        }
        return { data, status };
    },

    async BlockAndUnblock(id) {
        const response = await axiosInstance.put(`/User/block-user/${id}`);
        const { data, status, error } = await service(response);
        console.log(data, status, error);   
        if (error) {
            throw error;
        }
        return { data, status };
    },

    async changePassword({OldPassword, NewPassword}){
        const id = getInforJwt().Id;
        console.log(id, NewPassword, OldPassword);
        const response = await axiosInstance.post(`/Auth/change-password/${id}`,{
            OldPassword, NewPassword
        });
        const { data, status, error } = await service(response);
        if (error) {
            throw error;
        }
        return { data, status };
    },

    async UpdateUser({ id, FullName, Email, Gender, PhoneNumber, Avatar, DoB }) {
        try {
            console.log("Dữ liệu gửi lên:", { id, FullName, Email, Gender, PhoneNumber, Avatar, DoB });
            const response = await axiosInstance.put(`/Teacher/update-student/${id}`, {
                FullName,
                Email,
                Gender,
                PhoneNumber,
                Avatar,
                DoB
            });

            return { data: response.data, status: response.status };
        } catch (error) {
            console.error("Lỗi khi cập nhật sinh viên:", error);
            throw error;
        }
    }
}
export default AuthService;