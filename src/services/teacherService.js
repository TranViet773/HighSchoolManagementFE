import axiosInstance from "../tools/axios.tool";
const TeacherService ={
    async getBySubjectAndClass(subjectId, classId){
        try {
            const response = await axiosInstance.get("/Teacher/get-by-subject",{
                params: {
                    subjectId: subjectId,
                    classId: classId
                }
            });
            return response;
        } catch (error) {
            throw error;
        }
    },
    //... other methods for Teacher service (get, update, delete, create)

    async getClassAndStudentByAdvisor({teacherId, year}){
        try {
            const response = await axiosInstance.get("/Teacher/get-class-and-student-by-advisor",{
                params: {
                    teacherId: teacherId,
                    year: year
                }
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    async getListClassAndStudentByAdvisor({teacherId}){
        try {
            const response = await axiosInstance.get(`/Teacher/advisor/${teacherId}/class/student`);
            return {data: response.data};
        } catch (error) {
            throw error;
        }
    },

    async getAdvisorByStudent({classId, year, semester}){
        try {
            const response = await axiosInstance.get(`/Teacher/advisor/${classId}?year=${year}&semester=${semester}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async getAdvisorsInYear(year){
        try {
            const response = await axiosInstance.get(`/Teacher/advisors/${year}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async getTimeLineTeaching(teacherId){
        try {
            const response = await axiosInstance.get(`/Teacher/teaching/timeline/${teacherId}`);
            return response;
        } catch (error) {
            throw error;
        }
    }


}
export default TeacherService;