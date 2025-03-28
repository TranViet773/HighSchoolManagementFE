import axiosInstance, { service } from "../tools/axios.tool";
const StudentService = {
    async GetAll(role) {
        try {
            const response = await axiosInstance.get(`/Auth/get-all/${role}`);
            return response; // Trả về data trực tiếp
        } catch (error) {
            throw error;
        }
    },
    async CreateStudent({lastName, firstName, email, password, gender, phone, doB, eRole }) {
        try {
            const response = await axiosInstance.post("/Auth/register", {lastName, firstName, email, password, gender, phone, doB, eRole });
            return response; // Trả về data trực tiếp
        } catch (error) {
            throw error;
        }
    },
    async FilterStudent(codeClass, year, query, role) {
        try {
            const response = await axiosInstance.get("/User/filter", {
                params: { codeClass, year, query, role }
            });
            return response.data; // Trả về dữ liệu từ API
        } catch (error) {
            throw error;
        }
    }
};
export default StudentService;