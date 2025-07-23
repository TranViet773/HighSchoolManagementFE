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
    async CreateStudent({lastName, firstName, email, password, gender, phone, doB, eRole, year }) {
        try {
            const response = await axiosInstance.post("/Auth/register", {lastName, firstName, email, password, gender, phone, doB, eRole, year });
            return response; // Trả về data trực tiếp
        } catch (error) {
            throw error;
        }
    },
    async FilterStudent(codeClass, year, query, role) {
        try {
            console.log({ codeClass, year, query, role });
            const response = await axiosInstance.get("/User/filter", {
                params: { codeClass, year, query, role }
            });
            return response.data; 
        } catch (error) {
            throw error;
        }
    },

    async GetStudentsNotPassClass({year, grade}) {
        try {
            const response = await axiosInstance.get(`/User/student/not-pass-class/${year}?grade=${grade}`);
            return response.data; 
        } catch (error) {
            throw error;
        }
    }
};
export default StudentService;