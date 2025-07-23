import { toast } from "react-toastify";
import axiosInstance from "../tools/axios.tool";
import { data } from "react-router-dom";
const ScoreService = {
    async GetScoreOfSubject({studentId, year, semester, subjectId}){
        try{
            const response = await axiosInstance.get(`/Score/subject/${studentId}`,{
                params: { year, studentId, semester, subjectId }
            });
            return { data: response.data, status: response.code };
        }catch(error){
            console.error("error: " + error);
            //toast.error("Lỗi: " + error);
        }
    },

    async GetScoreBoard({studentId, year, semester}){
        try{
            //semester = parseInt(semester, 10);
            const response = await axiosInstance.get(`/Score/semester/${semester}`, {
                params: { year, studentId } // 👈 Truyền vào query parameters
            });
            return { data: response.data, status: response.code };
        }catch(error){
            console.error("error: " + error);
            //toast.error("Lỗi: " + error);
        }
    },

    async InitializeScoreBoard({ studentId, year, semester }) {
        try {
            const response = await axiosInstance.post("/Score/scoreboard", null, {
                params: { studentId, year, semester }
            });
    
            return { data: response.data, status: response.status };
        } catch (e) {
            console.error("error: " + e);
            toast.error("Lỗi: " + e.message);
            return { data: null, status: 500 }; // Trả về lỗi mặc định
        }
    },

    async InitializeScoreBoardForSubject({ studentId, year, semester, subjectId }) {
        try {
            const response = await axiosInstance.post(`/Score/scoreboard/${subjectId}`, null, {
                params: { studentId, year, semester }
            });
    
            return { data: response.data, status: response.status };
        } catch (e) {
            console.error("error: " + e);
            toast.error("Lỗi: " + e.message);
            return { data: null, status: 500 }; // Trả về lỗi mặc định
        }
    },

    //Lấy danh sách điểm số 1 môn học của các học sinh học tại lớp nào đó.
    async GetScoreBySubject({ subjectId, year, semester, studentIds }) {
        try {
            const response = await axiosInstance.post(
                `/Score/teacher/subject/${subjectId}?year=${year}&semester=${semester}`, 
                studentIds  // Truyền danh sách vào body
            );
            return { data: response.data, status: response.status };
        } catch (e) {
            toast.error("Lỗi khi lấy điểm.");
            return { data: null, status: e.response?.status };
        }
    },

    //Cập nhật điểm 1 cột - 1 môn - nhiều học (giáo viên bộ môn chấm điểm)
    async UpdateScoreOfSubjectByColumn({subjectId, year, semester, scores}){
        try{
            console.log("data servie")
            
            console.log({subjectId, year, semester, scores})
            const response = await axiosInstance.put(`/Score/subject/${subjectId}?year=${year}&semester=${semester}`,scores);
            return {data: response.data, status: response.status}
        }catch(e){
            toast.error("Lỗi khi cập nhật điểm")
            console.log("Lỗi trong quá trình cập nhật điểm: " + e);
        }
    },

    async GetResultFinalTerm({studentId, year, semester}){
        try{
            const response = await axiosInstance.get(`/Score/semester/${semester}?year=${year}&studentId=${studentId}`);
            return {data: response.data, status: response.status}
        }catch(e){
            console.log("Lỗi trong quá trình lấy duwxx liệu: " + e);
        }

    },

    async GetScoreToPrint({studentId, semesterStart, semesterEnd, yearStart, yearEnd}){
        try{
            const response = await axiosInstance.get(`/Score/print/?studentId=${studentId}&semesterStart=${semesterStart}&semesterEnd=${semesterEnd}&yearStart=${yearStart}&yearEnd=${yearEnd}`);
            return {data: response.data, status: response.status}
        }catch(e){
            console.log(e);
        }
    },

    async GetResultFinalYear({studentId, year}){
        try{
            const response = await axiosInstance.get(`/Score/final-result/${studentId}/${year}`);
            return {data: response.data, status: response.status}
        }catch(e){
            console.log(e);
        }
    },
    
    async StatisticalAvgSubject({studentId, year}){
        try{
            const response = await axiosInstance.get(`/Score/statistical-avgscore/${studentId}/${year}`);
            return {data: response.data, status: response.status}
        }catch(e){
            console.log(e);
        }
    },

    async GetScoreBoardAllStudentOfClassInSemester({classId, semester, year}){
        try{
            const response = await axiosInstance.get(`/Score/score-all-student/${classId}?year=${year}&semester=${semester}`);
            return {data: response.data, status: response.status}
        }catch(e){
            console.log(e);
        }
    },

    async GetFinalResultStudentsInClass({classId, semester, year}){
        try{
            const response = await axiosInstance.get(`/Score/final-result-class/${classId}?year=${year}&semester=${semester}`);
            return {data: response.data, status: response.status}
        }catch(e){
            console.log(e);
            return {error: e}
        }
    },

    async GetScoreRatioOfClass({classId, semester, year, subjectId}){
        try{
            const response = await axiosInstance.get(`/Score/ratio-score/${classId}/subject/${subjectId}?year=${year}&semester=${semester}`);
            return {data: response.data, status: response.status}
        }catch(e){
            console.log(e);
            return {error: e}
        }
    },
}
export default ScoreService;