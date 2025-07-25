import { toast } from "react-toastify";
import axiosInstance from "../tools/axios.tool";
const SubjectService = {
    async getAll(){
        try {
            const response = await axiosInstance.get(`/Subject/get-all`);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async getById(id) {
        try {
            const response = await axiosInstance.get(`/Subject/get-by-id/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    async createSubject({subject_Name, subject_ScoringType}){
        try {
            const response = await axiosInstance.post(`/Subject/add`, {subject_Name: subject_Name, subject_ScoringType: subject_ScoringType});
            return response;
        } catch (error) {
            throw error;
        }
    },
    async deleteSubject({id}){
        try {
            const response = await axiosInstance.delete(`/Subject/delete/${id}`, {
                name
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    async assignTeacherForSubject({ subject_id, teacher_id, class_id, year }) {
        try {
            console.log(subject_id, teacher_id, class_id, year);
            const response = await axiosInstance.post(`/Subject/assign-teacher`, null, {
                params: {
                    subjectId: subject_id,
                    teacherId: teacher_id,
                    classId: class_id,
                    year: year
                }
            });
            return response;
        } catch (error) {
            throw error;
        }
    },
    

    async updateTeacherForSubject({subject_id, teacher_id, class_id, year}){
        try {
            console.log(subject_id, teacher_id, class_id);
            const response = await axiosInstance.put(`/Subject/update-assigned-teacher`, null, {
                params:
                {
                    subjectId: subject_id,
                    teacherId: teacher_id,
                    classId: class_id,
                    year: year
                }
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    async deleteTeacherFromSubject({ subject_id, teacher_id, class_id }) {
        try {
            console.log(subject_id, teacher_id, class_id);
            const response = await axiosInstance.delete(`/Subject/delete-assigned-teacher`, {
                params: {
                    subjectId: subject_id,
                    teacherId: teacher_id,
                    classId: class_id
                }
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    async getTeachingByClass({classId, year, semester}) {
        try{
            const response = await axiosInstance.get(`/Subject/teacher-by-subject/${classId}?year=${year}&semester=${semester}`);
            return response.data;
        }catch(error){
            toast.error(error);
        }
    },

    async getTeachingBySubject({subjectId, year, grade}){
        try{
            const response = await axiosInstance.get(`/Subject/teaching-by-subject/${subjectId}?year=${year}&grade=${grade}`);
            return response.data;
        }catch(error){
            toast.error(error);
        }
    },

    async getTeachingByTeacher({year}){
        try{
            const response = await axiosInstance.get(`/Subject/teaching-by-teachers?year=${year}`);
            return response.data;
        }catch(error){
            toast.error(error);
        }
    }
    
}

export default SubjectService;