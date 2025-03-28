import { Phone } from "lucide-react";
import axiosInstance from "../../tools/axios.tool";
import { Avatar } from "antd";
const StudentManageService = {
    async UpdateStudent({ id, FullName, Email, Gender, Phone, Avatar, DoB }) {
        try {
            console.log("Dữ liệu gửi lên:", { id, FullName, Email, Gender, Phone, Avatar, DoB });
            const response = await axiosInstance.put(`/Teacher/update-student/${id}`, {
                FullName,
                Email,
                Gender,
                Phone,
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
export default StudentManageService;