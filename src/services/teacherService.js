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
    }
}
export default TeacherService;