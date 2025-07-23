import { toast } from "react-toastify";
import axiosInstance from "../tools/axios.tool";

const ClassService = {
    async getAll(year) {
        try {
            const response = await axiosInstance.get("/Class/get-all-by-year", {
                params: { year }  // Truyền tham số đúng cách
            });
            return { data: response.data, status: response.status };
        } catch (error) {
            return { error: error.response?.data || "Lỗi không xác định", status: error.response?.status || 500 };
        }
    },
    async createClass(className, academicYear, advisor) {
        try {
            const response = await axiosInstance.post("/Class/create", {
                classes_Name: className,  
                year: academicYear,      
                teacher_Id: advisor
            });
    
            return { data: response.data, status: response.status };
        } catch (error) {
            console.error("Lỗi API:", error.response.data);
            return { error: error.response?.data || "Lỗi không xác định", status: error.response?.status || 500 };
        }
    },
    
    async deleteClass(id) {
        try {
            const response = await axiosInstance.delete(`/Class/delete/${id}`);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { error: error.response?.data || "Lỗi không xác định", status: error.response?.status || 500 };
        }
    },

    async getClass(id) {
        try {
            const response = await axiosInstance.get(`/Class/get-by-id/${id}`);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { error: error.response?.data || "L��i không xác đ��nh", status: error.response?.status || 500 };
        }
    },
    
    async getByGrade({grade, year}) {
        try {
            const response = await axiosInstance.get(`/Class/get-by-grade`, {
                params: { grade, year }
            });
            return { data: response.data, status: response.status };
        } catch (error) {
            return { error: error.response?.data || "L��i không xác đ��nh", status: error.response?.status || 500 };
        }
    },

    async deleteStudentFromClass(studentCode, classId) {
        try {
            const response = await axiosInstance.delete("/Class/delete-student", {
                params: {
                    studentCode: studentCode,
                    classId: classId
                }
            });
            return { data: response.data, status: response.status };
        } catch (error) {
            return { error: error.response?.data || "Lỗi không xác định", status: error.response?.status || 500 };
        }
    },
    

    async addStudentToClass(studentCode, classId, year) {
        try {
            const response = await axiosInstance.post(`/Class/add-student?studentCode=${studentCode}&classId=${classId}&year=${year}`);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { 
                error: error.response?.data || "Lỗi không xác định", 
                status: error.response?.status || 500 
            };
        }
    },

    async changeStudentToClass(studentCode, classId, year) {
        try {
            const response = await axiosInstance.post(`/Class/change-student?studentCode=${studentCode}&classId=${classId}&year=${year}`);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { 
                error: error.response?.data || "Lỗi không xác định", 
                status: error.response?.status || 500 
            };
        }
    },

    async changeStudentsToClass(studentCodes, classId, year) {
        try {
            console.log({studentCodes, classId, year});
            const response = await axiosInstance.post(`/Class/change-students/class/${classId}?year=${year}`, studentCodes);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { 
                error: error.response?.data || "Lỗi không xác định", 
                status: error.response?.status || 500 
            };
        }
    },
    
    // Laay danh sách lớp học mà giáo viên đó giảng dạy.
    async getClassByTeacher({id, year, semester}){
        try{
            console.log({id, year, semester})
            const response = await axiosInstance.get(`/Class/teacher/${id}?year=${year}&semester=${semester}`);
            return {data: response.data, status: response.code}
        }catch(error){
           toast.error("Lỗi: " + error);
        }
    },

    async AdvanceStudentToNextClass({oldClassId, newClassId, year}){
        try{
            const response = await axiosInstance.post(`/Class/advance-to-next-class?oldClassId=${oldClassId}&newClassId=${newClassId}&year=${year}`, null);
            return {data: response.data, status: response.code}
        }catch(error){
           toast.error("Lỗi: " + error);
        }
    },

    async CreateClassToAdvance({listCodeClass, year}){
        try{
            console.log(listCodeClass)
            const response = await axiosInstance.post(`/Class/create-class-to-advance?year=${year}`, listCodeClass);
            return {data: response.data, status: response.code}
        }catch(error){
            console.log(error)
           toast.error("Lỗi: " + error);
        }
    },

    async UpdateAdvisorForClass({classId, teacher_Id, year, semester}){
        try{
            console.log({classId, teacher_Id, year, semester});
            const response = await axiosInstance.put(`/Class/advisor/${classId}?teacherId=${teacher_Id}&year=${year}&semester=${semester}`);
            return {data: response.data, status: response.code}
        }catch(error){
           toast.error("Lỗi: " + error);
           console.log(error)
        }
    },
    
    async getClassByStudent({id}){
        try{
            const response = await axiosInstance.get(`/Class/student/${id}`);
            return {data: response.data, status: response.code}
        }catch(error){
           toast.error("Lỗi: " + error);
        }
    },

    //Nâng lớp cho nhiều học sinh (ở lại)
    async AdvanceClassForStudents(studentCodes, classId, year) {
        try {
            const response = await axiosInstance.post(`/Class/advance-student/class/${classId}?year=${year}`, studentCodes);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { 
                error: error.response?.data || "Lỗi không xác định", 
                status: error.response?.status || 500 
            };
        }
    } 
};

export default ClassService;
